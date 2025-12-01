'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
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
  tags?: string[]
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
  tags,
}: BlogCardProps) {
  const router = useRouter();
  const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
    initialIsFavorited,
    (state) => !state
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      addOptimisticFavorite(null);
      await toggleFavoriteAction('article', id);
      router.refresh();
    });
  };

  return (
    <Link href={`/blog/${id}`} className="group block h-full">
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
              "h-5 w-5",
              optimisticIsFavorited ? "fill-red-500 text-red-500" : "text-white"
            )} />
          </Button>
        </div>

        <div className="flex-1 p-2 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground truncate">{authorRole}</p>
            </div>
            <Badge variant="secondary" className="text-xs font-normal bg-secondary/50 hover:bg-secondary/70">
              {category}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>

          <p className="text-base text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{views}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle size={16} />
                <span>{comments}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-primary font-medium group/read">
              <span>Lire</span>
              <ArrowRight size={16} className="transition-transform group-hover/read:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

BlogCard.Skeleton = function BlogCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-6 h-6 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2 w-10" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </Card>
  )
}
