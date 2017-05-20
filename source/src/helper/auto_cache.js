//这是个单例

const m_article = require('model/article');
var m_setting = require('model/setting');
var btnElement, tipsElement, timer;

function updateTips(articleList){
  var noContents = articleList.filter(function(o){
      return !o.content;
  });
  tipsElement.html('已缓存文章：'+(articleList.length - noContents.length)+ '/' + articleList.length + '篇');
}

m_article.onUpdate(function(){
    if(tipsElement){
        m_article.initArticle.then(updateTips);
    }
});

//To change status
function changeStatus(status) {
  m_setting.set('autoCache', status);
  clearTimeout(timer);
  timer = setTimeout(function(){
      m_article.initArticle.then(function(articleList){
          updateTips(articleList);
          if(m_setting.get('autoCache')){
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
    changeStatus(m_setting.get('autoCache'));
    btnElement.on('click', function(){
        changeStatus(!m_setting.get('autoCache'));
    });
});
