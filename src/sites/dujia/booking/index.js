define("order", [
	"common/0.1.0/index",
	"dialog/0.1.0/index",
	"login/0.1.0/index",
    "sbuPackLink/0.0.1/orderIndex",
	"tmpl/pc/order/preferentialNew",
    "common/0.1.0/storage",
	"tmpl/pc/order/priceNew",
    "tmpl/pc/order/touristInfo",
	"tmpl/pc/order/bystagesSelect", //xjc
	'jCarousel/0.2.0/index',
    'tmpl/pc/order/cjFavorable',
    'tmpl/pc/details2016/sbuWanleDetails'
], function (require, exports, module) {

	var Common = require("common/0.1.0/index");
	var dialog = require("dialog/0.1.0/index");
    var storage = window.storage = require("common/0.1.0/storage");
    // var sbuPackLink = require("sbuPackLink/0.0.1/orderIndex");
	var login = require("login/0.1.0/index");
	var tmplPreferential = require("tmpl/pc/order/preferentialNew");
	var tmplPrice = require("tmpl/pc/order/priceNew");
    var tmplTour = require("tmpl/pc/order/touristInfo");
    var bystagesSelect = require("tmpl/pc/order/bystagesSelect"); //xjc
    var tmplCjFavorable = require('tmpl/pc/order/cjFavorable');
	var Carousel = require('jCarousel/0.2.0/index');
    var wanleDetailTmpl = require('tmpl/pc/details2016/sbuWanleDetails');
    var num = 0,        //总人数
        personType = [],
        tourFlag;
    var infoData = [];
	//自定义alert;
	window.Smodal={
		alert: function(tip,callback){
			var domStr = '<div id="smodal_alert" class="salert">'+
				'<div class="salert_tit">'+
					'<span class="salert_close">&nbsp;</span>'+
				'</div>'+
				'<div class="salert_cont">'+
					'<strong>'+tip+'</strong>'+
					'<a href="javascript:void(0);" class="salert_btn">确定</a>'+
					'</div>'+
				'</div>';
			var modal =  fish.dialog({
				content: domStr,
				show:true,
				fixed:true,
				dragable:false,
				bgClose: false,
				zIndex:[1001,1000]
			});
			fish.one("#smodal_alert .salert_btn").on("click",function(){
				modal.destroy();
				callback&&callback();
			});
			fish.one("#smodal_alert .salert_close").on("click",function(){
				modal.destroy();
			});
		}
	};

	if (!Date.prototype.toISOString) {
	  (function() {

	    function pad(number) {
	      if (number < 10) {
	        return '0' + number;
	      }
	      return number;
	    }

	    Date.prototype.toISOString = function() {
	      return this.getUTCFullYear() +
	        '-' + pad(this.getUTCMonth() + 1) +
	        '-' + pad(this.getUTCDate()) +
	        'T' + pad(this.getUTCHours()) +
	        ':' + pad(this.getUTCMinutes()) +
	        ':' + pad(this.getUTCSeconds()) +
	        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
	        'Z';
	    };

	  }());
	}

	(function(){
	    var D= new Date('2011-06-02T09:34:29+02:00');
	    if(!D || +D!== 1307000069000){
	        Date.fromISO= function(s){
	            var day, tz,
	            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
	            p= rx.exec(s) || [];
	            if(p[1]){
	                day= p[1].split(/\D/);
	                for(var i= 0, L= day.length; i<L; i++){
	                    day[i]= parseInt(day[i], 10) || 0;
	                };
	                day[1]-= 1;
	                day= new Date(Date.UTC.apply(Date, day));
	                if(!day.getDate()) return NaN;
	                if(p[5]){
	                    tz= (parseInt(p[5], 10)*60);
	                    if(p[6]) tz+= parseInt(p[6], 10);
	                    if(p[4]== '+') tz*= -1;
	                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
	                }
	                return day;
	            }
	            return NaN;
	        }
	    }
	    else{
	        Date.fromISO= function(s){
	            return new Date(s);
	        }
	    }
	})();



	var getIconById = function(iconid) {
		iconid = parseInt(iconid);
		if(isNaN(iconid)) {
			return {};
		}

		for(var i=0,len1=window.dataPreferential.length; i<len1; i++) {
			if(window.dataPreferential[i].IconInfo.IconId === iconid) {
				return window.dataPreferential[i].IconInfo;
			}
		}
	};

	var getRuleById = function(ruleid) {
		ruleid = parseInt(ruleid);
		if(isNaN(ruleid)) {
			return {};
		}

		for(var i=0,len1=window.dataPreferential.length; i<len1; i++) {
			for(var j=0,len2=window.dataPreferential[i].PreferentialConfigList.length; j<len2; j++) {
				if(window.dataPreferential[i].PreferentialConfigList[j].RuleId === ruleid) {
					return window.dataPreferential[i].PreferentialConfigList[j];
				}
			}
		}
		return {};
	};

	var _$div = jQuery("<div>").css({ "position": "absolute", "visibility": "hidden", "top:": "-100%" });
	var checkContentLines = function(content, width) {
		_$div.css("width", width).text(content).appendTo('body');
		var testHeight = parseFloat(_$div.css('height'));
		var testLineHeight = parseFloat(_$div.css('line-height'));
		_$div.detach();

		return testHeight/testLineHeight;
	};

	var checkCoupon = function(code, $elem) {
		$elem.attr('data-rule-id', '')
			.parent('.item-code').removeClass('unmatch success fail')
			.closest('.radio-item').addClass('disabled')
			.find('input[type=radio]').prop('checked', false);
		if(!code || code === '') {
			code = ' ';
		}

		jQuery.ajax({
			url: PageReady.host+'/dujia/OrderAjaxCall.aspx?Type=CheckPreferentialCode',
			data: 'promocode='+code,
			dataType: 'jsonp'
		}).done(function(data, textStatus, jqXHR) {
			if(data.RespCode === 0) {
				var rule = getRuleById(data.RuleId);
				var notice = rule ? rule.Notice : '';
				$elem.attr('data-rule-id', data.RuleId)
					.parent('.item-code').find('.J_tipsRule').text(notice);
				checkCouponMatched($elem);
			} else {
				$elem.attr('data-rule-id', '')
					.parent('.item-code').addClass('fail').removeClass('success')
					.find('.J_tipsRule').text('');
			}
		}).fail(function(jqXHR, textStatus) {
			$elem.attr('data-rule-id', '')
				.parent('.item-code').addClass('fail').removeClass('success')
				.find('.J_tipsRule').text('');
		}).always(function() { });
	};

	var checkCouponMatched = function($elem) {
		var matched = false;
		var $item = $elem.closest('.radio-item');
		var ruleid = $item.attr('data-rule-id');
		var codeRuleId = $elem.attr('data-rule-id');
		if(codeRuleId && codeRuleId !== '') {
			matched = ruleid.split(',').indexOf(codeRuleId)>-1;
		} else {
			matched = false;
		}

		if(matched) {
			$elem.parent('.item-code').addClass('success');
			checkCouponAvailable($elem);
		} else {
			$elem.parent('.item-code').addClass('unmatch');
		}

		return matched;
	};

	var checkCouponAvailable = function($elem) {
		var $item = $elem.closest('.radio-item');
		var $radio = $item.find('input:radio');
		var ruleid = $elem.attr('data-rule-id');
		var arrAvaiableRules = $item.attr('data-avaiable-rules').split(',');
		if(arrAvaiableRules.indexOf(ruleid)>-1) {
			$item.removeClass('disabled');
			$radio.prop('disabled', false);
			return true;
		} else {
			$item.addClass('disabled');
			$radio.prop('disabled', true);
			$radio.prop('checked', false);
			return false;
		}
	};

    //格式化日期
    function simpleFormatDate(date) {
        var y = date.getFullYear() + "",
            m = (date.getMonth() + 1) + "",
            d = date.getDate() + "";
        m.length <= 1 && (m = "0" + m);
        d.length <= 1 && (d = "0" + d);
        return y + "-" + m + "-" + d;
    }

	var Order = function(){};
	Order.prototype = {
		$container: null,
		statusContentItem: {},
		/*
		* @desc 初始化优惠信息进行排序
		*/
		checkDataPreferentials: function() {
            var dataPrefer = [];
            var _fPrice = parseInt($('.R_Bottom').attr('attr-primitive'));
            do {
                if (window.dataPreferential.length>0) {
                    var tmpItem = window.dataPreferential.shift();
                    if (tmpItem.PreferentialConfigList.length) {
                        dataPrefer.push(tmpItem);
                    }
                }
            } while (window.dataPreferential.length>0);
            window.dataPreferential = dataPrefer;
	        //  优惠信息排序(依据优惠价格或者优惠百分比)
	        for(var i=0,len3=dataPrefer.length; i<len3; i++) {
	        	var item1 = dataPrefer[i].PreferentialConfigList;
                if (item1.length) {
                    item1.sort(function (a, b) {
                        if(a.PreferentialType === b.PreferentialType){
                            if (a.PreferentialPrice < b.PreferentialPrice) {
                                return 1;
                            }
                            if (a.PreferentialPrice > b.PreferentialPrice) {
                                return -1;
                            }
                        }else{
                            if(a.PreferentialType === 1 && b.PreferentialType === 0){
                                if ((_fPrice*(a.PreferentialPrice/100)) < b.PreferentialPrice) {
                                    return 1;
                                }
                                if ((_fPrice*(a.PreferentialPrice/100)) > b.PreferentialPrice) {
                                    return -1;
                                }
                            }

                            if(a.PreferentialType === 0 && b.PreferentialType === 1){
                                if (a.PreferentialPrice < (_fPrice*(b.PreferentialPrice/100))) {
                                    return 1;
                                }
                                if (a.PreferentialPrice > (_fPrice*(b.PreferentialPrice/100))) {
                                    return -1;
                                }
                            }
                        }

                        return 0;
                    });
                    //TODO 红包确认
                    //for(var j=0,len2=item1.length; j<len2; j++) {
                    //    var item2 = item1[j].HongBaoBatchList;
                    //    item2.sort(function(a, b) {
                    //        if(a.ParValue<b.ParValue) { return 1; }
                    //        if(a.ParValue>b.ParValue) { return -1; }
                    //        return 0;
                    //    });
                    //}
                }
	        }
		},

        /**
         * @desc 初始化登录组件
         * @param callback
         */
        initLogin: function(callback){
            var self = this,
                Login = require("login/0.1.0/index");
            var login = new Login({
                loginSuccess: function(){
                    callback.call(self);
                },
                unReload: true
            });
        },
        /**
         * @desc 检查是否登录,并执行登录后回调
         * @param callback 登录后的操作逻辑
         */
        checkLogin: function(callback){
            var cnUser = jQuery.cookie("us");
            if(!(/userid=\d+/.exec(cnUser))){
                this.initLogin(callback);
                return;
            }
            callback && callback.call(this,true);
            return true;
        },

    	getStatusFromPage: function() {
			var self = this;
			self.statusContentItem = {};
            self.isStatusContentItem = false;
			var status = self.statusContentItem;
			self.$container.find('.J_preferentialContent').each(function() {
				var iconid = jQuery(this).attr('data-icon-id');
                if(!iconid) return;
				var iconClassname = jQuery(this).attr('class');
				status[iconid] = {};
				status[iconid].classname = iconClassname;
				jQuery(this).find('.radio-item').each(function() {
					var ruleid = jQuery(this).attr('data-rule-id');
					var ruleClassname = jQuery(this).attr('class');
					var $radio = jQuery(this).find('input[type=radio]');
					var $code = jQuery(this).find('.item-code');
					var $text = jQuery(this).find('input[type=text]');
					var radiostatus = [];
					if($radio.prop('checked')) {
                        radiostatus.push('checked');
                        self.isStatusContentItem = true;
                    }
					if($radio.prop('disabled')) { radiostatus.push('disabled'); }

					status[iconid][ruleid] = {};
					status[iconid][ruleid].classname = ruleClassname;
					status[iconid][ruleid].radiostatus = radiostatus;

					if(ruleid.indexOf(',')>=0 && $code.hasClass('success')) {
						// 优惠码
						status[iconid][ruleid].codetext = $text.val();
						status[iconid][ruleid].ruleid = $text.attr('data-rule-id');
						status[iconid][ruleid].notice = $code.find('.J_tipsRule').text();
						status[iconid][ruleid].codeclass = $code.attr('class');
					}
				});
			});
		},
		setStatusToPage: function(ruleId) {
			var self = this;
			var status = self.statusContentItem;
            var isCanRuleId = !(self.isStatusContentItem);
			self.$container.find('.J_preferentialContent').each(function() {
				var iconid = jQuery(this).attr('data-icon-id');
				if(status[iconid]) {
					jQuery(this).addClass(status[iconid].classname);
					jQuery(this).find('.radio-item').each(function() {
						var ruleid = jQuery(this).attr('data-rule-id');
						var rulestatus = status[iconid][ruleid],
                            $radio;
						if(rulestatus) {
							$radio = jQuery(this).find('input[type=radio]');
							var isChecked = rulestatus.radiostatus.indexOf('checked')>=0;
							var isSuccess = false;
							if(rulestatus.codeclass && rulestatus.codeclass.indexOf('success')>=0) {
								isSuccess = true;
							}
							jQuery(this).addClass(rulestatus.classname.replace('disabled', ''));
                            //默认不勾选优惠
							//if(isChecked && !$radio.prop('disabled')) {
							//	$radio.prop('checked', true);
							//}
							if(isSuccess && ruleid.indexOf(',')>=0) {
								// 优惠码
								var $text = jQuery(this).find('input[type=text]');
								$text.val(rulestatus.codetext)
									.attr('data-rule-id', rulestatus.ruleid);
								jQuery(this).find('.J_tipsRule').text(rulestatus.notice);
								jQuery(this).find('.item-code').addClass(rulestatus.codeclass);
								if(checkCouponAvailable($text)) {
									jQuery(this).removeClass('disabled');
									$radio.prop('disabled', false);
									$radio.prop('checked', isChecked);
								}
							}
						}

                        if(isCanRuleId && ruleId && ruleid === ruleId.toString()) {
                            $radio = jQuery(this).find('input[type=radio]');
                            if(!$radio.prop('disabled')) {
                                $radio.click().trigger('change');
                            }
                        }
					});
				}
			});
			self.checkActiveItem();
		},

		refreshPreferentials: function() {
			// TODO refresh preferential content async.
			var self = this;
			var arrData = [];

			jQuery.ajax({
				url: '/dujia/AjaxHelper/ToursHandler.ashx?action=GETLINEPREFERENTIA',
				data: 'bookdate=',
				dataType: 'jsonp'
			}).done(function(data, textStatus, jqXHR) {
				if(data.PreferentialList) {
                    window.dataPreferential = data.PreferentialList;
					self.checkDataPreferentials();
				}
			}).fail(function(jqXHR, textStatus) {

			}).always(function() {
	        	self.refreshUi();
			});
		},

		sortBatchCoupon: function() {
			jQuery('.J_preferentialContent.hasredpack').each(function() {
				var $container = jQuery(this).find('.line-wrap').eq(1);
				$container.find('.J_batchCoupon').sort(function(a, b) {
					var priceA = parseFloat(jQuery(a).attr('data-price'));
					var priceB = parseFloat(jQuery(b).attr('data-price'));
				    if(priceA < priceB) {
				        return 1;
				    }
				    if(priceA > priceB) {
				        return -1;
				    }
				    return 0;
				}).detach().appendTo($container);
				$container.find('.J_code').appendTo($container);
				if($container.find('.active').length === 0) {
					$container.find('.radio-item').eq(0).addClass('active');
				}
			});
		},

		checkActiveItem: function() {
			jQuery('.J_preferentialContent').each(function() {
				var $container = jQuery(this).find('.line-wrap').eq(1);
				var $first = $container.find('.radio-item:first');
				var $notdisabled = $container.find('.radio-item:not(.disabled)').eq(0);
				var $active = $container.find('.active');
				var $activeAndEnabled = $active.not('.disabled');
				var $activeAndDisabled = $active.filter('.disabled');
				var $activeAndChecked = $active.filter(function() {
					return $(this).find('input[type=radio]').prop('checked')
				});

				if($active.length === 0) {
					if($notdisabled.length === 0) {
						$first.addClass('active');
					} else {
						$notdisabled.addClass('active');
					}
				} else if($active.length === 1) {
					if($active.hasClass('disabled') && $notdisabled.length > 0) {
						$active.removeClass('active');
						$notdisabled.addClass('active');
					}
				} else {
					if($activeAndChecked.length > 0) {
						$active.not($activeAndChecked).removeClass('active');
					} else if($activeAndEnabled.length > 0) {
						$activeAndDisabled.removeClass('active');
						$activeAndEnabled.not(':first').removeClass('active');
					} else {
						$activeAndDisabled.not(':first').removeClass('active');
					}
				}
			});
		},

		setDefaultRule: function() {
            var maxVal = 0,maxId = 0;
            jQuery('.radio-item.active:not(.disabled)').each(function () {
                if($(this).attr('data-iseffect') && $(this).attr('data-iseffect') !== 0){
                    if(parseInt($(this).attr('data-single-price')) > maxVal){
                        if($(this).attr('data-rule-id')){
                            maxId = $(this).attr('data-rule-id');
                        }
                    }
                }
            });
            jQuery('.radio-item.active:not(.disabled)').each(function () {
               if(parseInt($(this).attr('data-rule-id')) === parseInt(maxId)){
                   if($(this).find('input')){
                       $(this).find('input').prop('checked',true).trigger("change");

                   }
               }
            });

            this._renderPrice();
        },

        _renderPrice: function() {
			var dataPrice = [],
				self = this;
            var prePrice=1;
            var inputDom='';
			jQuery('.J_preferentialContainer .J_preferentialContent.selected').each(function() {
				var $item = $(this).find('.radio-item.active');
				var $radio = $item.find('input[type=radio]');
				var iconid = $(this).attr('data-icon-id');
				var item = {
					"IconId": iconid,
					"IconInfo": getIconById(iconid)
				};

				if($radio.prop('checked')) {
					item.RuleId = $item.attr('data-rule-id');
					if($item.hasClass('J_batchCoupon')) {
						item.CouponNo = $item.attr('data-coupon-no');
					}
					if(item.RuleId.indexOf(',')>=0) {
						item.RuleId = $item.find('input[type=text]').attr('data-rule-id');
					}
                    //银行优惠份数
                    if ($item.find('.J_fen').length>0) {
                        item.Num=$item.find('.J_fen').val();
                        inputDom=$item.find('.J_fen');
                        prePrice=parseFloat($item.find('.preferPrice').text().match(/\d+/g));
                    }
					item.PreferentialConfig = getRuleById(item.RuleId);
					dataPrice.push(item);
				}
			});
			var $R_top = jQuery('.R_top');
			$R_top.find('.ReductionDL-box').remove().end().append(tmplPrice(dataPrice)).find('.R_Bottom').attr('attr-primitive', '').find('.f_price').text('');

			var $R_Bottom = jQuery('.R_Bottom');
			var totalPrice = 0;
            var insurancePrice=0;
			var discount = 0;
			$R_top
				.find('.fee-info dl[class^=calculPri]:not(.none)').each(function() {
					totalPrice += parseFloat($(this).find('.orderPrice').text());
				}).end()
				.find('.InsuranceDL:not(.none)').each(function() {
					insurancePrice += parseFloat($(this).find('.orderPrice').text());
				}).end()
				.find('.ReductionDL-new').each(function() {
					discount += parseFloat($(this).find('.orderPrice').text());
				});

            var $R_Center = jQuery('.R_Center');
            var exPrice = 0;
            if($R_Center){
                $R_Center.find('.choseFee-info dl[class^=calcle]:not(.none)').find('.extraPrice').each(function () {
                    exPrice += parseFloat($(this).text());
                }).end();
            }

            totalPrice+=exPrice;
            var price=(totalPrice + discount)>0?(totalPrice+discount):1;
			var strTotalPrice = '' + (price+insurancePrice);

			$R_Bottom.attr('attr-primitive', strTotalPrice)
				.find('.f_price').text(strTotalPrice);

            //处理右侧点评返现
            //TODO 添加区分非凡
            if(parseInt($("#hidIsExtraordinary").val()) === 0){
                if(parseInt(strTotalPrice)<10000){
                    $R_Bottom.find(".f_dpPrice").html("回团点评后返现25元");
                }else if(10000<=parseInt(strTotalPrice) && parseInt(strTotalPrice)<20000){
                    $R_Bottom.find(".f_dpPrice").html("回团点评后返现30元");
                }else if(20000<=parseInt(strTotalPrice) && parseInt(strTotalPrice)<30000){
                    $R_Bottom.find(".f_dpPrice").html("回团点评后返现40元");
                }else if(parseInt(strTotalPrice)>30000){
                    $R_Bottom.find(".f_dpPrice").html("回团点评后返现50元");
                }
            }else {
                $R_Bottom.find(".f_dpPrice").html("回团点评后返现100元/人");
            }




            if (totalPrice+discount<0) {
                window.preferentialNum=parseInt(totalPrice/prePrice);
                inputDom.attr('data-err-fn',inputDom.attr('data-err-fn').replace(/\d+/g,window.preferentialNum));
            }else {
                window.preferentialNum=99;
            }
		},
		renderPrice: function() {
			var self = this;
			setTimeout(function() {
				self._renderPrice();
			}, 0);
		},
	    renderPreferentials: function() {
            var self=this;
	        jQuery('.J_preferentialContainer')
	            .html(tmplPreferential(window.dataPreferential));

            //银行优惠份数处理事件
            jQuery('.J_preferentialContainer').on('change','.J_fen',function(e){
                if (jQuery(this).val()!='') {
                    jQuery(this).val(jQuery(this).val().match(/[1-9]\d{0,1}/g)[0]||0);
                }
                self._renderPrice();
            });
            jQuery('.J_preferentialContainer').on('keyup','.J_fen',function(e){
                if (jQuery(this).val()!='') {
                    jQuery(this).val(jQuery(this).val().match(/[1-9]\d{0,1}/g)[0]||0);
                }

                self._renderPrice();
            });
            jQuery('.J_preferentialContainer').on('blur','.J_fen',function(e){
                if (jQuery(this).val()=='') {
                    jQuery(this).val(0);
                }
                var $radio=jQuery(this).parents('.radio-item').find('input[type=radio]');
                if (jQuery(this).val()>window.preferentialNum&&$radio.is(':checked')) {
                    jQuery(this).parents('.bankNum-label').find('em').hide();
                }

                self._renderPrice();

            });
            jQuery('.J_preferentialContainer').on('focus','.J_fen',function(e){
                jQuery(this).parents('.bankNum-label').find('em').show();
            });
            jQuery('.J_preferentialContainer').on('mouseout','.invalid_message_right',function(e){
                e.stopPropagation();
                e.preventDefault();
                jQuery(this).parents('.radio-item').find('.J_fen').blur();

            });

	    },

		refreshUi: function(ruleId) {
			var self = this;
        	self.getStatusFromPage();
        	setTimeout(function() {
        		self.initUi();
                HolidayBook.initValidFun();
        		self.setStatusToPage(ruleId);
	        	self.renderPrice();
                self.sendAjax(function() {
                    self.helper();
                    self.reRenderTours();
                });
        	}, 0);
	   	},
        reRenderTours: function() {
            var self = this;
            var infoLen = infoData.length;
            for (var i = 0; i < infoLen; i++) {
                var passInfo = $(".passenger-info")[i],
                    dataIndex = infoData[i].DataIndex;
                $("input, .ui-select", passInfo).each(function () {
                    var className = this.className,
                        $ipt = $(this);
                    if (/(ui-input-nameZh)/.test(className)) {
                        $ipt.val(decodeURIComponent(infoData[i].CustomerName));
                    }
                    if (/(ui-input-first-name)/.test(className)) {
                        $ipt.val(infoData[i].FirstName);
                    }
                    if (/(ui-input-last-name)/.test(className)) {
                        $ipt.val(infoData[i].LastName);
                    }
                    if (/(ui-input-birthday)/.test(className)) {
                        $ipt.val(infoData[i].Birthdate);
                    }
                    if (/(ui-select-certificate)/.test(className)) {
                        var val = self.cardTypeToNo(infoData[i].CustomerCertType,10);
                        $ipt.find("dt").html(infoData[i].CustomerCertType).attr("data-value", val);
                    }
                    if (/(ui-select-certificate-id)/.test(className)) {
                        if (infoData[i].CustomerCertType !== "稍后提供") {
                            $ipt.css("display", "inline").attr("vtype", "rq");
                            $ipt.val(infoData[i].CustomerCertNo);
                            if (infoData[i].CustomerCertType === "台湾通行证") {
                                $ipt.attr('placeholder', "格式：T12345678");
                            } else {
                                $ipt.attr('placeholder', "证件号码");
                            }
                        } else {
                            $ipt.css("display", "none").attr("vtype","");
                            $ipt.val("");
                        }
                    }
                    if (/ui-input-mobile/.test(className)) {
                        $ipt.val(infoData[i].CustomerMobile);
                    }
                });
                $(passInfo).find(".passenger-info-table").attr("data-type", infoData[i].CustomerType);
                $(passInfo).attr("data-linkerId", infoData[i].linkerId);
                if (!infoData[i].IsFrequentPassenger) {
                    $(passInfo).find(".save input")[0].checked = false;
                }
                $(passInfo).find(".ui-radio-sex").each(function () {
                    if ($(this).attr("data-value") !== infoData[i].CustomerSex) {
                        this.checked = false;
                    } else {
                        this.checked = true;
                    }
                });
                $(passInfo).attr("data-index",dataIndex);
                $(passInfo).attr("data-isinsert",infoData[i].DataInsert);
                if (parseInt(infoData[i].DataInsert,10)) {
                    var favorInput = $(".favorite-contacts input")[dataIndex];
                    favorInput.checked = true;
                    $(favorInput).attr("map", passInfo.id);
                }
            }
        },
        //将证件类型转换为证件类型号
        cardTypeToNo: function (cardType) {
            var val = 2;
            if (cardType === "护照") {
                val = 2;
            }
            if (cardType === "港澳通行证") {
                val = 7;
            }
            if (cardType === "台湾通行证") {
                val = 5;
            }
            if (cardType === "稍后提供") {
                val = 6;
            }
            return val;
        },
	    delegateEvents: function() {
	    	var self = this;
            var visitorType = window.passenger;
            var visitorLen = visitorType.length;
            for (var v = 0;v<visitorLen;v++) {
                var priType = visitorType[v].priceType,
                    visitorNum = visitorType[v].num;
                if(priType === 1 || priType === 2 || priType === 8 || priType === 3 || priType === 4) {
                    num += visitorNum;
                    for (var i = 0; i < visitorNum; i++) {
                        personType.push(priType);
                    }
                }
            }
	    	fish.one('.J_preferentialContainer')
	            .delegate('a.J_login', 'click', function() {
	            	self.checkLogin(function() {
	            		location.reload();
	            	});
	            })
	            .delegate('a.J_bonus', 'click', function() {
	            	window.Bonus.init({
		                mode : 2,
		                // maskclose : false,
		                pageInfo : {
		                    pageId : "102",//页面id PC填写订单页
		                    pagemark : "",//页面id对应的按钮去重标记
		                    BatchNo : ""//页面id对应批次号,
		                },
		                succurl: location.href	// 成功后跳转
		            });
	            })
	            .delegate('.J_btnToggleExpand', 'click', function(e) {
	                var fContent = fish.one(e.delegateTarget).parent('.J_preferentialContent');
	                fContent.toggleClass("expand");
	            });


	        self.$container
	            .delegate('input[type=radio]', 'change', function(e) {
	                var _self = e.currentTarget;
	                var fSelf = fish.one(_self);
	                var fRadioItem = fSelf.parent('.radio-item');
	                var fContent = fSelf.parent('.J_preferentialContent');
	                var fOtherContents = fContent.sibling(true);
	                var arrUnionIconIds = fContent.attr('data-union-icon-ids').split(',');
	                var resetSelectable = false;

	                if(_self.checked) {
	                    fish.all('.radio-item', fContent).removeClass('active');
	                    fRadioItem.addClass('active');
	                    fContent.addClass('selected');
	                } else {
	                    fRadioItem.removeClass('active');
	                }

	                if(!fContent.hasClass('selectable')) {
	                    resetSelectable = true;
	                    fContent.addClass('selectable');
	                }


	                fOtherContents.each(function(elem) {
	                    var fSelf = fish.one(elem);
	                    var iconId = fSelf.attr('data-icon-id');
	                    if(resetSelectable) {
                            fSelf.removeClass('selectable selected');
                            fish.all('.radio-item', fSelf).each(function(elem, i) {
                            	var domRadio = fish.dom('input[type=radio]', elem);
                                domRadio.checked = false;
                                fish.one(elem).removeClass('active');
                            });
	                        if(arrUnionIconIds.indexOf(iconId)>=0) {
	                            fSelf.addClass('selectable');
	                        }
	                    } else {
	                        if(fSelf.hasClass('selectable')) {
	                            if(arrUnionIconIds.indexOf(iconId)<0) {
	                                fSelf.removeClass('selectable');
	                                fish.all('.radio-item', fSelf).each(function(elem, i) {
	                                    fish.dom('input[type=radio]', elem).checked = false;
	                                });
	                            }
	                        }
	                    }
	                });

					self.checkActiveItem();
					self.renderPrice();
	            })
	            .delegate('.item-code input[type=text]', 'blur', function(e) {
	            	var _self = jQuery(e.currentTarget);
	                var coupon = _self.val();
	                var lastvalue = _self.data('lastvalue');
	                var valuechanged = false;
	                if(lastvalue !== coupon) {
	                	valuechanged = true;
		                _self.data('lastvalue', coupon);
	                }

	                if((coupon !== '') && valuechanged) {
		               	checkCoupon(coupon, _self);
		            }
	            });
	    },
	    initUi: function() {
	    	var self = this;

	    	self.$container = self.$container ? self.$container : jQuery('.J_preferentialContainer');
	    	self.renderPreferentials();

	        self.$container
	        	.find('.J_preferentialContent').each(function() {
	        		var rulesnum = jQuery(this).find('.radio-item').length;
	        		if(rulesnum<=1) { jQuery(this).addClass('noexpand'); }
	        	}).end()
            	.find('.J_Tips').each(function(i,n){
	                var content = n.getAttribute("data-content");
	                var showTooltip = checkContentLines(content, jQuery(n).css('width'));

	                if(showTooltip>1){
	                    var d = dialog({
	                        content: content,
	                        tip: true,
	                        trigger: n,
	                        triggerType: "hover",
	                        align: "bottom left",
	                        width: 400
	                    });
	                }
	            }).end()
	            .find('.item-code input[type=text]').each(function() {
	            	jQuery(this).data('lastvalue', jQuery(this).val());
	            }).end();
	        // 初始化提示
	        jQuery('.contactperson_info').find('.J_Tips').each(function(i,n){
                var content = n.getAttribute("data-content");
                var showTooltip = checkContentLines(content, jQuery(n).css('width'));

                if(showTooltip>1){
                    var d = dialog({
                        content: content,
                        tip: true,
                        trigger: n,
                        triggerType: "hover",
                        align: "bottom left",
                        width: 380
                    });
                }
            })
	        self.sortBatchCoupon();

	        $('.pay-way').find(".J_Tips").each(function(i,n){
                var content = n.getAttribute("data-content"),
                    isLoad = n.getAttribute("data-loaded");
                if(content && (!isLoad)){
                    n.setAttribute("data-loaded","true");
                    var d = dialog({
                        content: content,
                        tip: true,
                        trigger: n,
                        triggerType: "hover",
                        align: "bottom left",
                        width: 270
                    });
                }
            });


	    },

        init: function() {
	        var self = this;
            if (!window.isLogin) {
                self.checkLogin(function (isLogin) {
                    if(!isLogin) {
                        location.reload();
                    }
                });
                window.isLogin = true;
            }
            window.preferentialsCallback = function(){
                    window.dataPreferential = window.page_cf ? window.page_cf.PreferentialList : [];
                    self.checkDataPreferentials();
                    //get decoded price from old HolidayBook.
                    HolidayBook.initDecPrice();

                    self.initUi();
                    self.delegateEvents();
                    self.checkActiveItem();

                    self.setDefaultRule();
                    self.renderPrice();
            }
            //
            PageReady.run(parseInt(jQuery("#fangzhua").val()));

			jQuery(function() {
		        // expose refresh function to old HolidayBook.
		        window.HolidayBook.refreshPreferentials = function(ruleId) {
		        	self.refreshUi(ruleId);
		        };
		        // expose render price function to old Holidaybook.
		        window.HolidayBook.renderPrice = function() {
		        	self.renderPrice();
		        };
			});
            //旅顾id放到cookies
            self.setJobNumber();
            //新增旅游顾问ID
            self.checkJobNumber();
            self.tourCalendar();
            self.initCjFavorable();
			self.showModal();
            self.tourEve();
            self.sbuInfoEvent();
	        //获取费用明细高度，是否添加滚动条
            var rBoxH = $(".R_box").height();
            if(rBoxH >= 770){
                $(".R_box").css('overflow-y','scroll');
            }else{
                $(".R_box").css('overflow-y','auto');
            }
		},

        /**
         * @desc 出游人
         * @func sendAjax
         */
        sendAjax: function (callback) {
            callback && callback(this);
        },
        tourEve: function () {
            var otherPassenger = $(".other-passenger"),
                showBox = $(".tour_favorable .visitor-info");
            if (showBox.length > 5) {
                $(".tour_tit_load").html("<a class='no-write'>稍后填写</a>");
                otherPassenger.removeClass("none");
            } else {
                $(".tour_tit_load").html("");
                $(".tour_favorable .listbox").removeClass("no-info none");
                otherPassenger.addClass("none");
            }
            var $drop = $(".expand-down"),
                t = ["展开其他出游人", "收起"],
                c = 0;
            $drop.on("click", function () {
                c = otherPassenger.hasClass("active") ? 1 : 0;
                otherPassenger.toggleClass("active");
                otherPassenger.parents(".add-passenger").toggleClass("active");
                $drop.html($drop.html().replace(t[c], t[(c + 1) % 2]));
            });
            var visitInput = $(".favorite-contacts input"),
                visitLen = visitInput.length;
            for (var i = 0; i < visitLen; i++) {
                visitInput[i].checked = false;
                visitInput[i].removeAttribute("map");
            }
            $(".ui-select").each(function () {
                var certHtml = $("dt", $(this)).text(),
                    defaultVal = $(this).siblings(".ui-input");
                if (certHtml === "台湾通行证") {
                    defaultVal.css("display","inline").attr('placeholder', "格式：T12345678").attr("vtype", "rq");
                } else if (certHtml === "稍后提供") {
                    defaultVal.css("display","none").attr('placeholder', "证件号码").attr("vtype", "");
                } else {
                    defaultVal.css("display","inline").attr('placeholder', "证件号码").attr("vtype", "rq");
                }
            });
            $(".ui-input-nameZh").blur(function () {
                var el = $(this),
                    tourName = el.val(),
                    passengerTable = el.parents(".passenger-info-table");
                $.ajax({
                    url: "/intervacation/api/OrderHandler/GetPinYin?name=" + tourName,
                    dataType: "jsonp",
                    success: function (data) {
                        if(data.Data) {
                            passengerTable.find(".ui-input-first-name").val(data.Data.LastName);
                            passengerTable.find(".ui-input-last-name").val(data.Data.FirstName);
                        }
                    }
                });
            });
            $(".ui-input-mobile").blur(function () {
                var phoneCount = 0;
                $(".ui-input-mobile").each(function () {
                    var phoneVal = $(this).val();
                    if (phoneVal) {
                        phoneCount++;
                    }
                });
                if (phoneCount) {
                    $(".prompt_message").css("display","none");
                }
            });
        },
        tourCalendar:function(){
            fish.require("Calendar",function(){
            var cal = new fish.Calendar({
                skin: "green birth-date",
                monthNum: 1,
                zIndex: 22,
                isBigRange: true
            });

            var newDate = new Date(),
                birthStartDate = "1985-01-01",
                cardStartDate = simpleFormatDate(newDate),
                birthEndDate = newDate,
                cardEndDate = new Date();
            cardEndDate.setFullYear(cardEndDate.getFullYear() + 40);
            fish.all(".ui-input-date").each(function () {
                var startDate, endDate, $self = fish.one(this);
                if (fish.one(this).hasClass("ui-input-birthday")) {
                    //startDate =birthStartDate;
                    endDate = birthEndDate;
                    fish.one(this).val(birthStartDate);
                }
                if (fish.one(this).hasClass("ui-input-certificate-date")) {
                    startDate = cardStartDate;
                    endDate = cardEndDate;
                }
                (function (startDate, endDate) {
                    $self.val(startDate);
                    $self.on("focus", function () {
                        cal.pick({
                            startDate: startDate,
                            endDate: endDate,
                            elem: this,
                            mode: "rangeFrom",
                            showOtherMonth: false,
                            zIndex: 22,
                            fn: function () {
                                fish.one(this).focus();
                            }
                        });
                    });
                })(startDate, endDate);
            });
            })
        },
        //帮助提示
        helper: function () {
            var $tipForZhName = $("#tipForZhName"),
                $tipForEnName = $("#tipForEnName"),
                $tipForNum = $("#tipForNum"),
                target;
            $(".passenger-info-table .help").on("mouseover", function () {
                var $this = $(this),
                    dataType = $this.attr("data-type");
                if (dataType === "zh") {
                    target = $tipForZhName;
                } else if (dataType === "en") {
                    target = $tipForEnName;
                } else {
                    target = $tipForNum;
                }
                var targetTop = $this.offset().top + 20,
                    targetLeft = $this.offset().left - 25;
                target.css({
                    "top": targetTop + "px",
                    "left": targetLeft + "px",
                    "display": "block"
                });
            }).on("mouseout", function () {
                target.css("display", "none");
            });
        },
        /**
         * @func setJobNumber
         * @desc 将url上的jobNumber存到cookie里
         * @example
         */
        setJobNumber:function(){
            var url = location.href,
                hasRefId = /[#\?&]jobnumber=(\d+)/.exec(url);
            if(hasRefId&&hasRefId[1]){
                $.cookie && $.cookie("jobnumber",hasRefId[1]);
            }
        },
        /**
         * @private
         * @func checkJobNumber
         * @desc 新增旅游顾问ID
         */
        checkJobNumber:function() {
            function getCookie(name)
            {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            function getQueryString(name) {
                name = name.toLowerCase().replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var url = window.location.href.toLowerCase();
                var results = regex.exec(url);
                if (results == null) {
                    return null;
                }
                else {
                    return results[1];
                }
            }
            function getMemberId() {
                function getCookie(name) {
                    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

                    if (arr = document.cookie.match(reg))

                        return unescape(arr[2]);
                    else
                        return null;
                }
                var cookie = getCookie("us") || "",
                    matchtouch = /userid=([^&]+)/i.exec(cookie);
                if (matchtouch) {
                    return matchtouch[1];
                } else {
                    return null;
                }
            }
            var jobnumber = getCookie("jobnumber"),
                urlNum = getQueryString("jobnumber")||"",
                bindId = $("#hidJobNumber").val(),
                memberid = getMemberId(),
                el = $(".J_lvgu"),
                chld = $("#lvguID").get(0),
                isSelect = parseInt($("#hidIsSelect").val(),10);
            if(!urlNum){
                urlNum = jobnumber;
            }
            if(urlNum){
                if(memberid){
                    if(bindId){
                        el.removeClass("none");
                        if(bindId==urlNum && isSelect){
                            chld.checked=true;
                            $("#hidJobNumber").val(urlNum);
                        }else{
                            chld.checked=false;
                            $("#hidJobNumber").val('');
                            urlNum = bindId;
                        }
                    }
                }
            }

        $(document).on("click","#lvguID",function(){
            var self = $(this);
            if(!self.get(0).checked){
                $("#hidJobNumber").val("");
            }else{
                $("#hidJobNumber").val(urlNum);
            }
        })
    },
        //初始化出境宝
        initCjFavorable:function(){
            $.ajax({
                url:'/intervacation/api/Chujingbao/GetChuJingBaoInfo',
                dataType:'jsonp',
                success:function(data){
                    if(data && data.Status == "Success"){
                        if(data.Data.ChujingbaoData){
                            var chujingbao = data.Data.ChujingbaoData;
                            var renderData = chujingbao.ChujingbaoData;
                            $('.Cjbox').html(tmplCjFavorable(renderData));
                        }
                    }
                }
            })

        },
        //模板弹框
        showModal: function () {
            var _dialog, _self = $('#show_photo');

            $('.onjob-sample').on('click', function() {
                var urlstr = '',
                    txt = '',
                    msg = '';
                var url = $(this).attr('data-url');
                if (!url) {
                    return;
                };
                var urllist = url.split(',');
                var txtlist = $(this).attr('data-title').split('&');
                var msglist = $(this).attr('data-content').split('&');
                $.each(urllist, function(i) {
                    urlstr = urlstr + '<li><a href="javascript:void(0);"><img src=' + urllist[i] + '></a></li>';
                });

                $.each(txtlist, function(i) {
                    if (i === 0) {
                        txt = txt + '<span>' + txtlist[i] + '</span>';
                    } else {
                        txt = txt + '<span class="none">' + txtlist[i] + '</span>';
                    }
                });

                $.each(msglist, function(i) {
                    if (i === 0) {
                        msg = msg + '<p>' + msglist[i] + '</p>';
                    } else {
                        msg = msg + '<p class="none">' + msglist[i] + '</p>';
                    }
                });

                _self.find('.photo').append('<a style="float:none" target="_blank" href=' + urllist[0].replace('http:','') + '><img id="focusPic" src=' + urllist[0].replace('http:','') + '></a>');
                _self.find('.mslide-panel h3').append(txt);
                _self.find('.mslide-panel .detail').append(msg);
                _self.find('.list ul').html(urlstr);

                var content = _self.find('.mslide-panel').clone(true);
                if (content.length) {
                    _dialog = dialog({
                        content: content,
                        tip: true,
                        width: 980,
                        height: 660,
                        padding: 0,
                        className: "comment",
                        zIndex: 10000,
                        onshow: function() {
                            var mslide = content.find(".photo-mslide");
                            var pic = content.find(".photo img");
                            var bigpic = content.find(".photo a[target='_blank']");
                            //seajs.use("jCarousel/0.1.1/index", function (Carousel) {
                            var car = new Carousel(mslide, {
                                canvas: ".list ul",
                                item: "li",
                                circular: false,
                                visible: 6,
                                preload: 0,
                                btnNav: false,
                                btnPrev: ".prev",
                                btnNext: ".next"
                            });
                            var carIndex = 0,
                                calLiLen = car.itemLength;
                            car.on("prevClick", function() {
                                carIndex--;
                                carIndex < 0 && (carIndex = 0);
                                car.li.eq(carIndex).click();
                            });
                            car.on("nextClick", function() {
                                carIndex++;
                                carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                                car.li.eq(carIndex).click();
                            });
                            car.on("itemClick", function(index, node, all) {
                                var self = $(this),
                                    title = $(node).parents(".mslide-panel").find("h3"),
                                    msg = $(node).parents(".mslide-panel").find(".detail");
                                $(all).removeClass("active");
                                $(node).addClass("active");
                                carIndex = index;
                                $(title).children("span").addClass("none");
                                $($(title).children("span")[carIndex]).removeClass("none");

                                $(msg).children("p").addClass("none");
                                $($(msg).children("p")[carIndex]).removeClass("none");
                                var src = $(node).find("img").attr("src");
                                pic.attr("src", src);
                                bigpic.attr("href", src);
                                content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                            });
                            content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                        },
                        onclose: function() {}
                    });
                }
                _dialog.showModal();
            });

            $(document).on("click", ".JJ_close", function() {
                _self.find('.photo img').remove();
                $(_self.find('.mslide-panel h3')).children('span').remove();
                $(_self.find('.mslide-panel .detail')).children('p').remove();
                $(_self.find('.list ul')).children('li').remove();
                _dialog.remove().close();
            });

        },
        /*
         * @desc 头部资源信息处理
         */
        sbuInfoEvent : function () {
        var safeBox = $('.sbu-safeBox'),
            resBox = $('.sbu-resBox'),
            boxBtn = $('.J_boxBtn');
        var moreBtn = $('.J_moreBtn'),
            resItemBox = $('.sbu-itemBox-res');
        var itemBtn = $('.J_resLetter');
        boxBtn.on('click',function () {
            var self = this;
            if($(this).hasClass('sbu-boxBtn-hide')){
                if(resBox && !resBox.hasClass('none')){
                    resBox.addClass('none');
                };
                if(safeBox && !safeBox.hasClass('none')){
                    safeBox.addClass('none');
                };
                $(this).removeClass('sbu-boxBtn-hide').addClass('sbu-boxBtn-show');
                $(this).text('展开明细');
            }else if($(this).hasClass('sbu-boxBtn-show')){
                if(resBox && resBox.hasClass('none')){
                    resBox.removeClass('none');
                };
                if(safeBox && safeBox.hasClass('none')){
                    safeBox.removeClass('none');
                };
                $(this).removeClass('sbu-boxBtn-show').addClass('sbu-boxBtn-hide');
                $(this).text('隐藏明细');
            }
        });

        moreBtn.on('click',function () {
            var self = this;
            var itemResBox ;
            itemResBox = $(this).parents('.sbu-resBox').find('.sbu-itemBox-res');
            if($(this).hasClass('sbu-moreshow')){
                itemResBox.map(function (index,item) {
                    if($(item).hasClass('none')){
                        $(item).removeClass('none');
                    }
                });
                $(this).removeClass('sbu-moreshow').addClass('sbu-morehide');
                $(this).html('收起更多');
            }else if ($(this).hasClass('sbu-morehide')) {
                itemResBox.map(function (index,item) {
                    if(index>2){
                        $(item).addClass('none');
                    }
                });
                $(this).removeClass('sbu-morehide').addClass('sbu-moreshow');
                $(this).html('展开更多');
            }
        });

        itemBtn.on('click',function () {
            var self = this;
            var popPanel = $(this).parent().find('.sbu-itemPop');
            var _url = '/intervacation/api/SBUPackage/GetProductNewNoticeInfo?';
            var resourceid = $(self).attr("data-resourceId");
            var advanceDay = $(self).attr("data-days");
            var advanceTime = $(self).attr("data-time");
            _url += "resourceid=" + resourceid + "&advanceDay=" + advanceDay + "&advanceTime=" + advanceTime;
            if($(self).parent().find('.sbu-itemPopInfo').children().length === 0){
                Common.ajax({
                    url: _url,
                    datatype: "jsonp",
                    success: function(data){
                        if(data && data.Data){
                            $(self).parent().find('.sbu-itemPopInfo').html(wanleDetailTmpl(data.Data));
                            if($(self).hasClass('sbu-hide')){
                                if(popPanel.hasClass('none')){
                                    popPanel.removeClass('none');
                                }
                                $(self).removeClass('sbu-hide').addClass('sbu-show');
                            }
                        }
                    }
                });
            }else{
                if($(self).hasClass('sbu-hide')){
                    if(popPanel.hasClass('none')){
                        popPanel.removeClass('none');
                    }
                    $(self).removeClass('sbu-hide').addClass('sbu-show');
                }else if ($(self).hasClass('sbu-show')) {
                    if(!popPanel.hasClass('none')){
                        popPanel.addClass('none');
                    }
                    $(self).removeClass('sbu-show').addClass('sbu-hide');
                }
            }

        });

            $(document).on('click', ".J_visa-type li", function () {
                var self = this;
                if (!$(self).hasClass('visa-type-checked')) {
                    $(self).parents('.J_visa-type').children().map(function (key, item) {
                        if ($(item).hasClass('visa-type-checked')) {
                            $(item).removeClass('visa-type-checked').addClass('visa-type-common');
                        }
                    });
                    $(self).removeClass('visa-type-common').addClass('visa-type-checked');
                    $(self).parents('.resource-visa-head').siblings('.visa-type-content').map(function (key, item) {
                        if (!$(item).hasClass('none')) {
                            $(item).addClass('none');
                        }
                        if (key == $(self).index()) {
                            $(item).removeClass('none');
                        }
                    });
                }
            });

        }
    };
	module.exports = new Order();
});
