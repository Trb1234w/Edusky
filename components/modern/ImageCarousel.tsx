'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface CarouselImage {
    src: string
    alt: string
    title?: string
    subtitle?: string
}

interface ImageCarouselProps {
    images: CarouselImage[]
    autoPlayInterval?: number // en millisecondes
    showControls?: boolean
    showIndicators?: boolean
    className?: string
}

/**
 * ImageCarousel - Carousel d'images auto-défilant avec transitions fluides
 * 
 * @param images - Tableau d'images à afficher
 * @param autoPlayInterval - Intervalle de défilement automatique (défaut: 5000ms)
 * @param showControls - Afficher les boutons prev/next
 * @param showIndicators - Afficher les indicateurs de pagination
 */
export function ImageCarousel({
    images,
    autoPlayInterval = 5000,
    showControls = true,
    showIndicators = true,
    className,
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    // Navigation vers l'image suivante
    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }, [images.length])

    // Navigation vers l'image précédente
    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }, [images.length])

    // Navigation vers une image spécifique
    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [])

    // Auto-play (pause au hover)
    useEffect(() => {
        if (isHovered || images.length <= 1) return

        const interval = setInterval(goToNext, autoPlayInterval)
        return () => clearInterval(interval)
    }, [isHovered, goToNext, autoPlayInterval, images.length])

    if (images.length === 0) {
        return null
    }

    return (
        <div
            className={cn('relative w-full h-full group', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Images Container */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            'absolute inset-0 transition-all duration-700 ease-in-out',
                            index === currentIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                        )}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />

                        {/* Gradient overlay pour meilleure lisibilité du texte */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Texte sur l'image */}
                        {(image.title || image.subtitle) && (
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                {image.title && (
                                    <h3 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in-up">
                                        {image.title}
                                    </h3>
                                )}
                                {image.subtitle && (
                                    <p className="text-lg md:text-xl text-white/90 animate-fade-in-up animation-delay-200">
                                        {image.subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Boutons de navigation */}
            {showControls && images.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className={cn(
                            'absolute left-4 top-1/2 -translate-y-1/2 z-10',
                            'w-12 h-12 rounded-full',
                            'bg-white/10 backdrop-blur-md border border-white/20',
                            'flex items-center justify-center',
                            'text-white hover:bg-white/20',
                            'transition-all duration-300',
                            'opacity-0 group-hover:opacity-100',
                            'hover:scale-110 active:scale-95'
                        )}
                        aria-label="Image précédente"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className={cn(
                            'absolute right-4 top-1/2 -translate-y-1/2 z-10',
                            'w-12 h-12 rounded-full',
                            'bg-white/10 backdrop-blur-md border border-white/20',
                            'flex items-center justify-center',
                            'text-white hover:bg-white/20',
                            'transition-all duration-300',
                            'opacity-0 group-hover:opacity-100',
                            'hover:scale-110 active:scale-95'
                        )}
                        aria-label="Image suivante"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Indicateurs de pagination */}
            {showIndicators && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/75'
                            )}
                            aria-label={`Aller à l'image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
