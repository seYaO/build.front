;
!function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function () {
            return this
        }).call();
        root.Share = factory();
    }
}(function () {
    var Share = function () {
        var self = this;
        if (!(self instanceof Share)) {
            return new Share();
        }
    };
    Share.prototype = {
        init: function (cfg) {
            var self = this;
            $.extend(self.cfg, cfg || {});

            //app
            /*if(self.checkIsApp()){
                if(window._tc_bridge_bar){
                    self.initTcShare();
                }else{
                    self.loader(self.cfg.tcbridge,function(){
                        self.initTcShare();
                    });
                }
            }*/

            //微信
            //if(self.checkIsWX()){
            if(true){
                if(window.wx){
                    self.initWxShare();
                }else{
                    self.loader(self.cfg.jssdk,function(){
                        self.initWxShare();
                    });
                }
            }
        },
        cfg: {
            jssdk: 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
            tcbridge : 'http://js.40017.cn/cn/min/??/touch/hb/c/bridge.1.3.0.js'
        },
        loader: function (url, callback) {
            var head = $('head')[0],
                src = url.replace(/\s/g, ''),
                script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', src);
            script.onload = function(){
                callback && callback();
            }
            head.appendChild(script);
        },
        checkIsApp: function(){
            return /TcTravel\/(\d+\.\d+\.\d+)/.test(navigator.userAgent);
        },
        checkIsWX: function(){
            return /MicroMessenger/.test(navigator.userAgent);
        },
        getShareInfo : function(){
            var title = 'test';
            var link = window.location.href;
            var imgUrl = 'http://img1.40017.cn/touch/v/2015/zt/2016/29694/share.jpg';

            var info = {
                title: $("input[name=tcsharetext]").val() ||'', // 分享标题
                desc:  $("input[name=tcDesc]").val() ||'', // 分享描述
                link:  $("input[name=tcshareurl]").val() ||'', // 分享链接
                imgUrl: $("input[name=tcshareimg]").val() ||'', // 分享图标

                //title: title, // 分享标题
                //desc:  title, // 分享描述
                //link:  link, // 分享链接
                //imgUrl: imgUrl, // 分享图标

                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            }

            return info;
        },
        initTcShare : function(){
            var self = this,
                info = self.getShareInfo();
            setTimeout(function(){
                var jsonObj = {
                    "param": {
                        "tcsharetxt": info.title + info.link,
                        "tcsharedesc": info.title,//742开始有
                        "tcshareurl": info.link,
                        "tcshareimg": info.imgUrl,
                        "hideToast": "0",// 0 默认显示|1 隐藏Toast 仅朋友圈 740添加开始支持回调
                        "shareType": "pengyouquan",//742添加，tcsharetype=true时有效，pengyouquan:朋友圈(默认)|haoyou：好友
                        "tcsharetype": false
                    },
                    "CBPluginName": "_tc_bridge_cb",
                    "CBTagName": "cb_show_share"
                };
                window._tc_bridge_bar.shareInfoFromH5(jsonObj);
            },0);

            window._tc_bridge_cb = {};
            window._tc_bridge_cb.cb_show_share = function (data) {
                alert(JSON.stringify(data))
            };

        },
        initWxShare : function(){
            var self = this;
            $.ajax({
                url: "http://www.ly.com/huochepiao/resource/WXJsApi/GetWXApiConfig",
                type: "get",
                dataType: "jsonp",
                data: {
                    url: window.location.href
                },
                success: function (data) {
                    if (data.Status != "true" || data.MessageCode != "1000") {
                        return false;
                    }
                    wx.config({
                        debug: true,
                        appId: data.Data.AppId,
                        timestamp: data.Data.TimeStamp,
                        nonceStr: data.Data.NonceStr,
                        signature: data.Data.Signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                    });
                    wx.ready(function () {
                        self.wxShareEvents();
                    });
                    wx.error(function (res) {
                        console.log('jssdk error');
                    });
                },
                fail: function (c) {
                }
            });
        },
        wxShareEvents : function(){
            var self = this,
                info = self.getShareInfo();
            wx.onMenuShareTimeline(info);
            wx.onMenuShareAppMessage(info);
            wx.onMenuShareQQ(info);
            wx.onMenuShareWeibo(info);
            wx.onMenuShareQZone(info);
        }
    };
    var Share = new Share();

    Share.init();

    return Share;
});

