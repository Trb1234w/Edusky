'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, MapPin, Star, BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResultFormationProps {
    id: string
    titre: string
    slug: string
    extrait?: string
    image_url?: string
    tags?: string[]
    mode?: string
    niveau?: string
    duree_texte?: string
    prix_indicatif?: number
    note_moyenne?: number
    nb_avis?: number
    professeur?: {
        id: string
        titre?: string
        profiles: {
            full_name: string
            avatar_url?: string
        }
    }
    categorie?: { nom: string }
    pays?: { nom: string }
    ville?: { nom: string }
}

export function SearchResultFormation({
    id,
    titre,
    slug,
    extrait,
    image_url,
    tags,
    mode,
    niveau,
    duree_texte,
    prix_indicatif,
    note_moyenne,
    nb_avis,
    professeur,
    categorie,
    pays,
    ville
}: SearchResultFormationProps) {
    const location = [ville?.nom, pays?.nom].filter(Boolean).join(', ')
    const truncatedExtrait = extrait && extrait.length > 150 ? extrait.substring(0, 150) + '...' : extrait

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/formations/${slug}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {/* Image */}
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                        {image_url ? (
                            <Image
                                src={image_url}
                                alt={titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="h-12 w-12 text-primary/30" />
                            </div>
                        )}
                        {categorie && (
                            <Badge className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm">
                                {categorie.nom}
                            </Badge>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4 flex flex-col">
                        {/* Header */}
                        <div className="mb-2">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {titre}
                            </h3>
                            {truncatedExtrait && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {truncatedExtrait}
                                </p>
                            )}
                        </div>

                        {/* Professeur */}
                        {professeur && (
                            <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={professeur.profiles.avatar_url || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {professeur.profiles.full_name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                    {professeur.titre} {professeur.profiles.full_name}
                                </span>
                            </div>
                        )}

                        {/* Métadonnées */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            {note_moyenne && note_moyenne > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{note_moyenne.toFixed(1)}</span>
                                    <span>({nb_avis})</span>
                                </div>
                            )}
                            {duree_texte && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{duree_texte}</span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{location}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags et Info */}
                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {niveau && (
                                <Badge variant="outline" className="text-xs">
                                    {niveau}
                                </Badge>
                            )}
                            {mode && (
                                <Badge variant="secondary" className="text-xs">
                                    {mode === 'en_ligne' ? '🌐 En ligne' : '📍 Présentiel'}
                                </Badge>
                            )}
                            {tags && tags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {prix_indicatif && (
                                <div className="ml-auto">
                                    <span className="text-sm font-semibold text-primary">
                                        {prix_indicatif.toLocaleString()} FCFA
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    )
}
