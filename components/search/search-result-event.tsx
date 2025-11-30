'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SearchResultEventProps {
    id: string
    titre: string
    slug: string
    extrait?: string
    image_url?: string
    tags?: string[]
    date_debut?: string
    date_fin?: string
    mode?: string
    lieu?: string
    capacite?: number
    type_evenement?: string
    organisateur?: {
        id: string
        full_name: string
        avatar_url?: string
        is_verified?: boolean
    }
    categorie?: { nom: string }
    pays?: { nom: string }
    ville?: { nom: string }
    inscriptions?: any[]
}

export function SearchResultEvent({
    id,
    titre,
    slug,
    extrait,
    image_url,
    tags,
    date_debut,
    date_fin,
    mode,
    lieu,
    capacite,
    type_evenement,
    organisateur,
    categorie,
    pays,
    ville,
    inscriptions
}: SearchResultEventProps) {
    const location = lieu || [ville?.nom, pays?.nom].filter(Boolean).join(', ')
    const truncatedExtrait = extrait && extrait.length > 150 ? extrait.substring(0, 150) + '...' : extrait
    const participantsCount = inscriptions?.[0]?.count || 0
    const isUpcoming = date_debut && new Date(date_debut) > new Date()

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/evenements/${slug}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {/* Image avec date overlay */}
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 overflow-hidden">
                        {image_url ? (
                            <Image
                                src={image_url}
                                alt={titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-purple-500/30" />
                            </div>
                        )}

                        {/* Date badge */}
                        {date_debut && (
                            <div className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                                <div className="text-center">
                                    <div className="text-xs font-medium text-muted-foreground uppercase">
                                        {format(new Date(date_debut), 'MMM', { locale: fr })}
                                    </div>
                                    <div className="text-2xl font-bold leading-none">
                                        {format(new Date(date_debut), 'd')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Type badge */}
                        {type_evenement && (
                            <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                                {type_evenement}
                            </Badge>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4 flex flex-col">
                        {/* Header */}
                        <div className="mb-2">
                            {isUpcoming && (
                                <Badge variant="secondary" className="mb-2 bg-green-500/10 text-green-700 dark:text-green-400">
                                    À venir
                                </Badge>
                            )}
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {titre}
                            </h3>
                            {truncatedExtrait && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {truncatedExtrait}
                                </p>
                            )}
                        </div>

                        {/* Organisateur */}
                        {organisateur && (
                            <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={organisateur.avatar_url || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {organisateur.full_name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                    Par {organisateur.full_name}
                                    {organisateur.is_verified && ' ✓'}
                                </span>
                            </div>
                        )}

                        {/* Métadonnées */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            {date_debut && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{format(new Date(date_debut), 'HH:mm', { locale: fr })}</span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[200px]">{location}</span>
                                </div>
                            )}
                            {capacite && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{participantsCount}/{capacite}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags et Mode */}
                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {mode && (
                                <Badge variant="secondary" className="text-xs">
                                    {mode === 'en_ligne' ? '🌐 En ligne' : '📍 Présentiel'}
                                </Badge>
                            )}
                            {categorie && (
                                <Badge variant="outline" className="text-xs">
                                    {categorie.nom}
                                </Badge>
                            )}
                            {tags && tags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    )
}
