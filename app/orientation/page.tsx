"use client"

import { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Rocket, LogOut, User, Sparkles, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { Target } from "lucide-react" // Import Target component

type Answers = {
  stream: string
  favoriteSubjects: string[]
  difficultSubjects: string[]
  level: string
  interests: string[]
  workStyle: string
  activityType: string
  longStudies: string
  studyType: string
  location: string
  budget: string
}

export default function OrientationPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [answers, setAnswers] = useState<Answers>({
    stream: "",
    favoriteSubjects: [],
    difficultSubjects: [],
    level: "",
    interests: [],
    workStyle: "",
    activityType: "",
    longStudies: "",
    studyType: "",
    location: "",
    budget: "",
  })

  const progress = (currentStep / totalSteps) * 100

  const handleRadioChange = (field: keyof Answers, value: string) => {
    setAnswers({ ...answers, [field]: value })
  }

  const handleCheckboxChange = (field: "favoriteSubjects" | "difficultSubjects" | "interests", value: string) => {
    const currentValues = answers[field]
    if (currentValues.includes(value)) {
      setAnswers({ ...answers, [field]: currentValues.filter((item) => item !== value) })
    } else {
      setAnswers({ ...answers, [field]: [...currentValues, value] })
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      const params = new URLSearchParams({
        answers: JSON.stringify(answers),
      })
      router.push(`/results?${params.toString()}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Show loading state while checking auth
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

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  const stepIcons = [
    <Sparkles key="1" className="h-5 w-5" />,
    <Zap key="2" className="h-5 w-5" />,
    <Star key="3" className="h-5 w-5" />
  ]

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">MonOrienta</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
              {stepIcons[currentStep - 1]}
              Étape {currentStep}/{totalSteps}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {user.fullName}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()} className="gap-1.5 bg-transparent rounded-full">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground text-center">{Math.round(progress)}% complété</p>
          </div>

          {/* Step Content */}
          <Card className="p-8 md:p-10 space-y-8 border-2 shadow-xl">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-sm font-bold border border-primary/20 mb-4">
                    <Sparkles className="h-4 w-4" />
                    Bienvenue, {user.fullName} !
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">Étape 1: Profil Académique</h2>
                  <p className="text-lg text-muted-foreground mt-3">Parle-nous de ton parcours et tes matières au lycée.</p>
                </div>

                {/* Stream Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Quelle est ta série au lycée ?</Label>
                  <RadioGroup value={answers.stream} onValueChange={(value) => handleRadioChange("stream", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="S" id="stream-s" />
                      <Label htmlFor="stream-s" className="font-normal cursor-pointer">
                        Série S (Sciences)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="L" id="stream-l" />
                      <Label htmlFor="stream-l" className="font-normal cursor-pointer">
                        Série L (Lettres)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="G" id="stream-g" />
                      <Label htmlFor="stream-g" className="font-normal cursor-pointer">
                        Série G (Gestion)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="stream-t" />
                      <Label htmlFor="stream-t" className="font-normal cursor-pointer">
                        Série T (Technique)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="stream-other" />
                      <Label htmlFor="stream-other" className="font-normal cursor-pointer">
                        Autre
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Favorite Subjects */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Quelles sont tes matières préférées ? (Plusieurs choix possibles)
                  </Label>
                  <div className="space-y-2">
                    {[
                      "Mathématiques",
                      "Physique-Chimie",
                      "SVT",
                      "Français",
                      "Anglais",
                      "Histoire-Géo",
                      "Philosophie",
                      "Économie",
                    ].map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fav-${subject}`}
                          checked={answers.favoriteSubjects.includes(subject)}
                          onCheckedChange={() => handleCheckboxChange("favoriteSubjects", subject)}
                        />
                        <Label htmlFor={`fav-${subject}`} className="font-normal cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficult Subjects */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Quelles matières te semblent difficiles ? (Plusieurs choix possibles)
                  </Label>
                  <div className="space-y-2">
                    {[
                      "Mathématiques",
                      "Physique-Chimie",
                      "SVT",
                      "Français",
                      "Anglais",
                      "Histoire-Géo",
                      "Philosophie",
                      "Économie",
                    ].map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diff-${subject}`}
                          checked={answers.difficultSubjects.includes(subject)}
                          onCheckedChange={() => handleCheckboxChange("difficultSubjects", subject)}
                        />
                        <Label htmlFor={`diff-${subject}`} className="font-normal cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Self-evaluated Level */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Comment évalues-tu ton niveau général ?</Label>
                  <RadioGroup value={answers.level} onValueChange={(value) => handleRadioChange("level", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Weak" id="level-weak" />
                      <Label htmlFor="level-weak" className="font-normal cursor-pointer">
                        Faible
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Average" id="level-average" />
                      <Label htmlFor="level-average" className="font-normal cursor-pointer">
                        Moyen
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Good" id="level-good" />
                      <Label htmlFor="level-good" className="font-normal cursor-pointer">
                        Bon
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary text-sm font-bold border border-secondary/20 mb-4">
                    <Zap className="h-4 w-4" />
                    On avance bien !
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">Étape 2: Tes Intérêts</h2>
                  <p className="text-lg text-muted-foreground mt-3">
                    Aide-nous à comprendre ce qui te passionne et comment tu aimes travailler.
                  </p>
                </div>

                {/* What do you enjoy most */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Qu'est-ce qui t'intéresse le plus ? (Plusieurs choix possibles)
                  </Label>
                  <div className="space-y-2">
                    {["Technologie", "Santé", "Commerce", "Sciences", "Arts", "Travail de terrain"].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={answers.interests.includes(interest)}
                          onCheckedChange={() => handleCheckboxChange("interests", interest)}
                        />
                        <Label htmlFor={`interest-${interest}`} className="font-normal cursor-pointer">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Style */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Comment préfères-tu travailler ?</Label>
                  <RadioGroup
                    value={answers.workStyle}
                    onValueChange={(value) => handleRadioChange("workStyle", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Alone" id="work-alone" />
                      <Label htmlFor="work-alone" className="font-normal cursor-pointer">
                        Seul(e)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Team" id="work-team" />
                      <Label htmlFor="work-team" className="font-normal cursor-pointer">
                        En équipe
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Activity Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Quel type d'activité préfères-tu ?</Label>
                  <RadioGroup
                    value={answers.activityType}
                    onValueChange={(value) => handleRadioChange("activityType", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Computer" id="activity-computer" />
                      <Label htmlFor="activity-computer" className="font-normal cursor-pointer">
                        Sur ordinateur
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Practical" id="activity-practical" />
                      <Label htmlFor="activity-practical" className="font-normal cursor-pointer">
                        Pratique / Manuel
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Mixed" id="activity-mixed" />
                      <Label htmlFor="activity-mixed" className="font-normal cursor-pointer">
                        Mixte
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Long Studies */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Es-tu à l'aise avec des études longues (5 ans et plus) ?
                  </Label>
                  <RadioGroup
                    value={answers.longStudies}
                    onValueChange={(value) => handleRadioChange("longStudies", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="long-yes" />
                      <Label htmlFor="long-yes" className="font-normal cursor-pointer">
                        Oui
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="long-no" />
                      <Label htmlFor="long-no" className="font-normal cursor-pointer">
                        Non
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/30 to-primary/20 text-accent-foreground text-sm font-bold border border-accent/30 mb-4">
                    <Star className="h-4 w-4" />
                    Dernière ligne droite !
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">Étape 3: Tes Contraintes</h2>
                  <p className="text-lg text-muted-foreground mt-3">
                    Ces informations nous aident à te proposer des options réalistes.
                  </p>
                </div>

                {/* Study Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Quel type d'établissement préfères-tu ?</Label>
                  <RadioGroup
                    value={answers.studyType}
                    onValueChange={(value) => handleRadioChange("studyType", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Public" id="type-public" />
                      <Label htmlFor="type-public" className="font-normal cursor-pointer">
                        Public
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Private" id="type-private" />
                      <Label htmlFor="type-private" className="font-normal cursor-pointer">
                        Privé
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Location Preference */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Où souhaites-tu étudier ?</Label>
                  <RadioGroup value={answers.location} onValueChange={(value) => handleRadioChange("location", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Dakar" id="location-dakar" />
                      <Label htmlFor="location-dakar" className="font-normal cursor-pointer">
                        Dakar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Regions" id="location-regions" />
                      <Label htmlFor="location-regions" className="font-normal cursor-pointer">
                        Régions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NoPreference" id="location-no" />
                      <Label htmlFor="location-no" className="font-normal cursor-pointer">
                        Pas de préférence
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Budget Level */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Quel est ton budget pour les études ?</Label>
                  <RadioGroup value={answers.budget} onValueChange={(value) => handleRadioChange("budget", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Low" id="budget-low" />
                      <Label htmlFor="budget-low" className="font-normal cursor-pointer">
                        Faible
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Medium" id="budget-medium" />
                      <Label htmlFor="budget-medium" className="font-normal cursor-pointer">
                        Moyen
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="High" id="budget-high" />
                      <Label htmlFor="budget-high" className="font-normal cursor-pointer">
                        Élevé
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2 bg-transparent rounded-full h-12 px-6 border-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>

            <Button onClick={handleNext} className="gap-2 rounded-full h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold">
              {currentStep === totalSteps ? (
                <>
                  <Rocket className="h-4 w-4" />
                  Voir mes résultats
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
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
