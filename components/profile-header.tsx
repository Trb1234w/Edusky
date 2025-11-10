'use client'

import { useState, useTransition } from 'react';
import { Card } from "@/components/ui/card"; // Ajouté
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, UserCheck, UserPlus, Loader2 } from "lucide-react";
import { followUserAction } from '@/app/users/actions';
import { useToast } from './ui/use-toast';

// Définir un type pour le profil pour plus de clarté
type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
};

interface ProfileHeaderProps {
  profile: Profile;
  currentUserId?: string;
}

export function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // États locaux pour la mise à jour optimiste
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const [followersCount, setFollowersCount] = useState(profile.followersCount);

  const handleFollowClick = () => {
    if (!currentUserId) {
      // Rediriger vers la connexion si l'utilisateur n'est pas connecté
      // router.push('/auth/connexion');
      toast({ title: "Action requise", description: "Vous devez être connecté pour suivre un utilisateur.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      // Mise à jour optimiste
      const previousState = { isFollowing, followersCount };
      setIsFollowing(!isFollowing);
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

      const { error } = await followUserAction(currentUserId, profile.id);

      if (error) {
        // En cas d'erreur, retour à l'état précédent
        setIsFollowing(previousState.isFollowing);
        setFollowersCount(previousState.followersCount);
        toast({ title: "Erreur", description: error, variant: "destructive" });
      }
    });
  };

  return (
    <Card className="mb-8 overflow-hidden">
      {/* Bannière */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full" />
      
      <div className="p-6">
        <div className="flex flex-wrap items-end -mt-20">
          {/* Avatar */}
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Avatar'} />
            <AvatarFallback className="text-4xl">{profile.full_name?.[0]}</AvatarFallback>
          </Avatar>

          {/* Boutons d'action */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon"><Mail className="h-5 w-5" /></Button>
            <Button onClick={handleFollowClick} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserCheck className="mr-2 h-5 w-5" />
                  Abonné
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Suivre
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold">{profile.full_name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="mt-2 text-foreground/90">{profile.bio || "Aucune biographie."}</p>
        </div>

        {/* Statistiques */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <span className="font-bold text-lg">{profile.followingCount}</span>
            <span className="text-muted-foreground">Abonnements</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <span className="font-bold text-lg">{followersCount}</span>
            <span className="text-muted-foreground">Abonnés</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
