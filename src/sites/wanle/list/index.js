
    var ticketLiTmpl = require("./ajaxdot/ticketList.dot"),
        wifiLiTmpl = require("./ajaxdot/wifiList.dot"),
        wanleLiTmpl = require("./ajaxdot/wanleList.dot"),
        tab = require("./ajaxdot/searchTab.dot"),
        AutoComplete = require("autoComplete/0.1.1/index"),
        dialog = require("dialog/0.2.0/dialog"),
        Slidertoolbar = require("slidertoolbar/0.1.0/index");
    var tmplArr = [ticketLiTmpl, wifiLiTmpl, wanleLiTmpl];
    require("common/0.1.0/index");
    require("lazyload/0.1.0/index");

    var lastAjaxTime;
    var pageConfig = {
        curTabIndex: $("#searchWrap .searchTab>.tab_active").attr('data-index'),  //默认给active
        curTabSelector: ".searchConBox_each_" + this.curTabIndex,
        searchAjaxUrl: $("#repleaceType").val(),
        canChangeTab: 1,
        onePage:$("#onePage").val(),
        twoPage:$("#twoPage").val(),
        threePage:$("#threePage").val()
    };

    var isInit = false;
    var isLpcity = 0;
    var isWifiTab = false;


    var funObj = {
        getParamStr: function (joinChar) {
            var jc = joinChar || '&';
            var arr = [];
            for (var i in this) {
                if (this.hasOwnProperty(i) && (typeof this[i] == "string" || typeof this[i] == "number")) {
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
    var sinPro = {
        init: function (config) {
            this.isInit = true;
            this.isSearchAjax = config.isSearchAjax||0;
            this.AutoComplete(config);
            this.HotProduct();
            this.BindSearchEven();
            this.BindTabChange();
            this.showhide();
            this.LazyLoad();
            this.Rechoose();
            this.BindMultiSelect();
            this.FirstRenderPage();
            this.initTip();
            this.upBlock();
            this.Slider();
            this.QRcode();
            this.ScrollspyBind();
            this.ClixkMore();
            //埋点show事件
            var curBox = $(".searchConBox_each_"+pageConfig.curTabIndex);
            window.onload = function(){
                _tcTraObj._tcTrackEvent("search", sinPro.pageLabel, "/show", "|*|k:"+$("#destName").val()+"|*|rc:"+curBox.find(".pro_total").text()+"|*|")
            };
        },
        //搜索框
        AutoComplete: function (config) {
            var autoComplete = new AutoComplete();
            sinPro.pageLabel = config.pageLabel;
            autoComplete.init({
                showLabel: true,
                checkFlag: true,
                searchContent: $("#txtScenicValue"),
                matchContent: $("#matchContent"),
                matchUrl: $("#matchDest").val(),
                pageLabel: config.pageLabel
            });
        },
        //热销排行榜
        HotProduct: function () {
            $("#J_hot_pro").delegate(".list-box","mouseover",function () {
                var self = $(this);
                $(".hot_pic").css("display", "none");
                $(".hot_title").css("display", "none");
                $(".hot_maintitle").css("display", "block");
                self.find(".hot_pic").css("display", "block");
                self.find(".hot_title").css("display", "block");
                self.find(".hot_maintitle").css("display", "none");
            })
        },
        upBlock:function(){
            //var totalLen = $(".hotproduct .lists-box .list-box").length;
            if(pageConfig.twoPage > 0){
                var oneLen = $(".hotproduct .lists-box .list1").length;
                var twoLen = $(".hotproduct .lists-box .list2").length;
                $(".hotproduct .lists-box .list1").eq(oneLen-1).css("border-bottom","none");
                $(".hotproduct .lists-box .list2").eq(twoLen-1).css("border-bottom","none");
            }
            if(pageConfig.threePage > 0){
                var oneLen = $(".hotproduct .lists-box .list1").length;
                var twoLen = $(".hotproduct .lists-box .list2").length;
                var threeLen = $(".hotproduct .lists-box .list3").length;
                $(".hotproduct .lists-box .list1").eq(oneLen-1).css("border-bottom","none");
                $(".hotproduct .lists-box .list2").eq(twoLen-1).css("border-bottom","none");
                $(".hotproduct .lists-box .list3").eq(threeLen-1).css("border-bottom","none");
            }
            if(pageConfig.onePage > 0){
                var oneLen = $(".hotproduct .lists-box .list1").length;
                $(".hotproduct .lists-box .list1").eq(oneLen-1).css("border-bottom","none");
            }
            $("#J_hot_pro .update").on("click",function(){
                var data_click = parseInt($("#J_hot_pro .update").attr("data-click"))+1;
                var hotPage = 0;
                if(pageConfig.threePage > 0){
                    hotPage = parseInt(data_click%3)+1;
                }else if(pageConfig.twoPage > 0){
                    hotPage = parseInt(data_click%2)+1;
                }else{
                    hotPage = 1;
                }
                sinPro.hotListBlock(hotPage);
                $("#J_hot_pro .update").attr("data-click",data_click);
            });
        },
        hotListBlock:function(hotPage){
            $("#J_hot_pro .list-box").css("display","none");
            $("#J_hot_pro .list"+hotPage).css("display","block");
            $("#J_hot_pro .list"+hotPage+" .hot_pic").css("display","none");
            $("#J_hot_pro .list"+hotPage+" .hot_title").css("display","none");
            $("#J_hot_pro .list"+hotPage+" .hot_maintitle").css("display","block");
            $("#J_hot_pro .list"+hotPage+" .hot_pic").eq(0).css("display","block");
            $("#J_hot_pro .list"+hotPage+" .hot_title").eq(0).css("display","block");
            $("#J_hot_pro .list"+hotPage+" .hot_maintitle").eq(0).css("display","none");
        },
        //不限的重置
        DirectClick: function (curSelector, isSearchAjaxGo) {

            isSearchAjaxGo = isSearchAjaxGo || 1;

            var id = $(curSelector).attr('data-id');
            var parent_dd = $(curSelector).parents('.search_dl');
            parent_dd.attr('data-id', id);
             parent_dd.attr('data-wayid', "");

            var srarchKey = $(parent_dd).attr("data-key");
            if(srarchKey == "lpCity"){
                parent_dd.attr("data-wayid",id);
            }

            parent_dd.find('a').removeClass('on');
            $(curSelector).addClass('on');

            var idsArr = id.split(',');

            if (idsArr.length >= 2 && parent_dd.find(".input-left").length == 1) {
                parent_dd.find(".input-left")[0].value = idsArr[0];
                parent_dd.find(".input-right")[0].value = idsArr[1];
            };
            if (isSearchAjaxGo == 1) {
                sinPro.SearchAjaxGo(pageConfig.curTabIndex);
            };
        },
        //绑定搜索div内事件
        BindSearchEven: function () {

            $("#searchWrap .searchConBox ").delegate(".setParentDirect a", "click", function (e) {

                sinPro.changeType = "/filter";
                $("#aysnPager").find(".current").attr("data-num","1");
                sinPro.DirectClick(this);
            });

            $("#searchWrap .searchConBox ").delegate(".more_even", "click", function (e) {
                var group = $(this).parent().prev();
                var hidden = group.find(':hidden');
                if (hidden.length > 0) {
                    hidden.show();
                    $(this).find('em').text("收起");
                    $(this).addClass("current");
                }
                else {
                    group.children('li:gt(6)').hide();
                    $(this).find('em').text("更多");
                    $(this).removeClass("current");
                }
            });

            //价格范围
            $("#searchWrap .searchConBox").delegate(".price-btn", "click", function (e) {

                sinPro.changeType = "/filter";
                var parent = $(this).parents(".sort_price");

                var leftInput = parent.find(".input-left")[0];
                var rightInput = parent.find(".input-right")[0];

                var leftPrice = leftInput.value;
                leftPrice = parseInt(leftPrice) || 0;

                var rightPrice = rightInput.value;
                rightPrice = parseInt(rightPrice) || 0;

                var min = rightPrice > leftPrice ? leftPrice : rightPrice;
                var max = rightPrice > leftPrice ? rightPrice : leftPrice;
                min = min == 0 ? "" : min;
                max = max == 0 ? "" : max;

                $(this).parents(".search_dl").attr('data-id', min + "," + max);
                leftInput.value = min;
                rightInput.value = max;

                $(this).parents(".search_dl").find('a').removeClass('on');
                var curIndex = $(this).parents('.searchConBox_each').attr('data-conBoxEachIndex');

                sinPro.SearchAjaxGo(curIndex);

            });

            $("#searchWrap .searchConBox").delegate(".input-left,.input-right", "keyup", function (e) {
                $(this).val(parseInt($(this).val()) || "");
            });
            //排序绑定
            $("#searchWrap").delegate(".searchSortBox_a", "click", function (e) {

                sinPro.changeType = "/sort";
                var curIndex = $(this).parents('.searchConBox_each').attr('data-conBoxEachIndex');
                $(this).parents('.searchConBox_each');
                var curRole = $(this).attr('data-role');
                var curSort = parseInt($(this).attr('data-sort'));
                //销量和满意度只 降序
                if($(this).hasClass("other_a")){
                    if($(this).attr("data-isClick") === "1"){
                        $(this).siblings(".other_a").attr("data-isClick",0);
                        return ;
                    } else {
                        $(this).attr("data-isClick",1);
                        $(this).siblings(".other_a").attr("data-isClick",0);
                    }
                    if(curRole == "rate"){
                        var self = $("#J_search").find(".SortBox_a:not([data-role='recommend'])");
                        self.each(function(){
                            var role = $(this).attr("data-role");
                            if($(this).hasClass("current")){
                                if(role=="price"){
                                    if($(this).hasClass('active_down')){
                                        $(this).removeClass('active_down').addClass("icon_down");
                                    }
                                    else if($(this).hasClass('active_up')){
                                        $(this).removeClass('active_up').addClass("icon_up");
                                    }
                                } else {
                                    $(this).removeClass('active_up').addClass("icon_up");
                                }
                            }
                        })
                        $("#J_search .SortBox_a").removeClass("current");
                    }
                }
                else {
                    $(this).siblings(".other_a").attr("data-isClick",0);
                };

                if ($(this).hasClass('active')) {  //如果当前激活  就取反 否则只加样式而已
                    curSort = parseInt(curSort) == 1 ? 0 : 1;
                    $(this).attr('data-sort', curSort);
                };
                if (curSort == 1) {
                    $(this).removeClass('active_down').addClass('active_up');
                } else {
                    $(this).removeClass('active_up').addClass('active_down');
                };
                var parentBox = $(this).parents('.searchSortBox');
                parentBox.attr('data-role', curRole);
                parentBox.attr('data-sort', curSort);

                $(parentBox).removeClass("sort_special");

                $(this).parents('.searchSortBox').find('a:not([data-role=' + curRole + '])').removeClass('active');
                $(this).addClass('active');

                var sortLi = $("#J_search").find(".SortBox_a");
                sortLi.each(function(){
                    var role = $(this).attr("data-role");
                    if(role == curRole){
                        $(this).attr("data-sort",curSort);
                        $(this).addClass("current");
                        $(this).siblings().removeClass("current");
                        var parentSort = $(this).parents('.SortBox_left');
                        parentSort.attr('data-role', curRole);
                        parentSort.attr('data-sort', curSort);

                        if($(this).hasClass("other_a")){
                            if($(this).attr("data-isClick") === "1"){
                                $(this).siblings(".other_a").attr("data-isClick",0);
                                return ;
                            } else {
                                $(this).attr("data-isClick",1);
                                $(this).siblings(".other_a").attr("data-isClick",0);
                            }
                        } else {
                            $(this).siblings(".other_a").attr("data-isClick",0);
                        };

                        if($(this).hasClass("current")){
                            if(curSort == 1){
                                $(this).removeClass("active_down").addClass("active_up");
                                $(this).removeClass("icon_down");
                            } else {
                                $(this).removeClass("active_up").addClass("active_down");
                                $(this).removeClass("icon_down");
                            }
                            if(role != "price"){
                                var priceVar = $(this).siblings("[data-role = 'price']");
                                if($(priceVar).hasClass("active_up")){
                                    $(priceVar).removeClass("active_up").addClass("icon_up");
                                }
                                else if($(priceVar).hasClass("active_down")) {
                                    $(priceVar).removeClass("active_down").addClass("icon_down");
                                }
                            }
                            $(this).siblings(".other_a[data-role = 'hot']").removeClass("active_up");
                        } else {
                            $(this).addClass("current");
                            $(this).siblings().removeClass("current");
                        }
                    };
                });

                var isClick = $(this).attr("data-isClick");
                if(isClick !== 0){
                    sinPro.SearchAjaxGo(curIndex);
                }
            });

            //排序置顶绑定
            $("#J_search").delegate(".SortBox_a","click",function(){
                sinPro.changeType = "/sort";
                var curRole = $(this).attr("data-role");
                    curSort = parseInt($(this).attr('data-sort'));

                if(!$(this).hasClass("current")){
                    if(curSort == 1){
                        $(this).removeClass("active_down").addClass("active_up");
                        $(this).removeClass("icon_down");
                    } else {
                        $(this).removeClass("active_up").addClass("active_down");
                        $(this).removeClass("icon_down");
                    }
                    if(curRole != "price"){
                        var priceVar = $(this).siblings("[data-role = 'price']");
                        if($(priceVar).hasClass("active_up")){
                            $(priceVar).removeClass("active_up").addClass("icon_up");
                        }
                        else if($(priceVar).hasClass("active_down")) {
                            $(priceVar).removeClass("active_down").addClass("icon_down");
                        }
                    }
                    $(this).siblings(".other_a[data-role = 'hot']").removeClass("active_up");
                } else {
                    if(curRole == "hot"){
                        return;
                    }
                    if(curSort == 1 && curRole == "price"){
                        $(this).removeClass("active_up").addClass("active_down");
                    } else {
                        $(this).removeClass("active_down").addClass("active_up");
                    }
                }

                //销量和满意度只 降序
                if($(this).hasClass("other_a")){
                    if($(this).attr("data-isClick") === "1"){
                        $(this).siblings(".other_a").attr("data-isClick",0);
                        return ;
                    } else {
                        $(this).attr("data-isClick",1);
                        $(this).siblings(".other_a").attr("data-isClick",0);
                    }
                } else {
                    $(this).siblings(".other_a").attr("data-isClick",0);
                };

                if ($(this).hasClass('current')) {  //如果当前激活  就取反 否则只加样式而已
                    curSort = parseInt(curSort) == 1 ? 0 : 1;
                    $(this).attr('data-sort', curSort);
                };
                var parentBox = $(this).parents('.SortBox_left');
                parentBox.attr('data-role', curRole);
                parentBox.attr('data-sort', curSort);

                $(this).addClass("current");
                $(this).siblings().removeClass("current");

                var curParent = ".searchConBox_each_" + pageConfig.curTabIndex,
                    sameSort = $(curParent).find(".searchSortBox_a"),
                    sortBox = $(curParent).find(".searchSortBox"),
                    curIndex = $(curParent).attr("data-conboxeachindex");
                $(sortBox).addClass("sort_special");

                sameSort.each(function(){
                    var otherRole = $(this).attr("data-role");
                    if(otherRole == curRole){
                        if (curSort == 1) {
                            $(this).removeClass('active_down').addClass('active_up');
                        } else {
                            $(this).removeClass('active_up').addClass('active_down');
                        };

                        if($(this).hasClass("other_a")){
                            if($(this).attr("data-isClick") === "1"){
                                $(this).siblings(".other_a").attr("data-isClick",0);
                                return ;
                            } else {
                                $(this).attr("data-isClick",1);
                                $(this).siblings(".other_a").attr("data-isClick",0);
                            }
                        } else {
                            $(this).siblings(".other_a").attr("data-isClick",0);
                        };

                        $(this).parents('.searchSortBox').find('a:not([data-role=' + curRole + '])').removeClass('active');
                        $(this).addClass('active');
                        $(this).parents(".searchSortBox").attr('data-role', curRole);
                        $(this).parents(".searchSortBox").attr('data-sort', curSort);

                    }
                });
                sinPro.SearchAjaxGo(curIndex);
            });

            //今日可订优惠渠道绑定
            $("#searchWrap").delegate(".SortBox_add","click",function(){

                sinPro.changeType = "/filter";
                $("#aysnPager").find(".current").attr("data-num","1");
                var self = $(this),
                    curkey = self.parent().attr("data-key");
                    curIndex = self.parents('.searchConBox_each').attr("data-conBoxEachIndex");
                    parent = $("#J_search").find(".SortBox_right");
                $(this).parents(".searchSortBox").removeClass("sort_special");

                if(!self.hasClass("current")){
                    self.addClass("current");
                    if(curkey == "dischannel"){
                        self.parents(".sortKey").attr("data-id",0);
                    } else {
                        self.parents(".sortKey").attr("data-id",1);
                    }
                } else {
                    self.removeClass("current");
                    self.parents(".sortKey").attr("data-id","");
                }
                $(parent).find(".SortBox_add").each(function(){
                    var key = $(this).parent().attr("data-key");
                    if(key == curkey && self.hasClass("current")){
                        $(this).addClass("current");
                        if(key == "dischannel"){
                            $(this).parents(".sortKey").attr("data-id",0);
                        } else {
                            $(this).parents(".sortKey").attr("data-id",1);
                        }
                    }
                    else if(key == curkey && !self.hasClass("current")){
                        $(this).removeClass("current");
                        $(this).parents(".sortKey").attr("data-id","");
                    }
                })
                sinPro.SearchAjaxGo(curIndex);
            });

            //今日可订优惠渠道置顶绑定
            $("#J_search").delegate(".SortBox_add","click",function(){

                sinPro.changeType = "/filter";
                $("#aysnPager").find(".current").attr("data-num","1");
                var curKey = $(this).parent().attr("data-key"),
                    curParent = ".searchConBox_each_" + pageConfig.curTabIndex;
                    bookLi = $(curParent).find(".SortBox_add");
                var curIndex = $(curParent).attr("data-conBoxEachIndex");
                var sortBox = $(curParent).find(".searchSortBox");
                $(sortBox).addClass("sort_special");

                if(!$(this).hasClass("current")){
                    $(this).addClass("current");
                    if(curKey == "dischannel"){
                        $(this).parents(".sortKey").attr("data-id",0);
                    } else {
                        $(this).parents(".sortKey").attr("data-id",1);
                    }

                } else {
                    $(this).removeClass("current");
                    $(this).parents(".sortKey").attr("data-id","");
                }
                bookLi.each(function(){
                    var key = $(this).parent().attr("data-key");
                    if(key == curKey){
                        if(!$(this).hasClass("current")){
                            $(this).addClass("current");
                            if(key == "dischannel"){
                                $(this).parents(".sortKey").attr("data-id",0);
                            } else {
                                $(this).parents(".sortKey").attr("data-id",1);
                            }
                        } else {
                            $(this).removeClass("current");
                            $(this).parents(".sortKey").attr("data-id","");
                        }
                    }
                })
                sinPro.SearchAjaxGo(curIndex);
            })
        },
        //注册tab切换事件
        BindTabChange: function () {
            $(".searchTab .tab_nav").on('click', function () {

                if( sinPro.isSearchAjax == 0 ){
                    var currentUrl = $(this).find("a").attr("data-href");
                    window.location.href = currentUrl;
                    return false;
                } else {
                    sinPro.changeType = "/filter";
                }
                //防止重复提交
                if ($(this).hasClass('tab_active')) {
                    return false;
                };
                //切换时更改隐藏页码
                $("#aysnPager").find(".current").attr("data-num", 1);

                //默认同程推荐
                if(sinPro.isSearchAjax == 1){
                    var sortOne = $(".searchSortBox .searchSortBox_a");
                    sortOne.each(function(){
                        var role = $(this).attr("data-role");
                        if(role == "recommend" && !$(this).hasClass("active")){
                            $(this).addClass("active");
                            $(this).siblings().removeClass("active");
                            $(this).siblings().removeClass("active_down");
                            $(this).parents(".searchSortBox").attr("data-role","recommend")
                            $(this).parents(".searchSortBox").attr("data-sort","");
                        }
                    });

                    var sortTwo = $("#J_search .SortBox_a");
                    sortTwo.each(function(){
                        var otherRole = $(this).attr("data-role");
                        if(otherRole == "recommend" && !$(this).hasClass("current")){
                            $(this).addClass("current");
                            var selectRole = $(this).siblings(".SortBox_a.current");
                            if (selectRole.hasClass("current")) {
                                $(this).siblings(".SortBox_a.current").removeClass('active_down').removeClass('active_up').addClass('icon_up');
                            }
                            $(this).siblings().removeClass("current");
                        }
                    })
                    var sortKey = $(".SortBox_add");
                    if(sortKey.hasClass("current")){
                        sortKey.parents(".sortKey").attr("data-id","");
                        sortKey.removeClass("current");
                    }
                }

                //给全局当前是第几个tab
                var index = $(this).attr('data-index');
                pageConfig.curTabIndex = index;

                if(pageConfig.curTabIndex == 2){
                    isWifiTab = true;
                }

                //改Tab样式
                $(".searchTab .tab_nav").removeClass('tab_active');
                $(this).addClass('tab_active');
                $(".searchConBox_each:not('" + curSelector + "')").addClass('none');//先隐藏其它的

                var b = sinPro.CurTableSearchBoxExist(".searchConBox_each_" + index);
                if (b) {  //如果存在直接显示
                    var curSelector = ".searchConBox_each_" + index;
                    $(curSelector).removeClass('none');
                };
                //异步发起
                sinPro.SearchAjaxGo(index);

            });
        },
        //判断当前tab是否有搜索div
        CurTableSearchBoxExist: function (curSelector) {
            var curSelector = curSelector || ".searchConBox_each_" + pageConfig.curTabIndex;
            if (curSelector == "" || curSelector == undefined) return false;
            return $(curSelector).length > 0;
        },
        //获取当前异步等数据
        GetCurrentDataObj: function (curSelector) {

            var curSelector = curSelector || ".searchConBox_each_" + pageConfig.curTabIndex;
            var isCurTableSearchBoxExist = sinPro.CurTableSearchBoxExist(curSelector);

            var ajaxData = {
                IsNeedStat: isCurTableSearchBoxExist ? 0 : 1, //如果有搜索div 异步时就不用再统计了
                pcReceiveType : ""
            };
            //获取key值
            $(curSelector + ' .setParentDirect,' + curSelector + ' .MultiSelect').parents('.search_dl').each(function () {

                var curKeys = ($(this).attr('data-key') || "");
                var curIds = ($(this).attr('data-id') || "");
                var keyArr = curKeys.split(',');
                var curWays = ($(this).attr('data-way') || "");
                var curWayId = ($(this).attr('data-wayid') || "");
                var wayArr = curWays.split(',');

                if ((curIds == "" || curIds == 0) && (curWayId == "" || curWayId == 0)) {
                    return true;
                }
                if (keyArr.length > 1) {
                    var idArr = ($(this).attr('data-id') || "").split(',');
                    for (var i = 0; i <= keyArr.length - 1; i++) {
                        if (idArr[i] != "" && idArr[i] != undefined) {
                            ajaxData[keyArr[i]] = idArr[i];
                        };
                    };
                } else if (keyArr.length == 1) {
                    if (curIds != "") {
                        ajaxData[curKeys] = curIds;
                    }
                }

                if(wayArr.length > 1){
                    var wayIdArr = ($(this).attr('data-wayid') || "").split('');
                    for(var i = 0; i <= wayArr.length - 1; i++){
                        if(wayIdArr[i] != "" && wayIdArr[i] != undefined){
                            ajaxData[wayArr[i]] = wayIdArr[i];
                        }
                    }
                } else if(wayArr.length == 1){
                    if(curWayId != ""){
                        ajaxData[curWays] = curWayId;
                    }
                }

            });
            //可订今日获取key值
            $(curSelector + ' .SortBox_right').find(".sortKey").each(function () {
                var sortKey = $(this).attr("data-key");
                var sortId = $(this).attr("data-id");
                if (sortId != "" && sortId != undefined) {
                    ajaxData[sortKey] = sortId;
                } else {
                    return true;
                }
            });
            //获取pageId区分页面
            ajaxData.pageId = $(".searchTab .tab_active").attr("data-pageid");

            //区分当地玩乐下游玩主题SingleType
            if (ajaxData['SingleType'] == undefined || ajaxData['SingleType'] == 0) {
                ajaxData.SingleType = $(".searchTabBox li[data-index=" + curSelector.slice(-1) + "]").attr('data-id');  // slice(-1) 取倒数第一个字段  1
            }

            ajaxData.keyword = encodeURIComponent($("#destName").val());
            ajaxData.stp = $(curSelector + " .searchSortBox").attr('data-role') || 'recommend';
            ajaxData.sort = $(curSelector + " .searchSortBox").attr('data-sort') || 1;

            ajaxData.pageNum = $("#aysnPager").find(".current").attr("data-num") || 1;
            ajaxData.curSelector = curSelector;
            ajaxData.curTabIndex = curSelector.slice(-1);

            // 排序处理
            if(!!ajaxData.stp){
                var sortTypeDic={
                    "recommend":"recdTagScore:desc,wifiSort:asc,isEmphasis:desc,tcPrice:asc",
                    "price":"tcPrice:{0}",
                    "hot":"monthOrdCount:{0}",
                    "rate":"satDeg:{0}"
                }

                if(pageConfig.curTabIndex == 2){
                    // sortTypeDic.recommend = "monthOrdCount:desc,satDeg:desc,cmtCount:desc,tcPrice:asc";
                    // 上面的勿删  下面是新规则排序
                    sortTypeDic.recommend = "titleMatchSort:desc,finalScore:desc";
                }

                var sortType=ajaxData.stp;
                var sort=sortTypeDic[sortType].replace('{0}',(ajaxData.sort||0)==0?"asc":"desc");

                delete ajaxData.stp;
                ajaxData["sort"]=sort;
            }

            // 领取方式特殊化处理
            if(isLpcity == 1){
                if(ajaxData.receiveType == "1,2"){//只选自取
                    ajaxData.receiveType = "1,2";
                } else if(ajaxData.receiveType == "3,6"){//只选快递
                    ajaxData.receiveType = "3,6";
                    ajaxData.pcReceiveType ="3,6";
                } else{//两者都选
                    ajaxData.receiveType = "1,2,3,6";
                    ajaxData.pcReceiveType ="3,6";
                }
            }

            if(ajaxData.pcReceiveType == ""){
                delete ajaxData.pcReceiveType;
            }

            return ajaxData;
        },
        //异步调取
        SearchAjaxFun: function (ajaxData) {

            var curSelector = ajaxData.curSelector;
            var curTabIndex = ajaxData.curTabIndex;

            delete ajaxData.curSelector;
            delete ajaxData.curTabIndex;

            // 带出wifi细分品类
            if( ajaxData.IsNeedStat == 0){
                ajaxData.IsNeedStat = ajaxData.lpCity?1:0;
            }

            var url = pageConfig.searchAjaxUrl + "" + funObj.getParamStr.call(ajaxData);
            //拼接数据   a=1&b=2
            if(ajaxData.lpCity != undefined && ajaxData.lpCity != "" && ajaxData.lpCity != 0){
                //获取wifi细分品类
                url=url +"&Stat=singleCategory";
                isLpcity = 1;
            }

            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function (data) {

                    data=data.Data.length>0?data.Data[0]:[];

                    if (!sinPro.CurTableSearchBoxExist(curSelector)) {
                        sinPro.DotFun(data);
                    }
                    if(data != ""){
                        $(curSelector + " .pro_total").text(data.TotalCount);
                    } else {
                        $(curSelector + " .pro_total").text("0");
                    }

                    data.current = ajaxData.pageNum;
                    data.searchContent = decodeURIComponent(ajaxData.keyword);
                    data.show = curTabIndex == 1 ? true : false;
                    data.url = url;
                    sinPro.RenderProduct(data);
                    data.IsRenderProduct = true;
                    sinPro.RenderPager(data);

                    var curParent = $(".searchConBox_each_" + pageConfig.curTabIndex).find(".searchSortBox");
                    if(curParent.hasClass("sort_special")){
                        curParent.removeClass("sort_special");
                    }

                    // wifi细分品类显隐
                    var SingleCategory = data.SingleCategoryList;
                    var Singleid = {};
                    var wifiSingle = $(".searchConBox_each_" + pageConfig.curTabIndex).find(".search_dl[data-key='singleCategory']");
                    var searchUl = wifiSingle.find(".search_ul li");
                    searchUl.removeClass("grey");
                    if(SingleCategory && SingleCategory.length > 0){

                            for(var i=0;i<SingleCategory.length;i++){
                                Singleid[SingleCategory[i].Id]=SingleCategory[i].Id;
                            }
                            searchUl.each(function(){
                                if(!Singleid[$(this).find("a").data("id")] && isLpcity == 1){
                                    $(this).addClass("grey");
                                }
                            })
                    } else {
                        // for(var b=0; b<searchUl.length; b++){
                        //     if($(searchUl[b]).parent().hasClass("grey")){
                        //         $(searchUl[b]).parent().removeClass("grey");
                        //     }
                        // }
                    }
                }
            });
        },
        //异步请求
        SearchAjaxGo: function (index) {

            $("#j_flip_no_main").removeClass("show").addClass("none");
            $("#J_pro_list").html("<div class='mloading'><span>正在查询您的线路产品，请稍候....</span></div>");

            var data = this.GetCurrentDataObj(".searchConBox_each_" + index);
            this.SearchAjaxFun(data);
        },
        //dot渲染
        DotFun: function (data) {
            data.curTabIndex = pageConfig.curTabIndex;
            var tmplDiv = $(tab(data));
            $('.searchConBox').append(tmplDiv);
            var parent_dd = tmplDiv.find(".more_even").parents('.search_dd');
            var key = $(tmplDiv).find(".search_dl").attr("data-key");

            if ((key == "lpCity")) {
                parent_dd.find('.dest_ul>li:gt(6)').show();
                parent_dd.find('.more_even').addClass("current").find('em').text("收起");
                if (($(".MultiSelect .search_ul>li").length <= 7)) {
                    $('.MultiSelect .open_all').hide();
                }
            } else {
                parent_dd.find('.dest_ul>li:gt(6)').hide();
                parent_dd.find('.more_even').removeClass("current").find('em').text("更多");
            }
        },
        //渲染产品
        RenderProduct: function (data) {

            if(sinPro.changeType == "/page"){
                _tcTraObj._tcTrackEvent("search", sinPro.pageLabel, sinPro.changeType, "|*|k:"+$("#destName").val()+"|*|page:"+$("#aysnPager li .current").attr("data-num")+"rc:"+data.TotalCount+"|*|");
            } else {
                _tcTraObj._tcTrackEvent("search", sinPro.pageLabel, sinPro.changeType, "|*|k:"+$("#destName").val()+"|*|rc:"+data.TotalCount+"|*|");
            }
            var productRenderCallBackFn = tmplArr[pageConfig.curTabIndex - 1];

            data.pageLabel = sinPro.pageLabel;
            var currentPage = $("#aysnPager").find(".current").attr("data-num") || 1;
            data.currentPage = parseInt(currentPage);

            $("#J_pro_list").empty().append(productRenderCallBackFn(data));

            var curParent = ".searchConBox_each_" + pageConfig.curTabIndex;
            var parents = $(curParent).find(".searchSortBox");
            var offSetTop = $("#J_pro_list").offset().top-70;
            if($(parents).hasClass("sort_special")){
                $(window).scrollTop(offSetTop);
            }else{
                $(window).scrollTop(353);
            }
            sinPro.LazyLoad();
        },
        //分页处理
        RenderPager: function (pagerNeed) {

            var total = pagerNeed.TotalCount;
            var totalPage = Math.ceil(total / 10);

            if (totalPage > 0) {
                self.hasPage = true;
                require("pager/0.1.0/index");
                $('#aysnPager').page({
                    current: 1,
                    total: totalPage,
                    startWithAjax: false,
                    needFirstAndLast: true,
                    pageNoParam: "pageNum",
                    ajaxObj: {
                        url: pagerNeed.url,
                        dataType: "jsonp",
                        pageSize: 10,
                        success: function (data, pager) {
                            var curParent = $(".searchConBox_each_" + pageConfig.curTabIndex).find(".searchSortBox");
                            if(curParent.hasClass("sort_special")){
                                curParent.removeClass("sort_special");
                            }

                            pagerNeed.TotalCount = data.Data[0].TotalCount;
                            pagerNeed.LineList  = data.Data[0].LineList;

                            sinPro.changeType = "/page";
                            isInit && sinPro.RenderProduct(pagerNeed);
                        }
                    },
                    initLoad: false
                });
                $("#j_flip_no_main").addClass("none");
            } else {
                $("#aysnPager").empty();
                $("#J_CometPager").empty();
                $("#j_flip_no_main").removeClass("none");
                $(".mloading").addClass("none");
            }
        },
        //同步分页处理
        FirstRenderPage: function () {

            var firstSelector = ".searchConBox_each_" + pageConfig.curTabIndex;
            var data = this.GetCurrentDataObj(firstSelector);
            delete data.curSelector;
            delete data.curTabIndex;
            var dataObj = {
                url: pageConfig.searchAjaxUrl + "" + funObj.getParamStr.call(data),
                TotalCount: $(firstSelector + " .pro_total").text(),
                LineList: []
            };
            sinPro.RenderPager(dataObj);
            isInit = true;
        },
        //点击收起
        moreHide: function (event) {
            var eParent = event.parents(".pro_li"),
                valStr = ["展开所有", "收起所有"],
                proLi = eParent.find(".book_li"),
                moreArea = $(".book_more");
            proLi.each(function (elems, j) {
                if (elems > 2) {
                    $(this).addClass("none");
                }
            });
            event.find("em").html(valStr[0]);
            event.removeClass("current");
        },
        //点击展开
        moreShow: function (event) {
            var eParent = event.parents(".pro_li"),
                valStr = ["展开所有", "收起所有"],
                proLi = eParent.find(".book_li");
            proLi.each(function (elems, j) {
                $(this).removeClass("none");
            });
            event.find("em").html(valStr[1]);
            event.addClass("current");
        },
        //展开收起事件
        showhide: function () {
            $("#J_pro_list").delegate(".main_book .book_li .txt", "click", function (e) {

                var oTar = $(this).parents(".book_li_tt").siblings(".book_li_bd").parent();
                if (oTar.hasClass("current")) {
                    oTar.removeClass("current");
                } else {
                    oTar.addClass("current");
                }
            });

            $("#J_pro_list").delegate(".more_opera", "click", function () {
                var _self = $(this);
                if (_self.hasClass("current")) {
                    sinPro.moreHide(_self);
                } else {
                    sinPro.moreShow(_self);
                }
            });
        },
        //图片懒加载
        LazyLoad: function () {
            if (!sinPro.isInit) {
                var imgList = $(".pro_list img").not("[data-img-loaded]");
                $("body").trigger("addElements", imgList);
            } else {
                $(".pro_list img").lazyload({
                    "data_attribute": "img",
                    effect: 'fadeIn'
                });
                sinPro.isInit = false;
            }
        },
        //领取城市多选 只样式
        BindMultiSelect: function () {

            $("#searchWrap .searchConBox").delegate(".MultiSelect a", "click", function (e) {
                sinPro.changeType = "/filter";

                if($(this).parent().hasClass("grey")){
                    return false;
                }
                if($(this).parents(".search_dl").data("key") == "lpCity"){
                    isLpcity = 1;
                }

                $("#aysnPager").find(".current").attr("data-num","1");
                var curIndex = $(this).parents('.searchConBox_each').attr('data-conBoxEachIndex'),
                    curflag = $(this).parents(".search_dl").attr("data-flag"),
                    curType = $(this).parents(".search_dl").attr("data-key");
                parentConBox = $(this).parents('.searchConBox_each').find('.crumbox');

                $(this).parents(".MultiSelect").find(".search_all").removeClass('on');

                if ($(this).hasClass('search_all')) {

                    $(this).parents('.MultiSelect').find('a:not(".search_all")').removeClass('select').removeClass('on');
                    $(parentConBox).find(".crumdiv[data-flag="+curflag+"]").remove();

                } else {
                    if ($(this).hasClass('select')) {
                        $(this).removeClass('select').removeClass('on');
                        $(".crumdiv[data-id=" + $(this).attr('data-id') + "]").remove();
                    } else {
                        $(this).parents(".MultiSelect").find(".search_all").removeClass("on");
                        $(this).addClass('select').addClass('on');
                        var strhtml = '<div class="crumdiv" data-key="' + curType + '" data-id="' + $(this).attr("data-id") + '" data-flag="'+curflag+'" data-wayid="' + $(this).attr("data-wayid") + '">' +'<span class="crumtitle">'+ $(this).text() + '</span><i>&nbsp;</i></div>';

                        $(parentConBox).find(".removeall").before(strhtml);
                    }
                }
                curClear = $(parentConBox).find(".crumdiv");
                if($(curClear).length > 0){
                    $(parentConBox).find(".removeall").removeClass("none");
                }else{
                    $(parentConBox).find(".removeall").addClass("none");
                }
                sinPro.GetMultiSelecIds($(this).parents('.search_dl'));

                setTimeout(function () {
                    var curTimeTick = new Date().getTime();
                    if (curTimeTick - lastAjaxTime > 1500 || lastAjaxTime == undefined) {
                        sinPro.SearchAjaxGo(curIndex);
                        lastAjaxTime = curTimeTick;
                    }
                }, 1500);
            });

            $("#searchWrap .searchConBox").delegate(".removeall","click",function(e){

                sinPro.changeType = "/filter";
                $(".searchConBox_each_" + pageConfig.curTabIndex+" .MultiSelect a").removeClass("select");
                $(".searchConBox_each_" + pageConfig.curTabIndex+" .crumbox .crumdiv").remove();
                $(this).addClass("none");
                sinPro.DirectClick($(".searchConBox_each_" + pageConfig.curTabIndex+" .MultiSelect .search_all"));
            });

            $("#searchWrap .searchConBox").delegate(".crumdiv i", 'click', function (e) {

                sinPro.changeType = "/filter";
                var curIndex = $(this).parents('.searchConBox_each').attr('data-conBoxEachIndex'),
                    curId = $(this).parent().attr('data-id'),

                    //curflag = $(this).parent().attr("data-flag"),
                    cueKey = $(this).parent().attr("data-key"),
                    parentDl = $(".searchConBox_each_" + pageConfig.curTabIndex).find(".search_dl[data-key="+cueKey+"]"),
                    curPar = $(parentDl).find(".MultiSelect");

                $(".MultiSelect a[data-id=" + curId + "]").removeClass('select').removeClass('on');
                $(this).parent().remove();

                var parentLength = $(".crumdiv").length;
                if(!parentLength){
                    $(".removeall").addClass("none");
                } else {
                    $(".removeall").removeClass("none");
                }
                sinPro.GetMultiSelecIds(curPar);


                setTimeout(function () {
                    var curTimeTick = new Date().getTime();
                    if (curTimeTick - lastAjaxTime > 1500 || lastAjaxTime == undefined) {
                        sinPro.SearchAjaxGo(curIndex);
                        lastAjaxTime = curTimeTick;
                    }
                }, 1500);

                sinPro.GetMultiSelecIds($(curPar).parent('.search_dl'));
            });
        },
        //多选取值
        GetMultiSelecIds: function (that) {

            var arr = [];
            var arrWay= [];
            var waystate=true;
            $(that).find("a:not('.search_all')").each(function () {
                if ($(this).hasClass('select')) {
                    var cuId = $(this).attr('data-id');
                    var curWayId = $(this).attr("data-wayid");

                    if(cuId != ""){
                        arr.push(cuId);
                    }
                    if( JSON.stringify(arrWay).indexOf(curWayId)>-1){
                        waystate=false;
                    }else{
                        waystate=true;
                    }
                    if(waystate){
                        arrWay.push(curWayId);
                    }
                }
            });
            $(that).attr('data-id', arr.join(','));
            $(that).attr('data-wayid',arrWay.join(','));

            var dt = $(that).find("a");
            if (!dt.hasClass("select")) {
                $(that).attr("data-id");
                $(that).find(".search_all").addClass("on");
            }
        },
        //重新筛选
        Rechoose: function () {

            $("#j_flip_no_main .flip_no_btn").on("click", function () {

                var index = $(".tab_active").attr("data-index");
                var parents = ".searchConBox_each_" + index;

                $(parents).find(".search_ul a").removeClass("on");
                $(parents).find(".search_ul a").removeClass("select");
                $(parents).find(".sort_price .input-price").val("");
                $(".crumbox .crumdiv").remove();
                $(".removeall").addClass("none");
                $(parents).find(".search_all:not('.on')").addClass("on");

                $(parents).find(".search_dl").each(function (i, elem) {
                    $(elem).attr("data-id", "");
                    $(elem).attr("data-wayid", "");
                });
                //排序
                $(parents).find(".searchSortBox_a.active").removeClass("active");
                $(parents).find(".searchSortBox_a:first").addClass("active");
                $(parents).find(".searchSortBox_a").removeClass("active_down").removeClass("active_up");
                $(parents).find(".sortKey").attr("data-id","");
                $(parents).find(".SortBox_add").removeClass("current");
                $("#J_search").find(".sortKey").attr("data-id","");
                $("#J_search").find(".SortBox_add").removeClass("current");
                $("#J_search").find(".SortBox_a.current").removeClass("current");
                $("#J_search").find(".SortBox_a:first").addClass("current");
                $("#J_search").find(".SortBox_a").removeClass("active_up").removeClass("active_down").addClass("icon_up");
                $("#J_search").find(".SortBox_a.other_a").attr("data-isClick","");


                sinPro.SearchAjaxGo(index);
            });
        },
        //优惠展现
        initTip: function(){
            var o_dialog = new dialog({skin:"default"}),
                odl = o_dialog.tooltip({
                    content: function(obj){
                        var text = $(obj).attr("data-content");
                        var width = '330px';
                        odl.set('width', width);
                        return text;
                    }, //内容,支持html,function
                    delay: 500,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                    triggerEle: '.J_Tips',//触发元素选择器
                    triggerType: 'hover',//hover|click
                    triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
                });

        },
        GetUser: function() {
            var loginInfo = $.cookie("us"),
                userid;
            if (loginInfo) {
                userid = /userid=(\d+)/i.exec(loginInfo);
                userid = userid ? userid[1] : userid;
            }
            return userid;
        },

        Slider: function() {
            var userid = sinPro.GetUser();
            var slider = new Slidertoolbar({
                header: {
                    icon: $("#ImgUrl").find("em").html(),
                    tooltips: $("#ImgUrl").find("span").html()
                },
                topMenu: [{
                    icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1"></div></a>',
                    tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                },{
                    icon: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_10" class="J_trace"><div class="ico c-3"></div></a>',
                    tooltips: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_11"><span class="ico-title">我的收藏<i></i></span></a>',
                    arrow: false
                }, {
                    ideaClass: "udc-link",
                    icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                    tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                    arrow: false
                },{
                    icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2028"><div class="ico c-5"></div></a>',
                    tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2028"><span class="ico-title">在线客服<i></i></span></a>',
                    arrow: false
                }],
                bottomMenu: [{
                    icon: '<a class="Qr_icon"><div class="ico c-7"></div></a>',
                    tooltips: '<a class="Qrcode"><span class="ico-title">'+$("#SilderEwm").html()+'<i></i></span></a>',
                    arrow: false
                }],
                toTop: true,
                pageName: $("#hidPageName").val() || "",
                skin:'skin2'
            });
            if (userid) {
                slider.resetMenu({
                    icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1-1"></div></a>',
                    tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                }, 'top', 0);
            }
        },

        QRcode: function(){
            var _this = $("#module-slider .c-7");
            _this[0].onmouseover = function(){
                _this.parents(".content").find(".tooltip_gp ").css({"background":"none"});
            }
        },

        //滚动置顶
        ScrollspyBind: function () {
            $(document).scroll(function(){
                var scroll_top = $(document).scrollTop();
                var offSetTop = $("#J_pro_list").offset().top -90;

                if(scroll_top > offSetTop){
                    $("#J_search").addClass("SortBox");
                    $("#J_search").find(".SortBox_left").removeClass("none");
                    $("#J_search").find(".SortBox_right").removeClass("none");
                    $("#J_search").find(".hotcity-name").addClass("none");
                    $(".SortBox_main").css("background","#fff");
                }else{
                    $("#J_search").removeClass("SortBox");
                    $("#J_search").find(".SortBox_left").addClass("none");
                    $("#J_search").find(".SortBox_right").addClass("none");
                    $("#J_search").find(".hotcity-name").removeClass("none");
                    $(".SortBox_main").css("background","none");
                }
            });
        },

        //精品推荐的展开/收起
        ClixkMore: function(){
            $(".click-more a").on("click", function () {
                var parents = $(this).parents(".dl").toggleClass("shut");
                $(this).html(parents.is(".shut") ? "收起<i></i>" : "更多<i></i>");
            });
        }

    };
    module.exports = sinPro;
