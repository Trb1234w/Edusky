-- Extensions de Profil EduSky Elite

-- 1. Table pour l'Éducation (LinkedIn-style)
CREATE TABLE public.profile_education (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_name text NOT NULL,
    degree text,
    field_of_study text,
    start_date date,
    end_date date,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Table pour l'Expérience Professionnelle (LinkedIn-style)
CREATE TABLE public.profile_experience (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name text NOT NULL,
    title text NOT NULL,
    location text,
    start_date date,
    end_date date,
    current boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Table Portfolio / Preuves de Compétences (L'aspect "Unique")
-- Permet de lier des projets concrets, des liens GitHub, des certificats externes, etc.
CREATE TABLE public.profile_portfolio (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    project_url text, -- Lien vers le projet (site, repo, behance)
    image_url text,   -- Capture du projet
    skills_used text[], -- Tableau des compétences utilisées (ex: ['React', 'PostgreSQL'])
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Table Objectifs d'Apprentissage (L'aspect "Proactif")
-- Pour montrer ce que l'utilisateur est en train d'apprendre
CREATE TABLE public.profile_learning_goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_title text NOT NULL, -- ex: "Maîtriser l'IA avec Python"
    target_date date,
    status text DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'atteint', 'abandonne')),
    created_at timestamp with time zone DEFAULT now()
);

-- --- RLS POLICIES ---

ALTER TABLE public.profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_learning_goals ENABLE ROW LEVEL SECURITY;

-- Politique universelle de lecture
CREATE POLICY "Lecture publique éducation" ON public.profile_education FOR SELECT USING (true);
CREATE POLICY "Lecture publique expérience" ON public.profile_experience FOR SELECT USING (true);
CREATE POLICY "Lecture publique portfolio" ON public.profile_portfolio FOR SELECT USING (true);
CREATE POLICY "Lecture publique objectifs" ON public.profile_learning_goals FOR SELECT USING (true);

-- Politiques de gestion (Propriétaire uniquement)
CREATE POLICY "Gestion éducation" ON public.profile_education FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Gestion expérience" ON public.profile_experience FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Gestion portfolio" ON public.profile_portfolio FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Gestion objectifs" ON public.profile_learning_goals FOR ALL USING (auth.uid() = profile_id);

-- --- TRIGGERS ---
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_education_at BEFORE UPDATE ON public.profile_education FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_update_experience_at BEFORE UPDATE ON public.profile_experience FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
