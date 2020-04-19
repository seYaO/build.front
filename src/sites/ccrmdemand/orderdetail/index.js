(function($){
	var Index = {},Common;
	Index.init = function(){
        Common = require("../common/common");
        Index.initBargain();
	};
	
	Index.initBargain = function(){
        console.log("aaa");
        /*$.ajax( {
            type: "GET",
            url: bargainUrl,
            data: bargainParams,
            dataType: "jsonp",
            success: function(data){

            }
        });*/
    };

	module.exports = Index;
})(Zepto)
