define("dialog/0.4.0/dialog", ["base/0.2.0/module", "popup/0.3.0/popup"], function (require, exports, module) {
    var Module = require("base/0.2.0/module");
    var Popup = require("popup/0.3.0/popup");
    var callback, cancelcallback;
    /*
    * Demo
    * 
    *
    */
    var Dialog = Module.extend({
        initialize: function initialize(options) {
            //init super
            Dialog.superclass.initialize.apply(this, arguments);
            //init             
            Dialog.prototype.init.apply(this, arguments);
        },
        init: function init(options) {
            var self = this,
                btnStr = "";
            if (options && options.buttons) {
                btnStr = self.btnFunc(options);
            }
            self.o_dialog = new Popup({
                "html": '<div class="module-popup-panel module-dialog-panel" data-popup-panel><div class="module-popup-body slideInDown">' + '<div class="module-popup-title"><div data-popup-title></div></div>' + '<div class="module-popup-content" data-popup-content></div><div class="module-footer">' + btnStr + '</div></div></div>', //面板html
                "skin": self.attr.skin,
                isdrag: true
            });
            self.confirm_dialog = new Popup({
                "html": '<div class="module-popup-panel module-dialog-panel" data-popup-panel><div class="module-popup-body slideInDown">' + '<div class="module-popup-title"><div data-popup-title></div></div><a href="javascript:;" class="close" data-popup-hide></a>' + '<div class="module-popup-content" data-popup-content></div><div class="module-footer">' + btnStr + '</div></div></div>', //面板html
                "skin": self.attr.skin,
                isdrag: true
            });
        },
        btnFunc: function(options) {
            var btns= [], i = 0;
            options.buttons && $.each(options.buttons, function(key, value){
                if (key === "取消") {
                    cancelcallback = value;
                } else {
                    callback = value;
                }
                btns.push({
                    index: ++i,
                    text: key,
                    key: (key === "取消") ? "cancel" : "ok"
                });
            });

            var btnStr = '';
            if(btns[0]){
                btnStr = '<form>';
                for(var n = 0,len = btns.length;n < len;n++){
                    var item = btns[n];
                    btnStr += '<button class="btn btn-default btn_confirm_' + item.key + '"  name="btn_' + item.key + '" type="button" data-dialog-' + item.key + ' >'+ item.text +'</button>';
                }
                btnStr += '</form>';
            }
            return btnStr;
        },
        ATTRS: {
            /**
             * @property {Array} [buttons=null] 弹出框上的按钮
             */
            buttons: null,
            skin: "", //皮肤,默认继承框架样式skin-default或skin-blue
            top: "200px", //据顶部距离,默认200px
            width: "300px",
            height: "210px"
        },
        METHODS: {
            alert: function alert(conf) {
                var triggerobj = document.activeElement;
                triggerobj.blur();
                var self = this;
                if (conf.buttons) {
                    $(".module-footer").html(self.btnFunc(conf));
                }
                if (conf.content === undefined) {
                    conf.content = conf.title;
                }
                self.__stopPropagation();
                if (conf.width == undefined || conf.width == "") {
                    conf.width = self.attr.width;
                }
                if (conf.height == undefined || conf.height == "") {
                    conf.height = self.attr.height;
                }
                if (conf.top == undefined || conf.top == "") {
                    conf.top = self.attr.top;
                }
                var okbtn = self.o_dialog.o_wrapper.find("[data-dialog-ok]");
                self.o_dialog.show(conf);

                var e_keydown = function e_keydown(e) {
                    if (e.keyCode == 13) {
                        resfun();
                    }
                };
                var resfun = function resfun() {
                    self.__stopPropagation();
                    okbtn.unbind("click");
                    $(document).unbind("keydown", e_keydown);
                    if (callback) {
                        callback();
                    }
                    self.o_dialog.hide();
                };

                $(document).bind("keydown", e_keydown);
                okbtn.bind("click", function () {
                    resfun();
                });
                if (okbtn && okbtn.length) {
                    okbtn[0].focus();
                }
                if (conf.time != undefined && conf.time != "") {
                    setTimeout(function () {
                        self.o_dialog.o_wrapper.fadeOut("slow");
                        self.o_dialog.o_mask.fadeOut("slow");
                        self.o_dialog.o_wrapper.removeClass('in');
                        self.o_dialog.o_mask.removeClass('in');
                    }, conf.time);
                }
            },
            confirm: function confirm(conf) {
                var triggerobj = document.activeElement;
                triggerobj.blur();

                var self = this;
                if (conf.buttons) {
                    $(".module-footer").html(self.btnFunc(conf));
                }
                if (conf.content === undefined) {
                    conf.content = conf.title;
                }
                self.__stopPropagation();
                if (conf.width == undefined || conf.width == "") {
                    conf.width = self.attr.width;
                }
                if (conf.height == undefined || conf.height == "") {
                    conf.height = self.attr.height;
                }
                if (conf.top == undefined || conf.top == "") {
                    conf.top = self.attr.top;
                }
                self.confirm_dialog.show(conf);

                var okbtn = self.confirm_dialog.o_wrapper.find("[data-dialog-ok]");
                var cancelbtn = self.confirm_dialog.o_wrapper.find("[data-dialog-cancel]");

                var e_keydown = function e_keydown(e) {
                    if (e.keyCode == 13) {
                        //console.log("13");
                        resfun();
                    } else if (e.keyCode == 27) {
                        cancelfun();
                    }
                };
                var resfun = function resfun() {
                    self.__stopPropagation();
                    cancelbtn.unbind("click");
                    okbtn.unbind("click");
                    $(document).unbind("keydown", e_keydown);
                    if (callback) {
                        callback();
                    }
                    self.confirm_dialog.hide();
                    //triggerobj.focus();
                };
                var cancelfun = function cancelfun() {
                    self.__stopPropagation();
                    cancelbtn.unbind("click");
                    okbtn.unbind("click");
                    $(document).unbind("keydown", e_keydown);
                    if (cancelcallback) {
                        cancelcallback();
                    }
                    self.confirm_dialog.hide();
                    //triggerobj.focus();
                };

                $(document).bind("keydown", e_keydown);
                okbtn.bind("click", function () {
                    resfun();
                });
                cancelbtn.bind("click", function () {
                    cancelfun();
                });
                if (okbtn && okbtn.length) {
                    okbtn[0].focus();
                }
            },
            prompt: function prompt(conf) {
                var msg, type, time, icon, align;
                if (typeof conf.content == "string") {
                    msg = conf.content;
                    type = conf.type || "success";
                    time = conf.time || 2000;
                    align = conf.align || "top";
                }
                //插入图标
                var iconobj = "";
                if (conf.icon != undefined && conf.icon != "") {
                    iconobj = '<i class="icons icon-' + type + '"></i>';
                }
                var obj = $('<div class="alert alert-' + type + ' prompt active prompt-' + align + '">' + iconobj + msg + '</div>');

                $("body").append(obj);

                setTimeout(function () {
                    obj.fadeOut("slow", function () {
                        obj.remove();
                        if (conf.fn) {
                            conf.fn();
                        }
                    });
                }, time);
            }
        },
        __stopPropagation: function __stopPropagation() {
            var e = this.__getEvent();
            if (window.event) {
                //e.returnValue=false;//阻止自身行为
                e.cancelBubble = true; //阻止冒泡
            } else if (e && e.preventDefault) {
                //e.preventDefault();//阻止自身行为
                e.stopPropagation(); //阻止冒泡
            }
        },
        //得到事件
        __getEvent: function __getEvent() {
            if (window.event) {
                return window.event;
            };
            if (!this.__getEvent.caller) {
                return null;
            };
            // var i = 0;//有可能会出现require加载中直接执行的方法,没有event,这样就导致无法取到事件源,临时这样写吧by stone
            // var func = this.__getEvent.caller;
            // while (func != null && func.arguments.length > 0 && i < 100) {
            //     i++;
            //     var arg0 = func.arguments[0];
            //     if (arg0) {
            //         if ((arg0.constructor == Event || arg0.constructor == MouseEvent ||
            //             arg0.constructor == KeyboardEvent) ||
            //             (typeof (arg0) == "object" && arg0.preventDefault &&
            //                 arg0.stopPropagation)) {
            //             return arg0;
            //         }
            //     }
            //     func = func.caller;
            // }
            return null;
        }
    });
    return Dialog;
});