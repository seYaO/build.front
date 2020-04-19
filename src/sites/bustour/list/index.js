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
    mScrollpane: {
        v: "0.1",
        css: "1",
        g: 2122
    },
    Calendar: {v: "0.3", css: 1, g: 201403154 }
});
//页面页码状态值
var  pageState = false;

//是否新接口
var isNewAB = $("#isNew")[0] ? "ab:"+ $("#isNew").val() +"|*|" : "";

//隐藏域赋值
var newlochref=decodeURIComponent(window.location.href),
    newvalue  = newlochref.split("_");
function newhidvalue(i,e){
    if(newvalue[i].split(".")[0]!=$(e).val()){
        if(newvalue[i]=='""'){
            $(e).val("")
        }else{
            $(e).val(newvalue[i]);
        }
    }
}
if(!(newlochref.indexOf("searchlist.html")>-1)){
    newhidvalue(1,"#days");
    newhidvalue(3,"#scityId");
    newhidvalue(4,"#rsceneryId");
    newhidvalue(5,"#themeId");
    newhidvalue(7,"#urlKeyWord");
}
function newhidvalue2(a,e){
    var newparam = newlochref.split(a+"=")[1]&&newlochref.split("&")[0];
    if(newparam==$(e).val()){
        $(e).val(newparam);
    }
}
if(newlochref.indexOf("?")>-1){
    newhidvalue2("searchcityid","#SearchCityId");
    newhidvalue2("tourtype","#TourType");
    newhidvalue2("tourscityId","#TourSCityId");
    newhidvalue2("endcityids","#EndCityIds");
    newhidvalue2("leftdate","#LeftDate");
    newhidvalue2("rightdate","#RightDate");
    newhidvalue2("weekendtag","#WeekendTag");
    newhidvalue2("leftprice","#LeftPrice");
    newhidvalue2("rightprice","#RightPrice");
}



var predata = fish.one("#commentUrl").val();
var goodcon = {};
var isloadimg = false;
/* 统计 */
function buryPoint(tar, obj, fn) {
    $(tar).on("click", function () {
        if (typeof _tcTraObj !== "undefined") {
            if (fn && typeof fn === "function")fn(this, obj);
            _tcTraObj._tcTrackEvent(obj["category"], obj["action"], obj["optabel"], obj["optalue"]);
        }
    });
}
isShowDpfx();
var dpfxInfo = '<em class="dpfaxtag">点评返现</em>';
function isShowDpfx() {
    //    判断返利网进来的，点评返现不显示
    var newrefid = 0,
        Isdpfx = 0;

    var refidcookie = fish.cookie.get("CNSEInfo");
    if (refidcookie) {
        newrefid = refidcookie.split("&")[0].split("=")[1];
    }
    fish.ajax({
        url: "/bustour/json/cashback.html",
        openType: "get",
        type: "json",
        data: "refid=" + newrefid,
        fn: function (data) {
            //0是不显示，1是显示
            Isdpfx = data.State == 1 ? 1 : 0;
            if (Isdpfx) {
                dpfxInfo = '<em class="dpfaxtag">点评返现</em>';
            } else {
                dpfxInfo = "";
                fish.all(".dpfaxtag").html("remove");
            }
        }

    })

}
/*
 * 顶部广告幻灯
 */

function imgHtml(ele) {
    src = ele.getAttribute("nsrc");
    alt = ele.getAttribute("nalt");
    error = ele.getAttribute("nerror");
    return "<img onerror=\"this.src=\'" + error + "\'\"" + " src=\"" + src + "\" alt='" + (alt ? alt : '') + "' />";
}
fish.loaded(
    function () {
        var sliderLinks = fish.all("#comSlide_main1 a.linka");
        sliderLinks.each(function () {
            if (!fish.dom("img", this)) {
                this.innerHTML = imgHtml(this);
            }
        });

        // loaded 时加载余下的幻灯片图片
        // 图片的加载时机是切换之间的 3 ～ 5 秒间隔时间
        fish.require("mSlider", function () {
            fish.all("#slide_main_top1").mSlider({
                moveTime: 4000,
                content: "#comSlide_main1 a",
                canvas: "#comSlide_main1",
                aniType: "fade",
                beforeNextFn: function () {
                },
                fn: function () {
                    if (sliderLinks.length == 1) {
                        fish.one(".mSlider_nav").addClass("none")
                    }
                    $("#comSlide_main1 a").click(function(){
                        _tcTraObj._tcTrackEvent("shortTour_list_ad","幻灯点击事件","周边跟团游PC列表页","^"+($(this).parent().index()+1)+"^"+$(".at-name").attr("cid")+"^");
                    })
                }
            });
        });
    }
);

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


