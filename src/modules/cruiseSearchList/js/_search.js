var Base64 = require("./_base64.js");
var burying = require("./_burying.js"); //邮轮搜索页埋点统计
var utility = require("../../../utils/cruise.utility.js");
var searchObj = require('./_searchObj');

;
! function($, window, document, undefined) {
    var obj = obj || {};

    $.extend(obj, {
        init: function() {
            page.init();
            this.resetParam();
            this.bindEvent();
            this.filterObj.draw();
            this.filterObj.synchView();
            this.productObj.init();
        },
        bindEvent: function() {
            var that = this;
            $(".search-btn").unbind("click.filterListObj")
                .bind("click.filterListObj", function() {
                    page.open("search");
                });
        },
        resetParam: function() {
            this.paramObj = $.extend(true, {}, this.paramObj, {
                RouteLineId: $('#crusieRouteLineId').val(), //航线
                Month: $('#month').val(), //出游时间
                Startcity: $('#StartcityId').val(), //出发港口
                CompanyId: $('#companyId').val(), //邮轮公司
                minprice: $('#minprice').val(), //最小值
                maxprice: $('#maxprice').val(), //最大值
                Days: $('#days').val(), //出游天数
                SubRouteId: $('#subRouteId').val(), //细分（2级）航线
                ShipId: $('#subShipId').val(), //邮轮Id
                isLyLine: $('#subIsLyLine').val(), //同程专线
                isBlh: parPosInt($('#isBlh').val(), 10), //百旅会，0否，1是
                isprop: $('#prop').val()
            });
            return this.paramObj;
        },
        filterToggle: {
            open: function() {
                var $btn = $(".filter-title>a.active"),
                    index = $btn.index(),
                    $conts = $(".filter-dropdown").find(".filter-line,.filter-ships,.filter-sub,.filter-sort"),
                    $cont = $conts.eq(index);
                if (!($btn && $btn.length)) return false;
                $cont.removeClass("none").siblings().addClass("none");
                $cont.css("margin-top", "").animate({ "margin-top": "0" }, 300, 'ease-out');
                $(".layer").removeClass("none");
            },
            close: function() {
                var $btn = $(".filter-title>a.active"),
                    index = $btn.index(),
                    $conts = $(".filter-dropdown").find(".filter-line,.filter-ships,.filter-sub,.filter-sort"),
                    $cont = $conts.eq(index);
                if (!($btn && $btn.length)) return false;
                $btn.removeClass("active");
                $(".layer").addClass("none");
                $cont.animate({ "margin-top": "" }, 300, 'ease-out');
                setTimeout(function() {
                    $conts.addClass("none");
                }, 200);
            }
        },
        filterObj: {
            urlStr: "/youlun/json/LowPriceLines.html?RouteLineId={0}&SubRouteId={1}{2}",
            hotShips: [123, 207, 95, 162, 313, 44],
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.ajaxObj = $.ajax({
                    url: this.urlStr.format(obj.paramObj.RouteLineId, obj.paramObj.SubRouteId, ""),
                    success: function(data) {
                        if (data && data["cruiseList"] && data["State"] == "100") {
                            that.DATA = data["cruiseList"];
                            that.draw();
                        }
                    }
                })
            },
            draw: function() {
                var data = this.DATA,
                    that = this,
                    temp = "",
                    urlTemp = "/youlun/cruise-line-{0}-{1}-{2}-{3}-{4}-{5}-{6}-{7}-{8}-{9}.html{10}{11}",
                    _str = "",
                    referVal, //参考值
                    _referVal, //第二个参考值
                    _param,
                    lid = utility.getUrlParam("lid");
                if (!data) {
                    this.load();
                    this.bindEvent();
                    return false;
                }
                _param = obj.resetParam();
                /**** 航线开始  ***/
                temp = "<a class='{0}' href='{1}' {3}><p>{2}</p></a>";
                _str = "<div class='filter-list'>";
                referVal = parPosInt(_param.RouteLineId);
                _referVal = parPosInt(_param.SubRouteId);
                utility.forEach(data["CrusieRouteLines"] || [], function(index, item) {
                    _str += temp.format(
                        referVal == parPosInt(item["CrusieRouteLineId"]) && _referVal == 0 ? "active" : "",
                        referVal == parPosInt(item["CrusieRouteLineId"]) && _referVal == 0 ? "javascript:;" : urlTemp.format(
                            item["CrusieRouteLineId"],
                            0, //_param.Startcity 重置出发城市
                            0, //_param.Days 重置行程天数
                            0, //_param.CompanyId 重置邮轮公司
                            0, //_param.Math 重置出游时间
                            0, //_param.minprice 重置价格区间（最小值）
                            0, //_param.maxprice 重置价格区间（最大值）
                            0, //_param.ShipId 重置邮轮ID
                            0, //_param.SubRouteId （这里是一级航线，不需要二级航线）
                            _param.isLyLine, //是否同程专线
                            lid && lid.length ? "?lid=" + lid : "?lid=76",
                            _param.isBlh ? "&IsTcBlh=1" : "" //是否百旅会
                        ),
                        item["CrusieRouteLineName"],
                        "txt-attr='" + item["CrusieRouteLineName"] + "'"
                    );
                    utility.forEach(item["CruiseSubRouteList"] || [], function(_index, _item) {
                        _str += temp.format(
                            _referVal == parPosInt(_item["CruiseSubRouteLineId"]) && _referVal != 0 ? "fl-sub active" : "fl-sub",
                            _referVal == parPosInt(_item["CruiseSubRouteLineId"]) && _referVal != 0 ? "javascript:;" : urlTemp.format(
                                item["CrusieRouteLineId"],
                                0, //_param.Startcity 重置出发城市
                                0, //_param.Days 重置行程天数
                                0, //_param.CompanyId 重置邮轮公司
                                0, //_param.Math 重置出游时间
                                0, //_param.minprice 重置价格区间（最小值）
                                0, //_param.maxprice 重置价格区间（最大值）
                                0, //_param.ShipId 重置邮轮ID
                                _item["CruiseSubRouteLineId"], //_param.SubRouteId （加上二级航线）
                                _param.isLyLine, //是否同程专线
                                lid && lid.length ? "?lid=" + lid : "?lid=76",
                                _param.isBlh ? "&IsTcBlh=1" : "" //是否百旅会
                            ),
                            _item["CruiseSubRouteLineName"],
                            "txt-attr='" + _item["CruiseSubRouteLineName"] + "'"
                        );
                    });
                });
                _str += "</div>";
                $(".filter-line").empty().append(_str);
                /**** 航线结束  ***/

                /**** 船队开始  ***/
                referVal = parPosInt(_param.CompanyId);
                _str = "";
                utility.forEach(data["Companys"] || [], function(index, item) {
                    _str += temp.format(
                        (function() {
                            if (referVal == 0 && index == 0) return "active";
                            if (referVal == item["CompanyId"]) return "current active";
                        }()),
                        "javascript:;",
                        item["CompanyName"],
                        "id-attr='" + item["CompanyId"] + "'"
                    )
                });
                $(".filter-ships .fs-left").empty().append("<div class='filter-list'>" + _str + "</div>");
                $(".filter-ships .fs-right").empty();
                /**** 船队结束  ***/

                /***  筛选开始 ***/
                str = getFilterStr(data);

                /***  筛选结束 ***/
                $(".filter-sub .fsub-selected").empty().append(str[1]);
                $(".filter-sub .fsub-left").empty().append(str[2]);
                $(".filter-sub .fsub-right").empty().append(str[0]);

                that.synchView();
                this.bindEvent();

                this.shipDraw();
                this.selectSubFn();
            },
            shipLoad: function(id) {
                var that = this;
                if (this.shipAjaxObj) this.shipAjaxObj.abort();
                this.shipAjaxObj = $.ajax({
                    url: this.urlStr.format(obj.paramObj.RouteLineId, obj.paramObj.SubRouteId, "&company=" + id),
                    success: function(data) {
                        if (data && data["cruiseList"] && data["cruiseList"]["ShipInfos"] && data["State"] == "100") {
                            that.shipDATA = that.shipDATA || {};
                            that.shipDATA[id] = data["cruiseList"]["ShipInfos"];
                            that.shipDraw();
                        }
                    }
                });
            },
            shipDraw: function() {
                var $item = $(".filter-ships .fs-left a.active"),
                    id = $.trim($item.attr("id-attr")),
                    data = this.shipDATA || {},
                    str = "<div class='filter-list' id-attr='" + id + "'>",
                    temp = "<a class='{0}' href='{1}' {3}>{2}</a>",
                    urlTemp = "/youlun/cruise-line-{0}-{1}-{2}-{3}-{4}-{5}-{6}-{7}-{8}-{9}.html{10}{11}",
                    _param, lid = utility.getUrlParam("lid"),
                    that = this;
                if (!($item && $item.length == 1)) return false;
                $item = $(".filter-ships .fs-right .filter-list[id-attr='" + id + "']");
                if ($item && $item[0]) {
                    $item.removeClass("none").siblings().addClass("none");
                    return false;
                }
                data = data[id];
                if (!data) {
                    this.shipLoad(id);
                    return false;
                }

                _param = obj.resetParam();
                str += temp.format(
                    _param.ShipId == "0" && id == _param.CompanyId ? "active" : "",
                    //_param.ShipId=="0" && id==_param.CompanyId?"javascript:;":urlTemp.format(
                    urlTemp.format(
                        _param.RouteLineId,
                        0, //_param.Startcity 重置出发城市
                        0, //_param.Days 重置行程天数
                        _param.ShipId == "0" && id == _param.CompanyId ? 0 : id, //_param.CompanyId 重置邮轮公司
                        0, //_param.Math 重置出游时间
                        0, //_param.minprice 重置价格区间（最小值）
                        0, //_param.maxprice 重置价格区间（最大值）
                        0, //_param.ShipId 重置邮轮ID
                        _param.SubRouteId, //_param.SubRouteId （加上二级航线）
                        _param.isLyLine, //是否同程专线
                        lid && lid.length ? "?lid=" + lid : "?lid=76",
                        _param.isBlh ? "&IsTcBlh=1" : "" //是否百旅会
                    ),
                    "不限",
                    "txt-attr='不限'"
                );
                utility.forEach(data || [], function(index, item) {
                    str += temp.format(
                        _param.ShipId == item["ShipId"] ? "active" : "",
                        //_param.ShipId==item["ShipId"]?"javascript:;":urlTemp.format(
                        urlTemp.format(
                            _param.RouteLineId,
                            0, //_param.Startcity 重置出发城市
                            0, //_param.Days 重置行程天数
                            _param.ShipId == item["ShipId"] ? 0 : id, //_param.CompanyId 重置邮轮公司
                            0, //_param.Math 重置出游时间
                            0, //_param.minprice 重置价格区间（最小值）
                            0, //_param.maxprice 重置价格区间（最大值）
                            _param.ShipId == item["ShipId"] ? 0 : item["ShipId"], //_param.ShipId 重置邮轮ID
                            _param.SubRouteId, //_param.SubRouteId （加上二级航线）
                            _param.isLyLine, //是否同程专线
                            lid && lid.length ? "?lid=" + lid : "?lid=76",
                            _param.isBlh ? "&IsTcBlh=1" : "" //是否百旅会
                        ),
                        item["ShipName"] + (that.hotShips.indexOf(parPosInt(item["ShipId"])) != -1 ? "<span class='fs-icon'></span>" : ""),
                        "txt-attr='" + item["ShipName"] + "'"
                    );
                });
                str += "</div>";
                $(".filter-ships .fs-right").append(str);
                this.bindEvent();
                this.synchView();
            },
            bindEvent: function() {
                var that = this;
                $(".filter-title>a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        e.stopPropagation();
                        var $this = $(this),
                            index = $this.index(),
                            $cont = $(".filter-dropdown").find(".filter-line,.filter-ships,.filter-sub,.filter-sort").eq(index);
                        if ($this.hasClass("active")) {
                            obj.filterToggle.close();
                            return false;
                        }
                        $this.addClass("active").siblings().removeClass("active");
                        obj.filterToggle.open();
                    });

                $(".layer").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        e.stopPropagation();
                        obj.filterToggle.close();
                    });

                $(".filter-line a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        //e.stopPropagation();
                        var $this = $(this);
                        if ($this.hasClass("active")) return false;
                        $this.addClass("active").siblings().removeClass("active");
                        obj.filterToggle.close();
                    });

                $(".filter-ships .fs-left a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        e.stopPropagation();
                        var $this = $(this);
                        if ($this.hasClass("active")) return false;
                        $this.addClass("active").siblings().removeClass("active");
                        $(".filter-ships .fs-right .filter-list").addClass("none");
                        that.shipDraw();
                    });
                $(".filter-ships .fs-right a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        //e.stopPropagation();
                        obj.filterToggle.close();
                    });

                $(".filter-sub .fsub-left a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        e.stopPropagation();
                        var $this = $(this),
                            index = $this.index(),
                            $conts = $(".filter-sub .fsub-right .filter-list");
                        if ($this.hasClass("active")) return false;
                        $this.addClass("active").siblings().removeClass("active");
                        $conts.addClass("none").eq(index).removeClass("none");
                        $(".filter-sub .fsub-right .filter-list:visible").scrollTop(0);
                    });

                $(".filter-sub .fsub-right .filter-list:not(.tcly-list) a,.filter-sub .fsub-right .filter-list:not(.tcblh-list) a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function(e) {
                        e = e || $.Event();
                        e.stopPropagation();
                        var $this = $(this),
                            typeAttr = $this.attr("type-attr"),
                            txtAttr = $this.attr("txt-attr"),
                            $btn = $(".filter-sub .fsub-left a[type-attr='" + typeAttr + "']"),
                            $option = $(".filter-sub .fsub-selected span[type-attr='" + typeAttr + "']");
                        if ($this.hasClass("active")) {
                            $btn.removeClass("current");
                            $option.remove();
                            $this.removeClass("active");
                            that.selectSubFn();
                            return false;
                        }
                        $this.addClass("active").siblings().removeClass("active");
                        $btn.addClass("current");
                        if ($option && $option.length) {
                            $option.attr("val-attr", $this.attr("val-attr"));
                            $option.html(txtAttr + "<a href='javascript:;'></a>");
                        } else {
                            $(".filter-sub .fsub-selected").append("<span {1}>{0}<a href='javascript:;'></a></span>".format(
                                txtAttr,
                                "type-attr='{1}' val-attr='{0}'".format($this.attr("val-attr"), typeAttr)
                            ));
                        }
                        that.selectSubFn();
                    });

                $(".filter-sub .fsub-right .tcly-list a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function() {
                        var $this = $(this),
                            typeAttr = $this.attr("type-attr"),
                            txtAttr = $this.attr("txt-attr"),
                            $btn = $(".filter-sub .fsub-left a[type-attr='" + typeAttr + "']"),
                            $option = $(".filter-sub .fsub-selected span[type-attr='" + typeAttr + "']");
                        if ($this.hasClass("active")) {
                            if ($this.index() == 0) return false;
                            $this.prev().trigger("click");
                            return false;
                        }
                        $this.addClass("active").siblings().removeClass("active");
                        if ($this.index() == 0) { //非同程专线
                            $option.remove();
                            $btn.removeClass("current");
                            that.selectSubFn();
                        } else if ($this.index() == 1) { //同程专线
                            $btn.addClass("current");
                            if ($option && $option.length) {
                                $option.attr("val-attr", $this.attr("val-attr"));
                                $option.html(txtAttr + "<a href='javascript:;'></a>");
                            } else {
                                $(".filter-sub .fsub-selected").append("<span {1}>{0}<a href='javascript:;'></a></span>".format(
                                    txtAttr,
                                    "type-attr='{1}' val-attr='{0}'".format($this.attr("val-attr"), typeAttr)
                                ));
                            }
                            that.selectSubFn();
                        }

                    });


                $(".filter-sub .fsub-right .tcblh-list a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function() {
                        var $this = $(this),
                            typeAttr = $this.attr("type-attr"),
                            txtAttr = $this.attr("txt-attr"),
                            $btn = $(".filter-sub .fsub-left a[type-attr='" + typeAttr + "']"),
                            $option = $(".filter-sub .fsub-selected span[type-attr='" + typeAttr + "']");
                        if ($this.hasClass("active")) {
                            if ($this.index() == 0) return false;
                            $this.prev().trigger("click");
                            return false;
                        }
                        $this.addClass("active").siblings().removeClass("active");
                        if ($this.index() == 0) { //非百旅会
                            $option.remove();
                            $btn.removeClass("current");
                            that.selectSubFn();
                        } else if ($this.index() == 1) { //百旅会
                            $btn.addClass("current");
                            if ($option && $option.length) {
                                $option.attr("val-attr", $this.attr("val-attr"));
                                $option.html(txtAttr + "<a href='javascript:;'></a>");
                            } else {
                                $(".filter-sub .fsub-selected").append("<span {1}>{0}<a href='javascript:;'></a></span>".format(
                                    txtAttr,
                                    "type-attr='{1}' val-attr='{0}'".format($this.attr("val-attr"), typeAttr)
                                ));
                            }
                            that.selectSubFn();
                        }

                    });

                $(".filter-sub .btn-reset").unbind("click.filterListObj")
                    .bind("click.filterListObj", function() {
                        $(".filter-sub .fsub-right a.active").each(function() {
                            $(this).trigger("click");
                        });
                    });

                $(".filter-sort a").unbind("click.filterListObj")
                    .bind("click.filterListObj", function() {
                        var $this = $(this);
                        if ($this.hasClass("active")) return false;
                        $this.addClass("active").siblings().removeClass("active");
                        $("#sortType").val($this.attr("val-attr"));
                        if (obj.productObj.loadClone) obj.productObj.load = obj.productObj.loadClone;
                        $(".filter-box .filter-title>a").eq(3).html($.trim($this.text()));
                        obj.productObj.loadDataFlag = false;
                        obj.productObj.init();
                        obj.filterToggle.close();
                    });
            },
            synchView: function() {
                //航线
                var $tabBtns = $(".filter-box .filter-title>a"),
                    $currentElem = $(".filter-line a.active"),
                    currentVal = $.trim($currentElem.attr("txt-attr"));
                if (currentVal != "不限") {
                    if (currentVal.length > 3) {
                        currentVal = currentVal.slice(0, 3) + "...";
                    }
                    $tabBtns.eq(0).html(currentVal);
                } else {
                    $tabBtns.eq(0).html("全部航线");
                }


                //船队
                $currentElem = $(".filter-ships .fs-left a.current");
                if ($currentElem && $currentElem.length) {
                    currentVal = $.trim($currentElem.text());
                    if (currentVal.length > 3) {
                        currentVal = currentVal.slice(0, 3) + "...";
                    }
                    $tabBtns.eq(1).html(currentVal);
                    $currentElem = $(".filter-ships .fs-right a.active")
                    if ($currentElem && $currentElem.length && $currentElem.index() != 0) {
                        currentVal = $.trim($currentElem.text());
                        if (currentVal.length > 3) {
                            currentVal = currentVal.slice(0, 3) + "...";
                        }
                        $tabBtns.eq(1).html(currentVal);
                    }
                } else {
                    $tabBtns.eq(1).html("全部船队");
                }

                //排序
                currentVal = $.trim($("#sortType").val());
                $(".filter-sort a[val-attr='" + currentVal + "']").addClass("active").siblings().removeClass("active");
                $currentElem = $(".filter-sort a.active");
                currentVal = $.trim($currentElem.text());
                $tabBtns.eq(3).html(currentVal);
            },
            selectSubFn: doAutoSelectSubFilter
        },
        productObj: {
            urlTemp: "/youlun/json/LowPriceLines.html?RouteLineId={0}&BeginCity={1}&Month={2}&Company={3}&MinPrice={4}&MaxPrice={5}&TravelDays={6}&SortType={7}&SubRouteId={8}&ShipId={9}&IsLyLineInfo={10}&IsTcBlh={11}&LineProperty={12}",
            strTemp: '<a _asIndex="{{=it.pageIndex}}" _lineId="{{=it.LineId}}" href="/youlun/tours/{{=it.LineId}}.html?Key={{=it.key}}&SearchCondition={{=it.searchCondition}}" onclick="_tcTraObj._tcTrackEvent(\'tzxyl_2\',\'touch邮轮列表\',\'touch邮轮列表页点击线路\',\'^listview^{{=it.pageIndex}}^{{=it.Destination}}^{{=it.LineId}}^{{=it.IsTCLine}}^\')">\
		                <div class="pro_list">\
		                    <div class="con_l">\
		                    	<em class="pro_label {{=it.isMulti}}">多个航期</em>\
		                        <img class="pro_img" src="{{=it.ImgUrl}}" />\
		                        {{=it.startPortOrCity}}\
		                    </div>\
		                    <div class="con_r {{=it.noLabelClass}}">\
		                        <p class="rp_title">{{=it.LineName}}</p>\
		                        <p class="tips_s clearfix">\
		                        	{{=it.tcProType}}\
		                        	{{=it.tcBaochuan}}\
		                        	{{=it.tcLine}}\
		                        	{{=it.tcHoliday}}\
		                        </p>\
		                        <p class="tc_price"><i>&yen;</i><em>{{=it.TcPrice}}</em>/人起</p>\
		                        <span class="curise_rate">{{=it.CustomerAppraise}}</span>\
		                    </div>\
		                </div>\
		                {{=it.promotionDesc}}\
		            </a>',
            strTemp1: '<a _asIndex="{{=it.pageIndex}}" _lineId="{{=it.LineId}}" href="/youlun/tours/{{=it.LineId}}.html?Key={{=it.key}}&SearchCondition={{=it.searchCondition}}" onclick="_tcTraObj._tcTrackEvent(\'tzxyl_2\',\'touch邮轮列表\',\'touch邮轮列表页点击线路\',\'^listview^{{=it.pageIndex}}^{{=it.Destination}}^{{=it.LineId}}^{{=it.IsTCLine}}^\')">\
		                <div class="pro_list">\
		                    <div class="con_l">\
		                        <img class="logo_img" src="//img1.40017.cn/touch/cn/y/16/app/festivalPic/festival_list_icon.png" alt=""/>\
		                    	<em class="pro_label {{=it.isMulti}}">多个航期</em>\
		                        <img class="pro_img" src="{{=it.ImgUrl}}" />\
		                        {{=it.startPortOrCity}}\
		                    </div>\
		                    <div class="con_r {{=it.noLabelClass}}">\
		                        <p class="rp_title">{{=it.LineName}}</p>\
		                        <p class="tips_s clearfix">\
		                        	{{=it.tcProType}}\
		                        	{{=it.tcBaochuan}}\
		                        	{{=it.tcLine}}\
		                        	{{=it.tcHoliday}}\
		                        </p>\
		                        <p class="tc_price"><i>&yen;</i><em>{{=it.TcPrice}}</em>/人起</p>\
		                        <span class="curise_rate">{{=it.CustomerAppraise}}</span>\
		                    </div>\
		                </div>\
		                {{=it.promotionDesc}}\
		            </a>',
            init: function() {
                this.pageIndex = 1;
                this.urlParam = this.getUrlParam();
                $(".pro2").empty().append('<div id="loadmsg" class="data-loader"><span>正在加载数据</span></div>');
                this.draw();
                this.bindEvent();
            },
            bindEvent: function() {
                var that = this;
                $(window).unbind("scroll.filterListObj")
                    .bind("scroll.filterListObj", function() {
                        if (that.DATA == "complete") return false;
                        var scrollTop = $(this).scrollTop();
                        var scrollHeight = $(document).height() - 200;
                        var windowHeight = $(this).height();
                        if (scrollTop + windowHeight >= scrollHeight) {
                            that.draw();
                        }
                        if (scrollTop >= windowHeight) {
                            $(".back").css({ "display": "block" });
                        } else {
                            $(".back").css({ "display": "none" });
                        }
                    });
                $(".back")[0].onclick = function() {
                    window.scrollTo(0, 0);
                }
            },
            getUrlParam: function() {
                var _param = obj.resetParam(),
                    destStr = $.trim($("#dest").val()),
                    _obj = {
                        page: this.pageIndex || 1,
                        Sort: $.trim($("#sortType").val()),
                        keyword: destStr.length ? destStr : false
                    };
                return $.extend(true, {}, _param, _obj);
            },
            getUrlStr: function(param) {
                var _param = this.getUrlParam();
                _param = $.extend(true, {}, _param, param);
                return this.urlTemp.format(
                    _param.RouteLineId,
                    _param.Startcity,
                    _param.Month,
                    _param.CompanyId,
                    _param.minprice,
                    _param.maxprice,
                    _param.Days,
                    _param.Sort,
                    _param.SubRouteId,
                    _param.ShipId,
                    _param.isLyLine,
                    _param.isBlh,
                    "{0}&Page={1}{2}{3}".format(
                        _param.isprop,
                        _param.page,
                        _param.keyword ? "&Cruisedest=" + encodeURIComponent(_param.keyword) : "",
                        utility.getUrlParam("lid") ? "&lid=" + utility.getUrlParam("lid") : "&lid=76"
                    )
                );
            },
            load: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.loadDataFlag = true;
                this.urlStr = this.getUrlStr();
                this.ajaxObj = $.ajax({
                    url: this.urlStr,
                    success: function(data) {
                        // console.log(data = JSON.parse(data))
                        that.loadDataFlag = false;
                        //埋点统计
                        if (data) {
                            if (!window.showTrackEvent) {
                                window.showTrackEvent = true;
                                //列表显示事件(翻页不算，翻页后重新到第一页后也不算)
                                burying.searchTrackEvent("/show", {
                                    k: encodeURIComponent($("#dest").val()),
                                    // locCId : $("#hidCityId").val(),
                                    //cityId : $("#StartcityId").val(),
                                    rc: !data.cruiseList ? 0 : data.cruiseList.TotalCount
                                });
                            } else {
                                //翻页统计
                                var thisEventPageNum = !data.cruiseList || !data.cruiseList.pageInfo ? 0 : data.cruiseList.pageInfo.Page;
                                if (thisEventPageNum > 1) {
                                    burying.searchTrackEvent("/page", {
                                        k: encodeURIComponent($("#dest").val()),
                                        // locCId : $("#hidCityId").val(),
                                        //cityId : $("#StartcityId").val(),
                                        page: thisEventPageNum
                                    });
                                }
                            }
                            //过滤埋点
                            burying.trackEventUseSessionStorage({
                                lable: "/filter",
                                type: 2,
                                value: {
                                    k: encodeURIComponent($("#dest").val()),
                                    // locCId : $("#hidCityId").val(),
                                    //cityId : $("#StartcityId").val(),
                                    rc: !data.cruiseList ? 0 : data.cruiseList.TotalCount
                                }
                            });
                            //搜索框关键字统计事件
                            burying.trackEventUseSessionStorage({
                                type: 2,
                                lable: "/sbox/k",
                                value: {
                                    k: encodeURIComponent($("#dest").val()),
                                    // locCId : $("#hidCityId").val(),
                                    //cityId : $("#StartcityId").val(),
                                    rc: !data.cruiseList ? 0 : data.cruiseList.TotalCount
                                }
                            });
                            //搜索框关键字统计事件
                            burying.trackEventUseSessionStorage({
                                type: 3,
                                lable: "/homeToSearch/sbox/k",
                                value: {
                                    k: encodeURIComponent($("#dest").val()),
                                    // locCId : $("#hidCityId").val(),
                                    //cityId : $("#StartcityId").val(),
                                    rc: !data.cruiseList ? 0 : data.cruiseList.TotalCount
                                }
                            });
                        }

                        if (data && data["cruiseList"] && data["State"] == "100") {
                            that.totalNum = data["cruiseList"].TotalCount;
                            data = data["cruiseList"]["Lines"];
                            if (data && data[0]) {
                                if (that.urlParam.keyword) addSearchHistory();
                                that.DATA = data;
                                that.draw();
                            } else {
                                if (that.urlParam.keyword && that.pageIndex < 2) {
                                    $(".pro2 #loadmsg").before('<div id="noResultFound" class="pro-nors"><p>很抱歉，<br>没有找到合适的线路，换个条件试试吧！</p></div>');
                                    $(".data-loader").hide();
                                    $("#crusieRouteLineId").val("3");
                                    obj.filterObj.draw();
                                    that.loadClone = that.load;
                                    that.load = that.loadDefault;
                                    that.load();
                                    return false;
                                }
                                that.DATA = [];
                                that.draw();
                            }
                        }
                    }
                });
            },
            loadDefault: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.loadDataFlag = true;
                this.urlStr = this.getUrlStr({ keyword: false });
                this.ajaxObj = $.ajax({
                    url: this.urlStr,
                    success: function(data) {
                        that.loadDataFlag = false;
                        if (data && data["cruiseList"] && data["State"] == "100") {
                            data = data["cruiseList"]["Lines"];
                            if (data && data[0]) {
                                that.DATA = data;
                                that.draw();
                            } else {
                                $("#crusieRouteLineId").val("0");
                                obj.filterObj.draw();
                                that.load = that.loadAll;
                                that.load();
                            }
                        }
                    }
                });
            },
            loadAll: function() {
                var that = this;
                if (this.ajaxObj) this.ajaxObj.abort();
                this.loadDataFlag = true;
                this.urlStr = this.getUrlStr({ keyword: false });
                this.ajaxObj = $.ajax({
                    url: this.urlStr,
                    success: function(data) {
                        that.loadDataFlag = false;
                        if (data && data["cruiseList"] && data["State"] == "100") {
                            data = data["cruiseList"]["Lines"];
                            if (data && data[0]) {
                                that.DATA = data;
                                that.draw();
                            } else {
                                that.DATA = [];
                                that.draw();
                            }
                        }
                    }
                });
            },
            draw: function() {
                var data = this.DATA,
                    str = "",
                    that = this,
                    loadmsg = $(".pro2 #loadmsg"),
                    totalNum = this.totalNum;
                if (!data) {
                    if (this.loadDataFlag) return false;
                    this.load();
                    return false;
                }
                if (data == "complete" || data.length == 0) {
                    this.DATA = false;
                    loadmsg.before('<div id="loadmsg" class="data-loader"><p class="over">没有更多数据了~</p></div>');
                    loadmsg.remove();
                    return false;
                }

                var isfestival = false;
                var stime = new Date("2017/01/20 23:59:59").getTime(),
                    etime = new Date("2017/02/06 23:59:59").getTime(),
                    ntime = new Date().getTime();
                if (ntime >= stime && ntime <= etime) {
                    isfestival = true;
                }
                //----调用新的绘制方法---
                str = dataToStr({
                    jsonData: data,
                    temp: isfestival == true ? that.strTemp1 : that.strTemp,
                    circleFilterData: function(item, index) { //没有使用template方法 只能做简单替换
                        item.pageIndex = (that.pageIndex - 1) * 5 + index + 1;
                        item.searchCondition = obj.KeyMore;
                        item.tcBaochuan = item.LineProperty == 4 || item.LineProperty == "4" ? '<span class="c_00a0ff">同程包船</span>' : '';
                        item.tcLine = item.IsTCLine == 1 || item.IsTCLine == "1" ? '<span class="c_00c6c4">同程专线</span>' : '';
                        if (item.BlhChannelIntegral) {
                            item.BlhChannelIntegral = '百旅会最高抵&yen;' + item.BlhChannelIntegral + '元/人';
                            item.promotionDesc = '<div class="more_room_type">' +
                                '<em class="hui">抵</em>' + item.BlhChannelIntegral +
                                '</div>';
                        } else {
                            item.promotionDesc = item.promotionDesc != '' ? '<div class="more_room_type">' +
                                '<em class="hui">惠</em>' + item.promotionDesc +
                                '</div>' : '';
                        }

                        //所有航线调取：出团日期+船队  途径港口+游玩时间;
                        //长线调取线路主标题。
                        //注意点：显示“xx/xx出发”，多航期线路则显示“多航期”标签；标题最多显示两行，超过两行则省略号。
                        //国内与华南线路显示单船票/团队游标签
                        item.tcProType = '';
                        if (item.TourType == 0 || item.LineType == 5) {
                            item.tcProType = item.ProductTypeId == 22 ? '<span class="c_00a0ff">团队游</span>' : (item.ProductTypeId == 23 ? '<span class="c_00a0ff">单船票</span>' : '');
                        }
                        //节假日标签，","分割
                        item.tcHoliday = '';
                        if (item.Holiday) {
                            var arr = item.Holiday.split(',');
                            for (var x = 0, y = arr.length; x < y; x++) {
                                item.tcHoliday += '<span class="c_00a0ff">' + arr[x] + '</span>';
                            }
                        }
                        //如果没有标签航线标题放3行
                        item.noLabelClass = (item.tcProType == '' && item.tcBaochuan == '' && item.tcLine == '' && item.tcHoliday == '') ? 'no_label' : '';

                        //3月22日 皇家加勒比-海洋量子号  济州+福冈4晚5日游
                        //到达城市没有取航线字段，还没有为空
                        item.LineName = '<span class="title">' + item.StartDate + ' ' + item.CruiseShipName + '-' + item.CompanyName + '</span>' + '<span class="sub-title">' + (item.ArriveCity || item.Destination || '') + item.Nights + "晚" + item.PlayDays + "日游</span>";
                        item.isMulti = (item.DateList && item.DateList.length && item.DateList.length > 1) ? "" : "none";
                        //出发城市：出境、国内单船票调取上船港口，显示“xx上船”；
                        //国内跟团、长线调取出发城市，显示“xx出发”，如果没有出发城市则隐藏出发城市一栏
                        var portType = 1; //1出发城市 2出发港口
                        //点评处理
                        item.CustomerAppraise = (item.CustomerAppraise && item.CustomerAppraise != '0') ? item.CustomerAppraise + '%满意' : '暂无点评';
                        switch (item.TourType - 0) { //0国内 1出境 2长线 出发城市:StartCity 出发港口:StartPort
                            case 0:
                                if (item.ProductTypeId - 0 == 23) { //22团队//23单船票
                                    portType = 2;
                                }
                                break;
                            case 1:
                                portType = 2;
                                break;
                        }
                        if (portType == 1) {
                            item.startPortOrCity = item.StartCity != "" ? item.StartCity + "出发" : "";
                        } else {
                            item.startPortOrCity = item.StartPort != "" ? item.StartPort + "上船" : "";
                        }
                        item.startPortOrCity = item.startPortOrCity != '' ? '<p class="act_city">' + item.startPortOrCity + '</p>' : '';
                        return item;
                    }
                });
                //调用结束
                loadmsg.before(str);
                if (!setLabel()) {
                    $(".tmp").remove();
                }
                $(".total").html("共" + totalNum + "条线路").css({ "display": "block" });
                setTimeout(function() {
                    $(".total").animate({ "opacity": 0 }, 500, function() {
                        $(this).remove();
                    })
                }, 3000);
                this.DATA = false;
                this.pageIndex++;

                $(window).trigger("scroll");
                loadWebp({
                    attr: 'data-nsrc',
                    img: $(".img_s"),
                    replace: true
                });
            }
        }
    });


    //---通用方法----

    //数据替换
    function replaceData(tempStr, objData) {
        if (!tempStr || !objData || !isObject(objData)) return "";
        tempStr = tempStr.replace(/{{\=it\.(\w+?)}}/g, function(a, b) {
            return objData[b] !== undefined ? objData[b] : a;
        });
        return tempStr;
    }

    //是否是对象
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    //打印数据为标签字符串
    function dataToStr(option) {
        var setOption = {
            jsonData: "",
            temp: "",
            circleFilterData: function(cirData, index) {
                return cirData;
            },
            isUseCirc: true,
            showLen: -1
        };
        $.extend(setOption, option);
        var str = "",
            count = 0;
        if (setOption.jsonData && setOption.temp) {
            if (setOption.isUseCirc === true) {
                for (var i = 0, len = setOption.jsonData.length; i < len; i++) {
                    var data = setOption.jsonData[i];
                    if (!!data) {
                        count++;
                        str += replaceData(setOption.temp, setOption.circleFilterData(data, i));
                    }
                    if (setOption.showLen !== -1 && count >= setOption.showLen) {
                        break;
                    }
                }
            } else {
                var data = setOption.jsonData;
                str = replaceData(setOption.temp, setOption.circleFilterData(data, 0));
            }
        }
        return str;
    }

    function addSearchHistory() {
        function get() {
            var data = window.localStorage;
            if (!data) {
                console.error("searchObj>historyObj>draw:当前浏览器不支持本地存储");
                return null;
            }
            data = data.getItem("TC-Search-History");
            return data && typeof data === "string" ? data.split(",") : [];
        }

        var data = get(),
            index = true,
            val = $.trim($("#dest").val());
        if (!(val && val.length)) return false;
        $.each(data, function(i, item) {
            if ($.trim(item) === $.trim(val)) {
                index = false;
                return false;
            }
        });
        if (index) {
            data.push(val);
            index = data.length - 6;
            index = index > 0 ? index : 0;
            data = data.slice(index, index + 6);
            window.localStorage.setItem("TC-Search-History", data.join(","));
        }
        searchObj.initHistoryFn();
        addSearchHistory = function() {};
    }

    function doAutoSelectSubFilter() {
        var _param = obj.resetParam(),
            $options = $(".filter-sub .fsub-selected>span"),
            _obj = {
                minprice: 0,
                maxprice: 0,
                Startcity: 0,
                Days: 0,
                Month: 0,
                isLyLine: 1,
                isBlh: 0
            },
            lid = utility.getUrlParam("lid");
        if ($options && $options.length) {
            $(".filter-sub .fsub-selected").removeClass("none");
            $options.each(function(index, elem) {
                var $elem = $(elem),
                    typeAttr = $elem.attr("type-attr"),
                    valAttr = $elem.attr("val-attr");
                if (typeAttr != "price") {
                    _obj[typeAttr] = valAttr;
                } else if (typeAttr == "price") {
                    _obj["minprice"] = valAttr.split("|")[0];
                    _obj["maxprice"] = valAttr.split("|")[1];
                }
            })
        } else {
            $(".filter-sub .fsub-selected").addClass("none");
        }

        _param = $.extend(true, {}, _param, _obj);
        $(".filter-sub .btn-submit").attr("href", "/youlun/cruise-line-{0}-{1}-{2}-{3}-{4}-{5}-{6}-{7}-{8}-{9}.html{10}{11}".format(
            _param.RouteLineId,
            _param.Startcity, //_param.Startcity 重置出发城市
            _param.Days, //_param.Days 重置行程天数
            _param.CompanyId, //_param.CompanyId 重置邮轮公司
            _param.Month, //_param.Math 重置出游时间
            _param.minprice, //_param.minprice 重置价格区间（最小值）
            _param.maxprice, //_param.maxprice 重置价格区间（最大值）
            _param.ShipId, //_param.ShipId 重置邮轮ID
            _param.SubRouteId, //_param.SubRouteId （这里是一级航线，不需要二级航线）
            _param.isLyLine, //是否同程专线
            lid && lid.length ? "?lid=" + lid : "?lid=76",
            _param.isBlh ? "&IsTcBlh=1" : "" //是否百旅会
        ));

        $(".filter-sub .fsub-selected a").unbind("click.filterListObj")
            .bind("click.filterListObj", function() {
                var $this = $(this).parent(),
                    typeAttr = $this.attr("type-attr"),
                    valAttr = $this.attr("val-attr");
                $(".filter-sub .fsub-right a[type-attr='{0}'][val-attr='{1}']".format(typeAttr, valAttr)).trigger("click");
            });
    }

    function getFilterStr(data) {
        var _param = obj.paramObj,
            referVal = "",
            _str = "",
            str = "",
            _referVal = "",
            __str = "",
            __referVal = "",
            temp = "<a class='{0}' href='{1}' {3}>{2}</a>";
        //出游时间
        referVal = _param.Month;
        if (referVal == "0") {
            _referVal += temp.format(
                "active",
                "javascript:;",
                "出游时间",
                "type-attr='Month'"
            );
        } else {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                "{0}年{1}月".format(referVal.slice(0, 4), referVal.slice(4, 6)),
                "type-attr='Month' val-attr='{0}' txt-attr='{1}'".format(referVal, "{0}年{1}月".format(referVal.slice(0, 4), referVal.slice(4, 6)))
            )
            _referVal += temp.format(
                "current active",
                "javascript:;",
                "出游时间",
                "type-attr='Month'"
            );
        }
        str += "<div class='filter-list'>"
        utility.forEach(data["LeaveDates"] || [], function(index, item) {
            str += temp.format(
                referVal == item["Monthvalue"] ? "active" : "",
                "javascript:;",
                "{0}年{1}月".format(item["Monthvalue"].slice(0, 4), item["Monthvalue"].slice(4, 6)),
                "type-attr='Month' val-attr='{0}' txt-attr='{1}'".format(item["Monthvalue"], "{0}年{1}月".format(item["Monthvalue"].slice(0, 4), item["Monthvalue"].slice(4, 6)))
            );
        });
        str += "</div>";

        //出发港口
        referVal = _param.Startcity;
        __str = "";
        str += "<div class='filter-list none'>";
        utility.forEach(data["RoutePorts"] || [], function(index, item) {
            if (referVal == item["PtId"]) __str = item;
            str += temp.format(
                referVal == item["PtId"] ? "active" : "",
                "javascript:;",
                item["PtName"],
                "val-attr='{0}' type-attr='Startcity' txt-attr='{1}'".format(item["PtId"], item["PtName"])
            )
        });
        str += "</div>";
        if (referVal != "0") {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                __str && __str["PtId"] ? __str["PtName"] : "&nbsp;",
                "type-attr='Startcity' val-attr='" + (__str && __str["PtId"] ? __str["PtId"] : 0) + "'"
            )
        }
        _referVal += temp.format(
            referVal == "0" ? "" : "current",
            "javascript:;",
            "出发港口",
            "type-attr='Startcity'"
        );

        //价格区间
        referVal = parPosInt(_param.minprice);
        __referVal = parPosInt(_param.maxprice);
        str += "<div class='filter-list none'>";
        utility.forEach([
            { Num: 1, Value: "¥2000以下", min: 0, max: 2000 },
            { Num: 2, Value: "¥2001-¥4000", min: 2001, max: 4000 },
            { Num: 3, Value: "¥4001-¥6000", min: 4001, max: 6000 },
            { Num: 4, Value: "¥6001-¥10000", min: 6001, max: 10000 },
            { Num: 5, Value: "¥10000以上", min: 10001, max: 0 }
        ], function(index, item) {
            if (referVal == item.min && __referVal == item.max) __str = item;
            str += temp.format(
                referVal == item.min && __referVal == item.max ? "active" : "",
                "javascript:;",
                item["Value"],
                "val-attr='{0}' type-attr='price' txt-attr='{1}'".format(item.min + "|" + item.max, item["Value"])
            )
        });
        str += "</div>";
        if (referVal != 0 || __referVal != 0) {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                __str && __str["Num"] ? __str["Value"] : "&nbsp;",
                "type-attr='price' val-attr='{0}'".format(__str && __str["Num"] ? (__str.min + "|" + __str.max) : 0)
            )
        }

        _referVal += temp.format(
            referVal == 0 && __referVal == 0 ? "" : "current",
            "javascript:;",
            "价格区间",
            "type-attr='price'"
        );

        //行程天数
        referVal = parPosInt(_param.Days);
        str += "<div class='filter-list none'>";
        utility.forEach([
            { Num: 1, Value: "3天以内" },
            { Num: 2, Value: "4至7天" },
            { Num: 3, Value: "8至14天" },
            { Num: 4, Value: "14天以上" }
        ], function(index, item) {
            if (referVal == item.Num) __str = item;
            str += temp.format(
                referVal == item.Num ? "active" : "",
                "javascript:;",
                item["Value"],
                "val-attr='{0}' type-attr='Days' txt-attr='{1}'".format(item["Num"], item["Value"])
            )
        });
        str += "</div>";
        if (referVal != 0) {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                __str && __str["Num"] ? __str["Value"] : "&nbsp;",
                "type-attr='Days' val-attr='" + (__str && __str["Num"] ? __str["Num"] : 0) + "'"
            );
        }
        _referVal += temp.format(
            referVal == 0 ? "" : "current",
            "javascript:;",
            "行程天数",
            "type-attr='Days'"
        );
        //同程专线
        referVal = parPosInt(_param.isLyLine);
        str += "<div class='filter-list none tcly-list'>";
        utility.forEach([
            { Num: 1, Value: "不限", Text: "" },
            { Num: 2, Value: "同程专线", Text: "同程专线" }
        ], function(index, item) {
            if (referVal == item.Num) __str = item;
            str += temp.format(
                referVal == item.Num ? "active" : "",
                "javascript:;",
                item["Value"],
                "val-attr='{0}' type-attr='isLyLine'  txt-attr='{1}'".format(item.Num, item["Text"])
            )
        });
        str += "</div>";
        if (referVal != 1) {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                __str && __str["Num"] ? "同程专线" : "&nbsp;",
                "type-attr='isLyLine' val-attr='{0}'".format(__str && __str["Num"] ? __str["Num"] : 0)
            );
        }
        _referVal += temp.format(
            referVal == 2 ? "current" : "",
            "javascript:;",
            "同程专线",
            "type-attr='isLyLine'"
        );
        //百旅会
        referVal = parPosInt(_param.isBlh);
        str += "<div class='filter-list none tcblh-list'>";
        utility.forEach([
            { Num: 0, Value: "不限", Text: "" },
            { Num: 1, Value: "百旅会", Text: "百旅会" }
        ], function(index, item) {
            if (referVal == item.Num) __str = item;
            str += temp.format(
                referVal == item.Num ? "active" : "",
                "javascript:;",
                item["Value"],
                "val-attr='{0}' type-attr='isBlh'  txt-attr='{1}'".format(item.Num, item["Text"])
            )
        });
        str += "</div>";
        if (referVal != 0) {
            _str += "<span {1}>{0}<a href='javascript:;'></a></span>".format(
                __str && __str["Num"] ? "百旅会" : "&nbsp;",
                "type-attr='isBlh' val-attr='{0}'".format(__str && __str["Num"] ? __str["Num"] : 0)
            );
        }
        _referVal += temp.format(
            referVal == 1 ? "current" : "",
            "javascript:;",
            "百旅会",
            "type-attr='isBlh'"
        );
        return [str, _str, "<div class='filter-list'>" + _referVal + "</div>"];
    }

    function parPosInt(str) {
        str = parseInt(str, 10);
        return isNaN(str) ? 0 : str < 0 ? 0 : str;
    }

    function parPosFloat(str) {
        str = parseFloat(str, 10);
        return isNaN(str) ? 0 : str < 0 ? 0 : str;
    }

    function staFn(opt) { //统计
        var _opt = {
            "PageType": "AdvancedSearchPage",
            "Lid": utility.getUrlParam("lid") || "76",
            "Url": encodeURIComponent(location.href),
            "v": new Date().getTime()
        };

        opt = $.extend(true, {}, _opt, opt);
        $.ajax({
            url: "/youlun/CruiseJson/CruiseSpecialStatistic",
            data: opt,
            type: "post",
            success: function() {
                staFn = function() {};
            }
        });
    }

    //现在经常临时添加标签，且具有时效性
    //根据时间控制标签
    function setLabel() {
        var now = new Date(),
            start = new Date('2016/05/19 00:00:00'),
            end = new Date('2016/05/21 00:00:00'),
            nowTime = now.getTime(),
            startTime = start.getTime(),
            endTime = end.getTime();
        if (nowTime > startTime && nowTime < endTime) {
            return true;
        } else {
            return false;
        }
    }

    $(document).ready(function() {
        obj.resetParam.call(obj);
        obj.staParamObj = {
            HxId: obj.paramObj.RouteLineId,
            HxCid: obj.paramObj.SubRouteId, //子航线id
            CompanyId: obj.paramObj.CompanyId, //公司id
            CruiseId: obj.paramObj.ShipId, //船队id
            HarbourId: obj.paramObj.Startcity, //港口id
            DateId: obj.paramObj.Month, //出发月份
            DayNum: obj.paramObj.Days
        };
        obj.KeyMore = new Base64().encode(encodeURIComponent(JSON.stringify(obj.staParamObj)));
        staFn({ SearchCondition: obj.KeyMore });
        obj.init();
    });

    module.exports = obj;

}(Zepto, window, window.document);