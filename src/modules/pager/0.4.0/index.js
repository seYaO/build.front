define("pager/0.4.0/index",["pager/0.4.0/index.css"],function(){
    function parseParam(str, name) {
        var parts = str.split("&"),
            part,
            key,
            result = name ? undefined : {};
        for (var i = 0, len = parts.length; i < len; i++) {
            part = parts[i];
            if (!part) {
                continue;
            }
            part = part.split("=");
            key = part.shift();
            if (name) {
                if (name === key) {
                    return part.join("=");
                }
            } else {
                result[key] = part.join("=");
            }
        }
        return result;
    }
    $.fn.page = function (param) {
        var pages = [];
        this.each(function (i, elem) {
            pages.push(new Page(elem, param));
        });
        switch (pages.length) {
            case 0:
                return;
                break;
            case 1:
                return pages[0];
                break;
                break;
            default:
                return pages;
        }
    }
    /**
     * 分页组件，@TODO 皮肤没有加，buildUrl后面的参数没有测试
     *
     * 依赖helper.js，使用了helper.js的$.parseParam方法
     *
     * current {number|string}  (必传)当前页面
     * total  {number}  (必传)总页面数
     * needFirstAndLast  {boolean}  是否显示首页和末页
     * needJump  {boolean}  是否需要跳转部分
     * pageNoParam  {string}  请求参数的名字，默认是"pageNo"
     * buildUrl(url)  {function}  构建url的方法，接受参数url，当是同步情况url为location.href，如果是异步模式，
     *                            url是异步的url，可以通过this访问一下属性，例如current，total，pageNoParam等，
     *                            返回构建后的url，默认是current替换pageNoParam指定的请求参数值
     * ajaxObj  {object}  同jQuery的ajax方法的参数，每次请求之前都会调用buildAjaxObj方法
     * buildAjaxObj  {function}  每次请求前修改ajaxObj的方法，默认是GET请求调用buildUrl修改url，POST请求修改ajaxObj.data的pageNoParam指定属性值为current
     * initLoad  {boolean}  是否一开始加载，默认为true，异步模式下有效
     *
     * return {Page}  提供的方法都可以访问this
     *   turn(num)  {function}  跳到指定页
     *   prev()  {function}  向前翻一页
     *   next()  {function}  向后翻一页
     **/
    var defaultConfig = {
        pageNoParam: "pageNo",
        initLoad: true
    };
    function Page(elem, param) {
        this.elem = $(elem);
        $.extend(this, defaultConfig, param);
        if (typeof this.current === 'undefined') {
            this.current = parseParam(location.search.substring(1), this.pageNoParam);
        }
        if (typeof this.current === 'string') {
            this.current = parseInt(this.current);
        }
        if (typeof this.current === 'undefined' || isNaN(this.current) || this.current < 1) {
            this.current = 1;
        } else if (this.current > this.total) {
            this.current = this.total;
        }
        if (this.ajaxObj && this.initLoad) {
            this.turn(this.current);
        } else {
            build.call(this);
        }
    }

    Page.prototype.buildUrl = function (url) {
        return url.replace( new RegExp("([?&]" + this.pageNoParam + "=)\\d+"), "$1" + this.current);
    }

    Page.prototype.buildAjaxObj = function () {
        if (this.ajaxObj.data) {
            this.ajaxObj.data[this.pageNoParam] = this.current;
        } else {
            this.ajaxObj.url = this.buildUrl(this.ajaxObj.url);
        }
    }

    Page.prototype.turn = function (num) {
        if (num < 1 || num > this.total) {
            return;
        }
        this.current = num;
        $('.jump-wrapper input', this.elem).val(this.current);
        if (this.ajaxObj) {
            $("li:first-child", this.elem).html(buildPage.call(this));
            this.buildAjaxObj();
            $.ajax(this.ajaxObj);
        } else {
            location.href = this.buildUrl(location.href);
        }
    };

    Page.prototype.prev = function () {
        this.turn(this.current - 1);
    };

    Page.prototype.next = function () {
        this.turn(this.current + 1);
    }

    function build () {
        var total = this.total;
        if (total === 1) {
            this.elem.html("");
            return;
        }
        var htmlStr ='<ul class="water-page"><li>' + buildPage.call(this) + '</li>';
        if (this.needJump) {
            htmlStr += buildJump.call(this) + '</ul>'
            this.elem.html(htmlStr);
            initJump.call(this);

        } else {
            htmlStr += '</ul>';
            this.elem.html(htmlStr);
        }
        init.call(this);
    }

    function init() {
        var that = this;
        $("li:first-child", this.elem).delegate("a", "click", function () {
            var elem = $(this);
            if (elem.hasClass("current") || elem.hasClass("disabled")) {
                return;
            } else if (elem.hasClass("turn-prev")) {
                that.prev();
            } else if (elem.hasClass("turn-next")) {
                that.next();
            } else {
                that.turn(parseInt(elem.attr("data-num")));
            }
        });
    }

    function buildPage() {
        var total = this.total,
            current = this.current,
            i = 1,
            end = total,
            htmlStr = '',
            htmlStrEnd = '';
        if (total > 7) {
            if (current <= 4) {
                end = 6;
                htmlStrEnd = '<span class="ellipsis">...</span>' +
                '<a href="javascript:;" data-num="' + total + '">' + total + '</a>'
            } else if (end - current < 4) {
                i = end - 5;
                htmlStr = '<a href="javascript:;" data-num="1">1</a>' +
                '<span class="ellipsis">...</span>';
            } else {
                htmlStr = '<a href="javascript:;" data-num="1">1</a>' +
                '<span class="ellipsis">...</span>';
                i = current - 2;
                end = current + 2;
                htmlStrEnd = '<span class="ellipsis">...</span>' +
                '<a href="javascript:;" data-num="' + total + '">' + total + '</a>'
            }
        }
        for (; i <= end; i++) {
            htmlStr += '<a ' + (i === current ? 'class="current" ' : '') + 'href="javascript:;" data-num="' + i + '">' + i + '</a>'
        }
        htmlStr += htmlStrEnd;
        htmlStr = '<a class="turn-prev' + (current === 1 ? ' disabled' : '') + '" href="javascript:;"></a>' + htmlStr;
        htmlStr += '<a class="turn-next' + (current === total ? ' disabled' : '') + '" href="javascript:;"></a>';
        if (this.needFirstAndLast) {
            htmlStr = '<a class="first-page' + (current === 1 ? ' disabled' : '') + '" href="javascript:;" data-num="1">首页</a>' +
            htmlStr +
            '<a class="last-page' + (current === total ? ' disabled' : '') + '" href="javascript:;" data-num="' + total + '">末页</a>';
        }
        return htmlStr;
    }

    function buildJump() {
        return '<li class="jump-wrapper">跳转到<input value="' + this.current + '" /><button type="button">GO</button></li>';
    }

    function initJump() {
        var that = this;
        $('.jump-wrapper input', this.elem).on("keyup", function () {
            if (this.value === '-') {
                return;
            }
            var num = parseInt(this.value);
            if (num < 1) {
                this.value = 1;
            } else if (this.value > that.total) {
                this.value = that.total;
            } else if (isNaN(num)) {
                this.value = '';
            } else {
                this.value = num;
            }
        });
        $('.jump-wrapper button', this.elem).on("click", function () {
            var num = parseInt($('.jump-wrapper input', this.elem).val());
            if (num === that.current) {
                return;
            }
            that.turn(num);
        });
    }
    return Page;
});
