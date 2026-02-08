import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { MobileNav } from "@/components/mobile-nav"
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
      {
        url: "/icon-192x192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        url: "/icon-512x512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    apple: "/icon-192x192.jpg",
  },
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
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <MobileNav />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
