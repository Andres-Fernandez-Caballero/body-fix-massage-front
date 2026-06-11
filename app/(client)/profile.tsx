"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from "react-native"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  destructive?: boolean
}

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuItemIconWrapper, destructive && styles.menuItemIconDestructive]}>
        <Ionicons name={icon} size={20} color={destructive ? Colors.light.error : Colors.light.primary} />
      </View>
      <Text style={[styles.menuItemText, destructive && styles.menuItemTextDestructive]}>{label}</Text>
      {!destructive && <Ionicons name="chevron-forward" size={18} color={Colors.light.icon} />}
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleSupport = async () => {
    const url = "mailto:soporte@bodyfix.com?subject=Consulta%20de%20soporte%20-%20BodyFix"
    const canOpen = await Linking.canOpenURL(url)
    if (!canOpen) {
      toast({
        title: "Sin app de correo",
        description: "No encontramos una app de correo configurada en tu dispositivo. Escribinos a soporte@bodyfix.com",
        variant: "danger",
      })
      return
    }
    await Linking.openURL(url)
  }

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi perfil</Text>
      </View>

      {/* ── Avatar card ── */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={40} color={Colors.light.icon} />
            </View>
          )}
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="leaf" size={12} color={Colors.light.primary} />
          <Text style={styles.memberBadgeText}>Miembro BodyFix</Text>
        </View>
      </View>

      {/* ── Cuenta ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Cuenta</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="person-outline"          label="Editar perfil"    onPress={() => router.push("/(client)/edit-profile")} />
          <View style={styles.menuSeparator} />
          <MenuItem icon="notifications-outline"   label="Notificaciones"   onPress={() => router.push("/(client)/notifications")} />
        </View>
      </View>

      {/* ── Soporte ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Soporte</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="help-circle-outline"      label="Ayuda y soporte"        onPress={handleSupport} />
          <View style={styles.menuSeparator} />
          <MenuItem
            icon="document-text-outline"
            label="Términos y Condiciones"
            onPress={() => router.push("/(client)/terms")}
          />
          <View style={styles.menuSeparator} />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Política de Privacidad"
            onPress={() => router.push("/(client)/privacy")}
          />
        </View>
      </View>

      {/* ── Cerrar sesión ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.version}>BodyFix v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  profileCard: {
    marginHorizontal: 24,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 28,
    shadowColor: "#8C5240",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.card,
    borderWidth: 3,
    borderColor: Colors.light.primaryLight,
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.icon,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemIconDestructive: {
    backgroundColor: Colors.light.errorLight,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: "500",
  },
  menuItemTextDestructive: {
    color: Colors.light.error,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.errorLight,
    backgroundColor: Colors.light.errorLight,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.error,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 20,
  },
})
