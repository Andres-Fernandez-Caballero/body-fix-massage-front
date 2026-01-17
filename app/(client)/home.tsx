"use client"
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { annuncementsApi } from "@/data/api/annuncements"
import { Announcement } from "@/contracts/models/announcements.interface"
import { useAnnouncements } from "@/hooks/use-announcements"
import { getClientHomeStyles } from "@/styles/themedStyles"

const { width } = Dimensions.get("window")



export default function ClientHomeScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { colors, isDark } = useTheme()
  const {destacates, loading, error, refresh} = useAnnouncements()

  useEffect(() => {
    refresh()
  }, [])
  
  const dynamicStyles = getClientHomeStyles(colors, isDark)

  return (
    <ScrollView style={dynamicStyles.container} showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.header}>
        <View>
          <Text style={dynamicStyles.greeting}>Hello, {user?.name}</Text>
          <Text style={dynamicStyles.subtitle}>How can we help you relax today?</Text>
        </View>
        <TouchableOpacity style={dynamicStyles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.icon} />
        <Text style={dynamicStyles.searchText}>Search for massage types...</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Popular Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dynamicStyles.cardsContainer}>
          {destacates.map((annuncement) => (
            <TouchableOpacity key={annuncement.id} style={dynamicStyles.card}>
              <Image source={{ uri: annuncement.dicipline.image }} style={dynamicStyles.cardImage} />
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.cardTitle}>{annuncement.title}</Text>
                <View style={dynamicStyles.cardInfo}>
                  <Ionicons name="time-outline" size={14} color={colors.icon} />
                  <Text style={dynamicStyles.cardInfoText}>{annuncement.duration} min</Text>
                </View>
                <View style={dynamicStyles.cardFooter}>
                  <Text style={dynamicStyles.cardPrice}>{annuncement.price}</Text>
                  <TouchableOpacity style={dynamicStyles.bookButton}>
                    <Text style={dynamicStyles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Why Choose BodyFix?</Text>
        <View style={dynamicStyles.featuresGrid}>
          <View style={dynamicStyles.featureCard}>
            <View style={dynamicStyles.featureIcon}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.featureTitle}>Certified</Text>
            <Text style={dynamicStyles.featureDescription}>All therapists are certified professionals</Text>
          </View>
          <View style={dynamicStyles.featureCard}>
            <View style={dynamicStyles.featureIcon}>
              <Ionicons name="home" size={28} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.featureTitle}>At Home</Text>
            <Text style={dynamicStyles.featureDescription}>Enjoy comfort in your own space</Text>
          </View>
          <View style={dynamicStyles.featureCard}>
            <View style={dynamicStyles.featureIcon}>
              <Ionicons name="star" size={28} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.featureTitle}>Top Rated</Text>
            <Text style={dynamicStyles.featureDescription}>4.9 average customer rating</Text>
          </View>
          <View style={dynamicStyles.featureCard}>
            <View style={dynamicStyles.featureIcon}>
              <Ionicons name="calendar" size={28} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.featureTitle}>Flexible</Text>
            <Text style={dynamicStyles.featureDescription}>Book anytime that suits you</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
