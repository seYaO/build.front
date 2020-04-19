;(function () {
    var Activities = function () {
    };
    var Origin = Activities.prototype;
    /** 默认配置 */
    Origin.defaults = {
        //数据获取
        param: [
            // {
            //     actid: null,
            //     pid: []
            // }
        ],
        dataTmpl: "//www.ly.com/dujia/AjaxHelper/activityHandler.ashx?type=ACTRESOURCE&actid={actid}&pid={pid}&readnew=1",
        el: ".prolist",
        dataFilter: ["timeCheckFn", "filterDataFn"],
        beforeRender: function (data) {
            return data;
        },
        afterRender: function () {

        },
        //
        prefix: "__act__",
        DEFAULTTIME: -2209017600000,

        //是否跳微信站
        needJumpWX: true,
        needLaunchApp: true,
        /** 客户端相关 **/
        passParams: ["moduleid", "refid", "channelId", "jobNumber", "tcnatag", 'sharetag']
    };
    /** 初始方法 */
    Origin.init = function (options) {
        var self = this,
            config = self.config = $.extend(true, {}, self.defaults, options);
        config.type = "touch";

        if (self.checkApp()) {
            config.type = "app";
            self.config.needLaunchApp = false;
        }

        if (self.needJumpWX && self.checkWX()) {
            config.type = "weixin";
        }
        //
        self.pageState = self.getPageState();
        self.getServerTime();
        //获取数据
        self.getActData(function () {
            self.flow();
        });
        //设置回到顶部
        self.setGoTop();


    };
    /** 工作流程 */
    Origin.flow = function () {
        var self = this,
            config = self.config,
            data;

        config.dataFilter.forEach(function (item, index) {
            if (typeof item == 'function') {
                data = item.call(self, self.data);
            } else {
                data = self[item] && self[item].call(self, self.data);
            }
            data && (self.data = data);
        });
        data = config.beforeRender && config.beforeRender.call(self, self.data);
        data && (self.data = data);
        self.render(self.data);
        config.afterRender && config.afterRender.call(self, self.data);
        data && (self.data = data);
        self.imgLazyLoad();
        //
        self.initEvent();
    };
    /** 事件绑定 */
    Origin.initEvent = function () {
        var self = this,
            config = self.config;
        //
        window.onunload = function () {
            self.setPageState();
        }
        //
        $(config.el).on("click", "a", function (e) {
            var Jself = $(this),
                data = {};
            data.type = config.type;

            if(data.type == "origin"){
                data.type = null;
                data.url =  Jself.attr("data-url");
            }else{
                data.lineId = Jself.attr("data-lineid");
                data.activityId = Jself.attr("data-activityId");
                data.periodId = Jself.attr("data-cycleId");
                data.lineType = Jself.attr("data-LineType");
                data.redirectKey = Jself.attr("data-RedirectKey");
                data.enterId = Jself.attr("data-enterId");
            }
            //
            self.router(data);
            e.preventDefault();
        });
    };

    /**
     * *************客户端相关************* *
     */
    /** 是否为客户端 */
    Origin.checkApp = function () {
        var ua = navigator.userAgent,
            isApp = /TcTravel\/(\d+\.\d+\.\d+)/.exec(ua);
        if (isApp && isApp[1]) {
            return true;
        }
    };
    /** 是否为微信 */
    Origin.checkWX = function () {
        return /MicroMessenger/.test(navigator.userAgent);
    };
    /** 唤醒客户端 */
    Origin.launchApp = function (sUrl, rUrl, callback) {
        var self = this,
            config =self.config;
        if(config.needLaunchApp){
            var baseUrl = 'http://m.17u.cn/app/pje/';
            var refid = document.cookie.match(/17uCNRefId=\d+/) || ["17uCNRefId=155139223"]; // 154294518
            refid = refid[0].split('=')[1];
            baseUrl += refid;
            //
            sUrl = sUrl.replace(/\//g, '|');
            sUrl = encodeURIComponent(sUrl);
            //
            rUrl = rUrl.replace(/\//g, '|');
            rUrl = encodeURIComponent(rUrl);
            var url = baseUrl + '?sUrl=' + sUrl + '&rUrl=' + rUrl;
        }else{
            var url = rUrl;
        }
        //
        callback && callback.call(self, url);
    };

    /**
     * *************跳转相关************* *
     */
    /** 跳转客户端页面 */
    Origin.gotoApp = function (data) {
        var self = this;
        var url = "tctclient://vacation/detail?lineId=" + data.lineId + "&activityId=" + data.activityId + "&periodId=" + data.periodId;
        return url;
    };
    /** 跳转touch页面 */
    Origin.gotoTouch = function (data) {
        var self = this,
            url;
        if (data.lineType == "0") {
            url = "//m.ly.com/dujia/tours/" + data.lineId + ".html?actType=" + data.redirectKey + "&wvc1=1" + self.getPassParam();
        } else {
            url = "//m.ly.com/dujia/tours/" + data.lineId + "/?actType=" + data.redirectKey + "&wvc1=1" + self.getPassParam();
        }
        return url;
    };
    /** 跳转微信站页面 */
    Origin.gotoWX = function (data) {
        var self = this,
            url;
        if (data.lineType === "0") {
            url = "http://wx.17u.cn/ivacation/tours/" + data.lineId + ".html?ak=" + data.redirectKey + self.getPassParam();
        } else {
            url = "http://wx.17u.cn/ivacation/tours/" + data.lineId + "/?ak=" + data.redirectKey + self.getPassParam();
        }
        return url;
    };
    /** 跳转页面 */
    Origin.router = function (data) {
        var self = this,
            config = self.config;
        switch (data.type) {
            case 'app':
                var appurl = self.gotoApp(data);
                if (appurl) {
                    window.location.href = appurl;
                }
                break;
            case 'touch':
                var appurl = self.gotoApp(data);
                var touchurl = self.gotoTouch(data);
                self.launchApp(appurl, touchurl, function (url) {
                    window.location.href = url;
                });
                break;
            case 'weixin':
                var appurl = self.gotoApp(data);
                var wxurl = self.gotoWX(data);
                self.launchApp(appurl, wxurl, function (url) {
                    window.location.href = url;
                });
                break;
            default :
                self.launchApp(data, data, function (url) {
                    window.location.href = url;
                });
                break;
        }
    };

    /**
     * *************渲染相关************* *
     */
    /** 渲染html */
    Origin.render = function (data, index) {
        var self = this,
            config = self.config;
        if (~config.dataFilter.indexOf('filterDataFn')) {
            var ruleItem = self.filterElRule;
            for (var x in ruleItem) {
                self.renderEl(data[x] || {}, $(ruleItem[x]));
            }
        } else {
            self.renderEl(data, $(config.el));
        }
    };
    /** 渲染节点 */
    Origin.renderEl = function (data, context, tmplStr) {
        if (!tmplStr) {
            tmplStr = context.attr("data-tmpl");
        }
        if (!tmplStr) {
            Activity.log("没有配置data-tmpl", "param");
            return;
        }
        if (context.attr("data-rendered")) {
            return;
        }

        var tmpl = $(tmplStr).html();
        if (!window.doT) {
            Activity.log("dotjs没有加载或者检查是不是seajs和dot冲突了", "dom");
            return;
        }
        var tpl, html;
        try {
            tpl = window.doT.template(tmpl, Activity.dotConf, Activity.dotDef);
        } catch (e) {
            Activity.log(e.stack || e.message, "tmpl");
            return;
        }
        html = tpl(data);
        context.empty().append(html);
        if (data.length && data.length > 0) {
            context.attr("data-rendered", "true");
        }
    };
    /** 参数字符串转对象 */
    Origin.imgLazyLoad = function () {
        var self = this,
            config = self.config;
            parent = $(config.el).parent();
        if (!$.fn.lazyload) {
            Activity.log("lazyload组件未加载", "dom");
            return;
        }
        if (this.isInit) {
            var imgList = parent.find("img").not("[data-img-loaded]");
            $(window).trigger("addElements", imgList);
        } else {
            parent.find("img").not("[data-img-loaded]").lazyload({
                "data_attribute": "img",
                css: {
                    opacity: 0
                },
                effect: 'fadeIn'
            });
            this.isInit = true;
        }
    };
    /** 设置图片格式 */
    Origin.setImageSize = function (url, size) {
        if (!url) {
            return null;
        }
        var defaultSize = "_600x300_00";
        if (size && size.indexOf("_") === -1) {
            size = "_" + size + "_00";
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
            return url.replace(/\.\w+$/, function ($0) {
                return (size || defaultSize) + $0;
            });
        } else {
            return url;
        }
    };
    /** 格式化时间 */
    Origin.formatDate = function (tmpl, date) {
        if (typeof date === "string") {
            date = date.replace(/-/g, "/");
            date = new Date(date);
        }
        var o = {
            "M+": date.getMonth() + 1,    //month
            "D+": date.getDate(),    //day
            "h+": date.getHours(),    //hour
            "m+": date.getMinutes(),    //minute
            "s+": date.getSeconds(),    //second
            "q+": Math.floor((date.getMonth() + 3) / 3),//quarter
            "S": date.getMilliseconds()    //millisecond
        };
        if (/(Y+)/.test(tmpl)) {
            tmpl = tmpl.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(tmpl)) {
                tmpl = tmpl.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return tmpl;
    };
    /** 格式化团期 */
    Origin.formatStartDate = function (tmpl, data) {
        var self = this;
        var dataArr = [],
            ret = "";
        if (data) {
            var reg1 = tmpl.match(/%/g),
                reg2 = tmpl.match(/\{(\d{0,2})\}/i);
            //console.log(data);
            if (reg1) {
                /*
                 * eg "YYYY%-%M月D日";
                 */
                dataArr = tmpl.split("%");
                dataArr[0] = self.formatDate(dataArr[0], data[0]);
                dataArr[2] = self.formatDate(dataArr[2], data[(data.length - 1)]);
                if (dataArr[0] === dataArr[2]) {
                    ret = dataArr[0];
                } else {
                    ret = dataArr.join("");
                }
            } else {

                /*
                 * eg "M月{3},";
                 */
                var tempSl = tmpl.split(reg2[0]);
                for (var i = 0; i < data.length; i++) {
                    dataArr.push(self.formatDate(tempSl[0], data[i]));
                }
                //去重
                var tmp = [];
                for (var j = 0; j < dataArr.length; j++) {
                    if (tmp.indexOf(dataArr[j]) == -1) {
                        tmp.push(dataArr[j]);
                    }
                }
                dataArr = tmp;

                if (reg2[1]) {
                    dataArr.length = reg2[1];
                }
                ret = dataArr.join(tempSl[1]);
            }
        }
        return ret;
    };
    /** 渲染产品参数 */
    Origin.setGotoParam = function (data) {
        var self = this;
        var str = 'href="javascript:void(0)"' +
            ' data-url="//m.ly.com/dujia/tours/' + data.LineId + '.html?actType=' + data.RedirectKey + (self.getPassParam()) + '"' +
            ' data-redirectKey="' + data.RedirectKey + '"' +
            ' data-lineId="' + data.LineId + '"' +
            ' data-lineType="' + data.LineType + '"' +
            ' data-activityId="' + data.ActivityId + '"' +
            ' data-cycleId="' + data.CycleId + '"';
        return str;
    };
    /** 获取爆点数组 */
    Origin.getExplosionArray = function (data) {
        if (!data.Explosion) {
            return [];
        }
        return data.Explosion.split('##');
    };

    /**
     *  *************数据相关************* *
     */
    /** 获取数据方法 */
    Origin.getData = function (url, callback, storage) {
        var self = this;
        if (storage) {
            var _localdata = self.getLocalData(url);
            if (_localdata) {
                var localdata = {};
                try {
                    localdata = JSON.parse(_localdata);
                } catch (e) {
                    self.log("本地存储的转换失败", "data");
                }
                callback && callback.call(self, localdata);
                return;
            }
        }
        $.ajax({
            url: url,
            dataType: "jsonp",
            jsonpCallback: "jsonp" + Math.round(Math.random() * 10000),
            success: function (data) {
                if (storage) {
                    self.setLocalData(url, data);
                }
                callback && callback.call(self, data);
            },
            error: function (xhr, errorType, error) {
                self.log("接口有误:" + errorType, "interface");
            }
        });
    };
    /** 获取本地数据方法 */
    Origin.getLocalData = function (key) {
        if (typeof key === "string") {
            return this.localData && this.localData[key] || "";
        }
    };
    /** 设置本地数据方法 */
    Origin.setLocalData = function (key, value) {
        var _value = value;
        if (typeof value !== "string") {
            try {
                if (value.status && value.code >= 4000) {
                    _value = JSON.stringify(value.data || value);
                }
            } catch (e) {
                self.log(e, "data");
                return;
            }
        }
        this.localData[key] = _value;
    };
    /** 设置活动数据方法 */
    Origin.getActData = function (callback) {
        var self = this,
            config = self.config;
        if (!self.dataSerial) {
            self.dataSerial = 0;
        }
        if (self.dataSerial < config.param.length) {
            self.dataSerial ++;
            var thisCfg = config.param[self.dataSerial-1];
            thisCfg.pid = thisCfg.pid.join(',');
            var url = config.dataTmpl.replace(/{(\w+)}/g, function ($0, $1) {
                if (thisCfg[$1] === undefined) {
                    Activity.log("url对应的" + $1 + "参数不存在!", "param");
                }
                return thisCfg[$1] === undefined ? "" : thisCfg[$1];
            });
            self.getData(url, function (data) {
                if (data) {
                    var arr = data.data || data,
                        selfArr = self.data || [];
                    self.data = selfArr.concat(arr);
                }
                self.getActData(callback);
            });
        } else {
            self.originData = $.extend([], self.data);
            callback && callback.call(self);
        }
    };
    /** 数据筛选 */
    Origin.filterDataFn = function (data) {
        var self = this,
            config = self.config;

        var el = $(config.el),
            newData = {};
        var filterRule = [],
            filterElRule = {};

        el.each(function (i, n) {
            var filterStr = n.getAttribute("data-filter");
            if (filterStr) {
                if (!filterRule) {
                    filterRule = [];
                }
                //如果不包含，则放入数组
                if (!~filterRule.indexOf(filterStr)) {
                    filterRule.push(filterStr);
                }
                var _ruleItem = filterElRule[filterStr];
                if (!_ruleItem) {
                    _ruleItem = [];
                }
                _ruleItem.push(n);
                filterElRule[filterStr] = _ruleItem;
            }
        });
        if (filterRule.length === 0) {
            return data;
        }
        this.filterElRule = filterElRule;
        var filterRuleItem = filterRule;
        if (!filterRuleItem) {
            Activity.log("对应容器的规则不存在!", "param");
            return;
        }
        for (var i = 0, len = data.length - 1; i <= len; i++) {
            var item = data[i];
            for (var n = 0, nLen = filterRuleItem.length - 1; n <= nLen; n++) {
                var filterItem = filterRuleItem[n],
                    filterObjItem = this.unparam(filterItem);
                if (filterObjItem) {
                    var flag = true;
                    for (var x in filterObjItem) {
                        if (!filterObjItem.hasOwnProperty(x)) {
                            continue;
                        }
                        if (item[x] != filterObjItem[x]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        if (!newData[filterItem]) {
                            newData[filterItem] = [];
                        }
                        newData[filterItem].push(item);
                        break;
                    }
                } else {
                    Activity.log("filter表达式不存在!", "param");
                }
            }
        }
        return newData;
    };
    /** 上下价时间过滤 */
    Origin.timeCheckFn = function (data) {
        var self = this,
            config = self.config,
            retData = [],
            serviceTime = config.__server_time__ || config.__client_time__,
            itemStart,
            itemEnd;
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            itemStart = new Date(item.OnlineTime.replace(/\-/gi, "/") || null).getTime();
            itemEnd = new Date(item.OfflineTime.replace(/\-/gi, "/") || null).getTime();

            if (itemStart === config.DEFAULTTIME || itemEnd === config.DEFAULTTIME) {
                retData.push(item);
            } else {
                if (serviceTime >= itemStart && serviceTime <= itemEnd) {
                    retData.push(item);
                }
            }
        }
        return retData;
    };

    /**
     *  *************工具方法相关************* *
     */
    /** 设置传递参数方法  @param sign 是否为第一个参数 */
    Origin.getPassParam = function (sign) {
        var self = this,
            config = self.config;

        if (config._passParam) {
            return sign ? "?" + config._passParam : "&" + config._passParam;
        }
        //
        var url = location.href,
            params = config.passParams,
            paramArr = [],
            paramStr = '',
            reg, hasParam;
        //
        for (var i = 0; i < params.length; i++) {
            reg = new RegExp("[\?&](" + params[i] + "=([^&#$]*))", "i");
            hasParam = reg.exec(url);
            if (hasParam && hasParam[1]) {
                paramArr.push(hasParam[1]);
            }
        }
        paramStr = paramArr.length ? paramArr.join("&") : "";
        config._passParam = paramStr;
        if(paramStr){
            return sign ? "?" + paramStr : "&" + paramStr;
        }else{
            return '';
        }
        //

    };
    /** 设置默认回到顶部按钮 */
    Origin.setGoTop = function () {
        var self = this,
            config = self.config;
        //
        if (config.goTop === false) {
            return;
        }
        var defaultCfg = {
            cls: "go-top",
            top: 300,
            img: "//img1.40017.cn/cn/v/chuochuonew/gotop.png"
        };
        var thisCfg = $.extend(defaultCfg, config.goTop);
        var goTopEl = $(".J_GoTop");
        if (goTopEl.length === 0) {
            this.addStyle();
            $("body").append('<span class="J_GoTop ' + thisCfg.cls + '" style="display:none;position:fixed;bottom: 20px; right: 20px;width:40px;height:40px;">' +
                '<img src="' + thisCfg.img + '" style="width:100%;height:100%;" />' +
                '</span>');
            goTopEl = $(".J_GoTop");
        } else {
            return;
        }
        goTopEl.on("click", function () {
            window.scrollTo(0, 0);
            goTopEl.hide();
        });
        $(window).on("scroll", function () {
            var cScrollTop = document.body.scrollTop;
            if (cScrollTop > thisCfg.top) {
                goTopEl.show();
            } else if (cScrollTop < thisCfg.top) {
                goTopEl.hide();
            }
        });
    };
    /** 获取服务器时间 */
    Origin.getServerTime = function () {
        var self = this,
            config = self.config;
        config.__client_time__ = config.__client_time__ || new Date().getTime();
        $.ajax({
            type: "GET",
            url: "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue" + "&t=" + Math.random(),
            dataType: "jsonp",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (date) {
                var retTime = new Date(date.totalseconds.replace(/\-/gi, "/") || null).getTime();
                config.__server_time__ = retTime;
            },
            error: function () {
            }
        });
    };
    /** 日志捕获方法 */
    Origin.log = function (message, type, pageid) {
        if (window.monitorModule) {
            window.monitorModule.log(message, type, pageid);
        } else if (window.console) {
            console.error(message, type);
        }
    };
    /**  获取本地数据方法 */
    Origin.getPageState = function () {
        var localDataStr = window.sessionStorage.getItem(this.config.prefix + "localData") || "{}",
            localData = JSON.parse(localDataStr);
        return localData;
    };
    /**  设置本地方法 */
    Origin.setPageState = function () {
        var _href = location.href,
            _itemData = {};
        _itemData[_href] = {
            scrollTop: document.body.scrollTop
        };
        window.sessionStorage.setItem(self._cfg.prefix + "localData", JSON.stringify(_itemData));
    };
    /** 参数字符串转对象 */
    Origin.unparam = function (str, sep, eq) {
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

    window.Activity = new Activities();
})();


