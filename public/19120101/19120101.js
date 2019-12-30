// 读取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) { //先查询cookie是否为空，为空就return ""
        c_start = document.cookie.indexOf(c_name + "="); //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1; //最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            c_end = document.cookie.indexOf(";", c_start); //其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end)) //通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return ""
}
// 设置cookie
function setCookie(name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}
// var wxopenid, wxName, wxHeadImg;

// 票型id：668703
// 红包数量：10
// 红包金额：59
// 领取时间：12.12-1.2
// 使用时间：12.12-1.2
// 红包名称：【粉丝狂欢节】水洞沟89元专属红包
// AP_AC3FUUPPCDF

// 红包使用规则：
// 1）该红包批次仅限“【粉丝狂欢节】水洞沟成人套票”在线支付景点使用；
// 2）红包仅可在同程旅游客户端使用，该红包不可与其他优惠叠加使用；
// 3）一个订单只能使用一个红包，仅限下单使用，不拆分、不提现，订单一经支付，红包不可退还；
// 4）支持同程旅游客户端V7.2及以上的版本使用；
// 5）具体抵扣金额及抵扣条件参见产品页面。 


// 粉丝狂欢节5元安慰红包：AP_AC3FUUPUDQP
// 5元景点红包
// 领取时间：12.12-1.2
// 使用时间：领取之后的7天   数量：5w

// 粉丝狂欢节5元助力红包：AP_AC3FUUPX6HA
// 5元景点红包
// 领取时间：12.12-1.2
// 使用时间：领取之后的7天   数量：5w
var __redlist = [
    { "type": "", "red": 3, "total": "专属红包", "isGet": false, "id": 44474, "pcId": "AP_AC3FUUPPCDF", "cardId": "pOCyauAWoiRcIHjSj5O4PGdQ3aSA" },
    { "type": "", "red": 5, "total": "助力红包", "isGet": false, "id": 44472, "pcId": "AP_AC3FUUPPCDF", "cardId": "pOCyauPrye9SEgSNrwwSEqU7Tdi8" },
    { "type": "", "red": 10, "total": "安慰红包", "isGet": false, "id": 44473, "pcId": "AP_AC3FUUPPCDF", "cardId": "pOCyauJqNJl5PHG_yM6kTHnynbg8" }
]

