define("intellSearch/0.1.0/tmpl/history",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class="history"> <div class="history_gp"> <div class="g_header"> 最近搜索 </div> <div class="g_list"> ';var arr1=it;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='  <div class="g_item" history-item data-value="'+(value.name)+'">'+(value.name)+'</div>  ';} } out+=' <a class="g_item g_clear" href="javascript:;" history-clear>清除记录</a> </div> </div></div>';return out;
}

});