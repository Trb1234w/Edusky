'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SearchResultArticleProps {
    id: string
    titre: string
    slug?: string
    extrait?: string
    image_couverture?: string
    image_url?: string
    tags?: string[]
    vues?: number
    likes_count?: number
    comment_count?: number
    publie_at?: string
    auteur_id?: string
    categorie_id?: string
}

export function SearchResultArticle(props: SearchResultArticleProps) {
    const truncatedExtrait = props.extrait && props.extrait.length > 180
        ? props.extrait.substring(0, 180) + '...'
        : props.extrait
    const coverImage = props.image_couverture || props.image_url

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/blog/${props.id}`}>
                <div className="grid md:grid-cols-[280px_1fr] gap-4">
                    <div className="relative aspect-video md:aspect-[16/10] bg-gradient-to-br from-orange-500/10 to-red-500/10 overflow-hidden">
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt={props.titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MessageSquare className="h-12 w-12 text-orange-500/30" />
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex flex-col">
                        <div className="mb-3">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {props.titre}
                            </h3>
                            {truncatedExtrait && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {truncatedExtrait}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            {props.vues !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>{props.vues.toLocaleString()}</span>
                                </div>
                            )}
                            {props.likes_count !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Heart className="h-3.5 w-3.5" />
                                    <span>{props.likes_count.toLocaleString()}</span>
                                </div>
                            )}
                            {props.comment_count !== undefined && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>{props.comment_count.toLocaleString()}</span>
                                </div>
                            )}
                            {props.publie_at && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{format(new Date(props.publie_at), 'd MMM yyyy', { locale: fr })}</span>
                                </div>
                            )}
                        </div>

                        {props.tags && props.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-auto">
                                {props.tags.slice(0, 4).map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        #{tag}
                                    </Badge>
                                ))}
                                {props.tags.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{props.tags.length - 4}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    )
}
