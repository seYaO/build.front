(function($){
	Index = {};
	var Common = require("/modules-lite/common/index");
	Index.init = function(){
		Index.initEvent();
	}
	Index.initEvent = function(){
		$('.J_back').on('click',function(){
			window.history.go(-1);
		})
	}
	module.exports = Index;
})(Zepto)