'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"

interface EventCardProps {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  participants: number
  maxParticipants: number
  organizer: string
  image: string
  status: string
  is_favorited: boolean
}

export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  category,
  participants,
  maxParticipants,
  organizer,
  image,
  status,
  is_favorited: initialIsFavorited,
}: EventCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('evenement', id);
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hackathon":
        return "from-purple-500 to-purple-600"
      case "Conférence":
        return "from-blue-500 to-blue-600"
      case "Compétition":
        return "from-red-500 to-red-600"
      case "Atelier":
        return "from-green-500 to-green-600"
      case "Forum":
        return "from-orange-500 to-orange-600"
      case "Exposition":
        return "from-pink-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const spotsLeft = maxParticipants - participants
  const percentageFilled = maxParticipants > 0 ? (participants / maxParticipants) * 100 : 0

  // Parse date for creative display
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()

  return (
    <Link href={`/evenements/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/50 hover:-translate-y-1">

        {/* Top Section - Date Display with Image */}
        <div className="relative flex-shrink-0">
          {/* Date Calendar */}
          <div className={cn(
            "relative w-full h-24 bg-gradient-to-br",
            getCategoryColor(category),
            "flex items-center justify-between px-4 text-white"
          )}>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="opacity-70" />
              <div className="text-center">
                <div className="text-4xl font-black leading-none">{day}</div>
                <div className="text-sm font-bold tracking-wider">{month}</div>
              </div>
            </div>

            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-xs font-semibold">
              {category}
            </Badge>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 border border-white/20"
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
          </div>

          {/* Image Below Date */}
          <div className="relative h-32 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Status Badge on Image */}
            {status === "upcoming" && spotsLeft <= 20 && spotsLeft > 0 && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="destructive" className="text-xs font-semibold">
                  {spotsLeft} places
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col p-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} className="text-primary flex-shrink-0" />
              <span className="font-medium">{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span className="font-medium line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Participants Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {participants}/{maxParticipants}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(percentageFilled)}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full bg-gradient-to-r transition-all", getCategoryColor(category))}
                style={{ width: `${percentageFilled}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground font-medium">{organizer}</span>
            </div>
            <Button size="sm" className="text-xs font-semibold px-4">
              S'inscrire
            </Button>
          </div>
        </div>

        {/* Hover Effect Glow */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r",
          getCategoryColor(category),
          "mix-blend-overlay"
        )} style={{ opacity: 0.05 }} />
      </Card>
    </Link>
  )
}

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-32" />
      <div className="flex-1 p-3 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-1.5 w-full mb-3" />
        <div className="flex items-center justify-between mt-auto pt-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  )
}
