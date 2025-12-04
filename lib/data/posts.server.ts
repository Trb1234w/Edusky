import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserLikedPostIds(userId: string) {
  if (!userId) {
    return { data: [], error: null };
  }
  noStore(); // Important pour que cette donnée soit toujours fraîche pour l'utilisateur connecté
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('likes')
    .select('parent_id')
    .eq('user_id', userId)
    .eq('parent_type', 'post');

  if (error) {
    console.error("Error fetching user liked post IDs:", error);
    return { data: [], error };
  }

  // Retourner un simple tableau d'IDs
  return { data: data.map(like => like.parent_id), error: null };
}

export async function getAllFeedPosts(userId?: string, limit: number = 10, cursor?: string) {
  noStore();
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Utiliser la fonction RPC optimisée avec pagination
  const { data, error } = await supabase.rpc('get_feed_posts_optimized', {
    p_user_id: userId || null,
    p_limit: limit,
    p_cursor: cursor || null
  });

  if (error) {
    console.error("Error fetching feed posts:", error);
    return { data: [], error };
  }

  if (!data || data.length === 0) {
    return { data: [], error: null };
  }

  // Transformer les données en format attendu par les composants
  const posts = data.map((row: any) => ({
    id: row.id,
    authorId: row.auteur_id,
    author: row.auteur_full_name || 'Utilisateur inconnu',
    authorUsername: row.auteur_username,
    authorRole: row.auteur_prenom || '',
    authorAvatar: row.auteur_avatar_url || '/placeholder.svg',
    content: row.contenu,
    media: row.media || null,
    timestamp: row.created_at,
    likes: row.likes_count,
    comments: row.comments_count,
    shares: row.shares_count,
    liked: row.is_liked,
    sharedPost: row.shared_post_id ? {
      id: row.shared_post_id,
      authorId: row.shared_post_auteur_id,
      author: row.shared_post_auteur_full_name || 'Utilisateur inconnu',
      authorUsername: row.shared_post_auteur_username,
      authorRole: row.shared_post_auteur_prenom || '',
      authorAvatar: row.shared_post_auteur_avatar_url || '/placeholder.svg',
      content: row.shared_post_contenu,
      media: row.shared_post_media || null,
      timestamp: row.shared_post_created_at,
      likes: row.shared_post_likes_count,
      comments: row.shared_post_comments_count,
      shares: row.shared_post_shares_count,
      liked: row.shared_post_is_liked,
    } : null
  }));

  return { data: posts, error: null };
}

/**
 * Récupère tous les posts d'un auteur spécifique pour sa page de profil.
 * @param authorId L'ID de l'auteur des posts à récupérer.
 * @param currentUserId L'ID de l'utilisateur qui consulte la page (pour déterminer le statut 'liked').
 * @returns Un objet contenant la liste des posts de l'auteur.
 */
export async function getPostsByAuthorId(authorId: string, currentUserId?: string) {
  noStore();
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Utiliser la fonction RPC optimisée
  const { data, error } = await supabase.rpc('get_posts_by_author_optimized', {
    p_author_id: authorId,
    p_user_id: currentUserId || null
  });

  if (error) {
    console.error(`Error fetching posts for author ${authorId}:`, error);
    return { data: [], error };
  }

  if (!data || data.length === 0) {
    return { data: [], error: null };
  }

  // Transformer les données en format attendu par les composants
  const posts = data.map((row: any) => ({
    id: row.id,
    authorId: row.auteur_id,
    author: row.auteur_full_name || 'Utilisateur inconnu',
    authorUsername: row.auteur_username,
    authorRole: row.auteur_prenom || '',
    authorAvatar: row.auteur_avatar_url || '/placeholder.svg',
    content: row.contenu,
    media: row.media || null,
    timestamp: row.created_at,
    likes: row.likes_count,
    comments: row.comments_count,
    shares: row.shares_count,
    liked: row.is_liked,
    sharedPost: row.shared_post_id ? {
      id: row.shared_post_id,
      authorId: row.shared_post_auteur_id,
      author: row.shared_post_auteur_full_name || 'Utilisateur inconnu',
      authorUsername: row.shared_post_auteur_username,
      authorRole: row.shared_post_auteur_prenom || '',
      authorAvatar: row.shared_post_auteur_avatar_url || '/placeholder.svg',
      content: row.shared_post_contenu,
      media: row.shared_post_media || null,
      timestamp: row.shared_post_created_at,
      likes: row.shared_post_likes_count,
      comments: row.shared_post_comments_count,
      shares: row.shared_post_shares_count,
      liked: row.shared_post_is_liked,
    } : null
  }));

  return { data: posts, error: null };
}
