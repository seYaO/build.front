/**
 * @author 范欣(fx6698@ly.com)
 * @module  终页
 * @exports Detail
 * @desc
 * 终页的模块
 *
 */
 (function ($) {
    var tpl = {};
    tpl.comment = require("./ajaxdot/comment.dot");
    // tpl.timer = require("./ajaxdot/timer.dot");
    tpl.imageView = require("./ajaxdot/imageView.dot");
    tpl.initImageList = require("./ajaxdot/initImageList.dot");
    tpl.imageList = require("./ajaxdot/imageList.dot");
    var Detail = {},
        _data = {},
        thisCfg = {},
        indexTitle = $("title").text(),
        Common = require("/modules-lite/common/index"),
        Mobile = require("/modules-lite/wanleCommon/common"),
        tmplList = tpl,
        //全部点评
        //Comment = require("wanleTouch/common/comment/comment"),
        productId = $("#productId").val();
    //productId = 12430;
    require("/modules-lite/dialog/index");
    require("/modules-lite/slider/slider");
    require("/modules-lite/dataLoader/dataLoader");
    require("/modules-lite/utils/fastclick/index");

    require("/modules-lite/dialogold/index");

    Common.pages = [{
        "tag": "main",
        "url": location.href,
        "title": $(".page-header h2").text()
    }];

    var loadingCfg = {
        loading: '<p class="loading"><i></i>正在努力加载中...</p>',
        click: '<p>点击加载数据</p>',
        nomore: '<p>亲，没有更多点评了</p>'
    };

    //收起折叠
    Detail.unfoldAndPack = function () {
        $(".J_hide_show").on("click", function () {
            var self = $(this),
                child = self.find("i"),
                siblings = self.next("ul");
            if (child.hasClass("unfold")) {
                child.addClass("pack-up").removeClass("unfold");
                siblings.addClass("none");
                self.removeClass("border-bottom");
            } else {
                child.addClass("unfold").removeClass("pack-up");
                siblings.removeClass("none");
                self.addClass("border-bottom");
            }

        });
    };

    //懒加载
    Detail.lazyLoad = function () {
        $(".recommend img").lazyload({
            "css": { opacity: 0 },
            "effect": 'fadeIn'
        });
    };

    //更多wifi取还机地址
    Detail.showAddress = function(){
        $(".more_place").on("click", function(){
            if(!$(this).hasClass("place_down")){
                $(this).addClass("place_down");
                $(this).addClass("placeUp");
                $(this).find("em").html("收起");
                $(".placeHidden").removeClass("none");
            }else{
                $(this).removeClass("place_down");
                $(this).removeClass("placeUp");
                $(this).find("em").html("展开更多");
                $(".placeHidden").addClass("none"); 
            }
        });
    }; 

    Detail.info = function () {
            var timer = null;
            //如果该产品已下架
            var tipEl = $(".J_pop"); 
            if (tipEl.length) {
                if (timer) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        tipEl.css("opacity", 0);
                        timer = null;
                    }, 3000);
                    return;
                }
                tipEl.animate({}, "ease-in-out", 200, function () {
                    var self = tipEl;
                    timer = setTimeout(function () {
                        self.css("opacity", 0);
                        self.css("top", "0");
                        timer = null;
                    }, 3000);
                });
            }
 

        // });
    };

    Detail.getComment = function () {
        var userId = getMemberId() == 0 ? 1 : getMemberId(),
            url = "/wanle/api/WanleComment/GetWanleCommentList?sort=0&tagId=1&pageSize=10&pageIndex=1&dpSite=6" + "&lineId=" + productId;
        Common.getData(url, function (data) {
            data = data.Data;
            Detail.data = data;
            if (!data.CommentList.length) {
                $(".comment-list").addClass("none");
                return;
            }
            data.CommentList[0].lineId = productId;
            Common.render({
                key: "comment",
                data: data,
                context: ".J_comment_info",
                tmpl: tmplList
            });
        });
    };
    
    Detail.initEvent = function (cfg, data) {
        //查看点评图片
        $(document).delegate('.comment-list .image-line img, #initImageListPage img', 'click', function (e) {
            var target = $(e.target),
                key = target.attr("data-key"),
                context = target.attr("data-context");
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),//图片属性
                dataLen = parseInt(this.getAttribute('data-length')),
                index = elem.attr('data-index');
            //幻灯弹层的时候隐藏公共头部
            //Detail.clickShow();
            Common.redirect({
                tag: "imageView",
                title: (pos + 1) + '/' + dataLen

            });
            Detail.clickCommentData(key, context, index, function () {
                var slider = $("#imageView").slider({
                    autoScroll: false,
                    loop: false,
                    fn: function () {
                        $(".page-header > h2").html(slider.index + 1 + "/" + dataLen);
                        Common.title(slider.index + 1 + "/" + dataLen);
                    }
                });
                slider.to(pos);
            });
        });

        //点评图片列表首屏
        $(document).delegate('.J_comment_info .comm-detail .image-amount', 'click', function (e) {
            //Detail.clickShow();
            var target = $(e.target).parents(".comm-detail").find(".image-amount"),
                key = target.attr("data-key"),
                context = target.attr("data-context");
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),
                index = parseInt(elem.attr('data-index'), 10);
            Common.redirect({
                tag: "initImageList",
                title: "点评图片",

                afterFunc: function () {
                    //$(".ctrl-box-wrap").css("display", "none");
                    Detail.clickCommentData(key, context, index);
                }
            });
        });

        $(document).delegate('#imageViewPage', 'click', function (e) {
            var isNotShow = $("#imageViewPage").css("display") === "block";
            if (isNotShow) {
                $("#imageViewPage").css("display", "none");
                $("#mainPage").css("display", "block");
                $(".page-header").removeClass("none");
            } else {
                $("#imageViewPage").css("display", "block");
                $("#mainPage").css("display", "block");
                $(".page-header").addClass("none");
            }
            Common.redirect({
                tag: "main",
                title: indexTitle
            })

        })
    };
    //公共头部的显示与隐藏
    Detail.clickShow = function () {
        var mainPage = $("#mainPage").css("display") === "block";//true 表示页面显示
        var pageHeader = $(".page-header").hasClass("none");//true 表示公共头部存在
        if (mainPage || pageHeader) {
            $(".page-header").addClass("none");
        } else {
            $(".page-header").removeClass("none");
        }
    };

    //点击触发全部点评
    Detail.clickCommentData = function (key, context, index, callback) {
        Detail.initCommentEvent(key, context, index, Detail.data, tmplList, callback);
    };

    Detail.initCommentEvent = function (key, context, index, _data, tmplList, callback) {
        _data.commentIndex = parseInt(index, 10);
        Common.render({
            key: key,
            data: _data,
            context: context,
            tmpl: tmplList,
            overwrite: true,
            callback: function (cfg) {
                var el = cfg.el;
                Detail.initClickContentEvent(el, key);
                callback && callback.call();
            }
        });
    };

    /*弹框开始*/
    Detail.pop =function(){
        $(".card_info").on("click",function(){
            var title = $(this).attr("m_title"),
                use_time = $(this).attr("use_time"),
                packge_info = $(this).siblings("span").html();
            var content = $('.J_concat_pop').html();
            var wrap = $("<div><div class='J_tipSlide'><h3 class='tip-title'>"+ title +"</h3><div class='tip'>"+"<p>"+ use_time +"</p>"+"<p>"+ packge_info +"</p>"+"</div></div></div>");
            Detail.pop_new(content,wrap);
        });

        $(".price_info a").on("click",function(){
            var despoit_info = $(this).attr("despoit_info");
            var content = $('.J_concat_pop').html();
            var wrap = $("<div><div class='J_tipSlide'><h3 class='tip-title'>押金明细</h3><div class='tip'>"+"<p>"+ despoit_info +"</p>"+"</div></div></div>");
            Detail.pop_new(content,wrap);
        });

        $(".tag").on("click",function(){
            var title = $(this).html(),
                sale_info = $(this).find("span").attr("info_detail");
            var content = $('.J_concat_pop').html();
            var wrap = $("<div><div class='J_tipSlide'><h3 class='tip-title'>"+title+"</h3><div class='tip'>"+"<p>"+ sale_info +"</p>"+"</div></div></div>");
            Detail.pop_new(content,wrap);   
        });
    };

    Detail.pop_new = function(content,text){
            //侧滑
            var wrap = text;
            // wrap.find(".tip").html(content);
            var dialog = $.dialogold({
                width: "100%",
                height: "100%",
                mask: true,
                buttons: {
                    '<i></i>': function () {
                        this.close();
                        $(".ui-mask").remove();
                        $(".ui-mask_old").remove();
                        $(".ui-dialog").remove();
                        $(".ui-dialog_old").remove();
                    }
                },
                content: wrap.html(),
                afterOpen: function () {
                    var iscroll = new IScroll($(".ui-dialog-content")[0], { mouseWheel: true, disableMouse: false, click: true });
                }
            });
            dialog.open();
    };


    /**
     * @func initClickContentEvent
     * @desc 绑定详情页的tab里的内容事件
     * @param el {element} tab的对应的内容面板节点
     * @param key {string} tab的类型
     */
    Detail.initClickContentEvent = function (el, key) {
        switch (key) {
            case "comment":
                break;
            case "imageView":
                break;
            case "imageViewList":
                break;
        }
    };
    Detail.comment = function () {
        $("body").delegate('.comm-detail img, #imageListPage img, .comment-list img', 'click', function () {
            if (Common.pages.length < 1) {
                Common.pages.push({
                    "tag": "main",
                    "url": location.href,
                    "title": $(".page-header h2").text()
                });
            }

        });
        $("body").delegate('#imageView', 'click', function () {
            Common.backPage();
        });
    };
    Detail.init = function () {
        var cfg = {
            "lineId": "32977",
            "actType": "",
            "dec": "on",
            "isShared": 0,
            "abTravelKey": "1",
            "url": "//tctj.ly.com/jrec/wlfrec?cid=111&projectId=4"
        };
        var self = this;
        require("/modules-lite/utils/lazyload/index");
        self.info();
        self.initEvent(cfg);
        var share = require("/modules-lite/utils/share/index");
        share.enable();
        require("/modules-lite/innerComment/index");
        Common.pages.push({
            "tag": "main",
            "url": location.href,
            "title": $(".page-header h2").text()
        });
        self.getComment();
        self.unfoldAndPack();
        self.comment();
        self.showAddress();
        self.pop();
        window.onload = function () {
            _tcTraObj._tcTrackEvent("search", "/lineWanle/detail", "/show", "|*|resId:" + $("#productId").val() + "|*|");
        }
    };

    module.exports = Detail;
})(Zepto);

