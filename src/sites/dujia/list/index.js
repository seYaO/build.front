/**
* @desc:标签页
* @author: Jilly
* @mail: cjl10120@ly.com
* @createTime: 2016/3/21 10:36
* @version: 0.1
*/
var NewTag = function () {
};
require("calendar/0.2.0/discount");
require("dialog/0.2.0/base");
var Common = require("common/0.1.0/index"),
    storage = require("common/0.1.0/storage"),
    Cal = require("calendar/0.2.0/index"),
    Dialog = require("dialog/0.2.0/dialog"),
    Slidertool = require("slidertoolbar/0.1.0/tool"),
    Track = require("intellSearch/0.2.1/track");;
require("lazyload/0.1.0/index");
var $dialog = new Dialog({
    skin: 'default',
    template: {
        tooltip: {
            width: '430px'
        }
    }
});
var pageType = $("#hidIsLocalGroup").val();
    searchType = parseInt($("#hidSearchType").val(), 10),
    destName = $("#hidDestName").val(),
    destPinYin = $("#hidDestPinYin").val(),
    groupLabelId = $("#hidGroupLabelId").val(),
    freeLabelId = $("#hidFreeLabelId").val(),
    stpSort = "pcComprehensiveCTRSort:desc",
    orderSort = "pcOrderCountSort:desc",
    cmtSort = "pcSatisfactionSort:desc",
    asceSort = "pcPriceSort:asc",
    descSort = "pcPriceSort:desc";
