-- =================================================================
-- PAGINATED LIST FUNCTIONS WITH FAVORITES STATUS -- EDUSKY
--
-- This script creates one function for each main list page.
-- Each function accepts filter/pagination parameters and a user ID
-- to return the correct data set with the favorite status included.
-- =================================================================

-- 1. Formations List Function
CREATE OR REPLACE FUNCTION get_paginated_formations(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (
    "id" uuid,
    "title" text,
    "description" text,
    "instructor" text,
    "category" text,
    "level" text,
    "duration" text,
    "students" integer,
    "rating" numeric,
    "price" text,
    "image" text,
    "is_favorited" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.titre,
        f.description,
        p.full_name,
        cat.nom,
        f.niveau,
        f.duree_texte,
        f.nb_avis,
        f.note_moyenne,
        CASE
            WHEN f.prix_indicatif IS NOT NULL AND f.prix_indicatif > 0 THEN f.prix_indicatif::text || ' GNF'
            ELSE 'Gratuit'
        END,
        f.image_url,
        (fav.id IS NOT NULL)
    FROM
        public.formations f
    LEFT JOIN public.profiles p ON f.professeur_id = p.id
    LEFT JOIN public.categories cat ON f.categorie_id = cat.id
    LEFT JOIN public.favoris fav ON fav.item_id = f.id AND fav.user_id = p_user_id AND fav.type_item = 'formation'
    WHERE f.statut = 'publie'
    ORDER BY f.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 2. Events List Function
CREATE OR REPLACE FUNCTION get_paginated_evenements(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (
    "id" uuid,
    "title" text,
    "description" text,
    "date" text,
    "time" text,
    "location" text,
    "category" text,
    "participants" integer,
    "maxParticipants" integer,
    "organizer" text,
    "image" text,
    "status" text,
    "is_favorited" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.titre,
        e.description,
        to_char(e.date_debut, 'DD Mon YYYY'),
        to_char(e.date_debut, 'HH24:MI'),
        e.lieu,
        COALESCE(cat.nom, e.type_evenement, 'Général'),
        0, 
        e.capacite,
        p.full_name,
        e.image_url,
        CASE WHEN e.date_debut > now() THEN 'upcoming' ELSE 'past' END::text,
        (fav.id IS NOT NULL)
    FROM
        public.evenements e
    LEFT JOIN public.profiles p ON e.organisateur_id = p.id
    LEFT JOIN public.categories cat ON e.categorie_id = cat.id
    LEFT JOIN public.favoris fav ON fav.item_id = e.id AND fav.user_id = p_user_id AND fav.type_item = 'evenement'
    WHERE e.statut = 'publie'
    ORDER BY e.date_debut DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 3. Articles List Function
CREATE OR REPLACE FUNCTION get_paginated_articles(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (
    "id" uuid,
    "title" text,
    "excerpt" text,
    "author" text,
    "authorRole" text,
    "authorAvatar" text,
    "category" text,
    "date" text,
    "readTime" text,
    "image" text,
    "views" integer,
    "likes" integer,
    "comments" integer,
    "featured" boolean,
    "is_favorited" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.titre,
        a.extrait,
        p.full_name,
        p.role::text,
        p.avatar_url,
        cat.nom,
        to_char(a.publie_at, 'DD Mon YYYY'),
        '5 min',
        a.image_url,
        a.vues,
        a.likes_count,
        a.comment_count,
        false,
        (fav.id IS NOT NULL)
    FROM
        public.articles_blog a
    LEFT JOIN public.profiles p ON a.auteur_id = p.id
    LEFT JOIN public.categories cat ON a.categorie_id = cat.id
    LEFT JOIN public.favoris fav ON fav.item_id = a.id AND fav.user_id = p_user_id AND fav.type_item = 'article'
    WHERE a.statut = 'publie'
    ORDER BY a.publie_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 4. Clubs List Function
CREATE OR REPLACE FUNCTION get_paginated_clubs(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (
    "id" uuid,
    "name" text,
    "description" text,
    "category" text,
    "members" integer,
    "activities" text,
    "president" text,
    "image" text,
    "verified" boolean,
    "is_favorited" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.nom,
        c.description,
        cat.nom,
        c.capacite,
        c.theme_principal,
        p.full_name,
        c.image_url,
        false,
        (fav.id IS NOT NULL)
    FROM
        public.clubs c
    LEFT JOIN public.profiles p ON c.leader_id = p.id
    LEFT JOIN public.categories cat ON c.categorie_id = cat.id
    LEFT JOIN public.favoris fav ON fav.item_id = c.id AND fav.user_id = p_user_id AND fav.type_item = 'club'
    WHERE c.statut = 'ouvert'
    ORDER BY c.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 5. Professors List Function
CREATE OR REPLACE FUNCTION get_paginated_professeurs(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (
    "id" uuid,
    "name" text,
    "title" character varying,
    "specialties" text[],
    "rating" numeric,
    "students" integer,
    "experience" integer,
    "avatarUrl" text,
    "isVerified" boolean,
    "hasCertifications" boolean,
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
        prof.specialites,
        prof.note_moyenne,
        prof.nb_etudiants_formes,
        prof.annees_experience,
        p.avatar_url,
        p.is_verified,
        (prof.certifications IS NOT NULL AND jsonb_array_length(prof.certifications) > 0),
        (fav.id IS NOT NULL)
    FROM
        public.professeurs prof
    JOIN public.profiles p ON prof.id = p.id
    LEFT JOIN public.favoris fav ON fav.item_id = prof.id AND fav.user_id = p_user_id AND fav.type_item = 'professeur'
    WHERE prof.is_publie = true
    ORDER BY prof.note_moyenne DESC NULLS LAST
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
