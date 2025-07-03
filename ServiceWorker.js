// swcache.js
const CACHE_NAME = 'ecoreto-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/img/Logo1.png',
  '/img/Logo2.png',
  '/img/Logo3.png',
  '/img/Logo4.png',
  '/img/Logo5.png',
  '/img/Fondo1.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
