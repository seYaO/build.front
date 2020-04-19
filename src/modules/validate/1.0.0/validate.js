(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['panel/0.2.0/panel', 'validate/1.0.0/rules', 'css!validate/1.0.0/validate'], function (Panel) {
            require("validate/1.0.0/rules");
            return _module(Panel);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("validate/1.0.0/validate", ['panel/0.2.0/panel', 'validate/1.0.0/rules', 'validate/1.0.0/validate.css'], function (require, exports, module) {
            require("validate/1.0.0/validate");
            var Panel = require('panel/0.2.0/panel');
            var allRules = require('validate/1.0.0/rules');
            return _module(Panel);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }
})(function (Panel) {
    /*
    * Demo
    * domattr:vali-noattach
    */
    var Validate = Panel.extend({
        initialize: function (options) {
            //init super
            Validate.superclass.initialize.apply(this, arguments);
            //init             
            Validate.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            $.extend(allRules,options.rules);
            self.allRules = allRules;
            //var gplist = [];
            //var valis = $("[validate]");
            //for (var i = 0; i < valis.length; i++) {
            //    var $obj = valis.eq(i);
            //    var gpname = $obj.attr('vali-message-group')
            //}

            this.attach(options);
            //点击提示框关闭
            $(document).on("click", ".dj-validate", function () {
                var obj = this;
                self.hideMessage($(obj).prev());
            });
        },
        ATTRS: {
            wrapper: "",
            showOneMsg: false//显示一条消息
        },
        METHODS: {
            attach: function (opt) {
                var self = this;
                var o_wrapper = $(opt.wrapper);
                o_wrapper.on("focus", "[validate]:not([vali-noattach])", function () {
                    self.hideMessage(this);
                });

                o_wrapper.on("blur input", "[validate]:not([vali-noattach])", function () {
                    var obj = this;
                    setTimeout(function () {
                        var gpname = $(obj).attr('vali-group');
                        if (gpname) {
                            var valis = self.o_wrapper.find('[vali-group=' + gpname + ']');
                            self.__validateFields(valis);
                        }
                        else {
                            self.__validateField(obj);
                        }
                    }, 100);

                });
            },
            //验证
            validate: function () {
                return this.__validateFields();
            },
            showMessage: function (obj, msglist) {
                var $obj = $(obj);
                //验证是否有分组显示位置
                var gpname = $obj.attr('vali-msggroup');
                if (gpname) {
                    var brenchobj = $('[vali-msggroup-breth=' + gpname + ']');
                    if (brenchobj.length > 0) {
                        $obj = brenchobj.eq(0);
                    }
                }


                var _html = '<div class="dj-validate active"></div>';
                var msg = '';
                if (this.attr.showOneMsg) {
                    msg = '<span class="error_gp">' + msglist[0] + '</span>';
                }
                else {
                    for (var i = 0; i < msglist.length; i++) {
                        msg += '<span class="error_gp">' + msglist[i] + '</span>';
                    }
                }

                var $mg = $obj.next();
                if ($mg && $mg.hasClass('dj-validate')) {
                    $mg.addClass("active");
                }
                else {
                    $mg = $(_html);
                    $obj.after($mg);
                }
                this.__showPropmt($mg, msg, obj);
            },
            hideMessage: function (obj) {
                var self = this;
                var $obj = $(obj);

                //验证是否有分组显示位置
                var gpname = $obj.attr('vali-msggroup');
                if (gpname) {
                    var brenchobj = self.o_wrapper.find('[vali-msggroup-breth=' + gpname + ']');

                    if (brenchobj.length > 0) {
                        $obj = brenchobj.eq(0);
                    }
                }


                var $mg = $obj.next();
                if ($mg && $mg.hasClass('dj-validate')) {
                    if ($mg.hasClass("active")) {

                        //增加分组验证处理,有一个不满足则不隐藏
                        if (gpname) {
                            var gpcount = $mg.attr('data-gpcount');;
                            if (!gpcount) {
                                gpcount = self.o_wrapper.find('[vali-msggroup=' + gpname + ']').length;
                                $mg.attr('data-gpcount', gpcount);
                            }

                            var okcount = $mg.attr('data-okcount');
                            if (okcount) {
                                okcount = (okcount * 1) + 1;
                            }
                            else {
                                okcount = 1;
                            }
                            if (gpcount == okcount) {
                                $mg.attr('data-okcount', 0);
                                self.__hidePrompt($mg, obj);
                            }
                            else {
                                $mg.attr('data-okcount', okcount);
                            }
                        }
                        else {
                            self.__hidePrompt($mg, obj);
                        }


                    }
                }
            }
        },
        __validateFields: function (valis) {
            if (!valis) {
                valis = this.o_wrapper.find("[validate]");
            }
            var isok = true;
            for (var i = 0; i < valis.length; i++) {
                if (!this.__validateField(valis[i])) {
                    isok = false;
                }
            }
            return isok;
        },
        __validateField: function (obj) {
            var self = this;
            var $obj = $(obj);
            var vali = $obj.attr('validate') || "";
            var valis = vali.split(/\s|,/);
            var msgs = new Array();
            var text = $obj.val();


            $.each(valis, function (i, v) {
                //if (v.indexOf('custom[') > -1) {                  
                //    var regname = v.replace('custom[', '').replace(']', '');
                //    var regnames = regname.split(/\s|,/);
                //    $.each(regnames, function (ii, vv) {
                //        msg += self.__valiCustom(vv, obj);
                //    });
                //}
                //else {
                //    msg += self.__validate(v, obj);
                //}     
                var msg = self.__validate(v, obj);
                if (msg)
                    msgs.push(msg);
            });
            //组合验证
            var gpvali = $obj.attr('vali-group-required');
            if (gpvali) {
                var msg = self.__groupRequired(gpvali, obj);
                if (msg)
                    msgs.push(msg);
            }

            //验证消息显示
            if (msgs.length > 0) {
                self.trigger("failure", obj);
                self.showMessage(obj, msgs);
                return false;
            }
            else {
                self.trigger("success", obj);
                self.hideMessage(obj);
                return true;
            }
        },
        //验证(主要处理正则)
        __validate: function (rule, obj) {
            var self = this;
            var msg = '';
            var text = obj.hasAttribute("verify") ? $(obj).attr("value") : $(obj).val();

            //自定义验证
            var reg = $(obj).attr('vali-reg-' + rule);
            if (reg) {
                if (!(new RegExp(reg)).test(text)) {
                    msg = self.__getMessage(rule, obj);
                }
                return msg;
            }
            //正则验证RegExp
            var rego = self.allRules[rule];
            if (rego && rego.regex && rego.regex != 'none') {
                if (!rego.regex.test(text)) {
                    msg = self.__getMessage(rule, obj);
                }
                return msg;
            }
            //自定义验证
            return this.__valiCustom(rule, obj);
        },
        /*
         * 组合验证,当一个验证触发时,同时验证其他几个
         */
        __groupVali: function () {

        },
        //一组中必须有一个必填
        __groupRequired: function (gpname, obj) {
            var gps = this.o_wrapper.find('[vali-group-required=' + gpname + ']');
            for (var i = 0; i < gps.length; i++) {
                var msg = this.__validate('required', gps[i]);
                if (!msg) {
                    return '';
                }
            }
            return this.__getMessage('groupRequired', obj);
        },
        //获得消息内容
        __getMessage: function (rule, obj) {
            var msg = '';
            if (obj) {
                msg = $(obj).attr('vali-msg-' + rule);
                if (msg) {
                    return msg;
                }
            }

            var rego = self.allRules[rule];
            if (rego) {
                msg = rego.alertText;
            }
            return msg;
        },
        //自定义验证
        __valiCustom: function (rule, obj) {
            var self = this;
            var msg = '';
            var text = obj.hasAttribute("verify") ? $(obj).attr("value") : $(obj).val();
            switch (rule) {
                case 'required':
                    if (text == null || $.trim(text) == "") {
                        msg = self.__getMessage(rule, obj);
                    }
                    break;
                    //case 'required':
                    //    if (text == null || $.trim(text) == "") {
                    //        msg = '不能为空';
                    //    }
                    //    break;
                default:
                    {
                        //if (/^grouprequired\[/.test(rule)) {
                        //    var gp = rule.match(/^grouprequired\[(.*)\]$/);
                        //    if (gp != null && gp.length >= 2) {
                        //        return self.__groupRequired(gp[1])
                        //    }
                        //}
                        break;
                    }
            }
            return msg;
        },
        __showPropmt: function (obj, msg, triele) {
            obj.html(msg);
            this.trigger('show', triele);
        },
        __hidePrompt: function (obj, triele) {
            obj.removeClass("active");
            this.trigger('hide', triele);
        }
    });

    return Validate;
});
