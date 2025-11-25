'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Send,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { GlossyButton } from './modern/GlossyButton'

/**
 * ModernFooter - Footer premium avec design moderne
 * 
 * Features:
 * - Multi-colonnes organisées
 * - Newsletter signup moderne
 * - Social links avec hover effects
 * - Gradient top border
 * - Animations subtiles
 */
export function ModernFooter() {
    const pathname = usePathname()
    const isHomepage = pathname === '/'
    const shouldShowOnMobile = true
    const [email, setEmail] = useState('')

    const sections = [
        {
            title: 'Plateforme',
            links: [
                { label: 'Professeurs', href: '/professeurs' },
                { label: 'Formations', href: '/formations' },
                { label: 'Événements', href: '/evenements' },
                { label: 'Clubs', href: '/clubs' },
            ],
        },
        {
            title: 'Ressources',
            links: [
                { label: 'Blog', href: '/blog' },
                { label: 'Réseau', href: '/feed' },
                { label: 'À propos', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
            ],
        },
        {
            title: 'Légal',
            links: [
                { label: 'Conditions', href: '/conditions' },
                { label: 'Confidentialité', href: '/confidentialite' },
                { label: 'Mentions légales', href: '/mentions-legales' },
            ],
        },
    ]

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
        { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
        { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
        { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    ]

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implémenter la logique d'inscription newsletter
        console.log('Newsletter signup:', email)
        setEmail('')
    }

    return (
        <footer className={cn(
            'relative mt-32 border-t border-border/50 bg-gradient-to-b from-background to-muted/30',
            !shouldShowOnMobile && 'max-lg:hidden'
        )}>
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Logo et Newsletter - 5 colonnes */}
                    <div className="lg:col-span-5">
                        {/* Logo */}
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] transition-transform group-hover:scale-110 duration-300">
                                <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                        E
                                    </span>
                                </div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                EduSky
                            </span>
                        </Link>

                        {/* Description */}
                        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                            La plateforme éducative qui connecte étudiants, professeurs et mentors en Guinée. Découvrez, apprenez et grandissez ensemble.
                        </p>

                        {/* Newsletter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Newsletter
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Recevez les dernières actualités et formations directement dans votre boîte mail.
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity flex items-center justify-center"
                                    aria-label="S'inscrire à la newsletter"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                                Suivez-nous
                            </h3>
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className={cn(
                                            'w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 transition-all flex items-center justify-center group',
                                            'border border-border/50 hover:border-primary/30',
                                            social.color
                                        )}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sections de liens - 7 colonnes */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                                            >
                                                <span>{link.label}</span>
                                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} EduSky. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Conditions
                        </Link>
                        <Link href="/confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Confidentialité
                        </Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
