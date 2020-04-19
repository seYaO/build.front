var Common = require("common/0.1.0/index");
require("slider/0.1.0/index");
require("placeholder/0.1.0/index");
require("jCarousel/0.2.1/index");
require("lazyload/0.2.1/index");
var IntellSearch = require("intellSearch/0.2.1/index");
var Slidertoolbar = require("slidertoolbar/0.1.0/index");
var Monitor = window.Monitor;
var Index = {};
var Tpl2 = require("./views/proListNew.dot"),
    sliderTmpl = require("./views/sliderNew.dot"),
    cityListTmpl = require("./views/cityList.dot"),
    proModuleTmpl = require("./views/module.dot"),
    btnContentTmpl = require("./views/btnContent.dot"),
    holeThemeProTmpl = require("./views/holeThemePro.dot"),
    holeJijiuProTmpl = require("./views/holeJijiuPro.dot"),
    holeShortProTmpl = require("./views/holeShortPro.dot"),
    holeLongProTmpl = require("./views/holeLongPro.dot");

Index._data = {};
Index.cityId='';
Index.init = function (conf) {
    Index.search(conf);
    Index.initEv();
    Index.flex();
    Index.lazyLoad();
    Index.hoverLink();
    Index.getServerNumber();
    Index.hotList();
    Index.carousel();
    Index.slider();
    Index.crossScreen();
};
/**
    * 初始化产品渲染
    * @param conf
    */
Index.initHandleLine = function () {

    //主题游
    Index.handleLine({
        "pageType":11,
        "lcCity":$('#city_select').attr('data-scid'),
        "start":1,
        "priThemeType":$.trim($('.J_play_theme li.current').attr('data-key')),
        "count":4,
        "contextId": 'J_theme_proList',
        "key": $('.J_play_theme li.current').attr('data-key'),
        "dest": "",
        "dep": $('#city_select strong').text(),
        "stp":"lcCitySort:1;orderCount:1;tcPrice:0"
    });

    //饭打包
    Index.handleLine({
        "pageType":13,
        "lcCity":$('#city_select').attr('data-scid'),
        "start":1,
        "dest":$.trim($(".J_Tpackage li.current").text()),
        "dep":$.trim($(".J_Tpackage li.current").text()),
        "count":4,
        "isTpackage":1,
        "key": $('.J_Tpackage li.current').data('key'),
        "contextId":'J_Tpackage_prolist',
        "stp":"lcCitySort:1;orderCount:1"
    });

    //长短线
    Index.handleLine({
        "pageType":13,
        "lcCity":$('#city_select').attr('data-scid'),
        "start":1,
        "dest":$.trim($(".J_short_distance li.current").text()),
        "dep":$.trim($(".J_short_distance li.current").text()),
        "key": $('.J_short_distance li.current').attr('data-key'),
        "groupNum":5,
        "froupNum":3,
        "count":"",
        "contextId":'J_short_proList',
        "stp":"",
    })
    Index.handleLine({
        "pageType":13,
        "lcCity":$('#city_select').attr('data-scid'),
        "start":1,
        "dest":$.trim($(".J_long_distance li.current").text()),
        "dep":$.trim($(".J_long_distance li.current").text()),
        "key": $('.J_long_distance li.current').attr('data-key'),
        "groupNum":5,
        "froupNum":3,
        "count":"",
        "contextId":'J_long_proList',
        "stp":"",
    })

};
//变更出发城市
Index.search = function (conf) {
    conf.callback=function(){
        Index.startCity();
    };
    var o_intel = IntellSearch.init(conf);
};
Index.lazyLoad = function () {
    if (Index.isInit) {
        var imgList = $(".prolist img").not("[data-img-loaded]");
        $(window).trigger("addElements", imgList);
    } else {
        $(".prolist img, .sale-right img").lazyload({
            "data_attribute": "img",
            "event": "scroll",
            effect: 'fadeIn'
        });
        Index.isInit = true;
    }
    $(window).trigger("scroll");
};
Index.initEv = function () {
    var self = this;
    $(document).on("click",".J_short_distance li,.J_long_distance li,.J_play_theme li,.J_Tpackage li" ,function () {
        var pageType, dest,dep,count,stp = '',priThemeType = '',isTpackage = '',groupNum = '',froupNum = '';
        var moreEl = $(this).parents(".area").find(".area__link"),
            moreUrl = $(this).attr("more-url"),
            more = $(this).attr("more-country");
        var startCity = $('#city_select strong').text();
        if ($(this).hasClass("current")) {
            return;
        }
        $(this).addClass("current").siblings().removeClass("current");
        if($(this).parents(".area").hasClass("J_play_theme")){
            pageType = 11
            dest = '';
            count = 4;
            priThemeType = $.trim($(this).attr('data-key'));
            dep = $('#city_select strong').text();
            stp = "lcCitySort:1;orderCount:1;tcPrice:0"
        }else if($(this).parents(".area").hasClass("J_Tpackage")){
            pageType = 13;
            dest = $.trim($("."+$(this).parents(".area").attr('data-tag')+" li.current").text());
            dep = $.trim($("."+$(this).parents(".area").attr('data-tag')+" li.current").text());
            count = 4;
            isTpackage = 1;
            stp = "lcCitySort:1;orderCount:1"
        }else {
            pageType = 13;
            dest = $.trim($("."+$(this).parents(".area").attr('data-tag')+" li.current").text());
            dep = $.trim($("."+$(this).parents(".area").attr('data-tag')+" li.current").text());
            count = 8;
            groupNum = 5;
            froupNum = 3;
            moreEl.html(more + "<em><i></i></em>").attr("href", moreUrl);
        }
        Index.handleLine({
            "lcCity":$('#city_select').attr('data-scid'),
            "start":1,
            "dest":dest,
            "count":count,
            "priThemeType":priThemeType,
            "isTpackage":isTpackage,
            "contextId":$(this).parents(".area").attr('data-tmpl'),
            "key":$(this).attr('data-key'),
            "pageType":pageType,
            "groupNum":groupNum,
            "froupNum":froupNum,
            "dep":dep,
            "stp":stp,
            "startCity":startCity
        })
    });
    $(".prolist img").each(function () {
        var proImgUrl = $(this).attr("data-img");
        $(this).attr("data-img",common.setImageSize(proImgUrl,"400x300"));
    });
    //轮播移上去显示左右按钮
    $('.carousel').hover(function () {
        $(this).find('.left,.right').show();
    }, function () {
        $(this).find('.left,.right').hide();
    });

};
/**
    * 线路处理
    * @param config
    */
