var o_setting = BCD.cache.getLocal('swblog_setting', {autoCache: false});

function set(key, val){
  o_setting.key = val;
  BCD.cache.setLocal('swblog_setting', o_setting, {permanent: true});
}

function get(key){
  return key ? o_setting.key : o_setting;
}

module.exports = {
  set,
  get
}
