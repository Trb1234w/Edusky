-- Correction de la fonction get_home_page_professeurs pour utiliser uniquement la table professeurs
-- Date: 2025-12-08

DROP FUNCTION IF EXISTS get_home_page_professeurs(uuid);

CREATE OR REPLACE FUNCTION get_home_page_professeurs(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    "id" uuid,
    "full_name" text,
    "titre" character varying,
    "type" text,
    "specialites" text[],
    "note_moyenne" numeric,
    "nb_etudiants_formes" integer,
    "annees_experience" integer,
    "tarif_indicatif" numeric,
    "avatar_url" text,
    "pays_id" uuid,
    "ville_id" uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        prof.id,
        prof.full_name,
        prof.titre,
        prof.type,
        prof.specialites,
        prof.note_moyenne,
        prof.nb_etudiants_formes,
        prof.annees_experience,
        prof.tarif_indicatif,
        prof.image_url, -- Utilisation de image_url de la table professeurs comme avatar_url
        prof.pays_id,
        prof.ville_id
    FROM
        public.professeurs prof
    WHERE prof.is_publie = true
    ORDER BY prof.note_moyenne DESC NULLS LAST
    LIMIT 4;
END;
$$;
