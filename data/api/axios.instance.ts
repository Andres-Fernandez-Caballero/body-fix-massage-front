// data/api/axios.instance.ts
import axios from 'axios';
import { secureDelete, secureGet } from '@/lib/store';
// import { router } from 'expo-router'; // si lo usás acá

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

    // --- 401 → logout automático ---
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      await secureDelete('authToken');

      // 🔴 elegí una sola estrategia:
      // router.replace('/(auth)/login');
      // o emitir un evento global de logout

      isLoggingOut = false;
    }

    return Promise.reject(error);
  }
);
