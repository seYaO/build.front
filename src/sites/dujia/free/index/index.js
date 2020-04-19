require('./tpackage').init();
(function(F) {
    window.Holidayindex = window.Holidayindex || {};
    var One = F.one,
        All = F.all,
        host = window.location.host,
        href = window.location.href,
        refid = "";

    F.admin.config({
        mSlider: {
            v: "0.4.3",
            css: 1,
            g: 2014102899
        }
    });

    F.ready(function() {
        init();
        Holidayindex.HotList();
        Holidayindex.resizeWindowEvent();
        Holidayindex.setStartCity();
        //Holidayindex.changcity();
        Holidayindex.pagejump();
    });
    Holidayindex.pagejump = function() {
        if (host === "www.tongcheng.com" && (href.toLowerCase().lastIndexOf(
                "#refid") > -1)) {
            refid = F.cookie.get("17uCNRefId");
            try {
                var number = refid.lastIndexOf("&SEF");
                refid = "#" + refid.substring(0, number).toUpperCase();
            } catch (e) {
                refid = "";
            }
        }
        All("a", F.dom(".citylistbox dd")).on("click", function(e) {
            var newwindow = window.open();
            F.preventDefault(e);
            newwindow.location.href = One(this).attr("href") + refid;
        });
        All("a", One(".iv_full_screen_slider_con")).on("click", function(e) {
            var newwindow2 = window.open();
            F.preventDefault(e);
            newwindow2.location.href = One(this).attr("href") + refid;
        });
        All("a", One(".iv_favorable_slider")).on("click", function(e) {
            var newwindow3 = window.open();
            F.preventDefault(e);
            newwindow3.location.href = One(this).attr("href") + refid;
        });
        All("a", One(".shortline")).on("click", function(e) {
            if (One(this).attr("href").lastIndexOf(".com") > -1) {
                var newwindow5 = window.open();
                F.preventDefault(e);
                newwindow5.location.href = One(this).attr("href") +
                refid;
            }
        });
        All("a", One(".longline")).on("click", function(e) {
            if (One(this).attr("href").lastIndexOf(".com") > -1) {
                var newwindow6 = window.open();
                F.preventDefault(e);
                newwindow6.location.href = One(this).attr("href") +
                refid;
            }
        });
        All("a", One(".themebox")).on("click", function(e) {
            var newwindow7 = window.open();
            F.preventDefault(e);
            newwindow7.location.href = One(this).attr("href") + refid;
        });
        One(".preselbox").delegate(".presellist a", "click", function(e) {

            var _this = F.one(e.delegateTarget);
            var t = One(_this);
            var newwindow4 = window.open();
            F.preventDefault(e);
            newwindow4.location.href = t.attr("href") + refid;
        });
    }

    Holidayindex.calcSale = function() {
        var mprice = "",
            tcprice = "",
            swzk = "";
        All(".countzk").each(function(elem) {
            mprice = One(this).attr("mprice");
            tcprice = One(this).attr("tcprice");
            swzk = Math.round(parseInt(tcprice, 10) * 100 / parseInt(
                mprice, 10)) / 10;
            if (swzk > 9.9) {
                swzk = 9.9;
            }
            One(this).html(swzk + "<em>折</em>");
        });
    }

    Holidayindex.HotList = function() {

        All("div.showlist").each(function(evenDom) {

            var effectDom;
            All(".listbox").each(function() {
                if (One(evenDom).attr("effect_index") === One(this)
                        .attr("effect_index"))
                    effectDom = this;
            });
            if (effectDom && (!One(effectDom).attr("noeffect"))) {
                One(evenDom).effect({
                    type: "hover",
                    elem: effectDom,
                    interFn: function() {
                        One(effectDom).addClass("listboxH");
                        One("img", effectDom).attr("src", One("img",
                            effectDom).attr("attr-imageh"));

                        if (One(effectDom).hasClass("bottdiv")) {
                            One(effectDom).css(
                                "border-color:#8ab923; border-top:1px solid #8ab923;margin-top:-1px;"
                            );
                        }

                        calculateFn(evenDom, effectDom);
                    },
                    outerFn: function() {
                        One(effectDom).removeClass("listboxH");
                        One("img", effectDom).attr("src", One("img",
                            effectDom).attr("attr-image"));

                        if (One(effectDom).hasClass("bottdiv")) {
                            One(effectDom).css(
                                "border-color:#8ab923;border-top:none; margin-top:0;"
                            );
                        }
                    }
                });
            }
        });

        function calculateFn(e, c) {
            var t, l, Visual_h, hidd_h;
            if (c) {
                if (F.browser("ms") || F.browser("moz")) {
                    hidd_h = document.documentElement.scrollTop;

                } else {
                    hidd_h = document.body.scrollTop;
                }
                var _tmp = One(All(".listbox")[0]).offset().top,
                    thisNode = One(c),
                    thisIndex = thisNode.attr("effect_index");
                t = thisNode.offset().top - _tmp + (thisIndex === "0" ? 0 :
                    1);
                // l = One(c).offset().left - 53;

                var hoverboxS = One(c).offset().top - hidd_h;
                var windowH = One(window).height();
                var boxtopH = _tmp - hidd_h;
                if (windowH - hoverboxS < One(e).height()) { //往下展开不够时进入  40
                    t = windowH - (One(".hotbox").offset().top - hidd_h) -
                    One(e).height() - 34;
                    if (t < 0) {
                        t = 0;
                    }
                }



                One(e).css("margin-top:" + t + "px;");
            }
        }
    }
    /**
     * 设置页面的样式
     */
    Holidayindex.resizeWindowEvent = function() {
        var windowWth = One(document).width();

        if (One(window).width() < 1200 && One(window).width() > 0) {
            if (!One("#conter").hasClass("Small_conter")) {
                All("#conter").addClass("Small_conter");
            }
        } else if (One("#conter").hasClass("Small_conter")) {
            All("#conter").removeClass("Small_conter");
        }


    }
    /**
     * 设置页面的幻灯
     * @param {Object} obj 参数对象
     * @param {String} obj.canvas 画图区域
     * @param {String} obj.content 显示内容
     */
    /*Holidayindex.setSlider = function(obj) {

        One(obj.parentElem).mSlider({
            canvas: obj.canvas,
            content: obj.content,
            aniType: "fade",
            arrowTheme: "sunny",
            moveTime: "5000",
            autoScroll: true,
            fn: function() {
                var _this = this,
                    len;
                len = parseInt(All(_this.content).length);
                (len <= 1) && (One(".mSlider_nav_orange", One(obj.parentElem))
                    .html("remove"));
            }
        });

    }

    Holidayindex.setSlider({
        parentElem: "#ivFavorableCon",
        canvas: "#ivFavorableCon .iv_favorable_slider",
        content: "#ivFavorableCon .iv_favorable_slider  .iv_favor_slider_list"
    });*/
    /**
     * 设置页面的tab
     * @param {Object} obj 参数对象
     * @param {String} obj.tab_tray 切换板块
     * @param {String} obj.content 切换内容
     */
    Holidayindex.setTab = function(obj) {
        One(obj.parentElem).mTab({
            tab_tray: obj.tab,
            normal: obj.normal,
            replace: obj.replace,
            content: obj.content
        });
    }


    // 超低价预售title日期的处理
    Holidayindex.setLowPriceDate = function() {
        One(".preseltab").addClass("none");

        var preselTab = All(".preseltab li"),
            strHtml = "",
            bookDate = [], //剔除重复数据前
            uniqueDate = []; //剔除重复数据后

        preselTab.each(function(item) {
            var child = One(this).children("a").html(),
                date = new Date(child.split("-")[0] + "/" + child.split(
                    "-")[1] + "/1");
            var json = {
                dom: child.split("-")[0] + "年" + child.split("-")[1] +
                "月",
                date: date
            };
            bookDate.push(json);
        });
        //排序
        bookDate.sort(function(a, b) {
            return a.date - b.date;
        });

        for (var i = 0; i < bookDate.length; i++) {
            uniqueDate.push(bookDate[i].dom);
        }
        uniqueDate.setArrayDataUnique();

        for (var i = 0; i < uniqueDate.length; i++) {
            if (i == 0) {
                strHtml += "<li class='on'>" +
                "<a attr-list='" + i + "' href='javascript:void(0)'>" +
                uniqueDate[i] + "</a>" +
                "</li>"
            } else {
                strHtml += "<li>" + "<a attr-list='" + i +
                "' href='javascript:void(0)'>" + uniqueDate[i] + "</a>" +
                "</li>"
            }
        }
        One(".preseltab").removeClass("none");
        One(".preseltab").html("");
        One(".preseltab").html(strHtml);
    }
    //出发城市设置
    Holidayindex.setStartCity = function() {
        var baseUrl = One("#baseUrl").val(),
            leaveCity = All(".leavecity a");

        leaveCity.on("click", function() {
            var _this = One(this),
                val = _this.html(),
                citypv = _this.attr("citypy");
            One("#city_select strong").html(val);
            window.location.href = baseUrl + citypv + "/";
        });

    }

    Holidayindex.getFirstAndLastMonthDay = function(year, month) {
        var firstdate = year + '-' + month + '-01';
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate(); //获取当月最后一天日期
        return lastdate;
    }
    Holidayindex.setTab({
        parentElem: ".longline",
        tab: ".longul",
        normal: 'nor',
        replace: 'on',
        content: ".longlinelist"
    });
    Holidayindex.setTab({
        parentElem: ".shortline",
        tab: ".longul",
        normal: 'nor',
        replace: 'on',
        content: ".longlinelist"
    });

    /**
     * 设置动画
     * @param {Element} elem 动画节点
     * @param {Number} up   向上偏移量
     * @param {Number} down 向下偏移量
     */


    Holidayindex.setAnimate = function(elem, up, down) {
        All(elem).hover(function() {
            One(this).anim("margin-top:" + up + "px;");
        }, function() {
            One(this).anim("margin-top:" + down + "px;");
        });
    }


    // 跟团游尾货甩卖
    Holidayindex.setAnimate(".iv_favor_list", 10, 20);
    //游玩主题
    Holidayindex.setAnimate(".themebox a", -10, 0);
    //出境长线游
    Holidayindex.setAnimate(".longboxr dl", 6, 16);

    /**
     * 超低价预售异步
     * @param {Object} obj 参数对象
     * @param {String} obj.tab_tray 切换板块
     * @param {String} obj.showbox 切换内容
     */

    Holidayindex.tabajaxFun = function(showbox, t) {
        function loading(el){
            fish.one(el).addClass("loading");
        }
        function unloading(el){
            fish.one(el).removeClass("loading");
        }
        if (One(showbox).html() === "") {
            var attData = One("a", t).html(),
                date_year = attData.split("年")[0],
                date_month = (attData.split("年")[1]).split("月")[0],
                startdate = (date_year + "-" + date_month + "-1");
            endData = Holidayindex.getFirstAndLastMonthDay(date_year,
                date_month);
            loading(showbox)
            F.ajax({
                url: One(".preselbox").attr("attr-url") + "&startDate=" +
                startdate + "&endDate=" + endData,
                type: "string",
                fn: function(data) {
                    unloading(showbox);
                    One(showbox).html(data);
                    Holidayindex.setAnimate(All("dl", showbox), 5, 15);
                    All("img", showbox).lazyload({
                        data_attribute: "src",
                        preSpace: 3
                    });
                    window.SPM_MODULE &&SPM_MODULE.asynBind([".presellist"]);
                }

            })
        }
    }

    One(".preselbox").delegate(".preseltab li", "click", function(e) {

        var _this = F.one(e.delegateTarget);
        t = One(_this),
            nub = One("a", t).attr("attr-list");
        All(".preseltab li").removeClass("on");
        t.addClass("on");

        var showbox = All(".preselbox .presellist")[nub];
        Holidayindex.tabajaxFun(showbox, t);

        // Holidayindex.setAnimate(".presellist dl", 10, 20);

        All(".preselbox .presellist").addClass("none");
        One(All(".preselbox .presellist")[nub]).removeClass("none");

    });

    F.loaded(
        function() {
            F.require("mSlider", function() {
                var sliderLinks = All(
                    "#ivFullScreenSlider .iv_full_screen_slider_con a");
                All("#ivFullScreenSlider").mSlider({
                    moveTime: 4000,
                    canvas: "#ivFullScreenSlider .iv_full_screen_slider_con",
                    content: "#ivFullScreenSlider .iv_full_screen_slider_con li",
                    showNav: "circle",
                    navAlign: "right",
                    aniType: "fade",
                    beforeNextFn: function() {
                        sliderLinks.each(
                            function(ele, i) {
                                if (!sliderLinks.imgLoaded) {
                                    var img = One("img", ele);
                                    if (i === sliderLinks.length -
                                        1) {
                                        sliderLinks.imgLoaded =
                                            true;
                                    }
                                    if (!img.length) {
                                        ele.innerHTML = imgHtml(ele);
                                        return false;
                                    }
                                }
                            }
                        );
                    }
                });

                One("#simpleSlider").hover(
                    function() {
                        sliderLinks.each(
                            function(ele, i) {
                                if (!sliderLinks.imgLoaded) {
                                    var img = One("img", ele);
                                    if (i === sliderLinks.length - 1) {
                                        sliderLinks.imgLoaded = true;
                                    }
                                    if (!img.length) {
                                        ele.innerHTML = imgHtml(ele);
                                    }
                                }
                            }
                        );
                    },
                    function() {
                        return;
                    }
                );
            });

        }
    );


    function init() {
        /***出发城市***/
        One("#popleave").effect({
            type: "hover",
            elem: One("#city_select"),
            interFn: function() {
                One("#city_select").addClass("city_b_hover");
            },
            outerFn: function() {
                One("#city_select").removeClass("city_b_hover");
            }
        });
        // 按需加载
        All(".mianbox img").lazyload({
            data_attribute: "src",
            preSpace: 3
        });
        fish.all(".longboxl .boxl_pic img").each(function(){
            var el = fish.one(this);
            var src = el.attr("data-src");
            el.attr("src",src);
        });
        /*
         *点击热门目的地，触发的事件
         */
        One(".topBox").on("click", function(e) {
            var uTar = F.getTarget(e);
            if (F.dom(uTar).tagName.toUpperCase() == "A" && One(F.dom(
                    uTar).parentNode).hasClass("hotcity_box")) {
                var formcity = One(uTar).html();
                One("#searchinput").val(formcity);
                seachfun();
            }
        });

        //友情链接
        All(".iv-bothow").on("click", function() {
            var t_btn = One(this),
                shownode = One("dd", t_btn.parent()),
                t_state = t_btn.hasClass("iv-bothidd");
            if (t_state) {
                shownode.removeClass("iv-show");
                t_btn.removeClass("iv-bothidd");
            } else {
                shownode.addClass("iv-show");
                t_btn.addClass("iv-bothidd");
            }
        });


        All(".showlist").each(function(elem) {
            var lengthdiv = All(".showbox", elem).length;
            if (lengthdiv == 2) {
                One(elem).addClass("show_double")

                var this_h = One(elem).height();
                One(".splitspan", elem).css("height:" + this_h + "px;");
            }

        })


        var windowsWidth = 0;
        window.onresize = function() {

            if (windowsWidth == 0 || windowsWidth != One(window).width()) {
                windowsWidth = One(window).width();
                Holidayindex.resizeWindowEvent();
            }

        }
        var showbox = One(".preselbox .presellist"),
            t = One(One(".preseltab .on"));
        Holidayindex.tabajaxFun(showbox, t);
    }

    /*
     *   变更出发城市，触发的方法
     */
    Holidayindex.changcity = function() {
        function changHotCity(urlobj) {
            if (!urlobj || urlobj == "0") return;
            if (changHotCity.changeObj) changHotCity.changeObj.abort();
            changHotCity.changeObj = fish.ajax({
                url: urlobj,
                type: "string",
                timeout: 2000,
                fn: function(data) {
                    var datastr_1 = data.split("@")[1] == "0" ? "" :
                            data.split("@")[1],
                        datastr_2 = data.split("@")[2] == "0" ? "" :
                            data.split("@")[2];
                    fish.one(".hotcity_box").html(
                        "<span style='float:left'>热门搜索词:</span>" +
                        datastr_2);
                }
            });
        }

        var attrUrl = fish.one("#city_select").attr("attrurl");
        changHotCity(attrUrl);
    }

    Holidayindex.openUrl = function(elem, elempar, inputtext) {
        One(elempar).delegate(elem, "click", function(e) {
            var _this = F.one(e.delegateTarget),
                formcity = One(_this).html();
            One(inputtext).val(formcity);
            seachfun();
        });

    }
    Holidayindex.openUrl(".hotcity_box a", ".searchbox", "#searchinput");
    Holidayindex.openUrl(".listbox dt a", ".citylistbox", "#searchinput");
    All(".showlist h4 a").on("click", function() {
        var _this = One(this),
            formcity = One(_this).html();
        One("#searchinput").val(formcity);
        seachfun();
    });


})(fish);
