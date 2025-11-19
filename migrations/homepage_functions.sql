-- =============================================
-- FUNCTIONS FOR HOME PAGE -- EDUSKY
-- =============================================

-- 1. Formations pour la page d'accueil
CREATE OR REPLACE FUNCTION get_home_page_formations()
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
    "image" text
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
        f.nb_avis, -- Note: nb_avis utilisé comme nombre d'étudiants
        f.note_moyenne,
        CASE
            WHEN f.prix_indicatif IS NOT NULL AND f.prix_indicatif > 0 THEN f.prix_indicatif::text || ' GNF'
            ELSE 'Gratuit'
        END,
        f.image_url
    FROM
        public.formations f
    LEFT JOIN public.profiles p ON f.professeur_id = p.id
    LEFT JOIN public.categories cat ON f.categorie_id = cat.id
    WHERE f.statut = 'publie'
    ORDER BY f.note_moyenne DESC NULLS LAST
    LIMIT 4;
END;
$$;

-- 2. Événements pour la page d'accueil
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
        to_char(e.date_debut, 'DD Mon YYYY'), -- Format as 'DD Mon YYYY' for better readability
        to_char(e.date_debut, 'HH24:MI'),
        e.lieu,
        COALESCE(cat.nom, e.type_evenement, 'Général'),
        0, -- Note: le nombre de participants n'est pas directement dans la table
        e.capacite,
        p.full_name,
        e.image_url,
        'upcoming'::text
    FROM
        public.evenements e
    LEFT JOIN public.profiles p ON e.organisateur_id = p.id
    LEFT JOIN public.categories cat ON e.categorie_id = cat.id
    WHERE e.statut = 'publie' AND e.date_debut > now()
    ORDER BY e.date_debut ASC
    LIMIT 4;
END;
$$;

-- 3. Articles de blog pour la page d'accueil
CREATE OR REPLACE FUNCTION get_home_page_articles()
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
    "featured" boolean
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
        '5 min', -- Note: readTime est une placeholder
        a.image_url,
        a.vues,
        a.likes_count,
        a.comment_count,
        false
    FROM
        public.articles_blog a
    LEFT JOIN public.profiles p ON a.auteur_id = p.id
    LEFT JOIN public.categories cat ON a.categorie_id = cat.id
    WHERE a.statut = 'publie'
    ORDER BY a.publie_at DESC
    LIMIT 4;
END;
$$;

-- 4. Clubs pour la page d'accueil
CREATE OR REPLACE FUNCTION get_home_page_clubs()
RETURNS TABLE (
    "id" uuid,
    "name" text,
    "description" text,
    "category" text,
    "members" integer,
    "activities" text,
    "president" text,
    "image" text,
    "verified" boolean
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
        c.capacite, -- Note: capacité utilisée comme nombre de membres
        c.theme_principal,
        p.full_name,
        c.image_url,
        false -- Note: statut "verified" non présent dans la table clubs
    FROM
        public.clubs c
    LEFT JOIN public.profiles p ON c.leader_id = p.id
    LEFT JOIN public.categories cat ON c.categorie_id = cat.id
    WHERE c.statut = 'ouvert'
    ORDER BY c.created_at DESC
    LIMIT 4;
END;
$$;

-- 5. Professeurs pour la page d'accueil
CREATE OR REPLACE FUNCTION get_home_page_professeurs()
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
    "hasCertifications" boolean
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
        (prof.certifications IS NOT NULL AND jsonb_array_length(prof.certifications) > 0)
    FROM
        public.professeurs prof
    JOIN public.profiles p ON prof.id = p.id
    WHERE prof.is_publie = true
    ORDER BY prof.note_moyenne DESC NULLS LAST
    LIMIT 4;
END;
$$;

-- 6. Posts (Actualités) pour la page d'accueil
-- Note : Cette fonction est plus complexe car elle agrège les likes/commentaires.
-- Elle ne prend pas d'arguments pour la page d'accueil.
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
    LIMIT 5;
END;
$$;
