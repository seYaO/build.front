/**
 * @desc:下单页出游人
 * @author: Jilly
 * @mail: cjl10120@ly.com
 * @createTime: 2016/1/22 15:34
 * @version: 0.1
 */
(function () {
    var Tour = function(){};
    var host = "//www.ly.com";
    fish.admin.config({
        verify: {v: "0.4.1", css: 1, g: 2012082123},
        autoComplete: {v: "0.3.1", css: 1, g: 20121228},
        Calendar: {v: "0.2", css: 1, g: 201403154}
    });
    /**
     * @desc 出游人
     *
     */
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
    fish.ready(function () {
        "use strict";
        window.isTour = true;
        if(window.isTour) {
            window.isTour = false;
            Tour.prototype.initEv();
        }
    });
    //格式化日期
    function simpleFormatDate(date) {
        var y = date.getFullYear() + "",
            m = (date.getMonth() + 1) + "",
            d = date.getDate() + "";
        m.length <= 1 && (m = "0" + m);
        d.length <= 1 && (d = "0" + d);
        return y + "-" + m + "-" + d;
    }

    /**
     * initEv
     * 初始化
     * */
    Tour.prototype = {
        initEv: function () {
            var self = this,
                $passenger = fish.one(".passenger");
            self.needPassengerInfo = true;
            //如果已经提交过乘客信息
            $passenger.hasClass("no-passenger");

            //获取常用联系人信息
            self.getContactsInfo(function () {
                self.createAddressBook(function () {
                    //常用联系人信息插入
                    fish.all(".favorite-contacts input").on("click", function () {
                        var $self = fish.one(this),
                            index = $self.parent("dd").index() - 1,
                            isChecked = this.checked,
                        //passengerType = $self.attr("data-type"),
                            map = $self.attr("map");
                        var $passenger = fish.all(".passenger-info");
                        if (isChecked) {
                            $passenger.each(function () {
                                var $div = fish.one(this),
                                    type = $div.attr("data-type"),
                                    isInsert = +$div.attr("data-isInsert");
                                if (!isInsert) {
                                    self.inserContacts($div, self._data[index]);
                                    $div.attr("data-index",index);
                                    $self.attr("map", $div[0].id);
                                    $self[0].checked = true;
                                    return false;
                                } else {
                                    $self[0].checked = false;
                                }
                            });
                        } else {
                            this.removeAttribute("map");
                            self.reset(fish.one("#" + map));
                        }
                        if (self.IsCanEdit === "1") {
                            fish.one(".order-fn-btns").removeClass("none");
                        }
                    });
                });
            });

            window.submitForm = function(callback) {
                if (!$(".tour_favorable .listbox").hasClass("no-info")) {
                    var $this = fish.all(".submit"),
                        valid = self.validate();
                    if ($this.hasClass("disabled")) {
                        return;
                    }
                    if (self.needPassengerInfo) {
                        if (valid.check()) {
                            self.submit(function (data) {
                            });
                        } else {
                            return;
                        }
                    }
                    if (!window.mobileFlag) {
                        return;
                    }
                }
                callback && callback(this);
            };
            self.writeInfo();
            self.dropDown();
            self.validate();
            self.select();
            self.helper();
            //self.learn();
        },

        /**
         * @desc 当出游人数大于5个时，呈现稍后填写
         */
        writeInfo: function() {
            /**
             * @desc 稍后填写
             * */
            fish.one(".tourBox").delegate(".no-write", "click", function(e) {
                //var writeTarget = e.target();
                var showBox = fish.one(".tour_favorable .listbox");
                if (!showBox.hasClass("none")) {
                    fish.all(".no-write").html("立即填写");
                    showBox.addClass("no-info none");
                } else {
                    fish.all(".no-write").html("稍后填写");
                    showBox.removeClass("no-info none");
                }
            });
        },

        /**
         * @desc 联系人信息插入
         * @param obj
         * @param data
         */
        inserContacts: function (obj, data) {
            var self = this;
            fish.all("input,.ui-select", obj).each(function () {
                var className = this.className,
                    $ipt = fish.one(this);
                if (/(ui-input-nameZh)/.test(className)) {
                    $ipt.val(data.zhName);
                }
                if (/(ui-input-first-name)/.test(className)) {
                    $ipt.val(data.enNameLast);
                }
                if (/(ui-input-last-name)/.test(className)) {
                    $ipt.val(data.enNameFirst);
                }
                if (/(ui-select-certificate)/.test(className)) {
                    var val = self.cardTypeToNo(data.cardType);
                    $ipt.children("dt").html(data.cardType).attr("data-value", val);
                }
                if (/(ui-select-certificate-id)/.test(className)) {
                    var val = self.cardTypeToNo(data.cardType);
                    var certNo = self.certNo(val, data.certList);
                    $ipt.val(certNo);
                    $ipt.css("display:inline").attr("vtype","rq");
                    if (data.cardType === "台湾通行证") {
                        $ipt.attr('placeholder', "格式：T12345678");
                    } else {
                        $ipt.attr('placeholder', "证件号码");
                    }
                }
                if (/ui-input-mobile/.test(className)) {
                    $ipt.val(data.mobile);
                }
                if (/ui-input-birthday/.test(className)) {
                    $ipt.val(data.birthday.split('T')[0]);
                }

            });
            fish.all(".ui-radio-sex", obj)[1 - data.sex] && (fish.all(".ui-radio-sex", obj)[1 - data.sex].checked = true);
            obj.attr("data-isInsert", 1);
            obj.attr("data-linkerId", data.linkerId);
            self.clear(obj);
        },

        /**
         * @desc 插入联系人时判断证件类型，默认为2护照
         */
        cardTypeToNo: function (cardType) {
            var val = 2;
            if (cardType === "护照") {
                val = 2;
            }
            if (cardType === "港澳通行证") {
                val = 7;
            }
            if (cardType === "台湾通行证") {
                val = 5;
            }
            if (cardType === "稍后提供") {
                val = 6;
            }
            return val;
        },

        /**
         * @desc 联系人有多种证件时，
         * 取接口字段选取插入的证件信息
         */
        certNo: function (dataType, certList) {
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
         * @desc 异步获取常用联系人
         * @param fn(创建常用联系人)
         */
        getContactsInfo: function (fn) {

            var self = this,
                //commonLinker = host + fish.one(".favorite-contacts").attr("attr-url");     //常用联系人查询
                commonLinker = '/intervacation/api/OrderHandler/GetPassengerInfoData';

            fish.ajax({
                url: commonLinker,
                type: "jsonp",
                fn: function (data) {
                    var passengerInfoDataList = data.Data.PassengerData.PassengerInfoDataList;
                    if (passengerInfoDataList.length) {
                        self._data = handleData(passengerInfoDataList);
                        fn && fn.call(this);
                    } else {
                        fish.one(".favorite-contacts").css("display:none");
                    }
                }
            });
            function handleData(data) {
                var ret = [];
                for (var i = 0; i < data.length; i++) {
                    var p = {};
                    p.zhName = data[i].LinkerName;
                    p.enNameFirst = data[i].EnglishFirstName;
                    p.enNameLast = data[i].EnglishLastName;
                    p.cardType = data[i].DefaultCertType == "7" ? "台湾通行证" : (data[i].DefaultCertType == "6" ? "港澳通行证" : "护照");
                    p.certList = data[i].certList || {};
                    p.sex = data[i].Sex;
                    p.linkerId = data[i].LinkerId;
                    p.mobile = data[i].Mobile;
                    p.birthday=data[i].Birthday;
                    ret.push(p);
                }
                return ret;
            }
        },

        /**
         * @desc 常用联系人页面渲染
         * @param fn(点击联系人插入信息)
         */
        createAddressBook: function (fn) {
            var self = this,
                ret = [],
                dataArr = self._data || [],
                $contacts = fish.one(".favorite-contacts");
            for (var i = 0; i < dataArr.length; i++) {
                var str = "",
                    randomId = "passenger" + i;
                str = '<dd><input class="ui-checkbox" id="' + randomId +
                    '" type="checkbox" hidefocus="true" data-type="1"/><label title="' + dataArr[i].zhName + '" for="' + randomId + '">' + dataArr[i].zhName.substring(0, 3) + '</label></dd>';
                ret.push(str);
            }
            fish.one("dt", $contacts).html("常用旅客(" + dataArr.length + ")")
                .html("after", ret.join(""));
            window.setTimeout(function () {
                if (!fish.one(".content").hasClass("smallC")) {
                    if (dataArr.length <= 5) {
                        fish.one(".favorite-contacts .drop-down").css("display: none");
                    }
                } else {
                    if (dataArr.length <= 4) {
                        fish.one(".favorite-contacts .drop-down").css("display: none");
                    }
                }
            },2500);
            fish.one(window).on("resize",function() {
                if (!fish.one(".content").hasClass("smallC")) {
                    if (dataArr.length > 5) {
                        fish.one(".favorite-contacts .drop-down").css("display: block");
                    } else {
                        fish.one(".favorite-contacts .drop-down").css("display: none");
                    }
                } else {
                    if (dataArr.length > 4) {
                        fish.one(".favorite-contacts .drop-down").css("display: block");
                    } else {
                        fish.one(".favorite-contacts .drop-down").css("display: none");
                    }
                }
            });
            fn && fn.call(this);
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
         * @desc 常用联系人展开收起
         */
        dropDown: function () {
            var $contacts = fish.one(".favorite-contacts"),
                $drop = fish.one(".drop-down", $contacts),
                t = ["展开", "收起"],
                c = 0;
            $drop.on("click", function (e) {
                fish.preventDefault(e);
                c = $contacts.hasClass("active") ? 1 : 0;
                $contacts.toggleClass("active");
                $drop.html($drop.html().replace(t[c], t[(c + 1) % 2]));
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
                    ret.CustomerName = encodeURIComponent($this.children(".ui-input-nameZh").val());
                    ret.CustomerMobile = encodeURIComponent($this.children(".ui-input-mobile").val());
                    ret.FirstName = $this.children(".ui-input-first-name").val();
                    ret.LastName = $this.children(".ui-input-last-name").val();
                    ret.CustomerCertType = $this.children(".ui-select-certificate dt").attr("data-value");
                    ret.CustomerCertNo = $this.children(".ui-select-certificate-id").val() || "";
                    ret.CustomerBirth= encodeURIComponent($this.children(".ui-input-birthday").val()) || "";
                    //fish 在ie6、7下不支持属性选择
                    ret.CustomerSex = 1;
                    $this.children(".ui-radio-sex").each(function () {
                        if (this.checked) {
                            ret.CustomerSex = fish.one(this).attr("data-value");
                        }
                    });
                    ret.CustomerType = fish.one(this).children(".passenger-info-table").attr("data-type");
                    ret.IsFrequentPassenger = $this.children(".save input")[0].checked;
                    ret.LinkerId = $this.attr("data-linkerId") || "";
                    data.push(ret);
                });
                data = JSON.stringify(data);
                fish.cookie.set("passengers", data);
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
                $ipts = fish.all(".ui-input", fish.one(".tourBox"));
            var valid = $ipts.verify();
            fish.one(".ui-input-first-name").on("blur", function () {
                fish.one(".ui-input-last-name").verify();
            });
            fish.one(".tourBox").delegate(".reset", "click", function (e) {
                var target = e.delegateTarget;
                var table = fish.one(target).parent(".passenger-info");
                self.reset(table);
            });
            return valid;
        },

        /**
         * @desc 清空
         * @param obj
         */
        clear: function (obj) {
            fish.all(".invalid_message,.valid_symbol", obj).css("display: none");
            fish.all("input", obj).removeClass("input_error placeholder");
            fish.one(".prompt_message").css("display:none;");
        },

        /**
         * @desc 出游人下拉框交互函数
         */
        select: function () {
            var self = this;
            fish.all(".tourBox").delegate("div.ui-select", "click", function (e) {
                var event = e || window.event;
                event.stopPropagation && event.stopPropagation();
                event.cancelBubble = true;
                var selTarget = e.delegateTarget;
                if (!fish.all(selTarget).hasClass("disabled")) {
                    fish.all(selTarget).toggleClass("hover");
                    fish.all(".calendar-panel").css("display: none");
                }
                fish.all(".ui-select dd").on("click", function () {
                    var html = fish.trim(this.innerHTML),
                        $this = fish.one(this),
                        val = $this.attr("data-value"),
                        $list = $this.parent(".list"),
                        //$nextList = $list.sibling(".fn-hide"),
                        $nextInput = fish.one(this).parent(".ui-select").sibling(".ui-input"),
                        $target = fish.one(this).sibling(".select-certificate"),
                        $tip = fish.all(".invalid_message, .valid_symbol", $list);
                    $target.attr("data-value", val);
                    $target[0].innerHTML = html;
                    if (html === "台湾通行证") {
                        $nextInput.css("display: inline").attr('placeholder', "格式：T12345678").attr("vtype","rq");
                    } else if (html === "稍后提供") {
                        $nextInput.css("display: none").attr('placeholder', "证件号码").attr("vtype","");
                    } else {
                        $nextInput.css("display: inline").attr('placeholder', "证件号码").attr("vtype","rq");
                    }
                    //清除错误信息
                    $tip.css("display:none;");

                    var visitorIndex = parseInt($this.parent().children('dt').attr('visitor-index'),10);
                    var certNo = '';
                    if (fish.all(".favorite-contacts input").length > visitorIndex) {
                        if (fish.all(".favorite-contacts input")[visitorIndex].checked) {
                            certNo = self.certNo(val, self._data[visitorIndex].certList);
                        }
                    }
                    $nextInput.val(certNo);
                    $nextInput.removeClass("input_error");

                });
            });
            fish.one(document).on("click", function () {
                fish.all("div.ui-select").removeClass("hover");
            });
        },

        /**
         * @desc 清空联系人
         * @param obj
         */
        reset: function (obj) {
            var $lists = fish.all(".list", obj),
                $inputs = fish.all(".ui-input", obj),
                $radios = fish.all(".ui-radio-sex", obj),
                $select = fish.all(".ui-select dt", obj),
                $btns = fish.all(".favorite-contacts input"),
                $tips = fish.all(".invalid_message,.valid_symbol", obj),
                $idInputs = fish.all(".ui-select-certificate-id", obj),
                cityName = fish.one("#hidProvinceName").val();
            var isInputSupported = 'placeholder' in document.createElement('input');
            $lists[4].removeAttribute("style");
            $inputs.each(function () {
                var $this = fish.one(this);
                isInputSupported ? $this.val("") : $this.addClass("placeholder").val($this.attr("placeholder"));
                $this.removeClass("input_error");
            });
            $radios[0].checked = true;
            if (cityName === "香港" || cityName === "澳门") {
                $select.html("港澳通行证").attr("data-value", "7");
                $idInputs.attr('placeholder', "证件号码");
            } else if (cityName === "台湾") {
                $select.html("台湾通行证").attr("data-value", "5");
                $idInputs.attr('placeholder', "格式：T12345678");
            } else {
                $select.html("护照").attr("data-value", "2");
                $idInputs.attr('placeholder', "证件号码");
            }
            $idInputs.css("display:inline").attr("vtype","rq");
            $tips.css("display: none");
            $btns.each(function () {
                var $this = fish.one(this);
                if ($this.attr("map") === obj[0].id) {
                    this.checked = false;
                    this.removeAttribute("map");
                }
            });
            obj.attr("data-isInsert", 0);
            obj.attr("data-index", "");
            obj.attr("data-linkerid", "");
            fish.one(".prompt_message").css("display:none;");
        },

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
})();

