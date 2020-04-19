/**
 * 全国联运
 */
define("transport/0.1.0/index", ["common/0.1.0/index", "common/0.1.0/es5"], function (require) {
    var Transport = function () { };
    var Common = require("common/0.1.0/index");

    Transport.prototype = {
        param: {
            // lineId: $("#HidLineid").val(),      //线路ID
            ak: $("#key").val()
        },
        host: window.host || "",
        isTransport: $("#hidIsTransport").val(),
        init: function (cfg) {
            var self = this;
            self = $.extend(true, self, cfg);
            self.getData({
                param: {},
                host: "",
                url: $(".city").attr("attr-url")
            });
            self.cityTab();
        },
        getData: function (cfg) {
            var self = this,
                param = cfg.param;
            var _param = $.extend({}, self.param, param);
            $.ajax({
                url: self.host + cfg.url,
                data: _param,
                dataType: "jsonp",
                beforeSend: function () { },
                success: function (data) {
                    if (data && data.TransportPrices && data.TransportPrices.length > 0) {
                        $(".J_startCity").parent().children("i").removeClass("none");
                        if (!$(".J_city").hasClass("city")) {
                            $(".J_city").addClass("city");
                        }
                        self.setData(data);
                    } else {
                        $(".J_startCity").parent().children("i").addClass("none");
                        $(".J_city").removeClass("city");
                    }
                },
                error: function () { }
            });
        },
        setData: function (data) {
            var self = this,
                flag = true,
                cityId = $("#hidLocatedStartCityId").val(),//出发城市id(标签页传过来的或ip定位的城市id)
                departureCity = $("#hidDepartureCity").val(),
                depCityName = departureCity.split("|")[0],//出港城市name
                depCityId = departureCity.split("|")[1], //出港城市id
                depAmountDirect = "",
                depAmountAdvice = "";

            data = data.TransportPrices;
            var dom_dl = $("<dl></dl>");
            for (var i = 0; i < data.length; i++) {
                var dom_span = $("<span></span>").append(data[i].CityName);
                var dom_em = $("<em>&yen;<b>" + data[i].AmountDirect + "</b></em>");

                var dom_dd = $("<dd></dd>").append(dom_span, dom_em).attr({
                    cityId: data[i].CityId,
                    amountDirect: data[i].AmountDirect,
                    amountAdvice: data[i].AmountAdvice,
                    name: data[i].CityName
                });
                dom_dl.append(dom_dd);

                /**
                 * 1.联运线路 南京出发，出发城市改为南京出发，同程价等价格改为南京对应的价格
                 * 2.联运线路 无锡出发，联运城市列表里面没有无锡，则出发城市为线路本身的出港城市
                 * 3.非联运线路 南通等非联运城市出发，出发城市默认用出港城市,同程价等价格改为出港城市对应的价格
                 */

                //ip定位出来的城市
                if (cityId == data[i].CityId) {
                    var transCity = data[i].CityName,
                        amountDirect = data[i].AmountDirect,
                        amountAdvice = data[i].AmountAdvice;

                    $(".J_startCity").html(transCity);
                    self.priceChange(amountDirect, amountAdvice);

                    //传过来的城市id不等于不等于出港城市id
                    if (cityId !== depCityId) {
                        self.priceTipsFunc(transCity, depCityName);
                        var transTips = "行程中已经包含" + transCity + "至" + depCityName + "的联运费用，具体联运航班信息以最终出团书为准。"
                        $(".J_transTips").html(transTips);
                    }
                    flag = false;
                }

                //出港城市对应的价格
                if (depCityId == data[i].CityId) {
                    depAmountDirect = data[i].AmountDirect;
                    depAmountAdvice = data[i].AmountAdvice;
                }
            }
            //1.如果定位出来的城市不是联运城市,取线路本身的出港城市,
            if (flag) {
                self.getCalendarData({
                    param: {
                        cityId: depCityId,
                        monthnum: 6
                    }
                });

                self.priceChange(depAmountDirect, depAmountAdvice);
                self.replaceUrlFunc(depCityId);
                $("#hidLocatedStartCityId").val(depCityId);
                $(".J_transTips").html("");
            }
            $(".J_selectCity").html(dom_dl);
        },
        cityTab: function () {
            var self = this,
                selectCity = $(".J_selectCity"),
                arrow = $(".arrow-up"),
                departureCity = $("#hidDepartureCity").val(),
                depCityName = departureCity.split("|")[0],//出港城市name
                depCityId = departureCity.split("|")[1];//出港城市id

            $(".J_city").hover(function () {
                if ($(this).hasClass("city")) {
                    selectCity.removeClass("none");
                    arrow.addClass("arrow-down");
                    $(this).addClass("current");
                }
            }, function () {
                selectCity.addClass("none");
                arrow.removeClass("arrow-down");
                $(this).removeClass("current");
            });

            selectCity.on("click", "dd", function () {
                var _this = $(this),
                    cityId = _this.attr("cityId"),
                    amountDirect = _this.attr("amountDirect"),
                    amountAdvice = _this.attr("amountAdvice"),
                    name = _this.attr("name");

                $(".startCity").html(name);
                $(".city").removeClass("current");
                $(".arrow-up").removeClass("arrow-down");
                $("#hidLocatedStartCityId").val(cityId);

                //传过来的城市id不等于不等于出港城市id
                if (cityId !== depCityId) {
                    self.priceTipsFunc(name, depCityName);
                    var transTips = "行程中已经包含" + name + "至" + depCityName + "的联运费用，具体联运航班信息以最终出团书为准。"
                    $(".J_transTips").html(transTips);
                } else {
                    $(".J_transTips").html("");
                }
                self.priceChange(amountDirect, amountAdvice);

                selectCity.addClass("none");
                selectCity.prepend(_this.clone());
                _this.remove();

                self.replaceUrlFunc(cityId);
                self.getCalendarData({
                    param: {
                        cityId: cityId,
                        monthnum: 6
                    }
                });
            });
        },
        /**
        * @desc 起价说明提示
        * @param transCity   联运出发城市
        * @param depCityName 出港城市
        * @private
       */
        priceTipsFunc: function (transCity, depCityName) {
            var self = this,
                priceTips = "本起价是可选出发日期中，按双人出行共住一间房核算的最低单人价格，已包含" + transCity + "至" + depCityName + "的联运费用。产品价格会根据您所选择的出发日期、出行人数、入住酒店房型、航班或交通以及所选附加服务的不同而有所差别。";
            $(".J_instruction").attr("data-content", priceTips);

            self.tipsCallback && self.tipsCallback($(".J_instruction"));
        },
        //url参数替换
        replaceUrlFunc: function (cityId) {
            //替换立即预订按钮的url
            var orderBtn = $(".J_OrderBtn"),
                oldHref = orderBtn.attr("href");
            if (oldHref) {
                var newHref = oldHref.replace(/cityId=([^&]+)/, function ($0, $1) {
                    return $0.replace($1, cityId);
                });
                orderBtn.attr("href", newHref);
            }
        },
        priceChange: function (amountDirect, amountAdvice) {
            $(".price strong").html(amountDirect);
            $(".market-price").html("&yen;" + amountAdvice + "起");
        },
        getCalendarData: function (cfg) {
            var self = this,
                param = cfg.param,
                url = $("#hidTransportCalendarUrl").val();

            var _param = $.extend({}, self.param, param);
            $.ajax({
                url: host + url,
                data: _param,
                dataType: "jsonp",
                beforeSend: function () { },
                success: function (data) {
                    window.calData = data;
                    self.callback && self.callback(data);
                },
                error: function () { }
            });
        }
    }
    return Transport;
});
