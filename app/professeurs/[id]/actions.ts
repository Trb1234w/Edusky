'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReservation(
  professeurId: string,
  formData: {
    date_heure_debut: Date;
    date_heure_fin: Date;
    message_utilisateur?: string;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "You must be logged in to make a reservation." };
  }

  const { data, error } = await supabase
    .from("reservations_professeur")
    .insert([
      {
        professeur_id: professeurId,
        user_id: user.id,
        date_heure_debut: formData.date_heure_debut.toISOString(),
        date_heure_fin: formData.date_heure_fin.toISOString(),
        message_utilisateur: formData.message_utilisateur,
      },
    ]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/professeurs/${professeurId}`);
  return { success: true, data };
}
