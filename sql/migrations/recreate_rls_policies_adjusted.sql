-- This script recreates RLS policies after column types have been altered from UUID to TEXT.
-- Policies that previously checked against auth.uid() for the altered columns
-- have been adjusted to cast auth.uid() to TEXT for comparison, or simplified
-- based on the assumption that these columns are now 'completely free' of direct
-- profile association and thus direct user ownership checks are no longer valid
-- for non-admin users.

-- Policies for public.inscriptions_formation
CREATE POLICY insc_form_select_owner ON public.inscriptions_formation FOR SELECT
  USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
  );
CREATE POLICY insc_form_update_teacher ON public.inscriptions_formation FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Policies for public.inscriptions_evenement
CREATE POLICY insc_event_select_owner ON public.inscriptions_evenement FOR SELECT
  USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
  );

-- Policies for public.inscriptions_club
CREATE POLICY insc_club_select_owner ON public.inscriptions_club FOR SELECT
  USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
  );

-- Policies for public.articles_blog
CREATE POLICY articles_admin_cud ON public.articles_blog FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY articles_select_public ON public.articles_blog FOR SELECT
  USING (statut = 'publie');

-- Policies for public.postes
CREATE POLICY posts_insert_owner ON public.postes FOR INSERT
  WITH CHECK (auteur_id = auth.uid()::text);
CREATE POLICY posts_select_public ON public.postes FOR SELECT
  USING (statut = 'publie' OR (auteur_id = auth.uid()::text) OR public.is_admin(auth.uid()));
CREATE POLICY posts_update_owner ON public.postes FOR UPDATE
  USING (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()))
  WITH CHECK (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()));
CREATE POLICY posts_delete_owner ON public.postes FOR DELETE
  USING (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()));

-- Policies for public.commentaires
CREATE POLICY commentaires_insert ON public.commentaires FOR INSERT
  WITH CHECK (auteur_id = auth.uid()::text);
CREATE POLICY commentaires_update_owner ON public.commentaires FOR UPDATE
  USING (auteur_id = auth.uid()::text)
  WITH CHECK (auteur_id = auth.uid()::text);
CREATE POLICY commentaires_delete_owner ON public.commentaires FOR DELETE
  USING (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()));

-- Policies for public.messages
CREATE POLICY messages_insert_participant ON public.messages FOR INSERT
  WITH CHECK (auteur_id = auth.uid()::text);
CREATE POLICY messages_update_author ON public.messages FOR UPDATE
  USING (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()))
  WITH CHECK (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()));
CREATE POLICY messages_delete_author ON public.messages FOR DELETE
  USING (auteur_id = auth.uid()::text OR public.is_admin(auth.uid()));

-- Policies for public.journal_actions (user_id remains UUID, so no change needed here)
CREATE POLICY journal_admin_insert ON public.journal_actions FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY journal_admin_select ON public.journal_actions FOR SELECT
  USING (public.is_admin(auth.uid()));
