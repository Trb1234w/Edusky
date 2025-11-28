import { createClient } from '@supabase/supabase-js';

export async function getArticleById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("articles_blog")
    .select(
      `
        *,
        auteur:profiles!auteur_id(*),
        categorie:categorie_id(*)
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

export async function getRelatedArticlesByCategory(currentArticleId: string, categoryId: number | null) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (!categoryId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabaseAdmin
    .from('articles_blog')
    .select(
      `
        *,
        auteur:profiles!auteur_id(full_name, avatar_url),
        categorie:categorie_id(nom)
      `
    )
    .eq('categorie_id', categoryId)
    .neq('id', currentArticleId)
    .limit(7)
    .order('publie_at', { ascending: false });

  if (error) {
    console.error('Error fetching related articles:', error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}