Index.handleLine = function (config) {
    var url = window.host + '/intervacation/api/ProductSearch/GetPCProductListObjectWithOutCondition';
    var self = this;
    var pageType = config.pageType,
        lcCity = config.lcCity,
        start = config.start,
        priThemeType = config.priThemeType,
        context = "#" + config.contextId,
        count = config.count,
        key = config.key,
        dep = config.dep,
        dest = config.dest,
        isTpackage = config.isTpackage,
        groupNum = config.groupNum,
        froupNum = config.froupNum,
        overwirte = false,
        stp = config.stp;
    var param = {
        "pageType": pageType,
        "lcCity": lcCity,
        'start': start,
        'priThemeType': priThemeType,
        'count':count,
        'dest':dest,
        'isTpackage':isTpackage,
        'groupNum':groupNum,
        'froupNum':froupNum,
        'stp':stp
    };
    if(config.contextId == 'J_short_proList' || config.contextId == 'J_long_proList'){
        url = window.host + '/intervacation/api/ProductSearch/GetPCHomePageProductGroupAndFree?minPrice=2001';
    }
    var tarEl = $(context + " .J_proList" + key);

    if (!Index._data[dep + "|" + key + "|" + context]) {
        $.ajax({
            "url": url,
            "data": param,
            "dataType": "json",
            beforeSend: function () {
                $(context).find('.prolist').hide();
                $(context).addClass('prolist_load');
            },
            success: function (data) {
                $(context).removeClass('prolist_load');
                //附加一个key值，方便切换
                data.Data._key = key;
                data.Data._jijiu = config.isTpackage;
                data.Data.startCity = config.startCity;
                data.Data.dest = dest;
                Index._data[dep + "|" + key + "|" + context] = data.Data.ProductList;
                Index.render({
                    "tpl": Tpl2,
                    "data": data.Data,
                    "key": key,
                    "jijiu": config.isTpackage,
                    "context": context,
                    "callback": function () {
                        $(this).siblings().hide();
                        Index.lazyLoad();
                        self.resize();
                    }
                });
            },
            error: function () {
                Monitor.log("获取线路失败" + url, "handleLine");
            }
        });
    } else if (!tarEl.length || overwirte) {
        //当改变出发地时要走渲染逻辑
        Index.render({
            "tpl": Tpl2,
            "data": Index._data[dep + "|" + key + "|" + context],
            "key": key,
            "context": context,
            "callback": function () {
                $(this).show().siblings().hide();
                Index.lazyLoad();
                self.resize();
            }
        });
    } else {
        tarEl.show().siblings().hide();
    }
};
/**
    * 渲染逻辑同touch
    * @param config
    */
