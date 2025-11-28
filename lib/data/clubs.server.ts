import { createClient } from '@supabase/supabase-js';

export async function getClubById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select(
      `
        *,
        categorie:categorie_id(*),
        leader:profiles!leader_id(*),
        inscriptions:inscriptions_club(*)
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

export async function getClubsByLeaderId(leaderId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select(
      `
        *,
        categorie:categorie_id(nom),
        leader:profiles!leader_id(full_name, avatar_url)
      `
    )
    .eq("leader_id", leaderId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clubs by leader ID:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function getRegisteredClubsByUserId(userId: string) {
  console.log(`[DEBUG] getRegisteredClubsByUserId called with userId: ${userId}`);
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('inscriptions_club')
    .select(
      `
        club:club_id(*,
          categorie:categorie_id(nom),
          leader:profiles!leader_id(full_name, avatar_url)
        )
      `
    )
    .eq('user_id', userId);

  if (error) {
    console.error("[DEBUG] Error fetching registered clubs by user ID:", error);
    return { data: [], error };
  }

  console.log(`[DEBUG] Raw data from Supabase for userId ${userId} (clubs):`, JSON.stringify(data, null, 2));

  const registeredClubs = data.map(inscription => inscription.club);

  console.log(`[DEBUG] Mapped registered clubs for userId ${userId}:`, JSON.stringify(registeredClubs, null, 2));

  return { data: registeredClubs, error: null };
}

export async function getRelatedClubsByCategory(currentClubId: string, categoryId: number | null) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (!categoryId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabaseAdmin
    .from('clubs')
    .select(
      `
        *,
        categorie:categorie_id(nom),
        leader:profiles!leader_id(full_name, avatar_url)
      `
    )
    .eq('categorie_id', categoryId)
    .neq('id', currentClubId)
    .limit(7)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching related clubs:', error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}