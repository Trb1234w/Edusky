'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Briefcase, CheckCircle, Award } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react" // Add Heart
import { useState, useOptimistic, useTransition } from "react" // Import hooks
import { toggleFavoriteAction } from "@/app/actions/favorites" // Import action
import { cn } from "@/lib/utils" // Assuming cn exists for conditional classnames

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
  is_favorited: boolean // Add this prop
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
  is_favorited: initialIsFavorited, // Destructure with new name
}: ProfesseurCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state // Toggle state optimistically
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('professeur', id);
    });
  };

  return (
    <Link href={`/professeurs/${id}`} className="group block h-full">
      <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-background shadow-lg">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-3xl lg:text-4xl font-bold">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {isVerified && (
            <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary">
              <CheckCircle size={14} className="mr-1" />
              Vérifié
            </Badge>
          )}
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 z-10 text-white hover:bg-white/20" // Positioning adjusted for avatar
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating to Link
              e.stopPropagation(); // Stop event propagation
              handleToggleFavorite();
            }}
            aria-label={optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={cn(
                "h-5 w-5",
                optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none text-white"
            )} />
          </Button>
        </div>

        <CardContent className="p-2 lg:p-6 flex-1 flex flex-col items-center text-center">
          <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{title}</p>

          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({students} étudiants)</span>
          </div>

          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {specialties.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {specialties.length > 3 && <Badge variant="secondary" className="text-xs">+{specialties.length - 3}</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full text-sm text-muted-foreground mb-4">
            <div className="flex items-center justify-center gap-1">
              <Briefcase size={16} className="text-primary" />
              <span>{experience} ans d'exp.</span>
            </div>
            {hasCertifications && (
              <div className="flex items-center justify-center gap-1">
                <Award size={16} className="text-green-500" />
                <span>Certifié</span>
              </div>
            )}
          </div>

          <Button className="w-full font-semibold mt-auto">Voir le profil</Button>
        </CardContent>
      </Card>
    </Link>
  )
}

ProfesseurCard.Skeleton = function ProfesseurCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <Skeleton className="h-24 w-24 lg:h-32 lg:w-32 rounded-full" />
      </div>
      <CardContent className="p-2 lg:p-6 flex-1 flex flex-col items-center text-center">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  )
}
