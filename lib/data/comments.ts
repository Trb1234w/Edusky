'use client'

import { createClient } from "@/lib/supabase/client"; // Utiliser le client client configuré

export async function getCommentsByPostId(postId: string) {
  if (!postId) {
    return { data: [], error: { message: "Post ID is required." } };
  }

  const supabase = createClient(); // Utiliser le client client configuré

  const { data, error } = await supabase
    .from('commentaires') // Table correcte pour les commentaires
    .select(`
      id,
      contenu,
      created_at,
      auteur:profiles!auteur_id(full_name, avatar_url, username) // Joindre avec profiles via auteur_id
    `)
    .eq('parent_poste', postId) // Colonne correcte pour l'ID du post
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching comments by post ID:", error);
  }

  return { data, error };
}
