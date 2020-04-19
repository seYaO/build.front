var Index = function () {};
require("lazyload/0.1.0/index");
require("modules/startlist/0.1.0/index").init(0);
var Common = require("common/0.1.0/index"),
    Tpl = require("./package.dot"),
    longAndS = require("./rempro.dot"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    Search = require("freePackage/search/0.1.0/index"),
    saveHtml = "";
require('modules/slidertoolbar/0.2.0/tool').init({pageName: "自由行首页"});      
Index.prototype = {
    _data: {},
    init: function () {
        var self = this;
        self.initEv();
        self.startCity();
        self.longInit();
        self.addImageSize();
        self.getServerNumber();
        var search = new Search();
        search.init();
        //加载短线
        self.scrollShort();
    },
    resize: function() {
        var windowWth = document.documentElement.clientWidth;

        if (windowWth < 1200 && windowWth > 0) {
            if (!$("#conter").hasClass("Small_conter")) {
                $("#conter").addClass("Small_conter");
            }else {
                return;
            }
        } else {
            $("#conter").removeClass("Small_conter");
        }
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
    initEv: function () {
        var self = this;
        self.saveHtml = $(".jijiuInfo").html();
        $("#jijiu_select").on("mouseenter",function(e){
            $("#jijiu_select").addClass("jijiu_b_hover");
            $("#jijiubox").show();
        });
        $("#jijiu_select").on("click",function(e){
            var _self = $(this);
            if(_self.hasClass('jijiu_b_hover')){
                _self.removeClass("jijiu_b_hover");
                $("#jijiubox").hide();
                self.resetInfo();
                //$(".jijiuInfo").html(self.saveHtml);
            }else{
                _self.addClass("jijiu_b_hover");
                $("#jijiubox").show();
            }
        });
        $(".J_tpbox li").on("click", function () {
            var _self = $(this),
                others  = '',
                parents = '',
                top = '',
                topNum,
                srcId = $("#city_select").attr("data-scid"),
                dep = $.trim($('#city_select').find('strong').text()),
                contextId = _self.parents(".tpul").data("tag"),
                key = _self.attr("data-key"),
                des = $.trim(_self.text()),
                isTpackage = 1,
                froupNum = 5;
            others = _self.siblings();
            if (_self.hasClass("on")) {
                return;
            }
            _self.addClass("on");
            others.removeClass("on");

            //切换目的地tab时，更多XXX线路改变
            parents = _self.parents(".J_tpbox");
            topNum = _self.index() + 1;
            top = $(".top_" + topNum);
            top.removeClass("none");
            top.siblings().addClass("none");


            self.handleLine({
                "des": des,
                "dep": dep,
                "key": key,
                "scId": srcId,
                "contextId": contextId,
                'froupNum': froupNum,
                'isTpackage': isTpackage
            });
            self.addImageSize();
        });
        //长短线点击切换
        self.longAndShortTab($(".J_longTab li"),$(".J_longCon"),"long");
        self.longAndShortTab($(".J_shortTab li"),$(".J_shortCon"),"short");
        //添加住宿
        $(".add-hotel").click(function(e){
            var _self = $(this);
            var itemLen = $(".option-hotel-item").length;
            $('.delete-hotel').removeClass('none');
            if(itemLen<3){
                var html = '<div class="option-hotel-item">'
                                        +'<div class="clearfix">'
                                            +'<div class="inputItems">'
                                                +'<input type="text" placeholder="入住城市" class="ui-input ui-input-city input-city-hotel" validate="required" vali-msg-required="请填写入住城市">'
                                                +'<i class="delete-hotel"></i>'
                                                +'<div class="flyMoreCity" style="display:none"></div>'
                                                +'<div class="defaultCity"></div>'
                                                +'<span class="valid_symbol none"></span>'
                                            +'</div>'
                                        +'</div>'
                                        +'<div class="clearfix">'
                                            +'<div class="inputItems">'
                                                +'<input type="text" placeholder="yyyy-mm-dd" class="ui-input ui-input-date hotelInDate" validate="required" vali-msg-required="请填写入住时间">'
                                                +'<span class="valid_symbol none"></span>'
                                            +'</div>'
                                            +'<div class="inputItems">'
                                                +'<input type="text" placeholder="yyyy-mm-dd" class="ui-input ui-input-date hotelOutDate" validate="required" vali-msg-required="请填写离店时间">'
                                                +'<span class="valid_symbol none"></span>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>';
                $(".option-hotel-items").append(html);
            }
            if(itemLen==2){
                _self.addClass('none');
            }

        });
        //删除住宿
        $(document).on("click",".delete-hotel",function(e){
            var _self = $(this);
            var itemLen = $(".option-hotel-item").length;
            $(".add-hotel").removeClass('none');
            if(itemLen>1){
                _self.parents(".option-hotel-item").remove();
            }
            if(itemLen<3){
                $($(".option-hotel-item")[0]).find('.delete-hotel').addClass('none');
            }
        });
        $(".adultItem").click(function() {
            var _this = $(this);
            self.renderAdultHtml();
            $(".adultNumBox").slideToggle(200);
            $(".childNumBox").slideUp(200);
            $(".roomNumBox").slideUp(200);
            if(!$(".childOld-box").hasClass('none')){
                $(".childOld-box").addClass('none');
            }
            //失去焦点隐藏
            $(document).bind('click', function() {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        $(".childItem i").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var _this = $(this);
            self.renderChildHtml();
            if(!$(".childOld-box").hasClass('none')){
                $(".childOld-box").addClass('none');
            }
            $(".childNumBox").slideToggle(200);
            $(".roomNumBox").slideUp(200);
            $(".adultNumBox").slideUp(200);
            //失去焦点隐藏
            $(document).bind('click', function() {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        $(".roomItem").click(function() {
            var _this = $(this);
            self.renderRoomHtml();
            if(!$(".childOld-box").hasClass('none')){
                $(".childOld-box").addClass('none');
            }
            $(".roomNumBox").slideToggle(200);
            $(".adultNumBox").slideUp(200);
            $(".childNumBox").slideUp(200);
            //失去焦点隐藏
            $(document).bind('click', function() {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
            self.hidePanel();
        });
        self.ageEve();
    },
    longInit:function(){
        var self = this;
        //初始化长线游
        var longDest = $(".J_longTab li.on").attr("data-dest");
        self.longAndShortData(longDest,$(".J_longCon").eq(0),0,"long");
    },
    //滚动加载短线
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
     * @des 长线和短线异步数据
     * @param: desName:目的地，dom:选中产品节点，type：长短线
     * */ 
    longAndShortData:function(desName,dom,indexId,type){
        var self = this;
        var _self = $(this),
            url = '/intervacation/searchproduct?type=intervacation&ifReSearch=1&toLpCity=1&channelId=1';
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
            prop: 3,
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
    resetInfo: function(){
        var jijiuInfo = $(".jijiuInfo");
        jijiuInfo.find("input").val("").removeClass('input_error');
        jijiuInfo.find(".adultItem input").val(2);
        jijiuInfo.find(".childItem input").val(0);
        jijiuInfo.find(".roomItem input").val(1);
        jijiuInfo.find(".item-childOld").remove();
        $(".dj-validate").removeClass("active");
    },
    hidePanel: function(){
        $(".defaultCity").hide();
        $(".ui_popup_gp").hide();
    },
    renderChildHtml: function() {
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
    renderRoomHtml: function() {
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
    renderAdultHtml: function() {
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
    numsEve: function() {
        var self = this,
            num = self.calculatePeopleNum(),
            childNum = num.childNum;
        $(".roomNumBox li").click(function(e) {
            e.stopPropagation();
            var _self = $(this);
            var newsum = _self.html();
            $("#room").html(newsum).val(newsum).attr('num', newsum);
            $(".roomNumBox").slideUp(200);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
        });
        $(".adultNumBox li").click(function(e) {
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
        $(".childNumBox li").on("click",function(e) {
            e.stopPropagation();
            var _self = $(this);
            var newsum = parseInt(_self.html()),
                allhtml = "";
            // if (!$("#child1").hasClass('hasrenderAge')) {
            //     self.renderAgeHtml();
            // }
            $("#child1").html(newsum).val(newsum).attr('num', newsum);
            $(".childNumBox").slideUp(200);
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
    ageEve: function() {
        var self = this;
        $(document).on("click", ".drop-child", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var _self = $(this);
            _self.siblings('.choice-childy').stop().slideToggle(200);
            //失去焦点隐藏
            $(document).bind('click', function() {
                self.__docClick.call(self, arguments.callee);
            });
            self.__stopPropagation();
        });
        $(document).on("click", ".choice-childy li", function(e) {
            e.stopPropagation();
            var _self = $(this);
            $(".calTotalPrice").addClass('none');
            $(".sureOr").removeClass('none');
            _self.parent().siblings('.drop-child').html(_self.html()).attr('data-year', _self.attr("data-year"));
            _self.parent().slideUp(200);
        });
        $(".childyear-submit").click(function(e) {
            e.stopPropagation();
            $(".childOld-box").addClass('none');
            self.defRoomCount();
        });
        $("#child1").click(function(e) {
            e.stopPropagation();
            var _self = $(self);
            if (_self.attr("num") != 0) {
                $(".childOld-box").removeClass('none');
                $("#child1").removeClass('hasrenderAge');
                $(".adultNumBox").slideUp(200);
                $(".childNumBox").slideUp(200);
                $(".roomNumBox").slideUp(200);
                self.hidePanel();
            }
        });
    },
    //计算默认房间数
    defRoomCount: function() {
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
    calculatePeopleNum: function() {
        var totalNum = 0,
            childNum = 0;
        $(".input-num").each(function() {
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
    //点击文档其他地方隐藏面板
    __docClick: function(obj) {
        $('.adultNumBox,.childNumBox,.roomNumBox,.flyMoreCity').hide();
        $(document).unbind('click', obj);
    },
    __stopPropagation: function(e) {
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
    __getEvent: function() {
        if (window.event) {
            return window.event;
        }
        var func = this.__getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },
    handleLine: function (config) {
        var self = this;
        var url = window.host + '/dujia/ajaxhelper/HomePageHandler.ashx?type=SpecialData';
        var _self = $(this),
            dep = config.dep,
            key = config.key,
            context = "." +  config.contextId;
        var tarEl = $(context + " .J_proList" + key);
        var param = {
            "srcId": config.scId,
            "destName": config.des,
            'froupNum': config.froupNum,
            'isTpackage': config.isTpackage
        };
        if (!self._data[dep + "|" + key + "|" + context]) {
            $.ajax({
                "url": url,
                "data": param,
                "dataType": "jsonp",
                beforeSend: function () {
                    $(context).find('.prolist').hide();
                    $(context).addClass('prolist_load');
                },
                success: function (data) {
                    $(context).removeClass('prolist_load');
                    //附加一个key值，方便切换
                    data._key = key;

                    self._data[dep + "|" + key + "|" + context] = data.data;
                    if(data.data.length>0){
                        self.render({
                            "tpl": Tpl,
                            "data": data.data,
                            "key": key,
                            "context": context,
                            "callback": function () {
                                $(this).siblings().hide();
                                self.lazyLoad();
                                self.resize();
                            }
                        });
                    }else{
                        $(context).find('.J_proList' + key).append("<li><span class='noline'>当前目的地没有线路，请切换其他目的地！</span></li>");
                    }    
                },
                error: function () {
                    Monitor.log("获取线路失败" + url, "handleLine");
                }
            });
        } else {
            tarEl.show();
            tarEl.siblings().hide();
        }

    },
    render: function (config) {
        if (config.data == null) {
            config.data = [];
        }
        var tpl = config.tpl,
            key = config.key,
            data = config.data || config.data[key],
            context = config.context,
            callback = config.callback;
        data.key = key;
        var _html = tpl(data),
            cxt;
        //if (config.overwrite) {
        //    context.empty();
        //}
        cxt = $(_html).appendTo(context);
        // if (data.length == 0) {
        //     $(context).find('.J_proList' + key).html('该线路不存在，请切换其他线路！');
        // }
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    },
    addImageSize: function () {
        $(".prolist img").each(function () {
            var proImgUrl = $(this).attr("data-img");
            $(this).attr("data-img",common.setImageSize(proImgUrl,"430x270"));
        });
    },
    lazyLoad: function () {
        var self = this;
        if (self.isInit) {
            var imgList = $(".prolist img").not("[data-img-loaded]");
            $(window).trigger("addElements", imgList);
        } else {
            $(".prolist img").lazyload({
                "data_attribute": "img",
                "event": "scroll",
                effect: 'fadeIn'
            });
            self.isInit = true;
        }
        $(window).trigger("scroll");
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
    },
    //获取电话号码
    getServerNumber: function () {
        var url = "/dujia/ajaxcall.aspx?type=GetTel400";
        $.ajax({
            url: url,
            success: function (data) {
                $(".J_tel").html(data.slice(1, -1));
            },
            error: function () {
                Monitor.log("获取服务器号码失败" + url, "getServerNumber");
            }
        });
    }
    
}
module.exports = new Index();
