import { createClient } from '@supabase/supabase-js';

export async function getFormationById(id: string) {
  console.log(`--- DEBUG: getFormationById ---`);
  console.log(`ID reçu: ${id}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("CRITICAL: Variables d'environnement Supabase manquantes !");
    return { data: null, error: { message: "Configuration Supabase incomplète côté serveur." } };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  console.log("Client admin Supabase créé.");

  // --- Étape 1: Récupérer la formation et le professeur de base ---
  console.log("Étape 1: Récupération de la formation et du professeur...");
  const { data: formationData, error: formationError } = await supabaseAdmin
    .from("formations")
    .select(
      `
        *,
        categorie:categorie_id(*),
        professeur:professeurs(*),
        pays:pays_id(*),
        ville:ville_id(*),
        quartier:quartier_id(*),
        avis:avis_formation(*, author:profiles(full_name, avatar_url)),
        sessions:sessions_formation(*)
      `
    )
    .eq("id", id)
    .single();

  if (formationError) {
    console.error("--- ERREUR lors de l'étape 1 ---", JSON.stringify(formationError, null, 2));
    return { data: null, error: formationError };
  }

  if (!formationData) {
    console.log("--- Aucune formation trouvée à l'étape 1 ---");
    return { data: null, error: { message: "Formation non trouvée." } };
  }

  console.log("Étape 1 réussie. Formation trouvée.");

  // Si la formation n'a pas de professeur associé, on retourne les données telles quelles.
  if (!formationData.professeur) {
    console.log("Cette formation n'a pas de professeur associé.");
    return { data: formationData, error: null };
  }

  // --- Étape 2: Récupérer le profil du professeur ---
  console.log(`Étape 2: Récupération du profil pour le professeur ID: ${formationData.professeur.id}`);
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', formationData.professeur.id)
    .single();

  if (profileError) {
    console.error("--- ERREUR lors de l'étape 2 ---", JSON.stringify(profileError, null, 2));
    // On ne bloque pas tout, on retourne la formation avec ce qu'on a.
    return { data: formationData, error: null };
  }

  console.log("Étape 2 réussie. Profil trouvé.");

  // --- Étape 3: Combiner les données ---
  const finalData = {
    ...formationData,
    professeur: {
      ...formationData.professeur,
      profiles: profileData, // On injecte les données du profil dans l'objet professeur
    },
  };

  console.log("--- SUCCÈS: Données finales combinées ---");
  return { data: finalData, error: null };
}

export async function getFormationsByProfessorId(professorId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("CRITICAL: Variables d'environnement Supabase manquantes pour getFormationsByProfessorId !");
    return { data: null, error: { message: "Configuration Supabase incomplète côté serveur." } };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabaseAdmin
    .from("formations")
    .select(
      `
        *,
        categorie:categorie_id(nom),
        professeur:professeurs(id, titre, note_moyenne, nb_etudiants_formes, profiles(full_name, avatar_url))
      `
    )
    .eq("professeur_id", professorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching formations by professor ID:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function getRegisteredFormationsByUserId(userId: string) {
  console.log(`[DEBUG] getRegisteredFormationsByUserId called with userId: ${userId}`);
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('inscriptions_formation')
    .select(
      `
        formation:formation_id(*,
          categorie:categorie_id(nom),
          professeur:professeurs(*)
        )
      `
    )
    .eq('user_id', userId);

  if (error) {
    console.error("[DEBUG] Error fetching registered formations by user ID:", error);
    return { data: [], error };
  }

  console.log(`[DEBUG] Raw data from Supabase for userId ${userId} (formations):`, JSON.stringify(data, null, 2));

  const registeredFormations = await Promise.all(data.map(async (inscription: any) => {
    const formation = inscription.formation;
    if (formation && formation.professeur) {
      // Fetch professor's profile separately
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', formation.professeur.id)
        .single();

      if (profileError) {
        console.error(`[DEBUG] Error fetching profile for professor ${formation.professeur.id}:`, profileError);
        // Continue without profile data if there's an error
        return {
          ...formation,
          professeur: {
            ...formation.professeur,
            profiles: null,
          },
        };
      }

      return {
        ...formation,
        professeur: {
          ...formation.professeur,
          profiles: profileData,
        },
      };
    }
    return formation;
  }));

  console.log(`[DEBUG] Mapped registered formations for userId ${userId}:`, JSON.stringify(registeredFormations, null, 2));

  return { data: registeredFormations, error: null };
}

export async function getRelatedFormationsByCategory(currentFormationId: string, categoryId: number | null) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (!categoryId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabaseAdmin
    .from('formations')
    .select(
      `
        *,
        categorie:categorie_id(nom),
        professeur:professeurs(id, titre, note_moyenne, nb_etudiants_formes)
      `
    )
    .eq('categorie_id', categoryId)
    .neq('id', currentFormationId)
    .limit(7)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching related formations:', error);
    return { data: [], error };
  }

  // Fetch profiles for each professor
  const formationsWithProfiles = await Promise.all(
    (data || []).map(async (formation: any) => {
      if (formation.professeur) {
        const { data: profileData } = await supabaseAdmin
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', formation.professeur.id)
          .single();

        return {
          ...formation,
          professeur: {
            ...formation.professeur,
            profiles: profileData,
          },
        };
      }
      return formation;
    })
  );

  return { data: formationsWithProfiles, error: null };
}

