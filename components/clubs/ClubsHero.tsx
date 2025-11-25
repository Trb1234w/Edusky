'use client'

import { useState, useEffect } from 'react'
import { Users, Heart, Sparkles, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ClubsHero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-500/5" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] translate-y-1/3 translate-x-1/4 animate-pulse animation-delay-2000" />

                {/* Network Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="50" cy="50" r="2" fill="currentColor" />
                                <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
                                <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#network)" />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left relative z-10">

                        {/* Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-semibold mb-6 backdrop-blur-sm transition-all duration-700",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            <Sparkles className="w-4 h-4 fill-blue-500 animate-pulse" />
                            <span>Communauté active</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={cn(
                                "text-4xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Rejoignez une <br />
                            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                                communauté passionnée
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className={cn(
                                "text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Explorez des clubs dynamiques, partagez vos passions et développez vos compétences aux côtés d'étudiants motivés.
                        </p>

                        {/* Stats / Features */}
                        <div
                            className={cn(
                                "grid grid-cols-3 gap-4 w-full max-w-lg transition-all duration-700 delay-300",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            {[
                                { icon: Users, label: "Clubs actifs", value: "30+", color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: Heart, label: "Membres", value: "1.5k+", color: "text-cyan-500", bg: "bg-cyan-500/10" },
                                { icon: Award, label: "Événements", value: "100+", color: "text-teal-500", bg: "bg-teal-500/10" },
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
                        <div className="absolute top-0 right-0 w-4/5 h-full bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                            <img
                                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                                alt="Students collaborating"
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-md bg-blue-500 text-xs font-bold">ACTIF</span>
                                    <span className="text-sm font-medium opacity-90">Club Innovation</span>
                                </div>
                                <p className="text-xl font-bold">Ensemble, plus forts</p>
                            </div>
                        </div>

                        {/* Floating Card 1 (Trending) */}
                        <div className="absolute top-10 left-0 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tendance</p>
                                    <p className="text-sm font-bold">+25% cette semaine</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 2 (Members) */}
                        <div className="absolute bottom-20 left-10 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float animation-delay-2000">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Nouveaux membres</p>
                                    <p className="text-sm font-bold">Cette semaine</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
