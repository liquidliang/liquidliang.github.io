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

	'use strict';
	
	/**
	 * @file index 入口文件，路由定义
	 * @author ljquan@qq.com
	 */
	//require("babel-polyfill");  //太大了
	__webpack_require__(1);
	__webpack_require__(5);
	
	var m_article = __webpack_require__(11);
	var m_config = __webpack_require__(14);
	var c_header = __webpack_require__(21);
	var c_pageList = __webpack_require__(22);
	var c_pageBook = __webpack_require__(30);
	var c_pageContent = __webpack_require__(32);
	var c_pageBlog = __webpack_require__(34);
	var c_pageSearch = __webpack_require__(35);
	var c_setting = __webpack_require__(37);
	var viewHeader = c_header();
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
	
	m_config.getConfig.then(function () {
	  return m_article.initArticle.then(function () {
	    viewHeader.reset();
	    BCD.app({ //入口
	      setTitle: function setTitle(str) {
	        //viewHeader.reset();
	        var navLis = viewHeader.find('.nav li');
	        navLis.removeClass('active');
	        navLis.each(function (i, domLi) {
	          var url = $($(domLi).find('a')[0]).attr('data-url') || '';
	          if (location.hash.indexOf(url) === 0) {
	            $(domLi).addClass('active');
	          }
	        });
	        document.title = str;
	      },
	      initPage: function initPage(key, next) {
	        var page = this;
	        if (['index', 'favor', 'tag'].indexOf(key) > -1) {
	          c_pageList(page, key);
	          next();
	        } else if (key == 'setting') {
	          c_setting(page);
	          next();
	        } else if (key == 'blog') {
	          c_pageBlog(page);
	          next();
	        } else if (key == 'search') {
	          c_pageSearch(page, key);
	          next();
	        } else {
	          var path = decodeURIComponent(key);
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
	  });
	});

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(6);
	//data-on="?m=go" data-url="<%=o.href%>"
	
	function onClick(name, fun) {
	  if (fun) {
	    BCD.addEvent(name, function (ele, option, data) {
	      ele.on('click', function (e) {
	        fun(ele, option, data);
	        m_util.stopBubble(e);
	      });
	    });
	  }
	}
	
	var go = function go(ele, option, data) {
	  BCD.go(ele.data('url'));
	};
	onClick('go', go);
	//data-on="?m=back"
	var back = function back(ele, option, data) {
	  history.back();
	};
	onClick('back', back);
	
	var replaceHash = function replaceHash(ele, option, data) {
	  BCD.replaceHash(ele.data('url'));
	};
	onClick('replaceHash', replaceHash);
	//事件绑定
	module.exports = {
	  onClick: onClick,
	  go: go,
	  back: back,
	  replaceHash: replaceHash
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_event = __webpack_require__(7);
	var getTime = function getTime(date) {
	  date = new Date(date);
	  var now = new Date();
	  var diff = now - date;
	  switch (true) {
	    case diff < 6E4:
	      return '刚刚';
	    case diff < 36E5:
	      return Math.round(diff / 6E4) + '分钟前';
	    case diff < 864E5:
	      return Math.round(diff / 36E5) + '小时前';
	    case diff < 1728E5 && now.getDate() - date.getDate() != 2:
	      return '昨天';
	    case date.getFullYear() === new Date().getFullYear():
	      return BCD.time.formatDate(date, "%M月%d日");
	    default:
	      return BCD.time.formatDate(date, "%y年%M月%d日");
	  }
	};
	
	var leftFillString = function leftFillString(num, length) {
	  return ("0000000000" + num).substr(-length);
	};
	var getRandomName = function getRandomName() {
	  return ("aaaaaaaaaa" + Math.random().toString(36).replace(/[.\d]/g, '')).substr(-10);
	};
	
	//https://developers.google.com/web/tools/lighthouse/audits/date-now
	var _date = window.performance || Date;
	module.exports = {
	  getTime: getTime,
	  leftFillString: leftFillString,
	  getRandomName: getRandomName,
	  stopBubble: m_event.stopBubble,
	  stopBubbleEx: m_event.stopBubbleEx,
	  now: function now() {
	    return _date.now();
	  },
	  load: __webpack_require__(8),
	  dom: __webpack_require__(9),
	  iterator: __webpack_require__(10)
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * @module {Object} event  事件相关的处理函数
	 * @return {object} 方法集合
	 * @property {function} stopBubble 停止冒泡并禁止默认事件
	 * @property {function} stopBubbleEx 停止冒泡
	 * @author ljquan@qq.com
	 */
	
	module.exports = {
	    /**
	     * 停止冒泡并禁止默认事件
	     * @param  {event} e 事件
	     * @return {null}
	     */
	    stopBubble: function stopBubble(e) {
	        if (e && e.stopPropagation) {
	            e.stopPropagation();
	        }
	        e.preventDefault();
	    },
	    /**
	     * 停止冒泡
	     * @param  {event} e 事件
	     * @return {null}
	     */
	    stopBubbleEx: function stopBubbleEx(e) {
	        if (e && e.stopPropagation) {
	            e.stopPropagation();
	        }
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var scriptDict = {};
	window.LOAD_CALLBACK = function (ele, callback) {
	  console.log(arguments);
	};
	
	module.exports = function (list, callback) {
	  var promiseLoad = new Promise(function (resolve) {
	    if (!callback) {
	      callback = resolve;
	    }
	  });
	  var head = document.getElementsByTagName('head')[0];
	  var loadList = [];
	  if (BCD.is.s(list)) {
	    list = [list];
	  }
	  list = list.map(function (src) {
	    src = BCD.url.abs(src);
	    if (!scriptDict[src]) {
	      loadList.push(src);
	    }
	    return src;
	  });
	
	  if (loadList.length) {
	    loadList.forEach(function (src) {
	      var loadDom = void 0;
	      if (/\.js$/.test(src)) {
	        loadDom = document.createElement('script');
	        loadDom.type = 'text/javascript';
	        loadDom.charset = 'utf-8';
	        loadDom.async = false;
	        loadDom.src = src;
	      } else {
	        loadDom = document.createElement('link');
	        loadDom.rel = 'stylesheet';
	        loadDom.href = src;
	      }
	
	      loadDom.onload = function () {
	        scriptDict[src] = true;
	        if (loadList.every(function (src) {
	          return scriptDict[src];
	        })) {
	          callback(list.map(function (src) {
	            return scriptDict[src];
	          }));
	        }
	      };
	      head.appendChild(loadDom);
	    });
	  } else {
	    callback(list.map(function (src) {
	      return scriptDict[src];
	    }));
	  }
	  return promiseLoad;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	  getWindowHeight: function getWindowHeight() {
	    return window.innerHeight || window.clientHeight;
	  },
	  getWindowWidth: function getWindowWidth() {
	    return window.innerWidth;
	  },
	  getPageHeight: function getPageHeight() {
	    return document.body.scrollHeight || document.documentElement.scrollHeight;
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function iterator(originList, callback) {
	  if (originList && originList.length) {
	    var list = originList.slice();
	    var item = list.shift();
	    var next = function next() {
	      iterator(list, callback);
	    };
	    callback(item, next, list);
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var m_util = __webpack_require__(6);
	var m_search = __webpack_require__(12);
	var m_readHistory = __webpack_require__(13);
	var m_readFavor = __webpack_require__(15);
	var m_setting = __webpack_require__(16);
	var swPostMessage = __webpack_require__(17);
	var m_ability = __webpack_require__(18);
	var m_promiseAjax = __webpack_require__(19);
	var m_loadJS = __webpack_require__(20);
	var catalogList = []; //目录列表
	var catalogDict = {};
	var articleList = []; //文件列表
	var articleDict = {};
	var sidebarList = []; //sidebar文件列表(sidebar文件也可以在articleDict中索引到)
	var bookList = []; //书籍列表
	var bookDict = {};
	var tagList = [];
	var startTime = m_util.now();
	var isPreload = false;
	var markdownCacheName = 'swblog-markdown';
	var sidebarName = '$sidebar$';
	var getSidebarPath = function getSidebarPath(path) {
	  return path + '/' + sidebarName + '.md';
	};
	var articleModel = new BCD.Model(articleDict);
	
	BCD.addEvent('mkview', function (ele, option, data) {
	  var name = m_util.getRandomName();
	  var result = void 0;
	  if ('idx' in option) {
	    var item = data.list[option.idx];
	    result = item.summary;
	    if (result.length < item.content.length) {
	      result += '...';
	    }
	  } else {
	    result = data.content;
	  }
	
	  ele.attr('id', name);
	  ele.showParentView(); //dom元素展示出来之后再绑定，不然流程图等会有样式问题
	  m_loadJS.then(function () {
	    editormd.markdownToHTML(name, {
	      markdown: result, //+ "\r\n" + $("#append-test").text(),
	      // htmlDecode: true, // 开启 HTML 标签解析，为了安全性，默认不开启
	      htmlDecode: "style,script,iframe", // you can filter tags decode
	      //toc             : false,
	      tocm: true, // Using [TOCM]
	      //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
	      //gfm             : false,
	      //tocDropdown     : true,
	      // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
	      emoji: true,
	      taskList: true,
	      tex: true, // 默认不解析
	      flowChart: true, // 默认不解析
	      sequenceDiagram: true // 默认不解析
	    });
	
	    var innerHtml = ele.html();
	    if (/(<br>|<p><\/p>){2,}/.test(innerHtml)) {
	      ele.html(innerHtml.replace(/(<br>|<p><\/p>){2,}/, ''));
	    }
	
	    if (result.indexOf('[TOC]') > -1 && location.hash.indexOf('.md') > 0) {
	      (function () {
	        //兼容TOC目录
	        var baseHash = location.hash.replace(/\.md\/.*/, '.md');
	        ele.html(ele.html().replace(/href="#([^"]*)/g, function ($0, $1) {
	          if ($1) {
	            return 'href="' + baseHash + '/' + $1;
	          }
	          return $0;
	        }).replace(/name="([^"]*)/g, function ($0, $1) {
	          if ($1) {
	            return 'name="' + baseHash.substr(1) + '/' + $1;
	          }
	          return $0;
	        }));
	      })();
	    }
	    ele.find('a[href]').each(function () {
	      var aDom = $(this);
	      var href = aDom.attr('href');
	      if (/^http/.test(href)) {
	        aDom.attr('target', '_blank');
	        aDom.attr('rel', 'noopener');
	      } else if (/html$|html$/.test(href)) {
	        //GitBook不同章节之间跳转
	        aDom.attr('href', location.hash.replace(/[^//]+\.md/, '') + href.replace(/html$|html$/, 'md'));
	      }
	    });
	  });
	});
	
	var getName = function getName(path) {
	  var arr = path.match(/\/([^/.]+)[.\w-_]+$/);
	  return arr ? arr[1] : '';
	};
	
	var getURL = function getURL(o) {
	  return encodeURI(location.origin + '/' + o.path + '?t=' + o.mtime);
	};
	var getPath = function getPath(pathWithSearch) {
	  return decodeURIComponent(pathWithSearch.replace(location.origin + '/', '').replace(/\?[^?]+/, ''));
	};
	var getNoSearch = function getNoSearch(url) {
	  return url.replace(/\?[^?]+/, '');
	};
	
	var getSortContent = function getSortContent(content) {
	  var paragraph = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
	
	  var len = 500;
	  var minLen = len / 2;
	  var ret = content.substring(0, len);
	  var partCount = 0;
	  var partIndex = 0;
	  ret.replace(/([^\n]*)(\n|<br>|<\/p>)/g, function ($0, $1, $2, idx) {
	    partCount++;
	    if (partCount > paragraph && $1.length > 10 && partIndex === 0) {
	      partIndex = idx;
	    }
	    if (partCount == 15 && partIndex === 0) {
	      partIndex = idx;
	    }
	  });
	  if (partIndex > 0) {
	    ret = ret.substring(0, partIndex);
	    if (ret.length < len * 0.7) {
	      return ret;
	    }
	  }
	  var getContent = function getContent(str, reg) {
	    var arr = str.split(reg).filter(function (o) {
	      return !!o;
	    });
	    var count = 0;
	    if (arr && arr.length > 2) {
	      var idx = arr.length - 1;
	      if (arr.some(function (o, i) {
	        count += o.length;
	        if (count > minLen && i > 1) {
	          idx = i;
	          return true;
	        }
	      })) {
	        return str.substr(0, str.lastIndexOf(arr[idx])).replace(/[#\s]+$/, '');
	      }
	      return str;
	    }
	  };
	  var con = getContent(ret, /\s*#+\s*/);
	  if (con) {
	    return con;
	  }
	  con = getContent(ret, /\s+/);
	  if (con) {
	    return con;
	  }
	  return ret;
	};
	
	var processItem = function processItem(item, content) {
	  if (!content) {
	    return;
	  }
	  if (item.title == sidebarName) {
	    item.content = content;
	    return item;
	  }
	  var isRaw = true;
	  // let start = content.indexOf('---');
	  // if(start>-1){
	  //   let end;
	  //   if(start===0){
	  //     start = start+3;
	  //     end = content.substring(start).indexOf('---') + start;
	  //   }else{
	  //     end = start;
	  //     start = 0;
	  //   }
	  //   let arr = content.substring(start, end).match(/([^:\n]+:[^\n]+)/g);
	  //   if(arr){
	  //     let attrDict = {};
	  //     arr.forEach(function(o){
	  //       let point = o.indexOf(':');
	  //       attrDict[o.substring(0, point)] = o.substring(point+1);
	  //     });
	  //     item.title = attrDict.title || item.title;
	  //     isRaw = false;
	  //     content = content.substring(end+3).trim();
	  //     if(attrDict.dest_url){
	  //       content = '链接：['+attrDict.dest_url+']('+attrDict.dest_url+')'
	  //     }
	  //   }
	  // }
	  if (isRaw) {
	    var arr = content.match(/^[\s]*#[^\n\(]+[\n]/);
	    if (arr) {
	      var title = arr[0];
	      item.title = title.replace(/[#\s]+/, '').trim();
	      content = content.replace(title, '');
	      isRaw = false;
	    }
	  }
	  //articleModel.trigger('update_content');
	  item.content = content; // = (content || '').replace(/^[\s]*---[-]*/, '');
	  item.tfList = m_search.getTFs(content);
	  item.summary = getSortContent(content);
	  return item;
	};
	
	var preload = function preload(obj) {
	  var count = 0;
	  for (var pathWithSearch in obj) {
	    var path = getPath(pathWithSearch);
	    var item = void 0;
	    if (item = articleDict[path]) {
	      count++;
	      processItem(item, obj[pathWithSearch]);
	    }
	  }
	  var totalList = sidebarList.concat(articleList);
	  var existDict = {};
	  totalList.forEach(function (o) {
	    existDict[location.origin + '/' + o.path] = 1;
	  });
	
	  swPostMessage({
	    m: 'delete_not_exist_article',
	    data: existDict
	  });
	
	  if (isPreload) {
	    if (count) {
	      console.log('文章同步成功（' + count + '篇）！可以离线使用');
	    } else {
	      console.log('文章同步成功!（无更新内容）');
	    }
	    return false;
	  } else {
	    isPreload = true;
	    console.log('本地文章加载成功（' + count + '/' + (articleList.length + sidebarList.length) + '个文件）');
	  }
	  return true;
	};
	
	var init = function init(list) {
	  catalogList = []; //目录列表
	  articleList = []; //文件列表
	  sidebarList = [];
	  bookList = [];
	  var tagSet = new Set();
	  var processArticle = function processArticle(o) {
	    var _o$path = o.path,
	        path = _o$path === undefined ? '' : _o$path,
	        mtime = o.mtime;
	
	    if (o.isDirectory) {
	      var tags = path.split('/').slice(1);
	      tags.forEach(function (o) {
	        return tagSet.add(o);
	      });
	      var item = {
	        path: path,
	        time: m_util.getTime(mtime),
	        href: '#!/' + encodeURIComponent(o.path),
	        title: path.slice(path.lastIndexOf('/') + 1),
	        tagList: tags
	      };
	      catalogList.push(item);
	    } else {
	      (function () {
	        var tags = path.split('/').slice(1, -1);
	        tags.forEach(function (o) {
	          return tagSet.add(o);
	        });
	        var item = {
	          path: path,
	          mtime: mtime,
	          href: '#!/' + encodeURIComponent(o.path),
	          title: getName(path),
	          time: m_util.getTime(mtime),
	          tagList: tags
	        };
	
	        if (m_ability.supportCache) {
	          caches.open(markdownCacheName).then(function (cache) {
	            //取旧缓存
	            return cache.match(getURL(item)).then(function (resp) {
	              return resp && resp.text();
	            }).then(function (text) {
	              if (text) {
	                item = processItem(item, text);
	              }
	            });
	          });
	        } else {
	          var content = BCD.cache.getLocal(o.path);
	          if (content) {
	            item = processItem(item, content);
	          }
	        }
	
	        if (articleDict[path]) {
	          item = $.extend(articleDict[path], item);
	        } else {
	          articleDict[path] = item;
	        }
	
	        articleList.push(item);
	      })();
	    }
	  };
	  list.forEach(processArticle);
	  articleList = articleList.filter(function (o) {
	    if (o.title == sidebarName) {
	      sidebarList.push(o);
	      return false;
	    }
	    return true;
	  });
	  catalogList = catalogList.filter(function (o) {
	    if (articleDict[getSidebarPath(o.path)]) {
	      bookDict[o.path] = o;
	      bookList.push(o);
	      return false;
	    }
	    catalogDict[o.path] = o;
	    return true;
	  });
	  articleList = articleList.sort(function (a, b) {
	    return b.mtime - a.mtime;
	  });
	  tagList = [].concat(_toConsumableArray(tagSet));
	};
	
	var autoLoad = function autoLoad() {
	  var totalList = sidebarList.concat(articleList);
	  var noContents = totalList.filter(function (o) {
	    return !o.content;
	  });
	  var batchList = [];
	  var item = noContents.splice(0, 5);
	  while (item.length) {
	    batchList.push(item);
	    item = noContents.splice(0, 5);
	  }
	  m_util.iterator(batchList, function (item, next, list) {
	    if (m_setting.get('autoCache')) {
	      fetchContent(item).then(next).then(function () {
	        articleModel.trigger('update_content');
	      });
	    }
	  });
	};
	
	var processCount = 0;
	//先用缓存，请求回来再更新
	var initArticle = new Promise(function (resolve) {
	  BCD.ajaxCache('./json/article.json', function (data) {
	    var start = performance.now();
	    init(data);
	    console.log('init:', performance.now() - start);
	    processCount++;
	    // if (processCount === 2) { //如果网络请求失败，这里不会被执行
	    //   let totalList = sidebarList.concat(articleList);
	    //   swPostMessage({
	    //     m: 'preloadAtricle',
	    //     data: totalList.map(getURL)
	    //   }, preload);
	    // }
	    resolve(articleList);
	    console.log('resolve:', performance.now() - start);
	    return data && 1; //缓存数据到localStorage
	  }, 0, 2E3, true);
	});
	
	//获取包含相关tag文章列表
	var getTagArticles = function getTagArticles(tag) {
	  var retList = articleList;
	  if (tag) {
	    retList = articleList.filter(function (o) {
	      return o.tagList && o.tagList.indexOf(tag) > -1;
	    });
	  }
	  return retList.sort(function (a, b) {
	    return b.mtime - (m_readHistory.getReadTime(b.path) || 0) - (a.mtime - (m_readHistory.getReadTime(a.path) || 0));
	  });;
	};
	
	var fetchContent = function fetchContent(list) {
	  var urlList = list.filter(function (o) {
	    return articleDict[o.path] && !articleDict[o.path].content;
	  }).map(getURL);
	  return m_promiseAjax.batchFetch(urlList, {
	    dataType: 'text',
	    cache: m_ability.supportCache ? '' : 'normal_local',
	    timeout: 5E3,
	    success: function success(str) {
	      return !!str;
	    }
	  }).then(function (resList) {
	    for (var i = 0; i < (resList || []).length; i++) {
	      var o = list[i];
	      if (o) {
	        articleDict[o.path] = processItem(o, resList[i]);
	      }
	    }
	  });
	};
	
	var getList = function getList(method) {
	  return function (tag) {
	    var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
	
	    page = parseInt(page || 0);
	    var start = page * count;
	    var totalList = method(tag);
	    var list = totalList.slice(start, start + count);
	    return fetchContent(list).then(function () {
	      return {
	        tag: tag,
	        page: page,
	        count: count,
	        num: totalList.length,
	        list: list.map(function (o) {
	          return articleDict[o.path];
	        }).filter(function (o) {
	          return !!(o && o.content);
	        })
	      };
	    });
	  };
	};
	
	var getChildCatalog = function getChildCatalog(path) {
	  var catalog = catalogDict[path];
	  if (catalog) {
	    var _ret3 = function () {
	      var tagList = catalog.tagList;
	      var tagLength = tagList.length + 1;
	      return {
	        v: bookList.concat(catalogList).filter(function (o) {
	          return o.tagList.length && tagList.every(function (tag, i) {
	            return o.tagList.length == tagLength && tag == o.tagList[i];
	          });
	        })
	      };
	    }();
	
	    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	  }
	  return [];
	};
	
	var getCatalogArticles = function getCatalogArticles(path) {
	  var catalog = catalogDict[path];
	  if (catalog) {
	    var _ret4 = function () {
	      var tagList = catalog.tagList;
	      return {
	        v: articleList.filter(function (o) {
	          return o.tagList.length && tagList.every(function (tag, i) {
	            return tag == o.tagList[i];
	          });
	        }).sort(function (a, b) {
	          return a.tagList.length - b.tagList.length;
	        })
	      };
	    }();
	
	    if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
	  }
	  return [];
	};
	var getFavorArticles = function getFavorArticles() {
	  return articleList.filter(function (o) {
	    return m_readFavor.isFavor(o.path);
	  }).sort(function (a, b) {
	    return m_readFavor.getFavorTime(b.path) - m_readFavor.getFavorTime(a.path);
	  });
	};
	
	var testItem = function testItem(reg, item) {
	  var testType = 0;
	  var obj = {};
	  var searchWeight = 0;
	  var titleMatchDict = {};
	  var contentMatchDict = {};
	  if (reg.test(item.title)) {
	    obj.title = item.title.replace(reg, function ($0) {
	      if (titleMatchDict[$0]) {
	        titleMatchDict[$0]++;
	      } else {
	        titleMatchDict[$0] = 1;
	      }
	      return '<span class="text-danger">' + $0 + '</span>';
	    });
	    testType += 1;
	    var titleMathLength = 0;
	    for (var key in titleMatchDict) {
	      titleMathLength += /\w/.test(key) ? titleMatchDict[key] : Math.pow(1.6, key.length - 1) * titleMatchDict[key];
	    }
	    searchWeight += titleMathLength / item.title.length;
	  }
	  if (item.content && reg.test(item.content)) {
	    var key;
	
	    (function () {
	      var pointList = [];
	      obj.content = item.content.replace(reg, function ($0, point) {
	        if (contentMatchDict[$0]) {
	          contentMatchDict[$0]++;
	        } else {
	          contentMatchDict[$0] = 1;
	        }
	        var weight = /\w/.test($0) ? 2 : $0.length;
	        pointList.push({
	          point: point,
	          weight: weight
	        });
	        return '<font color=#a94442>' + $0 + '</font>';
	      });
	      pointList = pointList.sort(function (a, b) {
	        return b.weight - a.weight;
	      });
	      var startPoint = pointList[0].point;
	      var start = startPoint - 30;
	      var summary = item.content.substr(start < 0 ? 0 : start);
	      start = summary.search(/[。\n\r]/);
	      if (start < startPoint) {
	        summary = getSortContent(summary.substr(start).replace(/^[。\s]*/, ''), 5);
	      } else {
	        summary = getSortContent(summary.replace(/^[。\s]*/, ''), 5);
	      }
	      obj.summary = summary.replace(reg, function ($0) {
	        return '<font color=#a94442>' + $0 + '</font>';
	      });
	      testType += 2;
	      var contentMathLength = 0;
	
	      for (key in contentMatchDict) {
	        contentMathLength += /\w/.test(key) ? contentMatchDict[key] : Math.pow(1.6, key.length - 1) * contentMatchDict[key];
	      }
	      searchWeight += contentMathLength / Math.pow(item.content.length, 0.6);
	    })();
	  }
	  obj.testType = testType;
	  /*******calculate search weight**********/
	
	  obj.searchWeight = searchWeight;
	  return Object.assign({}, item, obj);
	};
	
	var searchList = function searchList(word, callback) {
	  var isCommend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	  var reg = m_search.getGlobalRegex(word);
	  var fitList = [];
	  var remainList = [];
	  var ajaxList = [];
	  var totalList = articleList.filter(function (o) {
	    return o;
	  });
	
	  var searchCallback = function searchCallback(list) {
	    var resultList = list.filter(function (o) {
	      return o.testType > 0;
	    }).sort(function (a, b) {
	      var ret = b.searchWeight - a.searchWeight;
	      if (ret === 0) {
	        return b.content.length - a.content.length + (b.mtime - a.mtime) / 1E5;
	      }
	      return ret;
	    });
	    if (resultList.length || list.length >= totalList.length) {
	      console.table(resultList.map(function (o) {
	        return {
	          path: o.path,
	          searchWeight: o.searchWeight
	        };
	      }));
	    }
	    callback({
	      totalNum: totalList.length,
	      checkNum: list.length,
	      searchWord: word,
	      list: resultList
	    });
	  };
	  var batchProcess = function batchProcess(list, next) {
	    var subList = list.splice(0, 10);
	    fetchContent(subList).then(function () {
	      searchCallback(subList.map(function (o) {
	        return testItem(reg, articleDict[o.path]);
	      }));
	      if (list.length) {
	        batchProcess(list, next);
	      } else if (next) {
	        next();
	      }
	    });
	  };
	  totalList.forEach(function (o) {
	    var item = articleDict[o.path];
	    if (item) {
	      var testObj = testItem(reg, item);
	      if (item.content) {
	        fitList.push(testObj);
	      } else if (testObj.testType > 0) {
	        ajaxList.push(item);
	      } else {
	        remainList.push(o);
	      }
	    }
	  });
	  if (isCommend) {
	    return callback(ajaxList.concat(fitList).filter(function (o) {
	      return o.testType > 0;
	    }).sort(function (a, b) {
	      return b.searchWeight - a.searchWeight;
	    }));
	  }
	  searchCallback(fitList);
	  batchProcess(ajaxList, function () {
	    batchProcess(remainList);
	  });
	  return remainList;
	};
	
	//搜索直达
	var searchDirect = function searchDirect(word) {
	  var reg = m_search.getGlobalRegex(word);
	  return articleList.filter(function (o) {
	    return reg.test(o.title);
	  }).map(function (o) {
	    var weight = 0;
	    var item = {
	      href: o.href,
	      title: o.title.replace(reg, function ($0) {
	        weight += $0.length;
	        return '<span class="text-danger">' + $0 + '</span>';
	      })
	    };
	    item.weight = weight;
	    return item;
	  }).sort(function (a, b) {
	    return b.weight - a.weight;
	  });
	};
	
	module.exports = {
	  getName: getName,
	  isPreload: isPreload,
	  startTime: startTime,
	  initArticle: initArticle,
	  catalogDict: catalogDict,
	  articleDict: articleDict,
	  hasCatalog: function hasCatalog(path) {
	    return !!catalogDict[path];
	  },
	  hasArticle: function hasArticle(path) {
	    return !!articleDict[path];
	  },
	  hasBook: function hasBook(path) {
	    return !!bookDict[path];
	  },
	  getCatalogMessage: function getCatalogMessage(path) {
	    return catalogDict[path];
	  },
	  getCatalogs: function getCatalogs() {
	    return catalogList;
	  },
	  getBooks: function getBooks() {
	    return bookList;
	  },
	  getTagArticles: getTagArticles,
	  getTags: function getTags() {
	    return tagList;
	  },
	  getSidebarPath: getSidebarPath,
	  getArticleList: function getArticleList() {
	    return articleList.map(function (o) {
	      return articleDict[o.path];
	    });
	  },
	  getListByCatalog: getList(getCatalogArticles),
	  getChildCatalog: getChildCatalog,
	  getListByTag: getList(getTagArticles),
	  getListByFavor: getList(getFavorArticles),
	  getArticleContent: function getArticleContent(path) {
	    return fetchContent([articleDict[path]]).then(function () {
	      return articleDict[path];
	    });
	  },
	  searchDirect: searchDirect,
	  searchList: searchList,
	  autoLoad: autoLoad,
	  onUpdate: function onUpdate(callback) {
	    var timer;
	    articleModel.on('update_content', function () {
	      clearTimeout(timer);
	      timer = setTimeout(callback, 100);
	    });
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	
	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var createNGram = function createNGram(n) {
	  return function (str) {
	    var arr = [];
	    var end = str.length - n + 1;
	    for (var i = 0; i < end; i++) {
	      arr.push(str.substr(i, n));
	    }
	    return arr;
	  };
	};
	
	var gramDict = {
	  4: createNGram(4),
	  3: createNGram(3),
	  2: createNGram(2)
	};
	
	var getWordList = function getWordList() {
	  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var wordList = [str];
	  var processStrict = function processStrict(str) {
	    return str.replace(/['‘’][^'‘’]*['‘’]|["”“][^"”“]*["”“]/g, function ($0) {
	      wordList.push($0.replace(/['‘’"”“]/g, ''));
	      return ' ';
	    });
	  };
	
	  var processChiese = function processChiese(str) {
	    return str.replace(/[\u4e00-\u9fff\uf900-\ufaff]+/g, function ($0) {
	      wordList.push($0);
	      for (var i = 4; i > 1; i--) {
	        if ($0.length > i) {
	          wordList.push.apply(wordList, gramDict[i]($0));
	        }
	      }
	      return ' ';
	    });
	  };
	
	  var processEnglish = function processEnglish(str) {
	    wordList.push.apply(wordList, str.split(/[^a-zA-Z]/).filter(function (o) {
	      return o.length > 2;
	    }).map(function (o) {
	      return o.toLowerCase();
	    }));
	  };
	
	  processEnglish(processChiese(processStrict(str)));
	  //console.log('search RegExp', new RegExp(wordList.join('|'), 'ig'));
	  return wordList;
	};
	
	var removeStopWord = function removeStopWord(str) {
	  str = str.replace(/\s*```([^`\n\r]*)[^`]*```\s*/g, function ($0, $1) {
	    return ' ' + $1 + ' ';
	  }); //去掉代码
	  str = str.replace(/<[^\u4e00-\u9fff\uf900-\ufaff>]+>|\([^\u4e00-\u9fff\uf900-\ufaff)]+\)|\w+[:@][\w.?#=&\/]+/g, ' '); //去掉html标签及超链接
	  str = str.replace(/怎么|的|是|开始|很多|我|觉得|非常|可以|一|了|上面|下面|这|那|哪|个|this|return|with/g, ' '); //去停用词
	  str = str.replace(/[^\u4e00-\u9fff\uf900-\ufaff\w]/g, ' '); //非中文或英文，替换成空格
	  return str;
	};
	
	var getTFs = function getTFs() {
	  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var wordList = getWordList(removeStopWord(str)).slice(1);
	  var threeDict = {};
	  var fourDict = {};
	  var tfDict = {};
	  var tfList = [];
	
	  wordList.forEach(function (o) {
	    if (o.length < 2 || Object.hasOwnProperty(o) || tfDict[o] !== undefined && typeof tfDict[o] !== 'number') {
	      return;
	    }
	    if (tfDict[o]) {
	      tfDict[o]++;
	    } else {
	      if (o.length == 3) {
	        threeDict[o] = 1;
	      }
	      if (o.length == 4) {
	        fourDict[o] = 1;
	      }
	      tfDict[o] = 1;
	    }
	  });
	  var token;
	  //去掉非词
	
	  var _loop = function _loop() {
	    var frequency = tfDict[token];
	    gramDict[3](token).forEach(function (o) {
	      if (frequency === tfDict[o]) {
	        delete tfDict[o];
	        delete threeDict[o];
	        gramDict[2](o).forEach(function (item) {
	          if (frequency === tfDict[item]) {
	            delete tfDict[item];
	          }
	        });
	      }
	    });
	  };
	
	  for (token in fourDict) {
	    _loop();
	  }
	
	  var _loop2 = function _loop2() {
	    var frequency = tfDict[token];
	    gramDict[2](token).forEach(function (o) {
	      if (frequency === tfDict[o]) {
	        delete tfDict[o];
	      }
	    });
	  };
	
	  for (token in threeDict) {
	    _loop2();
	  }
	
	  for (token in tfDict) {
	    tfList.push({
	      token: token,
	      frequency: tfDict[token]
	    });
	  }
	  return tfList.sort(function (a, b) {
	    return b.frequency - a.frequency;
	  }); //.slice(0,10).map(o=>o.token);
	};
	
	module.exports = {
	  getWordList: getWordList,
	  getTFs: getTFs,
	  getGlobalRegex: function getGlobalRegex(str) {
	    var wordSet = new Set(getWordList(str));
	    var wordList = [].concat(_toConsumableArray(wordSet));
	    return new RegExp(wordList.join('|'), 'ig');
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_config = __webpack_require__(14);
	var storageKey = 'read_history';
	var readHistory = {};
	var init = function init() {
	  try {
	    readHistory = $.extend({}, BCD.cache.getLocal(storageKey), readHistory);
	  } catch (e) {}
	};
	
	var update = function update() {
	  BCD.cache.setLocal(storageKey, readHistory, { permanent: true });
	};
	
	var set = function set(path, obj) {
	  readHistory[path] = $.extend({}, readHistory[path], obj);
	  update();
	};
	
	m_config.getConfig.then(function () {
	  storageKey = 'read_history_' + m_config.username;
	  init();
	});
	
	var addHistory = function addHistory(path) {
	  set(path, {
	    time: Date.now()
	  });
	};
	
	BCD.addEvent('article_down', function (ele) {
	  ele.on('click', function (e) {
	    ele.hide();
	    addHistory(ele.data('url'));
	  });
	});
	
	module.exports = {
	  addHistory: addHistory,
	  hasRead: function hasRead(path) {
	    return !!readHistory[path];
	  },
	  getReadTime: function getReadTime(path) {
	    return readHistory[path] && readHistory[path].time;
	  },
	  setScrollY: function setScrollY(path, y) {
	    set(path, {
	      scrollY: y
	    });
	  },
	  getScrollY: function getScrollY(path) {
	    return readHistory[path] && readHistory[path].scrollY;
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	var arr = location.host.split(".");
	var isLocalhost = arr.length === 1;
	var username = isLocalhost ? "swblog" : arr[0];
	var config = {
	  "author": username,
	  "nav": [["Home", "#!/index"], ["About", "#!/blog/about.md"]]
	};
	var searchIssueURL = void 0;
	var newIssueURL = void 0;
	
	var update = function update() {
	  var author = username = config.author;
	  config.logoTitle = config.logoTitle || author + "的博客";
	  searchIssueURL = 'https://github.com/' + author + '/' + author + '.github.io/issues?utf8=%E2%9C%93&q=';
	  newIssueURL = 'https://github.com/' + author + '/' + author + '.github.io/issues/new?title=';
	  if (window.CONFIG) {
	    CONFIG.username = username;
	  }
	};
	update();
	
	//先用缓存，请求回来再更新
	var getConfig = new Promise(function (resolve) {
	  BCD.ajaxCache('./json/config.json', function (data) {
	    config = data || config;
	    if (config.author) {
	      update();
	      resolve();
	      return 1; //缓存数据到localStorage
	    }
	    resolve();
	  }, 0, 2E3, true);
	});
	
	window.CONFIG = module.exports = {
	  username: username,
	  getIndex: function getIndex() {
	    return config.nav && config.nav[0] && config.nav[0][1] || "";
	  },
	  isLocalhost: isLocalhost,
	  getConfigSync: function getConfigSync() {
	    return config;
	  },
	  getConfig: getConfig,
	  getNewIssueURL: function getNewIssueURL(title) {
	    return newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title);
	  },
	  getSearchIssueURL: function getSearchIssueURL(title) {
	    return newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title);
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_config = __webpack_require__(14);
	var storageKey = 'read_favor';
	var readFavor = {};
	var init = function init() {
	  try {
	    readFavor = $.extend({}, BCD.cache.getLocal(storageKey), readFavor);
	  } catch (e) {}
	};
	
	m_config.getConfig.then(function () {
	  storageKey = 'read_favor_' + m_config.username;
	  init();
	});
	
	var addFavor = function addFavor(path) {
	  readFavor[path] = Date.now();
	  BCD.cache.setLocal(storageKey, readFavor, { permanent: true });
	};
	
	var delFavor = function delFavor(path) {
	  if (path in readFavor) {
	    delete readFavor[path];
	    BCD.cache.setLocal(storageKey, readFavor, { permanent: true });
	  }
	};
	
	var isFavor = function isFavor(path) {
	  return !!readFavor[path];
	};
	
	BCD.addEvent('favor', function (ele, option, data) {
	  var article = data;
	  if ('idx' in option && data.list) {
	    article = data.list[option.idx];
	  }
	  var favor = isFavor(article.path);
	  ele.val(favor);
	  if (favor) {
	    ele.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
	  }
	  ele.on('click', function () {
	    if (ele.val()) {
	      ele.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
	      delFavor(article.path);
	      ele.val(false);
	    } else {
	      ele.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
	      addFavor(article.path);
	      ele.val(true);
	    }
	  });
	});
	
	module.exports = {
	  addFavor: addFavor,
	  delFavor: delFavor,
	  isFavor: isFavor,
	  getFavorTime: function getFavorTime(path) {
	    return readFavor[path];
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	var o_setting = BCD.cache.getLocal('swblog_setting', { autoCache: false });
	
	function set(key, val) {
	  o_setting.key = val;
	  BCD.cache.setLocal('swblog_setting', o_setting, { permanent: true });
	}
	
	function get(key) {
	  return key ? o_setting.key : o_setting;
	}
	
	module.exports = {
	  set: set,
	  get: get
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(6);
	
	var index = 0;
	var postMessage = function postMessage() {};
	var callbackDict = {
	  log: function log(resp) {
	    console.log.apply(this, resp);
	    return true;
	  }
	};
	
	if (navigator.serviceWorker) {
	  window.addEventListener('message', function (event) {
	    var data = JSON.parse(event.data);
	    var cbid = data.cbid,
	        resp = data.resp;
	    if (cbid && callbackDict[cbid]) {
	      console.log('[client] window message:' + cbid);
	      if (!callbackDict[cbid](resp)) {
	        delete callbackDict[cbid];
	      }
	    }
	  });
	  navigator.serviceWorker.addEventListener('message', function (event) {
	    var data = JSON.parse(event.data);
	    var cbid = data.cbid,
	        resp = data.resp;
	    if (cbid && callbackDict[cbid]) {
	      console.log('[client] serviceWorker message:' + cbid);
	      if (!callbackDict[cbid](resp)) {
	        delete callbackDict[cbid];
	      }
	    }
	    m_util.stopBubble(event);
	  }); //页面通过监听service worker的message事件接收service worker的信息
	  postMessage = function postMessage(req, callback) {
	    if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.state == 'activated') {
	      console.log('postMessage');
	      index++;
	      var obj = {
	        m: req.m,
	        data: req.data
	      };
	      if (callback) {
	        obj.cbid = req.m + '_' + index;
	        callbackDict[obj.cbid] = callback;
	      }
	      navigator.serviceWorker.controller.postMessage(obj); //页面向service worker发送信息
	    }
	  };
	}
	
	module.exports = postMessage; //postMessage(message, callback)

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	    supportCache: !!(window.caches && caches.open)
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * 带缓存的ajax请求，约定ret=0为正确数据，可以缓存
	 * @access public
	 * @param {String | Object} url 请求地址，url中必须带有t参数作为缓存过期的判断标准。
	 * @param {Function} [success] 成功回调, 返回值Boolean值，true，把数据存在localStorage中，false,不缓存，
	 *                         其它值或不返回，根据cache策略缓存
	 * @param {Function} [error] 不成功回调
	 * @param {Function} [timeOut] 超时时间
	 * @param {string} [options.cache=""]     缓存使用方式：
	 * <p>""             默认不使用缓存；</p>
	 * <p>"normal_local" 表示如果数据有效则直接使用，超过有效期则拉取失败时使用缓存， 缓存在localStorage中；</p>
	 * <p>"next_local    表示如果有缓存，则用缓存，但会拉取新数据不render，下次再用， 缓存在localStorage中；</p>
	 * <p>"normal_session 表示如果数据有效则直接使用，超过有效期则拉取失败时使用缓存， 缓存在sessionStorage中；</p>
	 * <p>"next_session    表示如果有缓存，则用缓存，但会拉取新数据不render，下次再用， 缓存在sessionStorage中；</p>
	 * @return {Function}  类似Promise的对象
	 */
	
	//对于不能缓存的的情况，不要传入cache参数即可
	var _fetch = function _fetch(options) {
	    var cache = options.cache || "";
	    var defer = $.Deferred();
	
	    if (BCD.is.s(options)) {
	        options = {
	            url: options
	        };
	    }
	    BCD.ajaxCache($.extend({
	        timeout: 6e3,
	        xhrFields: {
	            withCredentials: true
	        },
	        useCache: cache.indexOf('next') === 0
	    }, options, {
	        success: function success(data) {
	            try {
	                defer.resolve(data);
	                var isRight;
	                var storage = cache && (cache.indexOf('local') > 0 ? 1 : 2);
	                if (options.success) {
	                    isRight = options.success(data);
	                    if (isRight) {
	                        return storage;
	                    }
	                } else {
	                    isRight = data && data.ret === 0;
	                }
	                return isRight !== false && storage;
	            } catch (e) {
	                console.log(e, 'promise_ajax fetch url "' + options.url + '", has wrong in success');
	            }
	        },
	        error: function error() {
	            try {
	                console.log(options.url + ' promise_ajax error');
	                defer.resolve(false);
	                if (options.errors) {
	                    options.errors.apply(this, arguments);
	                }
	            } catch (e) {
	                console.log(e, 'promise_ajax fetch url "' + options.url + '", has wrong in error');
	            }
	        }
	    }));
	    return defer.promise();
	};
	
	function batchFetch(urls, option) {
	    var promiseList = (urls || []).map(function (url) {
	        return _fetch($.extend({
	            url: url
	        }, option));
	    });
	    return $.when.apply(promiseList, promiseList).then(function () {
	        return arguments;
	    });
	}
	//事件绑定
	module.exports = {
	    fetch: _fetch,
	    batchFetch: batchFetch
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var m_util = __webpack_require__(6);
	
	module.exports = m_util.load(["./source/lib/editor.md/editormd.preview.min.css", "./source/lib/blog.css", "./source/lib/editor.md/lib/marked.min.js", "./source/lib/editor.md/lib/prettify.min.js", "./source/lib/editor.md/lib/raphael.min.js", "./source/lib/editor.md/lib/underscore.min.js", "./source/lib/editor.md/lib/sequence-diagram.min.js", "./source/lib/editor.md/lib/flowchart.min.js", "./source/lib/editor.md/lib/jquery.flowchart.min.js", "./source/lib/editor.md/editormd.min.js"]);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(6);
	var m_article = __webpack_require__(11);
	var m_config = __webpack_require__(14);
	var m_commonEvent = __webpack_require__(5);
	var viewHeader = $('<header class="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner"></header>');
	
	function hideNavigator() {
	  if (viewHeader.find('.navbar-nav').height() > 66) {
	    viewHeader.find('.navbar-toggle').trigger('click');
	  }
	}
	m_commonEvent.onClick('navigator_go', function (ele) {
	  hideNavigator();
	  m_commonEvent.go.apply(this, arguments);
	});
	m_commonEvent.onClick('navigator_replaceHash', function (ele) {
	  hideNavigator();
	  m_commonEvent.replaceHash.apply(this, arguments);
	});
	BCD.addEvent('navigator_search', function (ele) {
	  ele.html('<div class="form-group open">' + '  <input type="text" class="form-control" placeholder="Search">' + '  <ul class="dropdown-menu" style="right:auto;display:none"></ul>' + '</div>' + '<button type="submit" class="btn btn-primary">Submit</button>');
	  var viewInput = ele.find('input');
	  var viewDrop = ele.find('ul').setView({
	    template: '<%(obj||[]).forEach(function(o){%>' + '<li data-on="?m=navigator_go" data-url="<%=o.href%>"><a><%=o.title%></a></li>' + //
	    '<%})%>'
	  });
	
	  var viewGroup = ele.find('.form-group');
	  var getWord = function getWord() {
	    return viewInput.val().trim();
	  };
	  var doSearch = function doSearch() {
	    var hash = '#!/search/' + encodeURIComponent(getWord());
	    hideNavigator();
	    if (BCD.getHash(0) == 'search') {
	      BCD.replaceHash(hash);
	    } else {
	      BCD.go(hash);
	    }
	    setTimeout(function () {
	      viewInput[0].focus(); //延时才能自动focus
	    }, 300);
	  };
	  ele.find('button').on('click', function (e) {
	    m_util.stopBubble(e);
	    var word = getWord();
	    if (word) {
	      doSearch();
	    }
	  });
	  var selectLi = null;
	  var selectList = null;
	  var index = -1;
	  var oldWord = '';
	  viewInput.on('blur', function () {
	    setTimeout(function () {
	      viewDrop.hide();
	    }, 200);
	  });
	  ele.on('keydown', function (e) {
	    //上下选择
	    if (selectList && (e.keyCode == 40 || e.keyCode == 38)) {
	
	      if (e.keyCode == 40) {
	        index++;
	        if (index >= selectList.length) {
	          index = 0;
	        }
	      }
	      if (e.keyCode == 38) {
	        index--;
	        if (index <= -selectList.length) {
	          index = 0;
	        }
	      }
	      selectList.css('background-color', '');
	      selectLi = selectList.eq(index);
	      selectLi.css('background-color', '#b2d8fa');
	    }
	  });
	
	  ele.on('keyup', function (e) {
	    //keypress要慢一拍 keypress input keyup
	    var word = getWord();
	    if (word) {
	      if (e.keyCode == 32) {
	        return doSearch();
	      }
	      if (e.keyCode == 13) {
	        if (selectLi) {
	          selectLi.trigger('click');
	        } else {
	          doSearch();
	        }
	      }
	
	      if (word == oldWord) {
	        return viewDrop.show();
	      }
	      oldWord = word;
	      var list = m_article.searchDirect(word);
	      if (list.length) {
	        index = -1;
	        selectLi = null;
	        viewDrop.reset(list);
	        selectList = viewDrop.find('li');
	      } else {
	        viewDrop.hide();
	      }
	    } else {
	      viewDrop.hide();
	    }
	  });
	});
	
	//顶部导航
	module.exports = function (option) {
	  option = $.extend({
	    name: 'common/header',
	    getData: function getData() {
	      return m_config.getConfigSync();
	    },
	    template: '  <div class="container">' + '    <div class="navbar-header">' + '      <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">' + '        <span class="sr-only">Toggle navigation</span>' + '        <span class="icon-bar"></span>' + '        <span class="icon-bar"></span>' + '        <span class="icon-bar"></span>' + '      </button>' + '      <a data-on="?m=navigator_go" data-url="<%=CONFIG.getIndex()%>" class="logo-link" style="padding: 12px;"><%-obj.logoTitle%></a>' + '    </div>' + '    <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">' + '      <div class="navbar-form navbar-right" data-on="?m=navigator_search"></div>' + '      <ul class="nav navbar-nav"><%(obj.nav || []).forEach(function(o){%>' + '        <li class="<%=location.hash==o[1] ? "active" : ""%>"><a data-on="?m=navigator_replaceHash" data-url="<%=o[1]%>"><%-o[0]%></a></li>' + '        <%})%>' + '      </ul>' + '    </nav>' + '  </div>'
	  }, option);
	  return viewHeader.setView(option);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var c_footer = __webpack_require__(23);
	var c_mainContainer = __webpack_require__(24);
	var m_article = __webpack_require__(11);
	var m_initOption = __webpack_require__(25);
	var c_pannel = __webpack_require__(26);
	var c_pannelList = __webpack_require__(27);
	var c_articleList = __webpack_require__(29);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewTop = void 0;
	  var viewList = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewList.setView(c_articleList());
	  viewBody.addView(viewPannelList);
	
	  var viewFoot = c_footer();
	  var currentHash = void 0;
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender && currentHash == location.hash && BCD.history.getCode() == -1) {
	        return m_initOption.notRender(hasRender);
	      }
	      currentHash = location.hash;
	      viewList.empty();
	      if (key == 'index') {
	        m_article.getListByTag(0, BCD.getHash(1)).then(function (data) {
	          data.title = "最新未读文章";
	          data.hrefHead = '#!/index';
	          viewList.reset(data);
	        });
	      }if (key == 'favor') {
	        m_article.getListByFavor(0, BCD.getHash(1)).then(function (data) {
	          data.title = "文章收藏";
	          data.hrefHead = '#!/favor';
	          console.log(data);
	          viewList.reset(data);
	        });
	      } else if (key == 'tag') {
	        (function () {
	          var tag = BCD.getHash(1);
	          m_article.getListByTag(tag, BCD.getHash(2)).then(function (data) {
	            data.title = '"' + tag + '" 的最新未读文章';
	            data.hrefHead = '#!/tag/' + tag;
	            viewList.reset(data);
	          });
	        })();
	      } else if (m_article.hasCatalog(key)) {
	        var pageNum = parseInt(BCD.getHash(1) || 0);
	        if (pageNum === 0) {
	          if (viewTop) {
	            viewTop.show();
	          } else {
	            viewTop = c_pannel().reset({
	              isInline: true,
	              list: m_article.getChildCatalog(key).map(function (o) {
	                return {
	                  href: o.href,
	                  title: o.title
	                };
	              })
	            });
	          }
	          viewList.parent().prepend(viewTop);
	          //console.log('getChildCatalog', key, m_article.getChildCatalog(key));
	        } else if (viewTop) {
	          viewTop.hide();
	        }
	        m_article.getListByCatalog(key, pageNum).then(function (data) {
	          data.title = '"' + data.tag.replace(/^[^/]+\//, '') + '" 的最新文章';
	          data.hrefHead = '#!/' + BCD.getHash(0);
	          viewList.reset(data);
	        });
	      }
	    },
	    title: '文章列表',
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//页脚
	var m_config = __webpack_require__(14);
	module.exports = function (option) {
	  var viewHeader = $('<footer></footer>');
	  option = $.extend({
	    name: 'common/footer',
	    getData: function getData() {
	      return m_config.getConfigSync();
	    },
	    template: '<div class="container">' + '  <hr>' + '  <p class="text-center">Copyright <%-obj.author%> © <%=new Date().getFullYear()%>. All rights reserved.</p>' + '</div>'
	  }, option);
	  return viewHeader.setView(option);
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
	  return $('<div class="container" style="min-height:500px">' + '  <div class="row">' + '    <div class="col-sm-12 col-md-8 col-lg-8">' + '     <div data-selector="main"></div></div>' + '    <div class="col-sm-12 col-md-4 col-lg-4" data-selector="panel"></div>' + '  </div>' + '</div>');
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	function anchorBack() {
	    if (history.state && history.state.scrollY) {
	        //支持锚点返回
	        if (BCD.history.getCode() == -1) {
	            scrollTo(0, history.state.scrollY);
	        }
	        BCD.extendState({ //保证刷新可回到头部
	            scrollY: 0
	        });
	    }
	}
	
	//带锚点返回，不reset子view
	function notRender(hasRender) {
	    if (hasRender) {
	        BCD.getPage().show();
	        anchorBack();
	        return 'show';
	    }
	}
	module.exports = {
	    notRender: notRender,
	    anchorBack: anchorBack
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	//顶部导航
	module.exports = function (option) {
	  var view = $('<div class="panel panel-primary"></div>');
	  option = $.extend({
	    name: 'blog/panel',
	    template: '<%if(obj.title){%><div class="panel-heading">' + '  <h4><%-obj.title%></h4>' + '</div><%}%>' + '<div class="panel-body">' + '  <%if(obj.isInline){%>' + '    <ul class="list-inline">' + '     <%(obj.list || []).forEach(function(o){%>' + '      <%if(o.href){%>' + '       <li><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a></li>' + '      <%}else{%>' + '       <li><a data-on="?m=go" data-url="#!/tag/<%=o%>"><%=o%></a></li>' + '      <%}%>' + '     <%})%>' + '    </ul>' + '  <%}else{%>' + '    <ul class="list-group">' + '     <%(obj.list || []).forEach(function(o){%>' + '      <li class="list-group-item"><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a>' + '       <%=o.time ? "<span style=\\\"color: #a2a34f;\\\">("+o.time+")</span>" : ""%></li>' + '     <%})%>' + '    </ul>' + '    <%}%>' + '</div>',
	    end: function end(data) {
	      if (!(data && data.list && data.list.length)) {
	        this.hide();
	        return 'hide';
	      }
	    }
	  }, option);
	  return view.setView(option);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_article = __webpack_require__(11);
	var m_recommend = __webpack_require__(28);
	var c_pannel = __webpack_require__(26);
	var m_util = __webpack_require__(6);
	module.exports = function (view) {
	  var viewPannelBook = c_pannel({
	    data: {
	      title: '书籍',
	      list: m_article.getBooks().map(function (o) {
	        return {
	          href: o.href,
	          title: o.title,
	          time: o.time
	        };
	      })
	    }
	  });
	  var viewPannelCatalog = c_pannel({
	    data: {
	      title: '分类',
	      list: m_article.getCatalogs().filter(function (o) {
	        return o.tagList.length === 1;
	      }).map(function (o) {
	        return {
	          title: o.title,
	          href: o.href
	        };
	      })
	    }
	  });
	  var viewPannelTag = c_pannel({
	    data: {
	      isInline: true,
	      title: '标签',
	      list: m_article.getTags()
	    }
	  });
	
	  var viewPannelRecommendPost = c_pannel({
	    delay: true
	  });
	  m_recommend.getRecommend(function (list) {
	    viewPannelRecommendPost.reset({
	      title: '推荐阅读',
	      list: list.map(function (o) {
	        return {
	          href: o.href,
	          title: o.title,
	          time: o.time
	        };
	      })
	    });
	  });
	
	  if (m_util.dom.getWindowWidth() < 1000) {
	    return view.setView({
	      source: function source() {
	        return new Promise(function (resolve) {
	          setTimeout(resolve, 3E3);
	        });
	      },
	      viewList: [viewPannelRecommendPost, viewPannelBook, viewPannelCatalog, viewPannelTag]
	    });
	  }
	  return view.setView({
	    viewList: [viewPannelBook, viewPannelCatalog, viewPannelTag, viewPannelRecommendPost]
	  });
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var m_util = __webpack_require__(6);
	var m_article = __webpack_require__(11);
	var m_search = __webpack_require__(12);
	var m_readHistory = __webpack_require__(13);
	
	var filter = function filter(list) {
	  var arr = [];
	  var itemSet = new Set(list);
	  var uniqList = [].concat(_toConsumableArray(itemSet));
	  var currentPath = decodeURIComponent(location.hash.replace('#!/', ''));
	  uniqList.some(function (o) {
	    if (!m_readHistory.hasRead(o.path) && o.path != currentPath) {
	      arr.push(o);
	      if (arr.length > 10) {
	        return true;
	      }
	    }
	  });
	  return arr;
	};
	
	var getCorrelation = function getCorrelation(a_tfList) {
	  var tfDict = {};
	  a_tfList.forEach(function (o) {
	    tfDict[o.token] = o.frequency;
	  });
	  return function (b_tfList) {
	    var total = b_tfList.reduce(function (sum, item) {
	      return sum += item.frequency;
	    }, 0);
	    return b_tfList.reduce(function (weight, item) {
	      if (typeof tfDict[item.token] == 'number' && typeof item.frequency == 'number') {
	        weight += (tfDict[item.token] || 0) * item.frequency / total;
	      }
	      return weight;
	    }, 0);
	  };
	};
	
	var getSimilarArticles = function getSimilarArticles(a_tfList) {
	  var list = m_article.getArticleList().filter(function (o) {
	    return o.tfList && o.tfList.length;
	  });
	  var calModel = getCorrelation(a_tfList);
	  var weightList = list.map(function (o) {
	    return {
	      article: o,
	      weight: calModel(o.tfList)
	    };
	  }).sort(function (a, b) {
	    return b.weight - a.weight;
	  });
	  console.table(weightList.slice(0, 20).map(function (o) {
	    return {
	      title: o.article.title,
	      weight: o.weight
	    };
	  }));
	  return weightList.map(function (o) {
	    return o.article;
	  });
	};
	
	var getMutiSamples = function getMutiSamples() {
	  var tagDict = {};
	  var retList = [];
	  var originList = m_article.getArticleList();
	  var list = originList.filter(function (o) {
	    return !m_readHistory.hasRead(o.path);
	  });
	  if (list.some(function (o) {
	    var tagList = o.tagList || [];
	    var tagName = tagList[tagList.length - 1];
	    if (tagDict[tagName]) {
	      tagDict[tagName].push(o);
	    } else {
	      tagDict[tagName] = [];
	      retList.push(o);
	    }
	    if (retList.length == 10) {
	      return true;
	    }
	  })) {
	    return retList;
	  } else {
	    var tagList = Object.keys(tagDict);
	    for (var i = 0; i < 10; i++) {
	      for (var j = 0; j < tagList.length; j++) {
	        var item = void 0;
	        var tagName = tagList[j];
	        if (item = tagDict[tagName][i]) {
	          retList.push(item);
	          if (retList.length == 10) {
	            return retList;
	          }
	        }
	      }
	    }
	  }
	  return retList.concat(originList.slice(0, 10 - retList.length));
	};
	
	var getRecommend = function getRecommend(callback) {
	  var delayTime = 2E3 - (m_util.now() - m_article.startTime);
	  delayTime = m_article.isPreload ? 0 : delayTime < 0 ? 0 : delayTime;
	  setTimeout(function () {
	    var key = decodeURIComponent(BCD.getHash(0));
	
	    switch (true) {
	      case key == 'tag':
	        var word = decodeURIComponent(BCD.getHash(1));
	        m_article.searchList(word, function (list) {
	          callback(filter(list.concat(getMutiSamples())));
	        }, true);
	        break;
	      case m_article.hasArticle(key):
	        m_article.getArticleContent(key).then(function (data) {
	          var tagList = data.tagList;
	          var keyWords = (data.tfList || []).slice(0, 10).map(function (o) {
	            return o.token + '(' + o.frequency + ')';
	          });
	          console.log('本文关键词为：', keyWords.join(','));
	          callback(filter(getSimilarArticles(data.tfList).concat(getMutiSamples())));
	        });
	        break;
	      case m_article.hasCatalog(key):
	        m_article.getListByCatalog(key, 0, 999).then(function (data) {
	          //在目录列表中已经有当前目录文章的展示了，在这里优先展示搜索到的内容
	          var catalog = m_article.getCatalogMessage(key);
	          var alist = data.list || [];
	          m_article.searchList(catalog.tagList.join(' '), function (list) {
	            callback(filter(list.concat(alist.concat(getMutiSamples()))));
	          }, true);
	        });
	        break;
	
	      default:
	        callback(getMutiSamples());
	        break;
	    }
	  }, delayTime);
	};
	module.exports = {
	  getRecommend: getRecommend
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	//文章列表
	module.exports = function (option) {
	  return $.extend({
	    name: 'blog/article_list',
	    template: '<h3><%=obj.title%></h3>' + '<%if(!(obj.list && obj.list.length)){%>' + '<br><hr><center><h3>暂无内容</h3></center>' + '<%}else{(obj.list || []).forEach(function(o, idx){%><article>' + '  <h2><a data-on="?m=go" data-url="<%=o.href%>"><%-o.title%></a></h2>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(o.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span data-on="?m=article_down" data-url="<%=o.path%>"><span class="glyphicon glyphicon-download"></span>&nbsp;踩&nbsp;&nbsp;</span>' + '      <span data-on="?m=favor&idx=<%=idx%>" style="color: darkmagenta;" class="glyphicon glyphicon-star-empty"></span>&nbsp;收藏&nbsp;&nbsp;' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-o.time%>' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview&idx=<%=idx%>">' + '  </div><br />' + '' + '  <p class="text-right">' + '    <a data-on="?m=go" data-url="<%=o.href%>">' + '      continue reading...' + '    </a>' + '  </p>' + '  <hr>' + '</article><%})%>' + '' + '<ul class="pager">' + '  <li class="previous"><a <%if(obj.page==0){%>style="opacity: 0.5;"<%}else{%>' + 'data-on="?m=go" data-url="<%=obj.hrefHead+"/"+(obj.page-1)%>"<%}%>>&larr; Previous</a></li>' + '  <li class="next"><a <%if(obj.page==Math.floor(obj.num/obj.count)){%>style="opacity: 0.5;"<%}else{%>' + 'data-on="?m=go" data-url="<%=obj.hrefHead+"/"+(obj.page+1)%>"<%}%>>Next &rarr;</a></li>' + '</ul><%}%>'
	  }, option);
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var s_mainContainer = __webpack_require__(31);
	var m_article = __webpack_require__(11);
	var m_readHistory = __webpack_require__(13);
	var c_articleList = __webpack_require__(29);
	
	module.exports = function (page, key) {
	  page.html(s_mainContainer);
	  var viewContent = page.find('[data-selector="main"]');
	  var viewSlidebar = page.find('[data-selector="slidebar"]');
	  var slidebar = void 0;
	  var currentHash = void 0;
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
	    start: function start() {
	      if (currentHash !== location.hash) {
	        viewContent.empty();
	        currentHash = location.hash;
	      }
	      this.show();
	      m_article.getArticleContent(m_article.getSidebarPath(key)).then(function (data) {
	        var baseHash = '#!/' + BCD.getHash(0);
	        if (!slidebar) {
	          (function () {
	            slidebar = $.extend({}, data);
	            var content = slidebar.content || '';
	            var chapters = slidebar.chapters = [];
	
	            slidebar.content = content.replace(/<%(([^>]|[^%]>)+)%>/g, function ($0, $1) {
	              var item = {};
	              var fileName = '';
	              if ($1.indexOf(']') > 0) {
	                //这种格式：[描述](相对与当前目录的地址)
	                var arr = $1.substr(1, $1.length - 2).split(/\]\s*\(/);
	                item.title = arr[0] || '';
	                item.href = baseHash + '/' + (arr[1] || '');
	                fileName = arr[1];
	              } else {
	                item.title = $1;
	                item.href = baseHash + '/' + $1 + '.md';
	                fileName = $1 + '.md';
	              }
	              item.path = key + '/' + fileName;
	              if (m_article.hasArticle(item.path)) {
	                chapters.push(item);
	              }
	              return '<a data-on="?m=replaceHash" data-url="' + item.href + '">' + item.title + '</a>' + '<span data-path="' + item.path + '" class="icon glyphicon glyphicon-ok" aria-hidden="true" ' + 'style="' + (m_readHistory.hasRead(item.path) ? '' : 'display:none') + '"></span>';
	            });
	            viewSlidebar.reset(slidebar);
	            setTimeout(function () {
	              viewSlidebar.bindEvent();
	            });
	          })();
	        }
	        var fileName = key + location.hash.replace(baseHash, '');
	        if (m_article.hasArticle(fileName)) {
	          m_article.getArticleContent(fileName).then(function (data) {
	            m_readHistory.addHistory(fileName);
	            $(viewSlidebar.find('.active')).removeClass('active');
	            var currentDom = $('.slidebar [data-path="' + fileName + '"]');
	            currentDom.parent().addClass('active');
	            currentDom.show();
	            viewContent.reset(data);
	            if (currentDom[0].scrollIntoViewIfNeeded) {
	              currentDom[0].scrollIntoViewIfNeeded();
	            }
	          });
	        } else if (slidebar.chapters[0]) {
	          return BCD.replaceHash(slidebar.chapters[0].href);
	        } else {
	          viewContent.reset({
	            content: '敬请期待',
	            title: fileName
	          });
	        }
	      });
	    }
	  });
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = '  <div class="row">' + '    <div class="slidebar col-sm-5 col-md-4 col-lg-3" data-selector="slidebar"></div>' + '    <div class="col-sm-offset-5 col-md-offset-4 col-lg-offset-3 col-sm-7 col-md-8 col-lg-9" data-selector="main"></div>' + '  </div>';

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//有侧边栏的内容展示
	
	var c_mainContainer = __webpack_require__(24);
	var c_footer = __webpack_require__(23);
	var m_article = __webpack_require__(11);
	var m_readHistory = __webpack_require__(13);
	var c_pannelList = __webpack_require__(27);
	var c_content = __webpack_require__(33);
	var m_initOption = __webpack_require__(25);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewContent = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewContent.setView(c_content({
	    delay: true
	  }));
	  viewBody.addView(viewContent);
	  viewBody.addView(viewPannelList);
	
	  var timer;
	  BCD.scrollY.on(location.hash, function (ev, y) {
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      m_readHistory.setScrollY(key, y); //记住阅读位置
	    }, 100);
	  });
	
	  var viewFoot = c_footer();
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender) {
	        return m_initOption.notRender(hasRender);
	      }
	      if (m_article.hasArticle(key)) {
	        m_article.getArticleContent(key).then(function (data) {
	          m_readHistory.addHistory(key);
	          page.setView({ title: data.title });
	          document.title = data.title;
	          viewContent.reset(data);
	          window.scrollTo(0, m_readHistory.getScrollY(key));
	        });
	      }
	    },
	    viewList: [viewBody, viewFoot],
	    end: function end() {
	      window.scrollTo(0, m_readHistory.getScrollY(key));
	    }
	  });
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	window.CONFIG = __webpack_require__(14);
	
	//单个文章
	module.exports = function (option) {
	  return $.extend({
	    name: 'blog/content',
	    template: '<h1><%=obj.title%></h1>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(obj.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-obj.time%>' + '      <span data-on="?m=favor" style="color: darkmagenta;" class="glyphicon glyphicon-star-empty"></span>&nbsp;收藏&nbsp;&nbsp;' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview">' + '  </div><br />' + '  <hr>' + '</article>' + '<ul class="pager">' + '  <li class="previous"><a data-on="?m=back">← 返回</a></li>' + ' <li><a target="_blank" rel="noopener" href="<%=CONFIG.getSearchIssueURL(obj.title)%>">查看评论</a></li>' + ' <li class="next"><a target="_blank" rel="noopener" href="<%=CONFIG.getNewIssueURL(obj.title)%>">去评论 &rarr;</a></li>' + '</ul>'
	  }, option);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//针对导航的，没有侧边栏的内容展示
	
	var c_mainContainer = __webpack_require__(24);
	var c_footer = __webpack_require__(23);
	var m_config = __webpack_require__(14);
	var m_article = __webpack_require__(11);
	var m_initOption = __webpack_require__(25);
	
	module.exports = function (page) {
	  var viewBody = $('<div class="container" style="min-height:' + ((window.innerHeight || 640) - 200) + 'px"/>').setView({
	    name: 'blog/blog',
	    delay: true,
	    template: '<div data-on="?m=mkview"></div>'
	  });
	
	  var viewFoot = c_footer();
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender && BCD.history.getCode() == -1) {
	        return m_initOption.notRender(hasRender);
	      }
	      var key = location.hash.replace('#!/', '');
	      if (m_article.hasArticle(key)) {
	        m_article.getArticleContent(key).then(function (data) {
	          page.setView({ title: data.title });
	          document.title = data.title;
	          viewBody.reset(data);
	        });
	      } else {
	        BCD.replaceHash(m_config.getIndex());
	      }
	    },
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var c_footer = __webpack_require__(23);
	var c_mainContainer = __webpack_require__(24);
	var m_initOption = __webpack_require__(25);
	var c_pannelList = __webpack_require__(27);
	var m_pullArticle = __webpack_require__(36);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewList = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewList.setView({
	    viewList: [m_pullArticle.container]
	  });
	
	  viewBody.addView(viewList);
	  viewBody.addView(viewPannelList);
	
	  var viewFoot = c_footer();
	  var oldWord = '';
	  page.setView({
	    start: function start(hasRender) {
	      var word = decodeURIComponent(BCD.getHash(1));
	      if (hasRender && oldWord == word) {
	        return m_initOption.notRender(true);
	      }
	      oldWord = word;
	      m_pullArticle.init(word);
	    },
	    title: '搜索结果',
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * 不断增加的列表
	 */
	var m_article = __webpack_require__(11);
	var container = $('<div style="min-height:none;">' + '<div data-selector="tips" style="margin: 20px;font-size: 20px;"></div>' + '<div data-selector="pull_list"></div>' + '</div>');
	
	var viewRank = $(container.find('[data-selector="pull_list"]'));
	var viewTips = $(container.find('[data-selector="tips"]'));
	
	viewRank.setView({
	  full: 'append',
	  template: '<%(obj.list || []).forEach(function(o, idx, list){%><article>' + '  <h2><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a></h2>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(o.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-o.time%>' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview&idx=<%=idx%>">' + '  </div><br />' + '  <p class="text-right">' + '    <a data-on="?m=go" data-url="<%=o.href%>">' + '      continue reading...' + '    </a>' + '  </p>' + '  <%if(idx<list.length-1)print("<hr>")%>' + '</article><%})%>'
	});
	
	module.exports = {
	  container: container,
	  init: function init(word) {
	    var count = 0;
	    var processCount = 0;
	    var keyWord = '<span class="text-danger">' + word + '</span>';
	    viewTips.html('正在搜索：' + keyWord);
	    viewRank.empty();
	    m_article.searchList(word, function (data) {
	      viewRank.reset(data);
	      count += data.list && data.list.length || 0;
	      processCount += data.checkNum;
	      if (processCount < data.totalNum) {
	        viewTips.html('在(' + processCount + '/' + data.totalNum + ')搜索到' + count + '篇关于：' + keyWord);
	      } else {
	        viewTips.html('在' + data.totalNum + '篇文章中搜索到' + count + '篇关于：' + keyWord);
	      }
	
	      //console.log(data);
	    });
	  }
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(38);
	__webpack_require__(39);
	
	module.exports = function (page) {
	  page.addClass('text-center').html('<p style="margin-top: 200px;with:600px"><label>' + (window.Notification ? '您已禁止了通知，请重新设置' : '您的浏览器不支持该特性，请使用最新的Chrome浏览器') + '</label>' + '<button style="margin-left: 20px;min-width: 150px;"' + ' data-on="?m=subscribePush"' + ' class="btn btn-warning btn-sm">订阅</button></p>' + '<p style="margin-top: 50px;with:600px"><label></label><button style="margin-left: 20px;min-width: 150px;"' + ' data-on="?m=autoCache"' + ' class="btn btn-warning btn-sm">自动缓存全站</button></p>');
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';
	
	var isSubscribed = false;
	
	BCD.addEvent('subscribePush', function (fabPushElement) {
	  //Push notification button
	  var tipsElement = fabPushElement.prev();
	  //To check `push notification` is supported or not
	  var isPushSupported = function isPushSupported() {
	    console.log('check support');
	    //To check `push notification` permission is denied by user
	    if (!window.Notification || Notification.permission === 'denied') {
	      console.log('User has blocked push notification.');
	      return;
	    }
	
	    //Check `push notification` is supported or not
	    if (!('PushManager' in window)) {
	      console.log('Sorry, Push notification isn\'t supported in your browser.');
	      return;
	    }
	    //Click event for subscribe push
	    fabPushElement.on('click', function () {
	      if (isSubscribed) {
	        unsubscribePush();
	      } else {
	        subscribePush();
	      }
	    });
	    //Get `push notification` subscription
	    //If `serviceWorker` is registered and ready
	    navigator.serviceWorker.ready.then(function (registration) {
	      registration.pushManager.getSubscription().then(function (subscription) {
	        //If already access granted, enable push button status
	        //Tell application server to delete subscription
	        if (subscription) {
	          changePushStatus(true);
	        } else {
	          changePushStatus(false);
	        }
	      }).catch(function (error) {
	        console.error('Error occurred while enabling push ', error);
	      });
	    });
	  };
	
	  // Ask User if he/she wants to subscribe to push notifications and then
	  // ..subscribe and send push notification
	  function subscribePush() {
	    navigator.serviceWorker.ready.then(function (registration) {
	      if (!registration.pushManager) {
	        console.log('Your browser doesn\'t support push notification.');
	        return false;
	      }
	
	      //To subscribe `push notification` from push manager
	      registration.pushManager.subscribe({
	        userVisibleOnly: true //Always show notification when received
	      }).then(function (subscription) {
	        console.info('Push notification subscribed.');
	        console.log(subscription);
	        saveSubscriptionID(subscription);
	        changePushStatus(true);
	      }).catch(function (error) {
	        changePushStatus(false);
	        console.error('Push notification subscription error: ', error);
	      });
	    });
	  }
	
	  // Unsubscribe the user from push notifications
	  function unsubscribePush() {
	    navigator.serviceWorker.ready.then(function (registration) {
	      //Get `push subscription`
	      registration.pushManager.getSubscription().then(function (subscription) {
	        //If no `push subscription`, then return
	        if (!subscription) {
	          console.log('Unable to unregister push notification.');
	          return;
	        }
	
	        //Unsubscribe `push notification`
	        subscription.unsubscribe().then(function () {
	          console.info('Push notification unsubscribed.');
	          console.log(subscription);
	          deleteSubscriptionID(subscription);
	          changePushStatus(false);
	        }).catch(function (error) {
	          console.error(error);
	        });
	      }).catch(function (error) {
	        console.error('Failed to unsubscribe push notification.');
	      });
	    });
	  }
	
	  //To change status
	  function changePushStatus(status) {
	    isSubscribed = status;
	    if (status) {
	      tipsElement.html('您已订阅，取消订阅后您将收不到更新提示！');
	      fabPushElement.removeClass('btn-success').addClass('btn-warning').html('取消订阅');
	    } else {
	      tipsElement.html('您未订阅，订阅后您将可以收到更新提示');
	      fabPushElement.removeClass('btn-warning').addClass('btn-success').html('订阅');
	    }
	  }
	
	  function saveSubscriptionID(subscription) {
	    var subscription_id = subscription.endpoint.split('gcm/send/')[1];
	
	    console.log("Subscription ID", subscription_id);
	    new Image().src = 'http://119.29.150.243:3333/api/subscript/' + subscription_id;
	
	    // fetch((location.protocol=='http:' ? 'http://119.29.150.243:3333/api/users'
	    // : 'https://119.29.150.243:3011/api/users'), {
	    //   method: 'post',
	    //   headers: {
	    //     'Accept': 'application/json',
	    //     'Content-Type': 'application/json'
	    //   },
	    //   body: JSON.stringify({
	    //     user_id: subscription_id
	    //   })
	    // });
	  }
	
	  function deleteSubscriptionID(subscription) {
	    var subscription_id = subscription.endpoint.split('gcm/send/')[1];
	
	    new Image().src = 'http://119.29.150.243:3333/api/unsubscript/' + subscription_id;
	    // fetch((location.protocol=='http:' ? 'http://119.29.150.243:3333/api/user/'
	    // : 'https://119.29.150.243:3011/api/user/') + subscription_id, {
	    //   method: 'get',
	    //   headers: {
	    //     'Accept': 'application/json',
	    //     'Content-Type': 'application/json'
	    //   }
	    // });
	  }
	
	  isPushSupported(); //Check for push notification support
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//这是个单例
	
	var m_article = __webpack_require__(11);
	var m_setting = __webpack_require__(16);
	var btnElement, tipsElement, timer;
	
	function updateTips(articleList) {
	    var noContents = articleList.filter(function (o) {
	        return !o.content;
	    });
	    tipsElement.html('已缓存文章：' + (articleList.length - noContents.length) + '/' + articleList.length + '篇');
	}
	
	m_article.onUpdate(function () {
	    if (tipsElement) {
	        m_article.initArticle.then(updateTips);
	    }
	});
	
	//To change status
	function changeStatus(status) {
	    m_setting.set('autoCache', status);
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        m_article.initArticle.then(function (articleList) {
	            updateTips(articleList);
	            if (m_setting.get('autoCache')) {
	                m_article.autoLoad();
	            }
	        });
	    }, 3E3);
	
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
	    btnElement.on('click', function () {
	        changeStatus(!m_setting.get('autoCache'));
	    });
	});

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map