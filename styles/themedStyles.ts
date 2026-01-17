import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

type ColorsType = typeof import("@/constants/Colors").Colors.light

/**
 * Centralized themed styles for all screens and components
 * Import this file and use the specific style functions as needed
 */

// ============ WELCOME SCREEN (index.tsx) ============
export const getWelcomeStyles = (colors: ColorsType, isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    logo: {
      fontSize: 48,
      fontWeight: "bold",
      color: "#fff",
      letterSpacing: 1,
    },
    tagline: {
      fontSize: 16,
      color: "#E0E7FF",
      marginTop: 8,
      fontWeight: "500",
    },
    illustration: {
      width: width * 0.7,
      height: height * 0.25,
      marginVertical: 20,
    },
    buttonContainer: {
      width: "100%",
      gap: 16,
    },
    primaryButton: {
      backgroundColor: "#fff",
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "700",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "#fff",
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    featuresContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      gap: 12,
      marginTop: 20,
    },
    feature: {
      flex: 1,
      alignItems: "center",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.15)",
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    featureIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    featureText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
    },
  })
}

// ============ CLIENT HOME SCREEN ============
export const getClientHomeStyles = (colors: ColorsType, isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: colors.icon,
      marginTop: 4,
    },
    notificationButton: {
      padding: 8,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 24,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    searchText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.icon,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginHorizontal: 24,
      marginBottom: 16,
    },
    cardsContainer: {
      paddingLeft: 24,
    },
    card: {
      width: width * 0.7,
      backgroundColor: colors.card,
      borderRadius: 16,
      marginRight: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
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
      color: colors.icon,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardPrice: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
    },
    bookButton: {
      backgroundColor: colors.primary,
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
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    featureIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : "#EEF2FF",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 12,
      color: colors.icon,
      textAlign: "center",
    },
  })
}

// ============ CLIENT BOOKINGS SCREEN ============
export const getClientBookingsStyles = (colors: ColorsType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
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
      color: colors.text,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.icon,
    },
  })
}

// ============ CLIENT PROFILE SCREEN ============
export const getClientProfileStyles = (colors: ColorsType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginHorizontal: 24,
      marginBottom: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      backgroundColor: colors.card,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.icon,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 24,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.error,
      marginBottom: 24,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.error,
    },
    version: {
      textAlign: "center",
      fontSize: 12,
      color: colors.icon,
      marginBottom: 40,
    },
  })
}

// ============ CLIENT EXPLORER SCREEN ============
export const getClientExplorerStyles = (colors: ColorsType, isDark: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.icon,
      marginTop: 4,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
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
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    categoryTextActive: {
      color: "#fff",
    },
    listContainer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: 160,
      backgroundColor: colors.card,
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
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning,
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
      color: colors.primary,
      fontWeight: '500'
    },
    cardDescription: {
      fontSize: 14,
      color: colors.icon,
      lineHeight: 20,
      marginBottom: 12,
    },
    cardDivider: {
      height: 1,
      backgroundColor: colors.border,
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
      color: colors.text,
      fontWeight: '500',
    },
    bookButton: {
      backgroundColor: colors.primary,
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
      color: colors.text,
      marginTop: 12,
      fontSize: 16,
    }
  })
}

// ============ AUTH LOGIN SCREENS (Client & Therapist) ============
export const getAuthLoginStyles = (colors: ColorsType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },
    backButton: {
      marginTop: 60,
      marginBottom: 20,
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.icon,
    },
    form: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 24,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 18,
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "700",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 32,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      color: colors.icon,
      fontSize: 14,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    footerText: {
      color: colors.icon,
      fontSize: 14,
    },
    footerLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
  })
}

// ============ THERAPIST SESSIONS SCREEN ============
export const getTherapistSessionsStyles = (colors: ColorsType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    subtitle: {
      fontSize: 16,
      color: colors.icon,
    },
  })
}

// ============ THERAPIST PROFILE SCREEN ============
export const getTherapistProfileStyles = (colors: ColorsType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginHorizontal: 24,
      marginBottom: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      backgroundColor: colors.card,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.icon,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 24,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.error,
      marginBottom: 24,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.error,
    },
    version: {
      textAlign: "center",
      fontSize: 12,
      color: colors.icon,
      marginBottom: 40,
    },
  })
}

// ============ BOOKING CARD COMPONENT ============
export const getBookingCardStyles = (colors: ColorsType, isDark: boolean) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    therapistName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    massageType: {
      fontSize: 14,
      color: colors.icon,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    upcomingBadge: {
      backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : "#EEF2FF",
    },
    completedBadge: {
      backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5",
    },
    cancelledBadge: {
      backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
    },
    details: {
      gap: 8,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    detailText: {
      fontSize: 14,
      color: colors.icon,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
    reviewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    reviewButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
  })
}
