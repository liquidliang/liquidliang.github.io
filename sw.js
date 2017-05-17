var version = 'v22';
var namePrefix = 'swblog-';
var nameReg = new RegExp('^' + namePrefix);
var businessKey = 'business-' + version;
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
var consoleList = [];

var matchAll = self.clients.matchAll || function(){
    return self.clients.getAll.call(this);//低版本TBS，没有matchAll
};



self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(caches.open(businessCacheName).then(function (cache) {
    return cache.addAll(FILES);
  }).then(function () {
    console.log('[ServiceWorker] Skip waiting on install');
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (event) {
  // console.log('self.clients.matchAll', !!self.clients.matchAll);
  // matchAll.call(clients, {
  //   includeUncontrolled: true
  // }).then(function (clientList) {
  //   var urls = clientList.map(function (client) {
  //     return client.url;
  //   });
  //   //如果新sw生效，对其他页面造成影响，这里可以查
  //   console.log('[ServiceWorker] Matching clients:', urls.join(', '));
  // });

  try{
      matchAll.call(clients).then(function (clientList) {
          try{
              consoleLog('activate clientList:', clientList);
              consoleLog('activate clientList.length:', clientList.length);
              consoleLog('activate clientList[0]:', clientList[0]);
              consoleLog('activate Object.keys(clientList):', Object.keys(clientList));
              clientList.forEach(function(client){
                  consoleLog('activate client.url:', client.url);
                  consoleLog('activate client.id:', client.id);
                  consoleLog('activate client.postMessage:', client.postMessage);
                  consoleLog('activate client.focus:', client.focus);
                  consoleLog('activate client.frameType:', client.frameType);
                  client.postMessage(JSON.stringify({
                    cbid: 'hello',
                    resp: {a:1}
                  }));
              });

          }catch(e){
              consoleLog('activate clientList error:', e.message, e.stack);
          }

        });
  }catch(e){
      consoleLog('activate matchAll.call error:', e.message, e.stack);
  }

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 删除掉当前定义前缀中不在expectedCaches中的缓存集
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
    caches.open(dbName).then(function (cache) {
      //删除旧文件
      cache.keys().then(function (oldReqList) {
        if (req.url.indexOf('?') > 0) {
          var urlKey = getNoSearch(req.url) + '?';
          oldReqList.filter(function(oldReq) {
            return oldReq.url.indexOf(urlKey) > -1;
          }).forEach(function(oldReq) {
            cache.delete(oldReq);
          });
        }
        //添加新文件
        cache.put(req.clone(), cacheResp);
      });
    });

    return resp;
  }).catch(function (error) {
    if (response) { //请求失败用缓存保底
      console.log('[ServiceWorker] fetch failed ('+req.url+') and use cache', error);
      return response;
    } else {
      return caches.open(dbName).then(function (cache) {
        //取旧缓存
        var urlKey = getNoSearch(req.url);
        return cache.keys().then(function (oldReqList) {
          var oldReq;
          while (oldReq = oldReqList.pop()) {
            if (oldReq.url.indexOf(urlKey) > -1) {
              return cache.match(oldReq)
            }
          }
          return null;
        });
      }).then(function (resp) {
        if (resp) {
          console.log('[ServiceWorker] fetch failed ('+req.url+') and use old cache', error);
          return resp;
        }
        // Respond with a 400 "Bad Request" status.
        console.log('[ServiceWorker] fetch failed ('+req.url+')', error);
        return new Response(new Blob, {
          'status': 400,
          'statusText': 'Bad Request'
        });
      });
    }
  });
};


var fetchCache = function (dbName, req) {
    return fetch(req);
  // return caches.open(dbName).then(function (cache) {
  //   return cache.match(req.clone());
  // }).then(function (response) {
  //   if (response) {
  //     if (dbName == businessCacheName) {
  //       addToCache(dbName, req, response); //更新缓存，下次使用
  //     }
  //     return response; //如果命中缓存，直接使用缓存.
  //   } else {
  //     return addToCache(dbName, req);
  //   }
  // }).catch(function (e) {
  //   console.log(e);
  //   return addToCache(dbName, req);
  // });
}

var consoleFetch = false;
setTimeout(function(){
    consoleFetch = true;
}, 5E3);

self.addEventListener('fetch', function (event) {

  var req, url = event.request.url;
  var requestURL = new URL(url);

  // if (url.indexOf('http:') === 0) {
  //   return event.respondWith(fetch(event.request.clone()));
  // }

    if(consoleFetch){
        return event.respondWith(new Response(JSON.stringify(consoleList), {
            url: url,
            'status': 200,
            'statusText': 'ok'
        }));
    }


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


function iterator(originList, callback) {
  if (originList && originList.length) {
    var list = originList.slice();
    var item = list.shift();
    var next = function () {
      iterator(list, callback);
    };
    callback(item, next, list);
  }
}
//dict格式：{url: resp.text()}
var getTexts = function (dict) {
  var pList = [];
  var urlList = [];
  for (var key in dict) {
    pList.push(dict[key]);
    urlList.push(key);
  }
  return Promise.all(pList).then(function (tList) {
    var rDict = {};
    tList.forEach(function (t, i) {
      rDict[urlList[i]] = t;
    });
    return rDict;
  })
}

//静态资源预加载（不支持返回内容与search参数相关的接口预加载）
var preloadList = function (urlList) {
  var retDict = {};
  return new Promise(function (resolve) {
    if (urlList.length === 0) {
      return setTimeout(function(){
          resolve(regDict);
      }, 300);
    }
    iterator(urlList, function (url, next, list) {
      var myRequest = new Request(url);
      for (var dbName in regDict) {
        if (regDict[dbName].test(url)) {
          caches.open(dbName).then(function (cache) {
            return cache.match(myRequest.clone());
          }).then(function (response) {
            if (response) {
              return response;
            } else {
              return addToCache(dbName, myRequest);
            }
          }).then(function (resp) {
            if (resp.status == 200) {
              retDict[url] = resp.text();
            }
            if (list.length) {
              setTimeout(next, 10);
            } else {
              getTexts(retDict).then(resolve);
            }
          });
          break;
        }
      }
    });
  });
};

var preloadAtricle = function (urlList, callback, option) {
  var urlDict = {};
  var noSearchDict = {};
  var needReloadList = [];
  var retDict = {};
  urlList.forEach(function (o) {
    var url = new Request(o).url;
    noSearchDict[getNoSearch(url)] = 1;
    urlDict[url] = 1;
  });

  return caches.open(markdownCacheName).then(function (cache) {
    //取旧缓存
    // var urlKey = req.url.replace(/\?[^?]+/,'');
    // if(oldReq.url.indexOf(urlKey) > -1){
    //   return cache.match(oldReq)
    // }
    return cache.keys().then(function (reqList) {
      var oldReq;
      while (oldReq = reqList.pop()) {
        var noSearchURL = getNoSearch(oldReq.url);
        if (urlDict[oldReq.url]) {
          delete noSearchDict[noSearchURL];
          retDict[oldReq.url] = cache.match(oldReq).then(function (resq) {
            return resq && resq.text();
          });
          delete urlDict[oldReq.url];
        } else if (noSearchDict[getNoSearch(oldReq.url)]) {
          retDict[oldReq.url] = cache.match(oldReq).then(function (resq) {
            return resq && resq.text();
          });
        }
      }
      for (var url in urlDict) {
        needReloadList.push(url);
      }
      preloadList(needReloadList).then(callback).then(function (resp) {
        callbackDict.preloadAtricle.push(option);
        sendMessage(resp);
      });
      return getTexts(retDict);
    });
  });
};



//sw与页面通信,必须返回promise
function _processMessage(msgObj, option) {
  var resolveFun = function (result) {
    return {
      m: msgObj.m,
      result: result
    }
  };
  try {
    switch (msgObj.m) {
    case 'preload': //arr
      return preloadList(msgObj.data).then(resolveFun);
    case 'showNotification': //arr
      return sendNote(msgObj.data);
    case 'preloadAtricle': //arr
      return preloadAtricle(msgObj.data, resolveFun, option).then(resolveFun);
    case 'delete_not_exist_article': //dict
      var articleDict = msgObj.data;
      if (!articleDict) {
        return new Promise(function (r) {
          r();
        });
      }
      return caches.open(markdownCacheName).then(function (cache) {
        //删除不存在的博客文件
        cache.keys().then(function (oldReqList) {
          oldReqList.forEach(function(oldReq){
            var urlKey = decodeURI(oldReq.url.replace(/\?[^?]+/, ''));
            if (!articleDict[urlKey]) {
              cache.delete(oldReq);
            }
          });
        });
      });
    default:
      return new Promise(function (resolve) {
        resolve(console.log('msgObj.m=' + msgObj.m + ' match nothing!'));
      });
    }
  } catch (e) {
    console.log('_processMessage', e.stack);
  }
}

var callbackDict = {};
function consoleLog() {
  // callbackDict['log'] = [{
  //   cbid: 'log'
  // }];
  // sendMessage({
  //   m: 'log',
  //   result: [].concat.apply(['[service]'], arguments)
  // })
  consoleList.push([].slice.call(arguments).join(' '));
}

function sendMessage(resp) {
  if (!(resp && resp.m)) {
    return new Promise(function (r) {
      r();
    });
  }
  var callbackList = callbackDict[resp.m] || [];
  callbackDict[resp.m] = [];
  return matchAll.call(clients)
    .then(function (clientList) {
      var option = {};
      console.log('callbackList.length', callbackList.length);
      while (option = callbackList.pop()) {
        if (!option.cbid) {
          continue;
        }
        if (!option.senderID) {
          if (option.cbid != 'log') {
            console.log('event.source is null; we don\'t know the sender of the ' +
              'message');
          }
          try {
            clientList.forEach(function (client) {
              client.postMessage(JSON.stringify({
                cbid: option.cbid,
                resp: resp.result
              }));
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          clientList.some(function (client) {
            // Skip sending the message to the client that sent it.
            if(!client.id){
                client.postMessage(JSON.stringify({
                  cbid: option.cbid,
                  resp: resp.result
                }));
                return false;
            }
            if (client.id === option.senderID) {
              client.postMessage(JSON.stringify({
                cbid: option.cbid,
                resp: resp.result
              }));
              return true;
            }
          });
        }
      }
    });
}

// Listen for messages from clients.
self.addEventListener('message', function (event) {
  // Get all the connected clients and forward the message along.
  var msgObj = event.data || {};
  var senderID = event.source ? event.source.id : null; //在低版本中可能没有“source”属性
  var option = {
    m: msgObj.m,
    cbid: msgObj.cbid,
    senderID: senderID
  }
  var promise;
  if (callbackDict[msgObj.m] && callbackDict[msgObj.m].length) {
    callbackDict[msgObj.m].push(option);
  } else {
    callbackDict[msgObj.m] = [option];
    promise = event.waitUntil(_processMessage(msgObj, option).then(sendMessage));
  }

  // If event.waitUntil is defined (not yet in Chrome because of the same issue detailed before),
  // use it to extend the lifetime of the Service Worker.
  if (event.waitUntil) {
    event.waitUntil(promise);
  }
});


function sendNote(message) {
  console.log('send Note');
  var title = message || 'No message.';
  var body = '这是一个测试信息';
  var icon = '/images/logo/logo072.png';
  var tag = 'simple-push-demo-notification-tag' + Math.random();
  var data = {
    doge: {
      wow: 'such amaze notification data'
    }
  };
  return self.registration.showNotification(title, {
    body: body,
    icon: icon,
    tag: tag,
    data: data,
    image: '/images/onion.png',
    actions: [{
      action: "open",
      title: "打开",
      icon: '/images/toolbar-icons/forward.png'
    }]
  }).then(function () {
    return {
      m: 'showNotification'
    }
  });
}
// triggered everytime, when a push notification is received.
self.addEventListener('push', function (event) {

  console.info('Event: Push', event);
  var message = event.data.text();

  event.waitUntil(
    sendNote(message)
  );
});

function focusOpen() {
  var url = location.href;
  return matchAll.call(clients, {
    type: 'window',
    includeUncontrolled: true
  }).then(function(clients){
    for (var i=0; i < clients.length; i++) {
      var client = clients[i];
      if (client.url = url) return client.focus(); // 经过测试，focus 貌似无效
    }
    console.log('not focus');
    clients.openWindow(location.origin + '/');
  });
}

self.addEventListener('notificationclick', function (event) {

  event.notification.close(); //Close the notification
  var messageId = event.notification.data;
  // Open the app and navigate to latest.html after clicking the notification
  console.log('notificationclick action=', event.action);
  if (event.action === "open") {
    return event.waitUntil(clients.openWindow(location.origin + '/#!/index'));
  }
  event.waitUntil(focusOpen());
});
