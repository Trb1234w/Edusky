-- Fichier de migration SQL pour modifier la politique RLS CUD de la table professeurs
-- Objectif : Permettre aux professeurs de gérer leur propre profil de professeur.

-- Modifier la politique CUD pour la table 'public.professeurs'
-- Un professeur peut gérer son propre profil de professeur (id = auth.uid())
-- en plus des administrateurs.
ALTER POLICY profs_admin_cud ON public.professeurs
  USING ( public.is_admin(auth.uid()) OR id = auth.uid() )
  WITH CHECK ( public.is_admin(auth.uid()) OR id = auth.uid() );
