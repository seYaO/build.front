/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
require("/modules/lazyload/0.1.0/index");
var Drag = require('/modules/drag/0.3.0/drag');
var Common = require("/modules/common/0.1.0/index");
var routeTpl = require("./ajaxdot/routelist.dot");
var sceneryTpl = require("./ajaxdot/sceneryinfo.dot");
var Picpop = require("/modules/picpopup/0.4.0/picpopup");
var map = require('modules/googleMap/0.4.0/index');

var MyHotelListMap = undefined;
var pointList = "";

var Index = {};
Index.userName = $("#userName").val();
Index.jobnumber = $("#userId").val();
Index.routeId = parseInt($("#routeId").val());
Index.proType = parseInt($("#proType").val());
Index.destId = parseInt($("#destId").val());
Index.errorInfo = '<div class="error">对不起，此序列没有产品~</div>';
Index.errorSearch = '<div class="error">对不起，没有找到您搜索的产品~</div>';
Index.host = "/intervacation/background/poi/travel/supergopoi/";
Index.poiList = {};
Index.obj=[
    {
        title:"提交行程",
        content:"提交之后将无法再修改，是否确认提交？"
    },
    {
        title:"保存成功",
        content:"行程保存成功，点击预览可查看~"
    },
    {
        title:"保存失败",
        content:"非常抱歉，行程保存失败！"
    },
    {
        title:"提交成功",
        content:"恭喜你，行程提交成功！"
    },
    {
        title:"提交失败",
        content:"非常抱歉，行程提交失败！"
    },
    {
        title:"提交失败",
        content:"请完善你的行程规划，每天都要有内容哦"
    },
    {
        title:"添加失败",
        content:"该信息已添加到行程，不可重复添加哦~"
    }
];

Index.init = function(){
    $(window).scrollTop(0);
    Index.ajaxFn("1,2,3,4",Index.destId,1,false,"");
    Index.setImage();
    Index.poiScroll();
    Index.dragFn();
    Index.sceneryTab();
    Index.deleteRoute();
    Index.addCity();
    Index.chooseTraffic();
    Index.POI_info();
    Index.userFn();
    Index.proFn();
    Index.event();
    Index.delCity();
    Index.addUser();
    Index.addRoute();
    Index.moduleTab();
    Index.mapfilter();
    Index.changeCity();
    Index.subPop();

    $(".textareaIn").each(function(i,elem){
        $(elem).val($(elem).attr("data-value"));
    })
};
Index.setImage= function(){
    $(".drag_Box .picselect").each(function(i,elem){
        if($(elem).siblings(".imageBox") && $(elem).siblings(".imageBox").length >0){
            $(elem).siblings(".imageBox").each(function(m,imageBox){
                var img =[];
                $(imageBox).find("p").each(function (i,image) {
                    var imgObj={
                        ImageId: $(image).attr("data-id"),
                        ImageName: $(image).attr("data-name"),
                        ImageUrl: $(image).attr("data-src")
                    };
                    img.push(imgObj);
                });
                //图片组件
                Index.clickPic($(imageBox).siblings(".picselect"),img);
            })
        }else{
            Index.clickPic(elem);
        }
    });
};
//延迟加载
Index.lazyLoad = function () {
    if (Index.isInit) {
        var imgList = $(".sceneryList img").not("[data-img-loaded]");
        $("body").trigger("addElements", imgList);
    } else {
        $(".sceneryList img").lazyload({
            "data_attribute": "img",
            effect: 'fadeIn'
        });
        Index.isInit = true;
    }
};

//图片组件
Index.clickPic = function(elem,images){
    var defOpt = {
        wrapper: elem,
        defaultImgUrl: [],
        picSource: [],
        selectMode: "multi",
        initLoad: false,
        showRadio: false, //多选时显示单选按钮
        checkImgBtn: false, //是否显示查看图片按钮
        changeImgBtnText:"+添加图片",
        previewImg:true,
        popup: {
            title: "图库（点击图片选中，最多选六张）",
            width: "1000px",
            height: "622px",
            modalSize: "",
            autoSize: false
        },
        paging: {
            data: function(pageindex, pagesize, res) {
                if(new Picpop(defOpt).react.refs.form.getFormData()){
                    var searchIn = new Picpop(defOpt).react.refs.form.getFormData().field2;
                }else{
                    var searchIn = '';
                }
                switch(Index.proType){
                    case 1://国内
                        Index.type="Journey/GuoNeiPicture";
                        break;
                    case 2://出境
                        Index.type="Journey/ChuJingPicture";
                        break;
                    case 3://周边
                        Index.type="Journey/ZhouBianPicture";
                        break;
                    default://如果出错，默认国内
                        Index.type="Journey/GuoNeiPicture";
                        break;
                }
                $.ajax({
                    url:Index.host+Index.type,
                    data:{
                        pageindex: pageindex,
                        pageSize: pagesize,
                        PicName:searchIn
                    },
                    dataType:"json",
                    //dataType:"jsonp",
                    success:function(data){
                        res({
                            total: data.TotalCount,
                            data: data.ListImageData
                        })
                    }
                });
            },
            pagesize: 10,
            range: 10,
            page: 1
        },
        fields: [{
            type: "input",
            field: "field2",
            label: "图片名称",
            option: {
                "aria-validate": "required"
            }
        }],
        dataFormat: function(data) {
            return {
                Id: data.ImageId,
                Name: data.ImageName,
                Url: data.ImageUrl,
                isShow: 0
            }
        },
        searchField: {
            isInterface: 1
        }
    };
    new Picpop(defOpt);
    if(images && images.length>0){
        new Picpop(defOpt).react.setSelectPic(images);
    }
    new Picpop(defOpt).on("item.click", function(e, data, a) {
        var item = new Picpop(defOpt).react.getItem();
        if(item.length >6){
            $(".subTitle").html("图片选中提示");
            $(".subContent").html("新增图片不允许超过6张，请重新选择！");
            $(".submitBtn").attr("data-flag",0);
            $(".subPop").removeClass("none");
            $(".popBg").removeClass("none");
        }else{
            new Picpop(defOpt).react.setSelectPic(item);
            new Picpop(defOpt).react.hide();
        }

    });
    new Picpop(defOpt).on("item.search", function(e, data) {
        new Picpop(defOpt).react.reload();
    });
};
//行程交换
Index.event = function(){
    //切换每天行程
    $(".daylistBox li").on("click",function(){
        $(".daylistBox li").removeClass("active");
        $(this).addClass("active");
        var li_index = $(this).attr("data-start");
        $(".routeList").addClass("none");
        $(".routeList[data-day="+li_index+"]").removeClass("none");
    });
    //查看前一天，后一天行程
    $(".next").on("click",function(){
        var li_index = parseInt($(this).parents(".routeList").attr("data-day"));
        if(li_index < $(".next").length){
            $(".routeList").addClass("none");
            $(".routeList[data-day="+(li_index+1)+"]").removeClass("none");
            $(".dayList .daylistBox li").removeClass("active");
            $(".dayList .daylistBox li[data-start="+(li_index+1)+"]").addClass("active");
        }
    });
    $(".prev").on("click",function(){
        var li_index = parseInt($(this).parents(".routeList").attr("data-day"));
        if(li_index >1){
            $(".routeList").addClass("none");
            $(".routeList[data-day="+(li_index-1)+"]").removeClass("none");
            $(".dayList .daylistBox li").removeClass("active");
            $(".dayList .daylistBox li[data-start="+(li_index-1)+"]").addClass("active");
        }
    })
};
//拖拽组件
Index.dragFn = function(){
    var matched, browser;
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) || [];
        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };
    matched = jQuery.uaMatch( navigator.userAgent );
    browser = {};
    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }
    jQuery.browser = browser;

    new Drag(
        {
            wrapper: $("ul.daylistBox"),//放元素的外层容器
            dragSelector: "li",
            dragBetween: false,
            dragSelectorExclude : ".dayBox .chooseBtn,.dayBox .day_city",
            dragEnd:function(){
                Index.dayDetail();
            },
            placeHolderTemplate: "<li class='placeHolder'><div></div></li>"  //一个元素的dom
        }
    );
    new Drag(
        {
            wrapper: $("ul.routeInfo"),//放元素的外层容器
            dragSelector: "li",
            dragBetween: false,
            dragSelectorExclude : ".slideInDown a,.trafficInfo li p,.trafficInfo li p.traffic_check,.trafficInfo li.t_info .nameBox,.trafficInfo li .routeLineBox,.c_traffic li,.c_traffic i,.module-popup-title,.row .col-xs-12,.module-popup-content,.form-search,.validate,button,.page a,.panel-body,.module-listbox,.img-box img,.skip a,.next a,.prev a,.next a i,.prev a i,.btn-contain,.pagelist,.img-box img,.drag_Box .trafficIN,.imgBox .bico-close,.sceneryLi img,.sceneryLi .title span:first,.drag_Box .action,.route .action_choose,.scenery .btnList span,.scenery .i_close,.scenery .customBox,.route input,.scenery input,.scenery textarea,.t_choose li,.t_choose,.picselect,.picselect .module-popup",
            dragEnd:function(){
                Index.routeMap(this);
            },
            opacity: 1, //拖动时，透明度为0.5
            placeHolderTemplate: "<li class='placeHolder'><div></div></li>"  //一个元素的dom
        }
    );
};
//行程产品列表 tab
Index.sceneryTab = function(){
    $(".J_scenery").on("click",function(){
        var rType = $(this).attr("data-type");
        var cityId = $(".cityName").attr("data-cityId");
        if(!$(this).hasClass("active")){
            $(".J_scenery").removeClass("active");
            $(this).addClass("active");
        }
        //发送异步获取数据
        if($(this).attr("data-type") == 0){
            $(".sceneryList").addClass("none");
            $(".customList").removeClass("none");
        }else{
            $(".customList").addClass("none");
            $(".sceneryList").removeClass("none");
            Index.ajaxFn(rType,cityId,1,true,"");
            Index.index=1;
            Index.top = 600;
            Index.name = "";
            $(".searchIn input").val("");
            $(".sceneryList").scrollTop(0);
        }
    })
};
/**
 * 渲染逻辑同touch
 * @param config
 */
