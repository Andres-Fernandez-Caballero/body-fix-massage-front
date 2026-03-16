import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions, StatusBar } from "react-native"
import { styles } from './details-style'
import { useLocalSearchParams, useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useBookings } from "@/hooks/use-bookings"
import { useAvailability } from "@/hooks/use-availability"

const { width } = Dimensions.get("window")

const AvailabilitySelector = () => (
    <View>
        <Text>Availability Selector</Text>
    </View>
)

export default function BookServiceScreen() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const { fetchAnnouncementById, currentAnnouncement, loading } = useAnnouncements()
    const { fetchAvailability, availabilities, loading: availabilityLoading, selectAvailability, currentAvailability } = useAvailability()
    const { createBooking, isCreating } = useBookings()

    const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0) // Index of selected day
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    useEffect(() => {
        fetchAnnouncementById(Number(id));
    }, [id])

    useEffect(() => {
        if (currentAnnouncement) {
            fetchAvailability(currentAnnouncement.id);
        }
    }, [currentAnnouncement])

    useEffect(() => {
        if (availabilities && availabilities.length > 0) {
            selectAvailability(availabilities[0]);
        }
    }, [availabilities])

    const handleBook = async () => {
        if (!selectedTime || !currentAnnouncement) {
            Alert.alert("Selection Required", "Please select a time slot for your appointment.")
            return
        }

        // Calculate end time
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTimeDate = new Date();
        startTimeDate.setHours(hours, minutes, 0);
        const endTimeDate = new Date(startTimeDate.getTime() + currentAnnouncement.duration * 60000);
        const endTime = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;

        try {
            await createBooking({
                therapistId: currentAnnouncement.therapist.id.toString(),
                announcementId: currentAnnouncement.id.toString(),
                date: currentAvailability?.date.toISOString().split('T')[0] || '',
                startTime: selectedTime,
                endTime,
                notes: ''
            });

            router.push("/(client)/bookings");

        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || err.message || "Could not complete the booking. Please try again.");
        }
    }

    if (loading && !currentAnnouncement) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading service details...</Text>
            </View>
        )
    }

    if (!currentAnnouncement) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Service not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const selectedDateObj = new Date()
    const formattedDate = selectedDateObj.toLocaleDateString('es-AR', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    })

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
                    <Image source={{ uri: currentAnnouncement.dicipline.image }} style={styles.serviceImage} />
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceTitle}>{currentAnnouncement.title}</Text>
                        <Text style={styles.therapistName}>with {currentAnnouncement.therapist.name}</Text>
                        <View style={styles.serviceMeta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={14} color={Colors.light.icon} />
                                <Text style={styles.metaText}>{currentAnnouncement.duration} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="pricetag-outline" size={14} color={Colors.light.icon} />
                                <Text style={styles.metaText}>${currentAnnouncement.price}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Calendar Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Seleccione una fecha</Text>
                    <Text style={styles.selectedDateText}>{formattedDate}</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.calendarScroll}
                    >
                        {availabilities.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCard,
                                    selectedDateIndex === index && styles.dayCardActive
                                ]}
                                onPress={() => {
                                    setSelectedDateIndex(index)
                                    setSelectedTime(null) // Reset time when date changes
                                }}
                            >
                                <Text style={[
                                    styles.dayName,
                                    selectedDateIndex === day.id && styles.dayNameActive
                                ]}>{new Intl.DateTimeFormat('es-AR', { weekday: 'long' }).format(day.date)}</Text>
                                <Text style={[
                                    styles.dayNumber,
                                    selectedDateIndex === day.id && styles.dayNumberActive
                                ]}>{ new Intl.DateTimeFormat('es-AR', { day: 'numeric' }).format(day.date)}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Time Slots Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Available Slots</Text>
                    <View style={styles.timeGrid}>
                        {currentAvailability?.slots.map((time, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.timeSlot,
                                    selectedTime === time.startTime && styles.timeSlotActive
                                ]}
                                onPress={() => setSelectedTime(time.startTime)}
                            >
                                <Text style={[
                                    styles.timeText,
                                    selectedTime === time.startTime && styles.timeTextActive
                                ]}>{time.startTime}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Booking Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>${currentAnnouncement.price}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        (!selectedTime || isCreating) && styles.confirmButtonDisabled
                    ]}
                    onPress={handleBook}
                    disabled={!selectedTime || isCreating}
                >
                    <Text style={styles.confirmButtonText}>
                        {isCreating ? "Booking..." : "Confirm Booking"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

