
import { LoginSchemaType } from "@/contracts/schemas/auth/LoginSchema";
import { authApi } from "@/data/api/auth.api";
import { useAuthStore } from "@/data/store/auth.storage";
import { useState } from "react";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const logoutStore = useAuthStore((state) => state.clearUser);
    const setUserStore = useAuthStore((state) => state.setUser);

    const login = async(data: LoginSchemaType) => {
        setLoading(true);
        try {
            const user = await authApi.login(data);
            setUserStore(user.data);
        } finally {
            setLoading(false);
        }
    }

    const logout = async() => {
        setLoading(true);
        try {
            await authApi.logout();
            logoutStore();
        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        logout,
        loading,
        isAuthenticated: useAuthStore((state) => state.isAuthenticated),
        user: useAuthStore((state) => state.user),
    }
}