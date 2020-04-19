(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['popup/0.2.0/popup', 'datepicker/0.2.0/tmpl/yearpanel', 'css!datepicker/0.2.0/theme/calendar-year'], function (Popup, calendarTmpl) {
            return _module(Popup, calendarTmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.0/calendar-year", ['popup/0.2.0/popup', 'datepicker/0.2.0/tmpl/yearpanel', 'datepicker/0.2.0/theme/calendar-year.css'], function (require, exports, module) {
            var Popup = require('popup/0.2.0/popup'),
                calendarTmpl = require('datepicker/0.2.0/tmpl/yearpanel');
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
    var Year = Popup.extend({
        initialize: function (config) {
            Year.superclass.initialize.apply(this, arguments);
            //this.init(config);
            Year.prototype.init.apply(this, arguments);
        },
        init: function (conf) {
            var self = this;

            self.attr.endYear = self.attr.intervalYear / 2 + self.attr.value;
            self.attr.startYear = self.attr.value - self.attr.intervalYear / 2;

            this.o_wrapper.on('click', ".year", function () {
                self.trigger("itemselect", this.innerText);
                self.hide();
            });
            this.o_wrapper.on('click', ".yp_btn_up", function () {
                self.attr.startYear -= self.attr.intervalYear;
                self.attr.endYear -= self.attr.intervalYear;
                self.render();
            });
            this.o_wrapper.on('click', ".yp_btn_down", function () {
                self.attr.startYear += self.attr.intervalYear;
                self.attr.endYear += self.attr.intervalYear;
                self.render();
            });
        },
        ATTRS: {
            "calendarTmpl": calendarTmpl,
            "monthCount": 2,
            "startYear": 0,
            "endYear": 0,
            "maxDate": null,//最大时间
            "minDate": null,//最小时间
            "value": 2015,
            "intervalYear": 10//间隔
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            render: function (conf,res) {               
                this.o_wrapper.html(calendarTmpl());
                var obj = this.o_wrapper.find(".yp_years");
                obj.empty();
                for (var i = this.attr.startYear; i < this.attr.endYear; i++) {
                    obj.append('<span class="year">' + i + '</span>');
                }
                if (res) {
                    res();
                }                 
            },
            getRenderHtml: function (conf) {

            }
        }

    });
    return Year;
});
