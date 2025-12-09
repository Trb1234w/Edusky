'use client'

import { GraduationCap, Users, Award, TrendingUp, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfesseursHero() {
    return (
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 lg:py-16 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Floating Icons */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 left-[10%] animate-float">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                        <GraduationCap className="text-white" size={20} />
                    </div>
                </div>
                <div className="absolute top-24 right-[15%] animate-float delay-300">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                        <Award className="text-white" size={20} />
                    </div>
                </div>
                <div className="absolute bottom-16 left-[20%] animate-float delay-700">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                        <Star className="text-white" size={20} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        {/* Badge */}
                        <div className="flex justify-start animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                <Sparkles size={16} className="text-yellow-300" />
                                <span className="text-sm font-medium text-white">Experts certifiés et passionnés</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                            Trouvez l'{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    expert idéal
                                </span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/30 blur-sm" />
                            </span>
                            {" "}pour vous
                        </h1>

                        {/* Description */}
                        <p className="text-base lg:text-lg text-white/90 leading-relaxed">
                            Découvrez des experts passionnés, certifiés et expérimentés prêts à vous accompagner dans votre parcours d'apprentissage, à domicile ou en ligne.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="text-yellow-300" size={18} />
                                    <div className="text-2xl lg:text-3xl font-bold text-white">500+</div>
                                </div>
                                <div className="text-xs lg:text-sm text-white/80 text-center">Experts</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Award className="text-green-300" size={18} />
                                    <div className="text-2xl lg:text-3xl font-bold text-white">95%</div>
                                </div>
                                <div className="text-xs lg:text-sm text-white/80 text-center">Certifiés</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp className="text-blue-300" size={18} />
                                    <div className="text-2xl lg:text-3xl font-bold text-white">4.8</div>
                                </div>
                                <div className="text-xs lg:text-sm text-white/80 text-center">Note moyenne</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
                            <Button
                                size="lg"
                                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                            >
                                Explorer les experts
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 backdrop-blur-sm"
                            >
                                Devenir expert
                            </Button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="hidden lg:block relative">
                        <div className="relative animate-fade-in-up animation-delay-300">
                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl" />

                            {/* Main Image Container */}
                            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                                <div className="aspect-[4/5] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=750&fit=crop&q=80"
                                        alt="Professeurs enseignant"
                                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                                    />
                                </div>

                                {/* Floating Badge on Image */}
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                            <Users className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">10k+</div>
                                            <div className="text-xs text-gray-600">Étudiants formés</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 0L60 8C120 16 240 32 360 37.3C480 43 600 37 720 34.7C840 32 960 32 1080 37.3C1200 43 1320 53 1380 58.7L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z" fill="currentColor" className="text-background" />
                </svg>
            </div>
        </section>
    )
}
