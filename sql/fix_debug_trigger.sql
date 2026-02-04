-- =============================================
-- TRIGGER DEBUG REPAIR
-- =============================================

-- 1. On s'assure que la table de logs est accessible à 100%
CREATE TABLE IF NOT EXISTS debug_logs (
    id SERIAL PRIMARY KEY,
    msg TEXT,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- DÉSACTIVER RLS pour être sûr que ce n'est pas ça qui bloque l'écriture des logs
ALTER TABLE debug_logs DISABLE ROW LEVEL SECURITY;

-- Test d'écriture immédiat pour vérifier que cela marche
INSERT INTO debug_logs (msg, payload) VALUES ('Debug Table Init', '{"status": "ok"}'::jsonb);

-- 2. Refonte du Trigger avec schema "public" explicite
CREATE OR REPLACE FUNCTION public.notify_on_like() RETURNS TRIGGER AS $$
DECLARE
    target_owner_id UUID;
    target_content TEXT;
    liker_name TEXT;
    notif_url TEXT;
BEGIN
    -- LOG 1: Début
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('Trigger notify_on_like FIRED', jsonb_build_object(
        'new_user_id', NEW.user_id, 
        'new_parent_id', NEW.parent_id, 
        'new_parent_type', NEW.parent_type
    ));

    -- 1. Récupérer le nom de celui qui like
    SELECT full_name INTO liker_name FROM public.profiles WHERE id = NEW.user_id;
    IF liker_name IS NULL THEN liker_name := 'Un utilisateur'; END IF;

    -- 2. Identifier le type de contenu liké
    IF NEW.parent_type = 'post' THEN
        SELECT auteur_id INTO target_owner_id FROM public.postes WHERE id = NEW.parent_id;
        target_content := 'votre publication';
        notif_url := '/feed';
        
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Found Post Owner', jsonb_build_object('id', target_owner_id));
        
    ELSIF NEW.parent_type = 'article_blog' THEN
        SELECT auteur_id, titre INTO target_owner_id, target_content FROM public.articles_blog WHERE id = NEW.parent_id;
        target_content := 'votre article "' || COALESCE(target_content, 'Blog') || '"';
        notif_url := '/blog/' || NEW.parent_id;
        
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Found Blog Owner', jsonb_build_object('id', target_owner_id));
    ELSE
         INSERT INTO debug_logs (msg, payload) VALUES 
        ('Unknown parent_type', jsonb_build_object('val', NEW.parent_type));
    END IF;

    -- 3. Insérer la notification
    IF target_owner_id IS NOT NULL THEN
        IF target_owner_id != NEW.user_id THEN
            INSERT INTO public.notifications (user_id, message, type, ref_id, ref_table, url, is_read)
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
            ('Notification SENT', jsonb_build_object('to', target_owner_id));
        ELSE
            INSERT INTO debug_logs (msg, payload) VALUES 
            ('Skipped: Self-Like', jsonb_build_object('user', NEW.user_id));
        END IF;
    ELSE
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Skipped: Target Owner NULL', jsonb_build_object('parent_id', NEW.parent_id));
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('TRIGGER ERROR', jsonb_build_object('err', SQLERRM));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Réattacher le trigger (Explicitement sur public.likes)
DROP TRIGGER IF EXISTS on_like_created ON public.likes;

CREATE TRIGGER on_like_created
    AFTER INSERT ON public.likes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_like();
