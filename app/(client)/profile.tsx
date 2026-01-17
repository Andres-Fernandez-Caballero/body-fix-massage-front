"use client"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useAuth } from "@/hooks/use-auth"
import { getClientProfileStyles } from "@/styles/themedStyles"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { colors } = useTheme()
  
  const dynamicStyles = getClientProfileStyles(colors)

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <ScrollView style={dynamicStyles.container} showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>Profile</Text>
      </View>

      <View style={dynamicStyles.profileSection}>
        <Image source={{ uri: "/user-profile-avatar.png" }} style={dynamicStyles.avatar} />
        <Text style={dynamicStyles.name}>{user?.name}</Text>
        <Text style={dynamicStyles.email}>{user?.email}</Text>
      </View>

      <View style={dynamicStyles.section}>
        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="person-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="location-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Saved Addresses</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="card-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Payment Methods</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.section}>
        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuItemLeft}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.icon} />
            <Text style={dynamicStyles.menuItemText}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={dynamicStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={dynamicStyles.version}>Version 1.0.0</Text>
    </ScrollView>
  )
}
