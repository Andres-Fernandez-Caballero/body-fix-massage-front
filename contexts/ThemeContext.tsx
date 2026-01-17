import React, { createContext, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  colors: typeof Colors.light
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(systemColorScheme === "dark" ? "dark" : "light")

  useEffect(() => {
    // Actualizar el tema cuando el modo del sistema cambie
    if (systemColorScheme === "dark") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [systemColorScheme])

  const colors = theme === "dark" ? Colors.dark : Colors.light
  const isDark = theme === "dark"

  return <ThemeContext.Provider value={{ theme, colors, isDark }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider")
  }
  return context
}
