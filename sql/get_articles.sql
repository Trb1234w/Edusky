-- SQL query to get a list of published blog articles with related author and category details
SELECT
  a.id,
  a.titre,
  a.slug,
  a.extrait,
  a.image_couverture,
  a.publie_at,
  a.vues,
  a.likes_count,
  a.comment_count,
  pr.full_name AS auteur_full_name,
  pr.avatar_url AS auteur_avatar_url,
  c.id AS category_id,
  c.nom AS category_nom,
  c.slug AS category_slug
FROM
  public.articles_blog AS a
LEFT JOIN
  public.profiles AS pr ON a.auteur_id = pr.id
LEFT JOIN
  public.categories AS c ON a.categorie_id = c.id
WHERE
  a.statut = 'publie'
ORDER BY
  a.publie_at DESC