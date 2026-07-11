"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { User } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const navLinks = [
    { href: "/formations", label: "Formations" },
    { href: "/evenements", label: "Événements" },
    { href: "/blog", label: "Blog" },
  ]

  const isHomepage = pathname === "/"
  const shouldShowOnMobile = isHomepage

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border",
        !shouldShowOnMobile && "max-lg:hidden",
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xl transition-transform group-hover:scale-105">
              E
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduSky
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <NotificationsDropdown />
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium">
                    Mon Espace
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/connexion">
                  <Button variant="ghost" className="font-medium">
                    Connexion
                  </Button>
                </Link>
                <Link href="/inscription">
                  <Button className="font-medium bg-primary hover:opacity-90">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in-up">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full font-medium">
                        Mon Espace
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/connexion" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full font-medium">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/inscription" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full font-medium bg-gradient-to-r from-primary to-secondary">S'inscrire</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
