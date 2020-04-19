var burying = require('./_burying.js');
var utility = require("../../../utils/cruise.utility.js");

! function($, win, doc) {
    var searchObj = searchObj || {};
    $.extend(searchObj, {
        init: function() {
            this.historyObj.draw();
            this.bindEvent();
        },
        bindEvent: function() {
            var that = this,
                $history = $(".search-history"),
                $rs = $(".search-rs"),
                $input = $("#Cruisedest"),
                $clearAllBtn = $(".search-history>a"),
                $clearOneBtn = $(".search-history>ul>li>a:last-child"),
                $hisItemBtn = $(".search-history>ul>li>a:first-child"),
                $hisTtemBtnOther = $(".module-route .route-histroy").next().find("a"),
                $clearTextBtn = $(".search-ipt>a.search-clear"),
                $route = $(".module-route"),
                $backBtn = $(".search-ipt>a.search-back"),
                $roueteMore = $(".module-more"),
                $formSubmit = $("#searchPage form");
            $input.unbind("click.searchObj focus.searchObj input.searchObj")
                .bind("click.searchObj focus.searchObj", function() {
                    var $this = $(this),
                        val = $.trim($this.val());
                    if (val.length) {
                        $history.addClass("none");
                        $route.addClass("none");
                        $roueteMore.addClass("none");
                        $rs.removeClass("none");
                        $clearTextBtn.removeClass("none");
                    } else {
                        $history.removeClass("none");
                        $route.addClass("none");
                        $roueteMore.addClass("none");
                        $rs.addClass("none");
                        $clearTextBtn.addClass("none");
                    }
                    that.historyObj.draw();
                })
                .bind("input.searchObj", function() {
                    var $this = $(this),
                        val = $this.val();
                    //这个替换方法在iphone下会有粘连的问题 故去掉
                    //val=$.trim($this.val()).replace(/[/\\~!@#$%^&*_\={}\[\];:'"\|,.<>?！￥……——｛｝【】；：‘“’”、《》，。、？]/g,"");
                    // $(this).val(val);
                    if (val.length) {
                        $history.addClass("none");
                        $rs.removeClass("none");
                        $clearTextBtn.removeClass("none");

                        // searchObj.done(val);
                        searchObj.done(encodeURIComponent(val));
                    } else {
                        $history.removeClass("none");
                        $rs.addClass("none");
                        $clearTextBtn.addClass("none");
                    }
                });

            $backBtn.unbind("click.searchObj")
                .bind("click.searchObj", function() {
                    page.close();
                });
            $clearTextBtn.unbind("click.searchObj")
                .bind("click.searchObj", function() {
                    $input.val("").trigger("input");
                    $input.focus();
                });
            $(doc).unbind("click.searchObj")
                .bind("click.searchObj", function(e) {
                    var $tar = $(e.target),
                        flag = true;
                    if (!($tar && $tar[0])) flag = false;
                    if ($tar.hasClass("search-ipt") || $tar.hasClass("search-history")) flag = false;
                    if ($tar.parents(".search-ipt").length || $tar.parents(".search-history").length) flag = false;
                    if (flag) {
                        $history.addClass("none");
                        $rs.addClass("none");
                        $route.removeClass("none");
                        $roueteMore.removeClass("none");
                    }
                });
            $clearAllBtn.unbind("click.searchObj")
                .bind("click.searchObj", function() {
                    that.historyObj.del.call(that.historyObj);
                    that.initHistoryFn();
                    $input.focus();
                });
            $clearOneBtn.unbind("click.searchObj")
                .bind("click.searchObj", function() {
                    that.historyObj.del.call(that.historyObj, this);
                    that.initHistoryFn();
                    $input.focus();
                    setTimeout(function() {
                        $history.removeClass("none");
                        $route.addClass("none");
                        $roueteMore.addClass("none");
                    }, 0);
                });

            $route.find("#routeList>a")
                .unbind("touchstart.searchObj mousedown.searchObj touchcancel.searchObj touchend.searchObj mouseup.searchObj click.searchObj")
                .bind("touchstart.searchObj mousedown.searchObj", function() {
                    $(this).addClass("act");
                }).bind("touchcancel.searchObj touchend.searchObj mouseup.searchObj", function() {
                    $(this).removeClass("act");
                }).bind("click.searchObj", function() {
                    var url = "/youlun/SaveSearchStatisticalJson.html?PageType={0}&SpecialType={1}&TypeValue={2}&Url={3}&Remark={4}",
                        $this = $(this);
                    $.ajax({
                        url: url.format("FuzzySearchPage", "RecommendSearch", "RecomandClick", decodeURIComponent($this.attr("href")), decodeURIComponent($.trim($this.text())))
                    });
                });
            $rs.find("a").unbind("click.searchObj")
                .bind("click.searchObj", function(evt) {
                    var url = "/youlun/SaveSearchStatisticalJson.html?PageType={0}&SpecialType={1}&TypeValue={2}&Url={3}&Remark={4}",
                        $this = $(this);
                    $.ajax({
                        url: url.format("FuzzySearchPage", "WordsSearch", "DestClick", decodeURIComponent($this.attr("href")), decodeURIComponent($.trim($this.attr("attr-text"))))
                    });

                    //搜索下拉点击
                    burying.searchTrackEvent("/sbox/ac/click", {
                        k: encodeURIComponent($("#Cruisedest").val()),
                        ct: encodeURIComponent($this.html()),
                        pos: $this.index() - 0 + 1,
                        // locCId : $("#hidCityId").val(),
                        //cityId : $("#StartcityId").val(),
                        pjId: "2007",
                        jpTp: 1
                    });
                });
            $hisItemBtn.unbind("click.searchObj")
                .bind("click.searchObj", function(evt) {
                    var url = "/youlun/SaveSearchStatisticalJson.html?PageType={0}&SpecialType={1}&TypeValue={2}&Url={3}&Remark={4}",
                        $this = $(this);
                    $.ajax({
                        url: url.format("FuzzySearchPage", "WordsSearch", "DestClick", decodeURIComponent($this.attr("href")), decodeURIComponent($.trim($this.attr("attr-text"))))
                    });
                    //搜索历史记录
                    burying.searchTrackEvent("/sbox/k/history", {
                        k: encodeURIComponent($this.html()),
                        pos: $this.index() - 0 + 1,
                        // locCId : $("#hidCityId").val(),
                        //cityId : $("#StartcityId").val()
                        jpTp: 1
                    });
                });
            $hisTtemBtnOther.unbind("click.searchObj").bind("click.searchObj", function(evt) {
                var $this = $(this);
                burying.searchTrackEvent("/sbox/k/history", {
                    k: encodeURIComponent($this.html()),
                    pos: $this.index() - 0 + 1,
                    // locCId : $("#hidCityId").val(),
                    //cityId : $("#StartcityId").val()
                    jpTp: 1
                });
            });
            $roueteMore.unbind("click.searchObj")
                .bind("click.searchObj", function() {
                    var url = "/youlun/SaveSearchStatisticalJson.html?PageType={0}&SpecialType={1}&TypeValue={2}&Url={3}&Remark={4}",
                        $this = $(this);
                    $.ajax({
                        url: url.format("FuzzySearchPage", "RecommendSearch", "RecomandClick", decodeURIComponent($this.find("a").attr("href")), decodeURIComponent("更多热门搜索"))
                    });
                });


            //只是为了做统计 也是醉了
            $formSubmit.unbind("submit.tracEventStic")
                .bind("submit.tracEventStic", function(evt) {
                    //搜索框关键字统计前置事件
                    burying.trackEventUseSessionStorage({
                        lable: "/sbox/k"
                    });
                });
        },
        done: function(term) {
            var that = this;
            if (!(term && typeof term === "string")) return false;
            if (this.done.timer) clearTimeout(this.done.timer);
            this.done.timer = setTimeout(function() {
                if (that.done.ajaxObj) that.done.ajaxObj.abort();

                that.done.ajaxObj = $.ajax({
                    url: getUrl(term, "/youlun/CruiseFuzzyQueryJson.html"),
                    dataType: "json",
                    success: function(data) {
                        $(".search-rs").empty();
                        if (data && data["SegmentationInfos"] && data["SegmentationInfos"][0]) {
                            that.draw(data["SegmentationInfos"], term);
                        } else {
                            //触发下拉列表提示(目前只要记结果为0的)
                            burying.searchTrackEvent("/sbox/ac", {
                                k: term,
                                // locCId : $("#hidCityId").val(),
                                //cityId : $("#StartcityId").val(),
                                rc: 0
                            });
                        }
                    }
                })
            }, 1000 * 0.2);
        },
        draw: function(data, term) {
            term = decodeURIComponent(term || "");

            function escapeRegex(value) {
                return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            }

            var matcher = new RegExp(escapeRegex(term || ""), "ig");
            var str = "";
            $.map(data || [], function(item, index) {
                str += "<a href='{0}' {2}>{1}</a>".format(
                    getRealUrl(item), item.Name.replace(matcher, "<span>" + term + "</span>"), "attr-id='" + item.Id + "' attr-text='" + item.Name + "'"
                );
            });
            $(".search-rs").empty().html(str);
            this.bindEvent();
        },
        historyObj: {
            add: function(val) {
                var data = this.get(),
                    index = true;
                $.each(data, function(i, item) {
                    if ($.trim(item) === $.trim(val)) {
                        index = false;
                        return false;
                    }
                });
                if (index) {
                    data.push(val);
                    index = data.length - 6;
                    index = index > 0 ? index : 0;
                    data = data.slice(index, index + 6);
                    win.localStorage.setItem("TC-Search-History", data.join(","));
                }
            },
            del: function() {
                var elem = $(arguments[0]),
                    data;
                if (elem && elem[0]) {
                    data = this.get() || [];
                    elem = $.trim(elem.parent().attr("attr-text") || "");
                    elem = data.indexOf(elem);
                    if (elem > -1) {
                        data.splice(elem, 1);
                        win.localStorage.setItem("TC-Search-History", data.join(","));
                    } else win.localStorage.removeItem("TC-Search-History");
                } else win.localStorage.removeItem("TC-Search-History");
                this.draw();
            },
            draw: function() {
                var str = "",
                    temp = "<li {3}><a href='{0}' {3}>{1}</a><a href='{2}'></a></li>",
                    data;
                data = this.get() || [];
                data = data.reverse();
                if (data && data[0]) {
                    $.map(data, function(item, index) {
                        str += temp.format(
                            getUrl(item, "/youlun/CruiseSearchList.html"), item, "javascript:;", "attr-text='" + item + "'"
                        );
                    });
                    $(".search-history>a").html("清除历史记录");
                } else {
                    $(".search-history>a").html("暂无历史记录");
                };


                $(".search-history>ul").empty().append($(str));
                searchObj.bindEvent();
                return str;
            },
            get: function() {
                var data = win.localStorage;
                if (!data) {
                    console.error("searchObj>historyObj>draw:当前浏览器不支持本地存储");
                    return null;
                }
                data = data.getItem("TC-Search-History");
                return data && typeof data === "string" ? data.split(",") : [];
            }
        },
        initHistoryFn: function() {
            //初始化历史记录
            var historyData = searchObj.historyObj.get();
            if (historyData.length) {
                $(".module-route .route-histroy").removeClass("none").next().removeClass("none");
                $(".module-route .route-histroy").next().empty();
                utility.forEach(historyData.reverse(), function(index, item) {
                    $(".module-route .route-histroy").next().append("<a href='/youlun/CruiseSearchList.html?Cruisedest=" + encodeURIComponent(item) + (utility.getUrlParam("lid") ? "&lid=" + utility.getUrlParam("lid") : "&lid=76") + "'>" + item + "</a>")
                });
                searchObj.bindEvent();
            } else {
                $(".module-route .route-histroy").addClass("none").next().addClass("none");
            }
        }
    });

    function getRealUrl(item) {
        function parIntFn(str) {
            str = parseInt(str, 10);
            return isNaN(str) ? -1 : str < 0 ? 0 - 1 : str;
        }

        var str = "/youlun/cruise-line-{0}-{1}-{2}-{3}-{4}-{5}-{6}-{7}-{8}-1.html",
            arr = [0, 0, 0, 0, 0, 0, 0, 0, 0],
            index = parIntFn(item["Type"]);
        if (index != -1) {
            arr[index] = item["Id"];
            str = str.format.apply(str, arr) + "?lid=" + (utility.getUrlParam('lid') || "76");
        } else {
            str = getUrl(item["Text"], "/youlun/CruiseSearchList.html");
        }
        return str;
    }


    function getUrl(term, suffix) {
        var routeStr = $("#hidRootNode").val() || "",
            lid = utility.getUrlParam('lid') || "76",
            str, _str;

        function reg(val) {
            return new RegExp("(^|&)" + val + "=([^&]*)(&|$)");
        }

        term = term && typeof term === "string" && term[0] ? encodeURIComponent($.trim(term)) : "";
        suffix = suffix && typeof suffix === "string" && suffix[0] ? suffix : "";

        str = routeStr + suffix;
        _str = str.match(reg('lid'));
        if (lid != null && _str != null) {
            _str = _str[2];
            str = str.replace("lid=" + _str, "lid=" + lid);
        } else if (lid != null && _str == null) {
            str += (str.indexOf("?") > -1 ? "&" : "?") + 'lid=' + lid;
        }
        _str = str.match(reg('Cruisedest'));
        if (_str != null) {
            _str = _str[2];
            str = str.replace("Cruisedest=" + _str, "Cruisedest=" + decodeURIComponent(term));
        } else if (_str == null) {
            str += (str.indexOf("?") > -1 ? "&" : "?") + 'Cruisedest=' + decodeURIComponent(term);
        }
        return str;
    }

    $(document).ready(function() {
        searchObj.init();

        $("#Cruisedest").val("").trigger("focus").trigger("input");
        $("body").trigger("click");
        searchObj.initHistoryFn();
    })

    module.exports = searchObj;
}(Zepto, window, window.document);