import { TouchableOpacity } from "react-native"
import { styles } from "./style"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { View, Text } from "react-native"

export function NotificationButton({
    onOpen, unreadCount }: {
        onOpen: () => void,
        unreadCount: number
    }) {

    return (
        <TouchableOpacity
            style={styles.notificationButton}
            onPress={onOpen}
        >
            <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
            {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
}