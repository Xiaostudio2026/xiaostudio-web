self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. 排除圖示與靜態資源，讓瀏覽器以原生方式讀取，避免被 SW 攔截干擾
  if (
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.mp4')
  ) {
    return; // 不調用 event.respondWith()，直接退回原生網絡流程
  }

  // 2. 滿足 Chrome PWA 安裝必要條件的 fetch 監聽
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
