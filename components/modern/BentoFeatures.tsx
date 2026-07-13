'use client'

import { BookOpen, Calendar, Sparkles, Newspaper, TrendingUp, ArrowRight, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const features = [
    {
        icon: BookOpen,
        title: "Formations Certifiantes",
        description: "Des parcours complets reconnus par les entreprises dans tous les domaines.",
        href: "/formations",
        cta: "Explorer",
        className: "md:col-span-2 md:row-span-2",
        gradient: "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30"
    },

    {
        icon: Briefcase,
        title: "Nos Services",
        description: "Solutions sur mesure pour projets EdTech.",
        href: "/services",
        cta: "Découvrir",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30"
    },
    {
        icon: Newspaper,
        title: "Blog & Actualités",
        description: "Conseils, actualités et opportunités pour réussir.",
        href: "/blog",
        cta: "Lire",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30"
    }
]

export function BentoFeatures() {
    return (
        <section className="py-10 md:py-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

            <div className="container px-4 md:px-8">
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                        <span>Tout ce dont vous avez besoin</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Un écosystème complet
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Une suite d'outils puissants conçus pour accélérer votre apprentissage et booster votre carrière.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(160px,auto)]">
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            href={feature.href}
                            className={cn(
                                "group relative p-5 md:p-6 rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                                "bg-gradient-to-br backdrop-blur-sm",
                                feature.gradient,
                                feature.className
                            )}
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-background/50 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <feature.icon className="w-5 h-5 text-foreground" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-1 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground/80 font-medium text-sm">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    {feature.cta}
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>

                            {/* Decorative Gradient Blob */}
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
