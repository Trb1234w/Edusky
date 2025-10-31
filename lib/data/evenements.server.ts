import { createClient } from '@supabase/supabase-js';

export async function getEvenementById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("evenements")
    .select(
      `
        *,
        categorie:categorie_id(*),
        organisateur:profiles!organisateur_id(*),
        pays:pays_id(*),
        ville:ville_id(*),
        quartier:quartier_id(*),
        inscriptions:inscriptions_evenement(*)
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching evenement by ID:", error);
    return { data: null, error };
  }

  return { data, error };
}
