

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "css!input/0.4.0/input"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("input/0.4.0/input", ["base/0.4.0/react-module", "input/0.4.0/input.css"], function (require, exports, module) {
            var Module = require("base/0.4.0/react-module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule) {
    var defOpt = {
        type: "",
        "classname": "",
        "value": "",
        placeholder: "",
        formatter: function formatter(data) {
            return data;
        }
    };

    var Methods = {
        val: function val() {
            return this.refs.input.val();
        },
        dataTrigger: function dataTrigger(field, value) {
            //console.log("row:" + field);
            // console.log("input:" + field);
        },
        dataChange: function dataChange(field, value) {
            var self = this;
            if (value === undefined || value === null) value = "";
            this.setState({ value: value }, function () {
                if (self.props.onChange) {
                    self.props.onChange(value);
                }
            });
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

    var Input = React.createClass({ displayName: "Input",
        mixins: [ReactModule.reactMethod, Methods], // 引用 mixin
        getInitialState: function getInitialState() {
            return { value: "", disabled: this.props.disabled };
        },
        onValueChange: function onValueChange(e) {
            if (this.objtree.disabled) {
                return false;
            }
            var self = this;
            // var verify = self.props.option ? self.props.option["data-verify"] : "";
            var v = e.target.value;
            //验证函数
            self.verifyFn(this.props.type, v, function (conf) {
                switch (conf) {
                    case "isNaN":
                        return;
                    default:
                        break;
                }
                if (self.props.type == "number") {
                    v = v.replace(/(\s*$)/g, "");
                }
                self.triggerData(v);
            });
        },
        verifyFn: function verifyFn(conf, v, callback) {
            var self = this;
            if (conf == "number" && isNaN(v)) {
                callback("isNaN");
            } else {
                callback("");
            }
        },
        render: function render() {
            var self = this;
            var _opt = this.props;
            var v = this.state.value;
            if (v === null) {
                v = "";
            }
            var _class = "";
            if (this.state.disabled) {
                _class += " disabled";
            }
            if (this.props.classname) {
                _class += " " + this.props.classname;
            }

            var dom;
            switch (this.props.type) {
                case "span":
                {
                    var _text = _opt.formatter(v);
                    dom = React.createElement("span", { className: "form-control form-text" + " " + (this.props.classname ? this.props.classname : "") }, _text);
                    break;
                }
                case "code":
                {
                    //代码块
                    var _text = _opt.formatter(v);
                    dom = React.createElement("span", { className: "form-control form-text" + " " + (this.props.classname ? this.props.classname : "") }, _text);
                    break;
                }
                //多行文本
                case "textarea":
                {
                    var v = this.state.value;
                    if (v === null) {
                        v = "";
                    }
                    dom = React.createElement("textarea", { value: v, className: _class, "aria-validate": _opt["validate"], rows: "5", cols: "", ref: "input", onChange: self.onValueChange, placeholder: this.props.placeholder, maxLength: this.props.maxLength });
                    break;
                }
                case "datesection":
                {
                    dom = React.createElement("div", { className: _class + " J_range" }, React.createElement("input", { ref: "input", type: "text", name: "start" }), React.createElement("span", null, "至"), React.createElement("input", { ref: "input", type: "text", name: "end" }));
                    break;
                }
                //默认文本框
                default:
                {
                    dom = React.createElement("input", { type: "text", "aria-validate": _opt["validate"],
                        value: v, ref: "input", placeholder: this.props.placeholder,
                        onChange: self.onValueChange, disabled: this.state.disabled, className: _class, maxLength: this.props.maxLength });
                    break;
                }
            }
            return dom;
        },
        componentDidMount: function componentDidMount() {},
        //去重
        strUnique: function strUnique(str) {
            var arr = str.split(','),
                n = new Array();
            for (var i = 0; i < arr.length; i++) {
                //位置
                var index = n.indexOf(arr[i]);
                if (index == -1) {
                    n.push(arr[i]);
                } else {
                    n.splice(index, 1);
                }
            }
            return n.toString();
        }
    });
    Input.defaultProps = defOpt;

    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: defOpt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: Input
    });

    UIModule.React = Input;
    return UIModule;
});