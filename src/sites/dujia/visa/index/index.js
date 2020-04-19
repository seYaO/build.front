/**
 * Created by lyf10464 on 2015/12/10
 * changed br ym10862 on 2015/09-18
 */
window.host = "//www.ly.com";
var Dialog = require("dialog/0.2.0/dialog"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    Common = require("common/0.1.0/index"),
    Login = require("login/0.1.0/index");
var orderTmpl = require("./indexorder.dot"),
    prolistTmpl = require("./prolist.dot");
require("lazyload/0.1.0/index");
var listData = {};
Visa = {
    orderEle: {
        url: "/dujia/AjaxCallTravel.aspx?type=GetVisaOrderProcess&customerSerialId=",
        matchUrl: "/dujia/AjaxCallTravel.aspx?type=ValidateCode&r=",
        proUrl: "/dujia/AjaxcallTravel.aspx?type=GetContinentHotProduct&continentId=",
        adurl: "/intervacation/api/VisaInfo/GetPCVisaAd",
        packetUrl: "/dujia/AjaxCall.aspx?Type=GetRedBagOnce" //红包领取接口

    },
    init: function() {
        var self = this;
        self.clickEvent();
        self.lazyLoad();
        self.hoverEvent();
        self.saveHotData();
        self.visaScroll();
        self.sideadfn(function () {
            self.hideNumber();
        });
        //全局装载模板
        $dialog = new Dialog({
            skin: 'skin2'
        });
    },
    hideNumber: function () {
        // var urlDate = this.getQueryString("hideDate") ? this.getQueryString("hideDate").replace(/-/g, "/") : "";
        $.ajax({
            url: "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue",
            dataType: "jsonp",
            success: function (data) {
                var curDate = "";
                // if (urlDate) {
                //     curDate = Common.dateFormat(new Date(urlDate), "yyyyMMdd");
                // } else {
                    if (data && data.totalseconds) {
                        var total = data.totalseconds.replace(/-/g, "/");
                        curDate = Common.dateFormat(new Date(total), "yyyyMMdd");
                    } else {
                        var now = new Date();
                        curDate = Common.dateFormat(now, "yyyyMMdd");
                    }
                // }
                // curDate = "20170202";
                if (curDate > 20170126 && curDate < 20170203) {
                    $(".module-slider-top").find("li").eq(1).css("display","none")
                }
            }
        });
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    },
    clickEvent: function() {
        var https = window.host;
        $('#imgcode').attr('src', https + Visa.orderEle.matchUrl + Math.random());
        $(document).on("click", ".J_visaPlan-btn", function() {
            var orderIdEl = $(".J_input-orderId"),
                phoneEl = $(".J_input-phone"),
                validCodeEl = $(".J_input-validCode");
            var orderId = orderIdEl.val(),
                phone = phoneEl.val(),
                validCode = validCodeEl.val();
            orderIdEl.css({
                "color": "#333"
            });
            phoneEl.css({
                "color": "#333"
            });
            validCodeEl.css({
                "color": "#333"
            });
            var fromP = $(".ui-vailTips").find("p"),
                fromTip = fromP.children("span");
            if (orderId === "" || phone === "" || validCode === "") {
                fromP.removeClass("none");
                fromTip.text("进度查询条件不可为空");
                return;
            }
            if (orderId.length !== 9) {
                fromP.removeClass("none");
                fromTip.text("请填写正确订单号");
                $(".J_input-orderId").css({
                    "color": "red"
                });
                return;
            }
            if (!Visa.isPhone(phone)) {
                fromP.removeClass("none");
                fromTip.text("请填写正确手机号码");
                $(".J_input-phone").css({
                    "color": "red"
                });
                return;
            }
            var _url = https + Visa.orderEle.url + orderId + "&mobile=" + phone + "&checkCode=" + validCode;
            $.ajax({
                url: _url,
                dataType: "jsonp",
                success: function(data) {
                    fromP.addClass("none");
                    fromTip.text("");
                    if (data.state === 200) {
                        if (JSON.parse(data.data).No === "022") {
                            fromP.removeClass("none");
                            fromTip.text("请填写正确验证码");
                            $(".J_input-validCode").css({
                                "color": "red"
                            });
                        }
                    } else if (data.state === 300) {
                        fromP.removeClass("none");
                        fromTip.text("请先登录");
                    } else {
                        if (JSON.parse(data.data).CustomerSerialId === null) {
                            var config1 = {
                                width: "435px",
                                height: "205px",
                                title: "",
                                type: "html",
                                isdrag: false,
                                content: $(".J_noResult").html()
                            };
                            var _dialog1 = $dialog.modal(config1);
                        } else {
                            var dataArry = [];
                            dataArry.push(JSON.parse(data.data));

                            Visa.render({
                                "tpl": orderTmpl,
                                "data": dataArry,
                                "context": ".ui-searchResult",
                                "overwrite": true,
                                "callback": function() {}
                            });

                            var config2 = {
                                width: "583px",
                                height: "610px",
                                title: "",
                                isdrag: false,
                                type: "html",
                                content: $(".J_searchResult").html()
                            };
                            var _dialog2 = $dialog.modal(config2);
                        }
                    }
                }
            });

        });
        $("#orderId,#phone").on("focus", function() {
            $(this).css("border", "1px solid #8297b0")
        }).on("blur", function() {
            $(this).css("border", "1px solid #ddd")
        });
        $("#validCode").on("focus", function() {
            $(this).css("border", "1px solid #ff7800")
        }).on("blur", function() {
            $(this).css("border", "1px solid #ddd")
        });
        $(".searchBtn").on("click", function() {
            Visa.searchVisa();
        });
        $("#visaType").on("click", function(e) {
            e.stopPropagation();
            var self = $(this);
            if (self.hasClass("icon-down")) {
                self.removeClass("icon-down").addClass("icon-up");
                $(".visa_type").css({
                    "display": "block"
                });
            } else {
                self.removeClass("icon-up").addClass("icon-down");
                $(".visa_type").css({
                    "display": "none"
                });
            }

        });
        $(".visa_type").on("click", "li", function() {
            var self = $(this),
                visaInput = $("#visaType");
            visaInput.data('sttrid', self.attr('sttrid'));
            visaInput.val(self.text());
            visaInput.removeClass("icon-ip").addClass("icon-down");
            $(".visa_type").css({
                "display": "none"
            });
        });
        $("#sCountry").on("focus", function() {
            var self = $(this);
            if (self.val() === "输入您需要签证的国家/地区") {
                self.val("");
            }
        }).on("blur", function() {
            var self = $(this);
            if (self.val() === "") {
                self.val("输入您需要签证的国家/地区");
            }
        });
        $(document).on("click", function() {
            $(".visa_type").css({
                "display": "none"
            });
            $("#visaType").removeClass("icon-up").addClass("icon-down");
        });
        $(document).on("mouseover", ".proLists-tab-panel ul li", function() {
            var me = $(this).find(".ui-freeVisa-footer");
            me.addClass("on");
        });

        $(document).on("mouseout", ".proLists-tab-panel ul li", function() {
            var me = $(this).find(".ui-freeVisa-footer");
            me.removeClass("on");
        });

        $(".J_visaHelp").on("click", function() {
            var me = $(this),
                list = $(".ui-visaHelp-list");
            $(".J_visaHelp").removeClass("on");
            me.addClass("on");
            list.addClass("none");
            list.each(function() {
                var self = $(this),
                    btn = me.index(),
                    index = self.index();
                if (btn === 0 && index < 4) {
                    self.removeClass("none");
                }
                if (btn === 1 && index > 3 && index < 8) {
                    self.removeClass("none");
                }
                if (btn === 2 && index > 7) {
                    self.removeClass("none");
                }
            });
        });

        $(document).on("click", ".J_btnPkOn,.J_btnPKClose,.J_btnPKUse", function() {
            var me = $(this),
                btn = $(".packet-btn"),
                packet = ".packet-main,.packet-bg-color,.packet-bg-img";
            if (me.hasClass("open")) {
                btn.stop().animate({
                    "left": "-137px"
                }, 300, function() {
                    $(packet).show();
                });
            } else {
                $(packet).hide();
                btn.stop().animate({
                    "left": "0px"
                }, 300);
            }
        });

        $(document).on("click", ".J_btnPKGet", function() {
            var userid = Visa.getUser();
            if (!userid) {
                var btn = $(".packet-btn"),
                    packet = ".packet-main,.packet-bg-color,.packet-bg-img";
                $(packet).hide();
                btn.stop().animate({
                    "left": "0px"
                }, 300);
                var login = new Login({
                    loginSuccess: function() {}
                });
                return;
            } else {
                $.ajax({
                    url: Visa.orderEle.packetUrl + "&mid=" + userid + "&UnEncode=1&pageid=2010&fromvisa=1",
                    dataType: 'jsonp',
                    success: function(data) {
                        var view = $(".packet-view");
                        if (data.status == "100") {
                            //领取成功
                            $(".packet-cloud").hide();
                            view.find(".pop1").hide();
                            view.find(".pop2").show();

                        } else if (data.status == "104") {
                            //已领取
                            $(".packet-cloud").hide();
                            view.find(".pop1").hide();
                            view.find(".pop3").show();
                        }
                    }
                });
            }
        });
    },
    isPhone: function(data) {
        return /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|19[0-9]|18[0-9])\d{8}$/.test(data);
    },
    lazyLoad: function() {
        var self = this;
        if (self.isInit) {
            var imgList = $(".ui-proLists-content img").not("[data-img-loaded]");
            $(window).trigger("addElements", imgList);
        } else {
            $(".ui-proLists-content img").lazyload({
                "data_attribute": "img",
                "event": "scroll",
                effect: 'fadeIn'
            });
            self.isInit = true;
        }
        $(window).trigger("scroll");
    },
    hoverEvent: function() {
        var route_index = $(".J_proLists-country").children()[0];
        var pro_index = $(".ui-proLists-content").children()[0];
        var route = "查看更多" + $(route_index).html() + "签证";
        $(route_index).addClass("cur");
        $(".ui-proLists-more a").attr("href", $(route_index).attr("data-url"));
        $(".ui-proLists-more a").html(route);

        var hotBox = $(".J_hotSearch-box li"),
            hotGoods = $(".J_hotVisa-proList"),
            hotCounty = $(".J_proLists-country li"),
            index;
        hotBox.mouseenter(function() {
            var self = $(this);
            self.addClass("ui-hotCity-select");
            self.children(".ui-hotCities-more").show();
            index = self.index() + 1;
            self.find(".J_ui-icon").removeClass("ui-icon-normal" + index).addClass("ui-icon-normal" + index + "-" + index);
        });
        hotBox.mouseleave(function() {
            var self = $(this);
            self.removeClass("ui-hotCity-select");
            self.children(".ui-hotCities-more").hide();
            self.find(".J_ui-icon").removeClass("ui-icon-normal" + index + "-" + index).addClass("ui-icon-normal" + index);
        });

        hotGoods.mouseenter(function() {
            var self = $(this);
            self.children(".J_proCover").addClass("ui-proCover-ie")
            self.children(".J_proCover").css("background-color", "rgba(0,0,0,0.5)");
            self.children(".J_proCover").addClass("ui-proCover-active").stop().animate({
                "top": "0%"
            });
        });
        hotGoods.mouseleave(function() {
            var self = $(this);
            self.children(".J_proCover").stop().animate({
                "top": "54%"
            }, 500, function() {
                self.children(".J_proCover").removeClass("ui-proCover-ie")
                self.children(".J_proCover").css("background-color", "rgba(0,0,0,0)");
            });
        });

        hotCounty.on("click", function() {
            var index = $(this).index();
            var proid = $(this).attr("data-id"),
                __indexN = $.trim($(this).text());

            hotCounty.removeClass("cur");
            $(this).addClass("cur");
            $(".ui-proLists-more a").attr("href", $(this).attr("data-url"));
            var msg = "查看更多" + $(this).html() + "签证";
            $(".ui-proLists-more a").html(msg).attr("trackspot",msg);

            if (listData[proid]) {
                $(".ui-proLists-content").empty().html(listData[proid]);
                Visa.lazyLoad();
            } else {
                var https = window.host;
                var _url = https + Visa.orderEle.proUrl + $(this).attr("data-id");
                $.ajax({
                    url: _url,
                    dataType: "jsonp",
                    success: function(data) {
                        if (data.state === 100) {
                            var json_data = JSON.parse(data.data);
                            var _data = {
                                id: proid,
                                indexName : __indexN,
                                list: json_data
                            };

                            Visa.render({
                                "tpl": prolistTmpl,
                                "data": _data,
                                "context": ".ui-proLists-content",
                                "overwrite": true,
                                "callback": function() {
                                    Visa.lazyLoad();
                                    Visa.saveHotData();
                                }
                            });

                        } else if (data.state === 200) {
                            $(".proLists-tab-panel").html("暂时没有数据了！");
                        }

                    },
                    error: function() {
                        $(".proLists-tab-panel").html("暂时没有数据了！");
                    }
                });
            }
        });
    },
    // 保存热门数据
    saveHotData: function() {
        var key = $(".J_proLists-country .cur").attr("data-id"),
            value = $(".proLists-tab-panel").html() || "";
        if (value)
            listData[key] = value;
    },
    //信息上下滚动20150205-yl
    visaScroll: function() {
        var speed = 40;
        var visaNew = document.getElementById("J_visaNew-list"),
            visahide = document.getElementById("visaNew-hide"),
            visashow = document.getElementById("visaNew-show");
        visashow.innerHTML = visahide.innerHTML;

        function Marquee() {
            if (visashow.offsetTop - visaNew.scrollTop <= 1480)
                visaNew.scrollTop -= visahide.offsetHeight;
            else {
                visaNew.scrollTop++;
            }
        };
        var MyMar = setInterval(Marquee, speed);
        visaNew.onmouseover = function() {
            clearInterval(MyMar);
        };
        visaNew.onmouseout = function() {
            MyMar = setInterval(Marquee, speed);
        };
    },
    searchVisa: function() {
        var ajaxUrl;

        function searchAjaxHelper(arg) {
            $.ajax({
                url: arg,
                dataType: 'jsonp',
                success: function(data) {
                    if ($.trim(data) !== "") {
                        window.location.href = data;
                    } else {
                        $(".pop_main").html("暂无该国家签证，请重新输入");
                        $(".popBox").addClass("popBox_show");
                        setTimeout(function() {
                            $(".popBox").removeClass("popBox_show");
                        }, 3000)
                    }
                }
            });
        }
        var getVisaTypeId = function() {
            var cityVisaId = parseInt($('#visaType').data('sttrid'), 10);
            if (!isNaN(cityVisaId)) {
                return cityVisaId;
            } else {
                cityVisaId = '';
                return cityVisaId;
            }
        };
        var countryName = $.trim($('#sCountry').val());
        if (countryName !== "请输入您需要签证的国家/地区" && countryName !== "") {
            ajaxUrl = $(".searchBtn").attr('data-search-ajax') +
                '&cityname=' + encodeURI(countryName) +
                '&citytype=' + encodeURI(getVisaTypeId()) +
                '&locality=0';

            searchAjaxHelper(ajaxUrl);
        } else {
            $('#sCountry').focus();
        }
    },
    getUser: function() {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    render: function(config) {
        var key = config.key,
            tpl = config.tpl[key] || config.tpl,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback;
        var html, cxt;
        html = tpl(data);
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    },
    //侧栏广告图走广告位
    sideadfn: function(callback) {
        var me = this;
        $.ajax({
            url: me.orderEle.adurl,
            type: "get",
            dataType: 'json',
            success: function(data) {
                if (data.Status == "Success") {
                    var smallAd = data.Data.Slide.SmallAd,
                        LargeAd = data.Data.Slide.LargeAd;
                    me.slider(smallAd, LargeAd);
                    callback && callback.call(me);
                }

            }
        });
    },
    // 获取url参数
    getUrlParam: function(key){
        var url = location.search;
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
            return theRequest;
        }
    },
    slider: function(smallAd, LargeAd) {
        var userid = Visa.getUser();
        var slider = new Slidertoolbar({
            header: {
                icon: '<a target="_blank" trackspot="签证首页^' + smallAd.Name + '^small" trace="slider_1" href="' + smallAd.Url.replace('http:','') + '"><img src="' + smallAd.ImageUrl.replace('http:','') + '"></a>',
                tooltips: '<a target="_blank" trackspot="签证首页^' + LargeAd.Name + '^big" trace="slider_2" href="' + LargeAd.Url.replace('http:','') + '"><img src="' + LargeAd.ImageUrl.replace('http:','') + '"></a>'
            },
            topMenu: [{
                icon: '<a trace="slider_6" trackspot="Orders" href="//member.ly.com/center"><div class="ico c-1"></div></a>',
                tooltips: '<a trace="slider_7" trackspot="Orders" href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                icon: '<div class="ico c-2 J_trace"  trackspot="ico c-2" trace="slider_4"></div>',
                tooltips: '<a href="javascript:void(0)" trackspot="Telephone" trace="slider_5"><span class="ico-title">4001-899-812<i></i></span></a>',
                arrow: false
            }, {  
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" trace="slider_3" trackspot="Online_Service" href="//livechat.ly.com/out/guest?p=2&c=3"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" trace="slider_4" trackspot="Online_Service" href="//livechat.ly.com/out/guest?p=2&c=3"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            pageName: "签证首页",
            toTop: true,
            skin:'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="//member.ly.com/center"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    }
}
module.exports = Visa;
