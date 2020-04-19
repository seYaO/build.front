/* global $ */
define("packaged/0.1.0/index", ["common/0.1.0/index","common/0.1.0/es5","dialog/0.2.0/dialog", "freePackage/calendar/0.2.0/index",
    "freePackage/calendar/0.2.0/discount", "tmpl/pc/newdetails/flightAndHotel", "tmpl/pc/newdetails/packedFlight",
    "tmpl/pc/newdetails/packedHotel", "tmpl/pc/newdetails/hotelList", "tmpl/pc/newdetails/flightList",
    "tmpl/pc/newdetails/filterFlight","jCarousel/0.1.1/index","packaged/0.1.0/index.css"
], function (require) {
    var Common = require("common/0.1.0/index"),
        Cal = require("freePackage/calendar/0.2.0/index"),
    //由于Dialog被另外个组件占用...
        DIALOG = require("dialog/0.2.0/dialog"),
        CalDiscount = require("freePackage/calendar/0.2.0/discount");
        require("jCarousel/0.1.1/index");
    var maxNum, fKey;
    var $dialog = new DIALOG({
        skin: 'default' ,
        template:{
            modal: {
                html: '<div class="dialog_modal_gp">' +
                '<div class="dialog_modal_content" data-dialog-content></div>' +
                '</div>'
            }
        }
    });
    var modifyIndex,selectHotelKey,hotelPrice;
    var Packaged = function () {};
    Packaged.prototype = {
        param: {
            id: $("#HidLineid").val(),        //线路ID
            //id: "240248",
            hotel: "", //酒店 "hotelId,liveIndex,roomLevel|hotelId,liveIndex,roomLevel"
            departure: "",        //出发地三字码
            arrival: "",        //目的地三字码
            mpId: "",        //机票产品ID
            fid: "",        //机票资源ID
            flightPrice: "",    //机票价格
            hotelPrice: ""    //酒店价格
        },
        host: window.host || "",
        orderParam: {
            IsGlobal: "",       //是否国际机票
            order: {
                Guid: "",        //国际机票查询Guid
                ProductId: "",        //机票产品ID
                ProductType: "",        //机票产品类型
                BookDate: "",        //日期
                LineId: $("#HidLineid").val(),
                Hotel: "",
                FId: "",
                Adult: "",
                Child: "",
                NoBed: "",
                SellType: ""
            }
        },
        tmpl: {
            flightAndHotel: require("tmpl/pc/newdetails/flightAndHotel"),
            flight: require("tmpl/pc/newdetails/packedFlight"),
            hotel: require("tmpl/pc/newdetails/packedHotel"),
            hotelList: require("tmpl/pc/newdetails/hotelList"),
            filterFlight: require("tmpl/pc/newdetails/filterFlight"),
            flightList: require("tmpl/pc/newdetails/flightList")
        },
        content: {
            flightAndHotel: ".result-info",
            flight: ".J_packedFlight",
            hotel: ".J_packedHotel",
            hotelList: ".J_hotelList",
            filterFlight: ".J_flightList",
            flightList: ".J_fp-list"
        },
        isFirstSearch: true, //是否第一次查询
        datas: [], //分次查询数据集合
        //酒店列表
        //hotel: "hotelId,liveIndex,roomLevel|hotelId,liveIndex,roomLevel"
        getData: function (cfg) {
            var self = this,
                url = cfg.url,
                noresultHtml = cfg.noresultHtml,
                loadDiv = cfg.loadDiv,
                param = cfg.param;
            var _param = $.extend({}, self.param, param);
            $.ajax({
                url: self.host + url,
                data: _param,
                dataType: "jsonp",
                beforeSend: function () {
                    $(loadDiv).html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                },
                success: function (data) {
                    var hotel,str;
                    var hotelArr = [];
                    if (data) {
                        data = (cfg.deal && cfg.deal.call(self,data));
                        if (cfg.render) {
                            cfg.render.call(self, data);
                        }
                    }else{
                        if(noresultHtml){
                            $(loadDiv).html(noresultHtml);
                        }
                    }
                },
                error: function () { }
            });
        },
        //价格日历初始化
        initPackedCalendar: function () {
            var self = this,
                calData = window.page_cf;

            if(calData) { calData.currDate = calData.date; }

            Cal.init({
                data: calData,
                wrapper: $(".cc-calendar"),
                //tripTime: $("#hidLineDate").val(),
                tmpl: '{iconDiscount}<span class="date" data-pid="{PriceId}" data-lineid="{LineId}">{dateStr}</span><div><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span></div>',
                afterRender: function (wrapper) {
                    $(".cc-calendar .data-loading").remove();
                    var calDiscount = new CalDiscount();
                    calDiscount.init({
                        wrapper: wrapper,
                        calendar: Cal,
                        host: "http://www.ly.com",
                        ak: $("#key").val(),
                        lineid: $("#HidLineid").val()
                    });
                    if (wrapper.find(".current-day").length > 0) {
                        $(".J_packed").removeClass("btn-gray").addClass("btn-orange");
                    }
                    var calStartDate;
                    if (Cal.inst) {
                        calStartDate = /(\d{4})[\/-](\d+)[\/-](\d+)/.exec(Cal.inst.currDate);
                    } else {
                        calStartDate = /(\d{4})[\/-](\d+)[\/-](\d+)/.exec(calData.date);
                    }
                    var calYear = calStartDate[1],
                        calMonth = calStartDate[2],
                        calDay = calStartDate[3];
                    $(".J_date").html(calYear + "年" + calMonth + "月" + calDay + "日   出发");
                    $("#hidLineDate").val(calStartDate[0].replace(/\//g, "-"));
                    if ($(".current-day").size()) {
                        self.calEvent();
                    }
                },
                itemClick: function (y, m, d, elem) {
                    var date = y + "年" + m + "月" + d + "日   出发",
                        dt = y + "-" + m + "-" + d;

                    $(".calendar-container td").removeClass("current-day");
                    $(elem).addClass("current-day");
                    $(".J_date").html(date);
                    $(".J_packed").removeClass("btn-gray").addClass("btn-orange");
                    $("#hidLineDate").val(dt);
                    //alert("点击价格日期");
                    self.calEvent();
                }
            });
        },
        //价格日历事件
        calEvent: function () {
            var self = this,
                calUrl = "/dujia/AjaxHelper/FreePackageHandler.ashx?action=VALIDATEOUTRESOURCE";
            var curDate = $(".current-day").find(".date"),
                priceId = parseInt(curDate.attr("data-pid")),
                curData = $(".current-day").find(".dataprace").html(),
                curPrace = $(".current-day").find(".dataprace").html().slice(2),
                curDataPrace = parseInt(curPrace, 10);
            $(".input-num").val("0");
            $(".input-num").attr("num", "0");
            if (curDataPrace > 1 || curData === "充足" || curData === "") {
                $("#adult").val("2");
                $("#adult").attr("num", "2");
                $(".btn-sub").addClass("disable");
                $("#adult").parent().find(".btn-sub").removeClass("disable");
            } else if (curDataPrace > 0 && curDataPrace <= 1) {
                $("#adult").val("1");
                $("#adult").attr("num", "1");
                $(".btn-sub").addClass("disable");
            }
            $.ajax({
                url: self.host + calUrl + "&priceId=" + priceId,
                dataType: "jsonp",
                success: function (data) {
                    var status = parseInt(data.status, 10);
                    //status = 0;
                    if (curData === "充足" || curData === "") {
                        if (status === 1) {
                            maxNum = 9;
                        } else {
                            maxNum = 20;
                        }
                    } else {
                        maxNum = curDataPrace;
                    }
                }
            });
        },
        //机票详情异步获取数据处理
        provisionalOrder: function (data) {
            var self = this,
                flight;
            flight = data.Flight[0];
            $("#flightKey").val(flight.BackList[0].Cabin[0].SelectKey);
            self.param.arrival = flight.DestinationCode;
            self.param.departure = flight.DepartureCode;
            self.param.flightPrice = data.FPriceKey;
            self.orderParam.IsGlobal = flight.BackList[0].IsGlobal;
            //为国际机票时不传fid，将值置为空
            if (flight.BackList[0].IsGlobal) {
                self.param.mpId = flight.BackList[0].Cabin[0].MapProductId;
                self.param.fid = "";
                self.orderParam.order.Guid = flight.BackList[0].Guid;
                self.orderParam.order.FId = "";
            } else {
                self.param.mpId = "";
                self.param.fid = flight.BackList[0].Back.FlightRecourceId;
                self.orderParam.order.Guid = "";
                self.orderParam.order.FId = flight.BackList[0].Back.FlightRecourceId.toString();
            }
            self.orderParam.order.ProductId = flight.BackList[0].Cabin[0].MapProductId;
            self.orderParam.order.ProductType = flight.BackList[0].Cabin[0].ProductType;

            return JSON.stringify(self.orderParam.order);
        },
        //创建临时订单参数
        provisionalOrderClick: function(data) {
            var self = this;
            var objResult = data;

            objResult.Guid = self.orderParam.order.Guid;
            objResult.FId = self.orderParam.order.FId;

            objResult.ProductId = self.orderParam.order.ProductId;
            objResult.ProductType = self.orderParam.order.ProductType;

            return JSON.stringify(objResult);
        },
        setCarousel: function () {
            seajs.use("jCarousel/0.1.1/index", function (Carousel) {
                $(function () {
                    var index = 0;
                    $(".pro_msli_pop li").eq(index).addClass("active");
                    $(".pro_msli_pop li").on("click", function () {
                        $("#focusPic").attr("src", $(this).find("img").attr("src"));
                        $(this).addClass("active").siblings().removeClass("active");
                        index = $(this).index();
                    });
                    var car = Carousel(".pro_msli_pop", {
                        canvas: ".pro_msli_bd ul",
                        item: "li",
                        circular: false,
                        visible: 4,
                        preload: 0,
                        btnNav: false,
                        btnPrev: ".group_left",
                        btnNext: ".group_right"
                    });
                    $(".group_left").on("click", function () {
                        car.index + 2 < index && (index -= 1);
                        $(".pro_msli_pop li").eq(index).addClass("active").siblings().removeClass("active");
                        $("#focusPic").attr("src", $(".pro_msli_pop li").eq(index).find("img").attr("src"));
                    });
                    $(".group_right").on("click", function () {
                        car.index > index && (index = car.index);
                        $(".carousel2 li").eq(index).addClass("active").siblings().removeClass("active");
                        $("#pro_msli_pop").attr("src", $(".pro_msli_pop li").eq(index).find("img").attr("src"));
                    });
                });
            });
        },
        bindEvent: function () {
            var self = this;
            $(document).on("click",".J_flightList .J_more", function () {
                var _this = $(this);
                if (_this.hasClass("unfold")) {
                    _this.parents(".fp-choose").children(".choose-detail").css({
                        "display": "none"
                    });
                    _this.parents(".fp-choose").children(".choose-detail-all").fadeIn();
                    _this.removeClass("unfold").addClass("fold");
                    _this.html("收起航班信息<b></b>");
                } else {
                    _this.parents(".fp-choose").children(".choose-detail-all").css({
                        "display": "none"
                    });
                    _this.parents(".fp-choose").children(".choose-detail").fadeIn();
                    _this.removeClass("fold").addClass("unfold");
                    _this.html("更多返程信息<b></b>");
                }
            });

            $(".btn-add,.btn-sub").click(function () {
                var _this = $(this),
                    inputEl = _this.parent().find("input");
                self.calculateFun(this.className, inputEl, maxNum);        //maxNum是最大值
            });

            $(document).delegate(".J_hotelList .J_hotel_toggle", "click", function () {
                var _this = $(this);
                if (_this.hasClass("fold")) {
                    _this.parents(".hotel-info").children(".ht-detail").animate({
                        height: "40px"
                    });
                    _this.removeClass("fold");
                } else {
                    var height = _this.parents(".hotel-info").children().children(".ht-detail-all").height();
                    _this.parents(".hotel-info").children(".ht-detail").animate({
                        height: height + "px"
                    });
                    $(this).addClass("fold");
                }
            });

            //修改
            $(document).delegate(".result-info .J_update", "click", function () {
                $(".calendar-checked").removeClass("none");
                $(".result-info").addClass("none");
                $(".pt-li-two").removeClass("current");
            });


            $(document).on("click", ".J_modify-pop", function (e) {
                modifyIndex = parseInt($(this).attr("hotel-index"),10);
                self.setDialog(this);
                Monitor.stat("packaged-mod-btn");
            });

            //选择航班
            $(document).on("click",".J_flightList .btn-choose", function (e) {
                var _this = $(this),
                    selectKey = _this.attr("select-key"),
                    scrollTop = $("#btn_order").offset().top;
                if(_this.hasClass("had-choose")){
                    e.preventDefault();
                    return;
                }
                $("#flightKey").val(selectKey);
                self.selectedFlight(this);
                self.calculateTotalPrice(this);
                self.param.flightPrice = _this.attr("data-totalFlight");
                var isGlobalVal = self.orderParam.IsGlobal = eval(_this.attr("data-global"));
                //是否国际机票
                if (isGlobalVal) {
                    self.orderParam.order.Guid = _this.attr("data-guid");
                    self.orderParam.order.FId = "";
                } else {
                    self.orderParam.order.Guid = "";
                    self.orderParam.order.FId = _this.attr("data-fid").toString();
                }
                self.orderParam.order.ProductId = _this.attr("data-productId");
                self.orderParam.order.ProductType = _this.attr("data-productType");
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: scrollTop -22
                }, 15);
            });

            //选择酒店
            $(document).delegate(".J_hotelList .btn-choose", "click", function (e) {
                var _this = $(this),
                    hotelTarget = window._hotelTarget.parents(".traffic-hotel"),
                    scrollTop = $("#btn_order").offset().top,
                    hotelIndex = modifyIndex - 1,
                    hotleParam = self.param.hotel.split("|"),
                    hotleOrderParam = self.orderParam.order.Hotel.split("|");
                selectHotelKey = _this.attr("select-key");
                hotelPrice = _this.attr("data-price");
                self.selectedHotel(this, hotelTarget);
                self.calculateTotalPrice(this);
                hotleParam[hotelIndex] = _this.attr("data-hotel");
                hotleOrderParam[hotelIndex] = _this.attr("data-hotel");
                self.param.hotel = hotleParam.join("|");
                self.orderParam.order.Hotel = hotleOrderParam.join("|");
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: scrollTop - 22
                }, 15);
            });

            //点击弹窗关闭按钮回到立即预订位置
            $("body").delegate(".pop-close", "click", function (e) {
                var scrollTop = $("#btn_order").offset().top;
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: scrollTop - 22
                }, 15);
            });
            $(document).delegate(".J_flightList .J_fp-search dd", "click", function () {
                var $this = $(this),
                    parent = $(this).parent();
                if($this.hasClass("selected")){
                    $this.removeClass("selected");
                    if($this.siblings(".selected").length === 0){
                        parent.find(".all-sel").addClass("selected");
                    }
                }else{
                    $this.addClass("selected");
                    if($this.hasClass("all-sel")){
                        $this.siblings().removeClass("selected");
                    }else{
                        $this.siblings(".all-sel").removeClass("selected");
                    }
                }
                var filterParam = self.filterCondition(),
                    data = self.filterData(filterParam);
                self.renderList(data,"flightList");
                self.transferTips();
                self.sortFlight($(".J_fp_sort .selected"),true);
            });
            //新增-默认排序
            //排序
            $(document).delegate(".J_flightList .J_fp_sort span", "click", function () {
                var _this = $(this),
                    notNeedUpdatestatus = false,
                    isSelected = _this.hasClass("selected"),
                    isDefaultOrder = _this.hasClass("default-order");
                if(isSelected && isDefaultOrder){
                    return;
                }
                if (!isSelected) {
                    //如果是首次切换到该排序,则不需要更新排序状态
                    notNeedUpdatestatus = true;
                    if(!isDefaultOrder) {
                        _this.siblings().first().css({"color":"#666","background-color":"transparent"});
                    }else {
                        _this.css({"color":"#f60","background-color":"#fff"});
                    }
                    _this.siblings().removeClass("selected");
                    _this.addClass("selected");
                }
                self.sortFlight(this,notNeedUpdatestatus,true);
            });
        },
        renderList: function(data,type){
            var self = this,
                context = $(self.content[type]),
                tmpl = self.tmpl,
                html = tmpl[type](data);
            context.empty().append(html);
        },
        dealItemData: function(item){
            var timeArr = [600,1200,1300,1800],
                startTime = item.StartTime.replace(":",""),
                flightCode = item.FlightNumber.substring(0,2),
                _index = timeArr.length;
            //将时间分类
            timeArr.every(function(n,i){
                if(startTime < n){
                    _index = i;
                    return false;
                }
                return true;
            });
            if(item.TransferCitys && item.TransferCitys.length){
                item.change = 1;
            }else{
                item.change = 0;
            }
            //如果小于600,则使用4
            item.StartTimeType = _index||4;
            //按航空公司
            item.AirCode = flightCode;
            return item;
        },
        dealFlightData: function(data){
            var self = this;
            for(var i = 0,len = data.length -1; i<=len; i++){
                var tmpArr = [],item = data[i];
                item.Go.isBack = 0;
                tmpArr.push(item.go =  self.dealItemData(item.Go));
                var backArr = [],cabin = item.BackList;
                for(var n = 0,nLen = cabin.length -1; n<=nLen; n++){
                    var backItem = cabin[n];
                    backItem.TotalPrice = backItem.Cabin[0].TotalFlightPrice; //用于返程航班排序
                    $.extend(backItem,backItem.Back);
                    backItem.isBack = 1;
                    backArr.push(self.dealItemData(backItem));
                }
                item.back = backArr;
                item.data = tmpArr.concat(backArr);
            }
            return data;
        },
        filterData: function(filterList){
            var self = this,
                allData = self.flightSourceData,
                copyData = $.extend(true,{},allData),
                clearData = [].concat(allData.clearData);
            for(var i = 0, len = clearData.length-1; i<=len; i++){
                var itemListData = clearData[i].data,
                    tmpData = [];
                for(var n = 0,nLen = itemListData.length -1; n<=nLen; n++){
                    var itemData = itemListData[n],
                        isPush = true;
                    for(var y = 0,yLen = filterList.length -1; y <=yLen;y++){
                        var filterItemList = filterList[y];
                        if(filterItemList){
                            var isPushList = true;
                            for(var x = 0,xLen = filterItemList.length -1; x<=xLen;x++){
                                var filterItem = filterItemList[x],
                                    extraData = filterItem.extra||{},
                                    extraRange = extraData.range;
                                if(extraRange){
                                    var flag = true;
                                    for(var r in extraRange) {
                                        if (!extraRange.hasOwnProperty(r)) {
                                            continue;
                                        }
                                        if(itemData[r] !== extraRange[r]){
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if(!flag) continue;
                                }
                                isPushList = false;
                                var isPushItem = true;
                                for(var f in filterItem) {
                                    if (!filterItem.hasOwnProperty(f)||f === "extra") {
                                        continue;
                                    }
                                    if(itemData[f] !== filterItem[f]){
                                        isPushItem = false;
                                        break;
                                    }
                                }
                                if(isPushItem){
                                    isPushList = true;
                                    break;
                                }
                            }

                        }
                        if(!isPushList){
                            isPush = false;
                        }
                    }
                    if(isPush){
                        tmpData.push(itemData);
                    }
                }
                copyData.clearData[i].data = tmpData;
            }
            return self.filterredData = copyData;
        },
        // 航程类型筛选条件
        filterCondition : function() {
            var searchDl = $(".J_fp-search").find("dl"),
                filterTypeParam = [];
            searchDl.each(function(i,n){
                var dlArr = [];
                $(n).find("dd.selected").each(function(){
                    var _this = $(this),
                        dataParamStr = _this.attr("data-param"),
                        dataRangeStr = _this.attr("data-range"),
                        param = {};
                    if(dataParamStr){
                        try{
                            param = eval("("+dataParamStr+")");
                        }catch(e){
                            param = {};
                        }
                        param.extra = {
                            range: eval("("+dataRangeStr+")"),
                            or: _this.attr("data-or")
                        };
                        dlArr.push(param);
                    }
                })
                if(dlArr.length >0){
                    filterTypeParam.push(dlArr);
                }
            });
            return filterTypeParam;                 /*这个函数有一个属性AirType:存储选中时的状态是直飞还是中转*/
        },
        //选择航班
        selectedFlight: function (el) {
            var self = this,
                _this = $(el),
                dateIndex = _this.parents(".fp-choose").attr("data-index"),
                backIndex = _this.parents(".choose-right").attr("data-index"),//返程索引
                flightData = self.filterredData.clearData,
                 arr = [],
                 json = {},
                flight = {
                    "Flight": arr
                };

            arr.push(json);
            for (var i = 0; i < flightData.length; i++) {
                var backList = flightData[i].BackList;
                if (dateIndex == i) {
                    json.Go = flightData[i].Go;
                    //返程时间段
                    for (var j = 0; j < backList.length; j++) {
                        if (j == backIndex) {
                            json.BackList = [backList[j]];
                        }
                    }
                }
            }
            self.renderList(flight,"flight");
            window.dialog.modal("hide");
        },
        //选择酒店
        selectedHotel: function (el,target) {
            var self = this,
                _this = $(el),
                dateIndex = _this.parents(".hotel-choose").attr("data-index"),
                hotelData = window.hotel,
                hotel = {};
            for (var i = 0; i < hotelData.length; i++) {
                if (dateIndex == i) {
                    hotel.Hotel = [hotelData[i]];
                }
            }

            //取btn-choose的父级index然后减去dt的index
            hotel.index = _this.parents('dd').index() - 1;
            var content = $(self.content.hotel),
                           tmpl = self.tmpl,
                           hotelHtml = tmpl.hotel(hotel);
            target.empty().append(hotelHtml);
            $($(".J_packedHotel .J_modify-pop")[modifyIndex-1]).addClass("hotelKey" + modifyIndex);
            var hotelKeyIndex = $(".hotelKey" + modifyIndex);
            hotelKeyIndex.attr("hotel-key", selectHotelKey);
            hotelKeyIndex.attr("hotel-index", modifyIndex);
            hotelKeyIndex.attr("data-hotelPrice", hotelPrice);
            window.dialog.modal("hide");
        },
        sortTimeCtrl: function(el){
            var sortAsc = el.hasClass("up");
            if(sortAsc){
                el.attr("title", "按时间由晚到早排序");
                el.removeClass("up");
                el.find("em").html("↓");
            }else{
                el.attr("title", "按时间由早到晚排序");
                el.addClass("up");
                el.find("em").html("↑");
            }
            $(".J_OrderPrice").addClass("up");
            $(".J_OrderPrice").find("em").html("↑");

        },
        sortPriceCtrl: function(el){
            var sortAsc = el.hasClass("up");
            if(sortAsc){
                el.attr("title", "按价格由高到低排序");
                el.removeClass("up");
                el.find("em").html("↓");
            }else{
                el.attr("title", "按价格由低到高排序");
                el.addClass("up");
                el.find("em").html("↑");
            }
            $(".J_OrderTime").addClass("up");
            $(".J_OrderTime").find("em").html("↑");

        },
        sortFlightPrice: function(data,sortDesc){
            //按价格排序
            var self = this,
                clearData = self.filterredData.clearData,
                countChar = sortDesc? 1:-1;
            for (var i = 0; i < clearData.length; i++) {
                var cData = clearData[i],
                    cabin = cData.data;
                cabin = cabin.sort(function (a, b) {
                    return countChar * (b.TotalPrice - a.TotalPrice);
                });
                //cabin[0]有可能是去程,所以,没有totalprice
                cData.TotalFlightPrice = (cabin[0]&&cabin[0].TotalPrice)||(cabin[1]&&cabin[1].TotalPrice); //用于整个去返程航班排序
            }
            clearData = clearData.sort(function(a,b){
                return countChar * (b.TotalFlightPrice - a.TotalFlightPrice);
            });
        },
        /**
         * @desc
         * @param el   被选中的排序节点
         * @param notNeedUpdatestatus  是否需要更新排序节点的状态
         * @param isTriggerBySort  是否是点击了排序节点,主要影响:当主动点击了默认排序时,获取原始数据源,并筛选一次.
         */
        //排序
        sortFlight: function (el,notNeedUpdatestatus,isTriggerBySort) {
            var self = this,
                _datas = self.filterredData,
                _this = $(el),
                dataIndex = _this.attr("data-index");
            if(!notNeedUpdatestatus){
                if(dataIndex === "1"){
                    self.sortPriceCtrl(_this);
                }else if(dataIndex === "0"){
                    self.sortTimeCtrl(_this);
                }
            }
            var isSortDesc = !_this.hasClass("up");
            //如果是价格排序
            if(dataIndex === "1"){
                self.sortFlightPrice(_datas.clearData,isSortDesc);

            }else if(dataIndex === "0"){
                self.sortFlightTime(_datas.clearData,isSortDesc);
            }else{
                if(isTriggerBySort){
                    var filterParam = self.filterCondition();
                    _datas = self.filterData(filterParam);
                }
            }
            self.renderList(_datas,"flightList");
            self.transferTips();
        },
        sortBy: (function () {

            //cached privated objects
            var _toString = Object.prototype.toString,
            //the default parser function
                _parser = function (x) { return x; },
            //gets the item to be sorted
                _getItem = function (x) {
                    return this.parser((_toString.call(x) === "[object Object]" && x[this.prop]) || x);
                };
            // Creates a method for sorting the Array
            // @array: the Array of elements
            // @o.prop: property name (if it is an Array of objects)
            // @o.desc: determines whether the sort is descending
            // @o.parser: function to parse the items to expected type
            return function (array, o) {
                if (!(array instanceof Array) || !array.length) {
                    return [];
                }
                if (_toString.call(o) !== "[object Object]") {
                    o = {};
                }
                if (typeof o.parser !== "function") {
                    o.parser = _parser;
                }
                //if @o.desc is false: set 1, else -1
                o.desc = [1, -1][+!!o.desc];
                return array.sort(function (a, b) {
                    a = _getItem.call(o, a);
                    b = _getItem.call(o, b);
                    return ((a > b) - (b > a)) * o.desc;
                });
            };

        }()),
        sortFlightTime: function(data,isDesc){
            this.sortBy(data, {
                prop: "StartTime",
                desc: isDesc,
                parser: function (item) {
                    return new Date(item.Go.StartDate+" "+item.Go.StartTime);
                }
            });
        },
        setDialog: function (el) {
            var self = this,
                _hotelTarget,
                _this = _hotelTarget = $(el),
                index = _this.attr("data-pop");
            window._hotelTarget = _hotelTarget;
            //如果是航班更换
            var content;
            if(index === "1"){
                content = '<div class="flight-panel" id="modify_pop1">'
                    + '<div class="J_flightList"></div>'
                    + '</div>';
            }else{
                content = '<div class="flight-panel" id="modify_pop2">'
                    + '<p class="fp-title">'
                    + '<span class="label"><i class="right-arrow"></i>酒店信息</span>'
                    + '<a href="javascript:;" class="pop-close close" data-dialog-hide=""></a>'
                    + '</p>'
                    + '<div class="J_hotelList"></div>'
                    + '</div>';
            }
            if (content) {
                var config = {
                    content: content,
                    width: 1190,
                    title: '<p class="fp-title">' +
                            ' <span class="label">  ' +
                            '<i class="right-arrow"></i> ' +
                            '上海 <i class="icons-double"></i> 洛杉矶（往返）  </span>  ' +
                            '<span class="date"> 出发日期：<strong>2016年02月08日</strong> </span>' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;   <span class="date"> 返回日期：<strong>2016年02月14日</strong> </span>   ' +
                            '<em>（64条航班信息）</em> </p>',
                    height: 630,
                    onShow: function(){
                        var index = window._hotelTarget.attr("data-pop");
                        var hotelIndex =window._hotelTarget.attr("hotel-index");
                        self.onshow(index, hotelIndex);
                    }
                };
                $dialog.modal(config);
                window.dialog = $dialog;
            }
        },
        onshow: function (type, hotelIndex) {
            var self = this;
            //人数
            var num = self.calculatePeopleNum(),
                adult = num.adult,
                child = num.child,
                nobed = num.nobed;
            var hotelKey = $(".hotelKey" + hotelIndex);
            if (type == "1") {
                self.getData({
                    loadDiv: ".J_flightList",
                    url: "/dujia/AjaxHelper/FreePackageHandler.ashx?action=GetFlightInfoFreePackage",
                    noresultHtml: "<div class='temai-noresult'><img src='http://img1.40017.cn/cn/v/2015/yushou/no-result.png' alt=''><p>亲，筛选无结果啦，重新筛选吧。</p></div>",
                    param: {
                        flightKey: $("#flightKey").val(),
                        adult: adult,
                        child: child,
                        nobed: nobed,
                        lineDate: $("#hidLineDate").val(),
                        departure: self.param.departure,
                        arrival: self.param.arrival,
                        playDays: $("#hidPlayDays").val(),
                        mpId: self.param.mpId,
                        fid: self.param.fid,
                        Fkey: fKey
                    },
                    deal: function(data){
                        data.clearData = self.dealFlightData(data.Flight);
                        return self.flightSourceData = self.filterredData = data;
                    },
                    render: function (data) {
                        self.renderList(data,"filterFlight");
                        self.renderList(data,"flightList");
                        self.transferTips();
                    }
                });
            } else if (type == "2") {
                self.getData({
                    param: {
                        hotelKey: hotelKey.attr("hotel-key"),
                        index: hotelIndex,
                        adult: adult,
                        child: child,
                        nobed: nobed,
                        lineDate: $("#hidLineDate").val(),
                        hotelPrice: hotelKey.attr("data-hotelPrice")
                    },
                    loadDiv: ".J_hotelList",
                    url: "/dujia/AjaxHelper/FreePackageHandler.ashx?action=GetHotelInfoFreePackage",
                    deal: function(data){
                        return data;
                    },
                    render: function (data) {
                        window.hotel = data.Hotel;
                        self.renderList(data,"hotelList");
                        self.setHotelToggle();

                    }
                });
            }
        },
        setHotelToggle: function () {
            $(".ht-detail-all").each(function () {
                if ($(this).height() > 40) {
                    $(this).parent().next().show();
                } else {
                    $(this).parent().next().hide();
                }
            });
        },
        //中转提示框
        transferTips: function () {
            var self = this;
            if(!self.isInitToolTip){
                self.isInitToolTip = true;
                $dialog.tooltip({
                    width: 560,
                    zIndex: 1000000,
                    content: function (obj) {
                        var text = $(obj).parents(".table-flight-warp").children(".transfer-tips");
                        return text.html();
                    }, //内容,支持html,function
                    delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                    triggerEle: '.J_transfer',//触发元素选择器
                    triggerType: 'hover',//hover|click
                    triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
                });
            }
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
                adult : $("#adult").val(),//成人
                child : $("#child1").val(),//儿童占床
                nobed : $("#child2").val()//儿童不占床
            };
        },
        calculateFun: function (elemClass, inputEl,maxNum) {
            //是否是外部资源 外部资源最大人数为9人 非外部资源最大人数为20人
            //判断余位是大于9还是小于9，大于9的话取9  小于9的话取余位的值
            // var isInterFlight = true;
            var self = this;
            var max = maxNum,
                newNum,
                   input_val = 0,
                   jq_input = $(inputEl),
                   jq_adult = $("#adult"),
                   childNum = 0,//儿童人数
                   min = parseInt(jq_input.attr("min")),
                   priceType = jq_input.attr("price-type");

            var num = self.calculatePeopleNum();
            if (elemClass === "btn-add") {//加法
                input_val = num.totalNum;

                //儿童
                if (priceType == "child") {
                    var adultNum = parseInt(jq_adult.attr("num")),
                        childMax = adultNum * 2,
                        count = adultNum + childMax;
                    if (count < max) {
                        max = childMax + adultNum;
                    }
                }
                if (input_val < max) {
                    input_val = parseInt(jq_input.val());
                    newNum = input_val + 1;
                    jq_input.val(newNum);
                    jq_input.attr("num", newNum);
                    jq_input.parent().find(".btn-sub").removeClass("disable");
                }
            } else if (elemClass === "btn-sub") {//减法
                input_val = parseInt(jq_input.val());
                newNum = input_val - 1;
                if(newNum >= min){
                    jq_input.val(newNum);
                    jq_input.attr("num", newNum);
                }
                if(newNum <= min){
                    jq_input.parent().find(".btn-sub").addClass("disable");
                }
                childNum = num.childNum;
                if (priceType == "adult") {
                    var adultNum = parseInt(jq_adult.attr("num"));
                    if (adultNum * 2 < childNum) {
                        $(".input-num").each(function () {
                            if ($(this).attr("price-type") == "child") {
                                $(this).val("0").attr("num", 0);
                                $(this).prev().addClass("disable");
                            }
                        });
                    }
                }
            }
        },
        calculateTotalPrice: function (el) {
            var _this = $(el),
                jq_totalPrice = $(".J_totalPrice"),
                totalPrice = jq_totalPrice.children("strong").html(),
                diffPrice = _this.prev().children("em").attr("diff-price"),//差价
                diffType = _this.prev().children("em").attr("diff-type");//正 负

            if (diffType == "add") {//正数差价
                totalPrice = parseInt(totalPrice) + parseInt(diffPrice);
            } else if (diffType == "sub") {//负数差价
                totalPrice = parseInt(totalPrice) - parseInt(diffPrice);
            }

            jq_totalPrice.html("<b>¥</b><strong>" + totalPrice + "</strong>");
        },
        //酒店级别hover效果
        hoverHotelLevel:function(){
            $(document).on('mouseover',".J_Starlevel",function(){
                var con='<div class="assess assess-tip">行业网站评定为：<span style="color:#f60">'+$(this).data('info')+'</span><b><i></i></b></div>';
                var levelTop=$(this).offset().top;
                var nameTop=$(this).siblings('.hotelName').offset().top || 0;
                var nameHeight=$(this).siblings('.hotelName').height() ||0;
                if(levelTop>(nameTop+16))
                {
                    con='<div class="assess_right assess-tip">行业网站评定为：<span style="color:#f60">'+$(this).data('info')+'</span></div>';
                    $(this).after(con);
                }else
                {
                    $(this).append(con);
                    $(this).find('.assess').css('left',($(this).siblings('.hotelName').width()-($(this).find('.assess').width()-$(this).width())/2)+'px');
                }
            });

            $(document).on('mouseout','.J_Starlevel',function(){
                $('.assess-tip').remove();
            });

        },
        init: function (cfg) {
            var self = this;
            //泛打包价格日历呈现
            self.initPackedCalendar();
            self.bindEvent();
            self.hoverHotelLevel();
            //下一步按钮
            $(".J_packed").click(function () {
                if (!$(this).hasClass("btn-gray")) {
                    $(".calendar-checked").addClass("none");
                    $(".result-info").removeClass("none");
                    $(".pt-li-two").addClass("current");
                    //人数
                    var num = self.calculatePeopleNum(),
                        adult = num.adult,
                        child = num.child,
                        nobed = num.nobed,
                        childNum = num.childNum,
                        lineDate = $("#hidLineDate").val();

                    var strHtml = '<span>' +
                               '出发日期：<em>' + lineDate + '</em>&nbsp;&nbsp;&nbsp;&nbsp;' +
                                '<em>' + adult + '</em>成人' +
                                '<em>' + childNum + '</em>儿童&nbsp;&nbsp;&nbsp;&nbsp;' +
                                '<a class="J_update" href="javascript:void(0)">修改</a>' +
                                '</span>';
                    self.getData({
                        param: {
                            adult: adult,
                            child: child,
                            nobed: nobed,
                            lineDate: $("#hidLineDate").val()  //去掉注释
                            //lineDate: "2015-9-2"//这个注释掉
                        },
                        loadDiv: ".result-info",
                        url: "/dujia/AjaxHelper/FreePackageHandler.ashx?action=GetFreePackageInfo",
                        deal: function(data){
                            var hotel = data.Hotel;
                            if(!hotel) {
                                return data;
                            }
                            var str,hotelArr = [];
                            for(var i=0;i<hotel.length;i++){
                                var roomId;
                                str = "";
                                if (hotel[i].SingleRoomId >= hotel[i].TwinsRoomId) {
                                    roomId = hotel[i].SingleRoomId;
                                } else {
                                    roomId = hotel[i].TwinsRoomId;
                                }
                                str += hotel[i].HotelId + "," +hotel[i].LiveIndex + "," + roomId;
                                hotelArr.push(str);
                            }
                            self.param.hotel = hotelArr.join("|");
                            self.orderParam.order.Hotel = hotelArr.join("|");
                            fKey = data.Fkey;
                            self.provisionalOrder(data);
                            return data;
                        },
                        render: function (data) {
                            var flag = true;
                            self.renderList(data,"flightAndHotel");
                            $(".J_DepartureDate").html(strHtml);

                            $(".J_book").click(function (e) {
                                if (!$(this).hasClass("btn-gray")) {
                                    e.preventDefault();
                                    var _this = $(this);
                                    _this.html("正在提交...").addClass("disabled");
                                    var orderUrl = "/dujia/AjaxHelper/FreePackageHandler.ashx?action=SubTempInterFlightOrder",
                                        data = self.orderParam.order;
                                    self.orderParam.order.BookDate = lineDate;
                                    self.orderParam.order.SellType = common.getParamFromUrl("selltype", true) || "";
                                    self.orderParam.order.Child = child;
                                    self.orderParam.order.Adult = adult;
                                    self.orderParam.order.NoBed = nobed;
                                    var isGlobal = self.orderParam.IsGlobal.toString();
                                    //是否是国际机票
                                    if (flag === true) {
                                        if (isGlobal === "true") {
                                            flag = false;
                                            $.ajax({
                                                url: self.host + orderUrl,
                                                data: {order: self.provisionalOrderClick(data)},
                                                dataType: "jsonp",
                                                success: function (_data) {
                                                    if (_data) {
                                                        var orderResult = _data.Result;
                                                        //orderResult = true;
                                                        if (orderResult) {
                                                            //返回值为true时创建临时订单的处理
                                                            //立即预订的url
                                                            window.location.href = _data.BookUrl;
                                                        } else {
                                                            var promDialog;
                                                            promDialog = dialog({
                                                                "width": 300,
                                                                "height": 130,
                                                                "content": "<p class='prompt' style='line-height: 120px; text-align: center;'>抱歉，提交超时，请稍后再试。</p>",
                                                                "padding": 0,
                                                                "z-index": 9999,
                                                                "skin": "prompt-dialog",
                                                                "fixed": true
                                                            });
                                                            promDialog.showModal();
                                                            window.dialog = promDialog;
                                                        }
                                                    }
                                                }
                                            });
                                        } else {
                                            flag = false;
                                            $.ajax({
                                                url: self.host + orderUrl,
                                                data: {order: self.provisionalOrderClick(data)},
                                                dataType: "jsonp",
                                                success: function (_data) {
                                                    if (_data) {
                                                        //立即预订url
                                                        window.location.href = _data.BookUrl;
                                                    }
                                                }
                                            });
                                        }
                                    }

                                    Monitor.stat("packaged-book-btn");
                                }
                            });

                            $(".ri-content").delegate(".J_hotelTitle", "click", function () {
                                var content = $(this).parents(".traffic-hotel").next(".pop");
                                Dialog.sysWindows({ "content": content, "title": "酒店介绍" });
                                self.setCarousel();
                            });
                        }
                    });
                    Monitor.stat("packaged-next-btn");
                }
            });
        }
    };
    return Packaged;
});
