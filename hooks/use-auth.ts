import { LoginSchemaType } from "@/contracts/schemas/auth/LoginSchema";
import { authApi } from "@/data/api/auth.api";
import { useAuthStore } from "@/data/store/auth.storage";
import { useCallback, useEffect, useState } from "react";
import { secureSafe, secureGet, secureDelete } from "@/lib/store";
import { parseApiError } from "@/data/api/api-errors";
import { Platform } from "react-native";
import { NotificationApi } from "@/data/api/notifications.api";



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

  const login = useCallback(
    async (data: LoginSchemaType): Promise<'authenticated' | 'unauthorized' | 'processing' | 'error'> => {
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
        
        if (Platform.OS === "web") {
          try {
            await NotificationApi.registerWebPush();
          } catch (error) {
            console.error("Failed to register web push notifications:", error);
          }
        }
        return "authenticated";

      } catch (error: any) {
        const apiError = parseApiError(error);
        setErrors([apiError.message]);
        setAuthState("error");
        return 'unauthorized'
      }

    }, []
  )

  const logout = useCallback(
    async () => {
      setAuthState("processing");
      try {
        await authApi.logout();
      } catch (error: any) {
        const apiError = parseApiError(error);
        setErrors([apiError.message]);
        setAuthState("error");
        throw apiError;
      } finally {
        await secureDelete("authToken");
        await secureDelete("user");
        setAuthState("unauthorized");
        setToken("");
        clearUser();
      }
    }, []
  );

  return {
    login,
    logout,
    authState: useAuthStore((s) => s.authState),
    errors,
    isAuthenticated: useAuthStore((s) => s.isAuthenticated),
    user: useAuthStore((s) => s.user),
  };
}
