"use strict";

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("checkbox/0.4.0/checkbox", ["base/0.4.0/react-module"], function (require, exports, module) {
            var Module = require("base/0.4.0/react-module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule) {
    var defOpt = {
        type: "radio",
        block: false,
        disabled: false,
        checked: false,
        className: "",
        text: "",
        value: "",
        textFormat: function textFormat(itemdata) {
            return itemdata["text"];
        },
        valueFormat: function valueFormat(itemdata) {
            return itemdata["value"];
        }
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
            this.setState({ checked: self.state.status }, function () {
                if (self.props.onChange) {
                    self.props.onChange(checked, self.props.valueFormat(self.props), self.props.textFormat(self.props));
                }
            });
        },
        handleClick: function handleClick(type, isHandle) {
            this.handleType(type, isHandle);
        },
        //禁用
        disabled: function disabled() {
            this.handleClick("disabled", true);
        },
        //取消禁用
        enabled: function enabled() {
            this.handleClick("disabled", false);
        },
        //全选
        checked: function checked() {
            this.handleClick("checked", true);
        },
        unchecked: function unchecked() {
            this.handleClick("checked", false);
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
        getData: function getData() {
            var data = {
                text: this.props.textFormat(this.props),
                value: this.props.valueFormat(this.props)
            };
            if (this.state.checked) {
                return data;
            } else {
                return null;
            }
        }
    };
    //复选框
    var Checkbox = React.createClass({ displayName: "Checkbox",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            return {
                checked: this.props.checked,
                disabled: this.props.disabled,
                status: this.props.checked
            };
        },
        handleChange: function handleChange(e) {
            var self = this;
            if (this.props.onChange) {
                if (self.props.type == "checkbox") {
                    this.props.onChange(e, !this.state.checked, this.props.valueFormat(this.props), this.props.textFormat(this.props), this.props);
                } else if (self.props.type == "radio") {
                    this.props.onChange(e, true, this.props.valueFormat(this.props), this.props.textFormat(this.props), this.props);
                }
            } else {
                if (self.props.type == "checkbox") {
                    this.changeVal(!this.state.checked);
                    this.trigger('item.change', !this.state.checked, this.props.valueFormat(this.props), this.props.textFormat(this.props));
                } else if (self.props.type == "radio") {
                    this.changeVal(true);
                    this.trigger('item.change', true, this.props.valueFormat(this.props), this.props.textFormat(this.props));
                }
            }
        },
        changeVal: function changeVal(checked) {
            if (this.objtree.disabled) {
                return;
            }
            var self = this;
            this.setState({ status: checked }, function () {
                self.triggerData(checked ? self.props.valueFormat(self.props) : "");
            });
        },
        render: function render() {
            var self = this;

            var _opt = self.props;

            var _text = _opt.textFormat(self.props),
                _value = _opt.valueFormat(self.props);

            var labelClass = "".concat("_" + _opt.type + " ", this.state.checked ? "checked " : "", _opt.block ? "block" : "inline ", _opt.className);

            var spanClass = "".concat("indicator ", self.state.disabled ? "disabled " : "", "indicator-" + _opt.type + " ");

            var dom = React.createElement("label", { className: labelClass, style: _opt.style }, React.createElement("input", { type: _opt.type,
                value: _value,
                onChange: self.handleChange,
                disabled: self.state.disabled }), React.createElement("span", { className: spanClass }), React.createElement("span", { className: true }, _text));
            return dom;
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            if (this.objtree.data == this.props.valueFormat(this.props)) {
                self.changeVal(true);
            }
        }
    });
    Checkbox.defaultProps = defOpt;
    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: {},
        METHODS: {
            render: function render() {}
        },
        ReactMethods: Methods,
        ReactModule: Checkbox
    });

    UIModule.React = Checkbox;
    return UIModule;
});