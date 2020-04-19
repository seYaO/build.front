/**
 * @desc:统计
 * @author: Jilly
 * @mail: cjl10120@ly.com
 * @createTime: 2015/7/23 10:33
 * @version: 0.1
 */
(function () {
    var stat = {},
        isFish = !!window.fish,
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
                        for (var g = 0; g < b.length; g++) {
                            var a = $.trim(b[g]);
                            if (a.substring(0, h.length + 1) == (h + "=")) {
                                c = decodeURIComponent(a.substring(h.length + 1));
                                break;
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
        for (var c, d, e = a.split("&"), f = b ? void 0 : {}, g = 0, h = e.length; h > g; g++)
            if (c = e[g])
                if (c = c.split("="), d = c.shift(), b) {
                    if (b === d) return c.join("=")
                } else f[d] = c.join("=");
        return f
    }
    var getNmemberId = (function() {
        return getNmemberId || function(){
            var a = stat.cookie("nus"),
                  c = "0";
            return a && (c = getParam(a, "userid"), c && "undefined" !== c || (c = "0")), c
        };
    })();
    stat.extend = (function(){
        if(window.jQuery && window.jQuery.extend) {
            return window.jQuery.extend;
        } else {
            return _extend;
        }
    })();
    stat.init = function (cfg) {
        if (window.isStatInit) {
            stat.mvlInit(cfg);
        } else {
            stat._init(cfg);
            window.isStatInit = true;
        }
    };
    stat._init = function (cfg) {
        var self = this;
        window.setTimeout(function () {
            for (var key in cfg) {
                if (key === "baidu") {
                    window.baidu = stat.extend({}, conf[key].param, cfg[key]);
                    window._hmt = cfg[key].hmt;
                }
                if (key === "vst") {
                    var _tcq = _.extend({}, conf.vst.param, _.object(cfg[key]));
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
                if (key === "mvl") {
                    mvqArr = window._mvq = cfg[key]._mvq;
                }
                if (key !== "mvl") {
                    self.createScript(key, conf[key].url);
                } else if (cfg.mvl.isImmediateExcu && key === "mvl") {
                    self.createScript(key, conf[key].url);
                }
            }
        }, 0);
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
                "url": "http://www.ly.com/dujia/AjaxHelper/PvHandler.ashx",
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
            "url": "http://vstlog.17usoft.com/vst.ashx",
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
        var ua = navigator.userAgent.toLowerCase();
        var _vrcode = '{NNNNN}-2006-0'.replace("{NNNNN}", function() {
            if(/micromessenger/.test(ua)) {
                // wx
                return '10003';
            } else if(/tctravel/.test(ua)) {
                // app
                return '10007';
            } else if(/mobile/.test(ua)) {
                // touch cn
                return '10004';
            } else {
                // pc
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
            for(var i =0;i<list.length;i++){
                if(values){
                    result[list[i]] = values[i];
                }else{
                    result[list[i][0]] = list[i][1];
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
            for (var i = 0; i < keys.length; i++) {
                pairs[i] = [keys[i], obj[keys[i]]];
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
