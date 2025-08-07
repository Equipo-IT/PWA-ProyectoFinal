// ==============================
// VERSIÓN Y CACHÉ
// ==============================
const CACHE_VERSION = 'v3.0.1';
const CACHE_NAME = `ecoreto-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `ecoreto-dynamic-${CACHE_VERSION}`;

// ==============================
// ARCHIVOS A PRECACHEAR
// ==============================
const PRECACHE_ASSETS = [
  '/PWA-ProyectoFinal/',
  '/PWA-ProyectoFinal/index.html',
  '/PWA-ProyectoFinal/manifest.json',
  '/PWA-ProyectoFinal/ServiceWorker.js',

  // CSS
  '/PWA-ProyectoFinal/css/base.css',
  '/PWA-ProyectoFinal/css/calculadora.css',
  '/PWA-ProyectoFinal/css/comentarios.css',
  '/PWA-ProyectoFinal/css/desafio.css',
  '/PWA-ProyectoFinal/css/footer.css',
  '/PWA-ProyectoFinal/css/home.css',
  '/PWA-ProyectoFinal/css/install.css',
  '/PWA-ProyectoFinal/css/layout.css',
  '/PWA-ProyectoFinal/css/navbar.css',
  '/PWA-ProyectoFinal/css/organizacion.css',
  '/PWA-ProyectoFinal/css/responsive.css',
  '/PWA-ProyectoFinal/css/secciones.css',
  '/PWA-ProyectoFinal/css/styles.css',
  '/PWA-ProyectoFinal/css/tips.css',

  // JS
  '/PWA-ProyectoFinal/js/app.js',
  '/PWA-ProyectoFinal/js/calculadora.js',
  '/PWA-ProyectoFinal/js/comments.js',
  '/PWA-ProyectoFinal/js/desafio.js',
  '/PWA-ProyectoFinal/js/firebase-config.js',
  '/PWA-ProyectoFinal/js/firebase-db.js',
  '/PWA-ProyectoFinal/js/organizacion.js',
  '/PWA-ProyectoFinal/js/pwa.js',
  '/PWA-ProyectoFinal/js/tips.js',

  // IMG
  '/PWA-ProyectoFinal/img/team/brandon.jpg',
  '/PWA-ProyectoFinal/img/Logo1.png',
  '/PWA-ProyectoFinal/img/Logo2.png',
  '/PWA-ProyectoFinal/img/Logo3.png',
  '/PWA-ProyectoFinal/img/Logo4.png',
  '/PWA-ProyectoFinal/img/Logo5.png',
  '/PWA-ProyectoFinal/img/Logo6.png',
  '/PWA-ProyectoFinal/img/Fondo1.png',

  // Fuentes y CDNs
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@400;700&display=swap'
];

// ==============================
// ESTRATEGIAS DE CACHÉ
// ==============================
const cacheFirstWithUpdate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  fetch(request).then(async (response) => {
    if (response.ok) {
      const dynamic = await caches.open(DYNAMIC_CACHE_NAME);
      dynamic.put(request, response.clone());
    }
  }).catch(() => {});

  return cached || fetch(request);
};

const networkFirstWithCache = async (request) => {
  try {
    const response = await fetch(request);
    const dynamic = await caches.open(DYNAMIC_CACHE_NAME);
    dynamic.put(request, response.clone());
    return response;
  } catch {
    const staticCache = await caches.match(request, { cacheName: CACHE_NAME });
    if (staticCache) return staticCache;

    const dynamicCache = await caches.match(request, { cacheName: DYNAMIC_CACHE_NAME });
    if (dynamicCache) return dynamicCache;

    if (request.destination === 'document') {
      return new Response('<h1>Estás offline</h1><p>Conéctate a internet para usar EcoReto.</p>', {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('', { status: 503, statusText: 'Offline' });
  }
};

// ==============================
// EVENTOS DEL SERVICE WORKER
// ==============================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando versión', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => {
        if (![CACHE_NAME, DYNAMIC_CACHE_NAME].includes(key)) {
          console.log('[SW] Eliminando caché antigua:', key);
          return caches.delete(key);
        }
      }));
      await self.clients.claim();
      const clients = await self.clients.matchAll();
      clients.forEach(client => client.postMessage({ type: 'SW_ACTIVATED' }));
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) return;

  switch (true) {
    case request.destination === 'document':
      event.respondWith(networkFirstWithCache(request));
      break;

    case url.pathname.startsWith('/api/'):
      event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
      break;

    case ['style', 'script', 'image', 'font'].includes(request.destination):
      event.respondWith(cacheFirstWithUpdate(request));
      break;

    default:
      event.respondWith(networkFirstWithCache(request));
  }
});

// ==============================
// MENSAJES DESDE LA APP
// ==============================
self.addEventListener('message', (event) => {
  const { action, url, data, requestUrl, callbackId } = event.data || {};

  switch (action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;

    case 'updateCache':
      caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.put(url, new Response(JSON.stringify(data))));
      break;

    case 'getCachedData':
      caches.match(requestUrl).then(response => {
        if (response) {
          response.json().then(data => {
            event.ports[0].postMessage({ callbackId, data });
          });
        } else {
          event.ports[0].postMessage({ callbackId, error: 'Not cached' });
        }
      });
      break;
  }
});
// BACKGROUND SYNC
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-challenge-data') {
    console.log('[SW] Sincronizando desafíos...');
    event.waitUntil(syncChallengeData());
  }

  if (event.tag === 'sync-comments') {
    console.log('[SW] Sincronizando comentarios...');
    event.waitUntil(syncPendingComments());
  }
});

async function syncChallengeData() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const response = await fetch('/api/challenges/latest');
  if (response.ok) {
    await cache.put('/api/challenges/latest', response.clone());
    await self.registration.showNotification('Datos actualizados', {
      body: 'Tus desafíos han sido sincronizados',
      icon: '/img/icons/icon-192x192.png'
    });
    return response;
  }
  throw new Error('Error al sincronizar desafíos');
}

async function syncPendingComments() {
  const db = await openCommentsDB();
  const pending = await db.getAll('pending');
  for (const comment of pending) {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(comment),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        await db.delete('pending', comment.id);
      }
    } catch (error) {
      console.error('Error al enviar comentario pendiente:', error);
      break;
    }
  }
}
// PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: 'EcoReto',
    body: '¡Tienes un nuevo desafío esperándote!',
    icon: '/img/Logo4.png',
    badge: '/img/Logo3.png',
    data: { url: '/?section=challenge' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [200, 100, 200],
      data: { url: data.data.url }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) return client.focus();
        }
        return clients.openWindow(url);
      })
  );
});

// INDEXEDDB: PENDIENTES OFFLINE
function openCommentsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EcoRetoDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
