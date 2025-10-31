-- Fonction RPC pour créer une conversation directe
create or replace function public.create_direct_conversation(user1_id uuid, user2_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  new_convo_id uuid;
begin
  -- Create the conversation
  insert into public.conversations default values
  returning id into new_convo_id;

  -- Add participants
  insert into public.conversation_participants (conversation_id, user_id)
  values
    (new_convo_id, user1_id),
    (new_convo_id, user2_id);

  return new_convo_id;
end;
$$;