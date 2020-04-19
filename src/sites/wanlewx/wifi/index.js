/**
 * @author fx(6698@ly.com)
 * @module  Wifi首页
 * @exports wifi
 * @desc
 * Wifi首页的模块
 *
 */
(function ($) {
    var tpl = {};
    var Wifi = {},
        Common = require("/modules-lite/common/index"),
        tplList = tpl;

    //懒加载
    Wifi.lazyLoad = function () {
        $(".good_rec img").lazyload({
            "css": { opacity: 0 },
            "effect": 'fadeIn'
        });
    };

    Wifi.m_slider = function () {
        $(".slider").slider({
            loop: true
        });

    };

    Wifi.init = function () {
        var self = this,
            share;
        share = require("/modules-lite/utils/share/index");
        share.enable();
        require("/modules-lite/utils/lazyload/index");
        self.m_slider();
        self.lazyLoad();
        // $('#wifi_list').find('span').on("click", function () {
        //     var self = $(this);
        //     $('#wifi_list').find('span').removeClass("select");
        //     self.addClass("select");
        // });
        // 10.101.42.118:3001
        $.ajax({
            url:"/intervacation/ajax/wxWanleAjax/schedule?ActivityId=3549&PeriodIds=2477",
            dataType:"jsonp",
            success:function(data){
                var list_length = data.ProList.length > 2 ? 2 : data.ProList.length;
                for (var i = 0; i < list_length; i++) {
                    var imgPath = data.ProList[i].ImagePath,
                        mTitle = data.ProList[i].MainTitle,
                        subTitle = data.ProList[i].SubTitle,
                        Satisfaction = data.ProList[i].Satisfaction,
                        linkurl = data.ProList[i].WxUrl,
                        tcprice = data.ProList[i].WebPrice;  

                    $(".good_rec ul").append(
                        '<li>'+
                            '<a href="'+linkurl+'">'+
                                '<div class="buying_box">'+
                                    '<img src="'+imgPath+'">'+
                                    '<p class="title">'+mTitle+'</p>'+
                                    '<div class="buy_bottom">'+
                                        '<div class="buy_price"><b><em>&yen;</em>'+tcprice+'</b></div>'+
                                        '<div class="satisfaction">'+Satisfaction+'%满意度</div>'+
                                    '</div>'+
                                '</div>'+
                            '</a>'+
                        '</li>'
                    );

                    
                }
            }
        })
    };



    
    module.exports = Wifi;
})(Zepto);



