/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
"use strict";

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "combo/0.4.0/combo", "tree/0.4.0/tree"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("combotree/0.4.0/combotree", ["base/0.4.0/react-module", "combo/0.4.0/combo", "tree/0.4.0/tree"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var UICombo = require("combo/0.4.0/combo");
            var UITree = require("tree/0.4.0/tree");
            return _module(ReactModule, UICombo, UITree);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, UICombo, UITree) {
    var Tree = UITree.React;
    var Combo = UICombo.React;
    var defOpt = {
        height: "300px",
        items: new Array(), //默认内容
        selectMode: "single", //选择模式,单选single or  多选multi
        //显示内容格式化
        textFormat: function textFormat(itemdata) {
            return itemdata["text"];
        },
        //明细显示内容格式化,无为空默认使用textFormat
        detailFormat: null,
        //值格式化
        valueFormat: function valueFormat(itemdata) {
            return itemdata["id"];
        },
        onItemClick: function onItemClick(item, obj) {
            return true;
        },
        requestData: function requestData(item, cb) {},
        value: null

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
        getSelectItems: function getSelectItems() {
            return this.refs.main.getSelectItems();
        },
        clear: function clear(params) {
            this.refs.main.clear();
        }
    };

    var ComboTree = React.createClass({ displayName: "ComboTree",
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

            return React.createElement(Combo, React.__spread({ ref: "main" }, opt, { objtree: this.objtree }), React.createElement(Tree, null));
        }
    });
    ComboTree.defaultProps = defOpt;

    var UIModule = ReactModule.extend({
        init: function init(options) {
            $(this.attr.wrapper).addClass("form-module");
        },
        ATTRS: defOpt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: ComboTree
    });

    UIModule.React = ComboTree;
    return UIModule;
});