-- Script de vérification pour diagnostiquer le problème
-- Exécutez ces requêtes une par une dans Supabase SQL Editor

-- 1. Vérifier combien de professeurs existent dans la table
SELECT COUNT(*) as total_professeurs FROM professeurs;

-- 2. Vérifier combien de professeurs sont publiés
SELECT COUNT(*) as professeurs_publies FROM professeurs WHERE is_publie = TRUE;

-- 3. Voir les détails des professeurs publiés
SELECT 
    id,
    full_name,
    image_url,
    titre,
    is_publie,
    specialites,
    langues_enseignement
FROM professeurs 
WHERE is_publie = TRUE
LIMIT 5;

-- 4. Tester la fonction get_professeurs directement
SELECT * FROM get_professeurs(
    search_term := NULL,
    min_rating := 0,
    has_certification := NULL,
    sort_by := 'note_moyenne_desc',
    p_limit := 100,
    p_offset := 0,
    type_filter := NULL,
    specialite_filter := NULL,
    pays_id_filter := NULL,
    ville_id_filter := NULL,
    quartier_id_filter := NULL,
    min_experience := NULL,
    max_experience := NULL,
    min_tarif := NULL,
    max_tarif := NULL,
    langue_filter := NULL,
    min_etudiants := NULL,
    is_verified_filter := NULL,
    genre_filter := NULL
);

-- 5. Vérifier si la fonction existe bien
SELECT 
    proname as function_name,
    oidvectortypes(proargtypes) as arguments
FROM pg_proc 
WHERE proname = 'get_professeurs' 
AND pronamespace = 'public'::regnamespace;
