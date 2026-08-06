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
import * as WebBrowser from 'expo-web-browser'
import { Colors } from "@/constants/Colors"
import BookingCard from "@/components/BookingCard"
import { useCallback, useRef, useState } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { useBookings } from "@/hooks/use-bookings"
import { usePayments } from "@/hooks/use-payments"
import { useToast } from "@/hooks/use-toast"
import { getBookingPaymentStatus, cancelPendingBooking } from "@/data/api/locals.api"
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

type PayPhase = 'idle' | 'creating' | 'polling' | 'timeout'

function BookingDetailModal({
  booking,
  onClose,
  onPaymentSuccess,
  onCancelled,
}: {
  booking: Booking
  onClose: () => void
  onPaymentSuccess: () => void
  onCancelled: () => void
}) {
  const status = STATUS_CONFIG[booking.state.name as BookingStatus]
  const { createPayment } = usePayments()
  const { cancelBooking } = useBookings()
  const { toast } = useToast()
  const [payPhase, setPayPhase]   = useState<PayPhase>('idle')
  const [payError, setPayError]   = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const pollingTimer              = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canCancel = booking.state.name === 'pending' || booking.state.name === 'confirmed' || booking.state.name === 'pending_payment'

  const handleCancel = () => setShowCancelConfirm(true)

  const openSupportEmail = async () => {
    const url = "mailto:soporte@bodyfix.com?subject=Consulta%20de%20soporte%20-%20BodyFix"
    const canOpen = await Linking.canOpenURL(url)
    if (!canOpen) {
      toast({
        title: "Sin app de correo",
        description: "No encontramos una app de correo configurada en tu dispositivo. Escribinos a soporte@bodyfix.com",
        variant: "danger",
      })
      return
    }
    await Linking.openURL(url)
  }

  const confirmCancel = async () => {
    setShowCancelConfirm(false)
    setIsCancelling(true)
    try {
      const result = await cancelBooking(booking.id)
      toast({
        title: "Turno cancelado",
        description: (
          <Text>
            {result.message}{"\n"}Por cualquier consulta contactá a{" "}
            <Text style={{ fontWeight: "700", textDecorationLine: "underline" }} onPress={openSupportEmail}>
              soporte
            </Text>
            .
          </Text>
        ),
        variant: "warning",
      })
      onCancelled()
    } catch (err: any) {
      toast({
        title: "No se pudo cancelar",
        description: err?.response?.data?.message ?? err?.message ?? "Intentá de nuevo.",
        variant: "danger",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const stopPolling = () => {
    if (pollingTimer.current) { clearTimeout(pollingTimer.current); pollingTimer.current = null }
  }

  const startPolling = (bookingId: number, attempt = 1) => {
    const MAX = 20
    setPayPhase('polling')
    getBookingPaymentStatus(bookingId)
      .then(result => {
        if (result.payment_status === 'approved') {
          stopPolling()
          onPaymentSuccess()
        } else if (result.payment_status === 'rejected') {
          stopPolling()
          setPayPhase('idle')
          setPayError('El pago fue rechazado. No se realizó ningún cobro.')
        } else if (attempt < MAX) {
          pollingTimer.current = setTimeout(() => startPolling(bookingId, attempt + 1), 3000)
        } else {
          stopPolling()
          setPayPhase('timeout')
        }
      })
      .catch(() => {
        if (attempt < MAX) {
          pollingTimer.current = setTimeout(() => startPolling(bookingId, attempt + 1), 3000)
        } else {
          stopPolling()
          setPayPhase('timeout')
        }
      })
  }

  const handlePay = async () => {
    setPayError(null)
    setPayPhase('creating')
    try {
      const paymentResult = await createPayment({
        bookingId:     booking.id,
        paymentMethod: 'mercado_pago',
        platform:      Platform.OS === 'web' ? 'web' : 'native',
      })
      const paymentUrl = paymentResult.payment_url
      if (!paymentUrl) throw new Error('No se recibió URL de pago.')

      const result = await WebBrowser.openAuthSessionAsync(paymentUrl, 'bodyfix://')

      if (result.type === 'success') {
        const redirectUrl = new URL(result.url)
        const status      = redirectUrl.searchParams.get('status')
        if (status === 'success' || status === 'approved') {
          stopPolling()
          onPaymentSuccess()
        } else if (status === 'failure' || status === 'rejected') {
          setPayPhase('idle')
          setPayError('El pago fue rechazado. No se realizó ningún cobro.')
        } else {
          startPolling(booking.id)
        }
      } else {
        // Usuario cerró el browser
        cancelPendingBooking(booking.id).catch(() => {})
        setPayPhase('idle')
        setPayError('Cancelaste el pago.')
      }
    } catch (err: any) {
      setPayPhase('idle')
      setPayError(err?.response?.data?.message ?? err?.message ?? 'No se pudo procesar el pago.')
    }
  }

  const isPaying = payPhase === 'creating' || payPhase === 'polling'

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
    <>
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
              <DetailRow icon="cash-outline"     label="Pago abonado" value={`$${Number(booking.price).toLocaleString("es-AR")}`} />
            ) : null}
            {booking.notes ? (
              <DetailRow icon="document-text-outline" label="Notas"  value={booking.notes} />
            ) : null}

            {/* ── Pago pendiente ── */}
            {booking.state.name === 'pending_payment' && (
              <View style={modalStyles.paySection}>
                {payError ? (
                  <View style={modalStyles.payErrorBox}>
                    <Ionicons name="alert-circle-outline" size={16} color={Colors.light.error} />
                    <Text style={modalStyles.payErrorText}>{payError}</Text>
                  </View>
                ) : null}

                {payPhase === 'timeout' ? (
                  <View style={modalStyles.payErrorBox}>
                    <Ionicons name="warning-outline" size={16} color="#D97706" />
                    <Text style={[modalStyles.payErrorText, { color: '#D97706' }]}>
                      No pudimos confirmar el pago. Revisá "Mis turnos" en unos minutos.
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[modalStyles.payButton, isPaying && { opacity: 0.6 }]}
                  onPress={handlePay}
                  disabled={isPaying}
                  activeOpacity={0.85}
                >
                  {isPaying ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={modalStyles.payButtonText}>
                        {payPhase === 'polling' ? 'Verificando pago…' : 'Iniciando pago…'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="card-outline" size={18} color="#fff" />
                      <Text style={modalStyles.payButtonText}>
                        {payPhase === 'timeout' ? 'Reintentar pago' : 'Pagar monto'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* ── Cancelar turno ── */}
            {canCancel && (
              <TouchableOpacity
                style={[modalStyles.cancelButton, isCancelling && { opacity: 0.6 }]}
                onPress={handleCancel}
                disabled={isCancelling}
                activeOpacity={0.85}
              >
                {isCancelling ? (
                  <ActivityIndicator color={Colors.light.error} size="small" />
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={18} color={Colors.light.error} />
                    <Text style={modalStyles.cancelButtonText}>Cancelar turno</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

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

    <Modal visible={showCancelConfirm} transparent animationType="fade" onRequestClose={() => setShowCancelConfirm(false)}>
      <View style={modalStyles.confirmOverlay}>
        <TouchableOpacity style={modalStyles.backdrop} onPress={() => setShowCancelConfirm(false)} activeOpacity={1} />
        <View style={modalStyles.confirmCard}>
          <View style={modalStyles.confirmIconWrapper}>
            <Ionicons name="close-circle-outline" size={32} color={Colors.light.error} />
          </View>
          <Text style={modalStyles.confirmTitle}>Cancelar turno</Text>
          <Text style={modalStyles.confirmMessage}>¿Estás seguro que querés cancelar este turno?</Text>

          <View style={modalStyles.confirmActions}>
            <TouchableOpacity
              style={modalStyles.confirmSecondaryBtn}
              onPress={() => setShowCancelConfirm(false)}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.confirmSecondaryBtnText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.confirmDestructiveBtn}
              onPress={confirmCancel}
              activeOpacity={0.85}
            >
              <Text style={modalStyles.confirmDestructiveBtnText}>Sí, cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
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

  const pendingBookings = bookings.filter(
    (b) => b.state.name === "pending_payment" || b.state.name === "pending" || b.state.name === "confirmed"
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
          onPaymentSuccess={() => {
            setSelectedBooking(null)
            fetchBookings()
          }}
          onCancelled={() => {
            setSelectedBooking(null)
          }}
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
  paySection: {
    gap: 12,
    marginTop: 4,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  payErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.errorLight,
    borderRadius: 10,
    padding: 12,
  },
  payErrorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.error,
    lineHeight: 18,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.error,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
  },
  cancelButtonText: {
    color: Colors.light.error,
    fontSize: 15,
    fontWeight: "700",
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  confirmIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.errorLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  confirmMessage: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  confirmSecondaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  confirmSecondaryBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmDestructiveBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.light.error,
  },
  confirmDestructiveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
})
