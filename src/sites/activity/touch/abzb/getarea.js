;
!function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function () {
            return this
        }).call();
        root.Location = factory();
    }
}(function () {
    var Location = function () {
        var self = this;
        if (!(self instanceof Location)) {
            return new Location();
        }
    };
    /**/
    Location.prototype = {
        constructor: Location,
        config: {
            urlIP: "//m.ly.com/ajax/GetCityByIp.ashx",
            urlPoint: "//wx.17u.cn/ivacation/ajaxhelper/GetMapResult?longitude={longitude}&latitude={latitude}",
            urlCity: "//m.ly.com/dujia/ajaxhelper/getcityinfo?city=",
            tmplTip: function(it) {
                //var out= '<div id="J_AddressTip none" class="address-tip"> <div> <p>我们发现你目前位置在 <span>'+ (it.city)+ '</span></p><p>';
                //if(it.AreaName){
                //    out+=' 属于 <span>'+(it.AreaName)+' ';
                //}
                //out+=' </span>是否切换</p> ' +
                //    '<a class="J_CancelBtn" href="javascript:void(0);">取消</a> ' +
                //    '<a class="J_ConfirmBtn" href="javascript:void(0);">确定</a> ' +
                //    '</div></div>';
                //return out;

                var out = (it.AreaName);
                return out;

            },
            timeout: 5000,
            expire: 3600 * 1000,
            type : 0,
            lsName: "LocationCity",
            defCity: "上海",
            success: function (cityobj) {
            },
            failure: function (cityName) {
            }
        },
        getData: function (url, callback) {
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: callback
            })
        },
        timer: function () {
            var self = this,
                _cfg = self.config;
            self.__start__ = +new Date();
            return window.setTimeout(function () {
                self.isTimeout = true;
                _cfg.failure.call(self, self.defCity);
            }, self.timeout);
        },
        /**/
        afterData: function () {
            var self = this,
                _cfg = self.config;
            var args = Array.prototype.slice.call(arguments),
                iscall = args.shift();
            if (iscall) {
                self.getAreaByCity.apply(self, args);
            } else {
                _cfg.success.apply(self, args);
            }
        },
        //ip获取城市名
        getCityByIP: function (iscall) {
            var self = this,
                _cfg = self.config;
            var url = _cfg.urlIP;
            self.getData(url, function (data) {
                var city = data.CityName.replace("市", "");
                if (city) {
                    self.afterData.call(self, iscall, {'city':city});
                } else {
                    _cfg.failure.call(self, self.defCity);
                }
            });
        },
        //经纬获取城市名-百度api
        getCityByPoint: function (params, iscall) {
            var self = this,
                _cfg = self.config;
            var url = _cfg.urlPoint.replace(/{(\w+)}/g, function ($0, $1) {
                return params[$1];
            });
            self.getData(url, function (data, status) {
                if (status === "success") {
                    var city = data.result.addressComponent.city.replace("市", "");
                    self.afterData.call(self, iscall, {'city':city});
                } else {
                    if (self.isTimeout) {
                        return;
                    }
                    _cfg.failure.call(self, _cfg.defCity);
                }
            });
        },
        //城市获取区域
        getAreaByCity: function (citydata) {
            var self = this,
                _cfg = self.config;
            var url = _cfg.urlCity + citydata.city;
            self.getData(url, function (data) {
                var area = citydata;
                if (data.msgCode == 0) {
                    switch (data.Area.AreaId) {
                        //case "1001" : //东北地区-其他地区3233
                        //case "1002" : //港澳地区-其他地区3239
                        case "1003" : //华北地区3244
                            area.AreaId = 3244;
                            area.AreaName = data.Area.AreaName;
                            break;
                        case "1004" : //华东地区3249
                            area.AreaId = 3249;
                            area.AreaName = data.Area.AreaName;
                            break;
                        case "1005" : //华南地区3271
                            area.AreaId = 3271;
                            area.AreaName = data.Area.AreaName;
                            break;
                        //case "1006" : //华中地区-其他地区3277
                        //case "1007" : //西北地区-其他地区3284
                        //case "1008" : //西南地区-其他地区3289
                        default :
                            area.AreaId = 1;
                            area.AreaName = "其他地区";
                            break;
                    }
                    _cfg.success.call(self, area);
                } else {
                    /**/
                }

            });
        },
        //微信api获取经纬-获取城市
        getCityByWX: function (iscall) {
            var self = this,
                _cfg = self.config;
            wx.ready(function () {
                wx.getLocation({
                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var params = {
                            longitude: res.longitude,
                            latitude: res.latitude
                        };
                        self.getCityByPoint(params, iscall);
                    },
                    error: function (error) {
                        /**/
                        _cfg.failure.call(self, _cfg.defCity);
                    }
                });
            });
        },
        //html5获取经纬-获取城市
        getCityByGEO: function (iscall) {
            var self = this,
                _cfg = self.config;
            navigator.geolocation.getCurrentPosition(function (position) {
                var params = position.coords;
                self.getCityByPoint(params, iscall);
            }, function (error) {
                /**/
                _cfg.failure.call(self, _cfg.defCity);
            },{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 3000
            });
        },

        /*公共方法*/
        initcfg: function () {
            var self = this;
            $.extend(self.config, cfg || {});
        },
        //获取城市
        getCity: function (cfg) {
            var self = this,
                iscall = false;
            if (typeof cfg == "boolean") {
                iscall = cfg;
            } else {
                $.extend(self.config, cfg || {});
            }
            var _cfg = self.config;
            var lsCity = self.getLSCity();
            if (lsCity) {
                self.afterData.call(self, iscall, {'city':lsCity});
                return;
            } else {
                if (window.wx) {
                    self.getCityByWX.call(self, iscall);
                } else if (navigator.geolocation) {
                    self.getCityByGEO.call(self, iscall);
                } else {
                    self.getCityByIP.call(self, iscall);
                }
            }
        },
        //获取区域
        getArea: function (cfg) {
            var self = this;
            $.extend(self.config, cfg || {});
            self.getCity(true);
        },
        getLSCity: function () {
            var self = this,
                _cfg = self.config;
            if (window.localStorage && localStorage[_cfg.lsName]) {
                return localStorage[_cfg.lsName];
            } else {
                return '';
            }
        },
        setLSCity: function (cityName) {
            var self = this,
                _cfg = self.config;
            if (window.localStorage) {
                localStorage[_cfg.lsName] = cityName;
            } else {
                /**/
            }
        },
        renderTip : function(ocity,data,callback){
            var self = this,
                _cfg = self.config;
            /*定位城市与默认城市相同不执行*/
            if(data.city == ocity){
                return;
            }
            var html = _cfg.tmplTip(data);
            $("body").append(html);
            /**/
            self.setLSCity(data.city);
            callback&&callback();


            //var tipBox = $("#J_AddressTip");
            //tipBox.on("click",".J_CancelBtn",function(){
            //    tipBox.hide();
            //});
            //tipBox.on("click",".J_ConfirmBtn",function(){
            //    tipBox.hide();
            //    self.setLSCity(data.city);
            //    callback&&callback();
            //});
        }
    };

    var location = new Location();
    return location;
});
