'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

interface ConversationListProps {
  items: Conversation[];
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

  const handleSelectItem = (item: Conversation) => {
    onSelectConversation(item.id);
  };

  return (
    <div className="p-4 space-y-2">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune conversation.</p>
      ) : (
        items.map(item => (
          <div
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted",
              selectedConversationId === item.id && "bg-muted"
            )}
          >
            <Avatar>
              <AvatarImage src={item.avatarUrl || undefined} alt={item.title} />
              <AvatarFallback>{item.title ? item.title[0] : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center justify-between">
              <p className="font-semibold">{item.title}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
