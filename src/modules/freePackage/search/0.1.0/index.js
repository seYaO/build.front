define("freePackage/search/0.1.0/index", ["datepicker/0.2.1/datepicker",
	"popup/0.2.0/popup", "validate/1.0.0/validate", "./flySearch.dot","./hotelSearch.dot", "freePackage/search/0.1.0/index.css","dialog/0.2.0/dialog"
], function(require) {
	var Search = function() {};
	var _vali = require("validate/1.0.0/validate"),
		Popup = require("popup/0.2.0/popup"),
		DatePicker = require("datepicker/0.2.1/datepicker"),
		flySearch = require("./flySearch.dot"),
		newdialog = require("dialog/0.2.0/dialog"),
		hotelSearch = require("./hotelSearch.dot"),
		citytimer = null,
		hotelCityData = {};
	var $dialog = new newdialog({
        skin: 'default',
        template: {
            modal: {
                html: '<div class="dialog_modal_gp">' +
                    '<div class="dialog_modal_content" data-dialog-content></div>' +
                    '</div>'
            }
        }
    });
    var _popup = new Popup({
				berth: ".ui-input-date",
				align: "bottom left",
				width: "400px",
				"hideTrigger": "blur,esc", //blur,esc
				"position": "berth" //fixed,berth
			});
	Search.prototype = {
		init: function() {
			var self = this;
			self.initEv();
			self.submitEv();
			self.calRender();
			self.cityEv();
			self.saveCityData();
		},
		saveCityData: function() {
			var self = this,
				url = "/intervacation/api/PDynamicPackageHotel/GetCitys";
			$.ajax({
				url: url,
				dataType: "json",
				success: function(data) {
					self.hotelCityData = data;
				}
			});
		},
		initEv: function() {
			var self = this;
			$(document).on("click",".ui-input",function(e){
				$(this).addClass('inStyle');
			});
			$(document).on("blur",".ui-input",function(e){
				$(this).removeClass('inStyle');
			});
			$(document).on("click", ".mNotice-mTab-item", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var _self = $(this),
					index = _self.index();
				if (_self.hasClass('current')) {
					return;
				} else {
					_self.parent().find('.mNotice-mTab-item').removeClass('current');
					_self.addClass('current');
					_self.parents(".mNotice-mTab").find('.mNotice-mTab-content').addClass('none');
					_self.parents(".mNotice-mTab").find('.mNotice-mTab-content').eq(index).removeClass('none');

				}
			});
			$(document).on("click", ".mNotice-normal", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var _self = $(this);
				_self.parents(".defaultCity").siblings('.ui-input-city').removeClass('input_error').val(_self.html());
				_self.parents(".defaultCity").siblings('.dj-validate').removeClass('active');
				_self.parents(".defaultCity").hide();
			});
			$(document).on("click", ".mNotice-close", function(e) {
				e.preventDefault();
				var _self = $(this);
				_self.parents(".defaultCity").hide();
			});
		},
		/*日历*/
		calRender: function() {
			var self = this;
			var _datepicker;
			$(document).on("click", ".ui-input-date", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var _self = $(this),
					age, maxDate, minDate, today, thisyear = 2016,
					value;
					var bdate = self.dateCal(new Date(),180,1);
				self.hideSlide();
				$(".defaultCity").hide();
				if (_self.hasClass('flyDate')) {
					if(_self.hasClass('goDate')){
						var curDate = new Date();
						minDate = new Date((curDate/1000+24*60*60)*1000);
					}else{
						minDate = $(".goDate").val();
					}
					maxDate = bdate;
				} else {
					var date1 = self.dateCal(new Date($(".goDate").val().replace(/-/g,"/")),1,0) || '',
						date2 = self.dateCal(new Date($(".backDate").val().replace(/-/g,"/")),1,1) || bdate,
						date3 = new Date();
					minDate = date1 || date3;
					maxDate = date2;
				}
				_popup.render = function(obj, res) {
					if (!_datepicker) {
						_datepicker = new DatePicker({
							wrapper: this.o_wrapper,
							skin: "default",
							maxDate: maxDate,
							minDate: minDate,
							monthCount: 2,
							allowCancel: false
						});
						_datepicker.on("dayselect", function(o, y, m, d) {
							$(_popup.attr.berth).val(d);
							_popup.hide();
							$(_popup.attr.berth).removeClass("input_error");
							$(_popup.attr.berth).siblings(".dj-validate").removeClass("active");
							$(_popup.attr.berth).siblings(".valid_symbol").addClass("none");
							if($(_popup.attr.berth).hasClass("goDate") || $(_popup.attr.berth).hasClass("backDate")){
								$(".hotelInDate").val('');
								$(".hotelOutDate").val('');
							}
						});
					} else {
						_datepicker.attr.maxDate = maxDate;
						_datepicker.attr.minDate = minDate;
						//_datepicker.setValues([value]);
					}
					_datepicker.open();
					res();
				};
				_popup.open({
					berth: this
				});
			});
		},
		dateCal:function(date,day,rule){
			if(date){
				if(rule==1){
					var stime = date.getTime() + 1000*60*60*24*day;
				}else{
					var stime = date.getTime() - 1000*60*60*24*day;
				}
				date = new Date(stime);
				var yy = date.getFullYear();
				var m = date.getMonth() + 1;
				var d = date.getDate();
				return yy+"-"+m+"-"+d;
			}else{
				return '';
			}
		},
		hideSlide: function(){
			var jijiuInfo = $(".jijiuInfo");
			jijiuInfo.find(".childNumBox").hide();
			jijiuInfo.find(".childOld-box").addClass('none');
			jijiuInfo.find(".adultNumBox").hide();
			jijiuInfo.find(".roomNumBox").hide();
		},
		submitEv: function() {
			var self = this;
			$(document).on("click", ".J_jijiu_search", function(e) {
				var _self = $(this);
				var needVali = $(".jijiuInfo"),
					flag = false,
					vali = new _vali({
						wrapper: needVali,
						showOneMsg: true
					});

				vali.on("failure", function(o, obj) {
					$(obj).addClass("input_error");
					$(obj).siblings(".valid_symbol").addClass("none");
				});
				vali.on("success", function(o, obj) {
					$(obj).removeClass("input_error");
					$(obj).siblings(".valid_symbol").removeClass("none");
				});
				if (vali.validate()) {
					flag = true;
				}
				if(flag == true){
					var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
	                var config = {
	                    content: content,
	                    width: 500,
	                    title: '',
	                    quickClose: false,
	                    zIndex: 100000
	                };
	                $dialog.modal(config);
	                window.dialog = $dialog;
					var adult = 0,ageList = [],room = 0;
					adult = parseInt($("#adult").val());
					room = parseInt($("#room").val());
					$(".drop-child").each(function() {
                        var _this = $(this);
                        var childage = _this.attr("data-year");
                        ageList.push(childage);
                    });
                    var dest = $(".J_flyDestCity").val(),
                    arrive = $(".J_flyArrCity").val(),
                    destDate = $(".flyDate").val(),
                    arrDate = $(".backDate").val();
                    var checkIndate = [],checkOutdate = [],hotels = [];
                    $(".hotelInDate").each(function() {
                        var _this = $(this);
                        var InDate = _this.val();
                        checkIndate.push(InDate);
                    });
                    $(".hotelOutDate").each(function() {
                        var _this = $(this);
                        var OutDate = _this.val();
                        checkOutdate.push(OutDate);
                    });
                    $(".input-city-hotel").each(function() {
                        var _this = $(this);
                        var hotel = _this.val();
                        hotels.push(hotel);
                    });
					var cctParam = $("#cctParam").val();
					if(cctParam){
						var url = "/dujia/travel/search?from="+encodeURIComponent(dest)+"&to="+encodeURIComponent(arrive)+"&begin="+destDate+"&end="+arrDate+"&hotel="+encodeURIComponent(hotels.join())+"&checkindate="+checkIndate.join()+"&checkoutdate="+checkOutdate.join()+"&adult="+adult+"&child="+ageList.join()+"&room="+room +"&fromcct=1";
						$("#fromCctParam").val(encodeURIComponent(cctParam));
						var thisparam = encodeURIComponent(JSON.stringify(product.Data));
						$("#hotelForm").attr('action', url);
						$("#productParam").val(thisparam);
						$("#hotelForm").submit();
					}else{
						var url = "/dujia/travel/search?from="+encodeURIComponent(dest)+"&to="+encodeURIComponent(arrive)+"&begin="+destDate+"&end="+arrDate+"&hotel="+encodeURIComponent(hotels.join())+"&checkindate="+checkIndate.join()+"&checkoutdate="+checkOutdate.join()+"&adult="+adult+"&child="+ageList.join()+"&room="+room;
						_self.html("搜索中");
						window.location.href=url;
					}
				}
			});
		},
		cityEv: function() {
			var self = this;
			$(document).on("keyup",".ui-input-city",function(e){
				e.preventDefault();
				e.stopPropagation();
				var _self = $(this);
				$(".defaultCity").hide();
				self.onKeyUp(e, _self);
				self.hideSlide();
			});
			$(document).on("key_up",".ui-input-city",function(e){
				e.preventDefault();
				e.stopPropagation();
				var obj = $(this);
				self._onKeyUp(e, obj);
			});
			$(document).on("key_down",".ui-input-city",function(e){
				e.preventDefault();
				e.stopPropagation();
				var obj = $(this);
				self._onKeyDown(e, obj);
			});
			$(document).on("enter",".ui-input-city",function(e){
				e.preventDefault();
				e.stopPropagation();
				var obj = $(this);
				self._onEnter(e, obj);
			});
			$(document).on("click", ".flycityItem", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var _self = $(this);
				_self.parents(".flyMoreCity").siblings('input').val(_self.attr("data-name"));
				_self.parents(".flyMoreCity").hide();
				self.hideSlide();
			});
			$(document).on("click", ".input-city-fly", function(e) {
				e.preventDefault();
				e.stopPropagation();
				_popup.hide();
				var _self = $(this),
					newdata = [];
				var isArr = (_self.hasClass('J_flyArrCity'));
				if (isArr) {
					var leavedata = self.noticeJsonData.arrive,
						newdata = [leavedata.Data.国际热门, leavedata.Data.欧洲, leavedata.Data.美洲, leavedata.Data.非洲, leavedata.Data.大洋洲, leavedata.Data.亚洲],
						text1 = "目的地";
				} else {
					var leavedata = self.noticeJsonData.leave,
						newdata = [leavedata.Data.国内热门],
						text1 = "出发地";
				}
				var cityhtml = '';
				if (_self.val() == "") {
					if (!_self.siblings('.defaultCity') == "") {
						cityhtml += '<div class="mNotice-mTab"><span class="mNotice-arrows"></span><h4 class="mNotice-mTab-head">' + text1 + '<span class="mNotice-mTab-head-remark">（可直接输入城市名）</span><span data-dialog-hide class="mNotice-close"></span></h4><div class="mNotice-mTab-wrap">';
						if (_self.hasClass('J_flyArrCity')) {
							cityhtml += '<ul class="mNotice-mTab-tab-tray clearfix">';
							var classCurrent = "";
							for (var k = 0; k < leavedata.tab.length; k++) {
								if (k == 0) {
									classCurrent = "current";
								} else {
									classCurrent = "";
								}
								cityhtml += '<li class="mNotice-mTab-item ' + classCurrent + '">' + leavedata.tab[k] + '</li>';
							}
							cityhtml += '</ul>';
						}
						var len = newdata.length,
							classNone = "none";
						for (var j = 0; j < len; j++) {
							if (j == 0) {
								classNone = "";
							} else {
								classNone = "none";
							}
							cityhtml += '<div class="mNotice-mTab-content clearfix ' + classNone + '">';
							var thisdata = newdata[j],
								thisDataLen = thisdata.length,
								m;
							for (m = 0; m < thisDataLen; m++) {
								cityhtml += '<span class="mNotice-normal mNotice-fixWidth" title="' + thisdata[m] + '">' + thisdata[m] + '</span>';
							}
							cityhtml += '</div>';
						}
						cityhtml += '</div></div>';
						$('.defaultCity').hide();
						_self.siblings('.defaultCity').html(cityhtml).show();
					} else {
						$('.defaultCity').hide();
						_self.siblings('.defaultCity').show();
					}
					$(".flyMoreCity").hide();
					//失去焦点隐藏
					$(document).bind('click', function() {
						self.__docClick.call(self, arguments.callee);
					});
					self.__stopPropagation();
				}
				self.hideSlide();
			});
			$(document).on("click", ".input-city-hotel", function(e) {
				e.preventDefault();
				e.stopPropagation();
				_popup.hide();
				var _self = $(this),
					cityhtml = '';
				var newdata = self.hotelCityData;
				if (newdata.Code == 4000 && newdata.Data.length) {
					var leavedata = newdata.Data;
					if (_self.val() == "") {
						if (!_self.siblings('.defaultCity') == "") {
							cityhtml += '<div class="mNotice-mTab"><span class="mNotice-arrows"></span><h4 class="mNotice-mTab-head"><span class="mNotice-mTab-head-remark">支持中/英文/拼音输入</span><span data-dialog-hide class="mNotice-close"></span></h4><div class="mNotice-mTab-wrap"><ul class="mNotice-mTab-tab-tray clearfix">';
							var classCurrent = "";
							for (var k = 0; k < leavedata.length; k++) {
								if (k == 0) {
									classCurrent = "current";
								} else {
									classCurrent = "";
								}
								cityhtml += '<li class="mNotice-mTab-item ' + classCurrent + '">' + leavedata[k].Type + '</li>';
							}
							cityhtml += '</ul>';
							var len = leavedata.length,
								classNone = "none";
							for (var j = 0; j < len; j++) {
								if (j == 0) {
									classNone = "";
								} else {
									classNone = "none";
								}
								cityhtml += '<div class="mNotice-mTab-content clearfix ' + classNone + '">';
								var thisdata = leavedata[j],
									thisDataLen = thisdata.Citys.length,
									m;
								for (m = 0; m < thisDataLen; m++) {
									cityhtml += '<span class="mNotice-normal mNotice-fixWidth" title="' + thisdata.Citys[m].CityName + '">' + thisdata.Citys[m].CityName + '</span>';
								}
								cityhtml += '</div>';
							}
							cityhtml += '</div></div>';
							$('.defaultCity').hide();
							_self.siblings('.defaultCity').html(cityhtml).show();
						} else {
							$('.defaultCity').hide();
							_self.siblings('.defaultCity').show();
						}
						$(".flyMoreCity").hide();
					}
				}
				//失去焦点隐藏
				$(document).bind('click', function() {
					self.__docClick.call(self, arguments.callee);
				});
				self.__stopPropagation();
				self.hideSlide();
			});
		},
		_onEnter: function(e, obj) {
			var self = this;
			var $box = obj.siblings('.flyMoreCity');
			var val = $box.find(".flycityItem.select").attr("data-name") || "";
			$box.hide();
			obj.val(val);
		},
		/*
		 * 下方向键
		 */
		_onKeyDown: function(e, obj) {
			var self = this;
			var $obj = obj.siblings('.flyMoreCity').find(".flycityItem.select");
			var $nextobj = $obj.next(".flycityItem");
			if ($nextobj.length > 0) {
				$obj.removeClass("select");
				$nextobj.addClass("select");
			} else {
				return;
			}
			//self.trigger("itemselect", $nextobj, $nextobj.index());
		},
		/*
		 * 按上方向键
		 */
		_onKeyUp: function(e, obj) {
			var self = this;
			var $obj = obj.siblings('.flyMoreCity').find(".flycityItem.select");
			var $prevobj = $obj.prev(".flycityItem");
			if ($prevobj.length > 0) {
				$obj.removeClass("select");
				$prevobj.addClass("select");
			} else {
				return;
			}
			//self.trigger("itemselect", $prevobj, $prevobj.index());
		},
		onKeyUp: function(e, obj) {
			var self = this;
			switch (e.keyCode) {
				case 13:
					obj.trigger("enter");
					break;
				case 27:
					obj.trigger("esc");
					break;
				case 38:
					obj.trigger("key_up");
					break;
				case 40:
					obj.trigger("key_down");
					break;
				default:
					self.renderFly(e, obj);
					break;
			}
		},
		renderFly: function(e, obj) {
			var self = this,
				_self = $(obj),
				val = _self.val(),
				citybox = _self.siblings('.flyMoreCity');
			_self.hasClass('J_flyDestCity') ? category = 1 : category = 2;
			_self.hasClass('input-city-fly') ? isfly = true : isfly = false;
			clearTimeout(citytimer);
			if (val != "") {
				citytimer = setTimeout(function() {
					if(isfly){
						var url = "/intervacation/api/PDynamicPackageFlight/GetSearchCity?city=" + val + "&category=" + category;
					}else{
						var url = "/intervacation/api/PDynamicPackageHotel/GetSearchCity?city=" + val;
					}
					$.ajax({
						url: url,
						dataType: "json",
						success: function(data) {
							data.val = val;
							data.val1 = "<em>" + val + "</em>";
							if(isfly){
								var flyhtml = flySearch(data);
							}else{
								var flyhtml = hotelSearch(data);
							}
							citybox.empty().html(flyhtml).show();
							//失去焦点隐藏
							$(document).bind('click', function() {
								self.__docClick.call(self, arguments.callee);
							});
							self.__stopPropagation();
						}
					});
				}, 100);
			} else {
				citybox.hide();
			}
		},
		//点击文档其他地方隐藏面板
		__docClick: function(obj) {
			$('.adultNumBox,.childNumBox,.roomNumBox,.flyMoreCity,.defaultCity').hide();
			$(document).unbind('click', obj);
		},
		__stopPropagation: function(e) {
			var e = this.__getEvent();
			if (window.event) {
				//e.returnValue=false;//阻止自身行为
				e.cancelBubble = true; //阻止冒泡
			} else if (e && e.preventDefault) {
				//e.preventDefault();//阻止自身行为
				e.stopPropagation(); //阻止冒泡
			}
		},
		//得到事件
		__getEvent: function() {
			if (window.event) {
				return window.event;
			}
			var func = this.__getEvent.caller;
			while (func != null) {
				var arg0 = func.arguments[0];
				if (arg0) {
					if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
						return arg0;
					}
				}
				func = func.caller;
			}
			return null;
		},
		noticeJsonData: {
			//@出发地热门城市对象 {obj}
			leave: {
				"Data": {
					"国内热门": ["上海", "北京", "香港", "广州", "杭州", "厦门", "南京", "澳门", "成都", "青岛",  "福州", "天津", "深圳", "大连", "无锡", "重庆", "三亚", "西安", "昆明", "武汉", "沈阳"]
				}
			},
			//@抵达地热门城市对象 {obj}
			arrive: {
				"tab": ["国际热门", "欧洲", "美洲", "非洲", "大洋洲", "亚洲"],
				"Data": {
					"国际热门": ["香港", "澳门", "台北", "新加坡", "曼谷", "胡志明市", "马尼拉", "名古屋", "伦敦", "吉隆坡", "悉尼", "法兰克福", "温哥华", "巴黎", "纽约", "洛杉矶(美国)", "东京", "大阪", "雅加达", "巴厘岛", "普吉岛", "河内", "马累"],
					// "国内热门": ["上海", "北京", "香港", "广州", "杭州", "厦门", "南京", "澳门", "成都", "青岛", "台北", "福州", "天津", "深圳", "大连", "无锡", "重庆", "三亚", "西安", "昆明", "武汉", "沈阳"],
					"欧洲": ["伦敦", "法兰克福", "巴黎", "莫斯科", "罗马(意大利)", "阿姆斯特丹", "米兰", "慕尼黑", "斯德哥尔摩", "柏林(德国)", "马德里", "苏黎世", "哥本哈根", "赫尔辛基", "维也纳", "巴塞罗那(西班牙)", "雅典", "爱丁堡", "伯明翰(英国)", "纽卡斯尔(英国)", "日内瓦", "圣彼得堡", "格拉斯哥(英国)", "布达佩斯", "汉堡", "布拉格", "杜塞尔多夫", "曼彻斯特(英国)"],
					"美洲": ["温哥华", "纽约", "洛杉矶(美国)", "巴塞罗那(委内瑞拉)", "伯明翰(美国)", "旧金山", "芝加哥", "多伦多", "西雅图", "华盛顿", "波士顿", "底特律", "亚特兰大", "休斯敦", "夏威夷", "达拉斯", "费城", "圣保罗(巴西)", "渥太华", "墨西哥城", "拉斯维加斯", "卡尔加里", "迈阿密", "丹佛", "奥兰多", "波特兰(美国)", "曼彻斯特(美国)", "埃德蒙顿", "布宜诺斯艾利斯", "墨尔本(美国)", "明尼阿波利斯"],
					"非洲": ["开罗", "约翰内斯堡", "开普敦", "内罗毕", "拉各斯", "罗安达", "毛里求斯", "喀土穆", "阿克拉(加纳)", "阿尔及尔", "德班", "突尼斯", "卢萨卡", "哈拉雷", "雅温得", "哈博罗内", "金沙萨", "马普托", "杜阿拉", "费里敦", "阿比让", "卢克索  ", "达累斯萨拉姆", "卡萨布兰卡", "亚的斯亚贝巴"],
					"大洋洲": ["悉尼", "纽卡斯尔(澳大利亚)", "墨尔本(澳大利亚)", "奥克兰(新西兰)", "布里斯班", "阿德莱德", "珀斯", "惠灵顿", "堪培拉", "凯恩斯", "楠迪", "黄金海岸", "帕皮堤", "霍巴特", "达尔文", "达尼丁"],
					"亚洲": ["香港", "澳门", "台北", "新加坡", "曼谷", "胡志明市", "马尼拉", "名古屋", "吉隆坡", "东京", "大阪", "雅加达", "巴厘岛", "普吉岛", "河内", "马累", "迪拜", "加德满都", "高雄", "福冈", "金边", "札幌", "伊斯坦布尔", "乌兰巴托", "孟买"]
				}
			}
		}
	};
	return Search;
});
