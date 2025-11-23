'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserConversations, getFollowedUsers } from "@/lib/data/messages.server";
import { MessagesContainer } from "@/components/messages-container";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/connexion");
  }

  const { data: conversations, error: conversationsError } = await getUserConversations(user.id);

  if (conversationsError) {
    console.error("Erreur lors du chargement des données de messagerie:", conversationsError);
    return <div className="text-center p-8">Erreur lors du chargement des données de messagerie.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-hidden">
        <MessagesContainer
          initialConversations={conversations || []}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
