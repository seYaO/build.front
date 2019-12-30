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

var __topimg = '//img1.40017.cn/cn/s/2019/zt/touch/191201/top.jpg'
var __redlist = [
    { "type": "", "red": 3, "total": "满99元可用", "isGet": false, "id": 44045, "pcId": "DD005047A5", "cardId": "pOCyauAWoiRcIHjSj5O4PGdQ3aSA" },
    { "type": "", "red": 5, "total": "满159元可用", "isGet": false, "id": 44046, "pcId": "ED4BADBE83", "cardId": "pOCyauPrye9SEgSNrwwSEqU7Tdi8" },
    { "type": "", "red": 10, "total": "满259元可用", "isGet": false, "id": 44047, "pcId": "36EB5A75C0", "cardId": "pOCyauJqNJl5PHG_yM6kTHnynbg8" }
]

var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: false,
        // userid=37421349&nickName=seYao_O&level=1
        memberId: '',
        addHtml: '',
        refid: '',
        spm: '5.44016.44016.1',
        zId: '44016', // 专题ID
        cId: '44050', // 省市ID
        provAjaxList: '',
        loading: false,
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',
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
        sectionDataS1: [],
        sectionDataS2: [],
        sectionDataS3: [],
        showMore: true,
        bkTabIndex: 0,
        bcTabIndex: 0,
        newBKlist: [],
        newBClist: [],
        clyIdList: [],
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
                    that.isGetHB()
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
            // 定位
            this.loactionFn();
            this.linkListFixed();
            // this.getTimeFn();
            if (this.isxcx) {
                var URLArgues = "";
                if (getQueryString("wxparam")) {
                    URLArgues = JSON.parse(
                        decodeURIComponent(getQueryString("wxparam"))
                    );
                }
                this.wxopenid = URLArgues.openid;
                this.wxunionid = URLArgues.unionid;
                this.hasGetCard(); // 小程序券
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
                this.sectionDataS1 = [];
                this.sectionDataS2 = [];
                this.sectionDataS3 = [];
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
            var that = this;
            var spm = this.spm;
            var refid = this.refid;
            var url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/2019shuangshiyi?isxcx=1&spm=" +
                spm +
                "&refid=" +
                refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "门票特卖不玩套路，11.1元起景区脱单去！",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2019/zt/touch/191101/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },

        //数据初始化
        initData: function () {
            // 头图(44044)
            // this.allAjax('44044', 'imgh5', '', 1, 1);
            // this.allAjax('44044', 'imgxcx', '', 1, 1);

            // 3元红包(44045)
            this.allAjax('44045', 'R3', '', 1, 1);
            // 5元红包(44046)
            this.allAjax('44046', 'R5', '', 1, 1);
            // 10元红包(44047)
            this.allAjax('44047', 'R10', '', 1, 1);

            // 脱单秘籍专区(44051)
            this.allAjax('44051', 33, '', 1, 3);
        },
        // 
        getData: function () {
            // 11.11专区(44048)
            this.allAjax('44048', 1, this.onProvId, 1, 100);
            // 买一送一专区(44049)
            this.allAjax('44049', 2, this.onProvId, 1, 100);
            // 限时特惠专区(44050)
            this.allAjax('44050', 3, this.onProvId, 1, 100);
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
                        case 'Ih5':
                            that.Ih5 = data.List[0].SceneryImg
                            break;
                        case 'Ixcx':
                            that.Ixcx = data.List[0].SceneryImg
                            break;
                        case 'R3':
                            that.R3.pcId = data.List[0].SceneryName
                            that.R3.cardId = data.List[0].Summary
                            // console.log(index, data.List[0].SceneryName, data.List[0].Summary)
                            break;
                        case 'R5':
                            that.R5.pcId = data.List[0].SceneryName
                            that.R5.cardId = data.List[0].Summary
                            // console.log(index, data.List[0].SceneryName, data.List[0].Summary)
                            break;
                        case 'R10':
                            that.R10.pcId = data.List[0].SceneryName
                            that.R10.cardId = data.List[0].Summary
                            // console.log(index, data.List[0].SceneryName, data.List[0].Summary)
                            break;
                        case 33:
                            // resultsBK(data.List)
                            if (data.List.length) {
                                that.clyIdList = data.List
                                that.getClyIdData()
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
        // 判断是否需要登陆
        checkLogin: function (index) {
            if (this.isxcx) {
                if (this.wxopenid && this.wxunionid) {
                    this.getCard(index)
                } else {
                    //走套头
                    var url = encodeURIComponent(
                        "https://www.ly.com/scenery/zhuanti/2019shuangshiyi?isxcx=1&spm=" +
                        this.spm +
                        "&refid=" +
                        this.refid
                    );
                    var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
                    window.location.href = path;
                }
            } else {
                if (this.memberId) {
                    this.getHb(index)
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

        /**
         * 红包部分
         */

        // 判断之前有没有领过红包
        isGetHB: function () {
            var that = this, batchS = []
            that.loading = true
            //红包批次号;
            that.redlist.forEach(function (item, index) {
                batchS.push(item.pcId)
            })

            $.ajax({
                url: '/scenery/AjaxHelper/ZhuanTiHelp/ThematicIntegration.aspx',
                data: 'action=GETHONGBAOBOOL&BatchNo=' +
                    batchS.join() +
                    '&memberid=' +
                    that.memberId,
                dataType: 'json',
                success: function (data) {
                    // 未找到相关信息
                    if (data && data.length) {
                        // 已领过红包
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < batchS.length; j++) {
                                if (data[i].BatchNo == batchS[j]) {
                                    that.redlist[j].isGet = true
                                }
                            }
                        }
                    } else { }
                },
                complete: function () {
                    that.loading = false
                }
            })
        },
        // 领取红包
        getHb: function (index) {
            var that = this;
            if (that.redlist[index].isGet) return
            that.loading = true;

            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
                data: 'action=GETSPMHONGBAO&New=1&ChannelID=' +
                    that.redlist[index].id +
                    '&MemberId=' +
                    that.memberId,
                dataType: 'json',
                success: function (data) {
                    // 发送成功
                    if (data && data.State == 6) {
                        // 领取成功
                        that.redlist[index].isGet = true;
                        // that.redObj = that.redlist[index];
                        that.popFn('领取成功')
                    } else if (data && data.State == 4) {
                        // 发送过了
                        that.redlist[index].isGet = true;
                        // that.redObj = that.redlist[index];
                        that.popFn('已经领取过红包了哦')
                    } else {
                        that.popFn(data.Magess)
                    }
                },
                complete: function () {
                    that.loading = false;
                }
            })
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
            if (that.redlist[index].isGet) return
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
                        if (data.StateCode == 200 && data.Body.Cards && data.Body.Cards.length) {
                            // 领取成功
                            // that.redObj = JSON.parse(JSON.stringify(that.redlist[index]));
                            that.redlist[index].isGet = true;
                            that.popFn('领取成功')
                        } else {
                            //失败
                            that.redlist[index].isGet = false;
                            that.popFn(data.ResultMsg);
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

    }
})

