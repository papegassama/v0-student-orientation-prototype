"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Rocket, LogOut, User, Sparkles, Zap, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Logo } from "@/components/logo"

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

// Each question as a standalone unit
const questions = [
  { id: "stream", step: 1, type: "radio" as const, label: "Quelle est ta serie au lycee ?", field: "stream" as const,
    options: [
      { value: "S", label: "Serie S (Sciences)" },
      { value: "L", label: "Serie L (Lettres)" },
      { value: "G", label: "Serie G (Gestion)" },
      { value: "T", label: "Serie T (Technique)" },
      { value: "Other", label: "Autre" },
    ]
  },
  { id: "favoriteSubjects", step: 1, type: "checkbox" as const, label: "Quelles sont tes matieres preferees ?", field: "favoriteSubjects" as const,
    options: ["Mathematiques", "Physique-Chimie", "SVT", "Francais", "Anglais", "Histoire-Geo", "Philosophie", "Economie"].map(s => ({ value: s, label: s }))
  },
  { id: "difficultSubjects", step: 1, type: "checkbox" as const, label: "Quelles matieres te semblent difficiles ?", field: "difficultSubjects" as const,
    options: ["Mathematiques", "Physique-Chimie", "SVT", "Francais", "Anglais", "Histoire-Geo", "Philosophie", "Economie"].map(s => ({ value: s, label: s }))
  },
  { id: "level", step: 1, type: "radio" as const, label: "Comment evalues-tu ton niveau general ?", field: "level" as const,
    options: [
      { value: "Weak", label: "Faible" },
      { value: "Average", label: "Moyen" },
      { value: "Good", label: "Bon" },
    ]
  },
  { id: "interests", step: 2, type: "checkbox" as const, label: "Qu'est-ce qui t'interesse le plus ?", field: "interests" as const,
    options: ["Technologie", "Sante", "Commerce", "Sciences", "Arts", "Travail de terrain"].map(s => ({ value: s, label: s }))
  },
  { id: "workStyle", step: 2, type: "radio" as const, label: "Comment preferes-tu travailler ?", field: "workStyle" as const,
    options: [
      { value: "Alone", label: "Seul(e)" },
      { value: "Team", label: "En equipe" },
    ]
  },
  { id: "activityType", step: 2, type: "radio" as const, label: "Quel type d'activite preferes-tu ?", field: "activityType" as const,
    options: [
      { value: "Computer", label: "Sur ordinateur" },
      { value: "Practical", label: "Pratique / Manuel" },
      { value: "Mixed", label: "Mixte" },
    ]
  },
  { id: "longStudies", step: 2, type: "radio" as const, label: "Es-tu a l'aise avec des etudes longues (5 ans et plus) ?", field: "longStudies" as const,
    options: [
      { value: "Yes", label: "Oui" },
      { value: "No", label: "Non" },
    ]
  },
  { id: "studyType", step: 3, type: "radio" as const, label: "Quel type d'etablissement preferes-tu ?", field: "studyType" as const,
    options: [
      { value: "Public", label: "Public" },
      { value: "Private", label: "Prive" },
    ]
  },
  { id: "location", step: 3, type: "radio" as const, label: "Ou souhaites-tu etudier ?", field: "location" as const,
    options: [
      { value: "Dakar", label: "Dakar" },
      { value: "Regions", label: "Regions" },
      { value: "NoPreference", label: "Pas de preference" },
    ]
  },
  { id: "budget", step: 3, type: "radio" as const, label: "Quel est ton budget pour les etudes ?", field: "budget" as const,
    options: [
      { value: "Low", label: "Faible" },
      { value: "Medium", label: "Moyen" },
      { value: "High", label: "Eleve" },
    ]
  },
]

const stepMeta = [
  { icon: <Sparkles className="h-4 w-4" />, title: "Profil Academique", subtitle: "Parle-nous de ton parcours au lycee.", badge: "C'est parti !", color: "from-primary/20 to-secondary/20 text-primary border-primary/20" },
  { icon: <Zap className="h-4 w-4" />, title: "Tes Interets", subtitle: "Ce qui te passionne et comment tu aimes travailler.", badge: "On avance bien !", color: "from-secondary/20 to-primary/20 text-secondary border-secondary/20" },
  { icon: <Star className="h-4 w-4" />, title: "Tes Contraintes", subtitle: "Pour des options realistes et adaptees.", badge: "Derniere ligne droite !", color: "from-accent/30 to-primary/20 text-accent-foreground border-accent/30" },
]

