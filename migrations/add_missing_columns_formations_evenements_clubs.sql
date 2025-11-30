-- =====================================================
-- Migration: Add Missing Columns to Formations, Evenements, and Clubs
-- Created: 2025-11-29
-- Description: Adds essential columns for pricing, scheduling, and program details
-- =====================================================

-- =====================================================
-- TABLE: FORMATIONS
-- =====================================================

-- Essential columns for formations
ALTER TABLE formations ADD COLUMN IF NOT EXISTS prix_inscription NUMERIC;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS programme JSONB;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS horaires JSONB;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS nombre_jours INTEGER;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS jours_formation JSONB;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS date_debut TIMESTAMP WITH TIME ZONE;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS date_fin TIMESTAMP WITH TIME ZONE;

-- Recommended additional columns for formations
ALTER TABLE formations ADD COLUMN IF NOT EXISTS prerequis TEXT[];
ALTER TABLE formations ADD COLUMN IF NOT EXISTS langue_enseignement TEXT DEFAULT 'français';
ALTER TABLE formations ADD COLUMN IF NOT EXISTS nombre_inscrits INTEGER DEFAULT 0;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS modalites_evaluation JSONB;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS taux_reussite NUMERIC;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS public_cible TEXT[];
ALTER TABLE formations ADD COLUMN IF NOT EXISTS accessibilite JSONB;

-- Add comments for documentation
COMMENT ON COLUMN formations.prix_inscription IS 'Prix d''inscription à la formation';
COMMENT ON COLUMN formations.programme IS 'Programme détaillé de la formation avec modules en JSON';
COMMENT ON COLUMN formations.horaires IS 'Horaires par jour de la semaine en JSON';
COMMENT ON COLUMN formations.nombre_jours IS 'Nombre total de jours de la formation';
COMMENT ON COLUMN formations.jours_formation IS 'Dates spécifiques et horaires de chaque jour en JSON';
COMMENT ON COLUMN formations.date_debut IS 'Date et heure de début de la formation';
COMMENT ON COLUMN formations.date_fin IS 'Date et heure de fin de la formation';
COMMENT ON COLUMN formations.prerequis IS 'Prérequis nécessaires pour s''inscrire';
COMMENT ON COLUMN formations.langue_enseignement IS 'Langue principale d''enseignement';
COMMENT ON COLUMN formations.nombre_inscrits IS 'Nombre actuel d''inscrits';
COMMENT ON COLUMN formations.modalites_evaluation IS 'Modalités d''évaluation en JSON';
COMMENT ON COLUMN formations.taux_reussite IS 'Taux de réussite de la formation (0-100)';
COMMENT ON COLUMN formations.public_cible IS 'Public cible de la formation';
COMMENT ON COLUMN formations.accessibilite IS 'Informations sur l''accessibilité en JSON';

-- =====================================================
-- TABLE: EVENEMENTS
-- =====================================================

-- Essential columns for evenements
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS prix NUMERIC DEFAULT 0;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS est_gratuit BOOLEAN DEFAULT true;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS heure_ouverture_portes TIME;

-- Recommended additional columns for evenements
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS nombre_participants INTEGER DEFAULT 0;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS lien_streaming TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS code_acces_streaming TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS programme JSONB;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS intervenants JSONB;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS sponsors JSONB;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS conditions_annulation TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS politique_remboursement TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS dress_code TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS age_minimum INTEGER;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS email_contact TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS telephone_contact TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS lien_billetterie TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS statut_evenement TEXT DEFAULT 'ouvert';

