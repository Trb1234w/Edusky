'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useState, useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  duration: string
  students: number
  rating: number
  price: string
  image: string
  is_favorited: boolean
}

export function CourseCard({
  id,
  title,
  description,
  instructor,
  category,
  level,
  duration,
  students,
  rating,
  price,
  image,
  is_favorited: initialIsFavorited,
}: CourseCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('formation', id);
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      case "Intermédiaire":
        return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
      case "Avancé":
        return "bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Link href={`/formations/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/50 hover:-translate-y-1">
        {/* Image Section with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-0 shadow-lg font-medium">
              {category}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleFavorite();
            }}
            aria-label={optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={cn(
              "h-5 w-5 transition-all",
              optimisticIsFavorited ? "fill-rose-500 text-rose-500 scale-110" : "fill-none text-white"
            )} />
          </Button>

          {/* Bottom Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-sm">{rating}</span>
              </div>
              <Badge className={cn("text-xs font-medium border", getLevelColor(level))}>
                {level}
              </Badge>
            </div>
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg px-3 py-1.5 font-bold shadow-lg">
              {price}
            </div>
          </div>
        </div>

        {/* Content Section - Reduced spacing */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Title - Unified font size */}
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description - Unified font size, reduced margin */}
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Instructor */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
            <TrendingUp size={14} className="text-primary" />
            <span className="font-medium">{instructor}</span>
          </p>

          {/* Stats - Unified font size */}
          <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="font-semibold text-foreground text-sm">{rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-primary" />
              <span className="font-semibold text-foreground text-sm">{students}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-secondary" />
              <span className="font-semibold text-foreground text-sm">{duration}</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
      </Card>
    </Link>
  )
}

CourseCard.Skeleton = function CourseCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-3 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-border">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </Card>
  )
}
