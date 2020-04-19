function Carousel(elem, options) {
    if (!(this instanceof Carousel)) {
        return new Carousel(elem, options);
    }
    var div, ul, li,
          numVisible, initialItemLength;
    this.running = false;   //是否在轮播
    this.options = options = $.extend({}, Carousel.defaultCfg, options);
    this.animCss = options.vertical ? "top" : "left";  //动画样式
    this.sizeCss = options.vertical ? "height" : "width"; //尺寸样式
    this.div = div = this.elem = $(elem).eq(0); //取第一个div
    this.ul = ul = options.canvas ? div.find(options.canvas) : div.find(">ul:first");
    this.initialLi = options.item ? ul.find(options.item) : ul.find(">li");

    initialItemLength = this.initialLi.size();
    this.numVisible = numVisible = initialItemLength < options.visible ? initialItemLength : options.visible; //可见的滚动项
    if (options.circular) {
        var $lastItemSet = this.initialLi.slice(initialItemLength - numVisible).clone();
        var $firstItemSet = this.initialLi.slice(0, numVisible).clone();

        ul.prepend($lastItemSet)        // Prepend the lis with final items so that the user can click the back button to start with
              .append($firstItemSet);     // Append the lis with first items so that the user can click the next button even after reaching the end

        options.start += numVisible;    // Since we have a few artificial lis in the front, we will have to move the pointer to point to the real first item
    }
    this.ul.wrap('<div class="carousel-ul-wrap"></div>');
    this.wrap = this.div.find(".carousel-ul-wrap");
    this.li = li = options.item ? ul.find(options.item) : ul.find(">li");
    this.itemLength = li.size();
    this.calculatedTo = this.index = options.start;
    this.autoTimeout = null;
    this.auto = options.auto;   //是否是自动轮播
    this.init();
}
/**
 * @desc 返回指定的items
 * @param pre {number}
 * @returns {object jquery}
 */
Carousel.prototype.visibleItems = function (pre) {
    return this.li.slice(this.calculatedTo + (pre < 0 && pre)).slice(0, this.numVisible + (pre > 0 && pre));
};
/**
 * @desc 跳转到指定位置
 * @param to {string}
 * @returns {boolean}
 */
Carousel.prototype.go = function (to) {
    var options = this.options,
          self = this;
    if (!this.running) {
        this._breakAutoScroll();
        this.calculatedTo = to;
        if (options.beforeStart) {   // Call the beforeStart() callback
            options.beforeStart.call(this, this.visibleItems());
        }

        if (options.circular) {      // If circular, and "to" is going OOB, adjust it
            this._adjustOobForCircular(to);
        } else {                    // If non-circular and "to" is going OOB, adjust it.
            this._adjustOobForNonCircular(to);
        }                           // If neither overrides "calculatedTo", we are not in edge cases.
        this.index = this.calculatedTo*options.scroll;
        this._animateToPosition({         // Animate carousel item to position based on calculated values.
            start: function () {
                self.running = true;
                if (options.preload) {
                    self._initImage();
                }
            },
            done: function () {
                if (options.afterEnd) {
                    options.afterEnd.call(this, self.visibleItems());
                }
                if (self.auto) {
                    self._setupAutoScroll();
                }
                self.running = false;
            }
        });

        if (!options.circular) {     // Enabling / Disabling buttons is applicable in non-circular mode only.
            self._disableOrEnableButtons();
        }

    }
    return false;
};
/**
 * @desc 跳转上一个位置
 */
Carousel.prototype.prev = function () {
    return this.go(this.calculatedTo - this.options.scroll);
};
/**
 * @desc 跳转下一个位置
 */
Carousel.prototype.next = function () {
    return this.go(this.calculatedTo + this.options.scroll);
};
/**
 * @desc 开始轮播
 */
Carousel.prototype.start = function () {
    this._setupAutoScroll();
    this.auto = true;
};
/**
 * @desc 停止轮播
 */
Carousel.prototype.pause = function () {
    this._breakAutoScroll();
    this.auto = false;
};
/**
 * @desc 初始化样式
 * @private
 */
