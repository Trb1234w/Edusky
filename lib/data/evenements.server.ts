import { createClient } from '@supabase/supabase-js';

export async function getEvenementById(id: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("evenements")
    .select(
      `
        *,
        categorie:categorie_id(*),
        organisateur:profiles!organisateur_id(*),
        pays:pays_id(*),
        ville:ville_id(*),
        quartier:quartier_id(*),
        inscriptions:inscriptions_evenement(*)
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

export async function getEvenementsByOrganisateurId(organisateurId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("evenements")
    .select(
      `
        *,
        categorie:categorie_id(nom),
        organisateur:profiles!organisateur_id(full_name, avatar_url),
        pays:pays_id(nom),
        ville:ville_id(nom)
      `
    )
    .eq("organisateur_id", organisateurId)
    .order("date_debut", { ascending: false });

  if (error) {
    console.error("Error fetching evenements by organisateur ID:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function getRegisteredEventsByUserId(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('inscriptions_evenement')
    .select(
      `
        evenement:evenement_id(*,
          categorie:categorie_id(nom),
          organisateur:profiles!organisateur_id(full_name, avatar_url)
        )
      `
    )
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching registered events by user ID:", error);
    return { data: [], error };
  }

  const registeredEvents = data.map(inscription => inscription.evenement);

  return { data: registeredEvents, error: null };
}