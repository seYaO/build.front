/**
 * @desc:统计
 * @author: Jilly
 * @mail: cjl10120@ly.com
 * @createTime: 2015/7/23 10:33
 * @version: 0.3.0
 */
(function () {
    var stat = {},
        isFish = !(window.jQuery||window.Zepto),
        $ = isFish?window.fish:(window.jQuery||window.Zepto),
        mvqArr = [];
    stat._cookie = (function () {
        return $.cookie || ($.cookie = function (h, m, j) {
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
                        if(b){
                            for (var g = 0; g < b.length; g++) {
                                var a = $.trim(b[g]);
                                if(h){
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
            });
    })();
    stat.cookie = function(a,b){
        var func;
          if(isFish){
              if(b){
                  func = $.cookie.set;
              }else{
                  func = $.cookie.get;
              }
          }else{
              func = stat._cookie;
          }
        return func.apply($,arguments);
    };
    stat.getRefid = getRefId;
    stat.getUrlRefId = getUrlRefId;

    stat.getWXid = function(){
        var cookie = stat.cookie("WxUser")||"",
            matchwx = /openid=([^&]+)/i.exec(cookie);
        if (matchwx && matchwx[1]) {
            return matchwx[1];
        }else{
            return ''
        }
    };

    stat.formatPageview = function(pv) {
        var openid = stat.getWXid();
        if(openid === '') {
            return pv;
        } else {
            return openid + '||' + pv;
        }
    };

    var _extend = function(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        if (source[prop].constructor === Object) {
                            if (!obj[prop] || obj[prop].constructor === Object) {
                                obj[prop] = obj[prop] || {};
                                _extend(obj[prop], source[prop]);
                            } else {
                                obj[prop] = source[prop];
                            }
                        } else {
                            obj[prop] = source[prop];
                        }
                    }
                }
            }
        });
        return obj;
    };
    var getParam = function(a, b) {
        for (var c, d, e = a.split("&"), f = b ? void 0 : {}, g = 0,h = e.length;  h > g; g++)
            if (c = e[g])
                if (c = c.split("="), d = c.shift(), b) {
                    if (b === d) return c.join("=")
                } else f[d] = c.join("=");
        return f
    };
    var getNmemberId = (function() {
        return getNmemberId || function(){
            var a = stat.cookie("nus"),
                  c = "0";
            return a && (c = getParam(a, "userid"), c && "undefined" !== c || (c = "0")), c
        };
    })();
    stat.getQdid = function(){
        return window.getQdid && window.getQdid()|| "";
    }
    stat.getParamFromUrl = function(str) {
        return getParam(window.location.search.replace('?', ''), str);
    };
    stat.extend = (function(){
        if(!isFish) {
            return $.extend;
        } else {
            return _extend;
        }
    })();
    stat.init = function (cfg) {
        stat._init(cfg);
    };
    stat._init = function (cfg) {
        var self = this;
        cfg = cfg||{};
        window.setTimeout(function () {
            var extraParam = self.extraParam = stat.extend({},cfg.param||{},{
                "refid": stat.getRefid(),
                "refer": encodeURIComponent(document.referrer || ""),
                "abTestNum": parseInt($.cookie('abTest')) || ""
            });
            for (var key in cfg) {
                if(key === "param"){
                    continue;
                }
                if (key === "baidu") {
                    window.baidu = stat.extend({}, conf[key].param, cfg[key]);
                    window._hmt = cfg[key].hmt;
                }
                if (key === "vst") {
                    var _tcq = stat.extend({}, conf.vst.param, _.object(cfg[key]));
                    // 页面配置的时候写成了"0" 导致extend的时候无法覆盖
                    if (_tcq._userId == 0) {
                        _tcq._userId = getNmemberId();
                    }
                    window._tcq = _.pairs(_tcq);
                }
                if (key === "pvConfig") {
                    window.pvConfig = stat.extend({}, conf[key].param, cfg[key]);
                }
                if (key === "_tcHotmapx") {
                    window._tcHotmapx = stat.extend({}, conf[key].param, cfg[key]);
                }
                if (key === "__zpSMConfig") {
                    (window.__zpSMConfig = window.__zpSMConfig||[]).push(stat.extend({}, conf[key].param, cfg[key]));
                }
                if (key === "mvl") {
                    if(window.isStatInit){
                        stat.mvlInit(cfg);
                    }else{
                        mvqArr = window._mvq = cfg[key]._mvq;
                    }
                }
                if (key !== "mvl") {
                    self.createScript(key, conf[key].url);
                } else if (cfg.mvl.isImmediateExcu && key === "mvl") {
                    self.createScript(key, conf[key].url);
                }
            }
            if(!window.isStatInit){
                window.Monitor && window.Monitor.stat && window.Monitor.stat("pv",extraParam);
                self.initTrace();
                window.isStatInit = true;
            }
        }, 0);
    };
    stat.initTrace = function(){
        var self=this;
        if(isFish) return;
        $(document).on("mousedown","a,.J_Trace,.J_trace",function(e){
            var $el= $(this);
            var arr=[];
            var elParents = $el.parents("[trace]");
            if(elParents && elParents.length){
                var elTrace = $el.attr("trace"),
                    hasHref = (($el[0].host||$el.attr("data-url"))),
                    //判断是否需要立即发送
                //当class=J_trace或者a的target=blank时,为真
                    isTargetBlank = ($el.attr("target") === "_blank" ||!hasHref||this.className.toLowerCase().indexOf("j_trace")>-1);
                if(elTrace){
                    //检查是否是单复杂度的,防止trace名称重复,追加父元素的trace
                    if(/^[A-z]+$|^\d+$/.exec(elTrace)){
                        elTrace = elParents[0].getAttribute("trace")+ "___" + elTrace;
                    }
                    hasHref && (elTrace = "J_"+elTrace);
                }else{
                    hasHref && (elTrace = "J_NONE");
                }
                arr.push(elTrace);
                elParents.each(function(){
                     arr.push(this.getAttribute("trace"));
                });
                arr.push(isTargetBlank);
                arr.reverse();
                self.trace.apply($el,arr);
            }
        });
        //如果url包含debug,则开启埋点检测模式
        if(location.href.indexOf("debug")>-1){
            var script = document.createElement('script');
            script.async = "async";
            script.src = "http://10.14.84.206/demo/trace.js";
            document.getElementsByTagName("head")[0].appendChild( script );
        }
    };

    stat.traceBiz = function(pageid,moduleid,value){
        try{
            _tcTraObj._tcTrackEvent(pageid,moduleid,value);
        }catch(e){
            window.Monitor && Monitor.log(e.track| e.message,"trace");
        }

    };
    stat.trace = function(){
        var $el = this,
            args = [].slice.call(arguments,1),
            isTargetBlank = arguments[0],
            traceObj = stat.extraParam||{};
        for(var i = 0, len = args.length -1; i<=len; i++){
            traceObj["trace"+i] = args[i];
        }
        if(isTargetBlank){
            Monitor && Monitor.stat && Monitor.stat("trace",traceObj);
        }else{
            window.statStack = {
                method: "stat",
                type: "trace",
                data: traceObj
            }
        }
        var dataTrace = $el.attr("data-trace");
        if(dataTrace && args[1]){
            stat.traceBiz(args[0],args[1],dataTrace);
        }
    };
    stat.mvlInit = function (cfg) {
        var self = this;
        var goodinfo = [];
        if (cfg) {
            goodinfo = ['$addGoods',
                /*分类id*/ '',
                /*品牌id*/ '',
                /*商品名称*/ document.title.split("_") && document.title.split("_")[0],
                /*商品ID*/ cfg.Cate,
                /*商品售价*/ cfg.TcPrice,
                /*商品图片url*/ cfg.ImgUrl,
                /*分类名*/ '',
                /*品牌名*/ '同程旅游',
                /*商品库存状态1或是0*/ 1,
                /*网络价*/ cfg.MarketPrice,
                /*收藏人数*/ '',
                /*商品下架时间*/ '',
                /*一级分类名*/'',
                 /*二级分类名*/'',
                /*三级分类名*/''];
            mvqArr.push(goodinfo);
            window._mvq = mvqArr;
            self.createScript("mvl", conf.mvl.url);
        }
    };

    /**
     * conf {pvConfig:{},baidu:[{},{}],vst:{},mvl:{}}
     **/
    /**
     * @desc 统计url
     * @param baidu 百度统计
     * @param pvConfig pv统计
     * @param vst 同程统计
     * @param mvl 聚效统计
     **/
    var conf = {
        "baidu": {
            "url": "//hm.baidu.com/hm.js?ca5679d0986b1f42f800098b798c7008",
            "param": {
                "parameter": "0",
                "hmt": []
            }
        },
        "pvConfig": {
            //"url": "pvcount_pc.js",        //链接url
            "param": {
                "url": "//www.ly.com/dujia/AjaxHelper/PvHandler.ashx",
                "PublicPlatId": "1",
                "PageId": "1",
                "LineId": "0",
                "ActivityId": "0",
                "ActivityPeriodId": "0",
                "ModuleId": "0",
                "PVSource": "1",
                "ak": ""
            }
        },
        "vst": {
            "url": "//vstlog.17usoft.com/vst.ashx",
            "param": {
                "_userId": getNmemberId()
            }
        },
        "_tcHotmapx": {
            "param": {
                "pid": "431",
                "sp": "100"
            }
        },
        "mvl": {
            "url": "https:" === document.location.protocol ? "https://static-ssl.mediav.com/mvl.js" : "http://static.mediav.com/mvl.js",
            "param": {
                "_mvq": [],
                "isImmediateExcu": true
            }
        },
        "__zpSMConfig": {
            "url": ("https:" === document.location.protocol ? "https:" : "http:") + "//cdn.zampda.net/s.js",
            "param": {
                "query": [],
                "args": {}
            }
        }
    };
    stat.param = function(json){
        var arr = [];
        for(var i in json){
            arr.push(i+"="+json[i]);
        }
        return arr.join("&");
    };
    stat.pvInit = function () {
        var pvParam = window.pvConfig,
            param;
        var url = pvParam.url;
        delete(pvParam.url);
        param = url + "?"+stat.param(pvParam);
        stat.pvSave(param);
    };
    stat.pvSave = function (url) {
        var img = new Image(),
            id = "__img__" + Math.random();
        window[id] = img;
        img.onload = img.onerror = function () {
            window[id] = null;
        };
        img.src = url;
        img = null;
    };

    stat.getVrcode = function() {
        var host = window.location.host;
        //var ua = navigator.userAgent.toLowerCase();
        var _vrcode = '{NNNNN}-2006-0'.replace("{NNNNN}", function() {
            if (/m\.ly\.com/.test(host)) {
                //touch
                return '10004';
            } else if (/wx\.17u\.cn/.test(host)) {
                //WeChat
                return '10003';
            } else {
                //pc
                return '10002';
            }
        });

        return _vrcode;
    };

    stat.createScript = function (key, url) {
        if (key === "pvConfig") {
            stat.pvInit();
        } else if (key === "_tcHotmapx") {
            stat.init();
        } else {
            var all = document.createElement("script"),
                parameter = window.baidu && window.baidu.parameter.toLowerCase();
            all.type = 'text/javascript';
            if (key === "baidu" && parameter === "touch") {
                all.src = "//hm.baidu.com/hm.js?08a425890cf61957e88362f1b18431df";
            } else {
                all.src = url;
            }
            var st = document.getElementsByTagName("script")[0];
            st.parentNode.insertBefore(all, st);
        }
    };
    stat.timeDiff = (function (){
        var _timediff = -1;
        if (typeof _tcopentime != "undefined") {
            _timediff = new Date().getTime() - _tcopentime;
        }
        return _timediff;
    })();
    stat.getMemberId = getNmemberId;
    function getUrlRefId() {
        var url = location.href,
            hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
        return hasRefId && hasRefId[1] || "";
    }

    function getRefId() {
        var urlRefId = getUrlRefId();
        if (urlRefId) {
            stat.cookie("17uCNRefId", urlRefId);
            return urlRefId;
        } else {
            var cookieRefId = stat.cookie("17uCNRefId") || "";
            var reRefId = /\bRefId=(\d*)\b/;
            var hasRefId = reRefId.exec(cookieRefId);
            if(hasRefId) {
                stat.cookie("17uCNRefId", hasRefId[1]);
                return hasRefId[1];
            } else {
                return /\D/.test(cookieRefId) ? '' : cookieRefId;
            }
        }
    }


    var nativeKeys = Object.keys;
    var _ = {
        object: function(list,values){
            var result = {};
            if(list){
                for(var i =0;i<list.length;i++){
                    if(values){
                        result[list[i]] = values[i];
                    }else{
                        result[list[i][0]] = list[i][1];
                    }
                }
            }
            return result;
        },
        each: function(){
            function each(){
                var args = Array.prototype.slice.call(arguments,0);
                var obj = args[0] || {};
                var fn = args[1] || function(){};
                for(var key in obj){
                    if(obj.hasOwnProperty(key)){
                        fn.call(obj[key],key,obj[key],obj);
                    }
                }
            }
            return $ && $.each.apply(null,arguments) || each.apply(null,arguments);
        },
        isNaN: function(obj){
            return Object.prototype.toString.call(obj) === "[object Number]" && isNaN(obj);
        },
        extend: _extend,
        pairs: function(obj) {
            var keys = _.keys(obj);
            var pairs = Array(length);
            if(keys){
                for (var i = 0; i < keys.length; i++) {
                    pairs[i] = [keys[i], obj[keys[i]]];
                }
            }
            return pairs;
        },
        keys: function(obj){
            if(!_.isObject(obj)) return [];
            if(nativeKeys) return nativeKeys(obj);
            var keys = [];
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    keys.push(key);
                }
            }
        },
        isObject: function(obj){
            var type = typeof obj;
            return type === "function" || type === "object" && !!obj;
        }
    };
    window.stat = stat;
})();
