/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
/**
 * @author 刘聪(lc07631@ly.com)
 * @module  玩乐首页
 * @desc
 * 玩乐首页的模块
 *(2016-01-06)港澳台tab切换部分点击展示为不同区域内容修改
 */

    var Index = {},
        AutoComplete = require("autoComplete/0.1.2/index");
        require("common/0.1.0/index");
        require("lazyload/0.1.0/index");
        require("scrollspy/0.1.0/index");
        require("slider/0.1.0/index")($);

    var Tpl = require("./proList.dot"),
        Slidertoolbar = require("slidertoolbar/0.1.0/index");

    Index.init = function () {
        if ($(".sliderCon li").length > 1) {
            $(".sliderCon").slide();
        }
        Index.lazyLoad();
        Index.tabRightShow();
        Index.chooseCity();
        Index.autoComplete();
        Index.initScrollSpy();
        Index.chooseType();
        Index.tabContentFilter();
        Index.slider();
        Index.QRcode();
        Index.ClixkMore();
    };

    Index.chooseCity = function () {
        $(".tab").find("div").on("click", function () {
            var self = $(this),
                index = parseInt(self.attr("data-index")) - 1,
                tabCon = $(".tab-content");
            self.addClass("current");
            self.siblings().removeClass("current");
            tabCon.addClass("none");
            $(tabCon[index]).removeClass("none");
        });
    };

    Index.autoComplete = function () {
        var autoComplete = new AutoComplete();
        autoComplete.init({
            showLabel: true,
            checkFlag: true,
            searchContent: $("#txtScenicValue"),
            matchContent: $("#matchContent"),
            matchUrl: $("#matchDest").val(),
            pageLabel: "/lineWanle/wifi/homepage",
            hotSearch: $(".HotSearch"),
            pagetype: "wanlehome"
        });
    };

    Index.initScrollSpy = function () {
        $(".fixed-nav .fixed-left").scrollspy({
            pClass: ".fixed-nav",
            curClass: "current",
            contentClass: ".J_NavBox",
            topH: 40,
            renderNav: function (sid, stxt, el, index) {
                if (!index) {
                    return '<a class="current" href="#' + sid + '"><span>' + stxt + '</span></a>';
                } else {
                    return '<a href="#' + sid + '"><span>' + stxt + '</span></a>';
                }
            }
        });
    };

    Index.chooseType = function () {
        $(".product-city li").on("click", function () {
            var self = $(this),
                index = self.attr("data-index"),
                flag = self.attr("data-flag"),
                datalidest = self.attr("data-li-dest"),
                parents = self.parents(".product");


            if (!self.hasClass("current")) {
                self.addClass("current");
                self.siblings().removeClass("current");
                var length = parents.find(".J_proList_" + flag).length;

                if (datalidest) {
                    var param = {
                        "length": length,
                        "parents": parents,
                        "flag": flag,
                        "type": index,
                        "datalidest": datalidest,
                        "tabName": self.html(),
                        "parName": parents.data("txt")
                    };
                } else {
                    var param = {
                        "length": length,
                        "parents": parents,
                        "flag": flag,
                        "type": index,
                        "tabName": self.html(),
                        "parName": parents.data("txt")
                    };
                };
                Index.handleType(param);
            }
        });
    };

    Index.handleType = function (config) {
        var parents = config.parents;
        if (config.length === 0) {
            var param = {
                    "dest": parents.find('li.current').attr("data-li-dest") || parents.attr("data-dest"),
                    "singleType": config.type
                },
                context = parents.find(".pro-list");

            $.ajax({
                url: $("#repleaceType").val(),
                data: param,
                dataType: "jsonp",
                success: function (data) {
                    data._key = config.flag;
                    data.tabName = config.tabName;
                    data.parName = config.parName;
                    Index.render({
                        tpl: Tpl,
                        key: "proList",
                        data: data,
                        overwrite: false,
                        context: context,
                        callback: function () {
                            Index.lazyLoad();
                        }
                    });
                }
            });
        }
        parents.find(".pro-list ul").addClass("none");
        parents.find(".J_proList_" + config.flag).removeClass("none");
    };

    /**
     * 渲染逻辑同touch
     * @param config
     */
    Index.render = function (config) {
        var tpl = config.tpl,
            key = config.key,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback,
            _html = tpl(data),
            cxt;
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(_html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    };

    Index.lazyLoad = function () {
        if (Index.isInit) {
            var imgList = $(".pro-list img").not("[data-img-loaded]");
            $("body").trigger("addElements", imgList);
        } else {
            $(".pro-list img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            Index.isInit = true;
        }
    };

    Index.tabContentFilter = function () {
        var navigaLi = $(".naviga-box").find("li"),
            showContent = $(".naviga-box-content");
        navigaLi.hover(function () {
            var self = $(this),
                index = parseInt(self.attr("data-index")) - 1;
            navigaLi.removeClass("current");
            self.addClass("current");
            showContent.addClass("none");
            $(showContent[index]).removeClass("none")
        }, function () {
            navigaLi.removeClass("current");
            showContent.addClass("none");
        });
    };

    Index.tabRightShow = function () {
        window.onscroll = function () {
            var top = document.body.scrollTop || document.documentElement.scrollTop,
                elem = $(".service");
            if (top > 300) {
                elem.removeClass("none");
            } else {
                elem.addClass("none");
            }
        };    };

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
                icon: $("#ImgUrl").find("em").html(),
                tooltips: $("#ImgUrl").find("span").html()
            },
            topMenu: [{
                icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1"></div></a>',
                tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            },{
                icon: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_10" class="J_trace"><div class="ico c-3"></div></a>',
                tooltips: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_11"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            },{
                icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2026"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            bottomMenu: [{
                icon: '<a class="Qr_icon"><div class="ico c-7"></div></a>',
                tooltips: '<a class="Qrcode"><span class="ico-title"><img src="'+$("#wxQRcode").attr("src")+'"><i></i></span></a>',
                arrow: false
            }],
            toTop: true,
            pageName: "当地玩乐首页",
            skin:'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="//member.ly.com"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    };

    Index.QRcode = function(){
        var _this = $("#module-slider .c-7");
        _this[0].onmouseover = function(){
            _this.parents(".content").find(".tooltip_gp").css({"background":"none"});
        }
    }

    Index.ClixkMore = function(){
         $(".click-more a").on("click", function () {
            var parents = $(this).parents(".dl").toggleClass("shut");
            $(this).html(parents.is(".shut") ? "收起<i></i>" : "更多<i></i>");
         });
    }

    Index.init();

