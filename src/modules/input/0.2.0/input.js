/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.3.1/react-module", "datepicker/0.3.1/datepicker", "uplodify/0.1.0/h5upload"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("input/0.2.0/input", ["base/0.3.1/react-module", "datepicker/0.3.1/datepicker", "uplodify/0.1.0/h5upload"], function (require, exports, module) {
            var ReactModule = require("base/0.3.1/react-module");
            var Datepicker = require("datepicker/0.3.1/datepicker");
            var Uploader = require("uplodify/0.1.0/h5upload")
            return _module(ReactModule, Datepicker, Uploader);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, Datepicker, Uploader) {
    var Opt = {
        "classname": "",
        "option": {
            "formatter": function formatter(data) {
                return data;
            }
        }
    };

    var Methods = {
        dataTrigger: function dataTrigger(field, value) {
            //console.log("row:" + field);
            // console.log("input:" + field);
        },
        dataChange: function dataChange(field, value) {
            var self = this;
            if (value === undefined || value === null) value = "";
            this.setState({ data: value }, function () {
                if (self.props.type == "select") {
                    $(self.refs.input).trigger("chosen:updated.chosen");
                }
            });
        }
    };

    //单选框
    var Radio = React.createClass({ displayName: "Radio",
        onChange: function onChange(e) {
            this.props.onChange(e, e.target.value);
        },
        render: function render() {
            var self = this;
            var _opt = this.props;
            var dom = React.createElement("div", { className: "radio", ref: "input" }, _opt.items.map(function (v, i) {
                var dom = React.createElement("label", { key: "radio" + i, className: self.props.value == v ? "checked" : "" }, React.createElement("input", { type: "radio", value: v, onChange: self.onChange }), v);
                return dom;
            }));
            return dom;
        },
        componentDidMount: function componentDidMount() {
            var v = this.props.value;
        }
    });
    //复选框
    var Checkbox = React.createClass({ displayName: "Checkbox",
        onChange: function onChange(e) {
            var self = this;
            self.props.onChange(e, e.target.value);
        },
        render: function render() {
            var self = this;
            var _opt = this.props;
            var dom = React.createElement("div", { className: "checkbox" }, _opt.items.map(function (v, i) {
                var dom = React.createElement("label", { key: "checkbox" + i, className: self.props.value.indexOf(v) == -1 ? "" : "checked" }, React.createElement("input", { type: "checkbox", value: v, onChange: self.onChange }), v);
                return dom;
            }));
            return dom;
        }
    });

    var Input = React.createClass({ displayName: "Input",
        mixins: [ReactModule.reactMethod, Methods], // 引用 mixin
        onValueChange: function onValueChange(e, v) {
            var self = this;
            var verify = self.props.option ? self.props.option["data-verify"] : "";
            switch (this.props.type) {
                case "checkbox":
                    v = v == undefined ? this.refs.input.value : v;
                    v = self.state.data ? self.strUnique(self.state.data.concat(',' + v)) : v;
                    break;
                default:
                    v = v == undefined ? this.refs.input.value : v;
                    break;
            }
            //验证函数
            self.verifyFn(verify, v, function (conf) {
                switch (conf) {
                    case "isNaN":
                        return;
                    default:
                        break;
                }
                if (verify == "num") {
                    v = v.replace(/(\s*$)/g, "");
                }
                self.triggerData(v);
            });
        },
        verifyFn: function verifyFn(conf, v, callback) {
            var self = this;
            if (conf == "num" && isNaN(v)) {
                callback("isNaN");
            } else {
                callback("");
            }
        },
        render: function render() {
            var self = this;
            var _opt = $.extend({}, Opt.option, this.props.option);
            var v = this.state.data;
            if (v === null) {
                v = "";
            }
            var dom;
            switch (this.props.type) {
                //下拉选择
                case "select":
                {
                    var selectStyle = _opt.icon ? { appearance: 'none', MozAppearance: 'none', WebkitAppearance: 'none' } : {};
                    dom = React.createElement("select", { value: v, ref: "input", style: selectStyle, className: this.props.classname, onChange: self.onValueChange }, _opt.items.map(function (v) {
                        var _v = (typeof v === "undefined" ? "undefined" : _typeof(v)) == "object" ? v.value : v;
                        var _t = (typeof v === "undefined" ? "undefined" : _typeof(v)) == "object" ? v.text : v;
                        return React.createElement("option", { value: _v, key: _v }, _t);
                    }));
                    break;
                }
                case "span":
                {
                    var _text = _opt.formatter(this.state.data);
                    dom = React.createElement("span", { className: "form-control form-text" + " " + (this.props.classname ? this.props.classname : "") }, _text);
                    break;
                }
                case "code":
                {
                    //代码块
                    var _text = _opt.formatter(this.state.data);
                    dom = React.createElement("span", { className: "form-control form-text" + " " + (this.props.classname ? this.props.classname : "") }, _text);
                    break;
                }
                //多行文本
                case "textarea":
                {
                    var v = this.state.data;
                    if (v === null) {
                        v = "";
                    }
                    dom = React.createElement("textarea", { value: v, className: this.props.classname, placeholder: this.props.placeholder, rows: "5", cols: "", ref: "input", onChange: self.onValueChange });
                    break;
                }
                case "datesection":
                {
                    dom = React.createElement("div", { className: "J_range" }, React.createElement("input", { ref: "input", type: "text", name: "start" }), React.createElement("span", null, "至"), React.createElement("input", { ref: "input", type: "text", name: "end" }));
                    break;
                }
                //单选框
                case "radio":
                {
                    dom = React.createElement(Radio, React.__spread({}, _opt, { ref: "input", value: v, onChange: self.onValueChange }));
                    break;
                }
                //复选框
                case "checkbox":
                {
                    dom = React.createElement(Checkbox, React.__spread({}, _opt, { ref: "input", value: v, onChange: self.onValueChange }));
                    break;
                }
                //上传附件
                case "upload":
                {
                    dom = React.createElement("button", { type: "button", className: "btn btn-primary", ref: "upload" }, React.createElement("i", { className: "fa fa-upload" }), "附件");
                    break;
                }
                //默认文本框
                default:
                {
                    dom = React.createElement("input", { type: "text", "aria-validate": _opt["aria-validate"], value: v, ref: "input", onChange: self.onValueChange, className: this.props.classname });
                    break;
                }
            }
            return dom;
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            var opt = this.props.option || {};
            switch (this.props.type) {
                case "select":
                {
                    var self = this;
                    self.triggerData(self.refs.input.value);
                    break;
                }
                //日期选择
                case "date":
                {
                    opt.el = this.refs.input;
                    var dp = new Datepicker(opt);
                    dp.on("change", function () {
                        self.onValueChange();
                    });
                    break;
                }
                case "datesection":
                {
                    opt.el = '.J_range';
                    opt.dateRange = true;
                    opt.todayBtn = 'linked';
                    var dp = new Datepicker(opt);
                    dp.on("change", function () {
                        self.onValueChange();
                    });
                    break;
                }
                //上传附件
                case "upload":
                {
                    var uploader = new Uploader({
                        trigger: this.refs.upload,
                        action: opt.action,
                        multiple: opt.multiple,
                        filter: opt.filter, //支持文件格式 "image/gif,image/jpg"
                        maxSize: opt.maxSize
                    });
                    uploader.on("success", function (e, response) {
                        console.log(response);
                        self.triggerData(response);
                    });
                    uploader.on("error", function (e, file) {
                        console.log(file);
                    });
                }
                default:
                {
                    break;
                }
            }
        },
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
    var UIModule = ReactModule.extend({
        initialize: function initialize(options) {
            //init super
            UIModule.superclass.initialize.apply(this, arguments);
            //init
            UIModule.prototype.init.apply(this, arguments);
        },
        init: function init(options) {},
        ATTRS: {},
        METHODS: {
            render: function render() {}
        },
        ReactModule: Input
    });

    UIModule.React = Input;
    return UIModule;
});