Index.Render = function (config) {
    var tpl = config.tpl,
        key = config.key,
        data = config.data[key] || config.data,
        context = $(config.context),
        callback = config.callback,
        _html = tpl(data),
        cxt;
    if (config.overwrite) {
        context.empty();
    }
    cxt = $(_html).appendTo(context);
    if (callback && $.isFunction(callback)) {
        callback.call(cxt, config);
    }
};
//滚动加载异步
Index.poiScroll = function () {
    Index.index = 1;
    Index.top = 600;
    $(".sceneryList").scroll(function(){
        if($(".sceneryList").scrollTop() > Index.top){
            var rType = $(".typeList li.active").attr("data-type");
            var cityId = $(".cityName").attr("data-cityId");
            Index.name = encodeURIComponent($(".searchIn input").val());
            Index.index = Index.index+1;
            Index.top = 600*Index.index;
            Index.ajaxFn(rType,cityId,Index.index,false,Index.name)
        }
    });
};
//POI列表筛选
Index.ajaxFn = function(rType,cityId,index,flag,name){
    $.ajax({
        url: Index.host+"JourneyInfo/GetPoiInfoList",
        data:"type="+rType+"&CityId="+cityId+"&pagesize=15&pageindex="+index+"&Name="+name,
        dataType: "json",
        //dataType: "jsonp",
        success: function (data) {
            if(data.StatusCode == 200){
                if(flag){
                    $(".sceneryList").html("");
                }
                var routeData = data.ReturnValue;
                if(routeData.POIInfoList.length > 0){
                    Index.Render({
                        tpl: routeTpl,
                        key: "routelist",
                        data: routeData.POIInfoList,
                        overwrite: false,
                        context: $(".sceneryList"),
                        callback: function(){
                            Index.lazyLoad();
                        }
                    });
                }
            }else{
                if($(".sceneryList .sceneryLi").length == 0 || flag){
                    $(".sceneryList").html(Index.errorInfo);
                }
            }
        }
    })
};
//POI产品搜索
Index.proFn = function(){
    $(".searchIn input").keyup(function (event) {
        if(event.keyCode == 13){
            Index.proAjax();
        }
    });
    $(".searchIn i").on("click",function(){
        Index.proAjax();
    })
};
//产品搜索异步
Index.proAjax = function(){
    var rType = $(".typeList .active").attr("data-type");
    var cityId = $(".cityDest .cityName").attr("data-cityId");
    $.ajax({
        url: Index.host+"JourneyInfo/GetPoiInfoList",
        data:"type="+rType+"&CityId="+cityId+"&Name="+encodeURIComponent($(".searchIn input").val())+"&pageindex=1&pagesize=15",
        dataType: "json",
        //dataType:"jsonp",
        success:function(data){
            if(data.StatusCode == 200){
                $(".sceneryList").html("");
                var routeData = data.ReturnValue;
                if(routeData.POIInfoList.length > 0){
                    Index.Render({
                        tpl: routeTpl,
                        key: "routelist",
                        data: routeData.POIInfoList,
                        overwrite: false,
                        context: $(".sceneryList"),
                        callback: function(){
                            Index.lazyLoad();
                        }
                    });
                }else{
                    $(".sceneryList").html(Index.errorSearch);
                }
            }else{
                $(".sceneryList").html(Index.errorSearch);
            }
        }
    })
};
//删除行程
Index.deleteRoute = function(){
    $(document).delegate(".drag_Box .action","click",function(){
        var _self = this;
        var routeBox = $(_self).parents(".routeList").attr("data-day");
        if($(_self).parents("li").hasClass("journey")){
            var id = $(_self).parents(".route").attr("data-poiid");
            var idList = $(_self).parents(".routeInfo").siblings("#idList").val().split(",");
            var index = idList.indexOf(id);
            idList.splice(index,1);
            $(_self).parents(".routeInfo").siblings("#idList").val(idList.join(","));
        }

        $(_self).parents(".drag_Box").remove();

        $(".routeList[data-day="+routeBox+"]").find(".journey").each(function(i,elem){
            $(elem).attr("data-start",(i+1));
            $(elem).attr("data-route",(i+1));
            $(elem).find(".number").html(i+1);
            $(elem).find(".t_choose .c_traffic li").removeClass("active");
            $(elem).find(".t_choose .c_traffic li[data-type=1]").addClass("active");
            $(elem).find(".t_choose .trafficInfo li").addClass("none");
            $(elem).find(".t_choose .trafficInfo li[data-type=1]").removeClass("none");
            $(elem).find(".t_choose .trafficInfo .traffic_check").removeClass("active");
            $(elem).find(".t_choose .trafficInfo .traffic_check").html("设为默认");
            $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").addClass("active");
            $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").html("已设默认");

            if($(elem).next().hasClass("journey")){
                $(elem).find(".traffic").removeClass("none");
                Index.trafficFn($(elem).find(".action_choose"),1);
            }else{
                $(elem).find(".traffic").addClass("none");
            }
        });
    });
};
//城市添加触发
Index.addCity = function(){
    $(document).bind('click',function(){
        $(".dayList .cityList,.routeCity .cityList").addClass("none");
    });

    $('.cityBox .chooseBtn,.dayBox .chooseBtn,.dayList .cityList,.routeCity .cityList').bind('click',function(event){
        event.stopPropagation();
    });
    $(".dayBox .chooseBtn").on("click",function(){
        var _self = this;
        var li_index = $(_self).parents("li").attr("data-start");
        var cityList = $(_self).siblings(".day_city");
        $(".cityList li").removeClass("none");
        $(cityList).each(function(index,elem){
            var cityId = $(elem).attr('data-cityId');
            $(this).parents(".dayList").find(".cityList li[data-cityId="+cityId+"]").addClass("none");
        });
        var self_index = $(_self).attr("data-index");
        var self_top = 76*self_index+60;
        if($(".dayList .cityList li").length != $(cityList).length){
            $(".dayList .cityList").removeClass("none").css("top",self_top);
            $(this).removeClass("none");
            $(".routeCity .addCity").eq(li_index-1).removeClass("none");
        }else{
            $(".dayList .cityList").addClass("none");
            $(this).addClass("none");
            $(".routeCity .addCity").eq(li_index-1).addClass("none");
        }
        Index.cityFn(_self,li_index);
    });

    $(".cityBox .chooseBtn").on("click",function(){
        var _self = this;
        var route_index = $(_self).parents(".routeList").attr("data-day");
        var cityList = $(_self).siblings(".day_city");
        $(cityList).each(function(index,elem){
            var cityId = $(elem).attr('data-cityId');
            $(_self).parent().siblings(".cityList").find("li[data-cityId="+cityId+"]").addClass("none");
        });
        if($(_self).parent().siblings(".cityList").find("li").length != $(cityList).length){
            $(".routeCity .cityList").removeClass("none").css({"top":"60px","left":"100px"});
            $(this).removeClass("none");
            $(".dayList .day_add").eq(route_index-1).removeClass("none");
        }else{
            $(".routeCity .cityList").addClass("none");
            $(this).addClass("none");
            $(".dayList .day_add").eq(route_index-1).addClass("none");
        }
        Index.cityFn(_self,route_index);
    })
};
//城市添加
Index.cityFn = function(_self,index){
    var cityName,cityId;
    $(".cityList li").unbind().bind("click",function(){
        cityName = $(this).html();
        cityId = $(this).attr("data-cityId");
        var liParentIndex;
        $(this).addClass("none");

        if($(_self).hasClass("choose_city")){//选择城市
            liParentIndex = $(_self).parents("li").attr("data-start");
            $(_self).addClass("none");
            if($(_self).siblings(".day_city").length>0 && $(_self).siblings(".day_city").length <2){
                $(_self).siblings(".day_add").before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
                $(_self).siblings(".day_add").removeClass("none");
            }else if($(_self).siblings(".day_city").length == 0){
                $(_self).siblings(".day_add").before('<span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
                $(_self).siblings(".day_add").removeClass("none");
            }else if($(_self).siblings(".day_city").length ==2){
                $(_self).siblings(".day_add").before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
                $(_self).siblings(".day_add").addClass("none");
            }

            $(".dayList .cityList").addClass("none");

            //城市联动
            Index.cityLine($(_self).parent(),index);
        }else if($(_self).hasClass("day_add")){//“+”添加城市
            liParentIndex = $(_self).parents("li").attr("data-start")
            if($(_self).siblings(".day_city").length>0 && $(_self).siblings(".day_city").length <2){
                $(_self).before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
            }else if($(_self).siblings(".day_city").length ==2){
                $(_self).before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
                $(_self).addClass("none");
            }else if($(_self).siblings(".day_city").length==0){
                $(_self).before('<span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
            }

            $(".dayList .cityList").addClass("none");

            //城市联动
            Index.cityLine($(_self).parent(),index);
        }else{//增加城市
            liParentIndex = $(_self).parents(".routeList").attr("data-day")
            if($(_self).siblings(".day_city").length>0 && $(_self).siblings(".day_city").length <2){
                $(_self).before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
            }else if($(_self).siblings(".day_city").length ==2){
                $(_self).before('<i>-</i><span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
                $(_self).addClass("none");
            }else if($(_self).siblings(".day_city").length==0){
                $(_self).before('<span class="day_city day_city_name" data-cityId="'+cityId+'" title="'+cityName+'">'+cityName+'</span>');
            }

            $(".routeCity .cityList").addClass("none");

            //城市联动
            Index.cityLine($(_self).parent(),index);

            //地图城市联动
            if(!$('.mappanel').hasClass('none')){
                Index.mapAjax(map);
            }
        }
        if($(this).parent().find("li").length ==  $(_self).siblings(".day_city").length){
            $(".dayList .day_add ").eq(liParentIndex-1).addClass("none");
            $(".routeCity .addCity").eq(liParentIndex-1).addClass("none");
        }
    })
};
//城市联动
Index.cityLine = function( _self,index){
    var html,cityList,totalHtml="";
    cityList=$(_self).find(".day_city");
    var endCity = cityList.last();
    if($(_self).hasClass("dayBox")){//天数列表--在行程列表同步
        $(".routeList[data-day='"+index+"']").find(".cityBox").find("i").remove();
        $(".routeList[data-day='"+index+"']").find(".cityBox").find(".day_city").remove();
        if(cityList.length >=3){
            $(".routeList[data-day='"+index+"']").find(".addCity").addClass("none");
        }else{
            $(".routeList[data-day='"+index+"']").find(".addCity").removeClass("none");
        }
        for(var i=0; i<cityList.length;i++){
            if(index !=1 && i==0){
                html=cityList[i].outerHTML;
            }else{
                html = '<i>-</i>'+cityList[i].outerHTML;
            }
            totalHtml+=html;
        }
        if($(".routeList[data-day='"+(parseInt(index)+1)+"']").length>0){
            if($(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city")){
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city").attr("data-cityId",endCity.attr("data-cityId"));
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city").html(endCity.html());
            }else{
                var s_html = '<span class="route_start_city" data-cityId="'+endCity.attr("data-cityId")+'" >'+endCity.html()+'</span>';
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".addCity").before(s_html);
            }
        }
        $(".routeList[data-day='"+index+"']").find(".addCity").before(totalHtml);
    }else{//行程列表--在天数列表同步
        $(".daylistBox li[data-start='"+index+"']").find(".dayBox").find("i").remove();
        $(".daylistBox li[data-start='"+index+"']").find(".dayBox").find(".day_city").remove();
        $(".daylistBox li[data-start='"+index+"']").find(".choose_city ").addClass("none");
        if(cityList.length >=3){
            $(".daylistBox li[data-start='"+index+"']").find(".day_add").addClass("none");
        }else{
            $(".daylistBox li[data-start='"+index+"']").find(".day_add").removeClass("none");
        }
        for(var i=0; i<cityList.length;i++){
            if(i==0){
                html = cityList[i].outerHTML;
            }else{
                html = '<i>-</i>'+cityList[i].outerHTML;
            }
            totalHtml+=html;
        }
        if($(".routeList[data-day='"+(parseInt(index)+1)+"']").length>0){
            if($(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city")){
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city").attr("data-cityId",endCity.attr("data-cityId"));
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".route_start_city").html(endCity.html());
            }else{
                var s_html = '<span class="route_start_city" data-cityId="'+endCity.attr("data-cityId")+'" >'+endCity.html()+'</span>';
                $(".routeList[data-day='"+(parseInt(index)+1)+"']").find(".addCity").before(s_html);
            }
        }
        $(".daylistBox li[data-start='"+index+"']").find(".day_add").before(totalHtml);
    }
};
//城市删除
Index.delCity = function () {
    var cityName,cityId,flag=0;
    $(document).delegate(".day_city","click",function(){
        var _self = $(this).parent();
        if($(_self).hasClass("dayBox")){
            var city_index = $(this).parents("li").attr("data-start");
            var cityList = $(this).parents(".daylistBox").siblings(".cityList");
        }else{
            var city_index = $(this).parents(".routeList").attr("data-day");
            var cityList = $(this).parents(".cityBox").siblings(".cityList")
        }
        cityName = $(this).html();
        cityId = $(this).attr("data-cityId");
        if($(this).prev().hasClass("choose_city") || $(this).prev().length === 0){
            $(this).next("i").remove();
            $(this).remove();
        }else{
            $(this).prev("i").remove();
            $(this).remove();
        }

        $(cityList).each(function(i,elem){
            if($(elem).attr("data-cityId") == cityId){
                flag = 1;//1--说明存在该城市   0--代表不存在该城市
            }
        });
        if(flag == 0){
            $(cityList).find("li[data-cityId="+cityId+"]").removeClass("none");
        }

        if($(_self).find(".day_city").length < 3){
            if($(_self).hasClass("dayBox")){
                $(_self).find(".day_add").removeClass("none");
            }else{
                $(_self).find(".addCity").removeClass("none");
            }
        }
        Index.cityLine(_self,city_index);
    })
};
//选择交通
Index.chooseTraffic = function(){
    var actionObj,travelMode;
    $(document).delegate(".action_choose","click",function(){
        actionObj = this;
        //第一次点击选择交通
        if($(actionObj).attr("data-click") == 0){
            Index.trafficFn(actionObj,0);
        }
        var index= $(this).parents("li").attr("data-start");
        var top=$(actionObj).offset().top-$(this).parents(".routeLine").offset().top;
        $(this).parent().siblings(".t_choose").css("top",top+"px");
        $(this).parent().siblings(".t_choose").removeClass("none");
    });
    $(document).delegate(".c_traffic li","click",function(){
        $(this).parents(".c_traffic").find("li").removeClass("active");
        $(this).addClass("active");
        switch($(this).attr("data-type")){
            case '1'://步行
                travelMode = "walking";
                break;
            case '2'://公交
                travelMode = "transit";
                break;
            case '3'://自驾
                travelMode = "drinving";
                break;
        }
        var cityOne = {
            lng: $(this).parents(".t_choose").siblings(".sceneryLi").attr("data-gglon"),
            lat: $(this).parents(".t_choose").siblings(".sceneryLi").attr("data-gglat"),
            name:$(this).parents(".t_choose").siblings(".sceneryLi").attr("data-name")
        };
        var cityTwo = {
            lng: $(this).parents("li").next().find(".sceneryLi").attr("data-gglon"),
            lat: $(this).parents("li").next().find(".sceneryLi").attr("data-gglat"),
            name:$(this).parents("li").next().find(".sceneryLi").attr("data-name")
        };
        Index.trafficMap(cityOne,cityTwo,travelMode,$(this).parents('.t_choose'),0,parseInt($(this).attr("data-type")));
    });
    $(document).delegate(".t_choose .close","click",function(){
        $(this).parents(".t_choose").addClass("none");
    });

    $(document).delegate(".t_choose .traffic_check","click",function(){
        var traffic = $(this).parents(".trafficInfo").siblings(".c_traffic").find(".active").attr("data-name");
        var trafficType = $(this).parents(".trafficInfo").siblings(".c_traffic").find(".active").attr("data-type");

        $(this).parents(".t_choose").siblings(".traffic").find(".action_choose").attr("data-click",1);
        $(this).parents(".t_choose").siblings(".traffic").find(".trafficType").html(traffic).removeClass("noTraffic");
        $(this).parents(".t_choose").siblings(".traffic").find(".trafficType").attr("data-type",trafficType);
        $(this).parents(".t_choose").siblings(".traffic").find(".trafficDistance").html(Index.trafficObj.distance);
        $(this).parents(".t_choose").siblings(".traffic").find(".trafficDistance").attr("data-distance",Index.trafficObj.distance.split(" ")[0]);

        $(this).parents(".t_choose").find(".traffic_check").removeClass("active");
        $(this).parents(".t_choose").find(".traffic_check").html("设为默认");

        $(this).html("已设默认");
        $(this).addClass("active");
        $(this).parents(".t_choose").addClass("none");
    })
};
//交通方法
Index.trafficFn = function(_self,index){
    var startCity,endCity,travelMode,elem;

    startCity = $(_self).parent().siblings(".sceneryLi");
    endCity = $(_self).parents("li").next().find(".sceneryLi");
    var cityOne = {
        lng: $(startCity).attr("data-gglon"),
        lat: $(startCity).attr("data-gglat"),
        name:$(startCity).attr("data-name")
    };
    var cityTwo = {
        lng: $(endCity).attr("data-gglon"),
        lat: $(endCity).attr("data-gglat"),
        name:$(endCity).attr("data-name")
    };

    travelMode = "walking";
    if(index ==1){//拖动或者删除
        elem = $(_self)
    }else{
        elem =$(_self).parent().next('.t_choose')
    }
    Index.trafficMap(cityOne,cityTwo,travelMode,elem,index,1);
};
//交通路线获取
Index.trafficMap = function (cityOne,cityTwo,travelMode,elem,index,trafficType,isAddJourney) {

    $.ajax({
        url:"/intervacation/ajax/maps/directions",
        data:"alternatives=false&origin="+cityOne.lat+","+cityOne.lng+"&destination="+cityTwo.lat+","+cityTwo.lng+"&mode="+travelMode,
        dataType:"json",
        success:function(directionsResult){
            if (directionsResult.routes != undefined && directionsResult.routes.length > 0
                && directionsResult.routes[0].legs != undefined && directionsResult.routes[0].legs.length != 0) {
                var distance = directionsResult.routes[0].legs[0].distance.text.split(" ")[0];
                if(isAddJourney && isAddJourney == 1) {//新添加的行程
                    $(elem).find(".trafficDistance").html(directionsResult.routes[0].legs[0].distance.text)
                        .attr('data-distance', distance);
                    $(elem).find(".trafficType").html('步行').attr('data-type', 1).removeClass("noTraffic");
                    $(elem).find(".action_choose").attr('data-click', 0);
                    $(elem).find(".t_choose .c_traffic li").removeClass("active");
                    $(elem).find(".t_choose .c_traffic li[data-type=1]").addClass("active");
                    $(elem).find(".t_choose .trafficInfo li").addClass("none");
                    $(elem).find(".t_choose .trafficInfo li[data-type=1]").removeClass("none");
                    $(elem).find(".t_choose .trafficInfo li .traffic_check").removeClass("none");
                    $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").addClass("active");
                    $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").html("已设默认");
                } else {
                    var trafficHtml =
                        '<p>路线一</p>' +
                        '<div class="r_info">' +
                        '<div class="iconBox">' +
                        '<i class="sicon"></i>' +
                        '<i class="licon"></i>' +
                        '<i class="eicon"></i>' +
                        '</div>' +
                        '<div class="nameBox">' +
                        '<p class="t_star">' + cityOne.name + '</p>' +
                        '<p class="distance">' + directionsResult.routes[0].legs[0].distance.text + '(' + directionsResult.routes[0].legs[0].duration.text + ')' + '</p>' +
                        '<p class="t_end">' + cityTwo.name + '</p>' +
                        '</div>' +
                        '</div>';
                    $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").find(".routeLineBox").html(trafficHtml);
                    $(elem).find(".trafficInfo .t_info").addClass("none");
                    $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").removeClass("none");
                    $(elem).find(".c_traffic li").removeClass("active");
                    $(elem).find(".c_traffic li[data-type=" + trafficType + "]").addClass("active");
                    $(elem).find(".t_choose .trafficInfo li .traffic_check").removeClass("none");
                    Index.trafficObj = {
                        start: cityOne.name,
                        end: cityTwo.name,
                        distance: directionsResult.routes[0].legs[0].distance.text
                    };
                    if (index == 1) {//拖拽回调默认加载步行
                        $(elem).siblings(".trafficType").attr("data-type", "1");
                        $(elem).siblings(".trafficType").html("步行").removeClass("noTraffic");
                        $(elem).siblings(".trafficDistance").html(Index.trafficObj.distance);
                        $(elem).siblings(".trafficDistance").attr("data-distance",Index.trafficObj.distance.split(" ")[0]);
                    }
                    return Index.trafficObj;
                }
            }else{
                if(isAddJourney && isAddJourney == 1){
                    $(elem).find(".trafficDistance").html("")
                        .attr('data-distance', 0);
                    $(elem).find(".trafficType").html('步行暂无数据，建议选择其他交通方式为默认').attr('data-type', 0).addClass("noTraffic");
                    $(elem).find(".action_choose").attr('data-click', 0);
                }else{
                    var trafficHtml ="没有查询到所交通数据";
                    $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").find(".routeLineBox").html(trafficHtml);
                    $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").find(".traffic_check").addClass("none");
                    $(elem).find(".trafficInfo .t_info").addClass("none");
                    $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").removeClass("none");
                    if (index == 1) {//拖拽回调默认加载步行
                        $(elem).siblings(".trafficType").attr("data-type", 0);
                        $(elem).siblings(".trafficType").html("步行暂无数据，建议选择其他交通方式为默认").addClass("noTraffic");
                        $(elem).siblings(".trafficDistance").html("");
                        $(elem).siblings(".trafficDistance").attr("data-distance",0);
                    }
                }
            }
        },
        error:function(){
            if(isAddJourney && isAddJourney == 1){
                $(elem).find(".trafficDistance").html("")
                    .attr('data-distance', 0);
                $(elem).find(".trafficType").html('').attr('data-type', 0);
                $(elem).find(".action_choose").attr('data-click', 0);
            }else{
                var trafficHtml ="没有查询到所交通数据";
                $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").find(".routeLineBox").html(trafficHtml);
                $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").find(".traffic_check").addClass("none");
                $(elem).find(".trafficInfo .t_info").addClass("none");
                $(elem).find(".trafficInfo .t_info[data-type=" + trafficType + "]").removeClass("none");
            }
        }
    });
};
//poi详细信息
Index.POI_info = function(){
    var that,poiId,mapData;
    $(document).delegate(".sceneryLi img,.sceneryLi .title","click",function(){
        that = $(this).parents(".sceneryLi");
        poiId = $(that).attr("data-poiid");
        $.ajax({
            url:Index.host+"JourneyInfo/GetPoiInfoDetail",
            data:"PoiId="+poiId,
            dataType: "json",
            //dataType: "jsonp",
            success: function (data) {
                if(data){
                    if(data.StatusCode == 200){
                        mapData = data.ReturnValue;
                        Index.Render({
                            tpl: sceneryTpl,
                            key: "sceneryinfo",
                            data: data.ReturnValue,
                            overwrite: true,
                            context: $(".sceneryInfo"),
                            callback: function(){
                                var data = {
                                    'PEImageUrl':mapData.imgurl,
                                    'PEPlayTime':mapData.playtime,
                                    'PIArea2Id':0,
                                    'PIId':mapData.poiid,
                                    'PILatGG':mapData.gglat,
                                    'PILonGG':mapData.gglon,
                                    'PIName':mapData.poiname,
                                    'PINameEN':'',
                                    'PIPOISerialNumber':mapData.poiid,
                                    'PIStars':mapData.score,
                                    'PIType1Id':mapData.type
                                }
                                var datas = [];
                                datas.push(data);
                                window.pointList = datas;
                                map.init(document.getElementById('ui-sceneryMap'));
                            }
                        });
                        if($(that).hasClass("route")){
                            $(".sceneryInfo .sceneryAdd").addClass("none");
                        }else{
                            $(".sceneryInfo .sceneryAdd").removeClass("none");
                        }
                        $(".proList").addClass("none");
                        $(".sceneryInfo").css({'visibility':'visible'});
                    }
                }else{
                    alert("此产品无详细信息~");
                }
            }
        })
    });
    $(document).delegate(".sceneryClose","click",function(){
        $(".proList").removeClass("none");
        $(".sceneryInfo").css({'visibility':'hidden'});
    })
    //地图跳转
    $(document).delegate('.J_mapTitle','click',function(){
        poiId = $(this).attr("data-pid");
        $.ajax({
            url:Index.host+"JourneyInfo/GetPoiInfoDetail",
            data:"PoiId="+poiId,
            dataType: "json",
            success: function (data) {
                if(data){
                    if(data.StatusCode == 200){
                        mapData = data.ReturnValue;
                        Index.Render({
                            tpl: sceneryTpl,
                            key: "sceneryinfo",
                            data: data.ReturnValue,
                            overwrite: true,
                            context: $(".sceneryInfo"),
                            callback: function(){
                                var data = {
                                    'PEImageUrl':mapData.imgurl,
                                    'PEPlayTime':mapData.playtime,
                                    'PIArea2Id':0,
                                    'PIId':mapData.poiid,
                                    'PILatGG':mapData.gglat,
                                    'PILonGG':mapData.gglon,
                                    'PIName':mapData.poiname,
                                    'PINameEN':'',
                                    'PIPOISerialNumber':mapData.poiid,
                                    'PIStars':mapData.score,
                                    'PIType1Id':mapData.type
                                }
                                var datas = [];
                                datas.push(data);
                                window.pointList = datas;
                                map.init(document.getElementById('ui-sceneryMap'));
                            }
                        });
                        // if($(that).hasClass("route")){
                        //     $(".sceneryInfo .sceneryAdd").addClass("none");
                        // }else{
                        //     $(".sceneryInfo .sceneryAdd").removeClass("none");
                        // }
                        $(".proList").addClass("none");
                        $(".sceneryInfo").css({'visibility':'visible'});
                    }
                }else{
                    alert("此产品无详细信息~");
                }
            }
        })
    });

};
//行程时间交换
Index.dayDetail = function(){
    var day_index,route_index;
    //更换行程详情
    $(".routeList").each(function (i, elem) {
        route_index = $(elem).attr("data-day");
        var new_index = $(".daylistBox li[data-start='"+route_index+"']").index()+1;
        //console.log(route_index,new_index);
        $(elem).attr("data-day",new_index);
        $(elem).attr("data-date","day_"+new_index);
        $(elem).find(".dayNum").html("第"+new_index+"天");
    });
    //更换行程的出发城市
    $(".routeList").each(function (i, elem) {
        route_index = $(elem).attr("data-day");
        if(route_index ==1){
            $(elem).find(".route_start_city").html("出发地");
            $(elem).find(".route_start_city").attr("data-startCityid",$("#startCity").val());
        }else{
            var new_start_city = $(".routeList[data-day='"+(route_index-1)+"']").find(".day_city").last();
            $(elem).find(".route_start_city").html(new_start_city.html());
            $(elem).find(".route_start_city").attr("data-startCityid",new_start_city.attr("data-cityId"));
        }
    });

    //更换天数列表
    $(".daylistBox li").each(function(i,elem){
        day_index = $(elem).index();
        $(elem).removeClass().addClass("day_"+day_index);
        $(elem).find(".day_icon").html("D"+(day_index+1));
        $(elem).find(".chooseBtn").attr("data-index",day_index);
        $(elem).attr("data-start",(day_index+1));
    });
    $(".routeList").addClass("none");
    $(".routeList[data-day='1']").removeClass("none");
};
//自由文本编辑
Index.userFn = function(){
    $(document).delegate(".btnList span","click",function(){
        if($(this).attr("data-click") == 1){
            var d_channel = $(this).attr("data-channel");
            $(this).parent().siblings(".sceneryInput[data-channel='"+d_channel+"']").removeClass("none");
            $(this).attr("data-click",0);
            //$(this).css("background","#666");
            $(this).addClass("active");
        }
    });
    $(document).delegate(".sceneryInput .i_close","click", function () {
        $(this).parents(".sceneryInput").addClass("none");
        var channel = $(this).parents(".sceneryInput").attr("data-channel");
        $(this).siblings(".textIn").val("");
        $(this).parents(".sceneryInput").siblings(".btnList").find("span[data-channel="+channel+"]").attr("data-click","1");
        //$(this).parents(".sceneryInput").siblings(".btnList").find("span[data-channel="+channel+"]").css("background","#23a8f5");
        $(this).parents(".sceneryInput").siblings(".btnList").find("span[data-channel="+channel+"]").removeClass("active");
    })
};

//行程交换，获取交通路线
Index.routeMap = function (_self) {
    $(_self).parents(".routeInfo").find(".journey").each(function(i,elem){
        $(elem).attr("data-start",(i+1));
        $(elem).attr("data-route",(i+1));
        $(elem).find(".number").html(i+1);
        $(elem).find(".action_choose").attr("data-click",0);
        $(elem).find(".t_choose .c_traffic li").removeClass("active");
        $(elem).find(".t_choose .c_traffic li[data-type=1]").addClass("active");
        $(elem).find(".t_choose .trafficInfo li").addClass("none");
        $(elem).find(".t_choose .trafficInfo li[data-type=1]").removeClass("none");
        $(elem).find(".t_choose .trafficInfo .traffic_check").removeClass("active");
        $(elem).find(".t_choose .trafficInfo .traffic_check").html("设为默认");
        $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").addClass("active");
        $(elem).find(".t_choose .trafficInfo li[data-type=1] .traffic_check").html("已设默认");

        if($(elem).next().hasClass("journey")){
            $(elem).find(".traffic").removeClass("none");
            Index.trafficFn($(elem).find(".action_choose"),1);
        }else{
            $(elem).find(".traffic").addClass("none");
        }
    });
};
//添加自定义行程
Index.addUser = function(){
    var routePar, newLi,routeIndex,routeBox;
    routeIndex = $(".daylistBox li.active").attr("data-start");
    routeBox = $(".routeList[data-day="+routeIndex+"]");
    $(document).bind('click',function(){
        $('.addUserBox').addClass("none");
    });

    $('.addUserBox,.addBox').bind('click',function(event){
        event.stopPropagation();
    });
    $(".addBox").on("click",function(){
        if($(this).siblings(".addUserBox").hasClass("none")){
            $(this).siblings(".addUserBox").removeClass("none");
        }else{
            $(this).siblings(".addUserBox").addClass("none");
        }
        routePar = $(this).parents(".routeList");
    });
    var flag = 0;
    $(".addUserBox li").unbind().bind("click",function(){
        if($(this).attr("data-user")==1){
            newLi = $('<li class="drag_Box userJourney" data-type="1" data-user="1">'+$(".userBox .user_text")[0].outerHTML+'</li>');
            $(routePar).find(".routeInfo").append(newLi);
            Index.clickPic(newLi.find(".picselect"));
        }else{
            newLi = '<li class="drag_Box userJourney" data-type="2" data-user="2">'+$(".userBox .user_traffic")[0].outerHTML+'</li>';
            $(routePar).find(".routeInfo").append(newLi);
        }
        $(this).parents(".addUserBox").addClass("none");

    });
    $(".customTitle .customAdd").on("click",function(){
        if($(this).attr("data-user")==1){
            newLi = $('<li class="drag_Box userJourney" data-type="1" data-user="1">'+$(".userBox .user_text")[0].outerHTML+'</li>');
            $(".routeList:not('.none')").find(".routeInfo").append(newLi);
            Index.clickPic(newLi.find(".picselect"));
        }else{
            newLi = '<li class="drag_Box userJourney" data-type="2" data-user="2">'+$(".userBox .user_traffic")[0].outerHTML+'</li>';
            $(".routeList:not('.none')").find(".routeInfo").append(newLi);
        }
    });
};
//添加行程
Index.addRoute = function(){
    var sceneryName,sceneryObj = {};
    $(document).delegate(".sceneryShow .action","click",function(){
        sceneryObj.sceneryName = $(this).siblings(".title").html();
        sceneryObj.sceneryImg = $(this).parents(".sceneryLi").find("img").attr("data-img");
        sceneryObj.sceneryLon = $(this).parents(".sceneryLi").attr("data-gglon");
        sceneryObj.sceneryLat = $(this).parents(".sceneryLi").attr("data-gglat");
        sceneryObj.sceneryId = $(this).parents(".sceneryLi").attr("data-poiid");
        sceneryObj.sceneryTime = $(this).siblings(".playTime").html();
        sceneryObj.journeyType = $(this).parents(".sceneryLi").attr("data-type");
        Index.renderAddRoute(sceneryObj);
    });

    $(document).on('click','.mapAddTravel',function(){
        sceneryObj.sceneryName = $(this).siblings(".littleMapHotelInfo").find(".lMHITitle").html();
        sceneryObj.sceneryImg = $(this).siblings(".littleMapHotelInfo").find("img").attr("src");
        sceneryObj.sceneryLon = $(this).attr("data-lng");
        sceneryObj.sceneryLat = $(this).attr("data-lat");
        sceneryObj.sceneryId = $(this).attr("data-pid");
        sceneryObj.sceneryTime = $(this).attr('data-playtime');
        sceneryObj.journeyType = $(this).attr("data-type");
        Index.renderAddRoute(sceneryObj);
    });

    $(document).delegate(".sceneryAdd","click",function(){
        sceneryObj.sceneryName = $(this).siblings(".sceneryName").html();
        sceneryObj.sceneryImg = $(this).parents(".sceneryInfo").find("img.sLeft").attr("src");
        sceneryObj.sceneryLon = $(this).parents(".sceneryInfo").find(".sceneryMap").attr("data-gglon");
        sceneryObj.sceneryLat = $(this).parents(".sceneryInfo").find(".sceneryMap").attr("data-gglat");
        sceneryObj.sceneryId = $(this).siblings(".sceneryName").attr("data-poiid");
        sceneryObj.sceneryTime = '游玩时间：'+$(this).parents(".sceneryInfo").find(".sceneryHour").html();
        sceneryObj.journeyType = $(this).parent().attr("data-type");
        Index.renderAddRoute(sceneryObj);
    });

};

//渲染添加行程
Index.renderAddRoute = function(param){
    var addHtml,routeLen,routeIndex,routeBox,idList;
    routeIndex = $(".daylistBox li.active").attr("data-start");
    routeBox = $(".routeList[data-day="+routeIndex+"]");
    idList = $(routeBox).find("#idList").val().split(",");
    routeLen = $(routeBox).find(".routeInfo").find(".journey").length;
    if(idList.indexOf(param.sceneryId) == -1){//去重
        addHtml = '<li class="drag_Box journey" data-route="'+(routeLen+1)+'" data-start="'+(routeLen+1)+'">' +
            '<div class="route route_'+(routeLen+1)+' sceneryLi" data-type="'+param.journeyType+'" data-name="'+param.sceneryName+'" data-poiid="'+param.sceneryId+'" data-gglon="'+param.sceneryLon+'" data-gglat="'+param.sceneryLat+'">'+
            '<img src="'+param.sceneryImg+'" data-imgid="'+routeLen+1+'" data-imgname="'+param.sceneryName+'">'+
            '<p class="title">'+
            '<span><span class="number">'+(routeLen+1)+'</span>.'+param.sceneryName+'</span>'+
            '<span class="playTime">'+param.sceneryTime+'</span>'+
            '</p>'+
            '<span class="action"></span>'+
            '</div>'+
            '<div class="traffic route none">'+
            '<span class="trafficType" data-type="1"></span>'+
            '<span class="trafficDistance" data-distance="0"></span>'+
            '<span class="action_choose" data-click="0">选择默认交通方式</span>'+
            '</div>'+
            '<div class="t_choose none">'+
            '<ul class="c_traffic">'+
            '<li class="active" data-type="1" data-name="步行"><i class="walk"></i>步行</li>'+
            '<li data-type="2" data-name="公交"><i class="subway"></i>公交</li>'+
            '<li data-type="3" data-name="自驾"><i class="self-driving"></i>自驾</li>'+
            '</ul>'+
            '<ul class="trafficInfo">'+
            '<li class="t_info" data-type="1">'+
            '<p class="traffic_check active">已设默认</p>'+
            '<div class="routeLineBox"></div>'+
            '</li>'+
            '<li class="t_info none" data-type="2">'+
            '<p class="traffic_check">设为默认</p>'+
            '<div class="routeLineBox"></div>'+
            '</li>'+
            '<li class="t_info none" data-type="3">'+
            '<p class="traffic_check">设为默认</p>'+
            '<div class="routeLineBox"></div>'+
            '</li>'+
            '</ul>'+
            '<div class="close"></div>'+
            '</div>'+
            '</li>';

        if($(routeBox).find(".routeInfo").find("li.drag_Box").last().hasClass("journey")){
            $(routeBox).find(".routeInfo").find(".traffic .trafficType").last().html("");
            $(routeBox).find(".routeInfo").find(".traffic .trafficDistance").last().html("");
            $(routeBox).find(".routeInfo").find("li.drag_Box").last().find(".traffic").removeClass("none");
        }
        if($(".routeList:not(.none) .routeInfo .drag_Box:last").hasClass("journey")){
            var isAddJourney = 1;
            var cityOne = {
                lng: $(".routeList:not(.none) .routeInfo .drag_Box:last .sceneryLi").attr('data-gglon') || 0,
                lat: $(".routeList:not(.none) .routeInfo .drag_Box:last .sceneryLi").attr('data-gglat') || 0
            };
            var cityTwo = {
                lng: param.sceneryLon || 0,
                lat: param.sceneryLat || 0
            };
            var travelMode = "walking";
            Index.trafficMap(cityOne,cityTwo,travelMode,$(".routeList:not(.none) .routeInfo .drag_Box:last"),0,0,isAddJourney); //这边传的2个0是无意义的
        }
        $(routeBox).find(".routeInfo").append(addHtml);
        $(routeBox).find(".routeInfo").find(".traffic").last().addClass("none");
        idList.push(param.sceneryId);
        $(routeBox).find("#idList").val(idList.join(","));

        $(".popFade").show();
        $(".popFade").fadeOut(3000);

    }else{
        Index.ajaxResult(6);
    }
};
//保存，预览，提交弹框
Index.subPop = function(){
    $(".routeBtn").on("click",function(){
        Index.dayFlag = [];//记录自定义交通信息不全所在的天数
        if($(this).attr("data-type") == 3){
            $(".subTitle").html(Index.obj[0].title);
            $(".subContent").html(Index.obj[0].content);
            $(".submitBtn").attr("data-flag",1);
            $(".subPop").removeClass("none");
            $(".popBg").removeClass("none");
        }else if($(this).attr("data-type") == 2){
            Index.submitFn(2);
        }else{
            Index.submitFn(1);
        }
    });
    $(document).delegate(".submitBtn","click",function(){
        if($(this).attr("data-flag") == 1){
            Index.submitFn(3);
        }else{
            $(".subPop").addClass("none");
            $(".popBg").addClass("none");
            $(this).attr("data-flag",1);
        }
    });
    $(".cancleBtn,.subClose").on("click",function(){
        $(".subPop").addClass("none");
        $(".popBg").addClass("none");
    })
};
//异步返回弹框
Index.ajaxResult = function(index){
    $(".subTitle").html(Index.obj[index].title);
    $(".subContent").html(Index.obj[index].content);
    if(index !==0){
        $(".submitBtn").html("知道了");
        $(".submitBtn").css({"float":"none","margin":"0 auto"});
        $(".cancleBtn").addClass("none");
    }else{
        $(".submitBtn").html("确定");
        $(".cancleBtn").removeClass("none");
    }
    $(".submitBtn").attr("data-flag",0);
    $(".subPop").removeClass("none");
    $(".popBg").removeClass("none");

    if(index == 3){//提交成功
        $(".submitBtn").on("click",function(){
            window.close();
        })
    }
};
//行程提交
//行程提交--3,行程保存--1,预览--2
Index.submitFn = function(index){
    var daydetail=[];
    var userTraffic={};
    var subCityflag = 1;//1--表示信息保存全，0--表示信息保存不全
    var subJourneyflag = 1;//1--表示信息保存全，0--表示信息保存不全
    var subUserflag = 1;//1--表示自定义交通填写完全，0--表示不完全

    $(".routeList").each(function(rIndex,route){
        var singleDetail,dayInfo,dayCities=[],dayCity,singleInfo,daySingle=[];
        dayInfo = $(route);
        if($(dayInfo).find(".day_city_name").length > 0){
            $(dayInfo).find(".day_city_name").each(function (index,elem) {
                dayCity={
                    "sort": (index+1),
                    "destinationid": parseInt($(elem).attr("data-cityId"))||0,
                    "destinationname": $(elem).html()||""
                };
                dayCities.push(dayCity);
            });
        }else{
            subCityflag = 0;
        }
        if($(dayInfo).find(".drag_Box").length >0){
            $(dayInfo).find(".drag_Box").each(function(index,elem){
                //单个行程数据
                if($(elem).hasClass("journey")){
                    singleInfo ={
                        "poiinfo": {
                            "poiid": $(elem).find(".sceneryLi").attr("data-poiid")||"",
                            "poiname": $(elem).find(".sceneryLi").attr("data-name")||"",
                            "imgs": [{
                                picid:$(elem).find("img").attr("data-imgId")||"",
                                picname:$(elem).find("img").attr("data-imgName").substr(0,20)||"",
                                picurl:$(elem).find("img").attr("src")||""
                            }],
                            "playtime": $(elem).find(".playTime").html()||"",
                            "gglon": parseFloat($(elem).find(".sceneryLi").attr("data-gglon"))||0,
                            "gglat": parseFloat($(elem).find(".sceneryLi").attr("data-gglat"))||0
                        },
                        "sort": index,
                        "traffictype": parseInt($(elem).find(".trafficType").attr("data-type"))||0,
                        "traffictypename": $(elem).find(".trafficType").html()||"",
                        "departurecityid": 0,
                        "departurecityname": "",
                        "destinationcityid": 0,
                        "destinationcityname": "",
                        "title": "",
                        "contents": "",
                        "distance": parseFloat($(elem).find(".trafficDistance").attr("data-distance"))||0
                    };
                }else{
                    var imgList=[],
                        imgOne;
                    if($(elem).attr("data-user") == 1){
                        if($(elem).find(".picselect .smallImg-wrap").length > 0){
                            $(elem).find(".picselect .smallImg-wrap").each(function(i,img){
                                imgOne = {
                                    picid:$(img).find("img").attr("data-id")||"",
                                    picname:$(img).find(".img-name").html().substr(0,20)||"",
                                    picurl:$(img).find("img").attr("src")||""
                                };
                                imgList.push(imgOne);
                            })
                        }
                        singleInfo ={
                            "poiinfo": {
                                "poiid": "",
                                "poiname": "",
                                "imgs": imgList,
                                "playtime": "",
                                "gglon": 0,
                                "gglat": 0
                            },
                            "sort": index,
                            "traffictype": 0,
                            "traffictypename": "",
                            "journeytype": parseInt($(elem).attr("data-user"))||0,
                            "departurecityid": 0,
                            "departurecityname": "",
                            "destinationcityid": 0,
                            "destinationcityname": "",
                            "title": $(elem).find(".scenery_title input").val().trim()||"",
                            "contents": $(elem).find(".scenery_text textarea").val().trim()||"",
                            "distance": 0
                        };
                    }else{
                        if($(elem).find(".trafficIN").val() == 0 ||$(elem).find(".firstCity").val().trim() ==""
                            || $(elem).find(".lastCity").val().trim() ==""){
                            subUserflag = 0;
                            if(Index.dayFlag.indexOf(rIndex+1) === -1){
                                Index.dayFlag.push((rIndex+1));
                            }
                        }else{
                            userTraffic.traffictype = parseInt($(elem).find(".trafficIN").val());
                            userTraffic.departurecityname=$(elem).find(".firstCity").val().trim();
                            userTraffic.destinationcityname=$(elem).find(".lastCity").val().trim();
                            singleInfo ={
                                "poiinfo": {
                                    "poiid": "",
                                    "poiname": "",
                                    "imgs": [],
                                    "playtime": "",
                                    "gglon": 0,
                                    "gglat": 0
                                },
                                "sort": index,
                                "traffictype": userTraffic.traffictype||0,
                                "traffictypename": $(elem).find(".trafficType").html()||"",
                                "journeytype": parseInt($(elem).attr("data-user"))||0,
                                "departurecityid": 0,
                                "departurecityname": userTraffic.departurecityname,
                                "destinationcityid": 0,
                                "destinationcityname": userTraffic.destinationcityname,
                                "title": "",
                                "contents": "",
                                "distance": 0
                            };
                        }

                    }
                }
                daySingle.push(singleInfo);
            });
        }else{
            subJourneyflag = 0;
        }
        //每一天的数据集合
        singleDetail={
            "journeydaydetail": daySingle,
            "sort": (rIndex+1),
            "journeydaydestination": dayCities
        };
        daydetail.push(singleDetail);
    });

    if(index==3){
        var flag = true;
    }else{
        var flag = false;
    }
    var text='{"journeyid":'+Index.routeId+',"committype":'+flag+',"jobnumber":"'+Index.jobnumber+'","username":"'+Index.userName+'","journeydayinfo":'+JSON.stringify(daydetail)+'}';

    if(subUserflag == 1){
        if(index == 3){
            //判断是否填写完整，每天的城市个数和行程个数均不为0
            if(subCityflag == 1 && subJourneyflag == 1){
                //console.log(text);
                $.ajax({
                    url:Index.host+"JourneyInfo/SaveJourneyInfo",
                    data:"param="+text,
                    type:"post",
                    dataType:"json",
                    success:function(data){//提交
                        if(data.StatusCode == 200){
                            //success
                            Index.ajaxResult(3);
                        }else{
                            //failed
                            Index.obj[4].content = data.Message;
                            Index.ajaxResult(4);
                        }
                    }
                });
            }else{
                Index.ajaxResult(5);
            }
        }else{
            $.ajax({
                url:Index.host+"JourneyInfo/SaveJourneyInfo",
                data:"param="+text,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.StatusCode == 200){
                        //success
                        if(index == 1){//保存
                            Index.ajaxResult(1);
                        }else{//预览
                            //跳转到预览页面
                            window.open("/dujia/routePreview?id="+Index.routeId);
                        }
                    }else {
                        //failed
                        if(index == 1){//保存
                            Index.obj[2].content = data.Message;
                            Index.ajaxResult(2);
                        }else{//预览
                            //跳转到预览页面
                            window.open("/dujia/routePreview?id="+Index.routeId);
                        }
                    }
                }
            });
        }
    }else{
        Index.obj[7]={title:"填写提示",content:"请注意第"+Index.dayFlag+"天自定义交通是否填写完整。"};
        Index.ajaxResult(7);
    }
};
//列表地图模式切换
Index.moduleTab = function(){
    $('.chooseTab li').on('click',function(){
        var self = this;
        var index = $(self).index();
        if(!$(self).hasClass('c_active')){
            $('.chooseTab li').removeClass('c_active');
            $(self).addClass('c_active');
            if(index == 0){
                $('.proList').children().removeClass('none');
                $('.proList .proMap').addClass('none');
                $(".proList").removeClass("mapType");
                $(".routeList").removeClass("mapType");
                $(".sceneryInfo").removeClass("mapType");
            }else{
                $('.proList').children().addClass('none');
                $('.proList .mappanel').removeClass('none');
                $(".proList").addClass("mapType");
                $(".routeList").addClass("mapType");
                $(".sceneryInfo").addClass("mapType");
                Index.resetMap();
                $.ajax({
                    url: Index.host+'JourneyInfo/GetPoiInfoList?type='+Index.mapData()+'&CityId='+$('.cityName').data('cityid')+'&starts='+$('.ui-levelDeep').attr('data-star')+'&pagesize=10000&pageindex=1',
                    type: 'get',
                    dataType: 'json',
                    //dataType:'jsonp',
                    success: function(data){
                        if(data.StatusCode == 200 && data.ReturnValue.POIInfoList){
                            if (MyHotelListMap && MyHotelListMap != undefined) {
                                MyHotelListMap.InitMarkers(data.ReturnValue.POIInfoList);
                            }
                            var newdata = data.ReturnValue.POIInfoList;
                            window.pointList = newdata;
                            map.init(document.getElementById("MyMap"));
                        }
                    }
                });
            }
        }
    });
};
//切换城市
Index.changeCity = function(){

    $(document).bind('click',function(){
        $('.changeCity').addClass("none");
    });

    $('.changeCity,.destBox').bind('click',function(event){
        event.stopPropagation();
    });
    $(".destBox").on("click", function () {
        if($(this).parents(".proList").find(".changeCity").hasClass("none")){
            $(this).parents(".proList").find(".changeCity").removeClass("none");
        }else{
            $(this).parents(".proList").find(".changeCity").addClass("none");
        }
    });
    //$(document).on("click")
    $(".proList .changeCity li").on("click",function(){
        var rType = $(".typeList li.active").attr("data-type");
        var cityID = $(this).attr("data-cityId");
        $(".proList .cityDest .cityName").html($(this).html());
        $(".proList .cityDest .cityName").attr("data-cityId",cityID);
        $(this).parent().addClass("none");
        Index.ajaxFn(rType,cityID,1,true,"");
        Index.index = 1;
        Index.top = 600;
        Index.name = "";
        $(".searchIn input").val("");
        $(".sceneryList").scrollTop(0);
        if(!$('.mappanel').hasClass('none')){
            Index.resetMap();
            Index.mapAjax(map);
        }
    })
};

//地图模式筛选按钮
Index.mapfilter = function(){
    $('.proMap-tab li').on('click',function(){
        var self = this;
        //全部按钮
        if($(self).hasClass('cur')){
            if($('.proMap-tab li.cur').length == 1){
                return false;
            }
            $(self).removeClass('cur');
        }else{
            $(self).addClass('cur');
        }
        Index.mapAjax(map);
    });

    $('.ui-levelDeep').on('click',function(e){
        e.stopPropagation();
        if($('.ui-levelDeep-list').hasClass('none')){
            $('.ui-levelDeep-list').removeClass('none');
        }
        $(document).on('click',function(){
            $('.ui-levelDeep-list').addClass('none');
        })
    });

    $('.ui-levelDeep-list li').on('click',function(){
        var self = this;
        var star = $(self).data('stars');
        $('.ui-levelDeep').empty().html($(self).text());
        $('.ui-levelDeep').attr('data-star',star);
        Index.mapAjax(map);
    });
};

//清空地图筛选条件
Index.clearMap = function(){
    $('.proMap-tab li').removeClass('cur');
    $('.ui-levelDeep').attr('data-star',5);
    $('.ui-levelDeep').html('A');
};

//重置地图筛选条件
Index.resetMap = function(){
    $('.proMap-tab li').removeClass('cur');
    $($('.proMap-tab li')[0]).addClass('cur');
    $('.ui-levelDeep').attr('data-star',5);
    $('.ui-levelDeep').html('A');
}

//获取当前选中地图筛选类型
Index.mapData = function(){
    var arr = [];
    $('.proMap-tab li').map(function(index,item){
        if($(item).hasClass('cur')){
            arr.push($(item).data('type'));
        }
    });
    return arr.join(',');
};


//地图筛选获取异步数据
Index.mapAjax = function(map){
    var type = Index.mapData();
    var cityid = $('.cityName').attr('data-cityid');
    var starts = $('.ui-levelDeep').attr('data-star');
    $.ajax({
        url: Index.host+'JourneyInfo/GetPoiInfoList?type='+type+'&CityId='+cityid+'&starts='+starts+'&pagesize=10000&pageindex=1',
        dataType: 'json',
        //dataType: 'jsonp',
        type: 'get',
        success: function(data){
            if(data.StatusCode == 200 && data.ReturnValue.POIInfoList){
                map.clickRender(data.ReturnValue.POIInfoList);
            }else{
                $(".mapPopFade").show();
                $(".mapPopFade").fadeOut(3000);
                Index.clearMap();
                map.clear();
            }
        }
    })
};

Index.init();
module.exports = Index;