export default function OrientationPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const isMobile = useIsMobile()

  // Desktop: 3-step flow; Mobile: one question per screen
  const [desktopStep, setDesktopStep] = useState(1)
  const [mobileQuestionIndex, setMobileQuestionIndex] = useState(0)

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

  const totalQuestions = questions.length
  const currentQuestion = questions[mobileQuestionIndex]
  const currentDesktopStepMeta = stepMeta[(isMobile ? currentQuestion.step : desktopStep) - 1]

  // Progress
  const mobileProgress = ((mobileQuestionIndex + 1) / totalQuestions) * 100
  const desktopProgress = (desktopStep / 3) * 100
  const progress = isMobile ? mobileProgress : desktopProgress

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

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const goToResults = () => {
    const params = new URLSearchParams({ answers: JSON.stringify(answers) })
    router.push(`/results?${params.toString()}`)
  }

  // Mobile navigation
  const handleMobileNext = () => {
    if (mobileQuestionIndex < totalQuestions - 1) {
      setMobileQuestionIndex(mobileQuestionIndex + 1)
    } else {
      goToResults()
    }
  }

  const handleMobilePrev = () => {
    if (mobileQuestionIndex > 0) {
      setMobileQuestionIndex(mobileQuestionIndex - 1)
    }
  }

  // Desktop navigation
  const handleDesktopNext = () => {
    if (desktopStep < 3) {
      setDesktopStep(desktopStep + 1)
    } else {
      goToResults()
    }
  }

  const handleDesktopPrev = () => {
    if (desktopStep > 1) {
      setDesktopStep(desktopStep - 1)
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

  if (!user) return null

  // Render a single question (used by both mobile and desktop)
  function renderQuestion(q: typeof questions[0]) {
    if (q.type === "radio") {
      return (
        <div className="space-y-3">
          <Label className="text-base font-semibold">{q.label}</Label>
          <RadioGroup
            value={answers[q.field] as string}
            onValueChange={(value) => handleRadioChange(q.field, value)}
            className="space-y-2"
          >
            {q.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
                  answers[q.field] === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                <span className="font-medium text-base">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )
    }

    // Checkbox type
    const field = q.field as "favoriteSubjects" | "difficultSubjects" | "interests"
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">{q.label}</Label>
        <p className="text-sm text-muted-foreground -mt-1">Plusieurs choix possibles</p>
        <div className="space-y-2">
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
                (answers[field] as string[]).includes(opt.value)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Checkbox
                id={`${q.id}-${opt.value}`}
                checked={(answers[field] as string[]).includes(opt.value)}
                onCheckedChange={() => handleCheckboxChange(field, opt.value)}
              />
              <span className="font-medium text-base">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  // Desktop: render all questions for a step
  function renderDesktopStep(step: number) {
    const stepQuestions = questions.filter(q => q.step === step)
    const meta = stepMeta[step - 1]
    return (
      <div className="space-y-8">
        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${meta.color} text-sm font-bold border mb-4`}>
            {meta.icon}
            {step === 1 && user ? `Bienvenue, ${user.name || user.email} !` : meta.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black">Etape {step}: {meta.title}</h2>
          <p className="text-lg text-muted-foreground mt-3">{meta.subtitle}</p>
        </div>
        {stepQuestions.map(q => (
          <div key={q.id}>{renderQuestion(q)}</div>
        ))}
      </div>
    )
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
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Logo size="sm" />
            <span className="font-bold text-lg md:text-xl tracking-tight">MonOrienta</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
              {stepIcons[(isMobile ? currentQuestion.step : desktopStep) - 1]}
              {isMobile ? `${mobileQuestionIndex + 1}/${totalQuestions}` : `Etape ${desktopStep}/3`}
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 bg-transparent rounded-full">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Deconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2 md:space-y-3">
            <div className="h-2 md:h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground text-center">{Math.round(progress)}% complete</p>
          </div>

          {/* MOBILE: One question per screen */}
          {isMobile && (
            <>
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${currentDesktopStepMeta.color} text-xs font-bold border`}>
                  {currentDesktopStepMeta.icon}
                  {currentDesktopStepMeta.title}
                </div>
                <Card className="p-5 border-2 shadow-lg">
                  {renderQuestion(currentQuestion)}
                </Card>
              </div>

              {/* Mobile nav buttons */}
              <div className="flex items-center justify-between pb-20">
                <Button
                  variant="outline"
                  onClick={handleMobilePrev}
                  disabled={mobileQuestionIndex === 0}
                  className="gap-2 bg-transparent rounded-full h-12 px-5 border-2 touch-manipulation"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>

                <Button
                  onClick={handleMobileNext}
                  className="gap-2 rounded-full h-12 px-6 shadow-lg shadow-primary/25 font-bold touch-manipulation"
                >
                  {mobileQuestionIndex === totalQuestions - 1 ? (
                    <>
                      <Rocket className="h-4 w-4" />
                      Resultats
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* DESKTOP: Multi-question steps */}
          {!isMobile && (
            <>
              <Card className="p-8 md:p-10 space-y-8 border-2 shadow-xl">
                {renderDesktopStep(desktopStep)}
              </Card>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleDesktopPrev}
                  disabled={desktopStep === 1}
                  className="gap-2 bg-transparent rounded-full h-12 px-6 border-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Precedent
                </Button>

                <Button
                  onClick={handleDesktopNext}
                  className="gap-2 rounded-full h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold"
                >
                  {desktopStep === 3 ? (
                    <>
                      <Rocket className="h-4 w-4" />
                      Voir mes resultats
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer - desktop only */}
      <footer className="hidden md:block border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 MonOrienta. Plateforme d'orientation pour lyceens senegalais.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
