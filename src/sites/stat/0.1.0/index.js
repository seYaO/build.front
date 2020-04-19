(function (win) {
    var STATKIT = win.STATKIT = (win.STATKIT || {});
    /****************工具方法********************/
    // Statutil
    var _ = STATKIT['statutil'] = (STATKIT['statutil'] || {});
    // 加载脚本和样式
    _.require = function (path, callback) {
        var path = path.replace(/\s/g, ''),
            isCSS = /\.css$/.test(path);

        var head = $('head')[0],
            node = null,
            nodeid = 'statid' + (+new Date());
        if (isCSS) {
            node = document.createElement('link');
            node.rel = 'stylesheet';
            node.href = path;
        } else {
            node = document.createElement('script');
            node.src = path;
        }
        node.id = nodeid;

        // 状态判别
        var isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536;
        var supportOnload = "onload" in node;
        if (isCSS && (isOldWebKit || !supportOnload)) {
            pollCss();
            return;
        }
        if (supportOnload) {
            node.onload = onLoad;
            node.onerror = function () {
                onLoad();
            }
        } else {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    onLoad();
                }
            }
        }
        // 添加
        head.appendChild(node);
        // 触发回调
        function onLoad() {
            //重置状态
            node.onload = node.onerror = node.onreadystatechange = null;
            if (!isCSS) {
                head.removeChild(node)
            }
            node = null;
            callback && callback();
        }

        // css轮询回调
        var pollTime = 1000 * 20 / 200;
        //
        function pollCss() {
            var isLoaded,
                sheet = node.sheet;
            if (isOldWebKit) {
                if (sheet) {
                    isLoaded = true
                }
            } else {
                try {
                    if (sheet.cssRules) {
                        isLoaded = true
                    }
                } catch (ex) {
                    if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                        isLoaded = true
                    }
                }
            }
            //
            if (isLoaded) {
                callback && callback();
            } else {
                if (--pollTime > 0) {
                    setTimeout(pollCss, 20)
                }
            }
        }
    };
    // 获取cookie
    _.cookie = function (h, m, j) {
        // j:[expires,path,secure]
        if (typeof m != "undefined") {
            j = j || {};
            if (m === null) {
                m = "";
                j.expires = -1;
            }
            var f = "";
            if (j.expires && (typeof j.expires == "number" || j.expires.toUTCString)) {
                var d;
                if (typeof j.expires == "number") {
                    d = new Date();
                    d.setTime(d.getTime() + (j.expires * 24 * 60 * 60 * 1000));
                } else {
                    d = j.expires;
                }
                f = "; expires=" + d.toUTCString();
            }
            var k = j.path ? "; path=" + j.path : "";
            var e = j.domain ? "; domain=" + j.domain : "";
            var l = j.secure ? "; secure" : "";
            document.cookie = [h, "=", encodeURIComponent(m), f, k, e, l].join("");
        } else {
            var c = null;
            if (document.cookie && document.cookie != "") {
                var b = document.cookie.split(";");
                if (b) {
                    for (var g = 0; g < b.length; g++) {
                        var a = $.trim(b[g]);
                        if (h) {
                            if (a.substring(0, h.length + 1) == (h + "=")) {
                                c = decodeURIComponent(a.substring(h.length + 1));
                                break;
                            }
                        }
                    }
                }
            }
            return c;
        }
    };
    // 扁平化参数
    _.flatParam = function (param) {
        var newParam = $.extend({}, param);
        for (var i in param) {
            var item = param[i];
            if (item && item.indexOf && item.indexOf("-") > -1) {
                var itemArr = item.split("-");
                for (var n = 0; n <= itemArr.length - 1; n++) {
                    newParam[i + n] = itemArr[n];
                }
            } else {
                newParam[i] = item;
            }
        }
        return newParam;
    };
    // 获取参数
    _.getParam = function (url, name) {
        var reg = new RegExp("[\?&](" + name + "=([^&#$]*))", "i"),
            rec1 = reg.exec(url);
        if (rec1) {
            return rec1[2];
        } else {
            return "";
        }
    };
    // 添加参数
    _.addParam = function (url, name, value) {
        url = url.replace(/(^\s*)|(\s*$)/g, "");
        var urlRep = /javascript:/i;
        if (urlRep.test(url)) {
            return url;
        }
        var reg = new RegExp("[\?&](" + name + "=([^&#$]*))", "i"),
            //查找url中是否包含正赋值参数
            rec1 = reg.exec(url),
            //查找url中是否包含哈希
            rec2 = url.split("#"),
            param = name + "=" + value,
            ret = url;
        if (rec1) {
            ret = url.replace(rec1[1], name + "=" + rec1[2]);
        } else {
            if (/\?/g.test(url)) {
                if (rec2.length > 1) {
                    ret = rec2[0] + "&" + param + "#" + rec2[1];
                } else {
                    ret = rec2[0] + "&" + param;
                }
            } else {
                if (rec2.length > 1) {
                    ret = rec2[0] + "?" + param + "#" + rec2[1];
                } else {
                    ret = rec2[0] + "?" + param;
                }
            }
        }
        return ret;
    };

    /****************发送方法********************/
    var Statsend = STATKIT['statsend'] = (STATKIT['statsend'] || {});
    // 配置
    Statsend.config = {
        prefix: "//wx.17u.cn/intervacation/stat",
        // prefix: "//127.0.0.1:2222/stat",
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
    };
    // 获取浏览器参数
    Statsend.getBrowser = function (ua, cfg) {
        for (var i in cfg) {
            var item = i, regX = cfg[item].exec(ua);
            if (regX) {
                return {
                    browser: item,
                    version: regX[1] || "0",
                    ua: ua,
                    bv: item + (regX[1] || "0")
                }
            }
        }
    };
    // 浏览器参数
    Statsend.browser = function (ua) {
        var self = this,
            browserCfg = self.config.browserCfg,
            def = self.getBrowser(ua, browserCfg.def);
        if (!def) {
            def = self.getBrowser(ua, browserCfg.extra);
        }
        return def || ({
            browser: "other",
            version: "0",
            ua: ua
        });
    };
    // ua参数
    Statsend.ua = function () {
        var self = this;
        if (self.uaData) {
            return self.uaData;
        }
        var ua = navigator.userAgent;
        self.uaData = $.extend({}, self.platform(ua), self.browser(ua));
        return self.uaData;
    };
    // 平台参数
    Statsend.platform = function (ua) {
        var cfg = {
            "android": /android\s([\w.]+)/i,
            "ios": /iphone\sos\s([\w.]+)/i,
            "window": /Windows\sNT\s([\w.]+)/i
        };
        var platform = "other";
        for (var i in cfg) {
            var item = i, regX = cfg[item].exec(ua);
            if (regX) {
                platform = item + (regX[1] || "0")
            }
        }
        return {
            platform: platform
        };
    };
    //针对JSON.stringify增加兼容
    Statsend.stringify = function (data) {
        if ((typeof data).toLowerCase() === "string") {
            return data;
        }
        if (win.JSON && JSON.stringify) {
            return JSON.stringify(data);
        }
        return '{"message":"不支持stringify"}';
    };
    //创建一个图片用来发送统计
    Statsend.send = function (url) {
        var img = new Image(),
            id = "__img__" + Math.random();
        win[id] = img;
        img.onload = img.onerror = function () {
            win[id] = null;
        };
        img.src = url;
        img = null;
    };
    // 统计发送
    Statsend.stat = function (type, param) {
        var self = this,
            ua = self.ua(),
            _data = {
                host: location.host,
                errortype: "stat-" + type,
                url: encodeURIComponent(location.href),
                jobnumber: $ && $.cookie && $.cookie("jobnumber") || ""
            },
            data = $.extend(_data, ua),
            msg = self.stringify($.extend(data, param));
        self.send(self.config.prefix + '?frontlog=' + msg);
    };

    /****************路径方法********************/
    // Statxpath
    var Xpath = STATKIT['statXpath'] = STATKIT['statXpath'] || {};
    // 配置
    Xpath.config = {
        headchar: '!',
        indexChar: '^',
        limit: 6,
        sepchar: '|'
    }
    // 获取
    Xpath.get = function (elem) {
        var self = this,
            config = self.config;
        //
        var pathList = self.parents(elem);
        pathList.reverse();
        var xpath = config.headchar;
        for (var i = 0; i < pathList.length; i++) {
            xpath += pathList[i].sizzle;
            if (pathList[i].index) {
                xpath += config.indexChar + pathList[i].index;
            }
            if (i < pathList.length - 1) {
                xpath += config.sepchar;
            }
        }
        return xpath;
    };
    // 父节点获取
    Xpath.parents = function (elem) {
        var self = this;
        // 限制6层选择器
        var limit = self.config.limit;
        //
        var matched = [],
            nodeinfo = null;
        //
        while ((limit--) > 0 && elem && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
                nodeinfo = {};
                nodeinfo.elem = elem;
                //
                var rclass = /[\t\r\n\f]/g;
                //
                var xid = elem.id;
                if (xid) {
                    nodeinfo.sizzle = "*" + xid;
                    // 当有唯一id时清空限制
                    limit = 0;
                } else {
                    var xclass = elem.className, xclassFlag = false;
                    if (xclass) {
                        var xclassList = xclass.replace(rclass, ' ').split(' ');
                        var xclassLen = 0;
                        var xclassTxt = '';
                        for (var i = 0; i < xclassList.length; i++) {
                            if (xclassList[i] && !(/hover|active|clearfix|clear/i.test(xclassList[i]))) {
                                xclassTxt += xclassList[i];
                                break;
                            }
                        }
                        if (xclassTxt) {
                            nodeinfo.sizzle = '.' + xclassTxt;
                            // 获取index
                            nodeinfo.index = self.index(elem, {
                                type: 'class',
                                sizzle: xclassTxt
                            });
                            var xclassFlag = true;
                        }
                    }
                    // 当没获取到class时走tagname
                    if (!xclassFlag) {
                        var xtagname = elem.tagName.toLowerCase();
                        nodeinfo.sizzle = xtagname;
                        // 获取index
                        nodeinfo.index = self.index(elem, {
                            type: 'tagname',
                            sizzle: xtagname
                        });
                    }
                }
                // 当最外级不是唯一存在再加一级
                if (limit === 0 && nodeinfo.index) {
                    limit++;
                }
                //
                matched.push(nodeinfo);
            }
            //
            elem = elem['parentNode'];
        }
        return matched;
    };
    // 序号获取  option type sizzle
    Xpath.index = function (elem, option) {
        var type = ['default', 'class', 'tagname'];
        //
        option = option || {};
        option.type = option.type.toLowerCase() || type[0];
        //
        var matched = [];
        while ((elem = elem['previousSibling']) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
                if (option.type == type[0]) {
                    matched.push(elem);
                }
                if (option.type == type[1]) {
                    //
                    var rclass = /[\t\r\n\f]/g;
                    //
                    var selector = option.sizzle;
                    var elemClassName = " " + elem.className + " ";
                    var selector = " " + selector + " ";
                    if ((elemClassName).replace(rclass, " ").indexOf(selector) >= 0) {
                        matched.push(elem);
                    }
                }
                if (option.type == type[2]) {
                    if (elem.tagName.toLowerCase() == option.sizzle) {
                        matched.push(elem);
                    }
                }
            }
        }
        if (option.subs) {
            return matched;
        } else {
            return matched.length;
        }

    }
    /****************性能方法********************/
    //
    var Statperf = STATKIT['statperf'] = STATKIT['statperf'] || {};
    // 
    Statperf.config = {
        timestart: (new Date() - 1),
        effectStay: {
            // 
            maxEffect: 1000 * 60 * 5,
            total: 0,
            cache: 0,
            pretime: null
        }
        // msg: {
        //     app: "用户本地耗时",
        //     dns: "DNS查找时间",
        //     network: "dns和连接耗时",
        //     send: "首包时间",
        //     backend: "server响应耗时",
        //     interactive: "可操作时间",
        //     frontend: "前端处理耗时",
        //     domReady: "domReady",
        //     firstPaint: "首次渲染",
        //     load: "完全加载",
        //     pageid: "页面id",
        //     "host": "当前域名"
        // }
    };
    // 总事件促发
    Statperf.setPerfEvent = function () {
        var self = this;
        self.calcStayTime();
    };
    // 计算有效停留时间
    Statperf.calcStayTime = function () {
        var self = this,
            config = self.config,
            effectStay = config.effectStay;
        // 
        if (!effectStay.pretime) {
            effectStay.pretime = config.timestart;
            effectStay.acttime = config.timestart;
        }
        // 
        var newEfectStay = (new Date() - 1);
        // 当现在时间超过限定记录时间
        if (newEfectStay - effectStay.maxEffect > effectStay.pretime) {
            effectStay.total += effectStay.cache;
            effectStay.cache = 0;
            effectStay.acttime = newEfectStay;
            effectStay.pretime = newEfectStay;
        } else {
            effectStay.cache = newEfectStay - effectStay.acttime;
            effectStay.pretime = newEfectStay;
        }
    };
    // 
    Statperf.sendPerf = function (perfParam) {
        var self = this,
            config = self.config,
            performance = win.performance || win.mozPerformance || win.msPerformance || win.webkitPerformance;
        if (!performance) {
            return;
        }
        //相关参数的意思可以参考这张图
        // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/timing-overview.png
        var timing = performance.timing;
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
            load: timing.loadEventEnd - timing.navigationStart
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
        // 页面停留时间
        data.pageStay = (new Date() - 1) - config.timestart;
        // 页面有效停留时间
        data.effectStay = config.effectStay.total + config.effectStay.cache;
        // 额外参数
        data.url = encodeURIComponent(location.href);
        data.pageid = STATKIT.config.param.pageid;
        data.jobnumber = $ && $.cookie && $.cookie("jobnumber") || "";
        // 设定
        // data.key = 'frontPerf';
        //  
        var statsend_url = Statsend.config.prefix;
        var statsend_data = Statsend.stringify($.extend(data, perfParam || {}));
        Statsend.send(statsend_url + '?key=frontPerf&frontlog=' + statsend_data);
    };
    // 

    /****************业务方法********************/
    // 获取refid
    STATKIT.getUrlRefId = function () {
        var url = location.href,
            hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
        return hasRefId && hasRefId[1] || "";
    };
    // 获取refid
    STATKIT.getRefId = function () {
        var urlRefId = this.getUrlRefId();
        if (urlRefId) {
            _.cookie("17uCNRefId", urlRefId);
            return urlRefId;
        } else {
            var cookieRefId = _.cookie("17uCNRefId") || "";
            var reRefId = /\bRefId=(\d*)\b/;
            var hasRefId = reRefId.exec(cookieRefId);
            if (hasRefId) {
                _.cookie("17uCNRefId", hasRefId[1]);
                return hasRefId[1];
            } else {
                return /\D/.test(cookieRefId) ? '' : cookieRefId;
            }
        }
    };
    // 获取pageid
    STATKIT.getPageId = function () {
        var pageid = $("html").attr("trace");
        return pageid;
    };
    /****************流程方法********************/
    // 配置
    STATKIT.config = {
        exclude: ['#header', '#footer', '.stat-toolbar-wrapper', '.stat-ui-root'],
        policy: {
            pv: true,
            spm: true,
            biz: true,
            form: true,
            perf: true
        },
        spminfo: {
            key: 'spmid',
            sep: '~',
            attr: 'stat-spm',
            host: win.location.host
        },
        forminfo: {
            sep: '~',
            head: '@'
        },
        statinfo: {
            point: 'statspot',
            trace: 'statkit',
            form: 'statform'
        },
        bizinfo: {
            point: 'trackspot',
            type: 'tracktype',
            track: 'trackkit'
        }
    }
    // 初始
    STATKIT.initial = function (options, callback) {
        var self = this,
            config = self.config;
        options = options || {};
        // 全局参数
        config.globalParam = options.param || {};
        // quanju
        if (options.policy) {
            $.extend(config.policy, options.policy);
        }
        // Xpath 配置
        if(options.xpath){
             $.extend(Xpath.config, options.xpath || {});
        }
        // 异步执行统计
        win.setTimeout(function () {
            // 
            $.extend(config.globalParam, win.__stat_param__ || {});
            // 
            config.spmParam = self.getSpotSPM() || {};
            // 
            config.param = $.extend({}, config.spmParam, config.globalParam);
            // 
            config.extraParam = {
                "refid": self.getRefId(),
                "refer": encodeURIComponent(document.referrer || ""),
                "pageid": self.getPageId()
            }
            $.extend(config.param, config.extraParam);
            //
            self.initStatPv();
            self.initStatPerf();
            self.initStatSpot();
            //加载统计ui
            self.initStatUi();
            // 
            callback && callback.call(this);
        }, 1000);
    };
    // 初始pv统计
    STATKIT.initStatPv = function () {
        var self = this,
            config = self.config;
        //
        if (config.policy.pv) {
            Statsend.stat("pv", config.param);
        }
    };
    // 初始performance统计
    STATKIT.initStatPerf = function () {
        var self = this,
            config = self.config;
        // 
        if (config.policy.perf) {
            // 当关闭时加载(ios beforeunload不促发)
            $(win).on("beforeunload unload", function () {
                if (!self.isTriggerUnload) {
                    self.isTriggerUnload = true;
                    Statperf.sendPerf(config.globalParam);
                }
            });
        }
    };
    // 初始spot统计
    STATKIT.initStatSpot = function () {
        var self = this,
            config = self.config;
        var superWrapper = $(document);
        // 给所有统计热点添加事件
        superWrapper.on("mousedown", "a,button,[" + config.statinfo.point + "],[" + config.bizinfo.point + "],.J_Trace,.J_trace", function (e) {

            self.setSpotEvent(this);
            // 
            Statperf.setPerfEvent();
        });
        // biz统计更改
        superWrapper.on("mouseenter", "[" + config.bizinfo.point + "]",function(){
           self.setBizTrack(this,'hover');
        });
        //
        superWrapper.on("mousedown", "[" + config.statinfo.form + "]", function (e) {
            self.setFormEvent(this);
        });
    };
    // 初始统计ui
    STATKIT.initStatUi = function () {
        var self = this;
        // 当不在iframe中终止
        if (window.self == window.top) {
            return false;
        }
        var statToken = _.getParam(window.location, 'stattoken');
        var statSessionStorage = window.sessionStorage && sessionStorage.getItem("statToken");
        if (statToken) {
            window.sessionStorage && sessionStorage.setItem("statToken", statToken);
        } else {
            if (statSessionStorage) {
                statToken = statSessionStorage;
            } else {
                return false;
            }
        }
        //
        $.ajax({
            dataType: "jsonp",
            url: 'http://stat.1024.team/board/checkstattoken?stattoken=' + statToken,
            success: function (datas) {
                var data = datas.data;
                if (datas.code == 4000) {
                    _.require(data.css);
                    _.require(data.js);
                }
            },
            failure: function () {
                window.console && window.console('验证token失败');
            }
        });
    };
    // 是否为不统计区域
    STATKIT.isExclude = function (elem) {
        var self = this,
            config = self.config,
            exclude = config.exclude || [];
        //
        var flag = false, Jelem = $(elem);
        for (var i = 0; i < exclude.length; i++) {
            if (Jelem.parents(exclude[i]).length > 0) {
                flag = true;
            }
        }
        return flag;
    }
    // 设置统计热点信息
    STATKIT.setSpotEvent = function (elem) {
        var self = this,
            config = self.config;
        //
        if (self.isExclude(elem)) {
            return false;
        }
        var spmAttr =  $(elem).attr('rel');
        if(spmAttr == 'nospm'){
              return false;
        }

        var spotTrace = self.getSpotTrace(elem);
        // 将pageid添加进trace
        if (config.param.pageid) {
            spotTrace.unshift(config.param.pageid);
        }
        // 当热点本身有trace
        var elemTrace = $(elem).attr(config.statinfo.trace);
        if (elemTrace) {
            //检查是否是单复杂度的,防止trace名称重复,追加父元素的trace
            if (/^[A-z]+$|^\d+$|auto__\d+$/.exec(elemTrace)) {
                elemTrace = spotTrace[spotTrace.length - 1] + "___" + elemTrace;
            }
            spotTrace.push(elemTrace);
        } else {
            // 本身元素不存在trace将xpath添加入
            var spotXpath = self.getSpotXpath(elem);
            spotTrace.push(spotXpath);
        }
        // 设置spm
        self.setSpotSPM(elem, spotTrace);
        // 设置bitrack
        self.setBizTrack(elem);
        // 发送热点信息
        self.sendSpotInfo(elem, spotTrace);
    };
    // 设置form热点信息
    STATKIT.setFormEvent = function (elem) {
        var self = this,
            config = self.config;
        //
        if (self.isExclude(elem)) {
            return false;
        }
        //
        var Jself = $(elem);
        var spotTrace = self.getSpotTrace(elem);
        // 当热点本身有formtrace
        var elemTrace = Jself.attr(config.statinfo.form);
        if (elemTrace !== spotTrace[spotTrace.length - 1]) {
            return false;
        }
        var formroot = Jself.parents('[' + config.statinfo.trace + '=' + elemTrace + ']');
        if (!formroot.length) {
            return false;
        }
        var spotForm = config.forminfo.head + self.getSpotForm();
        self.sendSpotInfo(elem, spotForm);
    }
    // 获取trace
    STATKIT.getSpotTrace = function (elem) {
        var self = this,
            config = self.config;
        var Jelem = $(elem),
            traceList = [];
        //
        var elemParents = Jelem.parents("[" + config.statinfo.trace + "]"),
            parentsLen = elemParents.length;
        if (parentsLen) {
            elemParents.each(function () {
                traceList.push(this.getAttribute(config.statinfo.trace));
            });
            traceList.reverse();
        }
        return traceList;
    };
    // 获取xpath
    STATKIT.getSpotXpath = function (elem) {
        var self = this;
        return Xpath.get(elem);
    };
    // 获取form
    STATKIT.getSpotForm = function (elem) {
        var self = this,
            config = self.config;
        var formData = [];
        elem.find('input').each(function () {
            formData.push($(this).val() || 0);
        });
        return formData.join(config.forminfo.sep);
    };
    // 获取spm
    STATKIT.getSpotSPM = function () {
        var self = this,
            config = self.config;

        //当不需要加载spm时
        if (!config.policy.spm) {
            return;
        }
        //  
        var url = location.href,
            spmObj = {},
            spmid = _.getParam(url, config.spminfo.key);
        //若不存在spmid查找refer的spmid 
        if (!spmid) {
            spmid = _.getParam((document.refer || ''), config.spminfo.key);
        }
        if (spmid) {
            spmObj = {
                spm: spmid,
            };
        }
        return spmObj;
    };
    // 设置spm
    STATKIT.setSpotSPM = function (elem, traceList) {
        var self = this,
            config = self.config,
            spmid = config.param.spm;

        //当不需要加载spm时
        if (!config.policy.spm) {
            return;
        }
        // 
        var Jelem = $(elem),
            JelemAttr = Jelem.attr("data-spm"),
            JelemHref = Jelem.attr('href');
        JelemSpm = Jelem.parents('[' + config.spminfo.attr + ']');
        var spmVal = '',
            spmValList = [],
            traceListLen = traceList.length;
        // 如果已存在spm属性不继续执行 
        if (JelemAttr || /^javascript:|^#|spmid=/.test(JelemHref)) {
            return;
        }
        // 当href的url和原有host不同时不传递
        if (config.spminfo && /^[https?:]*?\/\//i.test(JelemHref) && !(JelemHref.indexOf(config.spminfo.host) > -1)) {
            return;
        }
        // url存在spmid且没有重置属性  
        if (spmid) {
            if (!JelemSpm.length) {
                spmVal = spmid;
            }
        }
        // 根据traceList生成spmid
        if (!spmVal) {
            spmValList[0] = traceList.length > 1 ? traceList[0] : '';
            spmValList[1] = traceList[traceListLen - 1] || '';
            if (traceList.length > 2) {
                spmValList.push(traceList[traceListLen - 2]);
            }
            // if (traceListLen >= 1) {
            //     spmValList.push(traceList[traceListLen - 1])
            //     if (traceListLen >= 2) {
            //         spmValList.unshift(traceList[0]);
            //     }
            //     if (traceListLen >= 3) {
            //         spmValList.splice(1, 0, traceList[traceListLen - 2]);
            //     }
            // }
            spmVal = spmValList.join(config.spminfo.sep);
        }
        // 将spmid添加如链接
        if (JelemHref) {
            var newHref = _.addParam(JelemHref, config.spminfo.key, spmVal);
            Jelem.attr("href", newHref);
        } else {
            Jelem.attr("data-spm", spmVal);
        }
    };
    // biz统计
    STATKIT.setBizTrack = function (elem, type) {
        var self = this,
            config = self.config,
            pageid = config.param.pageid;
        // 当不需要统计biz时
        if (!config.policy.biz) {
            return;
        }
        // 
        var trackVal = elem.getAttribute(config.bizinfo.point);
        if (!trackVal) {
            return;
        }
        var trackType = elem.getAttribute(config.bizinfo.type);
        if(type){
            if(!trackType || (trackType !== type)){
                return;
            }
        }
        // 
        var moduleList = $(elem).parents('[' + config.bizinfo.track + ']');
        var moduleid = '';
        if (moduleList.length) {
            moduleid = moduleList.eq(0).attr(config.bizinfo.track) || '';
        }
        // 
        type = type || 'click';
        try {
            window._tcTraObj && _tcTraObj._tcTrackEvent(pageid, type, moduleid, trackVal);
        } catch (e) { }
    };
    // 发送热点信息
    STATKIT.sendSpotInfo = function (elem, data, options) {
        var self = this,
            config = self.config;
        options = options || {};
        //
        var spotList = data;
        var traceObj = config.param || {};
        for (var i = 0; i < spotList.length; i++) {
            traceObj["trace" + i] = spotList[i];
        }
        if (options.lazy) {
            window.__stat_stack__ = {
                method: "stat",
                type: "trace",
                data: traceObj
            }
        } else {
            Statsend.stat("trace", traceObj);
        }
    };
})(window);

