/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
"use strict";

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.3.1/react-module", "input/0.4.0/input", "button/0.4.0/button"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("formrow/0.4.0/formrow", ["base/0.3.1/react-module", "input/0.4.0/input", "button/0.4.0/button"], function (require, exports, module) {
            var Module = require("base/0.3.1/react-module");
            var Input = require("input/0.4.0/input");
            var Button = require("button/0.4.0/button");
            return _module(Module, Input, Button);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, Input, Button) {
    //默认配置项
    var defopt = {
        field: "",
        fields: [],
        align: "",
        type: "btnrow"
    };

    var FormRow = React.createClass({ displayName: "FormRow",
        mixins: [ReactModule.reactMethod], // 引用 mixin
        render: function render() {
            var self = this;
            var lbdom = this.props.label ? React.createElement("label", { className: this.props.validate }, this.props.label) : "";
            var rowclass = "row";
            //对齐
            rowclass += this.props.align ? " text-" + this.props.align : "";
            rowclass += this.props.type ? " form-btnrow" : "";

            return React.createElement("div", { className: rowclass }, React.createElement("div", { className: "col-xs-12" }, lbdom, self.renderChild()));
        },
        dataTrigger: function dataTrigger(field, value) {
            // console.log("row:" + field);
        },
        dataChange: function dataChange(field, value) {
            // console.log(this.__childlist);
            // if (field == this.props.field) {
            //     this.setState({ value: value });
            // }
        },
        componentDidMount: function componentDidMount() {
            // console.log("row");
        }

    });

    /*
     * UIModule
     *
     */
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
        ReactModule: FormRow
    });

    UIModule.React = FormRow;
    return UIModule;
});