"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogOut, User, Moon, Sun } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export function Header() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-bold text-xl tracking-tight">MonOrienta</span>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="hidden md:block text-sm font-semibold hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link
            href="/orientation"
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Orientation
          </Link>
          <Link
            href="/results"
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Résultats
          </Link>
          <Link
            href="/historique"
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Historique
          </Link>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-300"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={theme === "light" ? "Mode sombre" : "Mode clair"}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          )}

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {user.username}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 bg-transparent rounded-full">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="rounded-full">
                    <Link href="/login">Connexion</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/25">
                    <Link href="/signup">S'inscrire</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
