/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "jsondb/0.4.0/jsondb", "css!combo/0.4.0/combo"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("combo/0.4.0/combo", ["base/0.4.0/react-module", "jsondb/0.4.0/jsondb", "combo/0.4.0/combo.css"], function (require, exports, module) {
            var Module = require("base/0.4.0/react-module");
            var JsonDB = require("jsondb/0.4.0/jsondb");
            return _module(Module, JsonDB);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, JsonDB) {
    var defOpt = {
        id: "", //items回调时作为参数发送,方便去人初始哪个组件
        width: "100%", //下拉框的宽度
        height: "200px",
        items: new Array(), //默认内容支持function
        selectMode: "single", //选择模式,单选single or  多选multi
        heightMode: "custom", //高度模式,自适应还是固定高度custom|auto
        textMode: "string", //文本显示模式 tag:标签模式,string:字符串模式; 默认string
        defaultInfo: " = = 请选择 = = ",
        skin: "blue", //blue,orange
        validate: "", //验证
        textFormat: function textFormat(itemdata) {
            return itemdata["text"];
        },
        valueFormat: function valueFormat(itemdata) {
            return itemdata["id"];
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
        show: function show() {},
        hide: function hide() {},
        open: function open() {
            var o_main = $(this.refs.main);
            o_main.addClass("active");
            this.__addDocClick();
            o_main.trigger("module-event-focus");
            $(this.refs.input).focus();

            if (this.props.enableSearch && this.refs.input.value) {
                console.log(this.refs.input.value);
                this.refs.input.value = "";
                this.__search("");
            }

            this.__document_event = function (e) {
                if (e.keyCode == 38) {} else {}
            };
            $(document).on("keydown", this.__document_event);
        },
        close: function close() {
            var o_main = $(this.refs.main);
            o_main.removeClass("active");
            o_main.trigger("module-event-blur");

            $(document).off("keydown", this.__document_event);
        },
        val: function val(value) {
            return this.refs.content.val(value);
        },
        //绑定下拉项数据源
        bindItems: function bindItems(items, issearch) {
            this.refs.content.bindItems(items, issearch);
        },
        getSelectItems: function getSelectItems() {
            return this.state.selItems;
        },
        clear: function clear(v) {
            this.refs.content.clear(v);
        },
        disable: function disable() {
            this.setState({ disabled: true });
            this.objtree.disabled = true;
        },
        enable: function enable() {
            this.setState({ disabled: false });
            this.objtree.disabled = false;
        }
    };

    var Combo = React.createClass({ displayName: "Combo",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            return {
                text: this.props.defaultInfo,
                selectedCount: 0,
                value: this.props.value,
                selItems: new Array(),
                disabled: this.props.disabled
            };
        },
        render: function render() {
            if (this.props.textMode == "tag") {
                return this.__tagDom();
            }
            var self = this;
            var dom = null;
            var opt = $.extend({}, this.props);
            delete opt.field;
            var _text = this.state.text;
            var _class = "module-combo";
            if (this.props.enableSearch) {
                _class += " module-combo-search";
            }
            if (this.state.disabled) {
                _class += " disabled";
            }

            //显示文字模式
            var textdom = null;
            textdom = React.createElement("span", { className: "text-box" }, React.createElement("span", { className: "text-content " + (this.state.selItems.length == 0 ? "placehoder" : ""), title: _text, onClick: this.__onInputClick }, _text), self.props.selectMode != "single" && self.state.selectedCount > 0 ? React.createElement("span", { className: "text-num" }, self.state.selectedCount) : null, self.state.selectedCount > 0 ? React.createElement("span", { className: "text-icon" }, React.createElement("i", { className: "bico bico-close", onClick: self.__onClearClick })) : React.createElement("span", { className: "text-icon" }, React.createElement("i", { className: "bico bico-triangle-down", onClick: self.__onInputClick })));

            dom = React.createElement("div", { className: _class, ref: "main", "data-value": this.state.value, "aria-validate": this.props.validate, "aria-vali-type": this.props.validate ? "module" : "" }, textdom, React.createElement("div", { className: "dropdown-box", style: { width: this.props.width } }, React.createElement("div", { className: "search-box" + (this.props.enableSearch ? "" : " no-search") }, React.createElement("input", { type: "text", onKeyUp: this.__onSearch, ref: "input" })), React.createElement("div", { className: "content-box" + (self.props.heightMode == "auto" ? "mode-noscroll" : ""), style: { maxHeight: this.props.height } }, self.__initChild())));
            return dom;
        },
        componentDidMount: function componentDidMount() {
            this.__initEvent();
            //子组件有异步时.使用initvalue,可能与子组件异步冲突
            // this.__initValue();
        },
        dataChange: function dataChange(field, value, items) {
            this.__changeVal(value, items);
        },
        __initEvent: function __initEvent() {
            var self = this;
            // this.on("single.hide", function (e) {
            //     self.close();
            // });
            self.refs.content.on("item.selected", function (e, value, item) {
                self.trigger("item.selected", value, item);
            });
        },
        //初始值显示text
        __initValue: function __initValue() {
            //初始化值
            var v = this.objtree.data;
            if (v || v === 0) {} else {
                v = this.props.value;
            }
            this.__changeVal(v);
        },
        //获取初始值,默认取objtree.data,如无则取props.value
        __getInitValue: function __getInitValue() {
            //初始化值
            var v = this.objtree.data;
            if (v || v === 0) {} else {
                v = this.props.value;
            }
            return v;
        },
        __showText: function __showText(value, items) {
            var self = this;
            var a_texts = new Array();
            items.map(function (v) {
                a_texts.push(self.props.textFormat(v));
            });
            var _texts = a_texts.join(",");
            _texts = _texts || this.props.defaultInfo;
            this.setState({ text: _texts, selectedCount: items.length, selItems: items, value: value }, function () {
                self.props.onChange(this, value, items);
            });
        },
        __onInputClick: function __onInputClick(e) {
            // console.log(112);
            if (this.objtree.disabled) {
                return;
            }
            this.open();
        },
        __addDocClick: function __addDocClick() {
            var self = this;
            var _fun = function _fun(e) {
                if ($(self.refs.main).has(e.target).length > 0) {
                    return;
                }
                self.__docClick.call(self, _fun);
            };
            $(document).bind('click', _fun);
        },
        __onClearClick: function __onClearClick(o, e) {
            if (this.objtree.disabled) {
                return;
            }
            if (e) {
                this.clear(o);
            } else {
                this.clear();
            }
            // e.preventDefault();
            // e.cancelBubble = true
        },
        //点击文档其他地方隐藏面板
        __docClick: function __docClick(obj) {
            this.close();
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
        __onSearch: function __onSearch(event) {
            var self = this;
            if (!this.props.enableSearch) {
                return;
            }
            var keyword = event.target.value;
            if (this.props.searchTrigger == "enter") {
                if (event.keyCode == 13) {
                    // console.log();
                    this.__search(keyword);
                    // event.target.value = "";
                }
            } else {
                this.__search(keyword);
            }
            // console.log(event.target.value);
        },
        __search: function __search(keyword) {
            var self = this;
            var uuid = self._uuid = self.uuid();
            this.props.onSearch.call(this, { key: keyword, id: this.props.id }, function (items) {
                if (uuid == self._uuid) {
                    // console.log(items);
                    self.bindItems(items, true);
                }
            });
        },
        uuid: function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 0
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        },
        __tagDom: function __tagDom() {
            var self = this;
            var dom = null;
            var opt = $.extend({}, this.props);
            delete opt.field;
            var _text = this.state.text;
            var _class = "module-combo";
            var tagboxclass = "tag-box";
            if (this.props.enableSearch) {
                _class += " module-combo-search";
            }
            if (this.state.disabled) {
                _class += " disabled";
                tagboxclass += " disabled";
            }

            dom = React.createElement("div", { className: _class, ref: "main", "data-value": this.state.value, onClick: this.__onInputClick, "aria-validate": this.props.validate }, React.createElement("div", { className: tagboxclass }, self.state.selItems.length == 0 ? React.createElement("span", { className: "tag-default" }, _text) : null, React.createElement("div", { className: "tag-list" }, self.state.selItems.map(function (v, i) {
                var _t = self.props.textFormat(v);
                var _v = self.props.valueFormat(v);
                return React.createElement("span", { className: "tag-item", key: i }, _t, React.createElement("span", { className: "text-remove" }, React.createElement("i", { className: "bico bico-close", onClick: self.__onClearClick.bind(self, _v) })));
            })), self.state.selectedCount > 0 ? React.createElement("span", { className: "text-num" }, self.state.selectedCount) : null, React.createElement("div", { className: "dropdown-box", style: { width: this.props.width } }, this.props.enableSearch ? React.createElement("div", { className: "search-box" }, React.createElement("input", { type: "text", onKeyUp: this.__onSearch, ref: "input" })) : null, React.createElement("div", { className: "content-box", style: { "maxHeight": this.props.height } }, self.__initChild()))));
            return dom;
        },
        //子组件触发triggerData触发时
        __beforeValueChange: function __beforeValueChange(target, value, items) {
            this.__setValue(value, items);
            if (target.props.wrapper && value !== "") {
                $(target.props.wrapper).attr("data-value", value);
            } else {
                $(target.props.wrapper).removeAttr("data-value");
            }
            return false;
        },
        __onChange: function __onChange(e, value, selitems) {
            var self = this;
            self.__showText(value, selitems);
        },
        __initChild: function __initChild() {
            var self = this;
            var dom = new Array();
            var childopt = $.extend({}, this.props);
            if (childopt.detailFormat) {
                childopt.textFormat = childopt.detailFormat;
            }
            childopt.onChange = this.__onChange;
            childopt.beforeChange = this.__beforeValueChange;
            childopt.onSelect = function () {
                if (self.props.selectMode == "single") {
                    self.close();
                }
            };

            delete childopt.field;
            delete childopt.objtree;
            childopt.value = this.__getInitValue();

            React.Children.forEach(this.props.children, function (v, i) {
                if ((typeof v === "undefined" ? "undefined" : _typeof(v)) == "object" && typeof v.type == "function") {
                    childopt.key = v.key ? v.key : self.objtree.autoKey(i);
                    childopt.ref = "content";
                    var nv = React.cloneElement(v, childopt);
                    dom.push(nv);
                }
            });
            return dom;
        },
        __setValue: function __setValue(value, items) {
            this.triggerData(value, "", items);
        },
        __changeVal: function __changeVal(value, items) {
            this.refs.content.changeVal(value, items);
        }
    });
    Combo.defaultProps = defOpt;

    var UIModule = ReactModule.extend({
        init: function init(options) {
            $(this.attr.wrapper).addClass("form-module");
        },
        ATTRS: defOpt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: Combo
    });
    UIModule.React = Combo;

    return UIModule;
});