var Group = {};
var current_request;
var Common = require("common/0.1.0/index"),
    Monitor = window.Monitor,
    dialog = require("dialog/0.1.0/index"),
    newdialog = require("dialog/0.2.0/dialog"),
    Packaged = require("freePackage/packaged/0.1.0/index"),
    googleMap = require("modules/googleMap/0.2.0/index"),
    Search = require("freePackage/search/0.1.0/index"),
    carousel = require("jCarousel/0.1.1/index"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    GroupCalendar = require("datepicker/0.2.0/calendar-group");
var citytimer = null;
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
var maxNum = 9,
    fKey;
Group = {
    lineId: $("#lineId").val() || "",
    param: {
        "LineId": $("#lineId").val() || "",
        "IsDefault": 1,
        "LineDate": "",
        "Adult": 2,
        "Child": 0,
        "ChildAges": [],
        "Flight": {
            "DepartCode": "",
            "ArriveCode": "",
            "DepartDate": "",
            "ReturnDate": "",
            "IsDirect": 1,
            "FlightNos": ["1524"],
            "IsRoundTrip": 1,
            "IsCanChange": 1
        },
        "Hotel": {
            "RoomCount": "1",
            "UserAgent": "",
            "Hotels": [{
                "StartDate": "",
                "Nights": "3",
                "CityId": "3187",
                "Index": "1",
                "Rooms": [{
                    "HotelId": "12230",
                    "RoomId": "0",
                    "RateCode": "",
                    "RoomCount": "1",
                    "SupplierId": "4",
                    "IsDirect": "0"
                }]
            }]
        },
        "Insurance": {
            "AccidentCode": "",
            "CancleCode": ""
        }
    },
    tmplParam: {
        "Adult": 2,
        "Child": 0,
        "ChildAges": [],
        "RoomCount": 1
    },
    postData: {
        "LineDate": "2016-08-17",
        "Adult": 2,
        "Child": 1,
        "ChildAges": [],
        "RoomCount": 1,
        "FlightIndex": "",
        "Flights": [],
        "Hotels": [],
        "AccidentCode": "",
        "CancelCode": "",
        "EndUrl": ''
    },
    visaParam: {
        CountryId: 2946,
        VisaTypeId: 301,
        Regions: [{
            Id: 515,
            Name: "上海"
        }, {
            Id: 532,
            Name: "北京"
        }, {
            Id: 533,
            Name: "广州"
        }]
    },
    saveHtml: "",
    travelData: {},
    CalendarData: [],
    hotelParam: {
        "LineId": $("#lineId").val() || "",
        "LineDate": "2016-04-03",
        "Adult": 2,
        "Child": 0,
        "ChildAges": [],
        "IsConditions": 1,
        "Hotels": [{
            "DestId": 20606,
            "HotelId": 5742,
            "RoomId": 24831,
            "StartDate": "2016-04-03",
            "Nights": 1,
            "IsDirect": 1,
            "RoomCount": 0,
            "Index": 1
        }]
    },
    priceParam: {
        "TotalPrice": 0,
        "DefaultAcc": "",
        "DefaultAccPrice": "",
        "DefaultCan": "",
        "DefaultCanPrice": 0
    },
    tmpl: {
        flyHotel: require("../detail/flyandhotel.dot"),
        insuranceList: require("../detail/insurancelist.dot"),
        moreHotel: require("../detail/morehotel.dot"),
        priceBox: require("../detail/pricebox.dot"),
        roomDetail: require("../detail/roomdetail.dot")
    },
    content: {
        flightAndHotel: ".result-info"
    },
    init: function (cfg) {
        var self = this;
        self._init(cfg);
    },
    _init: function (cfg) {
        this.isErrorCct();
        this.overTime();
        this.tmplDeal();
        var search = new Search();
        search.init();
        this.countEv();
        this.initPackedCalendar();
        this.initEv();
        this.bookingEve();
        this.initslider();
        //this.mainEve();
        //降价通知
        $.extend(cfg, {
            ele: '.inform',
            getPrice: function () {
                return $(".declare-box").find(".declare-price.price").find("strong").text();
            },
            getLineID: function () {
                return $("#HidLineid").val();
            }
        });
        //泛打包
        this.setSelHelpPack();
        this.initTip();
        this.mapEvent();
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
                icon: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            bottomMenu: [{
                icon: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
                tooltips: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
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
    //cct参数错误
    isErrorCct: function () {
        var isErrorCct = $("#isErrorCct").val();
        if (isErrorCct && isErrorCct == 1) {
            var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="isErrorCct"><p>错误的方式，请返回后台下单系统重新查询操作！</p></div></div></div>';
            var config = {
                content: content,
                width: 500,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            $dialog.modal(config);
        }
    },
    overTime: function () {
        var self = this;
        citytimer = setTimeout(function () {
            var config = {
                content: '<div class="passTime fixed-warn1"><div class="data-loading"><div class="bg"><span>抱歉，当前资源已过期，请重新查询</span><div class="research J_research">重新查询</div></div></div></div>',
                width: 350,
                height: 180,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            $dialog.modal(config);
            $(document).on("click", ".J_research", function () {
                var cctParam = $("#cctParam").val();
                if (cctParam) {
                    var thisCctParam = cctParam;
                    $("#fromCctParam").val(thisCctParam);
                }
                var url = window.location.href;
                $("#hotelForm").attr('action', url);
                $("#hotelForm").submit();
            });
        }, 1000 * 60 * 10);
    },
    initEv: function () {
        var self = this;
        //修改
        $(document).on("click", ".J_resetBtn", function (e) {
            $(".haschoosen").addClass('none');
            $(".jijiuInfo").removeClass('none');
        });
        //取消
        $(document).on("click", ".btn-cancel", function (e) {
            $(".jijiuInfo").addClass('none').html(self.saveHtml);
            $(".haschoosen").removeClass('none');
        });
        $(document).on("click", ".option-hotel-item .delete-hotel", function () {
            var _self = $(this);
            _self.parent().remove();
            if ($(".option-hotel-item").length < 3) {
                $(".add-hotel").removeClass('none');
            } else {
                $(".add-hotel").addClass('none');
            }
            if ($(".option-hotel-item").length < 2) {
                $($(".delete-hotel")[0]).addClass('none');
            }
            $(".option-hotel-item").removeClass('firstItem');
            $($(".option-hotel-item")[0]).addClass('firstItem');
        });
        $(document).on("click", ".add-hotel", function () {
            var _self = $(this);
            $(".delete-hotel").removeClass('none');
            var hotelHtml = '<div class="option-hotel-item">' + '<table>' + '<tbody>' + '<tr>' + '<th colspan="3">' + '<input type="text" placeholder="入住城市" class="ui-input ui-input-city input-city-hotel" validate="required" vali-msg-required="请填写入住城市">' + '<div class="flyMoreCity" style="display:none"></div>' + '<div class="defaultCity"></div>' + '<span class="valid_symbol none"></span>' + '</th>' + '</tr>' + '<tr style="height:10px;"></tr>' + '<tr>' + '<td class="lefttd" width="140px">' + '<input type="text" placeholder="yyyy-mm-dd" class="ui-input ui-input-date hotelInDate" validate="required" vali-msg-required="请填写入住时间">' + '<span class="valid_symbol none"></span>' + '</td>' + '<td width="10px" align="center" style="color:#dfdfdf">-</td>' + '<td class="righttd">' + '<input type="text" placeholder="yyyy-mm-dd" class="ui-input ui-input-date hotelOutDate" validate="required" vali-msg-required="请填写离店时间">' + '<span class="valid_symbol none"></span>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '<i class="delete-hotel"></i>' + '</div>';
            $(".option-hotel-box").append(hotelHtml);
            if ($(".option-hotel-item").length < 3) {
                $(".add-hotel").removeClass('none');
            } else {
                $(".add-hotel").addClass('none');
            }
        });
    },
    //地图点击事件
    mapEvent: function () {
        $(document).on("click", ".J_hotel-mapInfo", function () {
            var self = $(this);
            var latPoint = self.data("lat"),
                lngPoint = self.data("lng"),
                name = self.data("name");
            var cfg = {};
            cfg.center = latPoint + "," + lngPoint;
            cfg.name = name;
            mapDia();
            googleMap.init(cfg);
            $(".mapBox").removeClass("none");
        });
        $(document).on("click", ".mapBox-title i", function () {
            $(".maoBox-bg").addClass("none");
            $(".mapBox").removeClass("mapBox-fixed").addClass("none");
            $(".mapBox #map").empty();
            $("#map").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
        });
        function mapDia() {
            $(".maoBox-bg").removeClass("none");
            $(".mapBox").addClass("mapBox-fixed");
        }
    },
    //处理放弃按钮的临时参数
    tmplDeal: function () {
        var self = this;
        self.saveHtml = $(".jijiuInfo").html();
        self.postData.Adult = parseInt(product.param.Adult);
        self.postData.Child = parseInt(product.param.ChildAges.length);
        self.postData.ChildAges = product.param.ChildAges;
        self.postData.RoomCount = parseInt(product.param.Hotel.RoomCount);
        self.postData.LineDate = product.param.LineDate;
    },
    //初始化泛打包价格日历
    initPackedCalendar: function () {
        var self = this, localArr;
        if (product && product.isvalid == 1) {
            self.choiceCalendar();
            self.backInit();
        } else {
            self.choiceCalendar();
            self.mainInit();
        }
    },
    //非其他页面返回的拼接参数
    choiceCalendar: function () {
        var self = this;
        self.param = product.param;
    },
    /**
     * 获取URL上的ouid存入cookie
     */
    getOuidInfo: function () {
        var url = location.href,
            ouid = "",
            hasouid = /(?:^|&|\?)ouid=([^&]*)(?:&|$)/i.exec(url);
        if (hasouid && hasouid[1]) {
            ouid = hasouid[1];
        }
        $.cookie("ouid", ouid, {
            path: '/dujia'
        });
    },
    _getData: function (url, callback) {
        var self = this,
            param = {
                //lineId: self.param.lineId,
                Isstore: "searchnew"
            };
        Common.ajax({
            url: url,
            dataType: 'json',
            data: param,
            success: function (data) {
                callback.call(this, data);
            }
        });
    },
    hasChildSave: function () {
        var self = this;
        if (product && product.isvalid == 1) {
            var localArr = product.Data;
            if (localArr.ChildAges && localArr.ChildAges.length) {
                return localArr.ChildAges;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    renderAdultHtml: function () {
        var self = this;
        var num = self.calculatePeopleNum(),
            childNum = num.childNum,
            jq_adult = $("#adult");
        var adultNum = parseInt(jq_adult.attr("num"));
        var newAdult = 10 - childNum,
            html = "";
        if (newAdult > 0) {
            for (var i = 1; i < newAdult; i++) {
                html += '<li>' + i + '</li>';
            }
            $(".adultNumBox ul").html(html);
        }
        self.numsEve();
    },
    renderChildHtml: function () {
        var self = this;
        var num = self.calculatePeopleNum(),
            childNum = num.childNum,
            jq_adult = $("#adult");
        var adultNum = parseInt(jq_adult.attr("num"));
        var newChild = 2 * adultNum + 1,
            html = "";
        if (newChild + adultNum > 10) {
            newChild = 10 - adultNum;
        }
        if (newChild > 0) {
            for (var i = 0; i < newChild; i++) {
                html += '<li>' + i + '</li>';
            }
            $(".childNumBox ul").html(html);
        }
        self.numsEve();
    },
    renderRoomHtml: function () {
        var self = this,
            jq_adult = $("#adult"),
            adultNum = parseInt(jq_adult.attr("num")),
            html = "";
        for (var i = 1; i < adultNum + 1; i++) {
            html += '<li>' + i + '</li>';
        }
        $(".roomNumBox ul").html(html);
        self.numsEve();
    },
    numsEve: function () {
        var self = this,
            num = self.calculatePeopleNum(),
            childNum = num.childNum;
        $(".roomNumBox li").click(function (e) {
            e.stopPropagation();
            var _self = $(this);
            var newsum = _self.html();
            $("#room").html(newsum).val(newsum).attr('num', newsum);
            $(".roomNumBox").slideUp(200);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
        });
        $(".adultNumBox li").click(function (e) {
            e.stopPropagation();
            var _self = $(this);
            var newsum = _self.html();
            $("#adult").html(newsum).val(newsum).attr('num', newsum);
            $(".adultNumBox").slideUp(200);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
            if (newsum * 2 < childNum) {
                $("#child1").val("0").attr("num", 0);
            }
            self.defRoomCount();
        });
        $(".childNumBox li").click(function () {
            var _self = $(this);
            var newsum = parseInt(_self.html()),
                allhtml = "";
            if (!$("#child1").hasClass('hasrenderAge')) {
                self.renderAgeHtml();
            }
            $("#child1").html(newsum).val(newsum).attr('num', newsum);
            $(".childNumBox").slideUp(200);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
            $("#child1").addClass('hasrenderAge');
            if (newsum != 0) {
                $(".childOld-box").removeClass('none');
            }
            if (!$(".item-childOld").length) {
                for (var i = 0; i < newsum; i++) {
                    var sunnum = i + 1;
                    var thishtml = '<div class="item-childOld">' + '<em>儿童' + sunnum + '</em>' + '<em class="drop-child" data-year="0">&lt;1岁</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                    allhtml += thishtml;
                }
                $(".box-childyear").html(allhtml);
            } else {
                var lastChildNum = $(".item-childOld").length;
                var chasum = newsum - lastChildNum;
                if (chasum < 0) { //后来选的小于原来的人数
                    var absChaSum = Math.abs(chasum);
                    for (var i = 0; i < absChaSum; i++) {
                        $(".item-childOld:last-child").remove();
                    }
                } else if (chasum > 0) { //后来选的大于原来的人数
                    var allHtml = "";
                    for (var i = 0; i < chasum; i++) {
                        var j = lastChildNum + i + 1;
                        var thishtml = '<div class="item-childOld">' + '<em>儿童' + j + '</em>' + '<em class="drop-child" data-year="0">&lt;1岁</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                        allHtml += thishtml;
                    }
                    $(".box-childyear").append(allHtml);
                }
            }
        });
    },
    renderAgeHtml: function () {
        var self = this,
            ChildAges;
        var ChildAges = self.hasChildSave(),
            allhtml = "";
        if ($(".box-childyear").html() == "") {
            if (ChildAges) {
                for (var i = 0; i < ChildAges.length; i++) {
                    var childnums = i + 1,
                        selectChildVal;
                    if (ChildAges[i] == 0) {
                        selectChildVal = "&lt;1岁";
                    } else {
                        selectChildVal = ChildAges[i] + "岁";
                    }
                    var thishtml = '<div class="item-childOld">' + '<em>儿童' + childnums + '</em>' + '<em class="drop-child" data-year="' + ChildAges[i] + '">' + selectChildVal + '</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                    allhtml += thishtml;
                }
                $(".box-childyear").empty();
                $(".box-childyear").append(allhtml);
            }
        }
    },
    ageEve: function () {
        var self = this;
        $(document).on("click", ".drop-child", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _self = $(this);
            _self.siblings('.choice-childy').stop().slideToggle(200);
            //失去焦点隐藏
            $(document).bind('click', function () {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
        });
        $(document).on("click", ".choice-childy li", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _self = $(this);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
            _self.parent().siblings('.drop-child').html(_self.html()).attr('data-year', _self.attr("data-year"));
            _self.parent().slideUp(200);
        });
        $(document).on("click", ".childyear-submit", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(".childOld-box").addClass('none');
            self.defRoomCount();
        });
        $(document).on("click", "#child1", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _self = $(this);
            if (_self.attr("num") != 0) {
                self.renderAgeHtml();
                $(".childOld-box").removeClass('none');
                $("#child1").removeClass('hasrenderAge');
                self.hidePanel();
                $(".adultNumBox").slideUp(200);
                $(".roomNumBox").slideUp(200);
            }
        });
    },
    countEv: function () {
        var self = this;
        $(document).on("click", ".roomItem", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = $(this);
            self.renderRoomHtml();
            $(".roomNumBox").slideToggle(200);
            $(".adultNumBox").slideUp(200);
            $(".childOld-box").addClass('none');
            $(".childNumBox").slideUp(200);
            //失去焦点隐藏
            $(document).bind('click', function () {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        $(document).on("click", ".adultItem", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = $(this);
            self.renderAdultHtml();
            $(".adultNumBox").slideToggle(200);
            $(".childOld-box").addClass('none');
            $(".childNumBox").slideUp(200);
            $(".roomNumBox").slideUp(200);
            //失去焦点隐藏
            $(document).bind('click', function () {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        $(document).on("click", ".childItem i", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = $(this);
            self.renderChildHtml();
            $(".childOld-box").addClass('none');
            $(".childNumBox").slideToggle(200);
            $(".adultNumBox").slideUp(200);
            $(".roomNumBox").slideUp(200);
            //失去焦点隐藏
            $(document).bind('click', function () {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        $(document).on("click", ".J_giveup", function () {
            var _this = $(this);
            var localArr = self.tmplParam;
            $(".box-childyear").empty();
            if (localArr) {
                $("#adult").val(localArr.Adult);
                $("#adult").attr("num", localArr.Adult);
                $("#child1").val(localArr.Child);
                $("#child1").attr("num", localArr.Child);
                $("#room").val(localArr.RoomCount);
                $("#room").attr("num", localArr.RoomCount);
            }
            $(".sureOr").addClass('none');
            $(".calTotalPrice").removeClass('none');
            $(".childOld-box").addClass('none');
        });
        self.ageEve();
    },
    hidePanel: function () {
        $(".defaultCity").hide();
        $(".ui_popup_gp").hide();
    },
    //计算默认房间数
    defRoomCount: function () {
        var self = this;
        var num = self.calculatePeopleNum(),
            childNum = num.childNum,
            jq_adult = $("#adult"),
            roomcount;
        var adultNum = parseInt(jq_adult.attr("num"));
        if (childNum == 0) {
            roomcount = Math.ceil(adultNum / 2);
        } else {
            if (adultNum > childNum) {
                roomcount = Math.ceil(adultNum / 2);
            } else {
                roomcount = adultNum;
            }
        }
        $("#room").html(roomcount).val(roomcount).attr('num', roomcount);
        $(".sureOr").removeClass('none');
        $(".calTotalPrice").addClass('none');
    },
    //点击文档其他地方隐藏面板
    __docClick: function (obj) {
        $('.adultNumBox,.childNumBox,.roomNumBox').hide();
        $(".J_selectCity").addClass('none');
        $(".summary .line-pro .city .txt i").removeClass('cityup');
        $(document).unbind('click', obj);
    },
    __stopPropagation: function (e) {
        var e = this.__getEvent();
        if (window.event) {
            //e.returnValue=false;//阻止自身行为
            e.cancelBubble = true; //阻止冒泡
        } else if (e && e.preventDefault) {
            //e.preventDefault();//阻止自身行为
            e.stopPropagation(); //阻止冒泡
        }
    },
    //得到事件
    __getEvent: function () {
        if (window.event) {
            return window.event;
        }
        var func = this.__getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },
    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function (callback) {
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function () {
                callback.call(self);
            },
            unReload: true
        });
    },
    isLogin: function () {
        var cnUser = $.cookie("us");
        return (/userid=\d+/.exec(cnUser));
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    checkLogin: function (callback) {
        if (!this.isLogin()) {
            this.initLogin(callback);
        } else {
            callback && callback.call(this);
        }
    },
    /**
     * @desc 给所有的J_Tips绑定tip提示功能
     * @example
     * <div class="J_Tips" data-content='<p>test</p>'></div>
     * //默认的对齐位置为 左侧,底部
     */
    initTip: function ($elem) {
        //console.log(1);
        //单击触发
        $dialog.tooltip({
            width: 130,
            zIndex: 100,
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            triggerEle: '.num-child', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
        });
        $dialog.tooltip({
            width: 300,
            zIndex: 100,
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            triggerEle: '.child-info', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
        });
        $dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            triggerEle: '.J_Tips,.J_Tips_async', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom', //显示位置支持top,left,bottom,right
            wrapper: "body" //外容器,默认为document
        });
    },
    getExtraParam: function (ret) {
        var akVal = Common.getParamFromUrl("ak"),
            sellTypeVal = Common.getParamFromUrl("selltype", true);
        if (akVal) {
            ret.order += "&ak=" + akVal;
            ret.ajax += "&ak=" + akVal;
            if (sellTypeVal) {
                ret.order += "&selltype=" + sellTypeVal;
            }
        }
        //如果是预售的话,则会有这个节点
        var extraUrlEl = document.getElementById("J_ExtraUrlParam");
        if (extraUrlEl) {
            ret.order += "&" + extraUrlEl.value;
        }
    },
    priceScroll: function () {
        var posTopOrigin = $('.flight-box').offset().top + 60;
        var botHeight = $(".J_routeDetail").offset().top - $('.price-box').height() - 140;
        $(window).on('scroll', function () {
            if (posTopOrigin < $(window).scrollTop() && $(window).scrollTop() < botHeight) {
                $('.price-box').addClass('priceFixed');
                $('.price-box').removeAttr("style");
            } else {
                $('.price-box').removeClass('priceFixed');
                $('.price-box').css('right', '28px');
            }
        });
    },
    //机加酒自助打包
    setSelHelpPack: function () {
        var packaged = new Packaged();

        packaged.init();
    },
    renderList: function (data, type) {
        var self = this,
            context = $(self.content[type]),
            tmpl = self.tmpl,
            html = tmpl[type](data);
        context.empty().append(html);
    },
    calculatePeopleNum: function () {
        var totalNum = 0,
            childNum = 0;
        $(".input-num").each(function () {
            var _this = $(this);
            if (_this.attr("price-type") == "child") {
                childNum += parseInt(_this.attr("num"));
            }
            totalNum += parseInt(_this.attr("num"));
        });
        return {
            totalNum: totalNum,
            childNum: childNum,
            adult: $("#adult").val(), //成人
            child: $("#child1").val() //儿童占床
            //nobed: $("#child2").val() //儿童不占床
        };
    },
    //机票酒店保险初始化
    mainInit: function (cfg) {
        var self = this;
        var _param = self.param;
        var url = "/intervacation/api/PDynamicPackageProductDetail/PostDynamicSaleProduct";
        var beforeTime = +new Date;
        $(".J_insuranceBox").empty();
        current_request = Common.ajax({
            url: url,
            type: 'post',
            data: "param=" + encodeURIComponent(JSON.stringify(_param)),
            dataType: 'json',
            timeout: 30000,
            beforeSend: function () {
                $(".product-box").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
            },
            success: function (data) {
                if (data.Data && data.Code == 4000) {
                    if (data.Data.Tip == "NoFlightHotel") {
                        var html = '<div class="error-warning"><i></i>很抱歉，无法找到符合您要求的机票+酒店，请更换条件重新查询</div>';
                        $(".product-box").html(html);
                        $(".J_next").html("已订完");
                        $(".J_OrderBtn").html("已订完");
                        $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
                    } else if (data.Data.Tip == "NoFlight") {
                        var html = '<div class="error-warning"><i></i>很抱歉，机票资源已订光，请更换日期重新查询</div>';
                        $(".product-box").html(html);
                        $(".J_next").html("已订完");
                        $(".J_OrderBtn").html("已订完");
                        $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
                    } else if (data.Data.Tip == "NoHotel") {
                        var html = '<div class="error-warning"><i></i>很抱歉，酒店资源已订光，请更换日期重新查询</div>';
                        $(".product-box").html(html);
                        $(".J_next").html("已订完");
                        $(".J_OrderBtn").html("已订完");
                        $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
                    }else{
                        self.dataInit(data, 0);
                    }
                } else {
                    var html = '<div class="error-warning"><i></i>来晚啦，该日期已被订光，请更换日期重新搜索</div>';
                    $(".product-box").html(html);
                    $(".J_next").html("已订完");
                    $(".J_OrderBtn").html("已订完");
                    $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
                }
            },
            error: function () {
                var html = '<div class="error-warning"><i></i>来晚啦，该日期已被订光，请更换日期重新搜索</div>';
                $(".product-box").html(html);
                $(".J_next").html("已订完");
                $(".J_OrderBtn").html("已订完");
                $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
            }
        });
    },
    backInit: function () {
        var self = this;
        if (product.Data.SelectFlights && product.Data.SelectFlights.length) {
            product.Data.Flights = product.Data.SelectFlights;
            product.Data.SelectFlights = null;
        }
        self.dataInit(product, 1);
    },
    dataInit: function (data, isback) {
        var self = this;
        var totalNum = parseInt(self.param.Adult) + parseInt(self.param.ChildAges.length);
        data.Data.totalNum = totalNum;
        var siglePrice, hotelPrice = 0,
            Nights = 0,
            roomNum = 0,
            roomNums = 0,
            allPrice = 0,
            sumPrice = 0;
        //计算初始化默认选中酒店的总价
        if (data.Data.Hotels) {
            self.postData.Hotels = data.Data.Hotels;
            var Hotels = [];
            for (var i = 0; i < data.Data.Hotels.length; i++) {
                var Ahotel = {};
                Ahotel.CityId = data.Data.Hotels[i].CityId;
                Ahotel.StartDate = data.Data.Hotels[i].CheckInTime;
                Ahotel.Nights = data.Data.Hotels[i].Nights;
                for (var j = 0; j < data.Data.Hotels[i].Rooms.length; j++) {
                    Nights += data.Data.Hotels[i].Nights;
                    if (data.Data.Hotels[i].Rooms[j].IsSelected == 1) {
                        Ahotel.Rooms = [];
                        for (var k = 0; k < data.Data.Hotels[i].Rooms[j].Rates.length; k++) {
                            var Aroom = {};
                            if (data.Data.Hotels[i].Rooms[j].Rates[k].IsSelected == 1) {
                                Aroom.HotelId = data.Data.Hotels[i].HotelId;
                                Aroom.IsDirect = data.Data.Hotels[i].IsDirect;
                                Aroom.RoomId = data.Data.Hotels[i].Rooms[j].Rates[k].RoomId;
                                Aroom.RateCode = data.Data.Hotels[i].Rooms[j].Rates[k].RateCode;
                                Aroom.RoomCount = roomNum = data.Data.Hotels[i].Rooms[j].Rates[k].RoomCount;
                                siglePrice = roomNum * parseInt(data.Data.Hotels[i].Rooms[j].Rates[k].Price);
                                roomNums += roomNum;
                                hotelPrice += siglePrice;
                            }
                            Ahotel.Rooms.push(Aroom);
                        }
                    }
                }
                Hotels.push(Ahotel);
            }
            self.param.Hotel.Hotels = Hotels;
        }
        if (data.Data.Flight) {
            self.postData.Flight = data.Data.Flight;
            var flight = {}
            flight.DepartCode = data.Data.Flight.DepartCode;
            flight.ArriveCode = data.Data.Flight.ArriveCode;
            flight.DepartDate = data.Data.Flight.DepartDate;
            flight.ReturnDate = data.Data.Flight.ReturnDate;
            flight.IsDirect = data.Data.Flight.IsDirect;
            flight.FlightNos = data.Data.Flight.FlightNos;
            flight.GoKey = "";
            flight.Type = 1;
            self.param.Flight = flight;
        }
        for (var i = 0; i < data.Data.Flights.length; i++) {
            allPrice += parseInt(data.Data.Flights[i].Cabins[0].TotalPrice);
        }
        allPrice = hotelPrice + allPrice;
        self.priceParam.TotalPrice = allPrice;
        data.Data.TotalPrice = allPrice;
        var DefaultIndex, DefaultAcc, DefaultAccPrice, DefaultCan, DefaultCanPrice, valueKey;
        //初始化时的保险
        var oldAccidents = [],
            oldCancles = [];
        if (isback == 1) {
            var insrueUrl = "/intervacation/api/PDynamicPackageProductDetail/GetInsurances?lineDate=" + product.param.LineDate + "&accidentCode=" + product.Data.AccidentCode + "&Searchtype=1";
            $.ajax({
                url: insrueUrl,
                type: 'GET',
                dataType: 'json'
            }).then(function (data1) {
                oldAccidents = data1.Data.Accidents || [];
                oldCancles = data1.Data.Cancles || [];
                data.Data.Insurance = {};
                data.Data.Insurance.Accidents = oldAccidents;
                data.Data.Insurance.Cancles = oldCancles;
                self.finalDeal({
                    data: data,
                    allPrice: allPrice,
                    roomNums: roomNums,
                    Nights: Nights,
                    hotelPrice: hotelPrice,
                    totalNum: totalNum,
                    isback: isback
                });
            });
        } else {
            self.finalDeal({
                data: data,
                allPrice: allPrice,
                roomNums: roomNums,
                Nights: Nights,
                hotelPrice: hotelPrice,
                totalNum: totalNum
            });
        }
    },
    finalDeal: function (cfg) {
        var self = this;
        var data = {};
        data.Data = cfg.data.Data;
        if (data.Data.Insurance != null && data.Data.Insurance.Accidents.length) {
            self.dealInsuranceData(cfg.data, cfg.allPrice);
            DefaultAccPrice = self.priceParam.DefaultAccPrice;
            DefaultCanPrice = self.priceParam.DefaultCanPrice;
            data.Data.DefaultCan = self.priceParam.DefaultCan;
            data.Data.DefaultAcc = self.priceParam.DefaultAcc;
            if (cfg.isback == 1) {
                data.Data.isback = cfg.isback;
                if (data.Data.AccidentCode) {
                    data.Data.DefaultAccPrice = self.priceParam.DefaultAccPrice;
                } else {
                    DefaultAccPrice = 0;
                }
                if (data.Data.CancelCode) {
                    data.Data.DefaultCanPrice = self.priceParam.DefaultCanPrice;
                } else {
                    DefaultCanPrice = 0;
                }
            } else {
                data.Data.DefaultAccPrice = self.priceParam.DefaultAccPrice;
                data.Data.DefaultCanPrice = self.priceParam.DefaultCanPrice;
            }
            var sumPrice = cfg.allPrice + parseInt(cfg.totalNum) * (DefaultAccPrice + DefaultCanPrice);
            data.Data.sumPrice = sumPrice;
            self.initInsurance(data);
            data.Data.DefaultCan = self.priceParam.DefaultCan;
        } else {
            sumPrice = cfg.allPrice;
            data.Data.sumPrice = sumPrice;
        }
        data.Data.roomNum = cfg.roomNums;
        data.Data.Nights = cfg.Nights;
        data.Data.hotelPrice = cfg.hotelPrice;
        data.Data.Adult = self.param.Adult;
        data.Data.childNum = self.param.ChildAges.length;
        data.Data.DepartDate = data.Data.Flights[0].Flight.StartDate;
        data.Data.ReturnDate = data.Data.Flights[data.Data.Flights.length - 1].Flight.StartDate;
        data.flyParam = {};
        data.flyParam.Flights = data.Data.Flights;
        data.flyParam.Hotels = data.Data.Hotels;
        data.flyParam.LineDate = data.Data.DepartDate;
        data.flyParam.Adult = data.Data.Adult;
        data.flyParam.Child = data.Data.childNum;
        data.flyParam.RoomCount = $(".roomItem input").val();
        data.flyParam.SearchType = 1;
        data.flyParam.FlightIndex = 0;
        data.flyParam.EndUrl = window.location.href;
        data.flyParam.ChildAges = self.param.ChildAges;
        var lineId = $("#lineId").val();
        if (lineId) {
            data.flyParam.LineId = parseInt(lineId);
        }
        var tmpl = self.tmpl,
            html1, html2;
        data.isSearch = 1;
        html1 = tmpl["flyHotel"](data);
        $(".product-box").empty().append(html1);
        $(".calTotalPrice").removeClass('none');
        $(".sureOr").addClass('none');
        $(".J_OrderBtn").addClass('J_booking').removeClass('disable').html("<span></span> 立即预订&gt;&gt;");
        $(".reserve-btn span").html("¥" + sumPrice);
        $(".txt_allPrice em").html(sumPrice);
        $(".J_next").removeClass('disable').addClass('J_booking').html("下一步<em>填写订单</em>");
        self.mainEve();
        if (data.Data) {
            self.priceScroll();
        }
        self.travelData = data;
        self.seleceHotel();
    },
    seleceHotel: function () {
        var self = this,
            tmpl = self.tmpl,
            html;
        var num = self.calculatePeopleNum(),
            adult = num.adult,
            child = num.child,
            childNum = num.childNum,
            totalNum = num.totalNum;
        $(".btn-choice-flight").click(function () {
            var _this = $(this);
            var hotelSum = 0,
                hotelPrice = 0,
                signleSum = 0,
                siglePrice = 0,
                roomPrice = 0,
                allPrice = 0;
            if (_this.hasClass('has-choice-hotel')) {
                return;
            }
            self.postData = JSON.parse(decodeURIComponent($(".btn-hotel").attr("data-flyParam")));
            var $selectli = _this.parent().parent().parent().parent().parent();
            $selectli.parents(".box-hotel").find('.has-choice-hotel').removeClass('has-choice-hotel');
            _this.addClass('has-choice-hotel');
            _this.html("已 选<i></i>");
            var index = _this.parents(".box-hotel").attr("param-index");
            index = parseInt(index);
            var RoomParam = $selectli.attr("data-RoomParam");
            RoomParam = JSON.parse(decodeURIComponent(RoomParam));
            RoomParam.IsSelected = 1;
            RoomParam.Rates[0].IsSelected = 1;
            RoomParam.Rates[0].DifferencePrice = 0;
            self.postData.Hotels[index].Rooms = [];
            self.postData.Hotels[index].Rooms.push(RoomParam);
            var cancelObj = $(".Cancles-list").find(".others-check").prop("checked");
            var accObj = $(".Accidents-list").find(".others-check");
            if (accObj) {
                for (var i = 0; i < accObj.length; i++) {
                    if ($(accObj).eq(i).prop("checked")) {
                        self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                        break;
                    } else {
                        self.postData.AccidentCode = "";
                    }
                }
            }
            if (cancelObj) {
                self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
            } else {
                self.postData.CancelCode = "";
            }
            var cctParam = $("#cctParam").val();
            if (cctParam) {
                var thisCctParam = cctParam;
                $("#fromCctParam").val(thisCctParam);
                self.postData.Platment = 8;
            }
            var url = window.location.href;
            var thisparam = encodeURIComponent(JSON.stringify(self.postData));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            $("#hotelForm").submit();
        });
        $(".name-room").click(function () {
            var _this = $(this),
                tmpl = self.tmpl,
                html = "";
            var $li = _this.parent().parent().parent().parent(),
                $hotel = $li.parent().parent().parent().parent();
            $(".boxH1").addClass('none');
            if (!_this.hasClass('haschlick')) {
                _this.addClass('haschlick');
                if ($hotel.attr("data-isdirect") == 0) {
                    var _html1 = '<div class="boxH1"><div class="data-loading"><i class="btn-closeCheckIn"></i><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
                    $li.append(_html1);
                    var _url = {
                        "SearchType": 1,
                        "HotelId": $hotel.attr("data-hotelid"),
                        "RoomId": $li.attr("data-roomid"),
                        "RateCode": $li.attr("data-ratecode"),
                        "SupplierId": $li.attr("data-supplierid"),
                        "StartDate": $hotel.attr("data-startdate"),
                        "Nights": $hotel.attr("data-nights"),
                        "Adult": self.param.Adult,
                        "ChildAges": self.param.ChildAges,
                        "RoomCount": $li.attr("data-roomcount")
                    };
                    var cctParam = $("#cctParam").val();
                    if (cctParam) {
                        _url.Platment = 8;
                    }
                    var url = "/intervacation/api/PDynamicPackageHotel/GetHotelRateDetail?param=" + encodeURIComponent(JSON.stringify(_url));
                    $.ajax({
                        url: url,
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            html = tmpl["roomDetail"](data);
                            $li.find('.boxH1').html(html);
                            $li.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                            $(".carousel-spot").carousel({
                                visible: 1,
                                auto: false,
                                btnPrev: ".prev",
                                btnNext: ".next"
                            });
                        }
                    });
                } else {
                    var html1 = '<div class="boxH1">' + '<div class="CheckIn-box CheckIn-sbox">' + '<div class="CheckIn-box-title"> <span class="nohotel-title"></span> <i class="btn-closeCheckIn"></i> </div>' + '<div class="content-checkIn clearfix">' + '<div class="noroom"><i></i><span>很抱歉，暂无该房型信息</span></div>' + '</div></div></div>';
                    $li.append(html1);
                    $li.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                }
            } else {
                $li.find('.boxH1').removeClass('none');
            }
        });
    },
    initInsurance: function (data) {
        var self = this;
        var tmpl = self.tmpl,
            html1;
        html1 = tmpl["insuranceList"](data);
        $(".J_insuranceBox").empty().append(html1);
        self.insuranceEvent();
    },
    dealInsuranceData: function (data, allPrice) {
        var self = this,
            DefaultIndex, valueKey = 0;
        self.param.Insurance = { AccidentCode: "", CancleCode: "" };
        var allPrice = allPrice / data.Data.totalNum;
        if (data.Data.Insurance) {
            for (var i = 0; i < data.Data.Insurance.Accidents.length; i++) {
                if (data.Data.Insurance.Accidents[i].IsSelected == 1) {
                    DefaultIndex = i;
                    break;
                }
            }
            if (DefaultIndex) {
                self.priceParam.DefaultAcc = data.Data.Insurance.Accidents[DefaultIndex].Name;
                self.priceParam.DefaultAccPrice = data.Data.Insurance.Accidents[DefaultIndex].Price;
                self.postData.AccidentCode = self.param.Insurance.AccidentCode = data.Data.Insurance.Accidents[DefaultIndex].Id;
            } else {
                self.priceParam.DefaultAcc = data.Data.Insurance.Accidents[0].Name;
                self.priceParam.DefaultAccPrice = data.Data.Insurance.Accidents[0].Price;
                self.postData.AccidentCode = self.param.Insurance.AccidentCode = data.Data.Insurance.Accidents[0].Id;
            }
            var canLength = data.Data.Insurance.Cancles.length;
            if (data.Data.Insurance.Cancles && canLength > 0) {
                for (var j = 0; j < canLength; j++) {
                    minValue = data.Data.Insurance.Cancles[j].MinValue - 1;
                    maxValue = data.Data.Insurance.Cancles[j].MaxValue + 1;
                    if (allPrice > minValue && allPrice < maxValue) {
                        valueKey = j;
                        break;
                    }
                }
                if (allPrice > data.Data.Insurance.Cancles[canLength - 1].MaxValue) {
                    valueKey = canLength - 1;
                }
                self.priceParam.DefaultCan = data.Data.Insurance.Cancles[valueKey].Insurance.Name;
                self.priceParam.DefaultCanPrice = data.Data.Insurance.Cancles[valueKey].Insurance.Price;
                self.param.Insurance.CancleCode = data.Data.Insurance.Cancles[valueKey].Insurance.Id;
            } else {
                self.priceParam.DefaultCan = "";
                self.priceParam.DefaultCanPrice = 0;
                self.param.Insurance.CancleCode = "";
            }
        }
    },
    insuranceEvent: function () {
        var _self = this;
        $(".more-others").click(function () {
            var self = $(this);
            if (self.hasClass('shou')) {
                self.removeClass('shou');
                self.html("更多意外险<i></i>");
                //$(self.parent()).css('height', '61px');
                $(".Accidents-list").prepend($(".Accidents-list .others-check:checked").parent());
                $(self.parent().find(".other-content")).eq(1).addClass('none');
            } else {
                self.html("收起<i></i>");
                self.addClass('shou');
                $(self.parent().find(".other-content")).eq(1).removeClass('none');
                //$(self.parent()).css('height', 'auto');
            }
        });
        $(".Accidents-list .others-check").click(function () {
            var _this = $(this),
                price, id, totalprice, sum;
            if (_this.is(":checked")) {
                $(".J_Accidents").parent("dl").show();
                _self.postData.AccidentCode = _self.param.Insurance.AccidentCode = _this.parent().attr('data-id');
                _this.parent().siblings(".other-content").find('.others-check').removeAttr("checked");
                $(".J_Accidents .Lbox").html(_this.parent().attr('data-name'));
                price = "¥" + _this.parent().attr('data-single');
                $(".J_Accidents .Rbox em").html(price);
                $(".J_Accidents .Rbox i").html(_this.parent().attr('data-num'));
                $(".J_Accidents").removeClass('none');
                totalprice = _self.priceParam.TotalPrice;
                _self.calprice();
            } else {
                $(".J_Accidents").addClass('none');
                if ($(".J_Accidents").hasClass("none") && $(".J_Cancles").hasClass("none")) {
                    $(".J_Accidents").parent("dl").hide();
                }
                _self.postData.AccidentCode = _self.param.Insurance.AccidentCode = "";
                _self.calprice();
            }
        });
        $(".Cancles-list .others-check").click(function () {
            var _this = $(this),
                price, id, totalprice, sum;
            if (_this.is(":checked")) {
                $(".J_Accidents").parent("dl").show();
                _self.param.Insurance.CancleCode = _this.parent().attr('data-id');
                $(".J_Cancles .Lbox").html(_this.parent().attr('data-name'));
                price = "¥" + _this.parent().attr('data-single');
                $(".J_Cancles .Rbox em").html(price);
                $(".J_Cancles .Rbox i").html(_this.parent().attr('data-num'));
                $(".J_Cancles").removeClass('none');
                _self.calprice();
            } else {
                $(".J_Cancles").addClass('none');
                if ($(".J_Accidents").hasClass("none") && $(".J_Cancles").hasClass("none")) {
                    $(".J_Accidents").parent("dl").hide();
                } else {
                    $(".J_Accidents").parent("dl").show();
                }
                _self.param.Insurance.CancleCode = "";
                _self.calprice();
            }
        })
    },
    calprice: function () {
        var self = this,
            totalPrice = 0,
            sumPrice = 0,
            siglePrice = 0,
            siglesum = 0,
            price = 0,
            allPrice = 0;
        $(".others-check:checked").each(function (i, elem) {
            siglePrice = parseInt($(elem).parent().attr("data-single"));
            siglesum = parseInt($(elem).parent().attr("data-num"));
            price = siglePrice * siglesum;
            allPrice += price;
        });
        totalPrice = self.priceParam.TotalPrice + allPrice;
        $(".total-pr .Rbox em").html(totalPrice);
        $(".reserve-btn span").html("¥" + totalPrice);
        $(".txt_allPrice em").html(totalPrice);
    },
    packEve: function () {
        var _self = this;
    },
    mainEve: function () {
        var _self = this;
        var isrun = false;
        $(document).on('click', ".btn-closeCheckIn", function () {
            $(".boxH1").addClass('none');
        });
        $(".J_more").click(function () {
            var self = $(this);
            if (self.hasClass('fold')) {
                self.removeClass('fold');
                self.html("展开全部房型<b></b>");
                if (self.parent().prev(".box-hotel").find('.roomType-box').height() > 400) {
                    var thisHeight = self.parent().prev(".box-hotel").offset().top - 120;
                    $("body").scrollTop(thisHeight);
                }
                self.parent().prev(".box-hotel").find('.hotelbox1').removeClass('none');
                self.parent().prev(".box-hotel").find('.hotelbox2').addClass('none');
                _self.priceScroll();
                //self.parent().prev(".box-hotel").css('height', '192px');
            } else {
                if (!self.hasClass('hasClick')) {
                    // _self.hotelParam.ChildAges = _self.param.ChildAges;
                    var _url, newurl = {};
                    //newurl = $.extend({}, _self.hotelParam);
                    var node = self.parent().prev(".box-hotel").find('.hotelbox1 .hotel-has-select');
                    var postHotelData = self.attr("data-hotelParam");
                    postHotelData = JSON.parse(decodeURIComponent(postHotelData));
                    newurl = {
                        "SearchType": 1,
                        "LineId": _self.param.LineId,
                        "LineDate": node.attr('data-startdate'),
                        "Adult": _self.param.Adult,
                        "RoomCount": _self.param.Hotel.RoomCount,
                        "ChildAges": _self.param.ChildAges,
                        "Hotel": postHotelData
                    };
                    var cctParam = $("#cctParam").val();
                    if (cctParam) {
                        newurl.Platment = 8;
                    }
                    var url = "/intervacation/api/PDynamicPackageHotel/PostHotelRooms";
                    if (!isrun) {
                        isrun = true;
                        self.html("加载中<i></i>");
                        $.ajax({
                            url: url,
                            type: 'post',
                            data: 'param=' + encodeURIComponent(JSON.stringify(newurl)),
                            dataType: 'json',
                            success: function (data) {
                                if (data.Data) {
                                    var tmpl = _self.tmpl,
                                        html;
                                    html = tmpl["moreHotel"](data);
                                    self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                                    self.parent().prev(".box-hotel").find('.hotelbox2').html(html);
                                } else {
                                    self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                                    var box1Html = self.parent().prev(".box-hotel").find('.hotelbox1').html();
                                    var box2Html = box1Html + '<div class="nomoreRoom">没有更多房型啦</div>';
                                    self.parent().prev(".box-hotel").find('.hotelbox2').append(box2Html);
                                }
                                self.html("收起全部房型<b></b>");
                                self.addClass('fold').addClass('hasClick');
                                self.parent().prev(".box-hotel").css('height', 'auto');
                                var data1 = _self.travelData;
                                _self.seleceHotel(data1);
                                _self.priceScroll();
                            },
                            complete: function () {
                                isrun = false;
                            }
                        });
                    }

                } else {
                    self.html("收起全部房型<b></b>");
                    self.addClass('fold').addClass('hasClick');
                    self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                    self.parent().prev(".box-hotel").find('.hotelbox2').removeClass('none');
                    _self.priceScroll();
                }
            }
        });
        $(".btn-hotel").click(function () {
            var self = $(this);
            var clickindex = self.parent().parent().attr("param-index");
            var url = "/dujia/travel/selectHotel.html";
            _self.postData = JSON.parse(decodeURIComponent(self.attr("data-flyParam")));
            _self.postData.HotelIndex = parseInt(clickindex);
            var cctParam = $("#cctParam").val();
            var cancelObj = $(".Cancles-list").find(".others-check").prop("checked");
            var accObj = $(".Accidents-list").find(".others-check");
            if (accObj) {
                for (var i = 0; i < accObj.length; i++) {
                    if ($(accObj).eq(i).prop("checked")) {
                        _self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                        break;
                    } else {
                        _self.postData.AccidentCode = "";
                    }
                }
            }
            if (cancelObj) {
                _self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
            } else {
                _self.postData.CancelCode = "";
            }
            if (cctParam) {
                var thisCctParam = cctParam;
                $("#fromCctParam").val(thisCctParam);
                _self.postData.Platment = 8;
            }
            var thisparam = encodeURIComponent(JSON.stringify(_self.postData));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            $("#hotelForm").submit();
            //location.href = url;
        });
        $(".btn-flight").click(function () {
            var self = $(this);
            var url = "/dujia/travel/selectFlight.html";
            _self.postData = JSON.parse(decodeURIComponent(self.attr("data-flyParam")));
            var cctParam = $("#cctParam").val();
            var cancelObj = $(".Cancles-list").find(".others-check").prop("checked");
            var accObj = $(".Accidents-list").find(".others-check");
            if (accObj) {
                for (var i = 0; i < accObj.length; i++) {
                    if ($(accObj).eq(i).prop("checked")) {
                        _self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                        break;
                    } else {
                        _self.postData.AccidentCode = "";
                    }
                }
            }
            if (cancelObj) {
                _self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
            } else {
                _self.postData.CancelCode = "";
            }
            if (cctParam) {
                var thisCctParam = cctParam;
                $("#fromCctParam").val(thisCctParam);
                _self.postData.Platment = 8;
            }
            var thisparam = encodeURIComponent(JSON.stringify(_self.postData));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            $("#hotelForm").submit();
        });
    },
    bookingEve: function () {
        var _self = this;
        clearTimeout(citytimer);
        _self.overTime();
        $(document).on('click', ".J_booking", function () {
            var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
            var config = {
                content: content,
                width: 500,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            $dialog.modal(config);
            window.dialog = $dialog;
            var yanjia_param = {},
                self = $(this),
                flightParam, siglefly, flyParam = [],
                siglehotel, hotelParam = [];
            var bookParam = JSON.parse(decodeURIComponent($(".btn-flight").attr("data-flyParam")));
            yanjia_param.LineDate = _self.param.LineDate;
            yanjia_param.Adult = _self.param.Adult;
            //yanjia_param.Child = _self.param.ChildAges.length;
            yanjia_param.ChildAges = _self.param.ChildAges;
            //yanjia_param.FlightGuid = $(".box-fly").attr("data-resourceid");
            //yanjia_param.IsDirectFlight = $(".box-fly").attr("data-isdirectflight");
            $(".J_booking").html("正在跳转中...");
            yanjia_param.Flights = bookParam.Flights;
            yanjia_param.Hotels = bookParam.Hotels;
            yanjia_param.SearchType = 1;
            if (_self.param.Insurance) {
                var cancelObj = $(".Cancles-list").find(".others-check").prop("checked");
                var accObj = $(".Accidents-list").find(".others-check");
                if (accObj) {
                    for (var i = 0; i < accObj.length; i++) {
                        if ($(accObj).eq(i).prop("checked")) {
                            yanjia_param.AccidentInsurance = $(accObj).eq(i).parent().attr("data-id");
                            break;
                        } else {
                            yanjia_param.AccidentInsurance = "";
                        }
                    }
                }
                if (cancelObj) {
                    yanjia_param.CancleInsurance = $(".Cancles-list").find(".other-content").attr("data-id");
                } else {
                    yanjia_param.CancleInsurance = "";
                }
            }
            //国际机票下临时单
            var Guid, ProductId, ProductType, tempParam = {};
            var url = "/intervacation/api/PDynamicPackageFlight/PostFlightTempOrder";
            var thisparam = encodeURIComponent(JSON.stringify(bookParam.Flights));
            $.ajax({
                url: url,
                type: 'post',
                data: "param=" + thisparam,
                dataType: 'json',
                success: function (data) {
                    if (data.Data.IsSuccess == true) {
                        _self.checkPrice(yanjia_param);
                    } else {
                        var content = '<div class="error-warning fixed-warn"><i></i>' + '机票资源不足，换个机票试试吧' + '<span data-dialog-hide>关闭</span></div>';
                        var config = {
                            content: content,
                            width: 500,
                            title: '',
                            quickClose: true
                        };
                        $dialog.modal(config);
                        window.dialog = $dialog;
                        var thisHeight = $(".J_booking").offset().top - 350;
                        $(".ui_dialog_gp").css('top', thisHeight);
                        $(".J_booking").html("立即预订");
                    }
                }
            });
        });
    },
    //验价
    checkPrice: function (param) {
        var self = this,
            beforeTime = +new Date;
        var url = "/intervacation/api/PDynamicPackageOrder/PostVerifyPriceResult";
        var thisparam = encodeURIComponent(JSON.stringify(param));
        Common.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: "param=" + thisparam,
            timeout: 30000,
            success: function (data) {
                if (data.Data.IsSuccess == true) {
                    var lastTime = (+new Date) - beforeTime;
                    var parser = document.createElement('a');
                    parser.href = url;
                    $("#bookingParam").val(data.Data.Param);
                    var cctParam = $("#cctParam").val();
                    if (cctParam) {
                        var thisCctParam = cctParam;
                        $("#bookingCctParam").val(thisCctParam);
                    }
                    $("#bookingForm").submit();
                    Monitor.stat && Monitor.stat("ajaxTime", {
                        "time": lastTime,
                        "url": url.split("?")[0],
                        "path": "_dujia_dynamicpackageajax_pricecheck.ashx"
                    });
                } else {
                    if (data.Data.FailHotels && data.Data.FailHotels.length > 0) {
                        var content = '<div class="error-warning fixed-warn"><i></i>' + '<span class="warningText">来晚了，您选择的<em>' + data.Data.FailHotels[0].CheckInDate + '</em>入住的酒店<em>' + data.Data.FailHotels[0].Name + '</em>已订光，请更换酒店重新预订</span>' + '<span data-dialog-hide class="cleseHotel">关闭</span></div>';
                    } else {
                        var content = '<div class="error-warning fixed-warn"><i></i>' + data.Data.Message + '<span data-dialog-hide>关闭</span></div>';
                    }
                    var config = {
                        content: content,
                        width: 500,
                        title: '',
                        quickClose: true
                    };
                    $dialog.modal(config);
                    window.dialog = $dialog;
                    var thisHeight = $(".J_booking").offset().top - 350;
                    $(".ui_dialog_gp").css('top', thisHeight);
                    $(".J_booking").html("立即预订");
                }
            },
            error: function () {
                var content = '<div class="error-warning fixed-warn"><i></i>出错啦，刷新下试试吧！<span data-dialog-hide>关闭</span></div>';
                var config = {
                    content: content,
                    width: 500,
                    title: '',
                    quickClose: true
                };
                $dialog.modal(config);
                window.dialog = $dialog;
                var thisHeight = $(".J_booking").offset().top - 350;
                $(".ui_dialog_gp").css('top', thisHeight);
                $(".J_booking").html("立即预订");
            }
        });
    },
};
module.exports = Group;
