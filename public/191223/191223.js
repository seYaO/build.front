//抢购
var timeObj = function () {
    this.myTimer = null; // 内部参数，无需传值
    this.nowTime = null; // 开始时间，可以为空，获取本机时间
    this.overTime = null; // 抢购结束时间
    this.beforeTime = null; // 抢购开始时间 非必填
    this.runFun = function () { }; // 倒计时主函数
    this.beforFun = function () { }; // 抢购开始回调函数
    this.backFun = function () { }; // 抢购结束回调函数
    this.timeGo = 0; /*保存倒计时从开始到结束，一共执行了多少秒*/
    this.close = false;
}
timeObj.prototype = {
    formatNum: function (num) {
        num = num < 10 ? "0" + num : num;
        return num;
    },
    getDayLength: function (starTime, endTime) {
        var startDate = starTime ? new Date(starTime) : (this.nowTime ? new Date(this.nowTime) : new Date());
        var endDate = endTime ? new Date(endTime) : new Date(this.overTime);
        return endDate.getTime() - startDate.getTime();
    },
    getDayNum: function (newTime) {
        var timeLength = typeof (newTime) != 'undefined' ? newTime : this.getDayLength();
        var dayNum = Math.floor(timeLength / 1000 / 60 / 60 / 24);
        var hourNum = Math.floor(timeLength / 1000 / 60 / 60 % 24);
        var mintNum = Math.floor(timeLength / 1000 / 60 % 60);
        var secdNum = Math.floor(timeLength / 1000 % 60);
        return [this.formatNum(dayNum), this.formatNum(hourNum), this.formatNum(mintNum), this.formatNum(secdNum)];
    },
    closeFun: function () {
        clearTimeout(this.myTimer);
        this.myTimer = null;
    },
    mainFun: function () {
        var timeNums = this.getDayLength(); //抢购结束时间 - 当前时间
        var beginNums = this.getDayLength(this.beforeTime); //抢购结束时间 - 抢购开始时间
        var nowNums = this.getDayLength(this.nowTime, this.beforeTime); //抢购开始时间 - 当前时间

        var that = this;
        if (that.myTimer) {
            clearTimeout(that.myTimer);
            that.myTimer = null;
        }

        (function () {
            that.timeGo += 1000;
            //当前已结束
            if (timeNums <= 0) {
                clearTimeout(that.myTimer);
                that.myTimer = null;
                that.backFun(that.getDayNum(timeNums));
            } else {
                //正在抢购中
                if (timeNums <= beginNums) {
                    that.runFun(that.getDayNum(timeNums));
                    timeNums -= 1000;
                }
                //抢购前
                else {
                    //that.beforFun(that.getDayNum(beginNums));
                    that.beforFun(that.getDayNum(nowNums));
                    timeNums -= 1000;
                    nowNums -= 1000;

                    //抢购前的倒计时中，再倒计时：
                    if (nowNums < 0) {
                        that.runFun(that.getDayNum(timeNums));
                        timeNums -= 1000;
                    }
                }
                that.myTimer = setTimeout(arguments.callee, 1000);
            }
        })();
    }
};
var timeObject = new timeObj;
// 读取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        //先查询cookie是否为空，为空就return ""
        c_start = document.cookie.indexOf(c_name + "="); //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1; //最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            c_end = document.cookie.indexOf(";", c_start); //其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end)); //通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return "";
}
// 设置cookie
function setCookie(name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
        name +
        "=" +
        escape(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

//url截参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

// 拷贝
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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

var __topimg = '//img1.40017.cn/cn/s/2019/zt/touch/191223/top.jpg'
var __redlist = [
    { "type": "", "red": 3, "total": "满99元可用", "isGet": false, "id": 44045, "pcId": "DD005047A5", "cardId": "pOCyauAWoiRcIHjSj5O4PGdQ3aSA" },
    { "type": "", "red": 5, "total": "满159元可用", "isGet": false, "id": 44046, "pcId": "ED4BADBE83", "cardId": "pOCyauPrye9SEgSNrwwSEqU7Tdi8" },
    { "type": "", "red": 10, "total": "满259元可用", "isGet": false, "id": 44047, "pcId": "36EB5A75C0", "cardId": "pOCyauJqNJl5PHG_yM6kTHnynbg8" }
]
var timearr = [
    { begindate: '2019/12/12 12:12:00', enddate: '2019/12/12 23:59:59', date: '12月12日', time: '10:00', state: 0, },
    { begindate: '2019/12/19 12:12:00', enddate: '2019/12/19 23:59:59', date: '12月19日', time: '14:00', state: 0, },
    { begindate: '2019/12/26 12:12:00', enddate: '2019/12/26 23:59:59', date: '12月26日', time: '18:00', state: 0, },
    { begindate: '2020/01/02 12:12:00', enddate: '2020/01/02 23:59:59', date: '1月2日', time: '18:00', state: 0, },
]
var newBKlist = [
    { cityName: '门票', list: [] },
    { cityName: '线路', list: [] }
]
var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: false,
        // userid=37421349&nickName=seYao_O&level=1
        // memberId: '37421349',
        memberId: '',
        wxopenid: '',
        wxunionid: '',
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
        navIndex: 0,
        navData: [
            { txt: "砍价1元", },
            { txt: "超值抢购", },
            { txt: "爆款推荐", },
            { txt: "游玩攻略", },
        ],
        Ih5: __topimg,
        Ixcx: __topimg,
        R3: { "type": "", "red": 3, "total": "满99元可用", "isGet": false, "id": 44045, "pcId": "", "cardId": "" },
        R5: { "type": "", "red": 5, "total": "满159元可用", "isGet": false, "id": 44046, "pcId": "", "cardId": "" },
        R10: { "type": "", "red": 10, "total": "满259元可用", "isGet": false, "id": 44047, "pcId": "", "cardId": "" },

        redlist: __redlist,
        showProvList: false,
        sectionData1: [],
        sectionData2: [],
        sectionData3: [],
        sectionData4: [],
        sectionData5: [],
        sectionData6: [],
        sectionData7: [],
        showMore: true,
        bkTabIndex: 0,
        bcTabIndex: 0,
        newBKlist: newBKlist,
        newBClist: [],
        clyIdList: [],
        timeStart: '2019/11/18',
        timeEnd: '2020/2/1',
        timeObj: ['即将开抢', '正在疯抢', '已结束'],
        timearr,
        showindex: 0,
        days: '00', //抢购时间点
        hours: '00',
        minutes: '00',
        seconds: '00',
        cdTXT: '距抢购开始剩',
        showQGmodule: false,
        ObjId: '', // 活动id
        pcId: 'AP_AC3FUUPPCDF',
        cardId: '',
        needFirendHelp: 8, // 需几个好友助力
        helpPeopleCount: 0,
        helpGet: false,// 是否领取
        helpList: [],
        leadShare: false, // 是否展示引导分享
        showRule: false,
        showGift: false,
        giftTxt: ''
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
            TongChengInfo(function (data) {
                // console.log(1)
                AppInfo.isAPP = data.isTc
                AppInfo.cityID = data.cid
                if (AppInfo.isAPP) {
                    that.isTc = true;
                    memberId = data.memberId
                    if (memberId) {
                        that.memberId = memberId
                    }
                } else {
                    if ($.cookie('us')) {
                        var uMemberIDRight = $.cookie('us').split('=')[1]
                        var uId = uMemberIDRight.split('&')[0]
                        that.memberId = uId ? uId : ''
                    }
                    that.getWechat()
                }
                allInit.init(that.zId);
                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId && !that.isxcx) {
                    // that.isGetHB()
                }
            });
        },
        getWechat: function () {
            var that = this
            // 小程序模拟器用
            if (getQueryString('isxcx')) {
                that.isxcx = true
            }
        },
        // 获取链接参数
        getPara: function (spm, refid) {
            this.refid = getQueryString('refid') ? getQueryString('refid') : refid
            this.spm = getQueryString('spm') ? getQueryString('spm') : this.spm
            var wxparam = getQueryString('wxparam') ? decodeURIComponent(getQueryString("wxparam")) : ''
            // 定位
            this.loactionFn();
            this.linkListFixed();
            // this.getTimeFn();
            // if (wxparam) {
            //     var URLArgues = JSON.parse(wxparam);
            //     if (!URLArgues) {
            //         // 微信头链接跳转
            //         var link = encodeURIComponent('https://www.ly.com/scenery/zhuanti/ningxiath');
            //         var shareLink = 'https://wx.17u.cn/wl/api/redirect?redirect_uri=' + link;
            //         window.location.href = shareLink;
            //     } else {
            //         this.wxopenid = URLArgues.openid;
            //         this.wxunionid = URLArgues.unionid;
            //     }

            // }
            if (this.isxcx) {
                // this.hasGetCard(); // 小程序券
                this.setShare();
            }
        },
        //省份定位
        loactionFn: function () {
            var that = this
            if (that.isTc) {
                // 客户端获取省份
                var cityId = AppInfo.cityID || '';
                $.ajax({
                    url: "/scenery/AjaxHelper/AjaxCall.aspx",
                    data: "action=GetProAndCity&cityId=" + cityId,
                    dataType: "json",
                    success: function (data) {
                        that.onProvId = data.proId;
                        that.onProvName = data.proName;
                        that.provListFn();
                    },
                    error: function (e) {
                        /*报错显示列表第一个省*/
                        that.provListFn();
                    }
                });
            } else {
                // 非客户端获取省份
                $.location({
                    useLocal: true,
                    time: 600000,
                    fn: function (location) {
                        if (location.provinceId) {
                            // alert(location.province)
                            that.onProvId = location.provinceId
                            that.onProvName = location.province ? location.province.replace(/省/g, '') : location.province
                        } else {
                            // js定位不到时,默认显示江苏
                            that.onProvId = 16
                            that.onProvName = '江苏'
                        }
                        that.provListFn()
                    }
                })
            }
        },
        //置顶
        linkListFixed: function () {
            var that = this;
            var fixBoxTop = $('.show-fix-box').offset().top
            $(window).on('scroll', function () {
                var windowH = document.documentElement.scrollTop || document.body.scrollTop;

                if (windowH < fixBoxTop) {
                    $('.show-fix-box').removeClass('fixed_tab')
                } else {
                    $('.show-fix-box').addClass('fixed_tab')
                }
            })
        },
        //省份列表调取
        provListFn: function () {
            var that = this
            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/ZhuanTiJsp.aspx',
                data: 'action=GETSPMSCENERYJSP&PageIndex=1&PageSize=100&px=5&cp=1&ChannelID=' + that.cId,
                dataType: 'json',
                success: function (data) {
                    if (data && data.ProvinceList && data.ProvinceList.length > 0) {
                        that.provAjaxList = data.ProvinceList;

                        // 如果列表中没有定位到的省份
                        var hasProvLocal = false;
                        for (var i = 0; i < data.ProvinceList.length > 0; i++) {
                            if (that.onProvId == data.ProvinceList[i].ProvinceId) {
                                hasProvLocal = true;
                            }
                        }
                        if (!hasProvLocal) {
                            that.onProvId = 16;
                            that.onProvName = "江苏";
                        }
                        that.initData();
                        that.getData();
                    }
                }
            })
        },
        // 省份切换
        clickChangeProv: function (id, name) {
            if (id != this.onProvId) {
                this.onProvId = id;
                this.onProvName = name;
                this.showProvList = false;
                // 初始化变量
                this.sectionData1 = [];
                this.sectionData2 = [];
                this.sectionData3 = [];
                this.sectionData4 = [];
                this.sectionData5 = [];
                this.sectionData6 = [];
                this.sectionData7 = [];
                this.bkTabIndex = 0;
                this.newBKlist = [];
                // this.bcTabIndex = 0;
                // this.newBClist = [];
                this.getData();
                this.getClyIdData();
            }
        },
        // 轮播
        getSwiper: function (index) {
            var that = this
            that['swiper' + index] = new Swiper('#swiper' + index, {
                // effect: index == 1 ? 'fade' : '',
                slidesPerView: 'auto',
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination' + index,
                    clickable: true,
                },
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
            })
        },

        //小程序分享
        setShare: function () {
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/xinjiangt?isxcx=1&spm=" + spm + "&refid=" + refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "心灵四季，美丽中国，冬游新疆季！",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2019/zt/touch/191223/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },

        //数据初始化
        initData: function () {

            // 印象新疆(44765)
            this.allAjax('44702', 1, '', 1, 100);
            // 文化探索(44766)
            this.allAjax('44703', 2, '', 1, 100);
            // 吃在新疆(44767)
            this.allAjax('44767', 3, '', 1, 100);
            // 玩在新疆(44768)
            this.allAjax('44768', 4, '', 1, 100);
            // 住在新疆(44769)
            this.allAjax('44769', 5, '', 1, 100);
            // 游记攻略(44770) 
            this.allAjax('44770', 6, '', 1, 100);
            // 线路推荐(44771)
            this.allAjax('44771', 7, '', 1, 100);
        },
        // 
        getData: function () {
            //
        },
        getClyIdData: function () {
            var that = this;
            if (that.clyIdList.length > 0) {
                that.clyIdList.forEach(function (item, index) {
                    var ClyId = item.Summary.replace(/\|/g, ',')
                    that.searchAjax(ClyId, index + 1)
                })
            }

        },
        //图片裁剪
        setImageSize: function (url, size, type) {
            type = type || '00'
            if (!url) {
                return null;
            }
            if (url.indexOf("http:") != -1 && url.indexOf("file.wanchengly.com") == -1) {
                url = url.replace("http:", "https:")
            }
            var defaultSize = "_600x300_00";
            if (size && size.indexOf("_") === -1) {
                size = "_" + size + "_" + type;
            }
            var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
            var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
            if (reg.test(url) && regSize.test(size)) {
                return url.replace(reg, size);
            }

            if (reg.test(url)) {
                return url;
            }

            if (url.indexOf("upload.17u.com") > -1 || url.indexOf("file.40017.cn") > -1 || url.indexOf("file.wanchengly.com") > -1) {
                return url;
            } else if (!reg.test(url)) {
                return url.replace(/\.\w+$/, function ($0) {
                    return (size || defaultSize) + $0;
                });
            }
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
                        if (index == 'bk1') {
                            that['sectionData3'] = '';
                            that.newBKlist[0].list = '';
                        } else if (index == 'bk2') {
                            that.newBKlist[1].list = '';
                        } else {
                            that['sectionData' + index] = '';
                        }

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
                        case 'Ih5':
                            that.Ih5 = data.List[0].SceneryImg
                            break;
                        case 'Ixcx':
                            that.Ixcx = data.List[0].SceneryImg
                            break;
                        case 1:
                            var list = data.List;
                            that['sectionData' + index] = list;
                            if (list.length > 1) {
                                that.$nextTick(function () {
                                    that.getSwiper(1);
                                })
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
            function resultsBK(datas) {
                var list = ''
                if (datas && datas.length > 0) {
                    list = []
                    datas.forEach(function (item, index) {
                        if (index == 0) {
                            that.newBKlist.push({
                                "cityName": item.CityName,
                                "list": [item]
                            })
                        } else {
                            // 根据城市分组
                            var hasCityName = false;
                            if (that.newBKlist && that.newBKlist.length > 0) {
                                for (var i = 0; i < that.newBKlist.length; i++) {
                                    if (that.newBKlist[i].cityName == item.CityName) {
                                        hasCityName = true;
                                        that.newBKlist[i].list.push(item)
                                    }
                                }

                                // 数组中没有就加入
                                if (!hasCityName) {
                                    that.newBKlist.push({
                                        "cityName": item.CityName,
                                        "list": [item]
                                    })
                                }
                            }
                        }
                    })
                    list = that.newBKlist[0].list;
                    that['sectionData2'] = list;
                    // console.log('newBKlist --- ',that.newBKlist)
                }
                return list
            }
            function resultsBC(datas) {
                var list = ''
                if (datas && datas.length > 0) {
                    list = []
                    datas.forEach(function (item, index) {
                        that.newBClist.push({
                            "cityId": item.SceneryId,
                            "cityName": item.SceneryName,
                            "cityDesc": item.Summary,
                            "cityImg": item.SceneryImg,
                            "list": []
                        })
                        if (index == 0) {
                            that.allAjax(item.SceneryId, 'a' + index, '', 1, 100);
                        }
                    })
                }
                return list
            }
        },
        searchAjax: function (ClyId, idx) {
            var that = this;
            var reqData = {
                "clientType": AppInfo.isAPP ? 7 : 1,
                "PageIndex": 1,
                "PageCount": 30,
                "Search": {
                    "ClyId": ClyId,
                    "ProID": that.onProvId,
                    "ExtensionProId": that.onProvId,
                    "SortStr": "0",
                    "ChId": 2,
                    "PfId": 10,
                    "KeyWord": ""
                },
            }
            $.ajax({
                url: WL_URL_TEST(window.location.protocol + '//' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/ScenerySearch', reqData),
                data: reqData,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data && data.Body && data.Body.BookingModel && data.Body.BookingModel.length > 0) {
                        var list = data.Body.BookingModel.slice(0, 10), _list = [], flag = false;
                        list.forEach(function (item) {
                            var obj = {
                                "Murl": '//m.ly.com/scenery/scenerydetail_' + item.SID + '.html?wvc1=1&wvc2=1&spm=5.' + that.zId + '.44051.1',
                                "Kurl": 'tctclient://scenery/detail?sceneryId=' + item.SID + '&wvc1=1&wvc2=1&tcwebtag=v300v5.' + that.zId + '.44051.1v',
                                "Wurl": '//wx.17u.cn/scenery/scenerydetail_' + item.SID + '_0_0.html?spm=5.' + that.zId + '.44051.1',
                                "SceneryId": item.SID,
                                "SceneryName": item.SNAME,
                                "SceneryImg": item.AbsoluteImgPath,
                                "CityName": item.CityName,
                                "Summary": item.Summary,
                                "AmountAdvance": item.BCSLowestPrice,
                            }
                            _list.push(obj)

                        })

                        that['sectionDataS' + idx] = _list;
                    } else {
                        that['sectionDataS' + idx] = ''
                    }
                },
                complete: function () { }
            })
        },

        moreFn2: function () {
            if (this.bkTabIndex == 0) {
                window.location.href = 'https://so.ly.com/scenery?q=%E5%AE%81%E5%A4%8F'
            } else {
                window.location.href = 'https://so.ly.com/gny-gentuan?q=%e5%ae%81%e5%a4%8f&sopage=sogny&prop=1'
            }

        },

        popText(txt){
            this.showGift=true
            this.giftTxt = txt
        },

        bargainLink: function (url) {
            window.location.href = url
        },

        windowLocationHref: function (type, item, index) {
            if (type == 'order') {
                if (this.isxcx) {
                    wx.miniProgram.navigateTo({
                        url: this.goOrder(item.SceneryId, item.BCTTicketId, item.BCTTicketPriceId, index)
                    });
                } else {
                    window.location.href = this.goOrder(item.SceneryId, item.BCTTicketId, item.BCTTicketPriceId, index)
                }
            } else if (type == 'detail') {
                if (this.isxcx) {
                    wx.miniProgram.navigateTo({
                        url: this.getLink(item.SceneryId, item.Wurl, item.Murl, index)
                    });
                } else {
                    window.location.href = this.getLink(item.SceneryId, item.Kurl, item.Wurl, item.Murl)
                }

            }

        },
        //链接跳转
        getLink: function (sceneryId, kurl, wurl, murl) {
            if (this.isTc) {
                // return kurl + '&refid=508528687'
                return 'tctclient://react/page?projectId=117001&page=Detail&sceneryId=' + sceneryId + '&spm=' + this.spm + '&refid=' + this.refid
            } else if (this.isWx && this.isxcx) {
                return "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + this.spm + "&wxrefid=" + this.refid
            } else if (this.isWx) {
                return wurl + this.addHtml
            } else {
                return murl + this.addHtml
            }
        },
        goOrder: function (sceneryId, priceId, oldPriceId, index) {
            var spm = this.spm.slice(0, -1) + (index + 1)
            if (this.isTc) {
                // return 'tctclient://scenery/detail?sceneryId=' + sceneryId + '&wvc1=1&wvc2=1&tcwebtag=v300v' + spm + 'v' + this.addHtml
                return 'tctclient://react/page?projectId=117001&page=Order&sid=' + sceneryId + '&policyid=' + priceId + '&spm=' + this.spm + '&refid=' + this.refid

            } else if (this.isWx && this.isxcx) {
                return "/page/top/pages/scenery/order/order?sid=" + sceneryId + "&policyid=" + priceId + "&suppliertype=0&wxspm=" + spm + "&wxrefid=" + this.refid
            } else if (this.isWx) {
                return '//wx.17u.cn/scenery/booking/newbook1_' + sceneryId + '_' + oldPriceId + '.html?source=1&spm=' + spm + this.addHtml;
            } else {
                return '//m.ly.com/scenery/booking/newbook1.html?sceneryId=' + sceneryId + '&priceid=' + oldPriceId + '&spm=' + spm + this.addHtml;
            }
        },
        swiperFn: function (item) { },
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

