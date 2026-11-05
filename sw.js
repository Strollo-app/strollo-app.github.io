// Service worker: la app y los audios funcionan sin conexión una vez descargados.
const CACHE = 'kdk-v3';
const VERSION = '2026-11-05x';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  const isData = url.origin === location.origin && url.pathname.includes('/data/');

  if (isData) {
    // Datos de países: red primero (para recibir rutas nuevas) y caché si no hay conexión.
    e.respondWith(fetch(req.url, { cache: 'no-store' }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }

  if (isPage) {
    // Red primero para recibir actualizaciones; caché si no hay conexión.
    e.respondWith(
      fetch(req.url, { cache: 'no-store' }).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  if (url.pathname.endsWith('/api.php')) return; // búsquedas de fotos: siempre a la red
  if (url.pathname.includes('/audio/') || url.hostname === 'cdnjs.cloudflare.com' || url.hostname.endsWith('gstatic.com') || url.hostname === 'fonts.googleapis.com' || url.hostname === 'upload.wikimedia.org' || url.hostname === 'commons.wikimedia.org') {
    // Caché primero para audios, librerías y fuentes.
    e.respondWith(
      caches.match(req, { ignoreSearch: url.pathname.includes('/audio/') }).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return r;
      }))
    );
  }
});
