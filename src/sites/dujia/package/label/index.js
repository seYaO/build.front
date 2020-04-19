
var NewTag = function(){};
var Common = require("common/0.1.0/index"),
    storage = require("common/0.1.0/storage"),
    dialog = require("modules/dialog/0.2.0/dialog.cmd"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    lazyload = require("lazyload/0.1.0/index");
NewTag.prototype = {
    param: {
        cityId: $("#hidCityId").val()
    },
    init: function (conf) {
        var self = this;
        var IsSearch = $("#hidIsLabelOrSearch").val();
        if(IsSearch == "Search"){
            $("#filter").empty();
            $("#tagList").empty();
            self.searchAjax(conf);
        }else{
            self.real_init(conf);
            $.extend(self.filter.defaultFilterParam,conf);
        }
    },
    searchAjax: function(conf) {
        var self = this;
        self.filter.initFilter(conf);
        self.real_init(conf);
    },
    real_init: function (conf,num) {
        this.resizeWindowEvent();
        this.openresize();
        this.hoverLi();
        this.getDestination();
        this.bottomLink();
        //this.getListDate();
        this.lazyLoad();
        this.getRecord();
        this.filter._changeUrl(".leavecity dd a","cityid");
        this.filter._param_ = this.filter.buildParam(conf);
        this.filter._condition_ = {};
        this.filter.init();
        this.filter.initFilterEvOne();
        this.getPage(conf,num);
        this.getnearshop();
        this.nearshopLi();
        this.initTip();
        this.itemEvent();
        this.initslider();
        $(".showBtn").hover(function(){
            $(".showBtn").addClass("hovershow");
        },function(){
            $(".showBtn").removeClass("hovershow");
        })
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
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=2&c=2"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=2&c=2"><span class="ico-title">在线客服<i></i></span></a>',
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
            pageName: "机酒任选标签页",
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
    itemEvent: function(){
        $(document).on('click', ".J_more", function() {
            var self = $(this);
            if (self.hasClass('fold')) {
                self.removeClass('fold');
                self.html("展开更多<b></b>");
                self.parent().prev(".mod-list").css('max-height', '562px');
            } else {
                    self.html("收起更多<b></b>");
                    self.addClass('fold');
                    self.parent().prev(".mod-list").css('max-height', '10000px');
            }
        });
        $(document).on('click', ".J_moreTese", function() {
            var self = $(this);
            if (self.hasClass('shou')) {
                self.removeClass('shou');
                self.html("展开更多<i></i>");
                self.parent().find(".sort-service-box").css('max-height', '62px');
            } else {
                    self.html("收起更多<i></i>");
                    self.addClass('shou');
                    self.parent().find(".sort-service-box").css('max-height', '10000px');
            }
        });
    },
    callback: function(){
        this.hoverLi();
        //this.getListDate();
        this.lazyLoad();
        //模块id添加.
        window.SPM_MODULE &&SPM_MODULE.asynBind([".pro-img",".pro-title",".pro-btn",".J_lineCity"]);
        //SearchPlatId
        this.setSearchPlatId(this.filter.SearchPlatId);
        //this.itemEvent();
    },
    setSearchPlatId : function(id){
        //
        if(typeof (id)==="undefined"){
            return;
        }
        var params = 'searchplatid';
        var elem = [".pro-img a",".pro-title a",".pro-btn"];

        for(var i=0;i<elem.length;i++){
            $(elem[i]).each(function(i,n){
                var Jself = $(this),
                    isLoad = Jself.attr("data-paramed");
                if(!isLoad){
                    Jself.attr("data-paramed","true");
                    var url = Jself.attr("href");
                    url = setParams(url,params,id);
                    Jself.attr("href",url);
                }
            });
        }
        function setParams(url,name,value){
            url = url.replace(/(^\s*)|(\s*$)/g, "");
            var urlRep =/javascript:/i;
            if(urlRep.test(url)){
                return url;
            }
            var reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
            //查找url中是否包含正赋值参数
                rec1 = reg.exec(url),
            //查找url中是否包含哈希
                rec2 = url.split("#"),
                param = name+"="+value,
                ret = url;
            if(rec1){
                ret = url.replace(rec1[1],name+"="+rec1[2]);
            }else{
                if(/\?/g.test(url)) {
                    if(rec2.length>1){
                        ret = rec2[0]+"&"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"&"+ param;
                    }
                }else{
                    if(rec2.length>1){
                        ret = rec2[0]+"?"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"?"+ param;
                    }
                }
            }
            return ret;
        }
    },

    getnearshop:function(){
        var html1 = "",
        city_Id = this.filter._param_.scId;
        common.ajax({
            url: "/intervacation/api/PDynamicPackageProductDetail/GetStores?cityid=" + city_Id,
            type: 'GET',
            dataType: 'json',
            success:function(data1){
                if(data1.Code===4000) {
                    if (data1.Data.Stores.length == 0) {
                        $(".nearshop").css('display', 'none');
                    }
                    $.each(data1.Data.Stores, function (i, n) {
                        if (n["Address"] == "") {
                            html1 += "<li><p class='nearshop-title'><span>" + n["Name"] + "</span></p><div class='nearshop-text'><p class='traffic'><span>交通 :</span> " + n["Traffic"] + "</p><p class='tlephone'><span>电话 :</span> " + n["Telephone"] + "</p></div></li>";
                        }
                        else if (n["Traffic"] == "") {
                            html1 += "<li><p class='nearshop-title'><span>" + n["Name"] + "</span></p><div class='nearshop-text'><p class='adress'><span>地址 :</span> " + n["Address"] + "</p><p class='tlephone'><span>电话 :</span> " + n["Telephone"] + "</p></div></li>";
                        }
                        else if (n["Telephone"] == "") {
                            html1 += "<li><p class='nearshop-title'><span>" + n["Name"] + "</span></p><div class='nearshop-text'><p class='adress'><span>地址 :</span> " + n["Address"] + "</p><p class='traffic'><span>交通 :</span> " + n["Traffic"] + "</p></div></li>";
                        }
                        else {
                            html1 += "<li><p class='nearshop-title'><span>" + n["Name"] + "</span></p><div class='nearshop-text'><p class='adress'><span>地址 :</span> " + n["Address"] + "</p><p class='traffic'><span>交通 :</span> " + n["Traffic"] + "</p><p class='tlephone'><span>电话 :</span> " + n["Telephone"] + "</p></div></li>";
                        }
                    });
                    $(".nearshop ul").html(html1);
                    NewTag.prototype.nearshopLi();
                }
            },
            error:function(){
                //$(".nearshop").css('display', 'none');
            }
        });
    },
    nearshopLi:function(){
        $(".nearshop li").first().children('.nearshop-text').css('display', 'block');
        $(".nearshop li").on("mouseenter",function() {
            var _self = $(this);
            $(".nearshop li").children('.nearshop-text').css('display', 'none');
            _self.children('.nearshop-text').css('display', 'block');
        });
    },
    openresize:function(){
        var windowsWidth = 0;
        window.onresize = function() {
            if (windowsWidth == 0 || windowsWidth != $(window).width()) {
                windowsWidth = $(window).width();
                NewTag.prototype.resizeWindowEvent();
            }
        }
    },
    resizeWindowEvent:function(){
        var clientW = $(document).width(),
            minW = 1200;
        if(clientW <= minW){
            $(".content").addClass("Small_conter");
        }else{
            $(".content").removeClass("Small_conter");
        }

        for (var i = 0; i < $(".pro-line").length; i++) {
            var calbox = $(".pro-line")[i];
            if ($(".J_fond",calbox).hasClass("hasDate")) {
                $(".pro-cal",calbox).html("");
                $(".pro-cal",calbox).css("height","0");
                $(".pro-cal",calbox).addClass("none");
                $(".J_fond",calbox).html("更多<i></i>").removeClass("unfond").removeClass("hasDate");
            }
        }
        $(".calendar-panel").remove();
        NewTag.prototype.filter.Calendarfun();
        //NewTag.prototype.getListDate();

    },
    /**
     * @desc 获取400电话
     */
    getTel:function() {
        var url = $(".c_phone").attr("attr-url");
        common.ajax({
            //url: url,
            url: '//www.ly.com/dujia/ajaxcall.aspx?type=GetTel400',
            dataType: "jsonp",
            success: function (data) {
                if (data) {
                    $(".c_phone em").html(data);
                    $(".ly_p_message em").html("请拨打"+data);
                }
            },
            error: function (){
                Monitor.log("获取400电话失败"+url,"getTel");
            }
        });
    },
    /**
     * @desc 图片懒加载
     */
    lazyLoad : function(){
        if (NewTag.isInit) {
            var imgList = $(".pro-img img").not("[data-img-loaded]").not(".chengyi-jingpin");
            $("body").trigger("addElements",imgList);
        } else {
            $(".prolist img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            NewTag.isInit = true;
        }
    },
    /**
     * @desc 产品hover效果
     */
    hoverLi : function(){
        $(".pro-line").on("mouseenter",function() {
            var _self = $(this);
            _self.addClass("liHover");
        });
        $(".pro-line").on("mouseleave",function(){
            var _self = $(this);
            _self.removeClass("liHover");
        });
    },
    /**
     * @desc 获取浏览记录
     */
    getRecord:function(){
        if($(".record").length>0){
            var _self = $(".record"),
                _url = _self.attr("attr-url");
            common.ajax({
                //url: _url,
                url: 'www.ly.com/dujia/Ajaxcalltravel.aspx?type=GetBrowsingHistoryNew',
                dataType: "jsonp",
                success:function(data) {
                    if (data) {
                        _self.html(data);
                        _self.css("display","block");
                        $("li", _self).on("mouseover", function () {
                            var _this = $(this);
                            $("img", _self).addClass("none");
                            $("img", _this).removeClass("none");
                        });
                    }
                }
            })
        }
    },
    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function(callback){
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function(){
                callback.call(self);
            },
            unReload: true
        });
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    checkLogin: function(callback){
        var cnUser = $.cookie("us");
        if(!(/userid=\d+/.exec(cnUser))){
            this.initLogin(callback);
            return;
        }
        callback && callback.call(this);
        return true;
    },
    /**
     * @desc 给所有的J_Tips绑定tip提示功能
     * @example
     * <div class="J_Tips" data-content='<p>test</p>'></div>
     * //默认的对齐位置为 左侧,底部
     */
    initTip: function(){
        var o_dialog = new dialog({
            skin:"default"
        });
        //hover
        var odl=o_dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                var width = '270px';
                if ($(obj).hasClass('chengylab')) {
                    width = '350px';
                }
                odl.set('width', width);
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            triggerEle: '.J_Tips',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom left'//显示位置支持top,left,bottom,right
        });
    },
    /**
     * @desc 热门目的地
     */
    getDestination:function(){
        var desItem = $(".des-item");
        desItem.each(function () {
            var _this = $(this),
                _showlist = $(".showlist", _this),
                _num = $(".list-conn dt a", _this).length;
            if (_num > 1) {
                _num = _num > 2 ? 2 : _num;
                _showlist.css("width", 331 * _num + "px");

            }
        });
        desItem.hover(function () {
            var _self = $(this),
                _img = $(".list-conn img", _self),
                _imgurlh = _img.attr("attr-imageh"),
                _slist = $(".showlist", _self);
            _self.addClass("hover");
            _img.attr("src", _imgurlh);
            _slist.removeClass("none");
            //新增内容--弹框位置改变一下
            var showlist_h1 = _self.offset().top,
                showlist_h2 = _slist.outerHeight(true),
                scrolltop = $(window).scrollTop(),
                win_h = $(window).height(),
                py = showlist_h1 + showlist_h2 - win_h - scrolltop;
            if (py > 0) {
                _slist.css("top", -py + "px");
            }
        }, function () {
            var _self = $(this),
                _img = $(".list-conn img", _self),
                _imgurl = _img.attr("attr-image"),
                _slist = $(".showlist", _self);
            _self.removeClass("hover");
            _img.attr("src", _imgurl);
            _slist.addClass("none");
        });
    },
    /**
     * @desc 底部seo链接
     */
    bottomLink : function(){
        $(".hot-link").each(function(){
            var _self =$(this),
                _height = $(this).height(),
                linkmore = $(this).parents(".bot-link").find(".bot-more");
            if(_height<=30)
            {
                linkmore.hide();
            }
            _self.css("height","20px");
        });
        $(".bot-more").on("click",function(){
            var _self = $(this),
                _arrow = _self.find("i"),
                linkdd = _self.parent(".bot-link").find(".hot-link");
            if(_arrow.hasClass("updown"))
            {
                _self.html("展开<i></i>");
                linkdd.css("height","20px");

            }else{
                _self.html("收起<i class='updown'></i>");
                linkdd.css("height","auto");
            }
        });
    },
    /**
     * @desc 处理分页
     */
    renderPager: function(cfg,data){
        var self = this,
            total = data.TotalCount,
            totalPage = Math.ceil(total / 10);
        self.render(data,function(){
            self.callback();
        });
        if(totalPage <= 1){
            $("#J_NoLine").show();
        }else{
            $("#J_NoLine").hide();
        }
        if(totalPage > 0){
            self.getPage(cfg,totalPage);
        }else{
            $("#J_LablePager").empty();
        }

    },
    /**
     * @desc 分页函数
     */
    getPage:function(cfg,totalpage){
        var self = this;
        require("pager/0.1.0/index");
        //var url = "http://irondome.ly.com/dujia/AjaxHelper/LabelAjax.ashx?type=GETALLLABELPRODUCTLIST&localGroup="+localType,
        var url = "/intervacation/api/PDynamicPackageLabelSearch/GetDynamicPackageProducts",
            tos = $("#hidTotalCount").val()|| 0,
            tosl = Math.ceil(parseInt(tos,10) / 10),
            allpage = totalpage?totalpage:tosl,
            param = $.extend({}, cfg);
        if(!param.count){
            param.count = 10;
        }
        if(allpage<=1){
            $("#J_NoLine").show();
        }else{
            $("#J_NoLine").hide();
        }
        $('#J_LablePager').page({
            current: 1,
            total: allpage,
            needFirstAndLast: true,
            pageNoParam: "pageNum",
            count: 10,
            ajaxObj:{
                url: common.fangZhuaUrl(url),
                data: param,
                dataType: "json",
                success: function(data){
                    if(param.start>=allpage)
                    {
                        $("#J_NoLine").show();
                    }else{
                        $("#J_NoLine").hide();
                    }
                    data.Data.cityId = $("#hidCityId").val();
                    self.render(data.Data,function(){
                        self.callback();
                    });
                    var msgTop = parseInt(parseInt($("#seafilter").offset().top));
                    document.documentElement.scrollTop = document.body.scrollTop = msgTop;
                },
                error:function(){
                    Monitor.log("处理分页失败"+url,"renderPager");
                }
            },
            initLoad: false
        });

    },


    /**
     * @desc 分页渲染数据
     */
    render: function (data, callback) {
        var self = this;
        data.cityId = self.param.cityId;
        var bodyTmpl = require("./packList.dot");
        $("#tagList").empty().append(bodyTmpl(data));
        if (callback) {
            callback.call(this);
        }
    },

    //筛选
    filter: {
        init:function(){
            this.seachlist();
            this.pricetext();
            this.extracondit();
            this.Calendarfun();
            this.initFilterEv();
            //this.initFilterEvOne();
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
            };

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
                $(".more-btn").addClass("less-btn");
                $(".more-btn",tpar).html("收起");
            });

            $(".crumlist .more-btn").on("click",function(){//展开 收起
                var t = $(this),
                    tpar = t.parents(".rowbox");
                if (!tpar.hasClass("alllist")) {
                    tpar.addClass("alllist");
                    t.addClass("less-btn");
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
                var abc = $(this);
                if ($(".crumbox .crumdiv").length === 0) {
                    $(".crumbox").addClass("none");
                }
                if($(this).siblings(".crumtitle").text() =="线路分类"){
                    self.defaultFilterParam.lineQuality= '';
                }
                if($(this).siblings(".crumtitle").text() =="线路玩法"){
                    self.defaultFilterParam.specialNickId= '';
                }
                if($(this).siblings(".crumtitle").text() =="游玩天数"){
                    self.defaultFilterParam.days= '';
                }
                if($(this).siblings(".crumtitle").text() =="出游城市"){
                    self.defaultFilterParam.lpCity= '';
                }
            });

            $(".removeall").on('click', function(){
                $(".crumlist .rowbox").removeClass("none");
                $(".crumbox .crumdiv").remove();
                $(".crumbox").addClass("none");
                    self.defaultFilterParam.days= '';
                    self.defaultFilterParam.specialNickId= '';
                    self.defaultFilterParam.lpCity= '';
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
        // resetlist:function(tbox) {
        //     var delecondition = $("i", tbox).attr("data-list");
        //     $(".crumlist .rowbox").each(function (nub, elem) {
        //         var row = $(elem).attr("data-list");
        //         if (delecondition === row) {
        //             $(elem).removeClass("none");
        //             return;
        //         }
        //     });
        // },
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
                    min_rep = parseInt(min.replace(/¥/g,'')),
                    max_rep = parseInt(max.replace(/¥/g,''));
                //if (min_rep.length === 0 && max_rep.length === 0) return;
                if(max_rep>0) {
                    if (min_rep > max_rep) {
                        var temp = $(".min").val();
                        $(".min").val(max);
                        $(".max").val(temp);
                    }
                }
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

            $(".J_ChengYi, .J_TcLine, .filter-row span").on("click",function(){
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
            var smallcal = -70;
            if ($(".content").hasClass("Small_conter")) {
                smallcal = -25;
            }
            $("#startTime").on("focus", function() {
                var endtime = $("#endTime").val()===""?"2020-12-12":$("#endTime").val();
                cal.pick({
                    elem: this,
                    startDate:$("#startTime").attr("attr-timeb"),
                    endDate:endtime,
                    mode: "rangeFrom",
                    offset: {
                        left: smallcal
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
                        left: smallcal
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
            var stp = "lcCitySort:1;favRate:1;orderCount:1;tcPrice:0";  //绝对排序
            var ppSortType = "lcCitySort:1"; //组内排序
            var scId =0;
            var days = '';  //天数
            var specialNickId = '';  //线路玩法id
            var dest = '';  //目的地名称
            var minPrice = '';  //最小价格(同程价) 价格区间
            var maxPrice = '';  //最大价格(同程价) 价格区间
            var pageNum = 1;  //从start开始
            var count = 10;  //从start开始取size条
            var lineQuality = '';  //月份yyyyMM
            var rcImgTitleId = ''; //线路特色
            var serviceCharId='';
            var isNeedCondition=1;
            var lpCity = '';
            var _config = parseUrl();
            return $.extend({
                stp: stp,
                ppSortType: ppSortType,
                scId:scId,
                lcCityId:scId,
                dest:dest,
                days: days,
                specialNickId: specialNickId,
                minPrice: minPrice,
                maxPrice: maxPrice,
                pageNum: pageNum,
                rcImgTitleId: rcImgTitleId,
                count: count,
                lineQuality: lineQuality,
                serviceCharId : serviceCharId,
                isNeedCondition : 1,
                lpCity: lpCity
            },_config);
        })(),
        buildParam: function(param){
            return $.extend({},this.defaultFilterParam,param || {});
        },
        ajax: function(param){
            //var localType = $("#hidIsLocalGroup").val();
            //var url = "http://irondome.ly.com/dujia/AjaxHelper/LabelAjax.ashx?type=GETALLLABELPRODUCTLIST&localGroup="+localType;
            var url =  "/intervacation/api/PDynamicPackageLabelSearch/GetDynamicPackageProducts";
            return common.ajax({
                url: url,
                data: param,
                dataType: "json"
            });
        },
        renderFilter: function(data,callback){
            var filterTmpl = require("./packFilter.dot");
            Common.render({
                tpl: filterTmpl,
                data: data,
                context: "#filter",
                overwrite: true,
                callback: callback
            });
        },
        initFilterEvOne: function(){
            var self = this;
            //删除筛选
            $(document).on('click', ".crumdiv i", function() {
                var key = $(this).parents(".crumdiv").attr("data-key");
                self.removeCondition.apply(self,key.split("|"));
                var hasCondition = self.hasCondition();
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //移除全部
            $(document).on('click', ".removeall", function(e) {
                e.preventDefault();
                self.removeConditionAll();
                var hasCondition = self.hasCondition();
                self._initFilter(function(){
                    //self.initCondition();
                    self.initRow();
                });
            });
            //重新筛选
            $(document).on('click', ".del-filter", function(e) {
                e.preventDefault();
                //self.removeConditionAll();
                //self._initFilter({gpMode: 1},function(){
                //    self.initRow();
                //});
                $(".removeall").click();
            });
        },
        initFilterEv: function(){
            var self = this;
            //线路特色
            $(".sort-service a").on("click",function(e){
                var ones = [],_this = $(this);
                _this.toggleClass('onlist');
                if ($(".sort-service .onlist").length > 0) {
                    var obj = {},
                        str;
                    var ob = [];
                    $(".sort-service .onlist").each(function() {
                        var _self = $(this);
                        var _val = _self.attr("data-value");
                        ob.push(_val);
                    })
                    ones = ob;
                    str = ob.join(",");
                    obj = {
                        "serviceCharId": str
                    }
                    self.addCondition(obj);
                } else {
                    self.removeCondition("serviceCharId");
                }
                self._initFilter(function() {
                    self.initRow();
                    if (ones.length > 0) {
                        $(".sort-service .sort-service-box a").each(function(k, el) {
                            for (var i = 0; i < ones.length; i++) {
                                if ($(el).attr("data-value") == ones[i]) {
                                    $(el).addClass("onlist");
                                }
                            }
                        })
                    }
                });
            });
            //线路分类
            $(".J_lineQuality a").on("click",function(e){
                e.preventDefault();
                if($(this).parents(".rowbox").hasClass("alllist")){
                    return;
                }
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
            //出发城市选择
            $(".J_lineCity a").on("click",function(e){
                e.preventDefault();
                if($(this).parents(".rowbox").hasClass("alllist")){
                    return;
                }
                var id = $(this).attr("data-value");
                self.addCondition({
                    lpCity: id
                });
                self._initFilter(function(){
                    self.initRow();
                });
            });
            //出发城市多选
            $(".J_lineCity .submit").on("click",function(){
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
                if ( $(".onlist",tpar).length !== 0) {
                    var ret = [];
                    $(".J_lineCity >a").each(function () {
                        if ($(this).hasClass("onlist")) {
                            ret.push($(this).attr("data-value"));
                        }
                    });
                    self.addCondition({lpCity: ret.join(',')});
                    self._initFilter(function () {
                        self.initRow();
                    });
                }
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
            //排序 0-》综合排序 1-》销量 2-》点评 3-》价格
            $(".sort-ul >li a").on("click",function(e){
                e.preventDefault();
                var parEl = $(this).parent();
                var index = parEl.index();
                var obj = {};
                parEl.addClass("cur").siblings().removeClass("cur");
                switch (index){
                    case 0: obj.stp = "lcCitySort:0;scoreSort:1"; obj.ppSortType = "scoreSort:1"; break;
                    case 1: obj.stp = "lcCitySort:0;orderCount:1"; obj.ppSortType = "orderCount:1"; break;
                    case 2: obj.stp = "lcCitySort:0;favRate:1"; obj.ppSortType = "cmtCount:1"; break;
                    case 3:
                        $(this).toggleClass("order-by-desc");
                        if ($(this).hasClass("order-by-desc")) {
                            obj.stp = "lcCitySort:0;tcPrice:0";
                            obj.ppSortType = "tcPrice:0";
                        } else {
                            obj.stp = "lcCitySort:0;tcPrice:1";
                            obj.ppSortType = "tcPrice:1";
                        }
                        break;
                }
                self.removeCondition("stp");
                self.removeCondition("ppSortType");
                self.addCondition(obj);
                if(index ===0){
                    self._initFilter({},function(){
                        self.initRow();
                        $(".sort-ul >li").eq(index).addClass("cur").siblings().removeClass("cur");
                        if(obj.priceSort === 0){
                            $(".sort-ul >li a:last").addClass("order-by-desc");
                        }
                    });
                }else{
                    self._initFilter({},function(){
                        self.initRow();
                        $(".sort-ul >li").eq(index).addClass("cur").siblings().removeClass("cur");
                        if(obj.priceSort === 0){
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
                    var dateArr = $(".J_lineStartDate").parents(".rowbox").attr("attr-data").split("~");
                    var startTime = dateArr[0];
                    var endTime = dateArr[1];
                    self.addCondition({minVGDate: startTime,maxVGDate: endTime});
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
            $("#J_NoLine").hide();
            $(".loading").show();
            self._param_ = self.buildParam(config);
            //console.log(self._condition_ );
            $.extend(self._param_,self._condition_ || {});

            self.ajax(self._param_)
                .then(function(data){
                    $(".loading").hide();
                    if(data.Data==null || data.Data.Products == null){
                        $("#tagList").empty();
                        $("#J_LablePager").empty();
                        // $("#J_ClearFilter").show();
                        //$("#J_NoLine").hide();
                        $("#J_NoLine").show();
                        return;
                    }
                    //获取SearchPlatId
                    self.SearchPlatId = 1;
                    self.renderFilter(data.Data.Conditions,function(){
                        self.init();
                        //self._changeUrl(".J_lineCity>a");//新版筛选项出发城市不需要跳链接
                        if(self._condition_.ppSortType == "tcPrice:0"){
                            $(".sort-ul li").removeClass("cur");
                            var _par =$(".sort-ul li").eq(3);
                            $(".sort-ul li").eq(3).addClass("cur");
                            $("a",_par).addClass("order-by-desc");
                        }
                        callback && callback();
                    });
                    if(data.Data.Totality === 0){
                        //$("#J_ClearFilter").show();
                        //$("#J_NoLine").hide();
                        $("#J_NoLine").show();
                        return;
                    }

                        NewTag.prototype.renderPager(self._param_,data.Data);

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
        initFilter: function(conf){
            var self = this;
            var config = self.parseUrl();
            delete config.cityId;
            self.addCondition(config);
            var hasCondition = self.hasCondition();
            $.extend(self.defaultFilterParam,conf);
            self._initFilter(function(){
                self.initCondition();
                self.initRow();
                //self.initFilterEvOne();
            });

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
                if(i === "scId" || config[i] == null) {
                    continue;
                }
                obj.name = config[i];
                switch (i){
                    case"lineQuality":
                        obj.type = "游玩分类";
                        $(".J_lineQuality").parents(".rowbox").hide();
                        break;
                    case "days":
                        obj.type = "游玩天数";
                        $(".J_lineDays").parents(".rowbox").hide();
                        break;
                    case "specialNickId":
                        obj.type = "线路玩法";
                        obj.name = $(".J_linePlay a").text();
                        $(".J_linePlay").parents(".rowbox").hide();
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
                if(i === "tcLine" && self._condition_[i]){
                    $(".J_ChengYi").addClass("removeinput");
                }
                if(i === "isTCSpecialLine" && self._condition_[i]){
                    $(".J_TcLine").addClass("removeinput");
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
            return /\-(gentuan)\-/.test(window.location.href) ? 1 : "";
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
            var self = this,url = window.location.pathname,
                IsSearch = $("#hidIsLabelOrSearch").val(),
                allurl = window.location.href;
            url = url.toLocaleLowerCase();
            if(IsSearch=="Search"){
                $(elArr).each(function (i,n) {
                    var depname = $(n).attr("title"),
                        repname = "src="+depname;
                    var str = allurl.replace(/src=([^&]+)/,repname);
                    $(n).attr("href", str);
                });
                return;
            }
            //兼容老的标签页
            if (url.indexOf("dujiatag") > -1) {
                var urlTmpl = common.host() + "/dujia/{dest}{destId}-{tag}/f{depId}/";
                $(elArr).each(function (i,n) {
                    //var pinyin = $(this).attr("citypy") || "shanghai";
                    var depId = $(n).attr("cityid") || $(n).attr("data-value") || "321";
                    var urlArr = /dujiatag\/([^\/]+)\/[^\/]+\/([^\/]+)[^\d]+(\d+)\.html(.*)/i.exec(url);
                    var hidLineType = $('#lineType').val();
                    var param = {
                        depId: depId,
                        tag: hidLineType == 1? "gentuan":"zizhu",
                        dest: $('#hidDestEnName').val(),
                        destId: $('#hidLabelId').val(),
                        extra: urlArr[4]||""
                    };
                    var newUrl= urlTmpl.replace(/{(\w+)}/ig, function ($0, $1) {
                        return param[$1]||"";
                    });
                    $(n).attr("href", newUrl);
                });
            } else {
                $(elArr).each(function () {
                    var id = $(this).attr(attr || "data-value");
                    var reg1 = /gentuan\/f/g,
                    reg2 = /zizhu\/f/g,
                    reg7 = /tag\/f/g,
                    reg8 = /lvyou\/f/g,
                    reg3 = /zizhu\/d/g,
                    reg4 = /zizhu\/m/g,
                    reg9 = /lvyou\/d/g,
                    reg10 = /lvyou\/m/g,
                    reg5 = /gentuan\/d/g,
                    reg6 = /gentuan\/m/g,
                    reg11 = /jijiu\/f/g;
                    var arr = window.location.href.split('/');
                    var city = 'f'+id;
                    var str1 = arr.splice(5,2,city);
                    var str2 = str1[0];
                    var url1 = arr.join('/');
                    if(reg1.test(url) || reg2.test(url) || reg7.test(url)|| reg8.test(url)|| reg11.test(url)){
                        var _url = url.replace(/(\-(?:gentuan|zizhu|tag|lvyou|jijiu)\/f)(\d+)/, function ($0, $1) {
                            return $1 + id;
                            });
                    }else if(reg3.test(url) || reg4.test(url) || reg5.test(url) || reg6.test(url) || reg9.test(url) || reg10.test(url)){
                        var _url = url1 + str2 +"/";
                    }else{
                        if(url.match(/^.*\/$/)){
                            var _url = url +"f"+ id +"/";
                        }else{
                            var _url = url +"/f"+ id +"/";
                        }
                    }
                    $(this).attr("href", _url);
                });
            }
        }
    }
};
function parseUrl(){
    var arr = window.location.href.split('/');
    arr.pop();
    var str = arr.pop();
    var match1 = str.split(/(?:(?=[fdmw]))/);
    var match = match1.join();
    var reg1 = /\bf(\d+)\b/,
        reg2 = /\bd(\d+)\b/,
        reg4 = /\bw(\d+)\b/;
    var scId,
        days,
        specialNickId;
        if(reg1.exec(match)){
            scId = reg1.exec(match)[1];
        }
        if(reg2.exec(match)){
            days = reg2.exec(match)[1];
        }
        if(reg4.exec(match)){
            specialNickId = reg4.exec(match)[1];
        }

    return {
        'scId':scId,
        'lcCityId':scId,
        'days':days,
        'specialNickId':specialNickId
    };
}
module.exports = new NewTag();
