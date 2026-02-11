"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

type User = {
  fullName: string
  email: string
}

type StoredUser = User & {
  password: string
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
  login: (email: string, password: string) => { success: boolean; error?: string }
  signup: (fullName: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
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

  useEffect(() => {
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

  const getUsers = (): StoredUser[] => {
    try {
      const stored = localStorage.getItem("monorienta_users")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("monorienta_users", JSON.stringify(users))
  }

  const signup = (
    fullName: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    if (!fullName.trim()) {
      return { success: false, error: "Le nom complet est requis" }
    }
    if (password.length < 6) {
      return { success: false, error: "Le mot de passe doit contenir au moins 6 caracteres" }
    }

    const users = getUsers()
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (existingUser) {
      return { success: false, error: "Cet email est deja utilise" }
    }

    const newUser: StoredUser = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
    }

    users.push(newUser)
    saveUsers(users)

    const sessionUser: User = { fullName: newUser.fullName, email: newUser.email }
    setUser(sessionUser)
    localStorage.setItem("monorienta_session", JSON.stringify(sessionUser))

    return { success: true }
  }

  const login = (
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" }
    }

    const users = getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    const sessionUser: User = { fullName: found.fullName, email: found.email }
    setUser(sessionUser)
    localStorage.setItem("monorienta_session", JSON.stringify(sessionUser))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("monorienta_session")
  }

  const getHistoryKey = useCallback(
    (email: string) => `monorienta_history_${email.toLowerCase()}`,
    []
  )

  const saveTestResult = useCallback(
    (
      answers: Record<string, unknown>,
      recommendations: TestHistoryEntry["recommendations"]
    ) => {
      if (!user) return

      const key = getHistoryKey(user.email)
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
    const key = getHistoryKey(user.email)
    const existing = localStorage.getItem(key)
    return existing ? JSON.parse(existing) : []
  }, [user, getHistoryKey])

  const deleteTestEntry = useCallback(
    (id: string) => {
      if (!user) return
      const key = getHistoryKey(user.email)
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
