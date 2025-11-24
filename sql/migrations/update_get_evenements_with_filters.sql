-- Migration: Create/Update get_evenements function with comprehensive filters
-- This migration adds all necessary fields for client-side filtering

DROP FUNCTION IF EXISTS get_evenements(text, text, text, uuid, uuid, uuid, text, text);

CREATE OR REPLACE FUNCTION get_evenements(
    search_term text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    mode_filter text DEFAULT NULL,
    pays_filter uuid DEFAULT NULL,
    ville_filter uuid DEFAULT NULL,
    quartier_filter uuid DEFAULT NULL,
    type_filter text DEFAULT NULL,
    sort_by text DEFAULT 'date_debut_asc'
)
RETURNS TABLE (
    id uuid,
    titre text,
    slug text,
    extrait text,
    image_url text,
    date_debut timestamp with time zone,
    date_fin timestamp with time zone,
    mode mode_cours,
    lieu text,
    capacite integer,
    type_evenement text,
    tags text[],
    pays_id uuid,
    ville_id uuid,
    quartier_id uuid,
    organisateur_id uuid,
    organisateur_full_name text,
    organisateur_avatar_url text,
    category_id uuid,
    category_nom text,
    categorie_slug text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.titre,
        e.slug,
        e.extrait,
        e.image_url,
        e.date_debut,
        e.date_fin,
        e.mode,
        e.lieu,
        e.capacite,
        e.type_evenement,
        e.tags::text[],
        e.pays_id,
        e.ville_id,
        e.quartier_id,
        pr.id AS organisateur_id,
        pr.full_name AS organisateur_full_name,
        pr.avatar_url AS organisateur_avatar_url,
        c.id AS category_id,
        c.nom AS category_nom,
        c.slug AS categorie_slug
    FROM
        public.evenements AS e
    LEFT JOIN
        public.profiles AS pr ON e.organisateur_id = pr.id
    LEFT JOIN
        public.categories AS c ON e.categorie_id = c.id
    WHERE
        e.statut = 'publie'
        AND (search_term IS NULL OR e.titre ILIKE '%' || search_term || '%' OR e.description ILIKE '%' || search_term || '%')
        AND (category_slug IS NULL OR c.slug = category_slug)
        AND (mode_filter IS NULL OR e.mode::text = mode_filter)
        AND (pays_filter IS NULL OR e.pays_id = pays_filter)
        AND (ville_filter IS NULL OR e.ville_id = ville_filter)
        AND (quartier_filter IS NULL OR e.quartier_id = quartier_filter)
        AND (type_filter IS NULL OR e.type_evenement = type_filter)
    ORDER BY
        CASE
            WHEN sort_by = 'date_debut_asc' THEN e.date_debut
            ELSE NULL
        END ASC,
        CASE
            WHEN sort_by = 'date_debut_desc' THEN e.date_debut
            ELSE NULL
        END DESC,
        CASE
            WHEN sort_by = 'created_at_desc' THEN e.created_at
            ELSE NULL
        END DESC;
END;
$$;
