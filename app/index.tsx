"use client"
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { getWelcomeStyles } from "@/styles/themedStyles"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  const router = useRouter()
  const { authState, user } = useAuth()
  const { colors, isDark } = useTheme()

  useEffect(() => {
    if (authState === "authenticated") {
      router.replace(user?.role === "massage_therapist" ? "(therapist)/dashboard" : "(client)/home")
    }
  }, [authState, user])

  const gradientColors: [string, string] = isDark ? ["#1F2B43", "#2D3748"] : ["#f4cf3dff", "#c7ad2dff"]
  const dynamicStyles = getWelcomeStyles(colors, isDark)

  return (
    <View style={dynamicStyles.container}>
      <LinearGradient
        key={isDark ? "dark" : "light"}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={dynamicStyles.gradient}
      >
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.logoContainer}>
            <Text style={dynamicStyles.logo}>BodyFix</Text>
            <Text style={dynamicStyles.tagline}>Professional Massage at Home</Text>
          </View>

          <Image source={{ uri: "/relaxing-spa-massage-therapy-illustration.jpg" }} style={dynamicStyles.illustration} resizeMode="contain" />

          <View style={dynamicStyles.buttonContainer}>
            <TouchableOpacity style={dynamicStyles.primaryButton} onPress={() => router.push("/(auth)/client-login")}>
              <Text style={dynamicStyles.primaryButtonText}>Book a Massage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.secondaryButton} onPress={() => router.push("/(auth)/therapist-login")}>
              <Text style={dynamicStyles.secondaryButtonText}>I'm a Therapist</Text>
            </TouchableOpacity>
          </View>

          <View style={dynamicStyles.featuresContainer}>
            <View style={dynamicStyles.feature}>
              <Text style={dynamicStyles.featureIcon}>⏱️</Text>
              <Text style={dynamicStyles.featureText}>On-Demand Booking</Text>
            </View>
            <View style={dynamicStyles.feature}>
              <Text style={dynamicStyles.featureIcon}>✅</Text>
              <Text style={dynamicStyles.featureText}>Certified Therapists</Text>
            </View>
            <View style={dynamicStyles.feature}>
              <Text style={dynamicStyles.featureIcon}>🏠</Text>
              <Text style={dynamicStyles.featureText}>At Your Home</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}
