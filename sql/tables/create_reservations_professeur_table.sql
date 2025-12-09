CREATE TABLE public.reservations_professeur (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    professeur_id uuid NOT NULL REFERENCES public.professeurs(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date_heure_debut timestamp with time zone NOT NULL,
    date_heure_fin timestamp with time zone NOT NULL,
    statut text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'annule', 'terminee')),
    message_utilisateur text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Optional: Add indexes for better performance
CREATE INDEX idx_reservations_professeur_professeur_id ON public.reservations_professeur(professeur_id);
CREATE INDEX idx_reservations_professeur_user_id ON public.reservations_professeur(user_id);
CREATE INDEX idx_reservations_professeur_dates ON public.reservations_professeur(date_heure_debut, date_heure_fin);
