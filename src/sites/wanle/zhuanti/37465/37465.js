/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
require("/modules/scrollspy/0.3.0/index");
$(".fixBox").scrollspy({
        contentClass: ".J_Box",
        curClass: "at",
        tabList: $(".fixList li")
})
var ajaxUrl = "http://www.ly.com/wanle/AjaxHelperWanLe/QueryActivityProductList?ActivityId=1666&PageIndex=1&PageSize=200";
var pro ={
    init:function(){
        pro.ajaxFn();
        pro.fixFn();
    },
    fixFn:function(){
        $(window).resize(function(){
            if(document.body.scrollTop > 400 && document.body.offsetWidth > 1300){
                $(".fixBox").removeClass("none");
            }else{
                $(".fixBox").addClass("none");
            }
        });
    },
    fixBlock:function(){
        pro.windowTop = (document.body.scrollTop||document.documentElement.scrollTop);
        if($(window).scrollTop() > 400 && document.body.offsetWidth > 1300){
            $(".fixBox").removeClass("none");
        }else{
            $(".fixBox").addClass("none");
        }
        if(pro.windowTop >= $(".oneSale").offset().top && pro.windowTop< $(".HK").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix1").addClass("at");
        }else if(pro.windowTop >= $(".HK").offset().top && pro.windowTop< $(".Japan").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix2").addClass("at");
        }else if(pro.windowTop >= $(".Japan").offset().top && pro.windowTop< $(".Korea").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix3").addClass("at");
        }else if(pro.windowTop >= $(".Korea").offset().top && pro.windowTop< $(".Thai").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix4").addClass("at");
        }else if(pro.windowTop >= $(".Thai").offset().top && pro.windowTop< $(".Singapore").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix5").addClass("at");
        }else if(pro.windowTop >= $(".Singapore").offset().top && pro.windowTop< $(".haidao").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix6").addClass("at");
        }else if(pro.windowTop >= $(".haidao").offset().top && pro.windowTop< $(".America").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix7").addClass("at");
        }else if(pro.windowTop >= $(".America").offset().top && pro.windowTop< $(".Australia").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix8").addClass("at");
        }
        else if(pro.windowTop>= $(".Australia").offset().top && pro.windowTop< $(".yuenan").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix9").addClass("at");
        }else if(pro.windowTop>= $(".yuenan").offset().top){
            $(".fixList li").removeClass("at");
            $(".fixList .fix10").addClass("at");
        }
    },
    ajaxFn:function(){
        $.ajax({
            url:ajaxUrl,
            dataType:"jsonp",
            success:function(data) {
                if (data.WanleActivityProductList) {
                    var index = 0;
                    var j=0;
                    for(var i =0 ;i<data.WanleActivityProductList.length; i++){
                        var imgUrl = data.WanleActivityProductList[i].ImgUrl.split(".jpg")[0]+"_640x360_00"+".jpg",
                            tcPrice = data.WanleActivityProductList[i].ProductAmount,
                            showDes = data.WanleActivityProductList[i].MainTitle,
                            subTitle = data.WanleActivityProductList[i].SubTitle,
                            linkUrl = "http://www.ly.com/dujia/wanle/"+data.WanleActivityProductList[i].SingleProductId+".html?ak="+data.WanleActivityProductList[i].Ak;
                        if(data.WanleActivityProductList[i].DestinationCity){
                            var destName = data.WanleActivityProductList[i].DestinationCity.split(",")[0];
                            destName = destName.length > 5 ? destName.substring(0,5):destName;
                            var destBox = '<i></i>'+destName;
                        }else{
                            var destBox = '';
                        }
                        function getHtml(index){
                            pro.oneHtml = '<a href="'+linkUrl+'" class="'+index+'" target="_blank">'+
                                '<img src="'+imgUrl+'">'+
                                '<p class="proDest">'+
                                '<span class="destName">'+
                                destBox+
                                '</span>'+
                                '<span class="sale">下单享立减</span>'+
                                '</p>'+
                                '<p class="proBag"></p>'+
                                '<div class="proBox">'+
                                '<div class="proLeft">'+
                                '<p class="proTitle">'+showDes+'</p>'+
                                '<p class="proPrice">¥<span>'+tcPrice+'</span>起</p>'+
                                '</div>'+
                                '<div class="proRight">'+
                                '<span>立即<br>预订</span>'+
                                '<i></i>'+
                                '</div>'+
                                '</div>'+
                                '</a>';
                        }

                        if(tcPrice === 1){
                            var html1 =
                                '<li>'+
                                '<a href="'+linkUrl+'" target="_blank">'+
                                '<div class="proImg">'+
                                '<img src="'+imgUrl+'" alt="">'+
                                '<p class="black"></p>'+
                                '</div>'+
                                '<div class="proInfo">'+
                                '<h2>'+showDes+'</h2>'+
                                '<p class="tjBox">'+
                                '<span class="tuijian">推荐理由</span>'+subTitle+
                                '</p>'+
                                '<div class="priceBox">'+
                                '<p class="price">大促价：<em>¥</em><span>'+tcPrice+'</span></p>'+
                                '<p class="goBuy">立即抢购</p>'+
                                '</div>'+
                                '</div>'+
                                '</a>'+
                                '</li>';
                            $(".mSlider_con .slider_ul").append(html1);
                            pro.Index = i;
                            j = pro.Index;
                           
                        }else{
                            showDes = showDes.length>20?showDes.substring(0,18)+"...":showDes;
                            var html2='';
                            if(j < (pro.Index+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".HK .proList").append(html2);
                                pro.jIndex = i;
                              
                            }else if(j <(pro.jIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".Japan .proList").append(html2);
                                pro.kIndex = i;
                               
                            }else if(j<(pro.kIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".Korea .proList").append(html2);
                                pro.tIndex = i;
                              
                            }else if(j<(pro.tIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".Thai .proList").append(html2);
                                pro.sIndex = i;
                               
                            }else if(j<(pro.sIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".Singapore .proList").append(html2);
                                pro.hIndex = i;
                               
                            }else if(j<(pro.hIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".haidao .proList").append(html2);
                                pro.mIndex = i;
                               
                            }else if(j<(pro.mIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".America .proList").append(html2);
                                pro.uIndex = i;
                              
                            }else if(j<(pro.uIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".Australia .proList").append(html2);
                                pro.yIndex = i;
                                
                            }else if(j<(pro.yIndex+8)){
                                getHtml("onePro");
                                html2= pro.oneHtml;
                                index++;
                                $(".yuenan .proList").append(html2);
                            
                            }else{
                                break;
                            }
                            j++;
                        }
                    }
                    $("#mSlider5 .mSlider_con").slider({
                        aniType: "fade",
                        fadeTime:500,
                        circle:true,
                        moveTime: 2000,
                        arrows: true,
                        showNav: "circle"
                    });
                    //pro.fixBlock();
                }
            }
        });
    }
};
pro.init();

