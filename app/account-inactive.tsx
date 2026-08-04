import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/data/store/auth.storage"

const STATE_COLORS: Record<string, string> = {
  danger: Colors.light.error,
  warning: Colors.light.warning,
  success: Colors.light.success,
}

export default function AccountInactiveScreen() {
  const router = useRouter()
  const { logout } = useAuth()
  const state = useAuthStore((s) => s.user?.state)
  const stateColor = (state?.color && STATE_COLORS[state.color]) ?? Colors.light.error

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: `${stateColor}22` }]}>
        <Ionicons name="alert-circle-outline" size={40} color={stateColor} />
      </View>

      <Text style={styles.title}>{state?.label ?? "Cuenta inactiva"}</Text>
      <Text style={styles.description}>
        {state?.description ?? "Tu cuenta no está habilitada para usar la aplicación en este momento."}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: Colors.light.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
