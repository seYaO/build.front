/**
 * Created by lyf10464 on 2015/8/10.
 */
(function(){

var ESQ;

ESQ = {
    cfg:{
        imgEl:"http://img1.40017.cn/cn/v/2015/kefu/erwei_03.png",
        telUrl: "http://www.ly.com/dujia/ajaxcall.aspx?type=GetTel400"
    },
    tel: "4007-777-777",
    init:function(cfg){
            var self=this,
                defaultCfg=self.cfg;
        ESQ.getRefId();
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
    appendEl:function(_cfg){
        var telnum=$(".c_phone").html();
        var parentEl=$(".service"),
            numLen=$(".number").length,
            wxLen=$(".erwei").length;
        if(numLen===0){
            parentEl.append("<div class='number'>请拨打："+this.tel+"</div>");
        }
        if(wxLen===0){
            parentEl.append("<div class='erwei'><img src="+_cfg.imgEl+"><p>立刻扫描二维码</p><p>旅游问题全搞定</p></div>");
        }
        parentEl.find(".J_Kefu").attr("href",_cfg.url);

    },
    render:function(){
        $(".service .service-kind").on("mouseenter",function(){
            var self=$(this),
                showEl=self.attr("data-name");
            if(showEl==="number"){
                $("."+showEl).css("display","block");
            }else if(showEl==="erwei"){
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
            }
        })
    }
};

//导入的方法
function exportFunc(func,speName){
    if(!speName) {
        alert("导出方法有误,模块名称未定义");
        return;
    }
    var funcName = func.name||(speName&&speName.split("/")[0]);
    "undefined" !== typeof module && module.exports ? module.exports = func : "function" === typeof define ? define(speName,function(){return func;}): win[funcName+"Module"] = func;
}
window.ESQ = ESQ;
exportFunc(ESQ,"esq/0.1.0/pc/index");

})();
