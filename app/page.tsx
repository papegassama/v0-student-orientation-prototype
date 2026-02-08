"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen, Target, Sparkles, LogOut, User, Zap, Rocket, Star, Mail, Instagram, Facebook, Twitter } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user, logout, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
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
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {user.fullName}
                    </span>
                    <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 bg-transparent rounded-full">
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-sm font-bold border border-primary/20">
            <Zap className="h-4 w-4" />
            Ton avenir commence ici
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-balance leading-tight">
            Construis ton{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              futur
            </span>{" "}
            avec MonOrienta
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            La plateforme qui aide les lycéens du Sénégal à découvrir leurs talents, explorer les meilleures filières et
            construire un projet d'études qui leur ressemble.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild size="lg" className="text-lg px-10 h-14 gap-3 rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105">
              <Link href="/orientation">
                <Rocket className="h-5 w-5" />
                Commencer l'orientation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 h-14 rounded-full bg-transparent border-2 hover:bg-muted/50 transition-all">
              <Link href="/results">Voir un exemple</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-primary">100%</p>
              <p className="text-sm text-muted-foreground font-medium">Gratuit</p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-secondary">5 min</p>
              <p className="text-sm text-muted-foreground font-medium">Pour compléter</p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-accent-foreground">20+</p>
              <p className="text-sm text-muted-foreground font-medium">Filières</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-balance">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground mt-4">Trois étapes simples pour trouver ta voie</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 space-y-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-primary-foreground">1</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Réponds au quiz</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Des questions fun et rapides sur tes matières préférées, tes passions et tes rêves.
            </p>
          </Card>

          <Card className="p-8 space-y-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-secondary/20 group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg shadow-secondary/25 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-secondary-foreground">2</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-secondary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Découvre tes filières</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              On analyse ton profil et on te propose les meilleures options qui te correspondent.
            </p>
          </Card>

          <Card className="p-8 space-y-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-accent/40 group">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/25 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-accent-foreground">3</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Star className="h-7 w-7 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Prépare ton avenir</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Toutes les infos pratiques : établissements, durée, débouchés et conseils personnalisés.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <Card className="max-w-4xl mx-auto p-10 md:p-16 text-center space-y-8 bg-gradient-to-br from-primary via-secondary to-primary border-0 overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold">
              <Sparkles className="h-4 w-4" />
              Gratuit et sans engagement
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white text-balance">
              Prêt à découvrir ton avenir ?
            </h2>
            <p className="text-xl text-white/80 text-pretty max-w-2xl mx-auto">
              Rejoins les lycéens qui ont déjà trouvé leur voie avec MonOrienta. C'est rapide, simple et fait pour toi.
            </p>
            <Button asChild size="lg" className="text-lg px-12 h-16 gap-3 rounded-full bg-white text-primary hover:bg-white/90 shadow-2xl hover:scale-105 transition-all font-bold">
              <Link href="/orientation">
                <Rocket className="h-6 w-6" />
                C'est parti !
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">MonOrienta</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La plateforme d'orientation pour les lyceens du Senegal. Decouvre ta voie, gratuitement.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Navigation</h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
                <Link href="/orientation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Orientation</Link>
                <Link href="/historique" className="text-sm text-muted-foreground hover:text-primary transition-colors">Historique</Link>
                <Link href="/results" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resultats</Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Contact</h4>
              <div className="space-y-3">
                <a
                  href="mailto:MonOrienta@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  MonOrienta@gmail.com
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Reseaux sociaux</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/monorienta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/monorienta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/monorienta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground">Suis-nous pour les dernieres actualites !</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 MonOrienta. Tous droits reserves.
            </p>
            <p className="text-xs text-muted-foreground">
              Fait avec passion pour les lyceens du Senegal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
