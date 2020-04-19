define("comment/0.3.0/index", [
    "common/0.1.0/index",
    "login/0.1.0/index",
    "./commetLi.dot",
    "./commetBody.dot",
    "dialog/0.1.0/index",
    "pager/0.3.0/index",
    "jCarousel/0.2.0/index"
], function (require) {
    var Common = require("common/0.1.0/index"),
        Login = require("login/0.1.0/index"),
        Dialog = require("dialog/0.1.0/index"),
        Carousel = require("jCarousel/0.2.0/index"),
        Page = require("pager/0.3.0/index");
    
    require("lazyload/0.1.0/index");
    //附加公共统计方法
    window.__ComLog = {
        log : function(type,code){
            if (_tcTraObj) {
                _tcTraObj._tcTrackEvent(306, 6, type||'',code||'');
            }
        },
        warp: function(callback){
            var self = this;
            try {
                callback && callback.call(self);
            }catch (e){
                //
            }
        }
    };
    
    var TopTmpl = function (data) {
            var retStr = '<p>来自'+ data.total +'条用户点评  <span>'+ data.Satisfaction +'%</span>满意度</p>'+
                '<p class="top-comment" title="'+data.oldFeedBack+'">' + data.feedBack + '</p>' +
                '<div class="paging">'+
                '<span class="J-prev ' + data.prevCls + '" trackspot="上一条">上一条</span>' +
                '<span class="J-next ' + data.nextCls + '" trackspot="下一条">下一条</span>' +
                '<a href="#CommentContent" class="J_BtnComment" trackspot="查看所有点评">查看所有点评</a>' +
                '</div>'
            return retStr;
        },
        MainBodyTmpl = require("./commetBody.dot"),
        MainLiTmpl = require("./commetLi.dot");
    /**
     * @desc Comment 类
     * @param cfg 参数
     */
    var Comments = function (cfg) {
        var self = this;
        if (cfg) {
            $.extend(true, self, cfg);
        }
        self.dataUrl += "&projectTag=chujing";
        
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
            productId: 200442,
            productType: 1,
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
     * @desc 头部评论初始
     * @param cfg 参数
     */
    FN.initTop = function (cfg) {
        var self = this;
        if(cfg){
            $.extend(true, self, cfg);
        }
        self.topData = {
            List: [],
            unhandle:[]
        };
        self.topIndex = 0;//伪翻页序值

        // 超级自由行初始化请求异步，跟团和自由行初始化不请求
        if($("#hidIsFreeTravel")&&$("#hidIsFreeTravel").val()=="1"){
            self.topDataRender(self.topIndex, function () {});
        }
        // 
        self.topEvents();
    };
    /**
     * @desc 头部评论数据整理函数可重写
     * @param cfg 参数
     */
    FN.topCacheData = function (data) {
        var self = this;
        var countData = data.Count,
            bodyData = data.List,
            retData = self.topData,
            feedBack;
        if (bodyData && bodyData.length) {
            for (var i = 0, len = bodyData.length - 1; i <= len; i++) {
                feedBack = bodyData[i].Comment;
                if (feedBack.length > 110) {
                    feedBack = feedBack.substr(0, 110) + "...";
                }
                retData.List.push(feedBack);
                retData.unhandle.push(bodyData[i].Comment);
            }
        }
        if (countData && countData.length) {
            retData.Satisfaction = countData[0].Satisfaction;
        }
        retData.Count = data.Count[0].All;
    };
    /**
     * @desc 头部评论绘制
     * @param cfg 参数
     */
    FN.topRender = function (index) {
        var self = this,
            data = self.topData;
        //
        var dpContent = data.List[index],
            oldDpContent = data.unhandle[index],
            itemData = {
                feedBack: dpContent,
                oldFeedBack:oldDpContent,
                total: data.Count,
                Satisfaction:data.Satisfaction
            },
            len = data.List.length;
        if (index === 0) {
            itemData.prevCls = "disable";
        }
        if (index >= data.Count - 1) {
            itemData.nextCls = "disable";
        }
        self.topEl.html(TopTmpl(itemData));
    };
    /**
     * @desc 头部评论获取数据并渲染
     * @param cfg 参数
     */
    FN.topDataRender = function (index, callback) {
        var self = this;
        //
        //当翻到第二页切数据为零时渲染 noresult
        if ((self.topData.Count === 0) && self.topParam.page > 1) {
            self.topEl.empty().append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
            return;
        }
        //异步获取点评数据
        if (!self.topData.List[index]) {
            if (self.isTopGetting) return;
            self.isTopGetting = true;
            $.ajax({
                url: self.dataUrl,
                data: self.topParam,
                dataType: "json",
                success: function (data) {
                    self.isTopGetting = false;
                    self.topParam.page++;
                    //
                    if(data && data.Data && data.Data.CommentList){
                        self.topCacheData(data.Data.CommentList);
                        self.topDataRender(index, callback);
                    }
                    
                },
                error: function () {
                }
            });
            return;
        }
        
        //真实渲染
        self.topRender(index);
        callback && callback.call(self);
    };
    /**
     * @desc 头部评论事件绑定
     * @param cfg 参数
     */
    FN.topEvents = function () {
        var self = this;
        $(document).on("click", ".J-prev,.J-next", function (e) {
            var el = $(this);
            if (el.hasClass("disable")) {
                return;
            }
            if (el.hasClass("J-next")) {
                self.topDataRender(++self.topIndex);
            } else {
                self.topDataRender(--self.topIndex);
            }
            e.preventDefault();
        });
    };
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
        var AllCount =parseInt($("#hidCommetCount").val());
        if(cfg){
            self = $.extend(true, self, cfg);
        }
        // 初始化主体点评
        if($("#hidIsFreeTravel")&&$("#hidIsFreeTravel").val()=="1"){
            self.getData( self.extraParam, function (data) {
                self.mainRender(data);
            });
        }
        
        
        self.mainEvents();
        self.mainBind();
        self.renderPager($.extend({total: AllCount},{param:self.extraParam}));
        __ComLog.warp(function(){
            this.lineid = self.mainParam.productId;
            this.pagtype = 1;
            this.cityid = $("#hidLocatedStartCityId").val() || 321;
            //
            this.tagid = 1;
            this.tagtype = 0;
        });
    };
    /**
     * @desc 获取数据
     * @param cfg 参数
     */
    FN.getData = function (param, callback,beforeCb) {
        var self = this;
        //
        beforeCb && beforeCb.call();
        //
        var _param = $.extend({}, self.mainParam, param);
        $.ajax({
            url: self.dataUrl,
            data: _param,
            dataType: "json",
            success: function (data) {
                if (data && data.Data && data.Data.CommentList) {
                    callback && callback.call(self,data.Data.CommentList);
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
        // 可以注释掉
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
            var tagid = Jslef.attr("data-tagId"),
                extraParam = $.extend({} ,self.extraParam, {"tagId": tagid}),
                param = $.extend({}, self.mainParam, extraParam);
            //
            self.getData(param ,function(data){
                self.render(data, "", true);
                self.renderPager({
                    total: count || 0,
                    param: extraParam
                });
            },function(){
                $(".comm-content ul").html('<li class="comm-loading"><div class="bg"></div><span>请稍候,用户点评正在加载中...</span></li>');
            });
            e.preventDefault();
    
            //
            __ComLog.warp(function(){
                this.tagid = Jslef.attr('data-tagid');
                this.tagtype = Jslef.attr('data-tagtype');
                //
                this.log("dppage_sel",
                    "^chujing" +
                    "^"+this.lineid+
                    "^"+this.tagid+
                    "^a,"+this.tagtype+
                    "^1"+
                    "^");
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
            var tagid = Jslef.attr("data-tagId"),
                extraParam = $.extend({} ,self.extraParam, {"tagId": tagid}),
                param = $.extend({}, self.mainParam, extraParam);
            //
            self.getData(param ,function(data){
                self.render(data, "", true);
                self.renderPager({
                    total: count || 0,
                    param: extraParam
                });
            },function(){
                $(".comm-content ul").html('<li class="comm-loading"><div class="bg"></div><span>请稍候,用户点评正在加载中...</span></li>');
            });
            e.preventDefault();
    
            //
            __ComLog.warp(function(){
                this.tagid = Jslef.attr('data-tagid');
                this.tagtype = Jslef.attr('data-tagtype');
                //
                this.log("dppage_sel",
                    "^chujing" +
                    "^"+this.lineid+
                    "^"+this.tagid+
                    "^a,"+this.tagtype+
                    "^1"+
                    "^");
            });
        });
        //排序
        $("#filter-sort").on("click", 'a',function () {
            var Jslef = $(this)
            var sortType = Jslef.attr("data-sorttype"),
                extraParam = $.extend({} ,self.extraParam, {"sortType":sortType}),
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
            },function(){
                $(".comm-content ul").html('<li class="comm-loading"><div class="bg"></div><span>请稍候,用户点评正在加载中...</span></li>');
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
                if (el.hasClass("busying") || el.hasClass("disables")) {
                    return;
                }

                el.addClass("busying");

                var commentId = el.attr("data-cometid"),
                    dpId = el.attr("data-resId") || "0",
                    url = self.usefulUrl + "?projectTag=dujia&ifGood=1&MemberId=" + memberId + "&wmGuid=" + commentId + "&dpId=" + dpId,
                    bEl = el.find("b"),
                    bText = bEl.text() - 0;
                $.ajax({
                    url: url,
                    dataType: "json",
                    success: function (data) {

                        el.removeClass("busying");

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
    
            //
            __ComLog.warp(function(){
                var liindex = el.parents(".commli").index();
                //
                var pageid = $("#J_CometPager .current").attr("data-num")
                this.log("dppage_zan",
                    "^chujing" +
                    "^1" +
                    "^"+1+
                    "^"+liindex+
                    "^"+this.lineid+
                    "^a,"+this.tagtype+"^");
            });
            
            
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
    
                        __ComLog.warp(function(){
                            //
                            var pageid = $("#J_CometPager .current").attr("data-num")
                            this.log("dppage_load",
                                "^chujing" +
                                "^"+this.tagid+
                                "^a,"+this.tagtype+
                                "^"+pageid+"^");
                        });
                    }
                },
                initLoad: false
            });
        } else {
            $("#J_CometPager").empty();
        }
    
        __ComLog.warp(function(){
            //
            var pageid = $("#J_CometPager .current").attr("data-num")
            this.log("dppage_load",
                "^chujing" +
                "^"+this.tagid+
                "^a,"+this.tagtype+
                "^"+pageid+"^");
        });
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
   
    FN.commentLazy =  function () {
        $(".photo-detail img").each(function(index, item) {
            var imgUrl = Common.setImageSize($(item).attr("data-img"), "640x360");
            $(item).attr("data-img", imgUrl);
        });
        var imgList = $(".photo-detail img").not("[data-img-loaded]");
        $("body").trigger("addElements", imgList);
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
                        self.commentLazy();
                        //content.find(".photo-mslide
                        // li").siblings().removeClass("active").eq(0).addClass("active"); }); if (!self.isInitCar)
                        // { self.carousel(content); self.isInitCar = true; }
                    },
                    onclose: function () {
                    }
                });
            }
            self.dialog.showModal();
    
            var Jself = $(this);
            //
            __ComLog.warp(function(){
                var index = Jself.index(),
                    liindex = Jself.parents(".commli").index();
                this.log("dppage_pic",
                    "^chujing" +
                    "^1" +
                    "^"+index+
                    "^"+liindex+
                    "^"+this.lineid+
                    "^a,"+this.tagtype+"^");
            });
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
});