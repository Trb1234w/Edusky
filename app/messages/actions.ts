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

    // --- NOTIFICATION START ---
    // Récupérer les participants de la conversation pour notifier les autres
    const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

    if (participants) {
        // Récupérer le nom de l'expéditeur
        const { data: sender } = await supabase.from('profiles').select('full_name').eq('id', authorId).single();
        const senderName = sender?.full_name || "Quelqu'un";

        const notifications = participants
            .filter(p => p.user_id !== authorId) // Ne pas notifier l'expéditeur
            .map(p => ({
                userId: p.user_id,
                type: 'message' as const,
                content: `${senderName} vous a envoyé un message.`,
                refId: conversationId,
                refTable: 'conversations',
                metadata: { conversation_id: conversationId, sender_id: authorId }
            }));

        // Envoyer les notifications en parallèle
        // Note: createNotification est unitaire, donc on boucle.
        // Idéalement on ferait un batch insert si createNotification le supportait,
        // mais pour quelques participants ça va.
        // Il faut importer createNotification.
        const { createNotification } = await import("@/lib/notifications");

        await Promise.all(notifications.map(n => createNotification(n)));
    }
    // --- NOTIFICATION END ---

    return { success: true };
}

import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getConversation(conversationId: string, currentUserId: string) {
    // Use admin client to bypass RLS
    const supabase = supabaseAdmin;

    // 1. Fetch conversation details
    const { data: conversation, error: convoError } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .eq('id', conversationId)
        .single();

    if (convoError || !conversation) {
        return { error: 'Conversation not found' };
    }

    // 2. Fetch participants
    const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
            user_id,
            profiles(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId);

    if (participantsError) {
        return { error: 'Error fetching participants' };
    }

    // 3. Format
    const otherParticipants = participants
        .map((p: any) => Array.isArray(p.profiles) ? p.profiles[0] : p.profiles)
        .filter((profile: any) => profile && profile.id !== currentUserId);

    const title = otherParticipants[0]?.full_name || 'Conversation';
    const avatarUrl = otherParticipants[0]?.avatar_url || null;

    return {
        data: {
            id: conversation.id,
            updated_at: conversation.updated_at,
            title,
            avatarUrl,
            participants: otherParticipants
        }
    };
}
