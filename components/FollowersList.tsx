'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { followUserAction } from "@/app/users/actions";

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  isFollowing?: boolean;
}

interface FollowersListProps {
  profiles: Profile[];
  currentUserId: string;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
}

export function FollowersList({ profiles, currentUserId, onFollowChange }: FollowersListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [creatingConversationForUser, setCreatingConversationForUser] = useState<string | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);

  const handleFollowUser = async (e: React.MouseEvent, targetUserId: string, isFollowing: boolean) => {
    e.stopPropagation();
    if (loadingFollow === targetUserId) return;

    // Optimistic update via callback
    if (onFollowChange) {
      onFollowChange(targetUserId, !isFollowing);
    }

    setLoadingFollow(targetUserId);

    try {
      const { error } = await followUserAction(currentUserId, targetUserId);

      if (error) {
        // Revert on error
        if (onFollowChange) {
          onFollowChange(targetUserId, isFollowing);
        }
        toast({ title: "Erreur", description: error, variant: "destructive" });
      } else {
        toast({
          title: isFollowing ? "Désabonné" : "Abonné",
          description: isFollowing ? "Vous ne suivez plus cet utilisateur." : "Vous suivez maintenant cet utilisateur."
        });
      }
    } catch (err) {
      console.error("Failed to execute follow action", err);
      // Revert on error
      if (onFollowChange) {
        onFollowChange(targetUserId, isFollowing);
      }
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoadingFollow(null);
    }
  };

  const handleNavigateToProfile = (username: string | null) => {
    if (username) {
      router.push(`/profile/${username}`);
    }
  };

  if (profiles.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">Aucun utilisateur à afficher.</p>
    );
  }

  return (
    <div className="space-y-4">
      {profiles.map(profile => (
        <div
          key={profile.id}
          className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
          onClick={() => handleNavigateToProfile(profile.username)}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "Utilisateur"} />
              <AvatarFallback>{profile.full_name ? profile.full_name[0] : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold text-sm sm:text-base">{profile.full_name}</p>
              {profile.username && <p className="text-xs text-muted-foreground">@{profile.username}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUserId !== profile.id && (
              <Button
                variant={profile.isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={(e) => handleFollowUser(e, profile.id, !!profile.isFollowing)}
                disabled={loadingFollow === profile.id}
                className="h-9"
              >
                {loadingFollow === profile.id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : profile.isFollowing ? (
                  "Abonné"
                ) : (
                  "Suivre"
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
