/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */


(function (_module) {
    if (typeof define != "undefined" && define.amd) {
        define(["base/0.4.0/react-module"], _module);
    } else if (typeof define != "undefined" && define.cmd) {
        define("jsondb/0.4.0/jsondb", ["base/0.4.0/react-module"], function (require, exports, module) {
            var Module = require("base/0.2.0/module");
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (ReactModule) {
    /*
     * 数据缓存
     * json memory database
     */
    var JsonDB = ReactModule.extend({
        init: function init(options) {
            this._jsonDB = new Array();
        },
        ATTRS: {
            maxSize: 5,
            modal: 1 //匹配模式:1:整体模糊匹配 2：单词模糊匹配（未实现）,3:完全匹配
        },
        METHODS: {
            insert: function insert(keyword, data) {
                //新增数据
                var _maxsize = this.get("maxSize");
                if (this._jsonDB.length >= _maxsize) {
                    this._jsonDB.shift();
                }
                this._jsonDB.push({ "keyword": keyword, "data": data });
            },
            query: function query(keyword) {
                var self = this;
                var hasdata = false;
                if (!keyword) {
                    return;
                }
                for (var i = 0; i < self._jsonDB.length; i++) {
                    var v = self._jsonDB[i];
                    if (self.get("modal") == 3) {
                        if (v.keyword == keyword) {
                            return v.data;
                        }
                    } else {
                        if (v.keyword.indexOf(keyword) > -1) {
                            return v.data;
                        }
                    }
                }
                return null;
            }
        }
    });

    return JsonDB;
});