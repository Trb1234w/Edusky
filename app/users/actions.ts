'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function followUserAction(followerId: string, followedId: string) {
    if (!followerId || !followedId || followerId === followedId) {
        return { error: 'Action non autorisée.' };
    }

    const supabase = await createClient();

    // Vérifier si le suivi existe déjà pour éviter les doublons
    const { data: existingFollow, error: fetchError } = await supabase
        .from('suivis')
        .select('id')
        .eq('follower_id', followerId)
        .eq('followed_id', followedId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = 0 ligne trouvée
        console.error("Erreur lors de la vérification du suivi:", fetchError);
        return { error: 'Erreur serveur.' };
    }

    if (existingFollow) {
        return { success: true, message: 'Déjà suivi.' };
    }

    // Créer le nouveau suivi
    const { error: insertError } = await supabase.from('suivis').insert({
        follower_id: followerId,
        followed_id: followedId,
    });

    if (insertError) {
        console.error("Erreur lors de la création du suivi:", insertError);
        return { error: 'Impossible de suivre cet utilisateur.' };
    }

    // Invalider le cache pour potentiellement rafraîchir les données liées aux suivis
    revalidatePath('/feed');
    revalidatePath(`/profil/${followedId}`); // Si une page de profil existe

    return { success: true };
}
