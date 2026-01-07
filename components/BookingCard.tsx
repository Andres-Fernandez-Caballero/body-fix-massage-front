import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface BookingCardProps {
  booking: {
    id: string
    therapistName: string
    massageType: string
    date: string
    time: string
    status: "upcoming" | "completed" | "cancelled"
    address: string
    rating?: number
  }
  onViewDetails?: () => void
  onReschedule?: () => void
  onReview?: () => void
}

export default function BookingCard({ booking, onViewDetails, onReschedule, onReview }: BookingCardProps) {
  const isUpcoming = booking.status === "upcoming"
  const isCompleted = booking.status === "completed"

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.therapistName}>{booking.therapistName}</Text>
          <Text style={styles.massageType}>{booking.massageType}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            isUpcoming && styles.upcomingBadge,
            isCompleted && styles.completedBadge,
            booking.status === "cancelled" && styles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isCompleted && { color: Colors.light.success },
              booking.status === "cancelled" && { color: Colors.light.error },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.light.icon} />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={Colors.light.icon} />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        {isUpcoming && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.light.icon} />
            <Text style={styles.detailText}>{booking.address}</Text>
          </View>
        )}
        {isCompleted && booking.rating && (
          <View style={styles.detailRow}>
            <Ionicons name="star" size={16} color={Colors.light.warning} />
            <Text style={styles.detailText}>Rated {booking.rating}/5</Text>
          </View>
        )}
      </View>

      {isUpcoming && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onReschedule}>
            <Text style={styles.secondaryButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
            <Text style={styles.primaryButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompleted && !booking.rating && (
        <TouchableOpacity style={styles.reviewButton} onPress={onReview}>
          <Ionicons name="star-outline" size={18} color={Colors.light.primary} />
          <Text style={styles.reviewButtonText}>Leave a Review</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  massageType: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: "#EEF2FF",
  },
  completedBadge: {
    backgroundColor: "#ECFDF5",
  },
  cancelledBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  details: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "600",
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  reviewButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})
