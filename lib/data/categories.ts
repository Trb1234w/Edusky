import { createClient } from "@/lib/supabase/client";

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, nom, slug")
    .order("nom", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return { data: [], error };
  }

  return { data, error };
}