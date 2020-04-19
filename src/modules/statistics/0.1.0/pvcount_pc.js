/*from tccdn minify at 2015-10-19 16:40:29,file：/cn/v/pv/pvcount_pc.js?v=201501171156*/
/**
 * @author 王永新(wyx06028@ly.com)
 * @module  pv统计
 * @exports City
 * @description
 * 会场页面添加pv统计
 */

(function ($) {

    var pvcount = {};

	//初始化方法
	pvcount.init = function () {
	    var param,
	        publicPlatId = pvConfig.PublicPlatId,
	        pageId = pvConfig.PageId,
	        lineId = pvConfig.LineId,
	        activityId = pvConfig.ActivityId,
	        activityPeriodId = pvConfig.ActivityPeriodId,
			SearchPlatId = pvConfig.SearchPlatId,
	        moduleId = pvConfig.ModuleId,
	        pvSource = pvConfig.PVSource,

	        ak = pvConfig.ak;
	    param = pvConfig.url + "?PublicPlatId=" + publicPlatId + "&PageId=" + pageId +
	                "&LineId=" + lineId +
	                "&ActivityId=" + activityId +
	                "&ActivityPeriodId=" + activityPeriodId +
					"&SearchPlatId=" + SearchPlatId +
	                "&ModuleId=" + moduleId +
	                "&PVSource=" + pvSource +
	                "&ak=" + ak;
	        pvcount.save(param);
	}

	pvcount.save = function (url) {
	    var img = new Image(),
	             id = "__img__" + Math.random();
	    window[id] = img;
	    img.onload = img.onerror = function () {
	        window[id] = null;
	    };
	    img.src = url;
	    img = null;
	}

	fish.ready(function () {
	    pvcount.init();
	});

})(fish)
