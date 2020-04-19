var Slidertoolbar = require("slidertoolbar/0.1.0/index");
var common = require("common/0.1.0/index");
var Login = require("login/0.1.0/index");
var Storage = require("common/0.1.0/storage");

require('./scrollspy')
require('/modules/timer/0.2.0/pc')
require('/modules/activity/0.3.2/pc/pc')
var Carousel = require('/modules/jCarousel/0.2.1/index')
require('/modules/ztutils/tel/0.1.1/index');

var Index = {};

    Index.clickEvent = function(){
        $(".gotop").on("click",function(){
            $("html,body").animate({scrollTop:0});
        });

        $("#J_area").on("click",function(){
            //$("#J_nav").removeClass("none");
            var div = document.getElementById('J_nav');
            div.className ="area-nav";
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
    Index.Carousel = function(){
        new Carousel(".carousel",{
            auto: 3000,
            visible: 1,
            circular: true,
            vertical: false,
            preload: 1,
            btnPrev: ".left",
            btnNext: ".right",
            btnNav: true,
        });
        $('button').on('click',function(){
            var self = $(this);
            self.addClass('active').siblings('button').removeClass('active');
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
    Index.init = function(cfg) {
        Index.Carousel();
        Index.clickEvent();
        Index.initUi();
    };
    module.exports = Index;