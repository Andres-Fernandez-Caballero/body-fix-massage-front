import { secureGet } from '@/lib/store';
import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

/* =============================== */
/*   REQUEST INTERCEPTOR           */
/* =============================== */
axiosInstance.interceptors.request.use(
    async (config) => {
        console.log(config);
        const token = await secureGet('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

/* =============================== */
/*   RESPONSE INTERCEPTOR          */
/* =============================== */
axiosInstance.interceptors.response.use(
    
    (response) => {
        console.log('response', response)
        return response
    },
    async (error) => {
        console.log('RESPONSE ERROR', {
            status: error?.response?.status,
            data: error?.response?.data,
            url: error?.config?.url,
        });
        const status = error?.response?.status;

        if (status === 401) {
            // token inválido o expirado
            await SecureStore.deleteItemAsync('authToken');
            // acá normalmente disparás logout / redirect
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
