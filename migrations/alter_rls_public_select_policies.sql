-- Fichier de migration SQL pour modifier les politiques RLS
-- Objectif : Rendre les pages de détail des professeurs, formations, événements, clubs et articles de blog visibles par tous.

-- 1. Modifier la politique SELECT pour la table 'public.professeurs'
ALTER POLICY profs_select_public ON public.professeurs USING (true);

-- 2. Modifier la politique SELECT pour la table 'public.formations'
ALTER POLICY formations_select_public ON public.formations USING (true);

-- 3. Modifier la politique SELECT pour la table 'public.evenements'
ALTER POLICY evenements_select_public ON public.evenements USING (true);

-- 4. Modifier la politique SELECT pour la table 'public.clubs'
ALTER POLICY clubs_select_public ON public.clubs USING (true);

-- 5. Modifier la politique SELECT pour la table 'public.articles_blog'
ALTER POLICY articles_select_public ON public.articles_blog USING (true);