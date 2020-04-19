(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['popup/0.2.0/popup', 'datepicker/0.2.1/tmpl/yearpanel', 'css!datepicker/0.2.1/theme/calendar-year'], function (Popup, calendarTmpl) {
            return _module(Popup, calendarTmpl);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.1/calendar-year", ['popup/0.2.0/popup', 'datepicker/0.2.1/tmpl/yearpanel', 'datepicker/0.2.1/theme/calendar-year.css'], function (require, exports, module) {
            var Popup = require('popup/0.2.0/popup'),
                calendarTmpl = require('./tmpl/yearpanel.dot');
            return _module(Popup, calendarTmpl);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }
})(function (Popup, calendarTmpl) {
    /*
 * �����ؼ�
 * dom���ݱ�ǩ����:data-btn-premonth,data-btn-nextmonth
 * events:itemselect:(old,������),dayselect:ѡ��,canelselect:ȡ��ѡ��,itemclick:���ĳ��
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
            "maxDate": null,//���ʱ��
            "minDate": null,//��Сʱ��
            "value": 2015,
            "intervalYear": 10//���
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            render: function (conf, res) {
                var self = this;
                this.o_wrapper.html(calendarTmpl());
                var obj = this.o_wrapper.find(".yp_years");
                obj.empty();

                this.attr.endYear = this.attr.endYear ? this.attr.endYear : (self.attr.intervalYear / 2 + self.attr.value - 1);
                this.attr.startYear = this.attr.startYear ? this.attr.startYear : (self.attr.value - self.attr.intervalYear / 2);

                for (var i = this.attr.startYear; i <= this.attr.endYear; i++) {
                    obj.append('<span class="year">' + i + '</span>');
                }
                if ((this.attr.endYear-this.attr.startYear)<self.attr.intervalYear-1) {
                    this.o_wrapper.find('.yp_btn').css('display','none');
                }else {
                    this.o_wrapper.find('.yp_btn').css('display','block');
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
