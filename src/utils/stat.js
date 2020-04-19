// pv统计
var pageview = stat.formatPageview('/出境/pc活动页/千叶');
stat.init({
    "baidu": { //百度统计
        "parameter": "pc" //PC端传“pc”，touch站传“touch”
    },
    "pvConfig": { //PV统计
        "PublicPlatId": "1",
        "PageId": "1806",
        "LineId": "0",
        "ActivityId": "1806",
        "ActivityPeriodId": "3833",
        "ModuleId": "0",
        "PVSource": "1",
        "ak": "",
        "url": "http://www.ly.com/dujia/AjaxHelper/PvHandler.ashx"
    },
    "vst": [ //PMAS统计
        ['_serialid', '0'],
        ['_vrcode', '10002-2006-0'],
        ['_refId', stat.getRefid()],
        ['_userId', stat.getMemberId()],
        ['_openTime', stat.timeDiff],
        ['_trackPageview', pageview]
    ]
});