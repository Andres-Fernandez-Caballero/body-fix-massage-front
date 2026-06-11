"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { NotificationSidebar } from "@/components/LayoutWithNotifications/NotificationSidebar"
import { NotificationButton } from "@/components/LayoutWithNotifications/NotificationButton"
import { useNotificationState } from "@/components/LayoutWithNotifications/use-notification-state"

export default function TherapistDashboardScreen() {
  const { showNotifications, onOpen, onClose, unreadCount } = useNotificationState()
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, Sarah</Text>
          <Text style={styles.subtitle}>Here's your activity today</Text>
        </View>
        <NotificationButton
          onOpen={onOpen}
          unreadCount={unreadCount}
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.light.primaryLight }]}>
            <Ionicons name="calendar" size={22} color={Colors.light.primary} />
          </View>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Sessions Today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.light.successLight }]}>
            <Ionicons name="cash" size={22} color={Colors.light.success} />
          </View>
          <Text style={styles.statValue}>$240</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.light.warningLight }]}>
            <Ionicons name="star" size={22} color={Colors.light.warning} />
          </View>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Your Rating</Text>
        </View>
      </View>

      {/* Upcoming sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>

        <View style={styles.sessionCard}>
          <View style={styles.sessionTimeStrip}>
            <Text style={styles.sessionTimeText}>2:00 PM</Text>
          </View>
          <View style={styles.sessionBody}>
            <View style={styles.sessionHeader}>
              <Text style={styles.clientName}>Maria Rodriguez</Text>
              <View style={styles.sessionTypeBadge}>
                <Text style={styles.sessionTypeBadgeText}>60 min</Text>
              </View>
            </View>
            <Text style={styles.sessionType}>Swedish Massage</Text>
            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.icon} />
                <Text style={styles.detailText}>123 Main St, Apt 4B</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="navigate-outline" size={14} color={Colors.light.icon} />
                <Text style={styles.detailText}>2.3 km away</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sessionCard}>
          <View style={styles.sessionTimeStrip}>
            <Text style={styles.sessionTimeText}>4:30 PM</Text>
          </View>
          <View style={styles.sessionBody}>
            <View style={styles.sessionHeader}>
              <Text style={styles.clientName}>John Smith</Text>
              <View style={styles.sessionTypeBadge}>
                <Text style={styles.sessionTypeBadgeText}>90 min</Text>
              </View>
            </View>
            <Text style={styles.sessionType}>Deep Tissue</Text>
            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.icon} />
                <Text style={styles.detailText}>456 Oak Ave, Suite 12</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="navigate-outline" size={14} color={Colors.light.icon} />
                <Text style={styles.detailText}>5.7 km away</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.light.primaryLight }]}>
              <Ionicons name="calendar-outline" size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>My Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.light.successLight }]}>
              <Ionicons name="time-outline" size={24} color={Colors.light.success} />
            </View>
            <Text style={styles.quickActionText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.light.primaryLight }]}>
              <Ionicons name="settings-outline" size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: "#E8F0ED" }]}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.light.secondary} />
            </View>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NotificationSidebar
        showNotifications={showNotifications}
        onClose={onClose}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 4,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#8C5240",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.icon,
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.light.text,
    marginHorizontal: 24,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  sessionCard: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#8C5240",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionTimeStrip: {
    width: 56,
    backgroundColor: Colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  sessionTimeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    transform: [{ rotate: "-90deg" }],
    width: 60,
  },
  sessionBody: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 14,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.1,
  },
  sessionTypeBadge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sessionTypeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  sessionType: {
    fontSize: 13,
    color: Colors.light.icon,
    marginBottom: 10,
  },
  sessionDetails: {
    gap: 5,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  actionButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
    letterSpacing: -0.1,
  },
})
