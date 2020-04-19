define('dialog/0.2.0/dialog', ['base/0.1.0/base'], function (require, exports, module) {
    /*
     *
     *  内部对象obj_mask,obj_gp,obj_dialog,obj_content,obj_title, iscreate
     * 内部事件:data-dialog-close
     */
    require('base/0.1.0/base')
    var Modal = Base.extend({
        initialize: function (config) {
            //init super
            Modal.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Modal.prototype.init.apply(this, arguments);
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

            var _zIndex = config.zIndex || 5850;
            var _width = config.width || '50%';
            var _height = config.height || '50%';
            var _border = config.border || 'none';
            var _top = config.top || "25%";
            var _left = config.left || "25%";

            var _url = config.url || null;

            var _quickClose = config.quickClose || false;
            var _time = config.time || ((config.time == 0) ? 0 : -1);

            var _isdrag = config.isdrag;
            if (_isdrag == undefined) {
                _isdrag = true;
            }

            //主面板
            var obj_gp = $('<div/>').addClass("ui_dialog_gp").css({
                "width": _width,
                "height": _height,
                "border": _border
            });
            //遮罩层
            var obj_mask;



            var obj_dialog;

            if (_lock) {
                obj_mask = $('<div/>').addClass("ui_dialog_mask");

                if (_mask) {
                    obj_mask.addClass('mask');
                }
                obj_mask.appendTo("body");
            }

            obj_gp.appendTo("body");
            obj_dialog = obj_gp;
            obj_dialog.addClass(_skin);
            obj_gp.html(_html);



            //obj_gp.append(obj_content);

            //obj_content.html(_content);
            var obj_content = obj_gp.find("[data-dialog-content]");
            var obj_title = obj_gp.find("[data-dialog-title]");
            //#endregion

            //#region 事件
            obj_dialog.delegate("[data-dialog-hide]", 'click', function () {
                self.hide();
            });
            obj_dialog.delegate("[data-dialog-show]", 'click', function () {
                self.hide();
            });

            obj_dialog.delegate("[data-dialog-close]", 'click', function () {
                self.close();
            });

            obj_dialog.delegate('[data-dialog-submit]', 'click', function () {
                self.hide();
                self.trigger('submit');
            });

            obj_dialog.delegate('[data-dialog-cannel]', 'click', function () {
                self.hide();
                self.trigger('cannel');
            });

            //拖动
            var _drag;
            obj_dialog.delegate('[data-dialog-drag]', 'mousedown', function (event) {
                if (_isdrag) {
                    _drag = _drag || new drag();
                    _drag.create(obj_gp[0], event);
                }
            });


            obj_gp.hover(function (e) {
                self.inobj = true;
                self.trigger('hoverin');
            }, function () {
                self.inobj = false;
                self.trigger('hoverout');
            });

            //#region 定时关闭

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

            //#endregion

            //#endregion

            //#region 数据保存

            this.set('type', _type);
            this.set('html', _html);
            this.set('title', _title);
            this.set('content', _content);
            this.set('url', _url);
            this.set('mask', _mask);
            this.set('skin', _skin);
            this.set('isdrag', _isdrag);
            this.set('time', _time);
            this.set('lock', _lock);
            this.set('width', _width);
            this.set('height', _height);
            this.set('top', _top);
            this.set('left', _left);
            this.set('quickClose', _quickClose);
            this.set("zIndex",_zIndex);

            this.set('obj_mask', obj_mask);
            this.set('obj_dialog', obj_dialog);
            this.set('obj_gp', obj_gp);
            this.set('obj_content', obj_content);
            this.set('obj_title', obj_title);

            //#endregion

            //#endregion
        },
        ATTRS: {
            type: 'template',//html,iframe,div
            html: null, //面板html
            title: null,//标题
            titlestyle: null,
            titlehtml: null,
            content: { value: null },//内容
            lock: false,
            mask: false,
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
            maskclick:true,//遮罩层点击是否关闭对话框
            obj_addhere: null//附着物
        },
        show: function (obj, align, isreset) {

            var self = this;


            self.trigger('show');
            isreset = isreset || false;

            var obj_gp = this.get('obj_gp');

            //遮罩层
            var _lock = this.get('lock');
            obj_gp.css({
                "width": this.get('width'),
                "height": this.get('height')
            });

            var iscreate = this.get('iscreate');
            obj_gp.css("visibility", "hidden");
            obj_gp.show();
            this.render();

            if (iscreate && !isreset) {
                if (_lock) {
                    this.get('obj_mask').show();
                }
                return;
            }


            //显示位置
            if (align != undefined) {
                self.changePoint(obj, obj_gp, align);
            }

            //显示
            if (_lock) {
                this.get('obj_mask').show();
            }

            //#region 功能

            // 点击任意空白处关闭对话框或者esc隐藏
            var _quickClose = this.get('quickClose');
            if (_quickClose) {
                //esc隐藏
                $(document).on('keydown', function (event) {
                    var target = event.target;
                    var nodeName = target.nodeName;
                    var rinput = /^input|textarea$/i;
                    //var isTop = Popup.current === that;
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


                this.get('obj_mask').on('onmousedown' in document ? 'mousedown' : 'click', function (event) {
                    if(obj.maskclick){
                        self.hide();
                    }
                    return false;// 阻止抢夺焦点
                });
            }

            //#endregion
            obj_gp.css("visibility", "visible");
            this.set('iscreate', true);

        },
        hide: function () {

            this.trigger('hide');

            if (this.get('lock')) {
                this.get('obj_mask').fadeOut();
            }
            this.get("obj_gp").hide();
            //this.Event.fireEvent('close');
            //this.get('_dialog_obj').fadeOut(function () {
            //    that.onclose();
            //});
        },
        close: function () {
            this.trigger('close');
            if (this.get('lock')) {

                this.get('obj_mask').fadeOut();
                this.get('obj_mask').remove();
            }

            this.get('obj_gp').remove();
            //self.obj_dialog.fadeOut(function () {
            //    self.obj_dialog.remove();
            //});
        },
        /*
         * 刷新
         */
        refresh: function (obj) {
            //__initConfig(config);
            this.set('iscreate', false);
            return this.render(obj);
            //刷新内部
        },
        //重构内容
        render: function (obj) {
            var type = this.get('type');
            var url = this.get('url');
            var title = this.get('title');
            //var skin = this.get('skin');
            //方便内容用
            if (obj) {
                this.o_triggerobj = obj;
            } else {
                obj = this.o_triggerobj;             ;
            }

            if (type == 'div') {
                this.get("obj_content").load(url);
            }
            else if (type == 'html') {
                var content = this.get('content');
                var _content = '';
                if (typeof content === 'function') {
                    _content = content(obj);
                }
                else {
                    _content = content;
                }

                if (_content == undefined || _content == null || _content == "") {
                    return false;
                }
                this.get("obj_content").html(_content);
            }
            this.get("obj_title").html(title);
            return true;
        },
        changePoint: function (obj, obj_gp, align) {
            var self = this;
            var _height = obj_gp.children()[0].offsetHeight;
            var _width = obj_gp.children()[0].offsetWidth;
            var $window = $(window);
            var $obj_arrows = obj_gp.find("[data-dialog-arrows]");
            var $dialog_berchmask = obj_gp.find("[dialog-berchmask]");

            //文档的宽高
            var dw = $window.width();
            var dh = $window.height();

            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;

            var zIndex = self.get("zIndex");
            //small arrow

            if (align == 'center') {
                obj_gp.css({
                    "position": "fixed",
                    "z-index": zIndex,
                    "margin": 'auto',
                    "bottom": 0,
                    "right": 0,
                    "top": 0,
                    "left": 0,
                    "height": _height + 'px'
                });
                return;
            }

            var offset = this.__offset(obj);
            //停靠元素
            var t1 = offset.top;//焦点元素的上边距
            var l1 = offset.left;//焦点元素的左边距
            var w1 = obj.offsetWidth;//焦点元素的可视宽度
            var h1 = obj.offsetHeight;//焦点元素的可视高度

            var _aligns = align.match(/\S+/g);
            var _align = _aligns[0];
            var _berth = (_aligns.length > 1) ? _aligns[1] : "center";
            var ah = 8;//三角箭头的高

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
               
                var px = _width + gpconf.left - dw - scrollLeft;// 附体元素宽度+左边距--文档宽度-滚动条左
                var py = _height + gpconf.top - dh - scrollTop;                              

                if (px > 0) {
                    gpconf.left -= px;
                    arrowconf.left += px;
                    cmlconf.left += px;
                }

                if (gpconf.left < 0) {
                    px = 0 - gpconf.left;
                    arrowconf.left -= px;
                    gpconf.left = 0;
                }
                
                if (py > 0) {
                    self.changePoint(obj, obj_gp, 'top ' + _berth);
                    return;
                }
                if (gpconf.top * -1 > (_height + ah)) {
                    self.changePoint(obj, obj_gp, 'bottom ' + _berth);
                    return;
                }
            }
            else {
                var px = _width + gpconf.left - dw - scrollLeft;
                var py = _height + gpconf.top - dh - scrollTop;

                if (py > 0) {
                    gpconf.top -= py;
                    arrowconf.top += py;
                    cmlconf.top += py;
                }

                if (px > 0) {
                    self.changePoint(obj, obj_gp, 'left ' + _berth);
                    return;
                }
                if (gpconf.left * -1 > (_width + ah)) {
                    self.changePoint(obj, obj_gp, 'right ' + _berth);
                    return;
                }

            }

            obj_gp.css({
                "position": "absolute",
                "z-index": zIndex,
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

            return;
            // /*
            //两角位置右下和左上
            //*/
            // var temp = [{
            //     top: top - popupHeight,
            //     bottom: top + height,
            //     left: left - popupWidth,
            //     right: left + width
            // }, {
            //     top: top,
            //     bottom: top - popupHeight + height,
            //     left: left,
            //     right: left - popupWidth + width
            // }];

        },
        /*
         * 附着某元素，主要确定位置用
         * @ele 可为选择器或者obj对象
         * @triggertype 触发类型'click','hover' 默认为'click',
         * @align  显示方位 top bottom left right
         */
        triggerShow: function (option) {
            var ele = option.triggerEle || '';
            var triggertype = option.triggerType || '';
            var align = option.triggerAlign || '';
            var leavehide = option.leaveHide || false;//点击离开隐藏
            var wrapper = option.wrapper || document;

            triggertype = triggertype || 'click';
            align = align || 'bottom';
            var self = this;
            if (ele != undefined) {

            }
            var $obj = $(ele);
            var delayT;
            //$obj.ishover = false;

            if (triggertype == 'hover') {
                self.ishover = true;
                $(wrapper).delegate(ele, 'mouseover', function (e) {
                    if (!self.refresh(this)) {
                        return;
                    }
                    self.show(this, align, true);
                    self.inele = true;
                });
                $(wrapper).delegate(ele, 'mouseout', function () {
                    self.inele = false;
                    if (delayT) {
                        window.clearTimeout(delayT);
                    }
                    delayT = window.setTimeout(function () {
                        self.trigger('hoverout');
                        delayT = null;
                    }, 100);

                });

            }
            else if (triggertype == 'click') {
                $(wrapper).delegate(ele, 'click', function (e) {
                    if (!self.refresh(this)) {
                        return;
                    }
                    self.show(this, align, true);
                });
                if (leavehide) {
                    $(wrapper).delegate(ele, 'mouseout', function () {
                        self.inele = false;
                        if (delayT) {
                            window.clearTimeout(delayT);
                        }
                        delayT = window.setTimeout(function () {
                            self.trigger('hoverout');
                            delayT = null;
                        }, 100);
                    });
                }
            }
            else if (triggertype == 'show') {
                self.show($obj[0], align, true);
            }
            else {
                $(wrapper).delegate(ele, triggertype, function () {
                    if (option.onTrigger) {
                        option.onTrigger(this, self);
                    }
                });
            }
        },
        /*
        * 初始化配置
        */
        open: function (config) {
            if (!config) {
                return;
            }
            var _type = config.type || this.get('type');
            var _skin = config.skin || this.get('skin');
            var _html = config.html || this.get('html');
            var _title = config.title || this.get('title');
            var _content = config.content || this.get('content');
            var _lock = config.lock || this.get('lock');
            var _mask = _lock && (config.mask || this.get('mask'));

            var _width = config.width || this.get('width');
            var _height = config.height || this.get('height');
            var _top = config.top || this.get('top');
            var _left = config.left || this.get('left');
            var _url = config.url || this.get('url');
            var _quickClose = config.quickClose || this.get('quickClose');
            var _time = config.time;
            if (_time == undefined) {
                _time = this.get('time');
            }
            var _isdrag = config.isdrag;
            if (_isdrag == undefined) {
                _isdrag = this.get('isdrag');
            }

            this.set('type', _type);
            this.set('html', _html);
            this.set('title', _title);
            this.set('content', _content);
            this.set('url', _url);
            this.set('mask', _mask);
            this.set('skin', _skin);
            this.set('isdrag', _isdrag);
            this.set('time', _time);
            this.set('lock', _lock);
            this.set('width', _width);
            this.set('height', _height);
            this.set('top', _top);
            this.set('left', _left);
            this.set('quickClose', _quickClose);

            this.refresh();
            this.show();

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
        }
    });

    var Dialog = Base.extend({
        initialize: function (config) {
            //init super
            Dialog.superclass.initialize.apply(this, arguments);
            //init
            Dialog.prototype.init.apply(this, arguments);
        },
        init: function (config) {
            var self = this;
            config = config || {};
            //全局装载模板

            var modalhtml = '<div class="dialog_modal_gp">' +
                '<div class="dialog_modal_title"  data-dialog-drag><div class="text" data-dialog-title></div><a href="javascript:;" class="close" data-dialog-hide></a></div>' +
                '<div class="dialog_modal_content" data-dialog-content></div>' +
                '</div>';
            var template = {
                alert: {
                    width: '200px',
                    height: '120px',
                    html: '<div class="dialog_alert_gp" data-dialog-drag><div class="dialog_alert_text" data-dialog-content></div><button type="button" class="dialog_alert_submit" data-dialog-submit>确认</button></div>'
                },
                confirm: {
                    width: '200px',
                    height: '120px',
                    html: '<div class="dialog_confirm_gp" data-dialog-drag><div class="dialog_confirm_text" data-dialog-content></div><button type="button" class="dialog_confirm_submit" data-dialog-submit>确认</button><button type="button" class="dialog_confirm_cannel" data-dialog-cannel>取消</button></div>'
                },
                tooltip: {
                    width: '270px',
                    height: 'auto',
                    border: 'none',
                    zIndex: 1000000,
                    html: '<div class="dialog_tooltip_gp" trace="dialog_tooltip" data-dialog-drag style="color:#000;"><div class="dialog_berch_mask"></div>' +
                    '<div class="dialog-arrow" data-dialog-arrows>' +
                    ' <div class="dialog-arrow-a"></div>' +
                    '<div class="dialog-arrow-b"></div></div>' +
                    '<div class="dialog_tooltip_text" style="text-align:left;" data-dialog-content></div></div>'
                },
                tips: {
                    width: '150px',
                    height: 'auto',
                    html: '<div class="dialog_tooltip_gp" trace="dialog_tooltip" data-dialog-drag style="width:100%;color:#000;border-radius: 5px;">' +
                    '<div class="dialog_tooltip_text" style="text-align:left;line-height:30px;" data-dialog-content></div></div>'
                },
                modal: {
                    width: '600px',
                    height: '440px',
                    html: modalhtml
                },
                validata: {
                    width: 'auto',
                    height: 'auto',
                    border: 'none',
                    html: '<div class="dialog_validata_gp" data-dialog-drag style="color:#000;">' +
                    '<div class="dialog_validata_text" data-dialog-content>' +
                    '</div></div>'
                }
            };

            function jsonreplace(baseconfig, newconfig) {
                if (newconfig == undefined) {
                    return baseconfig;
                }
                $.each(baseconfig, function (name, value) {
                    if (newconfig[name] != undefined) {
                        if (typeof value == 'object') {
                            baseconfig[name] = jsonreplace(baseconfig[name], newconfig[name])
                        }
                        else {
                            baseconfig[name] = newconfig[name];
                        }
                    }
                });
                return baseconfig;
            }
            var _template = jsonreplace(template, config.template);
            this.set('template', _template);
            this.set('skin', config.skin || 'black');
        },
        ATTRS: {
            type: 'template',//html,iframe,div
            skin: 'skin1',
            template: {
                alert: null,
                confirm: null,
                modal: {
                    title: ''
                }
            }
        },
        tempinit: function (obj_content, skin, template) {

        },
        /*
         *
         *  data-dialog-text,data-dialog-submit
         */
        alert: function (msg, fn) {
            var template = this.get('template');
            var _width = template.alert.width;
            var _height = template.alert.height;
            var _html = template.alert.html;
            var _skin = this.get('skin');

            var config = {
                type: 'html',
                lock: true,
                skin: _skin,
                width: _width,
                height: _height,
                html: _html,
                content: msg,
                end: ''
            };
          

            if (this._alertmodal) {
                this._alertmodal.open(config);
                this._alertmodal.off('submit');
            }
            else {
                this._alertmodal = new Modal(config);               
                this._alertmodal.show();
            }          
            if (fn) {
               
                this._alertmodal.on('submit', fn);
            }

            this._alertmodal.get('obj_content').find('[data-dialog-submit]').focus();
            return this._alertmodal;
        },
        /*
         *
         * data-dialog-text,data-dialog-submit,data-dialog-cannel
         */
        confirm: function (msg, okfn, cannelfn) {
            var template = this.get('template');
            var _width = template.confirm.width;
            var _height = template.confirm.height;
            var _html = template.confirm.html;
            var _skin = this.get('skin');

            var config = {
                type: 'html',
                lock: true,
                skin: _skin,
                width: _width,
                height: _height,
                html: _html,
                content: msg,
                end: ''
            };

            if (this._confirmmodal) {
                this._confirmmodal.open(config);
                this._confirmmodal.off('submit');
                this._confirmmodal.off('cannel');
            }
            else {

                this._confirmmodal = new Modal(config);
                this._confirmmodal.show();
            }
            if (okfn) {              
                this._confirmmodal.on('submit', okfn);              
            }
            if (cannelfn) {
                this._confirmmodal.on('cannel', cannelfn);
            }

            this._confirmmodal.get('obj_content').find('[data-dialog-submit]').focus();

            return this._confirmmodal;

        },
        /*
         * tooltip
         * @content 消息内容，可为function
         * @delay 延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
         * @onhide 隐藏后触发事件
         * @triggerEle  触发元素选择器
         * @triggerType  hover|click|show
         * @triggerAlign   显示位置支持top,left,bottom,right,最多可支持同时填写不相悖两项，前一个为主要停靠位置，后面方向为对齐方向，如top lef指停靠容器上方显示，与停靠容器左方对齐
         *
         */
        tooltip: function (option) {
            //msg, time, fn
            var template = this.get('template');

            $.extend(template.tooltip, option);
            var _skin = this.get("skin");
            var defaultConf = {
                type: 'html',
                lock: false,
                content: option.content,
                time: option.delay || 0,
                isdrag: false,
                skin: _skin,
                end: ''
            };
            var config = $.extend(defaultConf,template.tooltip);
            var obj = new Modal(config);
            if (option.onhide) {
                obj.on('hide', option.onhide);
            }
            if (option.triggerEle) {
                obj.triggerShow(option);
            }
            return obj;
        },
        /*
         * 定时关闭
         */
        tips: function (option) {
            //msg, time, fn
            var template = this.get('template');
            var _width = template.tips.width;
            var _height = template.tips.height;
            var _html = template.tips.html;
            var _skin = this.get('skin');

            var config = {
                type: 'html',
                lock: false,
                skin: _skin,
                width: _width,
                height: _height,
                html: _html,
                content: option.content,
                time: 0,
                isdrag: false,
                end: ''
            };
            var obj = new Modal(config);
            obj.show(option.triggerEle, option.triggerAlign);
            setTimeout(function () {
                obj.close();
            }, option.delay);
            return obj;
        },
        modal: function (option) {

            var template = this.get('template');
            var _width = template.modal.width;
            var _height = template.modal.height;
            var _html = template.modal.html;
            var _skin = this.get('skin');
            if (typeof option == "string") {
                if (this.modal) {
                    //eval("this._modal." + option + "();")
                    this._modal[option]();
                }
                return this.modal;
            }


            var config = option || {};
            var _config = {
                type: config.type || 'html',
                lock: true,
                mask: true,
                skin: _skin,
                width: config.width || _width,
                height: config.height || _height,
                title: config.title || '',
                html: _html,
                content: config.content || '&nbsp;',
                url: config.url || null,
                quickClose: true,
                end: ''
            };
            $.extend(_config, config);

            if (this._modal) {
                this._modal.open(_config);
            }
            else {
                this._modal = new Modal(_config);
                if (option.onShow) {
                    this._modal.on('show', option.onShow);
                }
                this._modal.show();
            }
            return this._modal;
            //var obj = new Modal(_config);
            //return obj;
        },
        validata: function (option) {
            //msg, time, fn
            var template = this.get('template');

            $.extend(template.validata, option);
            var _width = template.validata.width;
            var _height = template.validata.height;
            var _html = template.validata.html;
            var _border = template.validata.border;
            var _skin = this.get('skin');

            var config = {
                type: 'html',
                lock: false,
                skin: _skin,
                width: _width,
                height: _height,
                border: _border,
                html: _html,
                content: option.content,
                time: option.delay || 0,
                isdrag: false,
                end: ''
            };
            var obj = new Modal(config);
            if (option.onhide) {
                obj.on('hide', option.onhide);
            }
            if (option.triggerEle) {
                obj.triggerShow(option);
            }
            return obj;
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
    return Dialog;
});
