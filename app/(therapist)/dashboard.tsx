"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

export default function TherapistDashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, Sarah</Text>
          <Text style={styles.subtitle}>Here's your activity today</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
            <Ionicons name="calendar" size={24} color={Colors.light.primary} />
          </View>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Today's Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="cash" size={24} color={Colors.light.success} />
          </View>
          <Text style={styles.statValue}>$240</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="star" size={24} color={Colors.light.warning} />
          </View>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Your Rating</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View>
              <Text style={styles.clientName}>Maria Rodriguez</Text>
              <Text style={styles.sessionType}>Swedish Massage - 60 min</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>2:00 PM</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>123 Main St, Apt 4B</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="navigate-outline" size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>2.3 km away</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View>
              <Text style={styles.clientName}>John Smith</Text>
              <Text style={styles.sessionType}>Deep Tissue - 90 min</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>4:30 PM</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>456 Oak Ave, Suite 12</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="navigate-outline" size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>5.7 km away</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="calendar-outline" size={28} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>My Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="time-outline" size={28} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="settings-outline" size={28} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="help-circle-outline" size={28} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.error,
    borderWidth: 2,
    borderColor: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  timeContainer: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  sessionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
    marginTop: 12,
    textAlign: "center",
  },
})
