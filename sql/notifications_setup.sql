-- =============================================
-- 1. Mise à jour de la table Notifications (Existante)
-- =============================================

-- Vérification et ajout des colonnes manquantes sur la table 'notifications' existante
-- Colonnes existantes selon structure: id, user_id, type, ref_table, ref_id, contenu, metadata, lu, created_at

ALTER TABLE IF EXISTS notifications 
ADD COLUMN IF NOT EXISTS url TEXT; -- Lien direct vers la ressource

-- On s'assure que lu est false par défaut
ALTER TABLE notifications ALTER COLUMN lu SET DEFAULT false;

-- Activation RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins/Service Role can insert notifications" ON notifications;
CREATE POLICY "Admins/Service Role can insert notifications" ON notifications
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 2. Table Push Subscriptions (Web Push)
-- =============================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON push_subscriptions
FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 3. Fonctions et Triggers (Automatisation)
-- =============================================

-- A. Trigger pour NOUVEAU CONTENU (Formations, Events, Blog...)
-- =============================================================
CREATE OR REPLACE FUNCTION notify_new_content() RETURNS TRIGGER AS $$
DECLARE
    content_type TEXT;
    content_title TEXT;
    content_id UUID;
    v_url TEXT;
    recipient_id UUID;
BEGIN
    -- Identifier la source
    IF TG_TABLE_NAME = 'formations' THEN
        -- Uniquement si statut = 'publie' ?
        -- IF NEW.statut != 'publie' THEN RETURN NEW; END IF;
        content_type := 'formation';
        content_title := NEW.titre;
        content_id := NEW.id;
        v_url := '/formations/' || NEW.id;
        
    ELSIF TG_TABLE_NAME = 'evenements' THEN
        content_type := 'evenement';
        content_title := NEW.titre;
        content_id := NEW.id;
        v_url := '/evenements/' || NEW.id;
        
    ELSIF TG_TABLE_NAME = 'clubs' THEN
        content_type := 'club';
        content_title := NEW.nom;
        content_id := NEW.id;
        v_url := '/clubs/' || NEW.id;
        
    ELSIF TG_TABLE_NAME = 'articles_blog' THEN
        content_type := 'blog';
        content_title := NEW.titre;
        content_id := NEW.id;
        v_url := '/blog/' || NEW.id;
    END IF;

    -- Stratégie : Notifier TOUT LE MONDE (BroadCast) 
    -- Car l'admin poste du contenu pour tout le monde.
    -- Attention: Sur une grosse base users, faire ça en Trigger est lourd.
    -- Pour ce projet, on suppose une taille raisonnable ou on accepte le délai.
    -- Limitons aux 500 derniers utilisateurs actifs si besoin, ou tout le monde.
    
    FOR recipient_id IN SELECT id FROM profiles WHERE role != 'admin' LIMIT 1000 -- Sécurité perf
    LOOP
        INSERT INTO notifications (user_id, contenu, type, ref_id, ref_table, url, lu)
        VALUES (
            recipient_id,
            'Nouveauté : ' || content_title,
            'new_' || content_type,
            content_id,
            TG_TABLE_NAME,
            v_url,
            false
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers sur les tables de contenu
DROP TRIGGER IF EXISTS on_formation_created ON formations;
CREATE TRIGGER on_formation_created AFTER INSERT ON formations FOR EACH ROW EXECUTE FUNCTION notify_new_content();

DROP TRIGGER IF EXISTS on_event_created ON evenements;
CREATE TRIGGER on_event_created AFTER INSERT ON evenements FOR EACH ROW EXECUTE FUNCTION notify_new_content();

DROP TRIGGER IF EXISTS on_club_created ON clubs;
CREATE TRIGGER on_club_created AFTER INSERT ON clubs FOR EACH ROW EXECUTE FUNCTION notify_new_content();

DROP TRIGGER IF EXISTS on_blog_created ON articles_blog;
CREATE TRIGGER on_blog_created AFTER INSERT ON articles_blog FOR EACH ROW EXECUTE FUNCTION notify_new_content();


-- B. Trigger pour NOUVEAU FOLLOW (Suivis)
-- =======================================
CREATE OR REPLACE FUNCTION notify_new_follow() RETURNS TRIGGER AS $$
DECLARE
    follower_name TEXT;
BEGIN
    SELECT full_name INTO follower_name FROM profiles WHERE id = NEW.follower_id;
    
    INSERT INTO notifications (user_id, contenu, type, ref_id, ref_table, url, lu)
    VALUES (
        NEW.followed_id,
        follower_name || ' vous suit maintenant.',
        'follow',
        NEW.follower_id,
        'profiles',
        '/profile/' || NEW.follower_id, -- A adapter
        false
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_created ON suivis;
CREATE TRIGGER on_follow_created AFTER INSERT ON suivis FOR EACH ROW EXECUTE FUNCTION notify_new_follow();


-- C. Trigger pour INSCRIPTIONS (Formations / Events / Clubs)
-- ==========================================================
-- Quand quelqu'un s'inscrit, notifier l'organisateur/prof
CREATE OR REPLACE FUNCTION notify_new_inscription() RETURNS TRIGGER AS $$
DECLARE
    target_owner_id UUID;
    item_title TEXT;
    participant_name TEXT;
    notif_msg TEXT;
BEGIN
    -- Récupérer info participant
    SELECT full_name INTO participant_name FROM profiles WHERE id = NEW.user_id;

    IF TG_TABLE_NAME = 'inscriptions_formation' THEN
        SELECT professeur_id, titre INTO target_owner_id, item_title FROM formations WHERE id = NEW.formation_id;
        notif_msg := participant_name || ' s''est inscrit à la formation "' || item_title || '"';
        
    ELSIF TG_TABLE_NAME = 'inscriptions_evenement' THEN
        SELECT organisateur_id, titre INTO target_owner_id, item_title FROM evenements WHERE id = NEW.evenement_id;
        notif_msg := participant_name || ' participe à l''événement "' || item_title || '"';
        
    ELSIF TG_TABLE_NAME = 'inscriptions_club' THEN
        SELECT leader_id, nom INTO target_owner_id, item_title FROM clubs WHERE id = NEW.club_id;
        notif_msg := participant_name || ' a rejoint le club "' || item_title || '"';
    END IF;

    IF target_owner_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, contenu, type, ref_id, ref_table, url, lu)
        VALUES (
            target_owner_id,
            notif_msg,
            'inscription',
            NEW.id,
            TG_TABLE_NAME,
            '/dashboard', -- Redirige vers le dashboard pour voir l'inscription
            false
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_inscr_formation ON inscriptions_formation;
CREATE TRIGGER on_inscr_formation AFTER INSERT ON inscriptions_formation FOR EACH ROW EXECUTE FUNCTION notify_new_inscription();

DROP TRIGGER IF EXISTS on_inscr_event ON inscriptions_evenement;
CREATE TRIGGER on_inscr_event AFTER INSERT ON inscriptions_evenement FOR EACH ROW EXECUTE FUNCTION notify_new_inscription();

DROP TRIGGER IF EXISTS on_inscr_club ON inscriptions_club;
CREATE TRIGGER on_inscr_club AFTER INSERT ON inscriptions_club FOR EACH ROW EXECUTE FUNCTION notify_new_inscription();
