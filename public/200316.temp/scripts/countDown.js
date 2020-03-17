/**
 * 抢购倒计时
 */
window.utils.countDown2 = function () {
    this.myTimer = null; // 内部参数，无需传值
    this.nowTime = null; // 开始时间，可以为空，获取本机时间
    this.overTime = null; // 抢购结束时间
    this.beforeTime = null; // 抢购开始时间 非必填
    this.runFun = function () { }; // 倒计时主函数
    this.beforFun = function () { }; // 抢购开始回调函数
    this.backFun = function () { }; // 抢购结束回调函数
    this.timeGo = 0; /*保存倒计时从开始到结束，一共执行了多少秒*/
    this.close = false;
}
window.utils.countDown2.prototype = {
    formatNum: function (num) {
        num = num < 10 ? "0" + num : num;
        return num;
    },
    getDayLength: function (starTime, endTime) {
        var startDate = starTime ? new Date(starTime) : (this.nowTime ? new Date(this.nowTime) : new Date());
        var endDate = endTime ? new Date(endTime) : new Date(this.overTime);
        return endDate.getTime() - startDate.getTime();
    },
    getDayNum: function (newTime) {
        var timeLength = typeof (newTime) != 'undefined' ? newTime : this.getDayLength();
        var dayNum = Math.floor(timeLength / 1000 / 60 / 60 / 24);
        var hourNum = Math.floor(timeLength / 1000 / 60 / 60 % 24);
        var mintNum = Math.floor(timeLength / 1000 / 60 % 60);
        var secdNum = Math.floor(timeLength / 1000 % 60);
        return [this.formatNum(dayNum), this.formatNum(hourNum), this.formatNum(mintNum), this.formatNum(secdNum)];
    },
    closeFun: function () {
        clearTimeout(this.myTimer);
        this.myTimer = null;
    },
    mainFun: function () {
        var timeNums = this.getDayLength(); //抢购结束时间 - 当前时间
        var beginNums = this.getDayLength(this.beforeTime); //抢购结束时间 - 抢购开始时间
        var nowNums = this.getDayLength(this.nowTime, this.beforeTime); //抢购开始时间 - 当前时间

        var that = this;
        if (that.myTimer) {
            clearTimeout(that.myTimer);
            that.myTimer = null;
        }

        (function () {
            that.timeGo += 1000;
            //当前已结束
            if (timeNums <= 0) {
                clearTimeout(that.myTimer);
                that.myTimer = null;
                that.backFun(that.getDayNum(timeNums));
            } else {
                //正在抢购中
                if (timeNums <= beginNums) {
                    that.runFun(that.getDayNum(timeNums));
                    timeNums -= 1000;
                }
                //抢购前
                else {
                    //that.beforFun(that.getDayNum(beginNums));
                    that.beforFun(that.getDayNum(nowNums));
                    timeNums -= 1000;
                    nowNums -= 1000;

                    //抢购前的倒计时中，再倒计时：
                    if (nowNums < 0) {
                        that.runFun(that.getDayNum(timeNums));
                        timeNums -= 1000;
                    }
                }
                that.myTimer = setTimeout(arguments.callee, 1000);
            }
        })();
    }
}