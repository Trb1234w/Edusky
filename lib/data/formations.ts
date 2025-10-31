import { createClient } from "@/lib/supabase/client";

export async function getFormations(filters: Record<string, any>) {
  console.log("getFormations appelé avec filters:", filters);
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_formations', {
    search_term: filters.search,
    category_slug: filters.categorySlug,
    niveau_filter: filters.niveau,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    min_rating: filters.minRating,
    sort_by: filters.sortBy
  });

  if (error) {
    console.error("Error fetching formations via RPC:", error);
    return { data: [], error };
  }

  return { data, error };
}
