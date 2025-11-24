'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter();
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(null);
      await toggleFavoriteAction('club', id);
      router.refresh();
    });
  };

  return (
    <Link href={`/clubs/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl">

        {/* Image Section */}
        <div className="relative h-36 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground border-0 shadow-sm">
            {category}
          </Badge>

          {/* Verified Badge */}
          {verified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Vérifié
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/10 text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleFavorite();
            }}
            aria-label={optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={cn(
              "h-4 w-4 transition-all",
              optimisticIsFavorited ? "fill-red-500 text-red-500" : "text-white"
            )} />
          </Button>
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{category}</p>
            </div>
            {verified && (
              <div className="bg-blue-500/10 p-1.5 rounded-full" title="Club vérifié">
                <CheckCircle size={16} className="text-blue-500" />
              </div>
            )}
          </div>

          <p className="text-base text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} className="text-primary" />
              <span className="font-medium">{members} membres</span>
            </div>
            <Button size="sm" variant="ghost" className="h-9 px-0 hover:bg-transparent hover:text-primary group/btn text-sm font-semibold">
              Rejoindre
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}

ClubCard.Skeleton = function ClubCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      <Skeleton className="h-36 w-full" />
      <div className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-16 w-full mb-4" />
        <div className="flex justify-between mt-auto pt-3 border-t border-border/50">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  )
}
