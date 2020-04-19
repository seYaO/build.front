/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "checkbox/0.4.0/checkbox"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("checkboxgroup/0.4.0/checkboxgroup", ["base/0.4.0/react-module", "checkbox/0.4.0/checkbox"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var UICheckbox = require("checkbox/0.4.0/checkbox");
            return _module(ReactModule, UICheckbox);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, UICheckbox) {
    var Checkbox = UICheckbox.React;
    var defOpt = {
        textFormat: function textFormat(itemdata) {
            return itemdata["text"];
        },
        valueFormat: function valueFormat(itemdata) {
            return itemdata["value"];
        },
        value: "", //单选的默认值
        values: new Array(), //多选的默认值
        allBtn: true,
        clearBtn: true,
        invertBtn: true,
        type: "radio",
        id: "" //checkboxgroup的id
        // valueType:"string"
    };

    var Methods = {
        val: function val() {
            // return this.refs.input.val();
        },
        dataTrigger: function dataTrigger(field, value) {
            //console.log("row:" + field);
            // console.log("input:" + field);
        },
        dataChange: function dataChange(field, value) {
            var self = this;
            // console.log(value);
            self.bindItems(self.state.items);
        },
        compareArray: function compareArray(values) {
            var self = this;
            var disableditems = self.state.disableditems; //数组1
            var values = self.state.values.length > 0 ? self.state.values : values || new Array(); //数组2
            var temp = new Array(); //临时数组1
            var temparray = new Array(); //临时数组2
            for (var i = 0; i < disableditems.length; i++) {
                temp[disableditems[i]] = true;
            }
            for (var j = 0; j < values.length; j++) {
                if (!temp[values[j]]) {
                    temparray.push(values[j]);
                }
            }
            return temparray;
        },
        handleClick: function handleClick(type, isHandle, conf) {
            var self = this;
            this.handleType(type, isHandle);
            if (conf == undefined || conf == null) {
                return;
            } else if (conf == "all") {
                self.state.allowActItems.map(function (v, i) {
                    // var val = self.props.valueFormat(v);
                    self.refs["checkbox_" + v].handleClick(type, isHandle);
                });
                if (type == "disabled" && isHandle) {
                    self.refs.allcheck.handleClick("disabled", true);
                } else if (type == "disabled" && !isHandle) {
                    self.refs.allcheck.handleClick("disabled", false);
                }
            } else {
                var checkeditems = self.state.checkeditems,
                    values = self.state.values;
                self.reSort(checkeditems);
                self.reSort(values);
                if (values.length && values.toString() == conf.toString() && self.props.allBtn) {
                    self.state.allowActItems.map(function (v, i) {
                        // var val = self.props.valueFormat(v);
                        self.refs["checkbox_" + v].handleClick(type, isHandle);
                    });
                } else {
                    self.state.items.map(function (v, i) {
                        var val = self.props.valueFormat(v);
                        if (typeof conf === "number") {
                            //增加数字判断
                            conf = conf.toString();
                        }
                        if (!self.__valiValue(conf, val)) {
                            self.refs["checkbox_" + val].handleClick(type, false);
                        } else {
                            self.refs["checkbox_" + val].handleClick(type, isHandle);
                        }
                    });
                }
            }
        },
        //禁用
        disabled: function disabled(conf) {
            var self = this;
            var disableditems = new Array();
            disableditems = conf;
            if (conf == "all") {
                disableditems = conf.split(',');
            }
            self.setState({ disableditems: disableditems }, function () {
                self.__disabled();
            });
        },
        //取消禁用
        enabled: function enabled(conf) {
            if (conf && conf.length) {
                this.handleClick("disabled", false, conf);
            } else {
                this.handleClick("disabled", false, "all");
            }
        },
        checked: function checked(conf) {
            if (conf && conf.length) {
                this.handleClick("checked", true, conf);
            } else {
                this.__checkedAll();
                // this.handleClick("checked", true, "all");
            }
        },
        unchecked: function unchecked(conf) {
            if (conf && conf.length) {
                this.handleClick("checked", false, conf);
            } else {
                this.handleClick("checked", false, "all");
            }
        },
        getData: function getData() {
            return this.objtree.data;
        },
        bindItems: function bindItems(items) {
            var self = this;
            var values = new Array();
            var allowActItems = new Array();
            items.map(function (v, i) {
                var val = self.props.valueFormat(v);
                values.push(val);
                allowActItems = self.compareArray(values);
            });
            self.setState({ values: values, allowActItems: allowActItems });
            var data = self.objtree.data || self.props.values;
            if (self.objtree.data === 0) {
                data = self.objtree.data;
            }
            self.setState({ items: items, checkeditems: data, values: values }, function () {
                self.handleClick("checked", true, data);
                self.__disabled();
            });
        }
    };
    //复选框
    var CheckboxGroup = React.createClass({ displayName: "CheckboxGroup",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            var items = new Array();
            if (this.props.items && typeof this.props.items != "function") {
                items = this.props.items;
            }
            return {
                disabled: this.props.disabled,
                checked: this.props.checked,
                checkeditems: new Array(),
                disableditems: new Array(),
                items: items,
                values: new Array(),
                allowActItems: new Array()
            };
        },
        __disabled: function __disabled() {
            var self = this;
            if (self.state.disableditems) {
                if (self.state.disableditems.toString() == "all") {
                    this.handleClick("disabled", true, "all");
                } else {
                    this.handleClick("disabled", true, self.state.disableditems);
                }
                var allowActItems = self.compareArray();
                self.setState({ allowActItems: allowActItems });
            }
        },
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
        handleType: function handleType(type, isHandle) {
            var self = this;
            switch (type) {
                case "disabled":
                    self.setState({ disabled: isHandle });
                    break;
                case "checked":
                    self.setState({ checked: isHandle });
                    break;
                default:
                    return;
            }
        },
        handleChange: function handleChange(e, checked, value, text, items) {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            this.trigger('item.change', checked, value, text, items);
            if (self.props.type == "checkbox") {
                self.getCheckedItems(checked, value, text, items);
            } else if (self.props.type == "radio") {
                self.getRadioCheckedItems(checked, value, text, items);
            }
        },
        getRadioCheckedItems: function getRadioCheckedItems(checked, value, text, items) {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            self.setState({ checkeditems: value }, function () {
                var _value = self.state.checkeditems;
                self.triggerData(_value, "", items);
            });
        },
        getCheckedItems: function getCheckedItems(checked, value, text) {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            this.state.checkeditems.map(function (v, i) {
                if (checked && !self.__valiValue(self.state.checkeditems, value)) {
                    self.state.checkeditems.push(value);
                    self.setState({ checkeditems: self.state.checkeditems }, function () {
                        var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                        self.triggerData(_value);
                        if (self.props.allBtn) {
                            self.getAllCheckedItems("single");
                        }
                    });
                } else {
                    if (v == value) {
                        self.state.checkeditems.splice(i, 1);
                        self.setState({ checkeditems: self.state.checkeditems }, function () {
                            var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                            self.triggerData(_value);
                            if (self.props.allBtn) {
                                self.getAllCheckedItems("single");
                            }
                        });
                    }
                }
            });
            if (this.state.checkeditems.length == 0 && checked) {
                self.state.checkeditems.push(value);
                self.setState({ checkeditems: self.state.checkeditems }, function () {
                    var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                    self.triggerData(_value);
                    if (self.props.allBtn) {
                        self.getAllCheckedItems("single");
                    }
                });
            }
        },
        getAllCheckedItems: function getAllCheckedItems(type) {
            var self = this;
            if (this.objtree.disabled) {
                return;
            }
            var checkeditems = self.state.checkeditems,
                values = self.state.values;
            self.reSort(checkeditems);
            self.reSort(values);
            if (values.length && values.toString() == checkeditems.toString()) {
                if (type == "single") {
                    self.refs.allcheck.handleClick("checked", true, "all");
                } else {
                    self.getClearAllCheckedItems();
                    self.refs.allcheck.handleClick("checked", false, "all");
                }
            } else {
                if (type == "single") {
                    self.refs.allcheck.handleClick("checked", false, "all");
                } else {
                    self.__checkedAll();
                }
            }
        },
        __checkedAll: function __checkedAll() {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            self.refs.allcheck && self.refs.allcheck.handleClick("checked", true, "all");
            self.state.checkeditems.splice(0);
            this.state.items.map(function (v, i) {
                var val = self.props.valueFormat(v);
                self.state.checkeditems.push(val);
                self.setState({ checkeditems: self.state.checkeditems }, function () {
                    var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                    self.triggerData(_value);
                });
            });
        },
        getClearAllCheckedItems: function getClearAllCheckedItems() {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            self.state.checkeditems.splice(0);
            self.refs.allcheck.handleClick("checked", false, "all");
            self.setState({ checkeditems: self.state.checkeditems }, function () {
                var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                self.triggerData(_value);
            });
        },
        getInvertAllCheckedItems: function getInvertAllCheckedItems() {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            var arr = new Array();
            self.refs.allcheck.handleClick("checked", false, "all");
            self.state.items.map(function (v, i) {
                var val = self.props.valueFormat(v);
                if (!self.__valiValue(self.state.checkeditems, val)) {
                    arr.push(val);
                    self.setState({ checkeditems: arr }, function () {
                        var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                        self.triggerData(_value);
                    });
                } else {
                    self.setState({ checkeditems: arr }, function () {
                        var _value = this.props.valueType == "string" ? self.state.checkeditems.join(",") : self.state.checkeditems;
                        self.triggerData(_value);
                    });
                }
            });
        },
        //验证值是否在值列表中
        __valiValue: function __valiValue(values, value) {
            var _values = new Array();
            if (values && (typeof values === "undefined" ? "undefined" : _typeof(values)) === 'object' && Array == values.constructor) {
                _values = values;
            }
            if (typeof values === 'string') {
                _values = values.split(",");
            }
            var invalue = false;
            _values.forEach(function (v) {
                if ($.compare(v, value)) {
                    invalue = true;
                }
            });
            return invalue;
        },
        __formatValue: function __formatValue(value) {
            if (value && typeof value == "string") {
                return value.split(",");
            } else if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && Array == value.constructor) {
                return value;
            } else {
                return new Array();
            }
        },
        reSort: function reSort(array) {
            if (typeof array === "number") {
                array = array.toString();
            }
            if (typeof array != "string") {
                array.sort(function (a, b) {
                    return a - b;
                });
            }
        },
        render: function render() {
            var self = this;
            var _opt = self.props;
            var dom = new Array();
            self.state.items.map(function (v, i) {
                v.type = _opt.type;
                v.checked = _opt.checked;
                v.disabled = _opt.disabled;
                v.textFormat = _opt.textFormat;
                v.valueFormat = _opt.valueFormat;
                v.field = _opt.field;
                var style = {
                    width: _opt.width
                };
                dom.push(React.createElement(Checkbox, React.__spread({}, v, { style: style, onChange: self.handleChange, ref: "checkbox_" + _opt.valueFormat(v), key: "checkbox" + i })));
            });
            var all = _opt.allBtn ? React.createElement(Checkbox, { text: "全选", type: "checkbox", ref: "allcheck", onChange: this.getAllCheckedItems }) : "";
            var clear = _opt.clearBtn ? React.createElement("a", { onClick: self.getClearAllCheckedItems }, "清除") : "";
            var invert = _opt.invertBtn ? React.createElement("a", { onClick: self.getInvertAllCheckedItems }, "反选") : "";
            var ulstyle;
            if (!_opt.allBtn && !_opt.clearBtn && !_opt.invertBtn) {
                ulstyle = {
                    display: "none"
                };
            }
            var btndom = _opt.type == "checkbox" ? React.createElement("ul", { style: ulstyle }, React.createElement("li", null, all), React.createElement("li", null, invert), React.createElement("li", null, clear)) : "";
            return React.createElement("div", { className: "_checkboxgroup" }, btndom, React.createElement("div", { className: "check_group" }, dom));
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            this.__initItems();
            // this.setState({ checkeditems: self.__formatValue(self.objtree.data) });
        }
    });
    CheckboxGroup.defaultProps = defOpt;
    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: {},
        METHODS: {
            render: function render() {}
        },
        ReactMethods: Methods,
        ReactModule: CheckboxGroup
    });

    UIModule.React = CheckboxGroup;
    return UIModule;
});