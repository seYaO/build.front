require("./common.js");
    var calDetails = {
        init: function () {
            calDetails.BindMainCalOne();
        },

        BindMainCalOne: function () {

            $("#mainCal1").on("click", function () {
                if($(".productInfo").hasClass("current")){
                    $(".productInfo").removeClass("current");
                }
                if (pageConfig.curDateInputIndex == 1) {
                    return false;
                }
                var startDate = pageConfig.hidStartDate;//format(new Date($("#hidCurrentDate").val().replace(/-/g, "/")), 'yyyy-MM-dd');
                var endDate = pageConfig.hidEndDate;
                calDetails.TriggerMainCall.call($("#mainCal1"), 0, startDate, endDate);

            });

        },
        cal: new $.Calendar({
            skin: "green",
            wrapperWidth: (pageConfig.hidProductCategory == 92 ? 460 : 400),
            zIndex: 22,
            monthNum:(pageConfig.hidProductCategory == 92 ? 1 : 2),
            //monthNum:1,
            mode: "rangeFrom",
            offset:{top:9,left:3},
            fn: function (y, d, r) {
                Details.calCallback.call(this, y, d, r);
                pageConfig.hidCurrentDate = $(this.elem).val();
            },
            buildContent: function (td, date, dateStr, data) {
                var day = date.getDate();
                var str = dateStr || day;
                str = '<span class="d">' + str + '</span>';
                var dateFormatStr = Details.format(date, 'yyyy-MM-dd');
                var _class = "invalid-day";
                var data = calDetails.calData;
                if (data && data[dateFormatStr]) {
                    if (data[dateFormatStr].Price != "" && data[dateFormatStr].Price != undefined) {
                        _class = "price";

                        if (calDetails.currentDateNow == dateFormatStr && calDetails.index == 1) {
                            _class = _class + " from-day"
                        }
                        str = '<span class="d" style="line-height: 16px;">' + day + '<br><em style="color:#f60;">¥' + data[dateFormatStr].Price + '</em></span>';
                    };
                }
                td.innerHTML = str;
                $(td).addClass(_class);
            }
        }),
        showCalLoading: function (panel) {
            var loadingElem = $(".loading", panel);
            if (loadingElem.length) {
                loadingElem.css({
                    display: "block"
                });
            } else {
                $(panel).append('<div class="loading"></div>');
            }
        },
        TriggerMainCall: function (index, startDate, endDate) {

            if (index == 1) {
                var days = (Details.NewDate($("#mainCal2").val()) - Details.NewDate(startDate)) / (24 * 60 * 60 * 1000);
                if (days < 0) {
                    pageConfig.hidCurrentDate = startDate;
                    $("#mainCal2").val("");
                }
            };
            var daysTwo = (Details.NewDate(pageConfig.hidCurrentDate) - Details.NewDate(endDate)) / (24 * 60 * 60 * 1000);
            var chooseDate = $("#mainCal1").val();
            var curelem = index == 0 ? "#mainCal1" : "#mainCal2"; //点击后赋给哪个元素  //&& pageConfig.hidProductCategory == 92
            calDetails.currentDateNow = daysTwo > 0 ? endDate : pageConfig.hidCurrentDate;

            if (pageConfig.curDateInputIndex == index) {
                calDetails.cal.hide();
                $(".forHideShowHeight").animate({
                    height: '0px'
                }, 200);
                $(".txt").find(".i_arrow").removeClass("none");
                pageConfig.curDateInputIndex = -1;
                return false;
            }

            pageConfig.curDateInputIndex = index;
            $(".forHideShowHeight").animate({
                height: '400px'
            }, 200);
            $(".txt").find(".i_arrow").addClass("none");
            calDetails.cal.pick({
                elem: curelem,
                startDate: startDate,
                endDate: endDate,
                elems: $("html")
            });
            calDetails.showCalLoading(calDetails.cal.panel); // 需要手动显示日历的loading
            calDetails.loadAllCalData(index,function () {
                $('.loading', calDetails.cal.panel).css({ // 需要手动隐藏日历的loading
                    display: 'none'
                });
                calDetails.cal.update();
            });
        },

        loadAllCalData: function (index,fn) {

            var calendarUrlObj_wifi = {
                id: pageConfig.productId,
                acttype: pageConfig.acttype,
                supplyId: pageConfig.supplyId,
                resourceId: pageConfig.resourceId,
                chooseDate: $("#mainCal1").val(),
                minDay: pageConfig.minDay,
                maxDay: pageConfig.maxDay
            };
            var calendarUrlObj_single ={
                id: pageConfig.productId,
                acttype: pageConfig.acttype,
                supplyId: pageConfig.supplyId,
                resourceId: pageConfig.resourceId,
                minDay: pageConfig.minDay
            };

            var calendarUrlObj = index == 1 ? calendarUrlObj_wifi :calendarUrlObj_single;

            $.ajax({
                url: pageConfig.calendarUrl + Details.getParamStr.call(calendarUrlObj),
                dataType: "jsonp",
                success: function (data) {
                    calDetails.index = index;
                    if (index == 1) {
                        if (data.Data[Details.format(new Date(calDetails.currentDateNow), "yyyy-MM-dd")] == undefined) {
                            $("#mainCal2").val("");
                        } else {
                            $("#mainCal2").val(calDetails.currentDateNow);
                        }
                    } else {
                        pageConfig.FirstDatePriceObj = data.Data;
                    }

                    //pageConfig.FirstDatePriceObj = data;
                    calDetails.calData = data.Data;
                    fn();
                }
            });
        }
    };


    var mainCal1 = $("#mainCal1");
    calDetails.init();
    mainCal1.trigger('click');
