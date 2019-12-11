// sw.js

var cacheName = 'NorthRiftRadio_V1';
const offlineUrl = '/offline_page.html';
var cacheVersion = 1;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};

var filesToCache = [
    '/index.html',
    '/css/all.css', 
    '/css/mediaelementplayer.css',
    '/css/NRR_page_styling.css',
    '/css/progres-bar.css',
    '/fonts/Gotham-Thin.ttf',
    '/fonts/Gotham-Medium.ttf',

    
    '/pictures/mejs-controls.svg',
    '/pictures/images/mic_bg_right.webp',
    '/pictures/logo/en_badge_web_generic.png',
    '/pictures/logo/icon_256.png',
    '/pictures/logo/north_rift_radio_logo.jpg',
    '/pictures/logo/north_rift_radio_logo_round.jpg',


    '/scripts/global_scripts.js',
    '/scripts/mediaelement-and-player.js',
    '/scripts/player_custom.js',

    '/webfonts/fa-brands-400.eot',
    '/webfonts/fa-brands-400.svg',
    '/webfonts/fa-brands-400.ttf',
    '/webfonts/fa-brands-400.woff',
    '/webfonts/fa-brands-400.woff2',
    '/webfonts/fa-regular-400.eot',
    '/webfonts/fa-regular-400.svg',
    '/webfonts/fa-regular-400.ttf',
    '/webfonts/fa-regular-400.woff',
    '/webfonts/fa-regular-400.woff2',
    '/webfonts/fa-solid-900.eot',
    '/webfonts/fa-solid-900.svg',
    '/webfonts/fa-solid-900.ttf',
    '/webfonts/fa-solid-900.woff',
    '/webfonts/fa-solid-900.woff2'


];



if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('Service worker successfully registered on scope', registration.scope);
        }).catch(function (error) {
            console.log('Service worker failed to register', error);
        });
    });
}






self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.info('[sw.js] cached all files');
            return cache.addAll(filesToCache);
        })
    );
});










self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // See /web/fundamentals/getting-started/primers/async-functions
    // for an async/await primer.
    event.respondWith(async function() {
      // Optional: Normalize the incoming URL by removing query parameters.
      // Instead of https://example.com/page?key=value,
      // use https://example.com/page when reading and writing to the cache.
      // For static HTML documents, it's unlikely your query parameters will
      // affect the HTML returned. But if you do use query parameters that
      // uniquely determine your HTML, modify this code to retain them.
      const normalizedUrl = new URL(event.request.url);
      normalizedUrl.search = '';

      // Create promises for both the network response,
      // and a copy of the response that can be used in the cache.
      const fetchResponseP = fetch(normalizedUrl);
      const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

      // event.waitUntil() ensures that the service worker is kept alive
      // long enough to complete the cache update.
      event.waitUntil(async function() {
        const cache = await caches.open(cacheName);
        await cache.put(normalizedUrl, await fetchResponseCloneP);
      }());

      // Prefer the cached response, falling back to the fetch response.
      return (await caches.match(normalizedUrl)) || fetchResponseP;
    }());
  }
});





