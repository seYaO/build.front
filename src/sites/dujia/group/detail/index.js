var Group = function() {};
var initTemplateId = 0, initTempViewId = 0;
var Common = require("common/0.1.0/index"),
    Calendar = require("calendar/0.3.2/index"),
    ScrollSpy = require("scrollspy/2.0.0/index"),
    dialogVisa = require("dialog/0.1.0/index"),
    dialog = require("dialog/0.2.0/dialog"),
    Share = require("share/0.1.0/index"),
    visa = require("visa/0.2.0/index"),
    Route = require("route/0.3.0/index"),
    Comments = require("comment/0.3.0/index"),
    Consign = require("./views/consignInfo.dot"),
    Transport = require("transport/0.1.0/index"),
    downloadInfo = require("./views/downloads.dot"),
    tplShopCity = require('./views/tplShopCity.dot'),
    tplShopList = require('./views/tplShopList.dot'),
    wanleTime = require('./views/wanleTime.dot'),
    tplproandcity = require('./views/tplproandcity.dot'),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    tmplVisaInfo = require("./views/visaInitInfo.dot"),
    Track = require("intellSearch/0.2.1/track"),
    Timer = require("timer/0.2.0/pc");
require("abTrip/0.1.0/index");
require("jCarousel/0.2.0/index");
require("lazyload/0.1.0/index");
window.fzHost = "";
var Jiangjia = require("priceinform/0.1.0/index");
var $dialog3 = new dialog({
    skin: 'default',
    template: {
        tooltip: {
            width: '430px'
        }
    }
});
var $dialog2 = new dialogVisa({
    skin: 'default',
    template: {
        tooltip: {
            width: '430px'
        }
    }
});
var $obj;
var trc,mailconfig = "";
Group.prototype = {
    param: {
        lineId: $("#hidLineId").val(),
        playDays: $("#hidPlayDays").val(),
        serialId: $("#hidSerialId").val(),
        departureCity: $("#hidDepartureCity").val(),
        departureCityId: $("#hidDepartureCityId").val(),
        needAdd: 0,
        unbindFlag: true,
        unbindFlag2: true,
        unbindFlag3: true,
    },
    host: window.host || "",
    init: function(cfg) {
        trc = new Track({
            autoExtend: false,
            initdata: {
                locCId: $("#test").val() || "321",
                resId: $("#HidLineid").val() || "",
                pageid: "search",
                moduleid: "/line/detail",
                pjId: "2006",
                jpTp: "0", //0 详情 1 列表 2 活动
                ab: "0", //0 老接口 1 新接口
                isDetailShow: true
            }
        });
        trc.triggerEvent("/show", {});

        var self = this;
        // if (cfg && cfg.isFangZhua) {
        //     self.host = "http://irondome.ly.com";
        //     $.td(function() {
        //         self._init(cfg);
        //     })
        // } else {
            self._init(cfg);
        // }
    },
    _init: function(cfg) {
        this.initEv();
        this.imgLoad();
        this.initCalendarAll();
        this.initCommentAll();
        this.numCountEvent();
        this.visaImportTipEv();
        this.dealPriceData();
        this.initPreferential();
        // this.initScrollSpy();
        this.initShare();
        this.initCountTime();
        this.initTopComment(); //顶部点评
        this.initCollect();
        this.hangsiClick();
        this.hangsiClickOut();
        this.initSlider();
        this.mailDialog();
        this.visaEventDeal();

        //降价通知
        $.extend(cfg, {
            ele: '.inform',
            getPrice: function() {
                return $(".declare-box.price").find("strong").text();
            },
            getLineID: function() {
                return $("#hidLineId").val();
            }
        });
        Jiangjia.init(cfg);



        //联运线路
        if (parseInt($("#hidIsTransport").val()) === 1) {
            this.initTransport();
        }

        if (!$.trim($("#J_routeSummary").html())) {
            Route.updateTop("#J_routeSummary");
        }

        if ($('html').hasClass('theme')) {
            setTimeout(this.backgroundPic, 1000);
        }

    },
    imgLoad: function () {
        $(".J_mainPic, .hotel-detail #focusPic, .photo-mslide img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "640x360");
            $(item).attr("data-img", imgUrl);
        });
        $(".J_carouselWrap img, .icons-managerhd img, .comm-img img, .comm-user img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "90x90");
            $(item).attr("data-img", imgUrl);
        });
        $(".imgs-box img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "640x360");
            $(item).attr("data-img", imgUrl);
        });
        if (self.isInit) {
            var imgList = $(".J_mainPic, .J_carouselWrap img, .imgs-box img, .icons-managerhd img, .comm-content .comm-img img, .hotel-detail #focusPic, .photo-mslide img, .comm-user img").not("[data-img-loaded]");
            $("body").trigger("addElements", imgList);
        } else {
            $(".J_mainPic, .J_carouselWrap img, .imgs-box img, .icons-managerhd img, .comm-content .comm-img img, .hotel-detail #focusPic, .photo-mslide img, .comm-user img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            self.isInit = true;
        }
    },
    getUser: function() {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    initSlider: function() {
        var userid = this.getUser();
        var slider = new Slidertoolbar({
            header: {
                icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
                tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/1mNTl0.jpg"></a>'
            },
            topMenu: [{
                icon: '<a href="http://member.ly.com/center"><div class="ico c-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a href="http://member.ly.com/center/favorites"><div class="ico c-3"></div></a>',
                tooltips: '<a href="http://member.ly.com/center/favorites"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a class="ico c-2"></a>',
                tooltips: '<a><span class="ico-title"><b class="J_tel"></b><i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="//livechat.ly.com/out/guest?p=7&PageID=7001"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="//livechat.ly.com/out/guest?p=7&PageID=7001"><span class="ico-title">在线客服<i></i></span></a>',
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
            pageName: "出境详情页",
            toTop: true,
            skin: 'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="http://member.ly.com/center"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
        this.getServerNumber();
    },
    //获取电话号码
    getServerNumber: function() {
        var url = "/dujia/ajaxcall.aspx?type=GetTel400";
        $.ajax({
            url: url,
            success: function(data) {
                $(".J_tel").html(data.slice(1, -1));
                if($(".J_Tel").length != 0){
                    $(".J_Tel").html(data.slice(1, -1));
                }
            },
            error: function() {
                Monitor.log("获取服务器号码失败" + url, "getServerNumber");
            }
        });
    },
    /**
     * @description 点评同步说明,顶部点评同步显示；底部点评首屏同步
     * */ 
    // 点评
    initCommentAll: function(){
        var self = this;
        self.commentModule = new Comments({
            host: fzHost || "",
            mainTitle: $("#hidTitle").val() || "",
            isTheme :!!$("#isTheme").val(),
        });
    },
    /**
     * @desc 更新顶部的点评
     */
    initTopComment: function() {
        var self = this,
            productType = 0,
            local = parseInt($("#LineProperty").val(),10),
            str = parseInt($("#prop").val(),10);
        if(str === 1){
            if (local === 1) {
                productType = 1;
            } else {
                productType = 13;
            }
        }else if(str === 3){
            productType = 3;
        }
        var comment = self.commentModule;
        comment.initTop({
            topEl: $(".J_TopComment"),
            topParam: {
                productId: self.param.lineId,
                productType: productType,
                tagId: 1,
                sortType: 0,
                pageSize: 20
            }
        });
    },
    //初始化顶部行程推荐
    initTopTravel:function () {
        var topTravel = $("#J_routeSummary");
        if(topTravel){
            var _height = topTravel.height();
            if(_height>=80){
                $(".J-btnTravel").css({"bottom":0,"background-color":"#fff"});
                $(".J-btnTravel").html("...查看详情");
            }
        }
    },
    /**
     * @desc 价格日历
     */
    initCalendarAll: function() {
        var self = this;
        var ak = Common.getParamFromUrl("ak") || "";
        if(Common.getParamFromUrl("dk")){
            var dk = Common.getParamFromUrl("dk");
        }else{
            var dk = '';
        }
        
        Common.ajax({
            url: window.host + "/intervacation/api/PCalenderPage/GetCalenderPriceAllDay?lineId=" + self.param.lineId + "&ak=" + ak + "&dk=" + dk,
            dataType: "jsonp",
            success: function(data) {
                if (data && data.Data && data.Data.data) {
                    var calData = data.Data.data;
                    if (calData.PriceList && calData.PriceList.length == 0) {
                        $(".J_OrderBtn").addClass("endTime").html("已售完");
                        $(".J_price-submit").addClass("endTime").html("已售完&gt;&gt;");
                    }
                    var conf = {
                        "calData": calData,
                        "callback": function(dateS, elemData, residualCount) {
                            $("html,body").animate({scrollTop: $(".mCal").offset().top}, 300);
                            $('#hidLineDate').val(dateS);
                            self.handleVisaTempId(dateS);
                            self.initPackage(dateS, elemData, residualCount);
                        }
                    };
                    //获取签证需要的所有团期
                    self.handleVisaCal(calData);
                    //下单页回退逻辑时触发
                    if($('#hidsbuItems').val() != ''){
                        var sbuItems = JSON.parse($('#hidsbuItems').val());
                        self.getBackResidualCount(sbuItems.lineDate,calData);
                        $('#hidLineDate').val(sbuItems.lineDate);
                        conf.curDate = sbuItems.lineDate;
                    }
                    Calendar.init(conf);
                }
            }
        });
    },
    handleVisaCal:function (data) {
        var self = this;
        var _data = data.PriceList,
            lowestDate = self.handleDate(data.LowestDate);
        var _dataArr = [];
        var travelTips = window.data.TravelTips,
            visaTempIdList = travelTips.VisaTemplateIdList,
            visaInfoNewList = window.data.VisaInfoNewList;
        var bool = true;
        if(visaTempIdList && visaTempIdList.length){
            //默认是选取最低团期
            visaTempIdList.forEach(function(date){
                var templateDate = self.handleDate(date.YunVisaTemplateDate);
                if(templateDate == lowestDate){
                    bool = false;
                    travelTips.VisaTemplateId = date.VisaTemplateId;
                    travelTips.VisaInterviewTemplateId = date.VisaInterviewTemplateId;
                    $("#visaInfo").append(tmplVisaInfo(travelTips));
                }
            });
        }
        if (bool) {
            $("#visaInfo").append(tmplVisaInfo(visaInfoNewList));
        }
        _data.forEach(function (item) {
            if(item.Date){
                _dataArr.push(item.Date.split("T")[0]);
            }
        });
        $("#formVisaTravelDates").val(_dataArr);
        visa(fzHost || host, true);
    },
    //处理云签获取签证模板id
    handleVisaTempId: function(date){
        var self = this;
        var choseDate = self.handleDate(date);
        var travelTips = window.data.TravelTips,
            visaTempIdList = travelTips.VisaTemplateIdList,
            visaInfoNewList = window.data.VisaInfoNewList,
            visaInfo = $("#visaInfo"),
            visaContent = $(".visa-content");
        var hasVisaInfo = true;
        if(visaTempIdList && visaTempIdList.length){
            visaTempIdList.forEach(function(date){
                var date1 = self.handleDate(date.YunVisaTemplateDate);
                if(date1 == choseDate){
                    hasVisaInfo = false;
                    if ($.trim(visaContent.text()) !== "暂无签证信息") {
                        initTemplateId = visaContent.attr("data-templateid");
                        initTempViewId = visaContent.attr("data-viewid");
                        if (!(initTemplateId == date.VisaTemplateId && initTempViewId == date.VisaInterviewTemplateId)) {
                            visaContent.attr("data-templateid", date.VisaTemplateId);
                            visaContent.attr("data-viewid", date.VisaInterviewTemplateId);
                            visa(fzHost || host, false);
                        }
                    } else {
                        travelTips.VisaTemplateId = date.VisaTemplateId;
                        travelTips.VisaInterviewTemplateId = date.VisaInterviewTemplateId;
                        visaContent.parent()[0].removeChild(visaContent[0]);
                        visaInfo.append(tmplVisaInfo(travelTips));
                        visa(fzHost || host, false);
                    }
                }
            });
        }
        if (hasVisaInfo) {
            if (!visaInfoNewList.length) {
                visaContent.parent()[0].removeChild(visaContent[0]);
                visaInfo.append(tmplVisaInfo([]));
            }
        }
    },
    // 签证提醒事件
    visaImportTipEv:function(){
        var self = this;
         $(document).on("click",'.tip_import a',function () {
            var el =$(this),
                content = el.parents("li");
            if(!content.hasClass("tip_importHover")){
                content.addClass("tip_importHover");
                el.html("收起");
            }else{
                content.removeClass("tip_importHover");
                el.html("展开");
            }
        });
    },
    handleDate: function(date){
        var newdate = "";
        var bb = date.split("-");
        if(bb.length == 3){
            newdate = bb[0]+"-"+(parseInt(bb[1]) >=10 ? parseInt(bb[1]) : "0" + parseInt(bb[1])) + "-" + (parseInt(bb[2]) >= 10 ? parseInt(bb[2]) : "0" + parseInt(bb[2]));
        };
        return newdate;
    },
    /**
     * @desc 下单页回退终页时获取余位
     * @param date(回退出团日期) data(价格日历数据源)
     */
    getBackResidualCount: function (date,data) {
        var self = this;
        var pricelist = data.PriceList;
        var _PriceList = pricelist.filter(function(item){
            return (item.Date.indexOf(date)>-1)
        });
        var residualCount = _PriceList[0].ResidualCount;
        self.initBackSbu(residualCount,_PriceList[0]);
    },
    /**
     * @desc 初始化下单页回退终页
     */
    initBackSbu: function (residualCount,data) {
        if($('#hidsbuItems').val() != ''){
            var self = this;
            var safeNum = 0;
            var sbuItems = JSON.parse($('#hidsbuItems').val());
            var sbuInfoLists = sbuItems.sbuInfo;
            var safeInfo = sbuItems.safeInfo;
            //渲染成人儿童
            var lineInfo = sbuItems.lineInfo;
            var _pricePerson = lineInfo.filter(function(index){
                return (index.PriceType == 1)
            });
            safeNum += parseInt(_pricePerson[0].PriceCount);
            $('.J_picker-adult').val(_pricePerson[0].PriceCount);
            $('.J_picker-adult').parent().next().text('￥'+_pricePerson[0].DisCountedPrice+'/人起');
            $('.J_picker-adult').parent().next().attr('data-price',_pricePerson[0].DisCountedPrice);
            $('.J_picker-adult').parent().next().attr('data-pricetype',_pricePerson[0].PriceType);
            $('.J_picker-adult').parent().next().attr('data-priceid',_pricePerson[0].PriceId);
            var _isChild = data.Prices.filter(function(index){
                return (index.PriceType == 8)
            });
            var isChild = lineInfo.filter(function(index){
                return (index.PriceType == 8)
            });
            if(_isChild.length == 0){
                $('.isChild').addClass('none');
                $('.noChild').removeClass('none');
            }else{
                if(isChild.length == 0){
                    safeNum += parseInt(0);
                    $('.J_picker-child').val(0);
                }else{
                    safeNum += parseInt(isChild[0].PriceCount);
                    $('.J_picker-child').val(isChild[0].PriceCount);
                }
                $('.J_picker-child').parent().next().text('￥'+_isChild[0].DisCountedPrice+'/人起');
                $('.J_picker-child').parent().next().attr('data-price',_isChild[0].DisCountedPrice);
                $('.J_picker-child').parent().next().attr('data-pricetype',_isChild[0].PriceType);
                $('.J_picker-child').parent().next().attr('data-priceid',_isChild[0].PriceId);
            }
            $('.J_picker-input').attr('max',(residualCount == 0?20:residualCount));

            //获取单房差等
            var calParam = [];
            for(var i = 0;i<data.Prices.length;i++){
                if(data.Prices[i].PriceType != 1 && data.Prices[i].PriceType != 8){
                    data.Prices[i].ResidualCount = residualCount;
                    calParam.push(data.Prices[i])
                }
            }
            var prices = {"paramData": calParam};
            var _residualCount = {"residualCount":residualCount};
            $("#J_startTime").val(sbuItems.lineDate);
            var param = {
                lineId:$("#hidLineId").val(),
                lineDate:sbuItems.lineDate,
                serialId:$('#hidSerialId').val(),
                playDays:$('#hidPlayDays').val(),
                cityId:$('#hidDepartureCityId').val(),
                priceId:_pricePerson[0].PriceId
            }
            var _url = window.host+'/intervacation/api/SBUPackage/GetSbuProductList?' +
                'lineId='+param.lineId+'&lineDate='+param.lineDate+'&serialId='+param.serialId+'&playDays='+param.playDays+'&priceId='+param.priceId+'&cityId='+param.cityId+'';
            Common.ajax({
                url: _url,
                dataType: 'jsonp',
                beforeSend: function () {
                    $(".J_price-submit,.J_OrderBtn").addClass("endTime");
                    $('.resource-info-contain').addClass('none');
                    $('.price-contain .J_sumPrice').addClass('none');
                    $(".loading-box").html("<div class='data-loading'><div class='bg'></div><span>请稍候,正在为您加载...</span></div>");
                    var _leftBtn = $('.J_picker-leftBtn'),
                        _rightBtn = $('.J_picker-rightBtn');
                    _leftBtn.addClass("endTime");
                    _rightBtn.addClass("endTime");
                    _leftBtn.each(function (index, item) {
                        if (!$(item).hasClass('peopleNum-disPicker-leftBtn') && index !== 0) {
                            $(item).addClass('peopleNum-disPicker-leftBtn');
                        }
                    });
                    _rightBtn.each(function (index, item) {
                        if ($(item).hasClass('peopleNum-disPicker-rightBtn')) {
                            $(item).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                        }
                    });
                },
                success: function (data) {
                    if (data) {
                        $(".data-loading").remove();
                        $(".J_price-submit,.J_OrderBtn").removeClass("endTime");
                        $('.J_picker-leftBtn,.J_picker-rightBtn').removeClass("endTime");
                        var lineProperty = $('#LineProperty').val()||"";
                        //跟团不显示航班，酒店
                        if(lineProperty != 1){
                            if(data.Data.flight && data.Data.flight !== null){
                                var flightInfo = require('./views/flightInfo.dot');
                                $('.J_flight-travelInfo').html(flightInfo(data.Data));
                                var isChange = $('.J_flight-travelInfo').attr('isChange');
                                if(isChange == '0'){
                                    $('.flight-invoice').css('margin-top','200px');
                                }else{
                                    $('.flight-invoice').css('margin-top','80px');
                                }
                            }else{
                                $('.J_flight-travelInfo').css("border-bottom","none");
                            }
                            Group.prototype.setHotelInfo(data.Data.hotel);
                        }else{
                            $('.J_flight-travelInfo').css("border-bottom","none");
                            $('#hotelInfo').css("border-bottom","none");
                        }

                        var sbuSource = require('./views/sbusource.dot');
                        $.extend(data.Data, prices);
                        $.extend(data.Data,_residualCount);
                        var insurance = data.Data.product.Insurance.Insurance;
                        var visa = data.Data.product.Visa;
                        var wanLe = data.Data.product.WanLe;
                        var paramData = data.Data.paramData;
                        if(insurance != null || visa != null || wanLe != null || paramData.length != 0){
                            $('.J_sbusource').html(sbuSource(data.Data));
                        }else{
                            $('.J_sbusource').css("border-bottom","none");
                        }
                        //遍历渲染sbu数据
                        $('.J_orderItem').each(function(index,item){
                            var self = this;
                            if($(self).parents('tr').hasClass('J_amusement')){
                                for(var i = 0;i<sbuInfoLists.length;i++){
                                    if(sbuInfoLists[i].PriceId == $(item).attr('data-productid')){
                                        $(item).attr('data-count',sbuInfoLists[i].PriceCount);
                                        $(item).attr('data-time',sbuInfoLists[i].UsingDate);
                                        $(item).attr('data-priceid',sbuInfoLists[i].PriceId);
                                        $(item).parents('.J_resourceBox').find('.J_picker-input').val(sbuInfoLists[i].PriceCount);
                                        $(item).parents('.J_resourceBox').find('.J_resource-data-picker').val(sbuInfoLists[i].UsingDate);
                                        $(item).parents('.J_resourceBox').find('.J_resource-radio').addClass('resource-radio-checked');
                                    }
                                }
                            }else if($(self).parents('tr').hasClass('J_visa')){
                                for(var i = 0;i<sbuInfoLists.length;i++){
                                    if(sbuInfoLists[i].PriceType != ""){
                                        if(sbuInfoLists[i].PriceId == $(item).attr('data-productid') && sbuInfoLists[i].PriceType == 1){
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[0]).attr('data-time',sbuInfoLists[i].UsingDate);
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[0]).attr('data-count',sbuInfoLists[i].PriceCount);
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[0]).attr('data-priceid',sbuInfoLists[i].PriceId);
                                            $($(item).parents('.J_resourceBox').find('.J_picker-input')[0]).val(sbuInfoLists[i].PriceCount);
                                            $($(item).parents('.J_resourceBox').find('.J_resource-data-picker')[0]).val(sbuInfoLists[i].UsingDate);
                                            $($(item).parents('.J_resourceBox').find('.J_resource-radio')[0]).addClass('resource-radio-checked');
                                        }
                                        if(sbuInfoLists[i].PriceId == $(item).attr('data-productid') && sbuInfoLists[i].PriceType == 0){
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[1]).attr('data-time',sbuInfoLists[i].UsingDate);
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[1]).attr('data-count',sbuInfoLists[i].PriceCount);
                                            $($(item).parents('.J_resourceBox').find('.J_orderItem')[1]).attr('data-priceid',sbuInfoLists[i].PriceId);
                                            $($(item).parents('.J_resourceBox').find('.J_picker-input')[1]).val(sbuInfoLists[i].PriceCount);
                                            $($(item).parents('.J_resourceBox').find('.J_resource-data-picker')[1]).val(sbuInfoLists[i].UsingDate);
                                            $($(item).parents('.J_resourceBox').find('.J_resource-radio')[1]).addClass('resource-radio-checked');
                                        }
                                    }
                                }
                            }else{
                                for(var i = 0;i<lineInfo.length;i++){
                                    if(lineInfo[i].PriceId == $(item).attr('data-priceid')){
                                        $(item).attr('data-count',lineInfo[i].PriceCount);
                                        $(item).parents('.J_resourceBox').find('.J_picker-input').val(lineInfo[i].PriceCount);
                                        $(item).parents('.J_resourceBox').find('.J_resource-radio').addClass('resource-radio-checked');
                                    }
                                }
                                for(var i = 0;i<safeInfo.length;i++){
                                    if(safeInfo[i].priceId == $(item).attr('data-priceid')){
                                        $(item).parents('tr').find('.J_resource-radio').removeClass('resource-radio-checked').addClass('resource-radio-normal');
                                        $(item).parents('.J_resourceBox').find('.J_resource-radio').removeClass('resource-radio-normal').addClass('resource-radio-checked');
                                        $(item).parents('tr').find('.J_resource-box').removeClass('none');
                                        $(item).parents('tr').find('.resource-more').removeClass('ui-resource-hide').addClass('ui-resource-show');
                                    }
                                }
                            }
                        })
                        $('.J_safeNum').text(safeNum);
                        $('.J_safeNum').parents('.J_resourceBox').find('.J_orderItem').attr('data-count',safeNum);
                        if ($('.J_feeDes').length != 0) {
                            $('.J_feeDes-box').html($('.J_feeDes').html());
                            $('.J_feeDes-box').parents('.info-module').removeClass('none');
                        } else {
                            $('.J_feeDes-box').parents('.info-module').addClass('none');
                        }
                        if ($('.J_feeItem').length != 0) {
                            $('.J_feeItem-box').html($('.J_feeItem').html());
                            $('.J_feeItem-box').parents('.info-module').removeClass('none');
                        } else {
                            $('.J_feeItem-box').parents('.info-module').addClass('none');
                        }
                        Group.prototype.popoverEvent();
                        Group.prototype.initSbuBtn(residualCount);
                        if(self.param.unbindFlag2){
                            self.param.unbindFlag2 = false;
                            Group.prototype.cuttleEvent();
                        }
                        Group.prototype.resourceInfoEvent();
                        Group.prototype.resourceCountEvent();
                        Group.prototype.priceCountEvent();
                        $('.resource-info-contain').removeClass('none');
                        $('.price-contain .J_sumPrice').removeClass('none');

                        var sbuItem = $('.J_sbusource tr');
                        if (sbuItem) {
                            $(sbuItem[sbuItem.length - 1]).find('.resource-items').removeClass('resource-items');
                        }
                    }
                }
            })
        }
    },
    /**
     * @desc 初始化下单页回退终页时加减按钮状态
     */
    initSbuBtn: function (elem) {

        $('.J_picker-input').each(function(index,item){
            //处理非成人儿童
            if(!$(item).hasClass('J_picker-adult') && !$(item).hasClass('J_picker-child')){
                if(parseInt($(item).val()) >0){
                    $(item).prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                    $(item).next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                }
                if(parseInt($(item).val()) ==0){
                    $(item).prev().removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                    $(item).next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                }else if($(item).attr('max') && $(item).val() == elem){
                    $(item).prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                    $(item).next().removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                }
            }
        });
        var adultNum = 0,childNum = 0,sum = 0;
        if($('.J_picker-adult').length != 0){
            adultNum = $('.J_picker-adult').val();
        }
        if($('.J_picker-child').length != 0){
            childNum = $('.J_picker-child').val();
        }
        sum = parseInt(adultNum)+parseInt(childNum);
        if(sum == elem){
            if(parseInt(adultNum)==1){
                $('.J_picker-adult').prev().removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
            }else{
                $('.J_picker-adult').prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
            }
            $('.J_picker-child').prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
            $('.J_picker-child').next().removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
            
            $('.J_picker-adult').next().removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
        }else{
            if(adultNum == 1){
                $('.J_picker-adult').prev().removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                $('.J_picker-adult').next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
            }else{
                $('.J_picker-adult').prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                $('.J_picker-adult').next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
            }
            if(childNum != 0){
                $('.J_picker-child').prev().removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                $('.J_picker-child').next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
            }else{
                $('.J_picker-child').prev().removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                $('.J_picker-child').next().removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
            }
        }

    },
    /**
     * @desc 邮件弹窗功能
     */
    mailDialog: function() {

        $dialog = new dialog({
            skin: 'skin2'
        });
        var str = "";
        var tabli = $(".J_visaPersonType li")||"";
        var nums = $(".J_renderType").children().length;
        if(!nums){
            tabli.each(function () {
                str += "<label><input type='checkbox' name='visa-type' value=" + $(this).attr('data-persontypeid') + " checked>" + $(this).html() + "</label>";
            });
            $('.J_renderType').html(str);
        }
        mailconfig = {
            content: $('.send-email').html(),
            title: '发送材料到您的邮箱',
            isdrag: false,
            type: 'html'
        };
    },
    /**
     * @desc 获取倒计时所必须要的参数
     * @returns {string}
     */
    getTimerParam: function() {
        //获取url里selltype的值,传入true,表示不区分大小写
        var selltype = Common.getParamFromUrl("selltype", true);
        //由于ak的值里需要区分大小写,不传true
        var ak = Common.getParamFromUrl("ak");
        var activityType = $("#hidActivityType").val();
        if (selltype !== "4") {
            //当selltype和ak都有值时才去返回倒计时的param
            if (selltype && ak) {
                return "&selltype=" + selltype + "&ak=" + ak;
            }
        }
        if (ak) return "&ak=" + ak;
    },
    /**
     * @desc 获取倒计时数据
     */
    getCountDownTimeData: function(callback) {
        var ak = Common.getParamFromUrl("ak") || "";
        var dk = Common.getParamFromUrl("dk") || "";
        var self = this,
            extraUrl = self.getTimerParam() || "",
            url = window.host + "/intervacation/api/CountDown/GetCountDown?siteType=0&lineId=" + self.param.lineId + extraUrl + "&dk=" + dk;
        self._getData(url, callback, true);
    },
    initCountTime: function() {
        var self = this;
        self.initTip();
        self.getCountDownTimeData(function(data) {
            self.initCountTimeInfo.call(self, data);
        });
    },
    initCountTimeInfo: function(data) {
        var self = this;
        var countdownWrap = $(".J_CountDown");
        if (countdownWrap.length && data.Data && data.Data.TimeSpans) {
            countdownWrap.append('<span class="J_CountDownText"></span>');
            var timeSpan = data.Data.TimeSpans,
                dateArr;
            if (timeSpan.type === "4") {
                dateArr = ["2015-01-01", "2015-02-02"];
            } else {
                var start = timeSpan.stime,
                    end = timeSpan.etime;
                if (timeSpan.tolsecondStart) {
                    start = (+new Date()) + (timeSpan.tolsecondStart - 0);
                }else{
                    start = new Date(start).getTime();
                }
                if (timeSpan.tolsecondEnd) {
                    end = (+new Date()) + (timeSpan.tolsecondEnd - 0);
                }else{
                    end = new Date(end).getTime();
                }
                dateArr = [start, end];
            }
            var countdownEl = $(".J_CountDownText");
            if(timeSpan.ProductId && timeSpan.ActivityType =="抢购"){
                self.initTimer(countdownEl, dateArr);
            }
            
        }
    },
    /**
     * @description 初始化下部推荐产品
     */
    initRecomendProduct: function(){
        var self = this;
        var departureCityId = $("#hidDepartureCityId").val()||"",
            destinationCity = $("#hidDestinationCity").val()||"",
            lineId = $("#hidLineId").val()||"";
        var url = window.host +"/intervacation/api/ProductSearch/GetProductListObject?pageType=5&stp=lcCitySort:0;orderCount:1&count=8&lcCity="
            + departureCityId +"&dest="+ encodeURIComponent(destinationCity) +"&lineId="+lineId;

        Common.ajax({
            url: url,
            dataType: 'jsonp',
            success: function (data) {
                if (data && data.Data && data.Data.ProductAndCondition) {
                    var tmpl = require('./views/bottomRecommendProlist.dot');
                    $(".J_recoproduct-list").html(tmpl(data.Data.ProductAndCondition));
                }
                else {
                    $(".J_recoproduct-list").html("<p>无推荐线路!</p>");
                }
            },
            error: function(){
                $(".J_recoproduct-list").html("<p>无推荐线路!</p>");
            }
        });
    },
    /**
     * @desc 获取优惠信息数据
     */
    getPreferentialData: function(callback) {
        var cnuser = $.cookie("cnUser"),
            memberId = /userid=([^&]+)/.exec(cnuser)||"";
        var self = this,
            url = window.host + "/intervacation/api/Preferential/GetDsfDetailPreferential?siteType=2&PublicPlatmentId=1&ProductType=0&PageType=2&ProductId="+ self.param.lineId +"&MemberId="+memberId;
        self._getData(url, callback, true);
    },

    /**
     * @description 初始化优惠信息
     */
    initPreferential: function() {
        var self = this;
        self.getPreferentialData(function(data) {
            self.initPretialInfo.call(self, data);
            self.initScrollSpy();
        });
    },
    /**
     * @description 签证交互
     */
    visaEventDeal: function () {
        var _dialog, _self = $('#show_photo');

        $(document).on('click', '.onjob-sample',function () {
            var urlstr = '',
                txt = '',
                msg = '';
            var url = $(this).attr('data-url');
            if (!url) {
                return;
            }
            ;
            var urllist = url.split(',');
            var txtlist = $(this).attr('data-title').split('&');
            var msglist = $(this).attr('data-content').split('&');
            $.each(urllist, function (i) {
                urlstr = urlstr + '<li><a href="javascript:void(0);"><img src=' + urllist[i].replace('http:','') + '></a></li>';
            });

            $.each(txtlist, function (i) {
                if (i === 0) {
                    txt = txt + '<span>' + txtlist[i] + '</span>';
                } else {
                    txt = txt + '<span class="none">' + txtlist[i] + '</span>';
                }
            });

            $.each(msglist, function (i) {
                if (i === 0) {
                    msg = msg + '<p>' + msglist[i] + '</p>';
                } else {
                    msg = msg + '<p class="none">' + msglist[i] + '</p>';
                }
            });

            _self.find('.photo').append('<a style="float:none" target="_blank" href=' + urllist[0] + '><img id="focusPic" src=' + urllist[0].replace('http:','') + '></a>');
            _self.find('.mslide-panel h3').append(txt);
            _self.find('.mslide-panel .detail').append(msg);
            _self.find('.list ul').html(urlstr);

            var content = _self.find('.mslide-panel').clone(true);
            if (content.length) {
                _dialog = dialogVisa({
                    content: content,
                    tip: true,
                    width: 980,
                    height: 660,
                    padding: 0,
                    className: "comment",
                    zIndex: 10000,
                    onshow: function () {
                        var mslide = content.find(".photo-mslide");
                        var pic = content.find(".photo img");
                        var bigpic = content.find(".photo a[target='_blank']");
                        //seajs.use("jCarousel/0.1.1/index", function (Carousel) {
                        var car = new Carousel(mslide, {
                            canvas: ".list ul",
                            item: "li",
                            circular: false,
                            visible: 6,
                            preload: 0,
                            btnNav: false,
                            btnPrev: ".prev",
                            btnNext: ".next"
                        });
                        var carIndex = 0,
                            calLiLen = car.itemLength;
                        car.on("prevClick", function () {
                            carIndex--;
                            carIndex < 0 && (carIndex = 0);
                            car.li.eq(carIndex).click();
                        });
                        car.on("nextClick", function () {
                            carIndex++;
                            carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                            car.li.eq(carIndex).click();
                        });
                        car.on("itemClick", function (index, node, all) {
                            var self = $(this),
                                title = $(node).parents(".mslide-panel").find("h3"),
                                msg = $(node).parents(".mslide-panel").find(".detail");
                            $(all).removeClass("active");
                            $(node).addClass("active");
                            carIndex = index;
                            $(title).children("span").addClass("none");
                            $($(title).children("span")[carIndex]).removeClass("none");

                            $(msg).children("p").addClass("none");
                            $($(msg).children("p")[carIndex]).removeClass("none");
                            var src = $(node).find("img").attr("src");
                            pic.attr("src", src);
                            bigpic.attr("href", src);
                            content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                        });
                        content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                    },
                    onclose: function () {
                    }
                });
            }
            _dialog.showModal();
        });

        $(document).on("click", ".JJ_close", function () {
            _self.find('.photo img').remove();
            $(_self.find('.mslide-panel h3')).children('span').remove();
            $(_self.find('.mslide-panel .detail')).children('p').remove();
            $(_self.find('.list ul')).children('li').remove();
            _dialog.remove();
        });

        $(document).on("click", ".btn-email", function () {
            $dialog.modal(mailconfig);
        });

        $(document).on("click", ".visaCountry span", function () {
            var self = $(this),
                _index = self.index();
            if(!self.hasClass("cur")){
                $(".visaCountry span").removeClass("cur");
                self.addClass("cur");
            }
            $(".visa-item").addClass("none");
            $($(".visa-item")[_index]).removeClass("none");

            $(".visaInfos").addClass("none");
            $($(".visaInfos")[_index]).removeClass("none");

        });

        //点击发送邮箱按钮事件
        $(document).on('click', '.dialog_modal_gp .send_submit', function() {
            var _modal = $('.dialog_modal_gp');
            var fromTip = _modal.find('.prompt-info'),
                mailval = _modal.find('.email_input'),
                codeval = _modal.find('.code_input'),
                mailbtn = _modal.find('.send_submit'),
                visatype = false;
            mailval.css('color', '#000');
            codeval.css('color', '#000');
            var careerval = [],
                careervalStr = '';
            _modal.find('.visa-dialog label').each(function() {
                if ($(this).children()[0].checked) {
                    careerval.push($($(this).children()[0]).val());
                    visatype = true;
                }
            });
            careervalStr = careerval.join(',');
            if (!visatype) {
                fromTip.text('请至少选择一个材料类型');
                return;
            } else if (!mailval.val()) {
                fromTip.text('请输入邮箱地址');
                return;
            } else if (!fish.valida.email(mailval.val())) {
                fromTip.text('请输入正确的邮箱地址');
                mailval.css('color', 'red');
                return;
            } else if (!codeval.val()) {
                fromTip.text('请输入验证码');
                return;
            }
            mailbtn.text('发送中...');
            mailbtn.attr('disabled', 'disabled');
            var endfun = function() {
                codeval.val('');
                _modal.find('#imgcode').attr('src', window.host + '/dujia/AjaxCallTravel.aspx?type=ValidateCode&amp;' + 'r=' + Math.random());
                mailbtn.text('发送');
                mailbtn.removeAttr('disabled', 'disabled');
            };
            var _url = window.host + '/dujia/AjaxcallTravel.aspx?type=SendVisaEmail' + '&lineId=' + $(".visaInfo ul").attr("data-visaType") + '&mailTo=' + mailval.val() + '&careerType=' + careervalStr + '&checkCode=' + codeval.val();
            $.ajax({
                url: _url,
                dataType: 'jsonp',
                success: function(data) {
                    fromTip.text('');
                    if (data.state === 100) {
                        if (JSON.parse(data.data).No === '100') {
                            fromTip.text('发送成功');
                            endfun();
                        } else if (JSON.parse(data.data).No === '200') {
                            fromTip.text('发送失败');
                            endfun();
                        }
                    } else if (data.state === 200) {
                        if (JSON.parse(data.data).No === '021') {
                            fromTip.text('验证失败');
                            endfun();
                        } else if (JSON.parse(data.data).No === '022') {
                            fromTip.text('验证码不匹配');
                            endfun();
                        } else if (JSON.parse(data.data).No === '023') {
                            fromTip.text('验证失败');
                            endfun();
                        }
                    }
                },
                error: function() {
                    fromTip.text("发送失败");
                    endfun();
                }
            });

        });
    },
    /**
     * @description 初始化优惠渲染
     * @param data
     */
    initPretialInfo: function(data) {
        var self = this;
        if (data && data.Data && data.Data.PreferentialList && data.Data.PreferentialList.length && data.Data.PreferentialList.length != 0) {
            var tmplPreferentialTop = require("./views/preferentialTop.dot");
            var tmplyouhuiTop = tmplPreferentialTop(data.Data.PreferentialList);
            tmplyouhuiTop = tmplyouhuiTop + this.youhuiTopComment() + "</div>";
            $(".J_YouHuiTop").empty().append(tmplyouhuiTop);

            var tmplPreferential = require("./views/preferential.dot");
            var tmplyouhui = tmplPreferential(data.Data.PreferentialList);
            $(".youhui-content").empty().append(tmplyouhui);
            var _con = $(".youhui-content .content-inner")
            _con.each(function(){
                if($(this).height() > 92){
                    $(this).addClass("J_content");
                }else{
                    $(this).next().remove();
                }
            })
            $(".J_more").on("click",function(e){
                e.stopPropagation();
                $(this).prev().toggleClass("J_content");
                $(this).toggleClass("J_content_show");
                if($(this).hasClass("J_content_show")){
                    $(this).find("a").html("收起");
                }else{
                    $(this).find("a").html("展开");
                }
                
            });
        } else {
            $("#youhuiInfo").remove();
            $(".J_YouHuiTop").empty().append("<span class='f-left'>可享优惠：</span>" + this.youhuiTopComment());
            // this.initScrollSpy();
        }
    },
    //点评返现规则外显
    youhuiTopComment: function() {
        /*平台模式隐藏点评奖金*/
        var modelClass = '';
        if (parseInt($("#hidIVRLRSourceFrom").val()) === 1) {
            modelClass = 'none';
        }
        var tmpl = {
                shtml: '<div class="preferential ' + modelClass + '"><span class="icon J_Tips  J_Tips_async" tracktype="hover" trackspot="{CONTENT}" data-content="{TIPS}" data-skin="icontips">{CONTENT}</span></div>',
                stips: '<div>{RULES}</div>'
            },
            data = {
                CONTENT: '点评返现',
                RULES: '1.点评成功后，您将获得25-50元不等的点评奖金,审核通过后返还至您的奖金账户。<br />' +
                '<span style=\'color: #50b400\'>2.如果您的点评足够细致、有特色，将有机会被评为精华点评，被评为精华点评，奖金是原点评奖金的2倍哦！</span>'
            },
            dataF = {
                CONTENT: '非凡立返',
                RULES: '1.点评提交，通过审核后您将可以获得<span style=\'color: #50b400\'>100元/人</span>的立返奖金，返现人数即参与点评人数（奖金统一返至预定人立返奖金账户）。<br />' +
                '2.出游前一天会有短信通知，出游后即可点击短信中的链接参与非凡点评。<br />' +
                '3.非凡点评需满足100字以上的文字+4张以上的图片，每个出游人的点评内容不可完全一致哦。<br />' +
                '4.在回团后15天内点评有效。<br />'
            };
        //TODO 添加区分非凡
        if ($("#hidIsExtraordinary").val() == "false") {
            tmpl.stips = tmpl.stips.replace(/{(\w+)}/g, function($0, $1) {
                return data[$1];
            });
            tmpl.shtml = tmpl.shtml.replace(/\{CONTENT\}/g, data.CONTENT);
            tmpl.shtml = tmpl.shtml.replace(/\{TIPS\}/, tmpl.stips);
        } else {
            tmpl.stips = tmpl.stips.replace(/{(\w+)}/g, function($0, $1) {
                return dataF[$1];
            });
            tmpl.shtml = tmpl.shtml.replace(/\{CONTENT\}/g, dataF.CONTENT);
            tmpl.shtml = tmpl.shtml.replace(/\{TIPS\}/, tmpl.stips);
        }

        return tmpl.shtml;
    },
    /**
     * 获取URL上的ouid存入cookie
     */
    getOuidInfo: function() {
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
    _getData: function(url, callback) {
        var self = this;
        Common.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                callback.call(this, data);
            }
        });
    },
    getVersionEl: function(index) {
        var self = this;
        if (self.__versionEl) {
            return self.__versionEl[index];
        }
        var versionEl = {};
        $(".J_travelSort li").each(function(i, el) {
            var travelId = el.getAttribute("data-version") - 0;
            versionEl[travelId] = el;
        });
        self.__versionEl = versionEl;
        return versionEl[index];
    },
    /**
     * @desc 初始化倒计时
     * @param el
     * @param dateArr
     */
    initTimer: function(el, dateArr) {
        var bookEl = $(".J_OrderBtn");
        var bookEl2 = $(".J_price-submit");
        var href = bookEl.attr("href");
        var cfg = [{
            "tmpl": '<span><i></i>离开抢：<em>{days}</em>天<em>{hour}</em>小时<em>{minute}</em>分<em>{second}</em>秒</span>',
            callback: function() {
                bookEl.addClass("endTime").html("即将开始");
                bookEl2.addClass("endTime").html("即将开始");
            }
        }, {
            "tmpl": '<span><i></i>还剩：<em>{days}</em>天<em>{hour}</em>小时<em>{minute}</em>分<em>{second}</em>秒</span>',
            callback: function() {
                bookEl.html("马上抢");
                bookEl2.html("马上抢");
            }
        }, {
            "tmpl": "",
            callback: function() {
                el.addClass("none");
                $(".J_CountDown").addClass("none");
                bookEl.addClass("endTime").html("已售完");
                bookEl2.addClass("endTime").html("已售完");
            }
        }];

        Timer.init({
            el: el,
            date: dateArr,
            cfg: cfg
        })
    },

    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function(callback) {
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function() {
                callback.call(self);
            },
            unReload: true
        });
    },
    isLogin: function() {
        var cnUser = $.cookie("us");
        return (/userid=\d+/.exec(cnUser));
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    checkLogin: function(callback) {
        if (!this.isLogin()) {
            this.initLogin(callback);
        } else {
            callback && callback.call(this);
        }
    },
    /**
     * @desc 初始化收藏的事件
     */
    initCollect: function() {
        var self = this,
            el = $(".J_Store");

        el.on("click", function() {
            if (!self.isLogin()) {
                self.initLogin(function() {
                    self.setCollect("search", el,
                        function() {
                            if (self.param.needAdd == 1) {
                                self.setCollect("add", el);
                            }
                        }
                    );
                });
            } else {
                self.setCollect("add", el);
            }
        });
        self.setCollect("search", el);
    },
    /**
     * @desc 发送收藏到指定的接口
     */
    setCollect: function(type, el, callback) {
        var self = this;
        var lineId = this.param.lineId;
        var isStore = type === "add" ? 1 : 0;
        var url = window.host + "/intervacation/api/Favourites/GetFavouritesCount?siteType=0&productId=" + lineId + "&isStore=" + isStore;
        Common.ajax({
            url: url,
            dataType: "jsonp",
            errorType: "setCollectAjax",
            success: function(data) {
                var msg = "收藏",
                    cls = "";
                if (data.Data && data.Data.favourites) {
                    var favourites = data.Data.favourites;
                    if (favourites.FavType == 2 || favourites.FavType == 0) {
                        el.addClass("border");
                    }
                    if (favourites.FavType == 3 || favourites.FavType == 1) {
                        el.removeClass("border");
                    }
                    if (favourites.FavType == 3) {
                        self.param.needAdd = 1;
                    }
                    if (favourites.FavType == 2 || favourites.FavType == 0) {
                        msg = "已收藏";
                        cls = "icons-solid-star";
                        $(".J_Store").on("mouseenter", function() {
                            if (el.hasClass("border")) {
                                $(this).html("<i class='ziyou-icons-store icons-solid-star'></i><em>取消收藏</em>");
                                $(this).addClass("border");
                            }
                        }).on("mouseleave", function() {
                            if (el.hasClass("border")) {
                                $(this).html("<i class='ziyou-icons-store icons-solid-star'></i>已收藏");
                            }
                        });
                    }
                }
                el.html('<i class="' + cls + ' ziyou-icons-store"></i>' + msg + '&nbsp;'); //暂时去掉收藏的数据
                callback && callback.call(this);
            }
        });

    },
    /**
     * @desc 给所有的J_Tips绑定tip提示功能
     * @example
     * <div class="J_Tips" data-content='<p>test</p>'></div>
     * //默认的对齐位置为 左侧,底部
     */
    initTip: function() {

        $dialog3.tooltip({
            content: function(obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function() { //隐藏后触发事件

            },
            triggerEle: '.J_Tips', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
        });
    },
    /**
     * @desc 初始化线路特色
     * @param callback
     */
    initFeature: function(callback) {
        if (window.XFam && XFam.config && XFam.config.feature) {
            var LineFeature = require("linefeature/0.1.0/index");
            LineFeature.init(XFam.config.feature, ".J_FeatureContent", callback);
        }
    },
    /**
     * @desc 初始化分享功能
     */
    initShare: function() {
        var share = new Share({
            trigger: ".J_Share",
            summary: $(".line-title").attr("title"),
            pic: $(".J_mainPic").attr("data-img")
        });
    },
    /**
     * @desc 初始化滚动导航功能
     */
    initScrollSpy: function() {
        var self = this;
        ScrollSpy({
            navEl: "#conlist",
            navListEl: ".content-nav-inner",
            navTopH: 47,
            currentCls: "on",
            contentEl: ".J_NavBox",
            renderNav: function(data) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    if(i==0){
                        html += '<a class="on" href="#' + data[i].id + '"><span>' + data[i].txt + '</span></a>';
                    }else{
                        html += '<a class="" href="#' + data[i].id + '"><span>' + data[i].txt + '</span></a>';
                    }
                }
                return html
            },
            fixedNav: function(el, isDown) {
                switch (isDown) {
                    case 0:
                        el.find(".J_OrderBtn").addClass("none");
                        el.css({
                            position: "static",
                            display: "block"
                        });
                        break;
                    case 1:
                        el.find(".J_OrderBtn").removeClass("none");
                        el.css({
                            position: "fixed",
                            display: "block"
                        });
                        break;
                    case 2:
                        el.find(".J_OrderBtn").removeClass("none");
                        el.css({
                            display: "block"
                        });
                        break;
                }
            },
            loadFn: {
                "noticeInfo": function() {
                    // console.log(  "noticeInfo");
                    self.shopHandle();
                },
                "routeInfo": function() {
                    // console.log(  "routeInfo");
                    self.initFeature(function() {
                    });
                    Route.dealData(window.tripData);
                    self.stragetyHandler();
                },
                "CommentContent": function(el, parent) {
                    // console.log(  "CommentContent");
                    self.initRecomendProduct();
                    var productType = 0,
                        local = parseInt($("#LineProperty").val(),10),
                        str = parseInt($("#prop").val(),10);
                    if(str === 1){
                        if (local === 1) {
                            productType = 1;
                        } else {
                            productType = 13;
                        }
                    }else if(str === 3){
                        productType = 3;
                    }
                    var comment = self.commentModule;
                    comment.initMain({
                        el: $("#J_SubCommentContent"),
                        mainParam: {
                            productId: self.param.lineId,
                            productType: productType
                        },
                        host: fzHost || host,
                        isFreeTour: true,
                        callback: function () {
                            $(".data-loading").remove();
                        }
                    });
                    //
                    window.__ComLog && __ComLog.warp(function(){

                        var __self = this;
                        $(".J_BtnComment").on("click",function(){
                            __self.log("Scendet_dpclick",
                                "^306" +
                                "^"+__self.lineid+
                                "^"+__self.cityid+"^");
                        });
                    });


                },
                "visaInfo": function() {

                }
            },
            enterFn:{

                "CommentContent": function() {
                    window.__ComLog && __ComLog.warp(function(){
                        var __self = this;
                        __self.log("Scendet_dpclick",
                            "^306" +
                            "^"+__self.lineid+
                            "^"+__self.cityid+"^");
                    });
                }
            }

        });

    },
    checkIsAbTravel: function() {
        return $(".J_travelSort li").length > 1;
    },
    getPopupTmpl: function() {
        var detailsStr = "";
        if (this.checkIsAbTravel()) {
            detailsStr = '  <div class="pop-look-detail clearfix" style="line-height: 44px;">' + '      <em class="datelist-travel">{{date}}</em>,本团期对应<em class="travelVersion">{{versionName}}</em>行程，<a class="detailVersion" style="color: #8ab923;" href="#versionMao" attr-v="{{versionId}}">查看详情&gt;&gt;</a>{{isGroupStr}}</div>';
        } else {
            detailsStr = '<div class="pop-detail-title clearfix">' + '      <span><em class="datelist-travel">{{date}}</em>，本团期价格详情：</span>{{isGroupStr}}</div>';
        }

        var tmpl = '<div class="pop-cal">' + detailsStr + '          <div class="listSty1" >' + '              <span class="linename">价格类型</span>' + '              <strong class="lineprice" style="padding-right:95px;">价格</strong>' + '              <div class="people">人数<div class="clear_float"></div></div>' + '          </div>' + '          <div class="people-is-zero none" id="J_PeopleIsZero" style="float:right;width: 224px;height: 20px;border: 1px solid #ffD5a1;background-color: #fff4d9;font-size: 12px;line-height: 20px;text-align: center;">' + '              <i style="display: inline-block;width: 14px;height: 14px;background: url(//img1.40017.cn/cn/v/2015/book/order_pop.png) 0 0 no-repeat;margin: 3px;float: left;"></i>当前出游人数为0，不能进行预订哦！' + '          </div>' + '          <em class="data-travel">{{travelStr}}</em><a class="btn-order" href="javascript:void(0);">立即预订</a>' + '      </div>';
        return tmpl;
    },
    getExtraParam: function(ret) {
        var akVal = Common.getParamFromUrl("ak");
        var sellTypeVal = Common.getParamFromUrl("selltype", true);
        if(Common.getParamFromUrl("dk")){
                var dkVal = Common.getParamFromUrl("dk");
            }else{
                var dkVal = '';
        }
        if (akVal) {
            ret.order += "&ak=" + akVal;
            ret.ajax += "&ak=" + akVal;
            if (sellTypeVal) {
                ret.order += "&selltype=" + sellTypeVal;
            }
        }
        if (dkVal) {
            ret.order += "&dk=" + dkVal;
            ret.ajax += "&dk=" + dkVal;
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
    calItemClick: function(data, cfg, el) {
        var tmpl = this.getPopupTmpl();
        var calendarContent = tmpl.replace(/{{(\w+)}}/g, function($0, $1) {
            return data[$1] || "";
        });

        //单击触发
        $obj = $obj || $dialog3.tooltip({
                content: calendarContent, //内容,支持html,function
                delay: 1000 //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            });
        $obj.set("content", calendarContent);
        $obj.show(el, "bottom", true);
        $(".btn-order").attr("trace", "calendar-order");
        $(".btn-order").on("click", function(e) {
            var btn3 = $(".btn-order"),
                num = "",
                me = $(this),
                inputEl = me.parent().find(".num_box input"),
                cityId = $("#hidLocatedStartCityId").val();
            inputEl.each(function(i, elem) {
                var addr = $(this).attr("peopleNum") || $(this).val();
                num = num + addr + '|';
                btn3.attr("href", cfg.order + '&num=' + num + "&cityId=" + cityId + window.dspId);
            });
        });
        if (!this.initCalPopupEventFlag) {
            this.initCalPopupEventFlag = true;
            this.initCalPopupEvent();
        }
    },
    /**
     * @desc 初始化门店信息desc
     */
    shopHandle: function() {
        var self = this;
        var cityId = Common.getParamFromUrl('cityid', true) || $("#hidcityInfo").val();
        var url = window.host + '/intervacation/api/RegionInfo/GetRegionList?cityId=' + cityId;
        Common.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data && data.Data && data.Data.regionInfo) {
                    var regionInfo = data.Data.regionInfo;
                    var provinceId = regionInfo.proResult.currentProId,
                        cityId = regionInfo.cityList.currentCityId;
                    Common.render({
                        data: regionInfo,
                        context: ".J_shopproandcity",
                        tpl: tplproandcity,
                    });
                    self.getShopListByCity(provinceId, cityId);
                }
            }
        });
        $(document).on('click', '.J_currentShopProvince', function(e) {
            e.stopPropagation();
            if (!$(".J_shopprovince").hasClass("none")) {
                $(this).removeClass("close").addClass("open");
                $(".J_shopprovince").addClass("none");
            } else {
                $(this).removeClass("open").addClass("close");
                $(".J_shopprovince").removeClass("none");
            }
            $(".J_shopcity").addClass("none");
        });
        $(document).on('click', '.J_shopprovince li', function(e) {
            e.stopPropagation();
            $(".J_currentShopCity").html("请选择城市");
            $(".J_currentShopProvince").removeClass("close").addClass("open");
            $(".J_shopproandcity ul").addClass("none");
            $(".J_currentShopProvince").html($(this).html());
            $(".J_currentShopProvince").attr("data-provinceId", $(this).attr("data-provinceId"));
            $(".J_shopcity").html("");
        });
        $(document).on('click', '.J_currentShopCity', function(e) {
            e.stopPropagation();
            if (!$(".J_shopcity").hasClass("none")) {
                $(this).removeClass("close").addClass("open");
                $(".J_shopcity").addClass("none");
            } else {
                $(this).removeClass("open").addClass("close");
                $(".J_shopcity").removeClass("none");
            }
            $(".J_shopprovince").addClass("none");
            var provinceId = $(".J_currentShopProvince").attr("data-provinceId");
            self.getShopCityByProvince(provinceId);
        });
        $(document).on('click', '.J_shopcity li', function(e) {
            e.stopPropagation();
            $(".J_currentShopCity").removeClass("close").addClass("open");
            $(".J_shopproandcity ul").addClass("none");
            $(".J_currentShopCity").html($(this).html());
            $(".J_currentShopCity").attr("data-cityId", $(this).attr("data-cityId"));
            var provinceId = $(".J_currentShopProvince").attr("data-provinceId"),
                cityId = $(".J_currentShopCity").attr("data-cityId");
            self.getShopListByCity(provinceId, cityId);
        });
        $(document).on("click", function() {
            $(".J_shopproandcity ul").addClass("none");
            $(".J_currentShopProvince,.J_currentShopCity").removeClass("close").addClass("open");
        });
    },
    /**
     * @desc 选择门店城市
     */
    getShopCityByProvince: function(provinceId) {
        var url = window.host + '/intervacation/api/RegionInfo/GetCityListByProvinceId?provinceId=' + provinceId;
        Common.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data && data.Data) {
                    Common.render({
                        data: data.Data,
                        context: ".J_shopcity",
                        tpl: tplShopCity,
                        overwrite: true
                    });
                }
            }
        });
    },
    /**
     * @desc 根据城市显示门店信息
     */
    getShopListByCity: function(provinceId, cityId) {
        var url = window.host + '/intervacation/api/RegionInfo/GetRegiondetailInfo?provinceId=' + provinceId + '&cityId=' + cityId;
        Common.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data && data.Data) {
                    if(data.Data.regionInfo.length != 0){
                        Common.render({
                            data: data.Data,
                            context: ".J_shop-list",
                            tpl: tplShopList,
                            overwrite: true
                        });
                    }else{
                        $(".J_shop-list").parent().addClass("none");
                        $(".J_shop-list").parent().prev().addClass("none");
                    }
                }
            }
        });
    },
    //行程攻略
    stragetyHandler:function () {
        var self = this;

        //鼠标移入呈现大图
        $(".hoverBig img").on("mouseenter", function () {
            var imgurl = common.setImageSize($(this).attr("src"), "640x360");
            $(this).next(".ImgShow").html('<img src="' + imgurl + '" />');
            $(this).next(".ImgShow").css("display", "inline-block");
            if ($(this).parent().index() == 2) {
                $(this).next(".ImgShow").css("left", "-292px");
            }
            var _bigImgH = $(this).offset().top-$(window).scrollTop();
            if(_bigImgH>=410){
                $(this).next(".ImgShow").css({'bottom':"174px",'top':'auto'});
            }else{
                $(this).next(".ImgShow").css({'bottom':"auto",'top':'174px'});
            }
        }).on("mouseout", function () {
            $(this).next(".ImgShow").css("display", "none");
        });
    },
    //联运城市
    initTransport: function() {
        var self = this;
        var trans = new Transport();
        trans.init({
            host: fzHost || host,
            callback: function(data) {
                calData = data;
                $(".mCal").html("");
                Cal.init({
                    isRefresh: true,
                    data: calData,
                    wrapper: $(".mCal"),
                    tripTime: $(".mCal").attr("attr-TimeB"),
                    afterRender: function(wrapper) {
                        var calDiscount = new CalDiscount();
                        calDiscount.init({
                            wrapper: wrapper,
                            calendar: Cal,
                            host: fzHost || host,
                            ak: $("#key").val(),
                            lineid: self.param.lineId
                        });
                    },
                    itemClick: function(y, m, d, elem) {
                        var dateS = y + '-' + m + '-' + d,
                            cityId = $("#hidLocatedStartCityId").val(),
                            urlCfg = {
                                order: "/dujia/fillIn.aspx?bookdate=" + dateS + "&id=" + self.param.lineId,
                                ajax: (window.host || "") + "/dujia/AjaxActivity.aspx?type=GetBookNewInfo" + '&id=' + self.param.lineId + '&date=' + dateS + "&cityId=" + cityId
                            };
                        self.getExtraParam(urlCfg);
                        Common.ajax({
                            url: urlCfg.ajax,
                            dataType: "text",
                            // sync:true,
                            success: function(data) {
                                var node = $(elem);
                                $(".calendar-container td").removeClass("selected-day");
                                try {
                                    node.addClass("selected-day");
                                } catch (e) {}
                                var _data = {
                                    travelStr: data,
                                    date: y + '/' + m + '/' + d
                                };
                                if (self.checkIsAbTravel()) {
                                    var versionUrl = (window.host || "") + "/dujia/AjaxActivity.aspx?type=GetTravelVersion" + '&id=' + self.param.lineId + '&date=' + dateS;
                                    Common.ajax({
                                        url: versionUrl,
                                        dataType: "text",
                                        success: function(data) {
                                            $.extend(_data, $.parseJSON(data));
                                            self.calItemClick(_data, urlCfg, elem);
                                        }
                                    })
                                } else {
                                    self.calItemClick(_data, urlCfg, elem);
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    productAjax: function(lineId, travelVersion, mainTitle) {
        var _url = window.host + "/intervacation/api/DownloadRoute/GetTravelVersionDownLoad?siteType=0&lineId=" + lineId + "&travelVersion=" + travelVersion;
        window.open(_url);
        //window.open("/dujia/ReferToTravel-" + lineId + "-" + travelVersion + "/" + mainTitle + ".pdf");
    },
    initEv: function() {
        var _self = this,
            lineId = $("#hidLineId").val(),
            lineTitle = $("#hidTitle").val().replace(/[\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]/g, "");

        //立即预订按钮跳转
        $(document).on("click", ".J_OrderBtn", function() {
            if ($(this).hasClass("endTime")) {
                return;
            }
            if ($(this).hasClass("J_OrderBtn1")) {
                if ($("#J_startTime").val() != "") {
                    $(".J_price-submit").trigger("click");
                } else {
                    $("html,body").animate({scrollTop: $(".panel-middle").offset().top}, 300);
                    $(".J_price-submit").trigger("click");
                }
            } else {
                $("html,body").animate({scrollTop: $(".panel-middle").offset().top}, 300);
            }
        });
        //sbu部分儿童介绍弹出
        $('.J_child-tips').hover(function() {
            var self = this;
            $(self).parent().find('.pop-childTips').show();
        }, function() {
            var self = this;
            $(self).parent().find('.pop-childTips').hide();
        });

        //小日历展开隐藏
        $(document).on("click", "#J_startTime", function(e) {
            e.stopPropagation();
            $(".mCal2").removeClass("none");
        });
        $("body").on("click", function() {
            $(".mCal2").addClass("none");
        });
        //行程切换
        $(".J_travelSort li").on("click", function() {
            var self = $(this);
            self.addClass("cur").siblings().removeClass("cur");
            Route.init("#J_travelDetail", function() {
                _self.stragetyHandler();
                var _left = (self.offset().left - $(".J_travelMeta").offset().left) + self.width() / 2 - 10;
                $(".J_travelMeta .arrow").css("left", _left);
                // ScrollSpy.resetOffset();
                // ScrollSpy.calScroll();
            });
        });
        //下载行程
        $(document).on("click",".print", function(e) {
            e.preventDefault();
            var downUl = $('.J_travelSort ul'),
                downLiLen = downUl.find("li").length;
            if (downLiLen > 1) {
                downUl.find("i").remove();
                var content = downloadInfo(downUl.html());
                var downloadConfig = {
                    title: '下载行程',
                    content: content,
                    width: '590px',
                    height: $(".download-info").height() + 100 + 'px'
                };
                $dialog3.modal(downloadConfig);
            } else {
                var curTravel = $(".J_travelSort .cur"),
                    travelVersion = curTravel.attr("data-version"),
                    mainTitle = lineTitle + curTravel.text();
                _self.productAjax(lineId, travelVersion, mainTitle);
            }
        });
        $(document).delegate(".download-con li", "click", function(e) {
            e.preventDefault();
            $(this).addClass("cur").siblings().removeClass("cur");
        });
        $(document).delegate(".J_Download", "click", function(e) {
            e.preventDefault();
            var curDown = $(".download-con .cur"),
                travelVerSion = curDown.attr("data-version"),
                mainTitle = lineTitle + curDown.text();
            _self.productAjax(lineId, travelVerSion, mainTitle);
        });
        $(document).on("click", ".travelDetail-tab.tab-title li:not(.disabled)", function() {
            var self = $(this),
                index = self.index(),
                tabEl = self.closest(".travelDetail"),
                travelTip = $(".travelDetail-tips");
            self.addClass("cur").siblings().removeClass("cur");
            tabEl.find(".travelDetail-content >.tab-pane").hide().eq(index).show();
            index == 0 ? travelTip.removeClass('none'):travelTip.addClass('none');
            if (index) {
                Route.showNav();
            } else {
                Route.hideNav();
            }
        }).on("click", ".J_travelMeta .more", function(e) {
            e.preventDefault();
            var moreEl = $(this),
                parEl = moreEl.prev(".cycle");
            parEl.toggleClass("dropdown");
            if (parEl.hasClass("dropdown")) {
                moreEl.html("收起");
            } else {
                moreEl.html("更多");
            }
        });
        $(document).on("click", ".J_flight_tab li", function() {
            var _this = $(this),
                _index = _this.attr("data-index");
            _this.addClass("cur").siblings().removeClass("cur");
            $(".travelInfo-main").each(function(index) {

                if (index == _index) {
                    $(".travelInfo-main").addClass("none");
                    $(this).removeClass("none");
                }
            });
        });

        $(".carousel img").on("mouseover", function() {
            var item = this,
                dataImg = Common.setImageSize($(item).attr("hover-img"), "640x360");
            $(".J_mainPic").attr("src", dataImg);
        });
        $(".J_carouselWrap").on("mouseenter", function() {
            $(this).stop().animate({
                "right": 0
            }, 200, function() {
                $(this).find(".left").addClass("active");
            });
        }).on("mouseleave", function() {
            $(this).stop().animate({
                "right": -111
            }, 200, function() {
                $(this).find(".left").removeClass("active");
            });
        });
        var jq_prompt = $(".prompt"),
            jq_safety = $(".safety"),
            jq_prompt_height = jq_prompt.height(),
            jq_safety_height = jq_safety.height();
        jq_prompt.attr("maxHeight", jq_prompt_height); //重要提醒
        jq_safety.attr("maxHeight", jq_safety_height); //安全须知

        if (jq_prompt_height > 100) {
            jq_prompt.css({
                "height": "120px"
            });
            $(".btn-fold").removeClass("none");
        }
        if (jq_safety_height > 100) {
            jq_safety.css({
                "height": "120px"
            });
            $(".btn-fold").removeClass("none");
        }
        $(".btn-fold").click(function() {
            var jq_content = $(this).prev(".ni-content"),
                jq_Tips = $(this).parent(".tips"),
                maxHeight = jq_content.attr("maxHeight");
            if ($(this).hasClass("packUp")) {
                jq_content.animate({
                    "height": maxHeight + "px"
                });
                $(this).removeClass("packUp").addClass("unfold").html("收起");
            } else {
                jq_content.animate({
                    "height": "120px"
                });
                $(this).removeClass("unfold").addClass("packUp").html("展开全部信息");
            }
        });
        //移除推荐人cookie
        fish.cookie.remove('KOInfo', {
            path: '/',
            domain: '.ly.com'
        });
        //友情链接
        $(".bot-more").on("click", function() {
            var t_btn = $(this),
                showNode = $("dd", t_btn.parent()),
                t_state = t_btn.hasClass("iv-bothidd");
            if (t_state) {
                showNode.removeClass("iv-show");
                t_btn.removeClass("iv-bothidd");
            } else {
                showNode.addClass("iv-show");
                t_btn.addClass("iv-bothidd");
            }
        });
        //微信公众号显示
        $(document).on("mouseenter", ".J_tcwx", function() {
            $(".erweima").removeClass("none");
        });
        $(document).on("mouseout", ".J_tcwx", function() {
            $(".erweima").addClass("none");
        });

        //页面弹框位置自适应
        $(window).scroll(function(){
            var _height = $('.panel-middle').offset().top;
            var _heigthH = _height - $(window).scrollTop();
            if(_heigthH>385){
                $('.mCal2').addClass('calTop');
            }else{
                $('.mCal2').removeClass('calTop');
            }
        });

        //自费折叠
        $(document).on("click",".ownExpense .ownTogglemore", function () {
            var self = $(this);
            if(self.hasClass("open")){
                self.removeClass("open").addClass("close");
                $(".ownExpense-item").removeClass("none");
                self.html("收起全部信息");
            }else{
                self.removeClass("close").addClass("open");
                $(".J_ownExpense-item").addClass("none");
                self.html("展开全部信息");
            }
        });
        _self.initTopTravel();
    },

    backgroundPic: function() {
        $('.theme').css("background", "url(//img1.40017.cn/cn/v/2015/details2016/body-bg.png) no-repeat");
    },
    //航司信息点击事件
    hangsiClickOut: function() {
        var el = this,
            self = ".travel-flight .travel-flight-title .hangsi",
            cancelEl = ".box-consign .box-header .close";
        //获取返回显示数据较慢，优化将请求的内容保存到变量setDataDom；并在第一次请求时显示"等待提示";
        var setDataT = '<div class="box-header"><p><span class="hangsi_top"></span><span class="label">航司托运信息</span>' +
                '<em><s>*</s> (仅供参考，具体以航司官方信息为准)</em></p> </div>',
            setDataDom = "",
            config = {};
        $(document).on("click", self, function() {
            if (el.isInited) {
                config = {
                    title: setDataT,
                    content: setDataDom,
                    width: '1190px',
                    height: $('.box-consign').height() + 100 + 'px'
                };
                $dialog3.modal(config);
            } else {
                config = {
                    title: setDataT,
                    content: '<p style="text-align: center;font-size: 14px">请稍后，正在努力加载中···</p>',
                    width: '1190px',
                    height: $('.box-consign').height() + 100 + 'px'
                };
                $dialog3.modal(config);

                var Arrs = [];
                $(".flightShow .flightNum").each(function() {
                    var txt = $.trim($(this).html());
                    Arrs.push(txt);
                });
                var str = "[";
                $.each(Arrs, function(i, v) {
                    str += '"' + v.replace(/\W+/g, "") + '"' + ",";
                });
                str += "]";
                Common.ajax({
                    type: "get",
                    url: "/intervacation/api/Flight/GetFlightConsignInfo?siteType=0&flightNoList=" + str,
                    dataType: "jsonp",
                    success: function(data) {
                        $(".dialog_modal_content").html(Consign(data));
                        setDataDom = $(".dialog_modal_content").html();

                    }
                });
                el.isInited = true;
            }

        });
    },

    /**
     * @description 航班信息中航司托运函数
     */
    hangsiClick: function() {
        var self = ".J_flightCheck";
        $(document).on("click", self, function() {
            var Arrs = [];
            $(" .J_flightNum").each(function() {
                if(!$(this).parents("table").hasClass('none')){
                    var txt = $.trim($(this).html());
                    Arrs.push(txt);
                }
            });
            var str = "[";
            $.each(Arrs, function(i, v) {
                str += '"' + v.replace(/\W+/g, "") + '"' + ",";
            });
            str += "]";
            Common.ajax({
                type: "get",
                url: "/intervacation/api/Flight/GetFlightConsignInfo?siteType=0&flightNoList=" + str,
                dataType: "jsonp",
                success: function(data) {
                    var config = {
                        title: '<div class="box-header"><p><span class="hangsi_top"></span><span class="label">航司托运信息</span>' +
                        '<em><s>*</s> (仅供参考，具体以航司官方信息为准)</em></p> </div>',
                        content: Consign(data),
                        width: '1190px',
                        height: $('.box-consign').height() + 100 + 'px'
                    };
                    $dialog3.modal(config);
                }
            })
        });
    },

    /**
     * @description 处理点击日历切换ab行程
     */
    handleCalTravel:function (data) {
        var self = this,
            version = data,
            travelLi = $(".J_travelSort li");
        travelLi.each(function (index,item) {
            if($(item).data("version") == version){
                $(item).addClass("cur").siblings().removeClass("cur");
                Route.init("#J_travelDetail", function () {
                    self.stragetyHandler();
                });
            }
        });

    },

    /**
     * @description 终页sbu打包资源模块
     * @param lineDate(线路时间)
     * @param paramData(日历数据)
     * @param residualCount(库存)
     */
    initPackage: function(lineDate, paramData, residualCount) {
        var self = this;
        var calParam = [];
        var _residualCount = {
            "residualCount": residualCount
        };
        for (var i = 0; i < paramData.length; i++) {
            if (paramData[i].PriceType != 1 && paramData[i].PriceType != 8) {
                calParam.push(paramData[i])
            }
        }
        var prices = {
            "paramData": calParam
        };
        if (residualCount == 0) {
            residualCount = 20;
        }
        $("#J_startTime").val(lineDate);
        $(".J_picker-input").attr("max", residualCount);
        if (residualCount == 1) {
            $(".J_picker-adult").val("1");
            $(".J_picker-adult").prev().removeClass('peopleNum-picker-leftBtn').addClass("peopleNum-disPicker-leftBtn");
            $(".J_picker-adult").next().removeClass('peopleNum-picker-rightBtn').addClass("peopleNum-disPicker-rightBtn");
        } else if (residualCount == 2) {
            $(".J_picker-adult").val("2");
            $(".J_picker-adult").prev().removeClass('peopleNum-disPicker-leftBtn').addClass("peopleNum-picker-leftBtn");
            $(".J_picker-adult").next().removeClass('peopleNum-picker-rightBtn').addClass("peopleNum-disPicker-rightBtn");
        } else {
            $(".J_picker-adult").prev().removeClass('peopleNum-disPicker-leftBtn').addClass("peopleNum-picker-leftBtn");
            $(".J_picker-adult").val("2");
        }
        if (residualCount == 1) {
            $(".J_picker-child").val("0");
            $(".J_picker-child").prev().removeClass('peopleNum-picker-leftBtn').addClass("peopleNum-disPicker-leftBtn");
            $(".J_picker-child").next().removeClass('peopleNum-picker-rightBtn').addClass("peopleNum-disPicker-rightBtn");
        } else if (residualCount == 2) {
            $(".J_picker-child").val("0");
            $(".J_picker-child").prev().removeClass('peopleNum-picker-leftBtn').addClass("peopleNum-disPicker-leftBtn");
            $(".J_picker-child").next().removeClass('peopleNum-picker-rightBtn').addClass("peopleNum-disPicker-rightBtn");
        } else {
            $(".J_picker-child").val("0");
        }

        /*
            * @desc 判断价格日历中是否有儿童
            *
            */
        function isChild(arr) {
            var isChild = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === 8) {
                    isChild = true
                }
            }
            return isChild;
        }
        var childArr = [];
        for (var j = 0; j < paramData.length; j++) {
            childArr.push(paramData[j].PriceType);
            var state = isChild(childArr);
            if (!state) {
                $('.J_isChild').find('.isChild').addClass('none');
                $('.J_isChild').find('.noChild').removeClass('none');
            } else {
                $('.J_isChild').find('.isChild').removeClass('none');
                $('.J_isChild').find('.noChild').addClass('none');
            }
        }

        for (var i = 0; i < paramData.length; i++) {
            if (paramData[i].PriceType == 1) {
                $(".J_aldutPrice").html("￥" + paramData[i].DisCountedPrice + "/人起")
                    .attr("data-PriceType", paramData[i].PriceType)
                    .attr("data-PriceId", paramData[i].PriceId)
                    .attr("data-price", paramData[i].DisCountedPrice);
            }
            if (paramData[i].PriceType == 8) {
                $(".J_childPrice").html("￥" + paramData[i].DisCountedPrice + "/人起")
                    .attr("data-PriceType", paramData[i].PriceType)
                    .attr("data-PriceId", paramData[i].PriceId)
                    .attr("data-price", paramData[i].DisCountedPrice);
            }
        }
        var param = {
            lineId: $("#hidLineId").val(),
            lineDate: $('#hidLineDate').val(),
            serialId: $('#hidSerialId').val(),
            playDays: $('#hidPlayDays').val(),
            cityId: $('#hidDepartureCityId').val(),
            priceId: $('.J_aldutPrice').attr('data-priceid'),
            lineType:$("#LineProperty").val()
        }
        var _url = window.host + '/intervacation/api/SBUPackage/GetSbuProductList?' +
            'lineId=' + param.lineId + '&lineDate=' + param.lineDate + '&serialId=' + param.serialId + '&playDays=' + param.playDays + '&priceId=' + param.priceId + '&cityId=' + param.cityId + '&lineType='+param.lineType;
        Common.ajax({
            url: _url,
            dataType: 'jsonp',
            beforeSend: function() {
                $(".J_price-submit,.J_OrderBtn").addClass("Endtime");
                $('.resource-info-contain').addClass('none');
                $('.price-contain .J_sumPrice').addClass('none');
                $(".J_travelTypeTip").css({"display":"none"});
                $(".loading-box").html("<div class='data-loading'><div class='bg'></div><span>请稍候,正在为您加载...</span></div>");
                var _leftBtn = $('.J_picker-leftBtn'),
                    _rightBtn = $('.J_picker-rightBtn');
                _leftBtn.addClass("Endtime");
                _rightBtn.addClass("Endtime");
                if (residualCount == 1 || residualCount == 2) {

                } else {
                    _leftBtn.each(function(index, item) {
                        if (!$(item).hasClass('peopleNum-disPicker-leftBtn') && index !== 0) {
                            $(item).addClass('peopleNum-disPicker-leftBtn');
                        }
                    });
                    _rightBtn.each(function(index, item) {
                        if ($(item).hasClass('peopleNum-disPicker-rightBtn')) {
                            $(item).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                        }
                    });
                }
            },
            success: function(data) {
                if (data) {
                    $(".data-loading").remove();
                    $(".J_price-submit,.J_OrderBtn").removeClass("Endtime");
                    $('.J_picker-leftBtn,.J_picker-rightBtn').removeClass("Endtime");
                    if(data.Data.VersionName){
                        $(".J_travelTypeTip span").html("本团期对应"+data.Data.VersionName+"行程");
                        $(".J_travelTypeTip").removeClass('none');
                    }
                    $(".J_travelTypeTip").css({"display":"inline-block"});;
                    Group.prototype.handleCalTravel(data.Data.VersionId);
                    var lineProperty = $('#LineProperty').val() || "";
                    //跟团不显示航班，酒店
                    if (lineProperty != 1 && lineProperty != 10) {
                        if (data.Data.flight && data.Data.flight !== null) {
                            var flightInfo = require('./views/flightInfo.dot');
                            $('.J_flight-travelInfo').html(flightInfo(data.Data));
                            var isChange = $('.J_flight-travelInfo').attr('isChange');
                            if (isChange == '0') {
                                $('.flight-invoice').css('margin-top', '200px');
                            } else {
                                $('.flight-invoice').css('margin-top', '80px');
                            }
                        } else {
                            $('.J_flight-travelInfo').html("");
                            $('.J_flight-travelInfo').css("border-bottom", "none");
                        }
                        Group.prototype.setHotelInfo(data.Data.hotel);
                    } else {
                        $('.J_flight-travelInfo').css("border-bottom", "none");
                        $('#hotelInfo').css("border-bottom", "none");
                    }

                    var sbuSource = require('./views/sbusource.dot');
                    $.extend(data.Data, prices);
                    $.extend(data.Data, _residualCount);

                    var insurance = data.Data.product.Insurance.Insurance;
                    var visa = data.Data.product.Visa;
                    var wanLe = data.Data.product.WanLe;
                    var paramData = data.Data.paramData;
                    if (insurance != null || visa != null || wanLe != null || paramData.length != 0) {
                        $('.J_sbusource').html(sbuSource(data.Data));
                    } else {
                        $('.J_sbusource').css("border-bottom", "none");
                    }

                    if ($('.J_feeDes')) {
                        $('.J_feeDes-box').html($('.J_feeDes').html());
                        $('.J_feeDes-box').parents('.info-module').removeClass('none');
                    } else {
                        $('.J_feeDes-box').parents('.info-module').addClass('none');
                    }
                    if ($('.J_feeItem')) {
                        $('.J_feeItem-box').html($('.J_feeItem').html());
                        $('.J_feeItem-box').parents('.info-module').removeClass('none');
                    } else {
                        $('.J_feeItem-box').parents('.info-module').addClass('none');
                    }
                    Group.prototype.popoverEvent();

                    if (self.param.unbindFlag2) {
                        self.param.unbindFlag2 = false;
                        Group.prototype.cuttleEvent();
                    }
                    Group.prototype.resourceInfoEvent();
                    Group.prototype.resourceCountEvent();
                    Group.prototype.priceCountEvent();
                    $('.resource-info-contain').removeClass('none');
                    $('.price-contain .J_sumPrice').removeClass('none');

                    var sbuItem = $('.J_sbusource tr');
                    if (sbuItem) {
                        $(sbuItem[sbuItem.length - 1]).find('.resource-items').removeClass('resource-items');
                    }
                }
            }
        })
    },

    /**
     * @description 总价tip提示函数
     */
    popoverEvent: function() {
        var priceTips = $(".J_price-tips"),
            popover = $('.ui-popover-contain');
        priceTips.hover(function() {
            if (popover.hide()) {
                popover.show();
            }
        }, function() {
            if (popover.show()) {
                popover.hide();
            }
        });
    },

    /**
     * @description 成人儿童人数计算(库存)
     */
    numCountEvent: function() {
        var leftBtn = $('.J_picker-leftBtn'),
            rightBtn = $('.J_picker-rightBtn');

        leftBtn.on('click', function(e) {
            e.stopPropagation();
            var self = this,
                coustInput = $(self).siblings('.J_picker-input');
            var value = parseInt($(coustInput).val()),
                max = parseInt($(coustInput).attr('max'));
            var sumVal;
            var adultVal = parseInt($(coustInput).hasClass('J_picker-adult') ? $('.J_picker-child').val() : $('.J_picker-adult').val());
            var state = coustInput.hasClass('J_picker-adult') ? 'child' : 'adult';

            if ($(self).hasClass("Endtime")) {
                return;
            }
            if (!$(self).hasClass('peopleNum-disPicker-leftBtn')) {
                if ($("#J_startTime").val() == '') {
                    $('.mCal2').removeClass('none');
                }
                if (value > 0) {
                    if (state != 'adult' && value == 2) {
                        value--;
                        $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                    } else {
                        value--;
                        if (value < (max - adultVal)) {
                            $(rightBtn).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                        }
                        if ($(self).siblings('.J_picker-rightBtn').hasClass('peopleNum-disPicker-rightBtn')) {
                            $(self).siblings('.J_picker-rightBtn').removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                        }
                    }
                }
                if (value < 1) {
                    $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                }
                sumVal = parseInt(value) + (state == 'child' ? parseInt($('.J_picker-child').val()) : parseInt($('.J_picker-adult').val()));
                if (sumVal < max) {
                    rightBtn.each(function(key, item) {
                        if ($(item).hasClass('peopleNum-disPicker-rightBtn')) {
                            $(item).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                        }
                    });
                }
                $(coustInput).val(value);
                $('.J_safeNum').text(sumVal);
                $('.J_safeNum').parents('.J_resourceBox').find('.J_orderItem').attr('data-count', sumVal);
                Group.prototype.priceCountEvent();
            }
        });

        rightBtn.on('click', function(e) {
            e.stopPropagation();
            if ($("#J_startTime").val() == '') {
                $('.mCal2').removeClass('none');
            }
            var self = this,
                coustInput = $(self).siblings('.J_picker-input');
            var value = parseInt($(coustInput).val()),
                max = parseInt($(coustInput).attr('max'));
            var adultVal = parseInt($(coustInput).hasClass('J_picker-adult') ? $('.J_picker-child').val() : $('.J_picker-adult').val());
            var sumVal;
            var state = coustInput.hasClass('J_picker-adult') ? 'child' : 'adult';

            if ($(self).hasClass("Endtime")) {
                return;
            }
            if (!$(self).hasClass('peopleNum-disPicker-rightBtn')) {
                if (max >= 20) {
                    if (value < 20 && value < (max - adultVal)) {
                        value++;
                        $(self).siblings('.J_picker-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                        if (value === 20) {
                            $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                        }
                    } else {
                        $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                    }
                } else {
                    if (value < (max - adultVal)) {
                        value++;
                        if (value == (max - adultVal)) {
                            $(rightBtn).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                        }
                        $(self).siblings('.J_picker-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn')
                    } else {
                        $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                    }
                }
                sumVal = parseInt(value) + (state == 'child' ? parseInt($('.J_picker-child').val()) : parseInt($('.J_picker-adult').val()));
                if (sumVal < max) {
                    leftBtn.each(function(key, item) {
                        if ($(item).hasClass('peopleNum-disPicker-leftBtn')) {
                            $(item).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                        }
                    });
                }
                if (sumVal === max) {
                    rightBtn.each(function(key, item) {
                        if ($(item).hasClass('peopleNum-picker-rightBtn')) {
                            $(item).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                        }
                    });
                }
                $(coustInput).val(value);
                $('.J_safeNum').text(sumVal);
                $('.J_safeNum').parents('.J_resourceBox').find('.J_orderItem').attr('data-count', sumVal);
                Group.prototype.priceCountEvent();
            }else{
                if($(this).prev().hasClass('J_picker-adult')){
                    $('.J_numsTip').css({'left':'295px'})
                }else{
                    $('.J_numsTip').css({'left':'445px'})
                }
                $('.J_numsTip').show();
                setTimeout("$('.J_numsTip').hide()",5000);
            }
        });

    },

    /**
     * @description sbu资源数量计算
     */
    resourceCountEvent: function() {
        var _rLeftBtn = $('.J_resource-leftBtn'),
            _rRightBtn = $('.J_resource-rightBtn');
        var leftCount = 1,
            rightCount = 1;
        _rLeftBtn.on('click', function() {
            var self = this,
                coustInput = $(self).siblings('.J_picker-input');
            var value = parseInt($(coustInput).val());
            var date, price, index;
            index = $(self).parent().index();
            if (value > 0) {
                // 单房差埋点
                var singleText = $(self).parents(".J_resourceBox").find(".J_resource-box-name").text();
                if (singleText == "单房差") {
                    leftCount++;
                    $(self).attr("trackspot", leftCount + "^减少");
                }
                value--;
                if ($(self).siblings('.J_resource-rightBtn').hasClass('peopleNum-disPicker-rightBtn')) {
                    $(self).siblings('.J_resource-rightBtn').removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                }
            }
            if (value < 1) {
                $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
            }
            $(coustInput).val(value);
            $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-count', value);
            date = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-time');
            price = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-count');
            if (date && price) {
                if (date !== '' && price !== '' && price !== '0') {
                    $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                } else {
                    $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                }
                Group.prototype.priceCountEvent();
            }
        });

        _rRightBtn.on('click', function() {
            var self = this,
                coustInput = $(self).siblings('.J_picker-input');
            var value = parseInt($(coustInput).val());
            var date, price, max, index;
            index = $(self).parent().index();
            if (!$(self).hasClass('peopleNum-disPicker-rightBtn')) {
                // 单房差埋点
                var singleText = $(self).parents(".J_resourceBox").find(".J_resource-box-name").text();
                if (singleText == "单房差") {
                    rightCount++;
                    $(self).attr("trackspot", rightCount + "^增加");
                }
                if (!!$(self).parents(".J_amusement").length || !!$(self).parents(".J_visa").length) {
                    var selectTime = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr("data-time") || "";
                    var timeInput = $($(self).parents('.J_resourceBox').find('.J_resource-data-picker')[index]);
                    if (selectTime == "") {
                        timeInput.addClass("selected");
                        setTimeout(function() {
                            timeInput.removeClass("selected");
                        }, 1600);
                        return;
                    }
                }

                if (coustInput.attr('max') !== undefined) {
                    max = parseInt(coustInput.attr('max'));
                    value++;
                    if (max >= 20) {
                        if (value >= 20) {
                            $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn')
                        }
                    } else {
                        if (value >= max) {
                            $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn')
                        }
                    }
                } else {
                    value++;
                }
                $(self).siblings('.J_resource-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn')
                $(coustInput).val(value);
                $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-count', value);
                date = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-time');
                price = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-count');

                if (date && price) {
                    if (date !== '' && price !== '' && price !== '0') {
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                    } else {
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                    }
                    Group.prototype.priceCountEvent();
                }
            }
        });
    },

    /**
     * @description sbu资源模块折叠函数
     */
    cuttleEvent: function() {
        $(document).on('click', '.J_moreHotel', function() {
            var self = this;
            if ($(self).parents('.hotel-cuttle').hasClass('ui-hotel-hide')) {
                $(self).parents('.hotel-cuttle').removeClass('ui-hotel-hide').addClass('ui-hotel-show');
                $(self).parents('.hotel-contains').find('.traffic-hotel').removeClass('none');
                $(self).html('收起');
            } else {
                $(self).parents('.hotel-cuttle').removeClass('ui-hotel-show').addClass('ui-hotel-hide');
                $(self).parents('.hotel-contains').find('.traffic-hotel').addClass('none');
                $($(self).parents('.hotel-contains').find('.traffic-hotel')[0]).removeClass('none');
                $(self).html('展开更多酒店');
            }
        });

        $(document).on('mouseover','.J_flight-delay',function(){
            var self = this;
            var popFlight = $(self).next('.pop-flightTips');
            if (popFlight) {
                popFlight.show();
            }
        })

        $(document).on('mouseout','.J_flight-delay', function () {
            var self = this;
            var popFlight = $(self).next('.pop-flightTips');
            if (popFlight) {
                popFlight.hide();
            }
        })
    },

    /**
     * @description 酒店信息模块渲染
     * @param data(日历获取数据)
     */
    setHotelInfo: function(data) {
        var data = data;
        var tplHotelInfo = require("./views/hotel.dot"),
            self = this;
        if (data.hotelInfo && data.hotelInfo.length > 0) {
            Common.render({
                data: data,
                tpl: tplHotelInfo,
                context: "#hotelInfo",
                overwrite: true
            });
            $(".J_hotelTitle").click(function() {
                var content = $(this).parents(".traffic-hotel").next(".pop");
                Dialog.sysWindows({
                    "content": content,
                    "title": "酒店介绍",
                    "height": "auto"
                });
                self.setCarousel();
            });
        } else {
            $('#hotelInfo').css("border-bottom", "none");
        }
    },
    setCarousel: function() {
            $(function() {
                var index = 0;
                $(".pro_msli_pop li").eq(index).addClass("active");
                $(".pro_msli_pop li").on("click", function() {
                    $("#focusPic").attr("src", $(this).find("img").attr("src"));
                    $(this).addClass("active").siblings().removeClass("active");
                    index = $(this).index();
                });
                var car = new Carousel(".pro_msli_pop", {
                    canvas: ".pro_msli_bd ul",
                    item: "li",
                    circular: false,
                    visible: 4,
                    preload: 0,
                    btnNav: false,
                    btnPrev: ".group_left",
                    btnNext: ".group_right"
                });
                var carIndex = 0,
                    calLiLen = car.itemLength;
                car.on("prevClick", function () {
                    carIndex--;
                    carIndex < 0 && (carIndex = 0);
                    car.li.eq(carIndex).click();
                });
                car.on("nextClick", function () {
                    carIndex++;
                    carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                    car.li.eq(carIndex).click();
                });
                $(".text").find(".btn-fold").click(function() {
                    var _self = $(this);
                    _self.prev().toggleClass("J_collapse");
                    _self.toggleClass("unfold");
                    if (_self.hasClass("unfold")) {
                        _self.html("收起");
                    } else {
                        _self.html("展开");
                    }
                });
            })
    },

    /**
     * @description sbu资源模块交互
     */
    resourceInfoEvent: function() {
        var resourceItem = '.J_resourceInfo',
            visaItem = '.J_visa-type li',
            dropInput = '.J_resource-data-picker',
            dropList = '.ui-dropDown',
            radio = '.J_resource-safeRadio',
            resourceMore = '.J_moreResource';
        var self = this;
        var wanleDetailTmpl = require("./views/sbuWanleDetails.dot");
        if (self.param.unbindFlag) {
            self.param.unbindFlag = false;
            $(document).on('click', resourceItem, function() {
                var _this = this;
                var detailInfo = $(_this).parents('.J_resourceBox').siblings('.resource-info');
                if (detailInfo.hasClass('none')) {
                    $(_this).parent().removeClass('ui-product-hide').addClass('ui-product-show');
                    detailInfo.removeClass('none');
                } else {
                    $(_this).parent().removeClass('ui-product-show').addClass('ui-product-hide');
                    detailInfo.addClass('none');
                }

                if ($(_this).parents("tr").hasClass("J_amusement")) {
                    var resourceid = $(_this).attr("data-resourceId");
                    var advanceDay = $(_this).attr("data-AdvanceDay");
                    var advanceTime = $(_this).attr("data-AdvanceTime");
                    var _url = "/intervacation/api/SBUPackage/GetProductNewNoticeInfo?";
                    _url += "resourceid=" + resourceid + "&advanceDay=" + advanceDay + "&advanceTime=" + advanceTime;

                    if (detailInfo.has("div") && detailInfo.has("div").length > 0) {
                        return;
                    }
                    Common.ajax({
                        url: _url,
                        datatype: "jsonp",
                        success: function(data) {
                            if (data && data.Data) {
                                detailInfo.html(wanleDetailTmpl(data.Data));
                                detailInfo.css("margin-top", "10px");
                            }
                        }
                    });
                }
            });
        }

        $(document).on('click', visaItem, function() {
            var self = this;
            if (!$(self).hasClass('visa-type-checked')) {
                $(self).parents('.J_visa-type').children().each(function(key, item) {
                    if ($(item).hasClass('visa-type-checked')) {
                        $(item).removeClass('visa-type-checked').addClass('visa-type-common');
                    }
                });
                $(self).removeClass('visa-type-common').addClass('visa-type-checked');
                $(self).parents('.resource-visa-head').siblings('.visa-type-content').each(function(key, item) {
                    if (!$(item).hasClass('none')) {
                        $(item).addClass('none');
                    }
                    if (key == $(self).index()) {
                        $(item).removeClass('none');
                    }
                });
            }
        });
        $(dropInput).mouseenter(function() {
            var self = this;
            var dropList = $(self).siblings('.ui-dropDown');
            if (dropList.hide()) {
                dropList.show();
            }
            if ($(self).parents("tr").hasClass("J_amusement")) {
                var productId = $(self).attr("data-ProductId");
                var supplyId = $(self).attr("data-SupplyId");
                var iswifi = $(self).attr("data-wifi");
                var playDays = $("#hidPlayDays").val();
                var lineDate = $("#hidLineDate").val();
                var _url = "/intervacation/api/SBUPackage/GetSingleProductPrice?";
                _url += "productId=" + productId + "&supplyId=" + supplyId + "&iswifi=" + iswifi + "&lineDate=" + lineDate + "&playDays=" + playDays;

                if (dropList.has("li") && dropList.has("li").length > 0) {
                    return;
                }
                Common.ajax({
                    url: _url,
                    datatype: "jsonp",
                    success: function(data) {
                        if (data && data.Data) {
                            dropList.html(wanleTime(data.Data));
                        }
                    }
                });
            }
        });
        $(dropInput).mouseleave(function() {
            var self = this;
            var dropList = $(self).siblings('.ui-dropDown');
            if (dropList.show()) {
                dropList.hide();
            }
        });
        $(dropList).mouseenter(function() {
            $(this).show();
        });
        $(dropList).mouseleave(function() {
            $(this).hide();
        });
        $(dropList).on('click', 'li', function() {
            var self = this;
            var date, price, index;
            index = $(self).parents('.resource-data-td').index();
            $(self).parents('.ui-dropDown').siblings(dropInput).val($(self).text());
            $(self).parents('.ui-dropDown').hide();
            $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-time', $(self).text());
            date = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-time');
            price = $($(self).parents('.J_resourceBox').find('.J_orderItem')[index]).attr('data-count');
            $(self).parents('.J_resourceBox').find('.J_orderItem').attr('data-priceid', $(self).attr('data-timePriceId'));
            if (date && price) {
                if (date !== '' && price !== '' && price !== '0') {
                    $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                } else {
                    $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                }
                Group.prototype.priceCountEvent();
            }
        });

        if (self.param.unbindFlag3) {
            self.param.unbindFlag3 = false;
            $(document).on('click', resourceMore, function() {
                var _this = this;
                var state = $(_this).parent().hasClass('ui-resource-hide') ? 'show' : 'hide';
                var boxItems = $(_this).parents('td').find('.resource-box');

                var closestTrEl = $(_this).closest('tr')
                var targetEl = closestTrEl.find('>td>span')
                if (state == 'show') {
                    $(boxItems).each(function(key, item) {
                        if ($(item).hasClass('none')) {
                            $(item).removeClass('none');
                        }
                    });
                    $(_this).parent().removeClass('ui-resource-hide').addClass('ui-resource-show');

                } else {
                    var InsureChecked = false;
                    $(boxItems).each(function(key, item) {
                        if (!$(item).hasClass('none') && key != 0) {
                            $(item).addClass('none');
                        }
                        if (!!$(item).find(".J_resource-safeRadio").length && $(item).find(".J_resource-safeRadio").hasClass('resource-radio-checked')) {
                            $(item).removeClass('none');
                            InsureChecked = true;
                        } else if (!!$(item).find(".J_resource-safeRadio").length && !$(item).find(".J_resource-safeRadio").hasClass('resource-radio-checked')) {
                            $(item).addClass('none');
                        }

                    });
                    if (!InsureChecked) {
                        $(boxItems).eq(0).removeClass("none");
                    }
                    $(_this).parent().removeClass('ui-resource-show').addClass('ui-resource-hide');

                }
                // update postion
                // targetEl.css('top', closestTrEl.height() - 23)
            });
        }
        $(radio).on('click', function() {
            var self = this;
            var num = 0;
            if ($(self).hasClass('resource-radio-normal')) {
                $(self).parents('td').find(radio).removeClass('resource-radio-checked').addClass('resource-radio-normal');
                $(self).removeClass('resource-radio-normal').addClass('resource-radio-checked');
                $(self).parents('td').find('.J_resourceBox').find('.J_orderItem').attr('data-count', '');
                $(self).parents('td').find('.J_resourceBox').find('.J_orderItem').attr('data-time', '');
                num = parseInt($(self).parents('.J_resourceBox').find('.J_resource-box-number').text());
                $(self).parents('.J_resourceBox').find('.J_orderItem').attr('data-count', num);
                $($(self).parents('td').children()[0]).addClass('none');
                $(self).parents('td').css('padding-bottom', '0');
                Group.prototype.priceCountEvent();
            } else {
                $(self).parents('td').find(radio).removeClass('resource-radio-checked').addClass('resource-radio-normal');
                $(self).parents('.J_resourceBox').find('.J_orderItem').attr('data-count', '');
                $($(self).parents('td').children()[0]).removeClass('none');
                $(self).parents('td').css('padding-bottom', '28px');
                Group.prototype.priceCountEvent();
            }
        });
    },


    /**
     * @description sbu资源模块价格计算
     */
    priceCountEvent: function() {
        var data = {};
        var dataArr = [],
            dataObj = {},
            sumPrice = 0;
        if ($('.J_picker-adult')) {
            dataObj.name = '成人';
            dataObj.price = parseInt($('.J_picker-adult').parent().next().attr('data-price'));
            dataObj.count = parseInt($('.J_picker-adult').val());
            dataArr.push(dataObj);
            dataObj = {};
        }
        if ($('.J_picker-child') && !$('.J_isChild').find('.isChild').hasClass('none')) {
            dataObj.name = '儿童';
            dataObj.price = parseInt($('.J_picker-child').parent().next().attr('data-price'));
            dataObj.count = parseInt($('.J_picker-child').val());
            dataArr.push(dataObj);
            dataObj = {};
        }
        $('.J_resource-box').each(function(index, item) {
            $(item).find('.J_orderItem').each(function(index, list) {
                var dataTime = $(list).attr('data-time');
                var key = $(list).parent().hasClass('th_col_03') ? 0 : $(list).parent().index();
                if ($(list).parents('.th_col_03').siblings('.th_col_07')) {
                    var isOrder = $($(list).parents('.th_col_03').siblings('.th_col_07').find('.J_resource-radio')[key]).hasClass('resource-radio-checked');
                }
                if (isOrder) {
                    dataObj.name = $($(list).parents('.th_col_03').prev().find('.J_resource-box-name')[key]).text() || $(list).attr('data-title');
                    dataObj.price = parseInt($($(list).parents('.th_col_03').find('.J_resource-box-price')[key]).text());
                    dataObj.count = parseInt($($(list).parents('.th_col_03').find('.J_orderItem')[key]).attr('data-count') || 0);
                    dataArr.push(dataObj);
                    dataObj = {};
                }
            });
        });

        data = {
            lists: dataArr
        };
        var popPanel = require('./views/priceDetailPanel.dot');
        $('.J_popDetails').html(popPanel(data));
        dataArr = [];
        data.lists.forEach(function(item, index) {
            sumPrice += (item.count * item.price);
        });
        $('.J_total-price').text(sumPrice);
    },
    /**
     * @description 立即预定处理到下单页参数
     */
    dealPriceData: function() {
        var dataArr = [],
            dataObj = {},
            sumPrice = 0;
        var submitBtn = $('.J_price-submit');
        var startTime = $('#J_startTime');
        submitBtn.on('click', function(e) {
            e.stopPropagation();
            if ($(this).hasClass("endTime")) {
                return;
            }
            var self = this;
            if (startTime && startTime.val() === '') {
                $('.mCal2').removeClass('none');
            } else {
                $(this).addClass('isSubmit');
                $(this).addClass('endTime');
                $(this).css({'background-color':'#ffc999'});
                $(this).text('预订中...')
                if ($('.J_picker-child') && !$('.J_isChild').find('.isChild').hasClass('none')) {
                    dataObj.ProductId = 0;
                    dataObj.ResourceId = 0;
                    dataObj.Type = $('.J_picker-child').parent().next().attr('data-pricetype');
                    dataObj.UsingDate = 0;
                    dataObj.AdultPriceId = parseInt($('.J_picker-child').parent().next().attr('data-priceid'));
                    dataObj.AdultNum = parseInt($('.J_picker-child').val());
                    dataObj.ChildNum = 0;
                    dataObj.ChildPriceId = 0;
                    dataArr.push(dataObj);
                    dataObj = {};
                } else {
                    dataObj.ProductId = 0;
                    dataObj.ResourceId = 0;
                    dataObj.Type = 0;
                    dataObj.UsingDate = 0;
                    dataObj.AdultPriceId = 0;
                    dataObj.AdultNum = 0;
                    dataObj.ChildNum = 0;
                    dataObj.ChildPriceId = 0;
                    dataArr.push(dataObj);
                    dataObj = {};
                }
                if ($('.J_picker-adult')) {
                    dataObj.ProductId = 0;
                    dataObj.ResourceId = 0;
                    dataObj.Type = $('.J_picker-adult').parent().next().attr('data-pricetype');
                    dataObj.UsingDate = 0;
                    dataObj.AdultPriceId = parseInt($('.J_picker-adult').parent().next().attr('data-priceid'));
                    dataObj.AdultNum = parseInt($('.J_picker-adult').val());
                    dataObj.ChildNum = 0;
                    dataObj.ChildPriceId = 0;
                    dataArr.push(dataObj);
                    dataObj = {};
                }
                $('.resource-item.th_col_03 .J_orderItem').each(function(index, item) {
                    var key = $(item).parent().hasClass('th_col_03') ? 0 : $(item).parent().index();
                    var isOrder = $($(item).parents('.J_resourceBox').find('.J_resource-radio')[key]).hasClass('resource-radio-checked');
                    if (isOrder) {
                        dataObj.ProductId = $(item).attr('data-productid') === '' ? 0 : $(item).attr('data-productid');
                        dataObj.ResourceId = $(item).attr('data-resourceid') === '' ? 0 : $(item).attr('data-resourceid');
                        dataObj.Type = $(item).attr('data-priceid') === '' ? 0 : $(item).attr('data-priceid');
                        dataObj.UsingDate = $(item).attr('data-time') === '' ? $('#hidLineDate').val() : $(item).attr('data-time');
                        dataObj.AdultNum = $(item).parent().hasClass('visa-childPrice') ? 0 : $(item).attr('data-count');
                        dataObj.AdultPriceId = $(item).parent().hasClass('visa-childPrice') ? 0 : $(item).attr('data-priceid');
                        dataObj.ChildNum = $(item).parent().hasClass('visa-childPrice') ? $(item).attr('data-count') : 0;
                        dataObj.ChildPriceId = $(item).parent().hasClass('visa-childPrice') ? $(item).attr('data-priceid') : 0;
                        dataArr.push(dataObj);
                        dataObj = {};
                    }
                });
            }
            if (!$(this).hasClass('isSubmit')) {
                return;
            }
            var ak = Common.getParamFromUrl("ak") || "";
            if(Common.getParamFromUrl("dk")){
                var dk = Common.getParamFromUrl("dk");
            }else{
                var dk = '';
            }
            var refid = Common.getParamFromUrl("refid") || "";
            var routeDay = $(".J_RouteDay em").text() || "";
            var orderParam = {
                Lineid: $('#hidLineId').val(),
                CityId: $('#hidDepartureCityId').val(),
                DepTime: $('#hidLineDate').val(),
                Ak: ak,
                RouteDays: routeDay,
                SbuProductPara: dataArr
            }

            $('#formLineId').val($('#hidLineId').val());
            $('#formDepartureCityId').val($('#hidDepartureCityId').val());
            $('#formLineDate').val($('#hidLineDate').val());
            $('#formAk').val(ak);
            $('#formDk').val(dk);
            $("#hidRouteDays").val(routeDay);
            $('#formSbuProduct').val(JSON.stringify(dataArr));
            $('#formUrl').val(window.location.href);
            $('#J_Form')[0].submit();

        });
    }
};
module.exports = new Group();