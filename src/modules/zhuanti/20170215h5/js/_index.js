//
;
! function($, window, document, undefined) {
    var utitl = require("../../../../utils/cruise.utility.js");
    var convert = require("./_convert.js");
    var thisObj = thisObj || {};
    $.extend(thisObj, {
        init: function() {
            var _this = this;
            this.opts = this.opts || {};
            this.opts.mid = "0";
            this.opts.isApp = $("#IsApp").val() || 0;
            this.opts.isWeChat = $("#IsWeChat").val() || 0;

            this.userAgent();

            getMid(function(mid) {
                _this.opts.mid = mid;
                if (_this.opts.isApp == 1 && mid != "0" && !utitl.getUrlParam("MemberId")) {                    
                    var url = location.href,
                        data = "";
                    if (url.indexOf("?") > 0) {
                        data = "&";
                    } else {
                        data = "?";
                    }
                    url = url + data + "MemberId=" + _this.opts.mid;
                    window.history.replaceState("", "", url);
                    location.href = url;
                }
                _this.bindEvent();
            });
        },
        bindEvent: function() {
            var _this = this;
            var $btn = $(".make-btn .btn");
            var startInterval;
            var make = $(".content-make");
            var loading = $(".content-loading");
            var complete = $(".content-complete");
            $btn.on("click", function() {
                if (_this.checkFn()) {
                    var isLogin = false;
                    // 判断是否微信
                    if (_this.opts.isWeChat == 1) {
                        isLogin = true;
                    } else {
                        // 判断是否登录
                        if (_this.opts.mid == "0") {
                            toLogin();
                        } else {
                            isLogin = true;
                        }
                    }
                    if (isLogin) {
                        $(".content-make").removeClass("android");
                        loading.css({ "display": "block" });
                        if (_this.opts.isApp == 1) {
                            var url = 'https://m.ly.com/youlun/zhuanti/2017FebruaryVipH5.html';
                            url += '?userName=' + encodeURIComponent($("#VipName").val().trim()) + '&toName=' + encodeURIComponent($("#infoName").val().trim()) + '&sort=' + $("#Sort").val() + '&userPhoto=' + encodeURIComponent($("#headImg")[0].src.replace(/http:|https:/, ""));
                            if (window.Android) {
                                Android.setTcshareurl && Android.setTcshareurl(url); //链接
                            } else {
                                $("input[name='tcshareurl']").val(url);
                            }
                        }
                        startInterval = setInterval(loadData, 50);
                    }
                }
            });
            // 微信分享
            $(".share").on("click", function() {
                var pop = $(".content-pop");
                pop.css({ "display": "block" });
            });
            // app分享
            $(".appShare").on("click", function() {
                location.href = 'http://shouji.17u.cn/internal/share/all';
            });

            function loadData() {
                if (document.readyState == "complete") {
                    clearInterval(startInterval);
                    convert(true, _this.opts.isApp, _this.opts.isWeChat);
                    setTimeout(function() {
                        make.css({ "display": "none" });
                        loading.css({ "display": "none" });
                        complete.css({ "display": "block" });
                    }, 1000);
                }
            }
        },
        //  验证方法
        checkFn: function() {
            var _this = this;
            var regName = /^(.*?)+[\d~!@#$%^&*()_\-+\={}\[\];:'"\|,.<>?！￥……（）——｛｝【】；：‘“’”、《》，。、？]/;

            //  姓名          
            if ($('#infoName').val().trim() == '' || regName.test($('#infoName').val().trim())) {
                _this.actionHelp.messageBox('请输入正确的名字！');
                return false;
            }

            return true;
        },
        // 弹框
        actionHelp: {
            popShow: function(elem) {
                $('#pop-bg').removeClass('none');
                $(elem).removeClass('none');
                $("html").css({ "height": "100%", "overflow-y": "hidden" });
            },
            popHide: function(elem) {
                $('#pop-bg').addClass('none');
                $(elem).addClass('none');
                $("html").css({ "height": "auto", "overflow-y": "auto" });
            },
            messageBox: function(msg, flg) {
                flg = flg || false;
                if (!document.getElementById('tip_layer')) {
                    var tipl = document.createElement('div');
                    tipl.id = 'tip_layer';
                    tipl.className = 'tip_layer';
                    document.body.appendChild(tipl);
                }
                var lv = document.getElementById('tip_layer');
                lv.innerHTML = msg;
                lv.style.display = "block";
                var lw = lv.offsetWidth / 2,
                    lh = (lv.offsetHeight / 2);
                lv.style.marginLeft = "-" + lw + "px";
                lv.style.marginTop = "-" + lh + "px";
                if (!flg) {
                    setTimeout(function() {
                        lv.style.display = "none";
                        lv.innerHTML = "";
                    }, 3000);
                }
                $("body").css({
                    "width": "",
                    "height": "",
                    "overflow": "",
                    "position": ""
                })
            }
        },
        userAgent: function() {
            var useragent = navigator.userAgent;
            if (useragent.indexOf('Android') > 0) {
                $(".content-make").addClass("android");
                $(".content-make").prepend('<img class="androidImg" src="//file.40017.cn/youlun/m/img/zt/20170215h5/make-bg.jpg" alt="">');
            }
        }
    });
    //跳转登录
    function toLogin() {
        if (ci.isClient()) {
            window.location.href = 'http://shouji.17u.cn/internal/login/';
        } else {
            window.location.href = 'https://passport.ly.com/m/login.html?returnUrl=' + encodeURIComponent(location.href);
        }
        return true;
    }

    //通用方法
    function isIOS() {
        var userAgentInfo = navigator.userAgent,
            Agents = new Array("iPhone", "iPad", "iPod");
        // 开始判断代理
        for (var i = 0; i < Agents.length; i++) {
            if (userAgentInfo.indexOf(Agents[i]) > 0) {
                return true;
            }
        }
        return false;
    }
    //通用方法
    function getMid(callBack) {
        var userinfo = getClientInfo(),
            _mId = "";
        if (ci.isClient()) {
            if (isIOS()) {
                ci.overFunBack = function() {
                    userinfo = getClientInfo();
                    _mId = userinfo.mid;
                    callBack && callBack(_mId || 0);
                };
            } else {
                _mId = userinfo.mid;
                callBack && callBack(_mId || 0);
            }
        } else {
            _mId = getMemberId();
            callBack && callBack(_mId || 0);
        }
    }
    $(document).ready(function() {
        thisObj.init();
    });
}(Zepto, window, document);
