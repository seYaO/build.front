//url截参数
var getQueryString = window.utils.getQueryString
// 倒计时
var timeObject = new window.utils.countDown();

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
        gameName: window.utils.__gameName__, // 游戏名称
        type: '', // 当前状态

        // 游戏
        seconds: 30, // 倒计时
        showTiming: false,
        timingUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-3.png',
        score: 10,
        timingInterval: null,
        timingCount: 3,
        showMusic: false, // 显示music
        isPlay: false, // 是否播放
        myAudioUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/music.mp3',
        audio: '',

        // 得分
        scoreBgUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-rank1.png?v=2',
        showScore: false,
        rankList: null,
        meInfo: null,

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
            this.type = getQueryString('type') ? getQueryString('type') : ''

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


            this.checkLogin()
            // this.initData();
        },

        //小程序分享
        setShare: function () {
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/2020antiviral/?isxcx=1&spm=" + spm + "&refid=" + refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "5A仙都景区特惠来袭，玩游戏赢豪礼！",
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
                    var url = encodeURIComponent("https://www.ly.com/scenery/zhuanti/2020antiviral?isxcx=1&spm=" + this.spm + "&refid=" + this.refid);
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
                        this.initData()
                        // window.location.href = '//passport.ly.com/m/login.html?returnUrl=' + encodeURIComponent(window.location.href)
                    }
                }
            }

        },
        // 倒计时开始游戏
        timingFn: function () {
            // this.gameSubmit()
            // return

            var that = this, count = 3;
            this.showTiming = true
            this.timingCount = count
            this.timingUrl = 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-3.png'
            this.timingInterval = setInterval(function () {
                count -= 1;
                that.timingCount = count

                if (count === 0) {
                    that.showTiming = false
                    that.gameMusic(true)
                    that.gameStart()
                    that.countDownFn()
                    clearInterval(that.timingInterval);
                } else {
                    that.timingUrl = 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-' + count + '.png'
                }
            }, 1000);
        },
        // 游戏结束倒计时
        countDownFn: function () {
            var that = this;
            timeObject.seconds = that.seconds; // 30秒
            timeObject.runFun = function (e) {
                that.seconds = e
                timer = e
            }
            timeObject.backFun = function (e) {
                that.seconds = '0'
                that.score = score
                timer = 0
                console.log('结束')
                that.gameMusic(false)
                that.gameSubmit()
            }
            timeObject.mainFun();

        },
        // 游戏开始
        gameStart: function () {
            $(".canvasBox").show();
            this.showMusic = true
            Start()
        },
        // 再来一次
        gameAgainFn: function () {
            this.showScore = false;
            this.seconds = 30

            this.timingFn()
        },
        // 排行榜
        gameRankFn: function () { },
        // 填写领奖信息
        gameMailFn: function () {
            this.showScore = false;
            this.showMail = true;
            $(".canvasBox").hide();
            this.showMusic = false
            this.seconds = 30
        },

        //数据初始化
        initData: function () {
            // this.gameStart()
            if (this.type == 'mail') {
                this.showMail = true
            }
            this.audio = this.$refs.audio;
            this.audio.load();
            this.audio.pause();
            this.gameTopListFn()
        },

        // 说明地址
        rulesLink: function () {
            var url = "https://www.ly.com/scenery/zhuanti/2020antiviralrules?spm=" + this.spm + "&refid=" + this.refid
            if (this.isWx) {
                if (this.isxcx) {
                    url = url + "&isxcx=1";
                }
                // window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            } else {
                // window.location.href = url
            }
            window.location.href = url
        },
        // 排行榜地址
        rankLink: function () {
            var url = "https://www.ly.com/scenery/zhuanti/2020antiviralrank?spm=" + this.spm + "&refid=" + this.refid
            if (this.isWx) {
                if (this.isxcx) {
                    url = url + "&isxcx=1";
                }
                window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            } else {
                window.location.href = url
            }
        },
        gameMusic: function (flag) {
            // if (this.isPlay == flag) return
            if (flag == !this.audio.paused) return

            if (this.audio.paused) { // 开始播放当前点击的音频
                this.isPlay = false
                this.audio.play();
            } else {
                this.isPlay = true
                this.audio.pause();
            }

        },

        /**
         * ------------------------------------
         * ------------------------------------
         * ------------------------------------
         * ------------------------------------
         * ------------------------------------
         */
        // 小游戏排行榜信息
        gameTopInfoFn() {
            var reqTime = new Date().getTime()
            var sign = 'unionid=' + this.wxunionid + '&memberid=' + this.memberId + '&reqtime=' + reqTime + '&gamename=' + this.gameName
            var data = {
                clientType: AppInfo.isAPP ? 7 : 1,
                ReqTime: reqTime,
                Sign: window.utils.md5(sign),
                GameName: this.gameName,
                TopCount: 8,
                MemberId: this.memberId,
                UnionId: this.wxunionid
            }

            return data
        },
        // 小游戏结果信息
        gameResultInfoFn() {
            var reqTime = new Date().getTime()
            var sign = 'unionid=' + this.wxunionid + '&memberid=' + this.memberId + '&reqtime=' + reqTime + '&nickname=' + this.nickname + '&score=' + this.score + '&avatar=' + encodeURIComponent(this.avatarurl)
            var data = {
                clientType: AppInfo.isAPP ? 7 : 1,
                GameName: this.gameName,
                ReqTime: reqTime,
                Sign: window.utils.md5(sign),
                UnionId: this.wxunionid,
                MemberId: this.memberId,
                Nickname: this.nickname || '玩家用户',
                Avatar: encodeURIComponent(this.avatarurl),
                Score: this.score
            }
            if (this.meInfo) {
                if (this.meInfo.Score >= this.score) {
                    return { state: false }
                }
            }

            return { state: true, data }
        },
        // 小游戏排行榜list
        gameTopListFn(submit) {
            var that = this
            var result = this.gameTopInfoFn()

            window.__services.QueryMiniGameTopList(result, function (data) {
                console.log('小游戏排行榜查询', data)
                if (data.StateCode == 200 && data.Body) {
                    that.rankList = data.Body.ResultList
                    that.meInfo = data.Body.OwnResult
                    if (submit) { // 提交分数显示弹框结果
                        that.showScore = true
                    }
                }
            })
        },
        // 小游戏结果保存
        gameSubmit() {
            var that = this
            var result = this.gameResultInfoFn()
            if (!result.state) {
                that.showScore = true
                return
            }

            window.__services.PushMiniGameResult(result.data, function (data) {
                console.log('小游戏结果保存', data)
                if (data.StateCode == 200 && data.Body) {
                    if (that.meInfo) {
                        that.gameTopListFn(true)
                    } else {
                        that.gameTopListFn()
                        that.showScore = true
                    }
                }
            })
        },

        // 邮寄信息验证
        validateFn() {
            var reqTime = new Date().getTime()
            var sign = 'unionid=' + this.wxunionid + '&memberid=' + this.memberId + '&reqtime=' + reqTime + '&customername=' + window.utils.trim(this.mailName) + '&mobile=' + this.mailPhone + '&address=' + this.mailAddress
            var data = {
                clientType: AppInfo.isAPP ? 7 : 1,
                ReqTime: reqTime,
                Sign: window.utils.md5(sign),
                GameName: this.gameName,
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
        // 邮寄信息填写
        changeInput(e) {
            const { value } = e.target;
            const { param } = e.currentTarget.dataset;
            // this.setData({ [param]: value });
            this[param] = value
        },
        inputFocus() {
            // this.isBlur = false;
        },
        inputBlur() {
            // this.isBlur = true;
        },
        // 邮寄信息提交
        mailSubmit() {
            var that = this
            var result = this.validateFn()
            // console.log(result)
            if (!result.state) return

            window.__services.SaveMiniGamePostInfo(result.data, function (data) {
                console.log('小游戏更新邮寄信息', data)
                that.showMail = false
                that.mailName = ''
                that.mailPhone = ''
                that.mailAddress = ''
                that.popFn('信息更新成功')
            })
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
