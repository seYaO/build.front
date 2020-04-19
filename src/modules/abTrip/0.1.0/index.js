define("abTrip/0.1.0/index",["abTrip/0.1.0/index.css"], function(require, exports, module) {
    (function($) {
        var html = '<div class="ab_compare" id="abCompare">'+
        '<div class="ab_compare_tit">'+
        '<h2>行程对比</h2>'+
        '<a class="ab_compare_close" href="javascript:;"></a>'+
        '</div>'+
        '<div class="ab_thead_cont">'+
        '<table class="ab_table" border="0" cellspacing="0" cellpadding="0">'+
        '<tr>'+
        '<td class="ab_td">'+
        '<div>产品行程</div>'+
        '</td>'+
        '<td class="ab_th ab_item">'+
        '<div>'+
        '<select class="ab_selt">'+
        '<option value="1">A行程</option>'+
        '<option value="2">B行程</option>'+
        '</select>'+
        '</div>'+
        '</td>'+
        '<td class="ab_th ab_item">'+
        '<div>'+
        '<select class="ab_selt">'+
        '<option value="1">A行程</option>'+
        '<option value="2">B行程</option>'+
        '</select>'+
        '</div>'+
        '</td>'+
        '<td class="ab_th">'+
        '<div>'+
        '<select class="ab_selt">'+
        '<option>选择行程</option>'+
        '</select>'+
        '</div>'+
        '</td>'+
        '</tr>'+
        '</table>'+
        '</div>'+
        '<div class="ab_tbody_cont">'+
        '<table class="ab_table ab_table1" border="0" cellspacing="0" cellpadding="0">'+
        '<tr class="abt_date">'+
        '<td class="ab_td ab_td1">适用团期</td>'+
        '<td class="ab_item ab_td1">&nbsp;</td>'+
        '<td class="ab_item ab_td1">&nbsp;</td>'+
        '<td class="ab_td1">&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_price">'+
        '<td class="ab_td">同程价</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_time">'+
        '<td class="ab_td">行程天数</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_flightinfo">'+
        '<td class="ab_td">航班信息</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_self">'+
        '<td class="ab_td">自费项目</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_shop">'+
        '<td class="ab_td">购物店</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_hotel">'+
        '<td class="ab_td">住宿</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_food">'+
        '<td class="ab_td">用餐</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr class="abt_flight">'+
        '<td class="ab_td">行程</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '</table>'+
        '</div>'+
        '</div>';
        var tripLength,tripLineNum,dataSelt,abSeltDom;
        //数据表初始化
        function abTripUitil(index, data) {
            var flight=data.flight;
            var flightHtml=flight.replace(/http:/g,'');
            $("#abCompare .abt_date").find("td").eq(index).html(data.date);
            $("#abCompare .abt_price").find("td").eq(index).html(data.price);
            $("#abCompare .abt_time").find("td").eq(index).html(data.time);
            $("#abCompare .abt_self").find("td").eq(index).html(data.self);
            $("#abCompare .abt_shop").find("td").eq(index).html(data.shop);
            $("#abCompare .abt_hotel").find("td").eq(index).html(data.hotel);
            $("#abCompare .abt_food").find("td").eq(index).html(data.food);
            $("#abCompare .abt_flight").find("td").eq(index).html(flightHtml);
            $("#abCompare .abt_flightinfo").find("td").eq(index).html(data.flightinfo);
        }
        //数据表ajax
        function abTripAjax(index, value, price) {
            var coverH = $("#abCompare .ab_tbody_cont .ab_table").height();
            var coverDom = $("#abCompare .abt_date").find("td").eq(index);
            coverDom.html("<div class='ab_pcover'><div class='ab_cover'></div></div>");
            if(coverH != 0){
                coverDom.find(".ab_cover")[0].style.height = coverH + "px";
            }
            var host = window.host||"";
            var url = host + "/intervacation/api/TravelResourceDetail/GetCompareTourInfo?siteType=0&lineId=" + tripLineNum + "&version=" + value + "&lowprice=" + price;
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function(data) {
                    if(data && data.Data && data.Data.compareData){
                        abTripUitil(index,data.Data.compareData);
                    }
                }
            });
        }
        var init = function(){
            //行程对比+设定高度
           $("#tourlistAb").on("click", function() {
                var tHeight =$(window).height() > 500 ? 410 : 310;
                fish.require("mPop",function(){
                    fish.mPop({
                        //transition: "elastic",
                        speed: 300,
                        title: "",
                        content: html,
                        width: 890,
                        dragable: false,
                        afterOpen: function(){
                            initEv();
                            abTripSingle();
                        }
                    });
                    $("#abCompare .ab_tbody_cont")[0].style.height = tHeight + "px";
                });
            });


            //下拉框绑定
            function abTripSlctBind(index, value) {
                $("#abCompare .ab_selt").eq(index).val(value);
            }
            //dom初始化
            function abTripEmpty(){
                for (var i = 1; i <= 3; i++) {
                    abTripUitil(i, dataSelt);
                    abTripSlctBind((i-1), 0);
                }
            }
            //显示初始化
            function abTripSingle() {
                abTripEmpty();
                //大于3个行程初始操作
                if (tripLength > 3) {
                    var value1 =$(".J_travelSort li").attr("data-version");
                    var price1 =$(".J_travelSort li").attr("attr-price");
                    //fish.all(".ab_selt").eq(0).attr("disabled",true);
                    abTripAjax(1, value1, price1);
                    abTripSlctBind(0, value1);
                }else{
                    //小于3个行程初始
                    //fish.all(".ab_selt").attr("disabled",true);
                    for (var j = 0; j < 3; j++) {
                        if ((j + 1) <= tripLength) {
                            (function(e) {
                                var tripFish = $(".J_travelSort li").eq(e);
                                var tripNum = tripFish.attr("data-version");
                                var tripPrice = tripFish.attr("attr-price");
                                abTripAjax((e + 1), tripNum, tripPrice);
                                abTripSlctBind(e, tripNum);
                            })(j);
                        } else {
                            abTripUitil((j + 1), dataSelt);
                            abTripSlctBind(j, 0);
                        }
                    }
                }
            }
        };
        function initEv(){
            //关闭绑定
            $("#abCompare .ab_compare_close").on("click", function(e) {
                e.preventDefault();
                fish.mPop.close();
            });
            tripLength =$(".J_travelSort li").size(),
                  tripLineNum =$("#hidLineId").val(),
                  dataSelt = {
                      "date": "",
                      "price": "",
                      "time": "",
                      "self": "",
                      "shop": "",
                      "hotel": "",
                      "food": "",
                      "flight": "",
                      "flightinfo":""
                  },
                  abSeltDom = "<option value='0'>选择行程</option>";
            //小于等于1个行程不显示
            if(tripLength<2){
                $("#tourlistAb").css("display:none");
            }
            //下拉框选项填充
            for (var i = 0; i < tripLength; i++) {
                (function(e) {
                    var tripName = $(".J_travelSort li").eq(e).html();
                    var tripNum = $(".J_travelSort li").eq(e).attr("data-version");
                    abSeltDom += "<option value='" + tripNum + "'>" + tripName + "</option>";
                })(i);
            }
            //abSeltDom += "</select>";
            //下拉框绑定
            $("#abCompare .ab_selt").each(function() {
                $(this).html(abSeltDom);
                //elem.innerHTML = abSeltDom;
            });
            //下拉框绑定
            $("#abCompare .ab_selt").on("change", function() {
                var index1 = $(this).parent().parent().index(); //index1表格列表索引
                var value1 = $(this).val(); //value1数据索引
                var price1 = "";
                if (value1 === "0") {
                    abTripUitil(index1, dataSelt);
                } else {
                    price1 =$(".J_travelSort li[data-version=" + value1 + "]").attr("attr-price") || "";
                    abTripAjax(index1, value1, price1);
                }
            });
        }
        init();
    })(jQuery);
});