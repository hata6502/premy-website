const requests = [
  "./",
  "./dist/index.css",
  "./dist/index.js",
  "./favicon.png",
  "./manifest.json",
  "./premy.json",
  "./redirect.html",
  "https://fonts.googleapis.com/css?family=Dancing+Script|Fruktur|Hachi+Maru+Pop|Potta+One",
];

declare global {
  const CACHE_NAME: string;
}

const serviceWorker = globalThis as unknown as ServiceWorkerGlobalScope;

serviceWorker.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map(async (key) => {
          if (key === CACHE_NAME) {
            return;
          }

          await caches.delete(key);
        })
      );

      await serviceWorker.clients.claim();
    })()
  );
});

serviceWorker.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cacheResponse = await caches.match(event.request);

      if (cacheResponse) {
        return cacheResponse;
      }

      const fetchResponse = await fetch(event.request);

      return fetchResponse;
    })()
  );
});

serviceWorker.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await cache.addAll(requests);
      await serviceWorker.skipWaiting();
    })()
  );
});

export {};
