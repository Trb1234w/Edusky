'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from "@/lib/supabase/server";

export async function getMessages(conversationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .select(`
        id,
        contenu,
        created_at,
        auteur_id,
        auteur:profiles!auteur_id(full_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function findOrCreateConversationAction(otherUserId: string) {
    console.log("findOrCreateConversationAction: Called with otherUserId:", otherUserId);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("findOrCreateConversationAction: User not authenticated.");
        return { error: 'Utilisateur non authentifié' };
    }

    const currentUserId = user.id;
    console.log("findOrCreateConversationAction: currentUserId:", currentUserId);

    if (currentUserId === otherUserId) {
        console.log("findOrCreateConversationAction: Cannot message self.");
        return { error: 'Vous ne pouvez pas vous envoyer de message à vous-même.' };
    }

    // 1. Essayer de trouver une conversation 1-on-1 existante via une fonction RPC
    console.log("findOrCreateConversationAction: Calling RPC find_direct_conversation...");
    const { data: existingConvoId, error: rpcError } = await supabase.rpc('find_direct_conversation', { other_user_id: otherUserId });

    if (rpcError) {
        console.error("findOrCreateConversationAction: Erreur lors de la recherche de conversation RPC:", rpcError);
        return { error: 'Erreur lors de la recherche de la conversation.' };
    }

    if (existingConvoId) {
        return { data: existingConvoId };
    }

    // 2. Si aucune conversation n'existe, en créer une nouvelle via la fonction RPC
    console.log("findOrCreateConversationAction: Calling RPC create_direct_conversation...");
    const { data: newConvoId, error: createRpcError } = await supabase.rpc('create_direct_conversation', {
        user1_id: currentUserId,
        user2_id: otherUserId,
    });

    if (createRpcError || !newConvoId) {
        console.error("findOrCreateConversationAction: Erreur lors de la création de la conversation via RPC:", createRpcError);
        return { error: 'Impossible de créer la conversation.' };
    }

    revalidatePath('/messages'); // Invalider le cache de la page des messages
    return { data: newConvoId };
}


export async function sendMessageAction(conversationId: string, authorId: string, content: string) {
    if (!conversationId || !authorId || !content.trim()) {
        return { error: 'Invalid input' };
    }

    const supabase = await createClient();

    // 1. Insérer le message
    const { error: messageError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        auteur_id: authorId,
        contenu: content.trim(),
    });

    if (messageError) {
        console.error("Error sending message:", messageError);
        return { error: messageError };
    }

    // 2. Mettre à jour le timestamp de la conversation pour le tri
    const { error: convoError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    if (convoError) {
        // Ne pas bloquer si cette mise à jour échoue, mais le logger
        console.error("Error updating conversation timestamp:", convoError);
    }

    return { success: true };
}
