"use client"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native"
import { Colors } from "@/constants/Colors"
import BookingCard from "@/components/BookingCard"
import { useCallback, useState } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { useBookings } from "@/hooks/use-bookings"
import { LayoutWithNotifications } from "@/components/LayoutWithNotifications"
import { Ionicons } from "@expo/vector-icons"
import { Booking } from "@/contracts/models/booking.interface"

type BookingStatus = "pending_payment" | "pending" | "confirmed" | "completed" | "cancelled" | "expired"

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string; icon: React.ComponentProps<typeof Ionicons>["name"] }> = {
  pending_payment: { label: "Pago pendiente", bg: "#EFF6FF",                   color: "#3B82F6",           icon: "card-outline"             },
  pending:         { label: "Pendiente",       bg: "#FEF3C7",                   color: "#D97706",           icon: "time-outline"             },
  confirmed:       { label: "Confirmado",      bg: Colors.light.successLight,   color: Colors.light.success, icon: "checkmark-circle-outline" },
  completed:       { label: "Finalizado",      bg: "#F3F4F6",                   color: "#6B7280",           icon: "checkmark-done-outline"   },
  cancelled:       { label: "Cancelado",       bg: Colors.light.errorLight,     color: Colors.light.error,  icon: "close-circle-outline"     },
  expired:         { label: "Expirado",        bg: "#F3F4F6",                   color: "#9CA3AF",           icon: "alert-circle-outline"     },
}

