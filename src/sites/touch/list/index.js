(function($){
    var switchCityFlag=false;//搜索无结果时切换城市标识
    var Common,Iscroll = require("modules-touch/utils/iscroll/index"),
        currentTouch, currentTouch2;
    var loadingCfg = {
        loading: '<p class="loading"><i></i>努力加载中</p>',
        click: '<p>点击加载数据</p>',
        nomore: '<p>没有更多产品啦</p>'
    };
    var tpl = {};
    tpl.noresult = require("./views/noresult.dot");
    tpl.dep = require("./views/dep.dot");
    tpl.des = require("./views/des.dot");
    tpl.newList = require("./views/list.dot");
    tpl.service = require("./views/onlineservice.dot");
    var beginCity = $("#hidBeginCity").val();
    var Index = {
        defaultData:{},
        thisCfg: {},
        initEnv: function(){
            Common = require("modules-touch/common/index");
            require("modules-touch/utils/lazyload/index");
            require("modules-touch/dialog/index");
            //添加统计
            require("modules-touch/utils/statistics/spm");
            this.tmplList = tpl;
        },
        setServiceUrlByTab: function () {
            var column = $(".active").attr('data-key');
            var serviceUrl = "//livechat.ly.com/out/guest/touch?p=7&memberid=0";
            if (column !== 'package') {
                serviceUrl = "//livechat.ly.com/out/guest/touch?p=2&c=2&memberid=0";
            }
            $('.service-info').parent().attr("href", serviceUrl);
            //挤一下放个相同的方法
            if(column == 'package'){
                $(".online-service .service-kefu").parent().attr("href","//livechat.ly.com/out/guest/touch?p=7");
            }else{
                $(".online-service .service-kefu").parent().attr("href","//livechat.ly.com/out/guest/touch?p=2&c=2&memberid=0");
            }
        },
        initEvent: function(conf){
            // 去掉顶部tab切换，获取地址栏package或者travel,跳转搜索页
            $('.header-search').on('click',function(){
                var urlKey = window.location.href.split("dujia/")[1].split("/")[1];

                if(urlKey == "package"){
                    window.location.href='/dujia/package/destination';
                }else if(urlKey == "travel"){
                    window.location.href='/dujia/travel/destination';
                }else if(urlKey == "all"){
                    window.location.href='/dujia/all/destination';
                }else{
                    return false;
                }
            });
            /**
             * @desc 出游类型点击事件
             * @param type:package跟团，travel自由
             */
            $(".tab-area li").on("click",function(e){
                   $(".tab-area li").removeClass("active");
                   $(this).addClass("active");
                //    var param = $(this).data("param");
                //    Index.getList(Common.eva('('+param+')'));
                   Index.followingEvent(this.getAttribute("data-key"),beginCity,conf.newKeyword);

                       var _key = this.getAttribute("data-key"),
                           aurl = (window.location.href).split('/');
                       if(switchCityFlag==true) {
                           aurl[4] = "all";
                       }
                       aurl[5] = _key;
                       url = aurl.join('/');
                       var cfg = Index.getCfg($(this));
                       cfg.url = url;
                       window.location.href = url;

               Index.isFilter = false;
            });
            $(".tab-screen >ul li.sel-screen").on("click",function(){
                $(".dialog-filter").removeClass("none");
                $(".dialog-filter").css({"height":"34rem","display":"block","bottom":0});
            });
            $(document).on("click",".city-panels .show-more",function(){
                var el = $(this);
                el.siblings().removeClass("selected");
                el.addClass("selected");
                if(!el.data("isInit")){
                    var iscroll = new Iscroll(el.find(".J_FlowBox")[0],{mouseWheel:true,disableMouse:false,click: true});
                    el.data("isInit",true);
                }
            });
            //点击底部筛选逻辑,
            $(".tab-screen > ul li").on("click",function(){
                var _this = this,self = $(_this);

                var cls = _this.className,
                    matchArr = cls.match(/(\w+)-screen/),
                    type;
                if (Common.pages.length < 1) {
                    Index.initCfg();
                }
                if(matchArr && matchArr[1]){
                    type = matchArr[1];
                }else{
                    Monitor.log("首页排序条的class类型获取出错!","dom");
                    return false;
                }
                if (type==="des"||type==="sel"){  //把目的地单独拿出来处理
                    return;
                } else{
                    var ele_des = $(".dialog-"+type),
                        hasActiveCls = self.hasClass("active-tab");
                    $(".animation-sort").addClass("none");
                    $(".tab-select").addClass("none");//点击下面的筛选按钮之后，自己被隐藏
                    $(".dialog-des").addClass("none");
                    if($(".sel-screen").hasClass("active-tab")){
                        return;
                    }
                    $(".tab-screen li").removeClass("active-tab");
                    if(!hasActiveCls){
                        self.addClass("active-tab");
                        ele_des.removeClass("none");
                        ele_des.css({"bottom":0,});//新添加的代码，主要是用来覆盖底部的按钮
                        $(".tab-select").removeClass("none");//当用户点击选择项中的任何一项之后，请求数据之后，将筛选按钮显示
                        Index.createMask();
                        if(type === "sort"){
                            return;
                        }
                        Index.showCityPanel(type,conf);

                    }else{
                        //判断
                        self.removeClass("active-tab");
                        $(".J_CityMask").addClass("none");
                    }
                }
            });
            //单独处理目的地选项
            $(document).on("click",".tab-screen .des-screen",function(){
                var _this = this,self = $(_this);
                var cls = _this.className,
                    matchArr = cls.match(/(\w+)-screen/),
                    type;
                if(matchArr && matchArr[1]){
                    type = matchArr[1];
                }else{
                    Monitor.log("首页排序条的class类型获取出错!","dom");
                    return false;
                }
                $(".tab-screen").addClass("none");
                $(".tab-screen").css("position","absolute");
                Index.showCityPanel(type,conf);
            });
            //列表的所有宝贝点击事件，由于需要扩大点击的范围，所以使用脚本跳转
            $(document).on("click",".auction",function(e){
                var aEl = $(this).find("a");
                if(aEl[0]){
                    location.href = aEl[0].getAttribute("href");
                }
            });

            $(document).on("click",".dialog-des a",function(){
                var ele = $(this).text();
                var pinyin="",
                    url;
                switch (ele) {
                    case "朝鲜":
                        pinyin="chaoxian";
                        break;
                    case "日本":
                        pinyin="riben";
                        break;
                    case "泰国":
                        pinyin="taiguo";
                        break;
                    case "东南亚":
                        pinyin="dongnanya";
                        break;
                    case "海岛":
                        pinyin="haidao";
                        break;
                    case "港澳":
                        pinyin="gangao";
                        break;
                    case "欧洲":
                        pinyin="ouzhou";
                        break;
                    case "美洲":
                        pinyin="meizhou";
                        break;
                    case "中东非洲":
                        pinyin="zhongdongfeizhou";
                        break;
                    case "澳洲":
                        pinyin="aozhou";
                        break;
                    default:
                        pinyin="all";
                        break;
                }
                var urls=window.location.href.split("/");
                var url;
                if(urls.length>6){
                    url="/dujia/"+urls[4]+'/'+urls[5]+'/'+"list/"+pinyin+".html";
                }else{
                    url="/dujia/all/package/list/"+pinyin+".html";
                }
                window.location.href=url;
                Index.followingEvent(beginCity,ele);
            });
            $(".dialog-sort li").on("click",function(){
                var ele = $(this);
                $(".dialog-sort li").removeClass("active-dialog");
                ele.addClass("active-dialog");
                $(".J_CityMask").addClass("none");
                $(".dialog-sort").addClass("none");
                $(".tab-screen li").removeClass("active-tab");
                var param = $(this).data("param");
                param=Common.eva('('+param+')')
                $.extend(Index.thisCfg,param);
                Index.getList(param);
            });

            this.initFilterEvent(conf);
        },
        /**
         * 显示城市的面板
         * @param type
         */
        showCityPanel: function(type,conf){
            var url, _data, dataKey;
            var prop = parseInt(conf.prop,10);
            // 目的地：dataKey = 0 跟团 dataKey=1 自由行, 全部dataKey=0;  备注：由于接口将全部数据跟团和自助游返回，数据重复，确认好暂时用跟团目的地
            if(!prop){
                dataKey = 0;
            }else if(prop==1){
                dataKey = 0;
            }else  if(prop==3){
                dataKey = 1;
            }
            if(type === "dep" && !Index["isRenderCityData"+type]){
                Common.render({
                    key: type,
                    data: startCity,
                    context: ".dialog-"+type,
                    tmpl: Index.tmplList,
                    callback: function(){
                        var wrap = $(".dialog-"+type).find(".city-wrap")[0];
                        Index.iscroll = new Iscroll(wrap,{mouseWheel:true,disableMouse:false,scrollbars: true,click: true});
                        Index.bindDepEvent(conf);
                        $(".page .city-wrap").css({"position":"relative","z-index":"200"});
                    }
                });
                Index["isRenderCityData"+type] = true;
                return;
            }
            url = '//m.ly.com/dujia/json/getArrivalcitys?type='+dataKey;
            Common.getData(url, function(data) {
                data.arriveCity = Index.thisCfg.newKeyword||"不限";
                _data = data;
                if(type==="des"){
                    Common.redirect({
                        tag: "filter",
                        param: {},
                        title: "目的地"
                    });
                    Common.resetAdver();
                    var hasRendered=$(".tab-screen .des-screen").hasClass("rendered");
                    if(!hasRendered){
                        Common.resetAdver();
                        $(".tab-screen .des-screen").addClass("rendered");
                        processData(_data);
                        Common.render({
                            key: type,
                            data: _data,
                            context: "#filterPage",
                            tmpl: Index.tmplList,
                            callback: function () {

                                var wrap = $(".city-panels .show-more").find(".J_FlowBox")[0];
                                Index.iscroll = new Iscroll(wrap, {
                                    mouseWheel: true,
                                    disableMouse: false,
                                    scrollbars: false,
                                    click: true
                                });
                                Index.bindDestEvent(conf);
                                $(".tab-screen").addClass("none");
                                $(".tab-screen").css("position","absolute");
                                $(".page .city-wrap").css({"position":"relative","z-index":"200"});
                            }
                        });
                    }
                    return;
                }
            },true);
        },
        /**
         * 筛选面板的所有选项重置后，默认设置为第一条。
         */
        resetFilter: function(){
            $(".cond-panel").each(function(index,el){
                var _el = $(el).find("li").first();
                if (_el.text()!="同程专线" && _el.text() != "非凡系列") {
                    _el.siblings().removeClass("active");
                    _el.addClass("active");
                    $(this).removeClass("active");
                } else {
                    $(el).find("li").removeClass("active");
                }
                $(".J_P_limit").find("input").val("");
            });
        },
        /*
         * 筛选面板点击取消按钮后，弹窗消失，默认设置第一条。
         * author fanyu
         *
         * */
        cancelFilter:function(){
            var self = this;
            self.resetFilter();
            $(".dialog-filter").css({"display":"none"});
        },
        getQueryString:function(name) {
            name = name.toLowerCase().replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var url = window.location.href.toLowerCase();
            var results = regex.exec(url);
            if (results == null) {
                return null;
            }
            else {
                return results[1];
            }
        },
        bindDepEvent: function(conf){
            $(document).on("click",".dialog-dep span",function(e){
                var ele = $(this),parent = ele.parent();
                $(".dialog-dep").addClass("none");
                $(".J_CityMask").addClass("none");
                $(".tab-screen li").removeClass("active-tab");
                var param = ele.data("param") || "all",
                    cnText =ele.text() || "不限";

                parent.siblings().removeClass("active");
                parent.addClass("active");

                var aurl = (window.location.href).split('/'), url;
                if(Index.getQueryString("destName")&&Index.getQueryString("isPublicHeader")){
                    var cityname = encodeURIComponent(cnText);
                    aurl[4] = cityname||'all';
                }else{
                    aurl[4] = param;
                }
                url = aurl.join('/');
                window.location.href = url;
            });
        },
        createMask: function(){
            var mask = $(".J_CityMask");
            if(mask.length > 0){
                mask.removeClass("none");
            }else{
                $("body").append('<div class="J_CityMask mask"></div>');
                $(".J_CityMask").on("click",function(){
                    $(".animation-sort").addClass("none");
                    $(this).addClass("none");
                    $(".dialog-filter").css({"display":"none"});
                    $(".J_CityMask").addClass("none");
                    $(".tab-screen .active-tab").removeClass("active-tab");
                });
            }
        },
        bindDestEvent: function(conf){
            $(document).on("click",".dialog-des span",function(){
                var ele = $(this).parent();
                ele.siblings().removeClass("unfold");
                ele.toggleClass("unfold");
                Index.iscroll.refresh();
            });
            $(document).on("click",".show-more li span,.dialog-des .title",function(e){
                var ele = $(this);
                $(".dialog-des").addClass("none");
                $(".tab-screen li").removeClass("active-tab");
                $(".J_CityMask").addClass("none");
                $(".flow-box span,.dialog-des .title").removeClass("active");
                ele.addClass("active");
                var param = ele.data("param");
                Index.isFilter = false;

                var aurl = window.location.href,
                    str="",
                    url="";
                var urlArr = /[\#|\?].*/.exec(aurl),
                    paramStr = "";
                if(urlArr && urlArr[0]){
                    paramStr = urlArr[0];
                }
                url = aurl.replace(/list\/.+.html.*/igm,'');
                if(Index.getQueryString("destName")&&Index.getQueryString("isPublicHeader")){
                    var destcity = encodeURIComponent(Common.eva('(' + param + ')').newKeyword);
                    paramStr = paramStr.replace(new RegExp("destName=[^=]*?(?=&|$)","i"),"destName="+destcity);
                    str = destcity;
                }else{
                    str = (Common.eva('(' + param + ')').pinyin||'all');
                }
                window.location.href = url+'list/'+ str +'.html'+paramStr;
            });
        },
        parseQueryString: function (qs, sep, eq) {
            sep = sep || ',';
            eq = eq || '=';
            var eqLen = eq.length;
            var obj = {};

            if (typeof qs !== 'string' || qs.length === 0) {
                return obj;
            }

            //todo
            qs = qs.split(sep);

            var len = qs.length, i = 0, keys = [];
            for (; i < len; ++i) {
                var s, k, v, idx;
                s = qs[i];
                idx = s.indexOf(eq);
                // ?a&b=1
                if (idx >= 0) {
                    k = decodeURIComponent(s.substring(0, idx));
                    v = decodeURIComponent(s.substring(idx + eqLen));
                } else {
                    k = decodeURI(s);
                    v = '';
                }

                // resolve ?a=1&a=2;
                if (keys.indexOf(k) === -1) {
                    obj[k] = v;
                    keys.push(k);
                } else {
                    if (typeof obj[k] === "string") {
                        obj[k] = [obj[k], v];
                        obj[k] = obj[k].join();
                    } else {
                        obj[k].push(v);
                        obj[k] = obj[k].join();
                    }
                }
            }

            return obj;
        },
        initFilterEvent: function(cfg){
            var self = this;
            //筛选按钮的点击事件
            var flags = {};
            $(document).on("click",".sel-screen",function(e){
                var el = $(this);
                e.stopPropagation();
                Index.createMask();
                $(".tab-select").removeClass("none");
                //如果已经点击过了，就中断
                if(el.hasClass("active-tab")) {

                }
                else{
                    el.addClass("active-tab");
                    var tabScreen = $(".tab-screen");
                    if(!tabScreen.hasClass("tab-show")){
                        tabScreen.addClass("tab-show");
                    }
                }

                //防止history的后退出问题
                var _tmpCfg = $.extend({},Index.thisCfg);
                if(!Index.defaultData.NotFirst){
                    Index.defaultData = _tmpCfg;
                    Index.defaultData.NotFirst = true;
                }
                //切换到筛选面板的交互

                if(Index.isFilter) {
                    if(_tmpCfg.prop == cfg.prop){
                        return;
                    }
                }

                Index.isFilter = true;
                //渲染筛选面板的数据
                Index.getFilter();

                el.siblings().removeClass("active-tab");
                //筛选面板的选项的点击事件
                $(document).on("click",".cond-panel-wrap .cond-panel",function(){
                    var el = $(this);

                    if(!el.hasClass("J_quality")){
                        el.siblings().removeClass("selected");
                        el.addClass("selected");
                        if(!el.data("isInit")){
                            var iscroll1 = new Iscroll(el.find(".J_FlowBox")[0], {mouseWheel:true,
                                disableMouse:false,click: true});
                            el.data("isInit",true);
                        }
                    }
                });
            });
            //筛选面板的条目单选点击事件
            $(document).on("click",".cond-panel .J_FlowBox .J_Single",function(e){
                e.stopPropagation();
                var el = $(this);
                el.siblings().removeClass("active");
                el.addClass("active");
                //选中后在类目上增加选中后的标记小点点
                var $panel = el.parents(".cond-panel"),
                    index = el.index();
                if(index){
                    $panel.addClass("active");
                }else{
                    $panel.removeClass("active");
                }
            });

            $(document).on("click",".flow-box .J_Multiple",function(){
                var el = $(this),
                    all = el.parents(".J_FlowBox ").find(".J_Multiple"),
                    txt = el.find("span");


                if(txt.text() == "不限"){
                    if(el.hasClass("active")){
                        all.removeClass("active");
                    }else{
                        all.removeClass("active");
                        el.addClass("active");
                    }
                }else{
                    all.eq(0).removeClass("active");
                    el.toggleClass("active");
                }

                //选中后在类目上增加选中后的标记小点点
                var $panel = el.parents(".cond-panel"),
                    count = 0;
                all.each(function() {
                    if ($(this).hasClass("active")){
                        count++;
                    }
                });
                if (count){
                    $panel.addClass("active");
                } else {
                    all.first().addClass("active");
                    $panel.removeClass("active");
                }
                //Index.followingEvent(cfg);
            });
            //fixed事件
            var listElem = $(".J_ListArea"),
                tabHeight = listElem.offset().top - 41,
                lastScrollTop,scrollT;
            $(window).on("touchend touchmove scroll",function(){
                var scrollElem = $(this),
                    jmask = $(".mask");
                if(jmask.length===0||jmask.hasClass("none")){
                    if(lastScrollTop){
                        if(lastScrollTop < document.body.scrollTop){
                            //往下
                            $(".tab-screen").addClass("none");
                            $(".tab-screen").css("position","absolute");
                        }else if(lastScrollTop > document.body.scrollTop){
                            //往上
                            if($(".page").hasClass("current")){
                                $(".tab-screen").addClass("none");
                            }else{
                                $(".tab-screen").removeClass("none");
                                $(".tab-screen").css("position","fixed");
                            }
                        }
                    }
                    lastScrollTop = document.body.scrollTop;
                    window.clearTimeout(scrollT);
                    scrollT = window.setTimeout(function (){
                        if($(".page").hasClass("current")){
                            //$(".tab-screen").hide();
                            $(".tab-screen").addClass("none");
                        }else {
                            $(".tab-screen").removeClass("none");
                            $(".tab-screen").css("position", "fixed");
                        }
                        }, 800);
                }
            });
            //筛选面板的确定点击事件
            $(document).on("click",".ctrl-box .confirm",function(e){
                var els = $(".cond-panel-wrap .cond-panel .active"),
                    qualityEl = $(".J_pinzhi_Box li"),
                    param={},
                    dataParamArr = [],
                    isUnlimited = 0,
                    isChecked = 0;
                if(!els){
                    console.log("未选中节点!");
                    return;
                }
                els.each(function(index,el){
                    var dataParamStr = el.getAttribute("data-param");
                    dataParamArr.push(dataParamStr);
                });
                qualityEl.each(function(index, item) {
                    if ($(item).hasClass("active")) {
                        isChecked++;
                    }
                });
                if (!isChecked) {
                    dataParamArr.push("isTcspecialline=0,isExtraordinary=0");
                }
                var condPanel = $(".cond-panel");
                condPanel.find(".label").each(function() {
                    if($(this).text() === "游玩天数") {
                        $(this).parent().find("li").each(function() {
                            if($(this).text().trim() === "不限") {
                                if ($(this).hasClass("active")) {
                                    isUnlimited++;
                                }
                            }
                        });
                    }
                });
                var dataArrStr = dataParamArr.toString(),
                    dataArrObj = self.parseQueryString(dataArrStr,",","");
                if (dataArrObj) {
                    param = $.extend(param, dataArrObj);
                }
                var minPrice = parseInt($("#pLow").val(), 10) || "",
                    maxPrice = parseInt($("#pTop").val(), 10) || "";
                if (maxPrice > 0) {
                    if (minPrice > maxPrice) {
                        $("#pLow").val(maxPrice);
                        $("#pTop").val(minPrice);
                    }
                }
                var min = $("#pLow").val() || "",
                    max = $("#pTop").val() || "";
                param = $.extend(param,{
                    minPrice: min,
                    maxPrice: max
                });
                if (isUnlimited) {
                    param = $.extend(param, {days:""});
                }
                var dataParam = Common.eva("({pageNum:1})");
                param = $.extend(param, dataParam);
                e.preventDefault();
                $(".filter").removeClass("active-tab");
                var _tmpCfg;
                $("#pageLoading").css("display","block");
                var singleBox = $(".tab-area .active");
                window.setTimeout(function () {
                    Index.getList(param);
                }, 300);
                _tmpCfg = $.extend({},Index.thisCfg);
                var selScreen = $(".sel-screen");
                if(selScreen.hasClass("active-tab")){
                    selScreen.removeClass("active-tab");
                }
                $(".dialog-filter").css({"display":"none"});
                $(".J_CityMask").addClass("none");
                $(".tab-select").removeClass("none");
            });
            //筛选面板的重置按钮
            $(document).on("click",".ctrl-box .reset",function(){
                Index.getFilter();
            });
            $(document).on("click",".ctrl-box .cancel",function(){
                Index.cancelFilter();
                Index.createMask();
                $(".J_CityMask").addClass("none");
                $(".sel-screen").removeClass("active-tab");
            });

        },
        //点击筛选面板的出游类型改变url的出游参数
        changeType:function(singleBox){
                var _key = singleBox.attr("data-key"),
                    aurl = (window.location.href).split('/');
                if(switchCityFlag==true) {
                    aurl[4] = "all";
                }
                aurl[5] = _key;
                var url = aurl.join('/');
                window.location.href = url;
        },
        //切换导航吸顶
        ceiling : function () {
            var self=this,
                $body = $('body'),
                $obj = $('.content');

            window.onscroll = function () {
                if (self.ischanging) {
                    return;
                }
                var btop = $body.scrollTop();
                var tabtop = $obj.offset().top;
                if (btop > tabtop) {
                    $obj.addClass('activeTab');
                }
                else {
                    $obj.removeClass('activeTab');
                }
            }
        },
        //筛选面板的异步
        getFilter:function(){
            var self = this;
            self.resetFilter();
            var filterPanel = $(".filter-panel");
            filterPanel.show();
            $(".J_P_clear span").on("click", function () {
                $(".J_P_limit").find("input").val("");
            });
            new Iscroll($(".J_FlowBox")[0], {
                mouseWheel:true,
                disableMouse:false,click: true
            });
        },
        init: function(cfg){
            var self = this;
            self.initEnv();
            Common.init();
            self.initEvent(cfg);
            self.ceiling();
            Common.resetTopHeight();
            //如果地址栏有isPublicHeader和destName隐藏顶部切换栏
            if(self.getQueryString("isPublicHeader")&&self.getQueryString("destName")){
                $(".tab-area").css({"display":"none"});
            }
            $(".tab-area li").removeClass("active");
            if(!cfg.prop){
                $($(".tab-area li")[0]).addClass("active");
            }else if(cfg.prop == 1){
                $($(".tab-area li")[1]).addClass("active");
            }else if(cfg.prop == 3){
                $($(".tab-area li")[2]).addClass("active");
            }
            if(beginCity=="不限"){
                $(".dep-screen span").html("<i></i>出发地");
            }else{
                var beginCityStr = (beginCity.length > 4) ? (beginCity.substring(0,4) + '...') : beginCity;
                $(".dep-screen span").html("<i></i>"+beginCityStr+"出发");
            }
            var Destination = cfg.newKeyword;
            self.newKeyword = Destination;
            if(!self.getQueryString("destName")&&!self.getQueryString("isPublicHeader")){
                $(".page-header h2").html(Destination+"旅游");
            }
            var totalCount = parseInt($("#hidTotalCount").val(), 10);
            if (!totalCount) {
                self.getNoResult(cfg);
            }
            loadingCfg.totalPage = Math.ceil(totalCount / 10);
            loadingCfg.pageNum = 1;
            self.thisCfg = $.extend(self.thisCfg,cfg||{});
            self.lazyLoad();
            self.scrollLoad(cfg);
            self.setService();
            self.initStatistics();
        },
        lazyLoad: function () {
            $(".J_ListArea img").each(function(index, item) {
                var imgUrl = Common.setImageSize($(item).attr("data-img"), "172x172");
                $(item).attr("data-img", imgUrl);
            });
            if (self.isInit) {
                var imgList = $(".J_ListArea img").not("[data-img-loaded]");
                $("#mainPage").trigger("addElements",imgList);
            } else {
                $('.J_ListArea img').lazyload({
                    "data_attribute": "img",
                    css: {
                        opacity: 0
                    },
                    "container": "body",
                    effect: 'fadeIn'
                });
                self.isInit = true;
            }
        },
        //初始化模块统计
        initStatistics : function(){
            $(document).ready(function(){
                SPM_MODULE.init({
                    deliver : [".J_ListArea"]
                });
            })
        },
        setService: function () {
            Common.render({
                key:"service",
                tmpl:Index.tmplList,
                data: {},
                context: "body",
                callback:function(){
                    Index.setServiceUrlByTab();

                }
            });
        },
        getList: function(cfg, type,callback) {
            var self = this;
            self.thisCfg = $.extend(self.thisCfg,cfg||{});
            if (!type) {
                $(".J_ListArea").empty();
            }
            if (self.thisCfg.newKeyword == "不限") {
                self.thisCfg.newKeyword = "";
            }
            // var param = $.param(self.thisCfg);

            var url = "/intervacation/searchproduct?type=intervacation&channelId=432&count=10&toLpCity=1&isTpackage=0";
            $(".data-loader").css("display","block")
                .html(loadingCfg.loading);
            self.isLoading = true;
            $.ajax({
                url: url,
                data: self.thisCfg,
                dataType: "json",
                success: function(data) {
                    // Index.data = data;
                    var responseData = data ? data.response : [];
                    if (responseData[0] && responseData[0].totalCount > 0) {
                        $(".J_ViewCtrl").css("display", "none");
                        var md = responseData[0];
                        loadingCfg.totalPage = Math.ceil(md.totalCount / 10);
                        loadingCfg.pageNum = self.thisCfg.pageNum - 0;
                        //如果请求失败/请求无结果
                        if (md.lineList) {
                            Common.render({
                                key: "newList",
                                data: md,
                                context: ".list-area",
                                tmpl: self.tmplList,
                                type: type,
                                callback: function(cfg) {
                                    self.lazyLoad();
                                    self.isLoading = false;
                                    $(".J_ListArea").show();
                                    $(".J_ViewCtrl").show();
                                    $("#pageLoading").css("display", "none");

                                    callback && callback.call(this);
                                    if (loadingCfg.totalPage <= (loadingCfg.pageNum - 0)) {
                                        $(".data-loader").css("display","block")
                                            .html(loadingCfg.nomore);
                                    }
                                    //将数据绑定到对应的节点上以便后续处理
                                    var auctionEls = cfg.dom.filter(function(){return $(this).hasClass("auction");});
                                    var data = cfg.data.lineList[0].line;
                                    auctionEls.each(function(i,elem){
                                        var isHot = $(elem).attr("data-isHot");
                                        isHot && $.extend(data[i],{isHot: 1});
                                        $(elem).data("auction",data[i]);
                                    });
                                    //统计模块参数添加
                                    SPM_MODULE.eventBind();
                                }
                            });
                        } else {
                            $(".data-loader").css("display","block").html(loadingCfg.nomore);
                        }
                    } else {
                        //判断是否是自助游
                        //出发地和目的地都匹配 但是没有相关线路 比如 贵阳 到 中东非
                        self.getNoResult(self.thisCfg);
                        $(".img-noresult").css({"display":"block","float":"left"});
                    }
                }
            });
        },
        getCfg: function(el) {

            if(!el){
                el = $(".tab-area .active");
            }
            var desTitle;
            if(Index.getQueryString("destName")&&Index.getQueryString("isPublicHeader")){
                desTitle = Index.newKeyword;
            } else {
                desTitle = Index.newKeyword+"旅游";
            }
            return {
                "tag": "main",
                "title": desTitle,
                "el": el,
                callback: function() {
                    var selScreen = $(".sel-screen"),
                        tabScreen = $(".tab-screen");
                    selScreen && selScreen.removeClass("active");
                    tabScreen && tabScreen.show();
                }
            };
        },
        initCfg: function() {
            if(Common.pages.length <1){
                var cfg = Index.getCfg();
                Common.pages.push(cfg);
            }
        },
        /**
         * 获取无结果页面
         * @param arrCity 由于无结果页面需要展示到达城市，所以传入到达城市
         * @param prop 是否是自助游
         */
        getNoResult: function(conf, bool){
            var self = this,
                url = '/intervacation/searchproduct?type=intervacation&channelId=432&count=10&toLpCity=1&isTpackage=0',
                isTravel='',
                prop = (conf.prop == 0) ? "" : conf.prop,
                noResultCity = conf.newKeyword;
            //prop=1 跟团;prop=3 自助  ,全部prop=0
            if(prop == 1){
                isTravel = '跟团游';
            }else if(prop == 3){
                isTravel = '自由行';
            }else if(!prop){
                isTravel = '全部';
            }
            $(".J_ViewCtrl").css("display","none");
            $("#pageLoading").css("display","block");
            $(".data-loader").css("display","none");
            $('.tab-screen').show();
            var param = {
                newKeyword: "",
                prop: prop,
                scId: bool ? "" : conf.scId,
                lcCity: bool ? "" : conf.lcCity,
                sort: "touchComprehensiveCTRSort:desc",
                pageNum: 1,
                stat: ""
            }
            $.ajax({
                url: url,
                data: param,
                dataType: "json",
                success: function (data){
                    var responseData = data ? data.response : [];
                    if (responseData[0] && responseData[0].totalCount > 0) {
                        var noResultData = responseData[0];
                        noResultData.isTravel = isTravel;
                        noResultData.noResultBenCity = beginCity;
                        noResultData.noResultCity = noResultCity;
                        Common.render({
                            key: "noresult",
                            data: noResultData,
                            context: ".list-area",
                            tmpl: self.tmplList,
                            overwrite: true,
                            callback: function(){
                                $("#pageLoading").css("display","none");
                                $(".sortbar-panel").hide();
                                $(".J_ListArea").show();
                                $(".J_ViewCtrl").show();
                                self.lazyLoad();
                            }
                        });
                    } else {
                        self.getNoResult(conf, true);
                    }
                }
            });
        },
        /**
         * 加载更多的列表数据,滚动时触发
         * @param callback
         */
        loadListData: function(callback){
            var pageIndex = loadingCfg.pageNum;
            if(++pageIndex<=loadingCfg.totalPage){
                var cfg = {pageNum:pageIndex};
                Index.getList(cfg,"append",callback);
            }else{
                callback.call(this,this);
            }
        },
        /**
         * 绑定滚动加载数据事件
         */
        scrollLoad: function(conf){
            var self = this;
            $(window).on("scroll", function (e) {
                var scrollElem = $(this),
                    isNotInList = $("#mainPage").css("display") === "none";
                if(isNotInList) {
                    return;
                }
                var diff = 20;
                if (!self.isLoading && !self.isLoaded &&
                    scrollElem.scrollTop() + diff >= $("body").height() - scrollElem.height() &&
                    loadingCfg.totalPage>loadingCfg.pageNum){
                    self.isLoading = true;

                    $(".data-loader").css("display","block")
                        .html(loadingCfg.loading);
                    self.loadListData(function(){
                        if(loadingCfg.totalPage<loadingCfg.pageNum){
                            self.isLoaded = true;
                            return;
                        }
                        self.isLoading = false;
                    });
                    self.followingEvent(conf);
                }
                e.stopPropagation();
            });
        },
        /**
         * 添加跟踪
         */
        followingEvent:function(){
            if(window._tcTraObj&&_tcTraObj._tcTrackEvent) {
                var opt_label, opt_value;
                if (arguments.length === 2) {
                    opt_label = "arrcity";
                    opt_value = "|" + arguments[0] + "|" + arguments[1] + "|" + "排序（默认排序）" + "|";
                    _tcTraObj._tcTrackEvent('mssearchlist', 'exitsearch', opt_label, opt_value);
                } else if (arguments.length === 3) {
                    if (arguments[0] === "package") {
                        opt_label = "grouptour";
                    } else {
                        opt_label = "selfservicetour";
                    }
                    opt_value = "|" + arguments[1] + "|" + arguments[2] + "|" + "排序（默认排序）" + "|";
                    _tcTraObj._tcTrackEvent('mssearchlist', 'exitsearch', opt_label, opt_value);
                } else if (arguments.length === 1) {
                    var travelCity = arguments[0].newKeyword;
                    opt_label = "pageturning";
                    var page = loadingCfg.pageNum;
                    var sort = "";
                    if ($(".dialog-sort").find(".active-dialog").length) {
                        sort = $(".dialog-sort").find(".active-dialog").text().replace(/\s/g, "");
                    }
                    var con = "";
                    if ($(".J_FlowBox").find(".active").find(".needsclick").length) {
                        for (var i = 0, j = $(".J_FlowBox").find(".active").find(".needsclick").length; i < j; i++) {
                            con += $($(".J_FlowBox").find(".active").find(".needsclick")[i]).text();
                            if (i != j - 1) {
                                con += "-";
                            }
                        }
                    }
                    opt_value = "|" + beginCity + "|" + travelCity + "|" + sort + "|" + con + "|" + page;
                    _tcTraObj._tcTrackEvent('mssearchlist', 'exitsearch', opt_label, opt_value);
                }
            }else{
                console.log("不存在方法_tcTraObj._tcTrackEvent");
            }
        }
    };
    function isLogin(){
        var cnUser = $.cookie("cnUser");
        return /userid=[^&]+/.test(cnUser);
    }
    function processData(data){
        var tmpArr = [];
        var _data = data.list;
        _data.forEach(function(valList){
            valList.list.forEach(function(val){
                if(val.isHot !== 0){
                    tmpArr.push(val);
                }
            });
            valList.list.unshift({
                "en": valList.title,
                "cn": valList.title
            })
        });
        _data.unshift({
            list: tmpArr,
            title: "热门目的地"
        });
    }
    module.exports = Index;
})(Zepto);