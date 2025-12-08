-- Correction de la fonction get_home_page_professeurs pour correspondre aux props du composant ProfesseurCard
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
    "is_verified" boolean,
    "pays_nom" text,
    "ville_nom" text,
    "is_favorited" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        prof.id,
        p.full_name,
        prof.titre,
        prof.type,
        prof.specialites,
        prof.note_moyenne,
        prof.nb_etudiants_formes,
        prof.annees_experience,
        prof.tarif_indicatif,
        p.avatar_url,
        p.is_verified,
        pays.nom as pays_nom,
        v.nom as ville_nom,
        (fav.id IS NOT NULL)
    FROM
        public.professeurs prof
    JOIN public.profiles p ON prof.id = p.id
    LEFT JOIN public.pays pays ON prof.pays_id = pays.id
    LEFT JOIN public.villes v ON prof.ville_id = v.id
    LEFT JOIN public.favoris fav ON fav.item_id = prof.id AND fav.user_id = p_user_id AND fav.type_item = 'professeur'
    WHERE prof.is_publie = true
    ORDER BY prof.note_moyenne DESC NULLS LAST
    LIMIT 4;
END;
$$;