Carousel.prototype._initStyles = function () {
    var options = this.options;
    //this.div.css("visibility", "visible");
    this.li.css({
        overflow: "hidden",
        "float": options.vertical ? "none" : "left"
    });
    this.ul.css({
        margin: "0",
        padding: "0",
        position: "relative",
        "list-style": "none",
        "z-index": "1"
    });
    this.wrap.css({
        overflow: "hidden",
        position: "relative",
        "z-index": "2",
        left: "0px"
    });
    // For a non-circular carousel, if the start is 0 and btnPrev is supplied, disable the prev button
    if (!options.circular && options.btnPrev && options.start === 0) {
        $(options.btnPrev).addClass("disabled");
    }
};
/**
 * @desc 初始化尺寸
 * @private
 */
Carousel.prototype._initSizes = function () {
    var options = this.options,
          wrap = this.wrap, ul = this.ul, li = this.li,
          animCss = this.animCss,
          sizeCss = this.sizeCss,
          itemLength = this.itemLength,
          numVisible = this.numVisible,
          liSize, ulSize, divSize;
    this.liSize = liSize = options.vertical ?         // Full li size(incl margin)-Used for animation and to set ulSize
          li.outerHeight(true) :
          li.outerWidth(true);
    this.ulSize = ulSize = this.liSize * itemLength;       // size of full ul(total length, not just for the visible items)
    this.divSize = divSize = this.liSize * numVisible;
    li.css({
        width: li.width(),
        height: li.height()
    });
    ul.css(sizeCss, ulSize + "px")
          .css(animCss, -(this.calculatedTo * liSize));
    wrap.css(sizeCss, divSize + "px");
};
/**
 * @desc 注册事件
 * @private
 */
Carousel.prototype._attachEventHandlers = function () {
    var options = this.options,
          div = this.elem,li = this.li,
          self = this;
    if (options.btnPrev) {
        var prev = $.isFunction(options.btnPrev) ? options.btnPrev.call(div) : $(options.btnPrev,div);
        prev.on("click",function () {
            self.trigger("prevClick");
            return self.prev();
        });
    }
    if (options.btnNext) {
        var next = $.isFunction(options.btnNext) ? options.btnNext.call(div) : $(options.btnNext,div);
        next.on("click",function () {
            self.trigger("nextClick");
            return self.next();
        });
    }
    if(options.btnNav){
        $.each(self.triggerEl, function (i, el) {
            $(el).on("click",function () {
                return self.go(options.circular ? self.numVisible + i : i);
            });
        });
    }
    var initialLi = this.initialLi,index;
    li.on("click",function(){
        index = initialLi.index(this);
        self.trigger("itemClick",index,this,initialLi);
    });
    if (options.mouseWheel && div.mousewheel) {
        div.mousewheel(function (e, d) {
            return d > 0 ?
                  self.prev() :
                  self.next();
        });
    }
    if (self.auto) {
        self.start();
        div.on("mouseover", function () {
            self.pause();
        }).on("mouseout", function () {
            self.start();
        });
    }
};
/**
 * @desc 创建导航
 * @private
 */
Carousel.prototype._createNav = function(){
    var self = this,
          div = self.div,
          initialLi = self.initialLi,
          btnNav = self.options.btnNav,
          numVisible = self.numVisible,
          navClass = self.options.navClass,
          selectedClass = self.options.selectedClass,
          triggerSelector = self.options.triggerSelector;
    if(btnNav){
        var navNum = Math.ceil(initialLi.size()/numVisible);
        var triggerEl = $("." +navClass + " " + triggerSelector,div);
        //如果没有找到事件元素的话则依次查找
        if(triggerEl.size()){
            triggerEl.first().addClass(selectedClass);
        }else{
            var navEl = $("." + navClass,this);
            if(!navEl.size()){
                navEl = $('<ul class="' + navClass + '" style="display:none"></ul>').appendTo(div);
            }
            var navArr = [];
            for(var i=0;i<navNum;i++){
                var str = "";
                if($.isFunction(btnNav)){
                    str += btnNav.call(self,i,initialLi.slice(i*numVisible, i*numVisible +numVisible),initialLi);
                }else{
                    str +='<li class="' + (i===0 ? selectedClass : "") +'">'+ (i + 1) + '</a></li>';
                }
                navArr.push(str);
            }
            navEl.html(navArr.join("")).removeAttr("style");
            triggerEl = navEl.find(triggerSelector);
        }
        self.triggerEl = triggerEl;
    }
};
/**
 * @desc 调整索引
 * @param to
 * @private
 */
