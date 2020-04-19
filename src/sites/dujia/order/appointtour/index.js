/**
 * changed by ym/10862  on 2016/10/19
 * @desc 电子签约前出游人完善
 */
var tourEidt = {};
tourEidt.host = "//www.ly.com";
// tourEidt.host="http://dj.t.ly.com";
tourEidt.tourTpl = require("./tourlist.dot");
var dialog = require("dialog/0.2.0/dialog"),
    ajaxParam = {},
    $dialog = new dialog({
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
            html: '<div class="dialog_modal_gp">' +
                    '<div class="dialog_modal_content" data-dialog-content></div>' +
                    '</div>'
        }
    });
tourEidt.init = function(){

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
    // 参数赋值
    var theRequest = tourEidt.getUrlParam();
    tourEidt.count = theRequest.Count||"";
    $("#hidBookDate").val(theRequest.Date||"");
    ajaxParam = {
        CustomerSerialId: theRequest.CustomerSerialId||"",
        MemberId:getMemberId()||"",
        IsLogin: "1"
    };

    tourEidt.showTour();
};
tourEidt.getUrlParam = function(key){
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
};
// 出游人显示
tourEidt.showTour = function(){
    var thisurl = "/intervacation/api/ElectronicContract/QueryOrderPassegerListAdult";
    $.ajax({
        url: thisurl,
        type: "post",
        dataType: "json",
        data: ajaxParam,
        success: function (data) {
            var datas = data.Data.result;
            if(data.Status == "Success" && datas && datas.OrderPassegerLst && datas.OrderPassegerLst.length>0) {
                tourEidt.render({
                    "tpl": tourEidt.tourTpl,
                    "data": datas,
                    "context": ".order_conbg",
                    "callback": function () {
                        require('../ordertour/tours.js').init();
                        tourEidt.commitOrder();
                    }
                });
            }else{
                $(".order_conbg").html('<div class="o_tip">抱歉，没有查询到出游人，请检查订单是否是该账号下的订单！</div>');
            }
        },
        error: function(){
            $(".order_conbg").html('<div class="o_tip">抱歉，没有查询到出游人信息，请联系客服：4007-777-777</div>');
        }
    });
};
// 点击去签约
tourEidt.commitOrder = function(){
    $(".J_goAppoint").on("click",function(){
        if(window.submitForm){
            window.submitForm(function () {
                tourEidt.appointCheck();
            });
        }
    })
};
/**
 * @desc 去签约验证出游人
 * @ commitCheck
 */
tourEidt.appointCheck = function(){
    var content = '<div class="appoint_load">请稍后，您的签约合同正在努力生成中···</div>';
    var config = {
        content: content,
        width: 436,
        height:260,
        title: '',
        quickClose: false
    };
    $dialog2.modal(config);
    $(".dialog_modal_title").css({"height":"0"});
    $(".ui_dialog_mask.mask").css({"background-color":"rgba(3, 3, 3, 0.5)"});
    $(".default .dialog_modal_content").css({"margin-top":"0"});

    var thisurl = tourEidt.host + "/intervacation/api/ElectronicContract/SavePassengers";
    var param = {};
    param.PassengerString  = $("#hidPassenger").val();
    $.extend(param,ajaxParam);
    $.ajax({
        url: thisurl,
        data: param,
        type: "post",
        dataType: "json",
        success: function (data) {
            // 加载弹框关闭
            var parent = $(".appoint_load").parents(".ui_dialog_gp");
            parent.prev().css({"display":"none"});
            parent.css({"display":"none"});

            var dataInfro = data.Data.result;
            if(data.Status == "Success" && dataInfro && dataInfro.Status=="Success") {
                var urlParam = "CustomerSerialId=" + ajaxParam.CustomerSerialId;
                window.location.href = "/dujia/orderappoint?" + urlParam;
            }else{
                if(dataInfro && dataInfro.Message && dataInfro.Message!=""){
                    var context  = '<div class="fail_tip_s"><p><em></em><span>'+ dataInfro.Message +'</span></p></div>';
                    tourEidt.setFailTip(context);
                }else{
                    var context  = '<div class="fail_tip_s"><p><em></em><span>出游人保存不成功,请重新提交！</span></p></div>';
                    tourEidt.setFailTip(context);
                }
            }
        },
        error: function(data){
            var context  = '<div class="fail_tip_s"><p><em></em><span>出游人保存不成功,请重新提交！</span></p></div>';
            tourEidt.setFailTip(context);
        }
    });
};
/**
 * @desc 渲染逻辑同touch
 * @param config
 */
tourEidt.render = function (config) {
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
};
// 错误提示
tourEidt.setFailTip = function(context,widthV){
    var self = this;
    var config = {
        content: context,
        width: '436px',
        height: widthV|| '262px'
    };
    $dialog.modal(config);
    $(".dialog_modal_title").css({"height":"0"});
    $(".ui_dialog_mask.mask").css({"background-color":"rgba(3, 3, 3, 0.5)"});
    $(".default .dialog_modal_content").css({"margin-top":"0"});
};
tourEidt.init();






