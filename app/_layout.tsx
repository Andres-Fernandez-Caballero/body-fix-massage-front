import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useNotifications } from "@/hooks/use-notifications"

export default function RootLayout() {


  const { registerForPushNotificationsAsync, notification } = usePushNotifications();
  const { toast } = useToast();
  const { authState } = useAuth();
  const { loadNotifications } = useNotifications();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (authState === "authenticated") {
      loadNotifications();
    }
  }, [authState]);

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.request.content.title ?? "Notification",
        description: notification.request.content.body ?? "",
      });
    }
  }, [notification]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(therapist)" />
      </Stack>
      <Toaster />
    </SafeAreaProvider>
  )
}
