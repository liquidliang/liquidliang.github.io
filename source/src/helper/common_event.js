const m_util = require('common/util')
//data-on="?m=go" data-url="<%=o.href%>"

function onClick(name, fun){
  if(fun){
    BCD.addEvent(name, function(ele, option, data){
      ele.on('click', function(e){
        fun(ele, option, data);
        m_util.stopBubble(e);
      })
    });
  }
}

const go = (ele, option, data)=>{
    BCD.go(ele.data('url'));
};
onClick('go', go);
//data-on="?m=back"
const back = (ele, option, data)=>{
  history.back();
};
onClick('back', back);

const replaceHash = (ele, option, data)=>{
  BCD.replaceHash(ele.data('url'));
};
onClick('replaceHash', replaceHash);
//事件绑定
module.exports = {
  onClick,
  go,
  back,
  replaceHash
};
