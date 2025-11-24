'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const testimonials = [
    {
        content: "Edusky a complètement transformé ma façon d'apprendre. Le suivi par IA est bluffant de précision.",
        author: "Sarah M.",
        role: "Étudiante en Informatique",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        rating: 5
    },
    {
        content: "En tant que mentor, j'ai enfin trouvé une plateforme qui valorise mon expertise et facilite le contact.",
        author: "Dr. Thomas L.",
        role: "Professeur de Mathématiques",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 5
    },
    {
        content: "Les clubs de révision m'ont permis de rencontrer des gens passionnés et de réussir mes examens.",
        author: "Léa K.",
        role: "Étudiante en Droit",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        rating: 5
    }
]

export function Testimonials() {
    return (
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="container px-4 md:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Ils nous font confiance</h2>
                    <p className="text-muted-foreground text-base md:text-lg">Découvrez les retours de notre communauté grandissante.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <Quote className="absolute top-5 right-5 w-6 h-6 text-primary/10 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="text-foreground/80 mb-5 leading-relaxed text-sm md:text-base">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-foreground">{testimonial.author}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
