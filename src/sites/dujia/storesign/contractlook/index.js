/**
 * @des pc门店在线签约
 * @date  ym/10862 2017/02-13
 *  */
var Appoint = {},
    dialog = require("dialog/0.2.0/dialog"),
    Qrcode = require("qrcode/0.1.0/index");
// 异步参数
var ajaxParam = {
    CustomerSerialid : $("#Customerid").val() || '',
    OpJobnum : $("#OpJobnum").val()||'',
    OpName : $("#OpName").val()||'',
    ProjectCode : parseInt($("#ProjectCode").val()) || 1,
    ContractSerialid:$("#Contractid").val()||""
};
var $dialog = new dialog({
    skin: 'default',
    template: {
        tooltip: {
            width: '430px'
        }
    }
});
Appoint.host = "";
Appoint = {
    init:function(){
        var self = this;

        if( !ajaxParam.CustomerSerialid && !ajaxParam.ContractSerialid ){
            window.location.href = '/dujia/signstore/storecontract.html?jId=' + (self.getUrlParam().jId || '');
        }

        if($(window).height()>680){   // 图片框高度
            var height = $(window).height()-260;
            $(".contract_doc").css({"height":height+"px"});
        }
        self.initDoc();
        self.initEvent();
    },
   
    // 获取合同信息
    getorderInfo:function(){
        var self = this;
        var thisUrl = "/intervacation/ajax/pcsignstore/MakeOrderContract";
			params = {};
		params.ChangeSignBodyCode = parseInt($("#ChangeSignBodyCode").val())||0,
		params.StoreCode = $("#StoreCode").val()||'';
        $.extend(params,ajaxParam);
        $.ajax({
            url: thisUrl,
            type: 'post',
			data: params,
			dataType : 'json',
            success: function (data) {
                var str = "",htmlList = "",text="",
                    jsonObj = {};
                if(data && data.Result===true){
                    if(data.ContractImgs && data.ContractImgs.length>0){
                        for(i=0;i<data.ContractImgs.length;i++){
                            str += '<img src=' + data.ContractImgs[i].ImgUrl + ' alt="合同">';
                        }
                        htmlList = str;
                        jsonObj = data;
                        $(".J_appoint").text("去签约").css({"display":"block"});
                        self.initDoc(jsonObj);
                        self.initEvent(jsonObj);
                    }else{
                        if(data.Message){
                            if(data.Message == "未获取到合同初始化生成数据"){
                                self.setFailTip('<div class="fail_t">未获取到合同初始化生成数据，合同暂未生成，请刷新页面！</div>');
                            }else{
                                htmlList = '<div class="fail_t">'+  data.Message +'</div>';
                            }
                        }else{
                            htmlList = '<div class="fail_t">抱歉，请刷新页面重新获取合同信息！</br>刷新未获取到合同信息，请联系技术人员施永刚13053！</div>';
                        }
                    }
                    $(".contract_doc").html(htmlList);
                }else{
                    if(data.Message && data.Message!=""){
                        $(".contract_doc").html('<div class="fail_t">'+ data.Message +'</div>');
                    }else{
                        $(".contract_doc").html('<div class="fail_t">抱歉，未获取到合同信息，请联系技术人员施永刚13053！</div>');
                    }
                }
            },
            error:function(){
                $(".contract_doc").html('<div>抱歉，未获取到合同信息，请联系技术人员施永刚13053！');
            }
        });
    },

    //获取地址
    loadAddress:function(args){
        var self = this;
        var thisUrl = "/intervacation/ajax/pcsignstore/GetContractAddress"
				params = {};
        params.CallBackUrl = "http://" + window.location.hostname + "/dujia/signstore/contractsuccess.html";
        params.SignSendType = args.SignSendType;
        $.extend(params,ajaxParam);
        $.ajax({
            type: 'post',
            url: thisUrl,
            data: params,
            dataType : 'json',
            success:function(data){
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
                self.setFailTip('<div class="fail_t">抱歉，未获取到签约地址，请联系技术人员施永刚13053！</div>');
            }
        })
    },

    initEvent:function(){
        var self = this;
        $(document).on("click",".J_appoint",function(e){
            var args = {
                SignSendType : 0,
                Fn : function(data){
                    if(data.SignUrl && data.SignUrl != ""){
                        window.location.href = data.SignUrl;
                    }else{
                        if(data.Message&&data.Message!=""){
                            self.setFailTip('<div class="fail_t"'+data.Message+'</div>');
                        }else{
                            self.setFailTip('<div class="fail_t">抱歉，请刷新页面获取签约地址！</br>刷新重新未获取签约地址，请联系技术人员施永刚13053！</div>');
                        }
                    }
                }
            }
            self.loadAddress(args);
        });
        
    },
     // 附件显示
    initDoc: function(){
        var self = this;
        var thisUrl = "/intervacation/ajax/pcsignstore/GetSignAttachment",
             params = {};
        $.extend(params,ajaxParam);
        $.ajax({
            url: thisUrl,
            type: "post",
            dataType: "json",
            data:params,
            success: function (data) {
                var datas = data,str = "",htmlList = "";
                if(data && data.Result ===true && data.Data && data.Data.length>0){
                    var lists = data.Data;
                    for(i=0;i<lists.length;i++){
                        if(lists[i].Url && lists[i].Url!=""&&lists[i].Name!="合同"){
                            str += '<a target="_blank" href='+ lists[i].Url +'>'+ lists[i].Name +'</a>';
                        }
                    }
                    if(str!=""){
						htmlList = '<em>附属文件：</em>' + str;
					}else{
						htmlList = '<em>附属文件：抱歉，暂没有获取到附属文件！</em>';
					}
                }else{
                    if(data.Message&&data.Message!=""){ 
                        htmlList = '<em>'+data.Message  +'</em>';
                    }else{
                        htmlList = '<em>附属文件：抱歉，暂没有附属文件！</em>';
                    }
                }
                $(".other_doc").html(htmlList);
            },
            error:function(){
                $(".other_doc").html('抱歉，获取附件信息异常，请联系技术人员施永刚13053！');
            }
        });
    },
    getUrlParam: function(key){
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
            height: widthV|| '240px',
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
module.exports = Appoint;
