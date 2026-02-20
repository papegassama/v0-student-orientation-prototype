"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, AlertCircle, CheckCircle, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    // Validate username
    if (!username.trim()) {
      setError("Le nom d'utilisateur est requis")
      setIsSubmitting(false)
      return
    }

    if (username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères")
      setIsSubmitting(false)
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores")
      setIsSubmitting(false)
      return
    }

    // Validate password
    if (!password) {
      setError("Le mot de passe est requis")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setIsSubmitting(false)
      return
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsSubmitting(false)
      return
    }

    const result = await signup(username, password)

    if (result.success) {
      setSuccess("Inscription reussie ! Redirection...")
      setTimeout(() => {
        router.push("/orientation")
      }, 1500)
    } else {
      setError(result.error || "Une erreur est survenue")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-bold text-xl tracking-tight">MonOrienta</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8 md:p-10 space-y-8 border-2 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mx-auto mb-2 shadow-lg shadow-secondary/25">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black">Rejoins-nous !</h1>
            <p className="text-muted-foreground text-lg">
              Crée ton compte et commence ton orientation
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choisis un nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary disabled:opacity-50"
                  minLength={3}
                  maxLength={30}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground ml-1">3-30 caractères, lettres, chiffres, tirets et underscores</p>
                <p className="text-xs text-muted-foreground">{username.length}/30</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary disabled:opacity-50"
                  minLength={6}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground ml-1">Au moins 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme ton mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-12 h-12 text-base rounded-xl border-2 focus:border-primary disabled:opacity-50 ${
                    confirmPassword && password !== confirmPassword ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive ml-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" disabled={isSubmitting}>
              {isSubmitting ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>

          <div className="text-center text-base text-muted-foreground pt-4 border-t">
            Tu as déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Se connecter
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 MonOrienta. Plateforme d'orientation pour lycéens sénégalais.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
