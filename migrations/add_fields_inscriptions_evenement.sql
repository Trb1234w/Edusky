-- Migration: Enrichir la table inscriptions_evenement
-- Date: 2025-12-07
-- Description: Ajout de champs pour collecter plus d'informations lors des inscriptions aux événements

ALTER TABLE inscriptions_evenement
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 120),
ADD COLUMN IF NOT EXISTS motivation_participation TEXT,
ADD COLUMN IF NOT EXISTS attentes_evenement TEXT,
ADD COLUMN IF NOT EXISTS comment_connu TEXT,
ADD COLUMN IF NOT EXISTS besoins_specifiques TEXT,
ADD COLUMN IF NOT EXISTS accompagnants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS statut_participation TEXT DEFAULT 'confirme' CHECK (statut_participation IN ('confirme', 'liste_attente', 'annule'));

-- Commentaires sur les colonnes
COMMENT ON COLUMN inscriptions_evenement.whatsapp IS 'Numéro WhatsApp du participant';
COMMENT ON COLUMN inscriptions_evenement.age IS 'Âge du participant';
COMMENT ON COLUMN inscriptions_evenement.motivation_participation IS 'Motivation pour participer';
COMMENT ON COLUMN inscriptions_evenement.attentes_evenement IS 'Attentes vis-à-vis de l''événement';
COMMENT ON COLUMN inscriptions_evenement.comment_connu IS 'Comment le participant a connu l''événement';
COMMENT ON COLUMN inscriptions_evenement.besoins_specifiques IS 'Besoins spécifiques (accessibilité, allergies, etc.)';
COMMENT ON COLUMN inscriptions_evenement.accompagnants IS 'Nombre d''accompagnants';
COMMENT ON COLUMN inscriptions_evenement.statut_participation IS 'Statut de la participation';
