const m_config = require('model/config');
let storageKey = 'read_history';
let readHistory = {};
const init = ()=> {
  try{
    readHistory = $.extend({}, BCD.cache.getLocal(storageKey), readHistory);
  }catch(e){}
};

const update = ()=>{
  BCD.cache.setLocal(storageKey, readHistory, {permanent: true});
}

const set = (path, obj) => {
  readHistory[path] = $.extend({}, readHistory[path], obj);
  update();
}

m_config.getConfig.then(()=>{
  storageKey = 'read_history_' + m_config.username;
  init();
})

const addHistory = (path)=>{
  set(path, {
    time: Date.now()
  });
};

BCD.addEvent('article_down', function(ele){
  ele.on('click', function(e){
    ele.hide();
    addHistory(ele.data('url'));
  });
});

module.exports = {
  addHistory,
  hasRead: (path)=> !!readHistory[path],
  getReadTime: (path)=> readHistory[path] && readHistory[path].time,
  setScrollY: (path, y) => {
    set(path, {
      scrollY: y
    });
  },
  getScrollY: (path) => readHistory[path] && readHistory[path].scrollY
};
