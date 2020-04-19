/**
 * @author 李伟(lw00575@ly.com)
 * @func Scrollspy
 * @desc 滚动监听组件,只支持jquery版本
 * @param cfg {object} 滚动的配置
 * @param cfg.curClass {string} 导航选中效果样式名称
 * @param cfg.contentClass {string} 需要滚动的内容区域
 * @param cfg.topH {number} 内容区域距离顶部的高度
 * @version 0.1.0
 * @example usage
 *	$('#ulid a').scrollspy({
 *		curClass:'cur',
 *		contentClass:'.pp',
 *		topH:30
 *	})
 */
define("scrollspy/0.1.0/index",["googleMap/0.1.0/index"],function(require,exports,module) {

    (function ($) {
        var map = require("googleMap/0.1.0/index");
        var maps;
        var Scrollspy = function(){};
        Scrollspy.instArr = [];
        Scrollspy.prototype = {
            iscall: {},
            //滚动监听
            autoScroll: function (mapData) {
                var self = this;
                maps = mapData;
                $(window).on("scroll", function () {
                    self.calScroll(maps);
                });
            },
            //计算位置
            calScroll: function(mapData){
                var self = this,
                    _con = $(self.contentClass);
                if(mapData!== undefined){
                    maps = $(mapData);
                }
                if(!_con.length) return;
                var wH = document.documentElement.scrollTop || document.body.scrollTop,
                    clientHeight = document.documentElement.clientHeight||document.body.clientHeight,
                    ptop = _con.first().offset().top,
                    lastEl = _con.last(),
                    placeHolder = $("#scrollSpyPlaceholder"),
                    isAbove = wH + self.topH > ptop,
                    isBelow = wH + self.topH >= lastEl.offset().top + lastEl.height(),
                    isDown = isAbove + isBelow,
                    isScrollDown = true;

                if(self._lastScrollTop && wH<self._lastScrollTop) {
                    isScrollDown = false;
                }
                self._lastScrollTop = wH;

                if(self.scrollFn){
                    self.scrollFn.call(self,self.parentdiv,isDown);
                }else{
                    switch(isDown){
                        case 0: self.parentdiv.css({position:"static"});placeHolder.hide();break;
                        case 1: self.parentdiv.css({position:"fixed",display:"block"});placeHolder.show();break;
                        case 2: self.parentdiv.css({display:"none"});placeHolder.hide();break;
                    }
                }
                if (wH === 0) {
                    self.liAll.removeClass(self.curClass);
                    $(self.liAll[0]).addClass(self.curClass);
                }
                var flag = false;
                _con.each(function(i,elem){
                    var _elem = $(elem),
                        uH_top = _elem.offset().top - (self.topH || 0),
                        elemHeight = self.getElemH && self.getElemH.call(_elem) ||_elem.height(),
                        uH_bot = Math.round(uH_top + elemHeight);
                    if (wH <= uH_top && wH+clientHeight > uH_top|| wH >=uH_top&&wH<uH_bot) {
                        if(!flag){
                            // update margin top of container for overflow
                            var originMarginTop = parseInt(self.parentdiv.css('marginTop'));
                            var deltaHeightUp = wH-$(self.liAll[i]).offset().top;
                            var deltaHeightDown = wH+clientHeight-$(self.liAll[i]).offset().top-$(self.liAll[i]).height();
                            if(isScrollDown && isAbove && deltaHeightDown<0) {
                                self.parentdiv.css({
                                    marginTop: originMarginTop+deltaHeightDown+'px'
                                });
                            }
                            if((!isScrollDown) && isAbove && deltaHeightUp>0) {
                                self.parentdiv.css({
                                    marginTop: originMarginTop+deltaHeightUp+'px'
                                });
                            }

                            if($(self.liAll[i]).hasClass("J_side-tripDay")){
                                if(!$(self.liAll[i]).hasClass(self.curClass)){
                                    if($(".ui-map")&&$(".ui-map").hasClass("ui-fixed")){

                                        map.scrollEvent(maps,i);
                                    }
                                }
                            }
                            self.liAll.removeClass(self.curClass);
                            $(self.liAll[i]).addClass(self.curClass);
                            flag = true;
                        }

                        self.callback.call(self,$(_con[i]));

                    }

                });
            },
            //点击选中效果
            clickScroll: function(mapData){
                var self = this;

                self.liAll.on("click",function(e){
                    self.liAll.removeClass(self.curClass);
                    var uThis = this.tagName.toLowerCase() =="a" ? $(this): $(this).find("a");
                    if($(uThis).hasClass("J_side-tripDay")){
                        if(!$(uThis).hasClass(self.curClass)){
                            if($(".ui-map")&&$(".ui-map").hasClass("ui-fixed")){
                                if(mapData!== undefined){
                                    maps = $(mapData);
                                }
                                map.scrollEvent(maps,$(uThis).index());
                                self.mapData = maps;
                            }
                        }
                    }
                    uThis.addClass(self.curClass);
                    var tarH = $(uThis.attr("href")).offset().top - (self.topH || 0);
                    self.callback.call(self,$(uThis.attr("href")));
                    window.scrollTo(0,tarH);
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
                    if(k === target.attr('id') && !$.trim(refEl.html()) && !self.iscall[k]){
                        self.arrFn[k].call(self,refEl,target);
                        self.iscall[k] = true;
                        break;
                    }
                }
            },
            //组装导航内容
            createNav: function(){
                var html = '',self = this;
                for(var i= 0,arrCon=$(self.contentClass);i<arrCon.length;i++){
                    var _this = $(arrCon[i]),
                        sid = _this.attr('id'),
                        stxt = _this.attr('data-txt') || _this.find('.nav_tit span').html();
                    if(i===0){
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
            _init: function(conf){
                var self = this,
                    cfg;
                if(!conf){
                    cfg = self.cfg;
                }else{
                    cfg = conf;
                }
                self.nav = cfg.el;
                self.contentClass = cfg.contentClass;
                self.renderNav = cfg.renderNav;
                self.createNav();
                self.liAll = cfg.el.children();
                self.parentdiv = cfg.pClass && $(cfg.pClass) || self.liAll.parent();
                self.contentDiv = $(cfg.contentClass);
                self.ptop = self.contentDiv.offset().top;
                self.curClass = cfg.curClass;
                self.topH = cfg.topH||0;
                self.arrFn = cfg.arrFn;
                self.scrollFn = cfg.scrollFn;
                self.getElemH = cfg.getElemH;
                self.mapData = cfg.mapData;
                if(conf){
                    self.calScroll(self.mapData);
                    self.autoScroll(self.mapData);
                    self.clickScroll(self.mapData);
                    self.cfg = cfg;
                }else{
                    self.clickScroll(self.mapData);
                }
            }
        };
        Scrollspy.update = function(){
            var instArr = Scrollspy.instArr;
            for(var i = 0, len = instArr.length-1; i<=len; i++){
                instArr[i]._init();
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
        module.exports = {
            resetOffset: Scrollspy.resetOffset,
            calScroll: Scrollspy.calScroll,
            update: Scrollspy.update
        };
    })(jQuery);
});

