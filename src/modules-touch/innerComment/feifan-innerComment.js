(function() {
    function buildCommentHead(item){
    return '<div class="view-all-comment" id="J_view_all_comment"><i></i>线路点评' + '<span class="all">' + item[0].all +'条点评&nbsp;&nbsp;' + item[0].satisfaction*100 + '%满意</span></div>';
    }

    function buildInnerCommentList(list) {
        var htmlStr = '<ul class="inner-comment-list">';
        for (var i = 0, len = list.length; i < len; i++) {
            htmlStr += '<li>' + buildCommentItem(list[i], 'div') + '</li>';
        }
        return htmlStr + '</ul>';
    }

    function buildCommentItem(item, tagName) {
        tagName = tagName || 'li';
        return '<' + tagName + ' class="comment-item">' +
            '<h4>' +
            '<span class="nickname">' + item.creator + '<i class="level' + item.level + '"></i></span>' +
            '<span class="time">' + item.createDate.split(" ")[0] + '</span>' +
            '</h4>' +
            '<div class="info">' +
            '<p><span>' + item.comment + '</span></p>' +
            '<span></span>' +
            '</div>' +
            buildCommentItemImageList(item.photo) +
            (item.response ? '<dl><dt>【同程客服】</dt><dd>' + item.response + '</dd></dl>' : '') +
            '<p>' + (parseInt(item.praiseCount) > 0 ? '<span>有用(' + item.praiseCount + ')</span>' : '') + '</p>' +
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
            htmlStr += '<li><div><img data-pos="' + i + '" data-img="' + buildImageUrl(images[i], '150x150') + '"></div></li>';
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
        url = url.split('.');
        var suffix = url.pop();
        return url.join('.') + '_' + size + '_00.' + suffix;
    }

    function init() {
        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
            initComment();
        });

        $(".inner-comment-list").delegate('.expanded>span', 'click', function () {
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
            if ($('#imageListPage').length === 0) {
                $('body').append('<div id="imageListPage" class="page">' +
                        //'<header class="page-header">' +
                        //'<a href="javascript:void(0);" class="page-back touchable"></a>' +
                        //'<h2>图片(' + $('p span', this).html() + ')</h2>' +
                        //'</header>' +
                    '<div class="content">' + htmlStr + '</div>' +
                    '</div>');
            } else {
                //$('#imageListPage .page-header h2').html('图片(' + $('p span', this).html() + ')');
                $('#imageListPage .content').html(htmlStr);
            }
            //page.open('imageList');
        });
        $("body").delegate('.inner-comment-list img, #imageListPage img', 'click', function () {
            var elem = $(this).parents('.image-line'),
                pos = parseInt(this.getAttribute('data-pos')),
                images = imageCache[parseInt(elem.attr('data-index'))].split(','),
                htmlStr = '<div id="imageView" class="slider"><ul>';
            for (var i = 0, len = images.length; i < len; i++) {
                htmlStr += '<li><div><img src="' + images[i] + '"/></div></li>';
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
                        height: parseInt(innerElem.height()) + 'px'
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
    var defConfig = {
        url: '/dujia/ajaxhelper/TourDetailComment?cid=142',
        showNum: 5
    };

    function innerComment(elem, param) {
        var config = {};
        $.extend(config, defConfig, param);
        $.ajax({
            url: config.url,
            data: {
                projectId: config.projectId,
                rid: config.rid,
                userId: getMemberId(),
                type: 0,
                flag: 1,
                page: 1,
                pageSize: config.showNum
            },
            dataType: 'jsonp',
            beforeSend: function () {
                $(elem).html('<div class="comment-loading loading-img"></div>');
            },
            success: function (data) {
                if (data.list.length === 0) {
                    $(elem).html(buildNoData());
                    return;
                }
                var head = buildCommentHead(data.count);
                $(elem).html((data.list.length === 5 ? head : '') + buildInnerCommentList(data.list));
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
