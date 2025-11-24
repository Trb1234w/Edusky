'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Briefcase, CheckCircle, Award, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"

interface ProfesseurCardProps {
  id: string
  name: string
  title: string
  specialties: string[]
  rating: number
  students: number
  experience: number
  avatarUrl: string
  isVerified: boolean
  hasCertifications: boolean
  is_favorited: boolean
}

export function ProfesseurCard({
  id,
  name,
  title,
  specialties,
  rating,
  students,
  experience,
  avatarUrl,
  isVerified,
  hasCertifications,
  is_favorited: initialIsFavorited,
}: ProfesseurCardProps) {
  const router = useRouter();
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(null);
      await toggleFavoriteAction('professeur', id);
      router.refresh();
    });
  };

  return (
    <Link href={`/professeurs/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl">

        {/* Header Background */}
        <div className="h-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 relative">
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/80 border border-white/20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleFavorite();
            }}
          >
            <Heart className={cn(
              "h-4 w-4 transition-all",
              optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none text-muted-foreground"
            )} />
          </Button>
        </div>

        {/* Avatar & Main Info */}
        <div className="px-4 -mt-12 flex flex-col items-center text-center relative z-10">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-2xl font-bold">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isVerified && (
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-card shadow-sm" title="Vérifié">
                <CheckCircle size={12} className="fill-blue-500 text-white" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mt-3 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{title}</p>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full text-xs font-bold mb-3">
            <Star size={10} className="fill-amber-500" />
            {rating.toFixed(1)} <span className="text-muted-foreground font-normal">({students})</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 px-4 pb-4 flex flex-col">
          {/* Specialties */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {specialties.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/50 hover:bg-secondary/70 border-0">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 w-full text-xs text-muted-foreground mb-4 bg-muted/30 p-2 rounded-lg">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="font-bold text-foreground">{experience} ans</span>
              <span>Expérience</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 border-l border-border/50">
              {hasCertifications ? (
                <>
                  <span className="font-bold text-green-600 flex items-center gap-1"><Award size={10} /> Oui</span>
                  <span>Certifié</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-foreground">-</span>
                  <span>Certifié</span>
                </>
              )}
            </div>
          </div>

          <Button size="sm" className="w-full rounded-full text-sm font-medium mt-auto">
            Voir le profil
          </Button>
        </div>
      </Card>
    </Link>
  )
}

ProfesseurCard.Skeleton = function ProfesseurCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      <div className="h-24 bg-muted" />
      <div className="px-4 -mt-12 flex flex-col items-center mb-4">
        <Skeleton className="h-24 w-24 rounded-full border-4 border-card" />
        <Skeleton className="h-6 w-32 mt-3 mb-1" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <div className="flex justify-center gap-1 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-12 w-full mb-4 rounded-lg" />
        <Skeleton className="h-9 w-full mt-auto" />
      </div>
    </Card>
  )
}
