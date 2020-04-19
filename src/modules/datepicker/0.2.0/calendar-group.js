(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(["datepicker/0.2.0/datepicker", "datepicker/0.2.0/tmpl/calendar-group", "datepicker/0.2.0/tmpl/datepicker", "css!datepicker/0.2.0/theme/calendar-group"], function (DatePicker, calendarTmpl, simpleTmpl) {
            return _module(DatePicker, calendarTmpl, simpleTmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.0/calendar-group", ["datepicker/0.2.0/datepicker", "datepicker/0.2.0/tmpl/calendar-group", "datepicker/0.2.0/tmpl/datepicker", "datepicker/0.2.0/theme/calendar-group.css"], function (require, exports, module) {
            var DatePicker = require("datepicker/0.2.0/datepicker"),
                calendarTmpl = require('datepicker/0.2.0/tmpl/calendar-group');
                require("datepicker/0.2.0/theme/calendar-group.css");
            var simpleTmpl = require('datepicker/0.2.0/tmpl/datepicker');
            return _module(DatePicker, calendarTmpl, simpleTmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }
})(function (DatePicker, calendarTmpl, simpleTmpl) {
    /*
 * 日历控件
 * dom数据标签属性:data-btn-premonth,data-btn-nextmonth
 * events:itemselect:(old,已弃用),dayselect:选中,canelselect:取消选择,itemclick:点击某项
 */
    var GroupCalendar = DatePicker.extend({
        initialize: function (config) {
            GroupCalendar.superclass.initialize.apply(this, arguments);
            //this.init(config);
            GroupCalendar.prototype.init.apply(this, arguments);
        },
        init: function (conf) {

            var data = {
                width: ((1 + (1 * 2 / this.attr.monthCount)) * 100) + "%",
                hideButtons: this.attr.hideButtons
            };
            if (this.attr.slide) {
                this.o_wrapper.html(this.attr.groupTmpl(data));
                this.o_group = this.o_wrapper.find(".main-group-show");
            }
          
        },
        ATTRS: {
            "groupTmpl": calendarTmpl,
            "monthCount": 2,
            "slide": false
            //"calendarWidth": "25%"
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            addMonth: function (n) {               
                var self = this;
                if (!self.attr.slide) {
                    self.__addMonth(n);
                    return;
                }

                var num = Math.abs(n);
                var newmonthdate = this.__nowDate;

                var e_date = this.__nowDate;
                e_date = e_date.addMonth(n);
                self.trigger("monthchange", (e_date.getMonth() + 1), e_date.getFullYear());

                var group_show_div = self.o_wrapper.find(".main-group-show");
                var tmlphtml = '';
                for (var i = 0; i < num; i++) {
                    newmonthdate = (n > 0) ? this.__nowDate.addMonth(self.attr.monthCount - 1 + i + 1) : this.__nowDate.addMonth(i * -1 - 1);
                    var monthdata = self.__getTmplData(newmonthdate);
                    monthdata.width = (1 / (this.attr.monthCount + 2)) * 100 + "%";

                    if (n > 0) {
                        tmlphtml = tmlphtml +simpleTmpl(monthdata);
                    }
                    else {
                        tmlphtml = simpleTmpl(monthdata) + tmlphtml;
                    }
                }

               //动画效果
                if (n > 0) {
                    self.o_group.append(tmlphtml);
                    group_show_div.animate({ "margin-left": (n / (this.attr.monthCount)) * 100 * -1 + "%" }, "slow", function () {
                        for (var i = 0; i < num; i++) {
                            self.o_group.find(".month-group").eq(0).remove();
                        }                      
                        self.o_group.css({ "margin-left": 0 });
                    });
                }
                else {
                    self.o_group.find(".month-group").eq(0).before(tmlphtml);
                    group_show_div.css({ "margin-left": (n / (this.attr.monthCount))* 100 + "%" });
                    group_show_div.animate({ "margin-left": 0 }, "slow", function () {
                        for (var i = 0; i < num; i++) {
                            self.o_group.find(".month-group").last().remove();
                        }                      
                    });
                }

                this.__nowDate = this.__nowDate.addMonth(n);
                self.__checkBtnState();

                //self.trigger("monthchange", (this.__nowDate.getMonth() + 1), this.__nowDate.getFullYear());

            },
            renderTmpl: function (data) {
                if (!this.attr.slide) {
                    this.__renderTmpl(data);
                    return;
                }
                for (var i = 0; i < data.months.length; i++) {
                    data.months[i].width = (1 / (this.attr.monthCount + 2)) * 100 + "%";
                    var html = simpleTmpl(data.months[i]);                 
                    this.o_group.append(html);
                }
                this.__checkBtnState();
            },
            render: function (data, res) {
                this.__render(data, res);
            }
        },
        __getCalendarWidth: function () {
            return (1 / (this.attr.monthCount + 2));
        }

    });
    return GroupCalendar;
});
