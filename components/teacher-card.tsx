import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"

interface TeacherCardProps {
  id: number
  name: string
  title: string
  specialties: string[]
  rating: number
  students: number
  courses: number
  image: string
  verified?: boolean
}

export function TeacherCard({
  id,
  name,
  title,
  specialties,
  rating,
  students,
  courses,
  image,
  verified = false,
}: TeacherCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden">
      <CardContent className="p-2 lg:p-6">
        <div className="flex items-center text-left mb-2 lg:mb-4">
          <div className="relative mr-4 lg:mr-6"> {/* Avatar with right margin */}
            <Avatar className="w-16 h-16 lg:w-24 lg:h-24 border-4 border-background shadow-lg">
              <AvatarImage src={image || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="text-lg lg:text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <CheckCircle size={12} className="text-white lg:size={16}" />
              </div>
            )}
          </div>
          <div> {/* Container for name, title, and specialties */}
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-0 lg:mb-1 group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs lg:text-sm text-muted-foreground mb-1 lg:mb-3">{title}</p>

            <div className="flex flex-wrap gap-2 mb-2 lg:mb-4">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-2 lg:mb-4 py-2 lg:py-4 border-y border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star size={12} fill="currentColor" className="lg:size={16}" />
              <span className="font-bold text-sm lg:text-base text-foreground">{rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">Note</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={12} className="text-primary lg:size={16}" />
              <span className="font-bold text-foreground">{students}</span>
            </div>
            <p className="text-xs text-muted-foreground">Étudiants</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen size={12} className="text-secondary lg:size={16}" />
              <span className="font-bold text-foreground">{courses}</span>
            </div>
            <p className="text-xs text-muted-foreground">Cours</p>
          </div>
        </div>

        <Link href={`/professeurs/${id}`}>
          <Button className="w-full font-semibold">Voir le profil</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
