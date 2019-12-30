var resourceSome = {

    //初始化轮播
    initSwiper: function () {
        if ($('.top').find("li").length > 1) {
            $('.top').slider2({
                container: ".inside",
                content: "li",
                autoSlide: true,
                navStyle: "circle",
                animeType: "fade",
                animeTime: 260
            });
        }
        if ($(".section1Con").find('.sourceCon .slider_ul li').length > 1) {
            $(".section1Con .sourceCon").slider2({
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
            ChannelID: 42929, //频道ID【isAjaxGetRef为true时必传】
            isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
            tagName: ".both a", //需要自动添加refid的类名【可不传，默认所有a】
            tagValue: "href" //需要自动添加refid的元素属性【可不传，默认a标签的href】
        });
    }
};
allInit.init();