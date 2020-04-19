define("datepicker/0.2.0/tmpl/calendar-group",[],function(require,exports,module) {

module.exports = function anonymous(it
/**/) {
var out='<div class="dj-calendar"> <div class="panel"> ';if(!it.hideButtons.contain('prevmonth')){out+=' <a href="javascript:;" hidefocus="true" class="ico previous-month" data-btn-premonth></a> ';}out+=' ';if(!it.hideButtons.contain('nextmonth')){out+=' <a href="javascript:;" hidefocus="true" class="ico next-month" data-btn-nextmonth></a> ';}out+=' <div class="main-group"> <div class="main-group-show" style="width:'+(it.width)+'"> </div> </div> </div></div>';return out;
}

});