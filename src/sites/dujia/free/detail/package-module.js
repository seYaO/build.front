define("group", ["calendar/0.2.0/index","tmpl/pc/details2016/hotel",
    "common/0.1.0/index","dialog/0.2.0/dialog","jCarousel/0.1.1/index","tmpl/pc/details2016/consignInfo",
    "packaged/0.1.0/index","tmpl/pc/details2016/pop","datepicker/0.2.0/calendar-group"], function(require,exports,module){
    var Group = function(){};
    var cal = require('calendar/0.2.0/index'),
        Common = require('common/0.1.0/index'),
        dialog = require("dialog/0.2.0/dialog"),
        Consign = require("tmpl/pc/details2016/consignInfo"),
        Packaged = require("packaged/0.1.0/index"),
        GroupCalendar = require("datepicker/0.2.0/calendar-group");
    require("jCarousel/0.1.1/index");
    var $dialog2 = new dialog({
        skin: 'default',
        template: {
            tooltip: {
                width: '430px'
            }
        }
    });
    Group.prototype = {
        init: function(cfg){
        	var self = this;
        	self._init(cfg);
        },
        _init: function (cfg) {
        	this.calendarInit();
        	this.popoverEvent();
        	this.numCountEvent();
            this.cuttleEvent();
            this.setHotelInfo();
            this.flightCheckEvent();
            this.resourceInfoEvent();
            this.resourceCountEvent();
            this.priceCountEvent();
            this.initTest();
        },
        calendarInit:function () {
        	//初始化日历
            var cal = new $.Calendar({
                skin:"white",
                width:1000
            });
            var smallcal = -70;
            if ($(".content").hasClass("Small_conter")) {
                smallcal = -25;
            }

            $(document).on("focus","#J_startTime",function() {
                cal.pick({
                    elem: this,
                    startDate:$("#J_startTime").attr("attr-timeb"),
                    mode: "rangeFrom",
                    offset: {
                        left: smallcal
                    },
                    currentDate: [$("#J_startTime").attr("attr-timeb")],

                });
            });
        },
        popoverEvent:function () {
       		var priceTips = $(".J_price-tips"),
       			popover = $('.ui-popover-contain');
       		priceTips.hover(function(){
       			if(popover.hide()){
       				popover.show();
       			}
       		},function(){
       			if(popover.show()){
       				popover.hide();
       			}
       		})
        },
        numCountEvent:function () {
        	var leftBtn = $('.J_picker-leftBtn'),
        		rightBtn = $('.J_picker-rightBtn');

        	leftBtn.on('click',function () {
        		var self = this,
                    coustInput = $(self).siblings('.J_picker-input');
        		var value = parseInt($(coustInput).val()),
                    max = parseInt($(coustInput).attr('max'));
                var sumVal ;
                var adultVal = $(coustInput).hasClass('J_picker-adult') ? $('.J_picker-child').val() : $('.J_picker-adult').val();
                var state = coustInput.hasClass('J_picker-adult') ? 'child' : 'adult';
                if(!$(self).hasClass('peopleNum-disPicker-leftBtn')){
                    if(value>0){
                        if(state != 'adult' && value == 2){
                            value--;
                            $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                        }else{
                            value--;
                            if(value < (max - adultVal)){
                                $(rightBtn).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                            }
                            if($(self).siblings('.J_picker-rightBtn').hasClass('peopleNum-disPicker-rightBtn')){
                                $(self).siblings('.J_picker-rightBtn').removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                            }
                        }
                    }
                    if(value<1) {
                        $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                    }
                    sumVal = parseInt(value) +(state == 'child' ? parseInt($('.J_picker-child').val()) : parseInt($('.J_picker-adult').val()));
                    if(sumVal < max){
                        rightBtn.map(function (key,item) {
                            if($(item).hasClass('peopleNum-disPicker-rightBtn')){
                                $(item).removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                            }
                        });
                    }
                    $(coustInput).val(value);
                    $('.J_safeNum').text(sumVal);
                    $('.J_safeNum').parents('.J_resourceBox').attr('data-count',sumVal);
                    Group.prototype.priceCountEvent();
                }
        	});

            rightBtn.on('click',function () {
                var self = this,
                    coustInput = $(self).siblings('.J_picker-input');
                var value = $(coustInput).val(),
                    max = parseInt($(coustInput).attr('max'));
                var adultVal = $(coustInput).hasClass('J_picker-adult') ? $('.J_picker-child').val() : $('.J_picker-adult').val();
                var sumVal ;
                var state = coustInput.hasClass('J_picker-adult') ? 'child' : 'adult';
                if(!$(self).hasClass('peopleNum-disPicker-rightBtn')) {
                    if (max >= 40) {
                        if (value < 20) {
                            value++;
                            $(self).siblings('.J_picker-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn')
                        } else {
                            $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                        }
                    } else {
                        if (value < (max - adultVal)) {
                            value++;
                            if (value == (max - adultVal)) {
                                $(rightBtn).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                            }
                            $(self).siblings('.J_picker-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn')
                        } else {
                            $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn');
                        }
                    }
                    sumVal = parseInt(value) + (state == 'child' ? parseInt($('.J_picker-child').val()) : parseInt($('.J_picker-adult').val()));
                    if (sumVal < max) {
                        leftBtn.map(function (key, item) {
                            if ($(item).hasClass('peopleNum-disPicker-leftBtn')) {
                                $(item).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                            }
                        });
                    }
                    $(coustInput).val(value);
                    $('.J_safeNum').text(sumVal);
                    $('.J_safeNum').parents('.J_resourceBox').attr('data-count', sumVal);
                    Group.prototype.priceCountEvent();
                }
            })

        },
        resourceCountEvent: function () {
            var _rLeftBtn = $('.J_resource-leftBtn'),
                _rRightBtn = $('.J_resource-rightBtn');

            _rLeftBtn.on('click',function () {
                var self = this,
                    coustInput = $(self).siblings('.J_picker-input');
                var value = parseInt($(coustInput).val());
                var date,price,index;
                index = $(self).parent().index();
                if(value>0){
                    value--;
                    if($(self).siblings('.J_resource-rightBtn').hasClass('peopleNum-disPicker-rightBtn')){
                        $(self).siblings('.J_resource-rightBtn').removeClass('peopleNum-disPicker-rightBtn').addClass('peopleNum-picker-rightBtn');
                    }
                }
                if(value<1) {
                    $(self).removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-disPicker-leftBtn');
                }
                $(coustInput).val(value);
                $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-count',value);
                date = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-time');
                price = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-count');
                if(date && price){
                    if(date !== '' && price !== '' && price !== '0'){
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                    }else {
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                    }
                    Group.prototype.priceCountEvent();
                }
            });

            _rRightBtn.on('click',function () {
                var self = this,
                    coustInput = $(self).siblings('.J_picker-input');
                var value = parseInt($(coustInput).val());
                var date,price,max,index;
                index = $(self).parent().index();
                if(!$(self).hasClass('peopleNum-disPicker-rightBtn')){
                    if(coustInput.attr('max') !== undefined){
                        max = parseInt(coustInput.attr('max'));
                        value++;
                        if(max>=20){
                            if(value>=20){
                                $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn')
                            }
                        }else {
                            if(value>=max){
                                $(self).removeClass('peopleNum-picker-rightBtn').addClass('peopleNum-disPicker-rightBtn')
                            }
                        }
                    }else {
                        value++;
                    }
                    $(self).siblings('.J_resource-leftBtn').removeClass('peopleNum-disPicker-leftBtn').addClass('peopleNum-picker-leftBtn')
                    $(coustInput).val(value);
                    $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-count',value);
                    date = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-time');
                    price = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-count');
                    if($(self).parents('.th_col_05').prev().find('.J_resource-data-picker').val() == ''){
                        $($(self).parents('.th_col_05').prev().find('.ui-dropDown')[index]).show();
                    }
                    if(date && price){
                        if(date !== '' && price !== '' && price !== '0'){
                            Group.prototype.priceCountEvent();
                            $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                        }else {
                            $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                        }
                    }
                }
            })
        },
        cuttleEvent:function () {
            $(document).on('click','.J_moreHotel', function () {
                var self =  this;
                if($(self).parents('.hotel-cuttle').hasClass('ui-hotel-hide')){
                    $(self).parents('.hotel-cuttle').removeClass('ui-hotel-hide').addClass('ui-hotel-show');
                    $(self).parents('.hotel-contains').find('.traffic-hotel').removeClass('none');
                    $(self).html('收起');
                }else {
                    $(self).parents('.hotel-cuttle').removeClass('ui-hotel-show').addClass('ui-hotel-hide');
                    $(self).parents('.hotel-contains').find('.traffic-hotel').addClass('none');
                    $($(self).parents('.hotel-contains').find('.traffic-hotel')[0]).removeClass('none');
                    $(self).html('展开更多酒店');
                }
            });
            $('.J_child-tips').hover(function () {
                var self = this;
                $(self).parent().find('.pop-childTips').show();
            }, function () {
                var self = this;
                $(self).parent().find('.pop-childTips').hide();
            });
            $('.J_flight-delay').hover(function () {
                var self = this;
                var popFlight = $(self).next('.pop-flightTips');
                if(popFlight){
                    popFlight.show();
                }
            }, function () {
                var self = this;
                var popFlight = $(self).next('.pop-flightTips');
                if(popFlight){
                    popFlight.hide();
                }
            })
        },
        setCarousel: function() {
            seajs.use("jCarousel/0.1.1/index", function(Carousel) {
                $(function() {
                    var index = 0;
                    $(".pro_msli_pop li").eq(index).addClass("active");
                    $(".pro_msli_pop li").on("click", function() {
                        var clickImg = $(this).find("img").attr("hover-img");
                        $("#focusPic").attr("src", Common.setImageSize(clickImg, "640x360"));
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
                        var clickImg = $(".pro_msli_pop li").eq(index).find("img").attr("hover-img");
                        $("#focusPic").attr("src", Common.setImageSize(clickImg, "640x360"));
                    });
                    $(".group_right").on("click", function() {
                        car.index > index && (index = car.index);
                        $(".carousel2 li").eq(index).addClass("active").siblings().removeClass("active");
                        $("#pro_msli_pop").attr("src", $(".pro_msli_pop li").eq(index).find("img").attr("src"));
                    });
                })
            })
        },
        setHotelInfo: function (data) {
            var data = {"status":"100","message":"查询成功！","hotelInfo":[{"HotelName":"长滩高尔夫度假村—Fairways and Bluewater Resort","HotelStar":"四钻","HotelAddress":"Beachfront, Newcoast, 布拉伯滩, 长滩岛, 菲律宾 1605","Service":[{"ServeName":"220V电压插座","ServeMark":"220V"},{"ServeName":"禁烟客房","ServeMark":"room"}],"CheckDate":"1900-01-01T00:00:00+08:00","RoomType":"标准间","HotelDescribe":"酒店地址：Beachfront, Newcoast, 布拉伯滩, 长滩岛, 菲律宾 1605球道和蓝水度假村离市中心和离机场很近，这家现代化酒店比邻高尔夫乡村俱乐部, 贝克博物馆, 威利的摇滚等热门景点。酒店安排了会议设施, 酒吧, 洗衣服务, 保险箱, 接送服务，旨在为客人提供 的舒适度。酒店内的室外游泳池, 花园, 桑拿, 私人海滩, 水疗是忙碌的一天后放松身心的理想去处。 入住球道和蓝水度假村是来长滩岛旅游的明智选择之一,酒店气氛闲适，远离喧嚣，非常适合放松身心。","HotelImage":["//pic3.40017.cn/line/admin/2015/03/24/15/E6LQOK.jpg","//pic3.40017.cn/line/admin/2015/03/23/16/u9HbBI.jpg","//pic3.40017.cn/line/admin/2015/03/24/15/ZIgWnJ.jpg","//pic3.40017.cn/line/admin/2015/03/23/16/SSB7Pc.jpg","//pic3.40017.cn/line/admin/2015/03/24/15/dz4jmc.jpg","//pic3.40017.cn/line/admin/2015/03/23/16/d86ghJ.jpg"],"StayTime":0,"BreakfastDesc":"","HotelStarFigure":"4"},{"HotelName":"长滩岛天堂花园度假酒店 —Paradise Garden Resort Hotel","HotelStar":"三钻半","HotelAddress":"Manggayad, Boracay Island , 3号站, 长滩岛, 菲律宾","Service":[{"ServeName":"免费瓶装水","ServeMark":"water"},{"ServeName":"220V电压插座","ServeMark":"220V"},{"ServeName":"机场班车","ServeMark":"bus"},{"ServeName":"禁烟客房","ServeMark":"room"}],"CheckDate":"1900-01-01T00:00:00+08:00","RoomType":"标准间","HotelDescribe":"店地址：Manggayad, Boracay Island , 3号站, 长滩岛, 菲律宾长滩岛天堂花园度假村座落在长滩岛著名的白色沙滩和清澈的海水附近，占地10000平方米，是长滩岛上一处幽静的绿洲。长滩岛天堂花园度假村每个房间都设有阳台或露台，舒适且设备完善。三个不同风格的泳池，其中一座是专为小朋友设计的，配有救生员巡逻，小朋友可在安全的环境下玩乐。在屋顶花园的餐厅是 适合欣赏夕阳的地方，和度假村另一个餐厅一起提供欧陆式和中式佳肴，同时供应每日 鲜的海鲜料理。海滩上会提供附遮阳伞的座椅、日光浴的床位、免费的毛巾服务。长滩岛天堂花园度假村步行至沙滩约3分钟，拥有原始自然菲律宾风味，茂盛的热带植物使酒店绿意盎然充满大自然的气息","HotelImage":["//pic3.40017.cn/line/admin/2015/03/23/16/MQsadi.jpg","//pic3.40017.cn/line/admin/2015/03/24/15/AkF1Z4.jpg","//pic3.40017.cn/line/admin/2015/03/23/16/YFzOA1.jpg","//pic3.40017.cn/line/admin/2015/03/24/15/Wm7Bvt.jpg","//pic3.40017.cn/line/admin/2015/03/23/16/XF2uJV.jpg","//pic3.40017.cn/line/admin/2015/03/24/15/HBCGkf.jpg"],"StayTime":0,"BreakfastDesc":"","HotelStarFigure":"3.5"},{"HotelName":"AZALEA BORACAY哈莎蕾亚酒店","HotelStar":"","HotelAddress":"Main Road, Balabag, Malay, Aklan,长滩岛,5608,菲律宾","Service":[{"ServeName":"220V电压插座","ServeMark":"220V"},{"ServeName":"禁烟客房","ServeMark":"room"},{"ServeName":"游泳池","ServeMark":"pool"}],"CheckDate":"1900-01-01T00:00:00+08:00","RoomType":"标准间","HotelDescribe":"","HotelImage":["//pic3.40017.cn/line/admin/2015/03/23/15/OoBD9R.jpg"],"StayTime":0,"BreakfastDesc":"","HotelStarFigure":""}]};
            var tplHotelInfo = require("tmpl/pc/details2016/hotel"),
                self = this;
            Common.render({
                data: data,
                tpl: tplHotelInfo,
                context: "#hotelInfo",
                overwrite: true
            });
            $(".J_hotelTitle").click(function() {
                var content = $(this).parents(".traffic-hotel").next(".pop");
                Dialog.sysWindows({
                    "content": content,
                    "title": "酒店介绍",
                    "height":"auto"
                });
                self.setCarousel();
            });

        },
        //航司信息点击事件
        flightCheckEvent: function() {
            var self = ".J_flightCheck";
            $(document).on("click", self, function() {
                var Arrs = [];
                $(" .J_flightNum").each(function() {
                    var txt = $.trim($(this).html());
                    Arrs.push(txt);
                });
                var str = "[";
                $.each(Arrs, function(i, v) {
                    str += '"' + v + '"' + ",";
                });
                str += "]";
                Common.ajax({
                    type: "get",
                    url: "//www.ly.com/dujia/AjaxHelper/TourAjax.ashx?Type=GetFlightConsign&flightNoList=" + str,
                    dataType: "jsonp",
                    success: function(data) {
                        var config = {
                            title: '<div class="box-header"><p><span class="hangsi_top"></span><span class="label">航司托运信息</span>' +
                            '<em><s>*</s> (仅供参考，具体以航司官方信息为准)</em></p> </div>',
                            content: Consign(data),
                            width: '1190px',
                            height: $('.box-consign').height() + 100 + 'px'
                        };
                        $dialog2.modal(config);
                    }
                })
            });
        },
        //可选资源点击下拉
        resourceInfoEvent: function () {
            var resourceItem = '.J_resourceInfo',
                visaItem = '.J_visa-type li',
                dropInput = '.J_resource-data-picker',
                dropList = '.ui-dropDown',
                radio = '.J_resource-safeRadio',
                resourceMore = '.J_moreResource';
            $(document).on('click',resourceItem, function () {
                var self = this;
                var detailInfo = $(self).parents('.J_resourceBox').siblings('.resource-info');
                if(detailInfo.hasClass('none')){
                    $(self).parent().removeClass('ui-product-hide').addClass('ui-product-show');
                    detailInfo.removeClass('none');
                }else {
                    $(self).parent().removeClass('ui-product-show').addClass('ui-product-hide');
                    detailInfo.addClass('none');
                }
            });
            $(document).on('click',visaItem, function () {
                var self = this;
                if(!$(self).hasClass('visa-type-checked')){
                    $(self).parents('.J_visa-type').children().map(function (key,item) {
                        if($(item).hasClass('visa-type-checked')){
                            $(item).removeClass('visa-type-checked').addClass('visa-type-common');
                        }
                    });
                    $(self).removeClass('visa-type-common').addClass('visa-type-checked');
                    $(self).parents('.resource-visa-head').siblings('.visa-type-content').map(function (key,item) {
                        if(!$(item).hasClass('none')){
                            $(item).addClass('none');
                        }
                        if(key == $(self).index()){
                            $(item).removeClass('none');
                        }
                    });
                }
            });
            $(dropInput).mouseenter(function () {
                var self = this;
                var dropList = $(self).siblings('.ui-dropDown');
                if(dropList.hide()){
                    dropList.show();
                }
            });
            $(dropInput).mouseleave(function () {
                var self = this;
                var dropList = $(self).siblings('.ui-dropDown');
                if(dropList.show()){
                    dropList.hide();
                }
            });
            $(dropList).mouseenter(function () {
                $(this).show();
            });
            $(dropList).mouseleave(function () {
                $(this).hide();
            });
            $(dropList).on('click','li',function () {
                var self = this;
                var date,price,index;
                index = $(self).parents('.resource-data-td').index();
                $(self).parents('.ui-dropDown').siblings(dropInput).val($(self).text());
                $(self).parents('.ui-dropDown').hide();
                $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-time',$(self).text());
                date = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-time');
                price = $($(self).parents('.J_resourceBox').find('.th_col_02')[index]).attr('data-count');
                if(date && price){
                    if(date !== '' && price !== '' && price !== '0'){
                        Group.prototype.priceCountEvent();
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).addClass('resource-radio-checked');
                    }else {
                        $($(self).parents('.J_resourceBox').find('.J_resource-radio')[index]).removeClass('resource-radio-checked');
                    }
                }
            });
            $(resourceMore).on('click', function () {
                var self = this;
                var state = $(self).parent().hasClass('ui-resource-hide') ? 'show' : 'hide';
                var boxItems = $(self).parents('td').find('.resource-box');
                if(state == 'show'){
                    $(boxItems).map(function (key,item) {
                        if($(item).hasClass('none')){
                            $(item).removeClass('none');
                        }
                    });
                    $(self).parent().removeClass('ui-resource-hide').addClass('ui-resource-show');
                }else {
                    $(boxItems).map(function (key,item) {
                        if(!$(item).hasClass('none') && key != 0){
                            $(item).addClass('none');
                        }
                    });
                    $(self).parent().removeClass('ui-resource-show').addClass('ui-resource-hide');
                }
            });
            $(radio).on('click', function () {
                var self = this;
                var num = 0;
                if($(self).hasClass('resource-radio-normal')){
                    $(self).parents('td').find(radio).removeClass('resource-radio-checked').addClass('resource-radio-normal');
                    $(self).removeClass('resource-radio-normal').addClass('resource-radio-checked');
                    $(self).parents('td').find('.J_resourceBox').find('.th_col_02').attr('data-count','');
                    $(self).parents('td').find('.J_resourceBox').find('.th_col_02').attr('data-time','');
                    num = parseInt($(self).parents('.J_resourceBox').find('.J_resource-box-number').text());
                    $(self).parents('.J_resourceBox').find('.th_col_02').attr('data-count',num);
                    //TODO 使用接口时间
                    $(self).parents('.J_resourceBox').find('.th_col_02').attr('data-time','2016-01-01');
                    Group.prototype.priceCountEvent();
                }
            });
        },
        //价格计算
        priceCountEvent: function () {
            var data = {};
            var dataArr = [],dataObj = {},sumPrice = 0;
            $('.J_resource-box').map(function (index,item)  {
                $(item).find('.th_col_02').map(function (index,list) {
                    var dataTime = $(list).attr('data-time');
                    if(dataTime !== undefined && dataTime !== ''){
                        dataObj.name = $(list).find('.J_resource-box-name').text();
                        dataObj.price = parseInt($(list).attr('data-price'));
                        dataObj.count = parseInt($(list).attr('data-count')||9);
                        dataArr.push(dataObj);
                        dataObj = {};
                    }
                });
            });
            if($('.J_picker-adult')){
                dataObj.name = '成人';
                dataObj.price = parseInt($('.J_picker-adult').parent().next().attr('data-price'));
                dataObj.count = parseInt($('.J_picker-adult').val());
                dataArr.push(dataObj);
                dataObj = {};
            }
            if($('.J_picker-child')){
                dataObj.name = '儿童';
                dataObj.price = parseInt($('.J_picker-child').parent().next().attr('data-price'));
                dataObj.count = parseInt($('.J_picker-child').val());
                dataArr.push(dataObj);
                dataObj = {};
            }
            data = {
                lists:dataArr
            };
            var popPanel = require('tmpl/pc/details2016/pop');
            $('.J_popDetails').html(popPanel(data));
            dataArr = [];
            data.lists.map(function (item,index) {
                sumPrice += (item.count * item.price);
            });
            $('.J_total-price').text(sumPrice);
        },
        initTest: function () {
            $.ajax({
                url:"//www.ly.com/dujia/AjaxHelper/DynamicPackageAjax.ashx?Type=TOURCOMMON&id=322148",
                dataType: "jsonp",
                success: function (data) {
                    var _datepicker = new GroupCalendar({
                        wrapper: ".date-picker",
                        skin: "price",
                        monthCount: 2,
                        fillAcrossDate:false,
                        allowCancel:false,
                        slide:true,
                        formatData: function(item) { //{day,date,value,enable}
                            for (var i = 0; i < data.data.Calendar.length; i++) {
                                var v = data.data.Calendar[i],
                                    dateprice;
                                param_cal = encodeURIComponent(JSON.stringify(v));
                                if (v.IsLowest == 1) {
                                    arr.push(v.Date);
                                }
                                if ((new Date(v.Date)).format('yyyyMMdd') == (new Date(item.date)).format('yyyyMMdd')) {
                                    if (v.Price == 0) {
                                        dateprice = "实时计价";
                                    } else {
                                        dateprice =  '¥' +v.Price;
                                    }
                                    if (v.IsLowest == 1) {
                                        item.value = '<div param_cal=' + param_cal + ' class="cal-sbox IsLowest">' + '<i></i>' + item.day + '<div class="cal-price">' +  dateprice + '</div></div>';
                                    } else {
                                        item.value = '<div param_cal=' + param_cal + '  class="cal-sbox">' + item.day + '<div class="cal-price">' + dateprice + '</div></div>';
                                    }
                                    item.enable = true;
                                    break;
                                } else {
                                    item.enable = false;
                                }
                            };
                            return item;
                        },
                        getValues: function() {
                            return this.__values;
                        }
                    })
                }
            })
        }
    };
    module.exports = new Group();
});
