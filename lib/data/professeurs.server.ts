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

export async function getRelatedProfesseursBySpecialty(currentProfesseurId: string, specialties: string[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (!specialties || specialties.length === 0) {
    return { data: [], error: null };
  }

  // Get all professors that have at least one specialty in common
  const { data, error } = await supabaseAdmin
    .from('professeurs')
    .select(
      `
        *,
        profiles:id(full_name, avatar_url)
      `
    )
    .neq('id', currentProfesseurId)
    .limit(7)
    .order('note_moyenne', { ascending: false });

  if (error) {
    console.error('Error fetching related professeurs:', error);
    return { data: [], error };
  }

  // Filter professors that have at least one specialty in common
  const relatedProfesseurs = (data || []).filter((prof: any) => {
    if (!prof.specialites || !Array.isArray(prof.specialites)) return false;
    return prof.specialites.some((spec: string) => specialties.includes(spec));
  }).slice(0, 7);

  return { data: relatedProfesseurs, error: null };
}

