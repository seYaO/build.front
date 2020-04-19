/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "combo/0.4.0/combo", "css!combobox/0.4.0/combobox"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("combobox/0.4.0/combobox", ["base/0.4.0/react-module", "combo/0.4.0/combo", "combobox/0.4.0/combobox.css"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var UICombo = require("combo/0.4.0/combo");
            return _module(ReactModule, UICombo);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, UICombo) {
    var Combo = UICombo.React;
    var defOpt = {
        id: "", //items回调时作为参数发送,方便去人初始哪个组件
        height: "200px",
        items: new Array(), //默认内容支持function
        viewCount: -1, //显示数量，默认-1全显示；
        selectMode: "single", //选择模式,单选single or  多选multi
        textMode: "string", //文本显示模式 tag:标签模式,string:字符串模式; 默认string
        defaultInfo: " = = 请选择 = = ",
        skin: "blue", //blue,orange
        disabled: false,
        validate: "", //验证
        textFormat: function textFormat(itemdata) {
            return itemdata["text"];
        },
        //明细显示内容格式化,无为空默认使用textFormat
        detailFormat: null,
        valueFormat: function valueFormat(itemdata) {
            return itemdata["id"];
        },
        searchFields: "", //同步搜索模式 搜索字段,多个可按逗号隔开，默认使用detailFormat的返回值
        //搜索配置
        searchOption: {
            CaseSensitivity: false //大小写敏感
        },
        //绑定的值不存在时调次方法获取值
        onValueSearch: function onValueSearch(v, obj, res) {
            res([]);
        },
        // onItemClick: function (item, obj) {
        //     return true;
        // },
        // requestData: function (item, cb) {

        // },
        value: "", //单选的默认值
        values: new Array(), //多选的默认值
        enableSearch: false,
        onSearch: function onSearch(opt, res) {
            this.refs.content.clientSearch(opt.key);
            // res(this.refs.content.clientSearch(opt.key));
        },
        onChange: function onChange(e, v) {},
        searchTrigger: "enter", //enter:回车,input:输入
        searchType: "client", //client|server
        allowClear: true //是否允许清空
    };

    var Methods = {
        open: function open() {
            this.refs.main.open();
        },
        close: function close() {
            this.refs.main.close();
        },
        val: function val(value) {
            return this.refs.main.val(value);
        },
        bindItems: function bindItems(items) {
            this.refs.main.bindItems(items);
        },
        clear: function clear(params) {
            this.refs.main.clear();
        },
        // getValueData: function () {
        //     return this.objtree.data;
        // },
        setValueData: function setValueData(item) {
            // var _text = this.props.textFormat(item);
            // var _value = this.props.valueFormat(item);
            // this.setState({ text: _text });
        },
        getSelectItems: function getSelectItems() {
            return this.refs.main.getSelectItems();
        },
        selectPrep: function selectPrep() {},
        changeSelect: function changeSelect(num) {
            var self = this;
            var obj = self.getSelectItem();
            if (!obj) {
                if (num == 1) {
                    self.o_wrapper.find(".combobox-item:first").addClass("selected");
                } else {
                    self.o_wrapper.find(".combobox-item:last").addClass("selected");
                }
                return;
            }
            var o_obj = $(obj);
            var tagobj;
            if (num == 1) {
                tagobj = o_obj.next();
            } else {
                tagobj = o_obj.prev();
            }
            if (tagobj.length > 0) {
                o_obj.removeClass("selected");
                tagobj.addClass("selected");
                var p_obj = tagobj.parent();
                var _h = tagobj.get(0).offsetTop + tagobj.get(0).offsetHeight;
                if (_h > p_obj.height()) {
                    p_obj.get(0).scrollTop = _h - p_obj.height();
                }
                if (tagobj.get(0).offsetTop < p_obj.get(0).scrollTop) {
                    p_obj.get(0).scrollTop = tagobj.get(0).offsetTop;
                }
            }
        },
        disable: function disable() {
            this.refs.main.disable();
        },
        enable: function enable() {
            this.refs.main.enable();
        }
    };

    var CommonMethods = {
        __initItems: function __initItems() {
            var self = this;
            if (this.props.items) {
                if (typeof this.props.items == "function") {
                    this.props.items({ id: self.props.id }, function (items) {
                        self.bindItems(items);
                    });
                } else {
                    self.bindItems(this.props.items);
                }
            }
        },
        clientSearch: function clientSearch(key) {
            this.setState({ keyword: key });
        },
        val: function val(values, items) {
            var self = this;
            if (values === undefined) {
                return this.state.value;
            } else {
                self.__setValue(values, items);
            }
        },
        bindItems: function bindItems(items, issearch) {
            var self = this;
            //查询后的数据去重
            if (issearch) {
                items = self.__valiSearchItems(items);
            }
            this.setState({ items: items }, function () {
                var v = self.objtree.data;
                if (v || v === 0) {} else {
                    v = self.props.value;
                }
                self.__changeVal(v);
            });

            // var self = this;
            // //查询后的数据去重
            // if (issearch) {
            //     items = self.__valiSearchItems(items);
            // }
            // this.setState({ items: items }, function () {
            //     var v = self.objtree.data;
            //     if (v || v === 0) {

            //     }
            //     else {
            //         v = self.props.value
            //     }
            //     self.changeVal(v, [], function (selitems) {
            //         self.trigger("selected.change", null, selitems);
            //         self.props.onSelectedChange(v, selitems);
            //     });
            // });
        },
        //值得调整,不触发联动,独立个体使用
        changeVal: function changeVal(value, items) {
            this.__changeVal(value, items);
        },
        __getNoDataDom: function __getNoDataDom(hassearch) {
            var nodataDom = null;
            if (this.state.items.length == 0) {
                nodataDom = React.createElement("div", { className: "list-item empty" }, "暂无数据");
            } else if (!hassearch) {
                nodataDom = React.createElement("div", { className: "list-item empty" }, "无匹配结果");
            }
            return nodataDom;
        },
        __valiSearch: function __valiSearch(itemdata, text) {
            var self = this;
            if (self.props.searchType != "client") {
                return true;
            }
            if (!self.state.keyword) {
                return true;
            }

            var haskey = false;
            if (this.props.searchFields == "") {
                if (self.__textCompare(text)) {
                    haskey = true;
                }
            } else {
                //指定搜索字段
                var valitexts = this.props.searchFields.split(",");
                valitexts.forEach(function (v) {
                    var _text = itemdata[v];
                    if (_text != undefined && _text != null) {
                        _text = _text + "";
                        if (self.__textCompare(_text)) {
                            haskey = true;
                        }
                    }
                });
            }
            return haskey;
        },
        //文本对比
        __textCompare: function __textCompare(text, keyword) {
            var haskey = false;
            keyword = keyword || this.state.keyword;
            var _text = "";
            var _keyword = "";
            if (!this.props.searchOption.CaseSensitivity) {
                _text = text.toLowerCase();
                _keyword = keyword.toLowerCase();
            } else {
                _text = text;
                _keyword = keyword;
            }
            return _text.indexOf(_keyword) > -1;
        }
    };

    //单选列表
    var SingleBox = React.createClass({ displayName: "SingleBox",
        mixins: [ReactModule.reactMethod, CommonMethods],
        getInitialState: function getInitialState() {
            var items = new Array();
            if (this.props.items && typeof this.props.items != "function") {
                items = this.props.items;
            }
            return {
                items: items,
                value: this.props.value,
                keyword: ""
            };
        },
        clear: function clear() {
            this.__setValue("");
        },
        __setValue: function __setValue(value, items) {
            if (this.props.beforeChange) {
                if (this.props.beforeChange(this, value, items)) {
                    this.triggerData(value, "", items);
                }
            } else {
                this.triggerData(value, "", items);
            }
        },
        __onItemClick: function __onItemClick(item, index) {
            var value = this.props.valueFormat(item);
            this.__setValue(value, item);
            this.props.onSelect(value);
            // this.triggerData(value);
            // this.props.onSelect();
            // this.trigger("single.hide");
            this.trigger("item.selected", value, item);
        },
        //服务器搜索数据处理,已选数据与之合并去重
        __valiSearchItems: function __valiSearchItems(items) {
            return items;
        },
        __changeVal: function __changeVal(value, items, cb) {
            var self = this;
            var selitems = this.getItemsByValue(value);
            var opt = { value: value };

            if (selitems.length == 0) {
                if (value !== "") {
                    this.props.onValueSearch(value, this, function (items) {
                        self.__changeState(value, selitems, items, cb);
                    });
                    return;
                }
                //  && items
            }
            self.__changeState(value, selitems, items, cb);
        },
        __changeState: function __changeState(value, selItems, items, cb) {
            var self = this;
            var opt = { value: value };
            //选中值为空的时候
            if (selItems.length == 0 && items && items.length > 0) {
                if (items instanceof Array) {
                    selItems = items;
                } else {
                    selItems.push(items);
                }
                var nitems = this.state.items;
                nitems = nitems.concat(items);
                // console.log(nitems)
                opt.items = nitems;
            }
            this.setState(opt, function () {
                // self.trigger("item.selected", null, selitems);
                // self.trigger("selected.change", null, selitems);
                // self.trigger("single.hide");
                cb && cb(selItems);
                self.props.onChange(null, value, selItems);
            });
        },
        getItemsByValue: function getItemsByValue(value) {
            var self = this;
            var selitem = new Array();
            this.state.items.map(function (item) {
                var _value = self.props.valueFormat(item);
                if ($.compare(_value, value)) {
                    selitem.push(item);
                    return;
                }
            });
            return selitem;
        },
        //获取选中的数据
        getSelectItems: function getSelectItems() {
            return this.getItemsByValue(this.state.value);
        },
        //默认
        dataChange: function dataChange(field, value, items) {
            var self = this;
            // console.log(items);
            this.__changeVal(value, items, function (selitems) {
                // self.trigger("selected.change", null, selitems);
                // self.props.onSelectedChange(value, selitems);
            });
        },
        render: function render() {
            var self = this;
            var defaultdom = null;
            // defaultdom = (this.state.value === "") ? <div className="list-default" key="default">
            //     {this.props.defaultInfo}
            // </div> : "";
            var hassearch = false;
            var itemcount = 0;
            return React.createElement("div", { className: "module-listbox ", onKeyDown: this.__onKeyDown }, defaultdom, this.state.items.map(function (v, i) {
                if (self.props.viewCount > 0 && itemcount >= self.props.viewCount) {
                    return null;
                }
                var _text = self.props.textFormat(v);

                //同步搜索实现
                if (self.__valiSearch(v, _text)) {
                    hassearch = true;
                } else {
                    return null;
                }
                itemcount++;
                var value = self.props.valueFormat(v);
                var _class = "list-item";
                if ($.compare(value, self.state.value)) {
                    _class += " single-selected";
                }
                return React.createElement("div", { className: _class, onClick: self.__onItemClick.bind(self, v, i), key: i }, _text);
            }), this.__getNoDataDom(hassearch));
        },
        componentDidMount: function componentDidMount() {
            this.__initItems();
        },
        __onKeyDown: function __onKeyDown(e) {
            console.log(1);
        }
    });
    SingleBox.defaultProps = {
        onSelect: function onSelect() {}
    };

    //多选列表
    var MultiBox = React.createClass({ displayName: "MultiBox",
        mixins: [ReactModule.reactMethod, CommonMethods],
        getInitialState: function getInitialState() {
            var items = new Array();
            if (this.props.items && typeof this.props.items != "function") {
                items = this.props.items;
            }
            return {
                items: items,
                selitems: new Array(),
                unselitems: new Array(),
                value: new Array(),
                keyword: ""
            };
        },
        clear: function clear(v) {
            // console.log(v);
            if (v !== undefined) {
                var values = this.state.value;
                values.remove(v);
                this.__setValue(values);
            } else {
                this.__setValue([]);
            }
        },
        __setValue: function __setValue(value, items) {
            value = this.__formatValue(value);
            var _value = this.props.valueType == "string" ? value.join(",") : value;

            if (this.props.beforeChange) {
                if (this.props.beforeChange(this, _value, items)) {
                    this.triggerData(_value, "", items);
                }
            } else {
                this.triggerData(_value, "", items);
            }
        },
        //根据值格式化选中值
        __changeVal: function __changeVal(value, items, cb) {
            var self = this;
            var values = this.__formatValue(value);
            var selitems = new Array();
            var unselitems = new Array();
            var noitemvalue = values.copy(); //未找到匹配性的值
            this.state.items.map(function (v) {
                var hasvalue = false;
                var _value = self.props.valueFormat(v);
                for (var i = 0; i < noitemvalue.length; i++) {
                    if (_value == noitemvalue[i]) {
                        selitems.push(v);
                        noitemvalue.removeAt(i);
                        // hasvalue = true;
                        return;
                    }
                }
                unselitems.push(v);
            });
            if (items) {
                items.map(function (v) {
                    var hasvalue = false;
                    var _value = self.props.valueFormat(v);
                    for (var i = 0; i < noitemvalue.length; i++) {
                        if (_value == noitemvalue[i]) {
                            selitems.push(v);
                            noitemvalue.removeAt(i);
                            // hasvalue = true;
                            return;
                        }
                    }
                    unselitems.push(v);
                });
            };

            if (noitemvalue.length > 0) {
                this.props.onValueSearch(noitemvalue.join(","), this, function (result) {
                    self.__changeState(values, selitems.concat(result), unselitems, cb, self.state.items.concat(result));
                });
            } else {
                self.__changeState(values, selitems, unselitems, cb);
            }
        },
        __changeState: function __changeState(values, selItems, unselitems, cb, items) {
            var self = this;
            var opt = {
                selitems: selItems,
                unselitems: unselitems,
                value: values
            };
            if (items) {
                opt.items = items;
            }
            this.setState(opt, function () {
                // self.trigger("item.selected", null, selitems);
                // self.trigger("data.change", null, selitems);
                // self.trigger("mulit.hide");
                cb && cb(selItems);
                self.props.onChange(null, values, selItems);
            });
        },
        __onItemClick: function __onItemClick(item, index) {
            var self = this;
            var value = this.props.valueFormat(item);
            var values = this.state.value;
            values.push(value);
            // self.trigger("item.selected", item);
            this.__setValue(values);
            self.trigger("item.selected", value, item);
        },
        __onRemoveClick: function __onRemoveClick(item, index) {
            var self = this;
            var value = this.props.valueFormat(item);
            var values = this.state.value;
            for (var i = 0; i < values.length; i++) {
                var element = values[i];
                if (element == value) {
                    values.removeAt(i);
                    break;
                }
            }
            self.trigger("item.unselected", item);
            this.__setValue(values);
        },
        //格式化值为数组
        __formatValue: function __formatValue(value) {
            if (value && typeof value == "string") {
                return value.split(",");
            } else if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && Array == value.constructor) {
                return value;
            } else {
                return new Array();
            }
        },
        //服务器搜索数据处理,已选数据与之合并去重
        __valiSearchItems: function __valiSearchItems(items) {
            var self = this;
            var newitems = this.state.selitems;
            var values = this.__formatValue(this.state.value);
            items.map(function (v) {
                var _value = self.props.valueFormat(v);
                for (var i = 0; i < values.length; i++) {
                    if (_value == values[i]) {
                        return;
                    }
                }
                newitems.push(v);
            });
            return newitems;
        },
        //默认
        dataChange: function dataChange(field, value, items) {
            var self = this;
            this.__changeVal(value, items, function (selitems) {
                self.trigger("selected.change", null, selitems);
                self.props.onSelectedChange(value, selitems);
            });
        },
        render: function render() {
            var self = this;
            var seldom = new Array();
            var values = this.state.value;
            if (this.props.textMode !== "tag") {
                if (this.state.selitems.length > 0) {
                    seldom.push(React.createElement("div", { className: "list-title", key: "selected" }, React.createElement("i", { className: "bico bico-line-vertical" }), React.createElement("span", null, "已选列表")));
                    this.state.selitems.map(function (v, i) {
                        var text = self.props.textFormat(v);
                        seldom.push(React.createElement("div", { className: "list-item selected", key: i }, text, React.createElement("i", { className: "bico bico-close", onClick: self.__onRemoveClick.bind(self, v, i) })));
                    });
                    seldom.push(React.createElement("div", { className: "list-title", key: "unselected" }, React.createElement("i", { className: "bico bico-line-vertical" }), React.createElement("span", null, "待选列表")));
                }
                // else {
                //     seldom.push(<div className="list-default" key="default">
                //         {this.props.defaultInfo}
                //     </div>);
                // }
            }

            var hassearch = false;
            var itemcount = 0;
            return React.createElement("div", { className: "module-listbox " }, seldom, this.state.unselitems.map(function (v, i) {
                if (self.props.viewCount > 0 && itemcount >= self.props.viewCount) {
                    return null;
                }
                var _text = self.props.textFormat(v);
                //同步搜索实现
                if (self.__valiSearch(v, _text)) {
                    hassearch = true;
                    itemcount++;
                    return React.createElement("div", { className: "list-item", onClick: self.__onItemClick.bind(self, v, i), key: i }, _text);
                }
            }), this.__getNoDataDom(hassearch));
        },
        componentDidMount: function componentDidMount() {
            this.__initItems();
        }
    });
    MultiBox.defaultProps = {
        value: "", //默认值 字符串形式
        valueType: "string", //值类型,默认为string,可配置为array,同values
        searchType: "client", //client|server
        showSelected: true, //显示已选中
        onSelectedChange: function onSelectedChange() {}
    };

    var ComboBox = React.createClass({ displayName: "ComboBox",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            return { value: this.props.value, text: "" };
        },
        render: function render() {
            var self = this;
            var dom = null;
            var opt = $.extend({}, this.props);
            if (opt.field !== undefined) {
                delete opt.field;
            }
            return React.createElement(Combo, React.__spread({ ref: "main" }, opt, { objtree: this.objtree }), this.props.selectMode == "single" ? React.createElement(SingleBox, null) : React.createElement(MultiBox, null));
        }
    });
    ComboBox.defaultProps = defOpt;

    var UIModule = ReactModule.extend({
        init: function init(options) {
            $(this.attr.wrapper).addClass("form-module");
            $(this.attr.wrapper).width(this.attr.width);
        },
        ATTRS: defOpt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: ComboBox
    });
    UIModule.React = ComboBox;

    return UIModule;
});