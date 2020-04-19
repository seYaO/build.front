(function(){
    require("modules-touch/dataLoader/dataLoader");
    require("modules-touch/slider/slider");
    function buildCommentHeader(data) {
        data = data || {
            Moderate: "0",
            Good: "0",
            Negative: "0",
            Photo: "0",
            All: "0"
        };
        return '<ul class="comment-header clearfix">' +
            '<li class="comment-category">' +
                '<p><span>全部(' + data.All + '条)</span><i></i></p>' +
                '<i></i>' +
                '<ul>' +
                    '<li class="current" data-value="tagId:1;">全部(' + data.All + '条)</li>' +
                    '<li data-value="tagId:2;">好评(' + data.Good + '条)</li>' +
                    '<li data-value="tagId:3;">中评(' + data.Moderate + '条)</li>' +
                    '<li data-value="tagId:4;">差评(' + data.Negative + '条)</li>' +
                    '<li data-value="tagId:5;">有图(' + data.Photo + '条)</li>' +
                '</ul>' +
            '</li>' +
            '<li class="comment-sort">' +
                '<p><span>默认排序</span><i></i></p>' +
                '<i></i>' +
                '<ul>' +
                    '<li class="current" data-value="sortType:0;">默认排序</li>' +
                    '<li data-value="sortType:1;">最有价值</li>' +
                    '<li data-value="sortType:3;">时间排序</li>' +
                '</ul>' +
            '</li>' +
        '</ul>';
    }

    function buildCommentList(list) {
        var htmlStr = '';
        for (var i = 0, len = list.length; i < len; i++) {
            htmlStr += buildCommentItem(list[i]);
        }
        return htmlStr;
    }

    function starLevel(total,curNum) {
        var starHtml = '',
            diffNum = total - curNum;
        if(curNum > 0) {
            for (var i = 0; i < curNum; i ++) {
                starHtml += '<em class="star-full"></em>';
            }
        }
        if (diffNum > 0) {
            for (var j = 0; j < diffNum; j ++) {
                starHtml += '<em></em>';
            }
        }
        return starHtml;
    }

    function buildCommentItem(item) {
        var commentInfo = item.ChildCommentInfoList,
            listLen = commentInfo ? commentInfo.length : 0,
            commContent = '',
            isCream = '';
        if (parseInt(item.IsElite, 10)) {
            isCream = '<span class="com-cream"></span>';
        }
        for (var i = 0; i < listLen; i++) {
            if(commentInfo[i].CLDTCommentContent) {
                commContent += '<li class="com-intro">' +
                    '<div class="com-title">' + commentInfo[i].CLDTCommentTypeName + '<span class="star-num">' + starLevel(5, commentInfo[i].CLDTCommentScore) + '</span></div>' +
                    '<div class="com-desc">' + commentInfo[i].CLDTCommentContent + '</div>' +
                    '</li>';
            }
        }
        if (commContent) {
            commContent = '<ul class="com-ul">' + commContent + '</ul>';
        }
        return '<li class="comment-item">' +
            '<h4>' +
                '<span class="nickname">' + item.Creator + '<i class="level' + item.Level + '"></i></span>' +
                '<span class="time">' + item.CreateDate + '</span>' +
            '</h4>' + isCream + commContent +
            '<div class="info">' +
            '<p><span>' + item.Comment + '</span></p>' +
                '<span></span>' +
            '</div>' +
            buildCommentItemImageList(item.PhotoList.toString()) +
            (item.Response ? '<dl><dt>【同程客服】</dt><dd>' + item.Response + '</dd></dl>' : '') +
            '<p>' + (parseInt(item.PraiseCount) > 0 ? '<span>有用(' + item.PraiseCount + ')</span>' : '') + '</p>' +
        '</li>';
    }

    var imageCache = [];

    function buildCommentItemImageList(images) {
        if (!images) {
            return '';
        }
        imageCache.push(images);
        images = images.split(',');
        var len = images.length > 4 ? 3 : images.length,
            htmlStr = '';
        for (var i = 0; i < len; i++) {
            htmlStr += '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '_150x150_00') + '" /></li>';
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
        url = url.replace('http:','');
        var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
        var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
        if (reg.test(url) && regSize.test(size)) {
            return url.replace(reg, size);
        } else if (reg.test(url)) {
            return url;
        }
        if (!reg.test(url)) {
            return url.replace(/\.\w+$/,function($0){
                return size + $0;
            });
        }
    }

    function init() {
        $(".comment-header > li").delegate('p', "click", function (e) {
            var elem = $(e.liveFired);
            if (elem.hasClass("open")) {
                elem.removeClass("open");
            } else {
                $(".open", e.liveFired.parentNode).removeClass("up").removeClass("open");
                elem.addClass('up').addClass("open");
            }
        }).delegate('i', 'click', function (e) {
            $(e.liveFired).removeClass("open");
        }).delegate('li', 'click', function (e) {
            var elem = $(this);
            if (elem.hasClass('current')) {
                $(e.liveFired).removeClass("open");
                return;
            }
            $('.current', e.liveFired).removeClass('current');
            elem.addClass('current');
            $('span', e.liveFired).html(this.innerHTML);
            $(e.liveFired).removeClass("open");
            dataLoader.isLoaded = false;
            dataLoader.ajaxObj.data.page = 1;
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
            var index = this.parentNode.getAttribute('data-index'),
                images = imageCache[parseInt(index)].split(','),
                htmlStr = '',
                i = 2,
                len = images.length;
            for (; i < len; i += 3) {
                htmlStr += '<ul class="image-line clearfix" data-index="' + index + '">' +
                        '<li><img data-pos="' + (i - 2) + '" src="' + buildImageUrl(images[i - 2], '_150x150_00') + '"></li>' +
                        '<li><img data-pos="' + (i - 1) + '" src="' + buildImageUrl(images[i - 1], '_150x150_00') + '"></li>' +
                        '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '_150x150_00') + '"></li>' +
                    '</ul>';
            }
            i -= 2;
            if (i !== len) {
                htmlStr += '<ul class="image-line clearfix" data-index="' + index + '">';
                for (; i < len; i++) {
                    htmlStr += '<li><img data-pos="' + i + '" src="' + buildImageUrl(images[i], '_150x150_00') + '"></li>';
                }
                htmlStr += '</ul>';
            }
            if ($('#imageListPage').length === 0) {
                $('body').append('<div id="imageListPage" class="page J_List">' +
                    '<div class="content">' + htmlStr + '</div>' +
                    '</div>');
            } else {
                $('#imageListPage').removeClass("J_InnerList").addClass("J_List");
                $('#imageListPage .content').html(htmlStr);
            }
            dataLoader.stop();
        });
        var slider;
        $("body").delegate('.comment-list img, #imageListPage.J_List .content img', 'click', function () {
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),
                images = imageCache[parseInt(elem.attr('data-index'))].split(','),
                htmlStr = '<div id="imageView" class="slider"><ul>';
            for (var i = 0, len = images.length; i < len; i++) {
                htmlStr += '<li><div><img src="' + images[i].replace("http:","") + '"/></div></li>';
            }
            htmlStr +='</ul></div>' +
                '<div class="image-view-nav"><a href="javascript:;"></a><span>' + pos + '/' + images.length +'</span><a href="javascript:;"></a></div>';
            $("#imageViewPage").html(htmlStr);
            slider = $("#imageView").slider({
                autoScroll: false,
                loop: false,
                fn: function() {
                    $('.image-view-nav span').html((this.index + 1) + '/' + this.length);
                    if (this.index === 0) {
                        $('.image-view-nav a:first-child').addClass('disabled');
                        $('.image-view-nav a:last-child').addClass('disabled');
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
            //
        });
    }
    $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
        initComment();
    });

    function initComment() {
        var elems = $('.comment-item','#commentPage'),
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

    //page.init();
    //page.add("main", function () {

        //initComment();
    //});
    //var commentUrl,
    //    lineId = $("#lineId").val();
    //if ($("#commentUrl").length === 0) {
    //    commentUrl = document.getElementById('commentUrl').value;
    //    var commentUrlObj = $.parseUrl(commentUrl),
    //        commentRid,
    //        dataType = 'json';
    //    if (commentUrlObj.host !== location.host) {
    //        dataType = 'jsonp';
    //        commentRid = $.parseParam(commentUrlObj.search.substring(1), 'rid');
    //        if (commentRid === undefined) {
    //            commentUrl += '&rid=' + lineId;
    //        }
    //    }
    //} else {
    //    commentUrl = "http://tctj.ly.com/jrec/wlfrec?cid=111&projectId=4&rid=" + lineId;
    //}
    var dataLoader,isInit = false;

    function start(cfg){
        if(isInit){
            return;
        }
        isInit = true;
        var productType = $('#LineProperty').val(),
            windowUrl = window.location.href,
            projectTag="";
        //主题游线路
        if(windowUrl.indexOf("isTheme")>-1){
            projectTag = "zhutiyou";
        }else{
            projectTag = "chujing";
        }
        dataLoader = $("#commentPage .content").dataLoader({
            bottom: 5,
            ajaxObj: {
                //url: cfg.url,
                url: "/intervacation/api/Comment/GetCommentList?dpSite=3&projectTag=" + projectTag,
                //url : "/dujia/ajaxhelper/TourDetailComment?cid=142",
                data: {
                    productId: cfg.lineId,
                    productType: productType == "10" ? "13" : productType,
                    sortType: 0,
                    tagId: 1,
                    page: 1,
                    pageSize: 10
                },
                dataType: "json",
                success: function (data, loader) {
                    var commentData = data.Data.CommentList;
                    if ($("#commentPage .comment-header").length === 0) {
                        var elem = $(".top-wrapper"),
                            elemList = $("#commentPage .content"),
                            elemHeight = elemList.offset().top;
                        //alert(elemHeight);
                        elem.append(buildCommentHeader(commentData.Count[0]));
                        if ($("body").hasClass("is-qq-browser")) {
                            $("#commentPage .content").css({
                                'margin-top': (elem.height() + 46) + 'px'
                            });
                            $(window).on("touchmove scroll", function () {
                                var scrollElem = $(this);
                                if (scrollElem.scrollTop() < 46) {
                                    $(elem).css({
                                        'top': 46,
                                        'position': 'absolute'
                                    });
                                } else {
                                    $(elem).css({
                                        'top': 0,
                                        'position': 'fixed'
                                    });
                                }
                            });
                        } else if ($("body").hasClass("app-include")) {
                            //$(window).on("touchmove scroll", function () {
                            //    var scrollElem = $(this);
                            //    if (scrollElem.scrollTop() < elemHeight) {
                            //        $(elem).css({
                            //            'top': 46
                            //        });
                            //    } else {
                            $("#commentPage .content").css({
                                'margin-top': elem.height() + 'px'
                            });
                            $(elem).css({
                                'top': 0
                            });
                            //    }
                            //});
                        }
                        else {

                            $(window).on("touchmove scroll", function () {
                                var scrollElem = $(this);
                                if (scrollElem.scrollTop() < elemHeight) {
                                    $(elem).css({
                                        'top': 46
                                    });
                                } else {
                                    $(elem).css({
                                        'top': 0
                                    });
                                }
                            });
                        }
                        init();
                    }
                    if (commentData.List && commentData.List.length) {
                        $("body .comment-list").append(buildCommentList(commentData.List));
                        initComment();
                        if (commentData.List.length < 10) {
                            loader.isLoaded = true;
                            return;
                        }
                    } else {
                        loader.isLoaded = true;
                        return;
                    }
                    loader.ajaxObj.data.page++;
                },
                complete: function () {
                    document.getElementById('pageLoading').style.display = 'none';
                }
            }
        });
        dataLoader.start();
        document.getElementById('pageLoading').style.display = 'block';
        dataLoader.loadData();
    }
    module.exports.init = start;
})();
