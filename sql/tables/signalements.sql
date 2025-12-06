CREATE TABLE public.signalements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('post', 'comment', 'user')),
  target_id uuid NOT NULL,
  raison text NOT NULL,
  statut text NOT NULL DEFAULT 'pending' CHECK (statut IN ('pending', 'resolved', 'dismissed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT signalements_pkey PRIMARY KEY (id),
  CONSTRAINT signalements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Index pour accélérer les recherches par statut ou par type
CREATE INDEX idx_signalements_statut ON public.signalements(statut);
CREATE INDEX idx_signalements_type_target ON public.signalements(type, target_id);
