-- Create get_clubs function with all filter parameters
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
    statut statut_club,
    categorie_id uuid,
    tags text[],
    leader_id uuid,
    calendrier jsonb,
    capacite integer,
    lieu text,
    image_url text,
    theme_principal text,
    created_at timestamptz,
    updated_at timestamptz,
    pays_id uuid,
    ville_id uuid,
    quartier_id uuid,
    pays_nom text,
    ville_nom text,
    quartier_nom text,
    prix_inscription numeric,
    cotisation_mensuelle numeric,
    cotisation_annuelle numeric,
    type_cotisation text,
    nombre_membres integer,
    reglement_interieur text,
    objectifs text[],
    activites jsonb,
    conditions_adhesion text,
    niveau_requis text,
    age_minimum integer,
    age_maximum integer,
    equipement_requis text[],
    reseaux_sociaux jsonb,
    email_contact text,
    site_web text,
    horaires_ouverture jsonb,
    partenaires jsonb,
    realisations jsonb,
    visibilite text,
    est_visible boolean,
    langues text[],
    leader_full_name text,
    leader_avatar_url text,
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
        cl.statut,
        cl.categorie_id,
        cl.tags::text[],
        cl.leader_id,
        cl.calendrier,
        cl.capacite,
        cl.lieu,
        cl.image_url,
        cl.theme_principal,
        cl.created_at,
        cl.updated_at,
        cl.pays_id,
        cl.ville_id,
        cl.quartier_id,
        p.nom as pays_nom,
        v.nom as ville_nom,
        q.nom as quartier_nom,
        cl.prix_inscription,
        cl.cotisation_mensuelle,
        cl.cotisation_annuelle,
        cl.type_cotisation,
        cl.nombre_membres,
        cl.reglement_interieur,
        cl.objectifs::text[],
        cl.activites,
        cl.conditions_adhesion,
        cl.niveau_requis,
        cl.age_minimum,
        cl.age_maximum,
        cl.equipement_requis::text[],
        cl.reseaux_sociaux,
        cl.email_contact,
        cl.site_web,
        cl.horaires_ouverture,
        cl.partenaires,
        cl.realisations,
        cl.visibilite,
        cl.est_visible,
        cl.langues::text[],
        pr.full_name AS leader_full_name,
        pr.avatar_url AS leader_avatar_url,
        c.nom AS category_nom,
        c.slug AS categorie_slug
    FROM
        public.clubs AS cl
    LEFT JOIN
        public.profiles AS pr ON cl.leader_id = pr.id
    LEFT JOIN
        public.categories AS c ON cl.categorie_id = c.id
    LEFT JOIN
        public.pays as p ON cl.pays_id = p.id
    LEFT JOIN
        public.villes as v ON cl.ville_id = v.id
    LEFT JOIN
        public.quartiers as q ON cl.quartier_id = q.id
    WHERE
        cl.est_visible = true
        AND (statut_filter IS NULL OR cl.statut::text = statut_filter)
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