'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, MapPin, Star, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResultFormationProps {
    id: string
    titre: string
    slug?: string
    extrait?: string
    image_url?: string
    tags?: string[]
    mode?: string
    niveau?: string
    duree_texte?: string
    prix_indicatif?: number
    note_moyenne?: number
    nb_avis?: number
    professeur_id?: string
    categorie_id?: string
    pays_id?: string
    ville_id?: string
}

export function SearchResultFormation(props: SearchResultFormationProps) {
    const truncatedExtrait = props.extrait && props.extrait.length > 150
        ? props.extrait.substring(0, 150) + '...'
        : props.extrait

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/formations/${props.id}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                        {props.image_url ? (
                            <Image
                                src={props.image_url}
                                alt={props.titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="h-12 w-12 text-primary/30" />
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex flex-col">
                        <div className="mb-2">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {props.titre}
                            </h3>
                            {truncatedExtrait && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {truncatedExtrait}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            {props.note_moyenne && props.note_moyenne > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{props.note_moyenne.toFixed(1)}</span>
                                    {props.nb_avis && <span>({props.nb_avis})</span>}
                                </div>
                            )}
                            {props.duree_texte && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{props.duree_texte}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {props.niveau && (
                                <Badge variant="outline" className="text-xs">
                                    {props.niveau}
                                </Badge>
                            )}
                            {props.mode && (
                                <Badge variant="secondary" className="text-xs">
                                    {props.mode === 'en_ligne' ? '🌐 En ligne' : '📍 Présentiel'}
                                </Badge>
                            )}
                            {props.prix_indicatif && (
                                <div className="ml-auto">
                                    <span className="text-sm font-semibold text-primary">
                                        {props.prix_indicatif.toLocaleString()} GNF
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
