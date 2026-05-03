const CACHE = 'switchup-kokoro-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);

  // Only intercept requests to the Kokoro CDNs (esm.sh modules + Hugging Face model files)
  const isCDN = url.hostname === 'esm.sh' ||
                url.hostname === 'huggingface.co' ||
                url.hostname.endsWith('.huggingface.co');

  if (!isCDN) return;

  evt.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(evt.request).then(cached => {
        if (cached) return cached;
        return fetch(evt.request).then(res => {
          if (res.ok) cache.put(evt.request, res.clone());
          return res;
        });
      })
    )
  );
});
