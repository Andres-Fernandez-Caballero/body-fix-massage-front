
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useState, useMemo, useEffect } from "react"
import { useAnnouncements } from "@/hooks/use-announcements"
import { getClientExplorerStyles } from "@/styles/themedStyles"

const { width } = Dimensions.get("window")

export default function ExplorerScreen() {
    const router = useRouter()
    const { colors, isDark } = useTheme()
    const { announcements, loading, refresh, error } = useAnnouncements()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        refresh()
    }, [])
    
    const dynamicStyles = getClientExplorerStyles(colors, isDark)

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
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.headerTitle}>Explore</Text>
                <Text style={dynamicStyles.headerSubtitle}>Find the perfect massage for you</Text>
            </View>

            <View style={dynamicStyles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.icon} />
                <TextInput
                    style={dynamicStyles.searchInput}
                    placeholder="Search for massage types..."
                    placeholderTextColor={colors.icon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={18} color={colors.icon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categories Filter */}
            <View style={dynamicStyles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dynamicStyles.categoriesContent}>
                    <TouchableOpacity
                        style={[dynamicStyles.categoryChip, !selectedCategory && dynamicStyles.categoryChipActive]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[dynamicStyles.categoryText, !selectedCategory && dynamicStyles.categoryTextActive]}>All</Text>
                    </TouchableOpacity>
                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[dynamicStyles.categoryChip, selectedCategory === cat && dynamicStyles.categoryChipActive]}
                            onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        >
                            <Text style={[dynamicStyles.categoryText, selectedCategory === cat && dynamicStyles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={dynamicStyles.listContainer}
            >
                {announcements.map((announcement) => (
                    <TouchableOpacity key={announcement.id} style={dynamicStyles.card}>
                        <Image source={{ uri: announcement.dicipline.image }} style={dynamicStyles.cardImage} />
                        <View style={dynamicStyles.cardContent}>
                            <View style={dynamicStyles.cardHeader}>
                                <View style={dynamicStyles.titleRow}>
                                    <Text style={dynamicStyles.cardTitle}>{announcement.title}</Text>
                                    {announcement.scoring ? (
                                        <View style={dynamicStyles.ratingBadge}>
                                            <Text style={dynamicStyles.ratingText}>{announcement.therapist.score}</Text>
                                            <Ionicons name="star" size={12} color="#fff" />
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={dynamicStyles.therapistName}>by {announcement.therapist.name}</Text>
                            </View>

                            <Text style={dynamicStyles.cardDescription} numberOfLines={2}>
                                {announcement.content}
                            </Text>

                            <View style={dynamicStyles.cardDivider} />

                            <View style={dynamicStyles.cardFooter}>
                                <View style={dynamicStyles.cardInfoColumn}>
                                    <View style={dynamicStyles.infoRow}>
                                        <Ionicons name="time-outline" size={14} color={colors.icon} />
                                        <Text style={dynamicStyles.cardInfoText}>{announcement.duration} min</Text>
                                    </View>
                                    <View style={dynamicStyles.infoRow}>
                                        <Ionicons name="pricetag-outline" size={14} color={colors.icon} />
                                        <Text style={dynamicStyles.cardInfoText}>${announcement.price}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={dynamicStyles.bookButton}
                                    onPress={() => router.push({
                                        pathname: "/(client)/book/[id]",
                                        params: { id: announcement.id }
                                    })}
                                >
                                    <Text style={dynamicStyles.bookButtonText}>Book</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Loading State */}
                {loading && filteredAnnouncements.length === 0 && (
                    <View style={dynamicStyles.centerState}>
                        <Text style={dynamicStyles.stateText}>Loading services...</Text>
                    </View>
                )}

                {/* Empty state */}
                {!loading && filteredAnnouncements.length === 0 && (
                    <View style={dynamicStyles.centerState}>
                        <Ionicons name="search-outline" size={48} color={colors.icon} />
                        <Text style={dynamicStyles.stateText}>No services found</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}