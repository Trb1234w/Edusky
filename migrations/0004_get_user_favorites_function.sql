-- =================================================================
-- GET USER FAVORITES FUNCTION -- EDUSKY
--
-- This script creates a single, powerful function to retrieve all
-- favorited items for a given user, regardless of their type.
-- It joins with the respective tables to get display information.
-- =================================================================

CREATE OR REPLACE FUNCTION get_user_favorites(p_user_id UUID)
RETURNS TABLE (
    "id" uuid,
    "type" text,
    "title" text,
    "description" text,
    "image_url" text,
    "href" text,
    "category" text,
    "author" text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    
    -- Favorited Formations
    SELECT
        f.id,
        'formation'::text,
        f.titre,
        f.extrait,
        f.image_url,
        '/formations/' || f.slug,
        cat.nom,
        p.full_name
    FROM public.favoris fav
    JOIN public.formations f ON f.id = fav.item_id
    LEFT JOIN public.categories cat ON f.categorie_id = cat.id
    LEFT JOIN public.profiles p ON f.professeur_id = p.id
    WHERE fav.user_id = p_user_id AND fav.type_item = 'formation'

    UNION ALL

    -- Favorited Events
    SELECT
        e.id,
        'evenement'::text,
        e.titre,
        e.description,
        e.image_url,
        '/evenements/' || e.slug,
        cat.nom,
        p.full_name
    FROM public.favoris fav
    JOIN public.evenements e ON e.id = fav.item_id
    LEFT JOIN public.categories cat ON e.categorie_id = cat.id
    LEFT JOIN public.profiles p ON e.organisateur_id = p.id
    WHERE fav.user_id = p_user_id AND fav.type_item = 'evenement'

    UNION ALL

    -- Favorited Clubs
    SELECT
        c.id,
        'club'::text,
        c.nom,
        c.description,
        c.image_url,
        '/clubs/' || c.slug,
        cat.nom,
        p.full_name
    FROM public.favoris fav
    JOIN public.clubs c ON c.id = fav.item_id
    LEFT JOIN public.categories cat ON c.categorie_id = cat.id
    LEFT JOIN public.profiles p ON c.leader_id = p.id
    WHERE fav.user_id = p_user_id AND fav.type_item = 'club'

    UNION ALL

    -- Favorited Articles
    SELECT
        a.id,
        'article'::text,
        a.titre,
        a.extrait,
        a.image_url,
        '/blog/' || a.slug,
        cat.nom,
        p.full_name
    FROM public.favoris fav
    JOIN public.articles_blog a ON a.id = fav.item_id
    LEFT JOIN public.categories cat ON a.categorie_id = cat.id
    LEFT JOIN public.profiles p ON a.auteur_id = p.id
    WHERE fav.user_id = p_user_id AND fav.type_item = 'article'

    UNION ALL

    -- Favorited Professors
    SELECT
        prof.id,
        'professeur'::text,
        p.full_name,
        prof.presentation,
        p.avatar_url,
        '/professeurs/' || prof.id, -- Assuming profile ID is used for link
        prof.titre,
        NULL::text -- No specific author for a professor
    FROM public.favoris fav
    JOIN public.professeurs prof ON prof.id = fav.item_id
    JOIN public.profiles p ON prof.id = p.id
    WHERE fav.user_id = p_user_id AND fav.type_item = 'professeur';

END;
$$;
