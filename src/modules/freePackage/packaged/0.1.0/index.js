/* global $ */
define("freePackage/packaged/0.1.0/index", 
["common/0.1.0/index", "dialog/0.2.0/dialog", "freePackage/packaged/0.1.0/hotelDetail", "freePackage/packaged/0.1.0/flightRule"],
 function(require) {
    var Common = require("common/0.1.0/index"),
        Cal = require("freePackage/calendar/0.1.1/index"),
        //由于Dialog被另外个组件占用...
        DIALOG = require("dialog/0.2.0/dialog");
    var maxNum, fKey;
    var $dialog = new DIALOG({
        skin: 'default',
        template: {
            modal: {
                html: '<div class="dialog_modal_gp">' +
                    '<div class="dialog_modal_content" data-dialog-content></div>' +
                    '</div>'
            }
        }
    });
    var modifyIndex, selectHotelKey, hotelPrice;
    var Packaged = function() {};
    Packaged.prototype = {
        param: {
            "LineId": 0,
            "Adult": 1,
            "Child": 0,
            "DepartCity": "SHA",
            "ArriveCity": "TYO",
            "DepartDate": "2016-04-05",
            "ReturnDate": "2016-04-10",
            "IsDirect": 0,
            "FlightNoList": ["NH0968", "NH0967"],
            "GoKey": "",
            "Type": 1,
            "PageIndex": 1,
            "PageSize": 10,
            "PeriodFiltrate": 0,
            "DepartPortFiltrate": "",
            "ArrivePortFiltrate": "",
            "AirCompanyFiltrate": "",
            "FlightTypeFiltrate": 0,
            "Sort": 2,
            "SortType": 0,
            "Hotels": [{
                "CityId": 3187,
                "HotelId": 0,
                "RoomId": 0,
                "StartDate": "2016-04-02",
                "EndDate": "2016-04-03",
                "Nights": 1,
                "IsDirect": 1
            }]
        },
        thisParam: {
            "HotelId": "",
            "IsDirect": "",
            "StartDate": "",
            "Nights": ""
            },
        tmpl: {
            hotelDetail: require("./hotelDetail.dot"),
            flightRule: require("./flightRule.dot")
        },
        content: {
            hotelDetail: ".ui-hotel",
            insuranceList: ".J_insuranceBox"
        },
        isFirstSearch: true, //是否第一次查询
        datas: [], //分次查询数据集合
        //酒店列表
        //hotel: "hotelId,liveIndex,roomLevel|hotelId,liveIndex,roomLevel"
        getData: function(cfg) {
            var self = this,
                url = cfg.url,
                noresultHtml = cfg.noresultHtml,
                loadDiv = cfg.loadDiv,
                param = cfg.param;
            //var _param = $.extend({}, self.param, param);
            $.ajax({
                //url: self.host + url,
                url: url,
                //data: _param,
                dataType: "json",
                beforeSend: function() {
                    $(loadDiv).html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
                },
                success: function(data) {
                    var hotel, str;
                    var hotelArr = [];
                    if (data) {
                        data = (cfg.deal && cfg.deal.call(self, data));
                        if (cfg.render) {
                            cfg.render.call(self, data);
                        }
                    } else {
                        if (noresultHtml) {
                            $(loadDiv).html(noresultHtml);
                        }
                    }
                },
                error: function() {}
            });
        },
        setCarousel: function() {
            seajs.use("jCarousel/0.1.1/index", function(Carousel) {
                $(function() {
                    var index = 0;
                    $(".pro_msli_pop li").eq(index).addClass("active");
                    $(".pro_msli_pop li").on("click", function() {
                        $("#focusPic").attr("src", $(this).find("img").attr("src"));
                        $(this).addClass("active").siblings().removeClass("active");
                        index = $(this).index();
                    });
                    var car = Carousel(".pro_msli_pop", {
                        canvas: ".pro_msli_bd ul",
                        item: "li",
                        circular: false,
                        visible: 4,
                        preload: 0,
                        btnNav: false,
                        btnPrev: ".group_left",
                        btnNext: ".group_right"
                    });
                    $(".group_left").on("click", function() {
                        car.index + 2 < index && (index -= 1);
                        $(".pro_msli_pop li").eq(index).addClass("active").siblings().removeClass("active");
                        $("#focusPic").attr("src", $(".pro_msli_pop li").eq(index).find("img").attr("src"));
                    });
                    $(".group_right").on("click", function() {
                        car.index > index && (index = car.index);
                        $(".carousel2 li").eq(index).addClass("active").siblings().removeClass("active");
                        $("#pro_msli_pop").attr("src", $(".pro_msli_pop li").eq(index).find("img").attr("src"));
                    });
                });
            });
        },
        bindEvent: function() {
            var self = this;
            $(document).delegate(".J_hotelList .J_hotel_toggle", "click", function() {
                var _this = $(this);
                if (_this.hasClass("fold")) {
                    _this.parents(".hotel-info").children(".ht-detail").animate({
                        height: "40px"
                    });
                    _this.removeClass("fold");
                } else {
                    var height = _this.parents(".hotel-info").children().children(".ht-detail-all").height();
                    _this.parents(".hotel-info").children(".ht-detail").animate({
                        height: height + "px"
                    });
                    $(this).addClass("fold");
                }
            });

            //查看酒店
            $(document).on("click", ".hotel-title", function(e) {
                var _this = $(this),
                    hotelId, IsDirect, thisParam = {},
                    startDate, Nights;
                hotelId = _this.attr("data-hotelid");
                IsDirect = _this.attr("data-isdirect");
                startDate = _this.attr("data-stdate");
                Nights = _this.attr("data-nights");
                self.thisParam.HotelId = hotelId;
                self.thisParam.IsDirect = IsDirect;
                self.thisParam.StartDate = startDate;
                self.thisParam.Nights = Nights;
                var thisHeight = $(this).offset().top - 350;
                var content = '<div class="ui-hotel">' +
                    '<div class="data-loading"><div class="bg"><span>努力加载中，请稍等...</span></div></div>'+
                    '</div>';
                var config = {
                    content: content,
                    width: 1200,
                    height: 500,
                    title: '',
                    lock: true,
                    mask: true,
                    onShow:function() {
                        testfun();
                    }
                };
                var testfun=function(){
                    var cctParam = $("#cctParam").val();
                    if(cctParam){
                        self.thisParam.Platment = 8;
                    }
                    self.onshow(self.thisParam);
                };
                $dialog.modal(config);
                window.dialog = $dialog;
                $(".ui_dialog_gp").css('top', thisHeight);
            });

            $(document).on("click", ".ui-title-hotel span", function(e) {
                var el = $(this),index = 0;
                if(!el.hasClass('tab_active')){
                    index = el.index();
                    $(".ui-title-hotel span").removeClass('tab_active').removeClass('tab_activeb');
                    if(index>0){
                        $(".ui-title-hotel span").eq(index-1).addClass('tab_activeb');
                    }
                    el.addClass('tab_active');
                    $(".ui-hotel-row").addClass('none');
                    $(".ui-hotel-row").eq(index).removeClass('none');
                }
            });
            //点击弹窗关闭按钮回到立即预订位置
            $("body").delegate(".pop-close", "click", function(e) {
                var scrollTop = $("#btn_order").offset().top;
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: scrollTop - 22
                }, 15);
            });
        },
        renderList: function(data, type) {
            var self = this,
                context = $(self.content[type]),
                tmpl = self.tmpl,
                html = tmpl[type](data);
            context.empty().append(html);
        },
        onshow: function(thisParam) {
            var self = this;
            var url = "/intervacation/api/PDynamicPackageHotel/GetHotelDetail?param=" + encodeURIComponent(JSON.stringify(thisParam));
            self.getData({
                loadDiv: ".ui-hotel",
                url: url,
                deal: function(data) {
                    return data;
                },
                render: function(data) {
                    self.renderList(data, "hotelDetail");
                    if(data.Code == 4000){
                        if(data.Data.RoomPictures.length){
                            var width = data.Data.RoomPictures.length * 320;
                            $(".ui-roomlists").css("width",width);
                        }
                    }
                    self.setHotelDetailToggle();
                }
            });
        },
        setHotelDetailToggle: function() {
            var len = $(".ui-hotelInfo .inner").find("li").length;
            var $width = 1070;
            var $prev = $(".ui-hotelInfo .prev"),
                $next = $(".ui-hotelInfo .next"),
                preTimes = 0,
                nextTimes = 0;
            $(".ui-hotelInfo .inner").css({'width': len * $width + 'px'});
            $prev.on("click",function(){
                if($(this).find("i").hasClass("active")){
                    $(".ui-hotelInfo .next").find("i").addClass("active");
                    if($(".ui-hotelInfo .inner").attr("data-index") > 0){
                        $(".ui-hotelInfo .inner").attr("data-index", parseInt($(".inner").attr("data-index")) - 1);
                        --preTimes;
                        ++nextTimes;
                        $(".ui-hotelInfo .inner").stop(true,false).animate({left: nextTimes * $width+ 'px'});
                        if($(".ui-hotelInfo .inner").attr("data-index") == 0){
                            $(".ui-hotelInfo .prev").find("i").removeClass("active");
                        }
                    }else{
                        $(".ui-hotelInfo .prev").removeClass("active");
                    }
                }
            });
            $next.on("click",function(){
                if($(this).find("i").hasClass("active")){
                    $(".ui-hotelInfo .prev").find("i").addClass("active");
                    var len = $(".ui-hotelInfo .inner").find("li").length - 1;
                    if($(".ui-hotelInfo .inner").attr("data-index") < len){
                        $(".ui-hotelInfo .inner").attr("data-index",parseInt($(".inner").attr("data-index")) + 1);
                        ++preTimes;
                        --nextTimes;
                        $(".ui-hotelInfo .inner").stop(true,false).animate({'left': -$width * preTimes + 'px'});
                        if($(".ui-hotelInfo .inner").attr("data-index") == len){
                            $(".ui-hotelInfo .next").find("i").removeClass("active");
                        }
                    }else{
                        $(".ui-hotelInfo .next").find("i").removeClass("active");
                    }
                }
            });
            // $(".ui-hotel .carousel img").on("mouseover", function() {
            //     $(".ui-hotel .J_mainPic").attr("src", $(this).attr("data-img"));
            // });
            // $(".ui-hotel .J_carouselWrap").on("mouseenter", function() {
            //     $(this).find(".ui-hotel .left").addClass("active");
            // }).on("mouseleave", function() {
            //     $(this).find(".ui-hotel .left").removeClass("active");
            // });
        },
        setHotelToggle: function() {
            $(".ht-detail-all").each(function() {
                if ($(this).height() > 40) {
                    $(this).parent().next().show();
                } else {
                    $(this).parent().next().hide();
                }
            });
        },
        //hover提示
        hoverTips: function() {
            var self = this;
            var _dialog = $dialog.tooltip({
                width: 350,
                zIndex: 1111,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.explain-fly', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            var _dialog = $dialog.tooltip({
                width: 75,
                zIndex: 1111,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_breakfast', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 250,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_promotation', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 435,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_gift', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 250,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_transitsSign', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            var _dialog = $dialog.tooltip({
                width: 350,
                zIndex: 100,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.time em', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            var __dialog = $dialog.tooltip({
                width: 360,
                zIndex: 100,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_noBility', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
            });
            $('#content').on("mouseenter", ".explain-fly", function() {
                var _this = $(this);
                        var tmpl = self.tmpl,data = {};
                        data.Data = {};
                        if(_this.attr("data-goConsign")){
                            data.goConsign = _this.attr("data-goConsign");
                        }
                        if(_this.attr("data-coConsign")){
                            data.coConsign = _this.attr("data-coConsign");
                        }
                        data.Data.goRefundRule = _this.attr("data-goRefundRule") || "";
                        data.Data.goChangeRule = _this.attr("data-goChangeRule") || "";
                        data.Data.goBookNotice = _this.attr("data-goBookNotice") || "";
                        var IsCo = _this.attr("data-co")
                        if(IsCo){
                            data.IsCo = IsCo;
                            data.Data.coRefundRule = _this.attr("data-coRefundRule") || "";
                            data.Data.coChangeRule = _this.attr("data-coChangeRule") || "";
                            data.Data.coBookNotice = _this.attr("data-coBookNotice") || "";
                            data.departcity = _this.attr("data-departcity") || "";
                            data.cocity = _this.attr("data-cocity") || "";
                            data.arrivecity = _this.attr("data-arrivecity") || "";
                        }
                        data.IsDirect = _this.attr("data-IsDirect");
                        var html = tmpl["flightRule"](data);
                        $(".dialog_tooltip_text").empty().html(html);
                        _this.attr('data-content', html);
                        //_dialog.refresh();
                        //_dialog.show(_dialog.o_triggerobj, 'bottom', true);
            });
            $dialog.tooltip({
                width: 350,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.cancel-hotel', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 350,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.fitPeople', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 500,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_name_detail', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'right' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 300,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.J_addition_detail', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'right' //显示位置支持top,left,bottom,right
            });
            $dialog.tooltip({
                width: 500,
                zIndex: 1000000,
                content: function(obj) {
                    var text = $(obj).attr('data-content');
                    return text;
                }, //内容,支持html,function
                delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
                triggerEle: '.product-others', //触发元素选择器
                triggerType: 'hover', //hover|click
                triggerAlign: 'right' //显示位置支持top,left,bottom,right
            });
            
        },
        calculateTotalPrice: function(el) {
            var _this = $(el),
                jq_totalPrice = $(".J_totalPrice"),
                totalPrice = jq_totalPrice.children("strong").html(),
                diffPrice = _this.prev().children("em").attr("diff-price"), //差价
                diffType = _this.prev().children("em").attr("diff-type"); //正 负

            if (diffType == "add") { //正数差价
                totalPrice = parseInt(totalPrice) + parseInt(diffPrice);
            } else if (diffType == "sub") { //负数差价
                totalPrice = parseInt(totalPrice) - parseInt(diffPrice);
            }

            jq_totalPrice.html("<b>¥</b><strong>" + totalPrice + "</strong>");
        },
        //酒店级别hover效果
        hoverHotelLevel: function() {
            $(document).on('mouseover', ".J_Starlevel", function() {
                var con = '<div class="assess assess-tip">行业网站评定为：<span style="color:#f60">' + $(this).data('info') + '</span><b><i></i></b></div>';
                var levelTop = $(this).offset().top;
                var nameTop = $(this).siblings('.hotelName').offset().top || 0;
                var nameHeight = $(this).siblings('.hotelName').height() || 0;
                if (levelTop > (nameTop + 16)) {
                    con = '<div class="assess_right assess-tip">行业网站评定为：<span style="color:#f60">' + $(this).data('info') + '</span></div>';
                    $(this).after(con);
                } else {
                    $(this).append(con);
                    $(this).find('.assess').css('left', ($(this).siblings('.hotelName').width() - ($(this).find('.assess').width() - $(this).width()) / 2) + 'px');
                }
            });

            $(document).on('mouseout', '.J_Starlevel', function() {
                $('.assess-tip').remove();
            });

        },
        init: function(cfg) {
            var self = this;
            self.bindEvent();
            self.hoverHotelLevel();
            self.hoverTips();
        }
    };
    return Packaged;
});
