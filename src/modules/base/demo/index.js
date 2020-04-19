var Reg = Base.extend({
    initialize: function(){
        Reg.superclass.initialize.apply(this,arguments);
    },
    ATTRS: {
      host : "http://www.ly.com",
     defcfg : {
         mode : 2,
         hbkey: 0,
         pageInfo : {
             pageId : "",//页面id
             pagemark : "",//页面id对应的按钮去重标记
             BatchNo : ""//页面id对应批次号
         },
         succurl : false,
         succCallback : true,
         succdCallback : true,
         tips : {
             sucess : "恭喜您,成功领取出境大红包！快点使用吧！",
             sucessed : "亲，您已经领过出境大红包啦，抓紧使用哦",
             error : "亲，红包君开小差了，待会再试吧！",
             over : "亲，您来晚了,红包已领完，明天再试试吧！",
             vcode : "亲，请输入正确验证码",
             cphone : "亲，请输入正确手机号"
         },
         vurl : "/dujia/AjaxCall.aspx?Type=GetRedBagValid&mobile={mobile}&pageid={pageid}&code={code}",
         vcodeurl : "/dujia/AjaxCall.aspx?Type=GetImageJudgePic"
        }
    },
    METHODS: {
        creatFn : function(){
            var self = this;
            $("body").append(self.boneTmpl(self.get("defcfg").mode));
            self.isinit = true;
            self.hackEvent();
            self.bindEvents();
        },
        init : function(cfg){
            var self = this;
            $.extend(true,self.get("defcfg"),cfg);
            if(!self.isinit){
                self.creatFn();
            }
        },
        destroyFn : function(mode){
            var self = this;
            if(mode==1){
                $(".J_bonus_mask").remove();
                $(".J_bonus_suc").remove();
                $("#J_bonus").remove();
            }else{
                $(".J_bonus_mask").remove();
                $(".J_bonus_suc").remove();
                $("#J_bonus").remove();
            }
            self.isinit = false;
        },
        boneTmpl : function(mode){
            var self = this;
            var tmpl = "";
            if(mode===1){
              tmpl +=
                  '<div id="J_bonus" class="c-bonusb">'+
                  '<div class="c-bonusb-main">'+
                  '<div class="c-bonusb-form">'+
                  '<a class="c-bonusb-close J_bonus_x"></a>'+
                  '<div class="c-bonusb-ipt"><input type="text" class="input phone J_bonus_phone" maxlength="11" placeholder="输入手机号"></div>'+
                  '<div class="c-bonusb-ipt">'+
                  '<input type="text" class="input code J_bonus_code" maxlength="6" placeholder="输入验证码">'+
                  '<span class="input codeimg J_bonus_codeimg"><img src="'+self.get("host")+self.get("defcfg").vcodeurl+ "&v=" + Math.random()+'"/></span>'+
                  '<a class="c-bonusb-btn J_bonus_btn">立即领取</a>'+
                  '</div>'+
                  '<div class="c-bonusb-tip J_bonus_tip"></div>'+
                  '</div>'+
                  '<div class="c-bonusb-left"></div>'+
                  '</div>'+
                  '</div>';
            }else{
              tmpl +=
                  '<div class="c-bonus-mask J_bonus_mask"></div>'+
                  '<div id="J_bonus" class="c-bonus">'+
                  '<div class="c-bonus-top">'+
                  '<a class="c-bonus-close J_bonus_x"></a>'+
                  '</div>'+
                  '<div class="c-bonus-main">'+
                  '<div class="c-bonus-hd">免费领取<em>7500元</em>出境大红包啦！</div>'+
                  '<div class="c-bonus-bd">'+
                  '<div class="c-bonus-form">'+
                  '<div class="c-bonus-ipt"><input type="text" class="input phone J_bonus_phone" maxlength="11" placeholder="输入手机号"></div>'+
                  '<div class="c-bonus-ipt">'+
                  '<input type="text" class="input code J_bonus_code" maxlength="6" placeholder="输入验证码">'+
                  '<span class="input codeimg J_bonus_codeimg"><img src="'+self.get("host")+self.get("defcfg").vcodeurl+ "&v=" + Math.random()+'"/></span>'+
                  '</div>'+
                  '<div class="c-bonus-tip J_bonus_tip"></div>'+
                  '<a class="c-bonus-btn J_bonus_btn">立即领取</a>'+
                  '</div>'+
                  '</div>'+
                  '<div class="c-bonus-ft"></div>'+
                  '</div>'+
                  '</div>';
            }
            return tmpl;
        },
        succTmpl : function(cate,mode){
            var tmpl = "",self= this;
            if(mode==1){
                tmpl += '<div class="c-bonus-mask J_bonus_mask"></div>';
            }
            if(cate==1){
              tmpl +=
             '<div class="c-bonus-suc J_bonus_suc">'+
             '<a class="c-bonus-suc-x J_bonus_sucX"></a>'+
             '<div class="c-bonus-suc-tt">'+
             '<p class="bold">恭喜您</p>'+
             '<p>成功领取<em>7500</em>元出境大红包！</p>'+
             '</div>'+
             '<div class="c-bonus-suc-bd"></div>'+
             '<div class="c-bonus-suc-ft">'+
             '<a href="'+self.succUrl()+'" class="c-bonus-suc-btn J_bonus_suc_btn">立即使用</a>'+
             '</div>';
            }else{
              tmpl +=
             '</div>'+
             '<div  class="c-bonus-sucd J_bonus_suc">'+
             '<a class="c-bonus-sucd-x J_bonus_sucX"></a>'+
             '<div class="c-bonus-sucd-tt">'+
             '<p>亲，您已经成功领取过<em>7500</em>元出境大红包！</p>'+
             '</div>'+
             '<div class="c-bonus-sucd-bd"></div>'+
             '<div class="c-bonus-sucd-ft">'+
             '<a href="'+self.succUrl()+'" class="c-bonus-sucd-btn J_bonus_suc_btn">立即使用</a>'+
             '</div>'+
             '</div>';
            }
            return tmpl;
        },
        succFn : function(cate,mode){
            var self = this;
            $("#J_bonus").remove();
            $("body").append(self.succTmpl(cate,mode));
            $(".J_bonus_sucX").click(function(){
                self.destroyFn(self.get("defcfg").mode);
            });
        },
        succUrl : function(){
            var self = this, sUrl=self.get("defcfg").succurl, url= "";
            //hack
            if(self.get("defcfg").pageInfo.pagemark){
                sUrl = true;
            }
            if(sUrl){
                if(typeof (sUrl)== "string"){
                    url = sUrl;
                }else{
                    url = "http://www.ly.com/dujia/";
                }
            }else{
                url="javascript:void(0)";
            }
            return url;
        },
        hackEvent : function(){
            var self = this;
            //�ж��������Ƿ�֧��placeholder����
            var supportPlaceholder='placeholder'in document.createElement('input');
            //����������֧��placeholder����ʱ������placeholder����
            if(!supportPlaceholder){
                $('#J_bonus input').each(function(){
                    if($(this).attr("type") == "text"){
                        placeholder($(this));
                    }
                });
            }

            function placeholder(input){
                var text = input.attr('placeholder'),
                      defaultValue = input.defaultValue;
                if(!defaultValue){
                    input.val(text).addClass("placeholder");
                }
                input.focus(function(){
                    if(input.val() == text){
                        $(this).val("");
                    }
                });
                input.blur(function(){
                    if(input.val() == ""){
                        $(this).val(text).addClass("placeholder");
                    }
                });
                //�������ַ���Ϊ��ɫ
                input.keydown(function(){
                    $(this).removeClass("placeholder");
                });
            };
        },
        verifyFn : function(){
            var self = this;
            var params = {
                mobile : $(".J_bonus_phone").val(),
                code : $(".J_bonus_code").val(),
                pageid : self.get("defcfg").pageInfo.pageId,
                pagemark : self.get("defcfg").pageInfo.pagemark
            }
            //
            if(params.mobile.length!=11||!params.mobile.match(/^1[0-9]{10}$/) ) {
                self.tipsFn(self.get("defcfg").tips.cphone);
                self.vcodeFn($(".J_bonus_codeimg"));
                return;
            }
            if(params.code.length === ""){
                self.tipsFn(self.get("defcfg").tips.vcode);
                self.vcodeFn($(".J_bonus_codeimg"));
                return;
            }
            //
            var ajaxurl = self.get("defcfg").vurl.replace(/{(\w+)}/g,function($0,$1){
                return params[$1];
            })
            //
            if(self.get("defcfg").pageInfo.pagemark){
                ajaxurl += "&pagemark="+self.get("defcfg").pageInfo.pagemark;
            }

            $.ajax({
                url: self.get("host")+ajaxurl,
                dataType: "jsonp",
                success: function (data) {
                    var status = data.status;
                    switch (status){
                        case "100"://�ɹ�
                            self.tipsFn(self.get("defcfg").tips.sucess,1);
                            //
                            if(typeof (self.get("defcfg").succCallback)=="function"){
                                self.get("defcfg").succCallback();
                            }else{
                                self.succFn(1,self.get("defcfg").mode);
                            }
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "101"://��������
                            window.console&&console.log("��������");
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "102"://��֤��
                            self.tipsFn(self.get("defcfg").tips.vcode,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "103"://����
                            self.tipsFn(self.get("defcfg").tips.over,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "104"://����
                            self.tipsFn(self.get("defcfg").tips.sucessed,1);
                            //
                            if(typeof (self.get("defcfg").succdCallback)=="function"){
                                self.get("defcfg").succdCallback();
                            }else{
                                self.succFn(2,self.get("defcfg").mode);
                            }
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "106"://�ֻ�
                            self.tipsFn(self.get("defcfg").tips.cphone,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        default :
                            self.tipsFn(self.get("defcfg").tips.error,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                    }
                }
            });
        },
        tipsFn : function(tip,cate){
            var tipstr = "";
            if(cate==1){
                tipstr = '<span class="tip1"><i></i>'+tip+'</span>';
            }else{
                tipstr = '<span class="tip2"><i></i>'+tip+'</span>';
            }
            $(".J_bonus_tip").html(tipstr);
        },
        vcodeFn : function(el){
            var self = this;
            var url = self.get("host") + self.get("defcfg").vcodeurl + "&v=" + Math.random();
            el.find("img").attr("src",url);
        },
        bindEvents : function(){
            var self = this;
            //��֤��ͼƬ�����任
            $(".J_bonus_codeimg").on("click",function(){
                var url = self.get("host") + self.get("defcfg").vcodeurl + "&v=" + Math.random();
                $(this).find("img").attr("src",url);
            });
            //����������ʾ
            $("#J_bonus input").on("focus",function(){
                $(".J_bonus_tip").html(" ");
            });
            //ȷ����֤ȫ��
            $(".J_bonus_btn").on("click",function(){
                self.verifyFn();
            });
            //�رյ���
            $(".J_bonus_x").on("click",function(){
                self.destroyFn(self.get("defcfg").mode);
            });
            //�ɹ��رյ���
            $("body").on("click",".J_bonus_suc_btn",function(){
                var jself = $(this);
                if(jself.attr("href") == "javascript:void(0)"){
                    self.destroyFn();
                }
            });
        }
    }
});
var reg = new Reg();
var Discount = Base.extend({
    initialize: function(){
        Discount.superclass.initialize.apply(this,arguments);
        this.requestData();
    },
    ATTRS: {
        isLogin: false,
        xhr:{
            url: "http://irondome.ly.com/dujia/ajaxhelper/BookingPage.ashx?type=GetBookPageData",
            dataType: "jsonp"
        },
        checkCodeXhr: {
            url: "http://irondome.ly.com/dujia/OrderAjaxCall.aspx?Type=CheckPreferentialCode",
            dataType: "jsonp"
        }
    },
    EVENTS: {
        "#text-item-2-0,#text-item-3-0": {
            "blur": "checkCodeAction"
        },
        ".J_btnToggleExpand": {
            "click": "toggleAction"
        },
        ".J_bonus": {
            "click": "getBonusAction"
        }
    },
    METHODS: {
        requestData: function(){
            var self = this;
            $.ajax(this.get("xhr")).then(function(data){
                data = self._processData(data);
            })
            this.render();
        },
        render: function(data){
            var s ="";
            for (var i = 0; i < 1000000; i++) {
                s += "-";
            }
        },
        _processData: function(data){

        },
        checkCodeAction: function(e){
            $.ajax(this.get("checkCodeXhr")).then(function(data){
                if(data && data.RespCode == 1){
                    alert("验证不同过");
                }else{
                    alert("验证通过");
                }
            });
        },
        getBonusAction: function(e){
            reg.init();
        },
        toggleAction: function(e){
            var $el = $(e.target);
            var $wrap = $el.parents(".J_preferentialContent");
            var $el1 = $(".btn-showAll",$el);
            var $el2 = $(".btn-hideAll",$el);
            $wrap.toggleClass("expand");
            if($wrap.hasClass("expand")){
                $el1.html("展开全部");
                $el2.html("收起全部");
            }else{
                $el1.html("收起全部");
                $el2.html("展开全部");
            }
        }
    }
});

var discount = new Discount({el: "#discount"});
