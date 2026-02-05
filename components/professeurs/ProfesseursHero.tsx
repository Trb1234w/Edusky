'use client'

import { GraduationCap, Users, Award, TrendingUp, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfessionalInquiryDialog } from '@/components/professional-inquiry-dialog'

export function ProfesseursHero() {
    return (
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 pt-8 pb-8 lg:pt-10 lg:pb-10 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left Content */}
                    <div className="space-y-3">
                        {/* Badge */}
                        <div className="flex justify-start animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 transition-all duration-700">
                                <Sparkles size={14} className="text-yellow-300" />
                                <span className="text-xs font-medium text-white">Experts certifiés</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                            Trouvez l'{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    expert idéal
                                </span>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-xl transition-all duration-700 delay-200">
                            Découvrez des experts passionnés prêts à vous accompagner.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 w-full max-w-lg transition-all duration-700 delay-300">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="text-xl lg:text-2xl font-bold text-white text-center">500+</div>
                                <div className="text-[10px] text-white/80 text-center uppercase tracking-wider font-semibold">Experts</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="text-xl lg:text-2xl font-bold text-white text-center">95%</div>
                                <div className="text-[10px] text-white/80 text-center uppercase tracking-wider font-semibold">Certifiés</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div className="text-xl lg:text-2xl font-bold text-white text-center">4.8</div>
                                <div className="text-[10px] text-white/80 text-center uppercase tracking-wider font-semibold">Note</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-3 lg:h-10 w-full">
                            <Button
                                size="sm"
                                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 shadow-2xl transition-all duration-300 hover:scale-105 h-10"
                            >
                                Explorer
                            </Button>
                            <ProfessionalInquiryDialog
                                inquiryType="devenir_expert"
                                dialogTitle="Devenir un expert"
                                dialogDescription="Partagez votre passion."
                                triggerButton={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 backdrop-blur-sm h-10"
                                    >
                                        Devenir expert
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Image Container */}
                    <div className="hidden lg:block relative h-[280px]">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden transform -rotate-3 hover:translate-x-2 transition-all duration-700">
                            {/* Content Grid */}
                            <div className="grid grid-cols-2 h-full gap-2 p-2">
                                <div className="relative rounded-2xl overflow-hidden h-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1544717297-f86234f96420?w=400&q=80"
                                        alt="Professional teaching"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="grid grid-rows-2 gap-2 h-full">
                                    <div className="relative rounded-2xl overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80"
                                            alt="Working together"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80"
                                            alt="Online class"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction UI */}
                        <div className="absolute -bottom-4 right-8 bg-white p-3 rounded-2xl shadow-2xl animate-float">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="Expert" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="fill-current" size={12} />
                                    <span className="text-slate-900 text-[10px] font-bold">4.8 (2k+)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
