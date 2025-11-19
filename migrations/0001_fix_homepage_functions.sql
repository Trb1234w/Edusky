-- =============================================
-- FIX FOR HOME PAGE FUNCTIONS -- EDUSKY
-- 1. Change get_home_page_evenements to show recent events instead of only upcoming.
-- 2. Change get_home_page_postes to limit to 4 instead of 5.
-- =============================================

-- 1. Événements pour la page d'accueil (Correction)
-- Affiche les 4 événements publiés les plus récents (passés ou à venir)
CREATE OR REPLACE FUNCTION get_home_page_evenements()
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
    "status" text
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
        0, -- Note: le nombre de participants n'est pas directement dans la table
        e.capacite,
        p.full_name,
        e.image_url,
        CASE
            WHEN e.date_debut > now() THEN 'upcoming'
            ELSE 'past'
        END::text
    FROM
        public.evenements e
    LEFT JOIN public.profiles p ON e.organisateur_id = p.id
    LEFT JOIN public.categories cat ON e.categorie_id = cat.id
    WHERE e.statut = 'publie'
    ORDER BY e.date_debut DESC -- Affiche les plus récents en premier
    LIMIT 4;
END;
$$;

-- 2. Posts (Actualités) pour la page d'accueil (Correction)
-- Limite passée de 5 à 4
CREATE OR REPLACE FUNCTION get_home_page_postes()
RETURNS TABLE (
    "id" uuid,
    "authorId" uuid,
    "author" text,
    "authorRole" text,
    "authorAvatar" text,
    "authorUsername" text,
    "content" text,
    "image" text,
    "timestamp" timestamptz,
    "likes" bigint,
    "comments" bigint,
    "shares" integer,
    "liked" boolean, -- Placeholder, sera géré côté client
    "currentUserId" uuid, -- Placeholder
    "followingIds" uuid[] -- Placeholder
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        po.id,
        po.auteur_id,
        pr.full_name,
        pr.role::text,
        pr.avatar_url,
        pr.username,
        po.contenu,
        (CASE WHEN po.media IS NOT NULL AND jsonb_typeof(po.media) = 'array' AND jsonb_array_length(po.media) > 0 THEN po.media->0->>'url' ELSE NULL END)::text,
        po.created_at,
        (SELECT count(*) FROM public.likes l WHERE l.parent_id = po.id),
        (SELECT count(*) FROM public.commentaires co WHERE co.parent_poste = po.id),
        0, -- Le partage n'est pas modélisé comme un count simple
        false, -- La logique de "liked" doit être gérée côté client après récupération
        NULL::uuid,
        ARRAY[]::uuid[]
    FROM
        public.postes po
    JOIN
        public.profiles pr ON po.auteur_id = pr.id
    WHERE po.statut = 'publie'
    ORDER BY
        po.created_at DESC
    LIMIT 4; -- Limite corrigée à 4
END;
$$;
