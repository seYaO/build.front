/**
 * common script file
 * Copyright 2014, wyx6028
 */
var common = {},
    isPackage = parseInt(fish.one("#hidIsPackage").val(), 10);
//获取url参数
common.getParamFromUrl = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS,"i");
    var results = regex.exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1];
    }
}

common.getUrlParamsObj = function(arr){
    var url = location.href,
        params = arr || [],
        paramObj = {},
        reg,hasParam;
    //
    for(var i=0;i<params.length;i++){
        reg = new RegExp("[\?&]("+params[i]+"=([^&#$]*))","i");
        hasParam = reg.exec(url);
        if(hasParam&&hasParam[1]){
            paramObj[params[i]] = hasParam[1];
        }else{
            paramObj[params[i]] = "";
        }
    }
    return paramObj;
}

//#region string prototype / 扩展String方法
// 验证字符串是否以指定字符串为开头
String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length) return false;
    if (this.substring(0, s.length) == s) return true;
    else return false;
    return true;
};
// 验证字符串是否以指定字符串为结尾
String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length) return false;
    if (this.substring(this.length - s.length) == s) return true;
    else return false;
    return true;
};
// 验证字符串是否包含指定字符串
String.prototype.includeWith = function (s) {
    if (this.length < s.length) {
        return false;
    }
    if (this.indexOf(s) == -1) {
        return false;
    }
    return true;
};
// 替换指定字符串
String.prototype.replaceWith = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};
// 去除首尾空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
//#endregion


