'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { GlossyButton } from './GlossyButton'

export function ModernCTA() {
    return (
        <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-gradient-shift" />

            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

            <div className="container px-4 md:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-primary/20 text-primary text-sm font-medium animate-fade-in-up">
                        <Sparkles className="w-4 h-4" />
                        <span>Rejoignez la révolution éducative</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        Prêt à transformer votre <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            avenir professionnel ?
                        </span>
                    </h2>

                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Rejoignez plus de 5000 étudiants et mentors sur la plateforme la plus complète pour apprendre, partager et grandir.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link href="/inscription">
                            <GlossyButton variant="primary" size="lg" className="w-full sm:w-auto text-base px-8 py-4 group">
                                Commencer gratuitement
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </GlossyButton>
                        </Link>
                        <Link href="/formations">
                            <GlossyButton variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-4">
                                Voir les démos
                            </GlossyButton>
                        </Link>
                    </div>

                    <div className="pt-6 flex items-center justify-center gap-6 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Pas de carte requise
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Annulation à tout moment
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
