(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(["panel/0.2.0/panel", 'datepicker/0.2.0/tmpl/calendar', 'datepicker/0.2.0/calendar-year', 'datepicker/0.2.0/calendar-month',
            "css!datepicker/0.2.0/theme/default", 'css!fonticon/0.1.0/fonticon'], function (Panel, calendarTmpl, yearPanel, monthPanel) {
                return _module(Panel, calendarTmpl, yearPanel, monthPanel);
            });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("datepicker/0.2.0/datepicker", ["panel/0.2.0/panel", 'datepicker/0.2.0/tmpl/calendar', 'datepicker/0.2.0/calendar-year',
            'datepicker/0.2.0/calendar-month', "datepicker/0.2.0/theme/default.css", 'fonticon/0.1.0/fonticon.css'], function (require, exports, module) {
                var Panel = require("panel/0.2.0/panel"),
                   calendarTmpl = require('datepicker/0.2.0/tmpl/calendar'),
                    yearPanel = require('datepicker/0.2.0/calendar-year'),
                    monthPanel = require('datepicker/0.2.0/calendar-month');
                require("datepicker/0.2.0/theme/default.css");
                require('fonticon/0.1.0/fonticon.css')
                return _module(Panel, calendarTmpl, yearPanel, monthPanel);
            });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Demo = _module();
    }

})(function (Panel, calendarTmpl, yearPanel, monthPanel) {
    /*
     * 日历控件
     * dom数据标签属性:data-btn-premonth,data-btn-nextmonth
     * events:itemselect:(old,已弃用),dayselect:选中,cancelselect:取消选择,itemclick:点击某项
     */
    var DatePicker = Panel.extend( {
        initialize: function (config) {
            DatePicker.superclass.initialize.apply(this, arguments);
            //this.init(config);
            DatePicker.prototype.init.apply(this, arguments);
        },
        init: function (conf) {
            var self = this;
            
            var dayStrs = ["日", "一", "二", "三", "四", "五", "六"];
            var _value = conf.value;
            
            self.__nowDate = self.stringToDate(this.get("initDate"));
            if (_value) {
                if (typeof _value == 'string') {
                    self.__nowDate = self.stringToDate(_value);
                }
            }
            else {
                self.__nowDate = new Date();
            }
            
            
            //#region 初始数据
            self.__values = this.get("values");
            //if (typeof self.attr.minDate=="string") {
            //    self.attr.minDate = new Date(self.attr.minDate);
            //}
            //#endregion
            
            
            var o_wrapper = self.o_wrapper = $(self.get("wrapper"));
            //年面板
            if (self.attr.yearPanel) {
                self.__initYearPanel();
            }
            
            //月面板
            if (self.attr.monthPanel) {
                self.__initMonthPanel();
            }
            o_wrapper.on("click", '[data-btn-premonth]', function () {
                self.addMonth(-1);
            });
            o_wrapper.on("click", '[data-btn-nextmonth]', function () {
                self.addMonth(1);
            });
            o_wrapper.on("click", '.over:not(.prevmonthday,.nextmonthday)', function () {
                self.__onItemSelect(this);
            });
            
            self.__initEvent();
        },
        ATTRS: {
            "el": null,
            "calendarTmpl": calendarTmpl,
            "wrapper": null,//容器
            "maxDate": null,//最大时间
            "minDate": null,//最小时间
            "selectModel": 'simple',//选择模式:simple|multiple,单选|多选
            "weekModel": 2,//周模式,1:ios标准,周日为最后一天,2:周日显示为第一天,默认2(常用模式)
            "yearPanel": false,
            "monthPanel": false,
            "showModel": "popup",//显示模式:正常,弹出
            "hideButtons": new Array(),//需要隐藏的按钮;prevmonth,nextmonth
            "hideTrigger": "blur,esc",//blur,esc
            "position": "berth",//fixed,berth
            "initDate": new Date(),
            "allowCancel": true,//允许撤销
            "skin": 'default',
            //"dataModel": "12",
            "data": null, //数据
            "value": null, //日期
            "values": new Array(),//多选
            "festivals": {
                //2017
                "2017-01-01": "元旦",
                "2017-01-02": "元旦",
                "2017-01-27": "春节",
                "2017-01-28": "春节",
                "2017-01-29": "春节",
                "2017-01-30": "春节",
                "2017-01-31": "春节",
                "2017-02-01": "春节",
                "2017-02-02": "春节",
                "2017-04-02": "清明",
                "2017-04-03": "清明",
                "2017-04-04": "清明",
                "2017-04-29": "劳动",
                "2017-04-30": "劳动",
                "2017-05-01": "劳动",
                "2017-05-28": "端午",
                "2017-05-29": "端午",
                "2017-05-30": "端午",
                "2017-10-01": "国庆",
                "2017-10-02": "国庆",
                "2017-10-03": "国庆",
                "2017-10-04": "国庆",
                "2017-10-05": "国庆",
                "2017-10-06": "国庆",
                "2017-10-07": "国庆",
                "2017-10-08": "国庆",
                // 2016
                "2016-02-07": "除夕",
                "2016-02-08": "春节",
                "2016-02-22": "元宵",
                "2016-04-04": "清明",
                "2016-06-09": "端午",
                "2016-08-09": "七夕",
                "2016-09-15": "中秋",
                "2016-12-31": "元旦",
                //2015
                "2015-06-20": "端午",
                "2015-08-20": "七夕",
                "2015-09-27": "中秋"
            },
            "formatData": null,
            "monthCount": 1,//显示月份数量
            "end": null,
            "weekDayCheckButton": false,//星期 天选择按钮.启用时点击星期中的一天可以全选当月中所有该星期的日期,取消反之
            "monthCheckButton": false,//月选择按钮 启用时增加月选择按钮,点击后全选或取消该月所有日期
            "fillAcrossDate": true,//填充跨月时间    
            "fillWeeks": true//不足6周填充6周
        },
        EVENTS: {

        },
        DOCEVENTS: {
        },
        METHODS: {
            /*
             * 获取一月内每天数据,7*n模式
             */
            getMonthData: function (startdate) {
                var self = this;
                var itemdata = {
                    value: '',
                    date: '',
                    hasdata: false,
                    issel: false,
                    monthmodel: "now",//prev|now|next
                    data: new Array()
                };
                var festivals = this.get("festivals");//节日
                
                //写出每月的总的天数，把天数定义给一个数组
                var moday = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                //2月份的天数必须得区分今年是不是闰年
                var d = this.__nowDate;
                
                if (startdate) {
                    d = startdate;
                }
                var month = d.getMonth() + 1;//当前的月份
                var days = d.getDate();//当前月的号数
                var years = d.getFullYear();//当前的年份
                var run = years % 4;//看看是不是闰年
                if (run != 0) {
                    moday[2] = 28;//2月份的天数
                } else {
                    moday[2] = 29;
                }
                var monthstr = (month < 10) ? ('0' + month) : month;
                //看一下当前月份的一号对应的是星期几              
                d.setDate(1);
                //咱们一般看到的日历都是星期日在第一位，星期六在最后一位所以：
                var firstweekday = d.getDay();
                if (self.attr.weekModel == 1) {
                    //周日为最后一天模式
                    firstweekday = firstweekday - 1;
                    if (firstweekday <= 0) {
                        firstweekday = 7;
                    }
                }
                
                var daylist = new Array();
                var monthdaycount = moday[month];
                //first week               
                for (var i = 0; i < firstweekday; i++) {
                    var _date = new Date(years, month - 1, -1 * (firstweekday - i - 1));
                    var _day = _date.getDate();
                    var _daystr = (_day < 10) ? ('0' + _day) : _day;
                    var _monthstr = (month == 1) ? 12 : (month - 1);
                    var _date = years + "-" + _monthstr + "-" + _daystr;
                    
                    if (!self.attr.fillAcrossDate) {
                        daylist.push({ value: '', date: _date, day: '', dayindex: monthdaycount + i, monthmodel: "prev" });
                        continue;
                    }
                    
                    
                    
                    var _v = '';
                    var _f = false;
                    
                    if (self.attr.fillAcrossDate) {
                        _v = _day;
                        _f = false;
                        if (festivals[_date]) {
                            _f = true;
                            _v = festivals[_date];
                        }
                    }
                    
                    daylist.push({ value: _v, day: _day, date: _date, festival: _f, dayindex: (0 - firstweekday + i), monthmodel: "prev" });
                }
                
                for (var i = 0; i < monthdaycount; i++) {
                    var _day = i + 1;
                    var _daystr = (_day < 10) ? ('0' + _day) : _day;
                    var _date = years + "-" + monthstr + "-" + _daystr;
                    var _v = '';
                    var _f = false;
                    
                    _v = _day;
                    _f = false;
                    if (festivals[_date]) {
                        _f = true;
                        _v = festivals[_date];
                    }
                    
                    daylist.push({ value: _v, day: _day, date: _date, festival: _f, dayindex: i, monthmodel: "now" });
                }
                
                //var ys = 7 - daylist.length % 7;
                
                var ys = 7 - daylist.length % 7;
                //不满6周补全6周
                if (this.attr.fillWeeks) {
                    ys = 6 * 7 - daylist.length;
                }
                
                for (var i = 0; i < ys ; i++) {
                    var _date = new Date(years, month + 1, i + 1);
                    var _day = _date.getDate();
                    var _daystr = (_day < 10) ? ('0' + _day) : _day;
                    var _monthstr = (month == 1) ? 12 : (month + 1);
                    var _date = years + "-" + _monthstr + "-" + _daystr;
                    
                    if (!self.attr.fillAcrossDate) {
                        daylist.push({ value: '', day: '', date: _date, dayindex: monthdaycount + i, monthmodel: "next" });
                        continue;
                    }
                    
                    var _v = '';
                    var _f = false;
                    
                    _v = _day;
                    _f = false;
                    if (festivals[_date]) {
                        _f = true;
                        _v = festivals[_date];
                    }
                    daylist.push({ value: _v, day: _day, date: _date, festival: _f, dayindex: monthdaycount + i, monthmodel: "next" });
                }
                
                
                return daylist;
            },
            /*
             * 按星期整理数据
             */
            getWeekData: function (startdate) {
                var dayofmonth = this.getMonthData(startdate);
                var weeklist = new Array();
                var n = 7;
                var dayofweek = new Array();
                for (var i = 0; i < dayofmonth.length; i++) {
                    if (dayofweek.length == n) {
                        weeklist.push(dayofweek);
                        dayofweek = new Array();
                    }
                    dayofweek.push(dayofmonth[i]);
                }
                if (dayofweek.length > 0 && dayofweek.length <= n) {
                    weeklist.push(dayofweek);
                }
                
                
                return weeklist;
            },
            addMonth: function (n) {
                this.__addMonth(n);
            },
            setMonth: function (m, y) {
                var newmonth = new Date(y, m - 1, 1);
                var submonth = newmonth.getFullYear() * 12 + newmonth.getMonth() - this.__nowDate.getFullYear() * 12 - this.__nowDate.getMonth();
                //this.__nowDate = new Date(y, m - 1, 1);
                this.addMonth(submonth);
            },
            getMonth: function () {
                var _month = this.__nowDate.getMonth() + 1;
                if (_month > 12) {
                    _month = 1;
                }
                return _month;
            },
            render: function (data, res) {
                this.__render(data, res);
            },
            renderTmpl: function (data) {
                this.__renderTmpl(data);
            },
            //获取所有选中值
            getValues: function () {
                return this.__values;
            },
            setValues: function (vs) {
                var self = this;
                this.__values = vs;
                var $days = self.o_wrapper.find("[data-date]");
                for (var i = 0; i < $days.length; i++) {
                    var $day = $days.eq(i);
                    if ($day.hasClass('prevmonthday') || $day.hasClass('nextmonthday')) {
                        continue;
                    }
                    var date = $day.attr("data-date");
                    if (self.__values.contain(date)) {
                        $day.addClass("select");
                    }
                    else {
                        $day.removeClass("select");
                    }
                }
            },
            clearValues: function (vs) {
                var self = this;              
                //var $days = self.o_wrapper.find("[data-date]");
                for (var i = 0; i < vs.length; i++) {
                    var date = vs[i];
                    var $day = self.o_wrapper.find("[data-date=" + date + "]");
                    $day.removeClass("select");
                    self.__values.remove(date);
                }
                //for (var i = 0; i < $days.length; i++) {
                //    var $day = $days.eq(i);
                //    var date = $day.attr("data-date");
                //    $day.removeClass("select");
                //    self.__values.remove(date);
                //}
            },
            selectAll: function (months) {
                var sels;
                var values = this.__values;
                if (!months) {
                    sels = this.o_wrapper.find(".over:not(.nextmonthday,.prevmonthday)");
                }
                else {
                    var filters = new Array();
                    for (var i = 0; i < months.length; i++) {
                        filters.push(".group_month[data-month=" + months[i] + "]");
                    };
                    sels = this.o_wrapper.find(filters.join(',')).find(".over:not(.nextmonthday,.prevmonthday)");
                }
                
                for (var i = 0; i < sels.length; i++) {
                    values.push(sels.eq(i).attr('data-date'));
                }
                this.setValues(values);
                
                //this.o_warpper
            },
            unselectAll: function (months) {
                var sels;
                var values = new Array();
                if (!months) {
                    sels = this.o_wrapper.find(".over:not(.nextmonthday,.prevmonthday)");
                }
                else {
                    var filters = new Array();
                    for (var i = 0; i < months.length; i++) {
                        filters.push(".group_month[data-month=" + months[i] + "]");
                    };
                    sels = this.o_wrapper.find(filters.join(',')).find(".over:not(.nextmonthday,.prevmonthday)");
                }

                for (var i = 0; i < sels.length; i++) {
                    values.push(sels.eq(i).attr('data-date'));
                }
                this.clearValues(values);
            },
            stringToDate: function (DateStr) {
                if (!DateStr) {
                    return new Date(1970, 0, 1);
                }
                var converted = Date.parse(DateStr);
                var myDate = new Date(converted);
                if (isNaN(myDate)) {
                    //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
                    var arys = DateStr.split('-');
                    myDate = new Date(arys[0], --arys[1], arys[2]);
                }
                return myDate;
            }
        },
        __initEvent: function () {
            var self = this;
            if (self.attr.weekDayCheckButton) {
                self.o_wrapper.on("click", '.month-panel .header th', function () {
                    var $obj = $(this);
                    var index = $obj.index() + 1;
                    var $tdobj = $obj.parents(".group_month:first").find("tbody tr td:nth-child(" + index + ").over:not(.prevmonthday,.nextmonthday)");
                    var seldays = new Array();
                    $tdobj.each(function () {
                        seldays.push($(this).attr("data-date"));
                    });

                    if ($obj.hasClass("select")) {
                        $obj.removeClass("select");
                        self.clearValues(seldays);
                    }
                    else {//全选

                        $obj.addClass("select");
                        seldays = seldays.concat(self.getValues());
                        self.setValues(seldays);
                    }
                });
                //日期选中或取消时判断当前月份选中状态
                //dayselect: 选中, cancelselect:取消选择
                self.on("dayselect", function (e, d, date, values, obj) {                                  
                    self.__setWeekDaysCheckState(obj);
                });
                self.on("cancelselect", function (e, d, date, values, obj) {                      
                    self.__setWeekDaysCheckState(obj);
                });
            }
            if (self.attr.monthCheckButton) {
                //全选月获取消月
                self.o_wrapper.on('click', '[data-event-monthcheck]', function () {
                    var obj = $(this);
                    var month = obj.attr("data-month");
                    if (obj.hasClass("checked")) {
                        obj.removeClass("checked");
                        obj.removeClass("fa-check-circle-o");
                        obj.addClass("fa-circle");
                        self.unselectAll([month]);

                        if (self.attr.weekDayCheckButton) {
                            self.o_wrapper.find(".group_month[data-month=" + month + "]").find(".header th").removeClass("select");
                        }                       
                    }
                    else {
                        obj.addClass("checked");
                        obj.removeClass("fa-circle");
                        obj.addClass("fa-check-circle-o");
                        self.selectAll([month]);
                        if (self.attr.weekDayCheckButton) {
                            self.o_wrapper.find(".group_month[data-month=" + month + "]").find(".header th").addClass("select");
                        }                      
                    }
                });

                //日期选中或取消时判断当前月份选中状态
                //dayselect: 选中, cancelselect:取消选择
                self.on("dayselect", function (e, d, date, values, obj) {
                    //var $gp=obj.parents("group-")
                    var month = new Date(date).getMonth() + 1;
                    var $gp = $(obj).parents(".group_month:first");
                    //月选择
                    self.__setMonthCheckState(month, $gp.find('.over:not(.prevmonthday,.nextmonthday,.select)').length == 0);                  
                });
                self.on("cancelselect", function (e, d, date, values, obj) {
                    var month = new Date(date).getMonth() + 1;
                    var $gp = $(obj).parents(".group_month:first");
                    self.__setMonthCheckState(month, $gp.find('.over:not(.prevmonthday,.nextmonthday,.select)').length == 0);                    
                });
            }
            
        },
        __setMonthCheckState: function (month, state) {
            var obj = this.o_wrapper.find("[data-event-monthcheck][data-month=" + month + "]");
            if (!state) {
                obj.removeClass("checked");
                obj.removeClass("fa-check-circle-o");
                obj.addClass("fa-circle");
            }
            else {
                obj.addClass("checked");
                obj.removeClass("fa-circle");
                obj.addClass("fa-check-circle-o");
            }
        },
        /*选中星期*/
        __setWeekDaysCheckState: function (obj) {
            var $obj = $(obj);
            var index = $obj.index() + 1;
            var $tdobj = $obj.parents(".group_month:first").find("tbody tr td:nth-child(" + index + ").over:not(.prevmonthday,.nextmonthday,.select)");
            var hdobj= $obj.parents(".group_month:first").find(".header th:nth-child(" + index + ")");
            if ($tdobj.length > 0) {
                hdobj.removeClass("select");
            }
            else {
                hdobj.addClass("select");
            }
            
        },
        /*
         * 初始化年选择面板
         */
        __initYearPanel: function () {
            var self = this;
            this.o_wrapper.on('click', '.group_title .year', function () {
                if (!self.yearPanel) {
                    self.yearPanel = new yearPanel({
                        berth: this,
                        align: "bottom center",
                        width: "auto",
                        "hideTrigger": "blur,esc",//blur,esc
                        "position": "berth"//fixed,berth
                    });
                    self.yearPanel.on("itemselect", function (o, v) {
                        self.__nowDate.setFullYear(v);
                        self.render();
                    });
                }
                self.yearPanel.open({
                    berth: this,
                    value: self.__nowDate.getFullYear()
                });
            });
        },
        /*
        * 初始化月选择面板
        */
        __initMonthPanel: function () {
            var self = this;
            this.o_wrapper.on('click', '.group_title .month', function () {
                if (!self.monthPanel) {
                    self.monthPanel = new monthPanel({
                        berth: this,
                        align: "bottom center",
                        width: "auto",
                        "hideTrigger": "blur,esc",//blur,esc
                        "position": "berth"//fixed,berth
                    });
                    self.monthPanel.on("itemselect", function (o, v) {
                        var m = v - 1;
                        self.__nowDate.setMonth(m);
                        self.render();
                    });
                }
                self.monthPanel.open({
                    berth: this
                });
            });
        },
        __addMonth: function (n) {
            var self = this;
            this.__nowDate.setMonth(this.__nowDate.getMonth() + n);
            
            
            var _month = this.__nowDate.getMonth() + 1;
            _month = (_month > 12) ? 1 : _month;
            var _year = this.__nowDate.getFullYear();
            self.trigger("monthchange", (this.__nowDate.getMonth() + 1), _year);
            
            this.render();
            //this.render(null, function () {
            //    self.show();
            //});
        },
        __nowDate: new Date(),
        //纯日期的选中值
        __values: new Array(),
        //带数据的选中值
        __dataValues: new Array(),
        __onItemSelect: function (obj) {
            var $obj = $(obj);
            var self = this;
            
            var selmodel = self.get("selectModel");
            var seldate = $obj.attr("data-date");
            var isselect = $obj.hasClass("select");
            
            var s = seldate.split('-');
            var y = s[0], m = s[1], d = s[2];
            var dayindex = $obj.attr("data-dayindex");
            //var tagdata = $obj.attr("data-tagdata");
            if (isselect && self.attr.allowCancel) {//取消选中
                $obj.removeClass("select");
                self.trigger("cancelselect", d, seldate, self.__values, obj);
                self.set("value", null);
                self.__values.remove(seldate);
                //for (var i = 0; i < self.__dataValues.length; i++) {
                //    if (self.__dataValues[i].date == seldate) {
                //        self.__dataValues.removeAt(i);
                //        break;
                //    }
                //}
                //self.__values.push = { date: seldate, tagdata: "" };
            }
            else {
                if (selmodel == "simple") {
                    self.o_wrapper.find(".select").removeClass("select");
                    self.set("value", seldate);
                    self.__values = [seldate];
                    //self.__dataValues = [{ date: seldate, tagdata: tagdata }];
                }
                else {
                    self.__values.push(seldate);
                    //self.__dataValues.push = { date: seldate, tagdata: tagdata };
                }
                $obj.addClass("select");
                self.trigger("itemselect", y, m, d, dayindex);
                self.trigger("dayselect", d, seldate, self.__values, obj);

            }
            
            //点击某项不管选中还是取消
            self.trigger("itemclick", d, seldate, self.__values, obj);
        },
        __render: function (data, res) {
            var self = this;
            var months = new Array();
            var monthcount = this.get("monthCount");
            for (var i = 0; i < monthcount; i++) {
                var month_date = this.__nowDate.addMonth(i);
                var json = self.__getTmplData(month_date);
                months.push(json);
            }
            //隐藏超出范围的选择按钮
            var hideButtons = $.extend(new Array(), self.attr.hideButtons);
            if (self.attr.minDate && months.length > 0) {
                var minMonthDate = (self.stringToDate(self.attr.minDate));
                minMonthDate.setDate(1);
                if ((new Date(months[0].year, months[0].month - 1, 1)) <= minMonthDate) {
                    hideButtons.push('prevmonth');
                }
            }
            if (self.attr.maxDate && months.length > 0) {
                var maxMonthDate = (self.stringToDate(self.attr.maxDate));
                maxMonthDate.setDate(1);
                maxMonthDate.addMonth(1);
                if ((new Date(months[months.length - 1].year, months[months.length - 1].month, 1)) > maxMonthDate) {
                    hideButtons.push('nextmonth');
                }
            }
            
            for (var i = 0; i < months.length; i++) {
                months[i] = self.__setCalData(months[i]);
            }
            var json = {
                hideButtons: hideButtons,
                skin: self.attr.skin,
                weekModel: self.attr.weekModel,
                months: months
            }
            self.renderTmpl(json);
            if (res) {
                res();
            }
            ////整理月份数据
            //self.setCalData(months, function (months) {
            //    var json = {
            //        hideButtons: hideButtons,
            //        skin: self.attr.skin,
            //        weekModel: self.attr.weekModel,
            //        months: months
            //    }
            //    self.renderTmpl(json);
            //    if (res) {
            //        res();
            //    }
            //});
        },
        __renderTmpl: function (data) {
            var html = this.get("calendarTmpl")(data);
            this.o_wrapper.html(html);
        },
        __getTmplData: function (month_date) {
            var self = this;
            var weeks = this.getWeekData(month_date);
            var title = '';
            var _month = (month_date.getMonth() + 1);
            if (self.attr.yearPanel) {
                //支持年选择面板
                title += '<span class="year">' + month_date.getFullYear() + '年<i class="ico sort-desc"></i></span>';
            }
            else {
                title += month_date.getFullYear() + '年'
            }
            if (self.attr.monthPanel) {
                //支持月选择面板
                title += '<span class="month">' + (month_date.getMonth() + 1) + '月<i class="ico sort-desc"></i></span>' + ''
            }
            else {
                title += (month_date.getMonth() + 1) + '月';
            }
            if (self.attr.monthCheckButton) {
                title += '<i class="fa fa-circle btn_monthcheck" data-event-monthcheck data-month="' + _month + '" title="点击全选或撤销当月日期"></i>';
            }
            
            var json = {
                title: title,
                year: month_date.getFullYear(),
                month: _month,
                weeks: weeks
            };
            //整理月份数据
            json = self.__setCalData(json);
            return json;
        },
        __setCalData: function (month) {
            var self = this;
            var _formatData = self.get("formatData");
            var minDate = self.attr.minDate;
            var maxDate = self.attr.maxDate;
            var data = self.get("data");
            //格式化日数据
            var formatDayData = function (item) {
                var date = item.date;
                var issel;
                if(item.monthmodel == "now"){
                    issel = self.__values.contain(date);
                }else{
                    issel = false;
                }
                item.enable = true;
                item.tagdate = date;
                var d_date = self.stringToDate(date);
                //时间范围
                if (minDate) {
                    var d_minDate = self.stringToDate(minDate);
                    item.enable = item.enable && d_date.format('yyyyMMdd') >= d_minDate.format('yyyyMMdd');
                }
                if (maxDate) {
                    var d_maxDate = self.stringToDate(maxDate);
                    item.enable = item.enable && d_date.format('yyyyMMdd') <= d_maxDate.format('yyyyMMdd');
                }
                
                item.issel = issel;
                
                //验证时间范围
                if (data != null) {
                    //自定义数据填充
                    for (var n = 0; n < data.length; n++) {
                        if (date == data[n].Date) {
                            item.data = data[n];
                            item.hasdata = true;
                            break;
                        }
                    }
                }
                else {
                    item.hasdata = false;
                }
                
                //数据格式化
                if (_formatData) {
                    item = _formatData(item);
                }
                if (issel != item.issel) {
                    //有变动
                    if (item.issel) {
                        self.__values.push(item.date);
                    }
                    else {
                        self.__values.remove(item.date);
                    }
                }
            };
            //周
            var formatWeekData = function (week) {
                for (var k = 0; k < week.length; k++) {
                    var item = week[k];
                    formatDayData(week[k]);
                    week[k] = item;
                }
            };
            //月
            for (var i = 0; i < month.weeks.length; i++) {
                formatWeekData(month.weeks[i]);
            }
            return month;
        },
        /*
           * 获取日数据(异步)
           */
        __getCalData: function (res) {
            var self = this;
            var _data = self.get("data");
            if (_data) {
                if (typeof _data == "string") {
                    res(_data);
                }
                if (typeof _data == "function") {
                    _data(res);
                }
                return;
            }
            var url = self.get("apiurl");
            if (!url) {
                res(null);
                return;
            }
            this.getJsonp(url, function (data) {
                if (data && data.data && data.data.priceList) {
                    self.set("data", data.data.priceList);
                    console.log(data.data.priceList);
                    res(data.data.priceList);
                }
            });
        },
        __checkBtnState: function () {
            var self = this;
            var nowdate = self.__nowDate;
            nowdate.setDate(1);
            nowdate = self.stringToDate(nowdate.format('yyyy-MM-dd'));
            
            //隐藏超出范围的选择按钮
            var hideButtons = $.extend(new Array(), self.attr.hideButtons);
            if (self.attr.minDate) {
                var minMonthDate = (self.stringToDate(self.attr.minDate));
                minMonthDate.setDate(1);
                if (nowdate <= minMonthDate) {
                    hideButtons.push('prevmonth');
                }
            }
            if (self.attr.maxDate && self.attr.monthCount > 0) {
                var maxMonthDate = (self.stringToDate(self.attr.maxDate));
                maxMonthDate.setDate(1);
                maxMonthDate.addMonth(1);
                if (nowdate.addMonth(self.attr.monthCount) > maxMonthDate) {
                    hideButtons.push('nextmonth');
                }
            }
            
            if (hideButtons.contain('prevmonth')) {
                self.o_wrapper.find('[data-btn-premonth]').hide();
            }
            else {
                self.o_wrapper.find('[data-btn-premonth]').show();
            }
            if (hideButtons.contain('nextmonth')) {
                self.o_wrapper.find('[data-btn-nextmonth]').hide();
            }
            else {
                self.o_wrapper.find('[data-btn-nextmonth]').show();
            }
        }
      

    });
    return DatePicker;
});