-- Migration: Add professional columns to professeurs table
-- Description: Adds comprehensive professional information fields to make professor profiles complete

-- Add langues_enseignement column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS langues_enseignement TEXT[];

-- Add methodes_pedagogiques column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS methodes_pedagogiques TEXT[];

-- Add domaines_intervention column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS domaines_intervention TEXT[];

-- Add modalites_cours column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS modalites_cours TEXT[];

-- Add reseaux_sociaux column (JSONB for flexible social media links)
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS reseaux_sociaux JSONB;

-- Add site_web column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS site_web TEXT;

-- Add email_contact column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS email_contact TEXT;

-- Add telephone_professionnel column
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS telephone_professionnel TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.professeurs.langues_enseignement IS 'Langues dans lesquelles le professeur peut enseigner';
COMMENT ON COLUMN public.professeurs.methodes_pedagogiques IS 'Approches et méthodes pédagogiques utilisées par le professeur';
COMMENT ON COLUMN public.professeurs.domaines_intervention IS 'Domaines d''expertise et d''intervention du professeur';
COMMENT ON COLUMN public.professeurs.modalites_cours IS 'Modalités de cours préférées (en ligne, présentiel, hybride)';
COMMENT ON COLUMN public.professeurs.reseaux_sociaux IS 'Liens vers les réseaux sociaux professionnels (format JSON)';
COMMENT ON COLUMN public.professeurs.site_web IS 'Site web personnel ou professionnel du professeur';
COMMENT ON COLUMN public.professeurs.email_contact IS 'Email de contact professionnel';
COMMENT ON COLUMN public.professeurs.telephone_professionnel IS 'Numéro de téléphone professionnel';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_professeurs_langues_enseignement ON public.professeurs USING GIN (langues_enseignement);
CREATE INDEX IF NOT EXISTS idx_professeurs_methodes_pedagogiques ON public.professeurs USING GIN (methodes_pedagogiques);
CREATE INDEX IF NOT EXISTS idx_professeurs_domaines_intervention ON public.professeurs USING GIN (domaines_intervention);
CREATE INDEX IF NOT EXISTS idx_professeurs_modalites_cours ON public.professeurs USING GIN (modalites_cours);
