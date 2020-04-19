/**
 * @author 黄凯(hk08688@ly.com)
 * @module  日历
 * @exports calendar
 * @description 日历模块
 * @example
 * //加载日历模块
 * var Calendar = require("/modules-lite/calendar/index");
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
    var calendar = require("/modules-lite/calendar/0.2.0/cal"),
        Common = require("/modules-lite/common/index");
    var Calendar = function(){}
    /**
     * @func init
     * @desc 日历组件初始化
     * @param cfg 配置
     */
    Calendar.prototype.init = function(cfg){
        var self = this,
            data =cfg.data,
        //"/modules/calendar/calendar.json"
              tag = cfg.tag,
            url = cfg.url;
        !self[tag] && (self[tag] = {});
        //if(!self[tag].isInited){  //如果每次都需要重绘价格日历
        if(true){
            if(url && !(data&&cfg.tabData)){
                Common.getData(url, function(data){
                    if(data){
                        var defaultCfg = {
                            data: data.Data,
                            tab: true
                        };
                        var _cfg = $.extend(defaultCfg,cfg);
                        if(_cfg.tab){
                            _cfg.tabData = data.LowestPrice
                        }
                        self._init(_cfg);
                    }
                },true);
            }else{
                self._init(cfg);
            }
            self[tag].isInited = true;
        }else{
            cfg && cfg.afterRender &&cfg.afterRender.call(self);
        }
    };
    Calendar.prototype._init = function(cfg){
        var self = this,
            afterRender,
            currentDate = cfg.date?[cfg.date]:[];
        afterRender = function(wrapper){
            cfg.afterRender && cfg.afterRender.call(self,wrapper);
            if(cfg.tabData && cfg.tabData.length > 0){
                self.tabRender.call(self,wrapper,cfg.tabData);
            }
        };
        calendar({
            currentDate: currentDate,
            startDate: cfg.startDate,
            endDate: cfg.endDate,
            fn: function (dates,price,el) {
                //如果回调函数返回为真,则不进入后退逻辑
                var ret = self.callback && self.callback.call(this,dates,price,el);
                if(ret !== true && (!cfg.noSwitch)){
                    history.go(-1);
                }
            },
            // classArr可以插入"disabled"
            buildContent: self.build,
            data: cfg.data,
            name: cfg.name,
            model: cfg.model,
            dec:cfg.dec,
            afterRender: afterRender
        });
    };
    Calendar.prototype.dealTabData = function(data){
        if(data){
            var year = data[0].Year-0,
                month = data[0].Month-0,
                _data = [];
            _data.push(data.shift());
            if(data.length <1){
                return _data;
            }
            do{
                month ++;
                if(month >12){
                    month = 1;
                    year ++;
                }
                if(year === data[0].Year-0 && month === data[0].Month-0){
                    _data.push(data.shift());
                }else{
                    _data.push({
                        Year: year,
                        Month: month,
                        LowerPrice: 0,
                        ResidualDesc: "无团期"
                    })
                }

            }while(data.length > 0);
            return _data;
        }
    };
    Calendar.prototype.tabRender = function(wrapper,data){
        var target = wrapper.find(".calendar"),
            tmplList = require("/modules-lite/calendar/tmpl");
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
        require("/modules-lite/swipe/index");
        require("/modules-lite/swipe/tab");
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
     * @func getAjaxObj
     * @desc 获取ajax对象,慎用
     * @param {string} url 异步请求的url
     * @returns {*}
     */
    Calendar.prototype.getAjaxObj = function(url){
        var self = this;
        if(!url) {
            return null;
        }
        return {
            url: url,
            dataType: "jsonp",
            success: function (data) {
                if(self.dealData) {
                    data = self.dealData(data);
                }
                return data;
            }
        };
    };
    /**
     * @prop {string} calendar.tmpl
     * @desc 日历模板
     * @type {string}
     */
    Calendar.tmpl = '<div><span>{dateStr}</span><p>{priceStr}</p></div>';
    /**
     * @func calendar.build
     * @desc 日历的模板渲染
     * @param date Date 对应日期的date实例
     * @param dateStr String 需要在当前日期方格上放置的html结构
     * @param classArr 日期方格上的额外样式，比如disabled之类的
     * @param data 日历的数据
     * @returns {*}
     */
    Calendar.prototype.build = function (date, dateStr, classArr, data) {
        var dateTime = date.getTime(),item,info,htmlStr;
        for(var i = 0,len = data.length -1; i<=len;i++){
            item = data[i];
            //这里获得的是8点的毫秒数
            var _date = Date.parse(item.Date);
            if(_date>= dateTime && _date < dateTime+1000*60*60*24){
                info = item;
                break;
            }
        }
        if(!info) {info = {};}
        info.dateStr = (dateStr ? dateStr : date.getDate());
        if (!info.Price) {
            if(data.length > 0){
                classArr.push("disabled");
            }
            htmlStr = info.dateStr;
        } else {
            //如果residual＜0,即满团或者停团,则显示仓位状态,不显示价格
            if(info.ResidualDesc < 0){
                classArr.push("disabled");
                info.priceStr = "<b>"+info.ResidualDesc+"</b>";
            }else{
                info.priceStr = "<list>￥</list><b>"+info.Price+"</b>";
            }
            htmlStr = Calendar.tmpl.replace(/{(\w+)}/g,function($0,$1){
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
    Calendar.prototype.parse = function(dataArr){
        var tmpArr = [] ,item,date,_arr;

        for(var i in dataArr){
            item = dataArr[i];
            date = item.Date;
            if(!date.match(/\d{4}-\d{1,2}-\d{1,2}/)){
                continue;
            }
            var tmp = {};
            tmp.qrydate = date;
            _arr = date.split("-");
            tmp.year = _arr[0]-0;
            tmp.month = _arr[1]-0;
            tmp.Date = _arr[2]-0;
            tmp.price = item.Price-0;
            tmpArr.push(tmp);
        }
        return tmpArr;
    };
    module.exports = Calendar;
})();
