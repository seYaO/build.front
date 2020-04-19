/**
 * @author 黄凯(hk08688@ly.com)
 * @module  日历
 * @exports calendar
 * @description 日历模块
 * @example
 * //加载日历模块
 * var Calendar = require("modules-touch/calendar/index");
 * Calendar.init({
 *     date: "2014-10-18",
 *     data: calData, //这个calData是接口返回的日历数据
 *     title: "产品详情" //标记来自哪个页面,当从日历切换回去时,需要将title改回去
 * })
 *
 * 日历面板初始化后,需要配合Common.redirect切换到日历面板上
 * Common.redirect({
 *       tag:"calendar",
 *       title: "选择日期"
 * },{
 *       "prevTag": "main"
 * });
 *
 * //以下为可选的处理逻辑
 * //特殊逻辑,如果需要调整数据结构
 * Calendar.dealData =  function(data){
 *    return data.cal;
 * };
 * //如果需要调整日历被点击后的回调
 * Calendar.callback = function(dates,price){
 *     //dates为被选中的日期的数组,如 2014-10-12,则dates= [2014,10,12]
 *     //price为当前日期上的价格
 * };
 * //如果需要调整日历上的模板
 * Calendar.tmpl = '<div><span>{dateStr}</span><p><b>{residualDesc}</b></p></div>';
 *
 *
 */
