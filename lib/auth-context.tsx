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

type User = {
  id: string
  username: string
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
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
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
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const signup = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Signup failed" }
      }

      setUser(data.user)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: "Une erreur est survenue" }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      setUser(data.user)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: "Une erreur est survenue" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem("auth_user")
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
