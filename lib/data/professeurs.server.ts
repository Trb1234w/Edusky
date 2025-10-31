import { createClient } from '@supabase/supabase-js';

export async function getProfesseurById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.rpc('get_professeur_by_id', {
    professeur_id: id,
  });

  if (error) {
    console.error("Error fetching professeur by ID via RPC:", error);
    return { data: null, error };
  }

  // RPC returns an array, but get_professeur_by_id should return a single row
  return { data: data ? data[0] : null, error };
}
