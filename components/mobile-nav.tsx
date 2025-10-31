"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, GraduationCap, BookOpen, Calendar, Users, Newspaper, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Accueil" },
    { href: "/professeurs", icon: GraduationCap, label: "Professeurs" },
    { href: "/formations", icon: BookOpen, label: "Formations" },
    { href: "/evenements", icon: Calendar, label: "Événements" },
    { href: "/clubs", icon: Users, label: "Clubs" },
    { href: "/blog", icon: Newspaper, label: "Blog" },
  ]

  return (
    <>
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl px-2 py-3">
          <div className="flex items-center justify-around relative">
            {navItems.slice(0, 3).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-200 relative",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isActive && <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />}
                  <div className="relative z-10">
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                </Link>
              )
            })}

            <Link href="/feed" className="flex items-center justify-center -mt-8 relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Plus size={28} className="text-white" strokeWidth={2.5} />
              </div>
              {pathname === "/feed" && <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />}
            </Link>

            {navItems.slice(3).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-200 relative",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {isActive && <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />}
                  <div className="relative z-10">
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="lg:hidden h-24" />
    </>
  )
}
