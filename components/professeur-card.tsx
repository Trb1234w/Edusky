'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Award, MapPin, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProfesseurCardProps {
  id: string
  full_name: string
  avatar_url: string
  titre: string
  type?: string
  specialites: string[]
  note_moyenne: number
  nb_etudiants_formes: number
  annees_experience?: number
  tarif_indicatif?: number
  is_verified?: boolean
  pays_nom?: string
  ville_nom?: string
}

export function ProfesseurCard({
  id,
  full_name,
  avatar_url,
  titre,
  type,
  specialites,
  note_moyenne,
  nb_etudiants_formes,
  annees_experience,
  tarif_indicatif,
  is_verified,
  pays_nom,
  ville_nom,
}: ProfesseurCardProps) {

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "en_ligne":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
      case "a_domicile":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
      case "mentor":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
      case "coach":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30"
      case "tuteur":
        return "bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "en_ligne":
        return "En ligne"
      case "a_domicile":
        return "À domicile"
      case "mentor":
        return "Mentor"
      case "coach":
        return "Coach"
      case "tuteur":
        return "Tuteur"
      default:
        return type || "Professeur"
    }
  }

  const formatTarif = (tarif?: number) => {
    if (!tarif) return null
    if (tarif === 0) return "Gratuit"
    return `${tarif.toLocaleString('fr-GN')} GNF`
  }

  return (
    <Link href={`/professeurs/${id}`} className="group block h-full">
      <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl mb-2 lg:mb-3">

        {/* Header avec Avatar et Badges */}
        <div className="p-3 pb-2">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar avec badge de vérification */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-16 h-16 border-4 border-background shadow-lg ring-2 ring-primary/10">
                <AvatarImage src={avatar_url || "/placeholder.svg"} alt={full_name} />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-secondary text-white">
                  {(full_name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {is_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-sm">
                  <CheckCircle size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Type Badge */}
            <div className="flex-1 min-w-0">
              {type && (
                <Badge variant="outline" className={cn("mb-2", getTypeColor(type))}>
                  {getTypeLabel(type)}
                </Badge>
              )}

              {/* Nom et Titre */}
              <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {full_name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {titre || "Professeur"}
              </p>

              {/* Localisation */}
              {(pays_nom || ville_nom) && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} className="text-primary" />
                  <span className="line-clamp-1">
                    {[ville_nom, pays_nom].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Spécialités */}
          {specialites && specialites.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {specialites.slice(0, 3).map((specialite, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialite}
                </Badge>
              ))}
              {specialites.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{specialites.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/50">
            {/* Note */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                <Star size={14} fill="currentColor" />
                <span className="font-bold text-sm text-foreground">
                  {note_moyenne > 0 ? note_moyenne.toFixed(1) : "N/A"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Note</p>
            </div>

            {/* Étudiants */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={14} className="text-primary" />
                <span className="font-bold text-sm text-foreground">
                  {nb_etudiants_formes || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Étudiants</p>
            </div>

            {/* Expérience */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award size={14} className="text-secondary" />
                <span className="font-bold text-sm text-foreground">
                  {annees_experience || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Ans</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 pb-3">
          <div className="flex items-center justify-between mb-3">
            {tarif_indicatif !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-sm font-bold text-primary">
                  {formatTarif(tarif_indicatif)}
                </span>
              </div>
            )}
          </div>

          <Button className="w-full font-semibold">
            Voir le profil
          </Button>
        </div>
      </Card>
    </Link>
  )
}

ProfesseurCard.Skeleton = function ProfesseurCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
      <div className="p-5 pb-3">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/50">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="mt-auto px-5 pb-5">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  )
}
