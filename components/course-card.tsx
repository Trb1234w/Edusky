import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "Intermédiaire":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "Avancé":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Link href={`/formations/${id}`} className="group block h-full">
      <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2 flex gap-1 lg:top-4 lg:left-4 lg:gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {category}
            </Badge>
            <Badge className={getLevelColor(level)}>{level}</Badge>
          </div>
          <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm flex items-center gap-1 text-blue-500">
              <BookOpen size={12} />
              <span>{instructor}</span>
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-1 lg:px-3 py-0.5 lg:py-1.5 font-bold text-primary">{price}</div>
          </div>
        </div>

        <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
          <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1 lg:mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-4 line-clamp-2 leading-relaxed">{description}</p>


          <div className="grid grid-cols-3 gap-1 lg:gap-3 mt-auto py-2 lg:py-4 border-y border-border">
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-yellow-500 lg:size={16}" fill="currentColor" />
              <span className="font-semibold text-foreground text-xs lg:text-sm">{rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-primary lg:size={16}" />
              <span className="font-semibold text-foreground text-sm">{students}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-secondary lg:size={16}" />
              <span className="font-semibold text-foreground text-sm">{duration}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

CourseCard.Skeleton = function CourseCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="grid grid-cols-3 gap-1 lg:gap-3 mb-2 lg:mb-4 py-2 lg:py-4 border-y border-border">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  )
}
