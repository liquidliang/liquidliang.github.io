/**
 * @file index 入口文件，路由定义
 * @author ljquan@qq.com
 */

require('helper/common_event.js');
const m_article = require('model/article');
const m_config = require('model/config');
const c_header = require('card/common/navigator');
const c_pageList = require('page/list.js');
const c_pageContent = require('page/content.js');
const c_pageBlog = require('page/blog.js');
const c_pageSearch = require('page/search.js');
let viewHeader = c_header();
$('body').append(viewHeader);

<<<<<<< HEAD
m_config.getConfig(function(){
  BCD.ajaxCache('./json/article.json', function(data) {
    m_article.init(data);
    //入口
    BCD.app({
      setTitle: function(str){
        viewHeader.reset();
        document.title = str;
      },
      initPage: function(key, next) {

        var page = this;
        if(key=='index'){
          c_pageList(page, key);
          next();
        }else if(key=='tag'){
          c_pageList(page, key);
          next();
        }else if(key=='blog'){
          c_pageBlog(page);
          next();
        }else if(key=='search'){
          c_pageSearch(page, key);
          next();
        }else{
          let path = decodeURIComponent(key);
          if(m_article.getCatalog(path)){
            c_pageList(page, path);
            return next();
          }else if(m_article.getArticle(path)){
=======
m_config.getConfig.then(() =>
  m_article.initArticle.then(() =>
    BCD.app({ //入口
      setTitle: function (str) {
        viewHeader.reset();
        document.title = str;
      },
      initPage: function (key, next) {
        var page = this;
        if (key == 'index') {
          c_pageList(page, key);
          next();
        } else if (key == 'tag') {
          c_pageList(page, key);
          next();
        } else if (key == 'blog') {
          c_pageBlog(page);
          next();
        } else if (key == 'search') {
          c_pageSearch(page, key);
          next();
        } else {
          let path = decodeURIComponent(key);
          if (m_article.hasCatalog(path)) {
            c_pageList(page, path);
            return next();
          } else if (m_article.hasArticle(path)) {
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
            c_pageContent(page, path);
            return next();
          }

          BCD.replaceHash(m_config.getIndex());
          next(-1);
        }
      }
<<<<<<< HEAD
    });
  });
})
=======
    })
  )
);
>>>>>>> 743c827c0b021eeef0f5818d82429b7d7238360a
