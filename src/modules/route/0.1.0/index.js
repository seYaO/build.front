define("route/0.1.0/index",["Common/0.1.0/index","tmpl/pc/newdetails/routeInfo","jCarousel/0.1.0/index","googleMap/0.1.0/index"],function(require){
    var Common = require("common/0.1.0/index");
    var tplRouteInfo = require("tmpl/pc/newdetails/routeInfo"),
        map = require("googleMap/0.1.0/index"),
        __callback,
        isInit = {

        },
        version = "test";
    function init(el,callback){
        __callback = callback;
        hideNav();
        handleRoute(el);
    }
    /**
     * @desc 参考行程处理逻辑
     */
    function handleRoute(el){
        var curVersion = $(".J_travelSort li").filter(function(){
            return $(this).hasClass("cur");
        }).attr("data-version") || "1";
        //version = curVersion;
        var tar = $("#travel" + curVersion);
        if(tar.size()){
            return;
        }
        asyncRoute(curVersion,el);
    }

    /**
     * @desc 行程异步请求
     * @param version 行程版本
     */
    function asyncRoute(version,el){
        var url = (window.host||"") + "/dujia/AjaxFinalTours.aspx?type=QueryTravelDetailInfo";
        //var url= 'http://10.14.40.56:8088/dujia/AjaxFinalTours.aspx?type=QueryTravelDetailInfo&lineId=242736&versionId=1&_=1456713166917';
        var lineId = $("#HidLineid").val();
        $.ajax({
            url :  url,
            data: {
                lineId: lineId,
                versionId: version
            },
            dataType: "jsonp"
        }).then(function(data){
            if(!data||(!data.detail&&!data.flightInfo)){
                $(el).append("<p>暂无行程数据</p>");
                return;
            }
            //当ab行程里只有一个行程时,不显示箭头.
            // 由于需要从class=cur的li上获取data-version,所以不能去除ul
            var singleRoute = $(".J_travelSort li").length <= 1;
            data.singleRoute = singleRoute;
            var _data = dealRouteData(data);
            Common.render({
                data: data,
                tpl: tplRouteInfo,
                context: el,
                overwrite: true,
                callback: function(){
                    var mapData = "";
                    if(data.detail&&data.detail.TravelDetail.length>0){
                        mapData = data.detail.TravelDetail;
                    }
                    if(mapData && data){
                        map.init("",dealMapData(data));
                    }

                    $(".carousel-spot").carousel({
                        visible: 1,
                        auto: false,
                        btnPrev: ".prev",
                        btnNext: ".next"
                    });
                    __callback && __callback.call(this);
                    setSingleInfo();
                    if(data){
                        showNav(dealMapData(data));
                    }

                }
            });
            changeRoute("#J_routeSummary",_data);
        });
    }

    /**
     * @desc 地图数据处理
     * @param {Object} data
     * @return {Array} 返回的是地图数据！！！
     */
    //todo 行程概要里把没有景点的天数也放开。
    function dealMapData(data){
        var mapdata = [];
        if(data.detail&&data.detail.TravelDetail.length>0){
            var subdata = data.detail.TravelDetail,
                len = subdata.length;
            for(var i=0;i<len;i++){
                var obj = {
                    Day:"",
                    ScenicList:[]
                };
                var rouli = subdata[i].RouteList;
                if(rouli.length>0){
                    var sceli = [];
                    for(var j=0;j<rouli.length;j++){
                        if(rouli[j].ScenicList.length>=0){
                            var slist = rouli[j].ScenicList;
                            if (slist.length == 0 ) {
                                slist = "";
                                sceli.push( "" );
                            }else {
                                for(var k=0;k< slist.length;k++){
                                    sceli.push(rouli[j].ScenicList[k]);
                                }
                            }
                        }
                    }
                    if(sceli.length >= 0){
                        obj.Day = subdata[i].Day;
                        obj.ScenicList = sceli;
                        mapdata.push(obj);
                    }
                }
            }
            return mapdata;
        }
    }

    function setSingleInfo(){
        $(".J_singleTitle").click(function () {
            $(".btn-fold").css({display:"block"});
            var content = $(this).parents(".traffic-single").next(".pop");
            Dialog.sysWindows({ "content": content, "title": "附加产品信息介绍" });
            setCarousel();
        });
    }
    function showNav(data){
        var parent = $("#conlist1");
        var cls = "version_"+version;
        //if(isInit[version]){
        //    parent.find("."+cls).css("visibility","visible");
        //    return;
        //}
        parent.empty();
        parent.append('<div class="con-itemlist '+cls+'"></div>');
        parent.find("."+cls).scrollspy({
            curClass:"on",
            contentClass:".travel-day",
            topH:55,
            renderNav: function (sid, stxt, el,index) {
                if(!index){
                    return '<a class="on J_side-tripDay" href="#' + sid + '"><span>' + stxt + '</span></a>';
                }else{
                    return '<a href="#' + sid + '" class="J_side-tripDay"><span>' + stxt + '</span></a>';
                }

            },
            scrollFn: function(navEl,isDown){
                switch(isDown){
                    case 0:
                    case 2: navEl.css({
                        position:"static",
                        display: "none"
                    });break;
                    case 1: navEl.css({
                        position:"fixed",
                        display: "block"
                    });break;
                }
            },
            arrFn:{},
            mapData:data,
        });
        isInit[version] = true;
    }
    function hideNav(){
        var parent = $("#conlist1");
        var cls = ".version_"+version;
        parent.find(cls).css("visibility","hidden");
    }
    /**
     * @desc 行程数据处理
     * @param {Object} data
     * @return {Array} 返回的是行程目的地数据！！！
     */
    //组装后的数据格式
    //var flightData =
    //    {
    //        title: ["航班0", "航班1"],
    //        fightList: [{
    //            "flightGo": [],
    //            "flightBack": []
    //        }, {
    //            "flightGo": [],
    //            "flightBack": []
    //        }]
    //    };
    function dealRouteData(data) {
       // var flight = data.flightInfo;
        var travelDetail = data.detail.TravelDetail;

        var flightData = data.flightInfo;
        var flightNum = [];
        for (var i = 0; i < flightData.length; i++) {
            flightNum.push(flightData[i].GTYVersion);
        }
        flightNum = Common.setArrayDataUnique(flightNum);

        var flight = {};
        flight.title = [];
        flight.fightList = [];
        var index = 1;
        for (var i = 0; i < flightNum.length; i++) {
            flight.title.push("参考航班" + index);
            var flightGo = [];
            var flightBack = [];
            var json = {
                flightGo: flightGo,
                flightBack: flightBack
            };
            index++;
            for (var j = 0; j < flightData.length; j++) {
                if (flightNum[i] == flightData[j].GTYVersion) {
                    if(flightData[j].FlightTrip ===0){
                        flightGo.push(flightData[j]);
                    }
                    if (flightData[j].FlightTrip === 1) {
                        flightBack.push(flightData[j]);
                    }
                }
            }
            flight.fightList.push(json);
        }
        data.flight = flight;

        for( var j=0;j<travelDetail.length;j++){
            travelDetail[j].ShoppingItmes = [];
        }
        var ret = [],valid = 0;
        $.each(travelDetail,function(){
            var list = [];
            var str = "";
            $.each(this.RouteList,function(){
                var shoppingItem = this.ShoppingItmes;
                var ScenicItem = this.ScenicList;
                $.each(shoppingItem,function(){
                    list.push(this.ShoppingName);
                });
                var tmp="";
                if(!ScenicItem||!ScenicItem.length){
                    tmp = ",";
                }
                $.each(ScenicItem,function(){
                    if(this.ScenicName){
                        valid++;
                    }
                    tmp+= (this.ScenicName||"") + ",";
                });
                str += tmp;
            });
            if(str){
                ret.push(str);
            }
            this.ShoppingItmes = list;
            this.MealList = this.RouteList[0] && this.RouteList[0].MealList || [];
            this.Lodge = this.RouteList[0] && this.RouteList[0].Lodge &&this.RouteList[0].Lodge.substring(3) || "";
        });
        ret.valid = valid;
        return ret;
    }

    function changeRoute(el,data){
        var tarEl = $(el);
        if(tarEl.size()){
            var str = "";
            //如果没有数据
            if(!data ||!data.valid){
                tarEl.html('<p>暂时没有相应行程信息，具体行程请咨询客服！</p>');
                return;
            }
            //["苏州,无锡","苏州,无锡"]
            for(var i=0;i<data.length;i++){
                str +='<strong>D'+ (i +1)+'</strong>';
                str +=data[i].replace(/[^,]+/g,function($0){
                    return '<span '+ ($0.length > 6 ? ('title="' + $0 +'"') : '') +'>' + $0.substring(0,6) + '</span>';
                }).replace(/,/g,'<i class="icons-arrow"></i>');
            }
            tarEl.html(str);
        }
    }
    function setCarousel(){
        seajs.use("jCarousel/0.1.1/index", function (Carousel) {
            $(function () {
                var $J_coll = $(".text").find(".J_singLe") || "";
                $J_coll.each(function(i){
                    if($(this).height() <= 48){
                        $(this).next(".btn-fold").css({display: "none"});
                    }else{
                        $(this).addClass("J_collapse");
                    }
                });
                var index = 0;
                $(".pro_msli_pop li").eq(index).addClass("active");
                $(".pro_msli_pop li").on("click", function () {
                    $("#focusPic").attr("src", $(this).find("img").attr("src"));
                    $(this).addClass("active").siblings().removeClass("active");
                    index = $(this).index();
                })
                var car = Carousel(".pro_msli_pop", {
                    canvas: ".pro_msli_bd ul",
                    item: "li",
                    circular: false,
                    visible: 4,
                    preload: 0,
                    btnNav: false,
                    btnPrev: ".group_left",
                    btnNext: ".group_right"
                })
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
                $(".text").find(".btn-fold").click(function(){
                    var _self = $(this);
                    _self.prev().toggleClass("J_collapse");
                    _self.toggleClass("unfold");
                    if(_self.hasClass("unfold")){
                        _self.html("收起");
                    }else{
                        _self.html("展开");
                    }
                });
            });
        });
    }
    return {
        init: init,
        hideNav: hideNav,
        showNav: showNav,
        updateTop: changeRoute
    };
});
