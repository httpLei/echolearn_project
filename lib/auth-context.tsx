"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Simple user type
type User = {
  id: string
  email: string
  username: string
  role: "student" | "teacher"
  firstName?: string
  lastName?: string
}

// Auth context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string, role: "student" | "teacher") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simple login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // For now, we'll use a simple mock login
      // In production, this would call your Java backend
      const mockUser: User = {
        id: "1",
        email: email,
        username: email.split("@")[0],
        role: "student",
        firstName: "John",
        lastName: "Doe",
      }

      setUser(mockUser)
      // Save to localStorage so user stays logged in
      localStorage.setItem("echolearn_user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Simple signup function
  const signup = async (email: string, username: string, password: string, role: "student" | "teacher") => {
    setIsLoading(true)
    try {
      // For now, we'll use a simple mock signup
      // In production, this would call your Java backend
      const mockUser: User = {
        id: "1",
        email: email,
        username: username,
        role: role,
        firstName: username,
        lastName: "User",
      }

      setUser(mockUser)
      // Save to localStorage
      localStorage.setItem("echolearn_user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Simple logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("echolearn_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Hook to use auth in components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