Index.render = function (config) {
    if (config.data==null) {
        config.data=[];
    }
    var tpl = config.tpl,
        key = config.key,
        jijiu = config.jijiu,
    //data =  config.data,
        data = config.data || config.data[key],
        context = $(config.context),
        callback = config.callback;
    data.key = key;
    //增加机酒关键字与普通自由行做区分
    data.jijiu = jijiu;
    var _html = tpl(data),
        cxt;
    if (config.overwrite) {
        context.empty();
    }
    cxt = $(_html).appendTo(context);
    if (data.length == 0) {
        $(context).find('.J_proList' + key).html('该线路不存在，请切换其他线路！');
    }
    if (callback && $.isFunction(callback)) {
        callback.call(cxt, config);
    }
};
//获取电话号码
Index.getServerNumber = function () {
    var url = "/dujia/ajaxcall.aspx?type=GetTel400";
    $.ajax({
        url: url,
        success: function (data) {
            $(".J_tel").text(data.slice(1, -1));
        },
        error: function () {
            Monitor.log("获取服务器号码失败" + url, "getServerNumber");
        }
    });
};
/**
    * @desc resize
    */
Index.resize = function () {
    var clientW = document.documentElement.clientWidth;
    var minW = 1200;
    if (clientW <= minW) {
        $("body").addClass("w990");
        $(".proline,.step>span").filter(function () {
            return ($(this).index() + 1) % 4 === 0;
        }).hide();
        $(".new-label").css("display","none");
    } else {
        $("body").removeClass("w990");
        $(".proline,.step>span").show();
        $(".new-label").css("display","block");

    }
}
Index.flex = function () {
    var self = this;
    self.resize();
    window.onresize = function () {
        self.resize();
    };
};
/**hover效果 以及底部seo链接**/
Index.hoverLink = function () {

    $(".iv-hotlink").each(function () {
        var _height = $(this).height(),
            linkmore = $(this).parents(".iv-bottomlink").find(".iv-bothow");
        if (_height <= 20) {
            $(linkmore).hide();
        }
        $(this).css("height", "20px");
    });
    $(".iv-bothow").on("click", function () {
        var _self = $(this),
            _arrow = _self.find("i"),
            linkdd = _self.parent(".iv-bottomlink").find(".iv-hotlink");
        if (_arrow.hasClass("over")) {
            _self.html("更多<i></i>");
            linkdd.css("height", "20px");

        } else {
            _self.html("收起<i class='over'></i>");
            linkdd.css("height", "auto");
        }
    });
};
/*热门地点却换*/
Index.hotList = function () {
    var self = this;
    $(".listbox").hover(function () {
        $(this).find(".box img").attr("src", $(this).find("img").attr("attr-imageh"));
        $(this).addClass("listboxH").siblings().removeClass("listboxH");
        $(".showlist").hide();
        $(this).find('.showlist').show();
    }, function () {
        $(this).find(".box img").attr("src", $(this).find("img").attr("attr-image"));
        $(this).removeClass('listboxH');
        $(".showlist").hide();
    });

    //解决ie下高度问题
    $('.listbox').last().find('.box').height(43);
};
/**
    * 出发地渲染
    */
Index.startCity = function () {
    var self=this;
    Index.renderHoleHtml(
        {
            "cityId":$("#city_select").attr("data-scid"),
            "cityName":$("#city_select strong").text()
        });
    Index.setCookies({
        "scId": $('#city_select').attr('data-scid'),
        "cityName":$("#city_select strong").text()
    });

};
/**
    * 改变出发地渲染整个页面
    * @param config
    */
