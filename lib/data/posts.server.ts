import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from 'next/cache';

export async function getAllFeedPosts(currentUserId?: string | null) {
  // Désactive le cache de données pour cette fonction. C'est la correction pour le bug de "like global".
  noStore();

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: postsData, error: postsError } = await supabase
    .from('postes')
    .select(`
      id,
      contenu,
      media,
      created_at,
      auteur:profiles!auteur_id(id, full_name, avatar_url, prenom, nom),
      shared_post:partage_de(
        id,
        contenu,
        media,
        created_at,
        auteur:profiles!auteur_id(id, full_name, avatar_url, prenom, nom)
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
      
      let hasLiked = false;
      if (currentUserId) {
        const { data: likedStatus, error: likedError } = await supabase.rpc('user_has_liked', { post_id: post.id, user_id: currentUserId });
        if (!likedError && likedStatus !== null) {
          hasLiked = likedStatus;
        }
      }

      if (likesError) console.error("Error fetching likes count for post", post.id, likesError);
      if (commentsError) console.error("Error fetching comments count for post", post.id, commentsError);
      if (sharesError) console.error("Error fetching shares count for post", post.id, sharesError);

      let sharedPostData = null;
      if (post.shared_post && post.shared_post.id) {
        sharedPostData = {
          id: post.shared_post.id,
          authorId: post.shared_post.auteur?.id, // Ajout de l'ID de l'auteur du post partagé
          author: post.shared_post.auteur?.full_name || 'Utilisateur inconnu',
          authorRole: post.shared_post.auteur?.prenom || '',
          authorAvatar: post.shared_post.auteur?.avatar_url || '/placeholder.svg',
          content: post.shared_post.contenu,
          image: post.shared_post.media?.[0]?.url || null,
          timestamp: post.shared_post.created_at,
          likes: 0, comments: 0, shares: 0, liked: false, // Placeholders
        };
      }

      return {
        id: post.id,
        authorId: post.auteur?.id, // Correction: s'assurer que post.auteur n'est pas null
        author: post.auteur?.full_name || 'Utilisateur inconnu',
        authorRole: post.auteur?.prenom || '',
        authorAvatar: post.auteur?.avatar_url || '/placeholder.svg',
        content: post.contenu,
        image: post.media?.[0]?.url || null,
        timestamp: post.created_at,
        likes: likesCount || 0,
        comments: commentsCount || 0,
        shares: sharesCount || 0,
        liked: hasLiked,
        sharedPost: sharedPostData,
      };
    })
  );

  return { data: postsWithAggregates, error: null };
}
