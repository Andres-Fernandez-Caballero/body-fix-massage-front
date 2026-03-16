import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: Colors.light.background,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    errorText: {
        fontSize: 18,
        color: Colors.light.text,
    },
    backLink: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    scrollContent: {
        paddingBottom: 120, // space for bottom bar
    },
    serviceCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 24,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.light.border,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    serviceImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: Colors.light.card,
    },
    serviceInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "center",
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 4,
    },
    therapistName: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: "500",
        marginBottom: 8,
    },
    serviceMeta: {
        flexDirection: "row",
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: "500",
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    selectedDateText: {
        fontSize: 14,
        color: Colors.light.icon,
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    calendarScroll: {
        paddingHorizontal: 24,
        gap: 12,
    },
    dayCard: {
        width: 60,
        height: 80,
        borderRadius: 16,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Colors.light.border,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    dayCardActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    dayName: {
        fontSize: 12,
        color: Colors.light.icon,
        fontWeight: "500",
    },
    dayNameActive: {
        color: "rgba(255,255,255,0.8)",
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    dayNumberActive: {
        color: "#fff",
    },
    timeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 24,
        gap: 10,
    },
    timeSlot: {
        flexBasis: "30%",
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Colors.light.border,
        alignItems: "center",
    },
    timeSlotActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    timeText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.light.text,
    },
    timeTextActive: {
        color: "#fff",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    priceContainer: {
        gap: 4,
    },
    totalLabel: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    confirmButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    confirmButtonDisabled: {
        opacity: 0.5,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})
