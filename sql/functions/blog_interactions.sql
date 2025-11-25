-- =====================================================
-- Fonctions SQL pour les interactions blog
-- =====================================================

-- 1. Fonction pour incrémenter les vues d'un article
CREATE OR REPLACE FUNCTION increment_article_views(article_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.articles_blog
  SET vues = vues + 1
  WHERE id = article_id_param;
END;
$$ LANGUAGE plpgsql;

-- 2. Fonction pour récupérer les commentaires d'un article avec les infos de l'auteur
CREATE OR REPLACE FUNCTION get_article_comments(article_id_param UUID)
RETURNS TABLE (
  id UUID,
  article_id UUID,
  auteur_id UUID,
  contenu TEXT,
  created_at TIMESTAMPTZ,
  auteur_full_name TEXT,
  auteur_avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.article_id,
    c.auteur_id,
    c.contenu,
    c.created_at,
    p.full_name AS auteur_full_name,
    p.avatar_url AS auteur_avatar_url
  FROM public.commentaires_blog c
  INNER JOIN public.profiles p ON c.auteur_id = p.id
  WHERE c.article_id = article_id_param
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. Fonction pour vérifier si un utilisateur a liké un article
CREATE OR REPLACE FUNCTION has_user_liked_article(
  user_id_param UUID,
  article_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.likes
    WHERE user_id = user_id_param
      AND parent_type = 'article_blog'
      AND parent_id = article_id_param
  ) INTO like_exists;
  
  RETURN like_exists;
END;
$$ LANGUAGE plpgsql;