//    搜索函数
function searchfun() {
    fish.cookie.set({name:"searchcookie",value:"2",seconds:"5",path:"/"});
    var tVal = fish.one(".search_input").val().replace(/[<>+【】？（）\[\]()……￥$%.*&_#~·]/g, "");
    //如果输入内容超过100，截取100字符
    if (tVal.length > 40) {
        //                tVal = tVal.substring(0, 40);
        return;
    }
    var kw = fish.trim(tVal);
    if (kw != "请输入目的地城市、景点、产品编号") {
        fish.one("#KeyWord").val(kw);
        //清空其他筛选条件
        clearByKeyWord();
        //拼接同步跳转页面
        getListUrl();
    }

    setSearchHistoryCookie();

};


var searchStr = ""; //搜索参数

fish.ready(function () {

    (function () {
        //生成LOADING
        fish.one("body").html('bottom', '<div style="display: none;">' +
            '<div id="inline_example_load" class="mosPout">' +
            '<p>您的线路正在搜索中，请稍候...</p>' +
            '</div>' +
            '</div>');
    })();
    //下拉按钮是否显示
    fish.all(".select_line").each(function (e, i) {
        var selectline = fish.one(fish.all(".select_line")[i]);
        var newheight = Number(selectline.children(".select_conlst").height());
        if (newheight<31) {
            selectline.children(".more").addClass("none");
        }else{
            selectline.children(".more").attr("state","1");
        }
        if(selectline.children(".sort_width").length==1){
            selectline.children(".moreSelects").css("display:none");
        }
    });
    //列表排序点击事件
    fish.on("click", function () {
        //如果点击的不是激活的排序选项
        if (!fish.one(this).hasClass("active_sort")) {
            pageState = true;
            fish.all(".sort_btn").removeClass("active_sort").removeClass("price_sort");
            fish.one(".sortPrice").html("价格").css("color","#333333");
            fish.all(".select_price li").removeClass("active");
            fish.one(this).addClass("active_sort");
            fish.one(".sortPrice").attr("priceorderby","0").removeClass("price_sort");
            //更改排序隐藏域中值
            fish.one("#SortType").val(fish.one(this).attr("tvalue"));
            //资源列表筛选
            if(fish.one(this).attr("tvalue")!=3){
                getpage();
            }
            
        }
        if(fish.one(this).attr("tvalue")==3){
            //资源列表筛选
            getpage();

        }


    }, ".sort_btn");
    $(".select_price").hover(function(){
        $(".select_price ul").css("display","block");
    },function(){
        $(".select_price ul").css("display","none");
    })

    $(".select_price ul li").click(function(event){
        $(this).addClass("active").siblings().removeClass("active");
        if($(this).index()==0){
           $(".sortPrice").attr("priceorderby","0");
        }
        if($(this).index()==1){
           $(".sortPrice").attr("priceorderby","1");
        }
        $("#SortType").val(3);
        $(".sortPrice").text($(this).html()).css("color","#f63");
        fish.all(".sort_btn").removeClass("active_sort").removeClass("price_sort");
        $(this).parent().css("display","none");
        event.stopPropagation();
        getpage();
    })
    //筛选块中更多按钮点击事件
    fish.all(".select_line .more").on("click", function () {
        //获取开关属性
        var flag = fish.one(this).attr("moreFlag");
        if (flag === "false") {
            //展开更多选项栏
            fish.one(this).parent(".select_line").addClass("expanded");
            fish.one(this).attr("moreFlag", "true").html("收起");
        } else {
            //关闭更多选项栏
            fish.one(this).parent(".select_line").removeClass("expanded");
            fish.one(this).attr("moreFlag", "false").html("更多");
        }
    });

    //筛选块中多选按钮点击事件
    fish.all(".select_line .moreSelects").on("click", function () {
        //变更msFlag属性为true,表示多选已启动
        fish.one(this).parent("dl").attr("msflag", true);
        //显示多选框
//        fish.one(this).parent(".select_line").children("dd a input[type=checkbox]").css("visibility: visible;");
        fish.one(this).parent(".select_line").children("dd a input[type=checkbox]").css("display:inherit;");
        //展开更多选项栏
        fish.one(this).parent(".select_line").addClass("expanded");
        //显示多选确定取消按钮
        fish.one(this).parent(".select_line").children(".moreSelects_btn").css("display:block;");
        //隐藏更多和多选按钮
        fish.one(this).parent(".select_line").children(".more").css("display:none;");
        fish.one(this).parent(".select_line").children(".moreSelects").css("display:none;");
    });

    //筛选块中多选取消按钮点击事件
    fish.all(".select_line .moreSelects_btn .a_cancel").on("click", function () {
        //变更msFlag属性为false,表示多选已关闭
        fish.one(this).parent("dl").attr("msflag", false);
        //隐藏多选框
//        fish.one(this).parent(".select_line").children("dd a input[type=checkbox]").css("visibility: hidden;");
        fish.one(this).parent(".select_line").children("dd a input[type=checkbox]").css("display: none;");
        //遍历将当前的checkbox的check改为false
        fish.one(this).parent(".select_line").children("dd a input[type=checkbox]").each(function () {
            if(!fish.one(this).attr("haveCheck")){
                fish.dom(this).checked = false;
                fish.one(this).parent("a").css("color:#666;");
                fish.one(this).parent("a").children("b").css("color:#333;");
                //更改隐藏属性为0
                fish.one("#" + sign).val("0");
            }else{
                fish.dom(this).checked = true;
                fish.one(this).parent("a").css("color:#fe6601;");
                fish.one(this).parent("a").children("b").css("color:#fe6601;");
            }
        });
        //收起更多选项栏
        fish.one(this).parent(".select_line").removeClass("expanded");
        //隐藏多选确定取消按钮
        fish.one(this).parent(".select_line").children(".moreSelects_btn").css("display:none;");
        //显示更多和多选按钮
        if(fish.one(this).parent(".select_line").children(".more").attr("state")=="1"){
            fish.one(this).parent(".select_line").children(".more").css("display:block;");
        }

        fish.one(this).parent(".select_line").children(".more").attr("moreFlag", "false");
        fish.one(this).parent(".select_line").children(".moreSelects").css("display:block;");

        //获取类别属性值
        var sign = fish.one(this).parent("dl").attr("sign");

       
    });

    //筛选块中多选确定按钮点击事件
    fish.all(".select_line .moreSelects_btn .a_ok").on("click", function () {

        var tvalue = "";
        var j = 0;
        var sibele = fish.one(this).parent(".themeclass").sibling(".themeclass").children(".current");
        if (sibele.length > 0) {
            sibele.each(function () {
                tvalue += "," + fish.one("b", this).attr("tvalue");
            })
        }
        fish.one(this).parent("dl").children(".sort_a").each(function (i) {
            var checked = fish.dom("input[type=checkbox]", this).checked;
            if (checked == true) {
                if (j == 0) {
                    tvalue = tvalue + fish.one("b", this).attr("tvalue");
                    j++;
                } else {
                    tvalue = tvalue + "," + fish.one("b", this).attr("tvalue");
                }
            }
        });
        //获取类别属性值
        var sign = fish.one(this).parent("dl").attr("sign");
        if (tvalue == "") {
            tvalue = "0";
        }
        //更改隐藏属性
        fish.one("#" + sign).val(tvalue);
        //同步拼接url跳转页码
        getListUrl();
    });

    //筛选块标签中checkbox点击事件
    fish.all(".select_line dd .sort_a input[type=checkbox]").on("click", function () {
        var e = fish.all(this).parent(".sort_a");
        sortAClick(e);
    });

    //筛选块标签点击事件
    fish.all(".select_line dd .sort_a").on("click", function () {
        if(!fish.one(this).hasClass("current")){
            sortAClick(this);
            fish.cookie.set( {name:"sortcookie", value:"1",seconds:"5",path:"/"} );
        }


    });

    //单选与多选筛选点击

    function sortAClick(ele) {
        //获取类别属性值
        var sign = fish.one(ele).parent("dl").attr("sign");
        if(sign == "WeekendTag"){
            if(fish.one(ele).attr("sign") == "LeftDate"){
                return;
            }
            if(fish.one(ele).attr("sign") == "RightDate"){
                return;
            }
            fish.one("#LeftDate").val(0);
            fish.one("#RightDate").val(0);

        }

        if (sign == "rsceneryId" || sign == "themeId" ||sign=="EndCityIds") {
            var msFlag = fish.one(ele).parent("dl").attr("msflag");
            //判断是否多选
            if (msFlag == "true") {
                //获取当前checkbox的checked属性
                var checked = fish.dom("input[type=checkbox]", ele).checked;
                if (checked == false) {
                    fish.dom("input[type=checkbox]", ele).checked = true;
                    fish.one(ele).css("color:#fe6601;");
                    fish.one("b", ele).css("color:#fe6601;");

                } else {
                    fish.dom("input[type=checkbox]", ele).checked = false;
                    fish.one(ele).css("color:#666;");
                    fish.one("b", ele).css("color:#333;");

                }
            } else {
                //更改隐藏属性
                if (sign == "themeId") {
                    var themeid = "",
                        siblingsele = fish.one(ele).parent(".themeclass").sibling(".themeclass").children(".current");
                    if (siblingsele.length > 0) {
                        siblingsele.each(function () {
                            themeid += fish.one("b", this).attr("tvalue") + ","
                        })
                    }
                    themeid += fish.one("b", ele).attr("tvalue");
                    fish.one("#" + sign).val(themeid);
                    //同步拼接url跳转页码
                    getListUrl();
                } else {
                    fish.one("#" + sign).val(fish.one("b", ele).attr("tvalue"));
                    //同步拼接url跳转页码
                    getListUrl();
                }

            }
        } else if (sign == 'provname') {
            fish.one("#" + sign).val(fish.one("b", ele).parent().attr("provid"));
            //同步拼接url跳转页码
            getListUrl();
        } else {
            //更改隐藏属性
            fish.one("#" + sign).val(fish.one("b", ele).attr("tvalue"));
            //同步拼接url跳转页码
            getListUrl();

        }

    }

    //兼容IE7placeholder
    inputIeplaceholder("search_input", "333", "999");

    //搜索按钮点击
    fish.one(".search_btn").on("click", function () {
        searchfun();
    });



    hotfun();

    // 历史记录
    function getcookie() {
        fish.one(".search_bar").html('bottom', '<div class="hot_history" id="hotHistory"><div class="historyWords"></div></div>');
        if (fish.cookie.get("historywords")) {
            fish.one(".historyWords").html('<p>搜索历史</p><div class="searchhistory"></div><div class="clearhistory"><img src="http://img1.40017.cn/cn/s/yry/pcSearch/cleariconpc.png">删除历史</div>');
            var historylist = toJson(fish.cookie.get("historywords"));
            for (var i = 0; i < historylist.length; i++) {
                var historycon = '<a href="http://www.ly.com/bustour/bustoursearchlist_0_0_' + historylist[i].scityId + '_0_0_0_' + encodeURIComponent(historylist[i].name) + '_0.html">' + historylist[i].name + '</a>';
                fish.one(".searchhistory").html('bottom', historycon);
            }
            fish.all(".searchhistory a").each(function () {
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
                    var tcVal = "|*|k:"+ $(this).html() +"|*|pos:"+ index +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|jpTp:"+ tjType +"|*|" + isNewAB;
                    _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/sbox/k/history", tcVal);
                    _tcTraObj._tcTrackEvent("shortTour_list_search_history","搜索历史点击事件","周边跟团游PC列表页","^"+$(this).html()+"^"+$(".at-name").attr("cid")+"^")
                })
            });

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
                        var search_tag = '<div class="search_tagName">'
                        for (var i = 0; i < HotLabelsdata.length; i++) {
                            var toUrl1 = HotLabelsdata[i].url.replace(/{days}/g, "0").replace(/{areaname}/g, "0").replace(/{scityId}/g, uScityId).replace(/{rsceneryId}/g, "0").replace(/{themeId}/g, "0").replace(/{priceRange}/g, "0").replace(/{KeyWord}/g, encodeURIComponent(HotLabelsdata[i].productName)).replace(/{ProvId}/g, "0");
                            if(toUrl1.indexOf("ProductDetail")>-1){
                                toUrl1+="?#1";
                            }
                            search_tag += '<a class="tag_link tcTraObj" tctotype="shorttour_pc_searchlist_hotlabels" tctoname="PC首页热搜标签" tctovalue="8" href="' + toUrl1 + '">' + HotLabelsdata[i].productName + '</a>';
                        }
                        search_tag += '</div>';
                        fish.one(".search_wrapper").html("bottom", search_tag);
                        if (fish.one(".search_input").val() != "" && fish.one(".search_input").val() != "请输入目的地城市、景点、产品编号") {
                            fish.all(".tag_link").css("display:none");
                        }
                    }
                    //热搜词

                    var resultdata = data.HotWords;
                    if (resultdata.length>0) {
                        fish.one(".hot_history").html("top", '<div class="hotWords"></div>');
                        fish.one(".hotWords").html("<p>热搜词</p>");
                        for (var i = 0; i < resultdata.length; i++) {
                            var hotdata = resultdata[i];
                            var hoturl = hotdata.url.replace(/{days}/g, "0").replace(/{areaname}/g, "0").replace(/{scityId}/g, uScityId).replace(/{rsceneryId}/g, "0").replace(/{themeId}/g, "0").replace(/{priceRange}/g, "0").replace(/{KeyWord}/g, encodeURIComponent(hotdata.productName)).replace(/{ProvId}/g, "0");
                            if(hoturl.indexOf("ProductDetail")>-1){
                                hoturl+="?#1";
                            }
                            var hotlist = '<a class="tcTraObj" tctotype="shorttour_pc_searchlist_hotwords" tctoname="PC首页热搜词" tctovalue="7"  href="' + hoturl + '">' + hotdata.productName + '</a>';
                            fish.one(".hotWords").html("bottom", hotlist);
                        }
                    }
                    fish.all(".hotWords a").each(function () {
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
                            var index = $(this).index();

                            var tcVal = "|*|k:"+ $(this).html() +"|*|pos:"+ index +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|jpTp:"+ tjType +"|*|" + isNewAB;
                            _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/sbox/k/hot", tcVal);
                            _tcTraObj._tcTrackEvent("shortTour_list_search_hot","热搜词点击事件","周边跟团游PC列表页","^"+$(this).html()+"^"+$(this).index()+"^"+$(".at-name").attr("cid")+"")
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
        else
        {
            return search.slice(fromIndex);
        }


    }

    //供应商标签
    function supplierLabel() {
        var key = "supid";
        var strSupplierId = getSupplierID(key);
        if(!strSupplierId)
        {
            return;
        }
        $(".search_tagName a").each(function () {
            var href=$(this).attr("href").split("supid=");
            if(href.length > 1){
                if(href[1].split("&")[0] == strSupplierId){
                    addSupplierLabel(strSupplierId, $(this).html());
                }
            }
        });
    }

    function addSupplierLabel(supid,supName) {
        var str = '<i class="select_block supplier"  screentype="supid">' +
            '<span class="select_block_name">供应商：<b supid="'+supid+'" >'+supName+'</b></span>' +
            '<label class="select_block_close supplier_close">×</label></i>';
        $(".choose_box").append(str);
        $(".clear_block").css("display","block");
        $(".supplier_close").click(function(){
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
        //更改面包屑
        fish.one(".wherego").html(fish.one(".at-name").html() + '出发');
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
                    clearByKeyWord();
                    fish.one("#scityId").val(fish.one(this).attr("cid"));
                    getListUrl();
//                    _tcTraObj._tcTrackEvent("shortTour_home_select_city","城市选择点击事件", "周边跟团游PC大首页", "^" + $("#scityId").val() +"^"+cid + "^");
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

    /*
     * 页面初始化
     */
    (function () {
        //图片延时加载
        fish.all(".img_contain img").lazyLoad({
            attr: "data-img-src",
            preSpace: 100
        });
        fish.all(".latest_activity img").lazyLoad({
            attr: "data-img-src",
            preSpace: 100
        });
        fish.all(".hover_show_img img").lazyLoad({
            attr: "data-img-src",
            preSpace: 100
        });

        //初始化搜索框内关键词
        var kw = fish.one("#UrlKeyWord").val().replace(/\"/g, "");
        if (kw != "" && kw != 0 && kw != null) {
            fish.one("#search_input").val(kw);
        }else{
            fish.one("#search_input").val("");
        }

        //变换排序条上的页码
        fish.one(".page_turning .page_num").html(fish.one("#tcPage").val() + "/" + fish.one("#totalPage").val());
        hoverAtFn.init(fish.all(".at-now"), "at-hover");
        //页面加载筛选高亮显示
        loadingSortHover();
        //确定选中条件
        theFirstList();
        //清空所有条件
        clearAllSelect();
        //初始化分页
//        getListPage();
    })();
});

//页面加载筛选高亮显示

function loadingSortHover() {
    var itemBox = fish.all(".select_box dl"); //获取dl
    itemBox.each(function (ele) {
        var that = this;

        fish.all(".sort_a", ele).each(function (elem) {
            //获取筛选类别
            var sign = fish.one(this).parent("dl").attr("sign");
            if (fish.dom("input[type=checkbox]", this) == null) {
//                fish.one("b", this).css("margin-left:18px;")
            }
            //获取页面当前类别隐藏值
            var hiddenValue = fish.one("#" + sign).val().split(",");
            for (var i = 0; i < hiddenValue.length; i++) {
                if (fish.one("b", this).attr("tvalue") === hiddenValue[i]) {
                    //当前类别高亮显示
                    fish.one(this).addClass("current");
                    fish.one(that).addClass("current none");
                }

                if (sign == 'provname' && fish.one(this).attr('provid') == hiddenValue[i]) {
                    fish.one(this).addClass("current");
                    fish.one(that).addClass("current none");
                }
            }

        });
    });
}

//页面首次加载进来选中条件处理

function theFirstList() {

    var clearboxstate = false;
    var leftval ="",RightDate="";
    if(Number(fish.one("#LeftDate").val())){
        leftval = fish.one("#LeftDate").val();
        fish.one("#firsttime").css("color:#333").val(showtime(leftval));
        fish.one(".select_date").addClass("current none");

    }
    if(Number(fish.one("#RightDate").val())){
        RightDate = fish.one("#RightDate").val();
        fish.one("#lasttime").css("color:#333").val(showtime(RightDate));
        fish.one(".select_date").addClass("current none");

    }
    var LeftPrice = fish.one("#LeftPrice").val(),RightPrice=fish.one("#RightPrice").val();
    if(Number(LeftPrice)){
        fish.one(".min").val("¥"+LeftPrice).css("color:#333");
    }
    if(Number(RightPrice)){
        fish.one(".max").val("¥"+RightPrice).css("color:#333");
    }
    var itemBox = fish.all(".select_box dl.current"); //获取dl
    var nodeBox = fish.dom(".select_box .choose_box"); //获取搜索记录存放容器
    //获取已选条件行html
    itemBox.each(function (ele) {
        var content=[],title=[];
        var showcontent = '';
        var sign = fish.one(this).attr("sign");
        if(sign == "WeekendTag"){
            if(Number(fish.one("#LeftDate").val())){
                content.push(showtime(leftval));
            }
            if(Number(fish.one("#RightDate").val())){
                content.push(showtime(RightDate));
            }

            clearboxstate = true;
        }
        title.push(fish.one(this).children(".title").html()); //标题
        fish.all(".current", ele).each(function (elem) {
            clearboxstate = true;
            content.push(fish.one("b", this).html()); //内容
        });

            var iBox = document.createElement("i");
            //如果是出发城市则隐藏
            if (sign == "scityId") {
                iBox.className = "select_block select_block_hidden";
            } else {
                iBox.className = "select_block";
            }
            //创建i节点
            var vName = document.createElement("span");
            vName.className = "select_block_name";
            vName.innerHTML =  "<b>" + title + "</b>"+(sign == "WeekendTag"?content.join("至"):content);
            var closeBtn = document.createElement("label");
            closeBtn.className = "select_block_close";
            closeBtn.innerHTML = "×";
            fish.one(iBox).attr("screentype", sign);
            iBox.appendChild(vName);
            iBox.appendChild(closeBtn);

            fish.one(closeBtn).on("click", function () {
                //清空隐藏域参数值
                clearSwitchFn(fish.one(iBox).attr("screentype"));

                getListUrl();
                //移除节点
                nodeBox.removeChild(iBox);
            });
            fish.one(nodeBox).html('bottom', iBox);
    });
    if(clearboxstate){
        fish.one(".select_choose").css("display:block");
    }
    //如果仅有隐藏的出发城市条件，就隐藏清除所有条件按钮
    /*if (fish.one(".choose_box").children("i").length <= 1) {
        fish.one(".clear_block").css("display:none;");
    }*/
    //动态获取已选条件框高度
    fish.one(".select_choose .title").css('height:' + (fish.one(".select_choose").height()+8) + 'px;')

}
//时间展示格式
function showtime(time){
    return time.substr(0,4) + "-" + time.substr(4,2) + "-" +time.substr(6,2);
}
/*
 *资源列表筛选
 */
function sceneryListSearch() {
    var ajaxStr = "";
    //页码
    ajaxStr += "page=" + fish.trim(fish.one("#tcPage").val());

    //分页大小（固定）
    ajaxStr += "&PageSize=10";

    //关键词
    if (fish.one("#KeyWord").val() == null) {
        ajaxStr += "&keyword=" + '""';
    }
    ajaxStr += "&keyword=" + encodeURIComponent(fish.trim(fish.one("#KeyWord").val()));

    //出游天数
    ajaxStr += "&days=" + fish.trim(fish.one("#days").val());

    //目的地城市
//    ajaxStr += "&areaname=" + fish.trim(fish.one("#areaname").val());
    ajaxStr += "&endcityids=" + fish.trim(fish.one("#EndCityIds").val());

    //出发城市id
    ajaxStr += "&scityId=" + fish.trim(fish.one("#scityId").val());
    //目的省份
    ajaxStr += "&provid=" + fish.trim(fish.one("#provname").val());


    //关联景点id 多个用，隔开
    if (fish.one("#rsceneryId").val() == null) {
        ajaxStr += "&rsceneryId=" + "0";
    }
    ajaxStr += "&rsceneryId=" + fish.trim(fish.one("#rsceneryId").val());

    //主题分类 多个用，隔开
    if (fish.one("#themeId").val() == null) {
        ajaxStr += "&themeId=" + "0";
    }

    ajaxStr += "&themeId=" + fish.trim(fish.one("#themeId").val());

    // 增加同城专线过滤条件 themeId: ,161 @20151102 by kevin
    /**
     *  当过滤条件为同城专线时，热门主题部分清除，只保留同城专线
     *  @20151104 by kevin
     */
    // 需要清除的热门主题白名单
    // var zhutiTvalue = ['131', '155', '100', '96', '101'];
    var filterTvalue = function (str) {
        str = str.replace(/131,?/, '').
            replace(/155,?/, '').
            replace(/100,?/, '').
            replace(/96,?/, '').
            replace(/101,?/, '');
        return str;
    };
    var cleanChoose_box = function () {
        var len = zhutiTvalue.length,
            i;

        for (i = 0; i < len; i++) {
            $choose_box.find('[hvalue="' + zhutiTvalue[i] + '"]').remove();

            $theme_box.find('b[tvalue="' + zhutiTvalue[i] + '"]').closest('.sort_a').removeClass('current');
        }
    };

    // 清除所有热门主题 @201511041550
    // $choose_box = $('.choose_box');
    // $theme_box = $('[sign="themeId"]');

    // if ($('#ly-tour-stamp').attr('checked')) {
    //     var zhutiTvalue = $('#themeId').val().split(',');
    //     $('#themeId').val('161');
    //     var indexof = ajaxStr.indexOf('&themeId=') + 9;
    //     ajaxStr = ajaxStr.slice(0, indexof);
    //     ajaxStr += '161';
    //     cleanChoose_box();
    //     // location.href.replace(zhutiTvalue.join(','), '161');
    // }

    //价格区间 1.0-50  2.50-100 3.100
//    ajaxStr += "&priceRange=" + fish.trim(fish.one("#priceRange").val());
    if(Number(fish.one("#LeftPrice").val())){
        ajaxStr += "&leftprice=" + fish.one("#LeftPrice").val();
    }else{
        fish.one(".min").css("color:#999").val("¥");
    }
    if(Number(fish.one("#RightPrice").val())){
        ajaxStr += "&rightprice=" + fish.one("#RightPrice").val();
    }else{
        fish.one(".max").css("color:#999").val("¥");
    }
    //出游日期
    if(Number(fish.one("#LeftDate").val())){
        ajaxStr += "&leftdate=" + fish.one("#LeftDate").val();
    }else{
        fish.one("#firsttime").val("最早出发").css("color:#999")
    }
    if(Number(fish.one("#RightDate").val())){
        ajaxStr += "&rightdate=" + fish.one("#RightDate").val();
    }else{
        fish.one("#lasttime").val("最晚出发").css("color:#999")
    }
    if(Number(fish.one("#WeekendTag").val())){
        ajaxStr += "&weekendtag="+fish.one("#WeekendTag").val();
    }
    ajaxStr += "&tourtype="+fish.one("#TourType").val();
    if(Number(fish.one("#TourType").val())){
        ajaxStr += "&searchcityid="+fish.one("#SearchCityId").val();
        ajaxStr += "&tourscityid="+fish.one("#TourSCityId").val();
    }

    //排序
    ajaxStr += "&SortType=" + fish.trim(fish.one("#SortType").val());
    if(fish.one("#SortType").val()=="3"){
        ajaxStr += "&priceorderby="+fish.one(".sortPrice").attr("priceorderby");
    }

//    searchStr = ajaxStr;
    if($(".supplier").length>0)
    {
        ajaxStr+="&supid="+$(".supplier b").attr("supid");
//        searchStr+="&supid="+$(".supplier b").attr("supid");
    }
    return ajaxStr;

}
getpage();
/*
 * 异步加载数据
 */

function pageValidation(data) {
    var list_html = "";
    var newarr = [];
    var starttimesummer = new Date().getTime(),
        endtimesummer = new Date("2016/08/31 23:59:59").getTime();
     if (data.sceneryinfo && data.sceneryinfo.length != 0) {
          for (var i = 0; i < data.sceneryinfo.length; i++) {
                    var linkUrl = "/bustour/ProductDetail_" + data.sceneryinfo[i].id + ".html";
//                    var dsn = data.sceneryinfo[i].name;
                    var istczx = 0;
                    var summerlogo="";
                    var namek=data.sceneryinfo[i].nameKey;
                    var nameT=data.sceneryinfo[i].nameMainTitle;
                    var nameS=data.sceneryinfo[i].nameSecondTitle;
                    var dsn=namek+nameT;
              // 政策标签、特色标签、主题标签 (按顺序取，共取5个)  @20151022 by `
                    var getAllTag = function (data) {
                        var allTag = '',
                            policyLen = data.policyLabList ? data.policyLabList.length : 0,
                            extraLen = data.extralablist ? data.extralablist.length : 0,
                            labLen = data.lablist ? data.lablist.length : 0,
                            max = 5,
                            remain, i, j, k;
                        if (policyLen > max) {
                            policyLen = max;
                        }
                        for (i = 0; i < policyLen; i++) {
                            allTag += '<em class="policyTag">' + data.policyLabList[i].labname + '</em>';
                        }

                        remain = max - i;
                        if (remain > extraLen) {
                            remain = extraLen;
                        }
                        for (j = 0; j < remain; j++) {
                            // 同程专线特别标示  @20151102 by kevin
                            if (data.extralablist[j].labname === '同程专线') {
                                istczx = 1;
                                allTag = '<em class="ly-tour-label">同程专线</em>'+allTag;
                                if(starttimesummer<endtimesummer){
                                    summerlogo ='<span><img src="http://img1.40017.cn/cn/s/yry/2016/pc/final/detailLogo.png" /></span>';
                                    if(dsn.length>54){
                                        dsn=dsn.substr(0,54);
                                        nameS="";
                                    }
                                    if((namek+nameT+nameS).length>54){
                                        nameS=nameS.substr(0,54-dsn.length);
                                    }
                                }
                                continue;
                            }
                            allTag += '<em class="extraTag">' + data.extralablist[j].labname + '</em>'
                        }
                        remain = max - i - j;
                        if (remain > labLen) {
                            remain = labLen;
                        }
                        for (k = 0; k < remain; k++) {
                            allTag += '<em class="labelTag">' + data.lablist[k].labname + '</em>';
                        }
//                        allTag+='<em>点评返现</em>';
                        allTag+=dpfxInfo;
                        return allTag;
                    };

                    var allTagHtml = getAllTag(data.sceneryinfo[i]);
                    //加点击事件
                    var newsite = i+(Number(fish.one("#tcPage").val())-1)*10;

                    var clicktap = "_tcTraObj._tcTrackEvent('zxzbgty_1', 'click', 'pc周边跟团游列表页', '^listview^"+fish.one("#scityId").val()+"^"+(newsite+1)+"^"+data.sceneryinfo[i].id+"^"+istczx+"^')";

                    list_html = list_html + '<li resid="'+data.sceneryinfo[i].id+'" >\
                        <div class="img_contain">\
                        <a target="_blank"  href="' + linkUrl + '?#2" onclick="'+clicktap+'" title="' + data.sceneryinfo[i].name + '">\
                            <img data-img-src="' + data.sceneryinfo[i].pic + '" alt=""/>\
                            <div class="dcity"><span class="days">'+data.sceneryinfo[i].pdtype +'</span><span class="adress"><i>'+data.sceneryinfo[i].srcityname+'</i><em></em><i>'+data.sceneryinfo[i].areaname+'</i></span></div>\
                            </a>\
                        </div>\
                        <div class="info_contain">\
                            <h3>\
                            <a target="_blank" onclick="'+clicktap+'" title="' + data.sceneryinfo[i].name + '" href="' + linkUrl + '?#2" ><b>'+dsn+'</b><i>'+nameS+'</i>' +summerlogo+'</a>\
                            </h3>\
                            <div class="zhg_tag_box">' + allTagHtml + '</div>\
                            \
                        <p class="describe ellipsis">\
                            ' + data.sceneryinfo[i].special + '\
                                    </p>';
                    var GroupList= data.sceneryinfo[i].GroupList;
                    if ( !(GroupList==null||GroupList=="")) {
                        var weekarr = ["周日","周一","周二","周三","周四","周五","周六"];
                        list_html = list_html + '<div class="travel-time"><div>出游日期：';
                        var grouplen = GroupList.length>4?4:GroupList.length;
                        for (var j = 0; j < grouplen; j++) {
                            var grouptimestr = GroupList[j].Date+"";
                            var grouptime = grouptimestr.substr(0,4)+"/"+grouptimestr.substr(4,2) +"/"+ grouptimestr.substr(6,2);
                            var weekcon = weekarr[new Date(grouptime).getDay()];
                            list_html+=grouptimestr.substr(4,2)+"/"+grouptimestr.substr(6,2)+"("+weekcon+")" ;
                            if(j<(grouplen-1)){
                                list_html+="、"
                            }
                        }
                        if(grouplen==4){
                            list_html+="...";
                        }
                        var nowtimestr=GroupList[0].Date+"";
                        var nowtime=nowtimestr.substr(0,4)+"/"+nowtimestr.substr(4,2);
                        list_html = list_html + '</div><span class="timemore" datetime="'+nowtime+'">更多</span></div>';
                    }
              var dpcomment = "";
              var ReviewCount = data.sceneryinfo[i].ReviewCount,
                  ReviewGoodRate = parseInt(data.sceneryinfo[i].ReviewGoodRate);
              if(ReviewCount>5||ReviewGoodRate>80){
                  dpcomment='<div  class="commentDiv" pid="' + data.sceneryinfo[i].id + '"><span class="crCount">' + ReviewGoodRate  + '%</span>满意度<div class="commentnum"  goodcon="0"><span>' + ReviewCount + '</span>条点评</div></div>';
              }

                    list_html = list_html + '</div>\
                                <div class="price_contain" >\
                        <div class="tc_price">\
                        <span>&yen;<b>'+data.sceneryinfo[i].price+'</b></span>起\
                    </div>\
                    <a class="a_book" target="_blank" href="' + linkUrl + '?#2" onclick="'+clicktap+'">查看详情</a>'+dpcomment+'\
                    </div>\
                    <div class="mycal" calstate="0"></div></li>';
                    newarr.push(data.sceneryinfo[i].id);
                }
            }
            fish.one(".info_list ul").html(list_html);
    timemoreclick();
    commentclick();

            //资源列表图片延时加载
            fish.all(".img_contain img").lazyLoad({
                attr: "data-img-src",
                preSpace: 100
            });
    //展开出游日期
    buryPoint(".timemore",{
        category:"shortTour_list_chuyouriqi",
        action:"出游日期点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";

    });
    //查看详情    111 线路详情-点击立即预定进入详情页
    buryPoint(".a_book",{
        category:"shortTour_list_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
      
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });
    //详情页图片点击事件 111 线路详情-点击图片进入详情页
    buryPoint(".img_contain",{
        category:"shortTour_list_pic_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
       var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");

        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });

    //详情页里h3 a统计事件  111 线路详情-点击标题进入详情页
     buryPoint(".info_contain h3 a",{
        category:"shortTour_list_bt_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });
    //展开点评
    buryPoint(".commentnum",{
        category:"shortTour_list_dp",
        action:"点评点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
    });

}

commentclick();
function commentclick(){
    $(".commentnum").click(function(){
        var parentsem = $(this).parents("li");
        parentsem.find(".mycal").css("display","none");
        parentsem.find(".timemore").removeClass("unfold");
        if($(this).hasClass("unfold")){
            $(this).removeClass("unfold");
            parentsem.find(".commentcon").css("display","none");
        }else{
            $(this).addClass("unfold");
            if(Number($(this).attr("goodcon"))){
                parentsem.find(".commentcon").css("display","block");
            }else{
                $(this).attr("goodcon",1);
                lookgood(parentsem.attr("resid"),parentsem)
            }
        }
    })
}

/*
 * 同步拼接url跳转页码
 */

function getListUrl(tvalue) {
    //天数
    var uDays = fish.trim(fish.one("#days").val()) == "" ? "1" : fish.trim(fish.one("#days").val()),
    //目的地
        uAreaname = fish.trim(fish.one("#areaname").val()) == "" ? "0" : fish.trim(fish.one("#areaname").val()),
    //出发城市
        uScityId = fish.trim(fish.one("#scityId").val()) == "" ? "0" : fish.trim(fish.one("#scityId").val()),
    //游玩景点
        uRsceneryId = fish.trim(fish.one("#rsceneryId").val()) == '' ? '0' : fish.trim(fish.one("#rsceneryId").val()),
    //主题
        uThemeId = fish.trim(fish.one("#themeId").val()) == '' ? '0' : fish.trim(fish.one("#themeId").val()),
    //价格
        uPriceRange = fish.trim(fish.one("#priceRange").val()) == "" ? "0" : fish.trim(fish.one("#priceRange").val()),
    //关键字
        uKeyWord = fish.trim(fish.one("#KeyWord").val()) == '' ? '""' : fish.trim(fish.one("#KeyWord").val()),
    //出游时间
        WeekendTag = fish.trim(fish.one("#WeekendTag").val()),
    //最早出发时间
        LeftDate = fish.trim(fish.one("#LeftDate").val()),
    //最晚出发时间
        RightDate  = fish.trim(fish.one("#RightDate").val()),
    //左边价格
        LeftPrice = fish.trim(fish.one("#LeftPrice").val()),
    //右边价格
        RightPrice  = fish.trim(fish.one("#RightPrice").val()),
    //判断出发地参团、目的地参团导航是否出现状态值
        TourType = fish.trim(fish.one("#TourType").val()),
    //搜索城市ID
        SearchCityId = fish.trim(fish.one("#SearchCityId").val()),
    //出发地ID
        TourSCityId = fish.trim(fish.one("#TourSCityId").val()),
    //目的地ID
        EndCityIds = fish.trim(fish.one("#EndCityIds").val());

        uProvId = !fish.trim(fish.one("#provname").val()) ? 0 : fish.trim(fish.one("#provname").val());

    // @20151104 by kevin
    if (tvalue) {
        uThemeId = tvalue;
    }

    //loading动画
    fish.mPop({
        content: fish.dom("#inline_example_load"),
        bgclose: false
    });
    var supid="";
    if($(".supplier").length>0)
    {
        supid=$(".supplier b").attr("supid");
    }
    var search="";

    if(TourType>0){
        uKeyWord = fish.trim(fish.one("#UrlKeyWord").val()) == '' ? '""' : fish.trim(fish.one("#UrlKeyWord").val());
        search = '?tourtype='+TourType+'&searchcityid='+SearchCityId;
        search += TourSCityId>0? '&tourscityid='+TourSCityId :"";
    }
    search += (!(EndCityIds=="0"||EndCityIds==""))? ((search.indexOf("?")>-1?"&":"?")+'endcityids='+EndCityIds) :"";
    if(WeekendTag>0){
        LeftDate=0;
        RightDate=0;
        search += (search.indexOf("?")>-1?"&":"?")+"weekendtag="+WeekendTag;
    }
    search += LeftDate>0? (search.indexOf("?")>-1?"&":"?")+'leftdate='+LeftDate :"";
    search += RightDate>0? (search.indexOf("?")>-1?"&":"?")+'rightdate='+RightDate :"";
    search += LeftPrice>0? (search.indexOf("?")>-1?"&":"?")+'leftprice='+LeftPrice :"";
    search += RightPrice>0? (search.indexOf("?")>-1?"&":"?")+'rightprice='+RightPrice :"";

    if(supid)
    {
        search+=(search.indexOf("?")>-1?"&":"?")+"supid="+supid;
    }

    setTimeout(function () {
        window.location.href = "/bustour/bustoursearchlist_" + uDays + "_" + uAreaname + "_" + uScityId + "_" + uRsceneryId + "_" + uThemeId + "_" + uPriceRange + "_" + uKeyWord + '_' + uProvId + ".html"+search;
    }, 500);
}

//清除全部已选条件

function clearAllSelect() {
    fish.one(".select_box .clear_block").on("click", function () {
        if (fish.all("i", fish.one(".select_box")).length > 0) {
            fish.all("i", fish.one(".select_box")).each(function (ele) {
                var type = fish.one(this).attr("screentype");
                $(".supplier").remove();
                //清空隐藏域参数值
                clearSwitchFn(type, "");
                getListUrl();
            });
        }
    });
}

//清空隐藏域参数值,ivalue为多选所用

function clearSwitchFn(type, ivalue) {
    switch (type) {
        case "days":
            fish.one("#days").val("0");
            break;
        case "rsceneryId":
            fish.one("#rsceneryId").val("0");
            break;
        case "areaname":
            fish.one("#areaname").val("0");
            break;
        case "scityId":
            //            fish.one("#scityId").val("0");
            break;
        case "themeId":
            fish.one("#themeId").val("0");
            break;
        case "priceRange":
            fish.one("#priceRange").val("0");
            break;
        case "provname":
            fish.one("#provname").val("");
        case "WeekendTag":
            fish.one("#WeekendTag").val("0");
            fish.one("#RightDate").val("");
            fish.one("#LeftDate").val("");
            break;
        case "LeftDate":
            fish.one("#LeftDate").val("");
            break;
        case "RightDate":
            fish.one("#RightDate").val("");
            break;
        case "LeftPrice":
            fish.one("#LeftPrice").val("0");
            break;
        case "RightPrice":
            fish.one("#RightPrice").val("0");
            break;
        case "TourSCityId":
            fish.one("#TourSCityId").val("0");
            break;
        case "EndCityIds":
            fish.one("#EndCityIds").val("");
            break;
        default:
        // break;
        //其它
    }
}

//清空所有筛选值（点击搜索按钮时）

function clearByKeyWord(days) {
    if (days) {
        fish.one("#days").val(days);
    } else {
        fish.one("#days").val("0");
    }
    fish.one("#rsceneryId").val("0");
    fish.one("#areaname").val("0");
    //    fish.one("#scityId").val("0");
    fish.one("#themeId").val("0");
    fish.one("#priceRange").val("0");
    fish.one("#SearchCityId").val("0");
    fish.one("#TourType").val("0");
    fish.one("#TourSCityId").val("0");
    fish.one("#EndCityIds").val("");
    fish.one("#LeftDate").val("");
    fish.one("#RightDate").val("");
    fish.one("#WeekendTag").val("0");
    fish.one("#LeftPrice").val("0");
    fish.one("#RightPrice").val("0");
}

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

        return (history.length > 5) ? history.slice(0, 5) : history;
    };

    historyView.getWrapHTML = function () {
        return '' +
            '<div class=\"yry_history\">\
            <div class=\"his_head\">浏览历史</div>\
            <div class=\"his_items tcTraObj\" tctotype=\"shorttour_pc_searchlist_history\" tctoname=\"PC首页浏览历史\" tctovalue=\"8\">\
                {{items}}\
            </div>\
        </div>';
    };

    historyView.getInnerTemplate = function () {
        return '' +
            '<a href=\"/bustour/ProductDetail_{{pid}}.html\" target=\"_blank\" pid=\"{{pid}}\">\
            <img src=\"{{image}}\" alt=\"\" />\
            <span>{{title}}</span>\
            <em>{{price}}&nbsp;起/人</em>\
        </a>';
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
        if (!len) return;

        for (var i = 0; i < len; i++) {
            data[i].image = data[i].image.replace(/([^\.\/]+)(?=\.(jpg|jpeg|png|gif|bmp))/gi, function (match, name) {
                return name + '_150x100_00';
            });

            html += template.replace(regex, function (match, name, pos, str) {
                return data[i][name];
            });
        }

        fish.one('.right_page').html('bottom', wrapHTML.replace(regex, html));
    };


    historyView.renderHistory();
}());


fish.one(".search_input").on('focus', function () {

    if(fish.trim(fish.one(".search_input").val()) == "" || fish.one(".search_input").val() == "请输入目的地城市、景点、产品编号"){
        fish.one(".hot_history").css("display:block");
        var cheight = fish.one(".searchhistory").height(),
            cpaddTop = (cheight / 2) - 8,
            heighttrue = cheight - cpaddTop;
        fish.all(".tag_link").css("display:none");
    }

});
fish.one(".search_input").on('blur', function () {
    //        fish.one(".hot_history").css("display:none");
    if (fish.one(".search_input").val() != "" && fish.one(".search_input").val() != "请输入目的地城市、景点、产品编号") {
        fish.all(".tag_link").css("display:none");
    }
    else {
        fish.all(".tag_link").css("display:block");
    }

});


/**
 * 增加同城旅游专线标示
 * @20151102 by kevin
 */

(function ($) {
    // 增加筛选条件
    var $sortBar = $('.sort_bar');
    var stampHtml = '<div class="ly-tour-stamp">\
                        <input type="checkbox" name="ly-tour-stamp" id="ly-tour-stamp" />\
                        <div class="thumbnail">\
                            <label for="ly-tour-stamp" class="thumb">\
                                <div class="detail">\
                                    <p>严格选品 , 金牌线路</p>\
                                    <p>优质行程 , 服务保障<a href="http://www.ly.com/zhuanti/tczxzx" target="_blank">了解更多&gt;&gt;</a></p>\
                                </div>\
                            </label>\
                        </div>\
                    </div>';

    $sortBar.append(stampHtml);

    var $tourStamp = $('.ly-tour-stamp');
    var $tourDetail = $tourStamp.find('.detail');
    var settime = "";
    $tourStamp.find('.thumb').hover(function (e) {
        clearInterval(settime);
        $tourDetail.show();
    }, function (e) {
        settime=setTimeout(function(){
            $tourDetail.hide();
        },500)
    });

    var $checkbox = $('#ly-tour-stamp');

    $tourStamp.on('click.getdata', function (e) {
        // e.preventDefault();
        e.stopPropagation();

        if ($checkbox.attr('checked')) {
            getListUrl('161');
        } else {
            getListUrl('0');
        }

    });


    if ($('#themeId').val() === '161') {
        $checkbox.attr('checked', 'checked');
    }
})(jQuery);


// 增加统计功能 @20151112 by kevin
(function ($) {
    // 搜索按钮
    $('.search_btn').on('click', function (e) {
        _tcTraObj._tcTrackEvent("click", 'search', '搜索按钮');
        _tcTraObj._tcTrackEvent("shortTour_list_search_button","搜索按钮点击事件","周边跟团游PC列表页","^"+$("#search_input").val()+"^"+$(".at-name").attr("cid")+"^")
    });
})(jQuery);
//查看好评
function lookgood(rid,classname){
    /*
     * dpTypeId 0:全部 1：好评 2：中评 3：差评 4：有图
     * sortType 0：默认排序 1：最有价值 2：图片最多 3：时间排序 4：默认+精华点评 5：时间排序+精华点评 （目前4和5只针对国内游）
     * tagId	body		标签id	1:全部 2:好评 3:中评 4:差评 5:有图 6:最新 >6为用户标签
     * */
        $.ajax({
            url:"/bustour/json/ReviewsList.html?productId="+rid+"&tagId=1&sortType=0&page=1&pageSize=10",
            type:"get",
            dataType:"json",
            success:function(result){
                var data = JSON.parse(result);
                if(data.response.header.rspCode=="0000"){
                    var redata = data.response.body.dpList;
                    var con = '<div class="commentcon">';
                    var goodcommentnum=0;
                    for(var i=0; i<redata.length;i++){
                        var assess = redata[i].lineAccess,assesscon="";
                        if(assess=="差评"||assess==""){
                            continue;
                        }
                        if(goodcommentnum>2){
                            break;
                        }
                        goodcommentnum++;
                        if(assess=="好评"){
                            assesscon="好评";
                        }else if(assess=="中评"){
                            assesscon="中评";
                        }
                        assesscon=assess;
                        var commentcon = redata[i].dpContent.length>148?redata[i].dpContent.substr(0,148)+"...":redata[i].dpContent;
                        con += ' <span><em><s>'+assesscon+'</s><u>'+redata[i].dpUserName+'</u>' +
                            '<i>'+redata[i].dpDate+'</i>' +
                            '</em><p>'+commentcon+'</p></span>';
                    }
                    con += '<div class="lookcomment"><a href="/bustour/ProductDetail_'+rid+'.html#userComment" target="_blank">查看所有点评</a></div></div>';
                    classname.append(con);
                    //查看所有点评
                    buryPoint(".lookcomment a",{
                        category:"shortTour_list_dp_all",
                        action:"查看所有点评点击事件",
                        optabel:"周边跟团游PC列表页",
                        optalue:""
                    },function(cur,obj){
                        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
                        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
                    });


                }


            }
        })

}

//分页
function getpage(){
    var allpageNum = $("#totalPage").length>0 ? parseInt($("#totalPage").val()) : 0;
    if (allpageNum > 1) {
        $("#pageNum_box").removeClass("none");
    } else {
        $("#pageNum_box").addClass("none");
    }

    $("#pageNum_title").page({
        current: 1,
        pageNoParam:"page",
        initLoad:true,
        total:allpageNum,
        buildAjaxObj:function(){
            $("#tcPage").val(this.current);

            this.ajaxObj.data=sceneryListSearch();
            if(isloadimg){
                document.documentElement.scrollTop = document.body.scrollTop=$(".left_page").offset().top;
//                window.scrollTo(0, 0);
                //loading动画
                fish.mPop({
                    content: fish.dom("#inline_example_load"),
                    bgclose: false
                });
            }
        },
        ajaxObj: {
            url: '/bustour/json/shorttoursearch.html',
            data:sceneryListSearch(),
            type:"get",
            dataType:"json",
            success: function (data, page) {
                if(isloadimg){
                    //终止动画
                    fish.require("mPop", function () {
                        fish.mPop.close();
                    });
                    pageValidation(data);
                    var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
                   
                    if(!pageState){
                        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/page", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|page:"+page.current+"|*|" + isNewAB);
                    }else{
                        pageState = false;
                    }
                }
                isloadimg=true;


            }
        }

    });
}
//日历


function calendarfun(time,id,el,rid){
    var cal = new $.Calendar({
        open: true,
        id:id,
        skin: "white",
        wrapperWidth: 450,
        zIndex: 22,
        monthNum: 2
    });
    cal.pick({
        elems:$(document),
        startDate: time,
        mode: "rangeFrom",
        currentDate: [time],
//        showOtehrMonth:true,
        ajaxObj: {
            url: "/bustour/ProductDetail/BigPriceCalendar/"+rid+"/{year}/{month}?v="+Math.random(),
            dataType: "json",
            success: function(data){
                el.append($("#"+id));
                if (data && data.State.Success) {
                    var obj = {};
                    for (var i = 0, len = data.PriceList.length; i < len; i++) {
                        var item = data.PriceList[i];
                        obj[item.day] = item;
                    }
                    return obj;
                }
            }
        },
        buildContent: function(td, date, dateStr, data) {
            var day = date.getDate(),
                str1 = dateStr || day,
                y = date.getFullYear(),
                m = date.getMonth()+1,
                d = date.getDate(),
                _class = "";
            str = '<span class="d">'+str1+'</span>';
            if (data && data[day]) {
                _class = "price";
                str = '<a target="_blank" href="/bustour/ProductDetail_'+rid+'.html?datetime='+y+'/'+m+'/'+d+'?#2"><span class="d" >'+str1+'<br><em style="color:#f63;">&yen;'+data[day].basicPrice+'起</em></span></a>';
            }
            td.innerHTML = str;
            $(td).addClass(_class);

        },
        fn:function(year, month, day, td,elem){
            if($(td).hasClass("price")){
                var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
                var tcreindex = ($("#tcPage").val()-1)*10+$(td).parents("li").index()+1,
                    tcrid = $(td).parents("li").attr("resid");
                var cttitle="";
                if($("#TourType").val()>0){
                    cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
                }
                _tcTraObj._tcTrackEvent("shortTour_list_day_detail", "详情页点击事件", "周边跟团游PC列表页", "^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle);

                // 111 线路详情-点击出游日期进入详情页
                _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
            }

    }

    });

}
function timemoreclick(){
    $(".timemore").click(function(){
        var parents = $(this).parents("li");
        parents.find(".mycal").css("display","block");
        if(parents.find(".commentcon").length>0){
            parents.find(".commentcon").css("display","none");
            parents.find(".commentnum").removeClass("unfold");
        }
        if($(this).hasClass("unfold")){
            $(this).removeClass("unfold");
            parents.find(".mycal").css("display","none");
        }else{
            $(this).addClass("unfold");
            if(Number($(this).attr("calstate"))){
                parents.find(".mycal").css("display","block");
            }else{
                $(this).attr("calstate","1");
                calendarfun($(this).attr("datetime"),"a"+parents.attr("resid")+"1",parents.find(".mycal"),parents.attr("resid"));
            }
        }
    })
}
timemoreclick();
//价格区间
$(".pricebox").hover(function(){
    $("#priceinner").addClass("pricelist");
    $(".price-bot").removeClass("none");

},function(){
    $("#priceinner").removeClass("pricelist");
    $(".price-bot").addClass("none");
})
$(".inputbox input").focus(function(){
    $(this).css("color","#333");
}).blur(function(){
    if($(this).val()==""||$(this).val()=="¥"){
        $(this).css("color","#999").val("¥");
    }
}).keyup(function(){
    $(this).val("¥"+$(this).val().replace(/[^\d]/g,""))
});
$(".price-bot a").click(function(){
    pageState = true;
    var minprice = $(".min").val().split("¥")[1],
        maxprice = $(".max").val().split("¥")[1];
    if(minprice){
        $("#LeftPrice").val(minprice);
    }else{
        $("#LeftPrice").val(0);
    }
    if(maxprice){
        $("#RightPrice").val(maxprice);
    }else{
        $("#RightPrice").val(0);
    }
    getListUrl();
});
$(".price-bot span").click(function(){
    if($("#LeftPrice").val()=="0"&&$("#RightPrice").val()=="0"){
        $(".min").css("color","#999").val("¥");
        $(".max").css("color","#999").val("¥");
        return;
    }
    $("#LeftPrice").val(0);
    $("#RightPrice").val(0);
    getListUrl();
})
//出游日期
var cals=new $.Calendar({
    skin: "white"
});
var endDate = new Date();
endDate.setMonth(endDate.getMonth() + 3);
$("#firsttime").focus(function(e){
    cals.pick({
        elem: this,  // 如果设置了elem的值，且elem参数为input框
        startDate: new Date(),
        mode: "rangeFrom",
        endDate: $("#lasttime").val(),
        currentDate: [new Date(), $("#lasttime").val()],
        fn:function(year, month, day){
            var times = year+timestyle(month)+timestyle(day);
//            $("#LeftDate").val(times);
            $("#WeekendTag").val("0");
            $("#firsttime").css("color","#333").attr("date",times);
        }
    });
})
$("#lasttime").focus(function(e){
    var startDate = $("#firsttime").val()=="最早出发" ? new Date() : $("#firsttime").val();

    cals.pick({
        elem: this,  // 如果设置了elem的值，且elem参数为input框
        startDate: startDate,
        mode: "rangeFrom",
        currentDate: [startDate],
        fn:function(year, month, day){
            var times = year+timestyle(month)+timestyle(day);
//            $("#RightDate").val(times);
            $("#WeekendTag").val("0");
            $("#lasttime").css("color","#333").attr("date",times);
        }
    });
})
function timestyle(time){
    if(time<10){
        time = "0"+time;
    }
    return time+"";
}
$(".autotime b").click(function(){
    if($("#firsttime").val()!="最早出发"||$("#lasttime").val()!="最晚出发"){
        if($("#firsttime").attr("date")){
            $("#LeftDate").val($("#firsttime").attr("date"));
        }
        if($("#lasttime").attr("date")){
            $("#RightDate").val($("#lasttime").attr("date"));

        }

        getListUrl();
    }
});
//清空日期
$(".btn-clear").click(function(){
    $("#firsttime").css("color","#999").val("最早出发");
    $("#lasttime").css("color","#999").val("最晚出发");
})
window.onload = function(){
    $(".img_contain a").each(function(){
        var newHref=$(this).attr("href");
        newHref+="?#2";
       $(this).attr({"href":newHref})
    })
    $(".info_contain h3 a").each(function(){
        var newHref=$(this).attr("href");
        newHref+="?#2";
       $(this).attr({"href":newHref})
    })
    $(".a_book").each(function(){
        var newHref=$(this).attr("href");
        newHref+="?#2";
       $(this).attr({"href":newHref})
    })



    buryPoint(".screennav li",{
        category:"shortTour_cfdct",
        action:"",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        if($(cur).index()==0){
            obj["action"] = "出发地参团点击事件";
        }else{
            obj["action"] = "目的地参团点击事件";
        }
        var totalNum=0;
        if($("#TotalCount")){
            totalNum=$("#TotalCount").val();
        }
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] = "^"+$("#scityId").val()+"^"+startCity+"^";
        // _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/filter", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|rc:" +totalNum);
    });
    buryPoint(".select_conlst .sort_a",{
        category:"",
        action:"",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        if($(cur).parents("dl").attr("sign")=="EndCityIds"){
            obj["category"] = "shortTour_list_city_select";
            obj["action"] = "城市筛选点击事件";
            obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $.trim($(cur).find("b").html())+"^"+cttitle+"^";

        }else if($(cur).parents("dl").attr("sign")=="TourSCityId"){
            obj["category"] = "shortTour_list_city_select";
            obj["action"] = "城市筛选点击事件";
            obj["optalue"]="^"+$("#scityId").val()+"^"+$("#TourSCityId").val()+"^"+$.trim($(cur).find("b").html())+"^"+cttitle+"^";
        }else if($(cur).parents("dl").attr("sign")=="rsceneryId"){
            obj["category"] = "shortTour_list_scenery";
            obj["action"] = "热门景点点击事件";
            obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $.trim($(cur).find("b").html())+"^"+cttitle+"^";

        }else if($(cur).parents("dl").attr("sign")=="themeId"){
            if($(cur).parents("dl").children(".title").html()=="热门主题："){
                obj["category"] = "shortTour_list_theme";
                obj["action"] = "线路主题点击事件";
                obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $.trim($(cur).find("b").html())+"^"+cttitle+"^";


            }else if($(cur).parents("dl").children(".title").html()=="线路特色："){
                obj["category"] = "shortTour_list_tese";
                obj["action"] = "线路特色点击事件";
                obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $.trim($(cur).find("b").html())+"^"+cttitle+"^";

            }
        }else if($(cur).parents("dl").attr("sign")=="days"){
            obj["category"] = "shortTour_list_day";
            obj["action"] = "游玩天数点击事件";
            obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $.trim($(cur).find("b").html())+"^"+cttitle+"^";

        }else if($(cur).parents("dl").attr("sign")=="WeekendTag"){
            obj["category"] = "shortTour_list_chuyouriqi";
            obj["action"] = "出游日期点击事件";
            if($(cur).attr("sign")=="LeftDate" || $(cur).attr("sign")=="RightDate"){
                return;
            }else{
                obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ $(cur).find("b").attr("tvalue")+"^"+cttitle+"^";
            }

        }
        var totalNum=0;
        if($("#TotalCount")){
            totalNum=$("#TotalCount").val();
        }

        // _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/filter", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|rc:"+ totalNum);
    })
    buryPoint(".autotime b",{
        category:"shortTour_list_chuyouriqi",
        action:"出游日期点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var leftdate = $("#firsttime").val()=="最早出发" ? "" :$("#firsttime").val(),
            rightdate = $("#lasttime").val()=="最晚出发" ? "" :$("#lasttime").val(),
           startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^zx^"+ leftdate+"^"+rightdate+"^"+cttitle+"^";
        var totalNum=0;
        if($("#TotalCount")){
            totalNum=$("#TotalCount").val();
        }
    
        // _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/filter", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|rc:"+totalNum );
    });
    buryPoint(".price-bot a",{
        category:"shortTour_list_price",
        action:"价格筛选点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var leftprice = $(".min").val()=="¥" ? "" :$(".min").val().split("¥")[1],
            rightprice = $(".max").val()=="¥" ? "" :$(".max").val().split("¥")[1],
            startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+ leftprice+"^"+rightprice+"^"+cttitle+"^";
        var totalNum=0;
        if($("#TotalCount")){
            totalNum=$("#TotalCount").val();
        }

        // _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/filter", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|rc:"+ totalNum);
    });
    //同程专线
    buryPoint("#ly-tour-stamp",{
        category:"shortTour_list_tczx",
        action:"同程专线筛选点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val(),
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+cttitle+"^";
         fish.cookie.set( {name:"sortcookie", value:"1",seconds:"5",path:"/"} );
    });
    //排序
    buryPoint(".sort_btn",{
        category:"shortTour_list_paixu",
        action:"排序点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        var sort = "";
        if($(cur).attr("tvalue")==1){
            sort="推荐降序";
        }else if($(cur).attr("tvalue")==2){
            sort="销量降序";
        }else if($(cur).attr("tvalue")==3){
            if($(cur).attr("priceorderby")==0){
                sort="价格升序";
            }else{
                sort="价格降序";
            }

        }
        obj["optalue"]="^"+$("#scityId").val()+"^"+startCity+"^"+sort+"^";
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/sort", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity+"|*|" + isNewAB );
    
       
    });
    //包团定制
    buryPoint(".btdz",{
        category:"shortTour_list_diygroup",
        action:"包团定制点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
    });
    //精品线路推荐
    buryPoint(".latest_activity",{
        category:"shortTour_list_recommend",
        action:"精品线路推荐点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
    });
    //浏览历史模块
    buryPoint(".his_items a",{
        category:"shortTour_list_history_product",
        action:"浏览历史产品点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+$(cur).attr("pid")+"^"+$(cur).index()+"^";
    });
    //展开出游日期
    buryPoint(".timemore",{
        category:"shortTour_list_chuyouriqi",
        action:"出游日期点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
    });
    //查看详情
    buryPoint(".a_book",{
        category:"shortTour_list_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){

            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
      
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });
    //展开点评
    buryPoint(".commentnum",{
        category:"shortTour_list_dp",
        action:"点评点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^";
    });
    //城市选择
    buryPoint(".all-city-box li a",{
        category:"shortTour_list_select_city",
        action:"城市选择点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="^"+ $.trim($(this).html())+"^"+startCity+"^";
    });
    //搜索按钮
    /*buryPoint(".search_btn",{
        category:"search",
        action:" /shortTour/list",
        optabel:"/sbox/k",
        optalue:""
    },function(cur,obj){
       
        var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        obj["optalue"] ="|*|k:"+ $("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+startCity;
      
    });*/
     //详情页图片点击事件
    buryPoint(".img_contain",{
        category:"shortTour_list_pic_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
       var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });

    //详情页里h3 a统计事件
     buryPoint(".info_contain h3 a",{
        category:"shortTour_list_bt_detail",
        action:"详情页点击事件",
        optabel:"周边跟团游PC列表页",
        optalue:""
    },function(cur,obj){
        var cttitle="";
        if($("#TourType").val()>0){
            cttitle = $(".screennav li.active").index()==0 ? "cfdct" : "mddct";
        }
       var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();
        
        var tcreindex = ($("#tcPage").val()-1)*10+$(cur).parents("li").index()+1,
            tcrid = $(cur).parents("li").attr("resid");
        obj["optalue"] ="^"+$("#scityId").val()+"^"+startCity+"^"+tcreindex+"^"+cttitle;
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/detail", "|*|pos:"+tcreindex+"|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|pjId:2023|*|cityId:"+startCity+"|*|resId:"+tcrid+"|*|" + isNewAB);
    });
    //进入页面
    var rcVlue=0;
    if($(".warning").length>0){
        rcVlue=0;
    }else{
        rcVlue=$("#TotalCount").val();
    }
    
   var startCity = $("#TourType").val()>0 ? ($("#TourType").val()==1?$("#EndCityIds").val():$("#TourSCityId").val() ): $("#scityId").val();

    var scityid="";
    if($("#scityId").val()==0){
        scityid="";
    }else{
        scityid=$("#scityId").val();
    }
    //初始化埋点
    _tcTraObj._tcTrackEvent("shortTour_list_enter", "进入PC列表页","周边跟团游PC列表页", "^"+ scityid +"^"+ startCity +"^");
    _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/show", "|*|k:"+$("#search_input").val()+"|*|locCId:"+scityid+"|*|cityId:"+startCity+"|*|rc:"+rcVlue+"|*|"+isNewAB);
    if(fish.cookie.get("sortcookie")){
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/filter", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+scityid+"|*|rc:" +rcVlue+"|*|" + isNewAB);
    }
    if(fish.cookie.get("searchcookie")){
        _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/sbox/k", "|*|k:"+$("#search_input").val()+"|*|locCId:"+$("#scityId").val()+"|*|cityId:"+scityid+"|*|rc:" +rcVlue+"|*|"+isNewAB);
    }


}

if($(".hover_show_img")[0]){
    $(".hover_show_img").remove();
}



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

                            _tcTraObj._tcTrackEvent("search", "/shortTour/list", "/sbox/ac", "|*|k:"+ value +"|*|locCId:"+ $("#scityId").val() +"|*|cityId:"+ $(".at-name").attr("cid") +"|*|rc:0|*|");

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
                                    _tcTraObj._tcTrackEvent("shortTour_list_search_ac","下拉列表点击点击事件","周边跟团游PC大首页","^"+$(this).find("span").attr("key")+"^"+(Number($(this).parent().parent().attr("seat"))+1)+"^"+$(".at-name").attr("cid")+"^");

                                    fish.stopBubble(e);

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
                    _tcTraObj._tcTrackEvent('search', '/shortTour/list','/sbox/ac/click', '|*|k:'+ this.input[0].value +'|*|ct:'+ this.input[0].value +'|*|pos:'+ this.index +'|*|locCId:'+ $("#scityId").val() +'|*|cityId:'+ $(".at-name").attr("cid") +'|*|pjId:2023|*|jpTp:'+ tjType +'|*|resCId:'+ $(".at-name").attr("cid") +'|*|ctTp:'+ $(param.keyWord, this.trs[this.index]).data("type") +'|*|');
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

        offset: { left: "-2",top:"-2"},

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
                    <span class='listContent' data-type=" + data.Type + " data-id=" + data.Id + " data-url=" + data.Url + " key=" + data.ShowName + ">" + (data.ShowName.replace(new RegExp("(" + value + ")", "i"), "<span class='fit'>$1</span>")) + "</span>\
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
$(".slide_main1").addClass("tc_ac_tr");
//$(".btdz").addClass("tc_ac_tr");
//$(".latest_activity li").addClass("tc_ac_tr");
$(".latest_activity li").css({"width": "210px","height": "124px"}).append("<b class='tc_ac_tr'></b>");
$(".latest_activity li a").css("float","left");
$(".top_warp").css({"width": "1190px","height": "110px","position":"relative"}).append("<b class='tc_ac_tr'></b>");
$(".slide_main_top1").css("float","left");
$(".top_warp b.tc_ac_tr").css({"position":"absolute","right":"0","top":"0","z-index":"100"});