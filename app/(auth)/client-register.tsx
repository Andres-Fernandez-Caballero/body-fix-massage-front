"use client"

import React, { useState } from "react"
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
} from "react-native"
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/use-auth"
import { RegisterSchema } from "@/contracts/schemas/auth/RegisterSchema"
import { useToast } from "@/hooks/use-toast"

// ── Helpers de fecha: state interno en Date, formato AAAA-MM-DD para el schema ──
function parseDateString(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateToString(date: Date): string {
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateForDisplay(value: string): string {
  const date = parseDateString(value)
  if (!date) return ''
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type Gender = 'male' | 'female' | 'other'

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male',   label: 'Masculino' },
  { value: 'female', label: 'Femenino'  },
  { value: 'other',  label: 'Otro'      },
]

export default function ClientRegisterScreen() {
  const router = useRouter()
  const { register, authState, errors } = useAuth()
  const { toast } = useToast()

  const [name,            setName]            = useState("")
  const [lastName,        setLastName]        = useState("")
  const [email,           setEmail]           = useState("")
  const [phone,           setPhone]           = useState("")
  const [birthDate,       setBirthDate]       = useState("")
  const [showDatePicker,  setShowDatePicker]  = useState(false)
  const [gender,          setGender]          = useState<Gender | "">("")
  const [password,        setPassword]        = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword,    setShowPassword]    = useState(false)

  const isLoading = authState === "processing"

  const handleRegister = async () => {
    const result = RegisterSchema.safeParse({
      name,
      last_name:            lastName,
      phone,
      birth_date:           birthDate,
      gender:               gender || undefined,
      email,
      password,
      password_confirmation: confirmPassword,
    })

    if (!result.success) {
      const firstError = result.error.issues[0]
      toast({
        title:       "Datos inválidos",
        description: firstError?.message ?? "Revisá tu información",
        variant:     "danger",
      })
      return
    }

    const outcome = await register(result.data)
    if (outcome === "authenticated") {
      router.replace("/(client)/explorer")
    } else {
      toast({
        title:       "Error al registrarse",
        description: errors?.[0] ?? "No se pudo crear la cuenta. Intentá de nuevo.",
        variant:     "danger",
      })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Brand header strip */}
        <View style={styles.brandHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
          <View style={styles.brandBadge}>
            <Ionicons name="leaf" size={16} color="#fff" />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Unite a BodyFix y reservá tu primer masaje</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu nombre"
                placeholderTextColor={Colors.light.icon}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Apellido */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu apellido"
                placeholderTextColor={Colors.light.icon}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu email"
                placeholderTextColor={Colors.light.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                inputMode="email"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Teléfono */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número de teléfono</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: 1136759311"
                placeholderTextColor={Colors.light.icon}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                inputMode="tel"
              />
            </View>
          </View>

          {/* Fecha de nacimiento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            {Platform.OS === "web" ? (
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
                {React.createElement("input", {
                  type: "date",
                  value: birthDate,
                  max: formatDateToString(new Date()),
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value),
                  style: {
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 15,
                    color: Colors.light.text,
                    fontFamily: "inherit",
                    paddingTop: 14,
                    paddingBottom: 14,
                  } as React.CSSProperties,
                })}
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="calendar-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
                  <Text style={[styles.input, !birthDate && { color: Colors.light.icon }]}>
                    {birthDate ? formatDateForDisplay(birthDate) : "Seleccioná tu fecha de nacimiento"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={parseDateString(birthDate) ?? new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      if (Platform.OS === "android") setShowDatePicker(false)
                      if (event.type === "set" && selectedDate) {
                        setBirthDate(formatDateToString(selectedDate))
                      }
                    }}
                  />
                )}

                {Platform.OS === "ios" && showDatePicker && (
                  <TouchableOpacity style={styles.iosDoneButton} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosDoneButtonText}>Listo</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Género */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Género</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.genderChip, gender === opt.value && styles.genderChipActive]}
                  onPress={() => setGender(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.genderChipText, gender === opt.value && styles.genderChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Creá una contraseña"
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
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.light.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmá tu contraseña"
                placeholderTextColor={Colors.light.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/client-login")}>
              <Text style={styles.footerLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
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
  },
  brandHeader: {
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
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.icon,
    lineHeight: 22,
  },
  form: {
    flex: 1,
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
  iosDoneButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
  },
  iosDoneButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  eyeButton: {
    padding: 4,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
    alignItems: "center",
  },
  genderChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
  },
  genderChipTextActive: {
    color: "#fff",
  },
  registerButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "700",
  },
})
