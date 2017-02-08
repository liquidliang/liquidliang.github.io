const c_mainContainer = require('card/common/main_container');
const c_footer = require('card/common/footer');
const m_article = require('model/article');
const c_content = require('card/blog/content');
const m_initOption = require('helper/init_option');



module.exports = function(page, key) {
  let viewBody = $('<div class="container" style="min-height:'+((window.innerHeight||640) -200)+'px"/>').setView({
   name: 'blog/blog',
   delay: true,
   template: '<div data-on="?m=mkview"></div>'
 });

  let viewFoot = c_footer();
  page.setView({
    start: function(hasRender){
      if(hasRender){
        return m_initOption.notRender(hasRender);
      }
      if(m_article.getArticle(key)){
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
