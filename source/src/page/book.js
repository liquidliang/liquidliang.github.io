const s_mainContainer = require('card/common/slidebar_container');
const m_article = require('model/article');
const c_articleList = require('card/blog/article_list');



module.exports = function (page, key) {
  page.html(s_mainContainer);
  let viewContent = page.find('[data-selector="main"]');
  let viewSlidebar = page.find('[data-selector="slidebar"]');
  let slidebar;
  let currentHash;
  viewSlidebar.setView({
    name: 'blog/slidebar',
    template: '<div data-on="?m=mkview"></div>'
  });

  viewContent.setView({
    name: 'blog/blog',
    template: '<div data-on="?m=mkview"></div>'
  });


  page.setView({
    title: m_article.getName(key),
    start: function () {
      if (currentHash !== location.hash) {
        viewContent.empty();
        currentHash = location.hash;
      }
      this.show();
      m_article.getArticleContent(m_article.getSidebarPath(key)).then((data) => {
        let baseHash = '#!/' + BCD.getHash(0);
        if (!slidebar) {
          slidebar = $.extend({}, data);
          let content = slidebar.content || '';
          let chapters = slidebar.chapters = [];

          slidebar.content = content.replace(/<%(([^>]|[^%]>)+)%>/g, function ($0, $1) {
            let item = {};
            let fileName = '';
            if ($1.indexOf(']')>0) { //这种格式：[描述](相对与当前目录的地址)
              let arr = $1.substr(1, $1.length - 2).split(/\]\s*\(/);
              item.title = arr[0] || '';
              item.href  = baseHash + '/' + (arr[1] || '');
              fileName = arr[1];
            } else {
              item.title = $1;
              item.href = baseHash + '/' + $1 + '.md';
              fileName = $1 + '.md';
            }
            if(m_article.hasArticle(key+'/'+fileName)){
              chapters.push(item);
            }
            return '<a data-on="?m=replaceHash" data-url="' + item.href + '">' + item.title + '</a>';
          });
          viewSlidebar.reset(slidebar);
          setTimeout(function () {
            viewSlidebar.bindEvent();
          });
        }
        let fileName = key + location.hash.replace(baseHash, '');
        if (m_article.hasArticle(fileName)) {
          m_article.getArticleContent(fileName).then((data) => {
            viewContent.reset(data);
          });
        } else if (slidebar.chapters[0]) {
          return BCD.replaceHash(slidebar.chapters[0].href);
        } else {
          viewContent.reset({

          });
        }
      });
    }
  })
};
