//bridge.2.2.2
;(function(win,doc){
	var ua = navigator.userAgent.toLowerCase(),
		fnId = 0,
		fncache = {};
	var nuKey = "bridgeFnNewurl2Callback", closeKey="_tc_web_bartag_isStop";
	var nuCache,closeCache;
	//_tc_bridge_public.ntvCB  app回调js写死的
	function processFn(fn,param){
		fnId++;

		var fnname  = param.cbcache ? param.cbcache + '1' : ('bridgeFnCache' + fnId),
			fntype = typeof fn;
		if(fntype === "function"){
			fncache[fnname] = fn;
		}else if(fntype === 'string'){
			var fnarr = fn.split('.'),
				fnnames;
			for (var i = 0; i < fnarr.length; i++) {
				if(i === 0){
					fnnames = window[fnarr[i]];
				}else if(Object.prototype.toString.call(fnnames) === "[object Object]"){
					fnnames = fnnames[fnarr[i]]
				}else{
					fnnames == false;
					break;
				}
				if(!fnnames){
					break;		
				}
			};
			fncache[fnname] =  typeof fnnames === 'function' ? fnnames : function(){};
		}//arguments

		if (param.cbcache) {
		    return [param.cbcache, '1']
		} else {
		    return ['bridgeFnCache', fnId];
		}
	}

	function rnparam(param){
		nuCache = [param.CBPluginName, param.CBTagName];
		param.CBTagName = param.CBPluginName + "." + param.CBTagName;
		param.CBPluginName = nuKey;
		return param;
	}

	var pub = {
		/**
	     * @description 当前平台类型
	     * @type {Number} {0: iPhone, 1: Andriod}
	     */
	    platform: null,
	    /**
	     * @description 当前是否在客户端中
	     * @type {boolean} {true: 在客户端中, false: 不在客户端中}
	     */
	    isTc: false,
	    /**
	     * @description 导航栏是否隐藏
	     * @type {bool} {true: 隐藏, false: 显示}
	     */
	    isNavbarHidden: true,
	    isToolbarHidden:true,
	    /**
	     * @description 判断一个字符串是不是空字符串
	     * @param {String} str 待判断的字符串
	     * @return {boolean}
	     */
	    NaEptStr: function (str) {
	        return !!(typeof str === 'string' && str.trim().length > 0);
	    },
		buildParams: function (param) {
		    var me = this;

		    if (!!param && !!param.reqBodyObj && !pub.isAppVersionGreatThan(801)) {
                var realStr = "";
                for (var key in param.reqBodyObj) {
                    if (param.reqBodyObj[key] != null) {
                        if (!!realStr) {
                            realStr += ',';
                        }
                        realStr += '"' + key + '":' + JSON.stringify(param.reqBodyObj[key]);
                    }
                }
                param.reqbody = realStr;
                param.reqBodyObj = null;
            }

			if (param && param.requrl) {
				var url = param.requrl;
				if (url.toLowerCase().slice(0, "%2f%2f".length) == "%2f%2f") {
					url = decodeURIComponent(url);
				}
				if (url.slice(0, "//".length) == "//"){
					param.requrl = "http:" + url;
				}
			}

		    if (Object.prototype.toString.call(param.reqbody) === "[object Object]") {
		        param.reqbody = JSON.stringify(param.reqbody)
		        param.reqbody = param.reqbody.substring(1, param.reqbody.length - 1);
		    }
		},
	    extend : function (tar, merge) {
	        if (merge && tar) {
	            var src, copy, name;
	            for (name in merge) {
	                if ((copy = merge[name]) != null) {
	                    tar[name] = copy;
	                }
	            }
	            return tar;
	        }
	    },
	    /**
	     * @description 判断一个对象是不是空对象 || 空数组
	     * @param {Object} obj 待判断的对象
	     * @return {boolean}
	     */
	    NaEptObj: function (obj) {
	    	var types = Object.prototype.toString.call(obj);
	    	if(types === "[object Array]" && obj.length > 0){
	    		return true
	    	}else if(types === "[object Object]"){
	    		for (var key in obj) {
		            if (hasOwnProperty.call(obj, key)) return true;
		        }
		        return false;
	    	}
	        return false;
	    },
	    /**
	     * @description 对传入的JSON对象做JSON.stringify和encode操作,并返回结果
	     * @param  {JSON} jsonObj 传入的JSON对象
	     * @return {String} 返回转义过的JSON字符串
	     */
	    stringifyAndEncode: function (jsonObj,notcode) {
	    	try{
	    		var val = JSON.stringify(jsonObj);
	    		if(!notcode){
					val = encodeURIComponent(val)
	    		}
	    		return val;
	    	}catch(e){
	    		return '';
	    	}
	    },
	    /**
	     * @description 对传入的JSON字符串做decode和JSON.parse操作,并返回结果
	     * @param  {JSON} jsonStr 传入的JSON字符串
	     * @return {Object} 返回处理过的对象
	     */
	    decodeAndParse: function (jsonStr) {
	    	try{
	    		return JSON.parse(decodeURIComponent(jsonStr))
	    	}catch(e){
	    		return {};
	    	}
	    },
		/**
		 * @description 拼接native端方法的JSON字符串参数
		 * @param params 调用的方法的参数对象
		 * @param CBPluginName 回调h5的模块名
		 * @param CBTagName 回调h5某个模块下的方法名
		 * @returns {String} 调用native方法的参数
		 */
		buildParamString: function (params, CBPluginName, CBTagName) {
			var jsonObj = {};
			jsonObj.param = params || null;
			jsonObj.CBPluginName = CBPluginName || '';
			jsonObj.CBTagName = CBTagName || '';

			return pub.stringifyAndEncode(jsonObj);
		},
	    ntvCB: function (json,pass) {
	        if (json) {
	            var cbObj =  Object.prototype.toString.call(json) === "[object Object]" ? json : pub.decodeAndParse(json),
	            	fnmame = cbObj.pluginname + cbObj.tagname,
	            	callback = fncache[fnmame];
				if(cbObj.pluginname === nuKey){
					if (cbObj.tagname){
						var n = cbObj.tagname.toString().split('.');
						if (n.length == 2 && win[n[0]] && win[n[0]][n[1]]){
							cbObj.pluginname = n[0];
							cbObj.tagname = n[1];
						} else if (nuCache && nuCache.length == 2) {
							fnmame = nuCache[0] + nuCache[1];
							callback = fncache[fnmame];
							cbObj.pluginname = nuCache[0];
							cbObj.tagname = nuCache[1];
						}
					}
				}
				if (closeCache && closeKey === fnmame){
					closeCache(cbObj.param);
				}
				json = cbObj;
            	if (!!cbObj.cacheKey){
	                var cacheValue = Android.getCacheByKey(cbObj.cacheKey);
	                if (!!cacheValue) {
	                    cachecbObj = JSON.parse(cacheValue);
	                    cbObj.param = cachecbObj.param;
	                }
	            }

	            if(!callback){
	            	callback = window[cbObj.pluginname];
	            	callback = callback ? callback[cbObj.tagname] : false;
	            	if(!callback){
	            		if(pass === 'catch'){
	            			return
	            		}
	            		setTimeout(function(){
	            			pub.ntvCB(json,'catch')
	            		},10)
	            	}else{
	            		callback && callback(cbObj.param)
	            	}


	            }else{
	            	callback(cbObj.param);
	            	if(fnmame.indexOf('_cbcachemark_') === -1){
	            		delete fncache[fnmame];
	            	}
	            }
	        }

	    },
        /**
	     * @brief 内部URL跳转
	     * @description 内部隐藏iframe，做URL跳转
	     * @method loadURL
	     * @param {String} url 需要跳转的链接
	     * @since v1.1.0
	    */
	    loadURL:function(url) {  

	        var iframe = doc.createElement("iframe");
	        iframe.style.display = "none";
	        iframe.src = url;
			var cont = doc.body || doc.documentElement;
			cont.appendChild(iframe);

	        setTimeout(function(){
	            iframe.parentNode.removeChild(iframe);
	            iframe = null;
	        }, 200);
	    },
	    /**
	     * app版本判断
	     * 当前版本高于支持的版本 返回true，反之 返回false
	     * @param minVer
	     * @returns {boolean}
	     */
	    appver: null,
	    isAppVersionGreatThan:function(minVer){
	        return pub.appver >= minVer && minVer > 0;
	    },
	    /**
	     * api不支持时回调
	     * @param jsonObj
	     * @param supportVer
	    */
	    appVersionNotSupportCallback : function(jsonObj, supportVer) {
	        setTimeout(function () {
				try {
					var cbJson = {
						"pluginname": jsonObj.CBPluginName,
						"tagname": jsonObj.CBTagName,
						"param": {
							"tagname": jsonObj.param && jsonObj.param.tagname,
							"startVer": supportVer
						}
					};
					pub.ntvCB(pub.stringifyAndEncode(cbJson));
				} catch (e){

				}
	        }, 10);
	    },
	    init: function () {
	        if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
	            pub.platform = 0;// iPhone
	        }else if (ua.indexOf('android') > -1) {
	            pub.platform = 1;// Android
	        }

	        if (ua.indexOf("tctravel") != -1) {
	            pub.isTc = true;
	        }

	        pub.appver = (function(){
	    		var verInt = 0,
	        		verMatch = ua.match(/tctravel\/([\d\.]+)/i);
		        if(!!verMatch && verMatch.length >= 2){
		            var verStr = verMatch[1].split(".");
		            if (verStr.length == 2) {
		                verStr.push(0);
		            }
		            if (verStr.length == 3){  //
		                verInt = parseInt(verStr.join(""));
		            }
		        }
		        return verInt
	    	})();
	    }
	}
	pub.processFn = processFn;
	pub.init();

	function getEasyJsUrl(obj, functionName, args) {
        var argStr =  ":s" + encodeURIComponent(':'+ encodeURIComponent(args));
        pub.loadURL("easy-js:" + obj + ":" + encodeURIComponent(functionName + ":") + argStr);
    }

	win._tc_bridge_public = pub;

	var methodConfig = [
		{
			pfn:'_tc_bridge_bar',
			dfn:'_tc_ntv_bar',
			config:[
				{
					name :'set_navbar',
					v:700,
					cbcache:true
				},
				{
					name:'set_navbar_hidden',
					emptyPass:true,
					v:700,
					processData:function(data){
						if(!data || !data.param){
							pub.isNavbarHidden = !pub.isNavbarHidden
				            data = {
				                param:{
				                    isNavbarHidden : pub.isNavbarHidden
				                }
				            };
				        }
				        return data;
					}
				},
				{
					name :'set_toolbar_hidden',
					v:700,
					processData:function(data){
						if(!data || !data.param){
				            pub.isToolbarHidden = !pub.isToolbarHidden;
				            data = {
				                param:{
				                    isToolbarHidden : pub.isToolbarHidden
				                }
				            };
				        }
				        return data;
					}
				},
				{
					name:'shareInfoFromH5',
					v:700,
					cbcache:true
				},
				{
					name:'show_navbar_close_icon',
					v:750
				},
				{
					name:'share_weixin_msg',
					v:809
				},
				{
					name:'show_navbar_popup',
					v:810
				},
				{
					name:'check_im_summary',
					v:810,
					cbcache:true
				}
			]
		},
		{
			pfn:'_tc_bridge_util',
			dfn:'_tc_ntv_util',
			config:[
				{
					name:'set_webview_back',
					v:710,
					dfn:'_tc_ntv_bar',
					emptyPass:1
				},
				{
					name:'set_webview_forward',
					v:710,
					dfn:'_tc_ntv_bar',
					emptyPass:1
				},
				{
					name:'show_dialog',
					v:700
				},
				{
					name:'get_data',
					v:700,
					notSupprotNormal:false,
					notSupprot:function(json){
						var pars = {};
						pars.url = decodeURIComponent(json.param.requrl);
						pars.serviceName= json.param.servicename;
						if (json.param.reqbody){
							if(json.param.reqbody[0] === "%"){
								pars.jsonBody = decodeURIComponent(json.param.reqbody)
							}else {
								pars.jsonBody = "{" + json.param.reqbody + "}";
							}
						}else {
							pars.jsonBody = "{}";
						}
						$.ajax({
			                type: 'post',
							contentType: "application/json",
							dataType: "json",
			                url: 'http://10.14.84.26:8011/appservicetest/ClientDebug/Debug',
			                data: JSON.stringify(pars),//JSON.stringify(json.param),
			                success: function (data) {
								pub.ntvCB({
									param:{
										tagname:json.param.tagname,
										CBData:data
									},
									pluginname:json.CBPluginName,
									tagname:json.CBTagName
								})
			                }
			            });
 					},
                    processData: function (param) {
                        pub.buildParams(param.param);
                        return param;
					}
				},
				{
					name:'set_page',
					v:700
				},
				{
					name:'set_event',
					v:700
				},
				{
					name:'upload_photo',
					v:710
				},
				{
					name:'keyword_search',
					v:710
				},
				{
					name:'set_city',
					v:710
				},
				{
					name:'set_category_event',
					v:710
				},
				{
					name:'set_webview_info',
					v:710,
					av:802
				},
				{
					name:'show_tips_dialog',
					v:720
				},
				{
					name:'get_network_type',
					v:720
				},
				{
					name:'set_alarm_info',
					v:720
				},
				{
					name:'get_alarm_info',
					v:720
				},
				{
					name:'cancel_alarm_info',
					v:720
				},
				{
					name:'show_toast',
					v:730
				},
				{
					name:'show_flash_dialog',
					v:730
				},
				{
					name:'save_tracelog',
					v:742
				},
				{
					name:'choose_photo',
					v:750
				},
				{
					name:'show_online_dialog',
					v:751
				},
				{
					name:'check_online_entry',
					v:751
				},
				{
					name:'set_weixin_cardcoupon',
					v:752
				},
				{
					name:'check_installed_packages',
					av:753,
					v:-1
				},
				{
					name:'scan',
					v:804
				},
				{
					name:'crop_photo',
					v:804
				},
				{
					name:'create_qrimage',
					v:804
				},
				{
					name:'get_app_info',//获取应用信息 “秒针”用
					v:806
				},
				{
					name:'td_save_product_detail',// talking data 保存浏览产品详情
					v:807
				},
				{
					name:'td_save_order_success',// talking data 保存下单成功信息
					v:807
				},
				{
					name:'td_save_pay_success',//talking data 支付成功信息
					v:807
				},
				{
					name:'get_index_config',// 获取首页接口配置
					v:810
				},
				{
					name:'get_webapp_cache',// 获取客户端缓存信息
					v:811
				},
				{
					name:'set_webapp_cache',// 设置客户端缓存信息
					v:811
				},
				{
					name:'set_clipboard',// 保存剪切板内容
					v:812
				},
				{
					name:'get_clipboard',// 获取剪切板内容
					v:812
				},
				{
					name:'capture_webview_img',// 截取webview图片
					v:814,
					notcode:814
				},
				{
					name:'call_tel',// 拨打电话
					v:815
				}
			]
		},
		{
			pfn:'_tc_bridge_map',
			dfn:'_tc_ntv_map',
			config:[
				{
					name:'app_location',
					v:710,
					cbcache: true,
					callfn:'app_locate'
				},
				{
					name:'open_navigation_map',
					v:730
				},
				{
					name:'select_city', //marks
					v:730,
					notcode:760,
					cbcache:true
				},
				{
					name:'show_multi_lonlats',
					v:740
				},
				{
					name:'open_hotel_map',
					v:760
				},
				{
					name:'select_flight_city',
					v:804
				},
				{
					name:'select_discovery_city',
					v:804
				},
				{
					name:'select_disport_city', // 海外玩乐 城市选择
					v:812
				},
				{
					name:'select_train_city', // 火车 城市选择
					v:816,
					notcode:816
				}
			]
		},
		{
			pfn:'_tc_bridge_user',
			dfn:'_tc_ntv_user',
			config:[
				{
					name:'user_login',
					v:720
				},
				{
					name:'get_device_info',
					v:720
				},
				{
					name:'get_contacts',
					v:730
				},
				{
					name:'get_mailing_address',
					v:730
				},
				{
					name:'user_logout',
					v:730
				},
				{
					name:'pick_common_contacts',
					v:740
				},
				{
					name:'pick_flight_common_contacts',
					v:750
				},
				{
					name:'pick_interflight_common_contacts',
					v:751
				},
				{
					name:'check_lockpattern',
					v:802
				},
				{
					name:'get_all_contacts',
					v:804
				},
				{
					name:'social_login_auth',
					v:806
				},
				{
					name:'pick_common_travelers', // 获取新常旅数据
					v:812
				},
				{
					name:'query_blh_info', // 查询用户信息
					v:822
				}

			]
		},
		{
			pfn:'_tc_bridge_web',
			dfn:'_tc_ntv_web',
			config:[
				{
					name:'open_newurl',
					rnparam:function (param) {
						return rnparam(param);
					},
					v:720,
					notSupprotNormal:false,
					notSupprot:function(json){
						location.href = json.param.jumpUrl;
					}
				},
				{
					name:'data_callback',
					rnparam:function (param) {
						return rnparam(param);
					},
					v:720
				},
				{
					name:'clear_cache',
					v:731
				},
				{
					name:'set_webview_mark',
					cbcache: true,
					v:806
				},
				{
					name:'jump_webview_mark',
					v:806
				},
				{
					name:'play_audio',//播放 音频
					cbcache: true,
					v:811,
					av:-1
				},
				{
					name:'open_with_close',// 打开新页，并关闭当前页
					v:820,
					notSupprotNormal:false,
					notSupprot:function(json){
						if (json && json.param) {
							var jumpUrl = json.param.jumpUrl;
							if (jumpUrl){
								if (/^(?:tctclient|(?:http|tctravel):\/\/shouji.17u.cn\/internal)/.test(jumpUrl) || jumpUrl.indexOf('tcwvcnew') > 0) {
									location.href = jumpUrl;
								} else {
									_tc_bridge_web.open_newurl(json);
								}
								closeCache = function(data){
									if (data && data.isStop === "false"){
										setTimeout(function(){
											location.href = "tctravel://shouji.17u.cn/internal/common/close"
										}, 0);
									}
								}
							}
						}
					}
				}
			]
		},
		{
			pfn:'_tc_bridge_datetime',
			dfn:'_tc_ntv_datetime',
			config:[
				{
					name:'pick_datetime',
					v:730
				},
				{
					name:'pick_date',
					v:730
				},
				{
					name:'pick_iflight_calendar',
					v:751
				},
				{
					name:'pick_common_calendar',
					v:760,
					notcode:760
				},
				{
					name:'pick_route_calendar',// POI 选择"经典行程" 日历
					v:811
				},
				{
					name:'correct_local_time',// 校验本地时间
					cbcache:true,
					v:814
				}
			]
		},
		{
			pfn:'_tc_bridge_sale',
			dfn:'_tc_ntv_sale',
			config:[
				{
					name:'get_redpackage',
					v:730
				},
				{
					name:'select_redpackage',
					v:730
				},
				{
					name:'get_redpackage_with_price',
					v:730
				}
			]
		},
		{
			pfn:'_tc_bridge_pay',
			dfn:'_tc_ntv_pay',
			config:[
				{
					name:'pay_creditcard',
					v:730
				},
				{
					name:'pay_alipay',
					v:730
				},
				{
					name:'pay_platform',
					v:740
				},
				{
					name:'open_recommend_page',
					v:740
				},
				{
					name:'flight_pay_platform',
					v:750
				},
				{
					name:'pay_weixin',
					v:822
				}
			]
		},
		{
			pfn:'_tc_bridge_project',
			dfn:'_tc_ntv_project',
			config:[
				{
					name:'update_trainorder_status',
					v:742
				},
				{
					name:'write_comment',
					v:742
				},
				{
					name:'open_commentlist',
					v:742
				},
				{
					name:'save_train_nonmember_order',
					v:750
				},
				{
					name:'save_flight_nonmember_order',
					v:750
				},
				{
					name:'open_comment_center',
					v:752
				},
				//{ //814~
				//	name:'open_hotel_book_page',
				//	v:760
				//},
				{
					name:'save_flight_history_city',
					v:806
				},
				{
					name:'save_nonlogin_orders', // 保存 本地订单
					v:811
				},
				{
					name:'update_nonlogin_orders', // 更新 本地订单
					v:811
				},
				{
					name:'select_vacation_dest', // 选择 出境目的地
					v:811
				},
				{
					name:'write_invoice', // 填写发票
					v:816
				}
			]
		}
	]

	for (var i = 0; i < methodConfig.length; i++) {
		var tconfig = methodConfig[i],
			configs = tconfig.config;
		win[tconfig.pfn] = win[tconfig.pfn] || {};
		
		for(var j = 0; j < configs.length; j++){
			(function(item,nconfig,bfn,pname){//names
				var pass;
					if(pub.platform == 1){ //安卓版本
						pass = pub.isAppVersionGreatThan(item.av || item.v)
					}else{
						pass = pub.isAppVersionGreatThan(item.v)
					}

				var dfn = item.dfn || nconfig.dfn,
					cfn = item.name;

				bfn[cfn] = function(param){
					if(item.processData){
						param = item.processData(param);
					}
		        	if(param){
		        		if(item.cbcache){
		        			param.cbcache = pname + '_cbcachemark_'+ cfn;
		        		}
		        		if(param.callback){
							var fnArrs = pub.processFn(param.callback,param);
							param.CBPluginName = fnArrs[0]
							param.CBTagName = fnArrs[1];
						}
					}
					// else{
					// 	pub.processFn(param.CBPluginName + '.' + param.CBTagName);
					// }

					if(!item.emptyPass && !pub.NaEptObj(param)){ //不能为空
						return;
					}
					var callfns = item.callfn || cfn;
					if(pass){
						if(item.rnparam){
							param = item.rnparam(param);
						}
						if (pub.platform == 0) {//iPhone
			                getEasyJsUrl(dfn, callfns, pub.stringifyAndEncode(param));
			            } else if(pub.platform == 1) {
		                	var sendStr = pub.stringifyAndEncode(param,(item.notcode && pub.isAppVersionGreatThan(item.notcode)));
							win[dfn] && win[dfn][callfns] && win[dfn][callfns](sendStr);
			            }
					}else{
						item.notSupprot && item.notSupprot(param);
						if(item.notSupprotNormal !== false){
							pub.appVersionNotSupportCallback(param, item.v.toString().split('').join('.'))
						}
					}
				}
			}(configs[j],tconfig,win[tconfig.pfn],tconfig.pfn));
		}
	};

})(window,document);

