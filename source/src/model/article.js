const m_util = require('common/util/index');
const m_search = require('helper/search');
const m_readHistory = require('model/read_history');
const m_readFavor = require('model/read_favor');
const m_setting = require('model/setting');
const swPostMessage = require('helper/sw_post_message.js');
const m_ability = require('helper/ability.js');
const m_promiseAjax = require('helper/promise_ajax.js');
const m_loadJS = require('helper/load_lib');
let catalogList = []; //目录列表
let catalogDict = {};
let articleList = []; //文件列表
let articleDict = {};
let sidebarList = []; //sidebar文件列表(sidebar文件也可以在articleDict中索引到)
let bookList = []; //书籍列表
let bookDict = {};
let tagList = [];
let startTime = m_util.now();
let isPreload = false;
const markdownCacheName = 'swblog-markdown';
const sidebarName = '$sidebar$';
const getSidebarPath = (path) => path + '/' + sidebarName + '.md';
const articleModel = new BCD.Model(articleDict);

BCD.addEvent('mkview', function (ele, option, data) {
  let name = m_util.getRandomName();
  let result;
  if ('idx' in option) {
    let item = data.list[option.idx];
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

    let innerHtml = ele.html();
    if (/(<br>|<p><\/p>){2,}/.test(innerHtml)) {
      ele.html(innerHtml.replace(/(<br>|<p><\/p>){2,}/, ''));
    }

    if (result.indexOf('[TOC]') > -1 && location.hash.indexOf('.md') > 0) { //兼容TOC目录
      let baseHash = location.hash.replace(/\.md\/.*/, '.md');
      ele.html(ele.html()
        .replace(/href="#([^"]*)/g, function ($0, $1) {
          if ($1) {
            return 'href="' + baseHash + '/' + $1;
          }
          return $0
        }).replace(/name="([^"]*)/g, function ($0, $1) {
          if ($1) {
            return 'name="' + baseHash.substr(1) + '/' + $1;
          }
          return $0
        }));
    }
    ele.find('a[href]').each(function(){
      var aDom = $(this);
      var href = aDom.attr('href');
      if(/^http/.test(href)){
        aDom.attr('target', '_blank');
        aDom.attr('rel', 'noopener');
      }else if(/html$|html$/.test(href)){ //GitBook不同章节之间跳转
          aDom.attr('href', location.hash.replace(/[^//]+\.md/, '') + href.replace(/html$|html$/, 'md'));
      }
    });


  });
});

const getName = (path) => {
  let arr = path.match(/\/([^/.]+)[.\w-_]+$/);
  return arr ? arr[1] : '';
}

const getURL = (o) => encodeURI(location.origin + '/' + o.path + '?t=' + o.mtime);
const getPath = (pathWithSearch) => decodeURIComponent(pathWithSearch.replace(location.origin + '/', '').replace(/\?[^?]+/, ''));
const getNoSearch = function (url) {
  return url.replace(/\?[^?]+/, '');
}

