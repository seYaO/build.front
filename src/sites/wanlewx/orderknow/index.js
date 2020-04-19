/**
 * @author 刘聪(lc07631@ly.com)
 * @module  预定须知页
 * @exports Detail
 * @desc
 * 预定须知页的模块
 *
 */
/* global Config */
(function($){
    var OrderKnow = {};
    var Common = require("/modules-lite/common/index");

    OrderKnow.init = function(){
        var self = this,
            share = require("/modules-lite/utils/share/index");
        share.disable();
    };
    module.exports = OrderKnow;
})(Zepto);

