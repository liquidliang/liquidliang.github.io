/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * @file index 入口文件，路由定义
	 * @author ljquan@qq.com
	 */
	//require("babel-polyfill");  //太大了
	__webpack_require__(1);
	// require('helper/common_event.js');
	// require('helper/notification.js');
	// const m_article = require('model/article');
	// const m_config = require('model/config');
	// const c_header = require('card/common/navigator');
	// const c_pageList = require('page/list.js');
	// const c_pageBook = require('page/book.js');
	// const c_pageContent = require('page/content.js');
	// const c_pageBlog = require('page/blog.js');
	// const c_pageSearch = require('page/search.js');
	// let viewHeader = c_header();
	// $('body').append(viewHeader);
	//
	// m_config.getConfig.then(() =>
	//   m_article.initArticle.then(() => {
	//     viewHeader.reset();
	//     BCD.app({ //入口
	//       setTitle: function (str) {
	//         //viewHeader.reset();
	//         let navLis = viewHeader.find('.nav li');
	//         navLis.removeClass('active');
	//         navLis.each((i, domLi) => {
	//           let url = $($(domLi).find('a')[0]).attr('data-url') || '';
	//           if (location.hash.indexOf(url) === 0) {
	//             $(domLi).addClass('active');
	//           }
	//         });
	//         document.title = str;
	//       },
	//       initPage: function (key, next) {
	//         var page = this;
	//         if (['index', 'favor', 'tag'].indexOf(key) > -1) {
	//           c_pageList(page, key);
	//           next();
	//         }else if (key == 'subscribe') {
	//           page.addClass('text-center').html('<p style="margin-top: 100px;">'+
	//           (window.Notification ? '您已禁止了通知，请重新设置' : '您的浏览器不支持该特性，请使用最新的Chrome浏览器') + '</p>'+
	//           '<button style="margin-top: 10px;padding-left: 50px;padding-right: 50px;"'+
	//           ' data-on="?m=subscribePush"'+
	//           ' class="btn btn-warning btn-lg">订阅</button>');
	//           next();
	//         } else if (key == 'blog') {
	//           c_pageBlog(page);
	//           next();
	//         } else if (key == 'search') {
	//           c_pageSearch(page, key);
	//           next();
	//         } else {
	//           let path = decodeURIComponent(key);
	//           if (m_article.hasBook(path)) {
	//             c_pageBook(page, path);
	//             return next();
	//           } else if (m_article.hasCatalog(path)) {
	//             c_pageList(page, path);
	//             return next();
	//           } else if (m_article.hasArticle(path)) {
	//             c_pageContent(page, path);
	//             return next();
	//           }
	//
	//           BCD.replaceHash(m_config.getIndex());
	//           next(-1);
	//         }
	//       }
	//     });
	//   })
	// );

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	if (!Array.from) {
	  Array.from = function (arr) {
	    for (var i = 0, arr2 = []; i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	    return arr2;
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	if (!window.Set) {
	
	    var Set = function Set(list) {
	        Array.call(this);
	        list = list || [];
	        for (var i = 0; i < list.length; i++) {
	            this.add(list[i]);
	        }
	    };
	
	    Set.prototype = Object.create(Array.prototype);
	
	    // 集合添加元素
	    Set.prototype.add = function (data) {
	        if (this.indexOf(data) < 0) {
	            this.push(data);
	            return true;
	        }
	        return false;
	    };
	
	    // 删除集合中的元素
	    Set.prototype.delete = function (data) {
	        var pos = this.indexOf(data);
	        if (pos > -1) {
	            this.splice(pos, 1);
	            return true;
	        }
	        return false;
	    };
	
	    // 判断集合是否包括元素
	    Set.prototype.has = function (data) {
	        if (this.indexOf(data) > -1) {
	            return true;
	        }
	        return false;
	    };
	    // 获取集合的大小
	    Set.prototype.size = function () {
	        return this.length;
	    };
	
	    // 清除set集合。
	    Set.prototype.clear = function (set) {
	        while (this.pop()) {}
	    };
	
	    Set.prototype.values = function () {
	        return;
	    };
	    window.Set = Set;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	if (!Object.assign) {
	  Object.assign = $.extend;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map