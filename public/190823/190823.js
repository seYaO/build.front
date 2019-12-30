var resourceSome = {

    //初始化轮播
    initSwiper: function () {
    },
    mainClick: function () {
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