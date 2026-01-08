import { LoginSchemaType } from '@/contracts/schemas/auth/LoginSchema';
import axios from './axios.instance';
import { User } from '@/contracts/models/user.interface';

interface LoginResponse {
    token: string;
    user: User;
}

export const authApi = {
    login: (data: LoginSchemaType) => axios.post<LoginResponse>('/api/v1/auth/login', data),
    register: (data: any) => axios.post('/api/v1/auth/register', data),
    logout: () => axios.post('/api/v1/auth/logout'),
}