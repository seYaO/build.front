/**
 * @author 黄凯(hk08688@ly.com)
 * @module  核心组件
 * @exports Common
 * @requires module:监控
 * @requires module:FastClick
 * @description
 * 包括page模块,异步渲染模块和一些额外的公共处理方法
 * @example
 * var Common = require("modules-touch/common/index");
 * Common.init();
 */
/* global Monitor */
(function($){
    var Common = {},
        win = window,
        localStr = (localStorage && localStorage.getItem("ivData"))||"{}",
        /**
         * @var {object}
         */
        localData = JSON.parse(localStr),
        /**
         * @property LOCAL_DATA_SIZE
         * @desc 本地存储的单条数据大小
         * @type {number}
         */
        LOCAL_DATA_SIZE = 1000*200,
        /**
         * @property EXPIRE_TIME
         * @desc 本地存储的默认有效期为一个小时
         * @type {number}
         */
        EXPIRE_TIME = 1000*60*60,

        onePage = require("./onepage");
    Common.pages = [];
    /**
     * @func getData
     * @desc 异步获取数据
     * @param {string} url 异步请求的地址
     * @param {function} callback 回调函数
     * @param {(int|boolean)} [_expireTime] 失效的时间,单位为毫秒//也可以是布尔值
     * @returns {boolean}
     * @example
     * //请求数据时,默认情况下为一个小时缓存
     * Common.getData("/test",function(data){})
     * //请求数据时不走缓存
     * Common.getData("/test",function(data){},true)
     *
     * //请求数据时,缓存半个小时
     * Common.getData("/test",function(data){},1000*60*30)
     */
    Common.getData = function(url,callback,_expireTime){
        var encodeUrl = encodeURIComponent(url),
            _data = localData[encodeUrl];
        if(_data){
            //当缓存时间不超过1天，并且没有使用强制刷新，并且返回的状态不为300（请求失败）时,走本地存储
            if(Common.isExpire(_data,_expireTime)){
                callback.call(this,_data.data);
                return false;
            }else{
                localData[encodeUrl] = null;
            }
        }
        win.console && win.console.log("请求地址:"+url);
        $.ajax({
            type: "GET",
            url: url,
            dataType: "jsonp",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(data){
                if(!data){
                    window.Monitor.log("接口错误！"+url,"interface-parse");
                    $("#pageLoading").hide();
                    return;
                }
                if (!(data.State === "300" || data.state === 300 || _expireTime === true)) {
                    Common.saveLocal(encodeUrl,data);
                }
                try{
                    $.isPlainObject(data);
                }catch(e){
                    window.Monitor.log("接口错误！"+url,"interface-parse");
                    return;
                }
                callback.apply(this,arguments);
            },
            error: function(e,e2,e3){
                var prefix = "";
                if(url.indexOf("http") === -1){
                    prefix = "//"+location.host;
                }
                Monitor.log(prefix+url,"interface");
            }
        });

    };
    //添加参数
   Common.addParams  = function(url,name,value){
        url = url.replace(/(^\s*)|(\s*$)/g, "");
        var urlRep =/javascript:/i;
        if(urlRep.test(url)){
            return url;
        }
        var reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
        //查找url中是否包含正赋值参数
            rec1 = reg.exec(url),
        //查找url中是否包含哈希
            rec2 = url.split("#"),
            param = name+"="+value,
            ret = url;
        if(rec1){
            ret = url.replace(rec1[1],name+"="+rec1[2]);
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
    };
    /**
     * @checkLocal
     * @desc 检测本地存储是否有相应的数据
     * @param key 本地存储里对应的key
     * @param expireTime 失效时间
     * @returns {string|null} 如果本地存储存在,并且时间有效,则返回数据
     */
    Common.checkLocal = function(key,expireTime){
        var data = localData[key];
        if(Common.isExpire(data,expireTime)){
            return data;
        }
    };
    Common.title = function(){
        return onePage.title.apply(this,arguments);
    };

    Common.isIOS = onePage.isIOS;

    /**
     * @func saveLocal
     * @desc 保存数据到localStorage里
     * @param {string} key 索引值
     * @param {object|string} data 数据
     */
    Common.saveLocal = function(key,data){
        var now = new Date().getTime();
        localData[key] = {
            time: now,
            data: data
        };
    };
    /**
     * @func isExpire
     * @desc 判断本地数据是否有效
     * @param {object} _data 本地的数据
     * @param {object} _data.data 本地数据
     * @param {int} _data.time 本地数据被保存的时间
     * @param {int} _expireTime 失效的时间//也可以是布尔值
     * @param {string|number} [_data.data.State] 接口状态值,如果为300,则标记为请求失败,则不保存
     * @returns {boolean|*}
     */
    Common.isExpire = function(_data,_expireTime){
        if(!_data) {return false;}
        var now = new Date().getTime(),
            _stamp = _data.time,
            data = _data.data;
        if(_expireTime && (typeof(_expireTime)).toLowerCase() === "boolean"){
            return !_expireTime;
        }
        //当缓存时间不超过1天，并且没有使用强制刷新，并且返回的状态不为300（请求失败）时,走本地存储
        return (now-_stamp <= (_expireTime||EXPIRE_TIME) &&
        !(data.State ==="300"||data.state === 300) &&
        Common.isCache());
    };
    /**
     * @func eva
     * @desc 通用的将字符串转为json,并增加了错误监控
     * @param {string} str
     * @returns {object}
     */
    Common.eva = function(str){
        try{
            return eval(str);
        }catch(e){
            window.Monitor.log("eval失败:"+str,"data");
            return {};
        }
    };
    //转义字符串为对象
    Common.unparam = function(str, sep, eq) {
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
    };
    /**
     * @private
     * @func initDataEvent
     * @desc 绑定本地存储的方法，当页面卸载时，将数据存入到localStorage里
     */
    Common.initDataEvent = function(){
        win.onunload = function(){
            if(Common.isCache()){
                var localStr = JSON.stringify(localData);
                if(localStr.length >LOCAL_DATA_SIZE){
                    var now = new Date().getTime();
                    for(var i in localData){
                        var item = localData[i];
                        if(!item||item.time < now - EXPIRE_TIME){
                            delete localData[i];
                        }
                    }
                    localStr = JSON.stringify(localData);
                }

                localStorage && localStorage.setItem("ivData",localStr);
            }else{
                localStorage && localStorage.setItem("ivData","{}");
            }
        };
    };
    Common.getLocalData = function(key){
        return localData[key]||"";
    };
    /**
     * @private
     * @func isCache
     * @desc 判断是否开启了nocache
     * @returns {boolean}
     */
    Common.isCache = function(){
        var urlCache = location.href.indexOf("nocache") === -1;
        if(!localStorage) {
            return false;
        }
        var localFlag = localStorage.getItem("isInitCache");
        if(!localFlag && urlCache){
            localStorage.setItem("isInitCache","true");
        }
        if(!urlCache){
            localStorage.removeItem("isInitCache");
        }
        return urlCache;
    };
    Common.goTo = function(url){
        location.href = url;
        //var a = document.createElement("a");
        //a.setAttribute("href", url);
        //a.style.display = "none";
        //document.body.appendChild(a); //prototype shortcut
        //a.click();
    };
    /**
     * @func initCloseEvent
     * @desc 当存在indexclose这个标签时，即存在广告时，给body增加一个class，
     * -用来撑开页面，防止广告遮挡了其他的页面元素
     */
    Common.initCloseEvent = function(){
        $(document).on("click","#commonDownloadClose",function(){
            $("body").removeClass("has-download-ads");
        });
        //头部搜索跳转
        $('.header-search').on('click',function(){
            //终页
            var dataKey = 'package';
            var lineType =  $('#mainPage').attr('line-type');
            if(lineType==="跟团"){
                Common.goTo('//m.ly.com/dujia/package/destination');
            }else if(lineType==="自由行"){
                Common.goTo('//m.ly.com/dujia/travel/destination');
            }else{    //目的地地参团
                Common.goTo('//m.ly.com/dujia/local/all.html');
            }
        });
        var ua = navigator.userAgent;
        if(ua.indexOf("MQQBrowser")>-1 && ua.indexOf("QQ/")===-1){
            $("body").addClass("is-qq-browser");
        }

        // click public header's index btn than go to InterVacation touch index
        {
            var $publicHead = $(".home.touchable") || $(".home");
            $publicHead.attr("href", "/dujia");
        }
    };
    /*
     * @func resetAdver
     * @func 点击弹窗页面，遮挡app广告栏处理
     * */
    Common.resetAdver = function(){
        var topAdverApp = $($("body div")[0]),
            style = topAdverApp.attr("style");
        if(style == "position:relative"){
            $(".page").addClass("curApp");
        }
        Common.resetTopHeight();

    };
    /*
     * @func resetAdver
     * @func 点击关闭app广告，弹框的样式恢复
     * */
    Common.resetTopHeight = function(){
        var dom = $($("body div")[0]),
            styleN = dom.attr("style"),
            domClick = "";
        if(styleN == "position:relative"){
            domClick = dom.find("i");
        }
        $(domClick).on("click",function(){
            if(domClick!=""){
                var pageDom = $(".page.curApp");
                if( pageDom){
                    pageDom.removeClass("curApp");
                }
            }else{
                return false;
            }

        });
    };


    /**
     * @func redirect
     * @desc 该方法用来跳转页面，页面切换的方法
     * @param {object} cfg 跳转页面的配置
     * @param {object} cfg.tag 跳转目标页面的标签
     * //如: cfg.tag = "test",那么会判断是否有id="testPage"的页面,如果没有则创建,然后切换到该页面
     * //一般是用来配合{@link module:Common.render}渲染了那个testPage页面后,再切换过去
     * @param {object} cfg.title 设置跳转目标页面的title
     * @example
     * Common.redirect({
     *     tag: "calendar",
     *     title: "选择日期",
     *     callback: function(){}
     * })
     */
    Common.redirect = function(){
        onePage.go.apply(onePage,arguments);
    }
    /**
     * @private
     * @func initPage
     * @desc 初始化page组件
     */
    Common.initPage = function(){
        onePage.init.apply(onePage,arguments);
    }
    /**
     * @func setRefId
     * @desc 将url上的refid存到cookie里
     * @example
     * //http://m.ly.com/dujia?refid=123
     * //http://m.ly.com/dujia#refid=123
     * //http://m.ly.com/dujia?a=b&refid=123
     */
    Common.setRefId = function(){
        var url = location.href,
            hasRefId = /[#\?&]refid=(\d+)/.exec(url);
        if(hasRefId&&hasRefId[1]){
            $.cookie && $.cookie("17uCNRefId",hasRefId[1]);
        }
    };
    /**
     * @func setTitle
     * @desc 设置标题
     * @param {string} [text="默认标题"]
     */
    Common.setTitle = function(){
        onePage.title.apply(onePage,arguments);
    }
    /**
     * @private
     * @func getPage
     * @desc 根据tag生成对应的容器
     * @param tag String 标签名称
     * @returns {*|HTMLElement}
     */
    Common.getPage = function(){
        onePage.getEl.apply(onePage,arguments);
    }
    /**
     * @private
     * @func togglePage
     * @desc 页面配置切换
     * @param cfg
     * @param {object} cfg.tag 跳转目标页面的标签
     * @param {*} cfg.el 如果有el,则当触发后退时,会点击该按钮
     * @param {string} cfg.title 设置跳转目标页面的title
     * @param {function} cfg.callback 回调方法
     */
    Common.togglePage = function(){
        onePage.toggle.apply(onePage,arguments);
    };
    /**
     * @func backPage
     * @desc 页面后退,在后退事件里调用这个方法
     * @returns {boolean}
     */
    Common.backPage = function(){
        onePage.back.apply(onePage,arguments);
    }
    /**
     * @private
     * @func forwardPage
     * @desc 页面前进
     * @param {object} cfg 配置
     */
    Common.forwardPage = function(){
        onePage.forward.apply(onePage,arguments);
    }
    /**
     * @func render
     * @desc 页面渲染
     * @param {object} cfg
     * @param {object} cfg.tmpl dotjs的模板对象
     * @param {object} cfg.data 渲染模板所需要数据
     * @param {string} cfg.context 渲染的模板将被插入的容器选择器
     * @param {function} cfg.callback 渲染完成的回调方法
     * @param {boolean} [cfg.overwrite=false] 是否清空容器原有内容
     * @example
     */
    Common.render = function(cfg){
        var self = this,
            tmpl = cfg.tmpl,
            data = cfg.data,
            key = cfg.key,
            type = cfg.type,
            context = cfg.context||"body",
            callback = cfg.callback;
        var _data = data[key]||data;
        //附加一个key的变量用来控制脚本
        _data.key = key;
        _data.type = type;
        var sel = ".J_"+key;
        var el = $(sel);
        var dom;
        if(!el.length||cfg.overwrite){
            if(cfg.overwrite) {
                $(context).empty();
            }
            var _tmpl = tmpl[key];
            if(_tmpl){
                dom = self.renderHtml(_tmpl(_data),context);
            }else{
                Monitor.log(key+"对应的模块不存在!","tpl");
            }

            el = $(sel);
        }
        callback && callback.call(this,{el: el,data: _data,dom: dom});
    };
    /**
     * @func getLocation
     * @desc 获取地理定位
     * @param {object} cfg
     * @param {function} cfg.success 成功后调用的事件
     * @param {function} [cfg.failure] 失败后调用的事件
     * @example
     * var Common = require("modules-touch/common/index");
     * Common.getLocation({
     * success: function(arg){
     *     //获取百度地图api返回的数据
     *     var city = arg.result.addressComponent.city;
     *     //注意这里city是包含市这个后缀的,需要手动替换掉
     *     var _city = city.replace("市","");
     *     //后续处理
     * },
     * failure: function(arg){
     *     //失败的处理
     * }
     * })
     */
    Common.getLocation = function(cfg){
        if(!navigator.geolocation) {
            return;
        }
        navigator.geolocation.getCurrentPosition(function(position){
            var loc = position.coords.latitude+","+position.coords.longitude;
            var url = "//api.map.baidu.com/geocoder/v2/?ak=R1BS15aSlKUTpc0YG6GbDk7Q&output=json&pois=0&location="+loc;
            Common.getData(url,function(data,status){
                if(status === "success"){
                    cfg.success&&cfg.success.apply(this,arguments);
                }else{
                    cfg.failure&&cfg.failure.apply(this,arguments);
                }
            },true);
        },function(error){
            cfg.failure&&cfg.failure.apply(this,arguments);
        });
    };
    /**
     * @func renderHtml
     * @desc 将tmpl插入到context里
     * @param {string} tmpl 模板生成的html字符串
     * @param {string} context 选择器
     */
    Common.renderHtml = function(tmpl,context){
        var contentEl = $(context);
        return $(tmpl).appendTo(contentEl);
    };

    /**
     * @func dispatch
     * @desc 模拟点击事件
     * @param {element} dom
     * @param {string} event
     */
    Common.dispatch = function (dom, event) {
        try {
            var obj = document.createEvent("Event");
            obj.initEvent(event, true, true);
            obj.preventDefault();
            dom.dispatchEvent(obj);
        } catch (ex) {
            alert(ex.message);
        }
    };

    /**
     * @func resetHeadIndexBtn
     * @desc 重置头部首页按钮的的链接
     */
    Common.resetHeadIndexBtn = function () {
        //$(document).on("click", ".header-menu-btn", function (e) {
        //    e.preventDefault();
        //    var $header = $(".home.touchable");
        //    var pathname = window.location.pathname;
        //    if (pathname !== '/dujia/') {
        //        $header.addClass("goTo-index-btn");
        //        Common.dispatch(document.getElementsByClassName("goTo-index-btn")[0],"click");
        //        $header.attr("href","http://m.ly.com/dujia");
        //    }
        //});
    };


    /**
     * @func userAgentHandler
     * @desc 判断是否是qq客户端并修改loading图
     */
    Common.userAgentHandler = function () {
        var ua = navigator.userAgent,
            thisurl = location.href,
            shared = /[#\?&]isShared=(\d+)/.exec(thisurl);
        if(ua.indexOf("qqapptravel")>-1||(shared && shared[1]==="1"))
        {
            $("body").addClass("isQQTravel");
        }
    };



    /**
     * @param key
     * @returns {string}
     * @desc
     */
    Common.getQueryString = function (queryStr,key) {
        var _queryStr,_key;
        _queryStr = key ? queryStr : window.location.search.substr(1);
        _key = key || queryStr;
        var reg = new RegExp("(^|&)" + _key + "=([^&]*)(&|$)", "i");
        var r = _queryStr.match(reg);
        if (r !== null) {
            return decodeURI(r[2]);
        }
        return null;
    };

    /**
     * @desc 设置图片大小
     * @param {String} url 图片地址
     * @param {String} size 图片大小 默认值为_600x300_00
     * @returns {String} 处理过后的图片地址
     */
    Common.setImageSize = function (url, size) {
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
    };

    /**
     * @func init
     * @desc 通用方法初始化
     */
    Common.init = function(){
        Common.setRefId();
        var FastClick = require("modules-touch/utils/fastclick/index");
        /* jshint -W031  */
        new FastClick(document.body);
        Common.initCloseEvent();
        Common.initDataEvent();
        Common.resetHeadIndexBtn();
        Common.userAgentHandler();
        //心愿弹出层
        //Common.wishPop();
    };
    /**
     * @desc reflow element
     * @param el
     */
    Common.reflow = function(el){
        el = $(el);
        if(el.length < 0){
            return;
        }
        el.each(function(){
            var self = $(this);
            var inlineCss = this.getAttribute("style");
            self.css("display","none");
            window.setTimeout(function(){
                self.attr("style",inlineCss);
            },300);
        });
    };
    /**
     * @desc 是否支持本地存储（是否开启了匿名浏览或者无痕模式）
     * @returns {boolean}
     */
    Common.supportLocalStorage = function(){
        var ret = true;
        try{
            localStorage.setItem("_test_",1);
            localStorage.removeItem("_test_");
        }catch (e){
            var r = /(quota.*)$/;
            r.test(e.name.toLowerCase()) && (ret = false);
        }
        return ret;
    };
    /*
    * 心愿弹出层
    */
    Common.wishPop = function () {
        var wishpop = require("modules-touch/utils/wish/index");
        new wishpop({
            wishUrl: "http://www.ly.com/zhuanti/wishlist/?cjtp",//许愿地址
            fromUrlRege: "m.ly.com/dujia", //来源页面
            //fromUrlRege: /\.ly\.com/i, //来源页面
            triggerUrlRege: 'touch-list;touch-index'  //触发页面
        });
    };
    module.exports = Common;
})(Zepto);