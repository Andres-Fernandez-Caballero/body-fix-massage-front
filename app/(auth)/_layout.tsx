import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/hooks/use-auth"

export default function AuthLayout() {

  const { authState, user } = useAuth()

  if (authState === "authenticated") {
    
    return <Redirect href={user?.role === "massage_therapist" ? "(therapist)/dashboard" : "(client)/home"} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="client-login" />
      <Stack.Screen name="client-register" />
      <Stack.Screen name="therapist-login" />
      <Stack.Screen name="therapist-register" />
    </Stack>
  )
}
