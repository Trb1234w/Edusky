-- Drop the policy if it already exists
DROP POLICY IF EXISTS participants_select_participant ON public.conversation_participants;

-- Create the policy: Allow selection if the user is authenticated.
-- The actual filtering will happen at the 'conversations' table level.
CREATE POLICY participants_select_participant ON public.conversation_participants FOR SELECT
  USING (
    auth.uid() IS NOT NULL
  );