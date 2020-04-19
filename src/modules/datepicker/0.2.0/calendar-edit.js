(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(["datepicker/0.2.0/datepicker", "datepicker/0.2.0/tmpl/calendar-edit", "css!datepicker/0.2.0/theme/calendar-edit"], function (DatePicker, calendartmpl) {
            return _module(DatePicker, calendartmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.0/calendar-edit", ["datepicker/0.2.0/datepicker", "datepicker/0.2.0/tmpl/calendar-edit", "datepicker/0.2.0/theme/calendar-edit.css"], function (require, exports, module) {
            var DatePicker = require("datepicker/0.2.0/datepicker"),
                calendartmpl = require("datepicker/0.2.0/tmpl/calendar-edit");
            return _module(DatePicker, calendartmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (DatePicker, calendartmpl) {
    /*
 * 日历控件
 * dom数据标签属性:data-btn-premonth,data-btn-nextmonth
 * events:itemselect
 */
    var CalendarEdit = DatePicker.extend({
        initialize: function (config) {
            CalendarEdit.superclass.initialize.apply(this, arguments);
            CalendarEdit.prototype.init.apply(this, arguments);
        },
        init: function (conf) {
            var self = this;
            this.o_wrapper.on('click', ".J_changemonth", function () {
                var addmonth = parseInt($(this).attr("data-addmonth"));
                self.addMonth(addmonth);
            })
        },
        ATTRS: {
            calendarTmpl: calendartmpl
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            renderTmpl: function (data) {
                data.weekTmpl = this.get("weekTmpl");
                data.dayTmpl = this.get("dayTmpl");
                var html = this.get("calendarTmpl")(data);
                this.o_wrapper.html(html);
            },
            resetDataTmpl: function () {

            }
        }
    });
    return CalendarEdit;
});

