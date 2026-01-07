import axios from 'axios';

import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

/* =============================== */
/*   REQUEST INTERCEPTOR           */  
/*================================ */
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => Promise.reject(error)
)

/* =============================== */
/*   RESPONSE INTERCEPTOR          */  
/*================================ */
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 401)  
            // token invalido o expirado
            await SecureStore.deleteItemAsync('authToken');
        return Promise.reject(error);
    })

export default axiosInstance;