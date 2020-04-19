//公共通用方法
! function(window, document, $, undefined) {
    // 
    var stopPropatationOption = (function() {
        function stopPropatation(e) {
            e.stopPropagation();
        }
        var spObj = {
            "click": stopPropatation,
            "scroll": stopPropatation,
            "touchstart": stopPropatation,
            "touchmove": stopPropatation,
            "touchend": stopPropatation
        }
        return spObj;
    })();

    //滚动事件的执行方法
    var scrollEventFn = (function() {
        return {
            "touchstart": function(e) { //touchstart事件
                var touches = e.touches;
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                lastmoveY = y;
            },
            "touchmove": function(e) { //touchmove事件
                var touches = e.touches;
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (this.scrollTop == 0 && lastmoveY < y) {
                    e.preventDefault();
                }
                if (this.clientHeight + this.scrollTop - this.scrollHeight >= -1 && lastmoveY > y) {
                    e.preventDefault();
                }
                lastmoveY = y;
            }
        }
    })();

    // loader
    function loader(params) {
        var opts = {
            elem: "",
            anTime: 60 //60ms 
        };
        $.extend(true, opts, params);
        var $elem = $(opts.elem),
            $parentCon = $elem.parent(".loading_div"),
            sId = null,
            startFn = function() {
                var i = 0,
                    oldClass = "",
                    nowClass = "";
                $parentCon.removeClass("none");
                sId = setInterval(function() {
                    // console.log(i)
                    i++;
                    nowClass = "loader_an_" + i;
                    $elem.removeClass(oldClass).addClass(nowClass);
                    oldClass = nowClass;
                    if (i == 22) i = 0;
                }, opts.anTime);
                return true;
            },
            endFn = function() {
                $parentCon.addClass("none");
                sId && clearInterval(sId);
                return true;
            };
        return {
            startFn: startFn,
            endFn: endFn
        };
    }

    // 获取url中的参数值
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    // webp+lazy
    function webpAndLazy($dom) {
        loadWebp({
            attr: 'data-nsrc',
            img: $dom,
            replace: true,
            fn: function() {
                // 轮播
                $dom.lazyload({ effect: 'fadeIn' });
            }
        });
    }

    //错误图片处理
    function bindErrorImg(imgElem, defaultImgSrc) {
        if (!imgElem || !(typeof defaultImgSrc == "string" && defaultImgSrc)) return false;
        imgElem.onerror = function() {
            // alert(imgElem.src)
            imgElem.onerror = function() {};
            imgElem.src = defaultImgSrc;
        };
    }

    //弹框显示控制
    function alertFormCtrl(option) {
        var setOption = {
            showCon: $(""),
            shadowBg: $(""),
            clickBgClose: true,
            closeBut: $(""),
            closeAfterFn: function(objA, objB) {},
            showAfterFn: function(objA, objB) {},
            showBeforeFn: function(objA, objB) {}
        };
        $.extend(true, setOption, option);
        var g = setOption,
            status = 0,
            fns = {
                show: function() {
                    g.showBeforeFn(g.showCon, g.shadowBg);
                    g.shadowBg.removeClass("none");
                    g.showCon.removeClass("none");
                    g.showAfterFn(g.showCon, g.shadowBg);
                },
                close: function() {
                    g.shadowBg.addClass("none");
                    g.showCon.addClass("none");
                    g.closeAfterFn(g.showCon, g.shadowBg);
                }
            };
        g.closeBut.on("click", function() {
            fns.close();
        });
        if (g.clickBgClose === true) {
            g.shadowBg.on("click", function() {
                fns.close();
            });
        }

        return fns;
    }

    //居中
    function domPosCenter(domElem) {
        if (!domElem) return false;
        var $dom = $(domElem);
        $dom.css({
            "left": "50%",
            "top": "50%",
            "marginLeft": -$dom.width() / 2 + "px",
            "marginTop": -$dom.height() / 2 + "px"
        });
        return true;
    }

    //是否是对象
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    // 替换协议头 用于json数据源的处理
    function dataReplaceProctol(data) {
        if (!data) return data;
        var sstr = "";
        try {
            sstr = JSON.stringify(data) || "";
            return JSON.parse(sstr.replace(/https?:\/\//g, "//"));
        } catch (e) {
            return data;
        }
    }

    // 倒计时通用
    function countDown(option) {
        var setOption = {
            //刷新时间间隔
            setUp: 1000,
            //时间长度
            microse: 3000,
            //更新方法
            updateFn: function(timeObj) {},
            //回调
            callBackFn: function() {}
        };
        $.extend(true, setOption, option);
        var eTime = new Date().getTime() + setOption.microse,
            destoryThisTimer = function() {
                if (interId) {
                    clearInterval(interId);
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                }
            },
            interId = setInterval(function() {
                var suT = eTime - new Date().getTime();
                if (suT <= 0) {
                    destoryThisTimer(); //clearInterval(interId);
                    suT = 0;
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                    setOption.callBackFn();
                    return false;
                }
                setOption.updateFn({
                    day: parseInt((suT / 1000 / 60 / 60 / 24), 10),
                    hour: parseInt((suT / 1000 / 60 / 60 % 24), 10),
                    minute: parseInt((suT / 1000 / 60 % 60), 10),
                    second: parseInt((suT / 1000 % 60), 10),
                    minsecond: parseInt((suT % 1000) / 100, 10),
                    microse: suT
                });
            }, setOption.setUp);
        return destoryThisTimer;
    }

    module.exports = {
        loader: loader,
        getUrlParam: getUrlParam,
        webpAndLazy: webpAndLazy,
        bindErrorImg: bindErrorImg,
        alertFormCtrl: alertFormCtrl,
        stopPropatationOption: stopPropatationOption,
        scrollEventFn: scrollEventFn,
        domPosCenter: domPosCenter,
        isObject: isObject,
        dataReplaceProctol: dataReplaceProctol,
        countDown: countDown
    };
}(window, document, Zepto);
