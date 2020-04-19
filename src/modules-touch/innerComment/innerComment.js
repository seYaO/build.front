(function() {
    function buildInnerCommentList(list) {
        var htmlStr = '<ul class="inner-comment-list">';
        for (var i = 0, len = list.length; i < len; i++) {
            htmlStr += '<li>' + buildCommentItem(list[i], 'div') + '</li>';
        }
        return htmlStr + '</ul>';
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

    function buildCommentItem(item, tagName) {
        tagName = tagName || 'li';
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
                    '<div class="com-title">' + commentInfo[i].CLDTCommentTypeName + '<span class="star-num">' + starLevel(5,commentInfo[i].CLDTCommentScore) + '</span></div>' +
                    '<div class="com-desc">' + commentInfo[i].CLDTCommentContent + '</div>' +
                    '</li>';
            }
        }
        if (commContent) {
            commContent = '<ul class="com-ul">' + commContent + '</ul>';
        }
        return '<' + tagName + ' class="comment-item">' +
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
            '<p class="useful-comment">' + (parseInt(item.PraiseCount) > 0 ? '<i></i><span>' + item.PraiseCount + '</span>' : '') + '</p>' +
        '</' + tagName + '>';
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
            htmlStr += '<li><div><img data-pos="' + i + '" data-img="' + buildImageUrl(images[i], '_150x150_00') + '"></div></li>';
        }
        if (images.length > 4) {
            htmlStr += '<li class="image-amount"><div><p><span>共' + images.length + '张</span></p></div></li>';
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
        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
            initComment();
        });

        $(".inner-comment-list").delegate('.expanded span', 'click', function () {
            var elem = $(this.parentNode);
            if (elem.hasClass('open')) {
                elem.removeClass('open');
                $('p', elem).css({
                    height: parseInt($('p span', elem).css('line-height')) * 5 + 'px'
                });
            } else {
                elem.addClass('open');
                $('p', elem).css({
                    height: $('p span', elem).height() + 'px'
                });
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
                $('body').append('<div id="imageListPage" class="page J_InnerList">' +
                    //'<header class="page-header">' +
                    //'<a href="javascript:void(0);" class="page-back touchable"></a>' +
                    //'<h2>图片(' + $('p span', this).html() + ')</h2>' +
                    //'</header>' +
                    '<div class="content">' + htmlStr + '</div>' +
                '</div>');
            } else {
                $('#imageListPage').removeClass("J_List").addClass("J_InnerList");
                //$('#imageListPage .page-header h2').html('图片(' + $('p span', this).html() + ')');
                $('#imageListPage .content').html(htmlStr);
            }
            //page.open('imageList');
        });
        $("body").delegate('.inner-comment-list img, #imageListPage.J_InnerList img', 'click', function () {
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),
                images = imageCache[parseInt(elem.attr('data-index'))].split(','),
                htmlStr = '<div id="imageView" class="slider"><ul>';
            for (var i = 0, len = images.length; i < len; i++) {
                htmlStr += '<li><div><img src="' + images[i].replace("http:","") + '"/></div></li>';
            }
            htmlStr +='</ul></div>' +
                '<div class="image-view-nav"><a href="javascript:;"></a><span>' + pos + '/' + images.length +'</span><a href="javascript:;"></a></div>';
            if ($('#imageViewPage').length === 0) {
                $('body').append('<div id="imageViewPage" class="page">' + htmlStr + '</div>');
            } else {
                $("#imageViewPage").html(htmlStr);
            }
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
            /* 可以优化，不需要每次都创建对象 */
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
            //page.open('imageView');
        });
    }

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

    function buildNoData() {
        return '<div class="no-data">' +
            '<i></i>' +
            '<p>新品上线暂无点评，不妨去体验一下</p>' +
        '</div>';
    }

    /**
     * projectId  {number}  (必传)项目id
     * rid  {number}  (必传)资源id
     * commentAddress  {string}  (必传)点评页面的url地址
     * url  {string}  获取点评的url，默认是：http://tctj.ly.com/jrec/wlfrec?cid=105
     * showNum  {number}  显示的点评条数，默认是5条
    **/
    //var defConfig = {
    //    url: '/dujia/ajaxhelper/TourDetailComment?cid=142',
    //    showNum: 1
    //};

    function innerComment(elem, param) {
        var config = {};
        var productType = $('#LineProperty').val();
        $.extend(config, param);
        $.ajax({
            url: config.url,
            data: {
                //projectId: config.projectId,
                productId: config.productId,
                productType: productType == "10" ? "13" : productType,
                userId: getMemberId(),
                sortType: 0,
                tagId: 1,
                page: 1,
                pageSize: 1
            },
            dataType: 'json',
            beforeSend: function () {
                $(elem).html('<div class="comment-loading loading-img"></div>');
            },
            success: function (data) {
                var commentData = data.Data.CommentList;
                if (!(commentData.List && commentData.List.length)) {
                    $(elem).html(buildNoData());
                    return;
                }
                $(elem).html(buildInnerCommentList(commentData.List));
                initComment();
                init();
                config.callback && config.callback();
            },
            complete: function () {
                $('.comment-loading', elem).remove();
            }
        });
    }

    $.fn.innerComment = function (param) {
        this.each(function(i, elem) {
            innerComment(elem, param);
        });
    };
})();
