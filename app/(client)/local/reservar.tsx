import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Image,
} from "react-native"
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState, useCallback, useRef } from "react"
import { useLocalBooking, useLocals } from "@/hooks/use-locals"
import type { LocalSlot, Masajista } from "@/contracts/models/local.interface"
import { getBookingPaymentStatus } from "@/data/api/locals.api"
import * as WebBrowser from 'expo-web-browser'

type Step = 'fecha' | 'hora' | 'masajista' | 'confirmar'

type BookingResult =
    | { ok: true;  date: string; time: string; masajista: string; especialidad: string | null; price: number | null }
    | { ok: false; message: string }
    | null

const DIAS: Record<number, string> = {
    1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom',
}

export default function ReservarScreen() {
    const router = useRouter()
    const { localId, especialidadId } = useLocalSearchParams<{ localId: string; especialidadId: string }>()
    const numLocalId     = Number(localId)
    const numEspId       = especialidadId ? Number(especialidadId) : null

    const { locals, fetchLocals } = useLocals()
    const {
        especialidades, slots, masajistas,
        slotsLoading, masajistasLoading, isBooking,
        slotsError, masajistasError,
        fetchEspecialidades, fetchSlots, fetchMasajistas, confirmBooking,
    } = useLocalBooking(numLocalId)

    const local = locals.find(l => l.id === numLocalId)

    const [step, setStep]                           = useState<Step>('fecha')
    const [selectedDateIdx, setSelectedDateIdx]     = useState(-1)
    const [selectedSlot, setSelectedSlot]           = useState<LocalSlot | null>(null)
    const [selectedMasajista, setSelectedMasajista] = useState<Masajista | null>(null)
    const [bookingResult, setBookingResult]         = useState<BookingResult>(null)

    // ── Estado del flujo de pago ────────────────────────────────────────────────
    // 'idle'    → sin pago en curso
    // 'polling' → browser cerrado; consultando el estado del pago a la API
    // 'timeout' → se agotaron los reintentos sin confirmación
    type PaymentPhase = 'idle' | 'polling' | 'timeout'
    const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>('idle')
    const pollingTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pendingBookingRef               = useRef<{
        id: number; date: string; time: string; masajista: string
        especialidad: string | null; price: number | null
    } | null>(null)

    // Cancela timers de polling activos
    const stopPaymentFlow = useCallback(() => {
        if (pollingTimer.current) { clearTimeout(pollingTimer.current); pollingTimer.current = null }
    }, [])

    // Resetear TODO el estado de booking cada vez que la pantalla recibe foco.
    // Esto es necesario porque en Expo Router con <Tabs> las pantallas NO se
    // desmontan al navegar a otro tab — el componente queda vivo en memoria.
    // Sin este reset, bookingResult y el resto del estado de una reserva anterior
    // persisten y el overlay de éxito aparece instantáneamente al volver.
    useFocusEffect(
        useCallback(() => {
            setStep('fecha')
            setSelectedDateIdx(-1)
            setSelectedSlot(null)
            setSelectedMasajista(null)
            setBookingResult(null)
            setPaymentPhase('idle')
            pendingBookingRef.current = null
            stopPaymentFlow()
            if (locals.length === 0) fetchLocals()
            fetchEspecialidades()
            fetchSlots()

            return () => { stopPaymentFlow() }
        }, [numLocalId])
    )

    // When step changes to 'masajista', load available masajistas
    useEffect(() => {
        if (step === 'masajista' && selectedSlot && selectedDay) {
            fetchMasajistas(selectedDay.date, selectedSlot.startTime, numEspId ?? undefined)
        }
    }, [step])

    const selectedDay   = slots[selectedDateIdx] ?? null
    const selectedEsp   = especialidades.find(e => e.id === numEspId) ?? null
    const espNombre     = selectedEsp?.nombre ?? null
    const espPrice      = selectedEsp?.price ?? null

    const goNext = () => {
        if (step === 'fecha')      setStep('hora')
        else if (step === 'hora')  setStep('masajista')
        else if (step === 'masajista') setStep('confirmar')
    }

    const goBack = () => {
        if (step === 'hora')       setStep('fecha')
        else if (step === 'masajista') { setStep('hora'); setSelectedMasajista(null) }
        else if (step === 'confirmar') setStep('masajista')
        else router.back()
    }

    // ── Polling: consulta el estado del pago hasta que haya resultado ──────────
    const startPolling = useCallback((bookingId: number, attempt = 1) => {
        const MAX_ATTEMPTS = 20  // 20 × 3 s = 60 s máximo
        setPaymentPhase('polling')

        getBookingPaymentStatus(bookingId)
            .then((result) => {
                if (result.payment_status === 'approved') {
                    stopPaymentFlow()
                    setPaymentPhase('idle')
                    const ref = pendingBookingRef.current
                    pendingBookingRef.current = null
                    setBookingResult({
                        ok:           true,
                        date:         ref?.date ?? '',
                        time:         ref?.time ?? '',
                        masajista:    ref?.masajista ?? '',
                        especialidad: ref?.especialidad ?? null,
                        price:        ref?.price ?? null,
                    })
                } else if (result.payment_status === 'rejected') {
                    stopPaymentFlow()
                    setPaymentPhase('idle')
                    pendingBookingRef.current = null
                    setBookingResult({ ok: false, message: 'El pago fue rechazado. No se realizó ningún cobro.' })
                } else if (attempt < MAX_ATTEMPTS) {
                    pollingTimer.current = setTimeout(() => startPolling(bookingId, attempt + 1), 3000)
                } else {
                    stopPaymentFlow()
                    setPaymentPhase('timeout')
                }
            })
            .catch(() => {
                if (attempt < MAX_ATTEMPTS) {
                    pollingTimer.current = setTimeout(() => startPolling(bookingId, attempt + 1), 3000)
                } else {
                    stopPaymentFlow()
                    setPaymentPhase('timeout')
                }
            })
    }, [stopPaymentFlow])

    const handleConfirm = async () => {
        if (!selectedDay || !selectedSlot || !selectedMasajista) return
        try {
            const response = await confirmBooking({
                masajistaId:    selectedMasajista.id,
                especialidadId: numEspId,
                date:           selectedDay.date,
                startTime:      selectedSlot.startTime,
            })

            const { data: booking, payment } = response

            if (payment.requires_payment && payment.init_point) {
                // ── Flujo con seña (Mercado Pago) ─────────────────────────
                pendingBookingRef.current = {
                    id:           booking.id,
                    date:         selectedDay.date,
                    time:         `${selectedSlot.startTime} – ${selectedSlot.endTime}`,
                    masajista:    selectedMasajista.nombre,
                    especialidad: espNombre,
                    price:        espPrice,
                }

                // Abrir el checkout en un browser in-app (SFSafariViewController en iOS,
                // Chrome Custom Tab en Android). La Promise bloquea hasta que:
                //   • MP redirige a bodyfix://payment-callback  → type: 'success'
                //   • El usuario cierra el browser manualmente  → type: 'dismiss'
                // En ambos casos iniciamos polling — el usuario puede haber pagado
                // incluso si cerró el browser antes del redirect.
                await WebBrowser.openAuthSessionAsync(
                    payment.init_point,
                    'bodyfix://payment-callback',
                )

                // Browser cerrado → verificar resultado con la API
                startPolling(booking.id)
            } else {
                // ── Flujo sin seña ────────────────────────────────────────
                setBookingResult({
                    ok:           true,
                    date:         selectedDay.date,
                    time:         `${selectedSlot.startTime} – ${selectedSlot.endTime}`,
                    masajista:    selectedMasajista.nombre,
                    especialidad: espNombre,
                    price:        espPrice,
                })
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message ??
                err?.message ??
                'No se pudo confirmar la reserva. Intentá de nuevo.'
            setBookingResult({ ok: false, message })
        }
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00')
        return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    }

    const stepTitles: Record<Step, string> = {
        fecha:     'Seleccioná una fecha',
        hora:      'Seleccioná un horario',
        masajista: 'Elegí tu masajista',
        confirmar: 'Confirmá tu reserva',
    }

    const canNext = () => {
        if (step === 'fecha')      return !!selectedDay
        if (step === 'hora')       return !!selectedSlot
        if (step === 'masajista')  return !!selectedMasajista
        return false
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{stepTitles[step]}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Progress dots */}
            <View style={styles.progress}>
                {(['fecha', 'hora', 'masajista', 'confirmar'] as Step[]).map((s, i) => (
                    <View key={s} style={[styles.dot, step === s && styles.dotActive, ['hora','masajista','confirmar'].slice(0, (['fecha','hora','masajista','confirmar'] as Step[]).indexOf(step)).includes(s) && styles.dotDone]} />
                ))}
            </View>

            {/* Context summary bar */}
            {(step !== 'fecha') && (
                <View style={styles.summaryBar}>
                    {local && <Text style={styles.summaryItem}>{local.nombre}</Text>}
                    {espNombre && <Text style={styles.summaryItem}>· {espNombre}</Text>}
                    {selectedDay && <Text style={styles.summaryItem}>· {formatDate(selectedDay.date)}</Text>}
                    {selectedSlot && <Text style={styles.summaryItem}>· {selectedSlot.startTime}</Text>}
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* ── STEP: FECHA ── */}
                {step === 'fecha' && (
                    <View>
                        {slotsLoading ? (
                            <ActivityIndicator style={{ marginTop: 40 }} color={Colors.light.primary} />
                        ) : slotsError ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="alert-circle-outline" size={40} color={Colors.light.error} />
                                <Text style={styles.emptyTitle}>Error al cargar</Text>
                                <Text style={styles.emptyText}>{slotsError}</Text>
                                <TouchableOpacity onPress={fetchSlots} style={styles.retryButton}>
                                    <Ionicons name="refresh-outline" size={15} color={Colors.light.primary} />
                                    <Text style={styles.retryText}>Reintentar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : slots.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-outline" size={40} color={Colors.light.icon} />
                                <Text style={styles.emptyTitle}>Sin disponibilidad</Text>
                                <Text style={styles.emptyText}>Este local no tiene franjas horarias configuradas aún.</Text>
                            </View>
                        ) : (
                            <View style={styles.dateGrid}>
                                {slots.map((day, idx) => {
                                    const d = new Date(day.date + 'T00:00:00')
                                    return (
                                        <TouchableOpacity
                                            key={day.date}
                                            style={[styles.dateCard, selectedDateIdx === idx && styles.dateCardActive]}
                                            onPress={() => { setSelectedDateIdx(idx); setSelectedSlot(null) }}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[styles.dateDayName, selectedDateIdx === idx && styles.dateTextActive]}>
                                                {DIAS[day.dayOfWeek]}
                                            </Text>
                                            <Text style={[styles.dateDayNum, selectedDateIdx === idx && styles.dateTextActive]}>
                                                {d.getDate()}
                                            </Text>
                                            <Text style={[styles.dateMonth, selectedDateIdx === idx && styles.dateTextActive]}>
                                                {d.toLocaleDateString('es-AR', { month: 'short' })}
                                            </Text>
                                            <View style={[styles.slotsBadge, selectedDateIdx === idx && styles.slotsBadgeActive]}>
                                                <Text style={[styles.slotsCount, selectedDateIdx === idx && styles.dateTextActive]}>
                                                    {day.slots.length}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )}
                    </View>
                )}

                {/* ── STEP: HORA ── */}
                {step === 'hora' && selectedDay && (
                    <View>
                        <Text style={styles.stepLabel}>
                            {formatDate(selectedDay.date)} · {selectedDay.slots.length} horarios disponibles
                        </Text>
                        {selectedDay.slots.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No hay horarios disponibles para este día.</Text>
                            </View>
                        ) : (
                            <View style={styles.slotsGrid}>
                                {selectedDay.slots.map((slot, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.slotChip, selectedSlot?.startTime === slot.startTime && styles.slotChipActive]}
                                        onPress={() => setSelectedSlot(slot)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.slotText, selectedSlot?.startTime === slot.startTime && styles.slotTextActive]}>
                                            {slot.startTime}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* ── STEP: MASAJISTA ── */}
                {step === 'masajista' && (
                    <View>
                        {masajistasLoading ? (
                            <ActivityIndicator style={{ marginTop: 40 }} color={Colors.light.primary} />
                        ) : masajistasError ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="alert-circle-outline" size={40} color={Colors.light.error} />
                                <Text style={styles.emptyTitle}>Error al cargar</Text>
                                <Text style={styles.emptyText}>{masajistasError}</Text>
                                <TouchableOpacity
                                    onPress={() => selectedSlot && selectedDay && fetchMasajistas(selectedDay.date, selectedSlot.startTime, numEspId ?? undefined)}
                                    style={styles.retryButton}
                                >
                                    <Ionicons name="refresh-outline" size={15} color={Colors.light.primary} />
                                    <Text style={styles.retryText}>Reintentar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : masajistas.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="person-outline" size={40} color={Colors.light.icon} />
                                <Text style={styles.emptyTitle}>Sin masajistas disponibles</Text>
                                <Text style={styles.emptyText}>Todos los masajistas están ocupados en ese horario. Probá con otro.</Text>
                            </View>
                        ) : (
                            <View style={styles.masajistasList}>
                                {masajistas.map(m => (
                                    <TouchableOpacity
                                        key={m.id}
                                        style={[styles.masajistaCard, selectedMasajista?.id === m.id && styles.masajistaCardActive]}
                                        onPress={() => setSelectedMasajista(m)}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.masajistaAvatar}>
                                            {m.fotoUrl ? (
                                                <Image
                                                    source={{ uri: m.fotoUrl }}
                                                    style={styles.masajistaAvatarImage}
                                                />
                                            ) : (
                                                <Ionicons name="person" size={28} color={selectedMasajista?.id === m.id ? "#fff" : Colors.light.primary} />
                                            )}
                                        </View>
                                        <View style={styles.masajistaInfo}>
                                            <Text style={[styles.masajistaNombre, selectedMasajista?.id === m.id && styles.masajistaTextActive]}>
                                                {m.nombre}
                                            </Text>
                                            {m.especialidades && m.especialidades.length > 0 && (
                                                <Text style={[styles.masajistaEsps, selectedMasajista?.id === m.id && styles.masajistaTextActiveLight]} numberOfLines={2}>
                                                    {m.especialidades.join(' · ')}
                                                </Text>
                                            )}
                                            {m.descripcion ? (
                                                <Text style={[styles.masajistaDesc, selectedMasajista?.id === m.id && styles.masajistaTextActiveLight]} numberOfLines={2}>
                                                    {m.descripcion}
                                                </Text>
                                            ) : null}
                                        </View>
                                        {selectedMasajista?.id === m.id && (
                                            <Ionicons name="checkmark-circle" size={22} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* ── STEP: CONFIRMAR ── */}
                {step === 'confirmar' && selectedDay && selectedSlot && selectedMasajista && (
                    <View style={styles.confirmCard}>
                        <Text style={styles.confirmTitle}>Resumen de tu reserva</Text>

                        <View style={styles.confirmRow}>
                            <Ionicons name="business-outline" size={18} color={Colors.light.primary} />
                            <View>
                                <Text style={styles.confirmLabel}>Local</Text>
                                <Text style={styles.confirmValue}>{local?.nombre}</Text>
                            </View>
                        </View>

                        {espNombre && (
                            <View style={styles.confirmRow}>
                                <Ionicons name="leaf-outline" size={18} color={Colors.light.primary} />
                                <View>
                                    <Text style={styles.confirmLabel}>Especialidad</Text>
                                    <Text style={styles.confirmValue}>{espNombre}</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.confirmRow}>
                            <Ionicons name="calendar-outline" size={18} color={Colors.light.primary} />
                            <View>
                                <Text style={styles.confirmLabel}>Fecha</Text>
                                <Text style={styles.confirmValue}>{formatDate(selectedDay.date)}</Text>
                            </View>
                        </View>

                        <View style={styles.confirmRow}>
                            <Ionicons name="time-outline" size={18} color={Colors.light.primary} />
                            <View>
                                <Text style={styles.confirmLabel}>Horario</Text>
                                <Text style={styles.confirmValue}>{selectedSlot.startTime} – {selectedSlot.endTime}</Text>
                            </View>
                        </View>

                        <View style={espPrice !== null ? styles.confirmRow : [styles.confirmRow, { borderBottomWidth: 0 }]}>
                            <Ionicons name="person-outline" size={18} color={Colors.light.primary} />
                            <View>
                                <Text style={styles.confirmLabel}>Masajista</Text>
                                <Text style={styles.confirmValue}>{selectedMasajista.nombre}</Text>
                            </View>
                        </View>

                        {espPrice !== null && (
                            <View style={[styles.confirmRow, { borderBottomWidth: 0 }]}>
                                <Ionicons name="cash-outline" size={18} color={Colors.light.primary} />
                                <View>
                                    <Text style={styles.confirmLabel}>Precio</Text>
                                    <Text style={[styles.confirmValue, { color: Colors.light.primary }]}>
                                        $ {Number(espPrice).toLocaleString('es-AR')}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom action bar */}
            {step !== 'confirmar' ? (
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.nextButton, !canNext() && styles.nextButtonDisabled]}
                        onPress={goNext}
                        disabled={!canNext()}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.nextText}>Continuar</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.nextButton, isBooking && styles.nextButtonDisabled]}
                        onPress={handleConfirm}
                        disabled={isBooking}
                        activeOpacity={0.85}
                    >
                        {isBooking
                            ? <ActivityIndicator color="#fff" />
                            : espPrice !== null
                                ? <>
                                    <Ionicons name="card-outline" size={18} color="#fff" />
                                    <Text style={styles.nextText}>Confirmar y pagar</Text>
                                  </>
                                : <>
                                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                                    <Text style={styles.nextText}>Confirmar reserva</Text>
                                  </>
                        }
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Overlay de flujo de pago (polling / timeout) ── */}
            {(paymentPhase === 'polling' || paymentPhase === 'timeout') && (
                <View style={styles.resultOverlay}>
                    <View style={styles.resultCard}>
                        {paymentPhase === 'timeout' ? (
                            <>
                                <View style={styles.resultIconWrapper}>
                                    <View style={[styles.resultIconBg, { backgroundColor: '#FEF3C7' }]}>
                                        <Ionicons name="warning-outline" size={52} color="#D97706" />
                                    </View>
                                </View>
                                <Text style={styles.resultTitle}>No pudimos confirmar el pago</Text>
                                <Text style={[styles.resultErrorMsg, { marginBottom: 24 }]}>
                                    Revisá el estado de tu reserva en "Mis turnos". Si el pago fue procesado, aparecerá actualizado en breve.
                                </Text>
                                <TouchableOpacity
                                    style={styles.resultPrimaryBtn}
                                    onPress={() => {
                                        setPaymentPhase('idle')
                                        pendingBookingRef.current = null
                                        router.replace('/(client)/bookings')
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="calendar" size={18} color="#fff" />
                                    <Text style={styles.resultPrimaryBtnText}>Ver mis turnos</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            /* polling */
                            <>
                                <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginBottom: 20 }} />
                                <Text style={styles.resultTitle}>Verificando tu pago…</Text>
                                <Text style={styles.resultSubtitle}>
                                    Estamos consultando el estado con Mercado Pago. Esto puede tardar unos segundos.
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            )}

            {/* ── Overlay de resultado (éxito / error) ── */}
            {bookingResult !== null && (
                <View style={styles.resultOverlay}>
                    <View style={styles.resultCard}>
                        {bookingResult.ok ? (
                            <>
                                {/* Ícono de éxito */}
                                <View style={styles.resultIconWrapper}>
                                    <View style={[styles.resultIconBg, { backgroundColor: Colors.light.successLight }]}>
                                        <Ionicons name="checkmark-circle" size={52} color={Colors.light.success} />
                                    </View>
                                </View>

                                <Text style={styles.resultTitle}>
                                    {bookingResult.ok && bookingResult.price !== null ? '¡Seña confirmada!' : '¡Reserva realizada!'}
                                </Text>
                                <Text style={styles.resultSubtitle}>
                                    {bookingResult.ok && bookingResult.price !== null
                                        ? 'Tu pago fue aprobado y tu turno quedó confirmado.'
                                        : 'Tu solicitud fue enviada. El local la revisará pronto.'}
                                </Text>

                                {/* Detalles */}
                                <View style={styles.resultDetails}>
                                    {bookingResult.especialidad && (
                                        <View style={styles.resultRow}>
                                            <Ionicons name="leaf-outline" size={16} color={Colors.light.primary} />
                                            <Text style={styles.resultRowText}>{bookingResult.especialidad}</Text>
                                        </View>
                                    )}
                                    <View style={styles.resultRow}>
                                        <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
                                        <Text style={styles.resultRowText}>{formatDate(bookingResult.date)}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
                                        <Text style={styles.resultRowText}>{bookingResult.time}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Ionicons name="person-outline" size={16} color={Colors.light.primary} />
                                        <Text style={styles.resultRowText}>{bookingResult.masajista}</Text>
                                    </View>
                                    {bookingResult.price !== null && (
                                        <View style={styles.resultRow}>
                                            <Ionicons name="cash-outline" size={16} color={Colors.light.primary} />
                                            <Text style={styles.resultRowText}>
                                                Seña: ${Number(bookingResult.price).toLocaleString('es-AR')}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.resultPrimaryBtn}
                                    onPress={() => router.replace('/(client)/bookings')}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="calendar" size={18} color="#fff" />
                                    <Text style={styles.resultPrimaryBtnText}>Ver mis turnos</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Ícono de error */}
                                <View style={styles.resultIconWrapper}>
                                    <View style={[styles.resultIconBg, { backgroundColor: Colors.light.errorLight }]}>
                                        <Ionicons name="close-circle" size={52} color={Colors.light.error} />
                                    </View>
                                </View>

                                <Text style={styles.resultTitle}>No se pudo reservar</Text>
                                <Text style={styles.resultErrorMsg}>{bookingResult.message}</Text>

                                <View style={styles.resultActions}>
                                    <TouchableOpacity
                                        style={styles.resultSecondaryBtn}
                                        onPress={() => { setBookingResult(null); router.back() }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.resultSecondaryBtnText}>Volver</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.resultPrimaryBtn}
                                        onPress={() => setBookingResult(null)}
                                        activeOpacity={0.85}
                                    >
                                        <Ionicons name="refresh-outline" size={16} color="#fff" />
                                        <Text style={styles.resultPrimaryBtnText}>Reintentar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:            { flex: 1, backgroundColor: Colors.light.background },
    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    backButton:           { padding: 4 },
    headerTitle:          { fontSize: 18, fontWeight: "700", color: Colors.light.text, flex: 1, textAlign: "center", marginHorizontal: 8 },
    progress: {
        flexDirection: "row", justifyContent: "center",
        paddingVertical: 14, gap: 8,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.light.border,
    },
    dotActive:            { backgroundColor: Colors.light.primary, width: 24 },
    dotDone:              { backgroundColor: Colors.light.primary, opacity: 0.4 },
    summaryBar: {
        flexDirection: "row", flexWrap: "wrap",
        paddingHorizontal: 20, paddingBottom: 10, gap: 4,
    },
    summaryItem:          { fontSize: 12, color: Colors.light.icon, fontWeight: "500" },
    content:              { paddingHorizontal: 20, paddingTop: 16 },
    stepLabel:            { fontSize: 14, color: Colors.light.icon, marginBottom: 16 },

    // Date grid
    dateGrid:             { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    dateCard: {
        width: 72, alignItems: "center", paddingVertical: 14,
        borderRadius: 14, backgroundColor: Colors.light.card,
        borderWidth: 1.5, borderColor: Colors.light.border, gap: 2,
    },
    dateCardActive:       { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    dateDayName:          { fontSize: 11, fontWeight: "600", color: Colors.light.icon, textTransform: "uppercase" },
    dateDayNum:           { fontSize: 22, fontWeight: "800", color: Colors.light.text },
    dateMonth:            { fontSize: 11, color: Colors.light.icon },
    dateTextActive:       { color: "#fff" },
    slotsBadge: {
        marginTop: 4, backgroundColor: Colors.light.border,
        borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
    },
    slotsBadgeActive:     { backgroundColor: "rgba(255,255,255,0.25)" },
    slotsCount:           { fontSize: 10, fontWeight: "700", color: Colors.light.icon },

    // Slots grid
    slotsGrid:            { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    slotChip: {
        paddingHorizontal: 18, paddingVertical: 12,
        borderRadius: 12, backgroundColor: Colors.light.card,
        borderWidth: 1.5, borderColor: Colors.light.border,
    },
    slotChipActive:       { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    slotText:             { fontSize: 15, fontWeight: "600", color: Colors.light.text },
    slotTextActive:       { color: "#fff" },

    // Masajistas
    masajistasList:       { gap: 12 },
    masajistaCard: {
        flexDirection: "row", alignItems: "center", gap: 14,
        padding: 16, borderRadius: 16,
        backgroundColor: Colors.light.card,
        borderWidth: 1.5, borderColor: Colors.light.border,
    },
    masajistaCardActive:  { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    masajistaAvatar: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: Colors.light.background,
        justifyContent: "center", alignItems: "center",
        overflow: "hidden",
    },
    masajistaAvatarImage: {
        width: 52, height: 52, borderRadius: 26,
    },
    masajistaInfo:        { flex: 1, gap: 3 },
    masajistaNombre:      { fontSize: 16, fontWeight: "700", color: Colors.light.text },
    masajistaEsps:        { fontSize: 12, color: Colors.light.primary, fontWeight: "500" },
    masajistaDesc:        { fontSize: 13, color: Colors.light.icon },
    masajistaTextActive:  { color: "#fff" },
    masajistaTextActiveLight: { color: "rgba(255,255,255,0.75)" },

    // Confirm card
    confirmCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 18, padding: 20,
        borderWidth: 1, borderColor: Colors.light.border, gap: 0,
    },
    confirmTitle:         { fontSize: 18, fontWeight: "700", color: Colors.light.text, marginBottom: 20 },
    confirmRow: {
        flexDirection: "row", alignItems: "flex-start", gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: Colors.light.border,
    },
    confirmLabel:         { fontSize: 12, color: Colors.light.icon, marginBottom: 2 },
    confirmValue:         { fontSize: 15, fontWeight: "600", color: Colors.light.text },

    // Empty states
    emptyState:           { alignItems: "center", paddingTop: 60, gap: 10 },
    emptyTitle:           { fontSize: 16, fontWeight: "600", color: Colors.light.text },
    emptyText:            { fontSize: 14, color: Colors.light.icon, textAlign: "center", paddingHorizontal: 20 },
    retryButton: {
        flexDirection: "row", alignItems: "center", gap: 6,
        marginTop: 4, paddingVertical: 8, paddingHorizontal: 18,
        borderRadius: 10, borderWidth: 1.5, borderColor: Colors.light.primary,
    },
    retryText:            { fontSize: 14, color: Colors.light.primary, fontWeight: "600" },

    // Bottom bar
    bottomBar: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingBottom: 36, paddingTop: 12,
        backgroundColor: Colors.light.background,
        borderTopWidth: 1, borderTopColor: Colors.light.border,
    },
    nextButton: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
        backgroundColor: Colors.light.primary, paddingVertical: 16, borderRadius: 16,
    },
    nextButtonDisabled:   { opacity: 0.45 },
    nextText:             { color: "#fff", fontSize: 16, fontWeight: "700" },

    // ── Overlay de resultado ────────────────────────────────────────────────
    resultOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 100,
    },
    resultCard: {
        backgroundColor: Colors.light.background,
        borderRadius: 24,
        padding: 28,
        width: '100%',
        alignItems: 'center',
        gap: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },
    resultIconWrapper:    { marginBottom: 20 },
    resultIconBg: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.light.text,
        letterSpacing: -0.3,
        textAlign: 'center',
        marginBottom: 6,
    },
    resultSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
        marginBottom: 24,
    },
    resultErrorMsg: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
        marginTop: 6,
    },
    resultDetails: {
        width: '100%',
        backgroundColor: Colors.light.card,
        borderRadius: 14,
        padding: 16,
        gap: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    resultRowText: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
        flex: 1,
    },
    resultActions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    resultPrimaryBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.light.primary,
        paddingVertical: 14,
        borderRadius: 14,
    },
    resultPrimaryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    resultSecondaryBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.card,
    },
    resultSecondaryBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
    },
})
