"use client"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Colors } from "@/constants/Colors"
import BookingCard from "@/components/BookingCard"


import { useEffect } from "react"
import { useBookings } from "@/hooks/use-bookings"
import { ActivityIndicator } from "react-native"

export default function BookingsScreen() {
  const { bookings, loading, fetchBookings } = useBookings()

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const mappedBookings = bookings.map((b) => ({
    id: b.id,
    therapistName: `Therapist #${b.therapistId}`, // TODO: API should return therapist name
    massageType: `Service #${b.announcementId}`, // TODO: API should return announcement title
    date: b.date,
    time: `${b.startTime} - ${b.endTime}`,
    status: b.state.name as "upcoming" | "completed" | "cancelled",
    address: "Location details", // TODO: API should return address
  }))

  const upcomingBookings = mappedBookings.filter((b) => b.status === "upcoming")
  const pastBookings = mappedBookings.filter((b) => b.status !== "upcoming")

  if (loading && bookings.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    )
  }

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

        {bookings.length === 0 && !loading && (
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
})
