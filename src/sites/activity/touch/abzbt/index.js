var Swiper = require('/modules/swiper/0.1.0/index')
require('/modules/activity/0.3.4/touch/touch')
require('/modules/scrollspy/1.2.0/index')
require('/modules/timer/0.2.0/touch')
require('./getarea')
require('/modules/ztutils/tel/0.1.1/index');
var swiper = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination',
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  paginationClickable: true,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: 2500,
  autoplayDisableOnInteraction: false
});

module.exports = {
        init: function(cfg) {
            var defaultCfg = {
                el: ".J_prolist",
                filter: true,
                IsSellOut: 0,
                beforeRender: function(data) {
                    return data;
                },
                afterRender: function() {

                }
            };
            var thisCfg = $.extend(defaultCfg, cfg);
            Activity.init(thisCfg);
            //this.getArea();
            this.event();
            this.scrollNav();
        },
        getArea:function(){
            Location.getArea({
                success: function (area) {
                    /*成功回调*/
                    this.renderTip("上海",area,function(){
                        /*确定回调：定位城市与默认城市相同不执行*/
                        //alert(area.AreaName);

                        if(area.AreaName == "华东地区"){
                            $(".area-now").html("华东出发");
                            $(".area-nav li").html("华北出发");
                            $(".J_con1").removeClass("none").siblings(".J_con2").addClass("none").trigger("scroll");
                            $(".J_con3").removeClass("none").siblings(".J_con4").addClass("none").trigger("scroll");
                            $(".J_con5").removeClass("none").siblings(".J_con6").addClass("none").trigger("scroll");
                        }
                    });
                }
            });
        },
        /*event*/
        event: function() {
            $(window).on("scroll", function() {
                var bodyH = $(window).scrollTop(),
                    toph = parseInt(24.70833333 * parseInt($("html").css("font-size")));
                if (bodyH >= toph) {
                    $(".switch").addClass("fixed");

                } else {
                    $(".switch").removeClass("fixed");
                    $(".switch-li a").removeClass("active");
                }
            });

            $(".J_area").on("click",function(){
                $(".area-nav").removeClass("none");
            });

            $(".area-nav li").on("click",function(){
                var self = $(this),
                    text = $(".area-now").text();
                $(".area-now").html(self.text());
                self.html(text);

                $(".area-nav").addClass("none");

                if($(".area-now").text() == "华东出发"){
                    $(".J_con1").removeClass("none").siblings(".J_con2").addClass("none").trigger("scroll");
                    $(".J_con3").removeClass("none").siblings(".J_con4").addClass("none").trigger("scroll");
                    $(".J_con5").removeClass("none").siblings(".J_con6").addClass("none").trigger("scroll");
                }
                if($(".area-now").text() == "华北出发"){
                    $(".J_con2").removeClass("none").siblings(".J_con1").addClass("none").trigger("scroll");
                    $(".J_con4").removeClass("none").siblings(".J_con3").addClass("none").trigger("scroll");
                    $(".J_con6").removeClass("none").siblings(".J_con5").addClass("none").trigger("scroll");
                }
            });
        },
        scrollNav: function() {
            var obj = $.scrollspy({
                navEl : $(".switch"),
                contentEl: ".J_NavBox",
                currentCls: "active",
                navItemEl: "li a",
                renderNav: false,
                fixedNav: function (el, sign) {
                    switch (sign) {
                        case 0:
                            //el.addClass("fixed");
                            break;
                        case 1:
                            el.addClass("fixed");
                            break;
                        case 2:
                            el.addClass("fixed");
                            break;
                    }
                },
            });

        }
}