function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking
  onClose: () => void
}) {
  const status = STATUS_CONFIG[booking.state.name as BookingStatus]

  const fullAddress = [booking.localDireccion, booking.localLocalidad]
    .filter(Boolean)
    .join(", ")

  const handleOpenMaps = () => {
    if (!booking.localDireccion) return
    const address = [booking.localDireccion, booking.localLocalidad].filter(Boolean).join(", ")
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    Linking.openURL(url)
  }

  const DetailRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"]
    label: string
    value: string
  }) => (
    <View style={modalStyles.detailRow}>
      <View style={modalStyles.detailIconWrapper}>
        <Ionicons name={icon} size={16} color={Colors.light.primary} />
      </View>
      <View style={modalStyles.detailTextBlock}>
        <Text style={modalStyles.detailLabel}>{label}</Text>
        <Text style={modalStyles.detailValue}>{value}</Text>
      </View>
    </View>
  )

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <TouchableOpacity style={modalStyles.backdrop} onPress={onClose} activeOpacity={1} />

        <View style={modalStyles.sheet}>
          {/* ── Drag handle ── */}
          <View style={modalStyles.handle} />

          {/* ── Header ── */}
          <View style={modalStyles.header}>
            <View style={modalStyles.headerInfo}>
              <Text style={modalStyles.localName}>{booking.localName ?? "Local"}</Text>
              <View style={[modalStyles.statusBadge, { backgroundColor: status.bg }]}>
                <Ionicons name={status.icon} size={12} color={status.color} />
                <Text style={[modalStyles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.divider} />

          {/* ── Detalle ── */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={modalStyles.body}>
            <DetailRow icon="calendar-outline"  label="Fecha"        value={booking.date} />
            <DetailRow icon="time-outline"       label="Horario"      value={`${booking.startTime?.slice(0, 5) ?? ''} – ${booking.endTime?.slice(0, 5) ?? ''}`} />
            {booking.especialidadNombre ? (
              <DetailRow icon="sparkles-outline" label="Servicio"     value={booking.especialidadNombre} />
            ) : null}
            {booking.therapistName ? (
              <DetailRow icon="person-outline"   label="Masajista"    value={booking.therapistName} />
            ) : null}
            {booking.price != null ? (
              <DetailRow icon="cash-outline"     label="Seña abonada" value={`$${Number(booking.price).toLocaleString("es-AR")}`} />
            ) : null}
            {booking.notes ? (
              <DetailRow icon="document-text-outline" label="Notas"  value={booking.notes} />
            ) : null}

            {/* ── Ubicación ── */}
            {fullAddress ? (
              <View style={modalStyles.locationSection}>
                <View style={modalStyles.locationTextBlock}>
                  <View style={modalStyles.detailIconWrapper}>
                    <Ionicons name="location-outline" size={16} color={Colors.light.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={modalStyles.detailLabel}>Dirección</Text>
                    <Text style={modalStyles.detailValue}>{fullAddress}</Text>
                  </View>
                </View>
                {booking.localDireccion ? (
                  <TouchableOpacity style={modalStyles.mapsButton} onPress={handleOpenMaps} activeOpacity={0.85}>
                    <Ionicons name="navigate-outline" size={15} color="#fff" />
                    <Text style={modalStyles.mapsButtonText}>Ver en mapa</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default function BookingsScreen() {
  const { bookings, loading, fetchBookings } = useBookings()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const router = useRouter()

  // Refresca cada vez que la tab recibe el foco
  useFocusEffect(
    useCallback(() => {
      fetchBookings()
    }, [fetchBookings])
  )

  // pending_payment is intentionally excluded — those bookings are invisible to the
  // client until payment is confirmed and the state transitions to "confirmed".
  const pendingBookings = bookings.filter(
    (b) => b.state.name === "pending" || b.state.name === "confirmed"
  )
  const historyBookings = bookings.filter(
    (b) => b.state.name === "completed" || b.state.name === "cancelled" || b.state.name === "expired"
  )

  const toCardProps = (b: Booking) => ({
    id: b.id,
    localName: b.localName ?? "Local",
    especialidadNombre: b.especialidadNombre ?? "—",
    date: b.date,
    time: `${b.startTime?.slice(0, 5) ?? ''} – ${b.endTime?.slice(0, 5) ?? ''}`,
    status: b.state.name as BookingStatus,
    price: b.price,
    rating: b.reviewLocalScore ?? undefined,
  })

  const handleReview = (b: Booking) => {
    router.push({
      pathname: "/(client)/review/[bookingId]",
      params: {
        bookingId: b.id,
        hasTherapist: b.therapistName ? "1" : "0",
        localName: encodeURIComponent(b.localName ?? ""),
      },
    })
  }

  if (loading && bookings.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    )
  }

  return (
    <>
      <LayoutWithNotifications
        headerView={
          <View>
            <Text style={styles.title}>Mis turnos</Text>
            <Text style={styles.headerSubtitle}>Seguí tus sesiones de bienestar</Text>
          </View>
        }
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {pendingBookings.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Reservas pendientes</Text>
              </View>
              {pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={toCardProps(booking)}
                  onViewDetails={() => setSelectedBooking(booking)}
                />
              ))}
            </>
          )}

          {historyBookings.length > 0 && (
            <>
              <View style={[styles.sectionHeader, pendingBookings.length > 0 && { marginTop: 12 }]}>
                <View style={[styles.sectionDot, { backgroundColor: Colors.light.icon }]} />
                <Text style={styles.sectionTitle}>Historial</Text>
              </View>
              {historyBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={toCardProps(booking)}
                  onViewDetails={() => setSelectedBooking(booking)}
                  onReview={
                    booking.state.name === "completed" && !booking.hasReview
                      ? () => handleReview(booking)
                      : undefined
                  }
                />
              ))}
            </>
          )}

          {bookings.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="calendar-outline" size={36} color={Colors.light.primary} />
              </View>
              <Text style={styles.emptyStateTitle}>Sin turnos aún</Text>
              <Text style={styles.emptyStateText}>
                Cuando reserves tu primera sesión, la verás aquí.
              </Text>
            </View>
          )}
        </ScrollView>
      </LayoutWithNotifications>

      {selectedBooking !== null && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.light.background },
  centerContent:   { justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 4,
  },
  content:           { flex: 1, paddingHorizontal: 24 },
  contentContainer:  { paddingBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 20,
  },
})

// ── Modal styles ──────────────────────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 8,
  },
  localName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 20,
  },
  body: {
    gap: 14,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  detailTextBlock: {
    flex: 1,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.icon,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 4,
  },
  locationTextBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexShrink: 0,
  },
  mapsButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
})
