// lib/api-error.ts
import axios from 'axios';

export type ApiErrorType = 'validation' | 'server' | 'unknown';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
}

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data   = error.response?.data;

    // 401 → no autenticado / credenciales incorrectas
    if (status === 401) {
      return {
        type: 'validation',
        status,
        message: data?.message ?? data?.error ?? 'Credenciales incorrectas.',
      };
    }

    // 403 → sin permiso
    if (status === 403) {
      return {
        type: 'validation',
        status,
        message: data?.message ?? 'No tenés permiso para realizar esta acción.',
      };
    }

    // 422 → errores de validación de Laravel
    if (status === 422) {
      const errors = data?.errors as Record<string, string[]> | undefined;
      let message = data?.message ?? 'Datos inválidos';
      if (errors) {
        const firstField = Object.values(errors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
          message = firstField[0];
        }
      }
      return { type: 'validation', status, message };
    }

    // 400 / 409 → error de negocio
    if (status === 400 || status === 409) {
      return {
        type: 'validation',
        status,
        message:
          data?.message ??
          data?.error ??
          'Solicitud inválida.',
      };
    }

    // 500+
    if (status && status >= 500) {
      return {
        type: 'server',
        status,
        message: 'Error en el servidor. Por favor intentá de nuevo.',
      };
    }
  }

  return {
    type: 'unknown',
    message: 'Ocurrió un error inesperado.',
  };
}
