'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface SearchResultUserProps {
    id: string
    full_name: string
    username?: string
    avatar_url?: string
    bio?: string
    is_verified?: boolean
    competences?: string[]
    pays?: { nom: string }
    ville?: { nom: string }
    followers?: any[]
    isFollowing?: boolean
}

export function SearchResultUser({
    id,
    full_name,
    username,
    avatar_url,
    bio,
    is_verified,
    competences,
    pays,
    ville,
    followers,
    isFollowing: initialFollowing = false
}: SearchResultUserProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing)
    const followersCount = followers?.[0]?.count || 0

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsFollowing(!isFollowing)
        // TODO: Implémenter l'action de suivi
    }

    const location = [ville?.nom, pays?.nom].filter(Boolean).join(', ')
    const truncatedBio = bio && bio.length > 120 ? bio.substring(0, 120) + '...' : bio

    return (
        <Card className="p-4 hover:bg-accent/50 transition-all duration-200 border-border group">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <Link href={`/users/${id}`}>
                    <Avatar className="h-14 w-14 ring-2 ring-background hover:ring-primary transition-all cursor-pointer">
                        <AvatarImage src={avatar_url || undefined} alt={full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold">
                            {full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${id}`} className="block group/link">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="font-semibold text-base group-hover/link:underline truncate">
                                {full_name}
                            </h3>
                            {is_verified && (
                                <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center bg-primary">
                                    <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </Badge>
                            )}
                        </div>
                        {username && (
                            <p className="text-sm text-muted-foreground mb-2">@{username}</p>
                        )}
                    </Link>

                    {/* Bio */}
                    {truncatedBio && (
                        <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                            {truncatedBio}
                        </p>
                    )}

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{followersCount} abonné{followersCount > 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Compétences */}
                    {competences && competences.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {competences.slice(0, 3).map((comp, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                                    {comp}
                                </Badge>
                            ))}
                            {competences.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                    +{competences.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Bouton Suivre */}
                <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="shrink-0"
                >
                    {isFollowing ? 'Suivi' : 'Suivre'}
                </Button>
            </div>
        </Card>
    )
}
