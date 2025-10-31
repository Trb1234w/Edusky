-- This script drops RLS policies that depend on columns whose types are being altered.
-- These policies will need to be re-created or adjusted after the column type changes.

-- Policies depending on public.formations.professeur_id
DROP POLICY IF EXISTS insc_form_select_owner ON public.inscriptions_formation;
DROP POLICY IF EXISTS insc_form_update_teacher ON public.inscriptions_formation;

-- Policies depending on public.evenements.organisateur_id
DROP POLICY IF EXISTS insc_event_select_owner ON public.inscriptions_evenement;

-- Policies depending on public.clubs.leader_id
DROP POLICY IF EXISTS insc_club_select_owner ON public.inscriptions_club;

-- Policies depending on public.articles_blog.auteur_id
DROP POLICY IF EXISTS articles_admin_cud ON public.articles_blog;
DROP POLICY IF EXISTS articles_select_public ON public.articles_blog;

-- Policies depending on public.postes.auteur_id
DROP POLICY IF EXISTS posts_insert_owner ON public.postes;
DROP POLICY IF EXISTS posts_select_public ON public.postes;
DROP POLICY IF EXISTS posts_update_owner ON public.postes;
DROP POLICY IF EXISTS posts_delete_owner ON public.postes;

-- Policies depending on public.commentaires.auteur_id
DROP POLICY IF EXISTS commentaires_insert ON public.commentaires;
DROP POLICY IF EXISTS commentaires_update_owner ON public.commentaires;
DROP POLICY IF EXISTS commentaires_delete_owner ON public.commentaires;

-- Policies depending on public.messages.auteur_id
DROP POLICY IF EXISTS messages_insert_participant ON public.messages;
DROP POLICY IF EXISTS messages_update_author ON public.messages;
DROP POLICY IF EXISTS messages_delete_author ON public.messages;

-- Policies depending on public.journal_actions.user_id
DROP POLICY IF EXISTS journal_admin_insert ON public.journal_actions;
DROP POLICY IF EXISTS journal_admin_select ON public.journal_actions;
