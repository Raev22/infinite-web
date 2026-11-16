// Офлайн-режим: файлы игры кэшируются при каждой загрузке и отдаются из кэша, когда сети нет.
const CACHE = "infinite-snake-v9";
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

// Сначала сеть, кэш — только когда сети нет. Так после выкладки новой версии все файлы
// обновляются сразу и вместе, а без интернета игра по-прежнему открывается.
self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
    event.respondWith(
        fetch(request, { cache: "no-cache" }).then(response => {
            if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE).then(cache => cache.put(request, copy));
            }
            return response;
        }).catch(() => caches.open(CACHE).then(cache => cache.match(request, { ignoreSearch: true })))
    );
});