(function(win, plugin) {
	var timeDelta = "";
	var datetime = win._tc_bridge_datetime;
	function setResult(cbStr) {
		var cbObj = JSON.parse(cbStr);
		if (cbObj) {
			timeDelta = parseInt(cbObj.delta) || 0;
		}
	}
	function initTimeDelta() {
		if (win.Android && Android.getCorrectLocalTime) {
			setResult(Android.getCorrectLocalTime());
		} else if (timeDelta === "" && win._tc_bridge_public.platform == 0
			&& win._tc_bridge_public.isAppVersionGreatThan(814)) {
			datetime && datetime.correct_local_time && datetime.correct_local_time({
				callback: function (data) {
					if (data && data.CBData) {
						setResult(data.CBData);
					}
				}
			})
		} else if (timeDelta === ""){
			timeDelta = 0;
		}
	}
	/**
	 * 获取同程app矫正后的时间
	 * @param chinaTime
	 * @returns {number}
	 * @constructor
	 */
	function dateNow() {
		initTimeDelta();
		var timeMillis = Date.now();
		timeMillis += timeDelta || 0;
		return timeMillis;
	}
	initTimeDelta();
	plugin.dateNow = dateNow;
})(window, window._tc_bridge_datetime = window._tc_bridge_datetime || {});