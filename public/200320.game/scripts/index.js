//url截参数
var getQueryString = window.utils.getQueryString

// 缓存
var Activity = {
    getLocalData: function () {
        var localDataStr = sessionStorage.getItem("localData_sqdc") || "{}",
            localData = JSON.parse(localDataStr);
        return localData;
    },
    initSaveEvent: function () {
        window.onunload = function () {
            var _localData = $.extend(Activity.localData, {
                onProvId: app.onProvId,
                onProvName: app.onProvName,
                locationName: app.locationName,
            });
            sessionStorage.setItem("localData_sqdc", JSON.stringify(_localData));
        };
    }
};
Activity.initSaveEvent();
Activity.localData = Activity.getLocalData();
var localData = Activity.localData;
var AppInfo = {
    isAPP: null, // 是否客户端打开
    cityID: null // 城市ID
};

var __topimg = '//img1.40017.cn/cn/s/2020/zt/touch/200320/ranking-topimg.png'
var __tableimg = '//img1.40017.cn/cn/s/2020/zt/touch/200320/ranking-table.png'
var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: getQueryString('isxcx') ? true : false,
        // userid=37421349&nickName=seYao_O&level=1
        // memberId: '37421349',
        memberId: '',
        wxopenid: '',
        wxunionid: '',
        nickname: '',
        avatarurl: 'https://img1.40017.cn/cn/s/2020/zt/touch/200320/default.png',
        addHtml: '',
        refid: '',
        spm: '5.44764.44764.1',
        zId: '44764', // 专题ID
        cId: '44050', // 省市ID
        provAjaxList: '',
        loading: false,
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',

        // 游戏
        showTiming: false,
        timingUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-3.png',
        score: 0,
        timingInterval: null,
        timingCount: 3,

        // 得分
        showScore: false,

        // 邮寄信息
        showMail: false,
        mailName: '',
        mailPhone: '',
        mailCaptcha: '',
        mailAddress: '',






    },
    created: function () {
        this.init();
    },
    mounted: function () {
        // this.scroll();
    },
    methods: {
        init: function () {
            var that = this
            var AppNewSpm = getQueryString('tcwebtag')
            allInit = {
                doRefid: function (dataAndRefid) {
                    // console.log(3)
                    //Hellow world~   所有的一切从这里开始
                    newRefid = dataAndRefid[0]
                    newSpm = dataAndRefid[1]
                    if (AppInfo.isAPP) {
                        that.addHtml = AppNewSpm ?
                            '|' + AppNewSpm + '&refid=' + newRefid :
                            '&refid=' + newRefid
                    } else {
                        that.addHtml =
                            newSpm.indexOf('|') > 0 ?
                                '|' + newSpm.split('|')[0] + '&refid=' + newRefid :
                                '&refid=' + newRefid
                    }
                    that.getPara(newSpm, newRefid)
                },
                init: function (id) {
                    // console.log(2)
                    setRefId({
                        isAjaxGetRef: true, //是否需要异步获取refid【默认false】
                        ChannelID: id, //频道ID【isAjaxGetRef为true时必传】
                        isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
                        uTagName: '.app a', //需要自动添加refid的类名【可不传，默认所有a】
                        tagValue: 'href' //需要自动添加refid的元素属性【可不传，默认a标签的href】
                    })
                }
            }
            window.utils.TongChengInfo(function (data) {
                // console.log(1)
                AppInfo.isAPP = data.isTc
                AppInfo.cityID = data.cid
                if (AppInfo.isAPP) {
                    that.isTc = true;
                    if (data.memberId) {
                        that.memberId = data.memberId
                        that.wxunionid = data.unionId
                        that.nickname = data.userName
                        that.avatarurl = data.headImg
                    }
                } else {
                    if ($.cookie('us')) {
                        var uMemberIDRight = $.cookie('us').split('=')[1]
                        var uId = uMemberIDRight.split('&')[0]
                        that.memberId = uId ? uId : ''
                    }
                }
                allInit.init(that.zId);
            });
        },
        // 获取链接参数
        getPara: function (spm, refid) {
            this.refid = getQueryString('refid') ? getQueryString('refid') : refid
            this.spm = getQueryString('spm') ? getQueryString('spm') : this.spm

            if (this.isxcx) {
                this.setShare();
            }
            if (getQueryString("wxparam")) {
                var URLArgues = JSON.parse(
                    decodeURIComponent(getQueryString("wxparam"))
                );
                this.wxopenid = URLArgues.openid;
                this.wxunionid = URLArgues.unionid;
                this.nickname = URLArgues.nickname;
                this.avatarurl = URLArgues.headimgurl;
                // console.log(URLArgues)
            }


            // this.checkLogin()
            this.initData();
        },

        //小程序分享
        setShare: function () {
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/tiyanguanqdh/?isxcx=1&spm=" + spm + "&refid=" + refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "春天终会如约而至，我在千岛湖（每个景区不一样）等你！",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2020/zt/touch/200320/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },
        // 判断是否需要登陆
        checkLogin: function () {
            if (this.isWx) {
                if (this.wxopenid && this.wxunionid) {
                    this.initData();
                } else {
                    //走套头
                    var url = encodeURIComponent("https://www.ly.com/scenery/zhuanti/2019shuangshiyi?isxcx=1&spm=" + this.spm + "&refid=" + this.refid);
                    var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
                    window.location.href = path;
                }
            } else {
                if (this.memberId) {
                    this.initData();
                } else {
                    // 登录
                    if (AppInfo.isAPP) {
                        window.location.href = "tctclient://web/loginrefresh";
                    } else {
                        window.location.href = '//passport.ly.com/m/login.html?returnUrl=' + encodeURIComponent(window.location.href)
                    }
                }
            }

        },
        timingFn: function () {
            var that = this, count = 3;
            this.showTiming = true
            this.timingCount = count
            this.timingUrl = 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-3.png'
            this.timingInterval = setInterval(function () {
                count -= 1;
                that.timingCount = count

                if (count === 0) {
                    that.showTiming = false
                    that.gameStart()
                    clearInterval(that.timingInterval);
                } else {
                    that.timingUrl = 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-' + count + '.png'
                }
            }, 1000);
        },
        // 游戏开始
        gameStart: function () {
            // debugger
            Start()
        },

        //数据初始化
        initData: function () {
            // this.gameStart()
        },
        // 公共异步
        publicAjax: function (mdId, index, onProvId, callBackFn, pageIndex, pageSize) {
            var that = this
            if (pageIndex) {
                that.pageIndex = pageIndex
                that.pageSize = pageSize
            } else {
                that.pageIndex = 1
                that.pageSize = 20
            }
            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/ZhuanTiJsp.aspx',
                data: 'action=GETSPMSCENERYJSP&PageIndex=' +
                    that.pageIndex +
                    '&PageSize=' +
                    that.pageSize +
                    '&px=5&ChannelID=' +
                    mdId +
                    '&ProvinceId=' +
                    onProvId,
                dataType: 'json',
                success: function (data) {
                    if (data && data.List && data.List.length > 0) {
                        callBackFn && callBackFn(data)
                    } else {
                        that['sectionData' + index] = '';
                    }
                },
                complete: function () { }
            })
        },
        // 资源异步
        allAjax: function (id, index, onProvId, pageIndex, pageSize, fn) {
            var that = this;
            that.publicAjax(
                id,
                index,
                onProvId,
                function (data) {
                    switch (index) {
                        case 1:
                            var list = data.List;
                            that['sectionData' + index] = list;
                            if (list && list.length) {
                                that.sceneryInfo = {
                                    ...list[0],
                                    imgUrl: list[0].SceneryImg,
                                    imgUrl2: list[0].SceneryImg,
                                    imgUrl3: list[0].SceneryImg,
                                    videoUrl: 'https:' + list[0].Qurl,
                                    videoImg: '//pic5.40017.cn/03/000/3e/6c/rBANB1235IKAVc3EAALebsKLYpo089.jpg',
                                }
                            }
                            break;
                        default:
                            that['sectionData' + index] = data.List;
                            break;
                    }

                },
                pageIndex,
                pageSize
            )
        },

        // 验证
        validateFn() {
            var reqTime = new Date().getTime()
            var sign = 'unionid=' + this.wxunionid + '&memberid=' + this.memberId + '&reqtime=' + reqTime + '&nickname=' + this.nickname + '&score=' + this.score + '&avatar=' + encodeURIComponent(this.avatarurl)
            var data = {
                ReqTime: reqTime,
                Sign: window.utils.md5(sign),
                GameName: '全民抗疫',
                MemberId: this.memberId,
                UnionId: this.wxunionid,
                CustomerName: window.utils.trim(this.mailName),
                Mobile: this.mailPhone,
                Address: this.mailAddress,
            }
            // console.log(data)

            if (!window.utils.trim(this.mailName)) {
                this.popFn('请输入姓名')
                return { state: false }
            }
            if (!this.mailPhone) {
                this.popFn('请输入手机号')
                return { state: false }
            }
            if (!this.mailAddress) {
                this.popFn('请填写邮寄地址')
                return { state: false }
            }

            if (!window.utils.validate.mobile(this.mailPhone)) {
                this.popFn('手机号填写错误')
                return { state: false }
            }


            return {
                state: true,
                data
            }
        },

        changeInput(e) {
            const { value } = e.target;
            const { param } = e.currentTarget.dataset;
            // this.setData({ [param]: value });
            this[param] = value
        },
        inputFocus() {
            this.isBlur = false;
        },
        inputBlur() {
            this.isBlur = true;
        },
        mailSubmit() {
            var result = this.validateFn()
            console.log(result)
            if (!result.state) return
        },
        //蒙层
        popFn: function (txt) {
            $(".showErr").html(txt);
            $(".showErrBox").show();
            setTimeout(function () {
                $(".showErr").html("");
                $(".showErrBox").hide();
            }, 2000);
        },

    }
})
