-- =====================================================
-- Fonction SQL mise à jour pour récupérer les professeurs
-- Utilise UNIQUEMENT les colonnes de la table professeurs
-- =====================================================

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.get_professeurs(TEXT, NUMERIC, BOOLEAN, TEXT, INT, INT, TEXT, TEXT, UUID, UUID, UUID, INT, INT, NUMERIC, NUMERIC, TEXT, INT, BOOLEAN, TEXT);

-- Créer la nouvelle fonction qui utilise uniquement la table professeurs
CREATE OR REPLACE FUNCTION public.get_professeurs(
    search_term TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT 0,
    has_certification BOOLEAN DEFAULT NULL,
    sort_by TEXT DEFAULT 'note_moyenne_desc',
    p_limit INT DEFAULT 100,
    p_offset INT DEFAULT 0,
    -- Filtres supplémentaires
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
    type TEXT,
    pays_id UUID,
    ville_id UUID,
    quartier_id UUID,
    -- Champs directs de la table professeurs
    full_name TEXT,
    image_url TEXT,
    langues_enseignement TEXT[],
    methodes_pedagogiques TEXT[],
    modalites_cours TEXT[],
    domaines_intervention TEXT[],
    disponibilite JSONB,
    portfolio JSONB,
    diplomes JSONB,
    formations_parcours JSONB,
    reseaux_sociaux JSONB,
    site_web TEXT,
    linkedin_url TEXT,
    email_contact TEXT,
    telephone_professionnel TEXT,
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
            p.full_name,
            p.image_url,
            p.langues_enseignement,
            p.methodes_pedagogiques,
            p.modalites_cours,
            p.domaines_intervention,
            p.disponibilite,
            p.portfolio,
            p.diplomes,
            p.formations_parcours,
            p.reseaux_sociaux,
            p.site_web,
            p.linkedin_url,
            p.email_contact,
            p.telephone_professionnel,
            pa.nom AS pays_nom,
            v.nom AS ville_nom,
            q.nom AS quartier_nom
        FROM
            public.professeurs p
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
            AND ($12 IS NULL OR $12 = ANY(p.langues_enseignement))
            AND ($13 IS NULL OR p.nb_etudiants_formes >= $13)
            AND ($14 IS NULL OR (\r
                p.titre ILIKE ''%%'' || $14 || ''%%'' \r
                OR p.presentation ILIKE ''%%'' || $14 || ''%%'' \r
                OR p.full_name ILIKE ''%%'' || $14 || ''%%''\r
            ))
        ORDER BY %s
        LIMIT $15 OFFSET $16
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
        search_term,
        p_limit,
        p_offset;
END;
$$;

-- Mettre à jour la fonction pour les langues distinctes
DROP FUNCTION IF EXISTS public.get_distinct_professeur_langues();

CREATE OR REPLACE FUNCTION public.get_distinct_professeur_langues()
RETURNS TABLE (langue TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(p.langues_enseignement) AS langue
    FROM public.professeurs p
    WHERE p.langues_enseignement IS NOT NULL 
      AND p.is_publie = TRUE
    ORDER BY langue;
END;
$$;

-- Commentaires pour documentation
COMMENT ON FUNCTION public.get_professeurs IS 'Fonction principale pour récupérer les professeurs avec filtrage avancé - utilise uniquement la table professeurs';
COMMENT ON FUNCTION public.get_distinct_professeur_langues IS 'Retourne les langues d''enseignement distinctes des professeurs';
