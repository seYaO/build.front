
// require('modules/common/0.1.0/storage')
// require('modules/abTrip/0.1.0/index')

$(document).on('click', function(){
    require.async('dialog/0.1.0/index')
    require.async('common/0.1.0/index')
    require.async('./views/partial.dot', function(tmpl){
        fn()
    })
})


// var monitorModule = require("modules/monitor/0.1.1/index");
// var Slidertoolbar = require("modules/slidertoolbar/0.1.0/index");
//monitorModule.init();
// var esq = require("modules/esq/0.1.0/pc/index");
require('./a.js')
var Index = {};
Index.clickEvent = function () {
    $(window).on('scroll', function () {
        var top = $(window).scrollTop();
        if (top < 600) {
            $('.side-nav').hide();
        } else {
            $('.side-nav').show();
        }
    });
    // $('.side-nav>ul').scrollspy({
    //     topH: 0,
    //     pClass: ".side-nav",
    //     curClass: 'active',
    //     contentClass: '.J_NavBox',
    //     tabList: $(".side-nav li"),
    //     scrollFn: function (el, isDown) { }
    // });
    $(".textbtn").on("click", function () {
        $(".mask").removeClass("none")
    });
    $(".chacha").on("click", function () {
        $(".mask").addClass("none")
    })
    $(".xl").mouseover(function () {
        $(".star11").addClass("donghua")
    })
    $(".xl").mouseout(function () {
        $(".star11").removeClass("donghua")
    })
};
Index.init = function (cfg) {
    Index.slider();
    Index.getServerNumber();
    Index.clickEvent();
};
//右侧通栏部分
//获取电话号码
Index.getServerNumber = function () {
    var url = "/dujia/ajaxcall.aspx?type=GetTel400";
    $.ajax({
        url: url,
        success: function (data) {
            $(".J_tel").html(data.slice(1, -1));
        },
        error: function () {
            Monitor.log("获取服务器号码失败" + url, "getServerNumber");
        }
    });
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
            icon: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/haidao.html"><img src="http://img1.40017.cn/cn/v/2015/index2016/right-top.jpg"></a>',
            tooltips: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/haidao.html"><img src="http://img1.40017.cn/cn/v/2015/index2016/top-haidao.jpg"></a>'
        },
        topMenu: [{
            icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, {
                icon: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><div class="ico c-3"></div></a>',
                tooltips: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><div class="ico c-4"></div></a>',
                tooltips: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a class="ico c-2"></a>',
                tooltips: '<a><span class="ico-title"><b class="J_tel">4007-777-777</b><i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
        bottomMenu: [{
            icon: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
            tooltips: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
            arrow: false
        }, {
                icon: '<a><div class="ico c-7"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
                tooltipCls: 'chujing-code',
                arrow: false
            }, {
                icon: '<a><div class="ico c-8"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
                tooltipCls: 'app-code',
                arrow: false
            }],
        toTop: true,
        skin: "skin2"
    });
    if (userid) {
        slider.resetMenu({
            icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, 'top', 0);
    }
};
module.exports = Index