(function (F) {
    var win = window;
    window.HolidayBook = window.HolidayBook || {};
    var all = F.all,
        one = F.one;
    //银行优惠最多份数
    window.preferentialNum=99;

    fish.admin.config({
        Calendar: {
            v: "0.2",
            css: 1,
            g: 20140333106
        },
        verify: {
            v: "0.4.1",
            css: 1,
            g: 2014042902
        }
    });

    window.PageReady = {
        host : "",
        run : function(sign){
            var self = this;
            self.params = {};
            self.params.CityId = common.getParamFromUrl("CityId")||'';
            self.params.LineId = common.getParamFromUrl("id")||'62197';
            self.params.jdPeriod = common.getParamFromUrl("jdPeriod")||'';
            self.params.ak = common.getParamFromUrl("ak")||'';
            self.params.bookdate = common.getParamFromUrl("bookdate")||'2016-07-26';
            if(sign){
                // window.isFangZhua = true;
                // self.host = "http://irondome.ly.com";
                // $.td(function(){
                self.load();
                // })
            }else{
                self.load();
            }
        },
        load : function(){
            var self = this;
            //var bookPageUrl =window.host+"/dujia/ajaxhelper/BookingPage.ashx?type=GetBookPageData";
            //var bookPageUrl ="http://10.1.56.85:8000/dujia/ajaxhelper/BookingPage.ashx?type=GetBookPageData";
            var lineId = '',preferentialTime = '';
            var bookPageUrl =window.host+'/intervacation/api/PBookingPage/GetBookingPreferential?siteType=0&lineId='+$('#HidLineid').val()+'&PageType=OrderPage&PreferentialTime='+$('#hidBookDate').val()+'';
            common.ajax({
                url: bookPageUrl,
                dataType: "jsonp",
                // data : self.params,
                isFangZhua: true,
                success: function(data) {
                    var status = data.Code.toString(),
                        data = data.Data;
                    switch (status) {
                        case "4000":
                            window.page_cf = data;
                            self.event();
                            jQuery(function() {
                                window.preferentialsCallback();
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        event : function(){
            fish.ready(function () {
                init();

                //跟团AB改版订单人数数量控制
                HolidayBook.gentuanPeople();
                //初始窗口分辨率判断
                HolidayBook.resizeWindowEvent();
                //窗口resize事件
                fish.one(window).on("resize", function () {
                    HolidayBook.resizeWindowEvent();
                });
                HolidayBook.cjFavorable();
                HolidayBook.cjTips();
                HolidayBook.ShowOrderNumTiShi();
                window.preferential = page_cf;
                preferentials.init();
                HolidayBook.allpriceFun();
                HolidayBook.advanceTips();
                // preferentials.setTCRedBag();
            });
        }
    }

    /**
     * @desc 分辨率判断
     * @type {boolean}
     */
    var isChildCountIn = fish.one("#hidChildrenUse").val() === "1";
    HolidayBook.resizeWindowEvent = function () {
        var windowWth = fish.one(document).width();

        if (one(window).width() < 1200 && one(window).width() > 0) {
            if (!one("#Head").hasClass("smallC")) {
                all("#Head,.content").addClass("smallC");
            }
        } else if (one("#Head").hasClass("smallC")) {
            all("#Head,.content").removeClass("smallC");
        }

    }

    function init() {
        //页面进来发异步
        var insuSelect = F.all(".card_sel option");
        if (insuSelect[0]) {
            var ajaxUrl = insuSelect[0].getAttribute("attr-url"),
                insuMark = insuSelect[0].getAttribute("code"),
                insuType = insuSelect[0].getAttribute("type");
        }
        if(fish.dom(".index-default")){
            F.one(".index-default").removeClass("none");
        }else{
            all(".index0").removeClass("none");
        }
        var fishDefaultDeclar = fish.dom(".declar0");
        if(fish.dom(".declar-default")) {
            fishDefaultDeclar = fish.dom(".declar-default");
        }
        if (fishDefaultDeclar) {
            one("#InsuranceDeclaration").html(fishDefaultDeclar.innerHTML);
        }
        var bookDate = common.getParamFromUrl("bookdate");
        one("#hidInsurance").val(one(".insuranceYp").attr("attr-code"));
        if (bookDate == null || bookDate == "") {
            one("#hidInsurance").val(""); //更新保险隐藏域
        }
        if (fish.dom(".cancel-insu") != null) {
            var insuId = one(".cancel-insu").attr("insu-code");
            one("#cancelInsurance").removeClass("none");
            one("#hidCancelInsurance").val(insuId);
        }
        // 填充 保险的单价 默认是选择的第一个
        var eventType = fish.browser("ms", 8) ? "click" : "change";
        fish.all(".par_left").delegate(".card_sel", eventType, function (e) {
            var _this = fish.one(e.delegateTarget),
                _val = _this.val(),
                obj = fish.dom(".card_sel", _this.parent(".insurance")),
                _index = obj.selectedIndex,
                indexDetail = "index" + _index;
            indexDeclare = "declar" + _index;
            ajaxUrl = one(obj.options[_index]).attr("attr-url"),
                urlData = one(obj.options[_index]).attr("code"),
                att_id = one(obj.options[_index]).attr("attr-id"),
                _price = one(obj.options[_index]).attr("attr-price");
            fish.one(".card_sel", _this.parent(".insurance")).attr("attr-price", _price);
            if (_val == "-1") {
                _this.parent(".insurance").children(".insurHid").removeClass("none"); //提示语 显示
                _this.parent(".insurance").children(".InsuranceDL").addClass("none"); // 左侧的列表隐藏
                _this.parent(".insurance").children(".in_info").addClass("none"); // 保险详情

                if (_this.parent(".insurance").hasClass("accident-insu")) {
                    one("#InsuranceDeclaration").html("");
                }
                if (_this.parent(".insurance").hasClass("cancel-insu")) {
                    one("#cancelInsurance").addClass("none");
                }
            } else {
                _this.parent(".insurance").children(".insurHid").addClass("none"); //提示语 隐藏
                _this.parent(".insurance").children(".in_info").removeClass("none"); // 保险详情
                _this.parent(".insurance").children(".insurancelist dl").addClass("none");
                _this.parent(".insurance").children("." + indexDetail).removeClass("none");


                if (_this.parent(".insurance").hasClass("accident-insu")) {
                    one("#InsuranceDeclaration").html(one("." + indexDeclare).html());
                }
                if (_this.parent(".insurance").hasClass("cancel-insu")) {
                    one("#cancelInsurance").removeClass("none");
                }
            }
            //重置出境宝列表
            HolidayBook.resetcjFavorable();

            //意外险
            if (_this.parent(".insurance").hasClass("accident-insu")) {
                HolidayBook.InsuranceFun(_price);
                one("#hidInsurance").val(att_id); //更新保险隐藏域
            }
            //取消险
            if (_this.parent(".insurance").hasClass("cancel-insu")) {
                HolidayBook.cancelInsuranceFun(_price);
                one("#hidCancelInsurance").val(att_id);
            }

            // HolidayBook.allpriceFun(); // 计算总价
            preferentials.Refresh();
            ////设置同程红包
            //preferentials.setTCRedBag();
        });
        //发票
        var result,aa,bb;
        fish.require("verify",function(){
            result = fish.all(".J_Name,.J_Phone,.J_Area,.fp-tt-in").verify();
            aa = fish.all(".fp-tt-in").verify();
            bb = fish.all(".J_Name,.J_Phone,.J_Area").verify();
        });
        $(".fp-radio").on("click",function(){
            var us = $.cookie("us");
            var userid = null;
            var self = $(this),ele = 0;
            if (us != null) {
                var name = 'userid';
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = us.match(reg);
                if (r != null)
                    userid = unescape(r[2]);
            }
            if (userid == null || userid == "") {
                fish.dom("#loginText a").click();
                return;
            }
            var radioId = $(this).attr('name');
            $('.fp-radio').removeClass('fpchecked') && $(this).addClass('fpchecked');
            $('#need-fp,#not-fp').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
            //var fpvalue = $('input[name="fapiao1"]:checked').attr('value');
            $('.sjlist').css('height', '27px').removeClass('none');
            var fpvalue = $('.need-fp');
            if(fpvalue.hasClass('fpchecked')){
                $('.J_sendStreet').css({
                    color: '#999',
                    paddingLeft: '0px'
                });
                $('.fp-adress-fill').css({
                    color: '#999',
                    paddingLeft: '0px'
                });
                FpInitAjax(ele);
                fish.mPop({
                    content:fish.one(".form-fp"),
                    bgclose: false,
                    dragable: true
                });
            }
        });
        function FpInitAjax(ele){
            var html1 = "",html2 = "",html3="";
            $.ajax({
                url: "/dujia/AjaxHelper/InvoiceAjax.ashx?type=GETINVOICEBASEINFO",
                type: 'GET',
                dataType: 'jsonp',
                success:function(data1){
                    if(data1.data.Title.Name){
                        $('.fp-tt').text(data1.data.Title.Name);
                        $('.fp-tt').attr('data-id', data1.data.Title.Id);
                        $('.fp-box-fill').addClass('none');
                        $('.fp-ttbox').removeClass('none');
                        $('.default-tt').eq(0).addClass('none');
                    }else{
                        $('.fp-box-fill').removeClass('none');
                        $('.fp-ttbox').addClass('none');
                        $('.default-tt').eq(0).removeClass('none');
                    }
                    if(data1.data.Address != null && data1.data.Address !=''){
                        $('.fp-adress-write-box').addClass('none');
                        $('.J-adbox').removeClass('none');
                        $('.sjlist').removeClass('none');
                        $.each(data1.data.Address,function(i,n){
                            if(i=== 0){
                                html1 += "<label class='sj-radio sjchecked' title="+n["Name"]+">"+n["Name"]+"</label>";
                                html3 += "<div class='sj-adress-box' data-pName="+n["Province"]+" data-street="+n["Street"]+" data-regionName="+n["Region"]+" data-cityName="+n["City"]+" data-RegionId="+n["RegionId"]+" data-CityId="+n["CityId"]+" data-ProvinceId="+n["ProvinceId"]+" data-adressId="+n["Id"]+">"+"<i></i>"
                                    +"<div class='sj-adress-content'>"
                                    +"<span class='sj-name'>"+n["Name"]+"</span>"+
                                    "<span class='sj-tel'>"+n["Mobile"]+"</span><span class='J_change_Adr none'>修改</span></div>"
                                    +"<div class='sj-adress-content'>"
                                    +"<span>"+n["Province"]+" </span><span>"+n["City"]+" </span><span>"+n["Region"]+" </span><span>"+n["Street"]
                                    +"</span></div></div>";
                            }else{
                                html1 += "<label class='sj-radio' title="+n["Name"]+">"+n["Name"]+"</label>";
                                html3 += "<div class='sj-adress-box none' data-pName="+n["Province"]+" data-street="+n["Street"]+" data-regionName="+n["Region"]+" data-cityName="+n["City"]+" data-RegionId="+n["RegionId"]+" data-CityId="+n["CityId"]+" data-ProvinceId="+n["ProvinceId"]+" data-adressId="+n["Id"]+">"+"<i></i>"
                                    +"<div class='sj-adress-content'>"
                                    +"<span class='sj-name'>"+n["Name"]+"</span>"+
                                    "<span class='sj-tel'>"+n["Mobile"]+"</span><span class='J_change_Adr none'>修改</span></div>"
                                    +"<div class='sj-adress-content'>"
                                    +"<span>"+n["Province"]+" </span><span>"+n["City"]+" </span><span>"+n["Region"]+" </span><span>"+n["Street"]
                                    +"</span></div></div>";
                            }
                        });
                        html2 = html1 +"<i class='sjr-sf'></i>"+ "<span class='add-sjr'><i></i>"+"<em>添加收件人</em></span>";
                        $('.sjlist').html(html2);
                        $('.J-adbox').html(html3);
                        $('.sj0').addClass('sjchecked');
                        if(ele === 1 ){
                            $('.sjlist').addClass('none');
                            $('.J_change_Adr').removeClass('none');
                            $('.sj-adress-box').addClass('left12');
                        }
                        //添加收件人
                        $('.add-sjr').on("click",function(){
                            $('.sj-radio').removeClass('sjchecked');
                            $('.sj-adress-box').addClass('none');
                            $('.fp-adress-write-box').removeClass('none').addClass('left64');
                        });
                        //选择收件人
                        $('.sj-radio').on("click",function(){
                            var radioId = $(this).attr('name');
                            var container = $('.J-adbox');
                            var index_ad = $(this).index();
                            $('.sj-radio').removeClass('sjchecked') && $(this).addClass('sjchecked');
                            $('.radio-sj').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
                            container.find('.sj-adress-box').addClass('none');
                            container.find('.sj-adress-box').eq(index_ad).removeClass('none');
                            $('.fp-adress-write-box').addClass('none');
                        });
                        //修改联系人
                        $('.J_change_Adr').on("click",function(){
                            $('.sj-adress-box').removeClass('left12');
                            $('.sjlist').removeClass('none');
                            $('.sjlist').css('height', '27px');
                            $('.J_change_Adr').addClass('none');
                        });
                        //收件人收放
                        $('.sjr-sf').on("click",function(){
                            var add_list = $('.sjlist'),
                                self = $(this);
                            if (self.hasClass('sjr-ss')) {
                                add_list.css('height', '27px');
                                self.removeClass('sjr-ss');
                            }else{
                                add_list.css('height', 'auto');
                                self.addClass('sjr-ss');
                            }

                        });
                    }else{
                        $('.fp-adress-write-box').removeClass('none');
                        $('.sj-adress-box').addClass('none');
                        $('.sjlist').addClass('none');
                        $('.J-adbox').addClass('none');
                    }
                },
                error:function(){
                    $('.sjlist').addClass('none');
                    $('.fp-box-fill').removeClass('none');
                    $('.fp-ttbox').addClass('none');
                    $('.fp-adress-write-box').removeClass('none');
                    $('.sj-adress-box').addClass('none');
                    $('.J-adbox').addClass('none');
                }
            });
        }
        var fptitleInput = $('fp-tt-in');
        fptitleInput.on("blur", function () {
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333',
                    paddingLeft: '0px'
                });
            }else{
                fptitleInput.css({
                    color: '#999',
                    paddingLeft: '0px'
                });
            }
        });
        fptitleInput.on("focus", function () {
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        }).on("keydown", function () {
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        });
        var cityInput = $('.fp-adress-name');
        cityInput.on("blur", function () {
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333',
                    paddingLeft: '0px',
                    width: '160px'
                });
            }else{
                cityInput.css({
                    color: '#999',
                    paddingLeft: '0px',
                    width: '150px'
                });
            }
        });
        cityInput.on("focus", function () {
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333 ',
                    paddingLeft: '0px',
                    width: '160px'
                });
            }
        }).on("keydown", function () {
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333 ',
                    paddingLeft: '0px',
                    width: '160px'
                });
            }
        });
        var telInput = $('.fp-adress-tel');
        telInput.on("blur", function () {
            if(telInput.val() != "手机号码"){
                telInput.css({
                    color: '#333',
                    paddingLeft: '0px'
                });
            }else{
                telInput.css({
                    color: '#999',
                    paddingLeft: '0px'
                });
            }
        });
        telInput.on("focus", function () {
            if(telInput.val() != "手机号码"){
                telInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        }).on("keydown", function () {
            if(telInput.val() != "手机号码"){
                telInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        });
        var adressInput = $('.J_sendStreet');
        adressInput.on("blur", function () {
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333',
                    paddingLeft: '0px'
                });
            }else{
                adressInput.css({
                    color: '#999',
                    paddingLeft: '0px'
                });
            }
        });
        adressInput.on("focus", function () {
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        }).on("keydown", function () {
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333 ',
                    paddingLeft: '0px'
                });
            }
        });
        //修改发票
        $('.fp-xx3').on("click",function(){
            var ele = 1;
            $('.sj-adress-box').addClass('left12');
            if (!$('.fp-adress-write-box').hasClass('none')|| !$('.fp-tt-in').hasClass('none')){
                FpInitAjax(ele);
            }
            $('.fp-adress-write-box').addClass('none');
            //$('.sj-adress-box').eq(0).removeClass('none');
            $('.sjlist').addClass('none');
            $('.J_sendStreet').css({
                color: '#999',
                paddingLeft: '0px'
            });
            $('.fp-adress-fill').css({
                color: '#999',
                paddingLeft: '0px'
            });
            $('.J_change_Adr').removeClass('none');
            fish.mPop({
                content:fish.one(".form-fp"),
                bgclose: false,
                dragable: true
            });
        });
        //默认抬头
        $('.fp-cb-default').on("click",function(){
            var fp_tt_default = $('.fp-cb-default');
            if(fp_tt_default.hasClass('sjchecked')){
                fp_tt_default.removeClass('sjchecked');
            }else{
                fp_tt_default.addClass('sjchecked');
            }
        });
        //每位开发票
        $('.fp-el-default').on("click",function(){
            var fp_el_default = $(this);
            if(fp_el_default.hasClass('sjchecked')){
                $('.choose-title').addClass('none');
                fp_el_default.removeClass('sjchecked');
            }else{
                fp_el_default.addClass('sjchecked');
                $('.choose-title').removeClass('none');
            }
        });
        $('.choose-invoice').on("click", function () {
            var el = $(this);
            $(".choose-invoice").find("label").removeClass("sjchecked");
            el.find("label").addClass("sjchecked")
        });
        //发票内容
        $('.fy-choice').on("click",function(){
            var self = $(this);
            if(self.hasClass('active-fp-nr')){
                return;
            }else{
                $('.fy-choice').removeClass('active-fp-nr');
                self.addClass('active-fp-nr');
            }
        });
        //发票保存
        $('.fp-submit').on("click",function(){
            IsPrivoce();
            if($(".fp-ttbox").hasClass("none")){ //发票抬头不存在时
                result.check();
                aa.check();
                //添加收件人存在时需要验证，不通过则return
                if (!$(".fp-adress-write-box").hasClass("none") && IsPrivoce()!=true || !$(".fp-adress-write-box").hasClass("none") && !result.check() || $(".fp-adress-write-box").hasClass("none") && !aa.check()) {
                    return;
                }
            }else{  //发票抬头存在时
                bb.check();
                //添加收件人存在时需要验证，不通过则return
                if (!$(".fp-adress-write-box").hasClass("none") && !bb.check() || !$(".fp-adress-write-box").hasClass("none") && IsPrivoce()!=true) {
                    return;
                }
            }
            var fptt = '',fptype = '';
            var container = $(".sj-adress-box:not(.none)");
            var TitleName,AddressName,Mobile,ProvinceId,ProvinceName,CityId,CityName,
                RegionId,RegionName,StreetAddress,
                IsEveryOneTitle = 0,        //是否使用相同发票抬头
                data2 = {};
            var fp_ttbox = $('.fp-ttbox'),
                fp_tt_in = $('.fp-tt-in'),
                fp_writeBox = $('.fp-adress-write-box'),
                IsDefault = false,
                Change_tt = $('.fp-tt').attr('data-id');
            var self = $(this);
            $('.fp-radio').addClass('Fp_hasSave');
            $('.need-fp').addClass('fpchecked');
            if(fp_ttbox.hasClass('none')){
                if($('.fp-el-default').hasClass('sjchecked')){
                    IsEveryOneTitle = parseInt($(".choose-invoice label.sjchecked").attr("data-param"),10);
                    if (IsEveryOneTitle === 1) {
                        fptt = fp_tt_in.val();
                        TitleName = fptt;
                    } else {
                        fptt = "为每位旅客开具独立发票";
                    }
                } else {
                    fptt = fp_tt_in.val();
                    TitleName = fptt;
                }
                if($('.fp-cb-default').hasClass('sjchecked')){
                    IsDefault = true;
                }
            }else{
                if($('.fp-el-default').hasClass('sjchecked')){
                    IsEveryOneTitle = parseInt($(".choose-invoice label.sjchecked").attr("data-param"),10);
                    if (IsEveryOneTitle === 1) {
                        fptt = $('.fp-tt').text();
                    } else {
                        fptt = "为每位旅客开具独立发票";
                    }
                } else {
                    fptt = $('.fp-tt').text();
                }
            }
            fptype = $('.active-fp-nr').text();
            $('.fp-xx1').text(fptt);
            $('.fp-xx2').text(fptype);
            $('.fp-xx').removeClass('none');
            $('.lb-info').removeClass('none');
            if(!fp_writeBox.hasClass('none')){
                AddressName = $('.fp-adress-name').val();
                Mobile = $('.fp-adress-tel').val();
                ProvinceId = $('.send-pro').attr('data-name');
                ProvinceName = $('.send-pro').text();
                CityId = $('.send-city').attr('data-name');
                CityName = $('.send-city').text();
                RegionId = $('.send-region').attr('data-name');
                RegionName = $('.send-region').text();
                StreetAddress = $('.J_sendStreet').val();
            }
            if(fp_ttbox.hasClass('none') && fp_writeBox.hasClass('none') && fp_tt_in.hasClass('change-tt')){
                data2 ="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Id":Change_tt,
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        }
                    }));
                if(aa.check() ==true){
                    dataAjax(data2);
                    fish.mPop.close();
                }
            }else if(fp_ttbox.hasClass('none') && fp_writeBox.hasClass('none') && !fp_tt_in.hasClass('change-tt')){
                data2 ="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        }
                    }));
                if(aa.check() ==true){
                    dataAjax(data2);
                    fish.mPop.close();
                }
            }else if(!fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none')){
                data2 = "param="+encodeURIComponent(JSON.stringify({
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(bb.check() ==true && IsPrivoce()==true){
                    dataAjax(data2);
                    fish.mPop.close();
                }
            }else if(fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none') && fp_tt_in.hasClass('change-tt')){
                data2="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Id":Change_tt,
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        },
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(result.check() ==true && IsPrivoce()==true){
                    dataAjax(data2);
                    fish.mPop.close();
                }
            }else if(fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none') && !fp_tt_in.hasClass('change-tt')){
                data2="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        },
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(result.check() ==true && IsPrivoce()==true){
                    dataAjax(data2);
                    fish.mPop.close();
                }
            }
            else{
                fish.mPop.close();
                $('.radio-listbox').addClass('none');
            }
        });
        //判断省市区选择
        function IsPrivoce(){
            if($('.send-pro').text()=="省"|| $('.send-city').text()=="市" || $('.send-region').text()=="区" || $('.send-pro').text()=="请选择省"){
                $('.J_invalid').removeClass('none');
                return false;
            }else{
                $('.J_invalid').addClass('none');
                return true;
            }
        }
        function dataAjax(data) {
            $.ajax({
                url: '/dujia/AjaxHelper/InvoiceAjax.ashx?type=SAVEINVOICEBASEINFO',
                type: 'GET',
                dataType: 'jsonp',
                data: data,
                success:function(){
                    $('.radio-listbox').addClass('none');
                },
                error:function(){
                    $('.radio-listbox').addClass('none');
                }
            });
        }
        //修改抬头
        $('.fp-change').on("click",function(){
            $(".fp-ttbox").addClass('none');
            $('.default-tt').eq(0).removeClass('none');
            $(".fp-tt-in").addClass('change-tt');
            $('.fp-box-fill').removeClass('none');
        });
        //不需要发票
        $(".not-fp").on("click",function(){
            $(".fp-xx,.lb-info").addClass('none');
        });
        //发票填写取消
        $(".close-dia-fp,.fp-cancel").on("click",function(){
            var self = $(this);
            if(!$('.fp-radio').hasClass('Fp_hasSave')){
                $('.fp-radio').removeClass('fpchecked');
                $('.not-fp').addClass('fpchecked');
            }
            fish.mPop.close();
            $('#J_fp_post').reset;
        });
        //$("input[type=reset]").trigger("click");
        var obj1 = {
            ProvinceChinese:'香港',
            ProvinceId:33
        };
        var obj2 = {
            ProvinceChinese:'澳门',
            ProvinceId:34
        }
        $.ajax({
            url:'/intervacation/api/visainfo/VisaResidenceJson',
            dataType:'jsonp',
            success: function (data) {
                if(data && data.Data.ResidenceList.length !== 0){
                    var cityData = data.Data.ResidenceList;
                    var str = '';
                    cityData.push(obj1);
                    cityData.push(obj2);
                    if($(".send-pro-ul")){
                        for(var i = 0;i<cityData.length-1;i++){
                            str+='<li data-id="'+cityData[i].ProvinceId+'">'+cityData[i].ProvinceChinese+'</li>';
                        }
                    }
                    $(".send-pro-ul").empty().append(str);
                }
            }
        })
        var sendSelect = $(".J_send_span"),
            sendDrop = $(".J_send_ul");
        sendSelect.on("click",function(e){
            e.stopPropagation();
            var self = $(this),ulIndex;
            $(".J_send_ul").addClass("none");
            ulIndex = self.index();
            if($(sendDrop).eq(ulIndex-1).hasClass("none")){
                $(sendDrop).eq(ulIndex).removeClass("none");
            }else{
                $(sendDrop).eq(ulIndex-1).addClass("none");

            }
        });
        sendDrop.on("click","li",function(e){
            e.stopPropagation();
            var self = $(this),spanIndex,cityId,areaId;
            if(self.attr("data-id")){
                cityId = self.attr("data-id");
                cityLink(cityId,1);
            }else if(self.attr("data-cityId")){
                cityId = self.attr("data-cityId");
                cityLink(cityId,2);
            }else if(self.attr("data-regionid")){
                cityId = self.attr("data-regionid");
            }
            spanIndex = self.parent().index();
            self.parents(".J_send_ul").siblings('div').find('.J_send_span').eq(spanIndex-4).text(self.text());
            self.parents(".J_send_ul").siblings('div').find('.J_send_span').eq(spanIndex-4).attr("data-name",cityId);
            self.parent().addClass("none");
            IsPrivoce();
        });
        $(document).on("click",function(){
            $(".J_send_ul").addClass("none");
        });
        /**
         * 城市级联
         */
        function cityLink(id,elem){
            var  cityUrl="//www.ly.com/hotel/ajax/HotelAjaxCall.aspx?action=GetCityByProvince&id=";
            areaUrl="//www.ly.com/hotel/ajax/HotelAjaxCall.aspx?action=GetAreaByCity&id=";
            if(elem === 1){
                $(".send-city").text("市");
                $(".send-region").text("区");
                renderHtml(id,cityUrl,$(".send-city-ul"));
            }else if(elem === 2)
            {
                $(".send-region").text("区");
                renderHtml(id,areaUrl,$(".send-region-ul"));
            }
        }
        /**
         * 城市级联渲染
         */
        function renderHtml(ele,url,content){
            $.ajax({
                url:url+ele,
                dataType: "jsonp",
                success:function(data){
                    var str = '';
                    for(var i = 0;i<data.result.length;i++){
                        if(content.hasClass('send-city-ul')){
                            str +='<li data-cityId="'+data.result[i].id+'">'+data.result[i].name+'</li>';
                        }
                        if(content.hasClass('send-region-ul')){
                            str +='<li data-regionId="'+data.result[i].id+'">'+data.result[i].name+'</li>';
                        }
                    }
                    content.empty().append(str);
                },
                error:function(){
                    $(".send-city").text("市");
                    $(".send-region").text("区");
                    $(".send-city-ul").empty();
                    $(".send-region-ul").empty();
                }
            });
        }
        fish.one(".par_left").delegate(".in_info", "mouseover", function (e) {
            var _this = fish.one(e.delegateTarget);
            _this.parent(".insurance").children(".insurancebox").removeClass("none");
        }).on("mouseout", function (ev) {
            all(".insurancebox").addClass("none");
        });

        fish.one(".par_left").delegate(".insurancebox", "mouseover", function (e) {
            var _this = fish.one(e.delegateTarget);
            _this.parent(".insurance").children(".insurancebox").removeClass("none");
        }).on("mouseout", function (e) {
            all(".insurancebox").addClass("none");
        });

        one(".submit").hover(function () {
            one(".submit").addClass("submitH");
        }, function () {
            one(".submit").removeClass("submitH");
        });
        all("#Imailbox,#Iphone").on("focus", function () {
            one(this).css("border-color:#76bbff;");
            var _text = one(this).attr("attr-value");
            if (_text == one(this).val()) {
                one(this).val("");
                one(this).css("color:#333");
            }
        })
        all("#Imailbox,#Iphone").on("blur", function () {
            one(this).css("border-color:#ddd;");
            var _text = one(this).attr("attr-value");
            if (_text == one(this).val()) {
                one(this).css("color:#cccccc");
            } else if (one(this).val() == "") {
                one(this).val(_text);
                one(this).css("color:#cccccc");
            }
        })

        F.require("mFix", function () {
            var L;
            if (fish.browser("ms", 6) || fish.browser("ms", 7) || fish.browser("ms", 8)) {
                L = 0;
            } else if (fish.browser("ms", 9) || fish.browser("ms", 10)) {
                L = -17.5;
            } else {
                L = -17.5;
            }
            one(".par_right").mFix({
                showType: "float",
                top: 0,
                right: L,
                content: ".content"
            });

        });

        F.on("click", function () {
            var isChecked = fish.dom("#Icheck").checked,
                uTip = fish.one("#nocheck");
            if (isChecked) {
                uTip.css("display:none");
            } else {
                uTip.css("display:block");
            }
        }, "#Icheck");

        all(".detail-info").on("click",function(){
            var self = one(this),
                _sibling = self.next();
            if(self.hasClass("packup")){
                _sibling.removeClass("none");
                self.removeClass("packup").addClass("fold");
            } else {
                _sibling.addClass("none");
                self.removeClass("fold").addClass("packup");
            }
        });

        HolidayBook.initValidFun();
        dec.count();
        HolidayBook.allpriceFun();
    };
    HolidayBook.initDecPrice = function() {
        dec.count();
    };

    var dec = {
        _initCounted: false,
        count: function (isAjax) {
            if(!isAjax && dec._initCounted) {
                return;
            }
            dec._initCounted = true;
            var els = F.all(".f_price"),
                oriPrice;
            els.each(function (el) {
                (function (el) {
                    oriPrice = el.innerHTML;
                    one(el).data("data-price", oriPrice);
                    one(el).css("visibility:visible;");
                }(el));
            });
            fish.one(".R_Bottom1 em").css("visibility:visible;");
        },
        _getDecArr: function (key) {
            var keyStr = key,
                keyObj = eval(keyStr),
                decCode = "" + (keyObj - dec._getChar("((![]<![]<!![])*([]+(+!![])+[]+(+!![])+(+![]))+[])", 6));
            if (decCode) {
                if (decCode.length === 9) {
                    decCode = "0" + decCode;
                }
            }
            return decCode.split("");
        },
        _getChar: function (_str, index) {
            var a = [],
                str = eval(_str);
            if (index) {
                str = Math.round(str / index) + [] + index;
            }
            var strArr = str.split("");
            for (var i = 0, len = str.length - 1; i <= len; i++) {
                a.push(strArr[i].charCodeAt() + i + []);
            }
            return a.join("");
        },
        _rePrice: function (price, _key) {
            var decArr = _key,
                _tmpArr = [],
                priceArr = price.split("");
            for (var i = 0; i < price.length; i++) {
                _tmpArr.push(decArr[priceArr[i]]);
            }
            return _tmpArr.join("");
        }
    };

    /**
     * @desc 初始化验证
     */
    HolidayBook.VALIDOBJECT = null;

    HolidayBook.includeLinkStyle = function (url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    HolidayBook.initValidFun = function () {
        /**
         * @desc 对页面中需要验证的元素绑定验证
         */
        var initValid = function () {
            HolidayBook.VALIDOBJECT = fish.all(".needValid").verify({
                position: "right"
            });
        };
        F.require("verify", initValid);
    };
    /**
     * @desc 银行优惠份数验证
     */
    window.isValGreatThan99 =function(a,b){
        a= parseInt(a);
        if(a>window.preferentialNum && jQuery(b).parents('.radio-item').find('input[type=radio]').is(':checked')){
            return false;
        }else{
            return true;
        }
    }
    /**
     * @desc 手机号码验证
     */
    window.verifyPhone = function (phone, elem) {
        var fElem = fish.one(elem);
        if (phone === fElem.attr('default-value')) {
            return true;
        } else {
            return fish.valida.phone(phone);
        }
    }
    /**
     * @desc 身份证号码
     */
    window.verifyCardId = function(a,b){
        var reg;
        reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, /^$/, /^$/;
        if (reg.test(a)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * @desc 验证中文名
     */
    window.verifyNameZh = function (a) {
        var reg = /^[\u2E80-\uFE4F]+[-\s]?[a-zA-Z]*$/;
        return reg.test(a);
    };
    // 生成日历每个单元格。
    HolidayBook.tmpl = '<span class="date">{dateStr}</span><a class="dayjh" href="javascript:void(0);"></a><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span>';
    HolidayBook.build = function (td, date, dateStr, data) {
        var dateTime = date.getTime(),
            item, info, htmlStr,
            place, classArr = [];
        for (var i = 0, len = data.length - 1; i <= len; i++) {
            item = data[i],
                place = item.ResidualDesc;
            //这里获得的是8点的毫秒数
            var _date = Date.parse(item.Date.replace(/\-/gi, "/"));
            if (_date >= dateTime && _date < dateTime + 1000 * 60 * 60 * 24) {
                info = item;
                break;
            }
        }
        if (!info) {
            info = {};
        }
        info.dateStr = (dateStr ? dateStr : date.getDate());
        if (!info.Price) {
            classArr.push("invalid-day");

        } else {
            //如果residual＜0,即满团或者停团,则显示仓位状态,不显示价格
            if (info.Residual < 0) {
                classArr.push("invalid-day");
            } else if (place.startWith("余位")) {
                classArr.push("over");
            } else {
                classArr.push("enough");
            }
            info.priceStr = info.Price + "元";
        }
        htmlStr = this.tmpl.replace(/{(\w+)}/g, function ($0, $1) {
            return info[$1] || "";
        });
        td.innerHTML = htmlStr;
        fish.one(td).addClass(classArr.join(" "));
    };
    // 控制 必须选一个
    HolidayBook.MinandmaxFun = function (_thisinp) {
        var PeoNub = HolidayBook.copiesNub();
        if (PeoNub === 0) {
            if (_thisinp !== null || _thisinp !== undefined) {
                one(_thisinp).val("1");
            }
        } else {
            all(".listSty input").each(function (elem, i) {
                var val = parseInt(one(elem).val(), 10),
                    min = parseInt(one(elem).attr("min"), 10),
                    subBtn = one(".sub_btn", one(elem).parent(".num_box"));
                if (val > min) {
                    subBtn.removeClass("sub_btn_false");
                }
            });
        }
    };
    HolidayBook.gentuanPeople = function () {
        var nums=common.getParamFromUrl("num");
        if (nums) {
            var num = nums.split("|");
            fish.all(".num_box input").each(function (elem, i) {
                var sumNum = HolidayBook.GetSumOrderNum(),
                    maxNum = HolidayBook.rePositiveNum(fish.one(this).attr("max"), "int"),
                    oldOrderNum = HolidayBook.rePositiveNum(num[i], "int"),
                    newOrderNum = oldOrderNum,
                    isAutoClose = HolidayBook.rePositiveNum(fish.one(this).attr("attr-close"), "int");
                if (isAutoClose === 1) {
                    if (i === 0) {
                        if (oldOrderNum >= maxNum) {
                            newOrderNum = maxNum;
                            HolidayBook.DisableAddBtn();
                        }
                    } else {
                        if (oldOrderNum + sumNum >= maxNum) {
                            newOrderNum = maxNum - sumNum;
                            HolidayBook.DisableAddBtn();
                        }
                    }
                } else {
                    if (oldOrderNum >= maxNum) {
                        newOrderNum = maxNum;
                        fish.one(".add_btn", fish.one(this).parent()).addClass("add_btn_false");
                    }
                }
                if (newOrderNum === 0) {
                    fish.one(".sub_btn", fish.one(this).parent()).addClass("sub_btn_false");
                }
                fish.one(this).val(newOrderNum);
                if (newOrderNum >= 0) {
                    var rightNum = one(this).attr("attr-class");
                    if (newOrderNum > 0) {
                        one("." + rightNum).removeClass("none");
                    } else {
                        one("." + rightNum).addClass("none");
                    }
                    one("." + rightNum + " .listnub").html(newOrderNum);
                    var inputNum = fish.one(this).getParent(".num_box");
                    HolidayBook.priceFun(inputNum, newOrderNum);
                    if (fish.one(this).previous().hasClass("sub_btn_false") && newOrderNum !== 0) {
                        fish.one(this).previous().removeClass("sub_btn_false");
                    }
                }

            });
            HolidayBook.allpriceFun();
            var insurePeople = HolidayBook.insurNub(),
                priceInsure = one(".accident-insu .card_sel").attr("attr-price"),
                cancelInsurance = one(".cancel-insu .card_sel").attr("attr-price");
            all(".InsuranceDL .listnub").html(insurePeople);

            HolidayBook.InsuranceFun(priceInsure);
            HolidayBook.cancelInsuranceFun(cancelInsurance);
            var calVipObj = new HolidayBook.CalVipObj();
            calVipObj.pricelist = F.trim(one("#hidPriceList").val());
            calVipObj.orderDate = F.trim(one("#hidBookDate").val());
            HolidayBook.calVipPrice(calVipObj);
            HolidayBook.CashcouponFun();
            HolidayBook.calPaymentPrice();
        }
    }
    /**
     * @desc 计算方法
     * @param {string}elemClass 元素类名
     * @param {number}val
     */
    HolidayBook.calculateFun = function (elemClass, val, inputVal) {
        var newVal,
            sumNum,
            Ins_price,
            cancelInsurance = one(".cancel-insu .card_sel").attr("attr-price"),

            rePositiveNum = HolidayBook.rePositiveNum,
            HidClass = one(inputVal).attr("attr-class"),
            min = rePositiveNum(inputVal.attr("min"), "int"),
            max = rePositiveNum(inputVal.attr("max"), "int"),
            inputPar = one(inputVal).parent(".num_box"),
            isAuto = HolidayBook.rePositiveNum(one("input", inputPar).attr("attr-close"), "int"),
            isAddNum = HolidayBook.rePositiveNum(one("input", inputPar).attr("data-caltype"), "int");
        if(jQuery(".accident-insu .card_sel option:selected").size()){
            Ins_price = jQuery(".accident-insu .card_sel option:selected").attr("attr-price");
        }else{
            Ins_price = one(".accident-insu .card_sel").attr("attr-price");
        }
        if (elemClass === 'sub_btn') { //减法
            newVal = val - 1;
            sumNum = HolidayBook.GetSumOrderNum() - 1;
            one('.add_btn', inputPar).removeClass('add_btn_false');
            if (newVal < 0) {
                one('.' + elemClass, inputPar).addClass('sub_btn_false');
                return;
            }
            if (newVal === min || newVal === 0) { // newVal === 0 防止出现负数 为什么出现负数本地没复现
                one('.' + elemClass, inputPar).addClass('sub_btn_false');
                if (sumNum === 0 || newVal === 0) {
                    one("." + HidClass).addClass("none");
                }
            }

            if (sumNum <= max && isAuto === 1 && isAddNum === 1) {
                HolidayBook.EnableAddBtn();
            }
            one(inputVal).val(newVal);
        } else if (elemClass === 'add_btn') { //加法
            if (isAddNum === 1) {
                sumNum = HolidayBook.GetSumOrderNum() + 1;
            } else {
                sumNum = val + 1;
            }
            newVal = val + 1;
            redisCount = HolidayBook.rePositiveNum(one("input", inputPar).val(), "int");
            one('.sub_btn', inputPar).removeClass('sub_btn_false');
            if (sumNum >= max || (isAuto != "1" && newVal >= max)) {
                if (isAuto !== 1 || (isAddNum === 0 && sumNum >= max)) {
                    one('.add_btn', inputPar).addClass('add_btn_false');
                } else {
                    HolidayBook.DisableAddBtn();
                    var ele = fish.dom('.add_btn_false', inputPar);
                    if (redisCount !== 19 && redisCount !== 20) {
                        var tipHeight = one(ele).offset(".body").top + one(ele).height() + 7,
                            tipLeft = one(ele).offset(".body").left - 116; //-120+4
                        one(".tip-residual").css("left:" + tipLeft + "px;top:" + tipHeight + "px;display:block;");
                    }
                }


                if (sumNum === max || newVal === max) {
                    one(inputVal).val(newVal);
                } else {
                    one(inputVal).val(val);
                }
                if (sumNum === 1 || newVal === 1) {
                    one("." + HidClass).removeClass("none");
                }
            } else {
                if (sumNum === 1 || newVal === 1) {
                    one("." + HidClass).removeClass("none");
                }
                one(inputVal).val(newVal);
            }

        }
        HolidayBook.InsuranceFun(Ins_price); // 保险价格
        HolidayBook.cancelInsuranceFun(cancelInsurance);//取消险
        HolidayBook.priceFun(inputPar, newVal); // 右侧的价格体系单价
        HolidayBook.resetcjFavorable(); //重置出境宝列表
        // 更新保险总人数
        var PeoNub = HolidayBook.insurNub();
        all(".InsuranceDL .listnub").html(PeoNub);

        // 设置现金券的价格
        HolidayBook.CashcouponFun();

        preferentials.calculate();
        preferentials.defaultSelected();
        //// 设置总价
        //HolidayBook.allpriceFun();
        ////设置同程红包
        //preferentials.setTCRedBag();
        preferentials.Refresh();
    };
    /**
     * @desc 单项总价计算
     * @param elem
     * @param newnub
     */
    HolidayBook.priceFun = function (elem, newnub) {
        var _f = elem.parent().children(".f_price"),
            elem = one("input", elem),
            showprice = one(elem).attr("attr-class"),
            attr_p = HolidayBook.rePositiveNum(_f.data("data-price"), "int"),
            pric = attr_p * newnub;
        showprice = "." + showprice;
        one(showprice + " .listnub").html(newnub);
        one(showprice + " strong").html(pric);
    }
    /**
     * @desc 保险总价
     * @param _price
     * @constructor
     */
    HolidayBook.InsuranceFun = function (_price) {
        var InsurPerice,
            PeoNub;
        _price = HolidayBook.rePositiveNum(_price, "int");

        PeoNub = HolidayBook.insurNub();

        InsurPerice = PeoNub * _price;
        if (InsurPerice == 0) {
            one(".InsuranceDL0").addClass("none");
        } else {
            one(".InsuranceDL0").removeClass("none");
        }
        one(".InsuranceDL0 strong").html(InsurPerice);
        one(".InsuranceDL0 .univalence b").html(_price);
        //  HolidayBook.allpriceFun();
    }
    /**
     * @desc 取消险计算
     * @param _price
     */
    HolidayBook.cancelInsuranceFun = function (_price) {
        var InsurPerice,
            PeoNub;
        _price = HolidayBook.rePositiveNum(_price, "int");

        PeoNub = HolidayBook.insurNub();

        InsurPerice = PeoNub * _price;
        if (InsurPerice == 0) {
            one(".InsuranceDL1").addClass("none");
        } else {
            one(".InsuranceDL1").removeClass("none");
        }
        one(".InsuranceDL1 strong").html(InsurPerice);
        one(".InsuranceDL1 .univalence b").html(_price);
    }
    /** 将字符串转成大于等于0的浮点、正整数... **/
    HolidayBook.rePositiveNum = function (numInfo, typeInfo) {
        if (typeof (typeInfo) === "string") {
            switch (fish.trim(typeInfo.toLowerCase())) {
                case "int":
                {
                    numInfo = parseInt(numInfo, 10);
                    return isNaN(numInfo) ? 0 : numInfo < 0 ? 0 : numInfo;
                }
                case "float":
                {
                    numInfo = parseFloat(numInfo, 10);
                    return isNaN(numInfo) ? 0 : numInfo < 0 ? 0 : numInfo;
                }
                default:
                    return 0;
            }
        }
        return 0;
    }
    HolidayBook.CalVipObj = function () {
        var obj = {
            url: F.trim(one(".lineInfo").attr("attr-url")),
            lineid: F.trim(one("#HidLineid").val()),
            requestNum: "",
            pricelist: F.trim(one("#hidPriceList").val()),
            orderDate: F.trim(one("#hidBookDate").val()),
            people: HolidayBook.insurNub()
        };
        F.lang.extend(this, obj);
        this.getData = "&pricelist=" + this.pricelist + "&orderDate=" + this.orderDate;
    }
    HolidayBook.CalVipPrice = function () {
        var obj = {
            price: 0, //价格
            coefficient: parseFloat(one("#memberOffer").attr("attr-level"), 10) || 0, //系数
            nPrice: 0, //最终优惠价格
            people: 0 //人数
        };
        F.lang.extend(this, obj);
        this.calNprice = function () {
            var price = 0,
                _this = this;
            nPrice = _this.price * _this.coefficient;
            return nPrice;
        }
    }
    HolidayBook.calVipPrice = function (obj) {
        F.ajax({
            url: obj.url,
            data: obj.getData,
            openType: "get",
            type: "string",
            fn: function (data) {
                var vipPrice = new HolidayBook.CalVipPrice();
                vipPrice.price = parseInt(F.trim(data), 10);
                vipPrice.people = obj.people;
                var price = Math.floor(vipPrice.calNprice()),
                    defaultDelPrice = parseInt(one("#MemberVal").val(), 10),
                    defaultPrice = parseInt(one("#HidPrice").val(), 10),
                    newPrice = 0;
                newPrice = defaultPrice - defaultDelPrice + price;
                one("#memberOffer").html(price);
                one("#HidPrice").val(newPrice);
                one("#MemberVal").val(price);
                HolidayBook.allpriceFun();
            }
        });
    }
    /**
     * @desc 计算现金券
     * @constructor
     */
    HolidayBook.CashcouponFun = function () {
        var this_Cash,
            ePositiveNum = HolidayBook.rePositiveNum,
            Cashbox = one("#cashcoupon"),
            CashMax = Cashbox.attr("attr-max"),
            CashSingle = Cashbox.attr("attr-single"),
            peoplenub = HolidayBook.insurNub();
        if (F.dom("#cashcoupon") !== null) {
            this_Cash = CashSingle * peoplenub;
            if (this_Cash > CashMax) { // 若现金券大于可使用的 则使用用户有的现金券
                this_Cash = CashMax;
            }
            Cashbox.html(this_Cash);
            one("#hidXjq").val(this_Cash); //隐藏域赋值
            one("#canUseCoupon").html(this_Cash);
        }
    }
    /**
     * @desc 计算总价
     */
    HolidayBook.allpriceFun = function () {
        var orderPrice = 0,
            rePositiveNum = HolidayBook.rePositiveNum,
            CashCoupon = rePositiveNum(one("#cashcoupon").html(), "int"),
            favorable_Price = rePositiveNum(one("#HidPrice").val(), "int"),
            Cjfavorable = rePositiveNum(one(".cj_bottom").attr("price"), "int"),
            cjcardprice,
            ele_Price,
            reduction = 0,
            usePreferentialRadio = F.all(".radio"),
            redBagCode = F.one("#redBagCode");

        all(".R_top .orderPrice").each(function (elem) {
            orderPrice += rePositiveNum(one(elem).html(), "int");
        });

        orderPrice -= favorable_Price;
        if (F.dom("#cashcoupon") !== null) {
            orderPrice -= CashCoupon; //现金券的值
        }
        cjcardprice = orderPrice;
        if (rePositiveNum(one("#CjfavorableVal").attr("attr-list"), "init") !== "" && one("#CjfavorableVal").attr("attr-verify") === "true") {
            orderPrice -= Cjfavorable;
        }

        //优惠信息
        usePreferentialRadio.each(function (elem, i) {
            if (one(elem).hasClass("icons-solid")) {
                var price = one(elem).parent().attr("price"),
                    num = one(elem).parent().attr("num"),
                    title = one(elem).parent().attr("txt"),
                    type = one(elem).parent().attr("type"),//0:按人头 1：按单
                    ruleId = one(elem).parent().attr("ruleId");
                reduction = type === "0" ? price * num : price;

                preferentials.rightPreferential(type, title, price, num);
                orderPrice -= reduction;
            }
        })
        //通用红包
        if (redBagCode.attr("isPass") === "1") {
            reduction = redBagCode.parent(".redBag-preferential").attr("price");
            orderPrice -= reduction;
        }

        if (orderPrice <= 0) {
            orderPrice = 0;
        }
        one(".R_Bottom .f_price").html(orderPrice);
        one(".R_Bottom").attr("attr-primitive", cjcardprice);

        HolidayBook.renderPrice && HolidayBook.renderPrice();

    }
    HolidayBook.calPaymentPrice = function () {
        var payment = fish.one("#hidClue").val(),
            val = HolidayBook.GetSumOrderNum();
        fish.one(".R_Bottom1 em").html(payment * val);
    };
    /**
     *@desc 更新保险人数
     */
    HolidayBook.insurNub = function () {
        var PeoNub = 0,
            rePositiveNum = HolidayBook.rePositiveNum;
        if (isPackage !== 1) {
            all(".listSty input").each(function (elem, i) {

                PeoNub += rePositiveNum(one(elem).val(), "int") * rePositiveNum(one(elem).attr("attr-copies"), "int");

            });
        } else {
            PeoNub += parseInt($("#hidOrderPerson").val(), 10);
        }
        return PeoNub;
    }
    /**
     *@desc 更新计算份数
     */
    HolidayBook.copiesNub = function () {
        var copies = 0,
            rePositiveNum = HolidayBook.rePositiveNum;
        all(".listSty input").each(function (elem, i) {

            copies += rePositiveNum(one(elem).val(), "int");

        });
        return copies;
    }
    /**
     * @desc 提交订单
     */
    F.on("click", function (evt) {
        fish.preventDefault(evt);
        if (fish.one(this).attr("disabled")) {
            return;
        }
        evt = fish.getEvent(evt);
        if(window.submitForm) {
            window.submitForm(function () {
                subFun(evt);
            });
        }else {
            subFun(evt);
        }
    }, ".order-submit");
    var dd,bb;
    fish.require("verify",function(){
        result = fish.all(".J_Name,.J_Phone,.J_Area,.fp-tt-in").verify();
        bb = fish.all(".fp-tt-in").verify();
        dd = fish.all(".J_Name,.J_Phone,.J_Area").verify();
    });
    /**
     * @desc 预订流程验证
     * @param evt
     */
    function subFun(evt) {
        fish.preventDefault(evt);
        var isAllValid,
            verifyCj = true,
            rePositiveNum = HolidayBook.rePositiveNum,
            checkBox = F.dom("#Icheck").checked;
        //验证发票填写
        var aa = $('.fp-box-fill').hasClass('none'),
            cc = $('.fp-adress-write-box').hasClass('none');
        if($('.need-fp').hasClass('fpchecked')){
            if(!aa && bb.check() == false){
                alert("请将发票内容填写完整");
                return;
            }
            if(!cc && dd.check() == false && IsPrivoce()==true){
                alert("请将发票内容填写完整");
                return;
            }
        }
        if (!checkBox) {
            fish.one("#nocheck").removeClass("none");
        }
        if (one("#CjfavorableVal").attr("attr-list") !== "") { // 选择出境宝
            if (one("#CjfavorableVal").attr("attr-verify") === "false") {
                one(".tradersbox .errorspan").removeClass("none")
                verifyCj = false;
            }
        }

        isAllValid = HolidayBook.VALIDOBJECT && HolidayBook.VALIDOBJECT.check(); //验证是否全部填写

        HolidayBook.ValidateRedBag(evt, isAllValid, checkBox, verifyCj); //下单验证
    }
    /**
     *@desc 判断省市区
     */
    function IsPrivoce(){
        if($('.send-pro').text()=="省"|| $('.send-city').text()=="市" || $('.send-region').text()=="区" || $('.send-pro').text()=="请选择省"){
            $('.J_invalid').removeClass('none');
            return false;
        }else{
            $('.J_invalid').addClass('none');
            return true;
        }
    }

    /**
     * @desc 验证联系人信息
     * @param evt
     */
    function beforeSubOrder(evt) {
        var $tar = fish.one(".order-submit");
        var orderPop = fish.one("#J_orderPop"),
            errMsg = fish.one("#J_orderTipDesc span");
        if(evt){
            var reslut = evt.split('|');
            //成功
            switch (reslut[0]) {
                case "error":
                {
                    /*提价订单失败*/
                    errMsg.html(reslut[1]);
                    fish.mPop({
                        content: orderPop,
                        width: 415
                    })
                    break;
                }
                case "blank":
                {
                    /* 黑名单，处理的方法*/
                    errMsg.html(reslut[1]);
                    fish.mPop({
                        content: orderPop,
                        width: 415
                    })
                    window.location.href = "http://www" + getCookieDomain();
                    break;
                }
                case "bind":
                {
                    /*其他合作用户，处理的方法*/
                    popAlipayLog(reslut[1], reslut[2]);
                    break;
                }
                case 'login':
                {
                    errMsg.html(reslut[1]);
                    fish.mPop({
                        content: orderPop,
                        width: 415
                    })
                    break;
                }
                default:
                    break;
            }
            $tar[0].removeAttribute("disabled");
            $tar.val("提交订单");
        }
    }

    function getSerlizeStr(uParent) {
        var uElems = fish.all("input,select,textarea", uParent),
            eachKey,
            eachVal,
            eachStr,
            serlizeArr = [],
            serlizeStr = "",
            shouldAdd;
        uElems.each(function () {
            if (this.type == "radio" || this.type == "checkbox") {
                if (this.checked) {
                    shouldAdd = true;
                } else {
                    shouldAdd = false;
                }
            } else {
                shouldAdd = true;
            }
            if (shouldAdd) {
                eachKey = this.name;
                eachVal = encodeURIComponent(this.value);
                //京东分期默认参数修改hack
                if(this.value.indexOf("确认信息")>-1){
                    eachVal = encodeURIComponent("");
                }

                eachStr = eachKey + "@@@" + eachVal;
                serlizeArr.push(eachStr);
            }

        });
        serlizeStr = serlizeArr.join("|||");
        return serlizeStr;
    }

    /**
     * @desc 下单接口函数
     * @param evt
     * @param callback
     */
    function subOrder(evt, callback) {
        //提交订单
        //后端验证 一些输入域
        var $tar = fish.one(".order-submit");
        $tar.attr("disabled", "disabled").val("正在提交...");

        var eachSilizeStr,
            validNameUrl = "/intervacation/api/OrderHandler/SubOrder",
            dspId = common.getParamFromUrl("dspId")||'',
            serilizeArr = [];
        var sbuObj = {},sbuArr = [];
        if (dspId) {
            dspId = dspId.replace(/[\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]/g,"");
        }
        //var tourData = "&passengers=" + fish.cookie.get("passengers");
        fish.all(".needValidWrap .fillinBox").each(function () {
            eachSilizeStr = getSerlizeStr(fish.one(this));
            serilizeArr.push(eachSilizeStr);
        });
        var OrderEmail = fish.one("#Imailbox").val(),
            OrderName = fish.one("#Iname").val(),
            OrderMobile = fish.one("#Iphone").val();
        var InsuranceCode = '',cancelInsuCode = '';
        $('.J_insurance').map(function(index,item){
            if($(item).attr('data-insuranceType') === '1'){
                InsuranceCode = $(item).attr('data-insurancecode');
            }
            if($(item).attr('data-insuranceType') === '2'){
                cancelInsuCode = $(item).attr('data-insurancecode');
            }
        });
        $('.J_sbuPack').map(function (index,item) {
            var personType = $(item).parent().attr('data-personType');
            var sbuType = $(item).parent().attr('data-type');
            sbuObj.ProductId = $(item).attr('data-productid');
            sbuObj.ResourceId  = $(item).attr('data-resourceid');
            sbuObj.UsingDate  = $(item).attr('data-usingdate');
            sbuObj.Type = $(item).parent().attr('data-type');
            if($(item).attr('data-isWifi') == 1){
                sbuObj.UsingDays  = $(item).attr('data-usingdays');
            }else{
                sbuObj.UsingDays  = '';
            }
            //兼容签证成人儿童之分
            if(personType == 0 && sbuType == 3){
                sbuObj.AdultPriceId  = 0;
                sbuObj.AdultNum  = 0;
                sbuObj.ChildPriceId   = $(item).attr('data-priceId');
                sbuObj.ChildNum   = $(item).parent().attr('data-count');
            }else{
                sbuObj.AdultPriceId  = $(item).attr('data-priceId');
                sbuObj.AdultNum  = $(item).parent().attr('data-count');
                sbuObj.ChildPriceId   = 0;
                sbuObj.ChildNum   = 0;
            }
            sbuArr.push(sbuObj);
            sbuObj = {};
        })
        if($('.listSty p')){
            var sum = 0,sumArr = [];
            $('.listSty p').map(function(index,item){
                var type = $(item).attr('price-type');
                if(type == '1'||type == '2'||type == '8'){
                    sumArr.push(parseInt($(item).attr('data-personcount')));
                }
            })
            for(var i = 0;i<sumArr.length;i++){
                sum+=sumArr[i];
            }
        }
        var paramData = {},CheckLogin = {},FrontBooking = {},ContractInfo = {};
        CheckLogin.Email = OrderEmail;
        CheckLogin.Mobile = OrderMobile;
        CheckLogin.RegName = OrderName;
        paramData.CheckLogin = CheckLogin;
        ContractInfo.ContactPerson = OrderName;//获取联系人信息
        ContractInfo.ContactMoblie = OrderMobile;
        ContractInfo.ContactMail = OrderEmail;
        ContractInfo.ContactCardId = "";
        FrontBooking.ContractInfo = ContractInfo;
        FrontBooking.lineid = encodeURIComponent(fish.one("#HidLineid").val());
        FrontBooking.stationId = encodeURIComponent(fish.one("#hidStation").val());
        FrontBooking.PriceList = fish.one("#hidPriceList").val();
        FrontBooking.Bookdate = encodeURIComponent(fish.one("#hidBookDate").val());
        FrontBooking.FromPlatform = encodeURIComponent(fish.one("#HidFromPlatform").val());
        FrontBooking.InsuranceCode = encodeURIComponent(InsuranceCode);//意外险
        FrontBooking.cancelInsuCode = encodeURIComponent(cancelInsuCode);//取消险
        FrontBooking.Xjq = encodeURIComponent(fish.one("#hidXjq").val());
        FrontBooking.Actvity = encodeURIComponent(fish.one("#HidActvity").val());
        FrontBooking.Bankid = encodeURIComponent(fish.one("#HidBankid").val());
        FrontBooking.Memberyid = encodeURIComponent(fish.one("#HidMemberZid").val());
        FrontBooking.CanalId = encodeURIComponent(fish.one("#HidCanalId").val());
        FrontBooking.AdvordId = encodeURIComponent(fish.one("#HidAdvordId").val());
        FrontBooking.People_Nub = sum; //出游的人数
        FrontBooking.sellType = encodeURIComponent(one("#HidSale").val());
        FrontBooking.key = encodeURIComponent(fish.one("#HidKey").val())||'';
        FrontBooking.cardInfo = encodeURIComponent(fish.one("#CjfavorableVal").attr("attr-list"));//出境宝
        FrontBooking.orderRemark = encodeURIComponent(HolidayBook.GetTravelInfo());
        FrontBooking.redPacketCode = encodeURIComponent(preferentials.getRedBagCode());
        FrontBooking.tcRedBagCode = encodeURIComponent(preferentials.getTCRedBagCode()); //同程红包
        FrontBooking.tcRedBagAmount = encodeURIComponent(preferentials.getTCRedBagAmount());//同程红包金额
        FrontBooking.ruleId = encodeURIComponent(preferentials.getRuleId());
        FrontBooking.guishuId = encodeURIComponent(preferentials.getGuiShuId());
        FrontBooking.cityId = encodeURIComponent(fish.one("#hidCityId").val());
        FrontBooking.k_city = encodeURIComponent(fish.one("#k_city").val());
        FrontBooking.ruleList = HolidayBook.getRuleListForSubmit();
        FrontBooking.flightGuid = encodeURIComponent(fish.one("#hidFlightGuid").val()||"");
        FrontBooking.orderResource = encodeURIComponent(fish.one("#hidOrderResource").val() || "");
        FrontBooking.productPriceList = encodeURIComponent(fish.one("#hidProductPriceList").val() || "");
        FrontBooking.jdPeriod = encodeURIComponent($("#jd-pay")[0].checked?$(".bystages-type").attr("data-stage"):0);
        FrontBooking.isWhiteBar = encodeURIComponent(($("#TC-pay:checked").val() || $("#jd-pay:checked").val()) ? 1 : 0);//只要选中分期付款，就传1
        FrontBooking.sbu = JSON.stringify(sbuArr);
        FrontBooking.ouid = encodeURIComponent(fish.cookie.get("ouid")||"");
        FrontBooking.passengers = fish.cookie.get("passengers");
        //旅游顾问ID
        FrontBooking.JobNumber = encodeURIComponent(fish.one("#hidJobNumber").val()||"");
        var tourAdviser = $(".J_lvgu");
        if (tourAdviser && (tourAdviser.length && !tourAdviser.hasClass("none"))) {
            FrontBooking.FrontIsSelect = $("#lvguID")[0].checked ? "1" : "0";
        }
        if (dspId) {
            FrontBooking.externalSourceId = encodeURIComponent(dspId);
        }
        paramData.FrontBooking = FrontBooking;

        //提交订单后的发票信息
        var CId,FpTitle,IsEveryOne = 0,FpName,FpMobile,AddrId = 0,PId,PName,CityId,CityName,RegionId,RegionName,FpStreet,FpType= 3,
            IsEveryOneTitle = 0,
            IsEveryOneInvoice = 0;
        var container = $(".sj-adress-box:not(.none)");
        if($('.fp-box-fill').hasClass('none')){
            FpTitle = $('.fp-tt').text();
        }else{
            FpTitle = $('.fp-tt-in').val();
        }
        if($('.fp-fwf').hasClass('active-fp-nr')){FpType = 3;}else{FpType = 1;}
        //联系人是原有的还是新增的
        if (!$('.fp-el-default').hasClass('sjchecked')) {
            IsEveryOne = 0;
            IsEveryOneTitle = 0;
            IsEveryOneInvoice = 0;
        } else {
            IsEveryOne = 1;
            IsEveryOneTitle = parseInt($(".choose-invoice label.sjchecked").attr("data-param"),10);
            IsEveryOneInvoice = 1;
        }
        if($('.fp-adress-write-box').hasClass('none')){
            FpName = container.find('.sj-name').text();
            FpMobile = container.find('.sj-tel').text();
            AddrId = container.attr('data-adressid');
            PId = container.attr('data-provinceid');
            PName = container.attr('data-pName');
            CityId = container.attr('data-CityId');
            CityName = container.attr('data-CityName');
            RegionId = container.attr('data-RegionId');
            RegionName = container.attr('data-regionName');
            FpStreet = container.attr("data-street");
        }else{
            FpName = $('.fp-adress-name').val();
            FpMobile = $('.fp-adress-tel').val();
            AddrId = 0;
            PId = $('.send-pro').attr('data-name');
            PName = $(".send-pro").text().trim();
            CityId = $('.send-city').attr('data-name');
            CityName = $(".send-city").text().trim();
            RegionId = $('.send-region').attr('data-name');
            RegionName = $('.send-region').text().trim();
            FpStreet = $('.J_sendStreet').val();
        }
        $.ajax({
            url: validNameUrl,
            method: "post",
            dataType: "json",
            data: paramData,
            success: function (data) {
                fish.cookie.remove("passengers");
                var orderPop = fish.one("#J_orderPop"),
                    errMsg = fish.one("#J_orderTipDesc span");
                if(data.Data){
                    var resultData = data.Data.CheckResult,
                        subResult = data.Data.SubResult;
                    if(resultData.CheckCode === 3100){
                        beforeSubOrder(resultData.Message);
                    }else{
                        if(subResult.SubCode === 4000){
                            if(subResult.card !== ''){
                                fish.mPop({
                                    content: one("#cjpopbox")
                                });
                                one("#errorCard").html(subResult.card);
                            }else{
                                location.href = subResult.url;
                            }
                        }else{
                            errMsg.html(subResult.Message);
                            fish.mPop({
                                content: orderPop,
                                width: 415
                            })
                        }
                    }
                }
                callback && callback.call(this);
            }
        });
    }

    fish.ready(function () {
        // 提示信息的方法
        var openTips = function (str) {
            fish.one("#alipay_login_box #sign_in_tips_alipay").html(str);
            fish.one("#alipay_login_box #sign_in_tips_out").removeClass("none");
            fish.one("#alipay_login_box #sign_in_tips_out").css("display:block");
            fish.one("#alipay_login_box #sign_in_tips_out").css("visibility:visible");
            fish.one("#alipay_login_box #sign_in_tips_alipay").removeClass("none");
            fish.one("#alipay_login_box #sign_in_tips_alipay").css("display:block");
            fish.one("#alipay_login_box #sign_in_tips_alipay").css("visibility:visible");
        }
        if (fish.one("a", document.body).attr("href") == "http://www.17u.cn/") fish.one("a", document.body).attr("href", "//www.ly.com/");
        /*添加事件监听*/
        //提交或退出登录等等事件
        fish.one("#alipay_login_box #sign_in_btn_alipay").on("click", function () {
            /*DB用户登录方法*/
            if (fish.trim(fish.one("#account_alipay").val()).length <= 0) {
                openTips("用户名为空，请输入用户名");
                return;
            }
            if (fish.trim(fish.one("#actpwd_alipay").val()).length <= 0) {
                openTips("密码为空，请输入密码");
                return;
            }
            var globeAjaxAdrr =+fish.one("#globeAjaxAdrr").attr("data-url"),
                postData = "Type=GetBindAli&loginname=" + fish.one("#account_alipay").val() + "&pwd=" + fish.one("#actpwd_alipay").val();
            if (this.logObj) this.logObj.abort();
            this.logObj = F.ajax({
                url: globeAjaxAdrr,
                data: postData,
                openType: "post",
                type: "json",
                fn: function (data) {
                    switch (data.state) {
                        case 100:
                        {
                            fish.mPop.close(true);
                            fish.one("#alipay_login_box").css("display:none");
                            subOrder();
                            break;
                        }
                        case 200:
                        {
                            openTips("密码错误，请重新输入密码");
                            break;
                        }
                        default:
                        {
                            openTips("抱歉，登录失败！");
                            break;
                        }
                    }
                },
                err: function () {
                    //异步错误和200状态一样
                    openTips("抱歉，登录失败！");
                },
                onTimeout: function () {
                    //异步超时和200状态一样
                    openTips("抱歉，登录失败！");
                }
            });
        });

        fish.one("#alipay_login_box #cancel_alipay").on("click", function () {
            fish.one(this).attr("href", "javascript:void(0);");
            fish.mPop.close(true);
            fish.one("#alipay_login_box").css("display:none");
        });
        fish.one("#alipay_login_box .exit_btn").on("click", function () {
            fish.one(this).attr("href", "javascript:void(0);");
            fish.mPop.close(true);
            fish.one("#alipay_login_box").css("display:none");
        });
    });

    function popAlipayLog(type, name) {

        /*弹出提示框，然后传入回调函数*/
        var name_change = name[0] + name[1] + name[2] + "****" + name[7] + name[8] + name[9] + name[10];
        fish.one("#actpwd_alipay").val("");
        fish.one("#alipay_tc_name").html(type + name_change);
        fish.one("#account_alipay").val(name);
        fish.one("#sign_in_tips_out").css("display:none");
        fish.one("#sign_in_tips_alipay").css("display:none");
        fish.mPop({
            overlay: true,
            bgclose: false,
            content: fish.dom("#alipay_login_box")
        });
    }
    /** 出境宝 **/
    /**
     * @desc 绑定出境宝函数
     */
    HolidayBook.cardAjax = function () {
        if (window.__isSend__) {
            return;
        }
        window.__isSend__ = true;

        var rePositiveNum = HolidayBook.rePositiveNum,
            carurl = one(".newcard").attr("attr-url"),
            Cj_nub = one(".newcard .Cj_nub"),
            Cj_pw = one(".newcard .Cj_pw"),
            nubval = F.trim(Cj_nub.val()),
            pwval = F.trim(Cj_pw.val());
        F.ajax({
            url: carurl,
            type: "jsonp",
            data: "cardNumber=" + nubval + "&cardPassword=" + pwval,
            fn: function (data) {
                var  flag = data.Data.ChujingbaoData;
                window.__isSend__ = false;
                var datalist;
                if (rePositiveNum(flag.ErrNum, "int") >= 3) {
                    one(".verifybox").removeClass("none");
                }
                if (flag.ErrMessage === "") {
                    one(".cj_bottom").removeClass("none");
                    datalist = '<li><span class="car_th"><label><input attr-id="' + flag.CardNumber + '"attr-price="' + flag.HasBalance + '" attr-select="false" type="checkbox">' + flag.CardNumber + '</label></span><span class="nub_th">' + flag.Balance + '</span><span class="use_th">0</span><span class="remaining_th">' + flag.HasBalance + '</span><span class="time_th">' + (flag.EndDate.split('T')[0]) + '</span></li>';
                    one('.cj_list .table_title').html('after', datalist);
                    one('.cj_list .cj_bottom').removeClass("none");
                    one('.showCj .errorspan').html("<em> </em> 绑定成功");
                } else {
                    fish.one(".showCj .errorspan").removeClass("none");
                    fish.one(".showCj .errorspan").html("<em> </em>" + flag.ErrMessage);
                    fish.one(".verifybox .errorspan").addClass("none");
                    HolidayBook.verificationFun(event); //更新验证
                }
            }
        });
    }
    /**
     * @desc 出境宝验证码异步
     * @param event
     */
    HolidayBook.verificationFun = function (event) {
        var url = '/intervacation/api/Chujingbao/GetValidateCode';
        fish.one("#imgVCode").attr('src', url + '?pageMark=0&r=' + Math.random());
    }

    HolidayBook.cjFavorable = function () {
        var Cj_nub = false,
            Cj_pw = false;

        //添加出境宝
        $(document).on("click",".addbtn", function () {

            var rePositiveNum = HolidayBook.rePositiveNum,
                Cj_nub = one(".newcard .Cj_nub"),
                Cj_pw = one(".newcard .Cj_pw"),
                nubval = F.trim(Cj_nub.val()),
                pwval = F.trim(Cj_pw.val()),
                nubattr = F.trim(Cj_nub.attr("attr-value")),
                fwattr = F.trim(Cj_pw.attr("attr-value"));

            one(".showCj .errorspan").html("<em> </em>请输入正确的卡号及密码");

            if (nubval === nubattr || nubval === "") {
                Cj_nub.addClass("errorCard");
            }
            if (pwval === fwattr || pwval === "") {
                Cj_pw.addClass("errorCard");
            }
            if (fish.trim(fish.one(".verifybox .Vcode").val()) === fish.one(".verifybox .Vcode").attr("attr-value") && !fish.one(".verifybox").hasClass("none")) {
                fish.one(".verifybox .errorspan").removeClass("none").html("<em> </em> 请输入验证码")
            }
            if (!Cj_nub.hasClass("errorCard") && !Cj_pw.hasClass("errorCard")) {
                checkVerifyCode(fish.one("#verificatcode"), function () {
                    HolidayBook.cardAjax();
                })
            } else {
                fish.one(".showCj .errorspan").removeClass("none").html("<em> </em>请输入正确的卡号及密码");
            }
        });

        //出境宝的选择点击事件
        one(".cjbox").delegate(".cj_list input", "click", function (e) {
            var t = e.delegateTarget,
                rePositiveNum = HolidayBook.rePositiveNum,
                price = rePositiveNum(one(".cj_bottom").attr("price"), "int"),
            // Oth_price = price, //使用出境宝金额
                cardnub = rePositiveNum(one(".cj_bottom").attr("cardnub"), "int"),
                elem = F.dom(t);
            var t_price = rePositiveNum(one(elem).attr("attr-price"), "int"),
                this_tr = one(elem).parent("li"),
                this_user = one(".use_th", this_tr),
                this_remaining = one(".remaining_th", this_tr),
                orderPrice = rePositiveNum(one(".R_Bottom").attr("attr-primitive"), "int") - rePositiveNum(one(".card_price").html(), "int");

            if (elem.checked) {
                //  Oth_price +=  t_price;
                one(elem).attr("attr-select", "true");

                if (t_price > orderPrice) { // 当前选中大于 余额
                    if (orderPrice == 0) {
                        elem.checked = false;
                    } else {
                        var cardRemaining = t_price - orderPrice; //出境宝余额 = 当前出境宝的金额-订单的金额

                        price += orderPrice; //共使用出境宝

                        cardnub += 1;

                        this_user.html(orderPrice);
                        this_remaining.html(cardRemaining);
                    }
                } else {
                    cardnub += 1;
                    price += t_price;
                    this_user.html(t_price);
                    this_remaining.html("0");
                }

            } else {
                cardnub -= 1;
                // price -= t_price;
                price -= rePositiveNum(this_user.html(), "int");
                one(elem).attr("attr-select", "false");
                this_user.html("0");
                this_remaining.html(t_price);
            }

            // 遍历出境宝
            var cardInfo = "",
                nub = 0;

            all(".cj_list input").each(function (elem, i) {
                var ele_id = one(elem).attr("attr-id"),
                    this_tr = one(elem).parent("li"),
                    this_user = one(".use_th", this_tr),
                    val_user = rePositiveNum(this_user.html(), "int");

                if (elem.checked) {
                    if (nub == 0) {
                        cardInfo += ele_id + "@@@" + val_user;
                    } else {
                        cardInfo += "|||" + ele_id + "@@@" + val_user;
                    }
                    nub += 1;
                }
                one("#CjfavorableVal").attr("attr-list", cardInfo);

            });

            one(".favorablCJ").removeClass("none");
            one(".totle_card .card_price").html(price);
            one(".totle_card .card_nub").html(cardnub);
            one(".cj_bottom").attr("price", price);
            one(".cj_bottom").attr("cardnub", cardnub);

            if (one("#CjfavorableVal").attr("attr-verify") === "true" && rePositiveNum(one("#CjfavorableVal").attr("attr-list"), "init") !== "") {
                HolidayBook.allpriceFun();
                one("#cjfavor").html(price);
            }
        });

        /**
         *@desc 刷新验证码
         */
        $(document).on('click',".verifycode", function (event) {
            HolidayBook.verificationFun(event);
        });

        $(document).on("click",'.cj_tit', function () {
            var showbox = one(".cj_favorable .listbox");
            if (F.dom(".cj_favorable .listbox") === null) {
                showbox = one(".cj_favorable .cjbox");
            }
            if (showbox.hasClass("none")) {
                showbox.removeClass("none");
                one(this).removeClass("cj_tit_up");
            } else {
                showbox.addClass("none");
                one(this).addClass("cj_tit_up");
            }
        });
        //验证交易密码
        HolidayBook.cjbVerifyPassword();
    }

    function checkVerifyCode(t, callback) {
        if (fish.one(".verifybox").hasClass("none")) {
            callback.apply(this);
            return;
        }
        // 出境宝卡验证码
        if (t.hasClass("Vcode") && fish.trim(t.val()) != fish.trim(t.attr("attr-value"))) {
            var carurl = fish.one(".verifycode").attr("attr-url");

            fish.ajax({
                url: carurl,
                type: "json",
                data: "checkCode=" + fish.one("#verificatcode").val(),
                fn: function (data) {
                    if(data){
                        var flag = data.Data.CheckVerifyCode.Message;
                        if (flag === "") {
                            fish.one(".verifybox .errorspan").removeClass("none").html("<em> </em> 验证码输入正确");
                            callback.apply(this);
                        } else {
                            fish.one(".verifybox .errorspan").removeClass("none").html("<em> </em> 请输入正确的验证码");
                            if (data.errCode - 0 >= 3) {
                                fish.one(".verifybox").removeClass("none");
                            }
                        }

                    }
                }
            });

        }
    }
    // 重置出境宝列表
    HolidayBook.resetcjFavorable = function () {
        var par,
            card_price;
        all(".cj_list input").each(function (elem, i) {
            t_price = HolidayBook.rePositiveNum(one(elem).attr("attr-price"), "int");
            if (elem.checked) {
                elem.checked = false;
                one(elem).attr("attr-select", "false");
                par = one(elem).parent("li");
                one(".use_th", par).html("0");
                card_price = one(elem).attr("attr-price");
                one(".remaining_th", par).html(card_price);
            }
        });
        one(".favorablCJ").addClass("none");
        one(".totle_card .card_price").html("0");
        one(".cj_bottom").attr("cardnub", "0");
        one(".cj_bottom").attr("price", "0");
        one(".totle_card .card_nub").html("0");
        one(".favorablCJ").addClass("none");
        one("#cjfavor").html("0");

        one("#CjfavorableVal").attr("attr-list", "");
    }

    //出境宝验证交易密码
    HolidayBook.cjbVerifyPassword = function () {
        all(".newcard input,#verificatcode,.dealcode").on("focus", function () {
            var t = one(this);
            if (F.trim(t.val()) == F.trim(t.attr("attr-value"))) {
                t.val("");
            }
            t.removeClass("errorCard passCard");
            t.css("color: #333;");
            if (t.hasClass("Vcode")) {
                one("#imgVCode").attr("attr-imgvcode", "false");
            }
        }).on("blur", function () {
            var verifi,
                t = fish.one(this),
                thisval = fish.trim(t.val());
            if (thisval.length <= 0 || thisval == t.attr("attr-value")) {
                t.css("color:#ccc;");
                t.val(t.attr("attr-value"));
            }
        });
        all(".dealcode").on("blur", function () {
            var t = one(this);
            if (t.hasClass("dealcode") && F.trim(t.val()) != F.trim(t.attr("attr-value"))) {
                //  交易密码
                var rePositiveNum = HolidayBook.rePositiveNum,
                    Cjfavorable = rePositiveNum(one(".cj_bottom").attr("price"), "int"),
                    ajaxUrl = one(".tradersbox").attr('attr-url') + "?password=" + encodeURI(F.trim(t.val()));

                F.ajax({
                    url: ajaxUrl,
                    type: "jsonp",
                    fn: function (data) {
                        var flag = data.Data.VerifyPassword.VerifyPasswordResult;
                        if (flag === "") {
                            one("#CjfavorableVal").attr("attr-verify", "true");
                            var R_favorablCJ = one(".tradersbox .errorspan");
                            one(R_favorablCJ).addClass("none");

                            one("#cjfavor").html(Cjfavorable);
                            HolidayBook.allpriceFun();
                        } else {
                            one(".tradersbox .errorspan").removeClass("none");
                        };
                    }
                });

            };
        })
    }
    all("#validErr .exit_btn,#validOder .exit_btn,#errortipser .exit_btn,#validOder .exit_btn,.pop_tit span").on("click", function () {
        fish.mPop.close();
    });

    HolidayBook.GetBackTime = function (start, days) {
        var startTime = new Date(start),
            endTime,
            endYear,
            endMonth,
            endDay,
            returnTime;
        endTime = new Date(startTime.setDate(startTime.getDate() + parseInt(days) - 1));
        endYear = endTime.getFullYear();
        endMonth = endTime.getMonth() + 1;
        endDay = endTime.getDate();
        if (endMonth < 10) {
            endMonth = "0" + endMonth;
        }
        if (endDay < 10) {
            endDay = "0" + endDay;
        }
        returnTime = endYear + "-" + endMonth + "-" + endDay;
        return returnTime;
    };

    all(".traveller-list div").on("click", function () {
        var ele = one("input", this);
        if (fish.dom(ele).checked) {
            ele.val("Y");
        } else {
            ele.val("N");
        }
    });

    HolidayBook.GetTravelInfo = function () {
        var travelInfo = "";
        all("input", one(".traveller-list")).each(function (elem, i) {
            if (fish.dom(elem).checked) {
                one(elem).val("Y");
            }
            travelInfo += one(elem).val();
        });
        return travelInfo;
    };
    HolidayBook.ValidateRedBag = function (evt, isAllValid, checkBox, verifyCj) {
        if (fish.dom(".youhui_hongbao select") != null && one(".youhui_hongbao").attr("attr-code") != "") {
            var redurl = "/dujia/AjaxActivity.aspx?Type=ValidateRedBag";
            fish.ajax({
                url: redurl,
                type: "json",
                data: "rCode=" + one(".youhui_hongbao").attr("attr-code"),
                fn: function (data) {
                    if (data.RespCode === 1) {
                        HolidayBook.ValidateBooking(evt, isAllValid, checkBox, verifyCj);
                    } else {
                        fish.one("#validOder .p01").html("亲，" + data.RespDes);
                        fish.mPop({
                            content: fish.dom("#validOder")
                        });
                        return;
                    }
                }
            });
        } else {
            HolidayBook.ValidateBooking(evt, isAllValid, checkBox, verifyCj);
        }
    }

    /**
     *
     * @param evt
     * @param isAllValid
     * @param checkBox
     * @param verifyCj
     * @desc 验证下单人数不为0则到下单函数
     */
    HolidayBook.ValidateBooking = function (evt, isAllValid, checkBox, verifyCj) {
        if (isAllValid && checkBox && verifyCj) { // 验证通过 并且已勾选
            if (isPackage !== 1) {
                if (HolidayBook.ValidateOrderNum()) {
                    subOrder();
                } else {
                    var orderPop = fish.one("#J_orderPop"),
                        errMsg = fish.one("#J_orderTipDesc span");
                    errMsg.html("当前出游人数为0，不能进行预订哦！");
                    fish.mPop({
                        content: orderPop,
                        width: 415
                    })
                }
            } else {
                subOrder();
            }
        }
    }


    HolidayBook.GetSumOrderNum = function () {
        var sumCount = 0;
        all(".listSty p").each(function (elem, i) {
            //if (one(elem).attr("data-caltype") == "1" && one(elem).attr("attr-close") == "1") {
            if (one(elem).attr("price-type") == "1" || one(elem).attr("price-type") == "8") {
                sumCount += HolidayBook.rePositiveNum(one(elem).attr('data-personcount'), "int");
            }
        });
        return sumCount;
    }

    HolidayBook.ShowOrderNumTiShi = function () {
        fish.one("#styleList").delegate(".add_btn_false", "mouseover", function (e) {
            var ele = e.delegateTarget,
                parentEle = fish.one(ele).parent(),
                isClose = HolidayBook.rePositiveNum(one("input", parentEle).attr("attr-close"), "int"),
                redisCount = HolidayBook.rePositiveNum(one("input", parentEle).val(), "int");
            if (isClose === 1 && redisCount !== 20) {
                var tipHeight = one(ele).offset(".body").top + one(ele).height() + 7,
                    tipLeft = one(ele).offset(".body").left - 116; //-120+4
                one(".tip-residual").css("left:" + tipLeft + "px;top:" + tipHeight + "px;display:block;");
            }

        });

        fish.one("#styleList").delegate(".add_btn_false", "mouseout", function (e) {
            one(".tip-residual").css("display:none;");
        });
    }

    HolidayBook.ValidateOrderNum = function ()  {
        var num = HolidayBook.GetSumOrderNum();
        if (num > 0) {
            fish.one("#J_PeopleIsZero").css("display:none");
            return true;
        } else {
            all(".listSty input").each(function (elem, i) {
                if (one(elem).attr("data-caltype") == "1") {
                    num += HolidayBook.rePositiveNum(one(elem).val(), "int");
                }
            });
            if (num > 0) {
                fish.one("#J_PeopleIsZero").css("display:none");
                return true;
            } else {
                fish.one("#J_PeopleIsZero").css("display:block");
                return false;
            }
        }
    }

    //出境宝提示信息
    HolidayBook.cjTips = function () {
        var tips = F.one(".cj_tips"),
            off = tips.offset(),
            cj_tips_box = F.one(".cj_tips_box");
        tips.hover(function () {
            // cj_tips_box.css("position:absolute;left:" + (off.left + 20) + "px;" + "top:" + (off.top - 45) + "px");
            cj_tips_box.removeClass("none");
        }, function () {
            cj_tips_box.addClass("none");
        });
    };

    /**
     * @desc 乘客类型
     */
    HolidayBook.calculatePeopleNum = function () {
        var oPerson = {};
        fish.all("#styleList .listSty").each(function () {
            var $this = fish.one(this), type, num;
            type = $this.children("input").attr("price-type");
            num = +$this.children("input").val();
            if (type == null) {
                return;
            }
            if (type === "1") {
                type = "adult";
            }
            if (type === "2" || type === "8") {
                type = "child";
            }
            oPerson[type] == null && (oPerson[type] = 0);
            oPerson[type] += num;
        });
        oPerson.child == null && (oPerson.child = 0);
        return oPerson;
    };
    /**
     * @param obj 乘客对象
     * @returns {number} 有效的乘客数量
     */
    HolidayBook.countReductionPerson = function (obj) {
        return obj.adult + (isChildCountIn ? obj.child : 0);
    };
    /**
     * @param obj 乘客对象
     * @returns {number}多人立减价格
     */
    HolidayBook.countReduction = function (obj) {
        return HolidayBook.countReductionPerson(obj) * HolidayBook.countReductionPrice(obj);
    };
    /**
     * @param obj 乘客类型
     * @returns {number}多人立减单价
     */
    HolidayBook.countReductionPrice = function (obj) {
        var num = HolidayBook.countReductionPerson(obj),
            index = indexOfDir(reductionRule, "BookNumber", num);
        return index > -1 ? reductionRule[index].Discount : 0;
    };
    //多人立减规则id
    HolidayBook.getReductionRuleId = function () {
        var num = HolidayBook.countReductionPerson(HolidayBook.calculatePeopleNum()),
            index = indexOfDir(reductionRule, "BookNumber", num);
        return index > -1 ? reductionRule[index].RuleId : null;
    };
    function indexOfDir(dir, prop, n) {
        for (var i = 0, l = dir.length; i < l; i++) {
            if (i === l - 1) {
                if (n >= dir[i][prop]) {
                    return i;
                }
            }
            if (n >= dir[i][prop] && n < dir[i + 1][prop]) {
                return i;
            }
        }
        return -1;
    }

    HolidayBook.getRuleListForSubmit = function() {
        var result = '';
        var arr = [];

        jQuery('.J_preferentialContainer .J_preferentialContent').each(function() {
            jQuery(this).find('.radio-item.active:not(.disabled)').each(function() {
                var $this = jQuery(this);
                var ruleid = $this.attr('data-rule-id');
                var count=$this.find('input[type=number]').val();
                if(!ruleid) return;
                var promocode, amount;
                if(ruleid.indexOf(',')>=0) {
                    ruleid = $this.find('input[type=text]').attr('data-rule-id');
                    promocode = $this.find('input[type=text]').val();
                }
                ruleid = parseInt(ruleid);
                if(isNaN(ruleid)) {
                    ruleid = 0;
                }
                amount = parseFloat($this.attr('data-price'));
                if(isNaN(amount)) {
                    amount = 0;
                }

                if($this.find('input:radio').prop('checked')&&ruleid) {
                    arr.push({
                        "RuleId": ruleid,
                        "PromoCode": promocode || '',
                        "VirtualCouponNo": $this.attr('data-coupon-no') || '',
                        "VirtualAmount": amount,
                        'Count':count||0
                    });
                }
            });
        });

        result = JSON.stringify(arr);

        return result;
    };

    /**
     * @desc 优惠信息
     */
    var preferentials = {};

    preferentials.reductionRule = null;
    preferentials.hongbao = null;
    preferentials.commonHongBaoflag = false;
    //初始化方法
    preferentials.init = function () {
        preferentials.DataProcessing();
        preferentials.calculate();
        preferentials.defaultSelected();
        preferentials.preferentialRadio();
        preferentials.commonRedBag();
        preferentials.filterDate();
        preferentials.setTCRedBag();
    }
    //优惠数据处理
    preferentials.DataProcessing = function () {
        var data = {},
            redBag = [];
        if (preferential) {
            for (var i = 0; i < preferential.length; i++) {
                if (preferential[i].RuleType === 3) {
                    preferentials.reductionRule = preferential[i].RuleList;
                    reductionRule = preferential[i].RuleList;
                } else if (preferential[i].RuleType === 1 && preferential[i].RedPacketType === 1) {//通用红包
                    var json = {
                        "ruleId": preferential[i].RuleList[0].RuleId,
                        "code": preferential[i].RedPacketCode,
                        "price": preferential[i].RuleList[0].Discount,
                        "guishuId": preferential[i].GuiShuFangId,
                        "startDate": preferential[i].LineStartDate,
                        "endDate": preferential[i].LineEndDate
                    };
                    redBag.push(json);
                }
            }
            preferentials.hongbao = redBag;
        }
    }
    /**
     * @desc 当只有一个优惠的时候默认选中
     */
    preferentials.defaultSelected = function () {
        var radio = F.all(".radio"),
            icons = F.all(".preferential .icons"),
            usePreferential = F.dom(".use-preferential"),
            youhui = F.dom(".youhui");
        if (radio.length == 1 && icons.length == 1 && usePreferential.style.display == "block" ) {
            if (radio.hasClass("icons-empty")) {
                radio.removeClass("icons-empty").addClass("icons-solid");
            }
        }
    }
    /**
     * @desc 优惠数据刷新
     */
    preferentials.Refresh = function () {
        F.one(".ReductionDL").html("remove");

        var usePreferentialRadio = F.all(".radio");
        usePreferentialRadio.each(function (elem, i) {
            if (one(elem).hasClass("icons-solid")) {
                one(elem).removeClass("icons-solid").addClass("icons-empty");
            }
        });
        preferentials.calculate();

        F.one("#redBagCode").attr("isPass", "0");
        HolidayBook.allpriceFun();
        HolidayBook.calPaymentPrice();
        F.one("#redBagCode").val("").removeClass("input_error");
        F.one(".invalid_message").html("remove");
        F.one(".valid_symbol").html("remove");
        preferentials.filterDate();
        preferentials.setTCRedBag();
    }
    /**
     * @desc 优惠信息计算（多人立减、银行优惠、红包优惠）
     */
    preferentials.calculate = function () {
        var oReduction = fish.one(".ReductionDL .univalence b"),
            reductionPrice, reductionNum, reductionTotalPrice, oPeople, realPeople,
            oReductionDL = fish.dom(".ReductionDL"),
            usePreferential = F.dom(".people .use-preferential"),
            $preferential = F.one(".people .use-preferential"),
            $preferentialPrice = F.one(".people .use-preferential .price"),
            $preferentialNum = F.one(".people .use-preferential .num"),
            $bankPreferential = F.all(".bank .use-preferential"),
            $bankPreferentialNum = F.all(".bank .use-preferential .num"),
            $hongbao = F.one("#redBagCode");

        oPeople = HolidayBook.calculatePeopleNum();

        //银行优惠人数（成人，儿童）
        realPeople = oPeople.adult + oPeople.child;
        $bankPreferentialNum.html(realPeople);
        $bankPreferential.attr("num", realPeople);

        if (preferentials.reductionRule != null) {
            reductionPrice = HolidayBook.countReductionPrice(oPeople);
            reductionNum = HolidayBook.countReductionPerson(oPeople);
            reductionTotalPrice = HolidayBook.countReduction(oPeople);
            $preferentialPrice.html(reductionPrice);
            $preferentialNum.html(reductionNum);
            $preferential.attr("num", reductionNum);
            $preferential.attr("price", reductionPrice);
            $preferential.attr("ruleId", HolidayBook.getReductionRuleId());

            if (oReductionDL && reductionTotalPrice === 0) {
                oReductionDL.style.display = reductionTotalPrice === 0 ? "none" : "block";
                $preferential.children(".radio").removeClass("icons-solid").addClass("icons-empty");
            }
            if (usePreferential) {
                usePreferential.style.display = reductionTotalPrice === 0 ? "none" : "block";
            }
            if ($hongbao.attr("isPass") == "1") {
                F.one(".ReductionDL").css("display:block");
            }
        }
        if (preferentials.hongbao != null) {
            var bookDate = fish.one("#hidBookDate").val();
            var hongbaoDate = preferentials.commonRedBagDate(bookDate,preferentials.hongbao);
            $hongbao.data("hongbaoData", hongbaoDate);
        }
        //preferentials.defaultSelected();
    }

    /**
     * @desc 选择优惠
     */
    preferentials.preferentialRadio = function () {
        var usePreferential = F.all(".use-preferential"),
            radio = F.all(".radio"),
            redBagCode = F.one("#redBagCode");

        usePreferential.on("click", function () {
            var _this = F.one(this),
                children = _this.children(".radio"),
                txt = _this.attr("txt"),
                price = _this.attr("price"),
                num = _this.attr("num"),
                type = _this.attr("type"),
                ruleId = _this.attr("ruleId"),
                favorableTotalPrice = 0,
                number = 0;
            number = type === "1" ? 1 : num;
            favorableTotalPrice = price * number;
            if (children.hasClass("icons-empty")) {
                radio.removeClass("icons-solid").addClass("icons-empty");
                children.removeClass("icons-empty").addClass("icons-solid");
                F.one("#redBagCode").attr("isPass", "0");
                HolidayBook.allpriceFun();
                redBagCode.val("").removeClass("input_error");
                F.one(".invalid_message").html("remove");
                F.one(".valid_symbol").html("remove");
            } else {
                children.removeClass("icons-solid").addClass("icons-empty");
                //HolidayBook.discountCalculation(favorableTotalPrice, "add");
                HolidayBook.allpriceFun();
                F.one(".ReductionDL").html("remove");
            }
        });
    }
    /**
     * @param type 优惠类型（0：按人头 1：按单）
     * @param title 优惠的提示title（多人立减、银行优惠、红包优惠）
     * @param price 优惠的金额(按单或按人优惠的单价)
     * @param num 优惠的人数
     * @desc 右侧的优惠信息
     */
    preferentials.rightPreferential = function (type, title, price, num) {
        var strHtml = "",
            orderPrice = 0,
            number = 0,
            unit;
        number = type === "1" ? 1 : num;
        orderPrice = price * number;
        unit = type === "1" ? "单" : "人";
        strHtml += '<dl class="ReductionDL">'
            + '<dt>' + title + '</dt>'
            + '<dd><div class="boxL">'
            + '<span class="univalence"><b>' + price + '</b>元</span>×<b class="listnub" id="">' + number + '</b>' + unit
            + '</div>'
            + '<span class="separate boxL">-------------------------------------------</span>'
            + '<span class="colF60 font_W boxL"><strong class="orderPrice">-' + orderPrice + '</strong>元</span>'
            + '</dd>'
            + '</dl>';
        if (!F.one(".ReductionDL").length) {
            //var dom = document.createElement("dl")
            //dom.className = "ReductionDL none";
            //F.one(".R_top").html("bottom", dom);
            F.one(".R_top").html("bottom", "<dl class='ReductionDL'></dl>");
        }
        F.one(".ReductionDL").html("outer", strHtml);
    }
    /**
     * @param price 优惠总价
     * @param type 增加、减少优惠
     * @desc 优惠计算
     */
    preferentials.discountCalculation = function (price, type) {
        var totalPrice = F.one(".R_Bottom .f_price"),
            orderPrice = HolidayBook.rePositiveNum(totalPrice.html(), "int");
        if (type === "add") {
            orderPrice += HolidayBook.rePositiveNum(price, "int");
            F.one(".ReductionDL").html("remove");
        } else if (type === "reduction") {
            orderPrice -= HolidayBook.rePositiveNum(price, "int");
        }
        totalPrice.html(orderPrice);
    }
    /**
     * @desc 通用红包优惠码验证
     */
    window.verifyRebBag = function (code, elem) {
        var _this = fish.one(elem),
            usePreferentialRadio = F.all(".radio"),
            hongbaoData = _this.data("hongbaoData");
        for (var i = 0; i < hongbaoData.length; i++) {
            if (code === hongbaoData[i].code) {
                usePreferentialRadio.each(function (elem, i) {
                    if (one(elem).hasClass("icons-solid") && page_cf.preferential) {
                        one(elem).removeClass("icons-solid").addClass("icons-empty");
                    }
                });
                HolidayBook.allpriceFun();
                preferentials.rightPreferential("1", "出境红包", hongbaoData[i].price, "1");
                preferentials.discountCalculation(hongbaoData[i].price, "reduction");
                _this.attr("isPass", "1");
                F.one(".redBag-preferential").attr("ruleId", hongbaoData[i].ruleId);
                F.one(".redBag-preferential").attr("price", hongbaoData[i].price);
                F.one(".redBag-preferential").attr("guishuId", hongbaoData[i].guishuId);
                return true;
            } else {
                var usePreferentialRadio = F.all(".radio");
                F.one("#redBagCode").attr("isPass", "0");
                usePreferentialRadio.each(function (elem, i) {
                    if (one(elem).hasClass("icons-solid") && page_cf.preferential) {
                        one(elem).removeClass("icons-solid").addClass("icons-empty");
                    }
                });
                HolidayBook.allpriceFun();
                F.one(".ReductionDL").html("remove");
            }
        }
    }

    /**
     * @desc 通用红包
     */
    preferentials.commonRedBag = function () {
        var redBagCode = F.one("#redBagCode");
        var usePreferentialRadio = F.all(".radio");

        if (F.dom("#redBagCode") !== null) {
            redBagCode.on("blur", function () {
                var flag = false;
                usePreferentialRadio.each(function (elem, i) {
                    if (one(elem).hasClass("icons-solid")) {
                        flag = true;
                    }

                    if (flag) {
                        if (redBagCode.val() == "") {
                            redBagCode.attr("isPass", "0");
                            HolidayBook.allpriceFun();
                        }
                    } else {
                        if (redBagCode.val() == "") {
                            redBagCode.attr("isPass", "0");
                            HolidayBook.allpriceFun();
                            F.one(".ReductionDL").html("remove");
                        }
                    }
                });
            });
        }
    }
    /**
     * @desc 获取优惠规则id
     */
    preferentials.getRuleId = function () {
        var ruleId = 0,
            usePreferentialRadio = F.all(".radio"),
            redBagCode = F.one("#redBagCode");
        usePreferentialRadio.each(function (elem, i) {
            if (one(elem).hasClass("icons-solid") && page_cf.preferential) {
                ruleId = F.one(this).parent().attr("ruleId");
            }
        });
        //通用红包
        if (redBagCode.attr("isPass") === "1") {
            ruleId = redBagCode.parent().attr("ruleId");
        }
        return ruleId;
    }
    /**
     * @desc 获取归属方id
     */
    preferentials.getGuiShuId = function () {
        var guishuId = 0,
            usePreferentialRadio = F.all(".radio"),
            redBagCode = F.one("#redBagCode");
        usePreferentialRadio.each(function (elem, i) {
            if (one(elem).hasClass("icons-solid") && page_cf.preferential) {
                guishuId = F.one(this).parent().attr("guishuId");
            }
        });
        //通用红包
        if (redBagCode.attr("isPass") === "1") {
            guishuId = redBagCode.parent().attr("guishuId");
        }
        return guishuId;
    }

    /**
     * @desc 获取红包优惠码
     */
    preferentials.getRedBagCode = function () {
        var hongBaoCode = "",
            usePreferentialRadio = F.all(".cj-hongbao .radio"),
            redBagCode = F.one("#redBagCode");
        if (F.dom(".cj-hongbao") !== null) {
            usePreferentialRadio.each(function (elem, i) {
                if (one(elem).hasClass("icons-solid") && page_cf.preferential) {
                    hongBaoCode = F.one(this).parent().attr("code");
                }
            });
        }
        //通用红包
        if (redBagCode.attr("isPass") === "1") {
            hongBaoCode = redBagCode.val();
        }
        return hongBaoCode;
    }
    /**
     * @desc 获取同程红包优惠码
     */
    preferentials.getTCRedBagCode = function () {
        var tcHongBaoCode = "",
            usePreferentialRadio = F.all(".tcRedBag .radio");
        if (F.dom(".tcRedBag") !== null) {
            usePreferentialRadio.each(function (elem, i) {
                if (one(elem).hasClass("icons-solid")) {
                    tcHongBaoCode = F.one(this).parent().attr("code");
                }
            });
        }
        return tcHongBaoCode;
    }
    /**
     * @desc 获取同程红包优惠价格
     */
    preferentials.getTCRedBagAmount = function () {
        var hongBaoAmount = "",
            usePreferentialRadio = F.all(".tcRedBag .radio");
        if (F.dom(".tcRedBag") !== null) {
            usePreferentialRadio.each(function (elem, i) {
                if (one(elem).hasClass("icons-solid")) {
                    hongBaoAmount = F.one(this).parent().attr("price");
                }
            });
        }
        return hongBaoAmount;
    }
    /**
     * @desc 根据消费金额控制同程红包的显隐
     */
    preferentials.setTCRedBag = function () {
        var totalPrice = HolidayBook.rePositiveNum(F.one(".R_Bottom .f_price").html(), "int"),
            usePreferential = F.all(".tcRedBag .use-preferential"),
            hongBaoBox = fish.one(".hongbao-box"),
            bookDate = fish.one("#hidBookDate").val();
        usePreferential.each(function (elem, i) {
            var smallPrice = HolidayBook.rePositiveNum(one(elem).attr("small-price"), "int");
            var date = one(elem).parent(".tcRedBag").attr("date-range"),
                startDate = date.split("|")[0],
                endDate = date.split("|")[1];
            var flag = preferentials.diffDate(bookDate, startDate, endDate);
            //订单总额大于最小消费金额并且出行团期在优惠日期范围内
            if (totalPrice >= smallPrice && flag) {
                one(elem).parent(".tcRedBag").css("display:block;");
                one(elem).parent(".procedureBox").removeClass("none");
            } else {
                one(elem).parent(".tcRedBag").css("display:none;");
                one(elem).children(".radio").removeClass("icons-solid").addClass("icons-empty");
                //  F.one(".ReductionDL").html("remove");
            }
        });
        if (fish.dom(".hongbao-box") !== null) {
            preferentials.HandelTitle(hongBaoBox);//红包模块
        }
    }

    /**
     * @desc 根据优惠范围过滤相应优惠信息(不包含同程红包)
     */
    preferentials.filterDate = function () {
        var bookDate = fish.one("#hidBookDate").val(),
            preferential = fish.all(".cj-youhui"),
            commonHongbao = fish.one(".commom-hongbao"),
            youHuiBox = fish.one(".youhui-box");
        preferential.each(function (elem, i) {
            var date = one(elem).attr("date-range"),
                startDate = date.split("|")[0],
                endDate = date.split("|")[1];
            var flag = preferentials.diffDate(bookDate, startDate, endDate);
            if (!flag) {
                one(elem).css("display:none;");
            } else {
                one(elem).css("display:block;");
                one(elem).parent(".procedureBox").removeClass("none");
            }
        });

        //通用红包
        if (preferentials.commonHongBaoflag) {
            commonHongbao.css("display:block;");
        } else {
            commonHongbao.css("display:none;");
        }
        if (fish.dom(".youhui-box") !== null) {
            preferentials.HandelTitle(youHuiBox);//优惠信息模块
        }
    }
    /**
     * @desc 日期比较
     */
    preferentials.diffDate = function (bookDate, startDate, endDate) {
        var flag = false;
        var bDate = new Date(bookDate.replace(/\-/g, "\/"));
        sDate = new Date(startDate.replace(/\-/g, "\/"));
        eDate = new Date(endDate.replace(/\-/g, "\/"));
        if (bDate >= sDate && bDate <= eDate) {
            flag = true;
        }
        return flag;
    }
    /**
     * @desc 通用红包日期处理
     */
    preferentials.commonRedBagDate = function (bookDate, hongbaoData) {
        var bookDate = new Date(bookDate.replace(/\-/g, "\/"));
        var data = [];
        for (var i = 0; i < hongbaoData.length; i++) {
            var startDate = new Date(hongbaoData[i].startDate.split("T")[0].replace(/\-/g, "\/")),
                endDate = new Date(hongbaoData[i].endDate.split("T")[0].replace(/\-/g, "\/"));

            if (bookDate >= startDate && bookDate <= endDate) {
                preferentials.commonHongBaoflag = true;
                var json = {
                    "ruleId": hongbaoData[i].ruleId,
                    "code": hongbaoData[i].code,
                    "price": hongbaoData[i].price,
                    "guishuId": hongbaoData[i].guishuId,
                    "startDate": hongbaoData[i].startDate,
                    "endDate": hongbaoData[i].endDate
                };
                data.push(json);
            }
        }
        return data;
    }
    //
    preferentials.HandelTitle = function (obj) {
        var youhui = fish.all(".youhui",obj),
            flag = true;
        youhui.each(function (elem) {
            if (elem.style.display == "block") {
                flag = false;
            }
        });
        if (flag) {
            obj.addClass("none");
        }
    }
    //禁用所有计算人数的按钮
    HolidayBook.DisableAddBtn = function () {
        all(".add_btn").each(function (elem, i) {
            var parentEle = one(elem).parent();
            var inputEle = one("input", parentEle);
            if (inputEle.attr("data-caltype") == "1") {
                one(elem).addClass('add_btn_false');
            }
        });
    }
    //启用所有计算人数的按钮
    HolidayBook.EnableAddBtn = function () {
        all(".add_btn").each(function (elem, i) {
            var parentEle = one(elem).parent();
            var inputEle = one("input", parentEle);
            if (inputEle.attr("data-caltype") == "1") {
                one(elem).removeClass('add_btn_false');
            }
        });
    }

    //获取advanceDay参数，如果advanceDay不存在或者为0，则弹出提示信息出游前请您预留足够的签证办理时间。

    HolidayBook.advanceTips=function(){
        var day=page_cf.advanceDay,
            self=one(".advance-tip");
        if(!day||day==0){
            $(".order-submit").after('<div class="advance-tip">办理签证预计需要<em>7</em>天，出游前请您预留足够的签证办理时间</div>');
        }
    }
})(fish);
