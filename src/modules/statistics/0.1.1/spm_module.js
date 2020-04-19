(function ($,factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function(){return this}).call();
        root.SPM_HANDLE = factory($);
    }
}(window.jQuery, function ($) {
    var Spm = {
        defcfg : {
            cls : {
                param : "spm",//统计URL参数
                block : "spm-block",//模块统计的类
                blockModeAttr : "spm-bmode",//模块统计的类
                blockAttr : "spm-bvalue",//模块统计的类的值属性
                blockAttred : "spm-bspmed",//已绑定模块统计的类的值属性
                blockPass : "spm-bpass",//传递模块统计的类
                extraAttr : ""
            },
            setBlock : [],
            setBlockPass : []
            /*
             //设定模块绑定器
             setBlock : [{
             cls : ".trgger",//绑定的选择器(唯一)
             value : 1,//模块传递值
             mode : 1//传递方式1：选择器内链接值逐步加1，or选择期内链接值不变
             }],
             //设定模块传递器
             setBlockPass : [".class"]
             */
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

        init : function(cfg){
            var self = this;
            $.extend(true,self.defcfg,cfg);
            //
            self.setBlockCls();
            self.blockid = self.getParam(self.defcfg.cls.param);
            //
            self.eventBind();
        },
        setBlockCls : function(){
            var self = this,
                block = self.defcfg.setBlock,
                blockPass = self.defcfg.setBlockPass,
                cls = self.defcfg.cls,
                i;
            for(i=0;i<block.length;i++){
                $(block[i].cls).addClass(cls.block).attr(cls.blockAttr,block[i].value).attr(cls.blockModeAttr,block[i].mode||'1');
            }
            for(i=0;i<blockPass.length;i++){
                $(blockPass[i]).addClass(cls.blockPass);
            }
        },
        asynPass : function(els){
            //参数els为需绑定传递参数的选择器数组
            var self = this,
                param = self.defcfg.cls.param,
                extraAttr = self.defcfg.cls.extraAttr,
                blockAttred = self.defcfg.cls.blockAttred,
                blockPass = self.defcfg.cls.blockPass,
                i;
            //传递模块内的链接加参数
            if(self.blockid&&els.length>0){
                for(i=0;i<els.length;i++){
                    $(els[i]).each(function(){
                        var Jself = $(this);
                        if(this.tagName.toUpperCase()==="A"){
                            var url = Jself.attr("href");
                            url = self.addParams(url,param,self.blockid);
                            Jself.attr("href",url);
                        }else{
                            Jself.addClass(blockPass);
                            Jself.find("a").not("["+blockAttred+"]").each(function(){
                                var Jme = $(this),
                                    url = Jme.attr("href");
                                url = self.addParams(url,param,self.blockid);
                                Jme.attr("href",url);
                                Jme.attr(blockAttred,true);
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
                block = "."+self.defcfg.cls.block,
                blockModeAttr = self.defcfg.cls.blockModeAttr,
                blockAttr = self.defcfg.cls.blockAttr,
                blockAttred = self.defcfg.cls.blockAttred,
                extraAttr = self.defcfg.cls.extraAttr,
                blockPass = "."+self.defcfg.cls.blockPass;
            //统计模块内的链接加参数
            $(block).each(function(){
                var Jself = $(this),
                    blockid = parseInt(Jself.attr(blockAttr)),
                    blockMode =  parseInt(Jself.attr(blockModeAttr));
                //
                if(this.tagName.toUpperCase()==="A"){
                    var  url = Jself.attr("href");
                    url = self.addParams(url, param, (self.blockid || blockid).toString());
                    Jself.attr("href", url);
                    Jself.attr(blockAttred, true);
                }else {
                    Jself.find("a").not("[" + blockAttred + "]").each(function (index) {
                        var Jme = $(this),
                            url = Jme.attr("href"),
                            _blockid = blockid;
                        if (blockMode === 1) {
                            _blockid  = blockid + index;
                        }
                        url = self.addParams(url, param, (self.blockid || _blockid).toString());
                        Jme.attr("href", url);
                        Jme.attr(blockAttred, true);
                    });
                }
            });
            //有模块id时传递模块内的链接加参数
            if(self.blockid){
                $(blockPass).each(function(){
                    var Jself = $(this);
                    if(this.tagName.toUpperCase()==="A"){
                        var url = Jself.attr("href");
                        url = self.addParams(url,param,self.blockid.toString());
                        Jself.attr("href",url);
                    }else{
                        Jself.find("a").not("["+blockAttred+"]").each(function(){
                            var Jme = $(this),
                                url = Jme.attr("href");
                            url = self.addParams(url,param,self.blockid.toString());
                            Jme.attr("href",url);
                            Jme.attr(blockAttred,true);
                        })
                    }
                });
            }
        }
    }
    return Spm;
}));
