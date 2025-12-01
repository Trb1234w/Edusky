# Guide d'Installation - PWA Edusky

## Étapes Finales

### 1. Installer next-pwa

Comme npm n'est pas accessible via PowerShell, tu dois installer `next-pwa` manuellement :

**Option A : Via VS Code Terminal**
```bash
npm install next-pwa
```

**Option B : Via Node.js Command Prompt**
1. Ouvre "Node.js command prompt" depuis le menu Démarrer
2. Navigue vers le projet :
   ```bash
   cd C:\Users\TRB\Downloads\edusky-platform
   ```
3. Installe next-pwa :
   ```bash
   npm install next-pwa
   ```

### 2. Build et Test

Une fois `next-pwa` installé, build l'application :

```bash
npm run build
npm start
```

### 3. Tester la PWA

#### Sur Desktop (Chrome/Edge)
1. Ouvre `http://localhost:3000`
2. Cherche l'icône d'installation dans la barre d'adresse (⊕ ou ⬇)
3. Clique sur "Installer" ou "Install App"
4. L'app s'ouvrira dans une fenêtre standalone

#### Sur Mobile
1. Ouvre l'app sur ton téléphone
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône Edusky apparaîtra sur ton écran d'accueil
4. Ouvre l'app - elle fonctionnera comme une app native !

### 4. Vérifier avec Chrome DevTools

1. Ouvre DevTools (F12)
2. Onglet "Application"
3. Vérifie :
   - **Manifest** : Toutes les infos sont correctes
   - **Service Workers** : Le SW est enregistré et actif
   - **Cache Storage** : Les fichiers sont mis en cache
4. Utilise **Lighthouse** pour scorer la PWA (objectif : >90)

## Fichiers Créés

✅ `/public/manifest.json` - Configuration PWA
✅ `/public/icon-192x192.png` - Icône standard
✅ `/public/icon-512x512.png` - Icône haute résolution
✅ `/public/icon-maskable-512x512.png` - Icône maskable Android
✅ `/public/apple-touch-icon.png` - Icône iOS
✅ `next.config.mjs` - Configuration next-pwa avec caching
✅ `app/layout.tsx` - Métadonnées PWA

## Fonctionnalités PWA Activées

🚀 **Installation** - Sur desktop et mobile
📱 **Mode Standalone** - Fonctionne comme une app native
🔄 **Service Worker** - Cache intelligent des assets
⚡ **Performance** - Chargement ultra-rapide
🌐 **Offline** - Fonctionnement basique hors ligne
🎨 **Icônes** - Design moderne et professionnel
🔗 **Shortcuts** - Accès rapide aux sections principales

## Prochaines Étapes (Optionnel)

- Ajouter des notifications push
- Améliorer le cache offline pour plus de fonctionnalités
- Créer des splash screens personnalisés pour iOS
- Configurer la synchronisation en arrière-plan
