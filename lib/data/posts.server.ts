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

export async function getAllFeedPosts(userId?: string) {
  noStore();
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Récupérer les IDs des posts likés par l'utilisateur si l'ID est fourni
  const { data: likedPostIds, error: likedPostsError } = userId
    ? await getUserLikedPostIds(userId)
    : { data: [], error: null };

  if (likedPostsError) {
    console.error("Error fetching user liked posts:", likedPostsError);
    // On peut décider de continuer sans les informations de like ou de retourner une erreur
  }

  const { data: postsData, error: postsError } = await supabase
    .from('postes')
    .select(`
      id,
      contenu,
      media,
      created_at,
      auteur:profiles!auteur_id(id, full_name, username, avatar_url, prenom, nom),
      shared_post:partage_de(
        id,
        contenu,
        media,
        created_at,
        auteur:profiles!auteur_id(id, full_name, username, avatar_url, prenom, nom)
      )
    `)
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error("Error fetching base posts:", postsError);
    return { data: [], error: postsError };
  }

  if (!postsData || postsData.length === 0) {
    return { data: [], error: null };
  }

  const postsWithAggregates = await Promise.all(
    postsData.map(async (post) => {
      const { data: likesCount, error: likesError } = await supabase.rpc('count_likes', { post_id: post.id });
      const { data: commentsCount, error: commentsError } = await supabase.rpc('count_comments', { post_id: post.id });
      const { data: sharesCount, error: sharesError } = await supabase.rpc('count_shares', { post_id: post.id });

      if (likesError) console.error("Error fetching likes count for post", post.id, likesError);
      if (commentsError) console.error("Error fetching comments count for post", post.id, commentsError);
      if (sharesError) console.error("Error fetching shares count for post", post.id, sharesError);

      let sharedPostData = null;
      if (post.shared_post && post.shared_post.id) {
        const { data: sharedLikesCount } = await supabase.rpc('count_likes', { post_id: post.shared_post.id });
        const { data: sharedCommentsCount } = await supabase.rpc('count_comments', { post_id: post.shared_post.id });
        const { data: sharedSharesCount } = await supabase.rpc('count_shares', { post_id: post.shared_post.id });

        sharedPostData = {
          id: post.shared_post.id,
          authorId: post.shared_post.auteur?.id,
          author: post.shared_post.auteur?.full_name || 'Utilisateur inconnu',
          authorUsername: post.shared_post.auteur?.username,
          authorRole: post.shared_post.auteur?.prenom || '',
          authorAvatar: post.shared_post.auteur?.avatar_url || '/placeholder.svg',
          content: post.shared_post.contenu,
          media: post.shared_post.media || null,
          timestamp: post.shared_post.created_at,
          likes: sharedLikesCount || 0,
          comments: sharedCommentsCount || 0,
          shares: sharedSharesCount || 0,
          liked: likedPostIds ? likedPostIds.includes(post.shared_post.id) : false,
        };
      }

      return {
        id: post.id,
        authorId: post.auteur?.id,
        author: post.auteur?.full_name || 'Utilisateur inconnu',
        authorUsername: post.auteur?.username,
        authorRole: post.auteur?.prenom || '',
        authorAvatar: post.auteur?.avatar_url || '/placeholder.svg',
        content: post.contenu,
        media: post.media || null,
        timestamp: post.created_at,
        likes: likesCount || 0,
        comments: commentsCount || 0,
        shares: sharesCount || 0,
        liked: likedPostIds ? likedPostIds.includes(post.id) : false,
        sharedPost: sharedPostData,
      };
    })
  );

  return { data: postsWithAggregates, error: null };
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

  // Récupérer les IDs des posts likés par l'utilisateur consultant la page
  const { data: likedPostIds, error: likedPostsError } = currentUserId
    ? await getUserLikedPostIds(currentUserId)
    : { data: [], error: null };

  if (likedPostsError) {
    console.error("Error fetching user liked posts for profile page:", likedPostsError);
  }

  // Récupérer les posts de l'auteur spécifié
  const { data: postsData, error: postsError } = await supabase
    .from('postes')
    .select(`
      id,
      contenu,
      media,
      created_at,
      auteur:profiles!auteur_id(id, full_name, username, avatar_url, prenom, nom),
      shared_post:partage_de(
        id,
        contenu,
        media,
        created_at,
        auteur:profiles!auteur_id(id, full_name, username, avatar_url, prenom, nom)
      )
    `)
    .eq('auteur_id', authorId) // Filtre pour ne prendre que les posts de cet auteur
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error(`Error fetching posts for author ${authorId}:`, postsError);
    return { data: [], error: postsError };
  }

  if (!postsData || postsData.length === 0) {
    return { data: [], error: null };
  }

  // Enrichir les posts avec les comptes et le statut 'liked'
  const postsWithAggregates = await Promise.all(
    postsData.map(async (post) => {
      const { data: likesCount, error: likesError } = await supabase.rpc('count_likes', { post_id: post.id });
      const { data: commentsCount, error: commentsError } = await supabase.rpc('count_comments', { post_id: post.id });
      const { data: sharesCount, error: sharesError } = await supabase.rpc('count_shares', { post_id: post.id });

      // Gestion des erreurs de comptage
      if (likesError) console.error("Error fetching likes count for post", post.id, likesError);
      if (commentsError) console.error("Error fetching comments count for post", post.id, commentsError);
      if (sharesError) console.error("Error fetching shares count for post", post.id, sharesError);

      let sharedPostData = null;
      const sharedPostRaw = Array.isArray(post.shared_post) ? post.shared_post[0] : post.shared_post;

      if (sharedPostRaw) {
        const { data: sharedLikesCount } = await supabase.rpc('count_likes', { post_id: sharedPostRaw.id });
        const { data: sharedCommentsCount } = await supabase.rpc('count_comments', { post_id: sharedPostRaw.id });
        const { data: sharedSharesCount } = await supabase.rpc('count_shares', { post_id: sharedPostRaw.id });

        const sharedPostAuthor = Array.isArray(sharedPostRaw.auteur) ? sharedPostRaw.auteur[0] : sharedPostRaw.auteur;

        sharedPostData = {
          id: sharedPostRaw.id,
          authorId: sharedPostAuthor?.id,
          author: sharedPostAuthor?.full_name || 'Utilisateur inconnu',
          authorUsername: sharedPostAuthor?.username,
          authorRole: sharedPostAuthor?.prenom || '',
          authorAvatar: sharedPostAuthor?.avatar_url || '/placeholder.svg',
          content: sharedPostRaw.contenu,
          media: sharedPostRaw.media || null,
          timestamp: sharedPostRaw.created_at,
          likes: sharedLikesCount || 0,
          comments: sharedCommentsCount || 0,
          shares: sharedSharesCount || 0,
          liked: likedPostIds ? likedPostIds.includes(sharedPostRaw.id) : false,
        };
      }

      const postAuthor = Array.isArray(post.auteur) ? post.auteur[0] : post.auteur;

      return {
        id: post.id,
        authorId: postAuthor?.id,
        author: postAuthor?.full_name || 'Utilisateur inconnu',
        authorUsername: postAuthor?.username,
        authorRole: postAuthor?.prenom || '',
        authorAvatar: postAuthor?.avatar_url || '/placeholder.svg',
        content: post.contenu,
        media: post.media || null,
        timestamp: post.created_at,
        likes: likesCount || 0,
        comments: commentsCount || 0,
        shares: sharesCount || 0,
        liked: likedPostIds ? likedPostIds.includes(post.id) : false,
        sharedPost: sharedPostData,
      };
    })
  );

  return { data: postsWithAggregates, error: null };
}
