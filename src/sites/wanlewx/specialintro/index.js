/**
 * @author 刘聪(lc07631@ly.com)
 * @module  特色介绍
 * @exports SpecialIntro
 * @desc
 * 特色介绍的模块
 *
 */
/* global Config */
(function($){
    var SpecialIntro = {};
    var Common = require("/modules-lite/common/index");
    require("/modules-lite/utils/lazyload/index");

    //懒加载
    SpecialIntro.lazyLoad = function(){
        $("#layout-main img").lazyload({
            "css": {opacity: 0,width:'100%'},
            "effect": 'fadeIn'
        });
    };


    SpecialIntro.init = function(){
        var self = this,
            share = require("/modules-lite/utils/share/index");
        share.disable();
        self.lazyLoad();

    };
    module.exports = SpecialIntro;
})(Zepto);
