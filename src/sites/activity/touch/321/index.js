var Swiper = require('/modules/swiper/0.1.0/index')
require('/modules/activity/0.3.4/touch/touch')
require('/modules/scrollspy/1.2.0/index')
require('/modules/timer/0.2.0/touch')
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
var flag = 0;
module.exports = {
    init: function (cfg) {
        var self = this;
        var defaultCfg = {
                el: ".J_prolist",
                filter: true,
                IsSellOut: 0,
                _beforeRender: function(data){
                    //  var data1 = data['CycleId=4809&DedicatLine=9&AreaId=1002'];
                    // data['CycleId=4809&DedicatLine=9&AreaId=1005'].push(data1[0]);
                    return data;
                },
                beforeRender: function (data) {
                    return data;
                },
                afterRender: function () {
                    self.getServerTime();
                }
            };
            var thisCfg = $.extend(defaultCfg, cfg);
            Activity.init(thisCfg);
            this.event();
            this.getNowArea();
    },

    //获取服务器时间
    getServerTime: function () {
        var self = this;
        var serverTimeUrl = document.location.protocol + '//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue';
        var timeUrl = serverTimeUrl + "&t=" + Math.random();
        $.ajax({
            type: "GET",
            url: timeUrl,
            dataType: "jsonp",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (date) {
                var retTime = date.totalseconds.replace(/\-/gi, "/");
                module.exports.getDate(retTime);
            }
        });
    },
   //获取当前日期  显示对应日期产品
    getDate: function(nowTime){
        var day = new Date(nowTime).getDate();
        if(day<25){
            var nowDate = $('#nowDate1').val().split(',');
        }else{
            var nowDate = $('#nowDate2').val().split(',');
        }
                switch(day+''){
                    case nowDate[0]:
                        $('.J_1').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[1]:
                        $('.J_2').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[2]:
                        $('.J_3').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[3]:
                        $('.J_4').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[4]:
                        $('.J_5').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[5]:
                        $('.J_6').removeClass('none').siblings('.list').remove();
                        break;
                    case nowDate[6]:
                        $('.J_7').removeClass('none').siblings('.list').remove();
                        break;
                    default:
                        $('.list').hide();
                };
                module.exports.getTime(nowTime);
    },

    //获取当前时间点并判断状态
    getTime: function(nowTime){
        var ymd = nowTime.substring(0,10);
        var oldymd = $('#Day').val(),oldtime = new Date(oldymd).getTime();
        var nt = new Date(nowTime).getTime();
        if(oldtime>nt){
            var time1 = oldymd +' '+ $('#Time1').val(),
                time2 = oldymd +' '+ $('#Time2').val(),
                time3 = oldymd +' '+ $('#Time3').val();
        }else{
            var time1 = ymd +' '+ $('#Time1').val(),
                time2 = ymd +' '+ $('#Time2').val(),
                time3 = ymd +' '+ $('#Time3').val();
        }

        var t1 = new Date(time1).getTime(),
            t2 = new Date(time2).getTime(),
            t3 = new Date(time3).getTime();
            
        if(nt<t1){
            $('.menu li').removeClass('begin').children('span').text('即将开场');
            if(flag==0){
                $('.menu1').addClass('active').siblings('li').removeClass('active');
            }
            
        }else if(nt>t1 && nt<t2){
            $('.menu1').addClass('begin').children('span').text('抢购进行中');
            $('.menu1').children('i').removeClass('none');
            $('.menu1').siblings('li').children('span').text('即将开场');
            $('.pron0').children('.mask-bg').remove();

            $('.pron0 .order').removeClass('wait').html('立即抢购');
            if(flag==0){
                $('.menu1').addClass('active').siblings('li').removeClass('active');
            }
            
        }else if(nt>t2 && nt<t3){
            $('.menu1').addClass('begin').children('span').text('抢购进行中');
            $('.menu2').addClass('begin').children('span').text('抢购进行中');

            $('.menu1').children('i').removeClass('none');
            $('.menu2').children('i').removeClass('none');

            $('.menu3').children('span').text('即将开场');

            $('.pron0').children('.mask-bg').remove();
            $('.pron1').children('.mask-bg').remove();

            $('.pron0 .order').removeClass('wait').html('立即抢购');
            $('.pron1 .order').removeClass('wait').html('立即抢购');

            if(flag==0){
                $('.menu2').addClass('active').siblings('li').removeClass('active');
            }
        }else if(nt>t3){
            $('.menu li').addClass('begin').children('span').text('抢购进行中');
            $('.menu li').children('i').removeClass('none');
            $('.mask-bg').remove();
            $('.pro1 .order').removeClass('wait').html('立即抢购');

            if(flag==0){
                $('.menu3').addClass('active').siblings('li').removeClass('active');
            }
        }

        var menuIndex = $('.menu li.active').index();
        var nowdiv = module.exports.nowDiv();
        $('.J_'+nowdiv).children('.pro1').eq(menuIndex).removeClass('none').siblings('.pro1').addClass('none');
    },

    //获取当前区域
    getNowArea: function () {
        $.location({
           fn: function (location) {
                // <!--华东1004，华西1099  华南1005，华北1003，-->
                var province = location.province.replace('省','');

                var hd = $("#hdArea").val(),
                    hx = $("#hxArea").val(),
                    hn = $("#hnArea").val(),
                    hb = $("#hbArea").val();

                if(hd.indexOf(province) >-1){

                    $(".area-now span").html('华东出发');
                    $(".area-nav li").eq(0).addClass('active').siblings('li').removeClass('active');
                    $(".area-nav").addClass('none');
                    $('.area-now').attr('data-areaid','1004');
                    module.exports.getAreaB("1004");

                }else if(hx.indexOf(province) >-1){

                    $(".area-now span").html('华西出发');
                    $(".area-nav li").eq(1).addClass('active').siblings('li').removeClass('active');
                    $(".area-nav").addClass('none');
                    $('.area-now').attr('data-areaid','1099');
                    module.exports.getAreaB("1099");

                }else if(hn.indexOf(province) >-1){

                    $(".area-now span").html('华南出发');
                    $(".area-nav li").eq(2).addClass('active').siblings('li').removeClass('active');
                    $(".area-nav").addClass('none');
                    $('.area-now').attr('data-areaid','1005');
                    module.exports.getAreaB("1005");

                }else if(hb.indexOf(province) >-1){

                    $(".area-now span").html('华北出发');
                    $(".area-nav li").eq(3).addClass('active').siblings('li').removeClass('active');
                    $(".area-nav").addClass('none');
                    $('.area-now').attr('data-areaid','1003');
                    module.exports.getAreaB("1003");
                }else{

                    $(".area-now span").html('华东出发');
                    $(".area-nav li").eq(0).addClass('active').siblings('li').removeClass('active');
                    $(".area-nav").addClass('none');
                    $('.area-now').attr('data-areaid','1004');
                    module.exports.getAreaB("1004");
                }

           }
        });
    },
    //区域切换
    getAreaB: function(areaid){
        // <!--华东1004，华西1099  华南1005，华北1003，-->
        if (areaid=='1004') {
                $(".J_11").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con1").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con5").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
            }
            if (areaid=='1099') {
                $(".J_12").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con2").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con6").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
            }
            if (areaid=='1005') {
                $(".J_13").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con3").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con7").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
            }
            if (areaid=='1003') {
                $(".J_14").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con4").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
                $(".J_con8").removeClass("none").siblings(".J_prolist").addClass("none").trigger("scroll");
            }
            
    },
