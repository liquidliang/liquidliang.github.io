const m_util = require('common/util')
//data-on="?m=go" data-url="<%=o.href%>"
const go = (ele, option, data)=>{
  ele.on('click', function(e){
    BCD.go(ele.data('url'));
    m_util.stopBubble(e);
  })
};
BCD.addEvent('go', go);
//data-on="?m=back"
const back = (ele, option, data)=>{
  ele.on('click', function(e){
    history.back();
    m_util.stopBubble(e);
  })
};
BCD.addEvent('back', back);

const replaceHash = (ele, option, data)=>{
  ele.on('click', function(e){
    BCD.replaceHash(ele.data('url'));
    m_util.stopBubble(e);
  })
};
BCD.addEvent('replaceHash', go);
//事件绑定
module.exports = {
  go,
  back,
  replaceHash
};
