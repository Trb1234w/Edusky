-- Migration: Enrichir la table inscriptions_club
-- Date: 2025-12-07
-- Description: Ajout de champs pour collecter plus d'informations lors des inscriptions aux clubs

ALTER TABLE inscriptions_club
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 120),
ADD COLUMN IF NOT EXISTS date_naissance DATE,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS niveau_experience TEXT CHECK (niveau_experience IN ('debutant', 'intermediaire', 'avance', 'expert')),
ADD COLUMN IF NOT EXISTS centres_interet TEXT[],
ADD COLUMN IF NOT EXISTS motivation_adhesion TEXT,
ADD COLUMN IF NOT EXISTS disponibilite_semaine TEXT[],
ADD COLUMN IF NOT EXISTS comment_connu TEXT,
ADD COLUMN IF NOT EXISTS parraine_par TEXT,
ADD COLUMN IF NOT EXISTS accepte_reglement BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS accepte_communication BOOLEAN DEFAULT true;

-- Commentaires sur les colonnes
COMMENT ON COLUMN inscriptions_club.whatsapp IS 'Numéro WhatsApp du membre';
COMMENT ON COLUMN inscriptions_club.age IS 'Âge du membre';
COMMENT ON COLUMN inscriptions_club.date_naissance IS 'Date de naissance du membre';
COMMENT ON COLUMN inscriptions_club.profession IS 'Profession du membre';
COMMENT ON COLUMN inscriptions_club.niveau_experience IS 'Niveau d''expérience dans le domaine du club';
COMMENT ON COLUMN inscriptions_club.centres_interet IS 'Centres d''intérêt du membre';
COMMENT ON COLUMN inscriptions_club.motivation_adhesion IS 'Motivation pour rejoindre le club';
COMMENT ON COLUMN inscriptions_club.disponibilite_semaine IS 'Jours de disponibilité dans la semaine';
COMMENT ON COLUMN inscriptions_club.comment_connu IS 'Comment le membre a connu le club';
COMMENT ON COLUMN inscriptions_club.parraine_par IS 'Nom du membre parrain';
COMMENT ON COLUMN inscriptions_club.accepte_reglement IS 'Acceptation du règlement intérieur';
COMMENT ON COLUMN inscriptions_club.accepte_communication IS 'Accepte de recevoir des communications du club';
