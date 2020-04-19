/*
 *倒计时
 */
! function(win, doc, $) {
    //倒计时通用
    function countDown(option) {
        var setOption = {
            //刷新时间间隔
            setUp: 1000,
            //时间长度
            microse: 3000,
            //更新方法
            updateFn: function(timeObj) {},
            //回调
            callBackFn: function() {}
        };
        $.extend(true, setOption, option);
        var eTime = new Date().getTime() + setOption.microse,
            destoryThisTimer = function() {
                if (interId) {
                    clearInterval(interId);
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                }
            },
            interId = setInterval(function() {
                var suT = eTime - new Date().getTime();
                if (suT <= 0) {
                    destoryThisTimer(); //clearInterval(interId);
                    suT = 0;
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                    setOption.callBackFn();
                    return false;
                }
                setOption.updateFn({
                    day: parseInt((suT / 1000 / 60 / 60 / 24), 10),
                    hour: parseInt((suT / 1000 / 60 / 60 % 24), 10),
                    minute: parseInt((suT / 1000 / 60 % 60), 10),
                    second: parseInt((suT / 1000 % 60), 10),
                    minsecond: parseInt((suT % 1000) / 100, 10),
                    microse: suT
                });
            }, setOption.setUp);
        return destoryThisTimer;
    }

    function startCountDown(option) {
        // if (!option || !isObject(option)) return false;
        var that = this,
            g = {
            	startTime : 0,
            	nowTime : 0,
            	endTime : 0,
            	updateFn : function(){},
            	nobeginFn: function(){},
	            ingFn: function(){},
	            endFn: function(){}
            },
            clearFn = function(){},
            countDownType = -1;
        $.extend(true, g, option);

        if (g.nowTime < g.startTime) { //未开始
            countDownType = -1;
            g.nobeginFn();
            clearFn = countDown({
                setUp: 300,
                microse: g.startTime - g.nowTime,
                updateFn: function(timeObj) {
                    g.updateFn(timeObj,countDownType)
                },
                callBackFn: function() {
                    countDownType = 1;
                    g.ingFn();
                    clearFn = countDown({
                        setUp: 300,
                        microse: g.endTime - g.startTime - 3000,
                        updateFn: function(timeObj) {
                            g.updateFn(timeObj,countDownType)
                        },
                        callBackFn: function() {
                            countDownType = 0;
                            g.endFn();
                        }
                    });
                }
            });

        } else if (g.nowTime >= g.startTime && g.nowTime < g.endTime) { //正在进行
            countDownType = 1;
            g.ingFn();
            clearFn = countDown({
                setUp: 300,
                microse: g.endTime - g.nowTime - 3000,
                updateFn: function(timeObj) {
                    g.updateFn(timeObj,countDownType)
                },
                callBackFn: function() {
                    countDownType = 0;
                    g.endFn();
                }
            });

        } else { //已结束
            countDownType = 0;
            g.endFn();
        }
        return clearFn;
    }

    function pcd(option) {
        var opt = {
            starTime: "",
            endTime: "",
            nowTime: "",
            updateFn: function() {},
            nobeginFn: function() {},
            ingFn: function() {},
            endFn: function() {}
        };
        $.extend(true, opt, option)

        function fn(opt) {
            // console.log(opt);
            var timerID = null;
            this.destory = startCountDown({
            	startTime : new Date(opt.starTime.replace(/-/g,"/")),
            	// nowTime : new Date(opt.nowTime.replace(/-/g,"/")),
            	endTime : new Date(opt.endTime.replace(/-/g,"/")),
                // startTime : new Date(opt.starTime),
            	nowTime : new Date(opt.nowTime),
            	// endTime : new Date(opt.endTime),
            	updateFn : opt.updateFn,
            	nobeginFn: opt.nobeginFn,
	            ingFn: opt.ingFn,
	            endFn: opt.endFn
            });
        }
        return new fn(opt);
    }
    module.exports = pcd;
}(window, document, jQuery);
