'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Star, Users, Award } from 'lucide-react'
import Link from 'next/link'

interface SearchResultProfesseurProps {
    id: string
    titre?: string
    presentation?: string
    specialites?: string[]
    annees_experience?: number
    tarif_indicatif?: number
    tarif_horaire_min?: number
    tarif_horaire_max?: number
    nb_etudiants_formes?: number
    note_moyenne?: number
    nb_notes?: number
    type?: string
    profiles?: {
        id: string
        full_name: string
        username?: string
        avatar_url?: string
        is_verified?: boolean
    }
    pays?: { nom: string }
    ville?: { nom: string }
}

export function SearchResultProfesseur({
    id,
    titre,
    presentation,
    specialites,
    annees_experience,
    tarif_horaire_min,
    tarif_horaire_max,
    nb_etudiants_formes,
    note_moyenne,
    nb_notes,
    type,
    profiles,
    pays,
    ville
}: SearchResultProfesseurProps) {
    const location = [ville?.nom, pays?.nom].filter(Boolean).join(', ')
    const truncatedPresentation = presentation && presentation.length > 150
        ? presentation.substring(0, 150) + '...'
        : presentation

    const tarif = tarif_horaire_min && tarif_horaire_max
        ? `${tarif_horaire_min.toLocaleString()} - ${tarif_horaire_max.toLocaleString()} GNF/h`
        : null

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/professeurs/${id}`}>
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-3">
                        <Avatar className="h-16 w-16 ring-2 ring-background">
                            <AvatarImage src={profiles?.avatar_url || undefined} />
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                {profiles?.full_name?.[0]?.toUpperCase() || 'P'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                    {titre} {profiles?.full_name}
                                </h3>
                                {profiles?.is_verified && (
                                    <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center bg-primary">
                                        <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </Badge>
                                )}
                            </div>
                            {type && (
                                <Badge variant="outline" className="text-xs mb-2">
                                    {type}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Présentation */}
                    {truncatedPresentation && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {truncatedPresentation}
                        </p>
                    )}

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        {note_moyenne && note_moyenne > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{note_moyenne.toFixed(1)}</span>
                                {nb_notes && <span>({nb_notes})</span>}
                            </div>
                        )}
                        {annees_experience && (
                            <div className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5" />
                                <span>{annees_experience} ans d'exp.</span>
                            </div>
                        )}
                        {nb_etudiants_formes && nb_etudiants_formes > 0 && (
                            <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{nb_etudiants_formes} étudiants</span>
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate max-w-[200px]">{location}</span>
                            </div>
                        )}
                    </div>

                    {/* Spécialités et Tarif */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                            {specialites && specialites.slice(0, 3).map((spec, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                </Badge>
                            ))}
                            {specialites && specialites.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{specialites.length - 3}
                                </Badge>
                            )}
                        </div>
                        {tarif && (
                            <span className="text-sm font-semibold text-primary">
                                {tarif}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    )
}
