/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "input/0.4.0/input"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("paging/0.4.0/paging", ["base/0.4.0/react-module", "input/0.4.0/input"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var UIInput = require("input/0.4.0/input");
            return _module(ReactModule, UIInput);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, UIInput) {
    var Input = UIInput.React;
    var defOpt = {
        page: 1,
        pagelist: [10, 15, 20],
        pagesize: 10, //默认每页10条
        range: 10, //显示的页码按钮数量，默认为10
        total: 0,
        totalpages: 0, //总页数不填可计算
        skippage: 0, //跳转页码，默认为空
        firstText: "首页",
        lastText: "末页",
        skipLastText: "GO",
        skipFirstText: "跳转到",
        onClick: function onClick(page, pageindex, data) {},
        data: function data(pageindex, pagesize, res, opt) {},
        onChange: function onChange(pageindex, pagesize, res, opt) {},
        firstlast_hide: true,
        prevnext_hide: false,
        page_hide: false,
        pagelist_hide: false,
        pagenum_hide: false,
        url: "",
        initLoad: true,
        initLoadTip: ""
    };
    var Methods = {
        //重新加载数据
        reload: function reload() {
            var self = this;
            self.setState({ loadstatus: true }, function () {
                self.handleChange(1);
            });
        },
        //刷新当前页的数据
        refresh: function refresh() {
            var self = this;
            self.setState({ loadstatus: true }, function () {
                self.handleChange(self.state.page);
            });
        }
    };
    //复选框
    var Paging = React.createClass({ displayName: "Paging",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            var self = this;
            var _opt = self.props;
            return {
                total: _opt.total, //总条目数
                totalpages: _opt.totalpages, //总页数
                page: _opt.page, //当前页码
                pages: new Array(), //页码显示样式的数组
                pagesize: _opt.pagesize, //每页几条
                pagelist: _opt.pagelist, //每页几条数组
                skippage: 0, //跳转页
                range: _opt.range, //页码显示数量
                data: new Array(), //数据
                loadstatus: self.props.initLoad
            };
        },
        __initData: function __initData() {
            var self = this;
            var _opt = self.props;
            if (self.state.loadstatus) {
                if (typeof _opt.data == "function") {
                    _opt.data(_opt.page, _opt.pagesize, function (result) {
                        self.setState({ total: result.total, data: result.data }, function () {
                            self.trigger("data.init", result.data);
                            self.getTotalPages();
                            if (_opt.callback) {
                                _opt.callback(self.state.data, _opt.page, _opt.pagesize);
                            }
                        });
                    });
                } else {
                    self.setState({ total: _opt.data.length, data: _opt.data }, function () {
                        self.getTotalPages();
                        if (_opt.callback) {
                            _opt.callback(self.state.data, _opt.page, _opt.pagesize);
                        }
                    });
                }
            }
        },
        getTotalPages: function getTotalPages() {
            var self = this;
            var t;
            if (self.props.totalpages != 0) {
                t = self.props.totalpages;
                self.setState({ totalpages: t }, function () {
                    self.getPages();
                    self.handleTotalPages(Math.ceil(self.state.total / t));
                });
            } else {
                //数据总条目数
                var total = self.state.total;
                //每页几条
                var pagesize = self.state.pagesize;
                var t = Math.ceil(total / pagesize);
                if (t == 0) {
                    t = 1;
                }
                self.setState({ totalpages: t }, function () {
                    self.getPages();
                });
            }
        },
        handleChange: function handleChange(page) {
            var self = this;
            //page改变，data改变
            if (page == "") {
                page = 1;
            }
            self.setState({ page: page }, function () {
                self.getPages();
                self.__loadData(page, self.state.pagesize);
                self.refs.input.triggerData(page);
            });
        },
        __getData: function __getData(page, pagesize) {
            var self = this;
            var _opt = self.props;
            if (typeof _opt.data == "function") {
                _opt.data(page, pagesize, function (result) {
                    self.setState({ total: result.total, data: result.data }, function () {
                        self.getTotalPages();
                        if (_opt.callback) {
                            _opt.callback(self.state.data, page, pagesize);
                        }
                    });
                });
            } else {
                self.setState({ total: _opt.data.length, data: _opt.data }, function () {
                    self.getTotalPages();
                    if (_opt.callback) {
                        _opt.callback(self.state.data, page, pagesize);
                    }
                });
            }
        },
        __loadData: function __loadData(page, pagesize) {
            var self = this;
            if (self.props.url) {
                // self.__getDataByApi(function (data) {
                //     res();
                //     self.trigger("data.change", data);
                // });
            } else {
                self.__getData(page, pagesize);
            }
        },
        handlePagelist: function handlePagelist(e) {
            var self = this;
            self.setState({ pagesize: e.target.value }, function () {
                /**每页几条改变：
                 * 1. 总页数改变
                 * 2. 当前页数据改变
                 */
                self.getTotalPages();
                self.reload();
            });
        },
        handleTotalPages: function handleTotalPages(pagesize) {
            var self = this;
            var currentList = self.state.pagelist;
            if (currentList.indexOf(pagesize) == -1) {
                currentList.push(pagesize);
                self.reSort(currentList);
            }
            self.setState({ pagelist: currentList, pagesize: pagesize }, function () {
                /**总页数改变
                 * 1. 每页几条改变
                 * 2. 当前页数据改变
                 */
                self.reload();
            });
        },
        reSort: function reSort(array) {
            array.sort(function (a, b) {
                return a - b;
            });
        },
        handleInput: function handleInput(v) {
            var self = this;
            var value = parseInt(v);
            if (v > self.state.totalpages) {
                value = "";
            }
            self.setState({ skippage: value });
        },
        /**计算省略号位置的算法
         * 1. 只有右边有
         * 2. 只有左边有
         * 3. 左边右边都有
         */
        getPages: function getPages() {
            var self = this;
            var range = self.state.range,
                current = parseInt(self.state.page),
                totalpages = self.state.totalpages,
                pages = new Array(),
                first = [1],
                last = [totalpages],
                ellipsis = ["..."];
            /**没有省略号 */
            if (range == totalpages || range > totalpages) {
                for (var i = 0; i < totalpages; i++) {
                    pages.push(i + 1);
                }
            } else {
                var offset = Math.floor(range / 2),
                    /**中心偏移量 */
                        //lmax = current - 1,/**靠当前页左边页码 */
                    rmax = current + 1,
                    /**靠当前页右边页码 */
                    left = new Array(),
                    right = new Array(),
                    middle;
                if (totalpages - self.state.page < offset) {
                    middle = range - (totalpages - self.state.page);
                } else {
                    middle = offset;
                }
                //计算当前页左边显示的页码
                for (var l = 1; l < middle; l++) {
                    if (current > 1) {
                        left.push(current);
                        self.reSort(left);
                        current--;
                    }
                }
                //计算当前页右边的页码
                for (var r = 1; r < range - left.length - 1; r++) {
                    if (rmax < totalpages) {
                        right.push(rmax);
                        rmax++;
                    }
                }
                pages = pages.concat(first, left[0] && left[0] - 1 != 1 ? ellipsis : ["none"], left, right, right[right.length - 1] && right[right.length - 1] + 1 != totalpages ? ellipsis : ["none"], self.state.page != totalpages ? last : ["none"]);
            }
            self.setState({ pages: pages });
        },
        render: function render() {
            var self = this;
            var _opt = self.props;
            /**页码 */
            var pages = React.createElement("ul", { className: "pages" }, self.state.pages.map(function (v, index) {
                var pageClass = "".concat("page ", self.state.page == v ? "active " : "", v == "none" ? "none " : "", v == "..." ? "ellipsis " : "");
                return React.createElement("li", { className: pageClass, key: "page_" + index }, React.createElement("a", { href: "javascript:;", onClick: self.handleChange.bind(self, v) }, v));
            }));
            /*每页几条 */
            var pagelist = React.createElement("select", { className: "pagelist", value: self.state.pagesize, onChange: self.handlePagelist }, _opt.pagelist.map(function (v, index) {
                return React.createElement("option", { key: "pagelist_" + index, value: v }, "每页", v, "条");
            }));
            /**上一页 */
            var prevClass = "".concat(self.state.page == 1 ? "not-allowed " : "");
            var prev = React.createElement("span", { className: "prev" }, React.createElement("a", { href: "javascript:;", className: prevClass, onClick: prevClass == "not-allowed " ? "" : self.handleChange.bind(self, self.state.page - 1) }, React.createElement("i", { className: "bico bico-triangle-left" })));
            /**下一页 */
            var nextClass = "".concat(self.state.page == self.state.totalpages ? "not-allowed " : "");
            var next = React.createElement("span", { className: "next" }, React.createElement("a", { href: "javascript:;", className: nextClass, onClick: nextClass == "not-allowed " ? "" : self.handleChange.bind(self, self.state.page + 1) }, React.createElement("i", { className: "bico bico-triangle-right" })));
            /**跳转 */
            var inputOpt = {
                "data-verify": "num"
            };
            var skip = React.createElement("span", { className: "skip" }, React.createElement("span", { className: "text" }, _opt.skipFirstText), React.createElement(Input, { classname: "input", type: "number", maxLength: self.state.totalpages, ref: "input", onChange: self.handleInput, option: inputOpt }), React.createElement("a", { href: "javascript:;", onClick: self.handleChange.bind(self, self.state.skippage) }, _opt.skipLastText));
            return self.state.loadstatus ? React.createElement("div", { className: "module-pagination" }, _opt.pagelist_hide ? "" : pagelist, _opt.prevNext_hide ? "" : prev, pages, _opt.prevNext_hide ? "" : next, _opt.pagenum_hide ? "" : skip) : React.createElement("div", { className: "module-pagination" }, self.props.initLoadTip);
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            self.__initData();
        }
    });
    Paging.defaultProps = defOpt;
    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: {},
        METHODS: {
            render: function render() {}
        },
        ReactMethods: Methods,
        ReactModule: Paging
    });
    UIModule.React = Paging;
    return UIModule;
});