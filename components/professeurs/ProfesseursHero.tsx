'use client'

import { GraduationCap, Users, Award, TrendingUp, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfesseursHero() {
    return (
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 lg:py-24 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Floating Icons */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-[10%] animate-float">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                </div>
                <div className="absolute top-32 right-[15%] animate-float delay-300">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                        <Award className="text-white" size={24} />
                    </div>
                </div>
                <div className="absolute bottom-24 left-[20%] animate-float delay-700">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                        <Star className="text-white" size={24} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium text-white">Experts certifiés et passionnés</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="text-center space-y-6 animate-fade-in-up">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-4 shadow-2xl">
                            <Users size={40} className="text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                            Trouvez le{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    professeur idéal
                                </span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/30 blur-sm" />
                            </span>
                            {" "}pour vous
                        </h1>

                        {/* Description */}
                        <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                            Découvrez des experts passionnés, certifiés et expérimentés prêts à vous accompagner dans votre parcours d'apprentissage, à domicile ou en ligne.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-3xl mx-auto pt-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Users className="text-yellow-300" size={24} />
                                    <div className="text-3xl lg:text-4xl font-bold text-white">500+</div>
                                </div>
                                <div className="text-sm lg:text-base text-white/80">Professeurs</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Award className="text-green-300" size={24} />
                                    <div className="text-3xl lg:text-4xl font-bold text-white">95%</div>
                                </div>
                                <div className="text-sm lg:text-base text-white/80">Certifiés</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingUp className="text-blue-300" size={24} />
                                    <div className="text-3xl lg:text-4xl font-bold text-white">4.8</div>
                                </div>
                                <div className="text-sm lg:text-base text-white/80">Note moyenne</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Button
                                size="lg"
                                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                            >
                                Explorer les professeurs
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 backdrop-blur-sm"
                            >
                                Devenir professeur
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="currentColor" className="text-background" />
                </svg>
            </div>
        </section>
    )
}
