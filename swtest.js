
var baseUrl = location.origin + "/";
var dataUrl = baseUrl + "json/";
var cacheName = "chat-cache-name";
var dataCacheName = "chat-data-cache-name";
var cacheFiles = [
  '/',
  '/index.html',
  '/source/lib/bootstrap-custom/css/custom.bootstrap.css',
  '/source/lib/blog.css',
  '/source/lib/bcd.min.js',
  '/source/dist/index.js'
];

var isCurrentWindowFocus = true;

self.addEventListener("install", function(e) {
    e.waitUntil(caches.open(cacheName).then(function(cache) {
        return cache.addAll(cacheFiles);
    }));
});

self.addEventListener("activate", function(e) {
    e.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName && key !== dataCacheName) {
                return caches.delete(key);
            }
        }));
    }));

    return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
    if (e.request.url.indexOf(dataUrl) === 0) {
        return e.respondWith(caches.open(dataCacheName).then(function(cache) {
            return fetch(e.request).then(function(response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        }));
    } else if(cacheFiles.indexOf(e.request.url.replace(baseUrl, '/')) > -1){
        e.respondWith(caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        }));
    }
});