var AppInfo = {
    userID: null
};
var vm = new Vue({
    el: '#app',
    data: {
        isTc: (/tctravel/i).test(navigator.userAgent),
        isWx: (/MicroMessenger/i).test(navigator.userAgent),
        isxcx: false,
        isShare: false,
        ishasact: false, //是否助力
        issharewx: false,
        // userid=37421349&nickName=seYao_O&level=1
        // memberId: '37421349',
        memberId: '',
        sopenid: '', // 分享者的
        smemberId: '',
        wxopenid: '',
        wxunionid: '',
        wxName: '',
        wxHeadImg: '',
        isSelf: false, // 是否是自己
        isEnd: false, //活动是否结束
        sid: '',
        stitle: '',
        sectionData1: [],
        redlist: __redlist,
        redobj: null,
        helpPcGet: false,
        helpGet: false,
        pcTpye: 0, // 0-领取红包  1-助力红包  2-安慰红包
        pcPrice: 0,
        hasPcRed: true, // 红包是否领完
        pcId: 'AP_AC3FUUPPCDF', // 红包批次号
        comfortId: 'AP_AC3FUUPPCDF', // 安慰红包批次号
        helpId: 'AP_AC3FUUPPCDF', // 助力红包批次号
        needFirendHelp: 8, // 需几个好友助力
        helpPeopleCount: 0, // 已助力几次
        progress: 0,
        helpList: [], //助力列表
        txtDialogCont: '',
        txtDialogShow: false,
        ObjId: '', //活动id
        endTime: '2020/3/1 23:59:59',
        leadShare: false, // 是否展示引导分享
    },
    created: function () {
        var that = this;
        var AppNewSpm = getQueryString("tcwebtag");
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

                that.getWxInfor();

            },
            init: function (id) {
                setRefId({
                    isAjaxGetRef: true, //是否需要异步获取refid【默认false】
                    ChannelID: id, //频道ID【isAjaxGetRef为true时必传】
                    isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
                    uTagName: ".both a", //需要自动添加refid的类名【可不传，默认所有a】
                    tagValue: "href" //需要自动添加refid的元素属性【可不传，默认a标签的href】
                });
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
                // that.getWechat()
            }
            allInit.init(44302);
            // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
            if (that.memberId) {
                that.isGetHB()
            }
        });
        
    },
    watch: {

    },
    methods: {
        isEndFn: function () {
            var that = this;
            $.ajax({
                url: "/scenery/AjaxHelper/AjaxCall.aspx",
                data: "action=GetServerDateTime",
                dataType: "text",
                success: function (data) {
                    var nowTime = data.replace(/-/g, '/');
                    if (new Date(nowTime).getTime() >= new Date(that.endTime).getTime()) { //结束
                        that.isEnd = true;
                    } else {
                        that.getPara();
                    }
                }
            })
        },
        getPara: function () {
            var that = this;
            var fri = getQueryString("param") ? decodeURIComponent(getQueryString("param")) : '';
            if (fri) { //有分享参数
                that.isShare = true;
                var aa = fri.substring(1, fri.length - 1);
                var bb = aa.split(",");
                that.ObjId = bb[0];
                that.sopenid = bb[1] || '';
                that.smemberId = bb[2] || '';
                that.getshare();
            }
            that.publicAjax('44435', 1, '', 1, 1);
            that.isSelf = that.smemberId == that.memberId
            that.ajaxfn();
        },

        //微信套头
        getWxInfor: function () {
            // cookie中是否有微信openid
            var isshare = getQueryString('isshare') ? getQueryString('isshare') : '';
            var wxopenid = getCookie('wxOpenid') ? getCookie('wxOpenid') : '';
            var wxparam = getQueryString("wxparam") ? decodeURIComponent(getQueryString("wxparam")) : ''
            // console.log('-------', decodeURIComponent(getQueryString("param")))
            if (!isshare) {
                this.isEndFn();
                return;
            }
            if (this.isWx) {
                var URLArgues = wxparam ? JSON.parse(wxparam) : '';
                if (!URLArgues) {
                    // 微信头链接跳转
                    var link = encodeURIComponent('https://www.ly.com/scenery/zhuanti/ningxiathshare?isshare=1&param=' + getQueryString('param'));
                    var shareLink = 'https://wx.17u.cn/wl/api/redirect?redirect_uri=' + link;

                    window.location.href = shareLink;
                } else {
                    //微信数据获取

                    var wxopenid = URLArgues.openid;
                    var wxName = URLArgues.nickname;
                    var wxHeadImg = URLArgues.headimgurl;
                    setCookie('wxName', wxName, 30);
                    setCookie('wxOpenid', wxopenid, 30);
                    setCookie('wxHeadImg', wxHeadImg, 30);
                    this.wxopenid = URLArgues.openid;
                    this.wxunionid = URLArgues.unionid;
                    this.wxName = wxName;
                    this.wxHeadImg = wxHeadImg;

                    /*进页面，是否结束-》是否是分享页-》是否登陆-》当前的状态*/
                    this.isEndFn();
                }
                return;
            }
            if (wxopenid) {
                this.wxName = getCookie('wxName');
                this.wxHeadImg = getCookie('wxHeadImg');

                /*进页面，是否结束-》是否是分享页-》是否登陆-》当前的状态*/
                this.isEndFn();
                return;
            }
            if (wxparam) {
                var URLArgues = wxparam ? JSON.parse(wxparam) : '';
                if (URLArgues) {
                    //微信数据获取

                    var wxopenid = URLArgues.openid;
                    var wxName = URLArgues.nickname;
                    var wxHeadImg = URLArgues.headimgurl;
                    setCookie('wxName', wxName, 30);
                    setCookie('wxOpenid', wxopenid, 30);
                    setCookie('wxHeadImg', wxHeadImg, 30);
                    this.wxopenid = URLArgues.openid;
                    this.wxunionid = URLArgues.unionid;
                    this.wxName = wxName;
                    this.wxHeadImg = wxHeadImg;

                    /*进页面，是否结束-》是否是分享页-》是否登陆-》当前的状态*/
                    this.isEndFn();
                    return;
                }
            }
            // if ((!wxopenid) || wxparam) {
            //     var URLArgues = wxparam ? JSON.parse(wxparam) : '';
            //     if (!URLArgues) {
            //         // 微信头链接跳转
            //         var link = encodeURIComponent('https://www.ly.com/scenery/zhuanti/ningxiathshare?isshare=1&param=' + getQueryString('param'));
            //         var shareLink = 'https://wx.17u.cn/wl/api/redirect?redirect_uri=' + link;

            //         window.location.href = shareLink;
            //     } else {
            //         //微信数据获取
            //         this.wxopenid = URLArgues.openid;
            //         this.wxunionid = URLArgues.unionid;
            //         var wxopenid = URLArgues.openid;
            //         var wxName = URLArgues.nickname;
            //         var wxHeadImg = URLArgues.headimgurl;
            //         setCookie('wxName', wxName, 30);
            //         setCookie('wxOpenid', wxopenid, 30);
            //         setCookie('wxHeadImg', wxHeadImg, 30);

            //         /*进页面，是否结束-》是否是分享页-》是否登陆-》当前的状态*/
            //         this.isEndFn();
            //     }
            // } else {
            //     wxName = getCookie('wxName');
            //     wxHeadImg = getCookie('wxHeadImg');

            //     /*进页面，是否结束-》是否是分享页-》是否登陆-》当前的状态*/
            //     this.isEndFn();
            // }
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
        publicAjax: function (mdId, index, onProvId, pageIndex, pageSize) {
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
                        // callBackFn && callBackFn(data)
                        var list = data.List.slice(0, 1);
                        var summarys = list[0].Summary.split('|')
                        list[0].Summary = summarys[0]
                        that.stitle = list[0].SceneryName
                        that.pcPrice = summarys[2]
                        console.log(summarys)
                        that['sectionData' + index] = list;
                    } else {
                        that['sectionData' + index] = '';

                    }
                    console.log(that['sectionData' + index])
                },
                complete: function () { }
            })
        },

        getshare: function () {
            var that = this;
            /* 分享 */
            shareTitle = "全民砍价1块钱游宁夏";
            shareUrl = "https://www.ly.com/scenery/zhuanti/ningxiathshare?isshare=1&param={" + that.ObjId + "," + that.sopenid + "," + that.smemberId + "}";
            shareDesc = "惊喜大放价，相约去宁夏，宁夏全民粉丝月12.12开启狂欢！";
            setShareFun.changeShareInfo();
        },

        //立即分享
        shareAct: function () {
            var that = this;
            // 展示引导页
            this.leadShare = true;

            /* 分享 */
            shareTitle = "全民砍价1块钱游宁夏";
            shareUrl = "https://www.ly.com/scenery/zhuanti/ningxiathshare?isshare=1&param={" + that.ObjId + "," + that.sopenid + "," + that.smemberId + "}";
            shareDesc = "惊喜大放价，相约去宁夏，宁夏全民粉丝月12.12开启狂欢！";
            setShareFun.changeShareInfo();
        },

        //所以异步
        ajaxfn: function () {
            switch (this.sid) {
                case '' + this.redlist[0].id:
                    this.redobj = this.redlist[0];
                    break;
                case '' + this.redlist[1].id:
                    this.redobj = this.redlist[1];
                    break;
            }
            console.log(this.sid, this.redlist)
            if (this.isShare) {
                this.progressfn();
            }

        },
        //助力列表  助力进度
        progressfn: function () {
            var that = this;
            $.ajax({
                url: '/Scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
                data: 'action=GETACTIVITIESDZLIST&ActivitiesName=tcjq201912011&top=10&MemberId=0&ObjId=' + that.ObjId + '&WxOpenid=' + that.wxopenid,
                dataType: 'json',
                success: function (data) {
                    var count = that.needFirendHelp;
                    if (data && data.length) {
                        if (data.length > count) {
                            data = data.splice(0, count);
                            that.helpPeopleCount = count;
                        } else {
                            that.helpPeopleCount = data.length;
                            data.length = count;
                        }
                        that.helpList = data;

                        //判断是否助力过
                        that.helpList.forEach(element => {
                            if (encodeURIComponent(element.MemberName) == encodeURIComponent(that.wxName)) {
                                that.ishasact = true;
                            }
                        });
                    } else {
                        that.helpList = new Array(count);
                    }
                }
            })
        },

        //获取发起活动id
        ObjIdfn: function () {
            var that = this;
            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
                data: 'action=GETACTIVITIES&ActivitiesName=tcjq201912011&MemberId=' + that.memberId + '&OpenId=' + that.wxopenid + '&UnionId=' + that.wxunionid,
                dataType: "json",
                success: function (data) {
                    if (data.State == 2 || data.State == 3) {
                        //已参加
                        that.ObjId = data.Id;
                        // that.progressfn();
                        // callBackFn && callBackFn(data.Id)
                        that.popFn('发起成功~');
                        window.location.href = "https://www.ly.com/scenery/zhuanti/ningxiathshare?param={" + that.ObjId + "," + that.sopenid + "," + that.smemberId + "}";
                    }
                }
            })
        },
        //立即助力
        gotohelp: function () {
            if (!this.memberId) {
                // 登录
                if (AppInfo.isAPP) {
                    window.location.href = "tctclient://web/loginrefresh";
                } else {
                    window.location.href =
                        '//passport.ly.com/m/login.html?returnUrl=' +
                        encodeURIComponent(window.location.href)
                }
                return
            }
            var that = this;
            $.ajax({
                url: '/Scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
                data: 'action=GETACTIVITIESDZ&ActivitiesName=tcjq201912011&WxOpenid=' + that.wxopenid + '&WXName=' + encodeURIComponent(that.wxName) + '&ObjId=' + that.ObjId + '&Code=' + that.wxHeadImg,
                dataType: 'json',
                success: function (data) {
                    if (data.State == 4) {
                        that.ishasact = true;
                        that.helpList.unshift({
                            "Code": that.wxHeadImg,
                            "Id": "",
                            "Type": "无",
                            "Date": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                            "ObjId": that.ObjId,
                            "MemberName": that.wxName,
                        });
                        that.helpList.length = that.needFirendHelp;
                        that.helpPeopleCount = that.helpPeopleCount + 1;
                        that.getHb(that.helpId, 1)
                    } else if (data.State == 3) {
                        //已经助力过了
                        that.ishasact = true;
                        that.popFn('已经帮好友砍价了，快去参加活动吧~');
                    } else { }
                }
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
        // 判断是否需要登陆
        checkLogin: function (pcId, type) {
            if (this.memberId) {
                this.getHb(pcId, type)
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
        /**
         * 红包部分
         */

        // 判断之前有没有领过红包
        isGetHB: function () {
            var that = this, batchS = []
            that.loading = true
            //红包批次号;
            // that.redlist.forEach(function (item, index) {
            //     batchS.push(item.pcId)
            // })
            batchS.push(that.pcId)

            $.ajax({
                url: '/scenery/AjaxHelper/ZhuanTiHelp/ThematicIntegration.aspx',
                data: 'action=GETHONGBAOBOOL&BatchNo=' + batchS.join() + '&memberid=' + that.memberId,
                dataType: 'json',
                success: function (data) {
                    // 未找到相关信息
                    if (data && data.length) {
                        // 已领过红包
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < batchS.length; j++) {
                                if (data[i].BatchNo == batchS[j]) {
                                    that.helpPcGet = true
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
        getHb: function (pcId, type) {
            var that = this;
            // if (that.helpGet) return
            that.loading = true;

            $.ajax({
                url: '/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
                data: 'action=GETSPMHONGBAO&New=1&ChannelID=' + that.redlist[type].id + '&MemberId=' + that.memberId,
                dataType: 'json',
                success: function (data) {
                    // 发送成功
                    if (data && data.State == 6) {
                        // 领取成功
                        that.helpGet = true;
                        that.redlist[type].isGet = true;
                        that.pcTpye = type
                        // that.popFn('领取成功')
                    } else if (data && data.State == 4) {
                        // 发送过了
                        that.helpGet = true;
                        that.redlist[type].isGet = true;
                        that.pcTpye = type
                        that.popFn('已经领取过红包了哦')
                    } else {
                        that.popFn(data.Magess)
                        if (type == 0) {
                            that.hasPcRed = false
                        }
                    }
                },
                complete: function () {
                    that.loading = false;
                }
            })
        },
        // 文本提示框
        dialogBox: function (txt) {
            var that = this;
            that.txtDialogCont = txt;
            that.txtDialogShow = true;
            setTimeout(function () {
                that.txtDialogShow = false;
            }, 1500)
        },
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        }
    }
})
