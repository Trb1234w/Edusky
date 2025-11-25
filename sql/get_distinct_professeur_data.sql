-- =====================================================
-- Fonctions SQL pour les filtres de professeurs
-- =====================================================

-- 0. Supprimer l'ancienne fonction get_professeurs si elle existe
DROP FUNCTION IF EXISTS public.get_professeurs(TEXT, NUMERIC, BOOLEAN, TEXT, INT, INT);

-- 1. Fonction pour récupérer les localisations distinctes des professeurs
CREATE OR REPLACE FUNCTION public.get_distinct_professeur_locations()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'countries', (
            SELECT COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', p.id, 'nom', p.nom)), '[]'::jsonb)
            FROM public.pays p
            WHERE EXISTS (
                SELECT 1 FROM public.professeurs pr WHERE pr.pays_id = p.id AND pr.is_publie = TRUE
            )
        ),
        'villes', (
            SELECT COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', v.id, 'nom', v.nom, 'pays_id', v.pays_id)), '[]'::jsonb)
            FROM public.villes v
            WHERE EXISTS (
                SELECT 1 FROM public.professeurs pr WHERE pr.ville_id = v.id AND pr.is_publie = TRUE
            )
        ),
        'quartiers', (
            SELECT COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', q.id, 'nom', q.nom, 'ville_id', q.ville_id)), '[]'::jsonb)
            FROM public.quartiers q
            WHERE EXISTS (
                SELECT 1 FROM public.professeurs pr WHERE pr.quartier_id = q.id AND pr.is_publie = TRUE
            )
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- 2. Fonction pour récupérer les types distincts de professeurs
CREATE OR REPLACE FUNCTION public.get_distinct_professeur_types()
RETURNS TABLE (type TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT pr.type
    FROM public.professeurs pr
    WHERE pr.type IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY pr.type;
END;
$$;

-- 3. Fonction pour récupérer les spécialités distinctes
CREATE OR REPLACE FUNCTION public.get_distinct_professeur_specialties()
RETURNS TABLE (specialite TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(pr.specialites) AS specialite
    FROM public.professeurs pr
    WHERE pr.specialites IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY specialite;
END;
$$;

-- 4. Fonction pour récupérer les langues distinctes
CREATE OR REPLACE FUNCTION public.get_distinct_professeur_langues()
RETURNS TABLE (langue TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(p.langues) AS langue
    FROM public.profiles p
    WHERE EXISTS (
        SELECT 1 FROM public.professeurs pr 
        WHERE pr.id = p.id AND pr.is_publie = TRUE
    )
    AND p.langues IS NOT NULL
    ORDER BY langue;
END;
$$;

-- 5. Mise à jour de la fonction get_professeurs avec TOUS les filtres
CREATE OR REPLACE FUNCTION public.get_professeurs(
    search_term TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT 0,
    has_certification BOOLEAN DEFAULT NULL,
    sort_by TEXT DEFAULT 'note_moyenne_desc',
    p_limit INT DEFAULT 100,
    p_offset INT DEFAULT 0,
    -- Nouveaux filtres
    type_filter TEXT DEFAULT NULL,
    specialite_filter TEXT DEFAULT NULL,
    pays_id_filter UUID DEFAULT NULL,
    ville_id_filter UUID DEFAULT NULL,
    quartier_id_filter UUID DEFAULT NULL,
    min_experience INT DEFAULT NULL,
    max_experience INT DEFAULT NULL,
    min_tarif NUMERIC DEFAULT NULL,
    max_tarif NUMERIC DEFAULT NULL,
    langue_filter TEXT DEFAULT NULL,
    min_etudiants INT DEFAULT NULL,
    is_verified_filter BOOLEAN DEFAULT NULL,
    genre_filter TEXT DEFAULT NULL
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
    -- Nouveaux champs
    type TEXT,
    pays_id UUID,
    ville_id UUID,
    quartier_id UUID,
    -- Champs du profil
    profile_full_name TEXT,
    profile_avatar_url TEXT,
    profile_langues TEXT[],
    profile_competences TEXT[],
    profile_genre TEXT,
    profile_is_verified BOOLEAN,
    -- Noms des localisations
    pays_nom TEXT,
    ville_nom TEXT,
    quartier_nom TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    sort_clause TEXT;
BEGIN
    -- Déterminer l'ordre de tri
    sort_clause := CASE sort_by
        WHEN 'note_moyenne_desc' THEN 'p.note_moyenne DESC NULLS LAST, p.nb_notes DESC'
        WHEN 'nb_etudiants_formes_desc' THEN 'p.nb_etudiants_formes DESC NULLS LAST'
        WHEN 'created_at_desc' THEN 'p.created_at DESC'
        WHEN 'tarif_asc' THEN 'p.tarif_indicatif ASC NULLS LAST'
        WHEN 'tarif_desc' THEN 'p.tarif_indicatif DESC NULLS LAST'
        WHEN 'experience_desc' THEN 'p.annees_experience DESC NULLS LAST'
        ELSE 'p.note_moyenne DESC NULLS LAST, p.nb_notes DESC'
    END;

    RETURN QUERY EXECUTE format('
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
            p.type,
            p.pays_id,
            p.ville_id,
            p.quartier_id,
            pr.full_name AS profile_full_name,
            pr.avatar_url AS profile_avatar_url,
            pr.langues AS profile_langues,
            pr.competences AS profile_competences,
            pr.genre AS profile_genre,
            pr.is_verified AS profile_is_verified,
            pa.nom AS pays_nom,
            v.nom AS ville_nom,
            q.nom AS quartier_nom
        FROM
            public.professeurs p
        INNER JOIN
            public.profiles pr ON p.id = pr.id
        LEFT JOIN
            public.pays pa ON p.pays_id = pa.id
        LEFT JOIN
            public.villes v ON p.ville_id = v.id
        LEFT JOIN
            public.quartiers q ON p.quartier_id = q.id
        WHERE
            p.is_publie = TRUE
            AND ($1 IS NULL OR p.note_moyenne >= $1)
            AND ($2 IS NULL OR (
                CASE 
                    WHEN $2 = TRUE THEN p.certifications IS NOT NULL AND jsonb_array_length(p.certifications) > 0
                    WHEN $2 = FALSE THEN p.certifications IS NULL OR jsonb_array_length(p.certifications) = 0
                    ELSE TRUE
                END
            ))
            AND ($3 IS NULL OR p.type = $3)
            AND ($4 IS NULL OR $4 = ANY(p.specialites))
            AND ($5 IS NULL OR p.pays_id = $5)
            AND ($6 IS NULL OR p.ville_id = $6)
            AND ($7 IS NULL OR p.quartier_id = $7)
            AND ($8 IS NULL OR p.annees_experience >= $8)
            AND ($9 IS NULL OR p.annees_experience <= $9)
            AND ($10 IS NULL OR p.tarif_indicatif >= $10)
            AND ($11 IS NULL OR p.tarif_indicatif <= $11)
            AND ($12 IS NULL OR $12 = ANY(pr.langues))
            AND ($13 IS NULL OR p.nb_etudiants_formes >= $13)
            AND ($14 IS NULL OR pr.is_verified = $14)
            AND ($15 IS NULL OR pr.genre = $15)
            AND ($16 IS NULL OR (
                p.titre ILIKE ''%%'' || $16 || ''%%'' 
                OR p.presentation ILIKE ''%%'' || $16 || ''%%'' 
                OR pr.full_name ILIKE ''%%'' || $16 || ''%%''
            ))
        ORDER BY %s
        LIMIT $17 OFFSET $18
    ', sort_clause)
    USING 
        min_rating,
        has_certification,
        type_filter,
        specialite_filter,
        pays_id_filter,
        ville_id_filter,
        quartier_id_filter,
        min_experience,
        max_experience,
        min_tarif,
        max_tarif,
        langue_filter,
        min_etudiants,
        is_verified_filter,
        genre_filter,
        search_term,
        p_limit,
        p_offset;
END;
$$;

-- 6. Commentaires pour documentation
COMMENT ON FUNCTION public.get_distinct_professeur_locations() IS 'Retourne les pays, villes et quartiers distincts des professeurs publiés';
COMMENT ON FUNCTION public.get_distinct_professeur_types() IS 'Retourne les types distincts de professeurs';
COMMENT ON FUNCTION public.get_distinct_professeur_specialties() IS 'Retourne les spécialités distinctes des professeurs';
COMMENT ON FUNCTION public.get_distinct_professeur_langues() IS 'Retourne les langues distinctes parlées par les professeurs';
COMMENT ON FUNCTION public.get_professeurs IS 'Fonction principale pour récupérer les professeurs avec filtrage avancé (13 filtres)';
