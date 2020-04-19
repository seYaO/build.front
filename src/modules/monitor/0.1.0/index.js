/**
 * @author 黄凯(hk08688@ly.com)
 * @module  监控
 * @exports Monitor
 * @desc
 * 前端错误监控模块
 * @example
 * Monitor.log("test,"test");
 */
/**
 * @global
 * @see {@link module:监控}
 * @desc
 * 监控组件
 */
/* exported Monitor */
/* global $ */
(function(win){
    function BaseMonitor(){
    }
    BaseMonitor.prototype = {
        /**
         * @private
         * @func isConsole
         * @desc 判断是否在控制台输出
         * @returns {boolean|null}
         */
        isConsole: function(){
            return !!win.console && this.getLogStatus();
        },
        /**
         * @private
         * @func getLogStatus
         * @desc 判断当前的状态,如果为真,则只在控制台显示,不发送日志
         * @returns {boolean|null}
         */
        getLogStatus: function(){
            var host = location.host,
                isNotOnlineHost = host.indexOf("www.ly.com") === -1
                    && host.indexOf("wx.17u.cn") === -1
                    && host.indexOf("m.ly.com") === -1,
                showDebugMessage = location.href.indexOf("debug")>-1,
                isDebugMonitor = location.href.indexOf("monitor")>-1;
            return (!isDebugMonitor&&(isNotOnlineHost||showDebugMessage));
        },
        /**
         * @desc 针对JSON.stringify增加兼容
         * @param data 数据
         * @returns {String}
         */
        stringify: function(data){
            if((typeof data).toLowerCase() === "string"){
                return data;
            }
            if(win.JSON && JSON.stringify){
                return JSON.stringify(data);
            }
            return '{"message":"不支持stringify"}';
        },
        /**
         * @func _sub
         * @desc 根据错误数据和环境生成需要的错误字符串
         * @param data {object} 错误数据
         * @param msgType {number} 是哪种错误,1为邮件,2为短信,0为普通错误
         * @returns {string} 生成的错误字符串
         * @private
         */
        _sub: function(data,msgType){
            var self = this,
                logTmpl = self.stringify(self._tmpl.log),
                extraStr = msgType?"&IntoError="+msgType:"";
            if(self.isConsole()){
                logTmpl = self._tmpl.pretty;
            }
            return logTmpl.replace(/{{(\w+)}}/g, function ($0, $1) {
                var _data = data[$1];
                if(self.isConsole()){
                    return _data;
                }else{
                    return self.stringify(_data);
                }
            })+extraStr;
        },
        /**
         * @desc 判断是否已经过期
         * @param _stamp 本地的数据
         * @param [_expireTime] 失效的时间//也可以是布尔值
         * @returns {boolean}
         */
        isNotExpire: function(_stamp,_expireTime){
            var expireTime = 1000*60*60,
                now = new Date().getTime();
            if(_expireTime && (typeof(_expireTime)).toLowerCase() === "boolean"){
                return !_expireTime;
            }
            //当缓存时间不超过1天，并且没有使用强制刷新，并且返回的状态不为300（请求失败）时,走本地存储
            return (now-_stamp <= (_expireTime||expireTime) );
        },
        /**
         * @desc 查询信息是否已经发送，每条错误只发送一次
         * @param {string} msg
         * @todo 这里的JSON.stringify在火狐下可能会报错
         */
        index: function(msg){
            if(!localStorage) {return true;}
            var errorStr = localStorage.__error__||"{}",
                errorObj = JSON.parse(errorStr);
            if(!errorObj[msg]||!this.isNotExpire(errorObj[msg])){
                errorObj[msg] = new Date().getTime();
                localStorage.__error__ = this.stringify(errorObj);
                return true;
            }
        },
        /**
         * @func send
         * @desc 创建一个图片用来发送统计
         * @param url {string} 发送统计的url
         */
        send: function(url) {
            var img = new Image(),
                id = "__img__" + Math.random();
            win[id] = img;
            img.onload = img.onerror = function () {
                win[id] = null;
            };
            img.src = url;
            img = null;
        }
    };

    function ErrorMonitor(){
    }
    ErrorMonitor.prototype = new BaseMonitor();
    $.extend(ErrorMonitor.prototype,{
        /**
         * @param _prefix
         * @desc 日志接口的前缀
         */
        prefix: "http://www.ly.com/dujia/ajaxhelper/commonhandler.ashx?action=FRONTPERFORMANCE&type=FrontLogErr",
        /**
         * @param _tmpl
         * @desc 错误信息模板
         */
        _tmpl: {
            pretty: "在{{pageid}}发现{{errortype}}错误：\n \r {{message}}",
            log: {
                "errortype": "{{errortype}}",
                "host": "{{host}}",
                "pageid":"{{pageid}}",
                "message": "{{message}}",
                "ua": "{{ua}}",
                "width": "{{width}}",
                "height": "{{height}}",
                "url": "{{url}}"
            }
        },
        hostMap:{
            "(dj(test)?\.t|www)\.ly\.com": "pc",
            "(m(test)?\.t|m)\.ly\.com": "touch",
            "(wx(test)?\.t|wx)\.17u\.cn": "weixin"
        },
        pageidMap:{
            "pc":{
                //www.ly.com/dujia
                "\/dujia[\/]?$":"pc-index",
                //http://www.ly.com/dujiatag/suzhou/chujingyou/taiguo/2946.html
                "\/dujiatag\/\w+\/chujingyou\/\\w+\/\\d+\.html":"pc-oldtag",
                //http://www.ly.com/dujia/taiguo2946-gentuan-tag/f91dmt/
                "\/dujia\/\\w+\\d+-\\w+":"pc-tag",
                //http://www.ly.com/dujia/search.aspx?src=%E8%8B%8F%E5%B7%9E&dest=%E6%B3%B0%E5%9B%BD%E4%BA%BA%E5%A6%96&prop=1
                "\/dujia\/search\.aspx":"pc-search",
                //www.ly.com/dujia/temai/
                "\/dujia\/temai[\/]?$":"pc-temai",
                //www.ly.com/dujia/yushou/
                "\/dujia\/yushou[\/]?$":"pc-yushou",
                //www.ly.com/dujia/tours/214110.html
                "\/dujia\/tours/\\d+\.html":"pc-gdetail",
                //www.ly.com/dujia/tours/211054/
                "\/dujia\/tours/\\d+\/":"pc-fdetail",
                //www.ly.com/dujia/bookNew.aspx?bookdate=2015-10-23&id=211054
                "\/dujia\/fillIn\.aspx":"pc-booking",
                "\/zhuanti\/([^\/]+)":"pc-zhuanti"
            },
            "touch":{
                "\/dujia[\/]?$":"touch-index",
                "\/dujia\/.*\/list\/.*\.html$":"touch-list",
                //m.ly.com/dujia/tours/219985.html
                "\/dujia\/tours\/\\d+\.html":"touch-detail",
                //m.ly.com/dujia/booking/219985.html?isprerogativeprice=0&newactivityid=0&date=2015-12-03&isHot=1
                "\/dujia\/booking\/\\d+\.html":"touch-booking",
                //m.ly.com/dujia/zhuanti/riben/fusu.html => touch-zhuanti-ribenfusu
                "\/dujia\/zhuanti\/(\.*)\.html":"touch-zhuanti"
            },
            "weixin":{
                "\/ivacation[\/]?$": "wx-index",
                "\/ivacation\/.*\/(gentuan)\/.*$":"wx-list",
                "\/ivacation\/.*\/(ziyouxing)\/.*$":"wx-list",
                "\/ivacation\/tours\/\\d+\.html":"wx-detail",
                "\/ivacation\/booking\/\\d+\.html":"wx-booking",
                "\/ivacation\/zhuanti\/(\.*)\.html":"wx-zhuanti"
            },
            "localhost": "localhost"
        },
        getPageId: function(){
            var self = this,
                locHref = location.href.split("?")[0],
                pageidMap = self.pageidMap,
                hostMap = self.hostMap,
                host;
            for(var i in hostMap){
                if(!hostMap.hasOwnProperty(i)){
                    continue;
                }
                var regX = new RegExp(i);
                var matchHostArr = regX.exec(locHref);
                if(matchHostArr){
                    host = hostMap[i];
                    break;
                }
            }
            if(!(host && pageidMap[host])){
                return "other";
            }
            var pageidItemMap = pageidMap[host];
            for(var i in pageidItemMap){
                if(!pageidItemMap.hasOwnProperty(i)){
                    continue;
                }
                var matchArr = new RegExp(i).exec(locHref);
                if(matchArr){
                    var pageidItem = pageidItemMap[i],
                        speId = "";
                    if(matchArr[1]){
                        speId = "-"+matchArr[1].replace(/\//g,"-");
                    }
                    return pageidItem+speId;
                }
            }
        },
        init: function(){
            var self = this;
            if(!$.fn) {return;}
            var onEvent = $.fn.on;
            $.fn.on = function(){
                var arg = arguments,
                    _index,
                    func;
                for(var i = 0, len = arg.length -1; i<=len; i++){
                    if(typeof arg[i] === "function"){
                        func = arg[i];
                        _index = i;
                        break;
                    }
                }
                if(func){
                    arg[_index] = function(){
                        try{
                            return func.apply(this,arguments);
                        }catch(e){
                            self.log(e.stack|| e.message,"event."+arg[0]);
                        }

                    };
                }
                return onEvent.apply(this,arg);
            };
        },
        /**
         * @func module
         * @desc 模块监控
         * @param {object} instance 实例
         * @param {string} id 实例名称
         */
        module: function (instance, id) {
            /* jshint -W062 */
            var self = this;
            if (!instance ||self.getLogStatus()) {return;}
            var method;
            for (var name in instance) {
                if(instance.hasOwnProperty(name)){
                    method = instance[name];
                    if (typeof(method) === "function") {
                        instance[name] = function (name, method,id) {
                            return function () {
                                try {
                                    return method.apply(this, arguments);
                                } catch (e) {
                                    self.log("module:" + id + "|" + "function:" + name + "|message:" + e.stack||e.message,"module");
                                    return true;
                                }
                            };
                        }(name, method, id);
                    }
                }
            }
        },
        browserCfg: {
            def: {
                "ie": /trident\/([\w.]+)/i,
                "oldie": /msie\s([\w.]+)/i,
                "chrome": /chrome\/([\w.]+)/i,
                "firefox": /firefox\/([\w.]+)/i,
                "app": /TcTravel\/([\w.]+)/i,
                "weixin": /MicroMessenger\/([\w.]+)/i,
                "uc": /UCBrowser\/([\w.]+)/i,
                "baidubox": /baiduboxapp\/([\w.]+)/i,
                "qqbrowser": /mqqbrowser\/([\w.]+)/i
            },
            extra: {
                "chrome": /chrome\/([\w.]+)/i,
                "safari": /safari\/([\w.]+)/i
            }
        },
        getBrowser:function(ua,cfg){
            for(var i in cfg){
                var item = i,regX = cfg[item].exec(ua);
                if(regX){
                    return {
                        browser: item,
                        version: regX[1]||"0",
                        ua: ua,
                        bv: item+(regX[1]||"0"),
                        ip: "{ip}"
                    }
                }
            }
        },
        browser: function(ua){
            var self = this,
                browserCfg = self.browserCfg,
                def = self.getBrowser(ua,browserCfg.def);
            if(!def){
                def = self.getBrowser(ua,browserCfg.extra);
            }
            return def ||({
                browser: "other",
                version: "0",
                ua: ua,
                bv: "other",
                ip: "{ip}"
            });
        },
        ua: function(){
            var self = this;
            if(self.uaData){
               return self.uaData;
            }
            var ua = navigator.userAgent;
            self.uaData = $.extend({},self.platform(ua),self.browser(ua));
            return self.uaData;
        },
        platform: function(ua){
            var cfg = {
                "android": /android\s([\w.]+)/i,
                "ios": /iphone\sos\s([\w.]+)/i,
                "window": /Windows\sNT\s([\w.]+)/i
            };
            var platform = "other";
            for(var i in cfg){
                var item = i,regX = cfg[item].exec(ua);
                if(regX){
                    platform = item+(regX[1]||"0")
                }
            }
            return {
                platform: platform
            };
        },
        /**
         * @desc 获取设备的相关数据并发送
         * @param _msg {string} 错误信息
         * @param type {string} 错误类型
         * @param extraConf {string|object} 错误模块或者页面
         */
        log: function(_msg,type,extraConf){
            var self = this,
                pageid,
                isError = false,
                message;
            if(!_msg) {return;}
            if(typeof extraConf === "string"){
                pageid = extraConf;
            }else if (typeof extraConf === "object"){
                pageid = extraConf.pageid;
                isError = extraConf.error;
            }
            if(typeof _msg === "object"){
                _msg = self.stringify(_msg);
            }
            message = encodeURIComponent(_msg);
            if(!pageid){
                pageid = self.pageid ||self.getPageId();
            }
            var ua = self.ua();
            var data = {
                url: encodeURIComponent(location.href),
                width: screen.availWidth,
                height: screen.availHeight,
                errortype: type||"other",
                host: location.host,
                pageid: pageid||"0"
            };
            $.extend(data,ua);
            data.message = message;
            var msg = self._sub(data,isError);
            if(!self.getLogStatus()&& self.index(message)){
                self.send(self.prefix +"&frontlog="+msg);
            }
            if(self.isConsole()){
                console.error(msg);
            }
        }
    });

    function PerfMonitor(){
    }
    PerfMonitor.prototype = new ErrorMonitor();
    $.extend(PerfMonitor.prototype,{
        /**
         * @func load
         * @desc 监控zepto或者其他框架的绑定事件
         * @param {number} [pageid=0] 页面id
         */
        performance: function(pageid){
            var self = this,
                url = "http://www.ly.com/dujia/ajaxhelper/commonhandler.ashx?action=FRONTPERFORMANCE&type=FrontLogList",
                performance = win.performance || win.mozPerformance || win.msPerformance || win.webkitPerformance;

            if (!performance) {
                return;
            }
            if(!pageid){
                pageid = self.getPageId();
            }
            //相关参数的意思可以参考这张图
            // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/timing-overview.png
            var timing = performance.timing;
            var msg = {
                app: "用户本地耗时",
                dns: "DNS查找时间",
                network: "dns和连接耗时",
                send: "首包时间",
                backend: "server响应耗时",
                interactive: "可操作时间",
                frontend: "前端处理耗时",
                domReady: "domReady",
                firstPaint: "首次渲染",
                load: "完全加载",
                pageid: "页面id",
                "host": "当前域名"
            };
            var data = {
                app: timing.domainLookupStart - timing.navigationStart,
                // network
                dns: timing.domainLookupEnd - timing.domainLookupStart,     // DNS查找时间
                network: timing.requestStart - timing.domainLookupStart,
                send: timing.responseStart - timing.requestStart,
                backend: timing.responseEnd - timing.requestStart,
                frontend: timing.loadEventEnd - timing.responseEnd,
                interactive: timing.domInteractive - timing.navigationStart,
                domReady: timing.domContentLoadedEventStart - timing.navigationStart,
                load: timing.loadEventEnd - timing.navigationStart,
                pageid: pageid||0,
                host: location.host
            };

            // msFirstPaint is IE9+ http://msdn.microsoft.com/en-us/library/ff974719
            if (timing.msFirstPaint) {
                data.firstPaint = timing.msFirstPaint;
            }
            // http://www.webpagetest.org/forums/showthread.php?tid=11782
            if (win.chrome && win.chrome.loadTimes) {
                var loadTimes = win.chrome.loadTimes();
                data.firstPaint = Math.round((loadTimes.firstPaintTime - loadTimes.startLoadTime) * 1000);
            }
            if(win.console){
                var debugData = {};
                for(var i in data){
                    debugData[msg[i]] = data[i];
                }
                console.log(debugData);
            }
            var param = self.stringify(data);
                self.send(url+"&frontlog="+param);
            return data;
        },
        stat: function(type,param){
            var self = this,
                ua = self.ua(),
                _data = {
                    host: location.host,
                    errortype: "stat-"+type,
                    width: screen.availWidth,
                    height: screen.availHeight,
                    pageid: self.pageid||self.getPageId()||0,
                    url: encodeURIComponent(location.href)
                },
                data = $.extend(_data,ua),
                msg = self.stringify($.extend(data,param));
            self.send(self.prefix +"&frontlog="+msg);
        },
        init: function(pageid){
            var self = this;
            if(self.isInit){
                return;
            }
            self.isInit = true;
            var currentScript = document.currentScript;
            if(currentScript){
                pageid = currentScript.getAttribute("pageid");
            }
            self.pageid = pageid;
            $(win).on("beforeunload",function(){
                self.performance(pageid);
            });
            //如果不需要在控制台显示
            if(!self.getLogStatus()){
                win.onerror = function(message,url,line){
                    self.log("message:"+message+","+"url:"+url+",line:"+(line|""),"uncaught");
                    return true;
                };
            }
            if(win.monitorStack && win.monitorStack.length){
                self.log(win.monitorStack.join(","),"404");
                win.monitorStack = [];
            }
            self.stat("pv");
        }
    });
    var monitor = new PerfMonitor();
    //导入的方法
    function exportFunc(func,speName){
        if(!speName) {
            alert("导出方法有误,模块名称未定义");
            return;
        }
        var funcName = func.name||(speName&&speName.split("/")[0]);
        "undefined" !== typeof module && module.exports ? module.exports = func : "function" === typeof define ? define(speName,function(){return func;}): win[funcName+"Module"] = func;
    }
    win.Monitor = monitor;
    monitor.init();
    exportFunc(monitor,"monitor/0.1.0/index");
}(window));
