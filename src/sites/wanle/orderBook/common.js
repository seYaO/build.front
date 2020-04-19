//var pageType = $("#hidProductType").val();
// if(pageType == 6){
//     require("./mempiaoOrder.js");
// }
// if(pageType == 8 || pageType == 11 || pageType == 12 || pageType == 13){
//     if($("#hidProductCategory").val() !== 8){
//         require("./wanleOrder.js");
//     }
// }
// if(pageType == 9){
//     require("./wifiOrder.js");
// }


var fx = window.location.href.indexOf('fx') > -1;
if (fx != "") {
    $("#ContactPerson").val("大度假平台前端范欣测试");
    $("#ContactMoblie").val("18961161866");
    $("#ContactMail").val("fx06698@ly.com");
}

//页面公共变量定义:
var preferentialTemp = require("./discountlist.dot");
var linkManTemp = require("./linkManlist.dot");
var passengerTemp = require("./passengerlist.dot");

var cacheBxChecked = true;   //记录上一次取消险状态

var today;
window.pageConfig = {
    // calendarUrl: window.__mod__ + '/wanle/AjaxHelperWanLe/GetLocalFunSingleProductCalendar?', // window.__mod__ + "/wanle/AjaxHelperWanLe/GetLocalFunSingleProductCalendar?",
    calendarUrl: 'http://www.ly.com/wanle/api/WanleProduct/GetLocalFunSingleProductCalendar?',
    // SingleProductPriceTypeUrl: window.__mod__ + "/wanle/AjaxHelperWanLe/GetSingleProductPriceType?",
    SingleProductPriceTypeUrl: "http://www.ly.com/wanle/api/WanleProduct/GetSingleProductPriceType?",
    hidActivityId: parseInt($("#hidActivityId").val()) || 0,
    hidProductType: $("#hidProductType").val(),
    hidProductCategory: $("#hidProductCategory").val(),
    hidStartDate: $("#hidStartDate").val().replace(/\//g, "-"),
    hidEndDate: $("#hidEndDate").val().replace(/\//g, "-"),
    productId: $("#hidProductId").val(),
    acttype: $("#hidActType").val(),
    supplyId: $("#hidSupplyId").val(),
    resourceId: $("#hidResourceId").val(),
    hidProductUnit:$("#hidProductUnit").val(),

    minDay: parseInt($("#hidOrderMinDay").val()) || 0,
    maxDay: parseInt($("#hidOrderMaxDay").val()) || 0,

    minOrderPerson: parseInt($("#hidOrderMin").val()) || 0,
    maxOrderPerson: parseInt($("#hidOrderMax").val()) || 0,

    hidWifiPackageDays: parseInt($("#hidWifiPackageDays").val()),

    hidCurrentDate: $("#hidStartDate").val().replace(/\//g, "-"),
    orderDayNum: 1, //预订天数
    curDateInputIndex: -1,

    BirthDayCal: new $.Calendar({
        skin: "white",
        isBigRange: true,
        showOtherMonth: false,
        monthNum: 1
    }),
    memberId: $("#MemberID").val(),

    vcTypeObj: JSON.parse($("#VisitorCertificateType").val()),
    vcType: _.pluck(JSON.parse($("#VisitorCertificateType").val()), 'CertName'),

    AllContactList: [],  //异步获取的所有常用联系人
    AddressList: [], //异步获取的 邮箱信息
    MainCallObjOne: new $.Calendar({
        open: true,
        skin: "white",
        width: 436,
        zIndex: 22,
        monthNum: 1
    }),
    MainCallObjTwo: new $.Calendar({
        open: true,
        skin: "white",
        width: 436,
        zIndex: 22,
        monthNum: 1
    }),
    ContactInfoField: $("#ContactInfoField").val() || 0,  //联系人需要的字段  名 1  手机号2  邮箱3
    ContactInfoNeed: $("#ContactInfoNeed").val() || 0,  //0不需要 1需要
    RemarkNeed: $("#RemarkNeed").val(),
    VisitorInfoNeed: $("#VisitorInfoNeed").val(), // 需要出游人数类型  0 不需要 1一单一人  2 一张/台一人
    Today: (today = new Date(), today.setHours(0), today.setMinutes(0, 0, 0), today),
    AllRuleList: [],
    AllRuleListDic: {},
    PreferentialRuleId: 0,
    PreferentialType: "",
    PreferentialSubOrderStr: '0-0-',
    FirstDatePriceObj: {}
};

var BillPostInfo = {};
$("#submits").on('click', function (e) {
    var b = Details.InputBeforeSubmitChk();
    if($("#areaId").length == 1 || $("#phone").length ==1){
        $("#areaId").focus();
        $("#areaId").blur();
        $("#phone").focus();
        $("#phone").blur();
        if((!$("#areaId").siblings("span").hasClass("none")) || (!$("#phone").siblings("span").hasClass("none"))){
            return false;
        }
    }
    var c = Details.agreement();     //检查是否勾选协议

    c && b && Details.submitBooking(e);
});

window.Details = {
    init: function () {
        Details.LoginShowOrHide();
        //Details.link_date();
        Details.BindMainTitleClick(); //主标题折叠效果
        Details.bindAddBtn(); //绑定加减号
        Details.checkSubOrAddBtnCanUse(); //加减少重新检查修改状态
        Details.BindKeyUp(); //文本框输入keyup事件.
        Details.BindGetOrReturnAdress(); //取还地址选中事件
        Details.moreAddress();//更多地址
        Details.BindGetDeposit(); //押金选中事件
        Details.BindInputValidate(); //姓名手机号邮箱等验证
        Details.BindRigtFixPostion(); //右部固定定位
        Details.BindBirthday();
        Details.AddSaveChoose(); //增加是否选中保存出游人
        Details.passengerIndex = $(".passenger-info-table").length;
        //清空所有input框里面的值
        $("#mail_place input").val("");
        $(".ui-input-mobile").val("");
        $(".passenger-info-table input").val("");

        $(".ui-input-first-name,.ui-input-last-name").val("须与证件上信息一致");
        if($("#ContactMail").val() != "请填写电子邮箱"){
            $("#ContactMail").css("color","#333");
        }
        if($("#ContactMoblie").val() != "请填写手机号码"){
            $("#ContactMoblie").css("color","#333");
        }
        if($("#ContactPerson").val() != "请填写联系人"){
            $("#ContactPerson").css("color","#333");
        }

        $(".tc_sale").removeClass("none");
        $(".fisrt_day").html($("#mainCal1").val());
        $(".end_day").html("归还日期");
        //点击查看全部显示所有常用旅客
        $(".player_list .look_all").on("click", function () {
            if ($(this).hasClass("look_all_up")) {
                $("#player_list").css("height", "auto");
                $(this).removeClass("look_all_up");
                $(this).addClass("look_all_down");
                $(this).siblings("i").removeClass("point_down");
                $(this).siblings("i").addClass("point_up");
            } else {
                $("#player_list").css("height", "18px");
                $(this).removeClass("look_all_down");
                $(this).addClass("look_all_up");
                $(this).siblings("i").removeClass("point_up");
                $(this).siblings("i").addClass("point_down");
            }
        });
        //人数input初始化
        $(".inputbox").attr("befor-time",$("#BookMin").html());
        $("#date_calendar").attr("befor-time",$("#BookMin").html());

       
        //问号提示信息
        Details.hoverHelp();
        //常用联系人 异步获取
        if (pageConfig.memberId != "" && pageConfig.memberId != "0" && pageConfig.memberId != 0) {
            Details.GetAllLinkManAjaxAndRenderPage();
        }
        //绑定新增按纽事件
        Details.BindAddLinkMan();
        //绑定移除联系人事件
        Details.BindRemoveLinkMan();
        //绑定清空联系人
        //Details.BindResetLinkMan();
        // 常用联系人勾选与去勾选
        Details.BindLinkManCheckBox();
        // 出游 人性别绑定
        Details.BindLinkManSexRadio();
        //出游人保存更新
        //Details.BindLinkManSaveOrUpdate();
        //邮寄人信息绑定
        if (pageConfig.memberId != "" && pageConfig.memberId != "0" && pageConfig.memberId != 0) {
            Details.BindPostInfoAjax();
        }
        Details.BindPostAddress();
        Details.postAnd_Linkuser();  //邮寄信息和联系人验证
        Details.BindDialogResetAndReLoad();  //弹层按纽事件
        Details.GetWanLePreferentialInfoAjaxAndRenderPage();
        Details.BindLogin();
        // Details.buildFee(); //计算费用
        Details.BillAction();
        Details.ClickBill();
        Details.BillBlur();
        Details.BillPostAddress();
        Details.KeepBillInfo();
        Details.OutPhone();
        Details.NoneId();
        Details.isAdult();
        Details.agreement_event();
    },

    /**
     * 渲染逻辑同touch
     * @param config
     */
    render: function (config) {
        var tpl = config.tpl,
            key = config.key,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback,
            _html = tpl(data),
            cxt;
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(_html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    },

    //隐藏id
    NoneId: function(){
        $(".productInfo .returnplace").each(function(){
            $(this).attr("nhtml",$(this).html());
            $(this).html($(this).html().split("[")[0]);
        });
        $(".productInfo .receiveplace").each(function(){
            $(this).attr("nhtml",$(this).html());
            $(this).html($(this).html().split("[")[0]);
        });
    },
    BindLogin: function() {
        $(document).on("click",".orderLogin", function() {
            document.domain = "ly.com",
                $(".mLogin_iframe").show(),
                $(".login_bg_bag").show()
        })
    },
    ShowOrHideDiscountList: function () {
        pageConfig.PreferentialRuleId = 0;
        var allRuleList = pageConfig.AllRuleList.concat([]);
        if (allRuleList.length == 0) {
            //$("#preferential_wrap").slideUp();
            $("#preferential_wrap").addClass("none");
            return false;
        }

        $("#discountPrice").html("0元");
        $("#discountPriceWrap").hide();

        var originFilter = {
            "PreferentialMode": 1, ////优惠方式 0 按人头（成人） 1 按订单 2按人头（所有） 3按份数 4按单品
            "PreferentialPriceType": 0, //金额类型(0实际金额，1比例)
            //"PreferentialPrice":0, //优惠金额
            IsNoLoginShow: function (val) {  //是否免登录显示 0否 1是
                if (val == 0  && (pageConfig.memberId == "0" || pageConfig.memberId == "")) {
                    return false;
                }
                return true;
            },
            OrderPageStatus: 1, //订单页显示方式 0不显示  1显示
            PreferentialType: function (v) {
                return v == 0 || v == 2|| v==5;  //优惠类型 0常规 1优惠码 2同程红包 3 渠道价 4 第几人优惠 5首日免单
            },
            LineStartDate: function (val) {
                var oneCal = $('#mainCal1').val();
                if (oneCal == "") {
                    return true;
                } else {
                    return new Date(val).setHours(0) <= new Date(oneCal).setHours(0);
                }
            },
            LineEndDate: function (val) {
                var oneCal = $('#mainCal2').val();
                if (oneCal == "") {
                    oneCal = new Date($('#mainCal1').val());
                    oneCal.setDate(oneCal.getDate() + parseInt(pageConfig.minDay - 1));
                    return new Date(val).setHours(0) >= oneCal.setHours(0);
                } else {
                    return new Date(val).setHours(0) >= new Date($('#mainCal1').val()).setHours(0);
                }
            },
            PreferentialPrice: function (val, m) {
                if (m.PreferentialType == 0) {
                    return parseInt(val) < parseInt($('#f_price_orginal').val() || 0);
                }
                return true;
            }
        };

        var allRuleList = pageConfig.AllRuleList.concat([]);

        var filterRuleList = _.filter(allRuleList, function (r) {
            return Details.FilterData([r], originFilter);
        });

        var filterRuleListGroup = _.groupBy(filterRuleList, "PreferentialType");

        var tempArr = [];
        for (var x in filterRuleListGroup) {
            if (x == 0) {
                tempArr.push({
                    PreferentialType: x,
                    PreferentialTypeName: '优惠立减',
                    RuleList: _.sortBy(filterRuleListGroup[x], function (v) {
                        return (-1) * v.PreferentialPrice;
                    })
                });
            }else if (x == 5) {
                tempArr.push({
                    PreferentialType: x,
                    PreferentialTypeName: '首日免单',
                    RuleList: _.sortBy(filterRuleListGroup[x], function (v) {
                        return (-1) * v.PreferentialPrice;
                    })
                });
            } else if ((x == 2)) {
                //所有的红包都提成一个
                var hongbao = _.map(filterRuleListGroup[x], function (hb) {
                    var hbArr = hb.HongBaoBatchList;
                    _.each(hbArr, function (b) {
                        b['RuleId'] = hb.RuleId;
                        b['PreferentialType'] = hb.PreferentialType;
                        b['Notice'] = hb.Notice;
                        b['Remark'] = hb.Remark;
                    });
                    return hbArr
                });

                hongbao = _.flatten(hongbao);
                hongbao = _.filter(hongbao, function (h) {
                    return Details.FilterData([h], {
                        BeginDate: function (val) {
                            return pageConfig.Today >= new Date(val)
                        },
                        EndDate: function (val) {
                            return pageConfig.Today <= new Date(val)
                        },
                        SmallAmount: function (val) {
                            return parseInt(val) <= parseInt($('#f_price_orginal').val() || 0);
                        },
                        ParValue: function (val) {
                            return parseInt(val) < parseInt($('#f_price_orginal').val() || 0);
                        }
                    });
                });

                hongbao = _.flatten(_.reject(hongbao, !(_.identity)));

                if (hongbao.length > 0) {
                    tempArr.push({
                        PreferentialType: x,
                        PreferentialTypeName: '红包',
                        HongBaoList: _.sortBy(_.flatten(hongbao), function (v) {
                            return (-1) * v.ParValue;
                        })
                    });
                }
            }
        }

        //有红包节点但没登陆就显示
        var filterHongBaoList = _.where(allRuleList, {
            PreferentialType:2
        });
        if (filterHongBaoList.length > 0 && parseInt(pageConfig.memberId) == 0) {
            $(".discountLogin").removeClass('none');
        }

        if (tempArr.length > 0) {
            tempArr.push({
                PreferentialType: "",
                PreferentialTypeName: '无需优惠',
                RuleList: [],
                HongBaoList: [],
                FirstEmptyStr: '不使用优惠  如帐户内有更多优惠,请登陆后使用'
            });

            $("#preferential_wrap_listBox").empty();
            $("#preferential_wrap").slideDown();
            $("#preferential_wrap_listBox").append(preferentialTemp(tempArr));

            if (filterHongBaoList.length > 0 && parseInt(pageConfig.memberId) == 0) {
                $(".discountLogin").removeClass('none');
            }
            if ($("#select_" + pageConfig.PreferentialType).length > 0) {
                if ($("#select_" + pageConfig.PreferentialType + " option[value=" + pageConfig.PreferentialSubOrderStr + "]").length > 0) {
                    $("#select_" + pageConfig.PreferentialType).val(pageConfig.PreferentialSubOrderStr);
                }
                $("#chk_rule_" + pageConfig.PreferentialType).trigger('click');
            }
        }
    },
    BindPreferentialRadio: function () {
        var preferWrapListBox = $("#preferential_wrap_listBox");
        preferWrapListBox.delegate('.chk_rule', 'click', function () {

            $(".rule_each label").removeClass("on_check");
            $(this).parent().addClass("on_check");

            var curPreferentialType = $(this).val();
            if (curPreferentialType != "") {
                pageConfig.PreferentialType = curPreferentialType;
                var hongSelVal = $("#select_" + curPreferentialType).val();//类型
                pageConfig.PreferentialSubOrderStr = hongSelVal;
                var hongSelArr = (hongSelVal || "0-0-").split('-');
                pageConfig.PreferentialRuleId = hongSelArr[0];

                if (hongSelVal != "" && hongSelVal != undefined) {
                    var index = $("#select_" + curPreferentialType + " option[value=" + hongSelVal + "]").attr("index"),
                        _parents = $(this).parents('.rule_each');
                    _parents.find(".rule_lable").addClass("none");
                    _parents.find(".rule_lable:eq(" + index + ")").removeClass("none");
                }
                Details.CalculateFinalAmout(pageConfig.AllRuleListDic[hongSelArr[0]]);
            } else {
                pageConfig.PreferentialSubOrderStr = "0-0-";
                Details.CalculateFinalAmout();
            }

        });

        preferWrapListBox.delegate(".select_type", "change", function () {
            $(this).parents(".rule_each").find("[type=radio]").trigger('click');
        });

        preferWrapListBox.delegate(".rule_lable", "mouseover", function () {
            var elem = this,
                title = $(elem).attr('titleself'),
                bubble = $("#discount-tooltip-bubble");
            bubble.find(".order-tips li span").html(title);
            bubble.css({
                top: $(elem).offset().top + 20,
                left: $(elem).offset().left,
                position: 'absolute'
            });
            bubble.show();
        });

        preferWrapListBox.delegate(".rule_lable", "mouseout", function () {
            $("#discount-tooltip-bubble").hide();
        });

    },
    CalculateFinalAmout: function (curRuleObj) {
        var price = parseInt($('#f_price_orginal').val() || 0);
        //PreferentialType 优惠类型 0常规 1优惠码 2同程红包 3 渠道价 4 第几人优惠
        //PreferentialPriceType 金额类型  0实际金额 1比例
        // PreferentialMode 优惠方式 0 按人头（成人） 1 按订单 2按人头（所有） 3按份数 4按单品
        if (curRuleObj && curRuleObj.PreferentialMode == 1 && curRuleObj.PreferentialPriceType == 0 && (curRuleObj.PreferentialType == 0) && price >= curRuleObj.PreferentialPrice) {
            pageConfig.PreferentialType = 0;
            $('.f_price').html(price - curRuleObj.PreferentialPrice);
            $('#discountPrice').html("-"+curRuleObj.PreferentialPrice + "元");
            $("#discountPriceWrap").show();
        } else if (curRuleObj && curRuleObj.PreferentialMode == 1 && curRuleObj.PreferentialPriceType == 0 && curRuleObj.PreferentialType == 2) {
            pageConfig.PreferentialType = 2;
            var hongSelArr = ($("#select_" + curRuleObj.PreferentialType).val() || "0-0-0").split('-');
            var parValue = parseInt(hongSelArr[1]) || 0;
            if (price > parValue) {
                $('.f_price').html(price - parValue);
                $('#discountPrice').html("-"+parValue + "元");
                $("#discountPriceWrap").show();
            }
        }else if (curRuleObj && curRuleObj.PreferentialMode == 1 && curRuleObj.PreferentialPriceType == 0 && (curRuleObj.PreferentialType == 5)) {
            //首日免单 需要去取第一个的价格   因为首日免不用curRuleObj.PreferentialPrice这个

            var startDate = $("#mainCal1").val();
            var firstPriceObj = pageConfig.FirstDatePriceObj[startDate];
            if (firstPriceObj) {
                var count = parseInt($("#numBox0").val() || 0) || 0;
                curRuleObj.PreferentialPrice = (firstPriceObj.Price || 0) * count;
            }
            if (price - curRuleObj.PreferentialPrice > 0) {
                pageConfig.PreferentialType = 5;
                $('.f_price').html(price - curRuleObj.PreferentialPrice);

                //这个是  左边台数下面的
                $("#totalprice").html("" + price + "-" + curRuleObj.PreferentialPrice);

                $('#discountPrice').html("-" + curRuleObj.PreferentialPrice + "元");
                $("#discountPriceWrap").show();
            } else {
                pageConfig.PreferentialType = 0;
                pageConfig.PreferentialType = "";
                $('.f_price').html(price);
                $('#discountPrice').html(0 + "元");
                $(".total_price .discountPrice").html('');
                $("#discountPriceWrap").hide();
            }
        } else {
            pageConfig.PreferentialType = "";
            $('.f_price').html(price);
            $("#totalprice").html(price);
            $('#discountPrice').html(0 + "元");
            $("#discountPriceWrap").hide();
        }

    },
    GetWanLePreferentialInfoAjaxAndRenderPage: function () {
        $.ajax({
            // url: window.__mod__ + "/wanle/AjaxHelperWanLe/GetWanLePreferentialInfo?LineId=" + pageConfig.productId + "&Platment=0&PublicPlatmentId=1",
            // url: window.__mod__ + "/wanle/api/WanleProduct/GetWanLePreferentialInfo?LineId=404137&Platment=0&PublicPlatmentId=1&MemberId=26898295",
            url: "http://www.ly.com/wanle/api/WanleProduct/GetWanLePreferentialInfo?LineId="+ pageConfig.productId +"&Platment=0&PublicPlatmentId=1&MemberId="+pageConfig.memberId,
            dataType: "jsonp",
            async: true,
            success: function (data) {

                pageConfig.AllRuleList = data.Data;
                _.each(data.Data, function (c) {
                    pageConfig.AllRuleListDic["" + c.RuleId] = c;
                });
                Details.insure_show(function(){
                    Details.buildFee();
                });
                Details.buildFee(); //计算费用
                Details.BindPreferentialRadio(); //委托放这里只绑定一次即可

            }
        });
    },
    LoginShowOrHide: function () {
        if (pageConfig.memberId == 0 || pageConfig.memberId == "0" || pageConfig.memberId == "") {
            $(".postLogin").remove();
            $(".postUnLogin").show();
        } else {
            $(".postUnLogin").remove();
            $(".postLogin").show();
        }
        if($(".save").length > 0){
            $(".save").parents(".order-fn-btns").css("display","inline-block");
        }else{
            $(".order-fn-btns").css("display","none");
            $("#player").css("padding-bottom","14px");
        }
    },
    BindDialogResetAndReLoad: function () {
        var _parent = $("#J_orderPop_new");
        _parent.find(".reset").on('click', function () {
            $(".close-dialog-btn").trigger('click');
        });
        _parent.find(".reload").on('click', function () {
            window.location.reload();
        });

    },
    InputBeforeSubmitChk: function (selectorWrap) {

        var selectorWrap = selectorWrap || '';
        var b = true;
        $(selectorWrap + " .inputBeforeSubmitChk").focus();
        $(selectorWrap + " .inputBeforeSubmitChk").blur();



        var colorArr = ['red', 'rgb(255, 0, 0)'];

        $(selectorWrap + " .inputBeforeSubmitChk").each(function () {

            var curBorderColor = $(this).css('border-color');
            if (_.indexOf(colorArr, curBorderColor.toLowerCase()) > -1) {
                b = false;
                return false;
            }
            if(($(this).val() == "" && $(this).hasClass("ui-input-first-name")) || ($(this).val() == "" && $(this).hasClass("ui-input-last-name"))){
                $(this).val("须与证件上信息一致");
                $(this).css("color","#ccc");
            }
        });

        $(".ui-radio-sex").each(function(){
            if(!($(this).parent().hasClass("on_check")) && !($(this).parent().siblings().hasClass("on_check"))){
                //$(this).parent().siblings(".valid_symbol").removeClass("none");
            }
        });

        if($("#provinceqg").html()=="请选择省" || $("#city").html()=="请选择市" || $("#district").html()=="区/县"){
            $(".province_city .valid_symbol").removeClass("none");
            $(".province_city .select_box").css("border","1px solid red");
            b = false;
            return false;
        }else{
            $(".province_city .valid_symbol").addClass("none");
            $(".province_city .select_box").css("border","1px solid #ddd");
        }
        $(".province_city .select_box").css("border","1px solid #cbcbcb");
        return b;


    },

    //右部悬浮
    BindRigtFixPostion: function () {
        $(window).on("scroll", function () {
            if ($(window).scrollTop() > 500) {
                $(".par_right").css({
                    "top": "0",
                    "position": "fixed"
                });
            } else {
                $(".par_right").css({
                    "top": "550px",
                    "position": "static"
                });
            }
        });
    },
    //问号输入帮助提示
    hoverHelp: function () {
        $(".PassengerTimer_New .zh_tip").hover(function () {
            $(this).parent().parent().find(".zh_tip_box").css("display", "block");
        }, function () {
            $(this).parent().parent().find(".zh_tip_box").css("display", "none");
        });

        $(".PassengerTimer_New .en_tip").hover(function () {
            $(this).parent().parent().find(".en_tip_box").css("display", "block");
        }, function () {
            $(this).parent().parent().find(".en_tip_box").css("display", "none");
        });
    },
    BindPostAddress: function () {
        $("#select_address_list").delegate(".piaocheckedTwo", "click", function () {
            var elemInfo = $(this).find('[name=postchk]'),
                elemBind = $("#postperson,#postmobile,#postaddress"),
                elemWrite = $(".write_address input"),
                proviceElem = $("#provinceqg"),
                cityElem = $("#city"),
                districtElem = $("#district");
            $(this).parents(".postLogin").find(".piaocheckedTwo").removeClass("on_check");
            $(this).addClass("on_check");

            $("#postmobile").val((elemInfo.attr('mobile') || '').trim());
            $("#postperson").val((elemInfo.attr('receiveName') || '').trim());
            $("#postaddress").val((elemInfo.attr('address') || '').trim());

            proviceElem.html(($(this).find('[name=postchk]').attr('province') || '').trim());
            proviceElem.attr("value",(($(this).find('[name=postchk]').attr('provinceId') || ''|| 0).trim()));
            cityElem.html(($(this).find('[name=postchk]').attr('city') || '').trim());
            cityElem.attr("value",(($(this).find('[name=postchk]').attr('cityId') || ''|| 0).trim()));
            districtElem.html(($(this).find('[name=postchk]').attr('region') || '').trim());
            districtElem.attr("value",(($(this).find('[name=postchk]').attr('regionId') || ''|| 0).trim()));
            $(".province_city").addClass("none");
            $(".province_city").siblings(".write_list").addClass("none");

            elemBind.focus();
            elemBind.blur();

            $(".write_address .valid_symbol").addClass("none");
            elemWrite.css("border", "1px solid #ddd");
            elemWrite.css("color", "#333");

            //当省市区有报空再填充时，去掉爆红
            proviceElem.html()&& proviceElem.parent().css("border", "1px solid #ddd");
            cityElem.html()&& cityElem.parent().css("border", "1px solid #ddd");
            districtElem.html()&& districtElem.parent().css("border", "1px solid #ddd");
            $(".province_city").find(".valid_symbol").addClass("none");

        });
        $(".handInput_address .piaocheckedTwo").on("click", function () {
            $("#select_address_list .piaocheckedTwo").removeClass("on_check");
            $(this).addClass("on_check");
            $(".mail-info-table input").val("");
            $(".province_city").removeClass("none");
            $(".province_city").siblings(".write_list").removeClass("none");
            $("#provinceqg").html("请选择省");
            $("#city").html("请选择市");
            $("#district").html("区/县");
        });

        //选择省市区
        $("#provinceqg").on("click",function(){
            $("#city").html("请选择市").attr("value","0");
            $("#district").html("区/县").attr("value","0");
            if($("#provinceqg").html() !="请选择省" && $("#city").html() !="请选择市" && $("#district").html() !="区/县"){
                $(".province_city .valid_symbol").removeClass("none");
                $(".province_city .select_box").css("border","1px solid red");
            }else{
                $(".province_city .valid_symbol").addClass("none");
                $(".province_city .select_box").css("border","1px solid #ddd");
            }
        });
        $("#city").on("click",function(){
            $("#district").html("区/县").attr("value","0");
            if($("#provinceqg").html() !="请选择省" && $("#city").html() !="请选择市" && $("#district").html() !="区/县"){
                $(".province_city .valid_symbol").removeClass("none");
                $(".province_city .select_box").css("border","1px solid red");
            }else{
                $(".province_city .valid_symbol").addClass("none");
                $(".province_city .select_box").css("border","1px solid #ddd");
            }
            $("#proList").addClass("none");
            $("#trictList").addClass("none");
        });
        $("#district").on("click",function(){
            $("#proList").addClass("none");
            $("#cityList").addClass("none");
        });


        //省
        $("#provinceqg").on("click",function(){
            $("#proList").html("").removeClass("none");
            $("#cityList").addClass("none");
            $("#trictList").addClass("none");
            $.ajax({
                url: "/wanle/api/WanleProduct/GetProvinceList",
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    for(var i=0; i<data.length; i++){
                        var p_id = data[i].Id,
                            p_name = data[i].Name;
                        $("#proList").append(
                            '<li value="'+p_id+'">'+p_name+'</li>'
                        );
                    }
                }
            });
        });

        $(document).on("click","#proList li",function(){
            $(this).parent().find("select_box").css("border","1px solid #cbcbcb");
            $("#provinceqg").attr("value",$(this).val()).html($(this).html());
            $("#proList").addClass("none");
            $.ajax({
                url: "/wanle/api/WanleProduct/GetCityListByProvinceId?id="+$("#provinceqg").attr("value"),
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    $("#cityList").html("");
                    for(var i=0; i<data.length; i++){
                        var c_id = data[i].Id,
                            c_name = data[i].Name;
                        $("#cityList").append(
                            '<li value="'+c_id+'">'+c_name+'</li>'
                        );
                    }
                }
            });
        });

        $(document).on("click","#cityList li",function(){
            $("#cityList").addClass("none");

            $("#city").html($(this).html());
            $("#city").attr("value",$(this).attr("value"));
            $.ajax({
                url: "/wanle/api/WanleProduct/GetCountyListByCityId?id="+$("#city").attr("value"),
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    $("#trictList").html("");
                    for(var i=0; i<data.length; i++){
                        var qu_id = data[i].Id,
                            qu_name = data[i].Name;
                        $("#trictList").append(
                            '<li value="'+qu_id+'">'+qu_name+'</li>'
                        );
                    }
                }
            });
        });

        $(document).on("click","#trictList li",function(){
            $("#district").html($(this).html());
            $("#district").attr("value",$(this).attr("value"));
            $("#trictList").addClass("none");
            if($("#provinceqg").html() !="请选择省" && $("#city").html() !="请选择市" && $("#district").html() !="区/县"){
                $(".province_city .valid_symbol").addClass("none");
                $(".province_city .select_box").css("border","1px solid #ddd");
            }
        });

        //市
        $("#city").on("click",function(e){
            if($("#provinceqg").attr("value") == 0){
            }else{
                $("#cityList").removeClass("none");
            }
        });

        //区
        $("#district").on("click",function(){
            if($("#city").attr("value") == 0){
            }else{
                $("#trictList").removeClass("none");
            }
        });

    },
    GetAllLinkManAjaxAndRenderPage: function () {
        // 26898295
        $.ajax({
            // url: window.__mod__ + "/wanle/AjaxHelperWanLe/GetContanctList?MemberId=" + pageConfig.memberId,/wanle/api/WanleProduct/GetContanctList
            //url: "http://www.ly.com/wanle/AjaxHelperWanLe/GetContanctList?MemberId=" +"9407711",
            url: "http://www.ly.com/wanle/api/WanleProduct/GetContanctList",
            dataType: "jsonp",
            success: function (data) {

                var emptyCertAr = _.map(pageConfig.vcTypeObj, function (cert) {
                    return {
                        certType: cert.Type ? cert.Type : 1,
                        certTypeName: cert.Name,
                        certNo: ''
                    };
                });
                if($("#HasInsurance").val() == "true" && emptyCertAr.length == 0){
                    emptyCertAr = []  ;
                    emptyCertAr.push({
                        certType:  1,
                        certTypeName: "身份证",
                        certNo: ''
                    });
                }
                for (var i = 0; i < data.Data.ContactList.length; i++) {

                    var orignObj = data.Data.ContactList[i];
                    var certDic = orignObj.CertDic;   //证件类型1-身份证2-护照3-驾照4-军人证5-回乡证6-港澳通行证7-台胞证8-其他   我们分别是 1 2 4 8
                    if(data.Data.ContactList[0].CertDic[1]){
                        var certCardNumber = data.Data.ContactList[0].CertDic[1].CertNo;
                    }

                    pageConfig.AllContactList.push({
                        "LinkerName": orignObj.LinkerName,
                        "EnglishName": orignObj.EnglishName,
                        "EnglishXin": orignObj.EnglishXin == "" ? "须与证件上信息一致" : orignObj.EnglishXin,
                        "EnglishMing": orignObj.EnglishMing == "" ? "须与证件上信息一致" : orignObj.EnglishMing,
                        "Sex": orignObj.Sex,
                        "DefaultCertType": orignObj.DefaultCertType,
                        "CertList": emptyCertAr,
                        "Birthday": orignObj.Birthday == '1900-01-01' ? '' : orignObj.Birthday,
                        "Mobile": orignObj.Mobile,
                        "Nationality": orignObj.Nationality,
                        "LinkerId": orignObj.LinkerId,
                        'CertDic': certDic
                    });


                }

                //联系人默认给常旅
                if (data.Data.ContactList.length > 0) {

                    data.Data.ContactList = _.sortBy(data.Data.ContactList, function(c) {
                        return -1 * (c.IsDefault);
                    });

                    var first = data.Data.ContactList[0];
                    first.LinkerName != "" && $("#ContactPerson").val(first.LinkerName);
                    first.Mobile != "" && $("#ContactMoblie").val(first.Mobile);
                    first.Email != "" && $("#ContactMail").val(first.Email);
                    $(".add_pc input").val("");
                    first.LinkerName != "" && $("#ContactPerson").css({
                        'color': 'rgb(51, 51, 51)'
                    });

                    first.Mobile != "" && $("#ContactMoblie").css({
                        'color': 'rgb(51, 51, 51)'
                    });

                    first.Email != "" && $("#ContactMail").css({
                        'color': 'rgb(51, 51, 51)'
                    });
                    $(".add_pc input").css({
                        'color': 'rgb(51, 51, 51)'
                    });
                }

                //显示出常用联系人
                $(".passenger_info_list .is_login").empty();
                // Details.render({
                //         tpl: linkManTemp,
                //         key: "linkManlist",
                //         data: pageConfig.AllContactList,
                //         overwrite: false,
                //         context: $("#player_list"),
                //         callback: function () {
                //             // Details.detailSlider();
                //         }
                //     });
                $("#player_list").append($("#LinkManTemp").tmpl(pageConfig.AllContactList));
                if(pageConfig.AllContactList.length <= 7){
                    $(".look_btn").addClass("none");
                }
            }
        });
    },
    BindBirthday: function(){
        //初始化所有新加的出游人
        $(".PassengerTimer_New .ui-input-birthday").each(function () {
            var that = this;
            $(this).click(function () {
                pageConfig.BirthDayCal.pick({
                    elem: this, // 如果设置了elem的值，且elem参数为input框
                    showOtherMonth: false,
                    elems: $(this),
                    fn: function (y, m, d, td, ipt) {
                        $(that).css("border-color", "#ddd");
                        $(that).siblings("span").css("display", "none");
                    }
                });
            })
        });
    },
    AddPassenger: function (passengerObj,param) {
        //Details.AddPassenger({
        //     PassengerArr: [],
        //     AddEmptyNum: 1,  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
        //     DestSelector:'', //目标选择器
        //     InsertType:0    //默认append   1 insertBefore(DestSelector)
        //     emptyButLinkerId:''  //新增空  但linkerid 指定  主要用于清空时 保持原id 这样与 checkbox仍有关联
        // })
        if(param === 1){
            if(Details.passengerIndex){
                if( passengerObj.AddEmptyNum > 0 ){
                    for (var i = 0; i < passengerObj.AddEmptyNum; i++) {
                        $("#LinkerEachContainer_"+Details.passengerIndex).remove();
                        Details.passengerIndex = Details.passengerIndex - 1;
                    }
                }else if(passengerObj.AddEmptyNum < 0){
                    $("#LinkerEachContainer_"+Details.passengerIndex).remove();
                    Details.passengerIndex = Details.passengerIndex - 1;
                }

            } else {
                var passenLength = $(".passenger-info-table").length,
                    elem = $($(".passenger-info-table")[passenLength - 1]),
                    elemId = elem.attr('id').split('_').pop();
                passenLength && elem.remove();
                $("#linkerChk_"+ elemId).attr("checked",false);
            }
            return;
        } else if(param === 2){
            Details.passengerIndex = Details.passengerIndex + 1;
        }
        else{
            if(Details.passengerIndex){
                $("#LinkerEachContainer_"+Details.passengerIndex).remove();
                Details.passengerIndex = Details.passengerIndex - 1;
            } else {
                return;
            }
        }

        var toInsertArr = [];
        if (passengerObj.AddEmptyNum == 0) {
            toInsertArr = passengerObj.PassengerArr;
        } else {
            passengerObj.PassengerArr = [];

            var emptyCertArr = _.map(pageConfig.vcTypeObj, function (cert) {
                return {
                    certType: cert.Type ? cert.Type : 1,
                    certTypeName: cert.Name,
                    certNo: ''
                };
            });

            var obj = function(i){
                var _this =  {
                    "LinkerName": "",
                    "EnglishName": "",
                    "EnglishXin": "须与证件上信息一致",
                    "EnglishMing": "须与证件上信息一致",
                    "Sex": 3,
                    "DefaultCertType": "",
                    "CertList": emptyCertArr,
                    "Birthday": "",
                    "Mobile": "",
                    "Nationality": "",
                    "LinkerId": i>0?i:passengerObj.emptyButLinkerId || Details.passengerIndex,  //self前缀为  非常用旅客
                    'CertDic': {}
                };
                return _this;
            };

            for (var i = 0; i < passengerObj.AddEmptyNum; i++) {
                var newObj = obj(i+Details.passengerIndex);
                toInsertArr.push(newObj);
            }
            if(param === 2 && passengerObj.AddEmptyNum){
                //当增加多个出游人的时候，Details.passengerIndex值相应增加，因为上面加了一个1，此处减1
                Details.passengerIndex = Details.passengerIndex + passengerObj.AddEmptyNum - 1;
            }
        }

        passengerObj.DestSelector = passengerObj.DestSelector || '.passenger_info_list';
        passengerObj.InsertType = passengerObj.InsertType || 0;

        var pessangerData = JSON.stringify($("#allData").val());

        if(!param && (Details.passengerIndex)){
            $("#LinkerEachContainer_1").before(passengerTemp(toInsertArr));
        }else if (passengerObj.InsertType == 0) {
            $(passengerObj.DestSelector).append(passengerTemp(toInsertArr));
        } else if (passengerObj.InsertType == 1) {
            $(passengerTemp(toInsertArr)).insertBefore(passengerObj.DestSelector);
        } else if (passengerObj.InsertType == 2) {
            $(passengerTemp(toInsertArr)).insertAfter(passengerObj.DestSelector);
        }

        Details.BindBirthday();
        Details.BindLinkManSexRadio();
        Details.hoverHelp();
        Details.BindInputValidate();

        $(".PassengerTimer_New").removeClass('PassengerTimer_New'); //格式化出游人 生日后去掉新class  以免下次再绑定事件
        Details.LoginShowOrHide();


    },
    BindAddLinkMan: function () {

        $("#getLineManAllForSubmit").click(function () {
            Details.GetPassengerData();
        });

    },
    GetFirstEmptyLinkMankId: function (selector) {
        var returnId = '';
        var finalSelector = selector || ".passenger-info-table";  //因为涉及有时只取一个
        $(finalSelector).each(function () {

            //"Sex=0,LinkerName=0,Mobile=13052551997,BirthDay=0,Nationality=0,EnglishMing=0,EnglishXin=0"
            var curId = $(this).attr('id');
            if (curId.indexOf('self') > -1) {

                var perInputData = {
                    Sex: $(this).find(".peo_sex").attr('put_sex') || "",
                    LinkerName: $(this).find(".ui-input-nameZh").val() || '',
                    Mobile: $(this).find(".ui-input-mobile").val() || '',
                    Birthday: $(this).find(".ui-input-birthday").val() || '',
                    Nationality: $(this).find(".ui-input-country").val() || '',
                    EnglishMing: $(this).find(".ui-input-last-name").val() || '',
                    EnglishXin: $(this).find(".ui-input-first-name").val() || '',
                    LinkerNoList: []
                };

                $(this).find(".z_Type .write_list").each(function () {
                    perInputData.LinkerNoList.push({
                        'CertNo': $(this).find(".ui-select-certificate-id").val(),
                        'CertType': $(this).find(".ui-select").text().trim()
                    });
                });

                var certNoArr = _.pluck(perInputData.LinkerNoList, 'CertNo');

                var allEmpty = _.every(certNoArr, function (v) { return v == ""; });

                var IsCheckIsAllStringEmpty = Details.CheckIsAllStringEmpty.call(perInputData);

                if (IsCheckIsAllStringEmpty && allEmpty) {
                    returnId = $(this).attr('id');
                    return false;
                }
            }
        });

        return returnId;

    },

    BindRemoveLinkMan: function () {

        $(".passenger_info_list").delegate(".removeLinkMan", "click", function () {
            var curLinkerId = $(this).attr('linkerid');

            setTimeout(function () {
                var elem = $("#LinkerEachContainer_" + curLinkerId);
                elem.slideUp();
                elem.remove();
            }, 0);


            $("#player_list input[linkerid=" + curLinkerId + "]")[0].checked = false;
        });
    },
    BindLinkManCheckBox: function () {

        $("#player_list").delegate(".linkerChk", "click", function () {

            var curLinkerId = $(this).attr('linkerid');

            if (this.checked) {
                if(!Details.passengerIndex){
                    this.checked = false;
                    Details.PopDialog({
                        beforeOpen: function () {
                            $("#popTitle").html("只需填写"+$("#needPassengerNum").html()+"人信息").css("padding-top","8px");
                            $(".order-pop-tip").addClass("lieCenter");
                            $(".order-pop-content").find("i").css("display","block");
                        }
                    });
                    setTimeout(function(){
                        $(".close-dialog-btn").trigger('click');
                        $("#popTitle").css("padding-top","0px");
                        $(".order-pop-content").find("i").css("display","none");
                    },1200);
                    return;
                }

                var firstlinkerId = Details.GetFirstEmptyLinkMankId(); //全id
                if (firstlinkerId != '') {
                    //说明有全空的 先找出插入位置再 先把他本身移掉

                    //新增时如果没有全部为空的 就直接最后加  否则规则第一个为空的
                    //Details.ResetLinkMan("#" + firstlinkerId, curLinkerId);
                } else {
                    Details.AddPassenger({
                        PassengerArr: _.where(pageConfig.AllContactList, { "LinkerId": parseInt(curLinkerId) }),
                        AddEmptyNum: 0,  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                        DestSelector: '', //目标选择器
                        InsertType: 0    //默认append   1 insertBefore(DestSelector)
                    });
                    $(".ui-input-first-name").each(function(){
                        if($(this).val() == "须与证件上信息一致"){
                            $(this).css("color","#ccc");
                        }else{
                            $(this).css("color","#333");
                        }
                    });
                    $(".ui-input-last-name").each(function(){
                        if($(this).val() == "须与证件上信息一致"){
                            $(this).css("color","#ccc");
                        }else{
                            $(this).css("color","#333");
                        }
                    });

                    Details.AddSaveChoose(); //增加是否选中保存出游人
                }
            } else {
                setTimeout(function () {
                    var elem = $("#LinkerEachContainer_" + curLinkerId);
                    elem.slideUp();
                    elem.remove();
                    Details.AddPassenger({
                        PassengerArr: [],
                        AddEmptyNum: 1  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                    },2);
                }, 0);
            }
        });
    },
    BindLinkManSexRadio: function () {

        $(".PassengerTimer_New .piaochecked").click(function () {
            $(this).parent().parent().find(".piaochecked").removeClass("on_check");
            $(this).addClass("on_check");
            $(this).siblings(".valid_symbol").addClass("none");

        });

        $(".PassengerTimer_New .ui-radio-sex").click(function () {
            var get_sex_type = $(this).attr("sex_type");
            $(this).parents().find(".peo_sex").attr("put_sex", get_sex_type);
        });
    },
    //BindLinkManSaveOrUpdate: function () {
    //$(".passenger_info_list").delegate(".save", "click", function () {
    //    var curLinkerId = $(this).attr('linkerid');
    //    Details.GetOnePassengerDataForAjaxSave("#LinkerEachContainer_" + curLinkerId);
    //});
    //},
    //出游人保存或更新
    GetOnePassengerDataForAjaxSave: function (selectorWrap) {
        var b = Details.InputBeforeSubmitChk(selectorWrap);
        if (!b) {
            return false;
        }

        //LinkerEachContainer_38530   或 LinkerEachContainer_self_38530
        var linkerId = parseInt(selectorWrap.indexOf("_self_") > -1 ? "0" : selectorWrap.split("_").pop()) || 0;
        var certArr = [];
        $(selectorWrap + "  .z_Type .write_list").each(function () {
            certArr.push({
                CertType: $(this).find(".ui-select").text().trim(),
                CertNo: $(this).find(".ui-select-certificate-id").val(),
                LinkerId: linkerId
            });
        });

        var obj = {
            'LinkerId': linkerId,
            'B2cUserId': parseInt(pageConfig.memberId) || 0,
            'LinkerName': $(selectorWrap + " .ui-input-nameZh").val() || '',
            'EnglishMing': $(selectorWrap + " .ui-input-last-name").val() || '',
            'EnglishXin': $(selectorWrap + " .ui-input-first-name").val() || '',
            'Sex': $(selectorWrap + " .peo_sex").attr('put_sex') || '',
            'Mobile': $(selectorWrap + " .ui-input-mobile").val() || '',
            'Birthday': $(selectorWrap + " .ui-input-birthday").val() || '1900-01-01',
            'Nationality': $(selectorWrap + " .ui-input-country").val() || '',
            'LinkerNoList': certArr
        };
        var ajax_Type = linkerId <= 99 ? "AddContanct" : "UpdateContanct";

        $(selectorWrap + " ");

        $.ajax({
            url: window.__mod__ + "wanle/AjaxHelperWanLe/" + ajax_Type,
            dataType: "jsonp",
            type: "POST",
            data: {
                'OrderData': JSON.stringify(obj)
            },
            success: function (data) {
                if (data.Status.IsSuccess) {
                    Details.PopDialog({
                        beforeOpen: function () {
                            $("#popTitle").html("出游人信息操作成功！");
                            $(".order-pop-tip").addClass("lieCenter");
                        }
                    });

                } else {

                    Details.PopDialog({
                        beforeOpen: function () {
                            $("#popTitle").html(data.Status.ErrMsg);
                            $(".order-pop-tip").addClass("lieCenter");
                        }
                    });
                }
            }
        });
    },

    PopDialog: function (config) {

        var conf = {
            content: $('#J_orderPop_new'),
            title: "温馨提示",
            width: 410,
            height: 190,
            dragable: false,
            bgClose: true,
            zIndex: [1001, 1000],
            beforeClose: function () {
                var pop_new = $("#J_orderPop_new"),
                    submitElem = $("#submits");
                $(".order-pop").hide();
                $("#popTitle").html("");
                $("#popDesc span").html("");
                pop_new.find("i").hide();
                pop_new.find(".order-pop-btn").hide();
                pop_new.find(".order-pop-phone").hide();
                submitElem.html("我同意以下条款，提交订单");
                submitElem.removeAttr("disabled");
            },
            click: function () {
                this.close();
            },
            close: function () {
                return true;
            },
            beforeOpen: function () {
                $(".order-pop-tip").addClass("lieCenter");
            }
        };

        var newconf = $.extend({}, conf, config);

        var dialog = $.dialog(newconf);

        dialog.show();
    },
    GetCurToSubmitPriceData: function () {
        var pricePersonDataArr = [];

        $(".chose_peo .inputbox").each(function () {
            var curInputData = {
                curPriceId: $(this).attr('attr-id') || "",
                curPrice: parseInt($(this).attr('data-price')) || 0,
                curNum: parseInt($(this).val()) || 0,
                curMax: parseInt($(this).attr('max')) || 0,
                curMin: parseInt($(this).attr('min')) || 0
            };
            pricePersonDataArr.push(curInputData);
        });

        return pricePersonDataArr;

    },
    GetCurToSubmitPriceSimpleData: function () {
        var pricePersonDataArr = [];
        $(".chose_peo .inputbox").each(function () {
            var curInputData = {
                PriceId: $(this).attr('attr-id') || "",
                PersonCount: parseInt($(this).val()) || 0
            };
            if (curInputData.PersonCount != 0) {
                pricePersonDataArr.push(curInputData);
            }
        });

        return pricePersonDataArr;

    },

    //增加点击选择是否保存事件
    AddSaveChoose:function(){
        $(".order-fn-btns input").on("click",function(){
            if($(this).is(':checked')){
                $(this).parent().parent().attr("saveType",1);       //选中
            }else{
                $(this).parent().parent().attr("saveType",0);       //未选中
            }
        });
    },
    //获取出游人信息
    GetPassengerData: function (selector) {
        var passengerDataArr = [];
        var finalSelector = selector || ".passenger-info-table";  //因为涉及有时只取一个
        $(finalSelector).each(function () {

            //"Sex=0,LinkerName=0,Mobile=13052551997,BirthDay=0,Nationality=0,EnglishMing=0,EnglishXin=0"
            if($(this).find(".ui-input-last-name").val() != "须与证件上信息一致" && $(this).find(".ui-input-first-name").val() != "须与证件上信息一致"){
                var act_first_name = $(this).find(".ui-input-first-name").val();
                var act_last_name = $(this).find(".ui-input-last-name").val();
            }
            var perInputData = {
                isSave: $(this).attr(".saveType") || 1,      //判断是否保存
                Sex: $(this).find(".peo_sex").attr('put_sex') || "",
                LinkerName: $(this).find(".ui-input-nameZh").val() || '',
                Mobile: $(this).find(".ui-input-mobile").val() || '',
                Birthday: $(this).find(".ui-input-birthday").val() || '1900-01-01',
                Nationality: $(this).find(".ui-input-country").val() || '',
                EnglishXin: act_first_name || '',
                EnglishMing: act_last_name || '',
                LinkerNoList: []
            };

            $(this).find(".z_Type .write_list").each(function () {
                var  isHave = $(this).find(".ui-select-certificate-id").val();
                if(isHave != ""){
                    perInputData.LinkerNoList.push({
                        'CertNo': $(this).find(".ui-select-certificate-id").val(),
                        'CertType': $(this).find(".ui-select").text().trim()
                    });
                }

            });
            if (perInputData.PersonCount != 0) {
                passengerDataArr.push(perInputData);
            }
        });

        return passengerDataArr;

    },
    GetInputValue: function (selector) {
        var input = $(selector);
        var reVal = '';
        if (input.length > 0) {
            var inputVal = input.val() || '';
            var attrVal = input.attr('attr-value') || '';
            if (inputVal != '') {
                return inputVal.replace(attrVal, "");
            }
        }
        return reVal;
    },
    SubOrderAjax: function () {

        var $tar = $("#submits");
        if (!fx) {
            $tar.attr("disabled", "disabled").val("正在提交中,请稍等...");
        }

        var curPreferentialInfoList = [];
        var hongSelArr = ($("#select_" + pageConfig.PreferentialType).val() || "0-0-").split('-');
        if (hongSelArr[0] !== "" && hongSelArr[0] != "0" && hongSelArr[0] != 0) {
            curPreferentialInfoList.push({
                PromoCode: '',
                RuleId: parseInt(pageConfig.PreferentialRuleId || 0) || 0,
                VirtualAmount: parseInt(hongSelArr[1]) || 0,
                VirtualCouponNo: hongSelArr[2]
            })
        }

        if($(".tc_sale .selected .radio_word").text() == "非夜间航班"){
            var get_chooseSale = "";
        }else{
            var get_chooseSale =  $(".tc_sale .selected .radio_word").text();
        }

        if($(".pay_online").hasClass("selected")){
            var getDepositType = 1;
        }else{
            var getDepositType = 0;
        }
        //保险取值开始
        var isHasInsure = "";             //意外险险种Id
        if($(".insurance").attr("isHas_accident") == 1 || $(".insurance").attr("isHas_cancel") == 1){
            isHasInsure = 1;
        }else{
            isHasInsure = 0;
        }
        //意外险险种Id
        var accident_id = 0;
        $(".first_insure li").each(function(){
            if($(this).find(".button_right").hasClass("has_right")){
                accident_id = $(this).attr("insure_id");
            }
        });
        //取消险险种Id
        var cancel_id = 0;
        $(".cancel ul li").each(function(){
            if($(this).find(".button_right").hasClass("has_right")){
                cancel_id = Number($(this).attr("insure_id"));
            }
        });

        var postJson = {
            ProvinceId: parseInt($("#provinceqg").attr("value")),
            ProvinceName: $("#provinceqg").html()||"",
            CityId: parseInt($("#city").attr("value")),
            CityName: $("#city").html()||"",
            RegionId: parseInt($("#district").attr("value")),
            RegionName: $("#district").html()||"",
            PostAddress: Details.replaceSign(Details.GetInputValue("#postaddress")||""),
            PostPerson: Details.GetInputValue("#postperson"),
            PostMobile: Details.GetInputValue("#postmobile")
        };
        var dataJson_post = {
            LineId: parseInt(pageConfig.productId) || 0,
            ContactPerson: Details.GetInputValue("#ContactPerson"),
            ContactMoblie: Details.GetInputValue("#ContactMoblie"),
            ContactMail: Details.GetInputValue("#ContactMail"),
            StartDate: $("#mainCal1").val() || "",
            EndDate: $("#mainCal2").val() || "1900-01-01",
            Remark: $('#Inote').val() || '',
            Prices: [],
            ActivityId: pageConfig.hidActivityId,
            PeriodId: parseInt($("#hidPeriodId").val() || 0) || 0,
            ReceiveAddress: $(".selected .receiveplace").attr("nhtml") || '',
            ReturnAddress: $(".selected .returnplace").attr("nhtml") || '',
            ChooseSale: get_chooseSale || '',  //是否选择同程钜惠
            PostInfo:{"ProvinceName":postJson.ProvinceName,"ProvinceId":postJson.ProvinceId,
                "CityName":postJson.CityName,"CityId":postJson.CityId,
                "RegionName":postJson.RegionName,"RegionId":postJson.RegionId,
                "PostAddress":postJson.PostAddress,"PostPerson":postJson.PostPerson,"PostMobile":postJson.PostMobile},
            LinkerList: Details.GetPassengerData(),
            Ak: $("#AK").val() || "",
            IsWifiDeposit : getDepositType || 0,
            IsHaveInsurance: isHasInsure || 0,                //是否含有保险[必传]
            InsuranceType:accident_id || 0,                                       //意外险险种Id
            CancelInsuranceType:cancel_id || 0,                  //取消险险种Id
            ContactCertNo:$(".add_pc .sfcard").val() || ''       //联系人证件号
        };
        var dataJson_noPost ={
            LineId: parseInt(pageConfig.productId) || 0,
            ContactPerson: Details.GetInputValue("#ContactPerson"),
            ContactMoblie: Details.GetInputValue("#ContactMoblie"),
            ContactMail: Details.GetInputValue("#ContactMail"),
            StartDate: $("#mainCal1").val() || "",
            EndDate: $("#mainCal2").val() || "1900-01-01",
            Remark: $('#Inote').val() || '',
            Prices: [],
            ActivityId: pageConfig.hidActivityId,
            PeriodId: parseInt($("#hidPeriodId").val() || 0) || 0,
            ReceiveAddress: $(".selected .receiveplace").attr("nhtml") || '',
            ReturnAddress: $(".selected .returnplace").attr("nhtml") || '',
            ChooseSale: get_chooseSale || '',  //是否选择同程钜惠
            LinkerList: Details.GetPassengerData(),
            Ak: $("#AK").val() || "",
            IsWifiDeposit : getDepositType || 0,
            IsHaveInsurance: isHasInsure || 0,                //是否含有保险[必传]
            InsuranceType:accident_id || 0,                                     //意外险险种Id
            CancelInsuranceType:cancel_id || 0,                  //取消险险种Id
            ContactCertNo:$(".add_pc .sfcard").val() || ""       //联系人证件号
        };
        var dataJson = ($("#mail_place") && $("#mail_place").length !=0)?dataJson_post:dataJson_noPost;
        var isPackageDay = parseInt($("#hidWifiPackageDays").val());
        if(isPackageDay){
            dataJson.WifiPackageDays =  isPackageDay;
        }

        dataJson.Prices = Details.GetCurToSubmitPriceSimpleData();
        if($(".otherBox").length > 0 && $(".user_info .otherNeed").length > 0){
            dataJson = Details.OtherInfo(dataJson);
        }

        if($(".fp_listbox").length !=0){
            //提交订单后的发票信息
            var CId,FpTitle,IsEveryOne = 0,FpName,FpMobile,AddrId = 0,PId,PName,CityId,CityName,RegionId,RegionName,FpStreet,FpType= 3,
                IsEveryOneTitle = 0,
                IsEveryOneInvoice = 0;
            var container = $(".sj-adress-box:not(.none)");
            if($('.fp-box-fill').hasClass('none')){
                FpTitle = Details.replaceSign($('.fp-tt').text());
            }else{
                FpTitle = Details.replaceSign($('.fp-tt-in').val());
            }
            if($('.fp-fwf').hasClass('active-fp-nr')){FpType = 3;}else{FpType = 1;}

            if(!$(".fp-xx").hasClass("none")){
                if($('.fp-adress-write-box').hasClass('none')){
                    FpName = container.find('.sj-name').text();
                    FpMobile = container.find('.sj-tel').text();
                    AddrId = container.attr('data-adressid');
                    PId = container.attr('data-provinceid');
                    PName = container.attr('data-pname');
                    CityId = container.attr('data-cityid');
                    CityName = container.attr('data-cityname');
                    RegionId = container.attr('data-regionid');
                    RegionName = container.attr('data-regionname');
                    FpStreet = Details.replaceSign(container.attr("data-street") || "");
                }else{
                    FpName = $('.fp-adress-name').val();
                    FpMobile = $('.fp-adress-tel').val();
                    AddrId = 0;
                    PId = $('.send-pro').attr('value');
                    PName = $(".send-pro").text().trim();
                    CityId = $('.send-city').attr('value');
                    CityName = $(".send-city").text().trim();
                    RegionId = $('.send-region').attr('value');
                    RegionName = $('.send-region').text().trim();
                    FpStreet = Details.replaceSign($('.J_sendStreet').val() || "");
                }
            }
        }

        $.ajax({
            // url: window.__mod__ + "wanle/api/WanleProduct/WanLeSubOrder",
            url:"http://www.ly.com/wanle/api/WanleProduct/WanLeSubOrder",
            // url:"http://www.ly.com/Wanle/AjaxHelperWanLe/WanLeSubOrder",
            type: 'POST',
            data: {
                order: (JSON.stringify(dataJson)),
                NewPreferentialInfoListStr: (JSON.stringify(curPreferentialInfoList))
            },
            dataType: "json",
            timeout: 1000 * 60,
            success: function (data) {
                var data = data.Data;
                if (data.Status === 100) {
                    //window.location.href = data.Url;
                    //发票提交
                    //提交成功后清空出游人input
                    $(".passenger-info-table input").val("");
                    $(".ui-select-certificate-id").attr("placeholder","请输入证件号码");
                    $(".ui-input-mobile").val("");
                    var dataurl = data.Url;
                    if($(".fp_listbox").length !=0) {
                        if ($('.not-fp').hasClass('fpchecked')) {
                            window.location.href = dataurl;
                            return;
                        } else {
                            data2 = "param=" + encodeURIComponent(JSON.stringify({
                                    "CId": data.CustomerSerialid,
                                    "Title": FpTitle,
                                    "IsEveryOne": IsEveryOne,
                                    "Name": FpName,
                                    "Mobile": FpMobile,
                                    "AddrId": AddrId,
                                    "PId": PId,
                                    "PName": PName,
                                    "CityId": CityId,
                                    "CityName": CityName,
                                    "RegionId": RegionId,
                                    "RegionName": RegionName,
                                    "Street": FpStreet,
                                    "Type": FpType,
                                    "IsEveryOneTitle": IsEveryOneTitle,
                                    "IsEveryOneInvoice": IsEveryOneInvoice
                                }));
                            $.ajax({
                                url: 'http://www.ly.com/dujia/AjaxHelper/InvoiceAjax.ashx?type=SAVEINVOICEINFO',
                                dataType: "jsonp",
                                type: "GET",
                                data: data2,
                                success: function (data) {
                                    window.location.href = dataurl;
                                    return;
                                },
                                error: function () {
                                    window.location.href = dataurl;
                                    return;
                                }
                            });
                        }
                    }else {
                        window.location.href = dataurl;
                        return;
                    }

                } else {
                    Details.SubOrderAjaxFailed(data);
                }
            },
            error: function () {
                Details.SubOrderAjaxFailed();
            }
        });
    },
    SubOrderAjaxFailed: function (data) {
        var errorMsg = "";
        var msgArr = ["下单次数过多", "产品已失效"];

        //下单次数过多
        if (data && (data.ErrMsg.indexOf(msgArr[0]) > -1)) {
            errorMsg = "尊敬的用户您好，您存在未支付订单，请先支付后再下单。<a href='http://member.ly.com/orderlist.aspx?order=1' target='blank'>订单中心</>"
        }

        if (data && (data.ErrMsg.indexOf(msgArr[1]) > -1 || data.ErrMsg.indexOf('账号受限') > -1 || data.ErrMsg.indexOf('黑名单') > -1)) {
            errorMsg = data.ErrMsg;
        }

        //下单失败代码
        Details.PopDialog({
            beforeClose: function () {
                window.location.reload();
            },
            beforeOpen: function () {
                var pop_new = $("#J_orderPop_new");
                pop_new.find("i").show();
                pop_new.find(".reload").show();
                pop_new.find(".oder-pop-contact").show();
                $("#popTitle").html("下单失败");
                $("#popDesc span").html(errorMsg);
                $(".order-pop-tip").addClass("lieCenter");
            }
        });
    },
    //主标题显示影藏点击事件.
    BindMainTitleClick: function () {
        $("#product_title").on("click", ".txt", function (e) {
            if (pageConfig.curDateInputIndex == -1) {
                var oTar = $(".productInfo");
                e.stopPropagation && e.stopPropagation();
                e.preventDefault && e.preventDefault();
                if (oTar.hasClass("current")) {
                    oTar.removeClass("current");
                } else {
                    oTar.addClass("current");
                }
            }
        });
    },
    //加减按钮事件绑定
    bindAddBtn: function () {
        //$(".num_box input").attr('readonly', true);
        if($("#date_calendar").hasClass("oneCal2")){
            $(".num_box input").attr('readonly', true);
        }else{
            $(".num_box input").attr('readonly', false);
        }
        $('#chose_peo').delegate('.chose_peo .num_box a:last-child', 'click', function () {
            if($(this).hasClass("add_btn_false")){
                return;
            }
            var inputBox = $(this).parent().find('.inputbox')[0];
            var curNum = parseInt($(inputBox).val()) || 0;
            $(inputBox).val(curNum + 1);
            $(".first_insure .t4").html(curNum + 1);
            Details.checkSubOrAddBtnCanUse();
            Details.buildFee();
            $("#date_calendar").attr("befor-time",(curNum + 1));

            if($("#VisitorInfoNeed").val() == "1" ){
                if($("#HasInsurance").val() == "true"){
                    $("#needPassengerNum").text(Details.GetNeedPassengersNum());
                }else{
                    $("#needPassengerNum").html("1");
                }

            }else{
                $("#needPassengerNum").text(Details.GetNeedPassengersNum());
            }

            //对需要联系个数差别       0表示不要 1 一单一份 2 一份1人
            if(($("#VisitorInfoNeed").val() == "2") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "1" && $("#HasInsurance").val() == "true") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "0" && $("#HasInsurance").val() == "true")) {
                Details.AddPassenger({
                    PassengerArr: [],
                    AddEmptyNum: 1  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                },2);
            }


            // if($("#HasInsurance").val() == "false"){
            //     $(".hid_accidentInsure").addClass("none");
            // }else {
            //     if($(".insurance").attr("ishas_accident") == 1){                   //选择意外险
            //         if($(".first_insure li").length == 0 ){
            //             $(".player_info .passenger-info-table input").removeClass("inputBeforeSubmitChk");
            //         }else{
            //             $(".player_info .passenger-info-table input").addClass("inputBeforeSubmitChk");
            //         }
            //     }else{                                                //没有选择意外险
            //         $(".player_info .passenger-info-table input").removeClass("inputBeforeSubmitChk");
            //     }
            // }
        });

        $('#chose_peo').delegate('.chose_peo .num_box a:first-child', 'click', function () {
            if($(this).hasClass("sub_btn_false")){
                return;
            }
            var inputBox = $(this).parent().find('.inputbox')[0];
            var curNum = parseInt($(inputBox).val()) || 0;
            $(inputBox).val(curNum - 1);
            $(".first_insure .t4").html(curNum - 1);
            Details.checkSubOrAddBtnCanUse();
            Details.buildFee();
            $("#date_calendar").attr("befor-time",(curNum - 1));
            //对需要联系个数差别

            if($("#VisitorInfoNeed").val() == "1" ){
                if($("#HasInsurance").val() == "true"){
                    $("#needPassengerNum").text(Details.GetNeedPassengersNum());
                }else{
                    $("#needPassengerNum").html("1");
                }

            }else{
                $("#needPassengerNum").text(Details.GetNeedPassengersNum());
            }

            if(($("#VisitorInfoNeed").val() == "2") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "1" && $("#HasInsurance").val() == "true") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "0" && $("#HasInsurance").val() == "true")) {
                Details.AddPassenger({
                    PassengerArr: [],
                    AddEmptyNum: 1  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                },1);
            }
        });
    },
    //获取需要的 出游人信息数   分别为  不需要 一单一人   每张/台一人
    GetNeedPassengersNum: function () {
        if ((pageConfig.VisitorInfoNeed == 0 || pageConfig.VisitorInfoNeed == "0") && $("#HasInsurance").val() == "false") {
            return 0;
        }else if((pageConfig.VisitorInfoNeed == 0 || pageConfig.VisitorInfoNeed == "0") && $("#HasInsurance").val() == "true"){
            //检查所有人数和是否在起小起订人数与最大起订人数之间
            var curPricePersonDataArr = Details.GetCurToSubmitPriceData();
            var curNumArr = _.pluck(curPricePersonDataArr, 'curNum');
            var sum = _.reduce(curNumArr, function (memo, num) {
                return memo + num;
            }, 0);
            return sum;
        }
        else if ((pageConfig.VisitorInfoNeed == 1 || pageConfig.VisitorInfoNeed == "1") && $("#HasInsurance").val() == "false") {
            return 1;
        }else if((pageConfig.VisitorInfoNeed == 1 || pageConfig.VisitorInfoNeed == "1") && $("#HasInsurance").val() == "true"){
            //检查所有人数和是否在起小起订人数与最大起订人数之间
            var curPricePersonDataArr = Details.GetCurToSubmitPriceData();
            var curNumArr = _.pluck(curPricePersonDataArr, 'curNum');
            var sum = _.reduce(curNumArr, function (memo, num) {
                return memo + num;
            }, 0);
            return sum;
        } else {
            //检查所有人数和是否在起小起订人数与最大起订人数之间
            var curPricePersonDataArr = Details.GetCurToSubmitPriceData();
            var curNumArr = _.pluck(curPricePersonDataArr, 'curNum');
            var sum = _.reduce(curNumArr, function (memo, num) {
                return memo + num;
            }, 0);
            return sum;
        }
    },
    checkSubOrAddBtnCanUse: function () {
        var sumPep = 0;
        $(".chose_peo .inputbox").each(function () {

            var curNum = parseInt($(this).val()) || 0,
                curMax = parseInt($(this).attr('max')) || 0,
                curMin = parseInt($(this).attr('min')) || 0,
                lastElem = $("a:last-child", $(this).parent()),
                firstElem = $("a:first-child", $(this).parent());
            sumPep = sumPep + curNum;
            $(this).val(curNum);
            // $(this).val(curMin);

            if (curNum >= curMax) {
                $(this).val(curMax);
                lastElem.addClass('add_btn_false');
            } else {
                lastElem.removeClass('add_btn_false');
            }

            if (curNum <= curMin) {
                // $(this).val(curMin);
                firstElem.addClass('sub_btn_false');
            } else {
                firstElem.removeClass('sub_btn_false');
            }
        });



        //核实预订人数
        if(sumPep >pageConfig.minOrderPerson && sumPep <= pageConfig.maxOrderPerson){
            $(".chose_peo .inputbox").each(function () {
                var curNumList = parseInt($(this).val()) || 0;
                if(curNumList != 0){
                    $("a:first-child", $(this).parent()).removeClass("sub_btn_false");
                }else{
                    $("a:first-child", $(this).parent()).addClass("sub_btn_false");
                }
                if(sumPep == pageConfig.maxOrderPerson){
                    $(".num_box a:last-child").addClass("add_btn_false");
                }
                if(sumPep == pageConfig.minOrderPerson){
                    $(".num_box a:first-child").addClass("sub_btn_false");
                }
            });
        }else if(sumPep <= pageConfig.minOrderPerson){
            $(".num_box a:first-child").addClass("sub_btn_false");
        }else{
            $(".num_box a:last-child").addClass("add_btn_false");
        }

        if($("#VisitorInfoNeed").val() == "2"){
            if(sumPep > pageConfig.maxOrderPerson){
                $("#needPassengerNum").html(pageConfig.maxOrderPerson);
            }else if(sumPep < pageConfig.minOrderPerson){
                $("#needPassengerNum").html(pageConfig.minOrderPerson);
            }else{
                $("#needPassengerNum").html(sumPep);
            }
        }else{
            if(pageConfig.hidProductCategory == "111" && $("#HasInsurance").val() == "true"){
                if(sumPep > pageConfig.maxOrderPerson){
                    $("#needPassengerNum").html(pageConfig.maxOrderPerson);
                }else{
                    $("#needPassengerNum").html(sumPep);
                }
            }
        }

    },
    submitBooking: function (e) {

        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();

        //检查起订天数
        if (pageConfig.hidProductCategory == "92") { //wifi产品
            //改成wifi下第二个日历框必填
            var mainCal2 = $("#mainCal2");
            if (mainCal2.val() == "") {

                Details.PopDialog({
                    beforeOpen: function () {
                        $("#popTitle").html('亲，请选择归还日期！');
                        $(".order-pop-tip").addClass("lieCenter");
                    }
                });
                return false;
            }

            var days = 1;
            days = (Details.NewDate(mainCal2.val()) - Details.NewDate($("#mainCal1").val())) / (24 * 60 * 60 * 1000) + 1; // 如 7号到9号  其实是三天 所以+1
            if (!pageConfig.hidWifiPackageDays && mainCal2.length != 0) {
                if (days < pageConfig.minDay || days > pageConfig.maxDay) {
                    Details.PopDialog({
                        beforeOpen: function () {
                            $("#popTitle").html('当前预定天数小于最小起订天数或大于最大起订天数，不能进行预订哦!');
                            $(".order-pop-tip").addClass("lieCenter");
                            $("#J_orderPop_new .reset").show();
                        }
                    });
                    return false;
                }
            }
        }

        //检查出游人数是否对得上
        var needPassengerNum = parseInt($("#needPassengerNum").html() || 0);
        var hasPassengerNum = $(".passenger_info_list .passenger-info-table").length;

        var min = needPassengerNum - hasPassengerNum;
        var str = "";
        if (min > 0) {
            str = "实际填写出游人数少于所需出游人数！"
        } else if (min < 0) {
            str = "实际填写出游人数大于所需出游人数！"
        }

        if (str != "") {
            Details.PopDialog({
                beforeOpen: function () {
                    $("#popTitle").html(str);
                    $(".order-pop-tip").addClass("lieCenter");
                }
            });
            return false;
        }

        //检查所有人数和是否在起小起订人数与最大起订人数之间
        var curPricePersonDataArr = Details.GetCurToSubmitPriceData();

        var curNumArr = _.pluck(curPricePersonDataArr, 'curNum');
        var sum = _.reduce(curNumArr, function (memo, num) {
            return memo + num;
        }, 0);

        if (sum > pageConfig.maxOrderPerson || sum < pageConfig.minOrderPerson) {

            Details.PopDialog({
                beforeOpen: function () {
                    $("#popDesc span").html('当前预定人数小于最小起订人数或大于最大起订人数，不能进行预订哦!');
                    $(".order-pop-tip").addClass("lieCenter");
                    $("#J_orderPop_new .reset").show();
                }
            });
            return false;
        }

        Details.SubOrderAjax();
    },
    //文本框输入事件
    BindKeyUp: function () {
        var elem = $(".inputbox");
        elem.focus(function () {
            this.select && this.select();
        });

        elem.on("blur",function(){               //前一次输入塞值
            Details.checkSubOrAddBtnCanUse();
            Details.buildFee();

            var get_before_time = $(".rili_date").attr("befor-time");
            if(($("#VisitorInfoNeed").val() == "2") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "1" && $("#HasInsurance").val() == "true") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "0" && $("#HasInsurance").val() == "true")) {
                var now_num = $(this).val();
                var add_num = now_num - get_before_time;
                if ((now_num - get_before_time) >= 0) {      //直接根据是否大于0做判断
                    Details.AddPassenger({
                        PassengerArr: [],
                        AddEmptyNum: add_num //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                    },2);
                } else {
                    Details.AddPassenger({
                        PassengerArr: [],
                        AddEmptyNum: Math.abs(add_num)  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                    },1);
                }
                $(this).attr("befor-time",$(this).val());
                $("#date_calendar").attr("befor-time",$(this).val());
            }
        });

    },

    //取还地址选中事件
    BindGetOrReturnAdress: function () {
        $("#getback_place").on("click", ".chose_adress", function () {
            var _self_adress = $(this);
            _self_adress.addClass("selected");
            _self_adress.siblings(".chose_adress").removeClass("selected");
        });
    },
    //更多取还地址按钮事件
    moreAddress:function(){
        //是否显示更多地址按钮
        if($(".getback .productInfo li .receiveplace").length > 4 || $(".getback .productInfo li .returnplace").length > 4){
            $(".more_address a").css("display","block");
        }else{
            $(".more_address a").css("display","none");
        }

        $(".more_address a").on("click",function(){
            if($(this).html() == "更多地址"){
                $(".getback .productInfo .list_right p").removeClass("none");
                //$(".getback .productInfo .list_right p").removeClass("none");
                $(this).html("收起");
            }else if($(this).html() == "收起"){
                $(".getback .productInfo .list_right p").each(function(){
                    if($(this).index() == 0 || $(this).index() == 1 || $(this).index() == 2 || $(this).index() == 3){
                        $(this).removeClass("none");
                    }else{
                        $(this).addClass("none");
                    }
                });
                $(this).html("更多地址");
            }
        });
    },
    //押金选中事件
    BindGetDeposit: function () {
        $("#deposit_sel").on("click", ".chose_adress", function () {
            var _self_adress = $(this);
            _self_adress.addClass("selected");
            _self_adress.siblings(".chose_adress").removeClass("selected");

            $(".inputbox").each(function (index, elem) {
                var totalPriceSum = 0;
                var all_eachPriceSum = 0;
                //var eachPriceSum = 0;
                //var eachdeposit = 0;

                var thisPrice = parseInt($(elem).attr("data-price")) || 0;
                var thisNum = parseInt($(elem).val()) || 0;
                var getPrePayAmount = parseInt($(".radio_word em").html()) || 0;
                var getdisPrice =  parseInt($("#discountPrice").html().split("元")[0]) || 0;

                eachPriceSum = thisPrice * thisNum;
                eachdeposit = getPrePayAmount * thisNum;

                if($(".pay_online").hasClass("selected")){
                    totalPriceSum = eachPriceSum + eachdeposit + getdisPrice;
                    $(".hid_deposit").css("display","block");
                }else if($(".pay_now").hasClass("selected")){
                    all_eachPriceSum += eachPriceSum;
                    totalPriceSum = all_eachPriceSum + getdisPrice;
                    $(".hid_deposit").css("display","none");
                }
                $(".f_price").html(totalPriceSum);
                $("#f_price_orginal").html(totalPriceSum);
                $("#f_price_orginal").val(totalPriceSum);
                $("#totalprice").html(totalPriceSum);
            });
        });

    },
    //常用旅客验证
    BindInputValidate: function () {
        //常用旅客信息生日、身份证、中文名、电话、国家
        $(".ui-input-birthday,.ui-select-certificate-id,.ui-input-nameZh,.ui-input-mobile,.ui-input-country").on("focus", function () {
            var _target = $(this).parent().find("input");
            _target.css("border-color", "#76bbff");
            $(this).siblings("span").addClass("none");
            //$(this).css("color", "#333");
            var _text = $(this).attr("attr-value");
            if (_text == $(this).val()) {
                $(this).css("color", "#333");
            }
        });
        //常用旅客信息英文名
        $(".ui-input-first-name,.ui-input-last-name").on("focus",function(){
            var _target = $(this).parent().find("input");
            _target.css("border-color", "#76bbff");
            $(this).siblings("span").addClass("none");
            var _text = $(this).val();
            if (_text == "须与证件上信息一致") {
                $(this).val("");
                $(this).css("color", "#333");
            }
        });
        var verify = {
            playerName: function () {
                var reg = /^[\u4e00-\u9fa5]*$/,
                    playName = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (playName == "" || playName == "请填写出游人姓名") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*出游人姓名不能为空");
                    return false;
                } else {
                    if (reg.test(playName)) {
                        return true;
                    } else {
                        validSymbol.removeClass("none");
                        validSymbol.html("*出游人姓名错误");
                        return false;
                    }
                }
            },
            pc_zheng: function () {                         //身份证号码
                var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
                    pc_zheng_input = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (pc_zheng_input == "" || pc_zheng_input == "请输入证件类型") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*证件号码不能为空");
                    return false;
                } else {
                    if (reg.test(pc_zheng_input)) {
                        return true;
                    } else {
                        validSymbol.removeClass("none");
                        validSymbol.html("*证件号码格式错误");
                        return false;
                    }
                }
            },
            pc_zheng2: function () {
                var pc_zheng_input2 = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (pc_zheng_input2 == "" || pc_zheng_input2 == "请输入证件类型") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*证件号码不能为空");
                    return false;
                } else {
                    validSymbol.css("display", "none");
                    return true;
                }
            },
            pc_zheng_taiwai:function(){                         //台湾通行证
                //var reg = /^[a-z][A-Z][0-9]{5,15}$/,
                var reg = /^(\w){5,15}$/,
                    pc_zheng_input3 = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (pc_zheng_input3 == "" || pc_zheng_input3 == "请输入证件类型") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*证件号码不能为空");
                    return false;
                } else {
                    if (reg.test(pc_zheng_input3)) {
                        return true;
                    } else {
                        validSymbol.removeClass("none");
                        validSymbol.html("*证件号码格式错误");
                        return false;
                    }
                }
            },
            birthday: function () {
                var is_birthday = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (is_birthday == "" || is_birthday == "请输入生日") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*出游人生日不能为空");
                    return false;
                } else {
                    validSymbol.css("display", "none");
                    return true;
                }
            },
            country: function () {
                var is_country = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (is_country == "" || is_country == "请输入国籍") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*出游人国籍不能为空");
                    return false;
                } else {
                    return true;
                }
            },
            playerPhone: function () {
                var reg = /^0?(13|14|15|18|17)[0-9]{9}$/,
                    playMobile = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");
                if (playMobile == "" || playMobile == "请输入手机号码") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*手机号不能为空");
                    return false;
                } else {
                    if (reg.test(playMobile)) {
                        return true;
                    } else {
                        validSymbol.removeClass("none");
                        validSymbol.html("*手机号格式错误");
                        return false;
                    }
                }
            },
            en_name_first: function () {
                var reg = /^[A-Za-z]+$/,
                    enName = $(this).val().replace(/\s+/g, ""),
                    validSymbol = $(this).siblings(".valid_symbol");

                if (enName == "" || enName == "须与证件信息一致") {
                    validSymbol.css("display", "inline-block");
                    validSymbol.html("*英文名不能为空");
                    return false;
                } else {
                    if (reg.test(enName)) {
                        validSymbol.css("display", "none");
                        return true;
                    } else {
                        validSymbol.css("display", "inline-block");
                        validSymbol.html("*英文名错误");
                        return false;
                    }
                }
            }

        };
        //失去焦点直接进行验证
        var passengerTimer = $(".PassengerTimer_New");
        passengerTimer.find(".ui-input-nameZh").on("blur", function () {
            var b = verify.playerName.call(this);
            bindVerifyRelative(this,b);
            return b;
        });
        passengerTimer.find(".sfcard").on("blur", function () {
            var b = verify.pc_zheng.call(this);
            var _targetBlur = $(this).parent().find("input"),
                validSymbol = _targetBlur.siblings(".valid_symbol");
            if (b) {
                validSymbol.css("display", "none");
                Details.isFalse.call(this);
            } else {
                _targetBlur.css("border-color", "red");
                validSymbol.css("display", "inline-block");
            }
            return b;
        });
        passengerTimer.find(".notsfcard").on("blur", function () {
            var b = verify.pc_zheng2.call(this);
            if (b) {
                Details.isFalse.call(this);
            } else {
                var _targetBlur = $(this).parent().find("input"),
                    validSymbol = _targetBlur.siblings(".valid_symbol");
                _targetBlur.css("border-color", "red");
                validSymbol.css("display", "inline-block");
            }
            return b;
        });
        passengerTimer.find(".taiwancard").on("blur", function () {
            var b = verify.pc_zheng_taiwai.call(this);
            var _targetBlur = $(this).parent().find("input"),
                validSymbol = _targetBlur.siblings(".valid_symbol");
            if (b) {
                validSymbol.css("display", "none");
                Details.isFalse.call(this);
            } else {
                _targetBlur.css("border-color", "red");
                validSymbol.css("display", "inline-block");
            }
            return b;
        });
        passengerTimer.find(".ui-input-first-name").on("blur", function () {
            var b = verify.en_name_first.call(this);
            bindVerifyRelative(this,b);
            return b;
        });
        passengerTimer.find(".ui-input-last-name").on("blur", function () {
            var b = verify.en_name_first.call(this);
            bindVerifyRelative(this,b);
            return b;
        });
        passengerTimer.find(".ui-input-mobile").on("blur", function () {
            var b = verify.playerPhone.call(this);
            bindVerifyRelative(this,b);
        });
        passengerTimer.find(".ui-input-birthday").on("blur", function () {
            var b = verify.birthday.call(this);
            if (b) {
                Details.isFalse.call(this);
            } else {
                var _targetBlur = $(this).parent().find("input"),
                    _targetSibling = _targetBlur.siblings(".valid_symbol");
                _targetBlur.css("border-color", "red");
                _targetSibling.removeClass("none");
                _targetSibling.html("*出游人生日为空");
                _targetSibling.css("display", "inline-block");
            }
        });
        passengerTimer.find(".ui-input-country").on("blur", function () {
            var b = verify.country.call(this);
            bindVerifyRelative(this,b);
        });
        function bindVerifyRelative(e,b){
            if (b) {
                Details.isFalse.call(e);
            } else {
                var _targetBlur = $(e).parent().find("input");
                _targetBlur.css("border-color", "red");
                _targetBlur.siblings(".valid_symbol").removeClass("none");
            }
        }
    },
    //邮寄信息和联系人验证
    postAnd_Linkuser: function () {
        $("#ContactPerson,#ContactMoblie,#ContactMail,#postperson,#postmobile,#postaddress,.con_name,.sfcard").on("focus", function () {
            var _target = $(this).parent().find("input");
            _target.css("border-color", "#76bbff");
            $(this).siblings("span").addClass("none");
            $(this).css("color", "#333");
            var _text = $(this).attr("attr-value");
            if (_text == $(this).val()) {
                _target.val("");
                //$(this).css("color", "#333");
            }
        });

        function infoWrap(elemConfig){
            var _parent = elemConfig._parent;
            if(_parent.parent().hasClass("none")){
                return;
            }
            if (elemConfig.curElem == "" || elemConfig.curElem == "请填写"+elemConfig.edition+"") {
                _parent.val(_parent.attr('attr-value')).css({ 'color': '#ddd', "border": "1px solid red" }).addClass("error");
                _parent.siblings(elemConfig.errorElem).html(elemConfig.errorInfo).removeClass("none");
                return false;
            } else {
                if (elemConfig.reg.test(elemConfig.curElem)) {
                    return true;
                } else {
                    _parent.css({ "border": "1px solid red" }).addClass("error");
                    _parent.siblings(elemConfig.errorElem).html(elemConfig.errorFormat).removeClass("none");
                    return false;
                }
            }
        }

        var verify = {
            userName: function () {
                var reg = /^[\u4e00-\u9fa5]*$/,
                    person = $("#ContactPerson"),
                    bxName = person.val().replace(/\s+/g, "");
                infoWrap({
                    reg: reg,
                    _parent: person,
                    curElem: bxName,
                    edition: "联系人",
                    errorInfo: "*联系人姓名不能为空",
                    errorFormat: "*联系人姓名错误",
                    errorElem: ".error_info"
                });
            },
            mobile: function () {
                var reg = /^0?(13|14|15|18|17)[0-9]{9}$/,
                    mobile = $("#ContactMoblie"),
                    bxMobile = mobile.val().replace(/\s+/g, "");
                infoWrap({
                    reg: reg,
                    _parent: mobile,
                    curElem: bxMobile,
                    edition: "手机号码",
                    errorInfo: "*手机号码不能为空",
                    errorFormat: "*手机号码格式错误",
                    errorElem: ".error_info"
                });
            },
            mail: function () {
                var reg = /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i,
                    mail = $("#ContactMail"),
                    bxMail = mail.val().replace(/\s+/g, "");
                infoWrap({
                    reg: reg,
                    _parent: mail,
                    curElem: bxMail,
                    edition: "电子邮箱",
                    errorInfo: "*邮箱不能为空",
                    errorFormat: "*邮箱格式错误",
                    errorElem: ".error_info"
                });
            },

            mail_name: function () {
                var reg = /^[\u4e00-\u9fa5_a-zA-Z]{1,20}$/,
                    postPerson = $("#postperson"),
                    mailName = postPerson.val().replace(/\s+/g, "");
                infoWrap({
                    reg: reg,
                    _parent: postPerson,
                    curElem: mailName,
                    edition: "收件人姓名",
                    errorInfo: "*收件人姓名不能为空",
                    errorFormat: "*收件人姓名格式错误,只能输入中文和字母,长度20",
                    errorElem: ".valid_symbol"
                });
            },
            mail_phone: function () {
                var reg = /^0?(13|14|15|18|17)[0-9]{9}$/,
                    postMobile = $("#postmobile"),
                    bxMobile = postMobile.val().replace(/\s+/g, "");
                infoWrap({
                    reg: reg,
                    _parent: postMobile,
                    curElem: bxMobile,
                    edition: "手机号码",
                    errorInfo: "*手机号码不能为空",
                    errorFormat: "*手机号码格式错误",
                    errorElem: ".valid_symbol"
                });
            },
            mail_address: function () {
                var postAddress = $("#postaddress"),
                    mailName = Details.replaceSign(postAddress.val().replace(/\s+/g, ""));
                if (mailName == "" || mailName == "请填写详细地址例：江苏省苏州市园区同程旅游") {
                    postAddress.val(postAddress.attr('attr-value')).css({ 'color': '#ddd', "border": "1px solid red" }).addClass("error");
                    postAddress.siblings(".valid_symbol").html("*详细地址不能为空").removeClass("none");
                    return false;
                } else {
                    return true;
                }
            },

            remark: function () {
                var conName = $(".con_name"),
                    remarkinfo = conName.val().replace(/\s+/g, "");
                if (remarkinfo == "" || remarkinfo == "请填写出游人姓名") {
                    conName.val(conName.attr('attr-value')).css({ 'color': '#ddd' });
                    return false;
                } else {
                    return true;
                }
            }
        };

        $(".con_name").on("blur", function () {
            var _targetBlur = $(this).parent().find("textarea");
            if ($("#RemarkNeed").val() == 1) {
                if (verify.remark()) {
                    _targetBlur.css("border-color", "#ddd");
                    _targetBlur.siblings("p").css("color", "#999");
                    _targetBlur.siblings("em").css("display", "none");
                } else {
                    _targetBlur.css("border-color", "red");
                    _targetBlur.siblings("em").css({"display":"block","color":"red"})
                }
            }
        });

        $("#ContactPerson").on("blur", function () {
            if (verify.userName()) {
                Details.isFalse.call(this);
            }
        });

        $("#ContactMoblie").on("blur", function () {
            if (verify.mobile()) {
                Details.isFalse.call(this);
            }
        });
        $("#ContactMail").on("blur", function () {
            if (verify.mail()) {
                Details.isFalse.call(this);
            }
        });
        $("#postperson").on("blur", function () {
            if (verify.mail_name()) {
                Details.isFalse.call(this);
            }
        });
        $("#postmobile").on("blur", function () {
            if (verify.mail_phone()) {
                Details.isFalse.call(this);
            }
        });
        $("#postaddress").on("blur", function () {
            if (verify.mail_address()) {
                Details.isFalse.call(this);
            }
        })
    },
    //邮寄信息异步及事件绑定
    BindPostInfoAjax: function () {
        // console.log(window.__mod__ + "/wanle/api/WanleProduct/QueryAddress?MemberId=")
        $.ajax({
            // url: window.__mod__ + "/wanle/AjaxHelperWanLe/QueryAddress?MemberId=" + pageConfig.memberId,
            url: "http://www.ly.com/wanle/api/WanleProduct/QueryAddress?MemberId=" + pageConfig.memberId,
            dataType: "jsonp",
            success: function (data) {
                if (data.Status == "Success" && data.Data.AddressList != null) {
                    pageConfig.AddressList = data.Data.AddressList;

                    $($("#PostManTemp").tmpl(pageConfig.AddressList)).insertBefore("#selfInputAddrDiv");

                    if($("#select_address_list .piaocheckedTwo").length > 0){
                        $("#select_address_list .piaocheckedTwo")[0].click();  //默认不是手动选择了，默认是第一个
                    }
                    var mailBtn = $(".mail_place .look_btn");
                    if (data.Data.AddressList.length > 2) {
                        mailBtn.css("display", "block");
                        $(".height_address").css("height", "55px");
                        mailBtn.find(".look_all").on("click", function () {
                            if ($(this).hasClass("look_all_up")) {
                                $(".height_address").css("height", "auto");
                                $(".height_address").css("padding-bottom", "0");
                                $(this).removeClass("look_all_up").addClass("look_all_down");
                                $(this).siblings("i").removeClass("point_down").addClass("point_up");
                            } else {
                                $(".height_address").css("height", "55px");
                                $(".height_address").css("padding-bottom", "10px");
                                $(this).removeClass("look_all_down").addClass("look_all_up");
                                $(this).siblings("i").removeClass("point_up").addClass("point_down");
                            }
                        });
                    } else {
                        mailBtn.css("display", "none");
                        $(".height_address").css("height", "auto");
                    }
                }
            }
        });
    },
    //发票
    ClickBill:function(){
        $(".fp-radio").on("click", function() {
            // var us = $.cookie("us");
            //var userid = null;
            var self = $(this),ele = 0;
            // if (us != null) {
            //     var name = 'userid';
            //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            //     var r = us.match(reg);
            //     if (r != null)
            //         userid = unescape(r[2]);
            // }
            var userid = getMemberId();
            if (userid == null || userid == "" || userid == 0 || userid == undefined) {
                document.domain = "ly.com";
                $(".login_bg_bag").show();
                $(".mLogin_iframe").show();
                return;
            }
            var radioId = $(this).attr('name');
            $('.fp-radio').removeClass('fpchecked') && $(this).addClass('fpchecked');
            $('#need-fp,#not-fp').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
            var fpvalue = $('.need-fp');
            if (fpvalue.hasClass('fpchecked')) {
                $('.J_sendStreet').css({
                    color: '#999'
                });
                $('.fp-adress-fill').css({
                    color: '#999'
                });
            }
            if($('.fp-adress-write-box').hasClass('left64')){
                $('.fp-adress-write-box').removeClass('left64');
            }
            Details.BillPerson();
            Details.BillDialog();
        });
        //修改发票
        $('.fp-xx3').on("click",function(){

            $('.sj-adress-box').addClass('left12');
            if (!$('.fp-adress-write-box').hasClass('none')|| !$('.fp-tt-in').hasClass('none')){
                Details.BillPerson(BillPostInfo.ele);
            }
            $('.fp-adress-write-box').addClass('none');
            //$('.sj-adress-box').eq(0).removeClass('none');
            $('.sjlist').addClass('none');
            $('.J_sendStreet').css({
                color: '#999'
            });
            $('.fp-adress-fill').css({
                color: '#999'
            });
            $('.J_change_Adr').removeClass('none');
            Details.BillDialog();
        });
    },
    //发票弹框
    BillDialog:function(){
        var winWidth = Details.getClientWidth();
        var winHeight = Details.getClientHeight();
        var Popleft = (winWidth -$(".form-fp").width())/2;
        var Poptop = (winHeight -$(".form-fp").height())/2;

        $(".J_fp_bg").css("display","block");
        $(".form-fp").css("display","block");
        $(".form-fp").css("left",+Popleft+"px");
        $(".form-fp").css("top",+Poptop+"px");

        $(".fp-content input").on("focus",function(){
            var text_value = $(this).val();
            var text_attr = $(this).attr("attr-value");
            if(text_attr == text_value){
                $(this).val("");
            }
            $(this).css("color","#333");
        })
    },
    BillAction: function () {
        //不需要发票
        $(".not-fp").on("click", function() {
            $(".fp-xx,.lb-info").addClass('none');
        });
        //发票填写取消
        $(".close-dia-fp,.fp-cancel").on("click", function() {
            if (!$('.fp-radio').hasClass('Fp_hasSave')) {
                $('.fp-radio').removeClass('fpchecked');
                $('.not-fp').addClass('fpchecked');
            }
            $(".J_fp_bg").css("display","none");
            $(".form-fp").css("display","none");
            //$('#J_fp_post').reset;
            //点击取消的时候，重置发票内容
            Details.resetInfo();
        });
        //修改抬头
        $('.fp-change').on("click", function() {
            $(".fp-ttbox").addClass('none');
            $('.default-tt').eq(0).removeClass('none');
            $(".fp-tt-in").addClass('change-tt');
            $('.fp-box-fill').removeClass('none');
        });
        //发票内容
        $('.fy-choice').on("click",function(){
            var self = $(this);
            if(self.hasClass('active-fp-nr')){
                return;
            }else{
                $('.fy-choice').removeClass('active-fp-nr');
                self.addClass('active-fp-nr');
            }
        });
        //默认抬头
        $('.fp-cb-default').on("click",function(){
            var fp_tt_default = $('.fp-cb-default');
            if(fp_tt_default.hasClass('sjchecked')){
                fp_tt_default.removeClass('sjchecked');
            }else{
                fp_tt_default.addClass('sjchecked');
            }
        });
        //发票内容
        $('.fy-choice').on("click",function(){
            var self = $(this);
            if(self.hasClass('active-fp-nr')){
                return;
            }else{
                $('.fy-choice').removeClass('active-fp-nr');
                self.addClass('active-fp-nr');
            }
        });
    },
    //发票收件人
    BillPerson:function(ele){
        var html1="",html2="",html3="";
        $.ajax({
            url: "http://www.ly.com/dujia/AjaxHelper/InvoiceAjax.ashx?type=GETINVOICEBASEINFO",
            type: 'GET',
            dataType: 'jsonp',
            success: function (data1) {
                if(data1.data.Title.Name){
                    $('.fp-tt').text(data1.data.Title.Name);
                    $('.fp-tt').attr('data-id', data1.data.Title.Id);
                    $('.fp-box-fill').addClass('none');
                    $('.fp-ttbox').removeClass('none');
                    $('.default-tt').eq(0).addClass('none');
                }else{
                    $('.fp-box-fill').removeClass('none');
                    $('.fp-ttbox').addClass('none');
                    $('.default-tt').eq(0).removeClass('none');
                }
                if (data1.data.Address != null && data1.data.Address !=''){
                    $('.fp-adress-write-box').addClass('none');
                    $('.J-adbox').removeClass('none');
                    $('.sjlist').removeClass('none');
                    for( var i = 0; i < data1.data.Address.length; i ++){
                        var name = data1.data.Address[i].Name,
                            phone = data1.data.Address[i].Mobile,
                            provinceId = data1.data.Address[i].ProvinceId,
                            provinceName = data1.data.Address[i].Province,
                            cityId = data1.data.Address[i].CityId,
                            cityName = data1.data.Address[i].City,
                            regionId = data1.data.Address[i].RegionId,
                            regionName =data1.data.Address[i].Region,
                            addressId = data1.data.Address[i].Id,
                            street =data1.data.Address[i].Street;
                        if(i == 0){
                            html1 += '<label class="sj-radio sjchecked" title="'+name+'">'+name+'</label>';
                            html3 +=
                                '<div class="sj-adress-box" data-pname="'+provinceName+'" data-street="'+street+'" ' +
                                'data-regionname="'+regionName+'" data-cityname="'+cityName+'" data-regionid="'+regionId+'" data-cityid="'+cityId+'" ' +
                                'data-provinceid="'+provinceId+'" data-adressid="'+addressId+'">' +
                                '<i></i>' +
                                '<div class="sj-adress-content">' +
                                '<span class="sj-name">'+name+'</span>' +
                                '<span class="sj-tel">'+phone+'</span>' +
                                '<span class="J_change_Adr none">修改</span>' +
                                '</div>' +
                                '<div class="sj-adress-content">' +
                                '<span>'+provinceName+'</span><span>'+cityName+'</span><span>'+regionName+'</span><span>'+street+'</span>' +
                                '</div>' +
                                '</div>';
                        }else{
                            html1 += '<label class="sj-radio" title="'+name+'">'+name+'</label>';
                            html3 +=
                                '<div class="sj-adress-box none" data-pname="'+provinceName+'" data-street="'+street+'" ' +
                                'data-regionname="'+regionName+'" data-cityname="'+cityName+'" data-regionid="'+regionId+'" data-cityid="'+cityId+'" ' +
                                'data-provinceid="'+provinceId+'" data-adressid="'+addressId+'">' +
                                '<i></i>' +
                                '<div class="sj-adress-content">' +
                                '<span class="sj-name">'+name+'</span>' +
                                '<span class="sj-tel">'+phone+'</span>' +
                                '<span class="J_change_Adr none">修改</span>' +
                                '</div>' +
                                '<div class="sj-adress-content">' +
                                '<span>'+provinceName+'</span><span>'+cityName+'</span><span>'+regionName+'</span><span>'+street+'</span>' +
                                '</div>' +
                                '</div>';
                        }
                    }
                    html2 = html1 +"<i class='sjr-sf'></i>"+ "<span class='add-sjr'><i></i>"+"<em>添加收件人</em></span>";
                    $(".sjlist").html(html2);
                    $('.J-adbox').html(html3);
                    $('.sj0').addClass('sjchecked');
                    if(ele === 1 ){
                        $('.sjlist').addClass('none');
                        $('.J_change_Adr').removeClass('none');
                        $('.sj-adress-box').addClass('left12');
                        $('.sj-adress-box').addClass('none');
                        $('.J-adbox').append(BillPostInfo.onePost);
                    }else if(ele === 2){
                        $('.sjlist').addClass('none');
                        $('.J_change_Adr').removeClass('none');
                        $('.sj-adress-box').addClass('left12');
                    }
                    //添加收件人
                    $('.add-sjr').on("click",function(){
                        $('.sj-radio').removeClass('sjchecked');
                        $('.sj-adress-box').addClass('none');
                        $('.fp-adress-write-box').removeClass('none').addClass('left64');

                    });
                    //选择收件人
                    $('.sj-radio').on("click",function(){
                        var radioId = $(this).attr('name');
                        var container = $('.J-adbox');
                        var index_ad = $(this).index();
                        $('.sj-radio').removeClass('sjchecked') && $(this).addClass('sjchecked');
                        $('.radio-sj').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
                        container.find('.sj-adress-box').addClass('none');
                        container.find('.sj-adress-box').eq(index_ad).removeClass('none');
                        $('.fp-adress-write-box').addClass('none');
                        BillPostInfo.onePost = container.find('.sj-adress-box').eq(index_ad);
                    });
                    //修改联系人
                    $('.J_change_Adr').on("click",function(){
                        $('.sj-adress-box').removeClass('left12');
                        $('.sj-adress-box').addClass('none');
                        $('.sj-adress-box').eq(0).removeClass('none');
                        $('.sjlist').removeClass('none');
                        $('.sjlist').css('height', '27px');
                        $('.J_change_Adr').addClass('none');
                    });
                    //收件人收放
                    $('.sjr-sf').on("click",function(){
                        var add_list = $('.sjlist'),
                            self = $(this);
                        if (self.hasClass('sjr-ss')) {
                            add_list.css('height', '27px');
                            self.removeClass('sjr-ss');
                        }else{
                            add_list.css('height', 'auto');
                            self.addClass('sjr-ss');
                        }

                    });
                }else{
                    $('.fp-adress-write-box').removeClass('none');
                    $('.sj-adress-box').addClass('none');
                    $('.sjlist').addClass('none');
                    $('.J-adbox').addClass('none');
                }
            },
            error:function(){
                $('.sjlist').addClass('none');
                $('.fp-box-fill').removeClass('none');
                $('.fp-ttbox').addClass('none');
                $('.fp-adress-write-box').removeClass('none');
                $('.sj-adress-box').addClass('none');
                $('.J-adbox').addClass('none');
            }
        })
    },
    //发票信息失去焦点后验证
    BillBlur: function () {
        var fptitleInput = $('.fp-tt-in');
        fptitleInput.on("blur", function () {
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333',
                    border: "1px solid #ddd"
                });
                Details.BillVerify(1,"",fptitleInput);
                BillPostInfo.Title = 1;
            }else{
                fptitleInput.css({
                    color: '#999',
                    border:"1px solid #ff7800"
                });
                Details.BillVerify(0,"请填写正确抬头",fptitleInput);
                BillPostInfo.Title = 0;
            }
        });
        fptitleInput.on("focus", function () {
            fptitleInput.siblings("span").addClass("none");
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333 ',
                    border: "1px solid #ddd"
                });
            }else{
                fptitleInput.css({
                    border: "1px solid #ddd"
                });
            }
        }).on("keydown", function () {
            if(fptitleInput.val() != "请填写增加个人或公司名称"){
                fptitleInput.css({
                    color: '#333 '
                });
            }
        });
        var cityInput = $('.fp-adress-name');
        cityInput.on("blur", function () {
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333',
                    width: '160px',
                    border: "1px solid #ddd"
                });
                var verIndex = Details.BillVerifyIndex(cityInput.val());
                if(verIndex == 1){
                    Details.BillVerify(verIndex,"",cityInput);
                    BillPostInfo.postName = 1;
                }else{
                    Details.BillVerify(verIndex,"姓名格式不正确",cityInput);
                    BillPostInfo.postName = 0;
                }
            }else{
                cityInput.css({
                    color: '#999',
                    width: '150px',
                    border:"1px solid #ff7800"
                });
                Details.BillVerify(0,"请输入联系人姓名",cityInput);
                BillPostInfo.postName = 0;
            }
        });
        cityInput.on("focus", function () {
            cityInput.siblings("span").addClass("none");
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333 ',
                    width: '160px',
                    border: "1px solid #ddd"
                });
            }else{
                cityInput.css({
                    border: "1px solid #ddd"
                });
            }
        }).on("keydown", function () {
            if(cityInput.val() != "姓名"){
                cityInput.css({
                    color: '#333 ',
                    width: '160px'
                });
            }
        });
        var telInput = $('.fp-adress-tel');
        telInput.on("blur", function () {
            if(telInput.val() != "手机号码"){
                var reg = /^0?(13|14|15|18|17)[0-9]{9}$/,
                    bxMobile = telInput.val().replace(/\s+/g, "");
                var test = reg.test(bxMobile);
                if(test){
                    telInput.css({
                        color: '#333',
                        border: "1px solid #ddd"
                    });
                    Details.BillVerify(1,"",telInput);
                    BillPostInfo.postMobile = 1;
                }else{
                    telInput.css({
                        color: '#999',
                        border: "1px solid #ff7800"
                    });
                    Details.BillVerify(0,"请输入正确手机号码",telInput);
                    BillPostInfo.postMobile = 0;
                }

            }else{
                telInput.css({
                    color: '#999',
                    border: "1px solid #ff7800"
                });
                Details.BillVerify(0,"请输入手机号码",telInput);
                BillPostInfo.postMobile = 0;
            }
        });
        telInput.on("focus", function () {
            telInput.siblings("span").addClass("none");
            telInput.siblings("span").addClass("error_bill");
            telInput.siblings("span").removeClass("true_bill");
            if(telInput.val() != "手机号码"){
                telInput.css({
                    color: '#333 ',
                    border: "1px solid #ddd"
                });
            }else{
                telInput.css({
                    border: "1px solid #ddd"
                });
            }
        }).on("keydown", function () {
            if(telInput.val() != "手机号码"){
                telInput.css({
                    color: '#333 '
                });
            }
        });
        var adressInput = $('.J_sendStreet');
        adressInput.on("blur", function () {
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333',
                    border:"1px solid #ddd"
                });
                Details.BillVerify(1,"",adressInput);
                BillPostInfo.address = 1;
            }else{
                adressInput.css({
                    color: '#999',
                    border:"1px solid #ff7800"
                });
                Details.BillVerify(0,"请填写街道地址",adressInput);
                BillPostInfo.address = 0;
            }
        });
        adressInput.on("focus", function () {
            adressInput.siblings("span").addClass("none");
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333 ',
                    border: "1px solid #ddd"
                });
            }else {
                adressInput.css({
                    border: "1px solid #ddd"
                });
            }
        }).on("keydown", function () {
            if(adressInput.val() != "不需要重复填写省市区"){
                adressInput.css({
                    color: '#333 '
                });
            }
        });
    },
    //发票提交验证
    BillSubVerify:function(){
        var fptitleInput = $('.fp-tt-in');
        if(fptitleInput.val() != "请填写增加个人或公司名称"){
            fptitleInput.css({
                color: '#333',
                border: "1px solid #ddd"
            });
            Details.BillVerify(1,"",fptitleInput);
            BillPostInfo.Title = 1;
        }else{
            fptitleInput.css({
                color: '#999',
                border:"1px solid #ff7800"
            });
            Details.BillVerify(0,"请填写正确抬头",fptitleInput);
            BillPostInfo.Title = 0;
        }

        var cityInput = $('.fp-adress-name');
        if(cityInput.val() != "姓名"){
            cityInput.css({
                color: '#333',
                width: '160px',
                border: "1px solid #ddd"
            });
            var verIndex = Details.BillVerifyIndex(cityInput.val());
            if(verIndex == 1){
                Details.BillVerify(verIndex,"",cityInput);
                BillPostInfo.postName = 1;
            }else{
                Details.BillVerify(verIndex,"姓名格式不正确",cityInput);
                BillPostInfo.postName = 0;
            }
        }else{
            cityInput.css({
                color: '#999',
                width: '150px',
                border:"1px solid #ff7800"
            });
            Details.BillVerify(0,"请输入联系人姓名",cityInput);
            BillPostInfo.postName = 0;
        }

        var telInput = $('.fp-adress-tel');
        if(telInput.val() != "手机号码"){
            var reg = /^0?(13|14|15|18|17)[0-9]{9}$/,
                bxMobile = telInput.val().replace(/\s+/g, "");
            var test = reg.test(bxMobile);
            if(test){
                telInput.css({
                    color: '#333',
                    border: "1px solid #ddd"
                });
                Details.BillVerify(1,"",telInput);
                BillPostInfo.postMobile = 1;
            }else{
                telInput.css({
                    color: '#999',
                    border: "1px solid #ff7800"
                });
                Details.BillVerify(0,"请输入正确手机号码",telInput);
                BillPostInfo.postMobile = 0;
            }

        }else{
            telInput.css({
                color: '#999',
                border: "1px solid #ff7800"
            });
            Details.BillVerify(0,"请输入手机号码",telInput);
            BillPostInfo.postMobile = 0;
        }

        var adressInput = $('.J_sendStreet');
        if(adressInput.val() != "不需要重复填写省市区"){
            adressInput.css({
                color: '#333',
                border:"1px solid #ddd"
            });
            Details.BillVerify(1,"",adressInput);
            BillPostInfo.address = 1;
        }else{
            adressInput.css({
                color: '#999',
                border:"1px solid #ff7800"
            });
            Details.BillVerify(0,"请填写街道地址",adressInput);
            BillPostInfo.address = 0;
        }

    },
    //发票信息验证是否为空
    BillVerify:function(index,message,selector){//index---验证状态，message---验证信息提示，selector---对象
        if(index == 1){
            //验证通过
            selector.siblings("span").removeClass("none");
            selector.siblings("span").removeClass("error_bill").addClass("true_bill");
            selector.siblings("span").find("span").addClass("none");
        }else{
            //验证不通过
            selector.siblings("span").removeClass("none");
            selector.siblings("span").removeClass("true_bill").addClass("error_bill");
            selector.siblings("span").find("span").removeClass("none").html(message);
        }
    },
    //姓名验证
    BillVerifyIndex :function(obj){
        var reg = /^[\u4e00-\u9fa5]*$/,
            playName = obj.replace(/\s+/g, "");
        if (playName == "" || playName == "姓名") {
            return 0;
        } else {
            if (reg.test(playName)) {
                return 1;
            } else {
                return 0;
            }
        }
    },
    //发票收件人省市区选择
    BillPostAddress:function(){
        //选择省市区
        $("#city_bill").on("click",function(){
            $("#district_bill").html("区/县").attr("value","0");
            if($("#province_bill").html()=="请选择省"){
                Details.BillVerify(0,"省市区不能为空",$(".fp-xl-box .select_box"));
            }
            $("#proList_bill").addClass("none");
            $("#trictList_bill").addClass("none");
        });
        $("#district_bill").on("click",function(){
            if($("#province_bill").html()=="请选择省" ||  $("#city_bill").html() == "请选择市"){
                Details.BillVerify(0,"省市区不能为空",$(".fp-xl-box .select_box"));
            }
            $("#proList_bill").addClass("none");
            $("#cityList_bill").addClass("none");
        });
        //省
        $("#province_bill").on("click",function(){
            $("#city_bill").html("请选择市").attr("value","0");
            $("#district_bill").html("区/县").attr("value","0");
            $("#proList_bill").html("").removeClass("none");
            $("#cityList_bill").addClass("none");
            $("#trictList_bill").addClass("none");
            $.ajax({
                url: "/wanle/api/WanleProduct/GetProvinceList",
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    for(var i=0; i<data.length; i++){
                        var p_id = data[i].Id,
                            p_name = data[i].Name;
                        $("#proList_bill").append(
                            '<li value="'+p_id+'">'+p_name+'</li>'
                        );
                    }
                }
            });
        });
        //市
        $(document).on("click","#proList_bill li",function(){
            $(this).parent().find("select_box").css("border","1px solid #cbcbcb");
            $("#province_bill").attr("value",$(this).val()).html($(this).html());
            $("#proList_bill").addClass("none");
            $.ajax({
                url: "/wanle/api/WanleProduct/GetCityListByProvinceId?id="+$("#province_bill").attr("value"),
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    $("#cityList_bill").html("");
                    for(var i=0; i<data.length; i++){
                        var c_id = data[i].Id,
                            c_name = data[i].Name;
                        $("#cityList_bill").append(
                            '<li value="'+c_id+'">'+c_name+'</li>'
                        );
                    }
                }
            });
            if( $("#district_bill").html()=="区/县" ||  $("#city_bill").html() == "请选择市"){
                Details.BillVerify(0,"省市区不能为空",$(".fp-xl-box .select_box"));
            }
        });
        //区/县
        $(document).on("click","#cityList_bill li",function(){
            $("#cityList_bill").addClass("none");
            $("#city_bill").html($(this).html());
            $("#city_bill").attr("value",$(this).attr("value"));
            $.ajax({
                url: "/wanle/api/WanleProduct/GetCountyListByCityId?id="+$("#city_bill").attr("value"),
                dataType: "json",
                success: function (data) {
                    data = data.Data;
                    $("#trictList_bill").html("");
                    for(var i=0; i<data.length; i++){
                        var qu_id = data[i].Id,
                            qu_name = data[i].Name;
                        $("#trictList_bill").append(
                            '<li value="'+qu_id+'">'+qu_name+'</li>'
                        );
                    }
                }
            });

            if( $("#district_bill").html()=="区/县"){
                Details.BillVerify(0,"省市区不能为空",$(".fp-xl-box .select_box"));
            }
        });

        $(document).on("click","#trictList_bill li",function(){
            $("#district_bill").html($(this).html());
            $("#district_bill").attr("value",$(this).attr("value"));
            $("#trictList_bill").addClass("none");
            if($("#province_bill").html() !="请选择省" && $("#city_bill").html() !="请选择市" && $("#district_bill").html() !="区/县"){
                $(".fp-xl-box .valid_symbol_bill").addClass("none");
            }
        });

        //市
        $("#city_bill").on("click",function(e){
            if($("#province_bill").attr("value") != 0){
                $("#cityList_bill").removeClass("none");
            }
        });

        //区
        $("#district_bill").on("click",function(){
            if($("#city_bill").attr("value") != 0){
                $("#trictList_bill").removeClass("none");
            }
        });

    },
    //发票保存
    KeepBillInfo:function(){
        $('.fp-submit').on("click",function(){
            Details.isProvince();//判断省市区是否为空

            if($(".fp-ttbox").hasClass("none")){ //发票抬头不存在时
                Details.BillSubVerify();
                //添加收件人存在时需要验证，不通过则return
                if (!$(".fp-adress-write-box").hasClass("none") && Details.isProvince() == false
                    || !$(".fp-adress-write-box").hasClass("none") && BillPostInfo.address == 0 && BillPostInfo.postMobile == 0 && BillPostInfo.postName == 0 && BillPostInfo.Title == 0
                    || $(".fp-adress-write-box").hasClass("none") && BillPostInfo.Title == 0) {
                    return;
                }
            }else{  //发票抬头存在时
                Details.BillSubVerify();
                //添加收件人存在时需要验证，不通过则return
                if (!$(".fp-adress-write-box").hasClass("none") && BillPostInfo.address == 0 && BillPostInfo.postMobile == 0 && BillPostInfo.postName == 0
                    || !$(".fp-adress-write-box").hasClass("none") && Details.isProvince() == false) {
                    return;
                }
            }
            var fptt='',fptype = '';
            var container = $(".sj-adress-box:not(.none)");
            var TitleName,AddressName,Mobile,ProvinceId,ProvinceName,CityId,CityName,
                RegionId,RegionName,StreetAddress,
            //IsEveryOneTitle = 0,        //是否使用相同发票抬头
                data2 = {};
            var fp_ttbox = $('.fp-ttbox'),
                fp_tt_in = $('.fp-tt-in'),
                fp_writeBox = $('.fp-adress-write-box'),
                IsDefault = false,
                Change_tt = $('.fp-tt').attr('data-id');
            var self = $(this);
            $('.fp-radio').addClass('Fp_hasSave');
            $('.need-fp').addClass('fpchecked');
            if(fp_ttbox.hasClass('none')){
                fptt = Details.replaceSign(fp_tt_in.val());
                TitleName = fptt;
                if($('.fp-cb-default').hasClass('sjchecked')){//是否设置为默认抬头
                    IsDefault = true;
                }
            }else{
                fptt = Details.replaceSign($('.fp-tt').text());
            }
            fptype = $('.active-fp-nr').text();
            $('.fp-xx1').text(fptt);
            $('.fp-xx2').text(fptype);
            $('.fp-xx').removeClass('none');
            $('.lb-info').removeClass('none');
            if(!fp_writeBox.hasClass('none')){
                AddressName = $('.fp-adress-name').val();
                Mobile = $('.fp-adress-tel').val();
                ProvinceId = $('.send-pro').attr('value');
                ProvinceName = $('.send-pro').text();
                CityId = $('.send-city').attr('value');
                CityName = $('.send-city').text();
                RegionId = $('.send-region').attr('value');
                RegionName = $('.send-region').text();
                StreetAddress = Details.replaceSign($('.J_sendStreet').val());
            }
            if(fp_ttbox.hasClass('none') && fp_writeBox.hasClass('none') && fp_tt_in.hasClass('change-tt')){
                data2 ="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Id":Change_tt,
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        }
                    }));
                if(BillPostInfo.Title == 1){
                    $(".J_fp_bg").css("display","none");
                    $(".form-fp").css("display","none");
                    Details.dataAjax(data2);
                }
                BillPostInfo.ele = 1;
                BillPostInfo.onePost = container;
            }else if(fp_ttbox.hasClass('none') && fp_writeBox.hasClass('none') && !fp_tt_in.hasClass('change-tt')){
                data2 ="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        }
                    }));
                if(BillPostInfo.Title == 1){
                    $(".J_fp_bg").css("display","none");
                    $(".form-fp").css("display","none");
                    Details.dataAjax(data2);
                }
                BillPostInfo.ele = 1;
                BillPostInfo.onePost = container;
            }else if(!fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none')){
                data2 = "param="+encodeURIComponent(JSON.stringify({
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(BillPostInfo.address == 1 && BillPostInfo.postMobile == 1 && BillPostInfo.postName == 1 && Details.isProvince() == true){
                    $(".J_fp_bg").css("display","none");
                    $(".form-fp").css("display","none");
                    Details.dataAjax(data2);
                }
                BillPostInfo.ele = 2;
            }else if(fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none') && fp_tt_in.hasClass('change-tt')){
                data2="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Id":Change_tt,
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        },
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(BillPostInfo.address == 1 && BillPostInfo.postMobile == 1 && BillPostInfo.postName == 1 && BillPostInfo.Title == 1 && Details.isProvince()==true){
                    $(".J_fp_bg").css("display","none");
                    $(".form-fp").css("display","none");
                    Details.dataAjax(data2);
                }
                BillPostInfo.ele = 2;
            }else if(fp_ttbox.hasClass('none') && !fp_writeBox.hasClass('none') && !fp_tt_in.hasClass('change-tt')){
                data2="param="+encodeURIComponent(JSON.stringify({
                        "InvoiceTitle":{
                            "Name":TitleName,
                            "IsDefault":IsDefault
                        },
                        "InvoiceAddress":{
                            "Name":AddressName,
                            "Mobile":Mobile,
                            "ProvinceId":ProvinceId,
                            "ProvinceName":ProvinceName,
                            "CityId":CityId,
                            "CityName":CityName,
                            "RegionId":RegionId,
                            "RegionName":RegionName,
                            "StreetAddress":StreetAddress
                        }
                    }));
                if(BillPostInfo.address == 1 && BillPostInfo.postMobile == 1 && BillPostInfo.postName == 1 && BillPostInfo.Title == 1 && Details.isProvince()==true){
                    $(".J_fp_bg").css("display","none");
                    $(".form-fp").css("display","none");
                    Details.dataAjax(data2);
                }
                BillPostInfo.ele = 2;
            }
            else{
                $(".J_fp_bg").css("display","none");
                $(".form-fp").css("display","none");
                $('.fp_listbox').addClass('none');
                BillPostInfo.ele = 1;
                BillPostInfo.onePost = container;
            }
        })
    },
    dataAjax:function(data){
        $.ajax({
            url: 'http://www.ly.com/dujia/AjaxHelper/InvoiceAjax.ashx?type=SAVEINVOICEBASEINFO',
            type: 'GET',
            dataType: 'jsonp',
            data: data,
            success:function(){
                $('.fp_listbox').addClass('none');
            },
            error:function(){
                $('.fp_listbox').addClass('none');
            }
        });
    },
    isProvince:function(){
        if($('.send-pro').text()=="请选择省"|| $('.send-city').text()=="请选择市" || $('.send-region').text()=="区"){
            Details.BillVerify(0,"省市区不能为空",$(".fp-xl-box .select_box"));
            return false;
        }else{
            Details.BillVerify(1,"",$(".fp-xl-box .select_box"));
            return true;
        }
    },
    //发票信息重置
    resetInfo:function(){
        $(".form-fp input").each(function(i,elem){
            $(elem).val($(elem).attr("attr-value"));
        });
        $(".form-fp input").css("color","#999");
        $(".form-fp input").css("border","1px solid #ddd");
        $(".select_box #province_bill").html("请选择省").attr("value",0);
        $(".select_box #city_bill").html("请选择市").attr("value",0);
        $(".select_box #district_bill").html("区/县").attr("value",0);
        $(".valid_symbol_bill").addClass("none")
    },
    //出境电话
    OutPhone:function(){
        $(".outPhone").append("<span class='close'></span>");
        $(".user_info").find("input").focus(function(){
            var _textVal = $(this).val();
            var _textAttr = $(this).attr("attr-value");
            $(this).css("color", "#333");
            if(_textVal == _textAttr){
                $(this).val("");
            }
            if(!$(".outPhone").hasClass("none")){
                $(".outPhone").addClass("none");
            }
        }).blur(function(){
            var _textVal = $(this).val();
            var _textAttr = $(this).attr("attr-value");
            if(_textVal == ""){
                $(this).val(_textAttr);
                $(this).css("color", "#ccc");
            }else if($(this).parents("li").hasClass("userDefined")){
                $(this).addClass("otherNeed");
                $(this).siblings("label").addClass("otherNeed");
            }else{
                $(this).parents("li").addClass("otherNeed");
                $(this).css("color", "#333");
            }
        });
        $("#areaId").attr('readonly', false);
        $("#areaId").on("blur",function(){
            var reg = /^[0-9]{0,8}$/;
            if(!reg.test($("#areaId").val())){
                $("#areaId").siblings("span").removeClass("none");
            }else{
                $("#areaId").siblings("span").addClass("none");
            }

            if($("#areaId").val() != "" && $("#areaId").val()!= $("#areaId").attr("attr-value")
                && $("#phone").val()!="" && $("#phone").val()!= $("#phone").attr("attr-value")){
                $("#areaId").parents("li").addClass("otherNeed");
            }
        });
        $("#phone").on("blur",function(){
            var reg = /^[0-9]*$/;
            if(!reg.test($("#phone").val())){
                $("#phone").siblings("span").removeClass("none");
            }else{
                $("#phone").siblings("span").addClass("none");
            }
            if ($("#areaId").val() != "" && $("#areaId").val() != $("#areaId").attr("attr-value")
                && $("#phone").val() != "" && $("#phone").val() != $("#phone").attr("attr-value")) {
                $("#phone").parents("li").addClass("otherNeed");
            }
        })
        $("#hotel").on("blur",function(){
            var hotelVal = $("#hotel").val().replace(/(^\s+)|(\s+$)/g,"");
            if(hotelVal != "" &&  hotelVal!= $("#hotel").attr("attr-value")){
                $("#hotel").siblings("span").addClass("none");
            }else{
                $("#hotel").siblings("span").removeClass("none");
            }
        })
        $("#hotelAdd").on("blur",function(){
            var hotelAddVal = $("#hotelAdd").val().replace(/(^\s+)|(\s+$)/g,"");
            if(hotelAddVal != "" &&  hotelAddVal!= $("#hotelAdd").attr("attr-value")){
                $("#hotelAdd").siblings("span").addClass("none");
            }else{
                $("#hotelAdd").siblings("span").removeClass("none");
            }
        })
        $(".phoneList li").on("click",function(){
            var areaId= $(this).attr("data-areaId");
            $("#areaId").val(areaId);
            $(".outPhone").addClass("none");
            $("#areaId").css("color","#333");
            $("#areaId").parents("li").addClass("otherNeed");
        });
        $(".outPhone").delegate(".close","click",function(){
            $(".outPhone").addClass("none");
        })
    },
    OtherInfo:function(dataJson){
        var _siblings = $(".user_info"),
            length = _siblings.find(".otherNeed").length,
            _param = '{';
        var value;
        _siblings.find(".otherNeed").each(function(i,e) {
            var _elem = $(e),
                _key = _elem.attr("data-submit");
            if(_elem.find("input").length > 1){
                if(_elem.find("input").eq(0).val() == "" || _elem.find("input").eq(0).val() == _elem.find("input").eq(0).attr("attr-value"))
                {
                    _elem.find("input").eq(0).val("");
                }
                if(_elem.find("input").eq(1).val() == "" || _elem.find("input").eq(1).val() == _elem.find("input").eq(1).attr("attr-value"))
                {
                    _elem.find("input").eq(1).val("");
                }
                value = _elem.find("input").eq(0).val()+_elem.find("input").eq(1).val();
                value = Details.replaceSign(value);
            }else if(_elem.parents("li").hasClass("userDefined")){
                if(_elem.hasClass("UserDefined")){
                    value = Details.replaceSign(_elem.html());
                }else{
                    value = Details.replaceSign(_elem.val());
                }
            }else{
                value = Details.replaceSign(_elem.find("input").val());
            }
            if (length === (i+1)) {
                if(value != ""){
                    _param = _param + '"' + _key + '":"' + value + '"}';
                }
            }else {
                if(value != "") {
                    _param = _param + '"' + _key + '":"' + value + '",';
                }
            }
        });
        dataJson.OtherInfo = _param;
        return dataJson;
    },
    replaceSign:function(str){
        if(str != ""){
            var strA = str.replace(/\"/g,"“").replace(/\'/g,"‘");
        }
        return strA;
    },

    //保险交互事件
    insure_event:function(){
        var timer = null;
        $(".accident_list .insure_list .t2 .no_more").hover(function(){
            var l = $(this).offset().left,
                t =  $(this).offset().top;
            $(this).parent().parent().find(".insure_detail").removeClass("none");

        },function(){
            $(this).parent().parent().find(".insure_detail").addClass("none");
        });

        $(".first_insure li:first-child").addClass("first_insure_show");
        $(".first_insure li").each(function(){
            if(!$(this).hasClass("first_insure_show")){
                $(this).addClass("none");
            }
        });

        $(".more_insure").on("click",function(){
            $(".first_insure li").each(function(){
                if($(this).hasClass("none") && !$(this).hasClass("first_insure_show")){
                    $(this).removeClass("none");
                }else if(!$(this).hasClass("none") && !$(this).hasClass("first_insure_show")){
                    $(this).addClass("none");
                }
            });
            if($(this).find("span").hasClass("should_more")){
                $(this).find("span").removeClass("should_more");

            }else{
                $(this).find("span").addClass("should_more");
                $(".first_insure .insure_list").removeClass("none");
            }
        });

        $(".accident .button_right").on("click",function(){
            if($(this).hasClass("has_right")){
                $(this).removeClass("has_right");
                $(".insurance").attr("isHas_accident",0);
                Details.isShow_warmTip1();
            }else{
                $(".accident .button_right").removeClass("has_right");
                $(this).addClass("has_right");
                $(".insurance").attr("isHas_accident",1);
                Details.isShow_warmTip1();
            }
            Details.buildFee(true);
        });

        $(".cancel .button_right").on("click",function(){
            if($(this).hasClass("has_right")){
                $(this).removeClass("has_right");
                $(".insurance").attr("isHas_cancel",0);
                Details.isShow_warmTip2();
                $(".add_pc input").removeClass("inputBeforeSubmitChk");
                $(".hid_cancelInsure").addClass("none");
            }else{
                $(".cancel .button_right").removeClass("has_right");
                $(this).addClass("has_right");
                $(".insurance").attr("isHas_cancel",1);
                Details.isShow_warmTip2();
                $(".add_pc input").addClass("inputBeforeSubmitChk");
                $(".hid_cancelInsure").removeClass("none");
            }

            Details.buildFee(true);
        });

    },
    isShow_warmTip1:function(){
        if($(".accident_more .button_right").hasClass("has_right")){
            $(".first_insure").addClass("has_accident_insure");
            $(".player_info").removeClass("none");
            $(".player_info .passenger-info-table input").addClass("inputBeforeSubmitChk");
        }else{
            $(".first_insure").removeClass("has_accident_insure");
            $(".player_info").addClass("none");
            $(".player_info .passenger-info-table input").removeClass("inputBeforeSubmitChk");
        }
    },
    isShow_warmTip2:function(){
        if($(".cancel .button_right").hasClass("has_right")){
            $(".add_pc").removeClass("none");
            $(".warm2").addClass("none");
        }else{
            $(".add_pc").addClass("none");
            $(".warm2").removeClass("none");
        }
        if($(".warm2").hasClass("none")){
            $(".hid_cancelInsure").removeClass("none");
        }else{
            $(".hid_cancelInsure").addClass("none");
        }
    },

    //显示保险模块
    insure_show:function(fn){
        var pid= $("#hidProductId").val(),
            start_date = $("#hidStartDate").val();

        $.ajax({
            url: "/wanle/api/WanleProduct/GetWanleInsuranceList?ProductId="+pid+"&OrderAmount=860&StartDate="+start_date,
            dataType: "jsonp",
            success: function(data) {

                if(data.Data.ProductInsuranceList.length == 0 ){        //说明没有意外险
                    $(".insurance").addClass("none");
                    $(".add_pc").addClass("none");
                    $(".hid_accidentInsure").addClass("none");
                    $(".hid_cancelInsure").addClass("none");
                }else{                                             //说明有意外险
                    $(".insurance").removeClass("none");
                    $(".add_pc").removeClass("none");
                    $(".hid_accidentInsure").removeClass("none");
                    $(".hid_cancelInsure").removeClass("none");
                }
                if(data.Status !="Success"){
                    $(".loading_list").removeClass("none");
                    return;
                }else{
                    if(data.Data.ProductInsuranceList.length > 0){
                        $(".loading_list").addClass("none");
                        $(".loading_list_show").removeClass("none");
                        $(".first_insure").removeClass("none");
                    }else{
                        $(".loading_list").removeClass("none");
                        $(".loading_list_show").addClass("none");
                        $(".first_insure").addClass("none");
                    }
                }

                if(pageConfig.hidProductCategory == "111"){              //是一日游
                    if(data.Data.ProductInsuranceList.length > 0 && ($("insurance").attr("ishas_accident") == 1)){           //有意外险
                        $(".player_info .passenger-info-table input").addClass("inputBeforeSubmitChk");
                    }else{
                        $(".player_info .passenger-info-table input").removeClass("inputBeforeSubmitChk");
                    }
                }

                $(".first_insure").html("");            //保险置空
                $(".cancel ul").html("");
                for(var i = 0;i < data.Data.ProductInsuranceList.length;i++){
                    var insure_id = data.Data.ProductInsuranceList[i].InsuranceCode,
                        insure_name =  data.Data.ProductInsuranceList[i].InsuranceName,
                        insure_detailInfo = data.Data.ProductInsuranceList[i].InsuranceInstructions,
                        insure_type = data.Data.ProductInsuranceList[i].InsuranceType,
                        insure_price = data.Data.ProductInsuranceList[i].InsurancePrice,
                        default_show = data.Data.ProductInsuranceList[i].IsDefaultShow,
                        maxPrice = data.Data.ProductInsuranceList[i].MaxAmount,
                        minPrice = data.Data.ProductInsuranceList[i].MinAmount;

                    var insure_html = '<li class="insure_list" insure_id="'+insure_id+'" maxPrice="'+maxPrice+'" minPrice="'+minPrice+'">'+
                        '<span class="t1"></span>'+
                        '<span class="t2 t_left">'+
                        '<div>'+insure_name+
                        '<span class="no_more">' +
                        '<div class="insure_detail none">'+
                        '<div class="detail_box_top"></div>'+
                        '<div class="detail_box_middle">'+insure_detailInfo+'</div>'+
                        '<div class="detail_box_bottom"></div>'+
                        '</div>'+
                        '</span>'+
                        '</div>'+

                        '</span>'+
                        '<span class="t3 t_color"><em>&yen;</em>'+insure_price+"/份"+'</span>'+
                        '<span class="t4"></span>'+
                        '<span class="t5 button_right" insure_id="'+insure_id+'" isShow="'+default_show+'" this_accident="'+insure_price+'"></span>'+
                        '</li>';

                    if(insure_type == 1){           //意外险
                        $(".first_insure").append(insure_html);
                        if($(".first_insure li").length == 1){
                            $(".more_insure").addClass("none");
                        }else{
                            $(".more_insure").removeClass("none");
                        }
                        $(".first_insure li .t4").html($("#BookMin").html()+"份");
                    }else if(insure_type == 2){     //取消险
                        $(".cancel ul").append(insure_html);
                    }
                }

                if($(".cancel ul li").length ==0 ){
                    $(".add_pc input").removeClass("inputBeforeSubmitChk");
                }else{
                    $(".add_pc input").addClass("inputBeforeSubmitChk");
                }

                if($(".first_insure li").length == 0){                 //没有意外险
                    $(".first_insure").addClass("none");
                    $(".more_insure").addClass("none");
                    $(".insure_name").addClass("none");
                    $(".cancel .insure_name").removeClass("none");
                    $(".cancel").css("border","none");
                    $(".hid_accidentInsure").addClass("none");
                }else{
                    if($(".first_insure li").length > 1){             //有意外险并且大于一条
                        $(".first_insure li:first-child").find(".t2").append(
                            '<a href="javascript:;" class="more_insure">'+"更多"+'<span class="no_more"></span></a>'
                        );
                    }
                    $(".player_info").addClass("none");
                    $(".first_insure").removeClass("none");
                    $(".more_insure").removeClass("none");
                    $(".insure_name").removeClass("none");
                    $(".hid_accidentInsure").removeClass("none");
                    $(".insurance").attr("isHas_accident",1);
                }
                if($(".cancel ul li").length == 0){                  //没有取消险
                    $(".cancel").addClass("none");
                    $(".hid_cancelInsure").addClass("none");
                }else{
                    $(".cancel").removeClass("none");
                    $(".hid_cancelInsure").removeClass("none");
                    $(".insurance").attr("isHas_cancel",1);
                }

                $(".cancel ul .t4").text("1份");    //取消险只有一份
                $(".cancel ul li").addClass("none");      //
                Details.insure_event();
                if(typeof fn === "function")fn();
                if($(".first_insure li").length == 0){
                    $(".hid_accidentInsure").addClass("none");
                }
                if($(".cancel ul li").length == 0){
                    $(".hid_cancelInsure").addClass("none");
                }else{
                    $(".hid_cancelInsure").removeClass("none");
                }
            }
        });
    },

    //出游人证件类型选择
    new_card_select:function(){
        $(".insure_z_Type .ui-select").on("click",function(){
            if($(".type-list").hasClass("none")){
                $(".type-list").removeClass("none");
            }else{
                $(".type-list").addClass("none");
            }
        });
        $(".type-list span").on("click",function(){
            $(".insure_z_Type .ui-select").html($(this).text()+'<em></em>');
            $(".type-list").addClass("none");
        });
    },
    //未满18岁未成年判断
    isAdult:function(){
        $(".add_pc").removeClass("none");
        $(".add_pc input").on("focus", function () {
            var _target = $(this).parent().find("input");
            _target.css("border-color", "#76bbff");
            $(this).siblings("span").addClass("none");
            $(this).css("color", "#333");
        });
        var verify = {
            pc_zheng: function () {                         //身份证号码
                var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
                    pc_zheng_input = $(this).val().replace(/\s+/g, ""),         //取到输入的号码
                    validSymbol = $(this).siblings(".valid_symbol");
                if (pc_zheng_input == "" || pc_zheng_input == "请输入证件类型") {
                    validSymbol.removeClass("none");
                    validSymbol.html("*证件号码不能为空");
                    return false;
                } else {
                    if (reg.test(pc_zheng_input)) {
                        return true;
                    } else {
                        validSymbol.removeClass("none");
                        validSymbol.html("*证件号码格式错误");
                        return false;
                    }
                }


            }
        }
        $(".add_pc input").on("blur", function () {
            var  pc_zheng_input = $(this).val().replace(/\s+/g, "");
            var b = verify.pc_zheng.call(this);
            var _targetBlur = $(this).parent().find("input"),
                validSymbol = _targetBlur.siblings(".valid_symbol");
            if (b) {
                validSymbol.css("display", "none");
                Details.isFalse.call(this);
            } else {
                _targetBlur.css("border-color", "red");
                validSymbol.css("display", "inline-block");
            }
            //return b;
            var all_birthday,
                f_year,
                f_month,
                f_day;
            //var pc_zheng_input = "3204021999009022530";
            if(pc_zheng_input.length == 18){           //18位身份证判断
                all_birthday = pc_zheng_input.substring(6,14);
                f_year = all_birthday.substring(0,4);
                f_month = all_birthday.substring(4,6);
                f_day = all_birthday.substring(6,8);
            }else if(pc_zheng_input.length == 15){
                all_birthday = pc_zheng_input.substring(6,12);
                f_year = all_birthday.substring(0,4);
                f_month = all_birthday.substring(4,6);
                f_day = all_birthday.substring(6,8);
            }
            //ageLimite("1", "30", f_year, f_month, f_day);
            var agePass = null,
                nDate = new Date(),
                nYear = nDate.getFullYear(),
                nMonth = nDate.getMonth() + 1,
                nDay = nDate.getDate(),
                fYear = nYear - parseInt(1, 10),
                uYear = nYear - parseInt(18, 10),

                IDTime = new Date(nDate) - new Date(f_year + "-" + f_month + "-" + f_day),
                fTime = new Date(nDate) - new Date(fYear + "-" + nMonth + "-" + nDay),
                uTime = new Date(nDate) - new Date(uYear + "-" + nMonth + "-" + nDay);

            if (IDTime <= uTime && IDTime >= fTime) {
                agePass = false;
                var _targetBlur = $(".add_pc").find("input"),
                    validSymbol = _targetBlur.siblings(".valid_symbol");
                _targetBlur.css("border-color", "red");
                validSymbol.css("display", "inline-block");
                validSymbol.html("18周岁未成年人无法参保，请换个联系人或者取消“取消险”");
            } else {
                agePass = true;
            }
            return agePass;


        });
    },
    //阅读协议选择事件
    agreement:function(){
        var is_agreement = $(".has_read input[type='checkbox']").is(':checked');
        if(is_agreement == true){
            $(".worning").addClass("none");
        }else{
            $(".worning").removeClass("none");
        }
        return is_agreement;
    },
    agreement_event:function(){
        $(".has_read input").on("click",function(){
            Details.agreement();
        });
    },
    isFalse:function(){
        var _targetBlur = $(this).parent().find("input");
        _targetBlur.css("border-color", "#ddd");
        var _text = $(this).attr("attr-value");
        if ($(this).val() == "") {
            $(this).val(_text);
        }
        if (_text == $(this).val()) {
            _targetBlur.css("color", "#ccc");
        } else if ($(this).val() == "") {
            $(this).css("color", "#333");
        }
    },
    priceCal:function(data){        //日历选择后   人数input里的隐藏信息重新写入
        pageConfig.minOrderPerson = data.BookMin;
        pageConfig.maxOrderPerson = data.BookMax;

        //将新的价格写到对应的  inputbox 里'
        var priceList = data.PriceList;

        if (pageConfig.hidProductCategory == 92) { //wifi

            if (priceList.length > 0) {

                var firstPriceData = priceList[0],
                    box = $("#numBox0");

                box.attr('attr-id', firstPriceData.Id);
                box.attr('data-price', firstPriceData.Price);
                box.attr('min', firstPriceData.OrderDefault);
                box.attr('max', firstPriceData.orderMax);

                $("#singleprice").html(firstPriceData.Price);
            }
        } else { // 非wifi走常规的
            var chosePeo = $("#chose_peo"),
                chosePeoFirst;
            chosePeo.empty();
            chosePeo.find(".no_wifi").remove();
            chosePeo.append($("#PriceSelctTemp").tmpl(data.PriceList));
            $(".fee-info").empty();
            chosePeoFirst = $("#chose_peo>p:first");
            chosePeoFirst.append("（本产品最少<span id='BookMin'>" + pageConfig.minOrderPerson + "</span>"+ pageConfig.hidProductUnit +"，最多<span id='BookMax'>" + pageConfig.maxOrderPerson + "</span>"+ pageConfig.hidProductUnit +"起订）");
            chosePeoFirst.find('.inputbox').val(pageConfig.minOrderPerson);

            $(".first_insure li .t4").html(pageConfig.minOrderPerson+"份");
        }

        Details.BindKeyUp(); //文本框输入keyup事件.
        if($("#VisitorInfoNeed").val() == "1" ){
            if($("#HasInsurance").val() == "true"){
                $("#needPassengerNum").text(Details.GetNeedPassengersNum());
            }else{
                $("#needPassengerNum").html("1");
            }

        }else{
            $("#needPassengerNum").text(Details.GetNeedPassengersNum());
        }
    },
    calCallback:function(y,d,r){
        if (pageConfig.curDateInputIndex == 0 && pageConfig.hidProductCategory == 92) {
        var isPackageDay = parseInt($("#hidWifiPackageDays").val());
        pageConfig.curDateInputIndex = -1;
        if (isPackageDay) {
            var timeSec = new Date(Details.NewDate(pageConfig.hidPackageDate1)) + (isPackageDay - 1) * 24 * 60 * 60 * 1000,
                secDate = Details.format(new Date(timeSec), 'yyyy-MM-dd');
            $("#mainCal2").val(secDate);
            $(".forHideShowHeight").animate({
                height: '0px'
            }, 200);
        } else {
            $("#mainCal2").trigger("click");
            $(".forHideShowHeight").animate({
                height: '400px'
            }, 200);

            $(".fisrt_day").html($("#mainCal1").val());
        }

        } else {
            pageConfig.curDateInputIndex = -1;
            $(".forHideShowHeight").animate({
                height: '0px'
            }, 200);

        }

        var singleProductPriceTypeAjaxObj = {
            Platment: 0,
            id: pageConfig.productId,
            SupplierId: pageConfig.supplyId,
            resourceId: pageConfig.resourceId,
            FirstDate: $("#mainCal1").val()
        };
        if(!isPackageDay){
            singleProductPriceTypeAjaxObj.SecondDate = $("#mainCal2").val() || "";
        }
        //fxFlag = undefined;
        cacheBxChecked = true;
        $("#hidStartDate").val(singleProductPriceTypeAjaxObj.FirstDate);
        Details.insure_show();
        Details.insure_event();

        $(".more_insure").find("span").removeClass("should_more");
        //当第二个值不为空时
        if (singleProductPriceTypeAjaxObj.SecondDate != "") { // wifi情况下
            var startDate = Details.NewDate(singleProductPriceTypeAjaxObj.FirstDate);
            var endDate = Details.NewDate(singleProductPriceTypeAjaxObj.SecondDate);

            var days = (endDate - startDate) / (24 * 60 * 60 * 1000);

            if (days < pageConfig.minDay || days > pageConfig.maxDay) {

                var newEndDate = Details.NewDate(startDate);
                newEndDate.setDate(newEndDate.getDate() + pageConfig.minDay - 1);

                if(!isPackageDay){
                    singleProductPriceTypeAjaxObj.SecondDate = Details.format(newEndDate, 'yyyy-MM-dd'); // $("#mainCal2").val();
                }
            }
            $(".fisrt_day").html($("#mainCal1").val());
            $(".end_day").html($("#mainCal2").val());
        }

        if (singleProductPriceTypeAjaxObj.SecondDate == "") {
            pageConfig.orderDayNum = 1;
        } else {
            var startDate = Details.NewDate(singleProductPriceTypeAjaxObj.FirstDate);
            var endDate = Details.NewDate(singleProductPriceTypeAjaxObj.SecondDate);
            var days = (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
            pageConfig.orderDayNum = days + 1; //因为算起始时间
            if(isPackageDay){
                pageConfig.orderDayNum = isPackageDay;
            }
        }

        singleProductPriceTypeAjaxObj = $.extend(singleProductPriceTypeAjaxObj, {
            'getParamStr': Details.getParamStr
        });
        var url = pageConfig.SingleProductPriceTypeUrl + singleProductPriceTypeAjaxObj.getParamStr('&');


        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data) {
                //将返回的价格体系Id与价格绑定到预订人数框
                Details.priceCal(data.Data);

                //计算并在右边显示最新价格详情
                Details.buildFee();
                //$(".hid_accidentInsure").addClass("none")
                if( $(".first_insure li").length == 0){
                    $(".hid_accidentInsure").addClass("none");
                }
                if( $(".cancel ul li").length == 0){
                    $(".hid_cancelInsure").addClass("none");
                }
                $(".inputbox").attr("befor-time",$("#BookMin").html());
                var get_before_time = $("#date_calendar").attr("befor-time");

                if(($("#VisitorInfoNeed").val() == "2") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "1" && $("#HasInsurance").val() == "true") || (pageConfig.hidProductCategory == "111" && $("#VisitorInfoNeed").val() == "0" && $("#HasInsurance").val() == "true")) {
                    var now_num = $(".inputbox").val();
                    var add_num = now_num - get_before_time;
                    if($(".passenger-info-table").length != parseInt($("#BookMin").html())){
                        Details.AddPassenger({
                            PassengerArr: [],
                            AddEmptyNum: Math.abs(add_num)  //新增空的数量为 0时  直接加PassengerArr  否则对对应的空对象
                        },1);
                    }
                }
            }
        });

        Details.BindKeyUp();
    },

    //创建右侧费用信息条显示
    buildFee:function(fxFlag){
        var eachPriceSum = 0,
        totalPriceSum = 0,
        eachdeposit = 0,
        accidentprice = 0,
        thisAccident = 0,
        isCancelPrice = 0,
        cancelPrice = 0;

        var feeinfo = $(".fee-info");
        var feeinfoDl = feeinfo.find("dl");
        var tmplArr = [];
        var tmplArr_insure = [];
        var thisNum = 0;

        $(".inputbox").each(function (index, elem) {

            var priceId = parseInt($(elem).attr("attr-id")) || 0;
            var priceTypeStr = $("#chose_peo_" + priceId + " .peo_type_1").attr('title') || '';
            if (pageConfig.hidProductCategory == "92") {
                priceTypeStr = $("#product_title .p_title>span").text().replace(/\s+/g, "");
            }
            var thisPrice = parseInt($(elem).attr("data-price")) || 0;
            thisNum = parseInt($(elem).val()) || 0;
            var getPrePayAmount = parseInt($(".radio_word em").html()) || 0;

            //意外险单价
            $(".first_insure li").each(function(){
                if($(this).find(".t5").hasClass("has_right")){
                    thisAccident = parseInt($(this).find(".t5").attr("this_accident")) || 0;
                }
            });

            accidentprice =  thisAccident * thisNum;              //意外险总价

            eachPriceSum = thisPrice * thisNum;           //门票价
            eachdeposit = getPrePayAmount * thisNum;      //押金总价

           


            //记录上一次选择状态
            setTimeout(function(){
                cacheBxChecked = false;
                $(".cancel li").each(function(){
                    if($(this).find(".t5").hasClass("has_right")){
                        cancelPrice = parseInt($(this).find(".t5").attr("this_accident")) || 0;
                        cacheBxChecked = true;
                    }
                })
            },1000);


            if (feeinfoDl.length == 0) {
                var tmplWifi = '<dl class="calculPri_{priceId}">' +
                    '<dt>{priceTypeStr}</dt>' +
                    '<dd>' +
                    '<span class="font_W boxL">' +
                    '<span class="">' +'￥<strong class="thisPrice">{thisPrice}</strong>' + '</span>' +
                    '<b class="thisDaysNum">({thisDaysNum}天)</b>' + 'x' +
                    '<b class="listpeo">{thisNum}台</b>' + '=' + '<b class="orderPrice colF60">{eachPriceSum}元</b>' +
                    '</span>' +
                    '</dd>' +
                    '<div class="hid_deposit">'+'<dt">押金</dt>' +
                    '<dd class="wifi_deposit">' +
                    '<span class="font_W boxL">' +
                    '<span class="">' +'￥<strong class="d_thisPrice">'+getPrePayAmount+'</strong>' + '</span>' +
                    'x' +
                    '<b class="d_listpeo">1台</b>' + '=' + '<b class="d_orderPrice colF60">'+getPrePayAmount+"元"+'</b>' +
                    '</span>' +
                    '</dd>' +'</div>'+
                    '</dl>';

                var tmpl = '<dl class="calculPri_{priceId}">' +
                    '<dt>{priceTypeStr}</dt>' +
                    '<dd>' +
                    '<span class="font_W boxL">' +
                    '￥<b class="thisPrice">{thisPrice}</b>' + 'x' +
                    '<b class="listpeo">{thisNum}</b>' + '=' +
                    '<span class="colF60">' + '<strong class="colF60 orderPrice">{eachPriceSum}元</strong>' + '</span>' +
                    '</span>' +
                    '</dd>' +
                    
                    '</dl>';
               

                var curTmpl = pageConfig.hidProductCategory == "92" ? tmplWifi : tmpl;


                curTmpl = curTmpl.replace("{priceId}", eachPriceSum == 0 ? priceId + " none" : priceId); //如果总价格为0  则不显示
                curTmpl = curTmpl.replace("{priceTypeStr}", priceTypeStr);
                curTmpl = curTmpl.replace("{thisDaysNum}", pageConfig.orderDayNum);
                curTmpl = curTmpl.replace("{thisPrice}", thisPrice);
                curTmpl = curTmpl.replace("{thisNum}", thisNum);
                curTmpl = curTmpl.replace("{thisNum2}", thisNum);
                curTmpl = curTmpl.replace("{eachPriceSum}", "" + eachPriceSum);
                tmplArr.push(curTmpl);
            } else {
                var elem;
                if (pageConfig.hidProductCategory == "92") {
                    elem = $(".fee-info>dl:first-child");
                } else {
                    $(".fee-info dt").each(function () {
                        if ($(this).text() == priceTypeStr) {
                            $(this).parent().attr("id", "calculPri_" + priceId);
                        }
                    });
                    elem = $("#calculPri_" + priceId);
                }

                $(".first_insure li .t4").html(thisNum+"份");

                elem.find(".listpeo").html("" + thisNum + (pageConfig.hidProductCategory == "92" ? "台" : ""));
                elem.find(".listpeo").html();
                elem.find(".thisDaysNum").html("(" + pageConfig.orderDayNum + "天)");

                // elem.find(".accident_thisPrice").html(thisAccident);
                // elem.find(".accident_listpeo").html(thisNum);
                // elem.find(".accident_orderPrice").html(accidentprice + "元");

                // elem.find(".cancel_thisPrice").html(cancelPrice);
                // elem.find(".cancel_orderPrice").html(cancelPrice + "元");

                elem.find(".orderPrice").html("" + eachPriceSum + "元");
                if($(".pay_online").hasClass("selected")){
                    elem.find(".d_listpeo").html("" + thisNum + (pageConfig.hidProductCategory == "92" ? "台" : ""));
                    elem.find(".d_orderPrice").html("" + eachdeposit + "元");
                }

                if (thisNum == 0) {
                    $("#calculPri_" + priceId).addClass("none");
                } else {
                    $("#calculPri_" + priceId).removeClass("none");
                }
            }

            
        });
        var insure_tmpl = '<div class="hid_accidentInsure none">'+'<dt">意外险</dt>' +
                    '<dd class="accidentInsure">' +
                    '<span class="font_W boxL">' +
                    '<span class="">' +'￥<strong class="accident_thisPrice">'+thisAccident+'</strong>' + '</span>' +
                    'x' +
                    '<b class="accident_listpeo">{thisNum2}</b>' + '=' + '<b class="accident_orderPrice colF60">'+accidentprice+"元"+'</b>' +
                    '</span>' +
                    '</dd>' +
                    '</div>'+
                    '<div class="hid_cancelInsure">'+'<dt">取消险</dt>' +
                    '<dd class="cancelInsure">' +
                    '<span class="font_W boxL">' +
                    '<span class="">' +'￥<strong class="cancel_thisPrice">'+cancelPrice+'</strong>' + '</span>' +
                    'x' +
                    '<b class="cancel_listpeo">1</b>' + '=' + '<b class="cancel_orderPrice colF60">'+cancelPrice+"元"+'</b>' +
                    '</span>' +
                    '</dd>' +
                    '</div>';


            

        tmplArr_insure.push(insure_tmpl);
        tmplArr.length > 0 && feeinfo.html(tmplArr.join(''));
        // console.log($(".hid_accidentInsure").length);
        
        $(".hid_cancelInsure").length == 0 && feeinfo.append(tmplArr_insure.join(''));

              
        var All_price = 0;
        //判断门票的总价
        $(".orderPrice").each(function(){
            var single_Allprice = parseInt($(this).html().split("元")[0]);
            All_price += single_Allprice;
            
        });           

            isCancelPrice = All_price;     //判断取消险的总价 =  门票总价      意外险总价 + 不要了  

            //取消险价格
            //重置状态
            if(typeof fxFlag === "undefined"){
                $(".cancel li").addClass("none");
                $(".cancel li").find(".t5").removeClass("has_right");
            }
            $(".cancel li").each(function(){
                var thisMaxPrice = parseInt($(this).attr("maxprice")),
                    thisMinPrice = parseInt($(this).attr("minprice"));
                if(isCancelPrice <= thisMaxPrice && isCancelPrice >= thisMinPrice){
                    if(typeof fxFlag === "undefined"){
                        $(this).removeClass("none");
                        cacheBxChecked && $(this).find(".t5").addClass("has_right");
                    }
                }

                if($(this).find(".t5").hasClass("has_right")){
                    cancelPrice = parseInt($(this).find(".t5").attr("this_accident")) || 0;
                }
                if($(".cancel li .t5").hasClass("has_right")){
                    $(".add_pc").removeClass("none");
                }else{
                    $(".add_pc").addClass("none");
                }
            });   

        $(".accident_thisPrice").html(thisAccident);
        $(".accident_listpeo").html(thisNum);
        $(".accident_orderPrice").html(accidentprice + "元");

        $(".cancel_thisPrice").html(cancelPrice);
        $(".cancel_orderPrice").html(cancelPrice + "元");

            //判断总额是否有押金
            if($(".pay_online").hasClass("selected")){
                totalPriceSum = All_price + eachdeposit;
            }else{
                //只能判断总额是否有意外险
                totalPriceSum = All_price + accidentprice + cancelPrice;
            }

        
        $('#f_price_orginal').val(totalPriceSum); //无折扣前的价格  每次优惠都跟这个比较


        $(".f_price").html("" + totalPriceSum);

        $("#totalprice").html(totalPriceSum);

        if($(".deposit").length == 0){
            $(".hid_deposit").css("display","none");
        }

        if($("#HasInsurance").val() == "false"){
            $(".hid_accidentInsure").addClass("none");
        }else {
            if(thisAccident == 0){
                $(".hid_accidentInsure").addClass("none");
            }else{
                $(".hid_accidentInsure").removeClass("none");
            }
            if($(".warm2").hasClass("none")){                   //没有提示
                if($(".cancel ul li").length == 0){
                    $(".hid_cancelInsure").addClass("none");
                }else{
                    $(".hid_cancelInsure").removeClass("none");
                }

            }else{                                                //有提示
                $(".hid_cancelInsure").addClass("none");
            }
        }
        Details.ShowOrHideDiscountList();
    },
    //对象变 queryString  fx
    getParamStr:function(joinChar){
        var joinChar = joinChar || '&';
        var arr = [];
        for (var i in this) {
            if (this.hasOwnProperty(i) && (typeof this[i] == "string" || typeof this[i] == "number")) {
                arr.push(i + "=" + this[i]);
            }
        }
        return arr.join(joinChar);
    },
    CheckIsAllStringEmpty:function(){
        var b = true;
        for (var i in this) {
            if (this.hasOwnProperty(i) && (typeof this[i] == "string")) {
                if (this[i] != "" && this[i] != "1900-01-01") {  //生日要给默认值
                    return false;
                }
            }
        }
        return b;
    },

    //日期 兼容Ie8   new Date('2015-01-01')ie8有问题  要用 2015/01/01
    NewDate:function(str){
        if (str == "" || str == undefined) {
            return new Date();
        }

        if ((typeof str) != "string") {
            return str;
        }
        return new Date(str.split('-').join('/'));
     },
     //将标准时间转换为日期函数(如Thu Feb 25 2016 00:00:00 GMT+0800--2016-02-25)
     format:function(time, format){
        var t = new Details.NewDate(time);
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
            }
        })
     },
     FilterData:function(m, rule){
        var whereFilter = {};
        var funcFilter = {};

        for (var i in rule) {
            if (rule.hasOwnProperty(i) && (typeof rule[i] == "string" || typeof rule[i] == "number") && (rule[i] != "")) {
                whereFilter[i] = rule[i]; //健值比对
            }
            if (rule.hasOwnProperty(i) && !(typeof rule[i] == "string" || typeof rule[i] == "number")) {
                funcFilter[i] = rule[i];// 自定义比对
            }
        }
        var arr = _.where(m, whereFilter);

        arr = _.filter(arr, function (v) {
            var b = true;
            for (var w in funcFilter)   //所以通过才行
            {
                if (rule.hasOwnProperty(w)) {
                    var bb = funcFilter[w](v[w], v);
                    if (!bb) {
                        return false;
                    }
                }
            }
            return b;
        });

        return arr.length > 0;
     },
     //动态获取窗口高度
     getClientWidth:function(){
        var winWidth;
        // 获取窗口宽度
        if (window.innerWidth)
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth;
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
        {
            winWidth = document.documentElement.clientWidth;
        }
        return winWidth;
     },
     getClientHeight:function(){
        var winHeight;
        // 获取窗口高度
        if (window.innerHeight)
            winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            winHeight = document.body.clientHeight;
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
        {
            winHeight = document.documentElement.clientHeight;
        }
        return winHeight;
     }
    
};

var mainCal1 = $("#mainCal1");
if (mainCal1.length > 0 && $.trim(mainCal1.val()) != '1900-01-01' && $.trim(mainCal1.val()) !='') {
    Details.init();
} else {
    $("#submits").hide();
    window.location.href = "http://www.ly.com/dujia/wanle/";
}



Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};








