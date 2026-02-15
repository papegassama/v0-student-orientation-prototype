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
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", supabaseUser.id)
            .single()

          if (profile && !profileError) {
            setUser({
              id: supabaseUser.id,
              fullName: profile.full_name,
              email: supabaseUser.email || "",
            })
          } else {
            // User is authenticated but has no profile - this is ok during initial signup
            setUser({
              id: supabaseUser.id,
              fullName: "",
              email: supabaseUser.email || "",
            })
          }
        }
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
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
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.log("[v0] Signup auth error:", authError)
        return { success: false, error: authError.message }
      }

      if (data.user) {
        console.log("[v0] User created:", data.user.id)
        
        // Create user profile with id as primary key (references auth.users.id)
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: data.user.id,
              full_name: fullName.trim(),
              email: email.toLowerCase().trim(),
            },
          ])

        if (profileError) {
          console.log("[v0] Profile creation error:", profileError)
          return { success: false, error: "Impossible de créer le profil. Veuillez réessayer." }
        }

        setUser({
          id: data.user.id,
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
        })

        return { success: true }
      }

      return { success: false, error: "Erreur lors de l'inscription" }
    } catch (error) {
      console.log("[v0] Signup exception:", error)
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
        console.log("[v0] Login auth error:", authError.message)
        // Provide clear error messages
        if (authError.message.includes("Invalid login credentials")) {
          return { success: false, error: "Email ou mot de passe incorrect" }
        }
        if (authError.message.includes("Email not confirmed")) {
          return { success: false, error: "Vérifiez votre email pour confirmer votre compte" }
        }
        return { success: false, error: authError.message }
      }

      if (data.user) {
        console.log("[v0] Login successful for:", data.user.email)
        
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.log("[v0] Profile fetch error:", profileError)
        }

        if (profile) {
          setUser({
            id: data.user.id,
            fullName: profile.full_name,
            email: data.user.email || "",
          })
        } else {
          // User is authenticated, even if profile is missing
          setUser({
            id: data.user.id,
            fullName: "",
            email: data.user.email || "",
          })
        }

        return { success: true }
      }

      return { success: false, error: "Erreur de connexion" }
    } catch (error) {
      console.log("[v0] Login exception:", error)
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
