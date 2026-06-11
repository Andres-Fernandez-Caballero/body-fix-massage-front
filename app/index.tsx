"use client"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { useAuth } from "@/hooks/use-auth"
import { useNotifications } from "@/hooks/use-notifications"
import { useEffect } from "react"
import { secureGet } from "@/lib/store"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  const router = useRouter()
  const { authState, user } = useAuth()
  const { loadNotifications } = useNotifications()

  /* ===========================
     Service Worker (WEB)
     =========================== */
  useEffect(() => {
    if (Platform.OS !== "web") return
    if (!("serviceWorker" in navigator)) return

    let handler: any

    async function setupSW() {
      await navigator.serviceWorker.register("/sw.js")

      const reg = await navigator.serviceWorker.ready

      const token = await secureGet("authToken")
      if (token && reg.active) {
        reg.active.postMessage({
          type: "SET_AUTH_TOKEN",
          token,
        })
      }

      handler = (event: MessageEvent) => {
        if (event.data?.type === "NEW_NOTIFICATION") {
          const { title, body } = event.data.payload
          console.log("EVENTO PUSH", title)
          if (token) {
            loadNotifications().then()
          }
        }
      }

      navigator.serviceWorker.addEventListener("message", handler)
    }

    setupSW()

    return () => {
      if (handler) {
        navigator.serviceWorker.removeEventListener("message", handler)
      }
    }
  }, [])


  /* ===========================
  Auth redirect
  =========================== */
  useEffect(() => {
    if (authState === "authenticated") {
      router.replace(
        user?.role === "massage_therapist"
        ? "(therapist)/dashboard"
        : "(client)/explorer"
      )
    }
  }, [authState, user])

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#C17A5C", "#8C5240", "#5A3228"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        {/* Subtle warm overlay circles */}
        <View style={styles.overlayCircle1} />
        <View style={styles.overlayCircle2} />

        <View style={styles.content}>
          {/* ── Logo ── */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={22} color="#C17A5C" />
            </View>
            <Text style={styles.logo}>BodyFix</Text>
            <Text style={styles.tagline}>
              Masajes profesionales, a tu alcance
            </Text>
          </View>

          {/* ── Ilustración ── */}
          <Image
            source={{ uri: "/relaxing-spa-massage-therapy-illustration.jpg" }}
            style={styles.illustration}
            resizeMode="contain"
          />

          {/* ── Botones ── */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(auth)/client-login")}
            >
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
              <Ionicons name="arrow-forward" size={18} color="#C17A5C" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(auth)/client-register")}
            >
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* ── Features ── */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="flash" size={18} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.featureText}>A demanda</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.feature}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="shield-checkmark" size={18} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.featureText}>Certificados</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.feature}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="calendar" size={18} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.featureText}>Fácil reserva</Text>
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
  overlayCircle1: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    top: -width * 0.4,
    left: -width * 0.1,
  },
  overlayCircle2: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    bottom: -width * 0.2,
    right: -width * 0.2,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 44,
  },
  logoContainer: {
    alignItems: "center",
    gap: 8,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    fontSize: 44,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.78)",
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  illustration: {
    width: width * 0.72,
    height: height * 0.26,
    marginVertical: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#C17A5C",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.45)",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  featuresContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  feature: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  featureIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  featureDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.1,
  },
})
