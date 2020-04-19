/**
 * @des 门店在线签约查询页
 * @date  ym/10862 2017/02-13
 *  */
var storeContract = {},
    dialog = require("dialog/0.2.0/dialog");
	Qrcode = require("qrcode/0.1.0/index");
// 异步参数
var ajaxParam = {
    CustomerSerialid : $("#CustomerSerialid").val() || '',
    OpJobnum : $("#OpJobnum").val()||'',
    OpName : $("#OpName").val()||'',
    ProjectCode : parseInt($("#ProjectCode").val()) || 1
};
var appoint={},
	detailTmpl = require("./showinfro.dot"); 
appoint.RebuildVal= "0";  //合同是否强制生成
var $dialog = new dialog({
    skin: 'default',
    template: {
        tooltip: {
            width: '430px'
        }
    }
});
storeContract = {
    init:function(){
        var self = this;
		ajaxParam.OpJobnum = self.getUrlParam().jId || '';
		$('#J_Form').attr('action',function(n,v){
			return v + '?jId=' +ajaxParam.OpJobnum;
		})
        self.submitEvent();
    },
   
   // 绑定事件
	submitEvent : function(){
        var self = this;
		// 选择所属项目
		$(".J_project").off('click').on("click",function(e){
			e.stopPropagation();
			var nameV = $(this).find("input").val()||"",
				proId = $(this).find("input").attr("data-id")||"";
			var str= "",html="";
			if(proId!=""){
				$(".select_list li").each(function(elem,i){
					if($(this).attr("data-id")==proId){
						$(this).addClass("active");
					}
				});
			}
			$(".J_showSign").html("");
			$('.form-control+.trigon').addClass('active');
			$(".select_list").removeClass("none");
			self.projectEvent();
		});

		// 查询合同
		$(".J_selectSign").on("click",function(){
			var that = this,
				input = $.trim($(".J_customerId input").val()),
				errorDom = $('.J_showError'),
				dom = $(".J_showSign"),
				inputV = $(".J_project input"),
				customerId = $(".J_customerId input");
			errorDom.html("");
			if($.trim(inputV.val())==""){
				errorDom.removeClass("none").html("请选择所属项目");
				return false;
			}
			if($.trim(customerId.val())==""){
				errorDom.removeClass("none").html("请输入订单号");
				return false;
			}
			ajaxParam.ProjectCode = inputV.attr("data-id");
			if(ajaxParam.ProjectCode==""){
				ajaxParam.ProjectCode=="1";
			}
			ajaxParam.CustomerSerialid = $.trim($(".J_customerId input").val());
			
			if(self.checkInput($.trim(customerId.val()))){
				
				var thisUrl = "/intervacation/ajax/pcsignstore/SearchOrderAppoint";
				$.ajax({
					type: 'post',
					url: thisUrl,
					data: ajaxParam,
					dataType : 'json',
					beforeSend: function () {
						$(that).addClass('loading');
					},
					success: function(data){
						self.isLoadQrcode = false;
						$(that).removeClass('loading');
						if(data&&data.Result===true&&data.Data){
							var datas = data.Data,str = "",htmlList = "";
							dom.removeClass("none").html("");
							appoint.StoreCode = datas.StoreCode;
							
							var jsonObj = {};
							jsonObj = datas;
							self.jsonObj = datas;
							// 显示订单查询信息
							var dataHtml = detailTmpl(data.Data);
							$(".J_showSign").html(dataHtml);
							self.makeContractEvent(jsonObj);
						}else{
							if(data.Message&&data.Message!=""){
								if(data.Message=="未获取到订单实体！"){
									self.setFailTip('<div class="fail_t">'+ data.Message +'请确认订单号是否存在，若存在，请联系技术人员施永刚13053！</div>');
								}else{
									self.setFailTip('<div class="fail_t">'+data.Message+'</div>');
								}
							}else{
								errorDom.removeClass("none").html('<div>抱歉，未查询到合同信息！</div>');
							}
						}
					},
					error:function(){
						errorDom.html('<div>抱歉，未查询到合同信息，请确认订单号是否正确！</div>');
					}
				});
			}else{
				errorDom.removeClass("none").html("请输入正确的订单号");
			}
		});
		$(".J_customerId span").on("input click",function(e){
			e.stopPropagation();
			var input = $.trim($(".J_customerId input").val()),
				errorDom = $('.J_showError'),
				dom = $(".J_showSign");
			$(".J_showSign").html("");
			if(input&&input!=""){
				if(self.checkInput(input)){
					errorDom.addClass("none");
				}else{
					errorDom.removeClass("none").html("请输入正确的订单号");
				}
			}else{
				errorDom.removeClass("none").html("请输入订单号");
			}
		});
	},
	checkInput : function(value){
		var reg = /^(\d{4,16})$/;
		if(reg.test(value)){
			return true;
		}else{
			return false;
		}
	},
	// 选择项目
	projectEvent : function(){
        var self = this;
		$(".select_list li").off('click').on("click",function(e){
			e.stopPropagation();
			var domList = $(".select_list li");
			domList.removeClass("active");
			$(this).addClass("active");
			$('.form-control+.trigon').removeClass('active');
			$(".select_list").addClass("none");
			var active = $(".select_list li.active"),
				id= active.attr("data-id");
			
			$(".J_project input").val(active.text()).attr("data-id",id);
			$(".J_showSign").addClass("none").html("");
		});
	},
	isLoadQrcode:false,//添加二维码
	makeContractEvent : function(datas){
        var self = this;
		$(".J_getAppoint").off('click').on("click",function(){
			if(!checkIDCard()) return false;
			var res = checkStatus(0);
			if(res == 1) self.subParams(datas.StoreSignBodyCode);
			if(res == 2) self.subParams(0);
			
		});

        $('.J_getQrcode').off('click').on('click',function(e){
			e.stopPropagation();
			if(!checkIDCard()) return false;
			if(checkStatus(1) == 0) return false;
            self.addQrcode();
        });

		$(document).on('click',function(e){
			if(!$(e.target).parents().hasClass('qrcode') ) {
				$(".J_getQrcode .qrcode").hide();
			}
		})

        //发送短信
        $('.J_sendMessage').off('click').on('click',function(){
			if(!checkIDCard()) return;
			if(checkStatus(2) == 0) return false;
            self.sendMessage();
        })
		//判断证件号码是否为空
		function checkIDCard(){
			if(!datas.CertificatesNumber || datas.CertificatesNumber == ""){
				self.setFailTip('<div class="fail_t">预订人证件号码未维护，</br>请维护。</div>');
				return false;
			}
			return true;
		}

		// 判断订单状态
		function checkStatus(clickType){
			var tipText = "";
			if(datas.SignBodyCode!=datas.StoreSignBodyCode){
				if(datas.SignBodyCode==0&&datas.SignBodyName==""){
					return 1;
				}else{
					if(datas.SignStatus==2){
						appoint.RebuildVal = "1";
						tipText = "该订单已签约，当前门店主体与签约主体不一致，是否需要重新签约成当前门店主体合同？"; // 签约主体不一致
					}else{ 
						tipText = "当前订单签约主体与门店主体不一致，是否需要覆盖？"; // 签约门店是否一致
					}
					self.endContractEvent(datas,tipText, clickType);
					return 0;
				}
			}else if(datas.SignStatus==2){
				appoint.RebuildVal = "1";
				if(datas.SignBodyCode!=datas.StoreSignBodyCode){
					tipText = "该订单已签约，当前门店主体与签约主体不一致，是否需要重新签约成当前门店主体合同？"; // 签约主体不一致
				}else{
					tipText = "该合同已签约，是否重新签约？";     //是否已经签约,已签约，提示是否重新签约
				}
				self.endContractEvent(datas,tipText,clickType);
				return 0;
			}else{
				return 2;
			}
		}
	},
	//获取地址
    loadAddress:function(args,datas){
        var self = this;
        // var thisUrl = "/intervacation/ajax/pcsignstore/GetContractAddress"
		var thisUrl = "/intervacation/TstorerHandler/GetContractHref",
				params = {};
		params.CustomerSerialid = datas.CustomerSerialid;
		params.ChangeSignBodyCode = datas.StoreSignBodyCode || 0;
		params.OpJobnum = self.getUrlParam().jId;
		params.ProjectCode = datas.SignStatus;
		params.StoreCode = datas.StoreCode;
        params.SignSendType = args.SignSendType;
		params.Mobile = args.Mobile;
		params.Rebuild = args.rebuild == 0 ? 1 : 0;
        $.extend(params,ajaxParam);
        $.ajax({
            type: 'post',
            url: thisUrl,
            data: params,
            dataType : 'json',
            success:function(data){
				$('.J_sendMessage').removeClass('loading');
                if(data && data.Result === true){
                    args.Fn(data);
                }else{
                    if(data && data.Message&&data.Message!=""){
                        self.setFailTip('<div class="fail_t">'+data.Message+'</div>');
                    }else{
                        self.setFailTip('<div class="fail_t">抱歉，未获取到签约地址，请联系技术人员施永刚13053！</div>');
                    }
                }
            },
            error:function(e){
				$('.J_sendMessage').removeClass('loading');
                self.setFailTip('<div class="fail_t">抱歉，未获取到签约地址，请联系技术人员施永刚13053！</div>');
            }
        })
    },
	// 签约二维码
	addQrcode:function(rebuild){
		var self = this;
		$(".J_getQrcode .qrcode").show();
		if(self.isLoadQrcode) return false;
		var args = {
			SignSendType : '1',
			rebuild: rebuild,
			Fn : function(data){
				if(data.SignUrl && data.SignUrl != ""){
					var qrEle = $(".J_getQrcode .qrcode-img");
					qrEle.empty();
					var qrcode = new Qrcode(
						qrEle[0], {
							width: 136,
							height: 136
						});
					qrcode.makeCode(data.SignUrl);
					self.isLoadQrcode = true;
				}else{
					self.isLoadQrcode = false;
					$(".J_getQrcode .qrcode").hide();
					if(data.Message&&data.Message!=""){
						self.setFailTip('<div class="fail_t"'+data.Message+'</div>');
					}else{
						self.setFailTip('<div class="fail_t">抱歉，请刷新页面获取签约地址！</br>刷新重新未获取签约地址，请联系技术人员施永刚13053！</div>');
					}
				}
			}
		}
		self.loadAddress(args,self.jsonObj);
	},
	// 发送短信
	sendMessage:function(rebuild){
		var self = this;
		// self.setFailTip('<div class="fail_t"><span class="loading_de">正在发送，请稍等...</span></div>');
		$('.J_sendMessage').addClass('loading');
		var args = {
			SignSendType : 2,
			rebuild : rebuild,
			Mobile:self.jsonObj.SignCustomerMobile,
			Fn : function(data){
				if(data.Message&&data.Message!=""){
					self.setFailTip('<div class="fail_t">'+ data.Message +'</div>');
				}else{
					self.setFailTip('<div class="fail_t">抱歉，请刷新页面重新发送！</br>刷新重新发送失败，请联系技术人员施永刚13053！</div>');
				}
			}
		}
		self.loadAddress(args,self.jsonObj);
	},
	// 显示提示弹窗
	endContractEvent : function(datas,tipText,clickType){
        var self = this;
		$(".ui_shawow_box").find(".s_tip").html(tipText);
		$(".ui_shawow").removeClass("none");
		$(".ui_shawow_box").removeClass("none");
		$(".J_leftBtu").off("click").on("click",function(){
			if (clickType == 0) self.subParams(datas.StoreSignBodyCode);
			if (clickType == 1) {
				self.addQrcode(0)
				$(".ui_shawow").addClass("none");
				$(".ui_shawow_box").addClass("none");
			}
			if(clickType == 2) {
				self.sendMessage(0)
				$(".ui_shawow").addClass("none");
				$(".ui_shawow_box").addClass("none");
			}
			return false;
		});
		$(".J_rightBtu").off("click").on("click",function(){
			$(".ui_shawow").addClass("none");
			$(".ui_shawow_box").addClass("none");
		});
	},
	// 提交表单
	subParams : function(code){
        var self = this;
		$("#CustomerSerialid").val(ajaxParam.CustomerSerialid);
		$("#ChangeSignBodyCode").val(code);
		$("#OpJobnum").val(ajaxParam.OpJobnum);
		$("#OpName").val(ajaxParam.OpName);
		$("#ProjectCode").val(ajaxParam.ProjectCode);
		$("#StoreCode").val(appoint.StoreCode);
		$("#Rebuild").val(appoint.RebuildVal);
		$("#J_Form").submit();
	},
    getUrlParam: function(key){
		var self = this;
        var url = location.search;
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
            return theRequest;
        }
    },
    setFailTip:function(context,widthV){
        var self = this;
        var config = {
            content: context,
            width: '436px',
            height: widthV|| '262px',
            quickClose: false
        };
        $dialog.modal(config);
        $(".dialog_modal_title").css({"height":"0"});
        $(".ui_dialog_mask.mask").css({"background-color":"rgba(3, 3, 3, 0.5)"});
        $(".default .dialog_modal_content").css({"margin-top":"0"});
    },
    render:function(config){
        var self = this;
        var key = config.key,
            tpl = config.tpl[key] || config.tpl,
            data = config.data[key] || config.data,
            context = $(config.context),
            callback = config.callback;
        var html,cxt;
        html = tpl(data);
        if (config.overwrite) {
            context.empty();
        }
        cxt = $(html).appendTo(context);
        if (callback && $.isFunction(callback)) {
            callback.call(cxt, config);
        }
    }
};
module.exports = storeContract;
