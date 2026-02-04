-- =============================================
-- TRIGGER REPAIR - FINAL (Utilisation des noms Français)
-- =============================================

CREATE OR REPLACE FUNCTION public.notify_on_like() RETURNS TRIGGER AS $$
DECLARE
    target_owner_id UUID;
    target_content TEXT;
    liker_name TEXT;
    notif_url TEXT;
BEGIN
    -- LOG: Début
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('Trigger START', jsonb_build_object('type', NEW.parent_type, 'id', NEW.parent_id));

    -- 1. Récupérer le nom de celui qui like
    SELECT full_name INTO liker_name FROM public.profiles WHERE id = NEW.user_id;
    IF liker_name IS NULL THEN liker_name := 'Un utilisateur'; END IF;

    -- 2. Identifier le contenu
    IF NEW.parent_type = 'post' THEN
        SELECT auteur_id INTO target_owner_id FROM public.postes WHERE id = NEW.parent_id;
        target_content := 'votre publication';
        notif_url := '/feed';
        
    ELSIF NEW.parent_type = 'article_blog' THEN
        SELECT auteur_id, titre INTO target_owner_id, target_content FROM public.articles_blog WHERE id = NEW.parent_id;
        target_content := 'votre article "' || COALESCE(target_content, 'Blog') || '"';
        notif_url := '/blog/' || NEW.parent_id;
    END IF;

    -- 3. Insérer la notification (En utilisant 'contenu' et 'lu')
    IF target_owner_id IS NOT NULL THEN
        IF target_owner_id != NEW.user_id THEN
            
            INSERT INTO public.notifications (user_id, contenu, type, ref_id, ref_table, url, lu)
            VALUES (
                target_owner_id,
                liker_name || ' a aimé ' || target_content || '.',
                'like',
                NEW.parent_id,
                NEW.parent_type,
                notif_url,
                false
            );
            
            INSERT INTO debug_logs (msg, payload) VALUES 
            ('Success: Notification Sent', jsonb_build_object('recipient', target_owner_id));
        ELSE
            INSERT INTO debug_logs (msg, payload) VALUES 
            ('Skipped: Self-Like', jsonb_build_object('user', NEW.user_id));
        END IF;
    ELSE
         INSERT INTO debug_logs (msg, payload) VALUES 
        ('Error: Target Owner Not Found', jsonb_build_object('parent_id', NEW.parent_id));
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('TRIGGER ERROR', jsonb_build_object('err', SQLERRM));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Réattacher le trigger
DROP TRIGGER IF EXISTS on_like_created ON public.likes;

CREATE TRIGGER on_like_created
    AFTER INSERT ON public.likes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_like();
