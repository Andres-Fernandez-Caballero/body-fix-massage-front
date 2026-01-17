import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/contexts/ThemeContext"
import { getBookingCardStyles } from "@/styles/themedStyles"

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
  const { colors, isDark } = useTheme()
  const isUpcoming = booking.status === "upcoming"
  const isCompleted = booking.status === "completed"
  
  const dynamicStyles = getBookingCardStyles(colors, isDark)

  return (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.header}>
        <View>
          <Text style={dynamicStyles.therapistName}>{booking.therapistName}</Text>
          <Text style={dynamicStyles.massageType}>{booking.massageType}</Text>
        </View>
        <View
          style={[
            dynamicStyles.statusBadge,
            isUpcoming && dynamicStyles.upcomingBadge,
            isCompleted && dynamicStyles.completedBadge,
            booking.status === "cancelled" && dynamicStyles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              dynamicStyles.statusText,
              isCompleted && { color: colors.success },
              booking.status === "cancelled" && { color: colors.error },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={dynamicStyles.details}>
        <View style={dynamicStyles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.icon} />
          <Text style={dynamicStyles.detailText}>{booking.date}</Text>
        </View>
        <View style={dynamicStyles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.icon} />
          <Text style={dynamicStyles.detailText}>{booking.time}</Text>
        </View>
        {isUpcoming && (
          <View style={dynamicStyles.detailRow}>
            <Ionicons name="location-outline" size={16} color={colors.icon} />
            <Text style={dynamicStyles.detailText}>{booking.address}</Text>
          </View>
        )}
        {isCompleted && booking.rating && (
          <View style={dynamicStyles.detailRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={dynamicStyles.detailText}>Rated {booking.rating}/5</Text>
          </View>
        )}
      </View>

      {isUpcoming && (
        <View style={dynamicStyles.actions}>
          <TouchableOpacity style={dynamicStyles.secondaryButton} onPress={onReschedule}>
            <Text style={dynamicStyles.secondaryButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.primaryButton} onPress={onViewDetails}>
            <Text style={dynamicStyles.primaryButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompleted && !booking.rating && (
        <TouchableOpacity style={dynamicStyles.reviewButton} onPress={onReview}>
          <Ionicons name="star-outline" size={18} color={colors.primary} />
          <Text style={dynamicStyles.reviewButtonText}>Leave a Review</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
