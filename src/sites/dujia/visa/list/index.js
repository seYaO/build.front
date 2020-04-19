/**
 * Created by yl17006 on 2016/12/02
 */
var Common = require("common/0.1.0/index"),
    storage = require("common/0.1.0/storage"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"), //侧导航
    dialog = require("dialog/0.1.0/index");
var prolistTmpl = require("./prolist.dot");
require("modules/startlist/0.1.0/index").init();
require("lazyload/0.1.0/index");
require("pager/0.1.0/index");
var visaList = {
    init: function(conf) {
        var self = this;
        self.real_init(conf);
    },
    real_init: function(conf) {
        var self = this;
        //this.getTel();
        self.hoverLi();
        self.getDestination();
        self.changeUrl(".leavecity dd a");
        self.lazyLoad();
        self.filter.init(conf);
        self.getPage($.extend(conf, visaList._condition_ || ""));
        self.mouserender();
        self.sideadfn(function () {
            self.hideNumber();
        });
    },
    callback: function() {
        this.hoverLi();
        this.lazyLoad();
    },
    /**
     * @desc 改变出发地的链接
     */
    changeUrl: function(elArr) {
        var self = this,
            countryName = $("#hidCountryName").val(),
            url = "/dujia/search.aspx?src={name}&dest=" + countryName + "&prop=6";
        if (countryName) {
            $(elArr).each(function(i, n) {
                var depname = $(n).attr("title"),
                    str = url.replace("{name}", depname);
                $(n).attr("href", str);
            })
            return;
        }
    },
    hideNumber: function () {
        // var urlDate = this.getQueryString("hideDate") ? this.getQueryString("hideDate").replace(/-/g, "/") : "";
        $.ajax({
            url: "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue",
            dataType: "jsonp",
            success: function (data) {
                var curDate = "";
                // if (urlDate) {
                //     curDate = Common.dateFormat(new Date(urlDate), "yyyyMMdd");
                // } else {
                    if (data && data.totalseconds) {
                        var total = data.totalseconds.replace(/-/g, "/");
                        curDate = Common.dateFormat(new Date(total), "yyyyMMdd");
                    } else {
                        var now = new Date();
                        curDate = Common.dateFormat(now, "yyyyMMdd");
                    }
                // }
                // curDate = "20170202";
                if (curDate > 20170126 && curDate < 20170203) {
                    $(".c_phone_add").css("display","none");
                    $(".module-slider-top").find("li").eq(1).css("display","none")
                }
            }
        });
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    },
    /**
     * @desc 获取400电话
     */
    getTel: function() {
        var url = $(".c_phone").attr("attr-url");
        common.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data) {
                if (data) {
                    $(".c_phone em").html(data);
                    $(".ly_p_message em").html("请拨打" + data);
                }
            },
            error: function() {
                window.monitorModule.log("获取400电话失败" + url, "getTel");
            }
        });
    },
    getUser: function() {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    /**
     * @desc 侧导航
     */
    //侧栏广告图走广告位
    sideadfn: function(callback) {
        var me = this;
        $.ajax({
            url: "/intervacation/api/VisaInfo/GetPCVisaAd",
            type: "get",
            dataType: 'json',
            success: function(data) {
                if (data.Status == "Success") {
                    var smallAd = data.Data.Slide.SmallAd,
                        LargeAd = data.Data.Slide.LargeAd;
                    me.slider(smallAd, LargeAd);
                    callback && callback.call(me);
                }
            }
        });
    },
    slider: function(smallAd, LargeAd) {
        var userid = this.getUser();
        var slider = new Slidertoolbar({
            header: {
                icon: '<a target="_blank" trace="slider_1" href="' + smallAd.Url.replace('http:','') + '"><img src="' + smallAd.ImageUrl.replace('http:','') + '"></a>',
                tooltips: '<a target="_blank" trace="slider_2" href="' + LargeAd.Url.replace('http:','') + '"><img src="' + LargeAd.ImageUrl.replace('http:','') + '"></a>'
            },
            topMenu: [{
                icon: '<a trace="slider_7" href="//member.ly.com/center"><div class="ico c-1"></div></a>',
                tooltips: '<a trace="slider_8" href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                icon: '<div class="ico c-2 J_trace"  trace="slider_5"></div>',
                tooltips: '<a href="javascript:void(0)" trace="slider_6"><span class="ico-title">4001-899-812<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=3"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=3"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            pageName: "签证列表页",
            toTop: true,
            skin:'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="//member.ly.com/center"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    },
    /**
     * @desc 图片懒加载
     */
    lazyLoad: function() {
        if (visaList.isInit) {
            var imgList = $(".pro-img img").not("[data-img-loaded]").not(".chengyi-jingpin");
            $("body").trigger("addElements", imgList);
        } else {
            $(".prolist img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            visaList.isInit = true;
        }
    },
    /**
     * @desc 产品hover效果
     */
    hoverLi: function() {
        $(".pro-line").on("mouseenter", function() {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.addClass("liHover");
            _com.css("display", "block");
        });
        $(".pro-line").on("mouseleave", function() {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.removeClass("liHover");
            _com.css("display", "none");
        });
        var regionStyle = $(".J_visaArea a");
        regionStyle.each(function() {
            var me = $(this);
            if (me.children(".areadiv").length > 0) {
                me.removeClass("all");
            } else {
                me.addClass("all");
            }
        });
    },
    /**
     * @desc 热门目的地
     */
    getDestination: function() {
        $(".des-item").each(function() {
            var _this = $(this),
                _showlist = $(".showlist", _this),
                _num = $(".list-conn dt a", _this).length;
            if (_num > 1) {
                _num = _num > 2 ? 2 : _num;
                _showlist.css("width", 331 * _num + "px");
            }
        });
        $(".des-item").hover(function() {
            var _self = $(this),
                _img = $(".list-conn img", _self),
                _imgurlh = _img.attr("attr-imageh"),
                _slist = $(".showlist", _self);
            _self.addClass("hover");
            _img.attr("src", _imgurlh);
            _slist.removeClass("none");
        }, function() {
            var _self = $(this),
                _img = $(".list-conn img", _self),
                _imgurl = _img.attr("attr-image"),
                _slist = $(".showlist", _self);
            _self.removeClass("hover");
            _img.attr("src", _imgurl);
            _slist.addClass("none");
        });
    },
    /**
     * @desc 处理分页
     */
    renderPager: function(cfg, data) {
        var self = this,
            total = data.TotalCount,
            totalPage = Math.ceil(total / 8);
        self.render(data, function() {
            self.callback();
        });
        if (totalPage === 1) {
            $("#J_NoLine").show();
        } else {
            $("#J_NoLine").hide();
        }
        if (totalPage > 0) {
            self.getPage(cfg, totalPage);
        } else {
            $("#J_LablePager").empty();
        }
    },
    /**
     * @desc 分页函数
     */
    getPage: function(cfg, totalpage) {
        var self = this;
        require("pager/0.1.0/index");
        var url = "/dujia/AjaxCallTravel.aspx?type=GetVisaLabelPageList",
            tos = $("#hidTotalCount").val() || 0,
            tosl = Math.ceil(parseInt(tos, 10) / 8),
            allpage = totalpage ? totalpage : tosl,
            param = $.extend({}, cfg);
        if (allpage <= 1) {
            $("#J_NoLine").show();
            return;
        } else {
            $("#J_NoLine").hide();
        }
        $('#J_LablePager').page({
            current: 1,
            total: allpage,
            needFirstAndLast: true,
            pageNoParam: "pageNum",
            ajaxObj: {
                url: url,
                data: param,
                dataType: "jsonp",
                success: function(data) {
                    if (param.pageNum >= allpage) {
                        $("#J_NoLine").show();
                    } else {
                        $("#J_NoLine").hide();
                    }
                    self.render(data, function() {
                        self.callback();
                    });
                    var msgTop = parseInt(parseInt($("#seafilter").offset().top));
                    document.documentElement.scrollTop = document.body.scrollTop = msgTop;
                },
                error: function() {
                    window.monitorModule.log("处理分页失败" + url, "renderPager");
                }
            },
            initLoad: false
        });
    },
    /**
     * @desc 分页渲染数据
     */
    render: function(data, callback) {
        var self = this;
        $("#tagList").empty().append(prolistTmpl(data));
        self.mouserender();
        if (callback) {
            callback.call(this);
        }
    },
    mouserender: function() {
        var jTips = $(".pro-icon,.J_blhTags");
        jTips.hover(function() {
            $(this).find(".cursor-show").show()
        }, function() {
            $(this).find(".cursor-show").hide();
        });
    },
    //筛选
    filter: {
        init: function(conf) {
            visaList._condition_ = this.buildParam(conf);
            this.initFilterEv();
        },
        defaultFilterParam: function() {
            var pageNum = 1,
                count = 8,
                relatedId = $(".J_visaType .on").attr("data-value") || "",
                // countryId = $(".J_visaDestination .on").attr("data-value") || "",
                isInterview = $(".J_interview .on").attr("data-value") || "",
                regionId = $(".J_visaArea .on").attr("data-value") || "";
            return $.extend({}, {
                pageNum: pageNum,
                count: count,
                relatedId: relatedId,
                // countryId: countryId,
                isInterview: isInterview,
                regionId: regionId,
            });
        },
        buildParam: function(param) {
            return $.extend({}, this.defaultFilterParam(), param || {});
        },
        ajax: function(param) {
            var url = "/dujia/AjaxCallTravel.aspx?type=GetVisaLabelPageList";
            return common.ajax({
                url: url,
                data: param,
                dataType: "jsonp"
            });
        },
        /**
         * @desc 增加条件
         * @param condition
         */
        addCondition: function(condition) {
            var self = this;
            if (!visaList._condition_) {
                visaList._condition_ = {};
            }
            return $.extend(visaList._condition_, condition);
        },
        /**
         * @desc 移除条件
         * @param
         */
        removeCondition: function() {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 0);
            for (var j = 0; j < args.length; j++) {
                for (var i in visaList._condition_) {
                    if (i === args[j]) {
                        delete visaList._condition_[i];
                    }
                }
            }
        },
        initFilterEv: function() {
            var self = this;
            $(".rowlist a").on("click", function(e) {
                var me = $(this),
                    dataKey = me.parents(".rowbox").attr("data-key"),
                    dataVal = me.attr("data-value");
                if (me.hasClass("disabled")) {
                    return;
                }
                if (!me.hasClass("on")) {
                    me.parents(".rowlist").find("a").removeClass("on");
                    me.addClass("on");
                    var datas = {};
                    datas[dataKey] = dataVal;
                    self.addCondition(datas);
                    self._initFilter();
                }
            });
            $(".more-btn").on("click", function() {
                var me = $(this);
                if (!me.hasClass("less-btn")) {
                    me.html("收起");
                    me.addClass("less-btn");
                    $(".rowbox-hid").addClass("alllist");
                } else {
                    me.html("更多");
                    me.removeClass("less-btn");
                    $(".rowbox-hid").removeClass("alllist");
                }
            });
            //排序 (0)-》综合排序 (1)-》价格 (2)-》办理时长 (3)-》满意度
            $(".sort-ul >li a").on("click", function(e) {
                e.preventDefault();
                var parEl = $(this).parent("li");
                var index = parEl.index();
                var obj = {};
                parEl.addClass("cur").siblings().removeClass("cur");
                switch (index) {
                    case 0:
                        obj.isTCRecommand = 1;
                        break;
                    case 1:
                        $(this).toggleClass("order-by-desc");
                        if ($(this).hasClass("order-by-desc")) {
                            obj.sortPriceType = 0;
                            parEl.find("a").attr("title", "按照价格从高到低排序");
                        } else {
                            obj.sortPriceType = 1;
                            parEl.find("a").attr("title", "按照价格从低到高排序");
                        }
                        break;
                    case 2:
                        obj.sortTranTRType = 0;
                        break;
                    case 3:
                        obj.sortSatDegType = 1;
                        break;
                    case 4:
                        obj.sortOrderCountType = 1;
                        break;
                }
                self.removeCondition("isTCRecommand", "sortPriceType", "sortTranTRType", "sortSatDegType", "sortOrderCountType");
                self.addCondition(obj);
                self._initFilter();
            });
        },
        _initFilter: function() {
            var self = this;
            $("#tagList").empty();
            $("#J_LablePager").empty();
            $("#J_NoLine").hide();
            $(".loading").show();
            self.ajax(visaList._condition_)
                .then(function(data) {
                    $(".loading").hide();
                    if (data == null || data.TotalCount === 0) {
                        $("#tagList").empty();
                        $("#J_LablePager").empty();
                        $("#J_NoLine").show();
                        return;
                    }
                    visaList.renderPager(visaList._condition_, data);
                });
        }
    }
};
module.exports = visaList;
