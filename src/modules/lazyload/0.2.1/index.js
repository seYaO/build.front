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
function main(jQuery){
    (function($, window, document, undefined) {
        var $window = $(window),
            sysWebp;

        $.fn.lazyload = function(options){
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
            }
        }
        function lazyFunc(options) {
            var elements = this;
            var $container;
            var settings = {
                threshold       : 0,
                failure_limit   : 0,
                event           : "scroll", //触发方式
                effect          : "",  //出现的动画效果  可配置 fadeIn 等。
                container       : window,
                data_attribute  : "original", //默认的data属性
                skip_invisible  : true,  //是否跳过display为none的
                appear          : null,
                css             : {}, //{opacity : 0}
                load            : null
            };

            function update() {
                var counter = 0;

                elements.each(function() {
                    var $this = $(this);
                    if (settings.skip_invisible && $this.css("display") === "none") {
                        return;
                    }
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                        /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
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

                $.extend(settings, options);
            }

            /* Cache container as jQuery as object. */
            $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

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
                    var $self = $(self);

                    if(!$self.data(settings.data_attribute) && self.src){
                        $self.data(settings.data_attribute,self.src);
                        self.src = '';
                        $self.addClass('lazyload-img');
                    }
                    self.loaded = false;

                    /* When appear is triggered load original image. */
                    $self.one("appear", function() {
                        if (!this.loaded) {
                            if (settings.appear) {
                                var elements_left = elements.length;
                                settings.appear.call(self, elements_left, settings);
                            }
                            var imgSrc = $self.data(settings.data_attribute);
                            if(isSysSupportWebp()&&isImgSupportWebp(imgSrc)){
                                if (!/.webp/.test(imgSrc)) {
                                    imgSrc += ".webp";
                                }
                            }
                            $("<img />")
                                .on("error",function(e){
                                    //console.log(this.getAttribute("src"));
                                })
                                .on("load complete", function() {
                                    (function($self){
                                        $self.hide().attr({src:(imgSrc)})
                                            .css(settings.css);
                                        if(settings.effect){
                                            $self[settings.effect](settings.effect_speed);
                                        }else{
                                            $self.css({"display":"block","opacity":1});
                                        }
                                        self.loaded = true;
                                        $self.attr("data-img-loaded","true");
                                        /* Remove image from array so it is not looped next time. */
                                        var temp = $.grep(elements, function(element) {
                                            return !element.loaded;
                                        });
                                        elements = $(temp);

                                        //$self.removeAttr("data-"+settings.data_attribute);

                                        if (settings.load) {
                                            var elements_left = elements.length;
                                            settings.load.call(self, elements_left, settings);
                                        }
                                    })($self);
                                })
                                .attr("src",imgSrc);
                        }
                    });

                    /* When wanted event is triggered load original image */
                    /* by triggering appear.                              */
                    if (0 !== settings.event.indexOf("scroll")) {
                        $self.on(settings.event, function(event) {
                            if (!self.loaded) {
                                $self.trigger("appear");
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
            if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
                $window.on("pageshow", function(event) {
                    // if (event.originalEvent.persisted) {
                    event = event.originalEvent || event;
                    if (event.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }

            /* Force initial check if img should appear. */
            $(window).on("load", function() {
                update();
            });

            return this;
        };

        /* Convenience methods in jQuery namespace.           */
        /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
        $.belowthefold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.height() + $window[0].scrollY;
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height();
            }

            return fold <= $(element).offset().top - settings.threshold;
        };

        $.rightoffold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window[0].scrollX;
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width();
            }

            return fold <= $(element).offset().left - settings.threshold;
        };

        $.abovethetop = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window[0].scrollY;
            } else {
                fold = $(settings.container).offset().top;
            }

            return fold >= $(element).offset().top + settings.threshold  + $(element).height();
        };

        $.leftofbegin = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window[0].scrollX;
            } else {
                fold = $(settings.container).offset().left;
            }

            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };

        $.inviewport = function(element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };

        /* Custom selectors for your convenience.   */
        /* Use as $("img:below-the-fold").something() or */
        /* $("img").filter(":below-the-fold").something() which is faster */

        $.extend($.fn, {
            "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
            "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
            "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
            /* Maintain BC for couple of versions. */
            "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
        });
    })(jQuery, window, document);
}
"function" === typeof define ? define("lazyload/0.2.1/index",[],function(){return main(jQuery);}) : main(jQuery);