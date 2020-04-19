/**
 * Created by hly14695 on 2016/12/30
 * 二级目录单选 公用commonDot
 */
var Slidertoolbar = require("slidertoolbar/0.1.0/index"), //侧导航
    Dialog = require("dialog/0.2.0/dialog"),
    Validate = require("validate/1.0.0/validate");
var commonDot = require("./views/common.dot"),
    addOrDeleteDot = require("./views/addmodule.dot"),
    fatherIdList = require("./jsondata.js");
var allRules = {
    "cnName": {
        "regex": /(^[\u4e00-\uFFE5]+$)|(^$)/,
        "alertText": "*请输入中文名称"
    },
    "pingyin":{
        "regex": /(^[a-zA-Z]+$)|(^$)/,
        "alertText": "*请输入英文名称"
    },
    "enName": {
        "regex": /(^[a-zA-Z\ \''.,]+$)|(^$)/,
        "alertText": "*请输入英文名称"
    },
    "cnOrEnName": {
        "regex": /(^[\u4e00-\uFFE5]+$)|(^[a-zA-Z\ \'.,]+$)|(^$)/,
        "alertText": "*只接受中文或英文名称"
    },
    "phone": {
        "regex": /(^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$)|(^$)/,
        "alertText": "*无效的电话号码"
    },
    "email": {
        "regex": /(^[a-zA-Z\d]([\w\-\.]*[a-zA-Z\d])?@[a-zA-Z\d]([a-zA-Z\d\-]*[a-zA-Z\d])?(\.[a-zA-Z]{2,6})+$)|(^$)/,
        "alertText": "*无效的邮件地址"
    },
    "date": {
        "regex": /(^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$)|(^$)/,
        "alertText": "*无效的日期格式"
    },
    "passPort": {
        "regex": /(^1[45][0-9]{7}$|G[0-9]{8}$|E[0-9]{8}$|P[0-9]{7}$|S[0-9]{7,8}$|D[0-9]+$)|(^$)/,
        "alertText": "*无效的护照号码"
    },
    "mailCode": {
        "regex": /(^[0-9]{6}$)|(^$)/,
        "alertText": "*请输入6位邮政编码"
    },
    "passWord": {
        "regex": /^(\w){6,20}$/,
        "alertText": "*请输入正确的密码格式"
    },
    "charFilter": {
        "regex": /^[^%--`~!@#$^&\*\(\)=\|{\}':;',\[\]\.<>~！@#￥……&\*（）——\|\{\}【】‘；：”“'。，、？]+$|(^$)/,
        "alertText": "*包含非法字符"
    },
    "street":{
       "regex": /(^[0-9a-zA-Z\ \'.,&]+$)|(^$)/,
        "alertText": "*只接受英文字母或数字"
    },
    "charOrNum": {
        "regex": /(^[0-9a-zA-Z]+$)|(^$)/,
        "alertText": "*只接受英文字母或数字"
    }
};
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
var pageConfig = {
    uploadUrl: "/intervacation/api/VisaOrder/UpdateLoadFile?",
    saveUrl: "/intervacation/api/VisaOrder/SaveAutoData",
    ERROR_FLAG: "抱歉，您提交的信息验证失败，请重新提交或联系客服人员!",
    submitStatus: true,
    //dialog组件
    $dialog: new Dialog({
        skin: 'default',
        template: {
            tooltip: {
                width: '430px'
            },
            alert: {
                width: '350px',
                html: '<div class="ui-dialog-tip J_DialogTip"><div class="tip-close"></div><div class="tip-content"><i class="icon-remark"></i>' +
                    '<span data-dialog-content></span></div><div class="tip-button">' +
                    '<button type="button" class="tip_OK" data-dialog-submit>确认</button>'
            }
        }
    }),
    // 日历组件
    BirthDayCal: new $.Calendar({
        skin: "white",
        isBigRange: true,
        showOtherMonth: false,
        monthNum: 1
    }),
    //验证组件
    $validate: new Validate({
        wrapper: ".J_NavBox",
        showOneMsg: true,
        rules: allRules
    }),
    tagList: []
};

var Apply = {
    init: function(conf) {
        this.ScrollspyBind();
        this.initBtn();
        this.InitTip();
        this.InitEvent();
        this.CalPickInit();
        this.initValiDate(pageConfig.$validate);
        this.initUplodify();
        this.GetQueryData();
    },

    initBtn:function(){
        var value = $("#hidIsSubmit").val(),
            token = Apply.getQueryString("Token");
        if(value == 2 && !token){
            $(".submit").hide();
            $(".silder_bar").hide();
        }
    },
    // 滚动事件
    ScrollspyBind: function() {
        $(window).scroll(function() {
            var scroll_top = $(window).scrollTop();
            var offSetTop = $("#J_content").offset().top;

            if (scroll_top > offSetTop) {
                $(".flow_charts").addClass("nav_fixed");
                $(".silder_con").addClass("bar_fixed");
            } else {
                $(".flow_charts").removeClass("nav_fixed");
                $(".silder_con").removeClass("bar_fixed");
            }
        });
        $('.flow_charts > a').scrollspy({
            pClass: ".flow_charts",
            curClass: 'active',
            contentClass: '.J_NavBox',
            topH: 46,
            tabList: $(".flow_charts a"),
            scrollFn: function(el, isDown) {
                switch (isDown) {
                    case 0:
                        /*el.hide();*/
                        break;
                    case 1:
                        el.show();
                        break;
                    case 2:
                        el.show();
                        break;
                }
            }
        });
    },
    // 查询数据
    GetQueryData: function() {
        var formInfoList = JSON.parse(decodeURIComponent($("#hidUSAControlList").val()));

        if ($("#hidIsSubmit").val() != 0) {
            for (var i = 0; i < formInfoList.length; i++) {
                var type = $("#J_content").find(".J_NavBox").attr("data-type"),
                    dataType = formInfoList[i].Type,
                    dataList = formInfoList[i].USAControlList,
                    navBox = $("#J_content").find(".J_NavBox[data-type=" + dataType + "]");
                for (var j = 0; j < dataList.length; j++) {
                    var controlId = dataList[j].FCControlId,
                        controlVal = dataList[j].Value,
                        controlList = dataList[j].ControlList; //联动信息列表

                    if (controlVal != "") {
                        var elemList = navBox.find("[FCControlId]");
                        elemList.each(function() {
                            var curElem = $(this),
                                radioElem = $(this).find(".radio"),
                                radioGroup = $(this).find(".radio-group");
                            if (curElem.attr("FCControlId") == controlId) { //找到控件ID相同的元素

                                if(controlId == "NoidNumber" && controlVal != 0){ //勾选无身份证号时特殊处理
                                    curElem.attr("value",controlVal);
                                    curElem.click();

                                }else if(controlId== "linkman_SelectTheContact"  && controlVal){ //选择在美联系人或组织按钮特殊处理
                                    var radio_group=curElem.find(".radio-group[value='"+controlVal+"']");
                                    radio_group.trigger("click");
                                }

                                if (!radioElem.length) { //length小于0没有联动
                                    //针对多个曾用名,多种语言
                                    var moreParent = curElem.parents(".J_addBtn"),
                                        box = moreParent.find(".J_tags"),
                                        curId = curElem.attr("FCControlId"),
                                        shtml = "",
                                        array = new Array();
                                    if ((controlList && controlList.length) && moreParent.length) {
                                        var list = controlList[0] || []; 
                                        for (var b = 0; b < list.length; b++) {
                                            shtml += '<a value="' + list[b].Value + '" class="item" FCControlId="ctl00_SiteContentPlaceHolder_FormView1_DListAlias_ctl0' + i + '_tbxGIVEN_FullNAME" FatherId="' + curId + '" validate="required" verify><span>' + list[b].Value + '</span><i></i></a>';
                                            array.push(list[b].Value);
                                        }
                                        box.empty();
                                        moreParent.siblings().find(".J_check").click();
                                        box.append(shtml);
                                        box.siblings(".add_name").attr("value",array.join(","));
                                        moreParent.removeClass("none");
                                    } else {
                                        var tag=curElem.prop("tagName");
                                        if( tag==="INPUT"){
                                            curElem.val(controlVal);
                                        }else{
                                           curElem.hasClass("J_dropDown") ? curElem.text(controlVal):"";
                                           curElem.attr("value",controlVal);
                                        }
                                    }
                                } else { // 联动处理
                                    var activeElem = curElem.find(".radio[value='" + controlVal + "']"),
                                        allList = new Array();
                                    allList.push((controlList || []));
                                    activeElem.trigger('click', allList);
                                }
                            }
                        })
                    }
                }
            }
        }
    },
    //验证事件
    initValiDate: function(vail, wrapper) {
        var input = wrapper ? wrapper.find("input") : $("input"),
            str = '<span class="valid_symbol"></span>';
        vail.on("failure", function(o, obj) {
            $(obj).addClass("input_error");
            $(obj).siblings(".valid_symbol").addClass("none");
        });
        vail.on("success", function(o, obj) {
            var symbol = $(obj).siblings(".valid_symbol"),
                input = $(obj).siblings("input:last"),
                group = $(obj).attr("vali-group"),
                tag = $(obj).prop("tagName"),
                vali = $(obj).next(".dj-validate"),
                curEl = input.length ? input : $(obj),
                vali = !vali.length ? curEl : vali;
            !symbol.length && !group && tag == "INPUT" ? vali.after(str) : "";
            $(obj).removeClass("input_error");
            if ($(obj).attr("validate")) {
                $(obj).siblings(".valid_symbol").removeClass("none");
            } else {
                $(obj).siblings(".valid_symbol").addClass("none");
            }
        });
        input.focus(function() {
            $(this).removeClass("input_error");
            $(this).siblings(".valid_symbol").addClass("none");
        });
    },
    // tips提示功能
    InitTip: function() {
        var odl = pageConfig.$dialog.tooltip({
            content: function(obj) {
                var text = $(obj).attr('data-content');
                var width = '270px';
                if ($(obj).hasClass('tc-line')) {
                    width = '338px';
                }
                odl.set('width', width);
                return text;
            },
            delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
            onhide: function() {}, //隐藏后触发事件
            triggerEle: '.J_tips', //触发元素选择器
            triggerType: 'hover', //hover|click
            triggerAlign: 'bottom left' //显示位置支持top,left,bottom,right
        });
    },
    //进度计算
    Progress: function() {
        var list = $("[FCControlId][validate*='required']"),
            total = list.length,
            index = 0;
        $.each(list, function(i, el) {
            var tag = $(el).prop("tagName"),
                vail = $(el).attr("validate") || "",
                value = "";
            if (tag == "INPUT") {
                value = $(el).val().trim();
            } else {
                value = ($(el).attr("value") || "").trim();
            }
            if (value || (vail.indexOf("required") < 0)) {
                index++;
            }
        });
        var number = (index / total).toFixed(2),
            number = number > 1 ? 1 : number,
            bar = $(".silder_bar");
        bar.find(".bar_text").text(parseInt(number * 100));
        bar.find(".bar_bg").css("height", parseInt(number * 160) + "px");
    },
    // 点击事件处理
    InitEvent: function() {
        //input失焦进度计算
        $(document).on("blur", "input", function() {
            var symbol = $(this).siblings(".valid_symbol");
            if (!symbol.hasClass("none") && symbol.length) {
                Apply.Progress();
            }
        });

        $(".J_check").on("click", function() {
            var me = $(this);
            if (me.hasClass("cardNo")) {
                var con = me.parents(".info_con"),
                    symbol = con.find(".valid_symbol"),
                    input = con.find("input");
                me.toggleClass("on_check");
                input.val("");
               
                symbol.addClass("none");
                if (me.hasClass("on_check")) {
                    me.attr("value",1);
                    input.attr("readonly",true);
                    input.css({"background":"#ddd"});
                    input.attr("validate", "cardNo");
                } else {
                    me.attr("value",0);
                    input.attr("readonly",false);
                    input.css({"background":"#fff"});
                    input.attr("validate", "required cardNo");
                }
            } else {
                var parents = me.parent(),
                    choose = parents.next();
                    
                me.toggleClass("on_check");
                choose.toggleClass("none");
                Apply.chooseVerify(choose);
            }
        });
        // 曾用名,语言和,国家添加
        $(document).on("click", ".add_name", function() {
            var curParent = $(this).parents(".J_addBtn"),
                box = curParent.find(".nameBox"),
                input = curParent.find("input"),
                curId = $(this).attr("FCControlId"),
                array = new Array(),
                status = true,
                name = "";
            input.each(function() {
                var me = $(this),
                    value = me.val().trim(),
                    verify = me.attr("validate"),
                    regex = allRules["cnName"].regex;
                if (!value || !regex.test(value)) {
                    status = false;
                    return false;
                } else {
                    name = name + value;
                }
            });
            var validate = $(this).next(".dj-validate"),
                alertTxt = allRules["cnName"].alertText;
            if(name.length > 10){
                status = false;
                alertTxt = "最多10个中文字符";
            }
            if (!status) {
                if (validate.length) {
                    validate.find(".error_gp").html(alertTxt);
                    validate.addClass("active");
                } else {
                    $(this).after('<div class="dj-validate active"><span class="error_gp">' + alertTxt + '</span></div>');
                }
                return;
            };
            box.find("a").each(function() {
                array.push($(this).attr("value"));
            });
            input.val("");
            validate.removeClass("active");
            if (array.indexOf(name) > -1) return;
            array.push(name);
            var str = array.join(",");
            $(this).attr("value", str);

            Apply.renderNameVal(array, "J_tags", "item", box, curId);
            var tagsBox = $(this).siblings(".J_tags");
            tagSpan = tagsBox.find(".item");
            Apply.addNameVal(tagsBox);
        });
        //删除曾用名,语言和国家
        $(document).on("click",".J_tags>a>i",function(){
            var me=$(this),
                parent=me.parents("a"),
                index=parent.index(),
                curPar = me.parents(".J_tags");
            pageConfig.tagList.splice(index, 1);
            parent.remove();
            Apply.addNameVal(curPar);
        });

        // 单选
        $(document).on("click", ".radio", function(e, applyList) {
            var self = $(this),
                value = self.attr("value"),
                type = self.attr("data-type"),
                index = self.attr("data-index"),
                dot = self.attr("data-dot"),
                parents = self.parents(":first");
            parents.attr("value", value);
            if (!self.hasClass("on")) {
                self.siblings().removeClass("on");
                self.addClass("on");
                parents.attr("value", self.attr("value"));
                parents.siblings(".dj-validate").remove();
                parents.siblings().find(".radio").removeClass("on");
                parents.siblings().find(".radio").parents(":first").attr("value","");
                parents.siblings().find(".speDiv").empty();//特殊处理
                parents.siblings().find("[removeValue]").attr("value", ""); //特殊处理
                // 选择其他                 
                var other = self.siblings(".user_defined");
                if (self.hasClass("other")) {
                    other.removeClass("none");
                } else {
                    other.addClass("none");
                }
                var choose = self.parents(".J_choose:first"),
                    data = {},
                    param = {};
                data.type = type;
                data.index = index;
                data.dot = dot;
                param.self = self;
                param.applyList = applyList;
                for (var key in data) {
                    if (data[key]) {
                        param.key = data[key];
                        Apply.renderData(key, param);
                    }
                };
                Apply.chooseVerify(choose);
                Apply.Progress();
            }
        });

        $(".radio-group").on("click", function() {
            var me = $(this),
                parents = me.parents(":first"),
                list = parents.find("[verify-type]");
            if (!me.hasClass("on")) {
                me.siblings().removeClass("on");
                me.addClass("on");
                parents.attr("value", me.attr("value"));
                parents.siblings(".dj-validate").remove();
                list.each(function() {
                    var me = $(this);
                    if (me.parents().hasClass("on")) {
                        me.attr("validate", me.attr("verify-type") || '');
                    } else {
                        me.val("");
                        me.removeClass("input_error");
                        me.siblings(".dj-validate").remove();
                        me.removeAttr("validate");
                        me.attr("validate", "");
                    }
                });
            }
        })

        // 增加模块
        $(document).on("click", ".add_module", function() {
            var curParent = $(this).parents(".J_xianyin"),
                curInput = curParent.find(".radio.on"),
                getDot = curInput.attr("data-dotname") || curInput.attr("data-dothtml"),
                getHtml = curInput.attr("data-html"),
                parentElem = $(this).parents(".J_AddOrDelete"),
                str = "";
            if (getHtml && getHtml != 0) {
                str = getHtml;
            } else if (getDot) {
                if (parentElem.length) {
                    var dotObj = {},
                        index = parentElem.find(".add-html").length;
                    dotObj.dotName = getDot;
                    dotObj.Index = index;
                    str = addOrDeleteDot(dotObj);
                } else {
                    str = commonDot(getDot);
                }
            } else {
                return;
            }
            curParent.find(".single_ul:last").after(str);
            var choose = $(this).parents(".J_choose:first");
            lastUl = choose.find(".single_ul:last");

            Apply.chooseVerify(lastUl);
        });

        // 删除模块
        $(document).on("click", ".del_btn", function() {
            var curParent = $(this).parents(".J_xianyin"),
                singleUl = curParent.find(".single_ul");
            if (singleUl.length < 2) {
                return;
            } else {
                $(this).parents(".single_ul").remove();
            }
        });

        // 下拉选择
        $(document).on("click", ".J_dropDown", function() {
            $(this).siblings(".J_dropDown_list").removeClass("none");
        });

        // 下拉选择
        $(document).on("click", ".J_dropDown_list li", function() {
            var value = $(this).html(),
                drop = $(this).parent().siblings(".J_dropDown");
            drop.attr("value", value);
            drop.html(value);
            $(this).parent().addClass("none");
            $(this).parents(".select_box").find(".dj-validate").removeClass("active");
        });

        // 下拉选择
        $(document).on("blur", ".J_selectBox", function() {
            $(this).find(".J_dropDown_list").addClass("none");
        });

        // 模块保存资料
        $(document).on("click", ".J_storage", function() {
            var me = $(this),
                wrapper = $("#J_content"),
                curIndex = wrapper.attr("data-index");
            setTimeout(function() {
                var inputList = $("input[FccontrolId][validate][class*='input_error']");
                if (inputList.length) return;
                Apply.IsSubmit = 1;
                Apply.getCurrentData(wrapper);
            }, 101)
        });

        //提交按钮
        $(document).on("click", ".J_btnSubmit", function() {
            var imgUpLoadStatus = true,
                type = parseInt($(this).attr("data-type") || 2);
            if (!pageConfig.$validate.validate()) {
                pageConfig.$dialog.alert("请将信息填写完整!");
                return;
            };
            if (!pageConfig.submitStatus) return;
            if (($("#hidIsSubmit").val() == 2) && type !=3) {
                pageConfig.$dialog.alert("您已提交成功,请勿重复提交!");
                return;
            }
            $.each($(".J_pic-box"), function() {
                var img = $(this).find("img.J_Pic");
                if (!img.attr("data-src")) {
                    imgUpLoadStatus = false;
                    return false;
                }
            });
            if (!imgUpLoadStatus || !$("img.J_Pic").length) {
                pageConfig.$dialog.alert("抱歉，请先检查图片是否上传或是否上传成功！");
                return;
            }
            pageConfig.submitStatus = false;
            $(this).addClass("noclick");
            $(this).text("资料保存中...");
            Apply.IsSubmit= type;
            Apply.getCurrentData($("#J_content"));
        });
    },
    //渲染过滤后的数据
    renderData: function(type, param) {
        var self = $(param.self),
            key = param.key,
            applyList = param.applyList,
            value = self.attr("value"),
            index = self.attr("data-index"),
            dotName = self.attr("data-dotname"),
            parents = self.parents(":first"),
            choose = self.parents(".J_choose:first"),
            list = choose.find("[verify-type]"),
            form = choose.find("[type='form']");
        var fun_list = function(list, ele, dotObj, key) {
            for (var i = 0; i < list.length; i++) {
                dotObj.Index = i;
                key == 1 ? ele.append(addOrDeleteDot(dotObj)) : isRender.empty();
                var ul = ele.find(".J_render"),
                    model = ul && ul[i],
                    array = list[i] || [];
                for (var j = 0; j < array.length; j++) {
                    var obj = array[j],
                        input = $(model).find('[Fccontrolid=' + obj.FCControlId + ']'),
                        value = obj.Value || "";
                    if (input.prop("tagName") == "INPUT") {
                        input.val(value);
                    } else {
                        input.attr("value", value);
                        input.text(value);
                    }
                }
            };
        };
        switch (type) {
            case "type":
                if (form.length) {
                    key == 1 ? form.removeClass("none") : form.addClass("none");
                } else {
                    key == 1 ? list.removeClass("none") : list.addClass("none");
                }
                break;
            case "index":
                form.addClass("none");
                form.eq(index).removeClass("none");
                form.find(".add-html").remove();
                break;
            case "dot":
                var isRender = parents.siblings(".J_renderDot"),
                    addOrDelete = self.parents(".J_AddOrDelete"),
                    special = addOrDelete.attr("data-special"), //针对美国旅行史下是否有美国驾驶证特殊处理
                    index = addOrDelete.attr("data-index"),
                    dotObj = {};
                isRender.find(".add-html").remove();
                if (addOrDelete.length && !special) {
                    dotObj.dotName = dotName;
                    dotObj.Index = 0;
                    dotObj.ApplyList = applyList;
                    if ((applyList && applyList.length) && dotName) {
                        fun_list(applyList, isRender, dotObj, key);
                    } else {
                        key == 1 ? isRender.append(addOrDeleteDot(dotObj)) : isRender.html("");
                    }
                } else {
                    key == 1 ? isRender.append(commonDot(dotName)) : isRender.html("");
                }
                break;
        };
    },

    // 获取数据
    getCurrentData: function(curParent) {
        var listEl = curParent.find("[FCControlId][validate]"),
            array = new Array();
        $.each(listEl, function(i, ele) {
            var dataObj = {},
                el = $(ele),
                id = el.attr("FCControlId") || "",
                fatherId = el.attr("FatherId"),
                isBlock = el.attr("data-block"),
                tagType = el.prop("tagName"),
                type = el.parents(".J_NavBox").attr("data-type") || "",
                value = tagType == "INPUT" ? el.val().trim() : (el.attr("value") || "").trim();
            dataObj.FCControlId = id;
            dataObj.Type = type;
            dataObj.Value = value;
            dataObj.FatherId = "";
            if (isBlock) {
                dataObj.Linkage = isBlock;
            }
            if (fatherId != undefined) {
                dataObj.FatherId = fatherId;
            } else {
                for (var i = 0; i < fatherIdList.length; i++) {
                    var formId = fatherIdList[i].FCControlId,
                        FatherId = fatherIdList[i].FatherId || el.attr("FatherId");
                    if (formId == id) {
                        dataObj.FatherId = FatherId;
                    }
                }
            }
            array.push(dataObj);
        });
        Apply.formSubmit(array);
    },
    //提交数据异步
    formSubmit: function(list) {
        var ajaxData = {},
            OrderId = $("#hidOrderId").val() || "",
            CustomerSerialId = $("#hidCustomerSerialId").val() || "",
            PassengerId = $("#hidPassengerId").val() || "",
            PassengerName = $("#hidPassengerName").val() || "";
        var btnStatus = function(type) {
            var btn = $(".J_btnSubmit"),
                str = type == 3 ? "审核":"保存";
            btn.removeClass("noclick");
            btn.text(str + "并提交资料");
            pageConfig.submitStatus = true;
        };
        if (!CustomerSerialId || !PassengerId || !list.length) {
            btnStatus();
            pageConfig.$dialog.alert(pageConfig.ERROR_FLAG);
            return;
        }
        if(Apply.IsSubmit == 3){
            ajaxData.Sign = Apply.getQueryString("Sign") || "";
            ajaxData.Token = Apply.getQueryString("Token") || "";
        }else{
            ajaxData.IsSubmit = Apply.IsSubmit; 
        }
        ajaxData.CustomerSerialId = CustomerSerialId;
        ajaxData.PassengerId = PassengerId;
        ajaxData.PassengerName = PassengerName;
        ajaxData.JsonData = encodeURIComponent(JSON.stringify(list));
        $.ajax({
            url: pageConfig.saveUrl,
            type: "POST",
            dataType: "json",
            data: ajaxData,
            success: function(data) {
                 btnStatus(Apply.IsSubmit);
                if (data.Status && data.Data.status) {
                    if (Apply.IsSubmit == 1) {
                        pageConfig.$dialog.alert("保存资料成功");
                    } else if(Apply.IsSubmit == 2) {
                        pageConfig.$dialog.alert("提交成功，客服专员会尽快给您审核，请关注",function(){
                            window.location.href = "//member.ly.com/dujia/DujiaOrderDetailVisa.aspx?id=" + OrderId;
                        });
                        $("#hidIsSubmit").val(2);
                        $(".submit").hide();
                        $(".silder_bar").hide();
                    }else if(Apply.IsSubmit == 3){
                        pageConfig.$dialog.alert("资料审核成功");
                    }
                } else {
                    var message = data.Data.message,
                        msg = message ? message:"资料审核失败",
                        str = Apply.IsSubmit == 3 ? msg:pageConfig.ERROR_FLAG;
                    pageConfig.$dialog.alert(str);
                }
            },
            error: function(error) {
                var str = Apply.IsSubmit == 3 ? "资料审核失败,请联系相关人员！":pageConfig.ERROR_FLAG;
                btnStatus(Apply.IsSubmit);
                pageConfig.$dialog.alert(str);
            }
        });
    },
    //抠url参数值
    getQueryString: function(queryStr, key) {
        var _queryStr, _key;
        _queryStr = key ? queryStr : window.location.search.substr(1);
        _key = key || queryStr;
        var reg = new RegExp("(^|&)" + _key + "=([^&]*)(&|$)", "i");
        var r = _queryStr.match(reg);
        if (r !== null) {
            return decodeURI(r[2]);
        }
        return null;
    },
    //给父级"添加"按钮赋值
    addNameVal: function(that) {
        var keyValue = $(that).siblings(".add_name");
        arr = [];
        $(that).find(".item").each(function() {
            var curValue = $(this).text();
            arr.push(curValue);
        })
        keyValue.attr("value", arr.join(","));
    },
    renderNameVal: function(list, parName, childname, box, curId) {
        box.className = parName;
        var strHtml = "";
        for (var i = 0; i < list.length; i++) {
            strHtml += '<a value="' + list[i] + '" class="' + childname + '" FCControlId="' + curId+ '_name_'+ i + '" FatherId="' + curId + '" validate="required" verify><span>' + list[i] + '</span><i></i></a>';
        }
        box.empty();
        box.append(strHtml);
    },
    // 初始化绑定点击日期控件事件功能
    CalPickInit: function() {
        $(document).on("click", ".J_dateTime", function() {
            var me = $(this),
                startDate = new Date(1900, 1 - 1, 1),
                endDate = new Date(),
                cDate = new Date(),
                currentDate = [],
                dateType = me.attr("date-type"),
                startVal = "",
                endVal = "";
            if (dateType) {
                startVal = $("input[date-type=" + dateType + "][class*='start']").val() || "";
                endVal = $("input[date-type=" + dateType + "][class*='end']").val() || "";
            } else {
                startVal = me.parent().find("input[class*='start']").val() || "";
                endVal = me.parent().find("input[class*='end']").val() || "";
            }

            if (me.hasClass("start")) {
                startDate = dateType == "flight" ? new Date() : new Date(1900, 1 - 1, 1);
                cDate = endVal ? endVal : new Date();
                tData = dateType == "flight" ? new Date(2200, 1 - 1, 1) : new Date();
                endDate = endVal ? endVal : tData;
            } else if (me.hasClass("end")) {
                startDate = startVal ? startVal : new Date(1900, 1 - 1, 1);
                endDate = new Date(2200, 1 - 1, 1);
                cDate = startVal ? startVal : new Date();
            } else if (me.hasClass("future")) {
                startDate = new Date();
                endDate = new Date(2200, 1 - 1, 1);
            }

            currentDate.push(cDate);
            pageConfig.BirthDayCal.pick({
                elem: this,
                startDate: startDate,
                endDate: endDate,
                mode: "rangeFrom",
                currentDate: currentDate
            });
        });
    },
    // 选择验证
    chooseVerify: function(obj) {
        if (!obj || !obj.length) return;
        var form = obj.find("[verify-type]");
        form.each(function(index, ele) {
            var me = $(ele),
                tag = me.prop("tagName"),
                type = me.parents("[type='form']:first");
            module = type.length ? type : me;
            if (!module.hasClass("none")) {
                me.attr("validate", me.attr("verify-type") || '');
                if (tag == "INPUT") {
                    var length = me.siblings(".valid_symbol").length,
                        last = me.siblings("input:last"),
                        curEl = last.length ? last : me;
                    strHtml = '<span class="valid_symbol none"></span>';
                    !length ? curEl.after(strHtml) : "";
                } else {
                    me.attr("verify", "");
                }
            } else {
                tag == "INPUT" ? me.val("") : me.attr("value", "");
                me.removeClass("input_error");
                me.siblings(".dj-validate").remove();
                me.siblings(".valid_symbol").remove();
                me.removeAttr("verify validate");
            }
        });
    },
    // 上传图片        
    initUplodify: function() {
        $(".J_add-pic").map(function(index, item) {
            Apply.upLoadImg(document.getElementById("addpic-" + (index + 1)));
        });
        $(document).on("click", ".J_Close_Pic i", function() {
            var pic = $(this).parents(".J_pic-box:first");
            pic.find(".upload-pic").remove();
            pic.find(".J_add-pic").show();
        });
        $(document).on("mouseover", ".J_Pic", function() {
            var addr = $(this).attr("src"),
                str = '<div class="bigImg"><img src=' + addr + '></div>';
            $(this).after(str);
        });
        $(document).on("mouseout", ".J_Pic", function() {
            $(this).siblings(".bigImg").remove();
        });
    },
    upLoadImg: function(dom) {
        var imgStyle = "width:100px;height:100px",
            customerSerialId = $("#hidCustomerSerialId").val(),
            passengerId = $("#hidPassengerId").val();
        var _upload = new uploadModule({
            url: pageConfig.uploadUrl + "customerSerialId=" + customerSerialId + "&passengerId=" + passengerId,
            previewEl: dom,
            size: [600, 340],
            max_file_size: "4M",
            max: 50,
            extensions: "jpg,png,jpeg,bmp",
            afterPreview: function(imgUrl, file) {
                if (!customerSerialId || !passengerId) {
                    pageConfig.$dialog.alert(pageConfig.ERROR_FLAG);
                    return;
                }
                this.loader.start();
            },
            uploadCompleteFunc: function() {
                this.refresh();
            },
            errorFunc: function(errorObj) {
                var msg = "";
                if( msg.indexOf("extension")>-1 ){
                    msg = "上传文件格式仅支持jpg,png,jpeg,bmp!";
                }else if(msg.indexOf("size")>-1){
                    msg = "上传文件的大小不能超过4M! ";
                }else{
                    msg = "图片上传失败,请重新上传! ";
                }
                pageConfig.$dialog.alert(msg);
            },
            uploadedFunc: function(file, res) {
                var obj = eval('(' + res.response + ')'),
                    data = obj.Data || {},
                    url = data.url || "",
                    btn = $(this.settings.browse_button[0]),
                    FCControlId = btn.attr("data-type");
                if (!data.status) {
                    pageConfig.$dialog.alert("图片上传失败，请重新上传！");
                    return;
                }
                btn.before('<div class="upload-pic J_Close_Pic" style="display:none"><img  class="pic J_Pic" src="' + url + '" id="' + file.id + '" style="' + imgStyle + '" data-src="' + url + '"/><i></i><span>上传成功</span></div>');
                btn.attr("FCControlId", FCControlId);
                btn.attr("value", url);
                btn.attr("validate", "none");
                btn.hide();
                btn.siblings(".upload-pic").show();
            }
        });
    },
};
module.exports = Apply;
