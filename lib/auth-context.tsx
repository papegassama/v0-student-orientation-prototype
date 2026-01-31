"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  fullName: string
  email: string
}

type StoredUser = User & {
  password: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  signup: (fullName: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = localStorage.getItem("monorienta_session")
    if (storedSession) {
      try {
        const sessionUser = JSON.parse(storedSession) as User
        setUser(sessionUser)
      } catch {
        localStorage.removeItem("monorienta_session")
      }
    }
    setIsLoading(false)
  }, [])

  const getStoredUsers = (): StoredUser[] => {
    const stored = localStorage.getItem("monorienta_users")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  }

  const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem("monorienta_users", JSON.stringify(users))
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const signup = (fullName: string, email: string, password: string): { success: boolean; error?: string } => {
    // Validation
    if (!fullName.trim()) {
      return { success: false, error: "Le nom complet est requis" }
    }
    if (!isValidEmail(email)) {
      return { success: false, error: "Format d'email invalide" }
    }
    if (password.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" }
    }

    const users = getStoredUsers()
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    // Create new user
    const newUser: StoredUser = {
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password,
    }

    users.push(newUser)
    saveStoredUsers(users)

    // Auto login after signup
    const sessionUser: User = { fullName: newUser.fullName, email: newUser.email }
    setUser(sessionUser)
    localStorage.setItem("monorienta_session", JSON.stringify(sessionUser))

    return { success: true }
  }

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" }
    }

    const users = getStoredUsers()
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!foundUser) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    const sessionUser: User = { fullName: foundUser.fullName, email: foundUser.email }
    setUser(sessionUser)
    localStorage.setItem("monorienta_session", JSON.stringify(sessionUser))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("monorienta_session")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
