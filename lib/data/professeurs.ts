import { createClient } from "@/lib/supabase/client";

export async function getProfesseurs({
  search_term,
  min_rating,
  has_certification,
  sort_by,
  limit,
  offset,
}: {
  search_term?: string;
  min_rating?: number;
  has_certification?: boolean;
  sort_by?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_professeurs', {
    search_term: search_term,
    min_rating: min_rating,
    has_certification: has_certification,
    sort_by: sort_by,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Error fetching professeurs via RPC:", error);
    return { data: [], error };
  }

  return { data, error };
}
