'use client'

import Link from 'next/link'
import { Menu, X, Bell, Sparkles, MessageCircle, Info, User as UserIcon, LogIn, Search, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { User } from '@supabase/supabase-js'
import { GlossyButton } from './GlossyButton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
    const [searchQuery, setSearchQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // Détection du scroll pour effet de header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Récupération de l'utilisateur et des messages non lus
    useEffect(() => {
        const getUserAndMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { getGlobalUnreadCount } = await import('@/app/messages/actions')
                const count = await getGlobalUnreadCount(user.id)
                setUnreadCount(count)
            }
        }
        getUserAndMessages()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                import('@/app/messages/actions').then(async ({ getGlobalUnreadCount }) => {
                    const count = await getGlobalUnreadCount(session.user.id)
                    setUnreadCount(count)
                })
            } else {
                setUnreadCount(0)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    // Refresh count on path change (e.g. leaving messages page)
    useEffect(() => {
        if (user) {
            import('@/app/messages/actions').then(async ({ getGlobalUnreadCount }) => {
                const count = await getGlobalUnreadCount(user.id)
                setUnreadCount(count)
            })
        }
    }, [pathname, user])

    const navLinks = [
        { href: '/professeurs', label: 'Professeurs' },
        { href: '/formations', label: 'Formations' },
        { href: '/evenements', label: 'Événements' },
        { href: '/clubs', label: 'Clubs' },
        { href: '/blog', label: 'Blog' },
        { href: '/feed', label: 'Réseau' },
    ]

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            router.push('/search')
        }
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const isHomepage = pathname === '/'
    const shouldShowOnMobile = true // Controlled by LayoutWrapper

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                !shouldShowOnMobile && 'max-lg:hidden',
                scrolled || !isHomepage
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
                                <Link href="/messages" className="relative p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground/80">
                                    <MessageCircle className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
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

                    {/* Mobile Actions (No Hamburger) */}
                    <div className="lg:hidden flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Notifications */}
                                <div className="relative">
                                    <NotificationsDropdown />
                                </div>

                                {/* Messages */}
                                <Link href="/messages" className="relative p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground/80">
                                    <MessageCircle className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Info / About Us */}
                                <Link href="/about-us" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground/80">
                                    <Info className="w-6 h-6" />
                                </Link>

                                {/* User Profile */}
                                <Link href="/dashboard" className="relative group">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border group-hover:border-primary transition-colors">
                                        {user.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Info / About Us */}
                                <Link href="/about-us" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground/80">
                                    <Info className="w-6 h-6" />
                                </Link>

                                {/* Connexion Button */}
                                <Link href="/connexion">
                                    <GlossyButton variant="primary" size="sm" className="rounded-full px-4 text-xs font-medium flex items-center gap-2">
                                        <LogIn className="w-3 h-3" />
                                        <span>Connexion</span>
                                    </GlossyButton>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar - Only visible on mobile */}
                <div className="lg:hidden pb-3 pt-2 border-t border-border/50">
                    <div className="relative group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Rechercher..."
                            className={`pl-9 pr-10 h-9 text-sm transition-all duration-200 ${isFocused
                                ? 'border-primary shadow-sm ring-1 ring-primary/20'
                                : 'hover:border-primary/50'
                                }`}
                        />
                        <Button
                            onClick={handleSearch}
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

