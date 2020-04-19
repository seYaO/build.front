module.exports = function (_conf) {
    var conf = {
        wishUrl: "http://www.ly.com/zhuanti/wishlist/?cjtp",//许愿地址
        fromUrlRege: "m.ly.com/dujia",//来源页面
        triggerUrlRege: 'touch-list;touch-index'  //触发页面
    };
    $.extend(conf, _conf);

    function fn_showmask() {
        var str = '<div class="ui_wish_gp"><div class="btn_close"></div><div class="bg_top1"></div><div class="bg_top2"></div><div class="bg_top3"></div><div class="bg_top4"></div>' +
            '<div class="btn_wish"></div><div class="btn_continue"></div></div>';

        var _width = $(window).width();
        if (parseInt(_width) != _width && Monitor) {
            try {
                Monitor.log("非整数屏幕宽度:" + _width + ',userAgent:' + navigator.userAgent, 'error', 'mobile-common');
            } catch (e) {

            }
        }
        //做一个max处理
        //_width = (_width > 320) ? 320 : _width;     
        //var _font_size = _width * 100 / 640 + 'px';
        var _font_size = "4rem";
        var $obj = $('<div>', { "class": "ui_wish_mask", "html": str, "style": "font-size:" + _font_size }).appendTo(document.body);

        $obj.show();
        $obj.find('.btn_close').click(fn_hidemask);
        $obj.find('.btn_wish').click(function () {
            document.location.href = conf.wishUrl;
        });
        $obj.find('.btn_continue').click(fn_hidemask);

        function fn_hidemask() {
            $obj.fadeOut(function () {
                $obj.remove();
            });
        }
    }
    //fn_showmask();

    //判断是否刷新----------start
    try {      
        var lasthref = sessionStorage.getItem("wish_lasthref");
        if (lasthref && lasthref == document.location.href) {
            return;
        }
        else {
            sessionStorage.setItem("wish_lasthref", document.location.href);
        }       

    } catch (e) {

    }

    //----------------end-------

    //var locHref = location.href.split("?")[0];
    //原逻辑判断前一个页面是出境
    //var refeHref = (document.referrer) ? document.referrer.split("?")[0] : '';
    //现逻辑判断当前页面(即用户打开的第一个页面)  
    var pageid = (Monitor) ? Monitor.getPageId() : "";
    if (conf.triggerUrlRege.indexOf(pageid) > -1) {
        var visitcount = $.cookie("wish_visitcount");      
        var hasvisit = $.cookie("wish_hasvisit");
        if (visitcount == null) {
            visitcount = 0;
        };
        visitcount++;
        if (!hasvisit) {
            fn_showmask();
            $.cookie('wish_hasvisit', 1, { expires: 1, path: '/' });
        }
        $.cookie('wish_visitcount', visitcount, { expires: 1, path: '/' });
    }
   
};
