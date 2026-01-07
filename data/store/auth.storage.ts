import { create} from 'zustand';
import { User } from '@/contracts/models/user.interface';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user: User) => {
        SecureStore.setItemAsync('authToken', user.token); // TODO: revisar logica
        set({ user, isAuthenticated: true })},
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));