-- ====================================================================
-- AUTOMATISATION DE LA CRÉATION DE PROFIL (SUPABASE AUTH -> PUBLIC.PROFILES)
-- ====================================================================

-- 1. Fonction pour créer un profil automatique
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Génération d'un username par défaut si absent des métadonnées
  v_username := COALESCE(
    new.raw_user_meta_data->>'username', 
    'user_' || substr(new.id::text, 1, 8)
  );

  INSERT INTO public.profiles (
    id, 
    full_name, 
    avatar_url, 
    email, 
    role, 
    username,
    prenom,
    nom
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'utilisateur'),
    v_username,
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'nom'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
