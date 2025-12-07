-- Migration: Enrichir la table inscriptions_formation
-- Date: 2025-12-07
-- Description: Ajout de champs pour collecter plus d'informations lors des inscriptions

ALTER TABLE inscriptions_formation
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 120),
ADD COLUMN IF NOT EXISTS statut_professionnel TEXT CHECK (statut_professionnel IN ('etudiant', 'salarie', 'independant', 'chercheur_emploi', 'autre')),
ADD COLUMN IF NOT EXISTS niveau_etudes TEXT CHECK (niveau_etudes IN ('lycee', 'bac', 'licence', 'master', 'doctorat', 'autre')),
ADD COLUMN IF NOT EXISTS motivation TEXT,
ADD COLUMN IF NOT EXISTS objectifs_formation TEXT,
ADD COLUMN IF NOT EXISTS comment_connu TEXT;

-- Commentaires sur les colonnes
COMMENT ON COLUMN inscriptions_formation.whatsapp IS 'Numéro WhatsApp du candidat';
COMMENT ON COLUMN inscriptions_formation.age IS 'Âge du candidat';
COMMENT ON COLUMN inscriptions_formation.statut_professionnel IS 'Statut professionnel actuel';
COMMENT ON COLUMN inscriptions_formation.niveau_etudes IS 'Niveau d''études du candidat';
COMMENT ON COLUMN inscriptions_formation.motivation IS 'Motivation pour suivre la formation';
COMMENT ON COLUMN inscriptions_formation.objectifs_formation IS 'Objectifs personnels liés à la formation';
COMMENT ON COLUMN inscriptions_formation.comment_connu IS 'Comment le candidat a connu la formation';
