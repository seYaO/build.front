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
var Monitor;
(function(){
    Monitor= {
        /**
         * @var _prefix
         * @desc 日志接口的前缀
         */
        _prefix : "//www.ly.com/dujia/ajaxhelper/commonhandler.ashx?action=FRONTLOG",
        /**
         * @var _tmpl
         * @desc 错误信息模板
         */
        _tmpl: {
            pretty: "发现{type}错误：\n \r {message}",
            log: "subtype={type}&cattype={host}&message={message}&ua={ua}&ratio={ratio}&url={url}"
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
        /**
         * @private
         * @func isConsole
         * @desc 判断是否在控制台输出
         * @returns {boolean|null}
         */
        isConsole: function(){
            return !!window.console && this.getLogStatus();
        },
        /**
         * @private
         * @func getLogStatus
         * @desc 判断当前的状态,如果为真,则只在控制台显示,不发送日志
         * @returns {boolean|null}
         */
        getLogStatus: function(){
            return (location.href.indexOf("ly.com") === -1);
        },
        /**
         * @func _sub
         * @desc 根据错误数据和环境生成需要的错误字符串
         * @param data {object} 错误数据
         * @returns {string} 生成的错误字符串
         * @private
         */
        _sub: function(data){
            var self = this,
                logTmpl = self._tmpl.log;
            if(self.isConsole()){
                logTmpl = self._tmpl.pretty;
            }
            return logTmpl.replace(/{(\w+)}/g, function ($0, $1) {
                var _data = data[$1];
                if(self.isConsole()){
                    return _data;
                }else{
                    return encodeURIComponent(_data);
                }
            });
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
                localStorage.__error__ = JSON.stringify(errorObj);
                return true;
            }
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
         * @desc 获取设备的相关数据并发送
         * @param _msg {string} 错误信息
         * @param type {string} 错误类型
         */
        log: function(_msg,type){
            if(!_msg) {return;}
            var userAgent = /\(([^)]+)/.exec(navigator.userAgent),
                ua = userAgent && userAgent[1]||navigator.userAgent;
            //如果是ie，则不发送相关数据
            if(ua.indexOf("MSIE")>-1) {return;}
            var data = {
                url: location.href,
                ratio: document.documentElement.clientWidth+"x"+document.documentElement.clientHeight,
                ua: ua,
                type: type||"",
                host: location.host
            };
            data.message = _msg;
            var msg = this._sub(data);
            var self = this;
            if(!self.getLogStatus()&& self.index(_msg)){
                self.send(self._prefix +"&"+msg);
            }
            if(self.isConsole()){
                console.error(msg);
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
            window[id] = img;
            img.onload = img.onerror = function () {
                window[id] = null;
            };
            img.src = url;
            img = null;
        },
        /**
         * @func init
         * @desc 监控zepto或者其他框架的绑定事件
         * @param {object} [framework=Zepto] js框架,比如Zepto,Jquery
         */
        init: function(framework){
            //var Framework = framework||Zepto;
            //if(!Framework.fn) {return;}
            //var onEvent = Framework.fn.on;
            //Framework.fn.on = function(){
            //    var arg = arguments,
            //        _index,
            //        func;
            //    for(var i = 0, len = arg.length -1; i<=len; i++){
            //        if(typeof arg[i] === "function"){
            //            func = arg[i];
            //            _index = i;
            //            break;
            //        }
            //    }
            //    if(func){
            //        arg[_index] = function(){
            //            try{
            //                return func.apply(this,arguments);
            //            }catch(e){
            //                Monitor.log(e.stack|| e.message,"event."+arg[0]);
            //            }
            //
            //        };
            //    }
            //    return onEvent.apply(this,arg);
            //};
        },
        jsConsole: function(){
            var addr = location.toString(),
                isOpen = /console=(\w+_\d+)/.exec(addr);
            if(isOpen && isOpen[1]){
                var key = isOpen[1],
                    url = "//172.16.51.21:7777/?%3Alisten%20"+key,
                    script = document.createElement('script'),
                    head = document.getElementsByTagName('head')[0];
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                script.src = url;
                head.appendChild(script);
                window.open(url);
            }
        }
    };
})();
