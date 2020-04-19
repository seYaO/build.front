/**
 * @author 黄凯(hk08688@ly.com)
 * @class  倒计时
 * @exports Timer
 * @description 倒计时模块
 * @example
 * //加载倒计时模块
 * //使用require加载
 * var Timer = require("timer/0.1.0/index"),
 * //或者在引入这个脚本后,使用TimerModule这个全局变量来引用
 * // var Timer = window.TimerModule
 * //获取倒计时放置的位置
 * $el = $(".test"),
 * //倒计时依赖的时间戳
 * //注意,这个时间戳是跟配置相对应的
 * //比如,有开始时间戳和结束时间戳
 * //那么,配置需要有3个:未开始,已开始,已结束
 * dateArr = [10000000,20000000],
 * //倒计时的配置
 * var cfg = [{
 *    "tmpl": '<p>距开始还有<span>{days}</span>天<span>{hour}</span>时<span>{minute}</span>分<span>{second}</span>秒</p>',
 *    "callback": function(el) {
 *        el.parent().parent().addClass("time-wait");
 *        $(".booking").addClass("disable");
 *    }
 * },{
 *    "tmpl": '<p>剩余<span>{days}</span>天<span>{hour}</span>时<span>{minute}</span>分<span>{second}</span>秒</p>',
 *    "callback": function(el){
 *        el.parent().parent().removeClass("time-wait");
 *        $(".booking").removeClass("disable");
 *    }
 * },{
 *    "tmpl": '<p>本次抢购结束</p>',
 *    "callback": function(el){
 *        el.parent().parent().addClass("time-end");
 *        $(".booking").addClass("disable");
 *    }
 * }];
 * Timer.init({
 *     el: $el,
 *     date: dateArr,
 *     cfg: cfg
 * });
 */
