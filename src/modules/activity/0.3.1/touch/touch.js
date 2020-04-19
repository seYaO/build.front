/**
 * @desc:$
 * @author: HanlibaLi
 * @mail: lxq10107@ly.com
 * @createTime: 2015/3/5 14:33
 */
/* global $ */
var Activity;
var tcApp = {
    // url: "http://shouji.17u.cn/internal/holiday/details/{{lineId}}/{{activityId}}/{{cycleId}}",
    url: "tctclient://vacation/detail?lineId={{lineId}}&activityId={{activityId}}&periodId={{cycleId}}",
    checkUrl: "http://www.ly.com/dujia/AjaxHelper/PrickGoldFingerHandler.ashx?action=GETENCRYPTIONURL&isHot=2&sub=0&lineid={lineId}&actId={activityId}&actSchedule={CycleId}",
    sceneryUrl: "http://www.ly.com/dujia/AjaxHelper/SingleProductHandler.ashx?action=GetSingleProductActUrl&id={LineId}&actId={ActivityId}&periodId={CycleId}",
    version: 7.1,
    needJumpWX: false,
    needLaunchApp: false,  // 是否需要唤起客户端 @20160323 by zxk15045
    /**
     * @desc 检测是否是有效的app,版本>=7.1
     * @returns {boolean}
     */
    check: function(){
        var ua = navigator.userAgent,
            isApp = /TcTravel\/(\d+\.\d+\.\d+)/.exec(ua);
        if(isApp&&isApp[1]){
            var version = isApp[1];
            if(parseFloat(version)>=this.version){
                return true;
            }
        }
    },
    checkIsWX: function(){
        return /MicroMessenger/.test(navigator.userAgent);
    },
    /**
     * @desc 传入一个节点
     * @param {HTMLElement} el
     * @return 添加 needLaunchApp 判断
     */
    go: function(el){
        var url = this.url,
            lineId = el.getAttribute("data-lineId"),
            actId = el.getAttribute("data-activityId"),
            cycleId = el.getAttribute("data-cycleId"),
            enterId = el.getAttribute("data-enterId"),
            data = {};
        if(!lineId&&actId&&cycleId){
            return;
        }
        if(enterId&&enterId!=="0") {
            return;
        }
        data = {
            lineId: lineId,
            activityId: actId,
            cycleId: cycleId,
            enterId: enterId
        };
        url = url.replace(/{{(\w+)}}/g,function($0,$1){
            return data[$1];
        });

        url += this.getPassParam();
        // needLaunchApp 判断
        if (this.needLaunchApp) {
            return url;
        }

        if(! (el && this.check())){
            return;
        }

        return url;
    },
    addStyle: function(){
        var link = document.createElement("style");
        link.type = "text/css";
        link.innerHTML = ".go-top{display:none;position:fixed;bottom: 20px; right: 20px;width:40px;height:40px;} .go-top img{width:100%;height:100%;}";
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    goTop: function(cfg){
        if(cfg === false){
            return;
        }
        var defaultCfg = {
            cls: "go-top",
            top: 300,
            img: "http://img1.40017.cn/cn/v/chuochuonew/gotop.png"
        };
        var thisCfg = $.extend(defaultCfg,cfg);
        var goTopEl = $(".J_GoTop");
        if(goTopEl.length === 0){
            this.addStyle();
            $("body").append('<span class="J_GoTop '+ thisCfg.cls +'"><img src="'+thisCfg.img+'" /></span>');
            goTopEl = $(".J_GoTop");
        }else{
            return;
        }
        goTopEl.on("click",function(){
            window.scrollTo(0,0);
            goTopEl.hide();
        });
        $(window).on("scroll",function(){
            var cScrollTop = document.body.scrollTop;
            if(cScrollTop > thisCfg.top){
                goTopEl.show();
            }else if(cScrollTop < thisCfg.top){
                goTopEl.hide();
            }
        });
    },
    encryptScenery: function(el,callback){
        var self = this;
        var checkUrl = self.checkUrl,
            url = checkUrl.replace(/{(\w+)}/g,function($0,$1){
                var attr = el.getAttribute("data-"+$1);
                if(!attr){
                    Activity.log($1+"对应的值不存在!","param");
                }
                return attr||"";
            });
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data){
                if(data){
                    var extraStr = self.extraStr||"",
                    //http://m.ly.com/dujia/tours/233763.html
                    //http://m.ly.com/dujia/scenerydetail_233765.html
                        _url = data.url.replace(/tours\/(\d+)/g,"scenerydetail_$1");
                    var url = _url+"&wvc1=1"+extraStr + self.getPassParam();
                    callback && callback.call(self);

                    if (self.needLaunchApp) {
                        var baseUrl = el.baseUrl,
                            sUrl = el.sUrl;
                        url = encodeURIComponent(url.replace(/\//g, '|'));

                        var launchUrl = baseUrl + '?sUrl=' + sUrl + '&rUrl=' + url;
                        
                        window.location.href = launchUrl;
                    } else {
                        window.location.href= url;
                    }
                }
            },
            failure: function(){
                callback && callback.call(self);//新改动
            }
        });
    },
    jumpDetailPage: function(el,type,callback){
        var lineId = el.getAttribute("data-lineid"),
            enterId = el.getAttribute("data-enterId"),
            lineType = el.getAttribute("data-LineType"),
            redirectKey = el.getAttribute("data-RedirectKey"),
            url,
            self = this;

        var isEnterResource = (enterId&&enterId!=="0");
        if(!lineId){
            Activity.log("跳转失败,缺少lineid","param");
            callback && callback.call(self);
            return;
        }
        callback && callback.call(self);
        if(type === "weixin"){
            if(isEnterResource){
                url = "http://wx.17u.cn/localfun/wanle/"+enterId+".html?"+self.getPassParam();
            } else {
                if(lineType === "0"){
                    url = "http://wx.17u.cn/ivacation/tours/"+lineId+".html?ak="+redirectKey+self.getPassParam();
                }else{
                    url = "http://wx.17u.cn/ivacation/tours/"+lineId+"/?ak="+redirectKey+self.getPassParam();
                }
            }
        }else{
            if(isEnterResource) {
                url = "http://m.ly.com/localfun/wanle/"+enterId+".html?wvc1=1"+self.getPassParam();
            } else {
                if(lineType === "0"){
                    url = "http://m.ly.com/dujia/tours/"+lineId+".html?actType="+redirectKey+"&wvc1=1"+self.getPassParam();
                }else{
                    url = "http://m.ly.com/dujia/tours/"+lineId+"/?actType="+redirectKey+"&wvc1=1"+self.getPassParam();
                }
            }
        }

        if (self.needLaunchApp) {
            return url;
        } else {
            location.href = url;
        }        
    },
    touchJump: function(el,isLogin,callback){
        var self = this;
        var url =  el.getAttribute("data-url")+"&wvc1=1" +self.getPassParam();
        callback && callback.call(self);

        if (self.needLaunchApp) {
            return url;
        } else {
            window.location.href= url;
        }
    },
    launchApp: function (el,isLogin,callback,liveFired) {
        var self = this,
            enterId = el.getAttribute("data-enterId"),
            ret = Activity.cfg.checkScenery && Activity.cfg.checkScenery.call(Activity,el,liveFired);
        var isEnterResource = (enterId&&enterId!=="0");

        var baseUrl = 'http://m.17u.cn/app/pje/',
            sUrl, // TcTravel url
            rUrl; // not TcTravel url
        var refid = document.cookie.match(/17uCNRefId=\d+/) || ["17uCNRefId=155139223"]; // 154294518
        refid = refid[0].split('=')[1];
        baseUrl += refid;

        sUrl = self.go(el).replace(/\//g, '|');
        sUrl = encodeURIComponent(sUrl);

        /**
         * 非客户端链接的几种情况
        */
        // 这是神马情况？
        if(ret){
            el.baseUrl = baseUrl;
            el.sUrl = sUrl;
            self.encryptScenery(el,callback,liveFired);
            return;
        }
        //判断是否要跳转到微信
        if(self.needJumpWX && self.checkIsWX()){
            rUrl = self.jumpDetailPage(el,"weixin",callback);
        }
        //最后跳转到touch站
        //如果不是非活动类(比如非凡)
        if(self.noActivity){
            rUrl = self.jumpDetailPage(el,"touch",callback);
        }
        if(isEnterResource) {
            rUrl = self.jumpDetailPage(el,"wanle",callback);
        }else{
            rUrl = rUrl || self.touchJump.apply(self,arguments);
        }

        rUrl = rUrl.replace(/\//g, '|');
        rUrl = encodeURIComponent(rUrl);
        var url = baseUrl + '?sUrl=' + sUrl + '&rUrl=' + rUrl;

        window.location.href = url;
    },
    encrypt: function(el,isLogin,callback,liveFired){
        // needLaunchApp 
        // 如果需要唤起APP，则另起一套逻辑 @20160323
        if (this.needLaunchApp) {

            this.launchApp.apply(this, arguments);
            return;
        }

        var self = this,
            enterId = el.getAttribute("data-enterId"),
            ret = Activity.cfg.checkScenery && Activity.cfg.checkScenery.call(Activity,el,liveFired);
        var isEnterResource = (enterId&&enterId!=="0");
        if(ret){
            self.encryptScenery(el,callback,liveFired);
            return;
        }
        //先跳到客户端
        var clientUrl = self.go(el);
        if(clientUrl){
            callback && callback.call(self);
            location.href = clientUrl;
            //$("body").append("<iframe frameborder='0' src='"+clientUrl+"'></iframe>");
            return;
        }
        //再判断是否要跳转到微信
        if(self.needJumpWX && self.checkIsWX()){
            self.jumpDetailPage(el,"weixin",callback);
            return;
        }
        //最后跳转到touch站
        //如果不是非活动类(比如非凡)
        if(self.noActivity){
            self.jumpDetailPage(el,"touch",callback);
            return;
        }
        if(isEnterResource) {
            self.jumpDetailPage(el,"wanle",callback);
        }else{
            self.touchJump.apply(self,arguments);
        }
    },    
    getRefId:function(){
        var url = location.href,
            hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
        if(hasRefId&&hasRefId[1]){
            return "&refid="+hasRefId[1];
        }else{
            return "";
        }
    },
    getPassParam:function(){
        var url = location.href,
            params = tcApp.passParams || ["moduleid","refid","jobnum","jobNumber","tcnatag"],
            paramArr = [],
            paramStr = '',
            reg,hasParam;
        //
        for(var i=0;i<params.length;i++){
            reg = new RegExp("[\?&]("+params[i]+"=([^&#$]*))","i");
            hasParam = reg.exec(url);
            if(hasParam&&hasParam[1]){
                paramArr.push(hasParam[1]);
            }
        }
        paramStr = paramArr.length?"&"+paramArr.join("&"):"";
        return paramStr;
    },
    getDebug: function(){
        var self = this;
        if(self.isDebug === null){
            self.isDebug = location.href.indexOf("__debug__")>-1;
            return self.isDebug;
        }else{
            return self.isDebug;
        }
    }
};
Activity = {
    cfg:{
        activityId: 0,
        cycleList: [],
        IsSellOut: 0,
        platform: 0,
        prefix: "__act__",
        host: "http://www.ly.com",
        urlTmpl: "{host}/dujia/AjaxHelper/activityHandler.ashx?type=ACTRESOURCE&pageindex=1&pagesize=700&platForm={platform}&actid={activityId}&pid={cycleId}&IsSellOut={IsSellOut}&querytype={querytype}",
        mockData: null,
        isMockDataMerge: false,
        el: ".prolist",
        index: 0,
        login: false,
        querytype: 0,
        DEFAULTTIME:-2209017600000,
        serverTimeUrl:'http://www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue',
        //是否跳微信站
        needJumpWX: false,
        memberId: "tcwvmid",
        beforeParse: function(data){
            if(Activity._cfg.filter){
                return this.filterData(data);
            }else{
                this.data = data;
                return data.data;
            }
        },
        beforeRender: function(data){
            return data;
        },
        _beforeRender:function(data){
            var cfg = this._cfg,
                el = $(cfg.el),
                itemStart,itemEnd;
            var serviceTime = this.__client_time__||new Date().getTime();
            el.each(function(i,n){
                var recData = [];
                var filterStr = n.getAttribute("data-filter"),
                    counts = parseInt(n.getAttribute("data-count"));
                var recItems = data[filterStr];
                if(!recItems){
                    return data;
                }
                for(var i = 0,len = recItems.length-1;i <= len;i++){
                    var item = recItems[i];
                    itemStart = new Date(item.OnlineTime.replace(/\-/gi, "/")||null).getTime();
                    itemEnd = new Date(item.OfflineTime.replace(/\-/gi, "/")||null).getTime();
                    if(itemStart === cfg.DEFAULTTIME || itemEnd === cfg.DEFAULTTIME){
                        return data;
                    }else{
                        if(serviceTime >= itemStart && serviceTime <= itemEnd){
                            recData.push(item);
                        }
                    }
                }
                if(counts){
                    if(counts !== recItems.length){
                        Activity.log("产品数量不匹配!","counts");
                    }
                }
                data[filterStr] = recData;
            });
            return data;
        },
        afterRender: function(){

        },
        checkScenery: function(el,liveFired){
            if(liveFired && liveFired.getAttribute("data-scenery")){
                return true;
            }
        }
    },
    localData: {},
    data: {},
    dotConf: undefined,
    dotDef: {
        anchorAttributes: '{{' +
            'var __url_detail = "http://m.ly.com/dujia/tours/"+value.LineId+"{PATH_EXT}?actType="+value.RedirectKey; ' +
            'if(value.LineType == 0) { __url_detail = __url_detail.replace("{PATH_EXT}", ".html")}' +
            'else { __url_detail = __url_detail.replace("{PATH_EXT}", "/")}' +
        '}}'+
            'href="javascript:void(0)" data-url="{{=__url_detail}}" data-RedirectKey="{{=value.RedirectKey||\'\'}}" data-lineId="{{=value.LineId||\'\'}}" data-LineType="{{=value.LineType}}" data-activityId="{{=value.ActivityId}}" data-cycleId="{{=value.CycleId}} data-enterId="{{=value.SingleResourceId}}"',
    },
    filterData: function(data){
        var cfg = this._cfg,
            el = $(cfg.el),
            newData = {};
        var filterRule = [],
            filterElRule = {};
        el.each(function(i,n){
            var filterStr = n.getAttribute("data-filter");
            if(filterStr){
                if(!filterRule){
                    filterRule = [];
                }
                //如果不包含，则放入数组
                if(!~filterRule.indexOf(filterStr)){
                    filterRule.push(filterStr);
                }
                var _ruleItem = filterElRule[filterStr];
                if(!_ruleItem){
                    _ruleItem = [];
                }
                _ruleItem.push(n);
                filterElRule[filterStr] = _ruleItem;
            }
        });
        if(filterRule.length === 0){
            return data.data;
        }
        this.filterElRule = filterElRule;
        var filterRuleItem = filterRule;
        if(!filterRuleItem){
            Activity.log("对应容器的规则不存在!","param");
            return;
        }
        for(var i = 0, len = data.data.length -1; i<=len; i++){
            var item = data.data[i];
            for(var n = 0, nLen = filterRuleItem.length -1; n<=nLen; n++){
                var filterItem = filterRuleItem[n],
                    filterObjItem = this.unparam(filterItem);
                if(filterObjItem){
                    var flag = true;
                    for(var x in filterObjItem){
                        if(!filterObjItem.hasOwnProperty(x)){
                            continue;
                        }
                        if(item[x] != filterObjItem[x]){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        if(!newData[filterItem]){
                            newData[filterItem] = [];
                        }
                        newData[filterItem].push(item);
                        break;
                    }
                }else{
                    Activity.log("filter表达式不存在!","param");
                }
            }
        }
        return newData;
    },
    unparam: function(str, sep, eq) {
        if (typeof str !== 'string' || !(str = $.trim(str))) {
            return {};
        }
        sep = sep || "&";
        eq = eq || "=";
        var ret = {},
            eqIndex,
            pairs = str.split(sep),
            key, val,
            i = 0,
            len = pairs.length;

        for (; i < len; ++i) {
            eqIndex = pairs[i].indexOf(eq);
            if (eqIndex === -1) {
                key = pairs[i];
                val = undefined;
            } else {
                key = pairs[i].substring(0, eqIndex);
                val = pairs[i].substring(eqIndex + 1);
            }
            if (key in ret) {
                if (typeof (ret[key]) === "object") {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    },
    init: function(cfg){
        var self = this,
            defaultCfg = self.cfg;

        if(tcApp.check()) {
            cfg.needLaunchApp = false;
        }

        var _cfg = self._cfg = $.extend(defaultCfg,cfg),
            param = _cfg.param;

        tcApp.needJumpWX = _cfg.needJumpWX;
        if(!self.isInitEvent){
            self.localData = self.getLocalInst();
            self.getServerTime();
        }

        var paramList;
        if(!_cfg.paramList){
            paramList = self.getParamData(param);
        }else{
            paramList = _cfg.paramList;
        }

        if(paramList.length > 0){
            if(!self.paramList){
                self.paramList = paramList;
            }else{
                self.paramList = self.paramList.concat(paramList);
            }
            self.getOneData(self.paramList,function(){});
        }
        if(self.isInitEvent){
            return;
        }
        self.isInitEvent = true;
        if(!_cfg.clickEvent){
            self.initEvent();
        }else{
            _cfg.clickEvent.call(self,$(_cfg.el));
        }
        tcApp.goTop(cfg.goTop);
        self.initSaveEvent();
    },
    getParamData: function(param){
        if(!(param &&$.isArray(param))){
            Activity.log("请求接口所需参数不存在!","param");
            return;
        }
        var paramList = [];
        for(var x = 0, len = param.length -1; x<=len; x++){
            var paramItem = param[x];
            if(typeof (paramItem) === "string"||typeof (paramItem) === "number"){
                paramList = paramList.concat(param);
                break;
            }
            for(var i in paramItem){
                if(!paramItem.hasOwnProperty(i)){
                    continue;
                }
                paramList.push([i,paramItem[i].join(",")]);
            }
        }
        return paramList;
    },
    getOneData: function(paramList,callback){
        var self = this;
        var thisCfg = $.extend({},self._cfg);
        //mockData
        if(!self.isMockData){
            self.isMockData = true;
            if(thisCfg.mockData && thisCfg.mockData.length>0) {
                var selfArr = self.data.data||[];
                self.data.data = selfArr.concat(thisCfg.mockData);
                if(!thisCfg.isMockDataMerge){
                    paramList = [];
                }
            }
        }
        if(paramList.length){
            var paramItem = paramList.shift();
            thisCfg.activityId = paramItem[0];
            thisCfg.cycleId = paramItem[1]||"";
            self.getData(thisCfg,function(data){
                if(data){
                    var arr = data.data||data,
                        selfArr = self.data.data||[];
                    self.data.data = selfArr.concat(arr);
                }
                self.getOneData(paramList,callback);
            });
        }else{
            var data = self.data,
                _retData = self._cfg.beforeParse && self._cfg.beforeParse.call(self,data),
                __retData__ = self._cfg._beforeRender && self._cfg._beforeRender.call(self,_retData),
                retData = self._cfg.beforeRender && self._cfg.beforeRender.call(self,__retData__);
            self.fliterData = retData;
            self.render(retData);
            var afterRenderFunc = self._cfg.afterRender && self._cfg.afterRender.call(self,retData);
            if(afterRenderFunc !== false){
                var _callback = function(data,localData){
                    if(data){
                        if(!window.__click__){
                            var _href = location.href;
                            var _localData = localData[_href];
                            if(_localData && _localData.scrollTop){
                                window.scrollTo(0,_localData.scrollTop);
                            }
                        }
                    }
                };
                _callback(retData,self.localData);
                self.imgLazyLoad();
                callback && callback.call(this);
            }
        }
    },
    getLocalInst: function(){
        var localDataStr = window.sessionStorage.getItem(this._cfg.prefix+"localData")||"{}",
            localData = JSON.parse(localDataStr);
        return localData;
    },
    initEvent: function(){
        var me = this,
            cfg = me.cfg,
            context = $(cfg.el);

        context.on("click","a",function(e){
            if(me.isClicking) {
                return;
            }
            me.isClicking = true;
            $.extend(tcApp,cfg);
            tcApp.encrypt(this,cfg.login, function(){
                me.isClicking = false;
            }, e.liveFired);
            e.preventDefault();
        });
    },
    render: function(data,index){
        var self = this;
        if(self._cfg.filter){
            var ruleItem = self.filterElRule;
            for(var x in ruleItem){
                self.renderHTML(data[x]||{},$(ruleItem[x]));
            }
        }else{
            self.renderHTML(data,$(self._cfg.el));
        }
    },
    /*调用方法*/
    renderFn : function(el,data,beforeRenderFn,afterRenderFn){
        var self = this,
            fliter = el.attr("data-filter");
        el.removeAttr("data-rendered");
        if(!data&&!self._cfg.filter){
            return false;
        }
        beforeRenderFn && beforeRenderFn.call(self);
        if(!data){
            var retData = self.fliterData[fliter];
            if(retData) { self.renderHTML(retData,el); }

        }else{
            self.renderHTML(data,el);
        }
        afterRenderFn && afterRenderFn.call(self);
    },
    renderHTML: function(data,context,tmplStr){
        if(!tmplStr){
            tmplStr = context.attr("data-tmpl");
        }
        if(!tmplStr){
            Activity.log("没有配置data-tmpl","param");
            return;
        }
        if(context.attr("data-rendered")){
            return;
        }

        var tmpl = $(tmplStr).html();
        if(!window.doT){
            Activity.log("dotjs没有加载或者检查是不是seajs和dot冲突了","dom");
            return;
        }
        var tpl,html;
        try{
            tpl = window.doT.template(tmpl, Activity.dotConf, Activity.dotDef);
        }catch(e) {
            Activity.log(e.stack|| e.message, "tmpl");
            return;
        }
        html = tpl(data);
        context.empty().append(html);
        if(data.length && data.length >0) {
            context.attr("data-rendered", "true");
        }
    },
    getData: function(cfg,callback){
        var self = this;
        var url = cfg.urlTmpl.replace(/{(\w+)}/g,function($0,$1){
            if(cfg[$1] === undefined){
                Activity.log("url对应的"+$1+"参数不存在!","param");
            }
            return cfg[$1]===undefined?"":cfg[$1];
        });
        if(cfg.storage){
            var _localdata = self.getLocalData(url);
            if(_localdata){
                var localdata = {};
                try{
                    localdata = JSON.parse(_localdata);
                }catch(e){
                    Activity.log("本地存储的转换失败","data");
                }
                callback && callback.call(self,localdata);
                return;
            }
        }
        $.ajax({
            url: url,
            dataType: "jsonp",
            jsonpCallback: "jsonp"+Math.round(Math.random()*10000),
            success: function(data){
                if(cfg.storage){
                    self.setLocalData(url,data);
                }
                callback && callback.call(self,data);
            },
            error: function(xhr, errorType, error){
                Activity.log("接口有误:"+errorType, "interface");
            }
        });
    },
    getLocalData: function(key){
        if(typeof key === "string"){
            return this.localData && this.localData[key]||"";
        }
    },
    setLocalData: function(key,value){
        var _value = value;
        if(typeof value !== "string"){
            try{
                if(value.status && value.code >= 4000){
                    _value = JSON.stringify(value.data||value);
                }
            }catch(e){
                Activity.log(e,"data");
                return;
            }
        }
        this.localData[key] = _value;
    },
    setImageSize: function (url, size) {

        if (!url) {
            return null;
        }
        var defaultSize = "_600x300_00";
        if(size && size.indexOf("_") === -1){
            size = "_"+size+"_00";
        }
        var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
        var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
        if (reg.test(url) && regSize.test(size)) {
            return url.replace(reg, size);
        }

        if (reg.test(url)) {
            return url;
        }

        if (url.indexOf("upload.17u.com") > -1) {
            return url;
        } else if (!reg.test(url) && !/(scenery)/.test(url)) {//含有scenery（国际景点）不替换
            return url.replace(/\.\w+$/,function($0){
                return (size || defaultSize)+$0;
            });
        }else{
            return url;
        }
    },
    /**/
    formatDate :function(tmpl,date){
        if(typeof date === "string"){
            date = date.replace(/-/g,"/");
            date = new Date(date);
        }
        var o = {
            "M+" : date.getMonth()+1,    //month
            "D+" : date.getDate(),    //day
            "h+" : date.getHours(),    //hour
            "m+" : date.getMinutes(),    //minute
            "s+" : date.getSeconds(),    //second
            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
            "S" : date.getMilliseconds()    //millisecond
        };
        if(/(Y+)/.test(tmpl)){
            tmpl = tmpl.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(tmpl)){
                tmpl = tmpl.replace(RegExp.$1, RegExp.$1.length===1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return tmpl;
    },
    formatStartDate : function(tmpl,data){
        var self = this;
        var dataArr =[],
            ret ="";
        if(data){
            var reg1 = tmpl.match(/%/g),
                reg2 = tmpl.match(/\{(\d{0,2})\}/i);
            //console.log(data);
            if(reg1){
                /*
                * eg "YYYY%-%M月D日";
                */
                dataArr = tmpl.split("%");
                dataArr[0] = self.formatDate(dataArr[0],data[0]);
                dataArr[2] = self.formatDate(dataArr[2],data[(data.length-1)]);
                if(dataArr[0]===dataArr[2]){
                    ret = dataArr[0];
                }else{
                    ret = dataArr.join("");
                }
            }else {

                /*
                 * eg "M月{3},";
                 */
                var tempSl = tmpl.split(reg2[0]);
                for(var i=0;i<data.length;i++){
                    dataArr.push(self.formatDate(tempSl[0],data[i]));
                }
                //去重
                var tmp = [];
                for(var j = 0;j<dataArr.length;j++){
                    if(tmp.indexOf(dataArr[j])==-1){
                        tmp.push(dataArr[j]);
                    }
                }
                dataArr = tmp;

                if(reg2[1]){
                    dataArr.length = reg2[1];
                }
                ret = dataArr.join(tempSl[1]);
            }
        }
        return ret;
    },
    tmplProAttr :function(data){
        var self = this;
        var str = 'href="javascript:void(0)"' +
            ' data-url="http://m.ly.com/dujia/tours/'+data.LineId+'.html?actType='+data.RedirectKey+(tcApp.getPassParam())+'"' +
            ' data-RedirectKey="'+data.RedirectKey+'"' +
            ' data-lineId="'+data.LineId+'"' +
            ' data-LineType="'+data.LineType+'"' +
            ' data-activityId="'+data.ActivityId+'"' +
            ' data-cycleId="'+data.CycleId+'"' +
            ' data-enterId="'+data.SingleResourceId+'"';
        return str;
    },
    getExplosionArray: function(data) {
        if(!data.Explosion) { return []; }
        return data.Explosion.split('##');
    },
    imgLazyLoad: function(){
        var self = this,
            cfg = self.cfg,
            parent = $(cfg.el).parent();
        if(!$.fn.lazyload){
            Activity.log("lazyload组件未加载","dom");
            return;
        }
        if (this.isInit) {
            var imgList = parent.find("img").not("[data-img-loaded]");
            $(window).trigger("addElements",imgList);
        } else {
            parent.find("img").not("[data-img-loaded]").lazyload({
                "data_attribute": "img",
                css: {
                    opacity: 0
                },
                effect: 'fadeIn'
            });
            this.isInit = true;
        }
    },
    initSaveEvent: function(){
        var self = this;
        window.onunload = function(){
            var _href = location.href,
                _itemData = {};
            _itemData[_href] = {
                scrollTop: document.body.scrollTop
            };
            var _localData = $.extend(Activity.localData,_itemData);
            window.sessionStorage.setItem(self._cfg.prefix+"localData",JSON.stringify(_localData));
        };
    },
    log: function(message,type,pageid){
        if(window.monitorModule){
            window.monitorModule.log(message,type,pageid);
        }else if(window.console){
            console.error(message,type);
        }
    },
    getServerTime:function(){
        var self = this;
        if(self.__server_time__!==undefined||this.serverTime===false){
            self.__client_time__ = self.__client_time__||new Date().getTime();
            return;
        }
        var startTime = new Date().getTime(),
            timeUrl =this.cfg.serverTimeUrl+"&t="+Math.random();
        $.ajax({
            type: "GET",
            url:timeUrl,
            dataType: "jsonp",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(date){
                var retTime = new Date(date.totalseconds.replace(/\-/gi, "/")||null).getTime(),
                    timeDiff = retTime - startTime;
                self.__server_time__ = retTime;
                self.__diff_time__ = timeDiff;
                self.__client_time__ = new Date().getTime() + timeDiff;
            },
            error: function(){
                self.__client_time__ = new Date().getTime();
            }
        });
    },
    newDate: function(date){
        return new Date(date.replace(/-/g,"/").replace("T"," ").replace(/(\+.*$)/g,""));
    }
};
(function(){
    if(!window.monitorModule){
        window.console && console.log("监控组件未加载:jqmodule/monitor/0.1.0/index");
        return;
    }
    window.monitorModule && window.monitorModule.init();
})();

