
// Cache ID version
const cacheID = 'v1';
// Files to precache
const cacheFiles = [
  // HTML Files
  './index.html',
  './offline.html',
  // CSS Files
  
  // Image Files
  './_resources/img/icon_arrow.png',
  './_resources/img/icon_search.webp',
  './_resources/img/logo_UCSD.webp',
  './_resources/img/icon_check.webp',
  './_resources/vid/vid-poster-min_800.webp',
  './_resources/img/bg_attend-min_10q.webp',
  './_resources/img/bg_campaign-min_10q.webp',
  './_resources/img/bg_event_multiple-min_10q.webp',
  './_images/about/sally_ride_stamp-min_10q.webp',
  './_images/about/cwur_20-min_10q.webp',
  './_images/about/coursera_flammer-min_10q.webp',
  './_resources/img/logo_UCSD_white.webp',
  './_resources/img/icon_fb.webp',
  './_resources/img/icon_ig.webp',
  './_resources/img/icon_linked.webp',
  './_resources/img/icon_tw.webp',
  './_resources/img/placeholder_ig-min.webp',
  './_resources/img/bg_blue_lines.webp',
  './_resources/img/bg_research-min_800.webp',
  './_resources/img/bg_research-min_480.webp',
  './_resources/img/bg_research-min_320.webp',
  './_resources/img/bg_attend-min_800.webp',
  './_resources/img/bg_attend-min_480.webp',
  './_resources/img/bg_attend-min_320.webp',
  './_resources/img/bg_campus_life-min_800.webp',
  './_resources/img/bg_campus_life-min_480.webp',
  './_resources/img/bg_campus_life-min_320.webp',
  './_resources/img/bg_map-min_800.webp',
  './_resources/img/bg_map-min_480.webp',
  './_resources/img/bg_map-min_320.webp',
  './_resources/img/bg_campaign-min_800.webp',
  './_resources/img/bg_campaign-min_480.webp',
  './_resources/img/bg_campaign-min_320.webp',
  './_resources/img/bg_event_multiple-min_800.webp',
  './_resources/img/bg_event_multiple-min_480.webp',
  './_resources/img/bg_event_multiple-min_320.webp',
  './_images/about/Sally-Ride-Stamp-min_800.webp',
  './_images/about/Sally-Ride-Stamp-min_480.webp',
  './_images/about/Sally-Ride-Stamp-min_320.webp',
  './_images/about/CWUR-20-min_800.webp',
  './_images/about/CWUR-20-min_480.webp',
  './_images/about/CWUR-20-min_320.webp',
  './_images/about/Coursera_Flammer-min_800.webp',	
  './_images/about/Coursera_Flammer-min_480.webp',
  './_images/about/Coursera_Flammer-min_320.webp',
  // JS Files
  './sw.js',
  './app.js',
  // Misc. Files
  './manifest.json',
];

// Service Worker Install Event
self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheID)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
      console.log(`Unable to add cached assets: ${error}`);
    })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Load up all items from cache, and check if cache items are not outdated
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheID) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Service Worker Fetch Event
// self.addEventListener('fetch', function(e) {
//   console.log('Attempting to fetch');
//   e.respondWith(
//     // If request matches with something in cache, then return reponse
//     // from cache, otherwise fetch it
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheID).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if (event.request.method != "POST") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(function(error) {
          console.log("error: " + error);
          return caches.match('./offline.html');
        });;
      });
    })
  );
});