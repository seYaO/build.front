/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
require('/modules/activity/0.3.4/touch/touch');
require('/modules/scrollspy/1.2.0/index');
var UScheck = require('/modules/ztutils/uscheck/0.2.0/index');
var Index = {
    isclick:true,
    isSubmit:true,
    init: function(cfg) {
        var defaultCfg = {
            el: ".J_prolist",
            filter: true,
            IsSellOut: 0,
            beforeRender: function(data) {
                return data;
            }
        };
        var thisCfg = $.extend(defaultCfg, cfg);
        Activity.init(thisCfg);
        this.event();
        this.scrollNav();
        this.getData(3284,1640);
        this.clickFn();
        this.closeFn();
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
                index = self.index(),
                attrIndex =$(".J_menu").attr("data-imgNum");
            self.addClass("active").siblings("li").removeClass("active");
            $(".tabImg").eq(index).removeClass("none").siblings(".tabImg").addClass("none").trigger("scroll");
            var exClass = "tab_BG_"+attrIndex,
                className = "tab_BG_"+(index+1);
            $(".J_menu").removeClass(exClass).addClass(className);
            $(".J_menu").attr("data-imgNum",(index+1));
            //控制定位
            if(index == 0){
                $(".container .actTab ul li").eq(1).removeClass("secondLi");
            }else{
                $(".container .actTab ul li").eq(1).addClass("secondLi");
            }
        });
        //刷新验证码
        $(".J_codeImg").on("click",function(){
            $(this).attr("src","http://www.ly.com/dujia/CheckCode.aspx?"+(+new Date()));
        });

        $(".phoneIn,.codeIn").on("focus",function(){
            $(this).siblings(".warning").addClass("none");
        })
    },
    //国内游
    getData:function(actyid,pdid){
        var _url = "//gny.ly.com/ZhuanTi/CampaignZhuanTiList?activityId=" + actyid + "&periodIds=" + pdid;
        $.ajax({
            url: _url,
            dataType: "jsonp",
            success: function(data){
                if(data.length !=0){
                    Activity.renderHTML(data,$('.part4 .prolist'));
                }
            }
        });
    },
    //吸底导航
    scrollNav: function() {
        var obj = $.scrollspy({
            navEl : $(".switch"),
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
                        el.addClass("fixed");
                        break;
                    case 2:
                        el.addClass("fixed");
                        break;
                }
            },
        });

    },
    //签到
    clickFn:function(){
        $(".J_sign").on("click",function(){
            //判断登录
                UScheck.check({
                    decode: true,
                    direct: true,
                    callback :function(info){
                    //Index.userid =  info.value;
                    Index.userid =  info.userid;
                    Index.dialog.show("sign",function(){
                        Index.signAjax(Index.userid);//查询签到次数
                    });//sign表示签到页面
                 }
            })
        })
    },
    dialog:{
        show:function(type,fn){
            if(type == "sign"){
                $(".signBox").show();
                $(".signLi").show();
                if(typeof fn === "function"){
                    fn();
                    Index.signFn(Index.userid);//签到
                }
            }else{
                $(".recBox").show();
                if(typeof fn === "function"){
                    fn();
                    Index.awardFn();//填写领奖卡
                }
            }

        },
        hide:function(type){
            if(type == "sign"){
                $(".signBox").hide();
                $(".signLi").hide();
            }else{
                $(".recBox").hide();
            }
        }
    },
    closeFn:function(){
        $(".J_signBox").on("click",function(){
            Index.dialog.hide("sign");
        });
        $(".J_award").on("click",function(){
            Index.dialog.hide("award");
        })
    },
    signAjax:function(userid){
        var endDate = new Date("2016/11/30");
        var today = new Date();
        var param = {
            MemberId: userid,
            ExActivityId: 103116,
            Platform: 1
        };
        $.ajax({
            type: 'POST',
            url: window.cnhost +'/intervacation/api/SignIn/QuerySignInInfos',
            data: param,
            success: function (data) {
                if(data.Code === 4000){
                    Index.SignInTimeList = data.Data.result.SignInTimeList;
                    var dayCount = data.Data.result.SignInCount;
                    $(".signNum").html("已签到"+dayCount+"天啦~");
                    for(var i = 0;i < dayCount;i++){
                        $(".signDate li").eq(i).removeClass("snone").addClass("right");
                    }
                    if(today > endDate){
                        Index.isclick = false;
                        $(".signBtn").addClass("notSign").html("活动结束");
                        $(".signBtn").removeClass("none");
                    }else{
                        $.ajax({
                            type: 'post',
                            url: window.cnhost +'/intervacation/api/SignIn/SignIn',
                            data: param,
                            success:function(data){
                                if (data.Code === 4000) {
                                    if (data.Data.result.Result == true) {
                                        var lastTime1 = data.Data.result.SignInTime.split("T")[0];
                                        var lastTime2 = '';
                                        if (Index.SignInTimeList.length) {
                                            lastTime2 = Index.SignInTimeList[Index.SignInTimeList.length - 1].split("T")[0];
                                        }
                                        if(lastTime1 == lastTime2){
                                            $(".signBtn").addClass("notSign").html("今日已签");
                                            Index.isclick = false;
                                        }
                                        $(".signBtn").removeClass("none");
                                    }
                                }
                            }
                        })
                    }
                }else{
                    $(".signNum").html("获取数据失败");
                }
            }
        })
    },
    signFn:function(userid){
        $(".J_signBtn").on("click",function(){
            if(Index.isclick){
                var param = {
                    MemberId: userid,
                    ActivityId: 103116,
                    Platform: 1
                };
                $.ajax({
                    type: 'post',
                    url: window.cnhost +'/intervacation/api/SignIn/SignIn',
                    data: param,
                    success: function(data) {
                        if (data.Code === 4000) {
                            if (data.Data.result.Result == true) {
                                $(".signDate .snone").eq(0).removeClass("snone").addClass("right");
                                var count = data.Data.result.SignCount ;
                                $(".signNum").html("已签到"+count+"天啦~");
                                $(".signBtn").addClass("notSign").html("今日已签");
                                $(".signBtn").removeClass("none");
                                Index.isclick = false;
                                if(count == 3 || count == 11){
                                    Index.dialog.show("award",function(){
                                        $(".recAll").addClass("tyk");
                                    });//award表示奖品卡页面
                                    Index.dialog.hide("sign");
                                }
                                if(count == 7){
                                    Index.dialog.show("award",function(){
                                        $(".recAll").addClass("xbk");
                                        $(".xbk .addIn").removeAttr("disabled");
                                        $(".xbk .addIn").val("");
                                    });//award表示奖品卡页面
                                    Index.dialog.hide("sign");
                                }
                            }else{
                                $(".signBtn").addClass("notSign").html("签到失败");
                                $(".signBtn").removeClass("none");
                            }
                        }
                    }
                })
            }
        })
    },
    awardFn:function(){
        $(".J_submit").on("click",function(){
            var url = 'http://www.ly.com/dujia/AjaxHelper/ActivityHandler.ashx?Type=SAVEACTIVITYUSERINFO&ActivityUserInfo=';
            var Jname= $(".nameIn").val();
            var Jphone= $(".phoneIn").val();
            var Jaddress= $(".addIn").val();
            var Jcode= $(".codeIn").val();
            var Jcity= $(".cityIn").val();

            var reg3 = /^[A-Za-z0-9]+$/i;//验证码
            var reg4 = /^1[34578]\d{9}$/;//手机号码

            var flag=true;

            if(!reg4.test(Jphone)){
                $(".phoneBox .warning").removeClass("none");
                flag=false;
            }
            if (!reg3.test(Jcode)) {
                $(".codeBox .warning").removeClass("none");
                flag = false;
            }

            if(flag==false){
                return false;
            }
            var getRefId = function(){
                var url = location.href,
                    hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
                if(hasRefId&&hasRefId[1]){
                    return "&refid="+hasRefId[1];
                }else{
                    return 0;
                }
            };

            var param = {
                "UActivityid": "43081",
                "UAddress": encodeURIComponent(Jaddress),
                "UDestinationCity": encodeURIComponent(Jcity),
                "UMobile": Jphone,
                "URefid": getRefId(),
                "UReservedContent": "",
                "UReservedContentExt": encodeURIComponent(Jname)
            };

            url += (JSON.stringify(param)) + "&checkCode=" + Jcode;
            if(Index.isSubmit){
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success:function(data){
                        var code = parseInt(data.code, 10);
                        switch (code) {
                            case 4000:
                                if(data.data.IsSuccess == true){
                                    Index.isSubmit = false;
                                    $(".J_submit").removeClass("submit").addClass("subBtn");
                                    $(".J_codeImg").attr("src","http://www.ly.com/dujia/CheckCode.aspx?"+(+new Date()));
                                }else{
                                    $(".codeBox .warning span").html(data.data.Message);
                                    $(".codeBox .warning").removeClass("none");
                                    $(".J_codeImg").attr("src","http://www.ly.com/dujia/CheckCode.aspx?"+(+new Date()));
                                }
                                break;
                            default:
                                $(".codeBox .warning span").html(data.data.Message);
                                $(".codeBox .warning").removeClass("none");
                                break;
                        }
                    }
                });
            }
        });
    }
};
module.exports =Index;