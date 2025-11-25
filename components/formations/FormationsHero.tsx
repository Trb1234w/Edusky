'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, BookOpen, Award, Users, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FormationsHero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 animate-pulse animation-delay-2000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left relative z-10">

                        {/* Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-sm transition-all duration-700",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            <Sparkles className="w-4 h-4 fill-primary animate-pulse" />
                            <span>Excellence Académique</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={cn(
                                "text-4xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Maîtrisez de nouvelles <br />
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                                compétences d'avenir
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className={cn(
                                "text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Accédez à des centaines de formations certifiantes dispensées par des experts.
                            Boostez votre carrière avec un apprentissage flexible et personnalisé.
                        </p>

                        {/* Stats / Features */}
                        <div
                            className={cn(
                                "grid grid-cols-3 gap-4 w-full max-w-lg transition-all duration-700 delay-300",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            {[
                                { icon: BookOpen, label: "Cours", value: "500+", color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: Users, label: "Étudiants", value: "10k+", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { icon: Award, label: "Certifiés", value: "100%", color: "text-orange-500", bg: "bg-orange-500/10" },
                            ].map((stat, index) => (
                                <div key={index} className="flex flex-col items-center p-3 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-md">
                                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image Composition */}
                    <div
                        className={cn(
                            "relative hidden lg:block h-[400px] transition-all duration-1000 delay-300",
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                        )}
                    >
                        {/* Main Image Card */}
                        <div className="absolute top-0 right-0 w-4/5 h-full bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                                alt="Students learning"
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-sm font-medium opacity-90 mb-1">En direct</p>
                                <p className="text-xl font-bold">Masterclass Design</p>
                            </div>
                        </div>

                        {/* Floating Card 1 */}
                        <div className="absolute top-10 left-0 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Certification</p>
                                    <p className="text-sm font-bold">Obtenue !</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 2 */}
                        <div className="absolute bottom-20 left-10 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float animation-delay-2000">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Rejoignez</p>
                                    <p className="text-sm font-bold">+2k étudiants</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
