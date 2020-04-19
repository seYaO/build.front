/*
 * 度假公共搜索部分的代码
 */
var StartEvent = {};
StartEvent = {
    init: function () {
        this.initEve();
    },
    initEve: function () {
        var self = this;
        /**hover 热门目的地**/
        $(".destination_b").on("mouseover", function () {
            $(".destination_b").addClass("destination_b_hover");
            $("#hotdestinatpop").css("display", "block");
        }).on("mouseout", function () {
            $(".destination_b").removeClass("destination_b_hover");
            $("#hotdestinatpop").css("display", "none");
        });

        /***出发城市***/
        $("#city_select").on("click", function () {
            $("#popcountry").css("display", "none");
            $(".countrybox").removeClass("city_b_hover");
            $(this).toggleClass("city_b_hover");
            if ($(this).hasClass("city_b_hover")) {
                $("#popleave").css("display", "block");
            } else {
                $("#popleave").css("display", "none");
            }
        });
        /*
        *点击热门目的地，触发的事件
        */
        $(".topBox").on("click", function (e) {
            var uTar = e.target;
            if (uTar.tagName.toUpperCase() == "A" && $(uTar.parentNode).hasClass("hotcity_box")) {
                var formcity = $(uTar).html();
                $("#searchinput").val(formcity);
                seachfun();
            }
        });
        /*搜索hover*/
        $("#searchsub").on('mouseover', function () {
            $(this).addClass("sub_hover");
        }).on('mouseout', function () {
            $(this).removeClass("sub_hover");
        });
        /***点击热门城市页面的变化**/
        $(".leavecity a").on("click", function () {
            var thishot = $(this).html(),
                thisid = $(this).attr("cityid"),
                attrUrl = $("#city_select").attr("attrurl");

            if (attrUrl == "0") {
                return;
            }
            $("#city_select strong").html(thishot);
            self.changHotCity(thisid, attrUrl);
            $("#popleave").css("display:none");
            $("#city_select").removeClass("city_b_hover");
        });
        self.reSetTrigger();
    },
    reSetTrigger: function() {
        var self = this;
        $('.city_top .city_bix').hover(function () {
            $(this).addClass("city_bix_hove");
        },function () {
            $(this).removeClass("city_bix_hove");
        });

        $('.list_content .list_info').hover(function () {
            $(this).addClass("list_info_hover");
        },function () {
            $(this).removeClass("list_info_hover");
        });

        /**hover 热门目的地**/
        $("div.show_list").each(function (index, evenDom) {
            var effectDom;
            $("div.list_info").each(function () {
                if ($(evenDom).attr("effect_index") === $(this).attr("effect_index")) {
                    effectDom = this;
                }
            });
            if (effectDom && (!$(effectDom).attr("noeffect"))) {
                $(effectDom).on("mouseover", function () {
                    if ($(effectDom).hasClass(" bor_non")) {
                        $(effectDom).css("border-bottom: none;padding-bottom: 18px;");
                    }
                    self.calculateFn(evenDom, effectDom);
                    $(evenDom).css("display", "block");
                }).on("mouseout", function () {
                    if ($(effectDom).hasClass(" bor_non")) {
                        $(effectDom).css("border-bottom: none;padding-bottom: 18px");
                    }
                    $(evenDom).css("display", "none");
                });
            }
        });
    },
    /*
    * 热门目的地，effect方法下，计算定位坐标的子方法
    */
    calculateFn: function (e, c) {
        var t, l;
        if (c) {
            t = $(c).offset().top;
            l = $(c).offset().left + $(c).width() + 1;
            if (fish.browser("ms", 6)) {
                l = l - 1;
            }
            $(e).css("top:" + t + "px;left:" + l + "px;");
        }
    },
    /*
    *   变更出发城市，触发的方法
    */
    changHotCity: function (cityId, urlobj) {
        var self = this;
        if (!cityId || !urlobj || urlobj == "0" || cityId == "") {
            return;
        }
        if (self.changeObj) {
            self.changeObj.abort();
        }
        self.changeObj = $.ajax({
            url: urlobj,
            dataType: "jsonp",
            data: "&cityid=" + cityId,
            success: function (data) {
                var datastr_1 = data.split("@")[1] == "0" ? "" : data.split("@")[1],
                    datastr_2 = data.split("@")[2] == "0" ? "" : data.split("@")[2],
                    datastr_0 = data.split("@")[0] == "0" ? "" : data.split("@")[0];
                $("#hotdestinatpop").html(datastr_0);
                $("#searchinput").val(datastr_1);
                $("#searchinput").attr("attrvalu", datastr_1);
                $(".hotcity_box").html(datastr_2);
                self.reSetTrigger();
            }
        });
    }
};
module.exports = StartEvent;
