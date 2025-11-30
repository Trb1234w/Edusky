'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Heart, MessageSquare, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SearchResultArticleProps {
    id: string
    titre: string
    slug: string
    extrait?: string
    image_couverture?: string
    image_url?: string
    tags?: string[]
    vues?: number
    likes_count?: number
    comment_count?: number
    publie_at?: string
    auteur?: {
        id: string
        full_name: string
        avatar_url?: string
        is_verified?: boolean
    }
    categorie?: { nom: string }
}

export function SearchResultArticle({
    id,
    titre,
    slug,
    extrait,
    image_couverture,
    image_url,
    tags,
    vues,
    likes_count,
    comment_count,
    publie_at,
    auteur,
    categorie
}: SearchResultArticleProps) {
    const truncatedExtrait = extrait && extrait.length > 180
        ? extrait.substring(0, 180) + '...'
        : extrait
    const coverImage = image_couverture || image_url

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group">
            <Link href={`/blog/${slug}`}>
                <div className="grid md:grid-cols-[280px_1fr] gap-4">
                    {/* Image */}
                    <div className="relative aspect-video md:aspect-[16/10] bg-gradient-to-br from-orange-500/10 to-red-500/10 overflow-hidden">
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt={titre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MessageSquare className="h-12 w-12 text-orange-500/30" />
                            </div>
                        )}

                        {/* Catégorie badge */}
                        {categorie && (
                            <Badge className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm">
                                {categorie.nom}
                            </Badge>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="p-4 flex flex-col">
                        {/* Header */}
                        <div className="mb-3">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {titre}
                            </h3>
                            {truncatedExtrait && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {truncatedExtrait}
                                </p>
                            )}
                        </div>

                        {/* Auteur */}
                        {auteur && (
                            <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={auteur.avatar_url || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {auteur.full_name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium">
                                        {auteur.full_name}
                                        {auteur.is_verified && ' ✓'}
                                    </span>
                                    {publie_at && (
                                        <>
                                            <span>·</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{format(new Date(publie_at), 'd MMM yyyy', { locale: fr })}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            {vues !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>{vues.toLocaleString()}</span>
                                </div>
                            )}
                            {likes_count !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Heart className="h-3.5 w-3.5" />
                                    <span>{likes_count.toLocaleString()}</span>
                                </div>
                            )}
                            {comment_count !== undefined && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>{comment_count.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-auto">
                                {tags.slice(0, 4).map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        #{tag}
                                    </Badge>
                                ))}
                                {tags.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{tags.length - 4}
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
