(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['panel/0.2.0/panel', 'popup/0.2.0/tmpl/popup', 'css!popup/0.2.0/popup'], function (Panel,Tmpl) {
            return _module(Panel, Tmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define('popup/0.2.0/modal', ['panel/0.2.0/panel', 'popup/0.2.0/tmpl/popup', 'popup/0.2.0/popup.css'], function (require, exports, module) {
            var Panel = require("panel/0.2.0/panel"),
              Tmpl = require('popup/0.2.0/tmpl/popup');
            return _module(Panel, Tmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (Panel,Tmpl) {
    var Modal = Panel.extend({
        initialize: function (config) {
            //init super
            Modal.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Modal.prototype.init.apply(this, arguments);
        },
        init: function (config) {
            var self = this;
            var o_wrapper = this.o_wrapper = $('<div/>', {
                style: "display:none;"
            }).addClass("ui_dialog_mask");
       
            this.o_wrapper.appendTo("body");

            //遮罩层
            this.o_wrapper.on("click", function () {
                self.hide();
            });
            //遮罩层
            this.o_wrapper.on("click", function () {
                self.hide();
            });
            //var o_mask = self.o_mask;
            //if (self.attr.lock) {
            //    o_mask = $('<div/>').addClass("ui_dialog_mask");

            //    if (self.attr.mask) {
            //        o_mask.addClass('mask');
            //    }
            //    o_mask.appendTo("body");               
            //}
        },
        ATTRS: {
            "hideTrigger": "esc,click",//esc,click          
            dotTemplate: Tmpl,//dot模板
            type: 'template',//html,iframe,div
            html: null, //面板html
            title: null,//标题
            titlestyle: null,
            titlehtml: null,
            content: { value: null },//内容
            lock: true,
            mask: true,
            quickClose: false,//是否点击空白关闭对话框
            zIndex: 101,
            width: "50%",
            height: "50%",
            x: "25%",
            y: "25%",
            url: null,
            template: null,
            time: -1,//弹出框多久消失
            closetype: 'event',//关闭类型event|timmer|
            isdrag: true,//能否能拖动
            id: null,
            bghtml: null,
            bgstyle: null,
            iscreate: false,
            obj_mask: null,
            obj_dialog: null,
            obj_gp: null,
            obj_title: null,
            obj_content: null,
            obj_addhere: null//附着物
        },
        METHODS: {
            render: function (data, res) {
                this.o_wrapper.html(data.content);              
                res();
               
            },
            show: function (option) {
                var self = this;
                self.__initLocation(option);
                self.o_wrapper.css("visibility", "visible");
                self.o_wrapper.show();
                if (this.attr.mask) {
                    this.o_wrapper.addClass('mask');
                }
                self.trigger("show");
                //self.o_pobj.show();
            },
            hide: function () {
                var self = this;              
                self.o_wrapper.css("visibility", "hidden");
                if (this.attr.mask) {
                    this.o_wrapper.removeClass('mask');
                }
                self.o_wrapper.hide();
                self.trigger("hide");
            },
        }
    });

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
    return Modal;
});
