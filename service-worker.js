var version = 'v22';
var namePrefix = 'swblog-';
var nameReg = new RegExp('^' + namePrefix);
var businessKey = 'business-' + version;    //cachestorage名称，可以加上版本号予以区分
var businessCacheName = namePrefix + businessKey;
var libCacheName = namePrefix + 'lib-' + version;
var imageCacheName = namePrefix + 'image';
var markdownCacheName = namePrefix + 'markdown';

var expectedCaches = [
  businessCacheName, //业务代码  对于开发者常变，先用缓存，同时更新，下次进来再用新的(更新不需要改version)。
  libCacheName, //各种引用库的资源 不常变，可以通过更改version实现更新。
  markdownCacheName, //文章资源 根据规则变
  imageCacheName //图片资源，由于没办法完全从链接判断是否为图片，回包后再判断是否为图片，然后缓存
];
//正则匹配缓存文件
var regDict = {};

regDict[markdownCacheName] = /\.md$|\.md\?[^?]+$/;
regDict[libCacheName] = /\.js$|\.css$|\.html$|\.woff|\.woff2|\.ico$/;


//安装文件
var FILES = [
  '/',
  '/index.html',
  '/source/lib/bootstrap-custom/css/custom.bootstrap.css',
  '/source/lib/blog.css',
  '/source/lib/bcd.min.js',
  '/source/dist/index.js'
];

//Service Worker安装事件，其中可以预缓存资源
self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(caches.open(businessCacheName).then(function (cache) {
    return cache.addAll(FILES);
  }).then(function () {
    console.log('[ServiceWorker] Skip waiting on install');
    return self.skipWaiting();
  }));
});

//Service Worker激活事件
self.addEventListener('activate', function (event) {

  self.clients.matchAll({
    includeUncontrolled: true
  }).then(function (clientList) {
    var urls = clientList.map(function (client) {
      return client.url;
    });
    //如果新sw生效，对其他页面造成影响，这里可以查
    console.log('[ServiceWorker] Matching clients:', urls.join(', '));
  });

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 删除掉当前定义前缀中不在expectedCaches中的缓存集
          // 避免用户存储空间急剧膨胀
          if (nameReg.test(cacheName) && expectedCaches.indexOf(cacheName) == -1) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      //使service worker立马生效，在单页面应用中，这样是合理的
      console.log('[ServiceWorker] Claiming clients for version', version);
      return self.clients.claim();
    }));
});

//Service Worker 请求拦截事件
this.addEventListener('fetch', function(event)  {
  event.respondWith(
    caches.open(businessKey).then(function(cache) {
      return cache.match(event.request.url);
    }).then(function(response){
      //response为空表明未匹配成功，交由fetch方法去网络拉取
      if(response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
