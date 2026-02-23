import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import { MobileNav } from "@/components/mobile-nav"
import { InstallPrompt } from "@/components/install-prompt"
import "./globals.css"

const _plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" })
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "MonOrienta - Orientation Lycee Senegal",
  description: "Plateforme d'orientation pour les lyceens du Senegal. Decouvre ta voie gratuitement.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MonOrienta",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-96x96.jpg", sizes: "96x96", type: "image/jpeg" },
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [
      { url: "/icons/icon-152x152.jpg", sizes: "152x152" },
      { url: "/icon-192x192.jpg", sizes: "180x180" },
    ],
  },
  other: [
    { name: "mobile-web-app-capable", content: "yes" },
  ],
}

export const viewport: Viewport = {
  themeColor: "#c026d3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <MobileNav />
            <InstallPrompt />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
