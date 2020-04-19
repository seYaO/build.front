/** 
* @date 2016-09-02 长短线   ym/10862
* */
var Index = function () {};
require("lazyload/0.1.0/index");
require("modules/startlist/0.1.0/index").init(0);
var Common = require("common/0.1.0/index"),
    longAndS = require("./rempro.dot"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index");
require('modules/slidertoolbar/0.2.0/tool').init({pageName: "跟团游首页"});    
Index.prototype= {
	init: function () {
		var self = this;
		self.initEv();
        self.startCity();
        self.longInit();
        // self.slider();
        // 加载短线
        self.scrollShort();
	},
	initEv:function(){
		var self = this;
        self.longAndShortTab($(".J_longTab li"),$(".J_longCon"),"long");
        self.longAndShortTab($(".J_shortTab li"),$(".J_shortCon"),"short");
	},
     //重置出发城市
    startCity: function() {
        var self = this;
        var cityId = $("#city_select").attr("data-scid");
        $.cookie('indexStartCity',cityId,{
            expires:1,
            path:"/",
            domain:".ly.com"
        });
    },
    longInit:function(){
        var self = this;
        //初始化长线游
        var longDest = $(".J_longTab li.on").attr("data-dest");
        self.longAndShortData(longDest,$(".J_longCon").eq(0),0,"long");
    },
	longAndShortTab:function(tabDom,conDom,type){
        var self = this;
        tabDom.on("click",function(){
            var el = $(this),
                dataId = el.attr("data-index"),
                dest = el.attr("data-dest");
            el.addClass("on").siblings().removeClass("nor");

            var index = conDom.parents(".longlinebox").find(".longul li.on").index();
            conDom.addClass("none");
            $(conDom[index]).removeClass("none");
            
            var elemDom = $(conDom[index]).parents(".longlinebox").find(".longlinelist:not(.none)");
            self.longAndShortData(dest,elemDom,dataId,type);
        });
    },
    /** 
     * @des longAndShortData   长短线异步数据
     * @param: desName:城市，type：长短线类型,indexId : 当前选中的节点
     *  
     * */ 
    longAndShortData:function(desName,dom,indexId,type){
        var self = this;
        var _self = $(this),
            url = '/intervacation/searchproduct?type=intervacation&ifReSearch=1&toLpCity=1&channelId=1&minPrice=2001';
            litem = $(dom).find("dl"),
            cityId = $("#startcityId").val(),
            content = "";
        if(type=="long"){
            content = ".longboxr_long" + "_"+ indexId;
        }else{
            content = ".longboxr_short" + "_"+ indexId;
        }    
        var param = {
            start: 1,
            count: 4,
            newKeyword: desName,
            scId: cityId,
            lcCity: cityId,
            prop: 1,
            isTpackage: "",
            sort: "pcComprehensiveSort:desc"
        }  
        if($(content).find("dl").length>0){
            return false;
        }else{
            $.ajax({
                "url": url,
                "data": param,
                "dataType": "json",
                success: function (data) {
                    var datas = (data.response && data.response.length) ? data.response[0] : {};
                    if(datas && datas.totalCount != 0){
                        self.render({
	                        "tpl": longAndS,
	                        "data": datas,
	                        "context": content,
	                        "callback": function () {
                                //调用index.js中的window下的方法
                                self.lazyLoadnew();
	                            Holidayindex.setAnimate(".longboxr dl", 6, 16);
	                        }
	                    });
                    }else{
                        if($(content).find(".noline")&&$(content).find(".noline").text()!=""){
                            $(content).find(".noline").html("当前目的地没有线路，请切换其他目的地！");
                        }else{
                            $(content).append("<span class='noline'>当前目的地没有线路，请切换其他目的地！</span>");
                        }
                    }
                },
                error: function () {
                    Monitor.log("获取线路失败" + url);
                }
            });
        }
    },
    scrollShort:function(){
        var self = this;
        var shortDest = $(".J_shortTab li.on").attr("data-dest");
        $(window).on("scroll", function (e) {
            var scrollElem = $(this);
            if (!self.isLoading  && scrollElem.scrollTop() >= $(".mianbox").offset().top) {
                self.longAndShortData(shortDest,$(".J_shortCon").eq(0),0,"short");
                self.isLoading = true;
            }
            e.stopPropagation();
        });
    },
    render:function(config) {
        var key = config.key,
            tpl = config.tpl[key] || config.tpl,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback;
        var html,cxt;
        html = tpl(data);
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    },
    lazyLoadnew: function () {
        var self = this;
        $(".longboxr img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "430x270");
            $(item).attr("data-img", imgUrl);
        });
        if (self.isInit) {
            var imgList = $(".longboxr img").not("[data-img-loaded]");
            $(window).trigger("addElements", imgList);
        } else {
            $(".longboxr img").lazyload({
                "data_attribute": "img",
                "event": "scroll",
                effect: 'fadeIn'
            });
            self.isInit = true;
        }
        $(window).trigger("scroll");
    }
};
module.exports = new Index();