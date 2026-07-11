"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Calendar, Newspaper, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  // Hide MobileNav on detail pages
  const isDetailPage =
    /^\/formations\/[^/]+$/.test(pathname) ||
    /^\/evenements\/[^/]+$/.test(pathname) ||
    /^\/blog\/[^/]+$/.test(pathname)

  // Don't render if on detail page
  if (isDetailPage) {
    return null
  }

  const navItems = [
    { href: "/", icon: Home, label: "Accueil", color: "from-blue-500 to-cyan-500" },
    { href: "/formations", icon: BookOpen, label: "Cours", color: "from-purple-500 to-pink-500" },
    { href: "/evenements", icon: Calendar, label: "Events", color: "from-orange-500 to-red-500" },
    { href: "/blog", icon: Newspaper, label: "Découvrir", color: "from-violet-500 to-purple-500" },
    { href: "/services", icon: Briefcase, label: "Services", color: "from-teal-500 to-emerald-500" },
  ]

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Main Container - Full Width Edge to Edge */}
        <div className="relative bg-card/90 backdrop-blur-2xl shadow-2xl">
          {/* Gradient Top Border - Highlighted */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="px-1 py-2 pt-3">
            <div className="flex items-center justify-around relative">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-300 relative group",
                      isActive ? "scale-105" : "scale-100 hover:scale-105 active:scale-95"
                    )}
                  >
                    {/* Active Background with Gradient */}
                    {isActive && (
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br rounded-xl opacity-10",
                        item.color
                      )} />
                    )}

                    {/* Hover Effect */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                      item.color
                    )} />

                    {/* Icon Container */}
                    <div className={cn(
                      "relative z-10 transition-all duration-300",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      <item.icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "transition-all duration-300",
                          isActive && "drop-shadow-sm"
                        )}
                      />
                    </div>

                    {/* Label */}
                    <span className={cn(
                      "text-[9px] font-medium transition-all duration-300 relative z-10",
                      isActive ? "text-foreground opacity-100" : "text-muted-foreground opacity-70 group-hover:opacity-100"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Spacer */}
      <div className="lg:hidden h-20" />
    </>
  )
}
