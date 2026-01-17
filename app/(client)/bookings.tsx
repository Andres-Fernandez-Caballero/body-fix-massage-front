"use client"
import { View, Text, ScrollView } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"
import BookingCard from "@/components/BookingCard"
import { getClientBookingsStyles } from "@/styles/themedStyles"

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
  const { colors } = useTheme()
  const upcomingBookings = BOOKINGS.filter((b) => b.status === "upcoming")
  const pastBookings = BOOKINGS.filter((b) => b.status !== "upcoming")
  
  const dynamicStyles = getClientBookingsStyles(colors)

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>My Bookings</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {upcomingBookings.length > 0 && (
          <>
            <Text style={dynamicStyles.sectionTitle}>Upcoming Sessions</Text>
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
            <Text style={[dynamicStyles.sectionTitle, upcomingBookings.length > 0 && { marginTop: 24 }]}>Session History</Text>
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onReview={() => console.log("Review:", booking.id)} />
            ))}
          </>
        )}

        {BOOKINGS.length === 0 && (
          <View style={dynamicStyles.emptyState}>
            <Text style={dynamicStyles.emptyStateTitle}>No bookings yet</Text>
            <Text style={dynamicStyles.emptyStateText}>Book your first massage session to get started</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
