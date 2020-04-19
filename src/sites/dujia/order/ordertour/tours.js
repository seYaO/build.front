/**
 * @desc:基于下单页出游人整合修改   预订成功页电子签约出游人 和 订单中心电子签约出游人调用
 * @date 1016/10/19
 */

    var Tour = {};
    var host = "//www.ly.com";
    /**
     * initEv
     * 初始化
     * */
    Tour = {
        init: function () {
            fish.admin.config({
                verify: {v: "0.4.1", css: 1, g: 2012082123},
                autoComplete: {v: "0.3.1", css: 1, g: 20121228},
                Calendar: {v: "0.2", css: 1, g: 201403154}
            });

            fish.extend({
                remove: function (fish) {
                    var $fish = fish.all(fish),
                        $self = this;
                    $fish.each(function () {
                        var index = $self.indexOf(this);
                        if (index > -1) {
                            $self.splice(index, 1);
                        }
                    });
                    return this;
                },
                index: function () {
                    var self = this[0];
                    var parNode = self.parentNode,
                        ret = 0;
                    if (parNode && parNode.nodeType === 1) {
                        var childs = parNode.children;
                        for (var i = 0, len = childs.length; i < len; i++) {
                            if (self === childs[i]) {
                                ret = i;
                                break;
                            }
                        }
                    }
                    return ret;
                }
            });
            fish.lang.param = function (obj) {
                var ret = "&";
                for (var i in obj) {
                    ret += ("&" + i + "=" + obj[i]);
                }
                return ret.slice(1);
            };


            window.host = "//www.ly.com";
            var self = this;
            window.passenger = "";
            self.select();


            window.submitForm = function(callback) {
                var $this = $(".J_goAppoint"),
                    valid = self.validate();
                if (valid.check()) {
                        self.submit(function (data) {
                    });
                } else {
                    return;
                }
                if (!window.mobileFlag) {
                    return;
                }
                callback && callback(this);
            };
            // self.verifyTour();
            self.tourEve();
            self.tourCalendar();
            self.validate();

            self.helper();
        },
        isIE:function () {
            var self = this;
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
            return isIE;
        },
        tourCalendar:function(){
            var self = this;

            fish.require("Calendar",function(){
                var cal = new fish.Calendar({
                    skin: "green birth-date",
                    monthNum: 1,
                    zIndex: 22,
                    isBigRange: true
                });
                var theRequest = self.getParams();
                RequestDate = theRequest.Date||"";
                var newDate = new Date(),
                    birthStartDate = $(".ui-input-birthday").val()||"1985-01-01",
                    cardStartDate = self.simpleFormatDate(newDate),
                    birthEndDate = newDate,
                    cardEndDate = new Date(),
                    hidCal = "";
                cardEndDate.setFullYear(cardEndDate.getFullYear() + 40);
                fish.all(".ui-input-date").each(function () {
                    var startDate, endDate, $self = fish.one(this);
                    if (fish.one(this).hasClass("ui-input-birthday")) {
                        birthStartDate = fish.one(this).val();
                        endDate = birthEndDate;
                        fish.one(this).val(birthStartDate);
                    }
                    if (fish.one(this).hasClass("ui-input-certificate-date")) {
                        startDate = cardStartDate;
                        endDate = cardEndDate;
                    }
                    if (fish.one(this).hasClass("ui-input-calDate")) {
                        if(fish.one(this).val()!=""){
                            startDate=fish.one(this).val();
                            fish.one(this).val(startDate);
                        }else{
                            var BookDate = fish.one(this).val() || $("#hidBookDate").val()||RequestDate||"",
                                date ;
                            if(self.isIE()){
                                date = parseIE(BookDate);
                            }else {
                                date = new Date(BookDate);
                            }
                            date.setDate(date.getDate()+1);
                            startDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() || "";
                            endDate = "";
                        }
                        hidCal = startDate;

                    }

                    (function (startDate, endDate) {
                        $self.val(startDate);
                        $self.on("focus", function () {
                            cal.pick({
                                startDate: startDate || "",
                                endDate: endDate,
                                elem: this,
                                mode: "rangeFrom",
                                showOtherMonth: false,
                                zIndex: 22,
                                fn: function () {
                                    fish.one(this).focus();
                                }
                            });
                        });
                    })(startDate, endDate);
                });
                $("#hidBookDate").val(hidCal);

            });
            function parseIE(dateStringInRange) {
                var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
                    date = new Date(NaN), month,
                    parts = isoExp.exec(dateStringInRange);
                if(parts) {
                    month = +parts[2];
                    date.setFullYear(parts[1], month - 1, parts[3]);
                    if(month != date.getMonth() + 1) {
                        date.setTime(NaN);
                    }
                }
                return date;
            }
        },
        getParams:function(key){
            var self = this;
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
        //格式化日期
        simpleFormatDate:function(date) {
            var self = this;
            var y = date.getFullYear() + "",
                m = (date.getMonth() + 1) + "",
                d = date.getDate() + "";
            m.length <= 1 && (m = "0" + m);
            d.length <= 1 && (d = "0" + d);
            return y + "-" + m + "-" + d;
        },

        tourEve: function () {
            var self = this;

            $(".ui-select").each(function () {
                var certHtml = $("dt", $(this)).text(),
                    defaultVal = $(this).siblings(".ui-input .ui-select-certificate-id");
                if (certHtml === "台湾通行证") {
                    defaultVal.css("display","inline").attr('placeholder', "格式：T12345678");
                }else {
                    defaultVal.css("display","inline").attr('placeholder', "证件号码");
                }
            });
            $(".ui-input-nameZh").blur(function () {
                var el = $(this),
                    tourName = el.val(),
                    passengerTable = el.parents(".passenger-info-table");
                $.ajax({
                    url: window.host+"/intervacation/api/OrderHandler/GetPinYin?name=" + tourName,
                    dataType: "jsonp",
                    success: function (data) {
                        if(data.Data) {
                            passengerTable.find(".ui-input-first-name").val(data.Data.LastName);
                            passengerTable.find(".ui-input-last-name").val(data.Data.FirstName);
                        }
                    }
                });
            });
            $(".ui-input-mobile").blur(function () {
                var phoneCount = 0;
                $(".ui-input-mobile").each(function () {
                    var phoneVal = $(this).val();
                    if (phoneVal) {
                        phoneCount++;
                    }
                });
                if (phoneCount) {
                    $(".prompt_message").css("display","none");
                }
            });
        },
        /**
         * @desc 联系人有多种证件时，
         * 取接口字段选取插入的证件信息
         */
        certNo: function (dataType, certList) {
            var self = this;
            if (dataType === 7) {
                dataType = 6;
            } else if (dataType === 5) {
                dataType = 7;
            }
            if (certList && certList.length) {
                for (var i = 0; i < certList.length; i++) {
                    if (certList[i].CertType == dataType) {
                        return certList[i].CertNo;
                    }
                }
            }
            return "";
        },

        /**
         * @desc 出游人帮助信息
         */
        helper: function () {
            var $tipForZhName = fish.one("#tipForZhName"),
                $tipForEnName = fish.one("#tipForEnName"),
                $tipForNum = fish.one("#tipForNum"),
                target;
            fish.all(".passenger-info-table .help").on("mouseover", function () {
                var $this = fish.one(this),
                    dataType = $this.attr("data-type");
                if (dataType === "zh") {
                    target = $tipForZhName;
                } else if (dataType === "en") {
                    target = $tipForEnName;
                } else {
                    target = $tipForNum;
                }
                target.css("top: " + ($this.offset().top + 20) + "px;left: " + ($this.offset().left - 25) + "px;").css("display: block");
            }).on("mouseout", function () {
                target.css("display: none");
            });
        },

        /**
         * @desc 提交出游人信息
         * @param callback
         */
        submit: function (callback) {
            var data = [],
                mobileCount = 0;
            fish.all(".ui-input-mobile").each(function () {
                var mobileVal = fish.one(this).val();
                if (mobileVal) {
                    mobileCount++;
                }
            });
            if (mobileCount) {
                window.mobileFlag = true;
                fish.one(".prompt_message").css("display:none;");
                fish.all(".passenger-info").each(function () {
                    var ret = {},
                        $this = fish.one(this);
                    ret.CustomerName = $this.children(".ui-input-nameZh").val() || ""; //游客姓名
                    ret.CustomerMobile = $this.children(".ui-input-mobile").val() || "";  //手机号
                    ret.CustomerCertType = $this.children(".ui-select-certificate dt").attr("data-value")|| ""; //证件类型
                    ret.CustomerCertNo = $this.children(".ui-select-certificate-id").val() || "";//证件号
                    ret.CustomerBirth = $this.children(".ui-input-birthday").val() || "";//证件号

                    ret.CustomerType = $this.attr("data-isAdult")||"1";
                    ret.PassengerId = $this.attr("data-linkerId") || "";//游客编号
                    ret.CustomerCertValidity = $this.children(".ui-input-calDate").val() ||"";//证件日期
                    data.push(ret);
                });
                data = JSON.stringify(data);
                $("#hidPassenger").val(data);
            } else {
                fish.one(".prompt_message").css("display:inline");
                window.mobileFlag = false;
            }
            callback && callback(this);
        },

        /**
         * @desc 联系人表单验证
         */
        validate: function () {
            var self = this,
                $ipts = fish.all(".ui-input", fish.one(".J_passenger"));
            var valid = $ipts.verify();

            fish.one(".ui-input-date").on("blur", function () {
                fish.one(".ui-select-certificate-id").verify();
            });
            return valid;
        },

        /**
         * @desc 出游人下拉框交互函数
         */
        select: function () {
            var self = this;
            fish.all(".ui-select").on("click", function (e) {
                e.stopPropagation && e.stopPropagation();

                if (!$(this).hasClass("disabled")) {
                    $(this).toggleClass("hover");
                    $(".calendar-panel").css("display: none");
                }
                fish.all(".ui-select dd").on("click", function () {
                    var html = fish.trim(this.innerHTML),
                        $this = fish.one(this),
                        val = $this.attr("data-value"),
                        $list = $this.parent(".list"),
                        $nextInput = fish.one(this).parent(".ui-select").sibling(".ui-select-certificate-id"),
                        $cardDate = fish.one(this).parent(".ui-select").sibling(".ui-input-calDate"),
                        $target = fish.one(this).sibling(".select-certificate"),
                        $tip = fish.all(".invalid_message, .valid_symbol", $list);

                        $dateValue = $("#hidBookDate").val()||"";
                    $target.attr("data-value", val);
                    $target[0].innerHTML = html;
                    if (html === "台湾通行证") {
                        $nextInput.css("display: inline").attr('placeholder', "格式：T12345678").attr("vtype","rq");
                        $cardDate.css("display: inline").attr('placeholder', "证件有效期").attr("vtype","rq").val($dateValue||"");
                    } else {
                        $nextInput.css("display: inline").attr('placeholder', "证件号码").attr("vtype","rq");
                        $cardDate.css("display: inline").attr('placeholder', "证件有效期").attr("vtype","rq").val($dateValue||"");
                    }
                    //清除错误信息
                    $tip.css("display:none;");
                    $nextInput.removeClass("input_error");

                });
            });
            $(document).on("click", function () {
                $("div.ui-select").removeClass("hover");
            });
        }
    };
    /**
     * @desc 证件号码验证
     */
    window.verifyIdValid = function (a, b) {
        var self = fish.one(b),
            select = self.sibling(".ui-select"),
            t = fish.trim(fish.dom("dt", select).innerHTML);
        var reg;
        if (t === "港澳通行证") {
            reg = /^[0-9a-zA-Z]+$/;
        }
        if (t === "护照") {
            reg = /^[0-9a-zA-Z]{9}$/;
        }
        if (t === "身份证") {
            reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, /^$/, /^$/;
        }
        if (t === "台湾通行证") {
            reg = /^(T)(\d{8})$/i;
        }
        if (reg.test(a)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * @desc 名字验证
     */
    window.verifyCheckNameEn = function (a, b) {
        var input = fish.one(b),
            preInput = input.sibling(".ui-input-first-name"),
            val = preInput.val();
        if (/^[a-zA-Z]+$/.test(fish.trim(val))) {
            preInput.removeClass("input_error");
            input.removeClass("input_error");
            return true;
        } else {
            preInput.addClass("input_error");
            return false;
        }
    };

    /**
     * @desc 中文名验证
     */
    window.verifyCheckName = function (a) {
        var reg = /^[\u2E80-\uFE4F]+[-\s]?[a-zA-Z]*$/;
        return reg.test(a);
    };

    /**
     * @desc 姓氏验证
     */
    window.verifyCheckPreNameEn = function (a, b) {
        var reg = /[a-zA-Z]/;
        return reg.test(fish.trim(a));
    };
    module.exports = Tour;





