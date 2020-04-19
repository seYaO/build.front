/**
 * @author 尹红姿(yhz10832@yhz.com)
 * @module  玩乐首页
 * @exports 玩乐
 * @desc
 * 玩乐首页的模块
 *
 */
 /*修改 fx6698 */
 
/* global Config */
(function ($) {
    var Main = {},
        Common = require("/modules-lite/common/index");
    var tpl = {};
    tpl.cities = require('./ajaxdot/cities.dot');
    Main.init = function () {
        var self = this,
            share;
        share = require("/modules-lite/utils/share/index");
        share.enable();
        require("/modules-lite/utils/lazyload/index");
        require("/modules-lite/sliderIndex/sliderIndex");
        self.tabCity();
        self.mSlider();
        self.lazyLoad();
    };

    //得到城市列表
    //@params: area 区域id
    //         index  标志具体区域id下面的具体城市
    Main.getCity = function (area, index) {
        var _config = {
            Platment: 61034,
            Area: area || 6103402
        },
            url = "/wanle/api/WWanleProduct/GetHotProduct?siteType=1&" + $.param(_config);
        Common.getData(url, function (data) {
            data.index = index || 0;
            Common.render({
                key: "cities",
                data: data,
                context: ".destTab_detail",
                tmpl: tpl,
                overWrite: true,
                callback: function () {

                }
            });
        });
    };

    //城市切换
    Main.tabCity = function () {
        $(".J_dest_boxs").find("li").on("click", function () {
            var self = $(this);
            if (!self.hasClass("select")) {
                var index = self.attr("data-id"),
                    showElem = $(".J_dest_Detail" + index),
                    area = self.attr("data-city");
                self.siblings().removeClass("select");
                self.addClass("select");
                if ($(showElem).length) {
                    showElem.removeClass("none");
                    showElem.siblings().addClass("none");
                } else {
                    $(".J_dest_details").find("ul").addClass("none");
                    Main.getCity(area, index);
                }
            }
        });

        $(document).on("click", ".J_dest_details a", function () {
            var self = $(this);
            sessionStorage.setItem("ImageUrl", "");
            location.href = self.attr("data-href");
        });
    };


    //幻灯
    Main.mSlider = function () {
        $(".slider").slider({
            loop: false,
            autoScroll: false
        });

    };

    //懒加载
    Main.lazyLoad = function () {
        $(".J_hotProduct img").lazyload({
            "css": { opacity: 0 },
            "effect": 'fadeIn'
        });
    };

    module.exports = Main;
})(Zepto);