Carousel.prototype._adjustOobForCircular = function (to) {
    var options = this.options,
          ul = this.ul,
          liSize = this.liSize,
          numVisible = this.numVisible,
          initialItemLength = this.initialLi.size(),
          itemLength = this.itemLength,
          animCss = this.animCss;
    var newPosition;

    // If first, then goto last
    if (to <= options.start - numVisible - 1) {
        newPosition = to + initialItemLength + options.scroll;
        ul.css(animCss, -(newPosition * liSize) + "px");
        this.calculatedTo = newPosition - options.scroll;

        //console.log("Before - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
    }

    // If last, then goto first
    else if (to >= itemLength - numVisible + 1) {
        newPosition = to - initialItemLength - options.scroll;
        ul.css(animCss, -(newPosition * liSize) + "px");
        this.calculatedTo = newPosition + options.scroll;

        //console.log("After - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
    }
};
/**
 * @desc 调整索引
 * @param to
 * @private
 */
Carousel.prototype._adjustOobForNonCircular = function (to) {
    var itemLength = this.itemLength,
          numVisible = this.numVisible;
    // If user clicks "prev" and tries to go before the first element, reset it to first element.
    if (to < 0) {
        this.calculatedTo = 0;
    }
    // If "to" is greater than the max index that we can use to show another set of elements
    // it means that we will have to reset "to" to a smallest possible index that can show it
    else if (to > itemLength - numVisible) {
        this.calculatedTo = itemLength - numVisible;
    }

    //console.log("Item Length: " + itemLength + "; " +
    //"To: " + to + "; " +
    //"CalculatedTo: " + calculatedTo + "; " +
    //"Num Visible: " + numVisible);
};
/**
 * @desc 滚动方法
 * @param animationOptions
 * @private
 */
Carousel.prototype._animateToPosition = function (animationOptions) {
    var options = this.options,
          ul = this.ul,
          liSize = this.liSize,
          animCss = this.animCss;
    this.running = true;

    ul.animate(
          animCss === "left" ?
          {left: -(this.calculatedTo * liSize)} :
          {top: -(this.calculatedTo * liSize)},

          $.extend({
              duration: options.speed,
              easing: options.easing
          }, animationOptions)
    );
};
/**
 * @desc 继续滚动
 * @private
 */
Carousel.prototype._setupAutoScroll = function () {
    var self = this,
          options = self.options;
    self.autoTimeout = setTimeout(function () {
        self.go(self.calculatedTo + options.scroll);
    }, options.auto);
};
/**
 * @desc  暂停滚动
 * @private
 */
Carousel.prototype._breakAutoScroll = function () {
    clearTimeout(this.autoTimeout);
};
/**
 * @desc 前进后退按钮状态处理
 * @private
 */
Carousel.prototype._disableOrEnableButtons = function () {
    var options = this.options,
          itemLength = this.itemLength,
          numVisible = this.numVisible;
    $(options.btnPrev + "," + options.btnNext).removeClass("disabled");
    $((this.calculatedTo - options.scroll < 0 && options.btnPrev)
          ||
          (this.calculatedTo + options.scroll > itemLength - numVisible && options.btnNext)
          ||
          []
    ).addClass("disabled");
};
/**
 * @desc 预加载
 * @private
 */
Carousel.prototype._initLazyload = function () {
    var li = this.li,
          preloadAttr = this.options.preloadAttr;
    if (this.options.preload) {
        li.find("img").each(function () {
            var self = $(this);
            $.data(this, {"_imgSrc": self.attr(preloadAttr) || self.attr("src")});
            $(this).removeAttr("src");
        });
        this._initImage();
    }
};
/**
 * @desc 加载图片
 * @private
 */
Carousel.prototype._initImage = function () {
    var preload = this.options.preload,
          img = this.visibleItems(preload).find("img");
    img.each(function () {
        var self = $(this),
              imgUrl = self.data("_imgSrc");
        if (!self.attr("src")) {
            self.attr("src", imgUrl);
        }
    });
};
/**
 * @desc 初始化
 */
