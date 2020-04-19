/**
 * Created by yl17006 on 2016/12/02
 */
var Common = require("common/0.1.0/index"),
    storage = require("common/0.1.0/storage"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"), //侧导航
    Dialog = require("dialog/0.2.0/dialog");
var prolistTmpl = require("./views/prolist.dot");
require("modules/startlist/0.1.0/index").init();
require("lazyload/0.1.0/index");
require("pager/0.3.0/index");
var visaList = {
    telUrl: $(".c_phone").attr("attr-url") || '',
    noticeUrl: "//www.ly.com/commonajax/AjaxHandler/GetHelpQuestionResult?",
    keyWordUrl: "/intervacation/api/VisaInfo/GetShowTabAndHotWords?",
    pageUrl: "/dujia/AjaxCallTravel.aspx?type=GetVisaLabelPageListNew",
    siderUrl: "/intervacation/api/VisaInfo/GetPCVisaAd",
    numberUrl: "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue",
    init: function(conf) {
        var self = this;
        self.initTip();
        self.initAjax();
        self.initEvent();
        self.changeUrl(".leavecity dd a");
        self.lazyLoad();
        self.jumpUrl();
        self.filter.init(conf);
        self.filter.initFilterEvent();
        self.getPage($.extend(conf, visaList._condition_ || ""));
        self.sideadfn(function() {
            self.hideNumber();
        });
    },
    //全局ajax异步
    getJson: function(url, Jdata, callback, dataType) {
        common.ajax({
            url: url,
            data: Jdata,
            dataType: dataType || "jsonp",
            success: function(data) {
                callback(data);
            },
            error: function(err) {
                window.monitorModule.log("获取接口数据失败" + url, "pc_visa_list");
            }
        });
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

    hideNumber: function() {
        var self = this;
        self.getJson(self.numberUrl, "", function(data) {
            var curDate = "";
            if (data && data.totalseconds) {
                var total = data.totalseconds.replace(/-/g, "/");
                curDate = Common.dateFormat(new Date(total), "yyyyMMdd");
            } else {
                var now = new Date();
                curDate = Common.dateFormat(now, "yyyyMMdd");
            }
            if (curDate > 20170126 && curDate < 20170203) {
                $(".c_phone_add").css("display", "none");
                $(".module-slider-top").find("li").eq(1).css("display", "none")
            }
        });
    },

    //获取连接参数
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    },

    //获取会员id
    getUser: function() {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },

    //侧栏广告图走广告位
    sideadfn: function(callback) {
        var self = this;
        self.getJson(self.siderUrl, "", function(data) {
            if (data.Status == "Success") {
                var smallAd = data.Data.Slide.SmallAd,
                    LargeAd = data.Data.Slide.LargeAd;
                self.slider(smallAd, LargeAd);
                callback && callback.call(self);
            }
        })
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
            var imgList = $(".product-box img").not("[data-img-loaded]").not(".chengyi-jingpin");
            $("body").trigger("addElements", imgList);
        } else {
            $(".product-box img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            visaList.isInit = true;
        }
    },

    //获取页面初始化数据
    initAjax: function() {
        var self = this;
        //领馆通知信息
        var noticePram = {
            levelOneName: "签证",
            levelTwoName: "领馆通知",
            ZoneId: ($("#hidCountryId").val() || "")
        };
        self.getJson(self.noticeUrl, noticePram, function(data) {
            var list = data && data.ReturnValue;
            if (list && list.length) {
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    var on = i == 0 ? "on" : "";
                    str = str + '<span class=' + on + '><h6 class="J_btnNotice" title=' + list[i].Title + '>' + list[i].Title + '</h6><p>' + list[i].Content.replace(/<[^>]+>/g, "") + '<i>—' + list[i].CreatDate + '</i></p></span>'
                };
                $(".notice").append(str).show();
            }
        });

        //关键词和外链
        var keyWordPram = {
            siteType: 0,
            singleType: 9,
            dest: ($("#hidCountryName").val() || ""),
            provinceId: ($("#hidProvinceId").val() || "")
        };
        self.getJson(self.keyWordUrl, keyWordPram, function(res) {
            var data = res && res.Data || {},
                list = data.HotWords || [],
                cityId = $("#hidCityId").val() || "",
                enName = $("#hidCountryPinYin").val() || "",
                dest = keyWordPram.dest;
            if (list.length) {
                var str = "",
                    html = "";
                for (var i = 0; i < list.length; i++) {
                    str = str + '<a href="/dujia/visa/country-' + list[i].IVREnName + '.html" class="" target="_blank" title="' + list[i].CountryName + '签证">' + list[i].CountryName + '</a>';
                };
                $(".cj-word").append(str).show();
            }

            if (data.IsShowChujing) {
                html = html + '<a href="/dujia/' + enName + '-lvyou/f' + cityId + '" target="_blank" title="' + dest + '出境旅游">' + dest + '出境旅游</a>';
            }
            if (data.IsShowWanle) {
                html = html + '<a href="/dujia/wanle/' + enName + '-dangdi" target="_blank" title="' + dest + '玩乐">' + dest + '玩乐</a>';
            }
            if (data.IsShowWifi) {
                html = html + '<a href="/dujia/wanle/' + enName + '-tongxun" target="_blank" title="' + dest + 'WIFI">' + dest + 'WIFI</a>';
            }
            if (html) {
                $(".filter").find(".other").append(html).show();
            }
        }, "json");
    },

    //初始化冒泡
    initTip: function() {
        var dialog = new Dialog({
            skin: 'default',
            template: {
                tooltip: {
                    width: '430px'
                }
            }
        });
        var odl = dialog.tooltip({
            content: function(obj) {
                var text = $(obj).attr('data-content');
                var width = '300px';
                odl.set('width', width);
                return text;
            },
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function() {}, //隐藏后触发事件
            triggerEle: '.J_tips', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
        });
    },

    //初始化事件
    initEvent: function() {
        //办理要求
        $(document).on("click", ".J_btnRequire", function(e) {
            e.stopPropagation();
            var me = $(this),
                btn = $(".J_btnRequire"),
                box = $(".product-box").find(".details"),
                detail = me.parents("li").find(".details");
            if (!me.hasClass("on")) {
                btn.removeClass("on");
                box.addClass("none");
                me.addClass("on");
                detail.removeClass("none");
            } else {
                me.removeClass("on");
                detail.addClass("none");
            }
        });

        //展开更多
        $(document).on("click", ".J_btnMore", function() {
            var me = $(this),
                ul = me.parents("ul");
            if (me.hasClass("on")) {
                ul.find("li[class*='block']").removeClass("block").addClass("none");
                me.find("em").text("展开更多");

            } else {
                ul.find("li[class*='none']").removeClass("none").addClass("block");
                me.find("em").text("收起");
            }
            me.toggleClass("on");
        });

        //领馆公告
        $(document).on("click", ".J_btnNotice", function() {
            $(this).parent().siblings().removeClass("on");
            $(this).parent().addClass("on");
        });

        $(".countrybox").hover(function() {
            $("#popcountry").show();
            $(this).find(".country_span").addClass("hover");
        }, function() {
            $("#popcountry").hide();
            $(this).find(".country_span").removeClass("hover");
        });
    },
    /**
     * @desc 处理分页
     */
    renderPager: function(cfg, data) {
        var self = this,
            total = data.TotalCount,
            totalPage = Math.ceil(total / 4),
            list = (data && data.PackageList) || [];
        self.render(data, self.lazyLoad);
        if (totalPage === 1 && !list.length) {
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
        var tos = $("#hidTotalCount").val() || 0,
            tosl = Math.ceil(parseInt(tos, 10) / 4),
            allpage = totalpage ? totalpage : tosl,
            param = $.extend({}, cfg);
        if (allpage <= 1 && tos <= 0) {
            $("#J_NoLine").show();
            return;
        } else {
            $("#J_NoLine").hide();
        }
        $('#J_LablePager').page({
            current: 1,
            total: allpage,
            needFirstAndLast: false,
            pageNoParam: "pageNum",
            needJump: true,
            ajaxObj: {
                url: self.pageUrl,
                data: param,
                dataType: "jsonp",
                success: function(data) {
                    var list = (data && data.PackageList) || [],
                        TNumber = (param.pageNum - 1) * param.count;
                    if ((param.pageNum >= allpage) && !list.length) {
                        $("#J_NoLine").show();
                    } else {
                        $("#J_NoLine").hide();
                    }
                    $.extend(data, {TNumber:TNumber});
                    self.render(data, self.lazyLoad);
                    var msgTop = parseInt(parseInt($(".filter").offset().top));
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
        var self = this,
            name = $("#hidCountryName").val() || 0;
        $.extend(data, {
            CountryName: name
        });
        $(".mod-pager").empty().append(prolistTmpl(data));
        callback && callback.call(this);
    },
    /**
     * @desc 筛选模块
     */
    filter: {
        init: function(conf) {
            var param = $.extend({}, this.defaultFilterParam(), conf || {});
            visaList._condition_ = param;
        },

        initFilterEvent: function() {
            var self = this;
            $(".J_btnSelect").on("click", function() {
                var me = $(this);
                me.hide();
                me.siblings(".btn").show();
                me.siblings("span[class*='all']").hide();
                me.siblings("span").addClass("input");
                me.siblings("span[class*='on']").addClass("checked");
            });

            $(".J_btnMany i").on("click", function() {
                var me = $(this),
                    parent = me.parents(".btn"),
                    rowbox = me.parents(".rowlist"),
                    input = parent.siblings("span.input");
                if (me.hasClass("submit")) {
                    var datas = {},
                        dataKey = rowbox.attr("data-key"),
                        dataVal = me.attr("data-value") || "";
                    input.each(function() {
                        if ($(this).hasClass("checked")) {
                            var str = dataVal ? "," : "";
                            dataVal = dataVal + str + ($(this).attr("data-value") || "");
                        }
                    });
                    if (!dataVal) return;
                    parent.hide();
                    parent.siblings(".select").show();
                    input.removeClass("input").removeClass("on");
                    parent.siblings("span.checked").removeClass("checked").addClass("on");
                    parent.siblings("span[class*='all']").removeClass("on").show();
                    datas[dataKey] = dataVal;
                    self.addCondition(datas);
                    self._initFilter();
                } else if (me.hasClass("cancel")) {
                    parent.hide();
                    parent.siblings("span[class*='all']").show();
                    parent.siblings(".select").show();
                    input.removeClass("checked").removeClass("input");
                }
            });
            //条件筛选
            $(".rowlist span").on("click", function(e) {
                var me = $(this),
                    rowbox = me.parents(".rowlist"),
                    dataKey = rowbox.attr("data-key"),
                    dataVal = me.attr("data-value") || "";
                if (me.hasClass("input")) {
                    me.toggleClass("checked");
                    return;
                }
                if (me.hasClass("on")) return;
                rowbox.find("span").removeClass("on");
                me.addClass("on");
                var datas = {};
                datas[dataKey] = dataVal;
                self.addCondition(datas);
                self._initFilter();
            });

            //排序 (0)-》销量 (1)-》价格 (2)
            $(".sort_list span").on("click", function() {
                var me = $(this),
                    index = me.index();
                var obj = {};
                me.siblings().removeClass("on");
                me.addClass("on");
                switch (index) {
                    case 0:
                        obj.sortOrderCountType = 1;
                        me.siblings().addClass("desc");
                        break;
                    case 1:
                        me.toggleClass("desc");
                        if (!me.hasClass("desc")) {
                            obj.sortPriceType = 0;
                            me.attr("title", "按照价格从低到高排序");
                        } else {
                            obj.sortPriceType = 1;
                            me.attr("title", "按照价格从高到低排序");
                        }
                        break;
                }
                self.removeCondition("sortPriceType", "sortOrderCountType");
                self.addCondition(obj);
                self._initFilter();
            });
        },

        //获取参数字段
        defaultFilterParam: function() {
            var pageNum = 1,
                count = 4,
                relatedId = $(".J_visaRelated .on").attr("data-value") || "",
                comIds = $(".J_visaCom .on").attr("data-value") || "",
                acceptRId = $(".J_visaAccept .on").attr("data-value") || "";
            return $.extend({}, {
                pageNum: pageNum,
                count: count,
                relatedId: relatedId,
                comIds: comIds,
                acceptRId: acceptRId,

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

        _initFilter: function() {
            $(".mod-pager").empty();
            $("#J_LablePager").empty();
            $("#J_NoLine").hide();
            $(".loading").show();
            visaList.getJson(visaList.pageUrl, visaList._condition_, function(data) {
                $(".loading").hide();
                if (!data || data.TotalCount === 0) {
                    $(".mod-pager").empty();
                    $("#J_LablePager").empty();
                    $("#J_NoLine").show();
                    return;
                }
                visaList.renderPager(visaList._condition_, data);
            });
        }
    },
    
    // //跳转终页
    jumpUrl:function(){
        $(document).on("click",".product-list li .route-link,.product-list li .title a,.product-list li .btn a",function(){
            var ele = this;
            var goUrl = $(ele).data("href");
            window.open(goUrl);
        })
    }

};
module.exports = visaList;
