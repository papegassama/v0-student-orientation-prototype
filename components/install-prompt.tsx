"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Share, Plus } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed / standalone
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true)

    setIsStandalone(standalone)

    if (standalone) return

    // Check if previously dismissed
    const wasDismissed = sessionStorage.getItem("monorienta_install_dismissed")
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    // Android / Chrome: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|Chrome/.test(navigator.userAgent)
    if (isIOS && isSafari) {
      setShowIOSGuide(true)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem("monorienta_install_dismissed", "true")
  }

  // Don't show if already installed, nothing to show, or dismissed
  if (isStandalone || dismissed || (!deferredPrompt && !showIOSGuide)) return null

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 z-40 mx-auto max-w-sm animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">Installer MonOrienta</p>
            {deferredPrompt ? (
              <>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Ajoute l'app sur ton ecran d'accueil pour un acces rapide.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="rounded-full h-8 px-4 text-xs font-bold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Installer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="rounded-full h-8 px-3 text-xs text-muted-foreground"
                  >
                    Plus tard
                  </Button>
                </div>
              </>
            ) : showIOSGuide ? (
              <>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Pour installer, appuie sur
                  <Share className="inline h-3.5 w-3.5 mx-1 text-primary align-text-bottom" />
                  puis sur
                  <span className="inline-flex items-center mx-1 text-primary font-semibold">
                    <Plus className="h-3 w-3 mr-0.5" />
                    Ecran d'accueil
                  </span>
                </p>
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="rounded-full h-8 px-3 text-xs text-muted-foreground"
                  >
                    J'ai compris
                  </Button>
                </div>
              </>
            ) : null}
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
