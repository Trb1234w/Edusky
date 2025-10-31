-- SQL query to get a list of published evenements with related organizer and category details
SELECT
  e.id,
  e.titre,
  e.slug,
  e.extrait,
  e.image_url,
  e.date_debut,
  e.date_fin,
  e.mode,
  e.lieu,
  pr.full_name AS organisateur_full_name,
  pr.avatar_url AS organisateur_avatar_url,
  c.id AS category_id,
  c.nom AS category_nom,
  c.slug AS category_slug
FROM
  public.evenements AS e
LEFT JOIN
  public.profiles AS pr ON e.organisateur_id = pr.id
LEFT JOIN
  public.categories AS c ON e.categorie_id = c.id
WHERE
  e.statut = 'publie'
ORDER BY
  e.date_debut ASC