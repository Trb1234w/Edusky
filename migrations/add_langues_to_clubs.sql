-- Migration: Add langues column to clubs table
-- Description: Adds support for multiple languages in clubs for international platform support

-- Add langues column as TEXT array
ALTER TABLE public.clubs
ADD COLUMN IF NOT EXISTS langues TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN public.clubs.langues IS 'Langues utilisées ou supportées par le club (ex: français, anglais, espagnol)';

-- Create index for better query performance on langues
CREATE INDEX IF NOT EXISTS idx_clubs_langues ON public.clubs USING GIN (langues);
