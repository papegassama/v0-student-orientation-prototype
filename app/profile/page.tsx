"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  LogOut,
  User,
  History,
  Trash2,
  Rocket,
  Calendar,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useAuth, type TestHistoryEntry } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isLoading, getTestHistory, deleteTestEntry } = useAuth()
  const [history, setHistory] = useState<TestHistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const loadHistory = async () => {
      try {
        setError(null)
        const results = await getTestHistory()
        setHistory(results)
      } catch (err) {
        setError("Erreur lors du chargement de l'historique")
        console.error("Error loading history:", err)
      } finally {
        setLoadingHistory(false)
      }
    }

    loadHistory()
  }, [user, getTestHistory])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteTestEntry(id)
      setHistory(history.filter((entry) => entry.id !== id))
    } catch (err) {
      setError("Erreur lors de la suppression")
      console.error("Error deleting entry:", err)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse">
            <Logo size="lg" />
          </div>
          <div className="text-muted-foreground font-medium">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/orientation" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="font-bold text-xl tracking-tight">MonOrienta</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 bg-transparent rounded-full">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="p-8 md:p-10 border-2 space-y-6 bg-gradient-to-br from-card to-muted/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black">{user.fullName}</h1>
                  <p className="text-lg text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link href="/orientation">
                <Button className="gap-2 rounded-full h-12 px-6 shadow-lg shadow-primary/25 font-bold">
                  <Rocket className="h-4 w-4" />
                  Nouveau test
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Tests complétés
                </p>
                <p className="text-2xl font-bold">{history.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dernier test
                </p>
                <p className="text-lg font-bold">
                  {history.length > 0
                    ? new Date(history[0].date).toLocaleDateString("fr-FR")
                    : "Aucun test"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Profil
                </p>
                <p className="text-lg font-bold text-primary">Actif</p>
              </div>
            </div>
          </Card>

          {/* Test History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Historique de vos tests</h2>
              </div>
              {history.length > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {history.length} test{history.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loadingHistory ? (
              <Card className="p-8 border-2 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de l'historique...
              </Card>
            ) : history.length === 0 ? (
              <Card className="p-12 border-2 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Aucun test complété</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore complété de test d'orientation.
                  </p>
                </div>
                <Link href="/orientation">
                  <Button className="gap-2 rounded-full h-12 px-6 shadow-lg shadow-primary/25 font-bold mt-4">
                    <Rocket className="h-4 w-4" />
                    Commencer un test
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <Card key={entry.id} className="p-6 md:p-7 border-2 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-primary">#{history.length - index}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-lg">Test #{history.length - index}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Top Recommendations */}
                        {entry.recommendations && entry.recommendations.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="text-sm font-semibold text-muted-foreground">Meilleures filières</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.recommendations.slice(0, 3).map((rec, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-primary/5 border-primary/30 text-primary rounded-full"
                                >
                                  {rec.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 bg-transparent rounded-full h-10 px-4"
                          disabled={deletingId === entry.id}
                          onClick={() => handleDelete(entry.id)}
                        >
                          {deletingId === entry.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 MonOrienta. Plateforme d'orientation pour lycéens sénégalais.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
