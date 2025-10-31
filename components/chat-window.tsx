import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessages, sendMessageAction } from "@/app/messages/actions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatWindowProps {
  conversation: any;
  onBack: () => void; // New prop for back button on mobile
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  // Fetch initial messages
  useEffect(() => {
    if (conversation?.id) {
      const fetchMessages = async () => {
        setLoading(true);
        const { data } = await getMessages(conversation.id);
        if (data) {
          setMessages(data);
        }
        setLoading(false);
      };
      fetchMessages();
    }
  }, [conversation?.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversation?.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          const newMessage = payload.new;
          // Enrich message with author data from conversation participants if available
          const authorProfile = conversation.participants.find((p: any) => p.id === newMessage.auteur_id);
          const enrichedMessage = {
            ...newMessage,
            auteur: authorProfile || { full_name: 'Utilisateur', avatar_url: null }
          };

          setMessages((currentMessages) => [...currentMessages, enrichedMessage]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount or conversation change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id, conversation?.participants]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || !conversation?.id) return;

    setIsSending(true);
    const content = newMessage;
    setNewMessage("");

    // L'action insère dans la DB, le listener real-time mettra à jour l'UI.
    const { error } = await sendMessageAction(conversation.id, currentUserId, content);

    if (error) {
      console.error("Failed to send message:", error);
      setNewMessage(content); // Remettre le message dans l'input en cas d'erreur
    }
    // Pas besoin de re-fetch, le listener s'en occupe.
    setIsSending(false);
  };

  if (!conversation) {
    return (
        <div className="h-full flex items-center justify-center bg-muted/40">
            <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
        {/* Header du Chat */}
        <div className="p-4 border-b border-border flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar>
                <AvatarImage src={conversation.avatarUrl || undefined} alt={conversation.title} />
                <AvatarFallback>{conversation.title ? conversation.title[0] : 'C'}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{conversation.title}</h3>
        </div>

        {/* Zone des Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.map(msg => (
                        <div key={msg.id} className={cn(
                            "flex items-end gap-2",
                            msg.auteur_id === currentUserId ? "justify-end" : "justify-start"
                        )}>
                            {msg.auteur_id !== currentUserId && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.auteur?.avatar_url} />
                                    <AvatarFallback>{msg.auteur?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                msg.auteur_id === currentUserId 
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}>
                                <p className="text-sm">{msg.contenu}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{format(new Date(msg.created_at), 'HH:mm', { locale: fr })}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>

        {/* Input pour envoyer un message */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
            <div className="relative">
                <Input 
                    placeholder="Écrivez votre message..." 
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                />
                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </form>
    </div>
  );
}