NewTag.prototype = {
    param: {
        cityId: $("#hidCityId").val()
    },
    init: function (conf) {
        var self = this;
        trc = new Track({
            autoExtend:false,
            initdata: {
                locCId: conf.scId||"321",
                k:conf.dest,
                rc:$("#hidTotalCount").val()||"",
                pageid: "search",
                moduleid: "/line/list",
                pjId: "2006",
                jpTp: "0",//0 详情 1 列表 2 活动
                ab: "0",//0 老接口 1 新接口
                isShow: true
            }
        });
        trc.triggerEvent("/show",{});
        trc.initTrace();
        //出发城市埋点
        $(document).on("mousedown", ".J_lineCity a", function (e) {
            var $el = $(this);
            trc.triggerEvent("/filter",{rc:""});
        });
        // var sign = conf.fangzhua;
        // if (sign) {
        //     window.isFangZhua = true;
        //     $.td(function () {
        //         self.real_init(conf);
        //     });
        // } else {
            self.real_init(conf);
        // }
    },
    real_init: function (conf) {
        var pageName = "";
        if (pageType == 0) {
            pageName = "出境全部标签页";
        } else if (pageType == 1) {
            pageName = "出境跟团标签页";
        } else if (pageType == 3) {
            pageName = "出境自由行标签页";
        } else if (pageType == 10) {
            pageName = "出境目的地参团标签页";
        }
        Slidertool.init({pageName: pageName});
        this.resizeWindowEvent();
        this.openResize();
        // this.getTel();
        this.searchFunc(conf);
        this.initEve(conf);
        this.hoverLi();
        this.getDestination();
        this.bottomLink();
        this.getListDate();
        this.lazyLoad();
        this.addCompare();
        this.initCon();
        this.initContrast();
        this.initCollect();
        this.getStrategy();
        this.getRecord();
        this.gotoCompare();
        this.filter.init(conf);
        this.getPage(conf);
        this.contrastFBox();
        this.getNearShop(conf);
        this.nearShopLi();
        this.initTip();
        if ((conf.prop == 1 || conf.prop == 3) && searchType == 1) {
            this.getNoResult(conf);
        }
        this.filter._changeUrl(".leavecity dd a","cityid");
        // this.filter._changeUrl(".J_lineCity>a");
    },
    callback: function () {
        this.hoverLi();
        this.getListDate();
        this.lazyLoad();
        this.addCompare();
        this.initContrast();
        this.contrastFBox();
        //模块id添加.
        window.SPM_MODULE && SPM_MODULE.asynBind([".pro-img", ".pro-title", ".pro-btn", ".J_lineCity"]);
        //SearchPlatId
        this.setSearchPlatId(this.filter.SearchPlatId);
    },
    //出发城市、搜索框及热门目的地配置
    searchFunc: function (conf) {
        var self = this;
        conf.callback=function(){
            self.filter._initFilter(conf, function () {
                self.filter.initRow();
            });
        };
        // IntellSearch.init(conf);
    },
    setSearchPlatId: function (id) {
        if (typeof (id) === "undefined") {
            return;
        }
        var params = 'searchplatid';
        var elem = [".pro-img a", ".pro-title a", ".pro-btn"];
        for (var i = 0; i < elem.length; i++) {
            $(elem[i]).each(function () {
                var Jself = $(this),
                    isLoad = Jself.attr("data-paramed");
                if (!isLoad) {
                    Jself.attr("data-paramed", "true");
                    var url = Jself.attr("href");
                    url = setParams(url, params, id);
                    Jself.attr("href", url);
                }
            });
        }
        function setParams(url, name, value) {
            url = url.replace(/(^\s*)|(\s*$)/g, "");
            var urlRep = /javascript:/i;
            if (urlRep.test(url)) {
                return url;
            }
            var reg = new RegExp("[\?&](" + name + "=([^&#$]*))", "i"),
                //查找url中是否包含正赋值参数
                rec1 = reg.exec(url),
                //查找url中是否包含哈希
                rec2 = url.split("#"),
                param = name + "=" + value,
                ret = url;
            if (rec1) {
                ret = url.replace(rec1[1], name + "=" + rec1[2]);
            } else {
                if (/\?/g.test(url)) {
                    if (rec2.length > 1) {
                        ret = rec2[0] + "&" + param + "#" + rec2[1];
                    } else {
                        ret = rec2[0] + "&" + param;
                    }
                } else {
                    if (rec2.length > 1) {
                        ret = rec2[0] + "?" + param + "#" + rec2[1];
                    } else {
                        ret = rec2[0] + "?" + param;
                    }
                }
            }
            return ret;
        }
    },
    getNearShop: function (conf) {
        var self = this,
            html1 = "",
            city_Id = conf.lcCity;
        $.ajax({
            url: "/intervacation/api/PDynamicPackageProductDetail/GetStores?cityid=" + city_Id,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.Code === 4000) {
                    if (data.Data.Stores.length == 0) {
                        $(".nearshop").css('display', 'none');
                    } else if (data.Data.City == conf.initCityName) {
                        $(".nearshop").css('display', 'block');
                        $(".nearshop h3 span").html("门店信息");
                    } else {
                        $(".nearshop h3 span").html("附近门店");
                        $(".nearshop").css('display', 'block');
                    }
                    $.each(data.Data.Stores, function (i, n) {
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
                    self.nearShopLi();
                }
            },
            error: function () {
                $(".nearshop").css('display', 'none');
            }
        });
    },
    getStrategy:function(){
        // 自由行攻略
        var self = this;
        if(pageType && pageType==3){
            $.ajax({
            url:"/intervacation/api/PLabelSearchPage/GetCityStrategyIconList?selectCityName=" + destName,
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if(data.Code===4000){
                    var datas = data.Data, str = "", 
                        htmlList="",arrList=[];
                    if(datas.Title && datas.Title!=""){
                        if(datas.Title && datas.Title!=""){
                            str+= '<p>'+ datas.Title +'</p>';
                        }
                        if(datas.AreaIntro && datas.AreaIntro!=""){
                            if(datas.AreaIntro.length>30){
                                str+= '<span class="strategy_detail">' + datas.AreaIntro.substring(0,30) + '...</span>';
                            }else{
                                str+= '<span class="strategy_detail">' + datas.AreaIntro.substring(0,30) + '</span>';
                            }
                        }else{
                            str+= '<span class="strategy_detail">暂无简介说明</span>';
                        }
                        if(datas.PoiSummaryList && datas.PoiSummaryList.length>0){
                            for(var i=0; i<datas.PoiSummaryList.length;i++){
                                if(datas.PoiSummaryList[i].SummaryName!="购物"){
                                    arrList.push(datas.PoiSummaryList[i]);
                                }
                            }
                            if(arrList && arrList.length>0){
                                if(arrList.length>4){
                                    for(var i=0; i<4;i++){
                                        htmlList += '<a target="_blank" href="'+ arrList[i].SummaryJumpUrl.replace('http:','') +'">' + arrList[i].SummaryName +'</a>';
                                    }
                                }else{
                                    for(var i=0; i<arrList.length;i++){
                                        htmlList += '<a target="_blank" href="'+ arrList[i].SummaryJumpUrl.replace('http:','') +'">' + arrList[i].SummaryName +'</a>';
                                    }
                                }
                                
                                str += '<div class="s_link">' + htmlList + '</div>';
                            }
                        }
                        $(".list_strategy").css('display', 'block').html(str);
                    }
                }
            }
        });
        }
    },
    nearShopLi: function () {
        var nearShop = $(".nearshop li");
        nearShop.first().children('.nearshop-text').css('display', 'block');
        nearShop.on("mouseenter", function () {
            var _self = $(this);
            $(".nearshop li").children('.nearshop-text').css('display', 'none');
            _self.children('.nearshop-text').css('display', 'block');
        });
    },
    openResize: function () {
        var self = this,
            windowsWidth = 0;
        window.onresize = function () {
            if (windowsWidth === 0 || windowsWidth !== $(window).width()) {
                windowsWidth = $(window).width();
                self.resizeWindowEvent();
            }
        };
    },
    resizeWindowEvent: function () {
        var self = this,
            clientW = $(document).width(),
            minW = 1200;
        if (clientW <= minW) {
            $(".content").addClass("Small_conter");
            $(".contrastBox").addClass("Small_contrast");
        } else {
            $(".content").removeClass("Small_conter");
            $(".contrastBox").removeClass("Small_contrast");
        }
        var proLine = $(".pro-line"),
            len = proLine.length || 0;
        for (var i = 0; i < len; i++) {
            var calBox = proLine[i];
            if ($(".J_fond", calBox).hasClass("hasDate")) {
                $(".pro-cal", calBox).html("");
                $(".pro-cal", calBox).css("height", "0");
                $(".pro-cal", calBox).addClass("none");
                $(".J_fond", calBox).html("更多<i></i>").removeClass("unfond").removeClass("hasDate");
            }
        }
        $(".calendar-panel").remove();
        self.filter.CalendarFun();
        self.getListDate();
        self.initContrast();
    },
    /**
        * @desc 获取400电话
        */
    getTel: function () {
        var url = $(".c_phone").attr("attr-url");
        common.ajax({
            url: url,
            dataType: "jsonp",
            success: function (data) {
                if (data) {
                    $(".c_phone em").html(data);
                    $(".ly_p_message em").html("请拨打" + data);
                }
            },
            error: function () {
                Monitor.log("获取400电话失败" + url, "getTel");
            }
        });
    },
    /**
        * @desc 图片懒加载
        */
    lazyLoad: function () {
        $(".pro-img img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "430x270");
            $(item).attr("data-img", imgUrl);
        });
        if (NewTag.isInit) {
            var imgList = $(".pro-img img").not("[data-img-loaded]");
            $("body").trigger("addElements", imgList);
        } else {
            $(".prolist img").lazyload({
                "data_attribute": "img",
                effect: 'fadeIn'
            });
            NewTag.isInit = true;
        }
    },
    /**
        * @desc 初始事件
        * */
    initEve: function (cfg) {
        if (parseInt(cfg.prop,10) === 0) {
            $(".showbox").css("padding-bottom", "0");
        }
    },
    /**
        * @desc 产品hover效果
        */
    hoverLi: function () {
        $(".pro-line").on("mouseenter", function () {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.addClass("liHover");
            _com.css("display", "block");
        }).on("mouseleave", function () {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.removeClass("liHover");
            _com.css("display", "none");
        });
    },
    /**
        * @desc 获取浏览记录
        */
    getRecord: function () {
        if ($(".record").length > 0) {
            var _self = $(".record"),
                _url = _self.attr("attr-url");
            common.ajax({
                url: _url,
                dataType: "jsonp",
                success: function (data) {
                    if (data) {
                        _self.html(data);
                        _self.css("display", "block");
                        $("li", _self).on("mouseover", function () {
                            var _this = $(this);
                            $("img", _self).addClass("none");
                            $("img", _this).removeClass("none");
                        });
                    }
                }
            });
        }
    },
    /**
        * @desc 初始化登录组件
        * @param callback
        */
    initLogin: function (callback) {
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function () {
                callback.call(self);
            },
            unReload: true
        });
    },
    /**
        * @desc 初始化收藏的事件
        */
    initCollect: function (data) {
        var self = this,
            el = $(document);
        el.on("click", "#tagList .J_Store", function () {
            var $el = $(this);
            self.checkLogin(function () {
                self.setCollect("add", $el, data);
            });
            self.setCollect("search", $el, data);
        });
    },
    /**
        * @desc 发送收藏到指定的接口
        */
    setCollect: function (type, el) {
        var lineId = el.attr("attr-id"),
            isAdd = type === "add",
            method = isAdd ? "Addnew" : "searchnew";
        if (isAdd) {
            var url = "/dujia/MemberFavoritesHandler.ashx?type=" + method + "&productId=" + lineId;
            common.ajax({
                url: url,
                dataType: "json",
                success: function (data) {
                    var cls = "hasSto",
                        config;
                    if (data.ResultFlag) {
                        el.addClass(cls);
                        config = {
                            content: '<div class="collect-tip">您已成功收藏此产品！</div>',
                            width: '200px',
                            height: '150px'
                        };
                    } else {
                        config = {
                            content: '<div class="collect-tip">' + data.ResultMsg + '</div>',
                            width: '200px',
                            height: '150px'
                        };
                    }
                    $dialog.modal(config);
                }
            });
        }
    },
    /**
        * @desc 检查是否登录,并执行登录后回调
        * @param callback 登录后的操作逻辑
        */
    checkLogin: function (callback) {
        var cnUser = $.cookie("us");
        if (!(/userid=\d+/.exec(cnUser))) {
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
    initTip: function () {
        //hover
        var odl = $dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                var width = '270px';
                if ($(obj).hasClass('tc-line')) {
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
    getDestination: function () {
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
                _imgUrl = _img.attr("attr-image"),
                _slist = $(".showlist", _self);
            _self.removeClass("hover");
            _img.attr("src", _imgUrl);
            _slist.addClass("none");
        });
    },
    getNoResult: function (conf) {
        var self = this,
            url = "/dujia/AjaxCallTravel.aspx?type=GetHotDestCityList&prop=" + conf.prop;
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function (data) {
                var strHtml = "";
                if (data.dest && data.dest.length > 0) {
                    for (var i = 0; i < data.dest.length; i++) {
                        var searUrl = "/dujia/search.aspx?src=" + conf.initCityName + "&dest=" + encodeURI(data.dest[i]) + "&prop=" + ((conf.prop == 3) ? 2 : conf.prop);
                        strHtml += '<a href=' + searUrl + ' target="_blank">' + data.dest[i] + '</a>';
                    }
                    $(".J_destination").html(strHtml);
                }
            }
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
        * @desc 列表日历数据
        */
    getListDate: function () {
        var self = this;
        $(".fond").each(function (i, el) {
            var _self = $(el);
            if (_self.hasClass("isloaded")) {
                return;
            }
            _self.addClass("isloaded");
            _self.on("click", function () {
                var elem = $(this),
                    stdate = elem.attr("firstdate"),
                    _lineId = elem.attr("attr-lineid"),
                    _date = elem.parents(".pro-line").find(".pro-cal");
                if (!elem.hasClass("unfond")) {
                    elem.html("收起<i></i>");
                    elem.addClass("unfond");
                    _date.removeClass("none");
                    _date.animate({height: "371px"}, 200);
                    var monNub = 2;
                    if ($(".content").hasClass("Small_conter")) {
                        monNub = 1;
                    }
                    if (!elem.hasClass("hasDate")) {
                        elem.addClass("hasDate");
                        common.ajax({
                            url: "/dujia/OrderAjaxCall.aspx?type=GetDataListByAjax&lineId=" + _lineId + "&cityId=" + self.param.cityId,
                            dataType: "jsonp",
                            success: function (data) {
                                window.page_cf = data;
                                var tmpl = '<span class="date">{dateStr}</span><div><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span></div>';
                                Cal.init({
                                    tab: false,
                                    monthNum: monNub,
                                    wrapper: _date,
                                    data: data,
                                    startDate: stdate,
                                    //endDate: "2015-9-01",
                                    beforeBuild: function (td, info) {
                                        var htmlStr = tmpl.replace(/{(\w+)}/g, function ($0, $1) {
                                            return info[$1] || "";
                                        });
                                        if (info.ResidualDesc === "充足") {
                                            htmlStr = '<a class="gree" target="_blank" href="' + data.lineUrl + '">' + htmlStr + "</a>";
                                        }
                                        else if (info.ResidualDesc != "已满" && info.ResidualDesc != null) {
                                            htmlStr = '<a target="_blank" href="' + data.lineUrl + '">' + htmlStr + "</a>";
                                        }
                                        td.innerHTML = htmlStr;
                                        return false;
                                    }
                                });

                            },
                            error: function () {
                                Monitor.log("获取列表日历数据失败" + url, "getListDate");
                            }
                        });
                    }
                }
                else {
                    elem.html("更多<i></i>");
                    elem.removeClass("unfond");
                    _date.animate({height: "0px"}, 200);
                    _date.addClass("none");
                }
            });
        });
    },
    /**
        * @desc 点击加入对比
        */
    addCompare: function () {
        var self = this;
        $(".pro-line").each(function (i, el) {
            var contrastBox = $(".contrastBox"),
                arr = [];
            if ($(el).hasClass("hasbind")) {
                return;
            } else {
                $(el).addClass("hasbind");
                $(".compare", el).on("click", function () {
                    var _self = $(this),
                        _contxt = $(".contraprompt"),
                        addInfo = $(".addinfo"),
                        addInfoLen = addInfo.length,
                        closeLen = $(".close").length,
                        lineId = _self.attr("attr-id");

                    if (addInfoLen !== 0 && closeLen !== 3) {
                        _contxt.addClass("none");
                    }
                    // 添加
                    if (!_self.hasClass("hasCom")) {
                        if (addInfoLen === 0 && closeLen === 3) {
                            _contxt.html("对不起，您最多只可以添加3条线路，请先删除对比栏中的一些线路后再添加。");
                            _contxt.removeClass("none");
                        } else {
                            _self.addClass("hasCom");
                            var obj = {},
                                _arr = [],
                                _txt = _self.attr("attr-tit"),
                                _url = "javascript:void(0);",
                                _price = _self.attr("attr-price");
                            addInfo.eq(0).replaceWith("<span class='close' copyid ='" + lineId + "'>&nbsp;</span><a target='_blank' title='" + _txt + "' href='" + _url + "' class='info'>" + _txt + "</a><div class='pricbox'> <span>¥<strong class='linprice'>" + _price + "</strong></span>起</div>");
                            obj.lineid = lineId;
                            obj.title = _txt;
                            obj.price = _price;
                            if (storage.getItem("__djcompare__")) {
                                arr = JSON.parse(storage.getItem("__djcompare__"));
                                arr.push(obj);
                                _arr = arr;
                            } else {
                                _arr.push(obj);
                            }
                            storage.setItem("__djcompare__", _arr);
                            self.initContrast();
                            //self.initCollect();
                            self.contrastFBox();
                        }
                    } else {
                        $(".contrasdiv .close").each(function (i, elem) {
                            var onId = $(elem).attr("copyid"),
                                par = $(elem).parent("li");
                            if (lineId === onId) {
                                self.actionFun(par);
                            }
                        });
                        _self.removeClass("hasCom");
                        if (storage.getItem("__djcompare__")) {
                            arr = JSON.parse(storage.getItem("__djcompare__"));
                            for (var j = 0; j < arr.length; j++) {
                                if (arr[j].lineid === lineId) {
                                    arr.splice(j, 1);
                                }
                            }
                            storage.setItem("__djcompare__", arr);
                        }
                        if (closeLen === 0) {
                            contrastBox.css("display", "none"); //若清空则影藏掉对比功能框
                            contrastBox.attr("attr-show", "false");
                        }
                    }
                    self.contrastBytn();
                });
            }
        });

    },
    /**
        * @desc 对比版块移位
        */
    actionFun: function (closeP) {
        var ulNode = $(closeP).parent("ul");
        $(closeP).remove();
        $("li", ulNode).removeClass("bor_no");
        ulNode.append("<li class='bor_no'><p class='addinfo'>您还可以继续添加产品</p></li>");
    },
    /**
        * @desc 初次加载页面时渲染对比产品
        */
    initCon: function () {
        if (storage.getItem("__djcompare__")) {
            var arr = JSON.parse(storage.getItem("__djcompare__"));
            if (arr.length > 1) {
                $("#contrbegin").addClass("contrasta_on");
            }
            for (var i = 0; i < arr.length; i++) {
                var _url = "javascript:void(0);";
                $(".addinfo").eq(0).replaceWith("<span class='close' copyid ='" + arr[i].lineid + "'>&nbsp;</span><a target='_blank' title='" + arr[i].title + "' href='" + _url + "' class='info'>" + arr[i].title + "</a><div class='pricbox'> <span>¥<strong class='linprice'>" + arr[i].price + "</strong></span>起</div>");

                $(".compare").each(function (j, elem) {
                    var nowAttr = $(elem).attr("attr-id");
                    if (arr[i].lineid === nowAttr) {
                        $(elem).addClass("hasCom");
                    }
                });
            }
        }
        $(".contrastit").on("click", function () {
            var showbox = $(".contrasdiv");
            if (!showbox.hasClass("none")) {
                showbox.addClass("none");
                $(".dow_b").addClass("up_b");
            } else {
                showbox.removeClass("none");
                $(".dow_b").removeClass("up_b");
            }
        });
    },
    //处理对比按钮是否可对比 (当点击加入对比框框时)
    contrastBytn: function () {
        var contrastBox = $(".contrastBox"),
            contrastBegin = $("#contrbegin"),
            conPrompt = $(".contraprompt"),
            onNum = $(".contrasdiv .close").length,
            contrasBtn = contrastBegin.hasClass("contrasta_on");
        if (onNum === 0) {
            return;
        }
        contrastBox.attr("attr-show", "true");
        contrastBox.css("display", "block");
        if (onNum === 0) { //若对比框线路等于 则影藏对比框
            contrastBox.attr("attr-show", "false");
            contrastBox.css("display", "none");
        } else if (onNum === 1 && contrasBtn) { //若对比框线路等于1 并且 按钮是可对比的 则处理对比按钮
            contrastBegin.removeClass("contrasta_on");
        } else if (onNum > 1 && !contrasBtn) {
            contrastBegin.addClass("contrasta_on");
            //可以对比啦~~~~
        }

        if (onNum < 3 && !conPrompt.hasClass("none")) { //控制【可添加三项】的提示
            conPrompt.addClass("none");
        }

        $("#seleline").html(onNum); //对比产品中的比例
    },
    initContrast: function () {
        var contrastBox = $(".contrastBox");
        var onnum = $(".contrasdiv .close").length;
        $("#seleline").html(onnum); //对比产品中的比例
        var smallcontrast = "-804px";
        if ($(".content").hasClass("Small_conter")) {
            smallcontrast = "-601px";
        }
        if (onnum > 0) {
            contrastBox.attr("attr-show", "true");
            contrastBox.css({
                "position": "fixed",
                "display": "block",
                "bottom": "0px",
                "left": "61%",
                "margin-left": smallcontrast
            });
        } else {
            contrastBox.css("display", "none");
            contrastBox.attr("attr-show", "false");
        }
    },
    contrastFBox: function () { /*点击关闭和清空功能*/
        var self = this,
            contrastBox = $(".contrastBox");
        $(".close,.clear_list").on("click", function () {
            var onClose = $(this),
                closeP = onClose.parent("li");

            if (onClose.hasClass("clear_list")) { //点击的是清空
                $(".contrasdiv li").each(function (i, elem) {
                    elem.innerHTML = "<p class='addinfo'>您还可以继续添加产品</p>";
                });
                $("#contrbegin").removeClass("contrasta_on");

                //把已对比的取消
                $(".compare").each(function (i, elem) {
                    $(elem).removeClass("hasCom");
                });
                storage.removeItem("__djcompare__");
                contrastBox.css("display", "none"); //若清空则影藏掉对比功能框
                contrastBox.attr("attr-show", "false");
            } else { //点击关闭
                var delId = onClose.attr("copyid");
                closeP.innerHTML = "<p class='addinfo'>您还可以继续添加产品</p>";

                if (delId === null) {
                    return; //若选择的对比线路不是当前页面的就 跳出
                }
                $(".compare").each(function (i, elem) {
                    var nowattr = $(elem).attr("attr-id");
                    if (delId === nowattr) {
                        $(elem).removeClass("hasCom");
                    }
                });
                if (storage.getItem("__djcompare__")) {
                    var arr = JSON.parse(storage.getItem("__djcompare__"));
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].lineid === delId) {
                            arr.splice(i, 1);
                        }
                    }
                    if (arr.length) {
                        storage.setItem("__djcompare__", arr);
                    } else {
                        storage.removeItem("__djcompare__");
                    }
                }
                if ($(".close").length === 1) {
                    contrastBox.css("display", "none"); //若清空则影藏掉对比功能框
                    contrastBox.attr("attr-show", "false");
                }
                self.actionFun(closeP);
            }
            self.contrastBytn();
        });
    },
    /**
        * @desc 跳转对比页
        */
    gotoCompare: function () {
        $("#contrbegin").on("click", function () {
            var _self = $(this),
                _url = _self.attr("attr-url"),
                str = "";
            if (_self.hasClass("contrasta_on")) {
                $(".contrasdiv .close").each(function (i, elem) {
                    var _this = $(elem),
                        _id = _this.attr("copyid");
                    str += (_id + "_");
                });
                str = (str !== "" ? str.substring(0, str.length - 1) : "");
                _url = _url + str + ".html";
                _self.attr("target", "_blank");
                _self.attr("href", _url);
            }
        });
    },
    /**
        * @desc 处理分页
        */
    renderPager: function (cfg, data) {
        var self = this,
            total = data.totalCount,
            totalPage = Math.ceil(total / 20);
        self.render(data, function () {
            self.callback();
        });
        if (totalPage === 1) {
            $("#J_NoLine").show();
        } else {
            $("#J_NoLine").hide();
        }
        if (totalPage > 0) {
            self.getPage(cfg, totalPage);
        } else {
            $("#J_LablePager").empty();
        }
    },
    /**
        * @desc 分页函数
        */
    getPage: function (cfg, totalpage) {
        var self = this;
        //判断是否是当地参团
        require("pager/0.1.0/index");
        var url = "/intervacation/searchproduct?type=intervacation&ifReSearch=1&stat=isExtraordinary,isTcspecialline&toLpCity=1&channelId=1",
            tos = $("#hidTotalCount").val() || 0,
            tosl = Math.ceil(parseInt(tos, 10) / 20),
            allpage = totalpage ? totalpage : tosl,
            pathGroup = window.location.pathname.split(/\-/g),
            lbNum = pathGroup ? pathGroup[0].match(/\d+/) : "",
            dest = cfg.dest;
        cfg.lbPId = lbNum ? lbNum[0] : "";
        var hasCondition = self.filter.hasCondition();
        var param = $.extend({}, {
                newKeyword: dest,
                scId: cfg.lcCity,
                lcCity: cfg.lcCity,
                prop: (cfg.prop != 0) ? cfg.prop : "",
                count: 20,
                sort: stpSort
            },self.filter._param_ || {});
        if (allpage <= 1) {
            $("#J_NoLine").show();
        } else {
            $("#J_NoLine").hide();
        }
        $('#J_LablePager').page({
            current: 1,
            total: allpage,
            needFirstAndLast: true,
            pageNoParam: "pageNum",
            ajaxObj: {
                url: url,
                data: param,
                dataType: "json",
                success: function (data) {
                    if (param.pageNum >= allpage) {
                        $("#J_NoLine").show();
                    } else {
                        $("#J_NoLine").hide();
                    }
                    data.response[0].cityId = $("#hidCityId").val();
                    data.response[0].BaseData = {
                        PageType: pageType,
                        SearchType: searchType,
                        DestName: destName,
                        DestPinYin: destPinYin,
                        FreeLabelId: freeLabelId,
                        GroupLabelId: groupLabelId
                    };
                    window.asyn = true;
                    self.render(data.response[0], function () {
                        self.callback();
                    });
                    var msgTop = parseInt(parseInt($("#seafilter").offset().top));
                    document.documentElement.scrollTop = document.body.scrollTop = msgTop;
                },
                error: function () {
                    Monitor.log("处理分页失败" + url, "renderPager");
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
        var bodyTmpl = require("./views/product.dot");
        $("#tagList").empty().append(bodyTmpl(data));
        if (callback) {
            callback.call(this);
        }
    },
    //筛选
    filter: {
        init: function (conf) {
            this.filterList();
            this.priceText();
            this._condition_ = {};
            this.initFilterEvOne(conf);
            this.initFilter();
            // this.isResetFilter(conf);
        },
        /**
            * @desc 是否重新渲染筛选条件
            * */
        isResetFilter: function (conf) {
            var parseFilter = this.parseUrl(),
                count = 0;
            for (var key in parseFilter) {
                if (parseFilter[key] || parseInt(parseFilter[key],10) === 0) {
                    count++;
                }
            }
            if (count) {
                this.initFilter(conf);
            }
        },
        /**
            * @desc 多选 更多显隐
            * */
        filterList: function () {
            var self = this;
            /**
                * @desc 还原板块
                */
            var removeInput = function (t) {
                var tpar = t.parents(".rowbox");
                $(".more-btn", tpar).html("更多").removeClass("less-btn");
                $(".multibtn", tpar).removeClass("none");
                tpar.removeClass("alllist");
                tpar.attr("data-multiselect", "false");
                $(".rowlist a", tpar).removeClass("addinput onlist");
            };
            $(".rowbox").each(function (nub, ele) {
                var list = $(ele).find(".rowlist"),
                    t_btn = $(ele).find(".more-btn");
                if ($(list).height() < 30) {
                    t_btn.addClass("none");
                } else {
                    t_btn.removeClass("none");
                }
            });
            $(document).delegate(".multibtn","click", function () {// 多选
                var t = $(this),
                    tpar = t.parents(".rowbox"),
                    listbox = $(".rowlist", t.parents(".rowbox"));
                $("a", listbox).addClass("addinput");
                if (!tpar.hasClass("alllist")) {
                    tpar.addClass("alllist");
                    tpar.attr("data-multiselect", "true");
                }
                $(t).addClass("none");
                $(".btns", tpar).removeClass("none");
                t.siblings(".more-btn").addClass("less-btn");
                $(".more-btn", tpar).html("收起");
            });
            $(document).delegate(".crumlist .more-btn","click", function () {//展开 收起
                var t = $(this),
                    tpar = t.parents(".rowbox");
                if (!tpar.hasClass("alllist")) {
                    tpar.addClass("alllist");
                    t.addClass("less-btn");
                    t.html("收起");
                } else {
                    removeInput(t);
                }
            });
            $(document).delegate(".cancel","click", function () {//点击取消
                var t = $(this);
                removeInput(t);
            });
            $(document).delegate(".submit","click", function () {//点击确定
                var t = $(this),
                    data = "",
                    tpar = t.parents(".rowbox"),
                    cl = $(".cancel", tpar),
                    listcheck = $(".rowlist a", tpar);
                if ($(".onlist", tpar).length !== 0) {
                    $(listcheck).each(function (nub, ele) {
                        if ($(ele).hasClass("onlist")) {
                            data += ($(ele).html() + ",");
                            tpar.attr("attr-data", data.substring(0, data.length - 1));
                        }
                    });
                    self.nodeJoin(tpar);
                } else {
                    removeInput(cl);
                }
            });
            $(document).delegate(".showBtn","click", function () {
                var box = $(".showboxs"),
                    btn = $(".showBtn");
                if (box.hasClass("none")) {
                    box.removeClass("none");
                    btn.addClass("upbtn");
                    $("i", btn).html("收起");
                    $(".showboxs .rowbox").each(function (nub, ele) {
                        var list = $(ele).find(".rowlist"),
                            t_btn = $(ele).find(".more-btn");
                        if ($(list).height() < 30) {
                            t_btn.addClass("none");
                        } else {
                            t_btn.removeClass("none");
                        }
                    });
                } else {
                    box.addClass("none");
                    btn.removeClass("upbtn");
                    $("i", btn).html("展开");
                }
            });
        },
        /**
            * @desc 添加筛选板块
            */
        nodeJoin: function (tpar) {
            var listname = $(tpar).attr("attr-name");
            var key = $(tpar).attr("data-key");
            $(tpar).removeClass("alllist");
            var strhtml = '<div class="crumdiv" data-key="' + key + '" title=' + tpar.attr("attr-data") + '><span class="crumtitle">' + listname + '</span><b class="curminfo">' + tpar.attr("attr-data").substring(0, 21) + '</b><i data-list =' + tpar.attr("data-list") + '>&nbsp;</i></div>';
            $(".removeall").before(strhtml);
            $(".crumbox").removeClass("none");
            tpar.addClass("none");
        },
        /**
            * @desc 价格筛选
            */
        priceText: function () {
            $("#priceinner").mouseover(function () {
                $(".price-bot").removeClass("none");
                $("#priceinner").addClass("pricelist");

            }).mouseout(function () {
                $(".price-bot").addClass("none");
                $("#priceinner").removeClass("pricelist");
            });
            $(".inputbox input").focus(function () {
                $(this).css("color", "#333");
            }).keyup(function () {
                $(this).val("¥" + $(this).val().replace(/[^\d]/g, ''));
            });
        },
        /**
            * @desc 日历
            */
        CalendarFun: function () {
            var cal = new $.Calendar({
                skin: "white",
                width: 1000
            });
            var smallCal = -70;
            if ($(".content").hasClass("Small_conter")) {
                smallCal = -25;
            }
            var beginTime = $("#startTime"),
                finishTime = $("#endTime");
            beginTime.on("focus", function () {
                var overTime = finishTime.val() === "" ? "2020-12-12" : finishTime.val();
                cal.pick({
                    elem: this,
                    startDate: beginTime.attr("attr-timeb"),
                    endDate: overTime,
                    mode: "rangeFrom",
                    offset: {
                        left: smallCal
                    },
                    currentDate: [beginTime.attr("attr-timeb")],
                    fn: function () {
                        cal.pick({
                            elem: $("#endTime"),
                            mode: "rangeTo",
                            offset: {
                                left: -90
                            },
                            startDate: beginTime.val() !== "" ? beginTime.val() : beginTime.attr("attr-timeb")
                        });
                    }
                });
            });
            finishTime.on("focus", function () {
                cal.pick({
                    elem: this,
                    mode: "rangeTo",
                    offset: {
                        left: smallCal
                    },
                    startDate: beginTime.val() !== "" ? beginTime.val() : beginTime.attr("attr-timeb")
                });
            });
        },
        defaultFilterParam: function () {
            var self = this;
            return $.extend({},{
                pageNum: 1
            }, self.parseUrl());
        },
        buildParam: function (cfg) {
            var self = this,
                dest = cfg.dest,
                hasCondition = self.hasCondition();
            var param = $.extend({}, {
                newKeyword: dest,
                scId: cfg.lcCity,
                lcCity: cfg.lcCity,
                prop: (cfg.prop != 0) ? cfg.prop : "",
                count: 20,
                sort: stpSort
            });
            return $.extend({}, this.defaultFilterParam(), param || {});
        },
        ajax: function (param) {
            var url = "/intervacation/searchproduct?type=intervacation&ifReSearch=1&stat=lineQuality,specialNickId,routeDays,pm,portCityId,rcImgUrl,sceneryId,hotelGradeId,clractTitle,serviceCharId,flightTypeId,goDepartureTime,backDepartureTime,isExtraordinary,isTcspecialline&toLpCity=1&channelId=1";
            return common.ajax({
                url: url,
                data: param,
                dataType: "json"
            });
        },
        renderFilter: function (data, callback) {
            var filterTmpl = require("./views/filter.dot");
            Common.render({
                tpl: filterTmpl,
                data: data,
                context: "#filter",
                overwrite: true,
                callback: callback
            });
        },
        initFilterEvOne: function (conf) {
            var self = this;
            //筛选
            $(document).delegate(".rowlist a","click", function (e) {
                e.preventDefault();
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
                if (!((pageType == 1 || pageType == 3) && searchType == 1)) {
                    if ($(this).parents(".J_lineCity").length) {
                        window.location.href = $(this).attr("href");
                        return;
                    }
                }
                // 是否可多选 true false
                if (tpar.attr("data-MultiSelect") === "false") {
                    if (tpar.attr("data-openurl") === "false") {
                        tpar.attr("attr-data", _this.html());
                        self.nodeJoin(tpar);
                    }
                }
                if (_this.hasClass("onlist")) {
                    _this.removeClass("onlist");
                } else {
                    _this.addClass("onlist");
                }
                if ($(this).parents(".rowbox").hasClass("alllist")) {
                    return;
                }
                var key = $(this).parents(".rowbox").attr("data-key"),
                    filterParam = {};
                if ($(this).parents(".J_lineStartDate").length) {       //时令月份
                    key = $(this).attr("data-key");
                    filterParam[key] = $(this).attr("data-value");
                } else if ($(this).parents(".J_goTime").length) {        //去程
                    filterParam.minGoDepartureTime = $(this).attr("data-min");
                    filterParam.maxGoDepartureTime = $(this).attr("data-max");
                } else if ($(this).parents(".J_backTime").length) {        //返程
                    filterParam.minBackDepartureTime = $(this).attr("data-min");
                    filterParam.maxBackDepartureTime = $(this).attr("data-max");
                } else {
                    filterParam[key] = $(this).attr("data-value");
                }
                self.addCondition(filterParam);
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //多选
            $(document).delegate(".rowlist .submit","click", function () {
                var _this = $(this),
                    tpar = _this.parents(".rowbox"),
                    key = tpar.attr("data-key");
                if ($(".onlist", tpar).length !== 0) {
                    var ret = [],
                        multiParam = {};
                    $(".rowlist >a").each(function () {
                        if ($(this).hasClass("onlist")) {
                            ret.push($(this).attr("data-value"));
                        }
                    });
                    multiParam[key] = ret.join(',');
                    self.addCondition(multiParam);
                    self._initFilter(conf,function () {
                        self.initRow();
                    });
                }
            });
            //出游日期时间
            $(document).delegate(".cal_btn","click", function () {
                var beginTime = $("#startTime"),
                    finishTime = $("#endTime");
                if (beginTime.val() === "") {
                    beginTime.focus();
                    $(this).attr("data-isReady", "0");
                } else if (finishTime.val() === "") {
                    finishTime.focus();
                    $(this).attr("data-isReady", "0");
                } else {
                    var tpar = $(this).parents(".rowbox"),
                        data = beginTime.val() + "~" + finishTime.val();
                    tpar.attr("attr-data", data);
                    self.nodeJoin(tpar);
                    beginTime.val("");
                    finishTime.val("");
                    $(this).attr("data-isReady", "1");
                }
                if ($(this).attr("data-isReady") === "1") {
                    var dateArr = $(".J_lineStartDate").parents(".rowbox").attr("attr-data").split("~");
                    var startTime = dateArr[0];
                    var endTime = dateArr[1];
                    self.addCondition({minVGDate: startTime, maxVGDate: endTime});
                    self._initFilter(conf,function () {
                        self.initRow();
                    });
                }
            });
            $(document).on(".price-bot span", "click", function () {
                $(".inputbox input").val("");
            });
            //服务特色
            $(document).delegate(".J_lineService >span","click", function () {
                var serArr = [],
                    key = $(this).attr("data-key");
                $(this).toggleClass("removeinput");
                if ($(".J_lineService .removeinput").length > 0) {
                    var obj = {};
                    $(".J_lineService .removeinput").each(function () {
                        var _this = $(this),
                            _val = _this.attr("data-value");
                        serArr.push(_val);
                    });
                    obj[key] = serArr.join(",");
                    self.addCondition(obj);
                } else {
                    self.removeCondition(key);
                }
                self._initFilter(conf,function () {
                    self.initRow();
                    if (serArr.length > 0) {
                        $(".J_lineService .pitchon").each(function (k, el) {
                            for (var i = 0; i < serArr.length; i++) {
                                if ($(el).attr("data-value") == serArr[i]) {
                                    $(el).addClass("removeinput");
                                }
                            }

                        });
                    }
                });
            });
            //同程专线
            $(document).delegate(".J_TcLine","click", function () {
                $(this).toggleClass("removeinput");
                if ($(this).hasClass("removeinput")) {
                    self.addCondition({
                        "isTcspecialline": 1
                    });
                } else {
                    self.removeCondition("isTcspecialline");
                }
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //321旅游节
            $(document).delegate(".J_Festival","click", function () {
                $(this).toggleClass("removeinput");
                if ($(this).hasClass("removeinput")) {
                    self.addCondition({
                        "marketingTagId": 25
                    });
                } else {
                    self.removeCondition("marketingTagId");
                }
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //排序   0-》综合排序 1-》销量 2-》点评 3-》价格
            $(document).delegate(".sort-ul >li a","click", function (e) {
                e.preventDefault();
                var parEl = $(this).parent();
                var index = parEl.index();
                var sortParam = "",
                    paramObj = {};
                parEl.addClass("cur").siblings().removeClass("cur");
                switch (index) {
                    case 0:
                        sortParam = stpSort;
                        // 默认排序下如果是跟团自由行标签页且无筛选条件，则显示分组信息
                        break;
                    case 1:
                        sortParam = orderSort;
                        break;
                    case 2:
                        sortParam = cmtSort;
                        break;
                    case 3:
                        $(this).toggleClass("order-by-desc");
                        if ($(this).hasClass("order-by-desc")) {
                            sortParam = asceSort;
                        } else {
                            sortParam = descSort;
                        }
                        break;
                }
                paramObj['sort'] = sortParam;
                self.removeCondition("sort");
                self.addCondition(paramObj);
                // 默认排序下如果是跟团自由行标签页且无筛选条件，则显示分组信息
                var filterConf = $.extend({}, conf || {});
                self._initFilter(filterConf, function () {
                    self.initRow();
                    $(".sort-ul >li").eq(index).addClass("cur").siblings().removeClass("cur");
                    if (sortParam.match("pcPriceSort:asc")) {
                        $(".sort-ul >li a:last").addClass("order-by-desc");
                    }
                });
            });
            //价格筛选
            $(document).delegate(".price-bot >a","click", function () {
                var min = $(".min").val(),
                    max = $(".max").val(),
                    min_rep = parseInt(min.replace(/¥/g, '')),
                    max_rep = parseInt(max.replace(/¥/g, ''));
                if (max_rep > 0) {
                    if (min_rep > max_rep) {
                        $(".min").val(max);
                        $(".max").val(min);
                    }
                }
                var minPrice = $(".min", "#priceinner").val().slice(1);
                var maxPrice = $(".max", "#priceinner").val().slice(1);
                if (minPrice || maxPrice) {
                    self.addCondition({minPrice: minPrice, maxPrice: maxPrice});
                    self._initFilter(conf,function () {
                        $(".min", "#priceinner").val("¥" + minPrice);
                        $(".max", "#priceinner").val("¥" + maxPrice);
                    });
                }
            });
            //清除价格
            $(document).delegate(".price-bot >span","click", function () {
                self.removeCondition("minPrice", "maxPrice");
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });

            //移除全部
            $(document).delegate(".removeall","click", function (e) {
                e.preventDefault();
                $(".crumlist .rowbox").removeClass("none");
                $(".crumbox .crumdiv").remove();
                $(".crumbox").addClass("none");
                self.removeConditionAll();
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //移除单个筛选条件
            $(document).delegate(".crumbox i", "click", function () {
                var tbox = $(this).parents(".crumdiv"),
                    key = tbox.attr("data-key");
                tbox.remove();
                self.removeCondition.apply(self, key.split("|"));
                self._initFilter(conf, function () {
                    self.initRow();
                });
            });
        },
        /**
            * @desc 更换出发地url
            * @param elArr
            * @param attr
            */
        _changeUrl: function(elArr,attr){
            if (searchType == 0) {
                var url = window.location.pathname.toLocaleLowerCase();
                $(elArr).each(function () {
                    var id = $(this).attr(attr || "data-value");
                    var reg1 = /(gentuan|zizhu|tag|lvyou|local)\/f/g,
                        reg2 = /(zizhu|lvyou|gentuan|local)\/(d|m|w)/g;
                    var arr = window.location.href.split('/');
                    var city = 'f'+id;
                    var str1 = arr.splice(5,2,city);
                    var str2 = str1[0];
                    var url1 = arr.join('/');
                    if(reg1.test(url)){
                        var _url = url.replace(/(\-(?:gentuan|zizhu|tag|lvyou|local)\/f)(\d+)/, function ($0, $1) {
                            return $1 + id;
                        });
                    }else if(reg2.test(url)){
                        var _url = url1 + str2 +"/";
                    }else{
                        var _url = url +"f"+ id +"/";
                    }
                    $(this).attr("href", _url);
                });
            } else {
                var url = window.location.pathname.toLocaleLowerCase();
                var property = NewTag.prototype.getQueryString("prop");
                $(elArr).each(function () {
                    var name = $(this).text(),
                        str = "?src=" + name + "&dest=" + destName + "&prop=" + property,
                        surl = url + str;
                    $(this).attr("href", surl);
                });
            }
        },
        /**
            * @desc 筛选请求并渲染
            * @param config
            * @param callback
            * @private
            */
        _initFilter: function (conf,callback) {
            var self = this;
            $("#tagList").empty();
            $("#J_LablePager").empty();
            $("#J_NoLine").hide();
            $(".loading").show();
            self._param_ = self.buildParam(conf);
            $.extend(self._param_, self._condition_ || {});
            self.ajax(self._param_).then(function (data) {
                $(".loading").hide();
                if (!data.response || data.response[0].totalCount == 0) {
                    $("#tagList").empty();
                    $("#J_LablePager").empty();
                    $("#J_NoLine").show();
                    return;
                }
                //获取SearchPlatId
                self.SearchPlatId = 1;
                data.response[0].BaseData = {
                    PageType: pageType,
                    SearchType: searchType,
                    DestName: destName,
                    DestPinYin: destPinYin,
                    FreeLabelId: freeLabelId,
                    GroupLabelId: groupLabelId
                };
                self.renderFilter(data.response[0], function () {
                    // self._changeUrl(".J_lineCity>a");
                    if (self._condition_.sort) {
                        if(self._condition_.sort.match("pcOrderCountSort:desc")) {
                            $(".sort-ul li").removeClass("cur");
                            $(".sort-ul li").eq(1).addClass("cur");

                        }
                        if(self._condition_.sort.match("pcSatisfactionSort:desc")) {
                            $(".sort-ul li").removeClass("cur");
                            $(".sort-ul li").eq(2).addClass("cur");
                        }
                        if(self._condition_.sort.match("pcPriceSort:desc")) {
                            $(".sort-ul li").removeClass("cur");
                            var _par =$(".sort-ul li").eq(3);
                            _par.addClass("cur");
                        } else if(self._condition_.sort.match("pcPriceSort:asc")) {
                            $(".sort-ul li").removeClass("cur");
                            var _par =$(".sort-ul li").eq(3);
                            $(".sort-ul li").eq(3).addClass("cur");
                            $("a",_par).addClass("order-by-desc");
                        }
                    }
                    $(".rowbox").each(function (nub, ele) {
                        var list = $(ele).find(".rowlist"),
                            t_btn = $(ele).find(".more-btn");
                        if ($(list).height() < 30) {
                            t_btn.addClass("none");
                        } else {
                            t_btn.removeClass("none");
                        }
                    });
                    callback && callback();
                    self.priceText();
                    self.CalendarFun();
                });
                if (data.response[0].totalCount == 0) {
                    $("#J_NoLine").show();
                    return;
                }
                NewTag.prototype.renderPager(self._param_, data.response[0]);
            });
            if ($(".crumbox .crumdiv").size()) {
                $(".crumbox").show();
            } else {
                $(".crumbox").hide();
            }
        },
        /**
            * @desc 初始化筛选面板
            * @param conf
            */
        initFilter: function () {
            var self = this;
            // self._initFilter(conf, function () {
            //     self.initCondition();
            //     self.initRow();
            // });
            var config = self.parseUrl();
            delete config.scId;
            self.addCondition(config);
            self.initCondition();
            self.initRow();
        },
        /**
            * @desc 初始化筛选条件
            */
        initCondition: function () {
            var self = this,
                config = self.parseUrl();
            var str = '<div class="crumdiv" data-key="{key}">'+
                '<span class="crumtitle">{type}</span><b class="curminfo">{name}</b><i data-list="1">&nbsp;</i>'+
                '</div>';
            var ret = [], obj = {};
            if (!self._condition_) {
                self._condition_ = $.extend({},config);
            }
            for(var key in config){
                if(key === "scId" || config[key] === "") {
                    continue;
                }
                obj.name = config[key];
                switch (key){
                    case "specialNickId":
                        obj.type = "线路玩法";
                        obj.name = $(".J_linePlay a").text();
                        $(".J_linePlay").parents(".rowbox").hide();
                        break;
                    case "pm":
                        obj.type = "出游日期";
                        $(".J_lineStartDate").parents(".rowbox").hide();
                        break;
                    case "days":
                        obj.type = "游玩天数";
                        obj.name = config[key] + "天";
                        $(".J_lineDays").parents(".rowbox").hide();
                        break;
                }
                ret.push(str.replace("{type}",obj.type).replace("{name}",obj.name).replace("{key}",key));
            }
            if (ret.length) {
                $(".crumbox h4").after(ret.join(''));
                $(".crumbox").show();
            } else {
                $(".crumbox").hide();
            }
        },
        /**
            * @desc 移除条件
            */
        removeCondition: function () {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 0);
            for (var j = 0; j < args.length; j++) {
                for (var i in self._condition_) {
                    if (i === args[j]) {
                        self._condition_[i] = "";
                    }
                }
            }
        },
        removeConditionAll: function () {
            var self = this;
            for (var i in self._condition_) {
                if (i === "sort") {
                    self._condition_[i] = stpSort;
                } else {
                    self._condition_[i] = "";
                }
            }
        },
        /**
            * @desc 增加条件
            * @param condition
            */
        addCondition: function (condition) {
            var self = this;
            if (!self._condition_) {
                self._condition_ = {};
            }
            return $.extend(self._condition_, condition);
        },
        /**
            * @desc 是否有筛选条件
            * @returns {boolean}
            */
        hasCondition: function(){
            var self = this;
            var hasCondition = false;
            var param = self.parseUrl();
            // delete param.scId;
            var ret = $.extend({},param,self._condition_);
            //如果 days month lineQuality 不为空 已有查询条件 center
            for (var key in param) {
                if(key === "scId"){
                    continue;
                }
                if(param[key] || param[key] === 0){
                    hasCondition = true;
                    return hasCondition;
                }
            }
            for (var k in ret) {
                if(k === "scId"){
                    continue;
                }
                if((ret[k] || ret[k] === 0) && k !== "sort"){
                    hasCondition = true;
                    return hasCondition;
                }
                if (k === "sort") {
                    if (!ret[k].match("pcComprehensiveCTRSort:desc") && (ret[k] || ret[k] === 0)) {
                        hasCondition = true;
                        return hasCondition;
                    }
                }
            }
            return hasCondition;
        },
        /**
            * @desc 初始化栏目
            * @param rowEl
            */
        initRow: function () {
            var self = this;
            $(".crumbox .crumdiv").each(function () {
                var key = $(this).attr("data-key");
                $(".crumlist .rowbox").each(function () {
                    if ($(this).attr("data-key") === key) {
                        $(this).hide();
                    }
                });
            });
            for (var i in self._condition_) {
                if (i === "isTcspecialline" && self._condition_[i]) {
                    $(".J_TcLine").addClass("removeinput");
                }
            }
            for (var i in self._condition_) {
                if (i === "marketingTagId" && self._condition_[i]) {
                    $(".J_Festival").addClass("removeinput");
                }
            }
        },
        /**
            * @desc 解析url
            * @returns {{specialNickId: *, pm: *, days: *}}
            */
        parseUrl: function () {
            var arr = window.location.href.split('/');
            arr.pop();
            var str = arr.pop();
            var match1 = str.split(/(?:(?=[fdmw]))/);
            var match = match1.join();
            var reg1 = /\bf(\d+)\b/,
                reg2 = /\bd(\d+)\b/,
                reg3 = /\bm(\d+)\b/,
                reg4 = /\bw(\d+)\b/;
            var scId = "",
                days = "",
                pm = "",
                specialNickId = "";
            if(reg1.exec(match)){
                scId = reg1.exec(match)[1];
            }
            if(reg2.exec(match)){
                days = reg2.exec(match)[1];
            }
            if(reg3.exec(match)){
                pm = reg3.exec(match)[1];
            }
            if(reg4.exec(match)){
                specialNickId = reg4.exec(match)[1];
            }
            return {
                'scId': scId,
                'days':days,
                'pm':pm,
                'specialNickId':specialNickId
            };
        }
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    }
};
module.exports = new NewTag();
