define("sbuPackLink/0.0.1/orderIndex",["tmpl/pc/order/sbupacklink", "tmpl/pc/newdetails/sbuVisaModal","tmpl/pc/newdetails/sbuKnow","tmpl/pc/order/choseInfoFee","common/0.1.0/storage","dialog/0.2.0/dialog"],function(require){
    var tplRouteInfo = require("tmpl/pc/order/sbupacklink"),
        tplSbuVisaModal = require("tmpl/pc/newdetails/sbuVisaModal"),
        choseInfoee = require("tmpl/pc/order/choseInfoFee"),
        storage = require("common/0.1.0/storage"),
        tplSbuKnow = require("tmpl/pc/newdetails/sbuKnow"),
        dialog = require("dialog/0.2.0/dialog");
    function init(){
        collapse();     //折叠功能
        totalNum();     //数量框选择
        //initTip();      弹框组件
        visaDialog();    //签证弹框
        titleDialog();   //点击产品下拉
    }
    function async(){
        var sbu = storage.getItem("sbu"),
            lineId = fish.one("#HidLineid").val(),
            bookDate = fish.one("#hidBookDate").val();
        $.ajax({
            url: '/dujia/AjaxHelper/PackageAjax.ashx?type=GETSBUPRODUCTLISTFORBOOKING&id='+ lineId +'&date=' + bookDate,
            //url: 'http://www.ly.com/dujia/AjaxHelper/PackageAjax.ashx?type=GETSBUPRODUCTLISTFORBOOKING&id=200471&date=2016-06-02',  //todo 测试地址
            dataType: 'jsonp',
            type: 'post',
            data: 'sbu='+sbu ,
            success: function(data){
                if(data && data.code == 4000 && (data.data.WanLe != null || data.data.Visa != null)){
                    $("#sbu").html(tplRouteInfo(data));
                    $(".choseFee-info").html(choseInfoee(data));

                    if(data.data&&data.data.Visa){
                        var SBUVisaProData =data.data.Visa.Product;
                        $(".visa-dialog").each(function(){
                            var Jself = $(this);
                            var ProductId =  parseInt(Jself.parents('.visa-table').find('.J_Visa').attr('data-ProductId'));
                            for(var i=0;i<SBUVisaProData.length;i++){
                                if(ProductId == SBUVisaProData[i].ProductId){
                                    Jself.html(tplSbuVisaModal(SBUVisaProData[i]));
                                }
                            }
                        });
                    }
                    init();
                }else{
                    $("#sbu").css({
                        display: "none"
                    });
                    $(".R_Center").css({
                        display: "none"
                    });
                }
                if(data.data.Message){
                    var config = {
                        type: 'html',
                        title: '提示',
                        width: '410px',
                        height: '410px',
                        content:'<div class="order-pop-content">'
                        +'<i></i><ul>'
                        +'<li class="order-pop-desc" id="J_orderTipDesc"><span>'+ data.data.Message + '</span></li>'
                        +'<li class="order-pop-btns">'
                        +'<a class="order-pop-btn oder-pop-resubmission" href="javascript:void(0);" data-dialog-hide title="" target="_self">确定</a>'
                        +'<a class="order-pop-btn oder-pop-contact" href="http://livechat.ly.com/out/guest?p=2&amp;c=2" title="" target="_blank">联系客服</a>'
                        +'<span class="order-pop-phone"><i></i>4007-777-777转6</span>'
                        +'</li>'
                        +'</ul>'
                        +'</div>'
                    };
                    var $dialog2 = new dialog({ skin: 'MessageModal' });
                    $dialog2.modal(config);
                }
                calculate();   //计算总价
            }
        });
    }
    /**
     * @desc sbu打包多条数据的展开收起
     * */
    function collapse(){
        var $oTar = $(".pro-type p");
        $.each($(".pro-name"),function(){
            var $oI = $(this).siblings(".pro-type").find("i"),
                $oDL = $(this).find("div").length;
            if($oDL == 2){
                $oI.addClass("active");
            }else {
                $oI.removeClass("active");
            }
        });
        $oTar.on("click",function(){
            if ($(this).parent(".pro-type").hasClass("disabled")) {
                return;
            }
            $(this).toggleClass("collapse");
            var $oParent = $(this).parents("tr");
            var $oChild = $oParent.children(".pro-visa");
            if($(this).attr("class") == "collapse"){
                $oChild.each(function(){
                    var oDiv = $(this).find(".visa-table");
                    oDiv.each(function(){
                        if($(this).index() > 0){
                            $(this).css({"display":"none"});
                        }
                    });
                });
            }else{
                $oChild.each(function(){
                    var $oDiv = $(this).find(".visa-table");
                    $oDiv.each(function(){
                        if($(this).index() > 0){
                            $(this).css({"display":"block"});
                        }
                    });
                });
            }
            $oParent.toggleClass("collapse");
            $(this).find("i").toggleClass("active");
        });
    }
    function totalNum(){
        var $oJ_toggle = $(".pro-num").find(".J_toggle");
        $oJ_toggle.each(function(){
            var $self = $(this);
            /*控制input下拉框的显|隐*/
            $self.on("click",function(){
                if(!$(this).hasClass("clickFalse")){
                    $(this).siblings("p").toggleClass("none");
                }
            });
            $self.on("mouseleave",function(){
                $self.siblings("p").addClass("none");
            });
            $self.siblings("p").on("mouseenter",function(){
                $(this).removeClass("none");
            }).on("mouseleave",function(){
                $(this).addClass("none");
            });
            /*给每个input加上data-index属性来对应相应的 .choseFee-info的dd*/
            for(var i=0; i<$oJ_toggle.length; i++){
                $oJ_toggle.eq(i).find("input").attr("data-index",i);
            }
            /*下拉框a标签的点击及一些要实现的功能*/
            var $oA = $self.siblings("p").children("a");
            $oA.on("click",function() {
                var $_self = $(this);
                var $Oop = $_self.parent().parent(),
                    Oindex = $Oop.index(),
                    Oindex_plus = Oindex + 1;
                var data_index = $(this).parent().siblings(".J_toggle").children("input").attr("data-index"), //input  data-index值对应.choseFee-info的dd
                    val = parseInt($_self.text(), 10),                                                    //input value
                    $chose_info = $(".par_right").find(".choseFee-info"),                   //附加产品价格部分
                    price = $chose_info.find(".ex_price").eq(data_index).text(),            //附加产品价格部分单价
                    showNum = $chose_info.find(".listnum").eq(data_index),                  //附加产品人数
                    showTotalPrice = $chose_info.find(".extraPrice").eq(data_index),        //附加产品总价
                    showPro = $chose_info.find("dd").eq(data_index),                        //附加产品呈现
                    indexPlus = parseInt(data_index) + 1,
                    showPro_plus = $chose_info.find("dd").eq(indexPlus);
                var $oP = $_self.parents("p");                                              //数量下拉框p标签
                var $oParent = $_self.parents(".pro-num"),                                  //数量框
                    proTitle = $oParent.siblings(".pro-name").find(".pro-title");
                var $oI = $(this).parent().siblings(".J_toggle").find("input"),  //当前td子元素的($oIndex + 1)个div
                    inputAct = $(this).parents(".pro-num").find(".J_toggle").find("input"),
                    inputCount = 0;
                $oP.siblings(".J_toggle").children("input").val(val);                    //给input框赋值
                $oP.addClass("none");                                                      //收起input下拉框
                /*改变数量时价格与之联动*/
                showNum.text(val);
                showTotalPrice.text(price * val);
                if(val === 0){  //数量为0
                    $oI.addClass("input");
                    showPro.addClass("none");
                    proTitle.removeClass("choosed");
                    if($Oop.hasClass("adult")){
                        showPro.parent().addClass("none");
                        var $Otarget = $oParent.find(".J_visa").eq(Oindex_plus).find(".J_toggle");
                        $Otarget.find("input").val(0);
                        $Otarget.addClass("clickFalse");
                        $Otarget.removeClass("input");
                        showPro_plus.addClass("none");
                        showPro_plus.find(".extraPrice").text(0);
                    }else if(!$Oop.hasClass("child")){
                        showPro.parent().addClass("none");
                    }
                }else{
                    proTitle.addClass("choosed");
                    $oI.removeClass("input");
                    showPro.removeClass("none");
                    showPro.parent().removeClass("none");
                    $oParent.find(".J_visa").eq(Oindex_plus).find(".J_toggle").removeClass("clickFalse");
                }
                /*控制附加产品的R_Center部分的显丨隐*/
                $(".R_Center").removeClass("none");
                if($(".choseFee-info").height() == 0){
                    $(".R_Center").addClass("none");
                }else{
                    $(".R_Center").removeClass("none");
                }
                calculate();  //计算总价
                /*控制pro-choose的图片*//*
                for(var j= 0; j< proTitle.length; j++){
                    if(proTitle.eq(j).hasClass("active")){
                        $oParent.siblings(".pro-choose").find("i").addClass("active");
                        return;
                    }else{
                        $oParent.siblings(".pro-choose").find("i").removeClass("active");
                    }
                }*/
            });
        });
    }
    /*签证的弹框单独处理*/
    function visaDialog(){
        var visaEve = $(".J_Visa"),
            visaIntro = $(".J_Visa_Intro"),
            visaIntroChange = visaIntro.find("li"),
            visaIntroCon = $(".person-type-con");
        visaEve.on("click",function(){
            var self = $(this),
                root = self.parents("tr").first(),
            visaDialog = root.next().find(".visa-dialog"),
                //visaDialog = root.next(),
                top = $(this).offset().top,
                left = $(this).offset().left;
            visaDialog.toggleClass("visa-dialog-show");
            visaIntro.find("li:first-child").addClass("person-type-at")
                .siblings().removeClass("person-type-at");
            visaIntroCon.find("table:first-child").removeClass("none")
                .siblings().addClass("none");
        });
        visaIntroChange.each(function(i){
            $(this).on("click",function(){
                $(this).addClass("person-type-at")
                    .siblings().removeClass("person-type-at");
                visaIntroCon.find(".tab_table").eq(i).removeClass("none")
                    .siblings().addClass("none");
            });
        });
        visaIntroChange.each(function(i){
            $(this).on("click",function(){
                $(this).addClass("person-type-at")
                    .siblings().removeClass("person-type-at");
                visaIntroCon.find(".tab_table").eq(i).removeClass("none")
                    .siblings().addClass("none");
            });
        });
        $(".person-type-con .up").on("click", function () {
            var self = $(this),
                visaDialog = self.parents(".tr");
            visaDialog.removeClass("visa-dialog-show");
        });
    }
    /*弹框组件*/
    //function initTip() {
    //    var o_dialog = new dialog({
    //        skin:"default"
    //    });
    //    //click
    //    var odl=o_dialog.tooltip({
    //        content: function (obj) {
    //
    //            var text = $(obj).attr('data-content');
    //            var width = '370px';
    //            odl.set('width', width);
    //            return text;
    //        }, //内容,支持html,function
    //        delay: 100,//延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
    //        onhide: function () { //隐藏后触发事件
    //
    //        },
    //        triggerEle: '.J_dialogs',//触发元素选择器
    //        triggerType: 'click',//hover|click
    //        leaveHide:true,
    //        triggerAlign: 'bottom left'//显示位置支持top,left,bottom,right
    //    });
    //}

    function titleDialog(){
        //todo 测试地址，之后要改
        var url = "/dujia/AjaxFinalTours.aspx?type=GetProductNewNoticeInfo";
        $(".J_Add_Title").on("click", function () {
            var self = $(this),
                param = '',
                resourceid = '',
                root = self.parents("tbody").first(),
                orderknow = root.find(".order-know"),
                needknow = orderknow.find('.need-know');
            resourceid = self.attr("data-ResourceId");
            param = {
                resourceid:resourceid
            }
            self.toggleClass("title-expand");
            if (self.hasClass("title-expand")) {
                $.ajax({
                    url:url,
                    dataType:'jsonp',
                    data:param,
                    isFangZhua:true,
                    success:function(data) {
                        if(data) {
                            needknow.html(tplSbuKnow(data));
                            if(!needknow.hasClass("iswifi")) {
                                $('.w3').remove();
                            }
                        }else {
                            needknow.html("无");
                        }
                        orderknow.removeClass("none");
                    }
                });
            } else {
                orderknow.addClass("none");
            }

        });
    }
    /*计算总价*/
    function calculate(){
        var $R_Center = $('.R_Center');
        var $R_Bottom = $('.R_Bottom');
        var $R_top = $('.R_top');
        var totalPrice = 0;
        var exPrice = 0;
        var discount = 0;
        $R_top
            .find('.fee-info dl[class^=calculPri]:not(.none)').each(function() {
                totalPrice += parseFloat($(this).find('.orderPrice').text());
            }).end()
            .find('.InsuranceDL:not(.none)').each(function() {
                totalPrice += parseFloat($(this).find('.orderPrice').text());
            }).end()
            .find('.ReductionDL-new').each(function() {
                discount += parseFloat($(this).find('.orderPrice').text());
            });
        $R_Center.find('.choseFee-info dl[class=calcle]:not(.none)').find('.extraPrice').each(function () {
            exPrice += parseFloat($(this).text());
        }).end();
        var strTotalPrice = '' + (totalPrice + discount + exPrice);
        $R_Bottom.attr('attr-primitive', strTotalPrice)
            .find('.f_price').text(strTotalPrice);
    }
    async();
});

