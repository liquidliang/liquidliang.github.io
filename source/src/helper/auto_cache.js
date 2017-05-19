//这是个单例

const m_article = require('model/article');
var m_setting = BCD.cache.getLocal('swblog_setting', {autoCache: false});
var btnElement, tipsElement, timer;

m_article.onUpdate(function(){
    if(tipsElement){
        m_article.initArticle.then(function(articleList){
            var noContents = articleList.filter(function(o){
                return !o.content;
            });
            tipsElement.html('已缓存文章：'+(articleList.length - noContents.length)+'篇');
        });
    }
});

//To change status
function changeStatus(status) {
  m_setting.autoCache = status;
  BCD.cache.setLocal('swblog_setting', m_setting, {permanent: true});
  clearTimeout(timer);
  timer = setTimeout(function(){
      m_article.initArticle.then(function(articleList){
          var noContents = articleList.filter(function(o){
              return !o.content;
          });
          tipsElement.html('已缓存文章：'+(articleList.length - noContents.length)+'篇');
          if(m_setting.autoCache){
              m_article.autoLoad();
          }
      });
  }, 5E3);

  if (status) {
    btnElement.removeClass('btn-success').addClass('btn-warning').html('按需缓存');
  } else {
    btnElement.removeClass('btn-warning').addClass('btn-success').html('自动缓存全站');
  }
}


BCD.addEvent('autoCache', function (ele) {
    btnElement = ele;
    tipsElement = ele.prev();
    changeStatus(m_setting.autoCache);
    btnElement.on('click', function(){
        changeStatus(!m_setting.autoCache);
    });
});
