import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    ActivityIndicator,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { WebView } from "react-native-webview"
import type { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes"
import * as Location from "expo-location"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Constants from "expo-constants"
import { Colors } from "@/constants/Colors"
import { useLocals } from "@/hooks/use-locals"
import type { Local } from "@/contracts/models/local.interface"

// ─── API key from app.json ──────────────────────────────────────────────────
const iosConfig = Constants.expoConfig?.ios?.config as { googleMapsApiKey?: string } | undefined
const androidConfig = Constants.expoConfig?.android?.config as
    | { googleMaps?: { apiKey?: string } }
    | undefined

const GOOGLE_MAPS_KEY: string =
    iosConfig?.googleMapsApiKey ?? androidConfig?.googleMaps?.apiKey ?? ""

// ─── Map HTML builder ────────────────────────────────────────────────────────
function buildMapHTML(locals: Local[]): string {
    const pins = locals
        .filter(
            (l): l is Local & { latitude: number; longitude: number } =>
                l.latitude !== null && l.longitude !== null,
        )
        .map(l => ({ id: l.id, nombre: l.nombre, latitude: l.latitude, longitude: l.longitude }))

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    body { overflow: hidden; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var LOCALS = ${JSON.stringify(pins)};
    var allMarkers = [];
    var activeIdx = -1;
    var map;
    var userPos = null;
    var userMarker = null;

    function send(data) {
      var msg = JSON.stringify(data);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      } else {
        window.parent.postMessage(msg, '*');
      }
    }

    // Called from React Native to re-center on user
    window.centerOnUser = function() {
      if (userPos && map) {
        map.setCenter(userPos);
        map.setZoom(15);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (map) { map.setCenter(userPos); map.setZoom(15); }
        }, function() {}, { enableHighAccuracy: true, timeout: 8000 });
      }
    };

    // Incoming message listener (web iframe & Android WebView)
    function onIncoming(e) {
      try {
        var data = JSON.parse(e.data);
        if (data.type === 'centerOnUser') window.centerOnUser();
      } catch(_) {}
    }
    window.addEventListener('message', onIncoming);
    document.addEventListener('message', onIncoming);

    function makePin(active) {
      return {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' +
              'm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor:   active ? '#7A3B2E' : '#C17A5C',
        fillOpacity: 1,
        strokeColor: active ? '#C17A5C' : '#ffffff',
        strokeWeight: active ? 2 : 1.5,
        scale:  active ? 2.2 : 1.8,
        anchor: new google.maps.Point(12, 22),
      };
    }

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.6037, lng: -58.3816 },
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
        gestureHandling: 'greedy',
        styles: [
          { elementType: 'geometry',           stylers: [{ color: '#f5f0eb' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f0eb' }] },
          { elementType: 'labels.text.fill',   stylers: [{ color: '#6b5e55' }] },
          { featureType: 'road', elementType: 'geometry',        stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8ddd5' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f0e8e0' }] },
          { featureType: 'water',    elementType: 'geometry', stylers: [{ color: '#c8e0f0' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dff0d8' }] },
          { featureType: 'poi',     elementType: 'labels',   stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      });

      LOCALS.forEach(function(local, idx) {
        var marker = new google.maps.Marker({
          position: { lat: local.latitude, lng: local.longitude },
          map: map,
          title: local.nombre,
          icon: makePin(false),
          zIndex: 10,
        });

        allMarkers.push(marker);

        marker.addListener('click', function() {
          if (activeIdx >= 0 && activeIdx !== idx) {
            allMarkers[activeIdx].setIcon(makePin(false));
            allMarkers[activeIdx].setZIndex(10);
          }
          marker.setIcon(makePin(true));
          marker.setZIndex(20);
          activeIdx = idx;
          send({ type: 'markerPress', localId: local.id });
        });
      });

      map.addListener('click', function() {
        if (activeIdx >= 0) {
          allMarkers[activeIdx].setIcon(makePin(false));
          allMarkers[activeIdx].setZIndex(10);
          activeIdx = -1;
          send({ type: 'mapPress' });
        }
      });

      // User location via browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.setCenter(userPos);
            map.setZoom(14);
            userMarker = new google.maps.Marker({
              position: userPos,
              map: map,
              zIndex: 999,
              title: 'Tu ubicación',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2.5,
              },
            });
          },
          function() { /* stay on default center */ },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap&loading=async" defer></script>
</body>
</html>`
}

// ─── Component ───────────────────────────────────────────────────────────────
type LocationStatus = "loading" | "granted" | "denied"

export default function MapaScreen() {
    const router = useRouter()
    const { locals, loading: localsLoading, fetchLocals } = useLocals()
    const [locationStatus, setLocationStatus] = useState<LocationStatus>(
        Platform.OS === "web" ? "granted" : "loading",
    )
    const [selectedLocal, setSelectedLocal] = useState<Local | null>(null)

    const webViewRef = useRef<InstanceType<typeof WebView>>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iframeRef = useRef<any>(null)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ["45%", "72%"], [])

    // ── Location permission (native only) ──────────────────────────────────
    const requestLocation = useCallback(async () => {
        if (Platform.OS === "web") return
        setLocationStatus("loading")
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            setLocationStatus(status === "granted" ? "granted" : "denied")
        } catch {
            setLocationStatus("granted")
        }
    }, [])

    useEffect(() => {
        fetchLocals()
        requestLocation()
    }, [])

    // ── HTML content ───────────────────────────────────────────────────────
    const htmlContent = useMemo(() => buildMapHTML(locals), [locals])

    // ── Message handler (shared between WebView and iframe) ─────────────────
    const handleMapMessage = useCallback(
        (data: { type: string; localId?: number }) => {
            if (data.type === "markerPress" && data.localId !== undefined) {
                const local = locals.find(l => l.id === data.localId)
                if (local) {
                    setSelectedLocal(local)
                    bottomSheetRef.current?.snapToIndex(0)
                }
            } else if (data.type === "mapPress") {
                bottomSheetRef.current?.close()
            }
        },
        [locals],
    )

    // ── WebView message handler (native) ───────────────────────────────────
    const handleWebViewMessage = useCallback(
        (event: WebViewMessageEvent) => {
            try {
                handleMapMessage(JSON.parse(event.nativeEvent.data))
            } catch {
                // ignore invalid JSON
            }
        },
        [handleMapMessage],
    )

    // ── iframe message listener (web only) ─────────────────────────────────
    useEffect(() => {
        if (Platform.OS !== "web") return
        const handler = (event: MessageEvent) => {
            try {
                handleMapMessage(JSON.parse(event.data as string))
            } catch {
                // ignore
            }
        }
        window.addEventListener("message", handler)
        return () => window.removeEventListener("message", handler)
    }, [handleMapMessage])

    // ── Navigation ─────────────────────────────────────────────────────────
    const handleVerLocal = useCallback(() => {
        if (!selectedLocal) return
        bottomSheetRef.current?.close()
        router.push({
            pathname: "/(client)/local/[id]",
            params: { id: String(selectedLocal.id) },
        })
    }, [selectedLocal, router])

    const openSettings = useCallback(() => {
        if (Platform.OS === "ios") {
            Linking.openURL("app-settings:")
        } else {
            Linking.openSettings()
        }
    }, [])

    // ── Center map on user location ────────────────────────────────────────
    const handleCenterOnUser = useCallback(() => {
        if (Platform.OS === "web") {
            iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ type: "centerOnUser" }),
                "*",
            )
        } else {
            webViewRef.current?.injectJavaScript(
                "window.centerOnUser && window.centerOnUser(); true;",
            )
        }
    }, [])

    // ── Loading ────────────────────────────────────────────────────────────
    if (locationStatus === "loading" || (localsLoading && locals.length === 0)) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Cargando mapa…</Text>
            </View>
        )
    }

    // ── Permission denied (native only) ────────────────────────────────────
    if (locationStatus === "denied") {
        return (
            <View style={styles.center}>
                <View style={styles.iconCircle}>
                    <Ionicons name="location-outline" size={40} color={Colors.light.primary} />
                </View>
                <Text style={styles.permissionTitle}>Ubicación desactivada</Text>
                <Text style={styles.permissionSubtitle}>
                    Para visualizar el mapa necesitás activar la ubicación en la configuración
                    de la app.
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={openSettings}>
                    <Ionicons name="settings-outline" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>Ir a configuración</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={requestLocation}>
                    <Text style={styles.secondaryBtnText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // ── Map ────────────────────────────────────────────────────────────────
    const localsWithCoords = locals.filter(l => l.latitude !== null && l.longitude !== null)

    return (
        <View style={styles.container}>
            {/* Counter badge */}
            {localsWithCoords.length > 0 && (
                <View style={styles.badge} pointerEvents="none">
                    <Ionicons name="location" size={13} color={Colors.light.primary} />
                    <Text style={styles.badgeText}>{localsWithCoords.length} locales</Text>
                </View>
            )}

            {/* Map: WebView on native, <iframe> on web */}
            {Platform.OS === "web"
                ? React.createElement("iframe", {
                      ref: iframeRef,
                      srcDoc: htmlContent,
                      allow: "geolocation",
                      title: "Mapa de locales",
                      style: {
                          flex: 1,
                          border: "none",
                          width: "100%",
                          height: "100%",
                          display: "block",
                      } as React.CSSProperties,
                  })
                : (
                    <WebView
                        ref={webViewRef}
                        source={{ html: htmlContent }}
                        style={styles.mapView}
                        onMessage={handleWebViewMessage}
                        javaScriptEnabled
                        domStorageEnabled
                        geolocationEnabled
                        originWhitelist={["*"]}
                        allowUniversalAccessFromFileURLs
                        mixedContentMode="always"
                        scrollEnabled={false}
                    />
                )}

            {/* Floating locate-me button */}
            <TouchableOpacity
                style={styles.locateBtn}
                onPress={handleCenterOnUser}
                activeOpacity={0.82}
            >
                <Ionicons name="locate" size={22} color={Colors.light.primary} />
            </TouchableOpacity>

            {/* Bottom sheet with local details */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                onClose={() => setSelectedLocal(null)}
                backgroundStyle={styles.sheetBg}
                handleIndicatorStyle={styles.sheetHandle}
            >
                <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
                    {selectedLocal && (
                        <LocalCard local={selectedLocal} onVerLocal={handleVerLocal} />
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    )
}

// ─── Local card (inside bottom sheet) ────────────────────────────────────────
function LocalCard({ local, onVerLocal }: { local: Local; onVerLocal: () => void }) {
    return (
        <View style={cardStyles.container}>
            {/* Header */}
            <View style={cardStyles.header}>
                <View style={cardStyles.headerLeft}>
                    <Text style={cardStyles.name} numberOfLines={2}>
                        {local.nombre}
                    </Text>
                    {local.localidad && (
                        <View style={cardStyles.row}>
                            <Ionicons
                                name="location-outline"
                                size={13}
                                color={Colors.light.icon}
                            />
                            <Text style={cardStyles.meta}>{local.localidad}</Text>
                        </View>
                    )}
                </View>

                {local.avgLocalScore !== null && (
                    <View style={cardStyles.ratingChip}>
                        <Ionicons name="star" size={12} color={Colors.light.warning} />
                        <Text style={cardStyles.ratingText}>
                            {local.avgLocalScore.toFixed(1)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Address */}
            {local.direccion && (
                <View style={cardStyles.row}>
                    <Ionicons name="map-outline" size={13} color={Colors.light.icon} />
                    <Text style={cardStyles.meta}>{local.direccion}</Text>
                </View>
            )}

            {/* Chips */}
            <View style={cardStyles.chipsRow}>
                <View style={cardStyles.chip}>
                    <Ionicons name="time-outline" size={13} color={Colors.light.primary} />
                    <Text style={cardStyles.chipText}>{local.slotDurationMinutes} min</Text>
                </View>
                {local.reviewsCount > 0 && (
                    <View style={cardStyles.chip}>
                        <Ionicons
                            name="chatbubble-outline"
                            size={13}
                            color={Colors.light.primary}
                        />
                        <Text style={cardStyles.chipText}>
                            {local.reviewsCount}{" "}
                            {local.reviewsCount === 1 ? "reseña" : "reseñas"}
                        </Text>
                    </View>
                )}
            </View>

            {/* Description */}
            {local.descripcion && (
                <Text style={cardStyles.description} numberOfLines={3}>
                    {local.descripcion}
                </Text>
            )}

            {/* CTA */}
            <TouchableOpacity style={cardStyles.cta} onPress={onVerLocal} activeOpacity={0.82}>
                <Text style={cardStyles.ctaText}>Ver local y reservar</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    mapView: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        backgroundColor: Colors.light.background,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        marginTop: 8,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: Colors.light.primaryLight,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    permissionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
        textAlign: "center",
    },
    permissionSubtitle: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        textAlign: "center",
        lineHeight: 21,
        marginBottom: 8,
    },
    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 12,
        marginTop: 4,
    },
    primaryBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    secondaryBtn: {
        paddingVertical: 10,
    },
    secondaryBtnText: {
        color: Colors.light.primary,
        fontWeight: "600",
        fontSize: 14,
    },
    locateBtn: {
        position: "absolute",
        bottom: 24,
        right: 16,
        zIndex: 10,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    badge: {
        position: "absolute",
        top: 14,
        left: 14,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.text,
    },
    sheetBg: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    sheetHandle: {
        backgroundColor: Colors.light.border,
        width: 36,
    },
    sheetContent: {
        paddingBottom: 24,
    },
})

const cardStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 8,
        gap: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },
    headerLeft: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
        letterSpacing: -0.2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    meta: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
    },
    ratingChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: Colors.light.warningLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.light.warning,
    },
    chipsRow: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.light.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    chipText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.primary,
    },
    description: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
        lineHeight: 19,
    },
    cta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: Colors.light.primary,
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 4,
    },
    ctaText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff",
    },
})
