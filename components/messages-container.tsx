'use client'

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  initialFollowedUsers: Profile[];
  currentUserId: string;
}

export function MessagesContainer({ initialConversations, initialFollowedUsers, currentUserId }: MessagesContainerProps) {
  const searchParams = useSearchParams();
  const paramConvoId = searchParams.get('conversation');

  const [conversations, setConversations] = useState(initialConversations);
  const [followedUsers, setFollowedUsers] = useState(initialFollowedUsers);
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

  // Update conversations state if initialConversations prop changes (e.g., after router.refresh() in page.tsx)
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const handleNewConversationCreated = (newConvo: Conversation) => {
    setConversations(prev => [newConvo, ...prev]);
  };

  // Handle conversation selection to open chat on mobile
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setIsMobileChatOpen(true);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Create a unified list of conversations and followed users
  const unifiedList = useMemo(() => {
    const existingConversationUserIds = new Set(conversations.flatMap(convo => convo.participants.map(p => p.id)));

    const followedUsersNotInConversation = followedUsers.filter(
      user => !existingConversationUserIds.has(user.id)
    );

    // Map followed users to a format compatible with conversations for display
    const mappedFollowedUsers = followedUsersNotInConversation.map(user => ({
      id: user.id, // Use user ID as a temporary ID for display
      updated_at: new Date().toISOString(), // Placeholder for sorting
      title: user.full_name || "Utilisateur",
      avatarUrl: user.avatar_url,
      isFollowedUser: true, // Flag to differentiate in ConversationList
      participants: [user] // Store the user profile
    }));

    // Combine and sort by updated_at (conversations first, then followed users)
    return [...conversations, ...mappedFollowedUsers].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [conversations, followedUsers]);

  const filteredUnifiedList = useMemo(() => {
    if (!searchQuery) return unifiedList;
    return unifiedList.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [unifiedList, searchQuery]);

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
            items={filteredUnifiedList}
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
