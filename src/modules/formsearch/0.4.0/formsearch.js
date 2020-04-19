/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "input/0.2.0/input", "button/0.4.0/button", "formrow/0.4.0/formrow", "combobox/0.4.0/combobox", "checkboxgroup/0.4.0/checkboxgroup", "combotree/0.4.0/combotree"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("formsearch/0.4.0/formsearch", ["base/0.4.0/react-module", "input/0.2.0/input", "button/0.4.0/button", "formrow/0.4.0/formrow", "combobox/0.4.0/combobox", "checkboxgroup/0.4.0/checkboxgroup", "combotree/0.4.0/combotree"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var UIInput = require("input/0.2.0/input");
            var UIButton = require("button/0.4.0/button");
            var UIFormRow = require("formrow/0.4.0/formrow");
            var UIComboBox = require("combobox/0.4.0/combobox");
            var UICheckboxGroup = require("checkboxgroup/0.4.0/checkboxgroup");
            var UIComboTree = require("combotree/0.4.0/combotree");
            return _module(ReactModule, UIInput, UIButton, UIFormRow, UIComboBox, UICheckboxGroup, UIComboTree);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, UIInput, UIButton, UIFormRow, UIComboBox, UICheckboxGroup, UIComboTree) {
    var Input = UIInput.React,
        Button = UIButton.React,
        FormRow = UIFormRow.React,
        ComboBox = UIComboBox.React,
        CheckboxGroup = UICheckboxGroup.React,
        ComboTree = UIComboTree.React;
    var defOpt = {
        watch: {}
    };

    var Methods = {
        getData: function getData() {
            return this.state.data;
        },
        // dataTrigger: function (field, value) {
        //     // console.log("form:" + field);
        // },
        // dataChange: function (field, value) {
        //     console.log(field);
        //     this.setState({ data: this.objtree.data });
        //     this.__setDataValue(field, value);
        // },
        getFormData: function getFormData() {
            // console.log("objtree",this.objtree.data);
            return this.objtree.data;
        },
        clearFormData: function clearFormData() {
            this.triggerData({});
        },
        setFormData: function setFormData(data) {
            // this.setState({ data: data });
            this.triggerData(data);
            // console.log(this.props.fields);
            // this.state.data = data;
            // var self = this;
            // this.__childlist.forEach(function (v, i) {
            //
            // });
        },
        checkEmpty: function checkEmpty(obj) {
            //检查对象是否为空,空则false反之true
            if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && !(obj instanceof Array)) {
                var hasProp = false;
                for (var prop in obj) {
                    hasProp = true;
                    break;
                }
                return hasProp;
            }
        },
        initWrapper: function initWrapper() {
            var self = this;
            var dom = new Array();
            if (this.props.fields && this.props.fields.length > 0) {
                var fieldsRow = new Array();
                fieldsRow[0] = new Array();
                var n = 0;
                for (var i = 0, length = self.props.fields.length; i < length; i++) {
                    fieldsRow[n].push(self.props.fields[i]);
                    if (i < length - 1 && fieldsRow[n].length == this.props.columns) {
                        n++;
                        fieldsRow[fieldsRow.length] = new Array();
                    }
                }
                fieldsRow.map(function (row, j) {
                    var rowclass = "row";
                    var renderRow = React.createElement("div", { className: rowclass, key: "row" + j }, row.map(function (v, k) {
                        if (self.checkEmpty(v)) {
                            switch (v.type) {
                                case "text":
                                    ;
                                case "span":
                                    ;
                                case "textarea":
                                    ;
                                case "select":
                                    ;
                                case "upload":
                                    ;
                                case "input":
                                    //input框里增加图标
                                    var icon = "",
                                        iconStyle = {
                                            marginLeft: -15
                                        };
                                    icon = v.option ? v.option.icon ? React.createElement("i", { className: "fa fa-" + v.option.icon, style: iconStyle }) : "" : "";
                                    //如果是预览模式
                                    if (self.props.model == "view") {
                                        v.type = "span";
                                        icon = "";
                                    }
                                    return React.createElement(FormRowMulti, { objtree: self.objtree, validate: v.option ? v.option["aria-validate"] ? "validate" : "" : "", key: "column" + k, label: v.label, col: self.props.columns }, React.createElement(Input, React.__spread({}, v, { type: v.type })), icon);
                                case "radio":
                                    ;
                                case "checkbox":
                                    return React.createElement(FormRowMulti, { objtree: self.objtree, validate: v.option ? v.option["aria-validate"] ? "validate" : "" : "", key: "column" + k, label: v.label, col: self.props.columns }, React.createElement(CheckboxGroup, React.__spread({ type: v.type }, v.option, { ref: v.ref, field: v.field, id: v.id, sel: v.sel })));
                                case "combobox":
                                    return React.createElement(FormRowMulti, { objtree: self.objtree, validate: v.option ? v.option["aria-validate"] ? "validate" : "" : "", key: "column" + k, label: v.label, col: self.props.columns }, React.createElement(ComboBox, React.__spread({}, v.option, { ref: v.ref, field: v.field, id: v.id, sel: v.sel, defaultInfo: v.defaultInfo })));
                                case "combotree":
                                    return React.createElement(FormRowMulti, { objtree: self.objtree, validate: v.option ? v.option["aria-validate"] ? "validate" : "" : "", key: "column" + k, label: v.label, col: self.props.columns }, React.createElement(ComboTree, React.__spread({}, v.option, { ref: v.ref, field: v.field, id: v.id, sel: v.sel, defaultInfo: v.defaultInfo })));
                                case "div":
                                    return React.createElement(FormRowMulti, { objtree: self.objtree, validate: v.option ? v.option["aria-validate"] ? "validate" : "" : "", key: "column" + k, label: v.label, col: self.props.columns }, React.createElement("div", { ref: v.ref, id: v.id, className: v.class }, v.content));
                            }
                        } else {
                            return React.createElement(FormRowMulti, { col: self.props.columns, key: "column" + k }); //当传入空对象时返回一个占位div
                        }
                    }));
                    dom.push(renderRow);
                });
            }
            if (this.props.btns && this.props.btns.length > 0) {
                var row = React.createElement(FormRow, { objtree: self.objtree, key: self.objtree.autoKey(), align: this.props.btnalign, type: "btnrow" }, this.props.btns.map(function (v, i) {
                    v.objtree = self.objtree;
                    v.key = v.key ? v.key : self.objtree.autoKey();
                    var btn = React.createElement(Button, React.__spread({}, v));
                    return btn;
                }));
                dom.push(row);
            }
            return dom;
        }
    };
    // var json = page.react.sels.form.props.instance.getFormData();
    var FormSearch = React.createClass({ displayName: "FormSearch",
        mixins: [ReactModule.reactMethod, Methods], // 引用 mixin
        getDefaultProps: function getDefaultProps() {
            return {
                __isform: true,
                columns: 1,
                btnalign: "center"
            };
        },
        render: function render() {
            var self = this;
            return React.createElement("div", { className: "form form-search" }, self.renderChild(), self.initWrapper());
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            for (var key in this.props.watch) {
                this.watch(key, function () {
                    self.props.watch[key].apply(self, arguments);
                });
            }
        }
    });
    FormSearch.defaultProps = defOpt;
    //生成小列
    var FormRowMulti = React.createClass({ displayName: "FormRowMulti",
        mixins: [ReactModule.reactMethod],
        getDefaultProps: function getDefaultProps() {
            return {
                // width:12
            };
        },
        render: function render() {
            var self = this;
            // console.log(this.props);
            var lbdom = this.props.label ? React.createElement("label", { className: this.props.validate }, this.props.label) : ""; //创建label
            if (this.props.col == 1 || 2 || 3 || 4 || 6) {
                var width = 12 / this.props.col; //留出空位的宽度
                // 处理宽度
                // var colWidth = width < this.props.width ? width : this.props.width;//实际渲染出组件宽度
                var classText = "col-xs-" + width; //"col-xs-" + colWidth
                //处理偏移量
                // if (this.props.offset) {
                //     if (this.props.offset+colWidth<=width) {
                //         classText += " col-xs-offset-" + this.props.offset;
                //     } else {
                //         classText += " col-xs-offset-" + (width - colWidth);
                //     }
                // }
                return React.createElement("div", { className: classText }, lbdom, self.renderChild());
            }
        }
    });
    /*
     * UIModule
     *
     */
    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: {
            title: "标题",
            fields: [],
            data: {}
        },
        METHODS: {
            render: function render() {}
        },
        ReactMethods: Methods,
        ReactModule: FormSearch
    });

    UIModule.React = FormSearch;
    return UIModule;
});