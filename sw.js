const APP_CACHE = 'formulavs-shell-v2.10.7';
const APP_VERSION = '2.10.7';
const CORE_ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg','./version.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== APP_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request, {cache:'no-store'});
    if (response && response.ok) {
      const cache = await caches.open(APP_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    return cached || caches.match('./index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(APP_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return caches.match('./index.html');
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/sw.js')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(new Request('./index.html', {method:'GET', headers:event.request.headers})));
    return;
  }
  event.respondWith(cacheFirst(event.request));
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
