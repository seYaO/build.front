//url截参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
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
        var timeLength = newTime ? newTime : this.getDayLength();
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
                that.backFun();
            } else {
                //正在抢购中
                if (timeNums < beginNums) {
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

var app = new Vue({
    el: '#app',
    data: {
        isTc: false,
        isWx: false,
        isxcx: false,
        memberId: '',
        addHtml: '',
        refid: '',
        spm: '',
        loading: false,
        // 省份
        provAjaxList: '', // 省份列表
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',
        showProvList: false,
        // data数据
        sectionData1: [],
        sectionData2: [],
        sectionData3: [],
        sectionData4: [],
        sectionData5: [],
        sectionData6: [],
        sectionData9: [],
        sectionData66: [],
        showMore: true,
        bkTabIndex: 0,
        newBKlist: [],
        bcTabIndex: 0,
        newBClist: [],
        // '2019/6/6 10:00:00'
        // 9.16-10.7；10:00，14:00，18:00
        // 0 - 即将开抢，1 - 正在疯抢，2 - 已结束/疯抢结束
        days: '00', //抢购时间点
        hours: '00',
        minutes: '00',
        seconds: '00',
        cdTXT: '距抢购开始剩',
        nowTime: '',
        showindex: '0',
        showqg: false,
        showQGmodule: false,
        dateStr: '',
        timeStart: '2019/9/16',
        timeEnd: '2019/10/7',
        timeObj: { 0: '即将开抢', 1: '正在疯抢', 2: '已结束' },
        timeBtn: '',
        timearr: [
            {
                begindate: '10:00:00',
                enddate: '11:59:59',
                time: '10:00',
                state: 0,
            },
            {
                begindate: '14:00:00',
                enddate: '15:59:59',
                time: '14:00',
                state: 0,
            },
            {
                begindate: '18:00:00',
                enddate: '19:59:59',
                time: '18:00',
                state: 0,
            },
        ],
    },
    created: function () {
        this.init();
    },
    mounted: function () { },
    methods: {
        init: function () {
            var that = this
            var AppNewSpm = getQueryString('tcwebtag')
            allInit = {
                doRefid: function (dataAndRefid) {
                    // console.log(3)
                    // Hellow world~   所有的一切从这里开始
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
                    that.memberId = data.memberId || ''
                } else {
                    if ($.cookie('us')) {
                        var uMemberIDRight = $.cookie('us').split('=')[1]
                        var uId = uMemberIDRight.split('&')[0]
                        that.memberId = uId ? uId : ''
                    }
                    that.getWechat()
                }
                allInit.init('43207');
                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                // if (that.memberId) {
                //     that.isGetHB()
                // } else {
                //     that.showHB(0)
                // }
            });
        },
        getWechat() {
            var that = this
            // 小程序模拟器用
            if (getQueryString('isxcx')) {
                that.isxcx = true
            } else {
                if (/MicroMessenger/i.test(navigator.userAgent)) {
                    wx.miniProgram.getEnv(function (res) {
                        if (res.miniProgram) {
                            that.isxcx = true
                        } else {
                            that.isWx = true
                        }
                    })
                }
            }

        },
        // 获取链接参数
        getPara: function (spm, refid) {
            // debugger
            // alert('isTc --- ' + this.isTc + ' isWx --- ' + this.isWx + ' isxcx --- ' + this.isxcx)
            this.refid = getQueryString('refid') ? getQueryString('refid') : refid
            this.spm = getQueryString('spm') ? getQueryString('spm') : spm
            // 定位
            this.loactionFn();
            this.linkListFixed();
            this.getTimeFn();
        },
        //省份定位
        loactionFn: function () {
            var that = this
            if (that.isTc) {
                // 客户端获取省份
                var cityId = AppInfo.cityID;
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
                // console.log(windowH < fixBoxTop);

                if (windowH < fixBoxTop) {
                    $('.show-fix-box').removeClass('fixed_tab')
                } else {
                    $('.show-fix-box').addClass('fixed_tab')
                }
            })
        },
        // 省份列表调取
        provListFn: function () {
            var that = this
            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/ZhuanTiJsp.aspx',
                data: 'action=GETSPMSCENERYJSP&PageIndex=1&PageSize=100&px=5&cp=1&ChannelID=43212',
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
                // this.sectionData3 = [];
                this.sectionData4 = [];
                // this.sectionData6 = [];
                // this.sectionData66 = [];
                // this.section5Index = 1;
                this.bkTabIndex = 0;
                this.newBKlist = [];
                // this.bcTabIndex = 0;
                // this.newBClist = [];
                this.getData();
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
            var that = this;
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/2019shiyixcx?spm=" +
                spm +
                "&refid=" +
                refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "疯玩黄金周，门票1元抢>>",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2019/zt/touch/190917/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },

        //数据初始化
        initData: function () {
            // 小长假热玩目的地(43295)
            this.allAjax('43295', 3, '', 1, 100);
            // 广告轮播图(43213)
            this.allAjax('43213', 66, '', 1, 6);
            this.getData();
        },
        // 
        getData: function () {
            // 一元疯抢
            this.allAjax('43211', 1, this.onProvId, 1, 100);
            // 国庆放价(43212)
            this.allAjax('43212', 2, this.onProvId, 1, 100);
            // 周边热门榜单
            this.searchAjax([], 0);
        },
        //更多
        moreFn: function () {
            var that = this;
            that.showMore = false

            // window.location.href = 'https://www.ly.com/scenery/zhuanti/tejia'
        },
        //图片裁剪
        imgFormat: function (img, wid, hei) {
            if (img.match(/.gif$/)) {
                return img
            }
            var regHttp = /^(http:|https:)/
            var reg = /\/\/((pic3\.40017\.cn\/)|(pic4\.40017\.cn\/)|(pic5\.40017\.cn\/))(?!.*(_00.))(.*)/
            var img =
                img && regHttp.test(img) ?
                    img.replace(/(http:|https:)/, 'https:') :
                    'https:' + img
            var alreadySize = /_([0-9]{2,})x([0-9]{2,})_00/
            img =
                img.match(alreadySize) && img.match(alreadySize).length > 0 ?
                    img.replace(alreadySize, '') :
                    img
            return reg.test(img) && wid && hei ?
                img.replace(
                    /(.png|.jpg)/i,
                    '_' + wid + 'x' + hei + '_00' + /(.png|.jpg)/i.exec(img)[0]
                ) :
                img
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
                        if (typeof index == 'string' && index.indexOf('a') > -1) {
                            that['sectionData3'] = ''

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
                        case 2:
                            resultsBK(data.List)
                            break;
                        case 3:
                            resultsBC(data.List)
                            break;
                        case 66:
                            var list = [];
                            data.List.forEach(function (item) {
                                if (item.SceneryId == 0 || item.SceneryId == 1) {
                                    list.push(item)
                                }
                            })
                            that.sectionData66 = list.slice(0, 6);
                            if (list.length > 1) {
                                that.$nextTick(function () {
                                    that.getSwiper(1);
                                })
                            }
                            break;
                        default:
                            if (typeof index == 'string') {
                                if (index.indexOf('a') > -1) {
                                    var idx = index.replace(/a/, '')
                                    that.newBClist[idx].list = data.List
                                    that['sectionData3'] = data.List
                                }

                            } else {
                                that['sectionData' + index] = data.List;
                                if (index == 1) {
                                    that.showMore = data.List.length > 6 ? true : false
                                }
                            }
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
        searchAjax: function (ClyId, index) {
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
                        that.sectionData4 = data.Body.BookingModel.slice(0, 20)
                    } else {
                        that.sectionData4 = ''
                    }
                },
                complete: function () { }
            })
        },
        // 获取服务器时间
        getTimeFn: function () {
            var that = this;
            $.ajax({
                url: "/scenery/AjaxHelper/AjaxCall.aspx",
                data: "action=GetServerDateTime",
                dataType: "text",
                success: function (data) {
                    that.nowTime = data.replace(/-/g, '/');
                    if (new Date(that.nowTime) > new Date(that.timeEnd + ' 23:59:59')) {
                        that.showQGmodule = false;
                    } else {
                        that.showQGmodule = true;
                        // console.log(new Date(that.nowTime) > new Date(that.timeStart))
                        // console.log(that.nowTime.slice(0, -9))
                        that.QG();
                    }
                }
            });
        },

        QG: function () {
            var that = this;
            var beginidx = '3';
            var ingidx = '3';
            var timeStr = this.nowTime.split(' ')[0];
            var tarr = timeStr.split('/');
            that.dateStr = tarr[1] + '月' + tarr[2] + '日';
            // console.log(timeStr.split('/'))
            that.timearr.forEach(function (item, index) {
                var beginms = new Date(timeStr + ' ' + item.begindate).getTime();
                var now = new Date(that.nowTime).getTime();
                var endms = new Date(timeStr + ' ' + item.enddate).getTime();
                if (beginms > now) {
                    item.state = 0;
                    beginidx = index < beginidx ? index : beginidx;
                } else if (beginms <= now && now < endms) {
                    item.state = 1;
                    ingidx = index < ingidx ? index : ingidx;
                } else if (now >= endms) {
                    item.state = 2;
                }

            })
            that.showindex = beginidx < ingidx ? beginidx : ingidx;

            this.countDownFn();
        },

        timeTab: function (index, state) {
            // if (index != this.showindex && state != 2) {
            //     this.showindex = index;
            //     this.countDownFn();
            // }
        },
        // item.state==1 ? '已结束' : item.state==2 ?'正在疯抢' : '即将开抢'
        // 1 已结束 2 正在疯抢 
        // 倒计时
        countDownFn: function (close) {
            var timeStr = this.nowTime.split(' ')[0];
            var todayStartTime = timeStr + ' ' + this.timearr[this.showindex].begindate; //当天开始时间
            var todayEndTime = timeStr + ' ' + this.timearr[this.showindex].enddate; //当天结束时间

            timeObject.nowTime = new Date(this.nowTime).getTime() + timeObject.timeGo;
            timeObject.beforeTime = todayStartTime;
            timeObject.overTime = todayEndTime;

            var that = this;
            timeObject.beforFun = function (e) {
                // 抢购前
                that.cdTXT = '距开始';
                that.days = e[0];
                that.hours = e[1];
                that.minutes = e[2];
                that.seconds = e[3];
                that.timearr[that.showindex].state = 0;
                that.timeBtn = '即将开始'
            };

            timeObject.runFun = function (e) {
                // 抢购开始
                that.cdTXT = '距结束';
                that.days = e[0];
                that.hours = e[1];
                that.minutes = e[2];
                that.seconds = e[3];
                that.timearr[that.showindex].state = 1;
                that.timeBtn = '立即抢购'
            };

            timeObject.backFun = function () {
                // 抢购结束
                that.timearr[that.showindex].state = 2;
                that.timeBtn = '已抢光'
                if (that.showindex < 2) {
                    that.showindex++;
                    that.countDownFn();
                } else {
                    that.showqg = false
                }
            };
            timeObject.mainFun();
        },
        recommend: function (sceneryId, index) {
            // &tcwebtag=v300v5.40789.40790.' + (index + 1) + 'v'
            // a.slice(0,-2)
            let spm = this.spm.slice(0, -1) + index
            if (this.isTc) {
                window.location.href = 'tctclient://scenery/detail?sceneryId=' + sceneryId + '&wvc1=1&wvc2=1&tcwebtag=v300v' + spm + 'v' + this.addHtml
                // return 'tctclient://react/page?projectId=117001&page=Detail&sceneryId=' + sceneryId + '&tcwebtag=v300v' + spm + 'v&refid=508528687'

            } else if (this.isWx) {
                window.location.href = '//wx.17u.cn/scenery/scenerydetail_' + sceneryId + '_0_0.html?spm=' + spm + this.addHtml
            } else if (this.isxcx) {
                wx.miniProgram.navigateTo({
                    url: "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + this.spm + "&wxrefid=" + this.refid
                });
            } else {
                window.location.href = '//m.ly.com/scenery/scenerydetail_' + sceneryId + '.html?spm=' + spm + this.addHtml
            }
        },
        bkChangeTab: function (index) {
            if (index != this.bkTabIndex) {
                this.bkTabIndex = index;
                var list = this.newBKlist[this.bkTabIndex].list
                this.sectionData2 = list && list[0] ? list : '';
            }
        },
        bcChangeTab: function (index) {
            if (index != this.bcTabIndex) {
                this.bcTabIndex = index;
                var id = this.newBClist[this.bcTabIndex].cityId;
                var list = this.newBClist[this.bcTabIndex].list;
                if (typeof list == 'object' && list.length == 0) {
                    this.allAjax(id, 'a' + index, '', 1, 100);
                } else {
                    this.sectionData3 = list && list[0] ? list : '';
                }
            }
        },
        windowLocationHref: function (type, item, index, flag) {
            flag = flag || false;
            if (type == 'order') {
                var state = this.timearr[this.showindex].state
                if (flag && (state == 0 || state == 2)) {
                    return
                }
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
                    window.location.href = this.getLink(item.SceneryId, item.Wurl, item.Murl, index)
                }

            }

        },
        //链接跳转
        getLink: function (sceneryId, wurl, murl, index) {
            var spm = this.spm.slice(0, -1) + index
            if (this.isTc) {
                return 'tctclient://scenery/detail?sceneryId=' + sceneryId + '&wvc1=1&wvc2=1&tcwebtag=v300v' + spm + 'v' + this.addHtml
                // return 'tctclient://react/page?projectId=117001&page=Detail&sceneryId=' + sceneryId + '&tcwebtag=v300v' + spm + 'v&refid=508528687'

            } else if (this.isWx) {
                return wurl + this.addHtml
            } else if (this.isxcx) {
                return "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + spm + "&wxrefid=" + this.refid
            } else {
                return murl + this.addHtml
            }
        },
        goOrder: function (sceneryId, priceId, oldPriceId, index) {
            var spm = this.spm.slice(0, -1) + index
            if (this.isTc) {
                // return 'tctclient://scenery/detail?sceneryId=' + sceneryId + '&wvc1=1&wvc2=1&tcwebtag=v300v' + spm + 'v' + this.addHtml
                return 'tctclient://react/page?projectId=117001&page=Order&sid=' + sceneryId + '&policyid=' + priceId + '&tcwebtag=v300v' + spm + 'v&refid=508528687'

            } else if (this.isWx) {
                return '//wx.17u.cn/scenery/booking/newbook1_' + sceneryId + '_' + oldPriceId + '.html?source=1&spm=' + spm + this.addHtml;
            } else if (this.isxcx) {
                return "/page/top/pages/scenery/order/order?sid=" + sceneryId + "&policyid=" + priceId + "&suppliertype=0&wxspm=" + spm + "&wxrefid=" + this.refid
            } else {
                return '//m.ly.com/scenery/booking/newbook1.html?sceneryId=' + sceneryId + '&priceid=' + oldPriceId + '&spm=' + spm + this.addHtml;
            }
        },
        swiperFn: function (item) {
            if (this.isxcx) {
                wx.miniProgram.navigateTo({
                    url: item.Summary
                });
            } else {
                window.location.href = item.Purl
            }

        },
        // 判断是否需要登陆
        checkLogin: function (index) {
            if (this.memberId) {

                // this.getHb(index)
            } else {
                // 登录
                if (AppInfo.isAPP) {
                    window.location.href = "tctclient://web/loginrefresh";
                } else {
                    window.location.href =
                        '//passport.ly.com/m/login.html?returnUrl=' +
                        encodeURIComponent(window.location.href)
                }
            }
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

