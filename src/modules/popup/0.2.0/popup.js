(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['panel/0.2.0/panel', 'css!popup/0.2.0/popup'], function (Panel) {
            return _module(Panel);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("popup/0.2.0/popup", ['panel/0.2.0/panel', 'popup/0.2.0/popup.css'], function (require, exports, module) {
            var Panel = require("panel/0.2.0/panel");
            return _module(Panel);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (Panel) {
    /*
    * Created by 李岩岩 on 2016/2/15
    * 浮动弹出层基类
    * 内部对象obj_mask,obj_gp,obj_dialog,obj_content,obj_title, iscreate
    * 内部事件:data-dialog-close
    */

    var Popup = Panel.extend({
        initialize: function (config) {
            //init super
            Popup.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Popup.prototype.init.apply(this, arguments);
        },
        init: function (config) {
            //#region init

            //#region 数据初始化

            config = config || {};
            var self = this;
            var _type = config.type || 'html';
            var _skin = config.skin || '';
            var _html = config.html || '';
            var _title = config.title || '';
            var _content = config.content || '';
            var _lock = config.lock || false;
            var _mask = _lock && (config.mask || false);
            var _url = config.url || null;
            var _quickClose = config.quickClose || false;
            var _time = config.time || ((config.time == 0) ? 0 : -1);

            var _isdrag = config.isdrag;
            if (_isdrag == undefined) {
                _isdrag = true;
            }

            var position = this.option.position = self.get("position");
            var align = this.option.align = self.get("align");
            self.option.berth = self.get("berth") || self.get("el");
            self.option.width = self.get("width");

            //#endregion

            // #region 生成弹出面板

            //主面板
            var o_wrapper = this.o_wrapper = $('<div/>').addClass("ui_popup_gp")
                .css({ "width": self.option.width });

            //遮罩层
            var obj_mask;
            if (_lock) {
                obj_mask = $('<div/>').addClass("ui_popup_mask").css({
                    "position": position
                });
                if (_mask) {
                    obj_mask.addClass('mask');
                }
                obj_mask.appendTo("body");
            }
            if (self.option.berth == "berth") {
                o_wrapper.css({
                    "position": "absolute"
                });
            }
            o_wrapper.appendTo("body");
            o_wrapper.html(_html);

            // #endregion

            //#region 事件
            o_wrapper.delegate("[data-dialog-hide]", 'click', function () {
                self.hide();
            });
            o_wrapper.delegate("[data-dialog-show]", 'click', function () {
                self.hide();
            });

            o_wrapper.delegate("[data-dialog-close]", 'click', function () {
                self.close();
            });

            o_wrapper.delegate('[data-dialog-submit]', 'click', function () {
                self.hide();
                self.trigger('submit');
            });

            o_wrapper.delegate('[data-dialog-cannel]', 'click', function () {
                self.hide();
                self.trigger('cannel');
            });

            //拖动
            var _drag;
            o_wrapper.delegate('[data-dialog-drag]', 'mousedown', function (event) {
                if (_isdrag) {
                    _drag = _drag || new drag();
                    _drag.create(obj_gp[0], event);
                }
            });


            //#endregion

            var hidetype = this.get("hideTrigger");
            if (hidetype.indexOf("blur") > -1) {
                //阻止面板点击冒泡(for 点击关闭)
                o_wrapper.click(function (e) {
                    var ev = e || window.event;
                    if (ev.stopPropagation) {
                        ev.stopPropagation();
                    }
                    else if (window.event) {
                        window.event.cancelBubble = true;//兼容IE
                    }
                });

                //失去焦点隐藏
                self.on("show", function () {
                    $(document).bind('click', function () {
                        self.__docClick.call(self, arguments.callee);
                    });
                    self.__stopPropagation();
                });
            }
            else if (hidetype.indexOf("timing") > -1) {
                //定时关闭
                if (_time >= 0) {
                    var _timmer;
                    self.on('hoverout', function () {
                        if (self.inele || self.inobj) {
                            return;
                        }
                        if (_time == 0) {
                            self.hide();
                        }
                        else {
                            _timmer = setTimeout(function () {
                                self.hide();
                            }, _time);
                        }
                    });
                    self.on('hoverin', function () {
                        if (_timmer) {
                            clearTimeout(_timmer);
                            delete _timmer;
                        }
                    })
                }

            }

            //#endregion
        },
        ATTRS: {
            "hideTrigger": "blur,esc",//blur,esc
            "position": "fixed",//fixed,berth
            "align": "left",//top,bottom,left,right,center最多支持两两组合相对两方向除外,如bottom left表示下方显示左线对齐,left bottom 表示左方显示下线对齐
            "berth": null,
            "z-index":10000,
            type: 'template',//html,iframe,div
            html: null, //面板html
            title: null,//标题
            titlestyle: null,
            titlehtml: null,
            content: { value: null },//内容
            lock: false,
            mask: false,
            quickClose: false,//是否点击空白关闭对话框
            width: "auto",
            height: "auto",
            x: 0,
            y: 0,
            url: null,
            template: null,
            time: -1,//弹出框多久消失
            closetype: 'event',//关闭类型event|timing|
            isdrag: true,//能否能拖动
            id: null,
            bghtml: null,
            bgstyle: null,
            iscreate: false,
            "z-index":100000,
            obj_mask: null,
            obj_dialog: null,
            obj_gp: null,
            obj_title: null,
            obj_content: null,
            o_berth: null//停靠位置
        },
        METHODS: {

        },
        // 指定位置 @param    {HTMLElement, Event}  anchor
        __follow: function (anchor) {

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
        __offset: function (anchor) {

            var isNode = anchor.parentNode;
            var offset = isNode ? $(anchor).offset() : {
                left: anchor.pageX,
                top: anchor.pageY
            };


            anchor = isNode ? anchor : anchor.target;
            var ownerDocument = anchor.ownerDocument;
            var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

            if (defaultView == window) {// IE <= 8 只能使用两个等于号
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
        __docClick: function (obj) {
            this.hide();
            $(document).unbind('click', obj);
        },
        __stopPropagation: function (e) {
            var e = this.__getEvent();
            if (window.event) {
                //e.returnValue=false;//阻止自身行为
                e.cancelBubble = true;//阻止冒泡
            } else if (e && e.preventDefault) {
                //e.preventDefault();//阻止自身行为
                e.stopPropagation();//阻止冒泡
            }
        },
        //得到事件
        __getEvent: function () {
            if (window.event) {
                return window.event;
            }
            var func = this.__getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent
                       || arg0.constructor == KeyboardEvent)
                       || (typeof (arg0) == "object" && arg0.preventDefault
                       && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        /*
         * 初始化显示位置 override
         *
         */
        __initLocation: function (option) {
            var self = this;
            var _option = {};
            $.extend(_option, self.attr, option);


            var obj_gp = self.o_wrapper;
            var align = _option.align;
            if (_option.position != "berth") {
                return;
            }
            var o_berth = $(_option.berth)[0];
            var _height = obj_gp[0].offsetHeight;//容器可视高度
            var _width = obj_gp[0].offsetWidth;//容器可视宽度
            var $window = $(window);
            var $obj_arrows = obj_gp.find("[data-popup-arrows]");
            var $dialog_berchmask = obj_gp.find("[popup-berchmask]");

            //文档的宽高
            var dw = $window.width();
            var dh = $window.height();

            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;

            //small arrow

            var offset = this.__offset(o_berth);


            if (align == 'center') {
                obj_gp.css({
                    "position": "fixed",
                    "z-index": self.get("z-index"),
                    "margin": 'auto',
                    "bottom": 0,
                    "right": 0,
                    "top": 0,
                    "left": 0,
                    "height": _height + 'px'
                });
                return;
            }


            //停靠元素
            var t1 = offset.top;//焦点元素的上边距
            var l1 = offset.left;//焦点元素的左边距
            var w1 = o_berth.offsetWidth;//焦点元素的可视宽度
            var h1 = o_berth.offsetHeight;//焦点元素的可视高度

            var _aligns = align.match(/\S+/g);
            var _align = _aligns[0];
            var _berth = (_aligns.length > 1) ? _aligns[1] : "center";
            var ah = 8;//三角箭头的高
            if (true) {//是否显示箭头
                ah = 0;
            }
            //停靠元素 cover mask layout
            var cmlconf = {
                top: null,
                left: null,
                bottom: null,
                right: null,
                width: w1,
                height: h1
            }

            var gpconf = {
                top: null,
                left: null,
                right: null,
                bottom: null
            }
            var arrowconf = {
                top: null,
                left: null,
                bottom: null,
                right: null
            };

            if (_align == "bottom") {
                gpconf.top = ah + h1 + t1;
                arrowconf.top = ah * -1;
                if (_berth == "left") {
                    gpconf.left = l1;
                    arrowconf.left = w1 / 2 - ah;
                }
                else if (_berth == "right") {
                    gpconf.right = l1;
                    arrowconf.right = w1 / 2 - ah;
                }
                else {
                    gpconf.left = l1 - (_width - w1) / 2;
                    arrowconf.left = _width / 2 - ah;
                }

                cmlconf.height += 10;
                cmlconf.top = 0 - ah - h1;
                cmlconf.left = 0;
            }
            else if (_align == "top") {
                gpconf.top = t1 - ah - _height;
                arrowconf.bottom = ah * -1;

                if (_berth == "left") {
                    gpconf.left = l1;
                    arrowconf.left = w1 / 2 - ah;
                }
                else if (_berth == "right") {
                    gpconf.right = l1;
                    arrowconf.right = w1 / 2 - ah;
                }
                else {
                    gpconf.left = l1 + (w1 - _width) / 2;
                    arrowconf.left = _width / 2 - ah;
                }

                cmlconf.height += 10;
                cmlconf.bottom = 0 - ah - h1;
                cmlconf.left = 0;
            }
            else if (_align == "left") {

                gpconf.left = l1 - ah - _width;
                arrowconf.right = 0 - ah;

                if (_berth == "top") {
                    gpconf.top = t1;
                    arrowconf.top = h1 / 2 - ah;
                }
                else if (_berth == "bottom") {
                    gpconf.bottom = t1 + h1;
                    arrowconf.bottom = h1 / 2 - ah;
                }
                else {
                    gpconf.top = t1 + (h1 - _height) / 2;
                    arrowconf.top = _height / 2 - ah;
                }

                cmlconf.height += 10;
                cmlconf.bottom = 0 - ah - h1;
                cmlconf.left = 0;
            }
            else if (_align == "right") {
                gpconf.left = l1 + w1 + ah;
                arrowconf.left = 0 - ah;

                if (_berth == "top") {
                    gpconf.top = t1;
                    arrowconf.top = h1 / 2 - ah;
                }
                else if (_berth == "bottom") {
                    gpconf.bottom = t1 + h1;
                    arrowconf.bottom = h1 / 2 - ah;
                }
                else {
                    gpconf.top = t1 + (h1 - _height) / 2;
                    arrowconf.top = _height / 2 - ah;
                }

                cmlconf.width += 10;
                cmlconf.left = 0 - ah - w1;
                cmlconf.top = 0;
            }


            //Position correction
            if (_align == "bottom" || _align == "top") {
                var px = _width + gpconf.left - dw - scrollLeft;
                var py = _height + gpconf.top - dh - scrollTop;
                if (px > 0) {
                    gpconf.left -= px;
                    arrowconf.left += px;
                    cmlconf.left += px;
                }
                //if (py > 0) {
                //    self.changePoint(o_berth, obj_gp, 'top ' + _berth);
                //    return;
                //}
                //if (gpconf.top * -1 > (_height + ah)) {
                //    self.changePoint(o_berth, obj_gp, 'bottom ' + _berth);
                //    return;
                //}
            }
            else {
                var px = _width + gpconf.left - dw - scrollLeft;
                var py = _height + gpconf.top - dh - scrollTop;

                if (py > 0) {
                    gpconf.top -= px;
                    arrowconf.top += px;
                    cmlconf.top += px;
                    return;
                }

                //if (px > 0) {
                //    self.changePoint(o_berth, obj_gp, 'left ' + _berth);
                //    return;
                //}
                //if (gpconf.left * -1 > (_width + ah)) {
                //    self.changePoint(o_berth, obj_gp, 'right ' + _berth);
                //    return;
                //}

            }

            obj_gp.css({
                "position": "absolute",
                "z-index": self.get("z-index"),
                "bottom": gpconf.bottom || "auto",
                "right": gpconf.right || "auto",
                "top": gpconf.top || "auto",
                "left": gpconf.left || "auto"
                //"height":_height+'px'
            });

            $obj_arrows.removeClass('top bottom left right').addClass(_align);
            $obj_arrows.css({
                "bottom": arrowconf.bottom || "auto",
                "right": arrowconf.right || "auto",
                "top": arrowconf.top || "auto",
                "left": arrowconf.left || "auto"
            });

            $dialog_berchmask.css({
                "bottom": cmlconf.bottom || "auto",
                "right": cmlconf.right || "auto",
                "top": cmlconf.top || "auto",
                "left": cmlconf.left || "auto",
                "width": cmlconf.width || "auto",
                "height": cmlconf.height || "auto"
            });
        }
    });

    /*
     * 拖动效果
     */
    var drag = function () {

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


        var DragEvent = function () {
            this.start = $.proxy(this.start, this);
            this.over = $.proxy(this.over, this);
            this.end = $.proxy(this.end, this);
            this.onstart = this.onover = this.onend = $.noop;
        };

        DragEvent.types = types;

        DragEvent.prototype = {

            start: function (event) {
                event = this.startFix(event);

                $document
                    .on(types.over, this.over)
                    .on(types.end, this.end);

                this.onstart(event);
                return false;
            },

            over: function (event) {
                event = this.overFix(event);
                this.onover(event);
                return false;
            },

            end: function (event) {
                event = this.endFix(event);

                $document
                    .off(types.over, this.over)
                    .off(types.end, this.end);

                this.onend(event);
                return false;
            },

            startFix: function (event) {
                event = getEvent(event);

                this.target = $(event.target);
                this.selectstart = function () {
                    return false;
                };

                $document
                    .on('selectstart', this.selectstart)
                    .on('dblclick', this.end);

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

            overFix: function (event) {
                event = getEvent(event);
                return event;
            },

            endFix: function (event) {
                event = getEvent(event);

                $document
                    .off('selectstart', this.selectstart)
                    .off('dblclick', this.end);

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
            var noop = function () { };
            var className = elem.className
                .replace(/^\s|\s.*/g, '') + '-drag-start';

            var minX;
            var minY;
            var maxX;
            var maxY;

            var api = {
                onstart: noop,
                onover: noop,
                onend: noop,
                off: function () {
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
    }
    return Popup;
});
