/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.2.0/module', 'drag/0.3.0/jquery.dragsort'], function (Module) {
            return _module(Module);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("drag/0.3.0/drag", ['base/0.2.0/module', 'drag/0.3.0/jquery.dragsort'], function (require, exports, module) {
            var Module = require('base/0.2.0/module');
            require('drag/0.3.0/jquery.dragsort');
            return _module(Module);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Module = _module();
    }
})(function (Module) {

    var drag = Module.extend({
        initialize: function (options) {
            //init super
            drag.superclass.initialize.apply(this, arguments);
            //init
            drag.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            self.o_wrapper = $(self.attr.wrapper);

            self.o_wrapper.dragsort(self.attr);
        },
        ATTRS: {
            wrapper: null
        },
        METHODS: {
            destroy: function () {
                var self = this;
                self.o_wrapper.dragsort("destroy");
            },
            render: function () {
                var self = this;
                self.attr.wrapper
            }
        }
    });

    return drag;
});