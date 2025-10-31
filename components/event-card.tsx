import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
}: EventCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hackathon":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "Conférence":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "Compétition":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "Atelier":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "Forum":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "Exposition":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const spotsLeft = maxParticipants - participants
  const percentageFilled = maxParticipants > 0 ? (participants / maxParticipants) * 100 : 0

  return (
    <Link href={`/evenements/${id}`} className="group block h-full">
      <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2 lg:top-4 lg:left-4">
            <Badge className={getCategoryColor(category)}>{category}</Badge>
          </div>
          {status === "upcoming" && spotsLeft <= 20 && (
            <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
              <Badge variant="destructive" className="bg-red-500">
                {spotsLeft} places restantes
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
          <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1 lg:mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-4 line-clamp-2 leading-relaxed">{description}</p>

          <div className="space-y-1 lg:space-y-2 mb-2 lg:mb-4">
            <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-muted-foreground">
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} className="text-secondary" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-accent" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          <div className="mb-4 py-4 border-y border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {participants} / {maxParticipants} participants
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${percentageFilled}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-4">Organisé par {organizer}</div>

          <Button className="w-full font-semibold mt-auto">S'inscrire</Button>
        </CardContent>
      </Card>
    </Link>
  )
}

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-2 lg:p-6 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="mb-4 py-4 border-y border-border">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  )
}
