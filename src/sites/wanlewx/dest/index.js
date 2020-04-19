(function () {
    function City() {
        var self = this;
        // factory or constructor
        if (!(self instanceof City)) {
            return new City();
        }
    }

    var Common = require("/modules-lite/common/index"),
        Mobile = require("/modules-lite/wanleCommon/common"),
        // tmpl = __inline("./views/dest.dot"),
        tmpl = require("./ajaxdot/history.dot"),
        // url,
        // source, Platment,
        share = require("/modules-lite/utils/share/index"),
        dataCallback = {};//为了native
    share.disable();

    //source为0，来自wifi首页；
    //source为1，来自玩乐首页；
    source = Common.getQueryString("source");
    // if (parseInt(source) === 0) {
    //     //url = Config.getInterface("getWXWLWifiDestCityList");
    //     Platment = 61035;
    //     url = "http://www.t.ly.com/wanle/api/WWanleProduct/GetDestList?siteType=1&" + "Platment=" + Platment;
    // } else {
    //     //url = Config.getInterface("getWXWLWanleDestCityList");
    //     Platment = 61034;
    //     url = "http://www.t.ly.com/wanle/api/WWanleProduct/GetDestList?siteType=1&" + "Platment=" + Platment;
    // }


    City.prototype = {
        el: ".J_include_history",
        storeKey: "cj_wanle_history",
        init: function (cfg) {
            var self = this;
            $.extend(self, cfg);
            self.getHistory();
            if (!self.isInit) {
                self.get();
                self.isInit = true;
            }
        },
        get: function () {
            var self = this;
            // Common.getData(url, function (data) {
            //     data.history = self.history;
            //     data.searchCon = $(".J_History li").text();
            //     self.render(data);
            // });
            var data = {};
            data.history = self.history;
            data.searchCon = $(".J_History li").text();
            self.render(data);
        },
        getHistory: function () {
            var self = this,
                his = localStorage.getItem(self.storeKey);
            if (!his) {
                return self.history = [];
            }
            return self.history = his.split(",");
        },
        setHistory: function (cityName) {
            var self = this,
                history = self.history;
            var index = history.indexOf(cityName);
            if (~index) {
                history.splice(index, 1);
            }
            history = [cityName].concat(history);
            if (history.length > 6) {
                history.pop();
                self.history = history;
            }
            localStorage.setItem(self.storeKey, history.join(","));
            var hisEl = $(".J_History");
            hisEl.find("ul").empty().append("<li>" + history.join("</li><li>") + "</li>");
            hisEl.removeClass("none");
        },
        clearHistory: function () {
            localStorage.removeItem(this.storeKey);
            this.history = [];
            var hisEl = $(".J_History");
            hisEl.find("ul").empty();
            hisEl.addClass("none");
        },
        render: function (data) {
            data.source = parseInt(source);
            var self = this;
            var html = tmpl(data);
            $(self.el).empty().append(html);
            self.initEvent();
        },
        initEvent: function () {
            var self = this;

            $(".J_DestPage").on("click", ".city-dest li", function () {
                var me = $(this),
                    cityName = me.html();
                if (me.find("a").length > 0) {
                    self.setHistory(cityName);
                } else {
                    self.setHistory(cityName);
                    self.itemClick && self.itemClick.call(self, cityName, this);
                    window.location.href = "/localfun/" + cityName + ".html?sourceId=" + source;
                }
                self.isAPPList(cityName);//为了native
            });
            $(".J_ClearHis").on("click", function () {
                self.clearHistory();
            });

            $(".onsearch").on("click", function () {
                var _this = this,
                    value = $.trim($("input").eq(1).val());
                if (value) {
                    self.setHistory(value);
                    self.isAPPList(value);//为了native
                    //window.location.href = "/localfun/" + value + ".html?sourceId=" + source;
                }

            });

            $("input").bind("keypress", function (event) {
                var _this = this,
                    value = $.trim($(_this).val());
                if (event.keyCode === 13 && value) {
                    self.setHistory(value);
                    self.isAPPList(value);//为了native
                    //window.location.href = "/localfun/" + value +".html?sourceId="+source;

                }
            });

            var $input = $(".search input"),
                $quickdel = $(".clear");
            var handleDelBtn = function () {
                if ($input.val()) {
                    $quickdel.show();
                } else {
                    $quickdel.hide();
                }
            };
            $quickdel.on('click', function () {
                $input.val('').trigger('input');
                $(this).hide();
            });
            $input.on('focus blur input', handleDelBtn);
        },
        //为native做兼容start

        //回调数据给native页面
        data_callback: function (str) {
            var jsonObj = {
                "param": {
                    "tagname": "callback",
                    "result": str
                },
                "CBPluginName": "_tc_bridge_public",
                "CBTagName": "cb_test"
            };
            window._tc_bridge_web.data_callback(jsonObj);
        },

        //判断是否来自native的列表页
        isAPPList: function (value) {
            var isFromNative = Common.getQueryString("isFromNative");
            if (Mobile.isApp(true, "7.6.1")) {   //为了native
                City.isList = true;
            }
            var CityImg = $(value).attr("data-image");
            var CityId = $(value).attr("data-id");
            var CityName = $(value).text();
            if (City.isList && isFromNative == 1) {
                dataCallback.keyWord = value; //为了native
                //dataCallback.type = typeId;   //0表示来自下面的标签，1表示来自搜索框
                var str = JSON.stringify(dataCallback);
                this.data_callback(str);
                window.location.href = "http://shouji.17u.cn/internal/common/close";
            } else if (City.isList && isFromNative != 1) {
                if (source == 0) { ///表示是来自wifi
                    window.location.href = 'tctclient://destination/list?destName=' + value + '&sourceType=3&projectId=40&extendInfo={"keyWord":"' + value + '","productType":"0","themeId":"9"}';
                } else {
                    window.location.href = 'tctclient://destination/list?destName=' + value + '&sourceType=3&projectId=40&extendInfo={"keyWord":"' + value + '","productType":"1"}';
                }
            } else {
                if (CityImg != "" && CityImg != null && CityImg != undefined) {
                    sessionStorage.setItem("ImageUrl", CityImg);

                    window.location.href = "/localfun/city-" + CityName + ".html?cityId=" + CityId; //无图片进城市首页
                } else {
                    window.location.href = "/localfun/" + value + ".html?wvc1=1&wvc2=1&sourceId=" + source;
                }
            }
        }
    };
    module.exports = City();

} ());

