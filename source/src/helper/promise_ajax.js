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
var _fetch = function(options) {
    var cache = options.cache || "";
    var defer = $.Deferred();

    if(BCD.is.s(options)){
      options = {
        url: options
      };
    }
    BCD.ajaxCache($.extend({
        timeout: 6e3,
        xhrFields: {
            withCredentials: true
        },
        useCache: cache.indexOf('next') === 0,
    }, options, {
        success: function(data){
            try{
                defer.resolve(data);
                var isRight;
                var storage = cache && (cache.indexOf('local') > 0 ? 1 : 2);
                if(options.success){
                    isRight = options.success(data);
                    if(isRight){
                        return storage;
                    }
                }else{
                    isRight = data && data.ret===0;
                }
                return isRight !== false && storage;
            }catch(e){
                console.log(e, 'promise_ajax fetch url "' + options.url + '", has wrong in success');
            }
        },
        error: function(){
            try{
                console.log(options.url + ' promise_ajax error');
                defer.resolve(false);
                if(options.errors){
                    options.errors.apply(this, arguments);
                }
            }catch(e){
                console.log(e, 'promise_ajax fetch url "' + options.url + '", has wrong in error');
            }
        }
    }));
    return defer.promise();
};

function batchFetch(urls, option){
    var promiseList = (urls || []).map(function(url){
        return _fetch($.extend({
            url: url
        }, option));
    });
    return $.when.apply(promiseList, promiseList).then(function(){
        return arguments;
    });
}
//事件绑定
module.exports = {
    fetch: _fetch,
    batchFetch: batchFetch
};
