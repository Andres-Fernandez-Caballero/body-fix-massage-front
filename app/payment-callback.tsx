import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { getBookingPaymentStatus } from '@/data/api/locals.api'

type Phase = 'resolving' | 'success' | 'failure' | 'timeout'

export default function PaymentCallbackScreen() {
    const router    = useRouter()
    const { status, booking_id } = useLocalSearchParams<{ status: string; booking_id: string }>()

    // El backend puede enviar sus propios valores ('success'/'failure')
    // o los de MP directamente ('approved'/'rejected'/'cancelled').
    const isSuccess = status === 'success' || status === 'approved'
    const isFailure = status === 'failure' || status === 'rejected' || status === 'cancelled'

    const [phase, setPhase] = useState<Phase>(
        isSuccess ? 'success' :
        isFailure ? 'failure' : 'resolving'
    )

    const pollingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const poll = (attempt = 1) => {
        const MAX_ATTEMPTS = 20
        const bookingId = Number(booking_id)
        if (!bookingId) { setPhase('failure'); return }

        getBookingPaymentStatus(bookingId)
            .then(result => {
                if (result.payment_status === 'approved') {
                    setPhase('success')
                } else if (result.payment_status === 'rejected') {
                    setPhase('failure')
                } else if (attempt < MAX_ATTEMPTS) {
                    pollingTimer.current = setTimeout(() => poll(attempt + 1), 3000)
                } else {
                    setPhase('timeout')
                }
            })
            .catch(() => {
                if (attempt < MAX_ATTEMPTS) {
                    pollingTimer.current = setTimeout(() => poll(attempt + 1), 3000)
                } else {
                    setPhase('timeout')
                }
            })
    }

    useEffect(() => {
        if (!isSuccess && !isFailure) poll()
        return () => { if (pollingTimer.current) clearTimeout(pollingTimer.current) }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {phase === 'resolving' && (
                    <>
                        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginBottom: 20 }} />
                        <Text style={styles.title}>Verificando tu pago…</Text>
                        <Text style={styles.subtitle}>
                            Estamos consultando el estado con Mercado Pago. Esto puede tardar unos segundos.
                        </Text>
                    </>
                )}

                {phase === 'success' && (
                    <>
                        <View style={[styles.iconBg, { backgroundColor: Colors.light.successLight }]}>
                            <Ionicons name="checkmark-circle" size={52} color={Colors.light.success} />
                        </View>
                        <Text style={styles.title}>¡Seña confirmada!</Text>
                        <Text style={styles.subtitle}>Tu pago fue aprobado y tu turno quedó confirmado.</Text>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(client)/bookings')} activeOpacity={0.85}>
                            <Ionicons name="calendar" size={18} color="#fff" />
                            <Text style={styles.primaryBtnText}>Ver mis turnos</Text>
                        </TouchableOpacity>
                    </>
                )}

                {phase === 'failure' && (
                    <>
                        <View style={[styles.iconBg, { backgroundColor: Colors.light.errorLight }]}>
                            <Ionicons name="close-circle" size={52} color={Colors.light.error} />
                        </View>
                        <Text style={styles.title}>Pago rechazado</Text>
                        <Text style={styles.subtitle}>El pago fue rechazado. No se realizó ningún cobro.</Text>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(client)/explorer')} activeOpacity={0.85}>
                            <Ionicons name="refresh-outline" size={18} color="#fff" />
                            <Text style={styles.primaryBtnText}>Volver al inicio</Text>
                        </TouchableOpacity>
                    </>
                )}

                {phase === 'timeout' && (
                    <>
                        <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="warning-outline" size={52} color="#D97706" />
                        </View>
                        <Text style={styles.title}>No pudimos confirmar el pago</Text>
                        <Text style={styles.subtitle}>
                            Revisá el estado de tu reserva en "Mis turnos". Si el pago fue procesado, aparecerá actualizado en breve.
                        </Text>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(client)/bookings')} activeOpacity={0.85}>
                            <Ionicons name="calendar" size={18} color="#fff" />
                            <Text style={styles.primaryBtnText}>Ver mis turnos</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        gap: 0,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    iconBg: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.light.primary,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
        alignSelf: 'stretch',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
})
