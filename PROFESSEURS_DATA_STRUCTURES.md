# Structures de Données JSON pour Professeurs

Voici les modèles JSON à utiliser pour l'insertion de données dans les colonnes de la table `professeurs`.

## 1. Certifications (`certifications`)
**Type:** JSONB (Tableau d'objets)

```json
[
  {
    "nom": "AWS Certified Solutions Architect",
    "organisme": "Amazon Web Services",
    "date_obtention": "2023-06-15",
    "url_verification": "https://aws.amazon.com/verify/123",
    "description": "Validation des compétences en architecture cloud"
  },
  {
    "nom": "Google Professional Data Engineer",
    "organisme": "Google Cloud",
    "date_obtention": "2024-01-20"
  }
]
```

## 2. Portfolio (`portfolio`)
**Type:** JSONB (Tableau d'objets)

```json
[
  {
    "titre": "Application E-commerce React",
    "description": "Développement complet d'une marketplace",
    "image_url": "https://example.com/projet1.jpg",
    "lien_projet": "https://github.com/user/project",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "date": "2023-12-01"
  },
  {
    "titre": "Analyse de Données Financières",
    "description": "Modélisation prédictive pour une banque",
    "lien_projet": "https://kaggle.com/user/project",
    "technologies": ["Python", "Pandas", "Scikit-learn"],
    "date": "2023-10-15"
  }
]
```

## 3. Disponibilité (`disponibilite`)
**Type:** JSONB (Objet structuré)

```json
{
  "lundi": {
    "disponible": true,
    "plages": [
      {"debut": "09:00", "fin": "12:00"},
      {"debut": "14:00", "fin": "18:00"}
    ]
  },
  "mardi": {
    "disponible": true,
    "plages": [
      {"debut": "10:00", "fin": "16:00"}
    ]
  },
  "mercredi": {
    "disponible": false
  },
  "jeudi": {
    "disponible": true,
    "plages": [
      {"debut": "09:00", "fin": "12:00"}
    ]
  },
  "vendredi": {
    "disponible": true,
    "plages": [
      {"debut": "09:00", "fin": "17:00"}
    ]
  },
  "samedi": {
    "disponible": false
  },
  "dimanche": {
    "disponible": false
  },
  "note": "Disponible aussi en soirée sur demande"
}
```

## 4. Réseaux Sociaux (`reseaux_sociaux`)
**Type:** JSONB (Objet simple)

```json
{
  "linkedin": "https://linkedin.com/in/username",
  "twitter": "https://twitter.com/username",
  "github": "https://github.com/username",
  "website": "https://mon-site-web.com",
  "youtube": "https://youtube.com/@channel"
}
```

## 5. Diplômes (`profile_diplomes`)
**Type:** JSONB (Tableau d'objets)

```json
[
  {
    "diplome": "Master en Informatique",
    "etablissement": "Université de Paris",
    "annee": 2020,
    "mention": "Très Bien",
    "description": "Spécialisation en Intelligence Artificielle"
  },
  {
    "diplome": "Licence Mathématiques",
    "etablissement": "Université Gamal Abdel Nasser",
    "annee": 2018
  }
]
```

## 6. Formations et Parcours (`profile_formations_parcours`)
**Type:** JSONB (Tableau d'objets)

```json
[
  {
    "titre": "Développeur Senior",
    "organisation": "Tech Solutions Inc.",
    "type": "experience",
    "date_debut": "2021-01",
    "date_fin": "Présent",
    "description": "Lead développeur sur des projets fintech"
  },
  {
    "titre": "Formation Deep Learning",
    "organisation": "Coursera / DeepLearning.AI",
    "type": "formation",
    "date_debut": "2020-06",
    "date_fin": "2020-09",
    "description": "Certification spécialisée"
  }
]
```

## 7. Tableaux Simples (Arrays)

### Langues d'enseignement (`langues_enseignement`)
```json
["Français", "Anglais", "Soussou"]
```

### Méthodes Pédagogiques (`methodes_pedagogiques`)
```json
[
  "Approche par projet",
  "Mentorat interactif",
  "Exercices pratiques",
  "Classe inversée"
]
```

### Domaines d'Intervention (`domaines_intervention`)
```json
[
  "Développement Web",
  "Data Science",
  "Gestion de Projet Agile",
  "Design UI/UX"
]
```

### Modalités de Cours (`modalites_cours`)
```json
["En ligne (Zoom/Meet)", "Présentiel", "Hybride"]
```

### Spécialités (`specialites`)
```json
["React", "Node.js", "Python", "SQL", "DevOps"]
```
