# Structures JSON pour l'insertion de données - Table Professeurs

## 1. `specialites` (TEXT[])
**Type** : Array de texte
**Structure d'insertion** :
```json
["Mathématiques", "Physique", "Programmation Python", "Data Science"]
```

---

## 2. `langues_enseignement` (TEXT[])
**Type** : Array de texte
**Structure d'insertion** :
```json
["Français", "Anglais", "Espagnol"]
```

---

## 3. `methodes_pedagogiques` (TEXT[])
**Type** : Array de texte
**Structure d'insertion** :
```json
[
  "Apprentissage par projet",
  "Classe inversée",
  "Pédagogie active",
  "Mentorat individuel",
  "Apprentissage collaboratif"
]
```

---

## 4. `domaines_intervention` (TEXT[])
**Type** : Array de texte
**Structure d'insertion** :
```json
[
  "Formation professionnelle",
  "Coaching individuel",
  "Formation en entreprise",
  "Cours particuliers",
  "Ateliers collectifs"
]
```

---

## 5. `modalites_cours` (TEXT[])
**Type** : Array de texte
**Structure d'insertion** :
```json
["En ligne", "Présentiel", "Hybride"]
```

---

## 6. `certifications` (JSONB)
**Type** : JSONB - Array d'objets
**Structure d'insertion** :
```json
[
  {
    "nom": "Certification AWS Solutions Architect",
    "organisme": "Amazon Web Services",
    "date_obtention": "2023-06-15",
    "numero": "AWS-SA-2023-12345",
    "valide_jusqua": "2026-06-15",
    "url_verification": "https://aws.amazon.com/verification/12345"
  },
  {
    "nom": "Certified Scrum Master",
    "organisme": "Scrum Alliance",
    "date_obtention": "2022-03-20",
    "numero": "CSM-2022-67890"
  },
  {
    "nom": "Google Cloud Professional",
    "organisme": "Google Cloud",
    "date_obtention": "2024-01-10",
    "niveau": "Professional",
    "specialite": "Data Engineering"
  }
]
```

---

## 7. `disponibilite` (JSONB)
**Type** : JSONB - Objet avec horaires par jour
**Structure d'insertion** :
```json
{
  "lundi": {
    "disponible": true,
    "plages": [
      {
        "debut": "09:00",
        "fin": "12:00"
      },
      {
        "debut": "14:00",
        "fin": "18:00"
      }
    ]
  },
  "mardi": {
    "disponible": true,
    "plages": [
      {
        "debut": "10:00",
        "fin": "17:00"
      }
    ]
  },
  "mercredi": {
    "disponible": false
  },
  "jeudi": {
    "disponible": true,
    "plages": [
      {
        "debut": "09:00",
        "fin": "16:00"
      }
    ]
  },
  "vendredi": {
    "disponible": true,
    "plages": [
      {
        "debut": "09:00",
        "fin": "13:00"
      }
    ]
  },
  "samedi": {
    "disponible": true,
    "plages": [
      {
        "debut": "10:00",
        "fin": "14:00"
      }
    ],
    "note": "Sur rendez-vous uniquement"
  },
  "dimanche": {
    "disponible": false
  },
  "timezone": "Africa/Conakry",
  "note_generale": "Disponibilités flexibles, contactez-moi pour convenir d'un horaire"
}
```

---

