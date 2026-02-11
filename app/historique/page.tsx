"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LogOut,
  User,
  Clock,
  Trash2,
  ArrowRight,
  History,
  Trophy,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Rocket,
} from "lucide-react"
import { useAuth, type TestHistoryEntry } from "@/lib/auth-context"
import { Logo } from "@/components/logo"

export default function HistoriquePage() {
  const { user, logout, isLoading, getTestHistory, deleteTestEntry } = useAuth()
  const [history, setHistory] = useState<TestHistoryEntry[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setHistory(getTestHistory())
    }
  }, [user, getTestHistory])

  const handleDelete = (id: string) => {
    deleteTestEntry(id)
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-muted-foreground font-medium">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!user) return null

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
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-bold text-xl tracking-tight">MonOrienta</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/orientation" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Orientation
            </Link>
            <Link href="/historique" className="hidden md:block text-sm font-semibold text-primary transition-colors">
              Historique
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {user.fullName}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()} className="gap-1.5 bg-transparent rounded-full">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Deconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Page header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-sm font-bold border border-primary/20">
              <History className="h-5 w-5" />
              Ton parcours
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-balance">
              Historique de tes{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                tests
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Retrouve tous tes anciens tests d'orientation et suis ton evolution.
            </p>
          </div>

          {history.length === 0 ? (
            <Card className="p-12 text-center space-y-6 border-2">
              <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mx-auto">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Aucun test pour le moment</h3>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Tu n'as pas encore fait de test d'orientation. Lance-toi, c'est rapide et gratuit !
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/25">
                <Link href="/orientation">
                  <Rocket className="h-5 w-5 mr-2" />
                  Faire mon premier test
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground">
                {history.length} test{history.length > 1 ? "s" : ""} effectue{history.length > 1 ? "s" : ""}
              </p>

              {history.map((entry, i) => (
                <Card
                  key={entry.id}
                  className="border-2 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Card header - always visible */}
                  <button
                    type="button"
                    className="w-full p-6 md:p-8 flex items-center justify-between gap-4 text-left"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <span className="text-lg font-black text-primary-foreground">#{history.length - i}</span>
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-lg">Test d'orientation</p>
                          {i === 0 && (
                            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-xs">
                              Plus recent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDate(entry.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className="font-bold border-2 hidden sm:flex">
                        {entry.recommendations.length} filiere{entry.recommendations.length > 1 ? "s" : ""}
                      </Badge>
                      {expandedId === entry.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expandable content */}
                  {expandedId === entry.id && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6 border-t-2">
                      <div className="pt-6 space-y-4">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          Filieres recommandees
                        </h4>
                        <div className="grid gap-3">
                          {entry.recommendations.map((rec, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                                  <span className="text-sm font-bold text-primary">{j + 1}</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold truncate">{rec.title}</p>
                                  <p className="text-sm text-muted-foreground truncate">{rec.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="outline" className="font-bold border-2">
                                  {rec.matchScore}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="gap-2 bg-transparent rounded-full border-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                        <Button asChild size="sm" className="gap-2 rounded-full shadow-lg shadow-primary/25 font-bold">
                          <Link href="/orientation">
                            Refaire un test
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* CTA */}
          {history.length > 0 && (
            <div className="flex justify-center pt-6">
              <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/25">
                <Link href="/orientation">
                  <Rocket className="h-5 w-5 mr-2" />
                  Faire un nouveau test
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2026 MonOrienta. Plateforme d'orientation pour lyceens senegalais.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
