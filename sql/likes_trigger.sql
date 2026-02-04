-- =============================================
-- Trigger pour les LIKES (Interactions)
-- =============================================

CREATE OR REPLACE FUNCTION notify_on_like() RETURNS TRIGGER AS $$
DECLARE
    target_owner_id UUID;
    target_content TEXT;
    liker_name TEXT;
    notif_url TEXT;
BEGIN
    -- 1. Récupérer le nom de celui qui like
    -- On utilise NEW.user_id
    SELECT full_name INTO liker_name FROM profiles WHERE id = NEW.user_id;
    IF liker_name IS NULL THEN liker_name := 'Un utilisateur'; END IF;

    -- 2. Identifier le type de contenu liké
    IF NEW.parent_type = 'post' THEN
        -- C'est un post social (table 'postes')
        -- On récupère l'auteur du post
        SELECT auteur_id INTO target_owner_id FROM postes WHERE id = NEW.parent_id;
        
        -- On génère un résumé du contenu ou titre générique
        target_content := 'votre publication';
        notif_url := '/feed'; -- Ou lien vers le post spécifique si dispo
        
    ELSIF NEW.parent_type = 'article_blog' THEN
        -- C'est un article de blog (table 'articles_blog')
        SELECT auteur_id, titre INTO target_owner_id, target_content FROM articles_blog WHERE id = NEW.parent_id;
        
        target_content := 'votre article "' || COALESCE(target_content, 'Blog') || '"';
        notif_url := '/blog/' || NEW.parent_id;
        
    -- ELSIF NEW.parent_type = 'comment' THEN ...
    END IF;

    -- 3. Insérer la notification (si on a trouvé un propriétaire et ce n'est pas soi-même)
    IF target_owner_id IS NOT NULL AND target_owner_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, message, type, ref_id, ref_table, url, is_read)
        VALUES (
            target_owner_id,
            liker_name || ' a aimé ' || target_content || '.',
            'like',
            NEW.parent_id,
            NEW.parent_type, -- 'post' ou 'article_blog'
            notif_url,
            false
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger à la table 'likes'
DROP TRIGGER IF EXISTS on_like_created ON likes;
CREATE TRIGGER on_like_created
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_like();
