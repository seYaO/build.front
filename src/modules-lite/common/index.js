/**
 * @author 黄凯(hk08688@ly.com)
 * @module  核心组件
 * @exports Common
 * @requires module:监控
 * @requires module:FastClick
 * @description
 * 包括page模块,异步渲染模块和一些额外的公共处理方法
 * @example
 * var Common = require("tc/common/index");
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

        onePage = require("./onepage.js");
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
                if(!(data.State ==="300"||data.state === 300)){
                    Common.saveLocal(encodeUrl,data);
                }
                try{
                    $.isPlainObject(data);
                }catch(e){
                    console.log("数据解析错误!");
                    return;
                }
                callback.apply(this,arguments);
            },
            error: function(){
                var prefix = "";
                if(url.indexOf("http") === -1){
                    prefix = "//"+location.host;
                }
                Monitor.log(prefix+url,"interface");
            }
        });

    };
    Common.addStyle = function(){
        var link = document.createElement("style");
        link.type = "text/css";
        link.innerHTML = ".go-top{display:none;position:fixed;bottom: 80px; z-index: 100; right: 20px;width:40px;height:40px;} .go-top img{width:100%;height:100%;}";
        document.getElementsByTagName("head")[0].appendChild(link);
    };
    Common.goTop = function(cfg){
        if(cfg === false){
            return;
        }
        var defaultCfg = {
            cls: "go-top",
            top: 300,
            img: "//img1.40017.cn/touch/v/weixin/img/top_29aab7a.png"
        };
        var thisCfg = $.extend(defaultCfg,cfg);
        var goTopEl = $(".J_GoTop");
        if(goTopEl.length === 0){
            this.addStyle();
            $("body").append('<span class="J_GoTop '+ thisCfg.cls +'"><img style="background: transparent;" src="'+thisCfg.img+'" /></span>');
            goTopEl = $(".J_GoTop");
        }else{
            return;
        }
        goTopEl.on("click",function(){
            window.scrollTo(0,0);
            goTopEl.hide();
        });
        $(window).on("scroll",function(){
            var isNotInList = $("#mainPage").css("display") === "none";
            if(isNotInList) {
                return;
            }
            var cScrollTop = document.body.scrollTop;
            if(cScrollTop > thisCfg.top){
                goTopEl.show();
            }else if(cScrollTop < thisCfg.top){
                goTopEl.hide();
            }
        });
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
        onePage.redirect.apply(onePage,arguments);
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
     * ////m.ly.com/dujia?refid=123
     * ////m.ly.com/dujia#refid=123
     * ////m.ly.com/dujia?a=b&refid=123
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
    }
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
     * var tmpl = require("tpl/index/index");
     */
    Common.render = function(cfg){
        var self = this,
            tmpl = cfg.tmpl,
            data = cfg.data,
            key = cfg.key,
            context = cfg.context,
            callback = cfg.callback;
        var _data = data[key]||data;
        //附加一个key的变量用来控制脚本
        _data.key = key;
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
     * @param {Element} dom
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
     * @param key
     * @param queryStr
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
    Common.init = function(pageid){
        Common.setRefId();
        var FastClick = require("../utils/fastclick/index");
        /* jshint -W031  */
        new FastClick(document.body);
        Common.initDataEvent();
        Monitor.init(pageid);
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
        var inlineCss = el.attr("style");
        el.css("display","none");
        window.setTimeout(function(){
            el.attr("style",inlineCss);
        },300);
    };
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
    window.common = Common;
    module.exports = Common;
})(Zepto);
