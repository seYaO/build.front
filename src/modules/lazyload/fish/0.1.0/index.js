/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.5
 *
 */
(function(fish,window,document){
    var $window = fish.one(window),
        sysWebp;

    function lazyload(options) {
        var self = this;
        checkSysWebp(function(){
            lazyFunc.call(self,options);
        })
    };
    function checkSysWebp(callback){
        if(sysWebp != null){
            callback();
        }else{
            var img = new Image();
            img.onload = img.onerror = function(){
                sysWebp = (img.height == 2);
            };
            callback();
            img.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        };
    }
    function lazyFunc(options){
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 1,
            event: "scroll",
            effect: "",
            container: window,
            data_attribute: true,
            appear: null,
            css: "",
            load: null
        };
        function isVisible($elem){
            var display = fish.getCss.call($elem,"display");
            var visible = fish.getCss.call($elem,"visible");
            return (!(display === "none" || visible === "hidden"));
        }
        function update(){
            var counter = 0;

            elements.each(function(a,i) {
                var $this = fish.one(this);
                if (settings.skip_invisible && !isVisible($this)) {
                    return;
                }
                if (fish.abovethetop(this, settings) ||
                    fish.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!fish.belowthefold(this, settings) &&
                    !fish.rightoffold(this, settings)) {
                    event.trigger($this,"appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }
        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            fish.lang.extend(settings, options);
        }
        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
        settings.container === window) ? $window : fish.all(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function(event) {
                return update();
            });
        }
        $container.on("addElements",function(){
            var args = arguments;
            elements = elements.add(Array.prototype.slice.call(args,1));
            bindEvent(elements);
            update();
        });
            function isSysSupportWebp(){
                if(sysWebp != undefined) return sysWebp;
                var ua = navigator.userAgent;
                if(/uc|chrome|android/i.test(ua)){
                    sysWebp = true;
                    return true;
                }
                sysWebp = false;
                return sysWebp;
            }
            function isImgSupportWebp(imgUrl){
                return imgUrl.indexOf("pic3.40017.cn")>-1;
            }
        function bindEvent(els){
            els.each(function() {
                var self = this;
                var $self = fish.one(self);
                if(!$self.data(settings.data_attribute) && self.src){
                    $self.data(settings.data_attribute,self.src);
                    self.src = '';
                    $self.addClass('lazyload-img');
                    //$self.css("background: url(http://img1.40017.cn/cn/comm/images/cn/public/transparent_loading_v2.gif?v=20140417) center no-repeat;");
                }
                self.loaded = false;

                /* When appear is triggered load original image. */
                event.on($self,"appear",function(){
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        var imgSrc = $self.attr("data-" + settings.data_attribute) || $self.data(settings.data_attribute);
                        if(isSysSupportWebp()&&isImgSupportWebp(imgSrc)){
                            imgSrc+=".webp";
                        }
                        function complete(self){
                            var $self = self;
                            (function($self){
                                $self
                                    .attr("src" ,imgSrc)
                                    .attr("onerror","Monitor.log(this.src,'image')")
                                    .css("opacity:0")
                                    .css(settings.css);
                                //if(settings.effect){
                                //    $self[settings.effect](settings.effect_speed);
                                //}else{
                                    $self.anim("opacity:1");
                                //}
                                self.loaded = true;
                                $self.attr("data-img-loaded","true");
                                /* Remove image from array so it is not looped next time. */
                                var temp = [];
                                elements.each(function(element) {
                                    if(!element.loaded){
                                        temp.push(element);
                                    }
                                });
                                elements = fish.all(temp);

                                //$self.removeAttr("data-"+settings.data_attribute);

                                if (settings.load) {
                                    var elements_left = elements.length;
                                    settings.load.call(self, elements_left, settings);
                                }
                            })($self);
                        }
                        fish.create("<img />")
                            .on("error",function(e){
                                //console.log(this.getAttribute("src"));
                            })
                            .on("load", function() {
                                complete.call(this,$self);
                            })
                            .on("complete",function(){
                                complete.call(this,$self);
                            })
                            .attr("src",imgSrc);
                    }
                },1);

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (0 !== settings.event.indexOf("scroll")) {
                    $self.on(settings.event, function(e) {
                        if (!self.loaded) {
                            event.trigger($self,"appear");
                        }
                    });
                }
            });
        }

        bindEvent(this);
        /* Check if something appears when window is resized. */
        $window.on("resize", function(event) {
            update();
        });

        /* With IOS5 force loading img when navigating with back button. */
        /* Non optimal workaround. */
        //if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
        //    $window.on("pageshow", function(event) {
        //        if (event.originalEvent.persisted) {
                //event = event.originalEvent || event;
                //if (event.persisted) {
                //    elements.each(function() {
                //        $(this).trigger("appear");
                //    });
                //}
            //});
        //}

        /* Force initial check if img should appear. */
        fish.ready(function(){
            update();
        });

        return this;
    }
    fish.extend({
        "lazyload": lazyload
    });
    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    fish.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window[0].scrollY;
        } else {
            fold = fish.all(settings.container).offset().top + fish.all(settings.container).height();
        }

        return fold <= fish.all(element).offset().top - settings.threshold;
    };

    fish.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window[0].scrollX;
        } else {
            fold = fish.all(settings.container).offset().left + fish.all(settings.container).width();
        }

        return fold <= fish.all(element).offset().left - settings.threshold;
    };

    fish.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window[0].scrollY;
        } else {
            fold = fish.all(settings.container).offset().top;
        }

        return fold >= fish.all(element).offset().top + settings.threshold  + height(fish.all(element));
    };

    fish.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window[0].scrollX;
        } else {
            fold = fish.all(settings.container).offset().left;
        }

        return fold >= fish.all(element).offset().left + settings.threshold + width(fish.all(element));
    };

    fish.inviewport = function(element, settings) {
        return !fish.rightoffold(element, settings) && !fish.leftofbegin(element, settings) &&
            !fish.belowthefold(element, settings) && !fish.abovethetop(element, settings);
    };

    //简易版发布订阅
    var event = {
        uid: 1,
        guid: (function(){return fish.guid();})(),
        cache: {},
        on: function(elem,type,handler,one){
            var that = this,
                guid = that.guid,
                cache = that.cache;
            fish.all(elem).each(function(){
                var uid = this[guid];
                var handleObj;
                if(!uid){
                    uid = this[guid] = that.uid++;
                }
                handleObj = {
                    type: type,
                    handler: handler,
                    uid: uid
                };
                if(!cache[uid]){
                    cache[uid] = {};
                    cache[uid][type] = [handleObj];
                }else{
                    cache[uid][type].push(handleObj);
                }
                if(!handler.uid){
                    handler.uid = that.uid++;
                }
                if(one === 1){
                    var originHandler = handler;
                    handler = function(event){
                        originHandler.apply(this,arguments);
                        originHandler.uid = handler.uid;
                        that.off(this,type);
                    };
                    fish.lang.extend(handleObj,{handler: handler});
                }
            });
        },
        off: function(elem,type){
            var that = this,
                guid = that.guid,
                cache = that.cache;
            fish.all(elem).each(function(){
                var uid = this[guid];
                delete cache[uid][type];
            });
        },
        trigger: function(elem,type){
            var that = this,
                guid = that.guid,
                cache = that.cache;
            fish.all(elem).each(function(){
                var uid = this[guid];
                var events = cache[uid][type] || [];
                for(var i = 0;i<events.length;i++){
                    events[i].handler.call(this);
                }
            });
        }
    };

    var getStyles = function(elem){
        if(window.getComputedStyle){
            return window.getComputedStyle( elem, null );
        }else if(document.documentElement.currentStyle){
            return elem.currentStyle;
        }
    }
    function height(elem){
        var ret = elem.height();
        if(ret <=0){
            ret = getStyles(elem[0]).height;
        }
        if(ret <=0 || ret == null){
            ret = elem[0].style.height;
        }
        return parseFloat(ret) || 0;
    }
    function width(elem){
        var ret = elem.width();
        if(ret <=0){
            ret = getStyles(elem[0]).width;
        }
        if(ret <=0 || ret == null){
            ret = elem[0].style.width;
        }
        return parseFloat(ret) || 0;
    }
})(fish,window,document);
