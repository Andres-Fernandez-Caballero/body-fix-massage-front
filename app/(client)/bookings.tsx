"use client"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Colors } from "@/constants/Colors"
import BookingCard from "@/components/BookingCard"

const BOOKINGS = [
  {
    id: "1",
    therapistName: "Sarah Johnson",
    massageType: "Swedish Massage",
    date: "Jan 15, 2026",
    time: "2:00 PM",
    status: "upcoming" as const,
    address: "123 Main St, Apt 4B",
  },
  {
    id: "2",
    therapistName: "Michael Chen",
    massageType: "Deep Tissue",
    date: "Jan 10, 2026",
    time: "4:30 PM",
    status: "completed" as const,
    address: "123 Main St, Apt 4B",
  },
  {
    id: "3",
    therapistName: "Emily Williams",
    massageType: "Sports Massage",
    date: "Jan 5, 2026",
    time: "10:00 AM",
    status: "completed" as const,
    address: "123 Main St, Apt 4B",
    rating: 5,
  },
  {
    id: "4",
    therapistName: "David Martinez",
    massageType: "Prenatal Massage",
    date: "Dec 28, 2025",
    time: "3:00 PM",
    status: "cancelled" as const,
    address: "123 Main St, Apt 4B",
  },
]

export default function BookingsScreen() {
  const upcomingBookings = BOOKINGS.filter((b) => b.status === "upcoming")
  const pastBookings = BOOKINGS.filter((b) => b.status !== "upcoming")

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {upcomingBookings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={() => console.log("View details:", booking.id)}
                onReschedule={() => console.log("Reschedule:", booking.id)}
              />
            ))}
          </>
        )}

        {pastBookings.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, upcomingBookings.length > 0 && { marginTop: 24 }]}>Session History</Text>
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onReview={() => console.log("Review:", booking.id)} />
            ))}
          </>
        )}

        {BOOKINGS.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No bookings yet</Text>
            <Text style={styles.emptyStateText}>Book your first massage session to get started</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
})
