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

var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: getQueryString('isxcx') ? true : false,
        // userid=37421349&nickName=seYao_O&level=1
        // memberId: '37421349',
        // memberId: '',
        wxopenid: '',
        wxunionid: '',
        nickname: '',
        avatarurl: 'https://img1.40017.cn/cn/s/2020/zt/touch/200320/default.png',
        addHtml: '',
        refid: '',
        spm: '5.46104.46128.1', // 5.44764.44764.1
        zId: '44764', // 专题ID 44764
        cId: '', // 省市ID 44050
        provAjaxList: '',
        loading: false,
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',

        // 页面数据
        topImagUrl: window.__configs.topImagUrl, // 头图
        redpackage: window.__configs.redpackage,
        redlist: window.__configs.redlist, // 红包配置信息
        sectionData1: [],
        sectionData2: [],
        showFailure: false,
        showSuccess: false,
        dialogInfo: null,
        selectIdx: 0,
    },
    created: function () {
        this.init();
    },
    mounted: function () {
        // this.scroll();
    },
    methods: {
        // 图片裁剪
        setImageSize: window.utils.setImageSize,
        // 跳转页面
        windowLocationHref: window.utils.windowLocationHref,
        // 判断之前有没有领过红包
        isGetHB: window.utils.isGetRedpackage,
        // 领取红包
        getHB: window.utils.getRedpackage,
        // 验证卡券是否领取
        hasGetCard: window.utils.hasGetWechatcard,
        // 领取卡券
        getCard: window.utils.getWechatcard,

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

                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId && !that.isxcx) {
                    that.isGetHB()
                }
            });
        },
        // 获取链接参数
        getPara: function (spm, refid) {
            this.refid = getQueryString('refid') ? getQueryString('refid') : refid
            this.spm = getQueryString('spm') ? getQueryString('spm') : this.spm

            if (this.isxcx) { // 小程序分享
                window.utils.setMiniappShare({ spm: this.spm, refid: this.refid })
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

            if (this.isWx) {
                this.hasGetCard(); // 小程序券
            }


            // 判断是否需要登陆
            // window.utils.checkLogin(this)
            this.initData();


        },

        //数据初始化
        initData: function () {
            // 约惠春天景点门票(46128)
            this.allAjax('46128', 2, '', 1, 100);
        },

        // 资源异步
        allAjax: function (mdId, index, onProvId, pageIndex, pageSize) {
            var that = this;
            var opts = {
                pageIndex,
                pageSize,
                mdId,
                onProvId,
            }
            window.__services.publicAjax(opts, function (data) {
                if (!data) return that['sectionData' + index] = '';

                switch (index) {
                    // case 2:
                    //     var list2 = data.List;
                    //     that.videoUrl = 'https:' + list2[0].Purl;
                    //     that.videoImg = list2[0].SceneryImg;
                    //     that['sectionData' + index] = list2;
                    //     if (list2.length > 1) {
                    //         setTimeout(function () {
                    //             that.getSwiper(2);
                    //         }, 300)
                    //     }
                    //     break;
                    // case 3:
                    //     var list3 = data.List;
                    //     that['sectionData' + index] = list3;
                    //     if (list3.length > 1) {
                    //         that.$nextTick(function () {
                    //             that.getSwiper(3);
                    //         })
                    //     }
                    //     break;
                    default:
                        that['sectionData' + index] = data.List;
                        break;
                }

            })
        },

        // 判断是否需要登陆
        checkLogin: function (idx) {
            var that = this
            this.showFailure = false;
            this.showSuccess = false;
            window.utils.checkLogin(this, function (isWx) {
                if (isWx) {
                    that.getCard(idx)
                } else {
                    that.getHB(idx)
                }
            })
        },

    }
})
