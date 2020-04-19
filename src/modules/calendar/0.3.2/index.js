/**
 * @desc:价格日历的联动
 * @author: Jilly
 * @mail: cjl10120@ly.com
 * @createTime: 2016/6/21 10:54
 * @version: 0.0.0
 */
define("calendar/0.3.2/index",["calendar/0.3.0/index", "calendar/0.3.1/index", "calendar/0.3.0/discount"], function (require, exports, module) {
    var Cal = require("calendar/0.3.0/index"),
        CalDiscount = require("calendar/0.3.0/discount"),
        PickCal = require("calendar/0.3.1/index");
    var Calendar = function () {

    };
    Calendar.prototype = {
        init: function (conf) {
            var self = this;
            var lowestDate = new Date(conf.calData.LowestDate.replace(/-/g,"/")),
                curMonth = lowestDate.getMonth() + 1,
                curYear = lowestDate.getFullYear(),
                curDate = conf.curDate||"";
            if(curDate){
                curMonth = curDate.split('-')[1];
            }
            self.initCalendar(conf,curDate,curYear,curMonth);
            self.initPickCalendar(conf,curDate);
        },
        /**
         * @desc 初始化呈现的价格日历
         * @param conf {object} 包含当前日期以及回调函数
         * @param curDate 当前点击日期
         * @param curYear 当前点击年份
         * @param curMonth 当前点击月份
         * @param isRendered 是否为重新渲染日历
         */
        initCalendar: function (conf,curDate,curYear,curMonth,isRendered) {
            var self = this,
                calData = conf.calData;
            Cal.init({
                data: calData,
                wrapper: $(".mCal"),
                currDate: curDate,
                activeDate: [curYear, curMonth],
                isRendered: isRendered,
                afterRender: function (wrapper) {
                    var calDiscount = new CalDiscount();
                    calDiscount.init({
                        wrapper: wrapper,
                        calendar: Cal,
                        calData: calData
                    });
                },
                itemClick: function (y, m, d, elem) {
                    $(".this-month-day").removeClass("selected-day").removeClass("current-day");
                    $(elem).addClass("selected-day");
                    var date = new Date(y, m - 1, d),
                        pickDate = y + '-' + m + '-' + d,
                        elemData,
                        ownPrice,
                        residualCount,
                        index = 0;
                    for (var i = 0; i < calData.PriceList.length; i++) {
                        var splitData = calData.PriceList[i].Date.split("T")[0];
                        var date1 = new Date(splitData.replace(/-/g, "/"));
                        if (date.getTime() == date1.getTime()) {
                            index = i;
                            break;
                        }
                    }
                    elemData = calData.PriceList[index].Prices;
                    ownPrice = calData.PriceList[index].Price;
                    // 注：终页切换价格日历，顶部的价格不变
                    // $(".declare-price.price strong").html(ownPrice);
                    $(".J_packagePrice").removeClass("none");
                    $(".mCal2").html("");
                    self.initPickCalendar(conf, pickDate);
                    //资源打包
                    residualCount = calData.PriceList[index].ResidualCount;
                    conf.callback && conf.callback(pickDate, elemData, residualCount);
                }
            });
        },
        initPickCalendar: function (conf, currentDate) {
            var self = this,
                calData = conf.calData;
            var startDate = "", endDate = "",startTime="" ,endTime="",startY = "",endY = "";
            if(calData && calData.LowestPrice.length>0){
                for(var i = 0;i<calData.LowestPrice.length;i++){
                    if(i == 0){
                        startTime  = calData.LowestPrice[i].Month;
                        startY = calData.LowestPrice[i].Year;
                    }
                    if(i == calData.LowestPrice.length -1){
                        endTime = calData.LowestPrice[i].Month;
                        endY = calData.LowestPrice[i].Year;
                    }
                }
            }
            if(startTime != "" && startY != "" ){
                startDate = new Date(startY,parseInt(startTime)-1,1);
            }
            if(endTime != "" && endY != ""){
                endDate = new Date(endY,parseInt(endTime),1);
            }
            //初始化日历
            PickCal.init({
                tab: false,
                monthNum: 2,
                wrapper: ".mCal2",
                skin: "white",
                data: calData,
                currentDate: currentDate,
                showPrice: false,
                showOtherDate: false,
                startDate:startDate,
                endDate:endDate,
                afterRender: function (wrapper) {
                    conf.afterRender&&conf.afterRender(calData);
                },
                itemClick: function (y, m, d, elem) {
                    $(".This-month-day").removeClass("from-day");
                    $(elem).addClass("from-day");
                    $(".mCal2").addClass("none");
                    var date = new Date(y, m - 1, d),
                        pickDate = y + '-' + m + '-' + d,
                        elemData,
                        ownPrice,
                        residualCount,
                        index = 0;
                    for (var i in calData.PriceList) {
                        var splitDate = calData.PriceList[i].Date.split("T")[0];
                        var priceDate = new Date(splitDate.replace(/-/g, "/"));
                        if (date.getTime() === priceDate.getTime()) {
                            index = i;
                            break;
                        }
                    }
                    $(".mCal").html("");
                    elemData = calData.PriceList[index].Prices;
                    ownPrice = calData.PriceList[index].Price;
                    $(".declare-price.price strong").html(ownPrice);
                    residualCount = calData.PriceList[index].ResidualCount;
                    conf.callback && conf.callback(pickDate, elemData, residualCount);
                    //$.extend(conf.calData,{currDate: pickDate},{});
                    var isRendered = true;
                    self.initCalendar(conf, pickDate, y, m, isRendered);
                }
            });
        }
    };
    module.exports = new Calendar();
});