(function($){
    var HOURSEC = 3600 * 1000,
        HOURMINU = 60 * 1000,
        DAYSEC = 24 * HOURSEC,
        serverTimeUrl = '//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue',
        instArr = [];

    /**
     * @class Timer
     * @constructor
     */
    function Timer() { }

    Timer.prototype = {
        constructor: "Timer",
        step: 1000,
        /**
         * private
         * @func timered
         * @desc 核心函数,计时器
         * @param {function} callback 回调方法
         */
        timered: function (callback) {
            ///<summary> 计时器
            ///<para> callback fn 回调函数 </para>
            ///</summary>
            var self = this;

            this.timer = setTimeout(function () {
                clearTimeout(self.timer);
                if(!callback()){
                    self.timered(callback);
                }

            }, this.realStep);

        },

        mend: function (value) {
            return value.toString().length === 1 ? "0" + value : ""+value;
        },
        /**
         * @func countdown
         * @desc 倒计时触发
         * @param {element} el 倒计时放置的位子
         * @param {array} dateStr 开始和结束的时间戳等
         * @param {object} cfg 倒计时的文案和回调配置
         */
        countdown: function(el,dateStr,cfg) {

            var self = this;
            Timer.getServerTime(function(nowTime){
                self.start(el,0,dateStr,cfg,nowTime);
            });

        },
        start: function(el,ind,dateStr,cfg,now,attr,mock){
            var self = this,
                _index = dateStr.length,
                _len = _index - 1,
                diff,
                _mockId_ = 0,
                _lastMockId_ = 0,
                html;
            if(attr){
                if(!el.attr(attr)){
                    return;
                }
                el.removeAttr(attr);
            }
            self.nextTime = +new Date();
            if(!self.realStep){
                self.realStep = self.step;
            }
            if(mock){
                now = dateStr[0]-10000;
            }
            self.timered(function(){
                diff = 0;
                var index = _index,
                    ret,
                    step = self.step;
                now += step;
                Timer.__client_time__ = now;
                // 计算新时间，调整diff
                var _d = +new Date() - self.nextTime,
                    count = 1 + Math.round(_d / step);
                self.realStep = step - _d % step;
                self.nextTime += step * count;
                for(var i = 0;i<=_len;i++){
                    if(now<dateStr[i]){
                        index = i;
                        diff = dateStr[i] - now;
                        break;
                    }
                }
                var _cfg = cfg[index];
                if(diff>0){
                    var _diff = diff;
                    if(mock && _mockId_ !== _lastMockId_){
                        _lastMockId_ = _mockId_;
                    }
                    if(self.lastIndex!==index){

                        ret = _cfg.callback && _cfg.callback.call(self,el,ind);
                        if(mock && self.lastIndex!==undefined){
                            _mockId_ ++;
                            now = dateStr[_mockId_]-10000;
                        }
                        var _el = ret;
                        if(ret && ret.el){
                            _el = ret.el;
                        }
                        if(_el && _el.length >0){
                            el = _el;
                        }
                        self.__ret__ = ret;
                    }
                    //根据配置里返回的数据来处理时间
                    //主要针对有特殊状态的逻辑,比如结束前2小时这种类型状态
                    var thisRet = self.__ret__;
                    if(thisRet && thisRet.diff){
                        _diff = diff+thisRet.diff;
                    }

                    var d = self.getLastTime(_diff);
                    html = _cfg.tmpl.replace(/{(\w+)}/g,function($0,$1){
                        return  d[$1];
                    });
                }else{
                    html = _cfg.tmpl;
                    if(self.lastIndex === index){
                        return;
                    }
                    el[0].innerHTML = html;
                    self.lastIndex = index;
                    ret = _cfg.callback && _cfg.callback.call(self,el,ind);
                    el = (ret && ret.length >0)?ret: el;
                    return ret;
                }
                self.lastIndex = index;

                el[0].innerHTML = html;
            });
        },
        /**
         * @private
         * @func getLastTime
         * @desc 获取倒计时的时间
         * @param nS
         * @returns {{days: number, hour: *, minute: *, second: *}}
         */
        getLastTime: function (nS) {
            ///<summary> 获取倒计时时间(注：只对小于等于24小时进行计算)
            ///<para> nS string 传入的时间戳 </para>
            ///</summary>

            var leave1, leave2, leave3,leave4,
                days, hours, minutes, seconds;

            // 计算出相差天数
            days = Math.floor(nS / DAYSEC);
            if (days < 0) { days = 0; }

            //计算出小时数
            leave1 = nS % DAYSEC; //计算天数后剩余的毫秒数
            hours = Math.floor(leave1 / HOURSEC);
            if (hours < 0) { hours = 0; }

            //计算相差分钟数
            leave2 = leave1 % HOURSEC; //计算小时数后剩余的毫秒数
            minutes = Math.floor(leave2 / HOURMINU);
            if (minutes < 0) { minutes = 0; }

            //计算相差秒数
            leave3 = leave2 % HOURMINU; //计算分钟数后剩余的毫秒数
            seconds = Math.floor(leave3 / 1000);

            leave4 = leave3 % 1000;
            var ms = Math.floor(leave4/this.step);
            var hour = this.mend(hours),
                minute = this.mend(minutes),
                second = this.mend(seconds),
                fullhours =  days * 24 +hours;
            var defaultCfg = {
                DAYS:  this.mend(days),
                fullhours: fullhours,
                days: days,
                hour: hour,
                h0: hour.charAt(0),
                h1: hour.charAt(1),
                minute: minute,
                m0: minute.charAt(0),
                m1: minute.charAt(1),
                second: second,
                s0: second.charAt(0),
                s1: second.charAt(1),
                ms: ms
            };
            return $.extend(defaultCfg,Timer.tmpl);
        }
    };
    /**
     * @func getServerTime
     * @desc  获取服务器时间
     * @param callback
     */
    Timer.getServerTime= function(callback){
        var self = this;
        if(self.__server_time__!==undefined||this.serverTime===false){
            var now = self.__client_time__||new Date().getTime();
            callback.call(this,now);
            return;
        }
        var startTime = new Date().getTime(),
            timeUrl = serverTimeUrl+"&t="+Math.random();
        $.ajax({
            type: "GET",
            url:timeUrl,
            dataType: "jsonp",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(date){
                var retTime = new Date(date.totalseconds.replace(/\-/gi, "/")||null).getTime(),
                    timeDiff = retTime - startTime;
                self.__server_time__ = retTime;
                self.__diff_time__ = timeDiff;
                self.__client_time__ = new Date().getTime() + timeDiff;
                callback.call(this,self.__client_time__);
            },
            error: function(){
                self.__client_time__ = new Date().getTime();
                callback.call(this,self.__client_time__);
            }
        });
    };
    Timer._pushRepeatDate = function(param,arr,repeatIndex,now){
        var repeatCfg = param.cfg[repeatIndex];
        if(repeatIndex === 0 || repeatIndex === (arr.length -1)){
            window.console && console.log("$repeat不能放在第一个或者最后一个");
            return;
        }
        //用来跟repeatIndex对比判断,当前是否已经在repeat活动时间
        if(now >= arr[repeatIndex+1]){
            //如果已经大于repeat活动时间
            //splice掉占位符
            arr.splice(repeatIndex,1);
        }else{
            var repeatStart,repeatDate,
            //循环结束的时间
                repeatEndDate = arr[repeatIndex+1];
            if(now >= arr[repeatIndex-1]){
                //如果已经在repeat活动时间
                var diffTime = repeatEndDate - now;
                if(arr)
                    repeatStart = now;
            }else{
                var _repeat = arr[repeatIndex];
                if(typeof _repeat === "object"){
                    repeatStart = now;
                }else{
                    repeatStart = _repeat;
                }
            }
            var repeatStartDate = new Date(repeatStart);
            repeatDate = arr[repeatIndex];
            var cfgReplaceArr = [],
                dateReplaceArr = [];
            for(var i = 0; i <=2; i++){
                for(var n = 0, nLen = repeatDate.length -1; n<=nLen;n++){
                    var _time = repeatDate[n].split(":");
                    repeatStartDate.setHours(_time[0]||"00");
                    repeatStartDate.setMinutes(_time[1]||"00");
                    repeatStartDate.setSeconds(_time[2]||"00");
                    var _pushDate = +repeatStartDate;
                    if(_pushDate < repeatEndDate){
                        cfgReplaceArr.push(repeatCfg[n]);
                        dateReplaceArr.push(_pushDate);
                    }

                }
            }
            //需要替换的位置
            var _replaceArr = [1,1];
            Array.prototype.splice.apply(param.cfg,_replaceArr.concat(cfgReplaceArr));
            Array.prototype.splice.apply(arr,_replaceArr.concat(dateReplaceArr));
        }
    };
    Timer.dealRepeat = function(arr,param,now){
        var self = this;
        var dateItem,repeatIndex;
        //获取当前时间
        for(var i = 0, len = arr.length -1; i<=len; i++){
            dateItem = arr[i];
            if(typeof(dateItem) === "number"){
                continue;
            }
            if(typeof dateItem === "object"){
                repeatIndex = i;
                continue;
            }
            //如果是数组
            if(dateItem[0] === "["){
                arr[i] = eval(dateItem);
                repeatIndex = i;
                continue;
            }
            switch(dateItem){
                case "$now": arr[i] = now;break;
                default: {
                    if(dateItem.indexOf(":")>-1){
                        arr[i] = +new Date(dateItem.replace(/-/g,'/'));
                    }
                };
            }
        }
        //如果存在repeat占位符
        if(repeatIndex != null){
            self._pushRepeatDate(param,arr,repeatIndex,now);
        }
        return arr;
    };
    /**
     * @func init
     * @param param {object}
     * @param param.el {string} 倒计时所在的选择器
     * @param [param.date] {array} 倒计时使用的时间分段数组,也可以使用节点上的data-time来传参数,如data-time="12312312312|33333333"
     * @param param.cfg {array} 倒计时使用的模板和回调数据
     * @param [param.serverTime=true] {boolean} 是否使用服务器时间
     * @example
     * Timer.init({
     *      cfg: cfg,
     *      el: sel,
     *      attr: attr||"data-load",
     *      empty: type
     *      });
     */
    Timer.init = function(param){
        var self = this,
            $el = $(param.el),
            len = $el.length,
            cfg = param.cfg,
            attr = param.attr,
            empty = param.empty,
            mock = param.mock,
            afterFunc = param.afterFunc;
        self.serverTime = param.serverTime;
        //请求服务器时间
        self.getServerTime(function(diff){
            if(afterFunc){
                afterFunc.call(this);
            }
            if(empty && instArr.length >0){
                for(var n = 0, nLen = instArr.length -1; n <= nLen; n++){
                    window.clearTimeout(instArr[n].timer);
                }
            }
            for (var i = 0; i < len; i++) {
                (function (el,index,paramCfg) {
                    var date = param.date;
                    if(!date){
                        var dataTime = el.attr("data-time");
                        if(dataTime){
                            date = dataTime.split("|");
                        }
                    }
                    if(!el.attr("data-time-loaded")){
                        var _paramCfg = [].concat(paramCfg),
                            defaultParam = $.extend({},param);
                        defaultParam.cfg = _paramCfg;
                        date = self.dealRepeat(date,defaultParam,diff);
                        var _timer = new Timer();
                        _timer.start(el,index,date,defaultParam.cfg,diff,attr,mock);
                        instArr.push(_timer);
                        el.attr("data-time-loaded","true");
                    }
                })($el.eq(i),i,cfg);
            }
        });
    };

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = Timer;
    } else {
        window.TimerModule = Timer;
    }
}(jQuery));