-- Add comments for documentation
COMMENT ON COLUMN evenements.prix IS 'Prix d''entrée de l''événement';
COMMENT ON COLUMN evenements.est_gratuit IS 'Indique si l''événement est gratuit';
COMMENT ON COLUMN evenements.heure_ouverture_portes IS 'Heure d''ouverture des portes';
COMMENT ON COLUMN evenements.nombre_participants IS 'Nombre actuel de participants inscrits';
COMMENT ON COLUMN evenements.lien_streaming IS 'Lien de streaming pour événements en ligne';
COMMENT ON COLUMN evenements.code_acces_streaming IS 'Code d''accès pour le streaming';
COMMENT ON COLUMN evenements.programme IS 'Programme détaillé de l''événement en JSON';
COMMENT ON COLUMN evenements.intervenants IS 'Liste des intervenants/speakers en JSON';
COMMENT ON COLUMN evenements.sponsors IS 'Liste des sponsors en JSON';
COMMENT ON COLUMN evenements.conditions_annulation IS 'Conditions d''annulation';
COMMENT ON COLUMN evenements.politique_remboursement IS 'Politique de remboursement';
COMMENT ON COLUMN evenements.dress_code IS 'Code vestimentaire';
COMMENT ON COLUMN evenements.age_minimum IS 'Âge minimum requis';
COMMENT ON COLUMN evenements.email_contact IS 'Email de contact de l''organisateur';
COMMENT ON COLUMN evenements.telephone_contact IS 'Téléphone de contact de l''organisateur';
COMMENT ON COLUMN evenements.lien_billetterie IS 'Lien vers la billetterie externe';
COMMENT ON COLUMN evenements.statut_evenement IS 'Statut: ouvert, complet, annule, reporte, termine';

-- Add constraint for statut_evenement
ALTER TABLE evenements ADD CONSTRAINT check_statut_evenement 
  CHECK (statut_evenement IN ('ouvert', 'complet', 'annule', 'reporte', 'termine'));

-- =====================================================
-- TABLE: CLUBS
-- =====================================================

-- Essential columns for clubs
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS prix_inscription NUMERIC DEFAULT 0;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS cotisation_mensuelle NUMERIC;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS cotisation_annuelle NUMERIC;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS type_cotisation TEXT;

-- Recommended additional columns for clubs
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS nombre_membres INTEGER DEFAULT 0;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS reglement_interieur TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS objectifs TEXT[];
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS activites JSONB;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS conditions_adhesion TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS niveau_requis TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS age_minimum INTEGER;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS age_maximum INTEGER;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS equipement_requis TEXT[];
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS reseaux_sociaux JSONB;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS email_contact TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS site_web TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS horaires_ouverture JSONB;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS partenaires JSONB;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS realisations JSONB;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS visibilite TEXT DEFAULT 'public';

-- Add comments for documentation
COMMENT ON COLUMN clubs.prix_inscription IS 'Prix d''inscription au club';
COMMENT ON COLUMN clubs.cotisation_mensuelle IS 'Cotisation mensuelle';
COMMENT ON COLUMN clubs.cotisation_annuelle IS 'Cotisation annuelle';
COMMENT ON COLUMN clubs.type_cotisation IS 'Type: mensuelle, annuelle, gratuit';
COMMENT ON COLUMN clubs.nombre_membres IS 'Nombre actuel de membres';
COMMENT ON COLUMN clubs.reglement_interieur IS 'Règlement intérieur du club';
COMMENT ON COLUMN clubs.objectifs IS 'Objectifs du club';
COMMENT ON COLUMN clubs.activites IS 'Activités proposées en JSON';
COMMENT ON COLUMN clubs.conditions_adhesion IS 'Conditions pour adhérer';
COMMENT ON COLUMN clubs.niveau_requis IS 'Niveau requis: débutant, intermédiaire, avancé';
COMMENT ON COLUMN clubs.age_minimum IS 'Âge minimum pour adhérer';
COMMENT ON COLUMN clubs.age_maximum IS 'Âge maximum pour adhérer';
COMMENT ON COLUMN clubs.equipement_requis IS 'Équipement requis pour participer';
COMMENT ON COLUMN clubs.reseaux_sociaux IS 'Liens vers les réseaux sociaux en JSON';
COMMENT ON COLUMN clubs.email_contact IS 'Email de contact du club';
COMMENT ON COLUMN clubs.site_web IS 'Site web du club';
COMMENT ON COLUMN clubs.horaires_ouverture IS 'Horaires d''ouverture en JSON';
COMMENT ON COLUMN clubs.partenaires IS 'Partenaires du club en JSON';
COMMENT ON COLUMN clubs.realisations IS 'Réalisations/projets du club en JSON';
COMMENT ON COLUMN clubs.visibilite IS 'Visibilité: public, prive, sur_invitation';

