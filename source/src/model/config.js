let isInit = false;
let callbackList = [];
let arr = location.host.split(".");
let isLocalhost = arr.length === 1;
let username = isLocalhost ? "swblog" : arr[0];
let config = {
  "author": username,
  "nav": [
    ["Home", "#!/index"],
    ["About", "#!/blog/about.md"]
  ]
};
//先用缓存，请求回来再更新
BCD.ajaxCache('./json/config.json', (data) => {
  config = data || config;
  isInit = true;
  let cb;
  while (cb = callbackList.pop()) {
    cb(config);
  }
  if(config.author){
    return 1; //缓存数据到localStorage
  }
}, 0, 1E3, true);



module.exports = {
  username,
  isLocalhost,
  getConfigSync: () => config,
  getConfig: (callback) => {
    if (isInit) {
      callback(config);
    } else {
      callbackList.push(callback);
    }
  }
};
