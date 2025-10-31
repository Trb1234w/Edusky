"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, GraduationCap, Calendar, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const slides = [
  {
    title: "Découvrez les meilleurs professeurs",
    description:
      "Connectez-vous avec des enseignants qualifiés et des mentors expérimentés pour atteindre vos objectifs éducatifs.",
    cta: "Explorer les professeurs",
    href: "/professeurs",
    icon: GraduationCap,
    gradient: "from-primary via-secondary to-accent",
  },
  {
    title: "Formations de qualité",
    description:
      "Accédez à des formations variées adaptées à tous les niveaux. Développez vos compétences et excellez dans votre domaine.",
    cta: "Voir les formations",
    href: "/formations",
    icon: BookOpen,
    gradient: "from-secondary via-accent to-primary",
  },
  {
    title: "Événements éducatifs",
    description:
      "Participez à des hackathons, conférences et concours. Élargissez votre réseau et vivez des expériences enrichissantes.",
    cta: "Découvrir les événements",
    href: "/evenements",
    icon: Calendar,
    gradient: "from-accent via-primary to-secondary",
  },
  {
    title: "Rejoignez notre communauté",
    description:
      "Intégrez des clubs, partagez vos idées et collaborez avec d'autres passionnés d'éducation à travers la Guinée.",
    cta: "Explorer les clubs",
    href: "/clubs",
    icon: Users,
    gradient: "from-primary via-accent to-secondary",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => {
        const Icon = slide.icon
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90`} />
            <div className="absolute inset-0 bg-[url('/abstract-modern-education-pattern.jpg')] bg-cover bg-center opacity-10" />

            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 lg:px-8">
              <div className="mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                <Icon size={48} className="text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 max-w-4xl text-balance">
                {slide.title}
              </h1>
              <p className="text-base lg:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed text-pretty">
                {slide.description}
              </p>
              <Link href={slide.href}>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold text-base lg:text-lg px-8 py-6 rounded-xl shadow-lg"
                >
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
        aria-label="Slide suivant"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
