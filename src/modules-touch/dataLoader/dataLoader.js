(function($) {
    /**
     * 数据加载器，支持滚动到底部自动加载和点击加载，选中的元素时数据加载器的父元素，滚动加载是针对window进行
     *
     * method  {string}  加载数据的方式，默认是"scroll"，滚动加载，滚动加载是针对window进行的，可以配置为"click"，表示单击加载
     * ajaxObj  {object}  ajax方法的配置对象，直接传递给ajax方法，success方法会进行包装，接受两个参数(data, loader)，第一个
     *                    是返回的数据，第二个数据加载器对象，success方法可以提供返回值，提供的返回值应该是html字符串，此时success仅仅对数据进
     *                    行了加工，不负责内容附加，如果success同时负责了内容附加，就不要提供返回值，
     *                    如果数据量是有限的，应该在数据全部加载完了，通知数据加载器，也就是设置执行这句代码：loader.isLoaded = true;
     *                    error方法也会进行包装，
     *
     *
     * initLoad  {boolean}  初始化的时候是否加载数据，默认不加载，如果第一屏的数据也是异步呈现，可以设置为true
     *
     * bottom  {number}  开始加载数据时，滚动到离底部的距离，默认是0，有页脚时或者页面底部有留白的情况下需要配置这个值
     *
     * loadingMsg  {string}  加载时的提示语，默认是"正在努力游入"
     * finishMsg  {string}  数据加载完后的提示信息，默认是"没有更多数据了"
     * errorMsg  {string}  数据加载出错的提示信息，默认是"出错了，请重试"
     * clickMsg  {string}  点击加载数据的提示信息，默认是"点击加载更多数据"
     *
     * contentElem  {selector}  承载内容的元素，如果不传递的话，为选中的元素，如果在ajax进行自定义附加内容，也可以不传递这个参数
     *
     * return  {DataLoader}
     *     loadData  {function}  加载数据方法，initLoad为false的情况下，可以在初始化完成之后，调用该方法来加载数据
     **/
    $.fn.dataLoader = function (options) {
        var dataLoaders = [];
        for (var i = 0, len = this.length; i < len; i++) {
            dataLoaders.push(new DataLoader(this[i], options));
        }
        if (dataLoaders.length === 1) {
            return dataLoaders[0];
        } else if (dataLoaders.length > 1) {
            return dataLoaders;
        }
    };

    function DataLoader(elem, options) {
        this.elem = $(elem);
        $.extend(this, {
            method: "scroll",
            bottom: 0,
            initMsg: "上拉加载更多数据",
            loadingMsg: "正在努力游入",
            finishMsg: "没有更多数据了",
            clickMsg: "点击加载更多数据",
            errorMsg: "出错了，请重试"
        }, options);
        if (this.initLoad) {
            this.loadData();
        }
        if (this.method === "scroll") {
            scrollLoad.call(this);
        } else if (this.method === "click") {
            clickLoad.call(this);
        }
    }

    function scrollLoad() {
        var that = this;
        $(window).on("scroll", function (e) {
            var scrollElem = $(this);
            if (!that.stopped && !that.isLoading && !that.isLoaded && scrollElem.scrollTop() + that.bottom >= $(document).height() - scrollElem.height()){
                showLoading.call(that);
                that.loadData();
            }
        });
    }

    function clickLoad() {
        this.elem.append('<div class="data-loader">' + this.clickMsg + '</div>');
        var that = this;
        $(".data-loader", that.elem).on("click", function () {
            if (!that.isLoading && !that.isLoaded) {
                showLoading.call(that);
                that.loadData();
            }
        });
    }

    function showLoading() {
        var loaderElem = $(".data-loader", this.elem),
            htmlStr = '<span>' + this.loadingMsg + '</span>';
        if (loaderElem.length) {
            loaderElem.html(htmlStr);
        } else {
            this.elem.append('<div class="data-loader">' + htmlStr + '</div>');
            loaderElem = $(".data-loader", this.elem);
        }
        $(window).scrollTop($(window).scrollTop() + loaderElem.height());
    }

    DataLoader.prototype.loadData = function(param) {
        this.isLoading = true;
        var ajaxObj = $.extend({}, this.ajaxObj),
            that = this;
        ajaxObj.success = function (data) { // 包装success方法
            that.isLoading = false;
            var loaderElem = $(".data-loader", that.elem),
                result;
            param && param.beforeLoad && param.beforeLoad();
            if (!that.ajaxObj.success || (result = that.ajaxObj.success(data, that))) {
                if (that.contentElem) {
                    $(that.contentElem, that.elem).append(result || data);
                } else if (loaderElem.length) {
                    loaderElem.before(result || data);
                } else {
                    that.elem.append(result || data);
                }
            }
            if (that.isLoaded) { // 加载完了显示
                if (loaderElem.length) {
                    loaderElem.html(that.finishMsg);
                } else {
                    // initLoad为true，且第一次就加载完了所有数据，会提示加载完的提示信息
                    // 手动第一次加载数据时，加载完了哇数据不会提示加载完的提示信息
                    if (that.initLoad) {
                        that.elem.append('<div class="data-loader">' + that.finishMsg + '</div>');
                    }
                }
            } else {
                if (!loaderElem.length) {
                    return;
                }
                if (that.method === "scroll") {
                    loaderElem.html(that.initMsg);
                } else if (that.method === "click") {
                    loaderElem.html(that.clickMsg);
                }
            }
        };
        ajaxObj.error = function (data) {
            that.isLoading = false;
            var loaderElem = $(".data-loader", that.elem);
            if (that.ajaxObj.error && that.ajaxObj.error(loaderElem) === false) {
                return;
            }
            if (loaderElem) {
                loaderElem.html(that.errorMsg);
            }
        };
        $.ajax(ajaxObj);
    };

    DataLoader.prototype.stop = function() {
        this.stopped = true;

    };

    DataLoader.prototype.start = function() {
        this.stopped = false;
    };
})( $ );
