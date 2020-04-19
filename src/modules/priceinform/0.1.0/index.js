define("priceinform/0.1.0/index", ["calendar/0.2.0/index", "dialog/0.2.0/dialog", "./form.dot", "./success.dot", "./error.dot"], function (require, exports, module) {
    var Dialog = require("dialog/0.2.0/dialog");
    require("calendar/0.2.0/index");
    var $dialog = new Dialog({
        skin: 'skin2',
        template: {
            modal: {
                width: '600px',
                height: '440px',
                html: '<div class="jiangjia_gp">' +
                    '<div class="title_gp"><span  data-dialog-title></span>' +
                    ' <span class="title_close" data-dialog-hide></span>' +
                    '</div>' +
                    '<div class="main_gp" data-dialog-content></div>' +
                    '</div>'
            }
        }
    });

    var $fn = $fn || {};
    $fn.getJsonp = function (url, callback, error, complete) {
        $.ajax({
            type: 'get',
            url: url,
            dataType: 'jsonp',
            success: function (data) {
                //monitorModule.log('url:' + url + ',success:' + JSON.stringify(data), 'success', 'pc_zhuanti_1111');
                callback(data);
            },
            error: function (err) {
                monitorModule.log('url:' + url + ',err:' + JSON.stringify(err), 'error', 'pc_zhuanti_1111');
                if (error) {
                    error();
                }
            }, complete: function () {
                if (complete) {
                    complete();
                }
            }
        });
    };

    var jiangjia = {
        init: function (conf) {
            this.conf = conf;
            var self = this;
            this.initControl();
            $(conf.ele).click(function () {
                self.showForm();
                //self.showError();
            });
        },
        initCalendar: function () {
            var o_startTime = $("#startTime");
            var o_endTime = $("#endTime");
            //var tmpl = '<a target="_blank" href="javascript:;"><span class="date">{dateStr}</span><div><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span></div></a>';
            var tmpl = '<span class="d">{dateStr}</span>';
            var self = this;
            var cal = new $.Calendar({
                skin: "white",
                width: 1000
            });
            var cal2 = new $.Calendar({
                skin: "white",
                width: 1000
            });
            var smallcal = -70;
            if ($(".content").hasClass("Small_conter")) {
                smallcal = -25;
            }
            var nowtime = new Date();
            var _startime = nowtime;
            //var _endtime = nowtime;

            _startime.setDate(nowtime.getDate() + 1);
            //_endtime.setDate(nowtime.getDate() + 2);

            var startime = _startime.getFullYear() + "-" + (_startime.getMonth() + 1) + "-" + (_startime.getDate());
            //var endtime = _endtime.getFullYear() + "-" + (_endtime.getMonth() + 1) + "-" + (_endtime.getDate());


            //o_startTime.val(startime);
            //o_endTime.val(startime);
            o_startTime.attr("attr-timeb", startime);
            o_startTime.on("focus", function () {
                var endtime = o_endTime.val() === "" ? "2020-12-12" : $("#endTime").val();
                cal.pick({
                    elem: this,
                    startDate: startime,
                    endDate: endtime,
                    mode: "rangeFrom",
                    offset: {
                        left: smallcal
                    },
                    currentDate: [$("#startTime").attr("attr-timeb")],
                    fn: function (year, month, day, td) {
                        cal2.pick({
                            elem: $("#endTime"),
                            mode: "rangeTo",
                            offset: {
                                left: -90
                            },
                            startDate: o_startTime.val() !== "" ? o_startTime.val() : o_startTime.attr("attr-timeb")
                        });
                    }
                });
            });
            o_endTime.on("focus", function () {
                cal2.pick({
                    elem: this,
                    mode: "rangeTo",
                    offset: {
                        left: smallcal
                    },
                    startDate: o_startTime.val() !== "" ? o_startTime.val() : o_startTime.attr("attr-timeb")
                });
            });
        },
        initControl: function () {
            this.informhtml = require("./form.dot");
            this.sucesshtml = require("./success.dot");
            this.errorhtml = require("./error.dot");
        },
        initEvent: function () {
            var self = this;
            var conf = self.conf;
            var $tbxprice = $("#tbxjj_price");
            var $tbxjj_mobile = $("#tbxjj_mobile");
            var $tbxjj_code = $("#tbxjj_code");
            var $btnjj_getmsg = $("#btnjj_getmsg");

            $tbxprice.val(conf.getPrice());
            $tbxprice.on("keypress", function () {
                keyPress(this);
            });
            $tbxprice.on("keyup", function () {
                keyUp(this);
            });
            $tbxprice.on("blur", function () {
                onBlur(this);
                var _v = $tbxprice.val();
                if (_v == null || _v == "") {
                    $tbxprice.parent().removeClass("active")
                }

            });
            $tbxprice.on("focus", function () {
                $tbxprice.parent().addClass("active")
                //this.value = "￥" + this.value;
            });

            $tbxjj_mobile.on("keypress", function () {
                keyPress(this);
            });
            $tbxjj_mobile.on("keyup", function () {
                keyUp(this);
            });
            $tbxjj_mobile.on("blur", function () {
                onBlur(this);
                fn_valiMobile();
            });
            $tbxjj_mobile.on("focus", function myfunction() {
                $("#lbvali_mobile").hide();
            })

            $tbxjj_code.on("blur", function () {
                fn_valiCode();
            });
            $tbxjj_code.on("focus", function myfunction() {
                $("#lbvali_code").hide();
            })

            $("#btnjj_submit").click(function () {
                var price = $("#tbxjj_price").val();
                var starttime = $("#startTime").val();
                var endtime = $("#endTime").val();
                var username = $("#tbxjj_name").val();
                var mobile = fn_valiMobile();
                var code = fn_valiCode();
                var lineid = conf.getLineID();
                if (!mobile) {
                    return;
                }
                if (!code) {
                    return;
                }
                var url =window.host+'/intervacation/api/DepreciateNotification/GetDepreciateNotification?siteType=0&code=' + code + '&lineid=' + lineid + '&phone=' + mobile;
                if (price) {
                    url += '&expectPrice=' + price;
                }
                if (starttime) {
                    url += '&startTime=' + starttime;
                }
                if (endtime) {
                    url += '&endTime=' + endtime;
                }
                if (username) {
                    url += '&userName=' + username;
                }
                $fn.getJsonp(url, function (data) {
                    var status = data.Code;
                    switch (status) {
                        case 3100: {
                            $("#tbxjj_code").val('');
                            $("#lbvali_code").text("请输入正确的短信验证码");
                            $("#lbvali_code").show();
                            break;
                        }
                        case 3000: {
                            //参数错误
                            self.showError(data.Des);
                            break;
                        }
                        case 4000: {
                            //成功
                            self.showSuccess();
                            break;
                        }
                        default:
                            //参数错误
                            self.showError(data.Des);
                            break;

                    }
                }, function () {
                    self.showError();
                });
            });

            var isClick = false;
            $btnjj_getmsg.click(function () {
                var url = window.host+'/intervacation/api/SendMessage/GetSendMsgStatus?siteType=0&phone=';
                var mobile = fn_valiMobile();
                if (!mobile) {
                    return;
                }
                if (isClick) {
                    return;
                }
                isClick = true;
                $btnjj_getmsg.addClass("disable");

                var obj = $(this);
                var maxnum = 60;
                obj.text(maxnum + 'S');

                var _djs = setInterval(function () {
                    maxnum--;
                    obj.text(maxnum + 'S');
                    if (maxnum <= 0) {
                        clearInterval(_djs);
                        obj.text('重新发送');
                        isClick = false;
                        $btnjj_getmsg.removeClass("disable");
                    }
                }, 1000);

                $fn.getJsonp(url + mobile, function (data) {
                    console.log(data);
                }, function () {

                }, function () {

                });
            });


            function keyPress(ob) {
                if (!ob.value.match(/^[\+]?\d*?\.?\d*?$/))
                    ob.value = ob.t_value;
                else ob.t_value = ob.value;
                if (ob.value.match(/^(?:[\+]?\d+(?:\.\d+)?)?$/))
                    ob.o_value = ob.value;
            }
            function keyUp(ob) {
                if (!ob.value.match(/^[\+]?\d*?\.?\d*?$/))
                    ob.value = ob.t_value;
                else
                    ob.t_value = ob.value;
                if (ob.value.match(/^(?:[\+]?\d+(?:\.\d+)?)?$/))
                    ob.o_value = ob.value;
            }
            function onBlur(ob) {
                if (!ob.value.match(/^(?:[\+]?\d+(?:\.\d+)?|\.\d*?)?$/))
                    ob.value = ob.o_value;
                else {
                    if (ob.value.match(/^\.\d+$/))
                        ob.value = 0 + ob.value;
                    if (ob.value.match(/^\.$/))
                        ob.value = 0; ob.o_value = ob.value
                };
            }

            function fn_valiMobile() {
                var txt = $tbxjj_mobile.val();
                var reg = new RegExp(/^1\d{10}$/);
                if (!reg.test(txt)) {
                    var $lbvali_mobile = $("#lbvali_mobile");
                    if (txt == null || txt == "") {
                        $lbvali_mobile.text("请输入联系人手机号");
                    }
                    else {
                        $lbvali_mobile.text("请输入正确的手机号");
                    }
                    $lbvali_mobile.show();
                    return false;
                }
                else {
                    $("#lbvali_mobile").hide();
                    return txt;
                }
            }
            function fn_valiCode() {
                var txt = $.trim($tbxjj_code.val());
                if (txt == null || txt == "") {
                    var $lbvali_code = $("#lbvali_code");
                    $lbvali_code.text("请输入短信验证码");
                    $lbvali_code.show();
                    return false;
                }
                else {
                    $("#lbvali_code").hide();
                    return txt;
                }
            }

        },
        showSuccess: function () {
            var self = this;
            var config = {
                type: 'html',
                title: '降价通知',
                quickClose: false,
                content: self.sucesshtml
            };
            $dialog.modal(config);
        },
        showError: function (error) {
            var self = this;
            var config = {
                type: 'html',
                title: '降价通知',
                quickClose: false,
                content: self.errorhtml
            };
            $dialog.modal(config);
            if (error) {
                $(".jiangjia_gp").find(".ct_content").text(error);
            }


            $("#btnjj_reset").click(function () {
                self.showForm();
            });
        },
        showForm: function () {
            var self = this;
            var config = {
                type: 'html',
                title: '降价通知',
                quickClose: false,
                content: self.informhtml
            };
            $dialog.modal(config);

            self.initCalendar();
            self.initEvent();
        }

    }

    return jiangjia;
});