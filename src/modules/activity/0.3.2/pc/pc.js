var Activity;
(function($){
    if (!Array.prototype.indexOf)
    {
        Array.prototype.indexOf = function(elt)
        {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) { from += len; }
            for (; from < len; from++) {
                if (from in this && this[from] === elt) { return from; }
            }
            return -1;
        };
    }
    Activity = {
        extraStr: "",
        dataUrl: "//www.ly.com/dujia/AjaxHelper/activityHandler.ashx?type=ACTRESOURCE&actid={ActivityId}&pid={CycleId}&readnew=1",
        checkUrl: "//www.ly.com/dujia/AjaxActivity.aspx?Type=GetEncryptionTemp&source={LineId},{ActivityId},{CycleId}",
        sceneryUrl: "//www.ly.com/dujia/AjaxHelper/SingleProductHandler.ashx?action=GetSingleProductActUrl&id={LineId}&actId={ActivityId}&periodId={CycleId}",
        serverTimeUrl:'//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue',
        DEFAULTTIME:-2209017600000,
        data: {},
        dotConf: undefined,
        dotDef: {
            anchorAttributes: '{{' +
            'var __url_detail = "//www.ly.com/dujia/tours/"+value.LineId+"{PATH_EXT}?ak="+value.RedirectKey+"&SellType="+value.SellType; ' +
            'if(value.LineType == 0) { __url_detail = __url_detail.replace("{PATH_EXT}", ".html")}' +
            'else { __url_detail = __url_detail.replace("{PATH_EXT}", "/")}' +
            'if(value.SingleResourceId&&value.SingleResourceId!==0) { __url_detail = "//www.ly.com/dujia/wanle/"+value.SingleResourceId+".html?"; }' +
        '}}'+
            'target="_blank" title="{{=value.MainTitle}}" href="{{=__url_detail+Activity.getPassParam()}}" data-url="{{=__url_detail}}" data-RedirectKey="{{=value.RedirectKey||\'\'}}" data-lineId="{{=value.LineId||\'\'}}" data-LineType="{{=value.LineType}}" data-SellType="{{=value.SellType}}" data-activityId="{{=value.ActivityId}}" data-cycleId="{{=value.CycleId}} data-enterId="{{=value.SingleResourceId}}"',
        },
        cfg: {
            ActivityId: "",
            CycleId: "",
           /* IsSellOut: 0,
            PlatForm: 0,
            querytype: 0,*/
            host: "//www.ly.com",
            mockData: null,
            isMockDataMerge: false,
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
                        if(itemStart === Activity.DEFAULTTIME || itemEnd === Activity.DEFAULTTIME){
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
        log: function(message,type,pageid){
            window.monitorModule && window.monitorModule.log(message,type,pageid);
            if(window.console){
                window.console.log(arguments);
            }
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
        init: function(cfg){
            var self = this,
                defaultCfg = self.cfg;
            var _cfg = self._cfg = $.extend(defaultCfg,cfg),
                paramList,
                param = _cfg.param;
            if(!_cfg.paramList){
                paramList = self.getParamData(param);
            }else{
                paramList = _cfg.paramList;
            }
            if(!paramList){
                Activity.log("paramList不存在","param");
                return;
            }
            if(!self.isInitEvent){
                self.getServerTime();
            }

            if(paramList.length > 0){
                self.getOneData(paramList,function(){});
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
        getParamData: function(param){
            if(!(param &&$.isArray(param))){
                Activity.log("请求接口所需参数不存在!","param");
                return;
            }
            var paramList = [];
            for(var x = 0, len = param.length -1; x<=len; x++){
                var paramItem = param[x];
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
                thisCfg.ActivityId = paramItem[0];
                thisCfg.CycleId = paramItem[1];
                self.getData(thisCfg,function(data){
                    if(data){
                        var arr = data.data,
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
                self.renderAll(retData);
                self._cfg.afterRender && self._cfg.afterRender.call(self,retData);
                callback && callback.call(this);
            }
        },
        renderAll: function(data) {
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
        render: function(context,callback) {
            context.each(function(i, n) {
                if (!$(this).data("rendered")) {
                    var html = $(this).data("html");
                    $(this).empty().append(html);
                    $(this).data("rendered", true);
                    callback && callback.call(this);
                }
            });
            this.imgLazyLoad();
        },
        renderHTML: function(data, context, tmplStr) {
            if (!tmplStr) {
                tmplStr = context.attr("data-tmpl");
            }
            if (!tmplStr) {
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
            if (context.hasClass("none")) {
                context.data("html", html);
                return;
            }
            context.empty().append(html);
            if(data.length && data.length >0) {
                context.attr("data-rendered", "true");
            }
            this.imgLazyLoad();
        },
        getData: function(cfg,callback){
            var self = this;
            var url = self.dataUrl.replace(/{(\w+)}/g,function($0,$1){
                if(cfg[$1] === undefined){
                    Activity.log("url对应的"+$1+"参数不存在!","param");
                }
                return cfg[$1]===undefined?"":cfg[$1];
            });
            var cbKey = cfg.CycleId?cfg.CycleId.replace(/,/g,"_"):"0";
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback: "jsonp"+cbKey,
                success: function(data){
                    callback && callback.call(self,data);
                },
                error: function(err){
                    if(err){
                        Activity.log(err,"interface");
                    }
                }
            });
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
            } else if (!reg.test(url)) {
                return url.replace(/\.\w+$/,function($0){
                    return (size || defaultSize)+$0;
                });
            }
        },
        /**/
        parseISO8601 : function(dateStringInRange) {
            var isoExp = /^(\d{4})-(\d\d)-(\d\d)/,
                date = new Date(NaN), month,
                parts = isoExp.exec(dateStringInRange);

            if(parts) {
                month = +parts[2];
                date.setFullYear(parts[1], month - 1, parts[3]);
                if(month != date.getMonth() + 1) {
                date.setTime(NaN);
                }
            }
            return date;
         },

        formatDate :function(tmpl,date){
            if(typeof date === "string"){
                // IE8 new Date() bug
                date = this.parseISO8601(date);
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
                    tmpl = tmpl.split(reg2[0])[0];
                    for(var i=0;i<data.length;i++){
                        dataArr.push(self.formatDate(tmpl,data[i]));
                    }
                    //去重
                    var tmp = [];
                    for(var i in dataArr){
                        if(tmp.indexOf(dataArr[i].join(','))===-1){
                            tmp.push(dataArr[i]);
                        }
                    }
                    dataArr = tmp;
                    if(reg2[1]){
                        dataArr.length = reg2[1];
                    }
                    ret = dataArr.join(reg2[2]);
                }
            }
            return ret;
        },
        tmplProAttr :function(data){
            var self = this;

            var _url = '//www.ly.com/dujia/tours/'+data.LineId+'{PATH_EXT}?ak='+data.RedirectKey+'&SellType='+data.SellType;
            if(data.LineType === 0) { _url = _url.replace('{PATH_EXT}', '.html'); }
            else { _url = _url.replace('{PATH_EXT}', '/'); }

            if(data.SingleResourceId&&data.SingleResourceId !== 0 ) {
                _url = "//www.ly.com/dujia/wanle/"+data.SingleResourceId+".html?";
            }

            var str = ' target="_blank" title="'+data.MainTitle+'"'+
                ' href="'+_url+self.getPassParam()+'"' +
                ' data-url="'+_url+'"' +
                ' data-RedirectKey="'+data.RedirectKey+'"' +
                ' data-lineId="'+data.LineId+'"' +
                ' data-LineType="'+data.LineType+'"' +
                ' data-SellType="'+data.SellType+'"' +
                ' data-ActivityId="'+data.ActivityId+'"' +
                ' data-CycleId="'+data.CycleId+'"' +
                ' data-EnterId="'+data.SingleResourceId+'"';
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
                parent.each(function(i,n){
                    self._imgItemLazyLoad(n);
                });
        },
        _imgItemLazyLoad: function(el){
            var self = this,
                parent = $(el),
                imgList = parent.find("img").not("[data-img-loaded]");
            if (this.isInit) {
                $(window).trigger("addElements",imgList);
            } else {
                imgList.lazyload({
                    "data_attribute": "img"
                });
                this.isInit = true;
            }
        },
        initEvent: function(){
            var me = this,
                cfg = me.cfg,
                context = $(cfg.el);

            $(context).on("mousedown","a",function(e){
                if(e.which === 3){
                    return;
                }
                if(me.isClicking) {
                    return;
                }
                me.isClicking = true;
                me.encrypt(this,cfg.login, function(){
                    me.isClicking = false;
                },e.liveFired||e.delegateTarget);
                e.preventDefault();
            });
        },
        encryptEntertain:function(el,callback){
            var playId = el.getAttribute("data-enterId");
            if(playId&&playId!=="0"){
                var url = "//www.ly.com/dujia/wanle/"+playId+".html";
                var newwindow = window.open();
                newwindow.location.href = url;
                callback && callback.call(this);
            }
        },
        encryptScenery: function(el,callback){
            var self = this,
                checkUrl = self.sceneryUrl,
                url = checkUrl.replace(/{(\w+)}/g,function($0,$1){
                    var attr = el.getAttribute("data-"+$1)||self.cfg[$1];
                    if(!attr){
                        Activity.log($1+"对应的值不存在!");
                    }
                    return attr||"";
                });
            var newwindow = window.open();
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function(data){
                    if(data){
                        var extraStr = self.extraStr,
                            url = data.url + extraStr + self.getPassParam();
                        callback && callback.call(self);
                        newwindow.location.href = url;
                        callback && callback.call(this);
                    }
                },
                error: function(err){
                    if(err){
                        Activity.log(err,"interface");
                    }
                }
            });
        },
        encrypt: function(el,isLogin,callback,liveFired){
            var self = this,
                playId = el.getAttribute("data-enterId"),
                ret = self.cfg.checkScenery && self.cfg.checkScenery.call(self,el,liveFired);
            if(ret){
                self.encryptScenery(el,callback,liveFired);
                return;
            }
            if(playId&&playId!=="0"){
                self.encryptEntertain(el,callback);
                return;
            }
            var newwindow = window.open();
            var href = el.getAttribute("data-url");
            var url = href + self.getPassParam();
            newwindow.location.href = url;
            callback && callback.call(this);
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
        newDate: function(date){
            return new Date(date.replace(/-/g,"/").replace("T"," ").replace(/(\+.*$)/g,""));
        },
        getServerTime:function(callback){
            var self = this;
            if(self.__server_time__!==undefined||this.serverTime===false){
                var now = self.__client_time__||new Date().getTime();
                callback.call(this,now);
                return;
            }
            var startTime = new Date().getTime(),
                timeUrl =self.serverTimeUrl+"&t="+Math.random();
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
        getPassParam:function(){
            var url = location.href,
                params = Activity.passParams || ["spm","refid","spmid"],
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
        }
    };
    window.monitorModule && window.monitorModule.init();
}(jQuery));

module.exports = window.Activity = Activity
