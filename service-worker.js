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

  // self.clients.matchAll({
  //   includeUncontrolled: true
  // }).then(function (clientList) {
  //   var urls = clientList.map(function (client) {
  //     return client.url;
  //   });
  //   //如果新sw生效，对其他页面造成影响，这里可以查
  //   console.log('[ServiceWorker] Matching clients:', urls.join(', '));
  // });

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


var getNoSearch = function (url) {
  return url.replace(/\?[^?]+/, '');
}

function _fetch(url, timeout) {
  var abort_fn = null;
  var fetch_promise = fetch(url);

  //这是一个可以被reject的promise
  var abort_promise = new Promise(function (resolve, reject) {
    abort_fn = function () {
      reject(new Error('fetch timeout!'));
    };
  });

  //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
  var abortable_promise = Promise.race([
    fetch_promise,
    abort_promise
  ]);

  setTimeout(function () {
    abort_fn();
  }, timeout || 2E3);

  return abortable_promise;
}
//更新缓存
var addToCache = function (dbName, req, response) {
  return _fetch(req.clone()).then(function (resp) {
    if (resp.type !== 'basic' && resp.type !== 'cors') {
      return resp;
    }

    if (resp.status !== 200) {
      throw new Error('response status is ' + resp.status);
    }
    var contentType = resp.headers.get('content-type');
    if (contentType.indexOf('text/html') > -1) {
      //避免缓存了上网时需要先登录的页面
      var arr = req.url.match(/\.[a-z]+$/);
      if (arr) {
        var ext = arr[0].substr(1);
        if (ext != 'html') {
          throw new Error('response content-type is ' + contentType);
        }
      }
    }

    var cacheResp = resp.clone();
    if (dbName === imageCacheName && !/^image\//.test(contentType)) {
      return resp;
    }
    // caches.open(dbName).then(function (cache) {
    //   //删除旧文件
    //   cache.keys().then(function (oldReqList) {
    //     if (req.url.indexOf('?') > 0) {
    //       let urlKey = getNoSearch(req.url) + '?';
    //       oldReqList.filter(oldReq => oldReq.url.indexOf(urlKey) > -1).forEach(function (oldReq) {
    //         cache.delete(oldReq);
    //       });
    //     }
    //     //添加新文件
    //     cache.put(req.clone(), cacheResp);
    //   });
    // });

    return resp;
  }).catch(function (error) {
    if (response) { //请求失败用缓存保底
      console.log(`[ServiceWorker] fetch failed (${ req.url }) and use cache`, error);
      return response;
    } else {
      return caches.open(dbName).then(function (cache) {
        //取旧缓存
        let urlKey = getNoSearch(req.url);
        return cache.keys().then(function (oldReqList) {
          let oldReq;
          while (oldReq = oldReqList.pop()) {
            if (oldReq.url.indexOf(urlKey) > -1) {
              return cache.match(oldReq)
            }
          }
          return null;
        });
      }).then(function (resp) {
        if (resp) {
          console.log(`[ServiceWorker] fetch failed (${ req.url }) and use old cache`, error);
          return resp;
        }
        // Respond with a 400 "Bad Request" status.
        console.log(`[ServiceWorker] fetch failed: ${ req.url }`, error);
        return new Response(new Blob, {
          'status': 400,
          'statusText': 'Bad Request'
        });
      });
    }
  });
};


var fetchCache = function (dbName, req) {
  return caches.open(dbName).then(function (cache) {
    return cache.match(req.clone());
  }).then(function (response) {
    if (response) {
      if (dbName == businessCacheName) {
        addToCache(dbName, req, response); //更新缓存，下次使用
      }
      return response; //如果命中缓存，直接使用缓存.
    } else {
      return addToCache(dbName, req);
    }
  }).catch(function (e) {
    console.log(e);
    return addToCache(dbName, req);
  });
}
self.addEventListener('fetch', function (event) {

  var req, url = event.request.url;
  var requestURL = new URL(url);

  // if (url.indexOf('http:') === 0) {
  //   return event.respondWith(fetch(event.request.clone()));
  // }

  if (requestURL.search.indexOf('cors=1') !== -1) {
    req = new Request(url, {
      mode: 'cors'
    });
  } else {
    req = event.request.clone();
  }

  if (FILES.indexOf(requestURL.pathname) > -1) {
    return event.respondWith(fetchCache(businessCacheName, req));
  }

  for (var dbName in regDict) {
    if (regDict[dbName].test(url)) {
      return event.respondWith(fetchCache(dbName, req));
    }
  }

  if (requestURL.protocol != 'https:' || /\.json$/.test(url)) {
    return;
  }

  return event.respondWith(fetchCache(imageCacheName, req));

});
