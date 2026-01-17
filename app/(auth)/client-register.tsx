"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/contexts/ThemeContext"
import { getAuthLoginStyles } from "@/styles/themedStyles"

export default function ClientRegisterScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const dynamicStyles = getAuthLoginStyles(colors)

  const handleRegister = async () => {
    // TODO: Implement API call
    console.log("Register:", { name, email, phone, password })
    router.replace("/(client)/home")
  }

  return (
    <KeyboardAvoidingView style={dynamicStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent} bounces={false}>
        <TouchableOpacity style={dynamicStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Create Account</Text>
          <Text style={dynamicStyles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={dynamicStyles.form}>
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Full Name</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
            />
          </View>

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
            <Text style={dynamicStyles.label}>Phone Number</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.icon}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Password</Text>
            <View style={dynamicStyles.passwordContainer}>
              <TextInput
                style={dynamicStyles.passwordInput}
                placeholder="Create a password"
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

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Confirm Password</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Confirm your password"
              placeholderTextColor={colors.icon}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={dynamicStyles.loginButton} onPress={handleRegister}>
            <Text style={dynamicStyles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/client-login")}>
              <Text style={dynamicStyles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
