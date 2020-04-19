var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.2.0/module"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("popup/0.3.0/popup", ["base/0.2.0/module"], function (require, exports, module) {
            var Module = require("base/0.2.0/module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (Module) {
    /*
     * Created by 李岩岩 on 2016/4/18
     * 浮动弹出层基类
     * 内部对象obj_mask,obj_gp,obj_dialog,obj_content,obj_title, iscreate
     * 内部事件:data-dialog-close
     */
    var Popup = Module.extend({
        initialize: function initialize(config) {
            //init super
            Popup.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Popup.prototype.init.apply(this, arguments);
        },
        init: function init(config) {
            var self = this;
            self.__initParent();
            self.__createWrapper();
            self.__initTools();
            self.__initEvent();
            self.__quickClose();
        },
        ATTRS: {
            "hideTrigger": "blur,esc", //blur,esc
            "position": "fixed", //fixed,berth
            "align": "", //align-center          
            "type": 'html', //html,iframe,div,template
            "html": '<div class="module-popup-panel" data-popup-panel><div class="module-popup-body slideInDown">' + '<div class="module-popup-title"><i class="module-popup-icon"></i><div data-popup-title></div></div><a href="javascript:;" class="close" data-popup-hide></a>' + '<div class="module-popup-content" data-popup-content></div></div></div>', //面板html
            "quickClose": false,
            "modalSize": "", //modal-lg|modal-sm
            "autoSize": true, //是否自适应大小,高度只控制内容高度,总高度会加上title
            "skin": "",
            title: null, //标题
            titlestyle: null,
            titlehtml: null,
            content: "", //内容
            lock: false,
            mask: false,
            "top": "100px", //初始顶部距离
            width: "auto",
            height: "auto",
            "_iframeHtml": '<iframe class="module-popup-iframe" data-popup-iframe></iframe>',
            url: null,
            template: null,
            wrapper: null,
            berth: null,
            btns: [], //按钮组{ type: "submit",text:"确定" }
            o_wrapper: null, //容器,jq对象,不为空时,默认呈现容器内容
            onShow: function onShow() {},
            onHide: function onHide(backdata) {},
            showInParent: false, //在父窗口显示
            showInTop: false, //在最顶级的窗口显示
            isdrag: false //能否能拖动
        },

        METHODS: {
            show: function show(conf, isreset) {
                var self = this;
                if (isreset === undefined) {
                    isreset = true;
                }

                var _conf = $.extend({}, self.attr, conf);

                if (isreset) {
                    //self.__createWrapper();
                    this.__render(_conf, function () {
                        self.__show(_conf);
                    });
                } else {
                    this.__show(_conf, isreset);
                }
            },
            hide: function hide(backdata) {
                this.__hide(backdata);
            },
            reSize: function reSize(w, h) {
                var self = this;
                var _conf = $.extend({}, self.attr);

                if ((typeof w === "undefined" ? "undefined" : _typeof(w)) == "object") {
                    _conf = $.extend({}, self.attr, w);

                    if (_conf.autoSize === false) {
                        self.o_iframe.height(_conf.height);
                        self.o_panel.width(_conf.width);
                    } else {
                        setTimeout(function () {
                            h = self.__iframe.contentWindow.document.body.offsetHeight + 10;
                            self.o_iframe.height(h);
                        }, 400);
                    }
                } else {
                    if (w) {
                        self.o_panel.width(w);
                    }
                    if (h) {
                        self.o_iframe.height(h);
                    } else {
                        if (_conf.autoSize === false) {
                            self.o_iframe.height(_conf.height);
                            self.o_panel.width(_conf.width);
                        } else {
                            setTimeout(function () {
                                h = self.__iframe.contentWindow.document.body.offsetHeight + 10;
                                self.o_iframe.height(h);
                            }, 400);
                        }
                    }
                }
            },
            getSize: function getSize() {
                return { width: this.o_wrapper[0].scrollWidth, height: this.o_wrapper[0].scrollHeight };
            }
        },
        __createWrapper: function __createWrapper() {
            var self = this;
            if (self.attr.wrapper) {
                self.o_wrapper = self.attr.o_wrapper = $(self.attr.wrapper);
            }
            if (self.attr.o_wrapper) {
                self.o_wrapper = self.attr.o_wrapper;
            }
            if (!self.o_wrapper) {
                //if (this.o_wrapper) {
                //    this.o_wrapper.remove();
                //}
                //主面板
                self.o_wrapper = $('<div/>', {
                    "class": "module-popup fade",
                    "html": self.attr.html
                });
                //skin
                if (self.attr.skin) {
                    self.o_wrapper.addClass(self.attr.skin);
                }
                if (self.attr.showInParent && window.parent) {
                    $(window.parent.document.body).append(self.o_wrapper);
                    //self.o_wrapper.appendTo('body');
                } else if (self.attr.showInTop && window.top) {
                    $(window.top.document.body).append(self.o_wrapper);
                    //self.o_wrapper.appendTo('body');
                } else {
                    self.o_wrapper.appendTo('body');
                }
            }

            self.o_content = self.o_wrapper.find('[data-popup-content]');
            self.o_panel = self.o_wrapper.find('[data-popup-panel]');
            self.o_title = self.o_wrapper.find('[data-popup-title]');

            var o_mask = self.o_mask = $('<div/>', {
                "class": "module-popup-mask fade"
            });
            if (self.attr.title) {
                self.o_title.html(self.attr.title);
                alert(self.attr.title);
            }
            if (self.attr.content) {
                self.o_content.html(self.attr.content);
            }

            if (self.attr.showInParent && window.parent) {
                $(window.parent.document.body).append(o_mask);
                //self.o_wrapper.appendTo('body');
            } else if (self.attr.showInTop && window.top) {
                $(window.top.document.body).append(o_mask);
                //self.o_wrapper.appendTo('body');
            } else {
                o_mask.appendTo('body');
            }
            return self.o_wrapper;
        },
        __initTools: function __initTools() {
            var self = this;
            //btns
            if (this.attr.btns.length > 0) {
                self.o_tools = $('<div class="module-popup-tools"></div>');
                self.o_panel.find(".module-popup-body ").append(self.o_tools);
                this.attr.btns.map(function (btn) {
                    var _class = "";
                    var o_btn = $('<button class="btn" type="button">' + btn.text + '</button>');
                    if (btn.type == "submit") {
                        _class += ' btn-primary';
                        o_btn.click(function () {
                            self.hide(true);
                        });
                    }
                    o_btn.addClass(_class);
                    self.o_tools.append(o_btn);
                });
            }
        },
        __initEvent: function __initEvent() {
            var self = this;
            this.o_wrapper.on('click', "[data-popup-hide]", function () {
                self.hide();
            });

            //拖动        
            var _drag;
            if (self.attr.isdrag) {
                this.o_wrapper.on('mousedown', '[data-popup-title]', function (event) {
                    _drag = _drag || new drag();
                    _drag.create(self.o_panel[0], event);
                });
            }

            if (self.attr.berth) {
                $(document).on('click', self.attr.berth, function (event) {
                    self.show();
                });
            }
        },
        __render: function __render(conf, res) {
            var self = this;
            self.wrapper_title = self.o_wrapper.find('.module-popup-title');
            if (conf.title) {
                self.o_title.html(conf.title);
                self.o_title.show();
                self.wrapper_title.show();
                self.o_wrapper.find(".module-popup-icon").show();
            } else {
                self.o_title.hide();
                self.wrapper_title.hide();
                self.o_wrapper.find(".module-popup-icon").hide();
            }
            if (conf.hidebutton) {
                self.o_wrapper.find(".module-footer").hide();
                self.o_wrapper.find(".module-popup-content").css({ "padding": "50px 0", "text-align": "center" });
            } else {
                self.o_wrapper.find(".module-popup-content").removeAttr("style");
            }
            if (conf.type == "iframe") {
                self.o_content.html(conf._iframeHtml);
                var o_iframe = self.o_iframe = self.o_content.find("[data-popup-iframe]");
                if (!conf.autoSize) {
                    self.reSize(conf);
                }
                o_iframe[0].onload = function () {
                    self.__iframe = this;
                    self.__iframe.contentWindow.modal = self;
                    if (conf.autoSize) {
                        self.reSize(conf);
                    }
                    self.trigger("render");
                };
                o_iframe.attr("src", conf.url);
                res();
            } else {
                this.__getContent(conf, function (_content) {
                    if (_content == undefined || _content == null || _content == "") {
                        self.o_content.html("");
                    } else {
                        self.o_content.html(_content);
                        if (conf.icon != "" && conf.icon != undefined) {
                            var icon = '<i class="icons icon-' + conf.icon + '"></i>';
                            $(self.o_content).prepend(icon);
                        }
                    }
                    res();
                });
            }
        },
        __getContent: function __getContent(conf, res) {
            var content = conf.content;
            if (typeof content === 'function') {
                content(function (txt) {
                    res(txt);
                });
            } else {
                res(content);
            }
        },
        __show: function __show(conf, isreset) {
            var self = this;
            if (!isreset) {
                self.o_panel.removeClass("modal-lg");
                self.o_panel.removeClass("modal-sm");
                if (conf.modalSize) {
                    self.o_panel.addClass(conf.modalSize);
                    self.o_panel[0].style.width = null;
                    self.o_panel[0].style.height = null;
                } else {
                    self.o_panel.css({ "width": conf.width, "height": conf.height, "top": conf.top });
                }

                if (conf.align == "center") {
                    self.o_panel.addClass("align-center");
                } else {
                    self.o_panel.removeClass("align-center");
                }

                if (conf.onHide) {
                    self.onceOnhide = conf.onHide;
                }
            }

            self.o_mask.show(function () {
                self.o_mask.addClass('in');
                self.o_wrapper.show();
                self.o_wrapper.addClass('in');

                if (self.attr.onShow) self.attr.onShow();

                self.trigger("show");
            });
        },
        __hide: function __hide(backdata) {
            var self = this;
            self.o_wrapper.removeClass('in');
            self.o_mask.removeClass('in');
            //等待动画延时隐藏
            setTimeout(function () {
                self.o_mask.hide();
                self.o_wrapper.hide();
                if (self.onceOnhide) {
                    self.onceOnhide(backdata);
                    self.onceOnhide = null;
                } else {
                    if (self.attr.onHide) self.attr.onHide(backdata);
                }
            }, 150);
            self.trigger("hide");
        },
        // 指定位置 @param    {HTMLElement, Event}  anchor
        __follow: function __follow(anchor) {
            var $elem = anchor.parentNode && $(anchor);
            var popup = this.__popup;

            if (this.__followSkin) {
                popup.removeClass(this.__followSkin);
            }

            // 隐藏元素不可用
            if ($elem) {
                var o = $elem.offset();
                if (o.left * o.top < 0) {
                    return this.__center();
                }
            }

            var that = this;
            var fixed = this.fixed;

            var $window = $(window);
            var $document = $(document);
            var winWidth = $window.width();
            var winHeight = $window.height();
            var docLeft = $document.scrollLeft();
            var docTop = $document.scrollTop();

            var popupWidth = popup.width();
            var popupHeight = popup.height();
            var width = $elem ? $elem.outerWidth() : 0;
            var height = $elem ? $elem.outerHeight() : 0;
            var offset = this.__offset(anchor);
            var x = offset.left;
            var y = offset.top;
            var left = fixed ? x - docLeft : x;
            var top = fixed ? y - docTop : y;

            var minLeft = fixed ? 0 : docLeft;
            var minTop = fixed ? 0 : docTop;
            var maxLeft = minLeft + winWidth - popupWidth;
            var maxTop = minTop + winHeight - popupHeight;

            var css = {};
            var align = this.align.split(' ');
            var className = this.className + '-';
            var reverse = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
            var name = { top: 'top', bottom: 'top', left: 'left', right: 'left' };

            var temp = [{
                top: top - popupHeight,
                bottom: top + height,
                left: left - popupWidth,
                right: left + width
            }, {
                top: top,
                bottom: top - popupHeight + height,
                left: left,
                right: left - popupWidth + width
            }];

            var center = {
                left: left + width / 2 - popupWidth / 2,
                top: top + height / 2 - popupHeight / 2
            };

            var range = {
                left: [minLeft, maxLeft],
                top: [minTop, maxTop]
            };

            // 超出可视区域重新适应位置
            $.each(align, function (i, val) {

                // 超出右或下边界：使用左或者上边对齐
                if (temp[i][val] > range[name[val]][1]) {
                    val = align[i] = reverse[val];
                }

                // 超出左或右边界：使用右或者下边对齐
                if (temp[i][val] < range[name[val]][0]) {
                    align[i] = reverse[val];
                }
            });

            // 一个参数的情况
            if (!align[1]) {
                name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
                temp[1][align[1]] = center[name[align[1]]];
            }

            //添加follow的css, 为了给css使用
            className += align.join('-') + ' ' + this.className + '-follow';

            that.__followSkin = className;

            if ($elem) {
                popup.addClass(className);
            }

            css[name[align[0]]] = parseInt(temp[0][align[0]]);
            css[name[align[1]]] = parseInt(temp[1][align[1]]);
            popup.css(css);
        },

        // 获取元素相对于页面的位置（包括iframe内的元素）
        // 暂时不支持两层以上的 iframe 套嵌
        __offset: function __offset(anchor) {

            var isNode = anchor.parentNode;
            var offset = isNode ? $(anchor).offset() : {
                left: anchor.pageX,
                top: anchor.pageY
            };

            anchor = isNode ? anchor : anchor.target;
            var ownerDocument = anchor.ownerDocument;
            var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

            if (defaultView == window) {
                // IE <= 8 只能使用两个等于号
                return offset;
            }

            // {Element: Ifarme}
            var frameElement = defaultView.frameElement;
            var $ownerDocument = $(ownerDocument);
            var docLeft = $ownerDocument.scrollLeft();
            var docTop = $ownerDocument.scrollTop();
            var frameOffset = $(frameElement).offset();
            var frameLeft = frameOffset.left;
            var frameTop = frameOffset.top;

            return {
                left: offset.left + frameLeft - docLeft,
                top: offset.top + frameTop - docTop
            };
        },
        //点击文档其他地方隐藏面板
        __docClick: function __docClick(obj) {
            this.hide();
            $(document).unbind('click', obj);
        },
        __stopPropagation: function __stopPropagation(e) {
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
            }
            var func = this.__getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if (arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent || (typeof arg0 === "undefined" ? "undefined" : _typeof(arg0)) == "object" && arg0.preventDefault && arg0.stopPropagation) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        __quickClose: function __quickClose() {
            var self = this;
            // 点击任意空白处关闭对话框或者esc隐藏
            if (this.attr.quickClose) {
                //esc隐藏
                $(document).on('keydown', function (event) {
                    var target = event.target;
                    var nodeName = target.nodeName;
                    var rinput = /^input|textarea$/i;
                    var isTop = true;
                    var keyCode = event.keyCode;

                    // 避免输入状态中 ESC 误操作关闭
                    if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
                        return;
                    }
                    if (keyCode === 27) {
                        self.hide();
                        //that._trigger('close');
                    }
                    event.cancelBubble = true;
                });
                self.o_wrapper.on('click', function (e) {
                    if (self.o_panel.find(e.target).length == 0) {
                        self.hide();
                    }
                });

                //this.get('obj_mask').on('onmousedown' in document ? 'mousedown' : 'click', function (event) {
                //    self.hide();
                //    return false;// 阻止抢夺焦点
                //});
            }
        },
        __initParent: function __initParent() {
            if (this.attr.showInParent && window.parent) {
                window.parent.module.require(['popup/0.3.1/popup']);
            }
            if (this.attr.showInTop && window.top) {
                window.top.module.require(['popup/0.3.1/popup']);
            }
        }
    });

    /*
     * 拖动效果
     */
    var drag = function drag() {

        var $window = $(window);
        var $document = $(document);
        var isTouch = 'createTouch' in document;
        var html = document.documentElement;
        var isIE6 = !('minWidth' in html.style);
        var isLosecapture = !isIE6 && 'onlosecapture' in html;
        var isSetCapture = 'setCapture' in html;

        var types = {
            start: isTouch ? 'touchstart' : 'mousedown',
            over: isTouch ? 'touchmove' : 'mousemove',
            end: isTouch ? 'touchend' : 'mouseup'
        };

        var getEvent = isTouch ? function (event) {
            if (!event.touches) {
                event = event.originalEvent.touches.item(0);
            }
            return event;
        } : function (event) {
            return event;
        };

        var DragEvent = function DragEvent() {
            this.start = $.proxy(this.start, this);
            this.over = $.proxy(this.over, this);
            this.end = $.proxy(this.end, this);
            this.onstart = this.onover = this.onend = $.noop;
        };

        DragEvent.types = types;

        DragEvent.prototype = {

            start: function start(event) {
                event = this.startFix(event);

                $document.on(types.over, this.over).on(types.end, this.end);

                this.onstart(event);
                return false;
            },

            over: function over(event) {
                event = this.overFix(event);
                this.onover(event);
                return false;
            },

            end: function end(event) {
                event = this.endFix(event);

                $document.off(types.over, this.over).off(types.end, this.end);

                this.onend(event);
                return false;
            },

            startFix: function startFix(event) {
                event = getEvent(event);

                this.target = $(event.target);
                this.selectstart = function () {
                    return false;
                };

                $document.on('selectstart', this.selectstart).on('dblclick', this.end);

                if (isLosecapture) {
                    this.target.on('losecapture', this.end);
                } else {
                    $window.on('blur', this.end);
                }

                if (isSetCapture) {
                    this.target[0].setCapture();
                }

                return event;
            },

            overFix: function overFix(event) {
                event = getEvent(event);
                return event;
            },

            endFix: function endFix(event) {
                event = getEvent(event);

                $document.off('selectstart', this.selectstart).off('dblclick', this.end);

                if (isLosecapture) {
                    this.target.off('losecapture', this.end);
                } else {
                    $window.off('blur', this.end);
                }

                if (isSetCapture) {
                    this.target[0].releaseCapture();
                }

                return event;
            }

        };

        /**
         * 启动拖拽
         * @param   {HTMLElement}   被拖拽的元素
         * @param   {Event} 触发拖拽的事件对象。可选，若无则监听 elem 的按下事件启动
         */
        DragEvent.create = function (elem, event) {
            var $elem = $(elem);
            var dragEvent = new DragEvent();
            var startType = DragEvent.types.start;
            var noop = function noop() {};
            var className = elem.className.replace(/^\s|\s.*/g, '') + '-drag-start';

            var minX;
            var minY;
            var maxX;
            var maxY;

            var api = {
                onstart: noop,
                onover: noop,
                onend: noop,
                off: function off() {
                    $elem.off(startType, dragEvent.start);
                }
            };

            dragEvent.onstart = function (event) {
                var isFixed = $elem.css('position') === 'fixed';
                var dl = $document.scrollLeft();
                var dt = $document.scrollTop();
                var w = $elem.width();
                var h = $elem.height();

                minX = 0;
                minY = 0;
                maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
                maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

                var offset = $elem.offset();
                var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
                var top = this.startTop = isFixed ? offset.top - dt : offset.top;

                this.clientX = event.clientX;
                this.clientY = event.clientY;

                $elem.addClass(className);
                api.onstart.call(elem, event, left, top);
            };

            dragEvent.onover = function (event) {
                var left = event.clientX - this.clientX + this.startLeft;
                var top = event.clientY - this.clientY + this.startTop;
                var style = $elem[0].style;

                left = Math.max(minX, Math.min(maxX, left));
                top = Math.max(minY, Math.min(maxY, top));

                style.left = left + 'px';
                style.top = top + 'px';

                style.bottom = 'auto';
                style.right = 'auto';
                api.onover.call(elem, event, left, top);
            };

            dragEvent.onend = function (event) {
                var position = $elem.position();
                var left = position.left;
                var top = position.top;
                $elem.removeClass(className);
                api.onend.call(elem, event, left, top);
            };

            dragEvent.off = function () {
                $elem.off(startType, dragEvent.start);
            };

            if (event) {
                dragEvent.start(event);
            } else {
                $elem.on(startType, dragEvent.start);
            }

            return api;
        };
        return DragEvent;
    };
    return Popup;
});