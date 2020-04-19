var Slidertoolbar = require("slidertoolbar/0.1.0/index");
var common = require("common/0.1.0/index");
var Login = require("login/0.1.0/index");
var Storage = require("common/0.1.0/storage");

require('./scrollspy')
require('/modules/timer/0.2.0/pc')
require('/modules/activity/0.3.2/pc/pc');

var valiLogin = function (callback, isopen) {
  isopen = isopen || 1;
  var us = common.cookie("us");
  var userid = null;
  if (us != null) {
    var name = 'userid';
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = us.match(reg);
    if (r != null)
      userid = unescape(r[2]);
  }
  if (userid == null || userid == "") {
    if (isopen == 1) {
      var login = new Login({
        loginSuccess: function () {
        }
      });
    }
    return;
  }
  callback(userid);
};
//
var Index = {};
Index.clickEvent = function(){
  $(".gotop").on("click",function(){
    $("html,body").animate({scrollTop:0});
  });

  //景点介绍
  $(".J_intro").hover(
    function(){
      var self = $(this);
      self.find(".detail").slideDown();
    },
    function(){
      var self = $(this);
      self.find(".detail").slideUp();
    }
  );


  $("#J_area").on("click",function(){
    var div = document.getElementById('J_nav');
    div.className ="area-nav";
  });

  $(".area-nav li").on("click",function(){
    var self = $(this),
      text = $(".area-now").text();
    $(".area-now").html(self.text());
    self.html(text);

    $(".area-nav").addClass("none");

    if($(".area-now").text() == "华东出发"){
      $(".J_con1").removeClass("snone").siblings(".J_con2").addClass("snone").trigger("scroll");
      $(".J_con3").removeClass("snone").siblings(".J_con4").addClass("snone").trigger("scroll");
      $(".J_con5").removeClass("snone").siblings(".J_con6").addClass("snone").trigger("scroll");
    }
    if($(".area-now").text() == "华北出发"){
      $(".J_con2").removeClass("snone").siblings(".J_con1").addClass("snone").trigger("scroll");
      $(".J_con4").removeClass("snone").siblings(".J_con3").addClass("snone").trigger("scroll");
      $(".J_con6").removeClass("snone").siblings(".J_con5").addClass("snone").trigger("scroll");
    }
  });
};
Index.initUi = function(){
  //滚动监听
  $(window).on('scroll', function() {
    var top = $(window).scrollTop();
    if(top<550) {
      $('.sidetab').hide();
    } else {
      $('.sidetab').show();
    }
  });
  var obj = $.scrollspy({
    navEl : $(".sidetab"),
    contentEl: ".J_NavBox",
    currentCls: "active",
    navItemEl: "li",
    renderNav: false,
    fixedNav: function (el, sign) {
      switch (sign) {
        case 0:
          //el.addClass("fixed");
          break;
        case 1:
          el.show();
          break;
        case 2:
          el.show();
          break;
      }
    },
  });
};
Index.getUser = function () {
  var loginInfo = $.cookie("us"),
    userid;
  if (loginInfo) {
    userid = /userid=(\d+)/i.exec(loginInfo);
    userid = userid ? userid[1] : userid;
  }
  return userid;
};
Index.slider = function(){
  var userid = Index.getUser();
  var slider = new Slidertoolbar({
    header: {
      icon: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/jyqct.html"><img src="//img1.40017.cn/cn/v/2015/group-index/48hourstxt.jpg"></a>',
      tooltips: '<a target="_blank" href="http://www.ly.com/dujia/zhuanti/jyqct.html"><img src="//img1.40017.cn/cn/v/2015/group-index/48hours.jpg"></a>'
    },
    topMenu: [{
      icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
      tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
      arrow: false
    }, {
      icon: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><div class="ico c-3"></div></a>',
      tooltips: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><span class="ico-title">我的收藏<i></i></span></a>',
      arrow: false
    }, {
      icon: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><div class="ico c-4"></div></a>',
      tooltips: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><span class="ico-title">意见反馈<i></i></span></a>',
      arrow: false
    }, {
      icon: '<a class="ico c-2"></a>',
      tooltips: '<a><span class="ico-title"><b class="J_tel">4007-777-777</b><i></i></span></a>',
      arrow: false
    }, {
      icon: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><div class="ico c-5"></div></a>',
      tooltips: '<a target="_blank" href="http://www.ly.com/newhelp/CustomerService.html"><span class="ico-title">在线客服<i></i></span></a>',
      arrow: false
    }],
    bottomMenu: [{
      icon: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
      tooltips: '<a target="_blank" href="http://www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
      arrow: false
    }, {
      icon: '<a><div class="ico c-7"></div></a>',
      tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
      tooltipCls: 'chujing-code',
      arrow: false
    }, {
      icon: '<a><div class="ico c-8"></div></a>',
      tooltips: '<a><span class="ico-title"><img src="http://img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
      tooltipCls: 'app-code',
      arrow: false
    }],
    toTop: true,
    skin:"skin2"
  });
  if (userid) {
    slider.resetMenu({
      icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
      tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
      arrow: false
    }, 'top', 0);
  }
};
Index.init = function(cfg) {
  //Index.slider();
  Index.clickEvent();
  Index.initUi();
};

module.exports = Index;
