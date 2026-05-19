import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export const { width } = Dimensions.get('window');
export const SIDEBAR_WIDTH = width * 0.85;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    
    overlay: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    notificationButton: {
        padding: 8,
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH, // We'll translate it.
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
        zIndex: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    itemCallback: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        // Soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadItem: {
        backgroundColor: '#FFF8E1', // Light warm tint to match primary orange
        borderColor: Colors.light.primary,
        shadowColor: Colors.light.primary,
        shadowOpacity: 0.1,
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.card,
    },
    unreadIconContainer: {
        backgroundColor: Colors.light.primary,
    },
    markReadButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        alignSelf: 'center',
        // Shadow for the button to make it pop slightly
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,157,12,0.1)',
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    unreadTitle: {
        color: Colors.light.primary,
        fontWeight: '700',
    },
    itemBody: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    itemTime: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.primary,
        position: 'absolute',
        top: 16,
        right: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.text,
    },
    notificationBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "#FF3B30",
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
        zIndex: 10,
        paddingHorizontal: 2,
    },
    notificationBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
})