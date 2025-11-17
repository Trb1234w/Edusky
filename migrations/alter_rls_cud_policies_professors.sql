-- Fichier de migration SQL pour modifier les politiques RLS CUD
-- Objectif : Permettre aux professeurs de gérer leur propre contenu.

-- 1. Modifier la politique CUD pour la table 'public.professeurs'
-- Un professeur peut gérer son propre profil de professeur.
ALTER POLICY profs_admin_cud ON public.professeurs
  USING ( public.is_admin(auth.uid()) OR id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR id = auth.uid() );

-- 2. Modifier la politique CUD pour la table 'public.formations'
-- Un professeur peut gérer les formations dont il est le professeur_id.
ALTER POLICY formations_admin_cud ON public.formations
  USING ( public.is_admin(auth.uid()) OR professeur_id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR professeur_id = auth.uid() );

-- 3. Modifier la politique CUD pour la table 'public.evenements'
-- Un professeur peut gérer les événements dont il est l'organisateur_id.
ALTER POLICY evenements_admin_cud ON public.evenements
  USING ( public.is_admin(auth.uid()) OR organisateur_id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR organisateur_id = auth.uid() );

-- 4. Modifier la politique CUD pour la table 'public.clubs'
-- Un professeur peut gérer les clubs dont il est le leader_id.
ALTER POLICY clubs_admin_cud ON public.clubs
  USING ( public.is_admin(auth.uid()) OR leader_id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR leader_id = auth.uid() );

-- 5. Modifier la politique CUD pour la table 'public.articles_blog'
-- Un professeur peut gérer les articles de blog dont il est l'auteur_id.
ALTER POLICY articles_admin_cud ON public.articles_blog
  USING ( public.is_admin(auth.uid()) OR auteur_id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR auteur_id = auth.uid() );
