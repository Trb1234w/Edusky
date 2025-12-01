'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SearchResultPostProps {
    id: string
    contenu: string
    created_at: string
    auteur_id: string
    auteur?: {
        id: string
        full_name: string
        username?: string
        avatar_url?: string
        is_verified?: boolean
    }
    media?: any
    likes_count?: number
    comments_count?: number
    shares_count?: number
    isLiked?: boolean
}

export function SearchResultPost({
    id,
    contenu,
    created_at,
    auteur_id,
    auteur,
    media,
    likes_count = 0,
    comments_count = 0,
    shares_count = 0,
    isLiked = false
}: SearchResultPostProps) {
    // Tronquer le contenu pour l'aperçu
    const truncatedContent = contenu?.length > 200
        ? contenu.substring(0, 200) + '...'
        : contenu

    if (!auteur) return null

    return (
        <Card className="p-4 hover:bg-accent/50 transition-all duration-200 border-border group">
            <div className="flex gap-3">
                {/* Avatar */}
                <Link href={`/profile/${auteur.username || auteur.id}`}>
                    <Avatar className="h-10 w-10 ring-2 ring-background hover:ring-primary transition-all">
                        <AvatarImage src={auteur.avatar_url || undefined} alt={auteur.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                            {auteur.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                            <Link href={`/profile/${auteur.username || auteur.id}`} className="hover:underline">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-sm truncate">
                                        {auteur.full_name}
                                    </span>
                                    {auteur.is_verified && (
                                        <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center bg-primary">
                                            <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Badge>
                                    )}
                                </div>
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                {auteur.username && `@${auteur.username} · `}
                                {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Contenu du post */}
                    <p className="text-sm mb-3 whitespace-pre-wrap break-words">
                        {truncatedContent}
                    </p>

                    {/* Media preview si présent */}
                    {media && media.length > 0 && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-muted">
                            <div className="aspect-video relative">
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                                    📷 {media.length} média(s)
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <button className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors ${isLiked ? 'text-pink-500' : ''}`}>
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{likes_count}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{comments_count}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-xs">{shares_count}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
