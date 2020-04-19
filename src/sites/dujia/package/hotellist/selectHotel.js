var SelectHotel = function() {};
var Common = require("common/0.1.0/index"),
    Monitor = window.Monitor,
    Cal = require("calendar/0.1.1/index"),
    CalDiscount = require("calendar/0.1.1/discount"),
    dialog = require("dialog/0.1.0/index"),
    Share = require("share/0.1.0/index"),
    visa = require("freePackage/visa/0.2.0/index"),
    Packaged = require("freePackage/packaged/0.1.0/index"),
    Transport = require("transport/0.1.0/index"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    hotelListMap = require("modules/googleMap/0.3.0/index"),
    page =  require("freePackage/pager/0.2.2/index");
require("jCarousel/0.1.1/index");
require("abTrip/0.1.0/index");
SelectHotel.prototype = {
    lineId: $("#lineId").val() || "",
    hasSelect:"",
    param: {
        "LineId": $("#lineId").val() || "",
        "CityId": "3187",
        "Adult": 2,
        "ChildAges": [],
        "RoomCount": "1",
        "UserAgent": "",
        "StartDate": "2016-08-01",
        "LineDate": "2016-07-31",
        "Nights": "3",
        "HotelId": "12230",
        "RoomId": "0",
        "RateCode": "CNWNjZTk3NTYzNzRiYWJmOWM4MGNhY2Y",
        "IsDirect": "0",
        "Index": "1",
        "IsConditions": "1",
        "Filtrate": {
            "PageSize": "10",
            "PageIndex": "1",
            "Sort": "0",
            "SortType": "0",
            "Drill": "",
            "Facility": "",
            "Brand": "",
            "SiteSearch": ""
        },
        "SelectInfo": {
            "RoomName": "豪华房",
            "RateName": "",
            "BedType": "",
            "IsInstantAffirm": "0",
            "IsIncludeBreakfast": "1",
            "CancleType": "限时取消",
            "CanclePolicy": "",
            "SupplierId": "4",
            "MinRoomCount": "1",
            "MaxRoomCount": "2",
            "Price": "3103"
        }
    },
    hotelPosition: 0,
    tmpl: {
        hotel: require("./packedhotel.dot"),
        hotelList: require("./hlist.dot"),
        hotelFilter: require("./hfilter.dot"),
        moreHotel: require("./listmorehotel.dot"),
        roomDetail: require("../detail/roomdetail.dot")
    },
    content: {
        flightAndHotel: ".result-info",
        flight: ".J_packedFlight",
        hotel: ".J_packedHotel",
        hotelList: ".J_fp-list",
        filterFlight: ".J_fp-list",
        hotelDetail: ".ui-hotel",
    },
    init: function(cfg) {
        var self = this;
        self._init(cfg);
    },
    _init: function(cfg) {
        this.setSelHelpPack();
        this.initHotelFilter();
        this.initEvent();
        this.moreHotelEve();
        this.mapEvent();
        this.initslider();
        this.mapFollowEvent();
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
    //机加酒自助打包
    setSelHelpPack: function() {
        var packaged = new Packaged();

        packaged.init();
    },
    initEvent: function() {
        var self = this;
        //酒店搜索
        $(document).delegate(".J_searchHotel", "click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = $(this);
            if($(".input-hotel-search").val() == ""){
                $(".J_searchHotel em").addClass('none');
            }else{
                $(".J_searchHotel em").removeClass('none');
            }
            $(".J_hotelStar dd").removeClass('selected');
            $(".J_hotelStar .all-sel ").addClass('selected');
            $(".WeiZhiList>span").removeClass('selectp');
            $(".J_hotelLocation .all-sel").addClass('selected');
            $(".J_hotelFacilities dd").removeClass('selected');
            $(".J_hotelFacilities .all-sel").addClass('selected');
            $(".WeiZhiTabs>span").removeClass('selected').removeClass('J_click');
            $(".WeiZhiList").css('display', 'none');
            self.param.Filtrate.Drill = $(".J_hotelStar").find("dd").eq(0).attr("data-param");
            self.param.Filtrate.Facility = "";
            self.param.Filtrate.SiteSearch = $(".input-hotel-search").val();
            self.initHotelList();
        });
        //清空酒店搜索
        $(document).delegate(".J_searchHotel em", "click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = $(this);
            $('.J_searchHotel em').addClass('none');
            $(".input-hotel-search").val("");
            self.param.Filtrate.SiteSearch = "";
            self.initHotelList();
        });
        //酒店位置tab
        $(document).delegate(".J_flightList .WeiZhiTabs span", "click", function() {
            var _this = $(this),index= 0,oldIndex = 0;
            oldIndex = $(".J_click").index() || 0;
            newindex = _this.index();
            if(_this.hasClass('J_click')){
                $(".WeiZhiTabs span").removeClass('J_click');
                $(".WeiZhiList").slideUp(200);
            }else{
                $(".WeiZhiTabs span").removeClass('J_click');
                _this.addClass('J_click');
                $(".WeiZhiList").eq(oldIndex).slideUp('100',function(){
                    $(".WeiZhiList").eq(newindex).slideDown(200);
                });
            }
        });
        //地铁切换
        $(document).delegate(".J_flightList .J_subWay ul li", "click", function() {
            var _this = $(this),index= 0,oldIndex = 0;
            oldIndex = $(".J_flightList").find(".activeType").index() || 0;
            newindex = _this.index();
            if(_this.hasClass('activeType')){
                return;
            }else{
                $(".J_flightList .J_subWay ul li").removeClass('activeType');
                _this.addClass('activeType');
                $(".J_poiDesc").eq(oldIndex).hide(200);
                $(".J_poiDesc").eq(newindex).show(200);
            }
        });
        //选择酒店位置
        $(document).delegate(".J_flightList .WeiZhiList span", "click", function() {
            var _this = $(this),index = 0,subwayIndex = 0;
            $(".WeiZhiList span").removeClass('selectp');
            _this.addClass('selectp');
            index = parseInt(_this.parents(".J_fp-search").find(".J_click").index());
            subwayIndex = parseInt(_this.parent().index()) - 1;
            $(".J_subWay ul").find("li").removeClass("selected");
            if(_this.parents(".WeiZhiList").hasClass("J_subWay")){
                $(".J_subWay ul").find("li").eq(subwayIndex).addClass("selected");
            }
            $(".WeiZhiTabs span").removeClass('selected');
            $(".WeiZhiTabs span").eq(index).addClass('selected');
            $(".J_hotelLocation .all-sel").removeClass('selected');
            self.param.Filtrate.SiteSearch = _this.attr("data-param");
            self.hotelPosition = _this.attr("data-param");
            self.initHotelList();
        });
        //全部酒店位置
        $(document).delegate(".J_flightList .J_hotelLocation .all-sel", "click", function() {
            var _self = $(this);
            _self.addClass('selected');
            $(".WeiZhiList span").removeClass('selectp');
            $(".WeiZhiTabs span").removeClass('selected').removeClass('J_click');
            $(".WeiZhiList").slideUp(200);
            self.param.Filtrate.SiteSearch = "";
            self.hotelPosition = 0;
            self.initHotelList();
        });
        $(document).delegate(".J_flightList .J_fp-search dd", "click", function() {
            var $this = $(this),
                parent = $(this).parent();
            if ($this.hasClass("selected")) {
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
            }
            if ($this.parent().hasClass("J_hotelStar")) {
                var HotelStar = self.filterFlight($this);
                self.param.Filtrate.Drill = HotelStar;
            }
            if ($this.parent().hasClass("J_hotelScore")) {
                var HotelScore = self.filterFlight($this);
                self.param.Filtrate.Score = HotelScore;
            }
            if ($this.parent().hasClass("J_hotelBrand")) {
                var HotelBrand = self.filterFlight($this);
                self.param.Filtrate.Brand = HotelBrand;
            }
            if ($this.parent().hasClass("J_hotelFacilities")) {
                var HotelFacility = self.filterFlight($this);
                self.param.Filtrate.Facility = HotelFacility;
            }
            self.initHotelList();
        });
        //新增-默认排序
        //排序
        $(document).delegate(".J_flightList .J_fp_sort span", "click", function() {
            var _this = $(this),
                notNeedUpdatestatus = false,
                isSelected = _this.hasClass("selected"),
                isDefaultOrder = _this.hasClass("default-order");
            // if(isSelected && isDefaultOrder){
            //     return;
            // }
            if(!_this.hasClass('J_Orderdefault')||(_this.hasClass('J_Orderdefault')&&!_this.hasClass('selected'))){
                if (!isSelected) {
                    //如果是首次切换到该排序,则不需要更新排序状态
                    notNeedUpdatestatus = true;
                    _this.siblings().removeClass("selected");
                    _this.addClass("selected");
                }
                self.sortFlight(this, notNeedUpdatestatus, true);
                self.initHotelList();
            }
        });
    },
    //地图点击事件
    mapEvent: function() {
        $(document).on("click", ".J_hotel-mapInfo", function() {
            $(".maoBox-bg").removeClass("none");
            $(".mapBox").removeClass("none");
            $(".mapBox").addClass("mapBox-fixed");
            var self = $(this);
            var latPoint = self.data("lat"),
                lngPoint = self.data("lng"),
                name = self.data("name");
            var cfg = {};
            cfg.center = latPoint+","+lngPoint;
            cfg.name = name;
            hotelListMap.initClick(cfg);
        });
        $(document).on("click", ".mapBox-title i", function() {
            $(".maoBox-bg").addClass("none");
            $(".mapBox").removeClass("mapBox-fixed").addClass('none');
            $(".mapBox #map").empty();
            $("#map").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
        });
    },
    sortFlight: function(el, notNeedUpdatestatus, isTriggerBySort) {
        var self = this,
            _this = $(el),
            dataIndex = _this.attr("data-index");
        if (dataIndex === "1") {
            self.sortCommentCtrl(_this, notNeedUpdatestatus);
        } else if (dataIndex === "0") {
            self.sortZhuanCtrl(_this, notNeedUpdatestatus);
        }else if(dataIndex === "2"){
            self.sortDefaultCtrl(_this, notNeedUpdatestatus);
        }else if(dataIndex === "3"){
            self.sortPriceCtrl(_this, notNeedUpdatestatus);
        }
    },
    //按默认排序
    sortDefaultCtrl: function(el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.removeClass("up");
                this.param.Filtrate.Sort = 0;
                this.param.Filtrate.SortType = 1;
            } else {
                el.addClass("up");
                this.param.Filtrate.Sort = 0;
                this.param.Filtrate.SortType = 0;
            }
        } else {
            if (sortAsc) {
                this.param.Filtrate.Sort = 0;
                this.param.Filtrate.SortType = 0;
            } else {
                this.param.Filtrate.Sort = 0;
                this.param.Filtrate.SortType = 1;
            }
        }

    },
    //按评论排序
    sortCommentCtrl: function(el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.removeClass("up");
                this.param.Filtrate.Sort = 2;
                this.param.Filtrate.SortType = 1;
            } else {
                el.addClass("up");
                this.param.Filtrate.Sort = 2;
                this.param.Filtrate.SortType = 0;
            }
        } else {
            if (sortAsc) {
                this.param.Filtrate.Sort = 2;
                this.param.Filtrate.SortType = 0;
            } else {
                this.param.Filtrate.Sort = 2;
                this.param.Filtrate.SortType = 1;
            }
        }

    },
    //按钻级排序
    sortZhuanCtrl: function(el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.removeClass("up");
                this.param.Filtrate.Sort = 1;
                this.param.Filtrate.SortType = 1;
            } else {
                el.addClass("up");
                this.param.Filtrate.Sort = 1;
                this.param.Filtrate.SortType = 0;
            }
        } else {
            if (sortAsc) {
                this.param.Filtrate.Sort = 1;
                this.param.Filtrate.SortType = 0;
            } else {
                this.param.Filtrate.Sort = 1;
                this.param.Filtrate.SortType = 1;
            }
        }
    },
    //按价格排序
    sortPriceCtrl: function(el, notNeedUpdatestatus) {
        var sortAsc = el.hasClass("up");
        if (!notNeedUpdatestatus) {
            if (sortAsc) {
                el.removeClass("up");
                this.param.Filtrate.Sort = 3;
                this.param.Filtrate.SortType = 1;
            } else {
                el.addClass("up");
                this.param.Filtrate.Sort = 3;
                this.param.Filtrate.SortType = 0;
            }
        } else {
            if (sortAsc) {
                this.param.Filtrate.Sort = 3;
                this.param.Filtrate.SortType = 0;
            } else {
                this.param.Filtrate.Sort = 3;
                this.param.Filtrate.SortType = 1;
            }
        }
    },
    filterFlight: function(ele) {
        var dlArr = "";
        $(ele.parent()).find("dd.selected").each(function() {
            var _this = $(this),
                dataParamStr = _this.attr("data-param"),
                param = {};
            if (dataParamStr) {
                try {
                    param = dataParamStr + ",";
                } catch (e) {
                    param = {};
                }
                dlArr += param;
            }
        });
        dlArr = dlArr.slice(0,dlArr.length-1);
        return dlArr;
    },
    initCondition:function(){
        var self = this;
        var HotelStar = self.filterFlight($(".J_hotelStar dd").eq(0));
        self.param.Filtrate.Drill = HotelStar;
        var HotelFacility = self.filterFlight($(".J_hotelFacilities dd").eq(0));
        self.param.Filtrate.Facility = HotelFacility;
        var SiteSearch = $(".WeiZhiList .selectp").attr("data-param") || "";
        self.param.Filtrate.SiteSearch = SiteSearch;
    },
    initHotelList: function(pos) {
        var self = this;
        var _url = self.param;
        var url = "/intervacation/api/PDynamicPackageHotel/PostHotels";
        //var url = "http://djtest.t.ly.com/dujia/AjaxHelper/DynamicPackageAjax.ashx?Type=HotelList";
        self.getData({
            loadDiv: ".J_fp-list",
            url: url,
            param: "param="+encodeURIComponent(JSON.stringify(_url)),
            noresultHtml: '<div class="error-warning"><i></i>很抱歉，没有符合筛选条件的酒店，请重新更换筛选条件。</div>',
            render: function(data) {
                data.LineId = self.lineId;
                $(".J_fp-list").empty();
                data.hotelPosition = self.hotelPosition;
                self.renderList(data, "hotelList");
                self.renderPager({
                    total: data.Data.TotalCount
                });
                self.hotelEvent();
                var hotelCount = data.Data.TotalCount || 0;
                $(".fp-title em").html("共"+hotelCount+"家可选酒店");
                //self.transferTips();
            }
        });
    },
    isSearch: function(){
        var self = this;
        var searchType = parseInt($("#searchType").val());
        if(searchType ==1){
            return true;
        }else{
            return false;
        }
    },

    initHotelFilter: function() {
        var self = this,localArr,index;
        index = $("#hotelIndex").val();
        index = parseInt(index);
        if(product.isvalid==1){
            self.param = product.param;
        }
        var _url = self.param,
            tmpl = self.tmpl;
        var url = "/intervacation/api/PDynamicPackageHotel/PostHotels";
        $.ajax({
            url: url,
            type: 'post',
            data: "param="+encodeURIComponent(JSON.stringify(_url)),
            dataType: 'json',
            beforeSend: function() {
                $(".product-box").html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                $("#hotelMap").css({
                    'visibility': 'hidden',
                    'height': '50px'
                });
                $(".hotelInfo").css('height','180px');
            },
            success: function(data) {
                if(data.Data){
                    data.LineId = self.lineId;
                    html1 = tmpl["hotelFilter"](data);
                    $(".J_hotelFilter").empty().append(html1);
                    $(".J_fp-list").empty();
                    self.renderList(data, "hotelList");
                    self.param.IsConditions = 0;
                    if(data.Code==4000){
                        if(data.Data.Hotels&&data.Data.Hotels.length){
                            for(var i=0;i<data.Data.Hotels.length;i++){
                                if(data.Data.Hotels[i].IsSelected==1){
                                    for(var j=0;j<data.Data.Hotels[i].Rooms.length;j++){
                                        if(data.Data.Hotels[i].Rooms[j].IsSelected==1){
                                            var aa = data.Data.Hotels[i].Name;
                                            var bb = data.Data.Hotels[i].Rooms[j].Name;
                                            self.hasSelect = aa+"_"+bb;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    self.initCondition();
                    self.renderPager({
                        total: data.Data.TotalCount
                    });
                }else{
                    self.renderList(data, "hotelList");
                }
            }
        });
    },
    renderList: function(data, type) {
        var self = this,
            context = $(self.content[type]),
            tmpl = self.tmpl,
            html = tmpl[type](data);
        context.html(html);
        if(data.Code == 4000){
            $("#hotelMap").css({
                'visibility': 'visible',
                'height': 'auto'
            });
            $(".hotelInfo").css('height','auto');
            window.onscroll();
            self.hotelTitleHover();
        }   
        self.hotelEvent();
    },
    renderPager: function(cfg) {
        var self = this,
            _url = this.param,
            total = cfg.total,
            extraUrl = cfg.extraUrl ? "&" + cfg.extraUrl : "",
            url = "/intervacation/api/PDynamicPackageHotel/PostHotels",
            param = $.extend({}, self.param),
            totalPage = Math.ceil(total / 10);
        if (totalPage > 1) {
            delete(param.pageIndex);
            $('#J_hotelPager').page({
                current: 1,
                total: totalPage,
                needFirstAndLast: true,
                pageNoParam: "pageIndex",
                ajaxObj: {
                    url: url,
                    data: "param="+encodeURIComponent(JSON.stringify(_url)),
                    type: 'post',
                    dataType: "json",
                    beforeSend: function() {
                        $(".J_fp-list").html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                        $("#hotelMap").css({
                            'visibility': 'hidden',
                            'height': '50px'
                        });
                        $(".hotelInfo").css('height','180px');
                    },
                    success: function(data) {
                        data.hotelPosition = self.hotelPosition;
                        self.renderList(data, "hotelList");
                        self.hotelEvent()
                    }
                },
                initLoad: false
            });
        } else {
            $("#J_hotelPager").empty();
        }
    },
    getData: function(cfg) {
        var self = this,
            url = cfg.url,
            noresultHtml = cfg.noresultHtml,
            loadDiv = cfg.loadDiv,
            param = cfg.param;
        var _param = $.extend({}, self.param, param);
        $.ajax({
            url: url,
            dataType: "json",
            type: 'post',
            data: param,
            beforeSend: function() {
                $(loadDiv).html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                $("#hotelMap").css({
                    'visibility': 'hidden',
                    'height': '50px'
                });
                $(".hotelInfo").css('height','180px');
            },
            success: function(data) {
                var hotel, str;
                var hotelArr = [];
                if (data) {
                    //data = (cfg.deal && cfg.deal.call(self,data));
                    if (cfg.render) {
                        cfg.render.call(self, data);
                    }
                } else {
                    if (noresultHtml) {
                        $(loadDiv).html(noresultHtml);
                    }
                }
            },
            error: function() {}
        });
    },
    moreHotelEve:function(){
        var self = this;
        var isrun = false,hasrun = false;
        //非已选的查看房型
        $(document).on("click", ".J_flightList .J_more", function() {
            var _this = $(this),_url={};
            var tmpl = self.tmpl,roomTypeBox = _this.siblings('.roomType-box');
            if (_this.hasClass("unfold")) {
                if(!_this.hasClass('hasClick')){
                    if(!isrun){
                        isrun = true;
                        _this.html("加载中<i></i>");
                        var $hotel =_this.parent().parent();
                        var postHotelData = $hotel.attr("data-hotelParam");
                        postHotelData = JSON.parse(decodeURIComponent(postHotelData));
                        _url = {
                            "LineId": self.param.LineId,
                            "LineDate": $hotel.attr("data-startdate"),
                            "SelectHotel": product.SelectHotel,
                            "Adult": self.param.Adult,
                            "ChildAges": self.param.ChildAges,
                            "RoomCount": self.param.RoomCount,
                            "Hotel": postHotelData
                        };
                        if(self.isSearch()){
                            _url.SearchType = 1;
                        }
                        var url = "/intervacation/api/PDynamicPackageHotel/PostHotelRooms";
                        $.ajax({
                            url: url,
                            type: 'post',
                            data: 'param=' + encodeURIComponent(JSON.stringify(_url)),
                            dataType: 'json',
                            success: function (data) {
                                roomTypeBox.removeClass('none');
                                _this.removeClass("unfold").addClass("fold").addClass('hasClick');
                                _this.html("收起房型<b></b>");
                                var html1 = tmpl["moreHotel"](data);
                                roomTypeBox.empty().append(html1);
                                roomTypeBox.find(".t-hotel").removeClass('none');
                            },
                            complete: function () {
                                isrun = false;
                            }
                        });
                    }
                }else{
                    roomTypeBox.removeClass('none');
                    _this.removeClass("unfold").addClass("fold").addClass('hasClick');
                    _this.html("收起房型<b></b>");
                }
            } else {
                _this.removeClass("fold").addClass("unfold");
                _this.html("查看房型<b></b>");
                roomTypeBox.addClass('none');
            }
        });
        //已选的查看房型
        $(document).on("click", ".J_flightList .J_fmore", function() {
            var _this = $(this);
            var tmpl = self.tmpl,roomTypeBox = _this.siblings('.roomType-box');
            if (_this.hasClass("unfold")) {
                if(!_this.hasClass('hasClick')){
                    if(!hasrun){
                        hasrun = true;
                        _this.html("加载中<i></i>");
                        var $hotel =_this.parent().parent();
                        var postHotelData = $hotel.attr("data-hotelParam");
                        postHotelData = JSON.parse(decodeURIComponent(postHotelData));
                        _url = {
                            "LineId": self.param.LineId,
                            "LineDate": $hotel.attr("data-startdate"),
                            "SelectHotel": product.SelectHotel,
                            "Adult": self.param.Adult,
                            "ChildAges": self.param.ChildAges,
                            "RoomCount": self.param.RoomCount,
                            "Hotel": postHotelData
                        };
                        if(self.isSearch()){
                            _url.SearchType = 1;
                        }
                        var url = "/intervacation/api/PDynamicPackageHotel/PostHotelRooms";
                        $.ajax({
                            url: url,
                            type: 'post',
                            data:'param=' + encodeURIComponent(JSON.stringify(_url)),
                            dataType: 'json',
                            success: function (data) {
                                _this.removeClass("unfold").addClass("fold").addClass('hasClick');
                                _this.html("收起房型<b></b>");
                                roomTypeBox.find('.hotelbox1').addClass('none');
                                roomTypeBox.find('.hotelbox2').removeClass('none');
                                var html1 = tmpl["moreHotel"](data);
                                roomTypeBox.find('.hotelbox2').empty().append(html1);
                            },
                            complete: function () {
                                hasrun = false;
                            }
                        });
                    }
                }else{
                    _this.removeClass("unfold").addClass("fold").addClass('hasClick');
                    _this.html("收起房型<b></b>");
                    roomTypeBox.find('.hotelbox1').addClass('none');
                    roomTypeBox.find('.hotelbox2').removeClass('none');
                }

            } else {
                _this.removeClass("fold").addClass("unfold");
                _this.html("查看房型<b></b>");
                roomTypeBox.find('.hotelbox1').removeClass('none');
                roomTypeBox.find('.hotelbox2').addClass('none');
            }
        });
    },
    hotelEvent:function(){
        $(".input-hotel-search").keypress(function(event){
                if(event.keyCode == 13){
                $(".J_searchHotel").click();
                }
        });
        //变换房间数
        var self = this;
        $(".back-page").click(function(){
            if(product.Data && product.Data.EndUrl){
                var url = product.Data.EndUrl;
                var cctParam = $("#cctParam").val();
                if(cctParam){
                    $("#fromCctParam").val(cctParam);
                }
                var thisparam = encodeURIComponent(JSON.stringify(product.Data));
                $("#hotelForm").attr('action', url);
                $("#productParam").val(thisparam);
                $("#hotelForm").submit();
            }else{
                window.history.go(-1);
            }
        });
        $(document).on('click', ".btn-closeCheckIn", function() {
            $(".boxH1").addClass('none');
        });
        $(document).on('click', ".name-room", function() {
            var _this = $(this),tmpl=self.tmpl,html="";
            $(".boxH1").addClass('none');
            var $li = _this.parent().parent().parent().parent();
            if($li.parent().parent().parent().hasClass('hotelbox2')){
                var $hotel = $li.parent().parent().parent().parent().parent().parent();
            }else{
                var $hotel = $li.parent().parent().parent().parent().parent();
            }
            if(!_this.hasClass('haschlick')){
                _this.addClass('haschlick');
                if($hotel.attr("data-isdirect")==0){
                    var _html1='<div class="boxH1"><div class="data-loading"><i class="btn-closeCheckIn"></i><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
                    $li.append(_html1);
                    var _url ={
                                "LineId": self.param.LineId,
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
                        if(self.isSearch()){
                            _url.SearchType = 1;
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
                }else{
                    var html1='<div class="boxH1">'
                                +'<div class="CheckIn-box CheckIn-sbox">'
                                +'<div class="CheckIn-box-title"> <span class="nohotel-title"></span> <i class="btn-closeCheckIn"></i> </div>'
                                +'<div class="content-checkIn clearfix">'
                                    +'<div class="noroom"><i></i><span>很抱歉，暂无该房型信息</span></div>'
                                +'</div></div></div>';
                    $li.append(html1);
                    $li.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                }
            }else{
                $li.find('.boxH1').removeClass('none');
            }
        });
        $(".roomSelect").change(function() {
            var _this = $(this),signleSum,defaultSum,singlePrice,diffPrice,chajia,newprice,priceHtml;
            var $selectLi = _this.parent().parent().parent().parent().parent().parent();
            signleSum = _this.val();
            defaultSum = $selectLi.attr("data-defnum");
            singlePrice = $selectLi.attr("data-price");
            diffPrice = $selectLi.attr("data-difpri");
            chajia = (parseInt(signleSum)-parseInt(defaultSum))*parseInt(singlePrice);
            newprice = chajia+parseInt(diffPrice);
            if(newprice>0){
                priceHtml = "差价：+ ¥"+Math.abs(newprice).toString();
            }else{
                priceHtml = "<i>差价：- ¥"+Math.abs(newprice).toString()+"</i>";
            }
            _this.parent().parent().siblings(".hotel-diffPri").find('.fp-fee-add').html(priceHtml);
        });
        $(document).on('click', ".btn-choice-flight", function() {
            var _this = $(this),localArr;
            var hotelSum = 0,
                hotelPrice = 0,
                signleSum = 0,
                siglePrice = 0,
                roomPrice = 0,
                allPrice = 0;

                var $selectli = _this.parent().parent().parent().parent().parent();
                if($selectli.parent().parent().parent().hasClass('hotelbox2')){
                    var $selectHotel = $selectli.parent().parent().parent().parent().parent().parent();
                }else{
                    var $selectHotel = $selectli.parent().parent().parent().parent().parent();
                }

                $(".roomType-box li").removeClass('hotel-has-select');
                $selectli.addClass('hotel-has-select');
                var index = $("#hotelIndex").val();
                index = parseInt(index);
                var RoomParam = $selectli.attr("data-RoomParam");
                var hotelParam = $selectHotel.attr("data-hotelParam");
                hotelParam = JSON.parse(decodeURIComponent(hotelParam));
                RoomParam = JSON.parse(decodeURIComponent(RoomParam));
                hotelParam.IsSelected = 1;
                RoomParam.IsSelected=1;
                RoomParam.Rates[0].IsSelected=1;
                RoomParam.Rates[0].DifferencePrice=0;
                hotelParam.Rooms = [];
                hotelParam.Rooms.push(RoomParam);
                product.Data.Hotels[index] = hotelParam;
                var cctParam = $("#cctParam").val();
                if(cctParam){
                    $("#fromCctParam").val(cctParam);
                }
                var url = product.Data.EndUrl;
                var thisparam = encodeURIComponent(JSON.stringify(product.Data));
                $("#hotelForm").attr('action', url);
                $("#productParam").val(thisparam);
                $("#hotelForm").submit();
        });
        $(".back-cho").click(function(){
            var url = product.Data.EndUrl;
            var cctParam = $("#cctParam").val();
            if(cctParam){
                $("#fromCctParam").val(cctParam);
            }
            var thisparam = encodeURIComponent(JSON.stringify(product.Data));
            $("#hotelForm").attr('action', url);
            $("#productParam").val(thisparam);
            $("#hotelForm").submit();
        });
    },
    //地图跟随事件
    mapFollowEvent: function(){
        $("#followFloat").on("click",function(){
            $(this).toggleClass("J_follow");
            var $H = $(".hotelInfo").offset().top + 30;
            if($(window).scrollTop() >= $H){
                $("#hotelMap").toggleClass("J_fixed");
            }
        });
    },
    //酒店Hover
    hotelTitleHover: function(){
        $(".fp-item").off("mousemove").on("mousemove", function () {
            $(this).addClass("fp-itemActive");
            var index = parseInt($(this).index());
            if (window.MyHotelListMap != undefined) {
                window.MyHotelListMap.mouseoverFun(index, window.MyHotelListMap.MarkLists[index], 'noshowmyMapTip');
            }
        });
        $(".fp-item").off("hover").hover(function () {
            $(this).addClass("fp-itemActive");
            var index = parseInt($(this).index());
            if (window.MyHotelListMap != undefined) {
                window.MyHotelListMap.mouseoverFun(index, window.MyHotelListMap.MarkLists[index], 'noshowmyMapTip');
            }
            //$(this).parents(".HotelHead").find(".orderNumber").addClass("orderNumberActive");

        }, function () {
            $(this).removeClass("fp-itemActive");
            var index = parseInt($(this).index());
            //$(this).parents(".HotelHead").find(".orderNumber").removeClass("orderNumberActive");
            if (window.MyHotelListMap != undefined) {
                window.MyHotelListMap.mouseoutFun(index, window.MyHotelListMap.MarkLists[index]);
            }
        });
    }
};

window.onscroll=function(){
    var points = hotelIsShowEvent();
    if(points && points.length){
        if (window.MyHotelListMap && window.MyHotelListMap != undefined &&window.MyHotelListMap.InitMarkers && window.MyHotelListMap.InitMarkers != undefined) {
            window.MyHotelListMap.InitMarkers(points);
        }else{
            hotelListMap.init(points);
        }
    }
    var $H = $(".hotelInfo").offset().top + 30;
    var $L = $(".J_fp-list").offset().left + $(".J_fp-list").width() - $(window).scrollLeft();
    if($("#followFloat").hasClass("J_follow")){
        if($(window).scrollTop() >= $H){
            $("#hotelMap").addClass("J_fixed");
            $("#hotelMap").css('left',$L);
            var $T = -30;
            if($(window).scrollTop() >= $(document).height() - $("#footer").height() - $("#hotelMap").height() - 40){
                $T = $(document).height() - $(window).scrollTop() - $("#footer").height() - $("#hotelMap").height() - 130;
            }
            $("#hotelMap").css('top',$T);
        }else{
            $("#hotelMap").removeClass("J_fixed");
        }
    }

}
window.onresize = function(){
    window.onscroll();
}
function hotelIsShowEvent(){
    var points = [];
    $('.fp-item').each(function(i){
        var offsetTop = $(this).offset().top;
        var pianyi = offsetTop - getScrollTop();
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var hotelParam = decodeURIComponent($(this).attr('data-hotelParam'));
        if(hotelParam){
            hotelParam = JSON.parse(hotelParam);
        }else{
            return;
        }
        points.push({
            index: i,
            Longitude: parseFloat(hotelParam.Longitude),
            Latitude: parseFloat(hotelParam.Latitude),
            name: hotelParam.Name,
            englishname: hotelParam.EnglishName,
            isShow: pianyi < h && pianyi > -$(this).height(),
            hotelPic: hotelParam.CoverImg,
            hotelScore: hotelParam.Score,
            hotelStar: hotelParam.Drill,
            hotelAddress: hotelParam.Address
        });
    })
    return points;
}
function getScrollTop(){
    return ('pageYOffset' in window) ? window.pageYOffset
        : document.compatMode === "BackCompat"
        && document.body.scrollTop
        || document.documentElement.scrollTop;
}
module.exports = new SelectHotel();
