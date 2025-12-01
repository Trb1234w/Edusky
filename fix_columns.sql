-- Fix columns: Restore original columns and drop redundant new ones

-- 1. Restore original columns if they were dropped (or ensure they exist)
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS email_contact text,
ADD COLUMN IF NOT EXISTS telephone_professionnel text,
ADD COLUMN IF NOT EXISTS langues_enseignement text[],
ADD COLUMN IF NOT EXISTS domaines_intervention text[];

-- 2. Migrate data from new columns to old ones (if any data was entered)
-- UPDATE public.professeurs SET email_contact = email WHERE email_contact IS NULL;
-- UPDATE public.professeurs SET telephone_professionnel = telephone WHERE telephone_professionnel IS NULL;
-- UPDATE public.professeurs SET langues_enseignement = langues WHERE langues_enseignement IS NULL;

-- 3. Drop the new redundant columns
ALTER TABLE public.professeurs
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS telephone,
DROP COLUMN IF EXISTS langues;

-- Note: We keep 'full_name', 'image_url', 'diplomes', 'formations_parcours', 'linkedin_url', 'site_web' 
-- as they are required for decoupling and didn't exist in the original schema (or site_web/linkedin_url might have existed, check below).

-- Checking site_web and linkedin_url based on user provided schema:
-- site_web existed. linkedin_url existed.
-- So we should drop the new ones if they are duplicates, but wait, the names are the same?
-- User schema: site_web text null, linkedin_url text null.
-- My migration: ADD COLUMN IF NOT EXISTS site_web text.
-- So they are the same column, no need to drop.

-- However, 'email' vs 'email_contact' and 'telephone' vs 'telephone_professionnel' were definitely duplicates.
