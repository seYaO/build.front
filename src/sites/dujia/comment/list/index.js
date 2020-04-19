var Common = require("common/0.1.0/index");
require("/modules/dialog/0.3.0/index");
var listTmpl = require("./views/list.dot");
var loadingCfg = {
    loading: '<p class="loading"><i></i>努力加载中</p>',
    click: '<p>点击加载数据</p>',
    nomore: '<p>没有更多产品啦</p>'
};
var fileDialog, openid;
var List = {
    //获取url参数
    getbaseInfo: function () {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
        }
        return theRequest;
    },
    init: function (cfg) {
        var self = this;
        if (self.isWeiXin()) {
            // openid = self.getbaseInfo().code || '';
            self.getData(cfg);
            self.scrollLoad();
        }
    },
    thisCfg: {
        PageSize: 10,
        Index: 1
    },
    isWeiXin: function () {
        var self = this;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            self.conDialog("请在微信中打开此页面");
            return false;
        }
    },
    getData: function (conf, callback) {
        var self = this;
        // self.thisCfg = $.extend(self.thisCfg, {openId: openid}, {});
        self.thisCfg = $.extend(self.thisCfg, conf||{});
        $(".data-loader").css("display","block").html(loadingCfg.loading);
        self.isLoading = true;
        $.ajax({
            url: '/intervacation/api/WeChatCommon/GetOrderInfoList',
            data: self.thisCfg,
            dataType: 'json',
            success: function (data) {
                var _data = data.Data;
                if (_data.data.TotalCount) {
                    loadingCfg.totalPage = Math.ceil(_data.data.TotalCount / 10);
                    loadingCfg.page = _data.data.Index - 0;
                    var innerHtml = listTmpl(_data.data.OrderInfoLst);
                    $('.J_List').append(innerHtml);
                    self.isLoading = false;
                    callback && callback.call(this);
                    if (loadingCfg.totalPage <= (loadingCfg.page - 0)) {
                        $(".data-loader").css("display","block")
                            .html(loadingCfg.nomore);
                    }
                } else if (self.thisCfg.Index > 1) {
                    $(".data-loader").css("display","block").html(loadingCfg.nomore);
                } else {
                    $(".data-loader").css("display","none");
                    var noInnerHtml = listTmpl([]);
                    $('.J_List').append(noInnerHtml);
                }
            }
        })
    },
    /**
     * 加载更多的列表数据,滚动时触发
     * @param callback
     */
    loadListData: function (callback) {
        var self = this,
            pageIndex = loadingCfg.page;
        if (++pageIndex <= loadingCfg.totalPage) {
            var cfg = { Index: pageIndex };
            self.getData(cfg, callback);
        } else {
            callback.call(this, this);
        }
    },
    /**
     * 绑定滚动加载数据事件
     */
    scrollLoad: function () {
        var self = this;
        $(window).on("scroll", function (e) {
            var scrollElem = $(this);
            var diff = 20;
            if (!self.isLoading && !self.isLoaded &&
                scrollElem.scrollTop() + diff >= $("body").height() - scrollElem.height() &&
                loadingCfg.totalPage > loadingCfg.page) {
                self.isLoading = true;

                $(".data-loader").css("display", "block")
                    .html(loadingCfg.loading);
                self.loadListData(function () {
                    if (loadingCfg.totalPage < loadingCfg.page) {
                        self.isLoaded = true;
                        return;
                    }
                    self.isLoading = false;
                });
            }
            e.stopPropagation();
        });
    },
    conDialog: function (content, btn) {
        if (fileDialog) {
            fileDialog.destroy();
        }
        fileDialog = $.dialog({
            width: 200,
            buttons: btn,
            content: content
        });
        fileDialog.open();
    }
};
module.exports = List;