const CACHE_NAME = 'indo-vault-v2';
const CORE_ASSETS = [
  './',
  'index.html',
  'course_30days.html',
  'curriculum_data.js',
  'manifest.json',
  'audio_manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching core assets');
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache First Strategy for fast offline audio and content
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        // Cache audio and pages on the fly
        const shouldCache = e.request.url.includes('native_audio/') || e.request.url.includes('native-audio/') || 
                            e.request.url.includes('/dli-audio/') || 
                            e.request.url.includes('/pdf/') ||
                            e.request.url.includes('.js') ||
                            e.request.url.includes('.html');
        if (shouldCache) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('./');
      });
    })
  );
});
