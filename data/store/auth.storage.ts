import { create} from 'zustand';
import { User } from '@/contracts/models/user.interface';

type AuthDataState = 'processing' | 'authenticated' | 'error' | 'unauthorized';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string;
    authState: AuthDataState;
    setAuthState: (state: AuthDataState) => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    token: '',
    authState: 'unauthorized',
    setAuthState(state: AuthDataState) { set({ authState: state }) },
    setUser: (user: User) => { set({ user, isAuthenticated: true }) },
    setToken: (token: string) => set({ token }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));