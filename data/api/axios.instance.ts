// data/api/axios.instance.ts
import axios from 'axios';
import { secureDelete, secureGet } from '@/lib/store';
import { router } from 'expo-router';
import { useAuthStore } from '@/data/store/auth.storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost';

let isLoggingOut = false;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/* =============================== */
/* REQUEST INTERCEPTOR             */
/* =============================== */
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await secureGet('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =============================== */
/* RESPONSE INTERCEPTOR            */
/* =============================== */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    // --- 401 → logout automático (solo en rutas protegidas, no en login/register) ---
    const requestUrl = error.config?.url ?? '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (status === 401 && !isLoggingOut && !isAuthEndpoint) {
      isLoggingOut = true;

      await secureDelete('authToken');
      await secureDelete('user');

      const { clearUser, setAuthState } = useAuthStore.getState();
      clearUser();
      setAuthState('unauthorized');

      router.replace('/');

      isLoggingOut = false;
    }

    return Promise.reject(error);
  }
);
