-- This script removes foreign key constraints linking content tables to profiles.
-- IMPORTANT: PostgreSQL automatically generates constraint names.
-- You might need to adjust the constraint names below to match the actual names in your database.
-- You can find actual constraint names by querying:
-- SELECT conname FROM pg_constraint WHERE conrelid = 'public.formations'::regclass AND contype = 'f';

-- Remove foreign key constraint from public.formations.professeur_id
ALTER TABLE public.formations
DROP CONSTRAINT IF EXISTS formations_professeur_id_fkey; -- Common auto-generated name, adjust if different

-- Remove foreign key constraint from public.evenements.organisateur_id
ALTER TABLE public.evenements
DROP CONSTRAINT IF EXISTS evenements_organisateur_id_fkey; -- Common auto-generated name, adjust if different

-- Remove foreign key constraint from public.clubs.leader_id
ALTER TABLE public.clubs
DROP CONSTRAINT IF EXISTS clubs_leader_id_fkey; -- Common auto-generated name, adjust if different

-- Remove foreign key constraint from public.articles_blog.auteur_id
ALTER TABLE public.articles_blog
DROP CONSTRAINT IF EXISTS articles_blog_auteur_id_fkey; -- Common auto-generated name, adjust if different

-- Optional: If you want to allow NULL values where they were previously NOT NULL due to FK
-- ALTER TABLE public.formations ALTER COLUMN professeur_id DROP NOT NULL;
-- ALTER TABLE public.evenements ALTER COLUMN organisateur_id DROP NOT NULL;
-- ALTER TABLE public.clubs ALTER COLUMN leader_id DROP NOT NULL;
-- ALTER TABLE public.articles_blog ALTER COLUMN auteur_id DROP NOT NULL;

-- Note: The columns themselves (professeur_id, organisateur_id, leader_id, auteur_id) will remain.
-- They will simply no longer enforce a reference to the profiles/professeurs table.