# Guide de déploiement des filtres - Événements, Clubs et Blogs

## 🎯 Vue d'ensemble

Ce guide vous permet de déployer les filtres exhaustifs pour les pages événements, clubs et blogs.

---

## 📋 Migrations SQL à exécuter

Vous devez exécuter **3 migrations SQL** dans Supabase, dans n'importe quel ordre :

### 1️⃣ Événements
**Fichier** : `sql/migrations/update_get_evenements_with_filters.sql`

**Filtres ajoutés** :
- Localisation (pays, ville, quartier) avec cascade
- Tags
- Capacité
- Mode (en_ligne, présentiel, hybride)
- Type d'événement
- Dates

### 2️⃣ Clubs
**Fichier** : `sql/migrations/update_get_clubs_with_filters.sql`

**Filtres ajoutés** :
- Tags
- Capacité
- Statut (ouvert/fermé)
- Thème principal
- Lieu

### 3️⃣ Blogs
**Fichier** : `sql/migrations/update_get_articles_with_filters.sql`

**Filtres ajoutés** :
- Tags
- Popularité (vues, likes)

---

## 🚀 Étapes de déploiement

### Option 1 : Via Supabase Dashboard (Recommandé)

1. **Ouvrez votre dashboard Supabase**
2. **Allez dans SQL Editor**
3. **Pour chaque migration** :
   - Copiez le contenu du fichier
   - Collez dans l'éditeur SQL
   - Cliquez sur "Run"
   - Vérifiez qu'il n'y a pas d'erreur

**Ordre d'exécution** : Événements → Clubs → Blogs (ou n'importe quel ordre)

### Option 2 : Via CLI Supabase

```bash
supabase db push
```

---

## ✅ Vérification après migration

Après avoir exécuté les 3 migrations, vérifiez dans la console :

```sql
-- Vérifier que les fonctions existent
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_evenements', 'get_clubs', 'get_articles');
```

Vous devriez voir les 3 fonctions listées.

---

## 📁 Fichiers créés

### Actions serveur
- `app/evenements/get-data.ts` : getAllEvenements, getDistinctEventTags, getDistinctEventTypes
- `app/clubs/get-data.ts` : getAllClubs, getDistinctClubTags, getDistinctClubThemes, getDistinctClubLocations
- `app/blog/get-data.ts` : getAllArticles, getDistinctArticleTags

### Fonctions SQL
- `sql/get_evenements.sql` : Fonction complète avec tous les filtres
- `sql/get_clubs.sql` : Fonction complète avec tous les filtres
- `sql/get_articles.sql` : Fonction complète avec tous les filtres

### Migrations
- `sql/migrations/update_get_evenements_with_filters.sql`
- `sql/migrations/update_get_clubs_with_filters.sql`
- `sql/migrations/update_get_articles_with_filters.sql`

---

## ⚠️ Points importants

1. **Cast explicite** : Toutes les fonctions utilisent `tags::text[]` pour éviter les erreurs de type
2. **DROP FUNCTION** : Chaque migration supprime d'abord l'ancienne fonction
3. **Client admin** : Toutes les actions serveur utilisent le client admin pour les RPC
4. **Logs détaillés** : Chaque fonction affiche des logs pour faciliter le débogage

---

## 🧪 Tests à effectuer après déploiement

### Événements
- [ ] Sélectionner un pays → villes filtrées
- [ ] Sélectionner une ville → quartiers filtrés
- [ ] Filtrer par mode (en ligne/présentiel/hybride)
- [ ] Filtrer par type d'événement
- [ ] Filtrer par tags
- [ ] Filtrer par capacité

### Clubs
- [ ] Filtrer par statut (ouvert/fermé)
- [ ] Filtrer par thème
- [ ] Filtrer par lieu
- [ ] Filtrer par tags
- [ ] Filtrer par capacité

### Blogs
- [ ] Filtrer par tags
- [ ] Filtrer par popularité (vues minimales)
- [ ] Filtrer par likes

---

## 🐛 En cas d'erreur

Si vous rencontrez une erreur de type `structure of query does not match function result type` :
- Vérifiez que le cast `::text[]` est bien présent pour les tags
- Assurez-vous que la fonction a été supprimée avant d'être recréée

Si les données ne se chargent pas :
- Vérifiez les logs dans la console du navigateur (F12)
- Cherchez les messages `[getAllEvenements]`, `[getAllClubs]`, `[getAllArticles]`
- Vérifiez que les migrations ont bien été exécutées

---

## 📞 Prochaines étapes

Après avoir exécuté les migrations :
1. Les wrappers de filtres seront mis à jour
2. Les sidebars seront mises à jour
3. Les filtres seront testés sur mobile et desktop
