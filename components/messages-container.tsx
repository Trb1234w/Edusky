'use client'

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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

interface MessagesContainerProps {
  initialConversations: Conversation[];
  currentUserId: string;
}

export function MessagesContainer({ initialConversations, currentUserId }: MessagesContainerProps) {
  const searchParams = useSearchParams();
  const paramConvoId = searchParams.get('conversation');

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(() => {
    if (paramConvoId && initialConversations.some(c => c.id === paramConvoId)) {
      return paramConvoId;
    }
    return initialConversations.length > 0 ? initialConversations[0].id : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false); // New state for mobile chat view

  // Gérer le changement si l'URL change après le chargement initial
  useEffect(() => {
    if (paramConvoId && initialConversations.some(c => c.id === paramConvoId)) {
      setSelectedConversationId(paramConvoId);
      setIsMobileChatOpen(true); // Open chat on mobile if convoId in URL
    }
  }, [paramConvoId, initialConversations]);

  // Update conversations state if initialConversations prop changes
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // Realtime subscription for new conversations and updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`user_conversations:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${currentUserId}`,
        },
        async (payload) => {
          console.log('New conversation participant row:', payload);
          const newConvoId = payload.new.conversation_id;

          // Check if we already have this conversation
          if (conversations.some(c => c.id === newConvoId)) return;

          // Fetch the full conversation details
          const { getConversation } = await import("@/app/messages/actions");
          const { data: newConvo, error } = await getConversation(newConvoId, currentUserId);

          if (newConvo) {
            setConversations(prev => [newConvo as Conversation, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          const updatedConvoId = payload.new.id;
          setConversations(prev => {
            const convoIndex = prev.findIndex(c => c.id === updatedConvoId);
            if (convoIndex === -1) return prev; // Not in our list

            const updatedConvo = { ...prev[convoIndex], updated_at: payload.new.updated_at };
            const newList = [...prev];
            newList.splice(convoIndex, 1); // Remove from current position
            newList.unshift(updatedConvo); // Add to top
            return newList;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, conversations]);

  const handleNewConversationCreated = (newConvo: Conversation) => {
    setConversations(prev => [newConvo, ...prev]);
  };

  // Handle conversation selection to open chat on mobile
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setIsMobileChatOpen(true);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  return (
    <div className="h-full flex">
      {/* Conversation List (Left Pane) */}
      <aside className={cn(
        "w-full md:w-1/3 h-full border-r border-border flex flex-col",
        isMobileChatOpen ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher conversations ou utilisateurs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            items={filteredConversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            currentUserId={currentUserId}
            onNewConversationCreated={handleNewConversationCreated}
          />
        </div>
      </aside>

      {/* Chat Window (Right Pane) */}
      <section className={cn(
        "w-full md:w-2/3 h-full flex flex-col",
        isMobileChatOpen ? "flex" : "hidden md:flex"
      )}>
        <ChatWindow conversation={selectedConversation} onBack={() => setIsMobileChatOpen(false)} />
      </section>
    </div>
  );
}
