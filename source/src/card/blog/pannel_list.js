const m_article = require('model/article');
<<<<<<< HEAD
const c_pannel = require('card/blog/pannel');
module.exports = (view) => {
  let viewPannelLastPost = c_pannel({
    data: {
      title: '最新文章',
      list: m_article.getLastPost().map(o => {
=======
const m_readHistory = require('model/read_history');
const c_pannel = require('card/blog/pannel');
module.exports = (view) => {
  let viewPannelRecommendPost = c_pannel({
    data: {
      title: '推荐阅读',
      list: m_readHistory.getRecommend().map(o => {
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
        return {
          href: o.href,
          title: o.title,
          time: o.time
        }
      })
    }
  });
  let viewPannelCatalog = c_pannel({
    data: {
      title: '分类',
      list: m_article.getCatalogs().filter(o => o.tagList.length === 1).map(o => {
        return {
          title: o.catalog,
          href: o.href
        }
      })
    }
  });
  let viewPannelTag = c_pannel({
    data: {
      isInline: true,
      title: '标签',
      list: m_article.getTags()
    }
  });

  return view.setView({
<<<<<<< HEAD
    viewList: [viewPannelLastPost, viewPannelCatalog, viewPannelTag]
=======
    viewList: [viewPannelCatalog, viewPannelTag, viewPannelRecommendPost]
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
  });
}
