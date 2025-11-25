'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Feather, Lightbulb, TrendingUp, Eye, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BlogHero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-500/5" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 animate-pulse animation-delay-2000" />

                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left relative z-10">

                        {/* Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-sm font-semibold mb-6 backdrop-blur-sm transition-all duration-700",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            <Lightbulb className="w-4 h-4 fill-purple-500 animate-pulse" />
                            <span>Inspiration quotidienne</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={cn(
                                "text-4xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Explorez, apprenez, <br />
                            <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                                grandissez
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className={cn(
                                "text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Découvrez des articles, conseils et ressources pour enrichir votre parcours éducatif et professionnel.
                        </p>

                        {/* Stats / Features */}
                        <div
                            className={cn(
                                "grid grid-cols-3 gap-4 w-full max-w-lg transition-all duration-700 delay-300",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            {[
                                { icon: BookOpen, label: "Articles", value: "200+", color: "text-purple-500", bg: "bg-purple-500/10" },
                                { icon: Eye, label: "Lectures", value: "50k+", color: "text-indigo-500", bg: "bg-indigo-500/10" },
                                { icon: Feather, label: "Auteurs", value: "25+", color: "text-violet-500", bg: "bg-violet-500/10" },
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
                        <div className="absolute top-0 right-0 w-4/5 h-full bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5" />
                            <img
                                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80"
                                alt="Reading and learning"
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-md bg-purple-500 text-xs font-bold">NOUVEAU</span>
                                    <span className="text-sm font-medium opacity-90">Article du jour</span>
                                </div>
                                <p className="text-xl font-bold">Cultivez votre savoir</p>
                            </div>
                        </div>

                        {/* Floating Card 1 (Trending Article) */}
                        <div className="absolute top-10 left-0 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tendance</p>
                                    <p className="text-sm font-bold">Article populaire</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 2 (Engagement) */}
                        <div className="absolute bottom-20 left-10 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 animate-float animation-delay-2000">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Engagement</p>
                                    <p className="text-sm font-bold">+500 likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
