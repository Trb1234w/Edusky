import { createClient } from "@/lib/supabase/client";

export async function getEvenements({
  limit = 10,
  offset = 0,
  search,
  dateFilter,
  location,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  dateFilter?: string;
  location?: string;
}) {
  const supabase = createClient();
  let query = supabase
    .from("evenements")
    .select(
      `
      id,
      titre,
      slug,
      extrait,
      image_url,
      date_debut,
      date_fin,
      mode,
      lieu,
      capacite,
      organisateur:profiles(full_name, avatar_url),
      categories(id, nom, slug)
    `
    )
    .order("date_debut", { ascending: true })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("titre", `%${search}%`);
  }

  if (location) {
    query = query.ilike("lieu", `%${location}%`);
  }



  const { data, error } = await query;

  if (error) {
    console.error("Error fetching evenements:", error);
    return { data: [], error };
  }

  return { data, error };
}

export async function getEvenementById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("evenements")
    .select(
      `
      *,
      organisateur:profiles(full_name, avatar_url),
      categories(id, nom, slug, description),
      pays(id, nom),
      villes(id, nom),
      quartiers(id, nom)
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
