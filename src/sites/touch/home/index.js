(function() {
    var Common = require("modules-touch/common/index"),
        Iscroll = require("modules-touch/utils/iscroll/index"),
        tmplList = {},
        depCity = require("modules-touch/themeCity/dep"),
        Timer = require("modules-touch/timer/index");
    require("modules-touch/utils/lazyload/index");
    require("modules-touch/utils/location/index");
    require("modules-touch/timer/index");
    require("modules-touch/slider/slider");
    require("modules-touch/autoComplete/index");
    tmplList.temai = require("./views/temai.dot");
    tmplList.list = require("./views/list.dot");
    var sliderTmpl = require("./views/slider.dot");
    var cityStartId = $("#PositionCityId").val()||"321",
        cityStartName = $("#PositionCityName").val()||"上海",
        _index = 0;
    var sendData = {}, dataLoader;
    var Index = {
        loadingCfg: {
            loading: '<span>正在努力游入</span>'
        },
        thisCfg: {
            pageNum: 1,
            newKeyword: $(".J_listTabS").not(".none").find(".active").html(),
            scId: cityStartId,
            lcCity: cityStartId,
            prop: $(".listTab span.active").attr("data-type")
        },
        init: function() {
            var self = this;
            Common.pages.push({
                "tag": "main",
                "url": location.href,
                "title": $(".page-header h2").text()
            });
            self.initEve();
            //根据城市id更换silde
            self.setTopSlider(cityStartId);
            self.getTemai();
            self.getList();
            self.scrollLoad();
            //定位城市
            page.init();
            self.changeHotCityUrl(cityStartName);
            sessionStorage.setItem("beginCity", cityStartName);
            self.initScroll();
            self.initTravelType();
        },
        initScroll: function () {
            //切换导航吸顶
            var self=this,
                $body = $('body'),
                $obj = $('.goodline');

            window.onscroll = function () {
                if (self.ischanging) {
                    return;
                }
                var btop = $body.scrollTop();
                var tabtop = $obj.offset().top;
                if (btop > tabtop && $(".J_ListArea").length > 5) {
                    $obj.addClass('activeTab');
                }
                else {
                    $obj.removeClass('activeTab');
                }
            }
        },
        initEve: function () {
            var self = this,
                cityDujia = {
                    cityIdPre:cityStartId,
                    cityNamePre:cityStartName
                };
            // 点击关闭头部广告
            Common.resetTopHeight();
            // 幻灯
            $(".TabSlider").slider({
                loop: false,
                autoScroll: false
            });
            //切换大区
            $(document).on("click",".destSlideBox .destTab_sBox",function() {
                var elem = $(this),
                    elemIndex = elem.index()-1;

                $(".destSlideBox .destTab_sBox").removeClass('active');
                elem.addClass('active');
                $(".J_destCitys").addClass('none');
                $($(".J_destCitys")[elemIndex]).removeClass('none');
            });
            //下面四个的切换
            $(document).on("click",".listTab span",function() {
                var elem = $(this);
                var index = elem.index();

                $(".listTab span").removeClass('active');
                elem.addClass('active');

                $(".listTabSbox").addClass('none');
                $(".listTabSbox").eq(index).removeClass('none');
                _index = index;
                var prop = elem.attr("data-type"), param = {};
                param.pageNum = 1;
                param.newKeyword = $(".listTabSbox").eq(index).find(".active").html();
                param.prop = prop == 0 ? "" : prop;
                $(".goodline ul").append('<div class="data-loader">' + self.loadingCfg.loading + '</div>');
                self.getList(param);
            });
            //四大类切换下的小滑动标签的切换，保证在当前的大类下面切换，不会影响其他小类
            $(document).on("click",".J_listTabS span",function() {
                var elem = $(this),
                    index = elem.index();
                var allList = $($(".J_listTabS")[_index]).find("span");
                allList.removeClass('active');
                elem.addClass('active');

                var prop = $(".listTab span.active").attr("data-type"),
                    param = {};
                param.newKeyword = elem.html();
                param.prop = prop == 0 ? "" : prop;
                param.pageNum = 1;
                $(".goodline ul").append('<div class="data-loader">' + self.loadingCfg.loading + '</div>');
                self.getList(param);
            });
            //切换城市
            $(document).on("click", ".searchcon span", function() {
                var elem = this;
                if (Common.pages.length < 1) {
                    Common.pages.push({
                        "tag": "main",
                        "url": location.href,
                        "title": $(".page-header h2").text()
                    });
                }
                Common.redirect({
                    tag: "depCity",
                    title: "出发城市",
                    callback: function() {
                        window.scrollTo(0, 0);
                    }
                });
                depCity.init({
                    el: "#depCityPage",
                    cfg:cityDujia,
                    itemClick: function(cityName, cityid) {
                        var cityStartName = cityName.substring(0,5);
                        if(cityStartName.length>4){
                            cityStartName = cityStartName + '...';
                        }
                        localStorage.ivDepAddress = cityName;
                        $(elem).html('<em><i></i>' + cityStartName + '</em>');
                        var param = {};
                        param.lcCity = cityid;
                        param.scId = cityid;
                        param.pageNum = 1;
                        self.setTopSlider(cityid);
                        self.changeHotCityUrl(cityName);
                        $(".goodline ul").append('<div class="data-loader">' + self.loadingCfg.loading + '</div>');
                        Common.backPage(function() {
                            self.getList(param);
                        });
                    }
                });
                Common.resetAdver();
            });
        },
        lazyLoad: function () {
            $(".msItemT img").each(function(index, item) {
                var imgUrl = Common.setImageSize($(item).attr("data-img"), "172x172");
                $(item).attr("src", imgUrl);
            });
        },
        setTopSlider: function (cityid) {
            var self = this;
            $("#topSlider").html("");
            $.ajax({
                url: "//m.ly.com/dujia/chujingdata/gethomeslide?count=4&BeginCityId=" + cityid,
                dataType: "jsonp",
                success: function(data) {
                    if (data && data.Slides.SlideList.length > 0) {
                        $("#topSlider").html(sliderTmpl(data.Slides.SlideList));

                        $("#topSlider img").each(function(index, item) {
                            var imgUrl = Common.setImageSize($(item).attr("data-img"), "600x300");
                            $(item).attr("data-img", imgUrl);
                        }).lazyload({
                            data_attribute: "img",
                            css: {
                                opacity: 0
                            },
                            container: "#mainPage",
                            effect: 'fadeIn',
                            event: 'slide'
                        });
                        $("#topSlider").slider({
                            loop: true,
                            fn: function () {
                                $("#topSlider img").not("[data-img-loaded]").trigger('slide');
                            }
                        });
                        //统计模块参数添加
                        window.SPM_MODULE && SPM_MODULE.eventBind();
                    }
                }
            });
        },
        initTimer: function () {
            var cfg = [{
                "tmpl": "距开始<span>{hour}</span>:<span>{minute}</span>:<span>{second}</span>",
                callback: function(el, index) {}
            }, {
                "tmpl": '还剩<span>{hour}</span>:<span>{minute}</span>:<span>{second}</span>',
                callback: function(el, index) {}
            }, {
                "tmpl": '已抢光',
                callback: function(el, index) {}
            }];
            Timer.init({
                el: ".miaosha-time",
                cfg: cfg,
                afterFunc: function() {
                    var _date, dataTime, startTime;
                    _date = new Date(Timer.__client_time__);
                    dataTime = $(".miaosha-time").attr("data-time");
                    startTime = dataTime.split("|")[0];
                    startTime = Date.parse(startTime);
                    _date.setTime(startTime);
                    var label = _date.getHours();
                    var newlabelMinutes = _date.getMinutes();
                    var labelTxt = label + "点开抢...";
                    if (newlabelMinutes > 0) {
                        labelTxt = label + "点" + newlabelMinutes + "分开抢...";
                    }
                    Timer.tmpl = {
                        timeLabel: labelTxt
                    };
                }
            });
        },
        //特卖模块
        getTemai: function () {
            var self = this,
                url = "//www.ly.com/dujia/AjaxHelper/activityHandler.ashx?type=ACTRESOURCE&pageindex=1&pagesize=2&platForm=3&actid=1362&pid=2411&IsSellOut=1&querytype=0";
            Common.getData(url, function(data) {
                if (data && data.data && data.data.length) {
                    Common.render({
                        key: "temai",
                        data: data,
                        context: ".J_temaiBox",
                        tmpl: tmplList,
                        overwrite: true,
                        callback: function () {
                            self.initTimer();
                            self.lazyLoad();
                        }
                    });
                }
            });
        },
        listLazyLoad: function () {
            $(".J_ListArea img").each(function(index, item) {
                var imgUrl = Common.setImageSize($(item).attr("data-img"), "172x172");
                $(item).attr("data-img", imgUrl);
            });
            if (self.isInit) {
                var imgList = $(".J_ListArea img").not("[data-img-loaded]");
                $("#mainPage").trigger("addElements",imgList);
            } else {
                $(".J_ListArea img").lazyload({
                    data_attribute: "img",
                    css: {
                        opacity: 0
                    },
                    container: "#mainPage",
                    effect: 'fadeIn'
                });
                self.isInit = true;
            }
        },
        getList: function(cfg, type) {
            var self = this;
            self.thisCfg = $.extend(self.thisCfg, cfg||{});
            if (self.thisCfg.newKeyword == "不限") {
                self.thisCfg.newKeyword = "";
            }
            var url = "/intervacation/searchproduct?type=intervacation&channelId=432&count=10&toLpCity=1&isTpackage=0&stat=&sort=touchComprehensiveSort:desc";
            $(".data-loader").css("display","block").html(self.loadingCfg.loading);
            self.isLoading = true;
            $.ajax({
                url: url,
                data: self.thisCfg,
                dataType: "json",
                success: function(data) {
                    var responseData = data ? data.response : [];
                    if (responseData[0] && responseData[0].totalCount > 0) {
                        var md = responseData[0];
                        self.loadingCfg.totalPage = Math.ceil(md.totalCount / 10);
                        self.loadingCfg.pageNum = self.thisCfg.pageNum - 0;
                        //如果请求失败/请求无结果
                        if (md.lineList) {
                            $(".data-loader").remove();
                            Common.render({
                                key: "list",
                                data: md,
                                context: ".goodline ul",
                                tmpl: tmplList,
                                overwrite: (type == false) ? false : true,
                                callback: function () {
                                    self.isLoading = false;
                                    self.listLazyLoad();
                                }
                            });
                            
                        }
                    }
                }
            });
        },
        /**
         * 加载更多的列表数据,滚动时触发
         * @param callback
         */
        loadListData: function(callback){
            var self = this,
                pageIndex = self.loadingCfg.pageNum;
            if(++pageIndex<=self.loadingCfg.totalPage && pageIndex < 3){
                $(".goodline ul").append('<div class="data-loader">' + self.loadingCfg.loading + '</div>');
                var cfg = {pageNum:pageIndex};
                self.getList(cfg, false);
            }else{
                callback.call(self);
            }
        },
        /**
         * 绑定滚动加载数据事件
         */
        scrollLoad: function(){
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
                    self.loadingCfg.totalPage>self.loadingCfg.pageNum){
                    self.isLoading = true;

                    $(".data-loader").css("display","block")
                        .html(self.loadingCfg.loading);
                    self.loadListData(function(){
                        if(self.loadingCfg.totalPage<self.loadingCfg.pageNum){
                            self.isLoaded = true;
                            return;
                        }
                        self.isLoading = false;
                    });
                }
                e.stopPropagation();
            });
        },
        changeHotCityUrl: function(beginCity) {
            $(".destTab .J_destCitys a").each(function() {
                //改变切换目的地标签的href中的出发地
                var href = $(this).attr("href");
                if(href.indexOf("/dujia/all")<0){
                    $(this).attr("href", href.replace(/dujia\/([^/]+)/, "dujia/" + beginCity));
                }
            });
            sessionStorage.setItem("beginCity", beginCity);
        },
        initTravelType: function () {
            var isFree = /freetour/.test(window.location.href);
            if (isFree) {
                $(".tabs-li li:last").click();
            }
        }
    };
    module.exports = Index;
})(Zepto);