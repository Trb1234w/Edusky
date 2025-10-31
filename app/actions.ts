'use server'

import { createClient } from "@/lib/supabase/server"; // Utiliser le client serveur configuré
import { createClient as createAdminClient } from "@supabase/supabase-js"; // Pour le client admin
import { revalidatePath } from "next/cache";

// La fonction accepte maintenant l'ID de l'auteur en argument
export async function createPostAction(content: string, authorId: string, imageUrl?: string) {
  if (!authorId) {
    return { error: "Utilisateur non identifié. Action non autorisée." };
  }

  // On autorise un post avec seulement une image
  if (!content.trim() && !imageUrl) {
    return { error: "Le contenu ne peut pas être vide." };
  }

  // On utilise le client ADMIN pour insérer, comme le font les autres fonctions serveur du projet
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const postData: any = {
    auteur_id: authorId,
    contenu: content,
  };

  if (imageUrl) {
    // La colonne media est un jsonb, on peut y stocker une structure
    postData.media = [{ type: 'image', url: imageUrl }];
  }

  const { error } = await supabaseAdmin.from("postes").insert([postData]);

  if (error) {
    console.error("Erreur lors de la création du post:", error);
    return { error: "Une erreur est survenue lors de la publication." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/feed");

  return { success: true };
}

export async function toggleLike(postId: string, userId: string) {
  const supabase = await createClient(); // Utiliser le client serveur normal

  // Vérifier si l'utilisateur a déjà liké ce post
  const { data: existingLike, error: fetchError } = await supabase
    .from('likes')
    .select('id')
    .eq('parent_id', postId)
    .eq('user_id', userId)
    .eq('parent_type', 'post')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = pas de ligne trouvée (ce qui est normal si pas encore liké)
    console.error("Erreur lors de la vérification du like:", fetchError);
    return { error: "Erreur lors de la vérification du like." };
  }

  if (existingLike) {
    // Si le like existe, le supprimer
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error("Erreur lors de la suppression du like:", deleteError);
      return { error: "Erreur lors de la suppression du like." };
    }
  } else {
    // Si le like n'existe pas, l'ajouter
    const { error: insertError } = await supabase
      .from('likes')
      .insert({
        parent_id: postId,
        user_id: userId,
        parent_type: 'post',
      });

    if (insertError) {
      console.error("Erreur lors de l'ajout du like:", insertError);
      return { error: "Erreur lors de l'ajout du like." };
    }
  }

  // Invalider le cache pour rafraîchir les pages
  revalidatePath("/feed");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function addComment(postId: string, authorId: string, content: string) {
  if (!postId || !authorId || !content.trim()) {
    return { error: "Post ID, Author ID, and content are required." };
  }

  const supabase = await createClient(); // Utiliser le client serveur normal

  const { error } = await supabase
    .from('commentaires')
    .insert({
      parent_poste: postId,
      auteur_id: authorId,
      contenu: content,
    });

  if (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    return { error: "Une erreur est survenue lors de l'ajout du commentaire." };
  }

  revalidatePath("/feed");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function sharePostAction(originalPostId: string, authorId: string) {
  if (!originalPostId || !authorId) {
    return { error: "L'ID du post original et l'ID de l'auteur sont requis." };
  }

  // Pour cette action, il est plus sûr d'utiliser le client admin pour outrepasser les RLS
  // si un utilisateur partage un post qu'il ne pourrait normalement pas créer.
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("postes").insert({
    partage_de: originalPostId,
    auteur_id: authorId,
    // Le contenu peut être ajouté dans une version future si l'on permet de commenter en partageant
  });

  if (error) {
    console.error("Erreur lors du partage du post:", error);
    return { error: "Une erreur est survenue lors du partage du post." };
  }

  revalidatePath("/feed");
  revalidatePath("/dashboard");

  return { success: true };
}
