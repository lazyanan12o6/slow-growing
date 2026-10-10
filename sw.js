// Slow Growing — keeps the app working offline.
// When the app is updated, change VERSION so phones pick up the new files.
const VERSION = 'slow-growing-v27';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './vendor/react.production.min.js', './vendor/react-dom.production.min.js', './vendor/htm.umd.js',
  './fonts/montserrat-latin-400-normal.woff2', './fonts/montserrat-latin-500-normal.woff2',
  './fonts/montserrat-latin-600-normal.woff2', './fonts/montserrat-latin-700-normal.woff2',
  './fonts/poppins-latin-400-normal.woff2', './fonts/poppins-latin-500-normal.woff2',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // show the saved copy right away, refresh it in the background
  e.respondWith(caches.open(VERSION).then(cache => cache.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
