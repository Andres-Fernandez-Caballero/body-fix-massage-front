import { Toaster } from "@/components/ui/toaster"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "@/contexts/ThemeContext"

export default function RootLayout() {


  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(therapist)" />
        </Stack>
        <Toaster />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
