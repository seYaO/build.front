/**
 * Created by ym/10862 09-29
 * @des 新版侧边栏调用，尽量不要写在当前页面的脚本中
 */

var Slidertoolbar = require("slidertoolbar/0.1.0/index");
var Index = {};

Index.init = function(cfg) {
    // Index.getServerNumber();
    Index.slider(cfg);
};

//获取电话号码
Index.getServerNumber = function() {
    var url = "/dujia/ajaxcall.aspx?type=GetTel400";
    $.ajax({
        url: url,
        success: function(data) {
            $(".J_tel").html(data.slice(1, -1));
        },
        error: function() {
            Monitor.log("获取服务器号码失败" + url, "getServerNumber");
        }
    });
};


//右侧通栏部分
Index.getUser = function () {
    var loginInfo = $.cookie("us"),
        userid;
    if (loginInfo) {
        userid = /userid=(\d+)/i.exec(loginInfo);
        userid = userid ? userid[1] : userid;
    }
    return userid;
};
Index.slider = function(cfg){
    var userid = Index.getUser();
    var defalutParam = {
        header: {
            icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
            tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/11/01/10/UL8ID0.jpg"></a>'
        },
        topMenu: [{
            icon: '<a href="http://member.ly.com/center"><div class="ico c-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, {
            icon: '<a href="http://member.ly.com/center/favorites"><div class="ico c-3"></div></a>',
            tooltips: '<a href="http://member.ly.com/center/favorites"><span class="ico-title">我的收藏<i></i></span></a>',
            arrow: false
        }, {
            ideaClass: "udc-link",
            icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
            tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
            arrow: false
        }, {
            icon: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><div class="ico c-5"></div></a>',
            tooltips: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><span class="ico-title">在线客服<i></i></span></a>',
            arrow: false
        }],
        bottomMenu: [{
            icon: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
            tooltips: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
            arrow: false
        }, {
            icon: '<a><div class="ico c-7"></div></a>',
            tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
            tooltipCls: 'chujing-code',
            arrow: false
        }, {
            icon: '<a><div class="ico c-8"></div></a>',
            tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
            tooltipCls: 'app-code',
            arrow: false
        }],
        toTop: true,
        skin:'skin2'
    };
    $.extend(defalutParam, cfg, {});
    var slider = new Slidertoolbar(defalutParam);
    if (userid) {
        slider.resetMenu({
            icon: '<a href="http://member.ly.com/center"><div class="ico c-1-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, 'top', 0);
    }
};
return Index;
