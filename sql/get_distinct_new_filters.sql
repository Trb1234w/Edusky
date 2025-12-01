-- =====================================================
-- Fonctions SQL pour les nouveaux filtres de professeurs
-- =====================================================

-- 1. Fonction pour récupérer les langues d'enseignement distinctes
CREATE OR REPLACE FUNCTION public.get_distinct_langues_enseignement()
RETURNS TABLE (langue TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(pr.langues_enseignement) AS langue
    FROM public.professeurs pr
    WHERE pr.langues_enseignement IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY langue;
END;
$$;

-- 2. Fonction pour récupérer les méthodes pédagogiques distinctes
CREATE OR REPLACE FUNCTION public.get_distinct_methodes_pedagogiques()
RETURNS TABLE (methode TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(pr.methodes_pedagogiques) AS methode
    FROM public.professeurs pr
    WHERE pr.methodes_pedagogiques IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY methode;
END;
$$;

-- 3. Fonction pour récupérer les domaines d'intervention distincts
CREATE OR REPLACE FUNCTION public.get_distinct_domaines_intervention()
RETURNS TABLE (domaine TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(pr.domaines_intervention) AS domaine
    FROM public.professeurs pr
    WHERE pr.domaines_intervention IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY domaine;
END;
$$;

-- 4. Fonction pour récupérer les modalités de cours distinctes
CREATE OR REPLACE FUNCTION public.get_distinct_modalites_cours()
RETURNS TABLE (modalite TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(pr.modalites_cours) AS modalite
    FROM public.professeurs pr
    WHERE pr.modalites_cours IS NOT NULL 
      AND pr.is_publie = TRUE
    ORDER BY modalite;
END;
$$;

-- 5. Fonction pour récupérer les langues distinctes des clubs
CREATE OR REPLACE FUNCTION public.get_distinct_club_langues()
RETURNS TABLE (langue TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT unnest(cl.langues) AS langue
    FROM public.clubs cl
    WHERE cl.langues IS NOT NULL
    ORDER BY langue;
END;
$$;

-- Commentaires pour documentation
COMMENT ON FUNCTION public.get_distinct_langues_enseignement() IS 'Retourne les langues d''enseignement distinctes des professeurs';
COMMENT ON FUNCTION public.get_distinct_methodes_pedagogiques() IS 'Retourne les méthodes pédagogiques distinctes des professeurs';
COMMENT ON FUNCTION public.get_distinct_domaines_intervention() IS 'Retourne les domaines d''intervention distincts des professeurs';
COMMENT ON FUNCTION public.get_distinct_modalites_cours() IS 'Retourne les modalités de cours distinctes des professeurs';
COMMENT ON FUNCTION public.get_distinct_club_langues() IS 'Retourne les langues distinctes utilisées par les clubs';
