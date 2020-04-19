(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['popup/0.2.0/popup', 'datepicker/0.2.0/tmpl/monthpanel', 'css!datepicker/0.2.0/theme/calendar-month'], function (Popup, calendarTmpl) {
            return _module(Popup, calendarTmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.0/calendar-month", ['popup/0.2.0/popup', 'datepicker/0.2.0/tmpl/monthpanel', 'datepicker/0.2.0/theme/calendar-month.css'], function (require, exports, module) {
            var Popup = require('popup/0.2.0/popup'),
                calendarTmpl = require('datepicker/0.2.0/tmpl/monthpanel');
            return _module(Popup, calendarTmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }
})(function (Popup, calendarTmpl) {
    /*
 * 日历控件
 * dom数据标签属性:data-btn-premonth,data-btn-nextmonth
 * events:itemselect:(old,已弃用),dayselect:选中,canelselect:取消选择,itemclick:点击某项
 */
    var MonthPanel = Popup.extend({
        initialize: function (config) {
            MonthPanel.superclass.initialize.apply(this, arguments);
            //this.init(config);
            MonthPanel.prototype.init.apply(this, arguments);
        },
        init: function (conf) {
            var self = this;

            this.o_wrapper.on('click', ".month", function () {
                self.trigger("itemselect", $(this).attr("data-value"));
                self.hide();
            });         
        },
        ATTRS: {
            "calendarTmpl": calendarTmpl           
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            render: function (conf, res) {
                this.o_wrapper.html(calendarTmpl());              
                if (res) {
                    res();
                }
            }
        }

    });
    return MonthPanel;
});
