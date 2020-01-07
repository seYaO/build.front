var resourceSome = {
    memberId: null,
    // 获取会员信息
    getMemberId: function () {
        // 获取memberId
        if ($.cookie("us") != "undefined" && $.cookie("us") != undefined && $.cookie("us") !== null) {
            var cookie = $.cookie("us");
            if ((cookie.split("&")[0]).split("=")[1] != "") {
                this.memberId = (cookie.split("&")[0]).split("=")[1];
            }
        } else {
            if ($.cookie("cnUser") != "undefined" && $.cookie("cnUser") != undefined && $.cookie("cnUser") !== null) {
                var cookie = $.cookie("cnUser");
                if ((cookie.split("&")[0]).split("=")[1] != "") {
                    this.memberId = (cookie.split("&")[0]).split("=")[1];
                }
            }
        }
    },

    // 点击领取红包
    getHbClick: function () {
        var that = this;
        $('.hbBtn1').on('click', function () {
            console.log(that.memberId)
            if (!that.memberId) {
                $.mLogin();
            } else {
                // 发送红包
                that.getHb(44953, 1);
            }
        })

    },

    // 领取红包
    getHb: function (pcId, type) {
        var that = this
        $.ajax({
            url: '/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
            data: 'action=GETSPMHONGBAO&New=1&ChannelID=' + pcId + '&MemberId=' + that.memberId,
            dataType: 'json',
            success: function (data) {
                // 发送成功
                if (data && data.State == 6) {
                    // 领取成功
                    $('.mask').removeClass('none');
                    if (type == 1) {
                        $('.hbPop1').removeClass('none');
                        $('.hbBtn1').addClass('hasGet');
                        $('.hbBtn1').html('已经领取');
                    } else {
                        $('.hbPop2').removeClass('none');
                        $('.hbBtn2').addClass('hasGet');
                        $('.hbBtn2').html('已经领取');
                    }

                } else if (data && data.State == 4) {
                    // 发送过了
                    $('.mask').removeClass('none');
                    $('.hasGetHbPop').removeClass('none');
                    if (type == 1) {
                        $('.hbBtn1').addClass('hasGet');
                        $('.hbBtn1').html('已经领取');
                    } else {
                        $('.hbBtn2').addClass('hasGet');
                        $('.hbBtn2').html('已经领取');
                    }
                } else {
                    $('.mask').removeClass('none');
                    $('.failHbPop').removeClass('none');
                }
            },
            complete: function () { }
        })
    },

    // 关闭弹框
    closePop: function () {
        $('.closeBtn, .hbPopBtn').on('click', function () {
            $('.mask').addClass('none');
            $('.successHbPop').addClass('none');
            $('.hasGetHbPop').addClass('none');
            $('.failHbPop').addClass('none');
        })
    },

    // map地图
    mapFn: function (getLon, getLan) {
        var map = new BMap.Map("baiduMap");
        var point = new BMap.Point(getLan, getLon);
        map.centerAndZoom(point, 13); // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用// 创建Map实例
        map.setDefaultCursor("url('bird.cur')");
        map.addControl(new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT
        }));
        map.addControl(new BMap.NavigationControl());
    },
    //初始化轮播
    initSwiper: function () {
        if ($(".section1Con").find('.left .slider_ul li').length > 1) {
            $(".section1Con .left").slider2({
                container: '.slider_ul',
                content: 'li',
                autoSlide: true,
                animeType: 'fade',
                navStyle: 'circle',
                animeTime: 260,
            });
        }
    },
    mainClick: function () {
        var that = this;
    },
    init: function () {
        this.initSwiper();
        this.mainClick();
        this.getMemberId();
        this.getHbClick();
        this.mapFn("38.492243", "106.240311");
        this.closePop();
    },
};


//专题脚本固定格式
var newRefid, addHtml, newSpm;
var channelId = $('#channelId').val();
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
            ChannelID: channelId[0], //频道ID【isAjaxGetRef为true时必传】
            isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
            tagName: ".both a", //需要自动添加refid的类名【可不传，默认所有a】
            tagValue: "href" //需要自动添加refid的元素属性【可不传，默认a标签的href】
        });
    }
};
allInit.init();