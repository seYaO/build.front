;(function ($) {

    // jQuery marquee 插件
    $.fn.marquee = function (options) {
        // 默认设置
        var defaults = {
            derection: "top",
            interval: 50
        };
        
        // 合并后的参数设置
        var options = $.extend(defaults, options);

        var $mar = $(this),
             original = $mar.children().first(),
             clone = original.clone(),
             height = original.height(),
             width = original.width(),
             i = 0,
             tId = null;  // 唯一的tId，可以通过clearTimeout(tId)清除干净
        
        // append clone to marquee
        $mar.append(clone);

        // scrolltop
        var scrolltop = function () {

            if (i < height) {
                $mar.scrollTop(i++);
            } else {
                i = 0;
                $mar.scrollTop(0);
            }

            tId = setTimeout(scrolltop, options.interval);
        };
        
        // scrollbottom
        var scrollbottom = function () {
            
            if (i === 0) {
                i = height;
                $mar.scrollTop(i);
            } else {
                $mar.scrollTop(i--);
            }

            tId = setTimeout(scrollbottom, options.interval);
        };

        // scrollleft
        var scrollleft = function () {
            
            if (i < width) {
                $mar.scrollLeft(i++)
            } else {
                i = 0;    
                $mar.scrollLeft(0);
            }

            tId = setTimeout(scrollleft, options.interval);
        };

        // scrollright
        var scrollright = function () {
            
            if (i === 0) {
                $mar.scrollLeft(width);
                i = width;
            } else {
                $mar.scrollLeft(i--);
            }

            tId = setTimeout(scrollright, options.interval);
        };

        // scroll to which derection
        var scrollto = {
            top: scrolltop,
            bottom: scrollbottom,
            left: scrollleft,
            right: scrollright
        };
        
        // 根据参数选择滚动函数
        tId = setTimeout(scrollto[options.derection], options.interval);

        // when mouse hover clearTimeout or setTimeout
        $mar.hover(function () {
            clearTimeout(tId);
        }, function () {
            tId = setTimeout(scrollto[options.derection], options.interval);
        });
    };
})(jQuery);