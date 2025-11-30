'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResultClubProps {
    id: string
    nom: string
    slug: string
    description?: string
    image_url?: string
    tags?: string[]
    theme_principal?: string
    capacite?: number
    statut?: string
    leader?: {
        id: string
        full_name: string
        avatar_url?: string
        is_verified?: boolean
    }
    categorie?: { nom: string }
    pays?: { nom: string }
    ville?: { nom: string }
    membres?: any[]
}

export function SearchResultClub({
    id,
    nom,
    slug,
    description,
    image_url,
    tags,
    theme_principal,
    capacite,
    statut,
    leader,
    categorie,
    pays,
    ville,
    membres
}: SearchResultClubProps) {
    const location = [ville?.nom, pays?.nom].filter(Boolean).join(', ')
    const truncatedDescription = description && description.length > 150
        ? description.substring(0, 150) + '...'
        : description
    const membresCount = membres?.[0]?.count || 0

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/clubs/${slug}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {/* Image */}
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-blue-500/10 to-cyan-500/10 overflow-hidden">
                        {image_url ? (
                            <Image
                                src={image_url}
                                alt={nom}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="h-12 w-12 text-blue-500/30" />
                            </div>
                        )}

                        {/* Statut badge */}
                        {statut && (
                            <Badge
                                className={`absolute top-2 left-2 ${statut === 'ouvert'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-orange-500 text-white'
                                    }`}
                            >
                                {statut === 'ouvert' ? '✓ Ouvert' : '🔒 Fermé'}
                            </Badge>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4 flex flex-col">
                        {/* Header */}
                        <div className="mb-2">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {nom}
                            </h3>
                            {truncatedDescription && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {truncatedDescription}
                                </p>
                            )}
                        </div>

                        {/* Leader */}
                        {leader && (
                            <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={leader.avatar_url || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {leader.full_name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                    Leader: {leader.full_name}
                                    {leader.is_verified && ' ✓'}
                                </span>
                            </div>
                        )}

                        {/* Métadonnées */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            {membresCount > 0 && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>
                                        {membresCount} membre{membresCount > 1 ? 's' : ''}
                                        {capacite && ` / ${capacite}`}
                                    </span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[200px]">{location}</span>
                                </div>
                            )}
                            {theme_principal && (
                                <div className="flex items-center gap-1">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[150px]">{theme_principal}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags et Catégorie */}
                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {categorie && (
                                <Badge variant="secondary" className="text-xs">
                                    {categorie.nom}
                                </Badge>
                            )}
                            {tags && tags.slice(0, 3).map((tag, idx) => (
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
