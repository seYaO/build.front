/**
 * Created by lyf10464 on 2016/2/4.
 */
/* global $ */
define("intellSearch/0.1.0/newSearch",["departure/0.2.0/index", "intellsearch/0.1.0/search", "intellsearch/0.1.0/intellsearch", 'intellsearch/0.1.0/hotcity',
    "intellsearch/0.1.0/history", "intellsearch/0.1.0/track", "lazyload/0.1.0/index",'intellsearch/0.1.0/tmpl/newSearch'],function(require){
    var Departure = require("departure/0.2.0/index");
    require("lazyload/0.1.0/index");
    var IntellSearch = function () {};
    IntellSearch.prototype = {
        init: function(cfg){
            var self = this;
            self.departure(cfg.callback);
            self.componentsInit(cfg.hotDest);
        },
        cityId: "",
        //组件初始化
        componentsInit: function(conf) {
            //搜索框组件
            var NewSearch = require("intellsearch/0.1.0/search"),
                intellSearch = require("intellsearch/0.1.0/intellsearch"),
                hotcity = require("intellsearch/0.1.0/hotcity"),
                history = require("intellsearch/0.1.0/history"),
                track = require("intellsearch/0.1.0/track");
            var tmplSearch = require('intellSearch/0.1.0/tmpl/newSearch');
            var l_cityid = $("#StartCityId").val();
            var StartCityName = $("#StartCityName").val();


            //智能搜索配置
            var searchConf = {
                input: "#search",
                highLightStyle: "color:#ff6a00;font-weight:bolder;",//高亮显示内容样式
                apiurl: "//www.ly.com/dujia/ajaxhelper/homepagehandler.ashx?type=SearchList&keyWord={keyword}&locationCityId={l_cityid}&selectCityId={s_cityid}",
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
                            for (var i = 0; i < data.data.length && (i < self.itemNumber); i++) {
                                var item = data.data[i];
                                var value = item.content;
                                var link = item.link;
                                var level = (item.itemType == "list") ? 1 : 2;
                                _data.push(self.itemDataFormat(keyword, {
                                    value: value,
                                    link: link,
                                    text: value,
                                    level: level
                                }));
                            }
                            res(_data);
                        }
                        else {
                            res(null);
                        }
                    });
                }
            };

            /**
             * @desc 热门城市配置
             * */
            var hotCityConf = {
                dotTemplate: $("#hd_hotcityhtml").html(),
                reqData: function (res) {
                    res(null);
                }
            };

            //历史记录配置
            var historyconf = {
                "name": "search",
                "user": "ly",
                //"dotTemplate": historyTmpl,
                itemNumber: 15//显示的条数
            };

            var trackconf = {};
            //组件初始化
            var o_intel = new NewSearch({
                el: ".search",
                width: "100%",
                dotTemplate: tmplSearch,
                modules: {
                    intellSearch: {
                        type: 'module',
                        key: 'intellSearch',
                        config: searchConf,
                        module: intellSearch
                    },
                    hotcity: {
                        type: 'module',
                        key: 'hotcity',
                        config: hotCityConf,
                        module: hotcity
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
                },
                hotSearch: conf
            });
            o_intel.on("submit", function () {
                var link = o_intel.getTrackData("link");
                if (link) {
                    window.open(link);
                }
            });
            //热门搜索点击
            o_intel.getModule("hotcity").on("itemClick", function (e, o) {
                var link = $(o).attr("data-href");
                if (link) {
                    var s_cityid = $("#city_select").attr("data-scid");
                    link = link.replace(/{{startcityid}}/g, s_cityid);
                    window.open(link);
                }
            });
        },
        departure: function (callback) {
            new Departure({
                className: '.citybox',
                eventType: 'click',
                cityId: $('#Startcityid').val(),
                cityName: $('#Startcityname').val(),
                success: function () {

                    callback && callback();
                }
            }).init();
        }
    };
    return IntellSearch;
});
