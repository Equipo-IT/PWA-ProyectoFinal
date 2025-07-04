// Versión del cache - cambiar para actualizar recursos
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `ecoreto-cache-${CACHE_VERSION}`;

// Archivos esenciales para el funcionamiento offline
const PRECACHE_ASSETS = [
  '/PWA-ProyectoFinal/',
  '/PWA-ProyectoFinal/index.html',
  '/PWA-ProyectoFinal/css/styles.css',
  '/PWA-ProyectoFinal/js/app.js',
  '/PWA-ProyectoFinal/img/Logo5.png',
  '/PWA-ProyectoFinal/img/Fondo1.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@400;700&display=swap'
];

// Estrategia: Cache First with Network Fallback
const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Clonamos la respuesta para guardarla en cache
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback para cuando no hay conexión
    return new Response(JSON.stringify({
      error: 'No tienes conexión y este recurso no está en caché'
    }), {
      status: 408,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Estrategia: Network First with Cache Fallback
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    // Actualizamos el cache
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline - Contenido no disponible', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Almacenando en caché recursos esenciales');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Estrategias diferentes por tipo de recurso
  if (event.request.method === 'GET') {
    // Para documentos HTML, usa Network First
    if (event.request.destination === 'document') {
      event.respondWith(networkFirst(event.request));
    }
    // Para CSS, JS, imágenes, usa Cache First
    else if (
      event.request.destination === 'style' ||
      event.request.destination === 'script' ||
      event.request.destination === 'image'
    ) {
      event.respondWith(cacheFirst(event.request));
    }
    // Para fuentes y otros recursos
    else {
      event.respondWith(networkFirst(event.request));
    }
  }
});

// Manejo de mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-challenge-data') {
    console.log('[Service Worker] Sincronizando datos de desafíos...');
    event.waitUntil(syncChallengeData());
  }
});

async function syncChallengeData() {
  // Lógica para sincronizar datos cuando la conexión regresa
  // Puedes implementar IndexedDB o enviar datos al servidor
}

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});