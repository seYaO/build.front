;
(function(win, doc, undefined) {
    var appDownload = {};
    appDownload.init = function() {
        if ($("div[data-dl]").length > 0) {
            fixNav();
        }
    }

    function fixNav() {
        var $nav = $('.filter-wrap').css("position", "relative");
        var $wrap = $nav.wrap("<div class='filter-wrap-box'></div>").parent();
        var isSupport = isSupportSticky();
        $wrap.css("height", $nav.height());
        $("body").css("padding-top", 0);
        $(".pro2").css("margin-top", ".714rem");
        if ($(".hotsearch").length) {
            $(".hotsearch").css("margin-top", 0);
            $(".pro2").css("margin-top", 0);
        }
        if (isSupport) {
            var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
            var stickyText = '';
            for (var i = 0; i < prefixTestList.length; i++) {
                stickyText += 'position:' + prefixTestList[i] + 'sticky;';
            }
            $wrap[0].style.cssText = stickyText + 'top:0;' + 'z-index:99;';
            $("body").css("overflow-x", "auto");
        } else {
            function onScroll(e) {
                win.scrollY >= $wrap[0].offsetTop ? $nav.css("position", "fixed") : $nav.css("position", "relative");
            }

            win.addEventListener('scroll', onScroll);
        }
    }

    function isSupportSticky() {
        var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
        var stickyText = '';
        for (var i = 0; i < prefixTestList.length; i++) {
            stickyText += 'position:' + prefixTestList[i] + 'sticky;';
        }
        // 创建一个dom来检查
        var div = document.createElement('div');
        var body = document.body;
        div.style.cssText = 'display:none;' + stickyText;
        body.appendChild(div);
        var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
        body.removeChild(div);
        div = null;
        return isSupport;
    }

    // win.onload = function(){
    // 	appDownload.init();
    // };
    $(doc).ready(function() {
        appDownload.init();
    });
    //滚动事件监听
    $(win).on('scroll', function() {
        var ST = $(win).scrollTop(),
            $tabBox = $(".nav_wrap"),
            $nav = $tabBox.find("nav");
        if ($tabBox.length < 1 || $nav.length < 1) return;
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            navBarPosition();
        }, 50);
    });
})(window, document);