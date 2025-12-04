# Instructions de Déploiement - Optimisation Feed

## Étape 1 : Déployer les Fonctions SQL dans Supabase

Vous devez exécuter les deux fichiers SQL dans l'éditeur SQL de Supabase :

### 1. Fonction pour le Feed Principal
Ouvrez `sql/functions/get_feed_posts_optimized.sql` et exécutez-le dans Supabase SQL Editor.

### 2. Fonction pour les Posts de Profil
Ouvrez `sql/functions/get_posts_by_author_optimized.sql` et exécutez-le dans Supabase SQL Editor.

## Étape 2 : Vérifier les Fonctions

Dans Supabase SQL Editor, testez les fonctions :

```sql
-- Test 1: Feed posts (sans utilisateur)
SELECT * FROM get_feed_posts_optimized(NULL) LIMIT 5;

-- Test 2: Feed posts (avec utilisateur - remplacez l'UUID)
SELECT * FROM get_feed_posts_optimized('votre-user-id-ici') LIMIT 5;

-- Test 3: Posts d'un auteur (remplacez les UUIDs)
SELECT * FROM get_posts_by_author_optimized('author-id-ici', 'current-user-id-ici') LIMIT 5;
```

## Étape 3 : Déployer le Code

Une fois les fonctions SQL déployées, poussez le code TypeScript modifié :

```bash
git add .
git commit -m "perf: optimize feed page - eliminate N+1 queries (150-300 → 1)"
git push
```

## Résultats Attendus

### Avant Optimisation
- **Page Feed** : 2-3 secondes (150-300 requêtes séquentielles)
- **Page Profil** : 1-2 secondes (N+1 requêtes pour les posts)

### Après Optimisation
- **Page Feed** : < 500ms (1 seule requête)
- **Page Profil** : < 400ms (1 seule requête)

## Vérification

1. Ouvrez la page `/feed` en production
2. Ouvrez Chrome DevTools → Network tab
3. Rechargez la page
4. Vérifiez que le temps de chargement est < 500ms
5. Vérifiez qu'il n'y a qu'un seul appel RPC au lieu de centaines

## Rollback (si nécessaire)

Si vous rencontrez des problèmes, vous pouvez revenir en arrière :

```bash
git revert HEAD
git push
```

Les fonctions SQL resteront dans Supabase mais ne seront pas utilisées.
