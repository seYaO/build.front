(function(){
    var Common = {},win = window;
    /**
     * @desc 渲染逻辑同touch
     * @param config
     */
    Common.render = function (config) {
        var
            key = config.key,
            tpl = config.tpl[key] || config.tpl,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback;
        var html,cxt;
        html = tpl(data);
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    };
    Common.log = function(){
        if(!win.Monitor){
            win.console && console.log.apply(console,arguments);
        }else{
            win.Monitor.log.apply(win.Monitor,arguments);
        }
    };
    Common.stat = function(){
        if(!win.Monitor){
            win.console && console.log.apply(console,arguments);
        }else{
            win.Monitor.stat.apply(win.Monitor,arguments);
        }
    };
    /**
     * @desc 通用的异步请求方法
     * @param {object} cfg
     * @param {number|null} cfg.isFangZhua 是否接入防抓
     * @type {Common.ajax}
     * @example
     * common.ajax({
            dataType: "jsonp",
            url: "xxxx",
            isFangZhua: 1, //可选,不写默认不接入防抓
            success: function(data){ alert("success")}
     * })
     */
    Common.getData = Common.ajax = function(cfg){
        var self = this,
            beforeTime = +new Date,
            errorFunc = cfg.error||cfg.failure,
            url,
            successFunc = cfg.success;
        if(successFunc){
            delete cfg.success;
            cfg.success = function(data){
                successFunc.call(self,data);
                var parser = document.createElement('a');
                parser.href = cfg.url;
            };
        }
        if(errorFunc){
            delete cfg.error;
        }
        cfg.error = function(ajaxObj,type,message){
            errorFunc && errorFunc(ajaxObj,type,message);
            self.log((url||"")+":"+ajaxObj.status+":"+message,"ajax");
        };
        var defaultCfg = {
            dataType: 'jsonp'
        };
        var thisCfg = $.extend({},defaultCfg,cfg),
            dataType = thisCfg.dataType,
            host = "";
            url = thisCfg.url;
            host = win.host ||"";
        if(location.host.indexOf("www.ly.com")>-1&&host.indexOf(".t.")>-1){
            alert("警告:当前页面正在调用测试环境的接口");
        }
        if(host){
            thisCfg.url = url.replace(/^http:\/\/[^\/]+\//,host+"/")
                .replace(/^\/([^\/]+)/,host+"/$1");
        }
        return $.ajax(thisCfg);
    };
    Common.fangZhuaUrl = function(url){
        return url;

    };
    Common.isSysSupportWebp = function(){
        var self = this;
        if(self.sysWebp != undefined) return self.sysWebp;
        var ua = navigator.userAgent;
        if(/uc|chrome|android/i.test(ua)){
            self.sysWebp = true;
            return true;
        }
        self.sysWebp = false;
        return self.sysWebp;
    }
    Common.isImgSupportWebp = function(imgUrl){
        return imgUrl.indexOf("pic3.40017.cn")>-1 || imgUrl.indexOf("pic4.40017.cn")>-1;
    };
    Common.setImageSize = function (url, size) {
        var self = this;
        if (!url) {
            return null;
        }
        var isUnSupport = url.indexOf("upload.17u.com") > -1,
            isSupportWebp = self.isSysSupportWebp() && self.isImgSupportWebp(url),
            suffix = isSupportWebp?".webp":"";
        if(isUnSupport){
            return url;
        }
        if(!size){
            size = "_600x300_00";
        }
        if(size && size.indexOf("_") === -1){
            size = "_"+size+"_00";
        }
        var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]{2}$/;
        if(!regSize.test(size)){
            win.Monitor && win.Monitor.log("图片的size设置有误","imgsize");
            return url+suffix;
        }
        return url.replace(/(_[0-9]{2,3}x[0-9]{2,3}_[0-9]{2})?(\.\w+)(\.webp)?$/,function($0,$1,$2,$3){
            if($3){
                suffix = "";
            }
            if($1){
                return $0.replace($1,size)+suffix;
            }
            return size+$2+suffix;
        });
    };
    /**
     * @desc 检查是否登录,如果登录,返回userid
     * @returns {string|undefined} userid
     */
    Common.getUser = function(){
        var loginInfo = this.cookie("us"),
            userid;
        if(loginInfo){
            var isLoginId = /userid=(\d+)/i.exec(loginInfo);
            if (isLoginId) {
                userid = /userid=(\d+)/i.exec(loginInfo)[1];
            }
        }
        return userid;
    };
    /**
     * @desc 获取url参数
     * @param {string} name key值
     * @param {boolean|null} isLowerCase 是否将url转换成小写
     * @returns {null|string}
     */
    Common.getParamFromUrl = function (name,isLowerCase) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var url = win.location.href;
        if(isLowerCase){
            url = url.toLowerCase();
        }
        var results = regex.exec(url);
        if (results == null) {
            return null;
        }
        else {
            return results[1];
        }
    };
    Common.addStyle = function(url){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };
    /**
     * @desc 设置数组数据为唯一，剔除重复数据
     * @param {array} array 数组
     * @returns {array}
     */
    Common.setArrayDataUnique = function (array) {
        var a = {};
        for (var i = 0; i < array.length; i++) {
            if (typeof a[array[i]] == "undefined") a[array[i]] = 1;
        }
        array.length = 0;
        for (var i in a) array[array.length] = i;
        return array;
    };
    /**
     * @desc 获取接口的域名,当为线上时,使用当前域名
     * @returns {*}
     */
    Common.host = function(){
        if(location.host.indexOf("www.ly.com")>-1){
            return "";
        }
        return win.host||"";

    };
    /**
     * @desc 获取cookie
     * @param key key值
     * @param value 如果value有值,则为赋值
     * @param {object} options
     * @returns {*}
     */
    Common.cookie = function(key,value,options){
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || { path:"/",domain:".ly.com" };
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [key, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var ret, m;
            if (key) {
                if ((m = document.cookie.match(
                        new RegExp('(?:^| )' + key +
                            '(?:(?:=([^;]*))|;|$)')))) {
                    ret = m[1] ? decodeURIComponent(m[1]) : '';
                }
            }
            return ret;
        }
    };
    /**
     * @func 格式化日期
     * @param date 日期
     * @param fmt 所需的日期格式，如'yyyyMMdd','yyyy-MM-dd','yyyy/MM/dd'...
     * */
    Common.dateFormat = function (date, fmt) {
        return date.format(fmt);
    };
    Date.prototype.format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    Common['export'] = function(func,speName){
        if(!speName) {
            alert("导出方法有误,模块名称未定义");
            return;
        }
        var funcName = func.name||(speName&&speName.split("/")[0]);
        "undefined" !== typeof module && module['exports'] ? module['exports'] = func : "function" === typeof define ? define(speName,function(){return func;}): window[funcName+"Module"] = func;
    };
    $.extend($,{
        cookie: Common.cookie
    });
    win.common = Common;
    Common['export'](Common,"common/0.1.0/index");
}());
