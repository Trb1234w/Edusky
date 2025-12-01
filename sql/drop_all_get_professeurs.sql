-- =====================================================
-- Script de nettoyage : Supprimer toutes les versions de get_professeurs
-- =====================================================

-- Supprimer toutes les versions possibles de la fonction get_professeurs
-- Version 1 : Ancienne version avec 6 paramètres
DROP FUNCTION IF EXISTS public.get_professeurs(TEXT, NUMERIC, BOOLEAN, TEXT, INT, INT);

-- Version 2 : Version avec tous les filtres (19 paramètres)
DROP FUNCTION IF EXISTS public.get_professeurs(TEXT, NUMERIC, BOOLEAN, TEXT, INT, INT, TEXT, TEXT, UUID, UUID, UUID, INT, INT, NUMERIC, NUMERIC, TEXT, INT, BOOLEAN, TEXT);

-- Si aucune des versions ci-dessus ne fonctionne, utiliser cette commande pour supprimer TOUTES les fonctions get_professeurs
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc 
        WHERE proname = 'get_professeurs' 
        AND pronamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.get_professeurs(' || r.argtypes || ')';
        RAISE NOTICE 'Dropped function: get_professeurs(%)', r.argtypes;
    END LOOP;
END $$;

-- Vérifier qu'il n'y a plus de fonction get_professeurs
SELECT proname, oidvectortypes(proargtypes) as argtypes
FROM pg_proc 
WHERE proname = 'get_professeurs' 
AND pronamespace = 'public'::regnamespace;
