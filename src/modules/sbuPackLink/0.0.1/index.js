define("sbuPackLink/0.0.1/index",["sbuPackLink/0.0.1/index.css","tmpl/pc/newdetails/sbuPackLink","tmpl/pc/newdetails/sbuVisaModal","tmpl/pc/newdetails/sbuKnow","common/0.1.0/storage","dialog/0.2.0/dialog"],function(require){
    var storage = require("common/0.1.0/storage"),
        dialog = require("dialog/0.2.0/dialog"),
        tplSbuKnow = require("tmpl/pc/newdetails/sbuKnow");
    var sbu = []; //sbu附加产品数据
    function init(){
        collapse();     //折叠
        totalNum();     //数量框选择
        dateSelect();         //日期框选择
        visaEvent();    //签证
        orderEve();
    }
    function orderEve(){
        $(".J_OrderBtn").one("click",function(e){
            storage.removeItem('sbu');
            e.preventDefault();       //线上测试需删除
            sbu = [];                   //切换出发日期后再次选择附加产品时清空sbu


            //var $mD = $(".pro-name").find(".pro-title");
            //

            var J_sbu_warp = $('#extraInfo'),
                J_sbu_li = J_sbu_warp.find(".pro-title");

            var orderBtn = $(this),
                orderHref = orderBtn.attr("href"),
                orderCount = 0;

            J_sbu_li.each(function(){
                var Jself = $(this);
                if(Jself.hasClass("active")){
                    orderCount++;
                    var index = $(this).index();   //对于签证的特殊处理
                    var arr = {},
                        isChild = false,
                        isChildRep = false;

                    arr.ProductId = parseInt(Jself.children("p").attr("data-productid"));
                    arr.ResourceId = parseInt(Jself.children("p").attr("data-resourceid")) || 0;
                    arr.Title = Jself.children("p").attr("title").replace(/</g,"@l@").replace(/>/g,"@r@");
                    //是否为签证
                    if(Jself.parents("tr").hasClass('J_qz')){
                        arr.UsingDate = Jself.parents(".pro-name").find(".pro-date").find("div").eq(index).text();
                        //是否为成人
                        if(Jself.attr('data-type')=='adult'){
                            arr.AdultNum = parseInt($(this).parents(".pro-name").siblings(".pro-num").find(".adult").find("input").val())||0;
                            arr.AdultPriceId = parseInt($(this).parents(".pro-name").siblings(".pro-date").find(".adult").attr("data-PriceId"))||0;
                            arr.ChildNum = 0;
                            arr.ChildPriceId = 0;
                        }else{
                            arr.AdultNum = 0;
                            arr.AdultPriceId = 0;
                            arr.ChildNum = parseInt($(this).parents(".pro-name").siblings(".pro-num").find(".J_show").find("input").val()) || 0;
                            arr.ChildPriceId = parseInt($(this).parents(".pro-name").siblings(".pro-date").find(".child").attr("data-PriceId")) || 0;
                            //先插入成人，后插入儿童，当插入儿童时需要判断与先前的成人的附加产品id是否相同；
                            isChild = true;
                        }
                    }else {
                        if(Jself.parents(".pro-name").siblings(".pro-date").find("input").length !== 0){
                            arr.UsingDate = Jself.parents(".pro-name").siblings(".pro-date").find("input").val();
                        }else{
                            arr.UsingDate = Jself.parents(".pro-name").siblings(".pro-date").children().attr('data-usingdate');
                        }
                        arr.AdultNum = parseInt($(this).parents(".pro-name").siblings(".pro-num").find("input").val())||0;
                        arr.AdultPriceId = parseInt($(this).parents(".pro-name").siblings(".pro-date").find(".IsCommunication").attr("data-PriceId"))||0;
                        arr.ChildNum = 0;
                        arr.ChildPriceId = 0;
                    }
                    arr.Type = parseInt($(this).parents(".pro-visa").siblings(".pro-type").attr("data-type"));
                    //
                    if(isChild){
                        for(var i =0;i<sbu.length;i++){
                            if(sbu[i].ProductId == arr.ProductId){
                                sbu[i].ChildNum = arr.ChildNum;
                                sbu[i].ChildPriceId = arr.ChildPriceId;
                                isChildRep = true;
                                break;
                            }
                        }
                        if(!isChildRep){
                            sbu.push(arr);
                        }
                    }else{
                        sbu.push(arr);
                    }
                }
            });
            storage.setItem("sbu",encodeURIComponent(JSON.stringify(sbu))); //选定产品后设置storage
            /*packageType判断是否为sbu打包*/
            if (orderCount) {
                window.location.href = orderHref + "&packageType=1";
                //window.location.href = orderHref ;   //todo 测试地址

            } else {
                window.location.href = orderHref;
            }
        });
    }
    /**
     * @desc sbu打包多条数据的展开收起
     * */
    function collapse(){
        var oTar = $(".pro-type p");
        oTar.on("click",function(){
            if ($(this).parent(".pro-type").hasClass("disabled")) {
                return;
            }
            $(this).toggleClass("collapse");
            var oParent = $(this).parents("tr");
            var oChild = oParent.children(".pro-visa");
            if($(this).hasClass("collapse")){
                oChild.each(function(){
                    var oDiv = $(this).find(".visa-table");
                    oDiv.each(function(){
                        if($(this).index() > 0){
                            $(this).css({"display":"none"});
                        }
                    });
                });
            }else{
                oChild.each(function(){
                    var oDiv = $(this).find(".visa-table");
                    oDiv.each(function(){
                        if($(this).index() > 0){
                            $(this).css({"display":"block"});
                        }
                    });
                });
            }
            oParent.toggleClass("collapse");
            $(this).find("i").toggleClass("active");
        });
    }
    function totalNum(){
       $(".J_select").on("click",function() {
           var self = $(this),
               $oP = self.parent(),
               prodate = self.parents(".pro-date"),
               prochoose = prodate.siblings(".pro-choose").find("i"),
               title = prodate.siblings(".pro-name").find(".pro-title"),
               valnum = parseInt(prodate.next().find("input").val());
           if (self.hasClass("sel")) {
               prochoose.removeClass("active");
               title.removeClass("active");
           } else {
               if (valnum > 0) {
                   prochoose.addClass("active");
                   title.addClass("active");
               }
               else {
                   prochoose.removeClass("active");
                   title.removeClass("active");
               }
           }
           $oP.siblings("input").attr("value",self.text()); //给input框赋值
           $oP.siblings("input").attr("data-PriceId",self.attr("data-PriceId"));//选择日期后给日期框一个PriceId
       });
    }
    function dateSelect(){
        var $oDiv = $(".pro-date").find("div");
        $oDiv.each(function(){
            var $self = $(this);
            /*控制日期input下拉框的显|隐*/
            $self.on("mouseleave",function(){
                $self.children("p").addClass("none");
            });
            $self.children("p").on("mouseenter",function(){
                $(this).removeClass("none");
            }).on("mouseleave",function(){
                $(this).addClass("none");
            });
            $self.on("click",function(){
                $self.children("p").toggleClass("none");
            });
        });
    }
    /*签证产品及弹框处理*/
    function visaEvent(){
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
        var visaEve = $(".J_Visa"),
            visaIntro = $(".J_Visa_Intro"),
            visaIntroChange = visaIntro.find("li"),
            visaIntroCon = $(".person-type-con");
        visaEve.on("click",function(){
            var self = $(this),
                root = self.parents("tr").first(),
                //visaDialog = root.next().find(".visa-dialog"),
                visaDialog = root.next(),
                top = $(this).offset().top,
                left = $(this).offset().left;
            visaDialog.toggleClass("J_hide");
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
        $(".person-type-con .up").on("click", function () {
            var self = $(this),
                visaDialog = self.parents(".tr");
            visaDialog.removeClass("J_hide");
        });
    //    todo 附加产品移到酒店信息下面
        var numBoxVal = $(".numBox").val();
        if(numBoxVal == 0) {
            $(".sub-btn").addClass("gray");
        }
        else if(numBoxVal == 50) {
            $(".add-btn").addClass("gray");
        }
        $(".J_rnum").on("click",function(){
            var isTrue = true,
                self = $(this),
                num = self.siblings(".numBox"),
                numval = num.val(),
                pronum = self.parents(),
                title = pronum.siblings(".pro-name").find(".pro-title"),
                prodate = pronum.siblings(".pro-date"),
                prochoose = pronum.siblings(".pro-choose").find("i"),
                date = prodate.find("input").val(),
                optionshow = prodate.find("p");
            if(numval <= 1) {
                if(self.hasClass("sub-btn")) {
                    self.addClass("gray");
                    if(numval <= 0) {
                        isTrue = false;
                    }
                    prochoose.removeClass("active");
                    title.removeClass("active");

                }
                else {
                    self.siblings("a").removeClass("gray");
                    isTrue = true;
                    if(date != "请选择"){
                        prochoose.addClass("active");
                        title.addClass("active");
                    }else{
                        prochoose.removeClass("active");
                        title.removeClass("active");
                    }
                }
            }
            else if (numval >= 49) {
                if(self.hasClass("add-btn")) {
                    self.addClass("gray");
                    if(numval >= 50) {
                        isTrue = false;
                    }
                }
                else {
                    self.siblings("a").removeClass("gray");
                    isTrue = true;
                }

            }
            if(isTrue) {
                if(self.hasClass("sub-btn")) {
                    numval --;
                }
                else {
                    numval ++;
                }
                num.val(numval);
                if(numval > 0 && date === '请选择') {
                    optionshow.removeClass("none");
                }
                else {
                    optionshow.addClass("none");
                }
            }
            else {
                return;
            }
        });
    //    点击更多，展开5个产品，点击收起
        $(".toggle-p").on("click",function(){
            var self = $(this),
                proVisa = self.siblings(".pro-visa"),
                visaTabel = proVisa.find(".visa-table").first(),
                siblings = visaTabel.siblings();
            self.toggleClass("up");
            if(self.hasClass("up")) {
                siblings.removeClass("none");
                visaTabel.removeClass("fir");
                self.find("p").html("收起");
            }else {
                siblings.addClass("none");
                visaTabel.addClass("fir");
                self.find("p").html("更多");
            }
        });
    }
    return {
        init: init
    };
});
