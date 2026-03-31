self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // 滿足 Chrome PWA 安裝必要條件的 fetch 監聽
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
