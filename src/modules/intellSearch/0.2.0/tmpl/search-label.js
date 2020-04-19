define("intellSearch/0.2.0/tmpl/search-label",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class=\'new-label\'> ';var hotSearch = it;out+=' ';if(hotSearch&&hotSearch.length>0){out+=' ';var arr1=hotSearch;if(arr1){var value,i1=-1,l1=arr1.length-1;while(i1<l1){value=arr1[i1+=1];out+=' <li> <a href='+(value.hotUrl)+' target=\'_blank\'>'+(value.hotName)+'</a> </li> ';} } out+=' ';}out+='</div>';return out;
}

});