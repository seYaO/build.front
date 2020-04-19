! function(window, document, $, undefined) {
    require("./js/_scrollspy.js");
    var utitl = require("../../../utils/cruise.utility.js");
    var comFn = require("./js/_comFns.js");
    var isApp = comFn.isApp;
    var getProData = require("./js/_getProData.js");
    var countDown = require("./js/_countDown.js");
    var loader = comFn.loader({
        elem: $(".loading_div .loader").get(0)
    });
    var lid = comFn.getUrlParam("lid") || "";
    
    var thisObj = {
        init: function() {
            var listAreaTxt = { area_10: "华东", area_11: "华南", area_12: "华北", area_13: "华中", area_14: "华西" };
            this.areaId = $("#HidAreaId").val() || 10;
            this.areaShowTxt = listAreaTxt["area_" + this.areaId] || "华东";
            this.areaHotData = {};
            this.navObj = {}; // 时间nav
            this.isAuto = true; // 倒计时结束，是否自动进入明天            
            this.specialId = $("#HidSpecialId").val();
            this.areaChooseObj.init();
            this.giftPopObj.init();
            this.bindEvent();
        },
        bindEvent: function() {
            var _this = this;
            this.isLoad = true;
            this.draw(this.areaId);            
        },
        load: function(areaId) {
            var _this = this;
            if (this.dataLoading) return false;
            this.dataLoading = true;
            getProData({
                specialId: _this.specialId,
                lid: lid,
                isTimeLmit: false,
                fn: function(data) {
                    _this.DATA = comFn.dataReplaceProctol(data);
                    $(".content").removeClass("none");
                    _this.showDateNav();                    
                    _this.draw(areaId);
                    loader.endFn();
                }
            });
        },
        draw: function(areaId) {
            var _this = this;
            if (this.DATA === undefined) {
                this.load(areaId);
                return false;
            }

            var areaData = this.DATA && this.DATA.areaData && this.DATA.areaData["area_" + areaId];            
            var buyTemplate = $("#buyTemplate").html();
            var wedTemplate = $("#wedTemplate").html();
            // console.log(areaData)
            

            function fn(data) {
                var _html = '';
                utitl.forEach(data, function(index, item) {
                    _html += buyTemplate.format(
                        (function() {
                            var _url = comFn.createUrlPath({
                                specialId : _this.specialId,
                                lineId : item["StlLineId"],
                                lineType : item["StlLineType"],
                                lineDate : item["StlLineDate"],
                                moduleId : item["StlModuleId"],
                                key : item["Key"],
                                lid : lid,
                                batchId : item["StlRecommend"]
                            });
                            return _url;
                        }()),
                        item["StlImageUrl"],
                        (function() {
                            // <p class="label"><span>推荐推荐推荐推荐推荐推荐推荐推...</span></p> 
                            var StlDescription = item["StlDescription"];
                            var str = StlDescription ? '<p class="label"><span>'+StlDescription+'</span></p>' : '';
                            return str;
                        }()),
                        (function() {
                            var CcName = item["CcName"];
                            var CiName = item["CiName"]
                            var date = item["StlLineDate"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
                                return parseInt(m, 10) + "月" + parseInt(d, 10) + "日"
                            });
                            var StlViaPort = item["StlViaPort"];
                            var CliDays = item["CliDays"] + "日游";
                            var CliNights = item["CliNights"] + "晚";
                            return "【" + CcName + "-" + CiName + "】 " + date + " " + StlViaPort + " " + CliNights + CliDays;
                        }()),
                        (function() {
                            var price = 0;
                            if (item["StlLineType"] == 1) {
                                price = item["StlSellRate"];
                            }else{
                                price = item["ClsdMinPrice"];
                            }
                            return price;
                        }())
                    );
                });
                return _html;
            }            

            function wedFn(data){
                var _html = '';
                utitl.forEach(data, function(index, item) {
                    _html += wedTemplate.format(
                        (function() {
                            var _url = item["StlDescription"];
                            return _url;
                        }()),
                        item["StlImageUrl"],
                        item["StlRecommend"],
                        (function() {
                            var price = 0;
                            if (item["StlLineType"] == 1) {
                                price = item["StlSellRate"];
                            }else{
                                price = item["ClsdMinPrice"];
                            }
                            return price;
                        }()),
                        (function(){
                            var StlDiscount = item["StlDiscount"];
                            StlDiscount = StlDiscount ? '<span class="label">'+StlDiscount+'</span>' : ''
                            return StlDiscount;
                        }())                        
                    );
                });
                return _html;
            }

            

            if (areaData) {
                // high翻8点
                this.areaHotData = areaData["hot"] || null;
                // console.log(this.areaHotData);
                var dateObj = this.DATA.dateObj;
                var nowTime = this.DATA.nowTime;
                if (!$.isEmptyObject(this.areaHotData)) {
                    $(".unit-hot").removeClass("none");
                    _this.getTabHotData(nowTime, dateObj[nowTime]);
                } else {
                    $(".unit-hot").addClass("none");
                    if (this.timer && this.timer.destory) { //清除前一个倒计时
                        this.timer.destory();
                    }
                }

                // 爆款尖货
                var buyData = areaData["buy"];
                if (buyData && buyData[0]) {
                    $(".unit-buy").removeClass("none");
                    $(".unit-buy .buy-pro").html(fn(buyData.slice(0,8)));
                } else {
                    $(".unit-buy").addClass("none");
                }

                // 引爆周三
                var wednesdayData = areaData["wednesday"];
                // debugger;
                if (wednesdayData && wednesdayData[0]) {
                    $(".unit-wednesday").removeClass("none");
                    $(".unit-wednesday .wednesday-pro").html(wedFn(wednesdayData.slice(0,1)));
                } else {
                    $(".unit-wednesday").addClass("none");
                }

                //图片延迟加载
                comFn.webpAndLazy($(".detail-unit").find(".pro_img"));
            }

            var jumpPortal = this.DATA && this.DATA.jumpPortal;
            if (jumpPortal && this.isLoad && jumpPortal.length >=2) {
                var jumpHtml = '';
                var jumpTemp = '<a href="{0}"><img class="jump_img" data-nsrc="{1}" alt=""></a>';
                utitl.forEach(jumpPortal.slice(0,2), function(index, item){
                    jumpHtml += jumpTemp.format(item["url"], item["img"]);
                });
                $(".banner-pro").html(jumpHtml);
                //图片延迟加载
                comFn.webpAndLazy($(".detail-unit").find(".jump_img"));
                this.isLoad = false;
            }

            

            // 滚动定位
            $.scrollspy({
                navEl : $(".nav-box"),
                contentEl: ".J_NavBox",
                currentCls: "curr",
                navItemEl: "a",
                renderNav: false,
                fixedNav: function (el, sign) {
                    switch (sign) {
                        case 0:
                            //el.addClass("fixed");
                            break;
                        case 1:
                            // el.show();
                            break;
                        case 2:
                            // el.show();
                            break;
                    }
                },
            });
        },
        showDateNav: function(){
            var _this = this;
            var dateArr = this.DATA && this.DATA.dateArr;
            if(dateArr && dateArr[0]){
                var dateObj = this.DATA.dateObj;
                var nowTime = this.DATA.nowTime;
                var temp = '<li _date="{0}">{1}<br/><span>{2}</span></li>';
                var $hotNav = $(".hot-nav");
                var _ul = '';
                var len = dateArr.length;
                for(var i = 0; i < len; i++){
                    var dd = i < dateObj[nowTime] ? "已结束" : "即将开抢";
                    _ul += temp.format(dateArr[i],dateArr[i].replace(".","月"),dd);
                }
                $("ul",$hotNav).html(_ul);

                _this.navObj.liWidth = $("ul li",$hotNav).width();
                _this.navObj.navWidth = $hotNav.width();
                _this.navObj.ulWidth = _this.navObj.liWidth * len;
                _this.navObj.leftMarign = (_this.navObj.navWidth -_this.navObj.liWidth)/2;
                // $("ul",$hotNav).css({ "width": _this.navObj.liWidth*len + "px" });
            }
            $(".hot-nav li").on("click", function(){
                if(!$(this).hasClass("curr")){
                    var date = $(this).attr("_date");
                    var index = $(this).index();
                    _this.getTabHotData(date, index);
                }                
            });
        },
        // 打印high翻8点数据，日期切换
        getTabHotData: function(getTime, index){
            var _this = this;
            var hotTemplate = $("#hotTemplate").html();
            var dateArr = this.DATA && this.DATA.dateArr;
            var dateObj = this.DATA.dateObj;
            var nowTime = this.DATA.nowTime;
            getTime = dateObj[getTime] ? getTime :  dateArr[0];
            index = index ? index : 0;
            var hotData = this.areaHotData && this.areaHotData[getTime]; 
            
            if(hotData){
                $(".hot-pro .hot-box").html(hotFn(hotData.slice(0,1),hotTemplate));
                //图片延迟加载
                // comFn.webpAndLazy($(".hot-pro").find(".pro_img"));
                
                var hotNav = $(".hot-nav");
                $("li",hotNav).removeClass("curr");
                $($("li",hotNav)[index]).addClass("curr");
                var left = _this.navObj.leftMarign - _this.navObj.liWidth*index;
                $("ul",hotNav).animate({"marginLeft": left  + "px"},300);
                var roomName = hotData[0]["StlRoomTypeName"];
                
                if(roomName == 1 && (dateObj[nowTime] == undefined || index >= dateObj[nowTime])){
                    var timeLimit = {
                        startTime: "",
                        endTime: ""
                    };
                    
                    timeLimit.startTime = hotData[0]["StlBeginTime"];
                    timeLimit.endTime = hotData[0]["StlEndTime"];
                    // alert(new Date(timeLimit.endTime));
                    
                    _this.bindCountDown(timeLimit);
                }else{
                    var $allAs = $(".hot-pro"),
                        $tabNav = $allAs.find(".hot-nav"),
                        $tabLiCount = $tabNav.find("li").length,
                        $tabCurr = $tabNav.find(".curr"),
                        $tabSpan = $tabCurr.find("span"),
                        $typeTxt = $allAs.find(".timer_txt"),
                        $timerCellCon = $allAs.find(".timer_show");
                    $tabSpan.html("已结束");
                    $typeTxt.html("本场活动已结束");
                    $timerCellCon.addClass("none");
                    $allAs.find(".btn").html("已售罄").addClass("over");
                    $allAs.attr("href", "javascript:void(0);");
                }              
            }            
        },
        //绑定一个倒计时
        bindCountDown: function(timeLimit) {
            var _this = this,
                $allAs = $(".hot-pro"),
                $tabNav = $allAs.find(".hot-nav"),
                $hotLink = $allAs.find(".hot-link"),
                $tabLiCount = $tabNav.find("li").length,
                $tabCurr = $tabNav.find(".curr"),
                $tabSpan = $tabCurr.find("span"),
                $typeTxt = $allAs.find(".timer_txt"),
                $timerCellCon = $allAs.find(".timer_show"),
                $HH = $timerCellCon.find(".span_HH em"),
                $MM = $timerCellCon.find(".span_MM em"),
                $SS = $timerCellCon.find(".span_SS em");
            if (this.timer && this.timer.destory) { //清除前一个倒计时
                this.timer.destory();
            }
            // console.log(timeLimit)
            if (timeLimit && timeLimit.startTime && timeLimit.endTime) {
                $.ajax({
                    url: "/youlun/json/getsystime.html",
                    type: "get",
                    dataType: "json",
                    success: function(data) {
                        if (data && data.nowTime) {
                            _this.timer = countDown({
                                starTime: timeLimit.startTime,
                                endTime: timeLimit.endTime,
                                nowTime: data.nowTime,
                                updateFn: function(t, b) {
                                    // console.log(t)
                                    var hours = t.hour <= 9 ? ("0" + t.hour) : t.hour,
                                        minutes = t.minute <= 9 ? ("0" + t.minute) : t.minute,
                                        seconds = t.second <= 9 ? ("0" + t.second) : t.second;
                                    $HH[0].innerHTML = parseInt(hours / 10, 10);
                                    $HH[1].innerHTML = hours % 10;
                                    $MM[0].innerHTML = parseInt(minutes / 10, 10);
                                    $MM[1].innerHTML = minutes % 10;
                                    $SS[0].innerHTML = parseInt(seconds / 10, 10);
                                    $SS[1].innerHTML = seconds % 10;
                                },
                                nobeginFn: function() {
                                    // console.log("抢购未开始");
                                    $tabSpan.html("即将开抢");
                                    $typeTxt.html("暂未开始");
                                    $timerCellCon.addClass("none");
                                    $allAs.find(".btn").html("查看详情").removeClass("over");
                                    $hotLink.each(function() {
                                        var $this = $(this);
                                        $this.attr("href", $this.attr("_href"));
                                    });

                                },
                                ingFn: function() {
                                    // console.log("疯狂抢购");
                                    $tabSpan.html("正在疯抢");
                                    $typeTxt.html("距本场结束");
                                    $timerCellCon.removeClass("none");
                                    $allAs.find(".btn").html("马上抢").removeClass("over");
                                    $hotLink.each(function() {
                                        var $this = $(this);
                                        $this.attr("href", $this.attr("_href"));
                                    });                                                                     
                                },
                                endFn: function() {
                                    // console.log("抢购已结束");
                                    $tabSpan.html("已结束");
                                    $typeTxt.html("本场活动已结束");
                                    $timerCellCon.addClass("none");
                                    $allAs.find(".btn").html("已售罄").addClass("over");
                                    $hotLink.attr("href", "javascript:void(0);");
                                    var i = $tabCurr.index();
                                    if(i + 1 <= $tabLiCount){
                                        var dateArr = _this.DATA.dateArr;
                                        _this.getTabHotData(dateArr[i + 1], i + 1);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        },
        // 区域选择
        areaChooseObj: {
            init: function() {
                var areaId = thisObj.areaId;
                var areaShowTxt = thisObj.areaShowTxt;
                $(".area_change_div .txt_sp").attr("_areaId", areaId).html(areaShowTxt);
                $(".area_box .area_ul_list > li.act").removeClass("act")
                $(".area_box .area_ul_list > li[_areaId='" + areaId + "']").addClass("act");
                this.bindEvent();
            },
            // 区域弹框
            areaChoiseForm: comFn.alertFormCtrl({
                showCon: $(".area_box"),
                shadowBg: $(".shadow_bg"),
                clickBgClose: false,
                closeBut: $(".area_box .close_but"),
                showAfterFn: function($showCon) {
                    if (!$showCon || !$showCon[0]) return false;
                    if (!$showCon.iscd) { //是否计算过位置
                        $showCon.iscd = true;
                        comFn.domPosCenter($showCon[0]);
                    }
                },
                showBeforeFn: function($con, $bg) {
                    $bg.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                    $con.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                    $(".area_change_div").addClass("active");
                },
                closeAfterFn: function($con, $bg) {
                    $bg.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                    $con.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                    $(".area_change_div").removeClass("active");
                }
            }),
            bindEvent: function() {
                if (this.bindEventOnce) return false;
                this.bindEventOnce = true;
                var _this = this,
                    $showAreaBut = $(".area_change_div"),
                    $allAreaList = $(".area_box .area_ul_list > li"),
                    $showAreaTxt = $(".txt_sp", $showAreaBut[0]); //
                // 点击显示选择的区域列表
                $showAreaBut.on("click", function() {
                    _this.areaChoiseForm.show();
                });

                // 选择区域列表
                $allAreaList.on("click", function() {
                    var $this = $(this),
                        showTxt = $this.attr("_showTxt"),
                        areaId = $this.attr("_areaId"),
                        nowAreaId = $showAreaTxt.attr("_areaId") || 0;
                    $showAreaTxt.html(showTxt).attr("_areaId", areaId);
                    //重新筛选这些数据
                    if (nowAreaId != areaId) {
                        $allAreaList.removeClass("act");
                        $this.addClass("act");
                        //数据重新加载（）
                        thisObj.draw(areaId);
                    }
                    _this.areaChoiseForm.close();
                });
            }
        },
        // 礼品选择
        giftPopObj: {
            init: function() {
                this.bindEvent();
            },
            // 礼品弹框
            giftForm: comFn.alertFormCtrl({
                showCon: $(".gift-pop"),
                shadowBg: $(".shadow_bg"),
                clickBgClose: false,
                closeBut: $(".gift-pop .close"),
                showAfterFn: function($showCon) {
                    if (!$showCon || !$showCon[0]) return false;
                    if (!$showCon.iscd) { //是否计算过位置
                        $showCon.iscd = true;
                        comFn.domPosCenter($showCon[0]);
                    }
                },
                showBeforeFn: function($con, $bg) {
                    $bg.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                    $con.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                },
                closeAfterFn: function($con, $bg) {
                    $bg.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                    $con.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                    $("img", $con).addClass("none");
                }
            }),
            bindEvent: function() {
                if (this.bindEventOnce) return false;
                this.bindEventOnce = true;
                var _this = this,
                    $gitLink = $(".gift-pro a");
                // 
                $gitLink.on("click", function() {
                    var num = $(this).attr("attr-id");
                    $(".gift-pop .intro-" + num).removeClass("none");
                    _this.giftForm.show();
                });
            }
        }
    };


    // high翻8点 数据
    function hotFn(data,temp){
        
        var _html = '';
        
        utitl.forEach(data, function(index, item) {
            
            _html += temp.format(
                (function() {                    
                    var _url = comFn.createUrlPath({
                        specialId : thisObj.specialId,
                        lineId : item["StlLineId"],
                        lineType : item["StlLineType"],
                        lineDate : item["StlLineDate"],
                        moduleId : item["StlModuleId"],
                        key : item["Key"],
                        lid : lid,
                        batchId : item["StlRecommend"]
                    });                    
                    return '_href="' + _url + '"';
                }()),
                item["StlImageUrl"],
                (function() {
                    var price = 0;
                    if (item["StlLineType"] == 1) {
                        price = item["StlSellRate"];
                    }else{
                        price = item["ClsdMinPrice"];
                    }
                    return price;
                }()),
                (function(){
                    var CcName = item["CcName"];
                    var CiName = item["CiName"];
                    
                    var date = item["StlLineDate"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
                        return parseInt(m, 10) + "月" + parseInt(d, 10) + "日"
                    });
                    var StlViaPort = item["StlViaPort"];
                    var CliDays = item["CliDays"] + "日游";
                    var CliNights = item["CliNights"] + "晚";
                    return '【'+CcName+'-'+CiName+'】 '+ date + ' ' + StlViaPort + ' ' + CliNights + CliDays;
                }()),
                item["StlDescription"]
            );
        });
        
        return _html;
    }


    $(document).ready(function() {
        loader.startFn();
        thisObj.init();
    });
}(window, document, Zepto);
