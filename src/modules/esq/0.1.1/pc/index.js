/**
 * Created by lyf10464 on 2015/8/10.
 */
var ESQ={};
(function(){

        ESQ={
            cfg:{
                imgEl:"http://img1.40017.cn/cn/v/2015/kefu/erwei_03.png",
                telUrl: "http://www.ly.com/dujia/ajaxcall.aspx?type=GetTel400"
            },
            tel: "4007-777-777",
            init:function(cfg){
                    var self=this,
                        defaultCfg=self.cfg;
                ESQ.getRefId();
                    ESQ.addStyle();
                    ESQ.entend(defaultCfg,cfg);

            },
            entend:function(defaultCfg,cfg){
                var self = this,
                    _cfg;

                _cfg= $.extend(defaultCfg,cfg);
                if(!_cfg.url){
                    console.log("请配置url");
                    return;
                }
                self.getData(function(){
                    ESQ.appendEl(_cfg);
                    ESQ.render();
                });
            },
            getUrlRefId:function(){
                var url = location.href,
                    hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
                return hasRefId && hasRefId[1] || "";
            },
            _cookie:function (h, m, j) {
                        if (typeof m != "undefined") {
                            j = j || {};
                            if (m === null) {
                                m = "";
                                j.expires = -1;
                            }
                            var f = "";
                            if (j.expires && (typeof j.expires == "number" || j.expires.toUTCString)) {
                                var d;
                                if (typeof j.expires == "number") {
                                    d = new Date();
                                    d.setTime(d.getTime() + (j.expires * 24 * 60 * 60 * 1000));
                                } else {
                                    d = j.expires;
                                }
                                f = "; expires=" + d.toUTCString();
                            }
                            var k = j.path ? "; path=" + j.path : "";
                            var e = j.domain ? "; domain=" + j.domain : "";
                            var l = j.secure ? "; secure" : "";
                            document.cookie = [h, "=", m, f, k, e, l].join("");
                        } else {
                            var c = null;
                            if (document.cookie && document.cookie != "") {
                                var b = document.cookie.split(";");
                                for (var g = 0; g < b.length; g++) {
                                    var a = $.trim(b[g]);
                                    if (a.substring(0, h.length + 1) == (h + "=")) {
                                        c = decodeURIComponent(a.substring(h.length + 1));
                                        break;
                                    }
                                }
                            }
                            return c;
                        }
                    },
            cookie:function(a,b){

                var func;

                func = ESQ._cookie;
                return func.apply($,arguments);
            },
            getRefId:function(){
                var index=ESQ.getUrlRefId();
                if(index!=null&&index!=0&&index!=""){
                    var urlRefId = "RefId={REFID}&tcbdkeyid=&SEFrom=&SEKeyWords=&RefUrl="
                        .replace('{REFID}',ESQ.getUrlRefId());
                    if (urlRefId) {
                        ESQ.cookie("CNSEInfo", urlRefId, {path: '/',domain: ".ly.com"});
                        return urlRefId;
                    } else {
                        return ESQ.cookie("CNSEInfo") || "";
                    }
                }

            },
            getData: function(callback){
                var self = this,
                    url = self.cfg.telUrl;
                common.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: function(data){
                        self.tel = data;
                        callback && callback.call(self,data);
                    }
                })
            },
            addStyle: function(){
                var styleStr = '<style type="text/css">{body}</style>';
                styleStr = styleStr.replace("{body}",".customize span{margin-left: -11px;}.customize{display: none;width: 185px;height: 50px;background: url('http://img1.40017.cn/cn/v/2015/kefu/pic-1_03.png') no-repeat;position: absolute;right: 50px;bottom: 100px;color: #fff;font-size: 14px;text-align: center;line-height: 50px;font-family: 'Microsoft YaHei';}.ui-service span{margin-left:-13px}.ui-service{display: none;width: 185px;height: 50px;background: url('http://img1.40017.cn/cn/v/2015/kefu/pic-1_03.png') no-repeat;position: absolute;right: 50px;bottom: 0;color: #fff;font-size: 14px;text-align: center;line-height: 50px;font-family: 'Microsoft YaHei';}.service{width: 50px;height: 152px;position: fixed;right: 20px;bottom: 160px;z-index: 99999;}.service-kind{display: block;width: 48px;height: 47px;border: 1px solid #e9e9e9;background-color: #fff;margin-top: 1px;overflow:hidden;}.number{display: none;width: 185px;height: 50px;background: url('http://img1.40017.cn/cn/v/2015/kefu/pic-1_03.png') no-repeat;position: absolute;right: 50px;bottom: 48px;color: #fff;font-size: 14px;text-align: center;line-height: 50px;font-family: 'Microsoft YaHei';}.erwei{display: none;width: 141px;height: 169px;background: url('http://img1.40017.cn/cn/v/2015/kefu/pic-2_03.png') no-repeat;position: absolute;right: 50px;bottom: -170px;}.erwei img{padding-left: 10px;padding-top: 10px;}.erwei p{margin-top: 0;margin-bottom: 0;font-size: 14px;color: #fff;font-family: 'Microsoft YaHei';padding-left: 15px;} .service-kind img:hover{  -webkit-animation-name:esq;  -webkit-animation-duration: 1s;  -webkit-animation-timing-function: ease-in-out;  }@-webkit-keyframes esq { 0%{  transform:translate(0);  -webkit-transform: translate(0);  } 50%{  transform:translate(40px);  -webkit-transform: translate(40px);  } 100%{  transform:translate(0);  -webkit-transform: translate(0);  } }");
                document.writeln(styleStr);
            },
            appendEl:function(_cfg){
                var telnum=$(".c_phone").html();
                var parentEl=$(".service"),
                    numLen=$(".number").length,
                    wxLen=$(".erwei").length,
                    dzLen=$(".customize").length,
                    kfLen=$(".ui-service").length;
                if(numLen===0){
                    parentEl.append("<div class='number'>请拨打："+this.tel+"</div>");
                }
                if(wxLen===0){
                    parentEl.append("<div class='erwei'><img src="+_cfg.imgEl+"><p>立刻扫描二维码</p><p>旅游问题全搞定</p></div>");
                }
                parentEl.find(".J_Kefu").attr("href",_cfg.url);
                if(dzLen===0){
                    parentEl.append("<div class='customize'><span>量身定制旅游线路</span></div>");
                }
                if(kfLen===0){
                    parentEl.append("<div class='ui-service'><span>同程在线客服</span></div>");
                }
            },
            render:function(){
                $(".service .service-kind").on("mouseenter",function(){
                    var self=$(this),
                        showEl=self.attr("data-name");
                    if(showEl==="number"){
                        $("."+showEl).css("display","block");
                        window.Monitor && window.Monitor.stat("kefu");
                    }else if(showEl==="erwei"){
                        $("."+showEl).css("display","block");
                    }else if(showEl==="customize"){
                        $("."+showEl).css("display","block");
                    }else if(showEl==="ui-service"){
                        $("."+showEl).css("display","block");
                    }
                });
                $(".service .service-kind").on("mouseleave",function(e){
                    e.preventDefault();
                    var self=$(this),
                        showEl=self.attr("data-name");
                    if(showEl==="number"){
                        $("."+showEl).css("display","none");
                    }else if(showEl==="erwei"){
                        $("."+showEl).css("display","none");
                    }else if(showEl==="customize"){
                        $("."+showEl).css("display","none");
                    }else if(showEl==="ui-service"){
                        $("."+showEl).css("display","none");
                    }
                })
            }

        }
})();
