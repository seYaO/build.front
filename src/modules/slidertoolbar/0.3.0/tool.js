/**
 * Created by byr17699 on 2017/2/22.
 * 海外玩乐侧栏
 */
var Slidertoolbar = require('slidertoolbar/0.1.0/index');
var Index = {};

Index.init = function () {

};

// 获取电话号码
Index.getServerNumber = function () {
    var url = "/dujia/ajaxcall.aspx?type=GetTel400";
    $.ajax({
        url: url,
        success: function (data) {
            $(".J_tel").html(data.slice(1, -1));
        },
        error: function () {
            Monitor.log('获取服务器号码失败' + url, 'getServerNumber');
        }
    });
};

// 右侧通栏
Index.getUser = function () {
    var loginInfo = $.cookie('us'),
        userid;
    if (loginInfo) {
        userid = /usreid=(\d+)/i.exec(loginInfo);
        userid = userid ? userid[1] : userid;
    }
    return userid;
};
Index.slider = function () {
    var userid = Index.getUser();
    var defaultParam = {
        header: {
            icon: $("#ImgUrl").find("em").html(),
            tooltips: $("#ImgUrl").find("span").html()
        },
        topMenu: [{
            icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1"></div></a>',
            tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, {
            icon: '<div class="ico c-6 J_trace"  trace="slider_10"></div>',
            tooltips: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_11"><span class="ico-title">我的收藏<i></i></span></a>',
            arrow: false
        }, {
            ideaClass: "udc-link",
            icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
            tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
            arrow: false
        }, {
            icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><div class="ico c-5"></div></a>',
            tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><span class="ico-title">在线服务<i></i></span></a>',
            arrow: false
        }],
        bottomMenu: [{
            icon: '<a class="Qr_icon"><div class="ico c-7"></div></a>',
            tooltips: '<a class="Qrcode"><span class="ico-title"><img src="' + $("#wxQRcode").attr("src") + '"><i></i></span></a>',
            arrow: false
        }],
        toTop: true,
        skin: 'skin2'
    };
    if(userid){
        slider.resetMenu({
            icon: '<a href="//member.ly.com/center"><div class="ico c-1-1"></div></a>',
            tooltips: '<a href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        },'top',0);
    }
};

return Index;