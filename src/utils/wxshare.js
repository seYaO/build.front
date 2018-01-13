function sendMessage() {
    var shareImg = document.getElementById('tcshareimg').value;
    var shareTitle = document.getElementById('tcsharetext').value;
    var shareUrl = document.getElementById('tcshareurl').value;
    var shareDesc = document.getElementById('tcDesc').value;
    try {
        WeixinJSBridge
    } catch (e) {
        return
    };
    WeixinJSBridge.on('menu:share:timeline', function (argv) {
        console.log('朋友圈分享');
        WeixinJSBridge.invoke('shareTimeline', {
            "img_url": shareImg,
            "img_width": "120",
            "img_height": "120",
            "link": shareUrl,
            "desc": shareDesc,
            "title": shareTitle
        }, function (res) {
            console.log('朋友圈分享成功')
        })
    });
    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
        console.log('分享给好友');
        WeixinJSBridge.invoke('sendAppMessage', {
            "img_url": shareImg,
            "img_width": "120",
            "img_height": "120",
            "link": shareUrl,
            "desc": shareDesc,
            "title": shareTitle
        }, function (res) {
            console.log('分享给好友成功')
        })
    });
}
if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', sendMessage, false)
} else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', sendMessage);
    document.attachEvent('onWeixinJSBridgeReady', sendMessage)
}
var apiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'];
ajaxJSONP({
    url: '//www.ly.com/huochepiao/resource/WXJsApi/GetWXApiConfig',
    data: {
        url: window.location.href
    },
    jsonp: 'callbacks',
    success: function (data) {
        wx.config({
            debug: false,
            appId: data.Data.AppId,
            timestamp: data.Data.TimeStamp,
            nonceStr: data.Data.NonceStr,
            signature: data.Data.Signature,
            jsApiList: apiList
        });
        wx.ready(function () {
            var list = ["menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:openWithQQBrowser", "menuItem:openWithSafari"];
            wx.hideAllNonBaseMenuItem();
            wx.showMenuItems({
                menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite']
            })
        })
    }
});

function ajaxJSONP(params) {
    params = params || {};
    params.data = params.data || {};
    var json = params.jsonp ? jsonp(params) : json(params);

    function jsonp(params) {
        var callbackName = params.jsonp;
        var head = document.getElementsByTagName('head')[0];
        params.data['callback'] = callbackName;
        var data = formateParams(params.data);
        var script = document.createElement('script');
        head.appendChild(script);
        window[callbackName] = function (json) {
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            params.success && params.success(json)
        };
        script.src = params.url + '?' + data;
        if (params.time) {
            script.timer = setTimeout(function () {
                window[callbackName] = null;
                head.removeChild(script);
                params.error && params.error({
                    message: '超时'
                })
            }, time)
        }
    }
}

function formateParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
    }
    arr.push('v=' + (new Date()).getTime());
    return arr.join('&')
}