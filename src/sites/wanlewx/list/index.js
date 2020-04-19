/**
 * @author 范欣(fx6698@ly.com)
 * @module  列表页
 * @exports List
 * @desc
 * 列表页的模块
 */
/* global Config */
(function($){
    var tpl={};
    tpl.list= require("./ajaxdot/list.dot");
    tpl.noResult=require("./ajaxdot/noResult.dot");
    tpl.dest=require("./ajaxdot/dest.dot");
    tpl.backdest=require("./ajaxdot/backdest.dot");
    var List = {"isInit" : true},
        _config,
        Common = require("/modules-lite/common/index"),
        tplList = tpl,
        destCityId = Common.getQueryString("dcId"),
        startCityId = Common.getQueryString("scId"),
        look = Common.getQueryString("dsf"),
        sourceId;
    _config = {
        dcId : destCityId,
        scId : startCityId,
        dsf : look
    };

    var funObj = {
        getParamStr: function (joinChar) {
            var jc = joinChar || '&';
            var arr = [];
            for (var i in this) {
                if (this.hasOwnProperty(i) && (typeof this[i] == "string" || typeof this[i] == "number") && this[i] != "") {
                    arr.push(i + "=" + this[i]);
                }
            }
            return arr.join(jc);
        },
        getParamArr: function () {
            var arr = [];
            for (var i in this) {
                if (this.hasOwnProperty(i) && (typeof this[i] == "string" || typeof this[i] == "number")) {
                    arr.push(i + "=" + this[i]);
                }
            }
            return arr;
        }
    };

    //顶部tab跳转
    List.BindTabChange = function () {
        $(".J-tab a").on("click", function () {
            var index = $(this).attr("data-index");
            var url = window.location.href;
            var replaceText = 'sourceId=';  //定义参数修改后的值
            if (index == 9) {
                replaceText += 0;
            } else {
                replaceText += 1;
            }
            /*使用正则替换字符*/
            var tmp = '/(sourceId=)([^&]*)/gi',
                Newurl = url.replace(eval(tmp), replaceText);
            window.location.href = Newurl;
        });

        var line_type = window.location.href.split("sourceId=")[1];
        if (line_type == 0) {                   //wifi
            $(".J-tab a").removeClass("active");
            $(".J-tab a").eq(1).addClass("active");
            $(".type_wifi").removeClass("none");
            $(".type_wanle").addClass("none");
        } else if (line_type == 1) {
            $(".J-tab a").removeClass("active");
            $(".J-tab a").eq(0).addClass("active");
            $(".type_wifi").addClass("none");
            $(".type_wanle").removeClass("none");
        }
    }
    //底部筛选逻辑
    List.showChoose = function () {
        $(".tab_screen > ul li").on("click", function () {
            var self = $(this),
                type = self.attr("data-sort"),
                eleCon = $(".dialog_" + type);
            $(".dialog_dest").css({"height": "26rem", "bottom": 0});
            $(".dialog_dest_wifi").css({"height": "26rem", "bottom": 0});
            $(".dialog_sort").css({"height": "20rem", "bottom": 0});
            $(".dialog_filter").css({"height": "22rem", "bottom": 0});
            eleCon.removeClass("none");
            List.createMask();
        });
       
    };
    //选择目的地
    List.getDest = function (cfg, callback, flag) {

        if(sourceId == 0){
            type = '61032';
        } else {
            type = '61031';
        }

        //config列表页目的地
        Common.getData("/wanle/api/WWanleProduct/GetIndexDestination?siteType=1&" +'Platment='+ type + decodeURIComponent(funObj.getParamStr.call(_config)),function(data){
            data.sourceId = sourceId;
            Common.render({
                key: "dest",
                data: data,
                context: ".dialog_dest .J-dest.destplace",
                tmpl: tplList,
                overwrite: flag,
                callback: function () {
                    // console.log(123)
                }
            });
        }, true);

    };
    
    //取还机点
    List.getBackDest = function (cfg, callback, flag) {
        Common.getData("/intervacation/searchproduct?type=wanle&count=10&stat=singleType,receiveType,takeCityId,terminalId&singleType=9&newChannelId=433&statAll=true&terminalId=&takeCityId=&receiveType=&callback=jsonp2" + decodeURIComponent(funObj.getParamStr.call(_config)),function(data){
            data.sourceId = sourceId;
            Common.render({
                key: "backdest",
                data: data,
                context: ".dialog_dest_wifi .J-dest.backplace",
                tmpl: tplList,
                overwrite: flag,
                callback: function () {
                    // console.log(333)
                }
            });
        }, true);
    };

    List.destBind = function (cfg) {

        $(".J-dest").delegate(".J-left li", "click", function () {

            var parent = $(".J-dest"),
                left = $(this).parents(".J-left"),
                center = parent.find(".J-center"),
                CurCenter = left.siblings(".J-center");
            if (!$(this).hasClass("select")) {
                parent.find(".J-left li").removeClass("select");
                $(this).addClass("select");
            }

            if (CurCenter.find("ul li").length == 0) {
                center.addClass("none");
                left.siblings(".J-right").css("border", "none");
                left.siblings(".J-right").css("left", "120px");

            } else {
                center.addClass("none");
                parent.find(".J-right").addClass("none");
                CurCenter.removeClass("none");
            }

            parent.find(".J-right").addClass("none");
            left.siblings(".J-right").removeClass("none");

            $(".J-center li").each(function () {
                if ($(this).text() == "undefined") {
                    $(this).remove();
                }
            })
        });

        $(".J-dest").delegate(".J-center li", "click", function () {
            var parents = $(this).parents(".J-dest"),
                arrID = $(this).attr("data-id"),
                curLi = $(this).parents(".filter-show"),
                curType = curLi.attr("data-type"),
                curWay = curLi.attr("data-way");
                arrPar = $(this).parents(".J-center").siblings(".J-right");

            parSib = arrPar.children(".city" + arrID);
            if (!$(this).hasClass("select")) {
                $(this).addClass("select");
                $(this).siblings().removeClass("select");
            };
            if(arrPar.length == 0){
                parents.attr("data-id",arrID);
                parents.attr("data-type",curType);
                parents.attr("data-way",curWay);                
            }
            
            $(".dialog_dest").addClass("none");
            // $(".dialog_dest_wifi").addClass("none");
            $(".J_CityMask ").addClass("none");
            $(".dest_sort").addClass("current");
            parSib.removeClass("none");
            parSib.siblings().addClass("none");
            // List.GetCurrentData(cfg);
        });

        $(".J-dest").delegate(".J-right li", "click", function () {

            List.changeType = "/filter";
            var elem = $(".J-dest .J-right li"),
                dest = $(this).html(),
                parents = $(this).parents(".J-dest"),
                curLi = parents.children(".filter-show"),
                curId = $(this).attr("data-id"),
                curPar = curLi.attr("data-type"),
                curWay = curLi.attr("data-way");
            if (!$(this).hasClass("select") && !$(this).hasClass("at")) {
                elem.removeClass("select");
                $(this).addClass("select");
                curLi.find("li").removeClass("at");
                curLi.find(".select").addClass("at");
                parents.attr("data-id",curId);
                parents.attr("data-type",curPar);
                parents.attr("data-way",curWay);
            }

            $(".dialog_dest").addClass("none");
            $(".dialog_dest_wifi").addClass("none");
            $(".J_CityMask ").addClass("none");
            $(".dest_sort").addClass("current");
            $(".dest_sort").find("span").html(dest);


            if (dest.indexOf("全部") == 0) {
                var newDest = dest.replace("全部", "");
                parents.attr("data-dest", newDest);
            } else {
                parents.attr("data-dest", dest);
            }

            var _parents = $(this).parents(".filter-show");
            cfg.destInfo = "";
            if(_parents.attr("data-type")){
                cfg.destInfo = _parents.attr("data-type") + "=" + $(this).attr("data-id") + "&";
            }
            cfg.destInfo = cfg.destInfo +"receiveType="+ _parents.attr("data-way")+"&sort=titleMatchSort:desc,finalScore:desc";
            $(this).parents(".filter-show").attr("data-type");
            List.GetCurrentData(cfg);
        });
    };
    //选择主题
    List.singleType = function (cfg) {
        $(".J-theme").delegate("a", "click", function () {

            List.changeType = "/filter";
            var _self = $(this),
                txt = _self.html(),
                index = _self.attr("data-index"),
                showOutTheme = $(".theme_sort"),
                showInnerTheme = $(".J_choose_wrap li[data-index='" + index + "']");

            var reserve = _self.attr("data-index"),
                advanceDay = _self.attr("data-advanceDay");
            
            if (_self.hasClass("select")) {
                return;
            }
            _self.addClass("select");
            _self.siblings().removeClass("select");
            showOutTheme.find("span").html(txt);
            showOutTheme.addClass("current");
            showInnerTheme.addClass("current");
            showInnerTheme.siblings().removeClass("current");
            //if (sourceId === 0) {
            //    List.isFlash = false;
            //}
            //sourceId = 1;
            //cfg.pagenum = 1;
            cfg.type = index;

            cfg.themeType = _self.attr("data-info");

            List.GetCurrentData(cfg);
        });

        $(".J_choose_wrap li").on("click", function () {
            List.changeType = "/filter";
            var self = $(this),
                index = self.attr("data-index"),
                txt = self.find("span").html(),
                themeType = $(".theme_sort"),
                showInnerTheme = $(".J-theme a[data-index='" + index + "']");
            self.addClass("current");
            self.siblings().removeClass("current");
            showInnerTheme.addClass("select");
            showInnerTheme.siblings().removeClass("select");
            self.parents(".J_choose_wrap").attr("data-type", index);
            if (sourceId === 0) {
                List.isFlash = false;
            }
            sourceId = 1;
            self.parents(".J-sort").addClass("none");
            if (txt == '全部') {
                themeType.find("span").html('全部主题');
                themeType.removeClass("current");
                $(".J-theme").find("a").removeClass("select");
            } else {
                themeType.find("span").html(txt);
                themeType.addClass("current");
            }
            $(".J_CityMask ").addClass("none");
            cfg.type = index;
            List.GetCurrentData(cfg);
        });
    };
    //排序
    List.prolistSort = function (cfg) {
        $(".dialog_sort > ul li").on("click", function () {
            List.changeType = "/sort";
            var self = $(this),
                curRole = self.attr("data-role"),
                curSort = parseInt(self.attr('data-sort')),
                curSort_wifi = self.attr('data-wifi-sort'),
                txt = $(this).find("span").html(),
                elem = $(".default_sort");
            self.addClass("active");
            self.siblings().removeClass("active");
            var parentBox = self.parents(".default_show");
            parentBox.attr("data-role", curRole);
            parentBox.attr("data-sort", curSort);
            parentBox.attr("data-wifi-sort", curSort_wifi);
            // self.parents(".J-sort").addClass("none");
            $(".J-sort").addClass("none");
            if (txt == '默认排序') {
                elem.removeClass("current");
            } else {
                elem.find("span").html(txt);
                elem.addClass("current");
            }
            $(".J_CityMask ").addClass("none");
            List.GetCurrentData(cfg);
        })
    };
    //筛选面板的重置
    List.cancelFliter = function () {
        $(".ctrl-box .reset").each(function () {
            var CurParent = $(this).parents(".ctrl-panel").find(".search_ul[data-id]"),
                CurLi = CurParent.children("li");
            curPar = $(this).parents(".J-right").siblings(".J-left");
            CurParent.attr("data-id", "");

            if (CurLi.hasClass("select")) {
                CurLi.removeClass("select");
                CurParent.find(".search_all").addClass("select");
            }
            $(".filter_lpcity li").each(function () {

                var par = $(this).parent(".filter_lpcity"),
                    sLi = par.children("li.select").not(".search_all"),
                    lpcity = $(".tab_screen").find(".lpcity");
                if (sLi.length <= 0) {
                    lpcity.removeClass("current");
                }
                else {
                    lpcity.addClass("current");
                }
            });
            $(".filter_receive li").each(function () {

                var par = $(this).parent(".filter_receive"),
                    sLi = par.children("li.select").not(".search_all"),
                    receiveType = $(".tab_screen").find(".receiveType");
                if (sLi.length <= 0) {
                    receiveType.removeClass("current");
                }
                else {
                    receiveType.addClass("current");
                }
            })
            var isCheck = false;
            $(".filter-show .search_ul").each(function () {
                var _this = $(this).attr("data-id");
                if (_this != "") {
                    isCheck = true;
                    $(".screen").addClass("current");
                    return;
                }
            })
            if (isCheck) {
                $(".screen").addClass("current");
            } else {
                $(".screen").removeClass("current");
            }
        });
    };
    //筛选
    List.profiltrate = function (cfg) {
        $(".tab_screen").delegate(".J-left li", "click", function () {
            List.changeType = "/filter";
            var type = $(this).attr("data-type"),
                content = $(".filter_" + type);
            if (!$(this).hasClass("select")) {
                $(this).addClass("select");
                $(this).siblings().removeClass("select");
            }
            if (content.hasClass("none")) {
                content.siblings().addClass("none");
                content.removeClass("none");
            }
        });
        $(".tab_screen").delegate(".J-right .radio  li", "click", function () {
            var self = $(this),
                id = $(this).attr('data-id'),
                parentBox = self.parents(".search_ul"),
                curPar = self.parents(".J-right").siblings(".J-left");
            parentBox.attr("data-id", id);
            self.parents(".J-filter").children(".J-left").find("select");
            self.siblings().removeClass("select");
            self.addClass("select");
            curPar.find(".select").addClass("at");
        });
        //不限
        $(".tab_screen").delegate(".J-right .search_all", "click", function () {
            var curPar = $(this).parents(".J-right");
            curPar.siblings(".J-left").find(".select").removeClass("at");
            if (!$(this).hasClass("select")) {
                $(this).addClass("select");
                $(this).siblings().removeClass("select");
            }
        });
        //筛选面板的确定点击事件
        $(document).on("click", ".ctrl-box .confirm", function (cfg) {

            List.changeType = "/filter";
            var CurParent = $(this).parents(".ctrl-panel").find(".search_ul[data-id]"),
                parents = $(this).parents(".dialog_filter");

            parents.addClass("none");
            $(".J_CityMask ").addClass("none");

            $(".filter_lpcity li").each(function () {

                var par = $(this).parent(".filter_lpcity"),
                    sLi = par.children("li.select").not(".search_all"),
                    lpcity = $(".tab_screen").find(".lpcity");
                if (sLi.length > 0) {
                    lpcity.addClass("current");
                }
                else {
                    lpcity.removeClass("current");
                }
            });
            $(".filter_receive li").each(function () {

                var par = $(this).parent(".filter_receive"),
                    sLi = par.children("li.select").not(".search_all"),
                    receiveType = $(".tab_screen").find(".receiveType");
                if (sLi.length > 0) {
                    receiveType.addClass("current");
                }
                else {
                    receiveType.removeClass("current");
                }
            })
            var isCheck = false;
            $(".filter-show .search_ul").each(function () {
                var _this = $(this).attr("data-id");
                if (_this != "") {
                    isCheck = true;
                    $(".screen").addClass("current");
                    return;
                }
            })
            if (isCheck) {
                $(".screen").addClass("current");
            } else {
                $(".screen").removeClass("current");
            }
            var cfg = List.cfgInit;
            List.GetCurrentData(cfg);
        });
        //重置
        $(document).on("click", ".ctrl-box .reset", function () {

            List.changeType = "/filter";
            List.cancelFliter();
        });
        //筛选面板的取消
        $(document).on("click", ".ctrl-box .cancel", function () {
            List.changeType = "/filter";
            var parents = $(this).parents(".dialog_filter"),
                CurParent = parents.find(".search_ul[data-id]");
            List.cancelFliter();

            parents.addClass("none");
            $(".J_CityMask ").addClass("none");
            List.GetCurrentData(cfg);
        });
    };
    //多选样式
    List.BindMultiSelect = function () {
        $(".tab_screen").delegate(".J-right .allowed  li", "click", function () {
            List.changeType = "/filter";
            var parentBox = $(this).parents(".search_ul"),
                curPar = $(this).parents(".J-right").siblings(".J-left");

            if ($(this).hasClass("select")) {
                $(this).removeClass("select");
            } else {
                $(this).addClass("select");
            }

            curPar.find(".select").addClass("at");
            if ($(this).hasClass("search_all")) {
                $(this).siblings().removeClass("select");
            } else {
                parentBox.children(".search_all").removeClass("select")
            }
            List.GetMultiSelecIds(parentBox);
        });
    };
    //多选取值
    List.GetMultiSelecIds = function (that) {
        var arr = [];
        $(that).find("li").each(function () {
            if ($(this).hasClass('select')) {
                var cuId = $(this).attr('data-id');
                arr.push(cuId);
            }
        });
        $(that).attr('data-id', arr.join(','));

        var dt = $(that).find("li");
        if (!dt.hasClass("select")) {
            $(that).attr("data-id");
            $(that).find(".search_all").addClass("select");
        }
    };
    //遮罩
    List.createMask = function () {
        var mask = $(".J_CityMask");
        if (mask.length > 0) {
            mask.removeClass("none");
        } else {
            $("body").append('<div class="J_CityMask mask"></div>');
            $(".J_CityMask").on("click", function () {
                $(".J-sort").addClass("none");
                $(this).addClass("none");
                $(".tab-screen .active-tab").removeClass("active-tab");
            });
        }
    };
    //返回筛选
    List.backChoose = function () {
        $("button").on("click", function () {
            if(sourceId == 0){
                window.location.href = '/localfun/citylist?source=0';
            } else {
                window.location.href = '/localfun/citylist?source=1';
            }
        });
    };
    List.scrollLoad = function (cfg) {
        var _cfg = cfg,
            diff = 30;
        $(window).on("scroll", function (e) {
            List.changeType = "/page";
            if (List.isScrollFlag) {
                List.isScrollFlag = false;
                return;
            }
            //if (List._isLastPage) {
            //    return;
            //}
            var scrollElem = $(this),
                self = List,
                dataLoader = $(".J_load");
            if (List._isLastPage && !$(".include-no-result").length) {
                dataLoader.removeClass("none").html(cfg.nomore);
            }
            if (List.isLoading || List._isLastPage) {
                return;
            }
            if (!self.isLoading && !self.isLoaded &&
                scrollElem.scrollTop() + diff >= $(document).height() - scrollElem.height()) {
                dataLoader.removeClass("none").html(cfg.loading);
                self.isLoading = true;
                _cfg.pagenum++;

                List.GetCurrentData(cfg, true);
            }
            e.stopPropagation();
        });
        List.initScrollEvent();
    };
    //底部显示隐藏
    List.initScrollEvent = function () {
        var listElem = $(".J_pro_lists"),
            tabHeight = listElem.offset().top - 41,
            lastScrollTop, scrollT;

        $(window).on("touchend touchmove scroll", function () {
            var scrollElem = $(this),
                jmask = $(".mask");
            if (jmask.length === 0 || jmask.hasClass("none")) {
                if (lastScrollTop) {
                    if (lastScrollTop < document.body.scrollTop) {
                        //往下
                        // $(".nav").addClass("none");
                    } else if (lastScrollTop > document.body.scrollTop) {
                        //往上
                        if ($(".page").hasClass("current")) {
                            // $(".nav").addClass("none");
                        } else {
                            // $(".nav").removeClass("none");
                        }
                    }
                }
                lastScrollTop = document.body.scrollTop;
                window.clearTimeout(scrollT);
                scrollT = window.setTimeout(function () {
                    if ($(".page").hasClass("current")) {
                        // $(".tab_screen").addClass("none");
                    } else {
                        // $(".tab_screen").removeClass("none");
                    }
                }, 800);
            }
        });
    };
    List.isLastPage = function (data, cfg) {
        (sourceId)
        if (sourceId == 1 && data.ProductList && data.ProductList.length === cfg.count) {
            return false;
        }
        if(sourceId == 0 && data.lineList && data.lineList[0].line.length === 20){
             return false;
        }

        return true;
    };
    //获取当前异步等数据
    List.GetCurrentData = function (cfg, flag) {

        var dest = $(".J-dest").attr("data-dest") || "",
            typeElem = $(".J_choose_wrap li"),
            singletype = typeElem.length ? typeElem.attr("data-type") || $(typeElem[0]).attr("data-index") : 9,
            themeId = "",
            role = $(".default_show").attr("data-role"),
            stp = (role != "" && role != null) ? role : 'recommend';
            // sort = $(".default_show").attr("data-sort") || "";
        var sort = "";
        if(sourceId != 0){
            sort = $(".default_show").attr("data-sort") || "";
        }else{
            sort = $(".default_show").attr("data-wifi-sort") || "";
        }    

        var theme = $(".J-theme a");

        if(sourceId != 0 && typeElem.length){
            if(!(theme.hasClass("select"))){
                singletype = typeElem.attr("data-type") || $(typeElem[0]).attr("data-index");
            } else {
                singletype = $(".J-theme").find(".select").attr("data-index");
            }
        } else {
            themeId = $(".J-theme").find(".select").attr("data-index");
            //if(!(theme.hasClass("select"))){
            //    singletype = 9;
            //}
            
        }
        var search = {
            minPrice: "",
            maxPrice: "",
            receiveType: "",
            lpCity: "",
            language: ""
        }
        $(".dialog_filter .search_ul").each(function () {
            var mark = $(this).attr("data-mark");
            if (mark == "price") {
                var id = $(this).attr('data-id') || "";
                if (id != "") {
                    var idsArr = id.split(',');
                    search.minPrice = idsArr[0];
                    search.maxPrice = idsArr[1];
                }
            } else if (mark == "lpcity") {
                search.lpCity = $(this).attr('data-id') || "";
            } else if (mark == "receive") {
                search.receiveType = $(this).attr('data-id') || "";
            } else {
                search.language = $(this).attr('data-id') || "";
            }
        });

        if(sourceId == 0){
            var parentBig = $(".J-wifiBox");
            themeId = $(".J-theme").find(".select").attr("data-index");
            cfg.getWay = parentBig.attr("data-type");
            cfg.getWayId = parentBig.attr("data-id");
            cfg.receiveType = parentBig.attr("data-way") || "";
        } else {
            cfg.receiveType = search.receiveType;
        }

        if (!flag) {
            cfg.pagenum = 1;
        }
        cfg.minPrice = search.minPrice;
        cfg.maxPrice = search.maxPrice;
        cfg.lpCity = search.lpCity;
        cfg.singleLanguage = search.language;
        
        //cfg.themeId = themeId;
        cfg.singleCategoryId = themeId;
        cfg.type = singletype;
        cfg.stp = stp;
        cfg.sort = sort;
        cfg.keyword = dest;


        List.getProList(cfg, function () {
            self.isLoading = false;
            List._isLastPage && !$(".include-no-result").length && $(".J_load").html(cfg.nomore).removeClass("none");
        }, !flag);
    };
    //count每页条数
    //pagenum页码
    //stp排序的种类，比如“推荐【recommend】,"价格【price】”
    //singleType玩乐主题
    //渲染的时候是否重新填充
    //sort价格排序，0是向上，1是向下
    List.getProList = function (cfg, callback, flag) {
        var destName=$("#destName").val();
        if(destName == "全部"){
            $("#destName").val("");
        }
        _config = {
            // "count": List.count,
            "pagenum": cfg.pagenum,
            "lpCity": cfg.lpCity,
            "singleLanguage": cfg.singleLanguage,
            "minPrice": cfg.minPrice,
            "maxPrice": cfg.maxPrice,
            //"themeId": cfg.themeId ,
            "singleCategoryId":cfg.singleCategoryId,
            "stp": cfg.stp,
            "sort": cfg.sort,
            "keyword": cfg.keyword || $("#destName").val(),
        };
        // console.log(_config);
        if(sourceId == 0){           
             var start = (cfg.pagenum -1) * 20 +1;
             cfg.destInfo = cfg.destInfo || "";
             cfg.themeType = cfg.themeType || "";

            var url = "/intervacation/searchproduct?type=wanle&count=20&start="+start+"&singleType=9&newChannelId=433&statAll=true&stat=singleType,receiveType,takeCityId,terminalId&"+cfg.destInfo+"&"+cfg.themeType + "&"+decodeURIComponent(funObj.getParamStr.call(_config));
        } else {
            _config.receiveType = cfg.receiveType;
            _config.singleType = cfg.type;
            _config.count = List.count;
            var url = "/wanle/api/WWanleProduct/GetWanleSearchList?siteType=1&pageType=12&" + decodeURIComponent(funObj.getParamStr.call(_config));
        }

        var dataLoader = $(".data-loader"),
            key;
        if (flag === "" || flag === undefined) {
            flag = true;
        }

        List.isLoading = true;
        dataLoader.removeClass("none").html(cfg.loading);
        Common.getData(url, function (data) {

            data = sourceId == 0 ? data.response[0] : data.Data;
            // data = data.Data;
            List.isLastPage(data, cfg) ? List._isLastPage = true : List._isLastPage = false;
            if (flag === true && data.ProductList && data.ProductList.length <= 0) {
                key = "noResult";
            } else {
                key = "list";
            }
            data.sourceId = sourceId;
            data.destName = $("#destName").val();
            if (!List.isFlash) {
                if (sourceId === 0) {
                    var _parent = $(".J_choose_wrap");
                    _parent.find("li").removeClass("current");
                    _parent.find("[data-index='9']").addClass("current");
                    $("nav li:last-child").addClass("current");
                }
                List.singleType(cfg);
                List.isFlash = true;
                if($(".theme").find("a").length == 0){
                    $(".theme").css("padding","0");
                    $(".pro-lists").css({"background":"none","padding-top":"0"});
                }
                List.CurSingleType();
            }
            Common.render({
                key: key,
                data: data,
                context: ".J_pro_lists",
                tmpl: tplList,
                overwrite: flag,
                callback: function () {
                    var noResultBtn = $(".no-result");
                    if (List.isInit) {
                        var imgList = $(".J_pro_lists img").not("[data-img-loaded]");
                        $(".J_pro_lists").trigger("addElements", imgList);
                        if (key === "noResult" && !List._noResult) {
                            noResultBtn.find("button").css("display", "block");
                        }
                    } else {
                        List.lazyLoad();
                        if (key === "noResult" && sourceId === 1) {
                            List._noResult = true;
                            List._isLastPage = false;
                            List.isLoading = false;
                        } else if (key === "noResult" && sourceId === 0) {
                            List._isLastPage = false;
                            List.isLoading = false;
                            noResultBtn.find("button").css("display", "block");
                            noResultBtn.find("p").html("您筛选的内容暂时没有产品，您可以点开筛选重新选择");
                            $(".J_choose_wrap").append('<li data-index="9" class="current">通讯工具</li>');
                        }
                    }
                    if (key === "list" && !List._isLastPage) {
                        $(".J_load").removeClass("none").html(cfg.loading);
                    }
                    List.backChoose(_config);
                    List.isInit = true;
                    List.isLoading = false;
                    callback && callback();
                    if (key === "noResult") {
                        $(".J_load").addClass("none");
                    }

                    if(List.changeType == "/page"){
                        _tcTraObj._tcTrackEvent("search", List.pageLabel, List.changeType, "|*|k:"+$("#destName").val()+"|*|page:"+cfg.pagenum+"|*|");
                    } else {
                        if(List.changeType == undefined || List.changeType == null || List.changeType == ""){
                            _tcTraObj._tcTrackEvent("search", List.pageLabel, "/show", "|*|k:"+$("#destName").val()+"|*|");
                        }else{
                            _tcTraObj._tcTrackEvent("search", List.pageLabel, List.changeType, "|*|k:"+$("#destName").val()+"|*|");
                        }

                    }

                }
            });
        });
    };
    List.getFiletr = function (cfg, callback, flag) {
        if (sourceId == 0) {
            $(".lpcity").on("click", function () {
                $(".dialog_filter .J-left li").each(function () {
                    var self = $(this).attr("data-type");
                    if (self == 'lpcity') {
                        $(this).click();
                    }
                });
                $(".dialog_filter .J-left li").css("display", "none");
            });
            $(".receiveType").on("click", function () {
                $(".dialog_filter .J-left li").each(function () {
                    var self = $(this).attr("data-type");
                    if (self == 'receive') {
                        $(this).click();
                    }
                });
                $(".dialog_filter .J-left li").css("display", "none");
            });

        }
    };
    //首次进入页面区分当前游玩品类
    List.CurSingleType = function(){
        var CurType = $("#singleType").val();
        var CurA = $(".J-theme").find("a[data-index='"+CurType+"']");
        CurA.click();
    };
    //懒加载
    List.lazyLoad = function () {
        $(".J_pro_lists img").lazyload({
            "css": {opacity: 0},
            "effect": 'fadeIn'
        });
    };
    List.getSource = function (cfg) {
        //约定sourceId为0，表示产品来自wifi页面
        sourceId = parseInt(Common.getQueryString("sourceId"));
        var sort = $(".tab-select"),
            sortCon = sort.attr("data-sort");
        if (sourceId === 0) {
            List.cfgInit.type = 9;
            sort.find(".theme_sort").addClass("none");
            sort.find(".screen").addClass("none");
            sort.find(".lpcity").removeClass("none");
            sort.find(".receiveType").removeClass("none");
        } else {
            List.cfgInit.type = "6,8,11,12,13";
        }
    };
    
    List.scrollFn = function(){
        if ($(window).scrollTop() > $(".layout-main").offset().top) {
            $(".J-tab").css({"position": "fixed", "top": "0px"});
        }else{
            $(".J-tab").css({"position": "relative"});
        }
    };

    List.pageLabel = function(){
        function getUrlParam(param) {
            var reg = new RegExp("(^|&)"+ param +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        }
        var sourceId = getUrlParam('sourceId');
        if(sourceId == 0){
            var pageLabel = "/linewanle/wifi/list";
        } else {
            var pageLabel = "/linewanle/list";
        }
        List.pageLabel = pageLabel;
    };

    
    List.init = function (cfg) {
        var self = this;
        List.pageLabel();
        //Mobile.touch($(".J-tab"),46,0);
        List.isScrollFlag = true;
        List.count = cfg.count;  //每页的条数；
        List.cfgInit = cfg;  //初始化的参数
        require("/modules-lite/utils/lazyload/index");
        self.BindTabChange(cfg);
        self.destBind(cfg);
        self.getSource(cfg);
        self.showChoose(cfg);
        self.prolistSort(cfg);
        self.BindMultiSelect(cfg);
        self.getDest(cfg);
        self.getBackDest(cfg);
        self.profiltrate(cfg);
        self.scrollLoad(cfg);
        self.lazyLoad();
        self.singleType(List.cfgInit);
        // self.getProList(cfg, function () {
        //     List._isLastPage && $(".J_load").html(cfg.nomore).removeClass("none");
        // });
        self.getFiletr(cfg);

        if(sourceId == 0){
            var title_name = $("title").html().replace("玩乐","Wifi");
            $("title").html(title_name);
        }else{
            var title_name = $("title").html().replace("Wifi","玩乐");
            $("title").html(title_name);
        }

        Common.goTop();
        var share = require("/modules-lite/utils/share/index");
        share.enable();

        window.onload = function(){
            _tcTraObj._tcTrackEvent("search", List.pageLabel, "/show", "|*|k:"+$("#destName").val()+"|*|");
        }

        var sourceType = window.location.href.split("sourceId=")[1];
        if(sourceType == 0){
            $(".type_wifi").removeClass("none");
            $(".type_wanle").addClass("none");
        }else if(sourceType == 1){
            $(".type_wifi").addClass("none");
            $(".type_wanle").removeClass("none");
        }

        //获取明日时间

        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();

            if( m < 10 ){
                m= "0"+m;
            }
            if(d < 10){
               d= "0"+d;
            }

            return y+"-"+m+"-"+d;
        } 

        var tomorrow_date = ("advanceDay=1&bookDate=" + GetDateStr(1).replace("-","").replace("-",""));

        $(".tommorw_day").attr("data-info",tomorrow_date);
    };
    
    module.exports = List;
    $(window).on("scroll",function(){
        List.scrollFn();
    });
})(Zepto);
