'use client'

import { UserPlus, Search, CalendarCheck, Award } from 'lucide-react'

const steps = [
    {
        icon: UserPlus,
        title: "Créez votre profil",
        description: "Inscrivez-vous gratuitement et personnalisez vos préférences d'apprentissage."
    },
    {
        icon: Search,
        title: "Trouvez votre voie",
        description: "Explorez nos formations, mentors et clubs adaptés à vos objectifs."
    },
    {
        icon: CalendarCheck,
        title: "Apprenez à votre rythme",
        description: "Suivez des cours, participez à des événements et échangez avec la communauté."
    },
    {
        icon: Award,
        title: "Réussissez",
        description: "Obtenez des certifications et boostez votre carrière professionnelle."
    }
]

export function HowItWorks() {
    return (
        <section className="py-12 md:py-20">
            <div className="container px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Comment ça marche ?</h2>
                    <p className="text-muted-foreground text-base md:text-lg">Votre parcours vers la réussite en 4 étapes simples.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/50 group-hover:shadow-primary/20 group-hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <step.icon className="w-8 h-8 text-primary" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs border-2 border-background">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
