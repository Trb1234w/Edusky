import { createClient } from '@supabase/supabase-js';

export async function getClubById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select(
      `
        *,
        categorie:categorie_id(*),
        leader:profiles!leader_id(*),
        inscriptions:inscriptions_club(*)
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching club by ID:", error);
    return { data: null, error };
  }

  return { data, error };
}
