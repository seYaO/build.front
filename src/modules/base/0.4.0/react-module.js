/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function(_module) {
    if (typeof(define) != "undefined" && define.amd) {
        define(['base/0.4.0/react-base', 'base/0.4.0/react-methods'], _module);
    } else if (typeof(define) != "undefined" && define.cmd) {
        define("base/0.4.0/react-module", ['base/0.3.1/react-base', 'base/0.4.0/react-methods'], function(require, exports, module) {
            var ReactBase = require('base/0.3.1/react-base');
            var ReactModule = require('base/0.4.0/react-methods');
            return _module(ReactBase, ReactModule);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function(ReactBase, ReactModule) {
    /*
     * 模块基类
     */
    var Module = ReactBase.extend({
        init: function(options) {
            var self = this;
            self.o_wrapper = $(self.attr.wrapper);
            if (self.attr.react) {
                self.react = self.attr.react;
            } else {
                self.react = ReactDOM.render(React.createElement(self.ReactModule, self.attr),
                    self.o_wrapper.get(0)
                );
            }
            for (var name in this.ReactMethods) {
                var _fn = this.ReactMethods[name];
                this[name] = _fn.bind(self.react);
            }
        },
        ATTRS: {
            wrapper: "",
            initReact: true,
            childs: []
        },
        METHODS: {
            fn: {
                uuid: function() {
                    var s = [];
                    var hexDigits = "0123456789abcdef";
                    for (var i = 0; i < 36; i++) {
                        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                    }
                    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 0
                    s[8] = s[13] = s[18] = s[23] = "-";
                    var uuid = s.join("");
                    return uuid;
                }
            },
            watch: function(field, callback) {
                this._watchlist.push({ field: field, callback: callback });
            },
            onDataChange: function() {

            }

        },
        ReactMethods: ReactModule,
        ReactModule: null
    });
    Module.reactMethod = ReactModule;
    return Module;
});