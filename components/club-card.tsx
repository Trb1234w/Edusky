'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, ArrowRight, Heart, MapPin, Calendar, Wallet } from "lucide-react"
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
  prix_inscription?: number
  cotisation_mensuelle?: number
  lieu?: string
  pays_nom?: string
  ville_nom?: string
  quartier_nom?: string
  age_min?: number
  age_max?: number
  onToggle?: (newStatus: boolean) => void
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
  prix_inscription,
  cotisation_mensuelle,
  lieu,
  pays_nom,
  ville_nom,
  quartier_nom,
  age_min,
  age_max,
  onToggle,
}: ClubCardProps) {
  const router = useRouter();
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    const newStatus = !optimisticIsFavorited;
    startTransition(async () => {
      addOptimisticFavorite(null);
      if (onToggle) {
        onToggle(newStatus);
      }
      await toggleFavoriteAction('club', id);
    });
  };

  const ageRange = age_min && age_max ? `${age_min}-${age_max} ans` : age_min ? `+${age_min} ans` : age_max ? `-${age_max} ans` : null;
  const fullLocation = [lieu, quartier_nom, ville_nom, pays_nom].filter(Boolean).join(', ');

  const formatPrice = (price: number | undefined, label: string) => {
    if (price == null) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wallet size={14} className="text-primary shrink-0" />
        <span>{label}: <span className="font-semibold text-foreground">{price.toLocaleString()} GNF</span></span>
      </div>
    )
  }

  return (
    <Link href={`/clubs/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl mb-2 lg:mb-3">

        {/* Image Section */}
        <div className="relative h-36 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground border-0 shadow-sm">
            {category}
          </Badge>

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

        <div className="flex-1 p-3 flex flex-col">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-3">
            {fullLocation && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="truncate">{fullLocation}</span>
              </div>
            )}
            {ageRange && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-primary shrink-0" />
                <span>{ageRange}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {formatPrice(prix_inscription, "Inscription")}
              {formatPrice(cotisation_mensuelle, "Prix mensuel")}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
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
      </Card >
    </Link >
  )
}
