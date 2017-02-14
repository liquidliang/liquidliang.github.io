//针对导航的，没有侧边栏的内容展示

const c_mainContainer = require('card/common/main_container');
const c_footer = require('card/common/footer');
const m_article = require('model/article');
const m_initOption = require('helper/init_option');



module.exports = function(page) {
  let viewBody = $('<div class="container" style="min-height:'+((window.innerHeight||640) -200)+'px"/>').setView({
   name: 'blog/blog',
   delay: true,
   template: '<div data-on="?m=mkview"></div>'
 });

  let viewFoot = c_footer();
  page.setView({
    start: function(hasRender){
      if(hasRender && BCD.history.getCode()==-1){
        return m_initOption.notRender(hasRender);
      }
      let key = location.hash.replace('#!/', '');
<<<<<<< HEAD
      if(m_article.getArticle(key)){
=======
      if(m_article.hasArticle(key)){
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
        m_article.getArticleContent(key).then((data)=>{
          page.setView({title: data.title});
          document.title = data.title;
          viewBody.reset(data);
        });
      }
    },
    viewList: [viewBody, viewFoot]
  })
};
