/**
 * @author 刘聪(lc07631@ly.com)
 * @module  公共方法
 * @exports Mobile
 * @desc
 * 微信，app的判断
 *
 */
/* global Monitor */
(function(){
    var Mobile = {};

    //判断是否是微信
    Mobile.isWX = function(){
        return /MicroMessenger/i.test(navigator.userAgent.toLowerCase());
    };

    //判断是否是QQ浏览器
    Mobile.isQQBrowser = function(){
        var ua = navigator.userAgent;
        if(ua.indexOf("MQQBrowser")>-1 && ua.indexOf("QQ/")===-1){
            return true;
        }
    };

    //判断app
    //flag是否判断版本号，true是判断
    //v是版本号
    Mobile.isApp = function(flag,v){
        var ua = navigator.userAgent,
            isApp = /TcTravel\/(\d+\.\d+\.\d+)/.exec(ua);
        if(isApp&&isApp[1]){
            if(flag === true){
                var version = isApp[1];
                if(version >= v){
                    return true;
                }
            } else {
                return true;
            }

        } else {
            return false;
        }
    };

    //兼容h5页面中有无头部
    Mobile.touch = function(elem,high,star){
        if(!(Mobile.isWX() || Mobile.isApp(false) || Mobile.isQQBrowser())){
            elem.css({
                'top': high,
                'position': 'absolute'
            });
            $(window).on("touchmove scroll", function () {
                var scrollElem = $(this);
                if (scrollElem.scrollTop() < high) {
                    elem.css({
                        'top': high,
                        'position': 'absolute'
                    });
                } else {
                    elem.css({
                        'top': star,
                        'position': 'fixed'
                    });
                }
            });
        }
    };
    module.exports = Mobile;
})(Zepto);
