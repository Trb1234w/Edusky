-- Migration: Create/Update get_clubs function with comprehensive filters
-- This migration adds all necessary fields for client-side filtering

DROP FUNCTION IF EXISTS get_clubs(text, text, text, text, text);

CREATE OR REPLACE FUNCTION get_clubs(
    search_term text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    statut_filter text DEFAULT NULL,
    theme_filter text DEFAULT NULL,
    sort_by text DEFAULT 'created_at_desc'
)
RETURNS TABLE (
    id uuid,
    nom text,
    slug text,
    description text,
    image_url text,
    statut statut_club,
    theme_principal text,
    lieu text,
    capacite integer,
    tags text[],
    leader_id uuid,
    leader_full_name text,
    leader_avatar_url text,
    category_id uuid,
    category_nom text,
    categorie_slug text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        cl.id,
        cl.nom,
        cl.slug,
        cl.description,
        cl.image_url,
        cl.statut,
        cl.theme_principal,
        cl.lieu,
        cl.capacite,
        cl.tags::text[],
        pr.id AS leader_id,
        pr.full_name AS leader_full_name,
        pr.avatar_url AS leader_avatar_url,
        c.id AS category_id,
        c.nom AS category_nom,
        c.slug AS categorie_slug
    FROM
        public.clubs AS cl
    LEFT JOIN
        public.profiles AS pr ON cl.leader_id = pr.id
    LEFT JOIN
        public.categories AS c ON cl.categorie_id = c.id
    WHERE
        (statut_filter IS NULL OR cl.statut::text = statut_filter)
        AND (search_term IS NULL OR cl.nom ILIKE '%' || search_term || '%' OR cl.description ILIKE '%' || search_term || '%')
        AND (category_slug IS NULL OR c.slug = category_slug)
        AND (theme_filter IS NULL OR cl.theme_principal = theme_filter)
    ORDER BY
        CASE
            WHEN sort_by = 'created_at_desc' THEN cl.created_at
            ELSE NULL
        END DESC,
        CASE
            WHEN sort_by = 'created_at_asc' THEN cl.created_at
            ELSE NULL
        END ASC;
END;
$$;
