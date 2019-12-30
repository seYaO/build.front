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
var InitObj = {
    newBKlist: [{ cityName: '中秋团圆惠', list: [] }, { cityName: '献礼教师节', list: [] }],
    newBClist: [{ cityName: '登山揽明月', list: [], moreList: [] }, { cityName: '水中赏月影', list: [], moreList: [] }, { cityName: '古镇品月色', list: [], moreList: [] }]
}
// __vouchers = __vouchers.replace(/&quot;/g, '"')
// __vouchers = JSON.parse(__vouchers)
var __vouchers = [{ "type": "榴莲", "red": 10, "total": "满289元可用", "isGet": false, "id": 43030, "pcId": "07FD880FB1", "cardId": "pOCyauDmrXDX7F7sjBSa65w_Fny0" }, { "type": "韭菜炒蛋", "red": 5, "total": "满129元可用", "isGet": false, "id": 43029, "pcId": "875B75AE52", "cardId": "pOCyauNl020rPVYVt2VphtWEls3A" }, { "type": "酸菜", "red": 3, "total": "满4元可用", "isGet": false, "id": 43028, "pcId": "C853EA012B", "cardId": "pOCyauLOA9rszAREoZTmUQ0XJxBk" }, { "type": "十仁", "red": 15, "total": "满359元可用", "isGet": false, "id": 43032, "pcId": "3109520405", "cardId": "pOCyauIvQOgCJWq_6ggMpie5cNB8" }, { "type": "小龙虾", "red": 12, "total": "满329元可用", "isGet": false, "id": 43031, "pcId": "AE97CFCE23", "cardId": "pOCyauDa9Lir-7yEv2ova64P4QFU" }]

