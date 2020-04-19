/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
"use strict";

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("button/0.4.0/button", ["base/0.4.0/react-module"], function (require, exports, module) {
            var Module = require("base/0.4.0/react-module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule) {
    var defopt = {
        type: "", //
        size: "",
        color: "primary",
        icon: ""
    };

    var Button = React.createClass({ displayName: "Button",
        // getInitialState: function () {
        //     return {
        //         value: this.props.value
        //     };
        // },
        mixins: [ReactModule.reactMethod], // 引用 mixin
        onClick: function onClick(e) {
            // var self = this;
            // var v = this.refs.input.value;
            // if (self.props.onChange) {
            //     self.props.onChange(v);
            // } else {
            //     this.setState({ value: v });
            // }
            this.trigger("click", 1);
            if (this.props.onClick) {
                this.props.onClick(e);
            }
        },
        dataTrigger: function dataTrigger(field, value) {},
        dataChange: function dataChange(field, value) {},
        render: function render() {
            var self = this;
            var dom;
            var opt = $.extend(defopt, this.props);

            var classname = 'btn';
            if (opt.size) {
                classname += ' btn-' + opt.size;
            }

            switch (opt.type) {
                case "submit":
                    opt.color = "primary";
                    opt.icon = "check";
                    break;
                case "cannel":
                    opt.color = "warning";
                    opt.icon = "remove";
                    break;
                default:
                    break;
            }
            //color
            if (opt.color) {
                classname += ' btn-' + opt.color;
            }
            //icon
            var icon = null;
            if (opt.icon) {
                var iconclass = "fa fa-" + opt.icon;
                icon = React.createElement("i", { className: iconclass });
            }

            return React.createElement("button", { type: "button", className: classname, onClick: this.onClick }, icon, this.props.text);
        }
    });
    var UIModule = {};
    UIModule.React = Button;
    return UIModule;
});