'use server'

import { createClient } from "@/lib/supabase/server"; // Utiliser le client serveur configuré
import { createClient as createAdminClient } from "@supabase/supabase-js"; // Pour le client admin
import { revalidatePath } from "next/cache";

import { createNotification } from "@/lib/notifications";
import { sendPushNotification } from "@/lib/push";

// La fonction accepte maintenant l'ID de l'auteur en argument
export async function createPostAction(content: string, authorId: string, media: { images: string[], video: string | undefined }) {
  if (!authorId) {
    return { error: "Utilisateur non identifié. Action non autorisée." };
  }

  // On autorise un post avec seulement des médias
  if (!content.trim() && media.images.length === 0 && !media.video) {
    return { error: "Le contenu ne peut pas être vide." };
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const postData: any = {
    auteur_id: authorId,
    contenu: content,
    media: media, // On insère directement l'objet media
  };

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
  console.log(`[toggleLike] Action déclenchée pour postId: ${postId}, userId: ${userId}`);
  const supabase = await createClient();

  if (!userId) {
    console.error("[toggleLike] Erreur: userId est manquant.");
    return { error: "Utilisateur non identifié." };
  }

  // Étape 1: Vérifier si le like existe déjà
  console.log("[toggleLike] Étape 1: Vérification du like existant...");
  const { data: existingLike, error: fetchError } = await supabase
    .from('likes')
    .select('id')
    .eq('parent_id', postId)
    .eq('user_id', userId)
    .eq('parent_type', 'post')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error("[toggleLike] Erreur lors de la vérification du like:", fetchError);
    return { error: "Erreur lors de la vérification du like." };
  }
  console.log(`[toggleLike] Like existant trouvé:`, existingLike);

  if (existingLike) {
    // Étape 2a: Le like existe, donc on le supprime (unlike)
    console.log(`[toggleLike] Étape 2a: Le like existe. Tentative de suppression de l'id: ${existingLike.id}`);
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error("[toggleLike] Erreur lors de la suppression du like:", deleteError);
      return { error: "Erreur lors de la suppression du like." };
    }
    console.log("[toggleLike] Succès: Like supprimé.");

  } else {
    // Étape 2b: Le like n'existe pas, donc on l'ajoute (like)
    console.log("[toggleLike] Étape 2b: Le like n'existe pas. Tentative d'insertion.");
    const { error: insertError } = await supabase
      .from('likes')
      .insert({
        parent_id: postId,
        user_id: userId,
        parent_type: 'post',
      });

    if (insertError) {
      console.error("[toggleLike] Erreur lors de l'ajout du like:", insertError);
      return { error: "Erreur lors de l'ajout du like." };
    }
    console.log("[toggleLike] Succès: Like ajouté.");

    // --- NOTIFICATION HANDLED BY DB TRIGGER (For History) ---

    // --- DIRECT WEB PUSH (For Immediate Local/Prod functionality) ---
    // On envoie le push directement depuis le serveur Next.js
    if (!existingLike) { // New Like
      // Récupérer l'auteur du post
      const { data: post } = await supabase.from('postes').select('auteur_id').eq('id', postId).single();

      if (post && post.auteur_id && post.auteur_id !== userId) {
        // Récupérer le nom du likeur
        const { data: liker } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
        const likerName = liker?.full_name || "Quelqu'un";

        // Envoyer le Push
        sendPushNotification({
          userId: post.auteur_id,
          title: "Nouveau J'aime",
          body: `${likerName} a aimé votre publication.`,
          url: '/feed'
        }).catch(err => console.error("Push Error (Direct):", err));
      }
    }
    // -------------------------------------------------------------

  }

  // Étape 3: Revalidation du cache
  console.log("[toggleLike] Étape 3: Revalidation des chemins '/feed' et '/dashboard'.");
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

  // --- NOTIFICATION HANDLED BY DB TRIGGER (History) ---

  // --- DIRECT PUSH (OneSignal) ---
  const { data: postAuthor } = await supabase.from('postes').select('auteur_id').eq('id', postId).single();
  if (postAuthor && postAuthor.auteur_id && postAuthor.auteur_id !== authorId) {
    const { data: commenter } = await supabase.from('profiles').select('full_name').eq('id', authorId).single();
    const commenterName = commenter?.full_name || "Quelqu'un";

    sendPushNotification({
      userId: postAuthor.auteur_id,
      title: "Nouveau commentaire",
      body: `${commenterName} a commenté votre publication.`,
      url: `/feed`
    }).catch(err => console.error("Push Error (Comment):", err));
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

  // --- NOTIFICATION HANDLED BY DB TRIGGER (History) ---

  // --- DIRECT PUSH (OneSignal) ---
  const { data: originalPost } = await supabaseAdmin.from('postes').select('auteur_id').eq('id', originalPostId).single();
  if (originalPost && originalPost.auteur_id && originalPost.auteur_id !== authorId) {
    const { data: sharer } = await supabaseAdmin.from('profiles').select('full_name').eq('id', authorId).single();
    const sharerName = sharer?.full_name || "Quelqu'un";

    sendPushNotification({
      userId: originalPost.auteur_id,
      title: "Publication partagée",
      body: `${sharerName} a partagé votre publication.`,
      url: `/feed`
    }).catch(err => console.error("Push Error (Share):", err));
  }


  revalidatePath("/dashboard");
  revalidatePath("/feed");

  return { success: true };
}

export async function reportContent(type: 'post' | 'comment' | 'user', targetId: string, reason: string, userId: string) {
  if (!targetId || !reason || !userId) {
    return { error: "Informations manquantes pour le signalement." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('signalements')
    .insert({
      user_id: userId,
      type: type,
      target_id: targetId,
      raison: reason,
    });

  if (error) {
    console.error("Erreur lors du signalement:", error);
    return { error: "Une erreur est survenue lors de l'envoi du signalement." };
  }

  return { success: true };
}
