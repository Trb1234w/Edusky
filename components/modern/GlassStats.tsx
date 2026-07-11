'use client'

import { Users, GraduationCap, BookOpen, Award } from 'lucide-react'


interface GlassStatsProps {
    data?: {
        students: number;
        mentors: number;
        formations: number;
        successRate: number;
    }
}

export function GlassStats({ data }: GlassStatsProps) {
    const stats = [
        { icon: Users, value: data?.students || 5000, label: "Étudiants Actifs", suffix: "+" },
        { icon: GraduationCap, value: data?.mentors || 200, label: "Mentors Experts", suffix: "+" },
        { icon: BookOpen, value: data?.formations || 150, label: "Formations", suffix: "+" },
        { icon: Award, value: data?.successRate || 98, label: "Taux de Réussite", suffix: "%" },
    ]

    return (
        <section className="py-8 md:py-12 relative">
            <div className="container px-4 md:px-8">
                <div className="relative rounded-3xl overflow-hidden p-6 md:p-10">
                    {/* Background */}
                    <div className="absolute inset-0 bg-primary/5 border border-primary/10" />

                    {/* Static Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50" />

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center shadow-sm mb-1">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                                    {stat.value}{stat.suffix}
                                </div>
                                <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
