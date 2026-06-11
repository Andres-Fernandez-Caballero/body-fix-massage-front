import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { useLocals } from "@/hooks/use-locals"
import { useLocalBooking } from "@/hooks/use-locals"
import type { Local } from "@/contracts/models/local.interface"

export default function LocalDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const localId = Number(id)

    const { locals, loading: localsLoading, fetchLocals } = useLocals()
    const { especialidades, fetchEspecialidades } = useLocalBooking(localId)
    const [selectedEspecialidadId, setSelectedEspecialidadId] = useState<number | null>(null)

    const local: Local | undefined = locals.find(l => l.id === localId)

    useEffect(() => {
        if (locals.length === 0) fetchLocals()
        fetchEspecialidades()
    }, [localId])

    const handleOpenMaps = () => {
        if (!local?.direccion) return
        const address = [local.direccion, local.localidad].filter(Boolean).join(", ")
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        Linking.openURL(url)
    }

    const handleReservar = () => {
        router.push({
            pathname: "/(client)/local/reservar",
            params: {
                localId: localId,
                especialidadId: selectedEspecialidadId ?? '',
            },
        })
    }

    if (localsLoading && !local) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.light.primary} />
            </View>
        )
    }

    if (!local) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Local no encontrado</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Volver</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{local.nombre}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    {local.imageUrl ? (
                        <Image
                            source={{ uri: local.imageUrl }}
                            style={StyleSheet.absoluteFillObject}
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="business" size={56} color={Colors.light.primary} />
                    )}
                </View>

                {/* Info section */}
                <View style={styles.section}>
                    <Text style={styles.localName}>{local.nombre}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={15} color={Colors.light.icon} />
                        <Text style={styles.infoText}>{local.direccion}{local.localidad ? ` · ${local.localidad}` : ''}</Text>
                    </View>

                    {/* Botón Ver en mapa */}
                    {local.direccion ? (
                        <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps} activeOpacity={0.8}>
                            <Ionicons name="navigate-outline" size={15} color={Colors.light.primary} />
                            <Text style={styles.mapsButtonText}>Ver ubicación en Google Maps</Text>
                            <Ionicons name="open-outline" size={13} color={Colors.light.icon} />
                        </TouchableOpacity>
                    ) : null}

                    {local.telefono ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={15} color={Colors.light.icon} />
                            <Text style={styles.infoText}>{local.telefono}</Text>
                        </View>
                    ) : null}

                    {local.instagram ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="logo-instagram" size={15} color={Colors.light.icon} />
                            <Text style={styles.infoText}>@{local.instagram.replace(/^@/, '')}</Text>
                        </View>
                    ) : null}

                    {local.descripcion ? (
                        <Text style={styles.descripcion}>{local.descripcion}</Text>
                    ) : null}

                    <View style={styles.durationBadge}>
                        <Ionicons name="time-outline" size={14} color={Colors.light.primary} />
                        <Text style={styles.durationText}>Turnos de {local.slotDurationMinutes} minutos</Text>
                    </View>
                </View>

                {/* Especialidades */}
                {especialidades.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Especialidades disponibles</Text>
                        <Text style={styles.sectionSubtitle}>Seleccioná el tipo de masaje (requerido para reservar)</Text>

                        <View style={styles.especialidadesGrid}>
                            {especialidades.map(esp => {
                                const isSelected = selectedEspecialidadId === esp.id
                                return (
                                    <TouchableOpacity
                                        key={esp.id}
                                        style={[
                                            styles.especialidadChip,
                                            isSelected && styles.especialidadChipActive,
                                        ]}
                                        onPress={() =>
                                            setSelectedEspecialidadId(esp.id)
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name={isSelected ? "checkmark-circle" : "leaf-outline"}
                                            size={15}
                                            color={isSelected ? "#fff" : Colors.light.primary}
                                            style={{ marginTop: esp.price != null ? 2 : 0 }}
                                        />
                                        <View>
                                            <Text style={[
                                                styles.especialidadText,
                                                isSelected && styles.especialidadTextActive,
                                            ]}>
                                                {esp.nombre}
                                            </Text>
                                            {esp.price != null && (
                                                <Text style={[
                                                    styles.especialidadPrecio,
                                                    isSelected && styles.especialidadPrecioActive,
                                                ]}>
                                                    Seña ${Number(esp.price).toLocaleString("es-AR")}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                {(() => {
                    const selectedEsp = especialidades.find(e => e.id === selectedEspecialidadId)
                    return (
                        <>
                            {selectedEsp?.price != null && (
                                <Text style={styles.senaNota}>
                                    Seña a abonar: ${Number(selectedEsp.price).toLocaleString("es-AR")}
                                </Text>
                            )}
                            <TouchableOpacity
                                style={[styles.reservarButton, !selectedEspecialidadId && styles.reservarButtonDisabled]}
                                onPress={handleReservar}
                                disabled={!selectedEspecialidadId}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="calendar-outline" size={18} color="#fff" />
                                <Text style={styles.reservarText}>
                                    {selectedEsp ? `Reservar — ${selectedEsp.nombre}` : 'Seleccioná una especialidad'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )
                })()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:        { flex: 1, backgroundColor: Colors.light.background },
    center:           { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    errorText:        { color: Colors.light.text, fontSize: 16 },
    link:             { color: Colors.light.primary, fontWeight: "600" },
    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    backButton:       { padding: 4 },
    headerTitle:      { fontSize: 18, fontWeight: "700", color: Colors.light.text, flex: 1, textAlign: "center", marginHorizontal: 8 },
    scrollContent:    { paddingBottom: 20 },
    hero: {
        height: 180, backgroundColor: Colors.light.card,
        justifyContent: "center", alignItems: "center",
    },
    section:          { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
    localName:        { fontSize: 24, fontWeight: "800", color: Colors.light.text, marginBottom: 12, letterSpacing: -0.3 },
    infoRow:          { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
    infoText:         { fontSize: 14, color: Colors.light.icon, flex: 1 },
    descripcion:      { fontSize: 14, color: Colors.light.text, lineHeight: 22, marginTop: 8, marginBottom: 8 },
    durationBadge: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: Colors.light.card,
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
        alignSelf: "flex-start", marginTop: 12,
        borderWidth: 1, borderColor: Colors.light.border,
    },
    durationText:     { fontSize: 13, color: Colors.light.primary, fontWeight: "600" },
    sectionTitle:     { fontSize: 18, fontWeight: "700", color: Colors.light.text, marginBottom: 4 },
    sectionSubtitle:  { fontSize: 13, color: Colors.light.icon, marginBottom: 16 },
    especialidadesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    especialidadChip: {
        flexDirection: "row", alignItems: "center", gap: 6,
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 12, backgroundColor: Colors.light.card,
        borderWidth: 1.5, borderColor: Colors.light.border,
    },
    especialidadChipActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    especialidadText: { fontSize: 13, color: Colors.light.text, fontWeight: "500" },
    especialidadTextActive: { color: "#fff", fontWeight: "600" },
    especialidadPrecio: { fontSize: 11, color: Colors.light.icon, fontWeight: "500", marginTop: 2 },
    especialidadPrecioActive: { color: "rgba(255,255,255,0.8)" },
    senaNota: {
        fontSize: 13, color: Colors.light.icon, textAlign: "center",
        marginBottom: 8, fontWeight: "500",
    },
    bottomBar: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingBottom: 36, paddingTop: 12,
        backgroundColor: Colors.light.background,
        borderTopWidth: 1, borderTopColor: Colors.light.border,
    },
    reservarButton: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
        backgroundColor: Colors.light.primary,
        paddingVertical: 16, borderRadius: 16,
    },
    reservarButtonDisabled: { opacity: 0.4 },
    reservarText: { color: "#fff", fontSize: 16, fontWeight: "700" },

    mapsButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
        backgroundColor: Colors.light.primaryLight,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    mapsButtonText: {
        fontSize: 13,
        color: Colors.light.primary,
        fontWeight: "600",
        flex: 1,
    },
})
