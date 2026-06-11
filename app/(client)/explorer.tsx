import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useLocals } from "@/hooks/use-locals"
import { useAuth } from "@/hooks/use-auth"
import * as Location from "expo-location"
import { Local } from "@/contracts/models/local.interface"

// ── Haversine distance in km ────────────────────────────────────────────────
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type SortMode = "az" | "nearby" | "rating"

const SORT_OPTIONS: { key: SortMode; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
    { key: "az",     label: "A-Z",              icon: "text-outline"         },
    { key: "nearby", label: "Más cercano",       icon: "navigate-outline"     },
    { key: "rating", label: "Mejor calificado",  icon: "star-outline"         },
]

export default function ExplorerScreen() {
    const router = useRouter()
    const { user } = useAuth()
    const { locals, loading, error, fetchLocals } = useLocals()
    const [searchQuery, setSearchQuery]           = useState("")
    const [selectedLocalidad, setSelectedLocalidad] = useState<string | null>(null)
    const [sortMode, setSortMode]                 = useState<SortMode>("az")
    const [userCoords, setUserCoords]             = useState<{ lat: number; lon: number } | null>(null)
    const [locationLoading, setLocationLoading]   = useState(false)
    const [locationError, setLocationError]       = useState<string | null>(null)

    useEffect(() => {
        fetchLocals()
    }, [])

    // ── Request location when "Más cercano" is selected ──────────────────────
    const requestLocation = useCallback(async () => {
        if (userCoords) return // already have it
        setLocationLoading(true)
        setLocationError(null)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setLocationError("Permiso de ubicación denegado.")
                setSortMode("az")
                return
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
            setUserCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude })
        } catch {
            setLocationError("No se pudo obtener tu ubicación.")
            setSortMode("az")
        } finally {
            setLocationLoading(false)
        }
    }, [userCoords])

    const handleSortSelect = (mode: SortMode) => {
        setSortMode(mode)
        if (mode === "nearby") {
            requestLocation()
        }
    }

    const localidades = useMemo(() => {
        const all = locals.map(l => l.localidad).filter(Boolean) as string[]
        return Array.from(new Set(all)).sort()
    }, [locals])

    // ── Filter + sort ─────────────────────────────────────────────────────────
    const displayed = useMemo(() => {
        const q = searchQuery.toLowerCase()

        let result = locals.filter(local => {
            const matchesSearch =
                local.nombre.toLowerCase().includes(q) ||
                (local.localidad ?? "").toLowerCase().includes(q) ||
                (local.descripcion ?? "").toLowerCase().includes(q)
            const matchesLocalidad = selectedLocalidad ? local.localidad === selectedLocalidad : true
            return matchesSearch && matchesLocalidad
        })

        if (sortMode === "nearby" && userCoords) {
            result = [...result].sort((a, b) => {
                const dA = a.latitude != null && a.longitude != null
                    ? haversine(userCoords.lat, userCoords.lon, a.latitude, a.longitude)
                    : Infinity
                const dB = b.latitude != null && b.longitude != null
                    ? haversine(userCoords.lat, userCoords.lon, b.latitude, b.longitude)
                    : Infinity
                return dA - dB
            })
        } else if (sortMode === "rating") {
            result = [...result].sort((a, b) => {
                const rA = a.avgLocalScore ?? -1
                const rB = b.avgLocalScore ?? -1
                return rB - rA
            })
        }
        // "az" keeps the API order (already sorted by nombre_local)

        return result
    }, [locals, searchQuery, selectedLocalidad, sortMode, userCoords])

    const greeting = user?.name ? `¡Hola, ${user.name}!` : "¡Bienvenido!"

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.headerGreeting}>{greeting} 👋</Text>
                <Text style={styles.headerTitle}>Encontrá tu local</Text>
                <Text style={styles.headerSubtitle}>Reservá el masaje perfecto para vos</Text>
            </View>

            {/* ── Buscador ── */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={Colors.light.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre, barrio o descripción..."
                    placeholderTextColor={Colors.light.icon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={18} color={Colors.light.icon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* ── Filtrar por / Ordenar por (solo cuando los locales ya cargaron) ── */}
            {!loading && locals.length > 0 && (
                <>
                    {/* ── Filtrar por barrio ── */}
                    {localidades.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Filtrar por:</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filtersContent}
                            >
                                <TouchableOpacity
                                    style={[styles.chip, !selectedLocalidad && styles.chipActive]}
                                    onPress={() => setSelectedLocalidad(null)}
                                >
                                    <Text style={[styles.chipText, !selectedLocalidad && styles.chipTextActive]}>
                                        Todos
                                    </Text>
                                </TouchableOpacity>
                                {localidades.map(loc => (
                                    <TouchableOpacity
                                        key={loc}
                                        style={[styles.chip, selectedLocalidad === loc && styles.chipActive]}
                                        onPress={() => setSelectedLocalidad(loc === selectedLocalidad ? null : loc)}
                                    >
                                        <Text style={[styles.chipText, selectedLocalidad === loc && styles.chipTextActive]}>
                                            {loc}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* ── Ordenar por ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Ordenar por:</Text>
                        <View style={styles.sortRow}>
                            {SORT_OPTIONS.map(opt => {
                                const active = sortMode === opt.key
                                const isNearbyLoading = opt.key === "nearby" && locationLoading
                                return (
                                    <TouchableOpacity
                                        key={opt.key}
                                        style={[styles.sortChip, active && styles.sortChipActive]}
                                        onPress={() => handleSortSelect(opt.key)}
                                        activeOpacity={0.75}
                                    >
                                        {isNearbyLoading
                                            ? <ActivityIndicator size={12} color={active ? "#fff" : Colors.light.primary} />
                                            : <Ionicons name={opt.icon} size={13} color={active ? "#fff" : Colors.light.icon} />
                                        }
                                        <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </>
            )}

            {/* Location error hint */}
            {locationError ? (
                <Text style={styles.locationErrorText}>{locationError}</Text>
            ) : null}

            {/* "Más cercano" waiting for coords hint */}
            {sortMode === "nearby" && locationLoading ? (
                <Text style={styles.locationHintText}>Obteniendo tu ubicación...</Text>
            ) : null}

            {/* API error banner */}
            {error ? (
                <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle-outline" size={16} color={Colors.light.error} />
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            ) : null}

            {/* ── Lista de locales ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {displayed.map(local => (
                    <LocalCard key={local.id} local={local} userCoords={sortMode === "nearby" ? userCoords : null} onPress={() =>
                        router.push({ pathname: "/(client)/local/[id]", params: { id: local.id } })
                    } />
                ))}

                {loading && displayed.length === 0 && (
                    <View style={styles.centerState}>
                        <View style={styles.stateIconWrapper}>
                            <Ionicons name="hourglass-outline" size={32} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.stateText}>Cargando locales...</Text>
                    </View>
                )}

                {!loading && displayed.length === 0 && (
                    <View style={styles.centerState}>
                        <View style={styles.stateIconWrapper}>
                            <Ionicons name="search-outline" size={32} color={Colors.light.icon} />
                        </View>
                        <Text style={styles.stateTitle}>Sin resultados</Text>
                        <Text style={styles.stateText}>Probá con otra búsqueda o barrio</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

// ── Local card ───────────────────────────────────────────────────────────────
function LocalCard({
    local,
    userCoords,
    onPress,
}: {
    local: Local
    userCoords: { lat: number; lon: number } | null
    onPress: () => void
}) {
    const distanceKm = useMemo(() => {
        if (!userCoords || local.latitude == null || local.longitude == null) return null
        const d = haversine(userCoords.lat, userCoords.lon, local.latitude, local.longitude)
        return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`
    }, [userCoords, local.latitude, local.longitude])

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.88}
            onPress={onPress}
        >
            {/* Imagen del local — real si fue cargada, gradiente placeholder si no */}
            {local.imageUrl ? (
                <View style={styles.cardImagePlaceholder}>
                    <Image
                        source={{ uri: local.imageUrl }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                    />
                    {/* Badges sobre la imagen real */}
                    {local.localidad ? (
                        <View style={styles.localidadBadge}>
                            <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.localidadBadgeText}>{local.localidad}</Text>
                        </View>
                    ) : null}
                    {local.avgLocalScore != null && local.reviewsCount > 0 ? (
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={11} color="#F59E0B" />
                            <Text style={styles.ratingBadgeText}>{local.avgLocalScore.toFixed(1)}</Text>
                        </View>
                    ) : null}
                </View>
            ) : (
                <LinearGradient
                    colors={["#F2E0D4", "#E0B8A0", "#C17A5C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardImagePlaceholder}
                >
                    <View style={styles.cardImageIcon}>
                        <Ionicons name="business-outline" size={34} color="rgba(255,255,255,0.95)" />
                    </View>
                    {local.localidad ? (
                        <View style={styles.localidadBadge}>
                            <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.localidadBadgeText}>{local.localidad}</Text>
                        </View>
                    ) : null}
                    {local.avgLocalScore != null && local.reviewsCount > 0 ? (
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={11} color="#F59E0B" />
                            <Text style={styles.ratingBadgeText}>{local.avgLocalScore.toFixed(1)}</Text>
                        </View>
                    ) : null}
                </LinearGradient>
            )}

            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{local.nombre}</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={13} color={Colors.light.icon} />
                    <Text style={styles.infoText}>
                        {[local.direccion, local.localidad].filter(Boolean).join(" · ")}
                    </Text>
                </View>

                {local.descripcion ? (
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {local.descripcion}
                    </Text>
                ) : null}

                <View style={styles.cardFooter}>
                    <View style={styles.durationChip}>
                        <Ionicons name="time-outline" size={12} color={Colors.light.icon} />
                        <Text style={styles.durationText}>{local.slotDurationMinutes} min/turno</Text>
                    </View>

                    {distanceKm ? (
                        <View style={styles.distanceChip}>
                            <Ionicons name="navigate-outline" size={12} color={Colors.light.primary} />
                            <Text style={styles.distanceText}>{distanceKm}</Text>
                        </View>
                    ) : local.avgLocalScore != null && local.reviewsCount > 0 ? (
                        <View style={styles.distanceChip}>
                            <Ionicons name="star" size={12} color="#F59E0B" />
                            <Text style={styles.distanceText}>
                                {local.avgLocalScore.toFixed(1)} ({local.reviewsCount})
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.reservarButton}>
                        <Text style={styles.reservarText}>Ver local</Text>
                        <Ionicons name="arrow-forward" size={13} color="#fff" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container:            { flex: 1, backgroundColor: Colors.light.background },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerGreeting: {
        fontSize: 15,
        color: Colors.light.primary,
        fontWeight: "600",
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: Colors.light.text,
        letterSpacing: -0.4,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
    },

    // ── Buscador ─────────────────────────────────────────────────────────────
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.card,
        marginHorizontal: 24,
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
        marginBottom: 16,
        gap: 10,
    },
    searchInput:          { flex: 1, fontSize: 15, color: Colors.light.text },
    clearButton:          { padding: 2 },

    // ── Sección labels (alineado con profile.tsx) ─────────────────────────────
    section: {
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.light.icon,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 10,
        marginLeft: 4,
        paddingHorizontal: 24,
    },

    // ── Error banner ──────────────────────────────────────────────────────────
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginHorizontal: 24,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Colors.light.errorLight,
        borderWidth: 1,
        borderColor: Colors.light.error,
    },
    errorBannerText: {
        flex: 1,
        fontSize: 13,
        color: Colors.light.error,
        fontWeight: "500",
    },

    // ── Filtros barrio ────────────────────────────────────────────────────────
    filtersContent:       { paddingHorizontal: 24, gap: 8 },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
    },
    chipActive:           { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    chipText:             { fontSize: 13, fontWeight: "600", color: Colors.light.text },
    chipTextActive:       { color: "#fff" },

    // ── Ordenar ───────────────────────────────────────────────────────────────
    sortRow: {
        flexDirection: "row",
        paddingHorizontal: 24,
        gap: 8,
    },
    sortChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
    },
    sortChipActive:       { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
    sortChipText:         { fontSize: 12, fontWeight: "600", color: Colors.light.icon },
    sortChipTextActive:   { color: "#fff" },

    locationErrorText: {
        fontSize: 12,
        color: Colors.light.error,
        paddingHorizontal: 24,
        marginBottom: 8,
        marginTop: -8,
    },
    locationHintText: {
        fontSize: 12,
        color: Colors.light.icon,
        paddingHorizontal: 24,
        marginBottom: 8,
        marginTop: -8,
    },

    // ── Cards ─────────────────────────────────────────────────────────────────
    list:                 { paddingHorizontal: 24, paddingBottom: 40 },
    card: {
        backgroundColor: Colors.light.background,
        borderRadius: 20,
        marginBottom: 18,
        shadowColor: "#8C5240",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.light.border,
        overflow: "hidden",
    },
    cardImagePlaceholder: {
        width: "100%",
        height: 128,
        justifyContent: "center",
        alignItems: "center",
    },
    cardImageIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.22)",
        justifyContent: "center",
        alignItems: "center",
    },
    localidadBadge: {
        position: "absolute",
        bottom: 10,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "rgba(0,0,0,0.28)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    localidadBadgeText:   { fontSize: 11, color: "#fff", fontWeight: "600" },
    ratingBadge: {
        position: "absolute",
        bottom: 10,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "rgba(0,0,0,0.28)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    ratingBadgeText:      { fontSize: 11, color: "#fff", fontWeight: "600" },
    cardContent:          { padding: 16 },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    infoRow:              { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 },
    infoText:             { fontSize: 13, color: Colors.light.icon, flex: 1 },
    cardDescription: {
        fontSize: 13,
        color: Colors.light.icon,
        lineHeight: 19,
        marginBottom: 14,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    durationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    durationText:         { fontSize: 12, color: Colors.light.icon, fontWeight: "500" },
    distanceChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: Colors.light.primaryLight,
        borderWidth: 1,
        borderColor: Colors.light.border,
        flex: 1,
    },
    distanceText:         { fontSize: 12, color: Colors.light.primary, fontWeight: "600" },
    reservarButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    reservarText:         { color: "#fff", fontSize: 13, fontWeight: "700" },

    // ── Estados vacíos ────────────────────────────────────────────────────────
    centerState:          { alignItems: "center", paddingTop: 60, gap: 10 },
    stateIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.light.card,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    stateTitle:           { color: Colors.light.text, fontSize: 16, fontWeight: "600" },
    stateText:            { color: Colors.light.icon, fontSize: 14 },
})
