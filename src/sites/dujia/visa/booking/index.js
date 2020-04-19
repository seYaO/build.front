/**
 * Created by yl17006 on 2016/12/20.
 */
var login = require("login/0.1.0/index"),
    Calendar = require("calendar/0.2.0/index");
var discDot = require("./views/discount.dot"),
    addressDot = require("./views/address.dot"),
    pInfoDot = require("./views/playerInfo.dot"),
    pListDot = require("./views/playerList.dot"),
    costDot = require("./views/cost.dot");
//全局ajax异步
var $fn = $fn || {},
    order = {};
$fn.getJson = function(url, Jdata, callback) {
    $.ajax({
        type: 'get',
        url: url,
        data: Jdata,
        dataType: "jsonp",
        success: function(data) {
            callback(data);
        },
        error: function(err) {
            Monitor.log('url:' + url + ',err:' + JSON.stringify(err), 'error', 'pc_visa_order');
            if (error) {
                error();
            }
        }
    });
};
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

order = {
    cityUrl: "//www.ly.com/hotel/ajax/HotelAjaxCall.aspx?action=GetCityByProvince&id=",
    areaUrl: "//www.ly.com/hotel/ajax/HotelAjaxCall.aspx?action=GetAreaByCity&id=",
    ajaxUrl: "/dujia/OrderAjaxCall.aspx?Type=SubVisaOrderNew",
    checkUrl: "/dujia/OrderAjaxCall.aspx?Type=CheckOrderLoginIn",
    discUrl: "/intervacation/api/Preferential/GetVisaPreferential?",
    addressUrl: "/dujia/AjaxHelper/InvoiceAjax.ashx?type=GETINVOICEBASEINFO",
    ticketUrl: "/dujia/AjaxHelper/InvoiceAjax.ashx?type=SAVEINVOICEBASEINFO&operateStatus=1",
    playUrl: "/intervacation/api/VisaLinker/GetLinkerList?siteType=0",
    cardUrl: "/intervacation/api/Preferential/GetBaiLvHuiCardForVisa",
    postUrl: "/intervacation/api/VisaOrder/GetVisaMailRulePrice?",
    linePayType: "",
    SELECT_PROVINCE: "请选择省",
    SELECT_CITY: "请选择市",
    SELECT_AREA: "请选择区/县",
    SUCCESS_FLAG: 100,
    ERROR_FLAG: "抱歉，您提交的订单验证失败，请重新提交或联系客服人员",
    AdultType: "1", //成人类型
    ChildType: "2", //儿童类型
    CustType: "", //客户类型
    AsynType: $("#hidIsPreferential").val() == "true" ? true : false, //是否调用优惠异步
    Loading: '<div class="loading"> <div class="loading-img"></div> <p class="loading-txt">正在努力加载中…</p> </div>',
    IsClickOn: true, //加减按钮是否可以点击
    Integral: 0, //百旅会会员积分
    IsExistBLH: 0, //是否百旅会会员
    ResidualIntegral: 0, //剩余积分
    BookingRequest: {
        LineId: "",
        ContactPerson: "", //联系人姓名
        ContactMoblie: "", //联系人手机号码
        ContactMail: "", //联系人邮箱
        StartDate: "", //出行时间
        PriceList: "", //价格体系
        Passengers: [
            //{
            //    CustomerName: "",出游人姓名
            //    playType: "",出游人职位
            //    CustomerMobile:"" ,出游人手机
            //    CustomerType: 1  1成人 2儿童
            //}
        ],
        InsuranceList: [
            // {
            //      InsuranceCode:"",//保险code
            //      InsuranceType:0 //保险类型
            // }
        ],
        PostInfo: {
            //PostAmount: "", //快递费
            // PostPerson: "", //邮寄联系人
            //PostAdress: "", //邮寄地址
            // PostCode: "", //邮编
            //PostMobile: "", //联系人手机号码
            //PostWay: 0 //传递方式
            //ReceiptProvinceName:""//寄出省
            //PostCity:""//城市
        },
        AdditionalList: [
            // {
            //      ServiceId:"",//服务Id
            //      Count:0 //份数
            // }
        ],
        PreferentialStr: [],
        IsNeedInvoice: false, //需要发票为true，反之为false
        InvoiceInfo: {
            // AddressId:0, //收件人地址Id
            //AddressMobile:"",//联系方式
            // AddressName:"",//姓名
            //InvoiceContent:"",//发票内容（1/3）
            //InvoiceInsideNumber:"",//发票抬头
            //ProvinceId:"",//省份Id
            //ProvinceName:"",//省份名称
            //CityId:"",//城市ID
            //CityName:"",//城市名称
            //RegionId:"",//地区ID
            //RegionName:"",//地区名称
            //SpecificAddress:"",//具体地址
        }
    },

    //初始化
    init: function(cfg) {
        this.dropSelect();
        this.calPickInit();
        this.hover();
        this.initPlayer();
        this.verifyCheck();
        this.initEvent();
        this.initDrop(cfg);
        this.formSubmit();
        this.fixedBox();
        this.initArea();
        this.getQueryString();
        this.initAdviser();
        this.initDataBase();
    },

    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function(callback) {
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function() {
                callback.call(self);
            },
            unReload: true
        });
    },
    /**
     * @private
     * @func getMemberId
     * @desc 获取用户id
     */
    getMemberId: function() {
        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg))

                return unescape(arr[2]);
            else
                return null;
        }
        var cookie = getCookie("us") || "",
            matchtouch = /userid=([^&]+)/i.exec(cookie);
        if (matchtouch) {
            return matchtouch[1];
        } else {
            return null;
        }
    },
    //渲染所在区域
    initDrop: function(cfg) {
        if (cfg.content && cfg.content.length) {
            var list = cfg.data || [],
                city = "";
            for (var i = 0; i < list.length; i++) {
                city = city + "<li data-id=" + list[i].id + ">" + list[i].name + "</li>";
            };
            cfg.content.empty().append(city);
        }
    },

    /**
     * 右侧吸顶
     */
    fixedBox: function() {
        var nav = $(".visa-right-content"),
            navH = nav.offset().top;
        $(window).on("scroll", function() {
            if ($(window).scrollTop() > navH) {
                if (!nav.hasClass("nav-fixed")) {
                    nav.addClass("nav-fixed");
                }
            } else {
                if (nav.hasClass("nav-fixed")) {
                    nav.removeClass("nav-fixed");
                }
            }
        })
    },

    // 判断是否加参数begin
    getQueryString: function(queryStr, key) {
        var _queryStr, _key;
        _queryStr = key ? queryStr : window.location.search.substr(1);
        _key = key || queryStr;
        var reg = new RegExp("(^|&)" + _key + "=([^&]*)(&|$)", "i");
        var r = _queryStr.match(reg);
        if (r !== null) {
            return decodeURI(r[2]);
        }
        return null;
    },

    // 判断是否加参数end
    /**
     * 模拟弹框
     */
    dropSelect: function() {
        var self = this,
            playSelect = $(".J_playType_select"),
            playDrop = $(".J_pType_ul"),
            sendSelect = $(".J_send_span"),
            sendDrop = $(".J_send_ul"),
            Region = $(".visa-sendInfo").find(".send-region");
        $(document).on("click", ".J_playType_select", function(e) {
            e.stopPropagation();
            var self = $(this);
            $(".J_pType_ul").addClass("none");
            if (self.siblings(".J_pType_ul").hasClass("none")) {
                self.siblings(".J_pType_ul").removeClass("none");
            } else {
                self.siblings(".J_pType_ul").addClass("none");
            }
        });

        $(document).on("click", ".J_pType_ul li", function(e) {
            e.stopPropagation();
            var self = $(this);
            self.parent().siblings(".J_playType_select").text(self.text());
            self.parent().siblings(".J_playType_select").attr("data-index", self.attr("data-id"));
            self.parent().addClass("none");
        });

        sendSelect.on("click", function(e) {
            e.stopPropagation();
            var me = $(this),
                list = me.parent().find(".J_send_ul"),
                Index = me.index();
            list.addClass("none");
            $(list).eq(Index - 1).removeClass("none");
        });

        sendDrop.on("click", "li", function(e) {
            e.stopPropagation();
            var me = $(this),
                cityId = me.attr("data-id"),
                post = me.parents(".J_visaAddress"),
                Index = me.parent().index(),
                cityList = me.parents(".J_send_ul"),
                city = cityList.siblings(".J_send_span"),
                dropStr = cityList.siblings(".J_invalid"),
                curCity = city.eq(Index - 5),
                proName = curCity.attr("data-name");
            var sendCost = me.parents(".visa-sendInfo").length,
                proCity = me.parents(".send-pro-ul").length;
            if (sendCost && proCity && proName != me.text()) {
                self.postCost(me.text());
            }
            if (!me.parents(".send-region-ul").length) {
                var type = me.parent().hasClass("send-pro-ul") ? 1 : 2;
                order.cityLink({
                    id: cityId,
                    Parent: post,
                    cityType: type,
                    isRender: false
                })
            }
            curCity.text(me.text());
            curCity.attr("title", me.text());
            curCity.attr("data-name", me.text());
            curCity.attr("data-id", cityId);
            me.parent().addClass("none");
            var check = order.dropCheck(city);
            check ? dropStr.addClass("none") : dropStr.removeClass("none");
        });

        Region.on("click", function() {
            var post = $(".visa-sendInfo"),
                cityList = post.find(".send-city-ul li"),
                regionList = post.find(".send-region-ul li");
            if (cityList.length && !regionList.length) {
                var cityName = post.find(".send-city").text(),
                    cityList = post.find(".send-city-ul  li:contains(" + cityName + ")"),
                    cityId = cityList.attr("data-id");
                if (cityId) {
                    order.cityLink({
                        id: cityId,
                        Parent: post,
                        cityType: 2,
                        isRender: true
                    });
                };
            }
        });
    },
    /**
     * 初始化常旅客信息
     */
    initPlayer: function() {
        var self = this,
            isSign = self.getMemberId(),
            list = $(".visa-playlists");
        if (!isSign) {
            list.siblings(".h3-title").append("<i class='J_btnLogin'>登录后填写更便捷</i>");
        } else {
            $fn.getJson(self.playUrl, "", function(data) {
                if (data.Status = "Success") {
                    var list = data.Data.linkerList || [],
                        data = pListDot(list);
                    $(".visa-playlists").before(data);
                }
            });
        }
    },

    /**
     * 初始化基本样式，费用数据
     */
    initDataBase: function() {
        //初始化加减按钮
        var self = this,
            people = $(".people-box input"),
            isSign = self.getMemberId(),
            sendCity = $("#hidProvinceName").val();
        people.each(function() {
            var me = $(this);
            order.initUpOrDown(me);
        });
        order.postCost(sendCity); //初始化获取邮费
        if (order.AsynType && isSign) {
            $fn.getJson(order.cardUrl, "", function(Jdata) {
                var data = Jdata.Data || {},
                    res = data.Result || {};
                order.Integral = res.Integral || 0;
                order.IsExistBLH = res.IsExistBLH || 0;
                order.getAjaxData({
                    asynType: order.AsynType,
                    callback: order.getCustType
                });
            });
        } else {
            order.getAjaxData({
                asynType: order.AsynType,
                callback: order.getCustType
            });
        }
    },

    //优惠初始化异步处理
    getAjaxData: function(cfg) {
        var self = this,
            data = {},
            disclist = [],
            module = $(".visa-coupon"),
            load = "";
        data.siteType = 0;
        data.ProductType = 1;
        data.PageType = 3;
        data.PublicPlatmentId = 1;
        data.productId = parseInt($("#hidLineId").val()) || 0;
        data.StartDate = $("#hidStartDate").val();
        if (!cfg || !cfg.asynType) {
            order.renderData(cfg);
            return;
        }
        if (module.length) {
            load = module.empty();
        } else {
            load = $(".J_coupon_box");
        }
        $(".visa-header-people input").each(function() {
            var me = $(this);
            if (parseInt(me.val()) < 1) return;
            disclist.push({
                Count: parseInt(me.val()) || 0,
                UnitPrice: parseInt(me.attr("peoplecost")) || 0,
                PriceType: me.hasClass("J_adult") ? 1 : 2
            });
        });
        load.append(order.Loading);
        order.IsClickOn = false; //禁止按钮点击
        data.PriceDetailList = $.extend([], disclist);
        $fn.getJson(order.discUrl, data, function(Jdata) {
            order.IsClickOn = true; //可以点击按钮
            $(".J_coupon_box loading").remove();
            var array = Jdata.Data.PreferentialList,
                Jlist = [],
                BLHList = [];
            if (array && array.ProductPreferentialList.length) {
                var list = array.ProductPreferentialList;
                for (var i = 0; i < list.length; i++) {
                    var commStr = {},
                        type = list[i].PreferentialType,
                        count = list[i].PreferentialCount,
                        isShow = list[i].IsCanShow;
                    commStr.RuleId = list[i].RuleId;
                    commStr.IconContent = list[i].IconContent;
                    commStr.IconColor = list[i].IconColor;
                    commStr.PreferentialType = type;
                    commStr.PreferentialCount = count;
                    commStr.Remark = list[i].Remark;
                    commStr.StartDate = list[i].StartDate;
                    commStr.EndDate = list[i].EndDate;
                    //优惠码的类型为5(基本废弃)，红包的类型为6,百旅会积分类型为10
                    if (type === 6) {
                        var HBlist = list[i].HongBaoBatchList;
                        if (!HBlist) continue;
                        for (var j = 0; j < HBlist.length; j++) {
                            var disc = {};
                            disc.ParValue = HBlist[j].ParValue;
                            disc.CouponNo = HBlist[j].CouponNo;
                            Jlist.push($.extend({}, commStr, disc));
                        };
                    } else if (type === 10 && isShow) {
                        var disc = {};
                        disc.ParValue = list[i].PreferentialUnitPrice;
                        disc.Rate = list[i].PointsRate;
                        disc.CouponNo = "";
                        BLHList.push($.extend({}, commStr, disc));
                    } else if (type != 5 && type != 6 && type != 10) {
                        var disc = {};
                        disc.ParValue = list[i].PreferentialUnitPrice;
                        disc.CouponNo = "";
                        Jlist.push($.extend({}, commStr, disc));
                    }
                };
            }
            var filter = self.filterData(BLHList);
            filter ? Jlist.push(filter) : "";
            cfg.jsonList = $.extend([], Jlist);
            order.renderData(cfg);
        });
    },
    //对百旅会数据滤一遍，筛选出金额最大的信息
    filterData: function(list) {
        var self = this,
            isSign = self.getMemberId(),
            maxObj = "";
        for (var i = 0; i < list.length; i++) {
            var max = maxObj.ParValue || 0,
                price = list[i].ParValue,
                maxObj = max > price ? maxObj : list[i];
        };
        if (maxObj) {
            var icon = "",
                status = "",
                cost = maxObj.ParValue,
                count = maxObj.PreferentialCount,
                needIntegral = parseInt(cost * count / maxObj.Rate) || 0, //所需积分
                integral = self.Integral || 0, //用户积分
                isBLH = self.IsExistBLH, //是否百旅会会员(0否，1是)
                rest = integral - needIntegral; //剩余积分
            if (!maxObj.Rate || !needIntegral) {
                status = "disabled";
                icon = "close";
            } else if (isSign) {
                if (isBLH && maxObj.Rate) {
                    status = rest > 0 ? "" : "disabled";
                    icon = rest > 0 ? "" : "close";
                } else {
                    status = "disabled";
                    icon = "close";
                }
            } else {
                status = "";
                icon = "close";
            }
            maxObj.checkStatus = status;
            maxObj.iconStatus = icon;
            self.ResidualIntegral = rest
        }
        return maxObj;
    },
    //重新渲染优惠副标题提醒
    renderTitle: function() {
        var self = this,
            integral = order.ResidualIntegral, //剩余积分
            IsExistBLH = self.IsExistBLH, //是否百旅会会员
            isSign = self.getMemberId(), //是否登录
            title = $(".J_coupon_box").find(".h3-title").find("em");
        if (isSign) {
            var str = "";
            if (IsExistBLH > 0) {
                str = integral > 0 ? "亲爱的客官，周游世界也要能省则省" : "账户无积分，暂时无法使用";
            } else {
                str = "您还不是百旅会会员，暂时无法享受此优惠";
            }
            title.text(str);
        } else {
            title.text("如需使用优惠，请先登录");
        }
    },
    //渲染数据，重新计算价格
    renderData: function(cfg) {
        var self = this;
        if (cfg && cfg.hasOwnProperty("btnType")) {
            var ele = cfg.curBtn,
                type = ele.attr("peopletype");
            if (cfg.btnType === "add") {
                self.addTraveler(ele);
            } else if (cfg.btnType === "del") {
                self.deleteTraveler(ele);
            }
            self.initUpOrDown(ele);
        }

        if (cfg.asynType) {
            var data = cfg.jsonList || [];
            $(".J_coupon_box").html(discDot(data));
            self.renderTitle();
        }
        self.baseCost();
        self.updatePeople(); //先更新人数，再进行计算
        self.insuCost();
        self.discCost();
        self.otherCost();
        self.updateCost();
        self.visaCost();
        cfg.callback && cfg.callback();
    },

    /**
     *初始化邮寄信息的所在区域
     */
    initArea: function() {
        var post = $(".visa-sendInfo"),
            areaName = post.find(".send-pro").text(),
            areaLine = post.find(".send-pro-ul").find("li:contains(" + areaName + ")"),
            areaId = areaLine.attr("data-id") || 0;
        if (areaId > 0) {
            order.cityLink({
                id: areaId,
                Parent: post,
                cityType: 1,
                isRender: true
            });
        }
    },
    /**
     * 城市级联
     */
    cityLink: function(city) {
        var self = this,
            post = city.Parent,
            type = city.cityType,
            cityList = post.find(".send-city-ul"),
            regionList = post.find(".send-region-ul"),
            cityName = post.find(".send-city"),
            regionName = post.find(".send-region"),
            curUrl = type === 1 ? self.cityUrl : self.areaUrl,
            curEle = type === 1 ? cityList : regionList;
        if (!city.isRender) {
            if (type === 1) {
                cityName.text(self.SELECT_CITY)
            }
            regionName.text(self.SELECT_AREA);
        }
        order.renderCity(curUrl + city.id, curEle);
    },
    /**
     * 城市级联渲染
     */
    renderCity: function(url, el) {
        $fn.getJson(url, "", function(data) {
            var list = data.result || [];
            if (list && list.length) {
                var city = "";
                for (var i = 0; i < list.length; i++) {
                    city = city + "<li data-id=" + list[i].id + ">" + list[i].name + "</li>";
                };
                el.empty().append(city);
            }
        });
    },
    /**
     * 下拉框验证
     */
    dropCheck: function(ele) {
        var self = this,
            flag = true;
        ele.each(function() {
            var str = $(this).text(),
                array = [self.SELECT_PROVINCE, self.SELECT_CITY, self.SELECT_AREA];
            flag = array.indexOf(str) > -1 ? false : true;
            if (!flag) return false;
        });
        return flag;
    },



    verifyCheck: function() {
        fish.require("verify", function() {
            fish.all(".J_Name,.J_Phone,.J_Email,.J_Area,.J_BirthDate").verify();
            fish.all(".J_TKHeader,.J_TKUserName,.J_TKUserPhone,.J_TKUseraddress").verify();
        });
    },

    verifyCheckName: function() {
        fish.require("verify", function() {
            fish.all(".J_Name,.J_BirthDate").verify();
        });
    },

    /**
     * @desc 初始化旅顾勾选
     */
    initAdviser: function() {
        var adviserId = $("#lvguID");
        if (adviserId && adviserId.length) {
            adviserId[0].checked = parseInt($("#hidIsSelect").val(), 10) ? true : false;
        }
    },
    /**
     * @desc 初始化绑定点击日期控件事件功能
     */
    calPickInit: function() {
        var cal = new $.Calendar({
            skin: "white",
            width: 1000,
            isBigRange: true,
            monthNum: 1
        });
        $(document).on("focus", "#J_outCal", function() {
            var earlydate = $('#hidEarlyBookDate').val();
            var laterdate = $('#hidLaterBookDate').val();
            cal.pick({
                elem: this,
                startDate: earlydate,
                endDate: laterdate,
                mode: "rangeFrom",
                currentDate: [$('#J_outCal').val()],
                fn: function() {
                    var current = $('#J_outCal').val();
                    $(".visa-header-simple ul li:first-child").html("出行日期：" + current);
                    $(".insurance-table .insudate-td").html(current);
                    $("#hidStartDate").val(current);
                    order.getAjaxData({
                        asynType: order.AsynType
                    });
                }
            });
        });

        $(document).on("click", ".J_BirthDate", function() {
            function cYear(number) {
                var date = new Date();
                date.setFullYear(date.getFullYear() + number);
                return date;
            };
            var currentDate = [],
                type = $(this).parents(".visa-playlist").attr("data-name"),
                startDate = type == "child" ? cYear(-12) : "",
                endDate = type == "child" ? cYear(0) : cYear(-12),
                cDate = type == "child" ? cYear(-12) : new Date(1985, 1 - 1, 1);
            currentDate.push(cDate);
            cal.pick({
                elem: this,
                startDate: startDate,
                endDate: endDate,
                mode: "rangeFrom",
                currentDate: currentDate
            });
        });
    },
    /**
     * hover效果
     */
    hover: function() {
        var jTips = $(".J_Tips,.J_Warn"),
            jTime = $(".J_DateTips"),
            jEffect = $(".J_timeTips"),
            jInsuTips = $(".ui-dialog-safe,.ui-dialog-warn"),
            jDiscTips = ".J_coupon_detail",
            events = "mouseover mouseout";
        var hover;
        //保险图标提示
        jTips.hover(function() {
            $(this).siblings().show();
        }, function() {
            var self = $(this);
            hover = setTimeout(function() {
                self.siblings().hide();
            }, 100);
        });
        //保险内容悬停
        jInsuTips.hover(function() {
            window.clearTimeout(hover);
        }, function() {
            $(this).hide();
            $(this).prev().hide();
        });
        //办理时长提示
        jTime.hover(function() {
            $(this).next().children().show();
        }, function() {
            $(this).next().children().hide();
        });
        //保险中生效日期提示
        jEffect.hover(function() {
            $(this).next().show();
        }, function() {
            $(this).next().hide();
        });
        //优惠显示
        $(document).on(events, jDiscTips, function(e) {
            var self = $(this),
                type = "mouseover";
            if (e && e.type == type) {
                self.next().show();
            } else {
                self.next().hide();
            }
        });
    },
    /**
     * 签证价格体系
     */
    visaCost: function() {
        var anum = parseInt($(".J_adult").val()) || 0;
        var cnum, vnum;
        var tmplArr = [];
        $(".J_child").map(function(index, item) {
            tmplArr.push($(item).val());
        });
        cnum = tmplArr.join("|");
        vnum = anum + "|" + cnum;
        $("#hidPriceList").val(vnum);
    },

    /**
     * 获取人员类型数据
     */
    getCustType: function() {
        var cust = $(".J_pType_ul")[0];
        if (cust) {
            order.CustType = cust;
        } else {
            var value = '<ul class="pType-ul J_pType_ul none">' +
                '<li data-id="268">在职人员</li>' +
                '<li data-id="275">学龄前儿童</li>' +
                '<li data-id="273">退休老人</li>' +
                '<li data-id="274">在校学生</li>' +
                '<li data-id="269">自由职业者</li>' + '</ul>'
            order.CustType = value;
        }
    },

    /**
     * 基本费用
     */
    baseCost: function() {
        var vtype = "people";
        $(".J_Vcost[vtype=" + vtype + "]").parent(".cost-line").remove();
        $(".people-box input").each(function() {
            var me = $(this),
                num = parseInt(me.val()) || 0,
                price = parseFloat(me.attr("peoplecost")),
                type = me.attr("peopletype"),
                name = me.parent(".people-box").prev("span").text() + me.parent(".people-box").next("i").text();
            var data = costDot({
                Name: name,
                Num: num,
                Type: type,
                vType: vtype,
                Price: price,
                Cost: price * num
            });
            if (num > 0) {
                $(".visa-priceT .visa-price-end").before(data);
            }
        });
    },

    /**
     * 保险费用
     */
    insuCost: function() {
        var vtype = "insu";
        $(".J_Vcost[vtype=" + vtype + "]").parent(".cost-line").remove();
        $(".J_insuRadio").each(function() {
            var me = $(this);
            if (me.prop("checked")) {
                var post = $(".J_Vcost[vtype='post']").parent(".cost-line");
                var insu = order.updateInfo(vtype, me);
                var data = costDot(insu);
                if (post.length > 0) {
                    post.before(data);
                } else {
                    $(".visa-priceB .visa-price-end").before(data);
                }
            }
        });
    },
    /**
     * 其它类型费用
     */
    otherCost: function() {
        var vtype = "other";
        $(".J_Vcost[vtype=" + vtype + "]").parent(".cost-line").remove();
        $(".J_otherCheckBox").each(function() {
            var me = $(this);
            if (me.prop("checked")) {
                var post = $(".J_Vcost[vtype='post']").parent(".cost-line");
                var other = order.updateInfo(vtype, me);
                var data = costDot(other);
                if (post.length > 0) {
                    post.before(data);
                } else {
                    $(".visa-priceB .visa-price-end").before(data);
                }
            }
        });
    },
    /**
     * 优惠费用
     */
    discCost: function() {
        var vtype = "disc";
        $(".J_Vcost[vtype=" + vtype + "]").parent(".cost-line").remove();
        $(".J_discRadio").each(function() {
            var me = $(this);
            if (me.prop("checked")) {
                var post = $(".J_Vcost[vtype='post']").parent(".cost-line");
                var disc = order.updateInfo(vtype, me);
                if (!disc || !disc.Cost) return;
                if (post.length > 0) {
                    post.before(costDot(disc));
                } else {
                    $(".visa-priceB .visa-price-end").before(costDot(disc));
                }
            }
        });
    },
    /**
     * 实际快递费用
     */
    postCost: function(city) {
        if (city) {
            var send = $("#hidSendProvinceName").val() || "",
                param = "receiptProvinceName=" + city + "&sendProvinceName=" + send,
                url = order.postUrl + param;
            $fn.getJson(url, "", function(data) {
                if (data.Data) {
                    var vtype = "post";
                    var amount = data.Data.PostAmount || 10,
                        me = $(".J_emailP"),
                        name = me.attr("dataname"),
                        str = "[顺丰" + name + "¥" + amount + "]";
                    me.prev("i").remove();
                    me.attr("dataprice", amount);
                    me.text(str);
                    $(".J_Vcost[vtype=" + vtype + "]").parent(".cost-line").remove();
                    var post = order.updateInfo(vtype, me);
                    var data = costDot(post);
                    $(".visa-priceB .visa-price-end").before(data);
                    order.updateCost();
                }
            });
        }
    },

    //获取单个产品信息
    updateInfo: function(vtype, ele) {
        var num = parseInt(ele.attr("datanum") || 0),
            pirce = parseFloat(ele.attr("dataprice") || 0);
        return {
            Name: ele.attr("dataname") || "",
            Num: num,
            Type: ele.attr("datatype") || "",
            vType: vtype,
            Price: pirce,
            Cost: num * pirce
        };
    },

    /**
     * 更新总额
     */
    updateCost: function() {
        var totalCost = 0,
            costList = $(".cost-line").find(".J_Vcost");
        costList.each(function(i, el) {
            var cost = 0,
                vtype = $(el).attr("vtype"),
                price = parseFloat($(this).children("i").text());
            cost = vtype === "disc" ? -price : price;
            totalCost = totalCost + cost;
        });
        totalCost < 0 ? totalCost = 0 : "";
        $(".J_totalPrice").text(totalCost);
    },

    //更新文案(人数)
    updatePeople: function() {
        var childNums = 0;
        $(".J_child").map(function(index, item) {
            childNums += parseInt($(item).val()) || 0;
        })
        var val = "",
            adultNum = parseInt($(".J_adult").val()) || 0,
            childNum = childNums,
            totalNum = adultNum + childNum;
        if (adultNum > 0 && childNum < 1) {
            val = "办理人数：成人x" + adultNum + "人";
        } else if (adultNum < 1 && childNum > 0) {
            val = "办理人数：儿童x" + childNum + "人";
        } else {
            val = "办理人数：成人x" + adultNum + "人&nbsp;&nbsp;&nbsp;儿童x" + childNum + "人";
        }
        $($(".visa-header-simple ul").children("li")[1]).html(val);
        $(".insurance-table .insunum-td span").text(totalNum);
        $(".other-table .othernum-td span").text(totalNum);
        $(".insurance-table .J_insuRadio").attr("datanum", totalNum);
        $(".other-table .J_otherCheckBox").attr("datanum", totalNum);
    },
    /**
     * 点击事件
     */
    initEvent: function() {
        var self = this;
        //展开，隐藏明细
        $(".visa-header-btn").on("click", function() {
            var me = $(this),
                txt = $(".visa-header-details"),
                simple = $(".visa-header-simple");
            if (me.hasClass("hide")) {
                txt.hide();
                simple.show();
                me.html("展开明细").removeClass("hide").addClass("show");
            } else {
                txt.show();
                simple.hide();
                me.html("隐藏明细").removeClass("show").addClass("hide");
            }
        });
        var orderBtn = $('.J_Submit');
        //减人数
        $(".J_BtnDown").on("click", function() {
            var childNums = 0;
            if (!self.IsClickOn) return; //按钮是否是可点击的
            $(".J_child").map(function(index, item) {
                childNums += parseInt($(item).val());
            })
            var me = $(this).next("input"),
                type = me.attr("peopletype"),
                adult = parseInt($(".J_adult").val()),
                child = childNums,
                number = adult + child,
                current = $("#hidStartDate").val();
            if (number - 1 < 1) {
                $('.J_PeopleIsZero').removeClass('none');
            }
            if (me.val() && parseInt(me.val()) > 0) {
                me.val(parseInt(me.val()) - 1);
                order.getAjaxData({
                    asynType: self.AsynType,
                    btnType: "del",
                    curBtn: me
                });
            }
        });
        //加人数
        $(".J_BtnUp").on("click", function() {
            var me = $(this).prev("input"),
                type = me.attr("peopletype"),
                current = $("#hidStartDate").val();
            if (!self.IsClickOn) return; //按钮是否是可点击的
            if (!$('.J_PeopleIsZero').hasClass('none')) {
                $('.J_PeopleIsZero').addClass('none');
            }
            if (me.val() && parseInt(me.val()) < 999) {
                me.val(parseInt(me.val()) + 1);
                order.getAjaxData({
                    asynType: self.AsynType,
                    btnType: "add",
                    curBtn: me
                });

            }
        });
        //勾选保险
        $(".J_insuRadio").on("click", function() {
            var me = $(this);
            var type = me.attr("datatype");
            var radio = $(".J_insuRadio[datatype=" + type + "]");
            if (me.prop("checked")) {
                radio.prop("checked", false);
                me.prop("checked", true);
            } else {
                radio.prop("checked", false);
            };
            order.insuCost();
            order.updateCost();
            order.isDisplay();
        });

        //勾选优惠
        $(document).on("click", ".J_discRadio", function(e) {
            e.stopPropagation();
            var me = $(this),
                id = me.attr("dataid"),
                type = me.attr("name"),
                radio = $(".J_discRadio[name=" + type + "]"),
                isSign = self.getMemberId(),
                isBLH = me.parents(".J_discBLH");
            if (!isSign && id != 0 && isBLH.length) {
                fish.dom("#loginText a").click();
                me.prop("checked", false);
                return;
            };
            if (me.prop("checked")) {
                radio.prop("checked", false);
                me.prop("checked", true);
            } else {
                radio.prop("checked", false);
            };
            order.discCost();
            order.updateCost();
        });

        $(document).on("click", ".J_discBLH", function(e) {
            var input = $(this).find(".J_discRadio");
            $(input).trigger("click");
        });

        //勾选其它产品
        $(".J_otherCheckBox").on("click", function() {
            order.otherCost();
            order.updateCost();
        });

        //更多、收起
        $('.J_btnMore').on("click", function() {
            var btn = $(this);
            var type = parseInt($(this).attr("datatype"));
            var more = $(".insurance-table").find("tr[datatype=" + type + "]");
            more.each(function() {
                var me = $(this);
                if (me.hasClass("none")) {
                    me.removeClass("none").addClass("block");
                    btn.html("收起");
                    btn.addClass("close");
                } else if (me.hasClass("block")) {
                    me.removeClass("block").addClass("none");
                    btn.html("更多");
                    btn.removeClass("close");
                }
            });
        });

        $('.J_otherMore').on("click", function() {
            var btn = $(this);
            $(".other-table").find("tr").each(function() {
                var me = $(this);
                if (me.hasClass("none")) {
                    me.removeClass("none").addClass("block");
                    btn.html("收起");
                    btn.addClass("close");
                } else if (me.hasClass("block")) {
                    me.removeClass("block").addClass("none");
                    btn.html("更多");
                    btn.removeClass("close");
                }
            });
        });

        $(document).on("click", ".J_discMore", function() {
            var btn = $(this);
            $(".disc-table").find("tr").each(function() {
                var me = $(this);
                if (me.hasClass("none")) {
                    me.removeClass("none").addClass("block");
                    btn.html("收起");
                    btn.addClass("close");
                } else if (me.hasClass("block")) {
                    me.removeClass("block").addClass("none");
                    btn.html("更多");
                    btn.removeClass("close");
                }
            });
        });

        $(".J_visaTicket label,.J_editTicket").on("click", function(e) {
            var me = $(this),
                list = $(".J_TKTraveler").find("label"),
                isHasNoTK = me.find("#no-ticket").length,
                isHasData = me.find(".has-data").css("display"),
                signStatus = self.getMemberId();
            e.preventDefault();
            e.stopPropagation();
            if (!signStatus) {
                fish.dom("#loginText a").click();
                return;
            };
            if (isHasNoTK || isHasData !== "none") {
                me.siblings().removeClass("checked");
                me.addClass("checked");
            }
            if (!me.hasClass("active")) return;
            $fn.getJson(self.addressUrl, "", function(data) {
                if (data.status !== "Success") return;
                var address = data.data.Address || [];
                self.getAddrModule(address);
            });
        });

        $(".J_TKClose").click(function() {
            var me = $(this),
                module = $(".visa-ticket-bg,.visa-ticket-module");
            me.hasClass("active") ? module.show() : module.hide();
            $(".tk-traveler").css("height", "25px");
            $(".J_displayName").removeClass("on");
        });

        $(".J_TKType span").click(function(e) {
            var me = $(this);
            e.preventDefault();
            me.siblings().removeClass("active");
            me.addClass("active");
        });

        $(".J_displayName").click(function() {
            var me = $(this),
                tavlist = $(".tk-traveler");
            if (me.hasClass("on")) {
                tavlist.css("height", "25px");
                me.removeClass("on");
            } else {
                tavlist.css("height", "auto");
                me.addClass("on");
            }
        });
        $(document).on("click", ".J_TKTraveler label", function() {
            var me = $(this),
                info = $(".tk-box-info"),
                data = me.attr("data-info") || "",
                list = data ? JSON.parse(decodeURIComponent(data)) : "";
            info.empty().append(addressDot(list));
            me.siblings("label").removeClass("checked");
            me.addClass("checked");
            info.show();
            $(".tk-box-make").hide();
            self.addAddressType = "select"; //地址添加的类型，选择为select,填写为add
        });

        $(".J_addAddress").click(function(e) {
            e.preventDefault();
            $(".tk-traveler").find("label").removeClass("checked");
            $(".tk-box-info").hide();
            $(".tk-box-make").show();
            self.addAddressType = "add"; //地址添加的类型，选择为select,填写为add
        });

        $(".J_TKSubmit").click(function() {
            var actionType = self.addAddressType;
            if (actionType === "add") {
                var make = $(".mark-address"),
                    str = make.find(".J_send_span"),
                    inval = make.find(".J_invalid"),
                    check = order.dropCheck(str),
                    name = ".J_TKHeader,.J_TKUserName,.J_TKUserPhone,.J_TKUseraddress";
                if (!fish.all(name).verify().check()) {
                    check ? inval.addClass("none") : inval.removeClass("none");
                    return;
                } else {
                    check ? inval.addClass("none") : inval.removeClass("none");
                    if (!check) return;
                };
                var data = {},
                    title = $(".J_TKHeader").val().trim(),
                    address = $(".mark-address"),
                    province = address.find(".send-pro"),
                    city = address.find(".send-city"),
                    region = address.find(".send-region");
                data.InvoiceTitle = {
                    Id: 0,
                    Name: title,
                    IsDefault: false
                };
                data.InvoiceAddress = {
                    Name: $(".J_TKUserName").val().trim(),
                    Mobile: $(".J_TKUserPhone").val().trim(),
                    ProvinceId: province.attr("data-id") || "",
                    ProvinceName: province.attr("data-name") || "",
                    CityId: city.attr("data-id") || "",
                    CityName: city.attr("data-name") || "",
                    RegionId: region.attr("data-id") || "",
                    RegionName: region.attr("data-name") || "",
                    StreetAddress: $(".J_TKUseraddress").val().trim()
                }
                var param = "param=" + encodeURIComponent(JSON.stringify(data));
                $fn.getJson(order.ticketUrl, param, function(res) {
                    self.goRestModule(data.InvoiceAddress);
                });
            } else {
                var str = $(".tk-traveler").find("label.checked").attr("data-info"),
                    line = JSON.parse(decodeURIComponent(str));
                if (!fish.all(".J_TKHeader").verify().check()) return;
                var data = {
                    Id: line.Id,
                    Name: line.Name,
                    Mobile: line.Mobile,
                    ProvinceId: line.ProvinceId,
                    ProvinceName: line.Province,
                    CityId: line.CityId,
                    CityName: line.City,
                    RegionId: line.RegionId,
                    RegionName: line.Region,
                    StreetAddress: line.Street
                }
                self.goRestModule(data);
            }
        });

        $(document).on("click", ".J_btnLogin", function() {
            fish.dom("#loginText a").click();
        });

        $(document).on("click", ".J_disPlayer", function(e) {
            var me = $(this),
                list = $(".visa-playbox .list");
            if (me.hasClass("close")) {
                list.css("height", "25px");
                me.text("展开");
                me.removeClass("close");
            } else {
                me.text("收起");
                list.css("height", "auto");
                me.addClass("close");
            }
        });

        $(document).on("click", ".J_selectPlayer label", function() {
            var me = $(this),
                linkerId = me.attr("data-id") || ""; //常旅id
            if (me.hasClass("checked")) { //取消选择删除对应模块的数据
                var ul = $("input[data-id='" + linkerId + "']").parents("ul");
                self.clearPlayer(ul);
                me.toggleClass("checked");
            } else { //选择常旅客，给第一个空白的模块赋值
                var linkerName = me.find("span").text() || "", //常旅姓名
                    birthDate = me.attr("data-birth") || "", //常旅出生
                    personType = me.attr("data-size") || 　"", //常旅成人或儿童
                    personTypeName = me.find("i").text() || "", //常旅成人或儿童
                    customerType = me.attr("data-type") || "", //常旅类型id
                    customerTypeName = me.attr("data-type-name") || "",
                    playIsHasType = null; //常旅类型名
                if (personType == "2") {
                    playIsHasType = ".J_PlayName[data-type='adult']";
                } else if (personType == "1") {
                    playIsHasType = ".J_PlayName[data-type='child']";
                } else {
                    playIsHasType = ".J_PlayName";
                }
                var playerList = $(".visa-playlists").find(playIsHasType),
                    player = null;
                playerList.each(function() {
                    var e = $(this),
                        id = e.attr("data-id") || "",
                        value = e.val().trim();
                    if (value || id) return;
                    player = e;
                    return false;
                });
                if (player) { //找到了模块并赋值
                    var ul = player.parents("ul"),
                        playType = ul.find(".J_PlayType"),
                        playBirth = ul.find(".J_BirthDate"),
                        btnDel = playBirth.siblings(".del");
                    player.attr("data-id", linkerId);
                    player.val(linkerName);
                    playBirth.val(birthDate);
                    if (customerType > 0) {
                        playType.attr("data-index", customerType);
                        playType.text(customerTypeName);
                    }
                    me.toggleClass("checked");
                } else { //没有找到模块
                    var playBox = $(".visa-playbox"),
                        tips = playerList.length == 0 ? "出游人暂未做预订" : "出游人预定人数已满",
                        str = "<div class='visa-play-pop'>" + personTypeName + tips + "，如需添加，请修改预定人数！</div>";
                    playBox.find(".visa-play-pop").remove();
                    playBox.append(str);
                    playBox.find(".visa-play-pop").stop().animate({
                        "display": "block"
                    }, 2000, function() {
                        $(this).remove();
                    });
                }
            }
        });

        $(document).on("click", ".J_playerSave", function() {
            $(this).toggleClass("checked");
        });

        $(document).on("click", ".J_playerClear", function() {
            var ul = $(this).parents("ul"),
                id = ul.find(".J_PlayName").attr("data-id");
            self.clearPlayer(ul);
            $("label[data-id=" + id + "]").removeClass("checked");
        });
    },
    /**
     * 清除单个出游人信息填写模块
     */
    clearPlayer: function(e) {
        var playName = e.find(".J_PlayName"),
            playType = e.find(".J_PlayType"),
            personId = playName.attr("data-id"),
            personType = playName.attr("data-type");
        playName.val("");
        playName.attr("data-id", "");
        e.find(".J_BirthDate").val("");
        if (personType == "child") {
            playType.text("在校学生");
            playType.attr("data-index", "274");
        } else {
            playType.text("在职人员");
            playType.attr("data-index", "268");
        }
    },

    /**
     * 关闭窗口，给发票按钮赋值
     */
    goRestModule: function(data) {
        var visaTK = $(".visa-ticket"),
            needTK = $("#need-ticket"),
            hasData = needTK.siblings(".has-data"),
            tkType = $(".J_TKType").find("span.active"),
            titles = $(".J_TKHeader").val().trim();
        needTK.siblings().hide();
        hasData.find("em").text(titles);
        hasData.find("i").text(tkType.text()).end().show();
        visaTK.children().removeClass("checked");
        needTK.parent().removeClass("active").addClass("checked");
        $(".J_visaTicket").attr("data-info", encodeURIComponent(JSON.stringify(data)));
        $(".tk-traveler").css("height", "25px");
        $(".J_displayName").removeClass("on");
        $(".J_TKClose").trigger("click");
    },

    /**
     * 获取地址模块 type为true显示tk-box-info模块，false显示tk-box-make模块
     */
    getAddrModule: function(list) {
        var self = this,
            info = $(".tk-box-info"),
            make = $(".tk-box-make"),
            module = $(".visa-ticket-bg,.visa-ticket-module");
        if (list.length) {
            var html = "",
                index = 0,
                traveler = $(".J_TKTraveler");
            for (var i = 0; i < list.length; i++) {
                var str = encodeURIComponent(JSON.stringify(list[i])),
                    checked = ""; //对数据进行转码，
                if (list[i].IsDefault === 1) {
                    checked = "checked";
                    index = i;
                }
                html += '<label class="' + checked + '" title="' + list[i].Name + '"  data-info=' + str + '>' + list[i].Name + '</label>';
            };
            traveler.find("label").remove();
            traveler.prepend(html);
            info.empty().append(addressDot(list[index]));
            info.show();
            make.hide();
            self.addAddressType = "select";
        } else {
            info.hide();
            make.show();
            self.addAddressType = "add";
        }
        module.show();
    },

    /**
     * 加减按钮变色
     */
    initUpOrDown: function(ele) {
        var childNums = 0;
        $(".J_child").map(function(index, item) {
            childNums += parseInt($(item).val());
        })
        var adult = parseInt($(".J_adult").val()),
            child = childNums,
            number = adult + child;
        var value = parseInt(ele.val()),
            down = ele.prev("a.J_BtnDown"),
            up = ele.next("a.J_BtnUp");
        if (value >= 0 && value < 999) {
            up.css("background-position", "-19px -226px");
            if (value <= 0) {
                down.css("background-position", "-46px -226px")
            } else {
                down.css("background-position", "7px -226px");
            }
        } else if (value >= 999) {
            down.css("background-position", "7px -226px");
            up.css("background-position", "-73px -226px");
        }

        if (number < 1) {
            $(".J_Submit").addClass("buy-close");
        } else if (number > 0) {
            $(".J_Submit").removeClass("buy-close");
        }
    },
    /**
     * 添加出游人
     */
    addTraveler: function(ele) {
        var peopletype = ele.attr("peopletype"),
            type = peopletype == order.AdultType ? "adult" : "child",
            name = peopletype == order.AdultType ? "成人" : "儿童",
            number = parseInt(ele.val()),
            traveler = {};
        var select = $(order.CustType),
            slist = select.children("li"),
            sIndex = peopletype == order.AdultType ? 0 : 3;
        traveler.playLine = number;
        traveler.playType = type;
        traveler.playName = name;
        traveler.cusIndex = $(slist[sIndex]).attr("data-id");
        traveler.cusName = $(slist[sIndex]).text();
        traveler.cusSelect = select.html();
        var data = pInfoDot(traveler);
        var playlist = $(".visa-playlist").length;
        var adult = $(".visa-playlist[data-name='adult']:last");
        var child = $(".visa-playlist[data-name='child']:first");
        var travelerlist = $(".visa-playlist[data-name=" + type + "]:last");
        if (travelerlist.length > 0) {
            travelerlist.after(data);
        } else if (playlist < 1) {
            $(".visa-playlists").append(data);
        } else if (type.indexOf("adult") >= 0 && adult.length < 1 && child.length > 0) {
            child.before(data);
        } else if (type.indexOf("child") >= 0 && adult.length > 0 && child.length < 1) {
            adult.after(data)
        }
        order.verifyCheckName();
        order.sortTraveler();
    },
    /**
     * 删除出游人
     */
    deleteTraveler: function(ele) {
        var peopletype = ele.attr("peopletype"),
            type = peopletype === order.AdultType ? "adult" : "child",
            playlist = $(".visa-playlist[data-name=" + type + "]:last"),
            playId = playlist.find(".J_PlayName").attr("data-id");
        $("label[data-id=" + playId + "]").removeClass("checked");
        playlist.remove();
        order.verifyCheckName();
        order.sortTraveler();
    },
    /**
     * 出游人排序
     */
    sortTraveler: function() {
        var traveler = $(".visa-playlists .visa-playlist");
        traveler.each(function(index, ele) {
            var num = index + 1,
                values = "出游人" + num,
                name = $(this).find(".visa-playL").children(".visa-playL-name");
            name.html(values);
        });
    },
    /**
     * 是否显示保险提示
     */
    isDisplay: function() {
        var isshow = false;
        $(".J_insuRadio").each(function() {
            if ($(this).prop("checked")) {
                isshow = true;
                return false;
            } else {
                isshow = false;
            }
        });
        if (isshow) {
            $(".insurance-warning").hide();
        } else {
            $(".insurance-warning").show();
        }
    },

    /**
     *提交的出游人信息数据
     */
    passengerList: function() {
        var playList = $(".visa-playlist"),
            passengerList = [];
        playList.each(function() {
            var me = $(this),
                Passenger = {},
                peopletype = me.attr("data-name") === "child" ? parseInt(order.ChildType) : parseInt(order.AdultType),
                playname = me.find(".J_PlayName"),
                checked = me.find(".J_playerSave").hasClass("checked");
            Passenger.CustomerId = playname.attr("data-id") || 0;
            Passenger.CustomerName = playname.val();
            Passenger.COPPassengerType = me.find(".J_PlayType").attr("data-index");
            Passenger.CustomerBirthDay = me.find(".J_BirthDate").val();
            Passenger.CustomerType = peopletype;
            Passenger.CustomerSex = 2;
            Passenger.CustomerDefault = checked;
            passengerList.push(Passenger);
        });
        return passengerList;
    },
    /**
     *提交的保险信息数据
     */
    insuranceList: function() {
        var radioList = $(".J_insuRadio"),
            insuranceList = [];
        radioList.each(function() {
            var me = $(this);
            if (me.prop("checked")) {
                insuranceList.push({
                    InsuranceCode: me.attr("datacode"),
                    InsuranceType: me.attr("datatype")
                });
            }
        });
        return insuranceList;
    },
    /**
     *提交的其他类型数据
     */
    additionalList: function() {
        var radioList = $(".J_otherCheckBox"),
            AdditionalList = [];
        radioList.each(function() {
            var me = $(this);
            if (me.prop("checked")) {
                AdditionalList.push({
                    ServiceId: me.attr("dataserviceid"),
                    Count: parseInt(me.attr("datanum")) || 0
                });
            }
        });
        return AdditionalList;
    },
    //优惠数据
    discountList: function() {
        var radioList = $(".J_discRadio"),
            PreferentialStr = [];
        radioList.each(function() {
            var me = $(this),
                id = me.attr("dataid") || 0,
                type = me.attr("datatype"),
                count = parseInt(me.attr("datanum")) || 0;
            if (me.prop("checked") && id != 0) {
                PreferentialStr.push({
                    Count: type == 2 ? count : 0,
                    PromoCode: me.attr("datacode") || "",
                    RuleId: id
                });
            }
        });
        return JSON.stringify(PreferentialStr);
    },
    /**
     *提交发票信息数据
     */
    ticketiInfo: function() {
        var ticket = null,
            str = $(".J_visaTicket").attr("data-info") || "",
            tkTitle = $(".J_TKHeader").val().trim(),
            tkType = $(".J_TKType").find("span.active").attr("data-type"),
            isChecked = $("#need-ticket").parent().hasClass("checked");
        if (str && isChecked) {
            var data = JSON.parse(decodeURIComponent(str));
            ticket = {};
            ticket.AddressId = parseInt(data.Id || 0);
            ticket.AddressMobile = data.Mobile;
            ticket.AddressName = data.Name;
            ticket.InvoiceContent = parseInt(tkType || 1);
            ticket.InvoiceInsideNumber = tkTitle || "";
            ticket.ProvinceId = data.ProvinceId;
            ticket.ProvinceName = data.ProvinceName;
            ticket.CityId = data.CityId;
            ticket.CityName = data.CityName;
            ticket.RegionId = data.RegionId;
            ticket.RegionName = data.RegionName;
            ticket.SpecificAddress = data.StreetAddress;
        }
        return ticket;

    },
    /**
     *提交的邮件信息数据
     */
    postInfo: function() {
        var postInfo = {},
            post = $(".visa-sendInfo");
        if (post.length > 0) {
            var area = [],
                province = "",
                city = "";
            post.find(".J_send_span").each(function(index, ele) {
                area.push($(this).text());
            });
            province = area.length ? area[0] : "";
            if (area.length === 3) {
                city = area[1];
            } else if (area.length === 2) {
                city = area[2];
            }
            postInfo.PostAmount = "";
            postInfo.PostPerson = post.find("input[name='sendName']").val();
            postInfo.PostAdress = area.join("") + post.find(".J_sendStreet").val();
            postInfo.PostCode = post.find(".J_sendCode").val();
            postInfo.PostMobile = post.find(".J_sendPhone").val();
            postInfo.PostWay = 0;
            postInfo.ReceiptProvinceName = province;
            postInfo.PostCity = city;
        }
        return postInfo;
    },

    /**
     *表单所有需提交的数据
     */
    BookingData: function() {
        var linker = $(".visa-listbox"),
            tourAdviser = $("#lvguID"),
            isFromCCT = parseInt($("#hidIsFromCCT").val()),
            IsNeedInvoice = $("#need-ticket").parent().hasClass("checked");
        order.BookingRequest.LineId = $("#hidLineId").val();
        order.BookingRequest.ContactPerson = linker.find("input[name='linkName']").val();
        order.BookingRequest.ContactMoblie = linker.find("input[name='phoneNum']").val();
        order.BookingRequest.ContactMail = linker.find("input[name='email']").val();
        order.BookingRequest.StartDate = $("#hidStartDate").val();
        order.BookingRequest.PriceList = $("#hidPriceList").val();
        order.BookingRequest.Passengers = order.passengerList();
        order.BookingRequest.InsuranceList = order.insuranceList();
        order.BookingRequest.AdditionalList = order.additionalList();
        order.BookingRequest.PreferentialStr = order.discountList();
        order.BookingRequest.PostInfo = order.postInfo();
        order.BookingRequest.InvoiceInfo = order.ticketiInfo();
        order.BookingRequest.IsNeedInvoice = IsNeedInvoice;
        order.BookingRequest.FrontIsFromCCT = isFromCCT ? isFromCCT : 0;

        if (tourAdviser && tourAdviser.length) {
            order.BookingRequest.FrontIsSelect = tourAdviser[0].checked ? "1" : "0";
        }
    },
    /**
     *表单提交前验证用户
     */
    checkUserInfo: function() {
        var ContactPerson = encodeURIComponent(order.BookingRequest.ContactPerson);
        var ContactMoblie = order.BookingRequest.ContactMoblie;
        var ContactMail = encodeURIComponent(order.BookingRequest.ContactMail);
        var _url = order.checkUrl + '&mobile=' + ContactMoblie + "&Email=" + ContactMail + "&RegName=" + ContactPerson + "&s=" + Math.random();

        $.ajax({
            url: _url,
            dataType: "text",
            success: function(data) {
                var result = data.split('|');
                if (data == 'success') {
                    order.dataAjax(JSON.stringify(order.BookingRequest));
                    return;
                }
                switch (result[0]) {
                    case 'login':
                        {
                            fish.dom("#loginText a").click();
                            break;
                        }
                    case 'error':
                        {
                            alert(result[1]);
                        }
                    default:
                        break;
                }
                $(".J_Submit").removeClass("submit-click");
            }
        })

    },
    /**
     *表单提交
     */
    formSubmit: function() {
        $(".J_Submit").on("click", function(e) {
            e.preventDefault();
            var me = $(this),
                str = $(".visa-sendInfo").find(".J_invalid"),
                city = $(".visa-sendInfo").find(".J_send_span"),
                check = order.dropCheck(city);
            if (me.hasClass("submit-click") || me.hasClass("buy-close")) {
                return;
            }
            if (!fish.all(".J_Name,.J_Phone,.J_Email,.J_Area,.J_BirthDate").verify().check()) {
                check ? str.addClass("none") : str.removeClass("none");
                return;
            } else {
                check ? str.addClass("none") : str.removeClass("none");
                if (!check) return;
            }
            order.linePayType = $("#hidLinePayType").val();
            order.BookingData();
            $(".J_Submit").addClass("submit-click");
            order.checkUserInfo();
        });
    },
    dataAjax: function(data) {
        var actparam = '';
        if (this.getQueryString('isactproduct')) {
            actparam = '&isactproduct=true';
        }
        $.ajax({
            url: order.ajaxUrl + "&linePayType=" + order.linePayType + actparam,
            type: "POST",
            dataType: "json",
            data: data,
            success: function(data) {
                if (data.status === order.SUCCESS_FLAG) {
                    window.location.href = data.url;
                } else {
                    $(".J_Submit").removeClass("submit-click");
                    order.BookingRequest = {
                        LineId: "",
                        ContactPerson: "",
                        ContactMoblie: "",
                        ContactMail: "",
                        StartDate: "",
                        PriceList: "",
                        Passengers: [],
                        InsuranceList: [],
                        PostInfo: {},
                        PreferentialStr: []
                    }
                    alert(data.errMsg);
                }
            }
        })
    }
};
module.exports = order;
