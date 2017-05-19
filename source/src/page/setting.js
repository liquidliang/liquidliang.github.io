require('helper/notification.js');
require('helper/auto_cache.js');


module.exports = function (page) {
  page.addClass('text-center').html('<p style="margin-top: 200px;with:600px"><label>' +
    (window.Notification ? '您已禁止了通知，请重新设置' : '您的浏览器不支持该特性，请使用最新的Chrome浏览器') + '</label>' +
    '<button style="margin-left: 20px;min-width: 150px;"' +
    ' data-on="?m=subscribePush"' +
    ' class="btn btn-warning btn-sm">订阅</button></p>' +
    '<p style="margin-top: 50px;with:600px"><label></label><button style="margin-left: 20px;min-width: 150px;"' +
    ' data-on="?m=autoCache"' +
    ' class="btn btn-warning btn-sm">自动缓存全站</button></p>'
  );
};
