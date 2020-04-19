(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function(){return this}).call();
        root.UScheck = factory();
    }
}(function () {
    /*
    *sync
    *
    *asyn
    *
    */
    var UScheck = function(){
        var self = this;
        if(!(self instanceof UScheck)){
            return new UScheck();
        }
    };
    UScheck.prototype = {
        constructor : UScheck,
        //添加参数
        addParams : function(url,name,value){
            url = url.replace(/(^\s*)|(\s*$)/g, "");
            var urlRep =/javascript:/i;
            if(urlRep.test(url)){
                return url;
            }
            var reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
            //查找url中是否包含正确赋值参数
                rec1 = reg.exec(url),
            //查找url中是否包含哈希
                rec2 = url.split("#"),
                param = name+"="+value,
                ret = url;
            if(rec1){
                ret = url.replace(rec1[1],param);
            }else{
                if(/\?/g.test(url)) {
                    if(rec2.length>1){
                        ret = rec2[0]+"&"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"&"+ param;
                    }
                }else{
                    if(rec2.length>1){
                        ret = rec2[0]+"?"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"?"+ param;
                    }
                }
            }
            return ret;
        },
        hackClient : function(){
            var self = this,
                url = window.location.href,
                matchApp = /memberId=([^&]+)/i.exec(url);

            if(!self.ishackClient){

                if(matchApp == null){
                    url = self.addParams(url,"memberId","tcwvmid");
                    url = self.addParams(url,"tcwvclogin","true");
                    location.replace(url);
                    //self.ishackClient = true;
                    return true;
                }
            }
        },
        data : {
            //version : '',
            //memberId : ''
        },
        userinfo :{},
        //是否为客户端
        isClient : function(){
            return /tctravel/i.test(navigator.userAgent.toLowerCase())
        },
        //是否为微信浏览器
        isWeChat: function() {
            return /micromessenger/i.test(navigator.userAgent.toLowerCase());
        },
        //是否登录
        isLogin: false,
        init : function(){
            var self  = this;
            self.getUsInfo();
            //app事件返回
            setTimeout(function() {
                if(self.isClient()){
                    self.getAppInfo();
                }
                $(document).trigger('AppCheckDone');
            }, 1500);

        },
        //客户端返回信息
        getAppInfo : function(){
            var self = this;
            document.addEventListener('TongChengWebViewJavascriptBridgeReady', function (event) {
                var bridge = event.bridge;
                bridge.init(function (message, responseCallback) { });
                bridge.registerHandler('TongchengJavaScriptHandler', function (data, responseCallback) {
                    self.data = data;
                    self.data.clientType = "iPhone";
                    //如果有数据返回
                    if(self.data&&self.data.memberId){
                        self.userinfo.value = self.data.memberId;
                    }
                });
            }, false);
            //Android
            var Android;
            if (Android != undefined) {
                var AndroidHandler = eval('(' + Android.getDataFromAndroid() + ')');
                if (AndroidHandler) {
                    self.data = AndroidHandler;
                    self.data.clientType = "Android";
                    //如果有数据返回
                    if(self.data&&self.data.memberId){
                        self.userinfo.value = self.data.memberId;
                    }
                }
            }
        },
        //登录验证
        getUsInfo : function(){
            var self = this,
                url = window.location.href,
                cookie = $.cookie("cnUser")||"",
                matchtouch = /userid=([^&]+)/i.exec(cookie),
                matchApp = /memberId=([^&]+)/i.exec(url),
                userinfo = {
                    type : null,
                    value : null,
                    url : null
                };
            //
            if(!self.isClient()){
                //不是客户端
                userinfo.type = "userid";
                if (matchtouch && matchtouch[1]) {
                    userinfo.value = matchtouch[1];
                }
                userinfo.url = "https://passport.ly.com/m/login.html";
            }else{
                //是客户端
                userinfo.type = "memberid";
                if(matchApp && matchApp[1]){
                    userinfo.value = matchApp[1];
                    self.ishackClient = true;
                }
                userinfo.url = "http://shouji.17u.cn/internal/login/";
            }
            self.userinfo = userinfo;
            //
            if(userinfo.value !== null){
                self.isLogin = true;
            }
        },
        //
        checkJump : function(){
            var self = this;
            if(!self.ischeckJump && self.userinfo.value == null){
                if(!self.isClient()){
                    window.location.href = (self.userinfo.url + "?returnUrl=" +encodeURIComponent(location.href));
                }else{
                    window.location.href = self.userinfo.url;
                }
                return false;
            }
            self.ischeckJump = true;
            return true;
        },
        useridHash : function(callback){
            var self = this;
            $.ajax({
                url: "//m.ly.com/dujia/AjaxHelper/ExtraHongKongUserId?userid="+self.userinfo.value,
                dataType: 'jsonp',
                success: function(data) {
                    if(data.status === 4000) {
                        self._useinfo = $.extend({},self.userinfo);
                        self._useinfo.value = data.data;
                        callback && callback(self._useinfo);
                    }
                },
                error: function() {}
            });
        },
        /*加不加true来判断是否需要跳登录页*/
        /*
        * @desc 判断登录回调封装
        * @param {
        * callback function 成功回调
        * bool boolean 跳转开关
        * hash boolean userid的hash转义开关
        * }
        *
        * */
        checkDone : function(callback,bool,hash){
            var self = this;
            if(typeof callback !== 'function') callback = function(){};
            //不需跳转不执行
            if(bool === true) {
                //app判断是否包含tcvimid
                if(self.isClient()){
                    if(self.hackClient()) return false;
                }else{
                    if(!self.checkJump()) return false;
                }
            }
            //无登录信息不执行
            if(self.userinfo.value == null) return false;
            //userid转义
            if(hash === true) {
                if(self.userinfo.type=="userid"){
                    if(self._useinfo){
                        callback.call(self,self._useinfo);
                    }else{
                        self.useridHash(function(data){
                            callback.call(self,data);
                        });
                    }
                }else{
                    //不是userid
                    callback.call(self,self.userinfo);
                }
            }else{
                callback.call(self,self.userinfo);
            }
        },

        //todo:iphone返回不准确
        asynCheckDone : function(callback,bool){
            var self = this;
            if(typeof callback !== 'function') callback = function(){};
            $(document).on("AppCheckDone", function(){
                //不需跳转不执行
                if(bool === true) {
                    if(!self.checkJump()) return false;
                }
                //无登录信息不执行
                if(self.userinfo.value == null) return false;
                //
                return callback.call(self,self.userinfo);
            });
        }
    };
    //
    var uscheck = new UScheck();
    uscheck.init();
    return uscheck;
}));

