(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(["panel/0.2.0/panel", 'popup/0.2.0/tmpl/popup'], function (panel, tmpl) {
            return _module(panel, tmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("popup/0.2.0/modal", ["panel/0.2.0/panel", 'popup/0.2.0/tmpl/popup'], function (require, exports, module) {
            var panel = require('panel/0.2.0/panel');
            var tmpl = require('popup/0.2.0/tmpl/popup');
            return _module(panel, tmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }

})(function (Panel,tmpl) {
    var Modal = Panel.extend({
        initialize: function (config) {
            //init super
            Modal.superclass.initialize.apply(this, arguments);
            //init
            //this.init(config);
            Modal.prototype.init.apply(this, arguments);
        },
        init: function (config) {
            this.o_wrapper = $('<div class="modal fade" aria-hidden="true" style="display:none;"></div>');
            this.o_wrapper.appendTo("body");
        },
        ATTRS: {
            modalSize: "",//modal-lg,modal-sm,modal-nor   
        },
        METHODS: {
            render: function (data, res) {
              
            },
            show: function (option) {
              
            },
            hide: function () {
                if (this.o_wrapper) {
                    this.o_wrapper.modal('hide');
                }
            },
            open: function (conf) {
                var _conf = $.extend({
                    modalSize: "",
                    content: ""
                }, conf);
                this.o_wrapper.html(tmpl(_conf));
                this.o_wrapper.modal('show');
            }
        }
    });
    return Modal;
});