## 8. `portfolio` (JSONB)
**Type** : JSONB - Array d'objets (projets/réalisations)
**Structure d'insertion** :
```json
[
  {
    "titre": "Formation complète en Data Science",
    "type": "Formation",
    "description": "Programme de formation de 6 mois pour 50 étudiants en Data Science et Machine Learning",
    "date_debut": "2023-01-15",
    "date_fin": "2023-06-30",
    "client": "Université de Conakry",
    "technologies": ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
    "resultats": "95% de taux de réussite, 40 étudiants certifiés",
    "image_url": "https://example.com/portfolio/data-science.jpg",
    "url_projet": "https://example.com/projets/data-science-2023"
  },
  {
    "titre": "Développement application mobile e-commerce",
    "type": "Projet",
    "description": "Mentorat et accompagnement d'une équipe de 5 développeurs pour créer une application mobile",
    "date_debut": "2023-09-01",
    "date_fin": "2024-02-28",
    "client": "StartupTech Guinée",
    "technologies": ["React Native", "Node.js", "MongoDB"],
    "budget": "50000 USD",
    "equipe": 5,
    "image_url": "https://example.com/portfolio/mobile-app.jpg"
  },
  {
    "titre": "Atelier Python pour débutants",
    "type": "Atelier",
    "description": "Série d'ateliers hebdomadaires pour initier 30 participants à la programmation Python",
    "date_debut": "2024-03-01",
    "duree_heures": 40,
    "participants": 30,
    "niveau": "Débutant",
    "taux_satisfaction": 4.8
  }
]
```

---

## 9. `reseaux_sociaux` (JSONB)
**Type** : JSONB - Objet avec clés pour chaque réseau
**Structure d'insertion** :
```json
{
  "linkedin": "https://linkedin.com/in/professeur-exemple",
  "twitter": "https://twitter.com/prof_exemple",
  "facebook": "https://facebook.com/professeur.exemple",
  "instagram": "https://instagram.com/prof_exemple",
  "youtube": "https://youtube.com/@ProfExemple",
  "github": "https://github.com/profexemple",
  "website": "https://professeur-exemple.com",
  "medium": "https://medium.com/@profexemple",
  "tiktok": "https://tiktok.com/@profexemple"
}
```

---

## 10. `profile_langues` (TEXT[]) - Du profil
**Type** : Array de texte
**Structure d'insertion** :
```json
["Français", "Anglais", "Arabe", "Soussou"]
```

---

## 11. `profile_competences` (TEXT[]) - Du profil
**Type** : Array de texte
**Structure d'insertion** :
```json
[
  "Leadership",
  "Communication",
  "Gestion de projet",
  "Analyse de données",
  "Développement web",
  "Intelligence artificielle",
  "Cloud Computing"
]
```

---

## 12. `profile_diplomes` (JSONB) - Du profil
**Type** : JSONB - Array d'objets
**Structure d'insertion** :
```json
[
  {
    "diplome": "Doctorat en Informatique",
    "specialite": "Intelligence Artificielle",
    "etablissement": "Université Paris-Saclay",
    "pays": "France",
    "annee_obtention": 2018,
    "mention": "Très Honorable avec Félicitations du Jury",
    "these": "Deep Learning pour la reconnaissance d'images médicales"
  },
  {
    "diplome": "Master en Data Science",
    "specialite": "Machine Learning",
    "etablissement": "École Polytechnique",
    "pays": "France",
    "annee_obtention": 2015,
    "mention": "Très Bien"
  },
  {
    "diplome": "Licence en Mathématiques",
    "specialite": "Mathématiques Appliquées",
    "etablissement": "Université de Conakry",
    "pays": "Guinée",
    "annee_obtention": 2012,
    "mention": "Bien"
  }
]
```

---

