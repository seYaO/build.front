
    var Login = require("login/0.1.0/index"),
        Dialog = require("dialog/0.1.0/index"),
        Carousel = require("jCarousel/0.2.0/index"),
        Page = require("pager/0.3.0/index");

    var MainBodyTmpl = require("./visaCommentBody.dot"),
        MainLiTmpl = require("./visaCommentLi.dot");
    
    /**
     * @desc Comment 类
     * @param cfg 参数
     */
    var Comments = function (cfg) {
        var self = this;
        if (cfg) {
            $.extend(true, self, cfg);
        }
        self.dataUrl += "&projectTag=qianzheng";
        //初始头部评论和底部评论配置
        $.extend(true, self.mainParam, self.param);
        $.extend(true, self.topParam, self.param);
    };
    /**
     * @desc 评论配置
     */
    var FN = Comments.prototype = {
        host: window.host || "",
        dataUrl: "/intervacation/api/Comment/GetCommentList?dpSite=2&reqFrom=1",
        usefulUrl: "/intervacation/api/Comment/CommentLike",
        param: {
            pageSize: 5,
            page: 1,
        },
        extraParam: {
            sortType: 4,
            tagId: 1
        },
        mainParam: {},
        topParam: {},
        mainTitle: "",
        isTheme: false
    };
    /**
     * @desc 头部数据rander
     * @param data
     */
    FN.rateData = function(data) {
        var count = [],
            list = [],
            _param;
        if (!data.Count && !data.List) {
            _param = {
                count: count,
                list: list
            };
            return _param;
        }
        var rate = function(d) {
            var ret = null;
            if (d > -1) {
                ret = (d * 100).toFixed(1);
            }
            return ret;
        };
        var phone = function(ele) {
            var chars = "abcdefghijklmnopqrstuvwxyz";
            var index = Math.floor((Math.random() * chars.length));
            var letter = chars[index] ? chars[index] : chars[0];
            var word = ele.substr(ele.length - 5, 2);
            var mobile = ele.replace(word, "*" + letter);
            return mobile;
        };
        var head = data.Count[0];
        if (data.Count.length > 0) {
            count = [{
                Satisfaction: head.Satisfaction,
                ServiceScoreAvgList: head.ServiceScoreAvgList,
                CompositeScore: head.CompositeScore,
                AllCount: head.All,
                GoodCount: head.Good,
                GoodRate: rate(head.Good / head.All),
                ModerateCount: head.Moderate,
                ModeRate: rate(head.Moderate / head.All),
                NegativeCount: head.Negative,
                NegRate: rate(head.Negative / head.All),
                PhotoCount: head.Photo
            }];
        }
        if (data.List) {
            $.each(data.List, function (i) {
                var photo = [],
                    obj = data.List[i];
                var createDate = obj.CreateDate;
                var creator = phone(obj.Creator);
                var commentSource = ['同程旅游APP', 'PC', 'Touch'][obj.CommentSource - 1];
                commentSource = commentSource !== undefined ? commentSource : '';
                if (obj.PhotoList && obj.PhotoList.length) {
                    $.each(obj.PhotoList, function (j) {
                        photo.push(obj.PhotoList[j]);
                    });
                }
                list.push({
                    createDate: createDate,
                    commentSource: commentSource,
                    photo: photo,
                    creator: creator
                });
            });
        }
        _param = $.extend(true, {}, data, {
            Count: count,
            List: list
        });
        return _param;
    },
    /**
     * @desc 检查是否登录,并执行登录后回调
     * @param callback 登录后的操作逻辑
     */
    FN.checkLogin = function (callback) {
        var self = this;
        var login = new Login({
            loginSuccess: function () {
                callback.call(self);
            },
            unReload: true
        });
    };
    /**
     * @desc 序列化
     * @param callback 登录后的操作逻辑
     */
    FN.getQueryString = function (str) {
        var result = str.match((new RegExp("(?:^|[?&])([^?&]+=[^?&]+)", "g"))),
            retData = {};
        if (result == null) {
            return "";
        }
        for (var i = 0; i < result.length; i++) {
            if (/^[?&]/i.test(result[i])){
                result[i] = result[i].substring(1);
            }
            var arr = result[i].split("=");
            retData[arr[0]] = arr[1];
        }
        
        return retData;
    }
    /**  ***************************  **/
    /**
     * @desc 主体初始化
     * @param cfg 参数
     */
    FN.initMain = function (cfg) {
        var self = this;
        if(cfg){
            self = $.extend(true, self, cfg);
        }
        //
        self.getData( self.extraParam, function (data) {
            self.mainRender(data);
        });
        //
        self.mainEvents();
    };
    /**
     * @desc 获取数据
     * @param cfg 参数
     */
    FN.getData = function (param, callback) {
        var self = this;
        var _param = $.extend({}, self.mainParam, param);
        $.ajax({
            url: self.dataUrl,
            data: _param,
            dataType: "json",
            success: function (data) {
                if (data && data.Data && data.Data.CommentList) {
                    var renderData = FN.rateData(data.Data.CommentList);
                    callback && callback.call(self,renderData);
                }
            },
            error: function () {
            }
        });
    };
    /**
     * @desc 评论主体渲染
     * @param data {data}
     */
    FN.mainRender = function (data) {
        var self = this;
        if (!data || !(data.List && data.List.length)) {
            $(this.el).append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
            $(".data-loading").remove();
            $(this.el).parent().removeClass("data-outer-loading");
            return;
        }
        
        //
        var headData = data.Count[0];
        headData.hasWide = 1;
        //render header数据将自定义tag和排序tag的数据分开
        headData.TabTagList = [];
        headData.CustTagList = [];
        if (headData.TagList) {
            $.each(headData.TagList, function (index, value) {
                //
                value.TagName = value.TagName.split('(')[0];
                if (headData.TagList[index].TagId < 6) {
                    headData.TabTagList.push(value);
                } else {
                    if(headData.CustTagList.length<=10){
                        headData.CustTagList.push(value);
                    }
                }
            });
        };
        //
        $(self.el).append(MainBodyTmpl(headData));
        //
        self.mainBind();
        self.render(data, "", true);
        self.renderPager($.extend({total: headData.All},{param:self.extraParam}));
    };
    /**
     * @desc 评论主体事件绑定
     */
    FN.mainBind = function () {
        var self = this;
        //绑定头部的相关组件
        $("#J_CometTab").on("click", 'span', function (e) {
            var Jslef = $(this),
                count = Jslef.data('tagnum') || 0;
            //
            Jslef.find("input").prop("checked", true);
            $("#J_custtag").find("a").removeClass('active');
            //
            var paramStr = Jslef.attr("data-param"),
                extraParam = $.extend({} ,self.extraParam, FN.getQueryString(paramStr));
            param = $.extend({}, self.mainParam, extraParam);
            //
            self.getData(param ,function(data){
                self.render(data, "", true);
                self.renderPager({
                    total: count || 0,
                    param: extraParam
                });
            });
        });
        //新添加自定义tag 与上面tag相同
        $("#J_custtag").on("click",'a', function (e) {
            var Jslef = $(this),
                count = Jslef.data('tagnum') || 0;
            //
            $("#J_CometTab").find("input").prop("checked", false);
            Jslef.siblings().removeClass('active');
            Jslef.addClass('active');
            //
            var paramStr = Jslef.attr("data-param"),
                extraParam = $.extend({} ,self.extraParam, FN.getQueryString(paramStr));
            param = $.extend({}, self.mainParam, extraParam);
            //
            self.getData(param ,function(data){
                self.render(data, "", true);
                self.renderPager({
                    total: count || 0,
                    param: extraParam
                });
            });
            e.preventDefault();
        });
        //排序
        $("#filter-sort").on("click", 'a',function () {
            var Jslef = $(this)
            var paramStr = Jslef.attr("data-param"),
                extraParam = $.extend({} ,self.extraParam, FN.getQueryString(paramStr));
            param = $.extend({}, self.mainParam, extraParam);
            
            $("#radio1").prop("checked", true);
            $("#J_custtag").find("a").removeClass('active');
            //
            var count = $("#radio1").parent('span').data('tagnum') || 0;
            //
            self.getData(param ,function(data){
                self.render(data, "", true);
                self.renderPager({
                    total: count || 0,
                    param: extraParam
                });
            });
            //
            $("[name='commfil']").prop("checked", false);
            $("#radio1").prop("checked", true);
        });
        //点赞
        $(document).on("click", ".commli .comet_useful", function () {
            var el = $(this);
            var cnUser = $.cookie("us");
            var re = /\buserid=(\d+)\b/;
            if (!(/userid=\d+/.exec(cnUser))) {
                self.checkLogin(function () {
                    return;
                });
            } else {
                var memberId = re.exec(cnUser)[1];
                if (el.hasClass("disables")) {
                    return;
                }
                var commentId = el.attr("data-cometid"),
                    dpId = el.attr("data-resId") || "0",
                    url = self.usefulUrl + "?projectTag=qianzheng&ifGood=1&MemberId=" + memberId + "&wmGuid=" + commentId + "&dpId=" + dpId,
                    bEl = el.find("b"),
                    bText = bEl.text() - 0;
                $.ajax({
                    url: url,
                    dataType: "json",
                    success: function (data) {
                        var praiseData = data.Data.CommentLike;
                        if (praiseData.RspCode === "0000") {
                            bEl.text(bText + 1);
                            bEl.parent().addClass("disables");
                        } else if (praiseData.RspCode === '5410') {
                            //alert("一个用户只能评价一次!");
                            bEl.parent().addClass("disables");
                        } else {
                            alert("点赞失败!");
                        }
                    }
                });
            }
        });
    };
    /**
     * @desc 评论翻页控件
     */
    FN.renderPager =  function (cfg) {
        var self = this,
            total = cfg.total,
            url =  self.dataUrl,
            param = $.extend({}, self.mainParam ,cfg.param),
            totalPage = Math.ceil(total / (param.pageSize || 5));
        if (totalPage > 1) {
            delete(param.page);
            $('#J_CometPager').page({
                current: 1,
                total: totalPage,
                needFirstAndLast: false,
                pageNoParam: "page",
                needJump: true,
                ajaxObj: {
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        self.render(data.Data.CommentList);
                    }
                },
                initLoad: false
            });
        } else {
            $("#J_CometPager").empty();
        }
    };
    /**
     * @desc 评论项渲染
     * @param data {data}
     */
    FN.render = function (data, noScrollTop, isClick) {
        var self = this;
        if (!data || !(data.List && data.List.length)) {
            if (isClick) {
                $(this.el).find('.comm-content ul').empty().html('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
            } else {
                $(this.el).append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
            }
            $(".data-loading").remove();
            return;
        }
        if (data.Count[0] && data.Count[0].Satisfaction && data.Count[0].Satisfaction !== "0") {
            $(".J_ManYiDu").text(data.Count[0].Satisfaction + '%');
        }
        
        data.List.hasWide = 1;
        data.List.mainTitle = self.mainTitle;
        
        $(".comm-content ul").empty().append(MainLiTmpl(data.List));
        
        //如果是分页触发,则没有head的数据,则使用滚动定位
        if (!data.Count[0] && !noScrollTop) {
            if (this && this.parent) {
                var elTop = $(this.parent).offset().top;
                window.scrollTo(0, elTop);
            }
        }
        if (this.callback) {
            this.callback.call(this);
        }
    };
   
    /**
     * @desc 事件绑定
     * @param cfg 参数
     */
    FN.mainEvents = function () {
        var self = this;
        //显示大图
        $("#J_SubCommentContent").on("click", ".comm-img img,.comm-img span", function () {
            var content = $(this).parents(".comm-con").children(".mslide-panel").clone(true);
            if (content.length) {
                self.dialog = Dialog({
                    content: content,
                    tip: true,
                    width: 980,
                    height: 660,
                    padding: 0,
                    className: "comment",
                    zIndex: 10000,
                    onshow: function () {
                        var mslide = content.find(".photo-mslide");
                        var pic = content.find(".photo img");
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
                        car.on("prevClick", function () {
                            carIndex--;
                            carIndex < 0 && (carIndex = 0);
                            car.li.eq(carIndex).click();
                        });
                        car.on("nextClick", function () {
                            carIndex++;
                            carIndex > calLiLen - 1 && (carIndex = calLiLen - 1);
                            car.li.eq(carIndex).click();
                        });
                        car.on("itemClick", function (index, node, all) {
                            $(all).removeClass("active");
                            $(node).addClass("active");
                            carIndex = index;
                            var src = $(node).find("img").attr("src");
                            pic.attr("src", src);
                            content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                        });
                        content.find(".mslide-num").html((carIndex + 1) + "/" + calLiLen);
                        //content.find(".photo-mslide
                        // li").siblings().removeClass("active").eq(0).addClass("active"); }); if (!self.isInitCar)
                        // { self.carousel(content); self.isInitCar = true; }
                    },
                    onclose: function () {
                    }
                });
            }
            self.dialog.showModal();
        });
        $(document).on("click", ".J_close", function () {
            self.dialog.remove().close();
        });
        //收起和展开
        $("#J_SubCommentContent").on("click", ".J_tan", function () {
            var _self = $(this),
                _parent = _self.parent();
            if (_self.hasClass("shou")) {
                var allContent = _parent.attr("data-shou");
                _self.removeClass("shou").addClass("zhan");
                _self.html("展开全部<i></i>");
                _parent.css("padding-bottom", "0");
                _parent.find("span").html(allContent);
            } else {
                var subContent = _parent.attr("data-zhan");
                _self.removeClass("zhan").addClass("shou");
                _self.html("收起<i></i>");
                _parent.css("padding-bottom", "20px");
                _parent.find("span").html(subContent);
            }
        });
    };
    
    return Comments;

