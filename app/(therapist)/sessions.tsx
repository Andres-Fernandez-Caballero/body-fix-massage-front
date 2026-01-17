import { View, Text } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"
import { getTherapistSessionsStyles } from "@/styles/themedStyles"

export default function TherapistSessionsScreen() {
  const { colors } = useTheme()
  const dynamicStyles = getTherapistSessionsStyles(colors)

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>Sessions</Text>
      </View>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.subtitle}>Session management coming soon...</Text>
      </View>
    </View>
  )
}
