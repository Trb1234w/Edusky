-- SQL query to get a list of open clubs with related leader and category details
SELECT
  cl.id,
  cl.nom,
  cl.slug,
  cl.description,
  cl.image_url,
  cl.statut,
  pr.full_name AS leader_full_name,
  pr.avatar_url AS leader_avatar_url,
  c.id AS category_id,
  c.nom AS category_nom,
  c.slug AS category_slug
FROM
  public.clubs AS cl
LEFT JOIN
  public.profiles AS pr ON cl.leader_id = pr.id
LEFT JOIN
  public.categories AS c ON cl.categorie_id = c.id
WHERE
  cl.statut = 'ouvert'
ORDER BY
  cl.created_at DESC