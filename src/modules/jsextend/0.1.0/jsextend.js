(function(module) {
    module.init();
    module.initJQuery();
})(function() {
    var jsextend = {};
    jsextend.init = function() {
        // #region Array

        /*
         * 1个参数表示值删除,两个参数表示区间
         */
        Array.prototype.remove = function(from, to) {
            if (arguments.length == 2) {
                var rest = this.slice((to || from) + 1 || this.length);
                this.length = from < 0 ? this.length + from : from;
                return this.push.apply(this, rest);
            }
            if (arguments.length == 1) {
                var numDeleteIndex = -1;
                var varElement = from;
                for (var i = (this.length - 1); i >= 0; i--) {
                    // 严格比较，即类型与数值必须同时相等。
                    if (this[i] == varElement) {
                        this.splice(i, 1);
                        numDeleteIndex = i;
                    }
                }
                return numDeleteIndex;
            }
        };
        Array.prototype.removeAt = function(num, returnnew) {
            if (returnnew) {
                return this.copy().splice(num, 1);
            } else {
                this.splice(num, 1);
            }
        };

        Array.prototype.contain = function(v) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === v) {
                    return true;
                }
            }
            return false;
        };
        Array.prototype.last = function() {
            if (this.length == 0) {
                return null;
            }
            return this[this.length - 1];
        }
        //深度复制(只复制一层)
        Array.prototype.copy = function() {
            var narr = new Array();
            for (var i = 0; i < this.length; i++) {
                narr.push(this[i]);
            }
            return narr;
        }

        // #endregion

        // #region Date

        Date.prototype.add = function(milliseconds) {
            var m = this.getTime() + milliseconds;
            return new Date(m);
        };
        Date.prototype.addSeconds = function(second) {
            return this.add(second * 1000);
        };
        Date.prototype.addMinutes = function(minute) {
            return this.addSeconds(minute * 60);
        };
        Date.prototype.addHours = function(hour) {
            return this.addMinutes(60 * hour);
        };
        Date.prototype.addDays = function(day) {
            return this.addHours(day * 24);
        };
        Date.isLeepYear = function(year) {
            return (year % 4 == 0 && year % 100 != 0)
        };
        Date.daysInMonth = function(year, month) {
            if (month == 2) {
                if (year % 4 == 0 && year % 100 != 0)
                    return 29;
                else
                    return 28;
            } else if ((month <= 7 && month % 2 == 1) || (month > 7 && month % 2 == 0))
                return 31;
            else
                return 30;
        };
        Date.prototype.addMonth = function(n) {
            if (n == undefined) {
                n = 1;
            }
            var mindate = new Date(this.getFullYear(), this.getMonth() + n, 1, this.getHours(), this.getMinutes(), this.getSeconds());
            var maxdate = new Date(this.getFullYear(), this.getMonth() + n, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
            if (maxdate.getMonth() == mindate.getMonth()) {
                //说明日期没超限
                return maxdate;
            } else {
                //超限则返回最大日期值
                return new Date(this.getFullYear(), this.getMonth() + n + 1, 0, this.getHours(), this.getMinutes(), this.getSeconds());
            }
        };
        Date.prototype.subMonth = function() {
            var m = this.getMonth();
            if (m == 0) return new Date(this.getFullYear() - 1, 12, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
            var day = this.getDate();
            var daysInPreviousMonth = Date.daysInMonth(this.getFullYear(), this.getMonth());
            if (day > daysInPreviousMonth) {
                day = daysInPreviousMonth;
            }
            return new Date(this.getFullYear(), this.getMonth() - 1, day, this.getHours(), this.getMinutes(), this.getSeconds());
        };
        Date.prototype.addYears = function(year) {
            return new Date(this.getFullYear() + year, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
        };
        Date.prototype.format = function(fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        // #endregion

        // #region Common
        var $fn = window.$fn = {};
        $fn.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return decodeURIComponent(r[2]);
            return null; //返回参数值
        }
        // #endregion

    }

    jsextend.initJQuery = function() {
        if ($) {
            //比较
            //isstrict 是否严谨模式
            $.compare = function(a, b, isstrict) {
                if (isstrict) {
                    return a === b;
                }
                if (a === b) {
                    return true
                }
                if (a == b) {
                    if ((a == 0 && b != "0") || (b == 0 && a != "0")) {
                        return false
                    } else {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    return jsextend;
}());