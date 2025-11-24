'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Sparkles, TrendingUp, Users } from 'lucide-react'
import { GlossyButton } from './GlossyButton'
import { ImageCarousel } from './ImageCarousel'
import Link from 'next/link'

// Images pour le carousel (à remplacer par de vraies images)
// Tu peux remplacer ces URLs par tes propres images dans /public/images/
const heroImages = [
    {
        src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
        alt: 'Étudiants en formation',
        title: 'Votre Avenir Commence Ici',
        subtitle: 'Rejoignez la plateforme éducative nouvelle génération',
    },
    {
        src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=1080&fit=crop',
        alt: 'Campus moderne',
        title: 'Apprenez Autrement',
        subtitle: 'Des formations adaptées à votre rythme',
    },
    {
        src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop',
        alt: 'Collaboration étudiante',
        title: 'Connectez-vous',
        subtitle: 'Rejoignez une communauté de 5000+ étudiants',
    },
]

// Stats à afficher
const stats = [
    { icon: Users, value: '5000+', label: 'Étudiants actifs' },
    { icon: TrendingUp, value: '200+', label: 'Professeurs experts' },
    { icon: Sparkles, value: '150+', label: 'Formations disponibles' },
]

/**
 * ModernHero - Section hero moderne avec parallaxe et carousel
 * 
 * Fonctionnalités :
 * - Background avec dégradés animés
 * - Carousel d'images en arrière-plan
 * - Effets parallaxe au scroll
 * - CTA buttons glossy
 * - Stats animées
 */
export function ModernHero() {
    const [scrollY, setScrollY] = useState(0)

    // Effet parallaxe au scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Layer 1: Gradient animé */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
                style={{
                    transform: `translateY(${scrollY * 0.5}px)`,
                }}
            />

            {/* Background Layer 2: Carousel d'images avec overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                }}
            >
                <ImageCarousel
                    images={heroImages}
                    autoPlayInterval={6000}
                    showControls={false}
                    showIndicators={false}
                />
            </div>

            {/* Background Layer 3: Mesh gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

            {/* Effet de grille glossy */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Contenu principal */}
            <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge "Nouveau" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Plateforme éducative nouvelle génération
                        </span>
                    </div>

                    {/* Titre principal avec gradient */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-100">
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Votre Avenir
                        </span>
                        <br />
                        <span className="text-foreground">
                            Commence Ici
                        </span>
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                        Accédez à des formations de qualité, connectez-vous avec des experts et développez vos compétences sur la plateforme éducative la plus complète.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
                        <Link href="/inscription">
                            <GlossyButton variant="primary" size="lg">
                                <Sparkles className="w-5 h-5" />
                                Commencer Gratuitement
                            </GlossyButton>
                        </Link>
                        <Link href="/formations">
                            <GlossyButton variant="outline" size="lg">
                                Explorer les Formations
                            </GlossyButton>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-2">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {stat.value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">Découvrir</span>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
                        <ChevronDown className="w-5 h-5 text-primary" />
                    </div>
                </div>
            </div>

            {/* Effet de glow en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    )
}
