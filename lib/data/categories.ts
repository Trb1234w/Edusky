import { createClient } from "@/lib/supabase/client";

export async function getCategories(options?: { scope?: string }) {
  const supabase = createClient();

  let query = supabase
    .from("categories")
    .select("id, nom, slug, parent_id")
    .order("nom", { ascending: true });

  // Filter by scope if provided
  if (options?.scope) {
    query = query.eq("scope", options.scope);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching categories:", error);
    return { data: [], error };
  }

  return { data, error };
}