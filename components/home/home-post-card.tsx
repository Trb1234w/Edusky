'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HomePostCardProps {
    id: string;
    author: string;
    authorAvatar: string;
    authorUsername: string;
    content: string;
    image: string | null;
    timestamp: string;
    likes: number;
    comments: number;
}

export function HomePostCard({
    id,
    author,
    authorAvatar,
    authorUsername,
    content,
    image,
    timestamp,
    likes,
    comments,
}: HomePostCardProps) {
    return (
        <Link href={`/post/${id}`} className="block group">
            <Card className="w-[280px] md:w-[320px] h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                    {/* Header */}
                    <div className="p-3 flex items-center gap-2">
                        <Avatar className="w-8 h-8 border border-border">
                            <AvatarImage src={authorAvatar || undefined} alt={author} />
                            <AvatarFallback>{author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">{author}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}
                            </p>
                        </div>
                    </div>

                    {/* Image (if exists) */}
                    {image ? (
                        <div className="relative w-full aspect-video bg-muted overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url('${image}')` }}
                            />
                        </div>
                    ) : (
                        <div className="px-4 py-2 flex-1">
                            <p className="text-sm text-foreground/90 line-clamp-4 leading-relaxed">
                                {content}
                            </p>
                        </div>
                    )}

                    {/* Content Preview (if image exists, show less text) */}
                    {image && (
                        <div className="px-3 py-2">
                            <p className="text-sm text-foreground/90 line-clamp-2">
                                {content}
                            </p>
                        </div>
                    )}

                    {/* Footer Stats */}
                    <div className="mt-auto p-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" /> {likes}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" /> {comments}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
