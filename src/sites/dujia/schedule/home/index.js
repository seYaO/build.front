var Schedule = function() {};
var Common = require("common/0.1.0/index"),
    dialog = require("dialog/0.2.0/dialog"),
    Cal = require("calendar/0.2.0/index");
var $dialog = new dialog({
    skin: 'default',
    template: {
        modal: {
            width: '300px',
            height: '150px'
        }
    }
});
var nameRule = /^[\u4e00-\u9fa5a-zA-Z]+$/;
var phoneRule = /^(13|14|15|17|18)[0-9]{9}$/;
var mailRule = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
Schedule.prototype = {
    init: function () {
        var self = this;
        self.changeUrl();
        self.initCalendar();
        self.initEvent();
    },
    initCalendar: function () {
        var o_startTime = $("#startTime");
        var o_endTime = $("#endTime");
        //var tmpl = '<a target="_blank" href="javascript:;"><span class="date">{dateStr}</span><div><span class="dataprace">{ResidualDesc}</span><span class="dataprice">{priceStr}</span></div></a>';
        var tmpl = '<span class="d">{dateStr}</span>';
        var self = this;
        var cal = new $.Calendar({
            skin: "white",
            width: 1000
        });
        var cal2 = new $.Calendar({
            skin: "white",
            width: 1000
        });
        var smallcal = -70;
        var nowtime = new Date();
        var _startime = nowtime;
        //var _endtime = nowtime;

        _startime.setDate(nowtime.getDate() + 1);
        //_endtime.setDate(nowtime.getDate() + 2);

        var startime = _startime.getFullYear() + "-" + (_startime.getMonth() + 1) + "-" + (_startime.getDate());
        //var endtime = _endtime.getFullYear() + "-" + (_endtime.getMonth() + 1) + "-" + (_endtime.getDate());


        o_startTime.val(startime);
        //o_endTime.val(startime);
        o_startTime.attr("attr-timeb", startime);
        o_startTime.on("focus", function () {
            var endtime = o_endTime.val() === "" ? "2020-12-12" : $("#endTime").val();
            cal.pick({
                elem: this,
                startDate: startime,
                endDate: endtime,
                mode: "rangeFrom",
                offset: {
                    left: smallcal
                },
                currentDate: [$("#startTime").attr("attr-timeb")],
                fn: function (year, month, day, td) {
                    cal2.pick({
                        elem: $("#endTime"),
                        mode: "rangeTo",
                        offset: {
                            left: -90
                        },
                        startDate: o_startTime.val() !== "" ? o_startTime.val() : o_startTime.attr("attr-timeb")
                    });
                }
            });
        });
        o_endTime.on("focus", function () {
            cal2.pick({
                elem: this,
                mode: "rangeTo",
                offset: {
                    left: smallcal
                },
                startDate: o_startTime.val() !== "" ? o_startTime.val() : o_startTime.attr("attr-timeb"),
                fn: function () {
                    $("#endTime").trigger("input");
                }
            });
        });
    },
    initEvent: function () {
        var self = this;
        $(".J_ScheduleBtn").on("click", function() {
            self.scheduleTab($(this));
            $(this).attr("href", "#write_info");
        });
        self.initInfoEve();
        self.initSpecialEve();
        self.initContactEve();
    },
    initInfoEve: function () {
        var self = this;
        $(".table-type").on("click", function() {
            self.scheduleTab($(this));
        });
        var leftBtn = $('.J_PickerLeftBtn'),
            rightBtn = $('.J_PickerRightBtn');
        leftBtn.on('click', function(e) {
            e.stopPropagation();
            var _this = $(this),
                coustInput = _this.siblings('.J_PickerInput');
            var value = parseInt(coustInput.val());
            if (!_this.hasClass('peopleNum-dispicker-leftBtn')) {
                value--;
                if ($(".J_PerType").hasClass("current") || coustInput.hasClass("J_PickerChild")) {
                    if ((value == 1 && !coustInput.hasClass("J_PickerChild")) || value == 0) {
                        _this.removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-dispicker-leftBtn');
                    }
                } else {
                    if (value == 10) {
                        _this.removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-dispicker-leftBtn');
                    }
                }
                $(coustInput).val(value);
            }
        });
        rightBtn.on('click', function(e) {
            e.stopPropagation();
            var _this = $(this),
                coustInput = _this.siblings('.J_PickerInput'),
                leftPicker = _this.parents(".peopleNum-picker").find(".J_PickerLeftBtn");
            var value = parseInt(coustInput.val());
            if (!_this.hasClass('peopleNum-dispicker-rightBtn')) {
                value++;
                if ($(".J_PerType").hasClass("current") && !coustInput.hasClass("J_PickerChild")) {
                    if (value > 1) {
                        leftPicker.removeClass('peopleNum-dispicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                    }
                } else if (coustInput.hasClass("J_PickerChild")) {
                    if (value > 0) {
                        leftPicker.removeClass('peopleNum-dispicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                    }
                } else {
                    if (value > 10) {
                        leftPicker.removeClass('peopleNum-dispicker-leftBtn').addClass('peopleNum-picker-leftBtn');
                    }
                }
                $(coustInput).val(value);
            }
        });
        var dayLeftBtn = $(".J_DayLeftBtn");
        dayLeftBtn.on('click', function(e) {
            e.stopPropagation();
            var _this = $(this),
                coustInput = _this.siblings('.J_PickerDays');
            var value = parseInt(coustInput.val());
            if (!_this.hasClass('days-dispicker-leftBtn')) {
                value--;
                if (value == 1) {
                    _this.removeClass('days-picker-leftBtn').addClass('days-dispicker-leftBtn');
                }
                $(coustInput).val(value);
            }
        });
        $(".J_DayRightBtn").on('click', function(e) {
            e.stopPropagation();
            var _this = $(this),
                coustInput = _this.siblings('.J_PickerDays');
            var value = parseInt(coustInput.val());
            if (!_this.hasClass('days-dispicker-rightBtn')) {
                value++;
                if (value > 1) {
                    dayLeftBtn.removeClass('days-dispicker-leftBtn').addClass('days-picker-leftBtn');
                }
                $(coustInput).val(value);
            }
        });
        $(".table-input").on("input onkeyup blur",function(){
            var _this = $(this);
            var searchBtn = $(".J_Next");
            /*
                判断页面输入框是否为空
                */
            if(!self.isNullFunc(".table-input", "J_Budget")){
                searchBtn.addClass("disabled");
            }else{
                var verifyStart = self.verifyFunc(nameRule, ".J_StartCity"),
                    verifyDest = self.verifyFunc(nameRule, ".J_DestCity");
                if (verifyStart && verifyDest) {
                    searchBtn.removeClass("disabled");
                } else {
                    searchBtn.addClass("disabled");
                }
            }
        });
        $(".J_Next").on("click", function () {
            var _this = $(this);
            if (_this.hasClass("disabled")) {
                return;
            }
            $(".team-table-content").addClass("none");
            $(".team-special-content").removeClass("none");
            $(".team-table-head").removeClass("team-table-info").addClass("team-table-special");
        });
        // 非空及输入验证
        $(".table-city, .table-link-input").on("focus", function(){
            $(this).parents(".table-info").removeClass("input-error");
        }).on("blur", function(){
            var verify = "";
            if (!$.trim($(this).val()) && !$(this).hasClass("J_Company")) {
                $(this).parents(".table-info").addClass("input-error");
                $(this).siblings(".error-tip").text($(this).attr("data-rq"));
                return;
            }
            if ($(this).hasClass("J_Phone")) {
                verify = phoneRule;
            } else if ($(this).hasClass("J_Mail")) {
                verify = mailRule;
            } else {
                verify = nameRule;
            }
            if (!self.verifyFunc(verify, this) && !$(this).hasClass("J_Company")) {
                $(this).parents(".table-info").addClass("input-error");
                $(this).siblings(".error-tip").text($(this).attr("data-error"));
            }
        });
    },
    initSpecialEve: function () {
        var themeHotel = $(".J_Company_Theme span, .J_Hotel_Info span"),
            themeNeed = $(".J_Person_Theme .table-check-desc, .J_OtherNeed .table-check-desc"),
            tableEl = $(".team-table-head");
        themeHotel.on("click", function() {
            $(this).siblings().removeClass("current");
            $(this).toggleClass("current");
        });
        themeNeed.on("click", function() {
            $(this).toggleClass("current");
        });
        $(".J_PreBtn").on("click", function () {
            $(".team-table-content").addClass("none");
            $(this).parents(".team-table-content").prev().removeClass("none");
            if (tableEl.hasClass("team-table-special")) {
                tableEl.removeClass("team-table-special").addClass("team-table-info");
            } else {
                tableEl.addClass("team-table-special").removeClass("team-table-contact");
            }
        });
        $(".J_NextBtn").on("click", function () {
            $(".team-table-content").addClass("none");
            $(".team-contact-content").removeClass("none");
            tableEl.removeClass("team-table-special").addClass("team-table-contact");
        });
    },
    initContactEve: function () {
        var self = this;
        $(".J_LinkTime span").on("click", function() {
            $(".J_LinkTime span").removeClass("current");
            $(this).addClass("current");
        });
        $(".table-link-input").on("input onkeyup blur",function(){
            var _this = $(this);
            var submitBtn = $(".J_SubmitBtn");
            /*
                判断页面输入框是否为空
                */
            if(!self.isNullFunc(".table-link-input", "J_Company")){
                submitBtn.addClass("disabled");
            }else{
                var verifyName = self.verifyFunc(nameRule, ".J_Name"),
                    verifyPhone = self.verifyFunc(phoneRule, ".J_Phone"),
                    verifyMail = self.verifyFunc(mailRule, ".J_Mail");
                if (verifyName && verifyPhone && verifyMail) {
                    submitBtn.removeClass("disabled");
                } else {
                    submitBtn.addClass("disabled");
                }
            }
        });
        $(".J_SubmitBtn").on("click", function () {
            var _this = $(this);
            if (_this.hasClass("disabled")) {
                return;
            }
            _this.addClass("disabled");
            var tourTheme = "", otherDemand = "", themeEl;
            // 出游主题
            var demandType = parseInt($(".table-type.current").attr("data-id")) || "";
            if (demandType === 2) {
                tourTheme = $(".J_Company_Theme .current").text();
            } else {
                themeEl = $(".J_Person_Theme .current");
                themeEl.each(function () {
                    tourTheme += $(this).text() + "、";
                });
                tourTheme = tourTheme.substring(0, tourTheme.length-1);
            }
            if (tourTheme) {
                tourTheme = "出游主题：" + tourTheme + ";";
            }
            // 其他需求
            $(".J_OtherNeed .current").each(function () {
                otherDemand += $(this).text() + "、";
            });
            otherDemand = otherDemand.substring(0, otherDemand.length-1);
            if (otherDemand) {
                otherDemand = "其他需求：" + otherDemand + ";";
            }
            // 联系时间
            var linkTime = "联系时间：" + $(".J_LinkTime .current").text() + ";";
            var note = $(".J_Note").val() ? "备注：" + $(".J_Note").val() : "";
            var param = {};
            param.StartCity = $(".J_StartCity").val() || "";       //出发城市 （必填）
            param.DestinationCity = $(".J_DestCity").val() || "";       //目的地城市 （必填）
            param.AdultNum = parseInt($(".J_PickerAdult").val()) > 0 ? parseInt($(".J_PickerAdult").val()) : 0;     //成人数（必填）
            param.ChildNum = parseInt($(".J_PickerChild").val()) >= 0 ? parseInt($(".J_PickerChild").val()) : 0;        //儿童数
            param.CustomerName = $(".J_Name").val() || "";    //联系人姓名（必填）
            param.CustomerMobile = $(".J_Phone").val() || "";       //联系人手机号 （必填） 
            param.PlayDays = parseInt($(".J_PickerDays").val()) || "";       //游玩天数 （必填）
            param.StartDate = $("#startTime").val() || "";     //出游日期 （必填）
            param.StartDateFrom = $("#startTime").val() || "";     //出发起始日期 （必填）
            param.StartDateTo = $("#endTime").val() || "";     //最晚出游日期 （必填）
            param.CustomerEmail = $(".J_Mail").val() || "";       //联系人邮箱（必填）
            param.Remark = tourTheme + otherDemand + linkTime + note;    //客户备注
            param.HotelType = parseInt($(".J_Hotel_Info .current").attr("data-id")) || "";     //住宿标准（0 未确认1 经济型酒店 2 准三星 3 挂三星 4 准四星 5 挂四星 6 准五星 7 挂五星 仅限出境：8 舒适 9 高档 10 豪华）
            param.DemandType = demandType || "";        //定制类型（1：个人定制，2：企业定制）（必填）
            param.TeamOrCompanyName = $(".J_Company").val() || "";     //企业名称
            param.FeeMax = Math.abs($(".J_Budget").val()) || "";    //人均预算最大值
            $.ajax({
                url: "/intervacation/api/ScheduleDemandAdd/",
                data: param,
                type: "post",
                dataType: "json",
                success: function (data) {
                    var dialogConfig = {};
                    if (data && data.Code == 4000 && data.Data.Success) {
                        dialogConfig = {
                            title: '',
                            content: '<div class="submit-tip">您的需求已提交，我们会在一到两个工作日内和您电话确认。</div>',
                            quickClose: false
                        };
                    } else {
                        _this.removeClass("disabled");
                        dialogConfig = {
                            title: '',
                            content: '<div class="submit-tip">您的需求单提交失败，请重新提交。<div>',
                            quickClose: false
                        };
                    }
                    $dialog.modal(dialogConfig);
                }
            });
        });
        $(document).on("click", ".close", function () {
            if ($(this).parents(".dialog_modal_gp").text() === "您的需求已提交，我们会在一到两个工作日内和您电话确认。") {
                window.location.reload();
            }
        })
    },
    isNullFunc:function(el, dom){
        var inputEle = $(el),
            isNull = true;
        inputEle.each(function(){
            if(isNull){
                if(!$(this).val() && !$(this).hasClass(dom)){
                    isNull = false;
                    return false;
                }
            }
        });
        return isNull;
    },
    verifyFunc: function (verifyRule, ele) {
        var isValid;
        if(!verifyRule.test($(ele).val())){
            isValid = false;
        }else{
            $(ele).parents(".table-info").removeClass("input-error");
            isValid = true;
        }
        return isValid;
    },
    scheduleTab: function (el) {
        $(".table-type").removeClass("current");
        $(".J_PickerAdult").siblings(".J_PickerLeftBtn").removeClass('peopleNum-picker-leftBtn').addClass('peopleNum-dispicker-leftBtn');
        if (el.text() == "公司定制") {
            $(".J_Table_Company, .J_Company_Theme").removeClass("none");
            $(".J_Person_Theme").addClass("none");
            $(".J_ComType").addClass("current");
            $(".J_PickerAdult").attr("min", 10).val(10);
        } else {
            $(".J_Table_Company, .J_Company_Theme").addClass("none");
            $(".J_Person_Theme").removeClass("none");
            $(".J_PerType").addClass("current");
            $(".J_PickerAdult").attr("min", 1).val(1);
        }
    },
    changeUrl: function () {
        var cityId = parseInt($("#hidCityId").val(), 10);
        if (cityId) {
            $(".team-table .team-list-url ").each(function () {
                var href = $(this).attr("href");
                href = href + "f" + cityId + "/";
                $(this).attr("href", href);
            });
        }
    }
}
module.exports = new Schedule();