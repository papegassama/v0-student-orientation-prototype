"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChanged,
  saveQuizResult,
  getQuizResults,
  deleteQuizResult,
} from "@/lib/auth-supabase"

type User = {
  id: string
  fullName: string
  email: string
}

export type TestHistoryEntry = {
  id: string
  date: string
  answers: Record<string, unknown>
  recommendations: Array<{
    title: string
    matchScore: number
    difficulty: string
    description: string
  }>
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  saveTestResult: (
    answers: Record<string, unknown>,
    recommendations: TestHistoryEntry["recommendations"]
  ) => Promise<void>
  getTestHistory: () => Promise<TestHistoryEntry[]>
  deleteTestEntry: (id: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          setUser({
            id: user.id,
            fullName: user.full_name || "",
            email: user.email || "",
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signup = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!fullName.trim()) {
        return { success: false, error: "Le nom complet est requis" }
      }
      if (password.length < 6) {
        return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" }
      }

      const result = await signUp(
        email.toLowerCase().trim(),
        password,
        fullName.trim()
      )

      setUser({
        id: result.user.id,
        fullName: result.user.full_name || "",
        email: result.user.email || "",
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      return { success: false, error: errorMessage }
    }
  }

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) {
        return { success: false, error: "Email et mot de passe requis" }
      }

      const result = await signIn(email.toLowerCase().trim(), password)

      setUser({
        id: result.user.id,
        fullName: result.user.full_name || "",
        email: result.user.email || "",
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const saveTestResult = useCallback(
    async (
      answers: Record<string, unknown>,
      recommendations: TestHistoryEntry["recommendations"]
    ) => {
      if (!user) return

      try {
        await saveQuizResult(user.id, answers, recommendations)
      } catch (error) {
        console.error("Error saving test result:", error)
      }
    },
    [user]
  )

  const getTestHistory = useCallback(async (): Promise<TestHistoryEntry[]> => {
    if (!user) return []

    try {
      const results = await getQuizResults(user.id)
      return results.map((entry: any) => ({
        id: entry.id,
        date: entry.createdAt?.toDate?.().toISOString?.() || entry.createdAt || "",
        answers: entry.answers,
        recommendations: entry.recommendations,
      }))
    } catch (error) {
      console.error("Error getting test history:", error)
      return []
    }
  }, [user])

  const deleteTestEntry = useCallback(
    async (id: string) => {
      if (!user) return

      try {
        await deleteQuizResult(user.id, id)
      } catch (error) {
        console.error("Error deleting test entry:", error)
      }
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        saveTestResult,
        getTestHistory,
        deleteTestEntry,
      }}
    >
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
