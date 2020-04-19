(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/module', './views/search-label.dot'], function (Module,Tmpl) {
            return _module(Module, Tmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("intellSearch/0.2.1/search-label", ['base/0.1.0/module', './views/search-label.dot'], function (require, exports, module) {
            var Module = require('base/0.1.0/module');
            var Tmpl = require('./views/search-label.dot');
            return _module(Module, Tmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (Module, Tmpl) {
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
    var SearchLabel = Module.extend({
        initialize: function (options) {
            //init super
            SearchLabel.superclass.initialize.apply(this, arguments);
            //this.init(config);
            SearchLabel.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var html = Tmpl(self.attr.data);
            self.o_wrapper = self.attr.o_wrapper;
            self.o_wrapper.append(html);

            self.attr.o_pobj.on("blur", function () {
                self.o_wrapper.show();
            });

            self.attr.o_pobj.on("focus", function () {
                self.o_wrapper.hide();
            });

            self.o_wrapper.on("mousedown", "[label-item]", function (e) {
                self.trigger("itemClick",this);
            });

        },
        ATTRS: {
            itemClick: function (e) {

            }
        },
        EVENTS: {
        },
        DOCEVENT: {
        },
        METHODS: {

        }
    });
    return SearchLabel;
});
