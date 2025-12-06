import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Utiliser le client ADMIN pour contourner les RLS lors de la récupération des participants
// Cela permet de voir les autres participants même si les politiques RLS sont strictes
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


/**
 * Récupère toutes les conversations d'un utilisateur, avec les détails des autres participants.
 */
export async function getUserConversations(userId: string) {
  // On utilise supabaseAdmin pour les requêtes de données

  // 1. Récupérer toutes les entrées de conversation_participants pour l'utilisateur actuel
  const { data: userParticipants, error: userParticipantsError } = await supabaseAdmin
    .from('conversation_participants')
    .select(`
      conversation_id,
      conversations(
        id,
        updated_at
      )
    `)
    .eq('user_id', userId);

  if (userParticipantsError) {
    console.error("Erreur lors de la récupération des participations de l'utilisateur:", userParticipantsError);
    return { data: null, error: userParticipantsError };
  }

  if (!userParticipants || userParticipants.length === 0) {
    return { data: [], error: null };
  }

  const conversationIds = userParticipants.map(p => p.conversation_id);

  // 2. Pour chaque conversation, récupérer tous les participants et leurs profils
  const { data: allParticipants, error: allParticipantsError } = await supabaseAdmin
    .from('conversation_participants')
    .select(`
      conversation_id,
      profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .in('conversation_id', conversationIds);

  if (allParticipantsError) {
    console.error("Erreur lors de la récupération de tous les participants:", allParticipantsError);
    return { data: null, error: allParticipantsError };
  }

  // 2.5. Récupérer les messages non lus pour ces conversations
  const { data: unreadMessages, error: unreadError } = await supabaseAdmin
    .from('messages')
    .select('conversation_id')
    .eq('lu', false)
    .neq('auteur_id', userId)
    .in('conversation_id', conversationIds);

  if (unreadError) {
    console.error("Erreur lors de la récupération des messages non lus:", unreadError);
  }

  const unreadCounts = (unreadMessages || []).reduce((acc: any, msg: any) => {
    acc[msg.conversation_id] = (acc[msg.conversation_id] || 0) + 1;
    return acc;
  }, {});

  // 3. Combiner les données pour former les conversations formatées
  const formattedConversations = userParticipants.map(userPart => {
    const convo = Array.isArray(userPart.conversations) ? userPart.conversations[0] : userPart.conversations;

    if (!convo) return null;

    const participantsInConvo = allParticipants.filter(p => p.conversation_id === convo.id);

    const otherParticipants = participantsInConvo
      .map((p: any) => Array.isArray(p.profiles) ? p.profiles[0] : p.profiles)
      .filter((profile: any) => profile && profile.id !== userId);

    // Pour l'instant, on gère les conversations à 2. Le nom est celui de l'autre participant.
    const title = otherParticipants[0]?.full_name || 'Conversation';
    const avatarUrl = otherParticipants[0]?.avatar_url || null;

    return {
      id: convo.id,
      updated_at: convo.updated_at,
      title: title,
      avatarUrl: avatarUrl,
      participants: otherParticipants,
      unreadCount: unreadCounts[convo.id] || 0,
    };
  }).filter(Boolean) // Remove nulls
    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); // Sort by updated_at

  // Filter out duplicate conversations (if any) based on id
  const uniqueConversations = Array.from(new Map(formattedConversations.map((convo: any) => [convo.id, convo])).values());

  return { data: uniqueConversations, error: null };
}

/**
 * Récupère la liste des utilisateurs suivis par l'utilisateur actuel.
 */
export async function getFollowedUsers(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('suivis')
    .select(`
      followed_id,
      followed:profiles!followed_id(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('follower_id', userId);

  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs suivis:", error);
    return { data: null, error };
  }

  const followedUsers = data.map(item => item.followed);

  return { data: followedUsers, error: null };
}
