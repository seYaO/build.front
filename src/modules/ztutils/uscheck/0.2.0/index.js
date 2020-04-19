(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function () {
            return this
        }).call();
        root.UScheck = factory();
    }
}(function () {
    /**
     */
    var UScheck = function () {
        var self = this;
        if (!(self instanceof UScheck)) {
            return new UScheck();
        }
    };
    UScheck.prototype = {
        constructor: UScheck,
        host: "//www.ly.com",
        //添加参数
        addParams: function (url, name, value) {
            url = url.replace(/(^\s*)|(\s*$)/g, "");
            var urlRep = /javascript:/i;
            if (urlRep.test(url)) {
                return url;
            }
            var reg = new RegExp("[\?&](" + name + "=([^&#$]*))", "i"),
                //查找url中是否包含正确赋值参数
                rec1 = reg.exec(url),
                //查找url中是否包含哈希
                rec2 = url.split("#"),
                param = name + "=" + value,
                ret = url;
            if (rec1) {
                ret = url.replace(rec1[1], param);
            } else {
                if (/\?/g.test(url)) {
                    if (rec2.length > 1) {
                        ret = rec2[0] + "&" + param + "#" + rec2[1];
                    } else {
                        ret = rec2[0] + "&" + param;
                    }
                } else {
                    if (rec2.length > 1) {
                        ret = rec2[0] + "?" + param + "#" + rec2[1];
                    } else {
                        ret = rec2[0] + "?" + param;
                    }
                }
            }
            return ret;
        },
        //获取
        cookie: function (key, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by
                                                                 // IE
                }
                var path = options.path ? '; path=' + options.path : '';
                var domain = options.domain ? '; domain=' + options.domain : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [key, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var ret, m;
                if (key) {
                    if ((m = document.cookie.match(
                            new RegExp('(?:^| )' + key +
                                '(?:(?:=([^;]*))|;|$)')))) {
                        ret = m[1] ? decodeURIComponent(m[1]) : '';
                    }
                }
                return ret;
            }
        },
        //
        data: {
            //version : '',
            //memberId : ''
        },
        //是否登录
        isLogin: false,
        initialize: function () {
            var self = this;
            //是否为客户端
            self.isClient = /tctravel/i.test(navigator.userAgent.toLowerCase());
            //是否为微信客户端
            self.isWeChat = /micromessenger/i.test(navigator.userAgent.toLowerCase());
            //初始默认参数
            self.userinfo = {
                type: null,
                value: null,
                url: null
            };
            //
            var url = window.location.href,
                cookie = self.cookie("cnUser") || "",
                matchtouch = /userid=([^&]*)/i.exec(cookie),
                matchApp = /memberId=([^&]*)/i.exec(url);
            
            var userinfo = self.userinfo = {
                type: null,
                value: null,
                userid: null,
                memberid: null,
                url: null
            };
            //
            if (!self.isClient) {
                //不是客户端
                userinfo.type = "userid";
                if (matchtouch && matchtouch[1]) {
                    userinfo.value = matchtouch[1];
                    userinfo.userid = matchtouch[1];
                }
                userinfo.url = "https://passport.ly.com/m/login.html";
            } else {
                //是客户端
                userinfo.type = "memberid";
                if (matchApp && matchApp[1] && matchApp[1] !== 'tcwvmid') {
                    userinfo.value = matchApp[1];
                    userinfo.memberid = matchApp[1];
                }
                userinfo.url = "http://shouji.17u.cn/internal/login/";
            }
            if (userinfo.value) {
                self.isLogin = true;
            }
        },
        
        /*加不加true来判断是否需要跳登录页*/
        /*
         * @desc 判断登录回调封装
         * @param {
         * callback function 成功回调
         * direct boolean 跳转开关
         * }
         *
         * */
        check: function (cfg) {
            var self = this;
            if (typeof cfg !== 'object') return;
            if (typeof cfg.callback !== 'function') cfg.callback = function () {
            };
            //判断跳转
            if (cfg.direct) {
                if (!self.checkJump()) return false;
            }
            //无登录信息不执行
            if (!self.userinfo.value) return false;
            // 回调
            if (self.isClient) {
                //对useid解密
                if (cfg.decode) {
                    if (!self.isInitUserid) {
                        self.toUserId(function () {
                            self.isInitUserid = true;
                            cfg.callback.call(self, self.userinfo);
                        });
                    } else {
                        cfg.callback.call(self, self.userinfo);
                    }
                } else {
                    cfg.callback.call(self, self.userinfo);
                }
            } else {
                cfg.callback.call(self, self.userinfo);
            }
        },
        //
        checkJump: function () {
            var self = this;
            if (!self.ischeckJump && self.userinfo.value == null) {
                if (!self.isClient) {
                    window.location.href = (self.userinfo.url + "?returnUrl=" + encodeURIComponent(location.href));
                } else {
                    var url = window.location.href;
                    url = self.addParams(url, "memberId", "tcwvmid");
                    url = self.addParams(url, "tcwvclogin", "true");
                    window.location.replace(url);
                }
                return false;
            }
            self.ischeckJump = true;
            return true;
        },
        //
        toUserId: function (callback) {
            var self = this;
            $.ajax({
                type: 'get',
                url: self.host + "/intervacation/api/SignIn/GetDencryUserId?userId=" + self.userinfo.value,
                dataType: 'jsonp',
                success: function (data) {
                    if (data.Code === 4000) {
                        self.userinfo.userid = data.Data.UserId;
                        callback && callback();
                    }
                },
                error: function () {
                }
            });
        },
        //客户端返回信息
        getAppInfo: function () {
            var self = this;
            document.addEventListener('TongChengWebViewJavascriptBridgeReady', function (event) {
                var bridge = event.bridge;
                bridge.init(function (message, responseCallback) {
                });
                bridge.registerHandler('TongchengJavaScriptHandler', function (data, responseCallback) {
                    self.data = data;
                    self.data.clientType = "iPhone";
                    //如果有数据返回
                    if (self.data && self.data.memberId) {
                        self.userinfo.value = self.data.memberId;
                    }
                });
            }, false);
            //Android
            var Android;
            if (Android != undefined) {
                var AndroidHandler = eval('(' + Android.getDataFromAndroid() + ')');
                if (AndroidHandler) {
                    self.data = AndroidHandler;
                    self.data.clientType = "Android";
                    //如果有数据返回
                    if (self.data && self.data.memberId) {
                        self.userinfo.value = self.data.memberId;
                    }
                }
            }
        }
    };
    //
    var uscheck = new UScheck();
    uscheck.initialize();
    //
    return uscheck;
}));

