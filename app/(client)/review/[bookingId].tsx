import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useReview } from "@/hooks/use-review"

function StarRow({
  label,
  value,
  onChange,
  optional,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  optional?: boolean
}) {
  return (
    <View style={styles.starSection}>
      <Text style={styles.starLabel}>
        {label}
        {optional && <Text style={styles.optionalTag}> (opcional)</Text>}
      </Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)} activeOpacity={0.7} hitSlop={8}>
            <Ionicons
              name={n <= value ? "star" : "star-outline"}
              size={36}
              color={n <= value ? Colors.light.warning : Colors.light.border}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default function ReviewScreen() {
  const router = useRouter()
  const { bookingId, hasTherapist, localName } = useLocalSearchParams<{
    bookingId: string
    hasTherapist: string
    localName: string
  }>()

  const id = Number(bookingId)
  const showTherapistRating = hasTherapist === "1"

  const [localScore, setLocalScore]         = useState(0)
  const [therapistScore, setTherapistScore] = useState(0)
  const [comment, setComment]               = useState("")

  const { loading, error, success, submitReview } = useReview(id)

  const handleSubmit = () => {
    if (localScore === 0) return
    submitReview({
      local_score:     localScore,
      therapist_score: showTherapistRating && therapistScore > 0 ? therapistScore : null,
      comment:         comment.trim() || null,
    })
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.light.success} />
        </View>
        <Text style={styles.successTitle}>¡Gracias por tu calificación!</Text>
        <Text style={styles.successText}>Tu opinión nos ayuda a mejorar el servicio.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(client)/bookings")} activeOpacity={0.85}>
          <Text style={styles.backBtnText}>Ver mis turnos</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Calificá tu turno</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {localName ? (
          <Text style={styles.localNameText}>{decodeURIComponent(localName)}</Text>
        ) : null}

        <Text style={styles.intro}>Contanos cómo fue tu experiencia.</Text>

        {/* Local rating */}
        <View style={styles.card}>
          <StarRow
            label="Puntuación del local"
            value={localScore}
            onChange={setLocalScore}
          />
          {localScore === 0 && (
            <Text style={styles.requiredHint}>Seleccioná al menos 1 estrella para continuar.</Text>
          )}
        </View>

        {/* Therapist rating */}
        {showTherapistRating && (
          <View style={styles.card}>
            <StarRow
              label="Puntuación del masajista"
              value={therapistScore}
              onChange={setTherapistScore}
              optional
            />
          </View>
        )}

        {/* Comment */}
        <View style={styles.card}>
          <Text style={styles.starLabel}>
            Comentario <Text style={styles.optionalTag}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Contanos más sobre tu experiencia..."
            placeholderTextColor={Colors.light.icon}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/1000</Text>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, (localScore === 0 || loading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={localScore === 0 || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="star" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Enviar calificación</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  headerBack:  { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 16,
  },
  localNameText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  intro: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  starSection: { gap: 10 },
  starLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  optionalTag: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.light.icon,
  },
  stars: {
    flexDirection: "row",
    gap: 8,
  },
  requiredHint: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: -4,
  },
  commentInput: {
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: Colors.light.icon,
    alignSelf: "flex-end",
    marginTop: -4,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.error,
    textAlign: "center",
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    paddingTop: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Success state
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: Colors.light.background,
    gap: 16,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 20,
  },
  backBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
})
