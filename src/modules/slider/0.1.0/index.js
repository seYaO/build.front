/**
 * @desc jquery滚动插件
 * @opt {object}
 */
define("slider/0.1.0/index",[],function(){
    return function(){
        (function(){
            $.fn.slide = function(opt){
                opt = $.extend({
                    speed : "fast",
                    interval: 5000,
                    nav: true,
                    event: "mouseover"
                },opt || {});
                return this.each(function(){
                    var $div = $(this);
                    var $li = $("li",$div);
                    var index = 0;
                    var lastIndex = 0;
                    var num = $li.size();
                    var event = opt.event;
                    var timer = null;
                    var play = function(i){
                        $li.eq(i).css("opacity",1);
                        $li.eq(lastIndex).animate({opacity: 0},opt.speed,function(){
                            $li.eq(i).css("zIndex",11).siblings().css("zIndex",10);
                            index = i;
                            lastIndex = index;
                        });
                        if(opt.nav){
                            $num.find("a").eq(i).addClass("slide-num-active").siblings().removeClass("slide-num-active");
                        }
                    };
                    var auto = function(){
                        clearInterval(timer);
                        timer = window.setInterval(function(){
                            index++;
                            index > num - 1 && (index = 0);
                            play(index);
                        },opt.interval);
                    };
                    $li.css({zIndex: 10,opacity: 0});
                    $li.eq(index).css({zIndex: 11,opacity: 1});
                    if(opt.nav){
                        var ary = [];
                        var $num = $("<div/>").addClass("slide-num-box");
                        for(var i=0;i<$li.size();i++){
                            var str = "";
                            if($.isFunction(opt.nav)){
                                str = opt.nav.call(this,i,$li[i],$li);
                            }else{
                                str = "<a href='#'>" + (i+1) +"</a>";
                            }
                            ary.push(str);
                        }
                        $num.html("<div class='slide-num'>" + ary.join("") + "</div>");
                        $num.insertAfter($div);
                        $num.find("a").each(function(){
                            $(this).on(event,function(e){
                                e.preventDefault();
                                var i = $(this).index();
                                if(i === index) {
                                    return;
                                }
                                play($(this).index());
                            });
                        }).eq(0).addClass("slide-num-active");
                    }
                    $($div).parent().hover(
                        function(){
                            clearInterval(timer);
                        },
                        function(){
                            auto();
                        }
                    );
                    auto();
                });
            };
        })();
    };
});

