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

type AppUser = {
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
  user: AppUser | null
  isLoading: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  signup: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  saveTestResult: (
    answers: Record<string, unknown>,
    recommendations: TestHistoryEntry["recommendations"]
  ) => Promise<void>
  getTestHistory: () => Promise<TestHistoryEntry[]>
  deleteTestEntry: (id: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapSupabaseUser(supabaseUser: SupabaseUser): AppUser {
  return {
    id: supabaseUser.id,
    fullName:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.email?.split("@")[0] ||
      "Utilisateur",
    email: supabaseUser.email || "",
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser()
      if (supabaseUser) {
        setUser(mapSupabaseUser(supabaseUser))
      }
      setIsLoading(false)
    }
    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signup = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!fullName.trim()) {
      return { success: false, error: "Le nom complet est requis" }
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères",
      }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/orientation`,
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "Cet email est déjà utilisé" }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (
        error.message.includes("Invalid login credentials")
      ) {
        return { success: false, error: "Email ou mot de passe incorrect" }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const saveTestResult = useCallback(
    async (
      answers: Record<string, unknown>,
      recommendations: TestHistoryEntry["recommendations"]
    ) => {
      if (!user) return

      await supabase.from("test_history").insert({
        user_id: user.id,
        answers,
        recommendations: recommendations.map((r) => ({
          title: r.title,
          matchScore: r.matchScore,
          difficulty: r.difficulty,
          description: r.description,
        })),
      })
    },
    [user, supabase]
  )

  const getTestHistory = useCallback(async (): Promise<TestHistoryEntry[]> => {
    if (!user) return []

    const { data, error } = await supabase
      .from("test_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((row) => ({
      id: row.id,
      date: row.created_at,
      answers: row.answers as Record<string, unknown>,
      recommendations: row.recommendations as TestHistoryEntry["recommendations"],
    }))
  }, [user, supabase])

  const deleteTestEntry = useCallback(
    async (id: string) => {
      if (!user) return

      await supabase.from("test_history").delete().eq("id", id).eq("user_id", user.id)
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