const getSortContent = (content, paragraph = 10) => {
  let len = 500;
  let minLen = len / 2;
  let ret = content.substring(0, len);
  let partCount = 0;
  let partIndex = 0;
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
  let getContent = (str, reg) => {
    let arr = str.split(reg).filter(o => !!o);
    let count = 0;
    if (arr && arr.length > 2) {
      let idx = arr.length - 1;
      if (arr.some((o, i) => {
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
  }
  let con = getContent(ret, /\s*#+\s*/);
  if (con) {
    return con;
  }
  con = getContent(ret, /\s+/);
  if (con) {
    return con;
  }
  return ret;
}

const processItem = (item, content) => {
  if(!content){
      return;
  }
  if (item.title == sidebarName) {
    item.content = content;
    return item;
  }
  let isRaw = true;
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
    let arr = content.match(/^[\s]*#[^\n\(]+[\n]/);
    if (arr) {
      let title = arr[0];
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

const preload = (obj) => {
  let count = 0;
  for (var pathWithSearch in obj) {
    let path = getPath(pathWithSearch);
    let item;
    if (item = articleDict[path]) {
      count++;
      processItem(item, obj[pathWithSearch]);
    }
  }
  let totalList = sidebarList.concat(articleList);
  let existDict = {};
  totalList.forEach(o => {
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

const init = (list) => {
  catalogList = []; //目录列表
  articleList = []; //文件列表
  sidebarList = [];
  bookList = [];
  let tagSet = new Set();
  let processArticle = (o) => {
    let {
      path = '', mtime
    } = o;
    if (o.isDirectory) {
      let tags = path.split('/').slice(1);
      tags.forEach(o => tagSet.add(o));
      let item = {
        path,
        time: m_util.getTime(mtime),
        href: '#!/' + encodeURIComponent(o.path),
        title: path.slice(path.lastIndexOf('/') + 1),
        tagList: tags
      };
      catalogList.push(item);
    } else {
      let tags = path.split('/').slice(1, -1);
      tags.forEach(o => tagSet.add(o));
      let item = {
        path,
        mtime,
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
        let content = BCD.cache.getLocal(o.path);
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
    }
  };
  list.forEach(processArticle);
  articleList = articleList.filter(o => {
    if (o.title == sidebarName) {
      sidebarList.push(o);
      return false;
    }
    return true;
  });
  catalogList = catalogList.filter(o => {
    if (articleDict[getSidebarPath(o.path)]) {
      bookDict[o.path] = o;
      bookList.push(o);
      return false;
    }
    catalogDict[o.path] = o;
    return true;
  });
  articleList = articleList.sort((a, b) => {
    return b.mtime - a.mtime;
  });
  tagList = [...tagSet];
};

const autoLoad = function(){
  var totalList = sidebarList.concat(articleList);
  var noContents = totalList.filter(function(o){
      return !o.content;
  });
  var batchList = [];
  var item = noContents.splice(0, 5);
  while(item.length){
    batchList.push(item);
    item = noContents.splice(0, 5);
  }
  m_util.iterator(batchList, function(item, next, list){
    if(m_setting.get('autoCache')){
      fetchContent(item).then(next).then(function(){
        articleModel.trigger('update_content');
      });
    }
  });
}

let processCount = 0;
//先用缓存，请求回来再更新
const initArticle = new Promise((resolve) => {
  BCD.ajaxCache('./json/article.json', (data) => {
    var start = performance.now();
    init(data);
    console.log('init:', performance.now()-start);
    processCount++;
    // if (processCount === 2) { //如果网络请求失败，这里不会被执行
    //   let totalList = sidebarList.concat(articleList);
    //   swPostMessage({
    //     m: 'preloadAtricle',
    //     data: totalList.map(getURL)
    //   }, preload);
    // }
    resolve(articleList);
    console.log('resolve:', performance.now()-start);
    return data && 1; //缓存数据到localStorage
  }, 0, 2E3, true);
});

//获取包含相关tag文章列表
const getTagArticles = (tag) => {
  var retList = articleList;
  if (tag) {
    retList = articleList.filter(o => o.tagList &&
      o.tagList.indexOf(tag) > -1);
  }
  return retList.sort(function (a, b) {
    return (b.mtime - (m_readHistory.getReadTime(b.path) || 0)) - (a.mtime - (m_readHistory.getReadTime(a.path) || 0));
  });;
};

const fetchContent = (list) => {
  let urlList = list.filter(o => articleDict[o.path] && !articleDict[o.path].content).map(getURL);
  return m_promiseAjax.batchFetch(urlList, {
    dataType: 'text',
    cache: m_ability.supportCache ? '' : 'normal_local',
    timeout: 5E3,
    success: function (str) {
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


const getList = (method) => (tag, page = 0, count = 10) => {
  page = parseInt(page || 0);
  let start = page * count;
  let totalList = method(tag);
  let list = totalList.slice(start, start + count);
  return fetchContent(list).then(() => {
    return {
      tag,
      page,
      count,
      num: totalList.length,
      list: list.map(o => articleDict[o.path]).filter(o => !!(o && o.content))
    };
  });
};

const getChildCatalog = (path) => {
  let catalog = catalogDict[path];
  if (catalog) {
    let tagList = catalog.tagList;
    let tagLength = tagList.length + 1;
    return bookList.concat(catalogList).filter(o => o.tagList.length &&
      tagList.every((tag, i) => o.tagList.length == tagLength && tag == o.tagList[i]));
  }
  return [];
};

const getCatalogArticles = (path) => {
  let catalog = catalogDict[path];
  if (catalog) {
    let tagList = catalog.tagList;
    return articleList.filter(o => o.tagList.length &&
      tagList.every((tag, i) => tag == o.tagList[i])).sort((a, b) => a.tagList.length - b.tagList.length);
  }
  return [];
};
const getFavorArticles = () => {
  return articleList.filter(o => m_readFavor.isFavor(o.path)).sort((a, b) => m_readFavor.getFavorTime(b.path) - m_readFavor.getFavorTime(a.path));
};

const testItem = (reg, item) => {
  let testType = 0;
  let obj = {};
  let searchWeight = 0;
  let titleMatchDict = {};
  let contentMatchDict = {};
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
    let titleMathLength = 0;
    for (var key in titleMatchDict) {
      titleMathLength += /\w/.test(key) ? titleMatchDict[key] : Math.pow(1.6, key.length - 1) * titleMatchDict[key];
    }
    searchWeight += titleMathLength / item.title.length;
  }
  if (item.content && reg.test(item.content)) {
    let pointList = [];
    obj.content = item.content.replace(reg, function ($0, point) {
      if (contentMatchDict[$0]) {
        contentMatchDict[$0]++;
      } else {
        contentMatchDict[$0] = 1;
      }
      let weight = /\w/.test($0) ? 2 : $0.length;
      pointList.push({
        point,
        weight
      });
      return '<font color=#a94442>' + $0 + '</font>';
    });
    pointList = pointList.sort((a, b) => b.weight - a.weight);
    let startPoint = pointList[0].point;
    let start = startPoint - 30;
    let summary = item.content.substr(start < 0 ? 0 : start);
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
    let contentMathLength = 0;

    for (var key in contentMatchDict) {
      contentMathLength += /\w/.test(key) ? contentMatchDict[key] : Math.pow(1.6, key.length - 1) * contentMatchDict[key];
    }
    searchWeight += contentMathLength / Math.pow(item.content.length, 0.6);
  }
  obj.testType = testType;
  /*******calculate search weight**********/

  obj.searchWeight = searchWeight;
  return Object.assign({}, item, obj);
};


const searchList = (word, callback, isCommend = false) => {
  let reg = m_search.getGlobalRegex(word);
  let fitList = [];
  let remainList = [];
  let ajaxList = [];
  let totalList = articleList.filter(o => o);

  const searchCallback = (list) => {
    let resultList = list.filter(o => o.testType > 0).sort((a, b) => {
      let ret = b.searchWeight - a.searchWeight;
      if (ret === 0) {
        return b.content.length - a.content.length + (b.mtime - a.mtime) / 1E5;
      }
      return ret;
    });
    if (resultList.length || list.length >= totalList.length) {
      console.table(resultList.map(o => {
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
  const batchProcess = (list, next) => {
    let subList = list.splice(0, 10);
    fetchContent(subList).then(() => {
      searchCallback(subList.map(o => testItem(reg, articleDict[o.path])));
      if (list.length) {
        batchProcess(list, next);
      } else if (next) {
        next();
      }
    })
  };
  totalList.forEach(o => {
    let item = articleDict[o.path];
    if (item) {
      let testObj = testItem(reg, item);
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
    return callback(ajaxList.concat(fitList).filter(o => o.testType > 0).sort((a, b) => b.searchWeight - a.searchWeight));
  }
  searchCallback(fitList);
  batchProcess(ajaxList, function () {
    batchProcess(remainList);
  })
  return remainList;
};



//搜索直达
const searchDirect = (word) => {
  let reg = m_search.getGlobalRegex(word);
  return articleList.filter(o => reg.test(o.title)).map(o => {
    let weight = 0;
    let item = {
      href: o.href,
      title: o.title.replace(reg, function ($0) {
        weight += $0.length;
        return '<span class="text-danger">' + $0 + '</span>';
      })
    };
    item.weight = weight
    return item;
  }).sort((a, b) => b.weight - a.weight);
};


module.exports = {
  getName,
  isPreload,
  startTime,
  initArticle,
  catalogDict,
  articleDict,
  hasCatalog: (path) => !!catalogDict[path],
  hasArticle: (path) => !!articleDict[path],
  hasBook: (path) => !!bookDict[path],
  getCatalogMessage: (path) => catalogDict[path],
  getCatalogs: () => catalogList,
  getBooks: () => bookList,
  getTagArticles,
  getTags: () => tagList,
  getSidebarPath,
  getArticleList: () => articleList.map(o => articleDict[o.path]),
  getListByCatalog: getList(getCatalogArticles),
  getChildCatalog,
  getListByTag: getList(getTagArticles),
  getListByFavor: getList(getFavorArticles),
  getArticleContent: (path) => fetchContent([articleDict[path]])
    .then(() => articleDict[path]),
  searchDirect,
  searchList,
  autoLoad,
  onUpdate: function(callback){
      var timer;
      articleModel.on('update_content', function(){
          clearTimeout(timer);
          timer = setTimeout(callback, 100);
      });
  }
};
