//邮轮搜索页埋点统计
;
(function(win, doc) {
    //埋点事件
    function searchTrackEvent(sLabel, sValueObj, actionStr) { //考虑不全，新加一个字段actionStr
        var sActionStr = actionStr || "/cruises/list";
        //因为汉字无需URI编码 故还原回去
        sValueObj.k && (sValueObj.k = decodeURIComponent(sValueObj.k));
        sValueObj.ct && (sValueObj.ct = decodeURIComponent(sValueObj.ct));
        if (!sLabel || !sLabel.trim()) return false;
        // console.log(sLabel,sValueObj);
        if (!sLabel || !sLabel.trim()) return false;
        //添加一个定位的城市Id 页面逻辑其实用不到 只是为了埋点统计所加
        // sValueObj.locCId = $("#hidCityId").val();
        var str = "";
        for (key in sValueObj) {
            if (sValueObj[key] !== null && sValueObj[key] !== undefined && sValueObj[key] !== "") {
                str += "|*|" + key + ":" + sValueObj[key];
            }
        }
        try {
            str.length > 0 && (str = str + "|*|");
            // console.log(sLabel,str);
            _tcTraObj._tcTrackEvent("search", sActionStr, sLabel, str);
        } catch (e) {
            // console.log(e);
        }
    }

    String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        }
        //有些埋点统计需要在刷新页面之后做处理 所以需要借助sessionStorage
    function trackEventUseSessionStorage(option) {
        var g = {
            type: 1,
            lable: "",
            value: {}
        };
        $.extend(true, g, option);
        var seName = g.lable.replace(/\//g, "_");
        switch (g.type) {
            case 1:
                sessionStorage.setItem(seName, 1);
                break;
            case 2:
                if (sessionStorage.getItem(seName) == 1) {
                    sessionStorage.removeItem(seName);
                    searchTrackEvent(g.lable, g.value);
                }
                break;
            case 3:
                if (sessionStorage.getItem(seName) == 1) {
                    sessionStorage.removeItem(seName);
                    searchTrackEvent(g.lable.replace(/^\/homeToSearch/i, ""), g.value, "/cruises/homepage");
                }
                break;
        }
    }

    //生成GUID
    function guidGenerator() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }


    //热搜词点击
    $(".route-list > a").each(function(i, elem) {
        this.index = i;
        $(elem).on("click", function(evt) {
            var $this = $(this);
            searchTrackEvent("/sbox/k/hot", {
                k: encodeURIComponent($this.html()),
                pos: this.index + 1,
                // locCId : $("#hidCityId").val(),
                //cityId : $("#StartcityId").val(),
                jpTp: 1
            });
        });
    });
    $(".hotsearch dd a").on("click", function(evt) {
        var $this = $(this);
        searchTrackEvent("/sbox/k/hot", {
            k: encodeURIComponent($this.html()),
            pos: $this.index() + 1,
            // locCId : $("#hidCityId").val(),
            //cityId : $("#StartcityId").val(),
            jpTp: 1
        });
    });

    //进入详情页
    $(".pro2").on("click", "a", function(evt) {
        //evt.stopPropagation();
        var $this = this;
        searchTrackEvent("/detail", {
            pos: $(this).attr("_asIndex") - 0,
            k: encodeURIComponent($("#dest").val()),
            // locCId : $("#hidCityId").val(),
            pjId: "2007",
            //cityId : $("#StartcityId").val(),
            resId: $(this).attr("_lineId")
        });

        //详情显示事件前置事件
        trackEventUseSessionStorage({
            lable: "/show"
        });
    });


    $(".filter-sort a").on("click", function() {
        //排序统计
        searchTrackEvent("/sort", {
            k: encodeURIComponent($("#dest").val())
                // locCId : $("#hidCityId").val()
        });
    });

    //搜索过滤统计
    $(".filter-wrap").on("click", ".filter-sub .fsub-btn>a.btn-submit,.filter-dropdown .filter-line a,.filter-ships .fs-right a", function(evt) {
        trackEventUseSessionStorage({
            lable: "/filter"
        });
    });

    module.exports = {
        searchTrackEvent: searchTrackEvent,
        trackEventUseSessionStorage: trackEventUseSessionStorage
    }
})(window, document);