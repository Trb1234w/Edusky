-- =============================================
-- TRIGGER DEBUG & FIX
-- =============================================

-- 1. Table de logs pour comprendre ce qui se passe dans le trigger
CREATE TABLE IF NOT EXISTS debug_logs (
    id SERIAL PRIMARY KEY,
    msg TEXT,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Permettre de voir les logs
ALTER TABLE debug_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read debug logs" ON debug_logs FOR SELECT USING (true);
CREATE POLICY "Everyone insert debug logs" ON debug_logs FOR INSERT WITH CHECK (true);

-- 2. Mise à jour du Trigger avec des LOGS
CREATE OR REPLACE FUNCTION notify_on_like() RETURNS TRIGGER AS $$
DECLARE
    target_owner_id UUID;
    target_content TEXT;
    liker_name TEXT;
    notif_url TEXT;
BEGIN
    -- LOG 1: Début du trigger
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('Trigger notify_on_like START', jsonb_build_object('user_id', NEW.user_id, 'parent_id', NEW.parent_id, 'parent_type', NEW.parent_type));

    -- 1. Récupérer le nom de celui qui like
    SELECT full_name INTO liker_name FROM profiles WHERE id = NEW.user_id;
    IF liker_name IS NULL THEN liker_name := 'Un utilisateur'; END IF;

    -- 2. Identifier le type de contenu liké
    IF NEW.parent_type = 'post' THEN
        -- C'est un post social (table 'postes')
        SELECT auteur_id INTO target_owner_id FROM postes WHERE id = NEW.parent_id;
        target_content := 'votre publication';
        notif_url := '/feed';
        
        -- LOG 2: Post trouvé ?
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Check Post Owner', jsonb_build_object('target_owner_id', target_owner_id, 'post_id', NEW.parent_id));
        
    ELSIF NEW.parent_type = 'article_blog' THEN
        -- C'est un article de blog
        SELECT auteur_id, titre INTO target_owner_id, target_content FROM articles_blog WHERE id = NEW.parent_id;
        target_content := 'votre article "' || COALESCE(target_content, 'Blog') || '"';
        notif_url := '/blog/' || NEW.parent_id;

        -- LOG 2: Blog trouvé ?
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Check Blog Owner', jsonb_build_object('target_owner_id', target_owner_id, 'article_id', NEW.parent_id));
    ELSE
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Unknown parent_type', jsonb_build_object('parent_type', NEW.parent_type));
    END IF;

    -- 3. Insérer la notification
    IF target_owner_id IS NOT NULL THEN
        IF target_owner_id != NEW.user_id THEN
            INSERT INTO notifications (user_id, message, type, ref_id, ref_table, url, is_read)
            VALUES (
                target_owner_id,
                liker_name || ' a aimé ' || target_content || '.',
                'like',
                NEW.parent_id,
                NEW.parent_type,
                notif_url,
                false
            );
            
            -- LOG 3: Succès
            INSERT INTO debug_logs (msg, payload) VALUES 
            ('Notification INSERTED', jsonb_build_object('recipient', target_owner_id));
        ELSE
             -- LOG 3: Echec (Même utilisateur)
            INSERT INTO debug_logs (msg, payload) VALUES 
            ('Skipped: Self-Like', jsonb_build_object('owner', target_owner_id, 'liker', NEW.user_id));
        END IF;
    ELSE
        -- LOG 3: Echec (Owner Pas trouvé)
        INSERT INTO debug_logs (msg, payload) VALUES 
        ('Skipped: Owner Not Found', jsonb_build_object('parent_id', NEW.parent_id));
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Debug en cas de crash
    INSERT INTO debug_logs (msg, payload) VALUES 
    ('CRASH TRIGGER', jsonb_build_object('error', SQLERRM));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
