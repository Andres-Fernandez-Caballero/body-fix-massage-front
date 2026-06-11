import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

type BookingStatus = "pending_payment" | "pending" | "confirmed" | "completed" | "cancelled" | "expired"

interface BookingCardProps {
  booking: {
    id: number
    localName: string
    especialidadNombre: string
    date: string
    time: string
    status: BookingStatus
    price: number | null
    rating?: number
  }
  onViewDetails?: () => void
  onReview?: () => void
}

export default function BookingCard({ booking, onViewDetails, onReview }: BookingCardProps) {
  const isPendingPayment = booking.status === "pending_payment"
  const isPending   = booking.status === "pending"
  const isConfirmed = booking.status === "confirmed"
  const isCompleted = booking.status === "completed"
  const isUpcoming  = isPendingPayment || isPending || isConfirmed

  const statusConfig: Record<BookingStatus, { label: string; bg: string; color: string; icon: React.ComponentProps<typeof Ionicons>["name"] }> = {
    pending_payment: {
      label: "Pago pendiente",
      bg: "#EFF6FF",
      color: "#3B82F6",
      icon: "card-outline",
    },
    pending: {
      label: "Pendiente",
      bg: "#FEF3C7",
      color: "#D97706",
      icon: "time-outline",
    },
    confirmed: {
      label: "Confirmado",
      bg: Colors.light.successLight,
      color: Colors.light.success,
      icon: "checkmark-circle-outline",
    },
    completed: {
      label: "Finalizado",
      bg: "#F3F4F6",
      color: "#6B7280",
      icon: "checkmark-done-outline",
    },
    cancelled: {
      label: "Cancelado",
      bg: Colors.light.errorLight,
      color: Colors.light.error,
      icon: "close-circle-outline",
    },
    expired: {
      label: "Expirado",
      bg: "#F3F4F6",
      color: "#9CA3AF",
      icon: "alert-circle-outline",
    },
  }

  const status = statusConfig[booking.status]

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.localName}>{booking.localName}</Text>
          <Text style={styles.especialidad}>{booking.especialidadNombre}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="calendar-outline" size={15} color={Colors.light.primary} />
          </View>
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={15} color={Colors.light.primary} />
          </View>
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        {booking.price !== null && booking.price !== undefined && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="cash-outline" size={15} color={Colors.light.primary} />
            </View>
            <Text style={styles.detailText}>
              Seña: ${Number(booking.price).toLocaleString("es-AR")}
            </Text>
          </View>
        )}
        {isCompleted && booking.rating && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="star" size={15} color={Colors.light.warning} />
            </View>
            <Text style={styles.detailText}>Calificación: {booking.rating}/5</Text>
          </View>
        )}
      </View>

      {isUpcoming && onViewDetails && (
        <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Ver detalles</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      )}

      {isCompleted && !booking.rating && onReview && (
        <TouchableOpacity style={styles.reviewButton} onPress={onReview} activeOpacity={0.8}>
          <Ionicons name="star-outline" size={16} color={Colors.light.primary} />
          <Text style={styles.reviewButtonText}>Dejar reseña</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#8C5240",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginRight: 10,
  },
  localName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  especialidad: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 12,
  },
  details: {
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryLight,
  },
  reviewButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "700",
  },
})
