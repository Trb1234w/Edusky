'use client'

import { createClient } from "@/lib/supabase/client";

export async function getPostsByAuthor(authorId: string) {
  if (!authorId) {
    return { data: [], error: { message: "Author ID is required." } };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('postes')
    .select(`
      id,
      contenu,
      media,
      created_at,
      auteur:profiles!inner(id, full_name, avatar_url, prenom, nom)
    `)
    .eq('auteur_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts by author:", error);
  }

  return { data, error };
}

// Fonctions SQL pour les counts et has_liked (à créer dans Supabase)
// CREATE FUNCTION count_likes(post_id uuid) RETURNS bigint LANGUAGE sql AS $$
//   SELECT count(*)::bigint FROM likes WHERE parent_id = post_id AND parent_type = 'post';
// $$;

// CREATE FUNCTION count_comments(post_id uuid) RETURNS bigint LANGUAGE sql AS $$
//   SELECT count(*)::bigint FROM commentaires WHERE parent_poste = post_id;
// $$;

// CREATE FUNCTION count_shares(post_id uuid) RETURNS bigint LANGUAGE sql AS $$
//   SELECT count(*)::bigint FROM postes WHERE partage_de = post_id;
// $$;

// CREATE FUNCTION user_has_liked(post_id uuid, user_id uuid) RETURNS boolean LANGUAGE sql AS $$
//   SELECT EXISTS(SELECT 1 FROM likes WHERE parent_id = post_id AND parent_type = 'post' AND user_id = user_id);
// $$;
