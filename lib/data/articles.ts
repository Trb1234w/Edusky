import { createClient } from "@/lib/supabase/client";

export async function getArticles({
  limit = 10,
  offset = 0,
  search,
  dateFilter,
  minViews,
  minLikes,
  sortBy,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  dateFilter?: string;
  minViews?: number;
  minLikes?: number;
  sortBy?: "new" | "popular" | "trending";
}) {
  const supabase = createClient();
  let query = supabase
    .from("articles_blog")
    .select(
      `
      id,
      titre,
      slug,
      extrait,
      image_couverture,
      publie_at,
      vues,
      likes_count,
      comment_count,
      auteur:profiles(full_name, avatar_url),
      categories(id, nom, slug)
    `
    )
    .eq("statut", "publie")
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike("titre", `%${search}%`);
  }

  const now = new Date();
  if (dateFilter === "this_week") {
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
    query = query.gte("publie_at", startOfWeek);
  } else if (dateFilter === "this_month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    query = query.gte("publie_at", startOfMonth);
  } else if (dateFilter === "this_year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    query = query.gte("publie_at", startOfYear);
  }

  if (minViews) {
    query = query.gte("vues", minViews);
  }

  if (minLikes) {
    query = query.gte("likes_count", minLikes);
  }

  if (sortBy === "new") {
    query = query.order("publie_at", { ascending: false });
  } else if (sortBy === "popular") {
    query = query.order("vues", { ascending: false });
  } else if (sortBy === "trending") {
    query = query.order("likes_count", { ascending: false });
  } else {
    query = query.order("publie_at", { ascending: false }); // Default sort
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return { data: [], error };
  }

  return { data, error };
}

export async function getArticleById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles_blog")
    .select(
      `
      *,
      auteur:profiles(full_name, avatar_url),
      categories(id, nom, slug, description)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article by ID:", error);
    return { data: null, error };
  }

  return { data, error };
}
