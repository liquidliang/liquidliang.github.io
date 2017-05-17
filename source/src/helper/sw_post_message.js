const m_util = require('common/util');

let index = 0;
let postMessage = function () {};
let callbackDict = {
  log: function (resp) {
    console.log.apply(this, resp);
    return true;
  }
};

if (navigator.serviceWorker) {
  window.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);
    var cbid = data.cbid,
      resp = data.resp;
    if (cbid && callbackDict[cbid]) {
      console.log('[client] window message:' + cbid);
      if (!callbackDict[cbid](resp)) {
        delete callbackDict[cbid];
      }
    }
  });
  navigator.serviceWorker.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);
    var cbid = data.cbid,
      resp = data.resp;
    if (cbid && callbackDict[cbid]) {
      console.log('[client] serviceWorker message:' + cbid);
      if (!callbackDict[cbid](resp)) {
        delete callbackDict[cbid];
      }
    }
    m_util.stopBubble(event);
  }); //页面通过监听service worker的message事件接收service worker的信息
  postMessage = function (req, callback) {
    if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.state == 'activated') {
      console.log('postMessage');
      index++;
      let obj = {
        m: req.m,
        data: req.data
      };
      if (callback) {
        obj.cbid = req.m + '_' + index;
        callbackDict[obj.cbid] = callback;
      }
      navigator.serviceWorker.controller.postMessage(obj); //页面向service worker发送信息
    }
  }
}


module.exports = postMessage; //postMessage(message, callback)
