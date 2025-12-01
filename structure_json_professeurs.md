# Structure JSON attendue pour les colonnes Professeurs

Voici la structure des données attendue pour les colonnes `jsonb` de la table `professeurs`.

## `diplomes`
Un tableau d'objets représentant les diplômes.

```json
[
  {
    "titre": "Master en Informatique",
    "ecole": "Université de Paris",
    "annee": "2020",
    "description": "Spécialisation en IA"
  }
]
```

## `formations_parcours` (Expérience Professionnelle)
Un tableau d'objets représentant le parcours professionnel.

```json
[
  {
    "titre": "Développeur Senior",
    "institution": "Google",
    "date_debut": "2021",
    "date_fin": "Présent",
    "description": "Développement backend"
  }
]
```

## `certifications`
Un tableau d'objets ou de chaînes de caractères.

```json
[
  {
    "nom": "AWS Certified Solutions Architect",
    "organisme": "Amazon",
    "annee": "2022"
  }
]
```
ou simplement :
```json
["AWS Certified", "TOEIC"]
```

## `disponibilite`
Un objet avec les jours comme clés et les plages horaires comme valeurs.

```json
{
  "lundi": ["09:00-12:00", "14:00-18:00"],
  "mercredi": ["10:00-16:00"]
}
```

## `portfolio`
Un tableau d'objets représentant les projets.

```json
[
  {
    "titre": "Site E-commerce",
    "url": "https://monsite.com",
    "description": "Création d'une boutique en ligne complète"
  }
]
```

## `reseaux_sociaux`
Un objet clé-valeur.

```json
{
  "facebook": "url...",
  "twitter": "url..."
}
```
