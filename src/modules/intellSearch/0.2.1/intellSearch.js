/*
    * intellisense search (智能搜索)
    * Created by 李岩岩 on 2016/1/5.
    * 包含三个对象:Search(搜索控件),JsonDB(数据缓存),intellSearch(智能搜索模块)
    * 其中intellSearch作为Search一插件,也可单独使用
    * 同时Search支持其他扩展插件
    * 同样JsonDB作为intellSearch缓存数据模块,也可单独使用
    * SearchPanel暂时无用
    */
define('intellSearch/0.2.1/intellSearch', ['intellSearch/0.2.1/searchBase', './views/intellSearch.dot','intellSearch/0.2.1/jsonDB'], function (require, exports, module) {
    var SearchBase = require("intellSearch/0.2.1/searchBase");
    var jsonDB = require("intellSearch/0.2.1/jsonDB");
        intellTmpl = require('./views/intellSearch.dot')

    /*
        * 智能搜索模块
        * events:copy,itemselect($obj,selindex),founddata(count),itemclick,paste
        */
    var intellSearch = SearchBase.extend({
        initialize: function (options) {
            //init super
            intellSearch.superclass.initialize.apply(this, arguments);
            //this.init(config);
            intellSearch.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var o_pobj = options.o_pobj;
            var o_input = options.o_input;
            var o_wapper = options.o_wapper;

            var self = this;
            self.select = false;//用户是否使用选择操作
            self.enable = false;//是否启用 ,隐藏后禁用
            self.searchcount = 0;//查询次数
            self.dataCount = 0;//查询数据总数;

            //事件监听
            o_wapper.on('click', '[intelsearch-item]', function (e) {
                self.trigger("itemclick", $(this));
            });
            o_wapper.on('mouseover', '[intelsearch-item]', function (e) {
                var $obj = $(this);
                $obj.siblings().removeClass('select');
                $obj.addClass('select');
            });

            //o_input.on('keyup', function (e) {
            //    self._onKeyUp(e, this);
            //});
            //o_input.on('keydown', function (e) {
            //    if (e.keyCode == 86 && e.ctrlKey) {
            //        self.trigger("paste",e)
            //    }
            //});
            o_pobj.on("nodata", function () {
                self.hide();
            });
            o_pobj.on("hasdata", function () {
                self.searchData();
            });
            o_pobj.on("key_up", function (e) {
                self._onKeyUp(e);
            });
            o_pobj.on("key_down", function (e) {
                self._onKeyDown(e);
            });

            o_pobj.on('search', function () {
                self.searchData();
            });

            //自定义event
            self.on("itemselect", function (e, o) {
                self._onItemSelect(o);
            });
            self.on("itemclick", function (e, o) {
                self._onItemSelect(o);
                o_pobj.trigger("submit");
            });


            self.on("dataempty", function (e, keyword) {
                self._onDataEmpty(e, keyword);
            });
            self.on("enter", function (e) {
                self._onEnter(e, self.o_input.val());
                o_pobj.trigger("submit");
            });
            self.on("render", function () {
                //console.log("111");
                self._afterRender();
            });

        },
        ATTRS: {
            el: null,//
            width: 0,//列表宽度
            aligner: null,//要对齐的元素
            highLightStyle: "color:black;font-weight:bolder;",//高亮显示内容样式
            dotTemplate: intellTmpl,//dot模板
            showCount: false,
            /*
            * the method for item content
            */
            renderItem: function (keyword, value) {
                return value;
            },
            /*
            * 异步请求数据
            * @keyword 请求关键字
            *  @res 回调函数
            */
            reqData: function (keyword, res) {
                var self = this;
                var url = this.get("apiurl");
                this.getJsonp(url.replace("{keyword}", keyword), function (data) {
                    var _data = new Array();
                    var itemtmpl = '<span style="{style}">{value}</span>'.replace("{style}", "color:#ff6a00;font-weight:bolder;");
                    if (data.result) {
                        for (var i = 0; i < data.result.length && (i < self.itemNumber); i++) {
                            var showvalue = "";
                            var _name = data.result[i][0];
                            var _value = data.result[i][1];
                            if (keyword) {
                                showvalue = _value.replace(new RegExp(keyword.replace(/\\/g, '\\\\'), 'gi'), function (word) {
                                    return itemtmpl.replace("{value}", word);
                                });
                            }
                            else {
                                showvalue = _value;
                            }
                            _data.push({ name: _name, value: _value, showvalue: showvalue });

                        }
                        res(_data);
                    }
                    else {
                        res(data.result);
                    }
                });
            },
            /*缺省数据(查无结果或输入内容为空时触发)*/
            defData: function (keyword, res) {

            },
            /*回车*/
            onEnter: function (e, obj) {

            }

        },
        EVENTS: {
            //".class": {
            //    "click": "",
            //    "hover": "hover"
            //}
        },
        DOCEVENT: {
            //".class1": {
            //    "click": ""
            //}
        },
        METHODS: {
            searchData: function () {
                var self = this;
                var keyword = self.o_pobj.getKeyWord();
                self.get("reqData").call(self, keyword, function (data) {
                    if (data == null || data.length == 0) {
                        self.hide();
                        self.trigger("nodata");
                        return;
                    }
                    var r_data = { list: data, showCount: self.get("showCount") };
                    self.render(r_data);
                    self.show();
                });
            },
            onfocus: function (e) {

            },
            getDataCount: function () {
                return this.dataCount || 0;
            },
            //获取选择数据
            getSelectData: function (o) {
                o = o || this.o_wapper.find(".select");
                if (o.length == 0) {
                    return null;
                }
                var v = o.attr("data-value"),
                    t = o.attr("data-text"),
                    l = o.attr("data-link"),
                    i = o.index();
                return { value: v, text: t, link: l, index: i };
            },
            viewDataFormat: function (keyword,value) {
                var itemtmpl = '<span style="{style}">{value}</span>'.replace("{style}", this.get("highLightStyle"));
                return value.replace(new RegExp(keyword.replace(/\\/g, '\\\\'), 'gi'), function (word) {
                    return itemtmpl.replace("{value}", word);
                });
            },
            itemDataFormat: function (keyword, json) {
                json.showvalue = this.viewDataFormat(keyword, json.text);
                return json;
            }
        },
        __modules: {},
        /*
            * 按上方向键
            */
        _onKeyUp: function (e, obj) {
            var self = this;
            var $obj = self.o_wapper.find("[intelsearch-item].select");
            var $prevobj = $obj.prev("[intelsearch-item]");
            if ($prevobj.length > 0) {
                $obj.removeClass("select");
                $prevobj.addClass("select");
            }
            else {
                return;
            }
            self.trigger("itemselect", $prevobj, $prevobj.index());
        },
        /*
            * 下方向键
            */
        _onKeyDown: function (e) {
            var self = this;
            var $obj = self.o_wapper.find("[intelsearch-item].select");
            var $nextobj = $obj.next("[intelsearch-item]");
            if ($nextobj.length > 0) {
                $obj.removeClass("select");
                $nextobj.addClass("select");
            }
            else {
                return;
            }
            self.trigger("itemselect", $nextobj, $nextobj.index());
        },
        /*
            * 选中项时,保存该项数据
            */
        _onItemSelect: function (o) {
            var self = this;
            var json = self.getSelectData(o);
            self._setTrackData(json);
            self.o_input.val(json.text);
        },
        _onDataEmpty: function (e, keyword) {
            //var self = this;
            //this.get("defData")(keyword, function (data) {
            //    self.render(keyword, data, 1);
            //});
        },
        _onEnter: function (e, obj) {
            this.get("onEnter")(e, obj);
        },
        /*渲染后触发*/
        _afterRender:function () {
            var self = this;
            var json = self.getSelectData();
            self._setTrackData(json);
        },
        _setTrackData: function (json) {
            var self = this;
            var v, t, l, i;
            if (json == null) {
                v = '';
                t = '';
                l = '';
                i = -1;
            }
            else {
                v = json.value;
                t = json.text;
                l = json.link;
                i = json.index;
            }
            self.o_pobj.setTrackData("selectindex", i+1);
            self.o_pobj.setTrackData("value", v)
            self.o_pobj.setTrackData("link", l)
            self.o_pobj.setTrackData("text", t);
        },
        _addItem: function (keyword, value, index) {
            var self = this;
            var newhtml = "";
            var highLightStyle = self.get("highLightStyle");
            var zshead = '<span style="' + highLightStyle + '">';
            var zsend = '</span>';

            var txt = self.get("renderItem")(keyword, value);
            if (keyword) {
                newhtml = txt.replace(new RegExp(keyword.replace(/\\/g, '\\\\'), 'gi'), function (word) {
                    return zshead + word + zsend;
                });
            }
            else {
                newhtml = txt;
            }
            var selclass = (index == 0) ? "select" : "";
            self.$list.append('<div class="ui_search_item ' + selclass + '">' + newhtml + '</div>');
        }
    });

    return intellSearch;
});