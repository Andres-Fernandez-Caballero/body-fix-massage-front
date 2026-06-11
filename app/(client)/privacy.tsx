import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

const SECTIONS = [
  {
    title: "1. ¿Qué información recopilamos?",
    body: "Recopilamos la información que nos proporcionás al registrarte: nombre, dirección de correo electrónico y número de teléfono. También recopilamos datos de uso de la aplicación, como las reservas realizadas, preferencias y calificaciones.",
  },
  {
    title: "2. ¿Cómo usamos tu información?",
    body: "Utilizamos tus datos para gestionar tu cuenta, procesar reservas, enviarte notificaciones sobre tus turnos y mejorar la experiencia de la aplicación. No utilizamos tus datos para publicidad de terceros.",
  },
  {
    title: "3. Compartición de datos",
    body: "Compartimos únicamente la información necesaria con los locales y masajistas que hayas reservado (nombre y datos de contacto). No vendemos ni cedemos tu información personal a terceros con fines comerciales.",
  },
  {
    title: "4. Almacenamiento y seguridad",
    body: "Tus datos se almacenan en servidores seguros. Utilizamos cifrado SSL/TLS para todas las comunicaciones. Las contraseñas se almacenan de forma hasheada y nunca en texto plano. Revisamos periódicamente nuestras medidas de seguridad.",
  },
  {
    title: "5. Retención de datos",
    body: "Conservamos tus datos mientras tu cuenta esté activa. Si eliminás tu cuenta, tus datos personales serán eliminados en un plazo de 30 días, salvo aquellos que debamos conservar por obligaciones legales.",
  },
  {
    title: "6. Tus derechos",
    body: "Tenés derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, podés hacerlo desde la sección 'Editar perfil' de la app o enviando un correo a privacidad@bodyfix.com.ar.",
  },
  {
    title: "7. Cookies y tecnologías similares",
    body: "La aplicación utiliza almacenamiento local (AsyncStorage / SecureStore) para mantener tu sesión iniciada. No utilizamos cookies de seguimiento de terceros.",
  },
  {
    title: "8. Cambios en la Política de Privacidad",
    body: "Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través de la aplicación. El uso continuado del servicio implica la aceptación de la política actualizada.",
  },
]

export default function PrivacyScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate("/(client)/profile")}>
          <Ionicons name="arrow-back" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroBadge}>
          <Ionicons name="shield-checkmark-outline" size={28} color={Colors.light.primary} />
        </View>
        <Text style={styles.intro}>
          En BodyFix nos tomamos muy en serio la privacidad de tus datos. Esta política describe qué información recopilamos, cómo la usamos y cómo la protegemos.
        </Text>
        <Text style={styles.lastUpdated}>Última actualización: enero 2025</Text>

        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Para ejercer tus derechos o consultas sobre privacidad, contactanos en{" "}
            <Text style={styles.footerEmail}>privacidad@bodyfix.com.ar</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  heroBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 28,
    marginBottom: 16,
  },
  intro: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
    marginBottom: 28,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 22,
  },
  footer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.icon,
    lineHeight: 20,
    textAlign: "center",
  },
  footerEmail: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
})
