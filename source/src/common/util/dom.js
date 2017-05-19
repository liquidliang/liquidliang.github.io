module.exports = {
  getWindowHeight: function () {
    return window.innerHeight || window.clientHeight;
  },
  getWindowWidth: function () {
    return window.innerWidth;
  },
  getPageHeight: function () {
    return document.body.scrollHeight || document.documentElement.scrollHeight;
  }
};
