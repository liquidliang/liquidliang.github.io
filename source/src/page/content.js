//有侧边栏的内容展示

const c_mainContainer = require('card/common/main_container');
const c_footer = require('card/common/footer');
const m_article = require('model/article');
<<<<<<< HEAD
=======
const m_readHistory = require('model/read_history');
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
const c_pannelList = require('card/blog/pannel_list');
const c_content = require('card/blog/content');
const m_initOption = require('helper/init_option');



module.exports = function(page, key) {
  let viewBody = c_mainContainer();
  let viewContent = viewBody.find('[data-selector="main"]');
  let viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
  viewContent.setView(c_content({
    delay: true
  }));
  viewBody.addView(viewContent);
  viewBody.addView(viewPannelList);

  let viewFoot = c_footer();
  page.setView({
    start: function(hasRender){
      if(hasRender){
        return m_initOption.notRender(hasRender);
      }
<<<<<<< HEAD
      if(m_article.getArticle(key)){
        m_article.getArticleContent(key).then((data)=>{
=======
      if(m_article.hasArticle(key)){
        m_article.getArticleContent(key).then((data)=>{
          m_readHistory.addHistory(key);
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
          page.setView({title: data.title});
          document.title = data.title;
          viewContent.reset(data);
        });
      }
    },
    viewList: [viewBody, viewFoot]
  })
};
