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
  avatar_url: string | null;
  bio: string | null;
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
        <Card key={profile.id} className="flex items-center p-4 border-border">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "Utilisateur"} />
            <AvatarFallback>{profile.full_name ? profile.full_name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <p className="font-semibold">{profile.full_name}</p>
            {profile.bio && <p className="text-sm text-muted-foreground truncate">{profile.bio}</p>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleMessageUser(profile.id)}
            disabled={creatingConversationForUser === profile.id}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
