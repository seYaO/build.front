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
        sceneryInfo: null,
        topImg: __topimg,
        tableImag: __tableimg,
        rankList: null,
        meInfo: null,
        gameName: '全民抗疫', // 游戏名称
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
            }
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
                        title: "5A仙都景区特惠来袭，玩游戏赢豪礼！",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2020/zt/touch/200320/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },
        //数据初始化
        initData: function () {
            this.gameTopListFn()
        },
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
        // 小游戏排行榜list
        gameTopListFn() {
            var that = this
            var result = this.gameTopInfoFn()

            window.__services.QueryMiniGameTopList(result, function (data) {
                console.log('小游戏排行榜查询', data)
                if (data.StateCode == 200 && data.Body) {
                    that.rankList = data.Body.ResultList
                    that.meInfo = data.Body.OwnResult
                }
            })
        },
        // 跳转地址到邮寄信息
        mailLink: function () {
            var url = "https://www.ly.com/scenery/zhuanti/2020antiviral?type=mail&spm=" + this.spm + "&refid=" + this.refid
            if (this.isWx) {
                if (this.isxcx) {
                    url = url + "&isxcx=1";
                }
                window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            } else {
                window.location.href = url
            }
        }

    }
})
