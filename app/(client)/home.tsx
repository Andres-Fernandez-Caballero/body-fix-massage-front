"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const MASSAGE_TYPES = [
  {
    id: "1",
    name: "Swedish Massage",
    duration: "60 min",
    price: "$80",
    image: "/swedish-massage-relaxation.jpg",
  },
  {
    id: "2",
    name: "Deep Tissue",
    duration: "90 min",
    price: "$110",
    image: "/deep-tissue-massage.png",
  },
  {
    id: "3",
    name: "Sports Massage",
    duration: "60 min",
    price: "$95",
    image: "/sports-massage-athletic.jpg",
  },
  {
    id: "4",
    name: "Prenatal Massage",
    duration: "60 min",
    price: "$85",
    image: "/prenatal-pregnancy-massage.jpg",
  },
]

export default function ClientHomeScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Maria</Text>
          <Text style={styles.subtitle}>How can we help you relax today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.light.icon} />
        <Text style={styles.searchText}>Search for massage types...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
          {MASSAGE_TYPES.map((massage) => (
            <TouchableOpacity key={massage.id} style={styles.card}>
              <Image source={{ uri: massage.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{massage.name}</Text>
                <View style={styles.cardInfo}>
                  <Ionicons name="time-outline" size={14} color={Colors.light.icon} />
                  <Text style={styles.cardInfoText}>{massage.duration}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>{massage.price}</Text>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose BodyFix?</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={28} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureTitle}>Certified</Text>
            <Text style={styles.featureDescription}>All therapists are certified professionals</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="home" size={28} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureTitle}>At Home</Text>
            <Text style={styles.featureDescription}>Enjoy comfort in your own space</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="star" size={28} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureTitle}>Top Rated</Text>
            <Text style={styles.featureDescription}>4.9 average customer rating</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="calendar" size={28} color={Colors.light.primary} />
            </View>
            <Text style={styles.featureTitle}>Flexible</Text>
            <Text style={styles.featureDescription}>Book anytime that suits you</Text>
          </View>
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.icon,
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
  cardsContainer: {
    paddingLeft: 24,
  },
  card: {
    width: width * 0.7,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.light.icon,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  bookButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
  },
})
