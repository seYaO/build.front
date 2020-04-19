var Index = {},
    AutoComplete = require("autoComplete/0.1.2/index");
    require("common/0.1.0/index");
require("lazyload/0.1.0/index");
require("scrollspy/0.1.0/index");
require("slider/0.1.0/index")($);

var  Slidertoolbar = require("slidertoolbar/0.1.0/index");

Index.init = function () {
    if ($(".sliderCon li").length > 1) {
        $(".sliderCon").slide();
    }
    Index.lazyLoad();
    Index.autoComplete();
    // Index.initScrollSpy();
    Index.slider();
    Index.ClixkMore();
};

Index.autoComplete = function () {
    var autoComplete = new AutoComplete();
    autoComplete.init({
        showLabel: true,
        checkFlag: true,
        searchContent: $("#txtScenicValue"),
        matchContent: $("#matchContent"),
        matchUrl: $("#matchDest").val(),
        pageLabel: "/lineWanle/wifi/homepage",
        hotSearch: $(".HotSearch"),
        pagetype: "wifihome"
    });
};

// Index.initScrollSpy = function () {
//     $(".fixed-nav .fixed-left").scrollspy({
//         pClass: ".fixed-nav",
//         curClass: "current",
//         contentClass: ".J_NavBox",
//         topH: 40,
//         renderNav: function (sid, stxt, el, index) {
//             if (!index) {
//                 return '<a class="current" href="#' + sid + '"><span>' + stxt + '</span></a>';
//             } else {
//                 return '<a href="#' + sid + '"><span>' + stxt + '</span></a>';
//             }
//         }
//     });
// };

Index.lazyLoad = function () {
    if (Index.isInit) {
        var imgList = $(".pro-lists img").not("[data-img-loaded]");
        $("body").trigger("addElements", imgList);
    } else {
        $(".pro-lists img").lazyload({
            "data_attribute": "img",
            effect: 'fadeIn'
        });
        Index.isInit = true;
    }
};

Index.getUser = function () {
    var loginInfo = $.cookie("us"),
        userid;
    if (loginInfo) {
        userid = /userid=(\d+)/i.exec(loginInfo);
        userid = userid ? userid[1] : userid;
    }
    return userid;
};

Index.slider = function () {
    var userid = Index.getUser();
    var slider = new Slidertoolbar({
        header: {
            icon: $("#ImgUrl").find("em").html(),
            tooltips: $("#ImgUrl").find("span").html()
        },
        topMenu: [{
            icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1"></div></a>',
            tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        },{
            icon: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_10" class="J_trace"><div class="ico c-3"></div></a>',
            tooltips: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_11"><span class="ico-title">我的收藏<i></i></span></a>',
            arrow: false
        },{
            ideaClass: "udc-link",
            icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
            tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
            arrow: false
        },{
            icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><div class="ico c-5"></div></a>',
            tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><span class="ico-title">在线客服<i></i></span></a>',
            arrow: false
        }],
        bottomMenu: [{
            icon: '<a class="Qr_icon"><div class="ico c-7"></div></a>',
            tooltips: '<a class="Qrcode"><span class="ico-title"><img src="'+$("#wxQRcode").attr("src")+'"><i></i></span></a>',
            arrow: false
        }],
        toTop: true,
        pageName: "全球WiFi首页",
        skin: 'skin2'
    });
    if (userid) {
        slider.resetMenu({
            icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1-1"></div></a>',
            tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, 'top', 0);
    }
};

Index.ClixkMore = function(){
    $(".click-more a").on("click", function () {
    var parents = $(this).parents(".dl").toggleClass("shut");
    $(this).html(parents.is(".shut") ? "收起<i></i>" : "更多<i></i>");
    });
};

Index.init();
