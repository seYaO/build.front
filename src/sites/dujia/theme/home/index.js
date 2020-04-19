/**
 * Created by wj12961 on 2016/2/4.
 */
(function () {
    define(["slidertoolbar/0.1.0/index",'lazyload/0.1.0/index', 'tmpl/theme/index/proList', 'departure/0.1.0/index', 'jCarousel/0.2.1/index', 'scrollSpy/0.2.0/index'
        , "intellsearch/0.1.0/search", "intellsearch/0.1.0/intellsearch", "intellsearch/0.1.0/history", "intellsearch/0.1.0/track", 'intellsearch/0.1.0/hotcity', 'intellsearch/0.1.0/tmpl/themeSearch'], function (require) {

        require("lazyload/0.1.0/index");
        require("jCarousel/0.2.1/index");
        require('scrollSpy/0.2.0/index');
        var Departure = require('departure/0.1.0/index');
        var themeSearch = require('intellSearch/0.1.0/tmpl/themeSearch');
        var Slidertoolbar = require("slidertoolbar/0.1.0/index");
        var Monitor = window.Monitor;
        var Index = {};

        var Tpl = require("tmpl/theme/index/proList");
        Index._data = {};
        Index.init = function () {
            Index.startCity();
            Index.carousel();
            Index.search();
            Index.hotThemes();
            Index.themeTabs();
            Index.scrollSide();
            Index.lazyLoad();
            Index.initEvent();
            Index.slider();
        };
        //右侧通栏部分
        Index.getUser = function () {
            var loginInfo = $.cookie("us"),
                userid;
            if (loginInfo) {
                userid = /userid=(\d+)/i.exec(loginInfo);
                userid = userid ? userid[1] : userid;
            }
            return userid;
        };
        Index.slider = function(){
            var userid = Index.getUser();
            var slider = new Slidertoolbar({
                header: {
                    icon: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/haidao.html"><img src="http://img1.40017.cn/cn/v/2015/index2016/right-top.jpg"></a>',
                    tooltips: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/haidao.html"><img src="http://img1.40017.cn/cn/v/2015/index2016/top-haidao.jpg"></a>'
                },
                topMenu: [{
                    icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
                    tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><div class="ico c-3"></div></a>',
                    tooltips: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><span class="ico-title">我的收藏<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><div class="ico c-4"></div></a>',
                    tooltips: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><span class="ico-title">意见反馈<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a class="ico c-2"></a>',
                    tooltips: '<a><span class="ico-title"><b class="J_tel">4007-777-777</b><i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><div class="ico c-5"></div></a>',
                    tooltips: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><span class="ico-title">在线客服<i></i></span></a>',
                    arrow: false
                }],
                bottomMenu: [{
                    icon: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
                    tooltips: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a><div class="ico c-7"></div></a>',
                    tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
                    tooltipCls: 'chujing-code',
                    arrow: false
                }, {
                    icon: '<a><div class="ico c-8"></div></a>',
                    tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
                    tooltipCls: 'app-code',
                    arrow: false
                }],
                toTop: true,
            });
            if (userid) {
                slider.resetMenu({
                    icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
                    tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                }, 'top', 0);
            }
        };
        Index.initEvent = function () {
            $(window).on("scroll", function () {
                var scrolltop = $(window).scrollTop();
                260 > scrolltop ? $(".side-tab").hide() : $(".side-tab").show()
            });
        };
        Index.lazyLoad = function () {
            if (Index.isInit) {
                var imgList = $('.product img').not("[data-img-loaded]");
                $("body").trigger('addElements', imgList);
            } else {
                $('.product img').lazyload({
                    "data_attribute": 'img',
                    effect: 'fadeIn'
                });
                Index.isInit = true;
            }
        };


        //出发城市插件
        Index.startCity = function () {
            var self=this;
            new Departure({
                cityId:$('#Startcityid').val()||321,
                cityName:$('#Startcityname').val()||'上海',
                className: ".citybox",
                eventType: 'click',
                success: function () {
                    $('.J_line').each(function () {
                        var currentLi = $(this).find('.J_tabs .current');
                        var themeType = currentLi.attr('data-themetype'),
                            themeid = currentLi.attr('data-themeid');
                            //获取主题产品
                            self.handleLine({
                                "priThemeType": themeType,
                                "subThemeType": themeid,
                                "lcId": $('#city_select').attr('data-scid')
                            });
                    });
                    var cityId = $("#city_select").attr("data-scid");
                    $.cookie('indexStartCity',cityId,{expires:1,path:"/",domain:".ly.com"});

                }
            }).init();
        };

        /**
         *  热门主题切换
         */
        Index.hotThemes = function () {
            $('.J_listbox').hover(function () {
                var self = $(this),
                    showlist = $('.showlist', self);
                self.addClass('active').siblings().removeClass('active');
                var showlist_h1 = self.offset().top,
                    showlist_h2 = showlist.outerHeight(true),
                    scrolltop = $(window).scrollTop(),
                    win_h = $(window).height(),
                    py = showlist_h1 + showlist_h2 - win_h - scrolltop;
                if (py > 0) {
                    showlist.css('top', -py + 'px');
                }
            }, function () {
                var self = $(this),
                    showlist = $('.showlist', self);
                $('.J_listbox').removeClass('active');
                showlist.css('top', '0px');
            });
        };
        /**
         * 主题tabs切换
         */
        Index.themeTabs = function () {
            var self = this;
            $('.J_tabs').on('click', 'li', function (e) {
                if ($(this).hasClass('current')) {
                    return;
                }
                $(this).addClass('current').siblings().removeClass('current');
                $(this).parents('.J_tabs').find('.area__link').html($(this).attr('more-line')).attr('href', $(this).attr('more-url')).attr('trace',$(this).index());

                var themeId = $(this).attr('data-themeid'),
                    themeTypeId = $(this).attr('data-themetype');

                self.handleLine({
                    "priThemeType": themeTypeId,
                    "subThemeType": themeId,
                    "lcId": $('#city_select').attr('data-scid')
                });
            });

        },
        /**
         * 幻灯片切换
         *
         */
            Index.carousel = function () {
                Carousel('.sliderbox', {
                    auto: 5000,
                    visible: 1,
                    circular: true,
                    vertical: false,
                    triggerType: 'mouseover',
                    preload: 1,
                    btnNav: true
                });
            };
        /**
         * 线路处理
         * @param config
         */
        Index.handleLine = function (config) {
            var url = window.host + '/dujia/virtual/ThemeLabelHandler.ashx?type=GetThemeLabelProduct';
            var self = this;
            var priThemeTypeID = config.priThemeType,
                subThemeTypeID = config.subThemeType,
                cityId = config.lcId;
            var key =cityId+"_"+ priThemeTypeID + "_" + subThemeTypeID,
                context = "#J_proList_" + priThemeTypeID

            var tarEl = $(context + " .J_proList" + key);

            if (!Index._data[cityId + "|" + priThemeTypeID + "|" + subThemeTypeID]) {
                $.ajax({
                    "url": url,
                    "data": config,
                    "dataType": "jsonp",
                    beforeSend: function () {
                        $(context).find('prolist').hide();
                        $(context).parent('.line-content').addClass('bg_load');
                    },
                    success: function (data) {
                        //附加一个key值，方便切换
                        //data.key = key;
                        $(context).parent('.line-content').removeClass('bg_load');
                        Index._data[cityId + "|" + priThemeTypeID + "|" + subThemeTypeID] = data.data.ProductList;
                        Index.render({
                            "tpl": Tpl,
                            "data": data.data.ProductList,
                            "key": key,
                            "overwrite": false,
                            "context": context,
                            "callback": function () {
                                $(this).siblings().hide();
                                Index.lazyLoad();
                                //self.resize();
                            }
                        });
                    },
                    error: function () {
                        Monitor.log("获取线路失败" + url, "handleLine");
                    }
                });
            } else if (!tarEl.length) {
                //当改变出发地时要走渲染逻辑
                Index.render({
                    "tpl": Tpl,
                    "data": Index._data[cityId + "|" + priThemeTypeID + "|" + subThemeTypeID],
                    "key": key,
                    "overwrite": true,
                    "context": context,
                    "callback": function () {
                        $(this).show().siblings().hide();
                        Index.lazyLoad();
                        //self.resize();
                    }
                });
            } else {
                tarEl.show().siblings().hide();
            }
        };
        /**
         * 渲染逻辑同touch
         * @param config
         */
        Index.render = function (config) {
            if (!config.data) {
                config.data=[];
            }
            var tpl = config.tpl,
                key = config.key,
                data = config.data[key] || config.data,
                context = $(config.context),
                callback = config.callback;
            data.key = key;
            var _html = tpl(data),
                cxt;
            if (config.overwrite) {
                context.empty();
            }
            cxt = $(_html).appendTo(context);
            if (data.length == 0) {
                $(context).find('.J_proList' + key).html('该线路不存在，请切换其他线路！');
            }
            if (callback && $.isFunction(callback)) {
                callback.call(cxt, config);
            }
        };
        Index.scrollSide = function () {
            $('.J_side-tab').scrollspy({
                topH: 350,
                pClass: '.J_side-tab',
                curClass: 'active',
                contentClass: '.J_line',
                tabList: $('.J_side-tab li'),
                scrollFn: function (el, isDown) {

                }
            });
        };

        /**
         * 只能搜索框
         */
        Index.search = function () {
            var NewSearch = require("intellsearch/0.1.0/search"),
                intellSearch = require("intellsearch/0.1.0/intellsearch"),
                history = require("intellsearch/0.1.0/history"),
                hotcity = require("intellsearch/0.1.0/hotcity"),
                track = require("intellsearch/0.1.0/track");
            var l_cityid = $("#Startcityid").val();

            //智能搜索配置
            var searchconf = {
                input: "#search",
                highLightStyle: "color:#ff6a00;font-weight:bolder;",//高亮显示内容样式
                apiurl:"/dujia/virtual/ThemeLabelHandler.ashx?type=GetAutoCompleteResult&section=1-10&keyword={keyword}",
                //apiurl:"http://10.1.56.20:10086/ajaxhelper/ThemeLabelHandler.ashx?type=GetAutoCompleteResult&section=1-10&t={keyword}&locationCityId={l_cityid}&selectCityId={s_cityid}",
                showCount: false,
                itemNumber: 8,//显示的条数
                reqData: function (keyword, res) {
                    var self = this;
                    var _data = new Array();
                    var url = this.get("apiurl"),
                        s_cityid = $("#city_select").attr("data-scid");
                    url = url.replace("{keyword}", keyword).replace("{l_cityid}", l_cityid).replace("{s_cityid}", s_cityid);

                    this.getJsonp(url, function (data) {
                        if (data != null && data.code == 4000) {
                            if(data.data.MainTheme.length !== 0){
                                for (var i = 0; i < data.data.MainTheme.length && (i < self.itemNumber) ; i++) {
                                    var item = data.data.MainTheme[i];
                                    var value = item.Name;
                                    //var level = (item.itemType == "list") ? 1 : 2;
                                    _data.push(self.itemDataFormat(keyword, { value: value,text: value}));
                                }
                                res(_data);
                            }else{
                                _data.push(self.itemDataFormat("", { value: "",text: "",keyword:""}));
                                res(_data);
                            }
                        }
                        else {
                            res(null);
                        }
                    });
                },
            };

            //历史记录配置
            var historyconf = {
                "name": "search",
                "user": "ly",
                //"dotTemplate": historyTmpl,
                itemNumber: 15,//显示的条数
            };

            var trackconf = {};
            //组件初始化
            var o_intel = new NewSearch({
                el: ".search",
                width: "100%",
                dotTemplate: themeSearch,
                modules: {
                    intellSearch: {
                        type: 'module',
                        key: 'intellSearch',
                        config: searchconf,
                        module: intellSearch
                    },
                    history: {
                        type: 'module',
                        key: 'history',
                        config: historyconf,
                        module: history
                    },
                    track: {
                        type: 'module',
                        key: 'track',
                        hasPanel: false,
                        config: trackconf,
                        module: track
                    }
                }
            });
            o_intel.on("submit", function () {
                var StartCityName=$('#city_select').attr("data-scid");
                var inputtext = o_intel.getTrackData("keyword");
                var text = o_intel.getTrackData("text");
                var destData;
                if(text === undefined || text === ""){
                    destData = inputtext;
                }else{
                    destData = text;
                }
                var link = window.host+"/dujia/theme/search.aspx?src="+StartCityName+"&dest="+destData;
                if (link) {
                    window.open(link);
                }
            });



        }

        Index.init();
    });
})();
