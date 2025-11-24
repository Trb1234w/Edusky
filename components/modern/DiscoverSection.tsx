'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiscoverSectionProps {
    children: React.ReactNode
}

export function DiscoverSection({ children }: DiscoverSectionProps) {
    return (
        <section className="py-6 relative overflow-hidden border-y border-primary/5 bg-primary/5 backdrop-blur-sm">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-primary/5 to-background/50 -z-10" />

            {/* Decorative Blobs */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 opacity-50" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 opacity-50" />

            <div className="container px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-6 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium animate-fade-in-up">
                        <Sparkles className="w-3 h-3" />
                        <span>Explorer le catalogue</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
                        Découvrir
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                        Plongez dans un univers de connaissances et d'opportunités.
                    </p>
                </div>

                {/* Content Sliders Wrapper */}
                <div className="space-y-8">
                    {children}
                </div>
            </div>
        </section>
    )
}
