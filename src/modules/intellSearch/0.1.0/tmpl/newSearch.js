define("intellSearch/0.1.0/tmpl/newSearch",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class="new_play ly_search"> <div class="ly_search_row"> <div class="ly_search_inputgp" search-wapper> <input type="text" search-input placeholder="'+(it.placeholder)+'"> <div class="ly_search_gp" search-group></div> <div class=\'new-label\'> ';var hotSearch = it.hotSearch;out+=' ';if(hotSearch&&hotSearch.length>0){out+=' ';var arr1=hotSearch;if(arr1){var value,i1=-1,l1=arr1.length-1;while(i1<l1){value=arr1[i1+=1];out+=' <li> <a href='+(value.hotUrl)+' target=\'_blank\'>'+(value.hotName)+'</a> </li> ';} } out+=' ';}out+=' </div> </div> <label class="ly_search_btn" search-submit>'+(it.submitName)+'</label> </div></div>';return out;
}

});