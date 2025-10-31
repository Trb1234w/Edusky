'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { findOrCreateConversationAction } from "@/app/messages/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Conversation {
  id: string;
  updated_at: string;
  title: string;
  avatarUrl: string | null;
  participants: Profile[];
}

interface UnifiedListItem extends Conversation {
  isFollowedUser?: boolean; // Optional flag to indicate if it's a followed user not yet in a conversation
}

interface ConversationListProps {
  items: UnifiedListItem[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  currentUserId: string;
  onNewConversationCreated: (newConvo: Conversation) => void;
}

export function ConversationList({
  items,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
  onNewConversationCreated,
}: ConversationListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [creatingConversationForUser, setCreatingConversationForUser] = useState<string | null>(null);

  const handleSelectItem = async (item: UnifiedListItem) => {
    if (item.isFollowedUser) {
      // This is a followed user, initiate a new conversation
      if (creatingConversationForUser === item.id) return;
      setCreatingConversationForUser(item.id);

      // Check if a conversation already exists with this user (should be handled by unifiedList logic, but as a fallback)
      const existingConvo = items.find(convo => 
        !convo.isFollowedUser && convo.participants.some(p => p.id === item.id)
      );

      if (existingConvo) {
        onSelectConversation(existingConvo.id);
        setCreatingConversationForUser(null);
        return;
      }

      const { data: conversationId, error } = await findOrCreateConversationAction(item.id);

      if (error) {
        toast({ title: "Erreur de messagerie", description: error.message, variant: "destructive" });
      } else if (conversationId) {
        const newConvo: Conversation = {
          id: conversationId,
          updated_at: new Date().toISOString(),
          title: item.title,
          avatarUrl: item.avatarUrl,
          participants: [
            { id: currentUserId, full_name: "", avatar_url: null }, 
            { id: item.id, full_name: item.title, avatar_url: item.avatarUrl } as Profile
          ]
        };
        onNewConversationCreated(newConvo);
        onSelectConversation(conversationId);
      }
      setCreatingConversationForUser(null);
    } else {
      // This is an existing conversation
      onSelectConversation(item.id);
    }
  };

  return (
    <div className="p-4 space-y-2">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune conversation ou utilisateur à afficher.</p>
      ) : (
        items.map(item => (
          <div
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted",
              selectedConversationId === item.id && !item.isFollowedUser && "bg-muted", // Highlight only active conversations
              item.isFollowedUser && "border border-dashed border-muted-foreground/50", // Differentiate followed users
              creatingConversationForUser === item.id && "opacity-70 cursor-not-allowed"
            )}
          >
            <Avatar>
              <AvatarImage src={item.avatarUrl || undefined} alt={item.title} />
              <AvatarFallback>{item.title ? item.title[0] : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center justify-between">
              <p className="font-semibold">{item.title}</p>
              {item.isFollowedUser && <span className="text-xs text-muted-foreground">Nouveau</span>}
              {creatingConversationForUser === item.id && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
