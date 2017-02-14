<<<<<<< HEAD
let isInit = false;
let callbackList = [];
=======
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
let arr = location.host.split(".");
let isLocalhost = arr.length === 1;
let username = isLocalhost ? "swblog" : arr[0];
let config = {
  "author": username,
<<<<<<< HEAD
  "logoTitle": username+"的博客",
=======
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
  "nav": [
    ["Home", "#!/index"],
    ["About", "#!/blog/about.md"]
  ]
};
<<<<<<< HEAD
//先用缓存，请求回来再更新
BCD.ajaxCache('./json/config.json', (data) => {
  config = data || config;
  config.logoTitle = config.logoTitle || username+"的博客";
  isInit = true;
  let cb;
  while (cb = callbackList.pop()) {
    cb(config);
  }
  if(config.author){
    return 1; //缓存数据到localStorage
  }
}, 0, 1E3, true);
=======
let searchIssueURL;
let newIssueURL;

const update = ()=>{
  let author = config.author;
  config.logoTitle = config.logoTitle || author+"的博客";
  searchIssueURL = 'https://github.com/'+author+'/'+author+'.github.io/issues?utf8=%E2%9C%93&q=';
  newIssueURL = 'https://github.com/' +author+'/'+author+'.github.io/issues/new?title=';
  if(window.CONFIG){
    CONFIG.username = username = config.author;
  }
};
update();

//先用缓存，请求回来再更新
const getConfig = new Promise((resolve)=>{
  BCD.ajaxCache('./json/config.json', (data) => {
    config = data || config;
    if(config.author){
      update();
      resolve();
      return 1; //缓存数据到localStorage
    }
    resolve();
  }, 0, 1E3, true);
});

>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a



window.CONFIG = module.exports = {
  username,
  getIndex: ()=> config.nav && config.nav[0] && config.nav[0][1] || "",
  isLocalhost,
  getConfigSync: () => config,
<<<<<<< HEAD
  getConfig: (callback) => {
    if (isInit) {
      callback(config);
    } else {
      callbackList.push(callback);
    }
  }
=======
  getConfig,
  getNewIssueURL: (title)=> newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title),
  getSearchIssueURL: (title)=> newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title)
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
};
