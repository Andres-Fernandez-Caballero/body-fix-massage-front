"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3D64F4", "#2D4AC7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BodyFix</Text>
            <Text style={styles.tagline}>Professional Massage at Home</Text>
          </View>

          <Image source={{ uri: "/relaxing-spa-massage-therapy-illustration.jpg" }} style={styles.illustration} resizeMode="contain" />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(auth)/client-login")}>
              <Text style={styles.primaryButtonText}>Book a Massage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(auth)/therapist-login")}>
              <Text style={styles.secondaryButtonText}>I'm a Therapist</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⏱️</Text>
              <Text style={styles.featureText}>On-Demand Booking</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Certified Therapists</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏠</Text>
              <Text style={styles.featureText}>At Your Home</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#E0E7FF",
    marginTop: 8,
    fontWeight: "500",
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.25,
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 12,
    marginTop: 20,
  },
  feature: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
})
