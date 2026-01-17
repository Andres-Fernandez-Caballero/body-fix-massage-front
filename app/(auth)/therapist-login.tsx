"use client"

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
} from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { LoginSchema } from "@/contracts/schemas/auth/LoginSchema"
import { getAuthLoginStyles } from "@/styles/themedStyles"

export default function TherapistLoginScreen() {
  const router = useRouter()
  const { login, authState, user, logout } = useAuth()
  const { colors } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const dynamicStyles = getAuthLoginStyles(colors)

  const handleLogin = async () => {
    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email and password",
        variant: "danger",
      })
      return;
    }


    await login(result.data);
  
    if (authState === 'authenticated') {
      console.log(user)
      if (user?.role === 'admin'){
         toast({
        title: "Usuario sin Rol habilitado",
        description: "Este usuario no tiene un rol habilitado para usar la aplicacion",
        variant: "warning",
      })
      logout()
      }

      else if (user?.role === 'massage_therapist') return router.replace("/(therapist)/dashboard")
      else if (user?.role === 'client') return router.replace("/(client)/home")
      else toast({
        title: "Error de validacion",
        description: "No se pudo iniciar sesión",
        variant: "warning",
      })
    }
    else toast({
      title: "Error de validacion",
      description: "Credenciales invalidas",
      variant: "danger",
    })
  }

  return (
    <KeyboardAvoidingView style={dynamicStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent} bounces={false}>
        <TouchableOpacity style={dynamicStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Therapist Login</Text>
          <Text style={dynamicStyles.subtitle}>Welcome back, professional</Text>
        </View>

        <View style={dynamicStyles.form}>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Email</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.icon}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Password</Text>
            <View style={dynamicStyles.passwordContainer}>
              <TextInput
                style={dynamicStyles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={dynamicStyles.forgotPassword}>
            <Text style={dynamicStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.loginButton} onPress={handleLogin}>
            <Text style={dynamicStyles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={dynamicStyles.divider}>
            <View style={dynamicStyles.dividerLine} />
            <Text style={dynamicStyles.dividerText}>or</Text>
            <View style={dynamicStyles.dividerLine} />
          </View>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>Want to join BodyFix? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/therapist-register")}>
              <Text style={dynamicStyles.footerLink}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
