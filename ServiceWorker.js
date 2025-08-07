// ==============================
// CONFIGURACIÓN DE VERSIÓN Y CACHÉ
// ==============================
const CACHE_VERSION = 'v3.0.2'; // ¡Actualiza este número con cada cambio!
const CACHE_NAME = `ecoreto-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `ecoreto-dynamic-${CACHE_VERSION}`;

// ==============================
// ARCHIVOS A PRECACHEAR (Actualiza esta lista)
// ==============================
const PRECACHE_ASSETS = [
  // HTML
  '/PWA-ProyectoFinal/',
  '/PWA-ProyectoFinal/index.html',
  
  // Config
  '/PWA-ProyectoFinal/manifest.json',
  '/PWA-ProyectoFinal/ServiceWorker.js',

  // CSS (Asegúrate de incluir todos)
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

  // JS (Verifica que estén todos)
  '/PWA-ProyectoFinal/js/app.js',
  '/PWA-ProyectoFinal/js/calculadora.js',
  '/PWA-ProyectoFinal/js/comments.js',
  '/PWA-ProyectoFinal/js/desafio.js',
  '/PWA-ProyectoFinal/js/firebase-config.js',
  '/PWA-ProyectoFinal/js/firebase-db.js',
  '/PWA-ProyectoFinal/js/organizacion.js',
  '/PWA-ProyectoFinal/js/pwa.js',
  '/PWA-ProyectoFinal/js/tips.js',

  // Imágenes (Actualiza con tus rutas)
  '/PWA-ProyectoFinal/img/team/brandon.jpg',
  '/PWA-ProyectoFinal/img/team/ricardo.jpg',
  '/PWA-ProyectoFinal/img/team/fransicso.jpg',
  '/PWA-ProyectoFinal/img/Logo1.png',
  '/PWA-ProyectoFinal/img/Logo2.png',
  '/PWA-ProyectoFinal/img/Logo3.png',
  '/PWA-ProyectoFinal/img/Logo4.png',
  '/PWA-ProyectoFinal/img/Logo5.png',
  '/PWA-ProyectoFinal/img/Logo6.png',
  '/PWA-ProyectoFinal/img/Fondo1.png',

  // CDNs externos
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js' // Añadido para la calculadora
];

// ==============================
// ESTRATEGIAS DE CACHÉ MEJORADAS
// ==============================
const cacheFirstWithUpdate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Intenta actualizar en segundo plano
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
      await dynamicCache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Error en actualización en segundo plano:', error);
  }

  return cachedResponse || fetch(request);
};

const networkFirstWithCache = async (request) => {
  try {
    const networkResponse = await fetch(request);
    const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
    await dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || offlineResponse(request);
  }
};

const offlineResponse = (request) => {
  if (request.destination === 'document') {
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>EcoReto - Sin conexión</title>
          <style>
            body { font-family: 'Poppins', sans-serif; text-align: center; padding: 2rem; }
            h1 { color: #2E7D32; }
          </style>
        </head>
        <body>
          <h1>Modo sin conexión</h1>
          <p>La aplicación EcoReto no puede conectarse ahora.</p>
          <p>Revisa tu conexión a internet.</p>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  return new Response('', { status: 503, statusText: 'Service Unavailable' });
};

// ==============================
// EVENTOS PRINCIPALES
// ==============================
self.addEventListener('install', (event) => {
  console.log(`[SW] Instalando versión ${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Almacenando en caché recursos esenciales');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Error durante la instalación:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log(`[SW] Activando versión ${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName)) {
            console.log('[SW] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    }).then(() => {
      // Notificar a todos los clientes sobre la actualización
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Excluir solicitudes no-GET y de origen diferente
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Estrategias de caché por tipo de recurso
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithCache(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithCache(request));
  } else if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirstWithUpdate(request));
  } else {
    event.respondWith(networkFirstWithCache(request));
  }
});

// ==============================
// FUNCIONALIDADES AVANZADAS
// ==============================

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncPendingComments());
  }
});

// Push Notifications
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
      data: data.data
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// ==============================
// FUNCIONES AUXILIARES
// ==============================
async function syncPendingComments() {
  const db = await openCommentsDB();
  const pendingComments = await db.getAll('pending');
  
  for (const comment of pendingComments) {
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
      console.error('Error al sincronizar comentario:', error);
      break;
    }
  }
}

function openCommentsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EcoRetoDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Manejo de mensajes desde la app
self.addEventListener('message', (event) => {
  const { action, data } = event.data || {};

  switch (action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;

    case 'clearCache':
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
      break;

    case 'updateCache':
      updateDynamicCache(data.url, data.response);
      break;
  }
});

async function updateDynamicCache(url, response) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  await cache.put(url, new Response(JSON.stringify(response)));
}