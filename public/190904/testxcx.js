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

// 缓存
var Activity = {
    getLocalData: function () {
        var localDataStr = sessionStorage.getItem("localData_sqdx") || "{}",
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
            sessionStorage.setItem("localData_sqdx", JSON.stringify(_localData));
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
        isxcx: false,
        wxopenid: '',
        wxunionid: '',
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
        sectionData2: [],
        sectionData3: [],
        sectionData4: [],
        sectionData5: [],
        newBKlist: [],
        bkTabIndex: 0,
        showMore5: false,
        section5Index: 1,
        newBClist: [],
        redlist: [{
            type: '门票卡券',
            red: 4, //红包金额
            total: '满89元可用', //满多少元可以用
            id: 42878, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauMaa90r64Hl0SE1UIJO_P_g' //红包批次号
        }, {
            type: '门票卡券',
            red: 5, //红包金额
            total: '满129元可用', //满多少元可以用
            id: 42879, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauEgKL4rgjeu_bGudyZqWUzk' //红包批次号
        }, {
            type: '门票卡券',
            red: 10, //红包金额
            total: '满289元可用', //满多少元可以用
            id: 42880, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauLxn7lNa-EMiNpLdeSTEVgQ' //红包批次号
        }, {
            type: '门票卡券',
            red: 12, //红包金额
            total: '满329元可用', //满多少元可以用
            id: 42881, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauHN8ZyrytTI53wgDP5nLNUc' //红包批次号
        }, {
            type: '门票卡券',
            red: 15, //红包金额
            total: '满359元可用', //满多少元可以用
            id: 42882, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauLGKChbRjALMDwLV2BGozc0' //红包批次号
        }],
        redObj: {},
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
                allInit.init('41014');
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
                            that.onProvName = location.province
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
                this.sectionData2 = [];
                this.sectionData3 = [];
                this.sectionData4 = [];
                this.sectionData5 = [];
                this.section5Index = 1;
                this.bkTabIndex = 0;
                this.newBClist = [];
                this.newBKlist = [];
                this.initData();
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
            this.hasGetCard();
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
                "https://www.ly.com/scenery/zhuanti/2019shuqixcx?spm=" +
                spm +
                "&refid=" +
                refid
            );
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: "领46元优惠券，返场狂欢门票9.9元起，今夏最后浪一下~",
                        path: path, //默认当前页面路径
                        imageUrl: "https://img1.40017.cn/cn/s/2019/zt/touch/211933/sharexcx.jpg" //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
            });
        },
        //数据初始化
        initData: function () {
            var that = this;
            // 包场直降(42883)
            this.allAjax('42883', 2, this.onProvId, 1, 100);
            //甩尾轮播图(42884)
            this.allAjax('42884', 3, '', 1, 6)
            // 超值钜惠5折(42507)
            this.allAjax('41022', 4, this.onProvId, 1, 100);
            //周边必玩(41510)
            this.allAjax('41510', 5, this.onProvId, that.section5Index, 6)
        },
        //更多
        moreFn: function () {
            var that = this;
            that.section5Index++;
            //周边必玩(41510)
            this.allAjax('41510', 5, this.onProvId, that.section5Index, 6)
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
        publicAjax: function (
            mdId,
            index,
            onProvId,
            callBackFn,
            pageIndex,
            pageSize
        ) {
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
                                data.List.forEach(function (el, index) {
                                    if (index == 0) {
                                        that.newBClist.push({
                                            "CityName": el.CityName,
                                            "ProvinceName": el.ProvinceName,
                                            "SceneryName": el.SceneryName,
                                            "SceneryId": el.SceneryId,
                                            "SceneryImg": el.SceneryImg,
                                            "Murl": el.Murl,
                                            "Kurl": el.Kurl,
                                            "Wurl": el.Wurl,
                                            "Summary": el.Summary,
                                            "list": [el]
                                        })
                                    } else {
                                        // 根据城市分组
                                        var hasScenId = false;
                                        if (that.newBClist && that.newBClist.length > 0) {
                                            for (var i = 0; i < that.newBClist.length; i++) {
                                                if (that.newBClist[i].SceneryId == el.SceneryId) {
                                                    hasScenId = true;
                                                    that.newBClist[i].list.push(el)
                                                }
                                            }
                                            // 数组中没有就加入
                                            if (!hasScenId) {
                                                that.newBClist.push({
                                                    "CityName": el.CityName,
                                                    "ProvinceName": el.ProvinceName,
                                                    "SceneryName": el.SceneryName,
                                                    "SceneryId": el.SceneryId,
                                                    "SceneryImg": el.SceneryImg,
                                                    "Murl": el.Murl,
                                                    "Kurl": el.Kurl,
                                                    "Wurl": el.Wurl,
                                                    "Summary": el.Summary,
                                                    "list": [el]
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                            console.log(that.newBClist)
                            that.sectionData2 = that.newBClist;

                            break;
                        case 3:
                            that.sectionData3 = data.List;
                            if (data.List.length > 1) {
                                that.$nextTick(function () {
                                    that.initSwiper1();
                                })
                            }
                            break;
                        case 4:
                            if (data.List.length > 0) {
                                data.List.forEach(function (el, index) {
                                    if (index == 0) {
                                        that.newBKlist.push({
                                            "cityName": el.CityName,
                                            "list": [el]
                                        })
                                    } else {
                                        // 根据城市分组
                                        var hasCityName = false;
                                        if (that.newBKlist && that.newBKlist.length > 0) {
                                            for (var i = 0; i < that.newBKlist.length; i++) {
                                                if (that.newBKlist[i].cityName == el.CityName) {
                                                    hasCityName = true;
                                                    that.newBKlist[i].list.push(el)
                                                }
                                            }
                                            // 数组中没有就加入
                                            if (!hasCityName) {
                                                that.newBKlist.push({
                                                    "cityName": el.CityName,
                                                    "list": [el]
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                            console.log(that.newBKlist)
                            that.sectionData4 = that.newBKlist[0].list;
                            break;
                        case 5:
                            for (var i in data.List) {
                                that.sectionData5.push(data.List[i]);
                            }
                            if (that.section5Index < data.totalSize) {
                                that.showMore5 = true
                            } else {
                                that.showMore5 = false
                            }
                            break;
                    }
                },
                pageIndex,
                pageSize
            )
        },
        bkChangeTab: function (index) {
            if (index != this.bkTabIndex) {
                this.bkTabIndex = index;
                this.sectionData4 = this.newBKlist[this.bkTabIndex].list;
            }
        },
        windowLocationHref: function (type, item) {
            if (type == 'order') {
                this.goOrder(item.SceneryId, item.BCTTicketId)
            } else if (type == 'detail') {
                this.goList(item.SceneryId)
            }

        },
        //链接跳转
        goList: function (sceneryId) {
            console.log(sceneryId);
            wx.miniProgram.navigateTo({
                url: "/page/top/pages/scenery/detail/detail?sid=" + sceneryId + "&wxspm=" + this.spm + "&wxrefid=" + this.refid
            });
        },
        goOrder: function (sceneryId, priceId) {
            wx.miniProgram.navigateTo({
                url: "/page/top/pages/scenery/order/order?sid=" + sceneryId + "&policyid=" + priceId + "&suppliertype=0&wxspm=" + this.spm + "&wxrefid=" + this.refid
            });
        },
        /**
         * 红包模块
         */
        // 判断是否需要登陆
        checkLogin: function (index) {
            if (this.wxopenid && this.wxunionid) {
                this.getCard(index)
            } else {
                //走套头
                var url = encodeURIComponent(
                    "https://www.ly.com/scenery/zhuanti/2019shuqixcx?spm=" +
                    this.spm +
                    "&refid=" +
                    this.refid
                );
                var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
                window.location.href = path;
            }
        },

        // 验证卡券是否领取
        hasGetCard: function () {
            var that = this;
            for (var i = 0; i < that.redlist.length; i++) {
                (function (j) {
                    var reqData1 = {
                        "OpenId": that.wxopenid,
                        "CardId": that.redlist[j].pcId,
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
            if (that.redlist[index].isGet || that.addClassFlag) {
                return
            }
            that.loading = true;
            var reqData = {
                "OpenId": that.wxopenid,
                "CardId": that.redlist[index].pcId,
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
                            that.showRedPop = true;
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
