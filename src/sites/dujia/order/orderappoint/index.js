/**
 * @des 在线签约
 * @date  ym/10862 2016/10/14
 *  */
// 由于弹框组件每一个生成的弹框点击背景也关闭，不好控制，自己写弹框
var Appoint = {},timer,
    orderParam = {
        Timecount : 60,
        ContractId:"",
        SignPersonId:"",
        signPhone:""
    },
    Login = require("login/0.1.0/index");
var tourTpl = require("./tourList.dot"),
    dialog = require("dialog/0.2.0/dialog");

// window.host="http://www.ly.com";
window.host="";
var $dialog = new dialog({
        skin: 'default',
        template: {
            tooltip: {
                width: '430px'
            }
        }
    }),
    $dialog2 = new dialog({
        skin: 'default',
        template: {
            tooltip: {
                width: '430px'
            }
        }
    });
Appoint = {
    init:function(){
        var self = this;
        if($(window).height()>680){   // 图片框高度
            var height = $(window).height()-330;
            $(".contract_doc").css({"height":height+"px"});
        }
        function getMemberId() {
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
        }
        Appoint.IsContractSigned = 0;  //是否已经同意签约
        Appoint.ajaxParam ={};
        Appoint.popCon ={};    // 弹框内容
        Appoint.popCon = {
            CodeCon: '',
            payCon: '<div class="pop_con pop_con2 J_pay_bg"><div class="pay">'+
                        '<div class="pay_tip_c">'+
                            '<p><em></em>您的合同已签约完成!</p>'+
                            '<a href="javascript:void(0)" class="J_pay pay_btu">去支付</a>'+
                        '</div>'+
                    '</div></div>',
            isPaidCon: '<div class="pop_con pop_con2 J_pay_bg"><div class="pay">'+
                        '<div class="pay_tip_c">'+
                            '<p><em></em>您的合同已签约完成!</p>'+
                        '</div>'+
                    '</div></div>',

        };

        var theRequest = this.getUrlParam();   // url获取参数
        Appoint.ajaxParam.MemberId= getMemberId() || "";
        // Appoint.ajaxParam.MemberId="105193819";
        Appoint.ajaxParam.CustomerSerialId =theRequest.CustomerSerialId||"";

        if(Appoint.ajaxParam.MemberId==""){   // 当前页面判断登录，如果已经进入，在当前清除cookie，则跳转登录
            var thisHref = decodeURIComponent(window.location.href);
            window.location.href = 'https://passport.ly.com/?pageurl=' + thisHref;
        }
        this.initappoint();
        this.initEvent();
        this.initDoc();
    },
    // 获取签约人
    initPassenger:function(paramNum){
        var self = this;
        $(".J_select_bg").html("");
        var params = {};
        params = {
            IsLogin: "1"
        };
        $.extend(params,Appoint.ajaxParam);
        $.ajax({
            url: window.host + "/intervacation/api/ElectronicContract/QueryOrderPassegerListAdult",
            type: "post",
            dataType: "json",
            data:params,
            success: function (data) {
                var passenger = data.Data.result,str = "",htmlList = "";
                if(data.Status == "Success" && passenger && passenger.OrderPassegerLst) {
                    passenger.status = "Success";
                }else{
                    passenger.status = "failTure";
                }
                self.render({
                    "tpl": tourTpl,
                    "data": passenger,
                    "context": ".J_select_bg",
                    "callback": function () {
                    }
                });
                $(".J_tipCode").html("");
                var context = $(".J_select_bg").html();
                 self.setShowInfro(context);
            }
        });
    },
    // 获取合同信息
    initappoint:function(){
        var self = this;
        $.ajax({
            url: window.host + "/intervacation/api/ElectronicContract/GetOrderContractInfo",
            type: "post",
            dataType: "json",
            data:Appoint.ajaxParam,
            success: function (data) {
                var datas = data.Data.result,str = "",htmlList = "";
                if(datas){
                    if(data.Status =="Success" && datas.IsSucess && datas.ContractImgs.length>0){
                        for(i=0;i<datas.ContractImgs.length;i++){
                            str += '<img src=' + datas.ContractImgs[i] + ' alt="">';
                        }
                        htmlList = str;
                        orderParam.ContractId = datas.ContractId;
                        // 是否已经确认签约人  true 确认
                        // if(datas.IsExistSignPerson && datas.IsExistSignPerson===true){
                            Appoint.isContactP = true;
                        // }
                        // 是否用过验证码 true 没有验证过
                        // if(datas.IsHasNoUseCode && datas.IsHasNoUseCode===true){
                            Appoint.isUseCode = true;
                        // }else{
                        //     Appoint.isUseCode = false;
                        // }
                        Appoint.IsContractSigned = datas.IsContractSigned;
                        var isPay = datas.IsPaid || 0;
                        var text = "";
                        if (datas.IsContractSigned && isPay) {
                            text = "合同已签约";
                            $(".J_appoint").addClass("disabled");
                        } else if (datas.IsContractSigned) {
                            text = "去支付";
                        } else if (isPay) {
                            text = "同意签约";
                        } else {
                            text = "同意并去支付"
                        }
                        $(".J_appoint").text(text).css({"display":"block"});
                    }else{
                        if(datas.ErrorMsg && datas.ErrorMsg!=""){
                            htmlList = '<div>抱歉，'+  datas.ErrorMsg +'</div>';
                        }else{
                            htmlList = '<div>抱歉，请刷新页面重新获取合同信息！</br>重新未获取到合同信息，请联系客服：4007-777-777</div>';
                        }
                    }
                    $(".contract_doc").html(htmlList);
                }else{
                    $(".contract_doc").html('<div>抱歉，请检查订单是否是该账号下的订单！</div>');
                }
            },
            error:function(){
                $(".contract_doc").html('<div>抱歉，未获取到合同信息，请联系客服：4007-777-777</div>');
            }
        });
    },

    initEvent:function(){
        var self = this;
        // 去支付
        $(document).on("click",".J_pay",function(){
            var param = {
                customerSerialId : Appoint.ajaxParam.CustomerSerialId,
            };
            $.ajax({
                url: window.host + "/intervacation/api/OrderHandler/GetPayLinkBySignOnLine",
                data: param,
                dataType: "jsonp",
                success: function (data) {
                    var datas = data.Data;
                    if(datas.IsSuccess && datas.Url && datas.Url!=""){
                        window.location.href = datas.Url;
                    }else{
                        var context = '<div class="fail_tip_s"><p><em></em><span>' + datas.Message+ '</span></p></div>';
                        self.setFailTip(context,"262px");
                    }
                }
            });
        });
        // 点击签约按钮  注意：预订人非出游人时弹出，预订人在出游人行列时，直接带出验证界面（即直接发送短信到签约人手机）
        $(document).on("click",".J_appoint",function(e){
            e.stopPropagation;
            if ($(this).hasClass("disabled")) {
                return;
            }
            var signText = $(this).text();
            // 没有确认签约人
            if(!Appoint.isContactP && !Appoint.isUseCode){
                self.initPassenger();
                return false;
            }
            // 验证码是否使用过
            if(Appoint.isContactP && !Appoint.isUseCode){
                var context = $(".J_phone_bg").html();
                self.setShowInfro(context,"284px");
                orderParam.Timecount = 60;
                self.newTimeCount();
            }
            //是否已经同意签约
            if(Appoint.isContactP && Appoint.isUseCode && Appoint.IsContractSigned==0){
                $.ajax({     // 同意签约
                    url: window.host + "/intervacation/api/ElectronicContract/AgreeEleContractSign",
                    type: "post",
                    data: $.extend(Appoint.ajaxParam, {"Platform": 1}),
                    dataType: "json",
                    success: function (data,callback) {
                        var result = data.Data.result;
                        if(data.Status == "Success" && result && result.Status == "Success"){
                            if (signText == "同意签约") {
                                var popDom = Appoint.popCon.isPaidCon;
                                self.setShowInfro(popDom);
                                window.location.reload();
                            } else {
                                var context = Appoint.popCon.payCon;
                                self.setShowInfro(context);
                            }

                        }else if(data.Status == "Success" && result && result.Status == "Failure"){
                            var context = '<div class="fail_tip_s"><p><em></em><span>'+ result.Message +'</span></p></div>';
                            self.setFailTip(context);
                            return false;
                        }else{
                            var context = '<div class="fail_tip_s"><p><em></em><span>没有查询到签约信息，请咨询客服</span></p></div>';
                            self.setFailTip(context);
                            return false;
                        }
                    }
                });
            }
            if(Appoint.isContactP && Appoint.isUseCode && Appoint.IsContractSigned==1){
                var context = Appoint.popCon.payCon;
                self.setShowInfro(context);
                $(".J_pay").eq(0).click();
                return false;
            }
        });

        $(document).on("click",".J_person dd",function(){
            var el = $(this),
                cur = $(".J_person dt.select-per");
            var phone = $(el).attr("data-phone"),
                signId = $(el).attr("data-id");
            cur.html($(el).text());
            orderParam.SignPersonId = signId;
            orderParam.signPhone = phone;
        });

        $(document).on("click",".dialog_modal_gp .close,.cancel_all",function(){
            var self = this;
            var el = $(this),
                parent = el.parents(".ui_dialog_gp");
            parent.prev().css({"display":"none"});
            parent.css({"display":"none"});
        });
        $(document).on("click",".dialog_modal_gp .close,.J_phone_cancel",function(){
            clearTimeout(timer);
            orderParam.Timecount = 60;
            self.setcountDown();
        });

        //选择签约人确认事件,发送手机验证码，显示发送手机验证码弹框
        $(document).on("click",".J_select_confirm",function(e){
            e.stopPropagation;
            // 签约人确认发送手机号码
            var thisUrl = window.host + "/intervacation/api/ElectronicContract/SelectEleContractPerson",
                param = {},
                ContractId = orderParam.ContractId;
            params = {
                SignPersonId: orderParam.SignPersonId,  //签约人id
                ContractId: ContractId
            };
            $.extend(params,Appoint.ajaxParam);
            if(params.SignPersonId!=""){
                $.ajax({
                    url: thisUrl,
                    type: "post",
                    data: params,
                    dataType: "json",
                    success: function (data) {
                        var datas = data.Data.result;
                        if(data.Status == "Success" && datas && datas.Status == "Success"){
                            // 选择同意后发送验证码
                            clearTimeout(timer);
                            orderParam.Timecount = 60;
                            self.newTimeCount();
                            $(".J_PhoneNum").html(orderParam.signPhone);
                            var context = $(".J_phone_bg").html();
                            self.setShowInfro(context,"284px");
                            $(".J_tipCode").html("");
                        }else if(data.Status == "Success" && datas && datas.Status == "Failure"){  //失败
                            var context = '<div class="fail_tip_s"><p><em></em><span>'+ datas.Message +'</span></p></div>';
                            self.setFailTip(context);
                            return false;
                        }
                    }
                });
            }
        });
        // 重新选择出游人
        $(document).on("click",".J_s_new",function(e){
            self.initPassenger();
            clearTimeout(timer);
            orderParam.Timecount = 60;
            self.setcountDown();
        });

        $(document).on("click",".J_phone_confirm",function(e){
            var el = $(this),
                code = $.trim($(".dialog_modal_content .J_code").val()),
                tipCode = $(".J_tipCode"),
                reg = /\d{6}/;
            // 验证验证码
            if(code){
                if(reg.test(code)){
                    var thisUrl = window.host + "/intervacation/api/ElectronicContract/CheckVerificationCode",
                    param={};
                    param = {
                        VerificationCode: code //验证码
                    };
                    $.extend(param,Appoint.ajaxParam);
                    $.ajax({
                        url: thisUrl,
                        type: "post",
                        data: param,
                        dataType: "json",
                        success: function (data) {
                            var datas = data.Data.result;
                            if(data.Status == "Success" && datas && datas.Status == "Success"){
                                $.ajax({     // 同意签约
                                    url: window.host + "/intervacation/api/ElectronicContract/AgreeEleContractSign",
                                    type: "post",
                                    data: $.extend(Appoint.ajaxParam, {"Platform": 1}),
                                    dataType: "json",
                                    success: function (data,callback) {
                                        var result = data.Data.result;
                                        if(data.Status == "Success" && result && result.Status == "Success"){
                                            var context = Appoint.popCon.payCon;
                                            self.setShowInfro(context);
                                        }else if(data.Status == "Success" && result && result.Status == "Failure"){
                                            var context = '<div class="fail_tip_s"><p><em></em><span>'+ result.Message +'</span></p></div>';
                                            self.setFailTip(context);
                                            return false;
                                        }else{
                                            var context = '<div class="fail_tip_s"><p><em></em><span>没有查询到签约信息，请咨询客服</span></p></div>';
                                            self.setFailTip(context);
                                            return false;
                                        }
                                    }
                                });
                            }else if(data.Status == "Success" && datas && datas.Status == "Failure"){
                                var context = '<div class="fail_tip_s"><p><em></em><span>'+ datas.Message +'</span></p></div>';
                                self.setFailTip(context);
                                return false;
                            }else{ //签约不成功
                                var context = '<div class="fail_tip_s"><p><em></em><span>签约不成功，请重新刷新页面提交信息</span></p></div>';
                                return false;
                            }
                        }
                    });
                }else{
                    $(".J_tipCode").html(self.tipShow("输入验证码有误"));
                    return false;
                }
            }else{
                tipCode.html(self.tipShow("请输入验证码"));
                return false;
            }
        });

        $(document).on("input propertychange",".J_code",function(){
            var el = $(this),
            code = $.trim($(".J_code").val());
            if(code){
                $(".dialog_modal_content .J_tipCode").html("");
            }
        });

        $(document).on("click",".J_newTime",function(){
            clearTimeout(timer);
            orderParam.Timecount = 60;
            self.newTimeCount();
        });
        // 选择签约人
        $(document).on("click",".J_person",function(){
            var el = $(this);
            if(el.hasClass("s_hover")){
                el.removeClass("s_hover");
            }else{
                el.addClass("s_hover");
            }
        });
    },
    newTimeCount : function(){
        var self = this;
        self.setcountDown();
        self.getPhoneCode();
    },
    // 倒计时
    setcountDown: function(){
        var self = this;
        var obj = $(".J_countDown");
        if (orderParam.Timecount == 0) {
            obj.val("重新发送");
            obj.addClass("J_newTime");
            return;
        } else {
            obj.val(orderParam.Timecount+"s");
            orderParam.Timecount--;
        }
        timer = setTimeout(function() {
            self.setcountDown(obj)
        },1000);
    },
    // 获取验证码
    getPhoneCode :function(){
        var self = this,
            param={};
        if(!Appoint.isContactP){
            param = {
                SignPersonId: orderParam.SignPersonId
            };
        }
        $.extend(param,Appoint.ajaxParam);
        $(".J_tipCode").html("");
        $.ajax({
            url: window.host + "/intervacation/api/ElectronicContract/SendVerificationCode",
            type: "post",
            data: param,
            dataType: "json",
            success: function (data) {
                var datas = data.Data.result;
                if(data.Status == "Success" && datas && datas.Status=="Success") {
                    $(".J_tipCode").html("");
                    return false;
                }else{
                    if(!Appoint.isContactP){
                        $(".J_tipCode").html(self.tipShow(datas.Message));

                    }else if(datas && datas.Message){
                        var context = '<div class="fail_tip_s"><p><em></em><span>'+datas.Message + '</span></p></div>';
                        self.setFailTip(context);
                    }else{
                        var context = '<div class="fail_tip_s"><p><em></em><span>获取验证码失败，请稍后重新获取</span></p></div>';
                        self.setFailTip(context);
                    }
                }
            },
            error:function(){
                if(!Appoint.isContactP){
                    $(".J_tipCode").html(self.tipShow("未获取到验证码，请稍后重新发送"));
                }else{
                    var context = '<div class="fail_tip_s"><p><em></em><span>未获取到验证码，请稍后重新发送</span></p></div>';
                    self.setFailTip(context);

                }
            }
        });
    },
    setShowInfro : function(context,widthV){
        var self = this;
        var config = {
            content: context,
            width: '436px',
            height: widthV|| '262px',
            quickClose: false
        };
        $dialog2.modal(config);
        $(".dialog_modal_title").css({"height":"0"});
        $(".ui_dialog_mask.mask").css({"background-color":"rgba(3, 3, 3, 0.5)"});
        $(".default .dialog_modal_content").css({"margin-top":"0"});
    },
    setFailTip:function(context,widthV){
        var self = this;
        var config = {
            content: context,
            width: '436px',
            height: widthV|| '262px',
            quickClose: false
        };
        $dialog.modal(config);
        $(".dialog_modal_title").css({"height":"0"});
        $(".ui_dialog_mask.mask").css({"background-color":"rgba(3, 3, 3, 0.5)"});
        $(".default .dialog_modal_content").css({"margin-top":"0"});
    },
     // 获取附件显示
    initDoc: function(){
        var self = this;
        var thisUrl = window.host + "/intervacation/api/ElectronicContract/QueryContractSubFiles";
        $(".other_doc .loading_c").removeClass("none");
        var param = {
            MemberId : Appoint.ajaxParam.MemberId,
            CustomerSerialId :Appoint.ajaxParam.CustomerSerialId,
            OrderId:Appoint.ajaxParam.OrderId
        };
        $.ajax({
            url: thisUrl,
            type: "post",
            dataType: "json",
            data:param,
            success: function (data) {
                $(".other_doc .loading_c").addClass("none");
                var datas = data.Data.result,str = "",htmlList = "";
                if(datas && data.Status =="Success" && datas.FileList && datas.FileList.length>0){
                    for(i=0;i<datas.FileList.length;i++){
                        if(datas.FileList[i].Url && datas.FileList[i].Url!=""){
                            str += '<a target="_blank" href='+ datas.FileList[i].Url +'>'+ datas.FileList[i].Name +'</a>';
                        }
                    }
                    htmlList = '<em>附属文件：</em>' + str;
                }else{
                    htmlList = '<em>附属文件：抱歉，暂没有附属文件！请联系客服</em>';
                }
                $(".other_doc").html(htmlList);
            }
        });
    },
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

    render:function(config){
        var self = this;
        var key = config.key,
            tpl = config.tpl[key] || config.tpl,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback;
        var html,cxt;
        html = tpl(data);
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    },
    tipShow:function(data){
        var self = this;
        return '<span class="tip_code"><em></em>'+ data +'</span>';
    },
};
module.exports = Appoint;
