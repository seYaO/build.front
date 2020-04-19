define("calendar/0.3.0/index", ["calendar/0.3.0/comcal", "calendar/0.3.0/index.css"], function(require, exports, module) {
    var ComCal = require("calendar/0.3.0/comcal");
    var calendar = {};
    (function() {
        var $ = jQuery;
        var calendarData;

        /**
         * 由于出境自由行终页和跟团终页用的是统一组件，产品同事的需求要求跟团呈现行程，自由行不呈现，所以取一下页面的线路属性，有点坑
         */
        var lineProperty = $("#LineProperty").val()||"";

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
        calendar.getNowMonth = function() {
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
        calendar.build = function(td, date, dateStr, data, currDate) {
            var dateTime = date.getTime(),
                item, info, htmlStr, htmlStrTmpl = "",editionStr="",
                place, classArr = [],
                residualTmpl = "";
            for (var i = 0, len = data.length - 1; i <= len; i++) {
                var item = data[i],
                    place = item.IsEnsureGroup;
                //这里获得的是8点的毫秒数
                var _date = Date.parse(item.Date.replace(/\-/gi, "/").slice(0, 10));
                if (currDate) {
                    var _currDate = Date.parse(currDate.replace(/\-/gi, "/"));
                }
                if (_date >= dateTime && _date < dateTime + 1000 * 60 * 60 * 24) {
                    info = item;
                    if (_date === _currDate) {
                        info.isCurrent = true;
                    } else {
                        info.isCurrent = false;
                    }
                    break;
                }
            }

            if (!info) {
                info = {};
            }
            info.dateStr = (dateStr ? dateStr : date.getDate());
            if (info.isCurrent) {
                classArr.push("current-day");
            }
            if (!info.Price) {
                //classArr.push("invalid-day");
                classArr.push("not-this-day");
                classArr.push("invalid-day");

            } else {
                //如果residualCount＜0,即满团或者停团,则显示仓位状态,不显示价格
                if (info.ResidualCount == 0) {
                    classArr.push("over");
                    residualTmpl = "";
                } else if (info.ResidualCount < 0) {
                    classArr.push("invalid-day");
                    residualTmpl = "满团";
                } else if (info.ResidualCount > 0 && info.ResidualCount <= 10) {
                    classArr.push("over");
                    residualTmpl = place ? ("成团余位" + info.ResidualCount) : ("余位" + info.ResidualCount);
                } else {
                    classArr.push("enough");
                    residualTmpl = place ? "成团充足" : "充足";
                }
                info.priceStr = "¥" + info.Price;
            }
            //判断是否有立减的icon，如果只存在早订惠时显示早订惠的icon
            //判断是否是主题游
            //if(parseInt($("#isTheme").val()) !== 1){
            if (info && info.HasPreferential || (info.HasPreferential && info.IsZaoDingHui)) {
                var preferentialArr = [];
                info.Preferential.forEach(function(val) {
                    preferentialArr.push(val.IconName);
                });
                info.iconDiscount = '<span class="icon-discount" tracktype="hover" trackspot="价格日历^' + preferentialArr.join(",") + '">减</span>';
            } else if (info.IsZaoDingHui) {
                info.iconDiscount = '<span class="icon-discount">早</span>';
            }
            //}

            //判断是什么行程版本(跟团呈现，自由行不呈现)
            if (info && info.Editions && (info.Editions instanceof Array)  && info.Editions.length>0) {
                if(lineProperty==="1"){
                    editionStr = info.Editions[0].Edition+"线";
                }   
            }
            htmlStrTmpl = this.tmpl.replace("{Edition}", editionStr);
            htmlStrTmpl = htmlStrTmpl.replace("{ResidualDes}", residualTmpl);
            htmlStr = htmlStrTmpl.replace(/{(\w+)}/g, function($0, $1) {
                return info[$1] || "";
            });
            td.innerHTML = htmlStr;
            $(td).addClass(classArr.join(" "));
        };
        /**
         * @desc 获取数据里最低的月份
         * @param data 数据
         * @returns {[]}  返回格式为数组["2015","6"]
         */
        calendar.getLowestMonth = function(data) {
            var lowestData = data.LowestPrice,
                tmp, month, year;
            for (var i = 0, len = lowestData.length - 1; i <= len; i++) {
                var item = lowestData[i];
                //如果LowestPrice为0,则为无团期
                if (!item.LowestPrice || item.LowerPriceDescribe === "团期全满") {
                    continue;
                }
                if (!tmp) {
                    tmp = item.LowestPrice;
                    month = item.Month;
                    year = item.Year || "2016";
                }
                if (item.LowestPrice < tmp) {
                    tmp = item.LowestPrice;
                    month = item.Month;
                    year = item.Year || "2016";
                }
            }
            return [year, month];
        };
        /**
         * @desc 获取数据里最低的月份
         * @param data 数据
         * @returns {[]}  返回格式为数组["2015","6"]
         */
        calendar.getNearestMonth = function(data) {
            var lowestData = data.LowestPrice,
                tmp, month, year;
            for (var i = 0, len = lowestData.length - 1; i <= len; i++) {
                var item = lowestData[i];
                //如果LowestPrice为0,则为无团期
                if (!item.LowestPrice || item.LowerPriceDescribe === "团期全满") {
                    continue;
                }
                if (!tmp) {
                    tmp = item.LowestPrice;
                    month = item.Month;
                    year = item.Year || "2016";
                }
            }
            return [year, month];
        };
        calendar.init = function(param) {
            var self = this;
            // 日历
            if (!param) {
                param = {};
            }
            $.extend(self, param);
            window.page_cf = calendarData = param.data || window.page_cf;
            var tripTime = param.tripTime;
            var activeDate;
            var currDate;
            if (!calendarData) {
                var now = new Date(),
                    year = now.getFullYear(),
                    month = now.getMonth() + 1;
                window.page_cf = calendarData = {};
                activeDate = [year, month];
            } else {
                if (param.activeDate) {
                    activeDate = param.activeDate;
                } else {
                    activeDate = self.getNearestMonth(calendarData);
                }

                if (param.currDate) {
                    currDate = param.currDate;
                }
            }
            self.inst = new ComCal({
                skin: "green",
                monthNum: 1,
                zIndex: 22,
                style: param.style || "show",
                wrapper: param.wrapper,
                elem: param.trigger, // 如果设置了elem的值，且elem参数为input框
                startDate: tripTime,
                mode: "rangeFrom",
                wrapperWidth: 558,
                panelWidth: 560,
                tab: true,
                showOtherDate: true,
                activeDate: activeDate,
                currDate: currDate,
                itemClick: function(y, m, d, elem, e) {
                    e.preventDefault();
                    currDate = y + '-' + m + '-' + d + " 0:00:00";
                    if (param.itemClick) {
                        param.itemClick.call(self, y, m, d, elem);
                    } else {
                        console.log("itemClick属性不存在!");
                    }
                },
                currentDate: [tripTime],
                buildContent: function(td, date, dateStr) {
                    self.build(td, date, dateStr, calendarData.PriceList, currDate);
                    self.changeBgNumber(parseInt(param.activeDate[1]));

                },
                afterRender: function() {
                    //如果afterRender返回真，那么flag为false，则重新执行initEv
                    //如果afterRender返回非真，那么flag=self.isRenderred
                    //param.isRendered返回真，为重新渲染日历
                    param.afterRender.apply(this, arguments);
                    var flag = !self.isRefresh && self.isRenderred;
                    self.isRefresh = false;
                    if (!flag) {
                        self.isRenderred = true;
                        initEv.call(self);
                    } else {
                        if (param.isRendered) {
                            param.isRendered = false;
                            initEv.call(self);
                        }
                    }
                }
            });
        };
        calendar.tmpl = '{iconDiscount}<span class="date">{dateStr}</span><div><span class="dataedition">{Edition}</span><span class="dataprace">{ResidualDes}</span><span class="dataprice">{priceStr}</span></div>';
        /**
         * @desc 将css文件动态插入到页面里
         * @param url css的url
         */
        calendar.addStyle = function(url) {
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
        calendar.getParamFromUrl = function(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results === null) {
                return null;
            } else {
                return results[1];
            }
        };
        /**
         * @desc 设置日历的背景月份
         * @param {number|Element} el 如果不是数字,则去对应的属性,然后给对应节点复制
         */
        calendar.changeBgNumber = function(el) {
            var dataMonth;
            if (typeof el === "number") {
                dataMonth = el;
            } else {
                dataMonth = el.getAttribute("data-month");
            }
            if (dataMonth) {
                $(".calendar-month-bg").html(dataMonth);
            }
        };

        function initEv() {
            var self = this;
            /* global calendar */
            function renderNav() {
                var prevBtn = $(".calendar-header .prev"),
                    nextBtn = $(".calendar-header .next");
                var parent = $(".calendar-header-inner ul"),
                    list = parent.find("li"),
                    liLen = list.length - 1,
                    liWidth = list.eq(0).width(),
                    parentLeft = parent.css("left"),
                    index = Math.round(parseInt(parentLeft) / liWidth);
                var liIndex = $(".calendar-header-inner .active").index();
                if (liIndex > 5) {
                    parent.css("left", -(liIndex - 5) * liWidth + "px");
                    index = -(liIndex - 5);
                }

                if (index >= 0) {
                    prevBtn.addClass("disable");
                }
                if (liLen + index <= 5) {
                    nextBtn.addClass("disable");
                }
                $(".calendar-header .prev,.calendar-header .next").on("click", function() {
                    var node = $(this),
                        isPrev = node.hasClass("prev");
                    if (self.isClickNav || node.hasClass("disable")) {
                        return;
                    }
                    self.isClickNav = true;
                    if (isPrev) {
                        if (index >= 0) {
                            return;
                        }
                        index++;
                    } else {
                        if (liLen + index < 6) {
                            return;
                        }
                        index--;
                    }
                    parent.css("left", liWidth * (index) + "px");
                    if (index >= 0) {
                        prevBtn.addClass("disable");
                    } else {
                        prevBtn.removeClass("disable");
                    }
                    if (liLen + index < 6) {
                        nextBtn.addClass("disable");
                    } else {
                        nextBtn.removeClass("disable");
                    }
                    self.isClickNav = false;
                });
            }
            renderNav();
            $(".calendar-header li").each(function(index, el) {
                var _node = $(el);
                _node.on("click", function() {
                    var me = _node,
                        month = me.attr("data-month") - 0,
                        year = me.attr("data-year") - 0;
                    if (me.hasClass("J_NoPrice")) {
                        return;
                    }
                    var calInst = self.inst;
                    calInst.update(year, month);
                    me.siblings().removeClass("active");
                    me.addClass("active");
                    $(".calendar-title h4 span").html(year + "年" + month + "月");
                    self.changeBgNumber(this);
                });
            });
        }
    }());
    return calendar;
});
