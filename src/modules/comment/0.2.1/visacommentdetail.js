    define("comment/0.2.1/visacommentdetail", ["login/0.1.0/index", "tmpl/pc/visacomment/visaCommentLi", "tmpl/pc/visacomment/visaCommentBody", "dialog/0.1.0/index",
        "pager/0.1.0/index", "comment/0.2.1/visacomment.css", "jCarousel/0.2.0/index"
    ], function(require) {
        var Comments = function() {};
        var dialog = require("dialog/0.1.0/index");
        var Carousel = require("jCarousel/0.2.0/index");
        Comments.prototype = {
            host: window.host || "",
            url: "/intervacation/api/Comment/GetCommentList?projectTag=qianzheng&dpSite=2", //点评
            usefulurl: "/intervacation/api/Comment/CommentLike", //点赞
            param: {
                productId: 100,
                pageSize: 5,
                page: 1
            },
            init: function(cfg) {
                var self = this;
                self = $.extend(true, self, cfg);
                self.getData({
                    isInit: true
                });
                this.showBigImg();
            },
            rateData: function(data) {
                var count = [],
                    list = [],
                    _param;
                if (!data.Count && !data.List) {
                    _param = {
                        count: count,
                        list: list
                    };
                    return _param;
                }
                var rate = function(d) {
                    var ret = null;
                    if (d > -1) {
                        ret = (d * 100).toFixed(1);
                    }
                    return ret;
                };
                var phone = function(ele) {
                    var chars = "abcdefghijklmnopqrstuvwxyz";
                    var index = Math.floor((Math.random() * chars.length));
                    var letter = chars[index] ? chars[index] : chars[0];
                    var word = ele.substr(ele.length - 5, 2);
                    var mobile = ele.replace(word, "*" + letter);
                    return mobile;
                };
                var head = data.Count[0];
                if (data.Count.length > 0) {
                    count = [{
                        Satisfaction: head.Satisfaction,
                        ServiceScoreAvgList: head.ServiceScoreAvgList,
                        CompositeScore: head.CompositeScore,
                        AllCount: head.All,
                        GoodCount: head.Good,
                        GoodRate: rate(head.Good / head.All),
                        ModerateCount: head.Moderate,
                        ModeRate: rate(head.Moderate / head.All),
                        NegativeCount: head.Negative,
                        NegRate: rate(head.Negative / head.All),
                        PhotoCount: head.Photo
                    }];
                }
                if (data.List) {
                    $.each(data.List, function (i) {
                        var photo = [],
                            obj = data.List[i];
                        var createDate = obj.CreateDate;
                        var creator = phone(obj.Creator);
                        var commentSource = ['同程旅游APP', 'PC', 'Touch'][obj.CommentSource - 1];
                        commentSource = commentSource !== undefined ? commentSource : '';
                        if (obj.PhotoList && obj.PhotoList.length) {
                            $.each(obj.PhotoList, function (j) {
                                photo.push(obj.PhotoList[j]);
                            });
                        }
                        list.push({
                            createDate: createDate,
                            commentSource: commentSource,
                            photo: photo,
                            creator: creator
                        });
                    });
                }

                _param = $.extend(false, {}, data, {
                    Count: count
                });
                _param = $.extend(true, {}, _param, {
                    List: list
                });
                return _param;
            },
            getData: function(cfg) {
                var self = this,
                    isInit = cfg.isInit,
                    extraUrl = cfg.extraUrl,
                    param = cfg.param,
                    url = self.url;
                if (isInit) {
                    url += "&sortType=0&tagId=2";
                }
                if (extraUrl) {
                    url += "&" + extraUrl;
                }
                var _param = $.extend({}, self.param, param);

                $.ajax({
                    url: url,
                    data: _param,
                    dataType: "json",
                    success: function(data) {
                        if (cfg.render) {
                            cfg.render.call(self, self.rateData(data.Data.CommentList));
                        } else {
                            self.render(self.rateData(data.Data.CommentList), !!extraUrl);
                        }
                    },
                    error: function() {
                        self.render();
                    }
                });
            },
            /**
             * @desc 初始化登录组件
             * @param callback
             */
            initLogin: function(callback) {
                var self = this,
                    Login = require("login/0.1.0/index");
                var login = new Login({
                    loginSuccess: function() {
                        callback.call(self);
                    },
                    unReload: true
                });
            },
            /**
             * @desc 检查是否登录,并执行登录后回调
             * @param callback 登录后的操作逻辑
             */
            checkLogin: function(callback) {
                var cnUser = $.cookie("us");
                if (!(/userid=\d+/.exec(cnUser))) {
                    this.initLogin(callback);
                    return;
                }
                callback && callback.call(this);
                return true;
            },

            renderPager: function(cfg) {
                var self = this,
                    total = cfg.total,
                    extraUrl = cfg.extraUrl ? "&" + cfg.extraUrl : "&sortType=0&tagId=2",
                    url = self.url,
                    param = $.extend({}, self.param),
                    totalPage = Math.ceil(total / (param.pageSize || 5));
                if (totalPage > 1) {
                    require("pager/0.1.0/index");
                    delete(param.page);
                    $('#J_CometPager').page({
                        current: 1,
                        total: totalPage,
                        needFirstAndLast: true,
                        pageNoParam: "page",
                        ajaxObj: {
                            url: url + extraUrl,
                            data: param,
                            dataType: "json",
                            success: function(data) {
                                self.render(self.rateData(data.Data.CommentList));
                            }
                        },
                        initLoad: false
                    });
                } else {
                    $("#J_CometPager").empty();
                }
            },
            renderHeaderAndPager: function(headData) {
                var self = this,
                    headTmpl = require("tmpl/pc/visacomment/visaCommentBody"),
                    el = self.el;
                headData.hasWide = 1;
                $(el).append(headTmpl(headData));
                //绑定头部的相关组件
                $("#J_CometTab").find("span").on("click", function(e) {
                    var me = $(this),
                        count = /\d+/.exec(me.text());
                    if (me.find("input").length > 0) {
                        $("#comet_tab_checkbox").prop("checked", true);
                    } else {
                        $("#comet_tab_checkbox").prop("checked", false);
                    }
                    var param = $.extend({}, self.param),
                        paramStr = me.attr("data-param") + '&sortType=0';
                    delete(param.typeId);
                    if (param.isImage) {
                        delete(param.isImage);
                    }
                    self.getData({
                        extraUrl: paramStr,
                        param: param,
                        render: function(data) {
                            self.render(data, "", true);
                            self.renderPager({
                                total: count && count[0],
                                extraUrl: paramStr
                            });
                        }
                    });
                });
                $("#J_CometTab").find("input").on("click", function(e) {
                    var isChecked = $(this).prop("checked");
                    if (!isChecked) {
                        e.preventDefault();
                    }
                });

                $("#filter-sort").find("a").on("click", function() {
                    $("[name='commfil']").prop("checked", false);
                    $("#radio1").prop("checked", true);
                    var _this = $(this),
                        param = $.extend({}, self.param),
                        paramStr = _this.attr("data-param") + '&tagId=1';
                    delete(param.typeId);
                    self.getData({
                        extraUrl: paramStr,
                        param: param,
                        render: function(data) {
                            self.render(data);
                            self.renderPager({
                                total: data.Count[0].AllCount,
                                extraUrl: paramStr
                            });
                        }
                    });


                });

                $(document).on("click", ".commli .comet_useful", function() {
                    var el = $(this);
                    var cnUser = $.cookie("us");
                    var re = /\buserid=(\d+)\b/;
                    if (!(/userid=\d+/.exec(cnUser))) {
                        self.initLogin(function() {
                            return;
                        });
                    } else {
                        var Memberid = re.exec(cnUser)[1];
                        if (el.hasClass("disables")) {
                            return;
                        }
                        var commentId = el.attr("data-cometid"),
                            dpId = el.attr("data-resId") || "0",
                            url = self.usefulurl,
                            bEl = el.find("b"),
                            bText = bEl.text() - 0;
                        url = url + "?projectTag=qianzheng&ifGood=1&MemberId=" + Memberid + "&wmGuid=" + commentId + "&dpId=" + dpId;
                        $.ajax({
                            url: url,
                            dataType: "json",
                            success: function(data) {
                                if (!data) {
                                    return;
                                }
                                var praiseData = data.Data.CommentLike;
                                if (praiseData.RspCode === '0000') {
                                    bEl.text(bText + 1);
                                    bEl.parent().addClass("disables");
                                } else if (praiseData.RspCode === '5410') {
                                        alert("一个用户只能评价一次!");
                                        bEl.parent().addClass("disables");
                                } else {
                                    alert("点赞失败!");
                                }
                            },
                            error: function() {
                                alert("点赞失败!");
                            }
                        });
                    }
                });
                var totalItem = headData.GoodCount;
                //渲染分页
                self.renderPager({
                    total: totalItem
                });
            },
            render: function(data, noScrollTop, isClick) {
                var self = this;
                if (!data || !(data.List && data.List.length)) {
                    if (isClick) {
                        $(this.el).find('.comm-content ul').empty().html('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
                    } else {
                        $(this.el).append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
                    }
                    $(this.el).parent().removeClass("data-outer-loading");
                    $(".data-loading").remove();
                    return;
                }
                if ($(".comment-moudle").length < 1) {
                    var headData = data.Count[0];
                    if (headData) {
                        //headData.RecommendPercent = $(".J_ManYiDu").text();
                        this.renderHeaderAndPager(headData);
                    }
                }
                if (data.Count[0] && data.Count[0].Satisfaction && data.Count[0].Satisfaction !== "0") {
                    $(".J_ManYiDu").text(data.Count[0].Satisfaction + '%');
                }

                var bodyTmpl = require("tmpl/pc/visacomment/visaCommentLi");
                data.List.hasWide = 1;
                // data.list.mainTitle = self.mainTitle;
                $(".comm-content ul").empty().append(bodyTmpl(data.List));
                //this.showBigImg();
                this.foldAndUnfold();

                //如果是分页触发,则没有head的数据,则使用滚动定位
                if (!headData && !noScrollTop) {
                    if (this && this.parent) {
                        var elTop = $(this.parent).offset().top;
                        window.scrollTo(0, elTop);
                    }
                }
                //var sliderEl = $(".J_SliderActive .J_CometSlide");
                //if(sliderEl.length){
                //    sliderEl.carousel({
                //        btnPrev: ".slider_pre",
                //        btnNext: ".slider_next",
                //        canvas: ".slide_ul",
                //        item: "li",
                //        visible: 4
                //    });
                //}
                if (this.callback) {
                    this.callback.call(this);
                }
            },
            /**
             * @desc 目前initTop，next，prev，dealTopComment，renderNoResult，renderTop不用
             */
            initTop: function(cfg) {
                var self = this;
                if (cfg) {
                    $.extend(self, cfg);
                }
                self.index = 0;
                self.renderTop(cfg.data, self.index);
            },
            next: function() {
                this.renderTop(false, ++this.index);
            },
            prev: function() {
                this.renderTop(false, --this.index);
            },
            dealTopComment: function(data, newData) {
                var self = this;
                if (!data) {
                    data = {
                        DpContent: []
                    };
                }
                // newData.CommentList.mainTitle = self.mainTitle;
                var bodyData = newData.CommentList,
                    tempData = data.DpContent,
                    feedBack;
                for (var i = 0, len = bodyData.length - 1; i <= len; i++) {
                    feedBack = bodyData[i].FeedBack;
                    if (feedBack.length > 123) {
                        feedBack = feedBack.substr(0, 120) + "...";
                    }
                    tempData.push(feedBack);
                }
                data.DpTotalCount = newData.CommentSummary.GoodNum;
                return data;
            },
            renderNoResult: function() {
                var el = $(this.el);
                el.empty().append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
            },
            renderTop: function(data, index) {
                var self = this;
                if (data) {
                    self.data = data;
                }
                //如果data 为null或者undefined,则表示接口异常
                if (data == null) {
                    self.getData({
                        render: function(asyncData) {
                            self.topPageIndex++;
                            var _data = self.dealTopComment(data, asyncData);
                            self.renderTop(_data, index);
                        },
                        param: {
                            page: self.topPageIndex
                        }
                    });
                    return;
                }
                if (data &&
                    ((data && !data.CommentList.List) ||
                        (data.DpTotalCount === 0)
                    )
                ) {
                    self.renderNoResult();
                    return;
                }
                //如果data为false,则为点击上一条/下一条
                var localData = data || this.data;
                self.callback && self.callback.call(self, localData, index);
            },
            /**
             * @desc 目前initTop，next，prev，dealTopComment，renderNoResult，renderTop不用
             */

            //显示大图
            showBigImg: function() {
                var self = this;
                var _dialog;
                $("#J_SubCommentContent").on("click", ".comm-img img,.comm-img span", function() {
                    var content = $(this).parents(".comm-con").children(".mslide-panel").clone(true);
                    if (content.length) {
                        _dialog = dialog({
                            content: content,
                            tip: true,
                            width: 980,
                            height: 660,
                            padding: 0,
                            className: "comment",
                            zIndex: 10000,
                            onshow: function() {
                                var mslide = content.find(".photo-mslide");
                                var pic = content.find(".photo img");
                                //seajs.use("jCarousel/0.1.1/index", function (Carousel) {
                                var car = new Carousel(mslide, {
                                    canvas: ".list ul",
                                    item: "li",
                                    circular: false,
                                    visible: 6,
                                    preload: 0,
                                    btnNav: false,
                                    btnPrev: ".prev",
                                    btnNext: ".next"
                                });
                                var carIndex = 0,
                                    calLiLen = car.itemLength;
                                car.on("prevClick", function() {
                                    carIndex--;
                                    carIndex < 0 && (carIndex = 0);
                                    car.li.eq(carIndex).click();
                                });
                                car.on("nextClick", function() {
                                    carIndex++;
                                    carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                                    car.li.eq(carIndex).click();
                                });
                                car.on("itemClick", function(index, node, all) {
                                    $(all).removeClass("active");
                                    $(node).addClass("active");
                                    carIndex = index;
                                    var src = $(node).find("img").attr("src");
                                    pic.attr("src", src);
                                    content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                                });
                                content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                                //content.find(".photo-mslide li").siblings().removeClass("active").eq(0).addClass("active");
                                //});
                                //if (!self.isInitCar) {
                                //    self.carousel(content);
                                //    self.isInitCar = true;
                                //}
                            },
                            onclose: function() {}
                        });
                    }
                    _dialog.showModal();
                });
                $(document).on("click", ".J_close", function() {
                    _dialog.remove().close();
                });
            },

            //收起和展开
            foldAndUnfold: function() {
                $(".J_tan").on("click", function() {
                    var _self = $(this),
                        _parent = _self.parent();
                    if (_self.hasClass("shou")) {
                        var allContent = _parent.attr("data-shou");
                        _self.removeClass("shou").addClass("zhan");
                        _self.html("展开全部<i></i>");
                        _parent.css("padding-bottom", "0");
                        _parent.find("span").html(allContent);
                    } else {
                        var subContent = _parent.attr("data-zhan");
                        _self.removeClass("zhan").addClass("shou");
                        _self.html("收起<i></i>");
                        _parent.css("padding-bottom", "20px");
                        _parent.find("span").html(subContent);
                    }
                });
            },
            carousel: function(element) {
                //var self = this;
                //$(function () {
                //var index = 0;
                //$(document).on("click", ".photo-mslide li", function () {
                //    $(this).parents(".mp-content").find("#focusPic").attr("src", $(this).find("img").attr("src"));
                //    $(this).addClass("active").siblings().removeClass("active");
                //    index = $(this).index();
                //    calIndex = parseInt(index) + 1;
                //    $(".mslide-num").html(calIndex + "/" + self.carLength);
                //});
                //});
            }
        };
        return Comments;
    });
