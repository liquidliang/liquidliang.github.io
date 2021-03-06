/**
 * @file index 入口文件，路由定义
 * @author ljquan@qq.com
 */
//require("babel-polyfill");  //太大了
require("polyfill/");
require('helper/common_event.js');

const m_article = require('model/article');
const m_config = require('model/config');
const c_header = require('card/common/navigator');
const c_pageList = require('page/list.js');
const c_pageBook = require('page/book.js');
const c_pageContent = require('page/content.js');
const c_pageBlog = require('page/blog.js');
const c_pageSearch = require('page/search.js');
const c_setting = require('page/setting.js');
let viewHeader = c_header();
$('body').append(viewHeader);

// setInterval(function(){
//     $.getJSON('/json/console.json', function(list){
//         list = list || [];
//         var item;
//         while(item = list.shift()){
//             console.log('[sw] ' + item);
//         }
//     });
// }, 5E3);

m_config.getConfig.then(() =>
  m_article.initArticle.then(() => {
    viewHeader.reset();
    BCD.app({ //入口
      setTitle: function (str) {
        //viewHeader.reset();
        let navLis = viewHeader.find('.nav li');
        navLis.removeClass('active');
        navLis.each((i, domLi) => {
          let url = $($(domLi).find('a')[0]).attr('data-url') || '';
          if (location.hash.indexOf(url) === 0) {
            $(domLi).addClass('active');
          }
        });
        document.title = str;
      },
      initPage: function (key, next) {
        var page = this;
        if (['index', 'favor', 'tag'].indexOf(key) > -1) {
          c_pageList(page, key);
          next();
      }else if (key == 'setting') {
          c_setting(page);
          next();
        } else if (key == 'blog') {
          c_pageBlog(page);
          next();
        } else if (key == 'search') {
          c_pageSearch(page, key);
          next();
        } else {
          let path = decodeURIComponent(key);
          if (m_article.hasBook(path)) {
            c_pageBook(page, path);
            return next();
          } else if (m_article.hasCatalog(path)) {
            c_pageList(page, path);
            return next();
          } else if (m_article.hasArticle(path)) {
            c_pageContent(page, path);
            return next();
          }

          BCD.replaceHash(m_config.getIndex());
          next(-1);
        }
      }
    });
  })
);
