// function mapFn() {
//   var map = new BMap.Map("baiduMap");
//   var point = new BMap.Point(117.231716, 31.829523);
//   map.centerAndZoom(point, 13); // 初始化地图,设置中心点坐标和地图级别
//   map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
//   map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用// 创建Map实例
//   map.setDefaultCursor("url('bird.cur')");
//   map.addControl(new BMap.ScaleControl({
//     anchor: BMAP_ANCHOR_BOTTOM_LEFT
//   }));
//   map.addControl(new BMap.NavigationControl());
// };
// mapFn();

var resourceSome = {

    //初始化轮播
    initSwiper: function () {
        if ($(".section5Con").find('.cy .slider_ul li').length > 1) {
            $(".section5Con .cy").slider2({
                container: '.slider_ul',
                content: 'li',
                autoSlide: true,
                animeType: 'fade',
                navStyle: 'circle',
                animeTime: 260,
                prevBtn: '.prev',
                nextBtn: '.next',
                slideEvent: 'click'
            });
        }
    },
    mainClick: function () {
        var that = this;
        $('.section2 .tabs').on('click', '.tab', function () {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $('.section2 .sourceCon .sourceBlock').addClass('none');
            $('.section2 .sourceCon .sourceBlock').eq(index).removeClass('none');
        });
        $('.section3Con .tabs').on('click', '.tab', function () {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $('.section3Con .sourceCon .sourceBlock').addClass('none');
            $('.section3Con .sourceCon .sourceBlock').eq(index).removeClass('none');
        });
        $('.section3subCon .tabs').on('click', '.tab', function () {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $('.section3subCon .sourceCon .sourceBlock').addClass('none');
            $('.section3subCon .sourceCon .sourceBlock').eq(index).removeClass('none');
        });
        $('.section6 .tabs').on('click', '.tab', function () {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $('.section6 .sourceCon .sourceBlock').addClass('none');
            $('.section6 .sourceCon .sourceBlock').eq(index).removeClass('none');
            $('.section6 .left .img').addClass('none');
            $('.section6 .left .img').eq(index).removeClass('none');
        });
    },
    init: function () {
        this.initSwiper();
        this.mainClick();
    }
};

// 专题脚本固定格式
var newRefid;
var addHtml;
var newSpm;
var allInit = {
    doRefid: function (dataAndRefid) {
        //Hellow world~   所有的一切从这里开始
        newRefid = dataAndRefid[0];
        newSpm = dataAndRefid[1];

        addHtml = (newSpm.indexOf("|") > 0) ? '|' + newSpm.split("|")[0] + '&refid=' + newRefid : '&refid=' + newRefid;
        resourceSome.init();
    },
    init: function () {
        setRefId({
            isAjaxGetRef: true, //是否需要异步获取refid【默认false】
            ChannelID: 38395, //频道ID【isAjaxGetRef为true时必传】
            isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
            tagName: ".both a", //需要自动添加refid的类名【可不传，默认所有a】
            tagValue: "href" //需要自动添加refid的元素属性【可不传，默认a标签的href】
        });
    }
};
allInit.init();