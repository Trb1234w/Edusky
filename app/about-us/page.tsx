"use client"

import { motion } from "framer-motion"
import {
    Rocket,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background overflow-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">

                    {/* HERO */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-4">
                            <Rocket className="w-4 h-4" />
                            <span>L'avenir de l'éducation est ici</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Une plateforme unique pour <br />
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                unifier tous vos potentiels
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            EduSky n'est pas seulement un site : c'est un écosystème complet incluant réseau social, formations, événements, clubs et mentorat.
                        </p>
                    </motion.div>

                    {/* IMAGE CARD */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative mt-20"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                                alt="Team working"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <div className="text-2xl font-bold mb-2">Innovation & Excellence</div>
                                <p className="text-white/80">Notre équipe d'experts est dédiée à votre réussite.</p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                    </motion.div>

                    {/* SERVICES EXPERTS */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mt-28 max-w-3xl mx-auto text-left"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-center">
                            Au-delà de la plateforme : <br />
                            <span className="text-primary">Nos Services Experts</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-10 text-center">
                            Nous mettons notre expertise à votre service pour accompagner institutions, entreprises et particuliers.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Consulting & Stratégie", desc: "Audit et conseil pour la digitalisation de l'éducation." },
                                { title: "Développement SaaS", desc: "Création de logiciels de gestion scolaire sur mesure." },
                                { title: "Recrutement Spécialisé", desc: "Chasse de tête pour les profils éducatifs et tech." },
                                { title: "Orientation Scolaire", desc: "Accompagnement personnalisé pour élèves et étudiants." }
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{service.title}</h4>
                                        <p className="text-muted-foreground">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button className="mt-10 h-12 px-8 rounded-full" variant="secondary">
                                En savoir plus sur nos services <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="py-20 bg-card border-t border-border/50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                        {/* Left */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contactez-nous</h2>
                            <p className="text-muted-foreground mb-12 text-lg">
                                Vous avez un projet ? Une question ? Notre équipe est là pour vous accompagner.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-muted-foreground">Email</div>
                                        <div className="text-lg font-bold">contact@edusky.com</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-muted-foreground">Téléphone</div>
                                        <div className="text-lg font-bold">+33 1 23 45 67 89</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-muted-foreground">Adresse</div>
                                        <div className="text-lg font-bold">Paris, France</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="bg-background p-8 rounded-3xl border border-border shadow-lg">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nom</label>
                                        <Input placeholder="Votre nom" className="bg-muted/50 border-border/50 h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Prénom</label>
                                        <Input placeholder="Votre prénom" className="bg-muted/50 border-border/50 h-12 rounded-xl" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="votre@email.com" className="bg-muted/50 border-border/50 h-12 rounded-xl" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sujet</label>
                                    <Input placeholder="De quoi voulez-vous parler ?" className="bg-muted/50 border-border/50 h-12 rounded-xl" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="Votre message..." className="bg-muted/50 border-border/50 min-h-[150px] rounded-xl resize-none" />
                                </div>

                                <Button className="w-full h-12 rounded-xl text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                                    Envoyer le message
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}
