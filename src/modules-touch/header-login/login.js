/**
 * Created by qhl16259 on 2016/2/25.
 */
/**
 * Created by qhl16259 on 2016/2/25.
 */
/**
 * Created by qhl16259 on 2016/2/25.
 */
var Common = require("modules-touch/common/index");
!function() {
    function h(b) {
        return n.raw ? b : encodeURIComponent(b)
    }
    function i(b) {
        return n.raw ? b : decodeURIComponent(b)
    }
    function j(a) {
        return h(n.json ? JSON.stringify(a) : String(a))
    }
    function k(c) {
        0 === c.indexOf('"') && (c = c.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return c = decodeURIComponent(c.replace(m, " ")),
                n.json ? JSON.parse(c) : c
        } catch (d) {}
    }
    function l(d, e) {
        var f = n.raw ? d : k(d);
        return $.isFunction(e) ? e(f) : f
    }
    var m = /\+/g
        , n = $.cookie = function(a, b, c) {
            if (void 0 !== b && !$.isFunction(b)) {
                if (c = $.extend({}, n.defaults, c),
                    "number" == typeof c.expires) {
                    var e = c.expires
                        , g = c.expires = new Date;
                    g.setTime(+g + 86400000 * e)
                }
                return document.cookie = [h(a), "=", j(b), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join("")
            }
            for (var r = a ? void 0 : {}, s = document.cookie ? document.cookie.split("; ") : [], t = 0, u = s.length; u > t; t++) {
                var v = s[t].split("=")
                    , w = i(v.shift())
                    , x = v.join("=");
                if (a && a === w) {
                    r = l(x, b);
                    break
                }
                a || void 0 === (x = l(x)) || (r[w] = x)
            }
            return r
        }
        ;
    n.defaults = {},
        $.removeCookie = function(c, d) {
            return void 0 === $.cookie(c) ? !1 : ($.cookie(c, "", $.extend({}, d, {
                expires: -1
            })),
                !$.cookie(c))
        }
}(),
    $(function() {
        $("body").delegate(".addId", "click", function() {
            var loginId = Common.getQueryString("loginName","");
            var QueryKey = $(this).attr("queryKey");
            if(loginId) {
                $(this).attr("href","./OneAreaInfoList?Continent=" + QueryKey + "&loginName=" + loginId);
            }
            else {
                $(this).attr("href","./OneAreaInfoList?Continent=" + QueryKey);
            }

        }),
            $("body").delegate(".pro__title", "click", function() {
                var loginId = Common.getQueryString("loginName","");
                var lineId = $(this).attr("lineId");
                var isYuwei = 1;
                var url = "//m.ly.com/dujia/tours/" + lineId + "?isYuwei=" + isYuwei;
                if(loginId) {
                    $(this).attr("href",url + "&loginName=" + loginId);
                }
                else {
                    $(this).attr("href",url);
                }

            }),
            $("body").delegate(".pro__button", "click", function() {
                var loginId = Common.getQueryString("loginName","");
                var lineId = $(this).attr("lineId");
                var lineDate = $(this).attr("lineDate");
                if(loginId) {
                    $(this).attr("href","./LineInfoList?lineId=" + lineId + "&lineDate=" +lineDate + "&loginName=" + loginId);
                }
                else {
                    $(this).attr("href","./LineInfoList?lineId=" + lineId + "&lineDate=" +lineDate);
                }

            }),
            $("body").delegate(".touchable", "touchstart", function() {
                $(this).addClass("touched")
            }),
            $("body").delegate(".touchable", "touchend touchcancel touchmove", function() {
                $(this).removeClass("touched")
            }),
            $("body").delegate(".page-back", "click", function() {
                var b = this.getAttribute("href");
                b && "javascript" === b.substring(0, 10).toLowerCase() && history.back()
            }),
            $("body").delegate(".header-menu-btn", "click", function() {
                var loginId = Common.getQueryString("loginName","");
                function q(e, f) {
                    for (var g = e.length - 1; g >= 0; g--) {
                        var h = e[g];
                        if (h.substring(0, f.length + 1) == f + "=") {
                            return h.substring(f.length + 1)
                        }
                    }
                    return ""
                }
                var r = $(".header-menu")
                    , s = $(".header-menu-bg");
                s.length ? s.css({
                    display: "block"
                }) : ($("body").append('<div class="header-menu-bg"></div>'),
                    s = $(".header-menu-bg"),
                    s.on("click", function() {
                        $(".header-menu").removeClass("open"),
                            $(this).removeClass("open");
                        var b = this;
                        setTimeout(function() {
                            b.style.display = "none"
                        }, 200)
                    })),
                    setTimeout(function() {
                        s.addClass("open")
                    }, 20);
                var t, u, v, w, x, y = ($.cookie("loginName") || ""),z=location.href.split("=").pop();
                y===z ? (t = "logout",
                    v = "退出",
                    u = "login",
                    C = "./AllAreaInfoList",
                    x = "wd_m4") : (t = "login",
                    v = "登录",
                    u = "logout",
                    C = "./LoginList" ,
                    x = "wd_m3");
                var D = $(this)
                    , E = D.offset().top + D.height() + 9 + "px";
                if (r.length) {
                    if (0 === $("." + t, r).length) {
                        var F = $("." + u);
                        F.removeClass(u).addClass(t).prop("href", C).html("<i></i>" + v)
                    }
                    r.css({
                        top: E
                    })
                } else {
                    $("body").append('<div class="header-menu" style="top: ' + E + '"><a class="home touchable" data-track="wd_m1" href="javascript:void(0);"><i></i>首页</a><a class="' + t + ' touchable" data-track="' + x + '" href="' + C + '"><i></i>' + v + "</a></div>"),
                        r = $(".header-menu")
                }
                setTimeout(function() {
                    r.addClass("open")
                }, 20)

                if (v === "退出") {
                    $(".home").attr("href","./AllAreaInfoList" + "?refid=143807588&loginName=" + loginId);
                }
                else {
                    $(".home").attr("href","./AllAreaInfoList");
                }

            })
    })
