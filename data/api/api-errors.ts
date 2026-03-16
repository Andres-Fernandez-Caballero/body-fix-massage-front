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

    // 400 / 409 → error de negocio
    if (status === 400 || status === 409) {
      return {
        type: 'validation',
        status,
        message:
          error.response?.data?.message ??
          error.response?.data?.error ??
          'Invalid request',
      };
    }

    // 500+
    if (status && status >= 500) {
      return {
        type: 'server',
        status,
        message: 'Server error. Please try again later.',
      };
    }
  }

  return {
    type: 'unknown',
    message: 'Unexpected error occurred.',
  };
}
