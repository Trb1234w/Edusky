'use client'

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Ce composant attend un post avec les données de l'auteur jointes
interface PostCardProps {
  post: {
    id: string;
    contenu: string;
    media: any[] | null;
    created_at: string;
    auteur: {
      full_name: string | null;
      avatar_url: string | null;
      prenom?: string | null;
      nom?: string | null;
    } | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  if (!post.auteur) {
    return null; // Ne rien afficher si l'auteur n'est pas chargé
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr });
  const userInitial = (post.auteur.prenom?.charAt(0) || '') + (post.auteur.nom?.charAt(0) || '') || 'U';
  const postImage = post.media?.find(m => m.type === 'image');

  return (
    <Card className="p-4 sm:p-6 border-border shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={post.auteur.avatar_url || undefined} alt={post.auteur.full_name || 'User'} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{post.auteur.full_name}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground hover:underline">
              {timeAgo}
            </span>
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
            <p>{post.contenu}</p>
          </div>

          {postImage && (
            <div className="mt-4 rounded-lg border border-border overflow-hidden">
              <Image 
                src={postImage.url} 
                alt="Contenu du post" 
                width={600} 
                height={400} 
                className="object-cover w-full"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
