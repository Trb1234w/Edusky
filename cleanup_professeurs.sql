-- Cleanup redundant columns in professors table
-- Keeping: email, telephone, langues, specialites
-- Dropping: email_contact, telephone_professionnel, langues_enseignement, domaines_intervention

-- Ensure data is migrated if needed (optional, assuming new columns are populated or will be)
-- UPDATE public.professeurs SET email = email_contact WHERE email IS NULL;
-- UPDATE public.professeurs SET telephone = telephone_professionnel WHERE telephone IS NULL;
-- UPDATE public.professeurs SET langues = langues_enseignement WHERE langues IS NULL;

ALTER TABLE public.professeurs
DROP COLUMN IF EXISTS email_contact,
DROP COLUMN IF EXISTS telephone_professionnel,
DROP COLUMN IF EXISTS langues_enseignement,
DROP COLUMN IF EXISTS domaines_intervention;
