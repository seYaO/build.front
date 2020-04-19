define("freePackage/calendar/0.1.0/comcal",["common/0.1.0/ua"],function(require,exports,module){
    var $ = jQuery,
        UA = require("common/0.1.0/ua");
    /* 行分割线，列分割线，日期格的大小width, height */

    /**
     * 日期单元格类名说明
     * 可选日期的类名为：day
     * 不可选日期的类名为：invalid-day
     * 今天的类名为：today
     * 明天的类名为：tomorrow，但是有了今天，明天可以不用突出显示
     * 节日添加类名：festival
     * 选中的日期添加类名：selected-day
     * 区间选择之间日期添加类名：range-day
     * 区间选择时hover日期到目标日期的日期添加类名：hover-day
     * 周六，周日分别添加类名：saturday、sunday
     *
     **/
// 自定义日期单元格宽度和高度时，日期内容填充最好也自定义提供

// hover, ajax请求数据
// 定位增强
        var helper = {};
        ["Date", "Array"].forEach(function (name) {
            helper["is" + name] = function (v) {
                return Object.prototype.toString.call(v) === "[object " + name + "]";
            };
        });
        function isElement(elem, tagName) {
            return elem.nodeType === 1 &&
                (tagName === undefined ? true : elem.tagName.toLowerCase() === tagName);
        }
        function isNotEmptyString(str) {
            return typeof str === "string" && str !== "";
        }
        function setTimeToZero(date) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
        }
        function stringToDate(str) {
            str = str.split("-");
            str = new Date(parseInt(str[0], 10), parseInt(str[1], 10) - 1, parseInt(str[2], 10));
            if (isNaN(str.getTime())) {
                return;
            }
            return str;
        }
        function dateToString(date) {
            return date.getFullYear() + "-" + putZero(date.getMonth() + 1) + "-" + putZero(date.getDate());
        }
        function putZero(num) {
            return (num < 10 ? "0" : "") + num;
        }
        function convertProp(obj, props) {
            var prop;
            for (var i = 0, len = props.length; i < len; i++) {
                prop = props[i];
                if (isNotEmptyString(obj[prop])) {
                    obj[prop] = stringToDate(obj[prop]);
                } else if (helper.isDate(obj[prop])) {
                    setTimeToZero(obj[prop]);
                } else {
                    obj[prop] = undefined;
                }
            }
        }
        function formatDate(param) {
            convertProp(param, ["startDate", "endDate"]);
            if (isNotEmptyString(param.currentDate)) {
                param.currentDate = [stringToDate(param.currentDate)];
            } else if (helper.isDate(param.currentDate)) {
                param.currentDate = [setTimeToZero(param.currentDate)];
            } else if (helper.isArray(param.currentDate)) {
                convertProp(param.currentDate, [0, 1]);
            } else {
                param.currentDate = [];
            }
        }
        function setCurrentDate(param) {
            if (param.elem && isElement(param.elem, "input")) {
                var val = stringToDate(param.elem.value);
                if (val) {
                    if (param.mode === "rangeTo") {
                        param.currentDate[1] = val;
                    } else {
                        param.currentDate[0] = val;
                    }
                } else {
                    if (param.mode === "rangeTo") {
                        if (param.currentDate[1]) {
                            param.elem.value = dateToString(param.currentDate[1]);
                        }
                    } else {
                        if (param.currentDate[0]) {
                            param.elem.value = dateToString(param.currentDate[0]);
                        }
                    }
                }
            }
        }
        function resetStartDate(param) {
            if (param.mode === "rangeTo" && param.currentDate[0]) {
                if (param.startDate.getTime() < param.currentDate[0].getTime()) {
                    param.startDate = new Date(param.currentDate[0]);
                }
            }
        }
        function show(elem, base, wrapper, offset) {
            var style = elem.style;
            if (base) {
                var baseOffset = $(base).offset(),
                    wrapperOffset;
                if (wrapper) {
                    wrapperOffset = $(wrapper).offset();
                    if (!offset) {
                        offset = {
                            left: 0,
                            top: $(base).height()
                        };
                    }
                } else {
                    if (!offset) {
                        offset = {};
                        var winScrollLeft = $(window).scrollLeft(),
                            winScrollTop = $(window).scrollTop(),
                            winWidth = $(window).width(),
                            winHeight = $(window).height(),
                            baseWidth = $(base).width(),
                            baseHeight = $(base).height(),
                            elemWidth = $(elem).width(),
                            elemHeight = $(elem).height();
                        if (winWidth + winScrollLeft - baseOffset.left < elemWidth && baseOffset.left - winScrollLeft + baseWidth >= elemWidth) {
                            offset.left = baseWidth - elemWidth + ((UA.ie >5 && UA.ie < 10)? 3 : 0);
                        } else {
                            offset.left = ((UA.ie > 5 && UA.ie < 9) ? -3 : 0);
                        }
                        if (winHeight + winScrollTop - baseOffset.top - baseHeight < elemHeight && baseOffset.top - winScrollTop >= elemHeight) {
                            offset.top = - elemHeight - ((UA.ie < 5 && UA.ie < 9) ? 0 : 3); // 3px是阴影
                        } else {
                            offset.top = baseHeight;
                        }
                    }
                }
                style.top = baseOffset.top - (wrapperOffset ? wrapperOffset.top : 0) + offset.top + "px";
                style.left = baseOffset.left - (wrapperOffset ? wrapperOffset.left : 0) + offset.left + "px"; // 1是边框
            }
            var originDisplay = $(elem).data("originDisplay");
            if (originDisplay !== undefined) {
                style.display = originDisplay;
            } else {
                style.display = "block";
            }
        }
        function hide(elem) {
            var display = $(elem).css("display");
            if (display !== "none") {
                $(elem).data("originDisplay", display);
                elem.style.display = "none";
            }
        }
        // 重置必要的属性
        function setProp(obj) {
            this._ = {}; // _属性表示副本
            if (!obj) {
                return;
            }
            $.extend(this._, obj);
            var props = ["startDate", "endDate", "zIndex", "currentDate", "ajaxObj", "fn", "elem", "elems", "mode", "offset", "buildContent", "hoverIn", "hoverOut"],
                prop;
            for (var i = 0, len = props.length; i < len; i++) {
                prop = props[i];
                this._[prop] = this._[prop] || this[prop];
            }
        }
        /**
         * firstDay  {number} 日历的第一天，默认是0，表示周日，1表示周一，依次类推，最大为6
         * startDate {string | date} 设置日历的可选区域的起始时间
         * endDate {string | date} 设置日历的可选区域的终止时间
         * wrapper {selector} 作为日历容器的元素器，不提供为body
         * type {string} 日历类型："show", "pick"(默认)(创建时有效)
         * elem {selector} 与日历关联的元素选择器，在"pick"类型下有效，用作定位，可在创建时传入，也可以在picker方法中传入
         * monthNum {number} (创建时有效)一次展现月份个数，默认2
         * showOtehrMonth {boolean} 是否显示前后月的日期
         * isBigRange {boolean} (创建时有效)是否是大区间日期选择，如果是的话，开启启年和月的选择功能
         * panelWidth 和 wrapperWidth 创建时有效
         * wrapper 创建时有效
         * mode {string} 选择的模式："rangeFrom"(默认), "rangeTo", "range", "single"(暂时不支持，只用当单选时选中日期的样式与不同时才考虑支持)
         * currentDate {string | date | array}
         * 当mode为rangeFrom，currentDate设置为数组时，第1个值表示起始时间，第2个表示终止时间，设置为日期字符串和日期对象时，表示起始时间
         * 当mode为rangeTo，currentDate
         * 当mode为range，表示同时选择两个日期
         * ajaxObj {object} 用来配置异步请求的对象
         * hoverIn {function}
         * hoverOut {function}
         * 扩展类属性
         * buildContent {function} 接受
         * fn {function} 选中日期后的回调
         *
         **/
        function Calendar(param) {
            var self  = this;
            $.extend(self, {
                firstDay: 0,
                monthNum: 2,
                zIndex: "10000",
                startDate: new Date(1900, 1 - 1, 1),
                endDate: new Date(2100, 12 -1, 31)
            });
            if (param !== undefined) {
                formatDate(param);
                setCurrentDate(param);
                resetStartDate(param);
                $.extend(self, param);
            }
            if(self.style === "show"){
                self._init(param);
            }else if(self.style === "pick"){
                var trigger = $(self.elem);
                self._elems = [];
                self._elems.push(trigger[0]);
                self._elems.push(self.panel);
                trigger.on("focus",function(){
                    if(!self.panel){
                        self._init(param);
                        self.alignEl(trigger);
                        bindElem.call(self);
                    }else{
                        self.show();
                    }
                });

            }
        }
        Calendar.prototype.show = function(){
            if (!this.panel) { // 还没有创建
                return;
            }
            this.alignEl();
        };
        Calendar.prototype.alignEl = function(trigger){
            if(!trigger){
                trigger = $(this.elem);
            }
            var tHeight = trigger.height(),
                panel = this.panel;
            if(!trigger.length){
                return;
            }
            var offset = trigger.offset();
            $(panel).css({
                top: offset.top + tHeight,
                left: offset.left,
                display: "block"
            });
        };
        Calendar.prototype._init = function(param){
            var self = this;
            build.call(self,param);
            var panel = self.panel;
            if (self.wrapper) {
                self.wrapper = $(self.wrapper);
                if (self.wrapper.length) {
                    self.wrapper = self.wrapper[0];
                    self.wrapper.appendChild(panel);
                } else {
                    delete self.wrapper;
                }
            } else {
                document.body.appendChild(panel);
            }
            setProp.call(self, param);
            if(param.style === "show"){
                panel.style.position = "relative";
            }else{
                panel.style.position = "absolute";
                $(panel).addClass(param.style+"-calendar-panel");
            }
            var activeDate = param.activeDate||[];
            self.update.apply(self,activeDate);
            init.call(self);
        };
        Calendar.prototype.getYearAndMonthStr = function(c) {
            return [this.currentDate];
        };
        Calendar.prototype.getNowMonth = function(){
            return this.nowMonth;
        };
        Calendar.prototype.dayStrs = ["日", "一", "二", "三", "四", "五", "六"];
        Calendar.prototype.pick = function (param) {
            if (this.style === "show") {
                return;
            }
            $.extend(this,param);
            if (!this.panel) {
                build.call(this);
                if (this.wrapper) {
                    this.wrapper.appendChild(this.panel);
                } else {
                    document.body.appendChild(this.panel);
                }
                this.panel.style.position = "absolute";
                this.panel.style.zIndex = this.zIndex;
                bindElem.call(this);
                init.call(this);
            }
            if (param !== undefined) {
                formatDate(param);
                if (param.elem) {
                    param.elem = $(param.elem);
                    if (param.elem.length) {
                        param.elem = param.elem[0];
                        if (this._elems.indexOf(param.elem) === -1) {
                            this._elems.push(param.elem);
                        }
                    } else {
                        delete param.elem;
                    }
                }
                if (param.elems) {
                    for (var i = 0, len = param.elems.length; i < len; i++) {
                        if (this._elems.indexOf(param.elems[i]) === -1) {
                            this._elems.push(param.elems[i]);
                        }
                    }
                }
            }
            // 取必须值
            setProp.call(this, param);
            setCurrentDate(this._);
            resetStartDate(this._);
            this.update();
            var that = this;
            setTimeout(function() {
                that.panel.style.zIndex = that._.zIndex;
                show(that.panel, that._.elem);
                if (that.iframeCover) {
                    that.iframeCover.update();
                }
            }, 0);
        };
        Calendar.prototype.hide = function() {
            if (!this.panel) { // 还没有创建
                return;
            }
            if (this.isBigRange) {
                hide(this.yearPanel);
                hide(this.monthPanel);
            }
            hide(this.panel);
            if (this.iframeCover) {
                this.iframeCover.update();
            }
        };
        function buildTabs(cfg){
            var html = '<div class="calendar-header"><div class="calendar-header-inner"><ul>',
                isHighLight = false,
                activeDate = this.activeDate,
                year;
            for(var i = 0, len = cfg.length-1; i<=len; i++){
                var item = cfg[i],
                    lowerPrice = item.LowerPrice,
                    //lowerPrice（无团期）  团期全满（有团期但是团期已满）
                    priceStr = lowerPrice && (item.LowerPriceDescribe !== "团期全满") ? ("<em>&yen;" + lowerPrice + "/人</em>") : item.LowerPriceDescribe,
                    aCls = "",
                    priceDateCls = "",
                    year = item.PriceYear,
                    month = item.PriceDate;
                if((lowerPrice&& (!isHighLight)&&!activeDate)||(activeDate && (month-0)===(activeDate[1]-0))){
                    isHighLight = true;
                    aCls = "active";
                    $(".calendar-title h4 span").html(year+"年"+month +"月");
                }
                if (lowerPrice && item.LowerPriceDescribe !== "团期全满") {
                    priceDateCls = "price-date";
                }
                html += '<li class="' + aCls + ' ' + priceDateCls + '" data-month="' + month + '" data-year="' + year + '"><a><span>' + month + '月</span>' + priceStr + '</a></li>';
            }
            html += '</ul></div><a onselectstart="return false;" style="-moz-user-select:none;" class="prev"><span></span></a><a class="next" onselectstart="return false;" style="-moz-user-select:none;"><span></span></a></div>';
            return html;
        }
        function tabExtraBuild(isNewTab){
            var tabData,
                htmlStr="";
            if(isNewTab){
                tabData = window.page_cf && window.page_cf.lowestPrice;
                if(tabData){
                    htmlStr = buildTabs.call(this,tabData);
                }
            }else{
                htmlStr ='<div class="month-nav">' +
                    '<a href="javascript:;" hidefocus="true" class="previous-month"></a>' +
                    '<a href="javascript:;" hidefocus="true" class="next-month"></a>' +
                    '</div>';
            }
            return htmlStr;
        }
        function getActiveMonth(htmlStr){
            var activeMonthArr = /class="active"[^>]+?(\d+)|data-month="(\d+)"/.exec(htmlStr),
                activeMonth;
            if(!(activeMonthArr)){
                return;
            }
            activeMonth = activeMonthArr[1]||activeMonthArr[2];
            return activeMonth;
        }
        /*
         * 日历id，主要用于重置样式，这样可以让样式只用于当前日历框
         * 如果需要定制日历，通过样式来完成
         * wrapperWidth {number} 每个日历内容板(类名为calendar-wrapper的div)的宽度，默认是231px((29 + 1) * 7 + 1 + 10 * 2)
         * panelWidth {number} 日历面板(类名为calendar-panel的div)宽度，不提供的话，通过wrapperWidth * this.monthNum
         *
         **/
        function build() {
            this.wrapperWidth = typeof this.wrapperWidth === "number" ? this.wrapperWidth : 560;
            this.panelWidth = typeof this.panelWidth === "number" ? this.panelWidth : (this.wrapperWidth * this.monthNum);
            var panel = document.createElement("div"),
                //如果是跟团
                newStyleSkin = this.tab?"dj-":"";
            panel.className = newStyleSkin+"calendar-panel" + (this.skin ? " " + this.skin : "");
            //panel.style.width =  this.panelWidth + "px"; // IE6下不提供宽度的话，会有样式问题
            var htmlStr = tabExtraBuild.call(this,this.tab);
            var currentDate = this.currentDate[0],
                currentTitle = new Date(currentDate);
            var nativeTabStr = this.tab?"": "<h6><span>"+currentTitle.getFullYear()+"年"+(currentTitle.getMonth()+1)+"月</span></h6>";
            // 需不需要日期选择功能
            var activeMonth = getActiveMonth(htmlStr)||"";
            for (var i = 0; i < this.monthNum; i++) {
                //htmlStr += '<div class="calendar-wrapper" style="width:' + this.wrapperWidth + 'px">' +
                htmlStr += '<div class="calendar-wrapper">' +
                        nativeTabStr+
                '<div class="calendar-container">' +
                '<i class="calendar-month-bg">'+activeMonth+'</i>'+
                '<table>';
                htmlStr += '<tr class="header">';
                var dayIndex;
                for (var j = 0; j < 7; j++ ) {
                    dayIndex = (j + this.firstDay) % 7;
                    htmlStr += '<th';
                    if (dayIndex === 0) {
                        htmlStr += ' class="sunday"';
                    } else if (dayIndex === 6) {
                        htmlStr += ' class="saturday"';
                    }
                    htmlStr += '>' + this.dayStrs[dayIndex] + '</th>';
                }
                htmlStr += '</tr>';
                // 固定6列，不动态改变
                for (j = 1; j < 7; j++) {
                    htmlStr += '<tr' + (j === 6 ? ' class="last-row"' : '') + '>' +
                    '<td class="sunday"></td>' + // 星期六和星期日要特殊标识
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td class="saturday"></td>' +
                    '</tr>';
                }
                htmlStr += '</table>' +
                '</div>' +
                '</div>';
            }
            panel.innerHTML = htmlStr;
            this.panel = panel;
        }
        function bindElem() {
            var that = this;
            $(document).on("click", function(e) {
                var target = e.target;
                while(target && document !== target) {
                    if (that._elems.indexOf(target) !== -1 || target === that.panel) {
                        return;
                    }
                    target = target.parentNode;
                }
                that.hide();
            });
            $(window).on("resize", function(e) {
                var display = $(that.panel).css("display");
                if (display !== "none") {
                    show(that.panel, that._.elem, that.wrapper, that._.offset);
                    if (that.iframeCover) {
                        that.iframeCover.update();
                    }
                }
            });
        }
        function init() {
            var that = this,
                wrappers = $(".calendar-wrapper", this.panel), // 通过闭包引用，下面几个也是 this.panel.getElementsByTagName("table")
                target,
                index,
                startDate,
                endDate,
                originalYear,
                originalMonth,
                rangeDays,
                toDay; // 储存选择区间的
            $(this.panel).on("click", function(e) {
                target = e.target;
                while (target !== this) {
                    target = $(target);
                    var input,
                        year;
                    if (target[0].tagName.toLowerCase() === "td") {
                        if (target.hasClass("invalid-day")) {
                            break;
                        }
                        if (that.style !== "show") {
                            that.hide();
                        }
                        var nowMonth = that.nowMonth||that.startDate,
                            date = nowMonth,
                            dateStr = target.attr("data-date");
                        date.setDate(dateStr);
                        var successFunc = that._.fn||that._.itemClick;
                        if (typeof successFunc === "function") {
                            successFunc(date.getFullYear(), date.getMonth() + 1, date.getDate(), target[0],e);
                        }
                        break;
                    } else if (target.hasClass("previous-month")) {
                        if (!target.hasClass("previous-month-disabled")) {
                            that.previousMonth();
                        }
                        break;
                    } else if (target.hasClass("next-month")) {
                        if (!target.hasClass("next-month-disabled")) {
                            that.nextMonth();
                        }
                        break;
                    } else if (target.hasClass("month-wrapper")) {
                        hide(that.yearPanel);
                        input = target[0].getElementsByTagName("input")[0];
                        year = parseInt(target[0].parentNode.getElementsByTagName("input")[0].value, 10);
                        input.select();
                        originalMonth = input.value;
                        startDate = new Date(that._.startDate);
                        index = wrappers.indexOf(target.parent(".calendar-wrapper")[0]);
                        startDate.setMonth(startDate.getMonth() + index);
                        monthPanelBuild.call(that, year, startDate);
                        show(that.monthPanel, target[0], that.panel);
                        return;
                    } else if (target.hasClass("year-wrapper")) {
                        hide(that.monthPanel);
                        input = target[0].getElementsByTagName("input")[0];
                        year = parseInt(input.value, 10);
                        originalYear = input.value;
                        input.select();
                        startDate = new Date(that._.startDate);
                        index = wrappers.indexOf(target.parent(".calendar-wrapper")[0]);
                        startDate.setMonth(startDate.getMonth() + index);
                        year = year - year % 10;
                        yearPanelBuild.call(that, year, startDate);
                        show(that.yearPanel, target[0], that.panel);
                        return;
                    }
                    target = target[0].parentNode;
                }
                if (that.isBigRange) {
                    hide(that.yearPanel);
                    hide(that.monthPanel);
                }
                e.stopPropagation();
            }).on("mouseover","td", function(e) {
                var delegateTarget = $(e.currentTarget);
                if (!delegateTarget.hasClass("invalid-day")) {
                    if (that._.mode !== "rangeTo") {
                        delegateTarget.addClass("hover-from-day");
                        return;
                    }
                    delegateTarget.addClass("hover-to-day");
                    if (!that._.currentDate[0]) {
                        return;
                    }
                    // 如果当前日期小于开始时间，直接返回
                    var yearAndMonthStr = that.getYearAndMonthStr(delegateTarget.parent(".calendar-wrapper")),
                        date = new Date(parseInt(yearAndMonthStr[0], 10),  parseInt(yearAndMonthStr[1], 10) - 1, e.delegateTarget.getAttribute("data-date"));
                    if (delegateTarget.hasClass("previous-month-day")) {
                        date.setMonth(date.getMonth() - 1);
                    } else if (delegateTarget.hasClass("next-month-day")) {
                        date.setMonth(date.getMonth() + 1);
                    }
                    if (date.getTime() < that._.currentDate[0].getTime()) {
                        return;
                    }
                    var fromDay = $(".from-day"),
                        days = $("td", this.panel),
                        i = 0,
                        end = days.indexOf(e.delegateTarget),
                        day;
                    if (fromDay.length) {
                        i = days.indexOf(fromDay[0]) + 1;
                    }
                    for (; i < end; i++) {
                        if (days[i] === e.delegateTarget) {
                            return;
                        }
                        day = $(days[i]);
                        if (!day.hasClass("invalid-day")) {
                            day.addClass("hover-day");
                        }
                    }
                    rangeDays = $(".range-day");
                    rangeDays.removeClass("range-day");
                    toDay = $(".to-day");
                    toDay.removeClass("to-day");
                    if (typeof that._.hoverIn === "function") {
                        that._.hoverIn(e.delegateTarget, date);
                    }
                }
            }).on("mouseout","td", function(e) {
                var delegateTarget = $(e.currentTarget);
                if (that._.mode !== "rangeTo") {
                    delegateTarget.removeClass("hover-from-day");
                    return;
                }
                if (!delegateTarget.hasClass("invalid-day")) {
                    delegateTarget.removeClass("hover-to-day");
                    $(".hover-day").removeClass("hover-day");
                    if (rangeDays) {
                        rangeDays.addClass("range-day");
                        rangeDays = undefined; // 需要删除掉
                    }
                    if (toDay) {
                        toDay.addClass("to-day");
                        toDay = undefined;
                    }
                    if (typeof that._.hoverOut === "function") {
                        that._.hoverOut(e.delegateTarget, date);
                    }
                }
            });
            if (!this.isBigRange) {
                return;
            }
            this.yearPanel = $(".year-panel", this.panel)[0];
            this.monthPanel = $(".month-panel", this.panel)[0];
            $(this.yearPanel).on("click", function(e) {
                var elem = e.target,
                    tagName,
                    years, year;
                while (elem !== this) {
                    tagName = elem.tagName.toLowerCase();
                    if (tagName === "a") {
                        if (!$(elem).hasClass("invalid-year")) {
                            if (elem.innerHTML !== originalYear) {
                                var date = new Date(parseInt(elem.innerHTML, 10), parseInt(target[0].parentNode.getElementsByTagName("input")[1].value, 10) - 1, 1);
                                date.setMonth(date.getMonth() - index);
                                that.update(date);
                            }
                            hide(this);
                        }
                        break;
                    } else  if(tagName === "span" && !$(elem).hasClass("invalid-nav")) {
                        if ($(elem).hasClass("previous")) {
                            years = this.getElementsByTagName("a");
                            year = parseInt(years[0].innerHTML, 10) - 10;
                            yearPanelBuild.call(that, year, that._.startDate, years);
                        } else if($(elem).hasClass("next")) {
                            years = this.getElementsByTagName("a");
                            year = parseInt(years[0].innerHTML, 10) + 10;
                            yearPanelBuild.call(that, year, that._.startDate, years);
                        }
                        break;
                    }
                    elem = elem.parentNode;
                }
                e.stopPropagation();
            });
            $(this.monthPanel).delegate("a", "click", function(e) {
                if (!$(e.delegateTarget).hasClass("invalid-month")) {
                    if (e.delegateTarget.innerHTML !== originalMonth) {
                        var date = new Date(parseInt(target[0].parentNode.getElementsByTagName("input")[0].value, 10), parseInt(e.delegateTarget.innerHTML, 10) - 1, 1);
                        date.setMonth(date.getMonth() - index);
                        that.update(date);
                    }
                    hide(this);
                }
                e.stopPropagation();
            });
            function fireEvent(elem, type) {
                if (document.dispatchEvent) {
                    var e = document.createEvent("HTMLEvents");
                    e.initEvent("change", true, false);
                    elem.dispatchEvent(e);
                } else {
                    elem.fireEvent("on" + type, document.createEventObject());
                }
            }
            // 只允许输入数字，回车更新日历
            $(that.panel.getElementsByTagName("input")).on("keydown", function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    if (this.name === "year" && this.value === originalYear) {
                        hide(that.yearPanel);
                        return;
                    } else if (this.name === "month" && this.value === originalMonth) {
                        hide(that.monthPanel);
                        return;
                    } else {
                        $(this).trigger("change");
                        // fireEvent(this, "change");
                    }
                } if (keyCode === 9) {
                    // 如果按下是tab键什么都不做
                } else if (keyCode !== 8 && keyCode !== 46 && (keyCode < 37 || keyCode > 40) && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
                    e.preventDefault();
                }
            }).on("change", function(e) {
                var year, month, date;
                if (this.name === "year") {
                    year = parseInt(this.value, 10);
                    year = isNaN(year) ? 0 : year;
                    if (year < startDate.getFullYear() || year > that._.endDate.getFullYear()) {
                        this.value = originalYear;
                        this.select();
                    } else {
                        originalYear = this.value;
                        month = parseInt($("input", $(this).parent("calendar-wrapper"))[1].value, 10) - 1;
                        date = new Date(year, month, 1);
                        date.setMonth(date.getMonth() - index);
                        that.update(date);
                        hide(that.yearPanel);
                    }
                } else {
                    month = parseInt(this.value, 10);
                    year = parseInt(this.parentNode.parentNode.getElementsByTagName("input")[0].value, 10);
                    if (month >= 1 && month <= 12) {
                        month = month - 1;
                        if ((year === startDate.getFullYear() && month <= startDate.getMonth()) ||
                            (year === that._.endDate.getFullYear() && month > that._.endDate.getMonth()) ||
                            year < startDate.getFullYear() || year > that._.endDate.getFullYear()) {
                            // 继续执行
                        } else {
                            originalMonth = this.value;
                            date = new Date(year, month - index, 1);
                            that.update(date);
                            hide(that.monthPanel);
                            return;
                        }
                    }
                    this.value = originalMonth;
                    this.select();
                }
            });
        }
        Calendar.prototype.updateHeaderMonth = function(e){
            //如果是新版日历,即跟团的日历
            if(this.tab) return;
            var m = $("h6 span", e);
            var year = this.nowMonth.getFullYear(),
                month = this.nowMonth.getMonth()+1;
            m[0].innerHTML = year + "年" + month + "月";
        };
        Calendar.prototype.update = function(year, month) {
            var date,
                wrappers = $(".calendar-wrapper", this.panel); // this.panel.getElementsByTagName("table");
            this.today = new Date();
            setTimeToZero(this.today);
            if (helper.isDate(year)) {
                date = year;
                month = date.getMonth();
            } else if (typeof year === "undefined") {
                var maxStartDate = this.today.getTime() > this._.startDate.getTime() ? this.today : this._.startDate;
                if (this._.mode === "rangeTo") {
                    if (this._.currentDate[1]) {
                        date = new Date(this._.currentDate[1]);
                    } else if (this._.currentDate[0]) {
                        date = new Date(this._.currentDate[0]);
                    } else {
                        date = new Date(maxStartDate);
                    }
                } else {
                    if (this._.currentDate[0]) {
                        date = new Date(this._.currentDate[0]);
                    } else {
                        date = new Date(maxStartDate);
                    }
                }
                date.setDate(1);
            } else {
                date = new Date(year, month - 1, 1);
            }
            this.nowMonth = date;
            if (this._.startDate) {
                if ((this._.startDate.getFullYear() === date.getFullYear() && this._.startDate.getMonth() === month) || this._.startDate.getTime() > date.getTime()) {
                    $(".previous-month", this.panel).addClass("previous-month-disabled");
                } else {
                    $(".previous-month", this.panel).removeClass("previous-month-disabled");
                }
            }
            if (this._.ajaxObj) {
                var ajaxNum = 0;
                var loadingElem = $(".loading", this.panel);
                if (loadingElem.length) {
                    loadingElem.css("display: block;");
                } else {
                    $(this.panel).append("bottom", '<div class="loading"></div>');
                }
            }
            for (var i = 0, len = wrappers.length; i < len; i++) {
                if (this._.ajaxObj) {
                    var that = this;
                    (function (wrapper, date){
                        var ajaxObjCopy = $.extend({}, that._.ajaxObj);
                        ajaxObjCopy.url =  ajaxObjCopy.url.replace("{year}", date.getFullYear()).replace("{month}", date.getMonth() + 1);
                        var preProcess = ajaxObjCopy.fn;
                        ajaxObjCopy.success = function (data) {
                            if (typeof preProcess === "function") {
                                data = preProcess(data);
                            }
                            updateMonth.call(that, wrapper, date, data);
                            ajaxNum++;
                            if (ajaxNum === that.monthNum) {
                                $(".loading", that.panel).css("display:none;");
                            }
                        };
                        $.ajax(ajaxObjCopy);
                    })(wrappers[i], new Date(date));
                } else {
                    updateMonth.call(this, wrappers[i], new Date(date)); // 日期是对象类型，需要重新创建一个，否者会对当前对象造成影响
                }
                date.setMonth(date.getMonth() + 1);
            }
            date.setMonth(date.getMonth() - 1);   // 还原成最后一个日历面板的月份的第一天
            if (this._.endDate) {
                if ((this._.endDate.getFullYear() === date.getFullYear() && this._.endDate.getMonth() === date.getMonth()) || this._.endDate.getTime() < date.getTime()) {
                    $(".next-month", this.panel).addClass("next-month-disabled");
                } else {
                    $(".next-month", this.panel).removeClass("next-month-disabled");
                }
            }
            this.afterRender && this.afterRender.call(this,wrappers);
        };
        Calendar.prototype.previousMonth = function () {
            navMonth.call(this, true);
        };
        Calendar.prototype.nextMonth = function () {
            navMonth.call(this);
        };
        function navMonth(isPrevious) {
            var date = this.nowMonth;
            if (isPrevious) {
                date.setMonth(date.getMonth() - 1);
            } else {
                date.setMonth(date.getMonth() + 1);
            }
            this.update(date);
        }
        /**
         * 农历节日：除夕、春节、元宵、端午、七夕、中秋
         * 节气节日：清明
         **/
        var festivals = {
            // 2016
            "2016-2-7": "除夕",
            "2016-2-8": "春节",
            "2016-2-22": "元宵",
            "2016-4-4": "清明",
            "2016-6-9": "端午",
            "2016-8-9": "七夕",
            "2016-9-15": "中秋",
            //2015
            "2015-6-20": "端午",
            "2015-8-20": "七夕",
            "2015-9-27": "中秋"
        };
        // 其他节气和放假安排，提供接口，可以完成
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
            } else if (month === 2 && day === 14) {
                dateStr = "情人";
            } else if (month === 5 && day === 1) {
                dateStr = "五一";
            } else if (month === 6 && day === 1) {
                dateStr = "儿童";
            } else if (month === 10 && day === 1) {
                dateStr = "国庆";
            } else if (month === 12 && day === 25) {
                dateStr = "圣诞";
            }
            return dateStr;
        }
        function processDate(td, date, data) {
            var tableCell = $(td);
            if (date.getTime() < this._.startDate.getTime() || date.getTime() > this._.endDate.getTime()) {
                tableCell.addClass("invalid-day");
            }
            var className,
                day = date.getDate(),
            dateStr = getFestival(date);
            if (dateStr) {
                className = "festival";
            }
            if (date.getTime() === this.today.getTime()) {
                dateStr = "今天";
                className = "today";
            }
            if (typeof this._.buildContent === "function") {
                this._.buildContent(td, date, dateStr, data);
            } else {
                // 使用类名d是，为了避免自定义的内容结构包含span标签，需要要重置样式
                td.innerHTML = '<span class="d">' + (dateStr ? dateStr : day) + '</span>';
            }
            td.setAttribute("data-date", day);
            if (className) {
                tableCell.addClass(className);
            }
            var isGtFromDay = false;
            if (this._.currentDate[0]) {
                if (date.getTime() > this._.currentDate[0].getTime()) {
                    isGtFromDay = true;
                } else if (date.getTime() === this._.currentDate[0].getTime()) {
                    tableCell.addClass("from-day");
                }
            }
            if (this._.currentDate[1]) {
                if (date.getTime() < this._.currentDate[1].getTime()) {
                    if (isGtFromDay) {
                        tableCell.addClass("range-day");
                    }
                } else if (date.getTime() === this._.currentDate[1].getTime()) {
                    tableCell.addClass("to-day");
                }
            }
        }
        function setClassName(td, className) {
            var classNames = ["sunday", "saturday"];
            for (var i = 0; i < classNames.length; i++) {
                if (td.className.indexOf(classNames[i]) !== -1) {
                    td.className = classNames[i] + " " + className;
                    return;
                }
            }
            td.className = className;
        }
        function updateMonth(wrapper, date, data) {
            var table = $("table", wrapper)[0],
                month = date.getMonth(),
                dayIndex,
                rowIndex = 1,
                td,
                date1 = new Date(date); // 处理上月数据用到的日期对象
            this.updateHeaderMonth(wrapper);
            // 上月日期处理
            while (date1.getDay() !== this.firstDay) {
                date1.setDate(date1.getDate() - 1);
                td = table.rows[1].cells[(date1.getDay() - this.firstDay + 7) % 7];
                if (this.showOtherMonth) {
                    setClassName(td, "invalid-day previous-month-day");
                    processDate.call(this, td, date1, data);
                } else if(this.showOtherDate){
                    td.innerHTML = '<span class="date">'+date1.getDate()+'</span>';
                    setClassName(td, "invalid-day not-this-day");
                } else {
                    td.innerHTML = "";
                    setClassName(td, "invalid-day not-this-day");
                }
            }
            // 当月数据处理
            while (date.getMonth() === month) {
                dayIndex = (date.getDay() -this.firstDay + 7) % 7;
                td = table.rows[rowIndex].cells[dayIndex];
                setClassName(td, "this-month-day");
                processDate.call(this, td, date, data);
                if (dayIndex === 6) {
                    rowIndex++;
                }
                date.setDate(date.getDate() + 1);
            }
            // 下月日期处理
            while (rowIndex < 7) {
                dayIndex = (date.getDay() -this.firstDay + 7) % 7;
                td = table.rows[rowIndex].cells[dayIndex];
                if (this.showOtherMonth) {
                    setClassName(td, "next-month-day");
                    processDate.call(this, td, date, data);
                } else if(this.showOtherDate){
                    td.innerHTML = '<span class="date">'+date.getDate()+'</span>';
                    setClassName(td, "invalid-day not-this-day");
                } else {
                    td.innerHTML = "";
                    setClassName(td, "invalid-day not-this-day");
                }
                if (dayIndex === 6) {
                    rowIndex++;
                }
                date.setDate(date.getDate() + 1);
            }
        }
        return Calendar;
});
