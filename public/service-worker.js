/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'orbitx-browser-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/orbitx-favicon.svg',
  '/favicon.ico',
  '/orbitxlogo.mp4',
  '/brahamand-ai.gif',
  '/homevideo.mp4'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🚀 OrbitX Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching OrbitX resources');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((error) => {
        console.error('❌ Cache error:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ OrbitX Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('❌ Fetch error:', error);
          // Return offline page if available
          return caches.match('/index.html');
        });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  if (event.tag === 'sync-searches') {
    event.waitUntil(syncSearches());
  }
});

async function syncSearches() {
  console.log('🔍 Syncing offline searches...');
  // Implement offline search sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'New update from OrbitX!',
    icon: '/orbitx-favicon.svg',
    badge: '/orbitx-favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open OrbitX',
        icon: '/orbitx-favicon.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/orbitx-favicon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('OrbitX Browser', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

