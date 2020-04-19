/**
 * @author 公共组件(modify by 黄凯)
 * @module  日历核心组件
 * @exports calendar
 * @description 日历核心组件
 **/
(function($) {
    Date.ParseString = function (e) {
        var b = /(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/i,
            a = b.exec(e),
            c = 0,
            d = null;
        if (a && a.length) {
            if (a.length > 5 && a[6]) {
                c = Date.parse(e.replace(b, "$2/$3/$1 $4:$5:$6"));
            } else {
                c = Date.parse(e.replace(b, "$2/$3/$1"));
            }
        } else {
            c = Date.parse(e);

        }
        if (!isNaN(c)) {
            d = new Date(c);
        }
        return d;
    };
    function setTimeToZero(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
    function isNotEmptyString(str) {
        return typeof str === "string" && str !== "";
    }

    module.exports = function(param) {
        return new Calendar(param);
    };
    /*
     * @desc 每次打开日期都是实时生成日历数据
     * @param param {object}  配置对象，以下是可配置的属性
     * @param param.name  {string}  日历页面的名字，是日历页面元素的id前缀，规则是：name + "Page"，默认是calendar，
     *                 如果需要多个日历页面，可以给日历页面配置不同的名字
     * @param param.title  {string}  日历页面的标题，默认是"选择日期"，可以配置
     * @param param.startDate  {string | Date}  日历的起始日期，默认是当天，使用字符串话，格式为短线分割的日期，例如：2014-01-01
     * @param param.endDate    {string | Date}  日历的终止时间，默认是半年之后
     * @param param.curentDate {Array}  当前选中的时间，同时配置开始和结束日期的话会有区间选择的效果
     * @param param.model  {string} 默认是"rangeFrom"，"rangeTo"可以配置为"range"，表示区间，可以选择起始时间和终止时间
     * @param param.tips   {Array}  区间选择的提示，默认是["请选择起始时间", "请选择结束时间"]
     * @param param.ajaxObj  {object}  ajax请求对象，直接传递$.ajax方法
     * @param param.wrapper  {zepto}  包含日历元素，也就是自定义日历页面，高级属性，较少用到
     */
    function Calendar(param) {
        this.today = setTimeToZero(new Date());
        this.hasData = false;
        $.extend(this, param);
        formatDate.call(this);
        setStartAndEndDate.call(this);
        if (!this.tips) {
            this.tips = ["请选择起始时间", "请选择结束时间"];
        }
        if (!this.wrapper) {
            var id = (this.name || "calendar") + "Page",
                title = this.title || "选择日期",
                wrapper = $("#" + id);
            this.wrapper = wrapper;
            if (!this.wrapper.length) { // 创建日历页面
                $(".page-box").append('<div id="' + id + '" class="page"></div>');
                this.wrapper = $("#" + id);
            } else {
                $("page-header h2", this.wrapper).html(title);
                $(".calendar", this.wrapper).remove();
            }
        }
        build.call(this);
        init.call(this,param);
    }

    function formatDate() {
        convertProp(this, ["startDate", "endDate"]);
        if (this.currentDate) {
            convertProp(this.currentDate, [0, 1]);
        } else {
            this.currentDate = [];
        }
    }

    function convertProp(obj, props) {
        var prop;
        for (var i = 0, len = props.length; i < len; i++) {
            prop = props[i];
            if (isNotEmptyString(obj[prop])) {
                obj[prop] = Date.ParseString(obj[prop]);
            } else if (obj[prop] instanceof Date) {
                setTimeToZero(obj[prop]);
            } else {
                obj[prop] = undefined;
            }
        }
    }

    // 默认起始日期是今天，结束时间半年后
    function setStartAndEndDate() {
        var startDate,endDate;
        if(this.data && this.data.length > 0){
            if (!this.startDate) {
                var data = this.data;
                for(var i = 0, len = data.length-1; i<=len; i++){
                    //原来是前面团期已满的不展示,现在改为满团的也展示
                    if(!startDate){
                        startDate = new Date(data[i].date);
                    }
                    endDate = new Date(data[i].date);
                }
            }
        }
        this.startDate = startDate || this.startDate || this.today;
        if (!this.endDate) {
            var halfYearAfter;
            if(!endDate){
                halfYearAfter = new Date();
            }else{
                halfYearAfter = new Date(endDate);
            }

            var _month = halfYearAfter.getMonth();
            var _year = halfYearAfter.getFullYear();
            //由于是东八区,所以默认的时间是8点,所以我们的结束时间需要晚于8点,否则会导致最后一个日期被禁用
            this.endDate = new Date(_year,_month+1,0,16);
        }
    }

    var monthIndex,
        htmlStrs,
        doneNum;
    function build() {
        var  self = this,
            date = new Date(this.startDate),
            data = self.data||[],
            htmlStr = '<div class="calendar">',
            buildTable;
        date.setDate(1);
        if(data.length >1){
            self.hasData = true;
        }
        if (this.ajaxObj) {
            // 显示loading
            monthIndex = 0;
            htmlStrs = [];
            doneNum = 0;
            buildTable = buildTableContentAjax;
        } else {
            buildTable = function (date) {
                var flag = false,
                    month = date.getMonth()+ 1,
                    hasData = self.hasData;
                month = month > 9?""+month: "0"+month;
                for(var i= 0,len = data.length -1; i<=len;i++){
                    if(data[i].date.indexOf("-"+month+"-") > -1){
                        flag = true;
                        self.hasData = true;
                        break;
                    }
                }
                //if(hasData||flag){
                    htmlStr += buildTableContent.call(this, date,data);
                //}
            };
            htmlStr +='<div class="calendar-list-outer"><div class="calendar-list">';
        }
        while (date.getTime() <= self.endDate.getTime()) {
            buildTable.call(this, new Date(date), monthIndex++);
            date.setMonth(date.getMonth() + 1);
        }
        if (this.mode === "range") {
            htmlStr += '<div class="calendar-tips fixed">' + self.tips[0] + '</div>';
            setTimeout(function () {
                $('.calendar-tips', self.wrapper).animate({"margin-left": "-100px"}, 300, "ease-in-out");
            }, 300);
        }
        htmlStr += '</div></div></div>';
        self.wrapper.append(htmlStr);
        self.afterRender && self.afterRender.call(self,self.wrapper);
    }
    function buildTableContentAjax(date, i) {
        var ajaxObj = $.extend({}, this.ajaxObj),
            that = this,
            month = date.getMonth() + 1;
        ajaxObj.url = ajaxObj.url.replace('{year}', date.getFullYear()).replace("{month}", (month < 10 ? "0" : "") + month);
        if (that.ajaxObj.beforeSend) {
            ajaxObj.beforeSend = function (xhr, setting) {
                that.ajaxObj.beforeSend(xhr, setting, date);
            };
        }
        ajaxObj.success = function (data) {
            if (that.ajaxObj.success) {
                data = that.ajaxObj.success(data);
            }
            htmlStrs[i] = buildTableContent.call(that, date, data);
            doneNum++;
            if (doneNum === monthIndex) {
                $(".calendar", that.elem).html(htmlStrs.join(""));
                // 隐藏loading
            }
        };
        $.ajax(ajaxObj);
    }

    function buildTableContent(date, data) {
        var month = date.getMonth(),
            date1 = new Date(date), // 处理上月数据用到的日期对象
            htmlStr = '<div class="calendar-wrapper" data-year="' + date.getFullYear() + '" data-month="' + (date.getMonth() + 1) + '">' +
                '<h3>' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月</h3>' +
                '<table>' +
                    '<tr>' +
                        '<th class="sunday">周日</th>' +
                        '<th>周一</th>' +
                        '<th>周二</th>' +
                        '<th>周三</th>' +
                        '<th>周四</th>' +
                        '<th>周五</th>' +
                        '<th class="saturday">周六</th>' +
                    '</tr>' +
                    '<tr>';
        while (date1.getDay() !== 0) {
            date1.setDate(date1.getDate() - 1);
            data ? htmlStr += '<td class="disabled"></td>' :
                htmlStr += '<td></td>';
        }
        var startDate = this.startDate;
        // "rangeTo"模式下起始时间，以currentDate中的起始时间为准
        if (this.mode === "rangeTo" && this.currentDate[0] && this.currentDate[0].getTime() > this.startDate.getTime()) {
            startDate = this.currentDate[0];
        }
        // 当月数据处理
        while (date.getMonth() === month) {
            htmlStr += processDate.call(this, date, startDate, data);
            date.setDate(date.getDate() + 1);
            if (date.getDay() === 0 && date.getMonth() === month) {
                htmlStr += '</tr><tr>';
            }
        }
        // 下月日期处理
        while (date.getDay() !== 0) {
            data ? htmlStr += '<td class="disabled"></td>' :
                htmlStr += '<td></td>';
            date.setDate(date.getDate() + 1);
        }
        htmlStr += '</tr>' +
                '</table>' +
            '</div>';
        return htmlStr;
    }

    function processDate(date, startDate, data) {
        var classArr = [];
        if (date.getDay() === 0) {
            classArr.push("sunday");
        } else if (date.getDay() === 6) {
            classArr.push("saturday");
        }
        if (date.getTime() < startDate.getTime() || date.getTime() > this.endDate.getTime()) {
            classArr.push("disabled");
        }
        var dateStr,
            className,
            festivalStr = getFestival(date);
        if (festivalStr) {
            dateStr = festivalStr;
            className = "festival";
        } else {
            if (date.getTime() === this.today.getTime()) {
                dateStr = "今天";
                className = "today";
            }
        }
        if (className) {
            classArr.push(className);
        }
        // 处理currentDate
        if (this.currentDate) {
            var fromDate = this.currentDate[0],
                toDate = this.currentDate[1];
            if (fromDate) {
                if (date.getTime() === fromDate.getTime()) {
                    classArr.push("from-day");
                } else if (date.getTime() > fromDate.getTime() && toDate && date.getTime() < toDate.getTime()) {
                    classArr.push("range-day");
                }
            }
            if (toDate && toDate.getTime() === date.getTime()) {
                classArr.push("to-day");
            }
        }

        var contentHTML;
        if (this.buildContent) {
            contentHTML = this.buildContent(date, dateStr, classArr, data);
        } else {
            contentHTML = dateStr ? dateStr : date.getDate();
        }
        return '<td' + (classArr.length ? ' class="' + classArr.join(" ") + '"' : '') +
            ' data-day="' + date.getDate() + '">' +
                contentHTML +
            '</td>';
    }

    /**
     * 农历节日写死到2020年
     * 农历节日：除夕、春节、元宵、端午、七夕、中秋
     * 节气节日：清明
    **/
    var festivals = {
        // 2014
        "2014-1-30": "除夕",
        "2014-1-31": "春节",
        "2014-2-14": "元宵",
        "2014-4-5": "清明",
        "2014-6-2": "端午",
        "2014-8-2": "七夕",
        "2014-9-8": "中秋",
        "2014-10-2": "重阳",
        // 2015
        "2015-2-18": "除夕",
        "2015-2-19": "春节",
        "2015-3-5": "元宵",
        "2015-4-5": "清明",
        "2015-6-20": "端午",
        "2015-8-20": "七夕",
        "2015-9-27": "中秋",
        "2015-10-21": "重阳",
        // 2016
        "2016-2-7": "除夕",
        "2016-2-8": "春节",
        "2016-2-22": "元宵",
        "2016-4-4": "清明",
        "2016-6-9": "端午",
        "2016-8-9": "七夕",
        "2016-9-15": "中秋",
        "2016-10-19": "重阳",
        // 2017
        "2017-1-27": "除夕",
        "2017-1-28": "春节",
        "2017-2-11": "元宵",
        "2017-4-4": "清明",
        "2017-5-30": "端午",
        "2017-8-28": "七夕",
        "2017-10-4": "中秋",
        "2017-10-28": "重阳",
        // 2018
        "2018-2-15": "除夕",
        "2018-2-16": "春节",
        "2018-3-2": "元宵",
        "2018-4-5": "清明",
        "2018-6-18": "端午",
        "2018-8-17": "七夕",
        "2018-9-24": "中秋",
        "2018-10-17": "重阳",
        // 2019
        "2019-2-4": "除夕",
        "2019-2-5": "春节",
        "2019-2-19": "元宵",
        "2019-4-5": "清明",
        "2019-6-7": "端午",
        "2019-8-7": "七夕",
        "2019-9-13": "中秋",
        "2019-10-7": "重阳",
        // 2020
        "2020-1-24": "除夕",
        "2020-1-25": "春节",
        "2020-2-8": "元宵",
        "2020-4-4": "清明",
        "2020-6-25": "端午",
        "2020-8-25": "七夕",
        "2020-10-1": "中秋",
        "2020-10-25": "重阳"
    };
    function getFestival(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            dateStr = festivals[year + "-" + month + "-" + day];
        if (dateStr) {
            return dateStr;
        }
        if (month === 1 && day === 1) {
            dateStr = "元旦";
        }  else if (month === 5 && day === 1) {
            dateStr = "五一";
        } else if (month === 6 && day === 1) {
            dateStr = "六一";
        } else if (month === 10 && day === 1) {
            dateStr = "国庆";
        } else if (month === 12 && day === 25) {
            dateStr = "圣诞";
        }
        return dateStr;
    }

    function init(param) {
        var that = this;

        $('.calendar', that.wrapper).delegate("td", "click", function (e) {
            var elem = $(this);
            if (elem.hasClass("disabled")) {
                return;
            }
            var price,
                fromDayTd = $('.from-day',that.wrapper);
                var bEl = elem.find("b");
                if(bEl.length >0){
                    price = bEl.text();
                }
            fromDayTd.removeClass("from-day");
            elem.addClass("from-day");

            if (typeof that.fn === "function") {
                var calWrapper = elem.parents(".calendar-wrapper");
                var dateMon = calWrapper.attr("data-month");
                dateMon = dateMon -0<=9?"0"+dateMon:dateMon;
                var dateDay = elem.attr("data-day");
                dateDay = dateDay -0<=9?"0"+dateDay:dateDay;
                that.fn([calWrapper.attr("data-year"), dateMon, dateDay],price,elem);
            }
        });
    }
})(Zepto);
