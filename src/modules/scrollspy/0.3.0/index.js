/**
 * @author 云聪(hk08688@ly.com)
 * @func Scrollspy
 * @desc 滚动监听组件,只支持jquery版本
 * @param cfg {object} 滚动的配置
 * @param cfg.curClass {string} 导航选中效果样式名称
 * @param cfg.contentClass {string} 需要滚动的内容区域
 * @param cfg.topH {number} 内容区域距离顶部的高度
 * @param cfg.scrollFn {Function} 浮层的处理方法,可选,默认是static,滚动刀指定位置才变fixed
 * @version 0.3.0
 * @example usage
 *	$('#ulid a').scrollspy({
 *		curClass:'cur',
 *		contentClass:'.pp',
 *		topH:30
 *	})
 */
    (function () {
        var Scrollspy = function(){};
        Scrollspy.instArr = [];
        Scrollspy.prototype = {
            iscall: {},
            parentCls: "testCls",
            //滚动监听
            autoScroll: function () {
                var self = this;
                $(window).on("scroll", function () {
                    self.calScroll();
                });
            },
            //计算位置
            calScroll: function(){
                var self = this,
                    _con = $(self.contentClass);
                if(!_con.length) return;
                var wH = document.documentElement.scrollTop || document.body.scrollTop,
                    clientHeight = document.documentElement.clientHeight||document.body.clientHeight,
                    ptop = _con.first().offset().top,
                    lastEl = _con.last(),
                    //是否已经超过上边界
                    isAbove = wH + self.topH >= ptop,
                    //是否已经超过下边界
                    isBelow = wH +self.topH >= lastEl.offset().top + lastEl.height(),
                //0为未超过上边界,1为中间,2为超过下边界
                    isDown = isAbove + isBelow;
                if(self.scrollFn){
                    self.scrollFn.call(self,self.parentdiv,isDown);
                }else{
                    switch(isDown) {
                        case 0:
                            self.parentdiv.css({position: "static"});
                            break;
                        case 1:
                            self.parentdiv.css({position: "fixed", display: "block"});
                            break;
                        case 2:
                            self.parentdiv.css({display: "none"});
                            break;
                    }
                }
                self.isDown = isDown;
                if (wH === 0) {
                    self.tabList.removeClass(self.curClass);
                    $(self.tabList[0]).addClass(self.curClass);
                }
                var flag = false;
                _con.each(function(i,elem){
                    var _elem = $(elem),
                        uH_top = _elem.offset().top - (self.topH || 0),
                        elemHeight = self.getElemH && self.getElemH.call(_elem) ||_elem.height(),
                        uH_bot = Math.round(uH_top + elemHeight);
                    //fixed浮点导致的计算有误,所以需要-2
                    if (wH <= uH_top && wH+clientHeight > uH_top|| wH >=uH_top&&wH<uH_bot-2) {
                        if(!flag){
                            if(!self.isTriggerByClick){
                                self.tabList.removeClass(self.curClass);
                                $(self.tabList[i]).addClass(self.curClass);
                            }
                            self.isTriggerByClick = false;
                            flag = true;
                        }
                        self.callback.call(self,$(_con[i]));
                    }
                });
            },
            //点击选中效果
            clickScroll: function(){
                var self = this;
                self.tabList.on("click",function(e){
                    self.tabList.removeClass(self.curClass);
                    $(this).addClass(self.curClass);
                    var uThis = this.tagName.toLowerCase() =="a" ? $(this): $(this).find("a");
                    var tarH = $(uThis.attr("href")).offset().top - (self.topH || 0);
                    var ret = self.callback.call(self,$(uThis.attr("href")));
                    if(!ret){
                        var extraH = 0;
                        self.isTriggerByClick = true;
                        window.scrollTo(0,tarH-extraH);
                    }
                    e.preventDefault();
                });
            },
            //内容异步回调7
            callback: function(el){
                var self = this;
                for(var k in self.arrFn){
                    var target = el,
                        dataRef = target.attr("data-ref"),
                        refEl = dataRef? $(dataRef):target;
                    if((k === target.attr('id') || target.hasClass(k)) && !self.iscall[k]){
                        self.arrFn[k].call(self,refEl,target);
                        self.iscall[k] = true;
                        break;
                    }
                }
            },
            //组装导航内容
            createNav: function(){
                var html = '',self = this,
                    arrCon = $(self.contentClass),
                    index =  arrCon.find("."+self.curClass).index();
                for(var i= 0;i<arrCon.length;i++){
                    var _this = $(arrCon[i]),
                        sid = _this.attr('id'),
                        stxt = _this.attr('data-txt') || _this.find('.nav_tit span').html();
                    if(i===index){
                        if(self.renderNav){
                            html = self.renderNav.call(self,sid,stxt,_this,i);
                        }else{
                            html='<a class="'+self.curClass+'" href="#'+ sid+'">'+ stxt +'</a>';
                        }

                    }else{
                        if(self.renderNav) {
                            html += self.renderNav.call(self,sid,stxt,_this,i);
                        }else{
                            html += '<a href="#' + sid + '">' + stxt + '</a>';
                        }
                    }

                }
                self.nav.html(html);
            },
            _resetOffset: function(){
                var self = this;
                self.ptop = self.contentDiv.offset().top;
            },
            //初始化加载
            _init: function(conf,isRefresh){
                var self = this,
                    cfg;
                if(!conf){
                    cfg = self.cfg;
                }else{
                    cfg = conf;
                }
                self.nav = cfg.el;
                $.extend(self,conf);
                if(isRefresh || !cfg.el.children().length){
                    self.createNav();
                }
                self.getExtraParam(isRefresh);
                if(conf){
                    if(!self.scrollFn){
                        self.createPlaceHolder();
                    }
                    self.calScroll();
                    self.autoScroll();
                    self.clickScroll();
                    self.cfg = cfg;
                }else{
                    self.clickScroll();
                }
            },
            getExtraParam: function(isRefresh){
                var self = this,
                    cfg = self;
                if(isRefresh || !self.tabList){
                    self.tabList = cfg.el.children();
                }
                self.parentdiv = cfg.pClass && $(cfg.pClass) || cfg.el;
                self.contentDiv = $(cfg.contentClass);
                self.ptop = self.contentDiv.offset().top;
            },
            createPlaceHolder: function(){
                var self = this,
                    navH = self.nav.height(),
                    realNavH = navH,
                    el = self.parentdiv;
                if(self.topH == null){
                    self.topH = realNavH;
                }
                var holder = $('<div class="fixed_holder" style="height: '+(realNavH||0)+'px;overflow: hidden;"></div>');
                //要预先加入一个容器，占位高度，否则容器发生悬停后，该位置的高度消息，页面内容往上滚了
                el.after(holder);
                this.placeholder = holder;
            },
            addStyle: function(el){
                var self = this,
                    $el = $(el),
                    parent = $el.parent(),
                    data  = {};
                data.parent = self.parentCls;
                data.el = $el.attr("class").split(" ")[0];
                parent.addClass(self.parentCls);
                parent.height(parent.height());
                var link = document.createElement("style");
                link.rel = "stylesheet";
                link.type = "text/css";
                var tmpl = ".$parent-0 .$el{position:static;display:block;} " +
                    ".$parent-1 .$el .fixed_holder,.$parent-2 .$el .fixed_holder{display:block;}" +
                    ".$parent-0 .$el .fixed_holder{display:none;}" +
                    ".$parent-1 .$el{position:fixed;display:block;} " +
                    ".$parent-2 .$el{position:static;display:none;}";
                link.innerHTML = tmpl.replace(/\$(\w+)\b/g,function($0,$1){
                    return data[$1]||"";
                });
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        };
        Scrollspy.update = function(){
            var instArr = Scrollspy.instArr;
            for(var i = 0, len = instArr.length-1; i<=len; i++){
                //instArr[i]._init(null,true);
            }
        };
        Scrollspy.init = function(cfg){
            var el = this,
                inst = new Scrollspy();
            cfg.el = el;
            Scrollspy.instArr.push(inst);
            inst._init(cfg);
        };
        Scrollspy.resetOffset = function(){
            var instArr = Scrollspy.instArr;
            for(var i = 0, len = instArr.length-1; i<=len; i++){
                instArr[i]._resetOffset();
            }
        };
        Scrollspy.calScroll = function(){
            var instArr = Scrollspy.instArr;
            for(var i = 0, len = instArr.length-1; i<=len; i++){
                instArr[i].calScroll();
            }
        };
        $.extend($.fn,{
            scrollspy: Scrollspy.init
        });
        //导入的方法
        function exportFunc(func,speName){
            if(!speName) {
                alert("导出方法有误,模块名称未定义");
                return;
            }
            var funcName = func.name||(speName&&speName.split("/")[0]);
            "undefined" !== typeof module && module.exports ? module.exports = func : "function" === typeof define ? define(speName,function(){return func;}): window[funcName+"Module"] = func;
        }
        exportFunc({
            resetOffset: Scrollspy.resetOffset,
            calScroll: Scrollspy.calScroll,
            update: Scrollspy.update
        },"scrollspy/0.1.0/index");
    })();

