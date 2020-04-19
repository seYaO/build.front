define([
    "jquery",
    "tmpl/pc/newindex/city",
    "tmpl/pc/newindex/desCity",
    "citypanel/0.1.0/index.css"
], function(require, exports, module) {
    var $ = require("jquery");

    var _config = {
        depWrapEl: '.J_depSel',
        desWrapEl: '.J_desSel',
        url: 'http://www.ly.com/dujia/AjaxActivity.aspx?type=QueryIndexTotalCity&lineType=0|1',
        flag: 'group'
    };
    var Index = {};
    var TplDepCity = require("tmpl/pc/newindex/city");
    var TplDesCity = require("tmpl/pc/newindex/desCity");

    Index._data = {};

    Index.init = function(options) {
        Index.initEv(options);
    };

    Index.initEv = function(options) {

        $.extend(_config, options);

        //出发地和目的地选取
        var depSelEl = $(_config.depWrapEl),
            desSelEl = $(_config.desWrapEl);

        if(depSelEl.length + desSelEl.length === 0) {return;}

        var htmlDepCity = '<div class="mNotice-wrap depCity_s_warp none"></div>';
        var htmlDesCity = '<div class="mNotice-wrap desCity_s_warp none"></div>';

        var depEl = depSelEl.find('input:text'),
            desEl = desSelEl.find('input:text'),
            depWrapEl = depSelEl.find('.depCity_s_wrap'),
            desWrapEl = desSelEl.find(".desCity_s_warp");

        if(depEl.length === 0) {depEl = $('<input type="text" />'); depSelEl.append(depEl)}
        if(desEl.length === 0) {desEl = $('<input type="text" />'); desSelEl.append(desEl)}
        if(depWrapEl.length === 0) {depWrapEl = $(htmlDepCity); depSelEl.append(depWrapEl)}
        if(desWrapEl.length === 0) {desWrapEl = $(htmlDesCity); desSelEl.append(desWrapEl)}

        if(options && options.url) {_config.url = options.url}
        if(options && options.url) {_config.url = options.url}

        //不同的显示方式导致要分开注册事件
        $(depSelEl).on("click", function(e) {
            e.stopPropagation();
            var self = $(this),
                noticeEl = self.find(".mNotice-wrap");
            self.children(".city_b").toggleClass("city_b_sel");
            //self.children("input").select();
            $(".mNotice-wrap").not(noticeEl).hide();
            // !$.trim(noticeEl.html()) 判断是否已渲染后期优
            if (!Index._data.city || !$.trim(noticeEl.html())) {
                Index.handleCity({
                    "url": _config.url,
                    "flag": _config.flag,
                    "key": "start",
                    "elem": this
                });
            } else {
                noticeEl.toggle();
            }
        });
        $(desSelEl).on("click", function(e) {
            e.stopPropagation();
            var self = $(this),
                noticeEl = self.find(".mNotice-wrap");
            self.children("input").select();
            $(".mNotice-wrap").not(noticeEl).hide();
            Index.handleCity({
                "url": _config.url,
                "flag": _config.flag,
                "key": 'dest',
                "elem": this
            });
        });
        //出发地事件
        depWrapEl.on("click", ".mNotice-normal", function() {
            var self = $(this),
                dep = $.trim(self.html());
                
            depEl.val(dep).attr("attrvalu", dep).attr("data-cityId", self.attr("data-cityId")).attr("data-value", self.attr("data-value"));
            $(this).trigger("close");
            desSelEl.click();
            Index.modifyUrl();
        });
        //目的地事件
        desWrapEl.on("click", ".mNotice-normal", function() {
            var self = $(this),
                text = $.trim($(this).text());
            desEl.val(text).attr("attrvalu", text).attr("data-cityId", self.attr("data-cityId"));
            $(this).trigger("close");
        });
        desEl.on("keyup input", function() {
            $(".mNotice-wrap").hide();
        });

        $(".mNotice-wrap").on("click", function(e) {
            e.stopPropagation();
        }).on("click", ".mNotice-close", function(e) {
            e && e.preventDefault();
            $(this).parents(".mNotice-wrap").trigger("close");
        }).on("click", ".mNotice-mTab-item", function() {
            $(this).addClass("current").siblings().removeClass("current");
            $(this).parents(".mNotice-wrap").find(".mNotice-mTab-content").hide().eq($(this).index()).show();
        }).on("close", function() {
            $(this).hide();
            $(".city_b").removeClass("city_b_sel");
        });

        $(document).on("click", function() {
            $(".mNotice-wrap").trigger("close");
        });
    };

    /**
     * 出发地和目的地处理
     * @param config
     */
    Index.handleCity = function(config) {
        var url = config.url;
        var param = {
            "lineType": "0,1"
        };
        var flag = config.flag,
            key = config.key,
            elem = config.elem,
            tpl = key === "start" ? TplDepCity : TplDesCity,
            context = $(elem).find(".mNotice-wrap");
        if (!Index._data.city) {
            if ($(elem).hasClass("active")) {
                return;
            }
            $(elem).addClass("active");
            $.get(url, param, function(data) {
                var _data = data[flag][key];
                _data = key === "start" ? Index.dealData(_data) : _data;
                Index._data.city = data;
                Index.render({
                    tpl: tpl,
                    key: key,
                    data: _data,
                    overwrite: true,
                    context: context,
                    callback: function() {
                        $(elem).removeClass("active").find(".city_b").addClass("city_b_sel");
                        $(context).show();
                    }
                });
            }, "jsonp");
        } else {
            var _data = Index._data.city[flag][key];
            _data = key === "start" ? Index.dealData(_data) : _data;
            Index.render({
                tpl: tpl,
                key: key,
                data: _data,
                overwrite: true,
                context: context,
                callback: function() {
                    $(elem).removeClass("active");
                    $(context).show();
                }
            });
        }
    };
    /**
     * @desc 根据出发地修改url
     */
    Index.modifyUrl = function() {
        var dep = $.trim($("#DepartureCity").attr("data-value"));
        $(".hot_dest a").each(function() {
            var self = $(this),
                href = self.attr("href");
            href = href.replace(/(dujiatag\/)([^/]+)(?=\/(zizhuyou|chujingyou))/, function($0, $1) {
                return $1 + dep;
            });
            self.attr("href", href);
        });
    };
    /**
     * 渲染逻辑同touch
     * @param config
     */
    Index.render = function(config) {
        var tpl = config.tpl,
            key = config.key,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback,
            _html = tpl(data),
            cxt;
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(_html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    };
    /**
     * 将城市分类
     * @param data
     * @returns {Array}
     */
    function sort(data) {
        var ary = ["ABCDEF", "GHJKLM", "NOPQRS", "TUWXYZ"];
        var result = [
            [],
            [],
            [],
            []
        ];
        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = 0; j < ary.length; j++) {
                var index = ary[j].indexOf(data[i].FirstLetter);
                if (index > -1) {
                    result[j].push(data[i]);
                }
            }
        }
        return result;
    }

    /**
     * 获取参数
     * @returns {*}
     */
    function getQueryString(queryStr, key) {
        var _queryStr, _key;
        _queryStr = key ? queryStr : window.location.search.substr(1);
        _key = key || queryStr;
        var reg = new RegExp("(^|&)" + _key + "=([^&]*)(&|$)", "i");
        var r = _queryStr.match(reg);
        if (r !== null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    /**
     * 出发地数据处理
     * @param data
     * @returns {{}}
     */
    Index.dealData = function(data) {
        var _data = {},
            _common = data.common.concat();
        _data.hot = data.hot;
        _data.common = sort(_common);
        return _data;
    };

    module.exports = Index;
});
