(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/base', "jsextend/0.1.0/jsextend", 'dot'], function (a, jsondb, c) {
            return _module();
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("base/0.1.0/module", ['base/0.1.0/base', "jsextend/0.1.0/jsextend",'dot'], function (require, exports, module) {
            require('base/0.1.0/base')
            require("jsextend/0.1.0/jsextend")
            require("dot")
            // jsextend 与 dot并没有走cmd规范即加载执行
            return _module();
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function () {
    /*
    * intellisense search (模块基类)
    * Created by 李岩岩 on 2016/1/29.
    * attrs:o_pobj,o_wrapper,o_input,apiurl,itemNumber,dotTemplate,hasPanel
    * events:nodata,error,render
    * methods:render,getJsonp,hide
    */

    /*
     * 模块基类
     */
    var Module = Base.extend({
        initialize: function (options) {
            //init super
            Module.superclass.initialize.apply(this, arguments);
            //this.init(config);
            Module.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var attr = self.attr = {};
            $.each(self.ATTRS, function (k, v) {
                attr[k] = v.value;
            });
        },
        ATTRS: {
        },
        EVENTS: {
        },
        DOCEVENT: {
        },
        METHODS: {

        }
    });
    return Module;
});
