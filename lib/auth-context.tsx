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
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        if (supabaseUser) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", supabaseUser.id)
            .single()

          if (profile) {
            setUser({
              id: supabaseUser.id,
              fullName: profile.full_name,
              email: supabaseUser.email || "",
            })
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase])

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

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert([
            {
              user_id: data.user.id,
              full_name: fullName.trim(),
              email: email.toLowerCase().trim(),
            },
          ])

        if (profileError) {
          return { success: false, error: profileError.message }
        }

        setUser({
          id: data.user.id,
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
        })

        return { success: true }
      }

      return { success: false, error: "Signup failed" }
    } catch (error) {
      return { success: false, error: "Une erreur est survenue" }
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

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (authError) {
        return { success: false, error: "Email ou mot de passe incorrect" }
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single()

        if (profileError || !profile) {
          return { success: false, error: "Profil utilisateur non trouvé" }
        }

        setUser({
          id: data.user.id,
          fullName: profile.full_name,
          email: data.user.email || "",
        })

        return { success: true }
      }

      return { success: false, error: "Login failed" }
    } catch (error) {
      return { success: false, error: "Une erreur est survenue" }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
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
        await supabase.from("quiz_results").insert([
          {
            user_id: user.id,
            answers,
            recommendations,
          },
        ])
      } catch (error) {
        console.error("Error saving test result:", error)
      }
    },
    [user, supabase]
  )

  const getTestHistory = useCallback(async (): Promise<TestHistoryEntry[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching test history:", error)
        return []
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        date: entry.created_at,
        answers: entry.answers,
        recommendations: entry.recommendations,
      }))
    } catch (error) {
      console.error("Error getting test history:", error)
      return []
    }
  }, [user, supabase])

  const deleteTestEntry = useCallback(
    async (id: string) => {
      if (!user) return

      try {
        await supabase
          .from("quiz_results")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id)
      } catch (error) {
        console.error("Error deleting test entry:", error)
      }
    },
    [user, supabase]
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
