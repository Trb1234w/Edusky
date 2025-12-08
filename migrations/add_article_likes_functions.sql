-- Fonctions pour incrémenter et décrémenter les likes des articles de blog
-- Date: 2025-12-08

-- Fonction pour incrémenter les likes
CREATE OR REPLACE FUNCTION increment_article_likes(article_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles_blog
  SET likes_count = likes_count + 1
  WHERE id = article_id_param;
END;
$$;

-- Fonction pour décrémenter les likes
CREATE OR REPLACE FUNCTION decrement_article_likes(article_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles_blog
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = article_id_param;
END;
$$;
