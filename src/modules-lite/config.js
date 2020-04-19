/* global Monitor */
/* exported Config */
var Config = {};
(function() {
    var interFace = {
            type: {
                online:{
                    "touch":  "//m.ly.com",
                    "cn": "//www.ly.com"
                },
                daily: {
                    "touch": "//61.155.159.109:8038",
                    "cn": "//61.155.159.91:8302"
                },
                publish: {
                    "touch":  "",
                    "cn": "//www.ly.com"
                },
                "test":{
                    "touch":"//10.14.40.56:8085",
                    "cn":"//10.14.40.56:8085"
                },
                "lb":{
                    "touch":"//10.1.56.108:6800",
                    "cn":"//10.1.56.108:6800"
                },
                "wanlewxdaily":{
                    "touch":"//wx.t.17u.cn",
                    "cn":"//wx.t.17u.cn"
                },
                "yhz":{
                    "touch":"http://10.14.40.56:8083",
                    "cn":"//10.14.40.56:8083"
                },
                "wanlewxonline":{
                    "touch":"//wx.17u.cn",
                    "cn":"//wx.17u.cn"
                },
                "jyy":{
                    "touch":"//10.1.56.118:12306",
                    "cn":"//10.1.56.118:12306"
                },
                "lbtouch":{
                    "touch":"//10.1.56.108:7000",
                    "cn":"//10.1.153.149:7001"
                },
                "testtouch":{
                    "touch":"//10.14.40.56:8083",
                    "cn":"//10.14.40.56:8083"
                },
                "dailytouch":{
                    "touch": "//m.t.ly.com",
                    "cn": "//www.t.ly.com"
                },
                "dailyXiaoGu":{
                    "touch": "//ccrm.t.17u.cn",
                    "cn": "//ccrm.t.17u.cn"
                },
                "onlineXiaoGu":{
                    "touch": "//ccrm.17u.cn",
                    "cn": "//ccrm.17u.cn"
                },
                "wmg":{
                    "touch": "http://10.1.152.221:91",
                    "cn": "http://10.1.152.221:90"
                }
            },
            list: {
                //"微信玩乐终页"
                "getWXWLDetail": "/localfun/AjaxHelperWanLe/GetProductDetailModel?",
                //"微信玩乐列表页,玩乐首页，WIFI首页"
                "getWXWLList": "/localfun/AjaxHelperWanLe/GetWanLeSearchList?",
                //"微信订单详情页"
                "getWXWLOrderDetail": "/localfun/AjaxHelperWanLe/GetWanLeOrderSingleDetail?",
                //"微信wifi目的地城市列表"
                "getWXWLWifiDestCityList": "/localfun/AjaxHelperWanLe/GetLocalFunIndexDetail?",
                //"微信玩乐目的地城市列表"
                "getWXWLWanleDestCityList": "/localfun/AjaxHelperWanLe/GetLocalFunIndexDetail?",
                //"微信订单详情页支付"
                "getWXWLOrderDetailPay": "/localfun/AjaxHelperWanLe/WanLePayOrder?",
                //"微信详情页取消"
                "getWXWLCancelOrder":"/localfun/AjaxHelperWanLe/WanleCancelOrder?",
                //weixin站点评
                "getWXComment": "/localfun/ajaxhelperwanle/GetLocalFunComment?",
                //touch新版首页和城市列表页热卖产品
                "getWXHotProductsList": "/localfun/AjaxHelperWanLe/GetWanLeSearchListNew?stp=hot&start=1&sort=1&",
                //touch天气接口
                "getWXWeather":"/localfun/AjaxHelperWanLe/WeatherByCity?",

                //"touch站WIFI首页,玩乐首页,目的地城市列表页"
                "getWXWLIndex": "/localfun/AjaxHelperWanLe/GetLocalFunIndexDetail?",
                //touch站终页倒计时
                "getTouchDetailTimer": "/localfun/ajaxhelperwanle/GetLocalFunCommentTime?digitSign=eb2542ea86e0cfeb087ace5998e8d135&",
                //touch站点评
                "getTouchComment": "/localfun/ajaxhelperwanle/GetLocalFunComment?",
                //touch预定页获取价格日历
                "getTouchPriceCalendar":"/localfun/AjaxHelperWanLe/WanLeCalData?",
                //touch站预定页点击具体的价格
                "getTouchPriceCalendarDetail":"/localfun/AjaxHelperWanLe/SingleProductPriceType?",
                //touch站预定页提交信息
                "getTouchOrderSubmit":"/localfun/AjaxHelperWanLe/WanLeSubOrder",
                //touch列表页目的地
                "getTouchListDest": "/localfun/AjaxHelperWanLe/GetIndexDestination?",
                //touch站预定页编辑出游人，即详细出游人信息
                "getTouchTravelDetail":"/localfun/AjaxHelperWanLe/GetContanctList?",
                //touch站预定页新增出游人
                "getTouchTravelAdd":"/localfun/AjaxHelperWanLe/AddContanct",
                //touch预定页更新出游人信息
                "getTouchTravelUpdate":"/localfun/AjaxHelperWanLe/UpdateContanct",
                //touch预订页查询邮寄地址
                "getTouchPostList":"/localfun/AjaxHelperWanLe/QueryAddress?",
                //touch预定页新增邮寄地址
                "getTouchPostAdd": "/localfun/AjaxHelperWanLe/AddAddress",
                //touch预订页更新邮寄地址
                "getTouchPostUpdate":"/localfun/AjaxHelperWanLe/UpdateAddress",
                //touch预定页删除邮寄地址
                "getTouchPostDelete": "/localfun/AjaxHelperWanLe/RemoveAddress",
                //touch站预定页选择出游人，即出游人列表
                "getTouchTravelList":"/localfun/AjaxHelperWanLe/GetContanctList?",
                //touch站预定页红包列表
                "getTouchHongBaoList":"/localfun/AjaxHelperWanLe/GetPreferentialInfo?",
                //touch站活动预定页自取城市列表
                "getTouchActivityCityList":"/localfun/AjaxHelperWanLe/GetProductBookingReceiveCitys?",
                //touch站活动预定页根据自取城市id，目的地ID，供应商ID得到相应的主，子产品ID
                "getTouchDetailProduct":"/localfun/AjaxHelperWanLe/GetProductBookingInfo?",
                //touch站预定页获取省市区
                "getTouchOrderCity":"/localfun/AjaxHelperWanLe/",
                //订单详情页取消
                "getTouchOrderDetail":"/localfun/AjaxHelperWanLe/WanleCancelOrder?",
                //touch预定页提交发票
                "getTouchSubmitInvoice":"/localfun/AjaxHelperWanLe/SaveInvoiceMessage",
                //touch新版首页和城市列表页热卖产品
                "getTouchHotProductsList": "/localfun/AjaxHelperWanLe/GetWanLeSearchListNew?stp=hot&start=1&sort=1&",
                //touch天气接口
                "getTouchWeather":"/localfun/AjaxHelperWanLe/WeatherByCity?",
                //终页关联产品推荐
                "getRecommendList":"/localfun/AjaxHelperWanLe/GetMainResourceRecommandList?",



                //小顾站WIFI首页,玩乐首页,目的地城市列表页"
                "getTravelWanleIndex": "/dujia/AjaxHelperWanLe/GetLocalFunIndexDetail?",
                //小顾终页
                "getTravelDetailIndex": "/dujia/AjaxHelperWanLe/GetProductDetailModel?",
                //"微信玩乐列表页,玩乐首页，WIFI首页"
                "getTravelList": "/dujia/AjaxHelperWanLe/GetWanLeSearchList?",
                //"订单详情页"
                "getTravelOrderDetailIndex": "/dujia/AjaxHelperWanLe/GetWanLeOrderSingleDetail?",
                //小顾站终页倒计时
                "getTravelDetailTimer": "/dujia/ajaxhelperwanle/GetLocalFunCommentTime?digitSign=eb2542ea86e0cfeb087ace5998e8d135&",
                //小顾站点评
                "getTravelComment": "/dujia/ajaxhelperwanle/GetLocalFunComment?",
                //小顾预定页获取价格日历
                "getTravelPriceCalendar":"/dujia/AjaxHelperWanLe/WanLeCalData?",
                //小顾站预定页点击具体的价格
                "getTravelPriceCalendarDetail":"/dujia/AjaxHelperWanLe/SingleProductPriceType?",
                //小顾站预定页提交信息
                "getTravelOrderSubmit":"/dujia/AjaxHelperWanLe/WanLeSubOrder",
                //小顾列表页目的地
                "getTravelListDest": "/dujia/AjaxHelperWanLe/GetIndexDestination?",
                //小顾站预定页编辑出游人，即详细出游人信息
                "getTravelTravelDetail":"/dujia/AjaxHelperWanLe/GetContanctList?",
                //小顾站预定页新增出游人
                "getTravelTravelAdd":"/dujia/AjaxHelperWanLe/AddContanct",
                //小顾预定页更新出游人信息
                "getTravelTravelUpdate":"/dujia/AjaxHelperWanLe/UpdateContanct",
                //小顾预订页查询邮寄地址
                "getTravelPostList":"/dujia/AjaxHelperWanLe/QueryAddress?",
                //小顾预定页新增邮寄地址
                "getTravelPostAdd": "/dujia/AjaxHelperWanLe/AddAddress",
                //小顾预订页更新邮寄地址
                "getTravelPostUpdate":"/dujia/AjaxHelperWanLe/UpdateAddress",
                //小顾预定页删除邮寄地址
                "getTravelPostDelete": "/dujia/AjaxHelperWanLe/RemoveAddress",
                //小顾站预定页选择出游人，即出游人列表
                "getTravelTravelList":"/dujia/AjaxHelperWanLe/GetContanctList?",
                //小顾站预定页红包列表
                "getTravelHongBaoList":"/dujia/AjaxHelperWanLe/GetPreferentialInfo?",
                //小顾站活动预定页自取城市列表
                "getTravelActivityCityList":"/dujia/AjaxHelperWanLe/GetProductBookingReceiveCitys?",
                //小顾站活动预定页根据自取城市id，目的地ID，供应商ID得到相应的主，子产品ID
                "getTravelDetailProduct":"/dujia/AjaxHelperWanLe/GetProductBookingInfo?",
                //小顾站预定页获取省市区
                "getTravelOrderCity":"/dujia/AjaxHelperWanLe/",
                //订单详情页取消
                "getTravelOrderDetail":"/dujia/AjaxHelperWanLe/WanleCancelOrder?",
                //小顾预定页提交发票
                "getTravelSubmitInvoice":"/dujia/AjaxHelperWanLe/SaveInvoiceMessage",
                //小顾新版首页和城市列表页热卖产品
                "getTravelHotProductsList": "/dujia/AjaxHelperWanLe/GetWanLeSearchListNew?stp=hot&start=1&sort=1&",
                //小顾天气接口
                "getTravelWeather":"/dujia/AjaxHelperWanLe/WeatherByCity?",
                //终页关联产品推荐
                "getTravelRecommendList":"/dujia/AjaxHelperWanLe/GetMainResourceRecommandList?"

            }
        },
        urlMode = /__([^_]+)__/.exec(location.href),
        mod = location.host === "m.ly.com"?"online":window.__mod__,
        mod = (urlMode && urlMode[1]) || mod  || "online";
    /**
     * @desc 获取接口配置
     * @param {string} type 接口类型
     * @param {string} [_mod=touch] 接口所在的站点,touch/cn
     * @returns {*}
     */
    Config.getInterface = function(type,_mod,host) {
        var sites = _mod||"touch",
            hosts;
        if(mod.indexOf("-")>-1){
            var a = mod.split("-");
            if(sites === a[0]){
                hosts = "//"+a[1];
            }
        }else{
            var item = interFace.type[mod];
            if(!item){
                Monitor.log(type+"的接口配置不存在","interface");
            }
            hosts = item[sites];
            if(host && window.isFangZhua){
                if(!$.td){
                    Monitor.log("缺少防抓脚本:http://js.40017.cn/cn/c/c/td/jq-td-all.js?v=20150504","fangzhua");
                }
                hosts = "http://"+host;
            }
        }

        return hosts + interFace.list[type];
    };
})(Zepto);
