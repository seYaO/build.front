/**
 * Created by zy10746 on 2015/7/28.
 */
(function($){
    var Bonus = {
        host : "http://www.ly.com",
        defcfg : {
            maskclose: true,
            pageInfo : {
                pageId : "",//页面id
                pagemark : "",//页面id对应的按钮去重标记
                BatchNo : ""//页面id对应批次号
            },
            succCallback : true,
            succdCallback : true,
            succurl : false,
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

        },
        //初始化调用
        init : function(cfg){
            var self = this;
            $.extend(true,self.defcfg,cfg);
            if(!self.isinit){
                self.creatFn();
            }
        },
        //判断客户端
        check: function() {
            var ua = navigator.userAgent,
                isApp = /TcTravel\/(\d+\.\d+\.\d+)/.exec(ua);
            return isApp;
        },

        //创建骨架
        creatFn : function(){
            var self = this;
            $("body").append(self.boneTmpl());
            //
            self.isinit = true;
            //
            self.bindEvents();
        },
        succFn : function(cate){
            var self = this;
            $("#J_bonus").remove();
            $("body").append(self.succTmpl(cate));
            self.defcfg.maskclose = true;

        },
        succUrl : function(){
            var self = this, sUrl=self.defcfg.succurl, url= "";
            //hack
            if(self.defcfg.pageInfo.pagemark){
                sUrl = true;
            }
            if(sUrl){
                if(typeof (sUrl)== "string"){
                    url = sUrl;
                }else{
                    if(self.check()){
                        url = "http://shouji.17u.cn/internal/holiday/home";
                    }else{
                        url = "http://m.ly.com/dujia";
                    }
                }
            }else{
                url="javascript:void(0)";
            }
            return url;
        },
        destroyFn : function(){
            var self = this;

            $(".J_bonus_mask").remove();
            $(".J_bonus_suc").remove();
            $("#J_bonus").remove();

            self.isinit = false;
        },
        //创建骨架
        boneTmpl : function(){
            var self = this;
            var tmpl = "";
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
                '<span class="input codeimg J_bonus_codeimg"><img src="'+self.host+self.defcfg.vcodeurl+ "&v=" + Math.random()+'"/></span>'+
                '</div>'+
                '<div class="c-bonus-tip J_bonus_tip"></div>'+
                '<a class="c-bonus-btn J_bonus_btn">立即领取</a>'+
                '</div>'+
                '</div>'+
                '<div class="c-bonus-ft"></div>'+
                '</div>'+
                '</div>';

            return tmpl;
        },
        succTmpl : function(cate){
            var tmpl = "",self= this;
            if(cate==1){
                tmpl=
                '<div class="c-bonus-suc J_bonus_suc">'+
                '<div class="c-bonus-suc-tt">'+
                '<p>恭喜您</p>'+
                '<p>成功领取<em>7500</em>元出境大红包！</p>'+
                '</div>'+
                '<div class="c-bonus-suc-bd"></div>'+
                '<div class="c-bonus-suc-ft">'+
                '<a href="'+self.succUrl()+'" class="c-bonus-suc-btn J_bonus_suc_btn">戳我立刻用红包</a>'+
                '<p class="c-bonus-suc-tip">购买出境游产品时，登录您手机号对应的同程旅游账户，即可使用领取到的旅游抵现红包。</p>'+
                '</div>'+
                '</div>';
            }else{
                tmpl=
                '<div class="c-bonus-sucd J_bonus_suc">'+
                '<div class="c-bonus-sucd-tt">'+
                '<p>亲，您已经</p>'+
                '<p>成功领取<em>7500</em>元出境大红包！</p>'+
                '</div>'+
                '<div class="c-bonus-sucd-bd"></div>'+
                '<div class="c-bonus-sucd-ft">'+
                '<a href="'+self.succUrl()+'" class="c-bonus-sucd-btn J_bonus_suc_btn">戳我立刻用红包</a>'+
                '<p class="c-bonus-sucd-tip">购买出境游产品时，登录您手机号对应的同程旅游账户，即可使用领取到的旅游抵现红包。</p>'+
                '</div>'+
                '</div>';
            }
            return tmpl;

        },
        //验证全局
        verifyFn : function(){
            var self = this;
            var params = {
                mobile : $(".J_bonus_phone").val(),
                code : $(".J_bonus_code").val(),
                pageid : self.defcfg.pageInfo.pageId,
                pagemark : self.defcfg.pageInfo.pagemark
            };
            if(params.mobile.length!=11||!params.mobile.match(/^1[0-9]{10}$/) ) {
                self.tipsFn(self.defcfg.tips.cphone);

                self.vcodeFn($(".J_bonus_codeimg"));
                return;
            }
            if(params.code.length === ""){
                self.tipsFn(self.defcfg.tips.vcode);

                self.vcodeFn($(".J_bonus_codeimg"));
                return;
            }
            //
            var ajaxurl = self.defcfg.vurl.replace(/{(\w+)}/g,function($0,$1){
                return params[$1]
            });
            //
            if(self.defcfg.pageInfo.pagemark){
                ajaxurl += "&pagemark="+self.defcfg.pageInfo.pagemark;
            }
            $.ajax({
                url: self.host+ajaxurl,
                dataType: "jsonp",
                success: function (data) {
                    var status = data.status;
                    switch (status){
                        case "100"://成功
                            self.tipsFn(self.defcfg.tips.sucess,1);
                            //
                            if(typeof (self.defcfg.succCallback)=="function"){
                                self.defcfg.succCallback();
                            }else{
                                self.succFn(1);
                            }
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "101"://参数不足
                            window.console&&console.log("参数不足");
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "102"://验证码
                            self.tipsFn(self.defcfg.tips.vcode,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "103"://领完
                            self.tipsFn(self.defcfg.tips.over,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "104"://已领
                            self.tipsFn(self.defcfg.tips.sucessed,1);
                            //
                            if(typeof (self.defcfg.succdCallback)=="function"){
                                self.defcfg.succdCallback();
                            }else{
                                self.succFn(2);
                            }
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        case "106"://手机
                            self.tipsFn(self.defcfg.tips.cphone,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                        default :
                            self.tipsFn(self.defcfg.tips.error,0);
                            self.vcodeFn($(".J_bonus_codeimg"));
                            break;
                    }
                }
            });
        //
        },
        //提示显示
        tipsFn : function(tip,cate){
            var tipstr = "";
            if(cate==1){
                tipstr = '<span class="tip1"><i></i>'+tip+'</span>';
            }else{
                tipstr = '<span class="tip2"><i></i>'+tip+'</span>';
            }
            $(".J_bonus_tip").html(tipstr);
        },
        //验证码图片
        vcodeFn : function(el){
            var self = this;
            var url = self.host + self.defcfg.vcodeurl + "&v=" + Math.random();
            el.find("img").attr("src",url);
        },
        //事件绑定
        bindEvents : function(){
            var self = this;
            //验证码图片点击变换
            $(".J_bonus_codeimg").on("click",function(){
                var url = self.host + self.defcfg.vcodeurl + "&v=" + Math.random();
                $(this).find("img").attr("src",url);
            });
            //输入清空提示
            $("#J_bonus input").on("focus",function(){
                $(".J_bonus_tip").html(" ");
            });
            //确定验证全局
            $(".J_bonus_btn").on("click",function(){
                self.verifyFn();
            });
            //关闭弹窗
            $(".J_bonus_x").on("click",function(){
                self.destroyFn();
            });
            //关闭弹窗
            $(".J_bonus_mask").on("click",function(){
                if(self.defcfg.maskclose){
                    self.destroyFn();
                }
            });
            //成功关闭弹窗
            $("body").on("click",".J_bonus_suc_btn",function(){
                var jself = $(this);
                if(jself.attr("href") == "javascript:void(0)"){
                    self.destroyFn();
                }
            });
        }
    };
    window.Bonus = Bonus;
    module.exports = Bonus;
})(Zepto);

