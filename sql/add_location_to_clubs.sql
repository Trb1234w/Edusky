-- Migration: Add location columns to clubs table
-- This adds pays_id, ville_id, and quartier_id to link clubs to location tables

ALTER TABLE public.clubs
ADD COLUMN pays_id uuid REFERENCES public.pays(id),
ADD COLUMN ville_id uuid REFERENCES public.villes(id),
ADD COLUMN quartier_id uuid REFERENCES public.quartiers(id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clubs_pays_id ON public.clubs(pays_id);
CREATE INDEX IF NOT EXISTS idx_clubs_ville_id ON public.clubs(ville_id);
CREATE INDEX IF NOT EXISTS idx_clubs_quartier_id ON public.clubs(quartier_id);

-- Comment on columns
COMMENT ON COLUMN public.clubs.pays_id IS 'Foreign key to pays table';
COMMENT ON COLUMN public.clubs.ville_id IS 'Foreign key to villes table';
COMMENT ON COLUMN public.clubs.quartier_id IS 'Foreign key to quartiers table';
