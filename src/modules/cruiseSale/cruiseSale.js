/*
 *特卖页面改版
 *created by zd10831 2017-01-18
 */
!function (win, doc, $) {
    var comFn = require("./js/_comFns.js"),
        isApp = comFn.isApp,
        recordUserBehaviorObj = require("./js/_recordUserBehavior.js"),
        getProData = require("./js/_getProData.js"),
        countDown = require("./js/_countDown.js"),
        lid = comFn.getUrlParam("lid") || "",
        loader = comFn.loader({
            elem: $(".loading_div .loader").get(0)
        }),
        obj = {
            init: function () {
                this.specialId = _sid;
                this.needLid = comFn.getUrlParam("lid") ? "&lid=" + comFn.getUrlParam("lid") : "";
                // this.fixedObj.init();
                this.areaChooseObj.init();
                this.setScrollTopPos();
                this.topImgAndRuleObj.init();
                this.bindEvent();
                //初始化选择加载数据
                this.drawTabsModuleData(recordUserBehaviorObj.readData("tabChoiseKey") || "divs_con_temai");
            },
            bindEvent: function () {
                var that = this,
                    $win = $(win),
                    winH = $win.height(),
                    $toTopBut = $("#toTop");
                //点击页面中的a标签
                $(doc).on("click", "a", function () {
                    //记录当前滚动条的位置
                    recordUserBehaviorObj.changeData("winScrollTopPos", $(win).scrollTop());
                });
                //返回顶部
                $toTopBut.on("click", function () {
                    $win.scrollTop(0);
                    recordUserBehaviorObj.changeData("winScrollTopPos", 0)
                });
                $win.on("scroll", function (evt) {
                    var winScrollTop = $win.scrollTop();
                    if (winScrollTop >= winH * 0.7) {
                        $toTopBut.removeClass("none");
                    } else {
                        $toTopBut.addClass("none");
                    }
                });

                //tab切换
                $(".bus_cons .buts").on("click", function () {
                    var classKey = $(this).attr("_sk") || "";
                    that.tabChange(classKey);
                    that.drawTabsModuleData(classKey);
                    // setTimeout(function(){
                    // 	$(win).trigger("scroll");
                    // },200)
                });
            },
            //加载活动规则和头图
            topImgAndRuleObj: {
                init: function () {
                    this.draw(obj.areaChooseObj.areaId || "10");
                },
                load: function () {
                    var that = this;
                    if (this.dataLoading) return false;
                    this.dataLoading = true;
                    $.ajax({
                        url: "/youlun/cruisejson/CruisesaleJson?needTimer=1&moduleId=" + $(".rule_temai_rule").attr("_moduleId"),
                        dataType: "json",
                        success: function (data) {
                            that.dataLoading = false;
                            data = that.divideData(data);
                            that.DATA = comFn.dataReplaceProctol(data);
                            that.draw(obj.areaChooseObj.areaId || "10");
                        },
                        error: function () {
                            that.dataLoading = false;
                        }
                    });
                },
                draw: function (areaId) {
                    if (this.DATA === undefined) {
                        this.load();
                        return false
                    } else {
                        var areaData = this.DATA && this.DATA["area_" + areaId] ? this.DATA["area_" + areaId] : false,
                            hodongData = this.DATA && this.DATA["area_huodong"] ? this.DATA["area_huodong"] : false;
                        //绘制区域的规则
                        this.drawRuleCon($(".rule_temai_rule"), areaData.rule);
                        this.drawTopImg(areaId, areaData.topImg || "");
                        comFn.ruleConCtrl($(".rule_temai_rule"));
                        //绘制活动的规则
                        if (!this.drawHuodongRule) {
                            this.drawHuodongRule = true;
                            this.drawRuleCon($(".rule_huodong_rule"), hodongData.rule);
                            comFn.ruleConCtrl($(".rule_huodong_rule"));
                        }
                        // setTimeout(function(){
                        // 	comFn.ruleConCtrl($(".act_rule_con"));
                        // },100);
                    }
                },
                //划分下数据
                divideData: function (data) {
                    if (!data) return false;
                    var rs = {
                        area_10: {
                            topImg: "",
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        },
                        area_11: {
                            topImg: "",
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        },
                        area_12: {
                            topImg: "",
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        },
                        area_13: {
                            topImg: "",
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        },
                        area_14: {
                            topImg: "",
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        },
                        area_huodong: {
                            rule: {
                                hasRule: false,
                                title: "活动规则",
                                paragraphArr: []
                            }
                        }
                    };
                    if (data && data.TopicRemarkList && data.TopicRemarkList.length) {
                        var TopicRemarkList = data.TopicRemarkList || [];
                        for (var i = 0, len = TopicRemarkList.length; i < len; i++) {

                            var areaIdKey = TopicRemarkList[i].Key || "",
                                strValue = (TopicRemarkList[i].Value || "").replace(/^[\s\n]+|[\s\n]+$/g, ""),
                                tit = $.trim(TopicRemarkList[i].Name || "") || "",
                                ps = "",
                                imgSrc = "";
                            if (areaIdKey == 15) {
                                ps = strValue ? strValue.replace(/^\n+|\n+$/, "").replace(/\n+/, "\n") : "";
                                rs["area_huodong"]["rule"].title = tit || "活动规则";
                                rs["area_huodong"]["rule"].paragraphArr = ps ? ps.split("\n") : [];
                                rs["area_huodong"]["rule"].hasRule = rs["area_huodong"]["rule"].paragraphArr.length ? true : false;
                            } else {
                                if (areaIdKey && strValue) {
                                    spli = strValue.split("##");
                                    imgSrc = spli[0] || "";
                                    ps = spli[1] ? spli[1].replace(/^\n+|\n+$/, "").replace(/\n+/, "\n") : "";
                                    rs["area_" + areaIdKey]["topImg"] = imgSrc || "";
                                    rs["area_" + areaIdKey]["rule"].title = tit || "活动规则";
                                    rs["area_" + areaIdKey]["rule"].paragraphArr = ps ? ps.split("\n") : [];
                                    rs["area_" + areaIdKey]["rule"].hasRule = rs["area_" + areaIdKey]["rule"].paragraphArr.length ? true : false;
                                }


                            }

                        }
                    }
                    return $.extend(true, {}, rs);
                },
                //绘制特卖的的活动规则
                drawRuleCon: function ($elem, data) {
                    $elem.addClass("none");
                    var psStr = data.paragraphArr && data.paragraphArr.length ? data.paragraphArr.join("</p><p>") : "";
                    $elem.find(".sp_txt").html(data.title || "活动规则");
                    psStr = psStr && psStr.length ? ("<p>" + psStr + "</p>") : "";
                    if (psStr) {
                        $elem.removeClass("none");
                        $elem.find(".ts_sp").html(psStr || "");
                    }
                },
                //绘制头图
                drawTopImg: function (areaId, imgSrc) {
                    var that = this,
                        $imgCon = $(".content .top .top_img_default"),
                        defaultSrc = $imgCon.attr("defaultSrc"),
                        imgSrcLists = this.imgSrcLists,
                        $allImgS = $(".top_img");
                    if (areaId !== undefined) {
                        if (!imgSrcLists["area_" + areaId]) {
                            $imgElem = $('<img defaultSrc="' + defaultSrc + '" src="' + imgSrc + '" class="top_img none" alt="" />');
                            $(".top").append($imgElem);
                            imgSrcLists["area_" + areaId] = {
                                $imgElem: $imgElem
                            };
                            comFn.bindErrorImg($imgElem[0], defaultSrc);

                        }
                        $allImgS.addClass("none");
                        imgSrcLists["area_" + areaId].$imgElem.removeClass("none");
                    }


                },
                imgSrcLists: {}
            },
            //tab切换
            tabChange: (function () {
                var $allButs = $(".bus_cons .buts"),
                    $showCon = $(".divs_con"),
                    fn = function (classKey) {
                        if (typeof classKey != "string" || !classKey) return false;
                        $allButs.removeClass("active");
                        $allButs.each(function () {
                            var $this = $(this);
                            if ($this.attr("_sk") == classKey) {
                                $this.addClass("active")
                                return true;
                            }
                        });
                        $showCon.addClass("none");
                        $("." + classKey).removeClass("none");
                        recordUserBehaviorObj.changeData("tabChoiseKey", classKey);
                        //这样处理有问题的
                        comFn.ruleConCtrl($(".act_rule_con"));
                        return true;
                    },
                    readKey = recordUserBehaviorObj.readData("tabChoiseKey") || "divs_con_temai";
                //初始化默认
                fn(readKey);
                return fn;
            })(),
            //设置滚动条的位置 坑！
            setScrollTopPos: function () {
                var nowWinScroll = recordUserBehaviorObj.readData("winScrollTopPos") || 0;
                setTimeout(function () {
                    win.scrollTo(0, nowWinScroll);
                    $(win).trigger("scroll");
                }, 500);
            },
            //区域选择
            areaChooseObj: {
                init: function () {
                    var listAreaTxt = {area_10: "华东", area_11: "华南", area_12: "华北", area_13: "华中", area_14: "华西"};
                    this.areaId = $.trim($("#hidAreaId").val() || "") || "10";
                    this.areaShowTxt = listAreaTxt["area_" + this.areaId] || "华东";
                    var getUserAreaMsg = recordUserBehaviorObj.readData("userChoseAreaInfo"),
                        areaUserMsgObj = {};
                    if (getUserAreaMsg) {
                        //获取之前操作的的区域信息
                        areaUserMsgObj = JSON.parse(getUserAreaMsg);
                        this.areaId = areaUserMsgObj.areaId;
                        this.areaShowTxt = areaUserMsgObj.areaTxt;
                    }
                    $(".area_change_div .txt_sp").attr("_areaId", this.areaId).html(this.areaShowTxt);
                    $(".area_box .area_ul_list > li.act").removeClass("act")
                    $(".area_box .area_ul_list > li[_areaId='" + this.areaId + "']").addClass("act");
                    $(".area_change_div").removeClass("none");
                    this.bindEvent();
                },
                //区域弹框
                areaChoiseForm: comFn.alertFormCtrl({
                    showCon: $(".area_box"),
                    shadowBg: $(".shadow_bg"),
                    clickBgClose: false,
                    closeBut: $(".area_box .close_but"),
                    showAfterFn: function ($showCon) {
                        if (!$showCon || !$showCon[0]) return false;
                        if (!$showCon.iscd) { //是否计算过位置
                            $showCon.iscd = true;
                            comFn.domPosCenter($showCon[0])
                        }
                    },
                    showBeforeFn: function ($con, $bg) {
                        $bg.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                        $con.on(comFn.stopPropatationOption).on(comFn.scrollEventFn);
                        $(".area_change_div").addClass("active");

                    },
                    closeAfterFn: function ($con, $bg) {
                        $bg.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                        $con.off(comFn.stopPropatationOption).off(comFn.scrollEventFn);
                        $(".area_change_div").removeClass("active");
                    }
                }),
                bindEvent: function () {
                    if (this.bindEventOnce) return false;
                    this.bindEventOnce = true;
                    var that = this,
                        $showAreaBut = $(".area_change_div"),
                        $allAreaList = $(".area_box .area_ul_list > li"),
                        $showAreaTxt = $(".txt_sp", $showAreaBut[0]); //
                    //点击显示选择的区域列表
                    $showAreaBut.on("click", function () {
                        that.areaChoiseForm.show();
                    });
                    //选择区域列表
                    $allAreaList.on("click", function () {
                        var $this = $(this);
                        showTxt = $this.attr("_showTxt"),
                            areaId = $this.attr("_areaId"),
                            nowAreaId = $showAreaTxt.attr("_areaId") || 0;
                        $showAreaTxt.html(showTxt).attr("_areaId", areaId);
                        that.areaId = areaId;
                        //重新筛选这些数据
                        if (nowAreaId != areaId) {
                            //有切区域的的动作就删除上一个推荐中的实现数据
                            recordUserBehaviorObj.changeData("recomFilterButUserChosie_" + that.areaId, []);

                            $allAreaList.removeClass("act");
                            $this.addClass("act");
                            //将推荐中的筛选数据置为默认
                            recordUserBehaviorObj.changeData("recomFilterButUserChosie", "");
                            this.areaId = areaId;
                            //数据重新加载（）
                            obj.topImgAndRuleObj.draw(that.areaId);
                            obj.drawTabsModuleData(recordUserBehaviorObj.readData("tabChoiseKey") || "divs_con_temai");

                        }
                        that.areaChoiseForm.close();
                        //记录用户所选择的区域信息
                        recordUserBehaviorObj.changeData("userChoseAreaInfo", JSON.stringify({
                            areaId: areaId,
                            areaTxt: showTxt
                        }));
                    });
                }
            },
            //吸顶等所有关于fixed的交互
            fixedObj: {
                init: function () {
                    var obj = {};
                    $.extend(true, obj, this.fixAllCtrlObj)
                    for (key in obj) {
                        this[key] = obj[key];
                    }

                    this.bindEvent();
                },
                bindEvent: function () {
                    if (this.bindEventOnce) return false;
                    this.bindEventOnce = true;
                    var that = this;
                    $(win).on("scroll", function () {
                        var winScrollTop = $(win).scrollTop();
                        that.hotFixedBar(winScrollTop);
                    });
                },
                fixAllCtrlObj: {
                    //热门推荐的fixed
                    hotFixedBar: function (winTop) {
                        if (!winTop) return false;
                        var $hotRecomBarPar = $(".tab_con_div"),
                            $fixBar = $(".tab_con_div .bus_cons"),
                            isSupport = comFn.isSupportSticky;
                        if (isSupport) {
                            $hotRecomBarPar.css({"height": ($hotRecomBarPar.height() + 2) + "px"}).addClass("sticky");
                        } else {
                            this.hotFixedBar = function (winTop) {
                                if (winTop >= $hotRecomBarPar.offset().top) {
                                    $fixBar.addClass("to_fixed");
                                } else {
                                    $fixBar.removeClass("to_fixed");
                                }
                            }
                        }
                    }
                },
                //重置某个fixed方法 一般是位置节点计算
                restCtrlFn: function (fnName) {
                    if (!fnName || !this[fnName] || !this.fixAllCtrlObj[fnName]) return false;
                    this[fnName] = this.fixAllCtrlObj[fnName];
                    var winScrollTop = $(win).scrollTop();
                    this[fnName](winScrollTop);

                }
            },
            drawTabsModuleData: function (classKey) {
                var areaId = this.areaChooseObj.areaId || "10";
                obj.ctrlTabShowOrHide.count = 0;
                obj.todayQiaoObj.draw(areaId);
                obj.jingBaoWeicangObj.draw(areaId);
                obj.reXiaoYanXuanObj.draw(areaId);
            },
            //今日疯抢
            todayQiaoObj: {
                proTemp: '<a class="pro_a pro_a_type_01 sale_nobegin" _href="{{setUrl}}" href="{{setUrl}}">\
		                        <div class="img_box">\
		                            <span class="act_port">{{departureCitys}}出发</span>\
		                            <img class="pro_img" src="{{Pic}}" alt="" />\
		                            <div class="pro_tit_x">\
		                                <div class="sv">\
		                                    <h4>{{Title}}</h4>\
		                                </div>\
		                            </div>\
		                            <div class="s_show_bg"></div>\
		                        </div>\
		                        <div class="text_box">\
		                            <div class="recom_d {{RecommandShow}}">\
		                                <em class="s_em"></em>{{Recommand}}\
		                            </div>\
		                            <div class="price_div">\
		                                <span class="sp_txt">秒杀价</span><span class="price_s">&yen;<strong>{{Price}}</strong>起</span>{{showCuXiao}}\
		                            </div>\
		                            <span class="s_but" >查看详情</span>\
		                        </div>\
		                    </a>',
                moduleId: $(".scon_div_jrfq").attr("_moduleId"),
                load: function (areaId) {
                    var that = this;
                    if (this.dataLoading) return false;
                    this.dataLoading = true;
                    getProData({
                        moduleId: this.moduleId,
                        lid: lid,
                        isTimeLmit: true,
                        fn: function (data) {
                            that.dataLoading = false;
                            that.setSubHeader($(".scon_div_jrfq .fu_tit"), data.subHeader || "");
                            that.DATA = comFn.dataReplaceProctol(data);
                            that.DATA = comFn.rpPicUrlSizeToNormal(that.DATA);
                            that.draw(areaId);
                            obj.setScrollTopPos();
                        }
                    });
                },
                draw: function (areaId) {
                    var that = this;
                    if (this.DATA === undefined) {
                        this.load(areaId);
                        return false;
                    }
                    if (areaId && this.oldAreaId && this.oldAreaId == areaId) {//目前展示的已经是绘制的数据直接return掉
                        return false;
                    }
                    var proData = this.DATA && this.DATA.areaData && this.DATA.areaData["area_" + areaId] ? this.DATA.areaData["area_" + areaId] : [],
                        timeLimit = this.DATA && this.DATA.timeLimit ? this.DATA.timeLimit : {},
                        $showProCon = $(".scon_div_jrfq"),
                        count = 0;
                    this.oldAreaId = areaId;
                    $showProCon.addClass("none").find(".con_list").html("").html(comFn.dataToStr({
                        jsonData: proData || [],
                        temp: that.proTemp,
                        // showLen : 1,
                        circleFilterData: function (item, index) {
                            item.RecommandShow = item.Recommand && item.Recommand.length ? " " : " none ";
                            item.showCuXiao = typeof item.LabelRight == "string" && /促/.test(item.LabelRight) ? '<span class="cu_s">促</span>' : '';
                            item.setUrl = comFn.createUrlPath({
                                lineId: item.LineId,
                                lineDate: item.LineDate,
                                lineType: item.LineType,
                                specialId: obj.specialId,
                                key: item.Key,
                                moduleId: that.moduleId,
                                lid: lid,
                                batchId: item.PhoneManage && /^[0-9]+$/.test(item.PhoneManage) ? item.PhoneManage : ""
                            });
                            if (item.OtherSite != 0) {
                                count++;
                            }
                            return item.OtherSite != 0 ? item : false;
                        }
                    }));

                    that.count = count;

                    if (count > 0 && proData && proData.length && timeLimit && timeLimit.startTime && timeLimit.endTime) {
                        this.bindCountDown(timeLimit);
                        $showProCon.removeClass("none");
                        comFn.webpAndLazy($showProCon.find(".pro_img"));

                        obj.ctrlTabShowOrHide.ctrlFn({
                            todayQiaoObj: true
                        });
                    } else {
                        if (this.timer && this.timer.destory) {//清楚前一个倒计时
                            this.timer.destory();
                        }
                        obj.ctrlTabShowOrHide.ctrlFn({
                            todayQiaoObj: false
                        });
                    }
                },
                //设置副标题//that.setSubHeader($(".scon_div_jrfq .fu_tit"),data.subHeader || "");
                setSubHeader: function ($conElem, subHeaderStr) {
                    var $subHeaderCon = $conElem,
                        $sunHeaderTxt = $subHeaderCon.find(".txt .show_txt");
                    $subHeaderCon.addClass("none");
                    $sunHeaderTxt.html("");
                    if (subHeaderStr && typeof subHeaderStr == "string") {
                        $sunHeaderTxt.html(subHeaderStr);
                        $subHeaderCon.removeClass("none");
                    }
                },
                oldAreaId: 0,
                count: 0,
                //绑定一个倒计时
                bindCountDown: function (timeLimit) {
                    var that = this,
                        $timerCon = $(".scon_div_jrfq .timer_con"),
                        $typeTxt = $timerCon.find(".t_type_txt"),
                        $timerCellCon = $timerCon.find(".t_tysd"),
                        $DD = $timerCellCon.find(".em_DD"),
                        $HH = $timerCellCon.find(".em_HH"),
                        $MM = $timerCellCon.find(".em_MM"),
                        $SS = $timerCellCon.find(".em_SS"),
                        $allAs = $(".scon_div_jrfq .con_list a.pro_a");
                    if (this.timer && this.timer.destory) {//清楚前一个倒计时
                        this.timer.destory();
                    }
                    if (timeLimit && timeLimit.startTime && timeLimit.endTime) {
                        $.ajax({
                            url: "/youlun/json/getsystime.html",
                            type: "get",
                            dataType: "json",
                            success: function (data) {
                                if (data && data.nowTime) {
                                    that.timer = countDown({
                                        starTime: timeLimit.startTime,
                                        endTime: timeLimit.endTime,
                                        nowTime: data.nowTime,
                                        updateFn: function (t, b) {
                                            $DD.html(t.day <= 9 ? ("0" + t.day) : t.day);//
                                            $HH.html(t.hour <= 9 ? ("0" + t.hour) : t.hour);
                                            $MM.html(t.minute <= 9 ? ("0" + t.minute) : t.minute);
                                            $SS.html(t.second <= 9 ? ("0" + t.second) : t.second);
                                        },
                                        nobeginFn: function () {
                                            $typeTxt.html("距离抢购开始");
                                            $timerCellCon.removeClass("none");
                                            $allAs.removeClass("sale_end").addClass("sale_nobegin");
                                            $allAs.find(".s_but").html("查看详情");
                                            $allAs.each(function () {
                                                var $this = $(this);
                                                $this.attr("href", $this.attr("_href"));
                                            });

                                        },
                                        ingFn: function () {
                                            $typeTxt.html("距离抢购结束");
                                            $timerCellCon.removeClass("none");
                                            $allAs.removeClass("sale_end sale_nobegin");
                                            $allAs.find(".s_but").html("立即预订");
                                            $allAs.each(function () {
                                                var $this = $(this);
                                                $this.attr("href", $this.attr("_href"));
                                            });
                                        },
                                        endFn: function () {
                                            $typeTxt.html("抢购已结束");
                                            $allAs.removeClass("sale_nobegin").addClass("sale_end");
                                            $allAs.find(".s_but").html("已售罄");
                                            $allAs.attr("href", "javascript:void(0);")
                                            // $timerCellCon.addClass("none");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            },
            //劲爆尾仓
            jingBaoWeicangObj: {
                moduleId: $(".scon_div_jbwc").attr("_moduleId"),//this.moduleId
                proTemp: '<a class="pro_a pro_a_type_02" href="{{setUrl}}">\
		                        <div class="dis_c clearfix">\
		                            <div class="img_box">\
		                                <span class="act_port">{{departureCitys}}出发</span>\
		                                <img class="pro_img" src="{{Pic}}" alt="" />\
		                                <div class="pro_tit_x">\
		                                    <div class="sv">\
		                                        <h4>{{LineDateStr}}</h4>\
		                                    </div>\
		                                </div>\
		                            </div>\
		                            <div class="text_box">\
		                                <h4 class="tit_h4">{{CompanyName}}-{{ShipName}}</h4>\
		                                <p class="s_ps">{{TransPort}}</p>\
		                                <div class="price_div">\
		                                    <span class="price_s">&yen;<strong>{{Price}}</strong>起</span>{{showCuXiao}}\
		                                </div>\
		                            </div>\
		                        </div>\
		                        <div class="recom_d {{RecommandShow}}">\
		                            <em class="s_em"></em> {{Recommand}}\
		                        </div>\
		                    </a>',
                load: function (areaId) {
                    var that = this;
                    if (this.dataLoading) return false;
                    this.dataLoading = true;
                    getProData({
                        moduleId: this.moduleId,
                        lid: lid,
                        isTimeLmit: true,
                        fn: function (data) {
                            that.dataLoading = false;
                            that.setSubHeader($(".scon_div_jbwc .fu_tit"), data.subHeader || "");
                            that.DATA = comFn.dataReplaceProctol(data);
                            that.draw(areaId);
                            obj.setScrollTopPos();
                        }
                    });
                },
                draw: function (areaId) {
                    var that = this;
                    if (this.DATA === undefined) {
                        this.load(areaId);
                        return false;
                    }
                    if (areaId && this.oldAreaId && this.oldAreaId == areaId) {//目前展示的已经是绘制的数据直接return掉
                        return false;
                    }
                    var proData = this.DATA && this.DATA.areaData && this.DATA.areaData["area_" + areaId] ? this.DATA.areaData["area_" + areaId] : [];
                    $showProCon = $(".scon_div_jbwc"),
                        count = 0;
                    this.oldAreaId = areaId;
                    $showProCon.addClass("none").find(".con_list").html("").html(comFn.dataToStr({
                        jsonData: proData || [],
                        temp: that.proTemp,
                        // showLen : 1,
                        circleFilterData: function (item, index) {
                            item.RecommandShow = item.Recommand && item.Recommand.length ? " " : " none ";
                            item.LineDateStr = item.LineDate.replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function (a, y, m, d) {
                                return y + "年" + parseInt(m, 10) + "月" + parseInt(d, 10) + "日"
                            });
                            item.showCuXiao = typeof item.LabelRight == "string" && /促/.test(item.LabelRight) ? '<span class="cu_s">促</span>' : '';
                            // item.setUrl=(isApp&&item.LineType==0?("/youlun/tours/"+item.LineId+"_"+obj.specialId+"_1.html?saildate="+item.LineDate):(item.LineType!=0?createUrl('/youlun/Promotion2016.html?lineId=' + item.LineId + '&specialId=' + obj.specialId + '&ModuleId=' + that.moduleId + '&LineDate=' + item.LineDate + obj.needLid + "&Key=" + item.Key):createUrl('/youlun/tours/' + item.LineId +".html?&Key=" + item.Key)));
                            item.setUrl = comFn.createUrlPath({
                                lineId: item.LineId,
                                lineDate: item.LineDate,
                                lineType: item.LineType,
                                specialId: obj.specialId,
                                key: item.Key,
                                moduleId: that.moduleId,
                                lid: lid,
                                batchId: item.PhoneManage && /^[0-9]+$/.test(item.PhoneManage) ? item.PhoneManage : ""
                            });
                            if (item.OtherSite != 0) {
                                count++;
                            }
                            return item.OtherSite != 0 ? item : false;
                        }
                    }));
                    if (count > 0 && proData && proData.length) {
                        $showProCon.removeClass("none");
                        //图片延迟加载
                        comFn.webpAndLazy($showProCon.find(".pro_img"));
                        obj.ctrlTabShowOrHide.ctrlFn({
                            jingBaoWeicangObj: true
                        });
                    } else {
                        obj.ctrlTabShowOrHide.ctrlFn({
                            jingBaoWeicangObj: false
                        });
                    }
                },
                oldAreaId: 0,
                //设置副标题
                setSubHeader: function ($conElem, subHeaderStr) {
                    var $subHeaderCon = $conElem,
                        $sunHeaderTxt = $subHeaderCon.find(".txt .show_txt");
                    $subHeaderCon.addClass("none");
                    $sunHeaderTxt.html("");
                    if (subHeaderStr && typeof subHeaderStr == "string") {
                        $sunHeaderTxt.html(subHeaderStr);
                        $subHeaderCon.removeClass("none");
                    }
                }
            },
            //热销严选
            reXiaoYanXuanObj: {
                proTemp: '<a class="pro_a pro_a_type_02" href="{{setUrl}}">\
		                        <div class="dis_c clearfix">\
		                            <div class="img_box">\
		                                <span class="act_port">{{departureCitys}}出发</span>\
		                                <img class="pro_img" src="{{Pic}}" alt="" />\
		                                <div class="pro_tit_x">\
		                                    <div class="sv">\
		                                        <h4>{{LineDateStr}}</h4>\
		                                    </div>\
		                                </div>\
		                            </div>\
		                            <div class="text_box">\
		                                <h4 class="tit_h4">{{CompanyName}}-{{ShipName}}</h4>\
		                                <p class="s_ps">{{TransPort}}</p>\
		                                <div class="price_div">\
		                                    <span class="price_s">&yen;<strong>{{Price}}</strong>起</span>{{showCuXiao}}\
		                                </div>\
		                            </div>\
		                        </div>\
		                        <div class="recom_d {{RecommandShow}}">\
		                            <em class="s_em"></em> {{Recommand}}\
		                        </div>\
		                    </a>',
                moduleId: $(".scon_div_rxyx").attr("_moduleId"),//this.moduleId
                load: function (areaId) {
                    var that = this;
                    if (this.dataLoading) return false;
                    this.dataLoading = true;
                    getProData({
                        moduleId: this.moduleId,
                        lid: lid,
                        isTimeLmit: true,
                        fn: function (data) {
                            that.dataLoading = false;
                            that.setSubHeader($(".scon_div_rxyx .fu_tit"), data.subHeader || "");
                            that.DATA = comFn.dataReplaceProctol(data);
                            that.draw(areaId);
                            obj.setScrollTopPos();
                        }
                    });
                },
                draw: function (areaId) {
                    var that = this;
                    if (this.DATA === undefined) {
                        this.load(areaId);
                        return false;
                    }
                    if (areaId && this.oldAreaId && this.oldAreaId == areaId) {//目前展示的已经是绘制的数据直接return掉
                        return false;
                    }
                    var proData = this.DATA && this.DATA.areaData && this.DATA.areaData["area_" + areaId] ? this.DATA.areaData["area_" + areaId] : [];
                    $showProCon = $(".scon_div_rxyx"),
                        count = 0;
                    this.oldAreaId = areaId;
                    $showProCon.addClass("none").find(".con_list").html("").html(comFn.dataToStr({
                        jsonData: proData || [],
                        temp: that.proTemp,
                        // showLen : 1,
                        circleFilterData: function (item, index) {
                            item.RecommandShow = item.Recommand && item.Recommand.length ? " " : " none ";
                            item.showCuXiao = typeof item.LabelRight == "string" && /促/.test(item.LabelRight) ? '<span class="cu_s">促</span>' : '';
                            item.LineDateStr = item.LineDate.replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function (a, y, m, d) {
                                return y + "年" + parseInt(m, 10) + "月" + parseInt(d, 10) + "日"
                            });
                            item.setUrl = comFn.createUrlPath({
                                lineId: item.LineId,
                                lineDate: item.LineDate,
                                lineType: item.LineType,
                                specialId: obj.specialId,
                                key: item.Key,
                                moduleId: that.moduleId,
                                lid: lid,
                                batchId: item.PhoneManage && /^[0-9]+$/.test(item.PhoneManage) ? item.PhoneManage : ""
                            });
                            if (item.OtherSite != 0) {
                                count++;
                            }
                            return item.OtherSite != 0 ? item : false;
                        }
                    }));
                    if (count > 0 && proData && proData.length) {
                        $showProCon.removeClass("none");
                        //图片延迟加载
                        comFn.webpAndLazy($showProCon.find(".pro_img"));
                        obj.ctrlTabShowOrHide.ctrlFn({
                            reXiaoYanXuanObj: true
                        });
                    } else {
                        obj.ctrlTabShowOrHide.ctrlFn({
                            reXiaoYanXuanObj: false
                        });
                    }
                },
                oldAreaId: 0,
                //设置副标题
                setSubHeader: function ($conElem, subHeaderStr) {
                    var $subHeaderCon = $conElem,
                        $sunHeaderTxt = $subHeaderCon.find(".txt .show_txt");
                    $subHeaderCon.addClass("none");
                    $sunHeaderTxt.html("");
                    if (subHeaderStr && typeof subHeaderStr == "string") {
                        $sunHeaderTxt.html(subHeaderStr);
                        $subHeaderCon.removeClass("none");
                    }
                }
            },
            //控制顶部的tab是否呈现
            ctrlTabShowOrHide: {
                listKey: {
                    todayQiaoObj: false,
                    jingBaoWeicangObj: false,
                    reXiaoYanXuanObj: false
                },
                count: 0,
                limitLen: 3,
                ctrlFn: function (params) {
                    if (!params) return false;
                    var listKey = this.listKey || {};
                    for (var k in params) {
                        if (listKey[k] !== undefined) {
                            listKey[k] = params[k];
                            this.count++;
                            // break;
                        }
                    }
                    if (this.limitLen <= this.count) {
                        this.showOrHide();
                        //loader效果
                        loader.endFn();
                        $(".content").removeClass("none");
                        comFn.ruleConCtrl($(".act_rule_con"));
                    }

                },
                showOrHide: function () {
                    var listKey = this.listKey || {},
                        $bar = $(".content .tab_con_div"),
                        showTeMai = ( listKey["todayQiaoObj"] || listKey["jingBaoWeicangObj"] || listKey["reXiaoYanXuanObj"]) ? true : false;
                    $bar.addClass("none");
                    if (showTeMai) {
                        $(".divs_con_temai").removeClass("none")
                    } else {
                        $(".divs_con_temai").addClass("none")
                    }
                }
            }
        };

    $(doc).ready(function () {
        loader.startFn();
        getJobNumber(function () {
            obj.init();
        });
    });
}(window, document, Zepto);
