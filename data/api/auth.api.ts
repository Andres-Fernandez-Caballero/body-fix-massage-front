import { LoginSchemaType } from '@/contracts/schemas/auth/LoginSchema';
import { axiosInstance } from './axios.instance';
import { User } from '@/contracts/models/user.interface';

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    token: string;
    user: User;
}

interface LogoutResponse {
    message: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const authApi = {
    login: (data: LoginRequest) => axiosInstance.post<LoginResponse>('/api/v1/auth/login', data),
    register: (data: RegisterRequest) => axiosInstance.post<RegisterResponse>('/api/v1/auth/register', data),
    logout: () => axiosInstance.post<LogoutResponse>('/api/v1/auth/logout'),
}