fish.admin.config({
    mPop: {
        v: "0.2.5",
        css: 1,
        g: 2013042701
    },
    mPage: {
        v: 0.4,
        g: 20130111,
        css: 1
    },
    lazyLoad: {
        v: 0.2,
        g: 20120918
    },
    sidebar: {v: 0.1, css: 1, g: 2013372401},
    mScrollpane: {
        v: "0.1",
        css: "1",
        g: 2122
    }
});
/*
 * FIXME 修复热搜词和浏览历史label统计值 2016/2/5
 * */

//兼容IE7placeholder
function inputIeplaceholder(objInput, focusC, blurC) {
    //objInput             对象id
    //focusC                聚焦颜色
    //blurC                  失去焦点颜色
    var doc = document,
        inputs = doc.getElementById(objInput),
        supportPlaceholder = 'placeholder' in doc.createElement('input'),
        placeholder = function (input) {
            var text = input.getAttribute('placeholder'),
                defaultValue = input.defaultValue;
            if (defaultValue == '') {
                input.value = text;
                input.style.color = '#' + blurC;
            }
            input.onfocus = function () {
                if (input.value === text) {
                    this.value = '';
                    this.style.color = '#' + focusC;
                }
            };
            input.onblur = function () {
                if (input.value === '') {
                    this.value = text;
                    this.style.color = '#' + blurC;
                }
            }
        };
    if (!supportPlaceholder) {
        var text = inputs.getAttribute('placeholder');
        if (text) {
            placeholder(inputs);
        }
    }
}

/* 统计 */

function buryPoint(tar, obj, fn) {
    $(tar).on("click", function () {
        if (typeof _tcTraObj !== "undefined") {
            if (fn && typeof fn === "function")fn(this, obj);
            _tcTraObj._tcTrackEvent(obj["category"], obj["action"], obj["optabel"], obj["optalue"]);
        }
    });
}
//字符串转化对象
function toJson(data) {
    return (new Function("return " + data))();
}

function setSearchHistoryCookie(isinval){
    //存cookie
    var historyvalue = [];
    if (fish.cookie.get("historywords")) {
        var historyrecord = toJson(fish.cookie.get("historywords"));
        historyvalue = historyvalue.concat(historyrecord);
        //去重
        if (historyvalue.length == 10) {
            historyvalue.splice(9, 1);
        }
        for (var i = 0; i < historyvalue.length; i++) {

            if (historyvalue[i].name == fish.one(".search_input").val()) {
                historyvalue.splice(i, 1);
                break;
            }
        }
    }
    var sityId = fish.trim(fish.one("#scityId").val()) == "" ? "0" : fish.trim(fish.one("#scityId").val());

    if (fish.one(".search_input").val() == "") {
        return;
    }
    historyvalue.unshift({
        name: isinval ? fish.one(".search_input").attr("in") : fish.one(".search_input").val(),
        scityId: sityId
    });
    fish.cookie.set({
        name: "historywords",
        value: JSON.stringify(historyvalue),
        days: 365,
        path: "/",
        encode: true
    })
}

