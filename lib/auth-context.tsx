"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

type User = {
  id: string
  email: string
  name: string | null
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
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  saveTestResult: (
    answers: Record<string, unknown>,
    recommendations: TestHistoryEntry["recommendations"]
  ) => void
  getTestHistory: () => TestHistoryEntry[]
  deleteTestEntry: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || null,
          })
        }
      } catch (error) {
        console.error("[v0] Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || null,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth])

  const getHistoryKey = useCallback(
    (userId: string) => `monorienta_history_${userId}`,
    []
  )

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Une erreur est survenue lors de la connexion" }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("[v0] Error during logout:", error)
    }
  }

  const saveTestResult = useCallback(
    (
      answers: Record<string, unknown>,
      recommendations: TestHistoryEntry["recommendations"]
    ) => {
      if (!user) return

      const key = getHistoryKey(user.id)
      const existing = localStorage.getItem(key)
      const history: TestHistoryEntry[] = existing ? JSON.parse(existing) : []

      const entry: TestHistoryEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        answers,
        recommendations: recommendations.map((r) => ({
          title: r.title,
          matchScore: r.matchScore,
          difficulty: r.difficulty,
          description: r.description,
        })),
      }

      history.unshift(entry)
      localStorage.setItem(key, JSON.stringify(history))
    },
    [user, getHistoryKey]
  )

  const getTestHistory = useCallback((): TestHistoryEntry[] => {
    if (!user) return []
    const key = getHistoryKey(user.id)
    const existing = localStorage.getItem(key)
    return existing ? JSON.parse(existing) : []
  }, [user, getHistoryKey])

  const deleteTestEntry = useCallback(
    (id: string) => {
      if (!user) return
      const key = getHistoryKey(user.id)
      const existing = localStorage.getItem(key)
      if (!existing) return
      const history: TestHistoryEntry[] = JSON.parse(existing)
      const updated = history.filter((h) => h.id !== id)
      localStorage.setItem(key, JSON.stringify(updated))
    },
    [user, getHistoryKey]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
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
