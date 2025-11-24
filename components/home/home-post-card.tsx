'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
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
        <Link href={`/post/${id}`} className="block group h-full">
            <Card className="w-[280px] md:w-[300px] h-full overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 flex items-center gap-3 border-b border-border/30">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarImage src={authorAvatar || undefined} alt={author} />
                            <AvatarFallback className="text-sm">{author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors">{author}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}
                            </p>
                        </div>
                    </div>

                    {/* Image (if exists) */}
                    {image ? (
                        <div className="relative w-full aspect-[16/10] bg-muted overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url('${image}')` }}
                            />
                        </div>
                    ) : (
                        <div className="px-5 py-4 flex-1 bg-gradient-to-br from-background to-muted/30">
                            <p className="text-base text-foreground/90 line-clamp-4 leading-relaxed italic">
                                "{content}"
                            </p>
                        </div>
                    )}

                    {/* Content Preview (if image exists, show less text) */}
                    {image && (
                        <div className="px-4 py-3 flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {content}
                            </p>
                        </div>
                    )}

                    {/* Footer Stats */}
                    <div className="mt-auto p-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4" /> {likes}
                            </span>
                            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <MessageCircle className="w-4 h-4" /> {comments}
                            </span>
                        </div>
                        <Share2 className="w-4 h-4 hover:text-primary transition-colors" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