function searchfun(){
    fish.cookie.set({name:"searchcookie",value:"2",seconds:"5",path:"/"});
    var tVal = fish.one(".search_input").val().replace(/[<>+【】？（）\[\]()……￥$%.*&_#~·]/g, "");
    //如果输入内容超过100，截取100字符
    if (tVal.length > 40) {
        //                tVal = tVal.substring(0, 40);
        return;
    }
    var kw = fish.trim(tVal);
    if (kw != "请输入目的地城市、景点") {
        fish.one("#KeyWord").val(kw);
        //清空其他筛选条件
//            clearByKeyWord();
        //拼接同步跳转页面
        getListUrl();
    }

    setSearchHistoryCookie();
}

/* 搜索 */

(function () {
    //兼容IE7placeholder
    inputIeplaceholder("search_input", "333", "999");

    //搜索按钮点击
    fish.one(".search_btn").on("click", function () {
        searchfun();
       _tcTraObj._tcTrackEvent("shortTour_home_search_button", "搜索按钮点击事件", "周边跟团游PC大首页", "^"+$("#search_input").val()+"^"+$(".at-name").attr("cid")+"^");
    });

    //键盘回车搜索


    window.getListUrl = function(cid) {
        var uScityId = fish.trim(fish.one("#scityId").val()) == "" ? "0" : fish.trim(fish.one("#scityId").val()),
        //关键字
            uKeyWord = fish.trim(fish.one("#KeyWord").val()) == '' ? '""' : fish.trim(fish.one("#KeyWord").val());

        if(cid){
            uScityId = cid;
        }
        setTimeout(function () {
            window.location.href = "/bustour/bustoursearchlist_" + 0 + "_" + 0 + "_" + uScityId + "_" + 0 + "_" + 0 + "_" + 0 + "_" + uKeyWord + '_' + 0 + ".html";
        }, 500);
    };

    //    搜索函数



    hotfun();

    // 历史记录
    function getcookie() {
        fish.one(".search_bar").html('bottom', '<div class="hot_history" id="hotHistory"><div class="historyWords"></div></div>');
        if (fish.cookie.get("historywords")) {
            fish.one(".historyWords").html('<p>搜索历史</p><div class="clearhistory"><img src="http://img1.40017.cn/cn/s/yry/pcSearch/cleariconpc.png">删除历史</div><div class="searchhistory"></div>');
            var historylist = toJson(fish.cookie.get("historywords"));
            for (var i = 0; i < historylist.length; i++) {
                var historycon = '<a href="http://www.ly.com/bustour/bustoursearchlist_0_0_' + historylist[i].scityId + '_0_0_0_' + encodeURIComponent(historylist[i].name) + '_0.html">' + historylist[i].name + '</a>';
                fish.one(".searchhistory").html('bottom', historycon);
            }
            fish.one(".clearhistory").on("click", function () {
                fish.cookie.set({
                    name: "historywords",
                    value: "",
                    days: -1,
                    path: "/",
                    encode: true
                })
                setTimeout(function () {
                    fish.one(".historyWords").html("<p>暂无搜索历史</p>");
                }, 300)
            })
        } else {
            fish.one(".historyWords").html("<p>暂无搜索历史</p>");
        }
        /*  fish.one(".hot_history").on("click",function(){

         clearTimeout(historyTimer);
         setTimeout(function(){
         fish.one(".hot_history").css("display:block");
         },300)
         });*/

    }
    fish.on(
        "click", function (e) {
            validaClick(e, "hotHistory", "search_input");
        },document);

    function validaClick(e, DateTimeid, openDateTimeid) {
        if (openDateTimeid) {
            var a = document.getElementById(DateTimeid);
            if (a) {
                if (a.style.display == "" || a.style.display == "inline" || a.style.display == "block") {
                    var b = fish.getTarget(e);
                    var rt = false;

                    if (b.id == DateTimeid || b.id == openDateTimeid) {
                        rt = true;
                    }
                    else {
                        while (b && b.localName != "body") {
                            b = b.parentNode;
                            if (b != null) {
                                if (b.id == DateTimeid || b.id == openDateTimeid) {
                                    rt = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (!rt) {
                        a.style.display = "none";
                    }
                }
            }
        }
        else {
        }
    };

    //热搜词
    function hotfun() {
        getcookie();
        fish.ajax({
            url: "/bustour/json/GetHotSearchLabels.html",
            openType: "get",
            type: "json",
            data: "cityId=" + fish.one("#scityId").val(),
            fn: function (data) {
                if (data.State) {
                    //出发城市
                    var uScityId = fish.trim(fish.one("#scityId").val()) == "" ? "0" : fish.trim(fish.one("#scityId").val());
                    //特色标签
                    var HotLabelsdata = data.HotLabels;
                    if (HotLabelsdata) {
                        var search_tag = '<div class="search_tagName">';
                        for (var i = 0; i < HotLabelsdata.length; i++) {

                            var toUrl1 = HotLabelsdata[i].url.replace(/{days}/g, "0").replace(/{areaname}/g, "0").replace(/{scityId}/g, uScityId).replace(/{rsceneryId}/g, "0").replace(/{themeId}/g, "0").replace(/{priceRange}/g, "0").replace(/{KeyWord}/g, encodeURIComponent(HotLabelsdata[i].productName)).replace(/{ProvId}/g, "0");
                            search_tag += '<a class="tag_link tcTraObj" tctotype="search" tctoname="/shortTour/homepage" tjoptabel="/shortTour/k/hot"  href="' + toUrl1 + '">' + HotLabelsdata[i].productName + '</a>';
                        }
                        search_tag += '</div>';
                        fish.one(".search_wrapper").html("bottom", search_tag);
                        if (fish.one(".search_input").val() != "" && fish.one(".search_input").val() != "请输入目的地城市、景点、产品编号") {
                            fish.all(".tag_link").css("display:none");
                        }
                    }
                    //热搜词

                    var resultdata = data.HotWords;
                    if (resultdata.length > 0) {
                        fish.one(".hot_history").html("top", '<div class="hotWords"></div>');
                        fish.one(".hotWords").html("<p>热搜词</p>");
                        for (var i = 0; i < resultdata.length; i++) {
                            var hotdata = resultdata[i];
                            var hoturl = hotdata.url.replace(/{days}/g, "0").replace(/{areaname}/g, "0").replace(/{scityId}/g, uScityId).replace(/{rsceneryId}/g, "0").replace(/{themeId}/g, "0").replace(/{priceRange}/g, "0").replace(/{KeyWord}/g, encodeURIComponent(hotdata.productName)).replace(/{ProvId}/g, "0");
                            if(hoturl.indexOf("ProductDetail")>-1){
                                hoturl+="?#1";
                            }
                            var hotlist = '<a class="hot-kw tcTraObj" tctotype="search" tctoname="/shortTour/homepage" tjoptabel="/shortTour/k/history" href="' + hoturl + '">' + hotdata.productName + '</a>';
                            fish.one(".hotWords").html("bottom", hotlist);
                        }
                    }
                    fish.all(".tcTraObj").each(function () {
                        fish.one(this).on("click", function () {

                            var oHref = $(this).attr("href");
                            var tjType = 1;
                            if(/bustoursearchlist/g.test(oHref)){
                                tjType = 1
                            }else if(/ProductDetail/g.test(oHref)){
                                tjType = 0
                            }else{
                                tjType = 2
                            }
                            var index = $(this).index() + 1;
                            if($(this).hasClass("hot-kw")){
                                index = $(this).index();
                                _tcTraObj._tcTrackEvent("shortTour_home_search_hot", "热搜词点击事件", "周边跟团游PC大首页", "^"+$(this).html()+"^"+index+"^"+$(".at-name").attr("cid")+"^");
                            }
                            _tcTraObj._tcTrackEvent('search', '/shortTour/homepage', '/sbox/k/hot', '|*|k:'+ $(this).html() +'|*|pos:'+ index +'|*|locCId:'+ $("#scityId").val() +'|*|cityId:'+ $(".at-name").attr("cid") +'|*|jpTp:'+ tjType +'|*|');
                        })
                    });

                    supplierLabel();
                }
            }

        });

    }

    function getSupplierID(key) {
        var search = location.search.slice(1);
        var fromIndex = search.indexOf(key) + key.length + 1;
        var endIndex = search.indexOf("&", fromIndex);
        if (endIndex > 0) {
            return search.slice(fromIndex, endIndex);
        }
        else {
            return search.slice(fromIndex);
        }
    }

    //供应商标签
    function supplierLabel() {
        var key = "supid";
        var strSupplierId = getSupplierID(key);
        if (!strSupplierId) {
            return;
        }
        $(".search_tagName a").each(function () {
            var href = $(this).attr("href").split("supid=");
            if (href.length > 1) {
                if (href[1].split("&")[0] == strSupplierId) {
                    addSupplierLabel(strSupplierId, $(this).html());
                }
            }
        });
    }

    function addSupplierLabel(supid, supName) {
        var str = '<i class="select_block supplier"  screentype="supid">' +
            '<span class="select_block_name">供应商：<b supid="' + supid + '" >' + supName + '</b></span>' +
            '<label class="select_block_close supplier_close">×</label></i>';
        $(".choose_box").append(str);
        $(".clear_block").css("display", "block");
        $(".supplier_close").click(function () {
            $(this).parent("i").remove();
            getListUrl();
        });
    }

    //渐现公用方法
    var hoverAtFn = {
        init: function (tab, claname, con) {
            var uThis, timer = null;
            tab.hover(function () {
                clearTimeout(timer);
                uThis = fish.one(this);

                tab.removeClass(claname);
                uThis.addClass(claname);
            }, function () {
                timer = setTimeout(function () {
                    uThis.removeClass(claname);
                }, 200)
            })
        }
    };

    //现在所在城市
    hoverAtFn.init(fish.all(".at-now"), "at-hover");
    var hotCityObj = [
        {
            name:"广州",
            id:"80"
        },
        {
            name:"上海",
            id:"321"
        },
        {
            name:"成都",
            id:"324"
        },
        {
            name:"苏州",
            id:"226"
        },
        {
            name:"北京",
            id:"53"
        },
        {
            name:"武汉",
            id:"192"
        },
        {
            name:"杭州",
            id:"383"
        },
        {
            name:"重庆",
            id:"394"
        },
        {
            name:"深圳",
            id:"91"
        },
        {
            name:"西安",
            id:"317"
        },
        {
            name:"无锡",
            id:"229"
        },
        {
            name:"南京",
            id:"224"
        },
        {
            name:"天津",
            id:"343"
        },
        {
            name:"宁波",
            id:"388"
        },
        {
            name:"青岛",
            id:"292"
        },
        {
            name:"郑州",
            id:"163"
        },
        {
            name:"厦门",
            id:"61"
        }
    ];
    var citycur = true;

//    城市列表
    function  displayHotelCities(data) {
        var htmlStringBuffer = [],
            hoties = [],
            cities = [],
            item,
            itemCity,
            i = 0,
            k = 0;

        if (!(hoties = setupHotCities(hotCityObj)).length) {
            return;
        }
        if (!(cities = sortByAlphabet(data)).length) {
            return;
        }

        htmlStringBuffer.push('<div class="city_list">');
        while (item = hoties[i++]) {
            htmlStringBuffer.push('<a href="javascript:void(0)" title="' + item.name + '" cid="' + item.id + '" class="'+item.cur+'">' + item.name + '</a>');
        }


        htmlStringBuffer.push('</div><div class="city_list none">');
        i = 0;
        while (item = cities[i++]) {
            htmlStringBuffer.push('<dl ><dt >' + item.letter + '</dt><dd >');
            while (itemCity = item.cities[k++]) {
                htmlStringBuffer.push('<a href="javascript:void(0)" title="' + itemCity.name + '" cid="' + itemCity.id + '" class="'+itemCity.cur+'">' + itemCity.name + '</a>');
            }
            k = 0;
            htmlStringBuffer.push('</dd></dl>');
            if (item.letter === "D" ||item.letter === "H" || item.letter === "L" || item.letter === "R"|| item.letter === "W") {
                htmlStringBuffer.push('</div><div class="city_list none">');
            }
            if (item.letter === "Z") {
                htmlStringBuffer.push('</div>');
            }
        }

        $(".city-ban").after(htmlStringBuffer.join(""));

        // data 按字母排序
        function sortByAlphabet(data) {
            var ordered = [],
                readyForSort = [],
                alphabet = [
                    "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"
                ],
            // letterAndCities = {},
                i = 0,
                j = 0,
                item,
                tmpLetter,
                tmpCity;

            while (item = data[i++]) {
                readyForSort.push(
                    {
                        // 城市名
                        name: item.cityname,
                        // 城市简拼
                        alphabet: item.py,
                        // 城市 id
                        id: item.cityid
                    }
                );
            }

            // 下标复位
            i = 0;

            // 注意 item 外循环 和 内循环 不一样的指代
            while (item = alphabet[i++]) {
                tmpLetter = item;
                tmpCity = [];
                while (item = readyForSort[j++]) {
                    if (item.alphabet.indexOf(tmpLetter.toLowerCase()) === 0) {
                        var cur = "";
                        if(item.id==fish.one("#scityId").val()&&citycur){
                            cur = "at";
                        }
                        tmpCity.push(
                            {
                                name: item.name,
//                                type: item.type,
                                id: item.id,
                                cur:cur
                            }

                        );
                    }
                }
                ordered.push(
                    {
                        letter: tmpLetter,
                        cities: tmpCity
                    }
                );
                j = 0;
            }
            return ordered;
        }
        // 热门城市传 id, type, name
        function setupHotCities(hotCities) {
            var setuped = [],
                i = 0,
                j = 0,
                itemHotCities,
                itemData;

            while (itemHotCities = hotCities[i++]) {
                var cur = "";
                if(itemHotCities.id== fish.one("#scityId").val()){
                    citycur = false;
                    cur = "at";
                }

                setuped.push(
                    {
                        name: itemHotCities.name,
                        id: itemHotCities.id,
                        cur:cur
                    }
                );
            }
            return setuped;
        }
        fish.one(".at-name").html(fish.one(".city_list .at").html()).attr("cid",fish.one(".city_list .at").attr("cid"));
        //城市切换
        fish.all(".city-ban li").each(function(e,i){
            fish.one(this).on("click",function(){
                if(!fish.one(this).hasClass("at")){
                    fish.all(".city-ban li").removeClass("at");
                    fish.one(this).addClass("at");
                    fish.all(".city_list").addClass("none");
                    fish.one(fish.all(".city_list")[i]).removeClass("none");
                }
            })
        });
        //选择城市
        fish.all(".city_list a").each(function(){
            fish.one(this).on("click",function(){
                if(!fish.one(this).hasClass("at")){
                    fish.all(".city_list a").removeClass("at");
                    fish.one(this).addClass("at");
                    fish.one("#KeyWord").val('""');
                    fish.one("#UrlKeyWord").val('""');
                    var cid = fish.one(this).attr("cid");
                    setTimeout(function(){
                        window.location.href = "/bustour/HomeIndex.html?cityid=" + cid;
                    },300);
                    _tcTraObj._tcTrackEvent("shortTour_home_select_city","城市选择点击事件", "周边跟团游PC大首页", "^" + $("#scityId").val() +"^"+cid + "^");
                }
            })

        });

    }
    fish.ajax({
        url: "/bustour/json/getallstartcity.html?action=GETYRYCITYLIST&isReadCache=1",
        type: "json",
        fn: function (data) {
            if(data.state=="100"){
                var redata = data.sceneryinfo;
                displayHotelCities(redata);
            }

        }
    });


    //初始化搜索框内关键词
    var kw = fish.one("#UrlKeyWord").val().replace(/\"/g, "");
    if (kw != "" && kw != 0 && kw != null) {
        fish.one("#search_input").val(kw);
    }


    fish.one(".search_input").on('focus', function () {
        if(fish.trim(fish.one(".search_input").val()) == "" || fish.one(".search_input").val() == "请输入目的地城市、景点、产品编号"){
            fish.one(".hot_history").css("display:block");
            var cheight = fish.one(".searchhistory").height(),
                cpaddTop = (cheight / 2) - 8,
                heighttrue = cheight - cpaddTop;
            fish.all(".tag_link").css("display:none");
        }
    }).on('blur', function () {
//        fish.one(".hot_history").css("display:none");
        if (fish.one(".search_input").val() != "" && fish.one(".search_input").val() != "请输入目的地城市、景点、产品编号") {
            fish.all(".tag_link").css("display:none");
        }
        else {
            fish.all(".tag_link").css("display:block");
            /*  historyTimer = setTimeout(function(){
             fish.one(".hot_history").css("display:none")
             },300);*/
        }

    });


})();


/* 搜索 end */

/*
 * 幻灯
 *
 * */
(function(){
    function imgHtml(ele) {
        var  src = ele.getAttribute("nsrc"),
            alt = ele.getAttribute("nalt"),
            error = ele.getAttribute("nerror");
        return "<img src=\"" + src + "\" alt='" + (alt ? alt : '') + "' />";
    }
    fish.loaded(
        function () {
            var sliderLinks = fish.all("#slideMainUlBox a.linka");
            sliderLinks.each(function () {
                if (!fish.dom("img", this)) {
                    this.innerHTML = imgHtml(this);
                }

            });


            // loaded 时加载余下的幻灯片图片
            // 图片的加载时机是切换之间的 3 ～ 5 秒间隔时间
            fish.require("mSlider", function () {
                fish.all("#slideMainWarp").mSlider({
                    moveTime: 4000,
                    content: "#slideMainUlBox a",
                    canvas: "#slideMainUlBox",
                    aniType: "fade",
                    beforeNextFn: function () {
                    },
                    fn: function () {
                        if (sliderLinks.length == 1) {
                            fish.one("#slideMainWarp .mSlider_nav").addClass("none")
                        }
                    }
                });
            });
        }
    );


    fish.ready(function(){

//    广告

        function adGroupAnim(){
            var oLi = $(".adgroup li");
            oLi.hover(function(){
                oLi.removeClass("active");
                $(this).addClass("active");
            });
            //针对ie处理

            /*  if(fish.browser("ms", 6) || fish.browser("ms", 7) || fish.browser("ms", 8)){
             *//*   oLi.hover(function(){
             $(this).animate({width:"440px"});
             })*//*
             }else{

             }*/
        }

        adGroupAnim();




    });


})();

/* 幻灯 end */



// 历史记录功能
// 2015-07-20
!(function () {
    var historyView = {};
    // 获取历史记录cookie
    historyView.getHistory = function () {
        var history = fish.cookie.get('bustour_lines_history');
        if (!history) return [];

        try {
            history = JSON.parse(decodeURIComponent(history));
        } catch (e) {
            history = [];
        }

//        return (history.length > 5) ? history.slice(0, 5) : history;
        return history;
    };

    historyView.getWrapHTML = function () {
        return '' +
            '<ul>\
                {{items}}\
            </ul>';
    };

    //TODO 出发地和几日游需要更在详情页添加历史记录参数
    historyView.getInnerTemplate = function () {
        return '' +
            '<li><a target="_blank" href=\"/bustour/ProductDetail_{{pid}}.html\">\
            <img class="webp-img" data-nsrc=\"{{image}}\" alt=\"\" /><em class="img_label">{{days}}</em>\
            <div class="scenerybox">\
                <div class="describe">{{title}}</div> <span class="price"><b>{{price}}</b>起</span><span class="city">{{attr}}</span>\
            </div>\
        </a></li>';
    };

    // 页面加载时
    // 显示浏览记录
    historyView.renderHistory = function () {
        var regex = /\{\{([_$a-zA-Z]+)\}\}/g,
            wrapHTML = this.getWrapHTML(),
            template = this.getInnerTemplate(),
            data = this.getHistory(),
            html = '';

        var len = data.length;
        if (!len) {
            $(".history_scan").hide();
            return;
        }
        for (var i = 0; i < len; i++) {
            data[i].image = data[i].image.replace(/([^\.\/]+)(?=\.(jpg|jpeg|png|gif|bmp))/gi, function (match, name) {
                return name + '_600x320_00';
            });
            if(data[i].days==''){
                data[i].days="多日游";
            }
            html += template.replace(regex, function (match, name, pos, str) {
                return data[i][name];
            });
        }

        fish.one('.mSlider_con').html('bottom', wrapHTML.replace(regex, html));

        fish.all(".mSlider_con .describe").each(function(){

        });

        loadWebp({
            attr:'data-nsrc',
            img: $('.webp-img',$(".mSlider_con")),
            fn:function(){
                $('.webp-img',$(".mSlider_con")).lazyLoad({ attr: "data-nsrc"});
            }});

        //兼容IE
        fish.all('.mSlider_con li').each(function(){
            if($(".img_label",$(this)).html() == "undefined"){
                $(".img_label",$(this)).css({display:"none"})
            }
            if($(".city",$(this)).html() == "undefined"){
                $(".city",$(this)).css({display:"none"})
            }

            fish.dom(".ly-tour-label",fish.one(this)) && $(".ly-tour-label",$(this)).remove();
            fish.dom("i",fish.one(this)) && $("i",$(this)).remove();
            $("a",$(this)).attr("title",$(".describe",$(this)).html());

            if(fish.dom(".city font",fish.one(this))){
                fish.one(".city font",fish.one(this)).html("→");
            }

            var title1 = fish.one(".describe",this).html();
            var sbName = title1.length > 30 ? title1.substring(0,30) + "..." : title1;
            fish.one(".describe",this).html(sbName)

        });

        $("#simpleSlider .btn-prev,#simpleSlider .btn-next").html("<b></b>");

        if($(".mSlider_con li").length > 5){
            $("#simpleSlider").hover(
                function(){
                    $("#simpleSlider .btn-prev,#simpleSlider .btn-next").css({display:"block"});
                },
                function(){
                    $("#simpleSlider .btn-prev,#simpleSlider .btn-next").css({display:"none"});
                }
            )
        }
        setTimeout(function(){
            fish.one("#simpleSlider").mSlider({
                autoScroll:false,
                aniType:"slide",
                moveTime:1500,
                arrows:true,
                canvas:".mSlider_con ul",
                content:".mSlider_con ul li",
                prevBtn: "#simpleSlider .btn-prev",
                nextBtn: "#simpleSlider .btn-next",
                showNav:false,
                circle:true,
                prevFn:function(){
                }
            });
        },500);

        buryPoint("#simpleSlider .btn-prev",{
            category:"shortTour_home_history_left",
            action:"浏览历史左侧点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            obj["optalue"] = "1^"+$(".at-name").attr("cid");
        });
        buryPoint("#simpleSlider .btn-next",{
            category:"shortTour_home_history_right,",
            action:"浏览历史右侧点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            obj["optalue"] = "1^"+$(".at-name").attr("cid");
        });

        buryPoint($(".mSlider_con ul li"),{
            category:"shortTour_home_history_product",
            action:"浏览历史产品点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            var pid = $(cur).find("a").attr("href").replace(/[\/bustour\/ProductDetail_.html]/g,"");
            obj["optalue"] = "^"+ pid +"^"+ ($(cur).index() + 1) +"^"+$(".at-name").attr("cid");
        });




    };


    historyView.renderHistory();
}());


/*
 *
 * 热门目的地
 * */

(function(){
    var hotDestinationCacheData = {};       //热门目的地缓存
    var htmlWarp = $(".hot-destination-item");
    /*
     * 数据模块
     * */
    function hotDestination(paramData){
        paramData.scityId = $("#scityId").val();    //当前定位城市
        //清空上一次数据
        if($("dl",htmlWarp).length > 0){
            $("dl",htmlWarp).remove();
        }
        $.ajax({
            url:"/bustour/json/shorttoursearch.html?page=1&PageSize=8&keyword=&days=0&provid=0&themeId=0&priceRange=0&SortType=1",
            data:paramData,
            dataType:"json",
            success:function(data){
                if(data.state == "100"){
                    var dataInfo = data.sceneryinfo;
                    if(paramData.endcityids){
                        hotDestinationCacheData[decodeURIComponent(paramData.endcityids)] = dataInfo;
                    }
                    if(paramData.rsceneryId != ""){
                        hotDestinationCacheData[paramData.rsceneryId] = dataInfo;
                    }

                    //打印数据
                    setHotDestinationHtml(dataInfo);
                }
            }
        })
    }

    function setHotDestinationHtml(dataInfo){
        if($("dl",htmlWarp).length > 0){
            $("dl",htmlWarp).remove();
        }
        var i,len;
        for(i=0,len=dataInfo.length;i<len;i++){
            var thisData = dataInfo[i];
            var sbName = thisData.name.length > 22 ? thisData.name.substring(0,22) + "..." : thisData.name;
            var startCityName = thisData.srcityname.length > 4 ? thisData.srcityname.substring(0,4) + "..." : thisData.srcityname,
                endCityName = thisData.areaname.length > 3 ? thisData.areaname.substring(0,3) + "..." : thisData.areaname;
            var oDl = $('<dl data-productid="'+ thisData.id +'">\
                                    <dt>\
                                    <a href="/bustour/ProductDetail_'+ thisData.id +'.html" target="_blank" title="'+ thisData.name +'">\
                                        <img class="webp-img" data-nsrc="'+ thisData.pic +'" alt="">\
                                        </a>\
                                    </dt>\
                                    <dd>\
                                        <h3><a href="/bustour/ProductDetail_'+ thisData.id +'.html" target="_blank" title="'+ thisData.name +'">'+ sbName +'</a></h3>\
                                        <div>\
                                            <span class="price"><span>¥</span><b>'+ thisData.price +'</b>起</span>\
                                            <span class="city">'+ startCityName +'<b>→</b>'+ endCityName +'</span>\
                                        </div>\
                                    </dd>\
                                </dl>');

            htmlWarp.append(oDl);
        }

        buryPoint(".hot-destination-item dl",{
            category:"shortTour_home_mdd_product",
            action:"热门目的地产品点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:"1"
        },function(tar,obj){
            var hotName = $(".kw-des a.at").html() || $(".kw-scenery a.at").html();

            if($(".kw-des a.at").html()){
                hotName = "^"+ $(".kw-des a.at").html() +"^";
            }
            if($(".kw-scenery a.at").html()){
                hotName = "^^"+ $(".kw-scenery a.at").html() +"";
            }
            obj["optalue"] = ""+ hotName +"^"+ $(tar).data("productid") +"^"+ $(tar).index() +"^"+$(".at-name").attr("cid");
        });


        /*  $(".hot-destination-item img").hover(function(){
         $(this).addClass("pulse")
         },function(){
         var _this = this;
         setTimeout(function(){
         $(_this).removeClass("pulse")
         },500)
         });*/
        loadWebp({
            attr:'data-nsrc',
            img: $('.webp-img',htmlWarp),
            fn:function(){
                $('.webp-img',htmlWarp).lazyLoad({ attr: "data-nsrc"});
            }});

    }

    function cacheHotDestination(param){
        if(!!hotDestinationCacheData[decodeURIComponent(param.endcityids)] || !!hotDestinationCacheData[param.rsceneryId]){
            var data = hotDestinationCacheData[decodeURIComponent(param.endcityids)] || hotDestinationCacheData[param.rsceneryId];
            setHotDestinationHtml(data)
        }else{
            hotDestination(param);
        }
    }

    /*
     * 列表模块
     * */

    //初始化默认显示第一个
    $(".hot-destination-kw a")[0].className = "at";

    // 热门目的地 初始数据
    hotDestination({
        endcityids:encodeURIComponent($($(".hot-destination-kw a")[0]).data("endcityid")),
        rsceneryId:""
    });

    $(".hot-destination-kw a").on("click",function(){
        if($(this).hasClass("at")){
            return;
        }
        var _thisID = $(this).data("endcityid") || $(this).data("sceneryid");
        $(".hot-destination-kw a").removeClass("at");
        $(this).addClass("at");
        var that = this;
        var paramData = {
            endcityids:"",
            rsceneryId:""
        };
        if(!!$(this).data("sceneryid")){
            paramData.endcityids = "";
            paramData.rsceneryId = _thisID;
        }else{
            paramData.endcityids = encodeURIComponent($(that).data("endcityid"));
            paramData.rsceneryId = "";
        }
        cacheHotDestination(paramData);

        setTimeout(function(){
            $(window).trigger('scroll');
        },200)

    })

})();


/*
 *
 *   玩法
 * */

(function(){
    var playCacheData = {};       //热门目的地缓存
    var htmlWarp = $(".play ul");
    /*
     * 数据模块
     * */
    function getPlayInfo(paramData){
        paramData.scityId = $("#scityId").val();    //当前定位城市
        //清空上一次数据
        htmlWarp.html("");
        $.ajax({
            url:"/bustour/json/shorttoursearch.html?page=1&PageSize=8&keyword=&days=0&provid=0&priceRange=0&SortType=1&areaname=&rsceneryId=",
            data:paramData,
            dataType:"json",
            success:function(data){
                if(data.state == "100"){
                    var dataInfo = data.sceneryinfo;

                    if(paramData.themeId != ""){
                        playCacheData[paramData.themeid] = dataInfo;
                    }

                    //打印数据
                    setPlayHtml(dataInfo);
                }
            }
        })
    }

    function setPlayHtml(dataInfo){
        htmlWarp.html("");
        var i,len;
        for(i=0,len=dataInfo.length;i<len;i++){
            var thisData = dataInfo[i];
            var tag = getTagHtml(thisData);
            var sbName = thisData.name.length > 28 ? thisData.name.substring(0,28) + "..." : thisData.name;
            var startCityName = thisData.srcityname.length > 4 ? thisData.srcityname.substring(0,4) + "..." : thisData.srcityname,
                endCityName = thisData.areaname.length > 4 ? thisData.areaname.substring(0,4) + "..." : thisData.areaname;

            var oLi = $('<li data-productid="'+ thisData.id +'">\
                                <a href="/bustour/ProductDetail_'+ thisData.id +'.html" target="_blank" title="'+ thisData.name +'">\
                                    <img class="webp-img" data-nsrc="'+ thisData.pic +'" alt="">\
                                    <em class="img_label">'+ thisData.pdtype +'</em>'+ tag +'\
                                    </a>\
                                <div class="scenerybox">\
                                <a href="/bustour/ProductDetail_'+ thisData.id +'.html" target="_blank" title="'+ thisData.name +'">\
                                <p>'+ sbName +'</p></a>\
                                <span class="price"><b>¥<i>'+ thisData.price +'</i></b>起</span>\
                                <span class="city">'+ startCityName +'<b>→</b>'+ endCityName +'</span>\
                                </div>\
                            </li>');
            htmlWarp.append(oLi);
        }

        buryPoint(".play_lst li",{
            category:"shortTour_home_wf_product",
            action:"热门玩法产品点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            obj["optalue"] = "^"+ $(".play .title_r a.active").html() +"^"+ $(cur).data("productid") +"^"+ ($(cur).index()+1) +"^"+$(".at-name").attr("cid");
        });

        loadWebp({
            attr:'data-nsrc',
            img: $('.webp-img',htmlWarp),
            fn:function(){
                $('.webp-img',htmlWarp).lazyLoad({ attr: "data-nsrc"});
            }});
    }

    function getTagHtml(data){
        var tagList = data.extralablist;
        var oHtml = "";
        var i,len;
        for(i=0,len=tagList.length;i<len;i++){
            if(tagList[i].labname == "同程专线"){
                oHtml = '<img src="http://img1.40017.cn/cn/s/yry/home/tczx_lable.png" class="tczx_label">';
            }
        }
        return oHtml;
    }


    function cachePlay(param){
        if(!!playCacheData[param.themeid]){
            var data = playCacheData[param.themeid];
            setPlayHtml(data)
        }else{
            getPlayInfo(param);
        }
    }

    //初始化首屏数据

    //初始化默认显示第一个
    $(".play .title_r a")[0].className = "active";

    //更多线路处理
    $(".play .more").html('更多'+ $($(".play .title_r a")[0]).html() +'线路');
    $(".play .more").attr("href",'/bustour/bustoursearchlist_0_0_'+ $("#scityId").val() +'_0_'+ $($(".play .title_r a")[0]).data("themeid") +'_0_%22%22_0.html');
    $(".play .more").attr("target","_blank");
    getPlayInfo({
        themeid:$($(".play .title_r a")[0]).data("themeid")
    });
    //事件绑定

    $(".play .title_r a:not(.more)").click(
        function(){
            if($(this).hasClass("active")){
                return;
            }
            var _thisID = $(this).data("themeid");
            $(".play .title_r a").removeClass("active");
            $(this).addClass("active");
            var paramData = {
                themeid:_thisID
            };
            //切换更多
            $(".play .more").html('更多'+ $(this).html() +'线路');
            $(".play .more").attr("href",'/bustour/bustoursearchlist_0_0_'+ $("#scityId").val() +'_0_'+ _thisID +'_0_%22%22_0.html');

            cachePlay(paramData);

            setTimeout(function(){
                $(window).trigger('scroll');
            },200)

        }
    )

})();


/*
 * 精心推荐
 * */

(function(){
    var recCacheData = {};       //精心推荐缓存
    var htmlWarp = $(".guset-item ul");
    /*
     * 数据模块
     * */
    function getRecInfo(paramData){
//        paramData.cityId = $("#scityId").val();    //当前定位城市
        //清空上一次数据
        htmlWarp.html("");
        $.ajax({
            url:"/bustour/json/RecommendProduct.html?cityId=" + $("#scityId").val(),
            data:paramData,
            dataType:"json",
            success:function(data){
                if(data.ProductList && data.ProductList.length > 0){
                    var dataInfo = data.ProductList;

                    if(paramData.typeName != ""){
                        recCacheData[encodeURIComponent(paramData.typeName)] = dataInfo;
                    }

                    //打印数据
                    setRecHtml(dataInfo);
                }
            }
        })
    }

    function setRecHtml(dataInfo){
        htmlWarp.html("");
        htmlWarp.css({width:"3000px"});
        var i,len;
        for(i=0,len=dataInfo.length;i<len;i++){
            var thisData = dataInfo[i];
//            var tag = getTagHtml(thisData);
            var sbName = thisData.Pname.length > 28 ? thisData.Pname.substring(0,28) + "..." : thisData.Pname;
            var startCityName = thisData.GoCityName.length > 4 ? thisData.GoCityName.substring(0,4) + "..." : thisData.GoCityName,
                endCityName = thisData.DestinationList[0].CityName.length > 4 ? thisData.DestinationList[0].CityName.substring(0,4) + "..." : thisData.DestinationList[0].CityName,
                dayNum  = parseInt(thisData.Days),
                typeTxt =  (thisData.Days < 4) ? ("帅一二三".charAt(dayNum) + "日游") : "多日游";
            var oLi = $('<li data-productid="'+ thisData.Pid +'">\
                                <a href="/bustour/ProductDetail_'+ thisData.Pid +'.html" target="_blank" title="'+ thisData.Pname +'">\
                                    <img class="webp-img" data-nsrc="'+ thisData.PicPath +'" alt="">\
                                    <em class="img_label">'+ typeTxt +'</em>\
                                    </a>\
                                <div class="scenerybox">\
                                <a href="/bustour/ProductDetail_'+ thisData.Pid +'.html" target="_blank" title="'+ thisData.Pname +'">\
                                <p>'+ sbName +'</p></a>\
                                <span class="price"><b>¥<i>'+ thisData.Price +'</i></b>起</span>\
                                <span class="city">'+ startCityName +'<b>→</b>'+ endCityName +'</span>\
                                </div>\
                            </li>');
            htmlWarp.append(oLi);
        }

        buryPoint($(".guset-item ul li"),{
            category:"shortTour_home_tj_product",
            action:"精心推荐产品点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            obj["optalue"] = "^"+ $(".guset_like .title_r a.active").html() +"^"+ $(cur).data("productid") +"^"+ ($(cur).index() + 1) +"^"+$(".at-name").attr("cid");
        });

        loadWebp({
            attr:'data-nsrc',
            img: $('.webp-img',htmlWarp),
            fn:function(){
                $('.webp-img',htmlWarp).lazyLoad({ attr: "data-nsrc"});
            }});

        //幻灯
        setTimeout(function(){
//            fish.one("#recSlider ul").css("width:"+ ($(".guset-item li").length * $(".guset-item li").width()) +
            if($("#recSlider li").length > 5){
                $("#recSlider").hover(
                    function(){
                        $("#recSlider .btn-prev,#recSlider .btn-next").css({display:"block"});
                    },
                    function(){
                        $("#recSlider .btn-prev,#recSlider .btn-next").css({display:"none"});
                    }
                )
            }else{
                $("#recSlider").hover(
                    function(){
                        $("#recSlider .btn-prev,#recSlider .btn-next").css({display:"none"});
                    },
                    function(){
                        $("#recSlider .btn-prev,#recSlider .btn-next").css({display:"none"});
                    }
                )
            }
            fish.one("#recSlider").mSlider({
                autoScroll:false,
                aniType:"slide",
                moveTime:1500,
                arrows:true,
                canvas:".guset-item ul",
                content:".guset-item ul li",
                prevBtn: "#recSlider .btn-prev",
                nextBtn: "#recSlider .btn-next",
                showNav:false,
                circle:true,
                prevFn:function(){
                    //for lazyload
                    $(window).trigger('scroll');
                },
                nextFn:function(){
                    //for lazyload
                    $(window).trigger('scroll');
                }
            });
        },200);
    }

    function cacheRec(param){
        if(!!recCacheData[encodeURIComponent(param.typeName)]){
            var data = recCacheData[encodeURIComponent(param.typeName)];
            setRecHtml(data)
        }else{
            getRecInfo(param);
        }
    }

    //初始化首屏数据

    //初始化默认显示第一个
    $(".guset_like .title_r a")[0].className = "active";

    getRecInfo({
        typeName:encodeURIComponent($($(".guset_like .title_r a")[0]).html())
    });
    //事件绑定

    $(".guset_like .title_r a:not(.more)").click(
        function(){
            if($(this).hasClass("active")){
                return;
            }
            var _thisName = encodeURIComponent($(this).html());
            $(".guset_like .title_r a").removeClass("active");
            $(this).addClass("active");
            var paramData = {
                typeName:_thisName
            };

            cacheRec(paramData);

            setTimeout(function(){
                $(window).trigger('scroll');
            },200)

        }
    )

})();

/*
 (function(){
 var nav = $(".guset_like .title_r a:not(.more)");
 var tab = $(".guset_like .guset-item");
 nav.click(function(){
 nav.removeClass("active");
 $(this).addClass("active");
 tab.addClass("none");
 $(tab[$(this).index()]).removeClass("none");
 })
 })();*/

/* 模糊查询 */
(function(){
    /**
     * Created by zhouhuajian on 2016/3/10.
     */
//模糊匹配

    function FuzzyMatch(param) {

        if (typeof param.input != "object") {

            return;

        }

        if (!param.input) {

            return;

        }


        this.input = fish.all(param.input);


        this.color = this.input.getCss("color");           //原始颜色

        this.text = this.input[0].defaultValue;                     //原始文本

        this.cache = {};

        this.index = -1;                                         //选中索引

        this.trs = null;                                              //所有的列表tr

        this.getEnter = false;

        this.scid = param.scid ? param.scid : "";


        this.init(param);

    }


    FuzzyMatch.prototype = {

        constructor: FuzzyMatch,                                    //重置构造函数

        init: function (param) {

            var divBag = document.createElement("div");

            divBag.className = "divBag";

            this.divBag = divBag;

            this.excute(param);

        },

        excute: function (param) {                                    //执行

            var _this = this,

                enterFlag = false,

                hideFlag = false,

                delayFlag = null;


            this.input.on("focus", function () {

                if (_this.text == this.value) {

                    this.value = "";

                }

                this.style.color = "#333";

                _this.ajax(param,hideFlag);


            }).on("blur", function () {

                var that = this;

                setTimeout(function () {                                   //点击不隐藏

                    if (hideFlag == true) {

                        hideFlag = false;

                        return;

                    }

                    if (fish.trim(that.value).length <= 0 || /请/.test(that.value)) {

                        that.value = _this.text;

                        that.style.color = _this.color;

                    }

                    _this.hide(param, true);

                }, 500)

            }).on("keyup", function (e) {

                var eve = fish.getEvent(e);

                var code = eve.keyCode ? eve.keyCode : e.which;


                if (delayFlag != null) {

                    clearTimeout(delayFlag);

                }

                delayFlag = setTimeout(function () {




                    if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57) || (code >= 96 && code <= 108) || code == 8 || code == 13 || code == 32 || code == 108) {


                        if (code == 13 && enterFlag) {                                           //enter重复弹出

                            enterFlag = false;

                            return;

                        }


                        //*****

                        _this.ajax(param,hideFlag);

                    }

                    delayFlag = null

                }, param.delay ? param.delay : 0)

            }).on("keydown", function (e) {

                if (_this.trs == null) {

                    return;

                }

                var eve = fish.getEvent(e), l = _this.trs.length - 1;

                var code = eve.keyCode ? eve.keyCode : e.which;

                if (code == 38) {

                    if (_this.index == 0 || _this.index == -1) {

                        _this.index = l;

                    } else {

                        _this.index--;

                    }

                    _this.trs.removeClass("hover_on");

                    fish.one(_this.trs[_this.index]).addClass("hover_on");


                } else if (code == 40) {

                    if (_this.index == l) {

                        _this.index = 0;

                    } else {

                        _this.index++;

                    }

                    _this.trs.removeClass("hover_on");

                    fish.one(_this.trs[_this.index]).addClass("hover_on");

                }


                if (code == 13) {

                    _this.hide(param);

                    enterFlag = true;

                }

            })


            fish.all(window).on("scroll", function () {

                _this.hide(param, true);

            })

        },

        ajax:function(param,hideFlag){
            var _this = this;

            var trsString = "",

                tableHtml = _this.build(param),
//                    tableHtml = '',
                value = fish.trim(_this.input[0].value);

            if (param.url) {

                if (fish.trim(value).length <= 0) {

                    _this.hide(param, true);

                    return;

                }

                _this.scid = fish.one(".at-name").attr("cid");


                fish.ajax({

                    url: param.url,

                    data: "keyword=" + encodeURIComponent(value) + "&scid=" + _this.scid,

                    type: param.type ? param.type : "json",

                    fn: function (data) {

                        if (data.State != 100) {

                            return;

                        }

                        if(data.CityList.length == 0 && data.SceneryList.length == 0 && data.LabelList.length == 0){

                            _tcTraObj._tcTrackEvent("search", "/shortTour/homepage", "/sbox/ac", "|*|k:"+ value +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|rc:0|*|");

                            _this.hide(param);
                            return;
                        }

                        if (param.fn) {

                            if (typeof data == "object") {

                                // TODO 错误提示 待做场景逻辑处理

                                if(data.Msg){
                                    trsString += ("<tr><td><div class='kw-err'>"+ data.Msg +"</div></td></tr>");
                                }else{
                                    trsString += "";
                                }
                                //目的地

                                if(data.CityList.length > 0){
                                    trsString += ("<tr><td><div class='dos dos-destination'>" + (data.Msg ? "周边出发城市" : "目的地") +"</div></td></tr>");
                                }
                                fish.all(data.CityList).each(function (e,i) {
                                    trsString += ("<tr seat="+i+"><td>" + param.fn.call(_this, this, value) + "</td></tr>");
                                });


                                //景点
                                if(data.SceneryList.length > 0){
                                    trsString += ("<tr><td><div class='dos dos-scenery'>景点</div></td></tr>");
                                }
                                fish.all(data.SceneryList).each(function (e,i) {
                                    trsString += ("<tr seat="+i+"><td>" + param.fn.call(_this, this, value) + "</td></tr>");

                                });

                                //主题
                                if(data.LabelList.length > 0){
                                    trsString += ("<tr><td><div class='dos dos-theme'>特色</div></td></tr>");
                                }
                                fish.all(data.LabelList).each(function (e,i) {
                                    trsString += ("<tr seat="+i+"><td>" + param.fn.call(_this, this, value) + "</td></tr>");

                                });

                                tableHtml = tableHtml.replace(/\$2/i, trsString);


                            } else {

                                return;

                            }

                            _this.divBag.innerHTML = tableHtml;

                            document.body.appendChild(_this.divBag);

                            _this.location(param);

                            if (fish.browser("ms", 6)) {

                                fish.all("select").css("visibility: hidden;");

                            }

                            _this.divBag.style.display = "block";

                            this.getEnter = true;

                            var trs = fish.all(".singleDiv", _this.divBag), l = trs.length - 1;
//                                    var trs = fish.all("tbody tr", _this.divBag), l = trs.length - 1;

                            trs.each(function (elem, i) {

                                fish.all(this).on("mouseover", function (e) {

                                    _this.index = i;

                                    fish.stopBubble(e);

                                    trs.removeClass("hover_on");

                                    fish.all(this).addClass("hover_on");

                                }).on("click", function (e) {
                                    fish.stopBubble(e);
                                    _tcTraObj._tcTrackEvent("shortTour_home_search_ac","下拉列表点击点击事件","周边跟团游PC大首页","^"+$(this).find("span").attr("key")+"^"+(Number($(this).parent().parent().attr("seat"))+1)+"^"+$(".at-name").attr("cid")+"^");

                                    _this.hide(param);

                                    hideFlag = true;
                                    param.onClick && param.onClick(this);
                                })

                            })

                            _this.trs = trs;

                        }

                    }

                })

            }
        },

        build: function (param) {

            var table = "<table cellpadding=0 cellspacing=0 class='modle'><tbody>$2</tbody><tfoot style='display:$footStyle'><tr><td>$3</td></tr></tfoot></table>";

            table = table.replace(/\$1/i, param.title ? param.title : "请按上下键选择");

            if(!param.title){
                table = table.replace(/\$captionStyle/i, "none");
            }

            if (param.foot) {

                table = table.replace(/\$3/i, param.foot);

                table = table.replace(/\$footStyle/i, "");

            } else {

                table = table.replace(/\$footStyle/i, "none");

            }

            return table;

        },

        location: function (param) {

            var off = this.input.offset();

            var bagLeft = off.left,

                bagTop = off.top;

            var height = this.input.height();

            bagTop = bagTop + height;

            if (param.offset) {

                if (param.offset.left) {

                    bagLeft += parseInt(param.offset.left, 10);

                }

                if (param.offset.top) {

                    bagTop += parseInt(param.offset.top, 10);

                }

            }

            fish.all(this.divBag).css("left:" + bagLeft + "px;top:" + bagTop + "px;");

        },

        hide: function (param, checkFlag) {
            var _this = this;

            this.divBag.style.display = "none";
//        this.divBag.style.display = "block";

            if (fish.browser("ms", 6)) {

                fish.all("select").css("visibility:visible;");

            }

            if (!checkFlag && param.keyWord) {


                if(this.index > -1){

                    this.input[0].value = fish.trim($(this.trs[this.index]).find(param.keyWord).attr("key"));

                    fish.one(this.input).attr("in",fish.trim(fish.dom(param.keyWord, this.trs[this.index]).getAttribute("key")));
                    fish.one(this.input).attr("data-url",$(param.keyWord, this.trs[this.index]).data("url"));

                    fish.one("#KeyWord").val(this.input[0].value);

                    var tjType = 1;
                    var oHref = $(param.keyWord, this.trs[this.index]).data("url");
                    if(/bustoursearchlist/g.test(oHref)){
                        tjType = 1
                    }else if(/ProductDetail/g.test(oHref)){
                        tjType = 0
                    }else{
                        tjType = 2
                    }

                    //统计

                    _tcTraObj._tcTrackEvent('search', '/shortTour/homepage','/sbox/ac/click', '|*|k:'+ this.input[0].value +'|*|ct:'+ this.input[0].value +'|*|pos:'+ this.index+'|*|locCId:'+ $("#scityId").val() +'|*|cityId:'+ $(".at-name").attr("cid") +'|*|pjId:2023|*|jpTp:'+ tjType +'|*|resCId:'+ $(".at-name").attr("cid") +'|*|ctTp:'+ $(param.keyWord, this.trs[this.index]).data("type") +'|*|');
                }

                /* if(fish.one(this.input).val() != fish.one(this.input).attr("in")){
                 searchfun();
                 }else{
                 if($(param.keyWord, this.trs[this.index]).data("url") != ""){
                 window.location.href = $(param.keyWord, this.trs[this.index]).data("url");

                 setSearchHistoryCookie();
                 }
                 }*/


            }

            this.index = -1;

            this.trs = null;

            this.getEnter = false;

        }

    };
    /* TODO 搜索下拉暂时不用 接口未好 */


    window.fm = new FuzzyMatch({

        input: fish.dom("#search_input"),

        url: "/bustour/json/GetAssociation.html",

//    url: "data.js",

        type: "json",

        offset: { left: "-2",top:"0"},

//    foot:"模糊匹配",

        keyWord: ".listContent",

        scid:fish.one(".at-name").attr("cid"),

        delay: 250,                                           //延迟加载的毫秒数

        onClick:function(){
            var kw = encodeURIComponent(this.input.value);
            setTimeout(function () {
                if(fish.one("#search_input").val() != fish.one("#search_input").attr("in")){
                    searchfun();
                }else{
                    if($("#search_input").data("url") != ""){
                        window.location.href = $("#search_input").data("url");
                        setSearchHistoryCookie(true);
                    }else{
                        searchfun();
                    }
                }
            }, 300)
        },

        fn: function (data, value) {
            //隐藏热搜词模块
            fish.one(".hot_history").css("display:none");

            return "<div class='singleDiv'>\
                    <span class='listContent' data-type=" + data.Type + " data-id=" + data.Id + " data-url=" + data.Url + " key=" + data.Name + ">" + (data.ShowName.replace(new RegExp("(" + value + ")", "i"), "<span class='fit'>$1</span>")) + "</span>\
                    <span class='listLocation'>" + (data.CityName ? data.CityName : "")  + "</span>\
                </div>";

        }

    });

    fish.one("#search_input").on("keydown", function (e) {
        var eve = fish.getEvent(e);
        var code = eve.keyCode ? eve.keyCode : e.which;
        var _this = this;
        var kw = encodeURIComponent(this.value);

        if(kw !== ""){
            $(".hot_history").hide();
        }
        if (code == 13) {
            setTimeout(function () {
                if(fish.one(_this).val() != fish.one(_this).attr("in")){
                    searchfun();
                }else{
                    if($(_this).data("url") != ""){
                        window.location.href = $(_this).data("url");
                        setSearchHistoryCookie(true);
                    }else{
                        searchfun();
                    }
                }
            }, 300)
        }
    });

})();



//初始化
$(function(){
    //延迟加载
    $('.webp-img').lazyLoad({ attr: "data-nsrc"});

    /*
     * 埋点处理
     * */
    $(".top-link").on("click",function(){

    });

});

fish.loaded(function(){
    //统计代码
    _tcTraObj._tcTrackEvent('shortTour_home_enter', '进入pc大首页', '周边跟团游PC大首页','^'+$("#scityId").val()+'^'+$("#scityId").val()+'^');
    buryPoint(".top-link",{
        category:"shortTour_home_ad1",
        action:"搜索框右侧运营位点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "1^"+$(".at-name").attr("cid");
    });

    buryPoint(".b-type-list a",{
        category:"shortTour_home_select_day",
        action:"游玩天数点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        var curHtml = $(cur).html().replace(/<em[^<>]*>\/<\/em>/g,"");
        if($(cur).parents("dl").hasClass("b-type-days")){
            obj["category"] = "shortTour_home_select_day";
            obj["action"] = "游玩天数点击事件";
            obj["optalue"] = curHtml+"^"+$(".at-name").attr("cid");
        }else if($(cur).parents("dl").hasClass("b-type-area")){
            obj["category"] = "shortTour_home_select_destination";
            obj["action"] = "热门周边目的地点击事件";
            obj["optalue"] = "^"+ curHtml +"^"+ ($(cur).index() + 1) +"^"+$(".at-name").attr("cid");
        }else if($(cur).parents("dl").hasClass("b-type-rec")){
            obj["category"] = "shortTour_home_select_ theme";
            obj["action"] = "玩法推荐点击事件";
            obj["optalue"] = "^"+ curHtml +"^"+ ($(cur).index() + 1) +"^"+$(".at-name").attr("cid");
        }
    });

    buryPoint("#slideMainUlBox li",{
        category:"shortTour_home_banner",
        action:"幻灯点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = ($(cur).index() + 1)+"^"+$(".at-name").attr("cid");
    });

    buryPoint(".city-hot-search li a",{
        category:"shortTour_home_select_city",
        action:"城市选择点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "1^"+$(".at-name").attr("cid");
    });

    // buryPoint(".search_btn",{
    //     category:"search",
    //     action:"/shortTour/homepage",
    //     optabel:"/sbox/k",
    //     optalue:""
    // },function(cur,obj){
    //     obj["optalue"] = "|*|k:"+ $("#search_input").val() +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|";
    // });

    buryPoint(".searchhistory a",{
        category:"search",
        action:"/shortTour/homepage",
        optabel:"/sbox/k/history",
        optalue:""
    },function(cur,obj){

        var oHref = $(cur).attr("href");
        var tjType = 1;
        if(/bustoursearchlist/g.test(oHref)){
            tjType = 1
        }else if(/ProductDetail/g.test(oHref)){
            tjType = 0
        }else{
            tjType = 2
        }
        var index = $(cur).index() + 1;

        var tcVal = "|*|k:"+ $(cur).html() +"|*|pos:"+ index +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|jpTp:"+ tjType +"|*|";

        obj["optalue"] = tcVal;
    });


    $(".searchhistory a").click(function(){
        _tcTraObj._tcTrackEvent("shortTour_home_search_history","搜索历史点击事件","周边跟团游PC大首页","^"+$(this).html()+"^"+$(".at-name").attr("cid")+"^")
    })
    /*
     * 热门目的地模块
     * */

    buryPoint(".hot-destination-img",{
        category:"shortTour_home_ad2",
        action:"热门目的地广告点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "1^"+$(".at-name").attr("cid");
    });

    buryPoint(".kw-des a",{
        category:"shortTour_home_mdd_hotcity",
        action:"热门目的地热门城市点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "^"+ $(cur).html() +"^"+ ($(cur).index()+1)  +"^"+$(".at-name").attr("cid");
    });

    buryPoint(".kw-scenery a",{
        category:"shortTour_home_mdd_hotscenic",
        action:"热门目的地热门景点点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "^"+ $(cur).html() +"^"+ ($(cur).index()+1) +"^"+$(".at-name").attr("cid");
    });


    /*
     * 热门玩法
     * */

    buryPoint(".playimg",{
        category:"shortTour_home_ad3",
        action:"热门玩法广告点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "1^"+$(".at-name").attr("cid");
    })

    buryPoint($(".play .title_r a:not(.more)"),{
        category:"shortTour_home_wf_theme",
        action:"热门玩法主题标签点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "^"+ $(cur).html() +"^"+ ($(cur).index()+1)  +"^"+$(".at-name").attr("cid");
    });

    buryPoint($(".play .title_r a.more"),{
        category:"shortTour_home_wf_gomore",
        action:"更多线路点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "^"+ $(".play .title_r a.active").html() +"^"+$(".at-name").attr("cid");
    });


    /*
     * 精心推荐
     * */
    buryPoint($(".guset_like .title_r a:not(.more)"),{
        category:"shortTour_home_tj_theme",
        action:"精心推荐推荐类别点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "^"+ $(".guset_like .title_r a.active").html() +"^"+ ($(cur).index() + 1) +"^"+$(".at-name").attr("cid");
    });




    /*
     2016.2.22 删除 (第一期迭代)
     buryPoint($(".guset_like .title_r a.more"),{
     category:"shortTour_home_tj_gomore",
     action:"更多热门线路点击事件",
     optabel:"周边跟团游PC大首页",
     optalue:"1"
     });
     */


    buryPoint($(".zx a:first-child"),{
        category:"shortTour_home_ad4",
        action:"底部广告位点击事件",
        optabel:"周边跟团游PC大首页",
        optalue:""
    },function(cur,obj){
        obj["optalue"] = "1^"+$(".at-name").attr("cid");
    });
    if($(".adgroup").length>0){
        buryPoint($(".adgroup li"),{
            category:"shortTour_home_yunyinwei",
            action:"首页运营位点击事件",
            optabel:"周边跟团游PC大首页",
            optalue:""
        },function(cur,obj){
            obj["optalue"] = "^"+($(cur).index() + 1)+"^"+ $.trim($(cur).find("b").html())+"^"+$("#scityId").val()+"^";
        });
    }



});
/*$(".slide_main").addClass("tc_ac_tr");
$(".hot-destination-img a").eq(0).addClass("tc_ac_tr");
$(".play_lst a").eq(0).addClass("tc_ac_tr").css("float","left");
$(".zx").addClass("tc_ac_tr");*/
$(".hot-destination-img a").eq(0).append("<b class='tc_ac_tr'></b>");
$(".play_lst a").eq(0).append("<b class='tc_ac_tr'></b>");
$(".slider-warp").append("<b class='tc_ac_tr'></b>");

$(".slider-warp b.tc_ac_tr").css({"position":"absolute","right":"0","top":"0","z-index":"100"});
//$(".slide_main ul").css("float","left");
$(".zx img").eq(0).css("float","left");
$(".zx a").css({"display":"block","width":"1190px","height":"60px"}).append("<b class='tc_ac_tr'></b>");
