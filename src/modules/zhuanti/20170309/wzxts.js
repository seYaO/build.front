! function(window, document, $) {
    var utitl = require("../../../utils/cruise.utility.js");
    var comFn = require("./js/_comFns.js");
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
            this.specialId = $("#HidSpecialId").val();
            this.areaChooseObj.init();
            this.giftPopObj.init();
            this.bindEvent();
        },
        bindEvent: function() {
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
                    _this.draw(areaId);
                    loader.endFn();
                    $(".content").removeClass("none");
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
            var hotTemplate = $("#hotTemplate").html();
            var dataTemplate = $("#dataTemplate").html();
            // console.log(areaData)

            function fn(data) {
                var _html = '';
                utitl.forEach(data.slice(0, 4), function(index, item) {
                    _html += dataTemplate.format(
                        (function() {
                            // var _url = '//m.ly.com';
                            var _url = '';
                            if (item["StlLineType"] == 0) {
                                _url += "/youlun/tours/" + item["StlLineId"] + ".html?&saildate=" + item["StlLineDate"] + "&Key=" + item["Key"] + "&Lid=" + lid;
                            }
                            if (item["StlLineType"] == 2) {
                                _url += "/youlun/Promotion2016.html?lineId=" + item["StlLineId"] + "&specialId=" + thisObj.specialId + "&ModuleId=" + item["StlModuleId"] + "&LineDate=" + item["StlLineDate"] + "&Key=" + item["Key"] + "&Lid=" + lid;
                            }
                            return _url;
                        }()),
                        item["StlImageUrl"],
                        (function() {
                            return item["OutPortCity"].length > 8 ? item["OutPortCity"].slice(0, 8) : item["OutPortCity"];
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
                            var StlRecommend = item["StlRecommend"] ? '<span>' + item["StlRecommend"].slice(0, 5) + '</span>' : '';
                            var StlDiscount = item["StlDiscount"] ? '<span style="border-color: #fe64b4;color:#fe64b4;">' + item["StlDiscount"].slice(0, 4) + '</span>' : '';
                            return StlRecommend + StlDiscount;
                        }()),
                        (function() {
                            var price = 0;
                            if (item["StlLineType"] == 0) {
                                price = item["ClsdMinPrice"];
                            }
                            if (item["StlLineType"] == 2) {
                                price = item["ActivePrice"];
                            }
                            return price;
                        }())
                    );
                });
                return _html;
            }

            if (areaData) {
                // 爆款抢购
                var hotData = areaData["hot"] && areaData["hot"][0];
                var hotHtml = "";
                if (hotData) {
                    hotHtml = hotTemplate.format(
                        (function() {
                            var _url = hotData["StlRecommend"];
                            // if (hotData["StlLineType"] == 0) {
                            //     _url = "/youlun/tours/" + hotData["StlLineId"] + ".html?&Key=" + hotData["Key"] + "&Lid=" + lid;
                            // }
                            // if (hotData["StlLineType"] == 2) {
                            //     _url = "/youlun/Promotion2016.html?lineId=" + hotData["StlLineId"] + "&specialId=" + thisObj.specialId + "&ModuleId=" + hotData["StlModuleId"] + "&LineDate=" + hotData["StlLineDate"] + "&Key=" + hotData["Key"] + "&Lid=" + lid;
                            // }
                            return '_href="' + _url + '"';
                        }()),
                        hotData["StlImageUrl"],
                        hotData["CcName"] + "-" + hotData["CiName"],
                        (function() {
                            var date = hotData["StlLineDate"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
                                return parseInt(m, 10) + "月" + parseInt(d, 10) + "日"
                            });
                            var StlViaPort = hotData["StlViaPort"];
                            var CliDays = hotData["CliDays"] + "日游";
                            var CliNights = hotData["CliNights"] + "晚";
                            return date + " " + StlViaPort + " " + CliNights + CliDays;
                        }()),
                        (function() {
                            var StlDescription = hotData["StlDescription"].replace(/#/g, "<br/>");
                            StlDescription = StlDescription ? '<i class="icon-img"></i>' + StlDescription : '';
                            return StlDescription;
                        }()),
                        (function() {
                            var price = 0;
                            if (hotData["StlLineType"] == 0) {
                                price = hotData["ClsdMinPrice"];
                            }
                            if (hotData["StlLineType"] == 1) {
                                price = hotData["StlSellRate"];
                            }
                            if (hotData["StlLineType"] == 2) {
                                price = hotData["ActivePrice"];
                            }
                            return price;
                        }()),
                        (function() {
                            return '<span class="btn">疯狂抢购</span>';
                        }())
                    );
                    $(".unit-hot").removeClass("none");
                    $(".hot-pro").html(hotHtml);
                    var timeLimit = {
                        startTime: "",
                        endTime: ""
                    };
                    timeLimit.startTime = hotData["StlBeginTime"];
                    timeLimit.endTime = hotData["StlEndTime"];
                    _this.bindCountDown(timeLimit);
                } else {
                    $(".unit-hot").addClass("none");
                    if (this.timer && this.timer.destory) { //清除前一个倒计时
                        this.timer.destory();
                    }
                }

                // 小资赏花购物之旅
                var shoppingData = areaData["shopping"];
                if (shoppingData && shoppingData[0]) {
                    $(".unit-shopping").removeClass("none");
                    $(".unit-shopping .data-pro").html(fn(shoppingData));
                } else {
                    $(".unit-shopping").addClass("none");
                }

                // 浪漫奢华之旅
                var luxuryData = areaData["luxury"];
                if (luxuryData && luxuryData[0]) {
                    $(".unit-luxury").removeClass("none");
                    $(".unit-luxury .data-pro").html(fn(luxuryData));
                } else {
                    $(".unit-luxury").addClass("none");
                }

                // 挑战冒险之旅
                var adventureData = areaData["adventure"];
                if (adventureData && adventureData[0]) {
                    $(".unit-adventure").removeClass("none");
                    $(".unit-adventure .data-pro").html(fn(adventureData));
                } else {
                    $(".unit-adventure").addClass("none");
                }
                //图片延迟加载
                comFn.webpAndLazy($(".detail-unit").find(".pro_img"));
            }

            var jumpPortal = this.DATA && this.DATA.jumpPortal;
            if (jumpPortal && this.isLoad) {
                var jumpHtml = '';
                var jumpTemp = '<a href="{0}" class="banner-link"><img class="jump_img" data-nsrc="{1}" alt=""></a>';
                jumpHtml = jumpTemp.format(jumpPortal.url, jumpPortal.img);
                $(".unit-banner").html(jumpHtml);
                //图片延迟加载
                comFn.webpAndLazy($(".detail-unit").find(".jump_img"));
                this.isLoad = false;
            }
        },
        //绑定一个倒计时
        bindCountDown: function(timeLimit) {
            var _this = this,
                $allAs = $(".hot-pro .hot-link");
            if (this.timer && this.timer.destory) { //清除前一个倒计时
                this.timer.destory();
            }
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
                                },
                                nobeginFn: function() {
                                    // console.log("抢购未开始");
                                    $allAs.find(".btn").html("抢购未开始").css({ "background-color": "#fb3359" });
                                    $allAs.each(function() {
                                        var $this = $(this);
                                        $this.attr("href", $this.attr("_href"));
                                    });

                                },
                                ingFn: function() {
                                    // console.log("疯狂抢购");
                                    $allAs.find(".btn").html("疯狂抢购").css({ "background-color": "#fb3359" });
                                    $allAs.each(function() {
                                        var $this = $(this);
                                        $this.attr("href", $this.attr("_href"));
                                    });
                                },
                                endFn: function() {
                                    // console.log("抢购已结束");
                                    $allAs.find(".btn").html("抢购已结束").css({ "background-color": "#ccc" });
                                    $allAs.attr("href", "javascript:void(0);")
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


    $(document).ready(function() {
        loader.startFn();
        thisObj.init();
    });
}(window, document, Zepto);
