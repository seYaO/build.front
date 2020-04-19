define("pager/0.2.2/index", [], function(require) {
    ! function($) {
        var DATAKEY = "pagination",
            CLS = "pagination";

        function Pagination(opts) {
            this.itemsCount = opts.itemsCount;
            this.pageSize = opts.pageSize;
            this.displayPage = opts.displayPage < 5 ? 5 : opts.displayPage;
            //itemsCount为0的时候应为1页
            this.pages = Math.ceil(opts.itemsCount / opts.pageSize) || 1;
            $.isNumeric(opts.pages) && (this.pages = opts.pages);
            this.currentPage = opts.currentPage;
            this.styleClass = opts.styleClass;
            this.onSelect = opts.onSelect;
            this.showCtrl = opts.showCtrl;
            this.remote = opts.remote;
            this.displayInfoType = ((opts.displayInfoType == 'itemsCount' && opts.itemsCount) ? 'itemsCount' : 'pages');
        }

        /* jshint ignore:start */
        Pagination.prototype = {
                //generate the outer wrapper with the config of custom style
                _draw: function() {
                    var self = this,
                        tpl = '<div class="' + CLS;
                    for (var i = 0; i < self.styleClass.length; i++) {
                        tpl += ' ' + self.styleClass[i];
                    }
                    tpl += '"></div>';
                    self.hookNode.html(tpl);
                    self._drawInner();
                },

                /**
                 * generate the true pagination
                 * 修改样式与 0.1.0靠齐
                 * by zxk @20160113
                 */
                _drawInner: function() {
                    var self = this,
                        displayPage = self.displayPage,
                        outer = self.hookNode.children('.' + CLS);
                    // 添加首页
                    var tpl = '<ul>' + '<li class="first-page' + (self.currentPage - 1 <= 0 ? ' disabled' : ' ') + '"><a href="#" data="1">首页</a></li>';
                    tpl += '<li class="prev' + (self.currentPage - 1 <= 0 ? ' disabled' : ' ') + '"><a href="#" data="' + (self.currentPage - 1) + '">上一页</a></li>';

                    if (self.pages <= displayPage || self.pages == displayPage + 1) {
                        for (var i = 1; i < self.pages + 1; i++) {
                            i == self.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                        }

                    } else {
                        if (self.currentPage < displayPage - 1) {
                            for (var i = 1; i < displayPage; i++) {
                                i == self.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                            }
                            tpl += '<li class="dotted"><span>...</span></li>';
                            tpl += '<li><a href="#" data="' + self.pages + '">' + self.pages + '</a></li>';
                        } else if (self.currentPage > self.pages - displayPage + 2 && self.currentPage <= self.pages) {
                            tpl += '<li><a href="#" data="1">1</a></li>';
                            tpl += '<li class="dotted"><span>...</span></li>';
                            for (var i = self.pages - displayPage + 2; i <= self.pages; i++) {
                                i == self.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                            }
                        } else {
                            tpl += '<li><a href="#" data="1">1</a></li>';
                            tpl += '<li class="dotted"><span>...</span></li>';
                            var frontPage,
                                backPage,
                                middle = (displayPage - 3) / 2;
                            if ((displayPage - 3) % 2 == 0) {
                                frontPage = backPage = middle;
                            } else {
                                frontPage = Math.floor(middle);
                                backPage = Math.ceil(middle);
                            }
                            for (var i = self.currentPage - frontPage; i <= self.currentPage + backPage; i++) {
                                i == self.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                            }
                            tpl += '<li class="dotted"><span>...</span></li>';
                            tpl += '<li><a href="#" data="' + self.pages + '">' + self.pages + '</a></li>';
                        }
                    }
                    tpl += '<li class="next' + (self.currentPage + 1 > self.pages ? ' disabled' : ' ') + '"><a href="#" data="' + (self.currentPage + 1) + '">下一页</a></li>';

                    // 添加末页
                    tpl += '<li class="last-page' + (self.currentPage + 1 > self.pages ? ' disabled' : ' ') + '"><a href="#" data="' + self.pages + '">末页</a></li>' + '</ul>';

                    self.showCtrl && (tpl += self._drawCtrl());
                    outer.html(tpl);
                },
                //值传递
                _drawCtrl: function() {
                    var tpl = '<div>&nbsp;' + (this.displayInfoType == 'itemsCount' ? '<span>共' + this.itemsCount + '条</span>&nbsp;' : '<span>共' + this.pages + '页</span>&nbsp;') +
                        '<span>' + '&nbsp;到&nbsp;' + '<input type="text" class="page-num"/><button class="page-confirm">确定</button>' + '&nbsp;页' + '</span>' + '</div>';
                    return tpl;
                },

                _ctrl: function() {
                    var self = this,
                        pag = self.hookNode.children('.' + CLS);

                    function doPagination() {
                        var tmpNum = parseInt(pag.find('.page-num').val());
                        if ($.isNumeric(tmpNum) && tmpNum <= self.pages && tmpNum > 0) {
                            if (!self.remote) {
                                self.currentPage = tmpNum;
                                self._drawInner();
                            }
                            if ($.isFunction(self.onSelect)) {
                                self.onSelect.call($(this), tmpNum);
                            }
                        }
                    }
                    pag.on('click', '.page-confirm', function(e) {
                        doPagination.call(this)
                    })
                    pag.on('keypress', '.page-num', function(e) {
                        e.which == 13 && doPagination.call(this)
                    })
                },

                _select: function() {
                    var self = this;
                    self.hookNode.children('.' + CLS).on('click', 'a', function(e) {
                        e.preventDefault();
                        var tmpNum = parseInt($(this).attr('data'));
                        if (!$(this).parent().hasClass('disabled') && !$(this).parent().hasClass('active')) {
                            if (!self.remote) {
                                self.currentPage = tmpNum;
                                self._drawInner();
                            }
                            if ($.isFunction(self.onSelect)) {
                                self.onSelect.call($(this), tmpNum);
                            }
                        }
                    })
                },

                init: function(opts, hookNode) {
                    this.hookNode = hookNode;
                    this._draw();
                    this._select();
                    this.showCtrl && this._ctrl();
                    return this;
                },

                updateItemsCount: function(itemsCount, pageToGo) {
                    $.isNumeric(itemsCount) && (this.pages = Math.ceil(itemsCount / this.pageSize));
                    //如果最后一页没有数据了，返回到剩余最大页数
                    this.currentPage = this.currentPage > this.pages ? this.pages : this.currentPage;
                    $.isNumeric(pageToGo) && (this.currentPage = pageToGo);
                    this._drawInner();
                },

                updatePages: function(pages, pageToGo) {
                    $.isNumeric(pages) && (this.pages = pages);
                    this.currentPage = this.currentPage > this.pages ? this.pages : this.currentPage;
                    $.isNumeric(pageToGo) && (this.currentPage = pageToGo);
                    this._drawInner();
                },

                goToPage: function(page) {
                    if ($.isNumeric(page) && page <= this.pages && page > 0) {
                        this.currentPage = page;
                        this._drawInner()
                    }
                }
            }
            /* jshint ignore:end */

        var old = $.fn.pagination;

        $.fn.pagination = function(options) {
            var opts = $.extend({}, $.fn.pagination.defaults, typeof options == 'object' && options),
                args;
            if (typeof options == 'string') {
                args = $.makeArray(arguments);
                args.shift();
            }
            var $this = $(this),
                pag = $this.data(DATAKEY);
            if (!pag) $this.data(DATAKEY, (pag = new Pagination(opts).init(opts, $(this))))
            else if (typeof options == 'string') {
                pag[options].apply(pag, args)
            }
            return pag;
        };

        $.fn.pagination.Constructor = Pagination;

        $.fn.pagination.noConflict = function() {
            $.fn.pagination = old;
            return this
        };

        $.fn.pagination.defaults = {
            pageSize: 10,
            displayPage: 5,
            currentPage: 1,
            itemsCount: 0,
            styleClass: [],
            pages: null,
            showCtrl: false,
            onSelect: null,
            remote: false
        }

    }(window.jQuery);
})