Carousel.prototype.init = function () {
    this._initStyles();
    this._initSizes();
    this._initLazyload();
    this._createNav();
    this._attachEventHandlers();
};
Carousel.defaultCfg = {
    canvas: null,   //ul元素
    item: null,      //li元素
    btnPrev: null,               // CSS Selector for the previous button
    btnNext: null,              // CSS Selector for the next button
    btnNav: false,                     //是否显示导航
    navClass: "carousel-nav",    //导航容器的className
    selectedClass: "current",      //当前选中的className
    triggerSelector: "li",         //触碰元素的选择器
    mouseWheel: false,          // Set "true" if you want the carousel scrolled using mouse wheel
    auto: null,                 // Set to a numeric value (800) in millis. Time period between auto scrolls

    speed: 200,                 // Set to a numeric value in millis. Speed of scroll
    easing: null,               // Set to easing (bounceout) to specify the animation easing

    vertical: false,            // Set to "true" to make the carousel scroll vertically
    circular: true,             // Set to "true" to make it an infinite carousel
    visible: 3,                 // Set to a numeric value to specify the number of visible elements at a time
    start: 0,                   // Set to a numeric value to specify which item to start from
    scroll: 1,                    // Set to a numeric value to specify how many items to scroll for one scroll event

    beforeStart: null,          // Set to a function to receive a callback before every scroll start
    afterEnd: null,              // Set to a function to receive a callback after every scroll end

    effect: "slide",         //滚动效果 slide fade
    preload: 0,                //预加载
    preloadAttr: "data-img"
};
$.extend($.fn,{
    "carousel": function(options){
        return this.each(function(){
            return new Carousel(this,options);
        });
    }
});
define("jCarousel/0.2.0/index",[],function(require, exports, module){
    module.exports = Carousel;
});
//增加events模块
;(function(){
    var eventSplitter = /\s+/;
    var events = {};
    /*
     @param event{string}
     @param handler{function}
     @param context{object}
     */
    events.on = function(event,handler,context){
        var cache = this.cache || (this.cache = {});
        if(!handler){
            return this;
        }
        var type,names;
        names = event.split(eventSplitter);
        while(type = names.shift()){
            (cache[type] || (cache[type] = [])).push({
                type: type,
                handler: handler,
                context: context
            });
        }
        return this;
    };
    /*
     @param event{string}
     @param handler{function}
     */
    events.off = function(event,handler){
        var cache = this.cache || {};
        //移除所有事件
        if(!event){
            delete this.cache;
            return this;
        }
        var type,names,handlers;
        names = event.split(eventSplitter);
        while(type = names.shift()){
            handlers = cache[type] || [];
            if(handler && $.isFunction(handler)){
                for(var i=0;i<handlers.length;i++){
                    if(handlers[i].handler === handler){
                        handlers.splice(i,1);
                    }
                }
            }else{
                delete cache[type];
            }
        }
        return this;
    };
    /*
     @param name{string}
     */
    events.trigger = function(name){
        var cache = this.cache || {};
        var names,type,event,handlers,
            i = 0,
            result = true;
        names = name.split(eventSplitter);
        while(type = names.shift()){
            //event = new CustEvent(this,type);
            handlers = cache[type] || [];
            for(;i<handlers.length;i++){
                var handlerObj = handlers[i];
                var context = handlerObj.context || this;
                var data = Array.prototype.slice.call(arguments,1);

                //data.unshift(event);
                if(handlerObj.handler.apply(context,data) === false){
                    //event.preventDefault();
                    break;
                }
                //if(event.isDefaultPrevented){
                //    result = false;
                //    break;
                //}
            }
        }
    };
    /*
     @param event{string}
     @param handler{function}
     @param context{object}
     */
    events.once = function(event,handler,context){
        var self = this;
        var originHandler = handler;
        handler = function(){
            originHandler();
            self.off(event,handler);
        };
        this.on(event,handler,context);
        return this;
    };

    events.fire = events.trigger;
    $.extend(Carousel.prototype,events);
})();

