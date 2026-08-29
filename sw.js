
const CACHE_NAME = 'critique-pro-offline-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// The "Network falling back to cache" strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If internet works, save a fresh copy of Tailwind/Icons to the phone
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => {
                // NO INTERNET: Serve the app from the phone's hard drive!
                return caches.match(event.request);
            })
    );
});
