const CACHE_NAME = 'indo-vault-v2';
const CORE_ASSETS = [
  './',
  'index.html',
  'curriculum_data.js',
  'manifest.json',
  'audio_manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Pre-caching core assets');
      for (const a of CORE_ASSETS) {
        try {
          const resp = await fetch(a);
          if (resp && resp.ok) await cache.put(a, resp);
        } catch(err) {}
      }
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
        const shouldCache = e.request.url.includes('native_audio/') || 
                            e.request.url.includes('native-audio/') || 
                            e.request.url.includes('dli_audio/') || 
                            e.request.url.includes('pimsleur_audio/') || 
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
