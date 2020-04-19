var Amap = {};
var config = {
    dom:'map',
    infoWin:true,
    startLat:'',
    startLng:''
};
var localData = '';
var infoWindow;
var markerArr = [];

/**
 * 初始化方法，传入配置项和坐标数据
 * 
 * @param {any} param 配置项
 * @param {any} data 坐标数据源
 */
Amap.init = function(param,data){
    var self = this;
    $.extend(config,param);
    if(data && data.length != 0){
        if($('.ui-map').hasClass('none')){
            $(".ui-map").removeClass("none");
        }
        localData = data;
        self._init(data);
        self.largeMap();
    }else{
        $(".ui-map").addClass("none");
    }
}

/**
 * 初始化地图渲染方法
 * 
 * @param {any} data 坐标数据源
 */
Amap._init = function(data){
    var self = this;
    var data = data||localData;
    self.renderMap(data); 
}

/**
 * 筛选出坐标集合，渲染Marker和ploy
 * 
 * @param {any} data 坐标数据源
 */
Amap.renderMap = function(data){
    var map,
        poly,
        googleLayer = null;

    //提取data中的景点的经纬度
    var eleCenter = [],
        imgurl = "//img1.40017.cn/cn/v/2015/zhuanti/2016/34217/icon_bg.png",
        defImg = '//img1.40017.cn/cn/v/2015/zhuanti/2016/34217/icon_bg.png',
        strLat = "";
    for(var i=0;i<data.length;i++){
        var sub = data[i].ScenicList;
        if (sub == "") {
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
                        imgurl = sub[j].ScenicPics[0].ScenicPic||defImg;
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
    if(eleCenter.length>0){
        var arrd = eleCenter[0].LatLngs.split(",");
        config.startLat=parseFloat(arrd[0]);
        config.startLng=parseFloat(arrd[1]);

        map = new AMap.Map(config.dom,{
            resizeEnable: true,
            center: new AMap.LngLat(config.startLng,config.startLat),
            zoom: 7
        });
        Amap.map = map;  
        //调用google渲染高德地图
        googleLayer = new AMap.TileLayer({
            // 图块取图地址
            tileUrl: '//mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
            zIndex:100
        });
        googleLayer.setMap(map);

        Amap.renderMarker(eleCenter);

        Amap.renderPloy(eleCenter);
    }else{
        $(".ui-map").addClass('none');
        $('.tab').addClass('none');
    }
}

/**
 * 渲染地图连线
 * 
 * @param {any} data 坐标数据源 
 * @param {any} color 连线颜色
 */
Amap.renderPloy = function(data,color){
    var poly,dataArr,lineColor;
    var flightPlanCoordinates = [];
    var map = Amap.map;
    lineColor = color === undefined?"#54b506":color;
    for(var i=0;i<data.length;i++){
        if(color === undefined){
            dataArr = data[i].LatLngs.split(",");
            flightPlanCoordinates.push(new AMap.LngLat(parseFloat(dataArr[1]),parseFloat(dataArr[0])))
        }else{
            dataArr = data[i].split(",");
            flightPlanCoordinates.push(new AMap.LngLat(parseFloat(dataArr[1]),parseFloat(dataArr[0])))
        }
    }
    poly = new AMap.Polyline({
        path:flightPlanCoordinates,
        strokeColor: lineColor,
        strokeOpacity: 1,
        strokeWeight: 2
    });

    poly.setMap(map);
}

/**
 * 渲染地图坐标
 * 
 * @param {any} eleCenter 坐标数据源
 */
Amap.renderMarker = function(eleCenter){
    var maker,
        map = Amap.map;
     //遍历渲染景点坐标
    for(var i=0;i<eleCenter.length;i++) {
        var loc = eleCenter[i].LatLngs.split(",");
        //为地图添加标记坐标
        marker = new AMap.Marker({
            position: new AMap.LngLat(parseFloat(loc[1]),parseFloat(loc[0])),
            icon:'//img1.40017.cn/cn/v/2015/zhuanti/2016/picture/default-map-' + (i + 1) + '.png',
            label:{
                content:'<span style="color: #333;padding-left: 10px;padding-right: 5px;font-size: 14px;font-family: microsoft yahei">'+eleCenter[i].ScenicName+'</span>',
                offset:new AMap.Pixel(17,7)
            },
            animation:"AMAP_ANIMATION_DROP"
        });

        if(config.infoWin){
            marker.content = infoWinStyle(eleCenter[i]);
            marker.on('click',markerClick);
            markerArr.push(marker);
            Amap.closeInfo();
        }
        marker.on('mouseover',markerover);
        marker.on('mouseout',markerout);
        marker.setMap(map);
    }
    infoWindow = new AMap.InfoWindow(
        {
            offset:new AMap.Pixel(0,-30),
            isCustom:true,
            closeWhenClickMap:false
        }
    );

    function markerClick(e){
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition()) 
    }

    function infoWinStyle(item){
        var content = '';
        var defImg = 'http://img1.40017.cn/cn/v/2015/zhuanti/2016/34217/icon_bg.png';
        content = '<div class="ui-attractions">' +
                    '<div class="ui-attractions-content">' +
                    '<div class="ui-attractions-img">' +
                    '<img src="' + item.ScenicPic + '">' +
                    '<i class="info-close"></i>'+
                    '</div>' +
                    '<div class="ui-attractions-info">' +
                    '<h3>' + item.ScenicName + '</h3>' +
                    '<p class="' + ((item.OpenDateContent) === '' ? 'none' : "") + '">游览时间：' + item.OpenDateContent + '</p>' +
                    '<p class="' + ((item.DetialsAddress) === '' ? 'none' : "") + '">景点地址：' + item.DetialsAddress + '</p>' +
                    '<em class="' + ((item.ScenicDes) === '' ? 'none' : "") + '">' + item.ScenicDes.substring(0, 95) + '...</em>' +
                    '</div>' +
                    '</div>' +
                    '</div>';           
        return content;
    }

    function markerover(e){
        var _icon = e.target.getIcon(),
            _label = e.target.getLabel().content;
        e.target.setIcon(_icon.replace(/default/g,'click'));
        e.target.setLabel({
            content:_label.replace(/#333/g,'#ff6704')
        })
    }

    function markerout(e){
        var _icon = e.target.getIcon(),
            _label = e.target.getLabel().content;
        e.target.setIcon(_icon.replace(/click/g,'default'));
        e.target.setLabel({
            content:_label.replace(/#ff6704/g,'#333')
        });
    }
}

/**
 * 选择坐标事件
 * 
 * @param {any} param 坐标参数
 * @param {any} type 选中类型
 */
Amap.pickedMarker = function(param,type){
    var target = markerArr[parseInt(param.index) - 1];
    if(type == 'default'){
        target.setIcon(target.getIcon().replace(/click/g,'default'));
        target.setLabel({
            content:target.getLabel().content.replace(/#ff6704/g,'#333')
        });
        infoWindow.close();
    }else{
        target.setIcon(target.getIcon().replace(/default/g,'click'));
        target.setLabel({
            content:target.getLabel().content.replace(/#333/g,'#ff6704')
        });
        infoWindow.setContent(target.content);
        infoWindow.open(Amap.map,target.getPosition()); 
    }   
}

/**
 * 重置所有页面中坐标状态
 * 
 */
Amap.resetMarker = function(){
    var markers = markerArr;
    for(var i = 0;i<markers.length;i++){
        markers[i].setIcon(markers[i].getIcon().replace(/click/g,'default'));
        markers[i].setLabel({
            content:markers[i].getLabel().content.replace(/#ff6704/g,'#333')
        });
    }
}


/*****************业务*********************/


/**
 * 跟随，大图，弹框关闭和滚动事件
 * 
 */
Amap.largeMap = function(){
    var largeBtn = $(".J_map-large")||'',
        closeBtn = $(".J_ui-close")||'';
    var self = this;
    var navH = $("#conlist").height();
    var domH = $(".tab").offset().top,
        domMH = $(".travel-day:last").offset().top,
        domMapHeight = $(".ui-map").height(),
        domMapH = $(".ui-map").offset().top;
    var isShow = 0;
    largeBtn.on("click",function(){

        self.init({
            dom:'map-dialog',
            infoWin:true
        },localData);
        self.initMapPanel(localData);
        $(".ui-map-bg").show();
        $(".ui-map-dialog").removeClass("none");
        var el = $(".ui-map-wrapper")[0];
        new IScroll(el,{mouseWheel:true,disableMouse:false,scrollbars: true,click: true});
    });

    closeBtn.on("click",function(){
        $(".ui-map-dialog").addClass("none");
        $(".ui-map-bg").hide();
    });

    $(".ui-follow").unbind('click').on("click",function(){
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
            // index.renderMap(_cfg.domArr[0],_data,false);
            Amap.renderMap(localData);
            $("#J_space").remove();
            isShow = 0;
        }else{
            mapParent.addClass("ui-fixed");
            isShow = 1;
        }
    })

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
            }else if($(window).scrollTop()>domMH - domMapHeight){
                $("#J_space").remove();
                $(".ui-map").removeClass("ui-fixed");
                $(".ui-map").removeClass("ui-fixed-show");
            }else if($(window).scrollTop()>domMapH&&!$(".ui-map").hasClass("ui-fixed-show")){
                $(".ui-map").addClass("ui-fixed-show").addClass("ui-fixed");
                $(".ui-map").css({
                    marginTop:navH
                });
                // index.renderMap(_cfg.domArr[0],_data,false,0);
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
}

/**
 * 渲染大图左侧滚动条数据
 * 
 * @param {any} data 
 */
Amap.initMapPanel = function(data){
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
    Amap.leftPanel();
}

/**
 * 初始化滚动条选择景点
 * 
 */
Amap.leftPanel = function(){
    var marker ,param = {},paramArr = [];
    $('.ui-map-wrapper dd').on('click',function(){
        var self = this;
        param.startLat = $(self).find('.ui-tripIndex').attr('data-lat');
        param.startLng = $(self).find('.ui-tripIndex').attr('data-lng'),
        param.index = $(self).find('.ui-tripIndex').text(),
        param.name = $(self).find('.ui-tripName').text();
        if($(self).hasClass('ui-tripSelect')){
            $(self).removeClass('ui-tripSelect');
            Amap.pickedMarker(param,'default');
        }else{
            $('.ui-map-wrapper dd').removeClass('ui-tripSelect');
            Amap.resetMarker();
            $(self).addClass('ui-tripSelect');
            Amap.pickedMarker(param,'click');
        }
    });
}

/**
 * 滚动组件传入数据
 * 
 * @param {any} index 天数
 */
Amap.scrollEvent = function(data,index){
    var data  = localData[index];
    var scenicList = localData[index].ScenicList;
    if($(".ui-map").hasClass('ui-fixed')){
        if(scenicList == ''){
            Amap.renderMap(localData);
        }else{
            Amap.renderMap([localData[index]]);
        }
    }
}

/**
 * 关闭弹框事件处理
 * 
 */
Amap.closeInfo = function(){
    $(document).on('click','.info-close',function(){
        infoWindow.close();
        $('.ui-map-wrapper dd').removeClass('ui-tripSelect');
        Amap.resetMarker();
    }) 
}

module.exports = Amap;