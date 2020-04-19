define("tagfilter/0.1.0/index",["tmpl/pc/newtag/searchFilter","common/0.1.0/index",
    "tagfilter/0.1.0/index.css"
],function(require){
    var Filters = function(){
    };
    var Common = require("common/0.1.0/index");
    Filters.prototype = {
        host: window.host||"",


        _init:function(cfg){
            var self = this;
            self.ajaxUrl= cfg.ajaxUrl;
            self.el = cfg.el;
            this.initFilter();

        },
        init: function(){
            this.seachlist();
            this.pricetext();
            this.extracondit();
            this.Calendarfun();
            this.initFilterEv();
        },






        /**
         * @desc 多选 更多显隐
         * */
        seachlist:function(){
            var self = this;
            /**
             * @desc 还原板块
             */
            var removeinput=function(t){
                var tpar = t.parents(".rowbox");
                $(".more-btn",tpar).html("更多").removeClass("less-btn");
                $(".multibtn",tpar).removeClass("none");
                tpar.removeClass("alllist");
                tpar.attr("data-multiselect","false");
                $(".rowlist a",tpar).removeClass("addinput onlist");
            }

            $(".rowbox").each(function(nub,ele){
                var list = $(ele).find(".rowlist"),
                    t_btn = $(ele).find(".more-btn");
                if ($(list).height()<30) {
                    t_btn.addClass("none");
                }else{
                    t_btn.removeClass("none");
                }
            });

            $(".multibtn").on("click",function(){// 多选
                var t = $(this),
                    tpar = t.parents(".rowbox"),
                    listbox = $(".rowlist",t.parents(".rowbox"));
                $("a",listbox).addClass("addinput");
                if (!tpar.hasClass("alllist")) {
                    tpar.addClass("alllist");
                    tpar.attr("data-multiselect","true");
                }

                $(t).addClass("none");
                $(".btns",tpar).removeClass("none");
                $(".more-btn").addClass("less-btn")
                $(".more-btn",tpar).html("收起");
            });

            $(".crumlist .more-btn").on("click",function(){//展开 收起
                var t = $(this),
                    tpar = t.parents(".rowbox");
                if (!tpar.hasClass("alllist")) {
                    tpar.addClass("alllist");
                    t.addClass("less-btn")
                    t.html("收起");
                }else{
                    removeinput(t);
                }
            });

            $(".cancel").on("click",function(){//点击取消
                var t = $(this);
                removeinput(t);
            });
            $(".submit").on("click",function(){//点击确定
                var t = $(this),
                    data="",
                    tpar = t.parents(".rowbox"),
                    cl=$(".cancel",tpar);
                listcheck = $(".rowlist a",tpar);

                if ( $(".onlist",tpar).length !== 0){
                    $(listcheck).each(function(nub,ele){
                        if ($(ele).hasClass("onlist")) {
                            data+=($(ele).html()+",");
                            tpar.attr("attr-data",data.substring(0,data.length-1));
                        }
                    });
                    //nodejoin
                    self.nodeJoin(tpar);
                    //nodejoin 结束
                }else{
                    removeinput(cl);
                }
                //removeinput(t);
            });
            $(".rowlist a").on("click",function(){//多选
                var t = $(this),
                    tpar = t.parents(".rowbox");
                // 是否可多选 true false
                if (tpar.attr("data-MultiSelect") === "false") {
                    if (tpar.attr("data-openurl") === "false") {
                        tpar.attr("attr-data", t.html());
                        self.nodeJoin(tpar);
                    }
                    return;
                }
                if (t.hasClass("onlist")) {
                    t.removeClass("onlist");
                }else {
                    t.addClass("onlist");
                }

            });
            $(".crumbox").delegate('.crumdiv i', 'click', function(){
                var tbox = $(this).parents(".crumdiv");
                //self.resetlist(tbox);
                tbox.remove();
                if ($(".crumbox .crumdiv").length === 0) {
                    $(".crumbox").addClass("none");
                }
            });

            $(".removeall").on('click', function(){
                $(".crumlist .rowbox").removeClass("none");
                $(".crumbox .crumdiv").remove();
                $(".crumbox").addClass("none");
            });

            $(".showBtn").on("click",function(){
                var box= $(".showboxs"),
                    btn=$(".showBtn");
                if (box.hasClass("none")) {
                    box.removeClass("none");
                    btn.addClass("upbtn");
                    $("i",btn).html("收起");
                    $(".showboxs .rowbox").each(function(nub,ele){
                        var list = $(ele).find(".rowlist"),
                            t_btn = $(ele).find(".more-btn");
                        if ($(list).height()<30) {
                            t_btn.addClass("none");
                        }else{
                            t_btn.removeClass("none");
                        }
                    });
                }else {
                    box.addClass("none");
                    btn.removeClass("upbtn");
                    $("i",btn).html("展开");

                }
            });
        },
        resetlist:function(tbox) {
            var delecondition = $("i", tbox).attr("data-list");
            $(".crumlist .rowbox").each(function (nub, elem) {
                var row = $(elem).attr("data-list");
                if (delecondition === row) {
                    $(elem).removeClass("none");
                    return;
                }
            });
        },
        /**
         * @desc 添加筛选板块
         */
        nodeJoin : function(tpar){
            var listname = $(tpar).attr("attr-name");
            var key = $(tpar).attr("data-key");
            $(tpar).removeClass("alllist");
            // tpar.attr("data-multiselect","false");
            var strhtml ='<div class="crumdiv" data-key="'+ key +'" title='+ tpar.attr("attr-data") +'><span class="crumtitle">'+listname +'</span><b class="curminfo">'+tpar.attr("attr-data").substring(0,21)+'</b><i data-list ='+tpar.attr("data-list")+'>&nbsp;</i></div>';
            $(".removeall").before(strhtml);
            $(".crumbox").removeClass("none");
            tpar.addClass("none");
        },
        /**
         * @desc 价格筛选
         */
        pricetext:function(){
            $("#priceinner").on("mouseover",function(){
                $(".price-bot").removeClass("none");
                $("#priceinner").addClass("pricelist");

            }).on("mouseout",function(){
                $(".price-bot").addClass("none");
                $("#priceinner").removeClass("pricelist");
            });
            $(".inputbox input").focus(function(){
                $(this).css("color","#333");
            }).keyup(function(){
                $(this).val("¥"+$(this).val().replace(/[^\d]/g, ''));
            });
            $(".price-bot a").on("click",function(){
                var min=$(".min").val(),
                    max=$(".max").val(),
                    min_rep = min.replace(/¥/g,''),
                    max_rep = max.replace(/¥/g,'');
                //if (min_rep.length === 0 && max_rep.length === 0) return;
                if(max_rep>0) {
                    if (min_rep > max_rep) {
                        var temp = $(".min").val();
                        $(".min").val(max);
                        $(".max").val(temp);
                    }
                }

                //$.ajax({
                //    url:,
                //    success:function(){
                //
                //    }
                //})
            });
            $(".price-bot span").on("click",function(){
                $(".inputbox input").val("");
            });
        },
        /**
         * @desc 可用红包 优惠促销
         */
        extracondit:function(){
            $(".huilist").on("mouseover",function(){
                $(".huiul",this).removeClass("none");
            }).on("mouseout",function(){
                $(".huiul",this).addClass("none");
            });

            $(".chengylab,.filter-row span").on("click",function(){
                var t =$(this);
                pitchon(t);
            });
            $(".huiul li").on("click",function(){
                var t =$(this),
                    list = t.parents(".huilist"),
                    amend =$("em",list);
                pitchon(t);
                if(list.hasClass("multiple") && $(".removeinput",list).length >= 3){
                    amend.html(amend.attr("attr-list"));
                }else{
                    amend.html(amend.attr("attr-data"));
                }
            });

            var pitchon = function(t){
                if(t.hasClass("removeinput")){
                    t.removeClass("removeinput");
                }else{
                    t.addClass("removeinput");
                }
            };

        },
        /**
         * @desc 日历
         */
        Calendarfun : function(){
            var self = this;
            var cal = new $.Calendar({
                skin:"white",
                width:1000
            });
            var cal2 = new $.Calendar({
                skin:"white",
                width:1000
            });
            $("#startTime").on("focus", function() {
                var endtime = $("#endTime").val()===""?"2020-12-12":$("#endTime").val();
                cal.pick({
                    elem: this,
                    startDate:$("#startTime").attr("attr-timeb"),
                    endDate:endtime,
                    mode: "rangeFrom",
                    offset: {
                        left: -70
                    },
                    currentDate: [$("#startTime").attr("attr-timeb")],
                    fn: function () {
                        cal2.pick({
                            elem: $("#endTime"),
                            mode: "rangeTo",
                            offset: {
                                left: -90
                            },
                            startDate: $("#startTime").val()!==""?$("#startTime").val():$("#startTime").attr("attr-timeb")
                        });
                    }
                });
            });

            $("#endTime").on("focus", function() {
                cal2.pick({
                    elem: this,
                    mode: "rangeTo",
                    offset: {
                        left: -70
                    },
                    startDate: $("#startTime").val()!==""?$("#startTime").val():$("#startTime").attr("attr-timeb")
                });
            });
            $(".cal_btn").on("click",function(){
                if ($("#startTime").val() === "") {
                    $("#startTime").focus();
                    $(this).attr("data-isReady","0");
                }else if ($("#endTime").val() === "") {
                    $("#endTime").focus();
                    $(this).attr("data-isReady","0");
                }else{
                    var tpar = $(this).parents(".rowbox"),
                        data = $("#startTime").val() +"~"+$("#endTime").val();
                    tpar.attr("attr-data",data);
                    self.nodeJoin(tpar);
                    $("#startTime").val("");$("#endTime").val("");
                    $(this).attr("data-isReady","1");
                }
            });

        },
        defaultFilterParam: (function(){
            var isTCRecommand = 0;  //绝对排序
            var sortOrderType = 0;  //订单数
            var sortManyiType = 0;  //点评数
            var sortPriceType = 0; //同程价
            var days = '';  //天数
            var bqid = 0;  //标签id
            var specialNickId = '';  //线路玩法id
            var cityId = 0;  //出发城市id
            var mcityId = '';  //目的地Id(配置id,非线路真实)
            var minPrice = '';  //最小价格(同程价) 价格区间
            var maxPrice = '';  //最大价格(同程价) 价格区间
            var pageNum = 1;  //从start开始
            var count = 20;  //从start开始取size条
            var month = '';  //月份yyyyMM
            var lineQuality = ''; //线路品质id
            var lineStar = 0; //线路星级id
            var isGenuine = 0; //是否是程意正品
            var _config = parseUrl();
            return $.extend({
                isTCRecommand: isTCRecommand,
                //sortOrderType: sortOrderType,
                //sortManyiType: sortManyiType,
                //sortPriceType: sortPriceType,
                days: days,
                bqid: bqid,
                specialNickId: specialNickId,
                cityId: cityId,
                mcityId: mcityId,
                minPrice: minPrice,
                maxPrice: maxPrice,
                pageNum: pageNum,
                count: count,
                month: month,
                lineQuality: lineQuality,
                lineStar: lineStar,
                isGenuine: isGenuine,
                _dAjax: "callback"
            },_config);
        })(),
        buildParam: function(param){
            return $.extend({},this.defaultFilterParam,param || {});
        },
        ajax: function(param){
            var self = this;
            return $.ajax({
                url: this.ajaxUrl,
                data: param,
                dataType: "jsonp"
            });
        },
        renderFilter: function(data,callback){
            var self=this;
            var filterTmpl = require("tmpl/pc/newtag/searchFilter");
            Common.render({
                tpl: filterTmpl,
                data: data,
                context: self.el,
                overwrite: true,
                callback: callback
            });
        },
        initFilterEvOne: function(){
            var self = this;
            //删除筛选
            $(".crumbox").on("click",".crumdiv i",function(){
                var key = $(this).parents(".crumdiv").attr("data-key");
                self.removeCondition.apply(self,key.split("|"));
                var hasCondition = self.hasCondition();
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //移除全部
            $(".removeall").on("click",function(e){
                e.preventDefault();
                self.removeConditionAll();
                var hasCondition = self.hasCondition();
                self._initFilter(function(){
                    //self.initCondition();
                    self.initRow();
                    //self.initFilterEvOne();
                });
            });
            //重新筛选
            $(".del-filter").on("click",function(e){
                e.preventDefault();

                $(".removeall").click();
            });
        },
        initFilterEv: function(){
            var self = this;
            //线路分类
            $(".J_lineType a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    lineQuality: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //线路玩法
            $(".J_linePlay a").on("click",function(e){
                e.preventDefault();
                if($(this).parents(".rowbox").hasClass("alllist")){
                    return;
                }
                var id = $(this).attr("data-value");
                self.addCondition({
                    specialNickId: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //线路玩法多选
            $(".J_linePlay .submit").on("click",function(){
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
                if ( $(".onlist",tpar).length !== 0) {
                    var ret = [];
                    $(".J_linePlay >a").each(function () {
                        if ($(this).hasClass("onlist")) {
                            ret.push($(this).attr("data-value"));
                        }
                    });
                    self.addCondition({specialNickId: ret.join(',')});
                    self._initFilter(function () {
                        self.initRow();
                    });
                }
            });
            //游玩天数
            $(".J_lineDays a").on("click",function(e){
                e.preventDefault();
                if($(this).parents(".rowbox").hasClass("alllist")){
                    return;
                }
                var id = $(this).attr("data-value");
                self.addCondition({
                    days: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //游玩天数多选
            $(".J_lineDays .submit").on("click",function(){
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
                if ( $(".onlist",tpar).length !== 0) {
                    var ret = [];
                    $(".J_lineDays >a").each(function () {
                        if ($(this).hasClass("onlist")) {
                            ret.push($(this).attr("data-value"));
                        }
                    });
                    self.addCondition({days: ret.join(',')});
                    self._initFilter(function () {
                        self.initRow();
                    });
                }
            });
            //出游日期 时令
            $(".J_lineStartDate a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                var key = $(this).attr("data-key");
                var obj;
                if(key === "month"){
                    obj = {month: id};
                }
                if(key === "clractTitleId"){
                    obj = {clractTitleId: id};
                }
                self.addCondition(obj);
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //线路特色
            $(".J_lineFeature a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    rcImgTitleId: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //行程景点
            $(".J_lineScenery a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    lineSceneryIds: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //行程景点多选
            $(".J_lineScenery .submit").on("click",function(){
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
                if ( $(".onlist",tpar).length !== 0) {
                    var ret = [];
                    $(".J_lineDays >a").each(function () {
                        if ($(this).hasClass("onlist")) {
                            ret.push($(this).attr("data-value"));
                        }
                    });
                    self.addCondition({days: ret.join(',')});
                    self._initFilter(function () {
                        self.initRow();
                    });
                }
            });
            //出发城市
            $(".J_lineCity >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    cityId: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //酒店类型
            $(".J_hotelType >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    hotelGradeId: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //航班类型
            $(".J_flightType >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    flightTypeId: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //出发时间
            $(".J_goTime >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    goDepartureTime: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //返回时间
            $(".J_backTime >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    backDepartureTime: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //线路星级
            $(".J_lineStar >a").on("click",function(e){
                e.preventDefault();
                var id = $(this).attr("data-value");
                self.addCondition({
                    lineStar: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });

            //服务特色
            $(".J_lineService >span").on("click",function(){
                var ones = [];
                if($(".J_lineService .removeinput").length>0)
                {
                    var obj = {},
                        str;
                    var ob = [];
                    $(".J_lineService .removeinput").each(function(){
                        var _this = $(this),
                            _val = _this.attr("data-value");
                        ob.push(_val);
                    })
                    ones=ob;
                    str=ob.join(",");
                    obj = {"serviceCharId": str}
                    self.addCondition(obj);
                }
                else{
                    self.removeCondition("serviceCharId");
                }
                self._initFilter(function(){
                    self.initRow();
                    if(ones.length>0)
                    {
                        $(".J_lineService .pitchon").each(function(k,el){
                            for(var i=0;i<ones.length;i++)
                            {
                                if($(el).attr("data-value")==ones[i])
                                {
                                    $(el).addClass("removeinput");
                                }
                            }

                        })
                    }
                });
            });
            //程意正品
            $(".chengylab").on("click",function(){
                if($(this).hasClass("removeinput")){
                    self.addCondition({
                        "isGenuine": 1
                    });
                }else{
                    self.removeCondition("isGenuine");
                }
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //排序 0-》综合排序 1-》销量 2-》点评 3-》价格
            $(".sort-ul >li a").on("click",function(e){
                e.preventDefault();
                var parEl = $(this).parent();
                var index = parEl.index();
                var obj = {};
                parEl.addClass("cur").siblings().removeClass("cur");
                switch (index){
                    case 0: break;
                    case 1: obj.sortOrderType = 1;obj.isTCRecommand = '';obj.sortManyiType = '';obj.sortPriceType = ''; break;
                    case 2: obj.sortManyiType = 1;obj.isTCRecommand = '';obj.sortOrderType = '';obj.sortPriceType = ''; break;
                    case 3:
                        $(this).toggleClass("order-by-desc");
                        if($(this).hasClass("order-by-desc")){
                            obj.sortPriceType = 0;
                            obj.isTCRecommand = '';obj.sortManyiType = '';obj.sortOrderType = '';
                        }else{
                            obj.sortPriceType = 1;
                            obj.isTCRecommand = '';obj.sortManyiType = '';obj.sortOrderType = '';
                        }
                        break;
                }
                self.removeCondition("sortOrderType","sortOrderType","sortManyiType","sortPriceType");
                self.addCondition(obj);
                if(index ===0){
                    self._initFilter({isTCRecommand: 0,count: 20},function(){
                        self.initRow();
                        $(".sort-ul >li").eq(index).addClass("cur").siblings().removeClass("cur");
                        if(obj.sortPriceType === 0){
                            $(".sort-ul >li a:last").addClass("order-by-desc");
                        }
                    });
                }else{
                    self._initFilter({isTCRecommand: ''},function(){
                        self.initRow();
                        $(".sort-ul >li").eq(index).addClass("cur").siblings().removeClass("cur");
                        if(obj.sortPriceType === 0){
                            $(".sort-ul >li a:last").addClass("order-by-desc");
                        }
                    });
                }
            });
            //价格
            $(".price-bot >a").on("click",function(){
                var min = $(".min","#priceinner").val().slice(1);
                var max = $(".max","#priceinner").val().slice(1);
                if(min || max){
                    self.addCondition({minPrice: min,maxPrice: max});
                    self._initFilter(function(){
                        $(".min","#priceinner").val("¥"+min);
                        $(".max","#priceinner").val("¥"+max);
                    });
                }
            });
            //清除价格
            $(".price-bot >span").on("click",function(){
                var min = "";
                var max = "";
                self.removeCondition("minPrice","maxPrice");
                self._initFilter(function(){
                    self.initRow();
                });

            });
            //出游日期时间
            $(".cal_btn").on("click",function(){
                if($(this).attr("data-isReady") === "1"){
                    var dateArr = $(".J_lineStartDate").parents(".rowbox").attr("attr-data").split("~")
                    var startTime = dateArr[0];
                    var endTime = dateArr[1];
                    self.addCondition({MinVGDate: startTime,MaxVGDate: endTime});
                    self._initFilter(function(){
                        self.initRow();
                    });
                }
            });
        },
        /**
         * @desc 筛选请求并渲染
         * @param config
         * @param callback
         * @private
         */
        _initFilter: function(config,callback){
            var self = this;
            if($.isFunction(config)){
                callback = config;
                config = {};
            }
            $("#tagList").empty();
            $("#J_LablePager").empty();
            $(".loading").show();
            self._param_ = self.buildParam(config);
            //console.log(self._condition_ );
            $.extend(self._param_,self._condition_ || {});

            self.ajax(self._param_)
                .then(function(data){
                    $(".loading").hide();
                    if(data == null){
                        $("#tagList").empty();
                        $("#J_LablePager").empty();
                        $("#J_ClearFilter").show();
                        $("#J_NoLine").hide();
                        return;
                    }
                    data.ProductFilter.travelType = self.travelType;
                    self.renderFilter(data.ProductFilter,function(){
                        self.init();
                        self._changeUrl(".J_lineCity>a");
                        if(self._condition_.lineQuality != null){
                            $(".J_lineStar").parents(".rowbox").show();
                        }
                        if(self._condition_.sortOrderType===1)
                        {
                            $(".sort-ul li").removeClass("cur");
                            $(".sort-ul li").eq(1).addClass("cur");

                        }
                        if(self._condition_.sortManyiType===1)
                        {
                            $(".sort-ul li").removeClass("cur");
                            $(".sort-ul li").eq(2).addClass("cur");
                        }
                        if(self._condition_.sortPriceType===1)
                        {
                            $(".sort-ul li").removeClass("cur");
                            var _par =$(".sort-ul li").eq(3);
                            _par.addClass("cur");
                        }else if(self._condition_.sortPriceType===0){
                            $(".sort-ul li").removeClass("cur");
                            var _par =$(".sort-ul li").eq(3);
                            $(".sort-ul li").eq(3).addClass("cur");
                            $("a",_par).addClass("order-by-desc");
                        }

                        callback && callback();
                    });
                    if(data.TotalCount === 0){
                        $("#J_ClearFilter").show();
                        $("#J_NoLine").hide();
                        return;
                    }else{
                        $("#J_ClearFilter").hide();
                    }
                    console.log(self._condition_);

                    window.fil= {"parms":self._param_,"data":data};

                });
            if($(".crumbox .crumdiv").size()){
                $(".crumbox").show();
            }else{
                $(".crumbox").hide();
            }
        },
        /**
         * @desc 初始化筛选面板
         * @param config
         */
        initFilter: function(){
            var self = this;
            var config = self.parseUrl();
            delete config.cityId;
            self.addCondition(config);
            $.extend(self.defaultFilterParam);
            self._initFilter(function(){
                self.initCondition();
                self.initRow();
                self.initFilterEvOne();
            });
            self._changeUrl(".leavecity dd a","cityid");
        },
        /**
         * @desc 初始化筛选条件
         */
        initCondition: function(){
            var self = this;
            var config = this.parseUrl();
            var str = '<div class="crumdiv" data-key="{key}">'+
                '<span class="crumtitle">{type}</span><b class="curminfo">{name}</b><i data-list="1">&nbsp;</i>'+
                '</div>';
            var ret = [],obj = {};
            if(!self._condition_){
                self._condition_ = $.extend({},config);
            }
            for(var i in config){
                if(i === "cityId" || config[i] == null) {
                    continue;
                }
                obj.name = config[i];
                switch (i){
                    case "days":
                        obj.type = "游玩天数";
                        $(".J_lineDays").parents(".rowbox").hide();
                        break;
                    case "month":
                        obj.type = "出游日期";
                        $(".J_lineStartDate").parents(".rowbox").hide();
                        break;
                    case "lineQuality":
                        obj.type = "线路分类";
                        $(".J_lineType").parents(".rowbox").hide();
                        break;
                }
                ret.push(str.replace("{type}",obj.type).replace("{name}",obj.name).replace("{key}",i));
            }
            if(ret.length){
                $(".crumbox h4").after(ret.join(''));
                $(".crumbox").show();
            }else{
                $(".crumbox").hide();
            }
        },
        /**
         * @desc 移除条件
         * @param
         */
        removeCondition: function(){
            var self = this;
            var args = Array.prototype.slice.call(arguments,0);
            for(var j = 0;j<args.length;j++){
                for(var i in self._condition_){
                    if(i === args[j]){
                        delete self._condition_[i];
                    }
                }
            }
        },
        removeConditionAll:function(){
            var self = this;
            self._condition_ = {};
        },
        /**
         * @desc 增加条件
         * @param condition
         */
        addCondition: function(condition){
            var self = this;
            if(!self._condition_){
                self._condition_ = {};
            }
            return $.extend(self._condition_,condition);
        },
        /**
         * @desc 初始化栏目
         * @param rowEl
         */
        initRow: function(){
            var self = this;
            $(".crumbox .crumdiv").each(function(){
                var key = $(this).attr("data-key");
                $(".crumlist .rowbox").each(function(){
                    if($(this).attr("data-key") === key){
                        $(this).hide();
                    }
                });
            });
            for(var i in self._condition_){
                if(i === "isGenuine" && self._condition_[i]){
                    $(".chengylab").addClass("removeinput");
                }
            }

        },
        /**
         * @desc 解析url
         * @returns {{cityId: *, days: *, month: *, lineQuality: *}}
         */
        parseUrl: parseUrl,
        /**
         * @desc 跟团1 自由行3
         */
        travelType: (function(){
            return /\-(gentuan)\-/.test(window.location.href) ? 1 : 3;
        })(),
        /**
         * @desc 是否有筛选条件
         * @returns {boolean}
         */
        hasCondition: function(){
            var self = this;
            var hasCondition = false;
            var param = self.parseUrl();
            var ret = $.extend({},param,self._condition_);
            //如果 days month lineQuality 不为空 已有查询条件
            $.each(ret,function(k,v){
                if(k === "cityId"){
                    return;
                }
                if(v || v === 0){
                    hasCondition = true;
                    return false;
                }
            });
            return hasCondition;
        },
        _changeUrl: function(elArr,attr){
            var url = window.location.pathname;
            $(elArr).each(function(){
                var id = $(this).attr(attr || "data-value");
                var _url = url.replace(/(\-tag\/f)(\d+)/,function($0,$1){
                    return $1 + id;
                });
                $(this).attr("href",_url+"#seafilter");
            });
        }

    };
    function parseUrl(){
        // http://www.ly.com/dujia/taiguo111-zizhu-tag/f3d6m6t1/
        // http://www.ly.com/dujia/taiguo111-zizhu-tag/f3m6t1/
        // http://www.ly.com/dujia/taiguo111-zizhu-tag/f3dm6t1/
        // http://www.ly.com/dujia/taiguo111-zizhu-tag/f3d6m6t1
        // http://www.ly.com/dujia/taiguo111-zizhu-tag/
        //var str = window.location.href.replace(/(https|http):\/\//,'');
        var str = "http://www.ly.com/dujia/dongnanya11-gentuan-des/f321dmt/";
        var match = /\/(?:f(\d*))(?:d(\d*))?(?:m(\d*))?(?:t(\d*))?\/?/.exec(str);
        return {
            cityId: match ? (match[1] ? match[1] : undefined):undefined,
            days: match ? (match[2] ? match[2] : undefined):undefined,
            month: match ? (match[3] ? match[3] : undefined):undefined,
            lineQuality: match ? (match[4] ? match[4] : undefined):undefined
        };
    }
    return Filters;
});