-- Add constraints
ALTER TABLE clubs ADD CONSTRAINT check_type_cotisation 
  CHECK (type_cotisation IN ('mensuelle', 'annuelle', 'gratuit', NULL));

ALTER TABLE clubs ADD CONSTRAINT check_visibilite_club 
  CHECK (visibilite IN ('public', 'prive', 'sur_invitation'));

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Formations indexes
CREATE INDEX IF NOT EXISTS idx_formations_date_debut ON formations(date_debut);
CREATE INDEX IF NOT EXISTS idx_formations_date_fin ON formations(date_fin);
CREATE INDEX IF NOT EXISTS idx_formations_prix_inscription ON formations(prix_inscription);
CREATE INDEX IF NOT EXISTS idx_formations_nombre_inscrits ON formations(nombre_inscrits);

-- Evenements indexes
CREATE INDEX IF NOT EXISTS idx_evenements_prix ON evenements(prix);
CREATE INDEX IF NOT EXISTS idx_evenements_est_gratuit ON evenements(est_gratuit);
CREATE INDEX IF NOT EXISTS idx_evenements_statut_evenement ON evenements(statut_evenement);
CREATE INDEX IF NOT EXISTS idx_evenements_nombre_participants ON evenements(nombre_participants);

-- Clubs indexes
CREATE INDEX IF NOT EXISTS idx_clubs_prix_inscription ON clubs(prix_inscription);
CREATE INDEX IF NOT EXISTS idx_clubs_nombre_membres ON clubs(nombre_membres);
CREATE INDEX IF NOT EXISTS idx_clubs_visibilite ON clubs(visibilite);

-- =====================================================
-- VALIDATION CONSTRAINTS
-- =====================================================

-- Ensure prices are non-negative
ALTER TABLE formations ADD CONSTRAINT check_prix_inscription_formations 
  CHECK (prix_inscription IS NULL OR prix_inscription >= 0);

ALTER TABLE evenements ADD CONSTRAINT check_prix_evenements 
  CHECK (prix IS NULL OR prix >= 0);

ALTER TABLE clubs ADD CONSTRAINT check_prix_inscription_clubs 
  CHECK (prix_inscription IS NULL OR prix_inscription >= 0);

ALTER TABLE clubs ADD CONSTRAINT check_cotisation_mensuelle 
  CHECK (cotisation_mensuelle IS NULL OR cotisation_mensuelle >= 0);

ALTER TABLE clubs ADD CONSTRAINT check_cotisation_annuelle 
  CHECK (cotisation_annuelle IS NULL OR cotisation_annuelle >= 0);

-- Ensure counts are non-negative
ALTER TABLE formations ADD CONSTRAINT check_nombre_inscrits 
  CHECK (nombre_inscrits >= 0);

ALTER TABLE evenements ADD CONSTRAINT check_nombre_participants 
  CHECK (nombre_participants >= 0);

ALTER TABLE clubs ADD CONSTRAINT check_nombre_membres 
  CHECK (nombre_membres >= 0);

-- Ensure dates are logical
ALTER TABLE formations ADD CONSTRAINT check_dates_formations 
  CHECK (date_fin IS NULL OR date_debut IS NULL OR date_fin >= date_debut);

-- =====================================================
-- END OF MIGRATION
-- =====================================================
