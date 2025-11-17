-- Fichier de migration SQL pour créer la fonction is_professeur

-- Helper fonction is_professeur
create or replace function public.is_professeur(uid uuid) returns boolean as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'professeur'
  );
$$ language sql stable;
