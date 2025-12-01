'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SearchResultEventProps {
    id: string
    titre: string
    slug?: string
    extrait?: string
    image_url?: string
    date_debut?: string
    mode?: string
    lieu?: string
    capacite?: number
    type_evenement?: string
    organisateur_id?: string
    categorie_id?: string
    pays_id?: string
    ville_id?: string
}

export function SearchResultEvent(props: SearchResultEventProps) {
    const truncatedExtrait = props.extrait && props.extrait.length > 150
        ? props.extrait.substring(0, 150) + '...'
        : props.extrait
    const isUpcoming = props.date_debut && new Date(props.date_debut) > new Date()

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/evenements/${props.id}`}>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    <div className="relative aspect-video md:aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 overflow-hidden">
                        {props.image_url ? (
                            <Image
                                src={props.image_url}
                                alt={props.titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-purple-500/30" />
                            </div>
                        )}

                        {props.date_debut && (
                            <div className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                                <div className="text-center">
                                    <div className="text-xs font-medium text-muted-foreground uppercase">
                                        {format(new Date(props.date_debut), 'MMM', { locale: fr })}
                                    </div>
                                    <div className="text-2xl font-bold leading-none">
                                        {format(new Date(props.date_debut), 'd')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {props.type_evenement && (
                            <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                                {props.type_evenement}
                            </Badge>
                        )}
                    </div>

                    <div className="p-4 flex flex-col">
                        <div className="mb-2">
                            {isUpcoming && (
                                <Badge variant="secondary" className="mb-2 bg-green-500/10 text-green-700 dark:text-green-400">
                                    À venir
                                </Badge>
                            )}
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
                            {props.date_debut && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{format(new Date(props.date_debut), 'HH:mm', { locale: fr })}</span>
                                </div>
                            )}
                            {props.lieu && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[200px]">{props.lieu}</span>
                                </div>
                            )}
                            {props.capacite && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{props.capacite}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                            {props.mode && (
                                <Badge variant="secondary" className="text-xs">
                                    {props.mode === 'en_ligne' ? '🌐 En ligne' : '📍 Présentiel'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    )
}
