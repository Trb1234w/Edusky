import { createClient } from "@/lib/supabase/client";

export async function getClubs({
  limit = 10,
  offset = 0,
  search,
  statut,
  minCapacite,
  sortBy,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  statut?: string;
  minCapacite?: number;
  sortBy?: "new" | "popular";
}) {
  const supabase = createClient();
  let query = supabase
    .from("clubs")
    .select(
      `
      id,
      nom,
      slug,
      description,
      image_url,
      statut,
      capacite,
      leader:profiles(full_name, avatar_url),
      categories(id, nom, slug)
    `
    )
    .eq("statut", "ouvert") // Default to open clubs
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("nom", `%${search}%`);
  }

  if (statut) {
    query = query.eq("statut", statut);
  }

  if (minCapacite) {
    query = query.gte("capacite", minCapacite);
  }

  if (sortBy === "new") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "popular") {
    // Assuming popularity can be derived from capacite for now
    query = query.order("capacite", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // Default sort
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching clubs:", error);
    return { data: [], error };
  }

  return { data, error };
}

export async function getClubById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select(
      `
      *,
      leader:profiles(full_name, avatar_url),
      categories(id, nom, slug, description)
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
