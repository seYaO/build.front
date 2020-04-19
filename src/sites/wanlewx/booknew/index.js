/**
 * @author 季阳阳(季阳阳0066@ly.com)
 * @module  下单页
 * @exports tc/booknew/index
 * @version 0.0.1
 * @description
 * 地址: {@link http://wx.17u.cn/localfun/wanle/OrderWrite.html?productId=241180&supplyId=26566&resourceId=12464}
 */
/* global Monitor */
/* global Config */
(function($){
    var tpl={};
    tpl.main = require("./ajaxdot/main.dot");
    tpl.postList = require("./ajaxdot/postList.dot");
    tpl.travelList = require("./ajaxdot/travelList.dot");
    tpl.editTravel = require("./ajaxdot/editTravel.dot");
    tpl.goTravel = require("./ajaxdot/goTravel.dot");
    tpl.hongBaoList = require("./ajaxdot/hongBaoList.dot");
    tpl.addressSelectList = require("./ajaxdot/addressSelect.dot");
    tpl.city = require("./ajaxdot/city.dot");
    var Booking = {},Common,calendar1,calendar2,globalCfg,Iscroll,goTravelList = [],
        tmplList = tpl,
        //公共模块
        Common = require("/modules-lite/common/index"),
        Mobile = require("/modules-lite/wanleCommon/common");
        require("/modules-lite/dialogold/index");
    Booking.postJson = $(".J_address1").attr("data-address");
    Booking.invoice_postJson = $(".J_address3").attr("data-address");
    Booking.host = "";
    Booking.sitType = 1;
    Booking.insureFlagFirst = false;
    if(location.host.indexOf("wx") === -1){
        Booking.host = "http://www.t.ly.com";
        // Booking.host = "http://cx.ly.com";
        Booking.sitType = 0;
    }
    if($(".J_address1").html()!=""){
        $(".J_address1").css("color","#333");
        $(".J_address2").css("color","#333");
    }
    /**
     * @private
     * @func initEnv
     * @desc 依赖初始化
     */
    Booking.initEnv = function(){
        //弹窗模块
        require("/modules-lite/dialog/index");
        //国籍
        Suggest = require("/modules-lite/suggest/index");
        //生日
        require("/modules-lite/birth/iscroll");
        require("/modules-lite/birth/birth");

        $('.add_birthday').date();

        Common.init();
        var share = require("/modules-lite/utils/share/index");
        share.disable();
        Common.pages = [{
            "tag":"main",
            "url": location.href,
            "title": $(".page-header h2").text()
        }];
        Booking.allOrderDay = 0;
        Booking.postStyle();
        
        Booking.chooseDate = $("#J_DepTime").attr("data-date") || "";
        //Booking.chooseDate2 = $("#EndDate").val() || "";
        Booking.chooseDate2 =  "";
        Booking.addCount = 0 ;  //点击新增出游人的次数

        Booking.travelPeople = [];  //出游人详细信息
        Booking.goTravelCount = parseInt($("#BookMin").val()); //默认出游人一个
        Booking.discountAmount = 0;  //可以优惠的金额

        Booking.hidWifiPackage = parseInt($("#hidWifiPackageDays").val());  //如果大于0，表示是wifi套票
        Booking.insure(parseInt($("#J_TotalPrice").html()),Booking.chooseDate);
        //初始化日历
        Booking.judgeInit();
        Booking.calInit();
        Booking.initEvent();
        Booking.discount();
        Booking.isNeed_invoice();
        Booking.invoice();
        Booking.OtherInfo();
        Booking.city();
        //$(".J_DayNumber").attr("readonly","readonly");

        $(".page-body").append('<div class="show-fail"><div class="fail"></div></div>');



    };
    Booking.judgeInit=function(){
        Booking.addBottomBorder();
        if($(".J_Number").length==0){
            Booking.alertback("该产品暂时无法预订，请选择其他产品");
        }
    };
    //判断预订台数下面是否加底线
    Booking.addBottomBorder = function(){
        var elem = $(".asyn-data li:last-child"),
            silbingElem = $(".asyn-data").next();
        if(!silbingElem.length || (silbingElem.length && silbingElem.hasClass("none"))){
            elem.addClass("spe_no_bottom");
        } else {
            elem.addClass("spe_border_bottom");
        }
    };

    /**
     * @func alertback
     * @desc 弹窗提示,基于dialog组件(在日历为空时，返回)
     * @param text 弹窗的内容
     * @param title 弹窗的标题
     */
    Booking.alertback = function(text,title){
        var cfg = {
            content: text,
            buttons: {
                '确定': function () {
                    history.go(-1);
                }
            }
        };
        if(title) {
            cfg.title = title;
        }
        var d = $.dialog(cfg);
        d.open();
    };
    /**
     * @private
     * @func calInit
     * @desc 日历依赖和配置初始化
     */
    Booking.calInit = function(){
        var Calendar = require("/modules-lite/calendar/0.2.0/index");
        calendar1 = new Calendar();
        calendar2 = new Calendar();
        calendar1.callback = function(dates,price,el){
            var dateText = dates[0] + "-" + (dates[1]-0) + "-" + (dates[2]-0),
                date = dates[0] + "/" + (dates[1]) + "/" + (dates[2]),
                depTimeInputEl = $("#J_DepTimeInput"),
                bookMin=$("#BookMin").val(),
                bookMax=$("#BookMax").val(),
                prodcutType=$("#ProdcutType").val();
            Booking.chooseDate = date;
            $("#J_DepTime").html(date+ "<i></i>");
            $("#StartDate").val(date);
            depTimeInputEl && depTimeInputEl.val(dates.join("-"));
            $("#J_SinglePrice").text(price);
            if($(".J_firstDay").length){
                $(".J_firstDay").html(date.replace(/\//g,"-"));
            }
            var param = "&ProductId="+Booking.getUrlParam("productId",false)+
                "&ResourceId="+Booking.getUrlParam("resourceId",false)+"&SupplierRelationId="+Booking.getUrlParam("supplyId",false)
                +"&minPerson="+bookMin+"&maxPerson="+bookMax+"&productType="+prodcutType
                +"&firstdate="+Booking.chooseDate;
            //var url = Config.getInterface("SingleProductPriceType","touch",Booking.extraHost)+param;
            var url = Booking.host + "/wanle/api/WanleBookAjax/GetSingleProductPriceType?siteType="+ Booking.sitType+param;
            Common.getData(url,function(data){
                data = data.Data;
                data.ProdcutCategory = parseInt($("#ProdcutCategory").val());
                data.productType_hide = parseInt($("#ProdcutType").val());

                var tmplList = tpl;
                Common.render({
                    key:"main",
                    data:data,
                    context:".asyn-data",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                        Booking.addBottomBorder();
                        history.go(-1);
                        Booking.firstAmount = $("#calendar1Page .from-day").find("b").html();
                        if($(".discount-first").length && $(".discount-first em").hasClass("selected")){
                            $(".discount-first em").removeClass("selected");
                            Booking.discountAmount = 0;
                        }
                        Booking.InitHongBao();  //每次改变了总价格，红包都会受影响；

                        if($("#J_sendTime").length){
                            var priceCountElem = $(".price-count"),
                                priceCountIElem = priceCountElem.find("i");
                            if(Booking.hidWifiPackage){
                                Booking.chooseDate2 = Booking.addDays(Booking.chooseDate,Booking.hidWifiPackage - 1);
                                $("#J_sendTime").html(Booking.chooseDate2+"<i style='border-color: transparent'></i>");
                                priceCountElem.addClass("J_price_count");
                                priceCountIElem.css("display","block");
                                // Booking.count();
                            } else if((+new Date(Booking.chooseDate)) + parseInt($("#minDay").val())*24*61*60*1000 > ((+new Date(Booking.chooseDate2))+ 24*61*60*1000)||
                                (+new Date(Booking.chooseDate)) + parseInt($("#maxDay").val())*24*61*60*1000 < ((+new Date(Booking.chooseDate2))+ 24*61*60*1000)
                            ){
                                $("#J_sendTime").html("<i></i>");
                                Booking.chooseDate2 = Booking.chooseDate -24*61*60*1000;
                                // Booking.count();
                            }
                            if($("#J_sendTime").html().length > 7){
                                // Booking.count();
                            }
                        } else {
                            Booking.chooseDate2 = Booking.chooseDate;
                            // Booking.count();
                        }
                        
                        
                        Booking.insuranceList = [];
                        Booking.initInsure = false;
                        Booking.insure(data.PriceList[0].Price,Booking.chooseDate);
                    }
                });
            });
            Booking.goTravelCount = parseInt($("#BookMin").val());
            Booking.goTravelList();
            return true;
        };

        calendar2.callback = function(dates,price,el){
            var dateText = dates[0] + "-" + (dates[1]-0) + "-" + (dates[2]-0),
                date = dates[0] + "/" + (dates[1]) + "/" + (dates[2]),
                depTimeInputEl = $("#J_DepTimeInput"),
                bookMin=$("#BookMin").val(),
                bookMax=$("#BookMax").val(),
                prodcutType=$("#ProdcutType").val();
            Booking.chooseDate2 = date;
            $("#J_sendTime").html(date+ "<i></i>");
            $("#StartDate").val(date);
            if($(".J_endDay").length){
                $(".J_endDay").html(date.replace(/\//g,"-"));
            }
            depTimeInputEl && depTimeInputEl.val(dates.join("-"));
            $("#J_SinglePrice").text(price);
            $(".price-count").addClass("J_price_count");
            $(".price-count").find("i").css("display","block");
            var param = "&ProductId="+Booking.getUrlParam("productId",false)+
                "&ResourceId="+Booking.getUrlParam("resourceId",false)+"&SupplierRelationId="+Booking.getUrlParam("supplyId",false)
                +"&minPerson="+bookMin+"&maxPerson="+bookMax+"&productType="+prodcutType
                +"&firstdate="+Booking.chooseDate+"&seconddate="+Booking.chooseDate2;

            Booking.InitHongBao();  //每次改变了总价格，红包都会受影响；
            Booking.insuranceList = [];
            //var url = Config.getInterface("SingleProductPriceType","touch",Booking.extraHost)+param;
            var url = Booking.host + "/wanle/api/WanleBookAjax/GetSingleProductPriceType?siteType="+ Booking.sitType +param;
            Common.getData(url,function(data){
                data = data.Data;
                data.date=date;
                data.ProdcutCategory = parseInt($("#ProdcutCategory").val());
                data.productType_hide = parseInt($("#ProdcutType").val());
                //var tmplList = require("tpl/singlePro/booknew/index");
                Common.render({
                    key:"main",
                    data:data,
                    context:".asyn-data",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                        Booking.addBottomBorder();
                        history.go(-1);
                        Booking.count();
                        
                        // Booking.insuranceList = [];
                        // Booking.initInsure = false;
                        // Booking.insure(data.PriceList[0].Price,Booking.chooseDate);
                    }
                });
            });
            Booking.goTravelCount = parseInt($("#BookMin").val());
            Booking.goTravelList();
            return true;
        };
    };

    /**
     * @private
     * @func initEvent
     * @desc 绑定事件
     */
    Booking.initEvent = function(){
        var self = this;
        dialog = $.dialog({
            container: ".content"
        });

        if($(".cancel-insure").hasClass("none")){
            $("#J_cert").attr("data-checktype",""); 
        }

        $(document).on("click","#J_DepTime",function(){
            var param = "&ProductId="+Booking.getUrlParam("productId",false)+
                "&ResourceId="+Booking.getUrlParam("resourceId",false)+"&SupplyId="+Booking.getUrlParam("supplyId",false)+
                "&minday="+Booking.hidWifiPackage || $("#minDay").val();;
            // var url = "/localfun/AjaxHelperWanLe/WanLeCalData?"+param;
            var url = Booking.host + "/wanle/api/WanleBookAjax/GetPriceCalendar?siteType="+ Booking.sitType +param;
            var date = this.getAttribute("data-date");
            calendar1.init({
                date: date,
                url: url,
                title: "订单填写",
                tag: 'calendar1',
                name: 'calendar1',
                beforeRender:function(){
                    var receiveType = parseInt($("#receiveType").val());
                    data.receiveType = receiveType;
                }
            });
            Common.redirect({
                tag: 'calendar1',
                title: "选择日期"
            });
        });

        $(document).on("click","#J_sendTime",function(){
            if(Booking.hidWifiPackage){
                return;
            }
            Booking.chooseDate = Booking.chooseDate || "";
            var param = "&ProductId="+Booking.getUrlParam("productId",false)+
                "&ResourceId="+Booking.getUrlParam("resourceId",false)+"&SupplierRelationId="+Booking.getUrlParam("supplyId",false)+
                "&minday="+$("#minDay").val()+"&maxday="+$("#maxDay").val()+"&chooseDate="+Booking.chooseDate;
            //var url = Config.getInterface("WanLeCalData","touch",Booking.extraHost)+param;
            var url = Booking.host + "/wanle/api/WanleBookAjax/GetPriceCalendar?siteType="+ Booking.sitType +param;
            var date = this.getAttribute("data-date");
            calendar2.init({
                date: date.Data,
                url: url,
                title: "订单填写",
                tag: 'calendar2',
                name: 'calendar2',
                beforeRender:function(){
                    var receiveType = parseInt($("#receiveType").val());
                    data.Data.receiveType = receiveType;
                }
            });
            Common.redirect({
                tag: 'calendar2',
                title: "选择日期"
            });
        });

        $(document).on("click",".J_price_count",function(){
            if(self.isOpen){
                self.isOpen = false;
                dialog.close();
                $(this).removeClass("price-count-active");
                $(".auction-money-wrap").css({"zIndex":"0","position":"fixed","bottom":"0"});
            }else{
                self.isOpen = true;
                dialog.open();
                $(this).addClass("price-count-active");
                $(".auction-money-wrap").css({"zIndex":"100000","position":"fixed","bottom":"0"});
            }
        });
        $(document).on("click",".button-minus,.button-plus",function(){

            var el = $(this),
                parent = el.parent(),
                inputEl = parent.children("input"),
                min = $("#BookMin").val()||0,
                max = inputEl.attr("max")||99,
            //min = $("#BookMin").val(),
            //max = $("#BookMax").val(),
                num = parseInt(inputEl.val()),
            //btnMin = parent.children(".button-minus"),
            //btnMax = parent.children(".button-plus"),
                btnMax = $(".button-plus"),
                dataCtrl = el.attr("data-ctrl"),
                flagAddClass = false,
                btnMin,
                currResult  = Common.eva(num+dataCtrl);
            Booking.InitHongBao();  //每次改变了总价格，红包都会受影响；
            var result = Common.eva(Booking.getAllPerson()+dataCtrl);
            //var act_now = Common.eva(Booking.getAllPerson());

            if(el.hasClass("button-minus") && el.hasClass("off")){
                if(result < min){
                    Booking.tip("最少预订"+min+"台");
                    return;
                }else{
                    return;
                }

            } else if(el.hasClass("button-plus") && el.hasClass("off")){
                Booking.tip("最多预订"+max+"台");
            } else if(el.hasClass("button-plus")){
                flagAddClass = true;
            }

            //var result  = Common.eva(num+dataCtrl);
            //Booking.InitHongBao();  //每次改变了总价格，红包都会受影响；

            if(flagAddClass){
                el.siblings(".button-minus").addClass("J_canChange");
            }
            btnMin = $(".J_canChange");
            if(result>=min&&result<=max){
                inputEl.val(currResult);
                Booking.goTravelCount = result;
                Booking.goTravelList();
                if(result === min-0){
                    btnMin.addClass("off");
                    btnMax.removeClass("off");
                }else if(result === max-0){
                    btnMax.addClass("off");
                    btnMin.removeClass("off");
                }else{
                    btnMax.removeClass("off");
                    btnMin.removeClass("off");
                }
                if(currResult === 0){
                    el.addClass("off");
                }
                if($("#J_sendTime").length && $("#J_sendTime").html().length > 7){
                    Booking.count();
                } else if(!$("#J_sendTime").length){
                    Booking.count();
                }else{
                    Booking.getTotalPerson();
                }
            }

        });
        $(document).on("blur",".J_Number",function(e){
            var target = e.currentTarget,
                value = target.value,
                min = target.getAttribute("min")|| 0,
                max = target.getAttribute("max")||99,
                parent = $(target).parent(),
            //btnMin = parent.children(".button-minus"),
            //btnMax = parent.children(".button-plus");
                btnMax = $(".button-plus"),
                allSum = Booking.getAllPerson(),
                btnMin;
            value = value.replace(/[^\d]/g,"");
            if(value!=""){
                value=parseInt(value);
            }
            if(!value||value=="") {
                target.value = min;
                value = target.value;
                target.select();
            }
            if(value){
                $(target).siblings(".button-minus").addClass("J_canChange");
            }
            btnMin = $(".J_canChange");
            if(allSum >= max){
                target.value = value-(allSum - max);
                btnMin.removeClass("off");
                btnMax.addClass("off");
            }else if(value <= min){
                target.value = min;
                btnMin.addClass("off");
                btnMax.removeClass("off");
            }else{
                target.value=value;
                btnMin.removeClass("off");
                btnMax.removeClass("off");
            }

            Booking.goTravelCount = target.value;
            Booking.goTravelList();
            //Booking.count();
            if($("#J_sendTime").length && $("#J_sendTime").html().length > 7){
                Booking.count();
            } else if(!$("#J_sendTime").length){
                Booking.count();
            }
        });
        $(document).on("click",".J_price_count",function(){
            var self= this,moneyWrap = $("#J_MoneyWrap"),
                mask = $(".ui-mask");
            $(self).toggleClass("price-count-active");
            if(mask.length <1){
                mask = $("<div class='ui-mask'></div>").appendTo(".auction-money");
            }
            if(!self.isShow){
                var ddLen = moneyWrap.find("dd").length;
                moneyWrap.animate({
                    height: "auto"
                },300);
                self.isShow = true;
                mask.css("display","block");
            }else{
                moneyWrap.animate({
                    height: "0"
                },300);
                self.isShow = false;
                mask.css("display","none");
            }

        });
        $(".ctrl-submit").on("click",function(e){
            var allPerson = parseInt($("#AllPersons").val());
            var minPerson=parseInt($("#BookMin").val());
            var maxPerson=parseInt($("#BookMax").val());
            var unit="";
            //var NewAllPerson;
            //$(".button-content").each(function(){
            //    NewAllPerson += parseInt($(".J_Number").val());
            //
            //});
            //console.log(NewAllPerson);

            if($(".J_Number").length>0){
                unit=$(".J_Number")[0].getAttribute("attr-unit");
            }
            if(allPerson<minPerson){
                Booking.alert("当前预订数量小于"+minPerson+unit.replace("/","")+",不能进行预订哦。");
                return;
            }
            if(allPerson > maxPerson){
                Booking.alert("当前预订数量大于"+maxPerson+unit.replace("/","")+",不能进行预订哦。");
                return;
            }
            //校验是否为负值,如果为负,则转为绝对值
            $(".J_Number").each(function(i,n){
                if(n.value-0 < 0){
                    n.value = Math.abs(n.value-0);
                }
            });
            //如果输入的值等于预设值,并且不为空,则不验证手机号
            //if (phone.val() === defaultPhone && defaultPhone) {
            //    phone.attr("data-checktype", "");
            //}
            var self = this,
                flag = Booking.checkInput(".J_CheckInput");
            if(!flag.status){
                var el = flag.el;
                Booking.alert(flag.text||el.getAttribute("placeholder"));
                e.preventDefault();
                return;
            }
            Booking.submitData(e,self);

        });

        $(".action").each(function(){
            var me = $(this);
            $(".action__title",me).on("click",function(){
                me.toggleClass("action-active");
            });
        });

        $(".J_pay").on("click",function(){
            var self = $(this);
            if(self.hasClass("selected")){
                self.removeClass("selected");
            } else {
                self.addClass("selected");
            }
        });

        $(".J_deposit").on("click",function(){
            var self = $(this);
            if(self.hasClass("selected")){
                return;
            } else {
                self.addClass("selected");
                self.parent().siblings("li").find(".lie-right").removeClass("selected");
            }
            Booking.count();
        });

         $(".J_agreement").click(function(){
            var content = $('.J_concat_pop').html();
            var wrap = $("<div><div class='J_tipSlide'><h3 class='tip-title'>预订须知和委托代订协议</h3><div class='tip'></div></div></div>");
            Booking.pop(content,wrap);
        });

        $(".J_insure label").click(function(){
            var content = $('.J_insure_pop').html();
            var wrap = $("<div><div class='J_tipSlide'><h3 class='tip-title'>"+Booking.InsuranceName+"</h3><div class='tip'></div></div></div>");
            Booking.pop(content,wrap);
        });
        $(document).on("click",".J_insure em",function(){
            var self = $(this);
            if(self.hasClass("selected")){
                self.removeClass("selected");
                $("#J_cert").attr("data-checktype","");
                Booking.count();
            } else {
                self.addClass("selected");
                $("#J_cert").attr("data-checktype","identityCard");
                Booking.count();
            }
        });
    };
    Booking.submitData = function(e,el){
        //var Mobile = require("tc/common/common");
        var index = 0;

        if(Booking.isSubmit){
            index++;
            if(index >5){
                if(!Booking.isSendMessage){
                    Monitor.log("该用户按了5次以上按钮");
                    Booking.isSendMessage = false;
                }
            }
            e.preventDefault();
            return;
        }
        $(el).text("正在提交...");
        Booking.isSubmit = true;
        var ProductId=$("#ProductId").val(),
            StartDate=$("#StartDate").val(),
            ReMark="",
            ContactPerson=$("input[name=ContactPerson]").val(),
            ContactMoblie=$("input[name=ContactMoblie]").val(),
            ContactMail=$("input[name=ContactMail]").val(),
            ReceivcePlace = $(".pick_address em").html() || "",
            ReturnPlace = $(".send_address em").html() || "",
            PostAddress = Booking.postJson,
            InvoicePostAddress = Booking.invoice_postJson;
        //PostAddress = $(".J_address1").length ? $(".J_address1").attr("post_address") + "###"+$(".J_address2").attr("post_num") || "":"",
        //PostPerson = $(".J_address2").attr("post_name") || "";
        if($(".J_DayNumber").length>0){
            var days=$(".J_DayNumber")[0].value-1;
            var reg=new RegExp("-","g");
            StartDate=StartDate.replace(reg,"/");
            var date=StartDate.split('/');
            if(date.length==3){
                var newdate=new Date(date[0],date[1]-1,date[2]);
                var EndDate=Booking.addDays(newdate,days);
            }else{
                var EndDate=StartDate;
            }
        }else{
            var EndDate=StartDate;
        }
        if($(".J_Tips").length>0){
            ReMark=$(".J_Tips")[0].value;
        }
        var allPerson=$("#AllPersons").val();
        var priceInfo="[";
        var numberEls = $(".J_Number");
        var count=0;
        for (var i = 0, len = numberEls.length - 1; i <= len; i++) {
            if(numberEls[i].value>0){
                priceInfo+="{'priceId':'"+numberEls[i].getAttribute("priceid")+"',"+"'PersonCount':'"+numberEls[i].value+"'}";
                count+=parseInt(numberEls[i].value);
                if(count<allPerson){
                    priceInfo+=",";
                }
            }
        }
        priceInfo+="]";
        var DeviceId="",
            SessionId="",
            ResourceId=Booking.getUrlParam("resourceId",false);
        Booking.getDeviceId(function(deviceId,sid) {
            DeviceId=deviceId||"";
            SessionId=sid||"";
        });
        EndDate = Booking.chooseDate2 || Booking.chooseDate;
        if(Booking.hidWifiPackage){
            EndDate = $("#J_sendTime").text();
        }
        var url = Booking.host + "/wanle/api/WWanleBook/WanLeSubOrder";
        // var url = "http://wjy.ly.com/wanle/api/WWanleBook/WanLeSubOrder";
        //如果是非wifi
        if($("#J_sendTime").length < 1){
            EndDate = "1900/01/01";
        }

        var OrderData_noPost="{"+"'LineId':'"+ProductId+"','StartDate':'"+Booking.chooseDate+"','Remark':'"+ReMark+
            "','Prices':"+priceInfo+",'EndDate':'"+EndDate+"','ContactPerson':'"+ContactPerson+
            "','ContactMoblie':"+ContactMoblie+",'ContactMail':'"+ContactMail+
            "','ReceivcePlace':'"+ReceivcePlace+
            "','ReturnPlace':'"+ReturnPlace+"','LinkerList':"+JSON.stringify(Booking.travelPeople);

        var OrderData_post = OrderData_noPost + ",'PostInfo':" + PostAddress;

        var params = (Booking.postJson && Booking.postJson != "")?OrderData_post:OrderData_noPost;

        //押金，红眼航班
        if($(".auction-deposit") && $(".auction-deposit").length){
            var IsWifiDeposit = $(".auction-deposit .selected").attr("data-value") || false ;
            params = params+",'IsWifiDeposit':"+IsWifiDeposit;
        }
        
        if($(".auction-redFlight .selected").hasClass("J_notRedFlag")){
            params = params+",'RedFlight':''";
        } else  if($(".auction-redFlight .selected").siblings().length) {
            params = params+",'RedFlight':'"+$(".auction-redFlight .selected").siblings().text().trim() +"'";
        }

        if(Booking.GetOtherInfo().replace(/\{\}/,true) !== "true"){
            params = params+",'OtherInfo':'"+Booking.GetOtherInfo()+"'";
        }

        if(Booking.hidWifiPackage){
            params = params+",'WifiPackageDays':"+Booking.hidWifiPackage+"";
        }

        if($(".J_insure").length && $(".J_insure").find(".selected").length && Booking.InsuranceCode){
            params = params+",'CancelInsuCode':"+Booking.InsuranceCode+",'IsHaveInsurance':true,'ContactIdentityCard':'" + $("#J_cert").val() + "'";
        }

        if(parseInt(Booking.discountAmount)){
            params = params +",'NewPreferentialInfo':" + JSON.stringify(Booking.preferentialInfo)+"}";
        } else {
            params = params +"}";
        }

        var params= {"OrderData":params};
        $.ajax({
            url: url,
            type:"POST",
            dataType:"json",
            data:params,
            success: function (data) {
                var data = data.Data;
                //发票提交
                var dataurl = data.url;
                //var get_addressInfo = $(".detail-address").attr("addressInfo_all").replace(/'/g, '"');
                if($(".isneed_invoice").length){
                    if($(".isneed_invoice").hasClass("noneed")){
                        window.location.href = dataurl;
                        return;
                    }else{
                        var get_addressInfo =JSON.parse($(".detail-address").attr("addressinfo_all").replace(/'/g, '"'));
                        //console.log(get_addressInfo.CityName);
                        var get_invoice = "";
                        $(".invoice_type").each(function(){
                            if($(this).find("i").hasClass("selected")){
                                get_invoice = $(this).find("i").attr("data-desc");
                            }
                        })


                        data2 = JSON.stringify({
                            "Customerialid":data.customerSerialid,
                            "AddressId":0,
                            "IsEveryOneInvoice": 0,
                            "IsEveryOneTitle": 0,
                            "InvoiceInsideNumber": Booking.replaceSign($(".invoice_title").val()),
                            // "InvoiceContent": $(".select_invoiceType em").attr("data-desc"),
                            "InvoiceContent":get_invoice || "",
                            "AddressMobile": get_addressInfo.PostMobile,
                            "AddressName": get_addressInfo.PostPerson,
                            "ProvinceId": get_addressInfo.ProvinceId,
                            "ProvinceName": get_addressInfo.ProvinceName,
                            "CityId": get_addressInfo.CityId,
                            "CityName": get_addressInfo.CityName,
                            "RegionId": get_addressInfo.RegionId,
                            "RegionName": get_addressInfo.RegionName,
                            //"SpecificAddress": $(".J_address3").attr("post_address")
                            "SpecificAddress": get_addressInfo.PostAddress
                        });
                        $.ajax({
                            url: Booking.host + "/wanle/api/WanleBookAjax/SaveInvoiceMessage",
                            // url: 'http://wjy.ly.com/wanle/api/WanleBookAjax/SaveInvoiceMessage',
                            dataType: "json",
                            type: "POST",
                            data: JSON.parse(data2),
                            success:function(data){
                                window.location.href = dataurl;
                                return;
                            },
                            error:function(){
                                window.location.href = dataurl;
                                return;
                            }
                        });
                    }
                }else{
                    window.location.href = dataurl;
                    return;
                }

            //Booking.isSubmit=false;
            //$(".ctrl-submit").text("提交订单");
            //location.href = data.url;
            //if( data.orderId > 0 && $("#KeyFlag").val() == 0){
            //    location.href = data.url;
            //}
            }
        });

    };
    /**
     * @func checkInput
     * @desc 输入框的正则验证,首先检测sel对应的input是否存在,
     * 然后判断,input是否有data-checktype属性,
     * 如果没有,则不做验证.
     * 验证如果失败,则显示checkList上的对应文案,如果没有找到对应文案,则调用placeHolder上的文案
     * @param {string} sel 选择器
     * @returns {object} ret
     * @example
     * //返回值有两种:
     * {status:true} //成功
     * {el:el,status:false,text:msg} //失败时候多返回验证失败的节点,和文案
     */

    var checkList = {
        "phone": {
            reg: "^1[3,4,5,7,8][0-9]{9}$",
            text: "请正确填写手机号"
        },
        "name": {
            reg: "^[\u4e00-\u9fa5\/A-Z]+$",
            text: "请正确填写联系人姓名"
        },
        "": {
            reg: ".*"
        },
        "mail": {
            reg: "^[\\w0-9]+([._\\-]*[\\w0-9])*@([\\w0-9]+[-\\w0-9]*[\\w0-9]+.){1,63}[\\w0-9]+$",
            text: "请正确填写邮箱"
        },
        "notnull": {
            reg: ""
        },
        "zheng_taiwan":{
            reg: /^(\w){5,15}$/,
            text: "请正确填写台湾通行证"
        },
        "english":{
            reg: "^[a-zA-Z\@\#\$%\^&\*\;\'\<\>\.\]{1,}$",
            text: "请正确填写英文"
        },
        "identityCard": {
            reg: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
            text: "由于购买取消险需要，请填写联系人的身份证件号！"
        }
    };
    Booking.checkInput = function(sel,flag){
        var els = $(sel),type,reg,el,value,
            pickIsSelected = $(".pick_address em"),
            sendIsSelected = $(".send_address em"),
            writeSelected = $(".post-address"),
            sendTime = $("#J_sendTime");
        if(!flag){
            if(sendTime.length && sendTime.html().length <= 7){
                return {el:sendTime,status:false,text:"亲，请选择还件日期"};
            }
            if(pickIsSelected.length && pickIsSelected.html().trim() == pickIsSelected.attr("data-desc").trim()){
                return {el:pickIsSelected,status:false,text:"亲，请选择取件点"};
            }
            if(sendIsSelected.length && sendIsSelected.html().trim() == sendIsSelected.attr("data-desc").trim()){
                return {el:sendIsSelected,status:false,text:"亲，请选择还件点"};
            }
            if(writeSelected.length && !(writeSelected.hasClass("none")) && (writeSelected.html().trim().length <= 0)){
                return {el:writeSelected,status:false,text:"亲，请选择邮寄地址"};
            }
            //如果出游人必填，把这个放出来就好了，现在是不必填
            // if($(".travel-persons").length > 0 && !($(".travel-persons").hasClass("none"))){
            //     var flag = false,
            //         alertInfo;
            //     $(".travel-persons li").each(function(i,elem){
            //         var _cur = $(elem).find("em");
            //         if(_cur.html() == _cur.attr("data-desc")){
            //             alertInfo={el:$(elem),status:false,text:"亲，请填写"+ $(elem).find("label").html()};
            //             flag = true;
            //             return false;
            //         }
            //     });
            //     if(flag){
            //         return alertInfo;
            //     }
            // }
        }
        for(var i= 0,len= els.length-1;i<=len;i++){
            el = els[i];
            type = el.getAttribute("data-checktype")||"";
            if(type == "notnull" && $(".cert_id_type .J_EditTravel").val() == "入台证") {
                type = "zheng_taiwan";
            }else if(type == "notnull" && $(".cert_id_type .J_AddTravel").val() == "入台证"){
                type = "zheng_taiwan";
            }
            var item = checkList[type];
            reg = item.reg;
            value = el.value;
            if(value == "入台证"){
                value = $(".J_EditTravel.card_number").val() || $(".J_AddTravel.card_number").val();
            }
            if(type === "notnull" && !value.trim()){
                return {el:el,status:false,text:el.getAttribute("attr-tips")};
            } else if(!new RegExp(reg).test(value)){
                var msg = value.trim()? item.text: el.getAttribute("attr-tips");
                return {el:el,status:false,text:msg};
            }
        }

// else if($(".select_invoiceType").text().trim() == "请选择发票内容")
        if(!flag){
            if($(".isneed_invoice").length && !$(".isneed_invoice").hasClass("noneed")){
                if(!$(".invoice_title").val().trim().length){
                    return {el:$(".invoice_title"),status:false,text:"亲，请填写发票抬头"};
                } else if(!$(".invoice_type i").hasClass("selected")){
                    return {el:$(".select_invoiceType"),status:false,text:"亲，请选择发票内容"};
                } else if($(".invoice-address em").attr("data-desc").trim() == "请选择邮寄地址"){
                    return {el:$(".invoice-address em"),status:false,text:"亲，请选择邮寄地址"};
                }
            }
        }

        return {status:true};
    };
    /**
     * @func alert
     * @desc 弹窗提示,基于dialog组件
     * @param text 弹窗的内容
     * @param title 弹窗的标题
     */
    Booking.alert = function(text,title){
        var cfg = {
            content: text,
            buttons: {
                '确定': function () {
                    this.close();
                }
            }
        };
        if(title) {
            cfg.title = title;
        }
        var d = $.dialog(cfg);
        d.open();
    };

    Booking.tip =  function(msg){
        var timer = null,
            _self = $("body"),
            offset = _self.offset(),
            tipEl = $(".fail"),
            elemH = _self.height()/2 - 10;
        $(".show-fail").css("display","block");
        getLocation(_self,offset,tipEl,elemH);

        function getLocation(_self,offset,tipEl,elemH){
            if(timer){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    tipEl.css("opacity",0);
                    timer = null;
                    $(".show-fail").css("display","none");
                },2500);
                return;
            }
            tipEl.css({
                opacity: 0,
                left: offset.left +_self.width()/3,
                top: "100%"
            });
            tipEl.html(msg);
            tipEl.animate({top : $(window).scrollTop()+ elemH+"px",opacity: 1},"ease-in-out",200,function(){
                var self = tipEl;
                timer = setTimeout(function(){
                    self.css("opacity",0);
                    self.css("top","0");
                    timer = null;
                    $(".show-fail").css("display","none");
                },2500);
            });
        }

    }

    Booking.init = function(cfg) {
        var self = this;
        if (cfg && cfg.FangZhua) {
            window.isFangZhua = 1;
            $.td(function() {
                self._init(cfg);
            })
        } else {
            self._init(cfg);
        }
    };

    /**
     * @func init
     * @desc 下单页的脚本初始化,钩子
     * @param {object} cfg 请求下单页借口所需要的参数
     */
    Booking._init = function(cfg){
        var self = this;

        //重置提交按钮的状态和文案
        self.isSubmit = false;
        $(".ctrl-submit").text("立即支付");
        self.initEnv();
        var defaultCfg = {
                reqData: "main|insurance|cancelInsurance|notice|cal|redbag"
            },
            _cfg = $.extend(defaultCfg,cfg),
            param = $.param(_cfg);
        globalCfg = _cfg;
    };
    /**
     * @private
     * @func getUrlParam
     * @desc 从url里获取key值对应的value
     * @param {string} key
     * @returns {string} 对应的value
     */
    Booking.getUrlParam = function(key){
        var url = location.search;
        if(url.indexOf(key)>-1){
            var regx = new RegExp(key+"=([^&]+)"),
                _arr = regx.exec(url);
            if(_arr && _arr[1]){
                return _arr[1];
            }
        }
    };
    /**
     * @func count
     * @desc 根据页面隐藏域里的数据,计算并更新页面所有位置的价格信息
     */
    Booking.count = function() {
        var priceEls = $(".J_Price"),
            numberEls = $(".J_Number"),
            insuEl = $(".accident .J_Insu"),
            cancelInsuEl = $(".cancel .J_Insu"),
            priceTypeEls = $(".J_PriceType"),
            insu = insuEl.text() || 0,
            cancelInsu = cancelInsuEl.text() || 0,
            moneyPanel = $("#J_MoneyWrap").find("dl"),
            priceEl, price,
            count = 0, item,
            priceTypeEl,
            priceType,
            itemVal, totalPerson = 0,
            discount = 0,
        //todo 暂时关闭现金券的使用
            isLogin = false,
        //有效的统计数量
            aTotalPerson = 0,
            type,
            oPerson = {},
            $homeId = $("#HomeId"),
            $title = $(".action__title .price"),
            moneyDD = moneyPanel.find("dd");
        moneyDD.remove();
        
        //先去除所有的价格体系id
        var priceIds = [], priceCounts = [],
            priceTextContext = [],
            priceUnitContext = [];

        Booking.allOrderDay = 1;
        for (var i = 0, len = numberEls.length - 1; i <= len; i++) {
            item = numberEls[i];
            priceEl = priceEls[i];
            price = priceTextContext[i] || $(priceEl).attr("data-price") || priceEl.textContent;
            priceTypeEl = priceTypeEls[i];
            priceType = $(priceTypeEl).attr("data-name") || priceTypeEl.textContent;
            itemVal = Math.abs(item.value - 0);
            if (item) {
                if (item.value === "0") {
                    continue;
                }
                count += price * itemVal;
                if (priceTypeEl.getAttribute("data-iscount") !== "0") {
                    aTotalPerson += itemVal;
                    if (insu) {
                        count += itemVal * insu;
                    }
                    if (cancelInsu) {
                        count += itemVal * cancelInsu;
                    }
                }

                if(parseInt($("#ProdcutType").val()) === 9 && parseInt($("#ProdcutCategory").val()) === 92){
                    var orderDay = ((+new Date(Booking.chooseDate2)) - (+new Date(Booking.chooseDate)))/1000/60/60/24 + 1 || 0;

                    var days =Booking.hidWifiPackage ? Booking.hidWifiPackage: orderDay;
                    if(days === 0){
                        count = 0;
                    }
                    Booking.allOrderDay = Booking.hidWifiPackage ? Booking.hidWifiPackage: orderDay ;
                    if(days){
                        moneyPanel.append("<dd><label>" + $(".title").html() + "</label><span>￥<em class='J_UnitPrice'>" + price+"("+days+"天)</em>x<em>" + itemVal + "台</em></span></dd>");
                    }
                    $(".rent-day").removeClass("none").find("em").html(days);
                } else {
                    moneyPanel.append("<dd><label>" + priceType + "</label><span>￥<em class='J_UnitPrice'>" + price+(item.getAttribute("attr-unit")=="/"?"":item.getAttribute("attr-unit"))+ "</em>x<em>" + itemVal + "</em></span></dd>");
                }
                priceUnitContext.push(price);
                totalPerson += itemVal;
                var _disc = priceTypeEl.getAttribute("data-discount") || 0;
                if (_disc && isLogin) {
                    discount += (_disc - 0) * itemVal;
                    count -= (_disc - 0) * itemVal;
                }
                priceIds.push(priceTypeEl.getAttribute("data-id"));
                priceCounts.push(itemVal);
                //乘客类型
                type = priceTypeEl.getAttribute("data-type");
                if (type === "1") {
                    type = "adult";
                }
                if (type === "2" || type === "8") {
                    type = "child";
                }
                oPerson[type] == null && (oPerson[type] = 0);
                oPerson[type] += (+item.value);
            }
        }

        //第一次计算价格时不需要在计算取消险Booking.insureFlagFirst
        // Booking.insure(count,Booking.chooseDate);
        // if(!Booking.insureFlagFirst && $(".J_insure").length && $(".J_insure").find(".selected").length){
            
        if(!Booking.insureFlagFirst && $(".J_insure").length){
            Booking.insure(count,Booking.chooseDate);
            // return;
        } else if(Booking.insureFlagFirst && $(".J_insure").length){
            Booking.insureFlagFirst = false;
        }
        oPerson.child == null && (oPerson.child = 0);
        var priceStr = "PriceId=" + priceIds.join("|") + "&PersonCount=" + priceCounts.join("|"),
            priceStrEl = $("#J_PriceStr");
        priceStrEl && priceStrEl.val(priceStr);
        $homeId.val("");
        $title.html("");
        var totalPrice = $("#J_TotalPrice"),
            allPersonsEl = $("#AllPersons");
        if($(".auction-deposit").length && $(".auction-deposit").find(".selected").attr("data-value") == "true"){
            moneyPanel.append("<dd><label>押金</label><span>￥<em class='J_UnitPrice'>" + $("#Deposit").val()+"/台</em>x<em>" + itemVal + "台</em></span></dd>");
            count = count + $("#Deposit").val() * aTotalPerson;
        }

        Booking.allCount = count;
        Booking.aTotalPerson = aTotalPerson;

        //有首日免单的
        // if($(".discount-info").length && parseInt(Booking.discountAmount)){
        //     if($("#ProdcutType").val() == 9 && $("#ProdcutCategory").val() == 92){
        //         count = count - Booking.discountAmount * itemVal;
        //         moneyPanel.append("<dd><label>" + $(".discount-info label").attr("data-desc") + "</label><span><em class='J_UnitPrice'>-" + Booking.discountAmount+"</em>x<em>" + itemVal + "台</em></span></dd>");
        //     } else{
        //         count = count - Booking.discountAmount;
        //         moneyPanel.append("<dd><label>" + $(".discount-info label").attr("data-desc") + "</label><span><em class='J_UnitPrice'>-" + Booking.discountAmount+"</em></span></dd>");
        //     }
        // }
        //只有优惠立减的时候
        if($(".discount-info").length && parseInt(Booking.discountAmount)){
            count = count - Booking.discountAmount;
            moneyPanel.append("<dd><label>" + $(".discount-info label").attr("data-desc") + "</label><span><em class='J_UnitPrice'>-" + Booking.discountAmount+"</em></span></dd>");
        }

        if($(".J_insure").length && $(".J_insure").find(".selected").length && Booking.cancelInsurePrice > 0){
            count = count + Booking.cancelInsurePrice;
            moneyPanel.append("<dd><label>取消险</label><span>￥<em class='J_UnitPrice'>" + Booking.cancelInsurePrice+"</em></span></dd>");
        }
        totalPrice && totalPrice.text(count);

        allPersonsEl && allPersonsEl.val(aTotalPerson);

        var showPriceDetail = $(".price-count");
        if(count === 0){
            showPriceDetail.removeClass("J_price_count");
            showPriceDetail.find("i").css("display","none");
        } else {
            showPriceDetail.addClass("J_price_count");
            showPriceDetail.find("i").css("display","block");
        }
    };

    Booking.getTotalPerson = function(){
        var numberEls = $(".J_Number"),
            allTotalPerson = 0;
        for (var i = 0, len = numberEls.length - 1; i <= len; i++) {
            var itemVal,allPersons;
            allPersons = $("#AllPersons");
            itemVal = Math.abs(numberEls[i].value - 0);
            allTotalPerson += itemVal;
        }
        allPersons && allPersons.val(allTotalPerson);

    };

    Booking.getDeviceId = function(callback){
        //获取客户端的设备id
        var ua = navigator.userAgent,
            isApp = /TcTravel\/(\d+\.\d+\.\d+)/.test(ua);
        if(isApp){
            window._tc_bridge_public.cb_get_device_info = function (data) {
                var id = JSON.parse(data.CBData).deviceInfo.deviceId;
                var sid = JSON.parse(data.CBData).trackInfo.sessionId;
                callback(id,sid);
            };
            function get_device_info() {
                var jsonObj = {
                    "param": {
                        "tagname": "device_info"
                    },
                    "CBPluginName": "_tc_bridge_public",
                    "CBTagName": "cb_get_device_info"
                };
                window._tc_bridge_user.get_device_info(jsonObj);
            }
            get_device_info();
        } else {
            callback('','');
        }
    };

    /**
     * @desc 获取url参数
     * @param {string} name key值
     * @param {boolean|null} isLowerCase 是否将url转换成小写
     * @returns {null|string}
     */
    Booking.getParamFromUrl = function (name,isLowerCase) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var url = window.location.href;
        if(isLowerCase){
            url = url.toLowerCase();
        }
        var results = regex.exec(url);
        if (results == null) {
            return null;
        }
        else {
            return results[1];
        }
    };
    Booking.addDays=function(dd,dadd){
        var a = new Date(dd);
        a = a.valueOf();
        a = a + dadd * 24 * 60 * 60 * 1000;
        a = new Date(a);
        var m = a.getMonth() + 1;
        if(m.toString().length == 1){
            m='0'+m;
        }
        var d = a.getDate();
        if(d.toString().length == 1){
            d='0'+d;
        }
        return a.getFullYear() + "/" + m + "/" + d;

    };
    //获取所需出游人数列表
    Booking.goTravelList = function(){
        if($("#VisitorInfoNeed").val() == 2){
            var count = Booking.goTravelCount;
            if($(".travel-persons li").length <= count){
                goTravelList.length = count;
            } else {
                var newList = goTravelList,
                    downCount =  count - $(".travel-persons").length,
                    travelCount = downCount;
                for(var i = newList.length - 1; i >=0 &&　downCount > 0; i--){
                    if(newList[i] == undefined){
                        newList.splice(i,1);
                        downCount --;
                    }
                }
                for(var i = Booking.travelPeople.length - 1; i >=0 &&　travelCount > 0; i--){
                    if(Booking.travelPeople[i] == undefined){
                        Booking.travelPeople.splice(i,1);
                        travelCount --;
                    }
                }
                goTravelList = newList;
                goTravelList.length = count;
                Booking.travelPeople.length = count;
            }
            $(".travel-warm").find("em").html(count);
            var data = {};
            data.travels = goTravelList;
            if(!goTravelList.length){
                $(".travel-warm").addClass("none");
                $(".travel-persons").css("margin-bottom","0");
            } else {
                $(".travel-warm").removeClass("none");
                $(".travel-persons").css("margin-bottom","10px");
            }
            Common.render({
                key:"goTravel",
                data:data,
                context:".travel-persons ul",
                tmpl: tmplList,
                overwrite: true,
                callback: function () {
                }
            });
        }
    };
    Booking.postStyle = function(){
        $('.pick_address').on("click",function(){
            Common.redirect({
                tag:"pick_address",
                title: "取件点",
                afterFunc: function(){
                }
            });
        });

        $('.send_address').on("click",function(){
            Common.redirect({
                tag:"send_address",
                title: "还件点",
                afterFunc: function(){
                }
            });
        });

        //取还件地址
        $(".J_address li").on("click",function(){
            var self = $(this),
                selectedAddress,
                insertElem;
            self.parents(".J_address").find(".address-left").removeClass("selected");
            self.find(".address-left").addClass("selected");
            selectedAddress = self.find(".address-right").html();
            insertElem = "."+ self.parents(".J_address").attr("data-address");
            $(insertElem).find("em").html(selectedAddress).css("color","#333");
            history.go(-1);

        });

        //新增出游人
        $(".add_person_btn").on("click",function(){
            Booking.certJson = "";
            $("#add_personPage").find("input").val("");
            Common.redirect({
                tag:"add_person",
                title: "新增出游人",
                afterFunc: function(){
                }
            });
        });

        $(".person_lists .edit").on("click",function(){
            Common.redirect({
                tag:"edit_person",
                title: "编辑出游人",
                afterFunc: function(){
                }
            });
        });

        function getTravelList(params){
            var needCertType = $("#VisitorCertificateType").val().split(","),
                url = Booking.host + "/wanle/api/WanleBookAjax/GetContanctList?siteType="+ Booking.sitType +"&v="+new Date(),
                passNeedInfo = eval("("+$("#PassNeedInfo").html()+")");
            Common.getData(url,function(data){
                data = data.Data;
                data.VisitorCertificateType = needCertType;
                data.needData = passNeedInfo["fieldEn"];
                data.chineseData = passNeedInfo["fieldCn"];
                Common.render({
                    key:"travelList",
                    data:data,
                    context:"#choose_personPage .person_lists",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                        //隐藏已有的出游人
                        for(var i = 0; i < goTravelList.length; i++){
                            if(goTravelList[i] != undefined){
                                var curr = goTravelList[i].travelId;
                                $("#"+curr).parents("li").addClass("none");
                            }
                        }
                        //放出当前选中的出游人
                        var _i = parseInt(Booking.travelPerson) - 1,
                            curId = $($(".travel-persons li")[_i]).find("em").attr("data-travelid");
                        $("#"+curId).parents("li").removeClass("none");
                        if(params !== undefined){
                            Common.redirect({
                                tag:"choose_person",
                                title: "选择出游人",
                                afterFunc: function(){
                                    Common.reflow(".person_subBox");
                                    var travelId = params.find("em").attr("data-travelId") || "";
                                    if(travelId != null || travelId != ""){
                                        $("#"+travelId).addClass("selected");
                                    }
                                }
                            })
                        }

                    }
                });
            });
        }
        //选择出游人
        $(document).on("click",".travel-persons li",function(){
            var self = $(this);
            Booking.travelPerson = $(this).attr("data-index");
            getTravelList(self);
        });

        $(document).on("click",".person_lists .address-left",function(){
            var self = $(this),
                parent = self.parents("ul"),
                index = Booking.travelPerson - 1,
                fillElem = $($(".travel-persons li")[index]).find("em"),
                travelId = self.attr("id"),
                travelName = self.siblings(".person_name").html();
            if(self.siblings("input").hasClass("J_notSelected")){
                return;
            }
            Booking.travelPeople[index] = eval("("+self.siblings(".edit").attr("data-order")+")");
            parent.find(".address-left").removeClass("selected");
            self.addClass("selected");
            fillElem.html(travelName).css("color","#333");
            fillElem.attr("data-travelId",travelId);
            $("#choose_personPage").find(".address-left").removeClass("selected");
            //填充goTravelList
            var nowObj = {
                travelId : travelId ,
                travelName : travelName
            };
            goTravelList[index] = nowObj;
            Booking.goTravelList();
            history.go(-1);
        });

        //编辑出游人信息
        $(document).on("click",".person_lists .edit",function(){
            var _self = $(this),
                linkerId = _self.attr("data-linkerId"),
                _param = {
                    LinkerId: linkerId,
                    v: +new Date()
                },
                url = Booking.host + "/wanle/api/WanleBookAjax/GetContanctList?siteType="+ Booking.sitType +"&"+ $.param(_param);
            Booking.editTravelIndex = _self.attr("data-index");
            Booking.editTravelLinkId = linkerId;
            Booking.certJson  = _self.siblings("input").val().length > 0?eval("(" + _self.siblings("input").val()+ ")"):"";
            Common.getData(url,function(data){
                data = data.Data;
                data.showTravelInfo = eval("("+ $("#ShowTravelInfo").html() + ")");
                Common.render({
                    key:"editTravel",
                    data:data,
                    context:"#edit_personPage .personList",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                        $('.edit_birthday').date();
                    }
                });
            });
            Common.redirect({
                tag:"edit_person",
                title: "编辑出游人",
                afterFunc: function(){
                }
            });
        });

        //证件类型选择
        $(document).on("click",".cert_id_type",function(){
            var destParent = "#"+$(this).parents(".page").attr("id");
            if(Booking.certJson !== "" && Booking.certJson !== undefined){
                $(".J_card").find("li").each(function(i,elem){
                    var key = $(elem).find("label").html(),
                        value =  Booking.certJson[key] == undefined ? "" :Booking.certJson[key];
                    $(elem).find("input").val(value);
                })
            } else {
                $(".J_card").find("li").each(function(i,elem){
                    $(elem).find("input").val("");
                })
            }
            Common.redirect({
                tag:"card_type",
                title: "证件类型",
                afterFunc: function(){
                    Booking.clickType(".J_card",destParent+" .cert_id_type");
                }
            });
        });

        //性别选择
        $(document).on("click",".choose_sex",function(){
            var destParent = "#"+$(this).parents(".page").attr("id");
            Common.redirect({
                tag:"sex_type",
                title: "性别选择",
                afterFunc: function(){
                    Booking.clickType(".J_sex",destParent+" .choose_sex");
                }
            });
        });

        //选择国籍
        $(document).on("click",".addEdit_country",function(){
            var _parentAttr = $(this).parents(".page").attr("data-playPerson");
            if(_parentAttr === "add_person"){
                window.flagCount = 1;      //1表示新增出游人里的选择国籍
            } else {
                window.flagCount = 0;      //0表示编辑出游人里的选择国籍
            }
            Common.redirect({
                tag:"country",
                title: "国籍选择",
                afterFunc: function(){
                    Booking.countryAjax();
                }
            });
        });
        //添加，编辑出游人保存
        $(".J_travelSure").on("click",function(e){
            var editType = $(this).attr("data-flag"),
                elem,
                url;
            if(editType == "add"){
                elem = ".J_AddTravel";
                url = Booking.host + "/wanle/api/WanleBookAjax/AddContanct?siteType="+ Booking.sitType;
            } else {
                elem = ".J_EditTravel";
                url = Booking.host + "/wanle/api/WanleBookAjax/UpdateContanct?siteType="+ Booking.sitType;
            }
            var flag =  Booking.checkInput(elem,true);
            if(!flag.status){
                var el = flag.el;
                // Booking.alert("请正确输入证件号码");
                Booking.alert(flag.text);
                e.preventDefault();
                return;
            } else {
                var _siblings = $(this).siblings(".personList"),
                    length = _siblings.find("li").length,
                    _param = "{",
                    linkCertType = _siblings.find("input[name='CertType']").val() || "",
                    linkCertNum = _siblings.find("input[name='CertNum']").val() || "";
                _siblings.find("li").each(function(i,e){
                    var _elem = $(e),
                        _key = _elem.attr("data-submit"),
                        value = _elem.find("input").val();
                    if(_key === "DefaultCertType"){
                        value = "";
                    }
                    if(_key === "CertNo"){
                        value = "";
                    }
                    if(length === i){
                        _param = _param+'"'+ _key+'":"'+value+'"';
                    } else {
                        _param = _param+'"'+ _key+'":"'+value+'",';
                    }
                });

                _param = _param.substring(0,_param.length - 1);

                if(editType == "add"){
                    var certArr = [];
                    if(linkCertType !== ""){
                        certArr.push({
                            'CertType':linkCertType,
                            'CertNo' : linkCertNum,
                            'LinkerId' : Booking.editTravelLinkId

                        });
                    }
                    _param = _param + ',"LinkerNoList":'+JSON.stringify(certArr);
                    var postParam = _param + ',"B2cUserId":'+$("#UserId").val()+',"IsBulkUpdateCert":true}';
                    var param = {};
                    param.orderData = postParam;
                    $.ajax({
                        url: url,
                        dataType:"json",
                        type: 'POST',
                        data: param,
                        success: function (data) {
                            if(data.Status == "Success"){
                                getTravelList();
                                history.go(-1);

                            } else {
                                var msg = data.Status.ErrMsg,
                                    newMsg = msg.split(":")[0].replace("参数",msg.split(":")[1]);
                                Booking.alert(newMsg);
                            }
                        }
                    });

                } else {
                    var index = parseInt(Booking.editTravelIndex),
                        destElem = $($(".person_lists").find("li")[index]),
                        oldCertType = destElem.find("input").val().length > 0 ? eval("(" + destElem.find("input").val()+ ")") : "",
                        newCertType = oldCertType,
                        certArr = [];

                    if(newCertType !== {} && newCertType !== "" && linkCertType !== ""){
                        newCertType[linkCertType] = linkCertNum;
                        for(var i in newCertType){
                            certArr.push({
                                'CertType':i,
                                'CertNo' : newCertType[i],
                                'LinkerId' : Booking.editTravelLinkId

                            });
                        }
                    } else if(linkCertType === ""){
                        certArr = [];
                    }else {
                        newCertType = {};
                        newCertType[linkCertType] = linkCertNum;
                        certArr.push({
                            'CertType':linkCertType,
                            'CertNo' : linkCertNum,
                            'LinkerId' : Booking.editTravelLinkId

                        });
                    }

                    _param = _param + ',"LinkerNoList":'+JSON.stringify(certArr);

                    var postParam =  _param +',"LinkerId":'+Booking.editTravelLinkId+',"B2cUserId":'+$("#UserId").val()+',"IsBulkUpdateCert":true}';
                    postParam.OrderData = postParam;
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType:"json",
                        data: postParam,
                        success: function (data) {
                            if(data.Status !== "Success"){
                                var msg = data.Status.ErrMsg,
                                    newMsg = msg.split(":")[0].replace("参数",msg.split(":")[1]);
                                Booking.alert(newMsg);
                            } else {
                                getTravelList();
                                history.go(-1);
                            }
                        }
                    });



                }
            }
        });

        //得到邮寄列表
        function getPostList(){
            var _param = {
                    v: +new Date()
                },
                url = Booking.host + "/wanle/api/WanleBookAjax/GetAddressList?siteType="+ Booking.sitType +"&"+ $.param(_param);
            Common.getData(url,function(data){
                data.selected = $(".post-address .detail-address").attr("data-id") || 0;
                Common.render({
                    key:"postList",
                    data:data.Data,
                    context:"#post_addressPage .post_lists",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                    }
                });
            });
        }

        //选择邮寄地址
        $(".post-address .detail-address").on("click",function(){
            if(!Booking.detailAddress){
                getPostList();
            }
            Booking.detailAddress = true;
            Common.redirect({
                tag:"post_address",
                title: "选择邮寄地址",
                afterFunc: function(){
                }
            });
        });

        $(document).on("click",".post_lists .address-left",function(){
            var self = $(this),
                parent = self.parents("ul"),
                postAddress1 = self.siblings(".post_address1").html(),
                postAddressName = self.siblings(".post_name").html(),
                postAddressNum = self.siblings(".post_num").html();
            parent.find(".address-left").removeClass("selected");
            self.addClass("selected");
            $(".J_address1").html(postAddress1).attr("post_address",postAddress1);
            $(".J_address2").html(postAddressName+"&nbsp;收&nbsp;"+postAddressNum).attr("post_name",postAddressName).attr("post_num",postAddressNum);
            Booking.postJson = self.siblings(".post_address1").attr("data-address");
            history.go(-1);
        });

        //选择省市区
        // $(document).on("click",".J_address_select",function(){
        //     var _self = $(this),
        //         _sibling = $(this).parent().prev().find("input"),
        //         self_title = _self.attr("data-title"),
        //         self_fun = _self.attr("data-fun"),
        //         _index = parseInt(_self.attr("data-index")),
        //         _id,
        //         urlPram;
        //     Booking.postHtml = {
        //         postAddress: $(this).parent(".addEdit_postAddressPage").html(),
        //         index: _index
        //     };
        //     if(_sibling.hasClass("J_address_select")){
        //         _id = _sibling.attr("data-id");
        //         if(!(_sibling.val().trim().length)){
        //             Booking.alert(_sibling.attr("attr-tips"));
        //             return;
        //         }
        //     }
        //     for(var i=_index + 1; i < $(".J_address_select").length;i++){
        //         $($(".J_address_select")[i]).val("");
        //     }
        //     urlPram = _index?self_fun + "?" + (_index === 1 ? "provinceId" : "cityId") + "="+_id:self_fun;
        //     $.ajax({
        //         url: Booking.host + "/wanle/api/WanleBookAjax/" + urlPram,
        //         type: "get",
        //         dataType: "jsonp",
        //         success: function(data) {
        //             Common.render({
        //                 key: "addressSelectList",
        //                 data: data.Data,
        //                 context: ".J_citySelected ul",
        //                 tmpl: tmplList,
        //                 overwrite: true,
        //                 callback: function () {
        //                     Common.redirect({
        //                         tag:"J_citySelected",
        //                         title: self_title,
        //                         afterFunc: function(){
        //                         }
        //                     });
        //                 }
        //             });
        //         }
        //     });

        // });

        //填充省市区
        // $(document).on("click",".citySelectList li",function(){
        //     var addressName = $(this).html(),
        //         elem = $(".J_address_select"),
        //         operaElem = elem[Booking.postHtml.index];
        //     $(".addEdit_postAddressPage").html(Booking.postHtml.postAddress);
        //     $(operaElem).val(addressName);
        //     $(operaElem).attr("data-id",$(this).attr("data-id"));
        //     history.go(-1);

        // });


        //新增邮寄地址
        $(".add_post_address,.add_invoice_post_address").on("click",function(){
            var destElem = $("#addEdit_postAddressPage"),
                addressSelect = destElem.find(".J_address_select");
            Booking.addEditPost = 0; //0表示点击的新增
            destElem.find(".addPost_name").val("");
            destElem.find(".addPost_address").val("");
            destElem.find(".addPost_num").val("");
            addressSelect.val("");
            addressSelect.attr("data-provincename","");
            addressSelect.attr("data-cityname","");
            addressSelect.attr("data-regionname","");
            addressSelect.attr("data-provinceid","");
            addressSelect.attr("data-cityid","");
            addressSelect.attr("data-regionid","");
            Common.redirect({
                tag:"addEdit_postAddress",
                title: "新增邮寄地址",
                afterFunc: function(){
                }
            });
        });

        //新增编辑保存邮寄地址
        $(".J_addOrEditPost").on("click",function(e){
            var flag =  Booking.checkInput(".J_addPost_info",true);
            if(!flag.status){
                var el = flag.el;
                Booking.alert(flag.text||el.getAttribute("placeholder"));
                e.preventDefault();
                return;
            } else {
                var _parent = $("#addEdit_postAddressPage"),
                    destInfo = _parent.find(".J_address_select"),
                    postName = _parent.find(".addPost_name").val(),
                    postNum = _parent.find(".addPost_num").val(),
                    postAddress = _parent.find(".addPost_address").val(),
                    postProvinceName = destInfo.attr("data-provinceName"),
                    postProvinceId = destInfo.attr("data-provinceId"),
                    postCityName = destInfo.attr("data-cityName"),
                    postCityId = destInfo.attr("data-cityId"),
                    postdivisionName = destInfo.attr("data-regionName"),
                    postdivisionId = destInfo.attr("data-regionId"),
                    url,
                    params = {
                        "Name": postName,
                        "Mobile": postNum,
                        "StreetAddress": Booking.replaceSign(postAddress),
                        "ProvinceName": postProvinceName,
                        "ProvinceId": postProvinceId,
                        "CityName": postCityName,
                        "CityId": postCityId,
                        "RegionName": postdivisionName,
                        "RegionId": postdivisionId
                    };
                if(Booking.addEditPost === 0){  //0表示新增，1表示编辑
                    url = Booking.host + "/wanle/api/WanleBookAjax/AddAddress?siteType="+ Booking.sitType;
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType:"json",
                        data:params,
                        success: function (data) {
                            if(data && data.Status === "Success"){
                                getPostList();
                                getPostListInvoice();
                                history.go(-1);
                            } else {
                                Booking.alert(data.Status.ErrMsg);
                            }


                        }
                    });
                }else{
                    var index = Booking.editIndex;
                    params.AddressId = Booking.editAddressId;
                    url = Booking.host + "/wanle/api/WanleBookAjax/UpdateAddress?siteType="+ Booking.sitType;
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType:"json",
                        data:params,
                        success: function (data) {
                            if(data && data.Status === "Success") {
                                getPostList();
                                getPostListInvoice();
                                history.go(-1);
                            } else {
                                Booking.alert(data.Status.ErrMsg);
                            }
                        }
                    });
                }

            }
        });

        //编辑邮寄地址
        $(document).on("click",".J_edit",function(){
            var destElem = $("#addEdit_postAddressPage"),
                self = $(this),
                destInfo = destElem.find(".J_address_select"),
            //addressInfo = self.siblings(".post_address1").attr("data-address");
                addressInfo = JSON.parse((self.siblings(".post_address1").attr("data-address")).replace(/'/g, '"'));
            Booking.editIndex  = self.attr("data-index");
            Booking.editAddressId = self.attr("data-addressId");
            Booking.addEditPost = 1; //1表示点击的编辑

            destInfo.val(addressInfo.ProvinceName + addressInfo.CityName + addressInfo.RegionName);
            destInfo.attr("data-provinceName",addressInfo.ProvinceName);
            destInfo.attr("data-cityName",addressInfo.CityName);
            destInfo.attr("data-regionName",addressInfo.RegionName);
            destInfo.attr("data-provinceId",addressInfo.ProvinceId);
            destInfo.attr("data-cityId",addressInfo.CityId);
            destInfo.attr("data-regionId",addressInfo.RegionId);

            destElem.find(".addPost_name").val(self.siblings(".post_name").html());
            destElem.find(".addPost_address").val(self.siblings(".post_address1").attr("data-street"));
            destElem.find(".addPost_num").val(self.siblings(".post_num").html());
            Common.redirect({
                tag:"addEdit_postAddress",
                title: "编辑邮寄地址",
                afterFunc: function(){
                }
            });
        });
    };
    Booking.clickType = function(type,data){
        $(type+" li").on("click",function(){
            var self = $(this),
                selectedCountry;
            if($(type).hasClass("J_card")){
                selectedCountry = self.find("label").html();
                var destElem = $(data).parents(".page").find("input[name='CertNum']");
                destElem.val(self.find("input").val());
                destElem.attr("placeholder",self.find("input").val());
            } else {
                selectedCountry = self.html();
            }
            $(data).find("input").val(selectedCountry).css("color","#333");
            history.go(-1);
        });
    };
    Booking.countryAjax = function(){
        $.ajax({
            url:"http://member.ly.com/dujia/ajaxhandler/DujiaAjaxInterface.aspx?action=GETNATIONAL",
            dataType: 'jsonp',
            success:function(data){
                localData=data.airplaneCitys_national;
                var sug = new Suggest({
                    deal: function(data){
                        return  {
                            indexData: data.map(function(val){
                                return val.longName + " " +val.enName;
                            }),
                            data: data.map(function(val){
                                return val.cnName
                            })
                        };
                    },
                    elements: {
                        input: $(".searchbox input"),
                        wrap: $(".searchbox"),
                        close: $(".searchbox .cancel")
                    },
                    afterShow: function(){
                        $(".searchbox").removeClass("search-reset");
                    },
                    afterCancel: function(){
                        $(".searchbox").addClass("search-reset");
                    },
                    itemClick: function(el){
                        var cityName = el.attr("data-item");
                        location.href="/ivacation/"+cityName;
                    },
                    localStorageKey: "cj_history",
                    requestData: localData,
                    template: {}
                });
            }
        })
    };
    //有关优惠信息:红包必须登录，首日立减跟产品走，无需登录
    Booking.discount = function(){
        //var PreferentialType;
        //if($("#ProdcutType").val() == 9 && $("#ProdcutCategory").val() == 92){
        //    PreferentialType = 5;  //5是wifi的首日免单，目前老的预定页关掉，0是普通的,6什么都不是
        //} else {
        //    PreferentialType = 2;
        //}
        var v = +new Date(),
            url = Booking.host + "/wanle/api/WanleBookAjax/GetPreferentialInfo?siteType="+ Booking.sitType +"&"+
                "productId="+ $("#ProductId").val()+"&v="+v;

        Common.getData(url,function(data){
            data = data.Data;
            if(!data.length){
                $(".discount-info").addClass("none");
            } else {
                Booking.preferentialInfo = [];
                Booking.preferentialInfo.push({'RuleId': data[0].RuleId});
                data.allOrderDay =Booking.allOrderDay;
                if(Booking.allOrderDay === 0){
                    Booking.allOrderDay = Booking.hidWifiPackage > 0 ? Booking.hidWifiPackage:1;
                }
            }
            Booking.hongbaoList = data;
        });

        $('.use_hongbao').on("click",function(){
            if($("#J_TotalPrice").html() == 0 && ($(this).find("em").html() === "请选择") && (Booking.aTotalPerson == undefined || Booking.aTotalPerson > 0)){
                Booking.alert("请先选择时间");
                return;
            } else if($("#J_TotalPrice").html() == 0 && ($(this).find("em").html() === "请选择")){
                Booking.alert("请先选择数量");
                return;
            }
            var data = Booking.hongbaoList;
            data.allOrderDay = Booking.allOrderDay;
            data.amount = Booking.allCount || $("#J_TotalPrice").html();
            if($(".use_hongbao em").attr("data-desc") == "请选择"){
                Common.render({
                    key: "hongBaoList",
                    data: data,
                    context: "#pick_hongbaoPage ul",
                    tmpl: tmplList,
                    overwrite: true,
                    callback: function () {
                    }
                });
            }

            Common.redirect({
                tag:"pick_hongbao",
                title: "选择优惠",
                afterFunc: function(){
                }
            });
        });

        $(document).on("click",".J_hongbao li",function(){
            var self = $(this),
                selectedHongbao,
                fillElem = $(".use_hongbao").find("em");
            self.parents(".J_hongbao").find(".hongbao-left").removeClass("selected");
            self.find(".hongbao-left").addClass("selected");
            selectedHongbao = self.attr("data-desc");
            fillElem.html(selectedHongbao).attr("data-desc",selectedHongbao);
            if(!self.hasClass("no-hongbao")){
                fillElem.css("color","#333");
            } else {
                fillElem.css("color","#ccc");
            }
            if(self.hasClass("J_first")){
                Booking.discountAmount = Booking.firstAmount || $("#discountAmount").val();
            } else {
                Booking.discountAmount = self.attr("data-ParValue");
            }
            Booking.count();
            if(self.attr("data-desc") != "未使用优惠" && (self.attr("data-virtualCouponNo") != "")){
                Booking.preferentialInfo = [];
                Booking.preferentialInfo.push({
                    'RuleId': parseInt(self.attr("data-ruleId")),
                    'VirtualAmount': parseInt(self.attr("data-virtualAmount")),
                    'VirtualCouponNo': self.attr("data-virtualCouponNo")
                });
            } else if(self.attr("data-desc") != "未使用优惠"){
                Booking.preferentialInfo = [];
                Booking.preferentialInfo.push({
                    'RuleId': parseInt(self.attr("data-ruleId"))
                });
            }
            history.go(-1);
        });

    };
    //是否需要发票
    Booking.isNeed_invoice = function(){
        $(".isneed_invoice").on("click",function(){
            if($(".isneed_invoice").hasClass("noneed")){
                $(this).removeClass("noneed");
                $(this).find("span").addClass("selected");
                $(".invoice_none").removeClass("none");
            }else{
                $(".isneed_invoice").addClass("noneed");
                $(".isneed_invoice").find("span").removeClass("selected");
                $(".invoice_none").addClass("none");
                $(".invoice-address-detail").addClass("none");
            }

        });
    };
    //发票选择
    Booking.invoice = function(){
        $('.select_invoiceType').on("click",function() {
            Common.redirect({
                tag:"pick_invoiceType",
                title: "发票内容选择",
                afterFunc: function(){
                }
            });
        });
        $(".invoice_type").on("click",function(){
            $(".invoice_type i").removeClass("selected");
            $(this).find("i").addClass("selected");
            var chooseType_invoice = $(this).attr("data-desc");
            var chooseType_num = $(this).attr("data_typeid");
            // $(".invoice_type i").attr("data-desc","");
            $(this).find("i").attr("data-desc",chooseType_num);
            // $(".select_invoiceType em").html(chooseType_invoice);
            // $(".select_invoiceType em").attr("data-desc",chooseType_num);
            // $(".select_invoiceType em").css("color","#333");
            // history.go(-1);
        });
    };
    //选择发票邮寄地址
    //选择邮寄地址
    //得到邮寄列表
    function getPostListInvoice(){
        var _param = {
                v: +new Date()
            },
            url = Booking.host + "/wanle/api/WanleBookAjax/GetAddressList?siteType="+ Booking.sitType +"&"+ $.param(_param);
        Common.getData(url,function(data){
            Common.render({
                key:"postList",
                data:data.Data,
                context:"#invoice_post_addressPage .invoice_post_lists",
                tmpl: tmplList,
                overwrite: true,
                callback: function () {
                }
            });
        });
    }
    $(".invoice-address").on("click",function(){
        if(!Booking.detailAddress_invoice){
            getPostListInvoice();
        }
        Booking.detailAddress_invoice = true;
        Common.redirect({
            tag:"invoice_post_address",
            title: "选择邮寄地址",
            afterFunc: function(){
            }
        });
    });
    $(document).on("click",".invoice_post_lists .address-left",function(){
        var self = $(this),
            parent = self.parents("ul"),
            postAddress1 = self.siblings(".post_address1").html(),
            postAddressName = self.siblings(".post_name").html(),
            postAddressNum = self.siblings(".post_num").html();
        parent.find(".address-left").removeClass("selected");
        self.addClass("selected");
        //$(".J_address3").html(postAddress1);
        //$(".J_address4").html(postAddressName+"&nbsp;收&nbsp;"+postAddressNum);
        $(".J_address3").html(postAddress1).attr("post_address",postAddress1);
        $(".J_address4").html(postAddressName+"&nbsp;收&nbsp;"+postAddressNum).attr("post_name",postAddressName).attr("post_num",postAddressNum);
        Booking.invoice_postJson = self.siblings(".post_address1").attr("data-address");
        $(".detail-address").attr("addressInfo_all",Booking.invoice_postJson);
        $(".invoice-address em").html("");
        $(".invoice-address em").attr("data-desc","");
        $(".invoice-address-detail").removeClass("none");
        history.go(-1);
    });
    //初始化红包为未选择
    Booking.InitHongBao = function(){
        var dealElem = $(".hongbao");
        if(dealElem.length){
            dealElem.find(".use_hongbao em").attr("data-desc","请选择").html("请选择").css("color","#ccc");
            Booking.discountAmount = 0;
        }
    };

    //其他信息
    Booking.OtherInfo = function(){
        $(".J_inputInfo").on("click",function(){
            var self = $(this),
                _parent = self.parent(),
                _selfEm = self.find("em"),
                _iElem = self.children("i"),
                operateElem = $(".J_other_info");
            if(_selfEm.html() !== ""){
                _selfEm.html("");
            }
            if(_iElem.hasClass("unfold")){
                operateElem.removeClass("none");
                _iElem.removeClass("unfold").addClass("pick-up");
                _parent.removeClass("border-bottom");
            } else {
                operateElem.addClass("none");
                _iElem.removeClass("pick-up").addClass("unfold");
                _parent.addClass("border-bottom");
            }

            $(".auction-money-wrap").css({"position":"fixed","bottom":"0"});
        });
    };

    Booking.GetOtherInfo = function(){
        var _otherInfo = $(".J_other_info"),
            length = _otherInfo.find("input").length,
            _param = '{';
        _otherInfo.find("input").each(function(i,e) {
            var _elem = $(e),
                _key = _elem.attr("data-type");
            if(_key == "UserDefinedContent" && _elem.val().trim() !== ""){
                var _sibling = _elem.siblings(),
                    value = Booking.replaceSign(_elem.val());
                _param = _param + '"' + _sibling.attr("data-type") + '":"' + Booking.replaceSign(_sibling.html()) + '",';
            }else{
                value = Booking.replaceSign(_elem.val());
            }
            if (length === (i+1)) {
                if(value != ""){
                    _param = _param + '"' + _key + '":"' + value + '"';
                }
            }else {
                if(value != "") {
                    _param = _param + '"' + _key + '":"' + value + '",';
                }
            }
        });
        _param = _param + "}";
        return _param;
    };

    //将顾客输入的因为当引号换成中文的
    Booking.replaceSign = function(str){
        var strNew = str.replace(/\"/g,"”").replace(/\'/g,"’");
        return strNew;
    };
    Booking.getAllPerson = function(){
        var _parents = $(".J_Number").parents("ul"),
            _calElem = _parents.find("input"),
            _currentSum = 0;
        _calElem.each(function(i,e){
            var _value = parseInt($(e).val());
            if(_value){
                _currentSum = _currentSum + _value;
                $(e).siblings(".button-minus").addClass("J_canChange");
            } else {
                $(e).siblings(".button-minus").removeClass("J_canChange");
            }
        });
        return _currentSum;
    };

    //省市区
    Booking.city = function(){
        var provinceName,
            cityName,
            countryName,
            provinceId,
            cityId = 0,
            countryId;
            Booking.curProvinceId =  0,
            Booking.curCityId = 0 ,
            Booking.curRegionId = 0;
        $(document).on("click",".J_address_select",function(){
            var self = $(this);
            Booking.curProvinceId = self.attr("data-provinceid");
            Booking.curCityId = self.attr("data-cityid") ;
            Booking.curRegionId = self.attr("data-regionid");
            if($(".dialog_city").hasClass("none")){
                $(".dialog_city").removeClass("none");
                $(".ui-mask").css("display","block");
            } else {
                $(".dialog_city").addClass("none");
                $(".ui-mask").css("display","none");
            }
            $.ajax({
                url: Booking.host + "/wanle/api/WanleBookAjax/GetProvinceList",
                type: "get",
                dataType: "jsonp",
                success: function(data) {
                    data.Data.provinceId = Booking.curProvinceId;
                    Common.render({
                        key: "city",
                        data: data.Data,
                        context: ".J-left",
                        tmpl: tmplList,
                        overwrite: true,
                        callback: function () {
                            provinceName = self.attr("data-provincename") || data.Data[0].Name;
                            provinceId = Booking.curProvinceId || data.Data[0].Id;
                            getCity(provinceId);

                            new IScroll(".J-left", {
                                mouseWheel: true,
                                click: true
                            })
                        // Booking.Iscroll();    
                        }
                    });
                    
                }
            });

        });
        
        function getCity(provinceId){
            $.ajax({
                url: Booking.host + "/wanle/api/WanleBookAjax/GetCityListByProvinceId?provinceId="+provinceId,
                type: "get",
                dataType: "jsonp",
                success: function(data) {
                    var parElem = $(".J-center"),
                        tmpl = "",
                        name;
                    for(var i = 0;i < data.Data.length;i++){
                        name = data.Data[i].Name.length > 4?data.Data[i].Name.substring(0,4)+"...":data.Data[i].Name;
                        if((Booking.curCityId == 0 && i === 0) || Booking.curCityId == data.Data[i].Id){
                            tmpl = tmpl + ' <li class="selected" data-id="'+ data.Data[i].Id +'" data-name="'+data.Data[i].Name+'">'+name+'</li>';
                            cityName = data.Data[i].Name; 
                            cityId = data.Data[i].Id;
                        } else {
                            tmpl = tmpl + ' <li data-id="'+ data.Data[i].Id +'" data-name="'+data.Data[i].Name+'">'+name+'</li>';
                        }
                    }
                    parElem.find(".J-center ul").html(tmpl); 

                     new IScroll(".J-center", {
                        mouseWheel: true,
                        click: true
                    })   
                    getCounty(cityId);           
                }
            });
        }

        function getCounty(cityId){
            $.ajax({
                url: Booking.host + "/wanle/api/WanleBookAjax/GetCountyListByCityId?cityId="+cityId,
                type: "get",
                dataType: "jsonp",
                success: function(data) {
                    var curIndrect = $(".J-right"),
                        tmpl = '<ul class="city">',
                        name;
                    for(var i = 0;i < data.Data.length;i++){
                        name = data.Data[i].Name.length > 7?data.Data[i].Name.substring(0,7)+"...":data.Data[i].Name;
                        if(Booking.curRegionId == data.Data[i].Id){
                            tmpl = tmpl + '<li class="selected" data-id="'+ data.Data[i].Id +'">'+name+'</li>';
                        } else {
                            tmpl = tmpl + '<li data-id="'+ data.Data[i].Id +'" data-name="'+data.Data[i].Name+'">'+name+'</li>';
                        }
                    }
                    tmpl = tmpl + "</ul>";  
                    curIndrect.html(tmpl);
                    new IScroll(".J-right", {
                        mouseWheel: true,
                        click: true
                    })
                             
                }
            });
        }

        $(document).on("click tap",".J-left li",function(){
            var self = $(this);
            if(!self.hasClass("selected")){
                provinceId = self.attr("data-id");
                self.siblings().removeClass("selected");
                self.addClass("selected");
                provinceName = self.attr("data-name");
                getCity(provinceId);
            }
        });

        $(document).on("click tap",".J-center li",function(){
            var self = $(this);
            if(!self.hasClass("selected")){
                cityId = self.attr("data-id");
                self.siblings().removeClass("selected");
                self.addClass("selected");
                cityName = self.attr("data-name"); 
                getCounty(cityId);

                $(".J_address_select").attr("data-cityId",cityId);
            }
        });

        $(document).on("click tap",".J-right li",function(){
            var self = $(this);
            if(!self.hasClass("selected")){
                var countryId = self.attr("data-id"),
                    destInfo = $(".J_address_select");
                self.siblings().removeClass("selected");
                countryName = self.attr("data-name"); 
                self.addClass("selected");
                destInfo.val(provinceName+cityName+countryName);
                destInfo.attr("data-provinceName",provinceName);
                destInfo.attr("data-cityName",cityName);
                destInfo.attr("data-regionName",countryName);
                destInfo.attr("data-provinceId",provinceId);
                destInfo.attr("data-cityId",cityId);
                destInfo.attr("data-regionId",countryId);
                $(".dialog_city").addClass("none");
                $(".ui-mask").css("display","none");
            }
        });


    };
    
    //绑定滚动
    // Booking.Iscroll = function(){
    //     // iscroll 绑定
    //      Booking.leftScroll = new IScroll(".J-left", {
    //         mouseWheel: true,
    //         click: true
    //      })
    //      Booking.centerScroll = new IScroll(".J-center", {
    //         mouseWheel: true,
    //         click: true
    //      })
    //     Booking.rightScroll = new IScroll(".J-right", {
    //         mouseWheel: true,
    //         click: true
    //      })
    
    // };
    
    Booking.pop = function(content,text){
            if(!content){
                Booking.alert("预订须知的数据不存在");
                return;
            }
            notice = content.replace(/(<br\/?>)/g,"$1$1");
            //侧滑
            var wrap = text;
            wrap.find(".tip").html(content);
            var dialog = $.dialogold({
                width: "100%",
                height: "100%",
                mask: true,
                buttons: {
                    '<i></i>': function () {
                        this.close();
                        $(".ui-mask").remove();
                        $(".ui-mask_old").remove();
                        $(".ui-dialog").remove();
                        $(".ui-dialog_old").remove();
                    }
                },
                content: wrap.html(),
                afterOpen: function () {
                    var iscroll = new IScroll($(".ui-dialog-content")[0], { mouseWheel: true, disableMouse: false, click: true });
                }
            });
            dialog.open();
    };
    //保险信息
    Booking.insure = function(amount,startDate){
        var amount = amount || $("#totalPrice").val(),
            startDate = startDate || $("#StartDate").val(),
            url = Booking.host + "/wanle/api/WanleProduct/GetWanleInsuranceList?ProductId="+ $("#ProductId").val()+"&OrderAmount="+amount+"&StartDate="+startDate;
        if(Booking.compareTime(startDate)){
            if(Booking.insuranceList && Booking.insuranceList.length){
                getCurrentInsure(Booking.insuranceList);
                    Booking.insureFlagFirst = false;
            } else{
                Common.getData(url,function(data){
                    var insuranceList = data.Data.ProductInsuranceList;
                    Booking.insureFlagFirst = true;
                    Booking.insuranceList = insuranceList;
                    getCurrentInsure(insuranceList);
                    if(!Booking.initInsure){
                        Booking.count();
                    }
                });
            }
        } else {
            $("#J_cert").parents("li").addClass("none");
            $(".J_insure").addClass("none");
            Booking.cancelInsurePrice = 0;
            if(!Booking.initInsure){
                Booking.insureFlagFirst = true;
                Booking.count();
            }
            
            Booking.initInsure = true;
        }

        

        function getCurrentInsure(insuranceList){
            if(insuranceList && insuranceList.length){
                for(var i = 0;i < insuranceList.length ;i++){
                    if(insuranceList[i].InsuranceType === 2 && insuranceList[i].MinAmount <= amount && insuranceList[i].MaxAmount >= amount){
                        var insureTotal = insuranceList[i].InsurancePrice;
                        Booking.cancelInsurePrice = insureTotal;
                        Booking.InsuranceName = insuranceList[i].InsuranceName;
                        Booking.InsuranceCode = insuranceList[i].InsuranceCode;
                        $(".J_insure").removeClass("none");
                        $(".J_cancelInsurePrice").html("¥"+insureTotal);
                        $(".J_insure_pop").html(insuranceList[i].InsuranceInstructions);
                        $("J_UnitPrice").html("¥"+insureTotal);
                        if($(".J_insure").length && $(".J_insure").find(".selected").length){
                            $("#J_cert").attr("data-checktype","identityCard");
                        }
                        $("#J_cert").parents("li").removeClass("none");
                        return;
                    } else {
                        $(".J_insure").addClass("none");
                        // $("#J_cert").parents("li").addClass("none");
                    }
                }
            } else {
                $("#J_cert").parents("li").addClass("none");
                $(".J_insure").addClass("none");
                Booking.cancelInsurePrice = 0;
            }
        }
    };
    Booking.compareTime = function(startDate){
            var currentTime = new Date(),
                currentDate = currentTime.getFullYear() + "/" + (currentTime.getMonth()+1) + "/" + currentTime.getDate();
            if(+new Date(startDate) > (+new Date(currentDate))){
                return true;
            } else {
                return false;
            }
        }
    module.exports = Booking;
})(Zepto);

