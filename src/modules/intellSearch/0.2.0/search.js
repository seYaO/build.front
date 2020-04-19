define('intellsearch/0.2.0/search', ['base/0.1.0/base', 'intellsearch/0.2.0/search.css', 'intellSearch/0.2.0/tmpl/search'], function (require, exports, module) {
    var searchTmpl = require('intellSearch/0.2.0/tmpl/search');
    /*
     * intellisense search (智能搜索)
     * Created by 李岩岩 on 2016/1/5
     * 同时Search支持其他扩展插件
     */

    /*
     * 搜索控件
     * events: nodata,hasdata,focus,blur,input,keyup,esc,enter,search,change,key_up,key_down
     *
     */
    var Search = Base.extend({
        initialize: function (options) {
            //init super
            Search.superclass.initialize.apply(this, arguments);
            //init
            Search.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var tmpText = self.get("dotTemplate");
            //var o_wapper = $();
            var _html = tmpText({ placeholder: this.get("placeholder"), submitName: this.get("submitName"),hotSearch:this.get("hotSearch") });
            var o_wapper = self.o_wapper = $(self.get("el")).append(_html);

            var o_input = self.o_input = o_wapper.find("[search-input]");
        
            self.__initModule();

            //监听事件
            o_input.on('focus', function (e) {               
                $(".new-label").css("display","none");             
                if ($(this).val() === "") {
                    $(this).attr("placeholder", "");
                }
                self.__setShowState(1);               
                self.checkData();

                self.trigger('focus', e);
            });
            o_input.on('blur', function (e) {             
                self.__setShowState(0);
                //self.hide();
                if ($(this).val() === "") {
                    $(this).attr("placeholder", self.get("placeholder"));
                    if (!$("body").hasClass("w990")) {
                        $(".new-label").css("display", "block");
                    }
                }

                self.trigger('blur', e);
            });
            o_input.on("keyup", function (e) {
                self._onKeyUp(e);
            });
            o_input.on("keydown", function (e) {
                self._onKeyDown(e);
            });

            o_wapper.on("click", "[search-close]", function () {
                self.hide();
            });
            o_wapper.on("click", "[search-submit]", function () {
                self.trigger("enter");
            });

            //阻止面板点击冒泡(for 点击关闭)
            o_wapper.click(function (e) {
                var ev = e || window.event;
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                }
                else if (window.event) {
                    window.event.cancelBubble = true;//兼容IE
                }
            });

            o_wapper.on('focus', function (e) {
                console.log(1);
            });

            //初始事件
            self.on("enter", function () {
                self.hide();
                self.trigger("submit");
            });
            self.on("change", function () {
                var keyword = self.getKeyWord();
                if (keyword != null && keyword != "") {
                    self.trigger("hasdata", keyword);
                }
                else {
                    self.trigger("nodata");
                };
            });
            self.on("focus", function () {
                var keyword = self.getKeyWord();
                if (keyword != null && keyword != "") {
                    self.trigger("hasdata", keyword);
                }
                else {
                    self.trigger("nodata");
                };
            });



        },
        ATTRS: {
            el: "",
            width: null,
            height: null,
            skin: "skin1",
            placeholder: '请输入目的地,主题或关键字',
            submitName: '搜索',
            dotTemplate: searchTmpl,//dot模板
            modules: {
                //intellSearch: {
                //    type: 'module',
                //    group:'',
                //    key: 'intellSearch',
                //    config: {},
                //    module: null
                //}
            },
            hotSearch:[],
            plugins:[]
        },
        METHODS: {
            hide: function () {    
                if (this.o_group.find(".ly_search_panel:not(.hidden)").length == 0) {                
                    this.__hide();
                }              
            },
            show: function () {
                var self = this;
                if (this.o_group.attr("data-showstate") != 1 || this.o_group.hasClass("active")) {
                    return;
                }
                this.o_group.addClass("active");
                $(document).bind('click', function () {
                    self.onDocClick.call(self, arguments.callee);
                });
            },
            /*
             * 渲染
             * @param
             */
            render: function (modulenames, _arguments) {
                var self = this;
                self.o_group.find(".ly_search_panel").addClass('hidden');
                var ar_module = modulenames.split(',');
                for (var i = 0; i < ar_module.length; i++) {
                    var _fn = self.__modules[ar_module[i]];
                    if (_fn) {
                        //_fn.show.apply(this, _arguments);
                        _fn.show(_arguments);
                    }
                }
                self.show();
            },
            onEmpty: function () {

            },
            /*
             * 获取模块对象
             */
            getModule: function (key) {
                return this.__modules[key];
            },
            //点击文档其他地方隐藏面板
            onDocClick: function (obj) {
                $(document).unbind('click', obj);
                this.__hide();               
            },
            getKeyWord:function () {
                return this.o_input.val();
            },
            setKeyWord: function (k) {
                this.o_input.val(k);
                this.checkData();
            },
            /*
             * 在html标签中设置属性值
             */
            setTrackData: function (key, value) {
                this._data[key] = value;
                this.o_group.attr("search-" + key, value);
            },
            /*
            * 在html标签中设置属性值
            * text,name,link
            */
            getTrackData: function (key) {
                //return this.o_group.attr("search-" + key);
                return this._data[key];
            },
            //检测数据变动
            checkData: function () {
                var self = this;
                var ok = self.getTrackData("keyword");
                var keyword = self.getKeyWord();
                if (ok != keyword) {
                    self.setTrackData("keyword", keyword);
                    self.trigger("change");
                }
            }

        },
        _onKeyUp: function (e, obj) {
            var self = this;
            switch (e.keyCode) {
                case 13:
                    self.trigger("enter");
                    break;
                case 27:
                    self.trigger("esc");
                    break;
                case 38:
                    self.trigger("key_up");
                    break;
                case 40:
                    self.trigger("key_down");
                    break;
                default:
                    self.checkData();
                    break;
            }
        },
        _data:{},
        _onKeyDown: function (e) {
            if (e.keyCode == 86 && e.ctrlKey) {
                this.trigger("paste", e)
            }
        },
        __init: function () {
            //初始化 渲染
            //var width = self.get("width");
            //var height = self.get("height");
            //if (!width) {
            //    width = $el.width() + "px";
            //}
            //var o_wapper = self.o_wapper = $("<div>", {
            //    "class": "ly_search_gp " + self.get("skin")
            //}).appendTo($el);

            //o_wapper.css({
            //    top: $el[0].offsetHeight + $el[0].offsetTop,
            //    left: $el[0].offsetLeft,
            //    width: width
            //});
        },
        __modules: {},
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
        __location: function (element) {
            var offsetTop = element.offsetTop;
            var offsetLeft = element.offsetLeft;
            while (element = element.offsetParent) {
                offsetTop += element.offsetTop;
                offsetLeft += element.offsetLeft;
            }
            var o = {};
            o.left = offsetLeft;
            o.top = offsetTop;
            return o;
        },
         __initModule: function () {
            var self = this;
            var modules = self.get("modules");
            var o_group =  self.o_wapper.find("[search-group]");
            var gplist = {};
            o_group.each(function () {
                var gpname = $(this).attr("search-group");
                gplist[gpname] = $(this);
            });
            self.o_group = gplist['inputlist'];

            //初始化模块
            self.__modules = self.__modules || {};
            $.each(modules, function (key, item) {
                var hasPanel = item.hasPanel;
                var elobj = $('<div>', {
                    'class': 'ly_search_panel hidden ' + item.key
                });
                if (hasPanel !== false) {                 
                    if (item.group) {
                        elobj.appendTo(gplist[item.group]);
                    }
                    else {
                        elobj.appendTo(gplist["inputlist"]);
                    }

                }
                if (item.type == 'module') {
                    var config = item.config;
                    $.extend(config, { o_pobj: self, o_wapper: elobj, o_input: self.o_input, o_wrapper: elobj });
                    try {
                        self.__modules[key] = new item.module(config);
                    } catch (e) {
                        console.log(e);
                    }
                  
                }
                else {
                    self.__modules[key] = {
                        show: function () {
                            if (typeof item.html === 'function') {
                                item.html.call(item, function (txt) {
                                    elobj.html(txt);
                                });
                            }
                            else {
                                elobj.html(_html);
                            }
                            elobj.removeClass('hidden');
                        }
                    };
                }
            });
         },
         __setShowState: function (state) {
             this.o_group.attr("data-showstate", state);
         },
         __hide: function () {
             this.o_group.removeClass("active");
             this.trigger("hide");
         }

    });

    return Search;
});

