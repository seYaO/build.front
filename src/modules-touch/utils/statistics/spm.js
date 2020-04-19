/**
 * Created by zy10746 on 2015/10/12.
 */
(function($){
    window.SPM_MODULE = {
        defcfg : {
            cls : {
                param : "moduleid",//统计URL参数
                module : "spm-module",//模块统计的类
                block : "spm-block",//模块统计的类(索引不变)
                moduleattr : "data-spm",//模块统计的类的值属性
                moduleattred : "data-spmed",//已绑定模块统计的类的值属性
                deliver : "spm-deliver"//传递模块统计的类
            },
            moduleid : "",
            module : [],
            block : [],
            /*
             module : [{
             cls : ".trgger",
             value : 1
             }],
             deliver : [".class"]
             */
            deliver : []
        },
        init : function(cfg){
            var self = this;
            $.extend(true,self.defcfg,cfg);
            //
            self.addTrigger();
            self.moduleid = self.getParam(self.defcfg.cls.param);
            //
            self.eventBind();
        },
        //获取参数
        getParam : function(name){
            var url = window.location.href,
                reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
                rec1 = reg.exec(url);
            if(rec1){
                return rec1[2];
            }else{
                return "";
            }
        },
        //添加参数
        addParams : function(url,name,value){
            url = url.replace(/(^\s*)|(\s*$)/g, "");
            var urlRep =/javascript:/i;
            if(urlRep.test(url)){
                return url;
            }
            var reg = new RegExp("[\?&]("+name+"=([^&#$]*))","i"),
            //查找url中是否包含正赋值参数
                rec1 = reg.exec(url),
            //查找url中是否包含哈希
                rec2 = url.split("#"),
                param = name+"="+value,
                ret = url;
            if(rec1){
                ret = url.replace(rec1[1],name+"="+rec1[2]);
            }else{
                if(/\?/g.test(url)) {
                    if(rec2.length>1){
                        ret = rec2[0]+"&"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"&"+ param;
                    }
                }else{
                    if(rec2.length>1){
                        ret = rec2[0]+"?"+ param +"#"+ rec2[1];
                    }else{
                        ret = rec2[0]+"?"+ param;
                    }
                }
            }
            return ret;
        },
        //todo统计数值方式
        transChar : function(char){
            //
        },
        addTrigger : function(){
            var self = this,
                module = self.defcfg.module,
                deliver = self.defcfg.deliver,
                cls = self.defcfg.cls,
                i;
            for(i=0;i<module.length;i++){
                $(module[i].cls).addClass(cls.module).attr(cls.moduleattr,module[i].value);
            }
            for(i=0;i<deliver.length;i++){
                $(deliver[i]).addClass(cls.deliver);
            }
        },
        asynBind : function(cfg){
            //cfg = [".class"]
            var self = this,
                param = self.defcfg.cls.param,
                i;
            //传递模块内的链接加参数
            if(self.moduleid){
                for(i=0;i<cfg.length;i++){
                    $(cfg[i]).each(function(){
                        var Jself = $(this);
                        if(this.tagName.toUpperCase()==="A"){
                            //
                            var url = Jself.attr("href");
                            url = self.addParams(url,param,self.moduleid.toString());
                            Jself.attr("href",url);
                        }else{
                            //
                            Jself.find("a").each(function(){
                                var Jme = $(this),
                                    url = Jme.attr("href");
                                url = self.addParams(url,param,self.moduleid.toString());
                                Jme.attr("href",url);
                            })
                        }
                    });
                }
            }
        },
        //事件绑定
        eventBind : function(){
            var self = this,
                param = self.defcfg.cls.param,
                moduleCls = "."+self.defcfg.cls.module,
                blockCls = "."+self.defcfg.cls.block,
                moduleAttr = self.defcfg.cls.moduleattr,
                moduleAttred = self.defcfg.cls.moduleattred,
                deliverCls = "."+self.defcfg.cls.deliver;
            //统计模块内的链接加参数
            $(moduleCls).each(function(){
                var Jself = $(this),
                    moduleid = Jself.attr(moduleAttr);
                //
                Jself.find("a").not("["+moduleAttred+"]").each(function(index,index1){
                    var Jme = $(this),
                        url = Jme.attr("href");
                    //hack fish.js
                    if(typeof(index)=='object'){
                        index = index1;
                    }
                    url = self.addParams(url,param,(self.moduleid||(parseInt(moduleid)+parseInt(index))).toString());
                    Jme.attr("href",url);
                    Jme.attr(moduleAttred,true);
                });
            });
            //统计模块内的链接加参数(索引不变)
            $(blockCls).each(function(){
                var Jself = $(this),
                    moduleid = Jself.attr(moduleAttr);
                //
                Jself.find("a").not("["+moduleAttred+"]").each(function(index,index1){
                    var Jme = $(this),
                        url = Jme.attr("href");
                    //hack fish.js
                    if(typeof(index)=='object'){
                        index = index1;
                    }
                    url = self.addParams(url,param,(self.moduleid||parseInt(moduleid)).toString());
                    Jme.attr("href",url);
                    Jme.attr(moduleAttred,true);
                });
            });
            //传递模块内的链接加参数
            if(self.moduleid){
                $(deliverCls).each(function(){
                    var Jself = $(this);
                    if(this.tagName.toUpperCase()==="A"){
                        //
                        var url = Jself.attr("href");
                        url = self.addParams(url,param,self.moduleid.toString());
                        Jself.attr("href",url);
                    }else{
                        //
                        Jself.find("a").each(function(){
                            var Jme = $(this),
                                url = Jme.attr("href");
                            url = self.addParams(url,param,self.moduleid.toString());
                            Jme.attr("href",url);
                        })
                    }
                });
            }
        }
    };
    //$(document).ready(function(){
    //    SPM_MODULE.init({
    //        module : [{
    //            class : "table",
    //            value : 1
    //        }]
    //    });
    //})
    
})(window.jQuery||window.Foto||window.Zepto)