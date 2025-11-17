import { createClient } from '@supabase/supabase-js';

export async function getFavoritesByUserId(userId: string) {
  console.log(`[DEBUG] getFavoritesByUserId called with userId: ${userId}`);
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("favoris")
    .select(
      `
        *,
        item_id,
        type_item
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DEBUG] Error fetching favorites by user ID:", error);
    return { data: null, error };
  }

  console.log(`[DEBUG] Raw data from Supabase for userId ${userId} (favorites):`, JSON.stringify(data, null, 2));

  // Pour chaque favori, récupérer les détails de l'élément (formation, événement, club, etc.)
  // Ceci est un exemple simplifié, une implémentation réelle nécessiterait
  // de gérer dynamiquement les types d'éléments et leurs tables respectives.
  const detailedFavorites = await Promise.all(data.map(async (fav: any) => {
    let itemDetails = null;
    let itemError = null;

    switch (fav.type_item) {
      case 'formation':
        ({ data: itemDetails, error: itemError } = await supabaseAdmin.from('formations').select('id, titre, image_url, slug').eq('id', fav.item_id).single());
        break;
      case 'evenement':
        ({ data: itemDetails, error: itemError } = await supabaseAdmin.from('evenements').select('id, titre, image_url, slug').eq('id', fav.item_id).single());
        break;
      case 'club':
        ({ data: itemDetails, error: itemError } = await supabaseAdmin.from('clubs').select('id, nom, image_url, slug').eq('id', fav.item_id).single());
        break;
      case 'article':
        ({ data: itemDetails, error: itemError } = await supabaseAdmin.from('articles_blog').select('id, titre, image_url, slug').eq('id', fav.item_id).single());
        break;
      // Ajoutez d'autres types d'éléments si nécessaire
    }

    if (itemError) {
      console.error(`[DEBUG] Error fetching details for favorite item ${fav.item_id} of type ${fav.type_item}:`, itemError);
    }

    return {
      ...fav,
      details: itemDetails,
    };
  }));

  console.log(`[DEBUG] Mapped detailed favorites for userId ${userId}:`, JSON.stringify(detailedFavorites, null, 2));

  return { data: detailedFavorites, error: null };
}
