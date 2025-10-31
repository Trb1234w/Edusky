-- SQL query to get a single club by ID with all its details and related entities
SELECT
  cl.*,
  pr.full_name AS leader_full_name,
  pr.avatar_url AS leader_avatar_url,
  c.nom AS category_nom,
  c.slug AS category_slug,
  c.description AS category_description
FROM
  public.clubs AS cl
LEFT JOIN
  public.profiles AS pr ON cl.leader_id = pr.id
LEFT JOIN
  public.categories AS c ON cl.categorie_id = c.id
WHERE
  cl.id = '00000000-0000-0000-0000-000000000000'; -- REMPLACER CET UUID PAR UN ID DE CLUB RÉEL POUR L'EXÉCUTION DIRECTE