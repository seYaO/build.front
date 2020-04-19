(function(win){
    function OnePage(){
        var self = this;
        // factory or constructor
        if (!(self instanceof OnePage)) {
            return new OnePage();
        }
    }
    OnePage.prototype = {
        pages: [],
        titleEl: ".page-header h2",
        state: {},
        index: 0,
        callback: [],
        isIOS: /iP(ad|hone|od)/.test(navigator.userAgent),
        go: function(cfg){
            var self = this,
                url = cfg.url||"",
                tag = cfg.title,
                param = cfg.param||{};
            self.index++;
            //alert("go:"+self.index);
            if(self.pages.length < 1){
                self.init();
                self.pages.push({
                    "tag":"main",
                    "url": location.href,
                    "title": self.title()
                });
            }
            if(win.history.pushState){
                win.history.pushState(param,tag||"",url);
            }
            self.forward(cfg);
            self.toggle(cfg);
        },
        redirect: function(){
            this.go.apply(this,arguments);
        },
        /**
         * @private
         * @func get
         * @desc 根据tag生成对应的容器
         * @param tag String 标签名称
         * @returns {*|HTMLElement}
         */
        getEl: function(tag){
            var el = $("#" + tag + "Page");
            if(!el.length) {
                var wrap = $(".page-box");
                wrap.length < 1 && (wrap = $("body"));
                el = $('<div class="page" id="'+tag+'Page"></div>').appendTo(wrap);
            }
            return el;
        },
        init: function(){
            var self = this;
            $(win).on("popstate",function(e){
                self.back();
            });
        },
        off: function(){
            $(win).off("popstate");
        },
        title: function(text){
            var titleEl = $(this.titleEl);
            if(!text){
                return titleEl && titleEl.text()||document.title;
            }
            titleEl && titleEl.text(text);
            //this._title(text);
            OnePage.prototype._title.call(this,text);
        },
        _title: function(text){
            var $body = $('body');
            document.title = text;
        },
        forward: function(cfg){
            var self = this,pages = self.pages,previous,current,tag = cfg.tag,prevCfg;
            prevCfg = pages[pages.length - 1];
            if(prevCfg){
                previous = self.getEl(prevCfg.tag).data("scrollTop", $(win).scrollTop());
                previous.removeClass("current").removeClass("switching");
            }

            current = self.getEl(tag);
            self.title(cfg.title);

            current.css({display: "block"}).addClass("switching");
            $(win).scrollTop(0); // 可以通过动画实现可流畅的效果
            if(!prevCfg || (prevCfg.tag !== cfg.tag)){
                setTimeout(function () {
                    current.addClass("current").css("display","block").removeClass("switching");
                    current.removeAttr("style");
                    if(previous){
                        previous.css({display: "none"});
                    }
                    cfg.afterFunc && cfg.afterFunc.apply(self,arguments);
                }, 200);
            }
        },
        /**
         * @func back
         * @desc 页面后退,在后退事件里调用这个方法
         * @param {Function} callback 回调
         * @returns {boolean}
         */
        back: function(callback){
            var self = this,pages = self.pages,previous,current;
            if(callback){
                self.callback.push(callback);
                history.go(-1);
                return;
            }
            if(self.callback.length){
                callback = self.callback.pop();
            }
            var currentCfg, _page;
            do{
                currentCfg = pages.pop();
                _page = pages[pages.length -1];
            }while(pages.length>1&& currentCfg.url === _page.url &&currentCfg.tag ===_page.tag&&currentCfg.title ===_page.title&&!_page.el);
            if(currentCfg){
                current = self.getEl(currentCfg.tag).removeClass("current").removeClass("switching");
            }
            //alert("back:"+self.index);
            if(!self.index){
                self.off();
                if(currentCfg){
                    history.go(-2);
                }else{
                    history.go(-1);
                }
                return;
            }
            self.index--;
            var prevCfg = pages[pages.length - 1];
            if(!prevCfg) {
                return true;
            }
            previous = self.getEl(prevCfg.tag);
            previous.addClass("current").addClass("switching");
            self.title(prevCfg.title);
            setTimeout(function () {
                if(current) {
                    current.css({display:"none"});
                }
                previous.css({display: "block"});
                $(win).scrollTop(current.data("scrollTop"));
                currentCfg.callback && currentCfg.callback();
                callback && callback();
            }, 200);
        },
        toggle: function(cfg){
            var self = this,
                tag = cfg.tag,
                title = cfg.title,
                pages = self.pages;
            pages.push({
                "tag":tag,
                "title":title,
                url: cfg.url,
                callback: cfg.callback
            });
        }
    };
    module.exports = OnePage();
}(window));
