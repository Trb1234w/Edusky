'use client' // Add this line

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, Sparkles, Heart } from "lucide-react" // Add Heart
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useOptimistic, useTransition } from "react" // Import hooks
import { toggleFavoriteAction } from "@/app/actions/favorites" // Import action
import { cn } from "@/lib/utils" // Assuming cn exists for conditional classnames

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
  is_favorited: boolean // Add this prop
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
  is_favorited: initialIsFavorited, // Destructure with new name
}: ClubCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state // Toggle state optimistically
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('club', id);
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technologie":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "Culture":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "Business":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "Environnement":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "Arts":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400"
      case "Sport":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "Sciences":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Link href={`/clubs/${id}`} className="group block h-full">
      <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getCategoryColor(category)}>{category}</Badge>
          </div>
          {verified && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 backdrop-blur-sm text-primary">
                <CheckCircle size={14} className="mr-1" />
                Vérifié
              </Badge>
            </div>
          )}
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
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

        <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-3 leading-relaxed">{description}</p>

          <div className="mb-2 py-4 border-y border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-primary" />
              <span className="font-semibold text-foreground">{members} membres</span>
            </div>
            <div className="flex items-start gap-1">
              <Sparkles size={16} className="text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Activités</p>
                <p className="text-xs text-muted-foreground break-words">{activities}</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-2">Président: {president}</div>

          <Button className="w-full font-semibold mt-auto">Rejoindre le club</Button>
        </CardContent>
      </Card>
    </Link>
  )
}

ClubCard.Skeleton = function ClubCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="mb-2 py-4 border-y border-border">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  )
}
