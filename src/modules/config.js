/* global Monitor */
/* exported Config */
var Config = window.Config =  {};
(function () {
    var interFace = {
        type: {
            online: {
                "touch": "//m.ly.com",
                "cn": "//www.ly.com",
                "wx": "//wx.17u.cn",
                "crm": "//ccrm.17u.cn"
            },
            daily: {
                //"touch": "http://61.155.159.109:8038",
                "touch": "//mtest.t.ly.com",
                //"touch": "http://10.1.56.150",
                //"cn": "http://61.155.159.91:8302",
                "cn": "http://djtest.t.ly.com",
                "wx": "//wx.t.17u.cn",
                "crm": "//ccrm.t.17u.cn"
            },
            test: {
                "touch": "//10.14.40.49:7051",
                "cn": "//10.14.40.49:7051",
                "wx": "//wx.t.17u.cn",
                "crm": "//10.101.40.81:3003"
            },
            "dev": {
                "touch": "//10.1.56.133:2000",
                "cn": "//10.1.56.133:2000",
                "wx": "//wx.t.17u.cn",
                "crm": "//10.1.56.133:2000",
                "calendar": "//irondome.ly.com",
                "detail": "//m.ly.com"
            },
            publish: {
                "touch": "",
                "cn": "http://www.ly.com"
            }
        },
        list: {
            //列表页
            "list": "/dujia/json/queryHolidayJson?",
            // 订单列表页
            "orderlist": "/dujia/AjaxHelper/GetOrderInfoListForCRM?",
            //终页(详情页)
            "detail": "/dujia/AjaxHelper/TourDetailAjax?",
            //下单页
            "booking": "/dujia/json/bookingJson?",
            //联系人
            "contact": "/dujia/json/passengerJson?req=query",
            //日历
            "calendar": "/dujia/json/ToursJson?",
    
            //node站
            "nodeGetCommentList": "/intervacation/api/Comment/GetCommentList?",
            //node站日历
            "nodeGetCalendar": "/intervacation/api/CCalendar/GetTourCalendar?",
            //touch新版node渲染终页行程预览,航班
            "nodeDetailTravelCut":"/intervacation/api/TProductDetail/GetABTravelDateCutDetail?",
            //touch终页酒店信息
            "nodeFlyHotel":"/intervacation/api/TProductDetail/GetFlightHotelData?",
            //touch新版node渲染终页签证
            "nodeTouchDetailVisa":"/intervacation/api/TVisaInfo/GetVisaDetailForTouch?",
            //touch新版node渲染终页提交验证
            "nodeTouchTime":"/intervacation/api/TProductDetail/QueryProductConfigTime?",
            //touch新版node日历页
            "nodeGetCalendar": "/intervacation/api/TCalendar/GetTourCalendar?",
    
            //下单页获取优惠
            "bookingGetPreferential": "/intervacation/api/Preferential/GetDsfBookingPreferential",
            //百旅会验证
            "bookingValiBLH": "/dujia/ajaxhelper/GetBaiTravelNum",
            //下单页获取议价
            "bookingGetBargain":  "/dujia/HolidayJsonInfo/BargainQueryJson",
            
            //
            "configTime": "/dujia/json/QueryConfigTime?",

            "packageNoresult": "/dujia/json/queryHotDestination?",
            //热门到达城市
            "travelNoresult": "/dujia/json/queryHotTravelDestination?",
            //标签页列表
            "taglist": "/dujia/json/tagquery?",
            //出发城市
            //"depCity": "/dujia/visadata/dpcity",
            "depCity": "/dujia/json/getsrccitys",
            //城市选择页-出发
            "depCityLocate": "/ivacation/ajaxhelper/GetDepartCityList?",
            //城市选择页-目的地
            "destCityLocate": "/ivacation/ajaxhelper/GetTigInfoCityList?",
            //获取地图定位
            "gps": "/ivacation/ajaxhelper/GetMapResult?",
            //首页数据
            "homeData": "/dujia/chujingdata/gethomedata?",
            //到达城市
            //"arrcitys":"/dujia/chujingdata/getarrivecity",
            "arrcitys": "/dujia/json/getArrivalcitys?",
            //首页的幻灯片
            "slider": "/dujia/chujingdata/gethomeslide?",
            //出境卡页面的日历
            "cardCal": "/dujia/json/holidaycalendar?",
            //验证码
            "code": "/dujia/json/cardsecuritycode?",
            //卡激活
            "cardActive": "/dujia/json/registercard?",
            //有票卡激活
            "ypActive": "/dujia/json/registerttcard?",
            //出境卡激活for客服
            "cjActive": "/dujia/json/cctRegisterCJ?",
            //有票卡激活for客服
            "ttActive": "/dujia/json/cctRegisterTT?",
            //下单接口
            "cardBooking": "/dujia/json/bookingcard?",
            //cct下单接口
            "cctBooking": "/dujia/json/cctbookingcard?",
           
            //爱旅卡的详情页
            "loveCardDetail": "/dujia/json/ailvdetail?",
            //爱旅卡的下单页
            //爱旅卡的列表页
            "loveCardList": "/dujia/json/ailvlist?",
            "temai": "/dujia/chujingdata/getholidaylisttest?",
            //验证登陆渠道
            "validatechannel": "/dujia/json/validatechannel",
            //众筹
            "zhongchou": "/dujia/AjaxActivity.aspx?",
            //新首页线路列表
            "newIndex": "/dujia/chujingdata/gethomeactivitydata?",

            //自助游的城市接口
            "travelDest": "/dujia/json/queryTravelDestination",
            //跟团游的城市接口
            "packageDest": "/dujia/json/queryPackageDestination",
            //touch全部的城市接口
            "allDest": "/dujia/json/queryAllDestination",
            //目的地页搜索接口
            "searchInfro": "/dujia/ajaxhelper/AutoComplete?",

            //分销平台登录接口
            "fxLogin": "/dujia/ajaxHelper/getLoginInfo?",
            //分销平台更新密码
            "fxUpdatePsw": "/dujia/ajaxHelper/updatepwd?",
            //分销获取M码列表
            "fxGetM": "/dujia/ajaxHelper/getMCode?",
            //分销生成M码
            "fxCreateM": "/dujia/ajaxHelper/createMCode?",
            //分销设置M码状态
            "fxSetMStatus": "/dujia/ajaxHelper/sendMCode?",
            //发送短信验证码
            "sendSms": "/dujia/ajaxHelper/sendnodevalidcode?",
            //验证短信验证码
            "validSms": "/dujia/ajaxHelper/securitycode?",
            //获取线索筛选条件
            "getFxFilter": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GETSORTCONDITION&",
            //获取线索筛选结果
            "getFxFilterResult": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GETTARENTORESOURSELIST&",
            //达人补贴获取线索筛选的结果
            "getFxFilterNewResult": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=QUERYDARENBUTIELIST&",
            //获取线路id加密actType
            "getactType": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GETENCRYPTIONURL&",
            //分销平台获取账户接口
            "getFenxiaoAccount": "/dujia/ajaxHelper/getaccountinfo?",
            //分销平台修改账户接口
            "updateAccount": "/dujia/ajaxHelper/updateaccountinfo?",
            //根据refid获取400电话接口
            "getCurrentRefId": "/dujia/AjaxHelper/GetRefidTelphone?",
            //详情页行程
            "LineTravelDate": "/dujia/json/LineTravelDateCutDetail?",
            //出境达人M码会员店我的线索详情接口
            "getMyClueDetail": "/dujia/AjaxHelper/GetMyClueDetail?",
            //搜索逻辑改进热门线路接口
            "gethotline": "/dujia/AjaxHelper/GetHotRemainLineList?",
            //get detail url by lineId and actId ...
            "GETENCRYPTIONURL": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GETENCRYPTIONURL&",
            //auto bind user code
            "BindPromoCodeDetail": "/dujia/ajaxhelper/BindPromoCodeDetail?",
            //activate code
            "BindMemberInviteCode": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=BINDMEMBERINVITECODE&",
            //activate code bind in touch web
            "BindMemberInviteCodeNew": "/dujia/AjaxHelper/BindMemberInviteCode?",
            //DaRenBuTie Search Url
            "DaRenBuTieSearch": "/dujia/ajaxhelper/GetQueryActivityProductLists?",
            //DaRenBuTie Search List Filter Url
            "DaRenBuTieSearchFilter": "/dujia/ajaxhelper/GetDaRenMoreLineFilter?",
            //达人跑马灯
            "getDRMarquee": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GetTalentPaoMaDengDetail",
            //得到我的线索的相关数据
            "BindMyClueCode": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=GETTARENTOCLUELIST&",
            //得到我的奖金的相关数据
            "BindMyMoneyCode": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=GetTalentBounsAccountDetail&",
            //提交线索和模糊线索
            "BindCommitClueCode": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=",
            //达人修改会员名
            "ModifyMemberName": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=CHANGEMEMBERINFO&",
            //达人获取会员名
            "GetClueMemberInfo": "/dujia/ajaxhelper/PrickGoldFingerHandler.ashx?action=GetClueMemberInfo&",
            //列表对比
            "Querylinelist": "/dujia/ajaxhelper/Querylinelist",
            //添加收藏
            "AddFavourite": "/dujia/ajaxhelper/AddFavourite",
            //是否收藏
            "IsFavourite": "/dujia/ajaxhelper/IsFavourite",
            //达人获取首页列表
            "GetHeadList": "/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=QUERYCLUEACTIVITYLIST&",
            //出境达人M码会员店我的线索详情接口
            "getMyClueCancelDetail": "/dujia/AjaxHelper/CancelClue?reason=用户自己取消&",
            //分销登陆退出
            "UserLogout": "/dujia/ajaxHelper/UserLogout",
            //M达人微信推销接口
            "WXBindApply": "/dujia/ajaxhelper/BindMemberCode?",
            //touch标签页出发城市
            "DepCitys": "/dujia/intervacationlabel/getdepartcityresult?querytype=0",
            //touch标签页筛选面板
            "tagFilter": "/dujia/intervacationlabel/getfilterresult?isopen=true",
            //touch站获取标签连接
            "tagLink": "/dujia/intervacationlabel/searchresult",
            //touch标签页数据
            "tagList": "/dujia/intervacationlabel/getlablelistresult",
            //touch标签页筛选数据
            "tagFilterList": "/dujia/intervacationlabel/getproductlistresult",
            //发送验证码
            "sendCode": "/dujia/ajaxhelper/WeChatCodeMessageResult",
            //验证微信
            "checkWeChatCode": "/dujia/ajaxhelper/CheckWeChatCode?",
            //绑定M码
            "WeChatBindMCode": "/dujia/ajaxhelper/WeChatBindMCode?",
            //"获取微信签名"
            "getWeChatSign": "/dujia/ajaxhelper/GetSha1Sign?",
            //获取M会员推荐产品列表
            "getRecommendClueLines": "/dujia/ajaxhelper/GetRecommendClueLines?",
            "getCalendar": "/dujia/AjaxHelper/GetTourCalender?",
            //获取各个版本余位信息
            "getContinentSurplusSummary": "/dujia/ajaxhelper/GetContinentSurplusSummary",
            //余位筛选
            "getLineSurplusSummary": "/dujia/ajaxhelper/GetLineSurplusSummary?",
            //余位详情
            "getSurplusPosition": "/dujia/ajaxhelper/GetSurplusPosition?",
            //set vip佣金
            "vipBoundSet": "/dujia/ajaxhelper/VipBoundSet?",
            //get vip佣金
            "getvipboundset": "/dujia/ajaxhelper/Getvipboundset?",
            //crm 验证工号密码
            "SendValidationCode": "/common/SendValidationCode?",
            //登录验证
            "checklogin": "/common/checklogin.html",
            //获取菜单
            "Getmenu": "/common/Getmenu.html"
        }
    },
        urlMode = /__([^_]+)__/.exec(location.href),
        mod = location.host === "crm.ly.com" ? "online" : window.__mod__,
        mod = (urlMode && urlMode[1]) || mod || "online";
    /**
     * @desc 获取接口配置
     * @param {string} type 接口类型
     * @param {string} [_mod=touch] 接口所在的站点,touch/cn
     * @param {string} host 如果有特殊的域名,则传入特殊的域名,如防抓
     * @returns {*}
     */
    Config.getInterface = function (type, _mod, host) {
        var sites = _mod || "crm",
            hosts = "";
        if (mod.indexOf("-") > -1) {
            var a = mod.split("-");
            if (sites === a[0]) {
                hosts = "http://" + a[1];
            }
        } else {
            var item = interFace.type[mod];
            if (!item) {
                Monitor.log(type + "的接口配置不存在", "interface");
            }
            hosts = item[sites];
            if (host && window.isFangZhua) {
                hosts = "http://" + host;
            }
        }

        return hosts + interFace.list[type];
    };
})(Zepto);

module.exports = Config;
