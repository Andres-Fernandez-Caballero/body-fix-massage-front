import { LoginSchemaType } from '@/contracts/schemas/auth/LoginSchema';
import { axiosInstance } from './axios.instance';
import { User } from '@/contracts/models/user.interface';
import { Platform } from 'react-native';

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

interface UpdateProfileRequest {
    name: string;
    email: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
}

export const authApi = {
    login: (data: LoginRequest) => axiosInstance.post<LoginResponse>('/api/v1/auth/login', data),
    register: (data: RegisterRequest) => axiosInstance.post<RegisterResponse>('/api/v1/auth/register', data),
    logout: () => axiosInstance.post<LogoutResponse>('/api/v1/auth/logout'),
    forgotPassword: (email: string) => axiosInstance.post('/api/v1/auth/forgot-password', { email }),
    updateProfile: (data: UpdateProfileRequest) => axiosInstance.put<{ user: User }>('/api/v1/users/me', data),
    uploadProfilePhoto: (uri: string, mimeType: string, webFile?: File) => {
        const formData = new FormData();
        const filename = uri.split('/').pop() ?? 'photo.jpg';

        if (Platform.OS === 'web') {
            // En el browser usamos el objeto File nativo que devuelve expo-image-picker.
            // Si por algún motivo no viene (edge case), hacemos fetch del blob URI.
            if (webFile) {
                formData.append('photo', webFile, webFile.name || filename);
            }
            // No seteamos Content-Type: el browser lo pone solo con el boundary correcto.
            return axiosInstance.post<{ user: User }>('/api/v1/users/me/photo', formData, {
                headers: { 'Content-Type': undefined },
            });
        }

        // React Native: usa el objeto especial que entiende el XHR nativo.
        (formData as any).append('photo', { uri, name: filename, type: mimeType } as any);
        return axiosInstance.post<{ user: User }>('/api/v1/users/me/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
}