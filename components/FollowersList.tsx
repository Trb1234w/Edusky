'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { findOrCreateConversationAction } from "@/app/messages/actions";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null; // Added
  avatar_url: string | null;
  bio: string | null;
  isFollowing?: boolean; // Optionnel, à ajouter plus tard si besoin du bouton Suivre
}

interface FollowersListProps {
  profiles: Profile[];
  currentUserId: string;
}

export function FollowersList({ profiles, currentUserId }: FollowersListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [creatingConversationForUser, setCreatingConversationForUser] = useState<string | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);

  const handleMessageUser = async (e: React.MouseEvent, otherUserId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking message button
    if (creatingConversationForUser === otherUserId) return;
    setCreatingConversationForUser(otherUserId);

    const { data: conversationId, error } = await findOrCreateConversationAction(otherUserId);

    if (error) {
      toast({ title: "Erreur de messagerie", description: error, variant: "destructive" });
    } else if (conversationId) {
      router.push(`/messages?conversation=${conversationId}`);
    }
    setCreatingConversationForUser(null);
  };

  const handleFollowUser = async (e: React.MouseEvent, targetUserId: string, isFollowing: boolean) => {
    e.stopPropagation(); // Prevent navigation
    if (loadingFollow === targetUserId) return;
    setLoadingFollow(targetUserId);

    // Optimistic update could be done here if we had state management for the list,
    // but for now we'll rely on router.refresh() or just wait for the action.
    // Actually, let's just trigger the action and refresh.

    // Import followUserAction dynamically or assume it's available. 
    // Since this is a client component, we need to import the server action.
    // I'll add the import at the top.

    try {
      const { followUserAction } = await import('@/app/users/actions');
      const { error } = await followUserAction(currentUserId, targetUserId);

      if (error) {
        toast({ title: "Erreur", description: error, variant: "destructive" });
      } else {
        toast({
          title: isFollowing ? "Désabonné" : "Abonné",
          description: isFollowing ? "Vous ne suivez plus cet utilisateur." : "Vous suivez maintenant cet utilisateur."
        });
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to execute follow action", err);
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
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleMessageUser(e, profile.id)}
              disabled={creatingConversationForUser === profile.id}
              className="flex-shrink-0 h-9 w-9"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
