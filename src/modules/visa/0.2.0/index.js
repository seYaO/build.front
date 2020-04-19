define("visa/0.2.0/index", ["visa/0.2.0/index.css",'./views/visaInfo.dot','./views/visaFreeInfo.dot'], function (require, exports, module) {
    module.exports = function (host, isInit, callback) {
        var visaType = $(".visa-item"),
            visaContent = $(".visa-content"),
            visaUrl = visaContent.attr("attr-url"),
            templateId = parseInt(visaContent.attr("data-templateid")),
            viewId = parseInt(visaContent.attr("data-viewid"));
        var param = {};
        function init() {
            if (isInit) {
                initEvent();
            }
            initRender();
        }
        function initRender() {
            if(templateId && templateId != 0){
                visaUrl = "/intervacation/api/VisaInfo/GetFreeVisaInfo";
                param = {
                    siteType: 0,
                    projCode: 0,
                    templateId: templateId
                };
                $.ajax({
                    url: window.host + visaUrl,
                    data: param,
                    dataType: "jsonp",
                    success: function (data) {
                        var tmplFreeVisa = require("./views/visaFreeInfo.dot"),
                            el = $(".visa-content");
                        getData(data, tmplFreeVisa, el);
                        callback && callback.call();
                    }
                });
            }else{
                visaType.each(function(i,n){
                    $(n).find("li").first().click();
                });
                callback && callback.call();
            }
        }
        function getData(data, tmplFreeVisa, el) {
            if(templateId && templateId != 0){
                if (data && data.Data && data.Data.visaInfo) {
                    var datas = data.Data.visaInfo,
                        otherVisa = $(".visaOther-tips");
                    param.days = datas.Days;
                    el.html(tmplFreeVisa(data));
                    if(otherVisa.length && datas.Notice != ""){
                        otherVisa.prev().removeClass("none");
                        otherVisa.html(datas.Notice);
                    }
                    if($(".visaCountry").length && datas.CountryName != ""){
                        $(".visaCountry").html(datas.CountryName);
                    }
                    if($(".J_visaTime").length && datas.Days != ""){
                        $(".J_visaTime span").html("送签后"+datas.Days+"个工作日("+datas.DaysNode+")");
                    }
                    if($(".J_Interview").length && viewId){
                        $(".J_Interview span").html('是&nbsp;&nbsp;<a href="/dujia/visa/ms-' + viewId + '.html" title="" target="_blank">查看面试材料详情</a>');
                        $(".J_Interview").removeClass('none');
                    }
                    calvisadeadline(param.days,data.Data.visaInfo.CountryId,data.Data.visaInfo.RegionId);
                }
            }else{
                if (data && data.Data && data.Data.visaResponse) {
                    var content = data.Data.visaResponse;
                    el.html(content.VisaShowDescribe);
                }
            }
            var mustTableTr = $("table.mustInfo").find("tr");
            var noMustTableTr = $("table.noMustInfo").find("tr");
            var mustHeight = 0,
                noMustHeight = 0;
            if (mustTableTr.length > 0) {
                for (var i = 0; i < 4; i++) {
                    mustHeight += mustTableTr.eq(i).height();
                }
            }
            if (noMustTableTr.length > 0) {
                for (var j = 0; j < 4; j++) {
                    noMustHeight += noMustTableTr.eq(j).height();
                }
            }
            var visaEl = mustTableTr.parents(".J_mustInfo");
            visaEl.each(function(index, elem) {
                var trEl = $(elem).find("tr");
                if (trEl && (trEl.length > 4)) {
                    $(elem).css({
                        "height":parseInt(mustHeight+22),
                        "overflow":"hidden"
                    });
                } else {
                    $(elem).css({
                        "height":parseInt(mustHeight+22)
                    });
                }
            });
            noMustTableTr.parents(".J_noMustInfo").css({
                "height":parseInt(noMustHeight+22),
                "overflow":"hidden"
            });
        }
        function initEvent() {
            $(document).on('click', ".visa-item li", function () {
                var _this = $(this),
                    visaMeterial = $(".visa-material"),
                    el = _this.parents(".visa-item").find(".visa-details");
                if (visaMeterial && visaMeterial.length) {
                    var $index = _this.index();
                    if (!_this.hasClass('current')) {
                        _this.addClass('current').siblings().removeClass('current');
                        $(".visa-details").find(".visa-material").eq($index).removeClass('none').siblings().addClass('none');
                    }
                    return;
                }
                var parent = _this.parents(".visa-item"),
                    continentId = parent.attr("continent-id"),
                    countryId = parent.attr("country-id"),
                    visaTypeId = parent.attr("visa-id"),
                    regionId = parent.attr("region-id"),
                    PersonnelTypeId = _this.attr("person-id"),
                    personTypeId = _this.attr("data-persontypeid"),
                    param, ajaxAbort;
                var templateId = visaContent.attr("data-templateid");

                _this.addClass("current").siblings().removeClass("current");
                param = {
                    continentId: continentId,
                    countryId: countryId,
                    visaTypeId: visaTypeId,
                    regionId: regionId,
                    PersonnelTypeId: PersonnelTypeId
                };
                if(templateId && templateId != 0){
                    param = {
                        siteType: 0,
                        projCode: 0,
                        templateId: templateId,
                        personTypeId: personTypeId,
                        days:""
                    };
                }
                if (ajaxAbort) {
                    ajaxAbort.abort();
                }
                ajaxAbort = $.ajax({
                    url: window.host + visaUrl,
                    data: param,
                    dataType: "jsonp",
                    success: function (data) {
                        var tmplFreeVisa = require("./views/visaInfo.dot");
                        if (data.Data.visaInfo) {
                            data.Data.visaInfo.CountryId = countryId;
                            data.Data.visaInfo.RegionId = regionId;
                        } else {
                            data.Data.visaResponse.CountryId = countryId;
                            data.Data.visaResponse.RegionId = regionId;
                        }
                        getData(data, tmplFreeVisa, el);
                    }
                });
            });
            $(document).on("click", ".visa-material .togglemore",function () {
                var mustTableTr = $(this).parents(".visa-material").find("table.mustInfo").find("tr");
                var noMustTableTr = $(this).parents(".visa-material").find("table.noMustInfo").find("tr");
                var mustHeight = 0,
                    noMustHeight = 0;
                if (mustTableTr.length > 0) {
                    for (var i = 0; i < 4; i++) {
                        mustHeight += mustTableTr.eq(i).height();
                    }
                }
                if (noMustTableTr.length > 0) {
                    for (var j = 0; j < 4; j++) {
                        noMustHeight += noMustTableTr.eq(j).height();
                    }
                }
                mustTableTr.parents(".J_mustInfo").css({
                    "height":parseInt(mustHeight+22),
                    overflow:"visible"
                });
                noMustTableTr.parents(".J_noMustInfo").css({
                    "height":parseInt(noMustHeight+22),
                    overflow:"visible"
                });
                var me = $(this);
                if (me.hasClass("open")) {
                    me.removeClass("open").addClass("close");
                    me.parent().prev().animate({
                        height: me.parent().prev().find("tbody").height()

                    });
                    me.html("收起全部信息");
                } else {
                    mustTableTr.parents(".J_mustInfo").css({
                        overflow:"hidden"
                    });
                    me.parents(".J_mustInfo").animate({
                        height: mustHeight
                    });
                    noMustTableTr.parents(".J_noMustInfo").css({
                        overflow:"hidden"
                    });
                    me.parents(".J_noMustInfo").animate({
                        height: noMustHeight
                    });
                    me.removeClass("close").addClass("open");
                    me.html("展开全部信息");
                }
            });
            $(document).on("click",'.visasource-time .togglemore',function () {
                var self =$(this);
                if(self.hasClass("open")){
                    self.parents(".visasource-time").find(".visasource-content-main").css({height:"auto"});
                    self.removeClass("open").addClass("close");
                    self.html("收起全部信息");
                }else if(self.hasClass("close")){
                    self.parents(".visasource-time").find(".visasource-content-main").css({height:"82"});
                    self.removeClass("close").addClass("open");
                    self.html("展开全部信息");
                }
            });
            // $(document).on("click",'.tip_import a',function () {
            //     var self =$(this),
            //         content = self.parents("li");
            //     if(!content.hasClass("tip_importHover")){
            //         content.addClass("tip_importHover");
            //         self.html("收起");
            //     }else{
            //         content.removeClass("tip_importHover");
            //         self.html("展开");
            //     }
            // });
        }
        function calvisadeadline(days,countryId,regionId) {
            var visaTravelDates = $("#formVisaTravelDates").val();
            var visaParam = {
                TravelDates:visaTravelDates.split(","),
                CountryId:countryId,
                RegionId:regionId,
                Days:-days
            };
            $.ajax({
                type:"POST",
                url: "/intervacation/api/visainfo/calvisadeadline?siteType=0",
                data: JSON.stringify(visaParam),
                //contentType: "application/json",
                dataType: "json",
                success:function (data) {
                    if(data && data.Data.visaDeadLine && data.Data.visaDeadLine.Status == "success"){
                        var _data = data.Data.visaDeadLine.MaterialDeadLineDates;
                        if(_data && _data.length>0){
                            var str ="";
                            for(var i = 0;i<_data.length;i++){
                                str +=  "<li>"+
                                        "<span>"+_data[i].TravelDate+"</span>"+
                                        "<span style='width: 40px;display: inline-block'></span>"+
                                        "<span class='group-icon-visaArrow'></span>"+
                                        "<span>"+ _data[i].MaterialDeadLineDate +" 下午17点30之前</span>"+
                                        "</li>";
                            }
                            if( _data.length<7){
                                $(".visasource-time .togglemore").css({"display":"none"});
                                $(".visasource-content-main").css({"height":"auto"});
                            }
                            $(".visasource-content-main ul").empty().append(str);
                            $(".visasource-time").removeClass('none');
                        }

                    }
                }
            });
        }
        init();
    };
});