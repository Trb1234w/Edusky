-- SQL query to get a single evenement by ID with all its details and related entities
SELECT
  e.*,
  pr.full_name AS organisateur_full_name,
  pr.avatar_url AS organisateur_avatar_url,
  c.nom AS category_nom,
  c.slug AS category_slug,
  c.description AS category_description,
  pa.nom AS pays_nom,
  v.nom AS ville_nom,
  q.nom AS quartier_nom
FROM
  public.evenements AS e
LEFT JOIN
  public.profiles AS pr ON e.organisateur_id = pr.id
LEFT JOIN
  public.categories AS c ON e.categorie_id = c.id
LEFT JOIN
  public.pays AS pa ON e.pays_id = pa.id
LEFT JOIN
  public.villes AS v ON e.ville_id = v.id
LEFT JOIN
  public.quartiers AS q ON e.quartier_id = q.id
WHERE
  e.id = '00000000-0000-0000-0000-000000000000'; -- REMPLACER CET UUID PAR UN ID D'ÉVÉNEMENT RÉEL POUR L'EXÉCUTION DIRECTE