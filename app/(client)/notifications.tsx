import { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useNotifications } from "@/hooks/use-notifications"
import { Notification } from "@/contracts/models/notifications.interface"

// ─── helpers ────────────────────────────────────────────────────────────────

function isoToDateLabel(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (sameDay(date, today)) return "Hoy"
  if (sameDay(date, yesterday)) return "Ayer"
  return date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
}

function groupByDay(notifications: Notification[]) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recent = notifications.filter((n) => new Date(n.createdAt) >= sevenDaysAgo)

  const grouped: Record<string, Notification[]> = {}
  for (const n of recent) {
    const label = isoToDateLabel(n.createdAt)
    if (!grouped[label]) grouped[label] = []
    grouped[label].push(n)
  }

  return Object.entries(grouped).map(([title, data]) => ({ title, data }))
}

// ─── Item ────────────────────────────────────────────────────────────────────

function NotificationItem({ item, onPress }: { item: Notification; onPress: (n: Notification) => void }) {
  const isUnread = !item.readAt
  const hasReview = item.data?.data?.screen === "review"

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, isUnread && styles.iconBoxUnread]}>
        <Ionicons
          name={isUnread ? "notifications" : "notifications-outline"}
          size={20}
          color={isUnread ? "#fff" : Colors.light.icon}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}>{item.data.title}</Text>
        <Text style={styles.itemBody} numberOfLines={3}>{item.data.body}</Text>
        {hasReview && (
          <View style={styles.reviewChip}>
            <Ionicons name="star-outline" size={12} color={Colors.light.primary} />
            <Text style={styles.reviewChipText}>Calificar ahora →</Text>
          </View>
        )}
        <Text style={styles.itemTime}>
          {new Date(item.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter()
  const { notifications, loadNotifications, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    loadNotifications()
  }, [])

  const handlePress = (item: Notification) => {
    markAsRead(item.id)
    const deeplink = item.data?.data
    if (deeplink?.screen === "review" && deeplink?.bookingId) {
      router.push({
        pathname: "/(client)/review/[bookingId]",
        params: { bookingId: deeplink.bookingId },
      })
    }
  }

  const sections = groupByDay(notifications)
  const hasUnread = notifications.some((n) => !n.readAt)

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.navigate("/(client)/profile")}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {hasUnread ? (
          <TouchableOpacity onPress={() => markAllAsRead()} style={styles.readAllButton}>
            <Ionicons name="checkmark-done-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={56} color={Colors.light.border} />
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>
          <Text style={styles.emptySubtitle}>Las notificaciones de los últimos 7 días aparecerán aquí.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} onPress={handlePress} />}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.2,
  },
  readAllButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.icon,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Item
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemUnread: {
    borderColor: Colors.light.primaryLight,
    backgroundColor: "#FFF8F5",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  iconBoxUnread: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 3,
  },
  itemTitleUnread: {
    color: Colors.light.text,
    fontWeight: "700",
  },
  itemBody: {
    fontSize: 13,
    color: Colors.light.icon,
    lineHeight: 19,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 11,
    color: Colors.light.icon,
    marginTop: 4,
  },
  reviewChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    marginBottom: 2,
  },
  reviewChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginTop: 4,
    flexShrink: 0,
  },

  // Empty
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 20,
  },
})
