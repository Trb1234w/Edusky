import { createClient } from "@/lib/supabase/server";

/**
 * Récupère toutes les conversations d'un utilisateur, avec les détails des autres participants.
 */
export async function getUserConversations(userId: string) {
  const supabase = await createClient();

  // 1. Récupérer toutes les entrées de conversation_participants pour l'utilisateur actuel
  const { data: userParticipants, error: userParticipantsError } = await supabase
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
  const { data: allParticipants, error: allParticipantsError } = await supabase
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
