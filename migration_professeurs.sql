-- Add columns to professors table to decouple from profiles
ALTER TABLE public.professeurs
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS telephone text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS site_web text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS langues text[], -- Array of text
ADD COLUMN IF NOT EXISTS diplomes jsonb,
ADD COLUMN IF NOT EXISTS formations_parcours jsonb;

-- Optional: Copy data from profiles if you want to migrate existing data
-- This assumes the 'id' in professors matches 'id' in profiles
-- UPDATE public.professeurs p
-- SET
--     full_name = pr.full_name,
--     email = pr.email,
--     telephone = pr.telephone,
--     image_url = pr.avatar_url,
--     site_web = pr.site_web,
--     linkedin_url = pr.linkedin_url,
--     langues = pr.langues,
--     diplomes = pr.diplomes,
--     formations_parcours = pr.formations_parcours
-- FROM public.profiles pr
-- WHERE p.id = pr.id;
