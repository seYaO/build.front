// 
;
! function($, window, document, undefined) {
    var convert = require("./_convert.js");
    var thisObj = thisObj || {};
    $.extend(thisObj, {
        init: function() {
            var tcshareurl = $("#tcshareurl");
            this.bindEvent();
        },
        bindEvent: function() {
            var _this = this;
            var startInterval;
            var complete = $(".content-complete");
            startInterval = setInterval(loadData, 50);

            function loadData() {
                if (document.readyState == "complete") {
                    clearInterval(startInterval);
                    convert(false);
                }
            }
        }
    });
    $(document).ready(function() {
        thisObj.init();
    });
}(Zepto, window, document);
