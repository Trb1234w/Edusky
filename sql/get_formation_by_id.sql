-- SQL query to get a single formation by ID with all its details and related entities
SELECT
  f.*,
  p.id AS professeur_id,
  p.titre AS professeur_titre,
  p.presentation AS professeur_presentation,
  p.specialites AS professeur_specialites,
  p.annees_experience AS professeur_annees_experience,
  p.tarif_indicatif AS professeur_tarif_indicatif,
  p.tarif_horaire_min AS professeur_tarif_horaire_min,
  p.tarif_horaire_max AS professeur_tarif_horaire_max,
  p.note_moyenne AS professeur_note_moyenne,
  p.nb_etudiants_formes AS professeur_nb_etudiants_formes,
  pr.full_name AS professeur_full_name,
  pr.avatar_url AS professeur_avatar_url,
  c.nom AS category_nom,
  c.slug AS category_slug,
  c.description AS category_description,
  pa.nom AS pays_nom,
  v.nom AS ville_nom,
  q.nom AS quartier_nom
FROM
  public.formations AS f
LEFT JOIN
  public.professeurs AS p ON f.professeur_id = p.id
LEFT JOIN
  public.profiles AS pr ON p.id = pr.id
LEFT JOIN
  public.categories AS c ON f.categorie_id = c.id
LEFT JOIN
  public.pays AS pa ON f.pays_id = pa.id
LEFT JOIN
  public.villes AS v ON f.ville_id = v.id
LEFT JOIN
  public.quartiers AS q ON f.quartier_id = q.id
WHERE
  f.id = '00000000-0000-0000-0000-000000000000'; -- REMPLACER CET UUID PAR UN ID DE FORMATION RÉEL POUR L'EXÉCUTION DIRECTE