Index.renderHoleHtml = function (param) {
    var _url = '/intervacation/api/PPageCenter/GetPCHomePage?minPrice=2001&cityId='+param.cityId+'&cityName='+param.cityName;
    $.ajax({
        url:_url,
        dataType:'json',
        success: function (data) {
            var data = data;
            if(data && data.Data.Label){
                Index._data = {};
                data.Data.Label.CityName = param.cityName;
                data.Data.Label.NavigationBar.CityName = param.cityName;
                Common.render({
                    key:'NavigationBar',
                    tpl:cityListTmpl,
                    data: data.Data.Label,
                    overwrite:true,
                    context: '.J_citylistbox',
                    callback:function(){
                        Index.hotList();
                    }
                });
                Common.render({
                    key:'SlideBar',
                    tpl:sliderTmpl,
                    data:data.Data.Label.MasterSlide,
                    overwrite:true,
                    context: '.sliderbox',
                    callback: function () {
                        Carousel('.sliderbox', {
                            auto: 5000,
                            visible: 1,
                            circular: true,
                            vertical: false,
                            triggerType: 'mouseover',
                            preload: 1,
                            btnNav: true
                        });
                    }
                });
                Common.render({
                    key:'carouselSlideBar',
                    tpl:sliderTmpl,
                    data:data.Data.Label.MinorSlide,
                    overwrite:true,
                    context: '.carousel',
                    callback: function () {
                        Carousel(".carousel", {
                            circular: true,
                            visible: 4,
                            preload: 0,
                            btnNav: false,
                            btnPrev: ".left",
                            btnNext: ".right"
                        });
                    }
                });
                Common.render({
                    key:'mainContent',
                    tpl:proModuleTmpl,
                    data:data.Data.Label,
                    overwrite:true,
                    context:'.J_mainContent'
                });
                Common.render({
                    key:'themePro',
                    tpl:holeThemeProTmpl,
                    data:data.Data.ThemeProduct.ProductList,
                    overwrite:true,
                    context:'#J_theme_proList'
                });
                Common.render({
                    key:'jijiuPro',
                    tpl:holeJijiuProTmpl,
                    data:data.Data,
                    overwrite:true,
                    context:'#J_Tpackage_prolist'
                });
                Common.render({
                    key:'shortPro',
                    tpl:holeShortProTmpl,
                    data:data.Data,
                    overwrite:true,
                    context:'#J_short_proList'
                });
                Common.render({
                    key:'longPro',
                    tpl:holeLongProTmpl,
                    data:data.Data,
                    overwrite:true,
                    context:'#J_long_proList'
                });
                Common.render({
                    key:'btnContent',
                    tpl:btnContentTmpl,
                    data:data.Data.Label,
                    overwrite:true,
                    context:'.J_gonglue'
                });
                Index.lazyLoad();
            }
        }
    });
    $('#Startcityid').val(param.cityId);
    $('#Startcityname').val(param.cityName);
};

//把出发城市信息记录到cookie
Index.setCookies = function(config){
    var cityId = config.scId,
        cityName = config.cityName;
    $.cookie('indexStartCity',cityId,{expires:1,path:"/",domain:".ly.com"});
    $.cookie('startCityName',cityName,{expires:1,path:"/",domain:".ly.com"});
};
Index.carousel = function (param) {
    var config = {
        circular: true,
        visible: 4,
        preload: 0,
        btnNav: false,
        btnPrev: ".left",
        btnNext: ".right"
    };
    $.extend(config, param);
    Carousel(".carousel", config);

    Carousel('.sliderbox', {
        auto: 5000,
        visible: 1,
        circular: true,
        vertical: false,
        triggerType: 'mouseover',
        preload: 1,
        btnNav: true
    });
};
//右侧通栏部分
Index.getUser = function () {
    var loginInfo = $.cookie("us"),
        userid;
    if (loginInfo) {
        userid = /userid=(\d+)/i.exec(loginInfo);
        userid = userid ? userid[1] : userid;
    }
    return userid;
};
Index.slider = function(){
    var userid = Index.getUser();
    var slider = new Slidertoolbar({
        header: {
            icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
            tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/11/01/10/UL8ID0.jpg"></a>'
        },
        topMenu: [{
            icon: '<a href="http://member.ly.com/center"><div class="ico c-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
            }, {
                icon: '<a href="http://member.ly.com/center/favorites"><div class="ico c-3"></div></a>',
                tooltips: '<a href="http://member.ly.com/center/favorites"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="//livechat.ly.com/out/guest?p=2&c=2"><span class="ico-title">在线客服<i></i></span></a>',
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
        pageName: "出境首页",
        toTop: true,
        skin:'skin2'
    })
    if (userid) {
        slider.resetMenu({
            icon: '<a href="http://member.ly.com/center"><div class="ico c-1-1"></div></a>',
            tooltips: '<a href="http://member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
            arrow: false
        }, 'top', 0);
    }
};
/*底部横屏弹窗 */
Index.crossScreen = function(){
    $(".bonus_box .close").on("click", function() {
        $(".bonus_bg,.bonus_box").animate({left:"-100%"}, 800, function() {
            $(".bonus_box").addClass("none");
            $(".J_asideTag").removeClass("none").animate({left:"0px"}, 200);
        });
    });
    $(".J_asideTag").on("click", function() {
        var _width = $(this).width();
        $(".J_asideTag").animate({left:-'" + _width + "px'}, 200, function() {
            $(".bonus_bg,.bonus_box").removeClass("none").animate({left:"0%"}, 800);
            $(".J_asideTag").animate({left:"0px"}, 200).addClass("none");
        });
    });
}
module.exports = Index;