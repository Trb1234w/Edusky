'use client'

import { PostCard } from "@/components/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Interface simplifiée pour les props du SharedPostCard
interface SharedPostCardProps {
  id: string;
  author: string;
  authorAvatar: string;
  content: string; // Le commentaire du partageur
  timestamp: string;
  sharedPost: any; // Le post original
  currentUserId: string;
  followingIds: string[];
  // On inclut les autres props pour la compatibilité, même si non utilisées directement ici
  [key: string]: any;
}

export function SharedPostCard(props: SharedPostCardProps) {
  const { author, authorAvatar, timestamp, sharedPost, currentUserId, followingIds } = props;

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
    <Card className="rounded-none shadow-sm hover:shadow-md transition-shadow lg:rounded-xl lg:border-border lg:hover:shadow-lg">
      <CardContent className="p-2 lg:p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Avatar className="w-6 h-6">
                <AvatarImage src={authorAvatar || undefined} alt={author} />
                <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
                <span className="font-semibold text-foreground">{author}</span> a republié
                <span className="text-xs ml-2"> 
                    • {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr }) : ''}
                </span>
            </div>
        </div>

        {/* Affiche le commentaire du partageur s'il y en a un */}
        {props.content && 
            <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4 ml-8">{props.content}</p>
        }

        {/* Conteneur pour le post original */}
        <div className="border rounded-lg overflow-hidden">
            <PostCard {...childPostCardProps} />
        </div>
      </CardContent>
    </Card>
  );
}
