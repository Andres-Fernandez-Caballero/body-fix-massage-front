import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useState, useMemo, useEffect } from "react"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useTherapistAvailability } from "@/hooks/use-therapist-availability"
import { Slot } from "@/data/api/therapist-availability"
import { Announcement } from "@/contracts/models/announcements.interface"
import { bookingsApi } from "@/data/api/bookings.api"
import { useBookings } from "@/hooks/use-booking"
import AwesomeAlert from 'react-native-awesome-alerts';

const { width } = Dimensions.get("window")


export default function BookServiceScreen() {

    const { id } = useLocalSearchParams()

    const daysAhead = 14;
    const { getAnnouncementById } = useAnnouncements()
    const router = useRouter()

    const [service, setService] = useState<Announcement | null>(null)
    const [loading, setLoading] = useState(true) // Local loading state
    const [selectedIndexDate, setSelectedIndexDate] = useState<number>(0) // Index of selected day
    const [selectedTime, setSelectedTime] = useState<Slot | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchService = async () => {
            if (id) {
                setLoading(true)
                const data = await getAnnouncementById(Number(id))
                if (data) {
                    setService(data)
                }
                setLoading(false)
            }
        }
        fetchService()
    }, [id])



    const { availabilities, dayOfWeek } = useTherapistAvailability(Number(id), daysAhead)
    const { createBooking } = useBookings()

    const handleBook = async () => {



        // Alert.alert("Booking", "Booking confirmed!")
        // if (!selectedTime) {
        //     Alert.alert("Selection Required", "Please select a time slot for your appointment.")
        //     return
        // }

        // setIsSubmitting(true)

        // if (!service) {
        //     Alert.alert("Service not found", "Please try again later.")
        //     return
        // }

        // try {
        //     await createBooking({
        //         announcementId: Number(id),
        //         therapistId: service?.therapist.id,
        //         date: selectedDateObj.date,
        //         startTime: selectedTime.startTime,
        //         endTime: selectedTime.endTime,
        //         notes: ""
        //     })
        // } catch (e) {
        //     Alert.alert("Error", "Failed to create booking.")
        //     setIsSubmitting(false)
        //     return
        // }

        // setIsSubmitting(false)
        // Alert.alert(
        //     "Booking Confirmed!",
        //     "Your appointment has been successfully scheduled.",
        //     [
        //         { text: "OK", onPress: () => router.push("/(client)/bookings") }
        //     ]
        // )
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading service details...</Text>
            </View>
        )
    }

    if (!service) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Service not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const selectedDateObj = availabilities[selectedIndexDate] ?? { date: new Date(), slots: [] }

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Time</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Service Summary Card */}
                <View style={styles.serviceCard}>
                    <Image source={{ uri: service.dicipline.image }} style={styles.serviceImage} />
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text style={styles.therapistName}>with {service.therapist.name}</Text>
                        <View style={styles.serviceMeta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={14} color={Colors.light.icon} />
                                <Text style={styles.metaText}>{service.duration} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="pricetag-outline" size={14} color={Colors.light.icon} />
                                <Text style={styles.metaText}>${service.price}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Calendar Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <Text style={styles.selectedDateText}>{selectedDateObj.date.toDateString()}</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.calendarScroll}
                    >
                        {availabilities.map((day, index) => (
                            <TouchableOpacity
                                key={day.date.toDateString()}
                                style={[
                                    styles.dayCard,
                                    selectedIndexDate === index && styles.dayCardActive
                                ]}
                                onPress={() => {
                                    setSelectedIndexDate(index)
                                    setSelectedTime(null) // Reset time when date changes
                                }}
                            >
                                <Text style={[
                                    styles.dayName,
                                    selectedIndexDate === index && styles.dayNameActive
                                ]}>{dayOfWeek[day.dayOfWeek]}</Text>
                                <Text style={[
                                    styles.dayNumber,
                                    selectedIndexDate === index && styles.dayNumberActive
                                ]}>{day.date.getDate().toString().padStart(2, '0')}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Time Slots Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Available Slots</Text>
                    <View style={styles.timeGrid}>
                        {selectedDateObj.slots.map((time, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === time && styles.timeSlotActive
                                ]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === time && styles.timeTextActive
                                ]}>{time.startTime} a {time.endTime}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Booking Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>${service.price}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        // (!selectedTime || isSubmitting) && styles.confirmButtonDisabled
                    ]}
                    onPress={handleBook}
                // disabled={!selectedTime || isSubmitting}

                >
                    <Text style={styles.confirmButtonText}>
                        {isSubmitting ? "Booking..." : "Confirm Booking"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
