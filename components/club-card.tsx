'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, Sparkles, Heart, Award } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"

interface ClubCardProps {
  id: string
  name: string
  description: string
  category: string
  members: number
  activities: string
  president: string
  image: string
  verified?: boolean
  is_favorited: boolean
}

export function ClubCard({
  id,
  name,
  description,
  category,
  members,
  activities,
  president,
  image,
  verified = false,
  is_favorited: initialIsFavorited,
}: ClubCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('club', id);
    });
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Technologie":
        return "from-blue-500 via-blue-600 to-cyan-600"
      case "Culture":
        return "from-purple-500 via-purple-600 to-pink-600"
      case "Business":
        return "from-green-500 via-green-600 to-emerald-600"
      case "Environnement":
        return "from-emerald-500 via-teal-600 to-green-600"
      case "Arts":
        return "from-pink-500 via-rose-600 to-red-600"
      case "Sport":
        return "from-orange-500 via-orange-600 to-amber-600"
      case "Sciences":
        return "from-cyan-500 via-blue-600 to-indigo-600"
      default:
        return "from-gray-500 via-gray-600 to-slate-600"
    }
  }

  return (
    <Link href={`/clubs/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/50 hover:-translate-y-1">

        {/* Diagonal Gradient Strip */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br",
          getCategoryGradient(category),
          "transform rotate-45 translate-x-16 -translate-y-16 opacity-20 group-hover:opacity-30 transition-opacity"
        )} />

        {/* Image Section - Smaller, circular crop */}
        <div className="relative p-4 pb-0">
          <div className="relative w-full h-40 rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-40",
              getCategoryGradient(category)
            )} />

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleFavorite();
              }}
              aria-label={optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={cn(
                "h-4 w-4 transition-all",
                optimisticIsFavorited ? "fill-white text-white scale-110" : "fill-none text-white"
              )} />
            </Button>

            {/* Members Badge - Overlapping */}
            <div className="absolute -bottom-3 left-4">
              <Badge className={cn(
                "bg-gradient-to-r text-white border-0 shadow-lg px-3 py-1.5",
                getCategoryGradient(category)
              )}>
                <Users size={14} className="mr-1.5" />
                <span className="font-bold">{members}</span>
              </Badge>
            </div>

            {/* Verified Badge */}
            {verified && (
              <div className="absolute -bottom-3 right-4">
                <Badge className="bg-white text-primary border-0 shadow-lg px-2.5 py-1.5">
                  <CheckCircle size={14} className="mr-1" />
                  <span className="font-semibold text-xs">Vérifié</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4 pt-5">
          {/* Category Badge */}
          <Badge className={cn(
            "w-fit mb-2 bg-gradient-to-r text-white border-0 text-xs font-semibold",
            getCategoryGradient(category)
          )}>
            {category}
          </Badge>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Activities with Icon */}
          <div className="flex items-start gap-2 mb-3 p-3 bg-muted/50 rounded-lg">
            <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground mb-1">Activités principales</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{activities}</p>
            </div>
          </div>

          {/* President */}
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <Award size={14} className="text-primary" />
            <span className="font-medium">Président: {president}</span>
          </div>

          {/* Action Button */}
          <Button className={cn(
            "w-full font-semibold mt-auto bg-gradient-to-r text-white border-0 shadow-md hover:shadow-lg transition-all",
            getCategoryGradient(category)
          )}>
            Rejoindre le club
          </Button>
        </div>

        {/* Hover Glow Effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br",
          getCategoryGradient(category),
          "mix-blend-overlay"
        )} style={{ opacity: 0.03 }} />
      </Card>
    </Link>
  )
}

ClubCard.Skeleton = function ClubCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="p-4 pb-0">
        <Skeleton className="w-full h-40 rounded-2xl" />
      </div>
      <div className="flex-1 p-4 pt-5 flex flex-col">
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <Skeleton className="h-16 w-full mb-3 rounded-lg" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </Card>
  )
}
