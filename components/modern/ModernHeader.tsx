'use client'

import Link from 'next/link'
import { Menu, X, Bell, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { User } from '@supabase/supabase-js'
import { GlossyButton } from './GlossyButton'

/**
 * ModernHeader - Header moderne avec effets glossy et animations
 * 
 * Fonctionnalités :
 * - Navigation sticky avec backdrop-blur
 * - Logo animé avec gradient et sparkles
 * - Menu desktop avec hover effects
 * - Menu mobile avec slide animation
 * - CTA buttons glossy
 * - Typographie uniforme (text-sm md:text-base)
 */
export function ModernHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const supabase = createClient()

    // Détection du scroll pour effet de header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Récupération de l'utilisateur
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
        { href: '/professeurs', label: 'Professeurs' },
        { href: '/formations', label: 'Formations' },
        { href: '/evenements', label: 'Événements' },
        { href: '/clubs', label: 'Clubs' },
        { href: '/blog', label: 'Blog' },
        { href: '/feed', label: 'Réseau' },
    ]

    const isHomepage = pathname === '/'
    const shouldShowOnMobile = isHomepage

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                !shouldShowOnMobile && 'max-lg:hidden',
                scrolled
                    ? 'bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5'
                    : 'bg-transparent border-b border-transparent'
            )}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo avec effet glossy */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Logo avec bordure gradient */}
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] transition-transform group-hover:scale-110 duration-300">
                            {/* Inner background */}
                            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                    E
                                </span>
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                            {/* Sparkles overlay */}
                            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 text-primary/40 animate-sparkle" />
                        </div>

                        {/* Texte du logo */}
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-secondary group-hover:to-accent transition-all duration-300">
                            EduSky
                        </span>
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-colors duration-300 group animate-fade-in-up",
                                    `animation-delay-${index * 100}`
                                )}
                            >
                                {link.label}
                                {/* Underline effect */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent group-hover:w-full transition-all duration-300" />
                                {/* Glow effect */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-50 blur-sm group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <>
                                <NotificationsDropdown />
                                <Link href="/dashboard">
                                    <GlossyButton variant="outline" size="sm" className="text-sm md:text-base">
                                        Mon Espace
                                    </GlossyButton>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/connexion">
                                    <GlossyButton variant="outline" size="sm" className="text-sm md:text-base">
                                        Connexion
                                    </GlossyButton>
                                </Link>
                                <Link href="/inscription">
                                    <GlossyButton variant="primary" size="sm" className="text-sm md:text-base">
                                        S'inscrire
                                    </GlossyButton>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Menu Mobile Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            'lg:hidden p-2 rounded-xl transition-all duration-300',
                            'hover:bg-primary/10',
                            isMenuOpen && 'bg-primary/10'
                        )}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? (
                            <X size={24} className="text-primary" />
                        ) : (
                            <Menu size={24} className="text-foreground" />
                        )}
                    </button>
                </div>

                {/* Menu Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in-up bg-background/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-xl border-b border-primary/10">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm md:text-base font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 flex items-center justify-between group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                                </Link>
                            ))}

                            {/* Actions Mobile */}
                            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border/50">
                                {user ? (
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <GlossyButton variant="primary" size="md" className="w-full text-sm md:text-base">
                                            Mon Espace
                                        </GlossyButton>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/connexion" onClick={() => setIsMenuOpen(false)}>
                                            <GlossyButton variant="outline" size="md" className="w-full text-sm md:text-base">
                                                Connexion
                                            </GlossyButton>
                                        </Link>
                                        <Link href="/inscription" onClick={() => setIsMenuOpen(false)}>
                                            <GlossyButton variant="primary" size="md" className="w-full text-sm md:text-base">
                                                S'inscrire
                                            </GlossyButton>
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