## 13. `profile_formations_parcours` (JSONB) - Du profil
**Type** : JSONB - Array d'objets (expériences professionnelles et formations)
**Structure d'insertion** :
```json
[
  {
    "type": "experience",
    "poste": "Professeur Senior en Data Science",
    "entreprise": "Institut Supérieur de Technologie",
    "lieu": "Conakry, Guinée",
    "date_debut": "2020-09-01",
    "date_fin": null,
    "en_cours": true,
    "description": "Enseignement de cours avancés en Data Science, Machine Learning et Deep Learning. Supervision de projets étudiants et recherche.",
    "responsabilites": [
      "Conception et animation de cours",
      "Encadrement de mémoires",
      "Recherche en IA",
      "Collaboration avec l'industrie"
    ]
  },
  {
    "type": "experience",
    "poste": "Consultant Data Science",
    "entreprise": "TechConsult Africa",
    "lieu": "Dakar, Sénégal",
    "date_debut": "2018-01-15",
    "date_fin": "2020-08-31",
    "en_cours": false,
    "description": "Conseil en stratégie data et implémentation de solutions ML pour diverses entreprises africaines",
    "realisations": [
      "Déploiement de 15+ modèles ML en production",
      "Formation de 100+ professionnels",
      "Augmentation de 30% de l'efficacité clients"
    ]
  },
  {
    "type": "formation",
    "titre": "Formation Continue en Cloud Computing",
    "organisme": "AWS Training",
    "date_debut": "2023-01-10",
    "date_fin": "2023-03-15",
    "duree_heures": 120,
    "certifications_obtenues": ["AWS Solutions Architect", "AWS Machine Learning"]
  },
  {
    "type": "formation",
    "titre": "Bootcamp DevOps",
    "organisme": "Linux Foundation",
    "date_debut": "2022-06-01",
    "date_fin": "2022-08-30",
    "duree_heures": 200,
    "competences": ["Docker", "Kubernetes", "CI/CD", "Terraform"]
  }
]
```

---

## Exemples d'insertion SQL

### Insertion d'un nouveau professeur avec toutes les colonnes JSONB/Array :

```sql
INSERT INTO professeurs (
  id,
  titre,
  presentation,
  specialites,
  langues_enseignement,
  methodes_pedagogiques,
  domaines_intervention,
  modalites_cours,
  certifications,
  disponibilite,
  portfolio,
  reseaux_sociaux,
  annees_experience,
  tarif_indicatif,
  nb_etudiants_formes,
  is_publie
) VALUES (
  'uuid-du-profil',
  'Professeur Senior en Data Science & IA',
  'Expert en Data Science avec 10 ans d''expérience dans l''enseignement et le conseil...',
  ARRAY['Data Science', 'Machine Learning', 'Python', 'Deep Learning'],
  ARRAY['Français', 'Anglais', 'Espagnol'],
  ARRAY['Apprentissage par projet', 'Classe inversée', 'Pédagogie active'],
  ARRAY['Formation professionnelle', 'Coaching individuel', 'Formation en entreprise'],
  ARRAY['En ligne', 'Présentiel', 'Hybride'],
  '[{"nom":"AWS Solutions Architect","organisme":"Amazon Web Services","date_obtention":"2023-06-15"}]'::jsonb,
  '{"lundi":{"disponible":true,"plages":[{"debut":"09:00","fin":"17:00"}]}}'::jsonb,
  '[{"titre":"Formation Data Science","type":"Formation","description":"Programme complet"}]'::jsonb,
  '{"linkedin":"https://linkedin.com/in/exemple","github":"https://github.com/exemple"}'::jsonb,
  10,
  50000,
  150,
  true
);
```

### Mise à jour d'une colonne JSONB spécifique :

```sql
-- Ajouter une certification
UPDATE professeurs
SET certifications = certifications || '[{"nom":"Google Cloud Professional","organisme":"Google","date_obtention":"2024-01-10"}]'::jsonb
WHERE id = 'uuid-du-professeur';

-- Mettre à jour les réseaux sociaux
UPDATE professeurs
SET reseaux_sociaux = jsonb_set(
  COALESCE(reseaux_sociaux, '{}'::jsonb),
  '{twitter}',
  '"https://twitter.com/nouveau_compte"'
)
WHERE id = 'uuid-du-professeur';

-- Ajouter une langue d'enseignement
UPDATE professeurs
SET langues_enseignement = array_append(langues_enseignement, 'Mandarin')
WHERE id = 'uuid-du-professeur';
```

---

## Notes importantes

1. **Arrays vides** : Utiliser `[]` ou `ARRAY[]::TEXT[]`
2. **JSONB vides** : Utiliser `{}` ou `'{}'::jsonb`
3. **NULL vs vide** : Préférer les structures vides plutôt que NULL pour faciliter les requêtes
4. **Validation** : Toujours valider le JSON avant insertion
5. **Indexation** : Les index GIN sont créés pour optimiser les recherches dans les arrays et JSONB
