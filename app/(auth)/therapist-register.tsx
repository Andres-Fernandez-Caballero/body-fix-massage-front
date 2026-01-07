"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"

export default function TherapistRegisterScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Personal Information
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Professional Information
  const [licenseNumber, setLicenseNumber] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [bio, setBio] = useState("")
  const [certificate, setCertificate] = useState<any>(null)

  const SPECIALTY_OPTIONS = [
    "Swedish Massage",
    "Deep Tissue",
    "Sports Massage",
    "Prenatal Massage",
    "Hot Stone",
    "Thai Massage",
  ]

  const toggleSpecialty = (specialty: string) => {
    setSpecialties((prev) => (prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]))
  }

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCertificate(result.assets[0])
        Alert.alert("Success", "Certificate uploaded successfully")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document")
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email || !phone || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields")
        return
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match")
        return
      }
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!licenseNumber || !yearsExperience || specialties.length === 0 || !certificate) {
      Alert.alert("Error", "Please complete all required fields and upload your certificate")
      return
    }

    // TODO: Implement API call
    console.log("Therapist Registration:", {
      name,
      email,
      phone,
      password,
      licenseNumber,
      yearsExperience,
      specialties,
      bio,
      certificate,
    })

    Alert.alert(
      "Application Submitted",
      "Your application has been submitted for review. We'll notify you once it's approved.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => (step === 1 ? router.back() : setStep(1))}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join BodyFix</Text>
          <Text style={styles.subtitle}>Become a professional therapist partner</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
              <Text style={[styles.progressNumber, step >= 1 && styles.progressNumberActive]}>1</Text>
            </View>
            <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
              <Text style={[styles.progressNumber, step >= 2 && styles.progressNumberActive]}>2</Text>
            </View>
          </View>
        </View>

        {step === 1 ? (
          <View style={styles.form}>
            <Text style={styles.stepTitle}>Personal Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.light.icon}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.light.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.light.icon}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor={Colors.light.icon}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={Colors.light.icon} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.light.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.stepTitle}>Professional Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>License Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your license number"
                placeholderTextColor={Colors.light.icon}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Years of Experience *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter years of experience"
                placeholderTextColor={Colors.light.icon}
                value={yearsExperience}
                onChangeText={setYearsExperience}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialties * (Select at least one)</Text>
              <View style={styles.specialtiesContainer}>
                {SPECIALTY_OPTIONS.map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    style={[styles.specialtyChip, specialties.includes(specialty) && styles.specialtyChipActive]}
                    onPress={() => toggleSpecialty(specialty)}
                  >
                    <Text style={[styles.specialtyText, specialties.includes(specialty) && styles.specialtyTextActive]}>
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Professional Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself and your experience"
                placeholderTextColor={Colors.light.icon}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Professional Certificate *</Text>
              <Text style={styles.helperText}>Upload your massage therapist certification (PDF or Image)</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.uploadButtonText}>{certificate ? certificate.name : "Choose File"}</Text>
              </TouchableOpacity>
              {certificate && (
                <View style={styles.fileInfo}>
                  <Ionicons name="document-text" size={20} color={Colors.light.success} />
                  <Text style={styles.fileName}>{certificate.name}</Text>
                  <TouchableOpacity onPress={() => setCertificate(null)}>
                    <Ionicons name="close-circle" size={20} color={Colors.light.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              By submitting this application, you agree to our Terms of Service and Privacy Policy. Your application
              will be reviewed within 2-3 business days.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/therapist-login")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.icon,
  },
  progressNumberActive: {
    color: "#fff",
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: Colors.light.primary,
  },
  form: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 100,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  specialtyChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  specialtyTextActive: {
    color: "#fff",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.primary,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.success,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.light.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})
