'use client'

import { PostCard } from "@/components/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Share2 } from 'lucide-react';

// Interface simplifiée pour les props du SharedPostCard
interface SharedPostCardProps {
  id: string;
  author: string;
  authorAvatar: string;
  authorUsername?: string;
  content: string; // Le commentaire du partageur
  timestamp: string;
  sharedPost: any; // Le post original
  currentUserId: string;
  followingIds: string[];
  // On inclut les autres props pour la compatibilité, même si non utilisées directement ici
  [key: string]: any;
}

export function SharedPostCard(props: SharedPostCardProps) {
  const { author, authorAvatar, authorUsername, timestamp, sharedPost, currentUserId, followingIds } = props;

  if (!sharedPost) {
    return null; // Ne rien rendre si le post partagé est manquant
  }

  // Préparer les props pour le PostCard enfant
  const childPostCardProps = {
    ...sharedPost,
    currentUserId,
    followingIds,
  };

  return (
    <Card className="rounded-none md:rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-2 lg:p-6">
        <div className="flex flex-col gap-1 mb-4">
          {/* Ligne 1: Auteur */}
          <div className="flex items-center gap-2">
            <Link href={authorUsername ? `/profile/${authorUsername}` : '#'} className="flex items-center gap-2 hover:underline group/author">
              <Avatar className="w-8 h-8 ring-2 ring-primary/10 group-hover/author:ring-primary/30 transition-all">
                <AvatarImage src={authorAvatar || undefined} alt={author} />
                <AvatarFallback>{author[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-foreground">{author}</span>
            </Link>
          </div>

          {/* Ligne 2: "a republié" + Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-10">
            <Share2 size={14} className="text-primary/70" />
            <span>a republié</span>
            <span>•</span>
            <span>{timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr }) : ''}</span>
          </div>
        </div>

        {/* Affiche le commentaire du partageur s'il y en a un */}
        {props.content &&
          <div className="mb-4 ml-2 pl-4 border-l-2 border-primary/20">
            <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">{props.content}</p>
          </div>
        }

        {/* Conteneur pour le post original */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-background/50">
          <PostCard {...childPostCardProps} />
        </div>
      </CardContent>
    </Card>
  );
}
