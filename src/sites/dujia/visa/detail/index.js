
    var Visa = {};
    var Common = require("common/0.1.0/index"),
        Scrollspy = require('scrollspy/0.1.0/index'), //滚动模块
        Dialog = require('dialog/0.1.0/index'), //样图弹窗模块
        Edialog = require('dialog/0.2.0/dialog'), //邮件弹窗模块
        Carousel = require('jCarousel/0.2.0/index'),
        Calendar = require("calendar/0.2.0/index"),
        Slidertoolbar = require("slidertoolbar/0.1.0/index"), //侧导航
        Comments = require('comment/0.3.0/visacomment'); //用户评价模块
    var mailconfig = '',
        printconfig = '',
        orderurl = '/dujia/AjaxcallTravel.aspx?type=SendVisaEmail', //发邮件
        matchurl = '/dujia/AjaxCallTravel.aspx?type=ValidateCode&amp;', //验证码
        nexturl = '/dujia/VisaFillIn.aspx?', //填写页
        advurl="/intervacation/api/VisaInfo/GetPCVisaAd",
        //条件异步
        selecturl = '/intervacation/api/VisaInfo/GetConditionForVisa?',
        countryurl = '/intervacation/api/VisaInfo/GetCountryForDetail?siteType=0'; //国家筛选
        cityIdurl = '/intervacation/api/VisaInfo/GetTopSalesVisaProduct?siteType=0'

    window.fzHost = '';
    Visa = {
        param: {
            productId: $('#hidProductId').val()
        },
        host: window.host || '',
        init: function(cfg) {
            var self = this;
            self._init(cfg);
        },
        _init: function(cfg) {
            var self = this;
            //this.selectCountry();//已停用
            self.selectMealFunc();
            self.clickFunc();
            self.flowEvent();
            self.tabMove();
            self.initScrollSpy();
            self.showBigImg();
            self.mailDialog();
            self.getBuyProUrl();
            self.getQueryString();
            self.sideadfn(function () {
                self.hideNumber();
            });
            self.commentTop();
            self.selectFunc();
        },
        hideNumber: function () {
            // var urlDate = this.getQueryParam("hideDate") ? this.getQueryParam("hideDate").replace(/-/g, "/") : "";
            $.ajax({
                url: "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue",
                dataType: "jsonp",
                success: function (data) {
                    var curDate = "";
                    // if (urlDate) {
                    //     curDate = Common.dateFormat(new Date(urlDate), "yyyyMMdd");
                    // } else {
                        if (data && data.totalseconds) {
                            var total = data.totalseconds.replace(/-/g, "/");
                            curDate = Common.dateFormat(new Date(total), "yyyyMMdd");
                        } else {
                            var now = new Date();
                            curDate = Common.dateFormat(now, "yyyyMMdd");
                        }
                    // }
                    // curDate = "20170202";
                    if (curDate > 20170126 && curDate < 20170203) {
                        $(".c_phone_add, .box-tel").css("display","none");
                        $(".module-slider-top").find("li").eq(1).css("display","none")
                    }
                }
            });
        },
        getQueryParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            } else {
                return null;
            }
        },
        commentTop: function() {
            var self = this,
                url = "/intervacation/api/Comment/GetCommentList?projectTag=qianzheng&dpSite=2&productId=" + self.param.productId + "&page=1&pageSize=1&sortType=3&tagId=2";
            $.ajax({
                url: url,
                dataType: "json",
                success: function(data) {
                    var commentHtml;
                    if (data && data.Data.CommentList.List && data.Data.CommentList.List.length) {
                        var commentContent = data.Data.CommentList.List[0].Comment;
                        var commentSatisfaction = data.Data.CommentList.Count[0].Satisfaction;
                        var commentAll = data.Data.CommentList.Count[0].All;
                        commentHtml = '<div class="topComment">' +
                            '<div class="chead"><span>用户点评：</span><em>' + commentSatisfaction + '%</em>满意度&nbsp;<em>' + commentAll + '</em>条点评</div>' +
                            '<div class="ccontent" title="' + commentContent + '">' + (commentContent.length > 65 ? (commentContent.substring(0, 65) + '...') : commentContent) + '</div>' +
                            '<a trace="commentsInfo_more" href="#commentsInfo">查看更多</a>' +
                            '</div>';
                    } else {
                        commentHtml = '<div class="topComment">' +
                            '<div class="chead"><span>用户点评：</span>&nbsp;<em>0</em>条点评</div>' +
                            '<div class="ccontent">' +
                            '<p>同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>' +
                            '</div>' +
                            '</div>';
                    }
                    $(".pro-topComment").empty().html(commentHtml);
                }
            });
        },
        /**
         * @desc 国家筛选跳转标签页
         */
        selectCountry: function() {
            var _countryTmpl = require('country.dot');
            $.ajax({
                url: countryurl,
                dataType: 'jsonp',
                success: function(data) {
                    if (data && data.Data) {
                        var data= data.Data.hotCountry || [];
                        var innerHtml = _countryTmpl(data);
                        $('.J_moreCountries').next().html(innerHtml);
                    }
                }
            });
        },
        /**
         * @desc 签证条件异步
         */
        selectCondition: function(regionId, relatedId, etimes) {
            var self = this;
            var dest = $('#hidCountryName').val();
            $('.moremeal').addClass('none');
            $.ajax({
                url: selecturl,
                data: {
                    dest: dest,
                    regionId: regionId || "",
                    relatedId: relatedId || "",
                    etimes: etimes || ""
                },
                dataType: 'jsonp',
                success: function(data) {
                    if (!data || !data.Data) {
                        $('.J_meallist').html("<p class='noresult'>无套餐信息！</p>");
                        $(".pro-meal").find(".cursor-show-icon").hide();
                    }
                    if (data && data.Data) {
                        var datas = data.Data;
                        var mealTmpl = '';
                        if (datas.Packages && datas.Packages.length) {
                            for (var i = 0; i < datas.Packages.length; i++) {
                                if (datas.Packages[i].Id == self.param.productId) {
                                    mealTmpl += '<span class="active J_trace" trace="meallist" title="' + datas.Packages[i].Name + '" data-id=' + datas.Packages[i].Id + '>' + datas.Packages[i].Name + '</span>';
                                }
                            }
                            for (var i = 0; i < datas.Packages.length; i++) {
                                if (datas.Packages[i].Id != self.param.productId) {
                                    mealTmpl += '<span class="J_trace" trace="meallist" title="' + datas.Packages[i].Name + '" data-id=' + datas.Packages[i].Id + '>' + datas.Packages[i].Name + '</span>';
                                }
                            }
                            if (datas.Packages.length > 6) {
                                $('.moremeal').removeClass('none');
                            }
                            $('.J_meallist').html(mealTmpl);
                        } else {
                            $('.J_meallist').html("<p class='noresult'>无套餐信息！</p>");
                            $(".pro-meal").find(".cursor-show-icon").hide();
                        }

                    }
                }
            });
        },
        /**
         * @desc 签证条件选择后渲染套餐
         */
        selectMealFunc: function() {
            var self = this;
            var regionid, relatedid, etimes;
            for (var i = 0; i < $('.select-area').length; i++) {
                regionid = $('.select-area').eq(0).attr('data-regionid');
                relatedid = $('.select-area').eq(1).attr('data-relatedid');
                etimes = $('.select-area').eq(2).attr('data-etimes');
            };
            self.selectCondition(regionid, relatedid, etimes);
        },
        /**
         * @desc 签证条件选择
         */
        selectFunc: function() {
            var self = this;
            //选择套餐
            $(document).on('click', '.J_meallist span', function() {
                $(this).addClass('active').siblings().removeClass('active');
                var id = $(this).attr('data-id');
                if (id == self.param.productId) {
                    return;
                }
                document.location.href = '/dujia/visa/visa-' + id + '.html';
            });

            $(document).on('click', function() {
                $('.select-areas').addClass('none');
            });
            //展开条件
            $(document).on('click', '.select-area', function(e) {
                e.stopPropagation();
                $('.select-areas').addClass('none');
                if ($(this).next('.select-areas').hasClass('none')) {
                    $(this).next('.select-areas').removeClass('none');
                } else {
                    $(this).next('.select-areas').addClass('none');
                }
            });
            var proregionid = $('.select-area').eq(0).attr('data-regionid');
            var prorelatedid = $('.select-area').eq(1).attr('data-relatedid');
            var proetimes = $('.select-area').eq(2).attr('data-etimes');
            $(document).on('click', '.select-areas li', function() {
                var origin = $(this).parent().prev('.select-area');

                var regionid = $(this).attr('data-regionid');
                var relatedid = $(this).attr('data-relatedid');
                var etimes = $(this).attr('data-etimes');

                origin.attr('data-regionid', regionid);
                origin.attr('data-relatedid', relatedid);
                origin.attr('data-etimes', etimes);

                var _proregionid = $('.select-area').eq(0).attr('data-regionid');
                var _prorelatedid = $('.select-area').eq(1).attr('data-relatedid');
                var _proetimes = $('.select-area').eq(2).attr('data-etimes');
                if (_proregionid == proregionid && _prorelatedid == prorelatedid && _proetimes == proetimes) {
                    $(".pro-meal").find(".cursor-show-icon").hide();
                } else {
                    $(".pro-meal").find(".cursor-show-icon").show();
                }
                $('.J_meallist').html("<p class='loading'>正在加载...</p>");
                $(this).parent().prev('.select-area').html($(this).html());


                self.selectMealFunc();
            });
            //更多套餐
            $(document).on('click', '.moremeal', function() {
                if ($(this).hasClass('open')) {
                    $(this).removeClass('open').addClass('close').html("收起");
                    $('.J_meallist').css('height', 'auto');
                } else {
                    $('.J_meallist').css('height', '78px');
                    $(this).removeClass('close').addClass('open').html("更多");
                }
            });
        },

        /**
         * @desc 邮件弹窗功能
         */
        mailDialog: function() {
            $dialog = new Edialog({
                skin: 'skin2'
            });
            var str = '',
                chat = '',
                tabli = $('.tab-title li'),
                header = '<h3>请选择需要打印的签证材料类型<span class="none">请至少选择一个材料类型</span></h3>',
                footer = '<div class="print-btn"><a href="javascript:void(0);" title="确定" class="print_submit">确定</a></div>',
                nums = $('.J_renderType').children().length;
            if (nums === 0) {
                tabli.each(function(i, e) {
                    var checked = i === 0 ? 'checked' : '';
                    str += "<label><input type='checkbox' name='visa-type' value=" + $(e).attr('data-id') + " checked/>" + $(e).html() + "</label>";
                    chat += "<label><input type='checkbox' name='visa-type' value='" + $(e).attr('data-id') + "'  " + checked + "/>" + $(e).html() + "</label>";
                });
                $('.J_renderType').html(str);
            }
            mailconfig = {
                content: $('.send-email').html(),
                title: '发送材料到您的邮箱',
                isdrag: false,
                type: 'html',
                height: '300px'
            };
            var printStr = '<div class="headbox">' + header + '<div class="visa-type">' + chat + '</div>' + footer + '</div>';
            printconfig = {
                content: printStr,
                title: '打印材料',
                isdrag: false,
                type: 'html',
                height: '220px'
            };
        },
        /**
         * @desc 初始化滚动导航功能
         */
        initScrollSpy: function() {
            var self = this;
            $("#conlist .content-nav-inner").scrollspy({
                pClass: "#conlist",
                curClass: "on",
                contentClass: ".J_NavBox",
                topH: 47,
                renderNav: function(sid, stxt, el, index) {
                    if (!index) {
                        return '<a trace="' + sid + '" class="on" href="#' + sid + '"><span>' + stxt + '</span></a>';
                    } else {
                        return '<a trace="' + sid + '" trace="1" href="#' + sid + '"><span>' + stxt + '</span></a>';
                    }
                },
                arrFn: {
                    "commentsInfo": function(el, parent) {
                        var comment = new Comments({
                            param: {
                                productId: self.param.productId
                            },
                        });
                        comment.initMain({
                            el: el,
                            parent: parent,
                            param: {
                                productId: self.param.productId
                            },
                            host: fzHost || host,
                            callback: function() {
                                $(".data-loading").remove();
                            }
                        });
                    },
                }
            });
        },

        // 判断是否有参数begin
        getQueryString: function(queryStr, key) {
            var _queryStr, _key;
            _queryStr = key ? queryStr : window.location.search.substr(1);
            _key = key || queryStr;
            var reg = new RegExp("(^|&)" + _key + "=([^&]*)(&|$)", "i");
            var r = _queryStr.match(reg);
            if (r !== null) {
                return decodeURI(r[2]);
            }
            return null;
        },
        // 判断是否有参数end
        /**
         * @desc 初始化立即预订功能
         */
        getBuyProUrl: function() {

            var self = this;
            $(".reserve-btn").css('display', 'none');
            $(window).scroll(function() {
                var scrheight = $(".box-main").offset().top;
                var wH = document.documentElement.scrollTop || document.body.scrollTop;
                if (wH > scrheight) {
                    $(".reserve-btn").css('display', 'block');
                } else {
                    $(".reserve-btn").css('display', 'none');
                }
            });
        },

        getUser: function() {
            var loginInfo = $.cookie("us"),
                userid;
            if (loginInfo) {
                userid = /userid=(\d+)/i.exec(loginInfo);
                userid = userid ? userid[1] : userid;
            }
            return userid;
        },
        //侧栏广告图走广告位
        sideadfn:function(callback){
            var me = this;
            $.ajax({
                url: advurl,
                type:"get",
                dataType: 'json',
                success: function(data) {
                    if(data.Status=="Success"){
                        var smallAd = data.Data.Slide.SmallAd,
                            LargeAd = data.Data.Slide.LargeAd;
                        me.slider(smallAd,LargeAd);
                        callback && callback.call(me);
                    }
                }
            });
        },
        slider: function(smallAd,LargeAd) {
            var userid = Visa.getUser();
            var slider = new Slidertoolbar({
                header: {
                    icon: '<a target="_blank" trace="slider_1" href="'+smallAd.Url.replace('http:','')+'"><img src="'+smallAd.ImageUrl.replace('http:','')+'"></a>',
                    tooltips: '<a target="_blank" trace="slider_2" href="'+LargeAd.Url.replace('http:','')+'"><img src="'+LargeAd.ImageUrl.replace('http:','')+'"></a>'
                },
                topMenu: [{
                    icon: '<a trace="slider_7" href="//member.ly.com/center"><div class="ico c-1"></div></a>',
                    tooltips: '<a trace="slider_8" href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<div class="ico c-2 J_trace"  trace="slider_5"></div>',
                    tooltips: '<a href="javascript:void(0)" trace="slider_6"><span class="ico-title">4001-899-812<i></i></span></a>',
                    arrow: false
                }, {
                    ideaClass: "udc-link",
                    icon: '<a class="J-UDC-Link"><div class="ico c-4"></div></a>',
                    tooltips: '<a class="J-UDC-Link"><span class="ico-title">意见反馈<i></i></span></a>',
                    arrow: false
                }, {
                    icon: '<a target="_blank" trace="slider_3" href="//livechat.ly.com/out/guest?p=2&c=3"><div class="ico c-5"></div></a>',
                    tooltips: '<a target="_blank" trace="slider_4" href="//livechat.ly.com/out/guest?p=2&c=3"><span class="ico-title">在线客服<i></i></span></a>',
                    arrow: false
                }],
                pageName: "签证详情页",
                toTop: true,
                skin:'skin2'
            });
            if (userid) {
                slider.resetMenu({
                    icon: '<a href="//member.ly.com/center"><div class="ico c-1-1"></div></a>',
                    tooltips: '<a href="//member.ly.com/center"><span class="ico-title">我的同程<i></i></span></a>',
                    arrow: false
                }, 'top', 0);
            }
        },
        /**
         * @desc 所需材料人员切换功能
         */
        tabMove: function() {
            $('.tab-title li').on('click', function() {
                var self = $(this),
                    index = self.index();
                $('.tab-title').children().removeClass('cur');
                self.addClass('cur');
                $('.tab-content').children().addClass('pane-none');
                $($('.tab-content').children()[index]).removeClass('pane-none');
            });
            $('.content-nav-inner a').on('click', function() {
                var self = $(this),
                    index = self.index();
                $('.content-nav-inner').children().removeClass('on');
                self.addClass('on');
            });
        },
        /**
         * @desc 显示图样
         */
        showBigImg: function() {
            var _dialog, _self = $('#show_photo');

            $('.onjob-sample').on('click', function() {
                var urlstr = '',
                    txt = '',
                    msg = '';
                var url = $(this).attr('data-url');
                if (!url) {
                    return;
                };
                var urllist = url.split(',');
                var txtlist = $(this).attr('data-title').split('&');
                var msglist = $(this).attr('data-content').split('&');
                $.each(urllist, function(i) {
                    urlstr = urlstr + '<li><a href="javascript:void(0);"><img src=' + urllist[i].replace('http:','') + '></a></li>';
                });

                $.each(txtlist, function(i) {
                    if (i === 0) {
                        txt = txt + '<span>' + txtlist[i] + '</span>';
                    } else {
                        txt = txt + '<span class="none">' + txtlist[i] + '</span>';
                    }
                });

                $.each(msglist, function(i) {
                    if (i === 0) {
                        msg = msg + '<p>' + msglist[i] + '</p>';
                    } else {
                        msg = msg + '<p class="none">' + msglist[i] + '</p>';
                    }
                });

                _self.find('.photo').append('<a style="float:none" target="_blank" href=' + urllist[0].replace('http:','') + '><img id="focusPic" src=' + urllist[0].replace('http:','') + '></a>');
                _self.find('.mslide-panel h3').append(txt);
                _self.find('.mslide-panel .detail').append(msg);
                _self.find('.list ul').html(urlstr);

                var content = _self.find('.mslide-panel').clone(true);
                if (content.length) {
                    _dialog = Dialog({
                        content: content,
                        tip: true,
                        width: 980,
                        height: 660,
                        padding: 0,
                        className: "comment",
                        zIndex: 10000,
                        onshow: function() {
                            var mslide = content.find(".photo-mslide");
                            var pic = content.find(".photo img");
                            var bigpic = content.find(".photo a[target='_blank']");
                            //seajs.use("jCarousel/0.1.1/index", function (Carousel) {
                            var car = new Carousel(mslide, {
                                canvas: ".list ul",
                                item: "li",
                                circular: false,
                                visible: 6,
                                preload: 0,
                                btnNav: false,
                                btnPrev: ".prev",
                                btnNext: ".next"
                            });
                            var carIndex = 0,
                                calLiLen = car.itemLength;
                            car.on("prevClick", function() {
                                carIndex--;
                                carIndex < 0 && (carIndex = 0);
                                car.li.eq(carIndex).click();
                            });
                            car.on("nextClick", function() {
                                carIndex++;
                                carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                                car.li.eq(carIndex).click();
                            });
                            car.on("itemClick", function(index, node, all) {
                                var self = $(this),
                                    title = $(node).parents(".mslide-panel").find("h3"),
                                    msg = $(node).parents(".mslide-panel").find(".detail");
                                $(all).removeClass("active");
                                $(node).addClass("active");
                                carIndex = index;
                                $(title).children("span").addClass("none");
                                $($(title).children("span")[carIndex]).removeClass("none");

                                $(msg).children("p").addClass("none");
                                $($(msg).children("p")[carIndex]).removeClass("none");
                                var src = $(node).find("img").attr("src");
                                pic.attr("src", src);
                                bigpic.attr("href", src);
                                content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                            });
                            content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                        },
                        onclose: function() {}
                    });
                }
                _dialog.showModal();
            });

            $(document).on("click", ".JJ_close", function() {
                _self.find('.photo img').remove();
                $(_self.find('.mslide-panel h3')).children('span').remove();
                $(_self.find('.mslide-panel .detail')).children('p').remove();
                $(_self.find('.list ul')).children('li').remove();
                _dialog.remove().close();
            });
        },
        /**
         * @desc 点击或移动事件
         */
        clickFunc: function() {
            var self = this;
            var _req;
            fish.require('verify', function() {
                _req = fish.all('.email_input,.code_input,.fp-tt-in').verify();
            });
            //国家选择
            $('.J_moreCountries').on('click', function(e) {
                e.stopPropagation();
                $(this).next().show();
            });
            $(document).on('click', function() {
                $('.J_moreCountries').next().hide();
            });
            $(document).on('click', '.continent>li', function(e) {
                e.stopPropagation();
                $('.continent li').removeClass('active');
                $(this).addClass('active');
                var index = $(this).index();
                $('.continent').nextAll().addClass('none');
                $('.continent').nextAll().eq(index).removeClass('none');
            });
            $(document).on('click', '.countries>li', function() {
                var countryId = $(this).attr('data-countryId'),
                    regionId = $(".region").find(".select-area").attr("data-regionid"),
                    relatedId = $(".related").find(".select-area").attr("data-relatedid");
                var _cityIdurl = cityIdurl+"&countryId="+countryId+"&regionId="+regionId+"&visaTypeId="+relatedId;

                $.ajax({
                    url: _cityIdurl,
                    type:"get",
                    dataType: 'json',
                    success: function(data) {
                        var cityId = data.Data.data;
                        if(data.Status=="Success" && cityId != 0){
                            var _countryUrl = '/dujia/visa/visa-' + cityId + '.html';
                            window.location.href = _countryUrl;
                        }
                    }
                });
            });

            //价格说明
            $('.priceInform').mouseover(function() {
                $(this).next().show();
            });
            $('.priceInform').mouseout(function() {
                $(this).next().hide();
            });
            //优惠说明显示
            $('.J_cou').mouseover(function() {
                var self = $(this);
                self.next().show();
            });
            $('.J_cou').mouseout(function() {
                var self = $(this);
                self.next().hide();
            });
            if ($('.cursor-info .ser-info').text().length > 69) {
                $('.content .info').mouseover(function() {
                    $('.cursor-info').show();
                });
                $('.content .info').mouseout(function() {
                    $('.cursor-info').hide();
                });
            }
            $('.cursor').mouseover(function() {
                $('.cursor-show').show();
            });

            $('.cursor').mouseout(function() {
                $('.cursor-show').hide();
            });

            $('.pro-icon-child').mouseover(function() {
                $('.cursor-show-child').show();
            });

            $('.pro-icon-child').mouseout(function() {
                $('.cursor-show-child').hide();
            });
            $('.pro-icon').mouseover(function() {
                $(this).find('.cursor-show-icon').show();
            });

            $('.pro-icon').mouseout(function() {
                $(this).find('.cursor-show-icon').hide();
            });

            //点击跳转下单页
            // var hidEarlyBookDate = $('#hidEarlyBookDate').val();
            $(document).on('click', '.buy-btn, .reserve-btn', function() {
                document.location.href = nexturl + 'id=' + self.param.productId + '&pricelist=1|0';
            });
            //点击email材料按钮事件
            $('.btn-email').on('click', function() {
                $dialog.modal(mailconfig);
                //$dialog.modal('show');
            });
            $('.J_btnPrint').on('click', function() {
                self.printurl = $(this).attr("data-url") || "";
                $dialog.modal(printconfig);
            });
            //点击发送邮箱按钮事件
            $(document).on('click', '.dialog_modal_gp .send_submit', function() {
                var _modal = $('.dialog_modal_gp');
                var fromTip = _modal.find('.prompt-info'),
                    mailval = _modal.find('.email_input'),
                    codeval = _modal.find('.code_input'),
                    mailbtn = _modal.find('.send_submit'),
                    visatype = false;
                mailval.css('color', '#000');
                codeval.css('color', '#000');
                var careerval = [],
                    careervalStr = '';
                _modal.find('.visa-dialog label').each(function() {
                    if ($(this).children()[0].checked) {
                        careerval.push($($(this).children()[0]).val());
                        visatype = true;
                    }
                });
                careervalStr = careerval.join(',');
                if (!visatype) {
                    fromTip.text('请至少选择一个材料类型');
                    return;
                } else if (!mailval.val()) {
                    fromTip.text('请输入邮箱地址');
                    return;
                } else if (!fish.valida.email(mailval.val())) {
                    fromTip.text('请输入正确的邮箱地址');
                    mailval.css('color', 'red');
                    return;
                } else if (!codeval.val()) {
                    fromTip.text('请输入验证码');
                    return;
                }
                mailbtn.text('发送中...');
                mailbtn.attr('disabled', 'disabled');
                var endfun = function() {
                    codeval.val('');
                    _modal.find('#imgcode').attr('src', self.host.page + matchurl + 'r=' + Math.random());
                    mailbtn.text('发送');
                    mailbtn.removeAttr('disabled', 'disabled');
                };
                var _url = self.host.page + orderurl + '&lineId=' + Visa.param.productId + '&mailTo=' + mailval.val() + '&careerType=' + careervalStr + '&checkCode=' + codeval.val();
                $.ajax({
                    url: _url,
                    dataType: 'jsonp',
                    success: function(data) {
                        fromTip.text('');
                        if (data.state === 100) {
                            if (JSON.parse(data.data).No === '100') {
                                fromTip.text('发送成功');
                                endfun();
                            } else if (JSON.parse(data.data).No === '200') {
                                fromTip.text('发送失败');
                                endfun();
                            }
                        } else if (data.state === 200) {
                            if (JSON.parse(data.data).No === '021') {
                                fromTip.text('验证失败');
                                endfun();
                            } else if (JSON.parse(data.data).No === '022') {
                                fromTip.text('验证码不匹配');
                                endfun();
                            } else if (JSON.parse(data.data).No === '023') {
                                fromTip.text('验证失败');
                                endfun();
                            }
                        }
                    },
                    error: function() {
                        fromTip.text("发送失败");
                        endfun();
                    }
                });
            });

            $(document).on('click', '.dialog_modal_gp .print_submit', function() {
                var _modal = $('.dialog_modal_gp'),
                    careerval = [],
                    careervalStr = '',
                    visatype = false;
                _modal.find(".headbox h3").find("span").hide();
                _modal.find('.visa-type label').each(function() {
                    if ($(this).children()[0].checked) {
                        careerval.push($($(this).children()[0]).val());
                        visatype = true;
                    }
                });
                careervalStr = careerval.join('|');
                if (!visatype) {
                    _modal.find(".headbox h3").find("span").show();
                    return;
                }
                window.open(self.printurl + "typeId=" + careervalStr);
            });
        },
        /**
         * @desc 预订流程
         */
        flowEvent: function() {
            var indexli = $('.flow-msg ul').children().length;
            var flow_msg_li = $('.flow-msg ul').find('li');
            var indexcss = 212 * indexli - 85;

            $('.flow-msg ul').css({
                'width': 212 * indexli + 'px'
            });
            $('.flow-nums').css({
                'width': indexcss + 'px'
            });
            flow_msg_li.eq(0).find('i').eq(0).css({
                'background': '0'
            });
            flow_msg_li.eq(0).find('div').eq(1).css({
                'border-left': '0'
            });

            flow_msg_li.eq(4).find('i').eq(1).css({
                'height': '0'
            });
            flow_msg_li.eq(5).find('div').eq(1).css({
                'border-left': '0'
            });

            flow_msg_li.eq(indexli - 1).find('i').eq(1).css({
                'background': '0'
            });

            if (indexli === 5) {
                $('.flow-left').css({
                    'display': 'none'
                });
                $('.flow-right').css({
                    'display': 'none'
                });
                $('.flow-msg').css({
                    'margin': '20px 43px 0 43px'
                });
            }

            $('.flow-left').mouseover(function() {
                scrollb = setInterval('wins.scrollLeft-=20', 20);
            });
            $('.flow-left').mouseout(function() {
                clearInterval(scrollb);
            });

            $('.flow-right').mouseover(function() {
                scrollb = setInterval('wins.scrollLeft+=20', 20);
                flow_msg_li.eq(4).find('i').eq(1).css({
                    'height': '8px'
                });
                flow_msg_li.eq(5).find('div').eq(1).css({
                    'border-left': '1px solid #e8e8e8'
                });
            });
            $('.flow-right').mouseout(function() {
                clearInterval(scrollb);
            });
        }

    };
    return Visa;
