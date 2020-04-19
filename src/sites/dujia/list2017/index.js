/**
* @desc:标签页
* @author: Jilly
* @mail: cjl10120@ly.com
* @createTime: 2016/3/21 10:36
* @version: 0.1
*/
var NewTag = function () {
};
require("dialog/0.2.0/base");
var Common = require("common/0.1.0/index"),
    storage = require("common/0.1.0/storage"),
    Dialog = require("dialog/0.2.0/dialog"),
    Slidertool = require("slidertoolbar/0.1.0/tool"),
    Track = require("intellSearch/0.2.1/track"),
    StartList = require("modules/startlist/0.2.0/index");
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
    descSort = "pcPriceSort:desc",
    cityId = $("#hidCityId").val(),
    cityName = $("#hidCityName").val();
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
        // $(document).on("mousedown", ".J_lineCity a", function (e) {
        //     var $el = $(this);
        //     trc.triggerEvent("/filter",{rc:""});
        // });
        self.real_init(conf);
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
        StartList.init();
        Slidertool.init({pageName: pageName});
        this.searchFunc(conf);
        this.initEve(conf);
        this.initScrollSpy();
        this.hoverLi();
        this.getDestination();
        this.bottomLink();
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
        this.initTip();
        if ((conf.prop == 1 || conf.prop == 3) && searchType == 1) {
            this.getNoResult(conf);
        }
        this.filter._changeUrl(".leavecity dd a","cityid");
    },
    callback: function () {
        this.hoverLi();
        this.lazyLoad();
        this.addCompare();
        this.initContrast();
        this.contrastFBox();
        //模块id添加.
        window.SPM_MODULE && SPM_MODULE.asynBind([".pro-img", ".pro-title", ".pro-btn"]);
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
    getStrategy:function(){
        // 自由行攻略
        var self = this,
            htmlTmpl = require("./views/strategy.dot");
        $.ajax({
        url:"/intervacation/api/PLabelSearchPage/GetCityStrategyIconList?selectCityName=" +encodeURIComponent(destName),
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if(data.Code===4000){
                    var datas = data.Data, 
                        str = "",arrList=[];
                    if(datas.Title && datas.Title!=""){
                        $(".J_Strategy").removeClass('none').html(htmlTmpl(datas));
                    }
                }
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
        var self = this;
        if (parseInt(cfg.prop,10) === 0) {
            $(".showbox").css("padding-bottom", "0");
        }
        // 目的地城市
        $(".countrybox").on("click", function () {
            $("#popleave").css("display", "none");
            $("#city_select").removeClass("city_b_hover");
            $(this).toggleClass("city_b_hover");
            if ($(this).hasClass("city_b_hover")) {
                $("#popcountry").css("display", "block");
            } else {
                $("#popcountry").css("display", "none");
            }
        });
        $(document).on("click", ".line-list li", function () {
            var _this = $(this),
                lineId = _this.attr("data-id"),
                jumpUrl = _this.attr("data-url");
            self.lineIdCookie(lineId);
            window.open(jumpUrl);
        });
        $(document).on("click",".date-more, .hot-buy a",function(event) {
            event.stopPropagation();
            var _this = $(this),
                lineId = _this.attr("data-id");
            self.lineIdCookie(lineId);
        });
        $(document).on("click", function (e) {
            var el = $(e.target);
            if (!el.hasClass("countrybox") && !el.hasClass("citybox") && !el.parents(".countrybox").length && !el.parents(".citybox").length) {
                $("#popleave").css("display", "none");
                $("#city_select").removeClass("city_b_hover");
                $(".countrybox").removeClass("city_b_hover");
                $("#popcountry").css("display", "none");
            }
        });
    },
    /**
     * @description 初始化滚动导航功能
     */
    initScrollSpy: function () {
        var self = this;
        //滚动监听
        $(window).on("scroll",  function () {
            var el = $(".tab_list"),
                top = $(document).scrollTop();
            if (top >= 0 && top <= 316) {
                el.find(".other").removeClass("none");
                el.css({
                    position: "relative",
                    display: "block",
                    background: "none",
                    "border-left": "none",
                    "border-right": "none"
                });
            } else {
                el.find(".other").addClass("none");
                el.css({
                    "position": "fixed",
                    "display": "block",
                    "background": "#fff",
                    "border-right": "1px solid #ddd"
                });
            }
        });
    },
    lineIdCookie: function (lineId) {
        var lineIdStr = $.cookie("MAIHL") || "",
            arr = [],
            hisArr = [];
        if (lineIdStr) {
            var lineIdArr = lineIdStr.split(",");
            var index = lineIdArr.indexOf(lineId);
            if(~index){
                lineIdArr.splice(index,1);
            }
            arr = [lineId].concat(lineIdArr);
            var len = Math.min(arr.length - 1, 4);
            for (var i = 0; i <= len; i++) {
                hisArr.push(arr[i]);
            }
            $.cookie("MAIHL", hisArr.toString(), {path: "/", domain: ".ly.com"});
        } else {
            $.cookie("MAIHL", lineId, {path: "/", domain: ".ly.com"});
        }
    },
    /**
        * @desc 产品hover效果
        */
    hoverLi: function () {
        var self = this;
        $(".line-list li").on("mouseenter", function () {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.addClass("lihover");
            _com.css("display", "block");
        }).on("mouseleave", function () {
            var _self = $(this),
                _com = $(".pro-compare", _self);
            _self.removeClass("lihover");
            _com.css("display", "none");
        });
        // $(".date-more, .hot-buy").on("mousedown", function () {
        //     var _this = $(this),
        //         lineId = _this.attr("data-id");
        //     self.lineIdCookie(lineId);
        // });
    },
    /**
        * @desc 获取浏览记录
        */
    getRecord: function () {
        var getLineId = $.cookie("MAIHL") || ""
        if (getLineId) {
            var _self = $(".J_History"),
                historyTmpl = require("./views/history.dot"),
                _url = "/intervacation/searchproduct?type=intervacation&stat&ifReSearch&isTpackage=0&lineId=" + getLineId;
            $.ajax({
                url: _url,
                dataType: "json",
                success: function (data) {
                    _self.removeClass("none");
                    var responseData = data ? data.response : [];
                    if (responseData[0] && responseData[0].totalCount > 0) {
                        var md = responseData[0];
                        _self.html(historyTmpl(md));
                        $(".history-line img").each(function(index, item) {
                            var imgUrl = Common.setImageSize($(item).attr("data-img"), "90x90");
                            $(item).attr("data-img", imgUrl);
                        });
                        $(".history-line img").lazyload({
                            "data_attribute": "img",
                            effect: 'fadeIn'
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
        el.on("click", "#tagList .J_Store", function (e) {
            e.stopPropagation();
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
                _showlist.css("width",300 * _num + "px");
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
            if(_height<=25)
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
        * @desc 点击加入对比
        */
    addCompare: function () {
        var self = this;
        $(".line-imgbox").each(function (i, el) {
            var contrastBox = $(".contrastBox"),
                arr = [];
            if ($(el).hasClass("hasbind")) {
                return;
            } else {
                $(el).addClass("hasbind");
                $(".compare", el).on("click", function (e) {
                    e.stopPropagation();
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
        var smallcontrast = "-595px";
        // if ($(".content").hasClass("Small_conter")) {
        //     smallcontrast = "-601px";
        // }
        if (onnum > 0) {
            contrastBox.attr("attr-show", "true");
            contrastBox.css({
                "position": "fixed",
                "display": "block",
                "bottom": "0px",
                "left": "50%",
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
        require("pager/0.4.0/index");
        var url = "/intervacation/searchproduct?type=intervacation&ifReSearch=1&stat=isExtraordinary,isTcspecialline&toLpCity=1&channelId=1",
            tos = $("#hidTotalCount").val() || 0,
            tosl = Math.ceil(parseInt(tos, 10) / 20),
            allpage = totalpage ? totalpage : tosl,
            pathGroup = window.location.pathname.split(/\-/g),
            lbNum = pathGroup ? pathGroup[0].match(/\d+/) : "",
            dest = cfg.dest;
        cfg.lbPId = lbNum ? lbNum[0] : "";
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
            needFirstAndLast: false,
            needJump: true,
            pageNoParam: "pageNum",
            ajaxObj: {
                url: url,
                data: param,
                dataType: "json",
                beforeSend: function () {
                    self.startStage();
                },
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
     * @desc 进度条
     */ 
    startStage: function() {
        var self = this;
        $(".J_Loading").fadeIn().find(".progress").css({
            width: 0
        }).animate({
            width: "85%"
        }, 400, function() {
            self.secondStage();
        });
    },
    secondStage: function() {
        var self = this;
        $(".J_Loading").find(".progress").animate({
            width: "95%"
        }, 200, function() {
            self.thirdStage();
        })
    },
    thirdStage: function() {
        $(".J_Loading").find(".progress").animate({
            width: "98%"
        }, 300, function() {});
    },
    endStage: function() {
        $(".J_Loading").find(".progress").stop(!0, !1).animate({
            width: "100%"
        }, 200, function() {
            $(this).css({
                width: "0"
            }).parent().hide();
        })
    },
    /**
        * @desc 分页渲染数据
        */
    render: function (data, callback) {
        var self = this;
        self.endStage();
        data.cityId = self.param.cityId;
        var bodyTmpl = require("./views/list.dot");
        $("#tagList").html(bodyTmpl(data));
        if (callback) {
            callback.call(this);
        }
    },
    //筛选
    filter: {
        init: function (conf) {
            this.filterList();
            this._condition_ = {};
            this.initFilterEvOne(conf);
            this.initFilter();
            this.CalendarFun();
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
                $(".btns", tpar).addClass("none");
                tpar.removeClass("alllist");
                tpar.attr("data-multiselect", "false");
                $(".rowlist a", tpar).removeClass("addinput onlist");
            };
            $(".rowbox").each(function (nub, ele) {
                var list = $(ele).find(".rowlist"),
                    t_btn = $(ele).find(".more-btn");
                if ($(list).height() < 37) {
                    t_btn.addClass("none");
                } else {
                    t_btn.removeClass("none");
                }
            });
            $(document).on("click", ".multibtn", function () {// 多选
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
            $(document).on("click", ".condition_list .more-btn", function () {//展开 收起
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
            $(document).on("click", ".cancel", function () {//点击取消
                var t = $(this);
                removeInput(t);
            });
            $(document).on("click", ".submit", function () {//点击确定
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
            $(document).on("click", ".showBtn",function () {
                var box = $(".J_Advanced"),
                    btn = $(".showBtn"),
                    showText = btn.attr("data-text");
                if (box.hasClass("none")) {
                    box.removeClass("none");
                    btn.html('收起<i class="up"></i>');
                    $(".filter .condition_list .showboxs + .showboxs").css("border-top", "1px dotted #ddd");
                    $(".J_Advanced .rowbox").each(function (nub, ele) {
                        var list = $(ele).find(".rowlist"),
                            t_btn = $(ele).find(".more-btn");
                        if ($(list).height() < 37) {
                            t_btn.addClass("none");
                        } else {
                            t_btn.removeClass("none");
                        }
                    });
                } else {
                    box.addClass("none");
                    btn.html('高级选项：<em>(' + showText + ')</em><i class="down"></i>');
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
            $(".sel_condition").removeClass("none");
            tpar.addClass("none");
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
                finishTime = $("#endTime"),
                date = new Date();
            beginTime.attr("attr-timeb", Common.dateFormat(date, "yyyy-MM-dd"));
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
                dest = cfg.dest;
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
                dataType: "json",
                beforeSend: function () {
                    NewTag.prototype.startStage();
                }
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
            $(document).on("click", ".rowlist a", function () {
                var _this = $(this),
                    tpar = _this.parents(".rowbox");
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
                    filterParam = {},
                    paramVal = $(this).attr("data-value"),
                    paramText = $(this).text();
                if ($(this).parents(".J_lineStartDate").length) {       //时令月份
                    key = $(this).attr("data-key");
                }
                filterParam[key] = paramVal;
                if (key == "scId") {
                    $("#city_select strong").text(paramText);
                    filterParam["lcCity"] = paramVal;
                    $(".content-nav-inner a").each(function () {
                        var dataUrl = $(this).attr("data-url");
                        $(this).attr("href", dataUrl + "f" + paramVal + "/");
                    });
                }
                self.addCondition(filterParam);
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //多选
            $(document).on("click", ".rowlist .submit", function () {
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
            $(document).on("click", ".cal_btn", function () {
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
            $(document).on("click", ".cal_clear", function () {
                var beginTime = $("#startTime"),
                    finishTime = $("#endTime");
                beginTime.val("");
                finishTime.val("");
                self.removeCondition("minVGDate", "maxVGDate");
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //同程专线
            $(document).on("click", ".J_TcLine", function () {
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
            //排序   0-》综合排序 1-》销量 2-》点评 3-》价格
            $(document).on("click", ".sort-ul >li", function () {
                var parEl = $(this);
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
                        sortParam = cmtSort;
                        break;
                    case 2:
                        sortParam = orderSort;
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
                        $(".sort-ul >li:last").addClass("order-by-desc");
                    }
                });
            });

            //移除全部
            $(document).on("click", ".removeall", function () {
                $(".condition_list .rowbox").removeClass("none");
                $(".sel_condition .crumdiv").remove();
                $(".sel_condition").addClass("none");
                self.removeConditionAll();
                self._initFilter(conf,function () {
                    self.initRow();
                });
            });
            //移除单个筛选条件
            $(document).on("click", ".sel_condition i", function () {
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
            $("#J_LablePager").empty();
            $("#J_NoLine").hide();
            $(".loading").show();
            self._param_ = self.buildParam(conf);
            $.extend(self._param_, self._condition_ || {});
            self.ajax(self._param_).then(function (data) {
                $(".loading").hide();
                if (!data.response || data.response[0].totalCount == 0) {
                    NewTag.prototype.endStage();
                    $("#tagList").empty();
                    $("#J_LablePager").empty();
                    $("#J_NoLine").css("margin-top", "0").show();
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
                        if ($(list).height() < 37) {
                            t_btn.addClass("none");
                        } else {
                            t_btn.removeClass("none");
                        }
                    });
                    self.CalendarFun();
                    callback && callback();
                });
                if (data.response[0].totalCount == 0) {
                    $("#J_NoLine").show();
                    return;
                }
                NewTag.prototype.renderPager(self._param_, data.response[0]);
            });
            if ($(".sel_condition .crumdiv").size()) {
                $(".sel_condition").removeClass("none");
            } else {
                $(".sel_condition").addClass("none");
            }
        },
        /**
            * @desc 初始化筛选面板
            * @param conf
            */
        initFilter: function () {
            var self = this;
            var config = self.parseUrl();
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
                if(config[key] === "lcCity" || config[key] === "") {
                    continue;
                }
                obj.name = config[key];
                switch (key){
                    case "scId":
                        obj.type = "出发城市";
                        obj.name = $("#city_select strong").text();
                        $(".content-nav-inner a").each(function () {
                            var dataUrl = $(this).attr("data-url");
                            $(this).attr("href", dataUrl + "f" + config[key] + "/");
                        });
                        $(".J_lineCity").parents(".rowbox").remove();
                        break;
                    case "specialNickId":
                        obj.type = "线路玩法";
                        obj.name = $(".J_linePlay a").text();
                        $(".J_linePlay").parents(".rowbox").remove();
                        break;
                    case "pm":
                        obj.type = "出游日期";
                        obj.name = config[key].substring(4) + "月";
                        $(".J_lineStartDate").parents(".rowbox").remove();
                        break;
                    case "days":
                        obj.type = "游玩天数";
                        obj.name = config[key] + "天";
                        $(".J_lineDays").parents(".rowbox").remove();
                        break;
                }
                ret.push(str.replace("{type}",obj.type).replace("{name}",obj.name).replace("{key}",key));
            }
            if (ret.length) {
                $(".sel_condition h4").after(ret.join(''));
                $(".sel_condition").removeClass("none");
            } else {
                $(".sel_condition").addClass("none");
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
                    if (i === "scId") {
                        self._condition_[i] = cityId;
                        self._condition_["lcCity"] = cityId;
                        $("#city_select strong").text(cityName);
                        $(".content-nav-inner a").each(function () {
                            var dataUrl = $(this).attr("data-url");
                            $(this).attr("href", dataUrl);
                        });
                    } else if (i === args[j]) {
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
                } else if (i === "scId") {
                    self._condition_[i] = cityId;
                    $("#city_select strong").text(cityName);
                    $(".content-nav-inner a").each(function () {
                        var dataUrl = $(this).attr("data-url");
                        $(this).attr("href", dataUrl);
                    });
                } else if (i === "lcCity") {
                    self._condition_["lcCity"] = cityId;
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
            } else if (!self._condition_["scId"]) {
                self._condition_["scId"] = cityId;
            }
            return $.extend(self._condition_, condition);
        },
        /**
            * @desc 初始化栏目
            * @param rowEl
            */
        initRow: function () {
            var self = this;
            $(".sel_condition .crumdiv").each(function () {
                var key = $(this).attr("data-key");
                $(".condition_list .rowbox").each(function () {
                    if ($(this).attr("data-key") && $(this).attr("data-key").indexOf(key) > -1) {
                        $(this).remove();
                    }
                });
            });
            for (var i in self._condition_) {
                if (i === "isTcspecialline" && self._condition_[i]) {
                    $(".J_TcLine").addClass("removeinput");
                }
            }
            if ($(".J_Advanced").find(".rowbox") && !$(".J_Advanced").find(".rowbox").length) {
                $(".rowbox .showboxs").addClass("none");
            }
            if ($(".J_Advanced").prev() && !$(".J_Advanced").prev().length && $(".J_Advanced").hasClass("none")) {
                $(".filter .condition_list .showboxs + .showboxs").css("border-top", "none");
            } else {
                $(".filter .condition_list .showboxs + .showboxs").css("border-top", "1px dotted #ddd");
            }
            if ($(".rowbox").length == 1) {
                $(".rowbox").addClass("none");
                $(".sel_condition").css("border-bottom", "none");
            } else {
                $(".sel_condition").css("border-bottom", "1px dotted #ddd");
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
            var lpCity = "",
                days = "",
                pm = "",
                specialNickId = "";
            if(reg1.exec(match)){
                lpCity = reg1.exec(match)[1];
            }
            if(reg2.exec(match)){
                days = reg2.exec(match)[1];
            }
            if(reg3.exec(match)){
                pm = reg3.exec(match)[1];
                var curDate = new Date();
                var year = curDate.getFullYear();
                var month = curDate.getMonth() + 1;
                if (Number(pm) < month) {
                    year++;
                }
                pm = year.toString() + pm.toString();
            }
            if(reg4.exec(match)){
                specialNickId = reg4.exec(match)[1];
            }
            return {
                'scId': lpCity,
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