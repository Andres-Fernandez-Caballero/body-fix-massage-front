import { LoginSchemaType } from '@/contracts/schemas/auth/LoginSchema';
import api from './axios.instance';
import { User } from '@/contracts/models/user.interface';

interface LoginResponse {
    token: string;
    user: User;
}

export const authApi = {
    login: (data: LoginSchemaType) => api.post<LoginResponse>('/api/v1/auth/login', data),
    register: (data: any) => api.post('/api/v1/auth/register', data),
    logout: () => api.post('/api/v1/auth/logout'),
}