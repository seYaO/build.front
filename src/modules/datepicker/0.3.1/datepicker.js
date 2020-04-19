/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function(_module) {
    if (typeof(define) != "undefined" && define.amd) {
        define(['base/0.2.0/module', "datepicker/0.3.1/bootstrap-datetimepicker", "css!datepicker/0.3.1/bootstrap-datetimepicker.min"], function(Module) {
            return _module(Module);
        });
    } else if (typeof(define) != "undefined" && define.cmd) {
        define("datepicker/0.3.1/datepicker", ['base/0.2.0/module', "datepicker/0.3.0/bootstrap-datepicker", "datepicker/0.3.0/datepicker.css"], function(require, exports, module) {
            var Module = require('base/0.2.0/module');
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})
(function(Module) {
    /*
     * 模块基类
     */
    var Datepicker = Module.extend({
        initialize: function(options) {
            //init super
            Datepicker.superclass.initialize.apply(this, arguments);
            //this.init(config);
            Datepicker.prototype.init.apply(this, arguments);
        },
        init: function(options) {
            var self = this;
            var el = self.attr.el;
            var _opt = $.extend({}, self.attr);

            if (self.attr.dateRange) {
                var o_el = this.o_el = $(el).find("[name=start],[name=end]");
                o_el.datetimepicker(_opt);
                var startel = o_el.eq(0);
                var endel = o_el.eq(1);
                startel.datetimepicker().on('changeDate', function(ev) {
                    //console.log(ev);
                    endel.datetimepicker('setStartDate', ev.date);
                    endel.datetimepicker('show');
                });
                endel.datetimepicker().on('changeDate', function(ev) {
                    //console.log(ev);
                    startel.datetimepicker('setEndDate', ev.date);
                });
            } else {
                var o_el = this.o_el = $(el);
                o_el.datetimepicker(_opt);
            }

            this.o_el.datetimepicker().on("changeDate", function(e) {
                //console.log(1);
                $(e.target).trigger("change");
                // o_el.trigger("change");
                //self.trigger("change", o_el.val(), e.target);
                self.trigger("change", $(e.target).val(), e.target);
            });
        },
        ATTRS: {
            el: null,
            format: 'yyyy-mm-dd',
            language: "zh-CN",
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            //todayHighlight: 1,
            bootcssVer: 3, //bootstrap v
            //0 or 'hour' for the hour view
            //1 or 'day' for the day view
            //2 or 'month' for month view (the default)
            //3 or 'year' for the 12-month overview
            //4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers.
            startView: 2,
            minView: 2,
            forceParse: 0,
            //showMeridian: 1
            //autoclose: true,//
            //todayBtn: true,//
            //pickerPosition: "bottom-left"//
            dateRange: false
        },
        EVENTS: {},
        DOCEVENT: {},
        METHODS: {
            show: function() {
                this.o_el.datetimepicker('show');
            },
            reset: function(opt, isall) {
                $.extend(this.attr, opt);
                this.o_el.datetimepicker('remove');
                this.o_el.datetimepicker(this.attr);
            },
            setDate: function(date) {
                this.o_el.datetimepicker("setDate", new Date(date));
            }
        }
    });
    return Datepicker;
});