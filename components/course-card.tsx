'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Heart, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
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
  language?: string
  certificate?: boolean
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
  language,
  certificate,
}: CourseCardProps) {
  const router = useRouter();
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(null);
      await toggleFavoriteAction('formation', id);
      router.refresh();
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
      <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl mb-2 lg:mb-3">

        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground border-0 shadow-sm">
            {category}
          </Badge>

          {/* Level Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-white/20">
              {level}
            </Badge>
          </div>

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
          >
            <Heart className={cn(
              "h-4 w-4 transition-all",
              optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none"
            )} />
          </Button>
        </div>

        <div className="p-2 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1.5">
            <div className="flex gap-1">
              {language && (
                <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-primary/20 bg-primary/5 text-primary">
                  {language.substring(0, 2).toUpperCase()}
                </Badge>
              )}
              {certificate && (
                <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-green-500/20 bg-green-500/5 text-green-600">
                  Certifiant
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600">{rating}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            Par <span className="font-medium text-foreground">{instructor}</span>
          </p>

          <div className="mt-auto pt-2 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={14} className="text-primary" />
                <span>{students}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-primary" />
                <span>{duration}</span>
              </div>
            </div>
            <span className="text-base font-bold text-primary">{price}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

CourseCard.Skeleton = function CourseCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex justify-between mt-auto pt-3 border-t border-border/50">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  )
}
