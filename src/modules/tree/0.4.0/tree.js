/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("tree/0.4.0/tree", ["base/0.4.0/react-module"], function (require, exports, module) {
            var Module = require("base/0.4.0/react-module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule) {
    var Opt = {
        items: new Array(), //默认内容
        selectMode: "single", //选择模式,单选single|多选multi
        onlySelectLast: false, //只允许选择末节点选中
        textFormat: function textFormat(itemdata) {
            return itemdata["title"];
        },
        valueFormat: function valueFormat(itemdata) {
            return itemdata["innerid"];
        },
        onItemClick: function onItemClick(item, obj) {
            return true;
        },
        requestData: function requestData(item, cb) {//异步请求数据,子树

        },
        state: {
            collapse: true //默认折叠
        },
        onChange: function onChange(value, items) {},
        onSelect: function onSelect() {}
    };
    var Methods = {
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
        },
        val: function val(value) {
            return this.__val(value);
        },
        //值得调整,不触发联动,独立个体使用
        changeVal: function changeVal(value) {
            this.__changeVal(value);
        },
        clear: function clear() {
            return this.__clear.apply(this, arguments);
        },
        clientSearch: function clientSearch() {},
        //刷新当前选中的节点以及父节点
        refreshOpenNode: function refreshOpenNode() {
            if (this.__activenode && this.__activenode.objtree.parent && this.__activenode.objtree.parent.react.refresh) {
                // console.log(this.__activenode.objtree.parent);
                this.__activenode.objtree.parent.react.refresh();
            } else {}
        }
    };

    //树节点
    var TreeNode = React.createClass({ displayName: "TreeNode",
        mixins: [ReactModule.reactMethod],
        getInitialState: function getInitialState() {
            return {
                childs: this.props.childs || new Array(),
                isupdate: this.props.state.isupdate || false, //是否已更新
                isfold: this.props.state.isfold || true, //是否折叠
                collapse: this.props.state.collapse || false,
                checked: this.props.state.checked ? 1 : 0
            };
        },
        render: function render() {
            var childs = null;
            var self = this;
            if (this.state.childs && this.state.childs.length > 0) {
                childs = React.createElement("ul", null, this.state.childs.map(function (v, i) {
                    v.textFormat = self.props.textFormat;
                    v.valueFormat = self.props.valueFormat;
                    v.value = self.props.value;
                    v.state = self.props.state;

                    return React.createElement(TreeNode, React.__spread({}, v, { key: i,
                        onItemClick: self.props.onItemClick,
                        objtree: self.objtree,
                        selectMode: self.props.selectMode,
                        onlySelectLast: self.props.onlySelectLast,
                        onChecked: self.__onChildChecked,
                        requestData: self.props.requestData }));
                }));
            }
            var liclass = "tree-node ",
                iclass = "tree-icon glyphicon";
            if (this.state.childs && this.state.childs.length > 0) liclass += " haschild";
            if (this.state.collapse) {
                liclass += " collapse";
            }

            var aclass = "";
            var _id = this.props.valueFormat(this.props);
            var _text = this.props.textFormat(this.props);
            if (this.props.selectMode == "single" && this.props.value != undefined && $.compare(this.props.value, _id)) {
                aclass = "selected";
                // self.trigger("tree.text.change", this.props.textFormat(this.props));
            }
            var cbdom = null; //复选框
            if (this.props.selectMode == "multi") {
                var _iconclass = "";
                if (this.state.checked === 1) {
                    _iconclass = " bico-checkbox";
                } else if (this.state.checked === 2) {
                    _iconclass = " bico-checkbox-half";
                } else {
                    _iconclass = " bico-checkbox-not";
                }
                cbdom = React.createElement("i", { className: "bico " + _iconclass,
                    onClick: this.__onCheckBoxClick });
            }
            var treeicon = "tree-icon"; //用来展开折叠子节点
            if (this.state.childs.length > 0) {
                treeicon += this.state.collapse ? " tree-icon-close" : " tree-icon-open";
            } else {
                treeicon += " tree-icon-ocl";
            }

            var themeicon = null;
            // themeicon = <i className={"tree-node-icon " + this.props.icon} onClick={self.onItemClick}></i>;

            var dom = React.createElement("li", { className: liclass }, React.createElement("a", { href: "javascript:;", className: aclass, "data-id": _id, "data-text": _text }, React.createElement("span", { className: treeicon, onClick: this.collapse }), cbdom, themeicon, React.createElement("span", { className: "tree-text", onClick: self.onItemClick }, _text)), childs);
            return dom;
        },
        onItemClick: function onItemClick(event) {
            this.check();
            // if (!this.state.isupdate) {
            //     this.refresh();
            // }
            // console.log(this.state.childs);
        },
        onIconClick: function onIconClick(e) {
            this.check();
        },
        __onCheckBoxClick: function __onCheckBoxClick(e) {
            this.check();
        },
        __onChildChecked: function __onChildChecked(e, value, item) {
            // console.log(item);

        },
        refresh: function refresh() {
            //刷新,刷新子项,包括调用接口
            var self = this;
            var res = {};
            //更新数据后自动打开节点
            res.collapse = false;
            res.isupdate = true;
            if (this.props.requestData) {
                this.props.requestData(this.props, function (data) {
                    res.childs = data;
                    self.setState(res);
                });
            }
        },
        collapse: function collapse() {
            this.setState({ collapse: !this.state.collapse });
        },
        //不传参则取反notcb:非checkbox
        check: function check(state, notcb) {
            if (this.props.onlySelectLast && this.state.childs.length > 0) {
                return;
            }

            if (state === undefined) {
                state = this.state.checked === 1 ? 0 : 1;
                // this.props.onChecked && this.props.onChecked(this);
            }
            var self = this;
            this.setState({ checked: state }, function () {
                if (!notcb && this.props.onItemClick) {
                    this.props.onItemClick(this.props, state, this);
                }
            });
            if (!notcb) {
                this.checkChild(state);
            }
        },
        checkChild: function checkChild(state) {
            this.objtree.childs.map(function (v) {
                v.react.check(state);
            });
        },
        setValue: function setValue(values, selItems) {
            var self = this;
            var value = this.props.valueFormat(this.props);

            var state = 0;
            values.map(function (v) {
                if (value == v) {
                    selItems.push(self.props);
                    state = 1;
                }
            });

            // console.log(state);
            //
            var alltrue = true; //全选
            var allfalse = true;
            if (this.objtree.childs.length > 0) {
                this.objtree.childs.forEach(function (v) {
                    var cb = v.react.setValue(values, selItems);
                    if (cb == 1) {
                        allfalse = false;
                    } else {
                        alltrue = false;
                    }
                });

                if (alltrue) {
                    //全选
                    state = 1;
                } else if (allfalse) {
                    //全不选
                    state = 0;
                } else {
                    state = 2;
                }
            }

            this.check(state, true);
            return state;
            // this.props.onChecked && this.props.onChecked(this,value,selItems);
            // this.objtree.parent && this.objtree.parent.react.__onChildChecked
            //     && this.objtree.parent.react.__onChildChecked();
        }
    });

    TreeNode.defaultProps = {
        childs: new Array(),
        icon: "icon-file", //图标
        textFormat: function textFormat(itemdata) {
            return itemdata["title"];
        },
        state: {
            isupdate: false,
            collapse: false
        },
        onItemClick: function onItemClick() {},
        onChecked: function onChecked(e, value, item) {
            //当选中时触发
        }
    };

    var Tree = React.createClass({ displayName: "Tree",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            var items = new Array();
            if (this.props.items && typeof this.props.items != "function") {
                items = this.props.items;
            }
            return {
                items: items,
                value: this.props.value || "",
                values: new Array(),
                selItems: new Array()
            };
        },
        componentWillUpdate: function componentWillUpdate() {
            // return { items: this.props.items, value: this.props.value };
        },
        render: function render() {
            var self = this;
            var dom = React.createElement("div", { className: "module-tree", ref: "wrapper" }, React.createElement("ul", null, this.state.items.map(function (v, i) {
                v.textFormat = self.props.textFormat;
                v.valueFormat = self.props.valueFormat;
                v.value = self.state.value;
                return React.createElement(TreeNode, React.__spread({}, v, { state: self.props.state,
                    onItemClick: self.onItemClick,
                    requestData: self.props.requestData,
                    selectMode: self.props.selectMode,
                    onlySelectLast: self.props.onlySelectLast,
                    key: v.valueFormat(v),
                    objtree: self.objtree }));
            })));
            return dom;
        },
        componentDidMount: function componentDidMount() {
            this.__initItems();
        },
        dataChange: function dataChange(field, value) {
            this.__changeVal(value);
        },
        onItemClick: function onItemClick(item, state, react) {
            var values = this.state.values;
            var value = this.props.valueFormat(item);
            var selItems = this.state.selItems;
            if (this.props.selectMode == "single") {
                values = [value];
                selItems = [item];
            } else {
                if (state) {
                    values.remove(value);
                    values.push(value);
                    selItems.remove(item);
                    selItems.push(item);
                } else {
                    var i = values.remove(value);
                    selItems.removeAt(i);
                }
            };
            this.__setValue(values.join(","));
            this.props.onSelect(value);
            // console.log(values);
            // this.__setValue(values, selItems);
            // this.trigger("tree.item.click", item);
            // this.triggerData(this.props.valueFormat(item));
            // this.__activenode = react;
            // console.log(item);
            // if (this.props.selectMode == "single") {
            //     // console.log(this.props.valueFormat(item));
            //     this.changeVal(this.props.valueFormat(item));
            // }
        },
        __val: function __val(value) {
            var self = this;
            if (value === undefined) {
                return this.state.value;
            } else {
                self.__setValue(value);
                // self.__changeVal(value);
            }
        },
        //格式化值为数组
        __formatValue: function __formatValue(value) {
            if (typeof value == "number") {
                return [value];
            }
            if (value && typeof value == "string") {
                return value.split(",");
            } else if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && Array == value.constructor) {
                return value;
            } else {
                return new Array();
            }
        },
        __setValue: function __setValue(value) {
            if (this.props.beforeChange) {
                if (this.props.beforeChange(this, value)) {
                    this.triggerData(value);
                }
            } else {
                this.triggerData(value);
            }
            // this.__changeVal(values, selItems);
        },
        __changeVal: function __changeVal(value) {
            var self = this;
            var values = this.__formatValue(value);
            var selItems = new Array();
            this.objtree.childs.forEach(function (v) {
                v.react.setValue(values, selItems);
            });

            this.setState({ value: value, values: values, selItems: selItems }, function () {
                //*********第一个参数null暂定,后面调整*********/
                self.props.onChange(null, value, selItems);
            });
            // console.log(this.objtree);
            // var self = this;
            // this.setState({ value: value },
            //     function () {
            //         var _text = $(self.refs.wrapper).find('[data-id="' + value + '"]').attr("data-text");
            //         self.trigger("tree.value.change", value, _text);
            //     });
        },
        __clear: function __clear(v) {
            if (v !== undefined) {
                var values = this.__formatValue(this.state.value);
                values.remove(v);
                this.__setValue(values.join(","));
            } else {
                // var v=
                this.__setValue("");
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
        }
    });
    Tree.defaultProps = Opt;

    var UIModule = ReactModule.extend({
        init: function init(options) {
            $(this.attr.wrapper).addClass("form-module");
        },
        ATTRS: Opt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: Tree
    });

    UIModule.React = Tree;
    return UIModule;
});