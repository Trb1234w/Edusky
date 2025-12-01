# Structure des onglets pour la page Professeurs

## Configuration des onglets

```typescript
const professeursTabsConfig = [
  {
    value: "about",
    label: "À propos",
    icon: "Info",
    fields: ["presentation", "profile_bio"]
  },
  {
    value: "specialites",
    label: "Spécialités",
    icon: "Star",
    fields: ["specialites", "domaines_intervention"]
  },
  {
    value: "portfolio",
    label: "Portfolio",
    icon: "Briefcase",
    fields: ["portfolio"]
  },
  {
    value: "certifications",
    label: "Certifications",
    icon: "Award",
    fields: ["certifications", "profile_diplomes"]
  },
  {
    value: "langues",
    label: "Langues",
    icon: "Globe",
    fields: ["langues_enseignement", "profile_langues"]
  },
  {
    value: "methodes",
    label: "Méthodes",
    icon: "BookOpen",
    fields: ["methodes_pedagogiques"]
  },
  {
    value: "reseaux",
    label: "Réseaux",
    icon: "Share2",
    fields: ["reseaux_sociaux", "profile_linkedin_url", "site_web"]
  },
  {
    value: "general",
    label: "Général",
    icon: "FileText",
    fields: [
      "titre",
      "annees_experience",
      "tarif_indicatif",
      "tarif_horaire_min",
      "tarif_horaire_max",
      "nb_etudiants_formes",
      "note_moyenne",
      "nb_notes",
      "disponibilite",
      "modalites_cours",
      "type",
      "pays_nom",
      "ville_nom",
      "quartier_nom",
      "email_contact",
      "telephone_professionnel",
      "profile_email",
      "profile_phone",
      "profile_competences",
      "profile_formations_parcours",
      "created_at",
      "updated_at"
    ]
  }
];
```

## Mapping des colonnes par onglet

### Onglet "À propos"
- `presentation` (TEXT) - Présentation du professeur
- `profile_bio` (TEXT) - Biographie du profil

### Onglet "Spécialités"
- `specialites` (TEXT[]) - Spécialités du professeur
- `domaines_intervention` (TEXT[]) - Domaines d'intervention

### Onglet "Portfolio"
- `portfolio` (JSONB) - Portfolio du professeur (projets, réalisations)

### Onglet "Certifications"
- `certifications` (JSONB) - Certifications professionnelles
- `profile_diplomes` (JSONB) - Diplômes du profil

### Onglet "Langues"
- `langues_enseignement` (TEXT[]) - Langues d'enseignement
- `profile_langues` (TEXT[]) - Langues parlées (du profil)

### Onglet "Méthodes Pédagogiques"
- `methodes_pedagogiques` (TEXT[]) - Méthodes pédagogiques utilisées

### Onglet "Réseaux Sociaux"
- `reseaux_sociaux` (JSONB) - Réseaux sociaux professionnels
- `profile_linkedin_url` (TEXT) - LinkedIn du profil
- `site_web` (TEXT) - Site web personnel

### Onglet "Général" (Informations complémentaires)
**Informations professionnelles :**
- `titre` (VARCHAR) - Titre professionnel
- `annees_experience` (INTEGER) - Années d'expérience
- `tarif_indicatif` (NUMERIC) - Tarif indicatif
- `tarif_horaire_min` (NUMERIC) - Tarif horaire minimum
- `tarif_horaire_max` (NUMERIC) - Tarif horaire maximum
- `nb_etudiants_formes` (INTEGER) - Nombre d'étudiants formés
- `note_moyenne` (NUMERIC) - Note moyenne
- `nb_notes` (INTEGER) - Nombre de notes
- `type` (TEXT) - Type de professeur

**Modalités :**
- `disponibilite` (JSONB) - Disponibilités
- `modalites_cours` (TEXT[]) - Modalités de cours (en ligne, présentiel, hybride)

**Localisation :**
- `pays_nom` (TEXT) - Nom du pays
- `ville_nom` (TEXT) - Nom de la ville
- `quartier_nom` (TEXT) - Nom du quartier

**Contact :**
- `email_contact` (TEXT) - Email professionnel
- `telephone_professionnel` (TEXT) - Téléphone professionnel
- `profile_email` (TEXT) - Email du profil
- `profile_phone` (TEXT) - Téléphone du profil

**Parcours :**
- `profile_competences` (TEXT[]) - Compétences
- `profile_formations_parcours` (JSONB) - Formations et parcours

**Métadonnées :**
- `created_at` (TIMESTAMPTZ) - Date de création
- `updated_at` (TIMESTAMPTZ) - Date de mise à jour

## Colonnes NON affichées (privées/système)
- `id` - Identifiant unique
- `is_publie` - Statut de publication
- `pays_id`, `ville_id`, `quartier_id` - IDs de localisation (on affiche les noms à la place)

