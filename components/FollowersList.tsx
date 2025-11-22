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

  const handleMessageUser = async (otherUserId: string) => {
    if (creatingConversationForUser === otherUserId) return;
    setCreatingConversationForUser(otherUserId);

    const { data: conversationId, error } = await findOrCreateConversationAction(otherUserId);

    if (error) {
      toast({ title: "Erreur de messagerie", description: error.message, variant: "destructive" });
    } else if (conversationId) {
      router.push(`/messages?conversation=${conversationId}`);
    }
    setCreatingConversationForUser(null);
  };

  if (profiles.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">Aucun utilisateur à afficher.</p>
    );
  }

  return (
    <div className="space-y-4">
      {profiles.map(profile => (
        <div key={profile.id} className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-border last:border-b-0"> {/* px-4 for mobile, py-3/sm:py-4 for vertical spacing, border-b to separate items, last:border-b-0 to remove last border */}
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleMessageUser(profile.id)}
            disabled={creatingConversationForUser === profile.id}
            className="flex-shrink-0"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
