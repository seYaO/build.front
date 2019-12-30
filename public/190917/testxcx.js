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
        var localDataStr = sessionStorage.getItem("localData_tejia") || "{}",
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
            sessionStorage.setItem("localData_tejia", JSON.stringify(_localData));
        };
    }
};
Activity.initSaveEvent();

// 初始化进来判断是否客户端
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
        memberId: '',
        addHtml: '',
        refid: '',
        spm: '',
        loading: false,
        provAjaxList: '',
        moreProvAjaxList: '',
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        showProvList: false,
        sectionData1: [],
        sectionData2: [],
        sectionData3: [],
        sectionData4: [],
        sectionData: [],
        redlist: [{
            price: 3,
            priceImgUrl: '//img1.40017.cn/cn/s/2019/zt/touch/211057/price_3.png', //红包金额
            text: '满59元可用', //满多少元可以用
            id: 41048, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauL2BJ7lQA1ngKrXdge0ecQI' //红包批次号
        }, {
            price: 5,
            priceImgUrl: '//img1.40017.cn/cn/s/2019/zt/touch/211057/price_5.png', //红包金额
            text: '指定产品可用', //满多少元可以用
            id: 41049, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauMsg0FypBg_QJNOp_9e0S24' //红包批次号
        }, {
            price: 10,
            priceImgUrl: '//img1.40017.cn/cn/s/2019/zt/touch/211057/price_10.png', //红包金额
            text: '指定产品可用', //满多少元可以用
            id: 41050, //红包id
            isGet: false, //是否已领取
            pcId: 'pOCyauPTwBKrsf5O8ufJ2lBAIOtY' //红包批次号
        }],
        leadShare: false, // 是否展示引导分享
        tabIndex: 0,
        titleImgUrl: '',

        wxopenid: '',
        wxunionid: '',

        days: '00', //抢购时间点
        hours: '00',
        minutes: '00',
        seconds: '00',
        cdTXT: '距抢购开始剩',
        nowTime: '',
        timer: null,

        ajaxCount: 0,
        moreBtn1: 6,
        moreBtn2: 6,
        newQGlist: [], //抢购tab列表
        qgTabIndex: 0, //抢购
        bkTabIndex: 0, //爆款
        newBKlist: [],

        cityResource: true,//火车票交叉时使用，页面只呈现链接中传递城市（cid）资源，不展示身份城市选择模块，防止闪动，默认隐藏
    },
    created: function () {
        this.init()
    },
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
                allInit.init(42952)
            })
        },
        //获取链接参数
        getPara: function () {
            var URLArgues = "";
            if (getQueryString("wxparam")) {
                URLArgues = JSON.parse(
                    decodeURIComponent(getQueryString("wxparam"))
                );
            }
            this.refid = getQueryString("refid") ?
                getQueryString("refid") :
                '';
            this.spm = getQueryString("spm") ? getQueryString("spm") : '';
            this.wxopenid = URLArgues.openid;
            this.wxunionid = URLArgues.unionid;
            this.cid = getQueryString("cid") || 0;
            if (this.cid) {
                this.cityResource = true;
                this.allAjax('40792', 3, 0, 1, 50);//id, index, onProvId, pageIndex, pageSize
                this.initData();
            } else {
                // 定位
                this.cityResource = false;
                this.loactionFn();
            }
            this.hasGetCard();
            this.setShare();
        },
        //数据初始化
        initData: function () {
            // 爆款
            this.allAjax('40791', 2, this.onProvId, 1, 50)
            // 抢购
            this.seckList()
        },
        //小程序分享
        setShare: function () {
            var that = this;
            var spm = that.spm;
            var refid = that.refid;
            var url = '';
            var path = '';
            var tit = '';
            var img = '';
            url = encodeURIComponent(
                "https://www.ly.com/scenery/zhuanti/tejiaxcx?spm=" + spm + "&refid=" + refid
            );
            path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
            tit = '门票特卖，省钱玩转周边>>';
            img = 'http://img1.40017.cn/cn/s/2019/zt/touch/211277/sharexcx.jpg';
            wx.miniProgram.postMessage({
                data: {
                    shareInfo: {
                        currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                        title: tit,
                        path: path, //默认当前页面路径
                        imageUrl: img //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                    }
                }
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
                    /(.png|.jpg|.jpeg|.gif|.PNG|.JPG|.JPEG|.GIF)/,
                    '_' + wid + 'x' + hei + '_00' + /(.png|.jpg|.jpeg|.gif|.PNG|.JPG|.JPEG|.GIF)/.exec(img)[0]
                ) :
                img
        },
        // 去首页
        goHome: function () {
            wx.miniProgram.switchTab({
                url: "/page/home/index/index"
            });
        },
        qgGoDetail: function (SceneryId, type, surplusStocks) {
            if ((type == 2 || type == 3) && surplusStocks != 0) {
                //景点跳转
                wx.miniProgram.navigateTo({
                    url: "/page/scenery/sceneryDetail/sceneryDetail?sid=" +
                        SceneryId +
                        "&spm=" +
                        this.spm +
                        "&refid=" +
                        this.refid
                });
            }
        },
        goBook: function (SceneryId, ticketId) {
            //景点跳转
            wx.miniProgram.navigateTo({
                url: '/page/scenery/order/order?sid=' + SceneryId + '&priceid=' + ticketId + "&spm=" + this.spm + "&refid=" + this.refid
            });
        },
        //去详情页
        jumpDetail: function (item) {
            var spm = this.spm;
            var refid = this.refid;
            //景点跳转
            wx.miniProgram.navigateTo({
                url: "/page/scenery/sceneryDetail/sceneryDetail?sid=" +
                    item +
                    "&spm=" +
                    spm +
                    "&refid=" +
                    refid
            });
        },
        recommend: function (SceneryId, index) {
            return AppInfo.isAPP ?
                'tctclient://scenery/detail?sceneryId=' + SceneryId + '&wvc1=1&wvc2=1&v300v5.40789.40789.' + (index + 1) + 'v' + this.addHtml :
                this.isWx ?
                    '//wx.17u.cn/scenery/scenerydetail_' + SceneryId + '_0_0.html?spm=5.40789.40789.' + (index + 1) + this.addHtml :
                    '//m.ly.com/scenery/scenerydetail_' + SceneryId + '.html?spm=5.40789.40789.' + (index + 1) + this.addHtml
        },
        //省份定位
        loactionFn: function () {
            var that = this;
            if (!localData.onProvId) {
                if (AppInfo.isAPP) {
                    // 客户端获取省份
                    var cityId = AppInfo.cityID
                    $.ajax({
                        url: '/scenery/AjaxHelper/AjaxCall.aspx',
                        data: 'action=GetProAndCity&cityId=' + cityId,
                        dataType: 'json',
                        success: function (data) {
                            that.onProvId = data.proId
                            that.onProvName = data.proName
                            that.provListFn()
                        },
                        error: function (e) {
                            /*报错显示列表第一个省江苏*/
                            that.onProvId = 16
                            that.onProvName = '江苏'
                            that.provListFn()
                        }
                    })
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
            } else {
                that.provListFn()
            }
        },
        //置顶
        linkListFixed: function () {
            var that = this
            var fixBoxTop = $('.fix-box').offset().top;
            this.tabTop = $('#tab').offset().top;
            $(window).on('scroll', function () {
                var windowH = document.documentElement.scrollTop || document.body.scrollTop;
                if (windowH < fixBoxTop) {
                    $('#provBox').removeClass('fixed')
                } else {
                    $('#provBox').addClass('fixed')
                }

                // tab
                var fixClassName = that.cityResource ? 'fixed2' : 'fixed1';
                if (windowH < that.tabTop) {
                    $('#tab').removeClass(fixClassName)
                } else {
                    $('#tab').addClass(fixClassName)
                }
            })
        },
        //省份列表调取
        provListFn: function () {
            var that = this
            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/ZhuanTiJsp.aspx',
                data: 'action=GETSPMSCENERYJSP&PageIndex=1&PageSize=100&px=5&cp=1&ChannelID=40791',
                dataType: 'json',
                success: function (data) {
                    if (data && data.ProvinceList && data.ProvinceList.length > 0) {
                        var list = JSON.parse(JSON.stringify(data));
                        if (list.ProvinceList && list.ProvinceList.length > 5) {
                            that.provAjaxList = list.ProvinceList.splice(0, 5);
                            that.moreProvAjaxList = list.ProvinceList;
                        } else {
                            that.provAjaxList = list.ProvinceList;
                        }
                        // 如果列表中没有定位到的省份
                        var hasProvLocal = false
                        for (var i = 0; i < data.ProvinceList.length > 0; i++) {
                            if (that.onProvId == data.ProvinceList[i].ProvinceId) {
                                hasProvLocal = 'true'
                                that.onProvName = data.ProvinceList[i].ProvinceName
                            }
                        }
                        if (!hasProvLocal) {
                            that.onProvId = 16
                            that.onProvName = '江苏'
                        }
                    }

                    //时令推荐 tab
                    that.allAjax('40792', 3, 0, 1, 50);//id, index, onProvId, pageIndex, pageSize
                    that.initData();
                }
            })
        },
        //点击切换省份
        clickChangeProv: function (id, name, cid, nid) {
            if (id != this.onProvId) {
                this.onProvId = id
                this.onProvName = name
                this.showProvList = false
                this.sectionData1 = [];
                this.sectionData2 = [];
                this.sectionData4 = [];
                this.moreBtn1 = 6;
                this.moreBtn2 = 6;
                this.newQGlist = [];
                this.newBKlist = [];
                this.qgTabIndex = 0;
                this.bkTabIndex = 0;

                this.tabChange(this.sectionData3[this.tabIndex].Summary, this.tabIndex)
                this.initData()
            }
        },
        //蒙层
        popFn: function (txt) {
            $('.showErr').html(txt)
            $('.showErrBox').show()
            setTimeout(function () {
                $('.showErr').html('')
                $('.showErrBox').hide()
            }, 2000)
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
                    (that.cid ? '0' : onProvId) +
                    '&CityId=' +
                    (mdId == '40792' && that.cid ? '0' : that.cid),
                // that.cid ? (mdId == '40792' ? '0' : that.cid) : '0', // 链接传cid的时候，判断mdId == '40792'，此时省份城市都不传
                dataType: 'json',
                success: function (data) {
                    if (data && data.List && data.List.length > 0) {
                        callBackFn && callBackFn(data.List)
                    } else {
                        that['sectionData' + index] = '';
                    }
                },
                complete: function () { }
            })
        },
        // 资源异步
        allAjax: function (id, index, onProvId, pageIndex, pageSize) {
            var that = this
            that.publicAjax(
                id,
                index,
                onProvId,
                function (data) {
                    if (index == 3) {
                        data.forEach(function (element) {
                            element.star = new Array(Number(element.Summary) || 0);
                        });
                    }

                    if (index == 2 && data.length > 0) {
                        data.forEach(function (el, index) {
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
                        data = that.newBKlist[0].list;
                    }

                    that['sectionData' + index] = data;

                    if (index == 3 && data.length > 0) {
                        that.titleImgUrl = data[0].SceneryImg;
                        if (data.length > 1) {
                            that['sectionData' + index] = data.splice(1);
                            // console.log(111)
                            that.tabChange(that.sectionData3[that.tabIndex].Summary, that.tabIndex)
                        }
                    }
                },
                pageIndex,
                pageSize
            )
        },
        getLabel: function (labelList) {
            var that = this;
            var LabelName = '';
            if (labelList && labelList.length > 0) {
                labelList.forEach(function (element) {
                    if (/^21009\d+/.test(element.LabelID)) {
                        LabelName = '卡券可用'
                    }
                });
            }
            return LabelName;
        },
        //链接跳转
        getLink: function (kurl, wurl, murl) {
            return AppInfo.isAPP ?
                kurl + this.addHtml :
                this.isWx ?
                    wurl + this.addHtml :
                    murl + this.addHtml
        },

        tabChange: function (id, index) {
            if (/\d+\|\d+/.test(id)) {
                id = id.replace(/\|/g, ',');
            }
            this.tabIndex = index;
            this.recommendData(id);
        },

        // 推荐
        recommendData: function (ClyId) {
            var that = this;
            var reqData = {
                "clientType": AppInfo.isAPP ? 7 : 1,
                "PageIndex": 1,
                "PageCount": 30,
                "Search": {
                    "ClyId": ClyId,
                    "CityId": that.cid || 0,
                    "ProID": that.cid ? 0 : that.onProvId,
                    "ExtensionProId": that.onProvId,
                    "SortStr": "0",
                    "ChId": 2,
                    "PfId": 10,
                    "KeyWord": ""
                },
            }
            $.ajax({
                url: WL_URL_TEST('https://' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/ScenerySearch', reqData),
                data: reqData,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data && data.Body && data.Body.BookingModel && data.Body.BookingModel.length > 0) {
                        that.sectionData4 = data.Body.BookingModel;
                    } else {
                        that.sectionData4 = '';
                    }
                },
                complete: function () {
                    //吸顶
                    that.$nextTick(function () {
                        setTimeout(function () {
                            that.linkListFixed();
                        }, 1000)
                    })
                }
            })
        },
        /**
         * 红包模块
         */

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
            that.addClassFlag = true;
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
                            that.redlist[index].isGet = true;
                            that.popFn('领取成功，可至“微信--我--支付--火车票机票--我的--代金券”中查看！')
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
                complete: function (data) {
                    that.addClassFlag = false;
                }
            });
        },

        bkChangeTab: function (index) {
            if (index != this.bkTabIndex) {
                this.bkTabIndex = index;
                this.sectionData2 = this.newBKlist[this.bkTabIndex].list;
                this.moreBtn2 = 6;
                this.tabTop = $('#tab').offset().top;
            }
        },
        qgChangeTab: function (index) {
            if (index != this.qgTabIndex) {
                this.qgTabIndex = index;
                this.sectionData1 = this.newQGlist[this.qgTabIndex].list;
                this.moreBtn1 = 6;
                this.tabTop = $('#tab').offset().top;
                if (this.sectionData1 && this.sectionData1.length > 0) {
                    this.countDownFn();
                }
            }
        },
        clickMore(type) {
            if (type == 1) {
                this.moreBtn1 = 50
            } else {
                this.moreBtn2 = 50
            }
            var that = this;
            this.$nextTick(function () {
                that.tabTop = $('#tab').offset().top;
            })

        },
        // 抢购
        seckList: function () {
            var that = this;
            that.sectionData1 = [];
            var reqData = {
                "IsNeedPlus": 0,
                "PageIndex": 1,
                "PageSize": 30,
                "Type": [2, 3],
                "ProvinceId": that.cid ? 0 : that.onProvId,
                "CityId": that.cid || 0,
                "clientType": AppInfo.isAPP ? 7 : 1
            }
            $.ajax({
                url: WL_URL_TEST('https://' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/GetScenerySeckillList', reqData),
                data: reqData,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data && data.Body && data.Body.length > 0) {
                        var SceneryIdArr = [];
                        data.Body.forEach(function (element) {
                            if (element.SeckillInfoList && element.SeckillInfoList.length > 0) {
                                that.nowTime = element.ServiceDate;
                                element.SeckillInfoList.forEach(function (el, index) {

                                    // 去重（相同景区id只保留第一个）
                                    var hasSceneryId = false;
                                    if (SceneryIdArr && SceneryIdArr.length > 0) {
                                        for (var j = 0; j < SceneryIdArr.length; j++) {
                                            if (SceneryIdArr[j] == el.SceneryId) {
                                                hasSceneryId = true;
                                            }
                                        }
                                    }

                                    if (el && !hasSceneryId) {
                                        el.type = element.Type; //1已结束，2进行中，3即将开始

                                        if (index == 0 && that.newQGlist.length == 0) {
                                            that.newQGlist.push({
                                                "cityName": el.CityName,
                                                "list": [el]
                                            })
                                        } else {
                                            // 根据城市分组
                                            var hasCityName = false;
                                            if (that.newQGlist && that.newQGlist.length > 0) {
                                                for (var i = 0; i < that.newQGlist.length; i++) {
                                                    if (that.newQGlist[i].cityName == el.CityName) {
                                                        hasCityName = true;
                                                        that.newQGlist[i].list.push(el)
                                                    }
                                                }

                                                // 数组中没有就加入
                                                if (!hasCityName) {
                                                    that.newQGlist.push({
                                                        "cityName": el.CityName,
                                                        "list": [el]
                                                    })
                                                }
                                            }
                                        }

                                        SceneryIdArr.push(el.SceneryId);
                                    }
                                });
                            }
                        });

                        // 默认展示第一个tab资源
                        if (that.newQGlist.length > 0) {
                            that.sectionData1 = that.newQGlist[0].list;
                        }

                        if (that.sectionData1 && that.sectionData1.length > 0) {
                            that.countDownFn();
                        }
                    }
                },
                complete: function () { }
            })
        },
        /* 倒计时开始 */
        // 倒计时
        countDownFn: function () {
            var that = this;
            var ms = 1000;
            this.timer && clearInterval(this.timer);
            this.timer = setInterval(function () {
                that.timeFn(ms);
            }, ms)
            that.timeFn(0);
        },

        timeFn: function (ms) {
            var that = this;
            var nowTime = new Date(that.nowTime.replace(/-/g, '/')).getTime() + ms;
            that.nowTime = that.getDate(nowTime);
            that.sectionData1.forEach(function (element, index) {
                var type = 0;
                var BeginTime = new Date(element.BeginTime.replace(/-/g, '/')).getTime();
                var EndTime = new Date(element.EndTime.replace(/-/g, '/')).getTime();
                if (nowTime > EndTime) {
                    //已结束
                    type = 1;
                } else if (nowTime > BeginTime) {
                    //抢购中
                    type = 2;
                    var newTimeArr = that.getDayNum(EndTime - nowTime);
                    var qgObj = {
                        cdTXT: '正在疯抢',
                        hours: newTimeArr[1],
                        minutes: newTimeArr[2],
                        seconds: newTimeArr[3]
                    };
                    Vue.set(that.sectionData1[index], 'qgObj', qgObj)
                } else {
                    // 抢购前
                    type = 3;
                    var todayDate = that.dateAddDay(that.nowTime.replace(/-/g, '/'), 1) + ' 00:00:00'; //明天的12点
                    var tomorrowDate = that.dateAddDay(that.nowTime.replace(/-/g, '/'), 2) + ' 00:00:00'; //明天的12点
                    var afterTomorrowDate = that.dateAddDay(that.nowTime.replace(/-/g, '/'), 3) + ' 00:00:00'; //后台的12点
                    if (new Date(todayDate).getTime() > BeginTime) {
                        // 今天
                        var time = that.getTime(element.BeginTime.replace(/-/g, '/'), 1);
                        var qgObj = {
                            cdTXT: '今天 ' + time + '开抢',
                        };
                    } else if (new Date(tomorrowDate).getTime() > BeginTime) {
                        // 明天
                        var time = that.getTime(element.BeginTime.replace(/-/g, '/'), 1);
                        var qgObj = {
                            cdTXT: '明天 ' + time + '开抢',
                        };
                    } else if (new Date(afterTomorrowDate).getTime() > BeginTime) {
                        // 后天
                        var time = that.getTime(element.BeginTime.replace(/-/g, '/'), 1);
                        var qgObj = {
                            cdTXT: '后天 ' + time + '开抢',
                        };
                    } else {
                        // 其他
                        var qgObj = {
                            cdTXT: that.getTime(element.BeginTime.replace(/-/g, '/'), 2) + '开抢',
                        };
                    }
                    Vue.set(that.sectionData1[index], 'qgObj', qgObj)
                }
                Vue.set(that.sectionData1[index], 'type', type)
            });
        },

        // 日期加n天
        dateAddDay: function (date, addNum) {
            var date = new Date(date);
            date.setDate(date.getDate() + addNum);
            return date.getFullYear() + '/' + this.formatNum(date.getMonth() + 1) + '/' + this.formatNum(date.getDate())
        },

        formatNum: function (num) {
            num = num < 10 ? "0" + num : num;
            return num;
        },
        getDayNum: function (newTime) {
            var dayNum = Math.floor(newTime / 1000 / 60 / 60 / 24);
            var hourNum = Math.floor(newTime / 1000 / 60 / 60 % 24);
            var mintNum = Math.floor(newTime / 1000 / 60 % 60);
            var secdNum = Math.floor(newTime / 1000 % 60);
            return [this.formatNum(dayNum), this.formatNum(hourNum), this.formatNum(mintNum), this.formatNum(secdNum)];
        },
        // 获取时间
        getTime: function (newTime, type) {
            var date = new Date(newTime);
            if (type == 1) {
                return this.formatNum(date.getHours()) + ':' + this.formatNum(date.getMinutes());
            } else {
                return this.formatNum(date.getMonth() + 1) + '月' + this.formatNum(date.getDate()) + '日 ' +
                    this.formatNum(date.getHours()) + ':' + this.formatNum(date.getMinutes());
            }
        },
        getDate: function (ms) {
            var date = new Date(ms);
            return date.getFullYear() + '/' + this.formatNum(date.getMonth() + 1) + '/' + this.formatNum(date.getDate()) + ' ' + this.formatNum(date.getHours()) + ':' + this.formatNum(date.getMinutes()) + ':' + this.formatNum(date.getSeconds());
        },
        cdList: function () {
            var that = this;

        },
    }
})





