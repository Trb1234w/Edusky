-- This script alters the data type of specific columns from UUID to TEXT.
-- This is done to remove the implicit constraint of these columns needing to be valid UUIDs
-- and to allow them to store arbitrary text values.

-- IMPORTANT: Changing a primary key type (like public.professeurs.id) can have cascading effects
-- on other tables that reference it. Ensure all referencing columns are also updated accordingly.

-- Alter public.formations.professeur_id to TEXT
ALTER TABLE public.formations
ALTER COLUMN professeur_id TYPE TEXT USING professeur_id::text;

-- Alter public.evenements.organisateur_id to TEXT
ALTER TABLE public.evenements
ALTER COLUMN organisateur_id TYPE TEXT USING organisateur_id::text;

-- Alter public.clubs.leader_id to TEXT
ALTER TABLE public.clubs
ALTER COLUMN leader_id TYPE TEXT USING leader_id::text;

-- Alter public.articles_blog.auteur_id to TEXT
ALTER TABLE public.articles_blog
ALTER COLUMN auteur_id TYPE TEXT USING auteur_id::text;
