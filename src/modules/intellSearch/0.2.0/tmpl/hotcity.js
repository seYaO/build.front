define("intellSearch/0.2.0/tmpl/hotcity",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class="hotcity"> <div class="hotcity_gp"> <div class="g_header"> 热门搜索 </div> <div class="g_list"> ';var arr1=it;if(arr1){var item,i1=-1,l1=arr1.length-1;while(i1<l1){item=arr1[i1+=1];out+=' ';var _city = item.city;var _visa = item.visa;out+=' <span class="g_item" trace="'+(_city)+'" title="'+(_city)+'" data-value="'+(_city)+'" hotcity-item> <em>'+(_city)+'</em> <b class="'+(_visa === "1" ? "visa-free" : (_visa === "2" && "visa-land"))+'"></b> </span> ';} } out+=' </div> </div></div>';return out;
}

});