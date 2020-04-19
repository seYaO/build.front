/**
 * @author 刘聪(lc07631@ly.com)
 * @module  订单详情页
 * @exports OrderDetail
 * @desc
 * 详情页的模块
 *
 */
/* global Config */
(function($){
    var tpl={};
    tpl.index = require("./ajaxdot/index.dot");
    var OrderDetail = {},
        IsClick = 1,
        Common = require("/modules-lite/common/index");


    //收起折叠
    OrderDetail.unfoldAndPack = function(){
        $(".J_hide_show").on("click",function(){
            var self = $(this),
                child = self.find("i"),
                siblings = self.next(".part-body");
            if(child.hasClass("unfold")){
                child.addClass("pack-up").removeClass("unfold");
                siblings.addClass("none");
                self.removeClass("border-bottom");
            } else {
                child.addClass("unfold").removeClass("pack-up");
                siblings.removeClass("none");
                self.addClass("border-bottom");
            }

        });
    };

    OrderDetail.clickInfo = function(){
        $(".order-info .J_hide_show").on("click",function(){
            if(!$(".order-info .part-body").html().trim().length){
                OrderDetail.info();
            }
        })
    };

    OrderDetail.info = function(){
        var lineId = $("#tcLineId").val(),
            url = OrderDetail.host + "/wanle/api/WanleBookAjax/GetWanLeOrderSingleDetail?LineId=" + lineId;
        Common.getData(url,function(data){
            Common.render({
                key: "index",
                data: data.Data,
                context: ".order-info .part-body",
                tmpl: tpl,
                callback: function(){
                }
            });
        });
    };

    OrderDetail.pay = function(){
        var flag;
        if(!flag){
            $(".bottom").on("click",function(){
                //    var orderId = $("#tcOrderId").val(),
                //        outSerialNo = $("#tcOutSerialNo").val(),
                //        payUrl = Config.getInterface("getWXWLOrderDetailPay") + "orderId=" + orderId +"&outSerilid=" + outSerialNo;
                //    $(this).html("支付中...");
                //    flag = true;
                //    Common.getData(payUrl,function(data){
                //        window.location.href = data.url;
                //    });
                //});
                IsClick = 0;
                var self = $(this);
                if(!self.hasClass("prohibit")){
                    //var customerSerialid = $("#CustomerSerialid").val(),
                    //    tcLineId = $("#tcLineId").val(),
                    //    tcOrderId = $("#tcOrderId").val(),
                    //    payUrl = Config.getInterface("getWXWLOrderDetailPay") + "CustomerSerialid=" + customerSerialid + "&tcLineId=" + tcLineId + "&tcOrderId=" + tcOrderId;
                    var orderId = $("#tcOrderId").val(),
                        outSerialNo = $("#tcOutSerialNo").val(),
                        payUrl = "/wanle/api/WWanleBook/GetWanlePayOrderUrl?orderId=" + orderId +"&outSerilid=" + outSerialNo;
                    $(this).html("支付中...");
                    flag = true;
                    Common.getData(payUrl,function(data){
                        window.location.href = data.Data.Url;
                    });
                }
            });
        }

    };


    OrderDetail.cancelStyle = function(){

        var tInput = $("#changremark");
        tInput.on("keydown", function () {
            var textareaVal = tInput.val().length;
            if (textareaVal > 30) {
                var substringVal = tInput.val().substring(0, 30);
                $("#changremark").val(substringVal);
            }
        }).on("keyup", function () {
            var textareaVal = tInput.val().length;
            $(".word_number").html(30-textareaVal);
            if (textareaVal > 30) {
                var substringVal = tInput.val().substring(0, 30);
                $("#changremark").val(substringVal);
                $(".word_number").html(30-substringVal.length);
            }
        });

        $(".J_cancel li").on("click",function(){
            var self = $(this);
            self.parents(".J_cancel").find(".cancel-left").removeClass("selected");
            self.find(".cancel-left").addClass("selected");
            if(self.hasClass("selectOther")){
                $(".cancel_reason").removeClass("none");
            } else {
                $(".cancel_reason").addClass("none");
            }
        });

        $(".cancel_Go").on("click",function(){
            var tInput = $("#changremark"),
                this_id = $("#tcOrderId").val(),
                checked = $(".J_cancel .selected"),
                checkedText = checked.siblings().text();
            if(checked.parent().hasClass("selectOther")){
                if(tInput.val()==""){
                    tInputVal = checkedText;
                } else {
                    tInputVal = checkedText +":"+ tInput.val();
                }
            } else {
                tInputVal = checkedText;
            }
            // Common.getData("/wanle/api/WWanleBook/WanleCancelOrder?siteType=1&OrderId="+this_id+"&CancelReason=" + encodeURIComponent(tInputVal), function (data) {

            // }, true);
            var params = "OrderId="+this_id+"&CancelReason=" + encodeURIComponent(tInputVal);

            $.ajax({
                url: OrderDetail.host + "/wanle/api/WWanleBook/WanleCancelOrder?siteType=1",
                type: "POST",
                dataType: "json",
                data:params,
                success: function(data) {
                }
            });
        })
    };

    OrderDetail.cancelOrder = function(){
        $(".cancel_btn").on("click",function(){
            var self = $(this);
            if(!self.hasClass("prohibit") && IsClick == 1){
                Common.redirect({
                    tag:"pick_cancel",
                    title: "取消订单",
                    afterFunc: function(){
                    }
                });
            } else {
                return;
            }
        });
        $(".cancel_Go").on("click",function(){
            Common.redirect({
                tag:"pick_canceled",
                title: "取消订单",
                afterFunc: function(){
                }
            });
        })
    };


    OrderDetail.goBack = function(){
        function set_navbar(){
            var jsonObj = {
                "param":{
                    "left":[{"tagname":"tag_click_back","value":"i_back"}]},
                "CBPluginName":"_tc_web_bar",
                "CBTagName":"set_navbar"
            };
            window._tc_bridge_bar.set_navbar(jsonObj);
        }

        //_tc_web_bar={};
        //window._tc_web_bar.set_navbar = function (data){
        //    if(data.tagname=="tag_click_back"){
        //        window.location.href = "tctclient://orderCenter/all?refresh=1&backToMine=1";
        //    }
        //};

        //var referApp = parseInt(Common.getQueryString("refer")); //如果等于4，表示从无线点评过来的，按照原轨迹走
        //if(Mobile.isApp() && referApp !== 4){
        //    set_navbar();
        //}
    };

    OrderDetail.init = function(){
        var self = this,
            share = require("/modules-lite/utils/share/index");
        share.disable();
        self.unfoldAndPack();
        self.clickInfo();
        self.pay();
        self.cancelStyle();
        self.cancelOrder();
        self.goBack();
        if(location.host.indexOf("wx") === -1){
            OrderDetail.host = "http://www.t.ly.com";
        } else {
            OrderDetail.host = "";
        }

        var changinfo = $("#changremark"),
            changinfoVal = changinfo.attr("attr-val");
        changinfo.val(changinfoVal);
    };
    module.exports = OrderDetail;
})(Zepto);
