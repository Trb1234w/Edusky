import { createClient } from '@supabase/supabase-js';

export async function getProfesseurById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("professeurs")
    .select(
      `
        *,
        pays:pays_id(*),
        ville:ville_id(*),
        quartier:quartier_id(*)
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching professeur by ID:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function getReservationsByProfesseurId(professeurId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("reservations_professeur")
    .select("*")
    .eq("professeur_id", professeurId)
    .order("date_heure_debut", { ascending: true });

  if (error) {
    console.error("Error fetching reservations by professeur ID:", error);
    return { data: null, error };
  }

  return { data, error };
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
    .select('*')
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

