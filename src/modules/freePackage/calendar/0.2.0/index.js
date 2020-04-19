define("freePackage/calendar/0.2.0/index",["freePackage/calendar/0.2.0/comcal","dialog/0.1.0/index","freePackage/calendar/0.2.0/index.css"],function(require,exports,module){
    var ComCal = require("freePackage/calendar/0.2.0/comcal");
    var calendar ={};
    (function(){
        var $ = jQuery;
        var NEXT_DISABLE_CLS = "next-month-disabled",
            PREV_DISABLE_CLS = "previous-month-disabled";
        var calendarData;
        String.prototype.startWith = function(a) {
            if (a === null || a === "" || this.length === 0 || a.length > this.length) {
                return false;
            }
            return this.substring(0, a.length) === a;
        };
        /**
         * @desc 获取当前月份
         * @returns {*}
         */
        calendar.getNowMonth = function(){
            return this.inst.nowMonth;
        };
        /**
         * @desc 生成日历表格,会被循环调用
         * @param td 对应的格子td
         * @param date {object} 日期
         * @param dateStr
         * @param data
         * @param currDate
         */
        calendar.build = function(td,date, dateStr, data, currDate) {
            var self = this,
                dateTime = date.getTime(),item,info,htmlStr,
                place,classArr= [];
            for(var i = 0,len = data.length -1; i<=len;i++){
                item = data[i],
                place = item.ResidualDesc;
                //这里获得的是8点的毫秒数
                var _date = Date.parse(item.Date.replace(/\-/gi, "/"));
                if(currDate) {
                    var _currDate = Date.parse(currDate.replace(/\-/gi, "/"));
                }
                if(_date>= dateTime && _date < dateTime+1000*60*60*24){
                    info = item;
                    if(_date === _currDate) {
                        info.isCurrent = true;
                    } else {
                        info.isCurrent = false;
                    }
                    break;
                }
            }
            if(!info) {info = {};}
            info.dateStr = (dateStr ? dateStr : date.getDate());
            if(info.isCurrent) {
                classArr.push("current-day");
            }
            if (!info.Price) {
                classArr.push("invalid-day");

            } else {
                //如果residual＜0,即满团或者停团,则显示仓位状态,不显示价格
                if(info.Residual < 0){
                    classArr.push("invalid-day");
                }else if(place.startWith("余位")||info.Residual === 0){
                    classArr.push("over");
                }else{
                    classArr.push("enough");
                }
                info.priceStr = "¥"+info.Price;
            }
            var ret = self.beforeBuild && self.beforeBuild.call(self,td,info);
            if(ret === false){
                return false;
            }
            //判断是否有立减的icon
            if(info && info.HasPreferential){
                info.iconDiscount = '<span class="icon-discount">减</span>';
            }
            htmlStr = this.tmpl.replace(/{(\w+)}/g,function($0,$1){
                return info[$1]||"";
            });
            td.innerHTML = htmlStr;
            $(td).addClass(classArr.join(" "));
        };
        /**
         * @desc 获取数据里最低的月份
         * @param data 数据
         * @returns {[]}  返回格式为数组["2015","6"]
         */
        calendar.getLowestMonth= function(data){
            var lowestData = data.lowestPrice,
                tmp,month,year;
            for(var i = 0, len = lowestData.length -1; i<=len; i++){
                var item = lowestData[i];
                //如果lowerPrice为0,则为无团期
                if(!item.LowerPrice || item.LowerPriceDescribe === "团期全满"){
                    continue;
                }
                if(!tmp){
                    tmp = item.LowerPrice;
                    month = item.PriceDate;
                    year = item.PriceYear||"2015";
                }
                if(item.LowerPrice < tmp){
                    tmp = item.LowerPrice;
                    month = item.PriceDate;
                    year = item.PriceYear||"2015";
                }
            }
            return [year,month];
        };
        /**
         * @desc 获取数据里最低的月份
         * @param data 数据
         * @returns {[]}  返回格式为数组["2015","6"]
         */
        calendar.getNearestMonth= function(data){
            var lowestData = data.lowestPrice,
                tmp,month,year;
            for(var i = 0, len = lowestData.length -1; i<=len; i++){
                var item = lowestData[i];
                //如果lowerPrice为0,则为无团期
                if(!item.LowerPrice || item.LowerPriceDescribe === "团期全满"){
                    continue;
                }
                if(!tmp){
                    tmp = item.LowerPrice;
                    month = item.PriceDate;
                    year = item.PriceYear||"2015";
                }
            }
            return [year,month];
        };
        calendar.init = function(param){
            var self = this;
            // 日历
            if(!param){
                param = {};
            }
            $.extend(self,param);
            self.param = param;
            calendarData = param.data||window.page_cf;
            var activeDate;
            var currDate;
            if(!calendarData){
                var now = new Date(),
                    year = now.getFullYear(),
                    month = now.getMonth()+1;
                window.page_cf = calendarData = {
                    priceList: [],
                    lowestPrice: [{
                        LowerPrice: 0,
                        LowerPriceDescribe: "暂无团期",
                        PriceDate: month,
                        PriceYear: year
                    }]
                };
                activeDate = [year,month];
            }else{
                if(calendarData.lowestPrice){
                    activeDate = self.getNearestMonth(calendarData);
                }
                if(calendarData.currDate) {
                    currDate = calendarData.currDate;
                }
            }
            var defaultCfg = {
                skin: "green",
                monthNum: 1,
                zIndex: 22,
                style: "show",
                mode: "rangeFrom",
                wrapper: null,
                elem: null,
                startDate: null,
                wrapperWidth: 558,
                panelWidth: 560,
                tab: true,
                showOtherDate: true,
                activeDate: activeDate,
                currDate: currDate,
                itemClick: function(y, m, d, elem,e){
                    self.inst.currDate = y+'-'+m+'-'+d+" 0:00:00";
                    if(param.itemClick){
                        e.preventDefault();
                        param.itemClick.call(self,y, m, d, elem);
                    }else{
                        console.log("itemClick属性不存在!");
                    }
                },
                initEvent: function(){
                    if(!self.isRenderred){
                        self.isRenderred = true;
                        initEv.call(self);
                    }
                },
                afterRender: null,
                buildContent: function (td, date, dateStr) {
                    var currentDate = self.inst?self.inst.currDate:currDate;
                    self.build(td, date, dateStr, calendarData.priceList||calendarData, currentDate);
                }
            };
            var newCfg = $.extend(defaultCfg,param);
            self.inst = new ComCal(newCfg);

        };
        calendar.tmpl = '{iconDiscount}<span class="date">{dateStr}</span><div><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span></div>';
        /**
         * @desc 将css文件动态插入到页面里
         * @param url css的url
         */
        calendar.addStyle = function (url) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        };
        /**
         * #desc 从url里获取键值对
         * @param name 相应的key
         * @returns {null|string}
         */
        calendar.getParamFromUrl = function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results === null) {
                return null;
            }
            else {
                return results[1];
            }
        };
        /**
         * @desc 设置日历的背景月份
         * @param {number|Element} el 如果不是数字,则去对应的属性,然后给对应节点复制
         */
        calendar.changeBgNumber = function(el){
            var dataMonth;
            if(typeof el === "number"){
                dataMonth = el;
            }else{
                dataMonth = el.getAttribute("data-month");
            }
            if(dataMonth){
                $(".calendar-month-bg").html(dataMonth);
            }
        };
        function initEv(){
            var self = this;
            /* global calendar */
            function renderNav(){
                var prevBtn = $(".calendar-header .prev"),
                    nextBtn = $(".calendar-header .next");
                var parent = $(".calendar-header-inner ul"),
                    list = parent.find("li"),
                    liLen = list.length-1,
                    liWidth = list.eq(0).width(),
                    parentLeft = parent.css("left"),
                    index = Math.round(parseInt(parentLeft)/liWidth);
                var liIndex = $(".calendar-header-inner .active").index();
                if(liIndex > 5){
                    parent.css("left",-(liIndex-5)*liWidth+"px");
                    index = -(liIndex - 5);
                }

                if(index >= 0){
                    prevBtn.addClass(PREV_DISABLE_CLS);
                }
                if(liLen + index <= 5){
                    nextBtn.addClass(NEXT_DISABLE_CLS);
                }
                $(".calendar-header .prev,.calendar-header .next").on("click",function(){
                    var node = $(this),
                        isPrev = node.hasClass("J_PreviousMonth");
                    if(self.isClickNav||node.hasClass(PREV_DISABLE_CLS)||node.hasClass(NEXT_DISABLE_CLS)){
                        return;
                    }
                    self.isClickNav = true;
                    if(isPrev){
                        if(index >= 0){
                            return;
                        }
                        index ++;
                    }else{
                        if(liLen + index < 6){
                            return;
                        }
                        index --;
                    }
                    parent.css("left",liWidth*(index)+"px");
                    if(index >= 0){
                        prevBtn.addClass(PREV_DISABLE_CLS);
                    }else{
                        prevBtn.removeClass(PREV_DISABLE_CLS);
                    }
                    if(liLen + index < 6){
                        nextBtn.addClass(NEXT_DISABLE_CLS);
                    }else{
                        nextBtn.removeClass(NEXT_DISABLE_CLS);
                    }
                    self.isClickNav = false;
                });
            }
            renderNav();
            $(".calendar-header li").each(function(index,el){
                var _node = $(el);
                _node.on("click",function(){
                    var me = _node,
                        month = me.attr("data-month")- 0,
                        year = me.attr("data-year") - 0;
                    if(me.hasClass("J_NoPrice")){
                        return;
                    }
                    var calInst = self.inst;
                    calInst.update(year,month);
                    me.siblings().removeClass("active");
                    me.addClass("active");
                    $(".calendar-title h4 span").html(year+"年"+month +"月");
                    self.changeBgNumber(this);
                });
            });
        }
    }());
    return calendar;
});