/* global Monitor */
(function(){
    var calendar = require("modules-touch/calendar/cal"),
        Common = require("modules-touch/common/index");
    /**
     * @func init
     * @desc 日历组件初始化
     * @param cfg 配置
     */
    calendar.init = function(cfg){
        var self = this;
        if(cfg.url && (!cfg.data)){
            Common.getData(cfg.url,function(data){
                //todo 待更新
                cfg.data = data.data.calendar;
                cfg.tabData = data.data.lowestPrice;
                self._init(cfg);
            },true);
        }else{
            self._init(cfg);
        }
    };
    calendar._init = function(cfg){
        var self = this,
            data =cfg.data,
            currentDate = cfg.date?[cfg.date]:[],
            afterRender;
        if(cfg.tabData && cfg.tabData.length > 0){
            afterRender = function(wrapper){
                cfg.afterRender && cfg.afterRender.call(self,data);
                self.tabRender.call(self,wrapper,cfg.tabData);
            }
        }
        calendar({
            currentDate: currentDate,
            startDate: cfg.startDate,
            endDate: cfg.endDate,
            fn: function (dates,price,el) {
                //如果回调函数返回为真,则不进入后退逻辑
                var ret = calendar.callback && calendar.callback.call(this,dates,price,el);
                if(ret !== true){
                    Common.backPage();
                }

            },
            // classArr可以插入"disabled"
            buildContent: self.build,
            data: data,
            model: cfg.model,
            afterRender: afterRender
        });
    };
    calendar.dealTabData = function(data){
        if(data){
            var year = data[0].Year-0,
                month = data[0].Month-0,
                index = 0,
                useIndex = false,
                _data = [];
            var _item;
            if(data.length <1){
                return _data;
            }
            do{
                if(year === data[0].Year-0 && month === data[0].Month-0){
                    _item = data.shift();
                    _data.push(_item);
                    if(_item.LowerPriceDescribe !== "团期全满" && !useIndex){
                        _data.index = index;
                        useIndex = true;
                    }
                    index ++;
                }else{
                    _data.push({
                        Year: year,
                        Month: month,
                        LowerPrice: 0,
                        LowerPriceDescribe: "无团期"
                    })
                }
                month ++;
                if(month >12){
                    month = 1;
                    year ++;
                }
            }while(data.length > 0);
            return _data;
        }
    };
    calendar.tabRender = function(wrapper,data){
        var target = wrapper.find(".calendar"),
            tmplList = require("modules-touch/calendar/tmpl");
        if(!data){
            Monitor.log("lowestPrice不存在","calendar");
            return;
        }
        data = calendar.dealTabData(data);
        var tabHtml = tmplList.tab(data);
        target.children().eq(0).before(tabHtml);
        wrapper.addClass("tab-calendar-wrapper");
        var ulEl = $(".tablist-inner ul"),
            liEls = ulEl.find("li");
        var prevEl = $(".tablist-nav .prev"),
            nextEl = $(".tablist-nav .next");
        if(liEls.length <= 4){
            prevEl.addClass("disable");
            nextEl.addClass("disable");
        }
        require("modules-touch/swipe/index");
        require("modules-touch/swipe/tab");
        var tabWipe = ulEl.tabwipe({
            item:{
                number: 4
            },
            is_circle: false,
            center: false,
            callback : function(index,leftIndex){
                if(!leftIndex){
                    leftIndex = 0;
                }
                if(leftIndex === 0){
                    prevEl.addClass("disable");
                    if(leftIndex + 4 >= liEls.length){
                        nextEl.addClass("disable");
                    }else{
                        nextEl.removeClass("disable");
                    }
                }else if(leftIndex + 4 >= liEls.length){
                    prevEl.removeClass("disable");
                    nextEl.addClass("disable");
                }else{
                    prevEl.removeClass("disable");
                    nextEl.removeClass("disable");
                }

                //liEls.removeClass("selected");
                //liEls.eq(index).addClass("selected");
            },
            getDiff: function(){
                return 0;
            }
        });
        $(".tablist-nav span").on("click",function(){
            var self = $(this);
            if(self.hasClass("disable")){
                return;
            }
            if(self.hasClass("prev")){
                tabWipe.prev();
            }else{
                tabWipe.next();
            }
        });
        var calendarWipe = $(".calendar-list").tabwipe({
            is_circle: false,
            center: false,
            defaultIndex:data.index||0,
            getDiff: function(){
                return 0;
            },
            callback: function(index){
                tabWipe.move(index,true);
                liEls.removeClass("selected");
                liEls.eq(index).addClass("selected");
            }
        });
        liEls .on("click",function(e){
            var el = $(this);
            el.addClass("selected").siblings().removeClass("selected");
            var index = el.index();
            calendarWipe.move(index);
        });
    };
    /**
     * @prop {string} calendar.tmpl
     * @desc 日历模板
     * @type {string}
     */
    calendar.tmpl = '<div  data-daren="{DarenCoupon}"><span>{dateStr}</span><p>{priceStr}</p></div>';
    /**
     * @func calendar.build
     * @desc 日历的模板渲染
     * @param date Date 对应日期的date实例
     * @param dateStr String 需要在当前日期方格上放置的html结构
     * @param classArr 日期方格上的额外样式，比如disabled之类的
     * @param data 日历的数据
     * @returns {*}
     */
    calendar.build = function (date, dateStr, classArr, data) {
        var dateTime = date.getTime(),item,info,htmlStr;
        for(var i = 0,len = data.length -1; i<=len;i++){
            item = data[i];
            //这里获得的是8点的毫秒数
            var _date = Date.parse(item.date);
            if(_date>= dateTime && _date < dateTime+1000*60*60*24){
                info = item;
                break;
            }
        }
        if(!info) {info = {};}
        info.dateStr = (dateStr ? dateStr : date.getDate());
        if (!info.price) {
            if(data.length > 0){
                classArr.push("disabled");
            }
            htmlStr = info.dateStr;
        } else {
            //如果residual＜0,即满团或者停团,则显示仓位状态,不显示价格
            if(info.residual < 0){
                classArr.push("disabled");
                info.priceStr = "<b>"+info.residualDesc+"</b>";
            }else{
                info.priceStr = "<label>￥</label><b>"+info.price+"</b>";
            }
            htmlStr = calendar.tmpl.replace(/{(\w+)}/g,function($0,$1){
                return info[$1];
            });
        }
        return htmlStr;
    };
    /**
     * 将日历
     * @param dataArr
     * @returns {Array}
     */
    calendar.parse = function(dataArr){
        var tmpArr = [] ,item,date,_arr;

        for(var i in dataArr){
            item = dataArr[i];
            date = item.date;
            if(!date.match(/\d{4}-\d{1,2}-\d{1,2}/)){
                continue;
            }
            var tmp = {};
            tmp.qrydate = date;
            _arr = date.split("-");
            tmp.year = _arr[0]-0;
            tmp.month = _arr[1]-0;
            tmp.date = _arr[2]-0;
            tmp.price = item.price-0;
            tmpArr.push(tmp);
        }
        return tmpArr;
    };
    module.exports = calendar;
})();
