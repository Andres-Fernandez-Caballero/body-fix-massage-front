import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useEffect } from "react"

export default function RootLayout() {


  const { registerForPushNotificationsAsync, notification } = usePushNotifications();
  const { toast } = useToast();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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
