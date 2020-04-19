define("intellSearch/0.1.0/tmpl/intellSearch",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='﻿<div class="ly_intelsearch"> ';var count=(it.list?it.list.length:0);out+=' ';var n=0;out+=' ';var arr1=it.list;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+=' ';var _level=item.level||1;out+=' ';if(item.isdata===false){out+=' <div class="intelsearch_item"> '+(item.showvalue)+' </div> ';}else{out+=' ';var _select=(n==0)?"select":"";out+=' <div class="intelsearch_item '+(_select)+'" intelsearch-item style="text-indent: '+((_level*20))+'px;" data-value="'+(item.value)+'" data-text="'+(item.text)+'" title="'+(item.text)+'" data-link="'+(item.link)+'"> '+(item.showvalue)+' </div> ';n++;out+=' ';}out+=' ';} } out+=' ';if(it.showCount){out+=' <div class="intelsearch_tip">约<span class="count">'+(n)+'</span>个结果</div> ';}out+='</div>';return out;
}

});