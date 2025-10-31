CREATE OR REPLACE FUNCTION public.get_professeurs(
    search_term TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT 0,
    has_certification BOOLEAN DEFAULT FALSE,
    sort_by TEXT DEFAULT 'note_moyenne_desc', -- Default sort by highest rating
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    titre VARCHAR,
    presentation TEXT,
    specialites TEXT[],
    annees_experience INTEGER,
    tarif_indicatif NUMERIC,
    tarif_horaire_min NUMERIC,
    tarif_horaire_max NUMERIC,
    nb_etudiants_formes INTEGER,
    is_publie BOOLEAN,
    note_moyenne NUMERIC,
    nb_notes INTEGER,
    certifications JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    profile_full_name TEXT,
    profile_avatar_url TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    sql_query TEXT;
    sort_clause TEXT;
BEGIN
    -- Determine sort order
    sort_clause := CASE sort_by
        WHEN 'note_moyenne_desc' THEN 'p.note_moyenne DESC, p.nb_notes DESC'
        WHEN 'nb_etudiants_formes_desc' THEN 'p.nb_etudiants_formes DESC'
        WHEN 'created_at_desc' THEN 'p.created_at DESC'
        ELSE 'p.note_moyenne DESC, p.nb_notes DESC' -- Default
    END;

    sql_query := '
        SELECT
            p.id,
            p.titre,
            p.presentation,
            p.specialites,
            p.annees_experience,
            p.tarif_indicatif,
            p.tarif_horaire_min,
            p.tarif_horaire_max,
            p.nb_etudiants_formes,
            p.is_publie,
            p.note_moyenne,
            p.nb_notes,
            p.certifications,
            p.created_at,
            p.updated_at,
            pr.full_name AS profile_full_name,
            pr.avatar_url AS profile_avatar_url
        FROM
            public.professeurs p
        JOIN
            public.profiles pr ON p.id = pr.id
        WHERE
            p.is_publie = TRUE
            AND p.note_moyenne >= COALESCE(' || min_rating || ', 0)
    ';

    IF search_term IS NOT NULL THEN
        sql_query := sql_query || ' AND (p.titre ILIKE ''%' || search_term || '%'' OR p.presentation ILIKE ''%' || search_term || '%'' OR pr.full_name ILIKE ''%' || search_term || '%'')';
    END IF;

    IF has_certification IS TRUE THEN
        sql_query := sql_query || ' AND p.certifications IS NOT NULL AND jsonb_array_length(p.certifications) > 0';
    END IF;

    sql_query := sql_query || ' ORDER BY ' || sort_clause || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset;

    RETURN QUERY EXECUTE sql_query;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_professeur_by_id(
    professeur_id UUID
)
RETURNS TABLE (
    id UUID,
    titre VARCHAR,
    presentation TEXT,
    specialites TEXT[],
    annees_experience INTEGER,
    tarif_indicatif NUMERIC,
    tarif_horaire_min NUMERIC,
    tarif_horaire_max NUMERIC,
    nb_etudiants_formes INTEGER,
    is_publie BOOLEAN,
    note_moyenne NUMERIC,
    nb_notes INTEGER,
    certifications JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    profile_full_name TEXT,
    profile_avatar_url TEXT,
    profile_bio TEXT,
    profile_email TEXT,
    profile_phone TEXT,
    profile_linkedin_url TEXT,
    profile_site_web TEXT,
    profile_langues TEXT[],
    profile_competences TEXT[],
    profile_diplomes JSONB,
    profile_formations_parcours JSONB,
    pays_nom TEXT,
    ville_nom TEXT,
    quartier_nom TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.titre,
        p.presentation,
        p.specialites,
        p.annees_experience,
        p.tarif_indicatif,
        p.tarif_horaire_min,
        p.tarif_horaire_max,
        p.nb_etudiants_formes,
        p.is_publie,
        p.note_moyenne,
        p.nb_notes,
        p.certifications,
        p.created_at,
        p.updated_at,
        pr.full_name AS profile_full_name,
        pr.avatar_url AS profile_avatar_url,
        pr.bio AS profile_bio,
        pr.email AS profile_email,
        pr.telephone AS profile_phone,
        pr.linkedin_url AS profile_linkedin_url,
        pr.site_web AS profile_site_web,
        pr.langues AS profile_langues,
        pr.competences AS profile_competences,
        pr.diplomes AS profile_diplomes,
        pr.formations_parcours AS profile_formations_parcours,
        pa.nom AS pays_nom,
        v.nom AS ville_nom,
        q.nom AS quartier_nom
    FROM
        public.professeurs p
    JOIN
        public.profiles pr ON p.id = pr.id
    LEFT JOIN
        public.pays pa ON pr.pays_id = pa.id
    LEFT JOIN
        public.villes v ON pr.ville_id = v.id
    LEFT JOIN
        public.quartiers q ON pr.quartier_id = q.id
    WHERE
        p.id = professeur_id;
END;
$$;
