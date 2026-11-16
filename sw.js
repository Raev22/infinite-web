// Офлайн-режим: файлы игры кэшируются и обновляются в фоне при следующем открытии.
const CACHE = "infinite-snake-v5";
const ASSETS = [
    "./",
    "index.html",
    "styles.css",
    "script.js",
    "manifest.webmanifest",
    "assets/game-sprites.svg",
    "assets/icon-192.png",
    "assets/icon-512.png",
    "assets/icon-maskable-512.png",
    "assets/apple-touch-icon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
    event.respondWith(
        caches.open(CACHE).then(cache =>
            cache.match(request, { ignoreSearch: true }).then(cached => {
                const fresh = fetch(request).then(response => {
                    if (response && response.ok) cache.put(request, response.clone());
                    return response;
                }).catch(() => cached);
                return cached || fresh;
            })
        )
    );
});
