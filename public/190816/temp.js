/*from tccdn minify at 2017-6-16 10:55:17,file：/cn/s/WX/order/book_invoice.1.0.js*/
/**
 * SeleList
 */
//<<-------级联城市----------
(function () {
    var cityData = [{
        "id": 3106,
        "name": "国内",
        "children": [{
                "id": 2,
                "name": "安徽"
            },
            {
                "id": 3,
                "name": "北京"
            },
            {
                "id": 4,
                "name": "福建"
            },
            {
                "id": 5,
                "name": "甘肃"
            },
            {
                "id": 6,
                "name": "广东"
            },
            {
                "id": 7,
                "name": "广西"
            },
            {
                "id": 8,
                "name": "贵州"
            },
            {
                "id": 9,
                "name": "海南"
            },
            {
                "id": 10,
                "name": "河北"
            },
            {
                "id": 11,
                "name": "河南"
            },
            {
                "id": 12,
                "name": "黑龙江"
            },
            {
                "id": 13,
                "name": "湖北"
            },
            {
                "id": 14,
                "name": "湖南"
            },
            {
                "id": 15,
                "name": "吉林"
            },
            {
                "id": 16,
                "name": "江苏"
            },
            {
                "id": 17,
                "name": "江西"
            },
            {
                "id": 18,
                "name": "辽宁"
            },
            {
                "id": 19,
                "name": "内蒙古"
            },
            {
                "id": 20,
                "name": "宁夏"
            },
            {
                "id": 21,
                "name": "青海"
            },
            {
                "id": 22,
                "name": "山东"
            },
            {
                "id": 23,
                "name": "山西"
            },
            {
                "id": 24,
                "name": "陕西"
            },
            {
                "id": 25,
                "name": "上海"
            },
            {
                "id": 26,
                "name": "四川"
            },
            {
                "id": 27,
                "name": "天津"
            },
            {
                "id": 28,
                "name": "西藏"
            },
            {
                "id": 29,
                "name": "新疆"
            },
            {
                "id": 30,
                "name": "云南"
            },
            {
                "id": 31,
                "name": "浙江"
            },
            {
                "id": 32,
                "name": "重庆"
            },
            {
                "id": 33,
                "name": "香港"
            },
            {
                "id": 34,
                "name": "澳门"
            },
            {
                "id": 35,
                "name": "台湾"
            }
        ]
    }];


    function findBy(type, value, data) {
        for (var n = 0; n < data.length; n++) {
            if (data[n][type] == value) {
                return data[n].children;
            }
        }
    }

    /**
     * 创建级联下拉单
     * @param {Object} data
     * @param {Object} elemArray
     * @param {Object} elemArray.query 该级联下拉单的索引字符串
     * @param {Object} elemArray.firstTxt 该级联下拉单的默认第一条信息
     * @param {Object} elemArray.ajaxData 该级联下拉单没有数据时的请求地址
     * @param {Object} elemArray.onchange 该级联下拉单的onchange事件，回调函数
     * 0.4.1新增
     * @param {Object} elemArray.SelectData 指定省市县，异步获取数据。
     */
    var SeleList = function (elemArray, param) {
        this.data = [];
        this.elem = [];
        this.firstTxt = [];
        this.ajaxData = [];
        this.onchange = [];
        for (var n = 0; n < elemArray.length; n++) {
            this.data[n] = elemArray[n].data;
            this.elem[n] = $(elemArray[n].query)[0];
            this.firstTxt[n] = elemArray[n].firstTxt;
            this.ajaxData[n] = elemArray[n].ajaxData;
            this.onchange[n] = elemArray[n].onchange;
        }
        this.valueName = param.valueName ? param.valueName : "name";
        this.allData = cityData; //默认国内城市数据
        this.init();

        return this;
    }

    SeleList.prototype = {
        init: function () {

            this.setFirstTxt();

            for (var n = 0; n < this.elem.length; n++) {
                if (typeof this.data[n] === "number") {
                    this.data[n] = findBy("id", this.data[n], this.allData);
                }
                if (this.data[n]) {
                    this.bulid(n);
                }
            }
            this.bindElem();
        },

        /**
         * 设置默认下拉单
         */
        setFirstTxt: function () {
            for (var n = 0; n < this.elem.length; n++) {
                this.removeSele(n);
                this.elem[n].options[0] = new Option(this.firstTxt[n]);
            }
        },

        setData: function (array, n, param, callback) {
            this.data[n] = array;
            this.bulid(n, param);
            callback && callback();
        },
        //绑事件
        bindElem: function () {
            var that = this;
            for (var n = 0, thisLength = this.elem.length; n < thisLength; n += 1) {
                //一个大闭包
                (function (n) {
                    $(that.elem[n])[0].onchange = null;
                    $(that.elem[n])[0].onchange = function () {
                        var nextArray;
                        if (this.selectedIndex > 0) {
                            nextArray = findBy("id", this.options[this.selectedIndex].getAttribute("_id"), that.data[n]);
                        } else {
                            if (that.elem[0] == this) {
                                that.elem[n + 1].options.length = 1;
                                that.elem[n + 2].options.length = 1;
                            }
                        }
                        if (that.onchange[n]) {
                            that.onchange[n](this, this.selectedIndex);
                        }
                        if (nextArray) {
                            if (that.elem[n + 1]) {
                                that.data[n + 1] = nextArray;
                                that.bulid(n + 1);
                            }
                        } else if (that.ajaxData[n + 1] && that.elem[n].selectedIndex != 0) {
                            that.ajaxSetData(n + 1);
                        }
                    };
                })(n);
            }
        },
        //不公开使用
        ajaxSetData: function (index, param, callback) {
            var url, that = this,
                prevOptions = this.elem[index - 1];
            if (that.ajaxData && prevOptions) {
                url = that.ajaxData[index](prevOptions.options[prevOptions.selectedIndex].getAttribute("_id"));
                $.ajax({
                    cache: true,
                    dataType: "jsonp",
                    url: url,
                    success: function (data) {
                        if (data && data.result) {
                            that.setData(data.result, index, param, callback);
                        }
                    }
                });
            }
        },
        /////异步请求，param配置参数{province : id/name,city : id/name,area : id/name} ,callback 为结束后执行的方法。
        SelectData: function (param, callback) {
            var provinceid, cityid, areaid, provincename, cityname, areaname, that = this,
                index = 1,
                length = 0;
            that.init();
            for (var length_ in param) {
                length++;
            }
            //对应的如果传入的param为空的话就跳出。
            if (length > 0) {
                for (var i in cityData[0].children) {
                    if (param.province == cityData[0].children[i].name || param.province == cityData[0].children[i].id) {
                        provinceid = cityData[0].children[i].id;
                        provincename = cityData[0].children[i].name;
                        break;
                    }
                }
                that.bulid(0, {
                    selected: provincename
                });
                url = that.ajaxData[index](provinceid);
                $.ajax({
                    cache: true,
                    dataType: "jsonp",
                    url: url,
                    success: function (data) {
                        if (data && data.result) {
                            that.setData(data.result, index, param);
                            if (length >= 2) {
                                for (var aa in data.result) {
                                    if (param.city == data.result[aa].name || param.city == data.result[aa].id) {
                                        cityid = data.result[aa].id;
                                        cityname = data.result[aa].name;
                                        break;
                                    }
                                }
                                that.bulid(1, {
                                    selected: cityname
                                });
                                index++;
                                url = that.ajaxData[index](cityid);
                                $.ajax({
                                    cache: true,
                                    dataType: "jsonp",
                                    url: url,
                                    success: function (data1) {
                                        if (data1 && data1.result) {
                                            that.setData(data1.result, index, param);
                                            if (length == 3) {
                                                for (var aaa in data1.result) {
                                                    if (param.area == data1.result[aaa].name || param.area == data1.result[aaa].id) {
                                                        cityid = data1.result[aaa].id;
                                                        cityname = data1.result[aaa].name;
                                                        break;
                                                    }
                                                }
                                                that.bulid(2, {
                                                    selected: cityname
                                                });
                                                callback && callback();
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }

                });
            }
        },
        //清空某个下拉框的数据
        removeSele: function (n) {
            var length = this.elem[n].length,
                sele = this.elem[n];
            for (var i = length - 1; i >= 0; i--) {
                sele.options[i] = null;
            }
        },
        //创建第n个下拉菜单的内容，然后再绑定n+1个下拉框的数据 省份0，市 1，区2
        bulid: function (n, param) {
            //对应的下拉内容无数据，则不创建

            if (this.data[n]) {
                //param参数包含过滤信息
                this.removeSele(n); //清空下拉菜单的值
                var length = this.data[n].length,
                    sele = this.elem[n],
                    data = this.data[n],
                    allEnable = true;
                if (this.firstTxt[n] !== null) {
                    var newOpt = new Option(this.firstTxt[n], this.firstTxt[n]);
                    newOpt.setAttribute("_id", 0);
                    try {
                        sele.add(newOpt, null); // standards compliant
                    } catch (ex) {
                        sele.add(newOpt); // IE only
                    }

                    sele.selectedIndex = 0;
                }
                if (param && param.only) {
                    allEnable = false;
                }

                for (i = 0; i < length; i++) {
                    if ((data[i].name !== "0" && allEnable) ||
                        (!allEnable && data[i].name === param.only)) {
                        var newValue = typeof this.valueName === "function" ? this.valueName(data[i]) : data[i][this.valueName];
                        var newOpt = new Option(data[i].name, newValue);
                        newOpt.setAttribute("_id", data[i].id);
                        try {
                            sele.add(newOpt, null); // standards compliant
                        } catch (ex) {
                            sele.add(newOpt); // IE only
                        }
                        //默认选中
                        if (param && param.selected === data[i].name) {
                            (function (seled, ii) {
                                setTimeout(function () {
                                    seled.selectedIndex = ii + 1;
                                }, 0);
                            })(sele, i);
                        }
                    }
                }
                this.bulid(n + 1);
            }
            //如果省份被改变，清空县级下拉框内容。
            if (n == 1) {
                try {
                    this.elem[n + 1].options.length = 1;
                } catch (err) {}
            }
        }
    };

    $.fn.mCitySelect = function (param, callback) {
        //第一个使用国内的省数据，直接使用id
        var aParam = [];
        if (param.province) {
            aParam.push({
                query: param.province,
                firstTxt: param.provinceFirstText ? param.provinceFirstText : "省份",
                data: 3106
            });
        }
        if (param.city) {
            aParam.push({
                query: param.city,
                firstTxt: param.cityFirstText ? param.cityFirstText : "城市",
                ajaxData: param.cityAjaxUrl ? param.cityAjaxUrl : function (provid) {
                    return "/scenery/json/GetGuojiadiquData.html?action=GetCityByProvince&id=" + provid;
                }
            });
        }
        if (param.area) {
            aParam.push({
                query: param.area,
                firstTxt: param.areaFirstText ? param.areaFirstText : "区县",
                ajaxData: param.areaAjaxUrl ? param.areaAjaxUrl : function (cityid) {
                    return "/scenery/json/GetGuojiadiquData.html?action=GetCityByProvince&id=" + cityid;
                }
            });
        }
        var oList = new SeleList(aParam, param);
        callback && callback(oList);
        return oList;
    }

})();
//---------级联城市-------->>



/* 发票 */
var bookInvoice = {
    memberId: null,
    orderId: "",
    serialId: "",
    isRquire: /.+/, //非空
    isEnOrCn: /^[A-Za-z\u0391-\uFFE5]+$/, //英文或中文
    isNumber: /^\d+$/, //数字验证
    isMobile: /^0?(13|14|15|18|17)[0-9]{9}$/, //手机号.
    isIdCard: /(^\d{15}$)|(\d{17}(?:\d|x|X)$)/, //身份证
    dateReg: /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/, //YYYY-MM-DD 日期验证
    isMail: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, //邮箱
    ts: new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？]"), //过滤特殊字符
    cacheFill: null, //缓存需要填写的联系人数据
    cacheEdit: null, //缓存编辑联系人数据
    AddAndEditWarp: null, //新增和编辑联系人容器
    addrChoose: null, //选择地址按钮
    pContent: null, //信息主页面
    mailBookWarp: null, //主页面信息容器
    cContactWarp: null, //联系人列表容器
    editWarp: null, //编辑联系人容器
    fpTypeWarp: null, //抬头类型
    invoiceTypeWrap: null, //发票类型

    useTypeWarp: null, //特殊用途类型
    eFpHeaderInput: null, //发票抬头输入

    eConsigneeInput: null, //收货人输入
    ePhoneInput: null, //联系号码
    eaddrInput: null, //详细地址
    eSelectWarp: null, //级联菜单容器
    eSelectPro: null, //省份选择
    eSelectCity: null, //城市选择
    eSelectDistrict: null, //县区选择
    submitBtn: null, //提交按钮

    itemBackBtn: null, //联系人列表返回按钮
    itemAddBtn: null, //联系人新增元素
    itemSucBtn: null, //联系人列表完成按钮
    editBackBtn: null, //编辑信息页返回按钮
    editSucBtn: null, //编辑信息页成功按钮
    itemWarpUl: null, //联系人容器

    tConsigneeInput: null, //编辑信息页收货人输入
    tPhoneInput: null, //编辑信息页联系号码
    taddrInput: null, //编辑信息页详细地址
    tSelectWarp: null, //编辑信息页级联菜单容器
    tSelectPro: null, //编辑信息页省份选择
    tSelectCity: null, //编辑信息页城市选择
    tSelectDistrict: null, //编辑信息页县区选择

    mCity: null, //主页面级联对象
    tCity: null, //编辑页级联对象

    isSub: true,

    need_code: false,
    code_get: false,
    eCodeInput: null,
    mail_sel_state: false,

    invoice_type: 1, //默认电子发票
    emailAddress: null, //邮箱

    opid: null,
    unionid: null,
    init: function () {
        if ($(".state_suc")[0] || $(".state_fail")[0] || $(".state_ver")[0]) {
            return;
        }
        var me = this;
        /* 初始化 */
        this.addrChoose = $("#mailAddrChoose");
        this.pContent = $(".content");
        this.fpTypeWarp = $(".bill_type");
        this.invoiceTypeWrap = $(".invoice_type");
        this.useTypeWarp = $(".use_type");
        this.mailBookWarp = $("#billContent .mail_box");
        this.eFpHeaderInput = $("#bill_code_i");
        this.emailInput = $("#emailInput");
        this.eConsigneeInput = "";
        this.ePhoneInput = "";
        this.eaddrInput = "";
        this.eSelectWarp = $("#billContent .s_select");
        this.eSelectPro = $("#billContent #pro");
        this.eSelectCity = $("#billContent #city");
        this.eSelectDistrict = $("#billContent #district");
        this.submitBtn = $("#billSubmit");
        var link = window.location.search;
        this.opid = this.findParam(link, 'opid');
        this.unionid = this.findParam(link, 'unionid');

        this.eCodeInput = $("#bill_code_c");
        debugger

        console.log('invoice_type',this.invoice_type)

        this._creatAddAndEditHtml();
        this.typeElement(this.fpTypeWarp);
        this.typeElement(this.useTypeWarp);

        this.choseInvoiceType();

        $("#emailInput").blur(function () {
            me.emailAddress = $(this).val();

        })

        //页面初始化获取URL参数
        this.getParamId();

        //主页面选择地址操作获取联系人列表
        this.addrChoose.on("click", function () {
            bookInvoice.getContactList("get");
        });

        //联系人页返回按钮操作
        this.itemBackBtn.click(function () {
            bookInvoice.cantactClose()
        });

        //信息列表完成按钮交互
        this.itemSucBtn.click(
            function () {
                bookInvoice.bindMail();
                bookInvoice.cantactClose();
            }
        );

        //联系人页新增联系人操作
        this.itemAddBtn.click(function () {
            bookInvoice.initEditBook();
            bookInvoice.editOpen();
            bookInvoice.cacheEdit = null;
        });

        //编辑页返回按钮操作
        this.editBackBtn.click(function () {
            bookInvoice.editClose()
        });

        //编辑页成功按钮操作
        this.editSucBtn.click(
            function () {
                bookInvoice.submitEidt();
            }
        );

        //提交主页信息
        this.submitBtn.click(
            function () {
                if (!$(this).hasClass("bill_submit_gray")) {
                    bookInvoice.submitAjax();
                }
            }
        );




        //城市级联
        // this.mCity = $.fn.mCitySelect({province:me.eSelectPro, city:me.eSelectCity, area:me.eSelectDistrict},function(citySelObj){});

        //编辑页城市级联
        this.tCity = $.fn.mCitySelect({
            province: me.tSelectPro,
            city: me.tSelectCity,
            area: me.tSelectDistrict
        }, function (citySelObj) {});

        // 发票新增加纳税人识别号
        $(".code_tip").on("click", function () {
            $(".bill_alert").show();
        })

        $(".bill_alert .close").on("click", function () {
            $(".bill_alert").hide();
        })

        $(".bill_type .bt_sel").each(function (i, elem) {

            $(elem).on("click", function () {
                me.code_get = false;
                me.eFpHeaderInput.val("");
                if ($(elem).hasClass("company")) {
                    me.need_code = true;
                    $("#bill_code").show();
                } else {
                    me.need_code = false;
                    me.eCodeInput.val("");
                    $("#bill_code").hide();
                }
                $(".bill_type .bt_sel").removeClass("at");
                $(elem).addClass("at");
            })
        })


        me.eFpHeaderInput.blur(function () {

            if (me.need_code) {

                var _that = $(this);


                if (!_that.val().trim()) {
                    return;
                }

                $.ajax({
                    url: "//m.ly.com/scenery/json/getenterpriseinfo.html?comid=1&enterpriseName=" + $("#bill_code_i").val() + "&token=" + $("#Token").val(),
                    dataType: "jsonp",
                    jsonp: 'callback',
                    jsonpCallback: 'callback',
                    success: function (data) {
                        if (data && data.code == "0") {
                            me.code_get = true;
                            me.eCodeInput.val(data.data[0].creditCode);
                        } else {
                            me.code_get = false;
                            bookInvoice.errorDialog("请输入正确的发票抬头");
                        }
                    },
                    error: function () {}
                })
            }



        })

        this.initBook();
    },
    //选择发票类型
    choseInvoiceType: function () {
        var that = this;
        $('.invoice_type span').on('click', function () {
            $('.invoice_type span').removeClass('at');
            $(this).addClass('at');
            var index = $(this).index();
            that.invoice_type = $(this).attr('data-type');
            if (index == 0) {
                $('#emailChoose').removeClass('none');
                $('#mailAddrChoose').addClass('none');
                $('#invoiceInfo').addClass('none');
            } else {
                $('#emailChoose').addClass('none');
                $('#mailAddrChoose').removeClass('none');
                $('#invoiceInfo').removeClass('none');
            }
        })
    },
    //创建新增和修改联系人节点
    _creatAddAndEditHtml: function () {
        //如果是状态页面不创建
        if ($(".state_suc")[0] || $(".state_fail")[0] || $(".state_ver")[0]) {
            return;
        }

        if (!$("#billAddEditWarp")[0]) {
            if ($(".content")[0]) {
                $(".content").before("<div id='billAddEditWarp'></div>")
            } else {
                $("body").append("<div id='billAddEditWarp'></div>");
            }
        } else {
            return;
        }

        this.AddAndEditWarp = $("#billAddEditWarp");
        this.AddAndEditWarp.hide();

        var sHtml = '<div class="cantact_item" id="cantactItem" >\
                        <div><div class="add_contact">新增常用地址<a href="javascript:;">+</a></div>\
                        <ul>\
                            <li class="loader"></li>\
                          </ul></div>\
                           <div class="backheader">\
                            <a href="javascript:void(0);" class="back">取消</a>\
                            <span class="back_success">确认</span>\
                           </div>\
                        </div>\
                        <div class="cantact_edit" style="display: none;" id="cantactEdit">\
                        <div class="mail_fill">\
                            <dl class="mail_name">\
                                <dt>收件人：</dt>\
                                <dd>\
                                    <input type="text" class="" value="" placeholder="请填写收货人姓名" name="mailName">\
                                    </dd>\
                            </dl>\
                                <dl class="mail_mobile">\
                                    <dt>联系电话：</dt>\
                                    <dd>\
                                        <input type="tel" class="" value="" placeholder="请填写手机号码" maxlength="11" name="mailMobile">\
                                    </dd>\
                                </dl>\
                                <dl class="mail_addr_area">\
                                    <dt>所在地区：</dt>\
                                    <dd>\
                                    <div class="s_select">\
                                        <select name="addPro" id="addPro">\
                                            <option value="0">请选择省</option>\
                                            <option value="2">江苏</option>\
                                        </select>\
                                        <select name="addCity" id="addCity">\
                                            <option value="0">请选择市</option>\
                                        </select>\
                                        <select name="addDistrict" id="addDistrict">\
                                            <option value="0">请选择区</option>\
                                        </select>\
                                      </div>\
                                    </dd>\
                                </dl>\
                                <dl class="mail_addr_street">\
                                    <dt>详细地址：</dt>\
                                    <dd>\
                                        <input type="text" class="" value="" placeholder="请填写您的详细收件地址" name="mailAddress">\
                                    </dd>\
                                </dl>\
                         </div>\
                            <div class="backheader">\
                                <a href="javascript:void(0);" class="back">取消</a>\
                                <span class="back_success">保存</span>\
                        </div>\
                </div>\
                                ';

        this.AddAndEditWarp.html(sHtml);

        this.cContactWarp = $("#cantactItem", this.AddAndEditWarp);
        this.editWarp = $("#cantactEdit", this.AddAndEditWarp);

        this.itemAddBtn = $("#cantactItem .add_contact", this.AddAndEditWarp);

        this.itemBackBtn = $("#cantactItem .back", this.AddAndEditWarp);
        this.itemSucBtn = $("#cantactItem .back_success", this.AddAndEditWarp);

        this.editBackBtn = $("#cantactEdit .back", this.AddAndEditWarp);
        this.editSucBtn = $("#cantactEdit .back_success", this.AddAndEditWarp);

        this.tConsigneeInput = $(".mail_name input", this.AddAndEditWarp);
        this.tPhoneInput = $(".mail_mobile input", this.AddAndEditWarp);
        this.taddrInput = $(".mail_addr_street input", this.AddAndEditWarp);
        this.tSelectWarp = $(".s_select", this.AddAndEditWarp);
        this.tSelectPro = $("#addPro", this.AddAndEditWarp);
        this.tSelectCity = $("#addCity", this.AddAndEditWarp);
        this.tSelectDistrict = $("#addDistrict", this.AddAndEditWarp);

        //更新联系人列表元素获取
        this.itemWarpUl = $("#cantactItem ul"); //联系人列表容器
    },

    //提交函数
    submitAjax: function () {
        var me = this;
        if (this.verifyFillBook()) {
            var paramData = "applystr=" + this.getMailParam();
            var toUrl = '/scenery/booking/invoiceinfo.html?SerialId=' + this.serialId + '&opid=' + me.opid + '&unionid=' + me.unionid;
            this.submitBtn.addClass("bill_submit_gray");

            // console.log(paramData);

            setTimeout(function () {

                $.ajax({
                    url: "/scenery/booking/invoiceapply.html?opid=" + me.opid + "&unionid=" + me.unionid,
                    data: paramData,
                    dataType: "json",
                    type: "post",
                    success: function (data) {
                        if (data.state == "100") {
                            window.location.href = toUrl;
                        } else if (data.state == "200") {
                            switch (data.result) {
                                case "2861":
                                    bookInvoice.showTip("您的开票金额错误，请重新申请!");
                                    break;
                                case "2879":
                                    bookInvoice.showTip("该订单您已申请发票，请确认后重新提交!");
                                    break;
                                case "6503":
                                    bookInvoice.showTip("该订单您已申请发票，请勿重复申请!");
                                    break;
                                case "6530":
                                    bookInvoice.showTip("发票抬头不能和核算主体相同!");
                                    break;
                                default:
                                    bookInvoice.showTip("网络异常，提交失败！")
                            }
                        } else {
                            bookInvoice.showTip("网络异常，提交失败！")
                        }
                        me.submitBtn.removeClass("bill_submit_gray");
                    },
                    error: function () {
                        bookInvoice.showTip("网络异常，提交失败！");
                        me.submitBtn.removeClass("bill_submit_gray");
                    }
                })
            }, 500)
        }
    },

    //编辑页提交函数
    submitEidt: function () {
        if (this.verifyEidt()) {
            this.getContactList();
        }
    },

    //编辑页信息填写验证
    verifyEidt: function () {
        var rt = true;
        var me = this;

        //验证收货人
        if (!me.verify("name", this.tConsigneeInput.val())) {
            bookInvoice.errTip(this.tConsigneeInput, "请正确填写收获人姓名！");
            rt = false;
        } else {
            bookInvoice.errHide(this.tConsigneeInput);
        }

        //验证手机号
        if (!me.verify("phone", this.tPhoneInput.val())) {
            bookInvoice.errTip(this.tPhoneInput, "请正确填写手机号码！");
            rt = false;
        } else {
            bookInvoice.errHide(this.tPhoneInput);
        }

        //验证省市区
        if (this.tSelectPro.val() == "省份" || this.tSelectCity.val() == "城市" || this.tSelectDistrict.val() == "区县") {
            bookInvoice.errTip(this.tSelectWarp, "请选择您的所在省市区/县！");
            rt = false;
        } else {
            bookInvoice.errHide(this.tSelectWarp);
        }

        //验证详细地址
        if (!me.verify("rq", this.taddrInput.val())) {
            bookInvoice.errTip(this.taddrInput, "请填写您的详细收件地址！");
            rt = false;
        } else {
            bookInvoice.errHide(this.taddrInput);
        }

        return rt;
    },

    //验证信息
    verifyFillBook: function () {
        var rt = true;
        var me = this;


        //验证发票抬头
        if (!me.verify("rq", this.eFpHeaderInput.val())) {
            bookInvoice.errorDialog("请输入发票抬头！");
            rt = false;
            return rt;
        }


        if (me.need_code && !me.code_get) {
            bookInvoice.errorDialog("请正确输入发票抬头！");
            rt = false;
            return rt;
        }


        if (!me.mail_sel_state && me.invoice_type == 0) {
            bookInvoice.errorDialog("请选择邮寄地址！");
            rt = false;
            return rt;
        }
        if (!me.emailAddress && me.invoice_type == 1) {
            bookInvoice.errorDialog("请填写邮箱地址！");
            rt = false;
            return rt;
        }
        var isMail = /^[a-zA-Z\d]([\w\-\.]*[a-zA-Z\d])?@[a-zA-Z\d]([a-zA-Z\d\-]*[a-zA-Z\d])?(\.[a-zA-Z]{2,6})+$/;
        if (!isMail.test(me.emailAddress) && me.invoice_type == 1) {
            bookInvoice.errorDialog("请填写正确的邮箱地址！");
            rt = false;
            return rt;
        }
        return rt;
    },

    //验证模块
    verify: function (type, val) {
        var ver;
        var cVal = $.trim(val);
        switch (type) {
            case "rq": //非空验证
                if ($.trim(cVal) !== "" && !this.ts.test(cVal)) {
                    ver = this.isRquire.test(cVal);
                } else {
                    ver = false;
                }
                break;
            case "name": //姓名验证
                ver = this.isEnOrCn.test(cVal);
                break;
            case "phone": //手机验证
                ver = this.isMobile.test(cVal);
                break;
            case "idcard": //身份证
                ver = this.validIdCard(cVal);
                break;
            case "passport": //护照
                ver = this.isNumber.test(cVal);
                break;
            case "date": //日期验证 isMail
                ver = this.dateReg.test(cVal);
                break;
            case "mail": //邮箱验证
                ver = this.isMail.test(cVal);
                break;
            default:
        }

        if (ver) {
            return true;
        } else {
            return false;
        }
    },
    stripscript: function (s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    },
    errTip: function (ele, tip) {
        if ($(".err_tip", $(ele).parents("dd"))[0]) {
            $(".err_tip", $(ele).parents("dd")).html(tip);
            $(".err_tip", $(ele).parents("dd")).show();
        } else {
            $(ele).after('<div class="err_tip">' + tip + '</div>');
        }
    },

    errHide: function (ele) {
        $(".err_tip", $(ele).parents("dd")).hide();
    },

    //    身份证验证
    validIdCard: function (myValue) {
        if (myValue == "") {
            return false;
        } else if (myValue.length == 15) {
            for (var i = 0; i < myValue.length; i++) {
                if (myValue.charAt(i) < '0' || myValue.charAt(i) > '9') {
                    return false;
                    break;
                }
            }
            var year = myValue.substr(6, 2);
            var month = myValue.substr(8, 2);
            var day = myValue.substr(10, 2);
            var sexBit = myValue.substr(14);

            if (year < '01' || year > '90') {
                return false;
            }

            if (month < '01' || month > '12') {
                return false;
            }

            if (day < '01' || day > '31') {
                return false;
            }
        } else if (myValue.length == 18) {
            var powers = new Array("7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2");
            var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
            myValue = myValue.toUpperCase();
            var _num = myValue.substr(0, 17);
            var _parityBit = myValue.substr(17);
            var _power = 0;
            for (var i = 0; i < 17; i++) {
                if (_num.charAt(i) < '0' || _num.charAt(i) > '9') {
                    return false;
                    break;
                } else {
                    _power += parseInt(_num.charAt(i)) * parseInt(powers[i]);
                }
            }

            var mod = parseInt(_power) % 11;
            if (parityBit[mod] == _parityBit) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    //联系人模块显示 其它消失
    cantactOpen: function () {
        $(window).scrollTop(0);
        this.pContent.hide();
        this.AddAndEditWarp.show("slow");
        this.editWarp.hide();
        this.cContactWarp.show("slow");
    },

    //联系人模块关闭 其它显示
    cantactClose: function () {
        $(window).scrollTop(0);
        this.pContent.show("slow");
        this.AddAndEditWarp.hide();
    },

    //编辑联系人模块显示 其它隐藏
    editOpen: function () {
        $(window).scrollTop(0);
        this.pContent.hide();
        this.AddAndEditWarp.show("slow");
        this.cContactWarp.hide();
        this.editWarp.show("slow");
    },

    //编辑联系人模块隐藏 主页面隐藏 显示联系人模块
    editClose: function () {
        $(window).scrollTop(0);
        this.pContent.hide();
        this.AddAndEditWarp.show("slow");
        this.editWarp.hide();
        this.cContactWarp.show("slow");
    },

    //类别事件绑定
    typeElement: function (ele) {
        $("a", ele).click(
            function () {
                $("a", ele).removeClass("active");
                $(this).addClass("active");
                if ($(ele).hasClass("bill_type")) {
                    $("#billHeader").hide();
                    if ($(this).html() == "公司") {
                        $("#billHeader").show();
                    }
                }
            }
        )
    },
    getType: function (ele) {
        var str = "";
        $("a", ele).each(
            function () {
                if ($(this).hasClass("active")) {
                    str = $.trim($(this).html());
                }
            }
        );
        return str;
    },
    //点击完成绑定出游人信息
    bindMail: function () {
        if (this.cacheFill) {
            var AddressId = this.cacheFill.AddressId,
                MemberId = this.cacheFill.MemberId,
                Name = this.cacheFill.Name,
                Mobile = this.cacheFill.Mobile,
                TelPhone = this.cacheFill.TelPhone,
                ProvinceId = this.cacheFill.ProvinceId,
                ProvinceName = this.cacheFill.ProvinceName,
                CityId = this.cacheFill.CityId,
                CityName = this.cacheFill.CityName,
                RegionId = this.cacheFill.RegionId,
                RegionName = this.cacheFill.RegionName,
                StreetAddress = this.cacheFill.StreetAddress,
                ZipCode = this.cacheFill.ZipCode,
                IsDefault = this.cacheFill.IsDefault,
                Products = this.cacheFill.Products,
                Ip = this.cacheFill.Ip;

            //先清除上一次记录
            this.initBook();

            //赋值选中的联系人
            this.eConsigneeInput = Name;
            this.ePhoneInput = Mobile;
            this.eaddrInput = StreetAddress;
            $("#invoiceInfo").attr("data-proId", ProvinceId);
            $("#invoiceInfo").attr("data-proName", ProvinceName);
            $("#invoiceInfo").attr("data-cityId", CityId);
            $("#invoiceInfo").attr("data-cityName", CityName);
            $("#invoiceInfo").attr("data-regionId", RegionId);
            $("#invoiceInfo").attr("data-regionName", RegionName);

            //加密显示手机号
            var encryptMobile = Mobile.substr(0, 3) + "****" + Mobile.substr(7, 4);
            var infoHtml = '<dt><span class="name">' + Name + '</span><span>' + encryptMobile + '</span></dt><dd><p>' + ProvinceName + CityName + RegionName + StreetAddress + '</p></dd>';
            $(".invoiceInfo").html(infoHtml);
            $(".invoiceInfo").removeClass("none");

            this.mail_sel_state = true;


            /*  this.eSelectPro.val(ProvinceName);
             this.eSelectCity.val(CityName);
             this.eSelectDistrict.val(RegionName);*/
        }
    },
    //获取联系人列表
    getContactList: function (type) {
        var me = this;
        //打开联系人界面
        this.cantactOpen();

        this.itemWarpUl.html('<li class="loader" style="height: 180px"></li>'); //设置loading

        var sUrl = "/scenery/json/AddEditAddress.html?opid=" + me.opid + "&unionid=" + me.unionid;

        var TYPE = "post";

        var paramData; //参数

        paramData = "addressmsg=" + this.getContactParam();

        if (type && type == "get") { //获取联系人时候
            paramData = "memberId=" + (bookInvoice.memberId ? bookInvoice.memberId : "");
            sUrl = "/scenery/json/QueryAddress.html?opid=" + me.opid + "&unionid=" + me.unionid;
        }

        //判断是新增还是编辑

        var that = this;

        $.ajax({
            url: sUrl,
            data: paramData,
            dataType: "json",
            type: TYPE,
            success: function (data) {
                if (data.state == "100") {
                    //                        that.addContactBtn.show();
                    me.editClose();
                    that.itemWarpUl.html(""); //清空容器
                    var list = data.result.AddressList;
                    var i;
                    if (list.length > 0) {
                         $('.cantact_item .backheader .back_success').show()
                        i = 0;
                        while (i < list.length) {

                            var AddressId = list[i].AddressId,
                                MemberId = list[i].MemberId,
                                Name = list[i].Name,
                                Mobile = list[i].Mobile,
                                TelPhone = list[i].TelPhone,
                                ProvinceId = list[i].ProvinceId,
                                ProvinceName = list[i].ProvinceName,
                                CityId = list[i].CityId,
                                CityName = list[i].CityName,
                                RegionId = list[i].RegionId,
                                RegionName = list[i].RegionName,
                                StreetAddress = list[i].StreetAddress,
                                ZipCode = list[i].ZipCode,
                                IsDefault = list[i].IsDefault,
                                Products = list[i].Products,
                                Ip = list[i].Ip;

                            var address = ProvinceName + CityName + RegionName + StreetAddress;
                            var oLi = $('<li></li>');
                            oLi.html('<div class="c_mon ' + (i == 0 ? 'active' : '') + '">\
                                            <div class="c_info"><h3>' + Name + '</h3><span class="c_phone">' + Mobile + '</span></div>\
                                            <p>' + address + '</p>\
                                          </div>\
                                          <span class="edit"></span>');

                            that.cacheFill = null; //先清空
                            that.cantactId = null;



                            //点选事件绑定
                            (function (i) {
                                $(".c_mon", oLi).on(
                                    "click",
                                    function () {

                                        $(".c_mon", that.itemWarpUl).removeClass("active");
                                        $(this).addClass("active");
                                        that.cacheFill = list[i]; //点击修改后赋值到 cacheFill 作缓存

                                    }
                                );

                                $(".edit", oLi).on(
                                    "click",
                                    function () {
                                        that.cacheEdit = list[i]; //点击修改后赋值到 cacheEdit 作缓存
                                        that.editOpen();
                                        that.assignmentEdit();
                                    }
                                );
                            })(i);


                            that.itemWarpUl.append(oLi);

                            i++;
                        }

                        that.cacheFill = list[0];
                    } else {
                          $('.cantact_item .backheader .back_success').hide()
                        that.itemWarpUl.html('<li style="height: 40px;line-height: 40px;text-align: center">没有常用地址，快去新增一个吧</li>'); //清空容器
                    }
                }
                  else if(data.state == "200"){
                 $('.cantact_item .backheader .back_success').hide()
               
                 }else if(data.state == "300"){
                 $('.cantact_item .backheader .back_success').hide() 
                 }
            },
            error: function () {
                that.itemWarpUl.html('<li style="height: 40px;line-height: 40px;text-align: center">请求超时</li>'); //清空容器
            }
        })

    },

    //重置编辑联系人信息框
    initEditBook: function () {
        this.tConsigneeInput.val("");
        this.tPhoneInput.val("");
        this.taddrInput.val("");
        this.tCity.bulid(0);
        $(".err_tip", this.editWarp).remove();
    },
    //初始化重置主页面信息
    initBook: function () {
        this.eConsigneeInput = "";
        this.ePhoneInput = "";
        this.eaddrInput = "";
        // this.mCity.bulid(0);
        $(".err_tip", this.mailBookWarp).remove();
    },
    assignmentEdit: function () {
        this.initEditBook(); //清空上一次塞入的数据
        var me = this;
        if (this.cacheEdit) {
            var AddressId = this.cacheEdit.AddressId,
                MemberId = this.cacheEdit.MemberId,
                Name = this.cacheEdit.Name,
                Mobile = this.cacheEdit.Mobile,
                TelPhone = this.cacheEdit.TelPhone,
                ProvinceId = this.cacheEdit.ProvinceId,
                ProvinceName = this.cacheEdit.ProvinceName,
                CityId = this.cacheEdit.CityId,
                CityName = this.cacheEdit.CityName,
                RegionId = this.cacheEdit.RegionId,
                RegionName = this.cacheEdit.RegionName,
                StreetAddress = this.cacheEdit.StreetAddress,
                ZipCode = this.cacheEdit.ZipCode,
                IsDefault = this.cacheEdit.IsDefault,
                Products = this.cacheEdit.Products,
                Ip = this.cacheEdit.Ip;

            this.tConsigneeInput.val(Name);
            this.tPhoneInput.val(Mobile);
            this.taddrInput.val(StreetAddress);

            //初始化级联菜单
            this.tCity.bulid(0);

            //赋值选中的联系人
            this.eConsigneeInput = Name;
            this.ePhoneInput = Mobile;
            this.eaddrInput = StreetAddress;

            this.tCity.SelectData({
                province: ProvinceName,
                city: CityName,
                area: RegionName
            }, function () {});
        }
    },

    //获取常用联系人参数
    getContactParam: function () {
        var param;
        var AddressId = this.cacheEdit ? this.cacheEdit.AddressId : 0,
            MemberId = this.memberId ? this.memberId : "",
            Name = encodeURIComponent(this.tConsigneeInput.val()),
            Mobile = this.tPhoneInput.val(),
            TelPhone = "",
            ProvinceId = $("option:selected", this.tSelectPro).attr("_id"),
            ProvinceName = encodeURIComponent($("option:selected", this.tSelectPro).val()),
            CityId = $("option:selected", this.tSelectCity).attr("_id"),
            CityName = encodeURIComponent($("option:selected", this.tSelectCity).val()),
            RegionId = $("option:selected", this.tSelectDistrict).attr("_id"),
            RegionName = encodeURIComponent($("option:selected", this.tSelectDistrict).val()),
            StreetAddress = encodeURIComponent(this.taddrInput.val()),
            ZipCode = "",
            IsDefault = 0,
            Products = "",
            Ip = "";

        param = '{' +
            '"AddressId": ' + AddressId + ',' +
            //            '"MemberId": '+'"'+ MemberId +'"'+',' +
            '"MemberId":"" ,' +
            '"Name": ' + '"' + Name + '"' + ',' +
            '"Mobile": ' + Mobile + ',' +
            '"TelPhone": "",' +
            '"ProvinceId": ' + ProvinceId + ',' +
            '"ProvinceName": ' + '"' + ProvinceName + '"' + ',' +
            '"CityId": ' + CityId + ',' +
            '"CityName": ' + '"' + CityName + '"' + ',' +
            '"RegionId": ' + RegionId + ',' +
            '"RegionName": ' + '"' + RegionName + '"' + ',' +
            '"StreetAddress": ' + '"' + StreetAddress + '"' + ',' +
            '"ZipCode": "",' +
            '"IsDefault": 0,' +
            '"Products": "",' +
            '"Ip": ""' +
            '}';

        return param;
    },
    //获取申请发票参数
    getMailParam: function () {
        var param;
        var fpTypeHead = this.eFpHeaderInput.val(),
            fpCode = this.need_code ? this.eCodeInput.val() : "",
            fpType = this.need_code ? 2 : 1,
            ytType = this.getType(this.useTypeWarp) == "无" ? 0 : 0, //0.3始终传无
            MemberId = this.memberId ? this.memberId : "",
            Name = encodeURIComponent(this.eConsigneeInput),
            Mobile = this.ePhoneInput,
            TelPhone = "",
            ProvinceId = $("#invoiceInfo").attr("data-proId"),
            ProvinceName = encodeURIComponent($("#invoiceInfo").attr("data-proName")),
            CityId = $("#invoiceInfo").attr("data-cityId"),
            CityName = encodeURIComponent($("#invoiceInfo").attr("data-cityName")),
            RegionId = $("#invoiceInfo").attr("data-regionId"),
            RegionName = encodeURIComponent($("#invoiceInfo").attr("data-regionName")),
            StreetAddress = encodeURIComponent(this.eaddrInput),
            price = $(".bill_price").html().replace("¥", "");


        param = '{' +
            '"SerialId": "' + this.serialId + '",' +
            '"creditCode": "' + fpCode + '",' +
            //            '"MemberId": '+ MemberId +',' +
            '"Phone": ' + '"' + Mobile + '"' + ',' +
            '"Recipient": ' + '"' + Name + '"' + ',' +
            '"InvoiceHead": ' + '"' + fpTypeHead + '"' + ',' +
            '"InvoiceService": 1,' +
            '"OrderAmount": ' + '"' + price + '"' + ',' + //jiage
            '"SpecialRemark": ' + ytType + ',' + // 0 1 yongtu
            '"InvoiceType": ' + fpType + ',' + //1 2 taitou
            '"ProvinceId": ' + ProvinceId + ',' +
            '"ProvinceName": ' + '"' + ProvinceName + '"' + ',' +
            '"CityId": ' + CityId + ',' +
            '"CityName": ' + '"' + CityName + '"' + ',' +
            '"RegionId": ' + RegionId + ',' +
            '"RegionName": ' + '"' + RegionName + '"' + ',' +
            '"StreetAddress": ' + '"' + StreetAddress + '"' + ',' +
            '"ReceiveEmail": ' + '"' + this.emailAddress + '"' + ',' +
            '"InvoiceCategory": ' + '"' + this.invoice_type + '"' +
            '}';

        return param;
    },
    showTip: function (txt) {
        if ($("#bgDiv").html() == null) {
            $('<div id="bgDiv"></div>').appendTo("body");
        }

        if ($("#showMsg").html() != null) {
            $("#showMsg").remove();
        }
        $('<div id="showMsg"><div class="msg-title">温馨提示</div><div class="msg-content">' + txt + '</div><div class="msg-btn"><a class="s_btn" href="javascript:;">知道了</a></div></div>').appendTo("body");

        var wh = $(window).height();
        var sh = $(window).scrollTop();
        $("#bgDiv").css({
            "height": $(document).height()
        }).show("slow");
        $("#bgDiv").css({
            "opacity": "0.6"
        });
        $("#showMsg").show("slow");
        $("#showMsg .s_btn").click(function () {
            bookInvoice.hideTip()
        });

        $("#bgDiv").click(
            function () {
                bookInvoice.hideTip()
            }
        );
        //重新计算位置
        var lowh = $("#showMsg").height();

        $("#showMsg").css({
            "top": (wh - lowh) / 2
        })
    },
    hideTip: function () {
        $("#showMsg").hide();
        $("#bgDiv").animate({
            "opacity": "0"
        }, function () {
            $("#bgDiv").hide();
        });
    },
    //获取OrderId，SerialId
    getParamId: function () {
        var ha = window.location.search;
        this.serialId = bookInvoice.findParam(ha, "serialid");
    },
    findParam: function (str, key) {
        var str = str.replace("?", "");
        var strArr = str.split("&");
        for (var n = 0; n < strArr.length; n++) {
            if (strArr[n].substring(0, key.length + 1) == (key + '=')) {
                return strArr[n].substring(key.length + 1);
            }
        }
        return "";
    },
    //验证弹框
    errorDialog: function (txt) {
        showErrDialog.content(txt);
        showErrDialog.open();
    }
};

$(function () {
    bookInvoice.init();
});

var showErrDialog = $.dialog({
    style: 'tip',
    width: 230,
    closeTime: 1000,
    maskClick: function () {
        //        showErrDialog.close();
    },
    content: null
});

