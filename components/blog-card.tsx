import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
}: BlogCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Éducation":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "Conseils":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "Carrière":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "Technologie":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
      case "International":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "Entrepreneuriat":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (featured) {
    return (
      <Link href={`/blog/${id}`} className="group block h-full">
        <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden flex-shrink-0 w-96 sm:w-[calc(50vw-theme(spacing.8))] lg:w-auto">
          <div className="grid grid-cols-2 gap-0">
            <div className="relative h-64 lg:h-full overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundImage: `url('${image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className={getCategoryColor(category)}>{category}</Badge>
              </div>
            </div>

            <CardContent className="p-1 lg:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-3 leading-relaxed">{excerpt}</p>

                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authorAvatar || "/placeholder.svg"} alt={author} />
                    <AvatarFallback>{author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{author}</p>
                    <p className="text-xs text-muted-foreground">{authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-primary" />
                    <span>{readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={16} className="text-secondary" />
                    <span>{views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-accent" />
                    <span>{likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} className="text-primary" />
                    <span>{comments}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full font-semibold">Lire l'article</Button>
            </CardContent>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className={getCategoryColor(category)}>{category}</Badge>
          </div>
        </div>

        <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-3 leading-relaxed">{excerpt}</p>

          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border">
            <Avatar className="w-8 h-8">
              <AvatarImage src={authorAvatar || "/placeholder.svg"} alt={author} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground truncate">{authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-primary" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} className="text-secondary" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-accent" />
              <span>{likes}</span>
            </div>
          </div>

          <Button className="w-full font-semibold mt-auto">Lire l'article</Button>
        </CardContent>
      </Card>
    </Link>
  )
}

BlogCard.Skeleton = function BlogCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  )
}
