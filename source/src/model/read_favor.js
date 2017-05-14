const m_config = require('model/config');
let storageKey = 'read_favor';
let readFavor = {};
const init = ()=> {
  try{
    readFavor = $.extend({}, BCD.cache.getLocal(storageKey), readFavor);
  }catch(e){}
};

m_config.getConfig.then(()=>{
  storageKey = 'read_favor_' + m_config.username;
  init();
})

const addFavor = (path)=>{
  readFavor[path] = Date.now();
  BCD.cache.setLocal(storageKey, readFavor, {permanent: true});
};

const delFavor = (path)=>{
  if(path in readFavor){
    delete readFavor[path];
    BCD.cache.setLocal(storageKey, readFavor, {permanent: true});
  }
};

const isFavor = (path)=> !!readFavor[path];

BCD.addEvent('favor', function(ele, option, data){
  let article = data;
  if(('idx' in option) && data.list){
    article = data.list[option.idx];
  }
  let favor = isFavor(article.path);
  ele.val(favor);
  if(favor){
    ele.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
  }
  ele.on('click', function(){
    if(ele.val()){
      ele.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
      delFavor(article.path);
      ele.val(false);
    }else{
      ele.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      addFavor(article.path);
      ele.val(true);
    }
  });
});

module.exports = {
  addFavor,
  delFavor,
  isFavor,
  getFavorTime: (path)=> readFavor[path]
};
