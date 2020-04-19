//#region 弹出窗口
/// <reference path="jquery-1.4.4.js" />

var Dialog = {};
Dialog.sysWindows = function (p) {
    var params = {
        width: 908,
        height: 430,
        content: null,
        title: "",
        scollTop: Dialog.getScrollTop(),
        onClose: function () { }
    };
    $.extend(params, p);
      var winTop = $(window).height();
      var realTop = Math.ceil((winTop - 430)/2) + params.scollTop;
    try {
        var css_index_mask = 9000;
        if ($("div.rhDialog_sys_mask").length != 0) {
            css_index_mask = $("div.rhDialog_sys_mask.first").css("z-index") + 2;
            $("div.rhDialog_sys_mask.first").removeClass("first").addClass("second");
        };
        // mask
        var dom_div_mask = $("<div></div>").addClass("rhDialog_sys_window_mask first").css({
            "width": "100%",
            "height": document.body.clientHeight,
            "display": "block",
            "position": "absolute",
            "top": "0",
            "left": "0",
            "background-color": "#000",
            "opacity": "0.7",
            "z-index": css_index_mask
        }).click(function () {
            $(this).remove();
            dom_div_panel.remove();
        });
        // main panel
        var dom_div_panel = $("<div></div>").addClass("rhDialog_sys_window_panel").css({
            "margin": "0 0 0 -" + params.width / 2 + "px",
            "width": params.width + "px",
            "height": params.height + "px",
            "display": "block",
            "position": "absolute",
            "top": realTop + "px",
            "left": "50%",
            "background-color": "#fff",
            "border": "4px solid #f0f0f0",
            "z-index": (css_index_mask + 1)
        });
        // close
        var dom_a_close = $("<a href='javascript:void(0);'></a>").css({
            "position": "absolute",
            "top": "9px",
            "background": "url(//img1.40017.cn/cn/v/2015/newdetails/dialog-close.png)",
            "right": "10px",
            "width": "19px",
            "height": "19px",
            "display":"inline-block"
        }).click(function () {
            params.onClose();
            dom_div_mask.remove();
            dom_div_panel.remove();
            $("div.rhDialog_sys_mask.second").removeClass("second").addClass("first");
        });

        var dom_h3 = $("<h3></h3>").css({
            "height": "40px",
            "line-height": "40px",
            "font-size": "18px",
            "color": "#7ab91e",
            "padding-left":"20px"
        }).append(params.title,dom_a_close);
        // content
        var dom_div_content = $("<div></div>").addClass("rhDialog_sys_window_panel").css({
            "width": params.width + "px",
            "display": "block",
            "background-color": "#fff"
        });
        //if (params.content.length > 0) {
        //    if (typeof (params.content) == "object") {
        //        $(dom_div_content).empty().append(params.content.prop("outerHTML"));
        //    }
        //    $(dom_div_content).children().css({ "display": "block" });
        //}
        if (typeof (params.content) == "object") {
            $(dom_div_content).empty().append(params.content.prop("outerHTML"));
        } else {
            $(dom_div_content).empty().append(params.content);
        }
        $(dom_div_content).children().css({ "display": "block" });

        dom_div_panel.append(dom_h3, dom_div_content);
        var dom_body = Dialog.getTopWindowDOM().document.body;
        $(dom_body).prepend(dom_div_mask, dom_div_panel);

    } catch (ex) { };
};

Dialog.getScrollTop=function(){
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
Dialog.getTopWindowDOM = function () {
    var pw = window;
    while (pw != pw.parent) {
        pw = pw.parent;
    }
    return pw;
}
//#endregion