// 获取当前div
    nowDiv: function(){
        var areaid = $('.area-now').attr('data-areaid');
                switch(areaid){
                    case '1004':
                        var nowdiv = '11';
                        break;
                    case '1099':
                        var nowdiv = '12';
                        break;
                    case '1005':
                        var nowdiv = '13';
                        break;
                    default:
                        var nowdiv = '14';
                };
        return nowdiv;
    },
    
   //点击事件
    event: function () {
        $(".J_rule").on("click", function () {
            $(".popup").show();
        });
        $(".J_close").on("click", function () {
            $(".popup").hide();
        });   

        // tab
        $('.menu li').on('click',function(){
            var _that = $(this);
            flag = 1;
            _that.addClass('active').siblings('li').removeClass('active');
            module.exports.getServerTime();

            var nowdiv = module.exports.nowDiv();
            $('.J_'+nowdiv).children('.pro1').eq(_that.index()).removeClass('none').siblings('.pro1').addClass('none');
        });

        // 区域
        $(".area-nav li").on("click", function () {
            var self = $(this),
                text = $(".area-now").text();
            $(".area-now span").html(self.text() + '出发');
            self.addClass('active').siblings('li').removeClass('active');
            $(".area-nav").addClass('none');

            flag=0;
            var areaid = self.attr('data-areaid');
            $('.area-now').attr('data-areaid',areaid);
            module.exports.getAreaB(areaid);
            module.exports.getServerTime();

            var menuIndex = $('.menu li.active').index();
            var nowdiv = module.exports.nowDiv();
            $('.J_'+nowdiv).children('.pro1').eq(menuIndex).removeClass('none').siblings('.pro1').addClass('none');
            
        });

        $(".area-now").on("click", function () {
            $(".area-nav").removeClass('none');
        });
    },
   
}
