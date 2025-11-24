# Guide de déploiement des filtres de formations

## Mise à jour de la base de données

Vous devez exécuter la migration SQL pour mettre à jour la fonction `get_formations` :

### Option 1 : Via Supabase Dashboard
1. Allez sur votre tableau de bord Supabase
2. Naviguez vers **SQL Editor**
3. Copiez et exécutez le contenu du fichier : `sql/migrations/update_get_formations_with_filters.sql`

### Option 2 : Via CLI Supabase
```bash
supabase db push
```

## Vérification

Après avoir exécuté la migration, testez les filtres :

1. **Filtre par pays** : Sélectionnez un pays et vérifiez que seules les formations de ce pays s'affichent
2. **Filtre par ville** : Après avoir sélectionné un pays, sélectionnez une ville
3. **Filtre par quartier** : Après avoir sélectionné une ville, sélectionnez un quartier
4. **Filtre par tags** : Sélectionnez un tag et vérifiez le filtrage
5. **Filtre par capacité** : Activez "Places disponibles" pour voir uniquement les formations avec des places

## Cascade des filtres

Les filtres de localisation fonctionnent en cascade :
- Quand vous changez de **pays**, les villes et quartiers sont automatiquement réinitialisés
- Quand vous changez de **ville**, le quartier est automatiquement réinitialisé
- Les villes affichées dépendent du pays sélectionné
- Les quartiers affichés dépendent de la ville sélectionnée
