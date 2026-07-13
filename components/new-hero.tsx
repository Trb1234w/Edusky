'use client'

import { ArrowRight, CheckCircle2, Users, BookOpen, Award, Briefcase, Trophy, GraduationCap, Network, Search, Newspaper } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { GlossyButton } from './modern/GlossyButton'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Slides avec le contenu spécifique demandé
const heroSlides = [
    {
        id: 'formations',
        title: 'Formations de qualité',
        description: 'Découvrez des formations dans divers domaines pour développer vos compétences.',
        icon: Award,
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
        color: 'from-blue-500 to-cyan-600'
    },

    {
        id: 'blog',
        title: 'Blog & Actualités',
        description: 'Restez informé des dernières actualités éducatives, conseils et opportunités.',
        icon: Newspaper,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        color: 'from-indigo-500 to-blue-600'
    },
]

// Chips pour l'accès rapide (remplace les CTA)
const quickAccessChips = [
    { label: 'Formations', icon: BookOpen, href: '/formations', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },

    { label: 'Blog', icon: Newspaper, href: '/blog', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
]

const typingPhrases = [
    "commence ici",
    "se développe ici",
    "prend son envol ici",
    "se transforme ici"
]

export function NewHero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Typing effect state
    const [text, setText] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [typingSpeed, setTypingSpeed] = useState(150)

    // Refs for auto-scroll - Removed in favor of CSS Marquee
    // const quickAccessScrollRef = useRef<HTMLDivElement>(null)
    // const featureListScrollRef = useRef<HTMLDivElement>(null)

    // Effect for auto-scroll - Removed in favor of CSS Marquee
    /*
    useEffect(() => {
        const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>) => {
            const element = ref.current
            if (!element) return null

            const interval = setInterval(() => {
                if (element.scrollLeft + element.clientWidth >= element.scrollWidth) {
                    element.scrollLeft = 0
                } else {
                    element.scrollLeft += 1
                }
            }, 50) // Adjust speed here (higher ms = slower)

            return interval
        }

        const quickAccessInterval = scrollContainer(quickAccessScrollRef)
        const featureListInterval = scrollContainer(featureListScrollRef)

        return () => {
            if (quickAccessInterval) clearInterval(quickAccessInterval)
            if (featureListInterval) clearInterval(featureListInterval)
        }
    }, [])
    */

    // Auto-play slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        setIsVisible(true)
    }, [])

    // Typing effect logic
    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = typingPhrases[phraseIndex]

            if (isDeleting) {
                setText(currentPhrase.substring(0, text.length - 1))
                setTypingSpeed(50)
            } else {
                setText(currentPhrase.substring(0, text.length + 1))
                setTypingSpeed(150)
            }

            if (!isDeleting && text === currentPhrase) {
                setTimeout(() => setIsDeleting(true), 2000)
            } else if (isDeleting && text === '') {
                setIsDeleting(false)
                setPhraseIndex((prev) => (prev + 1) % typingPhrases.length)
            }
        }

        const timer = setTimeout(handleTyping, typingSpeed)
        return () => clearTimeout(timer)
    }, [text, isDeleting, phraseIndex, typingSpeed])

    return (
        <section className="relative pt-30 pb-4 md:pt-28 md:pb-12 lg:py-20 overflow-hidden w-full">
            {/* Advanced Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

                {/* Animated Orbs */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 blur-[120px] rounded-full animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-accent/5 blur-[100px] rounded-full animate-pulse animation-delay-1000" />
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-full overflow-hidden">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-16 items-center">

                    {/* Left Column: Text Content */}
                    <div className={`space-y-3 md:space-y-5 lg:space-y-6 transition-all duration-1000 w-full max-w-full overflow-hidden ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        {/* Redesigned Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-fade-in-up shadow-sm backdrop-blur-sm">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                La plateforme éducative tout-en-un
                            </span>
                        </div>

                        {/* Main Title with Typing Effect */}
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight min-h-[80px] md:min-h-[140px] lg:min-h-[160px] break-words">
                            Votre avenir <br />
                            <span className="relative inline-block mt-1 md:mt-2">
                                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                                    {text}
                                </span>
                                <span className="absolute -right-1 top-0 bottom-0 w-1 bg-primary animate-blink" />
                                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-full md:max-w-xl break-words">
                            Développez vos compétences avec nos formations spécialisées et restez informé grâce à nos articles. 
                            Une plateforme pensée pour votre réussite éducative et professionnelle.
                        </p>

                        {/* Quick Access Chips (Marquee) */}
                        <div className="pt-2 overflow-hidden">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Accès Rapide</p>
                            <div className="marquee-container mask-linear-fade">
                                <div className="animate-marquee flex gap-3">
                                    {/* Original Items */}
                                    {quickAccessChips.map((chip, index) => (
                                        <Link
                                            key={`original-${index}`}
                                            href={chip.href}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95",
                                                "bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-sm",
                                                chip.color
                                            )}
                                        >
                                            <chip.icon className="w-5 h-5" />
                                            <span className="text-base font-medium">{chip.label}</span>
                                        </Link>
                                    ))}
                                    {/* Duplicated Items for seamless loop */}
                                    {quickAccessChips.map((chip, index) => (
                                        <Link
                                            key={`duplicate-${index}`}
                                            href={chip.href}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95",
                                                "bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-sm",
                                                chip.color
                                            )}
                                        >
                                            <chip.icon className="w-5 h-5" />
                                            <span className="text-base font-medium">{chip.label}</span>
                                        </Link>
                                    ))}
                                    {/* Triplicated Items for wide screens */}
                                    {quickAccessChips.map((chip, index) => (
                                        <Link
                                            key={`triplicate-${index}`}
                                            href={chip.href}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95",
                                                "bg-background/50 backdrop-blur-sm hover:bg-background/80 shadow-sm",
                                                chip.color
                                            )}
                                        >
                                            <chip.icon className="w-5 h-5" />
                                            <span className="text-base font-medium">{chip.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Feature List (Marquee on Mobile, Stack on Desktop) */}
                        <div className="mt-4 md:mt-0">
                            {/* Mobile Marquee View */}
                            <div className="md:hidden overflow-hidden -mx-4 px-4">
                                <div className="animate-marquee flex gap-4">
                                    {[...heroSlides, ...heroSlides].map((slide, index) => (
                                        <div
                                            key={`mobile-feature-${index}`}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg transition-all duration-300 min-w-[240px] border bg-card/50 border-border/50 opacity-90"
                                            )}
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground shrink-0">
                                                <slide.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                {slide.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Stack View (Unchanged) */}
                            <div className="hidden md:flex flex-col gap-3">
                                {heroSlides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer border border-transparent",
                                            currentSlide === index
                                                ? "bg-primary/10 border-primary/20 translate-x-2"
                                                : "hover:bg-primary/5 hover:translate-x-1 opacity-70"
                                        )}
                                        onClick={() => setCurrentSlide(index)}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                                            currentSlide === index ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            <slide.icon className="w-5 h-5" />
                                        </div>
                                        <span className={cn(
                                            "text-lg font-medium transition-colors whitespace-nowrap",
                                            currentSlide === index ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {slide.title}
                                        </span>
                                        {currentSlide === index && (
                                            <ArrowRight className="w-5 h-5 text-primary ml-auto animate-pulse" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Coursera-style Slider */}
                    <div className={`relative h-[280px] md:h-[450px] lg:h-[550px] w-full max-w-[90%] mx-auto md:max-w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Main Image Container */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={cn(
                                        "absolute inset-0 transition-all duration-700 ease-in-out",
                                        index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                                    )}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 transform transition-transform duration-700 delay-100">
                                        <div className={cn(
                                            "inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl mb-3 shadow-lg bg-gradient-to-br",
                                            slide.color
                                        )}>
                                            <slide.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                                        </div>

                                        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                            {slide.title}
                                        </h2>

                                        <p className="text-base text-white/90 leading-relaxed max-w-md drop-shadow-sm line-clamp-2">
                                            {slide.description}
                                        </p>

                                        {/* Progress Bar for current slide */}
                                        {index === currentSlide && (
                                            <div className="absolute bottom-0 left-0 h-1 bg-primary animate-progress-bar" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Floating Stats Cards - Decorative (Visible on mobile now) */}
                        <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-card/90 backdrop-blur-md border border-border/50 p-2 md:p-3 rounded-xl shadow-xl animate-float z-20 scale-75 md:scale-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground">Taux de réussite</div>
                                    <div className="text-sm font-bold text-foreground">98%</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-card/90 backdrop-blur-md border border-border/50 p-2 md:p-3 rounded-xl shadow-xl animate-float animation-delay-2000 z-20 scale-75 md:scale-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground">Communauté</div>
                                    <div className="text-sm font-bold text-foreground">5k+ Étudiants</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-3 right-5 flex gap-1.5 z-20">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        index === currentSlide ? "w-6 bg-white" : "bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