## Format JSON complet

```json
{
  "tabs": [
    {
      "value": "about",
      "label": "À propos",
      "icon": "Info",
      "mobileIcon": "Info",
      "content": {
        "sections": [
          {
            "title": "Présentation",
            "field": "presentation",
            "type": "text"
          },
          {
            "title": "Biographie",
            "field": "profile_bio",
            "type": "text"
          }
        ]
      }
    },
    {
      "value": "specialites",
      "label": "Spécialités",
      "icon": "Star",
      "mobileIcon": "Star",
      "content": {
        "sections": [
          {
            "title": "Spécialités",
            "field": "specialites",
            "type": "array",
            "display": "badges"
          },
          {
            "title": "Domaines d'intervention",
            "field": "domaines_intervention",
            "type": "array",
            "display": "badges"
          }
        ]
      }
    },
    {
      "value": "portfolio",
      "label": "Portfolio",
      "icon": "Briefcase",
      "mobileIcon": "Briefcase",
      "content": {
        "sections": [
          {
            "title": "Portfolio",
            "field": "portfolio",
            "type": "jsonb",
            "display": "cards"
          }
        ]
      }
    },
    {
      "value": "certifications",
      "label": "Certifications",
      "icon": "Award",
      "mobileIcon": "Award",
      "content": {
        "sections": [
          {
            "title": "Certifications professionnelles",
            "field": "certifications",
            "type": "jsonb",
            "display": "list"
          },
          {
            "title": "Diplômes",
            "field": "profile_diplomes",
            "type": "jsonb",
            "display": "list"
          }
        ]
      }
    },
    {
      "value": "langues",
      "label": "Langues",
      "icon": "Globe",
      "mobileIcon": "Globe",
      "content": {
        "sections": [
          {
            "title": "Langues d'enseignement",
            "field": "langues_enseignement",
            "type": "array",
            "display": "badges"
          },
          {
            "title": "Langues parlées",
            "field": "profile_langues",
            "type": "array",
            "display": "badges"
          }
        ]
      }
    },
    {
      "value": "methodes",
      "label": "Méthodes",
      "icon": "BookOpen",
      "mobileIcon": "BookOpen",
      "content": {
        "sections": [
          {
            "title": "Méthodes pédagogiques",
            "field": "methodes_pedagogiques",
            "type": "array",
            "display": "list-with-icons"
          }
        ]
      }
    },
    {
      "value": "reseaux",
      "label": "Réseaux",
      "icon": "Share2",
      "mobileIcon": "Share2",
      "content": {
        "sections": [
          {
            "title": "Réseaux sociaux",
            "field": "reseaux_sociaux",
            "type": "jsonb",
            "display": "social-links"
          },
          {
            "title": "Liens professionnels",
            "fields": ["profile_linkedin_url", "site_web"],
            "type": "links",
            "display": "link-cards"
          }
        ]
      }
    },
    {
      "value": "general",
      "label": "Général",
      "icon": "FileText",
      "mobileIcon": "FileText",
      "content": {
        "sections": [
          {
            "title": "Informations professionnelles",
            "fields": [
              "titre",
              "type",
              "annees_experience",
              "nb_etudiants_formes",
              "note_moyenne"
            ],
            "type": "info-grid"
          },
          {
            "title": "Tarifs",
            "fields": [
              "tarif_indicatif",
              "tarif_horaire_min",
              "tarif_horaire_max"
            ],
            "type": "pricing"
          },
          {
            "title": "Modalités",
            "fields": ["modalites_cours", "disponibilite"],
            "type": "modalities"
          },
          {
            "title": "Localisation",
            "fields": ["pays_nom", "ville_nom", "quartier_nom"],
            "type": "location"
          },
          {
            "title": "Contact",
            "fields": [
              "email_contact",
              "telephone_professionnel",
              "profile_email",
              "profile_phone"
            ],
            "type": "contact"
          },
          {
            "title": "Parcours",
            "fields": ["profile_competences", "profile_formations_parcours"],
            "type": "background"
          }
        ]
      }
    }
  ]
}
```

## Notes d'implémentation

1. **Responsive** : Sur mobile, afficher uniquement les icônes dans la TabsList, le texte apparaît au survol/sélection
2. **Design** : Utiliser le même style que la page clubs (cards avec shadow, rounded-2xl, etc.)
3. **Badges** : Utiliser des badges colorés pour les arrays (specialites, langues, etc.)
4. **JSONB** : Parser et afficher de manière structurée (cards pour portfolio, liste pour certifications)
5. **Vide** : Afficher un message élégant quand une section est vide
6. **Icons** : Utiliser lucide-react pour tous les icônes
