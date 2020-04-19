/**
 * Created by lyf10464 on 2016/3/3.
 */
define("googleMap/0.1.0/index",[],function(require, exports, module) {

    var index = {
        cfg:{
            domArr:["map","map-dialog"],
            center:[
                "31.953313,121.841581",
                "31.15347,121.291706",
                "31.207516,121.412556",
                "31.122909,121.458561"
            ]
        },

        /*
         * 初始化异步加载地图脚本
         */
        init: function(cfg,data, isInitMap, callback){
            var self = this,
                args = arguments,
                count = 0,flag = true;
            var KEYS = [
                "AIzaSyCVYnDK3IobgEFC99EfsHbbC1UEYvllz4w",
                "AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM",
                "AIzaSyCdcAcThXOPu3kdu7359_y8iNM0anMPVmc",
                "AIzaSyBA3yA9e4ZL9AsuV_yztXGCiF060KweOuQ",
                "AIzaSyDfmvwQkmEtP-Em94sc2KpCAY97b_m3BHQ",
                "AIzaSyCs5N8CUnCNp8PNYmOv_Fph3JQDgQPXPM0"
            ];
            var mapKey = Math.floor(Math.random() * KEYS.length);
            if (data && data.length) {
                data.forEach(function (item) {
                    if (count) {
                        return true;
                    }
                    if (item.ScenicList && item.ScenicList.length) {
                        item.ScenicList.forEach(function (scen) {
                            if (scen) {
                                count++;
                                $(".tab").removeClass("none");
                                if(flag){
                                    if (isInitMap) {
                                        flag = false;
                                        $.ajax({
                                            url: "//ditu.google.cn/maps/api/js?sensor=false&key="+KEYS[mapKey],
                                            dataType: "jsonp",
                                            success:function(){
                                                self._init.apply(self,args);
                                                callback && callback.call(self);
                                            }
                                        });
                                    } else {
                                        self._init.apply(self,args);
                                        callback && callback.call(self);
                                    }
                                }
                                

                                return true;
                            }
                        });
                    }
                });
            }
            if (!count) {
                $(".tab").addClass("none");
            }
        },
        /*
         * 初始化加载地图
         */
        _init:function(cfg,data){
            var self = this,
                defaultCfg = self.cfg;
            var _cfg = self._cfg = $.extend(defaultCfg,cfg);
            $(".ui-map").removeClass("none");
            if(data&&data.length!==0){
                this.initMap(_cfg,data);
                this.initMapPanel(data);
                this.reInitMap(_cfg,data);
                this.tripFunc(_cfg,data);
                this.hoverEvent();
            }else{
                $(".ui-map").addClass("none");
            }

        },

        /**
         * @desc 初始化面板数据
         * @param {Object} data
         */
        initMapPanel:function(data){
            var dataIndex = 0;
            var inx = 1;
            function getSenByDay(datas){
                var shtml = "";
                for(var i=0;i<datas.length;i++){
                    //todo 暂不渲染没有坐标景点
                    if(datas[i].Latitude !== ""&&datas[i].Longitude !== ""){
                        if(datas[i] == "") {
                            shtml = "";
                        }else {
                            shtml +=    '<dd data-index="'+dataIndex+'">'+
                                '<span class="ui-tripName">'+datas[i].ScenicName+'</span>'+
                                '<span class="ui-tripIndex" data-lat="'+datas[i].Latitude+'" data-lng="'+datas[i].Longitude+'">'+inx+'</span>'+
                                '</dd>';
                            inx ++;
                            dataIndex ++;
                        }

                    }
                }
                return shtml;
            }
            var strday ="";
            for(var i=0;i<data.length;i++){
                strday +=  '<dl class="clearfix">'+
                    '<dt >'+
                    '<span class="ui-tripDay J_ui-tripDay">D'+data[i].Day+'</span>'+
                    '<span class="ui-tripName"></span>'+
                    '</dt>'+getSenByDay(data[i].ScenicList)+'</dl>';

            }
            $(".scroller").empty().html(strday);
            //$(".scroller dl").each(function(){
            //    if($(this).find("dd").length === 0){
            //        $(this).addClass("none");
            //    }
            //})

        },

        /*
         * 地图自身滚动事件与点击事件
         */
        tripFunc:function(cfg,data){
            var domH = $(".tab").offset().top,
                domMH = $(".travel-day:last").offset().top,
                domMapHeight = $(".ui-map").height(),
                domMapH = $(".ui-map").offset().top;
            var navH = $("#conlist").height();
            var _cfg = cfg,_data = data;
            var isShow = 0;
            $(window).scroll(function(){
                if(isShow == 1){
                    if($(window).scrollTop()<domH){
                        $(".ui-map").removeClass("ui-fixed-show");
                        $("#J_space").remove();
                        if(navH>=42) {
                            $(".ui-map").css({
                                marginTop: '20px'
                            });
                        }
                        //index.renderMap(_cfg.domArr[0],_data,false);
                    }else if($(window).scrollTop()>domMH - domMapHeight){
                        $("#J_space").remove();
                        $(".ui-map").removeClass("ui-fixed");
                        $(".ui-map").removeClass("ui-fixed-show");
                        //index.renderMap(_cfg.domArr[0],_data,false);
                    }else if($(window).scrollTop()>domMapH&&!$(".ui-map").hasClass("ui-fixed-show")){
                        $(".ui-map").addClass("ui-fixed-show").addClass("ui-fixed");
                        $(".ui-map").css({
                            marginTop:navH
                        });
                        index.renderMap(_cfg.domArr[0],_data,false,0);
                        var shtml = '<div id="J_space" style="height:180px;width:924px;margin-top:20px"></div>';
                        $(".tab .tab-title").after(shtml);
                    }
                }else{
                    $("#J_space").remove();
                    if(navH>=42) {
                        $(".ui-map").css({
                            marginTop: '20px'
                        });
                    }
                }
            });

            $(document).on("click","dd",function(){
                var self = $(this);
                if(self.hasClass("ui-tripIndex")){
                    self.parents(".scroller").find(".ui-tripDay").removeClass("ui-tripSelect");
                    self.parents(".scroller").find(".ui-tripIndex").removeClass("ui-tripSelect");
                    self.parents(".scroller").find(".ui-tripName").removeClass("ui-tripSelect");
                    self.children(".ui-tripIndex").addClass("ui-tripSelect");
                    self.children(".ui-tripName").addClass("ui-tripSelect");
                }
            });

            $(".ui-follow").on("click",function(){
                var mapParent = $(".ui-map");
                if(mapParent.hasClass("ui-fixed")){
                    if(navH>=42){
                        mapParent.removeClass("ui-fixed");
                        $(".ui-map").removeClass("ui-fixed-show")
                            .css({
                                marginTop: '20px'
                            });
                        mapParent.css({
                            marginTop:'20px'
                        });
                    }else{
                        mapParent.removeClass("ui-fixed");
                        $(".ui-map").removeClass("ui-fixed-show");
                    }
                    index.renderMap(_cfg.domArr[0],_data,false);
                    $("#J_space").remove();
                    isShow = 0;
                }else{
                    mapParent.addClass("ui-fixed");
                    isShow = 1;
                }
            })
        },

        /*
         * 初始化小地图
         */
        initMap:function(cfg,data){
            index.renderMap(cfg.domArr[0],data,false);
        },
        /*
        * 查看大图hover事件
        * */
        hoverEvent: function(){
            var tripInfo_dd = $(".ui-tripInfo dd");
            tripInfo_dd.mouseenter(function(){
                $(this).find("span").addClass("ui-tripSelected");
            }).mouseleave(function(){
                $(this).find("span").removeClass("ui-tripSelected");
            });
        },

        /*
         * 开启与关闭大地图模式*/
        reInitMap:function(cfg,data){
            var largeBtn = $(".J_map-large"),
                closeBtn = $(".J_ui-close");
            largeBtn.on("click",function(){
                $(".ui-map-bg").show();
                $(".ui-map-dialog").removeClass("none");
                index.renderMap(cfg.domArr[1],data,true);
                var el = $(".ui-map-wrapper")[0];
                new IScroll(el,{mouseWheel:true,disableMouse:false,scrollbars: true,click: true});
            });

            closeBtn.on("click",function(){
                $(".ui-map-dialog").addClass("none");
                $(".ui-map-bg").hide();
                $(".ui-tripInfo dt .ui-tripDay").removeClass("ui-tripSelect");
                $(".ui-tripInfo dd .ui-tripIndex").removeClass("ui-tripSelect");
                $(".ui-tripInfo dd .ui-tripName").removeClass("ui-tripSelect");
                index.renderMap(cfg.domArr[0],data,false);
            });
        },

        /*
         * 侧导航与小地图联动事件
         */
        scrollEvent: function (data,domindex) {
            index.renderMap("map",data,false,domindex);
        },

        /*
         * 重置页面中坐标间的连线
         */
        resetPoly:function(map,data){
            var poly,dataArr;
            var flightPlanCoordinates = [];
            for(var i=0;i<data.length;i++){
                dataArr = data[i].LatLngs.split(",");
                flightPlanCoordinates.push(new google.maps.LatLng(dataArr[0],dataArr[1]))
            }
            // todo 锯齿条纹
            poly = new google.maps.Polyline({
                path:flightPlanCoordinates,
                strokeColor: "#54b506",
                strokeOpacity: 0.1,
                strokeWeight: 2,
                fillColor:"#54b506",
                fillOpacity:1
            });
            poly.setMap(map);
        },

        /*
         * 初始化坐标间的连线
         */
        polyMap:function(data,color){
            var poly,dataArr,lineColor;
            var flightPlanCoordinates = [];
            lineColor = color === undefined?"#54b506":color;
            for(var i=0;i<data.length;i++){
                if(color === undefined){
                    dataArr = data[i].LatLngs.split(",");
                    flightPlanCoordinates.push(new google.maps.LatLng(dataArr[0],dataArr[1]))
                }else{
                    dataArr = data[i].split(",");
                    flightPlanCoordinates.push(new google.maps.LatLng(dataArr[0],dataArr[1]))
                }
            }

            poly = new google.maps.Polyline({
                path:flightPlanCoordinates,
                strokeColor: lineColor,
                strokeOpacity: 0.1,
                strokeWeight: 2,
                fillColor:lineColor,
                fillOpacity:1
            });

            return poly;
        },

        /*
         * 渲染地图，其中包含大小地图模式
         */
        renderMap:function(eleDom,data,flag,domIndex){
            var arrShowInfos = [],
                arrMarkSigns = [],
                marker,
                inforwindow,
                poly,
                mapTitles,
                mapTitle,
                mapTxts,
                mapTxt,
                mapDays;
            var indexEl = "";
            var srcImage = "";
            var overlay;
            //初始化自定义图标
            USGSOverlay.prototype  = new google.maps.OverlayView();

            //提取data中的景点的经纬度
            var eleCenter = [],
                imgurl = "//img1.40017.cn/cn/v/2015/zhuanti/2016/34217/icon_bg.png",
                strLat = "";
            for(var i=0;i<data.length;i++){
                var sub = data[i].ScenicList;
                if (sub == [""]) {
                    continue;
                }else {
                    for(var j=0;j<sub.length;j++){
                        var objCen = {};
                        if(sub[j].Latitude !== ""&&sub[j].Longitude !== ""){
                            strLat = sub[j].Latitude+","+sub[j].Longitude;
                            objCen.LatLngs = strLat;
                            objCen.ScenicName = sub[j].ScenicName;
                            objCen.ScenicDes = sub[j].ScenicDes;
                            objCen.OpenDateContent = sub[j].OpenDateContent;
                            objCen.DetialsAddress = sub[j].DetialsAddress;
                            if(sub[j] && sub[j].ScenicPics.length>0){
                                imgurl = sub[j].ScenicPics[0].ScenicPic;
                            }else{
                                imgurl = "//img1.40017.cn/cn/v/2015/zhuanti/2016/34217/icon_bg.png";
                            }
                            objCen.ScenicPic = imgurl;
                            if(objCen.LatLngs != "undefined,undefined"){
                                eleCenter.push(objCen);
                            }
                        }
                    }
                }
            }
            var startLat = "31.253313",
                startLng = "121.241581";
            if(eleCenter.length>0){
                var arrd = eleCenter[0].LatLngs.split(",");
                startLat=arrd[0];
                startLng=arrd[1];
            }else{
                $(".ui-map").remove();
            }

            //渲染地图
            var mapProp = {
                center: new google.maps.LatLng(startLat,startLng),
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(eleDom), mapProp);

            //todo 左侧天数点击也要定位
            //大图左侧天数点击事件
            $(".J_ui-tripDay").on("click",function(){
                var self = $(this),
                    dataStr,dataArry = [],poly,dataAll = [],dataAllStr;
                if(!self.hasClass("ui-tripSelect")){
                    self.parents(".scroller").find(".ui-tripDay").removeClass("ui-tripSelect");
                    self.parents(".scroller").find(".ui-tripName").removeClass("ui-tripSelect");
                    self.parents(".scroller").find(".ui-tripIndex").removeClass("ui-tripSelect");
                    self.addClass("ui-tripSelect");
                    self.parents("dl").find(".ui-tripIndex").addClass("ui-tripSelect");
                    self.parents("dl").find(".ui-tripName").addClass("ui-tripSelect");
                    self.parents("dl").find(".ui-tripIndex").each(function(){
                        dataStr = $(this).attr("data-lat")+","+$(this).attr("data-lng");
                        dataArry.push(dataStr);
                    });
                    $(".ui-map-wrapper dd").each(function () {
                        if ($(this).children(".ui-tripIndex").attr("data-lat") !== ""&&$(this).children(".ui-tripIndex").attr("data-lng") !== "") {
                            dataAllStr = $(this).children(".ui-tripIndex").attr("data-lat")+","+$(this).children(".ui-tripIndex").attr("data-lng");
                            dataAll.push(dataAllStr);
                        }
                    });
                    index.resetPoly(map,eleCenter);
                    if(dataArry.length >=2){
                        poly = index.polyMap(dataArry,"#ff6704");
                    }else{
                        poly = index.polyMap(dataAll,"#54b506");
                    }
                    //getMarkSign(fnum,mapTitles);
                    poly.setMap(map);
                }
            });


            //渲染地图坐标
            for(var i=0;i<eleCenter.length;i++) {
                var loc = eleCenter[i].LatLngs.split(",");
                mapTitles = $("dd .ui-tripIndex");
                mapTxts = $("dd .ui-tripName");
                mapDays = $(".ui-tripInfo dt");
                mapTitle = $(mapTitles[i]);
                mapTxt = $(mapTxts[i]);
                indexEl = (i + 1).toString();


                //为线条添加标记坐标
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(loc[0], loc[1]),
                    icon: "//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/default-map-" + (i + 1) + ".png",
                    zIndex: 1
                });
                marker.setMap(map);

                //自定义图标结构
                srcImage = '<div class="J_markName" style="height: 25px;overflow: hidden"><p style="color: #333;padding-left: 10px;padding-right: 10px;font-size: 14px;white-space: nowrap;margin: 0;line-height: 25px;font-family: microsoft yahei">' + eleCenter[i].ScenicName + '</p></div>';
                //渲染对应自定义图标
                var bounds = new google.maps.LatLng(loc[0], loc[1]);
                overlay = new USGSOverlay(new google.maps.LatLng(loc[0], loc[1]), srcImage, map);


                if (flag) {
                    index.resetPoly(map, eleCenter);
                    poly = index.polyMap(eleCenter);
                    poly.setMap(map);
                }

                //地图中坐标点击事件，触发景点介绍弹框
                var clickHandler = (function (i) {
                    return function () {
                        arrShowInfos[i].open(map, arrMarkSigns[i]);
                        arrShowInfos.forEach(function (n, index) {
                            if (index !== i) {
                                n.close();
                            }
                        });
                        getMarkSign(i, mapTitles);
                        index.resetPoly(map, eleCenter);
                        $("#map-dialog").find(".J_markName").parent().css({zIndex: "0"});
                        $("#map-dialog").find(".J_markName").eq(i).parent().css({zIndex: "100"});
                    };
                })(i);

                //地图这个mouseout，mouseover时间，出发颜色改变
                var mouseoverHandler = (function (i) {
                    return function () {
                        arrMarkSigns.forEach(function (n, index) {
                            if (index == i) {
                                n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/click-map-" + (index + 1) + ".png");
                            }
                        });
                        $("#map").find(".J_markName").eq(i).find('p').css({color: "#ff6704"});
                        $("#map-dialog").find(".J_markName").eq(i).find("p").css({color: "#ff6704"});
                        $("#map").find(".J_markName").eq(i).parent().css({zIndex: "100"});
                        $("#map-dialog").find(".J_markName").eq(i).parent().css({zIndex: "100"});
                        mapTitles.removeClass("ui-tripSelect");
                        $(mapTitles[i]).addClass("ui-tripSelect");
                        mapTxts.removeClass("ui-tripSelect");
                        $(mapTxts[i]).addClass("ui-tripSelect");
                        mapDays.find(".ui-tripDay").removeClass("ui-tripSelect");
                    };
                })(i);
                var mouseoutHandler = (function (i) {
                    return function () {
                        arrMarkSigns.forEach(function (n, index) {
                            if (index == i) {
                                n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/default-map-" + (index + 1) + ".png");
                            }
                        });
                        $("#map").find(".J_markName").eq(i).parent().css({zIndex: "0"});
                        $("#map-dialog").find(".J_markName").eq(i).parent().css({zIndex: "0"});
                        $($(".J_markName")).find('p').css({color: "#333"});
                    };
                })(i);

                //渲染坐标文案
                var infoDiv;
                if (eleCenter[i].LatLngs != "undefined,undefined") {
                    infoDiv = '<div class="ui-attractions">' +
                    '<div class="ui-attractions-content">' +
                    '<div class="ui-attractions-img">' +
                    '<img src="' + eleCenter[i].ScenicPic + '">' +
                    '</div>' +
                    '<div class="ui-attractions-info">' +
                    '<h3>' + eleCenter[i].ScenicName + '</h3>' +
                    '<p class="' + ((eleCenter[i].OpenDateContent) === '' ? 'none' : "") + '">游览时间：' + eleCenter[i].OpenDateContent + '</p>' +
                    '<p class="' + ((eleCenter[i].DetialsAddress) === '' ? 'none' : "") + '">景点地址：' + eleCenter[i].DetialsAddress + '</p>' +
                    '<em class="' + ((eleCenter[i].ScenicDes) === '' ? 'none' : "") + '">' + eleCenter[i].ScenicDes.substring(0, 95) + '...</em>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                }
                inforwindow = new google.maps.InfoWindow({
                    disableAutoPan: false,
                    content: infoDiv
                });
                arrMarkSigns.push(marker);
                arrShowInfos.push(inforwindow);

                //景点介绍弹框样式设置
                google.maps.event.addListener(inforwindow, 'domready', function () {
                    var iwOuter = $('.gm-style-iw');
                    var iwBackground = iwOuter.prev();
                    iwBackground.children(':nth-child(2)').css({'display': 'none'});
                    iwBackground.children(':nth-child(4)').css({'display': 'none'});
                    iwBackground.children(':nth-child(1)').attr('style', function (i, s) {
                        return s + 'left: 76px !important;'
                    });
                    iwBackground.children(':nth-child(3)').attr('style', function (i, s) {
                        return s + 'left: 76px !important;'
                    });
                    iwBackground.children(':nth-child(3)').find('div').children().css({
                        'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
                        'z-index': '1'
                    });
                    var iwCloseBtn = iwOuter.next();
                    iwCloseBtn.css({
                        opacity: '1',
                        right: '65px',
                        top: '26px',
                        width: "18px",
                        height: "18px"
                    });
                    $(iwCloseBtn.children()).attr("src", "//img1.40017.cn/cn/v/2015/zhuanti/2016/dest/icon-infoClose_03.png");
                    iwCloseBtn.children().css({
                        left: '0',
                        top: '0',
                        width: '18px',
                        height: '18px'
                    });
                    $(iwCloseBtn.children()).hover(function () {
                        $(this).css({backgroundColor: "#000"})
                    }, function () {
                        $(this).css({backgroundColor: ""})
                    });
                });
                marker.addListener("mouseover", mouseoverHandler);
                marker.addListener("mouseout", mouseoutHandler);
                if (flag) {
                    marker.addListener("click", clickHandler);
                    mapTitle.on("click", clickHandler);
                    mapTxt.on("click", clickHandler);
                    mapDays.on("click", function () {
                        var self = $(this), indexArr = [], days;
                        days = self.parents("dl").find("dd");
                        days.each(function () {
                            indexArr.push(parseInt($(this).attr("data-index")));
                        });
                        var fnum = parseInt(self.next().attr("data-index"));
                        arrShowInfos[fnum].open(map, arrMarkSigns[fnum]);
                        arrShowInfos.forEach(function (n, index) {
                            if (index !== fnum) {
                                n.close();
                            }
                        });
                        getDaysMarkSign(indexArr)
                    });
                }
            }

            //配置生成自定义图标
            function USGSOverlay(bounds, image, map){
                this.bounds_ = bounds;
                this.image_ = image;
                this.map_ = map;
                this.div_ = null;
                this.setMap(map);
            }
            USGSOverlay.prototype.onAdd = function(){
                var div = document.createElement('div');
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

                var img = document.createElement('div');
                img.innerHTML = this.image_;
                img.style.position = 'absolute';
                img.style.backgroundColor = '#fff';
                img.style.borderBottomRightRadius = '13px';
                img.style.borderTopRightRadius = '13px';
                div.appendChild(img);
                this.div_ = div;
                var panes = this.getPanes();
                panes.overlayLayer.appendChild(div);
            };
            USGSOverlay.prototype.draw = function(){
                var overlayProjection = this.getProjection();
                var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_);
                var div = this.div_;
                div.style.left = (sw.x+5)+'px';
                div.style.top = (sw.y-30) +'px';
            };
            USGSOverlay.prototype.onRemove = function(){
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            };

            function getMarkSign(i,mapTitles){
                arrMarkSigns.forEach(function (n, index) {
                    if (index !== i) {
                        n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/default-map-"+(index+1)+".png");
                    } else {
                        n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/click-map-"+(index+1)+".png");
                    }
                });

                $($(".ui-map-dialog .J_markName")).find('p').css({color:"#333"});
                $($(".ui-map-dialog .J_markName")[i]).find('p').css({color:"#ff6704"});

                mapTitles.removeClass("ui-tripSelect");
                $(mapTitles[i]).addClass("ui-tripSelect");
                mapTxts.removeClass("ui-tripSelect");
                $(mapTxts[i]).addClass("ui-tripSelect");
                mapDays.find(".ui-tripDay").removeClass("ui-tripSelect");
                index.resetPoly(map,eleCenter);
            }

            function getDaysMarkSign(i){
                setTimeout(function(){
                    $($(".ui-map .J_markName")).find('p').css({color:"#333"});
                    $(".ui-map .J_markName").parent().css({zIndex:"0"});
                    $(".ui-map .J_markName").each(function(k,v){
                        for(var l = 0;l< i.length;l++) {
                            if (k === i[l]) {
                                $($(".ui-map .J_markName")[i[l]]).find('p').css({color:"#ff6704"});
                                $(".ui-map .J_markName").eq(i[l]).parent().css({zIndex:"100"});
                            }
                        }
                    });
                },10);
                $($(".ui-map-dialog .J_markName")).find('p').css({color:"#333"});
                $(".ui-map-dialog .J_markName").parent().css({zIndex:"0"});
                arrMarkSigns.forEach(function (n, index) {
                    n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/default-map-"+(index+1)+".png");
                    for(var l = 0;l< i.length;l++){
                        if (index === i[l]) {
                            n.setIcon("//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/click-map-"+(index+1)+".png");
                            $($(".ui-map-dialog .J_markName")[i[l]]).find('p').css({color:"#ff6704"});
                            $(".ui-map-dialog .J_markName").eq(i[l]).parent().css({zIndex:"100"});
                        }
                    }
                });


                //arrShowInfos.forEach(function (n) {
                //    n.close();
                //})

            }

            //处理跟随模式下，侧导航和地图联动事件
            var dayAll = $(".J_ui-tripDay"),
                daysArr = [];
            if(dayAll.length !== 0&&domIndex !== ""&&domIndex !== undefined){
                for(var domI = domIndex+1;domI>0;domI--){
                    dayAll.each(function () {
                        if($(this).text().indexOf(domI)>-1){
                            $(this).parents("dl").find("dd").each(function(){
                                daysArr.push(parseInt($(this).attr("data-index")));
                            });
                            getDaysMarkSign(daysArr);
                        }
                    });
                    if(daysArr.length !== 0){
                        break;
                    }
                }
                if(daysArr.length === 0){
                    dayAll.each(function () {
                        $(this).parents("dl").find("dd").each(function(){
                            daysArr.push(parseInt($(this).attr("data-index")));
                        });
                        getDaysMarkSign(daysArr);
                    })
                }
            }
        }
    };
    module.exports = index;
});
