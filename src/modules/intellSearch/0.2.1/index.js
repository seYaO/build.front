/**
* Created by lyy14569 on 2016/4/12.
*/
/* global $ */
define("intellSearch/0.2.1/index", ["intellSearch/0.2.1/search", "intellSearch/0.2.1/intellSearch", "intellSearch/0.2.1/history",
    "intellSearch/0.2.1/track", 'intellSearch/0.2.1/hotcity', 'intellSearch/0.2.1/search-label', "departure/0.2.0/index"], function (require) {
    var Search = require("intellSearch/0.2.1/search"),
    intellSearch = require("intellSearch/0.2.1/intellSearch"),
    history = require("intellSearch/0.2.1/history"),
    track = require("intellSearch/0.2.1/track"),
    hotcity = require("intellSearch/0.2.1/hotcity"),
    searchLabel = require("intellSearch/0.2.1/search-label"),
    Departure = require("departure/0.2.0/index");

    var IntellSearch = {};
    IntellSearch.init = function (_conf) {
        var conf = {
            el: ".search",
            hotCityTmpl: "",
            initCityID: "",
            initCityName: "",
            searchLabelData: [{hotName: "苏州", hotUrl: "http://www.ly.com"},
                {hotName: "上海", hotUrl: "http://www.ly.com"},
                {hotName: "北京", hotUrl: "http://www.ly.com?cityId={{replace}}"}
            ],
            initRender:function(){},
            callback: function () {

            }
        };
        $.extend(conf, _conf);

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
                url = url.replace("{keyword}", keyword).replace("{l_cityid}", s_cityid).replace("{s_cityid}", s_cityid);
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
                        var num = (data.data.length>self.itemNumber)?self.itemNumber : data.data.length;
                        self.o_pobj.setTrackData("shownum",num);
                        res(_data);
                    }
                    else {
                        res(null);
                    }
                });
            }
        };

        var option = {
            el: conf.el,
            width: "100%",
            modules: {}
        }

        //智能搜索
        option.modules.intellSearch = {
            type: 'module',
            key: 'intellSearch',
            config: searchConf,
            module: intellSearch
        };
        //热门城市
        if (conf.hotCityTmpl) {
            option.modules.hotcity = {
                type: 'module',
                key: 'hotcity',
                module: hotcity,
                config: {
                    dotTemplate: conf.hotCityTmpl,
                    reqData: function (res) {
                        res(null);
                    }
                }
            };
        }

        //历史记录
        option.modules.history = {
            type: 'module',
            key: 'history',
            config: {
                "name": "search",
                "user": "ly",
                //"dotTemplate": historyTmpl,
                itemNumber: 15//显示的条数
            },
            module: history
        };

        //搜索标签
        option.modules.searchLabel = {
            type: 'module',
            key: 'searchLabel',
            config: {
                data: conf.searchLabelData
            },
            group: 'searchlabel',
            module: searchLabel
        };

        //监控
        option.modules.track = {
            type: 'module',
            key: 'track',
            hasPanel: false,
            config: {param:conf.trackdata},
            module: track
        };

        //初始化
        var o_intel = new Search(option);

        o_intel.on("submit", function () {
            var link = o_intel.getTrackData("link");
            if (link) {
                window.open(link);
            }
        });
        //热门搜索点击
        o_intel.getModule("hotcity") && o_intel.getModule("hotcity").on("itemClick", function (e, o) {
            var link = $(o).attr("data-href");
            if (link) {
                var s_cityid = $("#city_select").attr("data-scid");
                link = link.replace(/{{startcityid}}/g, s_cityid);
                window.open(link);
            }
        });

        new Departure({
            className: '.citybox',
            eventType: 'click',
            cityId: conf.initCityID,
            cityName: conf.initCityName,
            initRender:conf.initRender,
            success: function (param) {
                o_intel.getModule("track").setTrackData("cityid",param.cityid);
                conf.callback && conf.callback();
            }
        }).init();

        return o_intel;
    };

    return IntellSearch;
});