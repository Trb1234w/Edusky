'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles, Play, CheckCircle2 } from 'lucide-react'
import { GlossyButton } from './modern/GlossyButton'
import Link from 'next/link'
import Image from 'next/image'

/**
 * PremiumHero - Hero section centré et moderne
 * Inspiré de Notion, Figma, GitHub
 * 
 * Features:
 * - Layout centré pour desktop
 * - Typographie élégante et grande
 * - Animations subtiles
 * - Badge de statut animé
 * - CTA buttons avec icônes
 * - Preview image avec glow effect
 * - Stats inline
 */
export function PremiumHero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const stats = [
        { value: '5000+', label: 'Étudiants' },
        { value: '200+', label: 'Professeurs' },
        { value: '150+', label: 'Formations' },
    ]

    const features = [
        'Formations certifiées',
        'Communauté active',
        'Support 24/7',
    ]

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-32">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

                {/* Animated Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse animation-delay-500" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
            </div>

            {/* Content Container - Centré */}
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge Animé */}
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary">
                            Plateforme éducative #1 en Guinée
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs font-semibold text-primary">
                            Nouveau
                        </span>
                    </div>

                    {/* Titre Principal - Extra Large */}
                    <h1
                        className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                            Votre avenir commence
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                            ici et maintenant
                        </span>
                    </h1>

                    {/* Sous-titre - Large et lisible */}
                    <p
                        className={`text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        Connectez-vous avec les meilleurs professeurs, accédez à des formations de qualité et rejoignez une communauté d'apprenants passionnés.
                    </p>

                    {/* Features List */}
                    <div
                        className={`flex flex-wrap items-center justify-center gap-6 mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div
                        className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        <Link href="/inscription">
                            <GlossyButton variant="primary" size="lg" className="text-lg px-8 py-6">
                                Commencer gratuitement
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </GlossyButton>
                        </Link>
                        <Link href="/formations">
                            <GlossyButton variant="outline" size="lg" className="text-lg px-8 py-6">
                                <Play className="w-5 h-5 mr-2" />
                                Voir la démo
                            </GlossyButton>
                        </Link>
                    </div>

                    {/* Stats Inline */}
                    <div
                        className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Preview Image avec Glow Effect */}
                    <div
                        className={`mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <div className="relative max-w-5xl mx-auto">
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-3xl rounded-3xl" />

                            {/* Image Container */}
                            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                    {/* Placeholder - Remplace par une vraie image */}
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </div>
                                        <p className="text-muted-foreground text-lg">
                                            Aperçu de la plateforme
                                        </p>
                                    </div>
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
                </div>
            </div>
        </section>
    )
}
