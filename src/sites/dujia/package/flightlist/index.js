var SelectBackFlight = function () { };
var Common = require("common/0.1.0/index"),
    Monitor = window.Monitor,
    dialog = require("dialog/0.1.0/index"),
    newdialog = require("dialog/0.2.0/dialog"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    Packaged = require("freePackage/packaged/0.1.0/index");
var $dialog = new newdialog({
    skin: 'default',
    template: {
        modal: {
            html: '<div class="dialog_modal_gp">' +
            '<div class="dialog_modal_content" data-dialog-content></div>' +
            '</div>'
        }
    }
});
var _data = {};
var filtrates = { "Period": [], "DepartAirPortCode": [], "ArriveAirPortCode": [], "AirCompanyCode": [], "FlightType": [] };

var sorts = { "StartDate": 1, "Price": 0, "Sort": 1 };
var _time = "";
var current_request;
SelectBackFlight.prototype = {
    lineId: $("#lineId").val() || "",
    hasSelect: "",
    param: {
        "LineId": $("#lineId").val() || "",
        "LineDate": "",
        "Adult": 2,
        "Child": 0,
        "ChildAges": [],
        "IsConditions": 1,
        "Flight": {
            "DepartCode": "",
            "ArriveCode": "",
            "DepartDate": "",
            "ReturnDate": "",
            "IsDirect": 1,
            "FlightNos": [],
            "GoKey": "",
            "Type": 2
        },
        "Filtrate": {
            "DepartPort": "",
            "Period": "",
            "ArrivePort": "",
            "AirCompany": "",
            "Type": "",
            "Sort": 2,
            "SortType": 0
        }
    },
    tmpl: {
        flightList: require("./flist.dot"),
        flightRule: require("./flightrule.dot"),
        filterFlight: require("./ffilter.dot")
    },
    content: {
        flightAndHotel: ".result-info",
        flight: ".J_packedFlight",
        hotel: ".J_packedHotel",
        hotelList: ".J_hotelList",
        flightList: ".J_fp-list",
        hotelDetail: ".ui-hotel",
        filterFlight: ".fp-search"
    },
    init: function (cfg) {
        var self = this;
        self._init(cfg);
    },
    _init: function (cfg) {
        this.overTime();
        this.setSelHelpPack();
        this.initFlightFliter();
        this.initEvent();
        this.mainEve();
        this.initslider();
    },
    //右侧通栏部分
    getUser: function () {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    initslider: function(){
        var self = this;
        var userid = self.getUser();
        var kefuUrl = '';
        if(self.param.LineId){ // 从搜索结果页进来是没有lineid的。
            kefuUrl = 'http://livechat.ly.com/out/guest?p=7&lineid=' + self.param.LineId;
        }else{
            kefuUrl = 'http://livechat.ly.com/out/guest?p=7';
        }
        var slider = new Slidertoolbar({
            header: {
                icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
                tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/11/01/10/UL8ID0.jpg"></a>'
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
                icon: '<a target="_blank" href="'+ kefuUrl +'"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="'+ kefuUrl +'"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            bottomMenu: [{
                icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><div class="ico c-4"></div></a>',
                tooltips: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a><div class="ico c-7"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
                tooltipCls: 'chujing-code',
                arrow: false
            }, {
                icon: '<a><div class="ico c-8"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
                tooltipCls: 'app-code',
                arrow: false
            }],
            toTop: true,
            skin:'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    },
    //定时
    overTime: function () {
        var self = this;
        _time = setTimeout(function () {
            var config = {
                content: '<div class="passTime fixed-warn1"><div class="data-loading"><div class="bg"><span>抱歉，当前航班信息已过期，请重新查询</span><div class="research J_research">重新查询</div></div></div></div>',
                width: 350,
                height: 180,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            $dialog.modal(config);
            $(document).on("click", ".J_research", function () {
                window.location.reload();
            });
        }, 1000 * 60 * 10);
    },
    //机加酒自助打包
    setSelHelpPack: function () {
        var packaged = new Packaged();

        packaged.init();
    },
    initEvent: function () {
        var self = this;
        $(document).delegate(".J_flightList .J_fp-search dd", "click", function () {
            var $this = $(this),
                parent = $(this).parent();
            var param = $this.attr("data-param") || $this.parents("dd").attr("data-param") || "";
            if ($this.hasClass("selected")) {
                if ($this.parent().hasClass("dateTime")) {
                    if (param === "") {
                        filtrates.Period = [];
                    } else {
                        self.removeItem(filtrates.Period, parseInt(param));
                    }
                }
                if ($this.parent().hasClass("DepartAirPort")) {
                    if (param === "") {
                        filtrates.DepartAirPortCode = [];
                    } else {
                        self.removeItem(filtrates.DepartAirPortCode, param);
                    }
                }
                if ($this.parent().hasClass("ArriveAirPort")) {
                    if (param === "") {
                        filtrates.ArriveAirPortCode = [];
                    } else {
                        self.removeItem(filtrates.ArriveAirPortCode, param);
                    }
                }
                if ($this.parent().hasClass("company")) {
                    if (param === "") {
                        filtrates.AirCompanyCode = [];
                    } else {
                        self.removeItem(filtrates.AirCompanyCode, param);
                    }
                }
                if ($this.parent().hasClass("AirType")) {
                    if (param === "") {
                        filtrates.FlightType = [];
                    } else {
                        self.removeItem(filtrates.FlightType, parseInt(param));
                    }
                }
                $this.removeClass("selected");
                if ($this.siblings(".selected").length === 0) {
                    parent.find(".all-sel").addClass("selected");
                }
            } else {
                $this.addClass("selected");
                if ($this.hasClass("all-sel")) {
                    $this.siblings().removeClass("selected");
                } else {
                    $this.siblings(".all-sel").removeClass("selected");
                }
                if ($this.parent().hasClass("dateTime")) {
                    if (param === "") {
                        filtrates.Period = [];
                    } else {
                        self.addItem(filtrates.Period, parseInt(param));
                    }
                }
                if ($this.parent().hasClass("DepartAirPort")) {
                    if (param === "") {
                        filtrates.DepartAirPortCode = [];
                    } else {
                        self.addItem(filtrates.DepartAirPortCode, param);
                    }
                }
                if ($this.parent().hasClass("ArriveAirPort")) {
                    if (param === "") {
                        filtrates.ArriveAirPortCode = [];
                    } else {
                        self.addItem(filtrates.ArriveAirPortCode, param);
                    }
                }
                if ($this.parent().hasClass("company")) {
                    if (param === "") {
                        filtrates.AirCompanyCode = [];
                    } else {
                        self.addItem(filtrates.AirCompanyCode, param);
                    }
                }
                if ($this.parent().hasClass("AirType")) {
                    if (param === "") {
                        filtrates.FlightType = [];
                    } else {
                        self.addItem(filtrates.FlightType, parseInt(param));
                    }
                }
            }
            self.renderList();
        });
        //新增-默认排序
        //排序
        $(document).delegate(".J_flightList .J_fp_sort span", "click", function () {
            var _this = $(this),
                notNeedUpdatestatus = false,
                isSelected = _this.hasClass("selected"),
                isDefaultOrder = _this.hasClass("default-order");
            // if(isSelected && isDefaultOrder){
            //     return;
            // }
            if (!isSelected) {
                //如果是首次切换到该排序,则不需要更新排序状态
                notNeedUpdatestatus = true;
                _this.siblings().removeClass("selected");
                _this.addClass("selected");
            }
            self.sortFlight(this, notNeedUpdatestatus, true);
            /*if(current_request){
                current_request.abort();
                $(".bottom-loading").remove();
                self.param.QueryGuid = "";
                $(".search_loading").addClass('none');
            }*/
            //self.initFlightList();
            self.renderList();
        });
    },
    sortFlight: function (el, notNeedUpdatestatus, isTriggerBySort) {
        var self = this,
            _this = $(el),
            dataIndex = _this.attr("data-index");
        if (dataIndex === "1") {
            self.sortPriceCtrl(_this, notNeedUpdatestatus);
        } else if (dataIndex === "0") {
            self.sortTimeCtrl(_this, notNeedUpdatestatus);
        }
    },
    sortTimeCtrl: function (el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.attr("title", "按起飞时间排序");
                el.removeClass("up");
                sorts = sorts || {};
                sorts.StartDate = 1;
                sorts.Price = 0;
                sorts.Sort = 0;
            } else {
                el.attr("title", "按起飞时间排序");
                el.addClass("up");
                sorts = sorts || {};
                sorts.StartDate = 1;
                sorts.Price = 0;
                sorts.Sort = 1;
            }
        } else {
            if (sortAsc) {
                el.attr("title", "按起飞时间排序");
                sorts = sorts || {};
                sorts.StartDate = 1;
                sorts.Price = 0;
                sorts.Sort = 1;
            } else {
                el.attr("title", "按起飞时间排序");
                sorts = sorts || {};
                sorts.StartDate = 1;
                sorts.Price = 0;
                sorts.Sort = 0;
            }
        }

    },
    sortPriceCtrl: function (el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.attr("title", "按价格排序");
                el.removeClass("up");
                sorts = sorts || {};
                sorts.StartDate = 0;
                sorts.Price = 1;
                sorts.Sort = 0;
            } else {
                el.attr("title", "按价格排序");
                el.addClass("up");
                sorts = sorts || {};
                sorts.StartDate = 0;
                sorts.Price = 1;
                sorts.Sort = 1;
            }
        } else {
            if (sortAsc) {
                el.attr("title", "按价格排序");
                sorts = sorts || {};
                sorts.StartDate = 0;
                sorts.Price = 1;
                sorts.Sort = 1;
            } else {
                el.attr("title", "按价格排序");
                sorts = sorts || {};
                sorts.StartDate = 0;
                sorts.Price = 1;
                sorts.Sort = 0;
            }
        }
    },
    //第一次加载数据
    initFlightFliter: function () {
        var self = this, localArr;
        if (product.isvalid == 1) {
            self.param = product.param;
        }
        var tmpl = self.tmpl, html1, html2;
        var _url = self.param;
        var url = '/intervacation/api/PDynamicPackageFlight/PostFlights';
        current_request = $.ajax({
            url: url,
            type: 'post',
            data: 'param=' + encodeURIComponent(JSON.stringify(_url)),
            dataType: 'json',
            beforeSend: function () {
                $(".product-box").html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
            },
            success: function (data) {
                if (data.Code == 4000) {
                    var $goOrBackVal = $("#goOrBack").val();
                    var $goOrBackFlightEndIndex = $("#goOrBack").attr("data-FlightEndIndex");
                    data.filtrates = filtrates;
                    data.sorts = sorts;
                    if ($goOrBackVal && $goOrBackFlightEndIndex) {
                        if ($goOrBackFlightEndIndex > 2) {
                            data.flightType = 'trueGoBack';
                        }
                    }
                    if(data.Data.Flights && data.Data.Flights.length){
                        html1 = tmpl["filterFlight"](data);
                        $(".J_filter").empty().append(html1);
                    }
                    //进度条
                    self.progressBar(1);
                    $(".J_fp-list").empty();
                    //第三次异步才会有无结果状态
                    data.times = 0;
                    _data = data;
                    self.renderList();
                    self.moreLoading(1, data.Data.QueryGuid, data.Data.SingleQueryGuid, 1);
                    if (data.Data.Flights.length && !$(".bottom-loading").length) {
                        var loadBox = document.createElement("div");
                        loadBox.className = "bottom-loading";
                        loadBox.innerHTML = '<i class="loading-flight"></i>请稍候，正在为您加载更多';
                        $(".fp-list").append(loadBox);
                    }

                    //统计 @param: self.hasSelect
                    //@老航班_@老航空公司_@老航班起降时间_@老机场_@老航班是否中转
                    if (data.Data.Flights) {
                        for (var i = 0; i < data.Data.Flights.length; i++) {
                            if (data.Data.Flights[i].IsSelected == 1) {
                                var aa, bb, cc, dd, ee;
                                aa = data.Data.Flights[i].Flight.FlightNumber;
                                bb = data.Data.Flights[i].Flight.AirCompany;
                                cc = data.Data.Flights[i].Flight.StartTime + "-" + data.Data.Flights[i].Flight.EndTime;
                                dd = data.Data.Flights[i].Flight.DepartAirPort;
                                if (data.Data.Flights[i].ConnectingFlights.length) {
                                    ee = 1;
                                } else {
                                    ee = 0;
                                }
                                self.hasSelect = aa + "_" + bb + "_" + cc + "_" + dd + "_" + ee;
                            }
                        }
                    }
                }
            }
        });
    },
    //第二次和第三次加载数据
    moreLoading: function (times, QueryGuid, SingleQueryGuid, hasfilter) {
        var self = this;
        var tmpl = self.tmpl, html1, localArr;
        self.param.QueryGuid = QueryGuid;
        self.param.SingleQueryGuid = SingleQueryGuid;
        var _url = self.param;
        var url = '/intervacation/api/PDynamicPackageFlight/PostFlights';
        current_request = $.ajax({
            url: url,
            type: 'post',
            data: 'param=' + encodeURIComponent(JSON.stringify(_url)),
            dataType: 'json',
            success: function (data) {
                if (hasfilter == 1) {
                    var $goOrBackVal = $("#goOrBack").val();
                    var $goOrBackFlightEndIndex = $("#goOrBack").attr("data-flightEndIndex");
                    data.filtrates = filtrates;
                    data.sorts = sorts;
                    if ($goOrBackVal && $goOrBackFlightEndIndex) {
                        if ($goOrBackFlightEndIndex > 2) {
                            data.flightType = 'trueGoBack';
                        }
                    }
                    if(data.Data.Flights && data.Data.Flights.length){
                        html1 = tmpl["filterFlight"](data);
                        $(".J_filter").empty().append(html1);
                    }
                }
                //进度条
                $(".J_fp-list").empty();
                //第三次异步才会有无结果状态
                data.times = times;
                _data = data;
                self.renderList();
                if (times == 1) {
                    if (hasfilter == 1) {
                        self.moreLoading(2, data.Data.QueryGuid, data.Data.SingleQueryGuid, 1);
                    } else {
                        self.moreLoading(2, data.Data.QueryGuid, data.Data.SingleQueryGuid, 0);
                    }
                    self.progressBar(2);
                } else if (times == 2) {
                    self.progressBar(3);
                    //if(hasfilter == 1){
                    var newtext = "共 " + data.Data.TotalCount + " 条可选航班";
                    $(".fp-title em").html(newtext);
                    //}
                    $(".bottom-loading").remove();
                    self.param.IsConditions = 0;
                    self.param.QueryGuid = "";
                    return;
                }
            }
        });
    },
    //进度条
    progressBar: function (times) {
        if (times == 1) {
            $(".search_loading").html("<div class='line'></div>");
        }
        $(".search_loading").removeClass('none');
        var width = (times * 33.33);
        width = width + "%";
        if (times == 3) {
            var speed = 1000;
        } else {
            var speed = 2000;
        }
        $(".search_loading .line").animate({
            width: width
        }, speed, function () { if (times == 3) { $(".search_loading .line").remove(); } });
    },
    renderList: function () {
        var self = this,
            context = $(self.content["flightList"]),
            tmpl = self.tmpl;
        if(_data.Data.Flights){
            var dataObj = self.flightResult(_data.Data.Flights, filtrates, sorts);
            dataObj.times = _data.times;
            var html = tmpl["flightList"](dataObj);
            context.empty().append(html);
        }
    },
    //分页,暂时还没有用到
    renderPager: function (cfg) {
        var self = this,
            _url = this.param,
            total = cfg.total,
            extraUrl = cfg.extraUrl ? "&" + cfg.extraUrl : "",
            url = "/intervacation/api/PDynamicPackageFlight/PostFlights",
            param = $.extend({}, self.param),
            totalPage = Math.ceil(total / 10);
        if (totalPage > 1) {
            require("freePackage/pager/0.2.1/index");
            delete (param.pageIndex);
            $('#J_CometPager').page({
                current: 1,
                total: totalPage,
                needFirstAndLast: true,
                pageNoParam: "pageIndex",
                ajaxObj: {
                    url: url,
                    type: 'post',
                    data: "param=" + encodeURIComponent(JSON.stringify(_url)),
                    dataType: "json",
                    beforeSend: function () {
                        $(".J_fp-list").html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                    },
                    success: function (data) {
                        self.renderList();
                    }
                },
                initLoad: false
            });
        } else {
            $("#J_CometPager").empty();
        }
    },
    mainEve: function () {
        var self = this, localArr, data_IsDirect;
        $(document).on('click', ".back-page", function () {
            if(product.Data && product.Data.EndUrl){
                var url = product.Data.EndUrl;
                var cctParam = $("#cctParam").val();
                if (cctParam) {
                    $("#fromCctParam").val(cctParam);
                }
                product.Data.SelectFlights = [];
                var thisparam = encodeURIComponent(JSON.stringify(product.Data));
                $("#hotelForm").attr('action', url);
                $("#productParam").val(thisparam);
                $("#hotelForm").submit();
            }else{
                window.history.go(-1);
            }
        });
        $(document).on('click', ".btn-choice-flight", function () {
            if(!$(this).hasClass('hasClicked')){
                $(this).addClass('hasClicked');
                var _this = $(this), key;
                if (current_request) {
                    current_request.abort();
                    $(".bottom-loading").remove();
                    //self.param.QueryGuid = "";
                    $(".search_loading").addClass('none');
                }
                $(".fp-item").removeClass('flight-has-select');
                var $selectliP = _this.parent().parent().parent().parent().parent().parent();
                $selectliP.addClass('flight-has-select').siblings("li").removeClass('flight-has-select');
                var $goOrBack = $("#goOrBack");
                if ($goOrBack && $goOrBack.val() < parseInt($goOrBack.attr("data-FlightEndIndex")) - 1) {
                    var url = window.location.href;
                    product.Data.FlightIndex = parseInt(product.Data.FlightIndex) + 1;
                } else {
                    var url = product.Data.EndUrl;
                    product.Data.FlightIndex = 0;
                }
                var flyParam = _this.attr("data-flyparam");
                var flights = _this.parents(".fp-item").attr("data-flight");
                var selectFlights = [];
                //var changeFlight = _this.attr("data-changeItem");
                flyParam = JSON.parse(decodeURIComponent(flyParam));
                var backMapProductId = flyParam.Cabins[0].MapProductId;
                flights = JSON.parse(decodeURIComponent(flights));
                //多舱位
                if (flights && flights.Cabins) {
                    //var nowFlightCabin = [];
                    for (var i = 0; i < flights.Cabins.length; i++) {
                        if (flights.Cabins[i].MapProductId == backMapProductId) {
                            //已选航班置顶操作
                            flights.Cabins[i].IsSelected = 1;
                            //nowFlightCabin.push(flights.Cabins[i]);
                        } else {
                            flights.Cabins[i].IsSelected = 0;
                            //nowFlightCabin.push(flights.Cabins[i]);
                        }
                    }
                    flyParam.Cabins = flights.Cabins;
                }
                if (product.Data.SelectFlights) {
                    product.Data.SelectFlights.push(flyParam);
                } else {
                    selectFlights.push(flyParam);
                    product.Data.SelectFlights = selectFlights;
                }
                var cctParam = $("#cctParam").val();
                if (cctParam) {
                    $("#fromCctParam").val(cctParam);
                }
                var thisparam = encodeURIComponent(JSON.stringify(product.Data));
                $("#hotelForm").attr('action', url);
                $("#productParam").val(thisparam);
                $("#hotelForm").submit();
            }
            
            //location.href = url;
        });
        $(document).on('click', ".back-cho", function () {
            var url = product.Data.EndUrl;
            var cctParam = $("#cctParam").val();
            if (current_request) {
                current_request.abort();
                $(".bottom-loading").remove();
                //self.param.QueryGuid = "";
                $(".search_loading").addClass('none');
            }
            if (cctParam) {
                $("#fromCctParam").val(cctParam);
            }
            product.Data.SelectFlights = [];
            var thisparam = encodeURIComponent(JSON.stringify(product.Data));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            $("#hotelForm").submit();
        });
        $(document).on('click', ".reset-flight", function () {
            var url = window.location.href;
            var $self = $(this);
            var cctParam = $("#cctParam").val();
            var _index = $self.parents(".had-goFlight").index();
            var selectFlights = [];
            if (current_request) {
                current_request.abort();
                $(".bottom-loading").remove();
                //self.param.QueryGuid = "";
                $(".search_loading").addClass('none');
            }
            if (cctParam) {
                $("#fromCctParam").val(cctParam);
            }
            for (var i = 0; i < product.Data.SelectFlights.length; i++) {
                if (i < _index) {
                    selectFlights.push(product.Data.SelectFlights[i]);
                }
            }
            product.Data.FlightIndex = parseInt(_index);
            product.Data.SelectFlights = selectFlights;
            var thisparam = encodeURIComponent(JSON.stringify(product.Data));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
                if (history.length > 0) {
                    window.history.go(-1);
                } else {
                    $("#hotelForm").submit();
                }
            } else { //非IE浏览器
                if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                    navigator.userAgent.indexOf('Opera') >= 0 ||
                    navigator.userAgent.indexOf('Safari') >= 0 ||
                    navigator.userAgent.indexOf('Chrome') >= 0 ||
                    navigator.userAgent.indexOf('WebKit') >= 0) {
                    if (window.history.length > 1) {
                        $("#hotelForm").submit();
                    } else {
                        $("#hotelForm").submit();
                    }
                } else { //未知的浏览器
                    window.history.go(-1);
                }
            }
        });
        $(document).on('click', '.J_moreCabin', function () {
            if ($(this).hasClass('moreCabin')) {
                $(this).removeClass('moreCabin').addClass('moreCabinUp').find('span').text('收起');
                $(this).siblings(".isTurn").removeClass("none");
            } else {
                $(this).addClass('moreCabin').removeClass('moreCabinUp').find('span').text('更多舱位');
                $(this).siblings(".isTurn").addClass("none");
            }
        });
    },
    addItem: function (array, value) {
        array = array || [];
        if ($.inArray(value, array) < 0) {
            array.push(value);
        }
        return array;
    },
    removeItem: function (array, value) {
        if (array && array.length > 0 && $.inArray(value, array) >= 0) {
            array.splice($.inArray(value, array), 1);
        }
        return array;
    },
    flightResult: function (flights, filtrates, sorts) {
        var self = this;
        var filtrateFlights = self.filtrateFlights(flights, filtrates);
        var sort = 0;//0：升序 1：降序
        var sortPropery = 0;//0：按起飞时间排序 1：价格
        if (sorts) {
            sort = sorts.Sort;
            if (sorts.Price === 1) {
                sortPropery = 1
            }
        }
        if (!filtrateFlights || filtrateFlights.length <= 0) {
            return flights;
        }
        var func = sortPropery === 0 ? self.FlightStartDateCompare : self.FlightPriceCompare;
        var flight = self.quickSort(filtrateFlights, sort, func);
        self.selectedTop(flight);
        return flight;
    },
    /*
    *快速排序
    *@arr [object]待处理数组
    *@sortType [num] sorts.sort
    *func [function] 返回的为false或者true
    */
    quickSort: function (arr, sortType, func) {
        var self = this;
        if (arr.length <= 1) { return arr; }
        var pivotIndex = Math.floor(arr.length / 2);
        var pivot = arr.splice(pivotIndex, 1)[0];
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++) {
            if (func.call(self, arr[i], pivot, sortType)) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return self.quickSort(left, sortType, func).concat([pivot], self.quickSort(right, sortType, func));
    },
    /* 机票筛选 *
    * @flights [Object] 机票列表
    * @filtrates {Object} 筛选条件
    */
    filtrateFlights: function (flights, filtrates) {
        if (!filtrates || filtrates.length <= 0) {
            return flights;
        }
        var result = [];
        if (!flights || flights.length <= 0) {
            return result;
        }
        $.each(flights, function (index, flight) {
            if (filtrates.Period && filtrates.Period.length > 0 && $.inArray(flight.Period, filtrates.Period) < 0) {
                return true;
            }
            if (filtrates.DepartAirPortCode && filtrates.DepartAirPortCode.length > 0 && $.inArray(flight.DepartAirPortCode, filtrates.DepartAirPortCode) < 0) {
                return true;
            }
            if (filtrates.ArriveAirPortCode && filtrates.ArriveAirPortCode.length > 0 && $.inArray(flight.ArriveAirPortCode, filtrates.ArriveAirPortCode) < 0) {
                return true;
            }
            if (filtrates.AirCompanyCode && filtrates.AirCompanyCode.length > 0 && $.inArray(flight.AirCompanyCode, filtrates.AirCompanyCode) < 0) {
                return true;
            }
            if (filtrates.FlightType && filtrates.FlightType.length > 0 && $.inArray(flight.FlightType, filtrates.FlightType) < 0) {
                return true;
            }
            result.push(flight);
        })
        return result;
    },
    /* 选中置顶 *
    * @array [Object] 待处理数组
    * @selectedPropery {string} 选中属性名称
    * @selectedValue {Object} 选中值
    */
    selectedTop: function (array) {
        if (!array || array.length <= 0) {
            return;
        }
        var selected = null;
        for (var i = 0; i < array.length; i++) {
            //=1时置顶
            if (array[i]["IsSelected"] == 1) {
                selected = array[i];
                array.splice(i, 1);
                break;
            }
        }
        if (selected) {
            array = array.unshift(selected);//unshift  插入到第一条
        }
        return array;
    },
    /* 机票起飞时间比较 *
    * @flight1 {Object} 机票信息1
    * @flight2 {Object} 机票信息2
    * @sortType {num} 排序类型 0：升序 1：降序
    */
    FlightStartDateCompare: function (flight1, flight2, sortType) {
        return this.SortCompare(new Date(flight1.StartDate + ' ' + flight1.StartTime), new Date(flight2.StartDate + ' ' + flight2.StartTime), sortType);
    },
    /* 机票价格比较 *
    * @flight1 {Object} 机票信息1
    * @flight2 {Object} 机票信息2
    * @sortType {int} 排序类型 0：升序 1：降序
    */
    FlightPriceCompare: function (flight1, flight2, sortType) {
        return this.SortCompare(parseInt(flight1.Cabins[0].DifferencePrice), parseInt(flight2.Cabins[0].DifferencePrice), sortType);
    },
    /* 排序比较 *
    * @value1 {Object} 值1
    * @value2 {Object} 值2
    * @sortType {num} 排序类型 0：升序 1：降序
    */
    SortCompare: function (value1, value2, sortType) {
        return sortType === 0 ? value1 > value2 : value1 < value2;
    }
};
module.exports = new SelectBackFlight();
