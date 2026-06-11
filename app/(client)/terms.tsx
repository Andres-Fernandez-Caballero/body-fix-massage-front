import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

const SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    body: "Al utilizar la aplicación BodyFix, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna de las condiciones aquí establecidas, te pedimos que no utilices la aplicación.",
  },
  {
    title: "2. Descripción del servicio",
    body: "BodyFix es una plataforma que conecta a clientes con locales de masajes y masajistas profesionales, permitiendo la reserva de turnos de manera digital. BodyFix actúa como intermediario y no es responsable por la calidad del servicio prestado por los profesionales.",
  },
  {
    title: "3. Reservas y cancelaciones",
    body: "Las reservas se confirman una vez abonada la seña correspondiente. Las cancelaciones deben realizarse con al menos 24 horas de anticipación para evitar penalidades. La devolución de la seña en caso de cancelación queda sujeta a la política del local seleccionado.",
  },
  {
    title: "4. Pagos",
    body: "Los pagos se procesan a través de pasarelas de pago seguras. BodyFix no almacena datos de tarjetas de crédito ni débito. El precio final del servicio es el indicado al momento de la reserva y puede incluir una seña previa.",
  },
  {
    title: "5. Responsabilidades del usuario",
    body: "El usuario se compromete a proporcionar información veraz y actualizada, a no realizar reservas fraudulentas, y a tratar con respeto al personal de los locales. El incumplimiento de estas condiciones puede resultar en la suspensión de la cuenta.",
  },
  {
    title: "6. Propiedad intelectual",
    body: "Todos los contenidos de la aplicación BodyFix, incluyendo textos, imágenes, logotipos y código, son propiedad de BodyFix o de sus licenciantes. Queda prohibida su reproducción total o parcial sin autorización expresa.",
  },
  {
    title: "7. Modificaciones",
    body: "BodyFix se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios serán notificados a los usuarios a través de la aplicación. El uso continuado del servicio implica la aceptación de las modificaciones.",
  },
  {
    title: "8. Ley aplicable",
    body: "Estos Términos y Condiciones se rigen por la legislación de la República Argentina. Cualquier disputa será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.",
  },
]

export default function TermsScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate("/(client)/profile")}>
          <Ionicons name="arrow-back" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroBadge}>
          <Ionicons name="document-text-outline" size={28} color={Colors.light.primary} />
        </View>
        <Text style={styles.intro}>
          Estos Términos y Condiciones regulan el uso de la aplicación BodyFix. Te recomendamos leerlos detenidamente antes de utilizar nuestros servicios.
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
            Para consultas sobre estos términos, contactanos en{" "}
            <Text style={styles.footerEmail}>legal@bodyfix.com.ar</Text>
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
