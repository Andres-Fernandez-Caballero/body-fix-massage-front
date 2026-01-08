import { LoginSchemaType } from "@/contracts/schemas/auth/LoginSchema";
import { authApi } from "@/data/api/auth.api";
import { useAuthStore } from "@/data/store/auth.storage";
import { useEffect, useState } from "react";
import { secureSafe, secureGet, secureDelete } from "@/lib/store";



export function useAuth() {
  const [errors, setErrors] = useState<string[]>([]);

  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setAuthState = useAuthStore((s) => s.setAuthState);

  // 🔹 Hydration inicial
  useEffect(() => {
    (async () => {
      const token = await secureGet("authToken");
      const user = await secureGet("user");
      

      if (token) setToken(token);
      if (user) {
        setUser(JSON.parse(user));
        setAuthState("authenticated");
      } else {
        setAuthState("unauthorized");
      }
    })();
  }, []);

  const login = async (data: LoginSchemaType): Promise<'authenticated' | 'unauthorized' | 'processing' | 'error'> => {
    setAuthState("processing");
    setErrors([]);

    try {
      const response = await authApi.login(data);

      const { token, user } = response.data;

      await secureSafe("authToken", token);
      await secureSafe("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      setAuthState("authenticated");
      return "authenticated";

    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors(["Invalid credentials"]);
      } else {
        setErrors(["Server error"]);
      }
      setAuthState("error");
      return 'unauthorized'
    }

  };

  const logout = async () => {
    setAuthState("processing");
    try {
      await authApi.logout();
    } catch (error: any) {
      setAuthState("error");
    }finally{
      await secureDelete("authToken");
      await secureDelete("user");
      setAuthState("unauthorized");
      setToken("");
      clearUser();
    }
  };

  return {
    login,
    logout,
    authState: useAuthStore((s) => s.authState),
    errors,
    isAuthenticated: useAuthStore((s) => s.isAuthenticated),
    user: useAuthStore((s) => s.user),
  };
}
