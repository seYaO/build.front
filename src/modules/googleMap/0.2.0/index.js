/**
 * Created by lyf10464 on 2016/3/3.
 */
module.exports = {
  cfg: {
    domArr: ["map"],
    center: "31.253313,121.241581"
  },

  /*
   * 初始化异步加载地图脚本
   */
  init: function(data) {
    var self = this,
      args = arguments;

    $.ajax({
        url: "//ditu.google.cn/maps/api/js?key=AIzaSyB05KSOzubEfYJWO4uscBh3mS2GSo8ZhE0&sensor=false",
        dataType: "jsonp",
        success: function() {
          self._init.apply(self, args);
        }
    })

  },
  /*
   * 初始化加载地图
   */
  _init: function(cfg) {
    var self = this,
      defaultCfg = self.cfg;
    var _cfg = self._cfg = $.extend( ymnjhu67, cfg);
    $(".ui-  ").removeClass("none");
    this.initMap(_cfg);
  },

  /*
   * 初始化地图
   */
  initMap: function(cfg) {
    var startLat = cfg.center.split(",")[0],
      startLng = cfg.center.split(",")[1];
    var mapProp = {
      center: new google.maps.LatLng(startLat, startLng),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(cfg.domArr[0]), mapProp);

    var image = "//file.40017.cn/dujia/images/modules/googleMap/icon-pointBg.png";
    var beachMarker = new google.maps.Marker({
      position: { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      map: map,
      icon: image
    });
    beachMarker.setMap(map);

    var _content = '<div class="pointInfo-box none">' +
      '<p title="'+cfg.name+'">'+cfg.name+'</p>' +
      '</div>';
    var infowindow = new google.maps.InfoWindow({
      position: { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      disableAutoPan: false,
      content: _content
    });
    //设置景点弹框样式
    google.maps.event.addListener(infowindow, 'domready', function() {
      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.css({ 'display': 'none' });
      iwOuter.next().css({ 'display': 'none' });
      iwOuter.css({ 'top': 40, 'left': 30 });
      $('.pointInfo-box').removeClass('none');
    })
    infowindow.open(map, beachMarker);
    // $(window).on("click", function(e) {
    //   e.stopPropagation();
    //   infowindow.close();
    // })
    // beachMarker.addListener("click", function() {
    //   event.stopPropagation();
    //   infowindow.open(map, beachMarker);
    // })
    // $(window).on("click", function(e) {
    //   e.stopPropagation();
    //   infowindow.close();
    // })
    // USGSOverlay.prototype  = new google.maps.OverlayView();

    // var overlay = new USGSOverlay(image, map);

    // function USGSOverlay(image, map){
    //       this.image_ = image;
    //       this.map_ = map;
    //       this.div_ = null;
    //       this.setMap(map);
    // }
    // USGSOverlay.prototype.onAdd = function(){
    //     var div = document.createElement('div');
    //     div.style.borderStyle = 'none';
    //     div.style.borderWidth = '0px';
    //     div.style.position = 'absolute';

    //     var img = document.createElement('div');
    //     img.innerHTML = "拖动至地图查看街景地图";
    //     img.style.position = 'absolute';
    //     img.style.padding = '3px 5px';
    //     img.style.backgroundColor = '#fff';
    //     img.style.boxShadow = '3px 3px 3px #999';
    //     div.appendChild(img);
    //     this.div_ = div;
    //     var panes = this.getPanes();
    //     panes.overlayLayer.appendChild(div);
    // }
    // USGSOverlay.prototype.draw = function(){
    //     var overlayProjection = this.getProjection();
    //     var div = this.div_;
    //     div.style.width = '200px';
    //     div.style.color = '#f63';
    //     div.style.right = '-32px';
    //     div.style.bottom = '-343px';
    // };
  }
}
