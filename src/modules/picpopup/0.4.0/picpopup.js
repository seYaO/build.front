/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module", "popup/0.3.2/popup", "formsearch/0.4.0/formsearch", "paging/0.4.0/paging", "uplodify/0.3.1/h5upload"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("picpopup/0.4.0/picpopup", ["base/0.4.0/react-module", "popup/0.3.2/popup", "formsearch/0.4.0/formsearch", "paging/0.4.0/paging", "uplodify/0.3.1/h5upload"], function (require, exports, module) {
            var ReactModule = require("base/0.4.0/react-module");
            var Popup = require("popup/0.3.2/popup");
            var UIFormsSearch = require("formsearch/0.4.0/formsearch");
            var UIPaging = require("paging/0.4.0/paging");
            var Uploader = require("uplodify/0.3.1/h5upload");
            return _module(ReactModule, Popup, UIFormsSearch, UIPaging, Uploader);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule, Popup, UIFormsSearch, UIPaging, Uploader) {
    var FormSearch = UIFormsSearch.React;
    var Paging = UIPaging.React;
    var defOpt = {
        picSource: [], //初始化数据
        columns: "",
        fields: [], //查询表单配置
        popup: {}, //弹出框配置
        upload: {}, //上传配置
        paging: {}, //分页配置
        defaultImgUrl: "", //初始化显示图片
        changeImgBtnText: "选择图片",
        pagination: true,
        initLoad: true, //默认为true,false时初始化组件不自动获取数据
        emptyText: "数据为空", //数据为空时提示文案
        selectMode: "single", //single单选，multi多选
        previewImg: true, //是否能预览图片
        checkImgBtn: true, //是否显示查看图片按钮
        importBtn: false, //是否显示导出按钮
        showPanelHeading: true, //是否显示全选和已选择
        uploadBtn: false, //是否显示上传按钮
        showUploadImg: false, //是否显示刚上传文件
        showRadio: true, //多选时显示单选按钮
        searchField: {},
        bigImgpop: false,//是否点击可查看大图
        dataFormat: function dataFormat(data) {
            //绑定数据格式化
            return data;
        },
        formatter: function formatter(data) {
            //上传成功返回数据格式化
            return data;
        }
    };
    var Methods = {};
    var PicItem = React.createClass({ displayName: "PicItem",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            var isCheck = "";
            if ($.inArray(this.props.singleData.Id, this.props.picValue) > -1) {
                isCheck = "isCheck";
            }
            return { singleSource: this.props.singleData, isCheck: isCheck };
        },
        __singleCheck: function __singleCheck() {
            var self = this;
            if (self.state.isCheck) {
                self.setState({ isCheck: "" });
            } else {
                self.setState({ isCheck: "isCheck" });
            }
            this.props.onItemSelect(self.state.isCheck, self.state.singleSource);
            this.props.onValueSelect(self.state.isCheck, self.state.singleSource.Id);
        },
        __isCheck: function __isCheck(state) {
            var self = this;
            if (!state) {
                self.setState({ isCheck: "" });
            } else {
                self.setState({ isCheck: "isCheck" });
            }
        },
        render: function render() {
            var self = this;
            return React.createElement("div", { className: "picbox-item " }, React.createElement("div", { className: "picbox-item-in", onClick: self.__singleCheck }, React.createElement("div", { className: "img-box" }, React.createElement("img", { src: self.state.singleSource.Url }), React.createElement("i", { className: self.state.isCheck == "isCheck" ? "checked" : "checked none" })), React.createElement("span", { className: "describe" }, React.createElement("span", null, self.state.singleSource.Name))));
        }
    });
    var PicBox = React.createClass({ displayName: "PicBox",
        mixins: [ReactModule.reactMethod, Methods],
        getInitialState: function getInitialState() {
            return { picSource: this.props.picData, isCheck: "", isShow: false, picValue: [], picItem: [], defaultValue: [], defaultItem: [], allCheck: false, firstLoad: true, initLoad: this.props.initLoad };
        },
        bindData: function bindData(data) {
            this.setState({ picSource: data });
        },
        __allCheck: function __allCheck(flag) {
            var self = this;
            var state = flag ? false : !this.state.allCheck;
            self.state.picSource && self.state.picSource.map(function (item, i) {
                self.refs["picitem" + item.Id].__isCheck(state);
            });
            if (state) {
                var picValue = [];
                self.state.picSource.map(function (v) {
                    picValue.push(v.Id);
                });
                var picSource = self.state.picSource.copy();
                this.setState({ allCheck: state, picValue: picValue, picItem: picSource });
            } else {
                this.setState({ allCheck: state, picValue: [], picItem: [] });
            }
        },
        __isShow: function __isShow() {
            var self = this;
            var picSource = self.state.picSource;
            if (self.state.isShow) {
                if (self.picList) {
                    self.picList.map(function (v) {
                        picSource = picSource.filter(function (value) {
                            if (value.Id != v.Id) {
                                return value;
                            }
                        });
                        picSource.remove(v);
                    });
                }
                self.setState({ isShow: false, picSource: picSource });
            } else {
                if (self.picList) {
                    self.picList.map(function (v) {
                        picSource.push(v);
                    });
                }
                self.setState({ isShow: true, picSource: picSource });
            }
        },
        onItemSelect: function onItemSelect(state, item) {
            var self = this;
            var selectItem = this.state.picItem;
            if (state == "isCheck") {
                self.remove(item, selectItem);
            } else {
                selectItem.push(item);
            }
            self.setState({ picItem: selectItem, allCheck: selectItem.length == this.state.picSource.length });
            return selectItem;
        },
        onValueSelect: function onValueSelect(state, value) {
            var self = this;
            var selectValue = this.state.picValue;
            if (state == "isCheck") {
                self.remove(value, selectValue);
            } else {
                selectValue.push(value);
            }
            self.setState({ picValue: selectValue });
            return selectValue;
        },
        initList: function initList() {
            var self = this;
            if (!self.state.firstLoad && self.props.pagination) {
                if (self.state.picSource.length == 0) {
                    return React.createElement("p", { style: { marginLeft: "11px" } }, self.props.emptyText);
                } else {
                    var dom = [];
                    self.state.picSource && self.state.picSource.map(function (item, i) {
                        var list = React.createElement(PicItem, { singleData: item, picValue: self.state.picValue, ref: "picitem" + item.Id, key: item.Id, onItemSelect: self.onItemSelect, onValueSelect: self.onValueSelect });
                        dom.push(list);
                    });
                    return React.createElement("div", { className: "imgbox box-list" }, dom);
                }
            } else {
                var dom = [];
                self.state.picSource && self.state.picSource.map(function (item, i) {
                    var list = React.createElement(PicItem, { singleData: item, picValue: self.state.picValue, ref: "picitem" + item.Id, key: item.Id, onItemSelect: self.onItemSelect, onValueSelect: self.onValueSelect });
                    dom.push(list);
                });
                return React.createElement("div", { className: "imgbox box-list" }, dom);
            }
        },
        getInitData: function getInitData() {
            var self = this;
            self.refs.page.on("data.init", function (e, data) {
                var picSource = [];
                data.map(function (v) {
                    var item = self.props.dataFormat(v);
                    picSource.push(item);
                });
                self.setState({ picSource: picSource, picValue: [], picItem: [], firstLoad: false });
            });
        },
        remove: function remove(value, array) {
            var self = this;
            var varElement = value;
            for (var i = array.length - 1; i >= 0; i--) {
                // 严格比较，即类型与数值必须同时相等。
                if (array[i].Id == varElement.Id && array[i].Url == varElement.Url) {
                    array.splice(i, 1);
                }
            }
        },
        render: function render() {
            var self = this;
            var pagingDom = null;
            if (self.state.initLoad) {
                var paging = {
                    callback: function callback(data, pagesize, page) {
                        var picSource = [];
                        data.map(function (v) {
                            var item = self.props.dataFormat(v);
                            picSource.push(item);
                        });
                        var picValue = self.state.picValue;
                        var picItem = self.state.picItem;
                        self.setState({ picSource: picSource, picValue: picValue, picItem: picItem });
                        //此处可绑定数据
                    }
                };
                $.extend(paging, self.props.paging);
                pagingDom = React.createElement(Paging, React.__spread({ ref: "page" }, paging));
            }
            if (self.props.showUploadImg) {
                var dom = React.createElement("span", { className: "checkbox" }, React.createElement("label", { className: this.state.isShow ? "checked" : "", onClick: self.__isShow }, "不显示接口上传图片"));
            }
            if (self.props.showPanelHeading) {
                var panelheading = React.createElement("div", { className: "panel-heading" }, React.createElement("span", { className: "alreadyCheck" }, "已选中", React.createElement("span", null, self.state.picItem.length), "个"), dom, React.createElement("span", { className: "checkbox" }, React.createElement("label", { className: this.state.allCheck ? "checked" : "", onClick: self.__allCheck.bind(self, false) }, "本页全选")));
            }
            return React.createElement("div", { className: "module-listbox " }, React.createElement("div", { className: "panel panel-box" }, panelheading, React.createElement("div", { className: "panel-body" }, self.initList(), pagingDom)));
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            if (self.state.initLoad) {
                self.getInitData();
            }
        }
    });
    var Radio = React.createClass({ displayName: "Radio",
        getInitialState: function getInitialState() {
            return { checked: false };
        },
        handleChange: function handleChange(event) {
            this.setState({ checked: event.target.checked });
            this.props.changeValue(event.target.value);
        },
        render: function render() {
            var self = this;
            return React.createElement("div", { className: "radio-content" }, React.createElement("input", { type: "radio", onChange: self.handleChange, ref: "value" + self.props.value, id: self.props.id, name: self.props.name, value: self.props.value, className: "regular-radio" }), React.createElement("label", { htmlFor: self.props.id }), React.createElement("label", { htmlFor: self.props.id, className: "label-content" }, "设为主图"));
        }
    });
    var Imgbox = React.createClass({ displayName: "Imgbox",
        mixins: [ReactModule.reactMethod],
        getInitialState: function getInitialState() {
            return { imgUrl: this.props.defaultImgUrl, show: false, showImgUrl: "", radioValue: "" };
        },
        checkBigImg: function checkBigImg(v) {
            if(this.props.bigImgpop){
                this.setState({ show: true, showImgUrl: v });
            }
        },
        closePanel: function closePanel() {
            this.setState({ show: false });
        },
        itemClick: function itemClick(v) {
            this.trigger("item.click", v);
        },
        initwrapper: function initwrapper(v) {
            var self = this;
            var imgbox = React.createElement("div", { className: v ? "smallimg-box no-border" : "smallimg-box", key: v }, React.createElement("img", { src: v, className: v ? "smallImg" : "smallImg none", onClick: self.itemClick.bind(self, v) }));
            return imgbox;
        },
        changeValue: function changeValue(v) {
            this.setState({ radioValue: v });
        },
        delImg: function delImg(index, id, event) {
            event.stopPropagation();
            this.props.delImg(index, id);
        },
        initMulti: function initMulti(v, i) {
            var self = this;
            var radio = null;
            //v = self.props.dataFormat(v);
            if (self.props.showRadio) {
                var _React$createElement;

                radio = React.createElement(Radio, (_React$createElement = { key: self.autoKey, name: "radio", value: v.Id, id: "radio" + v.Id }, _defineProperty(_React$createElement, "value", v.Id), _defineProperty(_React$createElement, "ref", "radio" + v.Id), _defineProperty(_React$createElement, "changeValue", self.changeValue), _React$createElement));
            }
            var imgbox = React.createElement("div", { className: v.Url ? "smallImg-wrap" : "smallImg-wrap", key: v.Id },
                React.createElement("div", { className: "clearfix img-content", onClick: self.checkBigImg.bind(self, v.Url) },
                    React.createElement("span", { className: "close-btn", onClick: self.delImg.bind(self, i, v.Id) },
                        React.createElement("i", { className: "bico bico-close" })),
                    React.createElement("div", { className: "imgWrap-left" },
                        React.createElement("img", { src: v.Url, className: v.Url ? "smallImg" : "smallImg none", onClick: self.itemClick.bind(self, v), "data-id": v.Id })),
                    React.createElement("div", { className: "imgWrap-right" },
                        React.createElement("span", { className: "img-name", title: v.Name }, v.Name))), radio);
            return imgbox;
        },
        render: function render() {
            var self = this;
            var dom = [];
            if (self.props.selectMode == "single") {
                dom.push(self.initwrapper(self.state.imgUrl));
            } else {
                if (typeof self.state.imgUrl != "string") {
                    self.state.imgUrl && self.state.imgUrl.map(function (v, i) {
                        dom.push(self.initMulti(v, i));
                    });
                }
            }
            return React.createElement("div", { className: "imgbox clearfix" }, dom, React.createElement("div", { className: self.state.show ? "module-popup-mask fade in" : "module-popup-mask fade none", onClick: self.closePanel }), React.createElement("div", { className: self.state.show ? "module-panel" : "module-panel none" }, React.createElement("span", { className: "close-btn", onClick: self.closePanel }, React.createElement("i", { className: "bico bico-close" })), React.createElement("img", { src: self.state.showImgUrl, className: "bigImg" })));
        }
    });
    var picPopup = React.createClass({ displayName: "picPopup",
        mixins: [ReactModule.reactMethod],
        changeImg: function changeImg() {
            this.show(this.props.popup);
            this.trigger("img.change");
        },
        checkImg: function checkImg() {
            if (this.refs.selectPic.state.imgUrl) {
                this.refs.selectPic.checkBigImg(this.refs.selectPic.state.imgUrl);
            }
        },
        delImg: function delImg(index, id) {
            var self = this;
            var item = this.refs["picBox"].state.picItem;
            var value = this.refs["picBox"].state.picValue;
            item.removeAt(index);
            value.removeAt(index);
            self.refs.selectPic.setState({ imgUrl: item });
            self.refs["picBox"].setState({ picItem: item,picValue: value });
            if (self.refs["picBox"].refs["picitem" + id]) {
                self.refs["picBox"].refs["picitem" + id].setState({ isCheck: "" });
            }
        },
        show: function show(opt) {
            var self = this;
            self._popup.show(opt || {}, false);
            self.refs.popupTitle.innerHTML = opt.title || "";
            if (!self.props.initLoad) {
                self.refs.picBox.setState({ initLoad: true }, function () {
                    self.refs.picBox.getInitData();
                });
            }
        },
        setSelectPic: function setSelectPic(data) {
            var self = this;
            if (self.props.selectMode == "single") {
                self.refs.selectPic.setState({ imgUrl: data });
            } else {
                var valueFormat = [];
                var dataFormat = [];
                data.map(function (v) {
                    if(v.Id && v.Url && v.Name){
                        var id = v.Id;
                        valueFormat.push(id);
                        dataFormat.push(v);
                    }else{
                        var id = self.props.dataFormat(v).Id;
                        valueFormat.push(id);
                        dataFormat.push(self.props.dataFormat(v));
                    }
                    if (self.refs["picBox"].refs["picitem" + id]) {
                        self.refs["picBox"].refs["picitem" + id].setState({ isCheck: "isCheck" });
                    }
                });
                var defaultItem = dataFormat.copy();
                var imgUrl = defaultItem.copy();
                self.refs["picBox"].setState({ picItem: dataFormat, picValue: valueFormat, defaultItem: defaultItem, defaultValue: valueFormat.copy() });
                self.refs.selectPic.setState({ imgUrl: imgUrl });
            }
        },
        setChecked: function setChecked(id) {
            if (this.props.showRadio) {
                var radio = "radio" + id;
                var refId = "value" + id;
                this.refs.selectPic.refs[radio].refs[refId].setAttribute("checked", true);
                this.refs.selectPic.setState({ radioValue: id });
            }
        },
        getRadioValue: function getRadioValue() {
            return this.refs.selectPic.state.radioValue;
        },
        hide: function hide(backdata) {
            var self = this;

            this._popup.hide.apply(this._popup, arguments);
        },
        confirmClick: function confirmClick() {
            var value = this.getValue();
            var item = this.getItem();
            this.trigger("item.click", value, item);
        },
        cancelClick: function cancelClick() {
            this.hide();
            //this.refs["picBox"].__allCheck(true);
        },
        getValue: function getValue() {
            var value = this.refs["picBox"].state.picValue;
            return value;
        },
        bindData: function bindData(data) {
            this.refs.picBox.setState({ picSource: data });
        },
        getItem: function getItem() {
            var item = this.refs["picBox"].state.picItem;
            return item;
        },
        search: function search() {
            var self = this;
            var searchData = this.refs.form.getFormData();
            if (this.refs["picBox"].state.isShow) {
                searchData = $.extend(searchData, this.props.searchField);
            } else {}
            self.trigger("item.search", searchData);
            return searchData;
        },
        reload: function reload() {
            this.refs.picBox.refs.page.reload();
        },
        import: function _import() {
            var self = this;
            self.trigger("item.import", null);
        },
        upload: function upload(obj, e) {
            var self = this;
            var opt = {
                trigger: e.target
            };
            $.extend(opt, self.props.upload);
            if (!self.uploader) {
                self.uploader = new Uploader(opt);
            }
            self.uploader.open();
            self.uploader.on("success", function (e, response) {
                self.refs.picBox.picList = self.refs.picBox.picList ? self.refs.picBox.picList : [];
                self.refs.picBox.picList.push(self.props.formatter(response));
                if (self.refs.picBox.state.isShow) {
                    var picSource = self.refs.picBox.state.picSource;
                    var item = self.props.formatter(response);
                    picSource.push(item);
                    self.refs.picBox.setState({ picSource: picSource });
                }
                self.trigger("upload.success", e, response);
            });
            self.uploader.on("error", function (e, file) {
                self.trigger("upload.error", e, file);
            });
        },
        render: function render() {
            var self = this;
            var btns = [{ text: "查询", type: "search", onClick: self.search }];
            if (self.props.uploadBtn) {
                btns.unshift({ text: "上传图片", type: "upload", onClick: self.upload.bind(self, this) });
            }
            if (self.props.importBtn) {
                btns.push({ text: "导出数据", type: "import", onClick: self.import });
            }
            var opt = {
                columns: 3, //设置平均分几列显示，默认为1，可不填，可选1，2，3，4，6;field为数组形式，可传空对象
                fields: this.props.fields,
                btnalign: "right", //设置按钮在左中右,默认中间
                btns: btns,
                watch: this.props.watch
            };
            if (self.props.checkImgBtn) {
                var checkImgBtn = React.createElement("button", { type: "button", className: "btn", onClick: self.checkImg }, React.createElement("i", { className: "icon-search" }), "查看图片");
            }
            if (self.props.previewImg) {
                var imgbox = React.createElement(Imgbox, React.__spread({}, self.props, { delImg: self.delImg, key: self.autoKey(self.props.defaultImgUrl), ref: "selectPic" }));
            }
            var dom = React.createElement("div", { className: "module-picPopup" }, imgbox, React.createElement("div", { className: "btn-content" }, React.createElement("button", { type: "button", className: "btn changeImg", onClick: self.changeImg }, React.createElement("i", { className: "icon-repeat" }), self.props.changeImgBtnText), checkImgBtn), React.createElement("div", { className: "module-popup fade in", ref: "popup" }, React.createElement("div", { className: "module-popup-panel", "data-popup-panel": "" }, React.createElement("div", { className: "module-popup-body slideInDown", style: { overflow: "visible" } }, React.createElement("i", { className: "module-popup-icon" }), React.createElement("div", { className: "module-popup-title", "data-popup-title": "", ref: "popupTitle" }), React.createElement("a", { href: "javascript:;", className: "close", "data-popup-hide": "" }), React.createElement("div", { className: "module-popup-content", "data-popup-content": "" }, React.createElement(FormSearch, React.__spread({}, opt, { objtree: this.objtree, ref: "form" })), React.createElement(PicBox, React.__spread({ picData: self.props.picSource }, self.props, { ref: "picBox" })), React.createElement("div", { className: "btn-contain" }, React.createElement("button", { className: "btn btn-primary ", type: "button", onClick: self.confirmClick }, "确定"), React.createElement("button", { className: "btn btn-default", type: "button", onClick: self.cancelClick }, "取消")))))));
            return dom;
        },
        componentDidMount: function componentDidMount() {
            var self = this;
            self._popup = new Popup({
                wrapper: self.refs.popup
            });
            self._popup.on("hide", function (e, data) {
                if (data) {
                    var value = [];
                    data.map(function (item) {
                        value.push(item.Id);
                    });
                    self.refs["picBox"].__allCheck(true);
                    self.refs["picBox"].setState({ picItem: data.copy(), picValue: value.copy() });
                    value.map(function (id) {
                        if (self.refs["picBox"].refs["picitem" + id]) {
                            self.refs["picBox"].refs["picitem" + id].setState({ isCheck: "isCheck" });
                        }
                    });
                }
            });
        }
    });
    picPopup.defaultProps = defOpt;
    var UIModule = ReactModule.extend({
        init: function init(options) {},
        ATTRS: defOpt,
        METHODS: {},
        ReactMethods: Methods,
        ReactModule: picPopup
    });
    UIModule.React = picPopup;

    return UIModule;
});