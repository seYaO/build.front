/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function($) {
    var cityName= $("#cityName").val();
    var moreLink = "/localfun/"+cityName+".html?wvc1=1&wvc2=1&sourceId=1";
    var CityIndex = {},
    Common = require("/modules-lite/common/index"),
    destCityId = Common.getQueryString("cityId");
    var tpl={};
    var imgUrl = sessionStorage.getItem("ImageUrl");
    CityIndex.init = function() {
        require("/modules-lite/utils/lazyload/index");
        $("#destImg").attr("src",imgUrl);
        $(".page-header h2").append('<a href="/localfun/citylist?wvc1=1&wvc2=1&source=1" class="search_icon"></a>');
        $(".more_products").attr("href",moreLink);
        CityIndex.bigImg();
        CityIndex.singleList();
        // CityIndex.getSingleType();
        
        CityIndex.lazyLoad();
        window.onload = function(){
            _tcTraObj._tcTrackEvent("search", "/lineWanle/homepage", "/show", "|*|k:"+$("#cityName").val()+"|*|");
        }
    };
    //跳转品类列表页
    CityIndex.singleList = function(){
        $(".J_singleType").on("click","li",function(){
            var _self = $(this);
            var source = 1,
                SingleTypeId = _self.attr("data-id");
            if(SingleTypeId == 9){
                source = 0;
            }else{
                source = 1;
            }
            window.location.href = "/localfun/" + cityName +".html?wvc1=1&wvc2=1&singleTypeId="+SingleTypeId+"&sourceId="+source;
        });
    };

    CityIndex.bigImg = function(){
        var bigImgUrl = sessionStorage.getItem("ImageUrl");
        if(bigImgUrl === null || bigImgUrl === ""){
            bigImgUrl = $($(".J_hotProduct").find("img")[0]).attr("data-original").replace("172x172","640x360");
        }
    };
    

    //懒加载
    CityIndex.lazyLoad = function(){
        $(".J_hotProduct img").lazyload({
            "css": {opacity: 0},
            "effect": 'fadeIn'
        });
    };
    module.exports = CityIndex;
})(Zepto);
