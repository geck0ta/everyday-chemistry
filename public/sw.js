// Everyday Chemistry — service worker
// Strategi: cache-first untuk aset statis (font, JS, CSS, ikon),
// network-first untuk navigasi halaman dengan fallback offline ke "/".
const VERSION = "ec-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll(["./", "./offline.html"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // CDN OCR dll tidak di-cache

  // Navigasi halaman: network-first, fallback cache, terakhir offline.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then(
            (hit) =>
              hit ||
              caches.match("./").then((home) => home || caches.match("./offline.html"))
          )
        )
    );
    return;
  }

  // Aset statis: cache-first
  if (
    url.pathname.includes("/_next/static/") ||
    /\.(png|svg|woff2?|ico|json|txt)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return res;
          })
      )
    );
  }
});
