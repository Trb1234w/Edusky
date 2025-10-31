-- SQL query to get a single blog article by ID with all its details and related entities
SELECT
  a.*,
  pr.full_name AS auteur_full_name,
  pr.avatar_url AS auteur_avatar_url,
  c.nom AS category_nom,
  c.slug AS category_slug,
  c.description AS category_description
FROM
  public.articles_blog AS a
LEFT JOIN
  public.profiles AS pr ON a.auteur_id = pr.id
LEFT JOIN
  public.categories AS c ON a.categorie_id = c.id
WHERE
  a.id = '00000000-0000-0000-0000-000000000000'; -- REMPLACER CET UUID PAR UN ID D'ARTICLE RÉEL POUR L'EXÉCUTION DIRECTE