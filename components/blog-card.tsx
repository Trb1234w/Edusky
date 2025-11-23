'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  authorAvatar: string
  category: string
  date: string
  readTime: string
  image: string
  views: number
  likes: number
  comments: number
  featured?: boolean
  is_favorited: boolean
}

export function BlogCard({
  id,
  title,
  excerpt,
  author,
  authorRole,
  authorAvatar,
  category,
  date,
  readTime,
  image,
  views,
  likes,
  comments,
  featured = false,
  is_favorited: initialIsFavorited,
}: BlogCardProps) {
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(initialIsFavorited);
      await toggleFavoriteAction('article', id);
    });
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "Éducation":
        return "from-blue-500 to-blue-600"
      case "Conseils":
        return "from-green-500 to-green-600"
      case "Carrière":
        return "from-purple-500 to-purple-600"
      case "Technologie":
        return "from-cyan-500 to-cyan-600"
      case "International":
        return "from-orange-500 to-orange-600"
      case "Entrepreneuriat":
        return "from-pink-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/50 hover:-translate-y-1">

        {/* Left Color Strip */}
        <div className={cn(
          "w-2 flex-shrink-0 bg-gradient-to-b",
          getCategoryGradient(category)
        )} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Image Section */}
          <div className="relative h-44 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category Badge - Top Left */}
            <div className="absolute top-3 left-3">
              <Badge className={cn(
                "bg-gradient-to-r text-white border-0 shadow-lg font-semibold",
                getCategoryGradient(category)
              )}>
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
                "h-4 w-4 transition-all",
                optimisticIsFavorited ? "fill-white text-white scale-110" : "fill-none text-white"
              )} />
            </Button>

            {/* Stats Overlay - Bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-white">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1">
                <Eye size={12} />
                <span className="text-xs font-semibold">{views}</span>
              </div>
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1">
                <Heart size={12} />
                <span className="text-xs font-semibold">{likes}</span>
              </div>
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1">
                <MessageCircle size={12} />
                <span className="text-xs font-semibold">{comments}</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-3">
            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>

            {/* Author Section */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
              <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                <AvatarImage src={authorAvatar || "/placeholder.svg"} alt={author} />
                <AvatarFallback className="text-xs">{author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{author}</p>
                <p className="text-xs text-muted-foreground truncate">{authorRole}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={14} className="text-primary" />
                <span className="font-medium">{readTime}</span>
              </div>
              <Button size="sm" className={cn(
                "text-xs font-semibold px-4 bg-gradient-to-r text-white border-0",
                getCategoryGradient(category)
              )}>
                Lire
              </Button>
            </div>
          </div>
        </div>

        {/* Trending Indicator (optional, for featured) */}
        {featured && (
          <div className="absolute top-0 right-0">
            <div className={cn(
              "bg-gradient-to-br text-white px-3 py-1 rounded-bl-lg shadow-lg flex items-center gap-1",
              getCategoryGradient(category)
            )}>
              <TrendingUp size={14} />
              <span className="text-xs font-bold">Tendance</span>
            </div>
          </div>
        )}

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

BlogCard.Skeleton = function BlogCardSkeleton() {
  return (
    <Card className="h-full flex overflow-hidden">
      <div className="w-2 bg-gray-300" />
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-44 w-full" />
        <div className="flex-1 p-3 flex flex-col">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-3" />
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </Card>
  )
}
