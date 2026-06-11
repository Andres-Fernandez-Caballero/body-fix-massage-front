import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import * as ImagePicker from "expo-image-picker"

const ProfileSchema = z
  .object({
    name:                  z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email:                 z.email("Ingresá un email válido"),
    current_password:      z.string().optional().or(z.literal("")),
    password:              z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) => !d.password || d.password === d.password_confirmation,
    { message: "Las contraseñas no coinciden", path: ["password_confirmation"] }
  )
  .refine(
    (d) => !d.password || !!d.current_password,
    { message: "Ingresá tu contraseña actual para poder cambiarla", path: ["current_password"] }
  )

interface EditProfileScreenProps {
  accentColor: string
  accentLightColor: string
}

export function EditProfileScreen({ accentColor, accentLightColor }: EditProfileScreenProps) {
  const router = useRouter()
  const { user, updateProfile, uploadProfilePhoto, errors: authErrors } = useAuth()
  const { toast } = useToast()

  const [name,                  setName]                  = useState(user?.name ?? "")
  const [email,                 setEmail]                 = useState(user?.email ?? "")
  const [currentPassword,       setCurrentPassword]       = useState("")
  const [password,              setPassword]              = useState("")
  const [passwordConfirmation,  setPasswordConfirmation]  = useState("")
  const [showCurrentPassword,   setShowCurrentPassword]   = useState(false)
  const [showPassword,          setShowPassword]          = useState(false)
  const [showPasswordConf,      setShowPasswordConf]      = useState(false)
  const [isLoading,             setIsLoading]             = useState(false)
  const [isUploadingPhoto,      setIsUploadingPhoto]      = useState(false)
  const [localPhoto,            setLocalPhoto]            = useState<string | null>(null)

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      toast({
        title: "Permiso requerido",
        description: "Necesitamos acceso a tu galería para cambiar la foto.",
        variant: "danger",
      })
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (result.canceled || !result.assets?.[0]) return

    const asset = result.assets[0]
    setLocalPhoto(asset.uri)
    setIsUploadingPhoto(true)

    const mimeType = asset.mimeType ?? "image/jpeg"
    // En web, expo-image-picker expone asset.file (objeto File nativo del browser).
    // En native es undefined, y se usa la URI directamente.
    const webFile: File | undefined = (asset as any).file ?? undefined
    const outcome = await uploadProfilePhoto(asset.uri, mimeType, webFile)
    setIsUploadingPhoto(false)

    if (outcome === "updated") {
      toast({ title: "Foto actualizada", description: "Tu foto de perfil fue actualizada.", variant: "success" })
    } else {
      setLocalPhoto(null)
      toast({ title: "Error", description: "No se pudo subir la foto. Intentá de nuevo.", variant: "danger" })
    }
  }

  const handleSave = async () => {
    const result = ProfileSchema.safeParse({
      name,
      email,
      current_password:      currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    })

    if (!result.success) {
      toast({
        title: "Datos inválidos",
        description: result.error.errors[0]?.message ?? "Revisá los campos ingresados.",
        variant: "danger",
      })
      return
    }

    const payload: {
      name: string
      email: string
      current_password?: string
      password?: string
      password_confirmation?: string
    } = {
      name:  result.data.name,
      email: result.data.email,
    }

    if (result.data.password) {
      payload.current_password      = result.data.current_password
      payload.password              = result.data.password
      payload.password_confirmation = result.data.password_confirmation
    }

    setIsLoading(true)
    const outcome = await updateProfile(payload)
    setIsLoading(false)

    if (outcome === "updated") {
      toast({
        title: "Perfil actualizado",
        description: "Tus datos fueron guardados correctamente.",
        variant: "success",
      })
      router.navigate("/(client)/profile")
    } else {
      // authErrors[0] contiene el mensaje de error del backend (ej: "La contraseña actual es incorrecta.")
      const description = authErrors[0] ?? "No se pudo actualizar el perfil. Intentá de nuevo."
      toast({ title: "Error", description, variant: "danger" })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: accentLightColor }]} onPress={() => router.navigate("/(client)/profile")}>
            <Ionicons name="arrow-back" size={20} color={accentColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ── Foto de perfil ── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto} activeOpacity={0.8} disabled={isUploadingPhoto}>
            {(localPhoto ?? user?.profilePicture) ? (
              <Image source={{ uri: localPhoto ?? user?.profilePicture! }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Ionicons name="person" size={36} color={Colors.light.icon} />
              </View>
            )}
            <View style={[styles.avatarBadge, { backgroundColor: accentColor }]}>
              {isUploadingPhoto
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="camera" size={13} color="#fff" />
              }
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tocá para cambiar tu foto</Text>
        </View>

        <View style={styles.form}>
          {/* ── Datos personales ── */}
          <Text style={styles.sectionLabel}>Datos personales</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu nombre completo"
                placeholderTextColor={Colors.light.icon}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu email"
                placeholderTextColor={Colors.light.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* ── Cambio de contraseña ── */}
          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Cambiar contraseña</Text>
          <Text style={styles.sectionHint}>Dejá los campos en blanco si no querés cambiarla.</Text>

          {/* Contraseña actual */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña actual</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ingresá tu contraseña actual"
                placeholderTextColor={Colors.light.icon}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeButton}>
                <Ionicons name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nueva contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-open-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Colors.light.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-open-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Repetí la nueva contraseña"
                placeholderTextColor={Colors.light.icon}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry={!showPasswordConf}
              />
              <TouchableOpacity onPress={() => setShowPasswordConf(!showPasswordConf)} style={styles.eyeButton}>
                <Ionicons name={showPasswordConf ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: accentColor, shadowColor: accentColor }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.2,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.card,
    borderWidth: 3,
    borderColor: Colors.light.border,
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  avatarHint: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.light.icon,
  },
  form: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.icon,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
    marginLeft: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: Colors.light.icon,
    marginBottom: 14,
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    paddingVertical: 14,
  },
  eyeButton: {
    padding: 4,
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
})
