'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

/**
 * Action pour suivre ou ne plus suivre un utilisateur.
 * @param followerId L'ID de l'utilisateur qui effectue l'action.
 * @param followedId L'ID de l'utilisateur à suivre/ne plus suivre.
 * @returns Un objet avec une erreur en cas de problème.
 */
export async function followUserAction(followerId: string, followedId: string) {
  if (!followerId || !followedId || followerId === followedId) {
    return { error: "Action non valide." };
  }

  const supabase = await createClient();

  // Vérifier si le suivi existe déjà
  const { data: existingFollow, error: fetchError } = await supabase
    .from('suivis')
    .select('id')
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = 0 rows
    console.error("Erreur lors de la vérification du suivi:", fetchError);
    return { error: "Erreur lors de la vérification du suivi." };
  }

  if (existingFollow) {
    // Le suivi existe, on le supprime (unfollow)
    const { error: deleteError } = await supabase
      .from('suivis')
      .delete()
      .eq('id', existingFollow.id);

    if (deleteError) {
      console.error("Erreur lors de la suppression du suivi:", deleteError);
      return { error: "Erreur lors de la suppression du suivi." };
    }
  } else {
    // Le suivi n'existe pas, on l'ajoute (follow)
    const { error: insertError } = await supabase
      .from('suivis')
      .insert({ follower_id: followerId, followed_id: followedId });

    if (insertError) {
      console.error("Erreur lors de l'ajout du suivi:", insertError);
      return { error: "Erreur lors de l'ajout du suivi." };
    }

    // --- NOTIFICATION START ---
    // Récupérer le nom du follower
    const { data: follower } = await supabase.from('profiles').select('full_name').eq('id', followerId).single();
    const followerName = follower?.full_name || "Quelqu'un";

    await createNotification({
      userId: followedId,
      type: 'follow',
      content: `${followerName} a commencé à vous suivre.`,
      refId: followerId,
      refTable: 'profiles',
      metadata: { follower_id: followerId }
    });
    // --- NOTIFICATION END ---
  }

  // Pour revalider la page, nous avons besoin du nom d'utilisateur du profil visité.
  // On le récupère ici.
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', followedId)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  // On revalide aussi le feed, car les suggestions peuvent changer.
  revalidatePath('/feed');
  revalidatePath('/dashboard');

  return { success: true };
}