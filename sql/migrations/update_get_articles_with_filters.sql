-- Migration: Create/Update get_articles function with comprehensive filters
-- This migration adds all necessary fields for client-side filtering

DROP FUNCTION IF EXISTS get_articles(text, text, integer, integer, text);

CREATE OR REPLACE FUNCTION get_articles(
    search_term text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    min_vues integer DEFAULT NULL,
    min_likes integer DEFAULT NULL,
    sort_by text DEFAULT 'publie_at_desc'
)
RETURNS TABLE (
    id uuid,
    titre text,
    slug text,
    extrait text,
    image_couverture text,
    publie_at timestamp with time zone,
    vues integer,
    likes_count integer,
    comment_count integer,
    tags text[],
    auteur_id uuid,
    auteur_full_name text,
    auteur_avatar_url text,
    category_id uuid,
    category_nom text,
    categorie_slug text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.titre,
        a.slug,
        a.extrait,
        a.image_couverture,
        a.publie_at,
        a.vues,
        a.likes_count,
        a.comment_count,
        a.tags::text[],
        pr.id AS auteur_id,
        pr.full_name AS auteur_full_name,
        pr.avatar_url AS auteur_avatar_url,
        c.id AS category_id,
        c.nom AS category_nom,
        c.slug AS categorie_slug
    FROM
        public.articles_blog AS a
    LEFT JOIN
        public.profiles AS pr ON a.auteur_id = pr.id
    LEFT JOIN
        public.categories AS c ON a.categorie_id = c.id
    WHERE
        a.statut = 'publie'
        AND (search_term IS NULL OR a.titre ILIKE '%' || search_term || '%' OR a.contenu ILIKE '%' || search_term || '%')
        AND (category_slug IS NULL OR c.slug = category_slug)
        AND (min_vues IS NULL OR a.vues >= min_vues)
        AND (min_likes IS NULL OR a.likes_count >= min_likes)
    ORDER BY
        CASE
            WHEN sort_by = 'publie_at_desc' THEN a.publie_at
            ELSE NULL
        END DESC,
        CASE
            WHEN sort_by = 'publie_at_asc' THEN a.publie_at
            ELSE NULL
        END ASC,
        CASE
            WHEN sort_by = 'vues_desc' THEN a.vues
            ELSE NULL
        END DESC,
        CASE
            WHEN sort_by = 'likes_desc' THEN a.likes_count
            ELSE NULL
        END DESC;
END;
$$;
