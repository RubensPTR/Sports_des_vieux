/* Service worker — précache le shell de l'app pour le mode hors ligne.
   Incrémenter CACHE_VERSION à chaque déploiement qui modifie ces fichiers. */

const CACHE_VERSION = 'sdv-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/main.css',
  './js/storage.js',
  './js/data.js',
  './js/charts.js',
  './js/app.js',
  './data/initial-data.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord (pour récupérer les mises à jour), cache en secours :
// parfait pour la pétanque au fond du parc sans 4G.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
        return res;
      })
      .catch(() =>
        caches.match(event.request).then(hit => hit || caches.match('./index.html'))
      )
  );
});
