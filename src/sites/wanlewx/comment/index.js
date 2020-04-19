(function(){
    require("../modules-lite/dataLoader/dataLoader");
    require("../modules-lite/slider/slider");
    function buildCommentHeader(data) {
        data = data || {
                moderate: "0",
                good: "0",
                negative: "0",
                photo: "0",
                all: "0"
            };
        // return '<ul class="comment-header clearfix">' +
        //     '<li class="comment-category">' +
        //     '<p><span>全部(' + data.TotalCount + '条)</span><i></i></p>' +
        //     '<i></i>' +
        //     '<ul>' +
        //     '<li class="current" data-value="tagId:1;">全部(' + data.TotalCount + '条)</li>' +
        //     '<li data-value="tagId:2;">好评(' + data.GoodCount + '条)</li>' +
        //     '<li data-value="tagId:3;">中评(' + data.MidCount + '条)</li>' +
        //     '<li data-value="tagId:4;">差评(' + data.BadCount + '条)</li>' +
        //     '<li data-value="tagId:5;">有图(' + data.ImageCount + '条)</li>' +
        //     '</ul>' +
        //     '</li>' +
        //     '<li class="comment-sort">' +
        //     '<p><span>默认排序</span><i></i></p>' +
        //     '<i></i>' +
        //     '<ul>' +
        //     '<li class="current" data-value="sort:0;">默认排序</li>' +
        //     '<li data-value="sort:1;">最有价值</li>' +
        //     '<li data-value="sort:3;">时间排序</li>' +
        //     '</ul>' +
        //     '</li>' +
        //     '</ul>';
        return '<ul>'+
                    '<li data-value="tagId:1;">全部(' + data.TotalCount + '条)</li>'+
                    '<li data-value="tagId:2;">好评(' + data.GoodCount + '条)</li>'+
                    '<li data-value="tagId:3;">中评(' + data.MidCount + '条)</li>'+
                    '<li data-value="tagId:4;">差评(' + data.BadCount + '条)</li>'+
                    '<li data-value="tagId:5;">有图(' + data.ImageCount + '条)</li>'+
                '</ul>';
    }

    function buildCommentList(list) {
        var htmlStr = '';
        for (var i = 0, len = list.length; i < len; i++) {
            htmlStr += buildCommentItem(list[i]);
        }
        return htmlStr;
    }

    function buildCommentItem(item) {
        return '<li class="comment-item">' +
            // '<h4>' +
            // '<span class="nickname">' + item.Creator + '<i class="level' + item.UserLeavel + '"></i></span>' +
            // '<span class="time">' + item.DPTime.split(" ")[0] + '</span>' +
            // '</h4>' +
            '<div class="comm-detail">'+
                '<h4>'+
                    '<img src="'+item.UserImage+'">'+
                    '<div class="tel">'+
                        '<span>'+item.Creator+'</span>'+
                        '<span>'+item.DPTime.split(" ")[0]+'</span>'+
                    '</div>'+
                    '<div class="time">'+item.TypeDesc+'</div>'+
                '</h4>'+
            '</div>'+
            '<div class="info">' +
            '<p><span>' + item.Content + '</span></p>' +
            '<span></span>' +
            '</div>' +
            buildCommentItemImageList(item.ImageList) +
            (item.Reply ? '<dl><dt>【同程客服】</dt><dd>' + item.Reply + '</dd></dl>' : '') +
                //点赞
                //'<p><a class="thumb-up" data-cometid="'+ item.resId +'" href="javascript:;"><em></em><b>' + (item.praiseCount || 0) + '</b></a></p>' +
            '<p></p>'+
            '</li>';
            
    }

    //点赞，因接口问题暂时去掉
    //var thumbUpUrl = document.getElementById('J_thumbUp').value;
    //$(document).on("click", ".thumb-up", function (data) {
    //    var el = $(this);
    //    if (el.hasClass("disables")) {
    //        return;
    //    }
    //    var commentId = el.attr("data-cometid"),
    //        url = thumbUpUrl + "&commentId=" + commentId,
    //        bEl = el.find("b"),
    //        bText = bEl.text() - 0;
    //    $.ajax({
    //        url: url,
    //        dataType: "jsonp",
    //        success: function (data) {
    //            if (data[0] === "success") {
    //                bEl.text(bText + 1);
    //                bEl.parent().addClass("disables");
    //            } else {
    //                alert("一个用户只能评价一次!");
    //                bEl.parent().addClass("disables");
    //            }
    //        }
    //    });
    //});

    var imageCache = [];

    function buildCommentItemImageList(images) {
        if (!images) {
            return '';
        }
        imageCache.push(images);
        if(typeof(images) == "string"){
            images = images.split(',');
        }
        var len = images.length > 4 ? 3 : images.length,
            htmlStr = '';
        for (var i = 0; i < len; i++) {
            htmlStr += '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '150x150') + '" /></li>';
        }
        if (images.length > 4) {
            htmlStr += '<li class="image-amount"><p><span>共' + images.length + '张</span></p></li>';
        }
        if (images.length) {
            htmlStr = '<ul class="image-line clearfix" data-index="' + (imageCache.length - 1) + '">' + htmlStr + '</ul>';
        }
        return htmlStr;
    }

    function buildImageUrl(url, size) {
        url = url.split('.');
        var suffix = url.pop();
        return url.join('.') + '_' + size + '_00.' + suffix;
    }

    function init() {
        // $(".comment-header > li").delegate('p', "click", function (e) {
        //     var elem = $(e.liveFired);
        //     if (elem.hasClass("open")) {
        //         elem.removeClass("open");
        //     } else {
        //         $(".open", e.liveFired.parentNode).removeClass("up").removeClass("open");
        //         elem.addClass('up').addClass("open");
        //     }
        // }).delegate('i', 'click', function (e) {
        //     $(e.liveFired).removeClass("open");
        // }).
        $(".top-wrapper").on('click','li', function (e) {
            var elem = $(this);
            if (elem.hasClass('current')) {
                // $(e.liveFired).removeClass("open");
                return;
            }
            $('.current', e.liveFired).removeClass('current');
            elem.addClass('current');
            $('span', e.liveFired).html(this.innerHTML);
            // $(e.liveFired).removeClass("open");
            dataLoader.isLoaded = false;
            dataLoader.ajaxObj.data.pageIndex = 1;
            var values = this.getAttribute("data-value").split(':');
            $('.comment-list').html('');
            $('.data-loader, .no-data').remove();
            imageCache = []; // 图片存储还原
            dataLoader.ajaxObj.data[values[0]] = parseInt(values[1]);
            document.getElementById('pageLoading').style.display = 'block';
            dataLoader.loadData();
        });
        $(".comment-list").delegate('.expanded span', 'click', function () {
            var elem = $(this.parentNode);
            if (elem.hasClass('open')) {
                elem.removeClass('open');
                $('p', elem).css({
                    height: parseInt($('p span', elem).css('line-height')) * 5 + 'px'
                });
            } else {
                elem.addClass('open');
                setTimeout(function () {
                    $('p', elem).css({
                        height: resetHeight($('p span', elem).height()) + 'px'
                    });
                }, 0);
            }
        }).delegate('.image-amount', 'click', function () {
            $('#imageListPage .page-header h2').html('图片(' + $('p span', this).html() + ')');
            var index = this.parentNode.getAttribute('data-index'),
                htmlStr = '',
                i = 2;
            if(typeof(imageCache[parseInt(index)]) == "string"){
                var images = imageCache[parseInt(index)].split(',');
            }else{
                var images = imageCache[parseInt(index)];
            }
            var len = images.length;
            for (; i < len; i += 3) {
                htmlStr += '<ul class="image-line clearfix" data-index="' + index + '">' +
                    '<li><img data-pos="' + (i - 2) + '" src="' + buildImageUrl(images[i - 2], '150x150') + '"></li>' +
                    '<li><img data-pos="' + (i - 1) + '" src="' + buildImageUrl(images[i - 1], '150x150') + '"></li>' +
                    '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '150x150') + '"></li>' +
                    '</ul>';
            }
            i -= 2;
            if (i !== len) {
                htmlStr += '<ul class="image-line clearfix" data-index="' + index + '">';
                for (; i < len; i++) {
                    htmlStr += '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '150x150') + '"></li>';
                }
                htmlStr += '</ul>';
            }
            $('#imageListPage .content').html(htmlStr);
            dataLoader.stop();
            page.open('imageList');
        });
        $(".comment-list, #imageListPage .content").delegate('img', 'click', function () {
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),
                htmlStr = '<div id="imageView" class="slider"><ul>';
            if(typeof(imageCache[parseInt(elem.attr('data-index'))]) == "string"){
                var images = imageCache[parseInt(elem.attr('data-index'))].split(',');
            }else{
                var images = imageCache[parseInt(elem.attr('data-index'))];
            }
            for (var i = 0, len = images.length; i < len; i++) {
                htmlStr += '<li><div><img src="' + images[i] + '"/></div></li>';
            }
            htmlStr +='</ul></div>' +
                '<div class="image-view-nav"><a href="javascript:;"></a><span>' + pos + '/' + images.length +'</span><a href="javascript:;"></a></div>';
            $("#imageViewPage").html(htmlStr);
            var slider = $("#imageView").slider({
                autoScroll: false,
                loop: false,
                fn: function() {
                    $('.image-view-nav span').html((this.index + 1) + '/' + this.length);
                    if (this.index === 0) {
                        $('.image-view-nav a:first-child').addClass('disabled');
                    } else {
                        $('.image-view-nav a:first-child').removeClass('disabled');
                    }
                    if (this.index === this.length - 1) {
                        $('.image-view-nav a:last-child').addClass('disabled');
                    } else {
                        $('.image-view-nav a:last-child').removeClass('disabled');
                    }
                }
            });
            $('.image-view-nav a:first-child').on("click", function (e) {
                e.stopPropagation();
                if (!$(this).hasClass('disabled')) {
                    slider.previous();
                }
            });
            $('.image-view-nav a:last-child').on("click", function (e) {
                e.stopPropagation();
                if (!$(this).hasClass('disabled')) {
                    slider.next();
                }
            });
            slider.to(pos);
            // slider.index = pos;
            page.open('imageView');
            //
        });
    }
    $('#imageViewPage').on('click', function () {
        page.close();
    });
    $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
        initComment();
    });

    function initComment() {
        var elems = $('.comment-item'),
            elem,
            innerElem,
            maxHeight;
        for (var i = 0, len = elems.length; i < len; i++) {
            elem = $('.info', elems[i]);
            innerElem = $('p span', elem);
            maxHeight = parseInt(innerElem.css('line-height')) * 5;
            if (innerElem.height() > maxHeight) {
                if (elem.hasClass('open')) {
                    $('p', elem).css({
                        height: resetHeight(innerElem.height()) + 'px'
                    });
                } else {
                    $('p', elem).css({
                        height: maxHeight + 'px'
                    });
                }
                (function (elem) {
                    setTimeout(function () {
                        elem.addClass('expanded');
                    }, 0);
                })(elem);
            } else {
                elem.removeClass('expanded');
            }
        }
    }

    function resetHeight(height) {
        return  Math.ceil(height / 21) * 21;
    }

    page.init();
    page.add("main", function () {
        dataLoader.start();
        initComment();
    });
    var commentUrl = "/wanle/api/WanleComment/GetWanleCommentList?dpSite=6&",
        commentUrlObj = $.parseUrl(commentUrl),
        commentRid,
    //dataType = 'json';
        dataType = 'jsonp';
    commentRid = parseInt(/_(\d+)\.html/.exec(location.href)[1],10);
    if (commentRid === undefined) {
        commentUrl += '&lineId=' + parseInt(/-(\d+)\.html/.exec(location.href)[1], 10);
    }
    var dataLoader = $("#mainPage .content").dataLoader({
        bottom: 5,
        ajaxObj: {
            url: commentUrl,
            data: {
                lineId: commentRid,
                userId: getMemberId() == 0 ? 1: getMemberId(),   //点评中会员id为0是不合法的，0太特殊，改为1好了
                sort: 0,
                tagId: 1,
                pageIndex: 1,
                pageSize: 10
            },
            dataType: dataType,
            success: function (data, loader) {
                if ($("#mainPage .comment-header").length === 0) {
                    var elem = $(".top-wrapper");
                    elem.html("");
                    elem.append(buildCommentHeader(data.Data.CommentSummary));
                    $("#mainPage .content").css({
                        'margin-top': elem.height() + 'px'
                    });
                    if ($("body").hasClass("app-include")) {
                        $(elem).css({
                            'top': 0,
                            'position': 'fixed'
                        });
                    } else {
                        $(elem).css({
                            'top': 0,
                            'position': 'fixed'
                        });
                    }
                    init();
                }
                if (loader.ajaxObj.data.pageIndex === 1 && data.Data.CommentList.length === 0) {
                    if (!$("#mainPage .content .no-data").length) {
                        $("#mainPage .content").append('<div class="no-data">' +
                            '<i></i>' +
                            '<p>暂时没有相关点评，不妨去体验下</p>' +
                            '</div>');
                    }
                    loader.isLoaded = true;
                    return;
                }
                $("#mainPage .comment-list").append(buildCommentList(data.Data.CommentList));
                initComment();
                if (data.Data.CommentList.length < 10) {
                    loader.isLoaded = true;
                }
                loader.ajaxObj.data.pageIndex++;
            },
            complete: function () {
                document.getElementById('pageLoading').style.display = 'none';
            }
        }
    });

    var ua = navigator.userAgent;
    if(ua.indexOf("MQQBrowser")>-1 && ua.indexOf("QQ/")===-1){
        $("body").addClass("is-qq-browser");
    }
    var isApp = /TcTravel\/(\d+\.\d+\.\d+)/.exec(ua);
    if((isApp&&isApp[1])){
        $("body").addClass("app-include");
    }

    if (/tctravel/.test(navigator.userAgent.toLowerCase())) {
        if ($(".page-header")) {
            $(".page-header").attr("class", "page-header none");
        }
        if ($(".page-footer")) {
            $(".page-footer").attr("class", "page-footer none");
        }
        $(".page-footer").eq(0).attr("class", "page-footer none");
        $(document).ready(function () {
            if ($(".nmbcnucndy")) {
                $(".nmbcnucndy").attr("class", "none");
            }
        });
    }
    document.getElementById('pageLoading').style.display = 'block';
    dataLoader.loadData();
})();
