/**
 * Created by byr17699 on 2016/9/28.
 */
/**
 * Created by byr17699 on 2016/9/21.
 */
var Swiper = require('/modules/swiper/0.1.0/index')
require('/modules/scrollspy/1.2.0/index')
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
    this.event();
    this.scrollNav();
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

    $(".J_menu li").on("click",function(){
      var self = $(this),
        index = self.index();
      self.addClass("active").siblings("li").removeClass("active");
      $(".menucon").children(".pc").eq(index).removeClass("none").siblings().addClass("none");
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
