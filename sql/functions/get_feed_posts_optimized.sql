-- ÉTAPE 1 : Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS get_feed_posts_optimized(uuid);
DROP FUNCTION IF EXISTS get_feed_posts_optimized(uuid, integer, timestamptz);

-- ÉTAPE 2 : Créer la fonction avec pagination (cursor-based)
CREATE OR REPLACE FUNCTION get_feed_posts_optimized(
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 10,
  p_cursor TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  contenu TEXT,
  media JSONB,
  created_at TIMESTAMPTZ,
  auteur_id UUID,
  auteur_full_name TEXT,
  auteur_username TEXT,
  auteur_avatar_url TEXT,
  auteur_prenom TEXT,
  auteur_nom TEXT,
  likes_count BIGINT,
  comments_count BIGINT,
  shares_count BIGINT,
  is_liked BOOLEAN,
  shared_post_id UUID,
  shared_post_contenu TEXT,
  shared_post_media JSONB,
  shared_post_created_at TIMESTAMPTZ,
  shared_post_auteur_id UUID,
  shared_post_auteur_full_name TEXT,
  shared_post_auteur_username TEXT,
  shared_post_auteur_avatar_url TEXT,
  shared_post_auteur_prenom TEXT,
  shared_post_auteur_nom TEXT,
  shared_post_likes_count BIGINT,
  shared_post_comments_count BIGINT,
  shared_post_shares_count BIGINT,
  shared_post_is_liked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.contenu,
    p.media,
    p.created_at,
    prof.id as auteur_id,
    prof.full_name as auteur_full_name,
    prof.username as auteur_username,
    prof.avatar_url as auteur_avatar_url,
    prof.prenom as auteur_prenom,
    prof.nom as auteur_nom,
    COALESCE(likes.count, 0) as likes_count,
    COALESCE(comments.count, 0) as comments_count,
    COALESCE(shares.count, 0) as shares_count,
    CASE WHEN user_likes.parent_id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked,
    sp.id as shared_post_id,
    sp.contenu as shared_post_contenu,
    sp.media as shared_post_media,
    sp.created_at as shared_post_created_at,
    sp_prof.id as shared_post_auteur_id,
    sp_prof.full_name as shared_post_auteur_full_name,
    sp_prof.username as shared_post_auteur_username,
    sp_prof.avatar_url as shared_post_auteur_avatar_url,
    sp_prof.prenom as shared_post_auteur_prenom,
    sp_prof.nom as shared_post_auteur_nom,
    COALESCE(sp_likes.count, 0) as shared_post_likes_count,
    COALESCE(sp_comments.count, 0) as shared_post_comments_count,
    COALESCE(sp_shares.count, 0) as shared_post_shares_count,
    CASE WHEN sp_user_likes.parent_id IS NOT NULL THEN TRUE ELSE FALSE END as shared_post_is_liked
  FROM postes p
  LEFT JOIN profiles prof ON p.auteur_id = prof.id
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM likes WHERE parent_id = p.id AND parent_type = 'post'
  ) likes ON TRUE
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM commentaires WHERE parent_poste = p.id
  ) comments ON TRUE
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM postes WHERE partage_de = p.id
  ) shares ON TRUE
  LEFT JOIN likes user_likes ON user_likes.parent_id = p.id 
    AND user_likes.parent_type = 'post' 
    AND user_likes.user_id = p_user_id
  LEFT JOIN postes sp ON p.partage_de = sp.id
  LEFT JOIN profiles sp_prof ON sp.auteur_id = sp_prof.id
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM likes WHERE parent_id = sp.id AND parent_type = 'post'
  ) sp_likes ON sp.id IS NOT NULL
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM commentaires WHERE parent_poste = sp.id
  ) sp_comments ON sp.id IS NOT NULL
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count FROM postes WHERE partage_de = sp.id
  ) sp_shares ON sp.id IS NOT NULL
  LEFT JOIN likes sp_user_likes ON sp_user_likes.parent_id = sp.id 
    AND sp_user_likes.parent_type = 'post' 
    AND sp_user_likes.user_id = p_user_id
  WHERE (p_cursor IS NULL OR p.created_at < p_cursor)
  ORDER BY p.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_feed_posts_optimized IS 'Récupère les posts du feed avec pagination cursor-based pour infinite scroll. Paramètres: p_user_id (UUID), p_limit (nombre de posts, défaut 10), p_cursor (timestamp du dernier post vu)';
