/*from tccdn minify at 2015-4-13 11:52:35,file：/cn/v/public/index.js?v=1111*/
/**
 * 公共方法
 * @authors Elvis.Xia (xlh4909@ly.com)
 * @date    2014-10-29 14:38:02
 * @version $Id$
 */
(function () {
    $(document).ready(function () {
        "use strict";
        (function () {
            $("#submit").bind("click", function () {
                $.ajax({
                    url: XFam.getUrl,
                    data: {
                        lineId: $("#lineId").val() || 0,
                        sub: $("#sub").val() || 0,
                        actId: $("#actId").val() || 0,
                        actSchedule: $("#actSchedule").val() || 0,
                        calType: $("#actType").val() || 0,
                        type: 1
                    },
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        $("#result").val(data.key);
                        var touchUrl = 'http://m.ly.com/dujia/tours/' + $("#lineId").val() + '.html?actType=' + data.key + '&isHot=2';
                        var wxUrl = 'http://wx.17u.cn/ivacation/tours/' + $("#lineId").val() + '.html?ak=' + data.key;
                        var resultBox = $("#actKeyEncryption").find(".result-box");
                        resultBox.empty().append('<div><label>touch: </label><strong style="color:red">' + touchUrl + '</strong></div><br/>');
                        resultBox.append('<div><label>微信: </label><strong style="color:red">' + wxUrl + '</strong></div>');
                    }
                });
            });
        }());
        (function () {
            $("#decsubmit").bind("click", function () {
                $.ajax({
                    url: XFam.decodeUrl2,
                    data: {
                        actKey: $("#decresult").val() || ""
                    },
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        if (data.state == "100") {
                            $("#declineId").val(data.data.lineId);
                            $("#decactId").val(data.data.actId);
                            $("#decactSchedule").val(data.data.actSchedule);
                            $("#decsub").val(data.data.sub);
                            $("#decactType").val(data.data.calType);
                            $("#actKeyDecode .result-tip").html(data.desc);
                        } else {
                            $("#actKeyDecode .result-tip").html(data.desc);
                        }
                    }
                });
            });
        })();
    });
})();
