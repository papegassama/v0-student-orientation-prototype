"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Heart,
  Zap,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Building2,
} from "lucide-react"

export function ExampleSection() {
  const exampleStudent = {
    name: "Mariam",
    age: 17,
    stream: "Série S",
    interests: ["Technologie", "Sciences", "Travail de terrain"],
    strengths: ["Mathématiques", "Physique-Chimie"],
    weaknesses: ["Français"],
  }

  const exampleResults = [
    {
      title: "Informatique et Génie Logiciel",
      matchScore: 95,
      difficulty: "Modéré",
      description:
        "Tu aimes les maths et la technologie. L'informatique te permettra de créer des applications.",
      duration: "3 à 5 ans",
      careers: ["Développeur web", "Administrateur réseau", "Analyste programmeur"],
      reason: "Excellente correspondance avec tes compétences en maths et ton intérêt pour la technologie.",
    },
    {
      title: "Réseaux et Télécommunications",
      matchScore: 88,
      difficulty: "Modéré",
      description:
        "Les réseaux et télécoms sont essentiels dans notre monde connecté avec de bonnes opportunités.",
      duration: "3 à 5 ans",
      careers: ["Administrateur réseau", "Technicien télécoms", "Ingénieur réseaux"],
      reason:
        "Tu as les compétences mathématiques requises et la passion pour la technologie moderne.",
    },
    {
      title: "Génie Civil et Construction",
      matchScore: 82,
      difficulty: "Exigeant",
      description:
        "Conception et construction de bâtiments, ponts et infrastructures qui façonnent notre environnement.",
      duration: "5 ans",
      careers: ["Ingénieur BTP", "Architecte", "Chef de chantier"],
      reason:
        "Tes excellentes compétences en maths et physique sont essentielles pour ce domaine.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-balance">Un exemple concret</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvre comment MonOrienta fonctionne avec le profil de Mariam, une élève de Terminale S
          </p>
        </div>

        {/* Student Profile */}
        <Card className="p-8 md:p-10 space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            {/* Profile Info */}
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{exampleStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{exampleStudent.stream}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Points forts</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exampleStudent.strengths.map((strength) => (
                      <Badge key={strength} variant="secondary" className="font-normal">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    <p className="font-semibold">Intérêts</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exampleStudent.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="border-2 font-normal"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Ses 3 meilleures filières</h3>
          </div>

          {exampleResults.map((result, index) => (
            <Card
              key={index}
              className="p-8 md:p-10 space-y-6 border-2 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {index === 0 && (
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Meilleure correspondance
                      </Badge>
                    )}
                    <Badge variant="outline" className="font-bold border-2">
                      {result.matchScore}% compatibilité
                    </Badge>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black">{result.title}</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">{result.description}</p>
                </div>
              </div>

              {/* Why it matches */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <p className="text-sm font-medium text-primary mb-1">Pourquoi cette filière pour Mariam ?</p>
                <p className="text-sm text-muted-foreground">{result.reason}</p>
              </div>

              {/* Details grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Durée
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{result.duration}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Débouchés possibles
                  </div>
                  <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                    {result.careers.slice(0, 2).map((career) => (
                      <li key={career} className="flex items-start gap-1.5">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4 text-primary" />
                    Accessibilité
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {index === 0 ? "Très accessible" : "Modérément accessible"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info box */}
        <Card className="p-8 md:p-10 bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
          <div className="flex items-start gap-4">
            <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-bold">Cet exemple est représentatif</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mariam a reçu 3 recommandations basées sur son profil académique, ses intérêts personnels et ses
                contraintes pratiques. Nos résultats sont personnalisés selon tes réponses au test d'orientation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
