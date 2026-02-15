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
  signUp as firebaseSignUp,
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  signInWithGoogle,
  getCurrentUser,
  onAuthStateChanged,
  saveQuizResult,
  getQuizResults,
  deleteQuizResult,
} from "@/lib/auth"

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
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
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
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.id,
          fullName: firebaseUser.fullName || "",
          email: firebaseUser.email || "",
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
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

      const firebaseUser = await firebaseSignUp(
        email.toLowerCase().trim(),
        password,
        fullName.trim()
      )

      setUser({
        id: firebaseUser.id,
        fullName: firebaseUser.fullName || "",
        email: firebaseUser.email || "",
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

      const firebaseUser = await firebaseSignIn(email.toLowerCase().trim(), password)

      setUser({
        id: firebaseUser.id,
        fullName: firebaseUser.fullName || "",
        email: firebaseUser.email || "",
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      return { success: false, error: errorMessage }
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = await signInWithGoogle()

      setUser({
        id: firebaseUser.id,
        fullName: firebaseUser.fullName || "",
        email: firebaseUser.email || "",
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut()
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
        loginWithGoogle,
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
