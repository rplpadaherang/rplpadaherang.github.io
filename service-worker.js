importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
workbox.precaching.precacheAndRoute([

  { url: '/', revision : '1' },
  { url: '/nav.html', revision : '1' },
  { url: '/index.html', revision : '1' },
  { url: '/pages/group.html', revision : '1' },
  { url: '/pages/match.html', revision : '1' },
  { url: '/pages/savedMatch.html', revision : '1' },
  { url: '/css/materialize.min.css', revision : '1' },
  { url: '/js/materialize.min.js', revision : '1' },
  { url: '/manifest.json', revision : '1' },
  { url: '/js/nav.js', revision : '1' },
  { url: '/js/api.js', revision : '1' },
  { url: '/js/idb.js', revision : '1' },
  { url: '/js/db.js', revision : '1' },
  { url: '/js/script.js', revision : '1' },
  { url: '/asset/icon512.png', revision : '1' },
  { url: '/asset/icon192.png', revision : '1' },
  { url: '/asset/icon.png', revision : '1' },
  { url: '/js/pushSW.js', revision : '1' },
  { url: '/push.js', revision : '1' },
],

{
    //Ignore all URL parameters
ignoreUrlParametersMatching:[/.*/]
});

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
)

//Event Delete Cache
self.addEventListener("activate", function (event) {
  event.waitUntil(
      caches.keys().then(function (cacheNames) {
          return Promise.all(
              cacheNames.map(function (cacheName) {
                  if (cacheName != CACHE_NAME) {
                      console.log("ServiceWorker: Cache " + cacheName + " Dihapus");
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});

workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ]
    })
  );

  workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

//Push Notification
self.addEventListener('push', function (event) {
  let body;

  if (event.data) {
      body = event.data.text();
  } else {
      body = 'Push Dengan Message Berhasil';
  }

  let options = {
      body: body,
      icon: 'asset/icon.png',
      vibrate: [100, 50, 100],
      data: {
          dataOfArrival: Date.now(),
          primaryKey: 1
      }
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options)
  );

});