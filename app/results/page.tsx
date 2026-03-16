"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  TrendingUp,
  Clock,
  Building2,
  GraduationCap,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  GitCompare,
  Sparkles,
  Trophy,
  Target,
  History,
  Rocket,
} from "lucide-react"
import { generateRecommendations, type Answers, type Recommendation } from "@/lib/orientation-logic"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"

function ResultsContent() {
  const searchParams = useSearchParams()
  const { user, saveTestResult } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [answers, setAnswers] = useState<Answers | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedPaths, setSelectedPaths] = useState<number[]>([])
  const hasSavedRef = useRef(false)

  useEffect(() => {
    const answersParam = searchParams.get("answers")
    if (answersParam) {
      try {
        const parsedAnswers = JSON.parse(answersParam) as Answers
        setAnswers(parsedAnswers)
        const recs = generateRecommendations(parsedAnswers)
        setRecommendations(recs)

        // Save to history (once per page load)
        if (user && !hasSavedRef.current) {
          hasSavedRef.current = true
          saveTestResult(
            parsedAnswers as unknown as Record<string, unknown>,
            recs.map(r => ({
              title: r.title,
              matchScore: r.matchScore,
              difficulty: r.difficulty,
              description: r.description,
            }))
          ).catch(error => console.error("Error saving test result:", error))
        }
      } catch (error) {
        console.error("Error parsing answers:", error)
      }
    }
  }, [searchParams.get("answers"), user, saveTestResult])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "Modéré":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "Exigeant":
        return "text-amber-700 bg-amber-50 border-amber-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const toggleComparison = () => {
    setCompareMode(!compareMode)
    setSelectedPaths([])
  }

  const togglePathSelection = (index: number) => {
    if (selectedPaths.includes(index)) {
      setSelectedPaths(selectedPaths.filter((i) => i !== index))
    } else if (selectedPaths.length < 2) {
      setSelectedPaths([...selectedPaths, index])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-sm font-bold border border-primary/20">
              <Trophy className="h-5 w-5" />
              Félicitations !
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-balance">
              Tes résultats sont{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                prêts
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvre les filières et parcours qui correspondent le mieux à ton profil unique.
            </p>
          </div>

          {/* Profile Summary */}
          {answers && (
            <Card className="p-8 md:p-10 space-y-6 border-2 bg-gradient-to-br from-card to-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Ton profil</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Série</p>
                  <p className="text-lg font-bold">{answers.stream || "Non spécifié"}</p>
                </div>
                <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Intérêts principaux</p>
                  <p className="text-lg font-bold">
                    {answers.interests.length > 0 ? answers.interests.slice(0, 2).join(", ") : "Non spécifié"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background border-2 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Niveau</p>
                  <p className="text-lg font-bold">
                    {answers.level === "Good"
                      ? "Bon"
                      : answers.level === "Average"
                        ? "Moyen"
                        : answers.level === "Weak"
                          ? "Faible"
                          : "Non spécifié"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {recommendations.length >= 2 && (
            <div className="flex justify-center">
              <Button
                onClick={toggleComparison}
                variant={compareMode ? "default" : "outline"}
                size="lg"
                className={`gap-2 rounded-full h-12 px-8 font-bold transition-all ${
                  compareMode 
                    ? "shadow-lg shadow-primary/25" 
                    : "bg-transparent border-2 hover:border-primary hover:text-primary"
                }`}
              >
                <GitCompare className="h-5 w-5" />
                {compareMode ? "Retour aux résultats" : "Comparer 2 filières"}
              </Button>
            </div>
          )}

          {compareMode && selectedPaths.length === 2 && (
            <Card className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Comparaison des filières</h2>
                <p className="text-sm text-muted-foreground">
                  Compare ces deux options pour mieux comprendre leurs différences
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {selectedPaths.map((pathIndex) => {
                  const rec = recommendations[pathIndex]
                  return (
                    <div key={pathIndex} className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-primary">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Matières et compétences clés
                          </p>
                          <ul className="space-y-1 ml-6">
                            {rec.keySubjects.slice(0, 4).map((subject, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {subject}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Niveau de difficulté
                          </p>
                          <Badge className={getDifficultyColor(rec.difficulty)}>{rec.difficulty}</Badge>
                        </div>

                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Durée des études
                          </p>
                          <p className="text-muted-foreground ml-6">{rec.duration}</p>
                        </div>

                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Types d'établissements
                          </p>
                          <ul className="space-y-1 ml-6">
                            {rec.institutions.slice(0, 2).map((inst, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {inst}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Débouchés professionnels
                          </p>
                          <ul className="space-y-1 ml-6">
                            {rec.careers.slice(0, 3).map((career, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {career}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-card border rounded-lg p-4 space-y-2">
                          <p className="font-semibold text-primary">Pour qui ?</p>
                          <p className="text-muted-foreground">{rec.explanation}</p>
                        </div>

                        <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
                          <p className="font-semibold">À considérer avant de choisir</p>
                          <p className="text-muted-foreground">{rec.practicalNotes}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground italic">
                  Ton choix final doit prendre en compte tes intérêts, tes forces et ta situation personnelle. Ces deux
                  options sont adaptées à ton profil, choisis celle qui te parle le plus.
                </p>
              </div>
            </Card>
          )}

          {/* Recommended Paths */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-black">Filières recommandées</h2>
              </div>
              {compareMode && selectedPaths.length < 2 && (
                <p className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
                  Sélectionne {selectedPaths.length === 0 ? "2 filières" : "1 filière de plus"} à comparer
                </p>
              )}
            </div>

            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={`p-8 md:p-10 space-y-8 transition-all duration-300 border-2 ${
                    compareMode
                      ? selectedPaths.includes(index)
                        ? "ring-2 ring-primary shadow-2xl border-primary"
                        : "hover:ring-2 hover:ring-primary/50 cursor-pointer opacity-90 hover:shadow-xl"
                      : "hover:shadow-2xl hover:-translate-y-1"
                  }`}
                  onClick={() => compareMode && togglePathSelection(index)}
                >
                  {compareMode && (
                    <div className="flex items-center gap-3 pb-4 border-b-2">
                      <div
                        className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedPaths.includes(index) ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedPaths.includes(index) && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                      </div>
                      <span className="text-sm font-bold">
                        {selectedPaths.includes(index) ? "Sélectionnée" : "Cliquer pour sélectionner"}
                      </span>
                    </div>
                  )}

                  {/* Header with title and badges */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {index === 0 && (
                          <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold px-3 py-1">
                            <Trophy className="h-3.5 w-3.5 mr-1.5" />
                            Meilleure correspondance
                          </Badge>
                        )}
                        <Badge variant="outline" className="font-bold border-2">{rec.matchScore}% compatibilité</Badge>
                        <Badge variant="outline" className={`font-bold border-2 ${getDifficultyColor(rec.difficulty)}`}>
                          {rec.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-black">{rec.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{rec.description}</p>
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  {/* Why this matches your profile */}
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary mb-1">Pourquoi cette filière pour toi ?</p>
                    <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                  </div>

                  {/* Key subjects and skills */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>Matières et compétences clés</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rec.keySubjects.map((subject, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Durée :</span>
                    <span className="text-muted-foreground">{rec.duration}</span>
                  </div>

                  {/* Institutions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>Établissements au Sénégal</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {rec.institutions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career opportunities */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>Débouchés professionnels</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rec.careers.map((career, i) => (
                        <span key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Practical notes */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span>Ce qu'il faut savoir</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed ml-6">{rec.practicalNotes}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Aucune recommandation disponible. Assure-toi d'avoir complété le questionnaire.
                </p>
              </Card>
            )}
          </div>

          {/* Important Note */}
          <Card className="p-6 bg-muted/50 border-muted">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note importante :</strong> Ces recommandations sont basées sur ton profil actuel. Elles sont
              indicatives et ne garantissent pas de réussite. N'hésite pas à consulter un conseiller d'orientation pour
              plus de détails.
            </p>
          </Card>

          {/* Next Steps */}
          <Card className="p-8 md:p-10 space-y-6 bg-gradient-to-br from-primary via-secondary to-primary border-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">Prochaines étapes</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-white mt-0.5 shrink-0" />
                <span className="text-lg">Rencontre ton conseiller d'orientation pour approfondir ces résultats</span>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-white mt-0.5 shrink-0" />
                <span className="text-lg">Renseigne-toi sur les établissements proposant ces filières</span>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-white mt-0.5 shrink-0" />
                <span className="text-lg">Participe aux journées portes ouvertes pour découvrir les formations</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto bg-transparent rounded-full h-14 px-8 border-2 text-base font-bold">
              <Link href="/orientation">
                <ArrowLeft className="h-5 w-5" />
                Refaire l'orientation
              </Link>
            </Button>
            {user && (
              <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto bg-transparent rounded-full h-14 px-8 border-2 text-base font-bold">
                <Link href="/historique">
                  <History className="h-5 w-5" />
                  Mon historique
                </Link>
              </Button>
            )}
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 shadow-lg shadow-primary/25 text-base font-bold">
              <Link href="/">
                <Rocket className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">MonOrienta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 MonOrienta. Plateforme d'orientation pour lycéens sénégalais.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/orientation" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Commencer
              </Link>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des résultats...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
