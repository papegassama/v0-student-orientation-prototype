"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, History, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/orientation", label: "Test", icon: Compass },
  { href: "/historique", label: "Historique", icon: History },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Don't show on login page
  if (pathname === "/login") return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 pt-3 transition-colors touch-manipulation ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-primary"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}

        {/* Profile/account tab */}
        <Link
          href={user ? "/orientation" : "/login"}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 pt-3 transition-colors touch-manipulation ${
            pathname === "/login" || pathname === "/signup"
              ? "text-primary"
              : "text-muted-foreground active:text-primary"
          }`}
        >
          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
            user ? "bg-primary/15" : ""
          }`}>
            <User className={`h-4 w-4 ${user ? "text-primary" : ""}`} />
          </div>
          <span className="text-[10px] font-semibold leading-tight">
            {user ? "Profil" : "Connexion"}
          </span>
        </Link>
      </div>
    </nav>
  )
}
