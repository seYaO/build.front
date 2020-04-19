/**
 * Created by lc07631 on 2016/8/18.
 */

require("/modules/scrollspy/0.2.0/index");
require("/modules/jCarousel/0.2.0/index");
require("common/0.1.0/index");
require("unslider/2.0.0/index");
var dialog = require("/modules/dialog/0.2.0/dialog"),
    Share = require("/modules/share/0.1.0/index"),
    Common = require("/modules/common/0.1.0/index"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    Comments = require("/modules/commentNew/0.2.1/index"),
    Tpl = require("./airportPickUp.dot"),
    TplUseCar = require("./airportSlider.dot"),
    TplPic = require("./ajaxSlider.dot");
var Details = {
    destName: $("#destName").val(),
    destId: $("#destID").val(),
    param: {
        lineId: $("#resourceId").val()
    },
    onePage: $("#onePage").val(),
    twoPage: $("#twoPage").val(),
    threePage: $("#threePage").val(),
    orderMin: 1,
    orderMax: 9999,
    init: function () {
        Details.scrollspyBind();
        Details.detailSlider();
        Details.rateStar();
        Details.booking();
        Details.detailSide();
        Details.mouse_Hover();
        Details.upBlock();
        Details.slider();
        Details.banner();
        Details.QRcode();
        Details.TabSwitch();
        Details.comment();
        Details.hideButton();
        Details.transfer();
        Details.airEvents();
        if (Details.destId != "0" && Details.destName != "0") {
            Details.weatherList();
        } else {
            $(".weather span").html("优选产品");
        }
        if (/userid=\d+/.exec($.cookie("us"))) {
            Details.getMultiData(function (data) {
                if (data) {
                    Details.setCollect("search", $(".J_Store"), data);
                }
            });
            $("body").delegate(".J_Store", "click", function () {
                Details.setCollect("add", $(".J_Store"));
            });
        } else {
            Details.initCollect();
        }
        Details.initShare();
        google.maps.event.addDomListener(window, 'load', Details.googleMap);
    },
    //滚动监听组件
    scrollspyBind: function () {
        //加载
        var topH = 50;
        if ($(".ly_cont").hasClass("J_tx_cont")) {
            topH = 60;
        }
        $("#detail_tab .tab_list").scrollspy({
            pClass: "#detail_tab",
            contentClass: ".J_NavBox",
            curClass: "current",
            topH: topH,
            renderNav: function (sid, stxt, index) {
                var renderStr = "";
                if (index === 0) {
                    renderStr = "<li><a class='on' href='#" + sid + "'>" + stxt + "</a></li>";
                } else {
                    renderStr = "<li><a href='#" + sid + "'>" + stxt + "</a></li>";
                }
                //插入占位div
                if ($("#scrollSpyPlaceholder").length < 1) {
                    var sphold = document.createElement("div");
                    sphold.id = "scrollSpyPlaceholder";
                    sphold.style.height = "37px";
                    sphold.style.display = "none";
                    var targethold = "detail_tab";

                    var targetId = document.getElementById(targethold);
                    targetId.parentNode.insertBefore(sphold, targetId);
                }
                return renderStr;
            }
        });
    },
    //幻灯
    detailSlider: function () {
        var imgEle = $("#mSlider .slider_bd img"),
            sliderUl = $("#silderUl"),
            thumb_link = sliderUl.find("a.thumb_link");

        function silderSrc(elem) {
            var databsrc = elem.attr("data-bsrc") || "";
            var datalt = elem.attr("data-alt") || "";
            imgEle.attr("src", databsrc).attr("alt", datalt);
            silderSize(imgEle);
        }

        function silderSize(elem) {
            if (elem.width() / elem.height() > 520 / 292) {
                elem.css("width:auto;height:292px");
            } else {
                elem.css("width:520px;height:auto");
            }
        }

        function silderChange(i) {
            sliderUl.find("li a").removeClass("current");
            var $curLi = {},
                i = i - 1;
            $curLi = $(sliderUl.find("li")[i]);
            $curLi.find("a").addClass("current");
            silderSrc($curLi.find("a"));
            if (i > 2) {
                var left = -150 * (i - 2);
                sliderUl.css("left", left);
            } else {
                sliderUl.css("left", 0);
            }
        }

        //开始加载打印幻灯图片
        thumb_link.each(function (n, elem) {
            if (n < sliderUl.find("li").length) {
                $(elem).html("<img alt='" + elem.getAttribute("data-alt") + "' src='" + elem.getAttribute("data-src") + "'/><span class='maskBox'></span>");
            }
        });
        //默认第一个加选中边框
        $(thumb_link[0]).addClass("current");
        silderSrc(thumb_link);
        silderSize(imgEle);

        //hover小图改变大图src;
        thumb_link.on("mouseover", function () {
            thumb_link.removeClass("current");
            $(this).addClass("current");
            silderSrc($(this));
        });

        $(".slider_pre").on("click", function () {
            var index = parseInt(sliderUl.find(".current").attr("data-index")),
                length = sliderUl.find("li").length;
            if (index === 1) {
                index = length;
            } else {
                index = index - 1;
            }
            silderChange(index);
        });
        $(".slider_next").on("click", function () {
            var index = parseInt(sliderUl.find(".current").attr("data-index")),
                length = sliderUl.find("li").length;
            if (index === length) {
                index = 1;
            } else {
                index = index + 1;
            }
            silderChange(index);
        });

    },
    //评分
    rateStar: function () {
        //评分初始
        (function () {
            function pre(node) {
                var pre = node.previousSibling;
                if (pre !== null && pre.nodeType === 3) { //防止内联元素在ie下出现的空白节点和火狐下的空白节点
                    return pre.previousSibling;
                }
                return pre;
            }

            function preAll(node) {
                var preNode = pre(node),
                    nodeArray = [];
                while (preNode != null) {
                    nodeArray.push(preNode);
                    preNode = pre(preNode);
                }
                return nodeArray;
            }

            $(".rate_star").each(function () {
                var score = Math.floor($(this).attr("data-score"));
                var elemLi = $(this).find("li").eq(score - 1)[0];
                $(elemLi).addClass("current");
                var preAllelem = preAll(elemLi);
                for (var i = 0; i < preAllelem.length; i++) {
                    $(preAllelem[i]).addClass("current");
                }
            })
        })();
    },
    //预定
    booking: function () {
        $(".ly_book .book_li .txt").on("click", function (e) {
            var oTar = $(this).parents(".book_li_tt").parent();
            if (oTar.hasClass("current")) {
                oTar.removeClass("current");
            } else {
                oTar.addClass("current");
            }
        })
    },
    //侧边栏绑定
    detailSide: function () {
        $("#J_hot_pro").delegate(".list-box", "mouseover", function () {
            var self = $(this);
            $(".hot_pic").css("display", "none");
            $(".hot_title").css("display", "none");
            $(".hot_maintitle").css("display", "block");
            self.find(".hot_pic").css("display", "block");
            self.find(".hot_title").css("display", "block");
            self.find(".hot_maintitle").css("display", "none");
        })
    },
    upBlock: function () {
        //var totalLen = $(".hotproduct .lists-box .list-box").length;
        if (Details.twoPage > 0) {
            var oneLen = $(".hotproduct .lists-box .list1").length;
            var twoLen = $(".hotproduct .lists-box .list2").length;
            $(".hotproduct .lists-box .list1").eq(oneLen - 1).css("border-bottom", "none");
            $(".hotproduct .lists-box .list2").eq(twoLen - 1).css("border-bottom", "none");
        }
        if (Details.threePage > 0) {
            var oneLen = $(".hotproduct .lists-box .list1").length;
            var twoLen = $(".hotproduct .lists-box .list2").length;
            var threeLen = $(".hotproduct .lists-box .list3").length;
            $(".hotproduct .lists-box .list1").eq(oneLen - 1).css("border-bottom", "none");
            $(".hotproduct .lists-box .list2").eq(twoLen - 1).css("border-bottom", "none");
            $(".hotproduct .lists-box .list3").eq(threeLen - 1).css("border-bottom", "none");
        }
        if (Details.onePage > 0) {
            var oneLen = $(".hotproduct .lists-box .list1").length;
            $(".hotproduct .lists-box .list1").eq(oneLen - 1).css("border-bottom", "none");
        }
        $("#J_hot_pro .update").on("click", function () {
            var data_click = parseInt($("#J_hot_pro .update").attr("data-click")) + 1;
            var hotPage = 0;
            if (Details.threePage > 0) {
                hotPage = parseInt(data_click % 3) + 1;
            } else if (Details.twoPage > 0) {
                hotPage = parseInt(data_click % 2) + 1;
            } else {
                hotPage = 1;
            }
            Details.hotListBlock(hotPage);
            $("#J_hot_pro .update").attr("data-click", data_click);
        });

        $(".J_invite i").on("click", function () {
            var self = $(this),
                parents = self.parent();
            if (parents.hasClass("showAll")) {
                parents.removeClass("showAll");
                self.html("更多");
            } else {
                parents.addClass("showAll");
                self.html("收起");
            }
        });
    },
    hotListBlock: function (hotPage) {
        $("#J_hot_pro .list-box").css("display", "none");
        $("#J_hot_pro .list" + hotPage).css("display", "block");
        $("#J_hot_pro .list" + hotPage + " .hot_pic").css("display", "none");
        $("#J_hot_pro .list" + hotPage + " .hot_title").css("display", "none");
        $("#J_hot_pro .list" + hotPage + " .hot_maintitle").css("display", "block");
        $("#J_hot_pro .list" + hotPage + " .hot_pic").eq(0).css("display", "block");
        $("#J_hot_pro .list" + hotPage + " .hot_title").eq(0).css("display", "block");
        $("#J_hot_pro .list" + hotPage + " .hot_maintitle").eq(0).css("display", "none");
    },
    googleMap: function () {
        if (!$(".trans_guide").length) {
            return false;
        }
        var locationD = [];
        $(".trans_location p").each(function (i, elem) {
            var location = $(elem).attr("data-location");
            locationD.push(JSON.parse(location));
        });
        var mapProp = {
            center: new google.maps.LatLng(locationD[0].weidu, locationD[0].jingdu),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("trans_map"), mapProp);

        var arrMarkSigns = [],
            arrShowInfos = [],
            markSign,
            showInfo,
            mapTitles,
            mapTitle;

        for (var i = 0; i < locationD.length; i++) {
            mapTitles = $(".trans_location span");
            mapTitle = $(mapTitles[i]);
            markSign = new google.maps.Marker({
                position: new google.maps.LatLng(locationD[i].weidu, locationD[i].jingdu),
                icon: "//img1.40017.cn/cn/v/wanle/2015/details/default-map-" + (i + 1) + ".png"
            });
            markSign.setMap(map);
            var clickHandler = (function (i) {
                return function () {
                    arrShowInfos[i].open(map, arrMarkSigns[i]);
                    arrShowInfos.forEach(function (n, index) {
                        if (index !== i) {
                            n.close();
                        }
                    });
                    getMarkSign(i, mapTitles);
                };
            })(i);

            var showInfoContent = "<div> <h3>" + locationD[i].title + "</h3> <p>" + locationD[i].desc + "</p> </div>";
            showInfo = new google.maps.InfoWindow({
                content: showInfoContent
            });
            arrMarkSigns.push(markSign);
            arrShowInfos.push(showInfo);
            markSign.addListener('click', clickHandler);
            mapTitle.on("click", clickHandler);
            if (i == 0) {
                $(mapTitles[0]).on("click", clickHandler());
            }
            arrShowInfos[i].addListener('closeclick', function () {
                getMarkSign(i, mapTitles);

            })
        };
        function getMarkSign(i, mapTitles) {
            arrMarkSigns.forEach(function (n, index) {
                if (index !== i) {
                    n.setIcon("//img1.40017.cn/cn/v/wanle/2015/details/default-map-" + (index + 1) + ".png");
                } else {
                    n.setIcon("//img1.40017.cn/cn/v/wanle/2015/details/click-map-" + (index + 1) + ".png");
                }
            });

            //mapTitles.siblings("em").removeClass("current");
            //$(mapTitles[i]).siblings("em").addClass("current");
            mapTitles.parent().removeClass("current");
            $(mapTitles[i]).parent().addClass("current");

            $(".trans_intro li").each(function () {
                var key = $(this).attr("data-key");
                if (key == i) {
                    $(this).siblings().addClass("none");
                    $(this).removeClass("none");
                }
            })
        }

    },
    //hover
    mouse_Hover: function () {
        var o_dialog = new dialog({
            skin: "default"
        });
        o_dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                if ($(obj).hasClass('J_online')) {
                    $(".ui_dialog_gp").css({
                        //"width": "auto",
                        "width": ($(obj).find("span")[0].offsetWidth+18)+"px",
                        "max-width":"570px"
                    });
                } else if ($(obj).hasClass('J_little_tip')) {
                    $(".ui_dialog_gp").css({
                        "width": "108px"
                    });
                }
                return text;
            }, //内容,支持html,function
            delay: 500,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件
            },
            triggerEle: '.J_Tips',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
        });
    },
    //侧边栏导航
    getUser: function () {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    slider: function () {
        var userid = Details.getUser();
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
                icon: '<a href="//member.ly.com/Member/MyFavorites.aspx" class="J_trace"  trace="slider_10"><div class="ico c-3"></div></a>',
                tooltips: '<a href="//member.ly.com/Member/MyFavorites.aspx" trace="slider_11"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2030&lineid='+$("#resourceId").val()+'"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=6&pageid=2030&lineid='+$("#resourceId").val()+'"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            bottomMenu: [{
                icon: '<a class="Qr_icon"><div class="ico c-7"></div></a>',
                tooltips: '<a class="Qrcode"><span class="ico-title"><img src="//img1.40017.cn/cn/v/wanle/2015/details/ewm.png"><i></i></span></a>',
                arrow: false
            }],
            toTop: true,
            pageName: "海玩详情页",
            skin: "skin2"
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a trace="slider_6" href="//member.ly.com"><div class="ico c-1-1"></div></a>',
                tooltips: '<a trace="slider_7" href="//member.ly.com"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    },
    QRcode: function () {
        var _this = $("#module-slider .c-7");
        _this[0].onmouseover = function () {
            _this.parents(".content").find(".tooltip_gp ").css({ "background": "none" });
        }
    },
    banner: function () {
        $("#mSlider_top .ly_topSlider").slider({
            aniType: "fade",
            showNav: "circle",
            circle: true,
            moveTime: 2500,
            arrows: true,
            fadeTime: 500,
            navAlign: "right"
        })
        if ($("#bannerUl li").length <= 1) {
            $(".mSlider_nav_circle").addClass("none");
        }
    },
    weatherList:function(){
        var AjaxUrl ="//www.ly.com/wanle/AjaxHelperWanLe/WeatherByCity?cityName="+Details.destName+"&cityId="+Details.destId;
        $.ajax({
            url: AjaxUrl,
            dataType: "jsonp",
            success: function (data) {
                if (data.WeatherList.length > 0) {
                    for (var i = 0; i < data.WeatherList.length; i++) {
                        var day = data.WeatherList[i].Days,
                            temp = data.WeatherList[i].Temperature;
                        var dayTime;
                        switch (day) {
                            case "1":
                                dayTime = "今天";
                                break;
                            case "2":
                                dayTime = "明天";
                                break;
                            case "3":
                            case "4":
                            case "5":
                                dayTime = Details.dayTime(day);
                                break;
                            default:
                                break;
                        }
                        var liHtml = "<li>" + dayTime + " : " + temp + "</li>";
                        $(".weatherList").append(liHtml);
                    }
                    $(".info_Top .J_weather").hover(function () {
                        var _self = this;
                        if ($(_self).hasClass("current")) {
                            $(_self).removeClass("current");
                            $(".weatherList").addClass("none");
                        } else {
                            $(_self).addClass("current");
                            $(".weatherList").removeClass("none");
                        }
                    })
                } else {
                    $(".info_Top .j_weather").removeClass("J_weather");
                    $(".weather span").html("优选产品");
                }
            }
        });
    },
    dayTime: function (day) {
        var today = (+new Date());
        var otherTime = (day - 1) * 24 * 60 * 60 * 1000 + today;
        var otherDay = new Date(otherTime);
        var days = (otherDay.getMonth() + 1) + "月" + (otherDay.getDate()) + "日";
        return days;
    },
    /**
     * @desc 初始化分享功能
     */
    initShare: function () {
        var share = new Share({
            trigger: ".J_Share",
            summary: $(".ly_info h1").attr("title"),
            pic: $(".slider_bd img").attr("src")
        });
    },

    /**
     * @desc 获取联合数据
     * @param callback
     */
    getMultiData: function (callback) {
        var self = this,
            url = "/dujia/MemberFavoritesHandler.ashx?isWanle=1&type=hasfavite&lineId=" + Details.param.lineId;
        self._getData(url, callback, true);
    },
    _getData: function (url, callback, isFangZhua) {
        $.ajax({
            url: url,
            dataType: 'json',
            isFangZhua: isFangZhua,
            errorType: "getDataAjax",
            success: function (data) {
                callback.call(this, data);
            }
        });
    },
    /**
     * @desc 初始化收藏的事件
     */
    initCollect: function () {
        var self = this;
        $("body").delegate(".J_Store", "click", function () {
            self.checkLogin(function () {
                self.setCollect("add", $(".J_Store"));
            });
        });
    },
    /**
     * @desc 发送收藏到指定的接口
     */
    setCollect: function (type, el, searchData) {
        var lineId = this.param.lineId,
            isAdd = type === "add",
            method = isAdd ? "addnew" : "searchnew";
        if (isAdd) {
            var url = "/dujia/MemberFavoritesHandler.ashx?isWanle=1&type=" + method + "&productId=" + lineId;
            //var url = "//m.ly.com/localfun/AjaxHelperWanLe/AddFavourites?&productId=" + lineId;
            Common.ajax({
                url: url,
                dataType: "json",
                errorType: "setCollectAjax",
                success: function (data) {
                    if (data.ResultFlag) {
                        var msg = "已收藏",
                            cls = "icons-solid-star";
                        //el.html('<i class="'+cls+'"></i>'+msg+'&nbsp;<b class="num">'+(searchData.ResultCount-0+1)+'</b>');
                        el.html('<i class="' + cls + '"></i>' + msg + '&nbsp;');//暂时去掉收藏的数据
                    } else {
                        if (data.ResultMsg.indexOf("失败") >= 0) {
                            alert("收藏失败，请稍后收藏~");
                        } else {
                            var msg = "已收藏",
                                cls = "icons-solid-star";
                            //el.html('<i class="'+cls+'"></i>'+msg+'&nbsp;<b class="num">'+(searchData.ResultCount-0+1)+'</b>');
                            el.html('<i class="' + cls + '"></i>' + msg + '&nbsp;');//暂时去掉收藏的数据
                            alert(data.ResultMsg);
                        }
                    }
                }
            });
        } else {
            var msg, cls;
            if (searchData.ResultMsg === "未收藏") {
                msg = "收藏";
                cls = "icons-store";
            } else {
                msg = "已收藏";
                cls = "icons-solid-star";
            }
            //el.html('<i class="'+cls+'"></i>'+msg+'&nbsp;<b class="num">'+searchData.ResultCount+'</b>');
            el.html('<i class="' + cls + '"></i>' + msg + '&nbsp;');
        }
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    checkLogin: function (callback) {
        if (!(/userid=\d+/.exec($.cookie("us")))) {
            Details.initLogin(callback);
            return;
        }
        callback && callback.call(this);
        return true;
    },
    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function (callback) {
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function () {
                window.topNavLogined(); // 更新顶部会员信息
                callback.call(self);
            },
            unReload: true
        });
    },
    //玩乐预定Tab切换
    TabSwitch: function () {
        var recommendBox = $(".recommend"),
            bookLi = recommendBox.find(".book_li"),
            book_tt = recommendBox.find(".book_tt");
        if (bookLi.length != 0) {
            book_tt.removeClass("none");
            $(".ly_order_tab").find("li[data-id='1']").removeClass("none");
        } else {
            book_tt.addClass("none");
            $(".ly_order_tab").find("li[data-id='1']").addClass("none");
        }
        $("#ly_order .ly_order_tab li").on("click", function () {
            var self = $(this),
                curId = self.data("id"),
                curContent = $("#booking").find('.book_module_' + curId + '');
            if (!self.hasClass("current")) {
                self.addClass("current").siblings().removeClass("current");
                curContent.removeClass("none").siblings().addClass("none");
            }
        })
    },
    comment: function () {
        var comment = new Comments();
        comment.init({
            el: ".J_left_con",
            host: "//www.ly.com",
            param: {
                lineId: $("#resourceId").val(),
                isSingle: 1
            },
            parent: "#comment-moudle",
            callback: function () {
                $(".no-remark").remove();
            }
        });
    },
    hideButton: function () {
        $(window).on("scroll", function () {
            var route = document.body.scrollTop + document.documentElement.scrollTop;
            if ($("#detail_tab").offset().top <= route) {
                $(".J_orderBtn").removeClass("none");
            } else {
                $(".J_orderBtn").addClass("none");
            }
        });
    },

    //接送机相关交互
    transfer: function () {
        var cal = new $.Calendar({
            open: true,
            id: "abc",
            skin: "white",
            wrapperWidth: 310,
            zIndex: 22,
            monthNum: 1
        });

        function formatDate(date) {
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                newFormatDate;
            if (month < 10) {
                newFormatDate = year + '-0' + month;
            } else {
                newFormatDate = year + '-' + month;
            }
            if (day < 10) {
                newFormatDate = newFormatDate + '-0' + day;
            } else {
                newFormatDate = newFormatDate + '-' + day;
            }
            return newFormatDate;

        }

        $(document).on("click", ".J_time", function () {
            $(".order_info").removeClass("show_wrap");
            $(this).addClass("selected");
            Details.getAirportInfo({}, function (dataList) {
                cal.pick({
                    elem: $(".J_time"), // 如果设置了elem的值，且elem参数为input框
                    startDate: $(".J_time").attr("data-startDate"),
                    mode: "rangeFrom",
                    endDate: $(".J_time").attr("data-endData"),
                    currentDate: [$(".J_time").attr("data-startDate")],
                    fn: function (y, d, r) {
                        $(".J_time").removeClass("selected");
                        Details.getAirportInfo({
                            PickupDate: y + "-" + d + "-" + r
                        }, "", true);
                    },
                    buildContent: function (td, date, datestr, data) {
                        var day = date.getDate();
                        var str = dateStr || day;
                        str = '<span class="d">' + str + '</span>';
                        var dateFormatStr = formatDate(date);
                        var _class = "invalid-day";
                        var data = dataList[dateFormatStr];
                        if (data) {
                            _class = "price";
                            str = '<span class="d" style="line-height: 16px;">' + day + '<br></span>';
                        }
                        td.innerHTML = str;
                        $(td).addClass(_class);

                    }

                });
            });

        });

        $(document).on("blur", ".J_time", function () {
            $(this).removeClass("selected");
        });

        $(document).on("click", ".J_add", function () {
            var self = $(this),
                _sibling = self.siblings("input"),
                _value = parseInt(_sibling.val());
            if (self.hasClass("add_btn")) {
                _sibling.val(_value + 1);
                if (_value === Details.orderMax - 1) {
                    self.removeClass("add_btn");
                }
                Details.currentNum = _value + 1;
                $(".J_sub").addClass("sub_btn");
                $(".order_info").removeClass("show_wrap");
                Details.isOrder = false;
            }
        });

        $(document).on("click", ".J_sub", function () {
            var self = $(this),
                _sibling = self.siblings("input"),
                _value = parseInt(_sibling.val());
            if (self.hasClass("sub_btn")) {
                _sibling.val(_value - 1);
                if (_value === Details.orderMin + 1) {
                    self.removeClass("sub_btn");
                }
                Details.currentNum = _value - 1;
                Details.isOrder = false;
                $(".J_add").addClass("add_btn");
                $(".order_info").removeClass("show_wrap");
            }
        });

        $(document).on("blur", ".bus_num input", function () {
            _value = parseInt($(this).val());
            if (_value >= Details.orderMax) {
                $(".J_add").removeClass("add_btn");
                $(".J_sub").addClass("sub_btn");
                $(this).val(Details.orderMax);
                _value = Details.orderMax;
            }
            if (_value <= Details.orderMin) {
                $(".J_sub").removeClass("sub_btn");
                $(".J_add").addClass("add_btn");
                $(this).val(Details.orderMin);
                _value = Details.orderMin;
            }

            if (_value > Details.orderMin && _value < Details.orderMax) {
                $(".J_add").addClass("add_btn");
                $(".J_sub").addClass("sub_btn");
            }

            Details.currentNum = _value;
        });

        $(document).on("focus", ".bus_num input", function () {
            Details.isOrder = false;
            $(".order_info").removeClass("show_wrap");
        });

        $(document).on("click", ".J_airOrder,.J_orderJump", function () {
            var self = $(".J_airOrder");
            if ($(".show_wrap") && $(".show_wrap").length) {
                return;
            }
            Details.verifyFull();
            if (Details.isOrder) {
                return;
            };
            if (!self.hasClass("notClick")) {
                var basicUrl = self.attr("data-href"),
                    otherParam = {
                        "CurrentDate": $(".J_time").val(),
                        "currentNumber": $(".bus_count input").val()
                    };
                window.location.href = basicUrl + "&" + $.param(otherParam);
            }
        });

        $(document).on("mouseover", ".order_info span", function () {
            if ($(this).hasClass("notClick")) {
                $(this).find("i").removeClass("none");
            }
        });

        $(document).on("mouseout", ".order_info span", function () {
            if ($(this).hasClass("notClick")) {
                $(this).find("i").addClass("none");
            }
        });

        $(document).on("click", ".J_error", function () {
            Details.isOrder = false;
            $(this).parent().removeClass("show_wrap");
        });

        Details.carSlider();

        Details.airConfig = {
            // data: JSON.parse($("#airInfo").val()),
            term: [],
            tmpl: []
        }
        if($("#ProductType").val() === "8" && $("#ProductCategory").val() === "86" && $("#airInfo").val()){
             Details.airConfig.data = JSON.parse($("#airInfo").val());
        }
        if ($("#PickupType").val() && $("#PickupType").val().length) {
            Details.airConfig.tmpl.push({
                id: 'PickupType',
                name: 'PickupType',
                data: JSON.parse($("#PickupType").val())
            })
        }
        if ($("#PickupArea").val() && $("#PickupArea").val().length) {
            Details.airConfig.tmpl.push({
                id: 'PickupArea',
                name: 'PickupArea',
                data: JSON.parse($("#PickupArea").val())
            })
        }
        if ($("#PickupCarType").val() && $("#PickupCarType").val().length) {
            Details.airConfig.tmpl.push({
                id: 'PickupCarType',
                name: 'PickupCarType',
                data: JSON.parse($("#PickupCarType").val())
            })
        }

    },

    verifyFull: function (flag) {
        $(".order_info").find("li").each(function (i, e) {
            if (!Details.isOrder && !$(e).hasClass("total") && $(e).find("span").length && (!$(e).find(".selected").length)) {
                if (!flag) {
                    var text = $(e).find(".lie_left").html();
                    $(".order_info").addClass("show_wrap");
                    $(".wrap-text").html("请选择" + text);
                }
                Details.isOrder = true;
                return;
            } else if (Details.isOrder) {
                return;
            }
        })
    },

    /***
         * param参数
         * callback 回调函数
         * flag是否重置初始化数据（选择了日历）
         * 
         */
    getAirportInfo: function (param, callback, flag) {
        $.ajax({
            url: "/wanle/api/WanleProduct/GetAirportPickup?ResourceId="+$("#resourceId").val(),
            // url: "//www.t.ly.com/wanle/api/WanleProduct/GetAirportPickup?ResourceId="+$("#resourceId").val(),
            data: param,
            dataType: "jsonp",
            success: function (data) {
                data = data.Data;
                $(".J_orderBtn").attr("href", "#mSlider").removeClass("J_orderJump");
                param.currentNum = Details.currentNum;
                param.PriceUnit = Details.PriceUnit;
                param.orderMin = Details.orderMin;
                data.param = param;
                if (callback) {
                    callback(data.CanAirportPickupDateEntity);
                    return;
                }
                if (flag) {
                    var dataInfo = data.AirportPickupEntityList;
                    var PickupTypeList = [], PickupAreaList = [], PickupCarTypeList = [];
                    for (var i = 0; i < dataInfo.length; i++) {
                        var elem = dataInfo[i];
                        if (elem.PickupType) {
                            distinct(PickupTypeList, elem.PickupType);
                        }
                        if (elem.PickupArea) {
                            distinct(PickupAreaList, elem.PickupArea);
                        }
                        if (elem.PickupCarType) {
                            distinct(PickupCarTypeList, elem.PickupCarType);
                        }
                    }
                    function distinct(arr, param) {
                        var insetFlag = true;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].id === param) {
                                insetFlag = false;
                                return;
                            }
                        }
                        insetFlag && arr.push({
                            id: param,
                            name: param
                        });
                    }
                    Details.airConfig.term = [];
                    Details.orderMin = dataInfo.PickupBookMin || 1;
                    Details.orderMax = dataInfo.PickupBookMax || 9999;
                    Details.currentNum = dataInfo.PickupBookMin || 1;

                    $("#airInfo").val(JSON.stringify(data.AirportPickupEntityList));
                    $("#canOrderTime").val(JSON.stringify(data.AirportPickupDateEntity));
                    $("#PickupType").val(JSON.stringify(PickupTypeList));
                    $("#PickupArea").val(JSON.stringify(PickupAreaList));
                    $("#PickupCarType").val(JSON.stringify(PickupCarTypeList));
                    Details.airConfig.data = dataInfo;
                    Details.airConfig.tmpl = [];
                    if (PickupTypeList && PickupTypeList.length) {
                        Details.airConfig.tmpl.push({
                            id: 'PickupType',
                            name: 'PickupType',
                            data: PickupTypeList
                        })
                    }
                    if (PickupAreaList && PickupAreaList.length) {
                        Details.airConfig.tmpl.push({
                            id: 'PickupArea',
                            name: 'PickupArea',
                            data: PickupAreaList
                        })
                    }
                    if (PickupCarTypeList && PickupCarTypeList.length) {
                        Details.airConfig.tmpl.push({
                            id: 'PickupCarType',
                            name: 'PickupCarType',
                            data: PickupCarTypeList
                        })
                    }
                    Details.airRend(true);

                } else {
                    var priceInfo = data.AirportPickupPriceEntity;
                    if (!priceInfo) {
                        return;
                    }
                    Details.orderMin = priceInfo.PickupBookMin;
                    Details.orderMax = priceInfo.PickupBookMax;
                    Details.PriceUnit = priceInfo.PickupPriceUnit;
                    $(".info_price").html("<b>¥</b><em>" + priceInfo.PickupPrice + "</em>/" + priceInfo.PickupPriceUnit);
                    $(".bus_count").find("p").html(priceInfo.PickupPriceUnit);
                    var busElem = $(".bus_count").find("input");
                    if (busElem.val() <= priceInfo.PickupBookMin) {
                        busElem.val(priceInfo.PickupBookMin);
                        $(".J_sub").removeClass("sub_btn");
                    }
                    if (busElem.val() >= priceInfo.PickupBookMax) {
                        busElem.val(priceInfo.PickupBookMax);
                        $(".J_add").removeClass("add_btn");
                    }
                    if (busElem.val() > priceInfo.PickupBookMin && (busElem.val() < priceInfo.PickupBookMax)) {
                        $(".J_sub").addClass("sub_btn");
                        $(".J_add").addClass("add_btn");
                    }
                    var basicUrl = $(".J_airOrder").attr("data-href"),
                        otherParam = {
                            "CurrentPriceId": priceInfo.PickupPriceId,
                            "productId": priceInfo.PickupProductId
                        };
                    $(".J_airOrder").attr("data-href", basicUrl + $.param(otherParam));

                    Details.isOrder = false;
                }



            }
        });
    },
    carSlider: function () {
        var defaultSliderEle = $(".carousel").unslider({
            autoplay: true,
            keys: true,  			  // 支持键盘
            nav: true,				  // unslider-nav
            animation: "horizontal",  // vertical  fade
            arrows: {				  // arrows 定制
                //  Unslider default behaviour
                prev: '<button class="left none"></button>',
                next: '<button class="right none"></button>'
            }
        });
        $(".bus_slider").hover(function () {
            if ($(".carousel ul li").length > 1) {
                $(".left").removeClass("none");
                $(".right").removeClass("none");
            }
        }, function () {
            if ($(".carousel ul li").length > 1) {
                $(".left").addClass("none");
                $(".right").addClass("none");
            }

        });
    },

    calctmpl: function () {
        var self = this,
            config = self.airConfig;
        var datalist = config.data;
        var termlist = config.term;
        var tmpllist = config.tmpl;

        var _datalist = [];
        // 暴露给变量
        self._datalist = _datalist;

        // var _datahacklist = [];

        /* 赋予或清空每个条件的规则 */
        for (var i = 0; i < termlist.length; i++) {
            termlist[i].data = [];
        }

        /* 循环规则，将规则填入到条件规则 和 额外点击规则 */
        for (var i = 0; i < datalist.length; i++) {
            // 获取满足条件的规则
            var _dataflag = true;
            for (var j = 0; j < termlist.length; j++) {
                if ((datalist[i][termlist[j].id] + '') !== termlist[j].value) {
                    _dataflag = false;
                }
            }
            if (_dataflag) {
                _datalist.push(datalist[i]);
            }

            // 符合额外可点击的规则
            for (var j = 0; j < termlist.length; j++) {
                var termlistdata = termlist[j].data;
                // 
                var newTermlist = $.extend(true, [], termlist);
                newTermlist.splice(j, 1);
                // 
                var _datahackliflag = true;
                for (var k = 0; k < newTermlist.length; k++) {
                    if ((datalist[i][newTermlist[k].id] + '') !== newTermlist[k].value) {
                        _datahackliflag = false;
                    }
                }
                // 只要一个存在规则就可选
                if (_datahackliflag) {
                    termlistdata.push(datalist[i]);
                }
            }
        }

        /* 循环渲染先添加选中状态和不可选择状态 */
        for (var i = 0; i < tmpllist.length; i++) {
            var _tmpldata = tmpllist[i].data;
            var _tmplactive = false;
            for (var j = 0; j < termlist.length; j++) {
                if (tmpllist[i].id == termlist[j].id) {
                    _tmplactive = termlist[j].value;
                }
            }
            for (var j = 0; j < _tmpldata.length; j++) {
                if ((_tmpldata[j].id + '') == _tmplactive) {
                    _tmpldata[j].isactive = true;
                } else {
                    _tmpldata[j].isactive = false;
                }

                var _tmpldisabled = true;

                for (var k = 0; k < _datalist.length; k++) {
                    if (_tmpldata[j].id == _datalist[k][tmpllist[i].id]) {
                        _tmpldisabled = false;
                    }
                }
                _tmpldata[j].isdisabled = _tmpldisabled;

            }
            // 点击失效重新计算
            // if (termlist.length && _datahacklist.length && tmpllist[i].id == termlist[termlist.length - 1].id) {
            //     for (var j = 0; j < _tmpldata.length; j++) {
            //         var _tmpldisabled = true;
            //         for (var k = 0; k < _datahacklist.length; k++) {
            //             if (_tmpldata[j].id == _datahacklist[k][tmpllist[i].id]) {
            //                 _tmpldisabled = false;
            //             }
            //         }
            //         _tmpldata[j].isdisabled = _tmpldisabled;
            //     }
            // }

            // 循环额外点击规则 将额外点击的匹配状态更改
            if (termlist.length) {
                for (var m = 0; m < termlist.length; m++) {
                    // 当筛选条件为渲染模版的条目时
                    if (tmpllist[i].id == termlist[m].id) {
                        var _newdatahacklist = termlist[m].data;
                        // 
                        for (var j = 0; j < _tmpldata.length; j++) {
                            var _tmpldisabled = true;
                            for (var k = 0; k < _newdatahacklist.length; k++) {
                                if (_tmpldata[j].id == _newdatahacklist[k][tmpllist[i].id]) {
                                    _tmpldisabled = false;
                                }
                            }
                            if (_tmpldisabled == false) {
                                _tmpldata[j].isdisabled = _tmpldisabled;
                            }
                        }
                    }
                }
            }
            // 


        }


    },

    calcterm: function (info, isdel) {
        var self = this,
            config = self.airConfig;
        var flag = false;
        for (var i = 0; i < config.term.length; i++) {
            if (info.id == config.term[i].id) {
                flag = i;
            }
        }
        if (flag !== false) {
            config.term.splice(flag, 1);
        }
        if (!isdel) {
            config.term.push(info);
        }

    },
    airEvents: function () {
        var self = this,
            config = self.airConfig;
        $('.order_info').on('click', 'span', function () {
            var Jself = $(this);
            var dtid = Jself.parents("li").find('.lie_left').attr("data-type");
            var ddid = Jself.attr('data-id');
            var obj = {
                id: dtid,
                value: ddid
            }
            Details.isOrder = false;
            $(".order_info").removeClass("show_wrap");
            if (Jself.hasClass('notClick')) {
                return;
            }

            if (Jself.hasClass('selected')) {
                self.calcterm(obj, true)
            } else {
                self.calcterm(obj)
            }
            self.calctmpl();
            self.airRend();


        });
    },

    airRend: function (flag) {
        $(".J_orderBtn").attr("href", "#mSlider").removeClass("J_orderJump");
        var param = {
            currentNum: Details.currentNum || 1,
            PriceUnit: Details.PriceUnit,
            orderMin: Details.orderMin,
            PickupDate: $(".J_time").val(),
            flag: flag || false
        };
        this.airConfig.param = param;
        Details.render({
            tpl: Tpl,
            key: "airportPickUp",
            data: this.airConfig,
            overwrite: true,
            context: $(".order_info"),
            callback: function () {
            }

        });
        // Details.PriceUnit = data && data.AirportPickupPriceEntity ? data.AirportPickupPriceEntity.PickupPriceUnit : "";


        Details.verifyFull(true);
        if (!Details.isOrder && !flag) {
            $(".J_orderBtn").attr("href", "#mSlider").addClass("J_orderJump");
            var sliderInfo = this._datalist;
            if (sliderInfo && sliderInfo.length) {
                sliderData = sliderInfo[0];
                sliderData.services = $(".jies_info").find(".server_label").html();
                Details.render({
                    tpl: TplUseCar,
                    key: "airportSlider",
                    data: sliderData,
                    overwrite: true,
                    context: $(".bus_explain"),
                    callback: function () {
                        Details.carSlider();
                        $(".J_orderBtn").attr("href", "javascript:;").addClass("J_orderJump");
                    }
                });

                Details.render({
                    tpl: TplPic,
                    key: "ajaxSlider",
                    data: sliderData,
                    overwrite: true,
                    context: $("#mSlider"),
                    callback: function () {
                        Details.detailSlider();
                    }
                });
            }

            Details.getAirportInfo({
                "PickupDate": $(".J_time").val(),
                "PickupType": $(".J_shuttle_type").find(".selected").attr("data-id"),
                "PickupArea": $(".J_region").find(".selected").attr("data-id") || "",
                "PickupCarType": $(".J_choice").find(".selected").attr("data-id") || ""
            });

        }
        Details.isOrder = false;
    },


    /**
     * 渲染逻辑同touch
     * @param config
     */
    render: function (config) {
        var tpl = config.tpl,
            key = config.key,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback,
            _html = tpl(data),
            cxt;
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(_html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    }
};


window.onload = function () {
    _tcTraObj._tcTrackEvent("search", "/lineWanle/detail", "/show", "|*|resId:" + $("#resourceId").val() + "|*|");
};
module.exports = Details;