var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: false,
        memberId: '',
        addHtml: '',
        refid: '',
        spm: '',
        provAjaxList: '',
        loading: false,
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',
        showProvList: false,
        sectionData1: [],
        sectionData2: {},
        sectionData3: [],
        sectionData4: [],
        sectionData5: [],
        sectionData6: [],
        sectionData9: [],
        bkTabIndex: 0,
        bcTabIndex: 0,
        newBKlist: clone(InitObj.newBKlist),
        newBClist: clone(InitObj.newBClist),
        clyIdList: [],
        // 1.榴莲（默认呈现）2.韭菜炒蛋3.酸菜4.十仁5.小龙虾
        redGtImg: '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures_2.gif?v=1',
        redValues: '选一款最喜欢的月饼',
        isgetNum: 0, // 翻牌次数
        inter: null, // setInterval
        redlist: __vouchers,
        redObj: {},
        popErr: false,
        popObj: {},
        showRedPop: false
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
                    that.getPara()
                },
                init: function (id) {
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
                AppInfo.isAPP = data.isTc
                AppInfo.cityID = data.cid
                if (AppInfo.isAPP) {
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
                }
                allInit.init('42911');
                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId) {
                    that.isGetHB()
                }
            });
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
                            that.onProvId = location.provinceId
                            // that.onProvName = location.province
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
                console.log(windowH < fixBoxTop);

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
                data: 'action=GETSPMSCENERYJSP&PageIndex=1&PageSize=100&px=5&cp=1&ChannelID=41022',
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
                        that.allAjax('43037', 8, '', 1, 100);
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
                this.sectionData2 = {};
                this.sectionData3 = [];
                this.sectionData4 = [];
                this.sectionData9 = [];
                this.sectionData6 = [];
                this.section5Index = 1;
                this.bkTabIndex = 0;
                this.newBKlist = clone(InitObj.newBKlist);
                this.bcTabIndex = 0;
                this.newBClist = clone(InitObj.newBClist);
                this.initData();
                this.getClyIdData();
            }
        },
        //轮播初始化
        initSwiper1: function () {
            var that = this;
            that.swiper1 = new Swiper('#swiper1', {
                loop: true,
                pagination: {
                    el: '.swiper-pagination1',
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                }, //可选选项，自动滑动
            });
        },
        //获取链接参数
        getPara: function () {
            this.refid = getQueryString('refid') ? getQueryString('refid') : '';
            this.spm = getQueryString('spm') ? getQueryString('spm') : '';
            var URLArgues = "";
            if (getQueryString("wxparam")) {
                URLArgues = JSON.parse(
                    decodeURIComponent(getQueryString("wxparam"))
                );
            }
            this.wxopenid = URLArgues.openid;
            this.wxunionid = URLArgues.unionid;
            // 定位
            this.hasGetCard(); // 小程序券
            this.loactionFn();
            this.linkListFixed();
            this.setShare();
        },
        //小程序分享
        setShare: function () {
            var that = this;
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/2019zhongqiuxcx?spm=" +
                spm +
                "&refid=" +
                refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "景区1元起，陪伴家人中秋同游~",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2019/zt/touch/190904/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },
        //数据初始化
        initData: function () {
            //  特惠限时购(中秋团圆惠43033 献礼教师节43034)
            this.allAjax('43033', 2, this.onProvId, 1, 100);
            this.allAjax('43034', 3, this.onProvId, 1, 100);
            //中秋召集令(43035)
            this.allAjax('43035', 4, '', 1, 6)
            //  赏月推荐榜(登山揽明月43036 水中赏月影43047 古镇品月色43048 赏月推荐榜43037)
            this.allAjax('43036', 5, this.onProvId, 1, 100);
            this.allAjax('43047', 6, this.onProvId, 1, 100);
            this.allAjax('43048', 7, this.onProvId, 1, 100);

        },
        getClyIdData: function () {
            var that = this;
            that.clyIdList.map((item, index) => {
                var ClyId = item.Summary.replace(/\|/g, ',')
                that.searchAjax(ClyId, index)
            })
        },
        //更多
        moreFn: function () {
            var url = encodeURIComponent("https://www.ly.com/scenery/zhuanti/tejiaxcx");
            wx.miniProgram.navigateTo({
                url: "/page/home/webview/webview?src=" + url
            });
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
                            that.sectionData1 = data.List;
                            break;
                        case 2:
                            if (data.List.length > 0) {
                                that.newBKlist[0].list = data.List
                            } else {
                                that.newBKlist[0].list = ''
                            }
                            that.sectionData4 = that.newBKlist[0].list;
                            break;
                        case 3:
                            if (data.List.length > 0) {
                                that.newBKlist[1].list = data.List
                            } else {
                                that.newBKlist[1].list = ''
                            }
                            break;
                        case 4:
                            that.sectionData3 = data.List.slice(0, 6);
                            if (data.List.length > 1) {
                                that.$nextTick(function () {
                                    that.initSwiper1();
                                })
                            }
                            break;
                        case 5:
                            that.newBClist[0].list = results(data.List)
                            that.sectionData6 = that.newBClist[0].list;
                            break;
                        case 6:
                            that.newBClist[1].list = results(data.List)
                            break;
                        case 7:
                            that.newBClist[2].list = results(data.List)
                            break;
                        case 8:
                            if (data.List.length) {
                                that.clyIdList = data.List
                                that.getClyIdData()
                            }
                            break;
                    }
                },
                pageIndex,
                pageSize
            )
            function results(datas) {
                var list = ''
                if (datas && datas.length > 0) {
                    list = []
                    datas.forEach(function (item) {
                        var labs = item.Summary.split('|')
                        if (labs[0] && labs[0] == 1) {
                            $.extend(item, { label: labs[1], score: new Array(Number(labs[2])) })
                            list.push(item)
                        } else {
                            list.push(item)
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
                        that.newBClist[index].moreList = data.Body.BookingModel.slice(0, 20)
                        if (index == 0) {
                            that.sectionData9 = that.newBClist[index].moreList;
                            console.log('sectionData9 ---', that.sectionData9)
                        }

                    } else {
                        that.newBClist[index].moreList = ''
                        if (index == 0) {
                            that.sectionData9 = ''
                        }
                    }
                },
                complete: function () { }
            })
        },
        recommend: function (sceneryId, index) {
            wx.miniProgram.navigateTo({
                url: "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + this.spm + "&wxrefid=" + this.refid
            });
            // return AppInfo.isAPP ?
            //     'tctclient://scenery/detail?sceneryId=' + SceneryId + '&wvc1=1&wvc2=1&tcwebtag=v300v5.40789.40791.' + (index + 1) + 'v' + this.addHtml :
            //     this.isWx ?
            //         '//wx.17u.cn/scenery/scenerydetail_' + SceneryId + '_0_0.html?spm=5.40789.40791.' + (index + 1) + this.addHtml :
            //         '//m.ly.com/scenery/scenerydetail_' + SceneryId + '.html?spm=5.40789.40791.' + (index + 1) + this.addHtml
        },
        bkChangeTab: function (index) {
            if (index != this.bkTabIndex) {
                this.bkTabIndex = index;
                var list = this.newBKlist[this.bkTabIndex].list
                this.sectionData4 = list && list[0] ? list : '';
            }
        },
        bcChangeTab: function (index) {
            if (index != this.bcTabIndex) {
                this.bcTabIndex = index;
                var list = this.newBClist[this.bcTabIndex].list;
                var moreList = this.newBClist[this.bcTabIndex].moreList
                this.sectionData6 = list && list[0] ? list : '';
                this.sectionData9 = moreList && moreList[0] ? moreList : '';
            }
        },
        windowLocationHref: function (type, item) {
            if (type == 'order') {
                this.goOrder(item.SceneryId, item.BCTTicketId)
            } else if (type == 'detail') {
                this.getLink(item.SceneryId)
            }

        },
        //链接跳转
        getLink: function (sceneryId) {
            wx.miniProgram.navigateTo({
                url: "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + this.spm + "&wxrefid=" + this.refid
            });
        },
        goOrder: function (sceneryId, priceId) {
            wx.miniProgram.navigateTo({
                url: "/page/top/pages/scenery/order/order?sid=" + sceneryId + "&policyid=" + priceId + "&suppliertype=0&wxspm=" + this.spm + "&wxrefid=" + this.refid
            });
        },
        swiperFn: function (item) {
            wx.miniProgram.navigateTo({
                url: item.Summary
            });
        },
        /**
         * 红包模块
         */
        // 小程序红包
        getRed() {
            var url = encodeURIComponent('https://m.ly.com/zby/channel/lingquan/?refid=504787206#/')
            wx.miniProgram.navigateTo({
                url: "/page/home/webview/webview?src=" + url
            });
        },
        // 判断是否需要登陆
        checkLogin: function (index) {
            if (this.wxopenid && this.wxunionid) {
                this.getCard(index)
            } else {
                //走套头
                var url = encodeURIComponent(
                    "https://www.ly.com/scenery/zhuanti/2019zhongqiuxcx?spm=" +
                    this.spm +
                    "&refid=" +
                    this.refid
                );
                var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
                window.location.href = path;
            }
        },
        showCard: function (type) {
            var that = this
            var index = 0, redArr = [
                { redGtImg: '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures_2.gif?v=1', redValues: '选一款最喜欢的月饼' },
                { redGtImg: '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures_2.gif?v=1', redValues: '翻开有惊喜' },
                { redGtImg: '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures_1.gif?v=1', redValues: '向左滑动查看更多' }
            ]
            clearInterval(that.inter)
            if (type == 0) {
                //初始化数据
                that.isgetNum = 0
                that.redlist.map(item => {
                    if (item.isGet) {
                        that.isgetNum += 1
                    }
                })
                if (that.isgetNum == 1) {
                    that.redGtImg = '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures.png?v=1'
                    that.redValues = '分享给好友，再翻一次'
                    that.showRedPop = true
                    // alert('分享给好友，再翻一次')
                } else if (that.isgetNum > 1) {
                    that.redGtImg = '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures.png?v=1'
                    that.redValues = '您的机会用完了哦~'
                } else {
                    fn()
                }
            } else if (type == 1) {
                // 领取后  // 此时文案变为【分享给好友，再翻一次】，文案内容固定不变
                if (that.isgetNum == 1) {
                    that.redGtImg = '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures.png?v=1'
                    that.redValues = '分享给好友，再翻一次'
                    that.showRedPop = true
                    // alert('分享给好友，再翻一次')
                } else if (that.isgetNum > 1) {
                    that.redGtImg = '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures.png?v=1'
                    that.redValues = '您的机会用完了哦~'
                }

            } else if (type == 2) {
                // 分享后  // （无需判断是否分享成功），文案和手势回到状态1，再次循环
                if (that.isgetNum < 2) {
                    fn()
                }
            } else {
                if (that.isgetNum > 1) {
                    that.redGtImg = '//img1.40017.cn/cn/s/2019/zt/touch/190904/gestures.png?v=1'
                    that.redValues = '您的机会用完了哦~'
                }
            }

            function fn() {
                that.inter = setInterval(function () {
                    index++
                    index = index == 3 ? 0 : index
                    that.redGtImg = redArr[index].redGtImg
                    that.redValues = redArr[index].redValues
                }, 2000)
            }
        },
        // 验证卡券是否领取
        hasGetCard: function () {
            var that = this;
            for (var i = 0; i < that.redlist.length; i++) {
                (function (j) {
                    var reqData1 = {
                        "OpenId": that.wxopenid,
                        "CardId": that.redlist[j].cardId,
                    };
                    $.ajax({
                        url: WL_URL_TEST("https://www.ly.com/wl/api/labrador/resourceservice/getwechatcardreceiverecord/", reqData1),
                        data: reqData1,
                        dataType: "json",
                        type: 'post',
                        success: function (data) {
                            // 已领取
                            if (data.StateCode == 200 && data.Body && data.Body.length) {
                                that.redlist[j].isGet = true;
                            }
                            that.showCard(0)
                        },
                        fail: function (error) {
                            console.log(error);
                        },
                        complete: function () { }
                    });
                })(i);
            }
        },
        // 领取卡券
        getCard: function (index) {
            var that = this;
            if (that.redlist[index].isGet || that.addClassFlag) {
                return
            }

            if (that.isgetNum == 1 && that.showRedPop) {
                that.popShare(true)
                that.showRedPop = false
                return
            }

            if (that.isgetNum > 1) {
                return
            }

            // that.redlist[index].isGet = true;
            // that.isgetNum += 1
            // that.popShow(index, true) 
            // that.showCard(1)
            // return

            that.loading = true;
            var reqData = {
                "OpenId": that.wxopenid,
                "CardId": that.redlist[index].cardId,
                "unionId": that.wxunionid
            }
            $.ajax({
                url: WL_URL_TEST("https://www.ly.com/wl/api/labrador/resourceservice/wechatcardreceive/", reqData),
                data: reqData,
                dataType: "json",
                type: 'POST',
                success: function (data) {
                    if (data) {
                        if (
                            data.StateCode == 200 &&
                            data.Body.Cards &&
                            data.Body.Cards.length
                        ) {
                            // 领取成功
                            that.redObj = JSON.parse(JSON.stringify(that.redlist[index]));
                            that.redlist[index].isGet = true;
                            that.isgetNum += 1
                            that.popShow(index, true)
                            that.showCard(1)
                        } else {
                            //失败
                            that.redlist[index].isGet = false;
                            // that.popFn(data.ResultMsg);
                            that.popShow(index, false)
                            that.showCard()
                        }
                    }
                },
                fail: function (error) {
                    console.log(error);
                },
                complete: function () {
                    that.loading = false;
                }
            });
        },
        getWXShare: function () {
            var that = this;
            if (that.isgetNum == 1 && that.showRedPop) {
                that.popShare(true)
                that.showRedPop = false
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
        popShow: function (index, flag) {
            if (flag) {
                this.popErr = false
                this.popObj = this.redlist[index]
            } else {
                this.popErr = true
            }
            $(".popupBox").show();
        },
        popClose: function () {
            var that = this
            $(".popupBox").hide();
        },
        popShare: function (flag = false) {
            if (flag) {
                $(".sharePop").show();
            } else {
                $(".sharePop").hide();
                this.showCard(2)
            }
        }

    }
})
