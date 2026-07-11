# Sports des Vieux — notes pour Claude

## Déploiement

L'app est déployée via **GitHub Pages**, pas Vercel (le `vercel.json` présent dans le repo n'est plus utilisé pour le déploiement réel).

- Workflow : `.github/workflows/pages.yml`
- Déclencheur : push sur `main` (ou lancement manuel via `workflow_dispatch`)
- C'est un simple site statique : tout le contenu du repo est publié tel quel (`path: .`), aucune étape de build.

Donc pour mettre en prod : **merger/pousser sur `main`** suffit — GitHub Actions se charge du reste.

## Numéro de version

`APP_VERSION` (`js/app.js`, tout en haut) est affiché en bas de chaque page (`#app-footer`, peuplé au démarrage dans `DOMContentLoaded`). **Règle : incrémenter `APP_VERSION` à chaque modification livrée** (bump patch pour un correctif, minor pour une nouvelle fonctionnalité), pour que la version affichée reflète toujours le dernier changement déployé.

## Service worker

Penser à incrémenter `CACHE_VERSION` dans `sw.js` à chaque déploiement qui modifie un fichier précaché (`index.html`, `css/main.css`, `js/*.js`, `manifest.webmanifest`, icônes), pour forcer le renouvellement du cache côté utilisateurs.

## Données utilisateur

Tout est stocké en `localStorage` (clé `sports_tournament`, géré par `js/storage.js`). Les mises à jour de l'app (déploiement + service worker) ne touchent jamais à ces données — voir `js/app.js` (`storage.init` ne réinitialise que si la clé est absente) et `sw.js` (le versioning de cache ne concerne que les assets statiques).
