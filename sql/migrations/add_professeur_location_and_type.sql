-- =====================================================
-- Migration: Ajout des colonnes de localisation et type
-- à la table professeurs
-- =====================================================

-- 1. Ajout des colonnes de localisation (pays, ville, quartier)
ALTER TABLE public.professeurs 
ADD COLUMN IF NOT EXISTS pays_id UUID REFERENCES public.pays(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS ville_id UUID REFERENCES public.villes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS quartier_id UUID REFERENCES public.quartiers(id) ON DELETE SET NULL;

-- 2. Ajout de la colonne type pour catégoriser les professeurs
-- Utilisation de TEXT pour plus de flexibilité (peut être changé en ENUM plus tard)
ALTER TABLE public.professeurs 
ADD COLUMN IF NOT EXISTS type TEXT;

-- 3. Création des index pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_professeurs_pays_id ON public.professeurs(pays_id);
CREATE INDEX IF NOT EXISTS idx_professeurs_ville_id ON public.professeurs(ville_id);
CREATE INDEX IF NOT EXISTS idx_professeurs_quartier_id ON public.professeurs(quartier_id);
CREATE INDEX IF NOT EXISTS idx_professeurs_type ON public.professeurs(type);

-- 4. Ajout d'index sur les champs existants qui seront filtrés
CREATE INDEX IF NOT EXISTS idx_professeurs_annees_experience ON public.professeurs(annees_experience);
CREATE INDEX IF NOT EXISTS idx_professeurs_tarif_indicatif ON public.professeurs(tarif_indicatif);
CREATE INDEX IF NOT EXISTS idx_professeurs_note_moyenne ON public.professeurs(note_moyenne);
CREATE INDEX IF NOT EXISTS idx_professeurs_nb_etudiants ON public.professeurs(nb_etudiants_formes);

-- 5. Commentaires pour documentation
COMMENT ON COLUMN public.professeurs.pays_id IS 'Pays de localisation du professeur';
COMMENT ON COLUMN public.professeurs.ville_id IS 'Ville de localisation du professeur';
COMMENT ON COLUMN public.professeurs.quartier_id IS 'Quartier de localisation du professeur';
COMMENT ON COLUMN public.professeurs.type IS 'Type de professeur: a_domicile, en_ligne, mentor, coach, tuteur';

-- =====================================================
-- Rollback (si nécessaire)
-- =====================================================
-- ALTER TABLE public.professeurs DROP COLUMN IF EXISTS pays_id;
-- ALTER TABLE public.professeurs DROP COLUMN IF EXISTS ville_id;
-- ALTER TABLE public.professeurs DROP COLUMN IF EXISTS quartier_id;
-- ALTER TABLE public.professeurs DROP COLUMN IF EXISTS type;
-- DROP INDEX IF EXISTS idx_professeurs_pays_id;
-- DROP INDEX IF EXISTS idx_professeurs_ville_id;
-- DROP INDEX IF EXISTS idx_professeurs_quartier_id;
-- DROP INDEX IF EXISTS idx_professeurs_type;
-- DROP INDEX IF EXISTS idx_professeurs_annees_experience;
-- DROP INDEX IF EXISTS idx_professeurs_tarif_indicatif;
-- DROP INDEX IF EXISTS idx_professeurs_note_moyenne;
-- DROP INDEX IF EXISTS idx_professeurs_nb_etudiants;
