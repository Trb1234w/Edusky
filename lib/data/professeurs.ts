import { createClient } from "@/lib/supabase/client";

export async function getProfesseurs({
  search_term,
  min_rating,
  has_certification,
  sort_by,
  limit,
  offset,
  // Nouveaux filtres
  type,
  specialite,
  pays_id,
  ville_id,
  quartier_id,
  min_experience,
  max_experience,
  min_tarif,
  max_tarif,
  langue,
  min_etudiants,
  is_verified,
  genre,
}: {
  search_term?: string;
  min_rating?: number;
  has_certification?: boolean;
  sort_by?: string;
  limit?: number;
  offset?: number;
  // Nouveaux paramètres
  type?: string;
  specialite?: string;
  pays_id?: string;
  ville_id?: string;
  quartier_id?: string;
  min_experience?: number;
  max_experience?: number;
  min_tarif?: number;
  max_tarif?: number;
  langue?: string;
  min_etudiants?: number;
  is_verified?: boolean;
  genre?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_professeurs', {
    search_term: search_term || null,
    min_rating: min_rating || 0,
    has_certification: has_certification ?? null,
    sort_by: sort_by || 'note_moyenne_desc',
    p_limit: limit || 100,
    p_offset: offset || 0,
    // Nouveaux filtres
    type_filter: type || null,
    specialite_filter: specialite || null,
    pays_id_filter: pays_id || null,
    ville_id_filter: ville_id || null,
    quartier_id_filter: quartier_id || null,
    min_experience: min_experience ?? null,
    max_experience: max_experience ?? null,
    min_tarif: min_tarif ?? null,
    max_tarif: max_tarif ?? null,
    langue_filter: langue || null,
    min_etudiants: min_etudiants ?? null,
    is_verified_filter: is_verified ?? null,
    genre_filter: genre || null,
  });

  if (error) {
    console.error("Error fetching professeurs via RPC:", error);
    return { data: [], error };
  }

  return { data, error };
}

