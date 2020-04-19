var $dialog = require ("dialog/0.2.0/dialog"),
    _vali = require ("validate/1.0.0/validate"),
    Popup = require ("popup/0.2.0/popup"),
    DatePicker = require ("datepicker/0.2.1/datepicker"),
    flightRule = require("./flightrule.dot"),
    touristInfo = require("./touristinfo.dot"),
    touristName = require("./touristname.dot"),
    Slidertoolbar = require("slidertoolbar/0.1.0/index"),
    roomDetail = require("../detail/roomdetail.dot");
    require("jCarousel/0.1.1/index");
var common = {},
    isPackage = parseInt($("#hidIsPackage").val(), 10);
var package = function() {};
var flag = true;
var citytimer = null;
var isoverTime = false;
var $dialog1 = new $dialog({ skin: 'J_fullMessage' });
package.prototype= {
    init :function(conf){
        var self = this;
        self.resizeWindowEvent();   //窗口resize事件
        $(window).resize(function(){
            self.resizeWindowEvent();
        });
        if(conf.IsErrorCct && conf.IsErrorCct == 1){
            var cctDialog = new $dialog({
                skin: 'default',
                template: {
                    modal: {
                        html: '<div class="dialog_modal_gp">' +
                            '<div class="dialog_modal_content" data-dialog-content></div>' +
                            '</div>'
                    }
                }
            });
            var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="isErrorCct"><p>错误的方式，请返回后台下单系统重新查询操作！</p></div></div></div>';
            var config = {
                content: content,
                width: 500,
                height: 180,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            cctDialog.modal(config);
            return;
        }
        if(conf.Error == 1 || conf.Error == "1"){
            $("#cjdd").prop("disabled","true");
            var cctDialog = new $dialog({
                skin: 'default',
                template: {
                    modal: {
                        html: '<div class="dialog_modal_gp">' +
                            '<div class="dialog_modal_content" data-dialog-content></div>' +
                            '</div>'
                    }
                }
            });
            var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="isErrorCct"><p>抱歉，该页面不支持此打开方式，请重新下单</p></div></div></div>';
            var config = {
                content: content,
                width: 500,
                height: 180,
                title: '',
                quickClose: false,
                zIndex: 100000
            };
            cctDialog.modal(config);
            return;
        } else{
            self.overTime();
            self.initEvent(conf);
            self.contactValidInfo();    //验证联系人信息
            self.tourInfo(conf);            //出游人数控制出游人信息的passenger-info
            if(conf.IsFromCct != 1 || !conf.IsFromCct){
                self.checkLogin();
            }
            self.resetEvent();          //出游人清空事件
            self.dialogEvent();         //弹窗事件
            //self.youhuiClickEvent();  // 优惠点击事件
            self.selectEvent();
            self.submitEvent(conf);         //提交按钮
            self.checkEvent();          //合同条款确认框
            self.hoverEvent();          //退改签hover
            self.dropDown();
            self.roomDetails(conf);
            self.initslider();  //右侧通栏
        }
    },
    initEvent: function(conf){
        var $J_passenger = $(".J_passenger"),
            passengerNum = {},self = this;
        passengerNum.num = parseInt(conf.Adult) + parseInt(conf.Child);
        passengerNum.Adult = parseInt(conf.Adult);
        passengerNum.Child = parseInt(conf.Child);
        passengerNum.ChildAges = conf.ChildAges;
        passengerNum.CertificateType = conf.CertificateType;
        $J_passenger.append(touristInfo(passengerNum));
        //回退
        $(document).on('click', ".routeBack", function() {
            self.goBack(conf);
        });
        //护照tab切换
        $(document).on('click', ".J_passSignStantart ul li", function() {
            var self = $(this);
            var oIndex = self.index();
            self.addClass("current").siblings().removeClass('current');
            $(".J_passSignStantart").find(".passImg").eq(oIndex).removeClass("none").siblings(".passImg").addClass('none');
        });
        $(document).on('click','.ui-radio-sex',function(){
            var self = $(this);
            if(!self.parents(".list").hasClass("checked")){
                self.parents(".list").addClass("checked");
                self.siblings(".dj-validate").removeClass('active');
            }
        });
    },
    //右侧通栏部分
    getUser: function () {
        var loginInfo = $.cookie("us"),
            userid;
        if (loginInfo) {
            userid = /userid=(\d+)/i.exec(loginInfo);
            userid = userid ? userid[1] : userid;
        }
        return userid;
    },
    initslider: function(){
        var self = this;
        var userid = self.getUser();
        var slider = new Slidertoolbar({
            header: {
                icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
                tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/11/01/10/UL8ID0.jpg"></a>'
            },
            topMenu: [{
                icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><div class="ico c-3"></div></a>',
                tooltips: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><span class="ico-title">我的收藏<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=7&lineid='+ self.lineId +'"><div class="ico c-5"></div></a>',
                tooltips: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=7&lineid='+ self.lineId +'"><span class="ico-title">在线客服<i></i></span></a>',
                arrow: false
            }],
            bottomMenu: [{
                icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, {
                ideaClass: "udc-link",
                icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                arrow: false
            }, {
                icon: '<a><div class="ico c-7"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
                tooltipCls: 'chujing-code',
                arrow: false
            }, {
                icon: '<a><div class="ico c-8"></div></a>',
                tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
                tooltipCls: 'app-code',
                arrow: false
            }],
            pageName: "机酒任选订单填写页",
            toTop: true,
            skin:'skin2'
        });
        if (userid) {
            slider.resetMenu({
                icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
                tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                arrow: false
            }, 'top', 0);
        }
    },
    /*适应屏幕*/
    resizeWindowEvent: function (){
        var self = this;
        var windowWth = $(window).width();
        if (windowWth < 1200 && windowWth > 0) {
            if (!$(".content").hasClass("smallC") && !$("#Head").hasClass("smallC")) {
                $(".content").addClass("smallC");
                $("#Head").addClass("smallC");
            }
        } else {
            if ($(".content").hasClass("smallC")){
                $(".content").removeClass("smallC");
                $("#Head").removeClass("smallC");
            }
        }
    },
    /**
     * @desc 初始化登录组件
     * @param callback
     */
    initLogin: function(callback){
        var self = this,
            Login = require("login/0.1.0/index");
        var login = new Login({
            loginSuccess: function(){
                callback.call(self);
            },
            unReload: true
        });
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    checkLogin: function(callback){
        var cnUser = $.cookie("us");
        if(!(/userid=\d+/.exec(cnUser))){
            this.initLogin(callback);
            return;
        }
        callback && callback.call(this);
        return true;
    },
    //定时30分钟
    overTime:function(){
        var self = this;
        citytimer = setTimeout(function() {
            isoverTime = true;
        },1000*60*30);
    },
    roomDetails:function(conf){
        var self = this;
        $(document).on('click', ".btn-closeCheckIn", function() {
            $(".boxH1").addClass('none');
        });
        $(".name-room").click(function(){
            var _this = $(this),html="";
            $(".boxH1").addClass('none');
            if(!_this.hasClass('haschlick')){
                _this.addClass('haschlick');
                if(_this.attr("data-isdirect")==0){
                    var _html1='<div class="boxH1"><div class="data-loading"><i class="btn-closeCheckIn"></i><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
                    _this.append(_html1);
                    var _url ={
                                "LineId": conf.LineId,
                                "HotelId": _this.attr("data-hotelid"),
                                "RoomId": _this.attr("data-roomid"),
                                "RateCode": _this.attr("data-ratecode"),
                                "SupplierId": _this.attr("data-supplierid"),
                                "StartDate": _this.attr("data-startdate"),
                                "Nights": _this.attr("data-nights"),
                                "Adult": conf.Adult,
                                "ChildAges": conf.ChildAges,
                                "RoomCount": _this.attr("data-roomcount")
                            };
                    if(conf.SearchType){
                        _url.SearchType = conf.SearchType;
                    }
                    var url = "/intervacation/api/PDynamicPackageHotel/GetHotelRateDetail?param=" + encodeURIComponent(JSON.stringify(_url));
                    $.ajax({
                        url: url,
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            html = roomDetail(data);
                            _this.find('.boxH1').html(html);
                            _this.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                            $(".carousel-spot").carousel({
                                visible: 1,
                                auto: false,
                                btnPrev: ".prev",
                                btnNext: ".next"
                            });
                        }
                    });
                }else{
                    var html1='<div class="boxH1">'
                                +'<div class="CheckIn-box CheckIn-sbox">'
                                +'<div class="CheckIn-box-title"> <span class="nohotel-title"></span> <i class="btn-closeCheckIn"></i> </div>'
                                +'<div class="content-checkIn clearfix">'
                                    +'<div class="noroom"><i></i><span>很抱歉，暂无该房型信息</span></div>'
                                +'</div></div></div>';
                    _this.append(html1);
                    _this.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                }
            }else{
                _this.find('.boxH1').removeClass('none');
            }
        });
    },
    /*出游人信息*/
    tourInfo: function (conf){
        var self = this;
        self.calRender(conf);  //出游人信息日历
        self.tourClickEvent(conf);
    },
    /*出游人信息点击事件*/
    tourClickEvent: function (conf){
        var self = this;
            $(".J_collapse_tour").find(".btn-fold").on("click",function(){
                var _self = $(this);
                if(!_self.hasClass("packUp")){
                    $(".J_passenger").removeClass("none");
                    $(".J_passenger").css({ "display": "block"});
                    _self.text("暂不填写");
                }else{
                    $(".J_passenger").css({ "display": "none"});
                    _self.text("展开填写出游人信息");
                }
                $(this).toggleClass("packUp");
            });
            //获取常用联系人信息
            self.getContactsInfo(conf,function () {
                self.createAddressBook(function () {

                    //常用联系人信息插入
                    $(".normal-tour input").on("click", function () {
                        var $self = $(this),
                            index = $self.parent().index(),
                            isChecked = this.checked,
                            //passengerType = $self.attr("data-type"),
                            map = $self.attr("map");
                        var $passenger = $(".passenger-info");
                        if (isChecked) {
                            $passenger.each(function () {
                                var $div = $(this),
                                    type = $div.attr("data-type"),
                                    isInsert = +$div.attr("data-isInsert");
                                if (!isInsert) {
                                    self.inserContacts($div, self._data[index]);
                                    $self.attr("map", $div[0].id);
                                    $self[0].checked = true;
                                    return false;
                                } else {
                                    $self[0].checked = false;
                                }
                            });
                        } else {
                            this.removeAttribute("map");
                            self.reset($("#" + map));
                        }
                        if (self.IsCanEdit === "1") {
                            $(".order-fn-btns").removeClass("none");
                        }
                    });
                });
            });
        var $Tour = $(".tour").find(".passenger-info-table");
        if($Tour.length > 0){
            $Tour.find("input[type=radio]").on("click",function(){
                if($(this).hasClass("radio-man")) {
                    $(this).parents(".passenger-info-table").siblings(".passenger-info-type").addClass("type-man")
                        .removeClass("type-woman");
                } else if($(this).hasClass("radio-woman")){
                    $(this).parents(".passenger-info-table").siblings(".passenger-info-type").addClass("type-woman")
                        .removeClass("type-man");
                }
            });
        }
    },
    /*退改签hover事件*/
    hoverEvent: function (){
        var self = this,
            $J_intro = $(".J_intro");
        $J_intro.mouseenter(function(){
            var _this = $(this),data = {};
                data.data = {};
                if(_this.attr("data-consign")){
                    data.consign = _this.attr("data-consign");
                }
                data.data.RefundRule = _this.attr("data-RefundRule") || "";
                data.data.ChangeRule = _this.attr("data-ChangeRule") || "";
                data.data.BookNotice = _this.attr("data-BookNotice") || "";
                data.IsDirect = _this.attr("data-IsDirect");
                var $html = flightRule(data);
                $(".dialog_tooltip_text").empty().append($html);
                _this.attr('data-content', $html);
        });
    },
    /*联系人验证*/
    contactValidInfo: function (){
        var self = this,
        $input = $(".J_vali").find('input:not(".ui-input-date")'),
        J_vali = new _vali({
            wrapper: "#J_validate1",
            showOneMsg: true
        });
        J_vali.on("failure",function(o,obj){
            $(obj).addClass("input_error");
            $(obj).siblings(".valid_symbol").addClass("none");
        });
        J_vali.on("success",function(o,obj){
            $(obj).removeClass("input_error");
            $(obj).siblings(".valid_symbol").removeClass("none");
        });
        J_vali.on("hide",function(o,obj){
            $(obj).focus();
        });
        $input.focus(function(){
            $(this).removeClass("input_error");
            $(this).siblings(".valid_symbol").addClass("none");
        });
        $(".tour").find(".reset").on( "click", function (e) {
            var target = e.delegateTarget;
            var table = $(target).parents(".passenger-info");
            self.reset(table);
        });

        $(".ui-input-nameZh").blur(function () {
            var el = $(this),
                tourName = el.val(),
                index = el.index() -1,
                passengerTable = el.parents(".passenger-info-table");
            var pinArr = [],IsDuoYin = false;
            var pinyin = "",html1="";
            $.ajax({
                url: "/intervacation/api/PDynamicPackageProductDetail/GetMultiPinYins?chinese=" + tourName,
                dataType: "json",
                success: function (data) {
                    if(data.Data) {
                        $(".surname_select").remove();
                        pinArr = data.Data;
                        for(var i=0;i<pinArr.length;i++){
                            if(pinArr[i].IsMoreSound==1){
                                IsDuoYin = true;
                                break;
                            }
                        }
                        //有多音字
                        if(IsDuoYin){
                            html1 = touristName(pinArr);
                            passengerTable.find('.list').eq(1).append(html1);
                            if(el.hasClass('ui-input-nameZh-first')){
                                $(".surname_select").css('left', '104px');
                            }else{
                                $(".surname_select").css('left', '286px');
                            }
                            $(".btn_link").click(function(e) {
                                var hasCheck = true;
                                $(this).parent().parent().find(".surname_item").each(function() {
                                    var _this = $(this);
                                    if(!_this.find('input:checked').length){
                                        hasCheck = false;
                                    }
                                });
                                if(hasCheck){
                                    $(".surname_select").addClass('none');
                                    var html2="";
                                    $(this).parent().parent().find("input:checked").each(function() {
                                        var _this = $(this);
                                        html2 += _this.val();
                                        passengerTable.find(".ui-input-enName").eq(index).val(html2);
                                        passengerTable.find(".ui-input-enName").eq(index).removeClass("input_error");
                                    });
                                }else{
                                    passengerTable.find(".ui-input-enName").eq(index).addClass("input_error");
                                }
                            });
                        }else{
                            //无多音字
                            for(var i=0;i<pinArr.length;i++){
                                pinyin += pinArr[i].PinYins;
                            }
                            passengerTable.find(".ui-input-enName").eq(index).val(pinyin);
                            passengerTable.find(".ui-input-enName").eq(index).removeClass("input_error");
                        }
                    }
                }
            });
        });
        $(".ui-input-enName").click(function(event) {
            var el = $(this),index = el.index() -1,tourName = el.val(),
            passengerTable = el.parents(".passenger-info-table");
            if(!tourName){
                passengerTable.find(".ui-input-nameZh").eq(index).blur();
            }
        });
    },
    /*出游人reset*/
    resetEvent: function (){
        var self = this;
        $(".tour").find(".reset").on( "click", function (e) {
            var target = e.delegateTarget;
            var table = $(target).parents(".passenger-info");
            self.reset(table);
        });
    },
    /*日历*/
    calRender: function (conf){
        var self =this;
        var _popup = new Popup({
            berth: ".ui-input-date",
            align: "bottom left",
            width: "350px",
            "hideTrigger": "blur,esc",//blur,esc
            "position": "berth"//fixed,berth
        });
        var _datepicker ;
        $(".ui-input-date").click(function () {
            var _self = $(this),age,maxDate,minDate,today,thisyear=1990,value;
            age = _self.attr('data-age');
            today = conf.StartDate ? new Date(conf.StartDate.replace(/-/g,"/")) : new Date();
            _self.removeClass("input_error");
            $(".ui_popup_gp").css('visibility','hidden');
            if(age){
                thisyear = today.getFullYear() - parseInt(age);
                value = thisyear.toString() + "-01-01";
                minDate = (parseInt(thisyear)-1).toString() + "-01-01";
                maxDate = thisyear.toString() + "-12-31";
            }else{
                minDate = "";
                maxDate = "";
            }
            if(_self.hasClass('ui-input-birthday')){
                if(_self.val()){
                    value = _self.val();
                }else{
                    if(age){
                        value = thisyear.toString() + "-01-01";
                    }else{
                        value = thisyear.toString() + "-07-01";
                    }
                }
            }else{
                value = self.dateCal(new Date(),730,1);
            }
            _popup.render = function (obj, res) {
                if (!_datepicker) {
                    _datepicker = new DatePicker({
                        wrapper: this.o_wrapper,
                        skin: "default",
                        value: value,
                        maxDate: maxDate,
                        minDate: minDate,
                        allowCancel: false,
                        yearPanel: true,//是否显示年选择面板
                        monthPanel: true//是否显示月选择面板
                    });
                    _datepicker.on("dayselect", function (o, y, m, d) {
                        var $obj = $(_popup.attr.berth);
                        $(".ui_popup_gp").css('visibility','hidden');
                        self.dateValidate($obj,m,conf);//出生日期和证件有效期验证

                        $obj.val(d);
                        _popup.hide();
                    });
                } else {
                    _datepicker.attr.maxDate = maxDate;
                    _datepicker.attr.minDate = minDate;
                }
                _datepicker.setValues([value]);
                _datepicker.open();
                res();
            };
            _popup.open({berth:this});
        });
    },
    dateCal:function(date,day,rule){
        if(date){
            if(rule==1){
                var stime = date.getTime() + 1000*60*60*24*day;
            }else{
                var stime = date.getTime() - 1000*60*60*24*day;
            }
            date = new Date(stime);
            var yy = date.getFullYear();
            var m = parseInt(date.getMonth() + 1);
            var d = parseInt(date.getDate());
            //兼容IE
            if(m < 10){
                m = '0' + m;
            }
            if(d < 10){
                d = '0' + d;
            }
            return yy+"-"+m+"-"+d;
        }else{
            return '';
        }
    },
    /*验证选择的时间是否符合*/
    dateVali: function(val,year,ischild,date){
        //兼容IE8  date.replace(/-/g,"/") new Date('1990/01/01')
        var nowAge = new Date(date.replace(/-/g,"/")).getFullYear(),
            nowMonth = new Date(date.replace(/-/g,"/")).getMonth(),
            nowDate = new Date(date.replace(/-/g,"/")).getDate(),
            age = new Date(val.replace(/-/g,"/")).getFullYear(),
            month = new Date(val.replace(/-/g,"/")).getMonth(),
            date = new Date(val.replace(/-/g,"/")).getDate();
        if(ischild){
            if(age + year == nowAge){
                if(month < nowMonth){
                    return true;
                }else if(month == nowMonth){
                    if(date <= nowDate){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else if(age + year + 1 == nowAge){
                if(month > nowMonth){
                    return true;
                }else if(month == nowMonth){
                    if(date > nowDate){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            if(age + year < nowAge){
                return true;
            }else if(age + year == nowAge){
                if(month < nowMonth){
                    return true;
                }else if(month == nowMonth){
                    if(date <= nowDate){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }

    },
    /*所选择的年龄*/
    choseAge: function(val,date){
        var nowAge = new Date(date.replace(/-/g,"/")).getFullYear(),
            nowMonth = new Date(date.replace(/-/g,"/")).getMonth(),
            nowDate = new Date(date.replace(/-/g,"/")).getDate(),
            age = new Date(val.replace(/-/g,"/")).getFullYear(),
            month = new Date(val.replace(/-/g,"/")).getMonth(),
            date = new Date(val.replace(/-/g,"/")).getDate();
        if(month < nowMonth){
            return nowAge - age;
        }else if(month == nowMonth){
            if(date <= nowDate){
                return nowAge - age;
            }else{
                return nowAge - age - 1;
            }
        }else{
            return nowAge - age - 1;
        }

    },
    /*计算证件时间是否符合*/
    passPortDateVali: function(val,startDate){
        var startAge = new Date(startDate.replace(/-/g,"/")).getFullYear(),
            startMonth = new Date(startDate.replace(/-/g,"/")).getMonth(),
            startDate = new Date(startDate.replace(/-/g,"/")).getDate(),
            age = new Date(val.replace(/-/g,"/")).getFullYear(),
            month = new Date(val.replace(/-/g,"/")).getMonth(),
            date = new Date(val.replace(/-/g,"/")).getDate();
        if(age<startAge){
            return false;
        }else if(age == startAge){
            if(month - startMonth >6){
                return true;
            }else if(month -startMonth == 6){
                if(date >= startDate){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else if(age == startAge + 1){
            if(month + 6 > startMonth){
                return true;
            }else if(month + 6 == startMonth){
                if(date >= startDate){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
            if(startMonth - month > 6){
                return false;
            }else if(startMonth - month == 6){
                if(date >= startDate){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return true;
        }
    },
    dateValidate: function(obj,val,conf){
        var self = this,
            $obj = obj,
            choseVal = val,
            startDate = conf.StartDate;
        var passInfo = $obj.parents(".passenger-info");
        var isValiAge = '';
        var choseAge = '';
        var passPortDate = '';
        if($obj.hasClass('ui-input-birthday')){
            if(passInfo.hasClass("iamadult")){
                isValiAge = self.dateVali(choseVal,18,false,startDate);
            }else{
                isValiAge = self.dateVali(choseVal,parseInt($obj.attr("data-age")),true,startDate);
            }
        }else{
            passPortDate = self.passPortDateVali(choseVal,startDate);
        }
        if($obj.hasClass('ui-input-birthday')){
            if(isValiAge){//符合标准
                $obj.next().next().removeClass("none");
                $obj.removeClass("input_error");
                $obj.siblings(".dj-validate").removeClass("active");
                $obj.siblings(".age-vali").removeClass('active');
                if(!$obj.siblings(".date-validate").hasClass('active')){
                    $obj.parents(".list").removeClass('J_ageJudge');
                }
            }else{
                var shtml = '';
                $obj.siblings(".age-vali").addClass('active');
                $obj.addClass("input_error");
                $obj.next().next().addClass("none");
                $obj.parents(".list").addClass('J_ageJudge');
                if(passInfo.hasClass("iamadult")){
                    choseAge = self.choseAge(choseVal,startDate);
                    shtml = '输入的年龄为'+ choseAge +'岁,不符<br/>&nbsp;&nbsp;&nbsp;&nbsp;合成人出生日期';
                }else{
                    choseAge = self.choseAge(choseVal,startDate);
                    shtml = '输入的年龄为'+ choseAge +'岁,不符<br/>&nbsp;&nbsp;&nbsp;&nbsp;合已选儿童年龄';
                }
                $obj.siblings(".age-vali").find("span").html(shtml);
            }
        }else{
            if(passPortDate){//符合标准
                $obj.next().next().removeClass("none");
                $obj.removeClass("input_error");
                $obj.siblings(".dj-validate").removeClass("active");
                $obj.siblings(".passPort-vali").removeClass('active');
                if(!$obj.siblings(".date-validate").hasClass('active')){
                    $obj.parents(".list").removeClass('J_ageJudge');
                }
            }else{
                $obj.parents(".list").addClass('J_ageJudge');
                $obj.next().next().addClass("none");
                $obj.addClass("input_error");
                $obj.siblings(".passPort-vali").find("span").html('证件有效期需比行程结束<br/>&nbsp;&nbsp;&nbsp;&nbsp;晚6个月以上');
                $obj.siblings(".passPort-vali").addClass('active');
                $obj.siblings(".valid_symbol").addClass("none");
            }
        }
    },
    //弹窗事件
    dialogEvent: function (){
        var dialog = new $dialog({
            skin: 'default'
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '350px',
            triggerEle: '.cancel-hotel',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '320px',
            triggerEle: '.time em',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '500px',
            triggerEle: '.J_otherTips',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'right'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '300px',
            triggerEle: '.J_addTips',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'right'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '370px',
            triggerEle: '.help',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom left'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '350px',
            triggerEle: '.J_intro',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '350px',
            triggerEle: '.hotel-info',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom'//显示位置支持top,left,bottom,right
        });
        dialog.tooltip({
            content: function (obj) {
                var text = $(obj).attr('data-content');
                return text;
            }, //内容,支持html,function
            delay: 0,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function () { //隐藏后触发事件

            },
            width: '460px',
            triggerEle: '.J_passInfo',//触发元素选择器
            triggerType: 'hover',//hover|click
            triggerAlign: 'bottom left'//显示位置支持top,left,bottom,right
        });
    },
    //出游人证件下拉框
    selectEvent: function (){
        /*var $select_list = $(".J_select") || "";
        $select_list.on("click",function(e){
            e.stopPropagation();
            $(this).toggleClass("hover");
        });
        $select_list.find("dd").click(function(){
            $(this).siblings("dt").text($(this).text());
            if($(this).text() == "台湾通行证"){
                $(this).parents(".list").find("input").attr("placeholder","格式 :T12345678")
                    .attr("validate","required twpass");
            } else {
                $(this).parents(".list").find("input").attr("placeholder","证件号码")
                    .removeAttr("validate","twpass")
                    .attr("validate","required");
            }
        });

        $(document).on("click",function(){
            $("div.ui-select").removeClass("hover");
        });*/
        var pre = $(".hotelInfo").find(".J_preference");
        var hide = $(".hotelInfo").find(".J_hide");
        pre.on("click",function(){
            $(this).toggleClass("J_preference");
            $(".J_preferenceBox").toggle();
        });
        hide.on("click",function(){
            $(".J_preferenceBox").hide();
            pre.addClass('J_preference');
        });
        $(".bedSelect").on("click",function(e){
            e.stopPropagation();
            $(this).parents(".hotelRequire").siblings(".hotelRequire").find(".bedSelect").removeClass("J_hover");
            $(this).toggleClass('J_hover');
        });
        $(document).on("click",function(){
            $("div.bedSelect").removeClass("J_hover");
        });
        $(".bedSelect").find("dd").on("click",function(){
            $(this).siblings("dt").text($(this).text());
            $(this).siblings("dt").attr("data-bedtypeid",$(this).attr("data-bedtypeid"));
            $(this).siblings("dt").attr("data-bedtypename",$(this).attr("data-bedtypename"));
        });
    },
    //常用联系人查询
    getContactsInfo: function (conf,fn) {
        var self = this,
            commonLinker = '//www.ly.com/intervacation/api/OrderHandler/GetPassengerInfoData';
        if(conf.IsFromCct && conf.IsFromCct == 1){
            var data = conf.CctLinkers;
            if(data.length){
                self._data = handleData(data);
                fn && fn.call(this);
            } else {
                $(".normal-tour").css({"display":"none"});
                $(".more").css({"display":"none"});
            }
        }else{
            $.ajax({
                url: commonLinker,
                dataType: "jsonp",
                success: function (data) {
                    var datas = data.Data;
                    if (datas && datas.PassengerData && datas.PassengerData.PassengerInfoDataList && datas.PassengerData.PassengerInfoDataList.length) {
                        self._data = handleData(datas.PassengerData.PassengerInfoDataList);
                        fn && fn.call(this);
                    } else {
                        $(".normal-tour").css({"display":"none"});
                        $(".more").css({"display":"none"});
                    }
                },
                error: function(){
                }
            });
        }
        function handleData(data) {
            var ret = [];
            for (var i = 0; i < data.length; i++) {
                //当中文名称为空时过滤
                if(data[i].LinkerName){
                    var p = {};
                    p.zhName = data[i].LinkerName;
                    p.enNameFirst = data[i].EnglishFirstName;
                    p.enNameLast = data[i].EnglishLastName;
                    p.cardType = data[i].DefaultCertType == "8" ? "台湾通行证" : (data[i].DefaultCertType == "7" ? "港澳通行证" : "护照");
                    // p.cardDate = data[i].UseDateLast;
                    p.certList = data[i].CertList || {};
                    p.birth = data[i].Birthday.split("T")[0];
                    // p.country = data[i].Nationality;
                    p.sex = data[i].Sex;
                    p.linkerId = data[i].LinkerId;
                    p.mobile = data[i].Mobile;

                    ret.push(p);
                }
            }
            return ret;
        }
        fn && fn.call(this);
    },
    //创建常用联系人
    createAddressBook: function (fn) {
        var self = this,
            ret = [],
            dataArr = self._data || [],
            $contacts = $(".normal-tour");
        for (var i = 0; i < dataArr.length; i++) {
            var str = "",
                randomId = "passenger" + i;
            str = '<span><input class="ui-checkbox" id="' + randomId +
            '" type="checkbox" hidefocus="true" data-type="1"/><label class="person" title="' + dataArr[i].zhName + '" for="' + randomId + '">' + dataArr[i].zhName.substring(0, 3) + '</label></span>';
            ret.push(str);
        }
        $($contacts).empty().html('<li class="normal-person1">选择常用旅客 :</li>'+ '<li class="normal-person2">' +ret.join("")+ '</li>');
        self.touristShowAndHide(dataArr);
        $(window).resize(function() {
            self.touristShowAndHide(dataArr);
        });
        fn && fn.call(this);
    },
    /*展开全部常用旅客 显隐*/
    touristShowAndHide: function(dataArr) {
        var $tour = $(".tour"),
            $dropdown = $tour.find(".drop-down"),
            $more = $tour.find(".more");
        if (!$(".content").hasClass("smallC")) {
            if (dataArr.length > 16) {
                $more.css({"display": "block"});
                $dropdown.css({"display": "block"});
            } else {
                $dropdown.css({"display": "none"});
                $more.css({"display": "none"});
            }
        } else {
            if (dataArr.length > 14) {
                $more.css({"display": "block"});
                $dropdown.css({"display": "block"});
            } else {
                $dropdown.css({"display": "none"});
                $more.css({"display": "none"});
            }
        }
    },
    //联系人信息插入
    inserContacts: function (obj, data) {
        var self = this;
        var $errorTip= $(".dj-validate",obj);
        $("input,.ui-select", obj).each(function () {
            var className = this.className,
                $ipt = $(this);
            var firstZhName = data.zhName.substr(0,1),
                lastZhName = data.zhName.substr(1);
            if (/(ui-input-nameZh-first)/.test(className)) {
                $ipt.val(firstZhName);
            }
            if (/(ui-input-nameZh-last)/.test(className)) {
                $ipt.val(lastZhName);
            }
            if (/(ui-input-first-name)/.test(className)) {
                $ipt.val(data.enNameLast);
            }
            if (/(ui-input-last-name)/.test(className)) {
                $ipt.val(data.enNameFirst);
            }
            if (/(ui-select-country)/.test(className)) {
                if(!data.country){data.country="中国";}
                $ipt.find("dt").text(data.country).attr("data-value", data.country);
            }
            if (/(ui-select-certificate-id)/.test(className)) {
                var nowCertNo = parseInt($ipt.attr("data-value"));
                var val = self.cardTypeToNo(data.cardType);
                var certNo = self.certNo(val, data.certList);
                if(val == nowCertNo){
                    $ipt.val(certNo);
                }
            }
            if (data.cardType === "护照" || data.cardType === "港澳通行证" || data.cardType === "台湾通行证") {
                if (/(ui-input-birthday)/.test(className) && data.birth) {
                    $ipt.val(data.birth);
                    $ipt.siblings(".age-vali").removeClass("active");
                    $ipt.parent(".list").css("display: block");
                }
                if (/(ui-input-certificate-date)/.test(className)) {
                    $ipt.val(data.cardDate);
                    $ipt.siblings(".passPort-vali").removeClass("active");
                }
            }
            if (/ui-input-country/.test(className)) {
                $ipt.val(data.country);
            }
            if (/ui-input-mobile/.test(className)) {
                $ipt.val(data.mobile);
            }
        });
        $(".ui-radio-sex", obj)[1 - data.sex] && ($(".ui-radio-sex", obj)[1 - data.sex].checked = true);
        $(".ui-radio-sex", obj).parents(".list").addClass('checked');
        if(data.sex == 0){
            $(".passenger-info-type", obj).removeClass("type-man")
                .addClass("type-woman");
        }
        if($errorTip){
            $errorTip.removeClass("active");
        }
        obj.attr("data-isInsert", 1);
        obj.attr("data-linkerId", data.linkerId);
        self.clear(obj);
    },
    //将证件类型转换为证件类型号
    cardTypeToNo: function (cardType) {
        var val = 2;
        if (cardType === "护照") {
            val = 2;
        }
        if (cardType === "港澳通行证") {
            val = 7;
        }
        if (cardType === "台湾通行证") {
            val = 8;
        }
        return val;
    },
    //根据证类型获取证件号码
    certNo: function (dataType, certList) {
        if (certList && certList.length) {
            for (var i = 0; i < certList.length; i++) {
                if (certList[i].CertType == dataType) {
                    return certList[i].CertNo;
                }
            }
        }
        return "";
    },
    clear: function (obj) {
        $(".invalid_message,.valid_symbol", obj).addClass("none");
        $("input", obj).removeClass("input_error placeholder");
    },
    //常用联系人收起和展开
    dropDown: function () {
        var $contacts = $(".tour"),
            $drop = $contacts.find(".drop-down"),
            t = ["展开", "收起"],
            c = 0;
        $drop.on("click", function () {
            c = $contacts.hasClass("J_normal_tour") ? 1 : 0;
            $contacts.toggleClass("J_normal_tour");
            $drop.html($drop.html().replace(t[c], t[(c + 1) % 2]));
        });
    },
    //合同条款框选择事件
    checkEvent: function (){
        $("#Icheck").on("click",function(){
            var self = this,
                $Icheck = $(self).prop("checked"),
                $nocheck = $("#nocheck");
            !$Icheck?$nocheck.css("display","inline-block"):$nocheck.css("display","none");
        });
    },
    //提交按钮点击事件
    submitEvent: function (conf){
        var self = this;
        $(".order-submit").on("click",function(e){
            var needVali = $(".J_vali:visible"),
                checked = $("#Icheck").prop("checked"),
                flag = false,
                manVali = true,
                dateVali = true,
                vali = new _vali({
                    wrapper: needVali,
                    showOneMsg: true
                });
            if(!checked){
                $("#nocheck").css("display","inline-block");
                $("html,body").animate({"scrollTop":$("#nocheck").offset().top-500},100);
            }
            if(!$(this).hasClass("submitH")){
                e.preventDefault();
                vali.on("failure",function(o,obj){
                    $(obj).addClass("input_error");
                    $(obj).siblings(".valid_symbol").addClass("none");
                });
                vali.on("success",function(o,obj){
                    $(obj).removeClass("input_error");
                    $(obj).siblings(".valid_symbol").removeClass("none");
                });
                if(vali.validate()){
                    flag = true;
                }
                var passengers = $(".passenger-info");
                for(var i=0; i< passengers.length; i++){
                    var sex = $(passengers[i]).find(".ui-radio-sex");
                    if(!sex.parents(".list").hasClass('checked')){
                        manVali = false;
                        sex.siblings(".dj-validate").addClass('active');
                    }
                    var oDate = $(passengers[i]).find(".ui-input-date");
                    for(var j=0; j< oDate.length; j++){
                        if($(oDate[j]).val() == ""){
                            $(oDate[j]).addClass("input_error");
                            $(oDate[j]).parents(".list").addClass("J_ageJudge");
                            $(oDate[j]).next().find("span").html("*输入的日期为空,<br/>&nbsp;&nbsp;&nbsp;&nbsp;请选择正确日期");
                            $(oDate[j]).next().addClass("active");
                            dateVali = false;
                        }else{
                            self.dateValidate($(oDate[j]),$(oDate[j]).val(),conf);
                            if($(oDate[j]).siblings(".date-validate").hasClass("active")){
                                dateVali = false;
                            }
                        }
                    }
                }
                if(flag && checked && manVali && dateVali){
                    $("this").addClass("submitH");
                    $(".order-submit").val("正在提交...").addClass("submitH");
                    if(isoverTime){
                        var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="bg"></div><span style="font-size:14px;line-height:36px;left:24%;">抱歉，已为您保存资源及价格超过30分钟，正在为您核实资源库存及报价</span></div></div>';
                    }else{
                        var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
                    }
                    clearTimeout(citytimer);
                    self.overTime();
                    var config = {
                        content: content,
                        width: 500,
                        title: '',
                        quickClose: false,
                        zIndex:100000
                    };
                    $dialog1.modal(config);
                    window.dialog = $dialog1;
                    self.tourSubmit(conf);//当验证都通过且确认过条款,走验价接口,然后跳支付
                } else {
                    return;
                }
            } else{
                return;
            }
        });
    },
    //重置联系人信息
    reset: function (obj) {
        var $lists = $(".list", obj),
            $inputs = $(".ui-input", obj),
            $radios = $(".ui-radio-sex", obj),
            $selectcountry = $(".ui-select .select-country", obj),
            $birthDate = $(".ui-input-birthday", obj),
            $ageVali = $(".age-vali", obj),
            $passPortVali = $(".passPort-vali", obj),
            $certDate = $(".ui-input-certificate-date", obj),
            $passenger_type = $(".passenger-info-type",obj),
            $passengerId = $(".ui-select-certificate-id",obj),
            $btns = $(".normal-tour input"),
            $tips = $(".valid_symbol", obj),
            $errorTip= $(".dj-validate",obj),
            self = this;
        var isInputSupported = 'placeholder' in document.createElement('input'),
            newDate = new Date();
        $inputs.each(function () {
            var $this = $(this);
            isInputSupported ? $this.val("") : $this.addClass("placeholder").val($this.attr("placeholder"));
            $this.removeClass("input_error");
        });
        $lists.removeClass('J_ageJudge');
        $radios[0].checked =true;
        $birthDate.val("");
        $ageVali.removeClass('active');
        $certDate.val(self.simpleFormatDate(newDate));
        $passPortVali.removeClass('active');
        $selectcountry.html("中国").attr("data-value", "中国");
        $passengerId.val("");
        $tips.addClass("none");
        $passenger_type.addClass("type-man")
            .removeClass("type-woman");
        $btns.each(function () {
            var $this = $(this);
            if ($this.attr("map") === obj[0].id) {
                this.checked = false;
                this.removeAttribute("map");
            }
        });
        if($errorTip){
            $errorTip.removeClass("active");
        }
        obj.attr("data-isInsert", 0);
    },
    //提交联系人信息
    tourSubmit: function (conf) {
        var addLink = "/intervacation/api/PDynamicPackageOrder/PostSubOrder", //验价接口
            param = {},
            self = this,
            Hotels = [],
            Passengers = [],data2=[];
        param.Days = conf.Days;
        param.LineId = conf.LineId;
        param.StartDate = conf.StartDate;
        param.ContactPerson = $("#Iname").val();
        param.ContactMoblie = $("#Iphone").val();
        param.ContactMail = $("#Imailbox").val();
        param.Adult = conf.Adult;
        param.Child = conf.Child;
        param.ChildAges = conf.ChildAges;
        param.AccidentInsurance = conf.AccidentInsurance;//意外险
        param.CancleInsurance = conf.CancleInsurance;//取消险
        param.TempOrderGuid = conf.TempOrderGuid;//临时订单Id
        param.AdditionProductGuid = conf.AdditionProductGuid;  //单品
        param.ModuleId = conf.ModuleId;//模块Id
        param.ExternalId = conf.ExternalId;//外部资源Id
        param.SearchType = conf.SearchType || 0;

        var J_preferenceBox = $(".J_preferenceBox");
        var hotelRequireList = J_preferenceBox.find(".hotelRequire");
        for(var i = 0; i< hotelRequireList.length; i++ ){
            var bedtypeid = hotelRequireList.eq(i).find("dt").attr("data-bedtypeid") || "0";
            if(bedtypeid != 0){
                var hotelItem = {};
                hotelItem.CheckInDate = hotelRequireList.eq(i).attr("data-checkindate");
                hotelItem.BedTypeId = hotelRequireList.eq(i).find("dt").attr("data-bedtypeid");
                hotelItem.BedTypeName = hotelRequireList.eq(i).find("dt").attr("data-bedtypename");
                Hotels.push(hotelItem);
            }
        }
        param.Hotels = Hotels;
        var traveller = [];
        //特殊乘客
        $(".traveller-list input:checked").each(function(i, elem) {
            traveller.push($(elem).val());
        });
        var travellers = traveller.toString();
        param.Remark= travellers;
        $(".passenger-info:visible").each(function () {
            var $this = $(this),
                innerpassengers={},ret2={},CertificateText;
            if($this.find(".save").children("input").prop("checked")){
                ret2.isSave = true;
                innerpassengers.IsFrequent = true;
            }else{
                ret2.isSave = false;
                innerpassengers.IsFrequent = false;
            }
            if($this.hasClass('iamadult')){
                ret2.type = innerpassengers.PassengerType = 1;
            }else if($this.hasClass('iamchild')){
                ret2.type = innerpassengers.PassengerType = 2;
            }
                ret2.linkerName = innerpassengers.Name = $this.find(".ui-input-nameZh-first").val()+$this.find(".ui-input-nameZh-last").val();
                ret2.firstName = innerpassengers.FirstName = $this.find(".ui-input-first-name").val();
                ret2.lastName = innerpassengers.LastName = $this.find(".ui-input-last-name").val();
                ret2.englishName = ret2.lastName + "/" + ret2.firstName;
                var $radioChecked = $this.find(".ui-radio:checked");
                if($radioChecked.hasClass("radio-man")){
                    ret2.sex = innerpassengers.Sex = 1;
                }else{
                    ret2.sex = innerpassengers.Sex = 0;
                }
                innerpassengers.CertificateType = ret2.defaultCertType = $this.find(".ui-select-certificate-id").attr("data-value");
                ret2.certNo = innerpassengers.Certificate = $this.find(".ui-select-certificate-id").val();
                ret2.birthday = innerpassengers.BirthDate = $this.find(".ui-input-birthday").val() || "";
                ret2.useDateLast = innerpassengers.CertificateTime = $this.find(".ui-input-CertificateValid").val() || "";
                ret2.Mobile = innerpassengers.Mobile = $this.find(".ui-input-mobile").val() || "";
                ret2.nationality =innerpassengers.National = $this.find(".select-country").html() || "";
                innerpassengers.CertificateTime  = $this.find(".ui-input-expirydate").val() || "";
                Passengers.push(innerpassengers);
        });
        param.Passengers = Passengers;
        if(conf.IsFromCct && conf.IsFromCct == 1){
            param.IsFromCct = conf.IsFromCct;
            param.CctParam = conf.CctParam;
        }
        
        var postData = encodeURIComponent(JSON.stringify(param));
        $.ajax({
            url: addLink,
            dataType: "json",
            data: "param="+postData,
            type: "post",
            timeout: '60000',
            success: function(data){
                //console.log(data);
                if(data.Code == 4000 && data.Data.IsSuccess == true){
                    if(data.Data.OriginPrice == data.Data.UpdatePrice){
                        window.location.href = data.Data.Url;
                    }else{
                        var config = {
                            type: 'html',
                            width: '415px',
                            height: '350px',
                            content:'<div class="order-pop-content J_changeTips">'
                            +'<i></i><ul>'
                            +'<li class="order-pop-desc"><span>产品原价：'+ data.Data.OriginPrice + '</span><span class="newprice">产品现价：'+ data.Data.UpdatePrice + '</span></li>'
                            +'<li class="order-pop-desc"><span>由于国际机票价格实时变动，为保证您的顺利出行，请尽快支付</span></li>'
                            +'<li class="order-pop-btns">'
                            +'<a class="order-pop-btn oder-pop-goOrder J_goOrder" href="javascript:;" data-dialog-hide title="" target="_self">继续预定</a>'
                            +'</li>'
                            +'</ul>'
                            +'</div>'
                        };
                        $dialog1.modal(config);
                        var newUrl = data.Data.Url;
                        $('.J_goOrder').on("click",function(){
                            window.location.href = data.Data.Url;
                        });
                    }
                }else{
                    self.errTips(conf,data);
                }
            },
            error: function(){
                self.errTips(conf);
            },
            complete: function(){
                $(".order-submit").val("提交订单").removeClass("submitH");
            }
        });
    },
    /*订单提交失败信息*/
    errTips: function(conf,data) {
        var message;
        if(data){
            if(data.Data.FailHotels&&data.Data.FailHotels.length>0){
                message = '<span class="warningText">来晚了，您选择的<em>'+data.Data.FailHotels[0].CheckInDate+'</em>入住的酒店<em>'+data.Data.FailHotels[0].Name+'</em>已订光，请更换酒店重新预订</span>';
            } else if(data.Data.FailAdditionProducts && data.Data.FailAdditionProducts.length>0){
                var tipStr = "",
                    dataTip = data.Data.FailAdditionProducts;
                for(i=0; i<dataTip.length; i++){
                    if(i=dataTip.length-1){
                        tipStr +=  dataTip[i].Name;
                    }else{
                        tipStr +=  dataTip[i].Name + "、";
                    }
                }
                message = '<span class="warningText">很抱歉，<em>'+tipStr+'</em>库存不足，请重新选择~</span>';
            }
            else{
                message = data.Data.Message;
            }
        }else{
            message = '来晚啦，您选择的套餐已订光，请更换套餐重新预订';
        }
        var config = {
            type: 'html',
            width: '475px',
            height: '350px',
            content:'<div class="order-pop-content">'
            +'<i></i><ul>'
            +'<li class="order-pop-desc" id="J_orderTipDesc"><span>'+ message +'</span></li>'
            +'<li class="order-pop-btns">'
            +'<span class="order-pop-btn oder-pop-resubmission"  data-dialog-hide>关闭</span>'
            +'</li>'
            +'</ul>'
            +'</div>'
        };
        $dialog1.modal(config);
    },
    /*格式化日期*/
    simpleFormatDate: function(date) {
        var y = date.getFullYear() + "",
            m = (date.getMonth() + 1) + "",
            d = date.getDate() + "";
        m.length <= 1 && (m = "0" + m);
        d.length <= 1 && (d = "0" + d);
        return y + "-" + m + "-" + d;
    },
    goBack:function(conf){
        var url = "/dujia/tours/p"+conf.LineId+".html";
        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
            if(history.length > 0){
            window.history.go( -1 );
            }else{
                location.href = url;
            }
        }else{ //非IE浏览器
            if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                navigator.userAgent.indexOf('Opera') >= 0 ||
                navigator.userAgent.indexOf('Safari') >= 0 ||
                navigator.userAgent.indexOf('Chrome') >= 0 ||
                navigator.userAgent.indexOf('WebKit') >= 0){
                    if(window.history.length > 1){
                    window.history.go( -1 );
                    }else{
                        location.href = url;
                    }
                }else{ //未知的浏览器
                window.history.go( -1 );
                }
            }
        }
};
module.exports = new package();