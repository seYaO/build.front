/**
 * Created by lw00575 on 0015 2015/2/15
 * changed by ym/10862  on 2016/10/19
 * @desc 新增预订成功页出游人完善
 * @process 所有订单进入预订成功页，订单无需确认，页面显示出游人，如果信息不全，完善并去签约；如果带确认，则不显示出游人，待同程确认后，在订单详情页去签约
 */

var sproBook = {};
sproBook.host = "//www.ly.com";
// sproBook.host="//dj.t.ly.com";
sproBook.tourTpl = require("./tourlist.dot");


var login = require("login/0.1.0/index"),
    dialog = require("dialog/0.2.0/dialog"),
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

sproBook.init = function(){
    // 判断登录
    var self = this;
    if (!window.isLogin) {
        sproBook.checkLogin(function (isLogin) {
            if(!isLogin) {
                location.reload();
            }
        });
        window.isLogin = true;
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
    ajaxParam = {
        CustomerSerialId : $("#hidCustomerSerialId").val() || ""
    }

    if(getMemberId() &&  getMemberId()!="0"){
        ajaxParam.MemberId = getMemberId();
        ajaxParam.IsLogin = "1";
    }else{
        ajaxParam.MemberId =  $("#encryptUserId").val();
        ajaxParam.IsLogin = "0";

    }

    sproBook.showMore('#lineInfoId .hide-more','#lineInfoId .show-more','#lineInfoId .show-line',0);
    sproBook.showMore('#lineInfoId .show-more','#lineInfoId .hide-more','#lineInfoId .show-line',1);

    sproBook.showMore('#lineDetailId .hide-more','#lineDetailId .show-more','#subLineDetailId',0);
    sproBook.showMore('#lineDetailId .show-more','#lineDetailId .hide-more','#subLineDetailId',1);
    // 判断是否是待确认订单，不显示出游人
    if(($("#OrderFlag") && $("#OrderFlag").val()=="W") || ($("#IsSuperFree") && $("#IsSuperFree").val()=="true")){
        return false;
    }else{
        if($("#IsNeedElectronicSignature") && $("#IsNeedElectronicSignature").val()=="1"){
            sproBook.showTour();
        }else{
            return false;
        }

    }

};
// 出游人显示
sproBook.showTour = function(){
    var thisurl = sproBook.host + "/intervacation/api/ElectronicContract/QueryOrderPassegerListAdult";
    $.ajax({
        url: thisurl,
        type: "post",
        dataType: "json",
        data: ajaxParam,
        success: function (data) {
            var datas = data.Data.result;
            if(data.Status == "Success" && datas && datas.OrderPassegerLst) {
                datas.count = parseInt($("#hidNumAdult").val());
                sproBook.render({
                    "tpl": sproBook.tourTpl,
                    "data": datas,
                    "context": ".J_appInfro",
                    "callback": function () {
                        require('../ordertour/tours.js').init();
                        sproBook.commitOrder();
                    }
                });
            }
        }
    });
};
// 点击去签约
sproBook.commitOrder = function(){
    $(".J_goAppoint").on("click",function(){
        if(window.submitForm){
            window.submitForm(function () {
                sproBook.appointCheck();
            });
        }
    })
};
/**
 * @desc 去签约验证出游人
 * @ commitCheck
 */
sproBook.appointCheck = function(){
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

    var thisurl = sproBook.host + "/intervacation/api/ElectronicContract/SavePassengers";
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
                if(dataInfro && dataInfro.Message &&  dataInfro.Message!=""){
                    var context  = '<div class="fail_tip_s"><p><em></em><span>'+ dataInfro.Message+ '</span></p></div>';
                    sproBook.setFailTip(context);
                }else{
                    var context  = '<div class="fail_tip_s"><p><em></em><span>出游人保存不成功,请重新提交！</span></p></div>';
                    sproBook.setFailTip(context);
                }
            }
        },
        error: function(data){
            var context  = '<div class="fail_tip_s"><p><em></em><span>出游人保存不成功,请重新提交！</span></p></div>';
            sproBook.setFailTip(context);
        }
    });
};

sproBook.setFailTip = function(context,widthV){
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
// 渲染页面
sproBook.render = function (config) {
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
/**
 * @desc 初始化登录组件
 * @param callback
 */
sproBook.initLogin = function(callback){
    var self = this,
        Login = require("login/0.1.0/index");
    var login = new Login({
        loginSuccess: function(){
            callback.call(self);
        },
        unReload: true
    });
};
/**
 * @desc 检查是否登录,并执行登录后回调
 * @param callback 登录后的操作逻辑
 */
sproBook.checkLogin = function(callback){
    var cnUser = $.cookie("us");
    if(!(/userid=\d+/.exec(cnUser))){
        sproBook.initLogin(callback);
        return;
    }
    callback && callback.call(this,true);
    return true;
};
/**
 *
 * @param cDom 点击的元素
 * @param ccDom 另一个点击的元素
 * @param sDom 需要显示隐藏的元素
 * @param type 默认状态 1 显示，0 隐藏
 */
sproBook.showMore = function(cDom,ccDom,sDom,type){
    var cDom = fish.one(cDom), sDom = fish.one(sDom), ccDom = fish.one(ccDom);
    cDom.on('click',function(){
        type === 1 ? sDom.css("display: block") : sDom.css("display: none");
        fish.one(this).css("display: none");
        ccDom.css("display: block");
        var evt = evt || window.event;
        if (evt.preventDefault) {
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            evt.returnValue = false;
            evt.cancelBubble = true;
        }
    });
};

sproBook.init();

//调查问卷接入knowFor
fish.admin.config({
    knownFor: { v: "0.1",css:1, g: 1504010003 }
});
fish.one('.order-survey').knownFor({project:8})



