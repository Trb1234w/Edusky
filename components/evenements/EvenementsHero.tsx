'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, MapPin, Clock, ArrowRight, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProfessionalInquiryDialog } from '@/components/professional-inquiry-dialog'

export function EvenementsHero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative pt-8 pb-8 lg:pt-10 lg:pb-10 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-500/5" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 animate-pulse animation-delay-2000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left relative z-10 space-y-3">

                        {/* Badge */}
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold backdrop-blur-sm transition-all duration-700",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            <span>En ce moment</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={cn(
                                "text-3xl lg:text-5xl font-bold tracking-tight transition-all duration-700 delay-100",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Vivez des expériences <br />
                            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                                inoubliables
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className={cn(
                                "text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed transition-all duration-700 delay-200",
                                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            )}
                        >
                            Rejoignez la communauté et participez aux événements de demain.
                        </p>

                        {/* Stats / Features */}
                        <div
                            className={cn(
                                "grid grid-cols-3 gap-3 w-full max-w-lg transition-all duration-700 delay-300",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            {[
                                { icon: Calendar, label: "Événements", value: "50+", color: "text-orange-500", bg: "bg-orange-500/10" },
                                { icon: Users, label: "Participants", value: "2k+", color: "text-red-500", bg: "bg-red-500/10" },
                                { icon: MapPin, label: "Lieux", value: "10+", color: "text-pink-500", bg: "bg-pink-500/10" },
                            ].map((stat, index) => (
                                <div key={index} className="flex flex-col items-center p-2 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-transform group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                                    </div>
                                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                                    <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-3 lg:h-10 w-full">
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-2xl transition-all duration-300 hover:scale-105 h-10"
                            >
                                Explorer
                            </Button>
                            <ProfessionalInquiryDialog
                                inquiryType="sponsor_evenement"
                                dialogTitle="Sponsoriser un événement"
                                dialogDescription="Vous souhaitez associer votre marque ?"
                                triggerButton={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-2 border-primary text-primary hover:bg-primary/10 font-semibold px-6 backdrop-blur-sm h-10"
                                    >
                                        Sponsoriser
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Column: Image Composition */}
                    <div
                        className={cn(
                            "relative hidden lg:block h-[280px] transition-all duration-1000 delay-300",
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                        )}
                    >
                        {/* Main Image Card */}
                        <div className="absolute top-0 right-0 w-3/4 h-full bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
                            <img
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                                alt="Conference event"
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <div className="flex items-center gap-1.5 mb-1 text-[8px] font-bold">
                                    <span className="px-1.5 py-0.5 rounded bg-orange-500">LIVE</span>
                                    <span className="opacity-90">Tech Summit</span>
                                </div>
                                <p className="text-base font-bold leading-tight">L'innovation commence ici</p>
                            </div>
                        </div>

                        {/* Floating Card 1 (Date) */}
                        <div className="absolute top-6 left-0 bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-border/50 animate-float">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex flex-col items-center justify-center text-orange-500 font-bold leading-none">
                                    <span className="text-[8px] uppercase">Nov</span>
                                    <span className="text-base">24</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Prochain event</p>
                                    <p className="text-xs font-bold">Hackathon IA</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 2 (Participants) */}
                        <div className="absolute bottom-12 left-6 bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-border/50 animate-float animation-delay-2000">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1.5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Participants</p>
                                    <p className="text-xs font-bold">+150 inscrits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
