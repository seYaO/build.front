var Common = require("common/0.1.0/index"),
    Dialog = require("/modules/dialog/0.3.0/index");
var fileDialog, tip;
var Check = {
    init: function (cfg) {
        var self = this;
        self.initEvent(cfg);
    },
    initEvent: function (cfg) {
        var imageArr = [];
        imageArr = cfg.Images.split(",");
        cfg.Images = imageArr;
        var self = this,
            isSign = !($(".pay-info") && $(".pay-info").length),
            isLoad = parseInt($("#hidIsNeedLoad").val()),
            loadType = parseInt($("#hidLoadType").val());
        if (!($(".part-btn") && $(".part-btn").length)) {
            $(".part-list img:last-child").css("margin-bottom", "1.25rem");
        }
        if (isSign){
            $(".part-list img:last-child").css("margin-bottom", "7.3rem");
        }
        $(".J_Pay").on("click", function () {
            if  (isLoad) {
                self.conDialog("请先登录账户", {
                    "确定": function () {
                        var url = encodeURIComponent(window.location.href);
                        if (!loadType) {
                            window.location.href = "http://passport.ly.com/m/login.html?returnUrl=" + url;
                        } else {
                            window.location.href = window.location.href + "&mid=tcwvmid&tcwvclogin";
                        }
                        this.close();
                    }
                });
                return;
            }
            $.ajax({
                url: '/intervacation/api/VipClub/PostContractSign',
                data: "param=" + encodeURIComponent(JSON.stringify(cfg)),
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data && data.Data.IsSuccess) {
                        if (!isSign) {
                            self.tipDialog("<div class='icon_success'></div><div style='text-align:center; margin-top:10px; font-size:1.333333333rem;'>您已签约成功</div>");
                        }
                        window.location.href = data.Data.PayLink;
                    } else {
                        self.conDialog(data.Data.Message, {
                            "确定": function () {
                                this.close();
                            }
                        });
                    }
                }
            });
        });
    },
    conDialog: function (content, btn) {
        if (fileDialog) {
            fileDialog.destroy();
        }
        fileDialog = $.dialog({
            buttons: btn,
            width: 270,
            content: content
        });
        fileDialog.open();
    },
    tipDialog: function (content) {
        if (tip) {
            tip.destroy();
        }
        tip = $.dialog({
            content: content,
            style:'tip',
            width: '16.75rem',
            closeTime: 500
        });
        tip.open();
    }
};
module.exports = Check;