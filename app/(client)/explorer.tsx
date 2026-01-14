
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useState, useMemo, useEffect } from "react"
import { useAnnouncements } from "@/hooks/use-announcements"

const { width } = Dimensions.get("window")

export default function ExplorerScreen() {
    const router = useRouter()
    const { announcements, loading, refresh, error } = useAnnouncements()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)


    useEffect(() => {
        refresh()
    }, [])

    // Extract unique categories from announcements
    const categories = useMemo(() => {
        const allCategories = announcements.map(a => a.dicipline.name)
        return Array.from(new Set(allCategories))
    }, [announcements])

    const filteredAnnouncements = announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.dicipline.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory ? item.dicipline.name === selectedCategory : true

        return matchesSearch && matchesCategory
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <Text style={styles.headerSubtitle}>Find the perfect massage for you</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.light.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for massage types..."
                    placeholderTextColor={Colors.light.icon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={18} color={Colors.light.icon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categories Filter */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                    <TouchableOpacity
                        style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>All</Text>
                    </TouchableOpacity>
                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                            onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {announcements.map((announcement) => (
                    <TouchableOpacity key={announcement.id} style={styles.card}>
                        <Image source={{ uri: announcement.dicipline.image }} style={styles.cardImage} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.cardTitle}>{announcement.title}</Text>
                                    {announcement.scoring ? (
                                        <View style={styles.ratingBadge}>
                                            <Text style={styles.ratingText}>{announcement.therapist.score}</Text>
                                            <Ionicons name="star" size={12} color="#fff" />
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={styles.therapistName}>by {announcement.therapist.name}</Text>
                            </View>

                            <Text style={styles.cardDescription} numberOfLines={2}>
                                {announcement.content}
                            </Text>

                            <View style={styles.cardDivider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.cardInfoColumn}>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="time-outline" size={14} color={Colors.light.icon} />
                                        <Text style={styles.cardInfoText}>{announcement.duration} min</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="pricetag-outline" size={14} color={Colors.light.icon} />
                                        <Text style={styles.cardInfoText}>${announcement.price}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.bookButton}
                                    onPress={() => router.push({
                                        pathname: "/(client)/book/[id]",
                                        params: { id: announcement.id }
                                    })}
                                >
                                    <Text style={styles.bookButtonText}>Book</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Loading State */}
                {loading && filteredAnnouncements.length === 0 && (
                    <View style={styles.centerState}>
                        <Text style={styles.stateText}>Loading services...</Text>
                    </View>
                )}

                {/* Empty state */}
                {!loading && filteredAnnouncements.length === 0 && (
                    <View style={styles.centerState}>
                        <Ionicons name="search-outline" size={48} color={Colors.light.icon} />
                        <Text style={styles.stateText}>No services found</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.card,
        marginHorizontal: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: Colors.light.text,
    },
    categoriesContainer: {
        marginBottom: 20,
    },
    categoriesContent: {
        paddingHorizontal: 24,
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    categoryChipActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.light.text,
    },
    categoryTextActive: {
        color: "#fff",
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.light.border,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 160,
        backgroundColor: Colors.light.card,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.warning,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#fff",
    },
    therapistName: {
        fontSize: 13,
        color: Colors.light.primary,
        fontWeight: '500'
    },
    cardDescription: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
        marginBottom: 12,
    },
    cardDivider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginBottom: 12,
        opacity: 0.5
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardInfoColumn: {
        flexDirection: 'row',
        gap: 16
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    cardInfoText: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
    },
    bookButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    centerState: {
        alignItems: 'center',
        marginTop: 40,
        opacity: 0.6
    },
    stateText: {
        color: Colors.light.text,
        marginTop: 12,
        fontSize: 16,
    }
})