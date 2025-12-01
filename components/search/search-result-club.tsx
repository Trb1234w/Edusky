'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResultClubProps {
    id: string
    nom: string
    slug?: string
    description?: string
    image_url?: string
    tags?: string[]
    theme_principal?: string
    capacite?: number
    statut?: string
    leader_id?: string
    categorie_id?: string
    pays_id?: string
    ville_id?: string
}

export function SearchResultClub(props: SearchResultClubProps) {
    const truncatedDescription = props.description && props.description.length > 150
        ? props.description.substring(0, 150) + '...'
        : props.description

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/clubs/${props.id}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-blue-500/10 to-cyan-500/10 overflow-hidden">
                        {props.image_url ? (
                            <Image
                                src={props.image_url}
                                alt={props.nom}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="h-12 w-12 text-blue-500/30" />
                            </div>
                        )}

                        {props.statut && (
                            <Badge
                                className={`absolute top-2 left-2 ${props.statut === 'ouvert'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-orange-500 text-white'
                                    }`}
                            >
                                {props.statut === 'ouvert' ? '✓ Ouvert' : '🔒 Fermé'}
                            </Badge>
                        )}
                    </div>

                    <div className="p-4 flex flex-col">
                        <div className="mb-2">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {props.nom}
                            </h3>
                            {truncatedDescription && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {truncatedDescription}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            {props.theme_principal && (
                                <div className="flex items-center gap-1">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[150px]">{props.theme_principal}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {props.tags && props.tags.slice(0, 3).map((tag, idx) => (
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
