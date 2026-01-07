import { Stack } from "expo-router"

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="client-login" />
      <Stack.Screen name="client-register" />
      <Stack.Screen name="therapist-login" />
      <Stack.Screen name="therapist-register" />
    </Stack>
  )
}
