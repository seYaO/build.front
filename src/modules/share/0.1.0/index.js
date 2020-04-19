define("share/0.1.0/index",["qrcode/0.1.0/index","dialog/0.1.0/index","share/0.1.0/index.css"],function(require){
    var $ = jQuery;
    var dialog = require("dialog/0.1.0/index"),
        delayT;
    var Share = function(param){
        $.extend(this.param,param);
        this.init();
    };
    Share.prototype = {
        param: {
            title: document.title + "@同程网",
            url: document.location.href,
            summary: "",
            wxurl: document.location.href,
            pic: ""
        },
        tmpl: '<p class="share_c">将你中意的线路分享出去吧，让我们来一场不期而遇的旅行！</p>'
            +   '<div class="share_d clearfix">'
            +       '<a data-share="sina" href="javascript:void(0);" class="share_sina sina_ico">新浪微博</a>'
            +       '<a data-share="weixin" href="javascript:void(0);" class="share_weixin weixin_ico">微信</a>'
            +       '<a data-share="qzone" href="javascript:void(0);" class="share_qzone qqzone_ico">QQ空间</a>'
            +   '</div>',
        sites: {
            sina: {
                surl: 'http://v.t.sina.com.cn/share/share.php?'
            },
            qzone: {
                surl: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'
            },
            weixin: {
                callback: function(param){
                    var d = $(this).data("dialog");
                    if(!d){
                        var wxurl = param.wxurl,
                            Qrcode = require("qrcode/0.1.0/index"),
                            text = '<p class="tc_weixin_pop_head"><span>分享到微信朋友圈</span></p>' +
                                '<div class="qr_con"></div>' +
                                '<div class="tc_weixin_pop_foot">打开微信，点击“发现”，<br>使用“扫一扫”即可将网页分享至朋友圈。</div>';
                        d = dialog({
                            content: text,
                            trigger: this,
                            triggerType: "click",
                            modal: true,
                            onshow: function () {
                                if(!this.isInit){
                                    var qrEl = $(this.node).find(".qr_con");
                                    var qrcode = new Qrcode(
                                        qrEl[0], {
                                            width: 200,
                                            height: 200
                                        });
                                    qrcode.makeCode(wxurl);
                                    this.isInit = true;
                                }
                            }
                        });
                        $(this).data("dialog",d);
                    }
                    d.show();
                }
            }
        },
        init: function(){
            var self = this,
                param = self.param,
                d;
            d = dialog({
                content: self.tmpl,
                tip: true,
                trigger: param.trigger,
                triggerType: "hover",
                align: "bottom left",
                onshow: function () {
                    if(!this.isInit){
                        self.initEvent.call(self,this);
                        this.isInit = true;
                    }
                }
            });
        },
        initEvent: function(dialog){
            var self = this,
                node = dialog.node,
                param = self.param;
            $("a",node).on("click",function(){
                var sType = this.getAttribute("data-share");
                if(!sType) return;
                var siteConf = self.sites[sType];
                if(!siteConf) return;
                if(siteConf.callback){
                    siteConf.callback.call(this,self.param);
                }else{
                    param.surl = siteConf.surl;
                    self.open(param);
                }
            });
        },
        open: function(param){
            var e = encodeURIComponent;
            var f = param.surl,
                u = param.url,
                title = param.title,
                pic = param.pic,
                summary = param.summary,
                p = ['url=', e(u), '&title=', e(title), '&summary=',
                    summary, '&pic=', e(pic)
                ].join('');

            function a() {
                if (!window.open([f, p].join(''), 'mb', [
                        'toolbar=0,status=0,resizable=1,width=620,height=450,left=', (
                        screen.width -
                        620) / 2, ',top=', (screen.height - 450) /
                        2
                    ].join(''))) u.href = [f, p].join('');
            }
            if (/Firefox/.test(navigator.userAgent)) {
                setTimeout(a, 0);
            } else {
                a();
            }
        }
    };
    return Share;
});