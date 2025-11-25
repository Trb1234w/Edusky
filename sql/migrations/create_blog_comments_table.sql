-- =====================================================
-- Migration: Création de la table commentaires_blog
-- =====================================================

-- Table pour les commentaires d'articles de blog
CREATE TABLE IF NOT EXISTS public.commentaires_blog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles_blog(id) ON DELETE CASCADE,
  auteur_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_commentaires_blog_article_id ON public.commentaires_blog(article_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_blog_auteur_id ON public.commentaires_blog(auteur_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_blog_created_at ON public.commentaires_blog(created_at DESC);

-- Fonction trigger pour mettre à jour automatiquement comment_count dans articles_blog
CREATE OR REPLACE FUNCTION update_article_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrémenter le compteur lors de l'ajout d'un commentaire
    UPDATE public.articles_blog
    SET comment_count = comment_count + 1
    WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Décrémenter le compteur lors de la suppression d'un commentaire
    UPDATE public.articles_blog
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER trigger_update_article_comment_count
AFTER INSERT OR DELETE ON public.commentaires_blog
FOR EACH ROW EXECUTE FUNCTION update_article_comment_count();

-- =====================================================
-- Rollback (si nécessaire)
-- =====================================================
-- DROP TRIGGER IF EXISTS trigger_update_article_comment_count ON public.commentaires_blog;
-- DROP FUNCTION IF EXISTS update_article_comment_count();
-- DROP TABLE IF EXISTS public.commentaires_blog;
