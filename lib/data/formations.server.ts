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
        sessions:sessions_formation(*),
        avis:avis_formation(*, author:profiles(full_name, avatar_url))
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